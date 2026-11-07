import Dexie from "dexie"
import { describe, expect, it } from "vitest"
import { generateQuestions, reconcile } from "@/services/resume/generate"
import { parseResume } from "@/services/resume/parse"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { parseImport } from "@/services/storage/import-export"
import { EXPORT_VERSION, resumeProfileSchema } from "@/types/learner"
import { createLearnerStore } from "./learner-store"

let n = 0
const setup = () => {
  const repo = createDexieRepository(`resume-db-${++n}-${Math.random()}`)
  return {
    repo,
    store: createLearnerStore(repo, () => new Date("2026-11-04T09:00:00.000Z")),
  }
}
const lines = [
  "SUMMARY",
  "Backend developer who builds small services.",
  "SKILLS",
  "Languages: Java, SQL",
  "EXPERIENCE",
  "Software Engineer | Example Tech Ltd  Jan 2022 - Present",
  "- Built REST APIs with Spring Boot for the order service.",
  "PROJECTS",
  "Inventory Tracker",
  "Technologies: Java, MySQL",
  "- Stock management app with login.",
]
function profile() {
  const { profile } = parseResume(lines)
  return resumeProfileSchema.parse({
    ...profile,
    sourceName: "asha.pdf",
    importedAt: "2026-11-04T09:00:00.000Z",
    updatedAt: "2026-11-04T09:00:00.000Z",
  })
}
const questionsFor = (p: ReturnType<typeof profile>) =>
  reconcile([], generateQuestions(p, p), "2026-11-04T09:00:00.000Z")

describe("the resume in the store", () => {
  it("saves the reviewed profile and its questions, and they survive a reload; no PDF or raw text is kept", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    const p = profile()
    await store.getState().saveResume(p)
    await store.getState().setResumeQuestions(questionsFor(p))
    const fresh = createLearnerStore(repo)
    await fresh.getState().hydrate()
    expect(fresh.getState().resume?.experiences[0].company).toBe(
      "Example Tech Ltd"
    )
    expect(fresh.getState().resumeQuestions.length).toBeGreaterThan(5)
    // only the reviewed profile fields are stored: no binary, no raw extracted text
    const keys = Object.keys(fresh.getState().resume!).sort()
    expect(keys).toEqual([
      "achievements",
      "certifications",
      "education",
      "experiences",
      "id",
      "importedAt",
      "includeDateQuestions",
      "other",
      "projects",
      "raiseCaps",
      "skills",
      "sourceName",
      "summary",
      "unplaced",
      "updatedAt",
    ])
    expect(JSON.stringify(fresh.getState().resume)).not.toContain("%PDF")
  })

  it("deleting the resume removes the profile, the generated questions and the learner's notes and answers for them, but keeps imported sets", async () => {
    const { store, repo } = setup()
    await store.getState().hydrate()
    const p = profile()
    const qs = questionsFor(p)
    await store.getState().saveResume(p)
    const imported = {
      ...qs[0],
      id: "resume-intro.fresher.importedxx",
      setId: "set_1",
      setLabel: "friend.json",
    }
    await store.getState().setResumeQuestions([...qs, imported])
    const target = qs[1].id
    await store.getState().setNote(target, "my private note")
    await store
      .getState()
      .addHrAnswer({ questionId: target, situation: "an answer" })
    await store
      .getState()
      .addHrAnswer({ questionId: imported.id, situation: "keeps" })
    await store.getState().deleteResume()
    expect(store.getState().resume).toBeNull()
    expect(store.getState().resumeQuestions.map((q) => q.id)).toEqual([
      imported.id,
    ])
    expect(store.getState().progress[target]).toBeUndefined()
    expect(store.getState().hrAnswers.map((a) => a.questionId)).toEqual([
      imported.id,
    ])
    const fresh = createLearnerStore(repo)
    await fresh.getState().hydrate()
    expect(fresh.getState().resume).toBeNull()
    expect(fresh.getState().resumeQuestions).toHaveLength(1)
    expect(fresh.getState().progress[target]).toBeUndefined()
  })

  it("deletes questions with their progress and answers, and reset clears everything", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const p = profile()
    const qs = questionsFor(p)
    await store.getState().saveResume(p)
    await store.getState().setResumeQuestions(qs)
    await store.getState().setNote(qs[0].id, "note")
    await store.getState().deleteResumeQuestions([qs[0].id])
    expect(
      store.getState().resumeQuestions.some((q) => q.id === qs[0].id)
    ).toBe(false)
    expect(store.getState().progress[qs[0].id]).toBeUndefined()
    await store.getState().resetAll()
    expect(store.getState().resume).toBeNull()
    expect(store.getState().resumeQuestions).toEqual([])
  })
})

describe("backup version 5", () => {
  it("round-trips the resume and its questions; v1 to v4 files import with none; a newer file is refused", async () => {
    const { store } = setup()
    await store.getState().hydrate()
    const p = profile()
    await store.getState().saveResume(p)
    await store.getState().setResumeQuestions(questionsFor(p))
    const bundle = store.getState().exportData()
    expect(bundle.version).toBe(EXPORT_VERSION)
    expect(EXPORT_VERSION).toBe(8)
    const parsed = parseImport(JSON.stringify(bundle))
    expect(parsed.ok && parsed.bundle.resume?.sourceName).toBe("asha.pdf")
    const other = setup().store
    await other.getState().hydrate()
    if (parsed.ok) await other.getState().importData(parsed.bundle)
    expect(other.getState().resume?.summary).toContain("Backend developer")
    expect(other.getState().resumeQuestions).toHaveLength(
      bundle.resumeQuestions.length
    )
    for (const version of [1, 2, 3, 4]) {
      const old = { ...bundle, version } as Record<string, unknown>
      delete old.resume
      delete old.resumeQuestions
      if (version < 4) delete old.mockSessions
      if (version < 3) delete old.hrAnswers
      const r = parseImport(JSON.stringify(old))
      expect(r.ok, `v${version}`).toBe(true)
      expect(r.ok && r.bundle.resume).toBeNull()
      expect(r.ok && r.bundle.resumeQuestions).toEqual([])
    }
    expect(
      parseImport(JSON.stringify({ ...bundle, version: EXPORT_VERSION + 1 })).ok
    ).toBe(false)
  })

  it("upgrades a version 4 database without losing anything", async () => {
    const name = `upgrade-v4-${Math.random()}`
    const old = new Dexie(name)
    old.version(4).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
    })
    await old.table("questionProgress").put({
      questionId: "react.fresher.x",
      completed: true,
      note: "from v4",
      updatedAt: "2025-01-01T00:00:00.000Z",
    })
    old.close()
    const snap = await createDexieRepository(name).load()
    expect(snap.questionProgress[0]).toMatchObject({ note: "from v4" })
    expect(snap.resume).toBeNull()
    expect(snap.resumeQuestions).toEqual([])
  })
})
