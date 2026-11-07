import type { DomainId } from "@/data/catalog/module-types"

/**
 * What each interview type draws from. Small and declarative: the pool itself is derived from the catalogue,
 * the role relevance and the question bank (services/mock/pool.ts), never from a hand-written list of modules.
 */
export const MOCK_TYPES = [
  "hr",
  "technical",
  "java",
  "mern",
  "python",
  "data-science",
  "project",
  "mixed",
  "custom",
] as const
export type MockType = (typeof MOCK_TYPES)[number]

export interface MockTypeDef {
  id: MockType
  title: string
  description: string
  /** Role whose core and recommended modules count (path types only). */
  role?: string
  /** Domains a path type draws from. */
  domains?: readonly DomainId[]
  /** The learner picks the modules (Technical narrows its pool, Custom chooses freely). */
  pickModules?: boolean
  /** The type is level-neutral. */
  levelNeutral?: boolean
}

export const MOCK_TYPE_DEFS: Record<MockType, MockTypeDef> = {
  hr: {
    id: "hr",
    title: "HR mock",
    description: "Behavioural and HR questions.",
    levelNeutral: true,
  },
  technical: {
    id: "technical",
    title: "Technical mock",
    description: "Questions from the modules in your syllabus.",
    pickModules: true,
  },
  java: {
    id: "java",
    title: "Java mock",
    description: "Java backend questions.",
    role: "java-developer",
    domains: ["java-backend"],
  },
  mern: {
    id: "mern",
    title: "MERN mock",
    description: "Frontend and Node questions for the MERN stack.",
    role: "mern-stack",
    domains: ["frontend", "mern-backend"],
  },
  python: {
    id: "python",
    title: "Python mock",
    description: "Python questions.",
    role: "python-developer",
    domains: ["python"],
  },
  "data-science": {
    id: "data-science",
    title: "Data Science mock",
    description: "Data science and Python questions.",
    role: "data-science",
    domains: ["data-science", "python"],
  },
  project: {
    id: "project",
    title: "Project-based mock",
    description: "Project questions and the questions you wrote yourself.",
    levelNeutral: true,
  },
  mixed: {
    id: "mixed",
    title: "Mixed mock",
    description: "Technical and HR questions together.",
    pickModules: true,
  },
  custom: {
    id: "custom",
    title: "Custom mock",
    description: "You choose the modules.",
    pickModules: true,
  },
}

export const PROJECT_MODULE_ID = "project-questions"
