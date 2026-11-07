import { z } from "zod"
import { codeExampleSchema, diagramSchema, sourceRefSchema } from "./content.ts"

/**
 * Study Zone lesson content. A lesson belongs to a catalogue module (never to a roadmap) and to one of that
 * module's topics, so a module shared by two roadmaps has one lesson set and one progress.
 * Authored in `src/data/lessons/<module>/<NN>-<slug>.ts` through `defineLesson`; the gate
 * (`services/lessons/gate.ts`, run by `data/lessons/content-gate.test.ts`) checks the rules a machine can check.
 */

/** lowercase-hyphen segment: valid in an id, a file name and a URL */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const slug = z
  .string()
  .regex(SLUG_PATTERN, "use lowercase words joined by hyphens")
/** One paragraph or line of text. Inline `code` and **bold** are supported, as in question answers. */
const text = z.string().trim().min(1)
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ")

/* --------------------------------- sections --------------------------------- */

export const sectionSchema = z.discriminatedUnion("kind", [
  /** Explanation in simple English. */
  z.object({
    kind: z.literal("explain"),
    heading: text.max(80),
    body: z.array(text).min(1).max(8),
  }),
  /** A code example with a step-by-step walkthrough (the question schema's code example). */
  z.object({
    kind: z.literal("code"),
    heading: text.max(80),
    intro: text.optional(),
    example: codeExampleSchema,
  }),
  /** A flow or a table (the question schema's diagram). */
  z.object({
    kind: z.literal("diagram"),
    heading: text.max(80),
    diagram: diagramSchema,
  }),
  /** What goes wrong, and the fix. */
  z.object({
    kind: z.literal("mistakes"),
    heading: text.max(80).default("Common mistakes"),
    items: z
      .array(z.object({ mistake: text.max(200), fix: text.max(300) }))
      .min(1)
      .max(6),
  }),
  /** The idea in a realistic setting. */
  z.object({
    kind: z.literal("practical"),
    heading: text.max(80),
    scenario: text.max(400),
    body: z.array(text).min(1).max(6),
    example: codeExampleSchema.optional(),
  }),
])
export type LessonSection = z.infer<typeof sectionSchema>

/* ---------------------- knowledge check (auto-checkable) ---------------------- */

const explanation = text.max(500)
const codeBlock = z.object({ language: text.max(20), code: text.max(1500) })
const options = (min: number, max: number) =>
  z.array(text.max(200)).min(min).max(max)

export const CHECK_TYPES = [
  "single",
  "multi",
  "truefalse",
  "blank",
  "output",
] as const
export type CheckType = (typeof CHECK_TYPES)[number]

/**
 * Five item types, all scored by exact comparison with the stored answer. `explanation` is shown after every
 * answer (right or wrong); for true/false it is the reasoning. `answer` and `answers` index into `options`.
 */
export const checkItemSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("single"),
      id: slug,
      prompt: text.max(400),
      code: codeBlock.optional(),
      options: options(3, 5),
      answer: z.number().int().min(0),
      explanation,
    }),
    z.object({
      type: z.literal("multi"),
      id: slug,
      prompt: text.max(400),
      options: options(4, 6),
      answers: z.array(z.number().int().min(0)).min(2),
      explanation,
    }),
    z.object({
      type: z.literal("truefalse"),
      id: slug,
      statement: text.max(300),
      answer: z.boolean(),
      explanation,
    }),
    z.object({
      type: z.literal("blank"),
      id: slug,
      /** Contains exactly one ___ where the answer goes. */
      prompt: text.max(300),
      answer: text.max(60),
      /** Other accepted spellings. Matching ignores case (unless `caseSensitive`) and extra spaces. */
      accepted: z.array(text.max(60)).max(6).default([]),
      caseSensitive: z.boolean().default(false),
      explanation,
    }),
    z.object({
      type: z.literal("output"),
      id: slug,
      prompt: text.max(300).default("What does this print?"),
      code: codeBlock,
      options: options(3, 5),
      answer: z.number().int().min(0),
      explanation,
    }),
  ])
  .superRefine((it, ctx) => {
    const bad = (message: string) => ctx.addIssue({ code: "custom", message })
    if ("options" in it) {
      if (new Set(it.options.map(norm)).size !== it.options.length)
        bad("options must be different from each other")
      if ("answer" in it && it.answer >= it.options.length)
        bad("answer is not one of the options")
      if ("answers" in it) {
        if (new Set(it.answers).size !== it.answers.length)
          bad("answers repeat an option")
        if (it.answers.some((a) => a >= it.options.length))
          bad("an answer is not one of the options")
        if (it.answers.length >= it.options.length)
          bad("at least one option must be wrong")
      }
    }
    if (it.type === "blank" && it.prompt.split("___").length !== 2)
      bad("a blank prompt needs exactly one ___")
  })
export type CheckItem = z.infer<typeof checkItemSchema>

