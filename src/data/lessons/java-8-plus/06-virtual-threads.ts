import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "virtual-threads",
  title: "Virtual threads",
  topic: "Virtual threads",
  minutes: 50,
  overview:
    "Understand what virtual threads are, how to start them, and when they help and when they do not.",
  objectives: [
    "Explain the difference between platform threads and virtual threads",
    "Start virtual threads and use an executor that creates one per task",
    "Decide when virtual threads fit and name their pitfalls",
  ],
  prerequisites: ["lesson.java-8-plus.lambdas-and-functional-interfaces"],
  sections: [
    {
      kind: "explain",
      heading: "The problem they solve",
      body: [
        "A traditional Java thread, a **platform thread**, is a thin wrapper around an operating system thread. It is expensive: it reserves memory for its stack and the operating system has to schedule it, so a server can afford only a few thousand of them. A server that uses one thread for each request, and spends most of its time **waiting** for a database or a remote service, runs out of threads long before it runs out of CPU.",
        "**Virtual threads**, final in Java 21, are lightweight threads that are managed by the JVM. They are cheap, so you can have hundreds of thousands. When a virtual thread blocks on I/O, the JVM unmounts it from the OS thread that carries it, and that **carrier thread** runs another virtual thread. When the I/O finishes, the virtual thread continues.",
        "The result is that you can write simple, blocking code with one thread per task, and still handle a very large number of concurrent tasks.",
      ],
    },
    {
      kind: "code",
      heading: "Starting virtual threads",
      example: {
        title: "ofVirtual and an executor",
        language: "java",
        code: 'Thread t = Thread.ofVirtual().name("worker-1").start(() -> System.out.println("hello from " + Thread.currentThread().getName()));\n    t.join();\n    System.out.println(t.isVirtual());\n\n    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n      List<Future<Integer>> results = new ArrayList<>();\n      for (int i = 1; i <= 5; i++) {\n        int id = i;\n        results.add(executor.submit(() -> {\n          Thread.sleep(50);\n          return id * id;\n        }));\n      }\n      int sum = 0;\n      for (Future<Integer> f : results) sum += f.get();\n      System.out.println(sum);\n    }',
        walkthrough: [
          "`Thread.ofVirtual().start(...)` creates and starts a virtual thread, and `isVirtual()` confirms the type.",
          "`newVirtualThreadPerTaskExecutor()` starts a new virtual thread for every submitted task, and the `try` waits for them when it closes.",
          "Each task sleeps without holding an OS thread, and the squares add up to `55`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "When to use them",
      body: [
        "Use virtual threads for tasks that spend most of their time **waiting**, such as handling requests that call databases and remote services. They do not make **CPU-bound** work faster, because the number of CPU cores does not change.",
        "Do **not pool** virtual threads. Pools exist to share expensive threads, and virtual threads are cheap, so create one for each task. If you must limit access to a resource, such as a database with a connection pool or a partner API, use a **semaphore** to limit concurrency, and not a small pool.",
        "They are ordinary `Thread` objects, so existing code, thread dumps and debuggers work with them. They are always daemon threads.",
      ],
    },
    {
      kind: "explain",
      heading: "Pitfalls",
      body: [
        "In Java 21, a virtual thread that blocks inside a `synchronized` block or in a native call can **pin** its carrier thread, so the carrier cannot run other virtual threads. Prefer `ReentrantLock` for long blocking sections. The behaviour has been improved in later versions, so check the documentation of the version that you use.",
        "Be careful with `ThreadLocal`: with many virtual threads, many copies are created. And shared limits remain: a million virtual threads still cannot all use a database at the same moment, so the real bottleneck moves to the resource, and you must protect it with a limit.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Creating a pool of virtual threads.",
          fix: "Create one virtual thread per task. Limit resources with a semaphore.",
        },
        {
          mistake: "Expecting a speed-up for CPU-bound code.",
          fix: "Virtual threads help when threads wait. Use a bounded pool or parallel streams for CPU work.",
        },
        {
          mistake: "Blocking for a long time inside `synchronized`.",
          fix: "Use `ReentrantLock`, or keep the synchronised section short.",
        },
        {
          mistake: "Ignoring downstream limits.",
          fix: "Use a `Semaphore` to limit calls to a database or partner service.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A request handler",
      scenario:
        "A service calls two remote systems for each request, and each call takes about 100 milliseconds.",
      body: [
        "Handle each request in its own virtual thread, with plain blocking calls. Thousands of requests can wait at the same time without using thousands of OS threads, and the code stays easy to read.",
        "Put a semaphore in front of the remote systems, so that they are not overloaded.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "vt-what",
      prompt: "What is a virtual thread?",
      options: [
        "A lightweight thread managed by the JVM",
        "A thread that runs on the GPU",
        "A thread without a stack",
      ],
      answer: 0,
      explanation:
        "Virtual threads are cheap, and many of them share a few OS carrier threads.",
    },
    {
      type: "single",
      id: "vt-pool",
      prompt: "How should you use virtual threads with an executor?",
      options: [
        "Create one virtual thread per task",
        "Pool a fixed number of them",
        "Use only one",
      ],
      answer: 0,
      explanation:
        "Pooling is meant to share expensive threads. Virtual threads are cheap.",
    },
    {
      type: "truefalse",
      id: "vt-cpu",
      statement: "Virtual threads make CPU-bound code faster.",
      answer: false,
      explanation:
        "They help when threads spend time waiting. CPU-bound work is limited by the cores.",
    },
    {
      type: "output",
      id: "vt-isvirtual",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'Thread t = Thread.ofVirtual().start(() -> {});\nt.join();\nSystem.out.println(t.isVirtual() + " " + t.isDaemon());',
      },
      options: ["true true", "true false", "false false"],
      answer: 0,
      explanation: "Virtual threads are always daemon threads.",
    },
  ],
  assignment: {
    title: "Compare threads",
    task: [
      "Write a program that starts 10,000 tasks that each sleep for one second, first with a fixed pool of 200 platform threads, then with virtual threads.",
      "Measure the total time of both, and explain the difference in your own words.",
    ],
    checklist: [
      "I have two measured times",
      "I did not pool the virtual threads",
      "I can explain why CPU-bound work would not improve",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "vt-ex",
      title: "Run tasks on virtual threads",
      task: [
        "Write `static int sumOfSquares(int n)` that runs `n` tasks on a virtual-thread-per-task executor, each returning `i * i` for `i` from 1 to `n`, and returns the sum.",
      ],
      language: "java",
      starter:
        "import java.util.*;\nimport java.util.concurrent.*;\n\npublic class VirtualSum {\n  // your code\n}",
      solution:
        "import java.util.*;\nimport java.util.concurrent.*;\n\npublic class VirtualSum {\n  static int sumOfSquares(int n) throws Exception {\n    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n      List<Future<Integer>> futures = new ArrayList<>();\n      for (int i = 1; i <= n; i++) {\n        int value = i;\n        futures.add(executor.submit(() -> value * value));\n      }\n      int sum = 0;\n      for (Future<Integer> f : futures) {\n        sum += f.get();\n      }\n      return sum;\n    }\n  }\n\n  public static void main(String[] args) throws Exception {\n    System.out.println(sumOfSquares(4));\n  }\n}",
      hints: ["The variable used by the lambda must be effectively final."],
      checklist: [
        "One virtual thread per task",
        "All results are collected with get()",
        "The executor is closed with try-with-resources",
      ],
    },
  ],
  revisionNotes: [
    "Virtual threads: cheap, JVM-managed, great for blocking I/O",
    "One per task; never pool them; use a semaphore to limit a resource",
    "No speed-up for CPU-bound work",
    "Watch out for pinning in synchronized blocks and for ThreadLocal",
  ],
  resources: [
    {
      label: "Java Core Libraries: Virtual Threads",
      url: "https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html",
    },
    {
      label: "JEP 444: Virtual Threads",
      url: "https://openjdk.org/jeps/444",
    },
  ],
})
