import { useState } from "react"
import { Link } from "react-router"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { PROJECTS, projectsOfRoadmap } from "@/data/projects"
import { projectProgress } from "@/services/study/projects"
import { useLearnerStore } from "@/stores/learner-store"
import type { ProjectKind } from "@/types/project"

type KindFilter = "all" | ProjectKind

/** Mini-projects and major projects for the learner's roadmap. Projects not written yet are not listed. */
export function ProjectsPage() {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const states = useLearnerStore((s) => s.projectStates)
  const roadmap = getRoadmap(profile?.studyRoadmap)
  const [kind, setKind] = useState<KindFilter>("all")
  const mine = roadmap ? projectsOfRoadmap(roadmap.id) : []
  const shown = mine
    .filter((p) => kind === "all" || p.kind === kind)
    .sort((a, b) => {
      const pa =
        a.roadmaps.find((r) => r.roadmapId === roadmap?.id)?.phase ?? 99
      const pb =
        b.roadmaps.find((r) => r.roadmapId === roadmap?.id)?.phase ?? 99
      return pa - pb || a.title.localeCompare(b.title)
    })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="Projects"
        description={
          mine.length === 0
            ? "Projects are written in reviewed batches. None are ready for your roadmap yet."
            : `${mine.length} ${mine.length === 1 ? "project is" : "projects are"} ready for your roadmap. You build each one yourself; LastRev tracks your own ticks, notes and a repository link you paste. It never runs or checks your code.`
        }
      />
      {mine.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={
            PROJECTS.length > 0
              ? "There are projects for other roadmaps, but none for yours yet."
              : "Mini-projects and a capstone for each roadmap are on the way."
          }
        />
      ) : (
        <>
          <div className="space-y-1">
            <Label htmlFor="project-kind">Show</Label>
            <select
              id="project-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as KindFilter)}
              className="block h-9 rounded-lg border border-input bg-background px-2 text-sm"
            >
              <option value="all">All projects</option>
              <option value="mini">Mini-projects</option>
              <option value="major">Major projects</option>
            </select>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2" aria-label="Projects">
            {shown.map((p) => {
              const pp = projectProgress(p, progress)
              const started =
                states.find((s) => s.id === p.id)?.startedAt || pp.done > 0
              const phase = p.roadmaps.find(
                (r) => r.roadmapId === roadmap?.id
              )?.phase
              return (
                <li key={p.id}>
                  <Link
                    to={`/study/projects/${p.id}`}
                    className="block h-full space-y-3 rounded-xl border border-border bg-card p-4 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={p.kind === "major" ? "default" : "outline"}
                      >
                        {p.kind === "major" ? "Major project" : "Mini-project"}
                      </Badge>
                      {phase && (
                        <span className="text-xs text-muted-foreground">
                          Phase {phase}
                        </span>
                      )}
                      <span className="ms-auto text-xs text-muted-foreground tabular-nums">
                        about {p.hours} h
                      </span>
                    </div>
                    <h2 className="font-heading text-base font-semibold">
                      {p.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">{p.summary}</p>
                    <Progress
                      value={pp.percent}
                      aria-label={`${p.title} progress`}
                    />
                    <p className="text-xs tabular-nums">
                      {pp.done} of {pp.total} ticked ({pp.percent}%) ·{" "}
                      {pp.complete
                        ? "complete"
                        : started
                          ? "started"
                          : "not started"}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
