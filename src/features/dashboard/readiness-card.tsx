import { Link } from "react-router"
import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { READINESS_FORMULA } from "@/services/analytics/readiness"
import { useReadiness } from "@/features/readiness/use-readiness"
import type { Summary } from "@/services/analytics/summary"
import { SpokenEnglishLine } from "@/features/english/readiness-line"

/** The dashboard's readiness card. It reads the SAME service as /readiness, so the app shows one overall number. */
export function ReadinessCard({ summary }: { summary: Summary }) {
  const r = useReadiness()
  const areas = (r?.categories ?? []).filter((c) => c.included)
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="lr-eyebrow">Preparation readiness</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="How readiness is calculated"
            >
              <InfoIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 space-y-2 text-xs/relaxed"
          >
            <p className="font-medium">How this is calculated</p>
            <p>
              Questions in a category score{" "}
              {READINESS_FORMULA.completionWeight * 100}% completion +{" "}
              {READINESS_FORMULA.confidenceWeight * 100}% your own 1–5
              confidence ratings; lessons, quizzes, assignments and
              mock-interview ratings add equal parts where a category has them.
              The overall score is the plain average of the categories that have
              content and that you selected.
            </p>
            <p className="text-muted-foreground">
              It measures coverage and self-assessed confidence over the content
              that exists today. It is not a prediction of interview results or
              of being hired.
            </p>
          </PopoverContent>
        </Popover>
      </div>

      <p
        className="mt-2 font-heading text-3xl font-semibold tracking-tight tabular-nums"
        data-testid="dashboard-readiness"
      >
        {!r || r.overall === null ? "—" : `${r.overall}%`}
      </p>
      <p className="text-xs text-muted-foreground">
        {summary.completed} of {summary.totalQuestions} questions completed
      </p>

      {areas.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {areas.map((a) => (
            <li key={a.category.id}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{a.category.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {Math.round((a.score ?? 0) * 100)}%
                </span>
              </div>
              <Progress
                value={(a.score ?? 0) * 100}
                aria-label={`${a.category.label} readiness`}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs">
        <Link className="underline underline-offset-4" to="/readiness">
          All categories, counts and analytics
        </Link>
      </p>
      <SpokenEnglishLine />
    </div>
  )
}
