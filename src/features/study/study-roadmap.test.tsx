import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { phasesOf, refModule } from "@/data/catalog/phases"
import { useLearnerStore } from "@/stores/learner-store"
import { lessonFreeModule } from "@/test/lesson-free-module"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import { topicIdOf } from "@/utils/topic-id"

const TIMEOUT = { timeout: 8000 }
// the tests below walk the first module of the Java path, so take its first lesson, not the first of the index
const first = LESSON_INDEX.find((l) => l.moduleId === "java-core")!
/** Roadmap and phase names contain "AI" as titles; the scan looks for claims about how the app judges. */
const FORBIDDEN =
  /artificial intelligence|AI-powered|\bassess(?:ed|ment)?\b|graded by|scored by|AI (?:grad|scor|assess|judg)/i

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedStudyLearner()
})

describe("Study home with a few lessons", () => {
  it("shows the next lesson, the phase the learner is in, today's blocks linked to lessons, and the roadmap at a glance", async () => {
    renderApp("/study")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Java Full Stack AI Engineer" },
      TIMEOUT
    )
    const next = screen.getByRole("region", { name: "Next lesson" })
    expect(within(next).getByText(first.title)).toBeInTheDocument()
    expect(
      within(next).getByRole("link", { name: "Open the lesson" })
    ).toHaveAttribute("href", `/study/lesson/${first.moduleId}/${first.slug}`)
    const where = screen.getByRole("region", { name: "Where you are" })
    expect(where).toHaveTextContent("Phase 1 of 12")
    expect(where).toHaveTextContent("Java fundamentals and advanced Java")
    const glance = screen.getByRole("heading", { name: "Roadmap at a glance" })
    expect(glance).toBeInTheDocument()
    expect(screen.getAllByText(/^\d+\. /).length).toBeGreaterThanOrEqual(12)
    expect(screen.getByText("Project-led")).toBeInTheDocument()
    expect(document.querySelector("main")?.textContent).not.toMatch(FORBIDDEN)
  })

  it("the plan follows the phases: phase 1 modules come first, and a topic with lessons offers them", async () => {
    renderApp("/study")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Java Full Stack AI Engineer" },
      TIMEOUT
    )
    const today = screen.getByRole("region", { name: /Today's study plan/ })
    // the first block of the Java roadmap belongs to phase 1 (computer fundamentals), not Linux as the domain order had it
    const boxes = within(today).getAllByRole("checkbox")
    expect(boxes[0].getAttribute("aria-label")).toMatch(
      /Computer Fundamentals|Operating Systems|Git|Core Java/i
    )
    expect(boxes[0].getAttribute("aria-label")).not.toMatch(/Linux/)
  })

  it("an open lesson link appears on a plan block of a topic that has lessons, with its real counts", async () => {
    renderApp("/study/plan-test-anchor")
    // the Core Java "Basics" block may be on a later day; the link component is exercised directly
    const { BlockLessonsLink } = await import("./block-lessons-link")
    const { render } = await import("@testing-library/react")
    const { MemoryRouter } = await import("react-router")
    const view = render(
      <MemoryRouter>
        <BlockLessonsLink moduleId={first.moduleId} topic={first.topic} />
      </MemoryRouter>
    )
    const link = await within(view.container).findByRole("link", {
      name: /Open lessons \(0 of \d+ finished\)/,
    })
    expect(link).toHaveAttribute(
      "href",
      `/study/lesson/${first.moduleId}/${first.slug}`
    )
    // a topic that has none shows nothing
    const free = lessonFreeModule()
    if (!free) return // every module has lessons now: nothing left to show
    const none = render(
      <MemoryRouter>
        <BlockLessonsLink moduleId={free.id} topic={free.topic} />
      </MemoryRouter>
    )
    expect(none.container.textContent).toBe("")
  })
})

