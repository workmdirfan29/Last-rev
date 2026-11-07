import { useMemo, useRef, useState } from "react"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { RichText } from "@/components/shared/rich-text"
import { Button } from "@/components/ui/button"
import { PASS_MARK_PERCENT } from "@/config/study"
import {
  makeAttempt,
  promptOf,
  scorePercent,
  type QuizItem,
} from "@/services/study/quiz"
import { useLearnerStore } from "@/stores/learner-store"
import type { QuizKind } from "@/types/learner"
import { newId } from "@/utils/id"
import { CheckItemView } from "./check-item"

/** What a score means, said once wherever a quiz result appears. */
export const SCORE_MEANING = `Score: the percentage of items answered correctly. Pass mark: at least ${PASS_MARK_PERCENT}% correct on this set.`

/**
 * Runs a list of quiz items one at a time and keeps the attempt when it ends (item ids and whether each was
 * right; never what was typed). The parent changes `seed` (and passes new items) to retake.
 */
export function QuizRunner({
  items,
  quizId,
  kind,
  seed,
  onRetake,
}: {
  items: readonly QuizItem[]
  quizId: string
  kind: QuizKind
  seed: number
  onRetake: () => void
}) {
  const record = useLearnerStore((s) => s.recordQuizAttempt)
  const [index, setIndex] = useState(0)
  const results = useRef<{ key: string; correct: boolean }[]>([])
  const [done, setDone] = useState<ReturnType<typeof makeAttempt> | null>(null)

  const finish = () => {
    const attempt = makeAttempt({
      id: newId("att"),
      quizId,
      kind,
      seed,
      takenAt: new Date(),
      results: results.current,
    })
    setDone(attempt)
    void record(attempt)
  }

  const byKey = useMemo(() => new Map(items.map((i) => [i.key, i])), [items])

  if (done)
    return (
      <div className="space-y-4" data-testid="quiz-result">
        <div role="status" aria-live="polite" className="space-y-1">
          <p className="text-lg font-semibold tabular-nums">
            {done.correct} of {done.total} correct ({scorePercent(done)}%)
          </p>
          <p className="text-sm">
            {done.passed
              ? `You reached the pass mark of ${PASS_MARK_PERCENT}%.`
              : `The pass mark is ${PASS_MARK_PERCENT}%. You can try again.`}
          </p>
          <p className="text-xs text-muted-foreground">{SCORE_MEANING}</p>
        </div>
        <ul className="space-y-1.5 text-sm" aria-label="Items in this quiz">
          {done.items.map((r) => {
            const qi = byKey.get(r.itemId)
            return (
              <li key={r.itemId} className="flex items-start gap-2">
                {r.correct ? (
                  <CheckCircle2Icon
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-label="Correct"
                  />
                ) : (
                  <XCircleIcon
                    className="mt-0.5 size-4 shrink-0 text-warning"
                    aria-label="Not correct"
                  />
                )}
                <span>
                  {qi ? <RichText text={promptOf(qi.item)} /> : r.itemId}
                </span>
              </li>
            )
          })}
        </ul>
        <Button type="button" onClick={onRetake}>
          Try again with a new set
        </Button>
      </div>
    )

  const qi = items[index]
  if (!qi) return null
  const last = index === items.length - 1
  return (
    <div className="space-y-3">
      <p
        className="text-xs text-muted-foreground tabular-nums"
        data-testid="quiz-position"
      >
        Item {index + 1} of {items.length}
      </p>
      <CheckItemView
        key={qi.key}
        qi={qi}
        nextLabel={last ? "See the result" : "Next item"}
        onChecked={(ok) => {
          results.current = [...results.current, { key: qi.key, correct: ok }]
        }}
        onNext={() => (last ? finish() : setIndex(index + 1))}
      />
    </div>
  )
}
