import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { loadStudyLesson } from "@/data/lessons/loaders"
import { useLearnerStore } from "@/stores/learner-store"
import { lessonFreeModule } from "@/test/lesson-free-module"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import type { CheckItem } from "@/types/lesson"

const TIMEOUT = { timeout: 8000 }
// the tests below walk the first module of the Java path, so take its first lesson, not the first of the index
const first = LESSON_INDEX.find((l) => l.moduleId === "java-core")!
const lessonPath = `/study/lesson/${first.moduleId}/${first.slug}`

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedStudyLearner()
})

const FORBIDDEN =
  /\bAI\b|artificial intelligence|\bassess(?:ed|ment)?\b|graded by|scored by/i

/** Answer one check item through the UI, correctly or not. */
async function answer(
  user: ReturnType<typeof userEvent.setup>,
  item: CheckItem,
  right: boolean
) {
  const group = () => screen.getByRole("group", { name: "Options" })
  switch (item.type) {
    case "single":
    case "output": {
      const pick = right
        ? item.answer
        : item.options.findIndex((_, i) => i !== item.answer)
      await user.click(
        screen
          .getAllByRole("radio")
          .find((r) =>
            r.closest("label")?.textContent?.includes(item.options[pick])
          )!
      )
      break
    }
    case "truefalse":
      await user.click(
        screen.getByRole("radio", {
          name: (right ? item.answer : !item.answer) ? "True" : "False",
        })
      )
      break
    case "multi":
      for (const a of item.answers)
        await user.click(
          screen
            .getAllByRole("checkbox")
            .find((c) =>
              c.closest("label")?.textContent?.includes(item.options[a])
            )!
        )
      void group
      break
    case "blank":
      await user.type(
        screen.getByLabelText("Your answer"),
        right ? item.answer : "zzz"
      )
  }
  await user.click(screen.getByRole("button", { name: "Check" }))
}

describe("the lessons library", () => {
  it("lists modules that have lessons with real counts, searches lessons, and never shows a module without any", async () => {
    const user = userEvent.setup()
    renderApp("/study/lessons")
    await screen.findByRole("heading", { level: 1, name: "Lessons" }, TIMEOUT)
    // the numbers come from the index, so this keeps holding as modules gain lessons
    const moduleCount = new Set(LESSON_INDEX.map((l) => l.moduleId)).size
    expect(
      screen.getByText(
        new RegExp(
          `${LESSON_INDEX.length} lessons are ready in ${moduleCount} modules?`
        )
      )
    ).toBeInTheDocument()
    const card = screen.getByRole("link", { name: /Core Java/ })
    expect(card).toHaveAttribute("href", "/study/lessons/java-core")
    expect(
      within(card).getByText(/0 of \d+ finished · \d+ ready · covers/)
    ).toBeInTheDocument()
    // a module without a lesson is never listed: React Hooks only while it has none
    if (!LESSON_INDEX.some((l) => l.moduleId === "react-hooks"))
      expect(screen.queryByRole("link", { name: /React Hooks/ })).toBeNull()
    const target = LESSON_INDEX.find(
      (l) => l.moduleId === "java-core" && l.slug === "variables-and-operators"
    )!
    await user.type(screen.getByLabelText("Search lessons"), target.title)
    expect(
      screen.getByRole("link", { name: new RegExp(target.title) })
    ).toBeInTheDocument()
    await user.clear(screen.getByLabelText("Search lessons"))
    await user.type(screen.getByLabelText("Search lessons"), "zzzz-nothing")
    expect(screen.getByText("0 lessons match")).toBeInTheDocument()
  })

  it("a module page lists lessons by topic and says plainly which topics have none", async () => {
    renderApp("/study/lessons/java-core")
    await screen.findByRole("heading", { level: 1, name: "Core Java" }, TIMEOUT)
    expect(screen.getByRole("region", { name: first.topic })).toHaveTextContent(
      first.title
    )
    const bare = getModule("java-core")!.topicList.find(
      (t) =>
        t.minutes > 0 &&
        !LESSON_INDEX.some(
          (l) => l.moduleId === "java-core" && l.topic === t.title
        )
    )
    if (bare)
      expect(
        within(screen.getByRole("region", { name: bare.title })).getByText(
          "No lesson for this topic yet."
        )
      ).toBeInTheDocument()
    expect(screen.getByText(/Lessons (in progress|ready)/)).toBeInTheDocument()
  })

  it("a module without lessons says so", async () => {
    const free = lessonFreeModule()
    if (!free) return // every module has lessons now: nothing left to show
    renderApp(`/study/lessons/${free.id}`)
    expect(
      await screen.findByText(
        "No lessons in this module yet",
        undefined,
        TIMEOUT
      )
    ).toBeInTheDocument()
  })
})

