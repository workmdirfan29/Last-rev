import { useMemo } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import { PlayIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { MOCK_TYPE_DEFS } from "@/data/mock/types"
import { useLearnerStore } from "@/stores/learner-store"
import { historyRows } from "./history-page"

/** `/mock`: start a new interview, resume one in progress, see the latest results. */
export function MockHomePage() {
  const sessions = useLearnerStore((s) => s.mockSessions)
  const rows = useMemo(() => historyRows(sessions), [sessions])
  const inProgress = rows.filter((r) => r.session.status === "in-progress")
  const recent = rows
    .filter((r) => r.session.status !== "in-progress")
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Interview Prep"
        title="Mock interview"
        description="Practise answering under a timer, then rate your own answers against the model answers. The score is made of your own ratings and the page shows how."
        actions={
          <>
            <Button asChild>
              <Link to="/mock/new">New mock interview</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/mock/history">History</Link>
            </Button>
          </>
        }
      />

      {inProgress.map(({ session: s }) => (
        <section
          key={s.id}
          aria-label="Interview in progress"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/50 bg-card p-4"
        >
          <div>
            <p className="text-sm font-medium">
              {MOCK_TYPE_DEFS[s.config.type].title} in progress
            </p>
            <p className="text-xs text-muted-foreground">
              Started {format(new Date(s.startedAt), "d MMM, HH:mm")} · question{" "}
              {Math.min(s.current + 1, s.questionIds.length)} of{" "}
              {s.questionIds.length}
              {s.phase === "review" ? " · reviewing your answers" : ""}
            </p>
          </div>
          <Button asChild>
            <Link to={`/mock/${s.id}`}>
              <PlayIcon /> Resume
            </Link>
          </Button>
        </section>
      ))}

      <section aria-labelledby="recent" className="space-y-2">
        <h2 id="recent" className="text-sm font-medium">
          Recent
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No mock interview yet. Start one to see your results here.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {recent.map(({ session: s, score }) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span>
                  {MOCK_TYPE_DEFS[s.config.type].title}{" "}
                  <span className="text-muted-foreground">
                    · {format(new Date(s.startedAt), "d MMM yyyy")} ·{" "}
                    {s.status === "abandoned"
                      ? "abandoned"
                      : score === null
                        ? "not rated"
                        : `score ${Math.round(score)}`}
                  </span>
                </span>
                {s.status === "finished" && (
                  <Link
                    className="underline underline-offset-4"
                    to={`/mock/${s.id}/result`}
                  >
                    Result
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
