import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "locks-and-conditions",
  title: "Explicit locks: ReentrantLock, ReadWriteLock and Condition",
  topic: "Locks",
  minutes: 90,
  overview:
    "Use ReentrantLock, tryLock, read-write locks and Conditions, and know when they are better than synchronized.",
  objectives: [
    "Write correct lock and unlock code",
    "Use tryLock with a timeout to avoid waiting forever",
    "Build a bounded buffer with Conditions",
  ],
  prerequisites: ["lesson.java-multithreading.executors"],
  sections: [
    {
      kind: "explain",
      heading: "ReentrantLock",
      body: [
        "`ReentrantLock` is an **explicit lock** with the same mutual exclusion and reentrancy as `synchronized`, but with more control. It offers `tryLock()`, with or without a timeout, so a thread can avoid waiting forever, `lockInterruptibly()`, which can be interrupted while waiting, an optional **fair** mode that favours the longest waiting thread, and several `Condition` objects per lock.",
        "The price is that **you must release the lock yourself**, always with `unlock()` in a `finally` block, or an exception would leave it locked for ever. `synchronized` is simpler and is released automatically, so use it by default, and use a lock when you need one of the extra features.",
      ],
    },
    {
      kind: "code",
      heading: "lock and tryLock",
      example: {
        title: "unlock in finally",
        language: "java",
        code: "ReentrantLock lock = new ReentrantLock();\n    int[] counter = {0};\n    Runnable work = () -> {\n      for (int i = 0; i < 50_000; i++) {\n        lock.lock();\n        try {\n          counter[0]++;\n        } finally {\n          lock.unlock();\n        }\n      }\n    };\n    Thread a = new Thread(work);\n    Thread b = new Thread(work);\n    a.start();\n    b.start();\n    a.join();\n    b.join();\n    System.out.println(counter[0]);\n    lock.lock();\n    Thread other = new Thread(() -> {\n      try {\n        System.out.println(lock.tryLock(50, TimeUnit.MILLISECONDS));\n      } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();\n      }\n    });\n    other.start();\n    other.join();\n    lock.unlock();",
        walkthrough: [
          "`lock()` and `unlock()` are paired, and `unlock` is in `finally`, so it always runs.",
          "Two threads increase the counter safely, and the total is `100000`.",
          "While main holds the lock, `tryLock` in the other thread waits 50 ms and gives up, so it prints `false`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "ReadWriteLock",
      body: [
        "A `ReadWriteLock` keeps a pair of locks. **Many threads can hold the read lock at the same time**, as long as nobody holds the write lock. The **write lock is exclusive**: it waits for the readers to finish, and blocks other readers and writers while it is held. It improves throughput for data that is read much more often than written, such as a cache.",
        "`ReentrantReadWriteLock` is the standard implementation. A thread cannot upgrade a read lock to a write lock directly, which can deadlock. For data with frequent writes, a plain lock is simpler and can be faster.",
      ],
    },
    {
      kind: "code",
      heading: "A cache with a read-write lock",
      example: {
        title: "Many readers, one writer",
        language: "java",
        code: 'public class Main {\n  static class PriceCache {\n    private final ReadWriteLock rw = new ReentrantReadWriteLock();\n    private final Map<String, Double> prices = new HashMap<>();\n\n    double price(String id) {\n      rw.readLock().lock();\n      try {\n        return prices.getOrDefault(id, 0.0);\n      } finally {\n        rw.readLock().unlock();\n      }\n    }\n\n    void update(String id, double p) {\n      rw.writeLock().lock();\n      try {\n        prices.put(id, p);\n      } finally {\n        rw.writeLock().unlock();\n      }\n    }\n  }\n\n  public static void main(String[] args) {\n    PriceCache cache = new PriceCache();\n    cache.update("pen", 10);\n    System.out.println(cache.price("pen") + " " + cache.price("cup"));\n  }\n}',
        walkthrough: [
          "Readers share the read lock, so they do not block each other.",
          "The writer takes the exclusive write lock, and both unlock in `finally`.",
          "The output is `10.0 0.0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Condition",
      body: [
        "A `Condition`, made with `lock.newCondition()`, does for explicit locks what `wait`, `notify` and `notifyAll` do for the monitor of an object: `await()` releases the lock and waits, and `signal()` or `signalAll()` wakes waiting threads. The advantage is that **one lock can have several conditions**, such as `notFull` and `notEmpty` for a buffer, so you wake only the threads that wait for that condition.",
        "As with `wait`, call `await` in a **loop** that re-checks the condition, and hold the lock when you call `await` or `signal`. `ArrayBlockingQueue` is built using this pattern.",
      ],
    },
    {
      kind: "code",
      heading: "A bounded buffer",
      example: {
        title: "Two conditions",
        language: "java",
        code: "public class Main {\n  static class Buffer<T> {\n    private final Queue<T> items = new ArrayDeque<>();\n    private final int capacity;\n    private final Lock lock = new ReentrantLock();\n    private final Condition notFull = lock.newCondition();\n    private final Condition notEmpty = lock.newCondition();\n\n    Buffer(int capacity) { this.capacity = capacity; }\n\n    void put(T item) throws InterruptedException {\n      lock.lock();\n      try {\n        while (items.size() == capacity) notFull.await();\n        items.add(item);\n        notEmpty.signal();\n      } finally {\n        lock.unlock();\n      }\n    }\n\n    T take() throws InterruptedException {\n      lock.lock();\n      try {\n        while (items.isEmpty()) notEmpty.await();\n        T item = items.remove();\n        notFull.signal();\n        return item;\n      } finally {\n        lock.unlock();\n      }\n    }\n  }\n\n  public static void main(String[] args) throws Exception {\n    Buffer<Integer> buffer = new Buffer<>(2);\n    Thread producer = new Thread(() -> {\n      try {\n        for (int i = 1; i <= 5; i++) buffer.put(i);\n      } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();\n      }\n    });\n    producer.start();\n    int sum = 0;\n    for (int i = 0; i < 5; i++) sum += buffer.take();\n    System.out.println(sum);\n  }\n}",
        walkthrough: [
          "`put` waits on `notFull` while the buffer is full, and `take` waits on `notEmpty` while it is empty.",
          "Each side signals only the condition that the other side waits on.",
          "Both loop on the condition and unlock in `finally`. The sum is `15`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Calling `unlock()` outside `finally`.",
          fix: "Always `lock(); try { ... } finally { unlock(); }`.",
        },
        {
          mistake: "Using a lock where `synchronized` is enough.",
          fix: "Use the simple tool unless you need the features.",
        },
        {
          mistake: "Taking the write lock while holding the read lock.",
          fix: "Release the read lock first.",
        },
        {
          mistake: "Using `if` instead of `while` around `await`.",
          fix: "Always loop on the condition.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A resource with a timeout",
      scenario:
        "A thread should try to get a shared resource for one second, and report a busy resource if it cannot.",
      body: [
        "`if (lock.tryLock(1, TimeUnit.SECONDS)) { try { ... } finally { lock.unlock(); } } else { report busy }`. The thread never waits for ever, and cannot take part in a deadlock for longer than a second.",
        "`synchronized` cannot do this.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "lock-unlock",
      prompt: "Where should `unlock()` be called?",
      options: ["In a finally block", "Right after lock()", "Nowhere"],
      answer: 0,
      explanation: "An exception would otherwise leave the lock held.",
    },
    {
      type: "single",
      id: "lock-rw",
      prompt: "What does a ReadWriteLock allow?",
      options: [
        "Many readers at once, or one writer",
        "Many writers at once",
        "Only one reader",
      ],
      answer: 0,
      explanation: "The write lock is exclusive.",
    },
    {
      type: "truefalse",
      id: "lock-condition",
      statement: "One ReentrantLock can have several Condition objects.",
      answer: true,
      explanation:
        "That lets you wake only the threads that wait for a specific condition.",
    },
    {
      type: "output",
      id: "lock-try",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'ReentrantLock l = new ReentrantLock();\nSystem.out.println(l.tryLock() + " " + l.isHeldByCurrentThread());\nl.unlock();',
      },
      options: ["true true", "true false", "false false"],
      answer: 0,
      explanation:
        "`tryLock()` takes the free lock, and the current thread holds it.",
    },
  ],
  assignment: {
    title: "Locks in practice",
    task: [
      "Write a bank account with `deposit`, `withdraw` and `transfer`, using `ReentrantLock` and `tryLock` with a timeout to avoid deadlock.",
      "Write a cache with a `ReadWriteLock`, and measure it against a plain `synchronized` version with many readers.",
    ],
    checklist: [
      "unlock is always in finally",
      "transfer cannot deadlock",
      "I measured both cache versions",
    ],
    minutes: 40,
  },
  exercises: [
    {
      slug: "lock-ex",
      title: "A guarded stack",
      task: [
        "Write `class GuardedList` with `add(String)` and `size()` protected by a `ReentrantLock`, with `unlock()` in `finally`.",
      ],
      language: "java",
      starter:
        "import java.util.*;\nimport java.util.concurrent.locks.*;\n\npublic class Guarded {\n  // your code\n}",
      solution:
        'import java.util.*;\nimport java.util.concurrent.locks.*;\n\npublic class Guarded {\n  static class GuardedList {\n    private final List<String> items = new ArrayList<>();\n    private final Lock lock = new ReentrantLock();\n\n    void add(String s) {\n      lock.lock();\n      try {\n        items.add(s);\n      } finally {\n        lock.unlock();\n      }\n    }\n\n    int size() {\n      lock.lock();\n      try {\n        return items.size();\n      } finally {\n        lock.unlock();\n      }\n    }\n  }\n\n  public static void main(String[] args) {\n    GuardedList g = new GuardedList();\n    g.add("a");\n    g.add("b");\n    System.out.println(g.size());\n  }\n}',
      hints: ["Both methods lock, so reads see the writes."],
      checklist: [
        "unlock is in finally in both methods",
        "The list is private",
        "size is also protected",
      ],
    },
  ],
  revisionNotes: [
    "ReentrantLock: tryLock, interruptible, fair, many Conditions; unlock in finally",
    "ReadWriteLock: many readers or one writer",
    "Condition = wait/notify for locks; loop on the condition",
    "Prefer synchronized unless you need the features",
  ],
  resources: [
    {
      label: "The Java Tutorials: Lock Objects",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/newlocks.html",
    },
    {
      label: "Java SE API: ReentrantLock",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html",
    },
    {
      label: "Java SE API: ReentrantReadWriteLock",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantReadWriteLock.html",
    },
  ],
})
