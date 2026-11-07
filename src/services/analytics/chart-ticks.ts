/** Steps a minutes axis may use, smallest first: whole, easy to read, and 30/60-minute multiples once past an hour. */
const STEPS = [5, 10, 15, 30, 60, 120, 180, 240, 300, 600]
const MAX_INTERVALS = 4

export interface MinuteTicks {
  /** Distinct, ascending, starting at 0; the last one is at or above the data maximum. */
  ticks: number[]
  top: number
}

/** Axis ticks (in minutes) for a value range 0..max. Always distinct whole numbers. */
export function minuteTicks(maxMinutes: number): MinuteTicks {
  const max = Math.max(
    10,
    Math.ceil(Number.isFinite(maxMinutes) ? maxMinutes : 0)
  )
  const step =
    STEPS.find((s) => Math.ceil(max / s) <= MAX_INTERVALS) ??
    Math.ceil(max / MAX_INTERVALS / 60) * 60
  const intervals = Math.ceil(max / step)
  const ticks = Array.from({ length: intervals + 1 }, (_, i) => i * step)
  return { ticks, top: ticks[ticks.length - 1] }
}

/** "0", "30m", "1h", "1.5h": a short label that fits a narrow axis. */
export function formatMinuteTick(minutes: number): string {
  if (minutes === 0) return "0"
  if (minutes < 60) return `${minutes}m`
  return `${Math.round((minutes / 60) * 10) / 10}h`
}
