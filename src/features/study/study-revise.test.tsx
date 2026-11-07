import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { useLearnerStore } from "@/stores/learner-store"
import { lessonFreeModule } from "@/test/lesson-free-module"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import {
  searchStudyProjects,
  searchStudyQuizzes,
} from "@/components/navigation/mode-search"

const TIMEOUT = { timeout: 8000 }
// the tests below walk the first module of the Java path, so take its first lesson, not the first of the index
const first = LESSON_INDEX.find((l) => l.moduleId === "java-core")!
const second = LESSON_INDEX[1]

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedStudyLearner()
})

const makeDue = async (...ids: string[]) => {
  await useLearnerStore.getState().hydrate()
  for (const id of ids)
    await useLearnerStore.getState().toggleCompleted(id, 10, "lesson")
  useLearnerStore.setState((s) => ({
    progress: Object.fromEntries(
      Object.entries(s.progress).map(([k, p]) => [
        k,
        ids.includes(k)
          ? { ...p, nextReviewAt: "2000-01-01T00:00:00.000Z" }
          : p,
      ])
    ),
  }))
}

describe("the Study Revise page", () => {
  it("says nothing is due when nothing is, and when the next lesson is scheduled", async () => {
    await useLearnerStore.getState().hydrate()
    await useLearnerStore.getState().toggleCompleted(first.id, 10, "lesson") // due tomorrow
    renderApp("/study/revise")
    expect(
      await screen.findByText("Nothing to revise today", undefined, TIMEOUT)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/1 finished lesson is scheduled for later/)
    ).toBeInTheDocument()
  })

  it("lists lessons that are due with the rating inline; rating one reschedules it and removes it from the list", async () => {
    const user = userEvent.setup()
    await makeDue(first.id, second.id)
    renderApp("/study/revise")
    const list = await screen.findByRole(
      "list",
      { name: "Lessons due for revision" },
      TIMEOUT
    )
    expect(within(list).getAllByTestId("revise-item")).toHaveLength(2)
    expect(screen.getByTestId("revise-status")).toHaveTextContent(
      "2 lessons are due today."
    )
    const item = within(list).getAllByTestId("revise-item")[0]
    await user.click(
      within(item).getByRole("radio", { name: /I knew it at once/ })
    )
    await waitFor(() =>
      expect(
        within(
          screen.getByRole("list", { name: "Lessons due for revision" })
        ).getAllByTestId("revise-item")
      ).toHaveLength(1)
    )
    await waitFor(() =>
      expect(screen.getByTestId("revise-status")).toHaveTextContent(
        /Saved: .*5 of 5\./
      )
    )
    const reviewed = Object.values(useLearnerStore.getState().progress).find(
      (p) => p.confidence === 5
    )!
    expect(new Date(reviewed.nextReviewAt!).getTime()).toBeGreaterThan(
      Date.now()
    )
  })

  it("the sidebar item carries a count of lessons due, and none when there are none", async () => {
    await makeDue(first.id)
    renderApp("/study")
    const link = await screen.findByRole("link", { name: /Revise/ }, TIMEOUT)
    expect(link).toHaveAttribute("href", "/study/revise")
    const entry = link.closest("li")!
    expect(entry).toHaveTextContent("1")
    expect(entry).toHaveTextContent("lesson due")
  })
})

describe("Study header search finds projects and quizzes", () => {
  it("finds the quizzes that exist (module and phase) and no others", () => {
    // search results are capped, so ask for each kind by name instead of a bare "quiz"
    const modules = searchStudyQuizzes("Core Java quiz", "java-full-stack-ai")
    expect(modules.some((h) => h.key === "module.java-core")).toBe(true)
    const phases = searchStudyQuizzes("Phase 1 quiz", "java-full-stack-ai")
    expect(
      phases.some((h) => h.key.startsWith("phase.java-full-stack-ai."))
    ).toBe(true)
    const hits = [...modules, ...phases]
    expect(hits.every((h) => h.to.startsWith("/study/quiz/"))).toBe(true)
    const free = lessonFreeModule()
    if (free)
      expect(
        searchStudyQuizzes(`${free.title} quiz`, "java-full-stack-ai")
      ).toEqual([])
    expect(searchStudyQuizzes("  ", "java-full-stack-ai")).toEqual([])
  })
  it("finds projects by title or summary (none until one is written)", () => {
    expect(searchStudyProjects("zzzz-no-such-project")).toEqual([])
    expect(searchStudyProjects("  ")).toEqual([])
  })
})
