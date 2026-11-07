import { useState } from "react"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { CodeBlock } from "@/components/shared/code-block"
import { RichText } from "@/components/shared/rich-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  correctAnswerText,
  gradeItem,
  promptOf,
  type QuizItem,
  type Response,
} from "@/services/study/quiz"

/**
 * One knowledge-check item. Scored by exact comparison; after Check it shows the correct answer and the item's
 * explanation, right or wrong, in a live region, always as text plus an icon (never colour alone). Every control
 * works with the keyboard.
 */
export function CheckItemView({
  qi,
  onChecked,
  onNext,
  nextLabel,
}: {
  qi: QuizItem
  onChecked: (correct: boolean) => void
  onNext: () => void
  nextLabel: string
}) {
  const { item, order } = qi
  const [single, setSingle] = useState<number | null>(null)
  const [multi, setMulti] = useState<number[]>([])
  const [tf, setTf] = useState<boolean | null>(null)
  const [text, setText] = useState("")
  const [result, setResult] = useState<boolean | null>(null)

  const response = (): Response | null =>
    item.type === "single" || item.type === "output"
      ? single
      : item.type === "multi"
        ? multi
        : item.type === "truefalse"
          ? tf
          : text
  const ready =
    item.type === "multi"
      ? multi.length > 0
      : item.type === "blank"
        ? text.trim() !== ""
        : response() !== null
  const locked = result !== null

  function check() {
    if (locked || !ready) return
    const ok = gradeItem(item, response())
    setResult(ok)
    onChecked(ok)
  }

  const optionState = (original: number) => {
    if (!locked) return null
    const isAnswer =
      item.type === "multi"
        ? item.answers.includes(original)
        : "answer" in item && item.answer === original
    const chosen =
      item.type === "multi" ? multi.includes(original) : single === original
    return { isAnswer, chosen }
  }

  return (
    <form
      data-item-key={qi.key}
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        check()
      }}
    >
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">
          {item.type === "blank"
            ? "Fill in the blank"
            : item.type === "truefalse"
              ? "True or false?"
              : item.type === "multi"
                ? "Choose all that are correct"
                : "Choose one answer"}
        </legend>
        <p className="lr-prose">
          <RichText text={promptOf(item)} />
        </p>
        {item.type === "single" && item.code && (
          <CodeBlock code={item.code.code} language={item.code.language} />
        )}
        {item.type === "output" && (
          <CodeBlock code={item.code.code} language={item.code.language} />
        )}

        {"options" in item && (
          <div
            className="space-y-2"
            role={item.type === "multi" ? "group" : "radiogroup"}
            aria-label="Options"
          >
            {order.map((original) => {
              const st = optionState(original)
              const picked =
                item.type === "multi"
                  ? multi.includes(original)
                  : single === original
              return (
                <label
                  key={original}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                    picked && !locked && "border-primary bg-primary/5",
                    st?.isAnswer && "border-success/60",
                    st?.chosen && !st.isAnswer && "border-warning/70"
                  )}
                >
                  <input
                    type={item.type === "multi" ? "checkbox" : "radio"}
                    name={qi.key}
                    className="mt-0.5 size-4 accent-[var(--primary)]"
                    checked={picked}
                    disabled={locked}
                    onChange={() => {
                      if (item.type === "multi")
                        setMulti((m) =>
                          m.includes(original)
                            ? m.filter((x) => x !== original)
                            : [...m, original]
                        )
                      else setSingle(original)
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <RichText text={item.options[original]} />
                  </span>
                  {st?.isAnswer && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                      <CheckCircle2Icon
                        className="size-3.5 text-success"
                        aria-hidden
                      />
                      Correct answer
                    </span>
                  )}
                  {st?.chosen && !st.isAnswer && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                      <XCircleIcon
                        className="size-3.5 text-warning"
                        aria-hidden
                      />
                      Your answer
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        )}

        {item.type === "truefalse" && (
          <div
            className="flex gap-2"
            role="radiogroup"
            aria-label="True or false"
          >
            {[true, false].map((v) => (
              <Button
                key={String(v)}
                type="button"
                role="radio"
                aria-checked={tf === v}
                variant={tf === v ? "default" : "outline"}
                disabled={locked}
                onClick={() => setTf(v)}
              >
                {v ? "True" : "False"}
              </Button>
            ))}
          </div>
        )}

        {item.type === "blank" && (
          <div className="space-y-1.5">
            <Label htmlFor={`blank-${qi.key}`}>Your answer</Label>
            <Input
              id={`blank-${qi.key}`}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="max-w-xs font-mono"
              value={text}
              disabled={locked}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        {!locked ? (
          <Button type="submit" disabled={!ready}>
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
        data-testid="check-result"
        className={cn(
          result !== null && "space-y-1.5 rounded-lg border p-3 text-sm",
          result === true && "border-success/50",
          result === false && "border-warning/60"
        )}
      >
        {result !== null && (
          <>
            <p className="flex items-center gap-2 font-medium">
              {result ? (
                <>
                  <CheckCircle2Icon
                    className="size-4 text-success"
                    aria-hidden
                  />{" "}
                  Correct
                </>
              ) : (
                <>
                  <XCircleIcon className="size-4 text-warning" aria-hidden />{" "}
                  Not quite. The answer is:{" "}
                  <span className="font-mono">{correctAnswerText(item)}</span>
                </>
              )}
            </p>
            <p className="lr-prose text-muted-foreground">
              <RichText text={item.explanation} />
            </p>
          </>
        )}
      </div>
    </form>
  )
}
