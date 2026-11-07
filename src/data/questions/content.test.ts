import { describe, expect, it } from "vitest"
import { MODULES, MODULE_BY_ID } from "@/data/catalog/modules"
import { ROLES } from "@/data/catalog/roles"
import { moduleIdsForRoles } from "@/services/curriculum/relevance"
import { questionSchema, type Question } from "@/types/content"
import { QUESTION_INDEX } from "./index.generated"
import { loadModuleQuestions } from "./loaders"
import { parseQuestionId } from "@/services/content/content-service"

describe("catalogue integrity", () => {
  it("has unique module ids", () => {
    const ids = MODULES.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("only references existing modules in prerequisites", () => {
    for (const m of MODULES) {
      for (const p of m.prerequisites) {
        expect(MODULE_BY_ID.has(p), `${m.id} -> prerequisite ${p}`).toBe(true)
      }
    }
  })

  it("has unique role ids and every role references existing modules", () => {
    expect(new Set(ROLES.map((r) => r.id)).size).toBe(ROLES.length)
    for (const r of ROLES) {
      const ids = moduleIdsForRoles([r.id])
      expect(new Set(ids).size, `${r.id} has duplicate modules`).toBe(
        ids.length
      )
      for (const id of ids) {
        expect(MODULE_BY_ID.has(id), `${r.id} -> ${id}`).toBe(true)
      }
    }
  })
})

describe("question content", () => {
  it("every question file is valid, correctly located and uniquely identified", async () => {
    const moduleIds = [...new Set(QUESTION_INDEX.map((q) => q.moduleId))]
    expect(moduleIds.length).toBeGreaterThan(0)
    const all: Question[] = (
      await Promise.all(moduleIds.map(loadModuleQuestions))
    ).flat()

    const seen = new Set<string>()
    for (const q of all) {
      expect(questionSchema.safeParse(q).success, q.id).toBe(true)
      expect(seen.has(q.id), `duplicate id ${q.id}`).toBe(false)
      seen.add(q.id)
      const parsed = parseQuestionId(q.id)
      expect(parsed?.moduleId, q.id).toBe(q.moduleId)
      expect(parsed?.level, q.id).toBe(q.level)
      expect(MODULE_BY_ID.has(q.moduleId), `${q.id} unknown module`).toBe(true)
    }

    // relatedIds must point at real questions
    for (const q of all) {
      for (const rel of q.relatedIds) {
        expect(seen.has(rel), `${q.id} -> related ${rel} does not exist`).toBe(
          true
        )
      }
    }
  })

  it("the generated index is up to date (run `pnpm content:index`)", async () => {
    const moduleIds = [...new Set(QUESTION_INDEX.map((q) => q.moduleId))]
    const all = (await Promise.all(moduleIds.map(loadModuleQuestions))).flat()
    expect(QUESTION_INDEX.map((q) => q.id).sort()).toEqual(
      all.map((q) => q.id).sort()
    )
    for (const entry of QUESTION_INDEX) {
      const q = all.find((x) => x.id === entry.id)!
      expect(entry.title).toBe(q.title)
      expect(entry.difficulty).toBe(q.difficulty)
    }
  })

  it("short answers are speakable (roughly 30–60 seconds ≈ under 110 words)", async () => {
    const moduleIds = [...new Set(QUESTION_INDEX.map((q) => q.moduleId))]
    const all = (await Promise.all(moduleIds.map(loadModuleQuestions))).flat()
    for (const q of all) {
      const words = q.shortAnswer.trim().split(/\s+/).length
      expect(
        words,
        `${q.id} shortAnswer has ${words} words`
      ).toBeLessThanOrEqual(110)
      expect(words, `${q.id} shortAnswer too short`).toBeGreaterThanOrEqual(20)
    }
  })
})