describe("a lesson", () => {
  it("renders every authored part: sections, check, assignment, revision notes, official docs, notes", async () => {
    renderApp(lessonPath)
    await screen.findByRole("heading", { level: 1, name: first.title }, TIMEOUT)
    const lesson = (await loadStudyLesson(first.id))!
    for (const s of lesson.sections)
      if (s.kind !== "mistakes")
        expect(
          screen.getByRole("heading", { name: s.heading })
        ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Knowledge check" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        name: new RegExp(`Assignment: ${lesson.assignment.title}`),
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Revision notes" })
    ).toBeInTheDocument()
    const link = screen.getByRole("link", {
      name: new RegExp(lesson.resources[0].label),
    })
    expect(link).toHaveAttribute("href", lesson.resources[0].url)
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(screen.getByLabelText("Your notes")).toBeInTheDocument()
    expect(screen.getByTestId("lesson-status")).toHaveTextContent(
      "Knowledge check: not tried"
    )
    expect(
      screen.getByRole("navigation", { name: "On this page" })
    ).toBeInTheDocument()
    expect(document.querySelector("main")?.textContent).not.toMatch(FORBIDDEN)
  })

  it("the knowledge check scores exactly, shows the answer and explanation in a live region, and keeps the attempt", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByRole("heading", { level: 1, name: first.title }, TIMEOUT)
    const lesson = (await loadStudyLesson(first.id))!
    await user.click(screen.getByRole("button", { name: "Start the check" }))
    // the quiz shuffles options, so find each item by its prompt
    for (let i = 0; i < lesson.check.length; i++) {
      const shown = await screen.findByTestId("quiz-position")
      expect(shown).toHaveTextContent(`Item ${i + 1} of ${lesson.check.length}`)
      const prompt = (item: CheckItem) =>
        item.type === "truefalse" ? item.statement : item.prompt
      const item = lesson.check.find((c) =>
        document.body.textContent?.includes(prompt(c).replace(/`/g, ""))
      )!
      const wrong = i === 0 // get the first item wrong on purpose
      await answer(user, item, !wrong)
      const result = screen.getByTestId("check-result")
      expect(result).toHaveAttribute("aria-live", "polite")
      if (wrong) expect(result).toHaveTextContent("Not quite")
      else expect(result).toHaveTextContent("Correct")
      expect(result.textContent).toContain(item.explanation.replace(/`/g, ""))
      await user.click(
        screen.getByRole("button", {
          name: i === lesson.check.length - 1 ? "See the result" : "Next item",
        })
      )
    }
    const total = lesson.check.length
    expect(
      await screen.findByText(
        `${total - 1} of ${total} correct (${Math.round(((total - 1) / total) * 100)}%)`
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the percentage of items answered correctly/)
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(useLearnerStore.getState().quizAttempts).toHaveLength(1)
    )
    const a = useLearnerStore.getState().quizAttempts[0]
    expect(a).toMatchObject({
      quizId: first.id,
      kind: "lesson",
      total,
      correct: total - 1,
      passMark: 0.7,
    })
    expect(a.passed).toBe((total - 1) / total >= 0.7)
    expect(screen.getByTestId("lesson-status")).toHaveTextContent(
      `Knowledge check: ${total - 1} of ${total} correct`
    )
  })

  it("finishing is the learner's choice (no check needed), is a progress record that schedules revision, and logs study minutes", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByRole("heading", { level: 1, name: first.title }, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: "Mark this lesson finished" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[first.id]?.completed).toBe(
        true
      )
    )
    expect(
      useLearnerStore.getState().progress[first.id].nextReviewAt
    ).not.toBeNull()
    expect(useLearnerStore.getState().activity.at(-1)).toMatchObject({
      type: "lesson",
      minutes: first.minutes,
    })
    expect(screen.getByTestId("lesson-status")).toHaveTextContent("Finished")
  })

  it("assignment items are ticked one by one as progress records", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByRole("heading", { level: 1, name: first.title }, TIMEOUT)
    const lesson = (await loadStudyLesson(first.id))!
    const box = screen.getByRole("checkbox", {
      name: new RegExp(
        lesson.assignment.checklist[0]
          .replace(/[`.*+?^${}()|[\]\\]/g, "")
          .slice(0, 20)
      ),
    })
    await user.click(box)
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress[
          `task.${first.moduleId}.${first.slug}.1`
        ]?.completed
      ).toBe(true)
    )
    expect(screen.getByTestId("lesson-status")).toHaveTextContent(
      `Assignment: 1 of ${lesson.assignment.checklist.length} done`
    )
  })

  it("an exercise says it is not run by LastRev, needs every self-check item before it can be marked done, and notes when the solution was opened", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByRole("heading", { level: 1, name: first.title }, TIMEOUT)
    const lesson = (await loadStudyLesson(first.id))!
    const ex = lesson.exercises[0]
    const card = screen.getByRole("article", { name: `Exercise: ${ex.title}` })
    expect(within(card).getByText("Not run by LastRev")).toBeInTheDocument()
    const mark = within(card).getByRole("button", {
      name: "Mark exercise done",
    })
    expect(mark).toBeDisabled()
    for (const c of within(card).getAllByRole("checkbox")) await user.click(c)
    expect(mark).toBeEnabled()
    await user.click(mark)
    const id = `ex.${first.moduleId}.${first.slug}.${ex.slug}`
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[id]?.completed).toBe(true)
    )
    expect(within(card).queryByText("Reference solution")).toBeNull()
    await user.click(
      within(card).getByRole("button", { name: "Show the reference solution" })
    )
    expect(within(card).getByText("Reference solution")).toBeInTheDocument()
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[id].note).toContain(
        "[viewed the solution]"
      )
    )
  })

  it("a finished lesson that is due asks how well it is remembered and reschedules it", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().hydrate()
    await useLearnerStore
      .getState()
      .toggleCompleted(first.id, first.minutes, "lesson")
    useLearnerStore.setState((s) => ({
      progress: {
        ...s.progress,
        [first.id]: {
          ...s.progress[first.id],
          nextReviewAt: "2000-01-01T00:00:00.000Z",
        },
      },
    }))
    renderApp(lessonPath)
    await screen.findByTestId("revision-due", undefined, TIMEOUT)
    await user.click(screen.getByRole("radio", { name: /I knew it at once/ }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[first.id].confidence).toBe(5)
    )
    expect(
      new Date(
        useLearnerStore.getState().progress[first.id].nextReviewAt!
      ).getTime()
    ).toBeGreaterThan(Date.now())
    cleanup()
  })

  it("an unknown lesson says so with a way back", async () => {
    renderApp("/study/lesson/java-core/nope")
    expect(
      await screen.findByText("Lesson not found", undefined, TIMEOUT)
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Back to the lessons" })
    ).toHaveAttribute("href", "/study/lessons")
  })
})

describe("navigation and wording", () => {
  it("Study nav has Lessons and the Study sidebar, the pages never use AI or assessment wording", async () => {
    renderApp("/study/lessons")
    await screen.findByRole("heading", { level: 1, name: "Lessons" }, TIMEOUT)
    expect(screen.getAllByRole("link", { name: "Lessons" })[0]).toHaveAttribute(
      "href",
      "/study/lessons"
    )
    expect(document.querySelector("main")?.textContent).not.toMatch(FORBIDDEN)
  })
})
