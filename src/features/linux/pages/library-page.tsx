import { useMemo } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { SearchIcon, SearchXIcon, TerminalSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "@/components/shared/empty-state"
import { LINUX_COMMANDS } from "@/data/linux/commands"
import {
  LINUX_CATEGORIES,
  LINUX_CATEGORY_LABEL,
  type LinuxCategory,
} from "@/data/linux/schema"
import { cn } from "@/lib/utils"
import { useLearnerStore } from "@/stores/learner-store"
import { CommandActions } from "../components/command-actions"
import { CopyButton } from "../components/copy-button"
import { SupportBadge } from "../components/support-badge"
import { useLinux } from "../linux-context"
import {
  categoryCounts,
  filterCommands,
  REFERENCE_ROWS,
  type LibraryFilters,
} from "../library"

const isCategory = (v: string | null): v is LinuxCategory =>
  !!v && (LINUX_CATEGORIES as readonly string[]).includes(v)

export function LibraryPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { sendToTerminal } = useLinux()
  const progress = useLearnerStore((s) => s.progress)

  const rawCategory = params.get("cat")
  const filters: LibraryFilters = {
    query: params.get("q") ?? "",
    category: isCategory(rawCategory) ? rawCategory : "all",
    savedOnly: params.get("saved") === "1",
  }

  function update(patch: Partial<LibraryFilters>) {
    const next = { ...filters, ...patch }
    const out = new URLSearchParams()
    if (next.query) out.set("q", next.query)
    if (next.category !== "all") out.set("cat", next.category)
    if (next.savedOnly) out.set("saved", "1")
    setParams(out, { replace: true })
  }

  const visible = useMemo(
    () =>
      filterCommands(
        LINUX_COMMANDS,
        filters,
        (id) => progress[id]?.bookmarked ?? false
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.query, filters.category, filters.savedOnly, progress]
  )
  const counts = useMemo(() => categoryCounts(LINUX_COMMANDS), [])
  const learned = LINUX_COMMANDS.filter((c) => progress[c.id]?.completed).length
  const savedCount = LINUX_COMMANDS.filter(
    (c) => progress[c.id]?.bookmarked
  ).length
  const filtering =
    filters.query !== "" || filters.category !== "all" || filters.savedOnly

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {learned} of {LINUX_COMMANDS.length} commands marked learned
          </span>
          <span>from a {REFERENCE_ROWS}-row reference</span>
        </div>
        <Progress
          value={(learned / LINUX_COMMANDS.length) * 100}
          aria-label="Commands learned"
        />
      </div>

      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label="Search commands"
          placeholder="Search a command, its purpose or an example (try grep, mkdir, kill)"
          className="ps-9"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
        />
      </div>

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <FilterChip
          pressed={filters.category === "all"}
          onClick={() => update({ category: "all" })}
        >
          All ({LINUX_COMMANDS.length})
        </FilterChip>
        {counts.map(({ id, count }) => (
          <FilterChip
            key={id}
            pressed={filters.category === id}
            onClick={() => update({ category: id })}
          >
            {LINUX_CATEGORY_LABEL[id]} ({count})
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant={filters.savedOnly ? "secondary" : "outline"}
          aria-pressed={filters.savedOnly}
          onClick={() => update({ savedOnly: !filters.savedOnly })}
        >
          Saved commands ({savedCount})
        </Button>
        <p className="text-xs text-muted-foreground" role="status">
          Showing {visible.length} of {LINUX_COMMANDS.length}
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title={
            filters.savedOnly && !filters.query && filters.category === "all"
              ? "No saved commands yet"
              : "No commands match these filters"
          }
          description={
            filters.savedOnly
              ? "Use Save on any command card and it appears here."
              : "Try a shorter search or another category."
          }
          action={
            filtering && (
              <Button
                variant="outline"
                onClick={() =>
                  setParams(new URLSearchParams(), { replace: true })
                }
              >
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => (
            <li key={c.id} className="min-w-0">
              <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="tabular-nums">#{c.number}</span>
                  <span>{LINUX_CATEGORY_LABEL[c.category]}</span>
                  {c.direction && (
                    <span className="uppercase">{c.direction}</span>
                  )}
                  {c.erratum && <span className="text-warning">Corrected</span>}
                </div>
                <h2 className="font-mono text-sm leading-snug font-medium break-words">
                  <Link
                    to={`/linux/command/${c.slug}`}
                    className="underline-offset-4 hover:underline focus-visible:underline"
                  >
                    {c.syntax}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">{c.description}</p>
                {c.note && (
                  <p className="text-xs text-muted-foreground italic">
                    {c.note}
                  </p>
                )}
                <pre
                  tabIndex={0}
                  aria-label="Example"
                  className="lr-scroll overflow-x-auto rounded-lg border border-border bg-background px-3 py-2 font-mono text-[0.8125rem]"
                >
                  <span className="text-brand-ink select-none">$ </span>
                  {c.example}
                </pre>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <SupportBadge example={c.example} />
                  <div className="flex flex-wrap items-center">
                    <CopyButton
                      text={c.example}
                      label={`Copy example for ${c.syntax}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        sendToTerminal(c.example)
                        navigate("/linux/terminal")
                      }}
                      aria-label={`Try ${c.syntax} in the terminal`}
                    >
                      <TerminalSquareIcon /> Try
                    </Button>
                  </div>
                </div>
                <div className="border-t border-border pt-2">
                  <CommandActions command={c} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        pressed
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
