import { z } from "zod"
import { experienceLevelSchema } from "./content"

/* -------------------------------------------------------------------------
 * Learner domain — everything the user owns. All records carry `updatedAt`
 * (ISO string) so a future sync layer can resolve conflicts last-write-wins.
 * ---------------------------------------------------------------------- */

export const PROFILE_EXPERIENCE = [
  "beginner",
  "fresher",
  "intermediate",
  "advanced",
] as const
export const profileExperienceSchema = z.enum(PROFILE_EXPERIENCE)
export type ProfileExperience = z.infer<typeof profileExperienceSchema>

export const PROFILE_EXPERIENCE_META: Record<
  ProfileExperience,
  {
    label: string
    hint: string
    defaultLevel: z.infer<typeof experienceLevelSchema>
  }
> = {
  beginner: {
    label: "Complete beginner",
    hint: "Just starting out",
    defaultLevel: "fresher",
  },
  fresher: { label: "Fresher", hint: "0–6 months", defaultLevel: "fresher" },
  intermediate: {
    label: "Intermediate",
    hint: "1–3 years",
    defaultLevel: "intermediate",
  },
  advanced: { label: "Advanced", hint: "3+ years", defaultLevel: "advanced" },
}

export const TARGET_PRESETS = ["7d", "15d", "30d", "custom"] as const
export const targetPresetSchema = z.enum(TARGET_PRESETS)
export type TargetPreset = z.infer<typeof targetPresetSchema>

/** The two journeys a learner can follow. They share one profile and one progress store. */
export const LEARNING_MODES = ["interview", "study"] as const
export const learningModeSchema = z.enum(LEARNING_MODES)
export type LearningMode = z.infer<typeof learningModeSchema>

/**
 * Where the learner is in the app. Interview Prep and Study Path are journeys with a profile and a daily
 * plan (`LearningMode`); Linux Practice is a standalone journey with no set-up and no profile.
 */
export const APP_MODES = ["interview", "study", "linux", "english"] as const
export const appModeSchema = z.enum(APP_MODES)
export type AppMode = z.infer<typeof appModeSchema>

export const PRIORITIES = ["high", "medium", "low"] as const

/** One module the learner changed from their role's defaults. Only deviations are stored. */
export const syllabusOverrideSchema = z.object({
  selected: z.boolean().optional(),
  priority: z.enum(PRIORITIES).optional(),
  /** The learner's own minutes for this module; replaces the estimate. */
  customizedMinutes: z.number().int().min(0).max(100_000).optional(),
})
export type SyllabusOverrideValue = z.infer<typeof syllabusOverrideSchema>

/** Days of the week as 0 (Sunday) to 6 (Saturday), matching `Date#getDay`. */
export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * The learner's changes to a daily plan. The schedule itself is always recomputed from the syllabus,
 * so only deviations are stored: which days they study, blocks moved to another date, blocks taken out.
 * Done blocks live in the normal per-item progress records (`topic.<module>.<slug>`).
 */
export const planStateSchema = z.object({
  /** The day the plan starts (yyyy-MM-dd). Null until the learner first opens their plan. */
  startDate: z.string().nullable().default(null),
  /** Weekdays the learner studies (0 = Sunday). The schedule skips the others. */
  studyDays: z
    .array(z.number().int().min(0).max(6))
    .min(1)
    .default([...ALL_WEEKDAYS]),
  /** Blocks pinned to a date of the learner's choosing: block id to yyyy-MM-dd. */
  moves: z.record(z.string(), z.string()).default({}),
  /** Blocks the learner took out of the plan. */
  removed: z.array(z.string()).default([]),
  /** The day the catch-up notice was dismissed, so it does not reappear that day. */
  catchUpDismissedOn: z.string().nullable().default(null),
  /** The plan-order rules this plan was last built under (see STUDY_ORDER_VERSION); null for plans from before it existed. */
  orderVersion: z.number().int().nullable().default(null),
})
export type PlanState = z.infer<typeof planStateSchema>

