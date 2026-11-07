import { useMemo, useState } from "react"
import { ChevronRightIcon, SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SKILL_GROUPS,
  SKILL_GROUP_LABEL,
  type Skill,
  type SkillGroup,
} from "@/data/curriculum/skills"
import type { Tier } from "@/data/curriculum/role-relevance"
import { cn } from "@/lib/utils"
import { legacySkills } from "@/services/curriculum/skills-migration"

export interface SkillPickerProps {
  /** Every technology that can be picked. Each appears exactly once. */
  skills: readonly Skill[]
  /** Selected skill ids (older free-text entries are shown separately and can be removed). */
  value: readonly string[]
  onChange: (next: string[]) => void
  /**
   * The learner's path: module id to its tier (see defaultsForRoles). A category with a technology in a core
   * or recommended module is shown normally; the others wait in one collapsed "Other technologies
   * (optional)" section. Omit it to show every category normally.
   */
  relevance?: ReadonlyMap<string, Tier>
}

const GRID = "grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"
const STACKS = ["Java", "Node.js", "Python"] as const

const matches = (s: Skill, q: string) =>
  s.title.toLowerCase().includes(q) ||
  s.aliases.some((a) => a.toLowerCase().includes(q))

/**
 * Pick the technologies you already know. One table row per category: the
 * category is the row header and its technologies sit in an equal-width grid,
 * featured ones first, with "Show more" for the rest. A screen reader reads each
 * row as "Frontend, JavaScript, TypeScript, ...". Reused by onboarding and Settings.
 *
 * With `relevance`, the learner sees their own path first. Categories outside it are not hidden or
 * removed: they sit in a collapsed optional section, open to anyone who already knows some of them or
 * wants to explore, and search always looks through everything.
 */