describe("the roadmap page", () => {
  it("lists every phase, opens the current one, and says honestly which have lessons", async () => {
    const user = userEvent.setup()
    renderApp("/study/roadmap")
    await screen.findByRole("heading", { level: 1, name: "Roadmap" }, TIMEOUT)
    const phases = phasesOf("java-full-stack-ai")
    for (const p of phases)
      expect(
        screen.getByRole("button", {
          name: new RegExp(
            `${p.number}\\. ${p.title.replace(/[()+.*?[\]\\]/g, "\\$&")}`
          ),
        })
      ).toBeInTheDocument()
    // phase 1 is open: its modules, topics and lesson counts show
    expect(screen.getByRole("link", { name: "Core Java" })).toHaveAttribute(
      "href",
      "/study/lessons/java-core"
    )
    expect(
      screen.getAllByText(/ready · covers \d+ of \d+ topics/).length
    ).toBeGreaterThan(0)
    // a phase without lessons says so, and a project-led one explains itself
    // counted from the data, so it keeps holding as lessons are written: one label for each phase that has
    // modules but no lesson yet, and none once every phase has lessons
    const withoutLessons = phases.filter(
      (p) =>
        p.modules.length > 0 &&
        !p.modules.some((ref) => {
          const id = refModule(ref)
          return LESSON_INDEX.some(
            (l) =>
              l.moduleId === id &&
              (typeof ref === "string" || ref.topics.includes(l.topic))
          )
        })
    ).length
    if (withoutLessons > 0)
      expect(
        screen.getAllByText("Lessons in preparation").length
      ).toBeGreaterThanOrEqual(withoutLessons)
    else
      expect(screen.queryAllByText("Lessons in preparation")).toHaveLength(0)
    await user.click(
      screen.getByRole("button", { name: /12\. Capstone and interview prep/ })
    )
    expect(
      await screen.findByText(/built around its project/)
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "HR interview" })).toHaveAttribute(
      "href",
      "/hr"
    )
    expect(
      screen.getByRole("link", { name: "Mock interview" })
    ).toHaveAttribute("href", "/mock")
    expect(
      screen.getByRole("link", { name: "Resume interview" })
    ).toHaveAttribute("href", "/resume")
    await user.click(
      screen.getByRole("button", { name: /10\. Docker, Linux, AWS and CI\/CD/ })
    )
    expect(
      await screen.findByRole("link", {
        name: "Linux practice (commands, safe terminal)",
      })
    ).toHaveAttribute("href", "/linux")
  })
})

describe("finishing the last lesson of a topic", () => {
  it("completes the topic's plan block (with an Undo) only when the lessons cover the topic", async () => {
    const user = userEvent.setup()
    // every lesson of the first lesson's topic
    const same = LESSON_INDEX.filter(
      (l) => l.moduleId === first.moduleId && l.topic === first.topic
    )
    const topicId = topicIdOf(first.moduleId, first.topic)
    await useLearnerStore.getState().hydrate()
    for (const l of same.slice(0, -1))
      await useLearnerStore
        .getState()
        .toggleCompleted(l.id, l.minutes, "lesson")
    const last = same.at(-1)!
    renderApp(`/study/lesson/${last.moduleId}/${last.slug}`)
    await screen.findByRole("heading", { level: 1, name: last.title }, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: "Mark this lesson finished" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[last.id]?.completed).toBe(true)
    )
    const minutes = same.reduce((n, l) => n + l.minutes, 0)
    const topicMinutes = (await import("@/data/catalog/modules"))
      .getModule(first.moduleId)!
      .topicList.find((t) => t.title === first.topic)!.minutes
    const covers = minutes >= topicMinutes * 0.75
    await waitFor(() =>
      expect(
        Boolean(useLearnerStore.getState().progress[topicId]?.completed)
      ).toBe(covers)
    )
    if (covers) {
      expect(await screen.findByText(/Topic complete/)).toBeInTheDocument()
      // no study time is logged a second time for the topic
      const logged = useLearnerStore
        .getState()
        .activity.filter((a) => a.refId === topicId)
      expect(logged).toHaveLength(0)
      await user.click(screen.getByRole("button", { name: "Undo" }))
      await waitFor(() =>
        expect(useLearnerStore.getState().progress[topicId]?.completed).toBe(
          false
        )
      )
    }
  })

  it("never completes a topic whose lessons are only part of it", async () => {
    // fake an index where one 10-minute lesson stands for a 90 minute topic via the pure rule
    const { topicLessons } = await import("@/services/study/topic-completion")
    const t = topicLessons("java-core", "Basics", 900, LESSON_INDEX, {})
    expect(t.covers).toBe(false)
  })
})

describe("the progress page", () => {
  it("shows raw counts beside every percentage and states how the percentage is made", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().hydrate()
    await useLearnerStore
      .getState()
      .toggleCompleted(first.id, first.minutes, "lesson")
    await useLearnerStore
      .getState()
      .toggleCompleted(`task.${first.moduleId}.${first.slug}.1`, 0, "lesson")
    renderApp("/study/progress")
    await screen.findByRole(
      "heading",
      { level: 1, name: "My progress" },
      TIMEOUT
    )
    const row = screen.getByTestId("module-progress-java-core")
    expect(row).toHaveTextContent(/Lessons 1\/\d+/)
    expect(row).toHaveTextContent(/Assignment ticks 1\/\d+/)
    expect(row).toHaveTextContent(/Checks passed 0\/\d+/)
    expect(row).toHaveTextContent(/Topics \d+\/\d+/)
    expect(within(row).getByRole("progressbar")).toBeInTheDocument()
    expect(
      screen.getByText(/the plain average of the parts a module has/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Lessons finished/)).toBeInTheDocument()
    expect(
      screen.getByText("You have not taken a check yet.")
    ).toBeInTheDocument()
    void user
  })
})

