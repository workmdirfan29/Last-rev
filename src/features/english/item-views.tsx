import { useState, type ReactNode } from "react"
import { BookmarkIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { exercisesForItem } from "@/services/english/exercises"
import { isLearned } from "@/services/english/learned"
import { useLearnerStore } from "@/stores/learner-store"
import type { DialogueLine, EnglishItem } from "@/types/english"
import { ExerciseSession } from "./exercise-session"
import { En, Hi } from "./lang"
import { ListenControls } from "./listen-controls"
import { SpeakingPanel } from "./speaking-panel"
import { useEnglishActions } from "./use-english"
import type { SpeechController } from "./use-speech"

function Dialogue({
  lines,
  speech,
}: {
  lines: readonly DialogueLine[]
  speech: SpeechController
}) {
  return (
    <ul className="space-y-2" aria-label="Conversation">
      {lines.map((l, i) => (
        <li key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
          <p>
            <span className="font-medium">{l.speaker}:</span> <En>{l.en}</En>
          </p>
          <Hi as="p" className="mt-0.5 text-muted-foreground">
            {l.hi}
          </Hi>
          {speech.caps.listen && (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="mt-1"
              onClick={() => speech.listen(l.en)}
            >
              Listen to this line
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="lr-eyebrow">{title}</h2>
      {children}
    </section>
  )
}

/** "I know this" and bookmark for one item. Marking known schedules its first revision. */
function ItemActions({ itemId }: { itemId: string }) {
  const progress = useLearnerStore((s) => s.progress)
  const english = useLearnerStore((s) => s.english)
  const { markKnown, bookmark } = useEnglishActions()
  const known = progress[itemId]?.completed === true
  const learned = isLearned(itemId, progress, english)
  const saved = progress[itemId]?.bookmarked === true
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant={known ? "default" : "outline"}
        aria-pressed={known}
        onClick={() => void markKnown(itemId)}
      >
        <CheckIcon /> {known ? "You know this" : "I know this"}
      </Button>
      <Button
        type="button"
        variant="outline"
        aria-pressed={saved}
        onClick={() => void bookmark(itemId)}
      >
        <BookmarkIcon className={cn(saved && "fill-current")} />
        {saved ? "Saved" : "Save"}
      </Button>
      {learned && !known && (
        <span className="text-xs text-muted-foreground">
          Learned by passing two exercises
        </span>
      )}
    </div>
  )
}

/** Type, order, fill-in and choose exercises for one item, inline. */
function ItemPractice({ item }: { item: EnglishItem }) {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const exercises = exercisesForItem(item, 1).filter((e) => e.kind !== "speak")
  if (exercises.length === 0) return null
  if (!open)
    return (
      <div className="space-y-1">
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Practise this by writing
        </Button>
        {summary && (
          <p className="text-xs text-muted-foreground" role="status">
            {summary}
          </p>
        )}
      </div>
    )
  return (
    <Section title="Practise by writing">
      <ExerciseSession
        exercises={exercises}
        doneLabel="Done"
        onDone={(r) => {
          setOpen(false)
          setSummary(`${r.correct} of ${r.total} correct`)
        }}
      />
    </Section>
  )
}

export function ItemView({
  item,
  speech,
}: {
  item: EnglishItem
  speech: SpeechController
}) {
  return (
    <article
      className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5"
      aria-label="Lesson item"
    >
      {item.kind === "sentence" && (
        <>
          <div className="space-y-1">
            <En as="p" className="text-xl font-medium sm:text-2xl">
              {item.en}
            </En>
            <Hi as="p" className="text-lg text-muted-foreground">
              {item.hi}
            </Hi>
            {item.hiRoman && (
              <p className="text-sm text-muted-foreground">{item.hiRoman}</p>
            )}
          </div>
          <ListenControls speech={speech} text={item.en} />
          <Section title="When to use it">
            <En as="p" className="text-sm">
              {item.whenToUse}
            </En>
          </Section>
          <Section title="Example">
            <Dialogue lines={item.example} speech={speech} />
          </Section>
          {item.note && (
            <Section title="Good to know">
              <En as="p" className="text-sm">
                {item.note.en}
              </En>
              <Hi as="p" className="text-sm text-muted-foreground">
                {item.note.hi}
              </Hi>
            </Section>
          )}
          <Section title="Say it aloud">
            <SpeakingPanel
              key={item.id}
              target={item.en}
              hi={item.hi}
              itemId={item.id}
            />
          </Section>
          <ItemPractice item={item} />
        </>
      )}

      {item.kind === "vocab" && (
        <>
          <div className="space-y-1">
            <En as="p" className="text-2xl font-medium">
              {item.word}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {item.partOfSpeech}
              </span>
            </En>
            <Hi as="p" className="text-lg text-muted-foreground">
              {item.hi}
            </Hi>
          </div>
          <ListenControls speech={speech} text={item.word} />
          <Section title="In a sentence">
            <En as="p" className="text-sm">
              {item.exampleEn}
            </En>
            <Hi as="p" className="text-sm text-muted-foreground">
              {item.exampleHi}
            </Hi>
            {speech.caps.listen && (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => speech.listen(item.exampleEn)}
              >
                Listen to the sentence
              </Button>
            )}
          </Section>
          <ItemPractice item={item} />
        </>
      )}

      {item.kind === "grammar" && (
        <>
          <En as="h2" className="text-xl font-medium">
            {item.title}
          </En>
          <Section title="The rule">
            <En as="p" className="text-sm">
              {item.rule.en}
            </En>
            <Hi as="p" className="text-sm text-muted-foreground">
              {item.rule.hi}
            </Hi>
          </Section>
          <Section title="Examples">
            <ul className="space-y-2">
              {item.examples.map((e, i) => (
                <li key={i} className="text-sm">
                  <En as="p">{e.en}</En>
                  <Hi as="p" className="text-muted-foreground">
                    {e.hi}
                  </Hi>
                </li>
              ))}
            </ul>
            <ListenControls speech={speech} text={item.examples[0].en} />
          </Section>
          <Section title="A common mistake">
            <p className="text-sm">
              <span className="font-medium">Not this: </span>
              <En>{item.commonMistake.wrong}</En>
            </p>
            <p className="text-sm">
              <span className="font-medium">Say this: </span>
              <En>{item.commonMistake.right}</En>
            </p>
            <En as="p" className="text-sm text-muted-foreground">
              {item.commonMistake.why.en}
            </En>
            <Hi as="p" className="text-sm text-muted-foreground">
              {item.commonMistake.why.hi}
            </Hi>
          </Section>
          <ItemPractice item={item} />
        </>
      )}

      {item.kind === "dialogue" && (
        <>
          <En as="h2" className="text-xl font-medium">
            {item.title}
          </En>
          <Section title="The situation">
            <En as="p" className="text-sm">
              {item.situation.en}
            </En>
            <Hi as="p" className="text-sm text-muted-foreground">
              {item.situation.hi}
            </Hi>
          </Section>
          <Dialogue lines={item.lines} speech={speech} />
        </>
      )}

      {item.kind === "answer" && <AnswerView item={item} speech={speech} />}

      <ItemActions itemId={item.id} />
    </article>
  )
}

const LEVEL_LABEL = {
  easy: "Easy English",
  intermediate: "Intermediate English",
  professional: "Professional English",
} as const

function AnswerView({
  item,
  speech,
}: {
  item: Extract<EnglishItem, { kind: "answer" }>
  speech: SpeechController
}) {
  const [level, setLevel] =
    useState<(typeof item.variants)[number]["level"]>("easy")
  const v = item.variants.find((x) => x.level === level) ?? item.variants[0]
  return (
    <>
      <En as="h2" className="text-xl font-medium">
        {item.question}
      </En>
      <div
        role="tablist"
        aria-label="Level of English"
        className="flex flex-wrap gap-2"
      >
        {item.variants.map((x) => (
          <Button
            key={x.level}
            type="button"
            role="tab"
            aria-selected={level === x.level}
            variant={level === x.level ? "default" : "outline"}
            size="sm"
            onClick={() => setLevel(x.level)}
          >
            {LEVEL_LABEL[x.level]}
          </Button>
        ))}
      </div>
      <div role="tabpanel" className="space-y-2">
        <En as="p" className="text-base leading-relaxed">
          {v.en}
        </En>
        <Hi as="p" className="text-sm text-muted-foreground">
          {v.hi}
        </Hi>
        <p className="text-xs text-muted-foreground">
          Replace the words in [square brackets] with your own facts.
        </p>
      </div>
      <ListenControls speech={speech} text={v.en} />
      <Section title="Tips">
        <ul className="list-disc space-y-1 ps-5 text-sm">
          {item.tips.map((t) => (
            <li key={t}>
              <En>{t}</En>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
