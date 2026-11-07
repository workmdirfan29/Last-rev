import { MODULES } from "@/data/catalog/modules"
import {
  MOCK_TYPE_DEFS,
  PROJECT_MODULE_ID,
  type MockType,
} from "@/data/mock/types"
import { seededRandom, shuffled } from "@/utils/random"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import {
  isHrModuleId,
  type ExperienceLevel,
  type QuestionIndexEntry,
} from "@/types/content"
import {
  isResumeModuleId,
  type LearnerProfile,
  type QuestionProgress,
} from "@/types/learner"

export interface PoolQuestion extends QuestionIndexEntry {
  /** One of the learner's own questions ("Yours"). */
  mine: boolean
}

export interface PoolInput {
  type: MockType
  levels: readonly ExperienceLevel[]
  difficulty: "any" | "easy" | "medium" | "hard"
  /** Narrowing (Technical, Mixed) or choosing (Custom); empty means everything in the pool. */
  moduleIds: readonly string[]
  index: readonly QuestionIndexEntry[]
  /** The learner's own questions: written by them, from their resume, or imported (see ownQuestionEntries). */
  own: readonly QuestionIndexEntry[]
  profile: Pick<
    LearnerProfile,
    "selectedRoles" | "syllabusOverrides" | "experience"
  > | null
  progress: Readonly<Record<string, QuestionProgress>>
}

/** The learner's experience as the question levels they would be asked at. */
export function defaultLevels(
  experience: string | undefined
): ExperienceLevel[] {
  if (experience === "advanced") return ["advanced"]
  if (experience === "intermediate") return ["intermediate"]
  return ["fresher"]
}

const withQuestions = (input: PoolInput): Set<string> =>
  new Set([
    ...input.index.map((q) => q.moduleId),
    ...input.own.map((c) => c.moduleId),
  ])

/** Modules a type draws from, before any narrowing by the learner. */
export function typeModules(input: PoolInput): Set<string> {
  const def = MOCK_TYPE_DEFS[input.type]
  const has = withQuestions(input)
  const syllabus = (): string[] => {
    if (!input.profile || input.profile.selectedRoles.length === 0) return []
    return resolveSyllabus({
      defaults: defaultsForRoles(input.profile.selectedRoles),
      overrides: input.profile.syllabusOverrides,
      experience: input.profile.experience,
    })
      .filter(
        (e) =>
          e.selected &&
          e.module.domainId !== "career" &&
          !isHrModuleId(e.module.id)
      )
      .map((e) => e.module.id)
  }
  const hr = () => MODULES.filter((m) => isHrModuleId(m.id)).map((m) => m.id)
  let ids: string[]
  switch (input.type) {
    case "hr":
      ids = hr()
      break
    case "technical":
      ids = syllabus()
      break
    case "mixed":
      ids = [...syllabus(), ...hr()]
      break
    case "project":
      ids = [PROJECT_MODULE_ID]
      break
    case "custom":
      ids = MODULES.filter((m) => !isResumeModuleId(m.id)).map((m) => m.id)
      break
    default: {
      // A path type: modules in its domains that are core or recommended for its role.
      const tiers = defaultsForRoles([def.role!], { includeCareer: false })
      ids = MODULES.filter(
        (m) =>
          def.domains!.includes(m.domainId) &&
          ["core", "recommended"].includes(tiers.get(m.id) ?? "")
      ).map((m) => m.id)
    }
  }
  return new Set(ids.filter((id) => has.has(id)))
}

/**
 * Every question the settings allow: from the type's modules (narrowed to the chosen ones), at the chosen
 * levels and difficulty, without the ones the learner removed. Nothing is invented and nothing is padded.
 */
