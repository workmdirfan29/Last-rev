import { useMemo, useState } from "react"
import { Link } from "react-router"
import { SearchIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { getModule } from "@/data/catalog/modules"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { lessonCoverage, lessonCoverageText } from "@/services/lessons/coverage"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { dueLessons, finishedCount } from "@/services/study/progress"
import { useLearnerStore } from "@/stores/learner-store"

/** Every module that has lessons, with real counts. Modules without lessons are counted, never padded in. */
export function LessonsPage() {
  const progress = useLearnerStore((s) => s.progress)
  const profile = useLearnerStore((s) => s.profile)
  const [query, setQuery] = useState("")
  const [now] = useState(() => new Date())

  const moduleIds = useMemo(
    () => [...new Set(LESSON_INDEX.map((l) => l.moduleId))],
    []
  )
  const q = query.trim().toLowerCase()
  const hits = useMemo(
    () =>
      q
        ? LESSON_INDEX.filter((l) =>
            [l.title, l.topic, l.overview, getModule(l.moduleId)?.title ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
        : [],
    [q]
  )
  const due = dueLessons(progress, now)
  const roadmap = getRoadmap(profile?.studyRoadmap)
  const roadmapModules = roadmap
    ? [...defaultsForRoadmap(roadmap.id).keys()]
    : []
  const withLessons = roadmapModules.filter((id) =>
    moduleIds.includes(id)
  ).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="Lessons"
        description={
          LESSON_INDEX.length === 0
            ? "Lessons are written in reviewed batches, module by module. None are ready yet."
            : `${LESSON_INDEX.length} ${LESSON_INDEX.length === 1 ? "lesson is" : "lessons are"} ready in ${moduleIds.length} ${moduleIds.length === 1 ? "module" : "modules"}.${roadmap ? ` ${withLessons} of ${roadmapModules.length} modules in your roadmap have lessons so far.` : ""}`
        }
      />

      {LESSON_INDEX.length === 0 ? (
        <EmptyState
          title="No lessons are ready yet"
          description="Each module's lessons are added once they pass review. Your plan and roadmap work in the meantime."
        />
      ) : (
        <>
          {due.length > 0 && (
            <p className="text-sm" data-testid="lessons-due">
              {due.length} {due.length === 1 ? "lesson is" : "lessons are"} due
              for revision:{" "}
              {due.slice(0, 3).map((id, i) => {
                const l = LESSON_INDEX.find((x) => x.id === id)
                return l ? (
                  <span key={id}>
                    {i > 0 && ", "}
                    <Link
                      className="underline underline-offset-4"
                      to={`/study/lesson/${l.moduleId}/${l.slug}`}
                    >
                      {l.title}
                    </Link>
                  </span>
                ) : null
              })}
              {due.length > 3 ? " …" : ""}
            </p>
          )}
          <div className="relative max-w-md">
            <SearchIcon
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              aria-label="Search lessons"
              placeholder="Search lessons by title, topic or module…"
              className="ps-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {q ? (
            <section aria-label="Search results" className="space-y-2">
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {hits.length}{" "}
                {hits.length === 1 ? "lesson matches" : "lessons match"}
              </p>
              <ul className="space-y-2">
                {hits.map((l) => (
                  <li key={l.id}>
                    <Link
                      to={`/study/lesson/${l.moduleId}/${l.slug}`}
                      className="block rounded-lg border border-border bg-card p-3 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span className="block text-sm font-medium">
                        {l.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {getModule(l.moduleId)?.title} · {l.topic} · {l.minutes}{" "}
                        min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <ul
              className="grid gap-4 sm:grid-cols-2"
              aria-label="Modules with lessons"
            >
              {moduleIds.map((id) => {
                const m = getModule(id)
                if (!m) return null
                const lessons = LESSON_INDEX.filter((l) => l.moduleId === id)
                const done = finishedCount(lessons, progress)
                return (
                  <li key={id}>
                    <Link
                      to={`/study/lessons/${id}`}
                      className="block h-full space-y-3 rounded-xl border border-border bg-card p-4 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <h2 className="font-heading text-base font-semibold">
                        {m.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {m.description}
                      </p>
                      <Progress
                        value={(done / lessons.length) * 100}
                        aria-label={`${m.title} lessons finished`}
                      />
                      <p className="text-xs tabular-nums">
                        {done} of {lessons.length} finished ·{" "}
                        {lessonCoverageText(lessonCoverage(m))}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
