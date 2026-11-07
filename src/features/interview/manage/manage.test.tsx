import { questionsIn } from "@/test/content-counts"
import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Dexie from "dexie"
import { beforeEach, describe, expect, it } from "vitest"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { buildSummary } from "@/services/analytics/summary"
import {
  makeCustomQuestionId,
  parseAnswer,
} from "@/services/content/custom-questions"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import { createLearnerStore, useLearnerStore } from "@/stores/learner-store"
import { QUESTION_ID_PATTERN } from "@/types/content"
import {
  EXPORT_VERSION,
  learnerProfileSchema,
  questionProgressSchema,
} from "@/types/learner"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"

const TIMEOUT = { timeout: 10000 }
const QID = "react.fresher.keys-in-lists"

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("removing a question from my prep", () => {
  it("removes it from the question page with an Undo, and removing never deletes the note", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    await useLearnerStore.getState().setNote(QID, "my own note")
    renderApp(`/interview/question/${QID}`)
    await user.click(
      await screen.findByRole(
        "button",
        { name: "Remove from my prep" },
        TIMEOUT
      )
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID].removed).toBe(true)
    )
    expect(useLearnerStore.getState().progress[QID].note).toBe("my own note")
    expect(
      await screen.findByRole("region", { name: "Removed from your prep" })
    ).toBeInTheDocument()

    await user.click(await screen.findByRole("button", { name: "Undo" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID].removed).toBe(false)
    )
    expect(useLearnerStore.getState().progress[QID].note).toBe("my own note")
  })

  it("removes it from a library row, and the library no longer lists it", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview/frontend-developer/react")
    await screen.findByText(
      new RegExp(
        `Showing ${questionsIn("react").length} of ${questionsIn("react").length}`
      ),
      {},
      TIMEOUT
    )
    await user.click(
      screen.getByRole("button", {
        name: /Remove from my prep: Why do we need keys/,
      })
    )
    expect(
      await screen.findByText(
        new RegExp(
          `Showing ${questionsIn("react").length - 1} of ${questionsIn("react").length - 1}`
        )
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Why do we need keys/, { selector: "p" })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /1 removed/ })).toHaveAttribute(
      "href",
      "/interview/manage?tab=removed"
    )
  })

  it("leaves readiness, revision queues and counts, but keeps the question recoverable", () => {
    const profile = learnerProfileSchema.parse({
      updatedAt: "2026-11-02T00:00:00.000Z",
      selectedRoles: ["frontend-developer"],
    })
    const done = (id: string, removed: boolean) =>
      questionProgressSchema.parse({
        questionId: id,
        completed: true,
        confidence: 5,
        nextReviewAt: "2020-01-01T00:00:00.000Z",
        removed,
        updatedAt: "2026-11-02T00:00:00.000Z",
      })
    const ids = QUESTION_INDEX.filter((q) => q.moduleId === "react").map(
      (q) => q.id
    )
    const progress = {
      [ids[0]]: done(ids[0], false),
      [ids[1]]: done(ids[1], true),
    }
    const s = buildSummary({
      profile,
      progress,
      activity: [],
      index: QUESTION_INDEX,
      now: new Date(2026, 10, 2),
    })
    expect(s.dueReviews.map((q) => q.id)).toEqual([ids[0]])
    expect(s.completed).toBe(1)
    expect(s.modules.find((m) => m.moduleId === "react")!.total).toBe(
      ids.length - 1
    )
    expect(progress[ids[1]].removed).toBe(true) // the record is still there to restore
  })

  it("deleting notes and progress is a separate, confirmed action", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    await useLearnerStore.getState().setNote(QID, "keep me")
    renderApp(`/interview/question/${QID}`)
    await user.click(
      await screen.findByRole(
        "button",
        { name: /Delete my notes and progress for this question/ },
        TIMEOUT
      )
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Keep them",
      })
    )
    expect(useLearnerStore.getState().progress[QID].note).toBe("keep me")

    await user.click(
      screen.getByRole("button", {
        name: /Delete my notes and progress for this question/,
      })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID]).toBeUndefined()
    )
  })
})

