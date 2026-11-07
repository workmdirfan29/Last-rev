import Dexie from "dexie"
import { describe, expect, it } from "vitest"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import { EXPORT_VERSION } from "@/types/learner"
import { createLearnerStore } from "./learner-store"

let n = 0
const setup = () => {
  const repo = createDexieRepository(`english-db-${++n}-${Math.random()}`)
  return {
    repo,
    store: createLearnerStore(repo, () => new Date("2026-11-04T09:00:00.000Z")),
  }
}

describe("the spoken English state", () => {
  it("starts empty, is stored in its own row and survives a reload", async () => {
    const { repo, store } = setup()
    await store.getState().hydrate()
    expect(store.getState().english).toBeNull()
    await store.getState().updateEnglish((s) => ({
      ...s,
      passes: { "en.fundamentals.alphabet.letters-a-c": 1 },
      challenge: { ...s.challenge, startDate: "2026-11-04" },
    }))
    const again = createLearnerStore(repo)
    await again.getState().hydrate()
    expect(again.getState().english?.passes).toEqual({
      "en.fundamentals.alphabet.letters-a-c": 1,
    })
    expect(again.getState().english?.challenge.startDate).toBe("2026-11-04")
  })

  it("keeps lesson and item progress as ordinary progress records that schedule a review", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store
      .getState()
      .toggleCompleted("en.fundamentals.alphabet.letters-a-c", 1, "english")
    const p = store.getState().progress["en.fundamentals.alphabet.letters-a-c"]
    expect(p.completed).toBe(true)
    expect(p.nextReviewAt).not.toBeNull()
    expect(store.getState().activity.at(-1)?.type).toBe("english")
  })

  it("is exported in the current version, imports back, and is wiped by reset", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().updateEnglish((s) => ({
      ...s,
      speaking: [
        {
          itemId: "en.x.y.z",
          rating: 4,
          at: "2026-11-04T09:00:00.000Z",
          day: 2,
        },
      ],
    }))
    const bundle = store.getState().exportData()
    expect(EXPORT_VERSION).toBe(8)
    expect(bundle.version).toBe(8)
    expect(bundle.english?.speaking[0]).toMatchObject({ rating: 4, day: 2 })
    // the rating only: no audio or transcript is ever part of a backup
    expect(JSON.stringify(bundle)).not.toMatch(/audio|transcript|blob:/i)
    const parsed = parseImport(JSON.stringify(bundle))
    const other = setup().store
    await other.getState().hydrate()
    if (parsed.ok) await other.getState().importData(parsed.bundle)
    expect(other.getState().english?.speaking).toHaveLength(1)
    await other.getState().resetAll()
    expect(other.getState().english).toBeNull()
  })

  it("imports version 1 to 6 files with no English state, and refuses a newer file", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const bundle = store.getState().exportData()
    for (const version of [1, 2, 3, 4, 5, 6]) {
      const old = { ...bundle, version } as Record<string, unknown>
      delete old.english
      if (version < 5) {
        delete old.resume
        delete old.resumeQuestions
      }
      if (version < 4) delete old.mockSessions
      if (version < 3) delete old.hrAnswers
      const r = parseImport(JSON.stringify(old))
      expect(r.ok, `v${version}`).toBe(true)
      expect(r.ok && r.bundle.english).toBeNull()
    }
    expect(
      parseImport(JSON.stringify({ ...bundle, version: EXPORT_VERSION + 1 })).ok
    ).toBe(false)
  })

  it("upgrades a version 5 database without losing anything", async () => {
    const name = `upgrade-v5-${Math.random()}`
    const old = new Dexie(name)
    old.version(5).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
    })
    await old.table("questionProgress").put({
      questionId: "react.fresher.x",
      completed: true,
      note: "from v5",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    old.close()
    const snap = await createDexieRepository(name).load()
    expect(snap.questionProgress[0]).toMatchObject({ note: "from v5" })
    expect(snap.english).toBeNull()
  })
})
