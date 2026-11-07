import { MODULES } from "@/data/catalog/modules"
import { SKILLS } from "@/data/curriculum/skills"
import {
  coreRoleCount,
  defaultsForRoadmap,
  defaultsForRoles,
  orderedModuleIds,
  type Defaults,
} from "./relevance"
import { resolveSyllabus } from "./syllabus"

/**
 * A few technologies that characterise a path, derived from its core modules (no
 * hand-written list). Modules that are core for fewer roles come first because
 * they distinguish the path; each contributes its first skill.
 */
function highlights(defaults: Defaults, count: number): string[] {
  const core = orderedModuleIds(defaults).filter(
    (id) => defaults.get(id) === "core"
  )
  const position = new Map(MODULES.map((m, i) => [m.id, i]))
  const byRarity = [...core].sort(
    (a, b) =>
      coreRoleCount(a) - coreRoleCount(b) || position.get(a)! - position.get(b)!
  )
  const titles: string[] = []
  for (const id of byRarity) {
    const skill = SKILLS.find((s) => s.moduleId === id)
    if (skill && !titles.includes(skill.title)) titles.push(skill.title)
    if (titles.length === count) break
  }
  return titles
}

export const roleHighlights = (roleId: string, count = 5) =>
  highlights(defaultsForRoles([roleId], { includeCareer: false }), count)
export const roadmapHighlights = (roadmapId: string, count = 5) =>
  highlights(defaultsForRoadmap(roadmapId), count)

/** What a roadmap would study by default: its core and recommended modules, at the given experience. */
export function roadmapDefaultSummary(
  roadmapId: string,
  experience: Parameters<typeof resolveSyllabus>[0]["experience"] = "fresher"
) {
  const selected = resolveSyllabus({
    defaults: defaultsForRoadmap(roadmapId),
    overrides: {},
    experience,
    scope: "study",
  }).filter((e) => e.selected)
  return {
    modules: selected.length,
    minutes: selected.reduce((n, e) => n + e.minutes, 0),
  }
}
