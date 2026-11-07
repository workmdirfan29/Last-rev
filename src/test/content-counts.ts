import { QUESTION_INDEX } from "@/data/questions/index.generated"
import type { ExperienceLevel, QuestionIndexEntry } from "@/types/content"

/**
 * Curated questions of a module, taken from the generated index. Tests derive their expected counts
 * from here (never a typed number) because the question bank grows in batches.
 */
export const questionsIn = (
  moduleId: string,
  level?: ExperienceLevel
): QuestionIndexEntry[] =>
  QUESTION_INDEX.filter(
    (q) => q.moduleId === moduleId && (!level || q.level === level)
  )
