import Dexie from "dexie"
import { describe, expect, it } from "vitest"
import { MAX_ATTEMPTS_PER_QUIZ } from "@/config/study"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import { EXPORT_VERSION, type QuizAttempt } from "@/types/learner"
import { createLearnerStore } from "./learner-store"

let n = 0
const setup = () => {
  const repo = createDexieRepository(`study-db-${++n}-${Math.random()}`)
  return {
    repo,
    store: createLearnerStore(repo, () => new Date("2026-11-04T09:00:00.000Z")),
  }
}
const attempt = (i: number, quizId = "module.java-core"): QuizAttempt => ({
  id: `att-${quizId}-${i}`,
  quizId,
  kind: "module",
  takenAt: `2026-11-04T09:${String(i % 60).padStart(2, "0")}:00.000Z`,
  seed: i,
  total: 10,
  correct: 7,
  passMark: 0.7,
  passed: true,
  items: [{ itemId: "check.java-core.a.x", correct: true }],
})

describe("quiz attempts and project states", () => {
  it("are stored, survive a reload and are exported in the current version", async () => {
    const { repo, store } = setup()
    await store.getState().hydrate()
    await store.getState().recordQuizAttempt(attempt(1))
    await store.getState().saveProjectState("hello-cli", (p) => ({
      ...p,
      repoUrl: "https://example.org/me/hello",
      notes: "first notes",
    }))
    const again = createLearnerStore(repo)
    await again.getState().hydrate()
    expect(again.getState().quizAttempts).toHaveLength(1)
    expect(again.getState().projectStates[0]).toMatchObject({
      id: "hello-cli",
      repoUrl: "https://example.org/me/hello",
      notes: "first notes",
    })
    const bundle = again.getState().exportData()
    expect(EXPORT_VERSION).toBe(8)
    expect(bundle.version).toBe(8)
    expect(bundle.quizAttempts).toHaveLength(1)
    // only correctness is kept per item, never what the learner typed
    expect(Object.keys(bundle.quizAttempts[0].items[0]).sort()).toEqual([
      "correct",
      "itemId",
    ])
  })

  it("keeps at most MAX_ATTEMPTS_PER_QUIZ attempts per quiz, dropping the oldest, and leaves other quizzes alone", async () => {
    const { repo, store } = setup()
    await store.getState().hydrate()
    await store.getState().recordQuizAttempt(attempt(0, "module.other"))
    for (let i = 0; i < MAX_ATTEMPTS_PER_QUIZ + 3; i++)
      await store.getState().recordQuizAttempt(attempt(i))
    const mine = store
      .getState()
      .quizAttempts.filter((a) => a.quizId === "module.java-core")
    expect(mine).toHaveLength(MAX_ATTEMPTS_PER_QUIZ)
    expect(mine[0].id).toBe("att-module.java-core-3")
    expect(
      store.getState().quizAttempts.some((a) => a.quizId === "module.other")
    ).toBe(true)
    const again = createLearnerStore(repo)
    await again.getState().hydrate()
    expect(
      again
        .getState()
        .quizAttempts.filter((a) => a.quizId === "module.java-core")
    ).toHaveLength(MAX_ATTEMPTS_PER_QUIZ)
  }, 30000)

  it("round-trip through export and import, and a reset removes them (and the English state) from the database", async () => {
    const { repo, store } = setup()
    await store.getState().hydrate()
    await store.getState().recordQuizAttempt(attempt(1))
    await store
      .getState()
      .updateEnglish((s) => ({ ...s, passes: { "en.a.b.c": 1 } }))
    const parsed = parseImport(JSON.stringify(store.getState().exportData()))
    const other = setup().store
    await other.getState().hydrate()
    if (parsed.ok) await other.getState().importData(parsed.bundle)
    expect(other.getState().quizAttempts).toHaveLength(1)
    await store.getState().resetAll()
    const after = await repo.load()
    expect(after.quizAttempts).toEqual([])
    expect(after.projectStates).toEqual([])
    expect(after.english).toBeNull()
  })

  it("imports version 1 to 6 files with none of it, and refuses a newer file", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const bundle = store.getState().exportData()
    for (const version of [1, 2, 3, 4, 5, 6, 7]) {
      const old = { ...bundle, version } as Record<string, unknown>
      delete old.readinessSnapshots
      delete old.targetRoles
      if (version < 7) {
        delete old.quizAttempts
        delete old.projectStates
      }
      if (version < 6) delete old.english
      if (version < 5) {
        delete old.resume
        delete old.resumeQuestions
      }
      if (version < 4) delete old.mockSessions
      if (version < 3) delete old.hrAnswers
      const r = parseImport(JSON.stringify(old))
      expect(r.ok, `v${version}`).toBe(true)
      expect(r.ok && r.bundle.quizAttempts).toEqual([])
      expect(r.ok && r.bundle.projectStates).toEqual([])
    }
    expect(
      parseImport(JSON.stringify({ ...bundle, version: EXPORT_VERSION + 1 })).ok
    ).toBe(false)
  })

  it("upgrades a version 6 database without losing anything", async () => {
    const name = `upgrade-v6-${Math.random()}`
    const old = new Dexie(name)
    old.version(6).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
      english: "id",
    })
    await old.table("questionProgress").put({
      questionId: "react.fresher.x",
      completed: true,
      note: "from v6",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    old.close()
    const snap = await createDexieRepository(name).load()
    expect(snap.questionProgress[0]).toMatchObject({ note: "from v6" })
    expect(snap.quizAttempts).toEqual([])
    expect(snap.projectStates).toEqual([])
  })
})

