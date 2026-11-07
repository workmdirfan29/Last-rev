import { useState } from "react"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  checkExercise,
  type CheckResult,
  type Exercise,
} from "@/services/english/exercises"
import { En, Hi } from "./lang"

/**
 * One text exercise. The answer is checked by exact match after normalising (case, punctuation, contractions),
 * so "correct" and "not quite" are objective. The result is announced in a live region and always has text and
 * an icon, never colour alone. Everything works with the keyboard.
 */
export function ExerciseCard({
  exercise,
  onResult,
  onNext,
  nextLabel = "Next",
}: {
  exercise: Exercise
  onResult: (correct: boolean) => void
  onNext: () => void
  nextLabel?: string
}) {
  const [text, setText] = useState("")
  const [picked, setPicked] = useState<string | null>(null)
  const [order, setOrder] = useState<number[]>([])
  const [pairs, setPairs] = useState<Record<number, number>>({})
  const [selectedEn, setSelectedEn] = useState<number | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)

  function submit(response: string | readonly number[]) {
    if (result) return
    const r = checkExercise(exercise, response)
    setResult(r)
    onResult(r.correct)
  }

  const typed = exercise.kind === "type" || exercise.kind === "blank"
  const canCheck =
    result === null &&
    ((typed && text.trim() !== "") ||
      (exercise.kind === "choose" && picked !== null) ||
      (exercise.kind === "arrange" &&
        order.length === exercise.tokens.length) ||
      (exercise.kind === "match" &&
        Object.keys(pairs).length === exercise.pairs.length))

  const response = (): string | readonly number[] =>
    exercise.kind === "arrange"
      ? order.map((i) => exercise.tokens[i]).join(" ")
      : exercise.kind === "choose"
        ? (picked ?? "")
        : exercise.kind === "match"
          ? exercise.pairs.map((_, i) => pairs[i] ?? -1)
          : text

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (canCheck) submit(response())
      }}
    >
      {exercise.kind === "type" && (
        <div className="space-y-2">
          <Label htmlFor="answer">Type this in English</Label>
          <Hi as="p" className="text-lg">
            {exercise.prompt}
          </Hi>
          <Input
            id="answer"
            lang="en-IN"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={text}
            disabled={!!result}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}

      {exercise.kind === "blank" && (
        <div className="space-y-2">
          <Label htmlFor="answer">Fill in the missing word</Label>
          <En as="p" className="text-lg">
            {exercise.text}
          </En>
          <Input
            id="answer"
            lang="en-IN"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="max-w-xs"
            value={text}
            disabled={!!result}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}

      {exercise.kind === "choose" && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Choose the right word</legend>
          <En as="p" className="text-lg">
            {exercise.prompt}
          </En>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Options"
          >
            {exercise.options.map((o) => (
              <Button
                key={o}
                type="button"
                role="radio"
                aria-checked={picked === o}
                variant={picked === o ? "default" : "outline"}
                disabled={!!result}
                onClick={() => setPicked(o)}
              >
                <En>{o}</En>
              </Button>
            ))}
          </div>
        </fieldset>
      )}

      {exercise.kind === "arrange" && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Put the words in order</p>
          <Hi as="p" className="text-base text-muted-foreground">
            {exercise.hi}
          </Hi>
          <p
            className="min-h-9 rounded-lg border border-dashed border-border p-2 text-lg"
            aria-label="Your sentence"
            data-testid="arranged"
          >
            <En>{order.map((i) => exercise.tokens[i]).join(" ") || "..."}</En>
          </p>
          <div className="flex flex-wrap gap-2" aria-label="Words">
            {exercise.tokens.map((t, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                disabled={order.includes(i) || !!result}
                onClick={() => setOrder([...order, i])}
              >
                <En>{t}</En>
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={order.length === 0 || !!result}
              onClick={() => setOrder(order.slice(0, -1))}
            >
              Undo last word
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={order.length === 0 || !!result}
              onClick={() => setOrder([])}
            >
              Start again
            </Button>
          </div>
        </div>
      )}

      {exercise.kind === "match" && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Match each English line to its Hindi meaning: choose an English
            line, then its Hindi.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ul className="space-y-2" aria-label="English">
              {exercise.pairs.map((p, i) => (
                <li key={i}>
                  <Button
                    type="button"
                    variant={selectedEn === i ? "default" : "outline"}
                    className="h-auto w-full justify-start py-2 text-start whitespace-normal"
                    disabled={!!result || pairs[i] !== undefined}
                    aria-pressed={selectedEn === i}
                    onClick={() => setSelectedEn(i)}
                  >
                    <En>{p.en}</En>
                    {pairs[i] !== undefined && (
                      <Hi className="ms-auto text-xs text-muted-foreground">
                        {exercise.pairs[pairs[i]].hi}
                      </Hi>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
            <ul className="space-y-2" aria-label="Hindi">
              {exercise.hiOrder.map((idx) => (
                <li key={idx}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto w-full justify-start py-2 text-start whitespace-normal"
                    disabled={
                      !!result ||
                      selectedEn === null ||
                      Object.values(pairs).includes(idx)
                    }
                    onClick={() => {
                      if (selectedEn === null) return
                      setPairs({ ...pairs, [selectedEn]: idx })
                      setSelectedEn(null)
                    }}
                  >
                    <Hi>{exercise.pairs[idx].hi}</Hi>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          {!result && Object.keys(pairs).length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPairs({})
                setSelectedEn(null)
              }}
            >
              Start again
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!result ? (
          <Button type="submit" disabled={!canCheck}>
            Check
          </Button>
        ) : (
          <Button type="button" onClick={onNext} autoFocus>
            {nextLabel}
          </Button>
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        data-testid="result"
        className={cn(
          result && "rounded-lg border p-3",
          result?.correct
            ? "border-success/50"
            : result
              ? "border-warning/60"
              : ""
        )}
      >
        {result &&
          (result.correct ? (
            <p className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2Icon className="size-4 text-success" aria-hidden />{" "}
              Correct
            </p>
          ) : (
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-medium">
                <XCircleIcon className="size-4 text-warning" aria-hidden /> Not
                quite. The answer is: <En>{result.expected}</En>
              </p>
              {result.diff.length > 0 && (
                <p
                  className="flex flex-wrap gap-1.5 text-sm"
                  aria-label="Words of the answer you gave"
                >
                  {result.diff.map((d, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded border px-1.5 py-0.5",
                        d.status === "ok"
                          ? "border-success/50"
                          : "border-warning/60 underline"
                      )}
                    >
                      {d.status === "ok" ? "✓ " : "✗ "}
                      <En>{d.word}</En>
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
      </div>
    </form>
  )
}
