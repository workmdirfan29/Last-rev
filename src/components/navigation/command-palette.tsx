import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { SWITCH_MODE_ITEM, navItemsFor } from "@/app/nav"
import { useActiveMode } from "@/app/use-active-mode"
import { getModule } from "@/data/catalog/modules"
import { loadAllLessons } from "@/data/english/loaders"
import { useFullIndex } from "@/hooks/use-content"
import { scoreMatch } from "@/services/content/search"
import { useLearnerStore } from "@/stores/learner-store"
import {
  SEARCH_COPY,
  searchEnglishItems,
  searchEnglishLessons,
  searchLinux,
  searchStudyLessons,
  searchStudyProjects,
  searchStudyQuizzes,
  type SearchHit,
} from "./mode-search"

/** The header's search button. Opens the palette, also with Ctrl+K (or Cmd+K). */
export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false)
  const copy = SEARCH_COPY[useActiveMode()]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon aria-hidden />
        <span className="flex-1 text-start">{copy.trigger}</span>
        <kbd className="rounded border border-border px-1.5 font-mono text-[0.625rem]">
          Ctrl K
        </kbd>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label={copy.label}
      >
        <SearchIcon />
      </Button>
      {open && <PaletteDialog open={open} onOpenChange={setOpen} />}
    </>
  )
}

function PaletteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const mode = useActiveMode()
  const full = useFullIndex()
  const progress = useLearnerStore((s) => s.progress)
  // Search what is in the learner's prep: curated and their own questions, never the ones they removed.
  const index = useMemo(
    () => full?.filter((q) => !progress[q.id]?.removed),
    [full, progress]
  )
  const items = [...navItemsFor(mode), SWITCH_MODE_ITEM]
  const copy = SEARCH_COPY[mode]
  const roadmapId = useLearnerStore((s) => s.profile?.studyRoadmap)
  // English sentences and words live in lesson files: load them (once) only when the English search is open.
  const { data: englishLessons } = useQuery({
    queryKey: ["english-all"],
    queryFn: loadAllLessons,
    staleTime: Infinity,
    enabled: mode === "english",
  })

  // Interview questions belong to Interview Prep only; Study Path searches pages.
  const results = useMemo(() => {
    if (mode !== "interview" || !index || !query.trim()) return []
    return index
      .map((q) => ({
        q,
        score: scoreMatch(
          {
            title: q.title,
            topic: q.topic,
            keywords: q.keywords,
            moduleTitle: getModule(q.moduleId)?.title,
          },
          query
        ),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.q)
  }, [index, query, mode])

  // Linux searches commands, English searches lessons and sentences; nothing else is mixed in.
  const hits = useMemo<{ heading: string; rows: SearchHit[] }[]>(() => {
    if (mode === "linux")
      return [{ heading: "Commands", rows: searchLinux(query) }]
    if (mode === "study")
      return [
        { heading: "Lessons", rows: searchStudyLessons(query) },
        { heading: "Projects", rows: searchStudyProjects(query) },
        { heading: "Quizzes", rows: searchStudyQuizzes(query, roadmapId) },
      ]
    if (mode === "english")
      return [
        { heading: "Lessons", rows: searchEnglishLessons(query) },
        {
          heading: "Sentences and words",
          rows: searchEnglishItems(englishLessons ?? [], query),
        },
      ]
    return []
  }, [mode, query, englishLessons, roadmapId])

  const q = query.trim().toLowerCase()
  const pages = q
    ? items.filter((i) => i.title.toLowerCase().includes(q))
    : items

  function go(to: string) {
    onOpenChange(false)
    navigate(to)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description={copy.description}
    >
      <Command shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={copy.placeholder}
        />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Questions">
              {results.map((r) => (
                <CommandItem
                  key={r.id}
                  value={r.id}
                  onSelect={() => go(`/interview/question/${r.id}`)}
                >
                  <span className="min-w-0 flex-1 truncate">{r.title}</span>
                  <span className="ms-2 shrink-0 text-xs text-muted-foreground">
                    {getModule(r.moduleId)?.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {hits.map(
            (g) =>
              g.rows.length > 0 && (
                <CommandGroup key={g.heading} heading={g.heading}>
                  {g.rows.map((r) => (
                    <CommandItem
                      key={r.key}
                      value={r.key}
                      onSelect={() => go(r.to)}
                    >
                      <span className="min-w-0 flex-1 truncate">{r.title}</span>
                      <span
                        lang={mode === "english" ? "hi" : undefined}
                        className="ms-2 max-w-[45%] shrink-0 truncate text-xs text-muted-foreground"
                      >
                        {r.hint}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
          )}
          {pages.length > 0 && (
            <CommandGroup heading="Pages">
              {pages.map((i) => (
                <CommandItem
                  key={i.id}
                  value={`page-${i.id}`}
                  onSelect={() => go(i.to)}
                >
                  <i.icon aria-hidden />
                  {i.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
