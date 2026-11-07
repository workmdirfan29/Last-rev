import type { ReactNode } from "react"
import { Link } from "react-router"
import {
  BookmarkIcon,
  FlagIcon,
  NotebookPenIcon,
  RotateCcwIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DifficultyBadge, LevelBadge } from "@/components/shared/badges"
import type { QuestionIndexEntry } from "@/types/content"
import { isLevelNeutralModule } from "@/utils/module-kind"
import type { QuestionProgress } from "@/types/learner"
import type { LibraryFlag } from "./lists"

const FLAG_META: Record<
  LibraryFlag,
  { icon: LucideIcon; label: string; clear: string; className?: string }
> = {
  bookmarked: {
    icon: BookmarkIcon,
    label: "Saved",
    clear: "Remove from Saved",
  },
  difficult: {
    icon: FlagIcon,
    label: "Difficult",
    clear: "Clear difficult",
    className: "text-warning",
  },
  revision: {
    icon: RotateCcwIcon,
    label: "In revision",
    clear: "Remove from revision queue",
    className: "text-tech",
  },
}
const FLAG_ORDER: LibraryFlag[] = ["bookmarked", "difficult", "revision"]

interface Props {
  q: QuestionIndexEntry
  moduleTitle?: string
  progress?: QuestionProgress
  /** Flags this list lets the learner clear inline. */
  clearable: LibraryFlag[]
  onClear: (questionId: string, flag: LibraryFlag) => void
  /** Secondary line under the badges (next review, note preview). */
  extra?: ReactNode
}

/** A link to the question plus, beside it, the inline buttons: a button must not live inside the link. */
export function LibraryRow({
  q,
  moduleTitle,
  progress,
  clearable,
  onClear,
  extra,
}: Props) {
  const flags = FLAG_ORDER.filter((f) => progress?.[f])
  const hasNote = (progress?.note.trim().length ?? 0) > 0
  const actions = clearable.filter((f) => progress?.[f])

  return (
    <li className="flex items-start gap-1 rounded-lg border border-transparent transition-colors focus-within:border-border hover:border-border hover:bg-card">
      <Link
        to={`/interview/question/${q.id}`}
        className="min-w-0 flex-1 space-y-1.5 rounded-lg px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <p className="text-sm leading-snug font-medium">{q.title}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {!isLevelNeutralModule(q.moduleId) && <LevelBadge level={q.level} />}
          <DifficultyBadge difficulty={q.difficulty} />
          <span className="text-xs text-muted-foreground">
            {moduleTitle ? `${moduleTitle} · ` : ""}
            {q.topic}
          </span>
        </div>
        {(flags.length > 0 || hasNote) && (
          <ul
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-muted-foreground"
            aria-label="Flags"
          >
            {flags.map((f) => {
              const { icon: Icon, label, className } = FLAG_META[f]
              return (
                <li key={f} className="flex items-center gap-1">
                  <Icon className={`size-3 ${className ?? ""}`} aria-hidden />{" "}
                  {label}
                </li>
              )
            })}
            {hasNote && (
              <li className="flex items-center gap-1">
                <NotebookPenIcon className="size-3" aria-hidden /> Has note
              </li>
            )}
          </ul>
        )}
        {extra}
      </Link>
      {actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-0.5 pe-1.5 pt-1.5">
          {actions.map((f) => (
            <Button
              key={f}
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground hover:text-foreground"
              aria-label={`${FLAG_META[f].clear}: ${q.title}`}
              title={FLAG_META[f].clear}
              onClick={() => onClear(q.id, f)}
            >
              <XIcon />
            </Button>
          ))}
        </div>
      )}
    </li>
  )
}
