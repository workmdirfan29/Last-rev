import { describe, expect, it } from "vitest"
import type { ActivityEntry, QuestionProgress } from "@/types/learner"
import {
  activityByType,
  confidenceDistribution,
  snapshotFor,
  streakRuns,
  weakAndAverage,
  weeklyMinutes,
  weekStart,
} from "./analytics"

const act = (
  date: string,
  type: ActivityEntry["type"],
  minutes: number
): ActivityEntry => ({
  id: `${date}${type}${minutes}`,
  type,
  refId: "r",
  date,
  minutes,
  at: `${date}T09:00:00.000Z`,
})
const prog = (
  id: string,
  over: Partial<QuestionProgress> = {}
): QuestionProgress => ({
  questionId: id,
  completed: false,
  bookmarked: false,
  difficult: false,
  revision: false,
  confidence: 0,
  note: "",
  attempts: 0,
  revisionStage: 0,
  nextReviewAt: null,
  completedAt: null,
  removed: false,
  lastStudiedAt: null,
  updatedAt: "2026-11-04T09:00:00.000Z",
  ...over,
})

describe("analytics selectors", () => {
  it("study minutes by Monday week over 12 weeks, nothing at all without activity", () => {
    expect(weeklyMinutes([], "2026-11-04")).toEqual([])
    const w = weeklyMinutes(
      [
        act("2026-11-03", "question", 10),
        act("2026-11-04", "lesson", 20),
        act("2026-10-27", "question", 5),
        act("2025-01-01", "question", 99),
      ],
      "2026-11-04"
    )
    expect(w).toHaveLength(12)
    expect(w.at(-1)).toEqual({ weekStart: "2026-11-02", minutes: 30, items: 2 })
    expect(w.at(-2)).toMatchObject({ weekStart: "2026-10-26", minutes: 5 })
    expect(w.reduce((n, x) => n + x.minutes, 0)).toBe(35) // an old entry outside the window is not counted
    expect(weekStart("2026-11-08")).toBe("2026-11-02")
  })
  it("activity by type, most minutes first", () => {
    expect(
      activityByType([
        act("2026-11-03", "question", 10),
        act("2026-11-04", "lesson", 20),
        act("2026-11-04", "question", 5),
      ])
    ).toEqual([
      { type: "lesson", items: 1, minutes: 20 },
      { type: "question", items: 2, minutes: 15 },
    ])
  })
  it("streak runs, newest first", () => {
    expect(
      streakRuns([
        "2026-11-01",
        "2026-11-02",
        "2026-11-04",
        "2026-11-05",
        "2026-11-06",
        "2026-11-04",
      ])
    ).toEqual([
      { start: "2026-11-04", end: "2026-11-06", days: 3 },
      { start: "2026-11-01", end: "2026-11-02", days: 2 },
    ])
    expect(streakRuns([])).toEqual([])
  })
  it("confidence distribution counts only question records, and unrated studied ones apart", () => {
    const d = confidenceDistribution({
      a: prog("react.fresher.a", { confidence: 5 }),
      b: prog("react.fresher.b", { confidence: 5 }),
      c: prog("react.fresher.c", { confidence: 2 }),
      d: prog("react.fresher.d", { completed: true }),
      e: prog("react.fresher.e"),
      f: prog("lesson.react.x", { confidence: 4, completed: true }),
      g: prog("react.fresher.g", { confidence: 3, removed: true }),
    })
    expect(d.rated).toEqual([0, 1, 0, 0, 2])
    expect(d.unrated).toBe(1)
  })
  it("weak questions and the average rating", () => {
    const w = weakAndAverage({
      a: prog("x.fresher.a", { confidence: 1 }),
      b: prog("x.fresher.b", { difficult: true, confidence: 5 }),
      c: prog("x.fresher.c", { confidence: 4 }),
    })
    expect(w).toEqual({ weakTopics: 2, averageConfidence: 3.33 })
    expect(weakAndAverage({}).averageConfidence).toBeNull()
  })
  it("a snapshot is keyed by the Monday of its week", () => {
    expect(
      snapshotFor(41, {}, "2026-11-04", new Date("2026-11-04T10:00:00.000Z"))
    ).toMatchObject({
      id: "2026-11-02",
      overall: 41,
      weakTopics: 0,
      averageConfidence: null,
    })
  })
})
