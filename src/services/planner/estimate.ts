import { addDays } from "date-fns"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import type { ProfileExperience, TargetPreset } from "@/types/learner"
import { daysBetweenKeys, toDateKey } from "@/utils/dates"

export const PRESET_DAYS: Record<Exclude<TargetPreset, "custom">, number> = {
  "7d": 7,
  "15d": 15,
  "30d": 30,
}

export interface PlanEstimate {
  moduleCount: number
  totalHours: number
  /** Calendar days needed at the chosen daily hours. */
  daysNeeded: number
  targetDays: number
  /** Hours per day required to finish within the target. */
  requiredHoursPerDay: number
  fits: boolean
}

/**
 * Transparent estimate over the modules a learner would study by default (core
 * and recommended for the chosen roles), using each module's derived minutes at
 * the chosen experience. Estimates are guidance, not measurements. The full
 * builder (features/curriculum) uses the same minutes and adds the learner's
 * own selections.
 */
export function estimatePlan(input: {
  roleIds: string[]
  dailyHours: number
  targetDays: number
  experience?: ProfileExperience
}): PlanEstimate {
  const entries = resolveSyllabus({
    defaults: defaultsForRoles(input.roleIds),
    overrides: {},
    experience: input.experience ?? "fresher",
  }).filter((e) => e.selected)
  return estimateFromMinutes({
    ...input,
    moduleCount: entries.length,
    totalMinutes: entries.reduce((n, e) => n + e.minutes, 0),
  })
}

/** Same estimate for an explicit minute total, such as a Study Path roadmap's syllabus. */
export function estimateFromMinutes(input: {
  moduleCount: number
  totalMinutes: number
  dailyHours: number
  targetDays: number
}): PlanEstimate {
  const totalHours = Math.round(input.totalMinutes / 60)
  const daysNeeded =
    input.dailyHours > 0
      ? Math.ceil(input.totalMinutes / (input.dailyHours * 60))
      : Infinity
  const targetDays = Math.max(1, input.targetDays)
  const requiredHoursPerDay =
    Math.round((input.totalMinutes / 60 / targetDays) * 10) / 10
  return {
    moduleCount: input.moduleCount,
    totalHours,
    daysNeeded,
    targetDays,
    requiredHoursPerDay,
    fits: daysNeeded <= targetDays,
  }
}

/** Resolve a preset (or custom date) to a concrete target date key. */
export function resolveTargetDate(
  preset: TargetPreset,
  customDate: string | null,
  today: Date = new Date()
): string | null {
  if (preset === "custom") return customDate
  return toDateKey(addDays(today, PRESET_DAYS[preset]))
}

export function daysUntil(dateKey: string, today: Date = new Date()): number {
  return daysBetweenKeys(toDateKey(today), dateKey)
}
