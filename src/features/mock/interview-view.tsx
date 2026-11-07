import { useCallback, useEffect, useRef, useState } from "react"
import {
  LightbulbIcon,
  PauseIcon,
  PlayIcon,
  SkipForwardIcon,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { countWords } from "@/data/hr/guidance"
import { cn } from "@/lib/utils"
import type { MockItem } from "@/services/mock/items"
import { hasAnswer } from "@/services/mock/score"
import {
  formatClock,
  guideSeconds,
  durationSeconds,
} from "@/services/mock/session"
import type { MockSession } from "@/types/learner"
import { RatingPanel } from "./rating-panel"
import { ShortcutsPopover } from "./shortcuts-popover"
import { useMockActions } from "./use-session"

/** Where the countdown stands, in words, only at a few moments (so a screen reader is not read the seconds). */
export function timeAnnouncement(left: number, total: number): string {
  if (left <= 0) return "Time is up."
  if (left <= 60) return "One minute left."
  if (total > 600 && left <= 300) return "Five minutes left."
  if (total > 120 && left <= total / 2) return "Half of the time has passed."
  return ""
}

const isTyping = (t: EventTarget | null) =>
  !!(t as HTMLElement | null)?.closest?.(
    "input, textarea, select, [contenteditable='true'], [role='dialog']"
  )

/**
 * The timed part: one question at a time, a typed answer, an optional hint, skip and jump. The countdown runs
 * only while the interview is running; pausing hides the question, and in "rate after each answer" mode the
 * timer stops while you rate.
 */
export function InterviewView({
  session,
  items,
  onFinished,
}: {
  session: MockSession
  items: ReadonlyMap<string, MockItem>
  /** Called with true when the review comes next, false when the session is finished. */
  onFinished: (toReview: boolean) => void
}) {
  const actions = useMockActions(session.id)
  const total = durationSeconds(session.config)
  const last = session.questionIds.length - 1
  const cur = Math.min(session.current, last)
  const answer = session.answers[cur]
  const item = items.get(answer.questionId)!

  // A session reopened after a reload starts paused: nothing counted while the page was closed.
  const [paused, setPaused] = useState(session.elapsedSeconds > 0)
  const [elapsed, setElapsed] = useState(session.elapsedSeconds)
  const [spent, setSpent] = useState<Record<number, number>>({})
  const [draft, setDraft] = useState(answer.text)
  const [hintOpen, setHintOpen] = useState(false)
  const [ratingFor, setRatingFor] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const elapsedRef = useRef(session.elapsedSeconds)
  const spentRef = useRef<Record<number, number>>({})
  const curRef = useRef(cur)
  const draftRef = useRef(draft)
  const dirtyRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sessionRef = useRef(session)
  useEffect(() => {
    sessionRef.current = session
    curRef.current = cur
  })

  const saveText = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    if (!dirtyRef.current) return
    dirtyRef.current = false
    void actions.patchAnswer(curRef.current, {
      text: draftRef.current,
      visited: true,
    })
  }, [actions])
  const flushedRef = useRef(session.elapsedSeconds)
  const flushTime = useCallback(() => {
    // Nothing to write when no second has passed since the last write.
    if (elapsedRef.current === flushedRef.current) return
    flushedRef.current = elapsedRef.current
    void actions.flushTime(elapsedRef.current, spentRef.current)
  }, [actions])

  const running = !paused && ratingFor === null && !finishing

  const finishInterview = useCallback(async () => {
    setFinishing(true)
    saveText()
    flushTime()
    onFinished(await actions.endInterview(items))
  }, [actions, items, onFinished, saveText, flushTime])

  // The countdown: one tick a second while running; written to the session every five seconds.
  useEffect(() => {
    if (!running) return
    let ticks = 0
    const id = setInterval(() => {
      elapsedRef.current += 1
      const c = curRef.current
      spentRef.current[c] =
        (spentRef.current[c] ?? sessionRef.current.answers[c].secondsSpent) + 1
      setElapsed(elapsedRef.current)
      setSpent({ ...spentRef.current })
      if (++ticks % 5 === 0) flushTime()
      if (elapsedRef.current >= total) {
        clearInterval(id)
        void finishInterview()
      }
    }, 1000)
    return () => {
      clearInterval(id)
      flushTime()
    }
  }, [running, total, flushTime, finishInterview])

  // Leaving the page saves what was typed; a hidden tab pauses the countdown.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") setPaused(true)
    }
    document.addEventListener("visibilitychange", onHide)
    return () => {
      document.removeEventListener("visibilitychange", onHide)
      saveText()
    }
  }, [saveText])

  function onText(value: string) {
    setDraft(value)
    draftRef.current = value
    dirtyRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(saveText, 600)
  }

  const go = useCallback(
    (index: number) => {
      saveText()
      const next = Math.max(0, Math.min(last, index))
      const a = sessionRef.current.answers[next]
      curRef.current = next
      setDraft(a.text)
      draftRef.current = a.text
      setHintOpen(false)
      setRatingFor(null)
      setRevealed(false)
      void actions.patch({ current: next })
      void actions.patchAnswer(next, { visited: true })
    },
    [actions, last, saveText]
  )

  const advance = useCallback(() => {
    if (cur < last) go(cur + 1)
    else setConfirmFinish(true)
  }, [cur, last, go])

  const saveAndNext = useCallback(() => {
    saveText()
    const text = draftRef.current.trim()
    if (
      session.config.ratingMode === "each" &&
      text !== "" &&
      ratingFor === null
    ) {
      void actions.patchAnswer(cur, { text: draftRef.current, visited: true })
      setRatingFor(cur)
      setRevealed(false)
      return
    }
    advance()
  }, [session.config.ratingMode, ratingFor, cur, actions, advance, saveText])

  const skip = useCallback(() => {
    if (draftRef.current.trim() === "")
      void actions.patchAnswer(cur, { skipped: true, visited: true })
    advance()
  }, [cur, actions, advance])

  const toggleHint = useCallback(() => {
    if (!session.config.hints || !item.hint) return
    setHintOpen((o) => !o)
    if (!answer.hintUsed) void actions.patchAnswer(cur, { hintUsed: true })
  }, [session.config.hints, item.hint, answer.hintUsed, cur, actions])

  // Keyboard: single keys only outside the answer box; Ctrl+Enter and Esc work while typing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (!paused) saveAndNext()
        return
      }
      if (e.key === "Escape" && isTyping(e.target)) {
        ;(e.target as HTMLElement).blur()
        return
      }
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey || paused)
        return
      const k = e.key.toLowerCase()
      if (ratingFor !== null) {
        if (k === "r") setRevealed(true)
        else if (k === "n" || k === "arrowright") advance()
        return
      }
      if (k === "n" || k === "arrowright") saveAndNext()
      else if (k === "p" || k === "arrowleft") go(cur - 1)
      else if (k === "h") toggleHint()
      else if (k === "s") skip()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [paused, ratingFor, cur, saveAndNext, advance, go, toggleHint, skip])

  const left = Math.max(0, total - elapsed)
  const answeredCount = session.answers.filter((a, i) =>
    hasAnswer(i === cur ? { ...a, text: draft } : a)
  ).length
  const unanswered = session.questionIds.length - answeredCount
  const spentNow = spent[cur] ?? answer.secondsSpent

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-28 md:pb-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium" data-testid="position">
            Question {cur + 1} of {session.questionIds.length}
          </p>
          <div className="flex items-center gap-2">
            <p
              role="timer"
              aria-label="Time left"
              className="rounded-md border border-border px-2.5 py-1 font-mono text-sm tabular-nums"
              data-testid="clock"
            >
              {formatClock(left)} left
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                saveText()
                setPaused((p) => !p)
              }}
              disabled={ratingFor !== null}
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
              {paused ? "Resume" : "Pause"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground" data-testid="tracker">
          {answeredCount} answered · {unanswered} unanswered
          {session.config.perQuestionGuide &&
            ` · guide: about ${Math.max(1, Math.round(guideSeconds(session) / 60))} min a question`}
        </p>
        <ol className="flex flex-wrap gap-1.5" aria-label="Questions">
          {session.answers.map((a, i) => {
            const done = hasAnswer(i === cur ? { ...a, text: draft } : a)
            const state = done
              ? "answered"
              : a.skipped
                ? "skipped"
                : "unanswered"
            return (
              <li key={a.questionId}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === cur ? "step" : undefined}
                  aria-label={`Question ${i + 1}, ${state}${i === cur ? ", current" : ""}`}
                  className={cn(
                    "size-7 rounded-md border text-xs tabular-nums transition-colors",
                    i === cur && "ring-2 ring-primary",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : a.skipped
                        ? "border-warning/60 bg-warning/10"
                        : "border-border"
                  )}
                >
                  {i + 1}
                </button>
              </li>
            )
          })}
        </ol>
        <p className="sr-only" role="status" aria-live="polite">
          {timeAnnouncement(left, total)}
        </p>
      </header>

      {paused ? (
        <section
          aria-label="Paused"
          className="space-y-3 rounded-xl border border-dashed border-border p-8 text-center"
        >
          <p className="text-sm font-medium">Paused</p>
          <p className="text-sm text-muted-foreground">
            The question is hidden until you resume. Time spent paused is not
            part of the countdown.
          </p>
          <Button onClick={() => setPaused(false)}>
            <PlayIcon /> Resume
          </Button>
        </section>
      ) : ratingFor !== null ? (
        <section className="space-y-4">
          <p
            role="status"
            className="rounded-md border border-border bg-muted/40 p-2 text-xs"
          >
            Timer paused while you rate.
          </p>
          <h2 className="font-heading text-xl font-semibold text-balance">
            {item.title}
          </h2>
          <RatingPanel
            item={item}
            answer={answer}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
            onChange={(patch) => void actions.patchAnswer(cur, patch)}
          />
          <Button size="lg" onClick={advance}>
            {cur < last ? "Next question" : "Finish interview"}
          </Button>
        </section>
      ) : (
        <section className="space-y-4">
          <h2
            className="font-heading text-xl font-semibold tracking-tight text-balance sm:text-2xl"
            data-testid="question-title"
          >
            {item.title}
          </h2>
          {session.config.hints && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleHint}
                disabled={!item.hint}
                aria-expanded={hintOpen}
              >
                <LightbulbIcon /> {hintOpen ? "Hide hint" : "Hint"}
                <kbd className="ms-1 rounded border border-border px-1 text-[0.625rem]">
                  H
                </kbd>
              </Button>
              {!item.hint && (
                <span className="ms-2 text-xs text-muted-foreground">
                  No hint for this question.
                </span>
              )}
              {hintOpen && item.hint && (
                <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                  {item.hint}
                </p>
              )}
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="mock-answer" className="text-sm font-medium">
              Your answer
            </label>
            <Textarea
              id="mock-answer"
              rows={9}
              value={draft}
              onChange={(e) => onText(e.target.value)}
              placeholder="Type your answer as you would say it."
              autoFocus
            />
            <p className="flex justify-between text-xs text-muted-foreground tabular-nums">
              <span>
                {countWords(draft)} {countWords(draft) === 1 ? "word" : "words"}
              </span>
              <span>On this question: {formatClock(spentNow)}</span>
            </p>
          </div>
        </section>
      )}

      {!paused && ratingFor === null && (
        <div className="sticky bottom-16 z-10 -mx-4 flex flex-wrap items-center gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => go(cur - 1)}
            disabled={cur === 0}
          >
            Previous
          </Button>
          <Button type="button" variant="outline" onClick={skip}>
            <SkipForwardIcon /> Skip
          </Button>
          <Button type="button" onClick={saveAndNext} className="ms-auto">
            {cur < last ? "Save and next" : "Save and finish"}
            <kbd className="ms-1 hidden rounded border border-primary-foreground/40 px-1 text-[0.625rem] md:inline">
              Ctrl+Enter
            </kbd>
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <ShortcutsPopover />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            saveText()
            setConfirmFinish(true)
          }}
        >
          Finish interview
        </Button>
      </div>

      <AlertDialog open={confirmFinish} onOpenChange={setConfirmFinish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish the interview?</AlertDialogTitle>
            <AlertDialogDescription>
              {unanswered > 0
                ? `${unanswered} ${unanswered === 1 ? "question is" : "questions are"} unanswered. They stay unanswered and have no points. `
                : ""}
              Next you review the model answers and rate your own answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep going</AlertDialogCancel>
            <AlertDialogAction onClick={() => void finishInterview()}>
              Finish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