export const plansSchema = z
  .object({
    interview: planStateSchema.default(() => planStateSchema.parse({})),
    study: planStateSchema.default(() => planStateSchema.parse({})),
  })
  .default(() => ({
    interview: planStateSchema.parse({}),
    study: planStateSchema.parse({}),
  }))

export const learnerProfileSchema = z.object({
  displayName: z.string().max(60).default(""),
  selectedRoles: z.array(z.string()).default([]),
  primaryRole: z.string().nullable().default(null),
  experience: profileExperienceSchema.default("fresher"),
  /** Technologies the learner already knows: stable skill ids (older profiles may hold display names until migrated). */
  knownSkills: z.array(z.string()).default([]),
  /** Changes from the role defaults, by module id. The effective syllabus is defaults plus these. */
  syllabusOverrides: z.record(z.string(), syllabusOverrideSchema).default({}),
  /** The daily plan of each journey (see PlanState). */
  plans: plansSchema,
  /** The same, for the Study Path roadmap: its defaults differ from the interview roles', so its overrides are kept apart. */
  studySyllabusOverrides: z
    .record(z.string(), syllabusOverrideSchema)
    .default({}),
  targetRole: z.string().max(80).default(""),
  dailyStudyHours: z.number().min(0.5).max(12).default(2),
  targetPreset: targetPresetSchema.default("30d"),
  /** ISO date (yyyy-MM-dd) the learner wants to be ready by. */
  targetDate: z.string().nullable().default(null),
  /** Optional real interview date (yyyy-MM-dd). */
  interviewDate: z.string().nullable().default(null),
  /** Interview Prep onboarding finished. (Name kept for backward compatibility.) */
  onboardedAt: z.string().nullable().default(null),
  /** Study Path: id of the chosen roadmap (see data/catalog/roadmaps.ts). */
  studyRoadmap: z.string().nullable().default(null),
  /** Study Path onboarding finished. */
  studyOnboardedAt: z.string().nullable().default(null),
  updatedAt: z.string(),
})
export type LearnerProfile = z.infer<typeof learnerProfileSchema>

export const questionProgressSchema = z.object({
  questionId: z.string(),
  completed: z.boolean().default(false),
  bookmarked: z.boolean().default(false),
  difficult: z.boolean().default(false),
  /** Learner explicitly queued this for revision. */
  revision: z.boolean().default(false),
  /** Self-rated confidence 1–5 (0 = not rated). Separate from completion. */
  confidence: z.number().int().min(0).max(5).default(0),
  note: z.string().default(""),
  attempts: z.number().int().min(0).default(0),
  /** Spaced-repetition: index into the learner's interval list. */
  revisionStage: z.number().int().min(0).default(0),
  /** ISO date-time when this is next due; null if not scheduled. */
  nextReviewAt: z.string().nullable().default(null),
  completedAt: z.string().nullable().default(null),
  /** Taken out of the learner's prep. Notes and progress are kept so it can be restored. */
  removed: z.boolean().default(false),
  lastStudiedAt: z.string().nullable().default(null),
  updatedAt: z.string(),
})
export type QuestionProgress = z.infer<typeof questionProgressSchema>

export const ACTIVITY_TYPES = [
  "question",
  "lesson",
  "hr",
  "mock",
  "linux",
  "english",
  "revision",
  "coding",
  "project",
] as const
export const activityTypeSchema = z.enum(ACTIVITY_TYPES)
export type ActivityType = z.infer<typeof activityTypeSchema>

/** One append-only record per study action; the source of streaks and charts. */
export const activityEntrySchema = z.object({
  id: z.string(),
  type: activityTypeSchema,
  refId: z.string().optional(),
  /** yyyy-MM-dd in the learner's local timezone. */
  date: z.string(),
  minutes: z.number().min(0).default(0),
  at: z.string(),
})
export type ActivityEntry = z.infer<typeof activityEntrySchema>

