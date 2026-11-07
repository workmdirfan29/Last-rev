import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { NAV_BY_MODE } from "@/app/nav"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { buildPool } from "@/services/mock/pool"
import { scoreSession } from "@/services/mock/score"
import { blankAnswer, newSession } from "@/services/mock/session"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"
import {
  mockConfigSchema,
  type LearnerProfile,
  type MockSession,
} from "@/types/learner"
import { MOCK_TYPE_DEFS, type MockType } from "@/data/mock/types"

const ids = (moduleId: string, n: number) =>
  QUESTION_INDEX.filter((q) => q.moduleId === moduleId)
    .slice(0, n)
    .map((q) => q.id)
const titleOf = (id: string) => QUESTION_INDEX.find((q) => q.id === id)!.title
/**
 * What the pool builder says a type holds at the Fresher level. The question bank grows as modules are released,
 * so tests that need an empty or a short pool pick the type from this at run time instead of naming one.
 */
const poolOf = (type: MockType, profile: LearnerProfile | null) =>
  buildPool({
    type,
    levels: ["fresher"],
    difficulty: "any",
    moduleIds: [],
    index: QUESTION_INDEX,
    own: [],
    profile,
    progress: {},
  })
const PATH_TYPES: MockType[] = [
  "java",
  "mern",
  "python",
  "data-science",
  "project",
]

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

function sessionOf(
  questionIds: string[],
  cfg: Record<string, unknown> = {},
  patch: Partial<MockSession> = {}
): MockSession {
  const s = newSession({
    config: mockConfigSchema.parse({
      type: "technical",
      count: questionIds.length,
      durationMinutes: 10,
      levels: ["fresher"],
      ...cfg,
    }),
    questionIds,
    requested: questionIds.length,
    seed: 5,
    now: new Date("2026-11-03T09:00:00.000Z"),
  })
  return { ...s, ...patch }
}

/** A finished session whose answers carry the given own ratings. */
async function seedFinished(
  ratings: Record<string, Record<string, number>>,
  cfg: Record<string, unknown> = {}
) {
  const qids = Object.keys(ratings)
  const base = sessionOf(qids, cfg)
  const s: MockSession = {
    ...base,
    status: "finished",
    phase: "review",
    finishedAt: "2026-11-03T09:20:00.000Z",
    elapsedSeconds: 600,
    answers: qids.map((id) => ({
      ...blankAnswer(id),
      text: Object.keys(ratings[id]).length ? "I typed an answer about it" : "",
      ratings: ratings[id],
      keywordsHit: 1,
      keywordsTotal: 4,
    })),
  }
  await useLearnerStore.getState().createMockSession(s)
  return s
}

const all5 = {
  accuracy: 5,
  completeness: 5,
  practical: 5,
  communication: 5,
  structure: 5,
  confidence: 5,
}
const all3 = {
  accuracy: 3,
  completeness: 3,
  practical: 3,
  communication: 3,
  structure: 3,
  confidence: 3,
}

describe("navigation", () => {
  it("adds Mock interview to the Interview Prep sidebar and leaves the mobile tab bar alone", () => {
    const items = NAV_BY_MODE.interview.flatMap((g) => g.items)
    expect(items.find((i) => i.id === "mock")).toMatchObject({
      title: "Mock interview",
      to: "/mock",
    })
    expect(items.find((i) => i.id === "mock")!.mobile).toBeFalsy()
    expect(items.filter((i) => i.mobile).map((i) => i.id)).toEqual([
      "overview",
      "interview",
      "library-saved",
      "settings",
    ])
    expect(
      NAV_BY_MODE.study.flatMap((g) => g.items).some((i) => i.id === "mock")
    ).toBe(false)
  })

  it("is reachable from cards on the Interview Zone and the dashboard", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview")
    expect(
      await screen.findByRole("link", { name: /Open mock interview/ })
    ).toHaveAttribute("href", "/mock")
    cleanup()
    renderApp("/dashboard")
    const card = (
      await screen.findAllByRole("link", { name: /Mock interviews/ })
    ).find((a) => a.getAttribute("href") === "/mock")!
    expect(card).toHaveTextContent("None yet")
  })
})

