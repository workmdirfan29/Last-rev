import { SCORE_CAPTION } from "@/data/mock/rubric"
import { MOCK_TYPE_DEFS } from "@/data/mock/types"
import type { MockSession } from "@/types/learner"
import type { SessionResult } from "./score"

const r1 = (n: number) => String(Math.round(n * 10) / 10)

/** The result as plain text, to copy: score, formula inputs and weak areas. Nothing is sent anywhere. */
export function summaryText(
  session: MockSession,
  result: SessionResult,
  titleOf: (questionId: string) => string,
  moduleTitle: (moduleId: string) => string
): string {
  const lines: string[] = []
  lines.push(
    `${MOCK_TYPE_DEFS[session.config.type].title}, ${session.startedAt.slice(0, 10)}`
  )
  lines.push(
    result.score === null
      ? "No question was rated, so there is no score."
      : `Score on the questions I answered and rated: ${r1(result.score)} / 100 (${result.answered} of ${result.asked} answered, ${result.rated} rated)`
  )
  if (result.scoreIfZero !== null)
    lines.push(
      `If unanswered or unrated questions counted as zero: ${r1(result.scoreIfZero)} / 100`
    )
  lines.push(SCORE_CAPTION, "")
  lines.push(
    "Formula: each rating (1 to 5) counts 0, 25, 50, 75 or 100 points; a question's points are the weighted mean of what I rated; the score is the mean of the rated questions."
  )
  for (const [kind, dims] of Object.entries(session.rubric.kinds))
    lines.push(
      `Weights (${kind}): ${dims.map((d) => `${d.label} ${d.weight}`).join(", ")}`
    )
  lines.push(
    session.config.includeKeywords
      ? `Keyword coverage (text match) is included, weight ${session.rubric.keywordWeight}.`
      : "Keyword coverage (text match) is not included."
  )
  lines.push("", "My ratings:")
  for (const q of result.questions.filter((x) => x.points !== null))
    lines.push(
      `- ${titleOf(q.questionId)}: ${q.lines
        .filter((l) => l.used)
        .map((l) => `${l.label} ${l.rating ?? "text match"}`)
        .join(", ")} = ${r1(q.points!)}`
    )
  if (result.modules.length) {
    lines.push("", "By module:")
    for (const m of result.modules)
      lines.push(
        `- ${moduleTitle(m.moduleId)}: ${m.mean === null ? "not rated" : r1(m.mean)} (${m.rated} rated, ${m.status.replace("-", " ")})`
      )
  }
  if (result.weak.length)
    lines.push("", `Weak areas: ${result.weak.map(moduleTitle).join(", ")}`)
  if (result.unanswered.length)
    lines.push(
      "",
      "Unanswered:",
      ...result.unanswered.map((id) => `- ${titleOf(id)}`)
    )
  return lines.join("\n")
}
