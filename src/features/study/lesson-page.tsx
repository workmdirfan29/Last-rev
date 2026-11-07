import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { RichText } from "@/components/shared/rich-text"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { RatingButtons } from "@/components/shared/rating-buttons"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { Button } from "@/components/ui/button"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { NotesEditor } from "@/features/interview/components/notes-editor"
import { lessonsOfModuleIndex } from "@/services/lessons/coverage"
import {
  assignmentProgress,
  lessonFinished,
  taskDone,
} from "@/services/study/progress"
import {
  buildLessonQuiz,
  checkStatusText,
  summariseAttempts,
} from "@/services/study/quiz"
import { usePlan } from "@/features/planner/use-plan"
import { topicLessons } from "@/services/study/topic-completion"
import { useLearnerStore } from "@/stores/learner-store"
import { lessonIdOf, taskIdOf } from "@/types/lesson"
import { ExerciseView } from "./lesson/exercise-view"
import { SectionView } from "./lesson/lesson-sections"
import { QuizRunner, SCORE_MEANING } from "./lesson/quiz-runner"
import { useStudyLesson } from "./use-study-lessons"

const RECALL = [
  "I forgot it",
  "I remembered a little",
  "I remembered with effort",
  "I remembered it well",
  "I knew it at once",
]

export function LessonPage() {
  const { module = "", lesson = "" } = useParams()
  const id = lessonIdOf(module, lesson)
  // a new lesson starts with fresh state
  return <LessonView key={id} id={id} moduleId={module} />
}

