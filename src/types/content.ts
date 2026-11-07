import { z } from "zod"

/* -------------------------------------------------------------------------
 * Content domain
 *
 * Questions belong to a MODULE (e.g. "react"). Roles (career paths) only
 * reference module ids, so the same question is never duplicated per role and
 * a learner has exactly one progress record per question.
 * ---------------------------------------------------------------------- */

export const EXPERIENCE_LEVELS = [
  "fresher",
  "intermediate",
  "advanced",
] as const
export const experienceLevelSchema = z.enum(EXPERIENCE_LEVELS)
export type ExperienceLevel = z.infer<typeof experienceLevelSchema>

export const DIFFICULTIES = ["easy", "medium", "hard"] as const
export const difficultySchema = z.enum(DIFFICULTIES)
export type Difficulty = z.infer<typeof difficultySchema>

export const LEVEL_META: Record<
  ExperienceLevel,
  { label: string; experience: string; minQuestions: number }
> = {
  fresher: { label: "Fresher", experience: "0–6 months", minQuestions: 25 },
  intermediate: {
    label: "Intermediate",
    experience: "1–3 years",
    minQuestions: 50,
  },
  advanced: { label: "Advanced", experience: "3+ years", minQuestions: 75 },
}

/** `<moduleId>.<level>.<slug>` — stable, human-readable, URL-safe. */
export const QUESTION_ID_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:fresher|intermediate|advanced)\.[a-z0-9]+(?:-[a-z0-9]+)*$/

export const codeExampleSchema = z.object({
  title: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
  /** Step-by-step walkthrough of the code, one entry per step. */
  walkthrough: z.array(z.string().min(1)).min(1),
})
export type CodeExample = z.infer<typeof codeExampleSchema>

export const diagramSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("flow"),
    title: z.string().min(1),
    steps: z
      .array(
        z.object({ label: z.string().min(1), detail: z.string().optional() })
      )
      .min(2),
  }),
  z.object({
    kind: z.literal("table"),
    title: z.string().min(1),
    headers: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(1),
  }),
])
export type Diagram = z.infer<typeof diagramSchema>

export const sourceRefSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
})
export type SourceRef = z.infer<typeof sourceRefSchema>

export const followUpSchema = z.object({
  question: z.string().min(1),
  hint: z.string().optional(),
})

/** The HR interview family: modules `hr-<slug>`. Their questions are level-neutral and have extra fields. */
export const HR_MODULE_PREFIX = "hr-"
export const isHrModuleId = (moduleId: string): boolean =>
  moduleId.startsWith(HR_MODULE_PREFIX)

/** Guidance for building a STAR answer to one question: what each part should hold. */
export const starPromptsSchema = z.object({
  situation: z.string().min(1),
  task: z.string().min(1),
  action: z.string().min(1),
  result: z.string().min(1),
})
export type StarPrompts = z.infer<typeof starPromptsSchema>

export const questionSchema = z.object({
  id: z
    .string()
    .regex(QUESTION_ID_PATTERN, "id must be <module>.<level>.<slug>"),
  moduleId: z.string().min(1),
  topic: z.string().min(1),
  subtopic: z.string().optional(),
  level: experienceLevelSchema,
  difficulty: difficultySchema,
  title: z.string().min(8),
  keywords: z.array(z.string().min(1)).min(1),

  /** Why interviewers ask this. */
  interviewerIntent: z.string().min(1),
  /** 30–60 second speakable answer (Quick Revision mode). */
  shortAnswer: z.string().min(1),
  /** Deep Learning mode — paragraphs; inline `code` and **bold** supported. */
  detailedAnswer: z.array(z.string().min(1)).min(1),
  realWorldExample: z.string().min(1),
  codeExamples: z.array(codeExampleSchema).default([]),
  diagram: diagramSchema.optional(),
  commonMistakes: z.array(z.string().min(1)).min(1),
  /** Tricky follow-ups the interviewer may ask next. */
  followUps: z.array(followUpSchema).min(1),
  /** How to deliver the answer with confidence. */
  answerTips: z.array(z.string().min(1)).default([]),
  keyPoints: z.array(z.string().min(1)).min(1),
  relatedIds: z.array(z.string()).default([]),
  revisionNotes: z.array(z.string().min(1)).default([]),
  sourceRefs: z.array(sourceRefSchema).default([]),
  estimatedMinutes: z.number().int().positive().default(3),

  /* HR interview questions only (optional for every other question; the content gate requires them for `hr-*`
   * modules). For these, interviewerIntent is why HR asks it, shortAnswer is the sample strong answer,
   * detailedAnswer the annotated breakdown and commonMistakes the mistakes to avoid. */
  /** A sample weak answer, written to show what not to say. */
  weakAnswer: z.string().min(1).optional(),
  /** Why the weak answer is weak, one point per entry. */
  weakAnswerWhy: z.array(z.string().min(1)).min(1).optional(),
  /** What the recruiter expects to hear. */
  recruiterExpects: z.array(z.string().min(1)).min(1).optional(),
  /** A personal answer framework: steps with [bracketed placeholders] the learner fills with their own facts. */
  answerFramework: z.array(z.string().min(1)).min(1).optional(),
  /** What to put in each part of a STAR answer to this question. */
  starPrompts: starPromptsSchema.optional(),
  /** Extra self-check items for this question, shown after the shared self-check list. */
  selfCheck: z.array(z.string().min(1)).optional(),
})
export type Question = z.infer<typeof questionSchema>

export const questionCollectionSchema = z.array(questionSchema)

/* ------------------------------ catalogue ------------------------------- */

/**
 * Skill areas drive both module grouping in the UI and the readiness score
 * breakdown, so there is a single classification to maintain.
 */
export const SKILL_AREAS = [
  "programming",
  "dsa",
  "frontend",
  "backend",
  "database",
  "apis",
  "security",
  "system-design",
  "testing",
  "devops",
  "linux",
  "git",
  "ai",
  "data-science",
  "hr",
] as const
export type SkillArea = (typeof SKILL_AREAS)[number]

export const SKILL_AREA_LABEL: Record<SkillArea, string> = {
  programming: "Programming fundamentals",
  dsa: "Data structures & algorithms",
  frontend: "Frontend",
  backend: "Backend & frameworks",
  database: "Databases",
  apis: "APIs",
  security: "Authentication & security",
  "system-design": "System design",
  testing: "Testing",
  devops: "Deployment & DevOps",
  linux: "Linux",
  git: "Git",
  ai: "AI integration",
  "data-science": "Data science",
  hr: "HR & behavioural",
}

export interface ModuleDef {
  id: string
  title: string
  description: string
  skillArea: SkillArea
  /** Topics covered, used for filtering inside the module. */
  topics: string[]
  prerequisites: string[]
  estimatedStudyHours: number
}

/** Lightweight per-question record used for counts, lists and global search. */
export interface QuestionIndexEntry {
  id: string
  moduleId: string
  level: ExperienceLevel
  topic: string
  difficulty: Difficulty
  title: string
  keywords: string[]
  estimatedMinutes: number
}
