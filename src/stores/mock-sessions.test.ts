import Dexie from "dexie"
import { describe, expect, it } from "vitest"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import { newSession } from "@/services/mock/session"
import { EXPORT_VERSION, mockConfigSchema } from "@/types/learner"
import { createLearnerStore } from "./learner-store"

let n = 0
const setup = (now = new Date("2026-11-03T09:00:00.000Z")) => {
  const repo = createDexieRepository(`mock-db-${++n}-${Math.random()}`)
  return { repo, store: createLearnerStore(repo, () => now) }
}
const make = (ids = ["react.fresher.what-is-jsx", "javascript.fresher.x"]) =>
  newSession({
    config: mockConfigSchema.parse({
      type: "technical",
      count: ids.length,
      durationMinutes: 10,
      levels: ["fresher"],
    }),
    questionIds: ids,
    requested: ids.length,
    seed: 1,
    now: new Date("2026-11-03T09:00:00.000Z"),
  })

describe("mock sessions in the store", () => {
  it("creates, updates and persists a session, so it survives a reload", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    const s = make()
    await store.getState().createMockSession(s)
    await store.getState().updateMockSession(s.id, (x) => ({
      ...x,
      current: 1,
      elapsedSeconds: 42,
      answers: x.answers.map((a, i) =>
        i === 0 ? { ...a, text: "my answer", ratings: { accuracy: 4 } } : a
      ),
    }))
    const fresh = createLearnerStore(repo)
    await fresh.getState().hydrate()
    const back = fresh.getState().mockSessions[0]
    expect(back).toMatchObject({
      id: s.id,
      current: 1,
      elapsedSeconds: 42,
      status: "in-progress",
      phase: "interview",
    })
    expect(back.answers[0]).toMatchObject({
      text: "my answer",
      ratings: { accuracy: 4 },
    })
    expect(back.rubric.kinds.technical.map((d) => d.weight)).toEqual([
      30, 20, 15, 15, 10, 10,
    ])
  })

  it("finishing logs a 'mock' activity with the real answering minutes; abandoning logs none", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const a = make()
    const b = make()
    await store.getState().createMockSession(a)
    await store.getState().createMockSession(b)
    await store
      .getState()
      .updateMockSession(a.id, (x) => ({ ...x, elapsedSeconds: 7 * 60 + 20 }))
    await store
      .getState()
      .updateMockSession(b.id, (x) => ({ ...x, elapsedSeconds: 5 * 60 }))
    await store.getState().endMockSession(a.id, "finished")
    await store.getState().endMockSession(b.id, "abandoned")
    const acts = store.getState().activity.filter((x) => x.type === "mock")
    expect(acts).toHaveLength(1)
    expect(acts[0]).toMatchObject({ refId: a.id, minutes: 7 })
    expect(store.getState().mockSessions.map((m) => m.status)).toEqual([
      "finished",
      "abandoned",
    ])
    // a finished session cannot be ended again
    await store.getState().endMockSession(a.id, "abandoned")
    expect(store.getState().mockSessions[0].status).toBe("finished")
  })

  it("setFlag sets and never toggles, so 'add to revision' cannot un-flag a question", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const q = "react.fresher.what-is-jsx"
    await store.getState().setFlag(q, "revision", true)
    await store.getState().setFlag(q, "revision", true)
    expect(store.getState().progress[q].revision).toBe(true)
    await store.getState().setFlag(q, "revision", false)
    expect(store.getState().progress[q].revision).toBe(false)
  })

  it("deletes a session and clears them on reset", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const s = make()
    await store.getState().createMockSession(s)
    await store.getState().deleteMockSession(s.id)
    expect(store.getState().mockSessions).toEqual([])
    await store.getState().createMockSession(make())
    await store.getState().resetAll()
    expect(store.getState().mockSessions).toEqual([])
  })
})

describe("export version 4 and the version 4 database", () => {
  it("round-trips sessions; v1, v2 and v3 files import with none; a newer file is refused", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().createMockSession(make())
    const bundle = store.getState().exportData()
    expect(bundle.version).toBe(EXPORT_VERSION)
    expect(EXPORT_VERSION).toBe(8)
    expect(bundle.mockSessions).toHaveLength(1)
    const parsed = parseImport(JSON.stringify(bundle))
    expect(parsed.ok && parsed.bundle.mockSessions[0].id).toBe(
      bundle.mockSessions[0].id
    )
    const other = setup().store
    await other.getState().hydrate()
    if (parsed.ok) await other.getState().importData(parsed.bundle)
    expect(other.getState().mockSessions).toHaveLength(1)
    for (const version of [1, 2, 3]) {
      const old = { ...bundle, version } as Record<string, unknown>
      delete old.mockSessions
      if (version < 3) delete old.hrAnswers
      const r = parseImport(JSON.stringify(old))
      expect(r.ok, `v${version}`).toBe(true)
      expect(r.ok && r.bundle.mockSessions).toEqual([])
    }
    expect(
      parseImport(JSON.stringify({ ...bundle, version: EXPORT_VERSION + 1 })).ok
    ).toBe(false)
  })

  it("upgrades a version 3 database without losing anything", async () => {
    const name = `upgrade-v3-${Math.random()}`
    const old = new Dexie(name)
    old.version(3).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
    })
    await old.table("questionProgress").put({
      questionId: "react.fresher.x",
      completed: true,
      note: "from v3",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    await old.table("hrAnswers").put({
      id: "ans_1",
      questionId: "hr-teamwork.fresher.x",
      situation: "s",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    old.close()
    const snap = await createDexieRepository(name).load()
    expect(snap.questionProgress[0]).toMatchObject({ note: "from v3" })
    expect(snap.hrAnswers).toHaveLength(1)
    expect(snap.mockSessions).toEqual([])
  })
})
