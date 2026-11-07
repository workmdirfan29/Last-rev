import { HR_DENIED_NAMES } from "@/data/questions/hr-denylist"
import type { Question } from "@/types/content"
import {
  findDeniedName,
  findFrequencyClaim,
  findStatisticClaim,
  findUnbracketedMetric,
} from "./quality"

/** Text a learner reads as a sample answer: where an invented achievement could hide. */
export const sampleTextOf = (q: Question): string =>
  [
    q.shortAnswer,
    ...q.detailedAnswer,
    q.weakAnswer ?? "",
    q.realWorldExample,
    ...(q.answerFramework ?? []),
    ...Object.values(q.starPrompts ?? {}),
  ].join("\n")

/** Every piece of text in an HR question. */
export const hrTextOf = (q: Question): string =>
  [
    q.title,
    q.interviewerIntent,
    sampleTextOf(q),
    ...q.commonMistakes,
    ...q.answerTips,
    ...q.keyPoints,
    ...q.revisionNotes,
    ...(q.weakAnswerWhy ?? []),
    ...(q.recruiterExpects ?? []),
    ...(q.selfCheck ?? []),
    ...q.followUps.flatMap((f) => [f.question, f.hint ?? ""]),
  ].join("\n")

/**
 * The content rules for one HR question; returns what is wrong (empty when it passes). The content gate runs
 * this over every `hr-*` question, so a bad one fails the build rather than reaching a learner.
 */
export function validateHrQuestion(
  q: Question,
  denied: readonly string[] = HR_DENIED_NAMES
): string[] {
  const problems: string[] = []
  if (!q.weakAnswer) problems.push("missing weakAnswer")
  if (!q.weakAnswerWhy?.length) problems.push("missing weakAnswerWhy")
  if (!q.recruiterExpects?.length) problems.push("missing recruiterExpects")
  if (!q.answerFramework?.length) problems.push("missing answerFramework")
  else if (!q.answerFramework.some((s) => /\[[^\]]+\]/.test(s)))
    problems.push(
      "answerFramework needs [bracketed placeholders] for the learner's own facts"
    )
  if (!q.starPrompts) problems.push("missing starPrompts")
  if (q.answerTips.length === 0) problems.push("missing answerTips")
  if (q.level !== "fresher")
    problems.push("HR questions are filed under fresher.ts (level-neutral)")

  const text = hrTextOf(q)
  const stat = findStatisticClaim(text)
  if (stat) problems.push(`statistic claim: "${stat}"`)
  const freq = findFrequencyClaim(text)
  if (freq) problems.push(`frequency claim: "${freq}"`)
  const name = findDeniedName(text, denied)
  if (name) problems.push(`names a company or product: "${name}"`)
  const metric = findUnbracketedMetric(sampleTextOf(q))
  if (metric)
    problems.push(
      `a sample answer states a metric as fact ("${metric}"); put it in a [placeholder]`
    )
  return problems
}
