import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jvm-memory", {
  slug: "jit-compilation",
  title: "The JIT compiler: warm-up, tiered compilation and inlining",
  topic: "JIT",
  minutes: 50,
  overview:
    "Understand why Java starts slow and gets fast, what the JIT compiler does, and how to benchmark honestly.",
  objectives: [
    "Explain interpretation, hot spots and JIT compilation",
    "Describe tiered compilation with C1 and C2",
    "Avoid benchmarking mistakes caused by warm-up",
  ],
  prerequisites: ["lesson.jvm-memory.class-loading"],
  sections: [
    {
      kind: "explain",
      heading: "Interpret first, compile the hot code",
      body: [
        "When the JVM starts running a method, it **interprets** the bytecode: it starts quickly, but runs slowly. The JVM counts how often methods and loops run. The ones that run often, the **hot spots**, are compiled by the **Just-In-Time (JIT) compiler** into optimised **native machine code**, which is used for later calls. Because the JIT works at run time, it can use real **profiling data**, such as which branch is usually taken.",
        "This combines platform-independent bytecode with performance close to native code for long-running programs. A program is slower just after it starts, until the hot code has been compiled. This is the **warm-up**. Compiled code is kept in the **code cache**, and if an assumption of the optimiser proves wrong, the JVM can **deoptimise** and return to interpreting.",
      ],
    },
    {
      kind: "explain",
      heading: "Tiered compilation and optimisations",
      body: [
        "HotSpot has two JIT compilers. **C1** compiles quickly with light optimisation. **C2** takes longer and optimises aggressively, for code that proves to be very hot. **Tiered compilation**, the default, combines them with the interpreter: code starts in the interpreter, then moves to C1-compiled code, and then to C2 if it stays hot. This gives a fast start and a high peak speed.",
        "Typical optimisations are **method inlining**, which replaces a call with the body of the method and removes the call overhead, which is why small methods cost almost nothing, and **escape analysis**, which lets the compiler avoid allocating on the heap an object that never leaves a method. These are automatic and depend on the JVM version, so writing clear, small methods is usually the right choice, and micro-optimising by hand rarely helps.",
      ],
    },
    {
      kind: "code",
      heading: "Warm-up",
      example: {
        title: "The same work gets faster",
        language: "java",
        code: "public class Main {\n  static long work(int n) {\n    long sum = 0;\n    for (int i = 0; i < n; i++) sum += i % 7;\n    return sum;\n  }\n\n  public static void main(String[] args) {\n    long checksum = 0;\n    for (int round = 0; round < 50; round++) {\n      checksum += work(200_000);\n    }\n    System.out.println(checksum);\n  }\n}",
        walkthrough: [
          "The loop in `work` runs very often, so the JIT compiles it after some rounds.",
          "The first rounds run in the interpreter and are slower, and later rounds run as native code.",
          "The result is the same either way. Only the speed changes. The output is `29999700`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Benchmarking honestly",
      body: [
        "A single timing of a method, taken once, mostly measures the **interpreter and the compilation**, not the speed of the code. Warm the code up with many iterations before you measure, repeat the measurement, and use the result, so the compiler cannot remove the work as unused. The standard tool is **JMH**, the Java Microbenchmark Harness, which handles warm-up, forks and dead-code problems for you.",
        "`-XX:+PrintCompilation` shows which methods the JIT compiles, which helps to understand what happens. For most applications, measure real workloads with a profiler or Flight Recorder instead of micro-benchmarks.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Timing a method once and drawing conclusions.",
          fix: "Warm up, repeat, and preferably use JMH.",
        },
        {
          mistake: "Saying that Java is only interpreted.",
          fix: "Hot code is compiled to native code at run time.",
        },
        {
          mistake: "Merging small methods to avoid call overhead.",
          fix: "The JIT inlines small methods, so keep the code clear.",
        },
        {
          mistake: "Ignoring the code cache on very large applications.",
          fix: "A full code cache stops compilation. Check its size if performance drops.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A slow first request",
      scenario:
        "After each deployment, the first requests are slow, and later ones are fast.",
      body: [
        "The JVM has just started and is interpreting. Warm-up requests that exercise the main paths before real traffic arrives, or a readiness probe that waits for warm-up, hide the slow start from users.",
        "Knowing about warm-up explains a pattern that otherwise looks like a bug.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "jit-what",
      prompt: "What does the JIT compiler do?",
      options: [
        "Compiles hot bytecode to native code at run time",
        "Compiles source code before the program starts",
        "Frees memory",
      ],
      answer: 0,
      explanation:
        "It uses run-time profiling to optimise frequently used code.",
    },
    {
      type: "single",
      id: "jit-tiered",
      prompt:
        "In tiered compilation, which compiler optimises the hottest code most aggressively?",
      options: ["C2", "C1", "The interpreter"],
      answer: 0,
      explanation: "C1 is quick and light, C2 is slow and aggressive.",
    },
    {
      type: "truefalse",
      id: "jit-bench",
      statement:
        "Timing a method once without warm-up gives a reliable measure of its speed.",
      answer: false,
      explanation:
        "It mostly measures interpretation and compilation. Warm up and repeat.",
    },
    {
      type: "single",
      id: "jit-inline",
      prompt: "What is method inlining?",
      options: [
        "Replacing a call with the body of the method",
        "Writing a method inside another",
        "Making a method final",
      ],
      answer: 0,
      explanation:
        "It removes the call overhead and enables further optimisation.",
    },
  ],
  assignment: {
    title: "See warm-up",
    task: [
      "Write a loop that times the same method in 20 rounds and prints the time of each round. Observe that early rounds are slower.",
      "Run it with `-XX:+PrintCompilation` and find your method in the output.",
    ],
    checklist: [
      "I observed slower early rounds",
      "I found my method in the compilation log",
      "I can explain why one timing is not a benchmark",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "jit-ex",
      title: "Time rounds",
      task: [
        "Write `static long[] timeRounds(int rounds)` that runs a small calculation `rounds` times and returns the elapsed nanoseconds of each round. Do not print the times, because they differ between runs.",
      ],
      language: "java",
      starter: "public class Rounds {\n  // your code\n}",
      solution:
        "public class Rounds {\n  static long work() {\n    long sum = 0;\n    for (int i = 0; i < 100_000; i++) sum += i % 7;\n    return sum;\n  }\n\n  static long[] timeRounds(int rounds) {\n    long[] times = new long[rounds];\n    for (int r = 0; r < rounds; r++) {\n      long start = System.nanoTime();\n      work();\n      times[r] = System.nanoTime() - start;\n    }\n    return times;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(timeRounds(5).length);\n  }\n}",
      hints: ["Use `System.nanoTime()` before and after each round."],
      checklist: [
        "One time per round",
        "The input is not printed per round",
        "The calculation is a separate method",
      ],
    },
  ],
  revisionNotes: [
    "Interpret first, JIT-compile hot code using profiling data; warm-up is real",
    "Tiered: interpreter → C1 (fast) → C2 (aggressive)",
    "Inlining and escape analysis are automatic; write clear code",
    "Benchmark with warm-up and repetition, preferably JMH",
  ],
  resources: [
    {
      label: "HotSpot Virtual Machine Performance Enhancements",
      url: "https://docs.oracle.com/en/java/javase/21/vm/java-hotspot-virtual-machine-performance-enhancements.html",
    },
    {
      label: "The Java Virtual Machine Specification: Introduction",
      url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-1.html",
    },
  ],
})
