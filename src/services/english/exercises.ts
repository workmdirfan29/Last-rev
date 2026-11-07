import { seedFrom, seededRandom, shuffled } from "@/utils/random"
import type { EnglishItem, EnglishLesson } from "@/types/english"
import { isCorrect, normalise, words } from "./normalise"

/**
 * Text exercises, deterministic and objectively checkable: a typed or arranged answer is matched against the
 * stored sentence and its accepted variants after normalising (case, punctuation, contractions). There is no
 * fuzzy matching and nothing is scored: an answer is correct or it is not.
 */
export type ExerciseKind =
  "type" | "arrange" | "blank" | "choose" | "match" | "speak"
export const TEXT_KINDS: readonly ExerciseKind[] = [
  "type",
  "arrange",
  "blank",
  "choose",
  "match",
]

export type Exercise =
  | {
      kind: "type"
      id: string
      itemId: string
      prompt: string
      answer: string
      accepted: string[]
    }
  | {
      kind: "arrange"
      id: string
      itemId: string
      hi: string
      tokens: string[]
      answer: string
      accepted: string[]
    }
  | { kind: "blank"; id: string; itemId: string; text: string; answer: string }
  | {
      kind: "choose"
      id: string
      itemId: string
      prompt: string
      options: string[]
      answer: string
    }
  | {
      kind: "match"
      id: string
      itemIds: string[]
      pairs: { itemId: string; en: string; hi: string }[]
      hiOrder: number[]
    }
  | { kind: "speak"; id: string; itemId: string; target: string; hi: string }

const MIN_ARRANGE = 3
const MAX_ARRANGE = 14

/** Every exercise one item supports. Type, arrange and speak are built from the item; blank and choose are authored. */
export function exercisesForItem(item: EnglishItem, seed: number): Exercise[] {
  const out: Exercise[] = []
  const random = seededRandom(seedFrom(`${item.id}|${seed}`))
  if (item.kind === "sentence") {
    out.push({
      kind: "type",
      id: `${item.id}#type`,
      itemId: item.id,
      prompt: item.hi,
      answer: item.en,
      accepted: item.accepted ?? [],
    })
    const tokens = item.en.split(/\s+/).filter(Boolean)
    if (tokens.length >= MIN_ARRANGE && tokens.length <= MAX_ARRANGE) {
      let order = shuffled(tokens, random)
      // never hand the learner the answer already in order
      if (order.join(" ") === tokens.join(" "))
        order = [...order.slice(1), order[0]]
      out.push({
        kind: "arrange",
        id: `${item.id}#arrange`,
        itemId: item.id,
        hi: item.hi,
        tokens: order,
        answer: item.en,
        accepted: item.accepted ?? [],
      })
    }
    out.push({
      kind: "speak",
      id: `${item.id}#speak`,
      itemId: item.id,
      target: item.en,
      hi: item.hi,
    })
  }
  if (item.kind === "vocab")
    out.push({
      kind: "type",
      id: `${item.id}#type`,
      itemId: item.id,
      prompt: item.hi,
      answer: item.word,
      accepted: [],
    })
  if (
    (item.kind === "sentence" ||
      item.kind === "vocab" ||
      item.kind === "grammar") &&
    item.activity
  ) {
    const a = item.activity
    if (a.type === "blank")
      out.push({
        kind: "blank",
        id: `${item.id}#blank`,
        itemId: item.id,
        text: a.text,
        answer: a.answer,
      })
    if (a.type === "choose")
      out.push({
        kind: "choose",
        id: `${item.id}#choose`,
        itemId: item.id,
        prompt: a.prompt,
        options: shuffled(a.options, random),
        answer: a.answer,
      })
  }
  return out
}

