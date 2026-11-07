import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LABELS = ["Lost", "Shaky", "Okay", "Good", "Confident"]

export function ConfidenceRating({
  value,
  onChange,
  label = "Your confidence",
}: {
  value: number
  onChange: (v: number) => void
  label?: string
}) {
  return (
    <div role="group" aria-label={label} className="space-y-1.5">
      <p className="text-xs font-medium">{label}</p>
      <div className="flex gap-1.5">
        {LABELS.map((l, i) => {
          const n = i + 1
          const on = value === n
          return (
            <Button
              key={n}
              type="button"
              size="lg"
              variant={on ? "default" : "outline"}
              aria-pressed={on}
              onClick={() => onChange(n)}
              title={l}
              className={cn(
                "min-w-9 tabular-nums",
                on && "ring-1 ring-primary/60"
              )}
            >
              {n}
            </Button>
          )
        })}
      </div>
      <p
        className="h-4 text-[0.6875rem] text-muted-foreground"
        aria-live="polite"
      >
        {value > 0
          ? LABELS[value - 1]
          : "1 = lost, 5 = could explain it to anyone"}
      </p>
    </div>
  )
}
