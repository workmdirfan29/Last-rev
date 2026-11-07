import { useId, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  COMFORTABLE_ANSWER_SECONDS,
  SELF_CHECK_ITEMS,
  SELF_CHECK_NOTE,
  STAR_FIELDS,
  STAR_GUIDELINE_NOTE,
  SPEAKING_WORDS_PER_MINUTE,
  countWords,
  formatSeconds,
  speakSeconds,
} from "@/data/hr/guidance"
import { useLearnerStore } from "@/stores/learner-store"
import type { Question } from "@/types/content"
import {
  HR_ANSWER_FIELD_MAX,
  HR_ANSWER_FIELDS,
  type HrAnswer,
  type HrAnswerField,
} from "@/types/learner"

interface Draft {
  title: string
  fields: Record<HrAnswerField, string>
  ticks: string[]
}

const EMPTY: Draft = {
  title: "",
  fields: { situation: "", task: "", action: "", result: "" },
  ticks: [],
}

const draftKey = (questionId: string) => `lastrev:hr-draft:${questionId}`

/** The unsaved draft for a new answer is kept on this device, so leaving the page does not lose it. */
function readDraft(questionId: string): Draft {
  try {
    const raw = localStorage.getItem(draftKey(questionId))
    if (raw) {
      const d = JSON.parse(raw) as Partial<Draft>
      return {
        title: typeof d.title === "string" ? d.title : "",
        fields: { ...EMPTY.fields, ...(d.fields ?? {}) },
        ticks: Array.isArray(d.ticks) ? d.ticks : [],
      }
    }
  } catch {
    /* no draft */
  }
  return EMPTY
}
function writeDraft(questionId: string, draft: Draft | null) {
  try {
    if (draft) localStorage.setItem(draftKey(questionId), JSON.stringify(draft))
    else localStorage.removeItem(draftKey(questionId))
  } catch {
    /* storage unavailable: the draft just is not kept */
  }
}

const fromAnswer = (a: HrAnswer): Draft => ({
  title: a.title,
  fields: {
    situation: a.situation,
    task: a.task,
    action: a.action,
    result: a.result,
  },
  ticks: a.selfCheck,
})

/** The self-check items for a question: the shared list, then any the question adds. */
export function selfCheckItemsFor(question: Pick<Question, "selfCheck">) {
  return [
    ...SELF_CHECK_ITEMS,
    ...(question.selfCheck ?? []).map((label, i) => ({ id: `q-${i}`, label })),
  ]
}

/**
 * Write your own answer in four STAR parts, with guidance, a word count per part and a speaking-time hint.
 * Mount with a `key` that changes with the answer being edited, so the form starts fresh.
 */
