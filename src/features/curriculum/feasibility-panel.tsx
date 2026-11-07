import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AMBITIOUS_MESSAGE,
  type FeasibilityResult,
} from "@/services/curriculum/feasibility"
import { toHours } from "@/services/curriculum/time"

/** More than this a day is not offered as a solution (12 hours). */
const MAX_REALISTIC_DAILY_MINUTES = 720

export interface FeasibilityPanelProps {
  result: FeasibilityResult
  dailyMinutes: number
  /** Deferred ("Later") modules, shown while "Prepare core first" is on. */
  deferred: { modules: number; minutes: number }
  onPrepareCoreFirst?: () => void
  onRestore?: () => void
  /** Option A: set the deadline this many days out. Omit when the caller cannot change it. */
  onExtendDeadline?: (days: number) => void
  /** Option C: study this many minutes a day. Omit when the caller cannot change it. */
  onIncreaseDaily?: (minutes: number) => void
  /** Button wording for option A; the default names the number of days. */
  extendLabel?: (days: number) => string
}

/**
 * Is the deadline realistic? Plain arithmetic over the selection. When it is
 * not, three options are offered with real numbers. Nothing is removed: core
 * first only moves modules to "Later", and can be undone.
 */
export function FeasibilityPanel({
  result,
  dailyMinutes,
  deferred,
  onPrepareCoreFirst,
  onRestore,
  onExtendDeadline,
  onIncreaseDaily,
  extendLabel,
}: FeasibilityPanelProps) {
  const coreFirstOn = deferred.modules > 0

  if (result.minimumDays === null) {
    return (
      <section
        aria-label="Deadline check"
        role="status"
        className="rounded-xl border border-border bg-card p-4 text-sm"
      >
        Set a daily study time to see how long this syllabus takes.
      </section>
    )
  }

  return (
    <section
      aria-label="Deadline check"
      className={
        result.fits
          ? "space-y-2 rounded-xl border border-success/40 bg-success/10 p-4"
          : "space-y-3 rounded-xl border border-warning/40 bg-warning/10 p-4"
      }
    >
      <div className="flex gap-3">
        {result.fits ? (
          <CheckCircle2Icon
            className="mt-0.5 size-4 shrink-0 text-success"
            aria-hidden
          />
        ) : (
          <AlertTriangleIcon
            className="mt-0.5 size-4 shrink-0 text-warning"
            aria-hidden
          />
        )}
        <div className="space-y-1 text-sm" role="status" aria-live="polite">
          <p className="font-medium">
            {result.fits
              ? "Your deadline looks realistic for this syllabus."
              : AMBITIOUS_MESSAGE}
          </p>
          <p className="text-xs/relaxed text-muted-foreground">
            At {toHours(dailyMinutes)} h a day this syllabus needs at least{" "}
            {result.minimumDays} days
            {result.targetDays !== null &&
              (result.fits
                ? `, inside your ${result.targetDays}-day deadline.`
                : `, but your deadline allows ${result.targetDays}: ${result.shortfallDays} days short.`)}
            {result.targetDays === null && "."}
          </p>
        </div>
      </div>

      {!result.fits && (
        <FeasibilityOptions
          result={result}
          onPrepareCoreFirst={onPrepareCoreFirst}
          coreFirstOn={coreFirstOn}
          onExtendDeadline={onExtendDeadline}
          onIncreaseDaily={onIncreaseDaily}
          extendLabel={extendLabel}
        />
      )}

      {coreFirstOn && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-xs">
          <p>
            Core first is on: {deferred.modules} modules (
            {toHours(deferred.minutes)} h) are scheduled for later. They are
            still in your syllabus.
          </p>
          {onRestore && (
            <Button type="button" size="sm" variant="ghost" onClick={onRestore}>
              Undo
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

export interface FeasibilityOptionsProps extends Pick<
  FeasibilityPanelProps,
  | "result"
  | "onPrepareCoreFirst"
  | "onExtendDeadline"
  | "onIncreaseDaily"
  | "extendLabel"
> {
  coreFirstOn: boolean
}

/** The three ways to make a too-short deadline fit, each with real numbers and a button when the caller can apply it. */
export function FeasibilityOptions({
  result,
  coreFirstOn,
  onPrepareCoreFirst,
  onExtendDeadline,
  onIncreaseDaily,
  extendLabel,
}: FeasibilityOptionsProps) {
  const { options } = result
  return (
    <ul
      className="grid gap-2 text-xs sm:grid-cols-3"
      aria-label="Ways to make it fit"
    >
      <li className="space-y-1.5 rounded-lg border border-border bg-card p-3">
        <p className="font-medium">A. Extend the deadline</p>
        <p className="text-muted-foreground">
          To about {options.extendDays} days at your current pace.
        </p>
        {onExtendDeadline && options.extendDays !== null && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onExtendDeadline(options.extendDays!)}
          >
            {extendLabel
              ? extendLabel(options.extendDays)
              : `Set deadline to ${options.extendDays} days`}
          </Button>
        )}
      </li>
      <li className="space-y-1.5 rounded-lg border border-border bg-card p-3">
        <p className="font-medium">B. Prepare core first</p>
        <p className="text-muted-foreground">
          Core modules alone need {toHours(options.coreFirst.minutes)} h, about{" "}
          {options.coreFirst.minimumDays} days
          {options.coreFirst.fits
            ? ", which fits."
            : ", which still exceeds your deadline."}{" "}
          Everything else stays in your syllabus under Later.
        </p>
        {onPrepareCoreFirst && !coreFirstOn && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onPrepareCoreFirst}
          >
            Prepare core first
          </Button>
        )}
      </li>
      <li className="space-y-1.5 rounded-lg border border-border bg-card p-3">
        <p className="font-medium">C. Study more each day</p>
        {options.dailyMinutesNeeded === null ? (
          <p className="text-muted-foreground">
            Not available: there are no days left before the deadline.
          </p>
        ) : options.dailyMinutesNeeded > MAX_REALISTIC_DAILY_MINUTES ? (
          <p className="text-muted-foreground">
            It would take about {toHours(options.dailyMinutesNeeded)} h a day,
            which is not realistic. Choose another option.
          </p>
        ) : (
          <>
            <p className="text-muted-foreground">
              About {toHours(options.dailyMinutesNeeded)} h a day (
              {options.extraMinutesPerDay} min more than now) fits the deadline.
            </p>
            {onIncreaseDaily && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onIncreaseDaily(options.dailyMinutesNeeded!)}
              >
                Study {toHours(options.dailyMinutesNeeded)} h a day
              </Button>
            )}
          </>
        )}
      </li>
    </ul>
  )
}
