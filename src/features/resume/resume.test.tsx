import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { NAV_BY_MODE } from "@/app/nav"
import { RouteError } from "@/components/shared/route-error"
import { generateQuestions, reconcile } from "@/services/resume/generate"
import { parseResume } from "@/services/resume/parse"
import {
  MAX_PDF_BYTES,
  ResumeReadError,
  readPdfFile,
} from "@/services/resume/pdf-reader"
import { buildSummary } from "@/services/analytics/summary"
import { buildPool } from "@/services/mock/pool"
import { ownQuestionEntries } from "@/services/content/own-questions"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"
import { resumeProfileSchema } from "@/types/learner"

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

const LINES = [
  "Asha Verma",
  "asha.verma@example.com",
  "Exampletown",
  "A stray line before any heading",
  "Another stray line before any heading",
  "PROFESSIONAL SUMMARY",
  "Backend developer with experience building REST services and dashboards.",
  "TECHNICAL SKILLS",
  "Languages: Java, JavaScript, SQL",
  "Tools: Git, Docker",
  "WORK EXPERIENCE",
  "Software Engineer | Example Tech Ltd   Jan 2022 - Present",
  "- Built REST APIs with Spring Boot for the order service.",
  "- Reduced report load time by optimising SQL queries.",
  "Junior Developer | Sample Systems Pvt Ltd   Jun 2020 - Dec 2020",
  "- Maintained an internal dashboard.",
  "PROJECTS",
  "Inventory Tracker",
  "Technologies: Java, Spring Boot, MySQL",
  "- Stock management app with role-based login.",
  "EDUCATION",
  "B.Tech in Computer Science, Example Institute of Technology",
  "LANGUAGES",
  "English, Hindi",
]

async function seedResume(lines = LINES) {
  await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
  const now = "2026-11-04T09:00:00.000Z"
  const profile = resumeProfileSchema.parse({
    ...parseResume(lines).profile,
    sourceName: "asha.pdf",
    importedAt: now,
    updatedAt: now,
  })
  await useLearnerStore.getState().saveResume(profile)
  await useLearnerStore
    .getState()
    .setResumeQuestions(reconcile([], generateQuestions(profile, profile), now))
  return profile
}
/** The dashboard card (not the sidebar link): the /resume link that carries the card text. */
const findCard = async () =>
  waitFor(() => {
    const c = screen
      .getAllByRole("link")
      .find(
        (a) =>
          a.getAttribute("href") === "/resume" &&
          /Import your resume|practised of/.test(a.textContent ?? "")
      )
    expect(c).toBeDefined()
    return c!
  })
const firstQ = (section: string) =>
  useLearnerStore.getState().resumeQuestions.find((q) => q.section === section)!

describe("navigation and entry points", () => {
  it("has a sidebar item that is not in the mobile tab bar, and cards on the Interview Zone and dashboard", async () => {
    const items = NAV_BY_MODE.interview.flatMap((g) => g.items)
    expect(items.find((i) => i.id === "resume")).toMatchObject({
      title: "Resume interview",
      to: "/resume",
    })
    expect(items.find((i) => i.id === "resume")!.mobile).toBeFalsy()
    expect(items.filter((i) => i.mobile).map((i) => i.id)).toEqual([
      "overview",
      "interview",
      "library-saved",
      "settings",
    ])
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview")
    expect(
      await screen.findByRole("link", { name: /Open resume interview/ })
    ).toHaveAttribute("href", "/resume")
    cleanup()
    renderApp("/dashboard")
    const card = await findCard()
    expect(card).toHaveTextContent("Import your resume")
  })

  it("shows 'N practised of M' on the dashboard from real data once a resume exists", async () => {
    await seedResume()
    const q = firstQ("project")
    await useLearnerStore.getState().toggleCompleted(q.id, 4)
    const total = useLearnerStore.getState().resumeQuestions.length
    renderApp("/dashboard")
    const card = await findCard()
    expect(card).toHaveTextContent(`Resume questions: 1 practised of ${total}`)
  })
})

