import type { ResearchEntry } from "../../types/research"

/**
 * Every research entry, loaded eagerly (there are few, and the page, the bibliography and the gate need them all).
 * One file per area in this folder; the file name is the area id (the gate checks each entry's `area` matches).
 */
const files = import.meta.glob<{ default: ResearchEntry[] }>(
  [
    "./*.ts",
    "!./author.ts",
    "!./index.ts",
    "!./areas.ts",
    "!./hosts.ts",
    "!./*.test.ts",
  ],
  { eager: true }
)

export const RESEARCH_FILES: ReadonlyMap<string, ResearchEntry[]> = new Map(
  Object.entries(files).map(([path, m]) => [
    path.replace(/^\.\//, "").replace(/\.ts$/, ""),
    m.default,
  ])
)

export const RESEARCH: readonly ResearchEntry[] = [...RESEARCH_FILES.values()]
  .flat()
  .sort(
    (a, b) =>
      b.researchedOn.localeCompare(a.researchedOn) ||
      a.topic.localeCompare(b.topic)
  )
