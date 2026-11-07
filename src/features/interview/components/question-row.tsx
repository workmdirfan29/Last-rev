import { Link } from "react-router"
import {
  BookmarkIcon,
  CheckCircle2Icon,
  CircleIcon,
  FlagIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import { DifficultyBadge, LevelBadge } from "@/components/shared/badges"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isCustomQuestionId } from "@/services/content/custom-questions"
import type { QuestionIndexEntry } from "@/types/content"
import { isLevelNeutralModule } from "@/utils/module-kind"
import type { QuestionProgress } from "@/types/learner"

export function QuestionRow({
  q,
  number,
  progress,
  showModule,
  onRemove,
}: {
  q: QuestionIndexEntry
  number: number
  progress?: QuestionProgress
  showModule?: string
  /** Adds a "Remove from my prep" button to the row. */
  onRemove?: (q: QuestionIndexEntry) => void
}) {
  return (
    <li className="group relative">
      <Link
        to={`/interview/question/${q.id}`}
        className={cn(
          "flex items-start gap-3 rounded-lg border border-transparent px-3 py-3 transition-colors outline-none hover:border-border hover:bg-card focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          onRemove && "pe-12"
        )}
      >
        <span className="mt-0.5 w-6 shrink-0 text-end text-xs text-muted-foreground tabular-nums">
          {number}
        </span>
        {progress?.completed ? (
          <CheckCircle2Icon
            className="mt-0.5 size-4 shrink-0 text-success"
            aria-label="Completed"
          />
        ) : (
          <CircleIcon
            className="mt-0.5 size-4 shrink-0 text-muted-foreground/50"
            aria-label="Not completed"
          />
        )}
        <div className="min-w-0 flex-1 space-y-1.5">
          <p
            className={cn(
              "text-sm leading-snug font-medium",
              progress?.completed && "text-muted-foreground"
            )}
          >
            {q.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {isCustomQuestionId(q.id) && (
              <Badge variant="secondary">Yours</Badge>
            )}
            {!isLevelNeutralModule(q.moduleId) && (
              <LevelBadge level={q.level} />
            )}
            <DifficultyBadge difficulty={q.difficulty} />
            <span className="text-xs text-muted-foreground">
              {showModule ? `${showModule} · ` : ""}
              {q.topic}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5 text-muted-foreground">
          {progress?.bookmarked && (
            <BookmarkIcon
              className="size-3.5 fill-current"
              aria-label="Bookmarked"
            />
          )}
          {progress?.difficult && (
            <FlagIcon
              className="size-3.5 fill-current text-warning"
              aria-label="Marked difficult"
            />
          )}
          {progress?.revision && (
            <RotateCcwIcon
              className="size-3.5 text-tech"
              aria-label="In revision"
            />
          )}
          {progress && progress.confidence > 0 && (
            <span
              className="rounded bg-muted px-1.5 text-[0.6875rem] tabular-nums"
              title="Your confidence"
            >
              {progress.confidence}/5
            </span>
          )}
        </div>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(q)}
          aria-label={`Remove from my prep: ${q.title}`}
          title="Remove from my prep"
          className="absolute end-2 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      )}
    </li>
  )
}
