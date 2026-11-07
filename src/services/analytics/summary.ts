import { moduleIdsForRoles } from "@/services/curriculum/relevance"
import { selectedModuleIds } from "@/services/curriculum/syllabus"
import { isDue } from "@/services/revision/schedule"
import type { QuestionIndexEntry } from "@/types/content"
import type {
  ActivityEntry,
  LearnerProfile,
  QuestionProgress,
} from "@/types/learner"
import { shiftDateKey, toDateKey } from "@/utils/dates"
import { computeStreak, type StreakResult } from "./streak"

export interface ModuleStat {
  moduleId: string
  total: number
  completed: number
  confidenceSum: number
}

export interface DayActivity {
  date: string
  minutes: number
  items: number
}

export interface WeakTopic {
  moduleId: string
  topic: string
  count: number
}

export interface Summary {
  /** Modules in the learner's selected paths that actually have questions. */
  modules: ModuleStat[]
  totalQuestions: number
  completed: number
  attempted: number
  flagged: number
  streak: StreakResult
  minutesToday: number
  dailyTargetMinutes: number
  week: DayActivity[]
  dueReviews: QuestionIndexEntry[]
  weakTopics: WeakTopic[]
  lastStudiedId: string | null
  /** First not-yet-completed question in the module the learner is part-way through. */
  continueQuestion: QuestionIndexEntry | null
  /** First question in an untouched module of the primary path. */
  startQuestion: QuestionIndexEntry | null
}

interface Input {
  profile: LearnerProfile | null
  progress: Record<string, QuestionProgress>
  activity: ActivityEntry[]
  index: QuestionIndexEntry[]
  now?: Date
}

export function buildSummary({
  profile,
  progress,
  activity,
  index,
  now = new Date(),
}: Input): Summary {
  const today = toDateKey(now)
  const roleIds = profile?.selectedRoles ?? []
  // Scoped to the learner's effective syllabus (role defaults plus their choices), so
  // optional modules they did not choose do not dilute readiness.
  const wanted = new Set(
    selectedModuleIds(
      roleIds,
      profile?.syllabusOverrides ?? {},
      profile?.experience
    )
  )
  // Questions the learner removed from their prep do not count anywhere.
  const scoped = index.filter(
    (q) => wanted.has(q.moduleId) && !progress[q.id]?.removed
  )

  const byModule = new Map<string, ModuleStat>()
  for (const q of scoped) {
    const stat = byModule.get(q.moduleId) ?? {
      moduleId: q.moduleId,
      total: 0,
      completed: 0,
      confidenceSum: 0,
    }
    const p = progress[q.id]
    stat.total++
    if (p?.completed) stat.completed++
    stat.confidenceSum += p?.confidence ?? 0
    byModule.set(q.moduleId, stat)
  }
  // Preserve the role's module ordering.
  const modules = [...wanted].flatMap((id) =>
    byModule.has(id) ? [byModule.get(id)!] : []
  )

  // Questions made from the learner's resume are not curriculum, so they stay out of readiness and the module
  // table; their reviews are still due like any other.
  const resumeIds = index
    .filter((q) => q.moduleId.startsWith("resume-") && !progress[q.id]?.removed)
    .map((q) => q.id)
  const scopedIds = new Set([...scoped.map((q) => q.id), ...resumeIds])
  const scopedProgress = Object.values(progress).filter((p) =>
    scopedIds.has(p.questionId)
  )

  const minutesByDate = new Map<string, { minutes: number; items: number }>()
  for (const a of activity) {
    const d = minutesByDate.get(a.date) ?? { minutes: 0, items: 0 }
    d.minutes += a.minutes
    d.items++
    minutesByDate.set(a.date, d)
  }
  const week: DayActivity[] = Array.from({ length: 7 }, (_, i) => {
    const date = shiftDateKey(today, i - 6)
    const d = minutesByDate.get(date)
    return { date, minutes: d?.minutes ?? 0, items: d?.items ?? 0 }
  })

  const byId = new Map(index.map((q) => [q.id, q]))
  const dueReviews = scopedProgress
    .filter((p) => p.completed && isDue(p, now))
    .sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""))
    .flatMap((p) => (byId.has(p.questionId) ? [byId.get(p.questionId)!] : []))

  const weakCounts = new Map<string, WeakTopic>()
  for (const p of scopedProgress) {
    const weak = p.difficult || (p.confidence > 0 && p.confidence <= 2)
    const q = byId.get(p.questionId)
    if (!weak || !q) continue
    const key = `${q.moduleId}::${q.topic}`
    const w = weakCounts.get(key) ?? {
      moduleId: q.moduleId,
      topic: q.topic,
      count: 0,
    }
    w.count++
    weakCounts.set(key, w)
  }
  const weakTopics = [...weakCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const lastStudied = scopedProgress
    .filter((p) => p.lastStudiedAt)
    .sort((a, b) =>
      (b.lastStudiedAt ?? "").localeCompare(a.lastStudiedAt ?? "")
    )[0]

  let continueQuestion: QuestionIndexEntry | null = null
  const lastModule = lastStudied
    ? byId.get(lastStudied.questionId)?.moduleId
    : undefined
  const candidates = lastModule
    ? [lastModule, ...modules.map((m) => m.moduleId)]
    : modules.map((m) => m.moduleId)
  for (const id of candidates) {
    const stat = byModule.get(id)
    if (!stat || stat.completed === stat.total) continue
    continueQuestion =
      scoped.find((q) => q.moduleId === id && !progress[q.id]?.completed) ??
      null
    if (continueQuestion) break
  }

  const primaryModules = new Set(
    profile?.primaryRole ? moduleIdsForRoles([profile.primaryRole]) : []
  )
  const startQuestion =
    modules
      .filter((m) => m.completed === 0 && primaryModules.has(m.moduleId))
      .map((m) => scoped.find((q) => q.moduleId === m.moduleId) ?? null)
      .find(Boolean) ?? null

  return {
    modules,
    totalQuestions: scoped.length,
    completed: scopedProgress.filter((p) => p.completed).length,
    attempted: scopedProgress.filter((p) => p.attempts > 0 || p.completed)
      .length,
    flagged: scopedProgress.filter((p) => p.difficult || p.revision).length,
    streak: computeStreak(
      activity.map((a) => a.date),
      today
    ),
    minutesToday: minutesByDate.get(today)?.minutes ?? 0,
    dailyTargetMinutes: Math.round((profile?.dailyStudyHours ?? 0) * 60),
    week,
    dueReviews,
    weakTopics,
    lastStudiedId: lastStudied?.questionId ?? null,
    continueQuestion,
    startQuestion,
  }
}
