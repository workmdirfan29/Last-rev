import {
  AMBIGUOUS_RULES,
  EXTRA_ALIASES,
  STOP_WORDS,
} from "@/data/jobmatch/terms"
import { SKILLS, SKILL_BY_ID } from "@/data/curriculum/skills"

/**
 * Local, transparent matching of a job description against the skills table: EXACT names and listed aliases only, as
 * whole names (never inside another word), with explicit rules for ambiguous short names. Every match carries the
 * sentence it was found in. Nothing is guessed, and nothing here touches the network.
 */
export const MAX_CHARS = 50_000
export const MAX_SENTENCES = 600

export interface Term {
  text: string
  skillId: string
  /** The pattern that must match inside a sentence. */
  re: RegExp
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")
/** A whole name: not preceded or followed by a letter, a digit, `+` or `#` (so `Java` is not in `JavaScript`, `C` not in `C++`). */
const whole = (name: string) =>
  new RegExp(`(?<![A-Za-z0-9+#])${esc(name)}(?![A-Za-z0-9+#])`, "i")

/** Names dropped because they are very short and have no explicit rule: they are never matched. */
export const DROPPED: string[] = []

function buildTerms(): Term[] {
  const out: Term[] = []
  const seen = new Set<string>()
  const add = (text: string, skillId: string) => {
    const key = `${skillId}|${text.toLowerCase()}`
    if (seen.has(key)) return
    seen.add(key)
    const rule = AMBIGUOUS_RULES[text.toLowerCase()]
    if (rule)
      return void out.push({ text, skillId, re: new RegExp(rule.pattern) })
    if (text.length <= 2) return void DROPPED.push(text)
    out.push({ text, skillId, re: whole(text) })
  }
  for (const s of SKILLS) {
    add(s.title, s.id)
    for (const a of s.aliases) add(a, s.id)
  }
  for (const e of EXTRA_ALIASES)
    if (SKILL_BY_ID.has(e.skillId)) add(e.term, e.skillId)
  // longest names first so "Spring Boot" is found before anything shorter that sits inside it
  return out.sort((a, b) => b.text.length - a.text.length)
}
export const TERMS: readonly Term[] = buildTerms()

/** Sentences: line breaks, bullets and `. ! ?` followed by a space and a capital start a new one. */
export function splitSentences(text: string): string[] {
  return text
    .normalize("NFKC")
    .split(/\r?\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) =>
      s
        .replace(/^[\s•*\-–·\d.)]+/, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((s) => s.length > 0)
    .slice(0, MAX_SENTENCES)
}

export interface Evidence {
  sentence: string
  /** Where the matched words are inside the sentence. */
  start: number
  end: number
}
export interface SkillMatch {
  skillId: string
  mentions: number
  /** Up to two sentences, so every match can be checked by eye. */
  evidence: Evidence[]
}
export interface Analysis {
  sentences: number
  matches: SkillMatch[]
  /** Words that look like technology names but are not in the table. Never matched, never guessed. */
  unrecognised: string[]
  truncated: boolean
}

const TOKEN = /[A-Za-z][A-Za-z0-9]*(?:[.+#/-][A-Za-z0-9]+)*[+#]*/g

/** Whether a word looks like a technology name (so it is worth reporting as not recognised). */
function looksLikeName(word: string, atSentenceStart: boolean): boolean {
  if (STOP_WORDS.has(word.toLowerCase())) return false
  if (/\d/.test(word) || /[.+#]/.test(word)) return true
  if (/^[A-Z]{2,6}$/.test(word)) return true // ALL CAPS: SQL, NLP, GraphQL's cousins
  if (/^[A-Z][a-z]+[A-Z]/.test(word) || /^[a-z]+[A-Z]/.test(word)) return true // CamelCase
  return !atSentenceStart && /^[A-Z][a-z]{2,}$/.test(word)
}

export function analyse(raw: string): Analysis {
  const truncated = raw.length > MAX_CHARS
  const sentences = splitSentences(raw.slice(0, MAX_CHARS))
  const found = new Map<string, SkillMatch>()
  const unrecognised = new Set<string>()

  for (const sentence of sentences) {
    const claimed: [number, number][] = []
    const overlaps = (a: number, b: number) =>
      claimed.some(([x, y]) => a < y && b > x)
    for (const t of TERMS) {
      const m = t.re.exec(sentence)
      if (!m) continue
      // a rule pattern may match a longer phrase; mark the skill name itself
      const start = m.index
      const end = m.index + m[0].length
      if (overlaps(start, end)) continue
      claimed.push([start, end])
      const entry = found.get(t.skillId) ?? {
        skillId: t.skillId,
        mentions: 0,
        evidence: [],
      }
      entry.mentions++
      if (
        entry.evidence.length < 2 &&
        !entry.evidence.some((e) => e.sentence === sentence)
      )
        entry.evidence.push({ sentence, start, end })
      found.set(t.skillId, entry)
    }
    for (const m of sentence.matchAll(TOKEN)) {
      const word = m[0].replace(/[.,;:]+$/, "")
      const a = m.index
      if (overlaps(a, a + word.length)) continue
      if (looksLikeName(word, a === 0)) unrecognised.add(word)
    }
  }
  return {
    sentences: sentences.length,
    matches: [...found.values()].sort(
      (a, b) => b.mentions - a.mentions || a.skillId.localeCompare(b.skillId)
    ),
    unrecognised: [...unrecognised].slice(0, 30),
    truncated,
  }
}
