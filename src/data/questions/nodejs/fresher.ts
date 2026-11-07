import { defineQuestions } from "../author"

const API = "https://nodejs.org/api"
const LEARN = "https://nodejs.org/en/learn"

export default defineQuestions("nodejs", "fresher", [
  {
    slug: "what-is-nodejs",
    topic: "Node internals (V8 and libuv)",
    difficulty: "easy",
    title: "What is Node.js? Why is it called non-blocking and event-driven?",
    keywords: [
      "node.js",
      "runtime",
      "v8",
      "non-blocking",
      "event-driven",
      "single thread",
    ],
    interviewerIntent:
      "A foundation question. It checks that you can explain what Node is without calling it a framework or a language.",
    shortAnswer:
      "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser. It is event-driven and non-blocking: JavaScript runs on one main thread, and slow work such as file or network I/O is handed to the system, with a callback or promise resolved when it finishes. This lets one process serve many connections without waiting on each.",
    detailedAnswer: [
      "Node is not a language or a framework. It provides APIs for files, networking, processes and more.",
      "The non-blocking model suits I/O-heavy servers such as APIs and chat. It is a poor fit for long CPU-bound calculations on the main thread.",
      "Under the hood, V8 runs your JavaScript and libuv provides the event loop and the thread pool for some operations.",
      "Node uses npm to share packages, which is part of its ecosystem.",
    ],
    realWorldExample:
      "An API server awaits a database query. While it waits, the same process handles other requests, because the query does not block the event loop.",
    codeExamples: [
      {
        title: "Blocking versus non-blocking file read",
        language: "javascript",
        code: `import { readFileSync } from "node:fs"
import { readFile } from "node:fs/promises"

const a = readFileSync("data.txt", "utf8")      // blocks everything until done
console.log("after sync read")

const b = await readFile("data.txt", "utf8")    // does not block the event loop
console.log("after async read")`,
        walkthrough: [
          "The synchronous read stops the whole process until the file is loaded.",
          "The promise-based read lets Node serve other work while the file is read.",
          "In a server the blocking version would delay every other request.",
        ],
      },
    ],
    commonMistakes: [
      "Calling Node a framework or a language.",
      "Saying Node is multi-threaded in your own code by default.",
    ],
    followUps: [
      {
        question: "What kinds of tasks is Node not good at?",
        hint: "Long CPU-bound work on the main thread.",
      },
    ],
    answerTips: [
      "Say 'one thread for JavaScript, many I/O operations in flight'.",
    ],
    keyPoints: [
      "Runtime on V8",
      "Single JavaScript thread",
      "Non-blocking I/O",
      "Great for I/O-heavy servers",
    ],
    revisionNotes: ["Node = V8 + libuv + APIs."],
    sourceRefs: [
      {
        label: "Node.js: Introduction to Node.js",
        url: `${LEARN}/getting-started/introduction-to-nodejs`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "event-loop-phases",
    topic: "Event loop",
    difficulty: "medium",
    title: "How does the Node.js event loop work? What are its phases?",
    keywords: [
      "event loop",
      "phases",
      "timers",
      "poll",
      "check",
      "setImmediate",
      "libuv",
    ],
    interviewerIntent:
      "The most common Node.js question. It checks that you can explain how callbacks are scheduled and in what order.",
    shortAnswer:
      "The event loop is a loop run by libuv that takes finished operations and runs their callbacks on the main thread. Each turn goes through phases: timers (setTimeout and setInterval), pending callbacks, poll (I/O events), check (setImmediate) and close callbacks. Between phases Node runs process.nextTick callbacks and promise microtasks. Because there is one thread, a long callback delays everything.",
    detailedAnswer: [
      "The timers phase runs callbacks whose delay has passed. The delay is a minimum, not a guarantee.",
      "The poll phase waits for and processes I/O events. If nothing is scheduled it can wait there.",
      "The check phase runs `setImmediate` callbacks right after poll.",
      "Inside an I/O callback, `setImmediate` always runs before a `setTimeout` of 0. From the main module the order is not guaranteed.",
    ],
    realWorldExample:
      "A heavy JSON parse inside a request handler delays timers and every other request, which shows up as latency spikes.",
    codeExamples: [
      {
        title: "Order of callbacks",
        language: "javascript",
        code: `setTimeout(() => console.log("timeout"), 0)
setImmediate(() => console.log("immediate"))
process.nextTick(() => console.log("nextTick"))
Promise.resolve().then(() => console.log("promise"))
console.log("sync")
// sync, nextTick, promise, then timeout and immediate (order of these two can vary)`,
        walkthrough: [
          "Synchronous code always runs first.",
          "`nextTick` and promise callbacks run before the loop moves to its next phase.",
          "The timer and immediate callbacks run in loop phases afterwards.",
          "From the main module the order of timeout and immediate depends on timing.",
        ],
      },
    ],
    diagram: {
      kind: "flow",
      title: "One turn of the Node.js event loop",
      steps: [
        { label: "Timers", detail: "setTimeout and setInterval callbacks." },
        {
          label: "Pending callbacks",
          detail: "Some deferred system callbacks.",
        },
        { label: "Poll", detail: "Retrieve and run I/O events." },
        { label: "Check", detail: "setImmediate callbacks." },
        {
          label: "Close callbacks",
          detail: "For example socket close events.",
        },
      ],
    },
    commonMistakes: [
      "Saying Node is multi-threaded for JavaScript.",
      "Expecting setTimeout(fn, 0) to run immediately.",
    ],
    followUps: [
      {
        question:
          "What is the difference between setImmediate and process.nextTick?",
      },
    ],
    answerTips: [
      "Name the phases in order and give the nextTick-before-promise example.",
    ],
    keyPoints: [
      "libuv drives the loop",
      "Phases: timers, poll, check",
      "nextTick and promises run between phases",
      "Long callbacks block",
    ],
    revisionNotes: ["Timers, poll, check, with microtasks in between."],
    sourceRefs: [
      {
        label: "Node.js: The Node.js Event Loop",
        url: `${LEARN}/asynchronous-work/event-loop-timers-and-nexttick`,
      },
    ],
    estimatedMinutes: 6,
  },
  {
    slug: "nexttick-vs-setimmediate",
    topic: "Event loop",
    difficulty: "medium",
    title:
      "What is the difference between process.nextTick(), setImmediate() and setTimeout()?",
    keywords: [
      "nextTick",
      "setImmediate",
      "setTimeout",
      "microtask queue",
      "starvation",
    ],
    interviewerIntent:
      "A follow-up to the event loop question that checks how precisely you know the scheduling order.",
    shortAnswer:
      "`process.nextTick` runs its callback as soon as the current operation finishes, before the event loop continues and before promise callbacks. `setImmediate` runs in the check phase, after the poll phase of the current loop turn. `setTimeout` runs in the timers phase after at least the given delay. Overusing nextTick can starve I/O because the loop never moves on.",
    detailedAnswer: [
      "The nextTick queue is processed completely before promise microtasks and before the loop proceeds.",
      "Use `setImmediate` to let I/O callbacks run first, and `nextTick` to run something right after the current code but before anything else.",
      "A recursive `nextTick` call can block the loop forever, while recursive `setImmediate` lets other events through.",
      "Prefer promises or `queueMicrotask` in new code, and use `setImmediate` to yield.",
    ],
    realWorldExample:
      "A class emits an event inside its constructor using `process.nextTick`, so listeners attached right after construction still receive it.",
    codeExamples: [
      {
        title: "Delaying an event until listeners are attached",
        language: "javascript",
        code: `import { EventEmitter } from "node:events"

class Job extends EventEmitter {
  constructor() {
    super()
    process.nextTick(() => this.emit("ready"))   // runs after the constructor returns
  }
}

const job = new Job()
job.on("ready", () => console.log("listener called"))`,
        walkthrough: [
          "If the event were emitted directly in the constructor, no listener would exist yet.",
          "`nextTick` defers the emit until the current code has finished.",
          "The listener attached after construction therefore receives the event.",
        ],
      },
    ],
    commonMistakes: [
      "Calling nextTick recursively and blocking I/O.",
      "Thinking setImmediate means immediately before everything.",
    ],
    followUps: [
      { question: "How are promise callbacks ordered relative to nextTick?" },
    ],
    answerTips: [
      "Say that nextTick is not a loop phase, it runs between operations.",
    ],
    keyPoints: [
      "nextTick: right after current operation",
      "setImmediate: check phase",
      "setTimeout: timers phase",
      "nextTick can starve I/O",
    ],
    revisionNotes: ["nextTick first, then promises, then loop phases."],
    sourceRefs: [
      {
        label: "Node.js: process.nextTick()",
        url: `${API}/process.html#processnexttickcallback-args`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "single-thread-and-thread-pool",
    topic: "Node internals (V8 and libuv)",
    difficulty: "medium",
    title:
      "Node.js is single-threaded. How does it handle many requests and heavy work?",
    keywords: [
      "single thread",
      "libuv thread pool",
      "worker threads",
      "concurrency",
      "cpu bound",
    ],
    interviewerIntent:
      "Checks that you understand the difference between a single JavaScript thread and the work done behind it.",
    shortAnswer:
      "Your JavaScript runs on a single main thread, but Node does not do all work on it. Network I/O uses the operating system's asynchronous facilities, and some operations such as file system calls, DNS lookups and crypto run in libuv's thread pool, which has four threads by default. For CPU-heavy JavaScript, use worker threads or separate processes so the main thread stays responsive.",
    detailedAnswer: [
      "Concurrency here means many operations in progress at once, while only one JavaScript callback runs at any moment.",
      "The thread pool size can be changed with the `UV_THREADPOOL_SIZE` environment variable.",
      "Worker threads run JavaScript in parallel with their own event loop and communicate by messages.",
      "Clustering runs several Node processes to use all CPU cores.",
    ],
    realWorldExample:
      "An image resize endpoint runs in a worker thread, so other requests are still served while the resize runs.",
    commonMistakes: [
      "Saying Node can only do one thing at a time.",
      "Running CPU-heavy loops in a request handler.",
    ],
    followUps: [
      {
        question:
          "When would you use worker threads instead of the cluster module?",
      },
    ],
    answerTips: [
      "Separate 'one JavaScript thread' from 'work done outside it'.",
    ],
    keyPoints: [
      "One JavaScript thread",
      "OS async I/O",
      "libuv thread pool for some tasks",
      "Worker threads for CPU work",
    ],
    revisionNotes: ["One thread for JS, many helpers behind it."],
    sourceRefs: [
      {
        label: "Node.js: Don't Block the Event Loop",
        url: `${LEARN}/asynchronous-work/dont-block-the-event-loop`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "v8-and-libuv",
    topic: "Node internals (V8 and libuv)",
    difficulty: "medium",
    title: "What are V8 and libuv, and what does each do in Node.js?",
    keywords: [
      "v8",
      "libuv",
      "jit",
      "garbage collection",
      "event loop",
      "bindings",
    ],
    interviewerIntent:
      "Checks that you know the main building blocks of the runtime, not just the API.",
    shortAnswer:
      "V8 is Google's JavaScript engine. It parses and compiles your JavaScript to machine code and manages memory with garbage collection. libuv is a C library that provides the event loop, asynchronous I/O and a thread pool across operating systems. Node's C++ bindings connect JavaScript to libuv and to system features, so `fs.readFile` ends up as a libuv operation.",
    detailedAnswer: [
      "V8 uses just-in-time compilation to make hot code fast, and a generational garbage collector.",
      "libuv gives Node the same async API on Linux, macOS and Windows.",
      "Other parts are the built-in modules, the HTTP parser, OpenSSL for crypto and the npm tool.",
      "V8's heap has a default limit, which can be raised with `--max-old-space-size`.",
    ],
    realWorldExample:
      "A memory leak shows up as a growing V8 heap, which you can inspect with heap snapshots in Node's inspector.",
    commonMistakes: [
      "Saying libuv is part of V8.",
      "Thinking Node has no garbage collector.",
    ],
    followUps: [
      {
        question: "How would you investigate a memory leak in a Node process?",
      },
    ],
    answerTips: [
      "One sentence each: V8 runs JavaScript, libuv does I/O and the loop.",
    ],
    keyPoints: [
      "V8 compiles and runs JavaScript",
      "libuv: event loop and async I/O",
      "C++ bindings connect them",
      "GC is in V8",
    ],
    revisionNotes: ["V8 = engine, libuv = loop and I/O."],
    sourceRefs: [
      { label: "Node.js: About Node.js", url: "https://nodejs.org/en/about" },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "commonjs-vs-esm-in-node",
    topic: "Modules",
    difficulty: "medium",
    title: "What is the difference between CommonJS and ES modules in Node.js?",
    keywords: [
      "commonjs",
      "require",
      "module.exports",
      "esm",
      "import",
      "type module",
      ".mjs",
    ],
    interviewerIntent:
      "Both systems exist in real projects. The interviewer checks that you can work with each and know how Node chooses.",
    shortAnswer:
      'CommonJS uses `require()` and `module.exports`, loads synchronously, and is the original Node module system. ES modules use `import` and `export`, are the JavaScript standard, are loaded asynchronously and support top-level await. Node treats a file as an ES module if it ends in `.mjs` or the nearest package.json has `"type": "module"`. ES module imports need file extensions.',
    detailedAnswer: [
      "In CommonJS, `__dirname` and `__filename` are available. In ES modules use `import.meta.url` instead.",
      "An ES module can import CommonJS, but a CommonJS file loads an ES module only with dynamic `import()`.",
      "ES module imports are live bindings, while `require` returns a copy of the exports at that moment.",
      "New code usually uses ES modules for compatibility with browsers and tooling.",
    ],
    realWorldExample:
      'A project migrates to ESM by setting `"type": "module"`, and must then rename scripts that use `require` or switch them to `import`.',
    codeExamples: [
      {
        title: "The same module in both systems",
        language: "javascript",
        code: `// CommonJS
const path = require("node:path")
module.exports = { join: (a, b) => path.join(a, b) }

// ES module
import path from "node:path"
import { fileURLToPath } from "node:url"
export const join = (a, b) => path.join(a, b)
const __dirname = path.dirname(fileURLToPath(import.meta.url))`,
        walkthrough: [
          "CommonJS uses `require` and assigns to `module.exports`.",
          "An ES module uses `import` and `export`.",
          "`__dirname` does not exist in ESM, so it is rebuilt from `import.meta.url`.",
        ],
      },
    ],
    commonMistakes: [
      "Using require in an ES module.",
      "Forgetting the file extension in ESM imports.",
    ],
    followUps: [{ question: "How do you load an ES module from CommonJS?" }],
    answerTips: ["Mention how Node decides: .mjs or type module."],
    keyPoints: [
      "require vs import",
      "Sync vs async loading",
      "type module or .mjs",
      "import.meta.url replaces __dirname",
    ],
    revisionNotes: ["CJS is require, ESM is import."],
    sourceRefs: [
      { label: "Node.js: Modules (CommonJS)", url: `${API}/modules.html` },
      { label: "Node.js: ECMAScript modules", url: `${API}/esm.html` },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "require-resolution-and-caching",
    topic: "Modules",
    difficulty: "medium",
    title: "How does require() resolve and cache modules?",
    keywords: [
      "require",
      "module cache",
      "node_modules",
      "circular dependency",
      "require.cache",
      "resolution",
    ],
    interviewerIntent:
      "Checks deeper knowledge of how modules are found and why a module runs only once.",
    shortAnswer:
      "When you call `require`, Node resolves the path: core modules first, then relative paths, then `node_modules` folders searching upward from the current directory. The first time a file is loaded it is executed and its `module.exports` is stored in `require.cache`. Later requires return the cached object, so module-level code runs once and the exports are shared across the process.",
    detailedAnswer: [
      "Because exports are cached, a module can act as a singleton, such as a database connection holder.",
      "Circular dependencies return a partially filled `exports` object, which is a common source of bugs.",
      "A folder can be required if it has an `index.js` or a `main` field in its package.json.",
      "Deleting from `require.cache` forces a reload, but this is rarely a good idea outside of tooling.",
    ],
    realWorldExample:
      "A `db.js` module creates the connection when first required, and every other file that requires it receives the same connection object.",
    codeExamples: [
      {
        title: "Module code runs once",
        language: "javascript",
        code: `// counter.js
let count = 0
console.log("counter.js loaded")
module.exports = { next: () => ++count }

// app.js
const a = require("./counter")
const b = require("./counter")   // cached: no second "loaded" message
console.log(a === b)             // true
console.log(a.next(), b.next())  // 1 2`,
        walkthrough: [
          "The log line prints only the first time the file is required.",
          "Both variables point to the same exports object.",
          "The count is shared, so the second call returns 2.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting a module to run again on each require.",
      "Creating circular dependencies.",
    ],
    followUps: [{ question: "What happens with circular requires?" }],
    answerTips: [
      "Explain the cache, it answers both 'singleton' and 'runs once'.",
    ],
    keyPoints: [
      "Core, relative, node_modules lookup",
      "Executed once",
      "Cached in require.cache",
      "Circular imports are partial",
    ],
    revisionNotes: ["require caches the exports object."],
    sourceRefs: [
      {
        label: "Node.js: Modules (caching)",
        url: `${API}/modules.html#caching`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "callbacks-promises-async-await",
    topic: "Async patterns",
    difficulty: "easy",
    title:
      "What are callbacks, promises and async/await in Node.js? How do they relate?",
    keywords: [
      "callbacks",
      "promises",
      "async await",
      "error-first callback",
      "callback hell",
      "util.promisify",
    ],
    interviewerIntent:
      "Checks that you understand the evolution of async patterns and can convert between them.",
    shortAnswer:
      "A callback is a function passed to be called when work finishes. Node's convention is the error-first callback: `(err, result)`. Nesting many causes callback hell. Promises represent a future value and can be chained, and `async/await` is syntax that lets you write promise code like synchronous code. Older callback APIs can be converted with `util.promisify`, and many core modules have a `/promises` version.",
    detailedAnswer: [
      "Always handle the `err` argument first in a callback.",
      "`await` pauses the async function, not the whole process.",
      "Use `try/catch` around `await` for errors, and `Promise.all` to run independent calls in parallel.",
      "Do not mix styles in one function without need.",
    ],
    realWorldExample:
      "A script reads a config file and a template with `fs/promises` and awaits both with `Promise.all` instead of nested callbacks.",
    codeExamples: [
      {
        title: "Callback, promisify and async/await",
        language: "javascript",
        code: `import fs from "node:fs"
import { promisify } from "node:util"
import { readFile } from "node:fs/promises"

fs.readFile("a.txt", "utf8", (err, text) => {       // error-first callback
  if (err) return console.error(err)
  console.log(text)
})

const readAsync = promisify(fs.readFile)
const text = await readAsync("a.txt", "utf8")

const [a, b] = await Promise.all([readFile("a.txt", "utf8"), readFile("b.txt", "utf8")])`,
        walkthrough: [
          "The callback receives an error first and the result second.",
          "`promisify` wraps a callback API so it returns a promise.",
          "The `fs/promises` module already returns promises.",
          "`Promise.all` runs both reads at the same time.",
        ],
      },
    ],
    commonMistakes: [
      "Ignoring the err argument.",
      "Awaiting independent calls one after another.",
    ],
    followUps: [{ question: "How do you handle errors in async/await?" }],
    answerTips: ["Mention error-first callbacks and Promise.all."],
    keyPoints: [
      "Error-first callbacks",
      "Promises chain",
      "async/await is promise syntax",
      "promisify converts callbacks",
    ],
    revisionNotes: ["Callbacks to promises to async/await."],
    sourceRefs: [
      {
        label: "Node.js: util.promisify",
        url: `${API}/util.html#utilpromisifyoriginal`,
      },
      {
        label: "Node.js: File system promises API",
        url: `${API}/fs.html#promises-api`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "unhandled-rejections-and-uncaught-exceptions",
    topic: "Async patterns",
    difficulty: "medium",
    title:
      "What are unhandled promise rejections and uncaught exceptions in Node.js? How should you deal with them?",
    keywords: [
      "unhandledRejection",
      "uncaughtException",
      "process.on",
      "graceful shutdown",
      "error handling",
    ],
    interviewerIntent:
      "Checks production error-handling awareness: what happens when an error escapes and what a safe response is.",
    shortAnswer:
      'An uncaught exception is a thrown error that nothing catches, and an unhandled rejection is a rejected promise with no handler. In current Node versions an unhandled rejection crashes the process by default. You can listen to `process.on("uncaughtException")` and `"unhandledRejection"` to log the error and shut down gracefully, but the process may be in an unknown state, so restart it rather than carrying on.',
    detailedAnswer: [
      "Handle expected errors where they occur, with `try/catch` around `await` and `.catch()` on promises.",
      "The global handlers are a last resort for logging and cleanup, not for continuing normally.",
      "A process manager or orchestrator should restart the service after a crash.",
      "Never leave a floating promise: either await it or attach a catch.",
    ],
    realWorldExample:
      "A server logs the error, stops accepting new connections, finishes in-flight requests and exits so the platform restarts it.",
    codeExamples: [
      {
        title: "Last-resort handlers",
        language: "javascript",
        code: `process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason)
  shutdown(1)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err)
  shutdown(1)
})

function shutdown(code) {
  server.close(() => process.exit(code))   // finish current requests, then exit
}`,
        walkthrough: [
          "Both handlers log the problem so it can be diagnosed.",
          "They start a graceful shutdown instead of continuing.",
          "`server.close` stops new connections and waits for current ones.",
          "A supervisor then starts a fresh process.",
        ],
      },
    ],
    commonMistakes: [
      "Swallowing the error and continuing.",
      "Leaving promises without a catch.",
    ],
    followUps: [
      { question: "Why is continuing after an uncaught exception risky?" },
    ],
    answerTips: ["Say 'log, shut down gracefully, restart'."],
    keyPoints: [
      "Handle errors locally first",
      "Global handlers are last resort",
      "State may be corrupt",
      "Restart the process",
    ],
    revisionNotes: ["Catch locally, crash cleanly."],
    sourceRefs: [
      {
        label: "Node.js: process events (uncaughtException)",
        url: `${API}/process.html#event-uncaughtexception`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "event-emitter",
    topic: "Async patterns",
    difficulty: "medium",
    title: "What is the EventEmitter class in Node.js? How do you use it?",
    keywords: [
      "EventEmitter",
      "on",
      "emit",
      "once",
      "error event",
      "observer pattern",
    ],
    interviewerIntent:
      "Many Node APIs are event emitters. The interviewer checks that you can use and create them correctly.",
    shortAnswer:
      "`EventEmitter` from the `events` module implements the observer pattern. You register listeners with `on(name, fn)` or `once`, and trigger them with `emit(name, ...args)`. Listeners run synchronously in the order they were added. Streams, servers and many core objects extend it. If an `error` event is emitted with no listener, Node throws, so always handle `error`.",
    detailedAnswer: [
      "`emit` returns true if the event had listeners.",
      "Remove listeners with `off` or `removeListener` to avoid leaks. A warning appears after more than ten listeners for one event.",
      "Listeners are called synchronously, so a slow listener delays `emit`.",
      "You can build your own classes by extending `EventEmitter`.",
    ],
    realWorldExample:
      "An upload manager emits `progress` and `done` events, and the UI layer subscribes to show a progress bar.",
    codeExamples: [
      {
        title: "A small emitter",
        language: "javascript",
        code: `import { EventEmitter } from "node:events"

const bus = new EventEmitter()

bus.on("order", (id) => console.log("received", id))
bus.once("order", (id) => console.log("first order only", id))
bus.on("error", (err) => console.error("failed:", err.message))

bus.emit("order", 1)    // both listeners run
bus.emit("order", 2)    // only the first listener runs
bus.emit("error", new Error("boom"))`,
        walkthrough: [
          "`on` registers a listener that runs every time.",
          "`once` runs the listener only for the first event.",
          "An `error` listener prevents the process from throwing.",
          "`emit` calls listeners in the order they were registered.",
        ],
      },
    ],
    commonMistakes: [
      "Not handling the error event.",
      "Forgetting to remove listeners and leaking memory.",
    ],
    followUps: [
      { question: "Are event listeners synchronous or asynchronous?" },
    ],
    answerTips: ["Mention that streams and HTTP servers are emitters."],
    keyPoints: [
      "on, once, emit",
      "Synchronous listeners",
      "Handle error events",
      "Remove listeners",
    ],
    revisionNotes: ["Emit and listen: the observer pattern."],
    sourceRefs: [{ label: "Node.js: Events", url: `${API}/events.html` }],
    estimatedMinutes: 4,
  },
  {
    slug: "what-are-streams",
    topic: "Streams",
    difficulty: "medium",
    title:
      "What are streams in Node.js and why are they useful? What are the four types?",
    keywords: [
      "streams",
      "readable",
      "writable",
      "duplex",
      "transform",
      "memory efficient",
      "chunks",
    ],
    interviewerIntent:
      "Checks that you know how Node handles large data without loading it all into memory.",
    shortAnswer:
      "A stream processes data piece by piece instead of all at once, so memory use stays small even for huge files. The four types are Readable (a source, such as a file read), Writable (a destination), Duplex (both, such as a socket) and Transform (a duplex that changes data, such as compression). Streams are event emitters and support backpressure, which slows the source when the destination is busy.",
    detailedAnswer: [
      "Reading a 5 GB file with `readFile` loads all of it into memory, while a stream reads it in chunks.",
      "Chunks are Buffers by default, or strings if an encoding is set.",
      "`pipeline` connects streams, forwards errors and cleans up.",
      "HTTP requests and responses are streams too.",
    ],
    realWorldExample:
      "A server streams a large CSV export directly to the client as it is read from disk, rather than building it in memory.",
    codeExamples: [
      {
        title: "Copying and compressing a file with streams",
        language: "javascript",
        code: `import { createReadStream, createWriteStream } from "node:fs"
import { createGzip } from "node:zlib"
import { pipeline } from "node:stream/promises"

await pipeline(
  createReadStream("big.log"),
  createGzip(),                       // Transform stream
  createWriteStream("big.log.gz")
)
console.log("done")`,
        walkthrough: [
          "The read stream is the source and the write stream is the destination.",
          "`createGzip` transforms each chunk as it passes through.",
          "`pipeline` handles backpressure and errors for the whole chain.",
          "Memory use stays small no matter how big the file is.",
        ],
      },
    ],
    commonMistakes: [
      "Reading huge files fully into memory.",
      "Using pipe without handling errors.",
    ],
    followUps: [{ question: "What is backpressure?" }],
    answerTips: ["Name the four types and give the large file example."],
    keyPoints: [
      "Process data in chunks",
      "Readable, Writable, Duplex, Transform",
      "Backpressure",
      "Use pipeline",
    ],
    revisionNotes: ["Stream = data in small pieces."],
    sourceRefs: [{ label: "Node.js: Stream", url: `${API}/stream.html` }],
    estimatedMinutes: 5,
  },
  {
    slug: "backpressure-and-pipe",
    topic: "Streams",
    difficulty: "hard",
    title:
      "What is backpressure in Node.js streams? How do pipe() and pipeline() deal with it?",
    keywords: [
      "backpressure",
      "highWaterMark",
      "pipe",
      "pipeline",
      "drain",
      "writable.write",
    ],
    interviewerIntent:
      "An advanced stream question. It checks that you know how fast producers are slowed for slow consumers.",
    shortAnswer:
      "Backpressure is the signal that a destination cannot accept data as fast as the source produces it. `writable.write()` returns false when its internal buffer passes the `highWaterMark`, and the writer should stop until the `drain` event. `pipe()` and `pipeline()` handle this automatically by pausing the source. `pipeline` also forwards errors and destroys all streams on failure, which is why it is preferred.",
    detailedAnswer: [
      "Without backpressure, the buffer grows in memory and can crash the process.",
      "`highWaterMark` defaults to 16 KB for most streams and sets the buffer threshold.",
      "`pipe()` does not forward errors between streams, so one failure can leave others open.",
      "Async iteration with `for await (const chunk of readable)` also respects backpressure.",
    ],
    realWorldExample:
      "Uploading a large file to a slow client connection pauses disk reads when the network buffer is full, so memory stays flat.",
    codeExamples: [
      {
        title: "Manual backpressure handling",
        language: "javascript",
        code: `import { createReadStream, createWriteStream } from "node:fs"

const src = createReadStream("in.txt")
const dst = createWriteStream("out.txt")

src.on("data", (chunk) => {
  const ok = dst.write(chunk)
  if (!ok) {
    src.pause()                         // destination buffer is full
    dst.once("drain", () => src.resume())
  }
})
src.on("end", () => dst.end())
// In real code, prefer: await pipeline(src, dst)`,
        walkthrough: [
          "`write` returns false when the destination buffer is full.",
          "The source is paused until the `drain` event says it can continue.",
          "This is exactly what `pipeline` does for you.",
          "Writing this by hand is rarely necessary and easy to get wrong.",
        ],
      },
    ],
    commonMistakes: [
      "Ignoring the return value of write().",
      "Using pipe() without error handling.",
    ],
    followUps: [{ question: "Why is pipeline better than pipe?" }],
    answerTips: ["Say that write() returns false and drain says continue."],
    keyPoints: [
      "write() false means slow down",
      "drain means resume",
      "pipeline handles it",
      "highWaterMark sets the limit",
    ],
    revisionNotes: [
      "Backpressure keeps fast sources from flooding slow sinks.",
    ],
    sourceRefs: [
      {
        label: "Node.js: Backpressuring in Streams",
        url: `${LEARN}/modules/backpressuring-in-streams`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "buffers",
    topic: "Streams",
    difficulty: "easy",
    title: "What is a Buffer in Node.js and when do you use it?",
    keywords: [
      "buffer",
      "binary data",
      "encoding",
      "utf8",
      "base64",
      "Uint8Array",
    ],
    interviewerIntent:
      "Checks that you understand how Node represents raw binary data.",
    shortAnswer:
      "A Buffer is a fixed-size chunk of raw memory for binary data, such as file contents, network packets or images. It is a subclass of `Uint8Array`. You create one with `Buffer.from()` or `Buffer.alloc()` and convert to and from text with encodings like `utf8`, `hex` and `base64`. Streams deliver Buffers by default unless you set an encoding.",
    detailedAnswer: [
      "Prefer `Buffer.alloc(n)`, which zero-fills the memory, over unsafe allocation.",
      "A Buffer's length is in bytes, which can differ from the number of characters for non-ASCII text.",
      "Slicing a Buffer shares memory with the original, it does not copy.",
      "Use `Buffer.concat` to join chunks, for example when collecting a request body.",
    ],
    realWorldExample:
      "An endpoint decodes a base64 image from JSON into a Buffer and writes it to disk or storage.",
    codeExamples: [
      {
        title: "Creating and converting Buffers",
        language: "javascript",
        code: `const buf = Buffer.from("héllo", "utf8")
console.log(buf.length)              // 6 bytes (é uses two)
console.log(buf.toString("hex"))
console.log(buf.toString("base64"))

const zeros = Buffer.alloc(4)        // <00 00 00 00>
const joined = Buffer.concat([Buffer.from("ab"), Buffer.from("cd")])
console.log(joined.toString())       // "abcd"`,
        walkthrough: [
          "The string has five characters but six bytes in UTF-8.",
          "The same bytes can be shown as hex or base64.",
          "`alloc` gives a zero-filled Buffer.",
          "`concat` joins several Buffers into one.",
        ],
      },
    ],
    commonMistakes: [
      "Confusing byte length with string length.",
      "Using the deprecated new Buffer().",
    ],
    followUps: [
      { question: "How do you read a whole request body from a stream?" },
    ],
    answerTips: ["Mention encodings and that streams give Buffers."],
    keyPoints: [
      "Raw binary memory",
      "Buffer.from and alloc",
      "Encodings",
      "Length is in bytes",
    ],
    revisionNotes: ["Buffer = bytes."],
    sourceRefs: [{ label: "Node.js: Buffer", url: `${API}/buffer.html` }],
    estimatedMinutes: 3,
  },
  {
    slug: "fs-sync-vs-async",
    topic: "Async patterns",
    difficulty: "easy",
    title:
      "What is the difference between synchronous and asynchronous file system methods in Node.js?",
    keywords: [
      "fs",
      "readFileSync",
      "readFile",
      "fs/promises",
      "blocking",
      "event loop",
    ],
    interviewerIntent:
      "A practical check that you know which calls block the event loop.",
    shortAnswer:
      "Synchronous methods such as `readFileSync` block the event loop until the operation finishes, so nothing else runs. Asynchronous methods, either callback style like `readFile` or promise style from `fs/promises`, start the operation and let the event loop continue. In a server, use the async versions. Sync methods are fine at startup, in scripts and in CLI tools.",
    detailedAnswer: [
      "Blocking a server handler with a sync call delays every other request.",
      "`fs.promises` or `node:fs/promises` is the modern choice with async/await.",
      "For large files, use streams instead of reading everything at once.",
      "Check for existence by handling errors, not by calling `exists` first, which can race.",
    ],
    realWorldExample:
      "A config file is read synchronously once at startup, while uploaded files are processed asynchronously per request.",
    codeExamples: [
      {
        title: "Async read with error handling",
        language: "javascript",
        code: `import { readFile, writeFile } from "node:fs/promises"

try {
  const text = await readFile("config.json", "utf8")
  const config = JSON.parse(text)
  await writeFile("out.json", JSON.stringify(config, null, 2))
} catch (err) {
  if (err.code === "ENOENT") console.error("File not found")
  else throw err
}`,
        walkthrough: [
          "`readFile` returns a promise, so the event loop stays free.",
          "Parsing and writing follow in order.",
          "A missing file produces the error code `ENOENT`.",
          "Other errors are rethrown.",
        ],
      },
    ],
    commonMistakes: [
      "Using sync methods inside request handlers.",
      "Checking existence before reading, creating a race.",
    ],
    followUps: [{ question: "When is a sync method acceptable?" }],
    answerTips: ["Say 'sync at startup, async in request paths'."],
    keyPoints: [
      "Sync blocks the loop",
      "Async keeps the loop free",
      "fs/promises with await",
      "Streams for large files",
    ],
    revisionNotes: ["Never block the loop in a server."],
    sourceRefs: [{ label: "Node.js: File system", url: `${API}/fs.html` }],
    estimatedMinutes: 3,
  },
  {
    slug: "http-server-without-express",
    topic: "Async patterns",
    difficulty: "easy",
    title:
      "How do you create a basic HTTP server in Node.js without any framework?",
    keywords: [
      "http",
      "createServer",
      "request",
      "response",
      "listen",
      "status code",
    ],
    interviewerIntent:
      "Checks that you understand what frameworks like Express are built on.",
    shortAnswer:
      "Use the built-in `http` module: `http.createServer((req, res) => { ... })` creates a server whose callback receives the request and the response for every incoming request. You set the status code and headers, write the body and call `res.end()`. Then call `server.listen(port)`. Frameworks such as Express wrap this API with routing and middleware.",
    detailedAnswer: [
      "`req` is a readable stream, so a request body arrives in chunks.",
      "`res` is a writable stream, and `res.end()` must be called to finish the response.",
      "Routing means reading `req.method` and `req.url` yourself.",
      "Set `Content-Type` so clients know how to parse the response.",
    ],
    realWorldExample:
      "A small health-check service uses plain `http` because it needs a single route and no dependencies.",
    codeExamples: [
      {
        title: "A tiny JSON server",
        language: "javascript",
        code: `import http from "node:http"

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ ok: true }))
    return
  }
  res.writeHead(404)
  res.end()
})

server.listen(3000, () => console.log("listening on 3000"))`,
        walkthrough: [
          "The callback runs once for each incoming request.",
          "The method and URL are checked by hand to decide the route.",
          "`writeHead` sets the status and headers before the body.",
          "`end` sends the body and finishes the response.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting to call res.end().",
      "Not setting Content-Type.",
    ],
    followUps: [{ question: "How do you read the body of a POST request?" }],
    answerTips: ["Mention that Express is built on this module."],
    keyPoints: [
      "http.createServer",
      "req and res are streams",
      "Call res.end",
      "Express wraps this",
    ],
    revisionNotes: ["Frameworks sit on http.createServer."],
    sourceRefs: [{ label: "Node.js: HTTP", url: `${API}/http.html` }],
    estimatedMinutes: 4,
  },
  {
    slug: "process-env-and-config",
    topic: "Modules",
    difficulty: "easy",
    title:
      "How do you manage configuration and environment variables in a Node.js app?",
    keywords: [
      "process.env",
      "environment variables",
      "dotenv",
      "--env-file",
      "configuration",
      "secrets",
    ],
    interviewerIntent:
      "Checks twelve-factor basics: configuration outside the code and care with secrets.",
    shortAnswer:
      "Read configuration from environment variables through `process.env`, where values are always strings. Keep secrets out of the code and out of version control. In development, load a `.env` file with a tool such as `dotenv` or Node's `--env-file` option. Validate and parse values once at startup, with defaults, and fail early if something required is missing.",
    detailedAnswer: [
      "Different environments, such as development and production, differ only in the variables they receive.",
      "Numbers and booleans must be converted: `Number(process.env.PORT)`.",
      "Never commit `.env` files with real secrets. Commit a `.env.example` with names only.",
      "A single config module that exports a validated object avoids scattered `process.env` access.",
    ],
    realWorldExample:
      "A service reads `DATABASE_URL` and `PORT` from the environment, and exits with a clear error if `DATABASE_URL` is missing.",
    codeExamples: [
      {
        title: "A validated config module",
        language: "javascript",
        code: `// config.js
const required = (name) => {
  const value = process.env[name]
  if (!value) throw new Error("Missing environment variable: " + name)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required("DATABASE_URL"),
  isProduction: process.env.NODE_ENV === "production",
}`,
        walkthrough: [
          "A helper throws early when a required variable is missing.",
          "The port is converted from a string to a number, with a default.",
          "The rest of the app imports one config object.",
        ],
      },
    ],
    commonMistakes: [
      "Committing secrets.",
      "Forgetting that env values are strings.",
    ],
    followUps: [{ question: "What is NODE_ENV used for?" }],
    answerTips: ["Mention validation at startup."],
    keyPoints: [
      "process.env holds strings",
      "Secrets stay out of code",
      "Load .env in development",
      "Validate at startup",
    ],
    revisionNotes: ["Config from the environment, not the code."],
    sourceRefs: [
      { label: "Node.js: process.env", url: `${API}/process.html#processenv` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "npm-and-package-json",
    topic: "Modules",
    difficulty: "easy",
    title:
      "What is npm? Explain package.json, dependencies and devDependencies.",
    keywords: [
      "npm",
      "package.json",
      "dependencies",
      "devDependencies",
      "package-lock.json",
      "semver",
      "scripts",
    ],
    interviewerIntent:
      "Basic tooling knowledge that every Node developer needs.",
    shortAnswer:
      "npm is Node's package manager and the registry where packages are published. `package.json` describes the project: its name, version, scripts and dependencies. `dependencies` are needed at runtime, while `devDependencies` are needed only for development, such as test tools and build tools. `package-lock.json` records the exact installed versions so installs are reproducible.",
    detailedAnswer: [
      "Version ranges follow semantic versioning: `^1.2.3` accepts compatible minor and patch updates, `~1.2.3` accepts patch updates.",
      "`npm ci` installs exactly from the lock file and is used in CI.",
      "`scripts` define commands such as `npm run build` and `npm test`.",
      "Check dependencies for security issues with `npm audit`.",
    ],
    realWorldExample:
      "A CI pipeline runs `npm ci` and `npm test`, so the build uses the same versions that the developers locked.",
    codeExamples: [
      {
        title: "A small package.json",
        language: "json",
        code: `{
  "name": "orders-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "test": "node --test"
  },
  "dependencies": { "express": "^4.19.0" },
  "devDependencies": { "eslint": "^9.0.0" }
}`,
        walkthrough: [
          "`type: module` makes the files ES modules.",
          "Scripts give short names to commands.",
          "Express is needed to run the app, so it is a dependency.",
          "ESLint is only needed during development.",
        ],
      },
    ],
    commonMistakes: [
      "Putting build tools in dependencies.",
      "Deleting the lock file.",
    ],
    followUps: [
      { question: "What is the difference between npm install and npm ci?" },
    ],
    answerTips: ["Mention the lock file and semver ranges."],
    keyPoints: [
      "package.json describes the project",
      "dependencies vs devDependencies",
      "Lock file pins versions",
      "npm ci for CI",
    ],
    revisionNotes: ["Lock file = reproducible installs."],
    sourceRefs: [
      {
        label: "Node.js: Introduction to npm",
        url: `${LEARN}/getting-started/an-introduction-to-the-npm-package-manager`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "cluster-module",
    topic: "Clustering",
    difficulty: "medium",
    title: "What is the cluster module in Node.js and why would you use it?",
    keywords: [
      "cluster",
      "fork",
      "multi-core",
      "workers",
      "load balancing",
      "scaling",
    ],
    interviewerIntent:
      "Checks that you know how a single-threaded runtime uses a multi-core machine.",
    shortAnswer:
      "The `cluster` module lets one primary process fork several worker processes that share the same server port. Each worker is a separate Node process with its own event loop and memory, so together they use all CPU cores. The primary distributes incoming connections among the workers. It improves throughput for CPU-bound or high-traffic servers and gives some resilience when a worker crashes.",
    detailedAnswer: [
      "Workers do not share memory, so in-memory state such as sessions or caches must move to an external store like Redis.",
      "The primary can restart a worker when it exits.",
      "In modern deployments, a process manager such as PM2 or container replicas often replaces hand-written clustering.",
      "Use `os.availableParallelism()` or `os.cpus().length` to choose the worker count.",
    ],
    realWorldExample:
      "An API on an 8-core server runs eight workers, which handle roughly eight times as many CPU-bound requests as a single process.",
    codeExamples: [
      {
        title: "A minimal cluster",
        language: "javascript",
        code: `import cluster from "node:cluster"
import http from "node:http"
import os from "node:os"

if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork()
  cluster.on("exit", () => cluster.fork())     // restart a crashed worker
} else {
  http.createServer((req, res) => res.end("handled by " + process.pid)).listen(3000)
}`,
        walkthrough: [
          "The primary process forks one worker per available core.",
          "When a worker exits, the primary starts a new one.",
          "Each worker listens on the same port and handles requests.",
          "The process id in the response shows which worker answered.",
        ],
      },
    ],
    commonMistakes: [
      "Keeping session state in worker memory.",
      "Forking more workers than cores without reason.",
    ],
    followUps: [
      { question: "How is clustering different from worker threads?" },
    ],
    answerTips: ["Mention that workers do not share memory."],
    keyPoints: [
      "Multiple processes",
      "Share one port",
      "No shared memory",
      "Process managers often replace it",
    ],
    revisionNotes: ["Cluster = one process per core."],
    sourceRefs: [{ label: "Node.js: Cluster", url: `${API}/cluster.html` }],
    estimatedMinutes: 4,
  },
  {
    slug: "worker-threads",
    topic: "Clustering",
    difficulty: "medium",
    title: "What are worker threads in Node.js and when should you use them?",
    keywords: [
      "worker_threads",
      "cpu-bound",
      "postMessage",
      "SharedArrayBuffer",
      "parallelism",
    ],
    interviewerIntent:
      "Checks that you know the right tool for CPU-heavy work inside a single process.",
    shortAnswer:
      "Worker threads run JavaScript in separate threads inside the same process, each with its own event loop and V8 instance. They are meant for CPU-intensive work such as image processing, hashing or parsing large data, which would otherwise block the main thread. Threads communicate by passing messages with `postMessage`, and can share memory through `SharedArrayBuffer`. They are not needed for ordinary I/O.",
    detailedAnswer: [
      "Starting a worker costs time and memory, so reuse workers with a pool for frequent tasks.",
      "Messages are copied with structured cloning, or transferred for large buffers.",
      "Compared with the cluster module, worker threads share a process and can share memory, while cluster uses separate processes.",
      "Do not use workers just to wait for I/O. The event loop already does that well.",
    ],
    realWorldExample:
      "A report endpoint sends a large dataset to a worker for aggregation and returns the result, while the main thread keeps serving other requests.",
    codeExamples: [
      {
        title: "Offloading a calculation",
        language: "javascript",
        code: `import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads"

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), { workerData: 40 })
  worker.on("message", (result) => console.log("fib =", result))
} else {
  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2))
  parentPort.postMessage(fib(workerData))
}`,
        walkthrough: [
          "The main thread starts a worker running the same file.",
          "`workerData` passes the input value to the worker.",
          "The worker does the heavy calculation and posts the result back.",
          "The main thread receives it as a message and stays responsive meanwhile.",
        ],
      },
    ],
    commonMistakes: [
      "Creating a new worker for every tiny task.",
      "Using workers for I/O-bound work.",
    ],
    followUps: [{ question: "How do threads exchange data?" }],
    answerTips: ["Say 'CPU-bound, not I/O-bound'."],
    keyPoints: [
      "Threads in one process",
      "For CPU-bound work",
      "postMessage communication",
      "Use a pool",
    ],
    revisionNotes: ["Workers keep the main thread free."],
    sourceRefs: [
      { label: "Node.js: Worker threads", url: `${API}/worker_threads.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "child-processes",
    topic: "Clustering",
    difficulty: "medium",
    title:
      "What is the child_process module? What is the difference between spawn, exec and fork?",
    keywords: [
      "child_process",
      "spawn",
      "exec",
      "execFile",
      "fork",
      "command injection",
    ],
    interviewerIntent:
      "Checks that you can run external programs and understand the security risk of shell commands.",
    shortAnswer:
      "The `child_process` module starts other processes. `spawn` runs a command and streams its output, which suits large output. `exec` runs a command in a shell and buffers the whole output in a callback, which suits small output but is limited in size. `execFile` runs a file without a shell. `fork` starts a new Node process with a built-in message channel. Never build shell commands from user input.",
    detailedAnswer: [
      "`exec` uses a shell, so input containing special characters can inject commands.",
      "`spawn` and `execFile` with an argument array avoid that risk.",
      "Child processes have separate memory and crash independently.",
      "Use `fork` and `process.send` for communication between Node processes.",
    ],
    realWorldExample:
      "A backup service spawns `tar` to archive a folder and streams its output to storage.",
    codeExamples: [
      {
        title: "spawn and exec",
        language: "javascript",
        code: `import { spawn, exec } from "node:child_process"

const ls = spawn("ls", ["-la"])                 // arguments as an array, no shell
ls.stdout.on("data", (chunk) => process.stdout.write(chunk))
ls.on("close", (code) => console.log("exit code", code))

exec("node --version", (err, stdout) => {
  if (err) return console.error(err)
  console.log(stdout.trim())
})
// Never: exec("convert " + userFilename)   // command injection risk`,
        walkthrough: [
          "`spawn` takes the program and an array of arguments, and streams output.",
          "The close event reports the exit code.",
          "`exec` buffers the whole output for small commands.",
          "Concatenating user input into a shell command is unsafe.",
        ],
      },
    ],
    commonMistakes: [
      "Passing user input to exec.",
      "Using exec for commands with large output.",
    ],
    followUps: [
      { question: "How do two Node processes communicate with fork?" },
    ],
    answerTips: ["Bring up command injection, it shows security awareness."],
    keyPoints: [
      "spawn streams output",
      "exec buffers and uses a shell",
      "fork is for Node scripts",
      "Avoid shell with user input",
    ],
    revisionNotes: ["spawn for streams, exec for small output."],
    sourceRefs: [
      { label: "Node.js: Child process", url: `${API}/child_process.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "error-handling-patterns",
    topic: "Async patterns",
    difficulty: "medium",
    title:
      "How should you handle errors in Node.js? What are operational errors versus programmer errors?",
    keywords: [
      "error handling",
      "operational errors",
      "programmer errors",
      "custom errors",
      "error codes",
      "try catch",
    ],
    interviewerIntent:
      "Checks mature error handling: which errors to recover from and which mean a bug.",
    shortAnswer:
      "Operational errors are expected runtime failures, such as a failed network request, a missing file or invalid input, and they should be handled and reported properly. Programmer errors are bugs, such as calling a function with the wrong type or reading a property of undefined, and they should be fixed rather than handled. Use try/catch with async/await, error-first callbacks, and custom Error classes with codes so callers can react.",
    detailedAnswer: [
      "Throw `Error` objects, not strings, so that you get a stack trace.",
      'Add context with the `cause` option: `new Error("Load failed", { cause: err })`.',
      "At the application boundary, map errors to responses and log the details once.",
      "For programmer errors, crashing and restarting is often safer than continuing in an unknown state.",
    ],
    realWorldExample:
      "A service throws a `NotFoundError` with `status: 404` for a missing record, and a central handler converts it into an HTTP response.",
    codeExamples: [
      {
        title: "A custom error with a cause",
        language: "javascript",
        code: `class NotFoundError extends Error {
  constructor(resource, options) {
    super(resource + " not found", options)
    this.name = "NotFoundError"
    this.status = 404
  }
}

async function getUser(id) {
  try {
    return await db.users.findById(id)
  } catch (err) {
    throw new Error("Could not load user " + id, { cause: err })
  }
}`,
        walkthrough: [
          "The custom error carries a name and an HTTP status.",
          "`getUser` wraps a low-level failure with a clearer message.",
          "`cause` keeps the original error and its stack.",
          "A top-level handler can read `status` to build the response.",
        ],
      },
    ],
    commonMistakes: [
      "Throwing strings.",
      "Swallowing errors with an empty catch.",
    ],
    followUps: [
      {
        question:
          "Where should errors be logged and where should they be handled?",
      },
    ],
    answerTips: ["Use the operational versus programmer error distinction."],
    keyPoints: [
      "Operational vs programmer errors",
      "Throw Error objects",
      "Add context with cause",
      "Handle at the boundary",
    ],
    revisionNotes: ["Handle expected failures, fix bugs."],
    sourceRefs: [{ label: "Node.js: Errors", url: `${API}/errors.html` }],
    estimatedMinutes: 5,
  },
  {
    slug: "global-objects-and-process",
    topic: "Node internals (V8 and libuv)",
    difficulty: "easy",
    title:
      "What is the global object in Node.js? What does the process object provide?",
    keywords: [
      "globalThis",
      "global",
      "process",
      "argv",
      "exit",
      "cwd",
      "__dirname",
    ],
    interviewerIntent:
      "Checks knowledge of runtime-level objects that every Node script can use.",
    shortAnswer:
      "In Node, the global object is `globalThis` (also called `global`), and it holds things like `setTimeout`, `console` and `process`. Variables declared in a module are scoped to that module and are not global. The `process` object gives information and control over the running process: `process.argv` for command-line arguments, `process.env` for environment variables, `process.cwd()`, `process.exit()` and events such as `exit` and signals.",
    detailedAnswer: [
      "Unlike browsers, there is no `window` in Node.",
      "`process.argv[0]` is the Node path and `argv[1]` is the script path, so your arguments start at index 2.",
      "`process.exit(code)` ends the process immediately. A non-zero code signals failure.",
      '`process.on("SIGTERM", ...)` lets you shut down gracefully when a container stops.',
    ],
    realWorldExample:
      "A CLI tool reads its input file from `process.argv[2]` and exits with code 1 when the file is missing.",
    codeExamples: [
      {
        title: "Using the process object",
        language: "javascript",
        code: `const file = process.argv[2]
if (!file) {
  console.error("Usage: node app.js <file>")
  process.exit(1)
}

console.log("cwd:", process.cwd())
console.log("node:", process.version)

process.on("SIGTERM", () => {
  console.log("shutting down")
  process.exit(0)
})`,
        walkthrough: [
          "The first user argument is at index 2 of `argv`.",
          "A missing argument prints usage and exits with a failure code.",
          "`cwd` and `version` give information about the running process.",
          "A SIGTERM handler allows a clean shutdown.",
        ],
      },
    ],
    commonMistakes: [
      "Looking for window in Node.",
      "Using argv[0] as the first argument.",
    ],
    followUps: [
      {
        question:
          "What is the difference between process.exit() and letting the loop finish?",
      },
    ],
    answerTips: ["Mention argv starting at index 2."],
    keyPoints: [
      "globalThis in Node",
      "Module scope is not global",
      "process.argv, env, cwd, exit",
      "Signals for shutdown",
    ],
    revisionNotes: ["process = the running program."],
    sourceRefs: [{ label: "Node.js: Process", url: `${API}/process.html` }],
    estimatedMinutes: 3,
  },
  {
    slug: "memory-leaks-in-node",
    topic: "Node internals (V8 and libuv)",
    difficulty: "hard",
    title:
      "What commonly causes memory leaks in Node.js and how do you find them?",
    keywords: [
      "memory leak",
      "heap snapshot",
      "garbage collection",
      "global variables",
      "event listeners",
      "--inspect",
    ],
    interviewerIntent:
      "A production-readiness question. It checks that you can reason about memory growth and diagnose it.",
    shortAnswer:
      "Common causes are growing global arrays or maps used as caches with no limit, event listeners added and never removed, closures holding large objects, unclosed timers and connections, and unbounded queues. To find a leak, watch memory over time with `process.memoryUsage()`, run with `--inspect`, take heap snapshots in Chrome DevTools and compare them to see which objects keep growing.",
    detailedAnswer: [
      "A steadily rising heap that never drops after garbage collection is the typical sign.",
      "Use a bounded cache with an eviction policy, or an external cache such as Redis.",
      "`WeakMap` and `WeakRef` allow objects to be collected when nothing else references them.",
      "The `MaxListenersExceededWarning` often points to a listener leak.",
    ],
    realWorldExample:
      "A server stored each request's data in a module-level array for debugging, and memory grew until the process was killed.",
    codeExamples: [
      {
        title: "An unbounded cache versus a bounded one",
        language: "javascript",
        code: `// Leak: grows forever
const cache = new Map()
export function getUser(id) {
  if (!cache.has(id)) cache.set(id, loadUser(id))
  return cache.get(id)
}

// Bounded: drop the oldest entry
const MAX = 1000
export function getUserBounded(id) {
  if (!cache.has(id)) {
    if (cache.size >= MAX) cache.delete(cache.keys().next().value)
    cache.set(id, loadUser(id))
  }
  return cache.get(id)
}`,
        walkthrough: [
          "The first version never removes entries, so memory grows with every new id.",
          "The second version limits the size and removes the oldest entry.",
          "In production an eviction library or external cache is usually better.",
        ],
      },
    ],
    commonMistakes: [
      "Caching without a limit.",
      "Adding listeners inside a request handler without removing them.",
    ],
    followUps: [{ question: "How do heap snapshots help?" }],
    answerTips: ["Describe the diagnosis steps: observe, snapshot, compare."],
    keyPoints: [
      "Unbounded caches and listeners",
      "Closures retaining objects",
      "process.memoryUsage and heap snapshots",
      "Bound your caches",
    ],
    revisionNotes: ["Growth after GC means a leak."],
    sourceRefs: [
      {
        label: "Node.js: Diagnostics (memory)",
        url: `${LEARN}/diagnostics/memory`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "graceful-shutdown",
    topic: "Clustering",
    difficulty: "medium",
    title: "How do you shut down a Node.js server gracefully?",
    keywords: [
      "graceful shutdown",
      "SIGTERM",
      "SIGINT",
      "server.close",
      "in-flight requests",
      "containers",
    ],
    interviewerIntent:
      "Checks deployment awareness: stopping without dropping requests or leaking connections.",
    shortAnswer:
      "Listen for `SIGTERM` and `SIGINT`, stop accepting new connections with `server.close()`, wait for in-flight requests to finish, then close other resources such as database connections and exit. Add a timeout so a stuck connection cannot block shutdown forever. Containers and process managers send SIGTERM first and force-kill later, so a graceful handler avoids cut-off requests during deploys.",
    detailedAnswer: [
      "`server.close(cb)` stops listening but waits for existing connections to end.",
      "Keep-alive connections may need to be closed with `server.closeIdleConnections()`.",
      "Mark the service as not ready so a load balancer stops sending traffic before you close.",
      "Exit with code 0 on a clean shutdown and non-zero when something failed.",
    ],
    realWorldExample:
      "During a rolling deploy, the old instance receives SIGTERM, finishes its requests in a few seconds, and exits while the new instance takes traffic.",
    codeExamples: [
      {
        title: "A shutdown handler",
        language: "javascript",
        code: `const server = app.listen(3000)

async function shutdown(signal) {
  console.log(signal + " received, closing")
  const timer = setTimeout(() => process.exit(1), 10_000)   // force after 10 s
  timer.unref()

  server.close(async () => {
    await db.close()
    process.exit(0)
  })
  server.closeIdleConnections()
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))`,
        walkthrough: [
          "Both signals start the same shutdown routine.",
          "A timer forces an exit if the shutdown takes too long.",
          "`server.close` stops new connections and waits for current ones.",
          "The database connection is closed before exiting cleanly.",
        ],
      },
    ],
    commonMistakes: [
      "Calling process.exit immediately and cutting requests.",
      "No timeout, so shutdown can hang.",
    ],
    followUps: [{ question: "Why do containers send SIGTERM before SIGKILL?" }],
    answerTips: ["Mention the timeout and the database close."],
    keyPoints: [
      "Handle SIGTERM and SIGINT",
      "server.close",
      "Close resources",
      "Force exit after a timeout",
    ],
    revisionNotes: ["Stop accepting, finish, close, exit."],
    sourceRefs: [
      {
        label: "Node.js: Process signal events",
        url: `${API}/process.html#signal-events`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "path-and-os-modules",
    topic: "Modules",
    difficulty: "easy",
    title:
      "What are the path and os modules used for? Why use path.join instead of string concatenation?",
    keywords: [
      "path",
      "path.join",
      "path.resolve",
      "os",
      "cross platform",
      "__dirname",
    ],
    interviewerIntent:
      "Checks everyday core module knowledge and cross-platform habits.",
    shortAnswer:
      "The `path` module builds and parses file paths in a way that works on every operating system. `path.join` joins segments with the correct separator, `path.resolve` produces an absolute path, and `basename`, `dirname` and `extname` split a path. Concatenating strings breaks on Windows, which uses backslashes. The `os` module reports system information such as CPU count, memory and the home directory.",
    detailedAnswer: [
      '`path.join("a", "..", "b")` normalises to `b`, which also helps to avoid some path mistakes.',
      "`path.resolve` starts from the current working directory when given relative paths.",
      "Never build file paths straight from user input. Validate against a base directory to prevent path traversal.",
      "`os.EOL` gives the right line ending and `os.tmpdir()` the temp directory.",
    ],
    realWorldExample:
      "An upload handler builds the destination with `path.join(uploadDir, path.basename(filename))` to stop a filename like `../../etc/passwd` from escaping the folder.",
    codeExamples: [
      {
        title: "Safe path handling",
        language: "javascript",
        code: `import path from "node:path"
import os from "node:os"

const file = path.join("data", "reports", "2025.csv")
console.log(path.extname(file))        // .csv
console.log(path.basename(file))       // 2025.csv
console.log(path.resolve(file))        // absolute path

const safeName = path.basename("../../secret.txt")   // "secret.txt"
console.log(os.cpus().length, os.homedir())`,
        walkthrough: [
          "`join` uses the platform's separator.",
          "`extname` and `basename` split parts of the path.",
          "`basename` removes any directory part, which blocks traversal in file names.",
          "`os` gives machine information.",
        ],
      },
    ],
    commonMistakes: [
      "Concatenating paths with slashes.",
      "Using user-supplied paths unchecked.",
    ],
    followUps: [{ question: "What is a path traversal attack?" }],
    answerTips: ["Mention path traversal, it shows security awareness."],
    keyPoints: [
      "path.join and resolve",
      "Cross-platform separators",
      "basename for safe names",
      "os for system info",
    ],
    revisionNotes: ["Use path, not string concatenation."],
    sourceRefs: [
      { label: "Node.js: Path", url: `${API}/path.html` },
      { label: "Node.js: OS", url: `${API}/os.html` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "timers-and-intervals",
    topic: "Event loop",
    difficulty: "easy",
    title:
      "How do timers work in Node.js? What are the limits of setTimeout and setInterval?",
    keywords: [
      "setTimeout",
      "setInterval",
      "clearTimeout",
      "unref",
      "timer drift",
      "event loop",
    ],
    interviewerIntent:
      "Checks that you know timers are not exact and can keep a process alive.",
    shortAnswer:
      "`setTimeout` runs a callback after at least the given delay, and `setInterval` repeats it. The delay is a minimum, because the callback only runs when the event loop gets to the timers phase, so a busy loop makes timers late and intervals can drift. Active timers keep the process running, so clear them with `clearTimeout` or `clearInterval`, or call `unref()` to let the process exit.",
    detailedAnswer: [
      "A delay of 0 is treated as 1 millisecond.",
      "For a periodic task, schedule the next run with `setTimeout` after the current one finishes to avoid overlapping runs.",
      "Node also has promise-based timers in `node:timers/promises`.",
      "Never rely on timers for precise timing or ordering between tasks.",
    ],
    realWorldExample:
      "A cleanup job runs every minute with a recursive `setTimeout`, so a slow run never overlaps with the next one.",
    codeExamples: [
      {
        title: "Recursive timeout and promise timer",
        language: "javascript",
        code: `import { setTimeout as sleep } from "node:timers/promises"

async function poll() {
  while (true) {
    await doWork()
    await sleep(60_000)             // wait 60 s after the work finishes
  }
}

const timer = setInterval(() => console.log("tick"), 1000)
timer.unref()                        // do not keep the process alive for this timer
setTimeout(() => clearInterval(timer), 3500)`,
        walkthrough: [
          "The loop waits after each piece of work, so runs cannot overlap.",
          "`sleep` is a promise-based timer.",
          "`unref` lets the process exit even if this interval is still active.",
          "`clearInterval` stops the repeating timer.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming exact timing.",
      "Forgetting to clear intervals.",
    ],
    followUps: [{ question: "Why might setInterval callbacks overlap?" }],
    answerTips: ["Say 'at least the delay, never exactly'."],
    keyPoints: [
      "Delay is a minimum",
      "Timers can drift",
      "Timers keep the process alive",
      "Prefer recursive setTimeout",
    ],
    revisionNotes: ["Timers are late, not early."],
    sourceRefs: [{ label: "Node.js: Timers", url: `${API}/timers.html` }],
    estimatedMinutes: 3,
  },
  {
    slug: "testing-in-node-and-debugging",
    topic: "Node internals (V8 and libuv)",
    difficulty: "easy",
    title: "How do you debug and test a Node.js application?",
    keywords: [
      "debugging",
      "--inspect",
      "node:test",
      "console.log",
      "breakpoints",
      "unit tests",
    ],
    interviewerIntent:
      "Checks practical engineering habits beyond writing code.",
    shortAnswer:
      "For debugging, start Node with `--inspect` and attach Chrome DevTools or the editor's debugger to set breakpoints, step through code and inspect variables, which is more effective than scattering `console.log` calls. For testing, Node includes a built-in test runner, `node --test`, with `node:test` and `node:assert`, and many projects use Jest or Vitest. Test pure logic with unit tests and routes with integration tests.",
    detailedAnswer: [
      "`node --inspect-brk app.js` pauses on the first line so you can attach before anything runs.",
      "Use structured logging in production instead of console.log.",
      "Mock external services such as databases and HTTP calls in unit tests.",
      "Run tests in CI on every change.",
    ],
    realWorldExample:
      "A bug in an order total only appeared for certain input, and a breakpoint inside the function showed an unexpected string value.",
    codeExamples: [
      {
        title: "A test with the built-in runner",
        language: "javascript",
        code: `// total.test.js
import { test } from "node:test"
import assert from "node:assert/strict"

function total(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0)
}

test("sums price times quantity", () => {
  assert.equal(total([{ price: 10, qty: 2 }, { price: 5, qty: 1 }]), 25)
})
// Run: node --test`,
        walkthrough: [
          "The test imports the built-in test function and strict assertions.",
          "The function under test is pure, so it is easy to check.",
          "`node --test` finds and runs files like this one.",
        ],
      },
    ],
    commonMistakes: [
      "Debugging only with console.log.",
      "Tests that depend on real external services.",
    ],
    followUps: [{ question: "How would you test an API route?" }],
    answerTips: ["Mention both the inspector and the built-in test runner."],
    keyPoints: [
      "--inspect for debugging",
      "Breakpoints beat console.log",
      "node --test built in",
      "Mock external services",
    ],
    revisionNotes: ["Inspect, break, test."],
    sourceRefs: [
      {
        label: "Node.js: Debugging Node.js",
        url: `${LEARN}/getting-started/debugging`,
      },
      { label: "Node.js: Test runner", url: `${API}/test.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "security-basics-in-node",
    topic: "Node internals (V8 and libuv)",
    difficulty: "medium",
    title: "What are the basic security practices for a Node.js application?",
    keywords: [
      "security",
      "input validation",
      "dependencies",
      "npm audit",
      "injection",
      "environment secrets",
    ],
    interviewerIntent:
      "Checks that you think about security as a developer, even without a dedicated security role.",
    shortAnswer:
      "Validate and sanitise all input, use parameterised queries to prevent injection, keep secrets in environment variables or a secret manager, and keep dependencies updated with `npm audit`. Do not run shell commands built from user input, set secure HTTP headers, use HTTPS, limit request sizes and rates, and run the process with the least privileges needed. Do not expose internal error details to clients.",
    detailedAnswer: [
      "Dependencies are a big attack surface. Pin versions with a lock file and review updates.",
      "Avoid `eval` and `new Function` with user data.",
      "Hash passwords with a slow algorithm such as bcrypt or argon2, never store them in plain text.",
      "Set request body size limits so a client cannot exhaust memory.",
    ],
    realWorldExample:
      "An endpoint that built SQL by string concatenation was fixed by switching to a parameterised query, which closed an injection hole.",
    commonMistakes: [
      "Trusting client input.",
      "Logging secrets or returning stack traces to clients.",
    ],
    followUps: [
      {
        question:
          "What is the difference between authentication and authorization?",
      },
    ],
    answerTips: [
      "Group the list: input, dependencies, secrets, transport, limits.",
    ],
    keyPoints: [
      "Validate input",
      "Parameterised queries",
      "Secrets outside code",
      "Audit dependencies",
    ],
    revisionNotes: ["Never trust input, keep dependencies fresh."],
    sourceRefs: [
      {
        label: "Node.js: Security best practices",
        url: `${LEARN}/getting-started/security-best-practices`,
      },
    ],
    estimatedMinutes: 4,
  },
])
