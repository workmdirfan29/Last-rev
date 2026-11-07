import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Exercise } from "@/services/english/exercises"
import { ExerciseCard } from "./exercise-card"
import { SpeakingPanel } from "./speaking-panel"
import { useEnglishActions } from "./use-english"

export interface SessionResult {
  total: number
  correct: number
}

/** Runs a list of exercises one at a time. A correct answer counts a pass toward "learned" (two passes); a wrong one changes nothing. */
export function ExerciseSession({
  exercises,
  onDone,
  doneLabel = "Finish",
}: {
  exercises: readonly Exercise[]
  onDone: (r: SessionResult) => void
  doneLabel?: string
}) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const { recordPass } = useEnglishActions()
  const ex = exercises[index]
  if (!ex) return null
  const last = index === exercises.length - 1
  const itemIds = ex.kind === "match" ? ex.itemIds : [ex.itemId]
  const scored = exercises.filter((e) => e.kind !== "speak").length

  const advance = (gained: number) => {
    if (last) onDone({ total: scored, correct: correct + gained })
    else setIndex(index + 1)
  }

  return (
    <div className="space-y-3">
      <p
        className="text-xs text-muted-foreground"
        data-testid="session-position"
      >
        Exercise {index + 1} of {exercises.length}
      </p>
      {ex.kind === "speak" ? (
        <div className="space-y-3">
          <SpeakingPanel
            key={ex.id}
            target={ex.target}
            hi={ex.hi}
            itemId={ex.itemId}
          />
          <Button type="button" onClick={() => advance(0)}>
            {last ? doneLabel : "Next"}
          </Button>
        </div>
      ) : (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          nextLabel={last ? doneLabel : "Next"}
          onResult={(ok) => {
            if (ok) {
              setCorrect((c) => c + 1)
              void recordPass(itemIds)
            }
          }}
          onNext={() => advance(0)}
        />
      )}
    </div>
  )
}
