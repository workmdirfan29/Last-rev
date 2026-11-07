import { z } from "zod"

/**
 * Research dataset: claims about what to study and why, each with its evidence. Authored in
 * `src/data/research/<area>.ts` through `defineResearch`; the gate (`services/research/gate.ts`, run by
 * `data/research/content-gate.test.ts`) checks the rules a machine can check.
 *
 * The four evidence types are the only ones allowed, and a prediction can never be typed as observed.
 */

export const EVIDENCE_TYPES = [
  "official-documentation",
  "reported-experiences",
  "job-market-trend",
  "preparation-recommendation",
] as const
export type EvidenceType = (typeof EVIDENCE_TYPES)[number]

/** What each type is called on screen. */
export const EVIDENCE_LABEL: Record<EvidenceType, string> = {
  "official-documentation": "Official documentation",
  "reported-experiences": "Repeatedly reported experiences",
  "job-market-trend": "Job-market trend",
  "preparation-recommendation":
    "Informed preparation recommendation (a prediction)",
}

export const CONFIDENCE = ["high", "medium", "low"] as const
export const HORIZONS = [2026, 2027] as const
export const RESEARCH_LEVELS = [
  "fresher",
  "intermediate",
  "advanced",
  "all",
] as const

const text = z.string().trim().min(1)
/** yyyy-MM-dd */
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use yyyy-MM-dd")
/** A publication date is a full date or just a year, as the source gives it. */
const published = z.union([
  day,
  z.string().regex(/^\d{4}$/, "use yyyy-MM-dd or yyyy"),
])

export const researchSourceSchema = z.object({
  title: text.max(200),
  publisher: text.max(120),
  url: z
    .url()
    .refine((u) => u.startsWith("https://"), { message: "https only" }),
  /** When the source was published, if it says. */
  publishedOn: published.optional(),
})
export type ResearchSource = z.infer<typeof researchSourceSchema>

export const researchEntrySchema = z
  .object({
    /** lowercase-hyphen, unique; also the file-level key. */
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    topic: text.max(120),
    /** A readiness category id (see data/readiness/categories.ts). */
    area: text.max(40),
    level: z.enum(RESEARCH_LEVELS),
    /** The claim in plain words. No company-specific interview questions; no statistic unless the evidence type allows and the source carries it. */
    claim: text.max(400),
    evidence: z.object({
      type: z.enum(EVIDENCE_TYPES),
      sources: z.array(researchSourceSchema).max(6),
      /**
       * Why this is recommended, for a preparation recommendation (which has no source to cite). Plain words about
       * the reasoning; it is never presented as a finding.
       */
      basis: text.max(400).optional(),
    }),
    /** When the entry was researched (yyyy-MM-dd). */
    researchedOn: day,
    confidence: z.enum(CONFIDENCE),
    /** The year the claim is about. */
    horizon: z.union([z.literal(2026), z.literal(2027)]),
    /** True for a prediction. Always true for a preparation recommendation and for every 2027 entry. */
    predicted: z.boolean(),
  })
  .superRefine((e, ctx) => {
    const bad = (path: string[], message: string) =>
      ctx.addIssue({ code: "custom", path, message })
    const type = e.evidence.type
    // a prediction is never typed as observed, and an observation is never labelled a prediction
    if (e.predicted && type !== "preparation-recommendation")
      bad(
        ["predicted"],
        "a prediction must be typed as a preparation recommendation"
      )
    if (!e.predicted && type === "preparation-recommendation")
      bad(
        ["predicted"],
        "a preparation recommendation is a prediction: set predicted to true"
      )
    if (e.horizon === 2027 && !e.predicted)
      bad(["horizon"], "a 2027 entry can only be a prediction")
    if (e.predicted && e.confidence === "high")
      bad(["confidence"], "a prediction cannot have high confidence")
    // evidence needed by each type
    if (type === "preparation-recommendation") {
      if (!e.evidence.basis)
        bad(
          ["evidence", "basis"],
          "a recommendation needs its basis in plain words"
        )
    } else {
      const need = type === "reported-experiences" ? 2 : 1
      if (e.evidence.sources.length < need)
        bad(
          ["evidence", "sources"],
          `${type} needs at least ${need} source${need > 1 ? "s" : ""} with a URL`
        )
      if (e.evidence.basis)
        bad(
          ["evidence", "basis"],
          "basis is only for a preparation recommendation"
        )
    }
    // sources cannot postdate the research
    for (const [i, s] of e.evidence.sources.entries())
      if (
        s.publishedOn &&
        s.publishedOn.slice(0, 4) > e.researchedOn.slice(0, 4)
      )
        bad(
          ["evidence", "sources", String(i), "publishedOn"],
          "a source cannot be published after it was researched"
        )
  })
export type AuthoredResearchEntry = z.input<typeof researchEntrySchema>
export type ResearchEntry = z.infer<typeof researchEntrySchema>
