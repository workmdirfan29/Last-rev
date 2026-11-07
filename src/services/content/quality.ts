import {
  ALLOWED_SOURCES,
  type AllowedSource,
} from "@/data/questions/source-allowlist"

/** Whether a URL is on the official-source allowlist (https only, host or subdomain, inside any required path). */
export function isAllowedSource(
  url: string,
  allowlist: readonly AllowedSource[] = ALLOWED_SOURCES
): boolean {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  if (parsed.protocol !== "https:") return false
  const host = parsed.hostname.toLowerCase()
  return allowlist.some(
    (a) =>
      (host === a.host || host.endsWith(`.${a.host}`)) &&
      (!a.pathPrefix || parsed.pathname.startsWith(a.pathPrefix))
  )
}

/* ----------------------------- duplicate detection ----------------------------- */

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "do",
  "does",
  "did",
  "what",
  "why",
  "how",
  "when",
  "which",
  "who",
  "in",
  "of",
  "to",
  "and",
  "or",
  "for",
  "with",
  "on",
  "at",
  "by",
  "it",
  "its",
  "this",
  "that",
  "between",
  "difference",
  "differences",
  "explain",
  "describe",
  "can",
  "you",
  "i",
  "we",
  "my",
  "your",
  "vs",
  "versus",
])

/** Lower-case words of a title without punctuation or filler, so "What is X?" and "Explain X" compare as equal. */
export function normaliseTitle(title: string): string[] {
  return (
    title
      .toLowerCase()
      // Keep operators ("==", "===", "&&"): they can be the whole subject of a question.
      .replace(/[^\p{L}\p{N}+#.\s=!<>&|*/%^~-]/gu, " ")
      .split(/\s+/)
      .filter((w) => w && !STOP_WORDS.has(w))
  )
}

function jaccard(a: ReadonlySet<string>, b: ReadonlySet<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  let shared = 0
  for (const x of a) if (b.has(x)) shared++
  return shared / (a.size + b.size - shared)
}

export interface Comparable {
  id: string
  title: string
  keywords: readonly string[]
}

export interface DuplicatePair {
  a: string
  b: string
  reason: string
}

/**
 * Near-duplicate questions within one module: identical normalised titles, a very high title overlap,
 * or a high title overlap together with a high keyword overlap. Thresholds are deliberately strict so a
 * genuine pair of related questions ("var vs let" and "let vs const") is not flagged.
 */
export function findNearDuplicates(
  questions: readonly Comparable[]
): DuplicatePair[] {
  const prepared = questions.map((q) => ({
    id: q.id,
    key: normaliseTitle(q.title).join(" "),
    title: new Set(normaliseTitle(q.title)),
    keywords: new Set(q.keywords.map((k) => k.toLowerCase())),
  }))
  const pairs: DuplicatePair[] = []
  for (let i = 0; i < prepared.length; i++) {
    for (let j = i + 1; j < prepared.length; j++) {
      const a = prepared[i]
      const b = prepared[j]
      if (a.key !== "" && a.key === b.key) {
        pairs.push({ a: a.id, b: b.id, reason: "same title after normalising" })
        continue
      }
      const t = jaccard(a.title, b.title)
      const k = jaccard(a.keywords, b.keywords)
      if (t >= 0.85)
        pairs.push({
          a: a.id,
          b: b.id,
          reason: `titles overlap ${Math.round(t * 100)}%`,
        })
      else if (t >= 0.6 && k >= 0.75)
        pairs.push({
          a: a.id,
          b: b.id,
          reason: `titles ${Math.round(t * 100)}% and keywords ${Math.round(k * 100)}% overlap`,
        })
    }
  }
  return pairs
}

/* ------------------------------ frequency claims ------------------------------- */

/**
 * We have no frequency data, so content must not claim any. These patterns catch statements
 * such as "most asked", "top 10 questions", "asked in 80% of interviews" and "always asked".
 */
const FREQUENCY_PATTERNS: readonly RegExp[] = [
  /\bmost[- ](?:commonly |frequently |often )?asked\b/i,
  /\b(?:very |most )?(?:frequently|commonly|often|always|usually) asked\b/i,
  /\btop[- ]\d+\b/i,
  /\b\d{1,3}\s?%\s+of\s+(?:the\s+)?(?:interviews?|interviewers?|candidates?|companies|recruiters?)\b/i,
  /\b(?:asked|appears?|comes? up) in (?:almost |nearly |over |about )?(?:every|all|most|\d+\s?%)\s+(?:of\s+)?interviews?\b/i,
  /\bguaranteed to (?:be )?(?:asked|come up)\b/i,
]

/** The first frequency claim found in the text, or null. */
export function findFrequencyClaim(text: string): string | null {
  for (const re of FREQUENCY_PATTERNS) {
    const m = re.exec(text)
    if (m) return m[0]
  }
  return null
}

/* ------------------------------ HR interview content ------------------------------ */

/** Claims that rest on data nobody here has: statistics about recruiters, "studies show", "most employers". */
const STATISTIC_PATTERNS: readonly RegExp[] = [
  /\b(studies|research|surveys?|statistics|data|reports?)\s+(show|shows|suggest|suggests|indicate|indicates|prove|proves|found|reveal|reveals)\b/i,
  /\b\d+(?:\.\d+)?\s?%\s+of\s+(?:all\s+)?(?:recruiters|employers|hiring managers|interviewers|candidates|companies|hr\b|applicants)/i,
  /\b(?:most|majority of|nearly all|almost all)\s+(?:recruiters|employers|hiring managers|interviewers|companies)\b/i,
  /\b(?:\d+|nine|eight|seven|six|five|four|three|two|one)\s+(?:out of|in)\s+(?:\d+|ten|five|four|three)\s+(?:recruiters|employers|hiring managers|interviewers|candidates)\b/i,
]

/** The first fabricated-statistic wording in `text`, or null. */
export function findStatisticClaim(text: string): string | null {
  for (const p of STATISTIC_PATTERNS) {
    const m = p.exec(text)
    if (m) return m[0]
  }
  return null
}

/** Numbers that read like achievements: percentages, money, "increased X by 40", "led 12 people". */
const METRIC_PATTERNS: readonly RegExp[] = [
  /\d+(?:\.\d+)?\s?%/,
  /(?:[$€£₹]|\brs\.?|\binr\b)\s?\d/i,
  /\b\d[\d,.]*\s?(?:k|m|lakhs?|crores?|million|billion)\b/i,
  /\b(?:increased|decreased|reduced|improved|grew|cut|saved|boosted|raised|doubled|tripled)\b[^.\n]{0,50}\b\d/i,
  /\b(?:led|managed|supervised|trained|mentored)\s+(?:a\s+team\s+of\s+)?\d+\b/i,
  /\b\d{2,}\s+(?:users|customers|clients|students|people|members|employees|engineers|projects|countries)\b/i,
]

/**
 * A metric stated as fact in a sample answer. Anything inside [square brackets] is a placeholder the
 * learner replaces with their own number, so it is allowed ("[your metric]", "[X]%").
 */
export function findUnbracketedMetric(text: string): string | null {
  const stripped = text.replace(/\[[^\]]*\]/g, " ")
  for (const p of METRIC_PATTERNS) {
    const m = p.exec(stripped)
    if (m) return m[0].trim()
  }
  return null
}

/** The first denied company or product name (whole word, case sensitive), or null. */
export function findDeniedName(
  text: string,
  denied: readonly string[]
): string | null {
  for (const name of denied) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    if (new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`).test(text))
      return name
  }
  return null
}
