import { Link } from "react-router"
import { BookmarkIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatTile } from "@/components/shared/stat-tile"
import { Progress } from "@/components/ui/progress"
import {
  courseOutline,
  lessonEntry,
  lessonOfItem,
} from "@/services/english/catalogue"
import { moduleProgress } from "@/services/english/progress"
import { useLearnerStore } from "@/stores/learner-store"
import { En } from "../lang"
import { useEnglishMetrics } from "../use-english"

export function ProgressPage() {
  const m = useEnglishMetrics()
  const progress = useLearnerStore((s) => s.progress)
  const activity = useLearnerStore((s) => s.activity)
  const minutes = activity
    .filter((a) => a.type === "english")
    .reduce((n, a) => n + a.minutes, 0)
  const bookmarks = Object.values(progress).filter(
    (p) =>
      p.bookmarked &&
      p.questionId.startsWith("en.") &&
      p.questionId.split(".").length === 4
  )
  const c = m.confidence
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title="My progress"
        description="Every number here comes from what you actually did. Nothing is estimated."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Lessons finished"
          value={`${m.lessonsFinished} of ${m.lessonsTotal}`}
        />
        <StatTile
          label="Words learned"
          value={`${m.vocabLearned} of ${m.vocabTotal}`}
        />
        <StatTile
          label="Sentences practised"
          value={`${m.sentencesPractised} of ${m.sentencesTotal}`}
        />
        <StatTile label="Speaking exercises rated" value={m.speakingDone} />
        <StatTile
          label="Days in a row"
          value={m.streak.current}
          hint={`Longest: ${m.streak.longest}`}
        />
        <StatTile
          label="Time spent"
          value={`${minutes} min`}
          hint="Active time on the English pages"
        />
        <StatTile
          label="Confidence (1 to 5)"
          value={c.average ?? "–"}
          hint={c.count ? `${c.count} check-ins` : "No check-ins yet"}
        />
        <StatTile
          label="Trend"
          value={
            c.trend
              ? c.trend.direction === "up"
                ? "Going up"
                : c.trend.direction === "down"
                  ? "Going down"
                  : "Steady"
              : "–"
          }
          hint={
            c.trend
              ? `${c.trend.delta > 0 ? "+" : ""}${c.trend.delta} over the last 7 check-ins`
              : "Needs 8 or more check-ins"
          }
        />
      </div>

      <section className="space-y-3" aria-labelledby="by-module">
        <h2 id="by-module" className="text-sm font-medium">
          By module
        </h2>
        <ul className="space-y-3">
          {courseOutline().map(({ module: mod }) => {
            const p = moduleProgress(mod.id, progress)
            return (
              <li key={mod.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <Link
                    className="underline-offset-4 hover:underline"
                    to={`/english/course/${mod.id}`}
                  >
                    {mod.title}
                  </Link>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {p.done} of {p.total} lessons
                  </span>
                </div>
                <Progress
                  value={(p.done / p.total) * 100}
                  aria-label={`${mod.title} progress`}
                />
              </li>
            )
          })}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="saved">
        <h2 id="saved" className="flex items-center gap-2 text-sm font-medium">
          <BookmarkIcon className="size-4 text-brand-ink" aria-hidden /> Saved
          items
        </h2>
        {bookmarks.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Items you save in a lesson will be listed here.
          </p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {bookmarks.map((b) => {
              const lesson = lessonEntry(lessonOfItem(b.questionId))
              if (!lesson) return null
              return (
                <li key={b.questionId}>
                  <Link
                    className="underline underline-offset-4"
                    to={`/english/lesson/${lesson.moduleId}/${lesson.slug}`}
                  >
                    <En>{lesson.title}</En>
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    · {b.questionId.split(".")[3].replaceAll("-", " ")}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
