import { useMemo, useState } from "react"
import { Link } from "react-router"
import { SearchIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RESUME_SECTION_LABEL } from "@/data/catalog/modules/resume"
import { CAP_PER_SOURCE, GENERATED_LABEL } from "@/data/resume/templates"
import { useRemoveQuestion } from "@/features/interview/use-remove-question"
import type { PendingChanges } from "@/services/resume/generate"
import { useLearnerStore } from "@/stores/learner-store"
import { RESUME_SECTIONS, type ResumeSection } from "@/types/learner"
import { useResume, useResumeActions } from "./use-resume"

/** Questions shown per section before "Show all" (display only: nothing is hidden or removed). */
const SHOW_FIRST = 8

/** The questions made from the resume (and imported sets), by section, searchable, with practice progress. */
export function QuestionBank({ pending }: { pending: PendingChanges | null }) {
  const { resume, questions } = useResume()
  const { update } = useResumeActions()
  const progress = useLearnerStore((s) => s.progress)
  const remove = useRemoveQuestion()
  const [section, setSection] = useState<"all" | ResumeSection>("all")
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState<ReadonlySet<ResumeSection>>(new Set())
  const [busy, setBusy] = useState(false)
  const q = query.trim().toLowerCase()

  const visible = useMemo(
    () => questions.filter((x) => !progress[x.id]?.removed),
    [questions, progress]
  )
  const removedCount = questions.length - visible.length
  const shown = useMemo(
    () =>
      visible.filter(
        (x) =>
          (section === "all" || x.section === section) &&
          (q === "" || x.title.toLowerCase().includes(q))
      ),
    [visible, section, q]
  )
  const practised = visible.filter((x) => progress[x.id]?.completed).length

  return (
    <div className="space-y-5">
      <p
        className="text-xs text-muted-foreground"
        data-testid="generated-label"
      >
        {GENERATED_LABEL}
      </p>

      {pending && pending.total > 0 && resume && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm"
          data-testid="pending"
        >
          <p>
            Your resume changed since the questions were made: {pending.added}{" "}
            to add, {pending.updated} to update, {pending.removed} whose source
            was removed.
          </p>
          <Button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true)
              void update(resume).finally(() => setBusy(false))
            }}
          >
            Update my questions
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Search resume questions"
            placeholder="Search resume questions"
            className="ps-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={section}
          onValueChange={(v) => setSection(v as "all" | ResumeSection)}
        >
          <SelectTrigger aria-label="Section" className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {RESUME_SECTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {RESUME_SECTION_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="text-xs text-muted-foreground"
        data-testid="bank-count"
      >
        {practised} practised of {visible.length}. Showing {shown.length}
        {removedCount > 0 && (
          <>
            {" · "}
            <Link
              className="underline underline-offset-4"
              to="/interview/manage?tab=removed"
            >
              {removedCount} removed
            </Link>
          </>
        )}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No questions yet. Check your profile: questions are made from the
          jobs, projects and skills in it.
        </p>
      ) : (
        RESUME_SECTIONS.map((s) => {
          const list = shown.filter((x) => x.section === s)
          if (list.length === 0) return null
          const all = showAll.has(s) || q !== ""
          const rows = all ? list : list.slice(0, SHOW_FIRST)
          return (
            <section
              key={s}
              aria-labelledby={`bank-${s}`}
              className="space-y-2"
            >
              <h3 id={`bank-${s}`} className="lr-eyebrow">
                {RESUME_SECTION_LABEL[s]} ({list.length})
              </h3>
              <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                {rows.map((x) => (
                  <li
                    key={x.id}
                    className="flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <Link
                        to={`/interview/question/${x.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {x.title}
                      </Link>
                      <p className="flex flex-wrap items-center gap-1.5">
                        {x.setId !== "" && (
                          <Badge variant="outline">
                            Imported from {x.setLabel}
                          </Badge>
                        )}
                        {x.edited && <Badge variant="outline">Edited</Badge>}
                        {x.status === "source-removed" && (
                          <Badge variant="outline">Source removed</Badge>
                        )}
                        {progress[x.id]?.completed && (
                          <Badge variant="secondary">Practised</Badge>
                        )}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove from my prep: ${x.title}`}
                      onClick={() => remove(x.id, x.title)}
                    >
                      <XIcon /> Remove
                    </Button>
                  </li>
                ))}
              </ul>
              {list.length > SHOW_FIRST && q === "" && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="px-0"
                  aria-expanded={all}
                  onClick={() =>
                    setShowAll((prev) => {
                      const next = new Set(prev)
                      if (next.has(s)) next.delete(s)
                      else next.add(s)
                      return next
                    })
                  }
                >
                  {all
                    ? "Show fewer"
                    : `Showing the first ${SHOW_FIRST}. Show all ${list.length}`}
                </Button>
              )}
            </section>
          )
        })
      )}
      <p className="text-xs text-muted-foreground">
        To keep the bank readable, at most {CAP_PER_SOURCE} responsibility,
        follow-up and achievement questions are made for each job or project.
        You can change that in your profile settings.
      </p>
    </div>
  )
}
