import { Link } from "react-router"
import { InfoIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { CategoryReadiness } from "@/services/readiness/categories"
import { useLearnerStore } from "@/stores/learner-store"
import { AnalyticsSection } from "./analytics"
import { useReadiness } from "./use-readiness"

const FORMULA =
  "A category's score is the plain average of the parts it has: questions (60% completed + 40% your own 1–5 confidence), lessons finished, quizzes passed, assignment ticks and exercises, and the average of your own ratings in finished mock interviews. A part a category does not have is left out. The overall is the plain mean of the categories that have content, that are in your syllabus and that you have not switched off. It measures coverage and your own confidence over what exists today, not a hiring probability."

function Counts({ c }: { c: CategoryReadiness }) {
  const rows: string[] = []
  if (c.questions)
    rows.push(
      `Questions ${c.questions.completed} of ${c.questions.total} done${c.questions.confidenceAverage !== null ? ` · average confidence ${c.questions.confidenceAverage}` : ""}`
    )
  if (c.lessons)
    rows.push(`Lessons ${c.lessons.finished} of ${c.lessons.ready} finished`)
  if (c.quizzes)
    rows.push(`Quizzes ${c.quizzes.passed} of ${c.quizzes.total} passed`)
  if (c.assignments)
    rows.push(
      `Assignments and exercises ${c.assignments.done} of ${c.assignments.total} done`
    )
  if (c.mock)
    rows.push(
      `Mock interviews: ${c.mock.rated} rated answers, average ${Math.round(c.mock.mean)}% of rubric points (your own ratings)`
    )
  if (c.english)
    rows.push(
      `Spoken English lessons ${c.english.lessonsFinished} of ${c.english.lessonsReady} finished · words learned ${c.english.wordsLearned} of ${c.english.wordsTotal} · sentences practised ${c.english.sentencesPractised} of ${c.english.sentencesTotal} · speaking ratings ${c.english.speakingRated}`
    )
  if (c.hrAnswers !== null) rows.push(`HR answers saved: ${c.hrAnswers}`)
  return (
    <ul className="space-y-0.5 text-xs text-muted-foreground tabular-nums">
      {rows.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  )
}

function Card({ c }: { c: CategoryReadiness }) {
  const update = useLearnerStore((s) => s.updatePreferences)
  const excluded = useLearnerStore((s) => s.preferences.readinessExcluded)
  const pct = c.score === null ? null : Math.round(c.score * 100)
  const toggle = (on: boolean) =>
    void update({
      readinessExcluded: on
        ? excluded.filter((x) => x !== c.category.id)
        : [...new Set([...excluded, c.category.id])],
    })
  return (
    <li
      className="space-y-2 rounded-xl border border-border bg-card p-4"
      data-testid={`category-${c.category.id}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">{c.category.label}</h3>
        <span className="text-sm tabular-nums">
          {pct === null ? "" : `${pct}%`}
        </span>
      </div>
      {c.hasContent ? (
        <>
          <Progress
            value={pct ?? 0}
            aria-label={`${c.category.label} readiness`}
          />
          <Counts c={c} />
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          No content for this category yet.
        </p>
      )}
      {c.hasContent && (
        <div className="flex items-center gap-2 pt-1">
          <Switch
            id={`inc-${c.category.id}`}
            checked={!c.excluded}
            onCheckedChange={toggle}
          />
          <Label
            htmlFor={`inc-${c.category.id}`}
            className="text-xs font-normal"
          >
            {c.included
              ? "Counted in the overall"
              : c.excluded
                ? "Switched off"
                : "Not in your syllabus"}
          </Label>
        </div>
      )}
    </li>
  )
}

/** Job readiness by category, from real records only, then analytics. */
export function ReadinessPage() {
  const r = useReadiness()
  if (!r) return <ScreenLoader />
  const withContent = r.categories.filter((c) => c.hasContent)
  const without = r.categories.filter((c) => !c.hasContent)
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Readiness"
        title="Job readiness"
        description="Your coverage and confidence in each category, from what you actually did."
      />
      <section
        aria-label="Overall readiness"
        className="space-y-2 rounded-xl border border-border bg-card p-4"
      >
        <p
          className="font-heading text-3xl font-semibold tabular-nums"
          data-testid="overall"
        >
          {r.overall === null ? "—" : `${r.overall}%`}
        </p>
        <p className="text-sm text-muted-foreground" data-testid="overall-note">
          {r.overall === null
            ? "Nothing to measure yet: no category has content in your syllabus."
            : `Over ${r.included} of ${r.categories.length} categories (those with content that you selected).`}
        </p>
        <details className="text-xs text-muted-foreground">
          <summary className="flex cursor-pointer items-center gap-1 font-medium text-foreground">
            <InfoIcon className="size-3.5" aria-hidden /> How this is made
          </summary>
          <p className="mt-2 max-w-2xl">{FORMULA}</p>
        </details>
      </section>
      <section className="space-y-3" aria-labelledby="cats">
        <h2 id="cats" className="text-sm font-medium">
          Categories with content
        </h2>
        {withContent.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No category has content yet.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {withContent.map((c) => (
              <Card key={c.category.id} c={c} />
            ))}
          </ul>
        )}
      </section>
      {without.length > 0 && (
        <section className="space-y-2" aria-labelledby="none">
          <h2 id="none" className="text-sm font-medium">
            No content yet
          </h2>
          <p className="text-xs text-muted-foreground" data-testid="no-content">
            {without.map((c) => c.category.label).join(" · ")}. These are left
            out of the overall.
          </p>
        </section>
      )}
      <AnalyticsSection />
      <p className="text-xs text-muted-foreground">
        See also{" "}
        <Link className="underline underline-offset-4" to="/how-we-decide">
          how we decide what to study
        </Link>
        .
      </p>
    </div>
  )
}
