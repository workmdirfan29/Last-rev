export interface FeasibilityInput {
  /** Minutes to prepare now (selected, not deferred). */
  totalMinutes: number
  /** Minutes of only the core modules among them. */
  coreMinutes: number
  dailyMinutes: number
  /** Days until the deadline, or null when there is none. */
  targetDays: number | null
}

export interface FeasibilityResult {
  /** ceil(total minutes / daily minutes), or null when no daily time is set. */
  minimumDays: number | null
  targetDays: number | null
  fits: boolean
  /** Days over the deadline (0 when it fits). */
  shortfallDays: number
  options: {
    /** A: extend the deadline to at least this many days. */
    extendDays: number | null
    /** B: prepare only the core modules first. */
    coreFirst: { minutes: number; minimumDays: number | null; fits: boolean }
    /** C: study this many minutes a day to meet the deadline. */
    dailyMinutesNeeded: number | null
    extraMinutesPerDay: number
  }
}

export const AMBITIOUS_MESSAGE =
  "Your target is ambitious for the selected syllabus."

const daysFor = (minutes: number, daily: number): number | null =>
  daily > 0 ? Math.ceil(minutes / daily) : null

/**
 * The feasibility engine. Pure arithmetic over the selection; it never removes
 * anything. The three options carry real numbers for the learner to choose from.
 */
export function assessFeasibility(input: FeasibilityInput): FeasibilityResult {
  const { totalMinutes, coreMinutes, dailyMinutes, targetDays } = input
  const minimumDays = daysFor(totalMinutes, dailyMinutes)
  const fits =
    targetDays === null
      ? true
      : minimumDays !== null && minimumDays <= targetDays
  const coreDays = daysFor(coreMinutes, dailyMinutes)
  const needed =
    targetDays !== null && targetDays > 0
      ? Math.ceil(totalMinutes / targetDays)
      : null
  return {
    minimumDays,
    targetDays,
    fits,
    shortfallDays:
      fits || minimumDays === null || targetDays === null
        ? 0
        : minimumDays - targetDays,
    options: {
      extendDays: minimumDays,
      coreFirst: {
        minutes: coreMinutes,
        minimumDays: coreDays,
        fits:
          targetDays === null
            ? true
            : coreDays !== null && coreDays <= targetDays,
      },
      dailyMinutesNeeded: needed,
      extraMinutesPerDay:
        needed === null ? 0 : Math.max(0, needed - dailyMinutes),
    },
  }
}
