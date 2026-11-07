import { useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router"
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { getEnglishModule } from "@/data/english/modules"
import { cn } from "@/lib/utils"
import { NotesEditor } from "@/features/interview/components/notes-editor"
import { lessonId } from "@/types/english"
import { isLearned } from "@/services/english/learned"
import { lessonsOfModule } from "@/services/english/catalogue"
import { useLearnerStore } from "@/stores/learner-store"
import { DRAFT_NOTE } from "../copy"
import { ItemView } from "../item-views"
import { En, Hi } from "../lang"
import { useEnglishActions } from "../use-english"
import { useLesson } from "../use-lessons"
import { useSpeech } from "../use-speech"
import { useTimeOnTask } from "../use-time-on-task"

export function LessonPage() {
  const { module = "", lesson = "" } = useParams()
  const id = lessonId(module, lesson)
  // a new lesson starts at its first item with fresh state
  return <LessonView key={id} id={id} module={module} />
}

function LessonView({ id, module }: { id: string; module: string }) {
  const meta = getEnglishModule(module)
  const { data, isLoading } = useLesson(id)
  const speech = useSpeech()
  const progress = useLearnerStore((s) => s.progress)
  const english = useLearnerStore((s) => s.english)
  const { finishLesson } = useEnglishActions()
  const { flush } = useTimeOnTask("lesson")
  // `?item=<slug>` (from the header search) opens the lesson at that item
  const [params] = useSearchParams()
  const [picked, setPicked] = useState<number | null>(null)

  const siblings = useMemo(() => lessonsOfModule(module), [module])
  const position = siblings.findIndex((l) => l.id === id)
  const nextLesson = position >= 0 ? siblings[position + 1] : undefined

  if (isLoading) return <ScreenLoader />
  if (!data || !meta)
    return (
      <EmptyState
        title="Lesson not found"
        description="That lesson is not in the course."
        action={
          <Button asChild>
            <Link to="/english/course">Back to the course</Link>
          </Button>
        }
      />
    )

  const fromLink = data.items.findIndex((i) => i.slug === params.get("item"))
  const index = Math.min(
    picked ?? (fromLink >= 0 ? fromLink : 0),
    data.items.length - 1
  )
  const setIndex = setPicked
  const item = data.items[index]
  const finished = progress[id]?.completed === true
  const last = index === data.items.length - 1

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={meta.title}
        title={data.title}
        description={
          <>
            <Hi as="span" className="block text-base">
              {data.titleHi}
            </Hi>
            <En as="span" className="block">
              {data.goal}
            </En>
          </>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to={`/english/course/${module}`}>
              <ArrowLeftIcon /> All lessons
            </Link>
          </Button>
        }
      />

      {meta.review === "draft" && (
        <p
          className="rounded-lg border border-warning/60 p-3 text-xs"
          data-testid="draft-note"
        >
          {DRAFT_NOTE}
        </p>
      )}

      <nav aria-label="Items in this lesson">
        <ol className="flex flex-wrap gap-1.5">
          {data.items.map((it, i) => {
            const done = isLearned(it.id, progress, english)
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "step" : undefined}
                  aria-label={`Item ${i + 1}${done ? ", known" : ""}`}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md border text-xs tabular-nums",
                    i === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-success/60"
                        : "border-border"
                  )}
                >
                  {done && i !== index ? (
                    <CheckCircle2Icon
                      className="size-4 text-success"
                      aria-hidden
                    />
                  ) : (
                    i + 1
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      <ItemView key={item.id} item={item} speech={speech} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          <ArrowLeftIcon /> Previous
        </Button>
        <p className="text-xs text-muted-foreground tabular-nums">
          Item {index + 1} of {data.items.length}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={last}
          onClick={() => setIndex(index + 1)}
        >
          Next <ArrowRightIcon />
        </Button>
      </div>

      <section
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        aria-label="Finish the lesson"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={finished ? "default" : "outline"}
            aria-pressed={finished}
            onClick={() => {
              flush()
              void finishLesson(id)
            }}
          >
            <CheckCircle2Icon />
            {finished ? "Lesson finished" : "Finish this lesson"}
          </Button>
          {finished && nextLesson && (
            <Button asChild variant="link">
              <Link
                to={`/english/lesson/${nextLesson.moduleId}/${nextLesson.slug}`}
              >
                Next lesson: {nextLesson.title}
              </Link>
            </Button>
          )}
        </div>
        <NotesEditor key={id} questionId={id} />
      </section>
    </div>
  )
}