describe("setup", () => {
  it("shows a count per type, disables types with no questions, and updates availability as options change", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/mock/new")
    await screen.findByRole("heading", { name: "New mock interview" })
    // Data-driven: the types with nothing to ask are the ones the pool builder finds empty today (it changes as
    // content is released); each must be disabled, and the rest enabled.
    const profile = useLearnerStore.getState().profile
    const emptyTypes = PATH_TYPES.filter((t) => poolOf(t, profile).length === 0)
    for (const t of PATH_TYPES) {
      const radio = screen.getByRole("radio", {
        name: new RegExp(MOCK_TYPE_DEFS[t].title),
      })
      if (emptyTypes.includes(t)) expect(radio).toBeDisabled()
      else expect(radio).toBeEnabled()
    }
    expect(
      screen.queryAllByText("No questions yet for this type")
    ).toHaveLength(emptyTypes.length)
    // what the pool builder says the MERN type holds at the Fresher level (the bank grows, so it is derived)
    const mern = buildPool({
      type: "mern",
      levels: ["fresher"],
      difficulty: "any",
      moduleIds: [],
      index: QUESTION_INDEX,
      own: [],
      profile: useLearnerStore.getState().profile,
      progress: {},
    }).length
    expect(mern).toBeGreaterThan(0)
    expect(screen.getByRole("radio", { name: /MERN mock/ })).toBeEnabled()
    const available = () => screen.getByTestId("available").textContent
    await waitFor(() =>
      expect(available()).toMatch(/\d+ questions are available/)
    )
    // an experience level with no questions: nothing available and Start is blocked with the reason
    await user.click(screen.getByLabelText("Fresher"))
    await user.click(screen.getByLabelText("Advanced"))
    await waitFor(() => expect(available()).toMatch(/^0 questions/))
    expect(
      screen.getByRole("button", { name: "Start interview" })
    ).toBeDisabled()
    expect(
      screen.getByText(/No questions match these settings/)
    ).toBeInTheDocument()
    await user.click(screen.getByLabelText("Advanced"))
    await user.click(screen.getByLabelText("Fresher"))
    await user.click(screen.getByRole("radio", { name: /MERN mock/ }))
    await waitFor(() => expect(available()).toContain(`${mern}`))
  })

  it("says plainly when the pool is short, then runs with exactly that many, no repeats", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/mock/new")
    await screen.findByRole("heading", { name: "New mock interview" })
    // Data-driven: use a type whose pool is under 30 today (the Java pool, for one, stopped being short once more
    // Java modules were released), so this keeps proving the "short pool" behaviour whatever has been released.
    const profile = useLearnerStore.getState().profile
    const short = PATH_TYPES.find((t) => {
      const n = poolOf(t, profile).length
      return n > 0 && n < 30
    })
    if (!short) return // every type already has 30 or more questions: there is no short pool left to show
    const poolIds = new Set(poolOf(short, profile).map((q) => q.id))
    const pool = poolIds.size
    await user.click(
      screen.getByRole("radio", {
        name: new RegExp(MOCK_TYPE_DEFS[short].title),
      })
    )
    await user.click(
      screen.getByRole("combobox", { name: "Number of questions" })
    )
    await user.click(await screen.findByRole("option", { name: "30" }))
    expect(
      await screen.findByText(
        new RegExp(`Only ${pool} questions are available for these settings`)
      )
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Start interview" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().mockSessions).toHaveLength(1)
    )
    const s = useLearnerStore.getState().mockSessions[0]
    expect(s.questionIds).toHaveLength(pool)
    expect(new Set(s.questionIds).size).toBe(pool)
    expect(s.requested).toBe(30)
    expect(s.questionIds.every((id) => poolIds.has(id))).toBe(true)
    expect(s.config.includeKeywords).toBe(false) // off unless the learner turns it on
    expect(s.config.ratingMode).toBe("end")
  })

  it("explains the score on the setup page and pre-fills from an earlier session", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const s = await seedFinished(
      { [ids("react", 1)[0]]: all5 },
      { type: "mern", count: 15, durationMinutes: 45 }
    )
    renderApp(`/mock/new?from=${s.id}`)
    await screen.findByRole("heading", { name: "New mock interview" })
    expect(screen.getByRole("radio", { name: /MERN mock/ })).toBeChecked()
    expect(
      screen.getByRole("combobox", { name: "Number of questions" })
    ).toHaveTextContent("15")
    expect(screen.getByText("How the score is calculated")).toBeInTheDocument()
  })
})

