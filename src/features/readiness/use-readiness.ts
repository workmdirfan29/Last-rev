import { useEffect, useMemo } from "react"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { useFullIndex } from "@/hooks/use-content"
import { computeCategoryReadiness } from "@/services/readiness/categories"
import { learnerModuleIds } from "@/services/readiness/learner-modules"
import { snapshotFor } from "@/services/readiness/analytics"
import { useLearnerStore } from "@/stores/learner-store"
import { toDateKey } from "@/utils/dates"

/** The one readiness computation, shared by the dashboard card and /readiness. Null until the question index loads. */
export function useReadiness() {
  const index = useFullIndex()
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const mockSessions = useLearnerStore((s) => s.mockSessions)
  const english = useLearnerStore((s) => s.english)
  const hrAnswers = useLearnerStore((s) => s.hrAnswers)
  const excluded = useLearnerStore((s) => s.preferences.readinessExcluded)
  const record = useLearnerStore((s) => s.recordReadinessSnapshot)
  const result = useMemo(
    () =>
      index
        ? computeCategoryReadiness({
            selectedModules: learnerModuleIds(profile),
            index,
            progress,
            lessons: LESSON_INDEX,
            attempts,
            mockSessions,
            english,
            hrAnswers,
            excluded,
          })
        : null,
    [
      index,
      profile,
      progress,
      attempts,
      mockSessions,
      english,
      hrAnswers,
      excluded,
    ]
  )
  // one snapshot a week, from now on: it is what makes a trend possible later (never back-filled)
  useEffect(() => {
    if (!result || result.overall === null) return
    const now = new Date()
    void record(snapshotFor(result.overall, progress, toDateKey(now), now))
  }, [result, progress, record])
  return result
}
