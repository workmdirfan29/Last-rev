import { useState } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import { CalendarClockIcon, RotateCcwIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  isShortPart,
  todayView,
  type ScheduledBlock,
} from "@/services/planner/schedule"
import { fromDateKey } from "@/utils/dates"
import { BlockLessonsLink } from "@/features/study/block-lessons-link"
import { MoveBlockDialog } from "./move-block-dialog"
import { ProgressRing } from "./progress-ring"
import type { Plan, usePlanActions } from "./use-plan"

type Actions = ReturnType<typeof usePlanActions>

export const blockTitle = (b: Pick<ScheduledBlock, "moduleTitle" | "topic">) =>
  `${b.moduleTitle}: ${b.topic}`

const shortDate = (key: string) => format(fromDateKey(key), "EEE d MMM")

/**
 * Today's blocks: real checkboxes, the minutes ring, an additive revision block when reviews are due,
 * a catch-up notice when missed work was moved forward, and move / remove for each block.
 */
export function TodayCard({
  plan,
  actions,
  dueReviews,
  heading = "Today",
  showRevisionLink = true,
}: {
  plan: Plan
  actions: Actions
  dueReviews: number
  heading?: string
  showRevisionLink?: boolean
}) {
  const { schedule, today, dailyMinutes } = plan
  const view = todayView(
    schedule,
    today,
    dueReviews,
    dailyMinutes,
    plan.plan.studyDays
  )
  const [moving, setMoving] = useState<ScheduledBlock | null>(null)
  const catchUp =
    schedule.catchUp && plan.plan.catchUpDismissedOn !== today
      ? schedule.catchUp
      : null
  const anyDone = schedule.blocks.some((b) => b.done)
  const allDone = view.blocks.length > 0 && view.blocks.every((b) => b.done)

  return (
    <section
      aria-labelledby="today-heading"
      className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex items-center gap-4">
        <ProgressRing done={view.ringDone} total={view.ringTotal} />
        <div className="min-w-0 flex-1">
          <h2
            id="today-heading"
            className="font-heading text-lg font-semibold tracking-tight"
          >
            {heading}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {shortDate(today)}
            </span>
          </h2>
          <p
            className="text-sm text-muted-foreground"
            data-testid="today-minutes"
          >
            {view.ringTotal > 0
              ? `${view.ringDone} of ${view.ringTotal} minutes done`
              : "No minutes planned today"}
            {view.revision
              ? ` (includes about ${view.revision.minutes} min of revision)`
              : ""}
          </p>
        </div>
      </div>

      {catchUp && (
        <div
          role="region"
          aria-label="Catch-up"
          className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm"
        >
          <p>
            <span className="font-medium">Catch-up.</span> {catchUp.blocks}{" "}
            {catchUp.blocks === 1 ? "block" : "blocks"} ({catchUp.minutes} min)
            planned for {catchUp.fromDates.map(shortDate).join(", ")}{" "}
            {catchUp.blocks === 1 ? "was" : "were"} not finished.{" "}
            {catchUp.blocks === 1 ? "It moved" : "They moved"} into{" "}
            {catchUp.toFirst === catchUp.toLast
              ? shortDate(catchUp.toFirst)
              : `${shortDate(catchUp.toFirst)} to ${shortDate(catchUp.toLast)}`}
            . Nothing was dropped.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={actions.dismissCatchUp}
          >
            Dismiss
          </Button>
        </div>
      )}

      {view.blocks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          {view.restDay
            ? "Today is a rest day in your plan."
            : schedule.remainingBlocks === 0 && schedule.blocks.length > 0
              ? "Every block in your plan is done."
              : "Nothing is planned for today. Your next block is on the week strip below."}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {view.blocks.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5"
            >
              <Checkbox
                id={`block-${b.id}`}
                checked={b.done}
                onCheckedChange={(v) => actions.toggleDone(b, v === true)}
                aria-label={`Mark ${blockTitle(b)}${b.part ? `, ${isShortPart(b) ? "short part, " : ""}part ${b.part.index} of ${b.part.of}` : ""} (${b.minutes} min) done`}
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`block-${b.id}`}
                  className={
                    b.done
                      ? "block cursor-pointer text-sm text-muted-foreground line-through"
                      : "block cursor-pointer text-sm font-medium"
                  }
                >
                  {blockTitle(b)}
                </label>
                <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="tabular-nums">{b.minutes} min</span>
                  {b.part && (
                    <span>
                      {isShortPart(b) && (
                        <span className="font-medium">Short part, </span>
                      )}
                      Part {b.part.index} of {b.part.of}
                    </span>
                  )}
                  {b.missed && <Badge variant="outline">Catch-up</Badge>}
                  {b.moved && <Badge variant="outline">Moved by you</Badge>}
                </p>
                {plan.mode === "study" && (
                  <BlockLessonsLink moduleId={b.moduleId} topic={b.topic} />
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMoving(b)}
                  aria-label={`Move block: ${blockTitle(b)}`}
                >
                  <CalendarClockIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => actions.removeBlock(b)}
                  aria-label={`Remove block from my plan: ${blockTitle(b)}`}
                >
                  <XIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {view.revision && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-tech/40 bg-tech/10 p-3 text-sm">
          <p>
            <span className="font-medium">Revision due today:</span>{" "}
            {view.revision.items}{" "}
            {view.revision.items === 1 ? "question" : "questions"}, about{" "}
            {view.revision.minutes} min.{" "}
            <span className="text-muted-foreground">
              Extra, on top of your plan.
            </span>
          </p>
          {showRevisionLink && (
            <Button asChild size="sm" variant="outline">
              <Link to="/library/revision">
                <RotateCcwIcon /> Start revision
              </Link>
            </Button>
          )}
        </div>
      )}

      {allDone && (
        <p className="text-sm font-medium text-success">
          Today's blocks are done.
        </p>
      )}
      {!anyDone && schedule.blocks.length > 0 && (
        <p className="text-xs text-muted-foreground">
          You have not completed anything yet. Your plan starts today with the
          blocks above.
        </p>
      )}

      <MoveBlockDialog
        block={moving}
        today={today}
        onMove={actions.moveBlock}
        onClearMove={actions.clearMove}
        onClose={() => setMoving(null)}
      />
    </section>
  )
}