/* ------------------------- assignment and exercises ------------------------- */

export const assignmentSchema = z.object({
  title: text.max(80),
  task: z.array(text).min(1).max(6),
  /** What "done" means. The learner ticks each item; progress is these ticks. */
  checklist: z.array(text.max(200)).min(3).max(8),
  hints: z.array(text).max(4).default([]),
  minutes: z.number().int().min(10).max(180),
})

const json = z.json()
export const exerciseSchema = z
  .object({
    slug,
    title: text.max(80),
    task: z.array(text).min(1).max(6),
    language: text.max(20),
    starter: text.max(2000),
    /** Shown only when the learner asks. */
    solution: text.max(3000),
    hints: z.array(text).max(4).default([]),
    /** The learner ticks "my solution handles X". Always present: it is the check for every language. */
    checklist: z.array(text.max(200)).min(2).max(6),
    /**
     * JavaScript only. The runner calls `entry(...args)` for each case in an isolated worker and compares the
     * result with `expected` (both JSON values). Without `run` the exercise is self-check only.
     */
    run: z
      .object({
        entry: z.string().regex(/^[A-Za-z_$][\w$]*$/),
        cases: z
          .array(
            z.object({
              name: text.max(80),
              args: z.array(json),
              expected: json,
            })
          )
          .min(3)
          .max(12),
      })
      .optional(),
  })
  .refine((e) => !e.run || e.language === "javascript", {
    message: "only JavaScript exercises can run",
  })
export type StudyExercise = z.infer<typeof exerciseSchema>

/* ----------------------------------- lesson ---------------------------------- */

export const studyLessonSchema = z
  .object({
    slug,
    title: text.max(90),
    /** A topic title of this lesson's module (exact text). Lessons of one topic share its plan block. */
    topic: text.max(80),
    /** Reading and practice time. Lessons of a topic add up to about the topic's minutes (see the gate). */
    minutes: z.number().int().min(10).max(90),
    overview: text.max(400),
    objectives: z.array(text.max(160)).min(2).max(6),
    /** `lesson.<module>.<slug>` or a module id. Never a lock: the learner is told, not blocked. */
    prerequisites: z.array(text).max(6).default([]),
    sections: z.array(sectionSchema).min(3).max(14),
    check: z.array(checkItemSchema).min(3).max(6),
    assignment: assignmentSchema,
    exercises: z.array(exerciseSchema).max(3).default([]),
    revisionNotes: z.array(text.max(200)).min(2).max(8),
    /** Official documentation only (the same allowlist as questions). */
    resources: z.array(sourceRefSchema).min(1).max(5),
  })
  .refine(
    (l) =>
      (["explain", "mistakes", "practical"] as const).every((k) =>
        l.sections.some((s) => s.kind === k)
      ),
    {
      message:
        "a lesson needs an explanation, common mistakes and a practical example",
    }
  )
  .refine((l) => new Set(l.check.map((c) => c.id)).size === l.check.length, {
    message: "check item ids must be unique",
  })
  .refine(
    (l) => new Set(l.exercises.map((e) => e.slug)).size === l.exercises.length,
    { message: "exercise slugs must be unique" }
  )
export type AuthoredStudyLesson = z.input<typeof studyLessonSchema>
/** A parsed lesson with its stable id: `lesson.<module>.<slug>`. */
export type StudyLesson = z.infer<typeof studyLessonSchema> & {
  id: string
  moduleId: string
}

/* ------------------------------------ ids ------------------------------------ */

export const lessonIdOf = (moduleId: string, lessonSlug: string) =>
  `lesson.${moduleId}.${lessonSlug}`
export const taskIdOf = (moduleId: string, lessonSlug: string, n: number) =>
  `task.${moduleId}.${lessonSlug}.${n}`
export const exerciseIdOf = (
  moduleId: string,
  lessonSlug: string,
  exerciseSlug: string
) => `ex.${moduleId}.${lessonSlug}.${exerciseSlug}`
export const checkIdOf = (
  moduleId: string,
  lessonSlug: string,
  itemId: string
) => `check.${moduleId}.${lessonSlug}.${itemId}`

/** The lesson file name: `NN-<slug>.ts` (NN is the lesson's order inside its module). */
export const LESSON_FILE_PATTERN = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.ts$/

/** The light record every list, plan block and count reads (written by `pnpm lessons:index`). */
export interface StudyLessonIndexEntry {
  id: string
  moduleId: string
  slug: string
  /** The file under `src/data/lessons/`, without `.ts`: `<module>/<NN>-<slug>`. */
  file: string
  order: number
  title: string
  topic: string
  topicId: string
  minutes: number
  overview: string
  objectives: number
  check: { id: string; type: CheckType }[]
  assignment: { checklist: number; minutes: number }
  exercises: {
    slug: string
    title: string
    language: string
    runnable: boolean
  }[]
  prerequisites: string[]
  resources: number
}
