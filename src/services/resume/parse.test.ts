// @vitest-environment node
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"
import { describe, expect, it } from "vitest"
import {
  FORMAT,
  HEADS_CAPS,
  HEADS_TITLE,
  PERSONA,
  noTextPdf,
  singleColumn,
  stacked,
  twoColumns,
  unknownHeadings,
} from "@/test/make-pdf"
import {
  ResumeReadError,
  readDocument,
  type PdfDocumentLike,
} from "./pdf-reader"
import { parseResume, textToLines } from "./parse"

async function read(data: Uint8Array, columnAware = true) {
  const task = pdfjs.getDocument({
    data: data.slice(), // pdf.js takes ownership of the buffer it is given
    disableFontFace: true,
    useSystemFonts: false,
    verbosity: 0,
  })
  const doc = await task.promise
  try {
    return await readDocument(doc as unknown as PdfDocumentLike, columnAware)
  } finally {
    void task.destroy()
  }
}
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

/** How many of the persona's facts the draft got right. */
function recovered(p: ReturnType<typeof parseResume>["profile"]) {
  let fields = 0
  let bullets = 0
  PERSONA.jobs.forEach((j, i) => {
    const g = p.experiences[i]
    if (!g) return
    if (norm(g.company) === norm(j.company)) fields++
    if (norm(g.role) === norm(j.role)) fields++
    if (g.start && g.end) fields += 2
    bullets += j.bullets.filter((b) =>
      g.bullets.some((x) => norm(x.text) === norm(b))
    ).length
  })
  let names = 0
  let tech = 0
  let projectBullets = 0
  PERSONA.projects.forEach((pr, i) => {
    const g = p.projects[i]
    if (!g) return
    if (norm(g.name) === norm(pr.name)) names++
    tech += pr.tech
      .split(", ")
      .filter((t) => g.technologies.map(norm).includes(norm(t))).length
    projectBullets += pr.bullets.filter((b) =>
      g.bullets.some((x) => norm(x.text) === norm(b))
    ).length
  })
  const wanted = PERSONA.skills.flatMap(([, v]) => v.split(", "))
  const got = new Set(p.skills.map((s) => norm(s.name)))
  return {
    jobs: p.experiences.length,
    fields,
    bullets,
    projects: p.projects.length,
    names,
    tech,
    projectBullets,
    skills: wanted.filter((s) => got.has(norm(s))).length,
    summary: p.summary.length > 20,
    education: p.education.length > 0,
    certs: p.certifications.length > 0,
  }
}
const FULL = {
  jobs: 2,
  fields: 8,
  bullets: 5,
  projects: 2,
  names: 2,
  tech: 7,
  projectBullets: 3,
  skills: 10,
  summary: true,
  education: true,
  certs: true,
}