describe("readiness snapshots and target roles (v8)", () => {
  it("keeps one snapshot per week, saves and deletes target roles (max 20), round-trips through export and survives reload", async () => {
    const { repo, store } = setup()
    await store.getState().hydrate()
    const snap = {
      id: "2026-11-02",
      takenAt: "2026-11-04T09:00:00.000Z",
      overall: 41,
      weakTopics: 3,
      averageConfidence: 3.2,
    }
    await store.getState().recordReadinessSnapshot(snap)
    await store.getState().recordReadinessSnapshot({ ...snap, overall: 99 })
    expect(store.getState().readinessSnapshots).toEqual([snap])
    for (let i = 0; i < 22; i++)
      await store.getState().saveTargetRole({
        id: `r${i}`,
        name: `Role ${i}`,
        savedAt: `2026-11-04T09:${String(i).padStart(2, "0")}:00.000Z`,
        matched: [{ skillId: "react", mentions: 2 }],
        text: i === 21 ? "kept text" : null,
      })
    expect(store.getState().targetRoles).toHaveLength(20)
    expect(store.getState().targetRoles.at(-1)?.text).toBe("kept text")
    await store.getState().deleteTargetRole("r21")
    expect(store.getState().targetRoles.some((r) => r.id === "r21")).toBe(false)
    const again = createLearnerStore(repo)
    await again.getState().hydrate()
    expect(again.getState().readinessSnapshots).toHaveLength(1)
    expect(again.getState().targetRoles).toHaveLength(19)
    const parsed = parseImport(JSON.stringify(again.getState().exportData()))
    expect(parsed.ok && parsed.bundle.targetRoles).toHaveLength(19)
    await again.getState().resetAll()
    const after = await repo.load()
    expect(after.readinessSnapshots).toEqual([])
    expect(after.targetRoles).toEqual([])
  }, 30000)

  it("upgrades a version 7 database without losing anything", async () => {
    const name = `upgrade-v7-${Math.random()}`
    const old = new Dexie(name)
    old.version(7).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
      english: "id",
      quizAttempts: "id, quizId, takenAt",
      projectStates: "id",
    })
    await old.table("questionProgress").put({
      questionId: "react.fresher.x",
      completed: true,
      note: "from v7",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    old.close()
    const snap = await createDexieRepository(name).load()
    expect(snap.questionProgress[0]).toMatchObject({ note: "from v7" })
    expect(snap.readinessSnapshots).toEqual([])
    expect(snap.targetRoles).toEqual([])
  })
})
