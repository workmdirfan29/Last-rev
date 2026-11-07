import { MODULE_BY_ID } from "@/data/catalog/modules"
import {
  READINESS_CATEGORIES,
  type ReadinessCategory,
} from "@/data/readiness/categories"
import { scoreArea } from "@/services/analytics/readiness"
import { englishMetrics } from "@/services/english/progress"
import { scoreSession } from "@/services/mock/score"
import { moduleProgress } from "@/services/study/module-progress"
import type { QuestionIndexEntry } from "@/types/content"
import {
  isResumeModuleId,
  type EnglishState,
  type HrAnswer,
  type MockSession,
  type QuestionProgress,
  type QuizAttempt,
} from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"

/**
 * Job readiness by category, from real records only.
 *
 * A category's score is the plain average of the parts it has, each 0 to 1 and each shown with its raw counts:
 *   Questions  : the long-standing 60% completion + 40% confidence score (unchanged)
 *   Lessons    : finished / ready            Assignments : ticked / all
 *   Quizzes    : lesson checks passed and module quizzes passed / those that exist
 *   Mock       : the average rubric points of your own ratings in finished mock interviews, as a share of 100
 *   Spoken English (its own category): lessons finished / ready
 * A part a category does not have is left out. A category with no content at all is "no content yet" and is not
 * in the overall, which is the plain mean over the categories that have content, that you selected and have not
 * switched off. It measures coverage and your own confidence over what exists today, not a hiring probability.
 */
export interface ReadinessInput {
  /** Modules in the learner's syllabus, from either journey. */
  selectedModules: ReadonlySet<string>
  index: readonly QuestionIndexEntry[]
  progress: Readonly<Record<string, QuestionProgress>>
  lessons: readonly StudyLessonIndexEntry[]
  attempts: readonly QuizAttempt[]
  mockSessions: readonly MockSession[]
  english: EnglishState | null
  hrAnswers: readonly HrAnswer[]
  /** Category ids the learner switched off. */
  excluded: readonly string[]
  categories?: readonly ReadinessCategory[]
}

export interface QuestionsPart {
  total: number
  completed: number
  /** Average of the 1-5 ratings over rated questions, or null when none is rated. */
  confidenceAverage: number | null
  /** The 60/40 score, 0 to 1. */
  score: number
}
export interface CategoryReadiness {
  category: ReadinessCategory
  /** The learner's syllabus (or an own/resume question set, or started English) includes it. */
  selected: boolean
  excluded: boolean
  questions: QuestionsPart | null
  lessons: { ready: number; finished: number } | null
  quizzes: { passed: number; total: number } | null
  assignments: { done: number; total: number } | null
  mock: { sessions: number; rated: number; mean: number } | null
  english: {
    lessonsReady: number
    lessonsFinished: number
    wordsLearned: number
    wordsTotal: number
    sentencesPractised: number
    sentencesTotal: number
    speakingRated: number
  } | null
  hrAnswers: number | null
  /** 0 to 1, or null when there is nothing to count. */
  score: number | null
  hasContent: boolean
  /** In the overall: has content, selected, and not switched off. */
  included: boolean
}

