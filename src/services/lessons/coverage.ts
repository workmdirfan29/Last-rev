import { LESSON_INDEX } from "@/data/lessons/index.generated"
import type { CatalogModule } from "@/data/catalog/module-types"
import type { StudyLessonIndexEntry } from "@/types/lesson"

export interface LessonCoverage {
  /** Lessons that exist for the module. */
  lessons: number
  /** Topics (with minutes) that have at least one lesson, and the module's topics with minutes. */
  topicsCovered: number
  topicsTotal: number
  /** Minutes the lessons add up to, and the minutes of the topics they cover. */
  lessonMinutes: number
  coveredTopicMinutes: number
}

/**
 * How much of a module its lessons cover. Always the same two honest numbers the screens print:
 * lessons ready, and topics covered of the topics the module has.
 */
export function lessonCoverage(
  m: Pick<CatalogModule, "id" | "topicList">,
  index: readonly StudyLessonIndexEntry[] = LESSON_INDEX
): LessonCoverage {
  const mine = index.filter((l) => l.moduleId === m.id)
  const topics = m.topicList.filter((t) => t.minutes > 0)
  const covered = topics.filter((t) => mine.some((l) => l.topic === t.title))
  return {
    lessons: mine.length,
    topicsCovered: covered.length,
    topicsTotal: topics.length,
    lessonMinutes: mine.reduce((n, l) => n + l.minutes, 0),
    coveredTopicMinutes: covered.reduce((n, t) => n + t.minutes, 0),
  }
}

/** "3 ready · covers 2 of 7 topics", or "in preparation" when none exist. */
export function lessonCoverageText(c: LessonCoverage): string {
  if (c.lessons === 0) return "in preparation"
  return `${c.lessons} ready · covers ${c.topicsCovered} of ${c.topicsTotal} ${c.topicsTotal === 1 ? "topic" : "topics"}`
}

/** Lesson index entries of one module in lesson order. */
export const lessonsOfModuleIndex = (
  moduleId: string,
  index: readonly StudyLessonIndexEntry[] = LESSON_INDEX
) =>
  index.filter((l) => l.moduleId === moduleId).sort((a, b) => a.order - b.order)
