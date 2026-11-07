import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "threads-and-lifecycle",
  title: "Threads: creating, starting, states and interrupting",
  topic: "Thread lifecycle",
  minutes: 70,
  overview:
    "Create and start threads, understand their states, and use join, sleep, interrupt and daemon threads correctly.",
  objectives: [
    "Create threads with Runnable and lambdas, and tell start from run",
    "Name the six thread states",
    "Cooperate with interrupt, join and daemon threads",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Processes and threads",
      body: [
        "A **process** is a running program with its own memory. A **thread** is a path of execution inside a process. All threads of a process share the same **heap** memory, but each thread has its own **call stack**. Sharing memory makes communication cheap, but it also lets threads interfere with each other's data, which is why synchronisation is needed.",
        "A Java program starts with one **main thread**, and it can create more. On a machine with several cores, threads can truly run in parallel. **Concurrency** means dealing with many things at once, and **parallelism** means running them at the same moment.",
        "You create a thread by passing a `Runnable` to a `Thread`, which is usually better than extending `Thread`, because it separates the task from the thread. In real applications you submit tasks to an executor, which a later lesson covers.",
      ],
    },
    {
      kind: "code",
      heading: "start and run",
      example: {
        title: "Which thread runs the code",
        language: "java",
        code: 'Runnable task = () -> System.out.println(Thread.currentThread().getName());\n    Thread t1 = new Thread(task, "worker");\n    t1.run();\n    Thread t2 = new Thread(task, "worker");\n    t2.start();\n    t2.join();\n    try {\n      t2.start();\n    } catch (IllegalThreadStateException e) {\n      System.out.println("cannot start twice");\n    }',
        walkthrough: [
          "`run()` is an ordinary method call, so the current thread, `main`, prints.",
          "`start()` creates a new thread named `worker` that runs the task, and `join()` waits for it.",
          "A thread can be started only once. The output is `main`, `worker` and `cannot start twice`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The six states",
      body: [
        "`Thread.State` has six values. **NEW**: created, not started. **RUNNABLE**: running, or ready to run when the scheduler allows. **BLOCKED**: waiting for the monitor lock of a `synchronized` block. **WAITING**: waiting without a time limit, in `wait()`, `join()` or `LockSupport.park()`. **TIMED_WAITING**: waiting for a limited time, such as `sleep(ms)`. **TERMINATED**: the `run` method has finished.",
        "`getState()` is for monitoring and debugging, not for synchronising. A thread that waits for I/O is still reported as RUNNABLE. Thread dumps show these states and are the main tool for finding stuck threads.",
      ],
    },
    {
      kind: "explain",
      heading: "sleep, join and interrupt",
      body: [
        "`Thread.sleep(ms)` pauses the current thread and does **not release** any lock it holds. `t.join()` makes the current thread wait until `t` has finished. `t.interrupt()` does **not kill** a thread. It sets the thread's **interrupt flag**, and blocking methods such as `sleep`, `join` and `wait` react by throwing `InterruptedException` and clearing the flag. A well-behaved task checks for interruption and stops cleanly.",
        "**Never swallow `InterruptedException`.** Either rethrow it, or call `Thread.currentThread().interrupt()` to restore the flag. `Thread.stop()` is deprecated and unsafe. A **daemon** thread, set with `setDaemon(true)` before `start()`, does not keep the JVM alive: when only daemon threads remain, the JVM exits and stops them abruptly.",
      ],
    },
    {
      kind: "code",
      heading: "A cancellable worker",
      example: {
        title: "Cooperative interruption",
        language: "java",
        code: 'AtomicInteger ticks = new AtomicInteger();\n    Thread worker = new Thread(() -> {\n      try {\n        while (!Thread.currentThread().isInterrupted()) {\n          ticks.incrementAndGet();\n          Thread.sleep(10);\n        }\n      } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();\n      }\n    });\n    worker.start();\n    Thread.sleep(100);\n    worker.interrupt();\n    worker.join();\n    System.out.println(worker.getState() + " " + (ticks.get() > 0));',
        walkthrough: [
          "The worker loops until its interrupt flag is set.",
          "`interrupt()` makes `sleep` throw, and the catch block restores the flag and ends the task.",
          "`join()` waits for it, and the state is `TERMINATED`. The output is `TERMINATED true`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Calling `run()` and expecting a new thread.",
          fix: "Call `start()`.",
        },
        {
          mistake: "Starting the same Thread object twice.",
          fix: "Create a new Thread, or use an executor.",
        },
        {
          mistake: "Catching InterruptedException and ignoring it.",
          fix: "Rethrow it or restore the flag with `interrupt()`.",
        },
        {
          mistake: "Creating a thread for every tiny task.",
          fix: "Use a thread pool.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A background refresher",
      scenario:
        "An application refreshes a cache every minute and must stop cleanly when the application closes.",
      body: [
        "Run the refresher in a daemon thread or a scheduled executor, check the interrupt flag in the loop, and call `interrupt()` and `join()` at shutdown so that it ends between two refreshes.",
        "A forced stop in the middle of a refresh could leave the cache half-updated.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tl-start",
      prompt: "What is the difference between `start()` and `run()`?",
      options: [
        "start creates a new thread; run is a plain method call",
        "They are identical",
        "run creates a new thread",
      ],
      answer: 0,
      explanation: "Only `start()` begins a new thread of execution.",
    },
    {
      type: "single",
      id: "tl-interrupt",
      prompt: "What does `interrupt()` do?",
      options: [
        "Sets the interrupt flag; blocking calls throw InterruptedException",
        "Kills the thread immediately",
        "Pauses the thread",
      ],
      answer: 0,
      explanation: "Interruption is a cooperative request.",
    },
    {
      type: "truefalse",
      id: "tl-sleep-lock",
      statement: "`Thread.sleep` releases the locks that the thread holds.",
      answer: false,
      explanation: "Sleeping keeps the locks. `wait()` releases the monitor.",
    },
    {
      type: "multi",
      id: "tl-states",
      prompt: "Which are valid Thread.State values?",
      options: ["NEW", "BLOCKED", "TIMED_WAITING", "RUNNING"],
      answers: [0, 1, 2],
      explanation: "Java has `RUNNABLE`, not `RUNNING`.",
    },
  ],
  assignment: {
    title: "Thread experiments",
    task: [
      "Write programs that show each of the six states using `getState()`, a `synchronized` block, `sleep` and `join`.",
      "Write a worker that stops cleanly on interrupt, and show that a daemon thread is stopped when main ends.",
    ],
    checklist: [
      "I observed at least five states",
      "The worker stops without losing data",
      "I restored the interrupt flag in every catch",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "tl-ex",
      title: "Join two threads",
      task: [
        "Write `static int sumInThreads(int[] a, int[] b)` that sums each array in its own thread, waits for both with `join`, and returns the total.",
      ],
      language: "java",
      starter: "public class Sum {\n  // your code\n}",
      solution:
        "public class Sum {\n  static int sumInThreads(int[] a, int[] b) throws InterruptedException {\n    int[] results = new int[2];\n    Thread t1 = new Thread(() -> {\n      for (int n : a) results[0] += n;\n    });\n    Thread t2 = new Thread(() -> {\n      for (int n : b) results[1] += n;\n    });\n    t1.start();\n    t2.start();\n    t1.join();\n    t2.join();\n    return results[0] + results[1];\n  }\n\n  public static void main(String[] args) throws InterruptedException {\n    System.out.println(sumInThreads(new int[] {1, 2}, new int[] {3, 4}));\n  }\n}",
      hints: [
        "Each thread writes to its own slot, so no lock is needed. `join` makes the writes visible.",
      ],
      checklist: [
        "Both threads are joined",
        "Each thread writes its own slot",
        "The result is 10 for the example",
      ],
    },
  ],
  revisionNotes: [
    "Threads share the heap, have their own stack; `start()` creates a thread, `run()` does not",
    "Six states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED",
    "`interrupt()` is cooperative; never swallow InterruptedException",
    "Daemon threads do not keep the JVM alive",
  ],
  resources: [
    {
      label: "The Java Tutorials: Processes and Threads",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html",
    },
    {
      label: "The Java Tutorials: Thread Objects",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/threads.html",
    },
    {
      label: "The Java Tutorials: Interrupts",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html",
    },
  ],
})
