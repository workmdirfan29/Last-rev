import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "event-loop",
  title: "The event loop, the call stack and task queues",
  topic: "Event loop",
  minutes: 80,
  overview:
    "See how one thread runs synchronous code, timers and promises in a fixed order, and predict the output of mixed code.",
  objectives: [
    "Describe the call stack, the task queue and the microtask queue",
    "Predict the order of synchronous code, promises and timers",
    "Explain why long tasks freeze a page and how to avoid it",
  ],
  prerequisites: ["lesson.javascript.promises-and-async-await"],
  sections: [
    {
      kind: "explain",
      heading: "The pieces",
      body: [
        "JavaScript runs on one thread with one **call stack**. A function call is pushed onto the stack and popped when it returns. Code on the stack must finish before anything else can run.",
        "Waiting work is handled by the environment, such as the browser or Node: timers, network requests and user events. When one of them is ready, its callback is placed in a queue. The **event loop** is the process that takes the next callback from a queue and runs it, **but only when the call stack is empty**.",
        "There are two main queues. The **task queue** (macrotasks) holds timer callbacks, events and I/O callbacks. The **microtask queue** holds promise callbacks, `queueMicrotask` and the continuation of `await`.",
      ],
    },
    {
      kind: "explain",
      heading: "The order of execution",
      body: [
        "The rule is: run the current synchronous code to the end. Then run **all** microtasks, including new ones added while doing so. Then take **one** task from the task queue, run it, and again run all microtasks. The browser may render the page between tasks.",
        "So a promise callback always runs before a `setTimeout` callback, even if the timeout is `0`. `setTimeout(fn, 0)` does not run `fn` immediately. It means that `fn` is queued as a task after at least that time, once the stack is empty.",
      ],
    },
    {
      kind: "code",
      heading: "Predict the order",
      example: {
        title: "Sync, microtask, task",
        language: "javascript",
        code: "console.log('1 sync');\nsetTimeout(() => console.log('4 timeout'), 0);\nPromise.resolve().then(() => console.log('3 promise'));\nqueueMicrotask(() => console.log('3b microtask'));\nconsole.log('2 sync');",
        walkthrough: [
          "The two synchronous lines run first, in order.",
          "The promise callback and the `queueMicrotask` callback are microtasks, so they run next, in the order they were added.",
          "The timeout callback is a task, so it runs last.",
          "The output is `1 sync`, `2 sync`, `3 promise`, `3b microtask` and `4 timeout`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "await in the order",
      example: {
        title: "What await does",
        language: "javascript",
        code: "async function a() {\n  console.log('a start');\n  await null;\n  console.log('a after await');\n}\nconsole.log('script start');\na();\nsetTimeout(() => console.log('timer'), 0);\nPromise.resolve().then(() => console.log('then'));\nconsole.log('script end');",
        walkthrough: [
          "`a()` runs synchronously until the first `await`, so `a start` is printed immediately.",
          "The rest of `a` is put in the microtask queue, together with the `then` callback, in that order.",
          "The timer is a task, so it runs after all the microtasks.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Blocking the loop",
      body: [
        "Because there is one thread, a long synchronous task, such as a huge loop, keeps the call stack busy. Nothing else can run, so the page does not respond to clicks and does not repaint.",
        "To keep a page responsive, split long work into small pieces and give the loop a chance to run in between, for example with `setTimeout`, or move heavy work to a **Web Worker**, which runs on another thread. A microtask that always adds another microtask also never lets the loop continue, so avoid endless microtask chains.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Believing that `setTimeout(fn, 0)` runs immediately.",
          fix: "It runs after the current code and all microtasks.",
        },
        {
          mistake: "Expecting a timer to fire at exactly the given time.",
          fix: "The delay is a minimum. The callback waits until the stack is empty.",
        },
        {
          mistake: "Running a heavy loop on the main thread.",
          fix: "Split the work, or use a Web Worker.",
        },
        {
          mistake: "Assuming that promises run on another thread.",
          fix: "Promise callbacks run on the same thread, as microtasks. Only the waiting is done elsewhere.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A frozen progress bar",
      scenario:
        "A page processes 100,000 rows, and the progress bar does not move until the work is finished.",
      body: [
        "The loop never lets the event loop run, so the browser cannot repaint. Process 1,000 rows at a time, and schedule the next batch with `setTimeout`, so that the page can update in between.",
        "For work that is really heavy, a Web Worker keeps the main thread free.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "order-basic",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
      },
      options: ["A D C B", "A B C D", "A C D B"],
      answer: 0,
      explanation:
        "Synchronous code first (`A`, `D`), then the microtask `C`, then the timer task `B`.",
    },
    {
      type: "output",
      id: "order-nested",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "setTimeout(() => console.log('t1'), 0);\nPromise.resolve()\n  .then(() => {\n    console.log('p1');\n    return Promise.resolve();\n  })\n  .then(() => console.log('p2'));\nsetTimeout(() => console.log('t2'), 0);",
      },
      options: ["p1 p2 t1 t2", "t1 t2 p1 p2", "p1 t1 p2 t2"],
      answer: 0,
      explanation:
        "All microtasks, including the chained one, run before any timer task.",
    },
    {
      type: "single",
      id: "microtask-source",
      prompt: "Which of these callbacks runs as a microtask?",
      options: [
        "A promise then callback",
        "A setTimeout callback",
        "A click event handler",
      ],
      answer: 0,
      explanation:
        "Promise callbacks are microtasks. Timers and events are tasks.",
    },
    {
      type: "truefalse",
      id: "stack-empty",
      statement:
        "The event loop runs a queued callback while the call stack is still busy.",
      answer: false,
      explanation: "It takes a callback only when the call stack is empty.",
    },
  ],
  assignment: {
    title: "Order puzzles",
    task: [
      "Write six small programs that mix `console.log`, `setTimeout`, promises and `await`.",
      "For each one, write down the order of the output first, then run it and explain every difference.",
    ],
    checklist: [
      "I predicted before running",
      "I explained microtasks versus tasks in my own words",
      "I fixed one blocking loop by splitting the work",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "run-order",
      title: "Predict and compute the order",
      task: [
        "Write `callbackOrder(items)` where `items` is an array of the strings `'sync'`, `'micro'` and `'task'`. Return the order in which a program would run them: all `'sync'` first, then all `'micro'`, then all `'task'`, keeping the original order inside each group.",
      ],
      language: "javascript",
      starter: "function callbackOrder(items) {\n  // your code\n}",
      solution:
        "function callbackOrder(items) {\n  const rank = { sync: 0, micro: 1, task: 2 };\n  return [\n    ...items.filter((i) => i === 'sync'),\n    ...items.filter((i) => i === 'micro'),\n    ...items.filter((i) => i === 'task'),\n  ];\n}",
      hints: ["Filter the array three times, once for each group."],
      checklist: [
        "All sync items come first",
        "Order inside a group is kept",
        "An empty list gives an empty list",
      ],
      run: {
        entry: "callbackOrder",
        cases: [
          {
            name: "mixed",
            args: [["task", "micro", "sync", "micro", "sync"]],
            expected: ["sync", "sync", "micro", "micro", "task"],
          },
          {
            name: "empty",
            args: [[]],
            expected: [],
          },
          {
            name: "only-tasks",
            args: [["task", "task"]],
            expected: ["task", "task"],
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "One thread, one call stack; the event loop runs queued callbacks when the stack is empty",
    "Order: synchronous code, then all microtasks, then one task",
    "Promise callbacks and `await` continuations are microtasks; timers and events are tasks",
    "Long synchronous work freezes the page; split it or use a Web Worker",
  ],
  resources: [
    {
      label: "MDN: The event loop",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
    },
    {
      label: "MDN: Using microtasks",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
    },
    {
      label: "MDN: setTimeout",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout",
    },
  ],
})
