import type { AuthoredQuestion } from "./author"
import { q } from "./compact"

/**
 * A shorter way to write a question: the code example is one tuple, the revision note is one string,
 * and the language defaults to bash. It builds the same data as `q` (and so the long form), so every
 * schema and content-gate rule still applies.
 */
export interface BriefQuestion {
  slug: string
  topic: string
  d: "easy" | "medium" | "hard"
  title: string
  kw: string[]
  intent: string
  short: string
  detail: string[]
  ex: string
  mistakes: string[]
  follow: string[]
  points: string[]
  notes: string
  src: [string, string][]
  /** [title, code, walkthrough steps, language (default bash)] */
  code?: [string, string, string[], string?]
}

export const g = (c: BriefQuestion): AuthoredQuestion =>
  q({
    slug: c.slug,
    topic: c.topic,
    d: c.d,
    title: c.title,
    kw: c.kw,
    intent: c.intent,
    short: c.short,
    detail: c.detail,
    ex: c.ex,
    code: c.code
      ? [[c.code[0], c.code[3] ?? "bash", c.code[1], c.code[2]]]
      : undefined,
    mistakes: c.mistakes,
    follow: c.follow,
    points: c.points,
    notes: [c.notes],
    src: c.src,
  })
