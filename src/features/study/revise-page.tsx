import { useState } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { RatingButtons } from "@/components/shared/rating-buttons"
import { Button } from "@/components/ui/button"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { dueLessons } from "@/services/study/progress"
import { useLearnerStore } from "@/stores/learner-store"

const RECALL = [
  "I forgot it",
  "I remembered a little",
  "I remembered with effort",
  "I remembered it well",
  "I knew it at once",
]

/**
 * Finished lessons come back after 1, 3, 7, 14 and 30 days. Say how well you remember each one; the next review
 * moves out (or back) from that. Nothing here is a test: the rating is yours.
 */
export function RevisePage() {
  const progress = useLearnerStore((s) => s.progress)
  const review = useLearnerStore((s) => s.reviewQuestion)
  const [now] = useState(() => new Date())
  const [saved, setSaved] = useState<string | null>(null)
  const due = dueLessons(progress, now)
  const later = Object.values(progress)
    .filter(
      (p) =>
        p.questionId.startsWith("lesson.") &&
        p.completed &&
        p.nextReviewAt !== null &&
        new Date(p.nextReviewAt) > now
    )
    .sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="Revise"
        description="Lessons you finished come back after 1, 3, 7, 14 and 30 days. Say how well you remember each one."
      />
      <p
        className="text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
        data-testid="revise-status"
      >
        {saved ??
          `${due.length} ${due.length === 1 ? "lesson is" : "lessons are"} due today.`}
      </p>

      {due.length === 0 ? (
        <EmptyState
          title="Nothing to revise today"
          description={
            later.length > 0
              ? `${later.length} finished ${later.length === 1 ? "lesson is" : "lessons are"} scheduled for later. The next one is due on ${format(new Date(later[0].nextReviewAt!), "d MMM")}.`
              : "When you finish a lesson, it comes back here for revision."
          }
          action={
            <Button asChild>
              <Link to="/study/lessons">Go to the lessons</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-4" aria-label="Lessons due for revision">
          {due.map((id) => {
            const l = LESSON_INDEX.find((x) => x.id === id)
            if (!l) return null
            return (
              <li
                key={id}
                className="space-y-3 rounded-xl border border-border bg-card p-4"
                data-testid="revise-item"
              >
                <div>
                  <Link
                    className="text-sm font-medium underline underline-offset-4"
                    to={`/study/lesson/${l.moduleId}/${l.slug}`}
                  >
                    {l.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {getModule(l.moduleId)?.title} · {l.topic}
                  </p>
                </div>
                <RatingButtons
                  legend={`How well do you remember "${l.title}"?`}
                  anchors={RECALL}
                  value={null}
                  onPick={async (n) => {
                    await review(id, n)
                    setSaved(`Saved: ${l.title}, ${n} of 5.`)
                  }}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
