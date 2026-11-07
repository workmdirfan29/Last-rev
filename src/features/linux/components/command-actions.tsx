import { BookmarkIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLearnerStore } from "@/stores/learner-store"
import type { LinuxCommand } from "@/data/linux/schema"

/** Save and "learned" toggles for one command, stored in the learner's normal progress record. */
export function CommandActions({ command }: { command: LinuxCommand }) {
  const progress = useLearnerStore((s) => s.progress[command.id])
  const toggleFlag = useLearnerStore((s) => s.toggleFlag)
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const saved = progress?.bookmarked ?? false
  const learned = progress?.completed ?? false

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant={saved ? "secondary" : "ghost"}
        size="sm"
        aria-pressed={saved}
        onClick={() => void toggleFlag(command.id, "bookmarked")}
        aria-label={`${saved ? "Saved" : "Save"}: ${command.syntax}`}
      >
        <BookmarkIcon className={saved ? "fill-current" : undefined} />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        type="button"
        variant={learned ? "secondary" : "ghost"}
        size="sm"
        aria-pressed={learned}
        onClick={() => void toggleCompleted(command.id, 2, "linux")}
        aria-label={`${learned ? "Learned" : "Mark learned"}: ${command.syntax}`}
      >
        <CheckIcon />
        {learned ? "Learned" : "Mark learned"}
      </Button>
    </div>
  )
}
