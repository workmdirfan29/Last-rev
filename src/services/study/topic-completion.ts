import { MINUTES_TOLERANCE } from "@/config/study"
import type { QuestionProgress } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { lessonFinished } from "./progress"

type Progress = Readonly<Record<string, QuestionProgress>>

export interface TopicLessons {
  lessons: StudyLessonIndexEntry[]
  finished: number
  /** The lessons add up to at least the topic's minutes minus the tolerance: they cover the topic. */
  covers: boolean
  /** Every lesson of the topic is finished (and there is at least one). */
  allFinished: boolean
  /** Finishing the lessons completes the topic: they cover it and all are finished. */
  complete: boolean
  /** The first lesson not finished, else the first. */
  next: StudyLessonIndexEntry | null
}

/**
 * Where a plan topic stands through its lessons. A topic whose lessons are only part-written is never
 * completed by them: the plan says so and the learner decides.
 */
export function topicLessons(
  moduleId: string,
  topic: string,
  topicMinutes: number,
  index: readonly StudyLessonIndexEntry[],
  progress: Progress
): TopicLessons {
  const lessons = index
    .filter((l) => l.moduleId === moduleId && l.topic === topic)
    .sort((a, b) => a.order - b.order)
  const finished = lessons.filter((l) => lessonFinished(l.id, progress)).length
  const minutes = lessons.reduce((n, l) => n + l.minutes, 0)
  const covers =
    lessons.length > 0 && minutes >= topicMinutes * (1 - MINUTES_TOLERANCE)
  const allFinished = lessons.length > 0 && finished === lessons.length
  return {
    lessons,
    finished,
    covers,
    allFinished,
    complete: covers && allFinished,
    next:
      lessons.find((l) => !lessonFinished(l.id, progress)) ??
      lessons[0] ??
      null,
  }
}
