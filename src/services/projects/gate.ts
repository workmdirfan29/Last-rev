import { LESSON_DENIED_NAMES } from "@/data/lessons/denylist"
import { PHASES } from "@/data/catalog/phases"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import {
  findDeniedName,
  findFrequencyClaim,
  findStatisticClaim,
  isAllowedSource,
} from "@/services/content/quality"
import { PROJECT_HOURS, acceptanceItems, type Project } from "@/types/project"

export type Problem = string

export interface ProjectGateContext {
  lessonIds: ReadonlySet<string>
}

/** Every piece of prose a learner reads in a project. */
export function projectText(p: Project): string {
  return [
    p.title,
    p.summary,
    ...p.userStories,
    ...p.requirements,
    ...p.structure,
    ...p.steps.flatMap((s) => [s.title, s.summary, ...s.acceptance]),
    ...p.stretch,
    ...p.resources.map((r) => r.label),
  ].join("\n")
}

/**
 * The project gate: a project is complete and consistent, points at real roadmaps, phases and lessons, uses
 * official documentation only, and makes no invented claims. `fileKey` is the file name without `.ts`.
 */
export function validateProjects(
  projects: readonly { fileKey: string; project: Project }[],
  ctx: ProjectGateContext
): Problem[] {
  const problems: Problem[] = []
  const ids = new Set<string>()
  const titles = new Set<string>()
  for (const { fileKey, project: p } of projects) {
    const add = (m: string) => problems.push(`${p.id}: ${m}`)
    if (fileKey !== p.id)
      add(`the file is named ${fileKey}.ts, it must be ${p.id}.ts`)
    if (ids.has(p.id)) add("duplicate id")
    ids.add(p.id)
    const t = p.title.trim().toLowerCase()
    if (titles.has(t)) add("duplicate title")
    titles.add(t)

    const range = PROJECT_HOURS[p.kind]
    if (p.hours < range.min || p.hours > range.max)
      add(
        `a ${p.kind} project is ${range.min}-${range.max} hours, this says ${p.hours}`
      )

    for (const r of p.roadmaps) {
      if (!ROADMAPS.some((x) => x.id === r.roadmapId))
        add(`unknown roadmap ${r.roadmapId}`)
      else if (
        !PHASES.some((x) => x.roadmapId === r.roadmapId && x.number === r.phase)
      )
        add(`${r.roadmapId} has no phase ${r.phase}`)
    }
    if (
      new Set(p.roadmaps.map((r) => `${r.roadmapId}.${r.phase}`)).size !==
      p.roadmaps.length
    )
      add("the same roadmap phase is listed twice")

    for (const l of p.buildsOn)
      if (!ctx.lessonIds.has(l)) add(`buildsOn ${l} is not a lesson`)
    if (new Set(p.buildsOn).size !== p.buildsOn.length)
      add("buildsOn repeats a lesson")
    p.steps.forEach((s, i) => {
      for (const l of s.afterLessons)
        if (!ctx.lessonIds.has(l))
          add(`step ${i + 1}: afterLessons ${l} is not a lesson`)
    })
    if (acceptanceItems(p).length > 30)
      add("more than 30 acceptance items in all")
    const accept = acceptanceItems(p).map((a) => a.text.trim().toLowerCase())
    if (new Set(accept).size !== accept.length)
      add("two acceptance items say the same thing")
    const stepTitles = p.steps.map((s) => s.title.trim().toLowerCase())
    if (new Set(stepTitles).size !== stepTitles.length)
      add("two steps share a title")

    for (const r of p.resources)
      if (!isAllowedSource(r.url))
        add(`resource ${r.url} is not on the official-source allowlist`)

    const text = projectText(p)
    const freq = findFrequencyClaim(text)
    if (freq) add(`frequency claim: "${freq}"`)
    const stat = findStatisticClaim(text)
    if (stat) add(`statistic claim: "${stat}"`)
    const name = findDeniedName(text, LESSON_DENIED_NAMES)
    if (name) add(`names a company or brand: "${name}"`)
  }
  return problems
}
