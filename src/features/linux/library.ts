import { LINUX_COMMANDS } from "@/data/linux/commands"
import {
  LINUX_CATEGORIES,
  LINUX_CATEGORY_LABEL,
  type LinuxCategory,
  type LinuxCommand,
} from "@/data/linux/schema"

/** Rows in the reference file: the unique commands plus any rows merged into another entry. */
export const REFERENCE_ROWS =
  LINUX_COMMANDS.length +
  LINUX_COMMANDS.reduce(
    (sum, c) => sum + Math.max(0, (c.erratum?.mergedFrom?.length ?? 1) - 1),
    0
  )

export interface LibraryFilters {
  query: string
  category: LinuxCategory | "all"
  savedOnly: boolean
}

export const EMPTY_FILTERS: LibraryFilters = {
  query: "",
  category: "all",
  savedOnly: false,
}

const haystack = (c: LinuxCommand) =>
  [
    c.syntax,
    c.description,
    c.example,
    c.note ?? "",
    LINUX_CATEGORY_LABEL[c.category],
  ]
    .join(" ")
    .toLowerCase()

export function filterCommands(
  commands: readonly LinuxCommand[],
  filters: LibraryFilters,
  isSaved: (id: string) => boolean
): LinuxCommand[] {
  const q = filters.query.trim().toLowerCase()
  return commands.filter(
    (c) =>
      (filters.category === "all" || c.category === filters.category) &&
      (!filters.savedOnly || isSaved(c.id)) &&
      (q === "" || haystack(c).includes(q))
  )
}

/** Categories that have commands, in the reference file's order, with counts. */
export function categoryCounts(
  commands: readonly LinuxCommand[]
): { id: LinuxCategory; count: number }[] {
  return LINUX_CATEGORIES.map((id) => ({
    id,
    count: commands.filter((c) => c.category === id).length,
  })).filter((c) => c.count > 0)
}

export const commandBySlug = (slug: string | undefined) =>
  LINUX_COMMANDS.find((c) => c.slug === slug)
