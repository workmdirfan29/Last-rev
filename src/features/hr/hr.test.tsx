import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { NAV_BY_MODE } from "@/app/nav"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { HR_MODULE_IDS } from "@/data/catalog/modules/hr"
import { HR_RELEASE_MIN_QUESTIONS } from "@/data/catalog/module-types"
import {
  SAMPLE_LABEL,
  SELF_CHECK_ITEMS,
  countWords,
  formatSeconds,
  speakSeconds,
} from "@/data/hr/guidance"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"
import { useLearnerStore } from "@/stores/learner-store"

const HR_QUESTION = QUESTION_INDEX.find(
  (q) => q.moduleId === "hr-tell-me-about-yourself"
)!
const QPATH = `/interview/question/${HR_QUESTION.id}`

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

async function openQuestion() {
  await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
  renderApp(QPATH)
  await screen.findByRole("heading", { level: 1, name: HR_QUESTION.title })
}

const field = (label: string) =>
  screen.getByRole("textbox", { name: new RegExp(`^${label}`) })

async function fillStar(
  user: ReturnType<typeof userEvent.setup>,
  parts: Partial<Record<"Situation" | "Task" | "Action" | "Result", string>>
) {
  for (const [label, text] of Object.entries(parts)) {
    await user.click(field(label))
    await user.paste(text)
  }
}

describe("guidance helpers", () => {
  it("count words and turn them into a spoken-time hint", () => {
    expect(countWords("")).toBe(0)
    expect(countWords("  one  two\nthree ")).toBe(3)
    expect(speakSeconds(0)).toBe(0)
    expect(speakSeconds(130)).toBe(60)
    expect(speakSeconds(20) % 5).toBe(0)
    expect(formatSeconds(45)).toBe("45 s")
    expect(formatSeconds(60)).toBe("1 min")
    expect(formatSeconds(75)).toBe("1 min 15 s")
  })
})

describe("navigation", () => {
  it("adds HR Interview to the Interview Prep sidebar and leaves the mobile tab bar alone", () => {
    const items = NAV_BY_MODE.interview.flatMap((g) => g.items)
    const hr = items.find((i) => i.id === "hr")!
    expect(hr).toMatchObject({ title: "HR Interview", to: "/hr" })
    expect(hr.mobile).toBeFalsy()
    expect(items.filter((i) => i.mobile).map((i) => i.id)).toEqual([
      "overview",
      "interview",
      "library-saved",
      "settings",
    ])
    // not part of the Study Path
    expect(
      NAV_BY_MODE.study.flatMap((g) => g.items).some((i) => i.id === "hr")
    ).toBe(false)
  })
})

describe("HR home", () => {
  it("lists the 20 categories in order, links the ones with questions, and notes the two audience-specific ones", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/hr")
    await screen.findByRole("heading", { level: 1, name: "HR interview" })
    const titles = (await screen.findAllByRole("heading", { level: 2 })).map(
      (h) => h.textContent
    )
    expect(titles).toEqual(
      HR_MODULE_IDS.map((id) => MODULE_BY_ID.get(id)!.title)
    )
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"))
    expect(hrefs).toContain(
      "/interview/frontend-developer/hr-tell-me-about-yourself"
    )
    // a category with no question yet is not a link
    const empty = HR_MODULE_IDS.find(
      (id) => !QUESTION_INDEX.some((q) => q.moduleId === id)
    )
    if (empty)
      expect(hrefs).not.toContain(`/interview/frontend-developer/${empty}`)
    expect(screen.getByText("For freshers")).toBeInTheDocument()
    expect(screen.getByText("For experienced candidates")).toBeInTheDocument()
    // "N questions ready" or "N of 5 ready", never the technical fresher wording
    const n = QUESTION_INDEX.filter(
      (q) => q.moduleId === "hr-tell-me-about-yourself"
    ).length
    expect(
      screen.getAllByText(
        n < HR_RELEASE_MIN_QUESTIONS
          ? `${n} of ${HR_RELEASE_MIN_QUESTIONS} ready`
          : `${n} questions ready`
      ).length
    ).toBeGreaterThan(0)
    expect(
      screen.queryByText(/fresher questions ready/)
    ).not.toBeInTheDocument()
  })

  it("is linked from the Interview Zone and the dashboard", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview")
    expect(
      await screen.findByRole("link", { name: /Open HR interview/ })
    ).toHaveAttribute("href", "/hr")
    cleanup()
    renderApp("/dashboard")
    expect(
      (await screen.findAllByRole("link", { name: /HR interview/ })).some(
        (a) => a.getAttribute("href") === "/hr"
      )
    ).toBe(true)
  })
})

