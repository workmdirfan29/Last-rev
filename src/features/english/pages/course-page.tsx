import { Link } from "react-router"
import { ArrowRightIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Progress } from "@/components/ui/progress"
import { courseOutline, courseTotals } from "@/services/english/catalogue"
import { moduleProgress } from "@/services/english/progress"
import { useLearnerStore } from "@/stores/learner-store"
import { DRAFT_NOTE } from "../copy"
import { En, Hi } from "../lang"

export function CoursePage() {
  const progress = useLearnerStore((s) => s.progress)
  const outline = courseOutline()
  const t = courseTotals()
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title="The course"
        description={`${t.lessons} lessons in ${outline.length} ${outline.length === 1 ? "module" : "modules"}: ${t.sentences} sentences, ${t.vocab} words and ${t.grammar} grammar points, each with a Hindi meaning.`}
      />
      {outline.length === 0 ? (
        <EmptyState
          title="The course is being written"
          description="Lessons are added in reviewed batches. Nothing is shown until it exists."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {outline.map(({ module: m, lessons }) => {
            const p = moduleProgress(m.id, progress)
            return (
              <li key={m.id}>
                <Link
                  to={`/english/course/${m.id}`}
                  className="block h-full space-y-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="space-y-0.5">
                    <h2 className="font-heading text-lg font-semibold">
                      <En>{m.title}</En>
                    </h2>
                    <Hi as="p" className="text-sm text-muted-foreground">
                      {m.titleHi}
                    </Hi>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {m.description}
                  </p>
                  <Progress
                    value={(p.done / p.total) * 100}
                    aria-label={`${m.title} progress`}
                  />
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="tabular-nums">
                      {p.done} of {lessons.length} lessons finished
                    </span>
                    <span className="flex items-center gap-1 text-brand-ink">
                      Open <ArrowRightIcon className="size-3.5" aria-hidden />
                    </span>
                  </div>
                  {m.review === "draft" && (
                    <p className="text-[0.6875rem] text-muted-foreground">
                      Draft: not yet reviewed by an English teacher.
                    </p>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">{DRAFT_NOTE}</p>
    </div>
  )
}
