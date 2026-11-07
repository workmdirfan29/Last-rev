import { defineLesson } from "@/data/lessons/author"

export default defineLesson("nodejs", {
  slug: "clustering",
  title: "Clustering and worker threads",
  topic: "Clustering",
  minutes: 60,
  overview:
    "Use more than one CPU core: the cluster module for several processes that share a server port, and worker threads for CPU-heavy JavaScript, and when to choose each.",
  objectives: [
    "Create a cluster of worker processes that share one port",
    "Explain how connections are distributed among workers",
    "Choose between cluster, worker_threads and child_process for a given problem",
  ],
  prerequisites: ["lesson.nodejs.event-loop"],
  sections: [
    {
      kind: "explain",
      heading: "Using all the cores",
      body: [
        "A single Node.js process runs JavaScript on one thread, so it uses one CPU core for your code. To handle more work on a multi-core machine you can run several processes.",
        "The **cluster** module makes this easy. A primary process forks worker processes, and the workers can all share the same server port. The documentation describes cluster as a way to distribute workloads among application processes that are isolated from each other.",
        "Connections are distributed in one of two ways. On every platform except Windows, the default is **round-robin**: the primary listens on the port, accepts new connections and hands them to the workers in turn, with some logic to avoid overloading one worker.",
      ],
    },
    {
      kind: "code",
      heading: "A clustered server",
      example: {
        title: "Fork one worker per core",
        language: "javascript",
        code: "import cluster from 'node:cluster';\nimport http from 'node:http';\nimport { availableParallelism } from 'node:os';\nimport process from 'node:process';\n\nif (cluster.isPrimary) {\n  const count = availableParallelism();\n  for (let i = 0; i < count; i++) cluster.fork();\n\n  cluster.on('exit', (worker) => {\n    console.log(`worker ${worker.process.pid} died, starting another`);\n    cluster.fork();\n  });\n} else {\n  http\n    .createServer((req, res) => {\n      res.end(`handled by ${process.pid}\\n`);\n    })\n    .listen(3000);\n}",
        walkthrough: [
          "`cluster.isPrimary` is true in the first process. It forks one worker for each available CPU core.",
          "Each worker runs the same file, but `isPrimary` is false there, so it creates the server and listens on the shared port.",
          "When a worker exits, the primary starts a replacement, which keeps the service running if one process crashes.",
          "Workers are separate processes with separate memory, so they cannot share in-memory state such as a cache or session object.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Which tool for which job",
      diagram: {
        kind: "table",
        title: "Cluster, worker threads and child processes",
        headers: ["Tool", "What it is", "Good for"],
        rows: [
          ["cluster", "Several processes sharing server ports", "Spreading incoming connections over cores"],
          ["worker_threads", "Threads inside one process; can share memory", "CPU-intensive JavaScript work"],
          ["child_process", "Separate programs or scripts", "Running commands and other executables"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Worker threads",
      body: [
        "The `worker_threads` module runs JavaScript in parallel on other threads. The documentation says workers are useful for CPU-intensive JavaScript and do not help much with I/O-intensive work, because the built-in asynchronous I/O is already more efficient.",
        "Unlike child processes or cluster, worker threads can share memory by transferring `ArrayBuffer` instances or sharing `SharedArrayBuffer` instances. Threads communicate by passing messages.",
        "Use a worker thread to keep a heavy calculation, such as resizing an image, off the main thread so the event loop stays free to answer requests.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Keeping sessions or caches in a worker's memory.",
          fix: "Workers do not share memory. Use an external store such as a database or cache server.",
        },
        {
          mistake: "Using worker threads for ordinary database or network calls.",
          fix: "Asynchronous I/O is already non-blocking. Use workers for CPU-heavy work.",
        },
        {
          mistake: "Not restarting a worker that crashed.",
          fix: "Listen for the exit event on the primary and fork a replacement.",
        },
        {
          mistake: "Forking far more workers than cores.",
          fix: "Start with about one worker per available core and measure.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A slow endpoint",
      scenario:
        "One endpoint does a long calculation and the rest of the API becomes slow while it runs.",
      body: [
        "Move the calculation into a worker thread and send the result back with a message. The main thread stays free for other requests.",
        "Separately, use cluster, or run several instances behind a load balancer, to increase the total request capacity.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "share-port",
      prompt: "What is special about cluster workers regarding server ports?",
      options: [
        "They can share the same server port",
        "Each must use a unique port",
        "They cannot listen on a port",
      ],
      answer: 0,
      explanation:
        "The cluster module lets child processes share server ports.",
    },
    {
      type: "truefalse",
      id: "worker-memory",
      statement: "Cluster workers share the same in-memory variables.",
      answer: false,
      explanation:
        "They are separate processes with separate memory. Use an external store for shared state.",
    },
    {
      type: "single",
      id: "cpu-heavy",
      prompt: "Which is the best fit for worker_threads?",
      options: ["CPU-intensive JavaScript", "Simple database queries", "Reading small files"],
      answer: 0,
      explanation:
        "Workers are for CPU-intensive work. Asynchronous I/O is already efficient without them.",
    },
    {
      type: "blank",
      id: "primary-flag",
      prompt: "In the cluster module, cluster.is___ is true in the process that forks the workers.",
      answer: "primary",
      explanation:
        "`cluster.isPrimary` is true in the primary process and false in workers.",
    },
  ],
  assignment: {
    title: "Cluster a server",
    task: [
      "Cluster a small HTTP server so it starts one worker per core and prints the worker's process id in each response.",
      "Kill one worker and check that the primary replaces it.",
    ],
    checklist: [
      "The primary forks workers with cluster.fork",
      "Responses show different process ids",
      "A killed worker is replaced",
      "I can explain why a shared in-memory counter would not work",
    ],
    hints: ["Make several requests in a row and compare the process ids."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "round-robin-pick",
      title: "Round-robin picker",
      task: [
        "Write `pickWorker(index, workerCount)` that returns which worker (0-based) receives the connection number `index` (0-based) under round-robin distribution.",
      ],
      language: "javascript",
      starter: "function pickWorker(index, workerCount) {\n  // your code\n}",
      solution:
        "function pickWorker(index, workerCount) {\n  return index % workerCount;\n}",
      hints: ["Cycle through the workers with the remainder operator."],
      checklist: [
        "Connection 0 goes to worker 0",
        "After the last worker it wraps to 0",
        "It works for any worker count",
      ],
      run: {
        entry: "pickWorker",
        cases: [
          { name: "first", args: [0, 3], expected: 0 },
          { name: "wrap", args: [3, 3], expected: 0 },
          { name: "middle", args: [4, 3], expected: 1 },
          { name: "single worker", args: [7, 1], expected: 0 },
        ],
      },
    },
  ],
  revisionNotes: [
    "cluster: primary forks workers that share server ports; default distribution is round-robin (not on Windows)",
    "Workers are separate processes: no shared memory",
    "worker_threads: parallel JavaScript for CPU-heavy work; can share memory buffers",
    "Replace crashed workers from the primary's exit event",
  ],
  resources: [
    {
      label: "Node.js: Cluster",
      url: "https://nodejs.org/api/cluster.html",
    },
    {
      label: "Node.js: Worker threads",
      url: "https://nodejs.org/api/worker_threads.html",
    },
    {
      label: "Node.js: Child processes",
      url: "https://nodejs.org/api/child_process.html",
    },
  ],
})
