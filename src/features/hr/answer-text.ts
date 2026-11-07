import { STAR_FIELDS } from "@/data/hr/guidance"
import type { HrAnswer } from "@/types/learner"

/** An answer as plain text, for copying: each STAR part under its label. */
export function answerAsText(a: HrAnswer, questionTitle?: string): string {
  const parts = STAR_FIELDS.flatMap((g) =>
    a[g.field].trim() ? [`${g.label}: ${a[g.field].trim()}`] : []
  )
  return [
    ...(questionTitle ? [questionTitle] : []),
    ...(a.title.trim() ? [`(${a.title.trim()})`] : []),
    ...parts,
  ].join("\n\n")
}