describe("Manage my prep", () => {
  it("removes a module from the Modules tab and restores it from the Removed tab", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview/manage")
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Manage my prep" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    await user.click(
      await screen.findByRole("checkbox", { name: "Include TanStack Query" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({
        "tanstack-query": { selected: false },
      })
    )

    await user.click(screen.getByRole("tab", { name: "Removed" }))
    expect(await screen.findByText("TanStack Query")).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Restore TanStack Query" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({})
    )
  })

  it("removes questions one by one or in bulk, and restores them", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview/manage?tab=questions")
    await screen.findByText(/questions in your prep/, {}, TIMEOUT)
    await user.type(screen.getByLabelText("Search questions"), "keys")
    await screen.findAllByRole("link", { name: /Why do we need keys/ })
    const row = document.querySelector(`a[href$="${QID}"]`)!.closest("li")!
    await user.click(within(row as HTMLElement).getByRole("checkbox"))
    await user.click(
      screen.getByRole("button", { name: /Remove selected \(1\)/ })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID]?.removed).toBe(true)
    )

    await user.click(screen.getByRole("tab", { name: "Removed" }))
    expect(
      await screen.findByText(/Removed questions \(1\)/)
    ).toBeInTheDocument()
    const removedRow = document
      .querySelector(`a[href$="${QID}"]`)!
      .closest("li")! as HTMLElement
    await user.click(within(removedRow).getByRole("checkbox"))
    await user.click(
      screen.getByRole("button", { name: /Restore selected \(1\)/ })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[QID].removed).toBe(false)
    )
  })
})

describe("my own questions", () => {
  it("validates, adds, shows 'Yours', counts separately from the curated bank, tracks and bookmarks it", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/interview/manage?tab=mine")
    await user.click(
      await screen.findByRole(
        "button",
        { name: "Add your first question" },
        TIMEOUT
      )
    )
    const dialog = await screen.findByRole("dialog")
    await user.click(
      within(dialog).getByRole("button", { name: "Add question" })
    )
    expect(
      await within(dialog).findByText(/at least 3 characters/)
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText("Choose the module this question belongs to.")
    ).toBeInTheDocument()

    // Pasting instead of typing key by key: each keystroke re-renders the whole dialog, which is what made this test slow on a busy machine.
    await user.click(within(dialog).getByLabelText("Question"))
    await user.paste("What is the virtual DOM diff for?")
    await user.click(within(dialog).getByRole("combobox", { name: "Module" }))
    await user.click(await screen.findByRole("option", { name: "React" }))
    await user.click(within(dialog).getByLabelText(/Your answer/))
    await user.paste("It finds the smallest change.\n\n- keys help\n- batching")
    await user.click(within(dialog).getByLabelText(/Tags/))
    await user.paste("react, rendering")
    await user.click(
      within(dialog).getByRole("button", { name: "Add question" })
    )

    const saved = await waitFor(() => {
      const q = useLearnerStore.getState().customQuestions[0]
      expect(q).toBeDefined()
      return q
    })
    expect(saved.id).toMatch(QUESTION_ID_PATTERN) // valid for the question route
    expect(saved.id.split(".")[2]).toMatch(/^my-/)
    expect(QUESTION_INDEX.some((q) => q.id === saved.id)).toBe(false) // never collides with a curated id
    expect(saved.tags).toEqual(["react", "rendering"])
    expect(await screen.findByText("Yours")).toBeInTheDocument()

    // Library: counted separately from the curated bank.
    cleanup() // one app at a time: two mounted trees double the render work
    renderApp(`/interview/frontend-developer/react`)
    expect(
      (
        await screen.findAllByText(
          new RegExp(`${questionsIn("react").length} curated \\+ 1 yours`),
          {},
          TIMEOUT
        )
      ).length
    ).toBeGreaterThan(0)
  })

  it("opens like any question: answer rendered, bookmark and complete tracked, edit and delete", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const q = await useLearnerStore.getState().addCustomQuestion({
      moduleId: "react",
      level: "fresher",
      title: "Explain reconciliation",
      answer: "React **compares** trees.\n\n- keys\n- types",
      tags: ["react"],
    })
    renderApp(`/interview/question/${q.id}`)
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Explain reconciliation" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(screen.getByText("Yours")).toBeInTheDocument()
    expect(screen.getByText("compares")).toBeInTheDocument()
    expect(
      screen.getAllByRole("listitem").some((li) => li.textContent === "keys")
    ).toBe(true)

    await user.click(screen.getByRole("button", { name: "Bookmark" }))
    await user.click(screen.getByRole("button", { name: "Mark completed" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[q.id]).toMatchObject({
        bookmarked: true,
        completed: true,
      })
    )

    await user.click(screen.getByRole("button", { name: "Edit" }))
    const dialog = await screen.findByRole("dialog")
    const title = within(dialog).getByLabelText("Question")
    await user.clear(title)
    await user.type(title, "Explain reconciliation in React")
    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().customQuestions[0].title).toBe(
        "Explain reconciliation in React"
      )
    )

    await user.click(
      screen.getByRole("button", { name: "Delete this question" })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().customQuestions).toHaveLength(0)
    )
    expect(useLearnerStore.getState().progress[q.id]).toBeUndefined()
  })

  it("makes ids that are valid and unique, and parses simple markdown", () => {
    const taken = new Set<string>()
    const a = makeCustomQuestionId("react", "fresher", "What is JSX?!", taken)
    taken.add(a)
    const b = makeCustomQuestionId("react", "fresher", "What is JSX?!", taken)
    expect(a).not.toBe(b)
    for (const id of [a, b]) expect(id).toMatch(QUESTION_ID_PATTERN)
    expect(makeCustomQuestionId("sql", "advanced", "???", new Set())).toMatch(
      /^sql\.advanced\.my-question-/
    )
    expect(parseAnswer("One line\nsame para\n\n- a\n- b\n\n* c")).toEqual([
      { kind: "paragraph", text: "One line same para" },
      { kind: "list", items: ["a", "b"] },
      { kind: "list", items: ["c"] },
    ])
  })

  it("no curated question slug can look like a custom one", () => {
    for (const q of QUESTION_INDEX)
      expect(q.id.split(".")[2].startsWith("my-"), q.id).toBe(false)
  })
})

