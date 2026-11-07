import { ROLE_ORDER, type RoleId } from "@/data/curriculum/role-relevance"

/**
 * Career paths: display metadata only. What a role studies comes from the
 * relevance table in data/curriculum/role-relevance.ts (one source), so a role
 * never owns a module list or a hand-written skill list.
 */
export interface RoleDef {
  id: RoleId
  title: string
  description: string
  /** Lucide icon name, resolved by the UI layer. */
  icon: string
  estimatedWeeks: number
  level: "Beginner" | "Intermediate" | "Advanced"
}

const META: Record<RoleId, Omit<RoleDef, "id">> = {
  "java-full-stack": {
    title: "Java Full Stack Developer",
    description:
      "Spring Boot backends with React frontends, SQL databases and production deployment.",
    icon: "Coffee",
    estimatedWeeks: 16,
    level: "Intermediate",
  },
  "java-mern-full-stack": {
    title: "Java + MERN Full Stack Developer",
    description:
      "Be hireable on both stacks: Spring Boot services and the MERN ecosystem.",
    icon: "Layers",
    estimatedWeeks: 24,
    level: "Advanced",
  },
  "java-developer": {
    title: "Java Developer",
    description:
      "Core Java depth, concurrency, Spring and data access for backend roles.",
    icon: "Coffee",
    estimatedWeeks: 12,
    level: "Intermediate",
  },
  "python-developer": {
    title: "Python Developer",
    description:
      "Python depth, web frameworks, databases and deployment for backend roles.",
    icon: "Terminal",
    estimatedWeeks: 12,
    level: "Intermediate",
  },
  "data-science": {
    title: "Data Science",
    description:
      "Python for data, statistics, machine learning, deep learning and business case studies.",
    icon: "ChartLine",
    estimatedWeeks: 20,
    level: "Advanced",
  },
  "mern-stack": {
    title: "MERN Stack Developer",
    description:
      "MongoDB, Express, React and Node.js, plus the web fundamentals interviews expect.",
    icon: "Atom",
    estimatedWeeks: 14,
    level: "Intermediate",
  },
  "frontend-developer": {
    title: "Frontend Developer",
    description:
      "Modern web UI engineering: JavaScript, React, TypeScript, performance and accessibility.",
    icon: "Monitor",
    estimatedWeeks: 10,
    level: "Beginner",
  },
  "full-stack": {
    title: "Full Stack Developer",
    description:
      "End-to-end product engineering across frontend, APIs, databases and deployment.",
    icon: "Blocks",
    estimatedWeeks: 16,
    level: "Intermediate",
  },
  "ai-engineer": {
    title: "AI Engineer",
    description:
      "Build production AI applications: LLM APIs, RAG, agents, evaluation and deployment.",
    icon: "Sparkles",
    estimatedWeeks: 16,
    level: "Advanced",
  },
}

export const ROLES: RoleDef[] = ROLE_ORDER.map((id) => ({ id, ...META[id] }))

export const ROLE_BY_ID: ReadonlyMap<string, RoleDef> = new Map(
  ROLES.map((r) => [r.id, r])
)

export function getRole(id: string): RoleDef | undefined {
  return ROLE_BY_ID.get(id)
}
