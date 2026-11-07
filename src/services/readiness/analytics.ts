import { addDays, parseISO, startOfWeek } from "date-fns"
import type {
  ActivityEntry,
  QuestionProgress,
  ReadinessSnapshot,
} from "@/types/learner"
import { fromDateKey, shiftDateKey, toDateKey } from "@/utils/dates"
import { computeStreak } from "@/services/analytics/streak"

/** The analytics window, in weeks. */
export const ANALYTICS_WEEKS = 12
/** A trend line needs at least this many weekly snapshots. */
export const MIN_SNAPSHOTS_FOR_TREND = 3

export const weekStart = (dateKey: string) =>
  toDateKey(startOfWeek(fromDateKey(dateKey), { weekStartsOn: 1 }))

export interface WeekMinutes {
  weekStart: string
  minutes: number
  items: number
}

/** Study minutes per Monday-to-Sunday week for the last `weeks` weeks. Empty when there is no activity at all. */
export function weeklyMinutes(
  activity: readonly ActivityEntry[],
  today: string,
  weeks = ANALYTICS_WEEKS
): WeekMinutes[] {
  if (activity.length === 0) return []
  const first = weekStart(shiftDateKey(weekStart(today), -7 * (weeks - 1)))
  const out: WeekMinutes[] = []
  for (let i = 0; i < weeks; i++) {
    const start = toDateKey(addDays(parseISO(first), 7 * i))
    out.push({ weekStart: start, minutes: 0, items: 0 })
  }
  const byStart = new Map(out.map((w) => [w.weekStart, w]))
  for (const a of activity) {
    const w = byStart.get(weekStart(a.date))
    if (w) {
      w.minutes += a.minutes
      w.items++
    }
  }
  return out
}

export interface TypeTotal {
  type: string
  items: number
  minutes: number
}
export function activityByType(
  activity: readonly ActivityEntry[]
): TypeTotal[] {
  const m = new Map<string, TypeTotal>()
  for (const a of activity) {
    const t = m.get(a.type) ?? { type: a.type, items: 0, minutes: 0 }
    t.items++
    t.minutes += a.minutes
    m.set(a.type, t)
  }
  return [...m.values()].sort(
    (a, b) => b.minutes - a.minutes || b.items - a.items
  )
}

export interface StreakRun {
  start: string
  end: string
  days: number
}
/** Every run of consecutive activity days, newest first. */
export function streakRuns(dates: Iterable<string>): StreakRun[] {
  const days = [...new Set(dates)].sort()
  const runs: StreakRun[] = []
  for (const d of days) {
    const last = runs.at(-1)
    if (last && shiftDateKey(last.end, 1) === d) {
      last.end = d
      last.days++
    } else runs.push({ start: d, end: d, days: 1 })
  }
  return runs.reverse()
}
export { computeStreak }

const NOT_QUESTION = /^(lesson|task|ex|proj|topic|en|check)\./
const isQuestionRecord = (p: QuestionProgress) =>
  !NOT_QUESTION.test(p.questionId) && !p.removed

export interface ConfidenceBuckets {
  /** Index 0 is rating 1. */
  rated: [number, number, number, number, number]
  /** Studied or completed but never rated. */
  unrated: number
}
export function confidenceDistribution(
  progress: Readonly<Record<string, QuestionProgress>>
): ConfidenceBuckets {
  const rated: ConfidenceBuckets["rated"] = [0, 0, 0, 0, 0]
  let unrated = 0
  for (const p of Object.values(progress)) {
    if (!isQuestionRecord(p)) continue
    if (p.confidence >= 1 && p.confidence <= 5) rated[p.confidence - 1]++
    else if (p.completed || p.attempts > 0) unrated++
  }
  return { rated, unrated }
}

/** Questions the learner flagged difficult or rated 1 or 2, and the average of all ratings. */
export function weakAndAverage(
  progress: Readonly<Record<string, QuestionProgress>>
) {
  const recs = Object.values(progress).filter(isQuestionRecord)
  const weak = recs.filter(
    (p) => p.difficult || (p.confidence > 0 && p.confidence <= 2)
  ).length
  const rated = recs.filter((p) => p.confidence > 0)
  return {
    weakTopics: weak,
    averageConfidence: rated.length
      ? Math.round(
          (rated.reduce((n, p) => n + p.confidence, 0) / rated.length) * 100
        ) / 100
      : null,
  }
}

export function snapshotFor(
  overall: number,
  progress: Readonly<Record<string, QuestionProgress>>,
  today: string,
  now: Date
): ReadinessSnapshot {
  return {
    id: weekStart(today),
    takenAt: now.toISOString(),
    overall,
    ...weakAndAverage(progress),
  }
}
