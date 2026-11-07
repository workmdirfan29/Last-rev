import { describe, expect, it } from "vitest"
import { PASS_MARK } from "@/config/study"
import { defineLesson } from "@/data/lessons/author"
import type { AuthoredStudyLesson, CheckItem } from "@/types/lesson"
import {
  buildLessonQuiz,
  buildQuiz,
  checkStatusText,
  correctAnswerText,
  gradeItem,
  makeAttempt,
  scorePercent,
  summariseAttempts,
} from "./quiz"

const single: CheckItem = {
  type: "single",
  id: "s",
  prompt: "p",
  options: ["a", "b", "c"],
  answer: 1,
  explanation: "e",
}
const multi: CheckItem = {
  type: "multi",
  id: "m",
  prompt: "p",
  options: ["a", "b", "c", "d"],
  answers: [0, 2],
  explanation: "e",
}
const tf: CheckItem = {
  type: "truefalse",
  id: "t",
  statement: "s",
  answer: false,
  explanation: "e",
}
const blank: CheckItem = {
  type: "blank",
  id: "b",
  prompt: "A ___ here",
  answer: "Class",
  accepted: ["klass"],
  caseSensitive: false,
  explanation: "e",
}
const strict: CheckItem = { ...blank, id: "b2", caseSensitive: true }
const output: CheckItem = {
  type: "output",
  id: "o",
  prompt: "What does this print?",
  code: { language: "java", code: "x" },
  options: ["1", "2", "3"],
  answer: 2,
  explanation: "e",
}

describe("grading is exact", () => {
  it("single and output: the one correct option", () => {
    expect(gradeItem(single, 1)).toBe(true)
    expect(gradeItem(single, 0)).toBe(false)
    expect(gradeItem(output, 2)).toBe(true)
    expect(gradeItem(single, null)).toBe(false)
    expect(gradeItem(single, "1")).toBe(false)
  })
  it("multi: all-or-nothing, order does not matter", () => {
    expect(gradeItem(multi, [2, 0])).toBe(true)
    expect(gradeItem(multi, [0])).toBe(false)
    expect(gradeItem(multi, [0, 2, 3])).toBe(false)
    expect(gradeItem(multi, [])).toBe(false)
  })
  it("true/false", () => {
    expect(gradeItem(tf, false)).toBe(true)
    expect(gradeItem(tf, true)).toBe(false)
  })
  it("blank: ignores case and extra spaces unless case sensitive, accepts the listed variants, never an empty answer", () => {
    expect(gradeItem(blank, "  class ")).toBe(true)
    expect(gradeItem(blank, "KLASS")).toBe(true)
    expect(gradeItem(blank, "clas")).toBe(false)
    expect(gradeItem(blank, "   ")).toBe(false)
    expect(gradeItem(strict, "class")).toBe(false)
    expect(gradeItem(strict, "Class")).toBe(true)
  })
  it("shows the correct answer as text", () => {
    expect(correctAnswerText(single)).toBe("b")
    expect(correctAnswerText(multi)).toBe("a; c")
    expect(correctAnswerText(tf)).toBe("False")
    expect(correctAnswerText(blank)).toBe("Class")
  })
})

const lessonOf = (slug: string, n: number) => {
  const base: AuthoredStudyLesson = {
    slug,
    title: `Lesson ${slug}`,
    topic: "Basics",
    minutes: 30,
    overview: "o",
    objectives: ["a", "b"],
    sections: [
      { kind: "explain", heading: "h", body: ["b"] },
      { kind: "mistakes", items: [{ mistake: "m", fix: "f" }] },
      { kind: "practical", heading: "h", scenario: "s", body: ["b"] },
    ],
    check: Array.from({ length: n }, (_, i) => ({
      ...single,
      id: `${slug}-${i}`,
      prompt: `${slug} q${i}`,
    })),
    assignment: {
      title: "t",
      task: ["t"],
      checklist: ["a", "b", "c"],
      minutes: 10,
    },
    revisionNotes: ["a", "b"],
    resources: [{ label: "l", url: "https://docs.oracle.com/javase/" }],
  }
  return defineLesson("java-core", base)
}

