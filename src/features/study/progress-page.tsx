import { useMemo } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatTile } from "@/components/shared/stat-tile"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { usePlan } from "@/features/planner/use-plan"
import { useFullIndex } from "@/hooks/use-content"
import { questionStatsLookup } from "@/services/curriculum/progress"
import { moduleProgress } from "@/services/study/module-progress"
import { scorePercent, summariseAttempts } from "@/services/study/quiz"
import {
  PHASE_STATE_LABEL,
  phaseState,
  phaseStats,
} from "@/services/study/roadmap"
import { useLearnerStore } from "@/stores/learner-store"
import { useStudyView } from "./use-study-view"

/**
 * Study progress, from real records only. Every percentage sits next to the raw counts it comes from, and the
 * formula is stated, so nothing here is a number you cannot trace.
 */
export function StudyProgressPage() {
  const plan = usePlan("study")
  const view = useStudyView(plan)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const activity = useLearnerStore((s) => s.activity)
  const full = useFullIndex()
  const questions = useMemo(
    () =>
      questionStatsLookup(
        (full ?? []).filter((q) => !progress[q.id]?.removed),
        progress
      ),
    [full, progress]
  )

  if (!plan || !view)
    return (
      <EmptyState
        title="No roadmap chosen yet"
        description="Pick a roadmap to see your progress."
        action={
          <Button asChild>
            <Link to="/study/plan">Choose a roadmap</Link>
          </Button>
        }
      />
    )

  const lessons = view.lessons
  const finished = lessons.filter((l) => progress[l.id]?.completed).length
  const stats = view.views.map((v) => ({
    v,
    s: phaseStats(v, LESSON_INDEX, progress),
  }))
  const topicsTotal = stats.reduce((n, x) => n + x.s.topicsTotal, 0)
  const topicsDone = stats.reduce((n, x) => n + x.s.topicsDone, 0)
  const withCheck = lessons.filter((l) => l.check.length > 0)
  const passed = withCheck.filter(
    (l) => summariseAttempts(attempts, l.id).passed
  ).length
  const minutes = activity
    .filter((a) => a.type === "lesson")
    .reduce((n, a) => n + a.minutes, 0)
  const moduleIds = [...new Set(lessons.map((l) => l.moduleId))]
  const modulesInRoadmap = new Set(
    view.views.flatMap((v) => v.modules.map((m) => m.module.id))
  )
  const rows = moduleIds
    .map((id) => plan.entries.find((e) => e.module.id === id)?.module)
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => {
      const q = questions(m.id)
      return {
        m,
        p: moduleProgress(m, LESSON_INDEX, progress, attempts, {
          done: q.completed,
          available: q.available,
        }),
      }
    })
  const recent = [...attempts]
    .sort((a, b) => b.takenAt.localeCompare(a.takenAt))
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="My progress"
        description="Every number comes from what you actually did. Percentages always sit next to their counts."
      />

      <section
        aria-label="Totals"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatTile
          label="Lessons finished"
          value={`${finished} of ${lessons.length}`}
          hint={`${modulesInRoadmap.size - moduleIds.length} modules in your roadmap have no lessons yet`}
        />
        <StatTile
          label="Topics done"
          value={`${topicsDone} of ${topicsTotal}`}
          hint="in your roadmap's phases"
        />
        <StatTile
          label="Knowledge checks passed"
          value={`${passed} of ${withCheck.length}`}
          hint={`${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"} in all`}
        />
        <StatTile
          label="Study time logged"
          value={`${minutes} min`}
          hint="from lessons and plan blocks you finished"
        />
      </section>

      <section className="space-y-3" aria-labelledby="by-phase">
        <h2 id="by-phase" className="text-sm font-medium">
          By phase
        </h2>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {stats.map(({ v, s }) => (
            <li
              key={v.phase.number}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
            >
              <span className="font-medium">
                {v.phase.number}. {v.phase.title}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {PHASE_STATE_LABEL[phaseState(v, s)]}
                {v.projectLed
                  ? ""
                  : ` · ${s.lessonsFinished} of ${s.lessonsReady} lessons · ${s.topicsDone} of ${s.topicsTotal} topics`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="by-module">
        <h2 id="by-module" className="text-sm font-medium">
          Modules with lessons
        </h2>
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No lessons are ready for your roadmap yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {rows.map(({ m, p }) => {
              const pct = Math.round(p.percent * 100)
              return (
                <li
                  key={m.id}
                  className="space-y-1.5"
                  data-testid={`module-progress-${m.id}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <Link
                      className="text-sm font-medium underline-offset-4 hover:underline"
                      to={`/study/lessons/${m.id}`}
                    >
                      {m.title}
                    </Link>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <Progress value={pct} aria-label={`${m.title} progress`} />
                  <p className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground tabular-nums">
                    <span>
                      Topics {p.topics.done}/{p.topics.total}
                    </span>
                    <span>
                      Lessons {p.lessons.done}/{p.lessons.total}
                    </span>
                    <span>
                      Assignment ticks {p.assignments.done}/
                      {p.assignments.total}
                    </span>
                    {p.exercises.total > 0 && (
                      <span>
                        Exercises {p.exercises.done}/{p.exercises.total}
                      </span>
                    )}
                    <span>
                      Checks passed {p.checks.passed}/{p.checks.total}
                    </span>
                    {p.moduleQuiz.exists && (
                      <span>
                        Module quiz{" "}
                        {p.moduleQuiz.passed ? "passed" : "not passed"}
                      </span>
                    )}
                    <span>
                      {p.questions.available > 0
                        ? `Questions ${p.questions.done}/${p.questions.available}`
                        : "no questions yet"}
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">
          How the percentage is made: the plain average of the parts a module
          has: topics done, practice (assignment ticks and exercises), quizzes
          (lesson checks passed and the module quiz) and questions done. A part
          a module does not have is left out. It measures what you marked and
          answered, not how well you know the subject.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="recent">
        <h2 id="recent" className="text-sm font-medium">
          Recent knowledge checks and quizzes
        </h2>
        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            You have not taken a check yet.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card text-sm">
            {recent.map((a) => {
              const l = LESSON_INDEX.find((x) => x.id === a.quizId)
              const label = l
                ? l.title
                : a.quizId.startsWith("module.")
                  ? `${getModule(a.quizId.slice(7))?.title ?? a.quizId} quiz`
                  : a.quizId.startsWith("phase.")
                    ? `Phase ${a.quizId.split(".").at(-1)} quiz`
                    : a.quizId
              return (
                <li
                  key={a.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-2.5"
                >
                  <span>{label}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {a.correct} of {a.total} correct ({scorePercent(a)}%) ·{" "}
                    {a.passed ? "passed" : "not passed"} ·{" "}
                    {format(new Date(a.takenAt), "d MMM, HH:mm")}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
