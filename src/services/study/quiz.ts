import { PASS_MARK } from "@/config/study"
import { seedFrom, seededRandom, shuffled } from "@/utils/random"
import { checkIdOf, type CheckItem, type StudyLesson } from "@/types/lesson"
import type { QuizAttempt, QuizKind } from "@/types/learner"

/**
 * Quizzes are assembled, never authored: a lesson's knowledge check, or items drawn from the checks of a
 * module's or a phase's lessons. Every item is scored by exact comparison with its stored answer, so a
 * score is "the percentage of items answered correctly" and nothing more.
 */

/** What a learner answers, in the item's own option numbering. */
export type Response = number | readonly number[] | boolean | string

export interface QuizItem {
  /** `check.<module>.<lesson>.<item id>`: stable identity, used in attempts. */
  key: string
  lessonId: string
  item: CheckItem
  /** Order the options are shown in (indexes into `item.options`); empty for items without options. */
  order: number[]
}

const norm = (s: string, caseSensitive: boolean) => {
  const t = s.trim().replace(/\s+/g, " ")
  return caseSensitive ? t : t.toLowerCase()
}

/** Whether a response is right. No partial credit: a multi-select must match the answers exactly. */
export function gradeItem(item: CheckItem, response: Response | null): boolean {
  if (response === null || response === undefined) return false
  switch (item.type) {
    case "single":
    case "output":
      return typeof response === "number" && response === item.answer
    case "multi": {
      if (!Array.isArray(response)) return false
      const given = new Set(response as readonly number[])
      return (
        given.size === item.answers.length &&
        item.answers.every((a) => given.has(a))
      )
    }
    case "truefalse":
      return typeof response === "boolean" && response === item.answer
    case "blank": {
      if (typeof response !== "string") return false
      const cs = item.caseSensitive
      const given = norm(response, cs)
      if (given === "") return false
      return [item.answer, ...item.accepted].some((a) => norm(a, cs) === given)
    }
  }
}

/** The correct answer as text, for the result line. */
export function correctAnswerText(item: CheckItem): string {
  switch (item.type) {
    case "single":
    case "output":
      return item.options[item.answer]
    case "multi":
      return item.answers.map((a) => item.options[a]).join("; ")
    case "truefalse":
      return item.answer ? "True" : "False"
    case "blank":
      return item.answer
  }
}

export const promptOf = (item: CheckItem): string =>
  item.type === "truefalse" ? item.statement : item.prompt

function quizItem(
  lesson: StudyLesson,
  item: CheckItem,
  random: () => number
): QuizItem {
  const count = "options" in item ? item.options.length : 0
  return {
    key: checkIdOf(lesson.moduleId, lesson.slug, item.id),
    lessonId: lesson.id,
    item,
    order: count ? shuffled([...Array(count).keys()], random) : [],
  }
}

/** A lesson's whole knowledge check, in lesson order, options shuffled by the seed. */
export function buildLessonQuiz(lesson: StudyLesson, seed: number): QuizItem[] {
  const random = seededRandom(seedFrom(`${lesson.id}|${seed}`))
  return lesson.check.map((c) => quizItem(lesson, c, random))
}

/** How many check items the lessons hold in all. */
export const poolSize = (lessons: readonly StudyLesson[]): number =>
  lessons.reduce((n, l) => n + l.check.length, 0)

/**
 * A module or phase quiz: up to `count` items drawn round-robin across the lessons (so no lesson dominates),
 * never the same item twice, then shuffled. The same seed gives the same quiz. A smaller pool gives a smaller quiz.
 */
export function buildQuiz(
  lessons: readonly StudyLesson[],
  opts: { count: number; seed: number; scope: string }
): QuizItem[] {
  const random = seededRandom(seedFrom(`${opts.scope}|${opts.seed}`))
  const queues = lessons.map((l) => ({
    lesson: l,
    items: shuffled(l.check, random),
  }))
  const picked: QuizItem[] = []
  for (let round = 0; picked.length < opts.count; round++) {
    let took = false
    for (const q of shuffled(queues, random)) {
      if (picked.length >= opts.count) break
      const item = q.items[round]
      if (item) {
        picked.push(quizItem(q.lesson, item, random))
        took = true
      }
    }
    if (!took) break
  }
  return shuffled(picked, random)
}

/* ---------------------------------- attempts ---------------------------------- */

export const lessonQuizId = (lessonId: string) => lessonId
export const moduleQuizId = (moduleId: string) => `module.${moduleId}`
export const phaseQuizId = (roadmapId: string, n: number) =>
  `phase.${roadmapId}.${n}`

export function makeAttempt(p: {
  id: string
  quizId: string
  kind: QuizKind
  seed: number
  takenAt: Date
  results: { key: string; correct: boolean }[]
  passMark?: number
}): QuizAttempt {
  const passMark = p.passMark ?? PASS_MARK
  const correct = p.results.filter((r) => r.correct).length
  const total = p.results.length
  return {
    id: p.id,
    quizId: p.quizId,
    kind: p.kind,
    takenAt: p.takenAt.toISOString(),
    seed: p.seed,
    total,
    correct,
    passMark,
    passed: total > 0 && correct / total >= passMark,
    items: p.results.map((r) => ({ itemId: r.key, correct: r.correct })),
  }
}

/** The percentage of items answered correctly, rounded. */
export const scorePercent = (a: { correct: number; total: number }): number =>
  a.total === 0 ? 0 : Math.round((a.correct / a.total) * 100)

export interface AttemptSummary {
  attempts: QuizAttempt[]
  latest: QuizAttempt | null
  best: QuizAttempt | null
  /** At least one attempt reached the pass mark in force when it was taken. */
  passed: boolean
}

export function summariseAttempts(
  all: readonly QuizAttempt[],
  quizId: string
): AttemptSummary {
  const attempts = all
    .filter((a) => a.quizId === quizId)
    .sort((a, b) => a.takenAt.localeCompare(b.takenAt))
  const best = attempts.reduce<QuizAttempt | null>(
    (b, a) => (!b || a.correct / a.total > b.correct / b.total ? a : b),
    null
  )
  return {
    attempts,
    latest: attempts.at(-1) ?? null,
    best,
    passed: attempts.some((a) => a.passed),
  }
}

/** "Knowledge check: not tried" or "N of M correct" from the latest attempt. */
export function checkStatusText(summary: AttemptSummary): string {
  const a = summary.latest
  return a ? `${a.correct} of ${a.total} correct` : "not tried"
}