describe("storage: persistence, export and the Dexie upgrade", () => {
  it("persists custom questions and the removed flag across a fresh store", async () => {
    const repo = createDexieRepository(`persist-${Math.random()}`)
    const store = createLearnerStore(repo)
    await store.getState().hydrate()
    const q = await store.getState().addCustomQuestion({
      moduleId: "sql",
      level: "fresher",
      title: "What is a join?",
    })
    await store.getState().setNote(QID, "n")
    await store.getState().setQuestionRemoved(QID, true)
    const fresh = createLearnerStore(repo)
    await fresh.getState().hydrate()
    expect(fresh.getState().customQuestions.map((c) => c.id)).toEqual([q.id])
    expect(fresh.getState().progress[QID]).toMatchObject({
      removed: true,
      note: "n",
    })
    await fresh.getState().deleteCustomQuestion(q.id)
    const again = createLearnerStore(repo)
    await again.getState().hydrate()
    expect(again.getState().customQuestions).toEqual([])
  })

  it("exports the current version with custom questions, and a version 1 file (no custom questions, no removed flag) still imports", async () => {
    expect(EXPORT_VERSION).toBe(8)
    const store = createLearnerStore(
      createDexieRepository(`export-${Math.random()}`)
    )
    await store.getState().hydrate()
    await store.getState().addCustomQuestion({
      moduleId: "react",
      level: "fresher",
      title: "Why keys?",
    })
    const bundle = store.getState().exportData()
    expect(bundle.version).toBe(EXPORT_VERSION)
    expect(bundle.customQuestions).toHaveLength(1)
    const roundTrip = parseImport(JSON.stringify(bundle))
    expect(roundTrip.ok && roundTrip.bundle.customQuestions).toHaveLength(1)

    const v1 = {
      app: "lastrev",
      version: 1,
      exportedAt: "2025-01-01T00:00:00.000Z",
      profile: null,
      preferences: {
        revisionIntervals: [1, 3],
        answerMode: "quick",
        selfTest: false,
        sidebarCollapsed: false,
      },
      questionProgress: [
        {
          questionId: QID,
          completed: true,
          note: "old note",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
      ],
      activity: [],
    }
    const imported = parseImport(JSON.stringify(v1))
    expect(imported.ok).toBe(true)
    if (!imported.ok) return
    expect(imported.bundle.customQuestions).toEqual([])
    expect(imported.bundle.questionProgress[0]).toMatchObject({
      removed: false,
      note: "old note",
    })

    // and a newer version is still refused
    expect(
      parseImport(JSON.stringify({ ...v1, version: EXPORT_VERSION + 1 })).ok
    ).toBe(false)
  })

  it("upgrades an existing version 1 database without losing anything", async () => {
    const name = `upgrade-${Math.random()}`
    const old = new Dexie(name)
    old.version(1).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
    })
    await old.table("questionProgress").put({
      questionId: QID,
      completed: true,
      note: "from v1",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    await old.table("activity").put({
      id: "a1",
      type: "question",
      date: "2025-01-01",
      minutes: 3,
      at: "2025-01-01T00:00:00.000Z",
    })
    old.close()

    const snapshot = await createDexieRepository(name).load()
    expect(snapshot.questionProgress).toHaveLength(1)
    expect(snapshot.questionProgress[0]).toMatchObject({
      questionId: QID,
      note: "from v1",
    })
    expect(snapshot.activity).toHaveLength(1)
    expect(snapshot.customQuestions).toEqual([])
  })

  it("reset deletes custom questions too", async () => {
    const store = createLearnerStore(
      createDexieRepository(`reset-${Math.random()}`)
    )
    await store.getState().hydrate()
    await store.getState().addCustomQuestion({
      moduleId: "sql",
      level: "fresher",
      title: "What is a key?",
    })
    await store.getState().resetAll()
    expect(store.getState().customQuestions).toEqual([])
  })
})
