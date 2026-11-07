import { RUN_JS, SANDBOX } from "@/config/study"
import { frameHtml, PROBE_JS, workerSource } from "./harness"
import { assembleReport, type RunReport, type SandboxCase } from "./report"

/**
 * Runs a learner's JavaScript in an isolated sandbox. Three layers, each tested in a real browser:
 *
 *  1. A hidden iframe with `sandbox="allow-scripts"` only: an opaque origin, so no access to this page's DOM,
 *     storage, cookies or IndexedDB.
 *  2. A Content-Security-Policy inside the iframe, `default-src 'none'`: the network boundary. No fetch, XHR,
 *     WebSocket, image, import or form can leave, and a Worker created inside inherits it.
 *  3. The learner's code runs in a Worker inside that iframe. A time limit per case is enforced by terminating the
 *     Worker, so `while (true) {}` is stopped and this page stays responsive.
 *
 * Before the first run in a page visit, a probe Worker checks that isolation really holds in THIS browser (no
 * `document`, no `localStorage`, an opaque origin, and a `data:` fetch is refused, which means the CSP is
 * enforced). If any check fails, nothing is run and the exercise stays self-check only.
 *
 * Not limited: memory. A very large allocation can slow or crash the learner's own tab.
 */
export interface Probe {
  ok: boolean
  reason?: string
}

let probeCache: Promise<Probe> | null = null
export const resetProbeForTests = () => {
  probeCache = null
}

/** Whether this browser could host the sandbox at all (before any probe). */
export function sandboxSupported(): boolean {
  return (
    RUN_JS &&
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof Worker !== "undefined" &&
    typeof Blob !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  )
}

const NOT_ISOLATED =
  "This browser could not prove the code runner is isolated, so code is not run here. You can still use the self-check list."

interface Frame {
  send: (m: Record<string, unknown>) => void
  next: (ms: number) => Promise<unknown>
  messages: unknown[]
  close: () => void
}

/** Create the isolated frame and wait for it to say it is ready. Resolves null when it cannot be created. */
function openFrame(): Promise<Frame | null> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe")
    iframe.setAttribute("sandbox", "allow-scripts")
    iframe.setAttribute("title", "Isolated code runner")
    iframe.setAttribute("aria-hidden", "true")
    iframe.tabIndex = -1
    iframe.style.cssText =
      "position:absolute;width:0;height:0;border:0;visibility:hidden"
    const messages: unknown[] = []
    const waiters: (() => void)[] = []
    let cursor = 0
    let ready = false
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow) return
      const d = e.data as { type?: string } | null
      if (!ready && d?.type === "ready") {
        ready = true
        resolve(frame)
        return
      }
      if (messages.length < 2000) messages.push(e.data)
      waiters.shift()?.()
    }
    const frame: Frame = {
      messages,
      send: (m) => iframe.contentWindow?.postMessage(m, "*"),
      // the next message not yet taken, waiting up to `ms` for one (undefined on timeout)
      next: (ms) =>
        new Promise((res) => {
          if (cursor < messages.length) return res(messages[cursor++])
          const t = setTimeout(() => res(undefined), ms)
          waiters.push(() => {
            clearTimeout(t)
            res(messages[cursor++])
          })
        }),
      close: () => {
        window.removeEventListener("message", onMessage)
        iframe.remove()
      },
    }
    window.addEventListener("message", onMessage)
    iframe.srcdoc = frameHtml(SANDBOX)
    document.body.appendChild(iframe)
    setTimeout(() => {
      if (!ready) {
        frame.close()
        resolve(null)
      }
    }, 4000)
  })
}

async function runProbe(): Promise<Probe> {
  if (!sandboxSupported())
    return {
      ok: false,
      reason: "This browser cannot create an isolated worker.",
    }
  const frame = await openFrame()
  if (!frame) return { ok: false, reason: NOT_ISOLATED }
  try {
    frame.send({ type: "probe", src: PROBE_JS })
    const m = (await frame.next(SANDBOX.caseTimeoutMs + 1000)) as
      Record<string, unknown> | undefined
    const ok =
      m?.type === "probe" &&
      m.noDocument === true &&
      m.noLocalStorage === true &&
      m.opaqueOrigin === true &&
      m.networkBlocked === true
    return ok ? { ok: true } : { ok: false, reason: NOT_ISOLATED }
  } finally {
    frame.close()
  }
}

/** The isolation self-test, run once per page visit and remembered. */
export function probeSandbox(): Promise<Probe> {
  probeCache ??= runProbe()
  return probeCache
}

export interface RunInput {
  code: string
  entry: string
  cases: readonly SandboxCase[]
}

const unavailable = (message: string): RunReport => ({
  status: "unavailable",
  message,
  cases: [],
  logs: [],
  truncated: false,
})

/** Run the code against the cases. Never throws; an unavailable sandbox is a report, not an error. */
export async function runInSandbox(input: RunInput): Promise<RunReport> {
  if (!sandboxSupported())
    return unavailable("Code is not run in this browser.")
  const probe = await probeSandbox()
  if (!probe.ok) return unavailable(probe.reason ?? NOT_ISOLATED)
  const cases = input.cases.slice(0, SANDBOX.maxCases)
  const frame = await openFrame()
  if (!frame) return unavailable(NOT_ISOLATED)
  try {
    frame.send({
      type: "run",
      src: workerSource(input.code, input.entry, cases, SANDBOX),
    })
    const overall = SANDBOX.caseTimeoutMs * (cases.length + 1) + 5000
    const deadline = Date.now() + overall
    let timedOut = false
    for (;;) {
      const left = deadline - Date.now()
      if (left <= 0) {
        frame.send({ type: "stop" })
        timedOut = true
        break
      }
      const m = (await frame.next(left)) as { type?: string } | undefined
      if (m === undefined) {
        frame.send({ type: "stop" })
        timedOut = true
        break
      }
      if (m.type === "done" || m.type === "fatal" || m.type === "unavailable")
        break
      if (m.type === "timeout") {
        timedOut = true
        break
      }
    }
    return assembleReport(frame.messages, cases, { timedOut })
  } finally {
    frame.close()
  }
}
