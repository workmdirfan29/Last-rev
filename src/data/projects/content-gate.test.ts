import { describe, expect, it } from "vitest"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { validateProjects } from "@/services/projects/gate"
import { PROJECT_FILES, PROJECTS } from "./index"

/** The gate over the real projects. It passes with none: projects are added in reviewed batches. */
describe("the study projects", () => {
  it("pass every content rule", () => {
    const entries = [...PROJECT_FILES].map(([fileKey, project]) => ({
      fileKey,
      project,
    }))
    expect(
      validateProjects(entries, {
        lessonIds: new Set(LESSON_INDEX.map((l) => l.id)),
      })
    ).toEqual([])
  })
  it("are listed once each", () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length)
  })
})
