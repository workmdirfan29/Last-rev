import { SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type {
  QuestionFilters,
  SortKey,
  StatusFilter,
} from "@/services/content/search"
import {
  LEVEL_META,
  type Difficulty,
  type ExperienceLevel,
} from "@/types/content"

interface Props {
  filters: QuestionFilters
  topics: string[]
  active: boolean
  onChange: (patch: Partial<QuestionFilters>) => void
  onClear: () => void
  /** HR modules are level-neutral, so they have no experience-level filter. */
  hideLevel?: boolean
}

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "All questions",
  todo: "Not completed",
  completed: "Completed",
  bookmarked: "Bookmarked",
  difficult: "Marked difficult",
  revision: "In revision",
}
const SORT_LABEL: Record<SortKey, string> = {
  default: "Level order",
  relevance: "Relevance",
  difficulty: "Difficulty",
  completion: "Incomplete first",
}

export function LibraryToolbar({
  filters,
  topics,
  active,
  onChange,
  onClear,
  hideLevel,
}: Props) {
  return (
    <div className="space-y-3" role="search" aria-label="Filter questions">
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label="Search questions"
          placeholder="Search questions, answers, keywords…"
          className="h-9 ps-8"
          value={filters.query}
          onChange={(e) =>
            onChange({
              query: e.target.value,
              sort:
                e.target.value && filters.sort === "default"
                  ? "relevance"
                  : filters.sort,
            })
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!hideLevel && (
          <ToggleGroup
            type="multiple"
            variant="outline"
            aria-label="Experience level"
            value={filters.levels}
            onValueChange={(v) => onChange({ levels: v as ExperienceLevel[] })}
          >
            {(Object.keys(LEVEL_META) as ExperienceLevel[]).map((l) => (
              <ToggleGroupItem
                key={l}
                value={l}
                aria-label={`${LEVEL_META[l].label} level`}
              >
                {LEVEL_META[l].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        <ToggleGroup
          type="multiple"
          variant="outline"
          aria-label="Difficulty"
          value={filters.difficulties}
          onValueChange={(v) => onChange({ difficulties: v as Difficulty[] })}
        >
          {(["easy", "medium", "hard"] as const).map((d) => (
            <ToggleGroupItem key={d} value={d} className="capitalize">
              {d}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Select
          value={filters.topic ?? "all"}
          onValueChange={(v) => onChange({ topic: v === "all" ? null : v })}
        >
          <SelectTrigger aria-label="Topic" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(v) => onChange({ status: v as StatusFilter })}
        >
          <SelectTrigger aria-label="Status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(v) => onChange({ sort: v as SortKey })}
        >
          <SelectTrigger aria-label="Sort by" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as SortKey[]).map((s) => (
              <SelectItem key={s} value={s}>
                Sort: {SORT_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {active && (
          <Button variant="ghost" onClick={onClear}>
            <XIcon /> Clear
          </Button>
        )}
      </div>
    </div>
  )
}