describe("a running session", () => {
  async function open(
    cfg: Record<string, unknown> = {},
    n = 3,
    patch: Partial<MockSession> = {}
  ) {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const s = sessionOf(ids("react", n), cfg, patch)
    await useLearnerStore.getState().createMockSession(s)
    renderApp(`/mock/${s.id}`)
    // a session with time already used reopens paused
    await screen.findByText(
      patch.elapsedSeconds
        ? /The question is hidden until you resume/
        : /Question 1 of/,
      {},
      { timeout: 15000 }
    )
    return s
  }
  const stored = (id: string) =>
    useLearnerStore.getState().mockSessions.find((m) => m.id === id)!

  it("shows one question at a time with a countdown and tracks answered and unanswered", async () => {
    const user = userEvent.setup()
    const s = await open()
    expect(screen.getByTestId("position")).toHaveTextContent("Question 1 of 3")
    expect(screen.getByTestId("clock")).toHaveTextContent(/^10:0\d left$/)
    expect(screen.getByTestId("tracker")).toHaveTextContent(
      "0 answered · 3 unanswered"
    )
    expect(screen.getByRole("timer", { name: "Time left" })).toBeInTheDocument()
    await user.type(
      screen.getByLabelText("Your answer"),
      "Keys help React track items"
    )
    expect(screen.getByTestId("tracker")).toHaveTextContent(
      "1 answered · 2 unanswered"
    )
    // no model answer anywhere while answering
    expect(screen.queryByText("Model answer")).not.toBeInTheDocument()
    await waitFor(() =>
      expect(stored(s.id).answers[0].text).toBe("Keys help React track items")
    )
  })

  it("does not fire single-key shortcuts while typing, but Ctrl+Enter saves and goes on, and Esc leaves the box", async () => {
    const user = userEvent.setup()
    const s = await open()
    const box = screen.getByLabelText("Your answer")
    await user.type(box, "n p s h ")
    expect(screen.getByTestId("position")).toHaveTextContent("Question 1 of 3") // none of them acted
    expect(box).toHaveValue("n p s h ")
    await user.keyboard("{Control>}{Enter}{/Control}")
    expect(screen.getByTestId("position")).toHaveTextContent("Question 2 of 3")
    expect(stored(s.id).answers[0].text).toBe("n p s h ")
    // Esc leaves the box; then single keys work
    await user.click(screen.getByLabelText("Your answer"))
    await user.keyboard("{Escape}")
    expect(screen.getByLabelText("Your answer")).not.toHaveFocus()
    await user.keyboard("p")
    expect(screen.getByTestId("position")).toHaveTextContent("Question 1 of 3")
    await user.keyboard("n")
    expect(screen.getByTestId("position")).toHaveTextContent("Question 2 of 3")
    await user.keyboard("{ArrowLeft}")
    expect(screen.getByTestId("position")).toHaveTextContent("Question 1 of 3")
  })

  it("skips with S, shows a hint with H (recorded as used), and documents the shortcuts", async () => {
    const user = userEvent.setup()
    const s = await open()
    ;(document.activeElement as HTMLElement).blur()
    await user.keyboard("h")
    expect(screen.getByText(/^Think about:/)).toBeInTheDocument()
    await waitFor(() => expect(stored(s.id).answers[0].hintUsed).toBe(true))
    await user.keyboard("s")
    expect(screen.getByTestId("position")).toHaveTextContent("Question 2 of 3")
    expect(stored(s.id).answers[0].skipped).toBe(true)
    expect(
      screen.getByRole("button", { name: "Question 1, skipped" })
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Keyboard shortcuts" }))
    expect(await screen.findByText("Ctrl + Enter")).toBeInTheDocument()
    expect(screen.getByText(/While you type, only/)).toBeInTheDocument()
  })

  it("hides hints when they are switched off", async () => {
    await open({ hints: false })
    expect(
      screen.queryByRole("button", { name: /Hint/ })
    ).not.toBeInTheDocument()
  })

  it("pauses with the question hidden, and a reopened session starts paused", async () => {
    const user = userEvent.setup()
    const s = await open()
    await user.click(screen.getByRole("button", { name: "Pause" }))
    expect(
      screen.getByText(/The question is hidden until you resume/)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("question-title")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Your answer")).not.toBeInTheDocument()
    await user.click(screen.getAllByRole("button", { name: "Resume" })[0])
    expect(await screen.findByTestId("question-title")).toBeInTheDocument()
    cleanup()
    // a reload: some time was used, so it comes back paused
    await useLearnerStore
      .getState()
      .updateMockSession(s.id, (x) => ({ ...x, elapsedSeconds: 30 }))
    renderApp(`/mock/${s.id}`)
    expect(
      await screen.findByText(/The question is hidden until you resume/)
    ).toBeInTheDocument()
    expect(screen.getByTestId("clock")).toHaveTextContent("9:30 left")
  })

  it("ends the timed part when time is up: typed text is kept, the rest is unanswered, and the review follows", async () => {
    const user = userEvent.setup()
    const s = await open({ durationMinutes: 1 }, 3, { elapsedSeconds: 58 })
    await user.click(
      await screen.findAllByRole("button", { name: "Resume" }).then((b) => b[0])
    )
    await user.type(
      await screen.findByLabelText("Your answer"),
      "half an answer"
    )
    await waitFor(() => expect(stored(s.id).phase).toBe("review"), {
      timeout: 8000,
    })
    const after = stored(s.id)
    expect(after.status).toBe("in-progress")
    expect(after.answers[0].text).toBe("half an answer")
    expect(after.answers.slice(1).every((a) => a.text === "")).toBe(true)
    expect(
      await screen.findByRole("heading", { name: "Rate your answers" })
    ).toBeInTheDocument()
  })

  it("resumes an in-progress session from the mock home, and can abandon it", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const s = sessionOf(ids("react", 3), {}, { current: 1, elapsedSeconds: 20 })
    await useLearnerStore.getState().createMockSession(s)
    renderApp("/mock")
    const resume = await screen.findByRole("link", { name: /^Resume$/ })
    expect(resume).toHaveAttribute("href", `/mock/${s.id}`)
    expect(screen.getByText(/question 2 of 3/)).toBeInTheDocument()
    await user.click(resume)
    await screen.findByText(/The question is hidden until you resume/)
    await user.click(
      screen.getByRole("button", { name: "Abandon this interview" })
    )
    await user.click(await screen.findByRole("button", { name: "Abandon" }))
    await waitFor(() => expect(stored(s.id).status).toBe("abandoned"))
    expect(
      useLearnerStore.getState().activity.some((a) => a.type === "mock")
    ).toBe(false)
  })

  it("full flow: finish, review (reveal first, then rate), and a result whose numbers come from those ratings", async () => {
    const user = userEvent.setup()
    const s = await open({}, 2)
    await user.type(
      screen.getByLabelText("Your answer"),
      "Keys let React track list items"
    )
    await user.keyboard("{Control>}{Enter}{/Control}")
    await user.click(screen.getByRole("button", { name: "Finish interview" }))
    await user.click(await screen.findByRole("button", { name: "Finish" }))
    // the unanswered second question stays unanswered; only the answered one is reviewed
    expect(
      await screen.findByRole("heading", { name: "Rate your answers" })
    ).toBeInTheDocument()
    expect(screen.getByTestId("review-position")).toHaveTextContent(
      "Question 1 of 1 answered · 1 not rated yet"
    )
    // rating is disabled until the model answer is revealed
    expect(
      screen.getByRole("button", { name: "Technical accuracy: 5 of 5" })
    ).toBeDisabled()
    expect(screen.queryByText("Model answer")).not.toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: /Reveal the model answer/ })
    )
    expect(screen.getByText("Model answer")).toBeInTheDocument()
    expect(screen.getByTestId("keyword-match")).toHaveTextContent(
      /Keywords mentioned: \d+ of \d+ \(text match only, it cannot judge correctness\)/
    )
    await user.click(
      screen.getByRole("button", { name: "Technical accuracy: 4 of 5" })
    )
    await user.click(
      screen.getByRole("button", { name: "Completeness: 2 of 5" })
    )
    await user.click(screen.getByRole("button", { name: "See results" }))
    expect(await screen.findByTestId("score")).toBeInTheDocument()
    // (30 x 75 + 20 x 25) / 50 = 55
    expect(screen.getByTestId("score")).toHaveTextContent("55 / 100")
    expect(screen.getByTestId("score-zero")).toHaveTextContent("28 / 100") // 55 / 2 asked
    expect(stored(s.id).status).toBe("finished")
    expect(
      useLearnerStore.getState().activity.some((a) => a.type === "mock")
    ).toBe(false) // under a minute: nothing invented
  })

  it("'rate after each answer' pauses the timer while rating, and lets you rate right away", async () => {
    const user = userEvent.setup()
    await open({ ratingMode: "each" }, 2)
    await user.type(screen.getByLabelText("Your answer"), "Keys track items")
    await user.keyboard("{Control>}{Enter}{/Control}")
    expect(
      await screen.findByText("Timer paused while you rate.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Pause" })).toBeDisabled()
    ;(document.activeElement as HTMLElement).blur()
    await user.keyboard("r")
    expect(screen.getByText("Model answer")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Confidence: 3 of 5" }))
    await user.click(screen.getByRole("button", { name: "Next question" }))
    expect(screen.getByTestId("position")).toHaveTextContent("Question 2 of 2")
    expect(
      useLearnerStore.getState().mockSessions[0].answers[0].ratings
    ).toEqual({ confidence: 3 })
  })
})

