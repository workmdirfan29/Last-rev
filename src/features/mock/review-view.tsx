import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { MockItem } from "@/services/mock/items"
import { hasAnswer } from "@/services/mock/score"
import type { MockSession } from "@/types/learner"
import { RatingPanel } from "./rating-panel"
import { ShortcutsPopover } from "./shortcuts-popover"
import { useMockActions } from "./use-session"

/**
 * The untimed review after the interview: for each question you answered, reveal the model answer, tick the
 * key points you covered and rate yourself. Nothing here is timed, and nothing is rated for you.
 */
export function ReviewView({
  session,
  items,
  onDone,
}: {
  session: MockSession
  items: ReadonlyMap<string, MockItem>
  onDone: () => void
}) {
  const actions = useMockActions(session.id)
  const indices = session.answers.flatMap((a, i) => (hasAnswer(a) ? [i] : []))
  const [pos, setPos] = useState(() => {
    const first = indices.findIndex(
      (i) => Object.keys(session.answers[i].ratings).length === 0
    )
    return Math.max(0, first)
  })
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set())
  const index = indices[Math.min(pos, indices.length - 1)]
  const answer = session.answers[index]
  const item = items.get(answer.questionId)!
  const unrated = indices.filter(
    (i) => Object.keys(session.answers[i].ratings).length === 0
  ).length
  const isRevealed =
    revealed.has(answer.questionId) || Object.keys(answer.ratings).length > 0

  const reveal = useCallback(
    () => setRevealed((r) => new Set(r).add(answer.questionId)),
    [answer.questionId]
  )
  const done = useCallback(async () => {
    await actions.finish()
    onDone()
  }, [actions, onDone])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (
        t?.closest?.(
          "input, textarea, select, [contenteditable='true'], [role='dialog']"
        ) ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      )
        return
      const k = e.key.toLowerCase()
      if (k === "r") reveal()
      else if (k === "n" || k === "arrowright")
        setPos((p) => Math.min(indices.length - 1, p + 1))
      else if (k === "p" || k === "arrowleft") setPos((p) => Math.max(0, p - 1))
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [reveal, indices.length])

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-28 md:pb-6">
      <header className="space-y-1">
        <p className="lr-eyebrow">Review · not timed</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Rate your answers
        </h1>
        <p
          className="text-sm text-muted-foreground"
          data-testid="review-position"
        >
          Question {Math.min(pos, indices.length - 1) + 1} of {indices.length}{" "}
          answered · {unrated} not rated yet
        </p>
      </header>

      <h2 className="font-heading text-xl font-semibold text-balance">
        {item.title}
      </h2>
      <RatingPanel
        key={answer.questionId}
        item={item}
        answer={answer}
        revealed={isRevealed}
        onReveal={reveal}
        onChange={(patch) => void actions.patchAnswer(index, patch)}
      />

      <div className="sticky bottom-16 z-10 -mx-4 flex flex-wrap items-center gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
        <Button
          type="button"
          variant="outline"
          disabled={pos === 0}
          onClick={() => setPos((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pos >= indices.length - 1}
          onClick={() => setPos((p) => p + 1)}
        >
          Next
        </Button>
        <Button type="button" className="ms-auto" onClick={() => void done()}>
          See results
        </Button>
      </div>
      <ShortcutsPopover />
    </div>
  )
}
