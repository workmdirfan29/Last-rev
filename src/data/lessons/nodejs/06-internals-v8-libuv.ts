import { defineLesson } from "@/data/lessons/author"

export default defineLesson("nodejs", {
  slug: "internals-v8-libuv",
  title: "Node.js internals: V8, libuv and the thread pool",
  topic: "Node internals (V8 and libuv)",
  minutes: 70,
  overview:
    "See how Node.js is put together: V8 runs JavaScript, libuv provides the event loop and asynchronous I/O, and a thread pool handles some work in the background.",
  objectives: [
    "Describe what V8, libuv and Node's own APIs each provide",
    "Explain which operations use the libuv thread pool",
    "Describe what happens to an asynchronous file read from call to callback",
  ],
  prerequisites: ["lesson.nodejs.event-loop"],
  sections: [
    {
      kind: "explain",
      heading: "The layers",
      body: [
        "Node.js is a JavaScript runtime built from several parts. **V8** is the JavaScript engine: it parses, compiles and runs your JavaScript, and manages memory with a garbage collector. The same engine runs JavaScript in the Chrome browser.",
        "**libuv** is a C library that gives Node.js the event loop and cross-platform asynchronous I/O: files, network sockets, timers and more. It hides the differences between operating systems.",
        "On top of these sit Node.js's own **C++ bindings** and the JavaScript core modules such as `fs`, `http` and `crypto`. When you call `fs.readFile`, JavaScript in the core module calls into C++, which asks libuv to do the work.",
        "Node.js is not a browser, so it has no DOM or `window`, but it gives you APIs for the file system, processes and networking. The browser and Node.js share the language, not the environment.",
      ],
    },
    {
      kind: "diagram",
      heading: "An asynchronous read",
      diagram: {
        kind: "flow",
        title: "From readFile to callback",
        steps: [
          { label: "Your code calls fs.readFile", detail: "JavaScript runs on the main thread." },
          { label: "Node.js passes the request to libuv", detail: "The call returns immediately." },
          { label: "libuv does the work", detail: "Using the operating system or a thread pool thread." },
          { label: "Completion is queued", detail: "The result waits to be handled in the event loop." },
          { label: "Your callback runs on the main thread", detail: "In the poll phase." },
        ],
      },
    },
    {
      kind: "explain",
      heading: "The thread pool",
      body: [
        "Some operations have no non-blocking system interface on every platform, so libuv runs them on a small pool of background threads. File system operations, DNS lookups with `dns.lookup`, and many `crypto` and `zlib` functions use the pool.",
        "Network I/O such as TCP sockets does not use the pool; it uses the operating system's event notification, which is why one thread can handle many connections.",
        "The default pool has 4 threads, and the `UV_THREADPOOL_SIZE` environment variable changes it. If many slow pool tasks run at once, later ones wait in a queue, which can slow down unrelated operations that also use the pool.",
        "Your own JavaScript callbacks always run on the main thread. Only the underlying I/O or computation happens elsewhere.",
      ],
    },
    {
      kind: "code",
      heading: "Seeing the main thread stay free",
      example: {
        title: "A timer is not blocked by an asynchronous read",
        language: "javascript",
        code: "import { readFile } from 'node:fs';\n\nconst start = Date.now();\n\nreadFile(import.meta.filename, () => {\n  console.log('read finished');\n});\n\nsetTimeout(() => {\n  console.log('timer fired', Date.now() - start >= 10);\n}, 10);\n\nconsole.log('script finished');",
        walkthrough: [
          "`readFile` starts the work and returns at once, so `script finished` is the first line.",
          "The read happens in the background while the main thread stays free for the timer.",
          "Each callback later runs on the main thread, when its result is ready and the loop reaches the right phase.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Believing every asynchronous call uses a separate thread.",
          fix: "Network I/O uses operating system notifications. Only some operations use the thread pool.",
        },
        {
          mistake: "Thinking JavaScript callbacks run in parallel.",
          fix: "Callbacks run one at a time on the main thread.",
        },
        {
          mistake: "Doing heavy hashing or file work in bulk without thinking about the pool.",
          fix: "Remember the default pool is small. Limit concurrency or raise UV_THREADPOOL_SIZE when needed.",
        },
        {
          mistake: "Expecting browser globals in Node.js.",
          fix: "Use Node's own APIs. There is no window or document.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A slow hashing endpoint",
      scenario:
        "A login endpoint hashes passwords with an asynchronous crypto function and under load other file reads become slow.",
      body: [
        "Both the hashing and the file reads use the same small thread pool. When many hashes run at once, file reads queue behind them.",
        "Limit how many hashes run at once, or increase `UV_THREADPOOL_SIZE` and measure the effect, instead of guessing.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "who-runs-js",
      prompt: "Which component executes your JavaScript?",
      options: ["V8", "libuv", "The operating system"],
      answer: 0,
      explanation:
        "V8 is the JavaScript engine. libuv provides the event loop and asynchronous I/O.",
    },
    {
      type: "single",
      id: "pool-default",
      prompt: "How many threads does the libuv thread pool have by default?",
      options: ["4", "1", "64"],
      answer: 0,
      explanation:
        "The default is 4, and UV_THREADPOOL_SIZE can change it.",
    },
    {
      type: "truefalse",
      id: "callbacks-main",
      statement: "Your JavaScript callbacks run on the main thread, even when the underlying work ran elsewhere.",
      answer: true,
      explanation:
        "Only the underlying I/O or computation is done in the background. Callbacks run one at a time on the main thread.",
    },
    {
      type: "blank",
      id: "loop-library",
      prompt: "The C library that provides Node.js's event loop is called ___.",
      answer: "libuv",
      explanation:
        "libuv provides the event loop and cross-platform asynchronous I/O.",
    },
  ],
  assignment: {
    title: "Draw the layers",
    task: [
      "Draw a diagram of Node.js showing your JavaScript, core modules, C++ bindings, V8, libuv, the thread pool and the operating system.",
      "Trace one fs.readFile call through your diagram and one TCP connection through it, marking where the paths differ.",
    ],
    checklist: [
      "V8 and libuv are labelled with their jobs",
      "The thread pool is shown and its default size noted",
      "The file read path uses the pool or the operating system",
      "Callbacks are shown running on the main thread",
    ],
    hints: ["Use a different colour for the main thread and for background work."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "pool-batches",
      title: "Batches through a pool",
      task: [
        "Write `batches(taskCount, poolSize)` that returns how many rounds are needed to run `taskCount` equal tasks when only `poolSize` can run at a time.",
      ],
      language: "javascript",
      starter: "function batches(taskCount, poolSize) {\n  // your code\n}",
      solution:
        "function batches(taskCount, poolSize) {\n  return Math.ceil(taskCount / poolSize);\n}",
      hints: ["Divide and round up."],
      checklist: [
        "Ten tasks with a pool of four take three rounds",
        "Zero tasks take zero rounds",
        "An exact fit does not add an extra round",
      ],
      run: {
        entry: "batches",
        cases: [
          { name: "ten and four", args: [10, 4], expected: 3 },
          { name: "none", args: [0, 4], expected: 0 },
          { name: "exact", args: [8, 4], expected: 2 },
          { name: "one task", args: [1, 4], expected: 1 },
        ],
      },
    },
  ],
  revisionNotes: [
    "V8 runs JavaScript; libuv provides the event loop and async I/O",
    "Thread pool (default 4): file system, dns.lookup, some crypto and zlib",
    "Network I/O uses OS notifications, not the pool",
    "Callbacks always run on the main thread",
  ],
  resources: [
    {
      label: "Node.js: Introduction to Node.js",
      url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
    },
    {
      label: "Node.js: Differences between Node.js and the browser",
      url: "https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser",
    },
    {
      label: "Node.js: The event loop, timers and process.nextTick()",
      url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    },
    {
      label: "Node.js: File system (threadpool usage)",
      url: "https://nodejs.org/api/fs.html",
    },
  ],
})
