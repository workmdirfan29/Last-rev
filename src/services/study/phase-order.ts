import type { DomainId } from "@/data/catalog/module-types"
import { refModule, type PhaseDef } from "@/data/catalog/phases"
import { distribute, orderModules } from "@/services/planner/schedule"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"

/**
 * The Study Path plan follows the roadmap's phases: everything in phase 1 comes before phase 2, and so on, in
 * the order the phase lists its modules. A module split between two phases by topic (MERN `javascript`) becomes
 * two entries in the plan, one per phase, sharing the module's minutes in proportion to their topics.
 *
 * Unchanged rules: modules the learner set to "Later" come last, and a selected module that no phase lists
 * (an optional one) goes after the phases in the usual domain order. The module's total minutes never change.
 */
export function orderByPhases(
  entries: readonly SyllabusEntry[],
  phases: readonly PhaseDef[],
  domainOrder?: readonly DomainId[]
): SyllabusEntry[] {
  const selected = new Map(
    entries.filter((e) => e.selected).map((e) => [e.module.id, e])
  )

  // which topics of each module each phase takes, in phase order
  const groups = new Map<string, { phase: number; topics: Set<string> }[]>()
  const sequence: { phase: number; moduleId: string }[] = []
  for (const phase of [...phases].sort((a, b) => a.number - b.number))
    for (const ref of phase.modules) {
      const id = refModule(ref)
      const e = selected.get(id)
      if (!e) continue
      const titles =
        typeof ref === "string"
          ? e.module.topicList.map((t) => t.title)
          : [...ref.topics]
      const list = groups.get(id) ?? []
      list.push({ phase: phase.number, topics: new Set(titles) })
      groups.set(id, list)
      sequence.push({ phase: phase.number, moduleId: id })
    }

  const placed = new Set<string>()
  const placedParts = new Set<string>()
  const out: SyllabusEntry[] = []
  const emit = (moduleId: string, phase: number) => {
    const e = selected.get(moduleId)!
    const list = groups.get(moduleId)!
    if (
      list.length === 1 &&
      list[0].topics.size === e.module.topicList.length
    ) {
      out.push(e)
      return
    }
    // split module: this phase's topics, with the module's minutes shared by topic weight
    const weights = list.map((g) =>
      e.module.topicList
        .filter((t) => g.topics.has(t.title))
        .reduce((n, t) => n + t.minutes, 0)
    )
    const shares = distribute(e.minutes, weights)
    const index = list.findIndex((g) => g.phase === phase)
    out.push({
      ...e,
      module: {
        ...e.module,
        topicList: e.module.topicList.filter((t) =>
          list[index].topics.has(t.title)
        ),
      },
      minutes: shares[index],
    })
  }

  const deferred: SyllabusEntry[] = []
  /** Place a module, pulling its selected prerequisites in front of it first (as the ordinary plan does). */
  const place = (moduleId: string, phase: number, trail: string[] = []) => {
    const e = selected.get(moduleId)
    if (!e || placed.has(moduleId) || trail.includes(moduleId)) return
    if (e.deferred) {
      placed.add(moduleId)
      deferred.push(e)
      return
    }
    for (const p of e.module.prerequisites) {
      const pe = selected.get(p)
      if (!pe || pe.deferred || placed.has(p)) continue
      // a prerequisite listed in a later phase is brought forward, every part of it if it is split
      for (const g of groups.get(p) ?? [{ phase }])
        place(p, g.phase, [...trail, moduleId])
    }
    const list = groups.get(moduleId)!
    if (list.length > 1 && list[0].phase !== phase) return
    placed.add(moduleId)
    emitParts(moduleId, phase)
  }
  /** A split module is emitted part by part as each of its phases is reached. */
  const emitParts = (moduleId: string, phase: number) => emit(moduleId, phase)
  for (const { phase, moduleId } of sequence) {
    const list = groups.get(moduleId)!
    if (list.length > 1) {
      // split module: each phase contributes its own part, once
      const key = `${moduleId}@${phase}`
      if (placedParts.has(key)) continue
      placedParts.add(key)
      const e = selected.get(moduleId)!
      if (e.deferred) {
        if (!placed.has(moduleId)) {
          placed.add(moduleId)
          deferred.push(e)
        }
        continue
      }
      for (const p of e.module.prerequisites) {
        const pe = selected.get(p)
        if (pe && !pe.deferred && !placed.has(p)) place(p, phase)
      }
      placed.add(moduleId)
      emit(moduleId, phase)
    } else place(moduleId, phase)
  }

  // selected modules no phase lists: after the phases, in the ordinary order
  const rest = entries.filter(
    (e) => e.selected && !placed.has(e.module.id) && !e.deferred
  )
  const restDeferred = entries.filter(
    (e) => e.selected && !placed.has(e.module.id) && e.deferred
  )
  return [
    ...out,
    ...orderModules(rest, domainOrder),
    ...deferred,
    ...orderModules(restDeferred, domainOrder),
  ]
}
