import { useCallback, useMemo } from "react"
import { useLearnerStore } from "@/stores/learner-store"
import { englishMetrics } from "@/services/english/progress"
import { toDateKey } from "@/utils/dates"

/** The English zone's derived numbers, from real records only. */
export function useEnglishMetrics() {
  const progress = useLearnerStore((s) => s.progress)
  const state = useLearnerStore((s) => s.english)
  const activity = useLearnerStore((s) => s.activity)
  const today = toDateKey(new Date())
  return useMemo(
    () => englishMetrics(progress, state, activity, today),
    [progress, state, activity, today]
  )
}

/** What the learner can do in the English zone. Each change is a progress record or a small deviation in the English state. */
export function useEnglishActions() {
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const toggleFlag = useLearnerStore((s) => s.toggleFlag)
  const updateEnglish = useLearnerStore((s) => s.updateEnglish)

  /** "I know this": completes the item (schedules its first review). Clicking again un-marks it. */
  const markKnown = useCallback(
    (itemId: string) => toggleCompleted(itemId, 1, "english"),
    [toggleCompleted]
  )
  const finishLesson = useCallback(
    (lessonId: string, minutes = 1) =>
      toggleCompleted(lessonId, minutes, "english"),
    [toggleCompleted]
  )
  const bookmark = useCallback(
    (itemId: string) => toggleFlag(itemId, "bookmarked"),
    [toggleFlag]
  )

  /** A passed text exercise counts toward "learned" (two passes). A failed one changes nothing. */
  const recordPass = useCallback(
    (itemIds: readonly string[]) =>
      updateEnglish((s) => {
        const passes = { ...s.passes }
        for (const id of itemIds) passes[id] = (passes[id] ?? 0) + 1
        return { ...s, passes }
      }),
    [updateEnglish]
  )
  const rateSpeaking = useCallback(
    (itemId: string, rating: number, day: number | null = null) =>
      updateEnglish((s) => ({
        ...s,
        speaking: [
          ...s.speaking,
          { itemId, rating, at: new Date().toISOString(), day },
        ].slice(-2000),
      })),
    [updateEnglish]
  )
  const checkin = useCallback(
    (day: number, rating: number) =>
      updateEnglish((s) => ({
        ...s,
        challenge: {
          ...s.challenge,
          checkins: {
            ...s.challenge.checkins,
            [String(day)]: { rating, at: new Date().toISOString() },
          },
        },
      })),
    [updateEnglish]
  )
  const passDayExercise = useCallback(
    (day: number) =>
      updateEnglish((s) => ({
        ...s,
        challenge: {
          ...s.challenge,
          exercises: { ...s.challenge.exercises, [String(day)]: true as const },
        },
      })),
    [updateEnglish]
  )
  const setStartDate = useCallback(
    (startDate: string | null) =>
      updateEnglish((s) => ({
        ...s,
        challenge: { ...s.challenge, startDate },
      })),
    [updateEnglish]
  )
  const noticeSeen = useCallback(
    () => updateEnglish((s) => ({ ...s, speechNoticeSeen: true })),
    [updateEnglish]
  )

  return {
    markKnown,
    finishLesson,
    bookmark,
    recordPass,
    rateSpeaking,
    checkin,
    passDayExercise,
    setStartDate,
    noticeSeen,
  }
}