describe("the result and its formula", () => {
  it("shows a score whose formula panel numbers equal the stored ratings", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const [a, b, c] = ids("react", 3)
    const s = await seedFinished({ [a]: all5, [b]: all3, [c]: {} })
    renderApp(`/mock/${s.id}/result`)
    const score = await screen.findByTestId("score", {}, { timeout: 15000 })
    const r = scoreSession(s)
    expect(r.score).toBe(75)
    expect(score).toHaveTextContent("75 / 100")
    expect(screen.getByTestId("score-zero")).toHaveTextContent("50 / 100")
    const panel = screen.getByTestId("formula-panel")
    expect(within(panel).getByTestId(`points-${a}`)).toHaveTextContent("100")
    expect(within(panel).getByTestId(`points-${b}`)).toHaveTextContent("50")
    expect(within(panel).queryByTestId(`points-${c}`)).not.toBeInTheDocument() // unrated: no points
    expect(within(panel).getByTestId("formula-total")).toHaveTextContent(
      "Score = (100 + 50) ÷ 2 = 75"
    )
    expect(within(panel).getByTestId("formula-total")).toHaveTextContent(
      "(100 + 50) ÷ 3 = 50"
    )
    // the weights shown are the session's own
    expect(
      within(panel).getAllByText("Technical accuracy").length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/It is not an assessment of correctness/).length
    ).toBeGreaterThan(0)
    // unanswered is listed, and the two lines sit side by side
    expect(screen.getByText(/Unanswered \(1\)/)).toBeInTheDocument()
  })

  it("leaves the text match out of the score by default and shows it as a named line only when switched on", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const [a] = ids("react", 1)
    const off = await seedFinished({ [a]: { accuracy: 5 } })
    renderApp(`/mock/${off.id}/result`)
    expect(
      await screen.findByTestId("score", {}, { timeout: 15000 })
    ).toHaveTextContent("100 / 100") // keywords 1 of 4 did not count
    expect(
      screen.queryByText("Keyword coverage (text match)")
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        /Keyword coverage \(a text match\) is not part of this score/
      )
    ).toBeInTheDocument()
    cleanup()
    const on = await seedFinished(
      { [a]: { accuracy: 5 } },
      { includeKeywords: true }
    )
    renderApp(`/mock/${on.id}/result`)
    await screen.findByTestId("score")
    // (30 x 100 + 10 x 25) / 40 = 81.25
    expect(screen.getByTestId("score")).toHaveTextContent("81 / 100")
    expect(
      screen.getAllByText("Keyword coverage (text match)").length
    ).toBeGreaterThan(0)
  })

  it("labels strong and weak modules, offers the revision queue only after confirmation, and never un-flags", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const [a1, a2] = ids("react", 2)
    const [b1, b2] = ids("javascript", 2)
    const s = await seedFinished({
      [a1]: all5,
      [a2]: all5,
      [b1]: { accuracy: 1 },
      [b2]: { accuracy: 2 },
    })
    await useLearnerStore.getState().setFlag(b1, "revision", true)
    renderApp(`/mock/${s.id}/result`)
    await screen.findByTestId("score", {}, { timeout: 15000 })
    expect(
      screen.getByRole("heading", { name: "Strong areas" }).parentElement
    ).toHaveTextContent("React")
    expect(
      screen.getByRole("heading", { name: "Weak areas" }).parentElement
    ).toHaveTextContent("JavaScript")
    expect(
      screen.getByRole("link", { name: /^Revise JavaScript/ })
    ).toHaveAttribute(
      "href",
      expect.stringMatching(/\/interview\/.+\/javascript$/)
    )
    expect(useLearnerStore.getState().progress[b2]?.revision).toBeFalsy() // nothing automatic
    await user.click(
      screen.getByRole("button", {
        name: /Add 2 questions to my revision queue/,
      })
    )
    await user.click(
      await screen.findByRole("button", { name: "Add to revision queue" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[b2].revision).toBe(true)
    )
    expect(useLearnerStore.getState().progress[b1].revision).toBe(true) // still flagged
    expect(useLearnerStore.getState().progress[a1]?.revision).toBeFalsy()
  })

  it("copies a plain-text summary and has a print layout", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const [a] = ids("react", 1)
    const s = await seedFinished({ [a]: all5 })
    renderApp(`/mock/${s.id}/result`)
    await screen.findByTestId("score", {}, { timeout: 15000 })
    let copied = ""
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (t: string) => {
          copied = t
        },
      },
    })
    await user.click(
      screen.getByRole("button", { name: /Copy summary as text/ })
    )
    await waitFor(() =>
      expect(copied).toContain(
        "Score on the questions I answered and rated: 100 / 100"
      )
    )
    expect(copied).toContain(titleOf(a))
    expect(copied).toContain("Technical accuracy 5")
    expect(copied).toContain("It is not an assessment of correctness")
    expect(screen.getByRole("button", { name: /Print/ })).toBeInTheDocument()
  })
})

