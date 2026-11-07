import type { EnglishState, QuestionProgress } from "@/types/learner"

type Progress = Readonly<Record<string, QuestionProgress>>

/** Passes needed in text exercises for an item to count as learned without being marked "I know this". */
export const PASSES_TO_LEARN = 2

/** Learned: the learner marked "I know this", or passed a text exercise on it twice. Failing never un-learns anything. */
export const isLearned = (
  id: string,
  progress: Progress,
  state: EnglishState | null
): boolean =>
  progress[id]?.completed === true ||
  (state?.passes[id] ?? 0) >= PASSES_TO_LEARN

/** Practised: learned, or passed at least once. */
export const isPractised = (
  id: string,
  progress: Progress,
  state: EnglishState | null
): boolean => isLearned(id, progress, state) || (state?.passes[id] ?? 0) >= 1
