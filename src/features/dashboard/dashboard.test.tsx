import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { MODULES } from "@/data/catalog/modules"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import { parseImport } from "@/services/storage/import-export"
import { useLearnerStore } from "@/stores/learner-store"
import { toDateKey } from "@/utils/dates"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
  seedStudyLearner,
} from "@/test/render-app"
import { shiftDateKey } from "@/utils/dates"

const TIMEOUT = { timeout: 20000 }
const TODAY = toDateKey(new Date())
const QID = "react.fresher.keys-in-lists"

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

const blockBoxes = () =>
  screen.getAllByRole("checkbox", { name: /^Mark .* done$/ })
const ready = async () => {
  await screen.findByRole("heading", { level: 2, name: /Today/ }, TIMEOUT)
  await waitFor(() =>
    expect(
      useLearnerStore.getState().profile?.plans.interview.startDate
    ).not.toBeNull()
  )
}

describe("the plan on the dashboard", () => {
  it("shows today's blocks as real checkboxes with names that include the minutes, and a text equivalent of the ring", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const boxes = blockBoxes()
    expect(boxes.length).toBeGreaterThan(0)
    expect(boxes[0]).toHaveAccessibleName(/^Mark .+: .+ \(\d+ min\) done$/)
    expect(
      screen.getByRole("img", { name: /^0 of \d+ minutes done today$/ })
    ).toBeInTheDocument()
    expect(screen.getByTestId("today-minutes")).toHaveTextContent(
      /0 of \d+ minutes done/
    )
  })

  it("checks a block off, records it as a progress record and a lesson activity, and undo keeps the activity", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const box = blockBoxes()[0]
    const name = box.getAttribute("aria-label")!
    await user.click(box)
    await waitFor(() => {
      const done = Object.values(useLearnerStore.getState().progress).filter(
        (p) => p.questionId.startsWith("topic.") && p.completed
      )
      expect(done).toHaveLength(1)
    })
    const state = useLearnerStore.getState()
    const record = Object.values(state.progress).find((p) =>
      p.questionId.startsWith("topic.")
    )!
    expect(
      state.activity.filter(
        (a) => a.type === "lesson" && a.refId === record.questionId
      )
    ).toHaveLength(1)
    expect(screen.getByTestId("today-minutes")).not.toHaveTextContent(/^0 of/)

    await user.click(screen.getByRole("checkbox", { name }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress[record.questionId].completed
      ).toBe(false)
    )
    expect(
      useLearnerStore
        .getState()
        .activity.filter((a) => a.refId === record.questionId)
    ).toHaveLength(1) // history is not rewritten
    await user.click(screen.getByRole("checkbox", { name })) // checking again the same day does not add another entry
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress[record.questionId].completed
      ).toBe(true)
    )
    expect(
      useLearnerStore
        .getState()
        .activity.filter((a) => a.refId === record.questionId)
    ).toHaveLength(1)
  })

  it("starts an existing learner's plan the first day they open it, with no missed days", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    expect(
      useLearnerStore.getState().profile!.plans.interview.startDate
    ).toBeNull()
    renderApp("/dashboard")
    await ready()
    expect(useLearnerStore.getState().profile!.plans.interview.startDate).toBe(
      TODAY
    )
    expect(
      screen.queryByRole("region", { name: "Catch-up" })
    ).not.toBeInTheDocument()
  })

  it("gives different roles different plans and different syllabus progress totals, from data", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const fe = renderApp("/dashboard")
    await ready()
    const feText = (await screen.findByText(/\d+ of \d+ topics done/))
      .textContent!
    fe.unmount()
    await resetLearner()
    await seedOnboardedLearner({ selectedRoles: ["java-full-stack"] })
    renderApp("/dashboard")
    await ready()
    const jfsText = (await screen.findByText(/\d+ of \d+ topics done/))
      .textContent!
    expect(jfsText).not.toBe(feText)
  })

  it("shows both raw numbers for each module: topics done and questions, or 'no questions yet' in plain words", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    for (const trigger of await screen.findAllByRole("button", {
      name: /modules ·/,
    }))
      await user.click(trigger)
    const react = screen
      .getByText("React", { selector: "li span.font-medium" })
      .closest("li")!
    expect(within(react).getByText(/\d+ of \d+ topics/)).toBeInTheDocument()
    expect(within(react).getByText(/0 of \d+ questions/)).toBeInTheDocument()
    // Data-driven: which modules still have no questions changes as content is released, so the row for the
    // "no questions yet" wording is picked from the catalogue at run time (a module in this syllabus that has none).
    // Only core and recommended modules are on by default, so only those are listed here.
    const empty = [...defaultsForRoles(["frontend-developer"])]
      .filter(([, tier]) => tier === "core" || tier === "recommended")
      .map(([id]) => MODULES.find((m) => m.id === id)!)
      .find((m) => !QUESTION_INDEX.some((q) => q.moduleId === m.id))
    if (!empty) return // every module of this syllabus has questions: nothing left to show this wording for
    const row = screen
      .getByText(empty.title, { selector: "li span.font-medium" })
      .closest("li")!
    expect(within(row).getByText("no questions yet")).toBeInTheDocument()
    expect(
      within(row).getByText(/\d+% *$/, { selector: "span" })
    ).toBeInTheDocument()
  })

  it("shows a Catch-up notice when days were missed, moves nothing out of the plan, and can be dismissed", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    await useLearnerStore.getState().updatePlan("interview", (p) => ({
      ...p,
      startDate: shiftDateKey(TODAY, -4),
    }))
    renderApp("/dashboard")
    const banner = await screen.findByRole(
      "region",
      { name: "Catch-up" },
      TIMEOUT
    )
    expect(banner).toHaveTextContent(/were not finished/)
    expect(banner).toHaveTextContent(/Nothing was dropped/)
    expect(screen.getAllByText("Catch-up").length).toBeGreaterThan(0) // a badge on each moved block
    const strip = screen.getByRole("list", { name: "Days of this week" })
    expect(
      within(strip).getAllByText(/missed, moved forward/).length
    ).toBeGreaterThan(0) // text, not colour alone
    await user.click(within(banner).getByRole("button", { name: "Dismiss" }))
    await waitFor(() =>
      expect(
        screen.queryByRole("region", { name: "Catch-up" })
      ).not.toBeInTheDocument()
    )
    expect(
      useLearnerStore.getState().profile!.plans.interview.catchUpDismissedOn
    ).toBe(TODAY)
  })

  it("moves a block to another day with a dialog, and puts it back", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const label = blockBoxes()[0]
      .getAttribute("aria-label")!
      .replace(/^Mark /, "")
      .replace(/ done$/, "")
    await user.click(
      screen.getByRole("button", {
        name: `Move block: ${label.replace(/ \(\d+ min\)$/, "")}`,
      })
    )
    const dialog = await screen.findByRole("dialog")
    const date = within(dialog).getByLabelText("Move to")
    const target = shiftDateKey(TODAY, 3)
    await user.clear(date)
    await user.type(date, target)
    await user.click(within(dialog).getByRole("button", { name: "Move block" }))
    await waitFor(() =>
      expect(
        Object.values(useLearnerStore.getState().profile!.plans.interview.moves)
      ).toEqual([target])
    )
    const id = Object.keys(
      useLearnerStore.getState().profile!.plans.interview.moves
    )[0]
    expect(id).toMatch(/^topic\./)

    // a date in the past is refused
    await user.click(screen.getAllByRole("button", { name: /^Move block:/ })[0])
    const again = await screen.findByRole("dialog")
    await user.clear(within(again).getByLabelText("Move to"))
    await user.type(
      within(again).getByLabelText("Move to"),
      shiftDateKey(TODAY, -2)
    )
    expect(within(again).getByRole("alert")).toHaveTextContent(
      "Choose today or a later day."
    )
    expect(
      within(again).getByRole("button", { name: "Move block" })
    ).toBeDisabled()
    await user.click(within(again).getByRole("button", { name: "Cancel" }))

    useLearnerStore
      .getState()
      .updatePlan("interview", (p) => ({ ...p, moves: {} }))
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.plans.interview.moves).toEqual(
        {}
      )
    )
  })

  it("removes a block from the plan with an Undo, keeping the module in the syllabus", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const before = blockBoxes().length
    await user.click(
      screen.getAllByRole("button", { name: /^Remove block from my plan:/ })[0]
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.plans.interview.removed
      ).toHaveLength(1)
    )
    expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({})
    await user.click(await screen.findByRole("button", { name: "Undo" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.plans.interview.removed
      ).toEqual([])
    )
    expect(blockBoxes().length).toBe(before)
  })

  it("says how many study days the plan really needs when the deadline is too short, without shortening anything", async () => {
    await seedOnboardedLearner({
      selectedRoles: ["java-full-stack"],
      targetPreset: "custom",
      targetDate: shiftDateKey(TODAY, 10),
    })
    renderApp("/dashboard")
    await ready()
    const status = await screen.findByText(
      "Your plan does not fit your target date."
    )
    const box = status.closest("div")!
    expect(box).toHaveTextContent(/your plan needs \d+ study days/)
    expect(box).toHaveTextContent(
      /land after it\. Nothing was shortened or dropped/
    )
  })

  it("offers the three ways to fit in place with real numbers, and applies each one", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({
      selectedRoles: ["frontend-developer"],
      targetPreset: "custom",
      targetDate: shiftDateKey(TODAY, 30),
    })
    renderApp("/dashboard")
    await ready()
    const status = (
      await screen.findByText("Your plan does not fit your target date.")
    ).closest("div")!
    const needed = Number(
      /needs (\d+) study days/.exec(status.textContent ?? "")![1]
    )
    // the days the plan needs are exactly what the review step's arithmetic says: ceil(minutes / pace)
    const plan = useLearnerStore.getState().profile!
    expect(plan.dailyStudyHours).toBe(2)
    const move = within(status).getByRole("button", {
      name: /^Move target to \d+ \w+ \d{4}$/,
    })
    expect(within(status).getByText(/Core modules alone need/)).toBeVisible()

    // A. move the target: the plan fits afterwards
    await user.click(move)
    await waitFor(() =>
      expect(
        screen.queryByText("Your plan does not fit your target date.")
      ).not.toBeInTheDocument()
    )
    expect(useLearnerStore.getState().profile!.targetPreset).toBe("custom")
    expect(
      screen.getByText(new RegExp(`about ${needed} study days`))
    ).toBeVisible()
  })

  it("prepares core first from the status, can undo it, and keeps every module in the syllabus", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({
      selectedRoles: ["java-full-stack"],
      targetPreset: "custom",
      targetDate: shiftDateKey(TODAY, 60),
    })
    renderApp("/dashboard")
    await ready()
    await user.click(
      await screen.findByRole("button", { name: "Prepare core first" })
    )
    await waitFor(() =>
      expect(
        Object.values(
          useLearnerStore.getState().profile!.syllabusOverrides
        ).some((o) => o.priority === "low")
      ).toBe(true)
    )
    const note = (await screen.findByText(/Core first is on:/)).closest("div")!
    await user.click(within(note).getByRole("button", { name: "Undo" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({})
    )
  })

  it("lists removed plan blocks under Manage my prep > Removed, links to them from the status, and restores them one by one or all at once", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const buttons = screen.getAllByRole("button", {
      name: /^Remove block from my plan:/,
    })
    await user.click(buttons[0])
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.plans.interview.removed
      ).toHaveLength(1)
    )
    await user.click(
      screen.getAllByRole("button", { name: /^Remove block from my plan:/ })[0]
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.plans.interview.removed
      ).toHaveLength(2)
    )
    const link = await screen.findByRole("link", {
      name: /2 blocks removed from your plan/,
    })
    expect(link).toHaveAttribute(
      "href",
      "/interview/manage?tab=removed#removed-blocks"
    )

    await user.click(link)
    const heading = await screen.findByRole(
      "heading",
      { name: "Removed plan blocks (2)" },
      TIMEOUT
    )
    const section = heading.closest("section")!
    await user.click(
      within(section).getAllByRole("button", { name: /^Restore .*:/ })[0]
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.plans.interview.removed
      ).toHaveLength(1)
    )
    await user.click(
      within(section).getByRole("button", { name: /^Restore all/ })
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.plans.interview.removed
      ).toEqual([])
    )
    expect(
      await screen.findByText(/No blocks removed from your daily plan/)
    ).toBeVisible()
  })

  it("lists only the modules in the learner's syllabus under 'by area', never topics outside their path", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const heading = await screen.findByRole("heading", {
      level: 2,
      name: /Syllabus progress by area/,
    })
    const section = heading.closest("section")!
    for (const trigger of within(section).getAllByRole("button", {
      expanded: false,
    }))
      await user.click(trigger)
    const defaults = defaultsForRoles(["frontend-developer"], {
      includeCareer: true,
    })
    const rows = within(section).getAllByRole("progressbar")
    const names = rows.map((r) => r.getAttribute("aria-label") ?? "")
    expect(names.length).toBeGreaterThan(0)
    const outside = MODULES.filter((m) => !defaults.has(m.id))
    expect(outside.length).toBeGreaterThan(0)
    for (const m of outside)
      expect(names, m.title).not.toContain(`${m.title} progress`)
  })

  it("adds a revision block to Today when reviews are due, sized at 2 minutes each, without changing the blocks", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/dashboard")
    await ready()
    const before = blockBoxes().length
    expect(screen.queryByText(/Revision due today/)).not.toBeInTheDocument()
    await useLearnerStore.getState().toggleCompleted(QID, 3)
    useLearnerStore.setState((s) => ({
      progress: {
        ...s.progress,
        [QID]: { ...s.progress[QID], nextReviewAt: "2020-01-01T00:00:00.000Z" },
      },
    }))
    expect(
      await screen.findByText(/Revision due today:/, {}, TIMEOUT)
    ).toBeInTheDocument()
    expect(screen.getByText(/1 question, about 2 min/)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /Start revision/ })
    ).toHaveAttribute("href", "/library/revision")
    expect(blockBoxes().length).toBe(before) // additive: topic blocks are not pushed out
  })

  it("restarts the plan from today only after confirmation", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    await useLearnerStore.getState().updatePlan("interview", (p) => ({
      ...p,
      startDate: shiftDateKey(TODAY, -6),
      moves: { "topic.react.jsx": shiftDateKey(TODAY, 2) },
    }))
    renderApp("/dashboard")
    await screen.findByRole("region", { name: "Catch-up" }, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: /Restart plan from today/ })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Keep my plan",
      })
    )
    expect(useLearnerStore.getState().profile!.plans.interview.startDate).toBe(
      shiftDateKey(TODAY, -6)
    )
    await user.click(
      screen.getByRole("button", { name: /Restart plan from today/ })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Restart",
      })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.plans.interview).toMatchObject(
        { startDate: TODAY, moves: {} }
      )
    )
    await waitFor(() =>
      expect(
        screen.queryByRole("region", { name: "Catch-up" })
      ).not.toBeInTheDocument()
    )
  })
})

