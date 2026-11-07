import { loadModuleQuestions, loadQuestions } from "@/data/questions/loaders"
import {
  EXPERIENCE_LEVELS,
  QUESTION_ID_PATTERN,
  type ExperienceLevel,
  type Question,
  type QuestionIndexEntry,
} from "@/types/content"

let indexPromise: Promise<QuestionIndexEntry[]> | null = null

/** The index is code-split: it loads on first use, not with the app shell. */
export function loadQuestionIndex(): Promise<QuestionIndexEntry[]> {
  indexPromise ??= import("@/data/questions/index.generated").then(
    (m) => m.QUESTION_INDEX
  )
  return indexPromise
}

export function parseQuestionId(
  id: string
): { moduleId: string; level: ExperienceLevel; slug: string } | null {
  if (!QUESTION_ID_PATTERN.test(id)) return null
  const [moduleId, level, slug] = id.split(".")
  return { moduleId, level: level as ExperienceLevel, slug }
}

export async function loadQuestion(id: string): Promise<Question | null> {
  const parsed = parseQuestionId(id)
  if (!parsed) return null
  const list = await loadQuestions(parsed.moduleId, parsed.level)
  return list.find((q) => q.id === id) ?? null
}

export { loadModuleQuestions, loadQuestions }

export interface ModuleCounts {
  fresher: number
  intermediate: number
  advanced: number
  total: number
}

export function countByModule(
  index: QuestionIndexEntry[]
): Map<string, ModuleCounts> {
  const map = new Map<string, ModuleCounts>()
  for (const q of index) {
    const c = map.get(q.moduleId) ?? {
      fresher: 0,
      intermediate: 0,
      advanced: 0,
      total: 0,
    }
    c[q.level]++
    c.total++
    map.set(q.moduleId, c)
  }
  return map
}

export { EXPERIENCE_LEVELS }
