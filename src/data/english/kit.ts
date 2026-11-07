import type { AuthoredLesson } from "@/types/english"

/**
 * Small helpers that keep each course item to one readable block. Hindi text puts English words in quotes.
 * Course content is draft until an English teacher has reviewed it (see modules.ts).
 */
export type Item = AuthoredLesson["items"][number]
export type Activity = Extract<Item, { kind: "sentence" }>["activity"]
export type Line = [speaker: string, en: string, hi: string]
export type Note = { en: string; hi: string }

export const lines = (ex: Line[]) =>
  ex.map(([speaker, en, hi]) => ({ speaker, en, hi }))

export const sent = (
  slug: string,
  en: string,
  hi: string,
  whenToUse: string,
  example: Line[],
  activity: Activity = { type: "arrange" },
  extra: { accepted?: string[]; note?: Note } = {}
): Item => ({
  kind: "sentence",
  slug,
  en,
  hi,
  whenToUse,
  example: lines(example),
  activity,
  ...extra,
})

export const vocab = (
  slug: string,
  word: string,
  partOfSpeech: Extract<Item, { kind: "vocab" }>["partOfSpeech"],
  hi: string,
  exampleEn: string,
  exampleHi: string
): Item => ({
  kind: "vocab",
  slug,
  word,
  partOfSpeech,
  hi,
  exampleEn,
  exampleHi,
})

export const grammar = (
  slug: string,
  title: string,
  rule: Note,
  examples: [string, string][],
  commonMistake: { wrong: string; right: string; why: Note },
  activity: Activity,
  note?: Note
): Item => ({
  kind: "grammar",
  slug,
  title,
  rule,
  examples: examples.map(([en, hi]) => ({ en, hi })),
  commonMistake,
  activity,
  ...(note ? { note } : {}),
})

export const dialogue = (
  slug: string,
  title: string,
  situation: Note,
  dialogueLines: Line[]
): Item => ({
  kind: "dialogue",
  slug,
  title,
  situation,
  lines: lines(dialogueLines),
})
