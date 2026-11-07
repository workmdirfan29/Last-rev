import { Link } from "react-router"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { topicLessons } from "@/services/study/topic-completion"
import { getModule } from "@/data/catalog/modules"
import { useLearnerStore } from "@/stores/learner-store"

/**
 * On a plan block for a topic that has lessons: "Open lessons (2 of 3 finished)", which opens the first one
 * not finished. A topic with no lessons shows nothing. When the lessons are only part of the topic, it says
 * more are on the way, and finishing them never completes the block on its own.
 */
export function BlockLessonsLink({
  moduleId,
  topic,
}: {
  moduleId: string
  topic: string
}) {
  const progress = useLearnerStore((s) => s.progress)
  const minutes =
    getModule(moduleId)?.topicList.find((t) => t.title === topic)?.minutes ?? 0
  const t = topicLessons(moduleId, topic, minutes, LESSON_INDEX, progress)
  if (!t.next) return null
  return (
    <span className="flex flex-wrap items-center gap-x-2 text-xs">
      <Link
        className="font-medium text-brand-ink underline underline-offset-4"
        to={`/study/lesson/${t.next.moduleId}/${t.next.slug}`}
      >
        Open lessons ({t.finished} of {t.lessons.length} finished)
      </Link>
      {!t.covers && (
        <span className="text-muted-foreground">
          more lessons for this topic are on the way
        </span>
      )}
    </span>
  )
}
