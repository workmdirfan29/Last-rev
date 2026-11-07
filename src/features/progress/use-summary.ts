import { useMemo } from "react"
import { useFullIndex } from "@/hooks/use-content"
import { buildSummary, type Summary } from "@/services/analytics/summary"
import { useLearnerStore } from "@/stores/learner-store"

/** Single derived-progress hook shared by Overview, Interview and Bookmarks. */
export function useSummary(): { summary: Summary | null; isLoading: boolean } {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const activity = useLearnerStore((s) => s.activity)
  // The learner's own questions are tracked like any other.
  const index = useFullIndex()

  const summary = useMemo(
    () => (index ? buildSummary({ profile, progress, activity, index }) : null),
    [profile, progress, activity, index]
  )
  return { summary, isLoading: !index }
}
