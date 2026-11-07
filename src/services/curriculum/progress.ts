import type { ExperienceLevel, QuestionIndexEntry } from "@/types/content"
import type { QuestionProgress } from "@/types/learner"

/** The authoring targets per module and level (from the spec); a target is never a count of what exists. */
export const QUESTION_TARGETS: Record<ExperienceLevel, number> = {
  fresher: 25,
  intermediate: 50,
  advanced: 75,
}

export interface LevelStats {
  available: number
  completed: number
  target: number
}

export interface QuestionStats {
  available: number
  completed: number
  byLevel: Record<ExperienceLevel, LevelStats>
}

/**
 * Question availability and completion for one module, derived from the real
 * question index and the learner's per-question progress. A module's progress
 * is therefore the same wherever it is shown (two roles sharing Git share one
 * record), and availability and completion are separate numbers.
 */
export function moduleQuestionStats(
  moduleId: string,
  index: readonly QuestionIndexEntry[],
  progress: Readonly<Record<string, QuestionProgress>>
): QuestionStats {
  const stats: QuestionStats = {
    available: 0,
    completed: 0,
    byLevel: {
      fresher: { available: 0, completed: 0, target: QUESTION_TARGETS.fresher },
      intermediate: {
        available: 0,
        completed: 0,
        target: QUESTION_TARGETS.intermediate,
      },
      advanced: {
        available: 0,
        completed: 0,
        target: QUESTION_TARGETS.advanced,
      },
    },
  }
  for (const q of index) {
    if (q.moduleId !== moduleId) continue
    const done = progress[q.id]?.completed ? 1 : 0
    stats.available++
    stats.completed += done
    stats.byLevel[q.level].available++
    stats.byLevel[q.level].completed += done
  }
  return stats
}

/** Builds a cached lookup so a long module list does not rescan the index per row. */
export function questionStatsLookup(
  index: readonly QuestionIndexEntry[],
  progress: Readonly<Record<string, QuestionProgress>>
): (moduleId: string) => QuestionStats {
  const cache = new Map<string, QuestionStats>()
  return (moduleId) => {
    let s = cache.get(moduleId)
    if (!s) {
      s = moduleQuestionStats(moduleId, index, progress)
      cache.set(moduleId, s)
    }
    return s
  }
}