describe("history, dashboard and the chart", () => {
  it("draws the chart only from two or more real finished sessions, with an equivalent table", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/mock/history")
    expect(await screen.findByTestId("no-chart")).toHaveTextContent(
      "No finished and rated mock interview yet"
    )
    cleanup()
    const [a] = ids("react", 1)
    await seedFinished({ [a]: all5 })
    renderApp("/mock/history")
    expect(await screen.findByTestId("no-chart")).toHaveTextContent(
      "One rated interview so far"
    )
    cleanup()
    await seedFinished({ [a]: all3 })
    // an unrated and an abandoned session never reach the chart
    await useLearnerStore
      .getState()
      .createMockSession({ ...sessionOf([a]), status: "abandoned" })
    renderApp("/mock/history")
    await screen.findByRole("img", {
      name: /Score of each of your 2 rated mock interviews/,
    })
    expect(screen.queryByTestId("no-chart")).not.toBeInTheDocument()
    const table = screen.getByRole("table", {
      name: /Score of each rated mock interview/,
    })
    expect(within(table).getAllByRole("row")).toHaveLength(3)
    expect(screen.getByText(/Abandoned/)).toBeInTheDocument()
  })

  it("deletes a session from the history after confirming, and shows N done and the last score on the dashboard", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const [a] = ids("react", 1)
    const s = await seedFinished({ [a]: all5 })
    renderApp("/dashboard")
    const card = (
      await screen.findAllByRole("link", { name: /Mock interviews/ })
    ).find((x) => x.getAttribute("href") === "/mock")!
    expect(card).toHaveTextContent("1 done, last score 100")
    cleanup()
    renderApp("/mock/history")
    await user.click(
      await screen.findByRole("button", { name: /^Delete the Technical mock/ })
    )
    await user.click(await screen.findByRole("button", { name: "Delete" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().mockSessions.find((m) => m.id === s.id)
      ).toBeUndefined()
    )
  })
})

