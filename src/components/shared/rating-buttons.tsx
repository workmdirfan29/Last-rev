import { Button } from "@/components/ui/button"

/** A 1 to 5 self-rating as five labelled buttons (a radio group, keyboard friendly). */
export function RatingButtons({
  legend,
  anchors,
  value,
  onPick,
}: {
  legend: string
  anchors: readonly string[]
  value: number | null
  onPick: (n: number) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{legend}</legend>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={legend}
      >
        {anchors.map((a, i) => (
          <Button
            key={a}
            type="button"
            role="radio"
            aria-checked={value === i + 1}
            variant={value === i + 1 ? "default" : "outline"}
            size="sm"
            className="h-auto py-1.5 whitespace-normal"
            onClick={() => onPick(i + 1)}
          >
            <span className="tabular-nums">{i + 1}</span>
            <span className="text-xs">{a}</span>
          </Button>
        ))}
      </div>
    </fieldset>
  )
}
