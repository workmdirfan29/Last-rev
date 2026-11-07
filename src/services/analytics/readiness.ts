import { SKILL_AREAS, type SkillArea } from "@/types/content"

/**
 * Transparent readiness model.
 *
 *   area score   = 60% × completion + 40% × confidence
 *   completion   = completed questions / available questions
 *   confidence   = sum of 1–5 self-ratings / (5 × available questions)
 *   overall      = unweighted mean of areas that have available questions
 *
 * This measures preparation coverage and self-assessed confidence. It is NOT a
 * prediction of interview outcomes, and it only counts questions that exist in
 * the library today.
 */
export const READINESS_FORMULA = {
  completionWeight: 0.6,
  confidenceWeight: 0.4,
} as const

export interface AreaInput {
  area: SkillArea
  total: number
  completed: number
  /** Sum of 1–5 confidence ratings across the area's questions. */
  confidenceSum: number
}

export interface AreaScore {
  area: SkillArea
  total: number
  completed: number
  completion: number
  confidence: number
  score: number
}

export function scoreArea(input: AreaInput): AreaScore {
  const completion = input.total === 0 ? 0 : input.completed / input.total
  const confidence =
    input.total === 0 ? 0 : input.confidenceSum / (5 * input.total)
  const score =
    READINESS_FORMULA.completionWeight * completion +
    READINESS_FORMULA.confidenceWeight * confidence
  return {
    area: input.area,
    total: input.total,
    completed: input.completed,
    completion,
    confidence,
    score,
  }
}

export interface ReadinessResult {
  /** 0–100, or null when no content is available to measure. */
  overall: number | null
  areas: AreaScore[]
}

export function computeReadiness(inputs: AreaInput[]): ReadinessResult {
  const merged = new Map<SkillArea, AreaInput>()
  for (const i of inputs) {
    const prev = merged.get(i.area)
    merged.set(
      i.area,
      prev
        ? {
            area: i.area,
            total: prev.total + i.total,
            completed: prev.completed + i.completed,
            confidenceSum: prev.confidenceSum + i.confidenceSum,
          }
        : i
    )
  }
  const areas = SKILL_AREAS.flatMap((a) => {
    const v = merged.get(a)
    return v && v.total > 0 ? [scoreArea(v)] : []
  })
  if (areas.length === 0) return { overall: null, areas: [] }
  const overall = (areas.reduce((s, a) => s + a.score, 0) / areas.length) * 100
  return { overall: Math.round(overall), areas }
}