describe("honesty: no machine-grading claims", () => {
  const FORBIDDEN =
    /\bAI\b|\bAI-|\bmachine[- ](?:graded|evaluated|scored)\b|\bauto-?grad\w*|\bgrad(?:e|ed|es|ing)\b|\bevaluat\w*|evaluated by|\bfeedback from\b|\bsemantic\b|\bsmart (?:feedback|analysis)\b/i

  it("appears nowhere in the mock feature's source strings", () => {
    const sources = import.meta.glob(
      "/src/{features/mock,services/mock,data/mock}/*.{ts,tsx}",
      { query: "?raw", import: "default", eager: true }
    ) as Record<string, string>
    const files = Object.entries(sources).filter(
      ([p]) => !/\.test\.tsx?$/.test(p)
    )
    expect(files.length).toBeGreaterThan(10)
    for (const [path, text] of files) {
      const code = text
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "")
      expect(code.match(FORBIDDEN)?.[0] ?? null, path).toBeNull()
    }
  })

  it("appears nowhere on the rendered setup and result pages", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/mock/new")
    await screen.findByRole("heading", { name: "New mock interview" })
    expect(document.body.textContent?.match(FORBIDDEN)?.[0] ?? null).toBeNull()
    cleanup()
    const [a] = ids("react", 1)
    const s = await seedFinished({ [a]: all5 })
    renderApp(`/mock/${s.id}/result`)
    await screen.findByTestId("score", {}, { timeout: 15000 })
    expect(document.body.textContent?.match(FORBIDDEN)?.[0] ?? null).toBeNull()
  })
})
