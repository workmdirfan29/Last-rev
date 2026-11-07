import { Link, useParams } from "react-router"
import { CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { courseOutline } from "@/services/english/catalogue"
import { isLearned } from "@/services/english/learned"
import { lessonFinished } from "@/services/english/progress"
import { useLearnerStore } from "@/stores/learner-store"
import type { EnglishLessonIndexEntry } from "@/types/english"
import { DRAFT_NOTE } from "../copy"
import { En, Hi } from "../lang"

function LessonRow({ l }: { l: EnglishLessonIndexEntry }) {
  const progress = useLearnerStore((s) => s.progress)
  const english = useLearnerStore((s) => s.english)
  const known = l.itemIds.filter((id) =>
    isLearned(id, progress, english)
  ).length
  const done = lessonFinished(l.id, progress)
  return (
    <li>
      <Link
        to={`/english/lesson/${l.moduleId}/${l.slug}`}
        className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="mt-0.5 shrink-0" aria-hidden>
          <CheckCircle2Icon
            className={
              done ? "size-5 text-success" : "size-5 text-muted-foreground/40"
            }
          />
        </span>
        <span className="min-w-0 flex-1 space-y-0.5">
          <En as="span" className="block text-sm font-medium">
            {l.title}
          </En>
          <Hi as="span" className="block text-sm text-muted-foreground">
            {l.titleHi}
          </Hi>
          <En as="span" className="block text-xs text-muted-foreground">
            {l.goal}
          </En>
        </span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {done ? "Finished · " : ""}
          {known}/{l.itemIds.length} known
        </span>
      </Link>
    </li>
  )
}

export function ModulePage() {
  const { module = "" } = useParams()
  const entry = courseOutline().find((x) => x.module.id === module)
  if (!entry)
    return (
      <EmptyState
        title="Module not found"
        description="That module has no lessons yet."
        action={
          <Button asChild>
            <Link to="/english/course">Back to the course</Link>
          </Button>
        }
      />
    )
  const { module: m, lessons, categories } = entry
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title={m.title}
        description={
          <>
            <Hi as="span" className="block text-base">
              {m.titleHi}
            </Hi>
            {m.description}
          </>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/english/course">All modules</Link>
          </Button>
        }
      />
      {m.review === "draft" && (
        <p
          className="rounded-lg border border-warning/60 p-3 text-xs"
          data-testid="draft-note"
        >
          {DRAFT_NOTE}
        </p>
      )}
      {m.layout === "folder" ? (
        categories.map((c) => (
          <section
            key={c.slug}
            className="space-y-2"
            aria-labelledby={`cat-${c.slug}`}
          >
            <h2 id={`cat-${c.slug}`} className="text-sm font-medium">
              <En>{c.title}</En> ·{" "}
              <Hi className="text-muted-foreground">{c.titleHi}</Hi>
            </h2>
            <ul className="space-y-2">
              {c.lessons.map((l) => (
                <LessonRow key={l.id} l={l} />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <ul className="space-y-2">
          {lessons.map((l) => (
            <LessonRow key={l.id} l={l} />
          ))}
        </ul>
      )}
    </div>
  )
}
