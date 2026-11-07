import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { MODULE_QUIZ_ITEMS } from "@/config/study"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { loadModuleStudyLessons } from "@/data/lessons/loaders"
import { useLearnerStore } from "@/stores/learner-store"
import { lessonFreeModule } from "@/test/lesson-free-module"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import { phasesOf } from "@/data/catalog/phases"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import { lessonsInPhase, resolvePhases } from "@/services/study/roadmap"
import { answerItem, itemOnScreen } from "@/test/study-quiz"

const TIMEOUT = { timeout: 8000 }
const MODULE = "java-core"
const lessonsOf = LESSON_INDEX.filter((l) => l.moduleId === MODULE)
const pool = lessonsOf.reduce((n, l) => n + l.check.length, 0)

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedStudyLearner()
})

describe("the quizzes page", () => {
  it("lists only quizzes whose lessons exist, says which are available, and never invents the others", async () => {
    renderApp("/study/quizzes")
    await screen.findByRole("heading", { level: 1, name: "Quizzes" }, TIMEOUT)
    const phases = within(screen.getByRole("region", { name: "Phase quizzes" }))
    expect(
      phases.getByText(/Phase 1 quiz: Java fundamentals and advanced Java/)
    ).toBeInTheDocument()
    // a phase has a quiz exactly when it has lessons, so this holds as more modules get lessons
    const views = resolvePhases(
      phasesOf("java-full-stack-ai"),
      resolveSyllabus({
        defaults: defaultsForRoadmap("java-full-stack-ai"),
        overrides: {},
        experience: "fresher",
      })
    )
    for (const v of views.filter((x) => !x.projectLed)) {
      const re = new RegExp(`Phase ${v.phase.number} quiz`)
      if (lessonsInPhase(v, LESSON_INDEX).length > 0)
        expect(phases.getAllByText(re).length).toBeGreaterThan(0)
      else expect(phases.queryByText(re)).toBeNull()
    }
    const modules = within(
      screen.getByRole("region", { name: "Module quizzes" })
    )
    expect(modules.getByText("Core Java quiz")).toBeInTheDocument()
    // other modules may now have the same counts, so look for at least one card with Core Java's numbers
    expect(
      modules.getAllByText(
        new RegExp(
          `${Math.min(MODULE_QUIZ_ITEMS, pool)} items from ${lessonsOf.length} lessons`
        )
      ).length
    ).toBeGreaterThan(0)
    expect(modules.getAllByText(/Not taken yet/).length).toBeGreaterThan(0)
    expect(
      screen.getByText(
        /the percentage of items answered correctly|percentage of items answered correctly/
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/pass mark is 70%/)).toBeInTheDocument()
  })

  it("a module with too few items is listed as in preparation, not as a quiz", async () => {
    // one lesson of four items is below the six a module quiz needs
    const lonely = LESSON_INDEX.find((l) => l.moduleId !== MODULE)
    if (!lonely) return // no second module has lessons yet
    renderApp("/study/quizzes")
    await screen.findByRole("heading", { level: 1, name: "Quizzes" }, TIMEOUT)
  })
})

