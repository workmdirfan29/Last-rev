import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "volatile-and-atomics",
  title: "volatile, the memory model and atomic classes",
  topic: "volatile",
  minutes: 60,
  overview:
    "Understand visibility, what volatile guarantees and what it does not, and use atomic classes for lock-free updates.",
  objectives: [
    "Explain visibility problems and happens-before",
    "Use volatile for flags and safe publication",
    "Use AtomicInteger and compareAndSet",
  ],
  prerequisites: ["lesson.java-multithreading.locks-and-conditions"],
  sections: [
    {
      kind: "explain",
      heading: "Visibility",
      body: [
        "Without synchronisation, a thread may keep using a **stale value** from a cache or a register, so a change made by one thread may not be seen by another. The **Java Memory Model** defines when a write is guaranteed to be visible to a read, through the **happens-before** relationship. Locks, `volatile` variables, `Thread.start` and `Thread.join` all create such relationships.",
        "`volatile` on a field guarantees that a **write** to it is visible to every thread that **later reads** it, and that the reads and writes cannot be reordered around it in a way that breaks this. It is a good fit for a simple **flag** that one thread writes and others read. It never blocks.",
      ],
    },
    {
      kind: "code",
      heading: "A stop flag",
      example: {
        title: "volatile",
        language: "java",
        code: 'public class Main {\n  static class Worker implements Runnable {\n    private volatile boolean running = true;\n    long loops = 0;\n\n    public void run() {\n      while (running) {\n        loops++;\n      }\n    }\n\n    void stop() {\n      running = false;\n    }\n  }\n\n  public static void main(String[] args) throws Exception {\n    Worker w = new Worker();\n    Thread t = new Thread(w);\n    t.start();\n    Thread.sleep(50);\n    w.stop();\n    t.join();\n    System.out.println("stopped " + (w.loops > 0));\n  }\n}',
        walkthrough: [
          "`stop()` writes `false` from another thread.",
          "Because `running` is volatile, the loop sees the change and ends.",
          "Without `volatile`, the loop might never see the new value. The output is `stopped true`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "volatile is not enough for compound actions",
      body: [
        "`volatile` gives **visibility**, not **atomicity** and not mutual exclusion. `count++` on a volatile field is still read, add and write, so updates can be lost. It also cannot protect a group of variables that must change together. Use `synchronized`, a lock or an atomic class for those.",
        "Compared with `synchronized`: `synchronized` gives mutual exclusion **and** visibility and can block. `volatile` gives visibility only and never blocks. A volatile reference to an **immutable** object is a safe way to publish a new version of the data.",
      ],
    },
    {
      kind: "explain",
      heading: "Atomic classes and CAS",
      body: [
        "The classes in `java.util.concurrent.atomic`, such as `AtomicInteger`, `AtomicLong` and `AtomicReference`, make single-variable updates atomic **without locks**. They use a hardware-level **compare-and-swap (CAS)**: the update succeeds only if the variable still holds the expected old value, and otherwise is retried. `incrementAndGet()` is safe for many threads and usually faster than a lock under low or moderate contention.",
        "`compareAndSet(expected, new)` returns `false` if another thread changed the value first. They protect **one variable**, not an invariant across several. `LongAdder` scales better than `AtomicLong` for heavily contended counters.",
      ],
    },
    {
      kind: "code",
      heading: "Atomic updates",
      example: {
        title: "AtomicInteger",
        language: "java",
        code: 'AtomicInteger counter = new AtomicInteger();\n    Runnable work = () -> {\n      for (int i = 0; i < 50_000; i++) counter.incrementAndGet();\n    };\n    Thread a = new Thread(work);\n    Thread b = new Thread(work);\n    a.start();\n    b.start();\n    a.join();\n    b.join();\n    System.out.println(counter.get());\n    System.out.println(counter.compareAndSet(100_000, 7) + " " + counter.get());\n    System.out.println(counter.compareAndSet(100_000, 8) + " " + counter.get());',
        walkthrough: [
          "`incrementAndGet` is atomic, so two threads never lose an update: the total is `100000`.",
          "The first `compareAndSet` succeeds, because the value is the expected `100000`, and sets it to `7`.",
          "The second fails, because the value is now `7`, and returns `false`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using volatile for `count++`.",
          fix: "Use `AtomicInteger` or a lock.",
        },
        {
          mistake: "Expecting volatile to protect several variables together.",
          fix: "Use a lock, or put them in one immutable object.",
        },
        {
          mistake: "Using `set(get() + 1)` on an atomic.",
          fix: "Use `incrementAndGet`, which is one atomic step.",
        },
        {
          mistake:
            "Sharing a mutable object through a volatile reference and changing it.",
          fix: "Volatile covers the reference, not the object.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A configuration reload",
      scenario:
        "A service reloads its configuration file every minute, and many request threads read it.",
      body: [
        "Keep the configuration in an immutable object, and hold it in a `volatile` field. The reload thread builds a new object and assigns it. Readers always see a complete, consistent configuration, and never block.",
        "No lock is needed, because the object itself never changes.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "vol-guarantee",
      prompt: "What does volatile guarantee?",
      options: [
        "Visibility of writes and ordering",
        "Atomicity of count++",
        "Mutual exclusion",
      ],
      answer: 0,
      explanation:
        "It makes writes visible, but compound actions still need atomicity.",
    },
    {
      type: "single",
      id: "vol-flag",
      prompt: "Which is a good use of volatile?",
      options: [
        "A stop flag written by one thread and read by others",
        "A counter incremented by many threads",
        "Two fields that must change together",
      ],
      answer: 0,
      explanation: "A simple flag needs visibility only.",
    },
    {
      type: "truefalse",
      id: "vol-atomic",
      statement:
        "`AtomicInteger.incrementAndGet()` needs an extra lock to be safe.",
      answer: false,
      explanation: "It is atomic by itself, using compare-and-swap.",
    },
    {
      type: "blank",
      id: "vol-cas",
      prompt:
        "`compareAndSet(expected, newValue)` returns ___ if another thread changed the value first.",
      answer: "false",
      explanation: "Then nothing is written, and the caller can retry.",
    },
  ],
  assignment: {
    title: "Volatile and atomics",
    task: [
      "Show that a non-volatile stop flag may not stop a loop (use a busy loop and the JIT warm-up), and fix it with volatile.",
      "Show that a volatile counter loses updates, and fix it with AtomicInteger.",
    ],
    checklist: [
      "I explained visibility versus atomicity",
      "The atomic version always gives the same total",
      "I can name one safe use of volatile",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "vol-ex",
      title: "A lock-free maximum",
      task: [
        "Write `static void updateMax(AtomicInteger max, int value)` that sets the atomic to `value` only if it is larger, using a `compareAndSet` loop.",
      ],
      language: "java",
      starter:
        "import java.util.concurrent.atomic.*;\n\npublic class MaxDemo {\n  // your code\n}",
      solution:
        "import java.util.concurrent.atomic.*;\n\npublic class MaxDemo {\n  static void updateMax(AtomicInteger max, int value) {\n    int current = max.get();\n    while (value > current && !max.compareAndSet(current, value)) {\n      current = max.get();\n    }\n  }\n\n  public static void main(String[] args) {\n    AtomicInteger max = new AtomicInteger(5);\n    updateMax(max, 9);\n    updateMax(max, 3);\n    System.out.println(max.get());\n  }\n}",
      hints: [
        "Retry while the CAS fails, and stop when the value is no longer larger.",
      ],
      checklist: [
        "The loop retries on a failed CAS",
        "A smaller value changes nothing",
        "No lock is used",
      ],
    },
  ],
  revisionNotes: [
    "Visibility: writes may not be seen without synchronisation; the memory model defines happens-before",
    "volatile: visibility and ordering, not atomicity",
    "Atomic classes use CAS for single-variable lock-free updates",
    "volatile reference to an immutable object = safe publication",
  ],
  resources: [
    {
      label: "The Java Tutorials: Memory Consistency Errors",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/memconsist.html",
    },
    {
      label: "The Java Tutorials: Atomic Variables",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/atomicvars.html",
    },
    {
      label: "Java SE API: AtomicInteger",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html",
    },
  ],
})
