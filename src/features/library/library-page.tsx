import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { format, formatDistanceToNowStrict } from "date-fns"
import { SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { getModule } from "@/data/catalog/modules"
import { scoreMatch } from "@/services/content/search"
import { isDue } from "@/services/revision/schedule"
import { useLearnerStore } from "@/stores/learner-store"
import { LibraryRow } from "./library-row"
import { LIBRARY_LISTS, type LibraryListMeta } from "./lists"
import { useLibrary } from "./use-library"

const ALL_MODULES = "all"

/** One reusable page; the route picks which list it shows. */
export function LibraryPage({ list }: { list: LibraryListMeta }) {
  const library = useLibrary()
  if (!library) return <ScreenLoader />
  // Keyed so search and module filter start fresh on every list.
  return <LibraryView key={list.id} list={list} library={library} />
}

function LibraryView({
  list,
  library,
}: {
  list: LibraryListMeta
  library: NonNullable<ReturnType<typeof useLibrary>>
}) {
  const navigate = useNavigate()
  const progress = useLearnerStore((s) => s.progress)
  const toggleFlag = useLearnerStore((s) => s.toggleFlag)
  const [query, setQuery] = useState("")
  const [moduleId, setModuleId] = useState(ALL_MODULES)

  const items = library.lists[list.id]
  const modules = useMemo(
    () =>
      [...new Set(items.map((q) => q.moduleId))].map((id) => ({
        id,
        title: getModule(id)?.title ?? id,
      })),
    [items]
  )
  // The chosen module can empty out (e.g. its last item was removed): fall back to all.
  const activeModule = modules.some((m) => m.id === moduleId)
    ? moduleId
    : ALL_MODULES
  const filtered = useMemo(
    () =>
      items.filter(
        (q) =>
          (activeModule === ALL_MODULES || q.moduleId === activeModule) &&
          (!query.trim() ||
            scoreMatch(
              {
                title: q.title,
                topic: q.topic,
                keywords: q.keywords,
                moduleTitle: getModule(q.moduleId)?.title,
              },
              query
            ) > 0)
      ),
    [items, activeModule, query]
  )
  const filtering = query.trim() !== "" || activeModule !== ALL_MODULES
  const now = new Date()

  const openInterviewZone = (
    <Button asChild variant="outline">
      <Link to="/interview">Open Interview Zone</Link>
    </Button>
  )

  function extra(id: string) {
    const p = progress[id]
    if (list.id === "revision" && p?.nextReviewAt) {
      return (
        <p className="text-[0.6875rem] text-muted-foreground">
          {isDue(p, now)
            ? "Due now"
            : `Next review ${format(new Date(p.nextReviewAt), "d MMM")} (in ${formatDistanceToNowStrict(new Date(p.nextReviewAt))})`}
        </p>
      )
    }
    if (list.id === "notes" && p?.note)
      return (
        <p className="line-clamp-2 text-xs text-muted-foreground">{p.note}</p>
      )
    return null
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Library"
        title={list.title}
        description={list.description}
        actions={
          <Badge
            variant="secondary"
            className="h-6 px-2.5 text-xs tabular-nums"
          >
            {items.length} {items.length === 1 ? "question" : "questions"}
          </Badge>
        }
      />

      {/* The sidebar is the picker from md up; below that it is hidden, so offer the same five lists here. */}
      <div className="flex items-center gap-2 md:hidden">
        <Label htmlFor="library-list" className="shrink-0 text-sm">
          Show:
        </Label>
        <Select
          value={list.id}
          onValueChange={(id) =>
            navigate(LIBRARY_LISTS.find((l) => l.id === id)!.path)
          }
        >
          <SelectTrigger id="library-list" className="min-w-0 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIBRARY_LISTS.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.title} ({library.lists[l.id].length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={list.icon}
          title={list.empty.title}
          description={list.empty.description}
          action={openInterviewZone}
        />
      ) : (
        <>
          <div
            className="flex flex-col gap-2 sm:flex-row"
            role="search"
            aria-label={`Filter ${list.title}`}
          >
            <div className="relative flex-1">
              <SearchIcon
                className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                aria-label={`Search ${list.title}`}
                placeholder="Search by title, topic or keyword…"
                className="h-9 ps-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={activeModule} onValueChange={setModuleId}>
              <SelectTrigger aria-label="Module" className="w-full sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_MODULES}>All modules</SelectItem>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {list.id === "revision" && library.due > 0 && (
            <p className="text-sm">
              <Badge className="me-2">{library.due} due</Badge>
              Open a due question, answer it, then rate your recall to schedule
              the next review.
            </p>
          )}

          <p role="status" className="text-xs text-muted-foreground">
            {filtering
              ? `Showing ${filtered.length} of ${items.length}`
              : `${items.length} in this list`}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title="No matching questions"
              description="Nothing in this list matches your search and module filter."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("")
                    setModuleId(ALL_MODULES)
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="-mx-1 space-y-0.5">
              {filtered.map((q) => (
                <LibraryRow
                  key={q.id}
                  q={q}
                  moduleTitle={getModule(q.moduleId)?.title}
                  progress={progress[q.id]}
                  clearable={list.flags}
                  onClear={(id, flag) => void toggleFlag(id, flag)}
                  extra={extra(q.id)}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
