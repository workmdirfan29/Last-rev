import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ENGLISH_CHALLENGE } from "@/data/english/challenge"
import { loadLesson } from "@/data/english/loaders"
import { cn } from "@/lib/utils"
import { lessonEntry, lessonOfItem } from "@/services/english/catalogue"
import {
  dayStatuses,
  summarise,
  type DayStatus,
} from "@/services/english/challenge"
import { buildSession } from "@/services/english/exercises"
import { isLearned, isPractised } from "@/services/english/learned"
import { useLearnerStore } from "@/stores/learner-store"
import type { ChallengeDay, EnglishItem } from "@/types/english"
import { toDateKey } from "@/utils/dates"
import { SPEAKING_HONESTY } from "../copy"
import { ExerciseSession, type SessionResult } from "../exercise-session"
import { En, Hi } from "../lang"
import { RatingButtons } from "../rating"
import { SpeakingPanel } from "../speaking-panel"
import { useEnglishActions } from "../use-english"
import { useSpeech } from "../use-speech"
import { useTimeOnTask } from "../use-time-on-task"

const CONFIDENCE = [
  "Not confident",
  "A little confident",
  "Fairly confident",
  "Confident",
  "Very confident",
]
/** The day's text exercise counts as passed at two thirds correct. */
export const PASS_FRACTION = 2 / 3

const STATE_LABEL: Record<DayStatus["state"], string> = {
  done: "Done",
  today: "Today",
  missed: "Missed",
  upcoming: "Upcoming",
  open: "Open",
}

function useDayItems(day: ChallengeDay) {
  const ids = useMemo(
    () =>
      [
        ...new Set([
          day.lesson,
          day.exercise.lesson,
          ...day.vocab.map(lessonOfItem),
          ...day.sentences.map(lessonOfItem),
          lessonOfItem(day.speaking),
        ]),
      ].sort(),
    [day]
  )
  return useQuery({
    queryKey: ["english-day", day.day],
    queryFn: async () =>
      (await Promise.all(ids.map(loadLesson))).filter((l) => l !== null),
    staleTime: Infinity,
  })
}

function Task({
  done,
  title,
  children,
}: {
  done: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      className="space-y-3 rounded-xl border border-border bg-card p-4"
      aria-label={title}
    >
      <h3 className="flex items-center gap-2 text-sm font-medium">
        {done ? (
          <CheckCircle2Icon className="size-4 text-success" aria-hidden />
        ) : (
          <CircleIcon className="size-4 text-muted-foreground" aria-hidden />
        )}
        {title}
        <span className="text-xs font-normal text-muted-foreground">
          {done ? "done" : "to do"}
        </span>
      </h3>
      {children}
    </section>
  )
}

function ItemLine({
  item,
  onKnow,
  known,
  speech,
}: {
  item: EnglishItem
  known: boolean
  onKnow: () => void
  speech: ReturnType<typeof useSpeech>
}) {
  const [en, hi] =
    item.kind === "vocab"
      ? [item.word, item.hi]
      : item.kind === "sentence"
        ? [item.en, item.hi]
        : ["", ""]
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 p-2.5 text-sm">
      <span className="min-w-0">
        <En as="span" className="block font-medium">
          {en}
        </En>
        <Hi as="span" className="block text-muted-foreground">
          {hi}
        </Hi>
      </span>
      <span className="flex items-center gap-2">
        {speech.caps.listen && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={() => speech.listen(en)}
          >
            Listen
          </Button>
        )}
        <Button
          type="button"
          size="xs"
          variant={known ? "default" : "outline"}
          aria-pressed={known}
          onClick={onKnow}
        >
          {known ? "You know this" : "I know this"}
        </Button>
      </span>
    </li>
  )
}

