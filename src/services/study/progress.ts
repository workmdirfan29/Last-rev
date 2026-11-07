import type { QuestionProgress } from "@/types/learner"
import {
  exerciseIdOf,
  lessonIdOf,
  taskIdOf,
  type StudyLessonIndexEntry,
} from "@/types/lesson"

type Progress = Readonly<Record<string, QuestionProgress>>

/** Lesson, assignment, exercise and project-step records are ordinary progress records: nothing here is stored. */
export const lessonFinished = (lessonId: string, progress: Progress) =>
  progress[lessonId]?.completed === true

export const taskDone = (
  moduleId: string,
  slug: string,
  n: number,
  progress: Progress
) => progress[taskIdOf(moduleId, slug, n)]?.completed === true

export const exerciseDone = (
  moduleId: string,
  slug: string,
  exercise: string,
  progress: Progress
) => progress[exerciseIdOf(moduleId, slug, exercise)]?.completed === true

/** Assignment ticks done of the lesson's checklist. */
export function assignmentProgress(
  l: Pick<StudyLessonIndexEntry, "moduleId" | "slug" | "assignment">,
  progress: Progress
) {
  let done = 0
  for (let n = 1; n <= l.assignment.checklist; n++)
    if (taskDone(l.moduleId, l.slug, n, progress)) done++
  return { done, total: l.assignment.checklist }
}

/** Lessons of a list that are finished. */
export const finishedCount = (
  lessons: readonly Pick<StudyLessonIndexEntry, "id">[],
  progress: Progress
) => lessons.filter((l) => lessonFinished(l.id, progress)).length

/** The first lesson not finished, in the given order (an index sorted by module and lesson order). */
export const nextLesson = <T extends Pick<StudyLessonIndexEntry, "id">>(
  lessons: readonly T[],
  progress: Progress
): T | undefined => lessons.find((l) => !lessonFinished(l.id, progress))

/** Finished lessons due for revision (spaced 1/3/7/14/30 days), oldest due first. */
export function dueLessons(progress: Progress, now: Date): string[] {
  return Object.values(progress)
    .filter(
      (p) =>
        p.questionId.startsWith("lesson.") &&
        p.completed &&
        p.nextReviewAt !== null &&
        new Date(p.nextReviewAt) <= now
    )
    .sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""))
    .map((p) => p.questionId)
}

export { lessonIdOf }
