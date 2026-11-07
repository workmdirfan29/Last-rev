import type {
  EvidenceType,
  ResearchEntry,
  ResearchSource,
} from "@/types/research"

export const PREDICTION_LABEL = "Prediction, not verified"

export interface BibliographyItem {
  url: string
  title: string
  publisher: string
  publishedOn?: string
  /** Entries that cite it. */
  entryIds: string[]
  types: EvidenceType[]
  /** Every entry that cites it is a prediction (the source informed a forecast; it is not evidence of one). */
  onlyPredictions: boolean
}

/** The same page written two ways is one source: host in lower case, no fragment, no trailing slash. */
export function normaliseUrl(url: string): string {
  try {
    const u = new URL(url)
    u.hash = ""
    u.hostname = u.hostname.toLowerCase()
    return u.toString().replace(/\/$/, "")
  } catch {
    return url
  }
}

/** The unique sources of a set of entries, with how many entries cite each. */
export function buildBibliography(
  entries: readonly ResearchEntry[]
): BibliographyItem[] {
  const map = new Map<string, BibliographyItem>()
  for (const e of entries)
    for (const s of e.evidence.sources as ResearchSource[]) {
      const key = normaliseUrl(s.url)
      const prev = map.get(key)
      if (prev) {
        prev.entryIds.push(e.id)
        if (!prev.types.includes(e.evidence.type))
          prev.types.push(e.evidence.type)
        prev.onlyPredictions &&= e.predicted
        prev.publishedOn ??= s.publishedOn
      } else
        map.set(key, {
          url: s.url,
          title: s.title,
          publisher: s.publisher,
          publishedOn: s.publishedOn,
          entryIds: [e.id],
          types: [e.evidence.type],
          onlyPredictions: e.predicted,
        })
    }
  return [...map.values()].sort(
    (a, b) =>
      a.publisher.localeCompare(b.publisher) || a.title.localeCompare(b.title)
  )
}

export interface ResearchFilters {
  area: string
  level: string
  type: string
  horizon: string
}
export const NO_FILTERS: ResearchFilters = {
  area: "all",
  level: "all",
  type: "all",
  horizon: "all",
}

export function filterResearch(
  entries: readonly ResearchEntry[],
  f: ResearchFilters
): ResearchEntry[] {
  return entries.filter(
    (e) =>
      (f.area === "all" || e.area === f.area) &&
      (f.level === "all" || e.level === f.level || e.level === "all") &&
      (f.type === "all" || e.evidence.type === f.type) &&
      (f.horizon === "all" || String(e.horizon) === f.horizon)
  )
}
