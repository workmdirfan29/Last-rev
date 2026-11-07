import { useMemo, useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { loadAllLessons } from "@/data/english/loaders"
import { dueItems } from "@/services/english/progress"
import { useLearnerStore } from "@/stores/learner-store"
import type { EnglishItem } from "@/types/english"
import { useQuery } from "@tanstack/react-query"
import { En, Hi } from "../lang"
import { ListenControls } from "../listen-controls"
import { RatingButtons } from "../rating"
import { useSpeech } from "../use-speech"
import { useTimeOnTask } from "../use-time-on-task"

const RECALL = [
  "I forgot it",
  "I remembered a little",
  "I remembered with effort",
  "I remembered it well",
  "I knew it at once",
]

/** What to show first, and what to reveal, for each kind of item. */
export function sides(item: EnglishItem): {
  front: string
  back: string
  speak: string | null
} {
  switch (item.kind) {
    case "sentence":
      return { front: item.hi, back: item.en, speak: item.en }
    case "vocab":
      return { front: item.hi, back: item.word, speak: item.word }
    case "grammar":
      return { front: item.title, back: item.rule.en, speak: null }
    case "dialogue":
      return { front: item.title, back: item.situation.en, speak: null }
    case "answer":
      return {
        front: item.question,
        back: item.variants[0].en,
        speak: item.variants[0].en,
      }
  }
}

export function RevisePage() {
  const progress = useLearnerStore((s) => s.progress)
  const reviewQuestion = useLearnerStore((s) => s.reviewQuestion)
  const speech = useSpeech()
  useTimeOnTask("revise")
  const { data: lessons, isLoading } = useQuery({
    queryKey: ["english-all"],
    queryFn: loadAllLessons,
    staleTime: Infinity,
  })
  // The queue is fixed when the page opens: reviewing an item must not reshuffle what is left.
  const [queue] = useState<string[]>(() => dueItems(progress, new Date()))
  const [done, setDone] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const byId = useMemo(
    () =>
      new Map(
        (lessons ?? []).flatMap((l) => l.items.map((i) => [i.id, i] as const))
      ),
    [lessons]
  )
  if (isLoading) return <ScreenLoader />

  const current = queue[done] ? byId.get(queue[done]) : undefined
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title="Revise"
        description="Things you marked as known come back after 1, 3, 7, 14 and 30 days. Say how well you remembered each one."
      />
      {queue.length === 0 ? (
        <EmptyState
          title="Nothing to revise today"
          description="When you mark a sentence or word as known, it will come back here."
          action={
            <Button asChild>
              <Link to="/english/course">Go to the course</Link>
            </Button>
          }
        />
      ) : !current ? (
        <EmptyState
          title={
            done > 0 ? "Revision finished for today" : "Nothing to revise today"
          }
          description={`${done} ${done === 1 ? "item" : "items"} revised.`}
          action={
            <Button asChild variant="outline">
              <Link to="/english">Back to home</Link>
            </Button>
          }
        />
      ) : (
        <section
          className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5"
          aria-label="Revision card"
        >
          <p
            className="text-xs text-muted-foreground tabular-nums"
            data-testid="revise-position"
          >
            {done + 1} of {queue.length}
          </p>
          {(() => {
            const s = sides(current)
            return (
              <>
                <p className="text-xl">
                  {current.kind === "sentence" || current.kind === "vocab" ? (
                    <Hi>{s.front}</Hi>
                  ) : (
                    <En>{s.front}</En>
                  )}
                </p>
                {!revealed ? (
                  <Button type="button" onClick={() => setRevealed(true)}>
                    Show the English
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <En as="p" className="text-xl font-medium">
                      {s.back}
                    </En>
                    {s.speak && (
                      <ListenControls speech={speech} text={s.speak} />
                    )}
                    <RatingButtons
                      legend="How well did you remember it?"
                      anchors={RECALL}
                      value={null}
                      onPick={async (n) => {
                        await reviewQuestion(current.id, n)
                        setRevealed(false)
                        setDone(done + 1)
                      }}
                    />
                  </div>
                )}
              </>
            )
          })()}
        </section>
      )}
    </div>
  )
}
