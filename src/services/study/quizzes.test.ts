import { describe, expect, it } from "vitest"
import {
  MODULE_QUIZ_ITEMS,
  PHASE_QUIZ_ITEMS,
  PHASE_QUIZ_MIN_POOL,
} from "@/config/study"
import { phasesOf } from "@/data/catalog/phases"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import type { QuestionProgress, QuizAttempt } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { moduleQuizInfo, phaseQuizInfo, quizPath } from "./quizzes"
import { resolvePhases } from "./roadmap"

const lesson = (
  slug: string,
  order: number,
  checks: number,
  topic = "Basics"
): StudyLessonIndexEntry => ({
  id: `lesson.java-core.${slug}`,
  moduleId: "java-core",
  slug,
  file: `java-core/0${order}-${slug}`,
  order,
  title: slug,
  topic,
  topicId: "t",
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
const done = (id: string) => ({
  [id]: { questionId: id, completed: true } as QuestionProgress,
})
const attempt = (
  quizId: string,
  correct: number,
  total: number
): QuizAttempt => ({
  id: `a-${quizId}-${correct}`,
  quizId,
  kind: "module",
  takenAt: "2026-11-04T09:00:00.000Z",
  seed: 1,
  total,
  correct,
  passMark: 0.7,
  passed: correct / total >= 0.7,
  items: [],
})

describe("module quizzes", () => {
  it("are available once the lessons hold enough items, sized to the pool, and say what is missing otherwise", () => {
    const few = moduleQuizInfo(
      "java-core",
      "Core Java",
      [lesson("a", 1, 4)],
      {},
      []
    )
    expect(few).toMatchObject({
      pool: 4,
      size: 4,
      available: false,
      missing: 2,
      id: "module.java-core",
    })
    const enough = moduleQuizInfo(
      "java-core",
      "Core Java",
      [lesson("a", 1, 4), lesson("b", 2, 4)],
      {},
      []
    )
    expect(enough).toMatchObject({
      pool: 8,
      size: 8,
      available: true,
      missing: 0,
    })
    const big = moduleQuizInfo(
      "java-core",
      "Core Java",
      [lesson("a", 1, 6), lesson("b", 2, 6), lesson("c", 3, 6)],
      {},
      []
    )
    expect(big.size).toBe(MODULE_QUIZ_ITEMS)
    expect(moduleQuizInfo("java-core", "Core Java", [], {}, [])).toMatchObject({
      pool: 0,
      available: false,
      suggested: false,
    })
  })
  it("carries the attempt history, and suggests a quiz once 60% of its lessons are finished", () => {
    const lessons = [
      lesson("a", 1, 4),
      lesson("b", 2, 4),
      lesson("c", 3, 4),
      lesson("d", 4, 4),
      lesson("e", 5, 4),
    ]
    const progress = {
      ...done("lesson.java-core.a"),
      ...done("lesson.java-core.b"),
    }
    expect(
      moduleQuizInfo("java-core", "Core Java", lessons, progress, []).suggested
    ).toBe(false)
    const three = { ...progress, ...done("lesson.java-core.c") }
    const q = moduleQuizInfo("java-core", "Core Java", lessons, three, [
      attempt("module.java-core", 15, 20),
      attempt("module.java-core", 9, 20),
    ])
    expect(q.suggested).toBe(true)
    expect(q.summary.passed).toBe(true)
    expect(q.summary.attempts).toHaveLength(2)
  })
  it("has a route", () => {
    expect(quizPath({ kind: "module", id: "module.java-core" })).toBe(
      "/study/quiz/module/java-core"
    )
  })
})

describe("phase quizzes", () => {
  const entries = resolveSyllabus({
    defaults: defaultsForRoadmap("java-full-stack-ai"),
    overrides: {},
    experience: "fresher",
    scope: "study",
  })
  const views = resolvePhases(phasesOf("java-full-stack-ai"), entries)
  it("draw from the phase's lessons only, need the minimum pool, and are sized to the usual 20 at most", () => {
    const p1 = phaseQuizInfo(
      views[0],
      [lesson("a", 1, 5), lesson("b", 2, 5)],
      {},
      []
    )
    expect(p1).toMatchObject({
      pool: 10,
      available: false,
      missing: PHASE_QUIZ_MIN_POOL - 10,
      id: "phase.java-full-stack-ai.1",
    })
    const many = Array.from({ length: 6 }, (_, i) => lesson(`l${i}`, i + 1, 5))
    const q = phaseQuizInfo(views[0], many, {}, [])
    expect(q).toMatchObject({
      pool: 30,
      available: true,
      size: PHASE_QUIZ_ITEMS,
    })
    // lessons of other phases do not count
    const other = phaseQuizInfo(views[1], many, {}, [])
    expect(other.pool).toBe(0)
    expect(quizPath(q)).toBe("/study/quiz/phase/1")
  })
})
