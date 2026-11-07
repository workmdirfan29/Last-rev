import { loadModuleQuestions } from "@/data/questions/loaders"
import { getModule } from "@/data/catalog/modules"
import { moduleIdsForRoles } from "@/services/curriculum/relevance"
import { questionsIn } from "@/test/content-counts"
import { DEFAULT_FILTERS, filterQuestions } from "@/services/content/search"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"
import { useLearnerStore } from "@/stores/learner-store"

const QID = "react.fresher.keys-in-lists"
const TIMEOUT = { timeout: 10000 }

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("onboarding", () => {
  it("sends a new learner from any app route to onboarding", async () => {
    const { router } = renderApp("/dashboard")
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
    expect(router.state.location.pathname).toBe("/start/interview")
  })

  it("requires a career path, then completes the flow and lands on the dashboard", async () => {
    const user = userEvent.setup()
    const { router } = renderApp("/start/interview")
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)

    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(
      await screen.findByText("Pick at least one career path")
    ).toBeInTheDocument()

    const card = screen
      .getByText("Frontend Developer", { selector: "h3" })
      .closest("article")!
    await user.click(
      within(card).getByRole("button", { name: "Start preparation" })
    )
    expect(
      within(card).getByRole("button", { name: /Selected/ })
    ).toHaveAttribute("aria-pressed", "true")

    await user.click(screen.getByRole("button", { name: /^Continue/ })) // experience
    await screen.findByText("How much experience do you have?")
    await user.click(screen.getByRole("button", { name: /^Continue/ })) // skills (optional)
    await screen.findByText("What do you already know?")
    await user.click(screen.getByRole("button", { name: /^Skip/ }))
    await screen.findByText("Set your pace")
    await user.type(screen.getByLabelText(/Your name/), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Review your preparation syllabus")
    await user.click(screen.getByRole("button", { name: "Start preparing" }))

    await waitFor(
      () => expect(router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )
    expect(await screen.findByText(/Asha/, {}, TIMEOUT)).toBeInTheDocument()

    const profile = useLearnerStore.getState().profile!
    expect(profile.selectedRoles).toEqual(["frontend-developer"])
    expect(profile.primaryRole).toBe("frontend-developer")
    expect(profile.targetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(profile.onboardedAt).toBeTruthy()
  })

  it("rejects a custom target date in the past", async () => {
    const user = userEvent.setup()
    renderApp("/start/interview")
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
    const card = screen
      .getByText("Frontend Developer", { selector: "h3" })
      .closest("article")!
    await user.click(within(card).getByRole("button"))
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await user.click(screen.getByRole("button", { name: /^Skip/ }))
    await screen.findByText("Set your pace")
    await user.click(screen.getByRole("radio", { name: /Pick a date/ }))
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Choose a target date")).toBeInTheDocument()
    expect(screen.getByText("Set your pace")).toBeInTheDocument() // still on this step
  })
})

describe("dashboard", () => {
  it("shows today's real plan to a new learner, with plain wording and no fabricated numbers", async () => {
    await seedOnboardedLearner()
    renderApp("/dashboard")
    expect(
      await screen.findByText(
        /You have not completed anything yet\. Your plan starts today/,
        {},
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(screen.getByText("0 days", { exact: false })).toBeInTheDocument() // streak
    expect(
      screen.getAllByRole("checkbox", { name: /Mark .* \(\d+ min\) done/ })
        .length
    ).toBeGreaterThan(0)
    expect(screen.queryByText(/sample data/i)).not.toBeInTheDocument()
  })

  it("reflects real completion and persists it in the store", async () => {
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleCompleted(QID, 4)
    renderApp("/dashboard")
    expect(await screen.findByText("1 day", {}, TIMEOUT)).toBeInTheDocument()
    expect(screen.getAllByText(/4 min/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/sample data/i)).not.toBeInTheDocument()
  })
})

describe("question page", () => {
  it("completes, bookmarks, rates and links to prev/next in module order", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    renderApp(`/interview/question/${QID}`)
    await screen.findByRole(
      "heading",
      { level: 1, name: /Why do we need keys/ },
      TIMEOUT
    )

    await user.click(screen.getByRole("button", { name: "Mark completed" }))
    await user.click(screen.getByRole("button", { name: "Bookmark" }))
    await user.click(screen.getByRole("button", { name: "Mark difficult" }))
    await user.click(
      within(screen.getByRole("group", { name: "Your confidence" })).getByRole(
        "button",
        { name: "4" }
      )
    )

    await waitFor(() => {
      const p = useLearnerStore.getState().progress[QID]
      expect(p).toMatchObject({
        completed: true,
        bookmarked: true,
        difficult: true,
        confidence: 4,
      })
      expect(p.nextReviewAt).toBeTruthy()
    })

    const prev = screen.getByRole("link", { name: /Previous/ })
    const next = screen.getByRole("link", { name: /Next/ })
    expect(prev).toHaveAttribute(
      "href",
      "/interview/question/react.fresher.virtual-dom"
    )
    expect(next).toHaveAttribute(
      "href",
      "/interview/question/react.fresher.controlled-vs-uncontrolled"
    )
  })

  it("switches between quick and deep modes", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    renderApp(`/interview/question/${QID}`)
    await screen.findByText("Say it in an interview", {}, TIMEOUT)
    await user.click(screen.getByRole("tab", { name: "Deep learning" }))
    expect(await screen.findByText("Common mistakes")).toBeInTheDocument()
    expect(useLearnerStore.getState().preferences.answerMode).toBe("deep")
  })

  it("hides the answer in self-test mode until revealed", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    renderApp(`/interview/question/${QID}`)
    await screen.findByText("Say it in an interview", {}, TIMEOUT)
    await user.click(screen.getByLabelText("Hide answers until I reveal them"))
    expect(screen.queryByText("Say it in an interview")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Reveal answer/ }))
    expect(
      await screen.findByText("Say it in an interview")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Hide answer/ }))
    expect(screen.queryByText("Say it in an interview")).not.toBeInTheDocument()
  })

  it("autosaves notes", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    renderApp(`/interview/question/${QID}`)
    const box = await screen.findByLabelText("Your notes", {}, TIMEOUT)
    await user.type(box, "index keys break on insert")
    await user.tab() // blur flushes immediately
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID]?.note).toBe(
        "index keys break on insert"
      )
    )
  })

  it("shows a revision prompt when a completed question is due and reschedules on review", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleCompleted(QID, 3)
    useLearnerStore.setState((s) => ({
      progress: {
        ...s.progress,
        [QID]: { ...s.progress[QID], nextReviewAt: "2020-01-01T00:00:00.000Z" },
      },
    }))
    renderApp(`/interview/question/${QID}`)
    const region = await screen.findByRole(
      "region",
      { name: "Revision due" },
      TIMEOUT
    )
    await user.click(within(region).getByRole("button", { name: "5" }))
    await waitFor(() => {
      const p = useLearnerStore.getState().progress[QID]
      expect(p.revisionStage).toBe(1)
      expect(new Date(p.nextReviewAt!).getTime()).toBeGreaterThan(Date.now())
    })
    await waitFor(() =>
      expect(
        screen.queryByRole("region", { name: "Revision due" })
      ).not.toBeInTheDocument()
    )
  })

  it("shows a friendly state for an unknown question id", async () => {
    await seedOnboardedLearner()
    renderApp("/interview/question/react.fresher.does-not-exist")
    expect(
      await screen.findByText("Question not found", {}, TIMEOUT)
    ).toBeInTheDocument()
  })
})

