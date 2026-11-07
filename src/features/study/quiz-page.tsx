import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import { format } from "date-fns"
import { ArrowLeftIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { Button } from "@/components/ui/button"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { usePlan } from "@/features/planner/use-plan"
import { buildQuiz, scorePercent } from "@/services/study/quiz"
import {
  moduleQuizInfo,
  phaseQuizInfo,
  type QuizInfo,
} from "@/services/study/quizzes"
import { useLearnerStore } from "@/stores/learner-store"
import { QuizRunner, SCORE_MEANING } from "./lesson/quiz-runner"
import { useStudyLessons } from "./use-study-lessons"
import { useStudyView } from "./use-study-view"

/** A module or phase quiz: items drawn from the lessons' knowledge checks, a new set each time. */
export function QuizPage() {
  const { kind = "", id = "" } = useParams()
  const plan = usePlan("study")
  const view = useStudyView(plan)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)

  const info: QuizInfo | null = useMemo(() => {
    if (kind === "module") {
      const m = getModule(id)
      return m
        ? moduleQuizInfo(id, m.title, LESSON_INDEX, progress, attempts)
        : null
    }
    if (kind === "phase") {
      const v = view?.views.find((x) => String(x.phase.number) === id)
      return v && !v.projectLed
        ? phaseQuizInfo(v, LESSON_INDEX, progress, attempts)
        : null
    }
    return null
  }, [kind, id, view, progress, attempts])

  if ((kind === "phase" && !view) || !info || info.pool === 0)
    return (
      <EmptyState
        title="That quiz is not available"
        description="Quizzes are made from lessons that exist. Its lessons are still being written."
        action={
          <Button asChild>
            <Link to="/study/quizzes">Back to the quizzes</Link>
          </Button>
        }
      />
    )
  return <QuizView key={info.id} info={info} />
}

function QuizView({ info }: { info: QuizInfo }) {
  const lessonIds = info.lessons.map((l) => l.id)
  const { data: lessons, isLoading } = useStudyLessons(
    info.available ? lessonIds : []
  )
  const [seed, setSeed] = useState(() => info.summary.attempts.length + 1)
  const items = useMemo(
    () =>
      lessons
        ? buildQuiz(lessons, { count: info.size, seed, scope: info.id })
        : [],
    [lessons, info.size, info.id, seed]
  )
  const history = [...info.summary.attempts].reverse()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Study Path · Quiz"
        title={info.title}
        description={`${info.size} items drawn from ${info.lessons.length} ${info.lessons.length === 1 ? "lesson" : "lessons"}. A different set each time you retake it.`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/study/quizzes">
              <ArrowLeftIcon /> All quizzes
            </Link>
          </Button>
        }
      />
      {!info.available ? (
        <EmptyState
          title="Not enough lessons yet"
          description={`This quiz opens when its lessons hold enough knowledge-check items. There are ${info.pool} so far; ${info.missing} more are needed.`}
        />
      ) : isLoading || !lessons ? (
        <ScreenLoader />
      ) : (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">{SCORE_MEANING}</p>
          <QuizRunner
            key={seed}
            items={items}
            quizId={info.id}
            kind={info.kind}
            seed={seed}
            onRetake={() => setSeed(seed + 1)}
          />
        </div>
      )}
      <section className="space-y-2" aria-labelledby="quiz-history">
        <h2 id="quiz-history" className="text-sm font-medium">
          Your attempts
        </h2>
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            You have not taken this quiz yet.
          </p>
        ) : (
          <ul
            className="divide-y divide-border rounded-xl border border-border bg-card text-sm"
            data-testid="quiz-history"
          >
            {history.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 px-4 py-2.5"
              >
                <span className="tabular-nums">
                  {a.correct} of {a.total} correct ({scorePercent(a)}%)
                </span>
                <span className="text-xs text-muted-foreground">
                  {a.passed ? "passed" : "not passed"} ·{" "}
                  {format(new Date(a.takenAt), "d MMM, HH:mm")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