describe("the plan in exports", () => {
  it("is carried by export and import, and a file from before plans existed imports with defaults", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    await useLearnerStore.getState().updatePlan("interview", (p) => ({
      ...p,
      startDate: "2026-10-01",
      studyDays: [1, 2, 3, 4, 5],
      moves: { "topic.react.jsx": "2026-11-20" },
      removed: ["topic.react.forms"],
    }))
    await useLearnerStore
      .getState()
      .setBlockDone(
        { id: "topic.react.jsx", topicId: "topic.react.jsx", minutes: 30 },
        ["topic.react.jsx"],
        true
      )
    const bundle = useLearnerStore.getState().exportData()
    const back = parseImport(JSON.stringify(bundle))
    expect(back.ok).toBe(true)
    if (!back.ok) return
    expect(back.bundle.profile!.plans.interview).toMatchObject({
      startDate: "2026-10-01",
      studyDays: [1, 2, 3, 4, 5],
      moves: { "topic.react.jsx": "2026-11-20" },
      removed: ["topic.react.forms"],
    })
    expect(
      back.bundle.questionProgress.find(
        (p) => p.questionId === "topic.react.jsx"
      )?.completed
    ).toBe(true)

    const old = JSON.parse(JSON.stringify(bundle))
    delete old.profile.plans
    const imported = parseImport(JSON.stringify(old))
    expect(imported.ok).toBe(true)
    if (imported.ok)
      expect(imported.bundle.profile!.plans.interview).toMatchObject({
        startDate: null,
        studyDays: [0, 1, 2, 3, 4, 5, 6],
        moves: {},
        removed: [],
      })
  })
})

describe("Study home shows the study plan's Today block", () => {
  it("uses the same component, with its own plan state and no revision link", async () => {
    const user = userEvent.setup()
    await seedStudyLearner({ studyRoadmap: "mern-full-stack-ai" })
    renderApp("/study")
    await screen.findByRole(
      "heading",
      { level: 2, name: /Today's study plan/ },
      TIMEOUT
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile?.plans.study.startDate
      ).not.toBeNull()
    )
    expect(
      useLearnerStore.getState().profile?.plans.interview.startDate
    ).toBeNull() // the other journey's plan is untouched
    const boxes = blockBoxes()
    expect(boxes.length).toBeGreaterThan(0)
    await user.click(boxes[0])
    await waitFor(() =>
      expect(
        Object.values(useLearnerStore.getState().progress).some(
          (p) => p.questionId.startsWith("topic.") && p.completed
        )
      ).toBe(true)
    )
    expect(
      screen.queryByRole("link", { name: /Start revision/ })
    ).not.toBeInTheDocument()
  })
})
