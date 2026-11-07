import { useEffect, useRef, useState } from "react"
import {
  CheckCircle2Icon,
  MinusCircleIcon,
  PlayIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SANDBOX } from "@/config/study"
import {
  runInSandbox,
  sandboxSupported,
} from "@/services/study/sandbox/sandbox"
import {
  allPassed,
  passedCount,
  type RunReport,
} from "@/services/study/sandbox/report"
import type { StudyExercise } from "@/types/lesson"

/** What the learner is told about running code, in one place. */
export const SANDBOX_NOTE = `Your code runs in an isolated worker: no network, and no access to this page or your data. Each test case gets ${SANDBOX.caseTimeoutMs / 1000} seconds, and a runaway loop is stopped. It cannot limit memory, so a very large allocation can slow this tab. A pass here is your own check of your own code, not an official result.`

/**
 * The editor and test runner of a JavaScript exercise. The code lives only in this component (nothing is stored);
 * Run sends it to the isolated sandbox, which answers with one result per test case. `onPassed` tells the page
 * whether every case passed in this visit.
 */
export function RunnablePanel({
  exercise,
  onPassed,
}: {
  exercise: StudyExercise
  onPassed: (passed: boolean) => void
}) {
  const run = exercise.run!
  const [code, setCode] = useState(exercise.starter)
  const [report, setReport] = useState<RunReport | null>(null)
  const [running, setRunning] = useState(false)
  const [changed, setChanged] = useState(false)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  async function go() {
    setRunning(true)
    onPassed(false)
    const r = await runInSandbox({ code, entry: run.entry, cases: run.cases })
    if (!alive.current) return
    setReport(r)
    setRunning(false)
    setChanged(false)
    onPassed(allPassed(r))
  }

  const total = run.cases.length
  return (
    <div className="space-y-3" data-testid="runnable-panel">
      <div className="space-y-1.5">
        <Label htmlFor={`code-${exercise.slug}`}>
          Your code (JavaScript). Keep the function name{" "}
          <code className="lr-inline-code">{run.entry}</code>.
        </Label>
        <textarea
          id={`code-${exercise.slug}`}
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setChanged(true)
            onPassed(false)
          }}
          rows={Math.min(18, Math.max(8, code.split("\n").length + 1))}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="w-full rounded-lg border border-input bg-[#131316] p-3 font-mono text-[0.8125rem] leading-relaxed text-[#e4e4e7] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => void go()}
          disabled={running || !sandboxSupported()}
        >
          <PlayIcon /> {running ? "Running…" : "Run the tests"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setCode(exercise.starter)
            setReport(null)
            setChanged(false)
            onPassed(false)
          }}
        >
          <RotateCcwIcon /> Back to the starter code
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {total} test cases
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{SANDBOX_NOTE}</p>

      <div
        role="status"
        aria-live="polite"
        data-testid="run-result"
        className="space-y-2"
      >
        {running && (
          <p className="text-sm">
            Checking that the runner is isolated, then running your code…
          </p>
        )}
        {!running && report?.status === "unavailable" && (
          <p
            className="rounded-lg border border-warning/60 p-3 text-sm"
            data-testid="sandbox-unavailable"
          >
            {report.message} Use the self-check list below instead.
          </p>
        )}
        {!running && report && report.status !== "unavailable" && (
          <>
            <p
              className="text-sm font-medium tabular-nums"
              data-testid="run-summary"
            >
              {passedCount(report)} of {total} test cases passed
              {changed ? " (before your latest edit)" : ""}.
              {report.message && report.status !== "ok"
                ? ` ${report.message}`
                : ""}
            </p>
            <ul className="space-y-1.5" aria-label="Test cases">
              {report.cases.map((c) => (
                <li
                  key={c.name}
                  className="rounded-lg border border-border p-2 text-sm"
                >
                  <p className="flex items-center gap-2 font-medium">
                    {c.passed ? (
                      <CheckCircle2Icon
                        className="size-4 text-success"
                        aria-label="Passed"
                      />
                    ) : c.skipped ? (
                      <MinusCircleIcon
                        className="size-4 text-muted-foreground"
                        aria-label="Not run"
                      />
                    ) : (
                      <XCircleIcon
                        className="size-4 text-warning"
                        aria-label="Failed"
                      />
                    )}
                    {c.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      {c.passed
                        ? "passed"
                        : c.skipped
                          ? "not run"
                          : c.timedOut
                            ? "stopped (too slow)"
                            : "failed"}
                    </span>
                  </p>
                  {!c.passed && !c.skipped && (
                    <p className="ms-6 font-mono text-xs text-muted-foreground">
                      {c.error
                        ? `error: ${c.error}`
                        : `returned ${c.actual ?? "nothing"}`}
                      ; expected {c.expected}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            {report.logs.length > 0 && (
              <details open className="text-xs">
                <summary className="cursor-pointer font-medium">
                  Console output{report.truncated ? " (cut short)" : ""}
                </summary>
                <pre
                  tabIndex={0}
                  aria-label="Console output"
                  className="mt-1 overflow-x-auto rounded-lg bg-[#131316] p-2 whitespace-pre-wrap text-[#e4e4e7]"
                >
                  {report.logs.join("\n")}
                </pre>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  )
}
