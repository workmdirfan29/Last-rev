import { useState } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FeasibilityOptions } from "@/features/curriculum/feasibility-panel"
import { assessFeasibility } from "@/services/curriculum/feasibility"
import { dateOfStudyDay } from "@/services/planner/schedule"
import { ALL_WEEKDAYS } from "@/types/learner"
import { fromDateKey } from "@/utils/dates"
import type { Plan, usePlanActions } from "./use-plan"

const day = (key: string) => format(fromDateKey(key), "d MMM yyyy")

/**
 * Where the whole plan stands against the deadline. When the deadline is too short it says how many study
 * days the work really needs and what lands after the deadline; it never shortens the work to fit.
 */
export function PlanStatus({
  plan,
  actions,
  editHref,
  removedHref,
}: {
  plan: Plan
  actions: ReturnType<typeof usePlanActions>
  editHref: string
  /** Where removed blocks are listed and restored. */
  removedHref: string
}) {
  const { schedule: s, deadline } = plan
  const [confirming, setConfirming] = useState(false)
  const removed = plan.plan.removed.length
  const studyDays = plan.plan.studyDays.length
    ? plan.plan.studyDays
    : [...ALL_WEEKDAYS]
  const coreModules = new Set(
    plan.entries.filter((e) => e.core).map((e) => e.module.id)
  )
  // The same arithmetic as the review step, over what is left: the options carry real numbers.
  const result = assessFeasibility({
    totalMinutes: s.remainingMinutes,
    coreMinutes: s.blocks
      .filter((b) => !b.done && !b.deferred && coreModules.has(b.moduleId))
      .reduce((n, b) => n + b.minutes, 0),
    dailyMinutes: plan.dailyMinutes,
    targetDays: s.studyDaysAvailable,
  })
  // A late start or missed days make the plan longer than minutes / pace; offer the real finish day.
  result.options.extendDays = s.studyDaysNeeded

  return (
    <section aria-label="Plan status" className="space-y-3">
      {s.remainingBlocks === 0 && s.blocks.length > 0 ? (
        <p className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 p-3 text-sm">
          <CheckCircle2Icon
            className="size-4 shrink-0 text-success"
            aria-hidden
          />{" "}
          {s.later.blocks > 0
            ? "Every block outside Later is done."
            : "Every block in your plan is done."}
        </p>
      ) : s.feasible ? (
        <p className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm">
          <CheckCircle2Icon
            className="mt-0.5 size-4 shrink-0 text-success"
            aria-hidden
          />
          <span>
            {s.remainingBlocks} blocks left, about {s.studyDaysNeeded} study{" "}
            {s.studyDaysNeeded === 1 ? "day" : "days"}
            {s.lastDate ? `, finishing ${day(s.lastDate)}` : ""}.
            {deadline ? ` That is inside your target of ${day(deadline)}.` : ""}
          </span>
        </p>
      ) : (
        <div
          role="status"
          className="space-y-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm"
        >
          <p className="flex items-start gap-2 font-medium">
            <AlertTriangleIcon
              className="mt-0.5 size-4 shrink-0 text-warning"
              aria-hidden
            />
            Your plan does not fit your target date.
          </p>
          <p className="text-muted-foreground">
            At {plan.dailyMinutes} minutes on your study days, your plan needs{" "}
            {s.studyDaysNeeded} study days (finishing{" "}
            {s.lastDate ? day(s.lastDate) : "later"}), but you have{" "}
            {s.studyDaysAvailable ?? 0} before{" "}
            {deadline ? day(deadline) : "your target"}. {s.afterDeadline.blocks}{" "}
            blocks ({s.afterDeadline.minutes} min) land after it. Nothing was
            shortened or dropped.
          </p>
          <FeasibilityOptions
            result={result}
            coreFirstOn={s.later.blocks > 0}
            onExtendDeadline={actions.extendDeadline}
            extendLabel={(days) =>
              `Move target to ${day(dateOfStudyDay(plan.today, days, studyDays))}`
            }
            onPrepareCoreFirst={actions.prepareCore}
            onIncreaseDaily={actions.increaseDaily}
          />
          <Button asChild size="sm" variant="ghost">
            <Link to={editHref}>Change deadline, daily time or syllabus</Link>
          </Button>
        </div>
      )}

      {s.later.blocks > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-xs">
          <p>
            Core first is on: {s.later.blocks} blocks ({s.later.minutes} min)
            are planned after the rest. They are still in your syllabus.
          </p>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={actions.restoreCore}
          >
            Undo
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Study days:{" "}
          {plan.plan.studyDays.length === 7
            ? "every day"
            : [...plan.plan.studyDays]
                .sort()
                .map(
                  (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
                )
                .join(", ")}
        </span>
        {removed > 0 && (
          <Link to={removedHref} className="underline underline-offset-2">
            {removed} {removed === 1 ? "block" : "blocks"} removed from your
            plan
          </Link>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ms-auto"
          onClick={() => setConfirming(true)}
        >
          <RotateCcwIcon /> Restart plan from today
        </Button>
      </div>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart your plan from today?</AlertDialogTitle>
            <AlertDialogDescription>
              The schedule starts again today, so days you missed no longer show
              as missed, and blocks you moved go back in order. Blocks you
              finished stay finished, and your progress is kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my plan</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                actions.restart()
                setConfirming(false)
              }}
            >
              Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