describe("assembling quizzes", () => {
  const lessons = [lessonOf("a", 4), lessonOf("b", 4), lessonOf("c", 3)]

  it("a lesson quiz is the whole check, options shuffled by the seed, the same every time for one seed", () => {
    const l = lessons[0]
    const q1 = buildLessonQuiz(l, 1)
    expect(q1.map((i) => i.item.id)).toEqual(l.check.map((c) => c.id))
    expect(q1[0].key).toBe("check.java-core.a.a-0")
    expect(q1[0].order.slice().sort()).toEqual([0, 1, 2])
    expect(buildLessonQuiz(l, 1)).toEqual(q1)
    expect(buildLessonQuiz(l, 2).map((i) => i.order)).not.toEqual(
      q1.map((i) => i.order)
    )
  })

  it("draws round-robin across lessons with no repeats, never more than exist, and is deterministic", () => {
    const q = buildQuiz(lessons, {
      count: 6,
      seed: 3,
      scope: "module.java-core",
    })
    expect(q).toHaveLength(6)
    expect(new Set(q.map((i) => i.key)).size).toBe(6)
    const per = new Map<string, number>()
    for (const i of q) per.set(i.lessonId, (per.get(i.lessonId) ?? 0) + 1)
    expect(Math.max(...per.values())).toBeLessThanOrEqual(2) // 3 lessons, 6 items: two each
    expect(
      buildQuiz(lessons, { count: 6, seed: 3, scope: "module.java-core" })
    ).toEqual(q)
    const all = buildQuiz(lessons, { count: 50, seed: 1, scope: "x" })
    expect(all).toHaveLength(11)
    expect(new Set(all.map((i) => i.key)).size).toBe(11)
  })

  it("a different seed gives a different selection when the pool is larger than the quiz", () => {
    const a = buildQuiz(lessons, { count: 4, seed: 1, scope: "s" })
      .map((i) => i.key)
      .join()
    const b = buildQuiz(lessons, { count: 4, seed: 2, scope: "s" })
      .map((i) => i.key)
      .join()
    expect(a).not.toBe(b)
  })
})

describe("attempts", () => {
  const at = (n: number) => new Date(`2026-11-0${n}T09:00:00.000Z`)
  const mk = (
    n: number,
    correct: number,
    total: number,
    quizId = "module.java-core"
  ) =>
    makeAttempt({
      id: `a${n}`,
      quizId,
      kind: "module",
      seed: n,
      takenAt: at(n),
      results: Array.from({ length: total }, (_, i) => ({
        key: `k${i}`,
        correct: i < correct,
      })),
    })

  it("passes at the pass mark and below it does not; the score is a percentage of items correct", () => {
    expect(PASS_MARK).toBe(0.7)
    expect(mk(1, 7, 10).passed).toBe(true)
    expect(mk(1, 6, 10).passed).toBe(false)
    expect(mk(1, 7, 10).passMark).toBe(0.7)
    expect(scorePercent(mk(1, 7, 10))).toBe(70)
    expect(scorePercent({ correct: 1, total: 3 })).toBe(33)
    expect(mk(1, 0, 0).passed).toBe(false)
  })

  it("summarises history per quiz: latest, best, and passed once any attempt passed", () => {
    const all = [
      mk(1, 6, 10),
      mk(3, 9, 10),
      mk(2, 5, 10),
      mk(4, 8, 10, "module.other"),
    ]
    const s = summariseAttempts(all, "module.java-core")
    expect(s.attempts.map((a) => a.id)).toEqual(["a1", "a2", "a3"])
    expect(s.latest?.id).toBe("a3")
    expect(s.best?.id).toBe("a3")
    expect(s.passed).toBe(true)
    expect(summariseAttempts([mk(1, 6, 10)], "module.java-core").passed).toBe(
      false
    )
    expect(summariseAttempts([], "x")).toMatchObject({
      latest: null,
      best: null,
      passed: false,
    })
  })

  it("says 'not tried' or 'N of M correct'", () => {
    expect(checkStatusText(summariseAttempts([], "x"))).toBe("not tried")
    expect(checkStatusText(summariseAttempts([mk(1, 3, 4, "x")], "x"))).toBe(
      "3 of 4 correct"
    )
  })
})
