import type { ModuleDef } from "@/types/content"

/**
 * Domains are views over the one module pool, never owners of modules. A module
 * has one `domainId` and may also be shown under others via `alsoIn`.
 */
export const DOMAIN_IDS = [
  "foundation",
  "frontend",
  "java-backend",
  "mern-backend",
  "python",
  "database",
  "mobile",
  "devops",
  "ai",
  "data-science",
  "career",
] as const
export type DomainId = (typeof DOMAIN_IDS)[number]

export const DOMAIN_LABEL: Record<DomainId, string> = {
  foundation: "Shared Engineering Foundation",
  frontend: "Frontend",
  "java-backend": "Java Backend",
  "mern-backend": "MERN Backend",
  python: "Python Engineering",
  database: "Database",
  mobile: "Mobile",
  devops: "Deployment & DevOps",
  ai: "AI Engineering",
  "data-science": "Data Science",
  career: "Interview & Career",
}

/** Domains a Study syllabus can show. `career` holds interview-only modules. */
export const STUDY_DOMAIN_IDS: readonly DomainId[] = DOMAIN_IDS.filter(
  (d) => d !== "career"
)

/**
 * How far a module's question set has come. "released" means it passed the content gate (at least
 * 25 fresher questions, every question sourced from an allowed official site, no duplicates and no
 * invented frequency claims). The gate test enforces it, so the label cannot drift from the content.
 */
export type ContentStatus = "released" | "in-progress" | "planned"

export const CONTENT_STATUS_LABEL: Record<ContentStatus, string> = {
  released: "Questions ready",
  "in-progress": "Questions in progress",
  planned: "Questions planned",
}

export const LESSON_STATUS_LABEL: Record<ContentStatus, string> = {
  released: "Lessons ready",
  "in-progress": "Lessons in progress",
  planned: "Lessons planned",
}

/** Questions a released module must have at the fresher level. */
export const RELEASE_MIN_FRESHER_QUESTIONS = 25
/** HR interview modules (`hr-*`) are level-neutral: a released one needs this many questions in total. */
export const HR_RELEASE_MIN_QUESTIONS = 5

export type Difficulty = "beginner" | "intermediate" | "advanced"

/** One syllabus topic. `minutes` is the authored effort to learn it, before practice and revision. */
export interface Topic {
  title: string
  minutes: number
  /** Submodule, e.g. Git / GitHub / Bitbucket inside the Git module. */
  group?: string
}

/** A written lesson, as the catalogue lists it. The full lesson is in `data/lessons`. */
export interface Lesson {
  id: string
  title: string
  minutes: number
}

export interface CatalogModule extends ModuleDef {
  domainId: DomainId
  alsoIn: DomainId[]
  difficulty: Difficulty
  /** Syllabus outline with per-topic minutes. `topics` (titles) is derived from it. */
  topicList: Topic[]
  /** Editorial status of the module's question set (see ContentStatus). */
  contentStatus: ContentStatus
  /** Editorial status of the module's Study Zone lessons (derived from the lesson index; "released" only via the gate). */
  lessonStatus: ContentStatus
  /** The lessons that exist (from the generated lesson index). Empty until the module's lessons are written. */
  lessons: Lesson[]
  assignmentIds: string[]
  projectIds: string[]
}
