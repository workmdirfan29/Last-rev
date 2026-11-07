import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jvm-memory", {
  slug: "choosing-and-observing-collectors",
  title: "Choosing a collector and reading GC logs",
  topic: "Garbage collection",
  minutes: 55,
  overview:
    "Know the collectors that HotSpot offers, how to set heap options, and how to observe the collector with logs and tools before tuning.",
  objectives: [
    "Name the main collectors and what each is for",
    "Set heap options and read basic GC log lines",
    "Follow a measure-first approach to tuning",
  ],
  prerequisites: ["lesson.jvm-memory.garbage-collection-concepts"],
  sections: [
    {
      kind: "explain",
      heading: "The collectors",
      body: [
        "HotSpot offers several collectors. The **Serial** collector uses one thread and suits small heaps and single-processor machines. The **Parallel** collector uses several threads to maximise **throughput**. **G1**, the Garbage-First collector, divides the heap into regions and tries to meet a **pause-time goal**, and it is the default on server-class machines. **ZGC** is designed for **very short pauses**, even on large heaps, because it does most of its work concurrently.",
        "You choose one with a flag, such as `-XX:+UseG1GC` or `-XX:+UseZGC`. The default is chosen from the machine's memory and processors, so check the documentation of your Java version. **Start with the default**, and change it only after you have measured a real problem.",
      ],
    },
    {
      kind: "explain",
      heading: "Observing the collector",
      body: [
        "Turn on GC logging with the unified logging option: `-Xlog:gc` prints a summary of every collection, with its type, the heap size before and after, and the pause time. `-Xlog:gc*` gives more detail. The `jstat -gcutil <pid>` tool shows live statistics from a running JVM, and **Java Flight Recorder** records detailed events with little overhead.",
        "Look at three things: how **often** collections happen, how **long** the pauses are, and whether the memory in use **after a full collection keeps growing**. The last is the signature of a memory leak. Always measure before changing a flag, and change one thing at a time.",
      ],
    },
    {
      kind: "code",
      heading: "Measuring allocation",
      example: {
        title: "Runtime memory numbers",
        language: "java",
        code: 'Runtime rt = Runtime.getRuntime();\n    long before = rt.totalMemory() - rt.freeMemory();\n    List<byte[]> keep = new ArrayList<>();\n    for (int i = 0; i < 20; i++) keep.add(new byte[1_000_000]);\n    long after = rt.totalMemory() - rt.freeMemory();\n    System.out.println("max heap known: " + (rt.maxMemory() > 0));\n    System.out.println("used grew: " + (after > before));\n    System.out.println(keep.size());',
        walkthrough: [
          "`Runtime` gives the total, free and maximum heap memory of the running JVM.",
          "Holding twenty arrays of one megabyte makes the used memory grow, and the collector cannot free them while `keep` refers to them.",
          "The exact numbers differ between runs, so the program prints only comparisons. The output is `max heap known: true`, `used grew: true`, `20`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Heap options",
      body: [
        "`-Xms` sets the initial heap and `-Xmx` the maximum. Setting them equal avoids resizing at run time, and some teams do this for servers. A heap that is too large leads to long collections, and one that is too small to frequent ones. In containers, prefer `-XX:MaxRAMPercentage=70` to a fixed number, so the heap follows the container limit and leaves room for the memory outside the heap.",
        "A useful log line looks like this: `[gc] GC(12) Pause Young (Normal) 220M->40M(512M) 8.5ms`. It shows a young collection that reduced the heap from 220 MB to 40 MB in 8.5 milliseconds. A line with `Pause Full` is worth attention, especially if it repeats.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Switching collectors without measuring.",
          fix: "Collect a baseline with GC logs first.",
        },
        {
          mistake: "Changing many flags at once.",
          fix: "Change one thing, and measure again.",
        },
        {
          mistake: "Setting -Xmx to the whole container memory.",
          fix: "Use a percentage that leaves room for native memory.",
        },
        {
          mistake: "Ignoring a rising heap after full collections.",
          fix: "Investigate a leak instead of raising -Xmx.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A latency-sensitive service",
      scenario:
        "A service has an occasional pause of two seconds, and users notice.",
      body: [
        "Read the GC log: the pauses coincide with full collections, because the old generation is nearly full. First check for a leak and for oversized caches. Only if the live data is simply large, try a collector with shorter pauses and compare the logs before and after.",
        "The log decides the next step, not a guess.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cc-default",
      prompt: "Which collector is the usual default on server-class machines?",
      options: ["G1", "Serial", "Epsilon"],
      answer: 0,
      explanation: "G1 aims at a pause-time goal.",
    },
    {
      type: "single",
      id: "cc-parallel",
      prompt: "Which collector aims at maximum throughput?",
      options: ["Parallel", "ZGC", "Serial"],
      answer: 0,
      explanation: "ZGC aims at very short pauses.",
    },
    {
      type: "truefalse",
      id: "cc-measure",
      statement:
        "You should change the garbage collector first and measure afterwards.",
      answer: false,
      explanation: "Measure a baseline first, then change one thing.",
    },
    {
      type: "blank",
      id: "cc-flag",
      prompt:
        "The flag to print a summary of every collection on a modern JVM is -X___:gc.",
      answer: "log",
      explanation: "`-Xlog:gc` uses the unified logging system.",
    },
  ],
  assignment: {
    title: "Read a GC log",
    task: [
      "Run a small allocation-heavy program with `-Xlog:gc` and `-Xmx64m`, and save the log.",
      "Mark the young and full collections, compute the average pause, and try a different collector, comparing the numbers.",
    ],
    checklist: [
      "I have a baseline log",
      "I compared two collectors with numbers",
      "I changed only one flag at a time",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "cc-ex",
      title: "Report the heap",
      task: [
        "Write `static String heapReport()` that returns `used/max` in megabytes using `Runtime`, in the form `used=12MB max=512MB` (the numbers will differ).",
      ],
      language: "java",
      starter: "public class HeapReport {\n  // your code\n}",
      solution:
        'public class HeapReport {\n  static String heapReport() {\n    Runtime rt = Runtime.getRuntime();\n    long usedMb = (rt.totalMemory() - rt.freeMemory()) / (1024 * 1024);\n    long maxMb = rt.maxMemory() / (1024 * 1024);\n    return "used=" + usedMb + "MB max=" + maxMb + "MB";\n  }\n\n  public static void main(String[] args) {\n    System.out.println(heapReport());\n  }\n}',
      hints: ["`totalMemory() - freeMemory()` is the memory in use."],
      checklist: [
        "The format matches",
        "The units are megabytes",
        "No collector flag is changed",
      ],
    },
  ],
  revisionNotes: [
    "Serial (small), Parallel (throughput), G1 (balanced default), ZGC (very short pauses)",
    "`-Xlog:gc`, `jstat -gcutil`, Flight Recorder; watch frequency, pause time and heap after full GC",
    "-Xms/-Xmx, MaxRAMPercentage in containers",
    "Measure first, change one thing, measure again",
  ],
  resources: [
    {
      label: "HotSpot GC Tuning Guide: Available Collectors",
      url: "https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html",
    },
    {
      label: "HotSpot GC Tuning Guide: Ergonomics",
      url: "https://docs.oracle.com/en/java/javase/21/gctuning/ergonomics.html",
    },
  ],
})