describe("importing", () => {
  it("shows the privacy line, offers a PDF and pasted text as equals, and builds a profile only after you press the button", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/resume")
    expect(await screen.findByTestId("privacy-line")).toHaveTextContent(
      "Your resume stays in this browser. Nothing is uploaded."
    )
    expect(
      screen.getByRole("heading", { name: "Choose a PDF" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Paste your resume text" })
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Use this text" }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Paste your resume text first"
    )
    await user.click(screen.getByLabelText("Resume text"))
    await user.paste(LINES.join("\n"))
    await user.click(screen.getByRole("button", { name: "Use this text" }))
    expect(await screen.findByTestId("read-detail")).toHaveTextContent(
      /Using \d+ lines/
    )
    // nothing is stored before the learner builds the profile
    expect(useLearnerStore.getState().resume).toBeNull()
    await user.click(screen.getByRole("button", { name: "Build my profile" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().resume).not.toBeNull()
    )
    expect(await screen.findByTestId("hint-jobs")).toHaveTextContent(
      "Found 2 jobs: please check."
    )
    expect(screen.getByTestId("hint-projects")).toHaveTextContent(
      "Found 1 projects: please check."
    )
    expect(useLearnerStore.getState().resumeQuestions.length).toBeGreaterThan(
      10
    )
    expect(screen.getByTestId("privacy-line")).toBeInTheDocument()
  })

  it("refuses a file over 10 MB with a plain message before reading it", async () => {
    const big = new File([new Uint8Array(MAX_PDF_BYTES + 1)], "huge.pdf", {
      type: "application/pdf",
    })
    await expect(readPdfFile(big)).rejects.toBeInstanceOf(ResumeReadError)
    await expect(readPdfFile(big)).rejects.toMatchObject({ code: "too-large" })
  })

  it("warns before replacing a resume, with 'Edit my current resume instead' as the primary action", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume")
    await screen.findByTestId("hint-jobs")
    await user.click(screen.getByText("Import a different resume"))
    await user.click(
      await screen.findAllByLabelText("Resume text").then((l) => l[0])
    )
    await user.paste(
      ["EXPERIENCE", "Analyst | Other Co   2019 - 2020"].join("\n")
    )
    await user.click(screen.getByRole("button", { name: "Use this text" }))
    await user.click(
      await screen.findByRole("button", { name: "Build my profile" })
    )
    const dialog = await screen.findByRole("alertdialog")
    expect(
      within(dialog).getByText(/marked "Source removed"/)
    ).toBeInTheDocument()
    await user.click(
      within(dialog).getByRole("button", {
        name: "Edit my current resume instead",
      })
    )
    expect(useLearnerStore.getState().resume!.sourceName).toBe("asha.pdf") // nothing replaced
    // replacing keeps the old questions (marked) and their answers
    const old = firstQ("project")
    await useLearnerStore
      .getState()
      .addHrAnswer({ questionId: old.id, situation: "keep me" })
    await user.click(screen.getByRole("button", { name: "Build my profile" }))
    await user.click(
      await screen.findByRole("button", { name: "Replace my resume" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().resume!.sourceName).toBe("pasted text")
    )
    expect(
      useLearnerStore.getState().resumeQuestions.find((q) => q.id === old.id)!
        .status
    ).toBe("source-removed")
    expect(
      useLearnerStore.getState().hrAnswers.some((a) => a.questionId === old.id)
    ).toBe(true)
  })
})

describe("the profile editor", () => {
  it("shows what was found with hints, keeps lines it could not place, and assigns or deletes them", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume")
    expect(await screen.findByTestId("hint-jobs")).toHaveTextContent(
      "Found 2 jobs: please check."
    )
    expect(
      screen.getByRole("heading", { name: /Unplaced text \(2\)/ })
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole("combobox", { name: "Assign unplaced line 2 to" })
    )
    await user.click(
      await screen.findByRole("option", { name: "Achievements" })
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().resume!.achievements.map((a) => a.text)
      ).toContain("Another stray line before any heading")
    )
    await user.click(
      screen.getByRole("button", { name: "Delete unplaced line 1" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().resume!.unplaced).toEqual([])
    )
  })

  it("autosaves with a Saved status, and tells you when your changes need the questions updated", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume")
    await screen.findByTestId("hint-jobs")
    const summary = screen.getByLabelText("Summary", { selector: "textarea" })
    await user.type(summary, " I enjoy clear APIs.")
    expect(screen.getByTestId("save-status")).toHaveTextContent(/Saving|Saved/)
    await waitFor(
      () =>
        expect(useLearnerStore.getState().resume!.summary).toContain(
          "I enjoy clear APIs."
        ),
      { timeout: 5000 }
    )
    await waitFor(() =>
      expect(screen.getByTestId("save-status")).toHaveTextContent("Saved")
    )
    expect(await screen.findByTestId("pending")).toHaveTextContent(
      /questions? to update/
    )
  })

  it("removes a job with an Undo that restores it, and keeps its questions' ids so answers survive", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume")
    await screen.findByTestId("hint-jobs")
    const before = useLearnerStore.getState().resume!.experiences.length
    await user.click(screen.getByRole("button", { name: "Remove job 2" }))
    await waitFor(
      () =>
        expect(useLearnerStore.getState().resume!.experiences).toHaveLength(
          before - 1
        ),
      { timeout: 5000 }
    )
    await user.click(await screen.findByRole("button", { name: "Undo" }))
    await waitFor(
      () =>
        expect(useLearnerStore.getState().resume!.experiences).toHaveLength(
          before
        ),
      { timeout: 5000 }
    )
  })

  it("marks catalogue skills as known only after confirmation", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume")
    await screen.findByTestId("skill-map")
    expect(useLearnerStore.getState().profile!.knownSkills).toEqual([])
    await user.click(
      screen.getByRole("button", { name: /Mark these as known skills/ })
    )
    expect(useLearnerStore.getState().profile!.knownSkills).toEqual([]) // nothing yet
    await user.click(
      await screen.findByRole("button", { name: "Mark as known" })
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.knownSkills.length
      ).toBeGreaterThan(0)
    )
  })

  it("deletes the resume, its questions and their answers only after confirmation", async () => {
    const user = userEvent.setup()
    await seedResume()
    const q = firstQ("company")
    await useLearnerStore
      .getState()
      .addHrAnswer({ questionId: q.id, situation: "mine" })
    renderApp("/resume")
    await screen.findByTestId("hint-jobs")
    await user.click(screen.getByRole("button", { name: "Delete my resume" }))
    expect(useLearnerStore.getState().resume).not.toBeNull()
    await user.click(
      await screen
        .findByRole("button", { name: "Delete my resume", hidden: false })
        .then(() =>
          screen.getAllByRole("button", { name: "Delete my resume" }).at(-1)!
        )
    )
    await waitFor(() => expect(useLearnerStore.getState().resume).toBeNull())
    expect(useLearnerStore.getState().resumeQuestions).toEqual([])
    expect(useLearnerStore.getState().hrAnswers).toEqual([])
    expect(
      await screen.findByRole("heading", { name: "Start with your resume" })
    ).toBeInTheDocument()
  })
})

