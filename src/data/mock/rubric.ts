/**
 * The mock interview scoring rubric: the ONE place dimensions, weights and thresholds are defined. A session
 * stores a snapshot of this at the moment it starts, so an old session always recomputes to the same number
 * even after these values change. Every number in the score is a rating the learner gave themselves.
 */
export const RUBRIC_VERSION = 1

export type RubricKind = "technical" | "hr"

export interface RubricDimension {
  id: string
  label: string
  /** Weight in the score; the weights of one kind add up to 100. */
  weight: number
  /** What the learner's own rating means: shown next to the buttons at rating time. */
  anchors: { low: string; mid: string; high: string }
}

const ACCURACY: RubricDimension = {
  id: "accuracy",
  label: "Technical accuracy",
  weight: 30,
  anchors: {
    low: "Mostly different from the model answer",
    mid: "Partly matches it",
    high: "Matches it",
  },
}
const COMPLETENESS = (weight: number): RubricDimension => ({
  id: "completeness",
  label: "Completeness",
  weight,
  anchors: {
    low: "Left out most of what the model answer covers",
    mid: "Covered about half",
    high: "Covered nearly all of it",
  },
})
const COMMUNICATION = (weight: number): RubricDimension => ({
  id: "communication",
  label: "Communication",
  weight,
  anchors: {
    low: "Hard to follow",
    mid: "Understandable, with some unclear parts",
    high: "Clear and easy to follow",
  },
})
const CONFIDENCE: RubricDimension = {
  id: "confidence",
  label: "Confidence",
  weight: 10,
  anchors: {
    low: "I was guessing",
    mid: "Fairly sure",
    high: "I was sure",
  },
}

export const RUBRIC_DIMENSIONS: Record<RubricKind, readonly RubricDimension[]> =
  {
    technical: [
      ACCURACY,
      COMPLETENESS(20),
      {
        id: "practical",
        label: "Practical understanding",
        weight: 15,
        anchors: {
          low: "Only a definition, no example or use",
          mid: "Some practical context",
          high: "Explained how and when it is used",
        },
      },
      COMMUNICATION(15),
      {
        id: "structure",
        label: "Answer structure",
        weight: 10,
        anchors: {
          low: "No clear order",
          mid: "Some order",
          high: "A clear beginning, middle and end",
        },
      },
      CONFIDENCE,
    ],
    hr: [
      {
        id: "structure",
        label: "Answer structure (STAR)",
        weight: 25,
        anchors: {
          low: "No clear situation, action or result",
          mid: "Some of the STAR parts",
          high: "All four parts, in order",
        },
      },
      COMPLETENESS(25),
      COMMUNICATION(20),
      {
        id: "example",
        label: "Specific example",
        weight: 20,
        anchors: {
          low: "General statements only",
          mid: "A vague example",
          high: "One specific, true example",
        },
      },
      CONFIDENCE,
    ],
  }

/** The optional text-match line. Off by default; when on it is one named line in the formula. */
export const KEYWORD_COVERAGE = {
  id: "keywords",
  label: "Keyword coverage (text match)",
  weight: 10,
} as const

/** Module-level labels: at or above is a strong area, below is a weak area; fewer rated questions is "not enough answers". */
export const STRONG_AT = 75
export const WEAK_BELOW = 50
export const MIN_RATED_PER_MODULE = 2

export const SCORE_CAPTION =
  "This score reflects how you rated yourself against the model answers. It is not an assessment of correctness."
export const KEYWORD_CAPTION = "text match only, it cannot judge correctness"
