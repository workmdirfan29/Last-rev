import {
  QUESTION_SET_APP,
  questionSetSchema,
  resumeQuestionSchema,
  type QuestionSet,
  type ResumeProfile,
  type ResumeQuestion,
} from "@/types/learner"
import { newId } from "@/utils/id"

/**
 * Export the resume questions as a file the learner can keep or share. It holds the questions only (their
 * wording does quote the learner's own resume text, and the export dialog says so). The resume profile is
 * included only when the learner ticks the box.
 */
export function buildQuestionSet(
  questions: readonly ResumeQuestion[],
  profile: ResumeProfile | null,
  opts: { name: string; includeProfile: boolean; now: Date }
): QuestionSet {
  return {
    app: QUESTION_SET_APP,
    version: 1,
    exportedAt: opts.now.toISOString(),
    name: opts.name,
    questions: questions
      .filter((q) => q.status === "active")
      .map((q) => ({
        id: q.id,
        section: q.section,
        title: q.title,
        framework: q.framework,
        templateId: q.templateId,
        edited: q.edited,
      })),
    ...(opts.includeProfile && profile ? { profile } : {}),
  }
}

export type ParsedSet =
  { ok: true; set: QuestionSet } | { ok: false; error: string }

/** Validate untrusted file text. */
export function parseQuestionSet(text: string): ParsedSet {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, error: "This file is not valid JSON." }
  }
  const parsed = questionSetSchema.safeParse(json)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const where = first?.path.length ? ` (at ${first.path.join(".")})` : ""
    return {
      ok: false,
      error: `This does not look like a LastRev question set${where}: ${first?.message ?? "invalid data"}`,
    }
  }
  return { ok: true, set: parsed.data }
}

export interface ImportPlan {
  setId: string
  toAdd: ResumeQuestion[]
  /** Questions whose id is already in the bank (yours or another set): skipped. */
  duplicates: number
  bySection: Record<string, number>
}

/** What importing would add, for the preview. Nothing is written until the learner confirms. */
export function planImport(
  set: QuestionSet,
  existing: readonly ResumeQuestion[],
  fileName: string,
  now: string
): ImportPlan {
  const taken = new Set(existing.map((q) => q.id))
  const setId = newId("set")
  const toAdd: ResumeQuestion[] = []
  let duplicates = 0
  const bySection: Record<string, number> = {}
  for (const q of set.questions) {
    if (taken.has(q.id)) {
      duplicates++
      continue
    }
    taken.add(q.id)
    bySection[q.section] = (bySection[q.section] ?? 0) + 1
    toAdd.push(
      resumeQuestionSchema.parse({
        id: q.id,
        section: q.section,
        title: q.title,
        generatedTitle: q.title,
        framework: q.framework,
        templateId: q.templateId,
        status: "active",
        edited: q.edited,
        setId,
        setLabel: fileName,
        createdAt: now,
        updatedAt: now,
      })
    )
  }
  return { setId, toAdd, duplicates, bySection }
}