function LessonView({ id, moduleId }: { id: string; moduleId: string }) {
  const { data: lesson, isLoading } = useStudyLesson(id)
  const mod = getModule(moduleId)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const reviewQuestion = useLearnerStore((s) => s.reviewQuestion)
  const setTopicDone = useLearnerStore((s) => s.setTopicDoneFromLessons)
  const plan = usePlan("study")
  const [seed, setSeed] = useState(1)
  const [checking, setChecking] = useState(false)
  const [now] = useState(() => new Date())

  const entry = LESSON_INDEX.find((l) => l.id === id)
  const siblings = useMemo(() => lessonsOfModuleIndex(moduleId), [moduleId])
  const position = siblings.findIndex((l) => l.id === id)
  const nextInModule = position >= 0 ? siblings[position + 1] : undefined
  const quiz = useMemo(
    () => (lesson ? buildLessonQuiz(lesson, seed) : []),
    [lesson, seed]
  )

  /**
   * Finishing the last lesson of a topic whose lessons cover it completes the topic's plan blocks, with an
   * Undo. Un-finishing a lesson never silently un-completes a topic.
   */
  async function toggleFinished() {
    if (!lesson || !entry) return
    const wasFinished = lessonFinished(id, useLearnerStore.getState().progress)
    await toggleCompleted(id, lesson.minutes, "lesson")
    if (wasFinished) return
    const p = useLearnerStore.getState().progress
    const minutes =
      mod?.topicList.find((t) => t.title === lesson.topic)?.minutes ?? 0
    const t = topicLessons(moduleId, lesson.topic, minutes, LESSON_INDEX, p)
    if (!t.complete || p[entry.topicId]?.completed) return
    const partIds = (plan?.blocks ?? [])
      .filter((b) => b.topicId === entry.topicId)
      .map((b) => b.id)
    await setTopicDone(entry.topicId, partIds, true)
    toast(`Topic complete: ${mod?.title}: ${lesson.topic}`, {
      description:
        "You finished all its lessons, so it is ticked in your plan.",
      action: {
        label: "Undo",
        onClick: () => void setTopicDone(entry.topicId, partIds, false),
      },
    })
  }

  if (isLoading) return <ScreenLoader />
  if (!lesson || !mod || !entry)
    return (
      <EmptyState
        title="Lesson not found"
        description="That lesson is not in the library."
        action={
          <Button asChild>
            <Link to="/study/lessons">Back to the lessons</Link>
          </Button>
        }
      />
    )

  const finished = lessonFinished(id, progress)
  const due =
    finished &&
    progress[id]?.nextReviewAt != null &&
    new Date(progress[id].nextReviewAt!) <= now
  const summary = summariseAttempts(attempts, id)
  const tasks = assignmentProgress(entry, progress)
  const sectionIds = lesson.sections.map((_, i) => `section-${i + 1}`)
  const toc = [
    ...lesson.sections.map((s, i) => ({
      id: sectionIds[i],
      label: s.kind === "mistakes" ? s.heading : s.heading,
    })),
    { id: "check", label: "Knowledge check" },
    { id: "assignment", label: "Assignment" },
    ...(lesson.exercises.length
      ? [{ id: "exercises", label: "Exercises" }]
      : []),
    { id: "revision-notes", label: "Revision notes" },
    { id: "resources", label: "Resources" },
    { id: "notes", label: "Your notes" },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow={`${mod.title} · ${lesson.topic} · ${lesson.minutes} min`}
        title={lesson.title}
        description={<RichText text={lesson.overview} />}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to={`/study/lessons/${moduleId}`}>
              <ArrowLeftIcon /> All {mod.title} lessons
            </Link>
          </Button>
        }
      />

      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        data-testid="lesson-status"
      >
        <span className="flex items-center gap-1.5">
          {finished ? (
            <CheckCircle2Icon className="size-4 text-success" aria-hidden />
          ) : (
            <CircleIcon className="size-4 text-muted-foreground" aria-hidden />
          )}
          {finished ? "Finished" : "Not finished"}
        </span>
        <span>Knowledge check: {checkStatusText(summary)}</span>
        <span className="tabular-nums">
          Assignment: {tasks.done} of {tasks.total} done
        </span>
      </div>

      <nav
        aria-label="On this page"
        className="lr-scroll -mx-1 overflow-x-auto px-1"
      >
        <ul className="flex w-max gap-2 text-xs">
          {toc.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="block rounded-md border border-border px-2 py-1 whitespace-nowrap text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="space-y-3" aria-labelledby="objectives">
        <h2
          id="objectives"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          What you will be able to do
        </h2>
        <ul className="lr-prose list-disc space-y-1 ps-5">
          {lesson.objectives.map((o) => (
            <li key={o}>
              <RichText text={o} />
            </li>
          ))}
        </ul>
        {lesson.prerequisites.length > 0 && (
          <p
            className="text-sm text-muted-foreground"
            data-testid="prerequisites"
          >
            Helps to know first:{" "}
            {lesson.prerequisites.map((p, i) => {
              const l = LESSON_INDEX.find((x) => x.id === p)
              const m = getModule(p)
              return (
                <span key={p}>
                  {i > 0 && ", "}
                  {l ? (
                    <Link
                      className="underline underline-offset-4"
                      to={`/study/lesson/${l.moduleId}/${l.slug}`}
                    >
                      {l.title}
                    </Link>
                  ) : (
                    <span>{m?.title ?? p}</span>
                  )}
                  {l && lessonFinished(l.id, progress) ? " (finished)" : ""}
                </span>
              )
            })}
            . You are never locked out of a lesson.
          </p>
        )}
      </section>

      {lesson.sections.map((s, i) => (
        <SectionView key={i} section={s} id={sectionIds[i]} />
      ))}

      <section className="space-y-3" aria-labelledby="check" id="check">
        <h2 className="scroll-mt-20 font-heading text-lg font-semibold tracking-tight">
          Knowledge check
        </h2>
        {!checking ? (
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <p className="text-sm">
              {lesson.check.length} items. Each shows the correct answer and a
              short explanation after you answer. You can retake it as often as
              you like.
            </p>
            <p className="text-xs text-muted-foreground">{SCORE_MEANING}</p>
            <Button type="button" onClick={() => setChecking(true)}>
              {summary.latest ? "Take it again" : "Start the check"}
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4">
            <QuizRunner
              key={seed}
              items={quiz}
              quizId={id}
              kind="lesson"
              seed={seed}
              onRetake={() => setSeed(seed + 1)}
            />
          </div>
        )}
      </section>

      <section
        className="space-y-3"
        aria-labelledby="assignment-h"
        id="assignment"
      >
        <h2
          id="assignment-h"
          className="scroll-mt-20 font-heading text-lg font-semibold tracking-tight"
        >
          Assignment: {lesson.assignment.title}
        </h2>
        {lesson.assignment.task.map((t, i) => (
          <p key={i} className="lr-prose">
            <RichText text={t} />
          </p>
        ))}
        <fieldset className="space-y-2 rounded-xl border border-border bg-card p-4">
          <legend className="px-1 text-sm font-medium">
            You are done when ({tasks.done} of {tasks.total} ticked)
          </legend>
          {lesson.assignment.checklist.map((c, i) => {
            const taskId = taskIdOf(moduleId, lesson.slug, i + 1)
            return (
              <label key={taskId} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-[var(--primary)]"
                  checked={taskDone(moduleId, lesson.slug, i + 1, progress)}
                  onChange={() => void toggleCompleted(taskId, 0, "lesson")}
                />
                <span>
                  <RichText text={c} />
                </span>
              </label>
            )
          })}
        </fieldset>
        {lesson.assignment.hints.length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">
              Hints
            </summary>
            <ul className="lr-prose mt-2 list-disc space-y-1 ps-5">
              {lesson.assignment.hints.map((h, i) => (
                <li key={i}>
                  <RichText text={h} />
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {lesson.exercises.length > 0 && (
        <section
          className="space-y-3"
          aria-labelledby="exercises-h"
          id="exercises"
        >
          <h2
            id="exercises-h"
            className="scroll-mt-20 font-heading text-lg font-semibold tracking-tight"
          >
            Exercises
          </h2>
          {lesson.exercises.map((e) => (
            <div key={e.slug} className="space-y-2">
              <ExerciseView
                moduleId={moduleId}
                lessonSlug={lesson.slug}
                exercise={e}
              />
              {e.run && (
                <Link
                  className="text-xs text-brand-ink underline underline-offset-4"
                  to={`/study/practice/${moduleId}/${lesson.slug}/${e.slug}`}
                >
                  Run this exercise in the sandbox
                </Link>
              )}
            </div>
          ))}
        </section>
      )}

      <section
        className="space-y-3"
        aria-labelledby="revision-h"
        id="revision-notes"
      >
        <h2
          id="revision-h"
          className="scroll-mt-20 font-heading text-lg font-semibold tracking-tight"
        >
          Revision notes
        </h2>
        <ul className="lr-prose list-disc space-y-1 ps-5">
          {lesson.revisionNotes.map((n) => (
            <li key={n}>
              <RichText text={n} />
            </li>
          ))}
        </ul>
      </section>

      <section
        className="space-y-3"
        aria-labelledby="resources-h"
        id="resources"
      >
        <h2
          id="resources-h"
          className="scroll-mt-20 font-heading text-lg font-semibold tracking-tight"
        >
          Official documentation
        </h2>
        <ul className="space-y-1 text-sm">
          {lesson.resources.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-ink underline underline-offset-4"
              >
                {r.label} <ExternalLinkIcon className="size-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="notes" className="scroll-mt-20">
        <NotesEditor key={id} questionId={id} />
      </section>

      <section
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        aria-label="Finish the lesson"
      >
        {due && (
          <div className="space-y-2" data-testid="revision-due">
            <p className="text-sm font-medium">
              This lesson is due for revision.
            </p>
            <RatingButtons
              legend="How well do you remember it?"
              anchors={RECALL}
              value={null}
              onPick={(n) => void reviewQuestion(id, n)}
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={finished ? "default" : "outline"}
            aria-pressed={finished}
            onClick={() => void toggleFinished()}
          >
            <CheckCircle2Icon />{" "}
            {finished ? "Lesson finished" : "Mark this lesson finished"}
          </Button>
          {finished && nextInModule && (
            <Button asChild variant="link">
              <Link
                to={`/study/lesson/${nextInModule.moduleId}/${nextInModule.slug}`}
              >
                Next: {nextInModule.title}
              </Link>
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Finishing is your choice. It does not depend on the knowledge check.
        </p>
      </section>
    </div>
  )
}
