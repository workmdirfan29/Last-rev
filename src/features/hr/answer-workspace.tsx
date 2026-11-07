import { useMemo, useState } from "react"
import { Link } from "react-router"
import { CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfidenceRating } from "@/features/interview/components/confidence-rating"
import { NotesEditor } from "@/features/interview/components/notes-editor"
import { useLearnerStore } from "@/stores/learner-store"
import type { Question } from "@/types/content"
import type { HrAnswer } from "@/types/learner"
import { AnswerCard } from "./answer-card"
import { StarBuilder, selfCheckItemsFor } from "./star-builder"

type Target = Pick<Question, "id" | "title" | "starPrompts" | "selfCheck">

export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2
        id={id}
        className="font-heading text-base font-semibold tracking-tight"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

/** The STAR builder and the learner's saved answers for one question. Shared by HR and resume questions. */
export function AnswerWorkspace({ question }: { question: Target }) {
  const allAnswers = useLearnerStore((s) => s.hrAnswers)
  // Filter outside the selector: a selector that returns a new array every time loops forever.
  const answers = useMemo(
    () => allAnswers.filter((a) => a.questionId === question.id),
    [allAnswers, question.id]
  )
  const [editing, setEditing] = useState<HrAnswer | null>(null)
  const checkTotal = selfCheckItemsFor(question).length

  return (
    <>
      <Section id="hr-build" title="Build your answer (STAR)">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <StarBuilder
            key={editing?.id ?? "new"}
            question={question}
            editing={editing}
            onFinished={() => setEditing(null)}
          />
        </div>
      </Section>

      <Section id="hr-saved" title={`Your saved answers (${answers.length})`}>
        {answers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Nothing saved for this question yet. Write your answer above and
            save it. You can keep several, for different stories.
          </p>
        ) : (
          <ul className="space-y-3">
            {answers.map((a) => (
              <li key={a.id}>
                <AnswerCard
                  answer={a}
                  checkTotal={checkTotal}
                  questionTitle={question.title}
                  onEdit={(x) => {
                    setEditing(x)
                    document
                      .getElementById("hr-build")
                      ?.scrollIntoView({ block: "start" })
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}

/** Mark practised, confidence 1 to 5 and notes: the ordinary progress mechanisms, so revision and lists work as usual. */
export function PracticePanel({
  questionId,
  onMarkPractised,
}: {
  questionId: string
  onMarkPractised: () => void
}) {
  const progress = useLearnerStore((s) => s.progress[questionId])
  const setConfidence = useLearnerStore((s) => s.setConfidence)
  const practised = !!progress?.completed
  return (
    <section
      aria-label="Your practice"
      className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          variant={practised ? "secondary" : "default"}
          aria-pressed={practised}
          onClick={onMarkPractised}
        >
          <CheckCircle2Icon className={practised ? "text-success" : ""} />
          {practised ? "Practised" : "Mark practised"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Marking it practised adds it to your revision schedule.
        </p>
      </div>
      <ConfidenceRating
        label="How confident are you answering this?"
        value={progress?.confidence ?? 0}
        onChange={(v) => void setConfidence(questionId, v)}
      />
      <NotesEditor key={questionId} questionId={questionId} />
      <p className="text-xs text-muted-foreground">
        <Link to="/hr/answers" className="underline underline-offset-4">
          See all my answers
        </Link>
      </p>
    </section>
  )
}
