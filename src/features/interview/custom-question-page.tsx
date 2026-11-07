import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { ChevronLeftIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { RichText } from "@/components/shared/rich-text"
import { LevelBadge } from "@/components/shared/badges"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getModule } from "@/data/catalog/modules"
import { parseAnswer } from "@/services/content/custom-questions"
import { useLearnerStore } from "@/stores/learner-store"
import type { CustomQuestion } from "@/types/learner"
import { ConfidenceRating } from "./components/confidence-rating"
import { CustomQuestionDialog } from "./components/custom-question-dialog"
import { NotesEditor } from "./components/notes-editor"
import { QuestionActions } from "./components/question-actions"
import { QuestionPrepControls } from "./components/question-prep-controls"
import { useRemoveQuestion } from "./use-remove-question"

/** A question the learner wrote. It is tracked, bookmarked and revised like a curated one, and labelled "Yours". */
export function CustomQuestionPage({ question }: { question: CustomQuestion }) {
  const navigate = useNavigate()
  const progress = useLearnerStore((s) => s.progress[question.id])
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const toggleFlag = useLearnerStore((s) => s.toggleFlag)
  const setConfidence = useLearnerStore((s) => s.setConfidence)
  const deleteCustom = useLearnerStore((s) => s.deleteCustomQuestion)
  const removeQuestion = useRemoveQuestion()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const mod = getModule(question.moduleId)

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link
          to="/interview/manage?tab=mine"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ChevronLeftIcon className="size-3.5" aria-hidden />
          My questions
        </Link>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">Yours</Badge>
          <LevelBadge level={question.level} />
          <Badge variant="outline">{mod?.title ?? question.moduleId}</Badge>
          {question.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {question.title}
        </h1>
        <QuestionActions
          progress={progress}
          onComplete={() => void toggleCompleted(question.id, 3)}
          onFlag={(f) => void toggleFlag(question.id, f)}
          onRemove={() => removeQuestion(question.id, question.title)}
        />
      </header>

      <QuestionPrepControls questionId={question.id} />

      <section
        aria-label="Your answer"
        className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5"
      >
        <h2 className="lr-eyebrow">Your answer</h2>
        {question.answer.trim() === "" ? (
          <p className="text-sm text-muted-foreground">
            You have not written an answer yet. Use Edit to add one.
          </p>
        ) : (
          <div className="lr-prose">
            {parseAnswer(question.answer).map((b, i) =>
              b.kind === "list" ? (
                <ul key={i} className="lr-prose">
                  {b.items.map((item, j) => (
                    <li key={j}>
                      <RichText text={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i}>
                  <RichText text={b.text} />
                </p>
              )
            )}
          </div>
        )}
        {question.note && (
          <p className="border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="font-medium">Note: </span>
            {question.note}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
          >
            <PencilIcon /> Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2Icon /> Delete this question
          </Button>
        </div>
      </section>

      <section
        className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5"
        aria-label="Your practice"
      >
        <ConfidenceRating
          value={progress?.confidence ?? 0}
          onChange={(v) => void setConfidence(question.id, v)}
        />
        <NotesEditor key={question.id} questionId={question.id} />
      </section>

      <CustomQuestionDialog
        open={editing}
        onOpenChange={setEditing}
        question={question}
      />
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes your question and its notes and progress. It cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void deleteCustom(question.id)
                navigate("/interview/manage?tab=mine", { replace: true })
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