function DayDetail({ day, status }: { day: ChallengeDay; status: DayStatus }) {
  const progress = useLearnerStore((s) => s.progress)
  const english = useLearnerStore((s) => s.english)
  const { markKnown, passDayExercise, checkin } = useEnglishActions()
  const speech = useSpeech()
  const { data: lessons, isLoading } = useDayItems(day)
  const { flush } = useTimeOnTask("challenge")
  const rating = useLearnerStore(
    (s) => s.english?.challenge.checkins[String(day.day)]?.rating ?? null
  )
  const [seed, setSeed] = useState(() => day.day * 7919)
  const [outcome, setOutcome] = useState<SessionResult | null>(null)
  const [attempt, setAttempt] = useState(false)

  const items = useMemo(
    () =>
      new Map(
        (lessons ?? []).flatMap((l) => l.items.map((i) => [i.id, i] as const))
      ),
    [lessons]
  )
  const exerciseLesson = (lessons ?? []).find(
    (l) => l.id === day.exercise.lesson
  )
  const plan = useMemo(
    () =>
      exerciseLesson
        ? buildSession([exerciseLesson], {
            kinds: ["type", "arrange", "blank", "choose", "match"],
            count: day.exercise.count,
            seed,
          })
        : null,
    [exerciseLesson, day.exercise.count, seed]
  )
  const lesson = lessonEntry(day.lesson)
  const speakingItem = items.get(day.speaking)
  const t = status.tasks

  if (isLoading)
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Loading the day…
      </p>
    )

  return (
    <div className="space-y-4" data-testid="day-detail">
      <h2 className="font-heading text-xl font-semibold">
        Day {day.day}
        {day.theme && (
          <span className="text-muted-foreground">
            {" "}
            · <En>{day.theme}</En>
          </span>
        )}
      </h2>

      <Task done={t.lesson} title="1. The lesson of the day">
        {lesson ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>
              <En>{lesson.title}</En> ·{" "}
              <Hi className="text-muted-foreground">{lesson.titleHi}</Hi>
            </span>
            <Button asChild variant="outline" size="sm">
              <Link to={`/english/lesson/${lesson.moduleId}/${lesson.slug}`}>
                Open the lesson
              </Link>
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            This lesson is not available.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Choose "Finish this lesson" at the bottom of the lesson when you are
          done.
        </p>
      </Task>

      <Task done={t.vocab} title={`2. Learn ${day.vocab.length} words`}>
        <ul className="space-y-2">
          {day.vocab.map((id) => {
            const it = items.get(id)
            return it ? (
              <ItemLine
                key={id}
                item={it}
                speech={speech}
                known={isLearned(id, progress, english)}
                onKnow={() => void markKnown(id)}
              />
            ) : null
          })}
        </ul>
      </Task>

      <Task
        done={t.sentences}
        title={`3. Practise ${day.sentences.length} sentences`}
      >
        <ul className="space-y-2">
          {day.sentences.map((id) => {
            const it = items.get(id)
            return it ? (
              <ItemLine
                key={id}
                item={it}
                speech={speech}
                known={isPractised(id, progress, english)}
                onKnow={() => void markKnown(id)}
              />
            ) : null
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          A sentence counts when you mark it known or pass a writing exercise on
          it.
        </p>
      </Task>

      <Task done={t.speaking} title="4. Say one sentence aloud">
        {speakingItem && speakingItem.kind === "sentence" ? (
          <>
            <p className="text-xs text-muted-foreground">{SPEAKING_HONESTY}</p>
            <SpeakingPanel
              key={speakingItem.id}
              target={speakingItem.en}
              hi={speakingItem.hi}
              itemId={speakingItem.id}
              day={day.day}
            />
          </>
        ) : null}
      </Task>

      <Task
        done={t.exercise}
        title={`5. Writing exercise (${day.exercise.count} questions)`}
      >
        {t.exercise && !attempt ? (
          <p className="text-sm">You passed this exercise.</p>
        ) : !attempt ? (
          <Button
            type="button"
            onClick={() => setAttempt(true)}
            disabled={!plan || plan.exercises.length === 0}
          >
            Start the exercise
          </Button>
        ) : outcome ? (
          <div className="space-y-2" role="status">
            <p className="text-sm font-medium">
              {outcome.correct} of {outcome.total} correct.{" "}
              {outcome.correct >= Math.ceil(outcome.total * PASS_FRACTION)
                ? "You passed."
                : `You need ${Math.ceil(outcome.total * PASS_FRACTION)} to pass. Try again when you are ready.`}
            </p>
            {outcome.correct < Math.ceil(outcome.total * PASS_FRACTION) && (
              <Button
                type="button"
                onClick={() => {
                  setOutcome(null)
                  setSeed(seed + 1)
                }}
              >
                Try again
              </Button>
            )}
          </div>
        ) : plan ? (
          <ExerciseSession
            key={seed}
            exercises={plan.exercises}
            onDone={(r) => {
              setOutcome(r)
              if (r.correct >= Math.ceil(r.total * PASS_FRACTION))
                void passDayExercise(day.day)
            }}
          />
        ) : null}
      </Task>

      <Task done={t.checkin} title="6. How confident do you feel?">
        <RatingButtons
          legend="Your speaking today"
          anchors={CONFIDENCE}
          value={rating}
          onPick={(n) => {
            flush()
            void checkin(day.day, n)
          }}
        />
      </Task>

      <div role="status" aria-live="polite" className="text-sm font-medium">
        {status.done ? `Day ${day.day} is complete.` : ""}
      </div>
    </div>
  )
}

export function ChallengePage() {
  const progress = useLearnerStore((s) => s.progress)
  const english = useLearnerStore((s) => s.english)
  const { setStartDate } = useEnglishActions()
  const [params, setParams] = useSearchParams()
  const today = toDateKey(new Date())
  const statuses = useMemo(
    () => dayStatuses(ENGLISH_CHALLENGE, { progress, state: english }, today),
    [progress, english, today]
  )
  const start = english?.challenge.startDate ?? null
  const summary = summarise(statuses, start, today)

  if (ENGLISH_CHALLENGE.length !== 30)
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Spoken English"
          title="30-day speaking challenge"
        />
        <EmptyState
          title="The 30-day challenge is being written"
          description="It will be here when its 30 days are ready. In the meantime the course and practice pages are open."
          action={
            <Button asChild>
              <Link to="/english/course">Go to the course</Link>
            </Button>
          }
        />
      </div>
    )

  const wanted = Number(params.get("day"))
  const selected = wanted >= 1 && wanted <= 30 ? wanted : (summary.next ?? 1)
  const day =
    ENGLISH_CHALLENGE.find((d) => d.day === selected) ?? ENGLISH_CHALLENGE[0]
  const status = statuses.find((s) => s.day === day.day)!

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title="30-day speaking challenge"
        description="Thirty separate days. Do them in any order; a missed day never resets anything."
      />

      <section
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        aria-label="Challenge summary"
      >
        <p className="text-sm" data-testid="challenge-summary">
          {summary.complete ? (
            "All 30 days are done."
          ) : (
            <>
              <span className="font-medium">Day {summary.next} is next.</span>{" "}
              {summary.finished} of 30 days finished.
            </>
          )}
        </p>
        {summary.missed.length > 0 && (
          <p className="text-sm" data-testid="missed">
            Missed days: {summary.missed.map((d) => `Day ${d}`).join(", ")}. You
            can do them whenever you like.
          </p>
        )}
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="start-date">Day 1 is on</Label>
            <Input
              id="start-date"
              type="date"
              className="w-44"
              value={start ?? ""}
              onChange={(e) => void setStartDate(e.target.value || null)}
            />
          </div>
          {start === null && (
            <Button
              type="button"
              variant="outline"
              onClick={() => void setStartDate(today)}
            >
              Start today
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {start === null
            ? "Choose a start date to see a date on each day. You can also just work through the days without one."
            : "The date only labels the days. Changing it never removes anything you have done."}
        </p>
      </section>

      <nav aria-label="The 30 days">
        <ol className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {statuses.map((s) => (
            <li key={s.day}>
              <button
                type="button"
                onClick={() =>
                  setParams({ day: String(s.day) }, { replace: true })
                }
                aria-current={s.day === day.day ? "step" : undefined}
                className={cn(
                  "flex w-full flex-col items-center rounded-lg border px-1 py-1.5 text-xs transition-colors",
                  s.day === day.day
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/60",
                  s.state === "missed" && "border-warning/60"
                )}
              >
                <span className="font-medium tabular-nums">Day {s.day}</span>{" "}
                <span className="text-[0.625rem] text-muted-foreground">
                  {STATE_LABEL[s.state]}
                </span>
                {s.date && <span className="sr-only">, {s.date}</span>}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {status.date && (
        <p className="text-xs text-muted-foreground">
          Day {day.day} is scheduled for {status.date}.
        </p>
      )}
      <DayDetail key={day.day} day={day} status={status} />
    </div>
  )
}