describe("the HR question page", () => {
  it("is level-neutral: an HR badge, no level or difficulty badge, no experience-level crumb", async () => {
    await openQuestion()
    expect(
      screen.getByText("HR interview", { selector: "[data-slot=badge]" })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Fresher", { selector: "[data-slot=badge], span" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("tab", { name: /Quick revision/ })
    ).not.toBeInTheDocument()
  })

  it("hides the sample until revealed, labels it as a sample, and can hide it again", async () => {
    const user = userEvent.setup()
    await openQuestion()
    expect(screen.queryByText(SAMPLE_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText("A stronger answer")).not.toBeInTheDocument()
    expect(screen.queryByText("A weaker answer")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Show sample answer/ }))
    expect(screen.getByText(SAMPLE_LABEL)).toBeVisible()
    expect(screen.getByText("A stronger answer")).toBeVisible()
    expect(screen.getByText("A weaker answer")).toBeVisible()
    expect(screen.getByText("Why it is weak")).toBeVisible()
    await user.click(screen.getByRole("button", { name: /Hide the sample/ }))
    expect(screen.queryByText("A stronger answer")).not.toBeInTheDocument()
  })

  it("shows why HR asks it, what the recruiter expects, the framework and the mistakes", async () => {
    await openQuestion()
    expect(
      screen.getByRole("heading", { name: "Why HR asks this" })
    ).toBeInTheDocument()
    expect(screen.getByText("What the recruiter expects")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "A framework for your answer" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Mistakes to avoid" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Follow-up questions" })
    ).toBeInTheDocument()
  })
})

