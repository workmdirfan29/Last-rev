import { useState } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import { CopyIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
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
import { SELF_CHECK_ITEMS, STAR_FIELDS, countWords } from "@/data/hr/guidance"
import { useLearnerStore } from "@/stores/learner-store"
import type { HrAnswer } from "@/types/learner"
import { answerAsText } from "./answer-text"

/** One saved answer: read it, copy it, edit it (where the builder is) or delete it after a confirmation. */
export function AnswerCard({
  answer,
  questionTitle,
  questionHref,
  checkTotal = SELF_CHECK_ITEMS.length,
  onEdit,
}: {
  answer: HrAnswer
  /** Shown above the answer when the card is listed away from its question. */
  questionTitle?: string
  questionHref?: string
  /** How many self-check items the question has (for "3 of 6"). */
  checkTotal?: number
  onEdit?: (answer: HrAnswer) => void
}) {
  const remove = useLearnerStore((s) => s.deleteHrAnswer)
  const [confirming, setConfirming] = useState(false)
  const name = answer.title.trim() || "Untitled answer"
  const words = STAR_FIELDS.reduce((n, g) => n + countWords(answer[g.field]), 0)

  async function copy() {
    try {
      await navigator.clipboard.writeText(answerAsText(answer, questionTitle))
      toast("Copied to your clipboard")
    } catch {
      toast("Could not copy. Select the text and copy it yourself.")
    }
  }

  return (
    <article
      aria-label={name}
      className="space-y-3 rounded-xl border border-border bg-card p-4"
    >
      <header className="space-y-1">
        {questionTitle &&
          (questionHref ? (
            <Link
              to={questionHref}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {questionTitle}
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground">{questionTitle}</p>
          ))}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <h3 className="text-sm font-medium">{name}</h3>
          <p className="text-xs text-muted-foreground tabular-nums">
            {words} words · saved{" "}
            {format(new Date(answer.updatedAt), "d MMM yyyy")}
          </p>
        </div>
      </header>
      <dl className="space-y-2 text-sm">
        {STAR_FIELDS.map((g) =>
          answer[g.field].trim() ? (
            <div key={g.field}>
              <dt className="text-xs font-medium text-muted-foreground">
                {g.label}
              </dt>
              <dd className="whitespace-pre-wrap">{answer[g.field]}</dd>
            </div>
          ) : null
        )}
      </dl>
      {answer.selfCheck.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Self-check: you ticked {answer.selfCheck.length} of {checkTotal} (your
          own assessment).
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {onEdit && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(answer)}
            aria-label={`Edit ${name}`}
          >
            <PencilIcon /> Edit
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void copy()}
          aria-label={`Copy ${name}`}
        >
          <CopyIcon /> Copy
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setConfirming(true)}
          aria-label={`Delete ${name}`}
        >
          <Trash2Icon /> Delete
        </Button>
      </div>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this answer?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes "{name}". It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void remove(answer.id)
                setConfirming(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  )
}
