import { defineLesson } from "@/data/lessons/author"

export default defineLesson("nodejs", {
  slug: "event-loop",
  title: "The Node.js event loop, timers and nextTick",
  topic: "Event loop",
  minutes: 90,
  overview:
    "Understand how one JavaScript thread handles many tasks: the phases of the event loop, the microtask queues, and the order of setTimeout, setImmediate, process.nextTick and promises.",
  objectives: [
    "Describe the event loop phases and where callbacks run",
    "Predict the order of nextTick, promise callbacks, timers and setImmediate",
    "Explain why blocking the loop with heavy synchronous work hurts every request",
  ],
  prerequisites: ["javascript"],
  sections: [
    {
      kind: "explain",
      heading: "One thread, non-blocking I/O",
      body: [
        "Node.js runs your JavaScript on a single thread by default. The **event loop** is what lets it perform non-blocking I/O anyway: it hands operations to the system kernel whenever possible, and when one finishes the kernel tells Node.js so the callback can be queued and run.",
        "When Node.js starts it runs your script, which may schedule timers, start async work or call `process.nextTick()`, and then it enters the event loop. The loop keeps running while there is work left, and the process exits when there is none.",
        "Because there is one thread, a callback that runs for a long time stops everything else. This is why you never block the loop with large synchronous computations or `*Sync` file calls in a server.",
      ],
    },
    {
      kind: "diagram",
      heading: "The phases",
      diagram: {
        kind: "table",
        title: "Event loop phases in order",
        headers: ["Phase", "What runs there"],
        rows: [
          ["timers", "Callbacks of setTimeout and setInterval whose time has come"],
          ["pending callbacks", "Some system callbacks that were deferred"],
          ["idle, prepare", "Used internally"],
          ["poll", "Retrieves new I/O events and runs their callbacks; may wait for them"],
          ["check", "setImmediate callbacks"],
          ["close callbacks", "Close events, such as a socket being destroyed"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Microtasks and nextTick",
      body: [
        "Between the phases, Node.js empties two queues. The `process.nextTick()` queue runs first, and then the promise **microtask** queue. Both run after the current operation completes, before the loop moves on.",
        "That makes `process.nextTick(fn)` run before any promise callback, and before any timer or I/O callback. Recursive `nextTick` calls can starve the loop, because the loop never gets to the next phase.",
        "`setImmediate(fn)` runs in the **check** phase, right after the poll phase. `setTimeout(fn, 0)` runs in the **timers** phase once the minimum delay has passed. Called from the main module, the order of the two depends on process performance and is not guaranteed. Called from inside an I/O callback, `setImmediate` always runs first.",
      ],
    },
    {
      kind: "code",
      heading: "Predicting the order",
      example: {
        title: "Sync, nextTick, promise, timer, immediate",
        language: "javascript",
        code: "console.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('immediate'));\nPromise.resolve().then(() => console.log('promise'));\nprocess.nextTick(() => console.log('nextTick'));\nconsole.log('end');",
        walkthrough: [
          "`start` and `end` print first, because the main script runs to completion before anything else.",
          "Then the `process.nextTick` queue runs, so `nextTick` is next.",
          "Then the promise microtask runs, so `promise` follows.",
          "`timeout` and `immediate` come last. From the main module their relative order is not guaranteed, so do not depend on it.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Running heavy CPU work or readFileSync in a request handler.",
          fix: "Use asynchronous APIs, or move CPU-heavy work to a worker thread or another process.",
        },
        {
          mistake: "Relying on the order of setTimeout 0 and setImmediate in the main module.",
          fix: "Use them only when the order does not matter, or place both inside an I/O callback where the order is fixed.",
        },
        {
          mistake: "Calling process.nextTick recursively.",
          fix: "That blocks the loop from advancing. Use setImmediate to yield to the loop.",
        },
        {
          mistake: "Thinking Node.js is multi-threaded for JavaScript code.",
          fix: "JavaScript runs on one thread. The system and a thread pool do I/O work in the background.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Keeping a server responsive",
      scenario:
        "A request handler sorts a very large array and the whole server stops answering other requests while it runs.",
      body: [
        "The sort runs on the one JavaScript thread, so no other callback can run. Split the work into chunks and yield between them with `setImmediate`, or move the job to a worker thread.",
        "Measure first: the delay between scheduling and running a timer shows how long the loop is blocked.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "tick-promise-order",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "Promise.resolve().then(() => console.log('A'));\nprocess.nextTick(() => console.log('B'));\nconsole.log('C');",
      },
      options: ["C, B, A", "C, A, B", "B, A, C"],
      answer: 0,
      explanation:
        "The synchronous log runs first (C). The nextTick queue runs before promise callbacks, so B then A.",
    },
    {
      type: "single",
      id: "immediate-phase",
      prompt: "In which phase do setImmediate callbacks run?",
      options: ["check", "timers", "poll"],
      answer: 0,
      explanation:
        "setImmediate callbacks run in the check phase, right after the poll phase.",
    },
    {
      type: "truefalse",
      id: "single-thread",
      statement: "Your JavaScript code in Node.js normally runs on a single thread.",
      answer: true,
      explanation:
        "Node.js uses one thread for JavaScript, and the event loop plus the system handle I/O in the background.",
    },
    {
      type: "blank",
      id: "block-loop",
      prompt: "Running a long synchronous loop will ___ the event loop for every other request.",
      answer: "block",
      accepted: ["blocks"],
      explanation:
        "While synchronous code runs, no other callback can run.",
    },
  ],
  assignment: {
    title: "Order of execution lab",
    task: [
      "Write a script that uses synchronous logs, nextTick, a promise, setTimeout 0 and setImmediate, and predict the order before running it.",
      "Then put the timer and the immediate inside a fs.readFile callback and run it several times.",
    ],
    checklist: [
      "I wrote my prediction down before running",
      "I can explain the position of each line of output",
      "I saw that inside an I/O callback setImmediate runs first",
      "I can explain why nextTick can starve the loop",
    ],
    hints: ["Run the main-module version a few times to see that its order can vary."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "split-into-chunks",
      title: "Split work into chunks",
      task: [
        "Long jobs should be split so the loop can run other callbacks between the pieces. Write `chunk(items, size)` that returns an array of arrays, each with at most `size` items, in order.",
      ],
      language: "javascript",
      starter: "function chunk(items, size) {\n  // your code\n}",
      solution:
        "function chunk(items, size) {\n  const out = [];\n  for (let i = 0; i < items.length; i += size) {\n    out.push(items.slice(i, i + size));\n  }\n  return out;\n}",
      hints: ["Use slice(i, i + size) in a loop that steps by size."],
      checklist: [
        "Chunks keep the original order",
        "The last chunk may be shorter",
        "An empty array gives an empty result",
      ],
      run: {
        entry: "chunk",
        cases: [
          { name: "even split", args: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] },
          { name: "short last", args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
          { name: "empty", args: [[], 3], expected: [] },
        ],
      },
    },
  ],
  revisionNotes: [
    "Phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks",
    "After each operation: nextTick queue first, then promise microtasks",
    "setImmediate runs in check; setTimeout 0 in timers; order from the main module is not guaranteed",
    "Never block the loop with long synchronous work",
  ],
  resources: [
    {
      label: "Node.js: The event loop, timers and process.nextTick()",
      url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    },
    {
      label: "Node.js: Understanding process.nextTick()",
      url: "https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick",
    },
    {
      label: "Node.js: Understanding setImmediate()",
      url: "https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate",
    },
  ],
})
