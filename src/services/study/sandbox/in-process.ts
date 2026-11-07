import { SANDBOX } from "@/config/study"
import { HARNESS_JS } from "./harness"
import { assembleReport, type RunReport, type SandboxCase } from "./report"

/**
 * Runs the harness in THIS process: for the content gate's tests only (reference solutions are written by the
 * lesson's author and run on a developer machine). It has no isolation and no time limit, and the app never
 * imports it; learners' code only ever runs in the sandbox (`sandbox.ts`).
 */
export async function runCasesInProcess(
  code: string,
  entry: string,
  cases: readonly SandboxCase[]
): Promise<RunReport> {
  const factory = new Function(
    `${HARNESS_JS}\n${code}\n;return { run: __lrRunCases, fn: typeof ${entry} === "function" ? ${entry} : undefined }`
  )
  const { run, fn } = factory() as {
    run: (
      fn: unknown,
      cases: unknown,
      limits: unknown,
      post: (m: unknown) => void
    ) => Promise<void>
    fn: unknown
  }
  const messages: unknown[] = []
  await run(
    fn,
    cases.map((c) => ({ args: c.args, expected: c.expected })),
    {
      maxOutputChars: SANDBOX.maxOutputChars,
      maxConsoleLines: SANDBOX.maxConsoleLines,
    },
    (m) => messages.push(m)
  )
  return assembleReport(messages, cases)
}
