import { READINESS_CATEGORIES } from "@/data/readiness/categories"

/**
 * Where a research entry may sit: every readiness category, plus four areas of its own for findings that are
 * about the market and the process rather than one category.
 */
export interface ResearchArea {
  id: string
  label: string
}

export const EXTRA_RESEARCH_AREAS: readonly ResearchArea[] = [
  { id: "jobs", label: "Jobs and the market" },
  {
    id: "interview-process",
    label: "Interview process and assessment formats",
  },
  { id: "languages-and-frameworks", label: "Languages and frameworks" },
  { id: "ai", label: "AI engineering skills" },
]

export const RESEARCH_AREAS: readonly ResearchArea[] = [
  ...READINESS_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ...EXTRA_RESEARCH_AREAS,
]

export const RESEARCH_AREA_BY_ID: ReadonlyMap<string, ResearchArea> = new Map(
  RESEARCH_AREAS.map((a) => [a.id, a])
)
export const researchAreaLabel = (id: string) =>
  RESEARCH_AREA_BY_ID.get(id)?.label ?? id
