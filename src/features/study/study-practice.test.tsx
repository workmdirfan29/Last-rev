import { useState } from "react"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { useLearnerStore } from "@/stores/learner-store"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import type { StudyExercise } from "@/types/lesson"
import type { RunReport } from "@/services/study/sandbox/report"
import { RunnablePanel, SANDBOX_NOTE } from "./practice/runnable-panel"
import { ExerciseView } from "./lesson/exercise-view"

const TIMEOUT = { timeout: 8000 }
const runMock = vi.hoisted(() => ({ report: null as RunReport | null }))
vi.mock("@/services/study/sandbox/sandbox", async (orig) => {
  const real = await orig<typeof import("@/services/study/sandbox/sandbox")>()
  return {
    ...real,
    // jsdom has no Worker: the tests choose what the sandbox answers
    sandboxSupported: () => true,
    runInSandbox: async () =>
      runMock.report ??
      (await real.runInSandbox({ code: "", entry: "f", cases: [] })),
  }
})

beforeEach(async () => {
  runMock.report = null
  localStorage.clear()
  await resetLearner()
  await seedStudyLearner()
})

const exercise: StudyExercise = {
  slug: "sum",
  title: "Sum two numbers",
  task: ["Write `sum(a, b)`."],
  language: "javascript",
  starter: "function sum(a, b) {\n}",
  solution: "function sum(a, b) { return a + b }",
  hints: [],
  checklist: ["returns a value", "handles negatives"],
  run: {
    entry: "sum",
    cases: [
      { name: "one", args: [1, 2], expected: 3 },
      { name: "two", args: [-1, 1], expected: 0 },
      { name: "three", args: [0, 0], expected: 0 },
    ],
  },
}
const report = (
  passed: boolean[],
  extra: Partial<RunReport> = {}
): RunReport => ({
  status: "ok",
  cases: passed.map((p, i) => ({
    name: ["one", "two", "three"][i],
    passed: p,
    expected: "3",
    actual: p ? "3" : "1",
  })),
  logs: [],
  truncated: false,
  ...extra,
})

