import { useState } from "react"
import { Link, useParams } from "react-router"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { CodeBlock } from "@/components/shared/code-block"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { getProject } from "@/data/projects"
import { lessonFinished } from "@/services/study/progress"
import {
  parseRepoUrl,
  projectProgress,
  stepDone,
} from "@/services/study/projects"
import { useLearnerStore } from "@/stores/learner-store"
import { acceptanceItems, projectTickId } from "@/types/project"

/** One project: the brief, the steps with their acceptance ticks, and the learner's own notes and repository link. */
export function ProjectPage() {
  const { id } = useParams()
  const project = getProject(id)
  if (!project)
    return (
      <EmptyState
        title="Project not found"
        description="That project is not in the list."
        action={
          <Button asChild>
            <Link to="/study/projects">Back to the projects</Link>
          </Button>
        }
      />
    )
  return <ProjectView key={project.id} projectId={project.id} />
}

function ProjectView({ projectId }: { projectId: string }) {
  const project = getProject(projectId)!
  const progress = useLearnerStore((s) => s.progress)
  const state = useLearnerStore((s) =>
    s.projectStates.find((p) => p.id === projectId)
  )
  const save = useLearnerStore((s) => s.saveProjectState)
  const toggle = useLearnerStore((s) => s.toggleCompleted)
  const pp = projectProgress(project, progress)
  const items = acceptanceItems(project)
  const [repo, setRepo] = useState(state?.repoUrl ?? "")
  const [repoError, setRepoError] = useState<string | null>(null)
  const [notes, setNotes] = useState(state?.notes ?? "")
  const [saved, setSaved] = useState<"repo" | "notes" | null>(null)
  const started = Boolean(state?.startedAt) || pp.done > 0

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow={project.kind === "major" ? "Major project" : "Mini-project"}
        title={project.title}
        description={project.summary}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/study/projects">
              <ArrowLeftIcon /> All projects
            </Link>
          </Button>
        }
      />

      <section
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        aria-label="Project progress"
      >
        <p className="text-sm tabular-nums" data-testid="project-progress">
          {pp.done} of {pp.total} acceptance items ticked ({pp.percent}%) ·
          about {project.hours} hours
        </p>
        <Progress value={pp.percent} aria-label="Project progress" />
        {!started && (
          <Button
            type="button"
            onClick={() =>
              void save(projectId, (p) => ({
                ...p,
                startedAt: new Date().toISOString(),
              }))
            }
          >
            Start this project
          </Button>
        )}
        {started && state?.startedAt && (
          <p className="text-xs text-muted-foreground">
            Started on {state.startedAt.slice(0, 10)}.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          You build this yourself. LastRev does not run or check your code: the
          ticks are your own, and the link is only stored here.
        </p>
      </section>

      {project.buildsOn.length > 0 && (
        <section className="space-y-2" aria-labelledby="builds-on">
          <h2
            id="builds-on"
            className="font-heading text-lg font-semibold tracking-tight"
          >
            Build on these lessons
          </h2>
          <ul className="space-y-1 text-sm">
            {project.buildsOn.map((l) => {
              const e = LESSON_INDEX.find((x) => x.id === l)
              return (
                <li key={l} className="flex items-center gap-2">
                  {e && lessonFinished(l, progress) ? (
                    <CheckCircle2Icon
                      className="size-4 text-success"
                      aria-label="Finished"
                    />
                  ) : (
                    <CircleIcon
                      className="size-4 text-muted-foreground/50"
                      aria-label="Not finished"
                    />
                  )}
                  {e ? (
                    <Link
                      className="underline underline-offset-4"
                      to={`/study/lesson/${e.moduleId}/${e.slug}`}
                    >
                      {e.title}
                    </Link>
                  ) : (
                    <span>{l}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="space-y-2" aria-labelledby="stories">
        <h2
          id="stories"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          User stories
        </h2>
        <ul className="lr-prose list-disc space-y-1 ps-5">
          {project.userStories.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="reqs">
        <h2
          id="reqs"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Requirements
        </h2>
        <ul className="lr-prose list-disc space-y-1 ps-5">
          {project.requirements.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {project.structure.length > 0 && (
        <section className="space-y-2" aria-labelledby="structure">
          <h2
            id="structure"
            className="font-heading text-lg font-semibold tracking-tight"
          >
            Suggested structure
          </h2>
          <CodeBlock
            code={project.structure.join("\n")}
            language="text"
            title="A suggestion, not a rule"
          />
        </section>
      )}

      <section className="space-y-4" aria-labelledby="steps">
        <h2
          id="steps"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Steps
        </h2>
        <ol className="space-y-4">
          {project.steps.map((step, si) => (
            <li key={step.title}>
              <fieldset className="space-y-2 rounded-xl border border-border bg-card p-4">
                <legend className="flex items-center gap-2 px-1 text-sm font-medium">
                  Step {si + 1}: {step.title}
                  {stepDone(pp, si) && <Badge variant="outline">Done</Badge>}
                </legend>
                <p className="text-sm text-muted-foreground">{step.summary}</p>
                {items
                  .filter((it) => it.stepIndex === si)
                  .map((it) => {
                    const tick = projectTickId(projectId, it.n)
                    return (
                      <label
                        key={tick}
                        className="flex items-start gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 size-4 accent-[var(--primary)]"
                          checked={progress[tick]?.completed === true}
                          onChange={() => void toggle(tick, 0, "project")}
                        />
                        <span>{it.text}</span>
                      </label>
                    )
                  })}
              </fieldset>
            </li>
          ))}
        </ol>
      </section>

      {project.stretch.length > 0 && (
        <section className="space-y-2" aria-labelledby="stretch">
          <h2
            id="stretch"
            className="font-heading text-lg font-semibold tracking-tight"
          >
            Stretch goals
          </h2>
          <ul className="lr-prose list-disc space-y-1 ps-5">
            {project.stretch.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4" aria-labelledby="mine">
        <h2
          id="mine"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Your repository and notes
        </h2>
        <form
          className="space-y-1.5"
          onSubmit={(e) => {
            e.preventDefault()
            const r = parseRepoUrl(repo)
            if (!r.ok) return setRepoError(r.reason)
            setRepoError(null)
            setRepo(r.url)
            void save(projectId, (p) => ({ ...p, repoUrl: r.url })).then(() =>
              setSaved("repo")
            )
          }}
        >
          <Label htmlFor="repo-url">Link to your repository (optional)</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              id="repo-url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://"
              className="max-w-md"
              value={repo}
              onChange={(e) => {
                setRepo(e.target.value)
                setSaved(null)
              }}
              aria-invalid={repoError !== null}
              aria-describedby="repo-help"
            />
            <Button type="submit" variant="outline">
              Save link
            </Button>
          </div>
          <p
            id="repo-help"
            className="text-xs text-muted-foreground"
            role={repoError ? "alert" : undefined}
          >
            {repoError ??
              "Stored on this device only. LastRev never opens or checks it."}
            {saved === "repo" && !repoError ? " Saved." : ""}
          </p>
          {state?.repoUrl && (
            <a
              href={state.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-ink underline underline-offset-4"
            >
              Open your repository{" "}
              <ExternalLinkIcon className="size-3.5" aria-hidden />
            </a>
          )}
        </form>
        <div className="space-y-1.5">
          <Label htmlFor="project-notes">Your notes</Label>
          <Textarea
            id="project-notes"
            rows={5}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              setSaved(null)
            }}
            onBlur={() => {
              if (notes !== (state?.notes ?? ""))
                void save(projectId, (p) => ({ ...p, notes })).then(() =>
                  setSaved("notes")
                )
            }}
            placeholder="Decisions, problems you hit, what to do next…"
          />
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {saved === "notes"
              ? "Saved on this device."
              : "Saved when you leave the box."}
          </p>
        </div>
      </section>

      {project.resources.length > 0 && (
        <section className="space-y-2" aria-labelledby="proj-res">
          <h2
            id="proj-res"
            className="font-heading text-lg font-semibold tracking-tight"
          >
            Official documentation
          </h2>
          <ul className="space-y-1 text-sm">
            {project.resources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-ink underline underline-offset-4"
                >
                  {r.label}{" "}
                  <ExternalLinkIcon className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
