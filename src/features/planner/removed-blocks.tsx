import { Undo2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LearningMode } from "@/types/learner"
import { usePlan, usePlanActions } from "./use-plan"

/**
 * Plan blocks the learner took out of their daily plan. The module stays in the syllabus; the block can be
 * put back one at a time or all at once.
 */
export function RemovedPlanBlocks({ mode }: { mode: LearningMode }) {
  const plan = usePlan(mode)
  const actions = usePlanActions(plan)
  if (!plan) return null
  const { removedBlocks, staleRemoved } = plan
  const count = removedBlocks.length + staleRemoved.length

  return (
    <section
      id="removed-blocks"
      aria-labelledby="removed-blocks-heading"
      className="scroll-mt-20 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="removed-blocks-heading" className="text-sm font-medium">
          Removed plan blocks ({count})
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={count === 0}
          onClick={() => actions.restoreAllBlocks()}
        >
          <Undo2Icon /> Restore all ({count})
        </Button>
      </div>
      {count === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No blocks removed from your daily plan. A block you remove from Today
          appears here and can be restored.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {removedBlocks.map((b) => {
            const label = `${b.moduleTitle}: ${b.topic}${
              b.part ? ` (part ${b.part.index} of ${b.part.of})` : ""
            }`
            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.minutes} min. The module stays in your syllabus.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Restore ${label}`}
                  onClick={() => actions.restoreBlock(b.id)}
                >
                  Restore
                </Button>
              </li>
            )
          })}
          {staleRemoved.map((id) => (
            <li
              key={id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  A block that is no longer in your plan
                </p>
                <p className="text-xs text-muted-foreground">
                  Your syllabus or daily time changed since you removed it.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Clear this removed block"
                onClick={() => actions.restoreBlock(id)}
              >
                Clear
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
