export interface KeywordMatch {
  matched: string[]
  total: number
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Which of a question's keywords appear in the typed answer: plain, case-insensitive, whole-term matching.
 * It cannot tell whether the answer is correct; it only says which words are there.
 */
export function matchKeywords(
  text: string,
  keywords: readonly string[]
): KeywordMatch {
  const terms = [
    ...new Set(keywords.map((k) => k.trim()).filter((k) => k !== "")),
  ]
  const matched = terms.filter((k) =>
    new RegExp(`(?<![A-Za-z0-9])${escape(k)}(?![A-Za-z0-9])`, "i").test(text)
  )
  return { matched, total: terms.length }
}
