import type {
  ActivityEntry,
  EnglishState,
  QuestionProgress,
} from "@/types/learner"
import { lessonsOfModule, itemIdsOfKind, courseTotals } from "./catalogue"
import { englishStreak, confidenceSummary } from "./challenge"
import { isLearned, isPractised } from "./learned"

export { PASSES_TO_LEARN, isLearned, isPractised } from "./learned"
import { ENGLISH_MODULES } from "@/data/english/modules"

type Progress = Readonly<Record<string, QuestionProgress>>

export const lessonFinished = (lessonId: string, progress: Progress): boolean =>
  progress[lessonId]?.completed === true

export interface EnglishMetrics {
  lessonsFinished: number
  lessonsTotal: number
  vocabLearned: number
  vocabTotal: number
  sentencesPractised: number
  sentencesTotal: number
  speakingDone: number
  streak: { current: number; longest: number }
  confidence: ReturnType<typeof confidenceSummary>
}

/** Every number comes from real records: progress, the English state and the activity log. */
export function englishMetrics(
  progress: Progress,
  state: EnglishState | null,
  activity: readonly ActivityEntry[],
  today: string
): EnglishMetrics {
  const totals = courseTotals()
  const vocab = itemIdsOfKind("vocab")
  const sentences = itemIdsOfKind("sentence")
  const lessonIds = ENGLISH_MODULES.flatMap((m) =>
    lessonsOfModule(m.id).map((l) => l.id)
  )
  return {
    lessonsFinished: lessonIds.filter((id) => lessonFinished(id, progress))
      .length,
    lessonsTotal: totals.lessons,
    vocabLearned: vocab.filter((id) => isLearned(id, progress, state)).length,
    vocabTotal: vocab.length,
    sentencesPractised: sentences.filter((id) =>
      isPractised(id, progress, state)
    ).length,
    sentencesTotal: sentences.length,
    speakingDone: state?.speaking.length ?? 0,
    streak: englishStreak(activity, today),
    confidence: confidenceSummary(state),
  }
}

/** Per-module "N of M lessons finished". */
export function moduleProgress(moduleId: string, progress: Progress) {
  const lessons = lessonsOfModule(moduleId)
  return {
    done: lessons.filter((l) => lessonFinished(l.id, progress)).length,
    total: lessons.length,
  }
}

/** Items the learner knows and that are due for revision today. */
export function dueItems(progress: Progress, now: Date): string[] {
  return Object.values(progress)
    .filter(
      (p) =>
        p.questionId.startsWith("en.") &&
        p.questionId.split(".").length === 4 &&
        p.completed &&
        p.nextReviewAt !== null &&
        new Date(p.nextReviewAt) <= now
    )
    .sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""))
    .map((p) => p.questionId)
}
