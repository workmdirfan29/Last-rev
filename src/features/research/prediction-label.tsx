import { TelescopeIcon } from "lucide-react"
import { PREDICTION_LABEL } from "@/services/research/bibliography"

/** Shown on every predicted entry, wherever it appears. Text and an icon: never colour alone. */
export function PredictionLabel() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border border-warning/60 px-2 py-0.5 text-xs font-medium"
      data-testid="prediction-label"
    >
      <TelescopeIcon className="size-3.5 text-warning" aria-hidden />
      {PREDICTION_LABEL}
    </span>
  )
}