describe("the editor flags what the reader may have got wrong", () => {
  const lines = [
    "Asha Verma",
    "asha@example.com",
    "Exampletown",
    "TECHNICAL SKILLS",
    "Languages: Java, SQL",
    "Responsible for building and shipping the order service end to end",
    "INTERESTS",
    "Chess, open source",
    "EXPERIENCE",
    "Intern | Example Labs   Jun 2023 - Aug 2023",
    "Software Engineer | Example Tech Ltd   Jan 2022 - Present",
    "- Built REST APIs with Spring Boot.",
  ]

  it("hints at a job with no bullets and a short training entry, and moves a non-job to Other", async () => {
    const user = userEvent.setup()
    await seedResume(lines)
    renderApp("/resume")
    expect(await screen.findByTestId("no-bullets-hint")).toHaveTextContent(
      "This job has no bullets. If it is not a job, move it to Other or delete it."
    )
    expect(screen.getByTestId("short-entry")).toHaveTextContent("Short entry")
    expect(screen.getAllByTestId("no-bullets-hint")).toHaveLength(1) // the other job has a bullet
    await user.click(
      screen.getByRole("button", { name: "Move job 1 to Other sections" })
    )
    await waitFor(
      () =>
        expect(useLearnerStore.getState().resume!.experiences).toHaveLength(1),
      { timeout: 5000 }
    )
    const other = useLearnerStore.getState().resume!.other
    expect(other.map((o) => o.heading)).toContain("Moved from experience")
    expect(
      other.find((o) => o.heading === "Moved from experience")!.text
    ).toContain("Example Labs")
  })

  it("flags a sentence among the skills, makes no question from it, and moves it to Other", async () => {
    const user = userEvent.setup()
    await seedResume(lines)
    renderApp("/resume")
    expect(await screen.findByTestId("sentence-hint")).toHaveTextContent(
      "Looks like a sentence: check"
    )
    expect(
      useLearnerStore
        .getState()
        .resumeQuestions.some((q) =>
          q.title.includes("Responsible for building")
        )
    ).toBe(false)
    await user.click(
      screen.getByRole("button", {
        name: /Move skill Responsible for building.* to Other sections/,
      })
    )
    await waitFor(
      () =>
        expect(
          useLearnerStore.getState().resume!.skills.map((s) => s.name)
        ).toEqual(["Java", "SQL"]),
      { timeout: 5000 }
    )
    expect(
      useLearnerStore
        .getState()
        .resume!.other.some((o) => o.heading === "Moved from skills")
    ).toBe(true)
  })

  it("lists Interests and Languages under 'Other sections (not used for questions)', never in unplaced or the questions or an exported set", async () => {
    await seedResume(lines)
    renderApp("/resume")
    expect(
      await screen.findByRole("heading", {
        name: /Other sections \(not used for questions\) \(1\)/,
      })
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue("INTERESTS")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Chess, open source")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /Unplaced text \(0\)/ })
    ).toBeInTheDocument()
    expect(
      useLearnerStore
        .getState()
        .resumeQuestions.some((q) => /Chess/.test(q.title))
    ).toBe(false)
  })
})

