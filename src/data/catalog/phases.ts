/**
 * Roadmap phases: the ordered learning stages of each Study Path roadmap. A phase points at catalogue modules
 * (or a subset of one module's topics); lessons belong to modules, never to phases, so a module shared by two
 * roadmaps has one lesson set and one progress. These are starting structures: plain data, edit freely, the
 * partition test (data/catalog/phases.test.ts) keeps them complete and consistent.
 */

/** A module, or just some of its topics (exact titles), when two phases split one module. */
export type ModuleRef = string | { module: string; topics: readonly string[] }

export interface PhaseLink {
  label: string
  to: string
}

export interface PhaseDef {
  roadmapId: string
  /** 1-based, in learning order. */
  number: number
  title: string
  /** What you can do after the phase, in one sentence. */
  outcome: string
  /** May be empty: a project-led phase has no catalogue modules and is built around its project. */
  modules: readonly ModuleRef[]
  /** Other parts of the app that belong to this phase. */
  links: readonly PhaseLink[]
}

const LINUX: PhaseLink = {
  label: "Linux practice (commands, safe terminal)",
  to: "/linux",
}
const INTERVIEW: PhaseLink[] = [
  { label: "HR interview", to: "/hr" },
  { label: "Mock interview", to: "/mock" },
  { label: "Resume interview", to: "/resume" },
]

const phase = (
  roadmapId: string,
  number: number,
  title: string,
  outcome: string,
  modules: readonly ModuleRef[],
  links: readonly PhaseLink[] = []
): PhaseDef => ({
  roadmapId,
  number,
  title,
  outcome,
  modules,
  links,
})

const JAVA = "java-full-stack-ai"
const PYTHON = "python-full-stack-ai"
const MERN = "mern-full-stack-ai"

const FRONTEND_CORE = [
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
]

