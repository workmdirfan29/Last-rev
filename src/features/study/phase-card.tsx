import { Link } from "react-router"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { projectsOfPhase } from "@/data/projects"
import { projectProgress } from "@/services/study/projects"
import { lessonCoverage, lessonCoverageText } from "@/services/lessons/coverage"
import {
  PHASE_STATE_LABEL,
  lessonsInPhase,
  phaseState,
  phaseStats,
  type PhaseView,
} from "@/services/study/roadmap"
import { useLearnerStore } from "@/stores/learner-store"
import { topicIdOf } from "@/utils/topic-id"

/** The one-line summary of a phase, from real counts only. */
export function PhaseSummary({ view }: { view: PhaseView }) {
  const progress = useLearnerStore((s) => s.progress)
  const s = phaseStats(view, LESSON_INDEX, progress)
  const state = phaseState(view, s)
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-medium">
        {view.phase.number}. {view.phase.title}
      </span>
      <Badge variant={state === "in-progress" ? "default" : "outline"}>
        {PHASE_STATE_LABEL[state]}
      </Badge>
      {!view.projectLed && (
        <span className="text-xs font-normal text-muted-foreground tabular-nums">
          {s.lessonsFinished} of {s.lessonsReady} lessons finished ·{" "}
          {s.topicsDone} of {s.topicsTotal} topics
        </span>
      )}
    </span>
  )
}

/** What is inside a phase: outcome, modules with their topics and lessons, links to other tools. */
export function PhaseDetail({ view }: { view: PhaseView }) {
  const progress = useLearnerStore((s) => s.progress)
  const { phase } = view
  const lessons = lessonsInPhase(view, LESSON_INDEX)
  const projects = projectsOfPhase(phase.roadmapId, phase.number)
  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted-foreground">{phase.outcome}</p>

      {view.projectLed && (
        <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
          This phase has no new modules. It is built around its project and the
          tools linked below.
          {projects.length === 0 && " Its project is in preparation."}
        </p>
      )}

      {projects.length > 0 && (
        <ul className="space-y-1.5" aria-label="Projects in this phase">
          {projects.map((p) => {
            const pp = projectProgress(p, progress)
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border border-border p-3"
              >
                <Link
                  className="font-medium underline underline-offset-4"
                  to={`/study/projects/${p.id}`}
                >
                  {p.kind === "major" ? "Major project" : "Mini-project"}:{" "}
                  {p.title}
                </Link>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {pp.done} of {pp.total} ticked · about {p.hours} h
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {view.modules.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {view.modules.map((m) => {
            const cov = lessonCoverage(m.module)
            const mine = lessons.filter((l) => l.moduleId === m.module.id)
            const prereqs = m.module.prerequisites
              .map((p) => getModule(p)?.title)
              .filter(Boolean)
            return (
              <li
                key={`${m.module.id}-${m.topics[0].title}`}
                className="space-y-2 p-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-medium">
                    {mine.length > 0 ? (
                      <Link
                        className="underline underline-offset-4"
                        to={`/study/lessons/${m.module.id}`}
                      >
                        {m.module.title}
                      </Link>
                    ) : (
                      m.module.title
                    )}
                    {m.entry.deferred && (
                      <Badge variant="secondary" className="ms-2">
                        Later
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Lessons: {lessonCoverageText(cov)}
                  </span>
                </div>
                <ul
                  className="flex flex-wrap gap-x-4 gap-y-1 text-xs"
                  aria-label={`${m.module.title} topics`}
                >
                  {m.topics.map((t) => {
                    const doneTopic =
                      progress[topicIdOf(m.module.id, t.title)]?.completed ===
                      true
                    return (
                      <li key={t.title} className="flex items-center gap-1">
                        {doneTopic ? (
                          <CheckCircle2Icon
                            className="size-3.5 text-success"
                            aria-label="Topic done"
                          />
                        ) : (
                          <CircleIcon
                            className="size-3.5 text-muted-foreground/50"
                            aria-label="Topic not done"
                          />
                        )}
                        {t.title}
                      </li>
                    )
                  })}
                </ul>
                {prereqs.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Builds on: {prereqs.join(", ")}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {view.hiddenModules > 0 && (
        <p className="text-xs text-muted-foreground">
          {view.hiddenModules} {view.hiddenModules === 1 ? "module" : "modules"}{" "}
          of this phase {view.hiddenModules === 1 ? "is" : "are"} not in your
          syllabus.{" "}
          <Link
            className="underline underline-offset-4"
            to="/settings/syllabus"
          >
            Change your syllabus
          </Link>
        </p>
      )}

      {phase.links.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Related tools">
          {phase.links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="inline-block rounded-md border border-border px-2.5 py-1 text-xs hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