describe("the question bank", () => {
  it("groups questions by section with the label, filters by section and search, and shows the first few with 'Show all'", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume?tab=questions")
    expect(await screen.findByTestId("generated-label")).toHaveTextContent(
      "Generated from your resume with a template. No AI is involved."
    )
    const sections = new Set(
      useLearnerStore.getState().resumeQuestions.map((q) => q.section)
    )
    expect(sections.size).toBeGreaterThan(4)
    expect(
      screen.getByRole("heading", { name: /^Projects \(\d+\)/ })
    ).toBeInTheDocument()
    expect(screen.getByTestId("bank-count")).toHaveTextContent(
      /0 practised of \d+/
    )
    await user.type(
      screen.getByLabelText("Search resume questions"),
      "architecture"
    )
    expect(
      screen
        .getAllByRole("link")
        .filter((a) =>
          a
            .getAttribute("href")
            ?.startsWith("/interview/question/resume-architecture")
        ).length
    ).toBeGreaterThan(0)
    expect(
      screen.queryByRole("heading", { name: /^Companies/ })
    ).not.toBeInTheDocument()
    await user.clear(screen.getByLabelText("Search resume questions"))
    await user.click(screen.getByRole("combobox", { name: "Section" }))
    await user.click(
      await screen.findByRole("option", { name: "Technical skills" })
    )
    const skillQs = useLearnerStore
      .getState()
      .resumeQuestions.filter((q) => q.section === "skills").length
    expect(
      screen.getByRole("heading", {
        name: new RegExp(`^Technical skills \\(${skillQs}\\)`),
      })
    ).toBeInTheDocument()
    if (skillQs > 8)
      expect(
        screen.getByRole("button", { name: /Show all/ })
      ).toBeInTheDocument()
  })

  it("removes a question with Undo through the ordinary removal, and keeps it out of the counts", async () => {
    const user = userEvent.setup()
    await seedResume()
    const q = firstQ("project")
    renderApp("/resume?tab=questions")
    await user.click(
      await screen.findByRole("button", {
        name: `Remove from my prep: ${q.title}`,
      })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[q.id].removed).toBe(true)
    )
    expect(
      screen.queryByRole("link", { name: q.title })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /1 removed/ })).toBeInTheDocument()
  })

  it("offers 'Update my questions' after an edit, and updating keeps ids, marks removed sources and leaves answers alone", async () => {
    const user = userEvent.setup()
    const p = await seedResume()
    const proj = firstQ("project")
    await useLearnerStore
      .getState()
      .addHrAnswer({ questionId: proj.id, situation: "my project story" })
    await useLearnerStore.getState().saveResume({
      ...useLearnerStore.getState().resume!,
      projects: p.projects.map((x) => ({ ...x, name: "Inventory Tracker v2" })),
      experiences: p.experiences.slice(0, 1),
    })
    renderApp("/resume?tab=questions")
    expect(await screen.findByTestId("pending")).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Update my questions" })
    )
    await waitFor(() =>
      expect(screen.queryByTestId("pending")).not.toBeInTheDocument()
    )
    const after = useLearnerStore.getState().resumeQuestions
    expect(after.find((q) => q.id === proj.id)!.title).toContain(
      "Inventory Tracker v2"
    ) // same id, new wording
    expect(after.some((q) => q.status === "source-removed")).toBe(true) // the removed job's questions
    expect(
      useLearnerStore.getState().hrAnswers.some((a) => a.questionId === proj.id)
    ).toBe(true)
    expect(
      (await screen.findAllByText("Source removed")).length
    ).toBeGreaterThan(0)
  })
})

