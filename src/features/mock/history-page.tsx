import { useMemo, useState } from "react"
import { Link } from "react-router"
import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Trash2Icon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MOCK_TYPE_DEFS } from "@/data/mock/types"
import { scoreSession } from "@/services/mock/score"
import { useLearnerStore } from "@/stores/learner-store"
import type { MockSession } from "@/types/learner"

export interface HistoryRow {
  session: MockSession
  score: number | null
  answered: number
}

export function historyRows(sessions: readonly MockSession[]): HistoryRow[] {
  return [...sessions]
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .map((session) => {
      const r = scoreSession(session)
      return { session, score: r.score, answered: r.answered }
    })
}

const STATUS = {
  finished: "Finished",
  abandoned: "Abandoned",
  "in-progress": "In progress",
} as const

/** `/mock/history`: past sessions, and a score-over-time chart drawn only from real finished sessions. */
export function HistoryPage() {
  const sessions = useLearnerStore((s) => s.mockSessions)
  const remove = useLearnerStore((s) => s.deleteMockSession)
  const [deleting, setDeleting] = useState<MockSession | null>(null)
  const rows = useMemo(() => historyRows(sessions), [sessions])
  const points = useMemo(
    () =>
      rows
        .filter((r) => r.session.status === "finished" && r.score !== null)
        .reverse()
        .map((r) => ({
          date: r.session.startedAt,
          label: format(new Date(r.session.startedAt), "d MMM"),
          score: Math.round(r.score!),
        })),
    [rows]
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Mock interview"
        title="History"
        description="Your past mock interviews. Scores are the ratings you gave yourself."
        actions={
          <Button asChild variant="outline">
            <Link to="/mock">Back</Link>
          </Button>
        }
      />

      <section
        aria-labelledby="trend"
        className="space-y-2 rounded-xl border border-border bg-card p-4"
      >
        <h2 id="trend" className="text-sm font-medium">
          Score over time
        </h2>
        {points.length < 2 ? (
          <p className="text-sm text-muted-foreground" data-testid="no-chart">
            {points.length === 0
              ? "No finished and rated mock interview yet."
              : "One rated interview so far. The chart appears after a second."}
          </p>
        ) : (
          <div>
            <div
              className="h-48 w-full"
              role="img"
              aria-label={`Score of each of your ${points.length} rated mock interviews, from ${points[0].score} to ${points[points.length - 1].score}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={points}
                  margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeOpacity={0.6}
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table className="sr-only">
              <caption>Score of each rated mock interview</caption>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.date}>
                    <td>{p.date.slice(0, 10)}</td>
                    <td>{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing here yet.{" "}
          <Link className="underline underline-offset-4" to="/mock/new">
            Start a mock interview
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {rows.map(({ session: s, score, answered }) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {MOCK_TYPE_DEFS[s.config.type].title}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {format(new Date(s.startedAt), "d MMM yyyy, HH:mm")}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {STATUS[s.status]} · {answered} of {s.questionIds.length}{" "}
                  answered
                  {s.status === "finished" &&
                    ` · ${score === null ? "not rated" : `score ${Math.round(score)}`}`}
                </p>
              </div>
              <div className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link
                    to={
                      s.status === "finished"
                        ? `/mock/${s.id}/result`
                        : `/mock/${s.id}`
                    }
                  >
                    {s.status === "finished"
                      ? "Result"
                      : s.status === "in-progress"
                        ? "Resume"
                        : "Open"}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  aria-label={`Delete the ${MOCK_TYPE_DEFS[s.config.type].title} from ${format(new Date(s.startedAt), "d MMM yyyy, HH:mm")}`}
                  onClick={() => setDeleting(s)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this mock interview?</AlertDialogTitle>
            <AlertDialogDescription>
              It is removed from your history and your export. It cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) void remove(deleting.id)
                setDeleting(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
