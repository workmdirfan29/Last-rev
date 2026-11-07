import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"
import {
  DEFAULT_FILTERS,
  type QuestionFilters,
  type SortKey,
  type StatusFilter,
} from "@/services/content/search"
import {
  DIFFICULTIES,
  EXPERIENCE_LEVELS,
  type Difficulty,
  type ExperienceLevel,
} from "@/types/content"

const STATUSES: StatusFilter[] = [
  "all",
  "todo",
  "completed",
  "bookmarked",
  "difficult",
  "revision",
]
const SORTS: SortKey[] = ["default", "relevance", "difficulty", "completion"]

function list<T extends string>(
  raw: string | null,
  allowed: readonly T[]
): T[] {
  if (!raw) return []
  return raw
    .split(",")
    .filter((v): v is T => (allowed as readonly string[]).includes(v))
}

/** Library filters live in the URL so a filtered view survives refresh and can be shared. */
export function useLibraryFilters() {
  const [params, setParams] = useSearchParams()

  const filters: QuestionFilters = useMemo(() => {
    const status = params.get("status") as StatusFilter | null
    const sort = params.get("sort") as SortKey | null
    return {
      query: params.get("q") ?? "",
      levels: list<ExperienceLevel>(params.get("level"), EXPERIENCE_LEVELS),
      difficulties: list<Difficulty>(params.get("difficulty"), DIFFICULTIES),
      topic: params.get("topic"),
      status:
        status && STATUSES.includes(status) ? status : DEFAULT_FILTERS.status,
      sort: sort && SORTS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
    }
  }, [params])

  const update = useCallback(
    (patch: Partial<QuestionFilters>) => {
      const next = { ...filters, ...patch }
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev)
          const set = (key: string, value: string | null) =>
            value ? p.set(key, value) : p.delete(key)
          set("q", next.query.trim() || null)
          set("level", next.levels.join(",") || null)
          set("difficulty", next.difficulties.join(",") || null)
          set("topic", next.topic)
          set("status", next.status === "all" ? null : next.status)
          set("sort", next.sort === "default" ? null : next.sort)
          return p
        },
        { replace: true }
      )
    },
    [filters, setParams]
  )

  const clear = useCallback(() => setParams({}, { replace: true }), [setParams])
  const active =
    !!filters.query.trim() ||
    filters.levels.length > 0 ||
    filters.difficulties.length > 0 ||
    !!filters.topic ||
    filters.status !== "all" ||
    filters.sort !== "default"

  return { filters, update, clear, active }
}
