import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  DOMAIN_LABEL,
  STUDY_DOMAIN_IDS,
  DOMAIN_IDS,
  type Difficulty,
  type DomainId,
} from "@/data/catalog/module-types"
import {
  DEFAULT_MODULE_FILTERS,
  isFiltering,
  type ModuleFilterState,
  type StatusFilter,
} from "@/services/curriculum/filters"
import { cn } from "@/lib/utils"

const STATUS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "selected", label: "Selected" },
  { id: "core", label: "Core" },
  { id: "recommended", label: "Recommended" },
  { id: "optional", label: "Optional" },
]

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"]

export function ModuleFilters({
  value,
  onChange,
  scope,
  shown,
  total,
}: {
  value: ModuleFilterState
  onChange: (next: ModuleFilterState) => void
  scope: "interview" | "study"
  shown: number
  total: number
}) {
  const patch = (p: Partial<ModuleFilterState>) => onChange({ ...value, ...p })
  const domains: readonly DomainId[] =
    scope === "study" ? STUDY_DOMAIN_IDS : DOMAIN_IDS

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Search modules"
            placeholder="Search modules, topics or technologies"
            className="ps-9"
            value={value.query}
            onChange={(e) => patch({ query: e.target.value })}
          />
        </div>
        <Select
          value={value.domain}
          onValueChange={(v) =>
            patch({ domain: v as ModuleFilterState["domain"] })
          }
        >
          <SelectTrigger aria-label="Technology area" className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All technology areas</SelectItem>
            {domains.map((d) => (
              <SelectItem key={d} value={d}>
                {DOMAIN_LABEL[d]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={value.difficulty}
          onValueChange={(v) =>
            patch({ difficulty: v as ModuleFilterState["difficulty"] })
          }
        >
          <SelectTrigger aria-label="Difficulty" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d} className="capitalize">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Show modules"
      >
        {STATUS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={value.status === s.id}
            onClick={() => patch({ status: s.id })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              value.status === s.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
        <div className="ms-auto flex items-center gap-2">
          <Switch
            id="show-full-catalogue"
            checked={value.showAll}
            onCheckedChange={(v) => patch({ showAll: v })}
          />
          <Label htmlFor="show-full-catalogue" className="text-xs font-normal">
            Also show topics outside my path
          </Label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <p role="status" aria-live="polite">
          Showing {shown} of {total} modules
        </p>
        {isFiltering(value) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({ ...DEFAULT_MODULE_FILTERS, showAll: value.showAll })
            }
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
