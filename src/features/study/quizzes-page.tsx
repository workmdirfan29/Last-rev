import { Link } from "react-router"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PASS_MARK_PERCENT, PHASE_QUIZ_MIN_POOL } from "@/config/study"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { usePlan } from "@/features/planner/use-plan"
import {
  moduleQuizInfo,
  phaseQuizInfo,
  quizPath,
  type QuizInfo,
} from "@/services/study/quizzes"
import { scorePercent } from "@/services/study/quiz"
import { useLearnerStore } from "@/stores/learner-store"
import { useStudyView } from "./use-study-view"

function QuizRow({ q }: { q: QuizInfo }) {
  const s = q.summary
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-card p-3">
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium">{q.title}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {q.available
            ? `${q.size} items from ${q.lessons.length} ${q.lessons.length === 1 ? "lesson" : "lessons"} (${q.pool} in the pool)`
            : q.pool === 0
              ? "No lessons are ready for this yet."
              : `Not enough lessons yet: ${q.pool} knowledge-check items, ${q.kind === "phase" ? PHASE_QUIZ_MIN_POOL : "at least 6"} needed.`}
          {s.best
            ? ` · Best ${scorePercent(s.best)}% · ${s.attempts.length} ${s.attempts.length === 1 ? "attempt" : "attempts"}`
            : q.available
              ? " · Not taken yet"
              : ""}
        </p>
        {q.available && q.suggested && !s.passed && (
          <p className="text-xs text-muted-foreground">
            You have finished most of these lessons, so this is a good time.
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {s.passed && <Badge variant="outline">Passed</Badge>}
        {q.available ? (
          <Button asChild size="sm" variant={s.passed ? "outline" : "default"}>
            <Link to={quizPath(q)}>
              {s.latest ? "Take it again" : "Take the quiz"}
            </Link>
          </Button>
        ) : (
          <Badge variant="secondary">In preparation</Badge>
        )}
      </div>
    </li>
  )
}

/** Phase and module quizzes, assembled from the knowledge checks of the lessons that exist. */
export function QuizzesPage() {
  const plan = usePlan("study")
  const view = useStudyView(plan)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  if (!view)
    return (
      <EmptyState
        title="No roadmap chosen yet"
        description="Pick a roadmap to see its quizzes."
        action={
          <Button asChild>
            <Link to="/study/plan">Choose a roadmap</Link>
          </Button>
        }
      />
    )
  const phaseQuizzes = view.views
    .filter((v) => !v.projectLed)
    .map((v) => phaseQuizInfo(v, LESSON_INDEX, progress, attempts))
    .filter((q) => q.pool > 0)
  const modules = [
    ...new Map(
      view.views.flatMap((v) =>
        v.modules.map((m) => [m.module.id, m.module] as const)
      )
    ).values(),
  ]
  const moduleQuizzes = modules
    .map((m) => moduleQuizInfo(m.id, m.title, LESSON_INDEX, progress, attempts))
    .filter((q) => q.pool > 0)
  const taken = attempts.length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="Quizzes"
        description={`Quizzes are made from the knowledge checks of the lessons that exist, so they grow as lessons are added. Every answer is checked exactly and shows the correct answer and a short explanation. A score is the percentage of items answered correctly; the pass mark is ${PASS_MARK_PERCENT}%. You can retake any quiz as often as you like.`}
      />
      {phaseQuizzes.length === 0 && moduleQuizzes.length === 0 ? (
        <EmptyState
          title="No quizzes yet"
          description="A quiz appears here once the lessons of a module or a phase hold enough knowledge-check items. You can still take each lesson's own check on its page."
        />
      ) : (
        <>
          {phaseQuizzes.length > 0 && (
            <section className="space-y-2" aria-labelledby="phase-quizzes">
              <h2 id="phase-quizzes" className="text-sm font-medium">
                Phase quizzes
              </h2>
              <ul className="space-y-2">
                {phaseQuizzes.map((q) => (
                  <QuizRow key={q.id} q={q} />
                ))}
              </ul>
            </section>
          )}
          {moduleQuizzes.length > 0 && (
            <section className="space-y-2" aria-labelledby="module-quizzes">
              <h2 id="module-quizzes" className="text-sm font-medium">
                Module quizzes
              </h2>
              <ul className="space-y-2">
                {moduleQuizzes.map((q) => (
                  <QuizRow key={q.id} q={q} />
                ))}
              </ul>
            </section>
          )}
          <p className="text-xs text-muted-foreground tabular-nums">
            {taken} {taken === 1 ? "attempt" : "attempts"} taken so far, all
            kept on this device.
          </p>
        </>
      )}
    </div>
  )
}
