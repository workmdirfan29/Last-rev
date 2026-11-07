import type { CatalogModule, Topic } from "@/data/catalog/module-types"
import { refModule, type PhaseDef } from "@/data/catalog/phases"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"
import type { QuestionProgress } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { topicIdOf } from "@/utils/topic-id"
import { lessonFinished } from "./progress"

type Progress = Readonly<Record<string, QuestionProgress>>

export interface PhaseModule {
  module: CatalogModule
  /** The topics (with minutes) of this module that belong to the phase. */
  topics: Topic[]
  /** The learner's syllabus entry (priority, "Later"). */
  entry: SyllabusEntry
}

export interface PhaseView {
  phase: PhaseDef
  /** Modules of the phase that are in the learner's syllabus, in the phase's order. */
  modules: PhaseModule[]
  /** Modules the phase lists that the learner took out of their syllabus. */
  hiddenModules: number
  /** A phase with no catalogue modules: built around its project and links. */
  projectLed: boolean
}

/** The phases of a roadmap, narrowed to what the learner's syllabus contains. */
export function resolvePhases(
  phases: readonly PhaseDef[],
  entries: readonly SyllabusEntry[]
): PhaseView[] {
  const selected = new Map(
    entries.filter((e) => e.selected).map((e) => [e.module.id, e])
  )
  return [...phases]
    .sort((a, b) => a.number - b.number)
    .map((phase) => {
      const modules: PhaseModule[] = []
      let hidden = 0
      for (const ref of phase.modules) {
        const id = refModule(ref)
        const entry = selected.get(id)
        if (!entry) {
          hidden++
          continue
        }
        const topics = entry.module.topicList.filter(
          (t) =>
            t.minutes > 0 &&
            (typeof ref === "string" || ref.topics.includes(t.title))
        )
        if (topics.length > 0)
          modules.push({ module: entry.module, topics, entry })
      }
      return {
        phase,
        modules,
        hiddenModules: hidden,
        projectLed: phase.modules.length === 0,
      }
    })
}

export interface PhaseStats {
  modules: number
  modulesWithLessons: number
  topicsTotal: number
  topicsDone: number
  /** Planned minutes of the phase's topics. */
  minutes: number
  lessonsReady: number
  lessonsFinished: number
  /** Knowledge-check items the phase's lessons hold (the pool a phase quiz draws from). */
  checkItems: number
  lessonMinutes: number
  /** Topics that have at least one lesson. */
  topicsCovered: number
}

/** Lessons whose module and topic belong to the phase, in module then lesson order. */
export function lessonsInPhase(
  view: PhaseView,
  index: readonly StudyLessonIndexEntry[]
): StudyLessonIndexEntry[] {
  return view.modules.flatMap((m) =>
    index
      .filter(
        (l) =>
          l.moduleId === m.module.id &&
          m.topics.some((t) => t.title === l.topic)
      )
      .sort((a, b) => a.order - b.order)
  )
}

export function phaseStats(
  view: PhaseView,
  index: readonly StudyLessonIndexEntry[],
  progress: Progress
): PhaseStats {
  const lessons = lessonsInPhase(view, index)
  const topics = view.modules.flatMap((m) =>
    m.topics.map((t) => ({ m, t, id: topicIdOf(m.module.id, t.title) }))
  )
  return {
    modules: view.modules.length,
    modulesWithLessons: view.modules.filter((m) =>
      lessons.some((l) => l.moduleId === m.module.id)
    ).length,
    topicsTotal: topics.length,
    topicsDone: topics.filter((x) => progress[x.id]?.completed === true).length,
    minutes: topics.reduce((n, x) => n + x.t.minutes, 0),
    lessonsReady: lessons.length,
    lessonsFinished: lessons.filter((l) => lessonFinished(l.id, progress))
      .length,
    checkItems: lessons.reduce((n, l) => n + l.check.length, 0),
    lessonMinutes: lessons.reduce((n, l) => n + l.minutes, 0),
    topicsCovered: topics.filter((x) => lessons.some((l) => l.topicId === x.id))
      .length,
  }
}

export type PhaseState =
  "project-led" | "in-preparation" | "not-started" | "in-progress" | "done"

/** One word for where a phase stands, from real counts only. */
export function phaseState(view: PhaseView, s: PhaseStats): PhaseState {
  if (view.projectLed) return "project-led"
  if (s.topicsTotal > 0 && s.topicsDone === s.topicsTotal) return "done"
  if (s.lessonsReady === 0 && s.topicsDone === 0) return "in-preparation"
  return s.lessonsFinished > 0 || s.topicsDone > 0
    ? "in-progress"
    : "not-started"
}

export const PHASE_STATE_LABEL: Record<PhaseState, string> = {
  "project-led": "Project-led",
  "in-preparation": "Lessons in preparation",
  "not-started": "Not started",
  "in-progress": "In progress",
  done: "Done",
}

/** Every ready lesson of the roadmap in learning order (phase, then module, then lesson). */
export function roadmapLessons(
  views: readonly PhaseView[],
  index: readonly StudyLessonIndexEntry[]
): StudyLessonIndexEntry[] {
  const seen = new Set<string>()
  const out: StudyLessonIndexEntry[] = []
  for (const v of views)
    for (const l of lessonsInPhase(v, index))
      if (!seen.has(l.id)) {
        seen.add(l.id)
        out.push(l)
      }
  return out
}

/**
 * The phase the learner is in: the first one that has topics and is not finished. Project-led phases are never
 * "current" while an earlier phase with modules is unfinished. Null when every phase with topics is done.
 */
export function currentPhase(
  views: readonly PhaseView[],
  index: readonly StudyLessonIndexEntry[],
  progress: Progress
): PhaseView | null {
  for (const v of views) {
    if (v.projectLed) continue
    const s = phaseStats(v, index, progress)
    if (s.topicsTotal > 0 && s.topicsDone < s.topicsTotal) return v
  }
  return null
}