export interface ReadinessResult {
  categories: CategoryReadiness[]
  /** 0 to 100, or null when no category is included. */
  overall: number | null
  included: number
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

export function computeCategoryReadiness(
  input: ReadinessInput
): ReadinessResult {
  const {
    selectedModules,
    index,
    progress,
    lessons,
    attempts,
    mockSessions,
    english,
    hrAnswers,
    excluded,
  } = input
  const categories = input.categories ?? READINESS_CATEGORIES

  // finished mock sessions, scored once
  const finished = mockSessions
    .filter((s) => s.status === "finished")
    .map((s) => ({ session: s, result: scoreSession(s) }))
  const mockModules = finished.flatMap(({ result }) => result.modules)

  const counts = (id: string) => selectedModules.has(id) || isResumeModuleId(id)
  const eng = english
    ? englishMetrics(progress, english, [], "1970-01-01")
    : englishMetrics(progress, null, [], "1970-01-01")

  const rows: CategoryReadiness[] = categories.map((category) => {
    const modules = category.modules.filter(counts)

    // questions (removed ones never count)
    const mine = index.filter(
      (q) => modules.includes(q.moduleId) && !progress[q.id]?.removed
    )
    let questions: QuestionsPart | null = null
    if (mine.length > 0) {
      const completed = mine.filter((q) => progress[q.id]?.completed).length
      const rated = mine.filter((q) => (progress[q.id]?.confidence ?? 0) > 0)
      const sum = mine.reduce(
        (n, q) => n + (progress[q.id]?.confidence ?? 0),
        0
      )
      questions = {
        total: mine.length,
        completed,
        confidenceAverage: rated.length
          ? Math.round(
              (rated.reduce((n, q) => n + progress[q.id].confidence, 0) /
                rated.length) *
                10
            ) / 10
          : null,
        score: scoreArea({
          area: "programming",
          total: mine.length,
          completed,
          confidenceSum: sum,
        }).score,
      }
    }

    // lessons, quizzes, assignments through each module's own progress
    let lessonsReady = 0
    let lessonsFinished = 0
    let taskDone = 0
    let taskTotal = 0
    let passed = 0
    let quizTotal = 0
    for (const id of modules) {
      const m = MODULE_BY_ID.get(id)
      if (!m) continue
      const p = moduleProgress(m, lessons, progress, attempts, {
        done: 0,
        available: 0,
      })
      lessonsReady += p.lessons.total
      lessonsFinished += p.lessons.done
      taskDone += p.assignments.done + p.exercises.done
      taskTotal += p.assignments.total + p.exercises.total
      passed += p.checks.passed + (p.moduleQuiz.passed ? 1 : 0)
      quizTotal += p.checks.total + (p.moduleQuiz.exists ? 1 : 0)
    }

    // mock interviews: this category's modules, or every module for the technical interview category
    const wantMock = category.also?.includes("mock-interviews")
    const mockRows = mockModules.filter(
      (r) =>
        r.mean !== null &&
        r.rated > 0 &&
        (wantMock || modules.includes(r.moduleId))
    )
    const mockRated = mockRows.reduce((n, r) => n + r.rated, 0)
    const mock =
      mockRated > 0
        ? {
            sessions: finished.filter(({ result }) =>
              result.modules.some((r) => mockRows.includes(r))
            ).length,
            rated: mockRated,
            mean:
              mockRows.reduce((n, r) => n + r.mean! * r.rated, 0) / mockRated,
          }
        : null

    const spoken = category.also?.includes("spoken-english") ? eng : null
    const englishPart =
      spoken && spoken.lessonsTotal > 0
        ? {
            lessonsReady: spoken.lessonsTotal,
            lessonsFinished: spoken.lessonsFinished,
            wordsLearned: spoken.vocabLearned,
            wordsTotal: spoken.vocabTotal,
            sentencesPractised: spoken.sentencesPractised,
            sentencesTotal: spoken.sentencesTotal,
            speakingRated: spoken.speakingDone,
          }
        : null
    const englishStarted =
      englishPart !== null &&
      (englishPart.lessonsFinished > 0 || english !== null)

    const hrCount = category.also?.includes("hr-answers")
      ? hrAnswers.filter((a) => modules.includes(a.questionId.split(".")[0]))
          .length
      : null

    const parts: number[] = []
    if (questions) parts.push(questions.score)
    if (lessonsReady > 0) parts.push(lessonsFinished / lessonsReady)
    if (quizTotal > 0) parts.push(passed / quizTotal)
    if (taskTotal > 0) parts.push(taskDone / taskTotal)
    if (mock) parts.push(mock.mean / 100)
    if (englishPart)
      parts.push(englishPart.lessonsFinished / englishPart.lessonsReady)

    const selected =
      category.modules.some(counts) ||
      (category.also?.includes("spoken-english") === true && englishStarted)
    return {
      category,
      selected,
      excluded: excluded.includes(category.id),
      questions,
      lessons:
        lessonsReady > 0
          ? { ready: lessonsReady, finished: lessonsFinished }
          : null,
      quizzes: quizTotal > 0 ? { passed, total: quizTotal } : null,
      assignments: taskTotal > 0 ? { done: taskDone, total: taskTotal } : null,
      mock,
      english: englishPart,
      hrAnswers: hrCount,
      score: parts.length ? mean(parts) : null,
      hasContent: parts.length > 0,
      included: false,
    }
  })

  for (const r of rows) r.included = r.hasContent && r.selected && !r.excluded
  const included = rows.filter((r) => r.included)
  return {
    categories: rows,
    overall: included.length
      ? Math.round(mean(included.map((r) => r.score!)) * 100)
      : null,
    included: included.length,
  }
}
