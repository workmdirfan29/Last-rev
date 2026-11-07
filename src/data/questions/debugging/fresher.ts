import { defineQuestions } from "../author"
import { q } from "../compact"

const MDN = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference"
const DT = "https://developer.chrome.com/docs/devtools"
const ND = "https://nodejs.org"
const VS = "https://code.visualstudio.com/docs"
const GIT = "https://git-scm.com/docs"
const MAN = "https://man7.org/linux/man-pages"

export default defineQuestions("debugging", "fresher", [
  q({
    slug: "systematic-debugging-process",
    topic: "Root-cause analysis",
    d: "easy",
    title: "What is a good step-by-step process for debugging a problem?",
    kw: [
      "debugging process",
      "reproduce",
      "hypothesis",
      "isolate",
      "root cause",
    ],
    intent:
      "A foundation question: checks you debug methodically instead of guessing.",
    short:
      "Debug in a loop of evidence rather than guesses. First reproduce the problem reliably and write down the exact steps, input and environment. Gather evidence from error messages, logs and stack traces. Form a hypothesis about the cause, then test it by narrowing the problem: isolate the failing component, simplify the input, or bisect the code or history to find where behaviour changed. Fix the root cause, not only the symptom, confirm the fix by repeating the reproduction, and add a test so that it cannot silently come back.",
    detail: [
      "Change one thing at a time so you know what made the difference.",
      "Explaining the problem aloud to someone (rubber ducking) often reveals the cause.",
      "Take notes; long investigations are easy to lose track of.",
    ],
    ex: "A checkout bug is reproduced with one product, narrowed to the discount calculation, fixed, and a regression test is added.",
    mistakes: [
      "Changing many things at once.",
      "Fixing the symptom and not the cause.",
    ],
    follow: ["Why add a test after fixing a bug?"],
    points: [
      "Reproduce first",
      "Gather evidence",
      "Hypothesise and test",
      "Fix the root cause and add a test",
    ],
    notes: ["Reproduce, isolate, fix, prevent."],
    src: [
      [
        "MDN: What went wrong? Troubleshooting JavaScript",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_went_wrong",
      ],
      ["Git: git-bisect", `${GIT}/git-bisect`],
    ],
  }),
  q({
    slug: "reproducing-bugs-reliably",
    topic: "Reproducing bugs",
    d: "easy",
    title: "How do you reproduce a bug that someone reported?",
    kw: [
      "reproduce bug",
      "steps to reproduce",
      "environment",
      "minimal example",
      "bug report",
    ],
    intent: "Checks you can turn a vague report into a repeatable case.",
    short:
      "Collect the exact steps, input data, user account or role, browser or device, app version and time, plus any error message or screenshot, and ask for what was expected and what happened. Try to recreate it in the same environment: same version, configuration and data shape. If it does not happen, look for differences, such as environment variables, data volume, permissions, time zone or concurrent activity. Then reduce it to a minimal reproduction with the fewest steps and smallest data, ideally as a failing automated test, which makes it easy to debug, to fix and to verify.",
    detail: [
      "Logs and a request id from the report help to find the exact occurrence.",
      "Intermittent bugs often involve timing, caching or shared state.",
      "A bug you cannot reproduce can still be investigated through logs and monitoring.",
    ],
    ex: "A user reports a blank page; the report says Safari on iOS, which reveals a missing browser feature.",
    mistakes: [
      "Trying to fix before reproducing.",
      "Not asking for the app version and environment.",
    ],
    follow: ["What if the bug only happens in production?"],
    points: [
      "Exact steps, data and environment",
      "Match the environment",
      "Look for differences if it won't reproduce",
      "Reduce to a minimal failing case",
    ],
    notes: ["A reproducible bug is half fixed."],
    src: [
      [
        "MDN: What went wrong? Troubleshooting JavaScript",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_went_wrong",
      ],
      ["Git: git-bisect", `${GIT}/git-bisect`],
    ],
  }),
  q({
    slug: "reading-stack-traces",
    topic: "Stack traces",
    d: "easy",
    title: "How do you read a stack trace?",
    kw: [
      "stack trace",
      "call stack",
      "error message",
      "file and line",
      "top frame",
    ],
    intent:
      "A core debugging skill: checks you can use a trace to locate a fault.",
    short:
      "A stack trace lists the chain of function calls active when an error occurred, from the point where it was thrown, usually the top, down through each caller to the entry point. Start with the error type and message, which say what went wrong, such as `TypeError: Cannot read properties of undefined`. Then find the first frame in your own code, not in a library, with its file and line number, and read the code there and the values flowing into it. Frames further down show how the program got there. In JavaScript the trace is available as `error.stack`, and in Java and Python it is printed by default.",
    detail: [
      "In async code the trace may be shortened, but modern engines keep async frames.",
      "Source maps translate minified traces back to original code.",
      "Wrapped errors should keep the original as `cause`.",
    ],
    ex: "The first frame in the app's code is `at getTotal (cart.js:42)`, which points straight to the failing line.",
    mistakes: [
      "Reading only the message and ignoring where it was thrown.",
      "Staring at library frames instead of the first frame in your code.",
    ],
    follow: ["What do source maps do for stack traces?"],
    points: [
      "Message says what, frames say where",
      "Find the first frame in your code",
      "Lower frames show the call path",
      "error.stack in JavaScript",
    ],
    notes: ["Message, then first of your frames."],
    src: [
      ["MDN: Error.prototype.stack", `${MDN}/Global_Objects/Error/stack`],
      ["Chrome DevTools: Source maps", `${DT}/javascript/source-maps`],
    ],
  }),
  q({
    slug: "common-javascript-errors",
    topic: "Stack traces",
    d: "easy",
    title:
      "What do common JavaScript errors such as TypeError and ReferenceError mean?",
    kw: [
      "TypeError",
      "ReferenceError",
      "SyntaxError",
      "undefined property",
      "error types",
    ],
    intent: "Checks you can decode frequent error messages.",
    short:
      "A `ReferenceError` means a variable is used that is not declared or is in the temporal dead zone, such as `x is not defined`. A `TypeError` means a value is not of the type an operation needs, for example 'Cannot read properties of undefined (reading name)' when accessing a property on `undefined`, or 'x is not a function'. A `SyntaxError` means the code cannot be parsed, such as a missing bracket or invalid JSON in `JSON.parse`. A `RangeError` is a value outside an allowed range, such as infinite recursion causing 'Maximum call stack size exceeded'. The message normally names the exact property or variable, which points at the fix.",
    detail: [
      "Trace where the `undefined` came from: a missing response field, an unset variable or a wrong key.",
      "Optional chaining `?.` and defaults reduce such crashes, but should not hide real bugs.",
      "MDN documents each error message with causes.",
    ],
    ex: "`Cannot read properties of undefined (reading 'name')` appears because `user` is undefined before the data has loaded.",
    mistakes: [
      "Silencing errors with optional chaining without understanding why the value is missing.",
      "Parsing invalid JSON without try/catch.",
    ],
    follow: ["What causes 'Maximum call stack size exceeded'?"],
    points: [
      "ReferenceError: undeclared name",
      "TypeError: wrong type or undefined",
      "SyntaxError: unparseable code",
      "RangeError: out of range, e.g. recursion",
    ],
    notes: ["Read the exact name in the message."],
    src: [
      ["MDN: JavaScript error reference", `${MDN}/Errors`],
      ["MDN: Error", `${MDN}/Global_Objects/Error`],
    ],
  }),
  q({
    slug: "console-logging-techniques",
    topic: "Debugging tools",
    d: "easy",
    title: "How do you debug effectively with console methods?",
    kw: [
      "console.log",
      "console.table",
      "console.trace",
      "console.error",
      "labelled logs",
    ],
    intent: "Checks you use the console beyond bare console.log.",
    short:
      '`console.log` is the quickest way to inspect values, but make it informative: label the output (`console.log("cart", cart)`) rather than logging bare values. `console.table` shows arrays of objects as a table, `console.error` and `console.warn` separate severity, `console.group` indents related output, `console.time` and `timeEnd` measure durations, and `console.trace` prints the call stack to show how a function was reached. Logging objects shows a live reference in some consoles, so log a copy when you need the value at that moment. Remove debug logs before shipping, or use a logger with levels.',
    detail: [
      "Log inputs and outputs at boundaries to bisect where data goes wrong.",
      "`console.assert` logs only if a condition is false.",
      "A breakpoint often gives more insight than many logs.",
    ],
    ex: "`console.table(users)` immediately shows which row has a missing field.",
    mistakes: ["Leaving console.log in production code.", "Logging secrets."],
    follow: ["How do you see the call stack with console?"],
    points: [
      "Label your logs",
      "table, group, time, trace",
      "Log a copy for a snapshot in time",
      "Prefer breakpoints for complex flow",
    ],
    notes: ["Label, group, trace."],
    src: [
      [
        "MDN: console",
        "https://developer.mozilla.org/en-US/docs/Web/API/console",
      ],
      ["Chrome DevTools: Console", `${DT}/console`],
    ],
  }),
  q({
    slug: "browser-devtools-breakpoints",
    topic: "Debugging tools",
    d: "medium",
    title:
      "How do you debug JavaScript with breakpoints in the browser DevTools?",
    kw: [
      "breakpoints",
      "step over into out",
      "watch expressions",
      "call stack panel",
      "conditional breakpoint",
    ],
    intent: "Checks you can pause code and inspect state.",
    short:
      "In Chrome DevTools open the Sources panel, click a line number to set a breakpoint (or write the `debugger;` statement), and reload or trigger the action. Execution pauses on that line, and you can inspect local and closure variables in the Scope pane, watch expressions, and the Call Stack pane. Step over runs the next line, step into enters a function call, step out finishes the current function, and resume continues. Conditional breakpoints pause only when an expression is true, logpoints print without editing code, and 'pause on exceptions' stops where an error is thrown. Source maps let you debug original code rather than bundles.",
    detail: [
      "DOM and XHR/fetch breakpoints pause when the DOM changes or a request is made.",
      "Blackboxing hides library code from the call stack.",
      "Edit and test expressions in the Console while paused.",
    ],
    ex: "A conditional breakpoint `item.price < 0` pauses the loop only when a bad price appears.",
    mistakes: [
      "Stepping through thousands of iterations instead of using a conditional breakpoint.",
      "Forgetting to remove debugger statements.",
    ],
    follow: ["What does step into do?"],
    points: [
      "Click a line or use debugger;",
      "Inspect scope, watch, call stack",
      "Step over, into, out",
      "Conditional breakpoints and logpoints",
    ],
    notes: ["Pause, inspect, step."],
    src: [
      ["Chrome DevTools: Debug JavaScript", `${DT}/javascript`],
      ["MDN: debugger statement", `${MDN}/Statements/debugger`],
    ],
  }),
  q({
    slug: "network-panel-debugging",
    topic: "Debugging tools",
    d: "medium",
    title: "How do you debug an API call failing in the browser?",
    kw: [
      "network panel",
      "status code",
      "request payload",
      "cors error",
      "response body",
    ],
    intent: "Checks you can inspect requests and responses.",
    short:
      "Open the Network panel, reproduce the action and click the failing request. Check the method and URL, the status code, request headers (such as `Authorization` and `Content-Type`), the request payload, and the response headers and body, which often contain the server's error message. A red request with no response may be a network failure or a CORS block (the Console explains it); a 401 or 403 points at authentication; a 400 or 422 at the payload; a 500 at a server fault to find in the server logs. 'Copy as cURL' reproduces the request in a terminal, and throttling simulates slow networks.",
    detail: [
      "A preflight OPTIONS request appears before some cross-origin calls.",
      "Check the timing tab for slow phases like waiting (server time).",
      "Disable cache while DevTools is open when debugging caching.",
    ],
    ex: 'The payload shows `{"quantity": "2"}` as a string, explaining a 422 from the API.',
    mistakes: [
      "Blaming the server before checking the request payload.",
      "Ignoring the preflight request.",
    ],
    follow: ["What does 'Copy as cURL' help with?"],
    points: [
      "Status, headers, payload, response",
      "CORS errors show in the console",
      "Copy as cURL to replay",
      "Timing shows where time goes",
    ],
    notes: ["Inspect the request before blaming the server."],
    src: [
      [
        "Chrome DevTools: Network features reference",
        `${DT}/network/reference`,
      ],
      ["Chrome DevTools: Inspect network activity", `${DT}/network`],
    ],
  }),
  q({
    slug: "react-debugging-devtools-strict-mode",
    topic: "Debugging tools",
    d: "medium",
    title:
      "How do you debug a React component that renders wrongly or too often?",
    kw: [
      "react devtools",
      "components tab",
      "strict mode",
      "props and state",
      "re-renders",
    ],
    intent: "Checks you can inspect React-specific problems.",
    short:
      "Install React Developer Tools to inspect the component tree, with each component's props, state, context and hooks, and edit them live. The Profiler shows which components rendered and why. Check the basics first: is the prop or state value what you expect, is a key missing or unstable in a list, is an effect missing a dependency, and is state being mutated instead of replaced? Strict Mode renders components twice and re-runs effects in development to expose impure rendering and missing cleanup, so a double log in development is expected. Read the console warnings, which are often specific.",
    detail: [
      "Stale values in effects or event handlers come from closures over old state.",
      "Rendering must be pure: no side effects during render.",
      "Error boundaries catch rendering errors and show a fallback.",
    ],
    ex: "A list flickers because it uses array index as the key; stable ids fix it.",
    mistakes: [
      "Mutating state directly.",
      "Debugging production behaviour with development double-renders in mind.",
    ],
    follow: ["Why does Strict Mode render twice?"],
    points: [
      "React DevTools: components and profiler",
      "Check props, state, keys, effect deps",
      "Strict Mode exposes impurity",
      "Error boundaries for fallback",
    ],
    notes: ["Inspect props and state first."],
    src: [
      [
        "React: React Developer Tools",
        "https://react.dev/learn/react-developer-tools",
      ],
      ["React: StrictMode", "https://react.dev/reference/react/StrictMode"],
    ],
  }),
  q({
    slug: "node-debugging-inspector-vscode",
    topic: "Debugging tools",
    d: "medium",
    title:
      "How do you debug a Node.js application with the inspector and VS Code?",
    kw: [
      "node --inspect",
      "vs code debugger",
      "launch.json",
      "attach",
      "breakpoints",
    ],
    intent: "Checks you can step through server code.",
    short:
      "Start Node with `node --inspect server.js` (or `--inspect-brk` to pause on the first line), which opens the inspector protocol on a port; then attach Chrome DevTools via `chrome://inspect` or a debugger in your editor. In VS Code you can launch the app under the debugger with a `launch.json` configuration or its JavaScript Debug Terminal, set breakpoints in the editor, and use the Variables, Watch and Call Stack views, conditional breakpoints and logpoints. Never expose the inspector port to untrusted networks, because it allows arbitrary code execution; bind it to localhost and use SSH tunnelling for remote debugging.",
    detail: [
      "`node inspect` offers a command-line debugger.",
      "Attach to a running process started with `--inspect`.",
      "Source maps let TypeScript be debugged as written.",
    ],
    ex: "A developer sets a breakpoint in a route handler in VS Code and steps through the request logic.",
    mistakes: [
      "Exposing the debug port publicly.",
      "Debugging compiled output without source maps.",
    ],
    follow: ["Why is --inspect risky on a server?"],
    points: [
      "node --inspect and --inspect-brk",
      "Attach with Chrome or VS Code",
      "launch.json configurations",
      "Keep the port private",
    ],
    notes: ["Inspect locally, tunnel remotely."],
    src: [
      ["Node.js: Debugging", `${ND}/en/learn/getting-started/debugging`],
      ["VS Code: Node.js debugging", `${VS}/nodejs/nodejs-debugging`],
      ["VS Code: Debugging", `${VS}/debugtest/debugging`],
    ],
  }),
  q({
    slug: "python-and-java-debugging-basics",
    topic: "Debugging tools",
    d: "medium",
    title: "How do you debug Python and Java programs?",
    kw: ["pdb", "breakpoint()", "traceback", "jdb", "ide debugger"],
    intent: "Checks you know the standard debuggers beyond JavaScript.",
    short:
      "In Python, read the traceback, which lists calls from oldest to most recent with the exception last, and use the built-in debugger: call `breakpoint()` to drop into `pdb`, where `n` steps over, `s` steps into, `c` continues, `p expr` prints a value and `where` shows the stack. IDEs such as VS Code and PyCharm provide graphical breakpoints. In Java, the exception stack trace names the throwing method and line, and IDE debuggers (IntelliJ, VS Code) set breakpoints, step through and evaluate expressions; command-line tools like `jdb`, `jstack` (thread dumps) and `jcmd` help with running JVMs.",
    detail: [
      "Python prints the most recent call last; Java prints the throw point first.",
      "A thread dump shows what every thread is doing, useful for hangs and deadlocks.",
      "`python -m pdb script.py` runs a script under the debugger.",
    ],
    ex: "Adding `breakpoint()` before a suspicious line in Python opens an interactive prompt at that point.",
    mistakes: [
      "Reading a Python traceback from the top and missing the actual error at the bottom.",
      "Ignoring thread dumps for hanging Java processes.",
    ],
    follow: ["How do you get a Java thread dump?"],
    points: [
      "Python: traceback and breakpoint()/pdb",
      "Java: stack trace and IDE debugger",
      "jstack for thread dumps",
      "Step, inspect, evaluate",
    ],
    notes: ["Python's error is at the bottom."],
    src: [
      ["Python: pdb", "https://docs.python.org/3/library/pdb.html"],
      ["Python: traceback", "https://docs.python.org/3/library/traceback.html"],
      [
        "Oracle: jstack",
        "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html",
      ],
    ],
  }),
  q({
    slug: "reading-logs-to-debug",
    topic: "Reading logs",
    d: "easy",
    title: "How do you use logs to find the cause of a problem?",
    kw: ["reading logs", "log levels", "timestamps", "request id", "grep logs"],
    intent: "Checks you can navigate logs under pressure.",
    short:
      "Start by pinning down when the problem happened and which component was involved, then read the logs around that time. Look first at ERROR and WARN entries and the first error in a sequence, since later errors are often consequences. Filter with `grep` or a log search tool by request id, user id or error text to follow one request across lines and services. Follow logs live with `tail -f` or `journalctl -f` while reproducing the problem. Check what changed at that time, such as a deployment or configuration change, and compare with a normal period.",
    detail: [
      "A missing log line can be a clue as well as the presence of one.",
      "Check timestamps and time zones when comparing logs from different systems.",
      "Context fields in structured logs make filtering faster.",
    ],
    ex: "Searching the logs for the request id of a failed checkout reveals a payment timeout in a downstream service.",
    mistakes: [
      "Reading from the end and blaming the last error.",
      "Ignoring time zones across systems.",
    ],
    follow: ["Why look for the first error?"],
    points: [
      "Narrow the time window",
      "Find the first error",
      "Filter by request id",
      "Follow logs live while reproducing",
    ],
    notes: ["First error, then trace by id."],
    src: [
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
      [
        "OWASP: Logging Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
      ],
    ],
  }),
  q({
    slug: "five-whys-root-cause-analysis",
    topic: "Root-cause analysis",
    d: "medium",
    title:
      "What is root-cause analysis, and how does the 'five whys' technique work?",
    kw: [
      "root cause analysis",
      "five whys",
      "postmortem",
      "contributing factors",
      "blameless",
    ],
    intent: "Checks you look past the immediate trigger.",
    short:
      "Root-cause analysis asks why a failure happened until you reach causes you can fix to stop it recurring, instead of treating the first visible symptom. The 'five whys' technique repeats the question: the site was down because the server ran out of disk; why? Logs grew without rotation; why? No rotation was configured; why? The setup had no checklist; why? Real incidents often have several contributing factors, not a single cause, so write them all down. Do it in a blameless way focused on systems and processes, record the timeline, and turn findings into concrete actions such as alerts, tests or automation.",
    detail: [
      "A fix for the symptom (delete logs) differs from a fix for the cause (rotation and alerting).",
      "Postmortems share lessons across the team.",
      "Track actions to completion.",
    ],
    ex: "An outage caused by a full disk leads to log rotation, a disk alert and a server setup checklist.",
    mistakes: [
      "Stopping at the first answer.",
      "Blaming a person instead of fixing the process.",
    ],
    follow: ["Why blameless?"],
    points: [
      "Ask why repeatedly",
      "Several contributing factors",
      "Blameless, system focus",
      "End with actions",
    ],
    notes: ["Fix the cause, not the symptom."],
    src: [
      [
        "Git: git-bisect (finding the change that broke things)",
        `${GIT}/git-bisect`,
      ],
      ["Kubernetes: Debugging", "https://kubernetes.io/docs/tasks/debug/"],
    ],
  }),
  q({
    slug: "git-bisect-find-regression",
    topic: "Root-cause analysis",
    d: "medium",
    title:
      "How does git bisect help you find the commit that introduced a bug?",
    kw: [
      "git bisect",
      "regression",
      "binary search",
      "good and bad commit",
      "bisect run",
    ],
    intent: "Checks you can use history to locate a regression.",
    short:
      "`git bisect` performs a binary search through history. Start with `git bisect start`, mark the current broken commit with `git bisect bad` and a known working commit with `git bisect good <commit>`; Git checks out a commit halfway between, you test it and mark it good or bad, and after about log2(n) steps it names the first bad commit. `git bisect run ./test.sh` automates it with a script that exits 0 for good and non-zero for bad. Finish with `git bisect reset`. It works best with small commits and a quick, reliable test.",
    detail: [
      "The first bad commit shows exactly which change to examine.",
      "Skip commits that cannot be tested with `git bisect skip`.",
      "Frequent small commits make bisecting efficient.",
    ],
    ex: "Among 200 commits, bisect finds the one that broke the login test in about eight steps.",
    code: [
      [
        "Automated bisect",
        "bash",
        `git bisect start\ngit bisect bad\ngit bisect good v1.4.0\ngit bisect run npm test\ngit bisect reset`,
        [
          "Mark the endpoints of the search.",
          "`run` tests each step automatically.",
          "`reset` returns to the original branch.",
        ],
      ],
    ],
    mistakes: [
      "Marking a commit wrongly, which sends the search the wrong way.",
      "Forgetting to reset.",
    ],
    follow: ["How many steps does bisecting 200 commits take?"],
    points: [
      "Binary search of history",
      "Mark good and bad",
      "bisect run automates",
      "Result: first bad commit",
    ],
    notes: ["Halve the history each step."],
    src: [
      ["Git: git-bisect", `${GIT}/git-bisect`],
      ["Git: git-blame", `${GIT}/git-blame`],
    ],
  }),
  q({
    slug: "debug-intermittent-and-race-bugs",
    topic: "Reproducing bugs",
    d: "hard",
    title: "How do you approach an intermittent bug, such as a race condition?",
    kw: [
      "intermittent bug",
      "race condition",
      "heisenbug",
      "timing",
      "reproduce under load",
    ],
    intent: "Checks you can handle the hardest class of bugs.",
    short:
      "Intermittent bugs depend on timing, ordering or state that varies, such as race conditions, caches, shared state, time zones or load. Increase the odds of seeing it: run the scenario many times in a loop, add concurrency or load, slow parts down artificially, and use different data and environments. Capture evidence when it happens with detailed logs including thread or request ids, timestamps and state, because adding a debugger may change timing so that the bug vanishes. Then review the code for shared mutable state and unsynchronised access, make the suspicious section deterministic, and fix it with locks, atomic operations, immutability or idempotent design.",
    detail: [
      "Sanitisers and race detectors can flag unsynchronised access in some languages.",
      "Flaky tests are often real intermittent bugs.",
      "Do not 'fix' by adding sleeps.",
    ],
    ex: "Two requests updating the same account balance concurrently lose an update until a transaction with a lock is used.",
    mistakes: [
      "Adding sleeps to hide a race.",
      "Giving up because it does not reproduce on one try.",
    ],
    follow: ["Why can a debugger make a race disappear?"],
    points: [
      "Loop and stress to reproduce",
      "Log ids, timing and state",
      "Look for shared mutable state",
      "Fix by synchronisation or design",
    ],
    notes: ["Make it happen more often, then log."],
    src: [
      ["pthreads(7)", `${MAN}/man7/pthreads.7.html`],
      ["Node.js: Diagnostics", `${ND}/en/learn/diagnostics/user-journey`],
    ],
  }),
  q({
    slug: "debug-production-issues-safely",
    topic: "Production troubleshooting",
    d: "medium",
    title: "How do you troubleshoot an issue in production safely?",
    kw: [
      "production incident",
      "rollback first",
      "logs and metrics",
      "read-only investigation",
      "communication",
    ],
    intent: "Checks you stay careful when users are affected.",
    short:
      "First assess impact and stabilise: if a recent deployment is the likely cause, roll back or disable the feature flag before investigating, since restoring service comes first. Then investigate without making things worse: use read-only tools such as logs, metrics, traces and dashboards, compare with the time before the change, and avoid experimenting on live data. Reproduce in staging with similar data if possible. Communicate status to stakeholders, keep a timeline of what you did, apply a minimal fix through the normal deployment path, and afterwards write a postmortem with preventive actions.",
    detail: [
      "Never debug by changing production code by hand.",
      "Attach a debugger to production only with great care, since it can pause requests.",
      "Check recent changes: deployments, configuration, data, dependencies and traffic.",
    ],
    ex: "Errors spike after a release, so the team rolls back, then reproduces the bug on staging.",
    mistakes: [
      "Investigating while the outage continues when a rollback was available.",
      "Making untracked live changes.",
    ],
    follow: ["Why roll back before investigating?"],
    points: [
      "Stabilise first",
      "Read-only investigation",
      "Check what changed",
      "Keep a timeline and write a postmortem",
    ],
    notes: ["Restore service, then find the cause."],
    src: [
      [
        "Kubernetes: Troubleshooting applications",
        "https://kubernetes.io/docs/tasks/debug/",
      ],
      ["Node.js: Diagnostics guide", `${ND}/en/learn/diagnostics/user-journey`],
    ],
  }),
  q({
    slug: "debug-server-performance-top-strace",
    topic: "Production troubleshooting",
    d: "hard",
    title: "A server is slow: how do you find out why with top, ss and strace?",
    kw: ["high cpu", "top", "strace", "load average", "io wait"],
    intent: "Checks you can diagnose resource problems on Linux.",
    short:
      "Check the basics in order. `uptime` and `top` show load and which process uses CPU or memory; high CPU on your app points to computation, while high load with low CPU suggests processes waiting on I/O (`wa` in top). `free -h` shows memory pressure and swap; `df -h` and `iostat` show disk. `ss -s` and `ss -tulpn` show connection counts and listeners. For a suspicious process `strace -p <pid>` shows its system calls, revealing what it waits on, and `lsof -p <pid>` shows open files and sockets. Then correlate with application logs and metrics to find the slow query or loop.",
    detail: [
      "Application-level profiling finds hot code; system tools find resource limits.",
      "A single slow database query can cause the whole application to look slow.",
      "Change one variable at a time while testing fixes.",
    ],
    ex: "`top` shows the Node process at 100 percent CPU, and a profile points to a regular expression stuck on a large input.",
    mistakes: [
      "Restarting without collecting evidence.",
      "Confusing high load with high CPU.",
    ],
    follow: ["What does high load with low CPU suggest?"],
    points: [
      "uptime and top first",
      "free and df for memory and disk",
      "ss for connections",
      "strace and lsof for a process",
    ],
    notes: ["Resources first, then the process."],
    src: [
      ["top(1)", `${MAN}/man1/top.1.html`],
      ["strace(1)", `${MAN}/man1/strace.1.html`],
      ["lsof(8)", `${MAN}/man8/lsof.8.html`],
    ],
  }),
  q({
    slug: "debug-memory-leaks-heap-snapshots",
    topic: "Production troubleshooting",
    d: "hard",
    title: "How do you find a memory leak in a Node.js or browser app?",
    kw: [
      "memory leak",
      "heap snapshot",
      "detached dom",
      "growing heap",
      "garbage collection",
    ],
    intent: "Checks you can investigate steadily growing memory.",
    short:
      "A leak shows as memory that rises over time and does not return after garbage collection. Confirm it by watching memory during repeated actions. Take heap snapshots before and after the action (in Chrome DevTools Memory panel, or in Node with the inspector or `--heapsnapshot-signal`) and compare them to see which object types grow, then inspect the retaining path to find what holds a reference. Typical causes are growing caches or arrays, event listeners and timers that are never removed, closures that capture large objects, and detached DOM nodes. Fix by releasing references, bounding caches and cleaning up on unmount, then re-test to confirm memory is stable.",
    detail: [
      "Allocation timelines show where objects are created.",
      "In containers, a memory limit turns a leak into out-of-memory restarts.",
      "Weak references can help for caches, but are not a general cure.",
    ],
    ex: "Snapshots show thousands of retained request objects held by a global array used for debugging.",
    mistakes: [
      "Assuming garbage collection will clear everything.",
      "Unbounded in-memory caches.",
    ],
    follow: ["What does a retaining path show?"],
    points: [
      "Memory grows and does not recover",
      "Compare heap snapshots",
      "Follow retaining paths",
      "Clean up listeners, timers and caches",
    ],
    notes: ["Snapshot, compare, find the holder."],
    src: [
      ["Chrome DevTools: Fix memory problems", `${DT}/memory-problems`],
      [
        "Node.js: Using heap snapshot",
        `${ND}/en/learn/diagnostics/memory/using-heap-snapshot`,
      ],
    ],
  }),
  q({
    slug: "debug-with-source-maps-and-minified-code",
    topic: "Debugging tools",
    d: "medium",
    title: "How do you debug minified production JavaScript?",
    kw: [
      "source maps",
      "minified code",
      "bundle",
      "error monitoring",
      "stack trace mapping",
    ],
    intent: "Checks you can map production errors back to source.",
    short:
      "Production bundles are minified, so stack traces show meaningless names and line 1. A source map is a file that maps the generated code back to the original files, so DevTools can show and debug the original source, and error-monitoring tools can translate production stack traces. Generate source maps in the build and upload them to your error tracker or serve them restricted, because public maps expose your source code. Without maps, reproduce the issue in a non-minified build with the same inputs, or use the build's identifiers to match the code version.",
    detail: [
      "Keep maps for every released version so old errors can be decoded.",
      "DevTools loads maps automatically when they are referenced.",
      "Sourcemap comments in the bundle point to the map file.",
    ],
    ex: "An error report for `a.js:1:48217` is mapped back to `cart.ts:42` using the build's source map.",
    mistakes: [
      "Shipping no maps and being unable to decode errors.",
      "Publishing source maps for private code unintentionally.",
    ],
    follow: ["What does a source map contain?"],
    points: [
      "Minified code hides names",
      "Source maps map back to source",
      "Upload to error tracker, restrict public access",
      "Keep maps per release",
    ],
    notes: ["Maps turn line 1 into real code."],
    src: [
      ["Chrome DevTools: Source maps", `${DT}/javascript/source-maps`],
      ["Chrome DevTools: Debug JavaScript", `${DT}/javascript`],
    ],
  }),
  q({
    slug: "debug-css-layout-with-devtools",
    topic: "Debugging tools",
    d: "easy",
    title: "How do you debug CSS and layout problems in the browser?",
    kw: [
      "devtools elements panel",
      "computed styles",
      "box model",
      "specificity",
      "flexbox inspector",
    ],
    intent: "Checks you can inspect styles quickly.",
    short:
      "Right-click the element and choose Inspect. The Elements panel shows the DOM and the Styles pane lists every rule that applies, with overridden declarations struck through, so you can see which selector won by specificity or order. The Computed pane shows final values, and the box model diagram shows content, padding, border and margin sizes. Toggle or edit declarations live to test fixes, use the Flexbox and Grid overlays to see layout lines, and force states like `:hover` to debug interactions. Then copy the working change back into your source files.",
    detail: [
      "Check for typos, missing units and invalid values, which appear with a warning icon.",
      "`outline: 1px solid red` is a quick way to see element boxes.",
      "Responsive mode tests breakpoints.",
    ],
    ex: "The Styles pane shows a more specific selector overriding the colour, and a simple selector change fixes it.",
    mistakes: [
      "Fighting specificity with !important.",
      "Editing in DevTools and forgetting to save changes in code.",
    ],
    follow: ["How do you see which rule is overriding yours?"],
    points: [
      "Inspect element, Styles and Computed",
      "Struck-through = overridden",
      "Box model diagram",
      "Layout overlays and forced states",
    ],
    notes: ["Inspect, toggle, copy the fix back."],
    src: [
      ["Chrome DevTools: Inspect and style CSS", `${DT}/css`],
      ["Chrome DevTools: Overview", `${DT}/overview`],
    ],
  }),
  q({
    slug: "error-handling-and-error-boundaries-debugging",
    topic: "Stack traces",
    d: "medium",
    title: "How do you make errors easier to debug in your own code?",
    kw: [
      "error cause",
      "custom errors",
      "error context",
      "try catch",
      "unhandled rejections",
    ],
    intent: "Checks you write code that fails informatively.",
    short:
      'Throw `Error` objects (not strings) with clear messages that include the relevant context, such as the id and operation, and keep the original error as `cause` when wrapping it, so the full chain stays visible: `throw new Error("load user 42 failed", { cause: err })`. Catch errors only where you can handle them or add context, and never swallow them silently. Handle promise rejections with `await` inside try/catch or `.catch`, and register global handlers for `unhandledrejection` and uncaught exceptions that log and report the error. In React use error boundaries to show a fallback and report the error. Log with a request id.',
    detail: [
      "Custom error classes let callers distinguish error types.",
      "Do not expose internals to end users; log them instead.",
      "Include the failing input when it is safe to do so.",
    ],
    ex: "A repository wraps a database error with the query name and passes the original as the cause.",
    code: [
      [
        "Wrap with a cause",
        "js",
        `try {\n  await loadUser(id)\n} catch (err) {\n  throw new Error(\`Could not load user \${id}\`, { cause: err })\n}`,
        [
          "The message adds context.",
          "`cause` preserves the original error and stack.",
        ],
      ],
    ],
    mistakes: ["Empty catch blocks.", "Throwing strings, which have no stack."],
    follow: ["What does Error cause do?"],
    points: [
      "Throw Error objects with context",
      "Preserve the cause",
      "Never swallow errors",
      "Global handlers and boundaries",
    ],
    notes: ["Fail loudly with context."],
    src: [
      ["MDN: Error cause", `${MDN}/Global_Objects/Error/cause`],
      ["MDN: try...catch", `${MDN}/Statements/try...catch`],
    ],
  }),
  q({
    slug: "debugging-containers-and-kubernetes",
    topic: "Production troubleshooting",
    d: "medium",
    title: "How do you debug a container that crashes or misbehaves?",
    kw: [
      "docker logs",
      "docker exec",
      "crashloopbackoff",
      "kubectl describe",
      "exit code",
    ],
    intent: "Checks you can troubleshoot containerised apps.",
    short:
      "Start with the logs: `docker logs <container>` (or `kubectl logs <pod>`, with `--previous` for a crashed pod) shows the app's output and usually the error. Check the state with `docker ps -a` and the exit code, since 137 often means the process was killed for exceeding memory, and with `kubectl describe pod` to see events such as image pull errors, failed probes or out-of-memory kills. Open a shell with `docker exec -it <container> sh` or `kubectl exec` to inspect files, environment variables and network connectivity. Typical causes are missing environment variables, wrong ports, failing health checks, permissions and unreachable dependencies.",
    detail: [
      "Run the same image locally with the same environment to reproduce.",
      "Minimal images may lack a shell; use an ephemeral debug container in Kubernetes.",
      "Check that the app listens on 0.0.0.0, not only localhost.",
    ],
    ex: "A pod in CrashLoopBackoff logs 'Missing DATABASE_URL', and adding the variable fixes it.",
    mistakes: [
      "Not reading the logs of the previous crash.",
      "App bound to localhost inside the container.",
    ],
    follow: ["What does exit code 137 suggest?"],
    points: [
      "Logs first",
      "Check state, exit code and events",
      "Exec into the container",
      "Common causes: env, ports, probes, memory",
    ],
    notes: ["Logs, describe, exec."],
    src: [
      [
        "Docker: docker container logs",
        "https://docs.docker.com/reference/cli/docker/container/logs/",
      ],
      [
        "Kubernetes: Debug running pods",
        "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/",
      ],
    ],
  }),
  q({
    slug: "debug-network-and-connectivity-problems",
    topic: "Production troubleshooting",
    d: "medium",
    title: "Service A cannot reach service B: how do you debug connectivity?",
    kw: [
      "connection refused",
      "timeout",
      "dns resolution",
      "curl -v",
      "firewall security group",
    ],
    intent: "Checks you can trace a connection failure layer by layer.",
    short:
      "Read the exact error. 'Connection refused' means the host answered but nothing is listening on that port (service down or bound to another interface). A timeout means packets are being dropped, typically by a firewall or security group, or there is no route. A DNS error means the name does not resolve. Test from the calling machine: `dig` or `getent hosts` for the name, `ping` or `traceroute` for the path, `nc -zv host port` or `curl -v` for the port and protocol, and `ss -tulpn` on the target to see what is listening and on which address. Then check firewall rules, security groups and the service's bind address.",
    detail: [
      "Test from the same network location as the failing service, not from your laptop.",
      "In containers, use the service name on the same network, not localhost.",
      "TLS errors point to certificates or protocol versions.",
    ],
    ex: "A timeout to the database port turns out to be a missing security group rule allowing the app server.",
    mistakes: [
      "Testing connectivity from the wrong machine.",
      "Confusing refused and timeout.",
    ],
    follow: ["What does 'connection refused' tell you?"],
    points: [
      "Refused = nothing listening",
      "Timeout = dropped or no route",
      "DNS error = name not resolved",
      "Test with dig, nc, curl, ss",
    ],
    notes: ["Refused versus timeout."],
    src: [
      ["curl(1)", `${MAN}/man1/curl.1.html`],
      ["ss(8)", `${MAN}/man8/ss.8.html`],
      ["tcpdump(1)", `${MAN}/man1/tcpdump.1.html`],
    ],
  }),
  q({
    slug: "monitoring-and-observability-for-debugging",
    topic: "Production troubleshooting",
    d: "hard",
    title:
      "How do metrics, logs and traces work together when debugging a distributed system?",
    kw: ["observability", "metrics", "tracing", "correlation id", "alerts"],
    intent: "Checks you know the three pillars and how to use them.",
    short:
      "Metrics are numeric time series, such as request rate, error rate and latency, that tell you something is wrong and how big it is. Logs are detailed event records that explain what happened in one component. Traces follow a single request across services with a trace id, showing where time was spent and where it failed. Use them together: an alert on the error-rate metric shows when and where, a trace of a failed request points to the slow or failing service, and that service's logs, filtered by the same request id, give the cause. Instrument the code and propagate ids between services to make this possible.",
    detail: [
      "Dashboards of the golden signals (latency, traffic, errors, saturation) speed diagnosis.",
      "High-cardinality labels can make metrics expensive.",
      "Sampling controls tracing volume.",
    ],
    ex: "An alert on checkout errors leads to a trace showing the payment service timing out, with its logs revealing the cause.",
    mistakes: [
      "Logs without request ids.",
      "Alerts with no way to drill down.",
    ],
    follow: ["What does a trace id link?"],
    points: [
      "Metrics detect",
      "Traces locate",
      "Logs explain",
      "Propagate request ids",
    ],
    notes: ["Detect, locate, explain."],
    src: [
      ["Node.js: Diagnostics guide", `${ND}/en/learn/diagnostics/user-journey`],
      [
        "AWS CloudWatch Logs: What is CloudWatch Logs?",
        "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html",
      ],
    ],
  }),
  q({
    slug: "debug-async-and-promise-issues",
    topic: "Stack traces",
    d: "medium",
    title:
      "How do you debug asynchronous code, such as missing awaits and unhandled rejections?",
    kw: [
      "unhandled rejection",
      "missing await",
      "promise chain",
      "async stack trace",
      "race",
    ],
    intent: "Checks you can find the usual async mistakes.",
    short:
      "Common async bugs are a missing `await` (so you handle a pending Promise instead of its value, often printed as `Promise { <pending> }`), errors that vanish because a rejected promise has no `catch`, work started in a loop with `forEach(async ...)` that is never awaited, and race conditions between overlapping requests. Debug by logging the type of the value, using `await` inside `try/catch`, using `Promise.all` for parallel work, and listening for the `unhandledrejection` event (or Node's `unhandledRejection`) to surface lost errors. The DevTools debugger shows async call stacks and can pause on exceptions and caught exceptions.",
    detail: [
      "ESLint rules can flag floating promises.",
      "Cancel stale requests with `AbortController` to avoid out-of-order results.",
      "Return promises from functions so callers can await them.",
    ],
    ex: "A function saved data but returned before the save finished because the `await` was missing, so the next read saw old data.",
    mistakes: ["forEach with async callbacks.", "No catch on promise chains."],
    follow: ["Why does forEach not wait for async callbacks?"],
    points: [
      "Missing await leaves a pending Promise",
      "Unhandled rejections hide errors",
      "Use Promise.all for parallel work",
      "Surface errors with global handlers",
    ],
    notes: ["If it returns a Promise, await it."],
    src: [
      [
        "MDN: unhandledrejection event",
        "https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event",
      ],
      [
        "MDN: Using promises",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises",
      ],
    ],
  }),
  q({
    slug: "rubber-duck-and-asking-for-help",
    topic: "Root-cause analysis",
    d: "easy",
    title: "When and how should you ask for help while debugging?",
    kw: [
      "asking for help",
      "rubber duck debugging",
      "minimal example",
      "timeboxing",
      "pair debugging",
    ],
    intent: "Checks you collaborate effectively and respectfully.",
    short:
      "Try first, but timebox it: if you have made no progress after a set time, such as 30 to 60 minutes, ask. Before asking, explain the problem to yourself out loud (rubber duck debugging) or in writing, which often reveals the answer. When you ask, make it easy to help: state what you are trying to do, what you expected and what happened, include the exact error message, the steps to reproduce, what you already tried and the relevant code or a minimal example. Pair debugging helps, and sharing the solution afterwards helps the team and your future self.",
    detail: [
      "Search the error message and the project's issues first.",
      "Be specific: 'it doesn't work' cannot be answered.",
      "Thank the helper and report back with the fix.",
    ],
    ex: "A good message includes the failing request, the error and the two hypotheses already ruled out.",
    mistakes: [
      "Asking with no details.",
      "Struggling alone for hours when a colleague could help in minutes.",
    ],
    follow: ["What should a good question include?"],
    points: [
      "Timebox your own attempts",
      "Explain the problem aloud",
      "Share error, steps, code and what you tried",
      "Report back with the solution",
    ],
    notes: ["A good question is half the answer."],
    src: [
      [
        "MDN: What went wrong? Troubleshooting JavaScript",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_went_wrong",
      ],
      ["Git: git-blame", `${GIT}/git-blame`],
    ],
  }),
])
