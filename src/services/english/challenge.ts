import { addDays, differenceInCalendarDays, parseISO } from "date-fns"
import type {
  ActivityEntry,
  EnglishState,
  QuestionProgress,
} from "@/types/learner"
import type { ChallengeDay } from "@/types/english"
import { toDateKey } from "@/utils/dates"
import { isLearned, isPractised } from "./learned"

/**
 * The 30-day challenge as 30 independent day-cards. Nothing resets and no day is locked: the start date only
 * gives each day a scheduled date, "Day N is next" is the first day not done, and a day whose date has passed
 * without being done is simply listed as missed and can be done at any time.
 */
export interface DayTasks {
  lesson: boolean
  vocab: boolean
  sentences: boolean
  speaking: boolean
  exercise: boolean
  checkin: boolean
}
export type DayState = "done" | "today" | "missed" | "upcoming" | "open"

export interface DayStatus {
  day: number
  tasks: DayTasks
  done: boolean
  /** yyyy-MM-dd the day is scheduled for, or null before a start date is chosen. */
  date: string | null
  state: DayState
}

export interface ChallengeContext {
  progress: Readonly<Record<string, QuestionProgress>>
  state: EnglishState | null
}

export const dayKey = (day: number) => String(day)

export function tasksOf(day: ChallengeDay, ctx: ChallengeContext): DayTasks {
  const st = ctx.state
  return {
    lesson: ctx.progress[day.lesson]?.completed === true,
    vocab: day.vocab.every((id) => isLearned(id, ctx.progress, st)),
    sentences: day.sentences.every((id) => isPractised(id, ctx.progress, st)),
    speaking: (st?.speaking ?? []).some((s) => s.day === day.day),
    exercise: st?.challenge.exercises[dayKey(day.day)] === true,
    checkin: Boolean(st?.challenge.checkins[dayKey(day.day)]),
  }
}

export const isDone = (t: DayTasks) => Object.values(t).every(Boolean)

export const scheduledDate = (start: string, day: number): string =>
  toDateKey(addDays(parseISO(start), day - 1))

export function dayStatuses(
  days: readonly ChallengeDay[],
  ctx: ChallengeContext,
  today: string
): DayStatus[] {
  const start = ctx.state?.challenge.startDate ?? null
  return days.map((d) => {
    const tasks = tasksOf(d, ctx)
    const done = isDone(tasks)
    const date = start ? scheduledDate(start, d.day) : null
    const state: DayState = done
      ? "done"
      : date === null
        ? "open"
        : date === today
          ? "today"
          : date < today
            ? "missed"
            : "upcoming"
    return { day: d.day, tasks, done, date, state }
  })
}

export interface ChallengeSummary {
  started: boolean
  /** Which day the calendar is on, 1 to 30 (clamped), or null before a start date. */
  calendarDay: number | null
  finished: number
  /** The first day not done: "Day N is next". Null when all 30 are done. */
  next: number | null
  missed: number[]
  complete: boolean
}

export function summarise(
  statuses: readonly DayStatus[],
  start: string | null,
  today: string
): ChallengeSummary {
  const finished = statuses.filter((s) => s.done).length
  const next = statuses.find((s) => !s.done)?.day ?? null
  return {
    started: start !== null,
    calendarDay:
      start === null
        ? null
        : Math.min(
            statuses.length,
            Math.max(
              1,
              differenceInCalendarDays(parseISO(today), parseISO(start)) + 1
            )
          ),
    finished,
    next,
    missed: statuses.filter((s) => s.state === "missed").map((s) => s.day),
    complete: statuses.length > 0 && finished === statuses.length,
  }
}

/* ---------------------------------- streak --------------------------------- */

/** Consecutive calendar days with at least one English activity entry, ending today (or yesterday: the day is not over). */
export function englishStreak(
  activity: readonly ActivityEntry[],
  today: string
): { current: number; longest: number } {
  const days = new Set(
    activity.filter((a) => a.type === "english").map((a) => a.date)
  )
  const sorted = [...days].sort()
  let longest = 0
  let run = 0
  let prev: string | null = null
  for (const d of sorted) {
    run =
      prev && differenceInCalendarDays(parseISO(d), parseISO(prev)) === 1
        ? run + 1
        : 1
    longest = Math.max(longest, run)
    prev = d
  }
  const yesterday = toDateKey(addDays(parseISO(today), -1))
  const anchor = days.has(today)
    ? today
    : days.has(yesterday)
      ? yesterday
      : null
  let current = 0
  if (anchor) {
    let d = anchor
    while (days.has(d)) {
      current++
      d = toDateKey(addDays(parseISO(d), -1))
    }
  }
  return { current, longest }
}

/* -------------------------------- confidence -------------------------------- */

export interface ConfidenceSummary {
  count: number
  average: number | null
  /** Last 7 check-ins against the 7 before, only with at least 4 in each window. */
  trend: { delta: number; direction: "up" | "steady" | "down" } | null
}

export function confidenceSummary(
  state: EnglishState | null
): ConfidenceSummary {
  const entries = Object.values(state?.challenge.checkins ?? {}).sort((a, b) =>
    a.at.localeCompare(b.at)
  )
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
  const ratings = entries.map((e) => e.rating)
  const recent = ratings.slice(-7)
  const before = ratings.slice(-14, -7)
  const trend =
    recent.length >= 4 && before.length >= 4
      ? (() => {
          const delta = Math.round((mean(recent) - mean(before)) * 10) / 10
          return {
            delta,
            direction:
              delta >= 0.3
                ? ("up" as const)
                : delta <= -0.3
                  ? ("down" as const)
                  : ("steady" as const),
          }
        })()
      : null
  return {
    count: ratings.length,
    average: ratings.length ? Math.round(mean(ratings) * 10) / 10 : null,
    trend,
  }
}