export const preferencesSchema = z.object({
  /** Days after completion at which a question resurfaces for revision. */
  revisionIntervals: z
    .array(z.number().int().positive())
    .min(1)
    .default([1, 3, 7, 14, 30]),
  answerMode: z.enum(["quick", "deep"]).default("quick"),
  /** Hide answers until the learner reveals them (self-test mode). */
  selfTest: z.boolean().default(false),
  sidebarCollapsed: z.boolean().default(false),
  /** Journey the learner last used; the landing page returns them there. */
  lastMode: appModeSchema.nullable().default(null),
  /** Readiness categories the learner switched off (they stay out of the overall). */
  readinessExcluded: z.array(z.string()).default([]),
})
export type Preferences = z.infer<typeof preferencesSchema>

export const DEFAULT_REVISION_INTERVALS = [1, 3, 7, 14, 30] as const

/* --------------------------- the learner's own questions --------------------------- */

/**
 * A question the learner wrote. The id has the same `<module>.<level>.<slug>` shape
 * as curated ones (so every route and progress record works unchanged) and its
 * slug always starts with `my-`, which no curated question does.
 */
export const customQuestionSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:fresher|intermediate|advanced)\.my-[a-z0-9]+(?:-[a-z0-9]+)*$/
    ),
  moduleId: z.string().min(1),
  level: experienceLevelSchema,
  title: z.string().trim().min(3).max(200),
  /** The answer, in simple markdown: paragraphs, `-` lists, **bold** and `code`. */
  answer: z.string().max(20_000).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  note: z.string().max(5_000).default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type CustomQuestion = z.infer<typeof customQuestionSchema>

/* ------------------------------ HR answers ------------------------------ */

/** Most characters in one STAR field (about 250 words). */
export const HR_ANSWER_FIELD_MAX = 1500
export const HR_ANSWER_FIELDS = [
  "situation",
  "task",
  "action",
  "result",
] as const
export type HrAnswerField = (typeof HR_ANSWER_FIELDS)[number]

const hrAnswerFieldSchema = z.string().max(HR_ANSWER_FIELD_MAX).default("")

/**
 * An answer the learner wrote to an HR question, in the four STAR parts. Several can exist per question
 * (different stories). Stored on this device only; nothing here is ever scored or sent anywhere.
 */
export const hrAnswerSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  /** An optional short name, such as "Group project story". */
  title: z.string().max(120).default(""),
  situation: hrAnswerFieldSchema,
  task: hrAnswerFieldSchema,
  action: hrAnswerFieldSchema,
  result: hrAnswerFieldSchema,
  /** Ids of the self-check items the learner ticked (a self-assessment, not a score). */
  selfCheck: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type HrAnswer = z.infer<typeof hrAnswerSchema>

/* ---------------------------- mock interviews ---------------------------- */

export const MOCK_TYPE_IDS = [
  "hr",
  "technical",
  "java",
  "mern",
  "python",
  "data-science",
  "project",
  "mixed",
  "custom",
] as const

export const mockConfigSchema = z.object({
  type: z.enum(MOCK_TYPE_IDS),
  /** Question levels to draw from (HR and project types are level-neutral and ignore this). */
  levels: z.array(experienceLevelSchema).default([]),
  difficulty: z.enum(["any", "easy", "medium", "hard"]).default("any"),
  /** Modules the learner narrowed to (Technical, Mixed) or chose (Custom). Empty means all in the pool. */
  moduleIds: z.array(z.string()).default([]),
  count: z.number().int().min(1).max(30),
  durationMinutes: z.number().int().min(1).max(180),
  perQuestionGuide: z.boolean().default(true),
  hints: z.boolean().default(true),
  preferUnpractised: z.boolean().default(false),
  /** When the learner rates their answers: after the interview ends, or right after each answer. */
  ratingMode: z.enum(["end", "each"]).default("end"),
  /** Add the text-match keyword coverage as a named line in the score. Off unless the learner turns it on. */
  includeKeywords: z.boolean().default(false),
})
export type MockConfig = z.infer<typeof mockConfigSchema>

/** The rubric a session used, copied into it when it starts so an old score always recomputes the same. */
export const rubricSnapshotSchema = z.object({
  version: z.number().int(),
  kinds: z.record(
    z.string(),
    z.array(z.object({ id: z.string(), label: z.string(), weight: z.number() }))
  ),
  keywordWeight: z.number(),
  strongAt: z.number(),
  weakBelow: z.number(),
  minRated: z.number().int(),
})
export type RubricSnapshot = z.infer<typeof rubricSnapshotSchema>

