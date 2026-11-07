import { daysBetweenKeys, shiftDateKey } from "@/utils/dates"

export interface StreakResult {
  current: number
  longest: number
  /** True if the learner has already studied on `today`. */
  studiedToday: boolean
}

/**
 * Streak over a set of yyyy-MM-dd study days.
 *
 * `current` stays alive through today if the learner has not studied *yet*
 * today but did yesterday — the streak only breaks once a full day is missed.
 */
export function computeStreak(
  dates: Iterable<string>,
  today: string
): StreakResult {
  const days = [...new Set(dates)].sort()
  if (days.length === 0) return { current: 0, longest: 0, studiedToday: false }

  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    run = daysBetweenKeys(days[i - 1], days[i]) === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
  }

  const set = new Set(days)
  const studiedToday = set.has(today)
  let cursor = studiedToday ? today : shiftDateKey(today, -1)
  let current = 0
  while (set.has(cursor)) {
    current++
    cursor = shiftDateKey(cursor, -1)
  }
  return { current, longest, studiedToday }
}
