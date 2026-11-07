import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "synchronized-and-races",
  title: "Race conditions, synchronized, wait/notify and deadlock",
  topic: "synchronized",
  minutes: 80,
  overview:
    "See why shared mutable data is dangerous, protect it with synchronized, signal between threads with wait and notify, and avoid deadlock.",
  objectives: [
    "Show a race condition and fix it with synchronized",
    "Explain intrinsic locks, reentrancy and which lock each form uses",
    "Use wait and notifyAll correctly, and prevent deadlock with lock ordering",
  ],
  prerequisites: ["lesson.java-multithreading.threads-and-lifecycle"],
  sections: [
    {
      kind: "explain",
      heading: "A race condition",
      body: [
        "A **race condition** happens when the result depends on the timing of threads that use shared data without coordination. The classic example is `count++` on a shared field. It looks like one step, but it is three: read the value, add one, write it back. If two threads read the same value before either writes, one update is **lost**.",
        "Races depend on timing, so a program may pass many tests and fail in production. Read-modify-write and check-then-act sequences are the typical cases. The safest data is **immutable**, or **confined** to one thread.",
      ],
    },
    {
      kind: "code",
      heading: "A lost update and the fix",
      example: {
        title: "Counter",
        language: "java",
        code: 'public class Main {\n  static int unsafe = 0;\n  static int safe = 0;\n  static final Object lock = new Object();\n\n  public static void main(String[] args) throws Exception {\n    Runnable work = () -> {\n      for (int i = 0; i < 100_000; i++) {\n        unsafe++;\n        synchronized (lock) {\n          safe++;\n        }\n      }\n    };\n    Thread a = new Thread(work);\n    Thread b = new Thread(work);\n    a.start();\n    b.start();\n    a.join();\n    b.join();\n    System.out.println(safe + " " + (unsafe <= 200_000));\n  }\n}',
        walkthrough: [
          "Both threads increase both counters 100,000 times.",
          "`unsafe++` is not atomic, so some updates are lost, and its final value is usually below `200000`.",
          "The `synchronized` block lets one thread at a time into the increment, so `safe` is always `200000`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Intrinsic locks",
      body: [
        "Every Java object has an **intrinsic lock**, or monitor. A `synchronized` **instance method** locks `this`. A `static synchronized` method locks the `Class` object. A `synchronized (obj) { ... }` **block** locks the object that you name, and only for the code in the block. Only one thread at a time can hold a given lock, and the others wait in the BLOCKED state.",
        "The lock is released automatically when the block or method ends, even through an exception. A thread that already holds a lock can enter other `synchronized` code on the same lock: this is **reentrancy**. Prefer **small blocks** on a **private lock object**, so outside code cannot take your lock and the critical section stays short. Two threads using different lock objects do not block each other.",
      ],
    },
    {
      kind: "explain",
      heading: "wait and notify",
      body: [
        "`wait()`, `notify()` and `notifyAll()` are methods of `Object`, and a thread must hold the object's monitor to call them. `wait()` **releases** the monitor and sleeps until another thread calls `notify` or `notifyAll` on the same object. Always call `wait()` inside a **`while` loop** that checks the condition, because a thread can wake up spuriously, or the condition can change again before it runs.",
        "`notifyAll` is the safer choice when different kinds of threads wait on one object. In new code, a `BlockingQueue` or a `Condition` is usually easier than raw `wait` and `notify`.",
      ],
    },
    {
      kind: "code",
      heading: "A guarded handoff",
      example: {
        title: "wait in a loop",
        language: "java",
        code: 'public class Main {\n  private static final Object lock = new Object();\n  private static String message = null;\n\n  public static void main(String[] args) throws Exception {\n    Thread consumer = new Thread(() -> {\n      synchronized (lock) {\n        while (message == null) {\n          try {\n            lock.wait();\n          } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n            return;\n          }\n        }\n        System.out.println("got " + message);\n      }\n    });\n    consumer.start();\n    Thread.sleep(50);\n    synchronized (lock) {\n      message = "hello";\n      lock.notifyAll();\n    }\n    consumer.join();\n  }\n}',
        walkthrough: [
          "The consumer holds the monitor, and waits while `message` is `null`. `wait()` releases the monitor, so the producer can enter.",
          "The producer sets the message and calls `notifyAll()`.",
          "The `while` loop checks the condition again after waking up. The output is `got hello`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Deadlock",
      body: [
        "A **deadlock** happens when threads wait for each other forever: thread A holds lock 1 and waits for lock 2, while thread B holds lock 2 and waits for lock 1. It needs mutual exclusion, hold-and-wait, no preemption and a circular wait together. You prevent it by always taking locks in the **same global order**, holding fewer locks for less time, and using `tryLock` with a timeout. A thread dump reports deadlocks it finds.",
        "Calling unknown code, such as a callback, while holding a lock is a common cause. Related problems are **starvation**, where a thread never gets its turn, and **livelock**, where threads keep reacting to each other without progress.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Assuming `count++` is atomic.",
          fix: "Use `synchronized`, a lock or an `AtomicInteger`.",
        },
        {
          mistake: "Synchronising on different objects in different methods.",
          fix: "Use one lock for one piece of data.",
        },
        {
          mistake: "Using `if` instead of `while` around `wait()`.",
          fix: "Always loop on the condition.",
        },
        {
          mistake: "Taking two locks in different orders in different places.",
          fix: "Fix a global order, for example by id.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A bank transfer",
      scenario:
        "Two accounts may be changed by two transfers in opposite directions at the same time.",
      body: [
        "Lock the account with the lower id first, then the other, in every transfer. All threads then use the same order, so a circular wait cannot form. Keep the code inside the locks short, and do not call other services while holding them.",
        "Without the rule, two opposite transfers can freeze each other.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "sync-counter",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "AtomicInteger a = new AtomicInteger();\nThread t = new Thread(() -> { for (int i = 0; i < 1000; i++) a.incrementAndGet(); });\nt.start();\nt.join();\nSystem.out.println(a.get());",
      },
      options: ["1000", "0", "Depends on timing"],
      answer: 0,
      explanation:
        "`join` waits for the thread, and the atomic increments are never lost.",
    },
    {
      type: "single",
      id: "sync-lock",
      prompt: "Which lock does a `static synchronized` method use?",
      options: ["The Class object", "this", "No lock"],
      answer: 0,
      explanation:
        "A static method belongs to the class, so it locks the `Class` object.",
    },
    {
      type: "truefalse",
      id: "sync-wait-lock",
      statement: "`wait()` releases the monitor while it waits.",
      answer: true,
      explanation:
        "That is why another thread can enter the `synchronized` block and call `notify`.",
    },
    {
      type: "single",
      id: "sync-deadlock",
      prompt: "How do you prevent a deadlock between two locks?",
      options: [
        "Always acquire them in the same order",
        "Use more threads",
        "Use sleep",
      ],
      answer: 0,
      explanation: "A global lock order removes the circular wait.",
    },
  ],
  assignment: {
    title: "Break and fix it",
    task: [
      "Write a program that loses updates on a shared counter, then fix it with `synchronized`, then with `AtomicInteger`.",
      "Write two threads that deadlock on purpose with two locks, and fix them with lock ordering.",
    ],
    checklist: [
      "I reproduced a lost update",
      "The deadlock is gone with ordering",
      "I used a private lock object",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "sync-ex",
      title: "A thread-safe counter",
      task: [
        "Write `class SafeCounter` with `increment()` and `get()` that is safe for many threads, using `synchronized` methods. Test with two threads.",
      ],
      language: "java",
      starter: "public class SafeCounterDemo {\n  // your code\n}",
      solution:
        "public class SafeCounterDemo {\n  static class SafeCounter {\n    private int value;\n\n    synchronized void increment() {\n      value++;\n    }\n\n    synchronized int get() {\n      return value;\n    }\n  }\n\n  public static void main(String[] args) throws InterruptedException {\n    SafeCounter c = new SafeCounter();\n    Runnable r = () -> {\n      for (int i = 0; i < 10_000; i++) c.increment();\n    };\n    Thread a = new Thread(r);\n    Thread b = new Thread(r);\n    a.start();\n    b.start();\n    a.join();\n    b.join();\n    System.out.println(c.get());\n  }\n}",
      hints: [
        "Both methods use the same lock, `this`, so reads see the writes.",
      ],
      checklist: [
        "Both methods are synchronized",
        "The result is 20000",
        "The field is private",
      ],
    },
  ],
  revisionNotes: [
    "`count++` is read-modify-write: not atomic",
    "`synchronized`: method (this), static method (Class), block (any object); small blocks on a private lock",
    "wait/notify: hold the monitor, wait in a while loop, prefer notifyAll",
    "Deadlock: circular wait; fix with lock ordering and timeouts",
  ],
  resources: [
    {
      label: "The Java Tutorials: Synchronization",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html",
    },
    {
      label: "The Java Tutorials: Guarded Blocks",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/guardmeth.html",
    },
    {
      label: "The Java Tutorials: Deadlock",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html",
    },
  ],
})
