import {
  BookmarkIcon,
  CheckCircle2Icon,
  FlagIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuestionProgress } from "@/types/learner"

interface Props {
  progress: QuestionProgress | undefined
  onComplete: () => void
  onFlag: (flag: "bookmarked" | "difficult" | "revision") => void
  /** Shows "Remove from my prep" while the question is in the learner's prep. */
  onRemove?: () => void
  /** HR questions mark "practised" in their own practice panel, so the header leaves the button out. */
  hideComplete?: boolean
}

export function QuestionActions({
  progress,
  onComplete,
  onFlag,
  onRemove,
  hideComplete,
}: Props) {
  const done = !!progress?.completed
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="toolbar"
      aria-label="Question actions"
    >
      {!hideComplete && (
        <Button
          onClick={onComplete}
          variant={done ? "secondary" : "default"}
          size="lg"
          aria-pressed={done}
        >
          <CheckCircle2Icon className={cn(done && "text-success")} />
          {done ? "Completed" : "Mark completed"}
        </Button>
      )}
      <Button
        variant="outline"
        size="lg"
        aria-pressed={!!progress?.bookmarked}
        onClick={() => onFlag("bookmarked")}
      >
        <BookmarkIcon className={cn(progress?.bookmarked && "fill-current")} />
        {progress?.bookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        aria-pressed={!!progress?.difficult}
        onClick={() => onFlag("difficult")}
      >
        <FlagIcon
          className={cn(progress?.difficult && "fill-current text-warning")}
        />
        {progress?.difficult ? "Marked difficult" : "Mark difficult"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        aria-pressed={!!progress?.revision}
        onClick={() => onFlag("revision")}
      >
        <RotateCcwIcon className={cn(progress?.revision && "text-tech")} />
        {progress?.revision ? "In revision" : "Add to revision"}
      </Button>
      {onRemove && !progress?.removed && (
        <Button
          variant="ghost"
          size="lg"
          onClick={onRemove}
          className="text-muted-foreground"
        >
          <XIcon />
          Remove from my prep
        </Button>
      )}
    </div>
  )
}
