import { useState, type ReactNode } from "react"
import { CheckIcon } from "lucide-react"
import { CodeBlock } from "@/components/shared/code-block"
import { RichText } from "@/components/shared/rich-text"
import { Button } from "@/components/ui/button"
import { exerciseDone } from "@/services/study/progress"
import { useLearnerStore } from "@/stores/learner-store"
import { exerciseIdOf, type StudyExercise } from "@/types/lesson"

export const VIEWED = "[viewed the solution]"

/**
 * A coding exercise as the learner meets it in a lesson: task, starter code, hints, a reference solution on
 * request, and a self-check list. The code is NOT run by LastRev here, and the screen says so. (JavaScript
 * exercises that carry test cases can also be run in the isolated sandbox on the practice page.)
 */
export function ExerciseView({
  moduleId,
  lessonSlug,
  exercise,
  runner,
}: {
  moduleId: string
  lessonSlug: string
  exercise: StudyExercise
  /** The sandbox editor and its outcome, when this exercise can be run. Without it the exercise is self-check only. */
  runner?: { passed: boolean; node: ReactNode }
}) {
  const progress = useLearnerStore((s) => s.progress)
  const toggle = useLearnerStore((s) => s.toggleCompleted)
  const setNote = useLearnerStore((s) => s.setNote)
  const id = exerciseIdOf(moduleId, lessonSlug, exercise.slug)
  const done = exerciseDone(moduleId, lessonSlug, exercise.slug, progress)
  const [ticks, setTicks] = useState<boolean[]>(() =>
    exercise.checklist.map(() => false)
  )
  const [showSolution, setShowSolution] = useState(false)
  const [hints, setHints] = useState(0)
  const allTicked = ticks.every(Boolean)
  /** Opening the solution is noted on the exercise's record, so the progress page can say so honestly. */
  const markViewed = async () => {
    const note = progress[id]?.note ?? ""
    if (!note.includes(VIEWED))
      await setNote(id, note ? `${note}\n${VIEWED}` : VIEWED)
  }

  return (
    <article
      className="space-y-3 rounded-xl border border-border bg-card p-4"
      aria-label={`Exercise: ${exercise.title}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{exercise.title}</h3>
        <span className="rounded border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
          {runner
            ? "Runs in an isolated sandbox"
            : exercise.run
              ? "Can be run on the practice page"
              : "Not run by LastRev"}
        </span>
      </header>
      {exercise.task.map((t, i) => (
        <p key={i} className="lr-prose">
          <RichText text={t} />
        </p>
      ))}
      {runner ? (
        runner.node
      ) : (
        <CodeBlock
          code={exercise.starter}
          language={exercise.language}
          title="Starter code"
        />
      )}

      {exercise.hints.length > 0 && (
        <div className="space-y-1.5">
          {exercise.hints.slice(0, hints).map((h, i) => (
            <p
              key={i}
              className="lr-prose rounded-lg bg-secondary/40 p-2 text-sm"
            >
              <span className="font-medium">Hint {i + 1}: </span>
              <RichText text={h} />
            </p>
          ))}
          {hints < exercise.hints.length && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHints(hints + 1)}
            >
              Show hint {hints + 1} of {exercise.hints.length}
            </Button>
          )}
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Check your own solution</legend>
        {exercise.checklist.map((c, i) => (
          <label key={i} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-[var(--primary)]"
              checked={ticks[i]}
              onChange={(e) =>
                setTicks(ticks.map((t, j) => (j === i ? e.target.checked : t)))
              }
            />
            <span>
              <RichText text={c} />
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={done ? "default" : "outline"}
          aria-pressed={done}
          disabled={!done && !(runner ? runner.passed : allTicked)}
          onClick={() => void toggle(id, 0, "coding")}
        >
          <CheckIcon /> {done ? "Exercise done" : "Mark exercise done"}
        </Button>
        {!done && !(runner ? runner.passed : allTicked) && (
          <span className="text-xs text-muted-foreground">
            {runner ? "Pass every test case first." : "Tick every item first."}
          </span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!showSolution) void markViewed()
            setShowSolution(!showSolution)
          }}
          aria-expanded={showSolution}
        >
          {showSolution ? "Hide the solution" : "Show the reference solution"}
        </Button>
      </div>
      {showSolution && (
        <CodeBlock
          code={exercise.solution}
          language={exercise.language}
          title="Reference solution"
        />
      )}
    </article>
  )
}
