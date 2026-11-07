import { useState } from "react"
import { Trash2Icon, Undo2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useLearnerStore } from "@/stores/learner-store"

/**
 * Prep controls shown on a question: a banner when it is removed (with Restore), and an
 * explicit, confirmed "delete my notes and progress" action. Removing a question never
 * deletes anything; this is the only place data is forgotten.
 */
export function QuestionPrepControls({ questionId }: { questionId: string }) {
  const progress = useLearnerStore((s) => s.progress[questionId])
  const setRemoved = useLearnerStore((s) => s.setQuestionRemoved)
  const deleteData = useLearnerStore((s) => s.deleteQuestionData)
  const [confirming, setConfirming] = useState(false)
  const hasData =
    !!progress &&
    (progress.note.trim() !== "" ||
      progress.completed ||
      progress.confidence > 0 ||
      progress.attempts > 0)

  return (
    <>
      {progress?.removed && (
        <div
          role="region"
          aria-label="Removed from your prep"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
        >
          <p className="text-sm">
            <span className="font-medium">Removed from your prep.</span>{" "}
            <span className="text-muted-foreground">
              It does not count in your progress or revision. Your notes are
              kept.
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void setRemoved(questionId, false)}
          >
            <Undo2Icon /> Restore
          </Button>
        </div>
      )}
      {hasData && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setConfirming(true)}
          >
            <Trash2Icon /> Delete my notes and progress for this question
          </Button>
        </div>
      )}
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your notes and progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your note, confidence rating, completion,
              bookmarks and any saved HR answers for this question. It cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep them</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void deleteData(questionId)
                setConfirming(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
