import Dexie from "dexie"
import { describe, expect, it } from "vitest"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import {
  EXPORT_VERSION,
  HR_ANSWER_FIELD_MAX,
  hrAnswerSchema,
} from "@/types/learner"
import { createLearnerStore } from "./learner-store"

const QID = "hr-teamwork.fresher.a-time-you-helped"
let n = 0
const setup = (now = new Date("2026-11-03T09:00:00.000Z")) => {
  const repo = createDexieRepository(`hr-db-${++n}-${Math.random()}`)
  const store = createLearnerStore(repo, () => now)
  return { repo, store }
}

describe("saved HR answers", () => {
  it("adds, edits and deletes an answer, keeps several per question, and refuses an empty one", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    expect(await store.getState().addHrAnswer({ questionId: QID })).toBeNull()
    expect(
      await store.getState().addHrAnswer({ questionId: QID, situation: "   " })
    ).toBeNull()
    const a = await store.getState().addHrAnswer({
      questionId: QID,
      title: " Group project ",
      situation: "In my final-year project",
      action: "I paired with a teammate",
    })
    const b = await store
      .getState()
      .addHrAnswer({ questionId: QID, result: "We shipped" })
    expect(a).toMatchObject({ title: "Group project", task: "", result: "" })
    expect(
      store.getState().hrAnswers.filter((x) => x.questionId === QID)
    ).toHaveLength(2)

    await store.getState().updateHrAnswer(a!.id, {
      task: "Unblock the build",
      selfCheck: ["specific"],
    })
    expect(
      store.getState().hrAnswers.find((x) => x.id === a!.id)
    ).toMatchObject({
      task: "Unblock the build",
      selfCheck: ["specific"],
    })
    await store.getState().deleteHrAnswer(b!.id)
    expect(store.getState().hrAnswers.map((x) => x.id)).toEqual([a!.id])
  })

  it("persists across a fresh store, and the schema caps each field", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    const a = await store
      .getState()
      .addHrAnswer({ questionId: QID, situation: "s" })
    const fresh = createLearnerStore(repo)
    await fresh.getState().hydrate()
    expect(fresh.getState().hrAnswers.map((x) => x.id)).toEqual([a!.id])
    const tooLong = { ...a!, action: "x".repeat(HR_ANSWER_FIELD_MAX + 1) }
    expect(hrAnswerSchema.safeParse(tooLong).success).toBe(false)
  })

  it("removing a question keeps its answers; the explicit delete of notes and progress deletes them", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    await store
      .getState()
      .addHrAnswer({ questionId: QID, situation: "keep me" })
    await store.getState().addHrAnswer({
      questionId: "hr-teamwork.fresher.other",
      situation: "other",
    })
    await store.getState().setQuestionRemoved(QID, true)
    expect(store.getState().hrAnswers).toHaveLength(2)
    await store.getState().deleteQuestionData(QID)
    expect(store.getState().hrAnswers.map((x) => x.questionId)).toEqual([
      "hr-teamwork.fresher.other",
    ])
    const fresh = createLearnerStore(repo)
    await fresh.getState().hydrate()
    expect(fresh.getState().hrAnswers).toHaveLength(1)
  })

  it("reset deletes answers too", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().addHrAnswer({ questionId: QID, situation: "x" })
    await store.getState().resetAll()
    expect(store.getState().hrAnswers).toEqual([])
  })
})

describe("export version 3 and the version 3 database", () => {
  it("round-trips answers through export and import; v1 and v2 files import with no answers", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store
      .getState()
      .addHrAnswer({ questionId: QID, situation: "s", result: "r" })
    const bundle = store.getState().exportData()
    expect(bundle.version).toBe(EXPORT_VERSION)
    expect(bundle.hrAnswers).toHaveLength(1)
    const parsed = parseImport(JSON.stringify(bundle))
    expect(parsed.ok && parsed.bundle.hrAnswers[0]).toMatchObject({
      questionId: QID,
      situation: "s",
      result: "r",
    })

    const other = setup().store
    await other.getState().hydrate()
    if (parsed.ok) await other.getState().importData(parsed.bundle)
    expect(other.getState().hrAnswers).toHaveLength(1)

    for (const version of [1, 2]) {
      const old = { ...bundle, version } as Record<string, unknown>
      delete old.hrAnswers
      const r = parseImport(JSON.stringify(old))
      expect(r.ok, `v${version}`).toBe(true)
      expect(r.ok && r.bundle.hrAnswers).toEqual([])
    }
    expect(
      parseImport(JSON.stringify({ ...bundle, version: EXPORT_VERSION + 1 })).ok
    ).toBe(false)
  })

  it("upgrades a version 2 database without losing anything", async () => {
    const name = `upgrade-v2-${Math.random()}`
    const old = new Dexie(name)
    old.version(2).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
    })
    await old.table("questionProgress").put({
      questionId: QID,
      completed: true,
      note: "from v2",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    await old.table("customQuestions").put({
      id: "react.fresher.my-q-abc",
      moduleId: "react",
      level: "fresher",
      title: "Mine",
      answer: "",
      tags: [],
      note: "",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    old.close()
    const snap = await createDexieRepository(name).load()
    expect(snap.questionProgress[0]).toMatchObject({
      questionId: QID,
      note: "from v2",
    })
    expect(snap.customQuestions).toHaveLength(1)
    expect(snap.hrAnswers).toEqual([])
  })
})
