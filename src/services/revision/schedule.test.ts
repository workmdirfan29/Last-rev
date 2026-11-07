import { describe, expect, it } from "vitest"
import { isDue, recordReview, scheduleFirstReview } from "./schedule"

const INTERVALS = [1, 3, 7, 14, 30]
const NOW = new Date("2026-11-02T10:00:00.000Z")
const daysFromNow = (n: number) =>
  new Date(NOW.getTime() + n * 86_400_000).toISOString()

describe("spaced repetition", () => {
  it("schedules the first review at the first interval", () => {
    expect(scheduleFirstReview(INTERVALS, NOW)).toEqual({
      revisionStage: 0,
      nextReviewAt: daysFromNow(1),
    })
  })

  it("advances one interval on confident recall", () => {
    expect(recordReview(0, 4, INTERVALS, NOW)).toEqual({
      revisionStage: 1,
      nextReviewAt: daysFromNow(3),
    })
    expect(recordReview(2, 3, INTERVALS, NOW).nextReviewAt).toBe(
      daysFromNow(14)
    )
  })

  it("resets to the first interval on shaky recall", () => {
    expect(recordReview(3, 2, INTERVALS, NOW)).toEqual({
      revisionStage: 0,
      nextReviewAt: daysFromNow(1),
    })
  })

  it("graduates after the final interval", () => {
    expect(recordReview(4, 5, INTERVALS, NOW)).toEqual({
      revisionStage: 5,
      nextReviewAt: null,
    })
  })

  it("respects custom intervals", () => {
    expect(scheduleFirstReview([2, 5], NOW).nextReviewAt).toBe(daysFromNow(2))
  })

  it("reports due items", () => {
    expect(isDue({ nextReviewAt: daysFromNow(-1) }, NOW)).toBe(true)
    expect(isDue({ nextReviewAt: daysFromNow(0) }, NOW)).toBe(true)
    expect(isDue({ nextReviewAt: daysFromNow(2) }, NOW)).toBe(false)
    expect(isDue({ nextReviewAt: null }, NOW)).toBe(false)
  })
})