describe("library", () => {
  it("filters by search text from the URL and by status", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleCompleted(QID)
    // The library searches the full question text, so derive the expected count from the loaded questions.
    const reactQuestions = await loadModuleQuestions("react")
    const matching = filterQuestions(
      reactQuestions,
      { ...DEFAULT_FILTERS, query: "keys" },
      {},
      (id) => getModule(id)?.title
    ).length
    const { router } = renderApp("/interview/frontend-developer/react?q=keys")
    await screen.findByText(
      new RegExp(`Showing ${matching} of ${questionsIn("react").length}`),
      {},
      TIMEOUT
    )
    expect(screen.getByText(/Why do we need keys/)).toBeInTheDocument()

    await user.clear(screen.getByLabelText("Search questions"))
    await user.type(screen.getByLabelText("Search questions"), "zzzznotfound")
    expect(
      await screen.findByText("No questions match these filters")
    ).toBeInTheDocument()
    await user.click(screen.getAllByRole("button", { name: /Clear/ })[0])
    await screen.findByText(
      new RegExp(
        `Showing ${questionsIn("react").length} of ${questionsIn("react").length}`
      )
    )
    expect(router.state.location.search).toBe("")
  })

  it("lists unavailable modules as locked rather than linking to empty pages", async () => {
    await seedOnboardedLearner()
    renderApp("/interview")
    await screen.findByText("Common interview questions", {}, TIMEOUT)
    // Data-driven: which modules still have no questions changes as content is released. Once every module of
    // the role has questions there is nothing "in preparation" to check.
    const planned = moduleIdsForRoles(["frontend-developer"]).find(
      (id) => getModule(id)?.contentStatus === "planned"
    )
    if (planned)
      expect(await screen.findAllByText("In preparation")).not.toHaveLength(0)
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"))
    expect(hrefs).toContain("/interview/frontend-developer/react")
    // a module of this role that has no questions yet is shown, but not linked
    if (planned)
      expect(hrefs).not.toContain(`/interview/frontend-developer/${planned}`)
  })
})

