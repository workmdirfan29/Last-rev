import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"
import { useLearnerStore } from "@/stores/learner-store"

const TIMEOUT = { timeout: 10000 }

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("sidebar toggle", () => {
  it("collapses and expands the sidebar from the header button and remembers the choice", async () => {
    await seedOnboardedLearner()
    const { container } = renderApp("/dashboard")
    await screen.findAllByRole("button", { name: /toggle sidebar/i }, TIMEOUT)
    // The header button (the sidebar rail has the same accessible name).
    const toggle = container.querySelector(
      '[data-slot="sidebar-trigger"]'
    ) as HTMLElement
    const sidebar = () =>
      container.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(sidebar().getAttribute("data-state")).toBe("expanded")

    await userEvent.click(toggle)
    await waitFor(() =>
      expect(sidebar().getAttribute("data-state")).toBe("collapsed")
    )
    expect(useLearnerStore.getState().preferences.sidebarCollapsed).toBe(true)

    await userEvent.click(toggle)
    await waitFor(() =>
      expect(sidebar().getAttribute("data-state")).toBe("expanded")
    )
    expect(useLearnerStore.getState().preferences.sidebarCollapsed).toBe(false)
  })
})
