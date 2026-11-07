import { MODULES } from "@/data/catalog/modules"
import type { CatalogModule } from "@/data/catalog/module-types"
import type { Tier } from "@/data/curriculum/role-relevance"
import { isResumeModuleId, type ProfileExperience } from "@/types/learner"
import {
  defaultsForRoles,
  orderedModuleIds,
  tierForExperience,
  type Defaults,
} from "./relevance"
import { moduleMinutes } from "./time"

export type Priority = "high" | "medium" | "low"

/**
 * What a learner changed from the role defaults. Only deviations are stored,
 * so the recommended curriculum is never lost and a default that changes in a
 * later release still reaches learners who did not touch it.
 */
export interface SyllabusOverride {
  selected?: boolean
  priority?: Priority
  customizedMinutes?: number
}
export type SyllabusOverrides = Record<string, SyllabusOverride>

export interface SyllabusEntry {
  module: CatalogModule
  /** Relevance for the chosen roles or roadmap; null when outside them (full catalogue only). */
  tier: Tier | null
  /** Core for the learner's path. Core modules are on by default, but the learner may remove them (after a confirmation). */
  core: boolean
  selected: boolean
  /** The learner took out a module that is on by default (core or recommended). It can be restored. */
  removed: boolean
  /** Selected and set to "low" by the learner: kept in the syllabus but prepared later. */
  deferred: boolean
  priority: Priority
  minutes: number
  /** The learner replaced the estimate. */
  customized: boolean
  /** The learner changed this module's selection or priority from the default. */
  changed: boolean
}

export interface ResolveInput {
  defaults: Defaults
  overrides: SyllabusOverrides
  experience: ProfileExperience
  /** `study` leaves out interview-only modules. */
  scope?: "interview" | "study"
}

const defaultPriority = (tier: Tier | null): Priority =>
  tier === "core" ? "high" : tier === "recommended" ? "medium" : "low"
const onByDefault = (tier: Tier | null) =>
  tier === "core" || tier === "recommended"

/** Effective syllabus for the whole catalogue: role defaults plus the learner's overrides, recomputed each time. */
export function resolveSyllabus({
  defaults,
  overrides,
  experience,
  scope = "interview",
}: ResolveInput): SyllabusEntry[] {
  return MODULES.filter(
    (m) =>
      // Resume modules are generated question sets, never curriculum.
      !isResumeModuleId(m.id) &&
      (scope === "interview" || m.domainId !== "career")
  ).map((module) => {
    const tier = tierForExperience(
      module.id,
      defaults.get(module.id) ?? null,
      experience
    )
    const o = overrides[module.id]
    const selected = o?.selected ?? onByDefault(tier)
    const deferred = selected && tier !== "core" && o?.priority === "low"
    return {
      module,
      tier,
      core: tier === "core",
      selected,
      removed: !selected && onByDefault(tier) && o?.selected === false,
      deferred,
      priority: o?.priority ?? defaultPriority(tier),
      minutes: moduleMinutes(module, experience, o?.customizedMinutes),
      customized: o?.customizedMinutes !== undefined,
      changed:
        o !== undefined &&
        (o.selected !== undefined || o.priority !== undefined),
    }
  })
}

/** Selected modules in the entry list. */
export const selectedEntries = (entries: readonly SyllabusEntry[]) =>
  entries.filter((e) => e.selected)

/** Ids of the syllabus a learner is actually preparing: core and recommended by default, plus their choices, minus what they removed. */
export function selectedModuleIds(
  roleIds: readonly string[],
  overrides: SyllabusOverrides,
  experience: ProfileExperience = "fresher"
): string[] {
  const defaults = defaultsForRoles(roleIds)
  const chosen = new Set(
    resolveSyllabus({ defaults, overrides, experience })
      .filter((e) => e.selected)
      .map((e) => e.module.id)
  )
  // Tier order first (core, recommended, optional), then any other module the learner added.
  const ordered = orderedModuleIds(defaults).filter((id) => chosen.has(id))
  return [...ordered, ...[...chosen].filter((id) => !ordered.includes(id))]
}

/** Switch one module on or off. Returns the new overrides; a choice equal to the default is not stored. */
export function setSelected(
  overrides: SyllabusOverrides,
  entry: SyllabusEntry,
  selected: boolean
): SyllabusOverrides {
  const next: SyllabusOverride = { ...overrides[entry.module.id], selected }
  if (selected === onByDefault(entry.tier)) delete next.selected
  return cleaned(overrides, entry.module.id, next)
}

function cleaned(
  overrides: SyllabusOverrides,
  id: string,
  next: SyllabusOverride
): SyllabusOverrides {
  const { [id]: _removed, ...rest } = overrides
  void _removed
  const empty =
    next.selected === undefined &&
    next.priority === undefined &&
    next.customizedMinutes === undefined
  return empty ? rest : { ...rest, [id]: next }
}

export function setCustomMinutes(
  overrides: SyllabusOverrides,
  id: string,
  minutes: number | undefined
): SyllabusOverrides {
  const next: SyllabusOverride = { ...overrides[id] }
  if (minutes === undefined) delete next.customizedMinutes
  else next.customizedMinutes = Math.max(0, Math.round(minutes))
  return cleaned(overrides, id, next)
}

/**
 * "Prepare core first": every selected module that is not core is set to
 * "low" (Later). Nothing is removed; the modules stay in the syllabus and in the list.
 */
export function prepareCoreFirst(
  overrides: SyllabusOverrides,
  entries: readonly SyllabusEntry[]
): SyllabusOverrides {
  let next = overrides
  for (const e of entries) {
    if (e.selected && !e.core)
      next = cleaned(next, e.module.id, {
        ...next[e.module.id],
        priority: "low",
      })
  }
  return next
}

/** Undo "Prepare core first": clears every priority override, keeping selections and custom minutes. */
export function restorePriorities(
  overrides: SyllabusOverrides
): SyllabusOverrides {
  let next = overrides
  for (const [id, o] of Object.entries(overrides)) {
    if (o.priority !== undefined) {
      const { priority: _p, ...rest } = o
      void _p
      next = cleaned(next, id, rest)
    }
  }
  return next
}

export const hasDeferred = (entries: readonly SyllabusEntry[]) =>
  entries.some((e) => e.deferred)
