import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { STUDY_ORDER_VERSION } from "@/config/study"
import type { Plan, usePlanActions } from "@/features/planner/use-plan"
import { useLearnerStore } from "@/stores/learner-store"

type Actions = ReturnType<typeof usePlanActions>

/**
 * The Study plan now follows the roadmap's phases, which moved some blocks. A learner with history is told once
 * and offered "Restart plan from today" (so no pile of "missed" blocks appears); a learner without history is
 * simply marked as being on the current rules.
 */
export function PlanOrderNotice({
  plan,
  actions,
}: {
  plan: Plan
  actions: Actions
}) {
  const updatePlan = useLearnerStore((s) => s.updatePlan)
  const progress = useLearnerStore((s) => s.progress)
  const stale = plan.plan.orderVersion !== STUDY_ORDER_VERSION
  const hasHistory =
    (plan.plan.startDate !== null && plan.plan.startDate < plan.today) ||
    Object.values(progress).some(
      (p) => p.questionId.startsWith("topic.") && p.completed
    )
  const markCurrent = () =>
    updatePlan("study", (p) => ({ ...p, orderVersion: STUDY_ORDER_VERSION }))

  useEffect(() => {
    if (stale && !hasHistory) void markCurrent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stale, hasHistory])

  if (!stale || !hasHistory) return null
  return (
    <section
      aria-label="Plan order changed"
      className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm"
      data-testid="plan-order-notice"
    >
      <p className="max-w-2xl">
        <span className="font-medium">
          Your plan now follows the roadmap&apos;s phases.
        </span>{" "}
        Some blocks moved to match, so a few dates may look different.
        Restarting from today lays the plan out again from today with everything
        you finished kept as done, so nothing shows up as missed.
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => {
            actions.restart()
            void markCurrent()
          }}
        >
          Restart plan from today
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void markCurrent()}
        >
          Keep my plan as it is
        </Button>
      </div>
    </section>
  )
}
