import {
  MODULE_QUIZ_ITEMS,
  MODULE_QUIZ_MIN_POOL,
  PHASE_QUIZ_ITEMS,
  PHASE_QUIZ_MIN_POOL,
  PHASE_QUIZ_SUGGEST_AT,
} from "@/config/study"
import type { QuestionProgress, QuizAttempt, QuizKind } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { lessonFinished } from "./progress"
import {
  moduleQuizId,
  phaseQuizId,
  summariseAttempts,
  type AttemptSummary,
} from "./quiz"
import { lessonsInPhase, type PhaseView } from "./roadmap"

type Progress = Readonly<Record<string, QuestionProgress>>

export interface QuizInfo {
  id: string
  kind: Extract<QuizKind, "module" | "phase">
  /** What it is called on screen. */
  title: string
  lessons: StudyLessonIndexEntry[]
  /** Knowledge-check items the lessons hold in all. */
  pool: number
  /** Items one attempt asks (fewer than the usual size when the pool is smaller). */
  size: number
  /** The quiz can be taken: the pool is large enough. */
  available: boolean
  /** Items still missing before it can be taken (0 when available). */
  missing: number
  /** Enough of the lessons are finished that taking it is suggested. Text only; nothing is ever locked. */
  suggested: boolean
  finished: number
  summary: AttemptSummary
}

const poolOf = (lessons: readonly StudyLessonIndexEntry[]) =>
  lessons.reduce((n, l) => n + l.check.length, 0)

function info(
  kind: QuizInfo["kind"],
  id: string,
  title: string,
  lessons: StudyLessonIndexEntry[],
  quizSize: number,
  minPool: number,
  progress: Progress,
  attempts: readonly QuizAttempt[]
): QuizInfo {
  const pool = poolOf(lessons)
  const finished = lessons.filter((l) => lessonFinished(l.id, progress)).length
  return {
    id,
    kind,
    title,
    lessons,
    pool,
    size: Math.min(quizSize, pool),
    available: pool >= minPool,
    missing: Math.max(0, minPool - pool),
    suggested:
      lessons.length > 0 && finished / lessons.length >= PHASE_QUIZ_SUGGEST_AT,
    finished,
    summary: summariseAttempts(attempts, id),
  }
}

export function moduleQuizInfo(
  moduleId: string,
  title: string,
  index: readonly StudyLessonIndexEntry[],
  progress: Progress,
  attempts: readonly QuizAttempt[]
): QuizInfo {
  const lessons = index
    .filter((l) => l.moduleId === moduleId)
    .sort((a, b) => a.order - b.order)
  return info(
    "module",
    moduleQuizId(moduleId),
    `${title} quiz`,
    lessons,
    MODULE_QUIZ_ITEMS,
    MODULE_QUIZ_MIN_POOL,
    progress,
    attempts
  )
}

export function phaseQuizInfo(
  view: PhaseView,
  index: readonly StudyLessonIndexEntry[],
  progress: Progress,
  attempts: readonly QuizAttempt[]
): QuizInfo {
  const { phase } = view
  return info(
    "phase",
    phaseQuizId(phase.roadmapId, phase.number),
    `Phase ${phase.number} quiz: ${phase.title}`,
    lessonsInPhase(view, index),
    PHASE_QUIZ_ITEMS,
    PHASE_QUIZ_MIN_POOL,
    progress,
    attempts
  )
}

/** Where a quiz lives in the app. */
export const quizPath = (q: Pick<QuizInfo, "kind" | "id">) =>
  q.kind === "module"
    ? `/study/quiz/module/${q.id.replace(/^module\./, "")}`
    : `/study/quiz/phase/${q.id.split(".").at(-1)}`
