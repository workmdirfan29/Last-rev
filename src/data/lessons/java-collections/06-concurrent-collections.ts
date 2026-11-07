import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "concurrent-collections",
  title: "Concurrent collections",
  topic: "Concurrent collections",
  minutes: 70,
  overview:
    "Choose thread-safe collections: ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue and synchronised wrappers, and avoid their traps.",
  objectives: [
    "Explain why plain collections are not thread-safe",
    "Use ConcurrentHashMap with atomic methods",
    "Use CopyOnWriteArrayList and BlockingQueue for the right jobs",
  ],
  prerequisites: ["lesson.java-collections.queues-and-deques"],
  sections: [
    {
      kind: "explain",
      heading: "Why plain collections fail",
      body: [
        "`ArrayList`, `HashMap` and the other classes of the framework are **not thread-safe**. If several threads change one at the same time, elements can be lost, the structure can be corrupted, and exceptions can occur. You have three choices: avoid sharing, wrap a collection with synchronisation, or use a collection designed for concurrency.",
        "`Collections.synchronizedList(list)` and `synchronizedMap(map)` make each method hold **one lock** on the whole collection. Single calls become safe, but a sequence of calls, such as check-then-add, is still not atomic, and **iterating** is not protected: you must hold the wrapper's lock for the entire loop. All access goes through one lock, which limits speed.",
      ],
    },
    {
      kind: "explain",
      heading: "ConcurrentHashMap",
      body: [
        "`ConcurrentHashMap` lets many threads read and write at the same time **without locking the whole map**. It has **atomic** methods for compound actions: `putIfAbsent`, `computeIfAbsent`, `compute` and `merge`. It does not allow `null` keys or values, its iterators are *weakly consistent* and never throw `ConcurrentModificationException`, and its `size` is an estimate while other threads change the map.",
        "Even with a concurrent map, two separate calls such as `get` then `put` are **not atomic as a pair**. Use `merge` or `compute`, which are. If only one thread writes and the others read after the writing is done, a plain map may be enough.",
      ],
    },
    {
      kind: "code",
      heading: "An atomic counter map",
      example: {
        title: "merge from many threads",
        language: "java",
        code: 'public class Main {\n  public static void main(String[] args) throws Exception {\n    Map<String, Integer> hits = new ConcurrentHashMap<>();\n    ExecutorService pool = Executors.newFixedThreadPool(4);\n    List<Future<?>> tasks = new ArrayList<>();\n    for (int t = 0; t < 4; t++) {\n      tasks.add(pool.submit(() -> {\n        for (int i = 0; i < 10_000; i++) {\n          hits.merge("home", 1, Integer::sum);\n        }\n      }));\n    }\n    for (Future<?> f : tasks) f.get();\n    pool.shutdown();\n    System.out.println(hits.get("home"));\n  }\n}',
        walkthrough: [
          "Four threads each add `1` ten thousand times to the same key.",
          "`merge` is atomic, so no update is lost.",
          "The total is always `40000`. With a plain `HashMap`, the result would be unpredictable.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "CopyOnWriteArrayList and blocking queues",
      body: [
        "`CopyOnWriteArrayList` makes a **fresh copy of its array on every write**. Reads and iteration need no locking, and an iterator works on a **snapshot**, so it never throws `ConcurrentModificationException` and does not see later changes. It suits lists that are **read very often and changed rarely**, such as a list of listeners, and is a poor choice when writes are frequent.",
        "A `BlockingQueue` is a thread-safe queue whose operations can **wait**: `put` blocks when a bounded queue is full, and `take` blocks when it is empty. It is the simplest way to build a **producer-consumer** design, and a bounded queue, such as `ArrayBlockingQueue`, gives **back-pressure**, because fast producers wait for slow consumers. `offer` and `poll` with a timeout wait only for a limited time.",
      ],
    },
    {
      kind: "code",
      heading: "Producer and consumer",
      example: {
        title: "BlockingQueue",
        language: "java",
        code: "public class Main {\n  public static void main(String[] args) throws Exception {\n    BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(2);\n    Thread producer = new Thread(() -> {\n      try {\n        for (int i = 1; i <= 5; i++) queue.put(i);\n        queue.put(-1);\n      } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();\n      }\n    });\n    producer.start();\n    int sum = 0;\n    while (true) {\n      int n = queue.take();\n      if (n == -1) break;\n      sum += n;\n    }\n    System.out.println(sum);\n  }\n}",
        walkthrough: [
          "The queue holds only two items, so the producer waits whenever it is full.",
          "`take` waits whenever the queue is empty, so no busy loop is needed.",
          "The special value `-1` tells the consumer to stop. The sum is `15`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `get` then `put` on a ConcurrentHashMap.",
          fix: "Use `merge`, `compute` or `putIfAbsent`.",
        },
        {
          mistake:
            "Iterating over a synchronised wrapper without holding its lock.",
          fix: "Synchronise on the wrapper for the whole loop, or use a concurrent collection.",
        },
        {
          mistake: "Using CopyOnWriteArrayList for frequently changed lists.",
          fix: "Every write copies the whole array. Use another structure.",
        },
        {
          mistake:
            "An unbounded queue between fast producers and slow consumers.",
          fix: "Use a bounded queue for back-pressure.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A hit counter and a work queue",
      scenario:
        "A web service counts hits per page from many request threads, and sends audit events to a writer thread.",
      body: [
        "The counts use a `ConcurrentHashMap` with `merge`. The audit events go into a bounded `BlockingQueue`, and one writer thread takes and saves them. If the writer is slow, the request threads wait a little instead of using up memory.",
        "Each tool matches its job: a concurrent map for counting, a blocking queue for hand-over.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cc-hashmap",
      prompt: "Is HashMap safe for concurrent writes?",
      options: ["No", "Yes, always", "Only for reads"],
      answer: 0,
      explanation:
        "It is not thread-safe. Use `ConcurrentHashMap` or synchronisation.",
    },
    {
      type: "single",
      id: "cc-merge",
      prompt: "Which ConcurrentHashMap method safely increases a counter?",
      options: ["merge(key, 1, Integer::sum)", "get then put", "size"],
      answer: 0,
      explanation: "`merge` is atomic.",
    },
    {
      type: "truefalse",
      id: "cc-null",
      statement: "ConcurrentHashMap allows null values.",
      answer: false,
      explanation: "It rejects `null` keys and values.",
    },
    {
      type: "single",
      id: "cc-cow",
      prompt: "When is CopyOnWriteArrayList a good choice?",
      options: [
        "Read-heavy data that rarely changes",
        "A list that is updated thousands of times per second",
        "A queue between threads",
      ],
      answer: 0,
      explanation:
        "Each write copies the array, so frequent writes are expensive.",
    },
  ],
  assignment: {
    title: "Make a counter safe",
    task: [
      "Write a program where four threads count words into a plain `HashMap`, and show the wrong totals.",
      "Fix it with `ConcurrentHashMap.merge`, and add a bounded `BlockingQueue` between a reader and a counter.",
    ],
    checklist: [
      "I reproduced a wrong result with the plain map",
      "The fixed version always gives the same total",
      "The queue is bounded",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "cc-ex",
      title: "A safe counter",
      task: [
        "Write a class `HitCounter` with `hit(String page)` and `count(String page)` that is safe for many threads, using a `ConcurrentHashMap`.",
      ],
      language: "java",
      starter:
        "import java.util.concurrent.*;\n\npublic class Hits {\n  // your code\n}",
      solution:
        'import java.util.concurrent.*;\n\npublic class Hits {\n  static class HitCounter {\n    private final ConcurrentHashMap<String, Integer> counts = new ConcurrentHashMap<>();\n\n    void hit(String page) {\n      counts.merge(page, 1, Integer::sum);\n    }\n\n    int count(String page) {\n      return counts.getOrDefault(page, 0);\n    }\n  }\n\n  public static void main(String[] args) {\n    HitCounter c = new HitCounter();\n    c.hit("home");\n    c.hit("home");\n    System.out.println(c.count("home") + " " + c.count("about"));\n  }\n}',
      hints: ["`merge` makes the update atomic."],
      checklist: [
        "hit uses merge",
        "A missing page counts as 0",
        "No separate lock is used",
      ],
    },
  ],
  revisionNotes: [
    "Plain collections are not thread-safe",
    "Synchronised wrappers: one lock; iteration and compound actions need your own lock",
    "ConcurrentHashMap: atomic merge/compute/putIfAbsent; no nulls",
    "CopyOnWriteArrayList for read-mostly data; BlockingQueue for producer-consumer",
  ],
  resources: [
    {
      label: "The Java Tutorials: Concurrent Collections",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html",
    },
    {
      label: "Java SE API: ConcurrentHashMap",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html",
    },
    {
      label: "Java SE API: BlockingQueue",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/BlockingQueue.html",
    },
  ],
})
