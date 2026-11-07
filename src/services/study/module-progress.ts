import { MODULE_QUIZ_MIN_POOL } from "@/config/study"
import type { CatalogModule } from "@/data/catalog/module-types"
import type { QuestionProgress, QuizAttempt } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { topicIdOf } from "@/utils/topic-id"
import { exerciseDone, lessonFinished, taskDone } from "./progress"
import { moduleQuizId, summariseAttempts } from "./quiz"

type Progress = Readonly<Record<string, QuestionProgress>>

export interface ModuleProgress {
  topics: { done: number; total: number }
  lessons: { done: number; total: number }
  assignments: { done: number; total: number }
  exercises: { done: number; total: number }
  /** Lesson knowledge checks passed, of the lessons that have one. */
  checks: { passed: number; total: number }
  /** The module quiz exists once the lessons hold enough check items. */
  moduleQuiz: { exists: boolean; passed: boolean }
  questions: { done: number; available: number }
  /** 0 to 1 per component, or null when the module has nothing of that kind. */
  components: {
    learning: number
    practice: number | null
    quizzes: number | null
    questions: number | null
  }
  /** The plain average of the components that exist. */
  percent: number
}

/**
 * Module completion in the Study Path. It keeps today's formula (half topics, half questions; topics alone
 * when there are no questions) and adds what lessons bring, with EQUAL weight for every component that
 * exists for the module: learning (topics done), practice (assignment ticks and exercises), quizzes (lesson
 * checks passed and the module quiz) and questions. The screens always print the raw counts next to the
 * percentage; the percentage is never shown alone.
 */
export function moduleProgress(
  module: Pick<CatalogModule, "id" | "topicList">,
  lessons: readonly StudyLessonIndexEntry[],
  progress: Progress,
  attempts: readonly QuizAttempt[],
  questions: { done: number; available: number }
): ModuleProgress {
  const mine = lessons.filter((l) => l.moduleId === module.id)
  const topics = module.topicList.filter((t) => t.minutes > 0)
  const topicsDone = topics.filter(
    (t) => progress[topicIdOf(module.id, t.title)]?.completed === true
  ).length

  let taskTotal = 0
  let taskDoneCount = 0
  let exTotal = 0
  let exDoneCount = 0
  for (const l of mine) {
    taskTotal += l.assignment.checklist
    for (let n = 1; n <= l.assignment.checklist; n++)
      if (taskDone(l.moduleId, l.slug, n, progress)) taskDoneCount++
    for (const e of l.exercises) {
      exTotal++
      if (exerciseDone(l.moduleId, l.slug, e.slug, progress)) exDoneCount++
    }
  }

  const withCheck = mine.filter((l) => l.check.length > 0)
  const checksPassed = withCheck.filter(
    (l) => summariseAttempts(attempts, l.id).passed
  ).length
  const pool = mine.reduce((n, l) => n + l.check.length, 0)
  const quizExists = pool >= MODULE_QUIZ_MIN_POOL
  const quizPassed =
    quizExists && summariseAttempts(attempts, moduleQuizId(module.id)).passed

  const learning = topics.length ? topicsDone / topics.length : 0
  const practice =
    taskTotal + exTotal > 0
      ? (taskDoneCount + exDoneCount) / (taskTotal + exTotal)
      : null
  const quizTotal = withCheck.length + (quizExists ? 1 : 0)
  const quizzes =
    quizTotal > 0 ? (checksPassed + (quizPassed ? 1 : 0)) / quizTotal : null
  const q =
    questions.available > 0 ? questions.done / questions.available : null

  const present = [learning, practice, quizzes, q].filter(
    (x): x is number => x !== null
  )
  return {
    topics: { done: topicsDone, total: topics.length },
    lessons: {
      done: mine.filter((l) => lessonFinished(l.id, progress)).length,
      total: mine.length,
    },
    assignments: { done: taskDoneCount, total: taskTotal },
    exercises: { done: exDoneCount, total: exTotal },
    checks: { passed: checksPassed, total: withCheck.length },
    moduleQuiz: { exists: quizExists, passed: quizPassed },
    questions: { done: questions.done, available: questions.available },
    components: { learning, practice, quizzes, questions: q },
    percent: present.reduce((a, b) => a + b, 0) / present.length,
  }
}
