import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jvm-memory", {
  slug: "memory-leaks",
  title: "Memory leaks: causes, OutOfMemoryError and how to find them",
  topic: "Memory leaks",
  minutes: 70,
  overview:
    "Understand how a memory leak happens in a language with a garbage collector, recognise the usual causes, and diagnose with heap dumps.",
  objectives: [
    "Explain a leak as unintended reachability",
    "List the typical causes and their fixes",
    "Diagnose with GC logs, heap dumps and the path to a GC root",
  ],
  prerequisites: ["lesson.jvm-memory.garbage-collection-concepts"],
  sections: [
    {
      kind: "explain",
      heading: "A leak with a garbage collector",
      body: [
        "The collector frees only **unreachable** objects. A **memory leak** in Java happens when the program keeps a reference to objects it will never use again, so they stay reachable and are never freed. The heap grows slowly until the JVM throws `OutOfMemoryError`. The collector is not wrong: the program holds on to memory by mistake. The signature is that the memory in use **after each full collection keeps growing** over hours or days.",
        "Raising `-Xmx` only delays the failure. The fix is to find which reference keeps the objects alive, and remove it.",
      ],
    },
    {
      kind: "code",
      heading: "A growing cache",
      example: {
        title: "An unbounded static map",
        language: "java",
        code: 'public class Main {\n  static final Map<Integer, byte[]> CACHE = new HashMap<>();\n\n  static byte[] load(int id) {\n    return CACHE.computeIfAbsent(id, k -> new byte[1024]);\n  }\n\n  static class LruCache<K, V> extends LinkedHashMap<K, V> {\n    private final int max;\n    LruCache(int max) {\n      super(16, 0.75f, true);\n      this.max = max;\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n      return size() > max;\n    }\n  }\n\n  public static void main(String[] args) {\n    for (int id = 0; id < 5000; id++) load(id);\n    LruCache<Integer, byte[]> bounded = new LruCache<>(100);\n    for (int id = 0; id < 5000; id++) bounded.put(id, new byte[1024]);\n    System.out.println(CACHE.size() + " " + bounded.size());\n  }\n}',
        walkthrough: [
          "`CACHE` is static and has no limit, so every id ever requested stays in memory. With unlimited ids, that is a leak.",
          "`LruCache` is a `LinkedHashMap` in access order that removes the eldest entry above a maximum.",
          "The output is `5000 100`: one cache grew without limit, and the other stayed bounded.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Typical causes",
      body: [
        "**Static collections** that only grow, such as a `static Map` used as a cache with no size limit or expiry. **Listeners and callbacks** that are registered and never removed from a long-lived object. **`ThreadLocal`** values that are not removed in a thread pool. **Resources** such as streams and connections that are not closed. **Inner classes and lambdas** that keep a hidden reference to a large outer object. **Class loaders** that stay referenced after a redeployment. **Map keys** that are added and never removed.",
        "The fixes are to bound the size, remove the reference, use weak references where the lifetime should follow another object, and use try-with-resources. A cache library with a maximum size and expiry avoids the unbounded cache problem.",
      ],
    },
    {
      kind: "explain",
      heading: "OutOfMemoryError and diagnosis",
      body: [
        "Read the **message** after `OutOfMemoryError`. `Java heap space`: the heap is full. `GC overhead limit exceeded`: nearly all the time goes into collections that recover almost nothing. `Metaspace`: class metadata ran out. `unable to create native thread`: the operating system could not create another thread. Each needs a different fix.",
        "To find a leak: confirm the growth after full collections with the GC log or `jstat`. Take a **heap dump**, with `jcmd <pid> GC.heap_dump file.hprof`, or automatically on failure with `-XX:+HeapDumpOnOutOfMemoryError`. Open it in an analyser such as Eclipse Memory Analyzer or VisualVM, find the classes that hold the most memory (the *dominator tree*), and follow the **path from a GC root** to a suspicious object. Compare two dumps taken some time apart. Heap dumps contain application data, so protect them like any sensitive file.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Saying that Java cannot leak memory.",
          fix: "A leak is an unintended reachable reference.",
        },
        {
          mistake: "Raising -Xmx for every OutOfMemoryError.",
          fix: "Read the message and find the cause.",
        },
        {
          mistake: "A static cache with no limit.",
          fix: "Bound it and add expiry.",
        },
        {
          mistake: "Sending a heap dump with real data outside the team.",
          fix: "Treat it as sensitive.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A growing service",
      scenario:
        "A service runs fine for two days, then slows down and is restarted by the platform.",
      body: [
        "The GC log shows the memory after each full collection rising. A heap dump shows two million `Session` objects held by one static map that is never cleaned. The fix removes sessions when they expire.",
        "The same process works for listeners, thread locals and class loaders: follow the path to the root.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ml-def",
      prompt: "What is a memory leak in Java?",
      options: [
        "Objects that stay reachable but are no longer needed",
        "Memory that the collector forgets to free",
        "A bug in the JVM",
      ],
      answer: 0,
      explanation:
        "The program keeps a reference, so the collector cannot free the object.",
    },
    {
      type: "multi",
      id: "ml-causes",
      prompt: "Which can cause a leak?",
      options: [
        "A static map that only grows",
        "A listener that is never removed",
        "A closed resource",
        "A ThreadLocal never removed in a pool",
      ],
      answers: [0, 1, 3],
      explanation: "Closing a resource releases it.",
    },
    {
      type: "truefalse",
      id: "ml-xmx",
      statement: "Raising -Xmx fixes a memory leak.",
      answer: false,
      explanation: "It only delays the failure.",
    },
    {
      type: "single",
      id: "ml-first",
      prompt: "What is the first sign of a leak in a GC log?",
      options: [
        "Memory after full collections keeps rising",
        "Pauses of 1 millisecond",
        "No collections at all",
      ],
      answer: 0,
      explanation:
        "Live data that grows without a matching drop means that something is retained.",
    },
  ],
  assignment: {
    title: "Find a leak",
    task: [
      "Write a small program with an unbounded cache, run it with a small heap and `-XX:+HeapDumpOnOutOfMemoryError`, and open the dump.",
      "Find the map in the dominator tree, fix it with a bounded cache, and show that memory stays stable.",
    ],
    checklist: [
      "I have a heap dump and found the cause",
      "The fixed version stays stable",
      "I can name five typical causes",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "ml-ex",
      title: "A bounded cache",
      task: [
        "Write a generic class `BoundedCache<K, V>` that extends `LinkedHashMap` in access order and never holds more than `max` entries.",
      ],
      language: "java",
      starter:
        "import java.util.*;\n\npublic class Bounded {\n  // your code\n}",
      solution:
        'import java.util.*;\n\npublic class Bounded {\n  static class BoundedCache<K, V> extends LinkedHashMap<K, V> {\n    private final int max;\n\n    BoundedCache(int max) {\n      super(16, 0.75f, true);\n      this.max = max;\n    }\n\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n      return size() > max;\n    }\n  }\n\n  public static void main(String[] args) {\n    BoundedCache<String, Integer> cache = new BoundedCache<>(2);\n    cache.put("a", 1);\n    cache.put("b", 2);\n    cache.get("a");\n    cache.put("c", 3);\n    System.out.println(cache.keySet());\n  }\n}',
      hints: [
        "The `true` argument selects access order, so the least recently used entry is removed.",
      ],
      checklist: [
        "The cache never exceeds its maximum",
        "Access order is used",
        "The class is generic",
      ],
    },
  ],
  revisionNotes: [
    "A leak = unintended references keep objects reachable",
    "Typical: unbounded caches, unremoved listeners, ThreadLocals, unclosed resources, kept class loaders",
    "Read the OutOfMemoryError message; each kind has a different fix",
    "GC log → heap dump → dominator tree → path to the GC root",
  ],
  resources: [
    {
      label: "Java Troubleshooting Guide: Troubleshoot Memory Leaks",
      url: "https://docs.oracle.com/en/java/javase/21/troubleshoot/troubleshoot-memory-leaks.html",
    },
    {
      label: "Java Troubleshooting Guide: Diagnostic Tools",
      url: "https://docs.oracle.com/en/java/javase/21/troubleshoot/diagnostic-tools.html",
    },
  ],
})
