import { screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"

/**
 * A roadmap with no lessons is a real state for a learner. Whatever lessons exist today, this file replaces the
 * lesson index with an empty one, so the state is tested without depending on how much has been written.
 */
vi.mock("@/data/lessons/index.generated", () => ({ LESSON_INDEX: [] }))

const TIMEOUT = { timeout: 8000 }

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("Study home with no lessons for the roadmap", () => {
  it("says so plainly and keeps the plan working", async () => {
    await seedStudyLearner({ studyRoadmap: "mern-full-stack-ai" })
    renderApp("/study")
    await screen.findByRole(
      "heading",
      { level: 1, name: "MERN Full Stack AI Engineer" },
      TIMEOUT
    )
    expect(screen.getByTestId("no-next-lesson")).toHaveTextContent(
      "No lessons are ready for your roadmap yet."
    )
    expect(
      screen.getByRole("region", { name: /Today's study plan/ })
    ).toBeInTheDocument()
  })
})
