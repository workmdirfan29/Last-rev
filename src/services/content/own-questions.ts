import { RESUME_SECTION_LABEL } from "@/data/catalog/modules/resume"
import type { QuestionIndexEntry } from "@/types/content"
import type { CustomQuestion, ResumeQuestion } from "@/types/learner"
import { customToIndexEntry } from "./custom-questions"

/** A resume question in the shape lists, search and analytics already understand. */
export function resumeToIndexEntry(q: ResumeQuestion): QuestionIndexEntry {
  return {
    id: q.id,
    moduleId: q.id.split(".")[0],
    level: "fresher",
    topic: RESUME_SECTION_LABEL[q.section],
    difficulty: "medium",
    title: q.title,
    keywords: [],
    estimatedMinutes: 4,
  }
}

export const isResumeQuestionId = (id: string) => id.startsWith("resume-")

/**
 * Every question that belongs to the learner rather than the curated bank: the ones they wrote and the ones
 * made from their resume or imported in a set. This is the ONE place they are merged, so every list, count,
 * search and pool treats them the same way.
 */
export function ownQuestionEntries(
  custom: readonly CustomQuestion[],
  resume: readonly ResumeQuestion[]
): QuestionIndexEntry[] {
  return [...custom.map(customToIndexEntry), ...resume.map(resumeToIndexEntry)]
}
