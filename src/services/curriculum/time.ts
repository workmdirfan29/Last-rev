import {
  EXPERIENCE_MULTIPLIER,
  PRACTICE_REVISION_ALLOWANCE,
} from "@/data/curriculum/time-model"
import type { CatalogModule } from "@/data/catalog/module-types"
import type { ProfileExperience } from "@/types/learner"

/** Sum of the authored topic minutes (a fresher's pace, before practice and revision). */
export const topicMinutes = (m: CatalogModule): number =>
  m.topicList.reduce((sum, t) => sum + t.minutes, 0)

/**
 * Planning minutes for a module: topics, plus the practice and revision
 * allowance, scaled for experience. A learner's own figure replaces it.
 */
export function moduleMinutes(
  m: CatalogModule,
  experience: ProfileExperience,
  customizedMinutes?: number
): number {
  if (customizedMinutes !== undefined)
    return Math.max(0, Math.round(customizedMinutes))
  return Math.round(
    topicMinutes(m) *
      (1 + PRACTICE_REVISION_ALLOWANCE) *
      EXPERIENCE_MULTIPLIER[experience]
  )
}

export const toHours = (minutes: number): number =>
  Math.round((minutes / 60) * 10) / 10
