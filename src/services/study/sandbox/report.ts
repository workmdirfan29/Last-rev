/** What a run reports, assembled from the Worker's messages. Pure: used by the sandbox and by the gate's tests. */
export interface SandboxCase {
  name: string
  args: unknown[]
  expected: unknown
}

export interface CaseResult {
  name: string
  passed: boolean
  /** The JSON the function returned (cut to 300 characters), when it returned a value. */
  actual?: string
  expected: string
  error?: string
  timedOut?: boolean
  /** Not run because an earlier case stopped the run. */
  skipped?: boolean
}

export type RunStatus = "ok" | "timeout" | "error" | "unavailable"

export interface RunReport {
  status: RunStatus
  message?: string
  cases: CaseResult[]
  logs: string[]
  truncated: boolean
}

const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : undefined

/**
 * Turn the Worker's messages into a report. Messages are untrusted data: only known shapes are read, strings are cut,
 * and at most `maxMessages` are looked at.
 */
export function assembleReport(
  messages: readonly unknown[],
  cases: readonly SandboxCase[],
  finish: { timedOut?: boolean; failure?: string } = {},
  maxMessages = 1000
): RunReport {
  const results: (CaseResult | undefined)[] = cases.map(() => undefined)
  const logs: string[] = []
  let truncated = false
  let started = -1
  let fatal: string | undefined
  let done = false
  for (const raw of messages.slice(0, maxMessages)) {
    if (typeof raw !== "object" || raw === null) continue
    const m = raw as Record<string, unknown>
    if (m.type === "start" && typeof m.i === "number") started = m.i
    else if (
      m.type === "case" &&
      typeof m.i === "number" &&
      m.i >= 0 &&
      m.i < cases.length
    ) {
      results[m.i] = {
        name: cases[m.i].name,
        passed: m.passed === true,
        actual: text(m.actual, 300),
        error: text(m.error, 300),
        expected: JSON.stringify(cases[m.i].expected) ?? "",
      }
    } else if (m.type === "log") {
      if (m.truncated === true) truncated = true
      else if (typeof m.line === "string") logs.push(m.line.slice(0, 2000))
    } else if (m.type === "fatal")
      fatal = text(m.message, 300) ?? "The code could not run."
    else if (m.type === "done") done = true
  }
  const timedIndex =
    finish.timedOut && started >= 0 && !results[started] ? started : -1
  const out: CaseResult[] = cases.map((c, i) => {
    const r = results[i]
    if (r) return r
    const base = {
      name: c.name,
      passed: false,
      expected: JSON.stringify(c.expected) ?? "",
    }
    if (i === timedIndex)
      return {
        ...base,
        timedOut: true,
        error: "Took too long and was stopped.",
      }
    return { ...base, skipped: true }
  })
  const status: RunStatus = finish.failure
    ? "unavailable"
    : finish.timedOut
      ? "timeout"
      : fatal
        ? "error"
        : done
          ? "ok"
          : "error"
  return {
    status,
    message:
      finish.failure ??
      (finish.timedOut
        ? "The code took too long and was stopped."
        : (fatal ?? (done ? undefined : "The code stopped before finishing."))),
    cases: out,
    logs,
    truncated,
  }
}

export const passedCount = (r: RunReport) =>
  r.cases.filter((c) => c.passed).length
export const allPassed = (r: RunReport) =>
  r.status === "ok" && r.cases.length > 0 && r.cases.every((c) => c.passed)
