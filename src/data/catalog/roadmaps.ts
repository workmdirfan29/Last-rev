import type { RoleId, Tier } from "@/data/curriculum/role-relevance"
import type { DomainId } from "./module-types"

/**
 * Study Path roadmaps. Like roles, a roadmap has no module list of its own: its
 * relevance is a base role's column with a few overrides (same shape and the
 * same rule tests as roles), and `domainOrder` sets the learning order.
 * Interview-only modules are never part of a roadmap.
 */
export interface RoadmapDef {
  id: string
  title: string
  description: string
  /** Lucide icon name, resolved by the UI layer. */
  icon: string
  baseRole: RoleId
  /** Changes to the base role's relevance; `null` removes a module from the roadmap. */
  overrides: Record<string, Tier | null>
  domainOrder: DomainId[]
}

const AI_CORE: Record<string, Tier | null> = {
  "llm-apis": "core",
  "rag-agents": "core",
  "ai-fundamentals": "recommended",
  "ai-production": "recommended",
}

export const ROADMAPS: RoadmapDef[] = [
  {
    id: "java-full-stack-ai",
    title: "Java Full Stack AI Engineer",
    description:
      "Java and Spring Boot services, SQL, a React frontend, deployment, then LLM and RAG features on top.",
    icon: "Coffee",
    baseRole: "java-full-stack",
    overrides: { ...AI_CORE },
    domainOrder: [
      "foundation",
      "java-backend",
      "database",
      "frontend",
      "devops",
      "mern-backend",
      "python",
      "mobile",
      "ai",
      "data-science",
    ],
  },
  {
    id: "python-full-stack-ai",
    title: "Python Full Stack AI Engineer",
    description:
      "Python in depth, Django and FastAPI backends, SQL, a React frontend, then LLM and RAG features.",
    icon: "Terminal",
    baseRole: "full-stack",
    overrides: {
      ...AI_CORE,
      // The learner's "Python FS" matrix column: Python core, Node and Spring out, Java and Mongo optional.
      nodejs: null,
      express: null,
      "spring-security": null,
      microservices: null,
      payments: null,
      mongodb: "optional",
      "java-core": "optional",
      "java-oop": "optional",
      "python-fundamentals": "core",
      "python-data-structures": "core",
      "python-oop": "core",
      "python-advanced": "recommended",
      "python-exceptions-files": "recommended",
      "python-async": "recommended",
      fastapi: "core",
      django: "recommended",
    },
    domainOrder: [
      "foundation",
      "python",
      "database",
      "frontend",
      "devops",
      "ai",
      "mern-backend",
      "java-backend",
      "mobile",
      "data-science",
    ],
  },
  {
    id: "mern-full-stack-ai",
    title: "MERN Full Stack AI Engineer",
    description:
      "MongoDB, Express, React and Node.js end to end, then LLM and RAG features on top.",
    icon: "Atom",
    baseRole: "mern-stack",
    overrides: { ...AI_CORE },
    domainOrder: [
      "foundation",
      "frontend",
      "mern-backend",
      "database",
      "devops",
      "ai",
      "python",
      "java-backend",
      "mobile",
      "data-science",
    ],
  },
]

export const ROADMAP_BY_ID: ReadonlyMap<string, RoadmapDef> = new Map(
  ROADMAPS.map((r) => [r.id, r])
)

export function getRoadmap(
  id: string | null | undefined
): RoadmapDef | undefined {
  return id ? ROADMAP_BY_ID.get(id) : undefined
}
