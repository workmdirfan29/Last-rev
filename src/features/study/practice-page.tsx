import { useMemo, useState } from "react"
import { Link } from "react-router"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Label } from "@/components/ui/label"
import { getModule } from "@/data/catalog/modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { exerciseDone } from "@/services/study/progress"
import { useLearnerStore } from "@/stores/learner-store"

type Kind = "all" | "run" | "self"

/** Every coding exercise in the ready lessons. JavaScript ones with test cases can be run; the rest are self-check. */
export function PracticePage() {
  const progress = useLearnerStore((s) => s.progress)
  const [moduleId, setModuleId] = useState("all")
  const [kind, setKind] = useState<Kind>("all")

  const all = useMemo(
    () =>
      LESSON_INDEX.flatMap((l) =>
        l.exercises.map((e) => ({ lesson: l, exercise: e }))
      ),
    []
  )
  const modules = [...new Set(all.map((x) => x.lesson.moduleId))]
  const shown = all.filter(
    (x) =>
      (moduleId === "all" || x.lesson.moduleId === moduleId) &&
      (kind === "all" || (kind === "run") === x.exercise.runnable)
  )
  const runnable = all.filter((x) => x.exercise.runnable).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="Practice"
        description={
          all.length === 0
            ? "Coding exercises come with the lessons. None are ready yet."
            : `${all.length} ${all.length === 1 ? "exercise" : "exercises"} in ${new Set(all.map((x) => x.lesson.id)).size} lessons. ${runnable} can be run here in an isolated sandbox (JavaScript); the others are self-check with a reference solution, and are not run by LastRev.`
        }
      />
      {all.length === 0 ? (
        <EmptyState
          title="No exercises yet"
          description="Exercises appear here as lessons are added."
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <Label htmlFor="ex-module">Module</Label>
              <select
                id="ex-module"
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              >
                <option value="all">All modules</option>
                {modules.map((m) => (
                  <option key={m} value={m}>
                    {getModule(m)?.title ?? m}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ex-kind">Kind</Label>
              <select
                id="ex-kind"
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              >
                <option value="all">All exercises</option>
                <option value="run">Can be run here</option>
                <option value="self">Self-check only</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing {shown.length} of {all.length}
          </p>
          <ul className="space-y-2" aria-label="Exercises">
            {shown.map(({ lesson, exercise }) => {
              const done = exerciseDone(
                lesson.moduleId,
                lesson.slug,
                exercise.slug,
                progress
              )
              return (
                <li key={`${lesson.id}.${exercise.slug}`}>
                  <Link
                    to={`/study/practice/${lesson.moduleId}/${lesson.slug}/${exercise.slug}`}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {done ? (
                      <CheckCircle2Icon
                        className="mt-0.5 size-5 shrink-0 text-success"
                        aria-label="Done"
                      />
                    ) : (
                      <CircleIcon
                        className="mt-0.5 size-5 shrink-0 text-muted-foreground/50"
                        aria-label="Not done"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {exercise.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {getModule(lesson.moduleId)?.title} · {lesson.title} ·{" "}
                        {exercise.language}
                      </span>
                    </span>
                    <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
                      {exercise.runnable
                        ? "Runs in the sandbox"
                        : "Not run by LastRev"}
                    </span>
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