describe("reading synthetic resume PDFs (a fictitious persona)", () => {
  it("recovers every field from a single column with capital headings, bullets and 'Role | Company'", async () => {
    const r = await read(singleColumn(HEADS_CAPS, "•", FORMAT.pipe))
    expect(r.columns).toBe(1)
    expect(recovered(parseResume(r.lines).profile)).toEqual(FULL)
  })

  it("recovers every field with title-case headings, '-' bullets and 'Company, Role (dates)'", async () => {
    const r = await read(singleColumn(HEADS_TITLE, "-", FORMAT.comma))
    expect(recovered(parseResume(r.lines).profile)).toEqual(FULL)
  })

  it("recovers every field with '*' bullets and numeric dates in 'Role at Company' headers", async () => {
    const r = await read(singleColumn(HEADS_CAPS, "*", FORMAT.slash))
    expect(recovered(parseResume(r.lines).profile)).toEqual(FULL)
  })

  it("reads two interleaved columns as two columns, and recovers nothing useful if read as one", async () => {
    const pdf = twoColumns()
    const aware = await read(pdf, true)
    expect(aware.columns).toBe(2)
    expect(recovered(parseResume(aware.lines).profile)).toEqual(FULL)
    const naive = await read(pdf, false)
    expect(naive.columns).toBe(1)
    const r = recovered(parseResume(naive.lines).profile)
    expect(r.jobs).toBe(0)
    expect(r.skills).toBe(0)
  })

  it("finds company, role and dates when the company and dates share a line and the role is on the next, and rejoins wrapped bullets", async () => {
    const r = await read(stacked())
    const got = recovered(parseResume(r.lines).profile)
    expect(got).toMatchObject({ jobs: 2, bullets: 5, projects: 2, skills: 10 })
    expect(got.fields).toBe(8)
  })

  it("keeps a heading the dictionary does not know as its own 'other' section with its lines, never mixed into another section", async () => {
    const r = await read(unknownHeadings())
    const { profile, counts } = parseResume(r.lines)
    const got = recovered(profile)
    expect(got.jobs).toBe(0)
    expect(got.skills).toBe(0)
    expect(profile.other.map((o) => o.heading)).toEqual([
      "WHO I AM",
      "WHAT I KNOW",
      "WHERE I HAVE BEEN",
    ])
    expect(profile.other[2].text).toContain("Example Tech Ltd")
    expect(profile.other[1].text).toContain("Java")
    expect(counts.unplaced).toBe(0)
    expect(got.projects).toBe(2) // PROJECTS is a known heading, so that part still works
  })

  it("says plainly when a PDF has no selectable text", async () => {
    await expect(read(noTextPdf())).rejects.toMatchObject({
      code: "no-text",
      message:
        "This PDF has no selectable text. Paste your resume text instead.",
    })
    await expect(read(noTextPdf())).rejects.toBeInstanceOf(ResumeReadError)
  })
})

describe("bullets whose marker did not survive reading", () => {
  const jobs = [
    "EXPERIENCE",
    "Software Engineer | Example Tech Ltd   Jan 2022 - Present",
    "Built REST APIs with Spring Boot for the order service.",
    "Reduced report load time by optimising SQL queries and adding caching to the busiest reports.",
    "Junior Developer | Sample Systems Pvt Ltd   Jun 2020 - Dec 2021",
    "Maintained a React dashboard for internal users.",
    "PROJECTS",
    "Inventory Tracker",
    "Technologies: Java, MySQL",
    "Stock management app with role-based login for the warehouse team.",
    "Deployed with Docker on a test server.",
    "Expense Planner",
    "Technologies: Node.js",
    "Personal budgeting web app with charts and monthly summaries.",
  ]

  it("treats sentences after a complete job or project header as bullets, not as unplaced text or new projects", () => {
    const { profile, counts } = parseResume(jobs)
    expect(profile.experiences.map((j) => j.bullets.length)).toEqual([2, 1])
    // a long first line under a project is its description; the later sentence is a bullet
    expect(profile.projects.map((p) => p.bullets.length)).toEqual([1, 0])
    expect(profile.projects.every((p) => p.description.length > 0)).toBe(true)
    expect(profile.projects.map((p) => p.name)).toEqual([
      "Inventory Tracker",
      "Expense Planner",
    ])
    expect(counts.unplaced).toBe(0)
  })

  it("accepts private-use and stray symbol-font glyphs as bullet markers", () => {
    for (const glyph of ["\uF0B7", "\uF0A7", "\u00A7", "\u00D8"]) {
      const { profile } = parseResume([
        "EXPERIENCE",
        "Software Engineer | Example Tech Ltd   Jan 2022 - Present",
        `${glyph} Built REST APIs with Spring Boot.`,
        `${glyph} Wrote unit tests.`,
      ])
      expect(
        profile.experiences[0].bullets.map((b) => b.text),
        glyph
      ).toEqual(["Built REST APIs with Spring Boot.", "Wrote unit tests."])
    }
  })

  it("still reads a short line after the dates as the role or company when the header is incomplete", () => {
    const { profile } = parseResume([
      "EXPERIENCE",
      "Mar 2021 - Present",
      "Example Analytics Ltd",
      "Data Analyst",
    ])
    expect(profile.experiences[0]).toMatchObject({
      company: "Example Analytics Ltd",
      role: "Data Analyst",
    })
  })
})

