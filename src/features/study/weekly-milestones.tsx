import { useMemo, useState } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { projectsOfRoadmap } from "@/data/projects"
import type { Plan } from "@/features/planner/use-plan"
import {
  plannedWeeks,
  weekEndOf,
  weekMilestones,
  weekStartOf,
} from "@/services/study/milestones"
import { useLearnerStore } from "@/stores/learner-store"
import { fromDateKey } from "@/utils/dates"
import { useStudyView } from "./use-study-view"

const day = (k: string) => format(fromDateKey(k), "d MMM")

function Mark({ done, label }: { done: boolean; label: string }) {
  return done ? (
    <CheckCircle2Icon
      className="mt-0.5 size-4 shrink-0 text-success"
      aria-label={`${label}: done`}
    />
  ) : (
    <CircleIcon
      className="mt-0.5 size-4 shrink-0 text-muted-foreground/50"
      aria-label={`${label}: not done`}
    />
  )
}

/**
 * Each week of the study plan: the lessons, assignments, quiz and project step due, with "done" taken from the
 * learner's records. Nothing here is stored. A week whose topics have no lessons yet says so.
 */
export function WeeklyMilestones({ plan }: { plan: Plan }) {
  const view = useStudyView(plan)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const weeks = useMemo(
    () => plannedWeeks(plan.schedule.blocks),
    [plan.schedule.blocks]
  )
  const thisWeek = weekStartOf(plan.today)
  const firstAfter = weeks.find((w) => w >= thisWeek) ?? weeks.at(-1)
  const [chosen, setChosen] = useState<string | null>(null)
  const week = chosen ?? firstAfter

  const m = useMemo(
    () =>
      week && view
        ? weekMilestones(week, {
            blocks: plan.schedule.blocks,
            views: view.views,
            index: LESSON_INDEX,
            projects: projectsOfRoadmap(view.roadmap.id),
            roadmapId: view.roadmap.id,
            progress,
            attempts,
          })
        : null,
    [week, view, plan.schedule.blocks, progress, attempts]
  )
  if (!view || !week || !m) return null
  const i = weeks.indexOf(week)
  const nothing =
    m.lessons.length === 0 &&
    m.quizzes.length === 0 &&
    m.projectSteps.length === 0

  return (
    <section
      aria-labelledby="milestones-heading"
      className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5"
      data-testid="weekly-milestones"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="milestones-heading"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {week === thisWeek ? "This week's milestones" : "Weekly milestones"}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {day(m.weekStart)} to {day(weekEndOf(m.weekStart))}
          </span>
        </h2>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={i <= 0}
            aria-label="Previous week"
            onClick={() => setChosen(weeks[i - 1])}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={i >= weeks.length - 1}
            aria-label="Next week"
            onClick={() => setChosen(weeks[i + 1])}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {m.topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing is planned for this week.
        </p>
      ) : (
        <>
          <p
            className="text-sm text-muted-foreground"
            data-testid="milestone-topics"
          >
            Topics in your plan:{" "}
            {m.topics.map((t) => `${t.moduleTitle}: ${t.topic}`).join(" · ")}
          </p>
          {m.topicsWithoutLessons.length > 0 && (
            <p
              className="text-xs text-muted-foreground"
              data-testid="milestone-no-lessons"
            >
              No lesson is written yet for:{" "}
              {m.topicsWithoutLessons.map((t) => t.topic).join(", ")}. Tick
              those topics in your plan as you study them.
            </p>
          )}
          {nothing && m.topicsWithoutLessons.length === m.topics.length && (
            <p className="text-sm">
              There are no lessons, quizzes or project steps for this week yet.
            </p>
          )}

          {m.lessons.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Lessons and assignments
              </h3>
              <ul className="space-y-1.5 text-sm">
                {m.lessons.map(({ entry, finished }) => {
                  const a = m.assignments.find((x) => x.entry.id === entry.id)!
                  return (
                    <li key={entry.id} className="flex items-start gap-2">
                      <Mark done={finished} label="Lesson" />
                      <span className="min-w-0 flex-1">
                        <Link
                          className="underline underline-offset-4"
                          to={`/study/lesson/${entry.moduleId}/${entry.slug}`}
                        >
                          {entry.title}
                        </Link>
                        <span className="ms-2 text-xs text-muted-foreground tabular-nums">
                          assignment {a.done} of {a.total} · {entry.minutes} min
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {m.quizzes.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Quizzes due
              </h3>
              <ul className="space-y-1.5 text-sm">
                {m.quizzes.map((q) => (
                  <li key={q.quiz.id} className="flex items-start gap-2">
                    <Mark done={q.passed} label="Quiz" />
                    <span>
                      <Link
                        className="underline underline-offset-4"
                        to={q.path}
                      >
                        {q.quiz.title}
                      </Link>
                      <span className="ms-2 text-xs text-muted-foreground">
                        {q.reason}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {m.projectSteps.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Project steps due
              </h3>
              <ul className="space-y-1.5 text-sm">
                {m.projectSteps.map((s) => (
                  <li
                    key={`${s.project.id}-${s.stepIndex}`}
                    className="flex items-start gap-2"
                  >
                    <Mark done={s.done} label="Project step" />
                    <span>
                      <Link
                        className="underline underline-offset-4"
                        to={`/study/projects/${s.project.id}`}
                      >
                        {s.project.title}
                      </Link>
                      <span className="ms-2 text-xs text-muted-foreground">
                        step {s.stepIndex + 1}: {s.title}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}
