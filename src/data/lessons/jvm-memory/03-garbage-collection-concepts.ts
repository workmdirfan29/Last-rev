import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jvm-memory", {
  slug: "garbage-collection-concepts",
  title: "Garbage collection: reachability, generations and references",
  topic: "Garbage collection",
  minutes: 55,
  overview:
    "Learn how the JVM decides that an object is garbage, how minor and full collections differ, and how reference types change what can be freed.",
  objectives: [
    "Explain reachability and GC roots",
    "Describe minor, major and full collections and stop-the-world pauses",
    "Use weak and soft references correctly and avoid finalize and System.gc",
  ],
  prerequisites: ["lesson.jvm-memory.heap-stack-and-metaspace"],
  sections: [
    {
      kind: "explain",
      heading: "Reachability",
      body: [
        "**Garbage collection** automatically reclaims the heap memory of objects that the program can no longer use. The JVM does not count references. It treats an object as garbage when it is **unreachable**: no chain of references leads to it from a **GC root**. Roots include the local variables and parameters on the stacks of live threads, the static fields of loaded classes, and references that the JVM or native code holds.",
        "The collector traces from the roots and reclaims everything else. This also handles **cycles**: two objects that refer only to each other are still unreachable. You cannot free an object yourself. You can only make it unreachable, for example by letting it go out of scope or setting a reference to `null`.",
      ],
    },
    {
      kind: "explain",
      heading: "Minor, major and full collections",
      body: [
        "A **minor** collection cleans only the **young generation**. It is frequent and usually short. A **major** or old collection cleans the old generation, and a **full** collection cleans the whole heap, sometimes including class metadata. They take longer. During some phases, all application threads must stop. This is a **stop-the-world pause**. Modern collectors do much of their work concurrently to keep pauses short, but some pauses remain, and long or frequent ones appear as **latency spikes**.",
        "**Throughput** is the share of time spent running the application, and **latency** is the length of the pauses. Collectors trade between the two. You see what the collector does with GC logging, such as `-Xlog:gc`.",
      ],
    },
    {
      kind: "explain",
      heading: "Reference types",
      body: [
        "A **strong** reference, the normal kind, keeps its object alive. A `SoftReference` is cleared by the collector only when memory is low, which suits memory-sensitive caches. A `WeakReference` does **not** keep its object alive: it is cleared once the object is only weakly reachable, which `WeakHashMap` uses. A `PhantomReference` always returns `null` from `get()`, and, with a `ReferenceQueue`, tells you that an object was collected.",
        "`System.gc()` is only a **hint**. The JVM may run it or ignore it, and calling it in production is usually a bad idea because a full collection can pause the application. `finalize()` is **deprecated** for removal, because it is unpredictable and slow. Use try-with-resources to release resources, and `Cleaner` for last-resort cleanup.",
      ],
    },
    {
      kind: "code",
      heading: "A weak reference",
      example: {
        title: "Reachability in code",
        language: "java",
        code: "Object payload = new Object();\n    WeakReference<Object> weak = new WeakReference<>(payload);\n    System.out.println(weak.get() != null);\n    payload = null;\n    for (int i = 0; i < 20 && weak.get() != null; i++) {\n      System.gc();\n      Thread.sleep(20);\n    }\n    System.out.println(weak.get() == null);",
        walkthrough: [
          "While `payload` is strongly reachable, the weak reference returns the object.",
          "After `payload = null`, only the weak reference remains, so the object can be collected.",
          "`System.gc()` is only a hint, so the code asks a few times. The output is `true` and `true`, but never rely on a collection at a given moment.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Believing that an object is freed when it goes out of scope.",
          fix: "It is freed at some later collection, once it is unreachable.",
        },
        {
          mistake: "Saying that reference cycles prevent collection.",
          fix: "Tracing from roots handles cycles.",
        },
        {
          mistake: "Calling `System.gc()` to fix memory problems.",
          fix: "Find why objects stay reachable.",
        },
        {
          mistake: "Closing files in `finalize`.",
          fix: "Use try-with-resources.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A cache of previews",
      scenario:
        "A viewer caches image previews, and they should not use memory that the application needs elsewhere.",
      body: [
        "Hold the previews through soft references, so the JVM can free them under memory pressure. For a cache keyed by objects with their own life cycle, a `WeakHashMap` removes entries when the key is no longer used.",
        "A size-limited cache library is usually a better choice for a precise limit.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "gc-unreachable",
      prompt: "When can an object be garbage collected?",
      options: [
        "When it is unreachable from every GC root",
        "When its variable is set to a new value",
        "Immediately after a method returns",
      ],
      answer: 0,
      explanation: "Reachability, not reference counting, decides.",
    },
    {
      type: "single",
      id: "gc-minor",
      prompt: "Which collection cleans only the young generation?",
      options: ["Minor", "Full", "Major"],
      answer: 0,
      explanation: "Minor collections are frequent and short.",
    },
    {
      type: "truefalse",
      id: "gc-cycle",
      statement:
        "Two objects that refer only to each other can never be collected.",
      answer: false,
      explanation:
        "Tracing from the roots finds them unreachable, so they are collected.",
    },
    {
      type: "single",
      id: "gc-weak",
      prompt: "What does a WeakReference do?",
      options: [
        "Does not keep its object alive",
        "Keeps the object alive until memory is low",
        "Prevents collection forever",
      ],
      answer: 0,
      explanation:
        "A soft reference is the one that survives until memory is low.",
    },
  ],
  assignment: {
    title: "Watch the collector",
    task: [
      "Run a program that allocates many short-lived objects with `-Xlog:gc` and read the log lines.",
      "Show a weak reference being cleared, and explain why `System.gc()` is not a command.",
    ],
    checklist: [
      "I identified minor and full collections in the log",
      "I explained why finalize is avoided",
      "I used try-with-resources for a resource",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "gc-ex",
      title: "A weak cache entry",
      task: [
        "Write a method that creates an object, keeps only a `WeakReference` to it, drops the strong reference and returns whether the weak reference is still set right away. Explain the result in a comment.",
      ],
      language: "java",
      starter:
        "import java.lang.ref.*;\n\npublic class WeakDemo {\n  // your code\n}",
      solution:
        "import java.lang.ref.*;\n\npublic class WeakDemo {\n  // Right after creating the reference, the object is still strongly reachable through the local variable.\n  static boolean stillSet() {\n    Object o = new Object();\n    WeakReference<Object> ref = new WeakReference<>(o);\n    return ref.get() != null;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(stillSet());\n  }\n}",
      hints: [
        "Collection happens only after the strong reference is gone, and at the collector's choice.",
      ],
      checklist: [
        "A weak reference is used",
        "The comment explains reachability",
        "No System.gc is needed for the answer",
      ],
    },
  ],
  revisionNotes: [
    "Reachable from a GC root = alive; no reference counting; cycles are collected",
    "Minor (young), major, full; stop-the-world pauses; throughput vs latency",
    "Strong, soft, weak, phantom references",
    "System.gc() is a hint; finalize is deprecated; use try-with-resources",
  ],
  resources: [
    {
      label: "HotSpot GC Tuning Guide: Introduction",
      url: "https://docs.oracle.com/en/java/javase/21/gctuning/introduction.html",
    },
    {
      label: "HotSpot GC Tuning Guide: Garbage Collector Implementation",
      url: "https://docs.oracle.com/en/java/javase/21/gctuning/garbage-collector-implementation.html",
    },
    {
      label: "Java SE API: java.lang.ref",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ref/package-summary.html",
    },
  ],
})
