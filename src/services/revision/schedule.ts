import { addDays } from "date-fns"
import type { QuestionProgress } from "@/types/learner"

/**
 * Spaced repetition with learner-configurable intervals (default 1/3/7/14/30
 * days). Deliberately simple and explainable — no hidden ease factors.
 */

export interface ReviewSchedule {
  revisionStage: number
  nextReviewAt: string | null
}

/** Schedule the first review when a question is completed. */
export function scheduleFirstReview(
  intervals: number[],
  from: Date
): ReviewSchedule {
  return {
    revisionStage: 0,
    nextReviewAt: addDays(from, intervals[0]).toISOString(),
  }
}

/**
 * Record a review outcome. Confident recall (>= 3) advances to the next
 * interval; shaky recall sends the item back to the first interval. Passing
 * the last interval graduates the item (no further reviews).
 */
export function recordReview(
  stage: number,
  confidence: number,
  intervals: number[],
  from: Date
): ReviewSchedule {
  if (confidence < 3) return scheduleFirstReview(intervals, from)
  const next = stage + 1
  if (next >= intervals.length)
    return { revisionStage: next, nextReviewAt: null }
  return {
    revisionStage: next,
    nextReviewAt: addDays(from, intervals[next]).toISOString(),
  }
}

export function isDue(
  p: Pick<QuestionProgress, "nextReviewAt">,
  now: Date
): boolean {
  return (
    p.nextReviewAt !== null &&
    new Date(p.nextReviewAt).getTime() <= now.getTime()
  )
}