export const mockAnswerSchema = z.object({
  questionId: z.string(),
  /** What the learner typed. Empty means unanswered. */
  text: z.string().max(20_000).default(""),
  visited: z.boolean().default(false),
  skipped: z.boolean().default(false),
  hintUsed: z.boolean().default(false),
  secondsSpent: z.number().int().min(0).default(0),
  /** Key points the learner ticked in the review ("my answer covered this"), by position. */
  ticks: z.array(z.number().int()).default([]),
  /** Dimension id to the learner's own rating, 1 to 5. */
  ratings: z.record(z.string(), z.number().int().min(1).max(5)).default({}),
  /** Plain text match of the question's keywords against the typed answer; kept so the score can be shown as stored. */
  keywordsHit: z.number().int().min(0).nullable().default(null),
  keywordsTotal: z.number().int().min(0).nullable().default(null),
})
export type MockAnswer = z.infer<typeof mockAnswerSchema>

export const mockSessionSchema = z.object({
  id: z.string().min(1),
  config: mockConfigSchema,
  seed: z.number().int(),
  /** How many questions were asked for; fewer in `questionIds` means the pool was short. */
  requested: z.number().int(),
  questionIds: z.array(z.string()),
  rubric: rubricSnapshotSchema,
  status: z.enum(["in-progress", "finished", "abandoned"]),
  /** interview: timed, answering. review: untimed, revealing model answers and rating. */
  phase: z.enum(["interview", "review"]).default("interview"),
  /** Position of the question on screen. */
  current: z.number().int().min(0).default(0),
  answers: z.array(mockAnswerSchema),
  /** Seconds of interview time used (the countdown); pause and rating time are not counted. */
  elapsedSeconds: z.number().int().min(0).default(0),
  startedAt: z.string(),
  finishedAt: z.string().nullable().default(null),
  updatedAt: z.string(),
})
export type MockSession = z.infer<typeof mockSessionSchema>

/* ------------------------------- resume studio ------------------------------ */

export const RESUME_SECTIONS = [
  "intro",
  "skills",
  "company",
  "project",
  "responsibility",
  "followup",
  "achievement",
  "difficult",
  "architecture",
  "scenario",
] as const
export type ResumeSection = (typeof RESUME_SECTIONS)[number]
export const RESUME_MODULE_PREFIX = "resume-"
export const resumeModuleId = (section: ResumeSection) =>
  `${RESUME_MODULE_PREFIX}${section}`
export const isResumeModuleId = (moduleId: string) =>
  moduleId.startsWith(RESUME_MODULE_PREFIX)

const text = (max: number) => z.string().max(max).default("")
const uid = z.string().min(1)
const textItem = z.object({ uid, text: z.string().max(400) })

/**
 * What the learner's resume says, as reviewed and corrected by them. Only this is ever used to write
 * questions. It lives on this device; the PDF itself is never stored.
 */
export const resumeProfileSchema = z.object({
  id: z.literal("profile").default("profile"),
  /** File name only, to remind the learner where it came from. */
  sourceName: z.string().max(200).default(""),
  importedAt: z.string(),
  updatedAt: z.string(),
  summary: text(1500),
  skills: z
    .array(z.object({ uid, group: text(60), name: z.string().min(1).max(80) }))
    .max(200)
    .default([]),
  experiences: z
    .array(
      z.object({
        uid,
        company: text(120),
        role: text(120),
        start: text(40),
        end: text(40),
        bullets: z.array(textItem).max(40).default([]),
      })
    )
    .max(40)
    .default([]),
  projects: z
    .array(
      z.object({
        uid,
        name: text(120),
        role: text(120),
        description: text(600),
        technologies: z.array(z.string().max(80)).max(40).default([]),
        bullets: z.array(textItem).max(40).default([]),
      })
    )
    .max(40)
    .default([]),
  education: z.array(textItem).max(20).default([]),
  certifications: z.array(textItem).max(30).default([]),
  achievements: z.array(textItem).max(30).default([]),
  /** Lines the reader could not place; the learner assigns or deletes them. */
  unplaced: z.array(textItem).max(300).default([]),
  /** Sections kept but never used for questions (languages, interests, declaration, or a heading the reader did not know). */
  other: z
    .array(
      z.object({
        uid,
        heading: z.string().max(120).default(""),
        text: z.string().max(3000).default(""),
      })
    )
    .max(30)
    .default([]),
  /** Question settings kept with the profile. */
  includeDateQuestions: z.boolean().default(true),
  /** Lifts the per-source caps on achievement and responsibility questions. */
  raiseCaps: z.boolean().default(false),
})
export type ResumeProfile = z.infer<typeof resumeProfileSchema>

