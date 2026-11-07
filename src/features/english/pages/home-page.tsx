import { Link } from "react-router"
import { ArrowRightIcon, FlameIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ENGLISH_CHALLENGE } from "@/data/english/challenge"
import { ENGLISH_MODULES } from "@/data/english/modules"
import { lessonsOfModule } from "@/services/english/catalogue"
import { dayStatuses, summarise } from "@/services/english/challenge"
import { dueItems, lessonFinished } from "@/services/english/progress"
import { useLearnerStore } from "@/stores/learner-store"
import { toDateKey } from "@/utils/dates"
import { En, Hi } from "../lang"
import { SpokenEnglishPrivacy } from "../privacy-block"
import { useEnglishMetrics } from "../use-english"

export function HomePage() {
  const m = useEnglishMetrics()
  const progress = useLearnerStore((s) => s.progress)
  const english = useLearnerStore((s) => s.english)
  const lessons = ENGLISH_MODULES.flatMap((mod) => lessonsOfModule(mod.id))
  const next = lessons.find((l) => !lessonFinished(l.id, progress))
  const due = dueItems(progress, new Date()).length
  const today = toDateKey(new Date())
  const hasChallenge = ENGLISH_CHALLENGE.length === 30
  const summary = hasChallenge
    ? summarise(
        dayStatuses(ENGLISH_CHALLENGE, { progress, state: english }, today),
        english?.challenge.startDate ?? null,
        today
      )
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title="Spoken English"
        description={
          <>
            <Hi as="span" className="block text-base">
              आसान अंग्रेज़ी, एक-एक क़दम
            </Hi>
            A step-by-step course for speaking English at work and in daily
            life, with Hindi meanings.
          </>
        }
      />

      {lessons.length === 0 ? (
        <EmptyState
          title="The course is being written"
          description="Lessons are added in reviewed batches. Nothing is shown until it exists."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <section
            className="space-y-3 rounded-xl border border-border bg-card p-4"
            aria-labelledby="today"
          >
            <h2
              id="today"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FlameIcon className="size-4 text-brand-ink" aria-hidden />{" "}
              Today's challenge
            </h2>
            {summary ? (
              summary.complete ? (
                <p className="text-sm">All 30 days are done. Well done.</p>
              ) : (
                <>
                  <p className="text-sm">
                    <span className="font-medium">
                      Day {summary.next} is next.
                    </span>{" "}
                    {summary.finished} of 30 days finished
                    {summary.missed.length > 0
                      ? `, ${summary.missed.length} missed (you can still do them)`
                      : ""}
                    .
                  </p>
                  <Button asChild>
                    <Link to="/english/challenge">
                      Open the challenge <ArrowRightIcon />
                    </Link>
                  </Button>
                </>
              )
            ) : (
              <p
                className="text-sm text-muted-foreground"
                data-testid="challenge-pending"
              >
                The 30-day challenge is being written. It will appear here when
                it is ready.
              </p>
            )}
          </section>

          <section
            className="space-y-3 rounded-xl border border-border bg-card p-4"
            aria-labelledby="continue"
          >
            <h2 id="continue" className="text-sm font-medium">
              {m.lessonsFinished > 0 ? "Continue" : "Start here"}
            </h2>
            {next ? (
              <>
                <p className="text-sm">
                  <En>{next.title}</En>
                  <Hi as="span" className="block text-muted-foreground">
                    {next.titleHi}
                  </Hi>
                </p>
                <Button asChild>
                  <Link to={`/english/lesson/${next.moduleId}/${next.slug}`}>
                    Open the lesson <ArrowRightIcon />
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm">
                You have finished every lesson that exists so far.
              </p>
            )}
          </section>

          <section
            className="space-y-3 rounded-xl border border-border bg-card p-4"
            aria-labelledby="revise"
          >
            <h2
              id="revise"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <RotateCcwIcon className="size-4 text-brand-ink" aria-hidden /> To
              revise
            </h2>
            <p className="text-sm" data-testid="due-count">
              {due === 0
                ? "Nothing to revise today."
                : `${due} ${due === 1 ? "item is" : "items are"} ready to revise.`}
            </p>
            {due > 0 && (
              <Button asChild variant="outline">
                <Link to="/english/revise">Revise now</Link>
              </Button>
            )}
          </section>

          <section
            className="space-y-3 rounded-xl border border-border bg-card p-4"
            aria-labelledby="summary"
          >
            <h2 id="summary" className="text-sm font-medium">
              Your progress
            </h2>
            <Progress
              value={
                m.lessonsTotal ? (m.lessonsFinished / m.lessonsTotal) * 100 : 0
              }
              aria-label="Lessons finished"
            />
            <p className="text-sm tabular-nums">
              {m.lessonsFinished} of {m.lessonsTotal} lessons finished ·{" "}
              {m.vocabLearned} words learned · {m.sentencesPractised} sentences
              practised
            </p>
            <Link
              className="text-xs underline underline-offset-4"
              to="/english/progress"
            >
              See all my progress
            </Link>
          </section>
        </div>
      )}

      <SpokenEnglishPrivacy />
    </div>
  )
}
