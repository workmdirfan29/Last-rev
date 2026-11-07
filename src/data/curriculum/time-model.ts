import type { ProfileExperience } from "@/types/learner"

/**
 * The one place the time model lives. Every number here is a planning
 * estimate, not a measurement, and the UI says so.
 *
 * module minutes = sum(topic minutes) x (1 + PRACTICE_REVISION_ALLOWANCE) x EXPERIENCE_MULTIPLIER
 * A learner can override a module's minutes; the override replaces this total.
 */

/** Extra time on top of the topics for exercises, coding practice and revision. */
export const PRACTICE_REVISION_ALLOWANCE = 0.25

/** Topic minutes are authored for a fresher (0 to 6 months), so that is the 1.0 baseline. */
export const EXPERIENCE_MULTIPLIER: Record<ProfileExperience, number> = {
  beginner: 1.25,
  fresher: 1,
  intermediate: 0.8,
  advanced: 0.65,
}

export const TIME_MODEL_NOTE =
  "Planning estimate: authored topic minutes, plus 25% for practice and revision, scaled for your experience. Adjust any module to your own pace."
