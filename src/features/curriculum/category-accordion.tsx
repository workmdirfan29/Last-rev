import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DOMAIN_IDS,
  DOMAIN_LABEL,
  type DomainId,
} from "@/data/catalog/module-types"
import type { QuestionStats } from "@/services/curriculum/progress"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"
import { toHours } from "@/services/curriculum/time"
import { ModuleRow } from "./module-row"

export interface CategoryAccordionProps {
  entries: readonly SyllabusEntry[]
  statsFor: (moduleId: string) => QuestionStats
  knownSkillIds: ReadonlySet<string>
  onSelect?: (entry: SyllabusEntry, selected: boolean) => void
  onCustomMinutes?: (entry: SyllabusEntry, minutes: number | undefined) => void
  linuxPracticeLink?: boolean
  /** Domains to list, in order. Defaults to catalogue order. */
  domainOrder?: readonly DomainId[]
  defaultOpen?: readonly DomainId[]
  /** Open every area, for filtered or full-catalogue views. */
  openAll?: boolean
}

/** The syllabus grouped by technology area. Each area shows its selected count and hours. */
export function CategoryAccordion({
  entries,
  statsFor,
  knownSkillIds,
  onSelect,
  onCustomMinutes,
  linuxPracticeLink,
  domainOrder,
  defaultOpen,
  openAll,
}: CategoryAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const order = domainOrder ?? DOMAIN_IDS
  const groups = order
    .map((domainId) => ({
      domainId,
      items: entries.filter((e) => e.module.domainId === domainId),
    }))
    .filter((g) => g.items.length > 0)
  // Open the first areas by default so the syllabus is visible without clicking.
  const open = openAll
    ? groups.map((g) => g.domainId)
    : (defaultOpen ?? groups.slice(0, 2).map((g) => g.domainId))

  if (groups.length === 0) return null

  return (
    <Accordion
      type="multiple"
      defaultValue={[...open]}
      className="rounded-xl border border-border bg-card/40 px-3 sm:px-4"
    >
      {groups.map(({ domainId, items }) => {
        const selected = items.filter((e) => e.selected)
        const minutes = selected
          .filter((e) => !e.deferred)
          .reduce((n, e) => n + e.minutes, 0)
        return (
          <AccordionItem key={domainId} value={domainId}>
            <AccordionTrigger>
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-medium">{DOMAIN_LABEL[domainId]}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {selected.length} of {items.length} selected ·{" "}
                  {toHours(minutes)} h
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pb-2">
                {items.map((entry) => (
                  <ModuleRow
                    key={entry.module.id}
                    entry={entry}
                    stats={statsFor(entry.module.id)}
                    knownSkillIds={knownSkillIds}
                    expanded={expandedId === entry.module.id}
                    onToggleExpanded={() =>
                      setExpandedId((id) =>
                        id === entry.module.id ? null : entry.module.id
                      )
                    }
                    onSelect={onSelect && ((v) => onSelect(entry, v))}
                    onCustomMinutes={
                      onCustomMinutes && ((m) => onCustomMinutes(entry, m))
                    }
                    linuxPracticeLink={linuxPracticeLink}
                  />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
