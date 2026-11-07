import { z } from "zod"

/**
 * Spoken English course content. Authored in src/data/english/ (one file per module, and one file per
 * category for the Daily English module), parsed with these schemas, and indexed by `pnpm english:index`.
 *
 * Every item has English, Hindi (Devanagari) and a way to practise it. The gate
 * (services/english/gate.ts, run by data/english/content-gate.test.ts) checks the rules a machine can check;
 * it cannot judge whether the English or the Hindi is correct, which is why every module carries a
 * `review` flag and draft modules say "not yet reviewed by an English teacher".
 */

export const ENGLISH_MODULE_IDS = [
  "fundamentals",
  "daily",
  "speaking",
  "professional",
  "interview",
] as const
export type EnglishModuleId = (typeof ENGLISH_MODULE_IDS)[number]

/** lowercase-hyphen segment, valid inside an id and a file name */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const slug = z
  .string()
  .regex(SLUG_PATTERN, "use lowercase words joined by hyphens")

/** Hindi text: must contain Devanagari (the gate also limits Latin letters in it). */
export const hindi = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .refine((s) => /\p{Script=Devanagari}/u.test(s), {
      message: "Hindi text must be written in Devanagari",
    })
const english = (max: number) => z.string().min(1).max(max)

export const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "article",
  "interjection",
  "number",
  "phrase",
] as const

/** One spoken line: who says it, in English and in Hindi. */
export const dialogueLineSchema = z.object({
  speaker: z.string().min(1).max(20),
  en: english(140),
  hi: hindi(220),
})
export type DialogueLine = z.infer<typeof dialogueLineSchema>

const enHi = z.object({ en: english(220), hi: hindi(260) })

/** A short usage hint, in English and Hindi (for example a common Hinglish pattern to avoid). */
export const noteSchema = enHi.extend({
  en: english(200),
  hi: hindi(240),
})

/**
 * How an item is practised. `type`, `arrange` and `speak` need nothing more: they are built from the item
 * itself (type the English from the Hindi, put the shuffled words in order, say it aloud). `blank` and
 * `choose` carry their own text.
 */
export const activitySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("type") }),
  z.object({ type: z.literal("arrange") }),
  z.object({ type: z.literal("speak") }),
  z.object({
    type: z.literal("blank"),
    /** The sentence with exactly one ___ where `answer` goes. */
    text: english(160),
    answer: english(30),
  }),
  z.object({
    type: z.literal("choose"),
    prompt: english(160),
    /** 3 or 4 options; `answer` is the one that is correct and must be one of them. */
    options: z.array(english(40)).min(3).max(4),
    answer: english(40),
  }),
])
export type Activity = z.infer<typeof activitySchema>

export const sentenceItemSchema = z.object({
  kind: z.literal("sentence"),
  slug,
  /** The English sentence, at most 20 words. Contractions (I'm, don't) are fine. */
  en: english(120),
  hi: hindi(200),
  /** Optional Roman letters for the Hindi, for learners who cannot yet read Devanagari. Latin letters only. */
  hiRoman: z.string().max(240).optional(),
  whenToUse: english(160).min(10),
  example: z.array(dialogueLineSchema).min(2).max(6),
  activity: activitySchema,
  /** Other correct English wordings of the same sentence (typed answers are matched against `en` and these). */
  accepted: z.array(english(140)).max(6).optional(),
  note: noteSchema.optional(),
})

export const vocabItemSchema = z.object({
  kind: z.literal("vocab"),
  slug,
  word: english(30),
  partOfSpeech: z.enum(PARTS_OF_SPEECH),
  hi: hindi(120),
  exampleEn: english(140),
  exampleHi: hindi(200),
  activity: activitySchema.optional(),
})

