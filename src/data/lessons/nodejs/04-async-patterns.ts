import { defineLesson } from "@/data/lessons/author"

export default defineLesson("nodejs", {
  slug: "async-patterns",
  title: "Async patterns: callbacks, promises and async/await",
  topic: "Async patterns",
  minutes: 80,
  overview:
    "Write asynchronous Node.js code in the three main styles, convert between them, run tasks in sequence or in parallel, and handle errors correctly.",
  objectives: [
    "Use error-first callbacks, promises and async/await, and convert callbacks with util.promisify",
    "Run tasks in parallel with Promise.all and choose between all, allSettled and race",
    "Handle errors with try/catch and avoid unhandled rejections",
  ],
  prerequisites: ["lesson.nodejs.event-loop"],
  sections: [
    {
      kind: "explain",
      heading: "Three styles",
      body: [
        "The oldest Node.js style is the **error-first callback**: the callback's first argument is an error (or `null`) and the result follows. `fs.readFile(path, (err, data) => { … })` is the typical shape.",
        "**Promises** represent a future value and are chained with `.then()` and `.catch()`. **async/await** is syntax on top of promises that lets you write asynchronous steps like ordinary code, with `await` pausing the function until the promise settles.",
        "Many core modules offer promise versions: `node:fs/promises`, `node:timers/promises` and more. `util.promisify` turns a callback-style function that follows the error-first convention into one that returns a promise.",
      ],
    },
    {
      kind: "code",
      heading: "From callbacks to async/await",
      example: {
        title: "Three versions of the same step",
        language: "javascript",
        code: "import fs from 'node:fs';\nimport { readFile } from 'node:fs/promises';\nimport { promisify } from 'node:util';\n\nfs.readFile('a.txt', 'utf8', (err, text) => {\n  if (err) return console.error(err);\n  console.log(text.length);\n});\n\nconst readAsync = promisify(fs.readFile);\nreadAsync('a.txt', 'utf8').then((t) => console.log(t.length));\n\nasync function main() {\n  try {\n    const text = await readFile('a.txt', 'utf8');\n    console.log(text.length);\n  } catch (err) {\n    console.error(err);\n  }\n}\nmain();",
        walkthrough: [
          "The callback must check `err` first, and `return` so the rest does not run.",
          "`promisify` wraps the callback function so it returns a promise.",
          "In `async/await` the function pauses at `await`, and a rejected promise becomes an exception that `try/catch` can handle.",
          "An `async` function always returns a promise, so callers must also await it or handle its rejection.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Sequence and parallel",
      example: {
        title: "await in a loop versus Promise.all",
        language: "javascript",
        code: "const wait = (ms, value) =>\n  new Promise((resolve) => setTimeout(() => resolve(value), ms));\n\nasync function sequential() {\n  const a = await wait(100, 'a');\n  const b = await wait(100, 'b');\n  return [a, b];\n}\n\nasync function parallel() {\n  return Promise.all([wait(100, 'a'), wait(100, 'b')]);\n}\n\nsequential().then(console.log);\nparallel().then(console.log);",
        walkthrough: [
          "`sequential` waits for the first call before it starts the second, so it takes about 200 milliseconds.",
          "`parallel` starts both at once and `Promise.all` waits for all, taking about 100 milliseconds.",
          "`Promise.all` rejects as soon as one promise rejects. `Promise.allSettled` waits for all and reports each result. `Promise.race` settles with the first to finish.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Errors",
      body: [
        "A thrown error inside an `async` function becomes a rejected promise. Always handle it with `try/catch` around the `await`, or with `.catch()`.",
        "A rejection nobody handles is an **unhandled rejection**, and in modern Node.js it terminates the process by default. Do not leave promises floating: await them, return them or catch them.",
        "Use `for…of` with `await` when order matters, and avoid `await` inside `forEach`, which does not wait for the callbacks.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Awaiting independent tasks one after the other.",
          fix: "Start them together and await Promise.all.",
        },
        {
          mistake: "Using await inside array.forEach.",
          fix: "Use a for…of loop, or Promise.all with map.",
        },
        {
          mistake: "Forgetting to return or await a promise inside a function.",
          fix: "Return it or await it so errors and ordering propagate.",
        },
        {
          mistake: "Ignoring err in a callback.",
          fix: "Check err first on every error-first callback.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Fetching several resources",
      scenario:
        "A handler must load a user, their orders and their settings, none of which depends on the others.",
      body: [
        "Start the three calls together and await them with `Promise.all`. The handler then waits only as long as the slowest call.",
        "If one failing call should not stop the others, use `Promise.allSettled` and treat each result according to its status.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "error-first",
      prompt: "In an error-first callback, what is the first argument?",
      options: ["An error or null", "The result", "The callback itself"],
      answer: 0,
      explanation:
        "The first argument holds the error, or null if there was none. The result comes after.",
    },
    {
      type: "output",
      id: "async-return",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "async function f() {\n  return 1;\n}\nconsole.log(f() instanceof Promise);",
      },
      options: ["true", "false", "1"],
      answer: 0,
      explanation:
        "An async function always returns a promise, even when it returns a plain value.",
    },
    {
      type: "truefalse",
      id: "all-rejects",
      statement: "Promise.all rejects as soon as one of the promises rejects.",
      answer: true,
      explanation:
        "That is why Promise.allSettled exists, when you want every result.",
    },
    {
      type: "blank",
      id: "promisify-fn",
      prompt: "util.___ converts an error-first callback function into one that returns a promise.",
      answer: "promisify",
      explanation:
        "`util.promisify(fn)` wraps a callback-style function.",
    },
  ],
  assignment: {
    title: "Parallel loader",
    task: [
      "Write a script with a helper that simulates loading data after a delay and sometimes fails.",
      "Load five items sequentially, then in parallel with Promise.all, then with Promise.allSettled, and time each version.",
    ],
    checklist: [
      "The sequential version is slower",
      "Promise.all rejects when one load fails",
      "allSettled reports every result",
      "No promise is left unhandled",
    ],
    hints: ["Use console.time and console.timeEnd for simple timings."],
    minutes: 35,
  },
  exercises: [
    {
      slug: "run-in-parallel",
      title: "Collect results in order",
      task: [
        "Write `mapAsync(items, fn)` where `fn` returns a promise. It should start all calls at once and resolve to an array of the results in the same order as the items.",
      ],
      language: "javascript",
      starter: "async function mapAsync(items, fn) {\n  // your code\n}",
      solution:
        "async function mapAsync(items, fn) {\n  return Promise.all(items.map((item) => fn(item)));\n}",
      hints: ["Promise.all keeps the order of the input array."],
      checklist: [
        "All calls start immediately",
        "Results keep the order of the items",
        "An empty array gives an empty array",
      ],
    },
  ],
  revisionNotes: [
    "Error-first callbacks, promises, and async/await all describe the same asynchronous work",
    "util.promisify and fs/promises give promise versions of callback APIs",
    "Independent tasks: Promise.all. All results regardless of failure: Promise.allSettled",
    "Handle every rejection; do not use await inside forEach",
  ],
  resources: [
    {
      label: "Node.js: Asynchronous flow control",
      url: "https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control",
    },
    {
      label: "Node.js: JavaScript asynchronous programming and callbacks",
      url: "https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks",
    },
    {
      label: "Node.js: util.promisify",
      url: "https://nodejs.org/api/util.html",
    },
  ],
})
