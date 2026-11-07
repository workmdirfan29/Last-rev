import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  LightbulbIcon,
  RotateCcwIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { LINUX_CHALLENGES } from "@/data/linux/challenges"
import type { LinuxChallenge } from "@/data/linux/schema"
import { useLearnerStore } from "@/stores/learner-store"
import { checkHolds, describeCheck } from "../engine/checks"
import { TerminalView } from "../terminal/terminal-view"
import { useTerminal } from "../terminal/use-terminal"

export function ChallengePage() {
  const { slug } = useParams()
  const challenge = LINUX_CHALLENGES.find((c) => c.slug === slug)
  if (!challenge) {
    return (
      <EmptyState
        title="Challenge not found"
        description="That challenge is not in the list."
        action={
          <Button asChild>
            <Link to="/linux/challenges">All challenges</Link>
          </Button>
        }
      />
    )
  }
  // Keyed so each challenge gets a fresh terminal and hint state.
  return <Runner key={challenge.id} challenge={challenge} />
}

function Runner({ challenge }: { challenge: LinuxChallenge }) {
  const terminal = useTerminal()
  const completed = useLearnerStore(
    (s) => s.progress[challenge.id]?.completed ?? false
  )
  const toggleCompleted = useLearnerStore((s) => s.toggleCompleted)
  const markViewed = useLearnerStore((s) => s.markViewed)
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionShown, setSolutionShown] = useState(false)

  useEffect(() => {
    void markViewed(challenge.id)
  }, [challenge.id, markViewed])

  // Every check, evaluated against the sandbox as it is right now (re-evaluated after each command).
  const results = challenge.checks.map((check) => ({
    check,
    ok: checkHolds(terminal.sandbox, check),
  }))
  const passed = results.every((r) => r.ok)

  // Record the first pass. Re-running commands never un-completes a finished challenge.
  useEffect(() => {
    if (passed && !completed)
      void toggleCompleted(challenge.id, challenge.estimatedMinutes, "linux")
  }, [
    passed,
    completed,
    challenge.id,
    challenge.estimatedMinutes,
    toggleCompleted,
  ])

  const currentIndex = LINUX_CHALLENGES.findIndex((c) => c.id === challenge.id)
  const next = LINUX_CHALLENGES[currentIndex + 1]

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ms-2">
        <Link to="/linux/challenges">
          <ArrowLeftIcon /> All challenges
        </Link>
      </Button>

      <header className="space-y-1.5">
        <p className="text-xs text-muted-foreground capitalize">
          {challenge.difficulty} · commands{" "}
          {challenge.commandNumbers.map((n) => `#${n}`).join(", ")}
        </p>
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {challenge.title}
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {challenge.brief}
        </p>
      </header>

      <section
        aria-labelledby="checks-heading"
        className="space-y-2 rounded-xl border border-border bg-card p-4"
      >
        <h3 id="checks-heading" className="text-sm font-medium">
          To pass, all of these must be true
        </h3>
        <ul className="space-y-1.5 text-sm">
          {results.map(({ check, ok }) => (
            <li key={describeCheck(check)} className="flex items-start gap-2">
              {ok ? (
                <CheckCircle2Icon
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-label="Done"
                />
              ) : (
                <CircleIcon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-label="Not yet"
                />
              )}
              <span className={ok ? "" : "text-muted-foreground"}>
                <code className="lr-inline-code">{describeCheck(check)}</code>
              </span>
            </li>
          ))}
        </ul>
        {(passed || completed) && (
          <p role="status" className="pt-1 text-sm font-medium text-success">
            {passed
              ? "Challenge complete."
              : "You completed this challenge before. Practise again any time."}
          </p>
        )}
      </section>

      <TerminalView session={terminal} height="h-[40vh]" />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => terminal.reset()}
        >
          <RotateCcwIcon /> Reset terminal
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={hintsShown >= challenge.hints.length}
          onClick={() => setHintsShown((n) => n + 1)}
        >
          <LightbulbIcon /> {hintsShown === 0 ? "Show a hint" : "Another hint"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={solutionShown}
          onClick={() => setSolutionShown((v) => !v)}
        >
          {solutionShown ? "Hide solution" : "Show solution"}
        </Button>
        {passed && next && (
          <Button asChild size="sm" className="ms-auto">
            <Link to={`/linux/challenges/${next.slug}`}>Next challenge</Link>
          </Button>
        )}
      </div>

      {hintsShown > 0 && (
        <ol
          className="list-decimal space-y-1 ps-5 text-sm text-muted-foreground"
          aria-label="Hints"
        >
          {challenge.hints.slice(0, hintsShown).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ol>
      )}
      {solutionShown && (
        <pre
          className="lr-scroll overflow-x-auto rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm"
          aria-label="Solution"
        >
          <span className="text-brand-ink select-none">$ </span>
          {challenge.solution}
        </pre>
      )}
    </div>
  )
}
