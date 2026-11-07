import { MODULE_BY_ID } from "@/data/catalog/modules"
import { SKILL_BY_ID } from "@/data/curriculum/skills"
import type { Defaults } from "@/services/curriculum/relevance"
import type { QuestionIndexEntry } from "@/types/content"
import type { QuestionProgress, QuizAttempt } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { moduleProgress } from "@/services/study/module-progress"
import type { SkillMatch } from "./matcher"

export type Tier = "core" | "recommended" | "optional"

export interface CoverageRow {
  match: SkillMatch
  skillId: string
  title: string
  moduleId: string
  moduleTitle: string
  /** The skill's tier in the learner's roadmap or roles, or null when it is not in their path. */
  tier: Tier | null
  inSyllabus: boolean
  known: boolean
  lessons: { ready: number; finished: number }
  questions: { ready: number; done: number }
  checksPassed: number
  /** Not ticked as known and nothing finished or done in its module. */
  gap: boolean
}

export interface CoverageInput {
  matches: readonly SkillMatch[]
  defaults: Defaults
  selectedModules: ReadonlySet<string>
  knownSkills: readonly string[]
  index: readonly QuestionIndexEntry[]
  progress: Readonly<Record<string, QuestionProgress>>
  lessons: readonly StudyLessonIndexEntry[]
  attempts: readonly QuizAttempt[]
}

/** What the learner already has for each skill a job description mentions, from real records. */
export function coverage(input: CoverageInput): CoverageRow[] {
  return input.matches.flatMap((match) => {
    const skill = SKILL_BY_ID.get(match.skillId)
    const mod = skill ? MODULE_BY_ID.get(skill.moduleId) : undefined
    if (!skill || !mod) return []
    const qs = input.index.filter(
      (q) => q.moduleId === mod.id && !input.progress[q.id]?.removed
    )
    const done = qs.filter((q) => input.progress[q.id]?.completed).length
    const mp = moduleProgress(
      mod,
      input.lessons,
      input.progress,
      input.attempts,
      { done, available: qs.length }
    )
    const known = input.knownSkills.includes(skill.id)
    return [
      {
        match,
        skillId: skill.id,
        title: skill.title,
        moduleId: mod.id,
        moduleTitle: mod.title,
        tier: (input.defaults.get(mod.id) as Tier | undefined) ?? null,
        inSyllabus: input.selectedModules.has(mod.id),
        known,
        lessons: { ready: mp.lessons.total, finished: mp.lessons.done },
        questions: { ready: qs.length, done },
        checksPassed: mp.checks.passed,
        gap: !known && mp.lessons.done === 0 && done === 0,
      },
    ]
  })
}

const TIER_RANK: Record<string, number> = {
  core: 0,
  recommended: 1,
  optional: 2,
}

/** Gaps first by how often the description mentions them, then by how central they are to the learner's path. */
export function gapList(rows: readonly CoverageRow[]): CoverageRow[] {
  return rows
    .filter((r) => r.gap)
    .sort(
      (a, b) =>
        b.match.mentions - a.match.mentions ||
        (TIER_RANK[a.tier ?? ""] ?? 3) - (TIER_RANK[b.tier ?? ""] ?? 3) ||
        a.title.localeCompare(b.title)
    )
}