export const PHASES: readonly PhaseDef[] = [
  /* ------------------------------ Java Full Stack AI ------------------------------ */
  phase(
    JAVA,
    1,
    "Java fundamentals and advanced Java",
    "You can write, run and debug core Java programs, handle exceptions, use threads and the Java 8+ features, and explain how the JVM manages memory.",
    [
      "java-core",
      "java-exceptions",
      "git",
      "dev-tools",
      "java-multithreading",
      "java-8-plus",
      "jvm-memory",
      "computer-fundamentals",
      "operating-systems",
    ]
  ),
  phase(
    JAVA,
    2,
    "OOP, Collections, DSA and problem solving",
    "You can model a problem with classes, pick the right collection, and solve typical data-structure problems.",
    ["java-oop", "java-collections", "dsa", "debugging"]
  ),
  phase(
    JAVA,
    3,
    "SQL and PostgreSQL",
    "You can design tables, write joins and aggregates, and use PostgreSQL features.",
    ["sql", "postgresql", "database-design", "mongodb"]
  ),
  phase(
    JAVA,
    4,
    "JDBC, Hibernate and JPA",
    "You can talk to a database from Java and map tables to entities.",
    ["jdbc", "hibernate-jpa"]
  ),
  phase(
    JAVA,
    5,
    "Spring and Spring Boot",
    "You can build and configure a Spring Boot application with dependency injection and MVC.",
    ["spring-framework", "spring-boot", "spring-mvc"]
  ),
  phase(
    JAVA,
    6,
    "REST, authentication and security",
    "You can design a REST API and protect it with authentication and sound security practice.",
    ["http", "rest-apis", "authentication", "spring-security", "web-security"]
  ),
  phase(
    JAVA,
    7,
    "React and TypeScript",
    "You can build a typed React frontend with routing, state and forms.",
    FRONTEND_CORE
  ),
  phase(
    JAVA,
    8,
    "Full stack application development",
    "You can connect a React frontend to a Spring Boot backend and a database in one working application.",
    ["backend-architecture", "caching", "payments"]
  ),
  phase(
    JAVA,
    9,
    "Testing and software architecture",
    "You can test an application at several levels and explain how its parts fit together.",
    ["testing", "frontend-testing", "agile", "system-design", "microservices"]
  ),
  phase(
    JAVA,
    10,
    "Docker, Linux, AWS and CI/CD",
    "You can containerise an application, work on Linux and deploy it with an automated pipeline.",
    [
      "linux",
      "linux-commands",
      "ubuntu-admin",
      "networking",
      "docker",
      "nginx",
      "ci-cd",
      "aws",
      "deployment",
      "logging",
    ],
    [LINUX]
  ),
  phase(
    JAVA,
    11,
    "AI integration, LLM APIs, RAG and AI apps",
    "You can add language-model features to an application, including retrieval over your own data.",
    [
      "ai-fundamentals",
      "llm-apis",
      "rag-agents",
      "ai-production",
      "python-fundamentals",
      "etl",
    ]
  ),
  phase(
    JAVA,
    12,
    "Capstone and interview prep",
    "You can present one complete project and prepare for interviews.",
    [],
    INTERVIEW
  ),

  /* ----------------------------- Python Full Stack AI ----------------------------- */
  phase(
    PYTHON,
    1,
    "Python fundamentals",
    "You can write and run Python programs and use the tools around them.",
    [
      "python-fundamentals",
      "git",
      "dev-tools",
      "computer-fundamentals",
      "operating-systems",
    ]
  ),
  phase(
    PYTHON,
    2,
    "Advanced Python and OOP",
    "You can structure larger Python programs with classes, errors, files and async code.",
    [
      "python-data-structures",
      "python-oop",
      "python-advanced",
      "python-exceptions-files",
      "python-async",
      "debugging",
    ]
  ),
  phase(
    PYTHON,
    3,
    "Data structures and algorithms",
    "You can solve typical data-structure problems in Python.",
    ["dsa"]
  ),
  phase(
    PYTHON,
    4,
    "SQL and PostgreSQL",
    "You can design tables, write joins and aggregates, and use PostgreSQL features.",
    ["sql", "postgresql", "database-design", "mongodb"]
  ),
  phase(
    PYTHON,
    5,
    "Django and FastAPI",
    "You can build a web backend with Django or FastAPI.",
    ["django", "fastapi", "backend-architecture"]
  ),
  phase(
    PYTHON,
    6,
    "REST and authentication",
    "You can design a REST API and protect it with authentication.",
    ["http", "rest-apis", "authentication", "web-security", "caching"]
  ),
  phase(
    PYTHON,
    7,
    "React and TypeScript",
    "You can build a typed React frontend with routing, state and forms.",
    FRONTEND_CORE
  ),
  phase(
    PYTHON,
    8,
    "Full stack applications",
    "You can connect a React frontend to a Python backend and a database in one working application.",
    []
  ),
  phase(
    PYTHON,
    9,
    "Testing and architecture",
    "You can test an application at several levels and explain how its parts fit together.",
    ["testing", "frontend-testing", "system-design", "agile"]
  ),
  phase(
    PYTHON,
    10,
    "Docker, Linux, AWS and CI/CD",
    "You can containerise an application, work on Linux and deploy it with an automated pipeline.",
    [
      "linux",
      "linux-commands",
      "ubuntu-admin",
      "networking",
      "docker",
      "nginx",
      "ci-cd",
      "aws",
      "deployment",
      "logging",
    ],
    [LINUX]
  ),
  phase(
    PYTHON,
    11,
    "ML and AI fundamentals",
    "You can explain how machine learning and language models work and prepare data with Python.",
    ["ai-fundamentals", "etl"]
  ),
  phase(
    PYTHON,
    12,
    "LLMs, RAG, vector databases and agents",
    "You can build features on language-model APIs, retrieval and simple agents.",
    ["llm-apis", "rag-agents"]
  ),
  phase(
    PYTHON,
    13,
    "Production AI applications",
    "You can run an AI feature in production with cost, quality and safety in mind.",
    ["ai-production"]
  ),
  phase(
    PYTHON,
    14,
    "Capstone and interview prep",
    "You can present one complete project and prepare for interviews.",
    [],
    INTERVIEW
  ),

  /* ------------------------------ MERN Full Stack AI ------------------------------ */
  phase(
    MERN,
    1,
    "HTML, CSS and JavaScript",
    "You can build an interactive web page with HTML, CSS and everyday JavaScript.",
    [
      "html",
      "css",
      {
        module: "javascript",
        topics: [
          "Data types",
          "Functions",
          "Arrays",
          "Data structures",
          "ES6 syntax",
          "DOM & events",
          "Browser APIs",
          "Type coercion",
          "Error handling",
        ],
      },
      "git",
      "dev-tools",
      "computer-fundamentals",
      "operating-systems",
    ]
  ),
  phase(
    MERN,
    2,
    "Advanced JavaScript and TypeScript",
    "You can explain closures, the event loop and prototypes, and write typed code.",
    [
      {
        module: "javascript",
        topics: [
          "Scope & hoisting",
          "Closures",
          "this",
          "Objects & prototypes",
          "Asynchronous JavaScript",
          "Event loop",
          "Modules",
          "Memory & garbage collection",
          "Iterators & generators",
        ],
      },
      "typescript",
      "debugging",
    ]
  ),
  phase(
    MERN,
    3,
    "React ecosystem",
    "You can build a React frontend with routing, server state, forms and a component library.",
    [
      "react",
      "react-hooks",
      "react-router",
      "state-management",
      "tanstack-query",
      "forms-validation",
      "ui-libraries",
      "frontend-performance",
    ]
  ),
  phase(
    MERN,
    4,
    "Node and Express",
    "You can build a REST API with Node.js and Express.",
    ["nodejs", "express", "http", "rest-apis", "networking"]
  ),
  phase(
    MERN,
    5,
    "MongoDB and database architecture",
    "You can model data in MongoDB and use Mongoose.",
    ["mongodb", "database-design", "sql", "postgresql"]
  ),
  phase(
    MERN,
    6,
    "Authentication and security",
    "You can protect an application with authentication and sound security practice.",
    ["authentication", "web-security", "caching", "payments"]
  ),
  phase(
    MERN,
    7,
    "Full stack architecture",
    "You can structure a full stack application and explain its design.",
    ["backend-architecture", "system-design"]
  ),
  phase(
    MERN,
    8,
    "Data structures and algorithms",
    "You can solve typical data-structure problems.",
    ["dsa"]
  ),
  phase(
    MERN,
    9,
    "Testing and QA",
    "You can test frontend and backend code and work in an agile team.",
    ["testing", "frontend-testing", "agile"]
  ),
  phase(
    MERN,
    10,
    "Docker, Linux, Nginx and deployment",
    "You can containerise an application, work on Linux and deploy it.",
    [
      "linux",
      "linux-commands",
      "ubuntu-admin",
      "docker",
      "nginx",
      "ci-cd",
      "aws",
      "deployment",
      "logging",
    ],
    [LINUX]
  ),
  phase(
    MERN,
    11,
    "AI APIs and LLM integration",
    "You can add language-model features to an application.",
    ["ai-fundamentals", "llm-apis"]
  ),
  phase(
    MERN,
    12,
    "RAG, vector search and agents",
    "You can build retrieval over your own data and simple agents.",
    ["rag-agents"]
  ),
  phase(
    MERN,
    13,
    "Production AI applications",
    "You can run an AI feature in production with cost, quality and safety in mind.",
    ["ai-production"]
  ),
  phase(
    MERN,
    14,
    "Capstone and interview prep",
    "You can present one complete project and prepare for interviews.",
    [],
    INTERVIEW
  ),
]

export const phasesOf = (roadmapId: string): PhaseDef[] =>
  PHASES.filter((p) => p.roadmapId === roadmapId).sort(
    (a, b) => a.number - b.number
  )

export const getPhase = (
  roadmapId: string,
  number: number
): PhaseDef | undefined =>
  PHASES.find((p) => p.roadmapId === roadmapId && p.number === number)

/** The module id of a reference. */
export const refModule = (r: ModuleRef): string =>
  typeof r === "string" ? r : r.module
