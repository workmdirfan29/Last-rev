import { parseAnswer } from "@/services/content/custom-questions"
import { isHrModuleId, type Question } from "@/types/content"
import type { CustomQuestion, ResumeQuestion } from "@/types/learner"

/** A question as a mock session shows it: the prompt, an optional hint, and the model answer for the review. */
export interface MockItem {
  id: string
  title: string
  moduleId: string
  mine: boolean
  /** Shown on request while answering; null when the question has nothing to offer. */
  hint: string | null
  /** The model answer, as paragraphs. Empty for one of the learner's own questions with no answer written. */
  modelAnswer: string[]
  keyPoints: string[]
  /** Words the plain text match looks for. Empty for the learner's own questions. */
  keywords: string[]
  /** A fill-in outline (questions made from a resume): a structure to follow, not a model answer. */
  outline: string[]
}

export function itemFromQuestion(q: Question): MockItem {
  const hint = isHrModuleId(q.moduleId)
    ? q.recruiterExpects?.[0]
      ? `The recruiter expects: ${q.recruiterExpects[0]}`
      : null
    : q.keywords.length > 0
      ? `Think about: ${q.keywords.slice(0, 3).join(", ")}`
      : null
  return {
    id: q.id,
    title: q.title,
    moduleId: q.moduleId,
    mine: false,
    hint,
    modelAnswer: [q.shortAnswer, ...q.detailedAnswer],
    keyPoints: q.keyPoints,
    keywords: q.keywords,
    outline: [],
  }
}

export function itemFromCustom(c: CustomQuestion): MockItem {
  const blocks = parseAnswer(c.answer)
  return {
    id: c.id,
    title: c.title,
    moduleId: c.moduleId,
    mine: true,
    hint: null,
    modelAnswer: blocks.flatMap((b) =>
      b.kind === "paragraph" ? [b.text] : b.items.map((i) => `- ${i}`)
    ),
    keyPoints: [],
    keywords: [],
    outline: [],
  }
}

/** A question made from the learner's resume: no model answer (only they know the facts), just the outline. */
export function itemFromResume(q: ResumeQuestion): MockItem {
  return {
    id: q.id,
    title: q.title,
    moduleId: q.id.split(".")[0],
    mine: true,
    hint: null,
    modelAnswer: [],
    keyPoints: [],
    keywords: [],
    outline: q.framework,
  }
}
