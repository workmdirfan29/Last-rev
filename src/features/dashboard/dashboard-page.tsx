import { Link } from "react-router"
import { ArrowRightIcon, FlameIcon, TargetIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { StatTile } from "@/components/shared/stat-tile"
import { getModule } from "@/data/catalog/modules"
import { getRole } from "@/data/catalog/roles"
import { PlanStatus } from "@/features/planner/plan-status"
import { SyllabusProgress } from "@/features/planner/syllabus-progress"
import { TodayCard } from "@/features/planner/today-card"
import { usePlan, usePlanActions } from "@/features/planner/use-plan"
import { WeekStrip } from "@/features/planner/week-strip"
import { useSummary } from "@/features/progress/use-summary"
import { scoreSession } from "@/services/mock/score"
import { daysUntil } from "@/services/planner/estimate"
import { useLearnerStore } from "@/stores/learner-store"
import { HR_MODULE_IDS } from "@/data/catalog/modules/hr"
import { LEVEL_META, isHrModuleId } from "@/types/content"
import { ReadinessCard } from "./readiness-card"
import { WeeklyChart } from "./weekly-chart"

function greeting(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const dayCount = (n: number) => `${n} ${n === 1 ? "day" : "days"}`

function deadlineText(label: string, date: string | null): string | null {
  if (!date) return null
  const n = daysUntil(date)
  if (n > 0) return `${dayCount(n)} to your ${label} (${date})`
  if (n === 0) return `Your ${label} is today`
  return `Your ${label} was ${dayCount(Math.abs(n))} ago (${date})`
}

/** The HR interview feature at a glance: categories started and answers saved, from the learner's own progress. */
function HrCard() {
  const progress = useLearnerStore((s) => s.progress)
  const answers = useLearnerStore((s) => s.hrAnswers)
  const started = new Set(
    Object.values(progress)
      .filter(
        (p) =>
          p.completed && !p.removed && isHrModuleId(p.questionId.split(".")[0])
      )
      .map((p) => p.questionId.split(".")[0])
  ).size
  return (
    <Link
      to="/hr"
      className="block space-y-1 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span className="block text-sm font-medium">HR interview</span>
      <span className="block text-xs text-muted-foreground">
        {started} of {HR_MODULE_IDS.length} categories practised ·{" "}
        {answers.length} {answers.length === 1 ? "answer" : "answers"} saved
      </span>
    </Link>
  )
}

/** Mock interviews done and the latest score, from real finished sessions only. */
function MockCard() {
  const sessions = useLearnerStore((s) => s.mockSessions)
  const finished = sessions
    .filter((m) => m.status === "finished")
    .sort((a, b) => (b.finishedAt ?? "").localeCompare(a.finishedAt ?? ""))
  const last = finished
    .map((m) => scoreSession(m).score)
    .find((x) => x !== null)
  return (
    <Link
      to="/mock"
      className="block space-y-1 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span className="block text-sm font-medium">Mock interviews</span>
      <span className="block text-xs text-muted-foreground">
        {finished.length === 0
          ? "None yet. Start one to practise under a timer."
          : `${finished.length} done${last === undefined ? "" : `, last score ${Math.round(last)}`}`}
      </span>
    </Link>
  )
}

/** Resume questions practised, from real data only; an invitation until a resume is imported. */
function ResumeCard() {
  const resume = useLearnerStore((s) => s.resume)
  const questions = useLearnerStore((s) => s.resumeQuestions)
  const progress = useLearnerStore((s) => s.progress)
  const live = questions.filter((q) => !progress[q.id]?.removed)
  const practised = live.filter((q) => progress[q.id]?.completed).length
  return (
    <Link
      to="/resume"
      className="block space-y-1 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span className="block text-sm font-medium">Resume interview</span>
      <span className="block text-xs text-muted-foreground">
        {resume
          ? `Resume questions: ${practised} practised of ${live.length}`
          : "Import your resume to practise questions about it."}
      </span>
    </Link>
  )
}

export function DashboardPage() {
  const profile = useLearnerStore((s) => s.profile)
  const { summary } = useSummary()
  const plan = usePlan("interview")
  const actions = usePlanActions(plan)

  if (!summary || !profile || !plan) return <ScreenLoader />

  const primary = profile.primaryRole ? getRole(profile.primaryRole) : undefined
  const roleId = profile.primaryRole ?? profile.selectedRoles[0]
  const next = summary.dueReviews[0] ?? summary.continueQuestion
  const facts = [
    deadlineText("target date", profile.targetDate),
    deadlineText("interview", profile.interviewDate),
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={primary ? `Preparing for ${primary.title}` : "Overview"}
        title={`${greeting(new Date().getHours())}${profile.displayName ? `, ${profile.displayName}` : ""}`}
        description={
          facts.length ? facts.join(" · ") : "Your plan for today is below."
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/interview/manage">Manage my prep</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/onboarding">Edit plan</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <TodayCard
            plan={plan}
            actions={actions}
            dueReviews={summary.dueReviews.length}
          />
          <WeekStrip plan={plan} />
          <PlanStatus
            plan={plan}
            actions={actions}
            editHref="/settings/syllabus"
            removedHref="/interview/manage?tab=removed#removed-blocks"
          />

          <section
            aria-labelledby="next-heading"
            className="rounded-xl border border-border bg-card p-4"
          >
            <h2
              id="next-heading"
              className="mb-3 flex items-center gap-2 text-sm font-medium"
            >
              <TargetIcon
                className="size-4 text-muted-foreground"
                aria-hidden
              />{" "}
              Questions: what to do next
            </h2>
            {next ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{next.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {summary.dueReviews[0]
                      ? "Due for revision"
                      : "Continue learning"}{" "}
                    · {getModule(next.moduleId)?.title} ·{" "}
                    {LEVEL_META[next.level].label}
                  </p>
                </div>
                <Button asChild>
                  <Link to={`/interview/question/${next.id}`}>
                    {summary.dueReviews[0] ? "Revise now" : "Continue"}{" "}
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </div>
            ) : summary.totalQuestions === 0 ? (
              <p className="text-sm text-muted-foreground">
                No interview questions are ready yet for the modules in your
                syllabus. They are added module by module; see which are ready
                in the{" "}
                <Link className="underline underline-offset-4" to="/interview">
                  Interview Zone
                </Link>
                .
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                You have completed every question that is ready in your
                syllabus. More are added module by module.
              </p>
            )}
          </section>

          <SyllabusProgress plan={plan} libraryRoleId={roleId} />
        </div>

        <aside
          className="min-w-0 space-y-5"
          aria-label="Streak, activity, readiness and weak topics"
        >
          <StatTile
            label="Streak"
            icon={FlameIcon}
            value={dayCount(summary.streak.current)}
            hint={
              summary.streak.studiedToday
                ? "You studied today"
                : summary.streak.current > 0
                  ? "Study today to keep it"
                  : `Longest streak: ${summary.streak.longest}`
            }
          />

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-medium">
                Study minutes, last 7 days
              </h2>
              <span className="text-xs text-muted-foreground">
                {summary.week.reduce((s, d) => s + d.minutes, 0)} min
              </span>
            </div>
            <WeeklyChart week={summary.week} />
            <p className="mt-2 text-[0.6875rem] text-muted-foreground">
              Minutes come from plan blocks you finish and questions you
              complete or revise.
            </p>
          </div>

          <ReadinessCard summary={summary} />

          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-1 text-sm font-medium">Weak topics</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              From questions you rated 1 or 2, or marked difficult.
            </p>
            {summary.weakTopics.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nothing flagged yet. Rate your confidence on a question and weak
                spots appear here.
              </p>
            ) : (
              <ul className="space-y-2">
                {summary.weakTopics.map((w) => (
                  <li
                    key={`${w.moduleId}-${w.topic}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="min-w-0 truncate">
                      {w.topic}{" "}
                      <span className="text-xs text-muted-foreground">
                        · {getModule(w.moduleId)?.title}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {w.count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <HrCard />
          <MockCard />
          <ResumeCard />
          <p className="text-xs text-muted-foreground">
            Want to change what you prepare?{" "}
            <Link
              className="underline underline-offset-4"
              to="/interview/manage"
            >
              Manage my prep
            </Link>
          </p>
        </aside>
      </div>
    </div>
  )
}