export const grammarItemSchema = z.object({
  kind: z.literal("grammar"),
  slug,
  title: english(80),
  rule: enHi,
  examples: z
    .array(z.object({ en: english(140), hi: hindi(200) }))
    .min(2)
    .max(6),
  commonMistake: z.object({
    wrong: english(140),
    right: english(140),
    why: enHi,
  }),
  /** `blank` or `choose` only: a grammar item has no single sentence to type or say. */
  activity: activitySchema,
  note: noteSchema.optional(),
})

export const dialogueItemSchema = z.object({
  kind: z.literal("dialogue"),
  slug,
  title: english(80),
  situation: enHi,
  lines: z.array(dialogueLineSchema).min(4).max(10),
})

export const ANSWER_LEVELS = ["easy", "intermediate", "professional"] as const
export type AnswerLevel = (typeof ANSWER_LEVELS)[number]

/** Interview English: one question, three levels of English. Variants use [placeholders] for the learner's own facts. */
export const answerItemSchema = z.object({
  kind: z.literal("answer"),
  slug,
  question: english(140),
  variants: z
    .array(
      z.object({
        level: z.enum(ANSWER_LEVELS),
        en: english(900),
        hi: hindi(1200),
      })
    )
    .length(3),
  tips: z.array(english(200)).min(1).max(5),
})

export const itemSchema = z.discriminatedUnion("kind", [
  sentenceItemSchema,
  vocabItemSchema,
  grammarItemSchema,
  dialogueItemSchema,
  answerItemSchema,
])
export type ItemKind = z.infer<typeof itemSchema>["kind"]

export const ITEM_KINDS = [
  "sentence",
  "vocab",
  "grammar",
  "dialogue",
  "answer",
] as const

export const lessonSchema = z.object({
  slug,
  title: english(80),
  titleHi: hindi(100),
  /** What the learner can do after this lesson. */
  goal: english(160),
  items: z.array(itemSchema).min(3).max(30),
})
export type AuthoredLesson = z.input<typeof lessonSchema>

/** A parsed lesson with ids filled in: `en.<module>.<lesson>` and `en.<module>.<lesson>.<item slug>`. */
export type EnglishItem = z.infer<typeof itemSchema> & { id: string }
export type EnglishLesson = Omit<z.infer<typeof lessonSchema>, "items"> & {
  id: string
  moduleId: EnglishModuleId
  items: EnglishItem[]
}

export const itemId = (
  moduleId: string,
  lessonSlug: string,
  itemSlug: string
) => `en.${moduleId}.${lessonSlug}.${itemSlug}`
export const lessonId = (moduleId: string, lessonSlug: string) =>
  `en.${moduleId}.${lessonSlug}`

/** The lightweight record the course page, the landing card and the challenge use (written by `pnpm english:index`). */
export interface EnglishLessonIndexEntry {
  id: string
  moduleId: EnglishModuleId
  slug: string
  /** The category file inside a folder module (Daily English), else "". */
  category: string
  title: string
  titleHi: string
  goal: string
  itemIds: string[]
  /** The kind of each item, in the same order as `itemIds`. */
  itemKinds: ItemKind[]
  counts: Record<(typeof ITEM_KINDS)[number], number>
}

/** The 30-day challenge, one plan of 30 independent day-cards. */
export const challengeDaySchema = z.object({
  day: z.number().int().min(1).max(30),
  theme: z.string().max(80).optional(),
  /** The lesson of the day. */
  lesson: z.string(),
  vocab: z.array(z.string()).min(3).max(6),
  sentences: z.array(z.string()).min(3).max(6),
  /** A sentence item to say aloud (self-rated). */
  speaking: z.string(),
  /** The text exercise of the day: this many exercises drawn from this lesson. */
  exercise: z.object({
    lesson: z.string(),
    count: z.number().int().min(3).max(6),
  }),
})
export type ChallengeDay = z.infer<typeof challengeDaySchema>

export const REVIEW_STATES = ["draft", "teacher-reviewed"] as const
export type ReviewState = (typeof REVIEW_STATES)[number]
