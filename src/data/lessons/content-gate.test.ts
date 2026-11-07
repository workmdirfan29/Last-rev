import { describe, expect, it } from "vitest"
import { LESSON_STATUS } from "@/data/catalog/lesson-status"
import { MODULE_BY_ID, MODULES } from "@/data/catalog/modules"
import { releaseProblems, validateLessons } from "@/services/lessons/gate"
import { topicIdOf } from "@/utils/topic-id"
import { LESSON_FILE_PATTERN } from "@/types/lesson"
import { runnableExerciseProblems } from "@/services/lessons/runnable-gate"
import { LESSON_INDEX } from "./index.generated"
import { lessonFileKeys, loadAllStudyLessons } from "./loaders"

/** The gate over the real lessons. It passes with no lessons at all: modules are authored in batches. */
describe("the study lessons", () => {
  it("pass every content rule", async () => {
    const lessons = await loadAllStudyLessons()
    expect(validateLessons(lessons, MODULE_BY_ID)).toEqual([])
  })

  it("have a generated index that is up to date (run `pnpm lessons:index`)", async () => {
    const lessons = await loadAllStudyLessons()
    expect(LESSON_INDEX.map((l) => l.id).sort()).toEqual(
      lessons.map((l) => l.id).sort()
    )
    for (const entry of LESSON_INDEX) {
      const lesson = lessons.find((l) => l.id === entry.id)!
      expect(entry.moduleId).toBe(lesson.moduleId)
      expect(entry.title).toBe(lesson.title)
      expect(entry.topic).toBe(lesson.topic)
      expect(entry.topicId).toBe(topicIdOf(lesson.moduleId, lesson.topic))
      expect(entry.minutes).toBe(lesson.minutes)
      expect(entry.check).toEqual(
        lesson.check.map((c) => ({ id: c.id, type: c.type }))
      )
      expect(entry.assignment.checklist).toBe(
        lesson.assignment.checklist.length
      )
      expect(entry.exercises.map((e) => e.slug)).toEqual(
        lesson.exercises.map((e) => e.slug)
      )
    }
  })

  it("sit in a folder named after a catalogue module, in a file named NN-<slug>.ts whose slug and order match", () => {
    const orders = new Map<string, Set<number>>()
    for (const key of lessonFileKeys()) {
      const [moduleId, file] = key.split("/")
      expect(MODULE_BY_ID.has(moduleId), `${key}: no such module`).toBe(true)
      const m = LESSON_FILE_PATTERN.exec(`${file}.ts`)!
      expect(m, `${key}: file must be named NN-<slug>.ts`).not.toBeNull()
      const entry = LESSON_INDEX.find((l) => l.file === key)!
      expect(entry.slug, key).toBe(m[2])
      expect(entry.order, key).toBe(Number(m[1]))
      const seen = orders.get(moduleId) ?? new Set()
      expect(
        seen.has(entry.order),
        `${moduleId}: two lessons numbered ${entry.order}`
      ).toBe(false)
      seen.add(entry.order)
      orders.set(moduleId, seen)
    }
  })

  it("keep each module's lesson status honest: 'released' only when the release rule holds, nothing 'planned' that has lessons", async () => {
    const lessons = await loadAllStudyLessons()
    for (const [id, status] of Object.entries(LESSON_STATUS)) {
      expect(MODULE_BY_ID.has(id), id).toBe(true)
      expect(["released", "in-progress", "planned"]).toContain(status)
    }
    const withLessons = new Set(LESSON_INDEX.map((l) => l.moduleId))
    for (const m of MODULES) {
      if (withLessons.has(m.id))
        expect(m.lessonStatus, m.id).not.toBe("planned")
      else expect(m.lessonStatus, m.id).toBe("planned")
      expect(m.lessons.length, m.id).toBe(
        LESSON_INDEX.filter((l) => l.moduleId === m.id).length
      )
      if (m.lessonStatus === "released")
        expect(releaseProblems(m, lessons), m.id).toEqual([])
    }
  })

  it("run their runnable exercises: every reference solution passes its cases and no starter does", async () => {
    expect(await runnableExerciseProblems(await loadAllStudyLessons())).toEqual(
      []
    )
  })
})
