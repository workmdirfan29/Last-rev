import { useMemo, useState } from "react"
import { Link } from "react-router"
import { format, parseISO } from "date-fns"
import { ExternalLinkIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RESEARCH_AREAS, researchAreaLabel } from "@/data/research/areas"
import { RESEARCH } from "@/data/research"
import {
  NO_FILTERS,
  buildBibliography,
  filterResearch,
  type ResearchFilters,
} from "@/services/research/bibliography"
import {
  EVIDENCE_LABEL,
  EVIDENCE_TYPES,
  HORIZONS,
  RESEARCH_LEVELS,
  type ResearchEntry,
} from "@/types/research"
import { PredictionLabel } from "./prediction-label"

const day = (k: string) => format(parseISO(k), "d MMM yyyy")
const LEVEL_LABEL: Record<string, string> = {
  fresher: "Fresher",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all: "All levels",
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block h-9 max-w-full rounded-lg border border-input bg-background px-2 text-sm"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function EntryCard({ e }: { e: ResearchEntry }) {
  return (
    <li>
      <article
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        aria-label={e.topic}
        data-testid="research-entry"
      >
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {e.predicted && <PredictionLabel />}
            <Badge variant="outline">{EVIDENCE_LABEL[e.evidence.type]}</Badge>
            <span className="text-xs text-muted-foreground">
              {researchAreaLabel(e.area)} · {LEVEL_LABEL[e.level]} · about{" "}
              {e.horizon}
            </span>
          </div>
          <h2 className="font-heading text-base font-semibold">{e.topic}</h2>
        </header>
        <p className="text-sm">{e.claim}</p>
        {e.evidence.basis && (
          <p className="rounded-lg bg-secondary/40 p-2.5 text-xs">
            <span className="font-medium">Why this is suggested: </span>
            {e.evidence.basis} This is a forecast, not a finding.
          </p>
        )}
        {e.evidence.sources.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground">
              {e.predicted ? "Informed by" : "Evidence"}
            </h3>
            <ul className="space-y-1 text-sm">
              {e.evidence.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-wrap items-center gap-1 text-brand-ink underline underline-offset-4"
                  >
                    {s.title}{" "}
                    <ExternalLinkIcon className="size-3.5" aria-hidden />
                  </a>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    {s.publisher}
                    {s.publishedOn ? `, published ${s.publishedOn}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Researched {day(e.researchedOn)} · confidence: {e.confidence}
        </p>
      </article>
    </li>
  )
}

/** The research dataset: claims with their evidence, sources and dates. Predictions are labelled everywhere. */
export function ResearchPage() {
  const [filters, setFilters] = useState<ResearchFilters>(NO_FILTERS)
  const set = (k: keyof ResearchFilters) => (v: string) =>
    setFilters((f) => ({ ...f, [k]: v }))
  const shown = useMemo(() => filterResearch(RESEARCH, filters), [filters])
  const bibliography = useMemo(() => buildBibliography(RESEARCH), [])
  const predictions = RESEARCH.filter((e) => e.predicted).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research"
        title="What the evidence says"
        description="Claims about what to study and why, each with its source, the date it was researched and how sure we are. Predictions are forecasts and are always marked."
      />

      <section
        aria-labelledby="how-made"
        className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm"
      >
        <h2 id="how-made" className="font-medium">
          How this was made, and its limits
        </h2>
        <ul className="list-disc space-y-1 ps-5 text-xs/relaxed text-muted-foreground">
          <li>
            Entries are written by hand. The author reads each source on the
            date shown and records what it says.
          </li>
          <li>
            Each entry has one of four kinds of evidence: official
            documentation, repeatedly reported experiences, a job-market trend,
            or an informed preparation recommendation, which is a prediction.
          </li>
          <li>
            A prediction about 2027 can never be shown as observed. It carries a
            "Prediction, not verified" label and never has high confidence.
          </li>
          <li>
            Numbers that look like statistics appear only where a cited source
            carries them. There is no data here on how often any interview
            question is asked.
          </li>
          <li>
            No entry is about one company&apos;s interview. Confidence is the
            author&apos;s judgement of the sources, not a measurement.
          </li>
          <li>
            See also{" "}
            <Link className="underline underline-offset-4" to="/how-we-decide">
              how we decide what to study
            </Link>
            .
          </li>
        </ul>
      </section>

      {RESEARCH.length === 0 ? (
        <EmptyState
          title="No research entries yet"
          description="Entries are added only from sources that have been read and checked. Until then, this page stays empty rather than showing placeholders."
        />
      ) : (
        <Tabs defaultValue="entries">
          <TabsList>
            <TabsTrigger value="entries">
              Entries ({RESEARCH.length})
            </TabsTrigger>
            <TabsTrigger value="bibliography">
              Bibliography ({bibliography.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4 pt-4">
            <div className="flex flex-wrap gap-4">
              <Select
                id="r-area"
                label="Area"
                value={filters.area}
                onChange={set("area")}
                options={RESEARCH_AREAS.filter((a) =>
                  RESEARCH.some((e) => e.area === a.id)
                ).map((a) => ({ value: a.id, label: a.label }))}
              />
              <Select
                id="r-level"
                label="Level"
                value={filters.level}
                onChange={set("level")}
                options={RESEARCH_LEVELS.filter((l) => l !== "all").map(
                  (l) => ({ value: l, label: LEVEL_LABEL[l] })
                )}
              />
              <Select
                id="r-type"
                label="Kind of evidence"
                value={filters.type}
                onChange={set("type")}
                options={EVIDENCE_TYPES.map((t) => ({
                  value: t,
                  label: EVIDENCE_LABEL[t],
                }))}
              />
              <Select
                id="r-horizon"
                label="Year"
                value={filters.horizon}
                onChange={set("horizon")}
                options={HORIZONS.map((h) => ({
                  value: String(h),
                  label: String(h),
                }))}
              />
            </div>
            <p
              className="text-xs text-muted-foreground"
              aria-live="polite"
              data-testid="research-count"
            >
              Showing {shown.length} of {RESEARCH.length}
              {predictions > 0
                ? ` · ${predictions} ${predictions === 1 ? "is a prediction" : "are predictions"}`
                : ""}
            </p>
            {shown.length === 0 ? (
              <EmptyState title="No entries match these filters" />
            ) : (
              <ul className="space-y-4" aria-label="Research entries">
                {shown.map((e) => (
                  <EntryCard key={e.id} e={e} />
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="bibliography" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              Every source the entries cite, once each, with how many entries
              use it.
            </p>
            {bibliography.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No entry cites a source yet.
              </p>
            ) : (
              <ul
                className="divide-y divide-border rounded-xl border border-border bg-card"
                aria-label="Bibliography"
                data-testid="bibliography"
              >
                {bibliography.map((b) => (
                  <li key={b.url} className="space-y-1 p-3 text-sm">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-ink underline underline-offset-4"
                    >
                      {b.title}{" "}
                      <ExternalLinkIcon className="size-3.5" aria-hidden />
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {b.publisher}
                      {b.publishedOn ? `, published ${b.publishedOn}` : ""} ·
                      cited by {b.entryIds.length}{" "}
                      {b.entryIds.length === 1 ? "entry" : "entries"}
                    </p>
                    {b.onlyPredictions && <PredictionLabel />}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">
              Links are checked by hand with a script before entries are
              released; a link can still change later.
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
