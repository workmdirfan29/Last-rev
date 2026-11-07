import { useMemo, useState } from "react"
import { Link } from "react-router"
import { InterviewEnglishLink } from "@/features/english/interview-english-link"
import { ChevronRightIcon, LockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { RoleIcon } from "@/components/shared/role-icon"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { isResumeModuleId } from "@/types/learner"
import { MODULES, getModule } from "@/data/catalog/modules"
import { ROLES, getRole } from "@/data/catalog/roles"
import {
  defaultsForRoles,
  orderedModuleIds,
  TIER_LABEL,
} from "@/services/curriculum/relevance"
import { useModuleCounts, useOwnQuestionEntries } from "@/hooks/use-content"
import { cn } from "@/lib/utils"
import { useLearnerStore } from "@/stores/learner-store"
import type { CatalogModule } from "@/data/catalog/module-types"
import { HR_RELEASE_MIN_QUESTIONS } from "@/data/catalog/module-types"
import { HR_AUDIENCE_NOTE } from "@/data/catalog/modules/hr"
import { SKILL_AREA_LABEL, SKILL_AREAS, isHrModuleId } from "@/types/content"

/** Modules grouped by skill area, in the order given. */
function groupByArea(ids: string[]) {
  const mods = ids
    .map((id) => getModule(id))
    .filter((m): m is CatalogModule => !!m)
  return SKILL_AREAS.map((area) => ({
    area,
    mods: mods.filter((m) => m.skillArea === area),
  })).filter((g) => g.mods.length)
}

export function InterviewHomePage() {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const own = useOwnQuestionEntries()
  const { counts, mine, index } = useModuleCounts()
  const [roleId, setRoleId] = useState(
    profile?.primaryRole ?? profile?.selectedRoles[0] ?? ROLES[0].id
  )
  const role = getRole(roleId) ?? ROLES[0]
  const [exploreOpen, setExploreOpen] = useState(false)

  const completedByModule = useMemo(() => {
    const map = new Map<string, number>()
    for (const q of index ?? [])
      if (progress[q.id]?.completed && !progress[q.id]?.removed)
        map.set(q.moduleId, (map.get(q.moduleId) ?? 0) + 1)
    for (const c of own)
      if (progress[c.id]?.completed && !progress[c.id]?.removed)
        map.set(c.moduleId, (map.get(c.moduleId) ?? 0) + 1)
    return map
  }, [index, progress, own])

  // The path leads: its core and recommended modules. Everything else (the path's optional tier and the rest
  // of the catalogue) waits in a collapsed "Explore other topics" section, labelled Optional.
  const tiers = useMemo(() => defaultsForRoles([role.id]), [role.id])
  const moduleIds = useMemo(
    () => orderedModuleIds(tiers).filter((id) => tiers.get(id) !== "optional"),
    [tiers]
  )
  const exploreIds = useMemo(() => {
    const lead = new Set(moduleIds)
    return [
      ...orderedModuleIds(tiers).filter((id) => !lead.has(id)),
      ...MODULES.map((m) => m.id).filter(
        (id) => !tiers.has(id) && !isResumeModuleId(id)
      ),
    ]
  }, [moduleIds, tiers])
  const grouped = useMemo(() => groupByArea(moduleIds), [moduleIds])
  const exploreGrouped = useMemo(
    () => (exploreOpen ? groupByArea(exploreIds) : []),
    [exploreIds, exploreOpen]
  )

  if (!counts) return <ScreenLoader />
  const available = moduleIds.filter(
    (id) => (counts.get(id)?.total ?? 0) + (mine.get(id) ?? 0) > 0
  ).length

  const renderGroups = (
    groups: typeof grouped,
    { explore }: { explore: boolean }
  ) => (
    <>
      {groups.map(({ area, mods }) => (
        <section
          key={`${explore ? "x" : "m"}-${area}`}
          className="space-y-3"
          aria-labelledby={`${explore ? "explore-" : ""}area-${area}`}
        >
          <h2
            id={`${explore ? "explore-" : ""}area-${area}`}
            className="lr-eyebrow"
          >
            {SKILL_AREA_LABEL[area]}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {mods.map((m) => {
              const c = counts.get(m.id)
              const curated = c?.total ?? 0
              const own = mine.get(m.id) ?? 0
              // Curated and own questions are counted separately, but either makes the module usable.
              const total = curated + own
              const done = completedByModule.get(m.id) ?? 0
              const body = (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium">{m.title}</h3>
                    {total > 0 && (explore || tiers.get(m.id)) && (
                      <Badge variant="secondary" className="shrink-0">
                        {explore ? "Optional" : TIER_LABEL[tiers.get(m.id)!]}
                      </Badge>
                    )}
                    {total === 0 && (
                      <Badge variant="outline" className="shrink-0">
                        <LockIcon aria-hidden /> In preparation
                      </Badge>
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs/relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  {HR_AUDIENCE_NOTE[m.id] && (
                    <p className="text-xs font-medium">
                      {HR_AUDIENCE_NOTE[m.id]}
                    </p>
                  )}
                  {total > 0 ? (
                    <div className="mt-auto space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {curated > 0
                            ? isHrModuleId(m.id)
                              ? curated < HR_RELEASE_MIN_QUESTIONS
                                ? `${curated} of ${HR_RELEASE_MIN_QUESTIONS} ready`
                                : `${curated} questions ready`
                              : `${c!.fresher} of 25 fresher questions ready${c!.intermediate + c!.advanced > 0 ? ` · ${c!.intermediate} intermediate · ${c!.advanced} advanced` : ""}`
                            : "No curated questions yet"}
                          {own > 0 ? ` + ${own} yours` : ""}
                        </span>
                        <span className="tabular-nums">
                          {done}/{total}
                        </span>
                      </div>
                      <Progress
                        value={(done / total) * 100}
                        aria-label={`${m.title} progress`}
                      />
                    </div>
                  ) : (
                    <p className="mt-auto pt-1 text-xs text-muted-foreground">
                      ~{m.estimatedStudyHours} h study
                    </p>
                  )}
                </>
              )
              return (
                <li key={m.id}>
                  {total > 0 ? (
                    <Link
                      to={`/interview/${role.id}/${m.id}`}
                      className="flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      className="flex h-full flex-col gap-2 rounded-xl border border-dashed border-border p-4 opacity-70"
                      aria-disabled="true"
                    >
                      {body}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview Zone"
        title="Common interview questions"
        description={
          <>
            Pick a path, then a module. Questions are chosen by our editors and
            ordered by importance; we have no data on how often any question is
            asked. Each one has a speakable quick answer and a deep explanation.{" "}
            <Link className="underline underline-offset-4" to="/how-we-decide">
              How we decide what to study
            </Link>
          </>
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/interview/manage">Manage my prep</Link>
            </Button>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger aria-label="Career path" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <RoleIcon name={role.icon} className="size-[18px]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{role.title}</p>
          <p className="text-xs text-muted-foreground">
            {available} of {moduleIds.length} modules have questions so far. The
            rest are being written — they're shown below but locked until
            they're ready.
          </p>
        </div>
      </div>

      <Link
        to="/hr"
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span>
          <span className="block text-sm font-medium">HR interview</span>
          <span className="block text-xs text-muted-foreground">
            Twenty categories of HR questions, a STAR answer builder and your
            saved answers.
          </span>
        </span>
        <span className="text-xs font-medium">Open HR interview</span>
      </Link>

      <Link
        to="/mock"
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span>
          <span className="block text-sm font-medium">Mock interview</span>
          <span className="block text-xs text-muted-foreground">
            Answer against a timer, then rate your own answers against the model
            answers.
          </span>
        </span>
        <span className="text-xs font-medium">Open mock interview</span>
      </Link>

      <Link
        to="/resume"
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span>
          <span className="block text-sm font-medium">Resume interview</span>
          <span className="block text-xs text-muted-foreground">
            Questions about your own resume, made with templates. Your resume
            stays in this browser.
          </span>
        </span>
        <span className="text-xs font-medium">Open resume interview</span>
      </Link>

      <InterviewEnglishLink />

      {renderGroups(grouped, { explore: false })}

      <section aria-labelledby="explore-heading" className="space-y-3">
        <div className="space-y-1">
          <h2 id="explore-heading" className="text-sm font-medium">
            <button
              type="button"
              aria-expanded={exploreOpen}
              aria-controls="explore-topics"
              onClick={() => setExploreOpen((o) => !o)}
              className="-ms-1 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-start hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
            >
              <ChevronRightIcon
                className={cn(
                  "size-4 transition-transform",
                  exploreOpen && "rotate-90"
                )}
                aria-hidden
              />
              Explore other topics (optional)
              <span className="font-normal text-muted-foreground">
                {exploreIds.length} modules
              </span>
            </button>
          </h2>
          <p className="ps-6 text-xs text-muted-foreground">
            Not part of {role.title}. Open it if you want to look further.
          </p>
        </div>
        <div id="explore-topics" hidden={!exploreOpen} className="space-y-6">
          {exploreOpen && renderGroups(exploreGrouped, { explore: true })}
        </div>
      </section>
    </div>
  )
}
