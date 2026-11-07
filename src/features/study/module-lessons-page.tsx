import { Link, useParams } from "react-router"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LESSON_STATUS_LABEL } from "@/data/catalog/module-types"
import { getModule } from "@/data/catalog/modules"
import {
  lessonCoverage,
  lessonCoverageText,
  lessonsOfModuleIndex,
} from "@/services/lessons/coverage"
import {
  assignmentProgress,
  finishedCount,
  lessonFinished,
} from "@/services/study/progress"
import { checkStatusText, summariseAttempts } from "@/services/study/quiz"
import { useLearnerStore } from "@/stores/learner-store"

/** One module's lessons in topic order. Topics that have no lesson yet are listed as such. */
export function ModuleLessonsPage() {
  const { module = "" } = useParams()
  const mod = getModule(module)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  if (!mod)
    return (
      <EmptyState
        title="Module not found"
        description="That module is not in the catalogue."
        action={
          <Button asChild>
            <Link to="/study/lessons">Back to the lessons</Link>
          </Button>
        }
      />
    )
  const lessons = lessonsOfModuleIndex(module)
  const cov = lessonCoverage(mod)
  const done = finishedCount(lessons, progress)
  const topics = mod.topicList.filter((t) => t.minutes > 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path · Lessons"
        title={mod.title}
        description={mod.description}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/study/lessons">All modules</Link>
          </Button>
        }
      />
      <section
        className="space-y-2 rounded-xl border border-border bg-card p-4"
        aria-label="Module lessons progress"
      >
        <p className="text-sm tabular-nums">
          <span className="font-medium">{done}</span> of {lessons.length}{" "}
          lessons finished · {lessonCoverageText(cov)} ·{" "}
          {LESSON_STATUS_LABEL[mod.lessonStatus]}
        </p>
        <Progress
          value={lessons.length ? (done / lessons.length) * 100 : 0}
          aria-label="Lessons finished"
        />
      </section>

      {lessons.length === 0 ? (
        <EmptyState
          title="No lessons in this module yet"
          description="Lessons are added in reviewed batches rather than padded with filler."
        />
      ) : (
        <div className="space-y-5">
          {topics.map((t) => {
            const mine = lessons.filter((l) => l.topic === t.title)
            return (
              <section key={t.title} className="space-y-2" aria-label={t.title}>
                <h2 className="text-sm font-medium">
                  {t.title}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    · {t.minutes} min in the plan
                  </span>
                </h2>
                {mine.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                    No lesson for this topic yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {mine.map((l) => {
                      const fin = lessonFinished(l.id, progress)
                      const tasks = assignmentProgress(l, progress)
                      return (
                        <li key={l.id}>
                          <Link
                            to={`/study/lesson/${l.moduleId}/${l.slug}`}
                            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          >
                            {fin ? (
                              <CheckCircle2Icon
                                className="mt-0.5 size-5 shrink-0 text-success"
                                aria-label="Finished"
                              />
                            ) : (
                              <CircleIcon
                                className="mt-0.5 size-5 shrink-0 text-muted-foreground/50"
                                aria-label="Not finished"
                              />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">
                                {l.title}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {l.overview}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground tabular-nums">
                                {l.minutes} min · Check:{" "}
                                {checkStatusText(
                                  summariseAttempts(attempts, l.id)
                                )}{" "}
                                · Assignment {tasks.done}/{tasks.total}
                                {l.exercises.length > 0
                                  ? ` · ${l.exercises.length} ${l.exercises.length === 1 ? "exercise" : "exercises"}`
                                  : ""}
                              </span>
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
