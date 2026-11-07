import { LESSON_DENIED_NAMES } from "@/data/lessons/denylist"
import { RESEARCH_AREA_BY_ID } from "@/data/research/areas"
import {
  DEFAULT_HOSTS,
  hostAllowed,
  type HostLists,
} from "@/data/research/hosts"
import {
  findDeniedName,
  findFrequencyClaim,
  findStatisticClaim,
} from "@/services/content/quality"
import type { ResearchEntry } from "@/types/research"

export type Problem = string

/**
 * Numbers that read as statistics: a percentage, "N out of M", "N in M", a share word, or a counted population.
 * They are allowed only where a cited source can carry them (see `statisticsAllowed`).
 */
const NUMBER_CLAIMS: readonly RegExp[] = [
  /\b\d+(?:[.,]\d+)?\s?%/,
  /\b\d+(?:[.,]\d+)?\s?(?:per ?cent|percent)\b/i,
  /\b\d+\s+(?:out of|in every|in)\s+\d+\b/i,
  /\b(?:majority|minority|half|most|nearly all|almost all|a third|two thirds|a quarter)\s+of\b/i,
  /\b\d[\d,.]*\s?(?:k|m|million|billion|thousand|lakh|lakhs|crore|crores)?\s+(?:developers|respondents|engineers|jobs|job postings|postings|vacancies|companies|employers|candidates|hires|people|openings|roles)\b/i,
]

/** The first statistic-like number or phrase in the text, or null. */
export function findNumberClaim(text: string): string | null {
  for (const re of NUMBER_CLAIMS) {
    const m = re.exec(text)
    if (m) return m[0]
  }
  return null
}

/** Statistics may appear only in these types, and only with a cited source that has a URL. */
export const statisticsAllowed = (e: ResearchEntry): boolean =>
  (e.evidence.type === "job-market-trend" ||
    e.evidence.type === "official-documentation") &&
  e.evidence.sources.some((s) => s.url.startsWith("https://"))

const textOf = (e: ResearchEntry) =>
  [e.topic, e.claim, e.evidence.basis ?? ""].join("\n")

const MIN_DATE = "2024-01-01"
const MAX_DATE = "2027-12-31"

/**
 * The research gate: form, hosts, numbers, brands and dates. It cannot tell whether a claim is true: every entry
 * shows its sources and dates so a reader can check, and the author verifies each source by reading it.
 * `fileKey` is the file name without `.ts`, which must be the entry's area.
 */
export function validateResearch(
  entries: readonly { fileKey: string; entry: ResearchEntry }[],
  hosts: HostLists = DEFAULT_HOSTS
): Problem[] {
  const problems: Problem[] = []
  const ids = new Set<string>()
  const claims = new Set<string>()
  for (const { fileKey, entry: e } of entries) {
    const add = (m: string) => problems.push(`${e.id}: ${m}`)
    if (ids.has(e.id)) add("duplicate id")
    ids.add(e.id)
    const key = `${e.topic}|${e.claim}`.toLowerCase().replace(/\s+/g, " ")
    if (claims.has(key)) add("the same topic and claim appear twice")
    claims.add(key)

    if (!RESEARCH_AREA_BY_ID.has(e.area)) add(`unknown area "${e.area}"`)
    else if (fileKey !== e.area)
      add(`this entry's area is ${e.area} but it is in ${fileKey}.ts`)

    if (e.researchedOn < MIN_DATE || e.researchedOn > MAX_DATE)
      add(
        `researchedOn ${e.researchedOn} is outside ${MIN_DATE} to ${MAX_DATE}`
      )
    for (const s of e.evidence.sources) {
      const year = Number(s.publishedOn?.slice(0, 4) ?? "2000")
      if (year < 1990 || year > 2027)
        add(`source "${s.title}" has an implausible date ${s.publishedOn}`)
    }

    // hosts: each source must be on the list for the entry's evidence type
    for (const s of e.evidence.sources) {
      const type = e.evidence.type
      // a forecast may be informed by any kind of source; every other type has its own list
      const ok =
        type === "preparation-recommendation"
          ? hostAllowed("official-documentation", s.url, hosts) ||
            hostAllowed("job-market-trend", s.url, hosts) ||
            hostAllowed("reported-experiences", s.url, hosts)
          : hostAllowed(type, s.url, hosts)
      if (!ok)
        add(
          `source ${s.url} is not on the host list for ${type} (data/research/hosts.ts)`
        )
    }
    if (
      new Set(e.evidence.sources.map((s) => s.url)).size !==
      e.evidence.sources.length
    )
      add("the same source is listed twice")

    const text = textOf(e)
    // numbers that read as statistics
    if (!statisticsAllowed(e)) {
      const n = findNumberClaim(text)
      if (n)
        add(
          `a statistic ("${n}") needs a job-market-trend or official-documentation entry with a source URL`
        )
      const st = findStatisticClaim(text)
      if (st)
        add(
          `a statistic claim ("${st}") needs a job-market-trend or official-documentation entry with a source URL`
        )
    }
    const freq = findFrequencyClaim(text)
    if (freq) add(`frequency claim: "${freq}"`)
    const name = findDeniedName(text, LESSON_DENIED_NAMES)
    if (name)
      add(
        `names a company or brand: "${name}" (no company-specific interview content)`
      )
  }
  return problems
}
