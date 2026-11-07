import { useMemo, useState } from "react"
import { Link } from "react-router"
import { ClockIcon, LayersIcon, TargetIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatTile } from "@/components/shared/stat-tile"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { dueLessons } from "@/services/study/progress"
import { phaseStats } from "@/services/study/roadmap"
import { PhaseSummary } from "./phase-card"
import { phaseQuizInfo, quizPath } from "@/services/study/quizzes"
import { PlanOrderNotice } from "./plan-order-notice"
import { WeeklyMilestones } from "./weekly-milestones"
import { useStudyView } from "./use-study-view"
import { getModule } from "@/data/catalog/modules"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import { daysUntil, estimateFromMinutes } from "@/services/planner/estimate"
import { useLearnerStore } from "@/stores/learner-store"
import { PROFILE_EXPERIENCE_META } from "@/types/learner"
import { PlanStatus } from "@/features/planner/plan-status"
import { TodayCard } from "@/features/planner/today-card"
import { usePlan, usePlanActions } from "@/features/planner/use-plan"
import { WeekStrip } from "@/features/planner/week-strip"

/**
 * Study home: the next lesson, the phase the learner is in, today's plan blocks (linked to their lessons), the
 * week, and the roadmap at a glance. It works with any amount of lesson content: with none, it says so and
 * the plan still runs; counts are always the real ones.
 */
export function StudyHomePage() {
  const profile = useLearnerStore((s) => s.profile)
  const roadmap = getRoadmap(profile?.studyRoadmap)
  const studyPlan = usePlan("study")
  const planActions = usePlanActions(studyPlan)
  const view = useStudyView(studyPlan)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const [now] = useState(() => new Date())
  const due = dueLessons(progress, now)

  const data = useMemo(() => {
    if (!roadmap || !profile) return null
    const defaults = defaultsForRoadmap(roadmap.id)
    const entries = resolveSyllabus({
      defaults,
      overrides: profile.studySyllabusOverrides,
      experience: profile.experience,
      scope: "study",
    })
    const modules = entries.filter((e) => e.selected)
    const minutes = modules
      .filter((e) => !e.deferred)
      .reduce((n, e) => n + e.minutes, 0)
    const targetDays = profile.targetDate
      ? Math.max(1, daysUntil(profile.targetDate))
      : 30
    const plan = estimateFromMinutes({
      moduleCount: modules.length,
      totalMinutes: minutes,
      dailyHours: profile.dailyStudyHours,
      targetDays,
    })
    return { modules, plan }
  }, [roadmap, profile])

  if (!profile || !roadmap || !data) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Study Path" title="Study home" />
        <EmptyState
          title="No roadmap chosen yet"
          description="Pick a roadmap to see its modules and your study plan."
          action={
            <Button asChild>
              <Link to="/study/plan">Choose a roadmap</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const { plan } = data

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title={roadmap.title}
        description={roadmap.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/study/plan">Change roadmap or pace</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="next-lesson-heading"
          className="space-y-3 rounded-xl border border-border bg-card p-4"
        >
          <h2 id="next-lesson-heading" className="text-sm font-medium">
            Next lesson
          </h2>
          {view?.next ? (
            <>
              <p className="text-sm">
                <span className="block font-medium">{view.next.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {getModule(view.next.moduleId)?.title} · {view.next.topic} ·{" "}
                  {view.next.minutes} min
                </span>
              </p>
              <Button asChild>
                <Link
                  to={`/study/lesson/${view.next.moduleId}/${view.next.slug}`}
                >
                  Open the lesson
                </Link>
              </Button>
            </>
          ) : (
            <p
              className="text-sm text-muted-foreground"
              data-testid="no-next-lesson"
            >
              {view && view.lessons.length > 0
                ? "You have finished every lesson that is ready. More are added module by module."
                : "No lessons are ready for your roadmap yet. Your plan below still works: tick topics as you study them."}
            </p>
          )}
          {due.length > 0 && (
            <p className="text-xs" data-testid="study-due">
              {due.length} {due.length === 1 ? "lesson is" : "lessons are"} due
              for revision.{" "}
              <Link
                className="underline underline-offset-4"
                to="/study/lessons"
              >
                Open the lessons
              </Link>
            </p>
          )}
        </section>

        <section
          aria-labelledby="current-phase-heading"
          className="space-y-3 rounded-xl border border-border bg-card p-4"
        >
          <h2 id="current-phase-heading" className="text-sm font-medium">
            Where you are
          </h2>
          {view?.current ? (
            <>
              <p className="text-sm">
                <span className="block text-xs text-muted-foreground">
                  Phase {view.current.phase.number} of {view.views.length}
                </span>
                <span className="block font-medium">
                  {view.current.phase.title}
                </span>
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {(() => {
                  const s = phaseStats(view.current, LESSON_INDEX, progress)
                  return `${s.topicsDone} of ${s.topicsTotal} topics done · ${s.lessonsFinished} of ${s.lessonsReady} ready lessons finished`
                })()}
              </p>
              {(() => {
                const q = phaseQuizInfo(
                  view.current,
                  LESSON_INDEX,
                  progress,
                  attempts
                )
                return q.available && q.suggested ? (
                  <p className="text-xs" data-testid="phase-quiz-card">
                    You have finished most of this phase&apos;s lessons.{" "}
                    <Link
                      className="font-medium text-brand-ink underline underline-offset-4"
                      to={quizPath(q)}
                    >
                      Take the phase quiz
                    </Link>
                    {q.summary.passed ? " (passed before)" : ""}
                  </p>
                ) : null
              })()}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Every phase with topics is done.
            </p>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to="/study/roadmap">See the roadmap</Link>
          </Button>
        </section>
      </div>

      {studyPlan && (
        <>
          <PlanOrderNotice plan={studyPlan} actions={planActions} />
          <TodayCard
            plan={studyPlan}
            actions={planActions}
            dueReviews={0}
            heading="Today's study plan"
            showRevisionLink={false}
          />
          <WeeklyMilestones plan={studyPlan} />
          <WeekStrip plan={studyPlan} />
          <PlanStatus
            plan={studyPlan}
            actions={planActions}
            editHref="/study/plan"
            removedHref="/settings/syllabus#removed-blocks"
          />
        </>
      )}

      <section
        aria-label="Your study plan"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatTile
          icon={LayersIcon}
          label="Modules"
          value={String(plan.moduleCount)}
          hint={PROFILE_EXPERIENCE_META[profile.experience].label}
        />
        <StatTile
          icon={ClockIcon}
          label="Study hours"
          value={`about ${plan.totalHours}`}
          hint="planning estimate"
        />
        <StatTile
          icon={TargetIcon}
          label="At your pace"
          value={`${plan.daysNeeded} days`}
          hint={`${profile.dailyStudyHours} h / day`}
        />
        <StatTile
          icon={TargetIcon}
          label="Be ready by"
          value={profile.targetDate ?? "Not set"}
          hint={
            plan.fits
              ? "fits your pace"
              : `needs ${plan.requiredHoursPerDay} h / day`
          }
        />
      </section>

      {view && (
        <section aria-labelledby="glance-heading" className="space-y-3">
          <div className="space-y-1">
            <h2
              id="glance-heading"
              className="font-heading text-lg font-semibold tracking-tight"
            >
              Roadmap at a glance
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Hours are planning estimates, not measurements. Phases with no
              lessons yet say so.
            </p>
          </div>
          <ol className="divide-y divide-border rounded-xl border border-border bg-card">
            {view.views.map((v) => (
              <li key={v.phase.number} className="px-4 py-3 text-sm">
                <PhaseSummary view={v} />
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
