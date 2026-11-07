import { MODULE_BY_ID } from "@/data/catalog/modules"

/**
 * Picker groups for technologies. They are a view for the learner and are
 * independent of module domains.
 */
export const SKILL_GROUPS = [
  "frontend",
  "backend",
  "databases",
  "mobile",
  "devops",
  "ai",
  "data-science",
  "tools",
  "foundation",
] as const
export type SkillGroup = (typeof SKILL_GROUPS)[number]

export const SKILL_GROUP_LABEL: Record<SkillGroup, string> = {
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  mobile: "Mobile",
  devops: "DevOps & Cloud",
  ai: "AI",
  "data-science": "Data Science",
  tools: "Tools & practices",
  foundation: "Foundation",
}

/** A technology the learner can say they know. It points at one module and one topic in it. */
export interface Skill {
  id: string
  title: string
  group: SkillGroup
  /** Sub-label inside a row that mixes several stacks (the Backend row: Java, Node.js, Python). */
  subgroup?: BackendStack
  moduleId: string
  /** Title of a topic in that module. */
  topic: string
  /** Other names people use, for search and for migrating older saved entries. */
  aliases: string[]
  /** Shown first in its category in the picker; the rest sit behind "Show more". */
  featured: boolean
}

/** Backend technologies are listed in one row, grouped by stack when the row is expanded. */
export type BackendStack = "Java" | "Node.js" | "Python"
type RowGroup = SkillGroup | "java" | "mern" | "python"

type Row = readonly [
  id: string,
  title: string,
  group: RowGroup,
  moduleId: string,
  topic: string,
  aliases?: string[],
]

const f: SkillGroup = "foundation"
const fe: SkillGroup = "frontend"
const j: RowGroup = "java"
const m: RowGroup = "mern"
const db: SkillGroup = "databases"
const py: RowGroup = "python"
const mo: SkillGroup = "mobile"
const dv: SkillGroup = "devops"
const ai: SkillGroup = "ai"
const ds: SkillGroup = "data-science"
const t: SkillGroup = "tools"

