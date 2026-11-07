/**
 * How relevant each module is to each career path, and the single source for
 * every role's syllabus. Roles never list modules themselves.
 *
 * One row per module, one letter per role, in ROLE_ORDER:
 *   C = core (on by default; the learner can still remove it), R = recommended, O = optional,
 *   - = not part of the role (still in the full catalogue).
 * A module missing from this table is "-" for every role.
 *
 * Cells that come from the learner's own matrix (their five columns) are
 * marked "matrix"; the rest are mapped by their stated rules and are
 * "derived" so they are easy to adjust:
 *   1 every role gets the foundation          5 Frontend is not forced into Java
 *   2 each role gets its technical modules    6 Java Developer is not forced into MongoDB/Express
 *   3 Java + MERN has both stacks             7 React Native is optional unless a role needs mobile
 *   4 Data Science gets Python/statistics/ETL 8 AI modules are core for AI Engineer
 * The matrix's "Python FS" column is the Python Full Stack AI Engineer roadmap
 * and the Full Stack role. The plain Python Developer role has no core frontend.
 */
export type Tier = "core" | "recommended" | "optional"

export const ROLE_ORDER = [
  "java-full-stack",
  "java-mern-full-stack",
  "java-developer",
  "python-developer",
  "data-science",
  "mern-stack",
  "frontend-developer",
  "full-stack",
  "ai-engineer",
] as const
export type RoleId = (typeof ROLE_ORDER)[number]

