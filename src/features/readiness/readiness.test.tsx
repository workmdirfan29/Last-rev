import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"

const TIMEOUT = { timeout: 15000 }
const react = QUESTION_INDEX.filter((q) => q.moduleId === "react")

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedOnboardedLearner()
})

describe("the readiness page", () => {
  it("shows real counts per category with the formula, 'no content' for the rest, and leaves empty analytics views honest", async () => {
    await useLearnerStore.getState().toggleCompleted(react[0].id, 3)
    await useLearnerStore.getState().setConfidence(react[0].id, 4)
    renderApp("/readiness")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Job readiness" },
      TIMEOUT
    )
    const frontend = await screen.findByTestId(
      "category-frontend",
      undefined,
      TIMEOUT
    )
    expect(frontend).toHaveTextContent(/Questions 1 of \d+ done/)
    expect(screen.getByTestId("overall")).toHaveTextContent(/^\d+%$/)
    expect(screen.getByTestId("overall-note")).toHaveTextContent(
      /Over \d+ of 18 categories/
    )
    expect(screen.getByTestId("no-content").textContent).toMatch(
      /Linux|Git|Mobile/
    )
    expect(screen.getByText(/not a hiring probability/)).toBeInTheDocument()
    const a = screen.getByTestId("analytics")
    expect(within(a).getByTestId("confidence")).toHaveTextContent("1 of 5")
    expect(within(a).getByTestId("weekly-minutes")).toHaveTextContent(
      /study time|Study minutes/
    )
    expect(
      within(a).getByText(/A trend appears after 3 weekly snapshots; you have/)
    ).toBeInTheDocument()
  })

  it("the dashboard shows the same overall number, and a snapshot is kept once for the week", async () => {
    await useLearnerStore.getState().toggleCompleted(react[0].id, 3)
    renderApp("/readiness")
    const overall = (await screen.findByTestId("overall", undefined, TIMEOUT))
      .textContent
    await waitFor(() =>
      expect(useLearnerStore.getState().readinessSnapshots).toHaveLength(1)
    )
    expect(useLearnerStore.getState().readinessSnapshots[0].overall).toBe(
      Number(overall!.replace("%", ""))
    )
  })

  it("switching a category off leaves it out of the overall and keeps the choice", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().toggleCompleted(react[0].id, 3)
    renderApp("/readiness")
    const card = await screen.findByTestId(
      "category-frontend",
      undefined,
      TIMEOUT
    )
    await user.click(within(card).getByRole("switch"))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().preferences.readinessExcluded
      ).toContain("frontend")
    )
    expect(
      within(screen.getByTestId("category-frontend")).getByText("Switched off")
    ).toBeInTheDocument()
  })
})

describe("no network", () => {
  it("the readiness feature has no network call", () => {
    const sources = {
      ...import.meta.glob("/src/features/readiness/*.tsx", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
      ...import.meta.glob("/src/services/readiness/*.ts", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
    } as Record<string, string>
    for (const [f, src] of Object.entries(sources).filter(
      ([f]) => !/\.test\./.test(f)
    ))
      expect(src, f).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket/
      )
  })
})
