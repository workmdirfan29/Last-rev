import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "executors",
  title: "Executors and thread pools",
  topic: "Executors",
  minutes: 80,
  overview:
    "Run tasks with ExecutorService, collect results with Future, configure ThreadPoolExecutor and shut pools down correctly.",
  objectives: [
    "Submit Runnable and Callable tasks to an ExecutorService",
    "Choose and configure a pool, and explain how ThreadPoolExecutor handles a new task",
    "Shut a pool down cleanly",
  ],
  prerequisites: ["lesson.java-multithreading.synchronized-and-races"],
  sections: [
    {
      kind: "explain",
      heading: "Why pools",
      body: [
        "Creating a thread is expensive, and an unlimited number of threads can use up memory. A **thread pool** keeps a number of worker threads and reuses them to run submitted tasks. With an `ExecutorService`, you **submit** `Runnable` or `Callable` tasks, and the pool queues them and runs them on its workers. It also gives you lifecycle control with `shutdown`, results with `Future`, and a limit on concurrency.",
        "The factory methods of `Executors` are convenient: `newFixedThreadPool(n)` has `n` threads and an **unbounded** queue, `newCachedThreadPool()` creates threads as needed and can create a very large number, `newSingleThreadExecutor()` runs tasks one at a time, and `newScheduledThreadPool(n)` runs delayed or periodic tasks. For production services, many teams build a `ThreadPoolExecutor` directly with a bounded queue.",
      ],
    },
    {
      kind: "code",
      heading: "Submitting tasks",
      example: {
        title: "Callable and Future",
        language: "java",
        code: 'ExecutorService pool = Executors.newFixedThreadPool(3);\n    try {\n      List<Future<Integer>> results = new ArrayList<>();\n      for (int i = 1; i <= 4; i++) {\n        int n = i;\n        results.add(pool.submit(() -> n * n));\n      }\n      int total = 0;\n      for (Future<Integer> f : results) {\n        total += f.get();\n      }\n      System.out.println(total);\n      Future<String> failing = pool.submit(() -> { throw new IllegalStateException("boom"); });\n      try {\n        failing.get();\n      } catch (ExecutionException e) {\n        System.out.println(e.getCause().getMessage());\n      }\n    } finally {\n      pool.shutdown();\n    }',
        walkthrough: [
          "Each `submit` returns a `Future`, and `get()` waits for the result.",
          "A `Callable` returns a value and can throw a checked exception, unlike a `Runnable`.",
          "An exception inside a task is wrapped in an `ExecutionException` by `get()`. The output is `30` and `boom`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "ThreadPoolExecutor",
      body: [
        "The main parameters are `corePoolSize`, `maximumPoolSize`, `keepAliveTime`, the **work queue**, a `ThreadFactory` and a `RejectedExecutionHandler`. For a new task, the pool first starts a new thread while fewer than `corePoolSize` threads exist. After that, it puts the task in the **queue**. Only when the queue is **full** does it create extra threads, up to `maximumPoolSize`. If the queue is full and the maximum is reached, the task is **rejected**, which by default throws `RejectedExecutionException`.",
        "With an unbounded queue the pool never grows past the core size, so the maximum has no effect. Rejection policies are abort, caller-runs, discard and discard-oldest. A custom `ThreadFactory` lets you **name** the threads, which makes logs and thread dumps readable.",
      ],
    },
    {
      kind: "code",
      heading: "A bounded pool",
      example: {
        title: "Queue, then growth, then rejection",
        language: "java",
        code: 'ThreadPoolExecutor pool = new ThreadPoolExecutor(\n        1, 2, 1, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1));\n    CountDownLatch release = new CountDownLatch(1);\n    Runnable block = () -> {\n      try { release.await(); } catch (InterruptedException e) { }\n    };\n    pool.execute(block);\n    pool.execute(block);\n    pool.execute(block);\n    System.out.println(pool.getPoolSize() + " " + pool.getQueue().size());\n    try {\n      pool.execute(block);\n    } catch (RejectedExecutionException e) {\n      System.out.println("rejected");\n    }\n    release.countDown();\n    pool.shutdown();',
        walkthrough: [
          "The first task starts the core thread. The second goes into the queue, which holds one task.",
          "The third finds the queue full, so the pool creates a second thread, up to the maximum.",
          "The fourth task has nowhere to go and is rejected. The output is `2 1` and `rejected`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Shutting down",
      body: [
        "`shutdown()` stops the pool from accepting new tasks, but lets submitted tasks finish. `shutdownNow()` tries to stop running tasks by **interrupting** them, and returns the tasks that never started. `awaitTermination(time, unit)` waits for the pool to finish after a shutdown. A pool whose threads are not daemon threads **keeps the application alive** until it is shut down.",
        "A typical stop is `shutdown()`, then `awaitTermination` with a timeout, then `shutdownNow()` if it did not end. A task must respond to interruption for `shutdownNow` and `cancel(true)` to work. `future.get()` blocks the calling thread, so use a timeout where a task may hang.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting `shutdown()`.",
          fix: "Shut the pool down in a `finally` block, or use try-with-resources on Java 19+.",
        },
        {
          mistake: "Creating a new pool for every request.",
          fix: "Create one pool and reuse it.",
        },
        {
          mistake: "Using `newCachedThreadPool` for unbounded input.",
          fix: "Use a bounded pool with a bounded queue.",
        },
        {
          mistake: "Calling `get()` without a timeout on a task that may hang.",
          fix: "Use `get(timeout, unit)`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An image service",
      scenario:
        "A service resizes uploaded images, which takes about a second for each.",
      body: [
        "Use a fixed pool sized for the CPU count, with a bounded queue and the caller-runs policy, so that an overload slows the callers down instead of using up the memory. Name the threads `resize-1`, `resize-2`, and shut the pool down when the application stops.",
        "The pool limits the concurrency, and the queue absorbs short bursts.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ex-core",
      prompt: "In what order does ThreadPoolExecutor handle a new task?",
      options: [
        "Core threads, then the queue, then extra threads, then rejection",
        "Queue first, then core threads",
        "Always a new thread",
      ],
      answer: 0,
      explanation: "Extra threads are created only when the queue is full.",
    },
    {
      type: "single",
      id: "ex-callable",
      prompt: "What can a Callable do that a Runnable cannot?",
      options: [
        "Return a value and throw a checked exception",
        "Run faster",
        "Run without a thread",
      ],
      answer: 0,
      explanation: "A `Callable` returns a result through a `Future`.",
    },
    {
      type: "truefalse",
      id: "ex-shutdown",
      statement:
        "`shutdown()` stops tasks that are already running immediately.",
      answer: false,
      explanation:
        "It only stops accepting new tasks. `shutdownNow()` interrupts running ones.",
    },
    {
      type: "output",
      id: "ex-future",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "ExecutorService p = Executors.newSingleThreadExecutor();\nFuture<Integer> f = p.submit(() -> 6 * 7);\nSystem.out.println(f.get());\np.shutdown();",
      },
      options: ["42", "null", "Future"],
      answer: 0,
      explanation: "`get()` returns the value of the Callable.",
    },
  ],
  assignment: {
    title: "Build a bounded pool",
    task: [
      "Create a `ThreadPoolExecutor` with 2 core threads, 4 maximum, a queue of 10 and the caller-runs policy, with named threads.",
      "Send 100 tasks, print which thread ran each, and shut the pool down cleanly with a timeout.",
    ],
    checklist: [
      "The queue is bounded",
      "Threads have names",
      "The shutdown sequence uses awaitTermination",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "ex-ex",
      title: "Parallel sum with Futures",
      task: [
        "Write `static long parallelSum(List<Integer> numbers, int parts)` that splits the list into `parts` chunks, sums each chunk in a pool task, and adds the results.",
      ],
      language: "java",
      starter:
        "import java.util.*;\nimport java.util.concurrent.*;\n\npublic class ParallelSum {\n  // your code\n}",
      solution:
        "import java.util.*;\nimport java.util.concurrent.*;\n\npublic class ParallelSum {\n  static long parallelSum(List<Integer> numbers, int parts) throws Exception {\n    ExecutorService pool = Executors.newFixedThreadPool(parts);\n    try {\n      int size = (numbers.size() + parts - 1) / parts;\n      List<Future<Long>> futures = new ArrayList<>();\n      for (int start = 0; start < numbers.size(); start += size) {\n        List<Integer> chunk = numbers.subList(start, Math.min(start + size, numbers.size()));\n        futures.add(pool.submit(() -> {\n          long sum = 0;\n          for (int n : chunk) sum += n;\n          return sum;\n        }));\n      }\n      long total = 0;\n      for (Future<Long> f : futures) total += f.get();\n      return total;\n    } finally {\n      pool.shutdown();\n    }\n  }\n\n  public static void main(String[] args) throws Exception {\n    System.out.println(parallelSum(List.of(1, 2, 3, 4, 5, 6, 7), 3));\n  }\n}",
      hints: ["Use `subList` for the chunks, and `get()` on every Future."],
      checklist: [
        "The pool is shut down in finally",
        "Every chunk is summed in a task",
        "The total is 28",
      ],
    },
  ],
  revisionNotes: [
    "Pools reuse threads and bound concurrency; submit Runnable or Callable",
    "Future.get waits; failures arrive as ExecutionException",
    "ThreadPoolExecutor: core threads → queue → extra threads → reject; prefer bounded queues",
    "shutdown → awaitTermination → shutdownNow",
  ],
  resources: [
    {
      label: "The Java Tutorials: Executors",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/executors.html",
    },
    {
      label: "The Java Tutorials: Thread Pools",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/pools.html",
    },
    {
      label: "Java SE API: ThreadPoolExecutor",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html",
    },
  ],
})