//   JFS = Java Full Stack, JMERN = Java + MERN, JDEV = Java Developer, PYD = Python Developer,
//   DS = Data Science, MERN, FE = Frontend, FS = Full Stack, AI = AI Engineer
//                        JFS JMERN JDEV PYD DS MERN FE FS AI
const TABLE: Record<string, string> = {
  // Shared foundation (every role)
  "computer-fundamentals": "RRRRRRRRR",
  "operating-systems": "RRRRORRRR",
  linux: "CCCCCCCCC", // matrix
  "linux-commands": "CCCCRCRCC",
  "ubuntu-admin": "RRORORORO",
  networking: "CCCCCCCCC", // matrix
  http: "CCCCCCCCC", // matrix
  git: "CCCCCCCCC", // matrix
  testing: "CCCCCCCCC", // matrix
  "rest-apis": "CCCCOCRCC",
  debugging: "CCCCCCCCC",
  agile: "RRRRORRRR",
  "dev-tools": "OR-O-RRR-",
  dsa: "RRRRORRRO",
  "system-design": "RRRR-RRRR",
  // Deployment and DevOps (matrix: Docker, CI/CD and AWS are core for the four developer roles, optional for Data Science)
  docker: "CCCCOCRCR",
  "ci-cd": "CCCCOCRCR",
  aws: "CCCCOCRCR",
  deployment: "CCRCOCOCR",
  nginx: "RRORORORO",
  logging: "RRRRORORR",
  "project-questions": "CCCCCCCCC", // interview-only: never part of a Study syllabus
  // HR interview categories: the same for every role (interview-only). The experience-aware pair is
  // recommended here and moves to optional for the other experience levels (see EXPERIENCE_AWARE_TIERS).
  "hr-tell-me-about-yourself": "CCCCCCCCC",
  "hr-why-hire-you": "CCCCCCCCC",
  "hr-strengths-weaknesses": "CCCCCCCCC",
  "hr-why-this-company": "CCCCCCCCC",
  "hr-teamwork": "CCCCCCCCC",
  "hr-communication": "CCCCCCCCC",
  "hr-career-goals": "RRRRRRRRR",
  "hr-handling-pressure": "RRRRRRRRR",
  "hr-conflict-resolution": "RRRRRRRRR",
  "hr-failure-challenges": "RRRRRRRRR",
  "hr-behavioural": "RRRRRRRRR",
  "hr-work-ethics": "RRRRRRRRR",
  "hr-tricky-questions": "RRRRRRRRR",
  "hr-salary-expectations": "RRRRRRRRR",
  "hr-leadership": "RRRRRRRRR",
  "hr-changing-jobs": "OOOOOOOOO",
  "hr-employment-gaps": "OOOOOOOOO",
  "hr-joining-availability": "OOOOOOOOO",
  "hr-fresher-specific": "RRRRRRRRR",
  "hr-experienced-candidate": "RRRRRRRRR",
  // Frontend (matrix: core for Java FS, Java+MERN and MERN, optional for Data Science; Python Developer is not forced into it)
  html: "CCOOOCCCO",
  css: "CCOOOCCCO",
  javascript: "CCOROCCCO",
  typescript: "CCOOOCCCO",
  react: "CCOOOCCCO",
  "react-hooks": "CCOOOCCCO",
  "react-router": "RR---CCC-",
  "state-management": "RR---RCR-",
  "tanstack-query": "OR---RRR-",
  "forms-validation": "RR---RRR-",
  "ui-libraries": "OR---RRR-",
  "frontend-testing": "RR---RRR-",
  "frontend-performance": "OO---RRR-",
  "web-security": "OO---ROR-",
  // Java backend (matrix: core for Java FS and Java+MERN, optional core Java for MERN, none for Data Science)
  "java-core": "CCCO-O---",
  "java-oop": "CCCO-O---",
  "java-collections": "CCC------",
  "java-exceptions": "CCC------",
  "java-multithreading": "CCC------",
  "java-8-plus": "CCC------",
  "jvm-memory": "CCC------",
  "spring-framework": "CCC------",
  "spring-boot": "CCC------",
  "spring-mvc": "CCC------",
  "hibernate-jpa": "CCC------",
  jdbc: "RRC------",
  "spring-security": "RRR----O-",
  microservices: "RRR----O-",
  "backend-architecture": "CCCC-C-CR",
  authentication: "CCCC-COCR", // Frontend: optional, so a Frontend learner is not shown backend topics as part of their path
  // Node / MERN (matrix: core for Java+MERN and MERN, none elsewhere)
  nodejs: "-C---C-CO",
  express: "-C---C-CO",
  caching: "RROR-R-R-",
  payments: "OO---O-O-",
  // Databases (matrix: PostgreSQL core for Java FS, Java+MERN, Data Science, optional for MERN; MongoDB core for Java+MERN and MERN, optional elsewhere)
  sql: "CCCCCO-CC",
  postgresql: "CCRCCO-CR",
  "database-design": "RRRRRR-R-",
  mongodb: "OC-OOC-R-",
  // Python (matrix: core for Data Science, optional for Java FS, Java+MERN and MERN)
  "python-fundamentals": "OO-CCO-OC",
  "python-data-structures": "---CO---R",
  "python-oop": "---CO---R",
  "python-advanced": "---CO---R",
  "python-exceptions-files": "---CO---R",
  "python-async": "---R----R",
  fastapi: "---R----R",
  django: "---R-----",
  "python-concurrency": "---R-----",
  "python-internals": "---R-----",
  // Mobile (rule 7: optional unless a role needs it)
  "react-native": "-O---OOO-",
  expo: "-O---OOO-",
  "android-release": "-O---OOO-",
  // AI
  "ai-fundamentals": "OO-RRO-OC",
  "llm-apis": "OO-OOO-OC",
  "rag-agents": "OO-OOO-OC",
  "ai-production": "OO-OOO-OC",
  // Data science (matrix: ETL core for Data Science, optional elsewhere)
  "python-data-science": "---OC---R",
  "data-visualization": "----C---R",
  statistics: "----C---R",
  "machine-learning": "----C---R",
  "deep-learning-nlp": "----C---R",
  etl: "OOOOCOOOO",
}

const TIER_OF: Record<string, Tier | undefined> = {
  C: "core",
  R: "recommended",
  O: "optional",
}

/** Tier of a module for one role, or null when it is outside the role. */
export function roleTier(roleId: string, moduleId: string): Tier | null {
  const column = (ROLE_ORDER as readonly string[]).indexOf(roleId)
  const row = TABLE[moduleId]
  if (column < 0 || !row) return null
  return TIER_OF[row[column]] ?? null
}

/** Module ids that have a row in the relevance table (for tests). */
/**
 * Modules whose recommendation depends on the learner's experience: recommended for the listed levels,
 * optional for the others. Applied when the syllabus is resolved (services/curriculum/relevance.ts).
 */
export const EXPERIENCE_AWARE_TIERS: Readonly<
  Record<
    string,
    readonly ("beginner" | "fresher" | "intermediate" | "advanced")[]
  >
> = {
  "hr-fresher-specific": ["beginner", "fresher"],
  "hr-experienced-candidate": ["intermediate", "advanced"],
}

export const RELEVANCE_MODULE_IDS: string[] = Object.keys(TABLE)

/** Every row must be exactly one letter per role; checked by a test. */
export const RELEVANCE_ROWS: Readonly<Record<string, string>> = TABLE
