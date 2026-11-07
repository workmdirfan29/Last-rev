import { ALLOWED_SOURCES } from "@/data/questions/source-allowlist"

/**
 * Where a research source may point, by evidence type. Official documentation uses the same allowlist as
 * questions and lessons. Job-market and reported-experience sources are listed HERE, one line each, by whoever
 * verified the publisher: adding a host is a decision to trust that publisher, so each carries a note.
 * `host` matches the hostname or any subdomain. Edit this file; it is data, not code.
 */
export interface ResearchHost {
  host: string
  note: string
}

/** Publishers of job-market reports and surveys. */
export const MARKET_HOSTS: readonly ResearchHost[] = [
  {
    host: "survey.stackoverflow.co",
    note: "Stack Overflow Developer Survey. Self-reported usage by the people who answered it, not job openings. Checked by fetching the 2026 results.",
  },
]

/** Places where repeated first-hand experiences are published. */
export const EXPERIENCE_HOSTS: readonly ResearchHost[] = []

export const OFFICIAL_HOSTS: readonly ResearchHost[] = ALLOWED_SOURCES.map(
  (s) => ({ host: s.host, note: s.note })
)

export interface HostLists {
  official: readonly ResearchHost[]
  market: readonly ResearchHost[]
  experience: readonly ResearchHost[]
}
export const DEFAULT_HOSTS: HostLists = {
  official: OFFICIAL_HOSTS,
  market: MARKET_HOSTS,
  experience: EXPERIENCE_HOSTS,
}

const matches = (hosts: readonly ResearchHost[], hostname: string) =>
  hosts.some((h) => hostname === h.host || hostname.endsWith(`.${h.host}`))

/** The hosts an evidence type's sources may use. */
export function hostAllowed(
  type: "official-documentation" | "reported-experiences" | "job-market-trend",
  url: string,
  lists: HostLists = DEFAULT_HOSTS
): boolean {
  let host: string
  try {
    const u = new URL(url)
    if (u.protocol !== "https:") return false
    host = u.hostname.toLowerCase()
  } catch {
    return false
  }
  if (type === "official-documentation") return matches(lists.official, host)
  if (type === "job-market-trend") return matches(lists.market, host)
  return matches(lists.experience, host)
}
