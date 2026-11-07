import { useCallback, useMemo } from "react"
import { useLearnerStore } from "@/stores/learner-store"
import type { MockAnswer, MockSession } from "@/types/learner"
import { matchKeywords } from "@/services/mock/keywords"
import type { MockItem } from "@/services/mock/items"
import { hasAnswer } from "@/services/mock/score"

export function useMockSession(id: string): MockSession | undefined {
  return useLearnerStore((s) => s.mockSessions.find((m) => m.id === id))
}

/** Actions on one session. Each persists straight away. */
export function useMockActions(id: string) {
  const update = useLearnerStore((s) => s.updateMockSession)
  const end = useLearnerStore((s) => s.endMockSession)

  const patchAnswer = useCallback(
    (index: number, patch: Partial<MockAnswer>) =>
      update(id, (s) => ({
        ...s,
        answers: s.answers.map((a, i) =>
          i === index ? { ...a, ...patch } : a
        ),
      })),
    [id, update]
  )
  const patch = useCallback(
    (change: Partial<MockSession>) => update(id, (s) => ({ ...s, ...change })),
    [id, update]
  )
  /** Seconds of interview time used: written in batches while the countdown runs. */
  const flushTime = useCallback(
    (elapsed: number, spent: Readonly<Record<number, number>>) =>
      update(id, (s) => ({
        ...s,
        elapsedSeconds: Math.max(s.elapsedSeconds, elapsed),
        answers: s.answers.map((a, i) =>
          spent[i] !== undefined
            ? { ...a, secondsSpent: Math.max(a.secondsSpent, spent[i]) }
            : a
        ),
      })),
    [id, update]
  )
  /**
   * End the timed part. Typed answers are kept and matched against the keywords (the plain text match, stored
   * so the result shows exactly what was counted). Answered but unrated questions go to the review.
   */
  const endInterview = useCallback(
    async (items: ReadonlyMap<string, MockItem>) => {
      let toReview = false
      await update(id, (s) => {
        const answers = s.answers.map((a) => {
          if (!hasAnswer(a)) return a
          const kw = items.get(a.questionId)?.keywords ?? []
          const m = matchKeywords(a.text, kw)
          return {
            ...a,
            keywordsHit: kw.length ? m.matched.length : null,
            keywordsTotal: kw.length ? m.total : null,
          }
        })
        toReview = answers.some(
          (a) => hasAnswer(a) && Object.keys(a.ratings).length === 0
        )
        return { ...s, answers, phase: toReview ? "review" : s.phase }
      })
      if (!toReview) await end(id, "finished")
      return toReview
    },
    [id, update, end]
  )
  // One stable object: effects that depend on it must not re-run on every render.
  return useMemo(
    () => ({
      patchAnswer,
      patch,
      flushTime,
      endInterview,
      finish: () => end(id, "finished"),
      abandon: () => end(id, "abandoned"),
    }),
    [patchAnswer, patch, flushTime, endInterview, end, id]
  )
}
