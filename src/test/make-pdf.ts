/**
 * Synthetic resume PDFs for tests: raw PDF with Helvetica text at absolute positions. The persona is
 * fictitious. No real person's resume is ever used as a fixture.
 */
export interface PdfItem {
  x: number
  y: number
  size: number
  text: string
}

const esc = (t: string) =>
  [...t]
    .map((ch) =>
      ch === "•"
        ? "\\225"
        : ch === "–"
          ? "\\226"
          : ch === "—"
            ? "\\227"
            : "()\\".includes(ch)
              ? `\\${ch}`
              : ch
    )
    .join("")

export function makePdf(
  items: PdfItem[],
  width = 595,
  height = 842
): Uint8Array {
  const content = items
    .map((i) => `BT /F1 ${i.size} Tf ${i.x} ${i.y} Td (${esc(i.text)}) Tj ET\n`)
    .join("")
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>`,
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ]
  let out = "%PDF-1.4\n"
  const offsets: number[] = []
  objs.forEach((o, i) => {
    offsets.push(out.length)
    out += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const xref = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
  out += offsets
    .map((o) => `${String(o).padStart(10, "0")} 00000 n \n`)
    .join("")
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Uint8Array.from(out, (c) => c.charCodeAt(0) & 0xff)
}

export const PERSONA = {
  name: "Asha Verma",
  contact: "asha.verma@example.com | +00 00000 00000 | Exampletown",
  summary: [
    "Backend developer with experience building REST services and dashboards.",
    "Comfortable with Java, Spring Boot and SQL.",
  ],
  skills: [
    ["Languages", "Java, JavaScript, SQL"],
    ["Frameworks", "Spring Boot, React, Hibernate"],
    ["Tools", "Git, Docker, Jenkins, Postman"],
  ] as [string, string][],
  jobs: [
    {
      role: "Software Engineer",
      company: "Example Tech Ltd",
      dates: "Jan 2022 – Present",
      bullets: [
        "Built REST APIs with Spring Boot for the order service.",
        "Reduced report load time by optimising SQL queries.",
        "Mentored two interns on code reviews.",
      ],
    },
    {
      role: "Junior Developer",
      company: "Sample Systems Pvt Ltd",
      dates: "Jun 2020 – Dec 2021",
      bullets: [
        "Maintained a React dashboard for internal users.",
        "Wrote unit tests with JUnit.",
      ],
    },
  ],
  projects: [
    {
      name: "Inventory Tracker",
      tech: "Java, Spring Boot, MySQL, React",
      bullets: [
        "Stock management app with role-based login.",
        "Deployed with Docker on a test server.",
      ],
    },
    {
      name: "Expense Planner",
      tech: "JavaScript, Node.js, MongoDB",
      bullets: ["Personal budgeting web app with charts."],
    },
  ],
  education: [
    [
      "B.Tech in Computer Science",
      "Example Institute of Technology",
      "2016 – 2020",
    ],
  ] as [string, string, string][],
  certs: ["Example Cloud Practitioner"],
}

type Heads = {
  summary: string
  skills: string
  exp: string
  proj: string
  edu: string
  cert: string
}
export const HEADS_CAPS: Heads = {
  summary: "PROFESSIONAL SUMMARY",
  skills: "TECHNICAL SKILLS",
  exp: "WORK EXPERIENCE",
  proj: "PROJECTS",
  edu: "EDUCATION",
  cert: "CERTIFICATIONS",
}
export const HEADS_TITLE: Heads = {
  summary: "Objective",
  skills: "Core Competencies",
  exp: "Experience",
  proj: "Key Projects",
  edu: "Academic Background",
  cert: "Certifications",
}
type J = (typeof PERSONA.jobs)[number]
export const FORMAT = {
  pipe: (j: J) => `${j.role} | ${j.company}   ${j.dates}`,
  comma: (j: J) => `${j.company}, ${j.role}  (${j.dates})`,
  slash: (j: J) =>
    `${j.role} at ${j.company}  ` +
    j.dates
      .replace("Jan 2022", "01/2022")
      .replace("Jun 2020", "06/2020")
      .replace("Dec 2021", "12/2021")
      .replace("–", "-"),
}

/** One column: caps or title-case headings, a bullet marker and a job-header format. */
export function singleColumn(
  heads: Heads,
  bullet: string,
  header: (j: J) => string
) {
  let y = 800
  const items: PdfItem[] = []
  const line = (text: string, size = 10, x = 50, dy = 14) => {
    items.push({ x, y, size, text })
    y -= dy
  }
  line(PERSONA.name, 18, 50, 22)
  line(PERSONA.contact, 9, 50, 20)
  line(heads.summary, 12, 50, 16)
  PERSONA.summary.forEach((t) => line(t))
  y -= 6
  line(heads.skills, 12, 50, 16)
  PERSONA.skills.forEach(([k, v]) => line(`${k}: ${v}`))
  y -= 6
  line(heads.exp, 12, 50, 16)
  for (const j of PERSONA.jobs) {
    line(header(j))
    j.bullets.forEach((b) => line(`${bullet} ${b}`, 10, 60))
    y -= 4
  }
  line(heads.proj, 12, 50, 16)
  for (const p of PERSONA.projects) {
    line(p.name, 11)
    line(`Technologies: ${p.tech}`, 9)
    p.bullets.forEach((b) => line(`${bullet} ${b}`, 10, 60))
    y -= 4
  }
  line(heads.edu, 12, 50, 16)
  for (const [d, s, yrs] of PERSONA.education) line(`${d}, ${s}  ${yrs}`)
  line(heads.cert, 12, 50, 16)
  PERSONA.certs.forEach((c) => line(`${bullet} ${c}`, 10, 60))
  return makePdf(items)
}

/** Two columns painted row by row (left and right items interleaved), the order many templates use. */
export function twoColumns() {
  const left: [string, number][] = [
    ["TECHNICAL SKILLS", 12],
    ...PERSONA.skills.map(([k, v]) => [`${k}: ${v}`, 9] as [string, number]),
    ["EDUCATION", 12],
    [PERSONA.education[0][0], 9],
    [PERSONA.education[0][1], 9],
    [PERSONA.education[0][2], 9],
    ["CERTIFICATIONS", 12],
    [`• ${PERSONA.certs[0]}`, 9],
  ]
  const right: [string, number][] = [
    ["PROFESSIONAL SUMMARY", 12],
    ...PERSONA.summary.map((t) => [t, 10] as [string, number]),
    ["WORK EXPERIENCE", 12],
  ]
  for (const j of PERSONA.jobs) {
    right.push([FORMAT.pipe(j), 10])
    j.bullets.forEach((b) => right.push([`• ${b}`, 10]))
  }
  right.push(["PROJECTS", 12])
  for (const p of PERSONA.projects) {
    right.push([p.name, 11], [`Technologies: ${p.tech}`, 9])
    p.bullets.forEach((b) => right.push([`• ${b}`, 10]))
  }
  const items: PdfItem[] = [
    { x: 40, y: 800, size: 18, text: PERSONA.name },
    { x: 40, y: 780, size: 9, text: PERSONA.contact },
  ]
  const rows = Math.max(left.length, right.length)
  for (let r = 0; r < rows; r++) {
    const y = 750 - r * 15
    if (left[r]) items.push({ x: 40, y, size: left[r][1], text: left[r][0] })
    if (right[r])
      items.push({ x: 230, y, size: right[r][1], text: right[r][0] })
  }
  return makePdf(items)
}

/** Company on its own line with right-aligned dates, role on the next line, bullets wrapped over two lines. */
export function stacked() {
  let y = 800
  const items: PdfItem[] = []
  const line = (text: string, size = 10, x = 50, dy = 14) => {
    items.push({ x, y, size, text })
    y -= dy
  }
  line(PERSONA.name, 18, 50, 22)
  line(PERSONA.contact, 9, 50, 20)
  line("PROFESSIONAL SUMMARY", 12, 50, 16)
  PERSONA.summary.forEach((t) => line(t))
  y -= 6
  line("TECHNICAL SKILLS", 12, 50, 16)
  PERSONA.skills.forEach(([k, v]) => line(`${k}: ${v}`))
  y -= 6
  line("WORK EXPERIENCE", 12, 50, 16)
  for (const j of PERSONA.jobs) {
    items.push({ x: 50, y, size: 11, text: j.company })
    items.push({ x: 440, y, size: 10, text: j.dates })
    y -= 14
    line(j.role)
    for (const b of j.bullets) {
      const cut = b.lastIndexOf(" ", Math.floor(b.length / 2))
      line(`• ${b.slice(0, cut)}`, 10, 60)
      line(b.slice(cut + 1), 10, 68)
    }
    y -= 4
  }
  line("PROJECTS", 12, 50, 16)
  for (const p of PERSONA.projects) {
    line(p.name, 11)
    line(`Technologies: ${p.tech}`, 9)
    p.bullets.forEach((b) => line(`• ${b}`, 10, 60))
    y -= 4
  }
  line("EDUCATION", 12, 50, 16)
  for (const [d, s, yrs] of PERSONA.education) line(`${d}, ${s}  ${yrs}`)
  return makePdf(items)
}

/** Headings the dictionary does not know. */
export function unknownHeadings() {
  let y = 800
  const items: PdfItem[] = []
  const line = (text: string, size = 10, x = 50, dy = 14) => {
    items.push({ x, y, size, text })
    y -= dy
  }
  line(PERSONA.name, 18, 50, 22)
  line(PERSONA.contact, 9, 50, 20)
  line("WHO I AM", 12, 50, 16)
  PERSONA.summary.forEach((t) => line(t))
  y -= 6
  line("WHAT I KNOW", 12, 50, 16)
  PERSONA.skills.forEach(([k, v]) => line(`${k}: ${v}`))
  y -= 6
  line("WHERE I HAVE BEEN", 12, 50, 16)
  for (const j of PERSONA.jobs) {
    line(FORMAT.pipe(j))
    j.bullets.forEach((b) => line(`• ${b}`, 10, 60))
    y -= 4
  }
  line("PROJECTS", 12, 50, 16)
  for (const p of PERSONA.projects) {
    line(p.name, 11)
    line(`Technologies: ${p.tech}`, 9)
    p.bullets.forEach((b) => line(`• ${b}`, 10, 60))
  }
  return makePdf(items)
}

export const noTextPdf = () => makePdf([])
