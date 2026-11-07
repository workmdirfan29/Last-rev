import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { weekStrip, type DayStatus } from "@/services/planner/schedule"
import { fromDateKey } from "@/utils/dates"
import type { Plan } from "./use-plan"

const TONE: Record<DayStatus, string> = {
  done: "border-success/50 bg-success/10",
  partial: "border-warning/40 bg-warning/10",
  missed: "border-destructive/50 bg-destructive/10",
  today: "border-primary bg-card ring-1 ring-primary/50",
  upcoming: "border-border bg-card",
  rest: "border-dashed border-border bg-transparent text-muted-foreground",
  empty: "border-dashed border-border bg-transparent text-muted-foreground",
}

/** A week around today. Every day carries its status in words, so colour is never the only signal. */
export function WeekStrip({ plan }: { plan: Plan }) {
  const days = weekStrip(plan.schedule, plan.today, plan.plan.studyDays)
  return (
    <section aria-labelledby="week-heading" className="space-y-2">
      <h2 id="week-heading" className="text-sm font-medium">
        This week's plan
      </h2>
      <div
        className="lr-scroll -mx-1 overflow-x-auto px-1 pb-1"
        tabIndex={0}
        role="region"
        aria-label="This week, scrollable"
      >
        <ol
          aria-label="Days of this week"
          className="flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-7"
        >
          {days.map((d) => (
            <li
              key={d.date}
              aria-current={d.status === "today" ? "date" : undefined}
              className={cn(
                "w-32 shrink-0 rounded-lg border p-2.5 text-xs sm:w-auto",
                TONE[d.status]
              )}
            >
              <p className="font-medium">
                {format(fromDateKey(d.date), "EEE d MMM")}
              </p>
              <p className="mt-0.5 text-muted-foreground">{d.label}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
