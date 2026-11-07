import { z } from "zod"
import { sourceRefSchema } from "./content.ts"

/**
 * Study Zone projects: mini-projects and major projects, as data. A project is a brief the learner builds on
 * their own machine. LastRev never runs it, fetches it or judges it: progress is the learner's own ticks of the
 * acceptance checklist, plus notes and a repository link they paste themselves.
 *
 * Authored in `src/data/projects/<id>.ts` through `defineProject`; the gate (`services/projects/gate.ts`, run by
 * `data/projects/content-gate.test.ts`) checks the rules a machine can check.
 */

export const PROJECT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const slug = z
  .string()
  .regex(PROJECT_SLUG, "use lowercase words joined by hyphens")
const text = z.string().trim().min(1)

export const PROJECT_KINDS = ["mini", "major"] as const
export type ProjectKind = (typeof PROJECT_KINDS)[number]

export const projectStepSchema = z.object({
  title: text.max(80),
  summary: text.max(300),
  /** What "done" means for this step. Each item is one tick; progress is the ticks. */
  acceptance: z.array(text.max(200)).min(2).max(6),
  /** Lessons (ids) the learner should have finished before this step. It never locks anything: it sets when the step is due. */
  afterLessons: z.array(z.string()).max(8).default([]),
})

export const projectSchema = z
  .object({
    id: slug,
    kind: z.enum(PROJECT_KINDS),
    title: text.max(80),
    summary: text.max(300),
    /** Honest estimate of hands-on time, for a learner who has finished the lessons it builds on. */
    hours: z.number().int().min(1).max(200),
    /** Where the project is offered: a roadmap and its phase number. */
    roadmaps: z
      .array(
        z.object({
          roadmapId: z.string(),
          phase: z.number().int().min(1).max(20),
        })
      )
      .min(1),
    /** Lessons (ids) the project builds on, shown as "build on these". */
    buildsOn: z.array(z.string()).max(20).default([]),
    userStories: z.array(text.max(200)).min(3).max(10),
    requirements: z.array(text.max(240)).min(3).max(15),
    /** A suggested layout of folders and files, one per line. A suggestion, not a rule. */
    structure: z.array(text.max(120)).max(25).default([]),
    steps: z.array(projectStepSchema).min(3).max(8),
    stretch: z.array(text.max(200)).max(5).default([]),
    /** Official documentation only (the same allowlist as questions). */
    resources: z.array(sourceRefSchema).max(5).default([]),
  })
  .refine(
    (p) =>
      p.steps.every((s) => s.afterLessons.every((l) => p.buildsOn.includes(l))),
    { message: "a step's afterLessons must be listed in buildsOn" }
  )
export type AuthoredProject = z.input<typeof projectSchema>
export type Project = z.infer<typeof projectSchema>

/** Hours a project of each kind may claim (the gate checks this). */
export const PROJECT_HOURS: Record<ProjectKind, { min: number; max: number }> =
  {
    mini: { min: 2, max: 16 },
    major: { min: 20, max: 120 },
  }

/** `proj.<project id>.<n>`: acceptance item n (1-based, counted across all steps in order). */
export const projectTickId = (projectId: string, n: number) =>
  `proj.${projectId}.${n}`

/** Every acceptance item of a project in order, with the step it belongs to. */
export function acceptanceItems(p: Pick<Project, "steps">) {
  let n = 0
  return p.steps.flatMap((step, stepIndex) =>
    step.acceptance.map((text) => ({ n: ++n, stepIndex, text }))
  )
}
