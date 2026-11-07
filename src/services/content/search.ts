import type {
  Difficulty,
  ExperienceLevel,
  Question,
  QuestionIndexEntry,
} from "@/types/content"
import type { QuestionProgress } from "@/types/learner"

/** The fields search can look at. Index entries only have the first four. */
export interface Searchable {
  title: string
  topic: string
  keywords: string[]
  moduleTitle?: string
  shortAnswer?: string
  detailedAnswer?: string[]
}

const WEIGHTS = {
  title: 6,
  keywords: 4,
  topic: 3,
  moduleTitle: 2,
  shortAnswer: 2,
  detailedAnswer: 1,
} as const

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}+#.]+/u)
    .filter(Boolean)
}

/**
 * Relevance score for a query. Every query token must match somewhere (AND);
 * returns 0 when any token is missing. Higher is better.
 */
export function scoreMatch(doc: Searchable, query: string): number {
  const tokens = tokenize(query)
  if (tokens.length === 0) return 1
  const fields: [string, number][] = [
    [doc.title.toLowerCase(), WEIGHTS.title],
    [doc.keywords.join(" ").toLowerCase(), WEIGHTS.keywords],
    [doc.topic.toLowerCase(), WEIGHTS.topic],
    [(doc.moduleTitle ?? "").toLowerCase(), WEIGHTS.moduleTitle],
    [(doc.shortAnswer ?? "").toLowerCase(), WEIGHTS.shortAnswer],
    [
      (doc.detailedAnswer ?? []).join(" ").toLowerCase(),
      WEIGHTS.detailedAnswer,
    ],
  ]
  let total = 0
  for (const token of tokens) {
    let best = 0
    for (const [text, weight] of fields) {
      if (text.includes(token)) best = Math.max(best, weight)
    }
    if (best === 0) return 0
    total += best
  }
  return total
}

export type StatusFilter =
  "all" | "todo" | "completed" | "bookmarked" | "difficult" | "revision"
export type SortKey = "default" | "relevance" | "difficulty" | "completion"

export interface QuestionFilters {
  query: string
  levels: ExperienceLevel[]
  difficulties: Difficulty[]
  topic: string | null
  status: StatusFilter
  sort: SortKey
}

export const DEFAULT_FILTERS: QuestionFilters = {
  query: "",
  levels: [],
  difficulties: [],
  topic: null,
  status: "all",
  sort: "default",
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
}
const LEVEL_ORDER: Record<ExperienceLevel, number> = {
  fresher: 0,
  intermediate: 1,
  advanced: 2,
}

type Item = Question | QuestionIndexEntry

function matchesStatus(
  p: QuestionProgress | undefined,
  status: StatusFilter
): boolean {
  switch (status) {
    case "all":
      return true
    case "todo":
      return !p?.completed
    case "completed":
      return !!p?.completed
    case "bookmarked":
      return !!p?.bookmarked
    case "difficult":
      return !!p?.difficult
    case "revision":
      return !!p?.revision
  }
}

/** Filter, search and sort a list of questions. Pure — no store access. */
export function filterQuestions<T extends Item>(
  items: T[],
  filters: QuestionFilters,
  progress: Record<string, QuestionProgress>,
  moduleTitle?: (moduleId: string) => string | undefined
): T[] {
  const scored: { item: T; score: number; index: number }[] = []
  items.forEach((item, index) => {
    if (filters.levels.length && !filters.levels.includes(item.level)) return
    if (
      filters.difficulties.length &&
      !filters.difficulties.includes(item.difficulty)
    )
      return
    if (filters.topic && item.topic !== filters.topic) return
    if (!matchesStatus(progress[item.id], filters.status)) return
    const score = scoreMatch(
      {
        title: item.title,
        topic: item.topic,
        keywords: item.keywords,
        moduleTitle: moduleTitle?.(item.moduleId),
        shortAnswer: "shortAnswer" in item ? item.shortAnswer : undefined,
        detailedAnswer:
          "detailedAnswer" in item ? item.detailedAnswer : undefined,
      },
      filters.query
    )
    if (score > 0) scored.push({ item, score, index })
  })

  const hasQuery = filters.query.trim().length > 0
  const sort: SortKey =
    filters.sort === "relevance" && !hasQuery ? "default" : filters.sort

  scored.sort((a, b) => {
    switch (sort) {
      case "relevance":
        return b.score - a.score || a.index - b.index
      case "difficulty":
        return (
          DIFFICULTY_ORDER[a.item.difficulty] -
            DIFFICULTY_ORDER[b.item.difficulty] || a.index - b.index
        )
      case "completion": {
        const ca = progress[a.item.id]?.completed ? 1 : 0
        const cb = progress[b.item.id]?.completed ? 1 : 0
        return ca - cb || a.index - b.index
      }
      default:
        return (
          LEVEL_ORDER[a.item.level] - LEVEL_ORDER[b.item.level] ||
          a.index - b.index
        )
    }
  })
  return scored.map((s) => s.item)
}