describe("sections that are not used for questions", () => {
  const lines = [
    "TECHNICAL SKILLS",
    "Languages: Java, SQL",
    "INTERESTS",
    "Chess, open source",
    "LANGUAGES",
    "English, Hindi",
    "CERTIFICATES OF MERIT",
    "Won an inter-college quiz",
    "EXPERIENCE",
    "Intern | Example Labs   Jun 2023 - Aug 2023",
  ]

  it("keeps Interests and Languages in 'other', not in unplaced, and out of the skills and the questions", () => {
    const { profile, counts } = parseResume(lines)
    expect(profile.other.map((o) => o.heading)).toEqual([
      "INTERESTS",
      "LANGUAGES",
      "CERTIFICATES OF MERIT",
    ])
    expect(profile.other[0].text).toBe("Chess, open source")
    expect(profile.other[1].text).toBe("English, Hindi")
    expect(counts.unplaced).toBe(0)
    // the skills section is not polluted by what follows it, and "Languages:" inside it is still a skills group
    expect(profile.skills.map((s) => s.name)).toEqual(["Java", "SQL"])
    expect(profile.skills.every((s) => s.group === "Languages")).toBe(true)
  })

  it("opens a new other section for a heading-like line instead of joining the previous section", () => {
    const { profile } = parseResume(lines)
    expect(profile.other[2]).toMatchObject({
      heading: "CERTIFICATES OF MERIT",
      text: "Won an inter-college quiz",
    })
    expect(profile.experiences).toHaveLength(1)
  })

  it("treats Internships, Training and Awards headings as experience, certifications and achievements", () => {
    const { profile } = parseResume([
      "INTERNSHIPS",
      "Intern | Example Labs   Jun 2023 - Aug 2023",
      "- Wrote small scripts for the team.",
      "TRAINING",
      "Example Java Course",
      "AWARDS",
      "Best project in the final year",
    ])
    expect(profile.experiences).toHaveLength(1)
    expect(profile.experiences[0].bullets).toHaveLength(1)
    expect(profile.certifications.map((c) => c.text)).toEqual([
      "Example Java Course",
    ])
    expect(profile.achievements.map((c) => c.text)).toEqual([
      "Best project in the final year",
    ])
  })
})

describe("parsing pasted text", () => {
  const text = [
    "SUMMARY",
    "Data analyst who enjoys dashboards.",
    "SKILLS",
    "Python, SQL, Excel",
    "EXPERIENCE",
    "Data Analyst",
    "Example Analytics Ltd",
    "Mar 2021 - Present",
    "- Built weekly reports for the sales team.",
    "PROJECTS",
    "Sales Dashboard",
    "Tools: Python, SQL",
    "- Charts of monthly sales.",
  ]

  it("works from plain text with the role and company on separate lines and the dates alone", () => {
    const { profile, counts } = parseResume(text)
    expect(counts).toMatchObject({ jobs: 1, projects: 1 })
    expect(profile.experiences[0]).toMatchObject({
      company: "Example Analytics Ltd",
      role: "Data Analyst",
      start: "Mar 2021",
      end: "Present",
    })
    expect(profile.experiences[0].bullets[0].text).toBe(
      "Built weekly reports for the sales team."
    )
    expect(profile.skills.map((s) => s.name)).toEqual([
      "Python",
      "SQL",
      "Excel",
    ])
    expect(profile.projects[0].technologies).toEqual(["Python", "SQL"])
  })

  it("splits a header into role and company by the role word, whichever order they come in", () => {
    for (const header of [
      "Backend Developer | Example Ltd  2020 - 2022",
      "Example Ltd | Backend Developer  2020 - 2022",
      "Example Ltd - Backend Developer  2020 - 2022",
    ]) {
      const { profile } = parseResume(["EXPERIENCE", header])
      expect(profile.experiences[0], header).toMatchObject({
        company: "Example Ltd",
        role: "Backend Developer",
      })
    }
  })

  it("accepts a .txt style paste with Windows line endings and gives every item its own uid", () => {
    const { profile } = parseResume(textToLines(text.join("\r\n")))
    const uids = [
      ...profile.skills.map((s) => s.uid),
      ...profile.experiences.flatMap((e) => [
        e.uid,
        ...e.bullets.map((b) => b.uid),
      ]),
      ...profile.projects.map((p) => p.uid),
    ]
    expect(new Set(uids).size).toBe(uids.length)
  })
})