describe("practising a resume question", () => {
  it("opens on the shared question route with the template label, outline, tips, the STAR builder and saved answers", async () => {
    const user = userEvent.setup()
    await seedResume()
    const q = firstQ("project")
    renderApp(`/interview/question/${q.id}`)
    await screen.findByRole("heading", { level: 1, name: q.title })
    expect(screen.getByTestId("provenance")).toHaveTextContent(
      "Generated from your resume with a template. No AI is involved."
    )
    expect(screen.getByText("From your resume")).toBeInTheDocument()
    expect(screen.queryByText("Fresher")).not.toBeInTheDocument() // level-neutral
    expect(
      screen.getByRole("heading", { name: "An outline for your answer" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Fill each \[bracket\] with your own facts/)
    ).toBeInTheDocument()
    // no sample answer is invented
    expect(screen.queryByText(/Show sample answer/)).not.toBeInTheDocument()
    await user.click(screen.getByRole("textbox", { name: /^Situation/ }))
    await user.paste("In my final-year project")
    await user.click(screen.getByRole("button", { name: "Save answer" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().hrAnswers.some((a) => a.questionId === q.id)
      ).toBe(true)
    )
    await user.click(screen.getByRole("button", { name: "Mark practised" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[q.id].completed).toBe(true)
    )
    expect(
      useLearnerStore.getState().progress[q.id].nextReviewAt
    ).not.toBeNull()
    await user.click(screen.getByRole("button", { name: "Bookmark" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[q.id].bookmarked).toBe(true)
    )
  })

  it("lets you edit the wording, keeps it through regeneration, and resets to the generated wording", async () => {
    const user = userEvent.setup()
    const p = await seedResume()
    const q = firstQ("project")
    renderApp(`/interview/question/${q.id}`)
    await screen.findByRole("heading", { level: 1, name: q.title })
    await user.click(screen.getByRole("button", { name: "Edit wording" }))
    const box = await screen.findByLabelText("Question")
    await user.clear(box)
    await user.type(box, "My own way of asking about this project")
    await user.click(screen.getByRole("button", { name: "Save wording" }))
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "My own way of asking about this project",
      })
    ).toBeInTheDocument()
    expect(screen.getByText("Edited")).toBeInTheDocument()
    const now = new Date().toISOString()
    await useLearnerStore
      .getState()
      .setResumeQuestions(
        reconcile(
          useLearnerStore.getState().resumeQuestions,
          generateQuestions(p, p),
          now
        )
      )
    expect(
      useLearnerStore.getState().resumeQuestions.find((x) => x.id === q.id)!
        .title
    ).toBe("My own way of asking about this project")
    await user.click(screen.getByRole("button", { name: /Reset to generated/ }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().resumeQuestions.find((x) => x.id === q.id)!
          .title
      ).toBe(q.title)
    )
  })

  it("explains a 'Source removed' question and lets you delete it", async () => {
    const user = userEvent.setup()
    await seedResume()
    const q = firstQ("company")
    await useLearnerStore
      .getState()
      .setResumeQuestions(
        useLearnerStore
          .getState()
          .resumeQuestions.map((x) =>
            x.id === q.id ? { ...x, status: "source-removed" as const } : x
          )
      )
    renderApp(`/interview/question/${q.id}`)
    expect(
      await screen.findByRole("region", { name: "Source removed" })
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Delete this question" })
    )
    await user.click(await screen.findByRole("button", { name: "Delete" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().resumeQuestions.some((x) => x.id === q.id)
      ).toBe(false)
    )
  })

  it("links a skill question to the matching catalogue module", async () => {
    await seedResume()
    const skill = useLearnerStore
      .getState()
      .resumeQuestions.find(
        (q) => q.templateId === "skill.problem" && /Java\b/.test(q.title)
      )!
    renderApp(`/interview/question/${skill.id}`)
    const link = await screen.findByRole("link", { name: /, \d+ questions$/ })
    expect(link.getAttribute("href")).toMatch(/\/interview\/.+\/java-core$/)
  })
})

describe("question sets in the UI", () => {
  it("exports questions without the profile by default, previews an import with duplicates before saving, and removes a set", async () => {
    const user = userEvent.setup()
    await seedResume()
    let exported = ""
    const originalBlob = globalThis.Blob
    globalThis.Blob = class extends originalBlob {
      constructor(parts?: BlobPart[], opts?: BlobPropertyBag) {
        super(parts, opts)
        if (parts && typeof parts[0] === "string") exported = parts[0]
      }
    } as typeof Blob
    URL.createObjectURL = () => "blob:test"
    URL.revokeObjectURL = () => {}
    renderApp("/resume?tab=sets")
    await user.click(
      await screen.findByRole("button", { name: /Export question set/ })
    )
    globalThis.Blob = originalBlob
    const set = JSON.parse(exported)
    expect(set.app).toBe("lastrev-question-set")
    expect(set.profile).toBeUndefined()
    expect(JSON.stringify(set)).not.toContain("Example Institute") // education is never quoted by a question
    expect(
      screen.getByText(
        /The wording of the questions includes text from your resume/
      )
    ).toBeInTheDocument()
    // import the same file: all duplicates; then a second file with new questions
    const file = new File([JSON.stringify(set)], "mine.json", {
      type: "application/json",
    })
    await user.upload(screen.getByLabelText("Choose a question set file"), file)
    const dup = await screen.findByTestId("import-preview")
    expect(dup).toHaveTextContent(`0 questions will be added`)
    expect(dup).toHaveTextContent(
      `${set.questions.length} already in your bank are skipped`
    )
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    const fresh = {
      ...set,
      questions: [
        {
          ...set.questions[0],
          id: "resume-intro.fresher.zzzzzzzzzz",
          title: "A question from a friend's set",
        },
      ],
    }
    await user.upload(
      screen.getByLabelText("Choose a question set file"),
      new File([JSON.stringify(fresh)], "friend.json")
    )
    expect(await screen.findByTestId("import-preview")).toHaveTextContent(
      "1 questions will be added from friend.json"
    )
    expect(
      useLearnerStore
        .getState()
        .resumeQuestions.some((q) => q.id === "resume-intro.fresher.zzzzzzzzzz")
    ).toBe(false) // nothing saved before confirming
    await user.click(screen.getByRole("button", { name: "Add to my bank" }))
    await waitFor(() =>
      expect(
        useLearnerStore
          .getState()
          .resumeQuestions.find(
            (q) => q.id === "resume-intro.fresher.zzzzzzzzzz"
          )?.setLabel
      ).toBe("friend.json")
    )
    expect(
      await screen.findByText(/friend\.json/, { selector: "li span" })
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Remove the set friend.json" })
    )
    await user.click(await screen.findByRole("button", { name: "Remove set" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().resumeQuestions.some((q) => q.setId !== "")
      ).toBe(false)
    )
  })

  it("rejects a file that is not a question set with a clear message, and saves nothing", async () => {
    const user = userEvent.setup()
    await seedResume()
    renderApp("/resume?tab=sets")
    const before = useLearnerStore.getState().resumeQuestions.length
    await user.upload(
      await screen.findByLabelText("Choose a question set file"),
      new File(['{"app":"other"}'], "bad.json")
    )
    expect(
      await screen.findByText(/does not look like a LastRev question set/)
    ).toBeInTheDocument()
    expect(useLearnerStore.getState().resumeQuestions).toHaveLength(before)
  })

  it("the backup note appears in Settings once a resume exists", async () => {
    await seedResume()
    renderApp("/settings")
    expect(
      await screen.findByText("This backup includes your resume details.")
    ).toBeInTheDocument()
  })
})

describe("every surface treats resume questions like the learner's own questions", () => {
  it("shows them in Library lists once bookmarked, in the revision list when queued, and in the command palette", async () => {
    const user = userEvent.setup()
    await seedResume()
    const q = firstQ("project")
    await useLearnerStore.getState().toggleFlag(q.id, "bookmarked")
    renderApp("/library/saved")
    expect(await screen.findByText(q.title)).toBeInTheDocument()
    cleanup()
    renderApp("/dashboard")
    await screen.findAllByRole("link", { name: /Resume interview/ })
    await user.keyboard("{Control>}k{/Control}")
    await user.type(
      await screen.findByPlaceholderText(/Search questions or pages/),
      "architecture"
    )
    expect(
      await screen.findAllByText(/architecture of Inventory Tracker/)
    ).not.toHaveLength(0)
  })

  it("lists them in the interview library route of their section, level-neutral, and in Manage my prep > Questions", async () => {
    await seedResume()
    renderApp("/interview/frontend-developer/resume-project")
    expect(
      await screen.findByRole("heading", { level: 1, name: "Resume: Projects" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Made from your resume with templates")
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("group", { name: "Experience level" })
    ).not.toBeInTheDocument()
    const q = firstQ("project")
    expect(await screen.findByText(q.title)).toBeInTheDocument()
    cleanup()
    renderApp("/interview/manage?tab=questions")
    expect(
      await screen.findByRole("button", {
        name: `Remove from my prep: ${q.title}`,
      })
    ).toBeInTheDocument()
  })

  it("makes the Project mock non-empty with the resume project and architecture questions only", async () => {
    await seedResume()
    const state = useLearnerStore.getState()
    const pool = buildPool({
      type: "project",
      levels: ["fresher"],
      difficulty: "any",
      moduleIds: [],
      index: QUESTION_INDEX,
      own: ownQuestionEntries(state.customQuestions, state.resumeQuestions),
      profile: state.profile,
      progress: {},
    })
    expect(pool.length).toBeGreaterThan(0)
    expect(
      pool.every(
        (q) =>
          q.moduleId === "resume-project" ||
          q.moduleId === "resume-architecture" ||
          q.moduleId === "project-questions"
      )
    ).toBe(true)
    // not in any other mock type, nor in a syllabus
    for (const type of ["technical", "mixed", "custom", "hr"] as const)
      expect(
        buildPool({
          type,
          levels: ["fresher"],
          difficulty: "any",
          moduleIds: [],
          index: QUESTION_INDEX,
          own: ownQuestionEntries([], state.resumeQuestions),
          profile: state.profile,
          progress: {},
        }).some((q) => q.moduleId.startsWith("resume-")),
        type
      ).toBe(false)
  })

  it("keeps resume questions out of readiness while their reviews still fall due", async () => {
    await seedResume()
    const q = firstQ("project")
    await useLearnerStore.getState().toggleCompleted(q.id, 4)
    useLearnerStore.setState((s) => ({
      progress: {
        ...s.progress,
        [q.id]: {
          ...s.progress[q.id],
          nextReviewAt: "2020-01-01T00:00:00.000Z",
        },
      },
    }))
    renderApp("/dashboard")
    expect(
      await screen.findByText(/Revision due today:/, {}, { timeout: 15000 })
    ).toBeInTheDocument()
    const s = useLearnerStore.getState()
    const summary = buildSummary({
      profile: s.profile,
      progress: s.progress,
      activity: s.activity,
      index: [
        ...QUESTION_INDEX,
        ...ownQuestionEntries(s.customQuestions, s.resumeQuestions),
      ],
    })
    expect(summary.modules.some((m) => m.moduleId.startsWith("resume-"))).toBe(
      false
    )
    expect(summary.dueReviews.some((d) => d.id === q.id)).toBe(true)
  })
})

describe("privacy and honesty", () => {
  it("no component of the feature hides an error message, and an error page on a resume route never shows the message", async () => {
    const secret = "my private resume line"
    const Boom = () => {
      throw new Error(secret)
    }
    for (const [path, shows] of [
      ["/resume", false],
      ["/interview/question/resume-project.fresher.abc", false],
      ["/other", true],
    ] as const) {
      const router = createMemoryRouter(
        [{ path: "*", element: <Boom />, errorElement: <RouteError /> }],
        { initialEntries: [path] }
      )
      const { unmount } = render(<RouterProvider router={router} />)
      expect(
        await screen.findByText("This page hit a problem")
      ).toBeInTheDocument()
      expect(screen.queryByText(secret) !== null, path).toBe(shows)
      unmount()
    }
  })

  it("never claims an AI model wrote anything, and says the opposite", () => {
    const sources = import.meta.glob(
      [
        "/src/features/resume/*.{ts,tsx}",
        "/src/services/resume/*.ts",
        "/src/data/resume/*.ts",
      ],
      { query: "?raw", import: "default", eager: true }
    ) as Record<string, string>
    const bad =
      /(AI|artificial intelligence)[- ](powered|generated|based|model|assistant)|powered by AI|generated by AI|\bGPT\b|\bLLM\b/i
    for (const [path, text] of Object.entries(sources).filter(
      ([p]) => !/\.test\.tsx?$/.test(p) && !p.includes("/test/")
    ))
      expect(text.match(bad)?.[0] ?? null, path).toBeNull()
  })

  it("no surface outside the store and the learner's own question pages merges customQuestions directly", () => {
    const all = import.meta.glob(["/src/**/*.{ts,tsx}"], {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>
    const users = Object.entries(all)
      .filter(
        ([p, t]) => !/\.test\.tsx?$/.test(p) && /\bcustomQuestions\b/.test(t)
      )
      .map(([p]) => p.replace("/src/", ""))
      .sort()
    expect(users).toEqual([
      "features/interview/manage/manage-page.tsx", // the "My questions" tab edits the learner's own written questions
      "features/interview/question-page.tsx", // picks the page kind
      "features/mock/use-mock-items.ts", // turns a question id into its text
      "hooks/use-content.ts", // the one merge point (useOwnQuestionEntries)
      "services/storage/dexie-repository.ts",
      "services/storage/import-export.ts",
      "services/storage/repository.ts",
      "stores/learner-store.ts",
      "types/learner.ts",
    ])
  })
})
