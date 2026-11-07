import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_REVISION_INTERVALS } from "@/types/learner"
import { useLearnerStore } from "@/stores/learner-store"

/** Parse "1, 3, 7" → [1,3,7]. Returns null if invalid. Intervals must be strictly increasing. */
export function parseIntervals(text: string): number[] | null {
  const parts = text.split(/[\s,]+/).filter(Boolean)
  if (parts.length === 0 || parts.length > 10) return null
  const nums = parts.map(Number)
  if (nums.some((n) => !Number.isInteger(n) || n < 1 || n > 365)) return null
  for (let i = 1; i < nums.length; i++) if (nums[i] <= nums[i - 1]) return null
  return nums
}

export function RevisionSettings() {
  const saved = useLearnerStore((s) => s.preferences.revisionIntervals)
  const update = useLearnerStore((s) => s.updatePreferences)
  const [text, setText] = useState(saved.join(", "))
  const parsed = parseIntervals(text)
  const invalid = text.trim() !== "" && parsed === null

  async function save() {
    if (!parsed) return
    await update({ revisionIntervals: parsed })
    toast.success(
      "Revision schedule saved — applies to questions you complete from now on"
    )
  }

  return (
    <section
      className="space-y-3 rounded-xl border border-border bg-card p-5"
      aria-labelledby="rev-heading"
    >
      <div>
        <h2 id="rev-heading" className="text-sm font-medium">
          Revision schedule
        </h2>
        <p className="mt-1 text-xs/relaxed text-muted-foreground">
          Days after completing a question when it should come back for review.
          Default: day 1, 3, 7, 14, 30.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="intervals">Days (comma separated, increasing)</Label>
          <Input
            id="intervals"
            className="w-64"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={invalid}
            aria-describedby={invalid ? "intervals-error" : undefined}
          />
        </div>
        <Button size="lg" onClick={() => void save()} disabled={!parsed}>
          Save
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => setText(DEFAULT_REVISION_INTERVALS.join(", "))}
        >
          Use default
        </Button>
      </div>
      {invalid && (
        <p
          id="intervals-error"
          role="alert"
          className="text-xs text-destructive"
        >
          Enter whole numbers of days from 1 to 365, each larger than the one
          before (for example 1, 3, 7, 14, 30).
        </p>
      )}
    </section>
  )
}