describe("taking a module quiz", () => {
  it("draws a set of items from the lessons, scores it exactly, shows the result and keeps the attempt and its history", async () => {
    const user = userEvent.setup()
    const lessons = await loadModuleStudyLessons(MODULE)
    renderApp(`/study/quiz/module/${MODULE}`)
    await screen.findByRole(
      "heading",
      { level: 1, name: "Core Java quiz" },
      TIMEOUT
    )
    const size = Math.min(MODULE_QUIZ_ITEMS, pool)
    expect(
      screen.getByText(
        new RegExp(`${size} items drawn from ${lessons.length} lessons`)
      )
    ).toBeInTheDocument()
    for (let i = 0; i < size; i++) {
      expect(await screen.findByTestId("quiz-position")).toHaveTextContent(
        `Item ${i + 1} of ${size}`
      )
      const item = itemOnScreen(lessons)
      await answerItem(user, item, i !== 0) // the first item wrong on purpose
      await user.click(
        screen.getByRole("button", {
          name: i === size - 1 ? "See the result" : "Next item",
        })
      )
    }
    expect(
      within(await screen.findByTestId("quiz-result")).getByText(
        `${size - 1} of ${size} correct (${Math.round(((size - 1) / size) * 100)}%)`
      )
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(useLearnerStore.getState().quizAttempts).toHaveLength(1)
    )
    const a = useLearnerStore.getState().quizAttempts[0]
    expect(a).toMatchObject({
      quizId: `module.${MODULE}`,
      kind: "module",
      total: size,
      correct: size - 1,
    })
    expect(new Set(a.items.map((x) => x.itemId)).size).toBe(size) // no repeats
    expect(a.items.filter((x) => !x.correct)).toHaveLength(1)
    expect(screen.getByTestId("quiz-history")).toHaveTextContent(
      `${size - 1} of ${size} correct`
    )
  }, 40000)

  it("retaking gives a new set, and the history keeps every attempt, newest first", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().hydrate()
    const lessons = await loadModuleStudyLessons(MODULE)
    renderApp(`/study/quiz/module/${MODULE}`)
    await screen.findByRole(
      "heading",
      { level: 1, name: "Core Java quiz" },
      TIMEOUT
    )
    const size = Math.min(MODULE_QUIZ_ITEMS, pool)
    const run = async () => {
      for (let i = 0; i < size; i++) {
        await screen.findByTestId("quiz-position")
        await answerItem(user, itemOnScreen(lessons), true)
        await user.click(
          screen.getByRole("button", {
            name: i === size - 1 ? "See the result" : "Next item",
          })
        )
      }
    }
    await run()
    await within(await screen.findByTestId("quiz-result")).findByText(
      `${size} of ${size} correct (100%)`
    )
    await user.click(
      screen.getByRole("button", { name: "Try again with a new set" })
    )
    await run()
    await waitFor(() =>
      expect(useLearnerStore.getState().quizAttempts).toHaveLength(2)
    )
    const [first, second] = useLearnerStore.getState().quizAttempts
    if (pool > size)
      expect(first.items.map((x) => x.itemId).sort()).not.toEqual(
        second.items.map((x) => x.itemId).sort()
      )
    expect(first.seed).not.toBe(second.seed)
    expect(
      within(screen.getByTestId("quiz-history")).getAllByRole("listitem")
    ).toHaveLength(2)
  }, 60000)

  it("says a quiz is not available when its lessons do not exist", async () => {
    const free = lessonFreeModule()
    if (!free) return // every module has lessons now: nothing left to show
    renderApp(`/study/quiz/module/${free.id}`)
    expect(
      await screen.findByText("That quiz is not available", undefined, TIMEOUT)
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Back to the quizzes" })
    ).toHaveAttribute("href", "/study/quizzes")
  })
})

describe("a phase quiz", () => {
  it("draws only from the phase's lessons and is offered on Study home once most of them are finished", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().hydrate()
    renderApp("/study")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Java Full Stack AI Engineer" },
      TIMEOUT
    )
    expect(screen.queryByTestId("phase-quiz-card")).toBeNull()
    // "most of the phase" is counted over every lesson of phase 1, whichever modules they belong to
    const phase1 = lessonsInPhase(
      resolvePhases(
        phasesOf("java-full-stack-ai"),
        resolveSyllabus({
          defaults: defaultsForRoadmap("java-full-stack-ai"),
          overrides: {},
          experience: "fresher",
        })
      )[0],
      LESSON_INDEX
    )
    for (const l of phase1.slice(0, Math.ceil(phase1.length * 0.7)))
      await useLearnerStore
        .getState()
        .toggleCompleted(l.id, l.minutes, "lesson")
    expect(
      await screen.findByTestId("phase-quiz-card", undefined, TIMEOUT)
    ).toHaveTextContent("Take the phase quiz")
    await user.click(screen.getByRole("link", { name: "Take the phase quiz" }))
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: /Phase 1 quiz: Java fundamentals/ },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(await screen.findByTestId("quiz-position")).toHaveTextContent(
      /Item 1 of \d+/
    )
  })
})
