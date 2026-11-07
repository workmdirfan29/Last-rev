import { Link } from "react-router"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LINUX_CHALLENGES } from "@/data/linux/challenges"
import { useLearnerStore } from "@/stores/learner-store"

export function ChallengesPage() {
  const progress = useLearnerStore((s) => s.progress)
  const done = LINUX_CHALLENGES.filter((c) => progress[c.id]?.completed).length

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="max-w-3xl text-sm text-muted-foreground">
          Each challenge starts a fresh practice terminal. Any command line that
          leaves the files in the right state passes, so there is more than one
          way to solve most of them.
        </p>
        <div className="flex items-baseline justify-between text-xs text-muted-foreground">
          <span>
            {done} of {LINUX_CHALLENGES.length} challenges completed
          </span>
        </div>
        <Progress
          value={(done / LINUX_CHALLENGES.length) * 100}
          aria-label="Challenges completed"
        />
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {LINUX_CHALLENGES.map((c, i) => {
          const completed = progress[c.id]?.completed ?? false
          return (
            <li key={c.id}>
              <Link
                to={`/linux/challenges/${c.slug}`}
                className="flex h-full gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {completed ? (
                  <CheckCircle2Icon
                    className="mt-0.5 size-5 shrink-0 text-success"
                    aria-label="Completed"
                  />
                ) : (
                  <CircleIcon
                    className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                    aria-label="Not completed"
                  />
                )}
                <span className="min-w-0 space-y-1">
                  <span className="block text-sm font-medium">
                    <span className="text-muted-foreground tabular-nums">
                      {i + 1}.{" "}
                    </span>
                    {c.title}
                  </span>
                  <span className="block text-xs/relaxed text-muted-foreground">
                    {c.brief}
                  </span>
                  <span className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="secondary" className="capitalize">
                      {c.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Commands {c.commandNumbers.map((n) => `#${n}`).join(", ")}{" "}
                      · about {c.estimatedMinutes} min
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
