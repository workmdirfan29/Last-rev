import { describe, expect, it } from "vitest"
import { buildSummary } from "./summary"
import {
  learnerProfileSchema,
  type ActivityEntry,
  type QuestionProgress,
} from "@/types/learner"
import type { QuestionIndexEntry } from "@/types/content"

const NOW = new Date(2026, 10, 2, 12, 0) // local noon, 2 Nov 2026
const iso = (d: Date) => d.toISOString()

const q = (id: string, moduleId: string, topic = "T"): QuestionIndexEntry => ({
  id,
  moduleId,
  level: "fresher",
  topic,
  difficulty: "easy",
  title: `Title for ${id}`,
  keywords: ["k"],
  estimatedMinutes: 3,
})
const index = [
  q("react.fresher.a", "react"),
  q("react.fresher.b", "react", "Lists"),
  q("react.fresher.c", "react", "Lists"),
  q("sql.fresher.a", "sql"),
  q("python-oop.fresher.a", "python-oop"),
]
const profile = learnerProfileSchema.parse({
  updatedAt: iso(NOW),
  selectedRoles: ["frontend-developer"],
  primaryRole: "frontend-developer",
  dailyStudyHours: 2,
})
const p = (
  questionId: string,
  over: Partial<QuestionProgress> = {}
): QuestionProgress => ({
  questionId,
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
  updatedAt: iso(NOW),
  ...over,
})
const act = (
  date: string,
  minutes: number,
  id = date + minutes
): ActivityEntry => ({
  id,
  type: "question",
  date,
  minutes,
  at: iso(NOW),
})

describe("buildSummary", () => {
  it("scopes to the modules of the learner's selected roles", () => {
    const s = buildSummary({
      profile,
      progress: {},
      activity: [],
      index,
      now: NOW,
    })
    // frontend-developer includes react but not sql or python-oop
    expect(s.totalQuestions).toBe(3)
    expect(s.modules.map((m) => m.moduleId)).toEqual(["react"])
    expect(s.completed).toBe(0)
  })

  it("returns an honest empty state for a new learner", () => {
    const s = buildSummary({
      profile,
      progress: {},
      activity: [],
      index,
      now: NOW,
    })
    expect(s.streak.current).toBe(0)
    expect(s.minutesToday).toBe(0)
    expect(s.week).toHaveLength(7)
    expect(s.week.every((d) => d.minutes === 0)).toBe(true)
    expect(s.startQuestion?.id).toBe("react.fresher.a")
    expect(s.continueQuestion?.id).toBe("react.fresher.a")
  })

  it("counts completion, flags and readiness from real progress", () => {
    const progress = {
      "react.fresher.a": p("react.fresher.a", {
        completed: true,
        confidence: 5,
        lastStudiedAt: iso(NOW),
      }),
      "react.fresher.b": p("react.fresher.b", { difficult: true }),
    }
    const s = buildSummary({ profile, progress, activity: [], index, now: NOW })
    expect(s.completed).toBe(1)
    expect(s.flagged).toBe(1)
    expect(s.lastStudiedId).toBe("react.fresher.a")
    expect(s.continueQuestion?.id).toBe("react.fresher.b")
    expect(s.startQuestion).toBeNull()
  })

  it("lists due reviews oldest first", () => {
    const progress = {
      "react.fresher.a": p("react.fresher.a", {
        completed: true,
        nextReviewAt: "2026-11-01T00:00:00.000Z",
      }),
      "react.fresher.b": p("react.fresher.b", {
        completed: true,
        nextReviewAt: "2026-10-30T00:00:00.000Z",
      }),
      "react.fresher.c": p("react.fresher.c", {
        completed: true,
        nextReviewAt: "2026-12-01T00:00:00.000Z",
      }),
    }
    const s = buildSummary({ profile, progress, activity: [], index, now: NOW })
    expect(s.dueReviews.map((d) => d.id)).toEqual([
      "react.fresher.b",
      "react.fresher.a",
    ])
  })

  it("groups weak topics by low confidence or difficult flag", () => {
    const progress = {
      "react.fresher.a": p("react.fresher.a", { confidence: 5 }),
      "react.fresher.b": p("react.fresher.b", { confidence: 2 }),
      "react.fresher.c": p("react.fresher.c", { difficult: true }),
    }
    const s = buildSummary({ profile, progress, activity: [], index, now: NOW })
    expect(s.weakTopics).toEqual([
      { moduleId: "react", topic: "Lists", count: 2 },
    ])
  })

  it("builds a 7-day window, minutes today and streak from activity", () => {
    const activity = [
      act("2026-11-02", 10),
      act("2026-11-02", 5, "x"),
      act("2026-11-01", 20),
      act("2026-10-31", 3),
    ]
    const s = buildSummary({ profile, progress: {}, activity, index, now: NOW })
    expect(s.minutesToday).toBe(15)
    expect(s.dailyTargetMinutes).toBe(120)
    expect(s.week[6]).toEqual({ date: "2026-11-02", minutes: 15, items: 2 })
    expect(s.week[0].date).toBe("2026-10-27")
    expect(s.streak.current).toBe(3)
  })

  it("handles a learner with no profile", () => {
    const s = buildSummary({
      profile: null,
      progress: {},
      activity: [],
      index,
      now: NOW,
    })
    expect(s.totalQuestions).toBe(0)
  })
})