describe("the practice list", () => {
  it("lists every exercise with its module and says which can be run and which are not run by LastRev", async () => {
    renderApp("/study/practice")
    await screen.findByRole("heading", { level: 1, name: "Practice" }, TIMEOUT)
    const all = LESSON_INDEX.flatMap((l) => l.exercises)
    const rows = within(
      screen.getByRole("list", { name: "Exercises" })
    ).getAllByRole("link")
    expect(rows).toHaveLength(all.length)
    if (all.some((x) => !x.runnable))
      expect(screen.getAllByText("Not run by LastRev").length).toBeGreaterThan(
        0
      )
    expect(screen.getByText(/Showing \d+ of \d+/)).toBeInTheDocument()
  })

  it("filters by kind and says so when nothing matches", async () => {
    const user = userEvent.setup()
    renderApp("/study/practice")
    await screen.findByRole("heading", { level: 1, name: "Practice" }, TIMEOUT)
    await user.selectOptions(screen.getByLabelText("Kind"), "run")
    const runnable = LESSON_INDEX.flatMap((l) => l.exercises).filter(
      (e) => e.runnable
    ).length
    expect(
      screen.getByText(
        `Showing ${runnable} of ${LESSON_INDEX.flatMap((l) => l.exercises).length}`
      )
    ).toBeInTheDocument()
  })

  it("opens a self-check exercise on its own page with the not-run label", async () => {
    const l = LESSON_INDEX.find((x) => x.exercises.some((e) => !e.runnable))!
    const e = l.exercises.find((x) => !x.runnable)!
    renderApp(`/study/practice/${l.moduleId}/${l.slug}/${e.slug}`)
    expect(
      await screen.findByRole("heading", { level: 1, name: e.title }, TIMEOUT)
    ).toBeInTheDocument()
    expect(screen.getByText("Not run by LastRev")).toBeInTheDocument()
    expect(screen.queryByTestId("runnable-panel")).toBeNull()
  })

  it("an unknown exercise says so", async () => {
    renderApp("/study/practice/java-core/first-program/nope")
    expect(
      await screen.findByText("Exercise not found", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })
})

describe("the runnable exercise panel", () => {
  const panel = (onPassed = vi.fn()) =>
    render(
      <MemoryRouter>
        <ExerciseView
          moduleId="javascript"
          lessonSlug="functions"
          exercise={exercise}
          runner={{
            passed: false,
            node: <RunnablePanel exercise={exercise} onPassed={onPassed} />,
          }}
        />
      </MemoryRouter>
    )

  it("states the limits plainly, including that memory is not limited and that a pass is the learner's own check", () => {
    panel()
    expect(screen.getByText(SANDBOX_NOTE)).toBeInTheDocument()
    expect(SANDBOX_NOTE).toMatch(/no network/)
    expect(SANDBOX_NOTE).toMatch(/cannot limit memory/)
    expect(SANDBOX_NOTE).toMatch(/not an official result/)
    expect(screen.getByText("Runs in an isolated sandbox")).toBeInTheDocument()
  })

  it("shows one result per case, 'N of M passed' in a live region, and keeps 'done' locked until every case passes", async () => {
    const user = userEvent.setup()
    const onPassed = vi.fn()
    runMock.report = report([true, false, true])
    panel(onPassed)
    await user.click(screen.getByRole("button", { name: /Run the tests/ }))
    const summary = await screen.findByTestId("run-summary")
    expect(summary).toHaveTextContent("2 of 3 test cases passed")
    expect(screen.getByTestId("run-result")).toHaveAttribute(
      "aria-live",
      "polite"
    )
    expect(
      within(screen.getByRole("list", { name: "Test cases" })).getAllByRole(
        "listitem"
      )
    ).toHaveLength(3)
    expect(screen.getByText(/returned 1; expected 3/)).toBeInTheDocument()
    expect(onPassed).toHaveBeenLastCalledWith(false)
    expect(
      screen.getByRole("button", { name: "Mark exercise done" })
    ).toBeDisabled()
  })

  it("reports a pass to the page only when every case passed in this visit, and editing the code withdraws it", async () => {
    const user = userEvent.setup()
    const onPassed = vi.fn()
    runMock.report = report([true, true, true])
    panel(onPassed)
    await user.click(screen.getByRole("button", { name: /Run the tests/ }))
    await waitFor(() => expect(onPassed).toHaveBeenLastCalledWith(true))
    await user.type(screen.getByLabelText(/Your code/), " ")
    expect(onPassed).toHaveBeenLastCalledWith(false)
    expect(screen.getByTestId("run-summary")).toHaveTextContent(
      "before your latest edit"
    )
  })

  it("says plainly when the browser could not prove isolation, and offers the self-check list instead", async () => {
    const user = userEvent.setup()
    runMock.report = {
      status: "unavailable",
      message:
        "This browser could not prove the code runner is isolated, so code is not run here.",
      cases: [],
      logs: [],
      truncated: false,
    }
    panel()
    await user.click(screen.getByRole("button", { name: /Run the tests/ }))
    expect(await screen.findByTestId("sandbox-unavailable")).toHaveTextContent(
      /could not prove the code runner is isolated/
    )
    expect(screen.getByTestId("sandbox-unavailable")).toHaveTextContent(
      /self-check list/
    )
  })

  it("explains a timeout, and shows console output with a note when it was cut short", async () => {
    const user = userEvent.setup()
    runMock.report = {
      status: "timeout",
      message: "The code took too long and was stopped.",
      cases: [
        {
          name: "one",
          passed: false,
          expected: "3",
          timedOut: true,
          error: "Took too long and was stopped.",
        },
        { name: "two", passed: false, expected: "0", skipped: true },
        { name: "three", passed: false, expected: "0", skipped: true },
      ],
      logs: ["hello"],
      truncated: true,
    }
    panel()
    await user.click(screen.getByRole("button", { name: /Run the tests/ }))
    expect(await screen.findByTestId("run-summary")).toHaveTextContent(
      "The code took too long and was stopped."
    )
    expect(screen.getByText(/stopped \(too slow\)/)).toBeInTheDocument()
    expect(screen.getAllByText("not run")).toHaveLength(2)
    expect(screen.getByText(/Console output \(cut short\)/)).toBeInTheDocument()
  })

  it("marking a runnable exercise done after a pass writes the progress record", async () => {
    const user = userEvent.setup()
    runMock.report = report([true, true, true])
    function Host() {
      const [passed, setPassed] = useState(false)
      return (
        <MemoryRouter>
          <ExerciseView
            moduleId="javascript"
            lessonSlug="functions"
            exercise={exercise}
            runner={{
              passed,
              node: <RunnablePanel exercise={exercise} onPassed={setPassed} />,
            }}
          />
        </MemoryRouter>
      )
    }
    render(<Host />)
    await user.click(screen.getByRole("button", { name: /Run the tests/ }))
    const done = screen.getByRole("button", { name: "Mark exercise done" })
    await waitFor(() => expect(done).toBeEnabled())
    await user.click(done)
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress["ex.javascript.functions.sum"]
          ?.completed
      ).toBe(true)
    )
  })
})
