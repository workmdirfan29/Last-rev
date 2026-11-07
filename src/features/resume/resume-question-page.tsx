import { useState } from "react"
import { Link, useNavigate } from "react-router"
import {
  ChevronLeftIcon,
  PencilIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"
import { RichText } from "@/components/shared/rich-text"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RESUME_SECTION_LABEL } from "@/data/catalog/modules/resume"
import { GENERATED_LABEL, SECTION_TIPS } from "@/data/resume/templates"
import {
  AnswerWorkspace,
  PracticePanel,
  Section,
} from "@/features/hr/answer-workspace"
import { QuestionActions } from "@/features/interview/components/question-actions"
import { QuestionPrepControls } from "@/features/interview/components/question-prep-controls"
import { useRemoveQuestion } from "@/features/interview/use-remove-question"
import { mapSkills } from "@/services/resume/skills"
import { useLearnerStore } from "@/stores/learner-store"
import type { ResumeQuestion } from "@/types/learner"

/**
 * A question made from the learner's resume (or imported in a set). It is practised like any question: the
 * same STAR builder and saved answers as HR questions, confidence, notes, bookmark and revision. The outline is
 * a fill-in structure, never a sample answer: only the learner knows their facts.
 */
export function ResumeQuestionPage({ question }: { question: ResumeQuestion }) {
  const navigate = useNavigate()
  const progress = useLearnerStore((s) => s.progress[question.id])
  const resume = useLearnerStore((s) => s.resume)
  const roleId = useLearnerStore(
    (s) =>
      s.profile?.primaryRole ??
      s.profile?.selectedRoles[0] ??
      "frontend-developer"
  )
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const toggleFlag = useLearnerStore((s) => s.toggleFlag)
  const update = useLearnerStore((s) => s.updateResumeQuestion)
  const deleteQuestions = useLearnerStore((s) => s.deleteResumeQuestions)
  const removeQuestion = useRemoveQuestion()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(question.title)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const imported = question.setId !== ""
  const skill =
    question.sourceKind === "skill" && resume
      ? mapSkills(resume.skills.filter((s) => s.uid === question.sourceUid))[0]
      : undefined

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link
          to="/resume?tab=questions"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ChevronLeftIcon className="size-3.5" aria-hidden />
          Resume questions
        </Link>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">
            {imported ? "Imported" : "From your resume"}
          </Badge>
          <Badge variant="outline">
            {RESUME_SECTION_LABEL[question.section]}
          </Badge>
          {question.edited && <Badge variant="outline">Edited</Badge>}
          {question.status === "source-removed" && (
            <Badge variant="outline">Source removed</Badge>
          )}
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {question.title}
        </h1>
        <p className="text-xs text-muted-foreground" data-testid="provenance">
          {imported
            ? `Imported from ${question.setLabel}. The wording came from that file, not from your resume.`
            : GENERATED_LABEL}
        </p>
        <QuestionActions
          progress={progress}
          onComplete={() => void toggleCompleted(question.id, 4)}
          onFlag={(f) => void toggleFlag(question.id, f)}
          onRemove={() => removeQuestion(question.id, question.title)}
          hideComplete
        />
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(question.title)
              setEditing(true)
            }}
          >
            <PencilIcon /> Edit wording
          </Button>
          {question.edited && question.generatedTitle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                void update(question.id, {
                  title: question.generatedTitle,
                  edited: false,
                })
              }
            >
              <RotateCcwIcon /> Reset to generated
            </Button>
          )}
        </div>
      </header>

      <QuestionPrepControls questionId={question.id} />

      {question.status === "source-removed" && (
        <div
          role="region"
          aria-label="Source removed"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
        >
          <p className="text-sm">
            <span className="font-medium">
              The resume item this came from was removed.
            </span>{" "}
            <span className="text-muted-foreground">
              You can keep practising it, and your answers are kept. Or delete
              it.
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2Icon /> Delete this question
          </Button>
        </div>
      )}

      {skill?.practise && (
        <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          You can practise:{" "}
          <Link
            className="underline underline-offset-4"
            to={`/interview/${roleId}/${skill.practise.moduleId}`}
          >
            {skill.practise.moduleTitle}, {skill.practise.questions} questions
          </Link>
        </p>
      )}

      {question.framework.length > 0 && (
        <Section id="resume-outline" title="An outline for your answer">
          <p className="text-xs text-muted-foreground">
            Fill each [bracket] with your own facts. Never use experience,
            achievements or numbers that are not yours.
          </p>
          <ol className="lr-prose list-decimal space-y-1.5 ps-5">
            {question.framework.map((s, i) => (
              <li key={i}>
                <RichText text={s} />
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section id="resume-tips" title="Tips">
        <ul className="lr-prose">
          {SECTION_TIPS[question.section].map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Section>

      <AnswerWorkspace
        question={{
          id: question.id,
          title: question.title,
          starPrompts: undefined,
          selfCheck: undefined,
        }}
      />

      <PracticePanel
        questionId={question.id}
        onMarkPractised={() => void toggleCompleted(question.id, 4)}
      />

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit the wording</DialogTitle>
            <DialogDescription>
              Your wording is kept when the questions are updated from your
              resume.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="resume-q-title">Question</Label>
            <Textarea
              id="resume-q-title"
              rows={4}
              maxLength={600}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              disabled={draft.trim().length < 3}
              onClick={() => {
                const title = draft.trim()
                void update(question.id, {
                  title,
                  edited: title !== question.generatedTitle,
                })
                setEditing(false)
              }}
            >
              Save wording
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the question and your notes, progress and saved
              answers for it. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void deleteQuestions([question.id]).then(() =>
                  navigate("/resume?tab=questions", { replace: true })
                )
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
