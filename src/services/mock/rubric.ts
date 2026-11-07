import {
  KEYWORD_COVERAGE,
  MIN_RATED_PER_MODULE,
  RUBRIC_DIMENSIONS,
  RUBRIC_VERSION,
  STRONG_AT,
  WEAK_BELOW,
  type RubricKind,
} from "@/data/mock/rubric"
import type { RubricSnapshot } from "@/types/learner"

/** The current rubric, copied into a session when it starts. */
export function currentRubric(): RubricSnapshot {
  return {
    version: RUBRIC_VERSION,
    kinds: Object.fromEntries(
      Object.entries(RUBRIC_DIMENSIONS).map(([kind, dims]) => [
        kind,
        dims.map(({ id, label, weight }) => ({ id, label, weight })),
      ])
    ),
    keywordWeight: KEYWORD_COVERAGE.weight,
    strongAt: STRONG_AT,
    weakBelow: WEAK_BELOW,
    minRated: MIN_RATED_PER_MODULE,
  }
}

export const kindOfModule = (moduleId: string): RubricKind =>
  moduleId.startsWith("hr-") ? "hr" : "technical"