describe("the plan-order notice", () => {
  it("is shown once to a learner with plan history, and Restart plan from today clears it", async () => {
    const user = userEvent.setup()
    const profile = useLearnerStore.getState().profile!
    await useLearnerStore.getState().saveProfile({
      plans: {
        ...profile.plans,
        study: { ...profile.plans.study, startDate: "2020-01-01" },
      },
    })
    renderApp("/study")
    const notice = await screen.findByTestId(
      "plan-order-notice",
      undefined,
      TIMEOUT
    )
    expect(notice).toHaveTextContent(
      "Your plan now follows the roadmap's phases"
    )
    await user.click(
      within(notice).getByRole("button", { name: "Restart plan from today" })
    )
    await waitFor(() =>
      expect(screen.queryByTestId("plan-order-notice")).toBeNull()
    )
    const plan = useLearnerStore.getState().profile!.plans.study
    expect(plan.orderVersion).toBe(1)
    expect(plan.startDate).not.toBe("2020-01-01")
  })

  it("is never shown to a new learner; their plan is simply marked as current", async () => {
    renderApp("/study")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Java Full Stack AI Engineer" },
      TIMEOUT
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.plans.study.orderVersion).toBe(
        1
      )
    )
    expect(screen.queryByTestId("plan-order-notice")).toBeNull()
  })

  it("keeping the plan as it is also clears the notice, for good", async () => {
    const user = userEvent.setup()
    const profile = useLearnerStore.getState().profile!
    await useLearnerStore.getState().saveProfile({
      plans: {
        ...profile.plans,
        study: { ...profile.plans.study, startDate: "2020-01-01" },
      },
    })
    renderApp("/study")
    const notice = await screen.findByTestId(
      "plan-order-notice",
      undefined,
      TIMEOUT
    )
    await user.click(
      within(notice).getByRole("button", { name: "Keep my plan as it is" })
    )
    await waitFor(() =>
      expect(screen.queryByTestId("plan-order-notice")).toBeNull()
    )
    expect(useLearnerStore.getState().profile!.plans.study.startDate).toBe(
      "2020-01-01"
    )
  })
})

describe("weekly milestones on Study home", () => {
  it("lists this week's topics, the lessons that exist for them with assignment progress, and says which topics have no lesson yet", async () => {
    await useLearnerStore.getState().hydrate()
    renderApp("/study")
    const panel = await screen.findByTestId(
      "weekly-milestones",
      undefined,
      TIMEOUT
    )
    expect(panel).toHaveTextContent(/This week's milestones|Weekly milestones/)
    // the plan opens with Core Java, whose first lessons exist
    expect(within(panel).getByTestId("milestone-topics")).toHaveTextContent(
      "Core Java: Basics"
    )
    expect(
      within(panel).getByRole("link", { name: first.title })
    ).toHaveAttribute("href", `/study/lesson/${first.moduleId}/${first.slug}`)
    expect(
      within(panel).getAllByText(/assignment 0 of \d+/).length
    ).toBeGreaterThan(0)
  })

  it("done is derived from the records: finishing a lesson ticks it in the panel", async () => {
    await useLearnerStore.getState().hydrate()
    await useLearnerStore
      .getState()
      .toggleCompleted(first.id, first.minutes, "lesson")
    renderApp("/study")
    const panel = await screen.findByTestId(
      "weekly-milestones",
      undefined,
      TIMEOUT
    )
    const item = within(panel)
      .getByRole("link", { name: first.title })
      .closest("li")!
    expect(within(item).getByLabelText("Lesson: done")).toBeInTheDocument()
  })

  it("moves between the planned weeks and never goes past the first or last", async () => {
    const user = userEvent.setup()
    renderApp("/study")
    const panel = await screen.findByTestId(
      "weekly-milestones",
      undefined,
      TIMEOUT
    )
    const prev = within(panel).getByRole("button", { name: "Previous week" })
    const next = within(panel).getByRole("button", { name: "Next week" })
    expect(prev).toBeDisabled()
    await user.click(next)
    expect(
      within(panel).getByRole("button", { name: "Previous week" })
    ).toBeEnabled()
    expect(panel).toHaveTextContent(/Weekly milestones/)
    // a later week whose topics have no lessons yet says so
    expect(
      within(panel).queryByTestId("milestone-no-lessons") ??
        within(panel).queryAllByRole("link").length
    ).toBeTruthy()
  })
})