export function SkillPicker({
  skills,
  value,
  onChange,
  relevance,
}: SkillPickerProps) {
  const [query, setQuery] = useState("")
  const [optionalOpen, setOptionalOpen] = useState(false)
  const [expanded, setExpanded] = useState<ReadonlySet<SkillGroup>>(new Set())
  const q = query.trim().toLowerCase()
  const known = useMemo(() => new Set(value), [value])
  const legacy = legacySkills(value)
  const selectedCount =
    skills.filter((s) => known.has(s.id)).length + legacy.length

  function toggle(id: string) {
    onChange(known.has(id) ? value.filter((v) => v !== id) : [...value, id])
  }
  function toggleRow(group: SkillGroup) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  const chip = (s: Skill, optional = false) => (
    <li key={s.id} className="min-w-0">
      <Button
        type="button"
        size="sm"
        variant={known.has(s.id) ? "default" : "outline"}
        aria-pressed={known.has(s.id)}
        onClick={() => toggle(s.id)}
        className="h-auto min-h-8 w-full justify-start py-1.5 text-start whitespace-normal"
      >
        {s.title}
        {optional && (
          <span className="ms-auto ps-1.5 text-[0.625rem] font-normal opacity-70">
            Optional
          </span>
        )}
      </Button>
    </li>
  )

  const pathAware = !!relevance && relevance.size > 0
  const onPath = (s: Skill) => {
    const tier = relevance?.get(s.moduleId)
    return tier === "core" || tier === "recommended"
  }

  const analysed = SKILL_GROUPS.map((group, order) => {
    const all = skills.filter((s) => s.group === group)
    const strength = !pathAware
      ? 0
      : all.some((s) => relevance?.get(s.moduleId) === "core")
        ? 0
        : all.some(onPath)
          ? 1
          : null
    return { group, order, all, strength }
  })

  function buildRow({ group, all, strength }: (typeof analysed)[number]) {
    const found = q ? all.filter((s) => matches(s, q)) : all
    // Inside a category on the learner's path the normal grid holds only what is on the path.
    const lead = pathAware && strength !== null ? found.filter(onPath) : found
    const featured = (() => {
      const f = lead.filter((s) => s.featured)
      return f.length > 0 ? f : lead
    })()
    const rest = found.filter((s) => !featured.includes(s))
    const open = q !== "" || expanded.has(group) || featured.length === 0
    return {
      group,
      total: all.length,
      shown: open ? [...featured, ...rest] : featured,
      hidden: open ? 0 : rest.length,
      found: found.length,
      pathAware: pathAware && strength !== null,
    }
  }

  const mainRows = analysed
    .filter((r) => r.strength !== null)
    .sort((a, b) => a.strength! - b.strength! || a.order - b.order)
    .map(buildRow)
    .filter((r) => r.found > 0)
  const otherAnalysed = analysed.filter((r) => r.strength === null)
  const otherRows = otherAnalysed.map(buildRow).filter((r) => r.found > 0)
  const otherTotal = otherAnalysed.reduce((n, r) => n + r.all.length, 0)
  const otherPicked = otherAnalysed.reduce(
    (n, r) => n + r.all.filter((s) => known.has(s.id)).length,
    0
  )
  // A search that matches something in the optional section opens it.
  const forcedOpen = q !== "" && otherRows.length > 0
  const otherOpen = optionalOpen || forcedOpen
  const showOther =
    otherAnalysed.length > 0 && (q === "" || otherRows.length > 0)

  const renderTable = (rows: typeof mainRows, caption: string) => (
    <table className="w-full border-collapse text-start">
      <caption className="sr-only">{caption}</caption>
      <tbody className="block md:table-row-group">
        {rows.map(({ group, total, shown, hidden, pathAware: lead }) => {
          const picked = skills.filter(
            (s) => s.group === group && known.has(s.id)
          ).length
          return (
            <tr
              key={group}
              className="block border-b border-border py-3 md:table-row md:py-0"
            >
              <th
                scope="row"
                className="block w-full pe-4 pb-2 text-start align-top md:table-cell md:w-56 md:py-3"
              >
                <span className="block text-sm font-medium">
                  {SKILL_GROUP_LABEL[group]}
                </span>
                <span className="block text-xs font-normal text-muted-foreground">
                  {picked} of {total} selected
                </span>
              </th>
              <td className="block align-top md:table-cell md:py-3">
                {/* A row that mixes stacks (Backend) is split under small stack labels once expanded. */}
                {shown.some((s) => s.subgroup) && (hidden === 0 || q !== "") ? (
                  <div className="space-y-3">
                    {STACKS.filter((stack) =>
                      shown.some((s) => s.subgroup === stack)
                    ).map((stack) => (
                      <div
                        key={stack}
                        role="group"
                        aria-label={stack}
                        className="space-y-1.5"
                      >
                        <p className="text-xs font-medium text-muted-foreground">
                          {stack}
                        </p>
                        <ul className={GRID}>
                          {shown
                            .filter((s) => s.subgroup === stack)
                            .map((s) => chip(s, lead && !onPath(s)))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className={GRID}>
                    {shown.map((s) => chip(s, lead && !onPath(s)))}
                  </ul>
                )}
                {(hidden > 0 || (expanded.has(group) && !q)) && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="mt-1 px-0"
                    aria-expanded={expanded.has(group)}
                    onClick={() => toggleRow(group)}
                  >
                    {expanded.has(group) ? "Show fewer" : `Show ${hidden} more`}
                  </Button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Search technologies"
            placeholder="Search technologies"
            className="ps-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p
          role="status"
          aria-live="polite"
          className="text-sm text-muted-foreground"
        >
          {selectedCount} selected
        </p>
      </div>

      {legacy.length > 0 && (
        <section aria-labelledby="legacy-heading" className="space-y-2">
          <h3 id="legacy-heading" className="lr-eyebrow">
            Your earlier entries
          </h3>
          <ul className="flex flex-wrap gap-2">
            {legacy.map((name) => (
              <li key={name}>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onChange(value.filter((v) => v !== name))}
                  aria-label={`Remove ${name}`}
                >
                  {name} <XIcon aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mainRows.length === 0 && !showOther ? (
        <p className="text-sm text-muted-foreground">
          No technology matches "{query}".
        </p>
      ) : (
        mainRows.length > 0 &&
        renderTable(
          mainRows,
          pathAware
            ? "Technologies on your path, by category. Choose the ones you already know."
            : "Technologies by category. Choose the ones you already know."
        )
      )}

      {showOther && (
        <section aria-labelledby="other-skills-heading" className="space-y-3">
          <div className="space-y-1">
            <h3 id="other-skills-heading" className="text-sm font-medium">
              <button
                type="button"
                aria-expanded={otherOpen}
                aria-controls="other-skills"
                disabled={forcedOpen}
                onClick={() => setOptionalOpen((o) => !o)}
                className="-ms-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-md px-1 py-0.5 text-start hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
              >
                <ChevronRightIcon
                  className={cn(
                    "size-4 transition-transform",
                    otherOpen && "rotate-90"
                  )}
                  aria-hidden
                />
                Other technologies (optional)
                <span className="font-normal whitespace-nowrap text-muted-foreground">
                  {otherTotal} technologies
                </span>
                {otherPicked > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal whitespace-nowrap text-primary">
                    {otherPicked} selected
                  </span>
                )}
              </button>
            </h3>
            <p className="ps-6 text-xs text-muted-foreground">
              Not part of your selected path. Open it if you already know some
              of these, or want to explore.
            </p>
          </div>
          <div id="other-skills" hidden={!otherOpen} className="sm:ps-6">
            {otherOpen &&
              renderTable(
                otherRows,
                "Other technologies, by category. Choose the ones you already know."
              )}
          </div>
        </section>
      )}
    </div>
  )
}