export function buildPool(input: PoolInput): PoolQuestion[] {
  const def = MOCK_TYPE_DEFS[input.type]
  let modules = typeModules(input)
  const narrowed = def.pickModules && input.moduleIds.length > 0
  if (narrowed) {
    const chosen = new Set(input.moduleIds)
    // For Mixed, narrowing applies to the technical part only; HR categories stay.
    modules = new Set(
      [...modules].filter(
        (id) => chosen.has(id) || (input.type === "mixed" && isHrModuleId(id))
      )
    )
  }
  const mine = input.own.map((c) => ({ ...c, mine: true }))
  const all: PoolQuestion[] = [
    ...input.index.map((q) => ({ ...q, mine: false })),
    ...mine,
  ]
  const levels = new Set(input.levels)
  return all.filter((q) => {
    if (input.progress[q.id]?.removed) return false
    if (input.type === "project") {
      // Project-based: project questions, the learner's own, and the resume's project and architecture questions.
      const resumePart =
        q.moduleId === "resume-project" || q.moduleId === "resume-architecture"
      if (isResumeModuleId(q.moduleId)) {
        if (!resumePart) return false
      } else if (!q.mine && q.moduleId !== PROJECT_MODULE_ID) return false
    } else if (!modules.has(q.moduleId)) return false
    const neutral =
      def.levelNeutral || isHrModuleId(q.moduleId) || input.type === "project"
    if (!neutral && levels.size > 0 && !levels.has(q.level)) return false
    // Own questions have no difficulty of their own, so the filter does not apply to them.
    if (
      !q.mine &&
      input.difficulty !== "any" &&
      q.difficulty !== input.difficulty
    )
      return false
    return true
  })
}

/** How many questions a type has at all, ignoring levels, difficulty and narrowing. */
export function typeHasQuestions(input: PoolInput): number {
  return buildPool({ ...input, levels: [], difficulty: "any", moduleIds: [] })
    .length
}

/* ------------------------------- the draw ------------------------------- */

export interface DrawOptions {
  count: number
  seed: number
  preferUnpractised: boolean
  progress: Readonly<Record<string, QuestionProgress>>
}

export interface Draw {
  ids: string[]
  /** How many were asked for; fewer in `ids` means the pool was short. */
  requested: number
  /** For Mixed: how many HR questions were drawn. */
  hrCount: number
}

function pick(
  pool: readonly PoolQuestion[],
  n: number,
  random: () => number,
  opts: DrawOptions
): PoolQuestion[] {
  if (opts.preferUnpractised) {
    const fresh = shuffled(
      pool.filter((q) => !opts.progress[q.id]?.completed),
      random
    )
    const done = shuffled(
      pool.filter((q) => opts.progress[q.id]?.completed),
      random
    )
    return [...fresh, ...done].slice(0, n)
  }
  return shuffled(pool, random).slice(0, n)
}

/**
 * Choose the session's questions: seeded, never repeating, never more than the pool holds. Mixed draws from
 * its technical and HR parts in proportion to their sizes, with at least one HR question when there is an HR
 * pool and four or more questions.
 */
export function drawQuestions(
  pool: readonly PoolQuestion[],
  type: MockType,
  opts: DrawOptions
): Draw {
  const random = seededRandom(opts.seed)
  const n = Math.min(opts.count, pool.length)
  if (type !== "mixed") {
    const ids = pick(pool, n, random, opts).map((q) => q.id)
    return { ids, requested: opts.count, hrCount: 0 }
  }
  const hr = pool.filter((q) => isHrModuleId(q.moduleId))
  const tech = pool.filter((q) => !isHrModuleId(q.moduleId))
  let hrN = pool.length ? Math.round((n * hr.length) / pool.length) : 0
  if (hr.length > 0 && n >= 4) hrN = Math.max(1, hrN)
  hrN = Math.min(hrN, hr.length)
  const techN = Math.min(n - hrN, tech.length)
  hrN = Math.min(n - techN, hr.length) // fill from the other part if one is short
  const chosen = [
    ...pick(hr, hrN, random, opts),
    ...pick(tech, techN, random, opts),
  ]
  return {
    ids: shuffled(chosen, random).map((q) => q.id),
    requested: opts.count,
    hrCount: hrN,
  }
}

export { seededRandom, shuffled }