const ROWS: readonly Row[] = [
  // Foundation
  [
    "computer-fundamentals",
    "Computer Fundamentals",
    f,
    "computer-fundamentals",
    "CPU & instruction cycle",
  ],
  [
    "operating-systems",
    "Operating Systems",
    f,
    "operating-systems",
    "Processes & threads",
  ],
  ["linux", "Linux", f, "linux", "Filesystem"],
  [
    "linux-ubuntu",
    "Linux Ubuntu",
    f,
    "ubuntu-admin",
    "Installation",
    ["Ubuntu", "Ubuntu 24.04"],
  ],
  [
    "linux-commands",
    "Linux Command Line",
    f,
    "linux-commands",
    "Files",
    ["Shell", "Bash"],
  ],
  [
    "networking",
    "Computer Networking",
    f,
    "networking",
    "TCP/IP",
    ["Networking"],
  ],
  [
    "internet-fundamentals",
    "Internet Fundamentals",
    f,
    "networking",
    "Internet fundamentals",
  ],
  ["dns", "DNS", f, "networking", "DNS"],
  ["ports", "Ports", f, "networking", "Ports & sockets", ["DNS and Ports"]],
  ["http", "HTTP", f, "http", "Methods"],
  ["https", "HTTPS", f, "http", "HTTPS & TLS", ["TLS"]],
  [
    "software-testing",
    "Software Testing",
    f,
    "testing",
    "Unit tests",
    ["Testing"],
  ],
  [
    "debugging",
    "Debugging and Bug Fixing",
    f,
    "debugging",
    "Root-cause analysis",
    ["Debugging"],
  ],
  [
    "production-troubleshooting",
    "Production Troubleshooting",
    f,
    "debugging",
    "Production troubleshooting",
  ],
  [
    "dsa",
    "Data Structures & Algorithms",
    f,
    "dsa",
    "Arrays & strings",
    ["DSA"],
  ],
  ["system-design", "System Design", f, "system-design", "Scalability"],
  // Tools & practices
  ["git", "Git", t, "git", "Basics"],
  ["github", "GitHub", t, "git", "GitHub pull requests"],
  ["bitbucket", "Bitbucket", t, "git", "Bitbucket pull requests"],
  ["jira", "Jira", t, "agile", "Tasks & backlog (Jira)"],
  ["agile", "Agile", t, "agile", "Sprints", ["Scrum"]],
  [
    "requirement-gathering",
    "Requirement Gathering",
    t,
    "agile",
    "Requirement gathering",
  ],
  ["figma", "Figma", t, "dev-tools", "Figma basics"],
  ["vscode", "VS Code", t, "dev-tools", "VS Code", ["Visual Studio Code"]],
  ["ui-prototyping", "UI Prototyping", t, "dev-tools", "UI prototyping"],
  ["postman", "Postman", t, "testing", "API testing with Postman"],
  ["api-integration", "API Integration", t, "rest-apis", "API integration"],
  [
    "rest-apis",
    "REST APIs",
    t,
    "rest-apis",
    "HTTP methods",
    ["REST", "REST API"],
  ],
  ["api-fundamentals", "API Fundamentals", t, "rest-apis", "CRUD design"],
  [
    "swagger-openapi",
    "Swagger / OpenAPI",
    t,
    "rest-apis",
    "API documentation (Swagger/OpenAPI)",
    ["Swagger", "Swagger UI", "OpenAPI"],
  ],
  [
    "regression-testing",
    "Regression Testing",
    t,
    "testing",
    "Regression testing",
  ],
  // Frontend
  ["html5", "HTML5", fe, "html", "Semantics", ["HTML"]],
  ["css3", "CSS3", fe, "css", "Box model", ["CSS"]],
  [
    "responsive-design",
    "Responsive Design",
    fe,
    "css",
    "Responsive design",
    ["Responsive Web Design"],
  ],
  ["accessibility", "Accessibility", fe, "html", "Accessibility"],
  [
    "javascript",
    "JavaScript ES6+",
    fe,
    "javascript",
    "ES6 syntax",
    ["JavaScript", "JS"],
  ],
  [
    "advanced-javascript",
    "Advanced JavaScript",
    fe,
    "javascript",
    "Event loop",
  ],
  ["typescript", "TypeScript", fe, "typescript", "Basic types", ["TS"]],
  ["react", "React.js", fe, "react", "Components", ["React", "ReactJS"]],
  ["react-hooks", "React Hooks", fe, "react-hooks", "useState"],
  ["react-router", "React Router", fe, "react-router", "Routes"],
  [
    "component-architecture",
    "Component Architecture",
    fe,
    "react",
    "Component architecture",
  ],
  [
    "spa",
    "Single Page Applications",
    fe,
    "react",
    "Single-page applications",
    ["SPA"],
  ],
  [
    "redux-toolkit",
    "Redux Toolkit",
    fe,
    "state-management",
    "Redux Toolkit",
    ["Redux"],
  ],
  ["zustand", "Zustand", fe, "state-management", "Zustand"],
  [
    "tanstack-query",
    "TanStack Query",
    fe,
    "tanstack-query",
    "Queries",
    ["React Query"],
  ],
  [
    "tailwind-css",
    "Tailwind CSS",
    fe,
    "ui-libraries",
    "Tailwind CSS",
    ["Tailwind"],
  ],
  ["shadcn-ui", "shadcn/ui", fe, "ui-libraries", "shadcn/ui", ["shadcn"]],
  ["recharts", "Recharts", fe, "ui-libraries", "Recharts"],
  [
    "react-hook-form",
    "React Hook Form",
    fe,
    "forms-validation",
    "React Hook Form",
  ],
  ["zod", "Zod", fe, "forms-validation", "Zod schemas"],
  ["jest", "Jest", fe, "frontend-testing", "Jest"],
  ["vitest", "Vitest", fe, "frontend-testing", "Vitest"],
  [
    "react-testing-library",
    "React Testing Library",
    fe,
    "frontend-testing",
    "React Testing Library",
    ["RTL"],
  ],
  ["msw", "MSW", fe, "frontend-testing", "MSW", ["Mock Service Worker"]],
  [
    "chrome-devtools",
    "Chrome DevTools",
    fe,
    "frontend-performance",
    "Chrome DevTools",
  ],
  [
    "react-profiler",
    "React Profiler",
    fe,
    "frontend-performance",
    "React Profiler",
  ],
  ["lighthouse", "Lighthouse", fe, "frontend-performance", "Lighthouse"],
  [
    "frontend-performance",
    "Frontend Performance Optimization",
    fe,
    "frontend-performance",
    "Core Web Vitals",
    ["Performance"],
  ],
  // Java
  ["java", "Java", j, "java-core", "Basics", ["Core Java"]],
  ["advanced-java", "Advanced Java", j, "java-core", "Advanced Java"],
  [
    "oop",
    "Object-Oriented Programming",
    j,
    "java-oop",
    "Classes & objects",
    ["OOP"],
  ],
  [
    "java-collections",
    "Collections Framework",
    j,
    "java-collections",
    "List",
    ["Collections"],
  ],
  ["java-generics", "Generics", j, "java-collections", "Generics"],
  [
    "exception-handling",
    "Exception Handling",
    j,
    "java-exceptions",
    "Hierarchy",
  ],
  ["java-8", "Java 8+", j, "java-8-plus", "Lambdas"],
  ["streams-lambdas", "Streams and Lambdas", j, "java-8-plus", "Streams"],
  [
    "multithreading",
    "Multithreading",
    j,
    "java-multithreading",
    "Thread lifecycle",
  ],
  [
    "concurrency",
    "Concurrency",
    j,
    "java-multithreading",
    "Concurrent utilities",
  ],
  [
    "jvm",
    "JVM and Memory Management",
    j,
    "jvm-memory",
    "Heap vs stack",
    ["JVM"],
  ],
  ["jdbc", "JDBC", j, "jdbc", "Connections"],
  [
    "spring-framework",
    "Spring Framework",
    j,
    "spring-framework",
    "IoC & DI",
    ["Spring"],
  ],
  ["spring-boot", "Spring Boot", j, "spring-boot", "Auto-configuration"],
  ["spring-mvc", "Spring MVC", j, "spring-mvc", "Controllers"],
  [
    "spring-security",
    "Spring Security",
    j,
    "spring-security",
    "Authentication",
  ],
  [
    "hibernate",
    "Hibernate",
    j,
    "hibernate-jpa",
    "Entities",
    ["Hibernate/JPA", "Hibernate & JPA"],
  ],
  ["jpa", "JPA", j, "hibernate-jpa", "JPA queries"],
  [
    "layered-architecture",
    "Layered Architecture",
    j,
    "backend-architecture",
    "Layered architecture",
  ],
  [
    "controller-service-repository",
    "Controller-Service-Repository Architecture",
    j,
    "backend-architecture",
    "Controller-Service-Repository",
    ["Controller Service Repository", "Controller-Service-Repository"],
  ],
  ["microservices", "Microservices", j, "microservices", "Boundaries"],
  ["log4j", "Log4j", j, "logging", "Log4j"],
  [
    "application-logging",
    "Application Logging",
    dv,
    "logging",
    "Log levels & structure",
    ["Logging"],
  ],
  // MERN / Node
  ["nodejs", "Node.js", m, "nodejs", "Modules", ["Node", "NodeJS"]],
  [
    "nodejs-internals",
    "Node.js Internals",
    m,
    "nodejs",
    "Node internals (V8 and libuv)",
  ],
  ["event-loop", "Event Loop", m, "nodejs", "Event loop"],
  ["express", "Express.js", m, "express", "Routing", ["Express"]],
  ["middleware", "Middleware", m, "express", "Middleware"],
  ["error-handling", "Error Handling", m, "express", "Error handling"],
  [
    "authentication",
    "Authentication",
    m,
    "authentication",
    "Sessions vs tokens",
    ["Auth", "Authentication & Authorization"],
  ],
  ["jwt", "JWT", m, "authentication", "JWT"],
  [
    "otp-authentication",
    "OTP Authentication",
    m,
    "authentication",
    "OTP",
    ["OTP"],
  ],
  ["rbac", "RBAC", m, "authentication", "RBAC"],
  ["api-security", "API Security", m, "web-security", "Input validation"],
  ["rate-limiting", "Rate Limiting", m, "web-security", "Rate limiting"],
  ["caching", "Caching", m, "caching", "In-memory caching"],
  [
    "backend-architecture",
    "Backend Architecture",
    m,
    "backend-architecture",
    "Service separation",
  ],
  [
    "razorpay",
    "Razorpay",
    m,
    "payments",
    "Razorpay integration",
    ["Payment Gateway Integration"],
  ],
  // Databases
  ["sql", "SQL", db, "sql", "SELECT & filtering", ["SQL Fundamentals"]],
  ["joins", "Joins", db, "sql", "Joins"],
  ["indexes", "Indexes", db, "sql", "Indexes", ["Database Indexing"]],
  ["transactions", "Transactions", db, "sql", "Transactions"],
  ["normalization", "Database Normalization", db, "sql", "Normalization"],
  ["query-optimization", "Query Optimization", db, "sql", "Query optimization"],
  ["postgresql", "PostgreSQL", db, "postgresql", "Query planner", ["Postgres"]],
  ["mongodb", "MongoDB", db, "mongodb", "Document modelling"],
  ["mongoose", "Mongoose", db, "mongodb", "Mongoose"],
  [
    "aggregation-pipeline",
    "Aggregation Pipeline",
    db,
    "mongodb",
    "Aggregation",
  ],
  [
    "document-modelling",
    "Document Modelling",
    db,
    "database-design",
    "Document modelling decisions",
  ],
  ["sql-vs-nosql", "SQL vs NoSQL", db, "database-design", "SQL vs NoSQL"],
  // Mobile
  ["react-native", "React Native", mo, "react-native", "Components & styling"],
  ["expo", "Expo", mo, "expo", "Expo SDK & workflow"],
  [
    "react-navigation",
    "React Navigation",
    mo,
    "react-native",
    "React Navigation",
  ],
  ["eas-build", "EAS Build", mo, "expo", "EAS Build"],
  ["android", "Android", mo, "android-release", "Android fundamentals"],
  [
    "google-play-console",
    "Google Play Console",
    mo,
    "android-release",
    "Google Play Console",
  ],
  [
    "mobile-authentication",
    "Mobile Authentication",
    mo,
    "react-native",
    "Mobile authentication",
  ],
  [
    "mobile-api-integration",
    "Mobile API Integration",
    mo,
    "react-native",
    "Mobile API integration",
  ],
  // DevOps & cloud
  ["docker", "Docker", dv, "docker", "Images"],
  ["docker-compose", "Docker Compose", dv, "docker", "Compose"],
  ["nginx", "Nginx", dv, "nginx", "Reverse proxy"],
  ["pm2", "PM2", dv, "deployment", "PM2 process management"],
  [
    "lets-encrypt",
    "Let's Encrypt",
    dv,
    "nginx",
    "HTTPS & Let's Encrypt",
    ["Lets Encrypt"],
  ],
  ["vps-deployment", "VPS Deployment", dv, "deployment", "VPS deployment"],
  [
    "environment-variables",
    "Environment Variables",
    dv,
    "deployment",
    "Environment variables & config",
  ],
  [
    "production-deployment",
    "Production Deployment",
    dv,
    "deployment",
    "Production deployment checklist",
  ],
  ["ci-cd", "CI/CD", dv, "ci-cd", "Pipelines", ["CI/CD Fundamentals"]],
  ["jenkins", "Jenkins", dv, "ci-cd", "Jenkins"],
  ["github-actions", "GitHub Actions", dv, "ci-cd", "GitHub Actions"],
  [
    "bitbucket-pipelines",
    "Bitbucket Pipelines",
    dv,
    "ci-cd",
    "Bitbucket Pipelines",
  ],
  ["aws", "AWS", dv, "aws", "Cloud concepts & regions", ["AWS Fundamentals"]],
  ["aws-s3", "AWS S3", dv, "aws", "S3 buckets & storage classes", ["S3"]],
  ["aws-ec2", "AWS EC2", dv, "aws", "EC2 instances", ["EC2"]],
  // AI
  ["python", "Python", py, "python-fundamentals", "Types"],
  ["python-oop", "Python OOP", py, "python-oop", "Classes"],
  [
    "python-async",
    "Python asyncio",
    py,
    "python-async",
    "async/await",
    ["asyncio", "Async"],
  ],
  ["django", "Django", py, "django", "ORM"],
  ["fastapi", "FastAPI", py, "fastapi", "Pydantic"],
  [
    "ai-fundamentals",
    "AI Fundamentals",
    ai,
    "ai-fundamentals",
    "AI vs ML vs deep learning",
  ],
  [
    "ml-basics",
    "Machine Learning Basics",
    ai,
    "ai-fundamentals",
    "Machine learning basics",
  ],
  [
    "openai-api",
    "OpenAI API",
    ai,
    "llm-apis",
    "OpenAI API usage",
    ["LLM APIs"],
  ],
  ["prompt-engineering", "Prompt Engineering", ai, "llm-apis", "Prompting"],
  [
    "structured-outputs",
    "Structured Outputs",
    ai,
    "llm-apis",
    "Structured output",
  ],
  ["tool-calling", "Tool Calling", ai, "llm-apis", "Tool calling"],
  ["embeddings", "Embeddings", ai, "rag-agents", "Embeddings"],
  [
    "vector-databases",
    "Vector Databases",
    ai,
    "rag-agents",
    "Vector databases",
    ["Vector search"],
  ],
  [
    "rag",
    "Retrieval-Augmented Generation",
    ai,
    "rag-agents",
    "RAG pipelines",
    ["RAG"],
  ],
  ["langchain", "LangChain", ai, "rag-agents", "LangChain"],
  ["ai-agents", "AI Agents", ai, "rag-agents", "Agents"],
  [
    "ai-evaluation",
    "AI Application Evaluation",
    ai,
    "ai-production",
    "AI application evaluation",
  ],
  [
    "production-ai",
    "Production AI Integration",
    ai,
    "ai-production",
    "Production AI integration",
  ],
  // Data science
  [
    "python-data-science",
    "Python for Data Science",
    ds,
    "python-data-science",
    "Pandas",
  ],
  ["numpy", "NumPy", ds, "python-data-science", "NumPy"],
  ["pandas", "Pandas", ds, "python-data-science", "Pandas"],
  [
    "data-cleaning",
    "Data Cleaning",
    ds,
    "python-data-science",
    "Data cleaning",
  ],
  [
    "data-visualization",
    "Data Visualization",
    ds,
    "data-visualization",
    "Matplotlib",
  ],
  ["statistics", "Statistics", ds, "statistics", "Descriptive stats"],
  ["probability", "Probability", ds, "statistics", "Probability"],
  ["etl", "ETL", ds, "etl", "Transform & clean", ["ETL Fundamentals"]],
  [
    "machine-learning",
    "Machine Learning",
    ds,
    "machine-learning",
    "scikit-learn workflow",
  ],
  [
    "supervised-learning",
    "Supervised Learning",
    ds,
    "machine-learning",
    "Classification",
  ],
  [
    "unsupervised-learning",
    "Unsupervised Learning",
    ds,
    "machine-learning",
    "Clustering",
  ],
  [
    "feature-engineering",
    "Feature Engineering",
    ds,
    "machine-learning",
    "Feature engineering",
  ],
  [
    "model-evaluation",
    "Model Evaluation",
    ds,
    "machine-learning",
    "Model evaluation",
  ],
  [
    "deep-learning",
    "Deep Learning",
    ds,
    "deep-learning-nlp",
    "Neural networks",
  ],
  ["nlp", "NLP", ds, "deep-learning-nlp", "NLP tasks"],
]

