import { useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router"
import { format } from "date-fns"
import { CopyIcon, PrinterIcon } from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
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
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { SCORE_CAPTION } from "@/data/mock/rubric"
import { MOCK_TYPE_DEFS } from "@/data/mock/types"
import { scoreSession } from "@/services/mock/score"
import { formatClock } from "@/services/mock/session"
import { summaryText } from "@/services/mock/summary"
import { useLearnerStore } from "@/stores/learner-store"
import { FormulaPanel } from "./formula-panel"
import { useMockItems } from "./use-mock-items"
import { useMockSession } from "./use-session"

const r0 = (n: number) => Math.round(n)
const STATUS_LABEL = {
  strong: "Strong",
  weak: "Weak",
  middle: "In between",
  "not-enough": "Not enough answers",
} as const

/** `/mock/:id/result`: the score and exactly how it was calculated, per module, strong and weak areas, what to do next. */
export function ResultPage() {
  const { id = "" } = useParams()
  const session = useMockSession(id)
  const { items, ready } = useMockItems(session)
  const roleId = useLearnerStore(
    (s) =>
      s.profile?.primaryRole ??
      s.profile?.selectedRoles[0] ??
      "frontend-developer"
  )
  const setFlag = useLearnerStore((s) => s.setFlag)
  const [confirming, setConfirming] = useState(false)
  const result = useMemo(
    () => (session ? scoreSession(session) : null),
    [session]
  )

  if (!session || !result)
    return (
      <EmptyState
        title="Mock interview not found"
        action={
          <Button asChild>
            <Link to="/mock">Back to mock interviews</Link>
          </Button>
        }
      />
    )
  if (session.status === "in-progress")
    return <Navigate to={`/mock/${id}`} replace />
  if (!ready) return <ScreenLoader />

  const titleOf = (qid: string) => items.get(qid)?.title ?? qid
  const moduleTitle = (m: string) => MODULE_BY_ID.get(m)?.title ?? m
  const def = MOCK_TYPE_DEFS[session.config.type]
  const revise = [...new Set([...result.weakQuestions, ...result.unanswered])]
  const weakByModule = new Map<string, number>()
  for (const q of result.weakQuestions) {
    const m = q.split(".")[0]
    weakByModule.set(m, (weakByModule.get(m) ?? 0) + 1)
  }
  const gap = result.asked - result.rated

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        summaryText(session!, result!, titleOf, moduleTitle)
      )
      toast("Summary copied to your clipboard")
    } catch {
      toast("Could not copy. Use Print instead, or select the text.")
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Mock interview result"
        title={def.title}
        description={`${format(new Date(session.startedAt), "d MMM yyyy, HH:mm")} · ${result.asked} questions${result.asked < result.requested ? ` (only ${result.asked} were available for these settings)` : ""} · ${formatClock(result.secondsAnswering)} used of ${session.config.durationMinutes}:00`}
        actions={
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" onClick={() => void copy()}>
              <CopyIcon /> Copy summary as text
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <PrinterIcon /> Print
            </Button>
          </div>
        }
      />

      <section aria-label="Score" className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">
            Score on the questions you answered and rated
          </p>
          <p
            className="font-heading text-4xl font-semibold tabular-nums"
            data-testid="score"
          >
            {result.score === null ? "No score" : `${r0(result.score)} / 100`}
          </p>
          <p className="text-xs text-muted-foreground">
            {result.answered} of {result.asked} answered · {result.rated} rated
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">
            If the {gap} unanswered or unrated{" "}
            {gap === 1 ? "question" : "questions"} counted as zero
          </p>
          <p
            className="font-heading text-4xl font-semibold tabular-nums"
            data-testid="score-zero"
          >
            {result.scoreIfZero === null
              ? "No score"
              : `${r0(result.scoreIfZero)} / 100`}
          </p>
          <p className="text-xs text-muted-foreground">
            The score above leaves them out; this line counts them.
          </p>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          {SCORE_CAPTION}
        </p>
      </section>

      <details
        open
        className="print:open rounded-xl border border-border bg-card p-4"
      >
        <summary className="cursor-pointer text-sm font-medium">
          How this score is calculated
        </summary>
        <div className="mt-4">
          <FormulaPanel session={session} result={result} titleOf={titleOf} />
        </div>
      </details>

      {result.dimensions.length > 0 && (
        <section aria-labelledby="dims" className="space-y-2">
          <h2 id="dims" className="text-sm font-medium">
            Your ratings by dimension
          </h2>
          <table className="w-full text-sm">
            <caption className="sr-only">
              Average of your own ratings per dimension
            </caption>
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th scope="col" className="text-start font-normal">
                  Dimension
                </th>
                <th scope="col" className="text-end font-normal">
                  Average (1 to 5)
                </th>
                <th scope="col" className="text-end font-normal">
                  Ratings
                </th>
              </tr>
            </thead>
            <tbody>
              {result.dimensions.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <th scope="row" className="py-1.5 text-start font-normal">
                    {d.label}
                  </th>
                  <td className="py-1.5 text-end tabular-nums">
                    {Math.round(d.average * 10) / 10}
                  </td>
                  <td className="py-1.5 text-end tabular-nums">{d.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section aria-labelledby="mods" className="space-y-2">
        <h2 id="mods" className="text-sm font-medium">
          Module-wise performance
        </h2>
        <table className="w-full text-sm">
          <caption className="sr-only">Mean points per module</caption>
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th scope="col" className="text-start font-normal">
                Module
              </th>
              <th scope="col" className="text-end font-normal">
                Asked
              </th>
              <th scope="col" className="text-end font-normal">
                Rated
              </th>
              <th scope="col" className="text-end font-normal">
                Mean points
              </th>
              <th scope="col" className="text-end font-normal">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {result.modules.map((m) => (
              <tr key={m.moduleId} className="border-t border-border">
                <th scope="row" className="py-1.5 text-start font-normal">
                  {moduleTitle(m.moduleId)}
                </th>
                <td className="py-1.5 text-end tabular-nums">{m.asked}</td>
                <td className="py-1.5 text-end tabular-nums">{m.rated}</td>
                <td className="py-1.5 text-end tabular-nums">
                  {m.mean === null ? "-" : r0(m.mean)}
                </td>
                <td className="py-1.5 text-end">{STATUS_LABEL[m.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">
          Strong: {session.rubric.strongAt} or more. Weak: below{" "}
          {session.rubric.weakBelow}. A module needs at least{" "}
          {session.rubric.minRated} rated questions to be labelled.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="strong" className="space-y-1.5">
          <h2 id="strong" className="text-sm font-medium">
            Strong areas
          </h2>
          {result.strong.length === 0 ? (
            <p className="text-sm text-muted-foreground">None yet.</p>
          ) : (
            <ul className="list-disc ps-5 text-sm">
              {result.strong.map((m) => (
                <li key={m}>{moduleTitle(m)}</li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="weak" className="space-y-1.5">
          <h2 id="weak" className="text-sm font-medium">
            Weak areas
          </h2>
          {result.weak.length === 0 ? (
            <p className="text-sm text-muted-foreground">None yet.</p>
          ) : (
            <ul className="list-disc ps-5 text-sm">
              {result.weak.map((m) => (
                <li key={m}>{moduleTitle(m)}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {(result.unanswered.length > 0 || result.unrated.length > 0) && (
        <section aria-labelledby="gaps" className="space-y-2">
          <h2 id="gaps" className="text-sm font-medium">
            Unanswered and unrated
          </h2>
          {result.unanswered.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                Unanswered ({result.unanswered.length}): no points, not counted
                in the score.
              </p>
              <ul className="list-disc ps-5 text-sm">
                {result.unanswered.map((q) => (
                  <li key={q}>
                    <Link
                      className="underline underline-offset-4"
                      to={`/interview/question/${q}`}
                    >
                      {titleOf(q)}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {result.unrated.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                Answered but not rated ({result.unrated.length}): no points.
              </p>
              <ul className="list-disc ps-5 text-sm">
                {result.unrated.map((q) => (
                  <li key={q}>{titleOf(q)}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <section aria-labelledby="next" className="space-y-2 print:hidden">
        <h2 id="next" className="text-sm font-medium">
          What to do next
        </h2>
        <ul className="list-disc space-y-1 ps-5 text-sm">
          {[...weakByModule.entries()].map(([m, n]) => (
            <li key={m}>
              <Link
                className="underline underline-offset-4"
                to={`/interview/${roleId}/${m}`}
              >
                Revise {moduleTitle(m)}
              </Link>{" "}
              ({n} {n === 1 ? "answer" : "answers"} below{" "}
              {session.rubric.weakBelow})
            </li>
          ))}
          {result.unanswered.length > 0 && (
            <li>
              Practise the {result.unanswered.length}{" "}
              {result.unanswered.length === 1 ? "question" : "questions"} you
              did not answer (listed above).
            </li>
          )}
          <li>
            <Link className="underline underline-offset-4" to="/dashboard">
              Open your plan
            </Link>
          </li>
        </ul>
        {revise.length > 0 && (
          <Button variant="outline" onClick={() => setConfirming(true)}>
            Add {revise.length} {revise.length === 1 ? "question" : "questions"}{" "}
            to my revision queue
          </Button>
        )}
      </section>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button asChild>
          <Link to={`/mock/new?from=${session.id}`}>
            Start another with the same settings
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/mock">Back to mock interviews</Link>
        </Button>
      </div>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Add these to your revision queue?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The questions you answered below {session.rubric.weakBelow} points
              and the ones you did not answer. Questions already in your queue
              stay there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="max-h-48 list-disc overflow-auto ps-5 text-sm">
            {revise.map((q) => (
              <li key={q}>{titleOf(q)}</li>
            ))}
          </ul>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void Promise.all(
                  revise.map((q) => setFlag(q, "revision", true))
                ).then(() =>
                  toast(`${revise.length} added to your revision queue`)
                )
                setConfirming(false)
              }}
            >
              Add to revision queue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