export function StarBuilder({
  question,
  editing,
  onFinished,
}: {
  question: Pick<Question, "id" | "starPrompts" | "selfCheck">
  /** The saved answer being edited, or none for a new one. */
  editing: HrAnswer | null
  onFinished: () => void
}) {
  const addHrAnswer = useLearnerStore((s) => s.addHrAnswer)
  const updateHrAnswer = useLearnerStore((s) => s.updateHrAnswer)
  const [draft, setDraft] = useState<Draft>(() =>
    editing ? fromAnswer(editing) : readDraft(question.id)
  )
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const items = useMemo(() => selfCheckItemsFor(question), [question])

  const change = (next: Draft) => {
    setDraft(next)
    setError(null)
    if (!editing) writeDraft(question.id, next)
  }
  const words = HR_ANSWER_FIELDS.reduce(
    (n, f) => n + countWords(draft.fields[f]),
    0
  )
  const seconds = speakSeconds(words)

  async function save() {
    if (HR_ANSWER_FIELDS.every((f) => draft.fields[f].trim() === "")) {
      setError("Write something in at least one part before saving.")
      return
    }
    if (editing) {
      await updateHrAnswer(editing.id, {
        title: draft.title.trim(),
        ...draft.fields,
        selfCheck: draft.ticks,
      })
      toast("Answer updated")
    } else {
      await addHrAnswer({
        questionId: question.id,
        title: draft.title,
        ...draft.fields,
        selfCheck: draft.ticks,
      })
      writeDraft(question.id, null)
      setDraft(EMPTY)
      toast("Saved to your answers")
    }
    onFinished()
  }

  return (
    <form
      aria-label={editing ? "Edit your answer" : "Build your answer"}
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-title`}>
          Name this answer{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id={`${id}-title`}
          maxLength={120}
          placeholder="e.g. Final-year project story"
          className="sm:max-w-sm"
          value={draft.title}
          onChange={(e) => change({ ...draft, title: e.target.value })}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {STAR_FIELDS.map((g) => {
          const text = draft.fields[g.field]
          const n = countWords(text)
          const hint = question.starPrompts?.[g.field]
          return (
            <div key={g.field} className="space-y-1.5">
              <Label htmlFor={`${id}-${g.field}`} className="gap-2">
                <span
                  aria-hidden
                  className="flex size-5 items-center justify-center rounded bg-primary/15 text-[0.6875rem] font-bold text-primary"
                >
                  {g.letter}
                </span>
                {g.label}
              </Label>
              <p
                id={`${id}-${g.field}-help`}
                className="text-xs text-muted-foreground"
              >
                {g.guidance}
                {hint && (
                  <>
                    {" "}
                    <span className="text-foreground">
                      For this question: {hint}
                    </span>
                  </>
                )}
              </p>
              <Textarea
                id={`${id}-${g.field}`}
                rows={4}
                maxLength={HR_ANSWER_FIELD_MAX}
                placeholder={g.placeholder}
                aria-describedby={`${id}-${g.field}-help ${id}-${g.field}-count`}
                value={text}
                onChange={(e) =>
                  change({
                    ...draft,
                    fields: { ...draft.fields, [g.field]: e.target.value },
                  })
                }
              />
              <p
                id={`${id}-${g.field}-count`}
                className="text-xs text-muted-foreground tabular-nums"
              >
                {n} {n === 1 ? "word" : "words"} · aim for {g.words[0]} to{" "}
                {g.words[1]}
              </p>
            </div>
          )
        })}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-border bg-muted/40 p-3 text-sm"
      >
        <span className="font-medium tabular-nums">
          {words} {words === 1 ? "word" : "words"}
        </span>
        {words > 0 && (
          <>
            {", about "}
            <span className="tabular-nums">{formatSeconds(seconds)}</span>{" "}
            spoken
            {seconds > COMFORTABLE_ANSWER_SECONDS &&
              ". That is longer than the two-minute guideline, so you may want to tighten it"}
            .
          </>
        )}
        <span className="mt-1 block text-xs text-muted-foreground">
          {STAR_GUIDELINE_NOTE} Time assumes about {SPEAKING_WORDS_PER_MINUTE}{" "}
          words a minute.
        </span>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          Self-check{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <p className="text-xs text-muted-foreground">{SELF_CHECK_NOTE}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => {
            const on = draft.ticks.includes(item.id)
            return (
              <li key={item.id} className="flex items-start gap-2">
                <Checkbox
                  id={`${id}-sc-${item.id}`}
                  checked={on}
                  onCheckedChange={(v) =>
                    change({
                      ...draft,
                      ticks:
                        v === true
                          ? [...draft.ticks, item.id]
                          : draft.ticks.filter((t) => t !== item.id),
                    })
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`${id}-sc-${item.id}`}
                  className="text-xs/relaxed font-normal"
                >
                  {item.label}
                </Label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit">
          {editing ? "Update answer" : "Save answer"}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={onFinished}>
            Cancel
          </Button>
        )}
        {!editing && (
          <p className="text-xs text-muted-foreground">
            Your draft stays on this device until you save.
          </p>
        )}
      </div>
    </form>
  )
}
