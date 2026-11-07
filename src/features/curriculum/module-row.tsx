import { lessonCoverage, lessonCoverageText } from "@/services/lessons/coverage"
import { useId } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getModule } from "@/data/catalog/modules"
import { skillsForModule } from "@/data/curriculum/skills"
import type { QuestionStats } from "@/services/curriculum/progress"
import { TIER_LABEL } from "@/services/curriculum/relevance"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"
import { toHours } from "@/services/curriculum/time"
import { cn } from "@/lib/utils"
import { ModuleDetail } from "./module-detail"

export interface ModuleRowProps {
  entry: SyllabusEntry
  stats: QuestionStats
  knownSkillIds: ReadonlySet<string>
  expanded: boolean
  onToggleExpanded: () => void
  /** Omit for a read-only row. */
  onSelect?: (selected: boolean) => void
  onCustomMinutes?: (minutes: number | undefined) => void
  linuxPracticeLink?: boolean
}

/**
 * One module in the syllabus. Mandatory (core) modules are checked and locked,
 * with the reason stated in words; everything else can be switched on and off.
 */
export function ModuleRow({
  entry,
  stats,
  knownSkillIds,
  expanded,
  onToggleExpanded,
  onSelect,
  onCustomMinutes,
  linuxPracticeLink,
}: ModuleRowProps) {
  const { module: m } = entry
  const uid = useId()
  const detailId = `${uid}-detail`
  const lockId = `${uid}-lock`
  const skills = skillsForModule(m.id)
  const knownCount = skills.filter((s) => knownSkillIds.has(s.id)).length
  const prerequisites = m.prerequisites.map((id) => getModule(id)?.title ?? id)

  return (
    <li
      className={cn(
        "rounded-lg border bg-card transition-colors",
        entry.selected ? "border-border" : "border-dashed border-border/70"
      )}
    >
      <div className="flex items-start gap-3 p-3 sm:p-4">
        <div className="pt-0.5">
          <Checkbox
            id={`select-${m.id}`}
            checked={entry.selected}
            disabled={!onSelect}
            aria-label={`Include ${m.title}`}
            aria-describedby={entry.core ? lockId : undefined}
            onCheckedChange={(v) => onSelect?.(v === true)}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-sm leading-snug font-medium">{m.title}</h3>
            {entry.tier ? (
              <Badge variant={entry.tier === "core" ? "default" : "secondary"}>
                {TIER_LABEL[entry.tier]}
              </Badge>
            ) : (
              <Badge variant="outline">Not in your path</Badge>
            )}
            <Badge variant="outline" className="capitalize">
              {m.difficulty}
            </Badge>
            {entry.deferred && <Badge variant="secondary">Later</Badge>}
            {skills.length > 0 && knownCount === skills.length && (
              <Badge variant="outline">You know this</Badge>
            )}
            {knownCount > 0 && knownCount < skills.length && (
              <Badge variant="outline">
                You know {knownCount} of {skills.length}
              </Badge>
            )}
          </div>
          {entry.core && (
            <p id={lockId} className="text-xs text-muted-foreground">
              Core for your path. You can remove it, after a confirmation, and
              restore it later.
            </p>
          )}
          <p className="text-xs/relaxed text-muted-foreground">
            {m.description}
          </p>
          <dl className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <dt className="sr-only">Estimated time</dt>
              <dd className="text-foreground tabular-nums">
                {toHours(entry.minutes)} h{entry.customized ? " (yours)" : ""}
              </dd>
            </div>
            <div className="flex gap-1">
              <dt>Topics</dt>
              <dd className="text-foreground tabular-nums">
                {m.topicList.length}
              </dd>
            </div>
            <div className="flex gap-1">
              <dt>Lessons</dt>
              <dd className="text-foreground">
                {lessonCoverageText(lessonCoverage(m))}
              </dd>
            </div>
            <div className="flex gap-1">
              <dt>Questions ready</dt>
              <dd className="text-foreground tabular-nums">
                {stats.byLevel.fresher.available} of{" "}
                {stats.byLevel.fresher.target}
              </dd>
            </div>
            {prerequisites.length > 0 && (
              <div className="flex gap-1">
                <dt>Builds on</dt>
                <dd className="text-foreground">{prerequisites.join(", ")}</dd>
              </div>
            )}
          </dl>
        </div>
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls={detailId}
          aria-label={`${expanded ? "Hide" : "Show"} details for ${m.title}`}
          className="-m-1 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </div>
      {expanded && (
        <div id={detailId}>
          <ModuleDetail
            entry={entry}
            stats={stats}
            knownSkillIds={knownSkillIds}
            onCustomMinutes={onCustomMinutes}
            linuxPracticeLink={linuxPracticeLink}
          />
        </div>
      )}
    </li>
  )
}
