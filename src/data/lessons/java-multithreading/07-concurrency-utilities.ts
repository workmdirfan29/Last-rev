import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "concurrency-utilities",
  title: "Concurrency utilities: latches, barriers, semaphores and ThreadLocal",
  topic: "Concurrent utilities",
  minutes: 70,
  overview:
    "Coordinate threads with CountDownLatch, CyclicBarrier and Semaphore, and use ThreadLocal safely.",
  objectives: [
    "Choose between CountDownLatch, CyclicBarrier and Semaphore",
    "Limit concurrency with a Semaphore",
    "Use ThreadLocal and avoid its leaks in pools",
  ],
  prerequisites: ["lesson.java-multithreading.volatile-and-atomics"],
  sections: [
    {
      kind: "explain",
      heading: "Synchronisers",
      body: [
        "A `CountDownLatch` starts with a count. Threads call `countDown()` when they finish a step, and others call `await()` and wait until the count reaches zero. It is **single use**, and the threads that count down and those that wait can be different. A `CyclicBarrier` makes a fixed group of threads **wait for each other**: each calls `await()`, and when the last arrives, all are released together. It can be **reused** for the next round, which suits phased computations.",
        "A `Semaphore` holds a number of **permits**. A thread calls `acquire()` to take one, and waits if none is available, and `release()` to return it. It limits how many threads use a resource at the same time, such as a pool of database connections or a rate-limited service. With one permit it works like a lock, except that a different thread can release it. Always release in `finally`.",
      ],
    },
    {
      kind: "code",
      heading: "Latch and semaphore",
      example: {
        title: "Waiting and limiting",
        language: "java",
        code: 'CountDownLatch done = new CountDownLatch(3);\n    Semaphore permits = new Semaphore(2);\n    AtomicInteger maxInside = new AtomicInteger();\n    AtomicInteger inside = new AtomicInteger();\n    for (int i = 0; i < 3; i++) {\n      new Thread(() -> {\n        try {\n          permits.acquire();\n          try {\n            int now = inside.incrementAndGet();\n            maxInside.accumulateAndGet(now, Math::max);\n            Thread.sleep(30);\n            inside.decrementAndGet();\n          } finally {\n            permits.release();\n          }\n        } catch (InterruptedException e) {\n          Thread.currentThread().interrupt();\n        } finally {\n          done.countDown();\n        }\n      }).start();\n    }\n    done.await();\n    System.out.println("all done, at most " + maxInside.get() + " inside");',
        walkthrough: [
          "Three threads start, but the semaphore lets only two work at the same time.",
          "`release()` is in `finally`, so a permit is always returned, and `countDown()` is in an outer `finally`.",
          "The main thread waits on the latch. The output is `all done, at most 2 inside`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "ThreadLocal",
      body: [
        "A `ThreadLocal<T>` gives each thread its **own independent copy** of a variable, so no locking is needed. It is used for per-thread context, such as a request id, a user, or a non-thread-safe formatter. `ThreadLocal.withInitial(supplier)` sets a default for each thread.",
        "In a **thread pool**, threads are reused, so a value that is not removed stays attached to the thread, and can **leak into the next task**, showing wrong data or keeping memory alive. The rule is to call **`remove()` in a `finally` block** when the task is done. Values are not passed to child threads unless you use `InheritableThreadLocal`. With virtual threads, heavy use creates many copies.",
      ],
    },
    {
      kind: "code",
      heading: "Set and always remove",
      example: {
        title: "ThreadLocal",
        language: "java",
        code: 'ThreadLocal<String> requestId = new ThreadLocal<>();\n    ExecutorService pool = Executors.newSingleThreadExecutor();\n    Future<String> first = pool.submit(() -> {\n      requestId.set("req-1");\n      try {\n        return requestId.get();\n      } finally {\n        requestId.remove();\n      }\n    });\n    Future<String> second = pool.submit(() -> String.valueOf(requestId.get()));\n    System.out.println(first.get() + " " + second.get());\n    pool.shutdown();',
        walkthrough: [
          "The first task stores an id for its thread and removes it in `finally`.",
          "The pool has one thread, and it runs both tasks, so the second task would see a leftover value if `remove()` had been forgotten.",
          "Because of `remove()`, the second task sees `null`. The output is `req-1 null`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Not releasing a semaphore permit when the work fails.",
          fix: "Release in `finally`.",
        },
        {
          mistake:
            "Forgetting `countDown()` when a worker fails, so `await()` never returns.",
          fix: "Call it in `finally`.",
        },
        {
          mistake: "Not calling `remove()` on a ThreadLocal in a pool.",
          fix: "Remove it in `finally`.",
        },
        {
          mistake: "Trying to reuse a CountDownLatch.",
          fix: "It is single use. Use a CyclicBarrier or a new latch.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Calling a partner API",
      scenario:
        "At most five threads may call a partner API at the same time, and a report waits until all its checks have finished.",
      body: [
        "A `Semaphore(5)` guards the call, with `release()` in `finally`. A `CountDownLatch` counts the checks, and the report thread awaits it. The request id for the logs is kept in a `ThreadLocal` that is removed at the end of each task.",
        "Each tool does one small job.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cu-latch",
      prompt: "What is the difference between a latch and a barrier?",
      options: [
        "A latch is single use; a barrier is reusable and the threads wait for each other",
        "They are the same",
        "A barrier counts down",
      ],
      answer: 0,
      explanation: "A latch waits for events. A barrier makes threads meet.",
    },
    {
      type: "single",
      id: "cu-sem",
      prompt: "What does a Semaphore with 5 permits do?",
      options: [
        "Allows at most 5 threads to use a resource at once",
        "Starts 5 threads",
        "Locks the resource 5 times",
      ],
      answer: 0,
      explanation: "A thread must acquire a permit before it proceeds.",
    },
    {
      type: "truefalse",
      id: "cu-tl-pool",
      statement:
        "In a thread pool, a ThreadLocal value is automatically cleared after each task.",
      answer: false,
      explanation: "Threads are reused, so you must call `remove()`.",
    },
    {
      type: "blank",
      id: "cu-finally",
      prompt: "Always release a semaphore permit in a ___ block.",
      answer: "finally",
      explanation:
        "Then the permit returns even if the work throws an exception.",
    },
  ],
  assignment: {
    title: "Coordinate threads",
    task: [
      "Build a program where five workers each do a step, wait at a `CyclicBarrier`, and then do a second step.",
      "Add a `Semaphore` that limits a shared resource to two users, and a `ThreadLocal` request id that is removed after each task.",
    ],
    checklist: [
      "Workers meet at the barrier",
      "Never more than two threads use the resource",
      "The ThreadLocal is removed in finally",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "cu-ex",
      title: "Wait for workers",
      task: [
        "Write `static int runWorkers(int n)` that starts `n` threads, each adding 1 to an `AtomicInteger` and counting down a `CountDownLatch`, waits for the latch, and returns the total.",
      ],
      language: "java",
      starter:
        "import java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\n\npublic class Workers {\n  // your code\n}",
      solution:
        "import java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\n\npublic class Workers {\n  static int runWorkers(int n) throws InterruptedException {\n    AtomicInteger total = new AtomicInteger();\n    CountDownLatch done = new CountDownLatch(n);\n    for (int i = 0; i < n; i++) {\n      new Thread(() -> {\n        try {\n          total.incrementAndGet();\n        } finally {\n          done.countDown();\n        }\n      }).start();\n    }\n    done.await();\n    return total.get();\n  }\n\n  public static void main(String[] args) throws InterruptedException {\n    System.out.println(runWorkers(5));\n  }\n}",
      hints: [
        "Count down in `finally`, so a failing worker cannot block the waiting thread.",
      ],
      checklist: [
        "countDown is in finally",
        "The main thread awaits the latch",
        "The result is 5",
      ],
    },
  ],
  revisionNotes: [
    "CountDownLatch: wait for N events once; CyclicBarrier: N threads meet, reusable",
    "Semaphore: limit concurrent use; release in finally",
    "ThreadLocal: per-thread value; remove() in finally on pooled threads",
    "Each tool does one small coordination job",
  ],
  resources: [
    {
      label: "The Java Tutorials: High Level Concurrency Objects",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/highlevel.html",
    },
    {
      label: "Java SE API: Semaphore",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html",
    },
    {
      label: "Java SE API: ThreadLocal",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ThreadLocal.html",
    },
  ],
})
