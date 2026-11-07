import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useQuestionIndex } from "@/hooks/use-content"
import { assessFeasibility } from "@/services/curriculum/feasibility"
import {
  DEFAULT_MODULE_FILTERS,
  filterEntries,
  type ModuleFilterState,
} from "@/services/curriculum/filters"
import { questionStatsLookup } from "@/services/curriculum/progress"
import {
  prepareCoreFirst,
  resolveSyllabus,
  restorePriorities,
  setCustomMinutes,
  setSelected,
  type SyllabusEntry,
  type SyllabusOverrides,
} from "@/services/curriculum/syllabus"
import { summarize } from "@/services/curriculum/summary"
import { useLearnerStore } from "@/stores/learner-store"
import {
  PROFILE_EXPERIENCE_META,
  type ProfileExperience,
} from "@/types/learner"
import { CategoryAccordion } from "./category-accordion"
import { resolveSource, type CurriculumSource } from "./curriculum-source"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FeasibilityPanel } from "./feasibility-panel"
import { RemovedModules } from "./removed-modules"
import { useFooterSlot } from "./footer-slot"
import { ModuleFilters } from "./module-filters"
import { SummaryBar, SummaryStats } from "./summary-bar"

export interface CurriculumBuilderProps {
  /** Career paths (Interview Prep) or a roadmap (Study Path). The defaults come from here. */
  source: CurriculumSource
  experience: ProfileExperience
  dailyMinutes: number
  /** Days until the deadline, or null when there is none. */
  targetDays: number | null
  /** Deadline as the learner would read it, e.g. 2026-12-02. */
  deadlineLabel?: string | null
  /** The learner's changes from the defaults. */
  value: SyllabusOverrides
  onChange: (next: SyllabusOverrides) => void
  /** Skill ids the learner marked as known (a badge and a hint; they never change hours). */
  knownSkillIds?: readonly string[]
  /** Offer to change the deadline (option A). Omit when the screen cannot. */
  onExtendDeadline?: (days: number) => void
  /** Offer to change the daily time (option C). Omit when the screen cannot. */
  onIncreaseDaily?: (minutes: number) => void
  /** Class for the sticky summary bar's offset. */
  barClassName?: string
}

/**
 * The curriculum builder: a controlled component. Give it who the syllabus is
 * for and the learner's overrides, and it shows the whole syllabus, lets them
 * customise it, and reports every number from data. Reused by the onboarding
 * review steps and by Settings.
 */
export function CurriculumBuilder({
  source,
  experience,
  dailyMinutes,
  targetDays,
  deadlineLabel = null,
  value,
  onChange,
  knownSkillIds = [],
  onExtendDeadline,
  onIncreaseDaily,
  barClassName = "bottom-3",
}: CurriculumBuilderProps) {
  const { data: index } = useQuestionIndex()
  const progress = useLearnerStore((s) => s.progress)
  const footerSlot = useFooterSlot()
  const [pendingRemoval, setPendingRemoval] = useState<SyllabusEntry | null>(
    null
  )
  const [filters, setFilters] = useState<ModuleFilterState>(
    DEFAULT_MODULE_FILTERS
  )

  const { defaults, scope, domainOrder, label } = useMemo(
    () => resolveSource(source),
    [source]
  )
  const entries = useMemo(
    () => resolveSyllabus({ defaults, overrides: value, experience, scope }),
    [defaults, value, experience, scope]
  )
  const statsFor = useMemo(
    () => questionStatsLookup(index ?? [], progress),
    [index, progress]
  )
  const known = useMemo(() => new Set(knownSkillIds), [knownSkillIds])

  const visible = useMemo(
    () =>
      filterEntries(
        entries.filter((e) => !e.removed || filters.showAll),
        filters
      ),
    [entries, filters]
  )
  const summary = useMemo(
    () => summarize(entries, statsFor, visible),
    [entries, statsFor, visible]
  )
  const feasibility = useMemo(
    () =>
      assessFeasibility({
        totalMinutes: summary.minutes,
        coreMinutes: entries
          .filter((e) => e.selected && e.core && !e.deferred)
          .reduce((n, e) => n + e.minutes, 0),
        dailyMinutes,
        targetDays,
      }),
    [summary.minutes, entries, dailyMinutes, targetDays]
  )
  const total = useMemo(
    () => entries.filter((e) => e.tier !== null || e.selected).length,
    [entries]
  )

  return (
    <div className="space-y-5">
      <SummaryStats
        summary={summary}
        feasibility={feasibility}
        context={{
          label,
          experience: PROFILE_EXPERIENCE_META[experience].label,
          dailyMinutes,
          deadline: deadlineLabel,
        }}
      />

      <FeasibilityPanel
        result={feasibility}
        dailyMinutes={dailyMinutes}
        deferred={{
          modules: summary.deferredModules,
          minutes: summary.deferredMinutes,
        }}
        onPrepareCoreFirst={() => onChange(prepareCoreFirst(value, entries))}
        onRestore={() => onChange(restorePriorities(value))}
        onExtendDeadline={onExtendDeadline}
        onIncreaseDaily={onIncreaseDaily}
      />

      <ModuleFilters
        value={filters}
        onChange={setFilters}
        scope={scope}
        shown={visible.length}
        total={filters.showAll ? entries.length : total}
      />

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No modules match these filters. Try a shorter search, or turn on "Also
          show topics outside my path".
        </p>
      ) : (
        <CategoryAccordion
          // Re-open the matching areas when a filter or search is applied.
          key={`${filters.query}|${filters.status}|${filters.domain}|${filters.difficulty}|${filters.showAll}`}
          entries={visible}
          statsFor={statsFor}
          knownSkillIds={known}
          domainOrder={domainOrder}
          openAll={
            filters.query !== "" ||
            filters.status !== "all" ||
            filters.domain !== "all" ||
            filters.showAll
          }
          onSelect={(entry, selected) => {
            // Taking out a core module is the learner's choice, but it is confirmed first.
            if (!selected && entry.core) setPendingRemoval(entry)
            else onChange(setSelected(value, entry, selected))
          }}
          onCustomMinutes={(entry, minutes) =>
            onChange(setCustomMinutes(value, entry.module.id, minutes))
          }
          linuxPracticeLink={scope === "study"}
        />
      )}

      <RemovedModules
        entries={entries.filter((e) => e.removed)}
        onRestore={(entry) => onChange(setSelected(value, entry, true))}
      />

      <AlertDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {pendingRemoval?.module.title}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Core for your path. Remove anyway? You can restore it any time
              from "Removed from your syllabus".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRemoval)
                  onChange(setSelected(value, pendingRemoval, false))
                setPendingRemoval(null)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {footerSlot ? (
        createPortal(
          <SummaryBar
            variant="inline"
            summary={summary}
            feasibility={feasibility}
          />,
          footerSlot
        )
      ) : (
        <SummaryBar
          summary={summary}
          feasibility={feasibility}
          className={barClassName}
        />
      )}
    </div>
  )
}