describe("the STAR builder and saved answers", () => {
  it("counts words and shows a speaking-time hint as you write", async () => {
    const user = userEvent.setup()
    await openQuestion()
    await fillStar(user, {
      Situation: "In my final year project we had a deadline",
    })
    expect(screen.getByText(/9 words · aim for 30 to 50/)).toBeInTheDocument()
    const summary = screen
      .getAllByRole("status")
      .find((el) => /spoken/.test(el.textContent ?? ""))
    expect(summary?.textContent).toMatch(/9 words, about 5 s spoken/)
  })

  it("refuses an empty answer, then saves, lists, edits and deletes with a confirmation; several per question", async () => {
    const user = userEvent.setup()
    await openQuestion()
    await user.click(screen.getByRole("button", { name: "Save answer" }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /at least one part/
    )
    expect(useLearnerStore.getState().hrAnswers).toEqual([])

    await user.click(screen.getByLabelText(/^Name this answer/))
    await user.paste("Project story")
    await fillStar(user, {
      Situation: "In my final-year project the team missed a milestone.",
      Action: "I split the work and paired with a teammate.",
    })
    await user.click(screen.getByLabelText(SELF_CHECK_ITEMS[0].label))
    await user.click(screen.getByRole("button", { name: "Save answer" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().hrAnswers).toHaveLength(1)
    )
    const [saved] = useLearnerStore.getState().hrAnswers
    expect(saved).toMatchObject({
      questionId: HR_QUESTION.id,
      title: "Project story",
      selfCheck: [SELF_CHECK_ITEMS[0].id],
      task: "",
    })
    // the form is empty again and the answer is listed
    expect(field("Situation")).toHaveValue("")
    const list = screen
      .getByRole("heading", { name: "Your saved answers (1)" })
      .closest("section")!
    expect(
      within(list).getByText(
        "In my final-year project the team missed a milestone."
      )
    ).toBeInTheDocument()
    expect(within(list).getByText(/you ticked 1 of/)).toBeInTheDocument()

    // a second answer for the same question
    await fillStar(user, { Result: "We caught up." })
    await user.click(screen.getByRole("button", { name: "Save answer" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().hrAnswers).toHaveLength(2)
    )

    // edit the first
    await user.click(screen.getByRole("button", { name: "Edit Project story" }))
    const situation = field("Situation")
    expect(situation).toHaveValue(
      "In my final-year project the team missed a milestone."
    )
    await user.type(situation, " Edited.")
    await user.click(screen.getByRole("button", { name: "Update answer" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().hrAnswers.find((a) => a.id === saved.id)!
          .situation
      ).toMatch(/Edited\.$/)
    )
    expect(useLearnerStore.getState().hrAnswers).toHaveLength(2)

    // delete asks first
    await user.click(
      screen.getByRole("button", { name: "Delete Project story" })
    )
    await user.click(await screen.findByRole("button", { name: "Keep it" }))
    expect(useLearnerStore.getState().hrAnswers).toHaveLength(2)
    await user.click(
      screen.getByRole("button", { name: "Delete Project story" })
    )
    await user.click(await screen.findByRole("button", { name: "Delete" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().hrAnswers).toHaveLength(1)
    )
  })

  it("keeps an unsaved draft on this device until it is saved", async () => {
    const user = userEvent.setup()
    await openQuestion()
    await fillStar(user, { Task: "Keep this draft" })
    cleanup()
    renderApp(QPATH)
    await screen.findByRole("heading", { level: 1, name: HR_QUESTION.title })
    expect(field("Task")).toHaveValue("Keep this draft")
  })
})

describe("practice: practised, confidence and the shared mechanisms", () => {
  it("marks it practised (revision scheduled), records confidence, and lists it with the other saved items", async () => {
    const user = userEvent.setup()
    await openQuestion()
    await user.click(screen.getByRole("button", { name: "Mark practised" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[HR_QUESTION.id]).toMatchObject(
        { completed: true }
      )
    )
    expect(
      useLearnerStore.getState().progress[HR_QUESTION.id].nextReviewAt
    ).not.toBeNull()
    expect(screen.getByRole("button", { name: "Practised" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    const group = screen.getByRole("group", {
      name: /How confident are you answering this/,
    })
    await user.click(within(group).getByRole("button", { name: "4" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress[HR_QUESTION.id].confidence
      ).toBe(4)
    )
    await user.click(screen.getByRole("button", { name: "Bookmark" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress[HR_QUESTION.id].bookmarked
      ).toBe(true)
    )
    cleanup()
    renderApp("/library/saved")
    expect(await screen.findByText(HR_QUESTION.title)).toBeInTheDocument()
  })

  it("appears in Manage my prep, where it can be removed and restored like any question", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview/manage?tab=questions")
    expect(
      await screen.findByRole(
        "button",
        { name: `Remove from my prep: ${HR_QUESTION.title}` },
        { timeout: 15000 }
      )
    ).toBeInTheDocument()
  })

  it("counts in the dashboard syllabus by area", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    const heading = await screen.findByRole(
      "heading",
      { name: /Syllabus progress by area/ },
      { timeout: 15000 }
    )
    const section = heading.closest("section")!
    for (const t of within(section).getAllByRole("button", { expanded: false }))
      await user.click(t)
    expect(
      within(section).getByRole("progressbar", {
        name: "Tell me about yourself progress",
      })
    ).toBeInTheDocument()
  })
})

describe("My answers", () => {
  it("shows an empty state, then lists answers by category, searches, and deletes", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/hr/answers")
    expect(
      await screen.findByText("You have not saved any answers yet")
    ).toBeInTheDocument()
    cleanup()
    await useLearnerStore.getState().addHrAnswer({
      questionId: HR_QUESTION.id,
      title: "Alpha",
      situation: "campus placement drive",
    })
    await useLearnerStore.getState().addHrAnswer({
      questionId: HR_QUESTION.id,
      title: "Beta",
      action: "I organised a study group",
    })
    renderApp("/hr/answers")
    expect(
      await screen.findByRole("heading", {
        name: "Tell me about yourself",
        level: 2,
      })
    ).toBeInTheDocument()
    expect(screen.getAllByRole("article")).toHaveLength(2)
    await user.type(screen.getByLabelText("Search my answers"), "study group")
    expect(screen.getAllByRole("article")).toHaveLength(1)
    expect(screen.getByRole("article", { name: "Beta" })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Delete Beta" }))
    await user.click(await screen.findByRole("button", { name: "Delete" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().hrAnswers.map((a) => a.title)).toEqual([
        "Alpha",
      ])
    )
    // the answer links back to its question
    await user.clear(screen.getByLabelText("Search my answers"))
    expect(
      screen.getByRole("link", { name: HR_QUESTION.title })
    ).toHaveAttribute("href", QPATH)
  })

  it("is deleted with the question's notes and progress, but not by removing the question", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    await useLearnerStore
      .getState()
      .addHrAnswer({ questionId: HR_QUESTION.id, situation: "x" })
    await useLearnerStore.getState().setQuestionRemoved(HR_QUESTION.id, true)
    expect(useLearnerStore.getState().hrAnswers).toHaveLength(1)
    await useLearnerStore.getState().deleteQuestionData(HR_QUESTION.id)
    expect(useLearnerStore.getState().hrAnswers).toHaveLength(0)
  })
})

describe("honesty: no AI, scoring or grading claims", () => {
  const FORBIDDEN =
    /\bAI\b|\bAI-|\bgrad(?:e|ed|es|ing)\b|\bevaluat\w*|\bfeedback from\b|\byour score\b|\bscored\b|\bsmart (?:feedback|analysis)\b/i

  it("appears nowhere in the HR feature's text, shown or in source", () => {
    const sources = import.meta.glob("/src/{features/hr,data/hr}/*.{ts,tsx}", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>
    const files = Object.entries(sources).filter(
      ([p]) => !p.endsWith(".test.tsx")
    )
    expect(files.length).toBeGreaterThan(5)
    for (const [path, text] of files) {
      // only the strings people read: skip comments
      const code = text
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "")
      expect(code.match(FORBIDDEN)?.[0] ?? null, path).toBeNull()
    }
  })

  it("appears nowhere on the rendered pages, and the self-check says it is a self-assessment", async () => {
    const user = userEvent.setup()
    await openQuestion()
    await user.click(screen.getByRole("button", { name: /Show sample answer/ }))
    expect(document.body.textContent?.match(FORBIDDEN)?.[0] ?? null).toBeNull()
    expect(
      screen.getByText(
        /This is a self-check\. LastRev does not read, score or judge your answer/
      )
    ).toBeInTheDocument()
  })
})
