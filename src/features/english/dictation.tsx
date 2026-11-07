import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { checkExercise, type CheckResult } from "@/services/english/exercises"
import type { EnglishItem } from "@/types/english"
import { En, Hi } from "./lang"
import { ListenControls } from "./listen-controls"
import { useEnglishActions } from "./use-english"
import type { SpeechController } from "./use-speech"

/** Listen, then type what you heard. Checked like any typed answer; needs a browser voice. */
export function Dictation({
  items,
  speech,
  onDone,
}: {
  items: readonly Extract<EnglishItem, { kind: "sentence" }>[]
  speech: SpeechController
  onDone: (correct: number) => void
}) {
  const [i, setI] = useState(0)
  const [text, setText] = useState("")
  const [result, setResult] = useState<CheckResult | null>(null)
  const [correct, setCorrect] = useState(0)
  const { recordPass } = useEnglishActions()
  const item = items[i]
  if (!item) return null
  const last = i === items.length - 1

  function check() {
    const r = checkExercise(
      {
        kind: "type",
        id: `${item.id}#dictation`,
        itemId: item.id,
        prompt: item.hi,
        answer: item.en,
        accepted: item.accepted ?? [],
      },
      text
    )
    setResult(r)
    if (r.correct) {
      setCorrect((c) => c + 1)
      void recordPass([item.id])
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!result && text.trim()) check()
      }}
    >
      <p
        className="text-xs text-muted-foreground"
        data-testid="session-position"
      >
        Sentence {i + 1} of {items.length}
      </p>
      <ListenControls speech={speech} text={item.en} />
      <div className="space-y-2">
        <Label htmlFor="dictation">Type the sentence you heard</Label>
        <Input
          id="dictation"
          lang="en-IN"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={text}
          disabled={!!result}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      {!result ? (
        <Button type="submit" disabled={!text.trim()}>
          Check
        </Button>
      ) : (
        <Button
          type="button"
          autoFocus
          onClick={() => {
            if (last) onDone(correct)
            else {
              setI(i + 1)
              setText("")
              setResult(null)
            }
          }}
        >
          {last ? "Finish" : "Next"}
        </Button>
      )}
      <div role="status" aria-live="polite" data-testid="result">
        {result &&
          (result.correct ? (
            <p className="text-sm font-medium">Correct</p>
          ) : (
            <p className="text-sm font-medium">
              Not quite. The sentence is: <En>{result.expected}</En>{" "}
              <Hi className="text-muted-foreground">({item.hi})</Hi>
            </p>
          ))}
      </div>
    </form>
  )
}
