import { defineQuestions } from "../author"
import { g } from "../brief"

const C = "https://docs.oracle.com/javase/tutorial/essential/concurrency"
const API = "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java"

export default defineQuestions("java-multithreading", "fresher", [
  g({
    slug: "process-vs-thread",
    topic: "Thread lifecycle",
    d: "easy",
    title: "What is the difference between a process and a thread?",
    kw: ["process", "thread", "concurrency", "memory", "multitasking"],
    intent: "Checks the basic vocabulary before any threading code.",
    short:
      "A process is a running program with its own memory space and resources. A thread is a unit of execution inside a process. All threads of a process share the same heap memory and open resources, but each thread has its own call stack and program counter. Because threads share memory, communication between them is cheap, but they can also interfere with each other's data, which is why synchronisation is needed. Switching between threads is lighter than switching between processes.",
    detail: [
      "A Java program starts with one main thread, and it can create more.",
      "A crash in one process does not damage another one, but an uncaught problem in one thread can affect the whole process.",
      "On a multi-core machine, threads can run truly in parallel.",
    ],
    ex: "A browser is a process, and each tab's renderer, the network loader and the UI can be threads or separate processes.",
    mistakes: [
      "Saying that threads have separate heap memory.",
      "Confusing concurrency (dealing with many things) with parallelism (running at the same moment).",
    ],
    follow: ["What do threads share, and what is private to each thread?"],
    points: [
      "Process: own memory",
      "Threads share the heap",
      "Each thread has its own stack",
    ],
    notes:
      "Process = isolated program. Thread = execution path sharing the process's heap.",
    src: [
      ["The Java Tutorials: Processes and Threads", `${C}/procthread.html`],
      ["The Java Tutorials: Concurrency", `${C}/index.html`],
    ],
  }),
  g({
    slug: "ways-to-create-a-thread",
    topic: "Thread lifecycle",
    d: "easy",
    title:
      "In how many ways can you create a thread in Java? Which is preferred?",
    kw: ["Thread", "Runnable", "Callable", "ExecutorService", "lambda"],
    intent:
      "Checks that you know the options and prefer composition and executors.",
    short:
      "You can extend `Thread` and override `run()`, or pass a `Runnable` to a `Thread`, which is usually better because it separates the task from the thread and leaves your class free to extend something else. A lambda makes a `Runnable` short. A `Callable` is like a `Runnable` that returns a result and can throw a checked exception, and it is run through an `ExecutorService`. In real applications you normally submit tasks to an executor rather than creating threads by hand.",
    detail: [
      "`Runnable.run()` returns nothing and cannot throw a checked exception.",
      "Creating a thread for every task is expensive, and a thread pool reuses threads.",
      "Since Java 21, virtual threads offer a lightweight alternative for many blocking tasks.",
    ],
    ex: "A server submits each request-handling task to an executor, rather than writing `new Thread(...)` for every request.",
    code: [
      "Three styles",
      'Thread t1 = new Thread(() -> System.out.println("runnable"));\nt1.start();\n\nclass Worker extends Thread {\n  public void run() { System.out.println("subclass"); }\n}\nnew Worker().start();\n\nExecutorService pool = Executors.newFixedThreadPool(2);\nFuture<Integer> f = pool.submit(() -> 6 * 7);\nSystem.out.println(f.get());\npool.shutdown();',
      [
        "The first thread runs a lambda `Runnable`.",
        "The second extends `Thread`, which ties the task to the thread class.",
        "The `Callable` returns `42` through a `Future`.",
        "The pool is shut down at the end.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `run()` instead of `start()`.",
      "Creating a new thread for every small task.",
    ],
    follow: ["What is the difference between Runnable and Callable?"],
    points: [
      "Runnable preferred over extending Thread",
      "Callable returns a value",
      "Use executors in applications",
    ],
    notes:
      "Prefer `Runnable`/`Callable` with an executor over subclassing `Thread`.",
    src: [
      [
        "The Java Tutorials: Defining and Starting a Thread",
        `${C}/runthread.html`,
      ],
      [
        "Java SE API: ExecutorService",
        `${API}/util/concurrent/ExecutorService.html`,
      ],
    ],
  }),
  g({
    slug: "start-vs-run",
    topic: "Thread lifecycle",
    d: "easy",
    title:
      "What is the difference between `start()` and `run()`? What if you call `start()` twice?",
    kw: [
      "start",
      "run",
      "new thread",
      "IllegalThreadStateException",
      "call stack",
    ],
    intent: "Checks a very common beginner mistake.",
    short:
      "`start()` asks the JVM to create a new thread of execution, which then calls `run()` on its own call stack. Calling `run()` directly is just a normal method call on the current thread, so no new thread is created and nothing runs in parallel. A thread can be started only once. Calling `start()` a second time throws `IllegalThreadStateException`.",
    detail: [
      "`Thread.currentThread().getName()` shows which thread is executing the code.",
      "After `run()` finishes, the thread is terminated and cannot be restarted.",
      "To run the task again, create a new `Thread` or submit it to an executor.",
    ],
    ex: "A program prints `main` when it calls `run()` directly, and a different thread name when it calls `start()`.",
    code: [
      "Which thread runs?",
      'Runnable task = () -> System.out.println(Thread.currentThread().getName());\n\nnew Thread(task, "worker").run();   // prints main\nnew Thread(task, "worker").start(); // prints worker',
      [
        "`run()` is an ordinary call, so the current thread, `main`, prints.",
        "`start()` creates a new thread named `worker`, which prints.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `run()` and expecting parallel execution.",
      "Starting the same `Thread` object twice.",
    ],
    follow: ["What are the states of a thread?"],
    points: [
      "start creates a thread, run does not",
      "A thread starts only once",
      "Second start: IllegalThreadStateException",
    ],
    notes: "`start()` = new thread. `run()` = plain method call.",
    src: [
      ["Java SE API: Thread.start", `${API}/lang/Thread.html#start()`],
      [
        "The Java Tutorials: Defining and Starting a Thread",
        `${C}/runthread.html`,
      ],
    ],
  }),
  g({
    slug: "thread-states",
    topic: "Thread lifecycle",
    d: "medium",
    title: "What are the states in the life cycle of a thread?",
    kw: ["thread states", "NEW", "RUNNABLE", "BLOCKED", "WAITING"],
    intent:
      "Checks that you know the six states and what moves a thread between them.",
    short:
      "A thread is in exactly one of six states, listed in `Thread.State`. `NEW`: created but not started. `RUNNABLE`: running, or ready to run when the scheduler allows. `BLOCKED`: waiting to get the monitor lock of a `synchronized` block. `WAITING`: waiting without a time limit, for example in `wait()`, `join()` or `LockSupport.park()`. `TIMED_WAITING`: waiting for a limited time, as in `sleep(ms)` or `join(ms)`. `TERMINATED`: the `run` method has finished or ended with an exception.",
    detail: [
      "`thread.getState()` returns the state, and it is meant for monitoring, not for synchronisation.",
      "A thread waiting for I/O is still reported as `RUNNABLE`.",
      "Thread dumps show these states and are the main tool to find stuck threads.",
    ],
    ex: "A thread that calls `sleep(1000)` is `TIMED_WAITING`, and a thread trying to enter a lock held by another is `BLOCKED`.",
    mistakes: [
      'Listing "running" as a separate state. In Java, running and ready are both `RUNNABLE`.',
      "Mixing up `BLOCKED` (waiting for a monitor) and `WAITING` (waiting for a signal).",
    ],
    follow: ["What is the difference between BLOCKED and WAITING?"],
    points: [
      "NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED",
      "BLOCKED: waiting for a monitor",
      "WAITING: waiting for another thread",
    ],
    notes:
      "Six states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.",
    src: [
      ["Java SE API: Thread.State", `${API}/lang/Thread.State.html`],
      ["The Java Tutorials: Thread Objects", `${C}/threads.html`],
    ],
  }),
  g({
    slug: "sleep-join-interrupt",
    topic: "Thread lifecycle",
    d: "medium",
    title: "What do `sleep`, `join` and `interrupt` do?",
    kw: [
      "sleep",
      "join",
      "interrupt",
      "InterruptedException",
      "interrupt flag",
    ],
    intent: "Checks that you can coordinate threads and stop them politely.",
    short:
      "`Thread.sleep(ms)` pauses the current thread for a time, and it does not release any lock it holds. `t.join()` makes the current thread wait until thread `t` has finished, and `join(ms)` waits for a limited time. `t.interrupt()` does not kill a thread: it sets the thread's interrupt flag, and blocking methods such as `sleep`, `join` and `wait` react by throwing `InterruptedException` and clearing the flag. A well-behaved task checks for interruption and stops cleanly.",
    detail: [
      "Do not swallow `InterruptedException`. Either rethrow it or call `Thread.currentThread().interrupt()` to restore the flag.",
      "`Thread.stop()` is deprecated and unsafe, so cooperative interruption is the correct way to cancel.",
      "`isInterrupted()` reads the flag, and the static `Thread.interrupted()` reads and clears it.",
    ],
    ex: "The main thread starts a worker, calls `join()` to wait for its result, and calls `interrupt()` if it takes too long.",
    code: [
      "A cancellable task",
      'Thread worker = new Thread(() -> {\n  try {\n    while (!Thread.currentThread().isInterrupted()) {\n      Thread.sleep(200);\n      System.out.println("working");\n    }\n  } catch (InterruptedException e) {\n    Thread.currentThread().interrupt();\n  }\n});\nworker.start();\nThread.sleep(700);\nworker.interrupt();\nworker.join();',
      [
        "The loop runs until the thread is interrupted.",
        "`interrupt()` makes `sleep` throw, and the catch block restores the flag and ends the task.",
        "`join()` waits for the worker to finish.",
      ],
      "java",
    ],
    mistakes: [
      "Catching `InterruptedException` and ignoring it.",
      "Thinking that `interrupt()` forces a thread to stop at once.",
    ],
    follow: ["Why is Thread.stop() deprecated?"],
    points: [
      "sleep keeps its locks",
      "join waits for a thread to end",
      "interrupt is a polite request",
    ],
    notes:
      "Interrupt = flag + `InterruptedException` in blocking calls. Never swallow it.",
    src: [
      ["The Java Tutorials: Interrupts", `${C}/interrupt.html`],
      ["The Java Tutorials: Joins", `${C}/join.html`],
      ["The Java Tutorials: Pausing Execution with Sleep", `${C}/sleep.html`],
    ],
  }),
  g({
    slug: "daemon-threads",
    topic: "Thread lifecycle",
    d: "medium",
    title: "What is a daemon thread?",
    kw: ["daemon thread", "setDaemon", "JVM exit", "user thread", "background"],
    intent: "Checks that you know how the JVM decides when to exit.",
    short:
      "A daemon thread is a background thread that does not keep the JVM alive. The JVM exits when all non-daemon (user) threads have finished, and it then stops the daemon threads wherever they are, without running their `finally` blocks. You make a thread a daemon with `setDaemon(true)` before calling `start()`. Daemons suit housekeeping tasks such as monitoring or cache cleaning, but not work that must complete, like writing a file.",
    detail: [
      "A thread inherits the daemon status from the thread that creates it.",
      "Calling `setDaemon` after `start` throws `IllegalThreadStateException`.",
      "The garbage collector's threads are an example of daemon threads.",
    ],
    ex: "A metrics reporter that prints statistics every minute is a daemon, so it does not stop the application from ending.",
    mistakes: [
      "Using a daemon thread for work that must be completed, such as saving data.",
      "Setting daemon status after the thread was started.",
    ],
    follow: ["When does the JVM exit?"],
    points: [
      "Does not keep the JVM alive",
      "setDaemon before start",
      "Stopped abruptly on exit",
    ],
    notes:
      "JVM exits when only daemon threads are left; they are stopped abruptly.",
    src: [
      [
        "Java SE API: Thread.setDaemon",
        `${API}/lang/Thread.html#setDaemon(boolean)`,
      ],
      ["Java SE API: Thread", `${API}/lang/Thread.html`],
    ],
  }),
  g({
    slug: "race-condition",
    topic: "synchronized",
    d: "easy",
    title: "What is a race condition? Show how `count++` can fail.",
    kw: [
      "race condition",
      "thread safety",
      "count++",
      "atomicity",
      "lost update",
    ],
    intent: "Checks that you understand why shared mutable data is dangerous.",
    short:
      "A race condition happens when the result of a program depends on the timing of threads that access shared data without proper coordination. A typical example is `count++` on a shared field. It looks like one step, but it is three: read the value, add one, write it back. If two threads read the same value before either writes, one update is lost, and the final count is smaller than expected. The fix is to make the operation atomic, with `synchronized`, a lock or an `AtomicInteger`.",
    detail: [
      "Races depend on timing, so they may pass many tests and fail only in production.",
      "Read-modify-write and check-then-act sequences are the classic cases.",
      "The safest data is immutable, or confined to a single thread.",
    ],
    ex: "Two request threads each add one to a visitor counter 100,000 times, and the total is less than 200,000.",
    code: [
      "A lost update and a fix",
      "class Counter {\n  private int unsafe = 0;\n  private final AtomicInteger safe = new AtomicInteger();\n\n  void hit() {\n    unsafe++;              // not atomic\n    safe.incrementAndGet(); // atomic\n  }\n}",
      [
        "`unsafe++` is read, add and write, and two threads can overlap.",
        "`incrementAndGet` performs the whole update atomically.",
      ],
      "java",
    ],
    mistakes: [
      "Assuming that `count++` is atomic.",
      "Adding `volatile` and thinking that it makes `count++` safe.",
    ],
    follow: ["How would you fix it with synchronized?"],
    points: [
      "Result depends on timing",
      "count++ is read, modify, write",
      "Fix: atomic classes, locks or immutability",
    ],
    notes:
      "Race condition: unsynchronised shared state. `count++` is not atomic.",
    src: [
      ["The Java Tutorials: Thread Interference", `${C}/interf.html`],
      ["The Java Tutorials: Atomic Variables", `${C}/atomicvars.html`],
    ],
  }),
  g({
    slug: "synchronized-method-vs-block",
    topic: "synchronized",
    d: "medium",
    title:
      "What is the difference between a `synchronized` method and a `synchronized` block?",
    kw: [
      "synchronized",
      "monitor lock",
      "intrinsic lock",
      "static synchronized",
      "critical section",
    ],
    intent:
      "Checks that you know which lock is used and how to limit the locked code.",
    short:
      "Every Java object has an intrinsic lock, also called a monitor. A `synchronized` instance method locks `this` for the whole method, and a `static synchronized` method locks the `Class` object. A `synchronized (lockObject) { ... }` block locks the object that you name, and only for the code inside the block. Only one thread at a time can hold a given lock, so others wait. Blocks are preferred because they keep the critical section small and let you use a private lock object that outside code cannot touch.",
    detail: [
      "The lock is released automatically when the block or method ends, even through an exception.",
      "A thread that already holds a lock can enter other `synchronized` code on the same lock. This is called reentrancy.",
      "Two threads using different lock objects do not block each other.",
    ],
    ex: "A bank account locks only the code that changes the balance, and does the logging outside the lock.",
    code: [
      "Method and block",
      "class Account {\n  private final Object lock = new Object();\n  private double balance;\n\n  synchronized void depositA(double amount) {  // locks this\n    balance += amount;\n  }\n\n  void depositB(double amount) {\n    synchronized (lock) {                      // locks only lock\n      balance += amount;\n    }\n  }\n}",
      [
        "`depositA` holds the lock on `this` for the whole method.",
        "`depositB` holds a private lock only around the update.",
        "A private lock cannot be taken by code outside the class.",
      ],
      "java",
    ],
    mistakes: [
      "Synchronising on different objects in different methods and expecting mutual exclusion.",
      "Doing slow work, such as I/O, inside a synchronized block.",
    ],
    follow: ["What does a static synchronized method lock?"],
    points: [
      "Instance method: lock on this",
      "Static method: lock on the Class",
      "Block: lock on the object you choose",
    ],
    notes:
      "`synchronized` = intrinsic lock. Prefer small blocks on a private lock object.",
    src: [
      ["The Java Tutorials: Synchronized Methods", `${C}/syncmeth.html`],
      [
        "The Java Tutorials: Intrinsic Locks and Synchronization",
        `${C}/locksync.html`,
      ],
    ],
  }),
  g({
    slug: "wait-notify",
    topic: "synchronized",
    d: "hard",
    title: "How do `wait()`, `notify()` and `notifyAll()` work?",
    kw: ["wait", "notify", "notifyAll", "monitor", "spurious wakeup"],
    intent: "Checks that you understand low-level signalling between threads.",
    short:
      "`wait()`, `notify()` and `notifyAll()` are methods of `Object`, and a thread must hold the object's monitor, inside `synchronized`, to call them, or it gets `IllegalMonitorStateException`. `wait()` releases the monitor and puts the thread to sleep until another thread calls `notify()` or `notifyAll()` on the same object. `notify` wakes one waiting thread, and `notifyAll` wakes all of them. Always call `wait()` inside a loop that checks the condition, because a thread can wake up spuriously or the condition can be changed again before it runs.",
    detail: [
      "`sleep` keeps the locks it holds, and `wait` releases the monitor.",
      "`notifyAll` is the safer choice when several kinds of threads wait on one object.",
      "In new code, `BlockingQueue` or `Condition` objects are usually easier than raw `wait` and `notify`.",
    ],
    ex: "A consumer waits while the buffer is empty, and the producer calls `notifyAll()` after it adds an item.",
    code: [
      "Wait in a loop",
      "synchronized (lock) {\n  while (queue.isEmpty()) {\n    lock.wait();\n  }\n  Object item = queue.remove();\n}\n\n// producer\nsynchronized (lock) {\n  queue.add(item);\n  lock.notifyAll();\n}",
      [
        "The consumer holds the monitor and waits while the queue is empty.",
        "`wait()` releases the monitor, so the producer can enter.",
        "The `while` loop re-checks the condition after every wake-up.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `wait()` outside a `synchronized` block.",
      "Using `if` instead of `while` around `wait()`.",
    ],
    follow: ["What is the difference between sleep and wait?"],
    points: [
      "Must hold the monitor",
      "wait releases it, sleep does not",
      "Use a while loop",
    ],
    notes:
      "`wait()` inside `synchronized` and inside a `while` loop; `notifyAll()` to signal.",
    src: [
      ["The Java Tutorials: Guarded Blocks", `${C}/guardmeth.html`],
      ["Java SE API: Object.wait", `${API}/lang/Object.html#wait()`],
    ],
  }),
  g({
    slug: "deadlock",
    topic: "synchronized",
    d: "medium",
    title: "What is a deadlock, and how do you prevent it?",
    kw: [
      "deadlock",
      "lock ordering",
      "circular wait",
      "tryLock",
      "thread dump",
    ],
    intent:
      "Checks that you can recognise and avoid the most feared threading bug.",
    short:
      "A deadlock happens when two or more threads each hold a lock that another one needs, and none of them can continue. For example, thread A holds lock 1 and waits for lock 2, while thread B holds lock 2 and waits for lock 1. It needs mutual exclusion, hold-and-wait, no preemption and circular waiting together. You prevent it by always acquiring locks in the same global order, by holding fewer locks and for less time, and by using `tryLock` with a timeout so that a thread can give up and retry.",
    detail: [
      "A thread dump, taken with `jstack` or the IDE, can report detected deadlocks.",
      "Calling unknown code, such as a callback, while holding a lock is a common cause.",
      "Related problems are starvation, where a thread never gets its turn, and livelock, where threads keep reacting to each other without progress.",
    ],
    ex: "Two money transfers, A to B and B to A, lock the accounts in opposite order and freeze, until both lock the account with the lower id first.",
    code: [
      "A deadlock risk and the fix",
      "// risk: opposite order\nvoid transfer(Account from, Account to) {\n  synchronized (from) {\n    synchronized (to) { /* move money */ }\n  }\n}\n\n// fix: always lock the lower id first\nvoid safeTransfer(Account a, Account b) {\n  Account first = a.id() < b.id() ? a : b;\n  Account second = first == a ? b : a;\n  synchronized (first) {\n    synchronized (second) { /* move money */ }\n  }\n}",
      [
        "Two transfers in opposite directions can each hold one lock and wait for the other.",
        "Ordering the locks by id means that all threads take them in the same order.",
        "Then a circular wait cannot form.",
      ],
      "java",
    ],
    mistakes: [
      "Taking several locks in different orders in different methods.",
      "Calling external code while holding a lock.",
    ],
    follow: ["How would you find a deadlock in a running application?"],
    points: [
      "Circular wait on locks",
      "Fix with a global lock order",
      "tryLock with timeout, thread dump to diagnose",
    ],
    notes:
      "Deadlock: circular lock wait. Lock in a fixed order, or use `tryLock` with a timeout.",
    src: [
      ["The Java Tutorials: Deadlock", `${C}/deadlock.html`],
      ["The Java Tutorials: Starvation and Livelock", `${C}/starvelive.html`],
    ],
  }),
  g({
    slug: "why-thread-pools",
    topic: "Executors",
    d: "easy",
    title: "What is a thread pool and why use `ExecutorService`?",
    kw: [
      "thread pool",
      "ExecutorService",
      "Executors",
      "task queue",
      "reuse threads",
    ],
    intent:
      "Checks that you know why applications do not create a thread per task.",
    short:
      "A thread pool keeps a number of worker threads alive and reuses them to run submitted tasks. Creating a thread is costly, and an unlimited number of threads can exhaust memory and slow everything down. With `ExecutorService`, you submit `Runnable` or `Callable` tasks, and the pool queues them and runs them on its workers. It also gives you lifecycle control with `shutdown`, results through `Future`, and a limit on concurrency.",
    detail: [
      "The `Executor` interface only runs tasks, and `ExecutorService` adds shutdown and `Future` support.",
      "`ScheduledExecutorService` runs tasks after a delay or at a fixed rate.",
      "A pool must be shut down, or its non-daemon threads can keep the application alive.",
    ],
    ex: "An image service resizes uploads with a pool of 4 workers, and extra uploads wait in the queue.",
    code: [
      "Submitting tasks to a pool",
      "ExecutorService pool = Executors.newFixedThreadPool(4);\ntry {\n  List<Future<Integer>> results = new ArrayList<>();\n  for (int i = 1; i <= 3; i++) {\n    final int n = i;\n    results.add(pool.submit(() -> n * n));\n  }\n  for (Future<Integer> f : results) {\n    System.out.println(f.get());\n  }\n} finally {\n  pool.shutdown();\n}",
      [
        "Four threads are created once and reused.",
        "Each `submit` returns a `Future` for the result.",
        "`shutdown` in `finally` stops the pool from keeping the application alive.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting to call `shutdown`.",
      "Creating a new pool for every request.",
    ],
    follow: ["What is the difference between execute and submit?"],
    points: [
      "Reuses a fixed set of threads",
      "Queues extra tasks",
      "Always shut the pool down",
    ],
    notes:
      "Use `ExecutorService`; reuse threads, bound concurrency, call `shutdown()`.",
    src: [
      ["The Java Tutorials: Executors", `${C}/executors.html`],
      ["The Java Tutorials: Thread Pools", `${C}/pools.html`],
    ],
  }),
  g({
    slug: "executors-factory-methods",
    topic: "Executors",
    d: "medium",
    title:
      "What kinds of pools does `Executors` create, and what are their risks?",
    kw: [
      "newFixedThreadPool",
      "newCachedThreadPool",
      "newSingleThreadExecutor",
      "newScheduledThreadPool",
      "unbounded queue",
    ],
    intent: "Checks that you know the convenient factories and their limits.",
    short:
      "`newFixedThreadPool(n)` keeps `n` threads and uses an unbounded queue, so tasks wait in memory if they arrive faster than they finish. `newCachedThreadPool()` creates threads as needed and reuses idle ones for 60 seconds, so under a burst of tasks it can create a very large number of threads. `newSingleThreadExecutor()` runs tasks one at a time in order. `newScheduledThreadPool(n)` runs delayed or periodic tasks. For production services, many teams build a `ThreadPoolExecutor` directly, with a bounded queue and a rejection policy.",
    detail: [
      "An unbounded queue can hide overload until memory runs out.",
      "`newWorkStealingPool` uses a `ForkJoinPool` for many small tasks.",
      "Virtual threads, with `Executors.newVirtualThreadPerTaskExecutor()` in Java 21, suit many blocking tasks.",
    ],
    ex: "A burst of 100,000 tasks sent to a cached pool can try to create thousands of threads.",
    mistakes: [
      "Using a cached pool for unbounded input.",
      "Using a fixed pool with an unbounded queue and no limit on how much work is accepted.",
    ],
    follow: ["How do you configure a ThreadPoolExecutor yourself?"],
    points: [
      "Fixed: n threads, unbounded queue",
      "Cached: unbounded threads",
      "Prefer a configured ThreadPoolExecutor for services",
    ],
    notes:
      "Convenience pools hide unbounded queues or threads; configure `ThreadPoolExecutor` for production.",
    src: [
      ["Java SE API: Executors", `${API}/util/concurrent/Executors.html`],
      [
        "Java SE API: ThreadPoolExecutor",
        `${API}/util/concurrent/ThreadPoolExecutor.html`,
      ],
    ],
  }),
  g({
    slug: "threadpoolexecutor-parameters",
    topic: "Executors",
    d: "hard",
    title:
      "What are the parameters of `ThreadPoolExecutor`, and how does it decide what to do with a new task?",
    kw: [
      "ThreadPoolExecutor",
      "corePoolSize",
      "maximumPoolSize",
      "workQueue",
      "RejectedExecutionHandler",
    ],
    intent: "Checks that you can reason about the pool's behaviour under load.",
    short:
      "The main parameters are `corePoolSize`, `maximumPoolSize`, `keepAliveTime`, the `workQueue`, a `ThreadFactory` and a `RejectedExecutionHandler`. For a new task, the pool first starts a new thread while fewer than `corePoolSize` threads exist. After that it puts the task in the queue. Only when the queue is full does it create extra threads, up to `maximumPoolSize`. If the queue is full and the maximum is reached, the task is rejected by the handler, which by default throws `RejectedExecutionException`. Extra threads above the core size die after `keepAliveTime` of idleness.",
    detail: [
      "With an unbounded queue, the pool never grows beyond the core size, so the maximum has no effect.",
      "Rejection policies include abort, caller-runs, discard and discard-oldest.",
      "A custom `ThreadFactory` lets you name threads, which makes logs and thread dumps readable.",
    ],
    ex: "A pool with 4 core threads, 8 maximum and a queue of 100 handles up to 108 waiting and running tasks before it rejects.",
    code: [
      "A bounded pool",
      "ThreadPoolExecutor pool = new ThreadPoolExecutor(\n    4, 8,\n    60, TimeUnit.SECONDS,\n    new ArrayBlockingQueue<>(100),\n    new ThreadPoolExecutor.CallerRunsPolicy());",
      [
        "Four threads are started first, then tasks wait in a queue of 100.",
        "Only when the queue is full does the pool grow up to 8 threads.",
        "`CallerRunsPolicy` makes the submitting thread run the task, which slows down the producer.",
      ],
      "java",
    ],
    mistakes: [
      "Setting a larger maximum while using an unbounded queue, and expecting more threads.",
      "Not naming the threads.",
    ],
    follow: ["What does CallerRunsPolicy do?"],
    points: [
      "Core threads, then queue, then extra threads, then reject",
      "Unbounded queue means no growth",
      "Choose a rejection policy",
    ],
    notes: "Order: core threads → queue → extra threads up to max → reject.",
    src: [
      [
        "Java SE API: ThreadPoolExecutor",
        `${API}/util/concurrent/ThreadPoolExecutor.html`,
      ],
      ["The Java Tutorials: Thread Pools", `${C}/pools.html`],
    ],
  }),
  g({
    slug: "future-and-shutdown",
    topic: "Executors",
    d: "medium",
    title: "How do `Future`, `shutdown()` and `shutdownNow()` work?",
    kw: ["Future", "get", "shutdown", "shutdownNow", "awaitTermination"],
    intent: "Checks that you can collect results and stop a pool cleanly.",
    short:
      "A `Future` represents the result of a task that may not be finished. `get()` waits for the result, and it throws `ExecutionException` if the task threw, and `get(timeout, unit)` stops waiting after a limit. `cancel(true)` tries to cancel the task by interrupting it. `shutdown()` stops the pool from accepting new tasks but lets the submitted ones finish. `shutdownNow()` tries to stop running tasks by interrupting them and returns the list of tasks that never started. `awaitTermination` waits for the pool to finish after a shutdown.",
    detail: [
      "`future.get()` blocks the calling thread, so do not call it on a thread that must stay responsive.",
      "A task must respond to interruption for `shutdownNow` and `cancel(true)` to work.",
      "A typical stop is `shutdown`, then `awaitTermination` with a timeout, then `shutdownNow` if it did not end.",
    ],
    ex: "On application stop, the service calls `shutdown()`, waits 30 seconds for the jobs, and then calls `shutdownNow()`.",
    code: [
      "A clean stop",
      "pool.shutdown();\ntry {\n  if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {\n    pool.shutdownNow();\n  }\n} catch (InterruptedException e) {\n  pool.shutdownNow();\n  Thread.currentThread().interrupt();\n}",
      [
        "`shutdown` lets running and queued tasks finish.",
        "If they do not finish in 30 seconds, `shutdownNow` interrupts them.",
        "The interrupt flag is restored if we are interrupted while waiting.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `get()` without a timeout on a task that may hang.",
      "Assuming that `shutdownNow` always stops a task that ignores interruption.",
    ],
    follow: ["What exception does Future.get throw when the task fails?"],
    points: [
      "get waits, ExecutionException wraps the failure",
      "shutdown: finish queued work",
      "shutdownNow: interrupt and return pending tasks",
    ],
    notes:
      "`shutdown()` → `awaitTermination()` → `shutdownNow()` for a clean stop.",
    src: [
      ["Java SE API: Future", `${API}/util/concurrent/Future.html`],
      [
        "Java SE API: ExecutorService",
        `${API}/util/concurrent/ExecutorService.html`,
      ],
    ],
  }),
  g({
    slug: "reentrantlock-vs-synchronized",
    topic: "Locks",
    d: "medium",
    title:
      "What is `ReentrantLock` and how is it different from `synchronized`?",
    kw: [
      "ReentrantLock",
      "synchronized",
      "tryLock",
      "lockInterruptibly",
      "fairness",
    ],
    intent:
      "Checks that you know when explicit locks are worth the extra care.",
    short:
      "`ReentrantLock` is an explicit lock with the same basic mutual exclusion and reentrancy as `synchronized`, but with more control. It offers `tryLock()`, with or without a timeout, so a thread can avoid waiting forever, `lockInterruptibly()`, which can be interrupted while waiting, an optional fair mode that favours the longest waiting thread, and several `Condition` objects per lock. The cost is that you must release the lock yourself, always with `unlock()` in a `finally` block. `synchronized` is simpler and is released automatically.",
    detail: [
      "Use `synchronized` by default, and a lock when you need one of the extra features.",
      "`isLocked` and `getHoldCount` help with diagnosis.",
      "Fair locks reduce starvation but have lower throughput.",
    ],
    ex: "A task tries `lock.tryLock(1, TimeUnit.SECONDS)` and reports a busy resource if it cannot get the lock.",
    code: [
      "Always unlock in finally",
      "private final ReentrantLock lock = new ReentrantLock();\n\nvoid update() {\n  lock.lock();\n  try {\n    // critical section\n  } finally {\n    lock.unlock();\n  }\n}\n\nboolean tryUpdate() throws InterruptedException {\n  if (lock.tryLock(1, TimeUnit.SECONDS)) {\n    try { /* work */ return true; } finally { lock.unlock(); }\n  }\n  return false;\n}",
      [
        "`lock()` and `unlock()` are paired, and `unlock` is in `finally` so it always runs.",
        "`tryLock` with a timeout gives up instead of waiting forever.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `unlock()` outside `finally`, so an exception leaves the lock held.",
      "Using a lock when a simple `synchronized` block is enough.",
    ],
    follow: ["How can tryLock help avoid a deadlock?"],
    points: [
      "Same exclusion and reentrancy as synchronized",
      "tryLock, interruptible, fair, Conditions",
      "unlock in finally",
    ],
    notes:
      "`ReentrantLock`: more features, but `unlock()` in `finally` is your job.",
    src: [
      ["The Java Tutorials: Lock Objects", `${C}/newlocks.html`],
      [
        "Java SE API: ReentrantLock",
        `${API}/util/concurrent/locks/ReentrantLock.html`,
      ],
    ],
  }),
  g({
    slug: "read-write-lock",
    topic: "Locks",
    d: "medium",
    title: "What is a `ReadWriteLock` and when does it help?",
    kw: [
      "ReadWriteLock",
      "ReentrantReadWriteLock",
      "read lock",
      "write lock",
      "StampedLock",
    ],
    intent:
      "Checks that you can improve throughput for read-heavy shared data.",
    short:
      "A `ReadWriteLock` keeps a pair of locks. Many threads can hold the read lock at the same time, as long as no thread holds the write lock, and the write lock is exclusive: it waits for the readers to finish, and blocks other readers and writers while it is held. This improves throughput for data that is read much more often than it is written, such as a cache or a configuration. For data with frequent writes, or very short reads, a plain lock is simpler and can be faster.",
    detail: [
      "`ReentrantReadWriteLock` is the standard implementation.",
      "A read lock cannot be upgraded to a write lock directly, which can cause a deadlock.",
      "`StampedLock` adds optimistic reads for even higher read performance.",
    ],
    ex: "A product-price cache is read by thousands of requests per second, and refreshed once a minute under the write lock.",
    code: [
      "Many readers, one writer",
      "private final ReadWriteLock rw = new ReentrantReadWriteLock();\nprivate final Map<String, Double> prices = new HashMap<>();\n\ndouble price(String id) {\n  rw.readLock().lock();\n  try { return prices.getOrDefault(id, 0.0); }\n  finally { rw.readLock().unlock(); }\n}\n\nvoid update(String id, double p) {\n  rw.writeLock().lock();\n  try { prices.put(id, p); }\n  finally { rw.writeLock().unlock(); }\n}",
      [
        "Readers share the read lock and do not block each other.",
        "The writer takes the write lock, which is exclusive.",
        "Both unlock in `finally`.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to take the write lock while holding the read lock.",
      "Using it where writes are as frequent as reads.",
    ],
    follow: ["Can you upgrade a read lock to a write lock?"],
    points: [
      "Many readers or one writer",
      "Good for read-heavy data",
      "No upgrade from read to write",
    ],
    notes:
      "Read-write lock: shared reads, exclusive writes. Do not upgrade read to write.",
    src: [
      [
        "Java SE API: ReadWriteLock",
        `${API}/util/concurrent/locks/ReadWriteLock.html`,
      ],
      [
        "Java SE API: ReentrantReadWriteLock",
        `${API}/util/concurrent/locks/ReentrantReadWriteLock.html`,
      ],
    ],
  }),
  g({
    slug: "lock-conditions",
    topic: "Locks",
    d: "hard",
    title:
      "What is a `Condition` and how does it relate to `wait` and `notify`?",
    kw: ["Condition", "await", "signal", "signalAll", "Lock"],
    intent:
      "Checks that you know the explicit-lock equivalent of monitor signalling.",
    short:
      "A `Condition` is created from a `Lock` with `lock.newCondition()`, and it does for explicit locks what `wait`, `notify` and `notifyAll` do for the monitor of an object: `await()` releases the lock and waits, and `signal()` or `signalAll()` wakes waiting threads. The advantage is that one lock can have several conditions, such as `notFull` and `notEmpty` for a buffer, so you can wake only the threads that wait for that condition. As with `wait`, you must call `await` in a loop that re-checks the condition.",
    detail: [
      "The thread must hold the lock to call `await` or `signal`.",
      "`awaitNanos` and `await(time, unit)` wait for a limited time.",
      "`ArrayBlockingQueue` is built using this pattern.",
    ],
    ex: "A bounded buffer uses `notFull` and `notEmpty`, so that producers wake only consumers and consumers wake only producers.",
    code: [
      "A bounded buffer with two conditions",
      "class Buffer<T> {\n  private final Queue<T> items = new ArrayDeque<>();\n  private final int capacity = 10;\n  private final Lock lock = new ReentrantLock();\n  private final Condition notFull = lock.newCondition();\n  private final Condition notEmpty = lock.newCondition();\n\n  void put(T item) throws InterruptedException {\n    lock.lock();\n    try {\n      while (items.size() == capacity) notFull.await();\n      items.add(item);\n      notEmpty.signal();\n    } finally { lock.unlock(); }\n  }\n\n  T take() throws InterruptedException {\n    lock.lock();\n    try {\n      while (items.isEmpty()) notEmpty.await();\n      T item = items.remove();\n      notFull.signal();\n      return item;\n    } finally { lock.unlock(); }\n  }\n}",
      [
        "`put` waits on `notFull` while the buffer is full.",
        "After adding an item it signals `notEmpty` to wake a consumer.",
        "`take` does the reverse, and both use a `while` loop and unlock in `finally`.",
      ],
      "java",
    ],
    mistakes: [
      "Using `if` instead of `while` around `await`.",
      "Calling `await` without holding the lock.",
    ],
    follow: ["Why is a bounded buffer a good example of two conditions?"],
    points: [
      "Condition replaces wait/notify for explicit locks",
      "Several conditions per lock",
      "Always loop around await",
    ],
    notes:
      "`Condition.await()`/`signal()` = `wait()`/`notify()` for a `Lock`, with many conditions.",
    src: [
      ["Java SE API: Condition", `${API}/util/concurrent/locks/Condition.html`],
      ["The Java Tutorials: Lock Objects", `${C}/newlocks.html`],
    ],
  }),
  g({
    slug: "volatile-keyword",
    topic: "volatile",
    d: "medium",
    title: "What does the `volatile` keyword do?",
    kw: ["volatile", "visibility", "happens-before", "cache", "memory model"],
    intent:
      "Checks that you know what volatile guarantees and what it does not.",
    short:
      "`volatile` on a field guarantees visibility and ordering: a write to a volatile variable by one thread is visible to every thread that later reads it, and the reads and writes cannot be reordered around it in a way that breaks that rule. Without it, a thread may keep using a stale value from its cache or registers, so a flag set by one thread might never be seen by another. `volatile` does not make compound actions such as `count++` atomic, and it provides no mutual exclusion.",
    detail: [
      "It is a good fit for a simple flag, such as `volatile boolean running`, that one thread writes and others read.",
      "The rules are part of the Java Memory Model through the happens-before relationship.",
      "For atomic updates, use `AtomicInteger` or a lock.",
    ],
    ex: "A worker loop `while (running)` stops when another thread sets the `volatile boolean running` to `false`.",
    code: [
      "A stop flag",
      "class Worker implements Runnable {\n  private volatile boolean running = true;\n\n  public void run() {\n    while (running) {\n      // do a unit of work\n    }\n  }\n\n  void stop() {\n    running = false;\n  }\n}",
      [
        "`stop()` writes `false` from another thread.",
        "Because `running` is volatile, the loop sees the change and ends.",
        "Without `volatile`, the loop might never see the new value.",
      ],
      "java",
    ],
    mistakes: [
      "Using `volatile` for `count++`, which is still not atomic.",
      "Expecting `volatile` to protect a group of several variables that change together.",
    ],
    follow: ["How is volatile different from synchronized?"],
    points: [
      "Visibility and ordering",
      "Not atomic for compound actions",
      "Good for simple flags",
    ],
    notes: "`volatile` = visibility, not atomicity.",
    src: [
      ["The Java Tutorials: Memory Consistency Errors", `${C}/memconsist.html`],
      ["The Java Tutorials: Atomic Access", `${C}/atomic.html`],
    ],
  }),
  g({
    slug: "volatile-vs-synchronized",
    topic: "volatile",
    d: "medium",
    title: "What is the difference between `volatile` and `synchronized`?",
    kw: [
      "volatile",
      "synchronized",
      "atomicity",
      "mutual exclusion",
      "visibility",
    ],
    intent: "Checks that you separate visibility from mutual exclusion.",
    short:
      "`synchronized` gives mutual exclusion, so only one thread runs the protected code at a time, and it also gives visibility, because changes made before releasing the lock are seen by the next thread that acquires it. `volatile` gives only visibility and ordering for one variable. It never blocks a thread, but it cannot make a read-modify-write sequence safe. Use `volatile` for an independent flag or a safely published reference, and `synchronized`, a lock or an atomic class when several steps must happen as one.",
    detail: [
      "`synchronized` can block, and it can cause contention or deadlocks. `volatile` cannot.",
      "A volatile reference to an immutable object is a safe way to publish a new version of the data.",
      "Both establish a happens-before relationship in the Java Memory Model.",
    ],
    ex: "A shared configuration is replaced with a new immutable object through a `volatile` field, and readers always see the latest version.",
    mistakes: [
      "Using `volatile` where an operation needs atomicity.",
      "Thinking that `synchronized` only gives mutual exclusion and not visibility.",
    ],
    follow: ["When is volatile enough?"],
    points: [
      "synchronized: exclusion + visibility",
      "volatile: visibility only",
      "volatile fits flags and immutable snapshots",
    ],
    notes:
      "`volatile` = visibility. `synchronized` = visibility + mutual exclusion.",
    src: [
      ["The Java Tutorials: Synchronization", `${C}/sync.html`],
      ["The Java Tutorials: Memory Consistency Errors", `${C}/memconsist.html`],
    ],
  }),
  g({
    slug: "atomic-classes-and-cas",
    topic: "volatile",
    d: "hard",
    title: "How do `AtomicInteger` and compare-and-swap work?",
    kw: [
      "AtomicInteger",
      "compare-and-swap",
      "CAS",
      "lock-free",
      "incrementAndGet",
    ],
    intent: "Checks that you know lock-free atomic updates.",
    short:
      "The classes in `java.util.concurrent.atomic`, such as `AtomicInteger`, `AtomicLong` and `AtomicReference`, make single-variable updates atomic without locks. They use a hardware-level compare-and-swap (CAS): the update succeeds only if the variable still holds the expected old value, and otherwise it is retried with the new current value. So `incrementAndGet()` is safe for many threads and usually faster than a lock under low or moderate contention. They protect one variable, and not an invariant across several variables.",
    detail: [
      "`compareAndSet(expected, new)` returns `false` if another thread changed the value first.",
      "`LongAdder` scales better than `AtomicLong` for heavily contended counters.",
      "Because a CAS retry loop spins, very high contention can waste CPU.",
    ],
    ex: "A request counter is an `AtomicLong`, and every thread calls `incrementAndGet()` without a lock.",
    code: [
      "Atomic updates",
      'AtomicInteger counter = new AtomicInteger();\ncounter.incrementAndGet();\ncounter.addAndGet(5);\n\nboolean won = counter.compareAndSet(6, 100);\nSystem.out.println(won + " " + counter.get());',
      [
        "`incrementAndGet` and `addAndGet` are atomic.",
        "`compareAndSet(6, 100)` succeeds because the value is `6`.",
        "The output is `true 100`.",
      ],
      "java",
    ],
    mistakes: [
      "Using two atomic variables and assuming that they change together atomically.",
      "Doing `counter.set(counter.get() + 1)`, which is not atomic.",
    ],
    follow: ["What is the advantage of LongAdder?"],
    points: [
      "Atomic single-variable updates",
      "CAS: compare, then swap or retry",
      "Does not protect multi-variable invariants",
    ],
    notes:
      "Atomic classes use CAS. `incrementAndGet()` is atomic; `set(get()+1)` is not.",
    src: [
      ["The Java Tutorials: Atomic Variables", `${C}/atomicvars.html`],
      [
        "Java SE API: AtomicInteger",
        `${API}/util/concurrent/atomic/AtomicInteger.html`,
      ],
    ],
  }),
  g({
    slug: "completablefuture-basics",
    topic: "CompletableFuture",
    d: "medium",
    title: "What is `CompletableFuture` and how is it better than `Future`?",
    kw: [
      "CompletableFuture",
      "supplyAsync",
      "thenApply",
      "asynchronous",
      "callback",
    ],
    intent:
      "Checks that you can write non-blocking, composed asynchronous code.",
    short:
      "A plain `Future` can only be waited on with a blocking `get()`. A `CompletableFuture` can also be composed: you start work with `supplyAsync` or `runAsync`, which run on the common `ForkJoinPool` by default, or on an executor that you pass, and chain steps with methods such as `thenApply`, `thenAccept` and `thenCompose` that run when the previous step completes. This lets you describe a pipeline of asynchronous steps without blocking a thread to wait for each one.",
    detail: [
      "The methods ending in `Async` run the step on another thread.",
      "Pass your own executor for blocking work, so that you do not block the shared common pool.",
      "`join()` and `get()` block and are used at the very end, if at all.",
    ],
    ex: "A page loads a user's profile asynchronously, then maps it to a view model, without blocking the request thread meanwhile.",
    code: [
      "A small pipeline",
      'CompletableFuture<String> greeting = CompletableFuture\n    .supplyAsync(() -> "asha")\n    .thenApply(String::toUpperCase)\n    .thenApply(name -> "Hello, " + name);\n\nSystem.out.println(greeting.join());',
      [
        "`supplyAsync` runs the first step on a pool thread.",
        "Each `thenApply` transforms the result when it is ready.",
        "`join()` waits at the end. The output is `Hello, ASHA`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `get()` or `join()` inside every step, which makes the code blocking again.",
      "Running blocking I/O on the common pool.",
    ],
    follow: ["How is thenApply different from thenCompose?"],
    points: [
      "Composable asynchronous pipeline",
      "Common pool unless you pass an executor",
      "Block only at the end",
    ],
    notes:
      "`supplyAsync` → `thenApply` → `join()`; pass an executor for blocking work.",
    src: [
      [
        "Java SE API: CompletableFuture",
        `${API}/util/concurrent/CompletableFuture.html`,
      ],
      [
        "The Java Tutorials: High Level Concurrency Objects",
        `${C}/highlevel.html`,
      ],
    ],
  }),
  g({
    slug: "thenapply-thencompose-thencombine",
    topic: "CompletableFuture",
    d: "hard",
    title:
      "What is the difference between `thenApply`, `thenCompose` and `thenCombine`?",
    kw: ["thenApply", "thenCompose", "thenCombine", "flatMap", "chaining"],
    intent:
      "Checks that you can pick the right way to join asynchronous steps.",
    short:
      "`thenApply(fn)` transforms the result with a normal function, like `map`. `thenCompose(fn)` is for a function that itself returns a `CompletableFuture`, like `flatMap`, and it flattens the result so that you do not end up with a `CompletableFuture<CompletableFuture<T>>`. `thenCombine(other, fn)` waits for two independent futures and merges their results with a function. Use `thenCompose` for dependent asynchronous calls, and `thenCombine` for independent ones that can run in parallel.",
    detail: [
      "`thenAccept` consumes the result and returns `CompletableFuture<Void>`.",
      "Starting two futures first and combining them runs them in parallel.",
      "Choosing `thenApply` when the function returns a future is a frequent mistake.",
    ],
    ex: "Find the user by id (async), then find their orders (async, depends on the user) with `thenCompose`, while the product list loads in parallel and is combined with `thenCombine`.",
    code: [
      "Dependent and independent steps",
      'CompletableFuture<User> user = findUser(id);\n\nCompletableFuture<List<Order>> orders =\n    user.thenCompose(u -> findOrders(u.id()));      // depends on user\n\nCompletableFuture<String> summary =\n    orders.thenCombine(loadOffers(),                // independent future\n        (o, offers) -> o.size() + " orders, " + offers.size() + " offers");',
      [
        "`findOrders` returns a future, so `thenCompose` flattens it.",
        "`loadOffers()` does not depend on the others, so it runs in parallel.",
        "`thenCombine` merges the two results with a function.",
      ],
      "java",
    ],
    mistakes: [
      "Using `thenApply` with a function that returns a future, which gives a nested future.",
      "Starting the second future only after the first completes when they are independent.",
    ],
    follow: ["How do you wait for many futures?"],
    points: [
      "thenApply: map",
      "thenCompose: flatMap for dependent futures",
      "thenCombine: merge two independent futures",
    ],
    notes:
      "`thenApply` = map, `thenCompose` = flatMap, `thenCombine` = merge two.",
    src: [
      [
        "Java SE API: CompletableFuture",
        `${API}/util/concurrent/CompletableFuture.html`,
      ],
      [
        "Java SE API: CompletionStage",
        `${API}/util/concurrent/CompletionStage.html`,
      ],
    ],
  }),
  g({
    slug: "completablefuture-errors",
    topic: "CompletableFuture",
    d: "hard",
    title: "How do you handle errors and timeouts in a `CompletableFuture`?",
    kw: [
      "exceptionally",
      "handle",
      "whenComplete",
      "orTimeout",
      "CompletionException",
    ],
    intent: "Checks that you do not lose failures in asynchronous code.",
    short:
      "If a step throws, the future completes exceptionally and the failure passes to the later steps, which are skipped. `exceptionally(fn)` turns an exception into a fallback value. `handle((value, error) -> ...)` runs in both cases and returns a result, and `whenComplete` observes the outcome without changing it. `orTimeout(time, unit)` and `completeOnTimeout(value, time, unit)`, added in Java 9, limit how long you wait. When you call `join()`, a failure is wrapped in an unchecked `CompletionException`, and `get()` wraps it in a checked `ExecutionException`.",
    detail: [
      "The original exception is available through `getCause()`.",
      "An exception that no one handles is silent until you call `join` or `get`, so always attach a handler.",
      "Handle errors as close as possible to where a sensible fallback exists.",
    ],
    ex: "A price lookup times out after 2 seconds, and the page falls back to the cached price.",
    code: [
      "Fallback and timeout",
      'CompletableFuture<Double> price = fetchPrice(id)\n    .orTimeout(2, TimeUnit.SECONDS)\n    .exceptionally(ex -> {\n      System.out.println("fallback because " + ex);\n      return cachedPrice(id);\n    });\n\nSystem.out.println(price.join());',
      [
        "`orTimeout` fails the future if it takes more than 2 seconds.",
        "`exceptionally` converts the failure into a cached value.",
        "`join` then returns a value instead of throwing.",
      ],
      "java",
    ],
    mistakes: [
      "Never attaching an error handler, so that failures go unnoticed.",
      "Catching `ExecutionException` and treating it as the real error, instead of looking at its cause.",
    ],
    follow: ["What is the difference between join and get?"],
    points: [
      "Failure skips later steps",
      "exceptionally, handle, whenComplete",
      "join: CompletionException, get: ExecutionException",
    ],
    notes:
      "`exceptionally` for a fallback, `handle` for both outcomes, `orTimeout` for a limit.",
    src: [
      [
        "Java SE API: CompletableFuture",
        `${API}/util/concurrent/CompletableFuture.html`,
      ],
      [
        "Java SE API: CompletionException",
        `${API}/util/concurrent/CompletionException.html`,
      ],
    ],
  }),
  g({
    slug: "completablefuture-allof",
    topic: "CompletableFuture",
    d: "medium",
    title:
      "How do you run several asynchronous calls in parallel and wait for all of them?",
    kw: ["allOf", "anyOf", "parallel", "join", "CompletableFuture"],
    intent: "Checks that you can fan out calls and collect the results.",
    short:
      "Start all the futures first, so that they run at the same time, and then wait for them with `CompletableFuture.allOf(f1, f2, ...)`, which completes when every one of them has completed. It returns a `CompletableFuture<Void>`, so you read the individual results from the original futures with `join()` once `allOf` is done. `anyOf` completes as soon as the first one finishes. If one of the futures fails, `allOf` also completes exceptionally.",
    detail: [
      "Calling `join()` on each future in a loop right after creating them is fine, because they are already running.",
      "Creating a future and joining it before creating the next one makes the calls sequential.",
      "Use your own executor with a suitable size when the calls are blocking.",
    ],
    ex: "A dashboard calls three services at the same time and shows the page when all of them have answered.",
    code: [
      "Fan out and collect",
      'CompletableFuture<String> a = CompletableFuture.supplyAsync(() -> "orders");\nCompletableFuture<String> b = CompletableFuture.supplyAsync(() -> "profile");\nCompletableFuture<String> c = CompletableFuture.supplyAsync(() -> "offers");\n\nCompletableFuture.allOf(a, b, c).join();\nSystem.out.println(a.join() + ", " + b.join() + ", " + c.join());',
      [
        "All three futures start immediately, so they overlap in time.",
        "`allOf(...).join()` waits until all have finished.",
        "Each result is then read from its own future.",
      ],
      "java",
    ],
    mistakes: [
      "Joining each future before starting the next one, and losing the parallelism.",
      "Expecting `allOf` to return the combined values.",
    ],
    follow: ["What happens if one of the futures fails?"],
    points: [
      "Start first, wait later",
      "allOf returns Void",
      "anyOf returns the first result",
    ],
    notes:
      "Start all futures, then `allOf(...).join()`, then read each result.",
    src: [
      [
        "Java SE API: CompletableFuture.allOf",
        `${API}/util/concurrent/CompletableFuture.html#allOf(java.util.concurrent.CompletableFuture...)`,
      ],
      [
        "Java SE API: CompletableFuture",
        `${API}/util/concurrent/CompletableFuture.html`,
      ],
    ],
  }),
  g({
    slug: "countdownlatch-cyclicbarrier",
    topic: "Concurrent utilities",
    d: "medium",
    title:
      "What is the difference between `CountDownLatch` and `CyclicBarrier`?",
    kw: [
      "CountDownLatch",
      "CyclicBarrier",
      "await",
      "countDown",
      "synchronizer",
    ],
    intent: "Checks that you know two common coordination tools.",
    short:
      "A `CountDownLatch` starts with a count. Threads call `countDown()` when they finish a step, and other threads call `await()` and wait until the count reaches zero. It is single-use, and it is for one or more threads to wait for a set of events, such as the start of a service after all its parts are ready. A `CyclicBarrier` makes a fixed group of threads wait for each other: each calls `await()`, and when the last one arrives, all of them are released together. It can be reused for the next round, which suits phased computations.",
    detail: [
      "With a latch, the threads that count down and the threads that wait can be different ones.",
      "A barrier can run an optional action when all the threads have arrived.",
      "`Phaser` is a more flexible alternative with a changing number of parties.",
    ],
    ex: "A main thread waits on a latch of 3 until three loader threads have each finished loading their data.",
    code: [
      "A latch for three workers",
      'CountDownLatch done = new CountDownLatch(3);\n\nfor (int i = 1; i <= 3; i++) {\n  int id = i;\n  new Thread(() -> {\n    System.out.println("worker " + id + " finished");\n    done.countDown();\n  }).start();\n}\n\ndone.await();\nSystem.out.println("all workers finished");',
      [
        "The latch starts at 3.",
        "Each worker counts down once.",
        "`await` returns only after the count reaches zero.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to reuse a `CountDownLatch` after it reached zero.",
      "Forgetting to call `countDown()` when a worker fails, so that `await()` never returns.",
    ],
    follow: ["How do you make sure countDown is always called?"],
    points: [
      "Latch: one-time, wait for events",
      "Barrier: reusable, threads wait for each other",
      "Call countDown in finally",
    ],
    notes:
      "Latch = wait until N events happen (once). Barrier = N threads meet, repeatedly.",
    src: [
      [
        "Java SE API: CountDownLatch",
        `${API}/util/concurrent/CountDownLatch.html`,
      ],
      [
        "Java SE API: CyclicBarrier",
        `${API}/util/concurrent/CyclicBarrier.html`,
      ],
    ],
  }),
  g({
    slug: "semaphore",
    topic: "Concurrent utilities",
    d: "medium",
    title: "What is a `Semaphore` and when would you use it?",
    kw: ["Semaphore", "permits", "acquire", "release", "limit concurrency"],
    intent: "Checks that you can limit access to a resource.",
    short:
      "A `Semaphore` holds a number of permits. A thread calls `acquire()` to take a permit and waits if none is available, and calls `release()` to return it. It limits how many threads can use a resource at the same time, such as a pool of database connections or a rate-limited external service. With one permit it works like a lock, except that, unlike a lock, a different thread can release it. Always release in a `finally` block, so the permit is returned even when the work fails.",
    detail: [
      "`tryAcquire()` returns at once with `false` if there is no permit, and can take a timeout.",
      "A fair semaphore hands out permits in the order the threads asked.",
      "A semaphore does not check which thread releases a permit.",
    ],
    ex: "At most 5 threads may call a partner API at the same time, so a semaphore of 5 permits guards the call.",
    code: [
      "Limiting concurrent calls",
      "private final Semaphore permits = new Semaphore(5);\n\nString callPartner() throws InterruptedException {\n  permits.acquire();\n  try {\n    return partnerClient.fetch();\n  } finally {\n    permits.release();\n  }\n}",
      [
        "`acquire` takes one of the five permits, or waits.",
        "The call runs while the permit is held.",
        "`release` in `finally` always returns the permit.",
      ],
      "java",
    ],
    mistakes: [
      "Not releasing the permit when an exception occurs, which slowly blocks everything.",
      "Releasing more permits than were acquired, which increases the limit.",
    ],
    follow: [
      "What is the difference between a semaphore with one permit and a lock?",
    ],
    points: [
      "Counts permits",
      "Limits concurrent users of a resource",
      "Release in finally",
    ],
    notes:
      "`Semaphore(n)`: `acquire()` / `release()` in `finally` to limit concurrency.",
    src: [
      ["Java SE API: Semaphore", `${API}/util/concurrent/Semaphore.html`],
      [
        "The Java Tutorials: High Level Concurrency Objects",
        `${C}/highlevel.html`,
      ],
    ],
  }),
  g({
    slug: "threadlocal",
    topic: "Concurrent utilities",
    d: "hard",
    title: "What is `ThreadLocal`, and what is its risk in a thread pool?",
    kw: [
      "ThreadLocal",
      "per-thread data",
      "remove",
      "memory leak",
      "thread pool",
    ],
    intent:
      "Checks that you know where per-thread state is safe and where it leaks.",
    short:
      "A `ThreadLocal<T>` gives each thread its own independent copy of a variable, so threads do not share it and no locking is needed. It is used for per-thread context, such as a request id, a user, or a non-thread-safe formatter. In a thread pool, threads are reused, so a value that is not removed stays attached to the thread and can leak into the next task, which shows wrong data or keeps memory alive. The rule is to call `remove()` in a `finally` block when the task is done.",
    detail: [
      "`ThreadLocal.withInitial(supplier)` sets a default value for each thread.",
      "Values are not passed to child threads unless you use `InheritableThreadLocal`.",
      "With virtual threads, many short-lived threads can make heavy `ThreadLocal` use expensive.",
    ],
    ex: "A web filter stores the current user id in a `ThreadLocal` at the start of a request and removes it at the end.",
    code: [
      "Set and always remove",
      "private static final ThreadLocal<String> REQUEST_ID = new ThreadLocal<>();\n\nvoid handle(String id, Runnable work) {\n  REQUEST_ID.set(id);\n  try {\n    work.run();\n  } finally {\n    REQUEST_ID.remove();\n  }\n}",
      [
        "The id is stored for the current thread only.",
        "The work can read it anywhere on this thread.",
        "`remove()` in `finally` prevents leaking into the next task on a pooled thread.",
      ],
      "java",
    ],
    mistakes: [
      "Never calling `remove()` in a pool, so one request sees another request's data.",
      "Using `ThreadLocal` as a hidden global variable instead of passing arguments.",
    ],
    follow: ["Why is a leftover ThreadLocal value dangerous in a pool?"],
    points: [
      "One value per thread",
      "Pooled threads are reused",
      "Always remove in finally",
    ],
    notes:
      "`ThreadLocal`: per-thread value; call `remove()` in `finally` on pooled threads.",
    src: [
      ["Java SE API: ThreadLocal", `${API}/lang/ThreadLocal.html`],
      ["The Java Tutorials: Thread Objects", `${C}/threads.html`],
    ],
  }),
  g({
    slug: "thread-safe-singleton",
    topic: "volatile",
    d: "hard",
    title:
      "How do you write a thread-safe singleton, and why does double-checked locking need `volatile`?",
    kw: [
      "singleton",
      "double-checked locking",
      "volatile",
      "holder idiom",
      "enum singleton",
    ],
    intent:
      "Checks that you can connect visibility, safe publication and a well-known pattern.",
    short:
      "The simplest thread-safe singletons use class initialisation, which the JVM guarantees to run once: an `enum` with one instance, or the holder idiom, where a private static nested class holds the instance and is loaded only on first use. Double-checked locking checks the field, takes a lock, checks again and then creates the object, to avoid locking on every call. It works only if the field is `volatile`, because without it another thread could see a non-null reference to an object whose construction is not yet fully visible.",
    detail: [
      "The holder idiom is lazy and needs no explicit synchronisation.",
      "An `enum` singleton is also safe against reflection and serialisation tricks.",
      "A dependency-injection framework often makes a manual singleton unnecessary.",
    ],
    ex: "A configuration object that must be created once is held in a holder class, and created the first time that `Config.get()` is called.",
    code: [
      "Holder idiom and double-checked locking",
      "class Config {\n  private Config() {}\n\n  private static class Holder {\n    static final Config INSTANCE = new Config();\n  }\n  static Config get() { return Holder.INSTANCE; }\n}\n\nclass Cache {\n  private static volatile Cache instance;\n  static Cache get() {\n    if (instance == null) {\n      synchronized (Cache.class) {\n        if (instance == null) {\n          instance = new Cache();\n        }\n      }\n    }\n    return instance;\n  }\n}",
      [
        "`Config` relies on class loading, so the instance is created once and safely.",
        "`Cache` checks twice, so the lock is taken only for the first creation.",
        "`volatile` makes sure that the constructed object is visible to every thread.",
      ],
      "java",
    ],
    mistakes: [
      "Double-checked locking without `volatile`.",
      "A lazy `if (instance == null)` check with no synchronisation at all.",
    ],
    follow: ["Why is an enum a good singleton?"],
    points: [
      "Enum or holder idiom is simplest",
      "Double-checked locking needs volatile",
      "Class initialisation is thread-safe",
    ],
    notes:
      "Prefer the holder idiom or an enum. If you use double-checked locking, the field must be `volatile`.",
    src: [
      [
        "The Java Tutorials: Enum Types",
        "https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html",
      ],
      ["The Java Tutorials: Memory Consistency Errors", `${C}/memconsist.html`],
    ],
  }),
])
