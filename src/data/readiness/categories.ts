/**
 * The job-readiness categories and which catalogue modules belong to each. ONE data file: the readiness page, the
 * dashboard card and the research areas read it, and no number in any screen is written by hand. A module may be
 * in several categories (many-to-many); the test in `categories.test.ts` requires every catalogue module to be in
 * at least one category or in `UNMAPPED` with a reason.
 *
 * "Technical interview preparation" counts only its own modules (project and resume questions) plus mock
 * interview results; the technical question modules count once, in their own area categories.
 */
export interface ReadinessCategory {
  id: string
  label: string
  description: string
  /** Catalogue module ids (questions, lessons, quizzes, assignments are counted through these). */
  modules: readonly string[]
  /** Other real data this category reads, by name: the screens know how to count each. */
  also?: readonly ("mock-interviews" | "hr-answers" | "spoken-english")[]
}

const HR_MODULES = [
  "hr-tell-me-about-yourself",
  "hr-why-hire-you",
  "hr-strengths-weaknesses",
  "hr-career-goals",
  "hr-why-this-company",
  "hr-changing-jobs",
  "hr-salary-expectations",
  "hr-handling-pressure",
  "hr-teamwork",
  "hr-conflict-resolution",
  "hr-failure-challenges",
  "hr-leadership",
  "hr-communication",
  "hr-work-ethics",
  "hr-joining-availability",
  "hr-employment-gaps",
  "hr-fresher-specific",
  "hr-experienced-candidate",
  "hr-tricky-questions",
  "hr-behavioural",
]

export const READINESS_CATEGORIES: readonly ReadinessCategory[] = [
  {
    id: "programming-fundamentals",
    label: "Programming fundamentals",
    description:
      "Language basics, object-oriented design, collections, concurrency and how programs run.",
    modules: [
      "computer-fundamentals",
      "operating-systems",
      "debugging",
      "dev-tools",
      "agile",
      "java-core",
      "java-oop",
      "java-collections",
      "java-exceptions",
      "java-multithreading",
      "java-8-plus",
      "jvm-memory",
      "python-fundamentals",
      "python-data-structures",
      "python-oop",
      "python-advanced",
      "python-exceptions-files",
      "python-concurrency",
      "python-async",
      "python-internals",
    ],
  },
  {
    id: "dsa",
    label: "Data structures and algorithms",
    description: "Problem solving with data structures and algorithms.",
    modules: ["dsa"],
  },
  {
    id: "frontend",
    label: "Frontend",
    description:
      "HTML, CSS, JavaScript, TypeScript, React and the tools around them.",
    modules: [
      "html",
      "css",
      "javascript",
      "typescript",
      "react",
      "react-hooks",
      "react-router",
      "state-management",
      "tanstack-query",
      "forms-validation",
      "ui-libraries",
      "frontend-performance",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "Server-side frameworks, architecture and services.",
    modules: [
      "spring-framework",
      "spring-boot",
      "spring-mvc",
      "microservices",
      "backend-architecture",
      "nodejs",
      "express",
      "caching",
      "payments",
      "django",
      "fastapi",
    ],
  },
  {
    id: "database",
    label: "Databases",
    description: "SQL, PostgreSQL, MongoDB, data access and database design.",
    modules: [
      "jdbc",
      "hibernate-jpa",
      "sql",
      "postgresql",
      "mongodb",
      "database-design",
    ],
  },
  {
    id: "apis",
    label: "APIs",
    description: "HTTP and REST API design.",
    modules: ["http", "rest-apis"],
  },
  {
    id: "authentication",
    label: "Authentication and security",
    description: "Authentication, authorisation and web security.",
    modules: ["authentication", "spring-security", "web-security"],
  },
  {
    id: "system-design",
    label: "System design",
    description: "How the parts of a system fit together and scale.",
    modules: ["system-design", "backend-architecture", "microservices"],
  },
  {
    id: "testing",
    label: "Testing",
    description: "Testing backend and frontend code.",
    modules: ["testing", "frontend-testing"],
  },
  {
    id: "deployment",
    label: "Deployment",
    description: "Containers, servers, pipelines, cloud and logging.",
    modules: [
      "docker",
      "nginx",
      "ci-cd",
      "aws",
      "deployment",
      "logging",
      "networking",
      "android-release",
    ],
  },
  {
    id: "linux",
    label: "Linux",
    description: "The Linux command line and administration.",
    modules: ["linux", "linux-commands", "ubuntu-admin"],
  },
  {
    id: "git",
    label: "Git",
    description: "Version control with Git.",
    modules: ["git"],
  },
  {
    id: "ai-integration",
    label: "AI integration",
    description: "Adding language-model features to an application.",
    modules: ["ai-fundamentals", "llm-apis", "rag-agents", "ai-production"],
  },
  {
    id: "technical-interview",
    label: "Technical interview preparation",
    description:
      "Project and resume questions, and your mock interview results across the technical modules.",
    modules: [
      "project-questions",
      "resume-intro",
      "resume-skills",
      "resume-company",
      "resume-project",
      "resume-responsibility",
      "resume-followup",
      "resume-achievement",
      "resume-difficult",
      "resume-architecture",
      "resume-scenario",
    ],
    also: ["mock-interviews"],
  },
  {
    id: "hr-preparation",
    label: "HR preparation",
    description: "HR and behavioural questions and your saved answers.",
    modules: HR_MODULES,
    also: ["hr-answers"],
  },
  {
    id: "spoken-english",
    label: "Spoken English",
    description: "The Spoken English course.",
    modules: [],
    also: ["spoken-english"],
  },
  {
    id: "data-science",
    label: "Data science",
    description: "Python for data, statistics, machine learning and ETL.",
    modules: [
      "python-data-science",
      "data-visualization",
      "statistics",
      "machine-learning",
      "deep-learning-nlp",
      "etl",
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "React Native and Expo.",
    modules: ["react-native", "expo"],
  },
]

/** Catalogue modules deliberately in no category, with the reason (none today). */
export const UNMAPPED: Readonly<Record<string, string>> = {}

export const CATEGORY_BY_ID: ReadonlyMap<string, ReadinessCategory> = new Map(
  READINESS_CATEGORIES.map((c) => [c.id, c])
)
export const getCategory = (id: string) => CATEGORY_BY_ID.get(id)

/** Every category a module belongs to. */
export const categoriesOfModule = (moduleId: string): ReadinessCategory[] =>
  READINESS_CATEGORIES.filter((c) => c.modules.includes(moduleId))
