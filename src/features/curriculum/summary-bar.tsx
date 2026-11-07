import { useId, useState } from "react"
import { ChevronUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { FeasibilityResult } from "@/services/curriculum/feasibility"
import type { SyllabusSummary } from "@/services/curriculum/summary"
import { toHours } from "@/services/curriculum/time"
import { cn } from "@/lib/utils"

const lessonsText = (n: number) => (n > 0 ? String(n) : "in preparation")
const questionsText = (n: number) =>
  n > 0 ? `${n} available` : "in preparation"

export interface SummaryContext {
  label: string
  experience: string
  dailyMinutes: number
  deadline: string | null
}

/** The summary at the top of the builder: the path, the pace, and the selection's real totals. */
export function SummaryStats({
  summary,
  context,
  feasibility,
}: {
  summary: SyllabusSummary
  context: SummaryContext
  feasibility: FeasibilityResult
}) {
  const cell = (
    label: string,
    value: React.ReactNode,
    hint?: React.ReactNode
  ) => (
    <div className="min-w-0 space-y-0.5">
      <dt className="lr-eyebrow">{label}</dt>
      <dd className="text-sm font-medium break-words">
        {value}
        {hint && (
          <p className="text-xs font-normal text-muted-foreground">{hint}</p>
        )}
      </dd>
    </div>
  )
  return (
    <section
      aria-label="Syllabus summary"
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
        {cell("Career path", <span>{context.label}</span>)}
        {cell("Experience", context.experience)}
        {cell("Daily time", `${toHours(context.dailyMinutes)} h`)}
        {cell("Deadline", context.deadline ?? "Not set")}
        {cell(
          "Selected modules",
          <span data-testid="summary-modules">{summary.modules}</span>,
          `${summary.topics} topics`
        )}
        {cell(
          "Estimated hours",
          <span data-testid="summary-hours">{toHours(summary.minutes)} h</span>,
          feasibility.minimumDays !== null
            ? `about ${feasibility.minimumDays} days at your pace`
            : undefined
        )}
        {cell("Lessons", lessonsText(summary.lessons))}
        {cell(
          "Questions ready",
          summary.questions.total > 0
            ? String(summary.questions.total)
            : "none yet",
          "Goal: at least 25 per module"
        )}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        Hours are planning estimates, not measurements.
      </p>
    </section>
  )
}

/**
 * Compact summary that stays on screen while you scroll. On small screens the
 * details are collapsed behind a button. Its text is a polite live region, so
 * every change to the selection is announced.
 */
export function SummaryBar({
  summary,
  feasibility,
  className,
  variant = "floating",
}: {
  summary: SyllabusSummary
  feasibility: FeasibilityResult
  /** Position classes for the floating variant. */
  className?: string
  /** `inline` lives inside a page's bottom action bar; `floating` sticks to the viewport. */
  variant?: "floating" | "inline"
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const { groups } = summary
  const inline = variant === "inline"
  return (
    <div
      className={cn(
        inline
          ? "relative min-w-0"
          : "sticky z-20 rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-1",
          inline ? "py-0.5" : "px-4 py-2.5"
        )}
      >
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="min-w-0 flex-1 text-sm"
        >
          <span className="font-medium tabular-nums">
            {summary.modules} modules
          </span>
          <span className="text-muted-foreground"> · </span>
          <span className="font-medium tabular-nums">
            {toHours(summary.minutes)} h
          </span>
          <span className="text-muted-foreground"> · </span>
          <span className="text-muted-foreground">
            {feasibility.minimumDays !== null
              ? `${feasibility.minimumDays} days`
              : "no daily time set"}
            {feasibility.targetDays !== null &&
              (feasibility.fits
                ? ` of ${feasibility.targetDays}`
                : ` (deadline ${feasibility.targetDays})`)}
          </span>
          {!feasibility.fits && (
            <Badge variant="outline" className="ms-2">
              Over deadline
            </Badge>
          )}
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {open ? "Hide details" : "Details"}
          <ChevronUpIcon
            className={cn(
              "size-3.5 transition-transform",
              !open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </div>
      {open && (
        <dl
          id={id}
          className={cn(
            "grid gap-x-6 gap-y-2 px-4 py-3 text-xs sm:grid-cols-3",
            inline
              ? "absolute bottom-full left-0 mb-3 w-[min(34rem,calc(100vw-2rem))] rounded-xl border border-border bg-card shadow-lg"
              : "border-t border-border"
          )}
        >
          <div>
            <dt className="text-muted-foreground">Shared foundation</dt>
            <dd className="tabular-nums">
              {groups.foundation.modules} modules ·{" "}
              {toHours(groups.foundation.minutes)} h
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role-specific</dt>
            <dd className="tabular-nums">
              {groups.roleSpecific.modules} modules ·{" "}
              {toHours(groups.roleSpecific.minutes)} h
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Optional (chosen)</dt>
            <dd className="tabular-nums">
              {groups.optional.modules} modules ·{" "}
              {toHours(groups.optional.minutes)} h
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Lessons</dt>
            <dd>{lessonsText(summary.lessons)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Questions ready</dt>
            <dd>{questionsText(summary.questions.total)}</dd>
          </div>
          {summary.deferredModules > 0 && (
            <div>
              <dt className="text-muted-foreground">Later</dt>
              <dd className="tabular-nums">
                {summary.deferredModules} modules ·{" "}
                {toHours(summary.deferredMinutes)} h
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
