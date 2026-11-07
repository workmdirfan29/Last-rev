import { describe, expect, it, vi } from "vitest"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { computeReadiness } from "@/services/analytics/readiness"
import type { QuestionIndexEntry, SkillArea } from "@/types/content"
import {
  blankEnglishState,
  type HrAnswer,
  type MockSession,
  type QuestionProgress,
  type QuizAttempt,
} from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { topicIdOf } from "@/utils/topic-id"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { computeCategoryReadiness, type ReadinessInput } from "./categories"

const mock = vi.hoisted(() => ({
  modules: [] as {
    moduleId: string
    asked: number
    rated: number
    mean: number | null
    status: string
  }[],
}))
vi.mock("@/services/mock/score", async (orig) => ({
  ...(await orig<typeof import("@/services/mock/score")>()),
  scoreSession: () => ({ modules: mock.modules }),
}))

const q = (moduleId: string, n: number): QuestionIndexEntry => ({
  id: `${moduleId}.fresher.q${n}`,
  moduleId,
  level: "fresher",
  topic: "t",
  difficulty: "easy",
  title: `Question ${n} of ${moduleId}`,
  keywords: ["k"],
  estimatedMinutes: 3,
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
const lesson = (
  moduleId: string,
  slug: string,
  topic: string,
  checks = 4
): StudyLessonIndexEntry => ({
  id: `lesson.${moduleId}.${slug}`,
  moduleId,
  slug,
  file: `${moduleId}/01-${slug}`,
  order: 1,
  title: slug,
  topic,
  topicId: topicIdOf(moduleId, topic),
  minutes: 30,
  overview: "o",
  objectives: 2,
  check: Array.from({ length: checks }, (_, i) => ({
    id: `c${i}`,
    type: "single" as const,
  })),
  assignment: { checklist: 3, minutes: 10 },
  exercises: [],
  prerequisites: [],
  resources: 1,
})
const base = (over: Partial<ReadinessInput> = {}): ReadinessInput => ({
  selectedModules: new Set(["react", "sql", "java-core", "git"]),
  index: [],
  progress: {},
  lessons: [],
  attempts: [],
  mockSessions: [],
  english: null,
  hrAnswers: [],
  excluded: [],
  ...over,
})
const cat = (r: ReturnType<typeof computeCategoryReadiness>, id: string) =>
  r.categories.find((c) => c.category.id === id)!

describe("a questions-only learner gets today's numbers", () => {
  // modules that sit in exactly one category, so the old per-area model and the new one count the same questions
  const modules = ["react", "sql", "java-core", "git"]
  const index = modules.flatMap((m) =>
    Array.from({ length: 10 }, (_, i) => q(m, i))
  )
  const progress = Object.fromEntries(
    index.flatMap((x, i) =>
      i % 3 === 0
        ? [[x.id, prog(x.id, { completed: true, confidence: (i % 5) + 1 })]]
        : i % 3 === 1
          ? [[x.id, prog(x.id, { confidence: 2 })]]
          : []
    )
  )
  it("equals computeReadiness overall and per category", () => {
    const old = computeReadiness(
      modules.map((m) => {
        const mine = index.filter((x) => x.moduleId === m)
        return {
          area: MODULE_BY_ID.get(m)!.skillArea as SkillArea,
          total: mine.length,
          completed: mine.filter((x) => progress[x.id]?.completed).length,
          confidenceSum: mine.reduce(
            (n, x) => n + (progress[x.id]?.confidence ?? 0),
            0
          ),
        }
      })
    )
    const now = computeCategoryReadiness(base({ index, progress }))
    expect(now.overall).toBe(old.overall)
    expect(now.included).toBe(4)
    for (const a of old.areas) {
      const id = {
        programming: "programming-fundamentals",
        frontend: "frontend",
        database: "database",
        git: "git",
      }[a.area as string]!
      expect(cat(now, id).score).toBeCloseTo(a.score, 10)
    }
  })
})

describe("what counts", () => {
  it("shows 'no content' for categories without anything, and leaves them out of the overall", () => {
    const r = computeCategoryReadiness(
      base({ index: Array.from({ length: 4 }, (_, i) => q("react", i)) })
    )
    expect(cat(r, "frontend")).toMatchObject({
      hasContent: true,
      included: true,
    })
    expect(cat(r, "database")).toMatchObject({
      hasContent: false,
      included: false,
      score: null,
      questions: null,
    })
    expect(r.included).toBe(1)
    expect(computeCategoryReadiness(base()).overall).toBeNull()
  })

  it("counts only the modules in the learner's syllabus, never removed questions", () => {
    const index = [q("react", 1), q("react", 2), q("sql", 1)]
    const r = computeCategoryReadiness(
      base({
        index,
        selectedModules: new Set(["react"]),
        progress: { [index[1].id]: prog(index[1].id, { removed: true }) },
      })
    )
    expect(cat(r, "frontend").questions).toMatchObject({ total: 1 })
    expect(cat(r, "database").selected).toBe(false)
    expect(cat(r, "database").included).toBe(false)
  })

  it("lets the learner switch a category off, and leaves it out of the overall", () => {
    const index = [q("react", 1), q("sql", 1)]
    const on = computeCategoryReadiness(
      base({
        index,
        progress: {
          [index[0].id]: prog(index[0].id, { completed: true, confidence: 5 }),
        },
      })
    )
    const off = computeCategoryReadiness(
      base({
        index,
        progress: {
          [index[0].id]: prog(index[0].id, { completed: true, confidence: 5 }),
        },
        excluded: ["database"],
      })
    )
    expect(cat(off, "database")).toMatchObject({
      excluded: true,
      included: false,
    })
    expect(off.overall).toBe(100)
    expect(on.overall).toBe(50)
  })

  it("adds lessons, quizzes and assignments as equal parts, each with raw counts", () => {
    const lessons = [
      lesson("react", "a", "Components"),
      lesson("react", "b", "Components"),
    ]
    const progress = {
      "lesson.react.a": prog("lesson.react.a", { completed: true }),
      "task.react.a.1": prog("task.react.a.1", { completed: true }),
    }
    const attempts: QuizAttempt[] = [
      {
        id: "a1",
        quizId: "lesson.react.a",
        kind: "lesson",
        takenAt: "2026-11-04T09:00:00.000Z",
        seed: 1,
        total: 4,
        correct: 4,
        passMark: 0.7,
        passed: true,
        items: [],
      },
    ]
    const r = computeCategoryReadiness(base({ lessons, progress, attempts }))
    const f = cat(r, "frontend")
    expect(f.lessons).toEqual({ ready: 2, finished: 1 })
    expect(f.assignments).toEqual({ done: 1, total: 6 })
    expect(f.quizzes).toMatchObject({ passed: 1 })
    expect(f.questions).toBeNull()
    expect(f.score).toBeCloseTo((1 / 2 + 1 / 6 + 1 / f.quizzes!.total) / 3)
  })

  it("counts a module that is in two categories in both", () => {
    const index = [q("backend-architecture", 1), q("backend-architecture", 2)]
    const r = computeCategoryReadiness(
      base({ index, selectedModules: new Set(["backend-architecture"]) })
    )
    expect(cat(r, "backend").questions!.total).toBe(2)
    expect(cat(r, "system-design").questions!.total).toBe(2)
  })

  it("counts mock interview results from finished sessions only, with the learner's own ratings, per module", () => {
    mock.modules = [
      { moduleId: "react", asked: 4, rated: 4, mean: 60, status: "middle" },
      { moduleId: "sql", asked: 2, rated: 2, mean: 80, status: "strong" },
    ]
    const finished = { status: "finished" } as MockSession
    const abandoned = { status: "abandoned" } as MockSession
    const r = computeCategoryReadiness(base({ mockSessions: [finished] }))
    expect(cat(r, "frontend").mock).toMatchObject({
      sessions: 1,
      rated: 4,
      mean: 60,
    })
    expect(cat(r, "database").mock).toMatchObject({ rated: 2, mean: 80 })
    expect(cat(r, "technical-interview").mock).toMatchObject({ rated: 6 }) // every module
    expect(cat(r, "frontend").score).toBeCloseTo(0.6)
    expect(
      cat(
        computeCategoryReadiness(base({ mockSessions: [abandoned] })),
        "frontend"
      ).mock
    ).toBeNull()
    mock.modules = []
  })

  it("counts HR answers saved, and puts the 20 HR modules in HR preparation only", () => {
    const answers = [
      { id: "a", questionId: "hr-teamwork.fresher.story" },
      { id: "b", questionId: "react.fresher.x" },
    ] as HrAnswer[]
    const r = computeCategoryReadiness(
      base({
        selectedModules: new Set(["hr-teamwork"]),
        hrAnswers: answers,
        index: [q("hr-teamwork", 1)],
      })
    )
    expect(cat(r, "hr-preparation").hrAnswers).toBe(1)
    expect(cat(r, "hr-preparation").questions!.total).toBe(1)
  })

  it("includes resume and project questions in Technical interview preparation, and Spoken English once the learner has started it", () => {
    const index = [q("resume-project", 1), q("project-questions", 1)]
    const r = computeCategoryReadiness(
      base({ index, selectedModules: new Set(["project-questions"]) })
    )
    expect(cat(r, "technical-interview").questions!.total).toBe(2)
    expect(cat(r, "technical-interview").included).toBe(true)
    // Spoken English: content exists (lessons), but it is selected only when started
    const notStarted = cat(computeCategoryReadiness(base()), "spoken-english")
    expect(notStarted.english).not.toBeNull()
    expect(notStarted).toMatchObject({ selected: false, included: false })
    const started = cat(
      computeCategoryReadiness(
        base({ english: blankEnglishState("2026-11-04T09:00:00.000Z") })
      ),
      "spoken-english"
    )
    expect(started).toMatchObject({ selected: true, included: true })
    expect(started.english!.lessonsReady).toBe(ENGLISH_INDEX.length)
    expect(started.score).toBe(0)
  })
})
