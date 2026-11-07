import type { DomainId } from "@/data/catalog/module-types"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { getRole } from "@/data/catalog/roles"
import {
  defaultsForRoadmap,
  defaultsForRoles,
  type Defaults,
} from "@/services/curriculum/relevance"

/** What the syllabus is built for: one or more career paths (Interview Prep) or one Study Path roadmap. */
export type CurriculumSource =
  | { kind: "roles"; roleIds: readonly string[] }
  | { kind: "roadmap"; roadmapId: string | null }

export interface ResolvedSource {
  defaults: Defaults
  scope: "interview" | "study"
  /** Learning order of domains for a roadmap; roles list domains in catalogue order. */
  domainOrder?: readonly DomainId[]
  label: string
}

export function resolveSource(source: CurriculumSource): ResolvedSource {
  if (source.kind === "roles") {
    return {
      defaults: defaultsForRoles(source.roleIds),
      scope: "interview",
      label:
        source.roleIds.map((id) => getRole(id)?.title ?? id).join(", ") ||
        "No career path chosen",
    }
  }
  const roadmap = getRoadmap(source.roadmapId)
  return {
    defaults: defaultsForRoadmap(source.roadmapId),
    scope: "study",
    domainOrder: roadmap?.domainOrder,
    label: roadmap?.title ?? "No roadmap chosen",
  }
}