/** Curated by hand: 3 to 8 technologies per category that most learners recognise first. */
const FEATURED = new Set([
  "javascript",
  "typescript",
  "react",
  "html5",
  "css3",
  "tailwind-css",
  "redux-toolkit",
  "java",
  "spring-boot",
  "hibernate",
  "nodejs",
  "express",
  "python",
  "django",
  "fastapi",
  "sql",
  "postgresql",
  "mongodb",
  "mongoose",
  "joins",
  "react-native",
  "expo",
  "android",
  "docker",
  "nginx",
  "ci-cd",
  "aws",
  "github-actions",
  "jenkins",
  "openai-api",
  "prompt-engineering",
  "rag",
  "langchain",
  "ai-agents",
  "pandas",
  "numpy",
  "machine-learning",
  "statistics",
  "data-visualization",
  "git",
  "github",
  "jira",
  "postman",
  "rest-apis",
  "vscode",
  "linux",
  "networking",
  "http",
  "dsa",
  "system-design",
])

const STACK: Partial<Record<RowGroup, BackendStack>> = {
  java: "Java",
  mern: "Node.js",
  python: "Python",
}

export const SKILLS: readonly Skill[] = ROWS.map(
  ([id, title, rowGroup, moduleId, topic, aliases]) => ({
    id,
    title,
    group: (STACK[rowGroup] ? "backend" : rowGroup) as SkillGroup,
    ...(STACK[rowGroup] ? { subgroup: STACK[rowGroup] } : {}),
    moduleId,
    topic,
    aliases: aliases ?? [],
    featured: FEATURED.has(id),
  })
)

export const SKILL_BY_ID: ReadonlyMap<string, Skill> = new Map(
  SKILLS.map((s) => [s.id, s])
)

export const getSkill = (id: string): Skill | undefined => SKILL_BY_ID.get(id)

/** Skills a module's topics are traced from, derived (never authored on the module). */
export function skillsForModule(moduleId: string): Skill[] {
  return SKILLS.filter((s) => s.moduleId === moduleId)
}

/** Whether a skill's module and topic both exist in the catalogue. */
export function skillResolves(skill: Skill): boolean {
  return !!MODULE_BY_ID.get(skill.moduleId)?.topicList.some(
    (t) => t.title === skill.topic
  )
}