export const resumeQuestionSchema = z.object({
  /** `resume-<section>.fresher.<hash>`: valid for every question route and progress record. */
  id: z.string().regex(/^resume-[a-z]+\.fresher\.[a-z0-9]+$/),
  section: z.enum(RESUME_SECTIONS),
  title: z.string().min(3).max(600),
  /** The text the template produced, so "Reset to generated" and edit detection work. */
  generatedTitle: z.string().max(600).default(""),
  framework: z.array(z.string()).default([]),
  templateId: z.string(),
  sourceKind: z.string().default(""),
  /** Stable id of the resume item it came from; empty for an imported question. */
  sourceUid: z.string().default(""),
  slotKey: z.string().default(""),
  status: z.enum(["active", "source-removed"]).default("active"),
  edited: z.boolean().default(false),
  /** Set for questions that came from an imported question set. */
  setId: z.string().default(""),
  setLabel: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ResumeQuestion = z.infer<typeof resumeQuestionSchema>

/** A question set file: questions only, plus the profile when the learner chose to include it. */
export const QUESTION_SET_APP = "lastrev-question-set"
export const questionSetSchema = z.object({
  app: z.literal(QUESTION_SET_APP),
  version: z.literal(1),
  exportedAt: z.string(),
  name: z.string().max(200).default(""),
  questions: z
    .array(
      resumeQuestionSchema.pick({
        id: true,
        section: true,
        title: true,
        framework: true,
        templateId: true,
        edited: true,
      })
    )
    .max(2000),
  profile: resumeProfileSchema.optional(),
})
export type QuestionSet = z.infer<typeof questionSetSchema>

/* ------------------------------ spoken english ------------------------------ */

/**
 * The little the English zone stores beyond ordinary progress records (items and lessons are progress
 * records `en.<module>.<lesson>[.<item>]`). Profile-free, like Linux. Everything else is derived.
 */
export const englishStateSchema = z.object({
  id: z.literal("state").default("state"),
  challenge: z
    .object({
      /** yyyy-MM-dd the learner chose as day 1, or null before they start. Only moves the dates on the day cards. */
      startDate: z.string().nullable().default(null),
      /** Days whose text exercise was passed (key: day number). */
      exercises: z.record(z.string(), z.literal(true)).default({}),
      /** Confidence check-ins, 1 to 5 (key: day number). */
      checkins: z
        .record(
          z.string(),
          z.object({ rating: z.number().int().min(1).max(5), at: z.string() })
        )
        .default({}),
    })
    .default({ startDate: null, exercises: {}, checkins: {} }),
  /** Speaking exercises the learner rated themselves on (the rating only, never audio). */
  speaking: z
    .array(
      z.object({
        itemId: z.string(),
        rating: z.number().int().min(1).max(5),
        at: z.string(),
        /** The challenge day it was done for, or null for free practice. */
        day: z.number().int().nullable().default(null),
      })
    )
    .max(2000)
    .default([]),
  /** Text exercises passed per item; two passes count an item as learned. */
  passes: z.record(z.string(), z.number().int().min(0)).default({}),
  /** The learner has read the one-time note about speech recognition. */
  speechNoticeSeen: z.boolean().default(false),
  updatedAt: z.string().default(""),
})
export type EnglishState = z.infer<typeof englishStateSchema>
export const blankEnglishState = (now: string): EnglishState =>
  englishStateSchema.parse({ updatedAt: now })

/* ------------------------------- study zone -------------------------------- */

export const QUIZ_KINDS = ["lesson", "module", "phase"] as const
export type QuizKind = (typeof QUIZ_KINDS)[number]

/**
 * One quiz attempt: what was asked (item ids), how many were right, and the pass mark in force at the time.
 * Answers the learner typed are not kept, only whether each item was right. The score is "the percentage of
 * items answered correctly" and nothing more.
 */
export const quizAttemptSchema = z.object({
  id: z.string(),
  /** `lesson.<module>.<slug>`, `module.<moduleId>` or `phase.<roadmapId>.<n>`. */
  quizId: z.string(),
  kind: z.enum(QUIZ_KINDS),
  takenAt: z.string(),
  seed: z.number().int(),
  total: z.number().int().min(1),
  correct: z.number().int().min(0),
  passMark: z.number().min(0).max(1),
  passed: z.boolean(),
  items: z.array(z.object({ itemId: z.string(), correct: z.boolean() })),
})
export type QuizAttempt = z.infer<typeof quizAttemptSchema>

/** What a learner keeps about a project besides its checklist ticks (which are ordinary progress records). */
export const projectStateSchema = z.object({
  id: z.string(),
  startedAt: z.string().nullable().default(null),
  /** A link the learner pasted themselves. Stored as text, never fetched. */
  repoUrl: z.string().max(300).default(""),
  notes: z.string().max(20000).default(""),
  updatedAt: z.string(),
})
export type ProjectState = z.infer<typeof projectStateSchema>

/* --------------------- readiness snapshots and target roles --------------------- */

/** One weekly snapshot, kept from the week the feature started; weeks before it are never reconstructed. */
export const readinessSnapshotSchema = z.object({
  /** yyyy-MM-dd of the Monday of the week (also the id). */
  id: z.string(),
  takenAt: z.string(),
  overall: z.number().min(0).max(100),
  weakTopics: z.number().int().min(0),
  averageConfidence: z.number().min(0).max(5).nullable(),
})
export type ReadinessSnapshot = z.infer<typeof readinessSnapshotSchema>

/** A job description analysed and saved by name. The text is kept unless the learner unticked it. */
export const targetRoleSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(80),
  savedAt: z.string(),
  matched: z
    .array(z.object({ skillId: z.string(), mentions: z.number().int().min(1) }))
    .max(200),
  text: z.string().max(20_000).nullable().default(null),
})
export type TargetRole = z.infer<typeof targetRoleSchema>
export const MAX_TARGET_ROLES = 20

