import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RichText } from "@/components/shared/rich-text"
import { KEYWORD_CAPTION, RUBRIC_DIMENSIONS } from "@/data/mock/rubric"
import { cn } from "@/lib/utils"
import type { MockItem } from "@/services/mock/items"
import { matchKeywords } from "@/services/mock/keywords"
import { kindOfModule } from "@/services/mock/rubric"
import type { MockAnswer } from "@/types/learner"

/**
 * Rate your own answer: the model answer (once revealed), the plain text match, the key points you covered,
 * and one 1 to 5 rating per dimension, each with what 1, 3 and 5 mean. Every number here is the learner's.
 */
export function RatingPanel({
  item,
  answer,
  revealed,
  onReveal,
  onChange,
}: {
  item: MockItem
  answer: MockAnswer
  revealed: boolean
  onReveal: () => void
  onChange: (patch: Partial<MockAnswer>) => void
}) {
  const dims = RUBRIC_DIMENSIONS[kindOfModule(item.moduleId)]
  const match = matchKeywords(answer.text, item.keywords)
  const rated = dims.filter((d) => answer.ratings[d.id] !== undefined).length

  const rate = (id: string, value: number) =>
    onChange({
      ratings: { ...answer.ratings, [id]: value },
      keywordsHit: item.keywords.length ? match.matched.length : null,
      keywordsTotal: item.keywords.length ? match.total : null,
    })

  return (
    <div className="space-y-5">
      <section aria-label="Your answer" className="space-y-1.5">
        <h3 className="text-sm font-medium">What you typed</h3>
        <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
          {answer.text.trim() || "Nothing typed."}
        </p>
      </section>

      {!revealed ? (
        <Button type="button" size="lg" onClick={onReveal}>
          <EyeIcon /> Reveal the model answer
          <kbd className="ms-1 rounded border border-border px-1 text-[0.625rem]">
            R
          </kbd>
        </Button>
      ) : (
        <>
          <section aria-label="Model answer" className="space-y-2">
            <h3 className="text-sm font-medium">Model answer</h3>
            {item.modelAnswer.length === 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  No model answer written: rate against your own notes.
                </p>
                {item.outline.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Outline you can use (fill each [bracket] with your own
                      facts)
                    </p>
                    <ol className="lr-prose list-decimal ps-5">
                      {item.outline.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            ) : (
              <div className="lr-prose rounded-lg border border-border bg-card p-3">
                {item.modelAnswer.map((p, i) => (
                  <p key={i}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            )}
          </section>

          {item.keywords.length > 0 && (
            <p className="text-sm" data-testid="keyword-match">
              Keywords mentioned: {match.matched.length} of {match.total}{" "}
              <span className="text-muted-foreground">({KEYWORD_CAPTION})</span>
              {match.matched.length > 0 && (
                <span className="block text-xs text-muted-foreground">
                  Found: {match.matched.join(", ")}
                </span>
              )}
            </p>
          )}

          {item.keyPoints.length > 0 && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">
                Did your answer cover these key points?
              </legend>
              <ul className="space-y-1.5">
                {item.keyPoints.map((k, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Checkbox
                      id={`kp-${item.id}-${i}`}
                      checked={answer.ticks.includes(i)}
                      onCheckedChange={(v) =>
                        onChange({
                          ticks:
                            v === true
                              ? [...answer.ticks, i]
                              : answer.ticks.filter((t) => t !== i),
                        })
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`kp-${item.id}-${i}`}
                      className="text-sm font-normal"
                    >
                      {k}
                    </Label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}
        </>
      )}

      <section aria-label="Rate yourself" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium">Rate yourself</h3>
          <p className="text-xs text-muted-foreground">
            {revealed
              ? `Rated ${rated} of ${dims.length}. You can leave a dimension unrated; it is then left out of the score.`
              : "Reveal the model answer first, then rate your own answer."}
          </p>
        </div>
        <ul className="space-y-4">
          {dims.map((d) => {
            const value = answer.ratings[d.id]
            return (
              <li
                key={d.id}
                role="group"
                aria-label={d.label}
                className="space-y-1.5"
              >
                <p className="text-sm">{d.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      type="button"
                      size="lg"
                      disabled={!revealed}
                      variant={value === n ? "default" : "outline"}
                      aria-pressed={value === n}
                      aria-label={`${d.label}: ${n} of 5`}
                      onClick={() => rate(d.id, n)}
                      className={cn(
                        "min-w-9 tabular-nums",
                        value === n && "ring-1 ring-primary/60"
                      )}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  1: {d.anchors.low} · 3: {d.anchors.mid} · 5: {d.anchors.high}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
