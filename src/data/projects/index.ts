import type { Project } from "../../types/project"

/**
 * Every project, loaded eagerly: there are few of them and the roadmap, plan and progress views all need their
 * counts. One file per project in this folder; the file name is the project id (the gate checks it).
 */
const files = import.meta.glob<{ default: Project }>(
  ["./*.ts", "!./author.ts", "!./index.ts", "!./*.test.ts"],
  { eager: true }
)

export const PROJECT_FILES: ReadonlyMap<string, Project> = new Map(
  Object.entries(files).map(([path, m]) => [
    path.replace(/^\.\//, "").replace(/\.ts$/, ""),
    m.default,
  ])
)

export const PROJECTS: readonly Project[] = [...PROJECT_FILES.values()].sort(
  (a, b) => a.title.localeCompare(b.title)
)

export const getProject = (id: string | undefined): Project | undefined =>
  PROJECTS.find((p) => p.id === id)

/** Projects offered in one phase of one roadmap. */
export const projectsOfPhase = (roadmapId: string, phase: number): Project[] =>
  PROJECTS.filter((p) =>
    p.roadmaps.some((r) => r.roadmapId === roadmapId && r.phase === phase)
  )

/** Projects offered anywhere in a roadmap. */
export const projectsOfRoadmap = (roadmapId: string): Project[] =>
  PROJECTS.filter((p) => p.roadmaps.some((r) => r.roadmapId === roadmapId))
