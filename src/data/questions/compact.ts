import type { AuthoredQuestion } from "./author"

/**
 * A compact way to write a question. It produces exactly the same data as the long form (a full question
 * parsed by `defineQuestions`); only the key names are shorter. Every field is still required by the schema.
 */
export interface CompactQuestion {
  slug: string
  topic: string
  d: "easy" | "medium" | "hard"
  title: string
  kw: string[]
  intent: string
  short: string
  detail: string[]
  ex: string
  /** [title, language, code, walkthrough steps] */
  code?: [string, string, string, string[]][]
  mistakes: string[]
  follow: string[]
  tips?: string[]
  points: string[]
  notes: string[]
  /** [label, url] */
  src: [string, string][]
  min?: number
}

export const q = (c: CompactQuestion): AuthoredQuestion => ({
  slug: c.slug,
  topic: c.topic,
  difficulty: c.d,
  title: c.title,
  keywords: c.kw,
  interviewerIntent: c.intent,
  shortAnswer: c.short,
  detailedAnswer: c.detail,
  realWorldExample: c.ex,
  codeExamples: (c.code ?? []).map(([title, language, code, walkthrough]) => ({
    title,
    language,
    code,
    walkthrough,
  })),
  commonMistakes: c.mistakes,
  followUps: c.follow.map((question) => ({ question })),
  answerTips: c.tips ?? [],
  keyPoints: c.points,
  revisionNotes: c.notes,
  sourceRefs: c.src.map(([label, url]) => ({ label, url })),
  estimatedMinutes: c.min ?? 3,
})
