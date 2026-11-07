import type { Difficulty, DomainId } from "@/data/catalog/module-types"
import { skillsForModule } from "@/data/curriculum/skills"
import type { SyllabusEntry } from "./syllabus"

export type StatusFilter =
  "all" | "selected" | "core" | "recommended" | "optional"

export interface ModuleFilterState {
  query: string
  status: StatusFilter
  /** "Technology area": one of the nine domains. */
  domain: DomainId | "all"
  difficulty: Difficulty | "all"
  /** Reveal modules outside the learner's path (the full catalogue). */
  showAll: boolean
}

export const DEFAULT_MODULE_FILTERS: ModuleFilterState = {
  query: "",
  status: "all",
  domain: "all",
  difficulty: "all",
  showAll: false,
}

export const isFiltering = (f: ModuleFilterState) =>
  f.query.trim() !== "" ||
  f.status !== "all" ||
  f.domain !== "all" ||
  f.difficulty !== "all"

const searchText = (e: SyllabusEntry): string =>
  [
    e.module.title,
    e.module.description,
    ...e.module.topics,
    ...skillsForModule(e.module.id).flatMap((s) => [s.title, ...s.aliases]),
  ]
    .join(" ")
    .toLowerCase()

/**
 * Which modules to list. By default only modules relevant to the path, plus
 * any the learner added; "showAll" reveals the full catalogue.
 */
export function filterEntries(
  entries: readonly SyllabusEntry[],
  f: ModuleFilterState
): SyllabusEntry[] {
  const q = f.query.trim().toLowerCase()
  return entries.filter((e) => {
    if (!f.showAll && e.tier === null && !e.selected) return false
    if (f.status === "selected" && !e.selected) return false
    if (
      (f.status === "core" ||
        f.status === "recommended" ||
        f.status === "optional") &&
      e.tier !== f.status
    )
      return false
    if (
      f.domain !== "all" &&
      e.module.domainId !== f.domain &&
      !e.module.alsoIn.includes(f.domain)
    )
      return false
    if (f.difficulty !== "all" && e.module.difficulty !== f.difficulty)
      return false
    return q === "" || searchText(e).includes(q)
  })
}
