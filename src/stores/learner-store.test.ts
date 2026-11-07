import { beforeEach, describe, expect, it } from "vitest"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import { createLearnerStore } from "./learner-store"

let n = 0
let now = new Date("2026-11-02T09:00:00.000Z")

function setup() {
  const repo = createDexieRepository(`test-db-${++n}`)
  const store = createLearnerStore(repo, () => now)
  return { repo, store }
}

const Q = "react.fresher.what-is-jsx"

beforeEach(() => {
  now = new Date("2026-11-02T09:00:00.000Z")
  localStorage.clear()
})

describe("learner store", () => {
  it("starts empty after hydrate", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const s = store.getState()
    expect(s.status).toBe("ready")
    expect(s.profile).toBeNull()
    expect(s.progress).toEqual({})
  })

  it("loads once: a second hydrate neither re-reads the database nor overwrites newer in-memory changes", async () => {
    const { store } = setup()
    // two overlapping loads (React StrictMode, or an app mounted right after seeding) share one read
    const first = store.getState().hydrate()
    const second = store.getState().hydrate()
    await Promise.all([first, second])
    await store.getState().toggleCompleted(Q, 4)
    store.setState((s) => ({
      progress: {
        ...s.progress,
        [Q]: { ...s.progress[Q], nextReviewAt: "2020-01-01T00:00:00.000Z" },
      },
    }))
    await store.getState().hydrate() // already loaded: must not bring back the older database copy
    expect(store.getState().progress[Q].nextReviewAt).toBe(
      "2020-01-01T00:00:00.000Z"
    )
  })

  it("a load that started before the data was cleared never applies its result", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    await store.getState().toggleCompleted(Q, 4)
    store.setState({ status: "loading" })
    const stale = store.getState().hydrate() // reads the database, which still holds the answer
    await store.getState().resetAll()
    store.setState({ status: "loading" })
    await stale
    expect(store.getState().status).toBe("loading") // the stale result was dropped
    await store.getState().hydrate()
    expect(store.getState().progress).toEqual({})
    void repo
  })

  it("completing a question schedules a review, logs activity and persists", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    await store.getState().toggleCompleted(Q, 4)

    const p = store.getState().progress[Q]
    expect(p.completed).toBe(true)
    expect(p.nextReviewAt).toBe("2026-11-03T09:00:00.000Z")
    expect(store.getState().activity).toHaveLength(1)
    expect(store.getState().activity[0]).toMatchObject({
      type: "question",
      refId: Q,
      minutes: 4,
    })

    const snap = await repo.load()
    expect(snap.questionProgress).toHaveLength(1)
    expect(snap.activity).toHaveLength(1)
  })

  it("survives a reload (new store, same database)", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    await store.getState().toggleCompleted(Q)
    await store.getState().setNote(Q, "remember the fragment syntax")

    const reloaded = createLearnerStore(repo, () => now)
    await reloaded.getState().hydrate()
    expect(reloaded.getState().progress[Q].completed).toBe(true)
    expect(reloaded.getState().progress[Q].note).toBe(
      "remember the fragment syntax"
    )
  })

  it("logs the activity type a feature asks for when completing an item", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().toggleCompleted("linux.command.chmod", 5, "linux")

    expect(store.getState().progress["linux.command.chmod"].completed).toBe(
      true
    )
    expect(store.getState().activity.map((a) => a.type)).toEqual(["linux"])
  })

  it("does not farm activity by re-toggling the same question on the same day", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().toggleCompleted(Q)
    await store.getState().toggleCompleted(Q)
    await store.getState().toggleCompleted(Q)
    expect(store.getState().activity).toHaveLength(1)
  })

  it("un-completing clears the review schedule but keeps notes and flags", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().setNote(Q, "keep me")
    await store.getState().toggleFlag(Q, "bookmarked")
    await store.getState().toggleCompleted(Q)
    await store.getState().toggleCompleted(Q)
    const p = store.getState().progress[Q]
    expect(p.completed).toBe(false)
    expect(p.nextReviewAt).toBeNull()
    expect(p.note).toBe("keep me")
    expect(p.bookmarked).toBe(true)
  })

  it("toggles flags independently", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().toggleFlag(Q, "difficult")
    await store.getState().toggleFlag(Q, "revision")
    await store.getState().toggleFlag(Q, "difficult")
    const p = store.getState().progress[Q]
    expect(p.difficult).toBe(false)
    expect(p.revision).toBe(true)
    expect(p.bookmarked).toBe(false)
  })

  it("tracks confidence separately from completion and toggles off on repeat", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().setConfidence(Q, 4)
    expect(store.getState().progress[Q]).toMatchObject({
      confidence: 4,
      completed: false,
    })
    await store.getState().setConfidence(Q, 4)
    expect(store.getState().progress[Q].confidence).toBe(0)
  })

  it("advances the revision schedule on a confident review and resets on a shaky one", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().toggleCompleted(Q)
    now = new Date("2026-11-03T09:00:00.000Z")
    await store.getState().reviewQuestion(Q, 4)
    expect(store.getState().progress[Q]).toMatchObject({
      revisionStage: 1,
      nextReviewAt: "2026-11-06T09:00:00.000Z",
    })
    now = new Date("2026-11-06T09:00:00.000Z")
    await store.getState().reviewQuestion(Q, 1)
    expect(store.getState().progress[Q]).toMatchObject({
      revisionStage: 0,
      nextReviewAt: "2026-11-07T09:00:00.000Z",
    })
  })

  it("changing the profile never deletes progress", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    await store.getState().saveProfile({
      selectedRoles: ["frontend-developer"],
      targetPreset: "30d",
    })
    await store.getState().toggleCompleted(Q)
    await store.getState().saveProfile({
      selectedRoles: ["mern-stack-developer"],
      targetPreset: "7d",
    })
    expect(store.getState().progress[Q].completed).toBe(true)
    expect(store.getState().profile?.targetPreset).toBe("7d")
  })

  it("round-trips through export and import", async () => {
    const a = setup()
    await a.store.getState().hydrate()
    await a.store.getState().saveProfile({
      displayName: "Shah",
      selectedRoles: ["frontend-developer"],
    })
    await a.store.getState().toggleCompleted(Q)
    await a.store.getState().setConfidence(Q, 5)
    const json = JSON.stringify(a.store.getState().exportData())

    const result = parseImport(json)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    const b = setup()
    await b.store.getState().hydrate()
    await b.store.getState().importData(result.bundle)
    expect(b.store.getState().profile?.displayName).toBe("Shah")
    expect(b.store.getState().progress[Q]).toMatchObject({
      completed: true,
      confidence: 5,
    })

    const reloaded = createLearnerStore(b.repo, () => now)
    await reloaded.getState().hydrate()
    expect(reloaded.getState().progress[Q].completed).toBe(true)
  })

  it("resetAll wipes everything", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    await store.getState().saveProfile({ displayName: "x" })
    await store.getState().toggleCompleted(Q)
    await store.getState().resetAll()
    expect(store.getState().progress).toEqual({})
    const snap = await repo.load()
    expect(snap.profile).toBeNull()
    expect(snap.questionProgress).toHaveLength(0)
    expect(snap.activity).toHaveLength(0)
  })
})
