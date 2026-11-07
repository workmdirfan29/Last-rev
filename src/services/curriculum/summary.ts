import { DOMAIN_IDS, type DomainId } from "@/data/catalog/module-types"
import { QUESTION_TARGETS } from "./progress"
import type { QuestionStats } from "./progress"
import type { SyllabusEntry } from "./syllabus"

export interface DomainSummary {
  domainId: DomainId
  /** Modules shown for this domain (those relevant to the roles, or all when browsing the full catalogue). */
  total: number
  selected: number
  minutes: number
}

/** The three groups from the spec, applied to the current selection. */
export interface GroupSummary {
  /** Shared Engineering Foundation. */
  foundation: { modules: number; minutes: number }
  /** Core and recommended modules outside the foundation. */
  roleSpecific: { modules: number; minutes: number }
  /** Optional modules the learner chose. */
  optional: { modules: number; minutes: number }
}

export interface SyllabusSummary {
  modules: number
  /** Minutes to prepare now (selected, not deferred). */
  minutes: number
  /** Minutes for selected modules the learner deferred ("Later"). */
  deferredMinutes: number
  deferredModules: number
  topics: number
  lessons: number
  assignments: number
  /** Interview questions that really exist for the selected modules, by level. */
  questions: {
    fresher: number
    intermediate: number
    advanced: number
    total: number
  }
  /** What the per-level targets would be if every selected module were complete (25, 50, 75). */
  questionTargets: { fresher: number; intermediate: number; advanced: number }
  groups: GroupSummary
  byDomain: DomainSummary[]
}

/** Totals for the selected syllabus, all derived from the entries and the question index; nothing is typed in. */
export function summarize(
  entries: readonly SyllabusEntry[],
  statsFor: (moduleId: string) => QuestionStats,
  visible: readonly SyllabusEntry[] = entries
): SyllabusSummary {
  const selected = entries.filter((e) => e.selected)
  const now = selected.filter((e) => !e.deferred)
  const deferred = selected.filter((e) => e.deferred)
  const sum = (
    list: readonly SyllabusEntry[],
    f: (e: SyllabusEntry) => number
  ) => list.reduce((n, e) => n + f(e), 0)

  const questions = { fresher: 0, intermediate: 0, advanced: 0, total: 0 }
  for (const e of selected) {
    const s = statsFor(e.module.id)
    questions.fresher += s.byLevel.fresher.available
    questions.intermediate += s.byLevel.intermediate.available
    questions.advanced += s.byLevel.advanced.available
    questions.total += s.available
  }

  const group = (list: readonly SyllabusEntry[]) => ({
    modules: list.length,
    minutes: sum(list, (e) => e.minutes),
  })
  const inFoundation = (e: SyllabusEntry) => e.module.domainId === "foundation"
  const groups: GroupSummary = {
    foundation: group(now.filter(inFoundation)),
    roleSpecific: group(
      now.filter(
        (e) => !inFoundation(e) && e.tier !== "optional" && e.tier !== null
      )
    ),
    optional: group(
      now.filter(
        (e) => !inFoundation(e) && (e.tier === "optional" || e.tier === null)
      )
    ),
  }

  return {
    modules: selected.length,
    minutes: sum(now, (e) => e.minutes),
    deferredMinutes: sum(deferred, (e) => e.minutes),
    deferredModules: deferred.length,
    topics: sum(selected, (e) => e.module.topicList.length),
    lessons: sum(selected, (e) => e.module.lessons.length),
    assignments: sum(
      selected,
      (e) => e.module.assignmentIds.length + e.module.projectIds.length
    ),
    questions,
    questionTargets: {
      fresher: selected.length * QUESTION_TARGETS.fresher,
      intermediate: selected.length * QUESTION_TARGETS.intermediate,
      advanced: selected.length * QUESTION_TARGETS.advanced,
    },
    groups,
    byDomain: DOMAIN_IDS.map((domainId) => {
      const inDomain = visible.filter((e) => e.module.domainId === domainId)
      const sel = inDomain.filter((e) => e.selected)
      return {
        domainId,
        total: inDomain.length,
        selected: sel.length,
        minutes: sum(
          sel.filter((e) => !e.deferred),
          (e) => e.minutes
        ),
      }
    }).filter((d) => d.total > 0),
  }
}
