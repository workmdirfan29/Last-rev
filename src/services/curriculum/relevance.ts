import { MODULES } from "@/data/catalog/modules"
import { type DomainId } from "@/data/catalog/module-types"
import { getRoadmap } from "@/data/catalog/roadmaps"
import {
  EXPERIENCE_AWARE_TIERS,
  ROLE_ORDER,
  roleTier,
  type Tier,
} from "@/data/curriculum/role-relevance"

/** Module id to its tier, for the modules that are part of a role or roadmap. */
export type Defaults = ReadonlyMap<string, Tier>

export const TIER_RANK: Record<Tier, number> = {
  core: 0,
  recommended: 1,
  optional: 2,
}
export const TIER_LABEL: Record<Tier, string> = {
  core: "Core",
  recommended: "Recommended",
  optional: "Optional",
}

const strongest = (a: Tier | undefined, b: Tier): Tier =>
  a && TIER_RANK[a] <= TIER_RANK[b] ? a : b

/**
 * Defaults for one or more roles. Relevance is the strongest across the roles,
 * so a module is core if it is core for ANY selected role.
 * `includeCareer` keeps interview-only modules (Interview Prep only).
 */
export function defaultsForRoles(
  roleIds: readonly string[],
  { includeCareer = true } = {}
): Defaults {
  const out = new Map<string, Tier>()
  for (const m of MODULES) {
    if (!includeCareer && m.domainId === "career") continue
    for (const roleId of roleIds) {
      const tier = roleTier(roleId, m.id)
      if (tier) out.set(m.id, strongest(out.get(m.id), tier))
    }
  }
  return out
}

/** A module's tier once the learner's experience is considered: a recommended module that suits only other levels is optional. */
export function tierForExperience(
  moduleId: string,
  tier: Tier | null,
  experience: string
): Tier | null {
  const levels = EXPERIENCE_AWARE_TIERS[moduleId]
  if (!levels || tier !== "recommended") return tier
  return levels.includes(experience as never) ? tier : "optional"
}

/** Defaults for a Study Path roadmap: its base role's relevance plus its overrides. Never includes interview-only modules. */
export function defaultsForRoadmap(
  roadmapId: string | null | undefined
): Defaults {
  const roadmap = getRoadmap(roadmapId)
  if (!roadmap) return new Map()
  const out = new Map(
    defaultsForRoles([roadmap.baseRole], { includeCareer: false })
  )
  for (const [moduleId, tier] of Object.entries(roadmap.overrides)) {
    if (tier === null) out.delete(moduleId)
    else out.set(moduleId, tier)
  }
  return out
}

/** Ids by tier (core, then recommended, then optional); inside a tier in learning order (`domainOrder`, else catalogue order). */
export function orderedModuleIds(
  defaults: Defaults,
  domainOrder?: readonly DomainId[]
): string[] {
  const rank = (d: DomainId) => (domainOrder ? domainOrder.indexOf(d) : 0)
  const position = new Map(MODULES.map((m, i) => [m.id, i]))
  return MODULES.filter((m) => defaults.has(m.id))
    .sort(
      (a, b) =>
        TIER_RANK[defaults.get(a.id)!] - TIER_RANK[defaults.get(b.id)!] ||
        rank(a.domainId) - rank(b.domainId) ||
        position.get(a.id)! - position.get(b.id)!
    )
    .map((m) => m.id)
}

/** Ids in learning order: by domain order, then catalogue order. Used for a roadmap's module sequence. */
export function learningOrder(
  defaults: Defaults,
  domainOrder: readonly DomainId[]
): string[] {
  const position = new Map(MODULES.map((m, i) => [m.id, i]))
  return MODULES.filter((m) => defaults.has(m.id))
    .sort(
      (a, b) =>
        domainOrder.indexOf(a.domainId) - domainOrder.indexOf(b.domainId) ||
        position.get(a.id)! - position.get(b.id)!
    )
    .map((m) => m.id)
}

/** Every module relevant to the roles (core, recommended and optional), tier-ordered. Drives the Interview Zone. */
export function moduleIdsForRoles(roleIds: readonly string[]): string[] {
  return orderedModuleIds(defaultsForRoles(roleIds))
}

/** How many roles treat a module as core (rarer means more distinguishing for a role). */
export function coreRoleCount(moduleId: string): number {
  return ROLE_ORDER.filter((r) => roleTier(r, moduleId) === "core").length
}
