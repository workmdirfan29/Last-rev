import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "promises-and-async-await",
  title: "Asynchronous JavaScript: callbacks, promises and async/await",
  topic: "Asynchronous JavaScript",
  minutes: 90,
  overview:
    "Understand why JavaScript needs asynchronous code, and use promises and async/await to run tasks in sequence, in parallel and with errors handled.",
  objectives: [
    "Explain callbacks and why they lead to nested code",
    "Create and chain promises and use async/await",
    "Run tasks in parallel with Promise.all and handle failures correctly",
  ],
  prerequisites: ["lesson.javascript.error-handling"],
  sections: [
    {
      kind: "explain",
      heading: "Why asynchronous code",
      body: [
        "JavaScript runs your code on one thread. If a task such as a network request or a timer blocked that thread, the page would freeze. So these tasks are started, and the program **continues**. The result is delivered later, when it is ready, to a function that you provided.",
        "The oldest form is the **callback**: `setTimeout(() => ..., 100)`. Callbacks work, but when one step depends on the one before, they nest deeper and deeper, and error handling must be repeated at each level. Promises were added to solve this.",
      ],
    },
    {
      kind: "explain",
      heading: "Promises",
      body: [
        "A **promise** is an object that stands for a value that is not available yet. It is in one of three states: **pending**, **fulfilled** with a value, or **rejected** with a reason. Once it is settled, it never changes.",
        "You react with `.then(onFulfilled)`, `.catch(onRejected)` and `.finally(onDone)`. Each of these returns a **new promise**, so they can be chained. A value returned from `then` becomes the value of the next promise, and a promise returned from `then` is waited for. A thrown error or a rejection skips ahead to the next `catch`.",
        "`Promise.resolve(value)` and `Promise.reject(error)` make settled promises, and `new Promise((resolve, reject) => ...)` wraps older, callback-based code.",
      ],
    },
    {
      kind: "code",
      heading: "A chain",
      example: {
        title: "then, catch and finally",
        language: "javascript",
        code: "const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));\n\nwait(10, 2)\n  .then((n) => n * 10)\n  .then((n) => {\n    if (n > 15) throw new Error('too big');\n    return n;\n  })\n  .catch((e) => {\n    console.log('caught', e.message);\n    return 0;\n  })\n  .finally(() => console.log('finished'))\n  .then((n) => console.log('result', n));",
        walkthrough: [
          "`wait` wraps `setTimeout` in a promise that resolves after the delay.",
          "The first `then` gives `20`, and the second one throws because `20 > 15`.",
          "The `catch` handles the error and returns `0`, which becomes the value for the rest of the chain.",
          "`finally` runs next, and then the last `then` prints `result 0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "async and await",
      body: [
        "An `async` function always returns a promise. Inside it, `await promise` pauses **that function** until the promise settles, and gives the value, or throws the rejection reason. The rest of the program keeps running while it waits.",
        "This lets asynchronous code read like normal code, with `try/catch` for errors: `try { const data = await load(); } catch (e) { ... }`. `await` can only be used inside an `async` function or at the top level of a module.",
        "Awaiting several tasks **one after another** makes them run one after another. If they do not depend on each other, start them together and wait for all of them: `await Promise.all([a(), b()])`.",
      ],
    },
    {
      kind: "code",
      heading: "Sequence and parallel",
      example: {
        title: "await and Promise.all",
        language: "javascript",
        code: "const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));\n\nasync function main() {\n  const a = await wait(20, 'A');\n  const b = await wait(20, 'B');\n  console.log(a + b);\n  const [x, y] = await Promise.all([wait(20, 'X'), wait(20, 'Y')]);\n  console.log(x + y);\n  try {\n    await Promise.reject(new Error('boom'));\n  } catch (e) {\n    console.log(e.message);\n  }\n}\nmain();",
        walkthrough: [
          "The first two awaits run one after another and take about 40 ms in total.",
          "`Promise.all` starts both tasks together, so they take about 20 ms, and gives the results in order.",
          "A rejected promise throws at the `await`, so `try/catch` handles it, as with ordinary code.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "The promise combinators",
      diagram: {
        kind: "table",
        title: "Choosing a combinator",
        headers: ["Method", "Waits for", "Result"],
        rows: [
          [
            "Promise.all",
            "Every promise to fulfil",
            "Array of values, or rejects at the first failure",
          ],
          [
            "Promise.allSettled",
            "Every promise to settle",
            "Array of status objects, never rejects",
          ],
          [
            "Promise.race",
            "The first promise to settle",
            "That one result or failure",
          ],
          [
            "Promise.any",
            "The first promise to fulfil",
            "That value, or rejects if all fail",
          ],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting `await` and using a promise as a value.",
          fix: "Add `await`. Otherwise you get a `Promise` object, not the result.",
        },
        {
          mistake: "Using `await` in a loop for tasks that are independent.",
          fix: "Start them together and use `Promise.all`.",
        },
        {
          mistake: "Having no error handling for a promise chain.",
          fix: "Add `.catch`, or use `try/catch` with `await`. An unhandled rejection is reported as an error.",
        },
        {
          mistake:
            "Using `forEach` with an async callback and expecting it to wait.",
          fix: "`forEach` ignores the returned promises. Use `for...of` with `await`, or `Promise.all` with `map`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Loading a dashboard",
      scenario:
        "A dashboard needs the user, their orders and a list of notices. The three requests do not depend on each other.",
      body: [
        "Start the three requests together and `await Promise.all`, so the page waits for the slowest request, not for the sum of all three.",
        "If one of them may fail without breaking the page, use `Promise.allSettled` and show what succeeded.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "then-order",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "Promise.resolve(1)\n  .then((n) => n + 1)\n  .then((n) => console.log(n));\nconsole.log('sync');",
      },
      options: ["sync then 2", "2 then sync", "sync only"],
      answer: 0,
      explanation:
        "`then` callbacks run after the current code finishes, so `sync` is printed first.",
    },
    {
      type: "output",
      id: "async-return",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "async function f() {\n  return 5;\n}\nconst p = f();\nconsole.log(p instanceof Promise);\np.then((v) => console.log(v));",
      },
      options: ["true then 5", "5 then true", "false then 5"],
      answer: 0,
      explanation:
        "An async function always returns a promise. The value arrives later.",
    },
    {
      type: "single",
      id: "promise-all-fail",
      prompt: "What happens to `Promise.all([a, b])` if `b` rejects?",
      options: [
        "It rejects with that reason",
        "It waits for a and then resolves",
        "It ignores b",
      ],
      answer: 0,
      explanation:
        "`Promise.all` rejects as soon as one promise rejects. Use `allSettled` to get every result.",
    },
    {
      type: "truefalse",
      id: "await-blocks",
      statement:
        "`await` blocks the whole JavaScript program until the promise settles.",
      answer: false,
      explanation:
        "It pauses only the async function. The rest of the program continues running.",
    },
  ],
  assignment: {
    title: "Fetch with timeout and retry",
    task: [
      "Write `delay(ms)`, which returns a promise, and `retry(task, times)`, which runs an async function again after failures.",
      "Use `Promise.race` to add a timeout, and `Promise.all` to run three tasks in parallel and print the total time.",
    ],
    checklist: [
      "retry stops after the given number of attempts",
      "The timeout rejects with a clear error",
      "The parallel version is faster than the sequential one",
    ],
    minutes: 40,
  },
  exercises: [
    {
      slug: "sum-async",
      title: "Sum async values",
      task: [
        "Write `async function sumAsync(values)` where `values` is an array of numbers. Wait for all of them as promises with `Promise.all` (wrap each in `Promise.resolve`) and return the sum.",
      ],
      language: "javascript",
      starter: "async function sumAsync(values) {\n  // your code\n}",
      solution:
        "async function sumAsync(values) {\n  const numbers = await Promise.all(values.map((v) => Promise.resolve(v)));\n  return numbers.reduce((a, b) => a + b, 0);\n}",
      hints: ["`Promise.all` accepts an array and gives an array of values."],
      checklist: [
        "An empty array gives 0",
        "Numbers are added",
        "The function returns a promise",
      ],
      run: {
        entry: "sumAsync",
        cases: [
          {
            name: "empty",
            args: [[]],
            expected: 0,
          },
          {
            name: "some",
            args: [[1, 2, 3]],
            expected: 6,
          },
          {
            name: "negatives",
            args: [[-1, 1, 5]],
            expected: 5,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Callbacks nest; promises chain; async/await reads like normal code",
    "A promise is pending, fulfilled or rejected, and never changes after that",
    "`then`/`catch`/`finally` return new promises",
    "Independent tasks: `Promise.all`; use try/catch around await",
  ],
  resources: [
    {
      label: "MDN: Using promises",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises",
    },
    {
      label: "MDN: async function",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
    },
    {
      label: "MDN: Promise",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    },
  ],
})