/* ----------------------------- export bundle ---------------------------- */

/** v8 adds readiness snapshots and target roles; v7 added quiz attempts and project states; v6 added the spoken English state; v5 added the resume profile and its questions; v4 added `mockSessions`; v3 added `hrAnswers`; v2 added `customQuestions` and the per-question `removed` flag. Older files still import. */
export const EXPORT_VERSION = 8

export const exportBundleSchema = z.object({
  app: z.literal("lastrev"),
  version: z.number().int().positive(),
  exportedAt: z.string(),
  profile: learnerProfileSchema.nullable(),
  preferences: preferencesSchema,
  questionProgress: z.array(questionProgressSchema),
  activity: z.array(activityEntrySchema),
  customQuestions: z.array(customQuestionSchema).default([]),
  hrAnswers: z.array(hrAnswerSchema).default([]),
  mockSessions: z.array(mockSessionSchema).default([]),
  resume: resumeProfileSchema.nullable().default(null),
  resumeQuestions: z.array(resumeQuestionSchema).default([]),
  english: englishStateSchema.nullable().default(null),
  quizAttempts: z.array(quizAttemptSchema).default([]),
  projectStates: z.array(projectStateSchema).default([]),
  readinessSnapshots: z.array(readinessSnapshotSchema).default([]),
  targetRoles: z.array(targetRoleSchema).default([]),
})
export type ExportBundle = z.infer<typeof exportBundleSchema>