describe("library", () => {
  // Lists, counts, sidebar, mobile picker and the /bookmarks redirect: src/features/library/library.test.tsx
  it("opens the old /bookmarks URL on the Saved list", async () => {
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleFlag(QID, "bookmarked")
    const { router } = renderApp("/bookmarks")
    expect(
      await screen.findByText(/Why do we need keys/, {}, TIMEOUT)
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe("/library/saved")
  })
})

describe("settings", () => {
  it("validates custom revision intervals", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    renderApp("/settings")
    const input = await screen.findByLabelText(
      /Days \(comma separated/,
      {},
      TIMEOUT
    )
    await user.clear(input)
    await user.type(input, "5, 3")
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /each larger than the one before/
    )
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
    await user.clear(input)
    await user.type(input, "2, 4, 9")
    await user.click(screen.getByRole("button", { name: "Save" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().preferences.revisionIntervals).toEqual([
        2, 4, 9,
      ])
    )
  })

  it("resets all data only after confirmation", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleCompleted(QID)
    const { router } = renderApp("/settings")
    await user.click(
      await screen.findByRole("button", { name: /Reset everything/ }, TIMEOUT)
    )
    await user.click(await screen.findByRole("button", { name: "Cancel" }))
    expect(useLearnerStore.getState().progress[QID]).toBeDefined()

    await user.click(screen.getByRole("button", { name: /Reset everything/ }))
    await user.click(
      await screen.findByRole("button", { name: "Delete everything" })
    )
    await waitFor(() => expect(useLearnerStore.getState().progress).toEqual({}))
    await waitFor(() => expect(router.state.location.pathname).toBe("/"))
  })

  it("imports a valid backup after confirmation and rejects garbage", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleCompleted(QID)
    const backup = JSON.stringify(useLearnerStore.getState().exportData())
    await useLearnerStore.getState().resetAll()
    await seedOnboardedLearner()

    renderApp("/settings")
    const input = (await screen.findByLabelText(
      "Choose a LastRev backup file",
      {},
      TIMEOUT
    )) as HTMLInputElement

    await user.upload(
      input,
      new File(["{nope"], "bad.json", { type: "application/json" })
    )
    expect(useLearnerStore.getState().progress[QID]).toBeUndefined() // nothing changed

    await user.upload(
      input,
      new File([backup], "good.json", { type: "application/json" })
    )
    await user.click(
      await screen.findByRole("button", { name: "Replace my data" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID]?.completed).toBe(true)
    )
  })
})

describe("routing", () => {
  it("shows a not-found page for unknown routes", async () => {
    await seedOnboardedLearner()
    renderApp("/definitely/not/a/page")
    expect(
      await screen.findByText("Page not found", {}, TIMEOUT)
    ).toBeInTheDocument()
  })
})
