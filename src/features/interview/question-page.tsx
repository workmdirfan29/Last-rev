import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronLeftIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DifficultyBadge, LevelBadge } from "@/components/shared/badges"
import { EmptyState } from "@/components/shared/empty-state"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { Badge } from "@/components/ui/badge"
import { getModule } from "@/data/catalog/modules"
import {
  useModuleQuestions,
  useQuestion,
  useQuestionIndex,
} from "@/hooks/use-content"
import { isDue } from "@/services/revision/schedule"
import { useLearnerStore } from "@/stores/learner-store"
import { isHrModuleId, LEVEL_META } from "@/types/content"
import { HrQuestionView } from "@/features/hr/hr-question-view"
import { ConfidenceRating } from "./components/confidence-rating"
import { NotesEditor } from "./components/notes-editor"
import { QuestionActions } from "./components/question-actions"
import { DeepAnswer, QuickAnswer } from "./components/answer-sections"
import { QuestionPrepControls } from "./components/question-prep-controls"
import { ResumeQuestionPage } from "@/features/resume/resume-question-page"
import { CustomQuestionPage } from "./custom-question-page"
import { useRemoveQuestion } from "./use-remove-question"

const LEVEL_ORDER = ["fresher", "intermediate", "advanced"] as const

function CuratedQuestionPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { data: question, isLoading } = useQuestion(id)
  const { data: siblings } = useModuleQuestions(question?.moduleId ?? "")
  const { data: index } = useQuestionIndex()

  const progress = useLearnerStore((s) => s.progress[id])
  const mode = useLearnerStore((s) => s.preferences.answerMode)
  const selfTest = useLearnerStore((s) => s.preferences.selfTest)
  const primaryRole = useLearnerStore((s) => s.profile?.primaryRole)
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const toggleFlag = useLearnerStore((s) => s.toggleFlag)
  const setConfidence = useLearnerStore((s) => s.setConfidence)
  const reviewQuestion = useLearnerStore((s) => s.reviewQuestion)
  const updatePreferences = useLearnerStore((s) => s.updatePreferences)
  const markViewed = useLearnerStore((s) => s.markViewed)
  const removeQuestion = useRemoveQuestion()

  // Reveal state is per question: self-test mode hides each answer until asked.
  const revealKey = `${id}:${selfTest}`
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const revealed = !selfTest || revealedKey === revealKey

  const ordered = useMemo(
    () =>
      siblings
        ? [...siblings].sort(
            (a, b) =>
              LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
          )
        : [],
    [siblings]
  )
  const pos = ordered.findIndex((q) => q.id === id)
  const prev = pos > 0 ? ordered[pos - 1] : null
  const next = pos >= 0 && pos < ordered.length - 1 ? ordered[pos + 1] : null

  const related = useMemo(
    () =>
      question && index
        ? index.filter((e) => question.relatedIds.includes(e.id))
        : [],
    [question, index]
  )

  // Opening a question makes it the "continue learning" target.
  useEffect(() => {
    if (question) void markViewed(question.id)
  }, [question, markViewed])

  // ← / → navigate between questions (ignored while typing).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (
        t?.closest(
          "input, textarea, select, [contenteditable='true'], [role='dialog']"
        )
      )
        return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === "ArrowLeft" && prev)
        navigate(`/interview/question/${prev.id}`)
      if (e.key === "ArrowRight" && next)
        navigate(`/interview/question/${next.id}`)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [prev, next, navigate])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [id])

  if (isLoading) return <ScreenLoader />
  if (!question) {
    return (
      <EmptyState
        title="Question not found"
        description="This link doesn't match any question in the library."
        action={
          <Button asChild>
            <Link to="/interview">Back to Interview Zone</Link>
          </Button>
        }
      />
    )
  }

  const mod = getModule(question.moduleId)
  const roleId = primaryRole ?? "frontend-developer"
  const due = !!progress?.completed && isDue(progress, new Date())
  // HR questions are level-neutral and have their own layout (STAR builder, hidden sample, practice).
  const hr = isHrModuleId(question.moduleId)

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link
          to={`/interview/${roleId}/${question.moduleId}`}
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ChevronLeftIcon className="size-3.5" aria-hidden />
          {mod?.title}
        </Link>
        {!hr && (
          <>
            <span aria-hidden>/</span>
            <span>{LEVEL_META[question.level].label}</span>
            <span aria-hidden>/</span>
            <span>{question.topic}</span>
          </>
        )}
        {pos >= 0 && (
          <span className="ms-auto tabular-nums">
            Question {pos + 1} of {ordered.length}
          </span>
        )}
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {hr ? (
            <Badge variant="secondary">HR interview</Badge>
          ) : (
            <>
              <LevelBadge level={question.level} />
              <DifficultyBadge difficulty={question.difficulty} />
              <Badge variant="secondary">{question.topic}</Badge>
            </>
          )}
          <span className="text-xs text-muted-foreground">
            ~{question.estimatedMinutes} min
          </span>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {question.title}
        </h1>
        <QuestionActions
          progress={progress}
          onComplete={() =>
            void toggleCompleted(question.id, question.estimatedMinutes)
          }
          onFlag={(f) => void toggleFlag(question.id, f)}
          onRemove={() => removeQuestion(question.id, question.title)}
          hideComplete={hr}
        />
      </header>

      <QuestionPrepControls questionId={question.id} />

      {due && (
        <div
          role="region"
          aria-label="Revision due"
          className="space-y-3 rounded-xl border border-tech/50 bg-tech/10 p-4"
        >
          <div>
            <p className="text-sm font-medium">Due for revision</p>
            <p className="text-xs text-muted-foreground">
              Try answering out loud first, then rate how well you recalled it.
              A confident rating moves the next review further out; a shaky one
              brings it back tomorrow.
            </p>
          </div>
          <ConfidenceRating
            label="How well did you recall it?"
            value={0}
            onChange={(v) => void reviewQuestion(question.id, v)}
          />
        </div>
      )}

      {hr ? (
        <HrQuestionView
          question={question}
          onMarkPractised={() =>
            void toggleCompleted(question.id, question.estimatedMinutes)
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
            <Tabs
              value={mode}
              onValueChange={(v) =>
                void updatePreferences({ answerMode: v as "quick" | "deep" })
              }
            >
              <TabsList aria-label="Answer mode">
                <TabsTrigger value="quick" aria-controls={undefined}>
                  Quick revision
                </TabsTrigger>
                <TabsTrigger value="deep" aria-controls={undefined}>
                  Deep learning
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Switch
                id="selftest"
                checked={selfTest}
                onCheckedChange={(v) => void updatePreferences({ selfTest: v })}
              />
              <Label htmlFor="selftest" className="text-xs font-normal">
                Hide answers until I reveal them
              </Label>
            </div>
          </div>

          {revealed ? (
            <>
              <Tabs value={mode}>
                <TabsContent value="quick">
                  <QuickAnswer q={question} />
                </TabsContent>
                <TabsContent value="deep">
                  <DeepAnswer q={question} related={related} />
                </TabsContent>
              </Tabs>
              {selfTest && (
                <Button variant="outline" onClick={() => setRevealedKey(null)}>
                  <EyeOffIcon /> Hide answer
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Answer it out loud or write it in your notes below, then reveal.
              </p>
              <Button size="lg" onClick={() => setRevealedKey(revealKey)}>
                <EyeIcon /> Reveal answer
              </Button>
            </div>
          )}

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
        </>
      )}

      <nav
        aria-label="Question navigation"
        className="flex items-center justify-between gap-3 pb-4"
      >
        {prev ? (
          <Button asChild variant="outline" size="lg">
            <Link to={`/interview/question/${prev.id}`} rel="prev">
              <ArrowLeftIcon /> Previous
            </Link>
          </Button>
        ) : (
          <span />
        )}
        <span className="hidden text-[0.6875rem] text-muted-foreground sm:block">
          Tip: use ← → keys
        </span>
        {next ? (
          <Button asChild size="lg">
            <Link to={`/interview/question/${next.id}`} rel="next">
              Next <ArrowRightIcon />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="lg">
            <Link to={`/interview/${roleId}/${question.moduleId}`}>
              Back to library
            </Link>
          </Button>
        )}
      </nav>
    </article>
  )
}

/** `/interview/question/:id` for a curated question or one the learner wrote. */
export function QuestionPage() {
  const { id = "" } = useParams()
  const custom = useLearnerStore((s) =>
    s.customQuestions.find((q) => q.id === id)
  )
  const fromResume = useLearnerStore((s) =>
    s.resumeQuestions.find((q) => q.id === id)
  )
  if (custom) return <CustomQuestionPage question={custom} />
  if (fromResume) return <ResumeQuestionPage question={fromResume} />
  return <CuratedQuestionPage />
}
