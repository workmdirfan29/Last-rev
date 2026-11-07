import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { CONTENT_STATUS } from "./content-status"
import { LESSON_STATUS } from "./lesson-status"
import type { CatalogModule } from "./module-types"
import { AI_MODULES } from "./modules/ai"
import { CAREER_MODULES } from "./modules/career"
import { DATA_SCIENCE_MODULES } from "./modules/data-science"
import { DATABASE_MODULES } from "./modules/database"
import { DEVOPS_MODULES } from "./modules/devops"
import { FOUNDATION_MODULES } from "./modules/foundation"
import { FRONTEND_MODULES } from "./modules/frontend"
import { HR_MODULES } from "./modules/hr"
import { JAVA_MODULES } from "./modules/java"
import { MERN_MODULES } from "./modules/mern"
import { MOBILE_MODULES } from "./modules/mobile"
import { RESUME_MODULES } from "./modules/resume"

/**
 * The shared module pool. A module is defined ONCE (per technology) in the
 * domain files under ./modules and referenced by any number of roles and
 * roadmaps. Domains are views (`domainId`, `alsoIn`), never owners. Question
 * content lives in src/data/questions/<id>/<level>.ts; a module with no
 * question files is listed honestly as "in preparation".
 */
const AUTHORED: CatalogModule[] = [
  ...FOUNDATION_MODULES,
  ...FRONTEND_MODULES,
  ...JAVA_MODULES,
  ...MERN_MODULES,
  ...DATABASE_MODULES,
  ...MOBILE_MODULES,
  ...DEVOPS_MODULES,
  ...AI_MODULES,
  ...DATA_SCIENCE_MODULES,
  ...CAREER_MODULES,
  ...HR_MODULES,
  ...RESUME_MODULES,
]

/** The pool with each module's editorial content status applied. */
export const MODULES: CatalogModule[] = AUTHORED.map((m) => {
  const lessons = LESSON_INDEX.filter((l) => l.moduleId === m.id)
    .sort((a, b) => a.order - b.order)
    .map((l) => ({ id: l.id, title: l.title, minutes: l.minutes }))
  return {
    ...m,
    contentStatus: CONTENT_STATUS[m.id] ?? "planned",
    // "released" is only ever set by hand and checked by the gate; otherwise it follows what exists.
    lessonStatus:
      LESSON_STATUS[m.id] ?? (lessons.length > 0 ? "in-progress" : "planned"),
    lessons,
  }
})

export const MODULE_BY_ID: ReadonlyMap<string, CatalogModule> = new Map(
  MODULES.map((m) => [m.id, m])
)

export function getModule(id: string): CatalogModule | undefined {
  return MODULE_BY_ID.get(id)
}
