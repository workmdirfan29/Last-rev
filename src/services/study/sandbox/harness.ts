/**
 * The JavaScript that runs inside the sandbox Worker, as plain text. It is the ONE source of the case runner:
 * the Worker uses it verbatim, and the content gate's tests evaluate the same text in the test process to check
 * that every reference solution passes its own cases. Nothing here touches the network, storage or the page.
 *
 * Learner code is placed after this text in the same Worker script (never `eval`ed), then `__lrRunCases` calls the
 * function named by the exercise's `entry` with each case's JSON arguments and compares the JSON result.
 */
export const HARNESS_JS = String.raw`
function __lrDeepEqual(a, b) {
  if (a === b) return true
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (Array.isArray(a)) return a.length === b.length && a.every(function (x, i) { return __lrDeepEqual(x, b[i]) })
  var ka = Object.keys(a), kb = Object.keys(b)
  return ka.length === kb.length && ka.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && __lrDeepEqual(a[k], b[k]) })
}
async function __lrRunCases(fn, cases, limits, post) {
  var chars = 0, lines = 0
  var saved = { log: console.log, info: console.info, warn: console.warn, error: console.error }
  function capture() {
    if (lines >= limits.maxConsoleLines || chars >= limits.maxOutputChars) { post({ type: "log", truncated: true }); return }
    var s
    try { s = Array.prototype.map.call(arguments, function (a) { return typeof a === "string" ? a : JSON.stringify(a) }).join(" ") } catch (e) { s = "[could not print this value]" }
    s = String(s).slice(0, limits.maxOutputChars - chars)
    chars += s.length; lines++
    post({ type: "log", line: s })
  }
  console.log = console.info = console.warn = console.error = capture
  try {
    if (typeof fn !== "function") { post({ type: "fatal", message: "The function to test was not found. Keep the name used in the starter code." }); return }
    for (var i = 0; i < cases.length; i++) {
      post({ type: "start", i: i })
      try {
        var args = JSON.parse(JSON.stringify(cases[i].args))
        var value = await fn.apply(undefined, args)
        var text
        if (value === undefined) { post({ type: "case", i: i, passed: false, actual: "undefined (nothing was returned)" }); continue }
        if (typeof value === "number" && !isFinite(value)) { post({ type: "case", i: i, passed: false, actual: String(value) + " is not a JSON value" }); continue }
        try { text = JSON.stringify(value) } catch (e) { text = undefined }
        if (text === undefined) { post({ type: "case", i: i, passed: false, actual: "a value that cannot be compared (a function or symbol)" }); continue }
        post({ type: "case", i: i, passed: __lrDeepEqual(JSON.parse(text), cases[i].expected), actual: text.slice(0, 300) })
      } catch (e) {
        post({ type: "case", i: i, passed: false, error: String((e && e.message) || e).slice(0, 300) })
      }
    }
    post({ type: "done" })
  } finally {
    console.log = saved.log; console.info = saved.info; console.warn = saved.warn; console.error = saved.error
  }
}
`

/** Runs in a throwaway Worker before any learner code, to prove the isolation is real in THIS browser. */
export const PROBE_JS = String.raw`
(async function () {
  var r = {
    noDocument: typeof document === "undefined",
    noLocalStorage: typeof localStorage === "undefined",
    opaqueOrigin: self.location.origin === "null",
    networkBlocked: false
  }
  try { await fetch("data:text/plain,x") } catch (e) { r.networkBlocked = true }
  self.postMessage({ type: "probe", noDocument: r.noDocument, noLocalStorage: r.noLocalStorage, opaqueOrigin: r.opaqueOrigin, networkBlocked: r.networkBlocked })
})()
`

/** The Worker script for one run: harness, then the learner's code, then the call. `entry` is a validated identifier. */
export function workerSource(
  code: string,
  entry: string,
  cases: readonly { name: string; args: unknown[]; expected: unknown }[],
  limits: { maxOutputChars: number; maxConsoleLines: number }
): string {
  if (!/^[A-Za-z_$][\w$]*$/.test(entry)) throw new Error("bad entry name")
  const data = JSON.stringify({
    cases: cases.map((c) => ({ args: c.args, expected: c.expected })),
    limits,
  })
  return `${HARNESS_JS}\n${code}\n;(function () {
  var __lrData = ${data}
  __lrRunCases(typeof ${entry} === "function" ? ${entry} : undefined, __lrData.cases, __lrData.limits, function (m) { self.postMessage(m) })
    .catch(function (e) { self.postMessage({ type: "fatal", message: String((e && e.message) || e).slice(0, 300) }) })
})()`
}

/** The page the isolated iframe is built from. Its CSP is the network boundary; see `sandbox.ts`. */
export function frameHtml(limits: { caseTimeoutMs: number }): string {
  const csp =
    "default-src 'none'; script-src 'unsafe-inline'; worker-src blob:; child-src blob:"
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><script>
(function () {
  var LIMIT = ${Math.round(limits.caseTimeoutMs)}
  var worker = null, timer = null, url = null
  function send(m) { parent.postMessage(m, "*") }
  function stop() {
    if (timer) clearTimeout(timer)
    timer = null
    if (worker) { worker.terminate(); worker = null }
    if (url) { URL.revokeObjectURL(url); url = null }
  }
  function arm() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(function () { stop(); send({ type: "timeout" }) }, LIMIT)
  }
  function start(src) {
    stop()
    try {
      url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }))
      worker = new Worker(url)
    } catch (e) { stop(); send({ type: "unavailable", message: "A worker could not be created." }); return }
    worker.onmessage = function (e) {
      arm()
      var d = e.data
      send(d)
      if (d && (d.type === "done" || d.type === "probe" || d.type === "fatal")) stop()
    }
    worker.onerror = function (e) { stop(); send({ type: "fatal", message: String(e.message || "The code could not run").slice(0, 300) }) }
    arm()
  }
  addEventListener("message", function (e) {
    if (e.source !== parent) return
    var m = e.data
    if (m && typeof m.src === "string" && (m.type === "probe" || m.type === "run")) start(m.src)
    if (m && m.type === "stop") stop()
  })
  send({ type: "ready" })
})()
</script>`
}