/** A match exercise from 4 or 5 sentence/vocab items of a lesson: pair each English line with its Hindi. */
export function matchExercise(
  items: readonly EnglishItem[],
  seed: number
): Exercise | null {
  const usable = items.filter(
    (i) => i.kind === "sentence" || i.kind === "vocab"
  )
  if (usable.length < 4) return null
  const random = seededRandom(seedFrom(`${usable[0].id}|match|${seed}`))
  const chosen = shuffled(usable, random).slice(0, 5)
  const pairs = chosen.map((i) => ({
    itemId: i.id,
    en: i.kind === "sentence" ? i.en : i.word,
    hi: i.kind === "sentence" ? i.hi : i.hi,
  }))
  const hiOrder = shuffled(
    pairs.map((_, i) => i),
    random
  )
  return {
    kind: "match",
    id: `${usable[0].id}#match`,
    itemIds: chosen.map((c) => c.id),
    pairs,
    hiOrder,
  }
}

export interface SessionOptions {
  kinds: readonly ExerciseKind[]
  count: number
  seed: number
}
export interface SessionPlan {
  exercises: Exercise[]
  /** How many exercises the lessons could supply for these settings (a short pool is said plainly, never padded). */
  available: number
}

/** Pick a seeded set of exercises from lessons: never a repeat, never more than exist. */
export function buildSession(
  lessons: readonly EnglishLesson[],
  opts: SessionOptions
): SessionPlan {
  const pool: Exercise[] = []
  for (const l of lessons) {
    for (const item of l.items) pool.push(...exercisesForItem(item, opts.seed))
    const m = matchExercise(l.items, opts.seed)
    if (m) pool.push(m)
  }
  const wanted = pool.filter((e) => opts.kinds.includes(e.kind))
  const random = seededRandom(seedFrom(`session|${opts.seed}`))
  return {
    exercises: shuffled(wanted, random).slice(0, opts.count),
    available: wanted.length,
  }
}

export interface WordDiff {
  word: string
  status: "ok" | "missing"
}
export interface CheckResult {
  correct: boolean
  /** The stored answer, to show when the learner's was not right. */
  expected: string
  /** Each word of the expected answer: found in the learner's answer (in order) or missing. */
  diff: WordDiff[]
  /** Words in the learner's answer that are not in the expected one. */
  extra: string[]
}

/** Which expected words appear in the answer, in order (longest common subsequence). */
export function wordDiff(
  expected: string,
  given: string
): { diff: WordDiff[]; extra: string[] } {
  const e = words(expected)
  const g = words(given)
  const dp: number[][] = Array.from({ length: e.length + 1 }, () =>
    Array(g.length + 1).fill(0)
  )
  for (let i = e.length - 1; i >= 0; i--)
    for (let j = g.length - 1; j >= 0; j--)
      dp[i][j] =
        e[i] === g[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
  const found = new Set<number>()
  const used = new Set<number>()
  let i = 0
  let j = 0
  while (i < e.length && j < g.length) {
    if (e[i] === g[j]) {
      found.add(i)
      used.add(j)
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  return {
    diff: e.map((word, k) => ({
      word,
      status: found.has(k) ? ("ok" as const) : ("missing" as const),
    })),
    extra: g.filter((_, k) => !used.has(k)),
  }
}

/** Check a response. `response` is typed text, the arranged words joined, the chosen option, or for match the number of correct pairs it must equal. */
export function checkExercise(
  ex: Exercise,
  response: string | readonly number[]
): CheckResult {
  if (ex.kind === "match") {
    const given = response as readonly number[]
    const correct =
      ex.pairs.length === given.length && given.every((h, k) => h === k)
    return {
      correct,
      expected: ex.pairs.map((p) => `${p.en} = ${p.hi}`).join("; "),
      diff: [],
      extra: [],
    }
  }
  const text = response as string
  if (ex.kind === "choose") {
    const correct = normalise(text) === normalise(ex.answer)
    return { correct, expected: ex.answer, diff: [], extra: [] }
  }
  if (ex.kind === "blank") {
    const correct = normalise(text) === normalise(ex.answer)
    return { correct, expected: ex.answer, diff: [], extra: [] }
  }
  if (ex.kind === "speak")
    return { correct: false, expected: ex.target, diff: [], extra: [] }
  const accepted = ex.accepted
  const correct = isCorrect(text, ex.answer, accepted)
  const { diff, extra } = wordDiff(ex.answer, text)
  return {
    correct,
    expected: ex.answer,
    diff: correct ? [] : diff,
    extra: correct ? [] : extra,
  }
}
