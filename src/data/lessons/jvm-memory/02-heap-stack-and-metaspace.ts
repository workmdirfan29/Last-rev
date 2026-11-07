import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jvm-memory", {
  slug: "heap-stack-and-metaspace",
  title: "Heap, stack and the other memory areas",
  topic: "Heap vs stack",
  minutes: 70,
  overview:
    "Know what lives in the heap, the stack and Metaspace, how stack frames and recursion work, how the string pool relates to the heap, and what the memory options do.",
  objectives: [
    "Name the runtime data areas and what each holds",
    "Explain stack frames, StackOverflowError and OutOfMemoryError",
    "Explain the string pool, young and old generation, and the -Xms, -Xmx and -Xss options",
  ],
  prerequisites: ["lesson.jvm-memory.class-loading"],
  sections: [
    {
      kind: "explain",
      heading: "The runtime data areas",
      body: [
        "The **heap** is shared by all threads and holds **objects and arrays**. It is managed by the garbage collector. Each thread has its own **stack**, which holds a **frame** for every method call, with its local variables, parameters and partial results. **Class metadata**, such as the structure of classes and method code, is kept in the method area, which HotSpot implements as **Metaspace** in native memory since Java 8. Each thread also has a program counter and a native method stack.",
        "Local **primitives** live in the stack frame. A local **object variable** is a **reference** in the frame that points to an object on the heap. When a method returns, its frame is removed automatically, and the objects may then be collected if nothing else refers to them.",
        "Memory that the JVM uses **outside the heap**, such as thread stacks, Metaspace, the code cache and direct buffers, is not limited by `-Xmx`.",
      ],
    },
    {
      kind: "code",
      heading: "Frames and recursion",
      example: {
        title: "StackOverflowError",
        language: "java",
        code: 'public class Main {\n  static int depth = 0;\n\n  static void recurse() {\n    depth++;\n    recurse();\n  }\n\n  static long sumLoop(int n) {\n    long total = 0;\n    for (int i = 1; i <= n; i++) total += i;\n    return total;\n  }\n\n  public static void main(String[] args) {\n    try {\n      recurse();\n    } catch (StackOverflowError e) {\n      System.out.println("overflow after many frames: " + (depth > 1000));\n    }\n    System.out.println(sumLoop(1_000_000));\n  }\n}',
        walkthrough: [
          "Each call to `recurse` pushes one frame, and there is no base case, so the stack fills up.",
          "`StackOverflowError` is an `Error`, and the program can still continue after catching it here.",
          "A loop uses one frame for any `n`, so `sumLoop` works. The output is `overflow after many frames: true` and `500000500000`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Generations and the string pool",
      body: [
        "Most collectors split the heap by object age, because **most objects die young**. New objects are created in the **young generation**, in a part called **Eden**. When Eden fills, a *minor collection* copies the live objects into a **survivor space**. Objects that survive several collections are **promoted** to the **old generation**, which holds long-lived objects and is collected less often.",
        'The **string pool** is a table of unique `String` objects that is kept in the **heap** since Java 7. String literals are placed in it, so two equal literals are the same object. `new String("java")` always creates a separate object, and `intern()` returns the pooled one. This is why `==` on strings is unreliable, and `equals` should be used.',
      ],
    },
    {
      kind: "code",
      heading: "Pool and new",
      example: {
        title: "String identity",
        language: "java",
        code: 'String a = "java";\n    String b = "java";\n    String c = new String("java");\n    System.out.println((a == b) + " " + (a == c) + " " + (a == c.intern()) + " " + a.equals(c));',
        walkthrough: [
          "`a` and `b` are the same pooled object, so `a == b` is `true`.",
          "`c` is a separate heap object, so `a == c` is `false`.",
          "`c.intern()` returns the pooled object, and `equals` compares the contents. The output is `true false true true`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Memory options and errors",
      body: [
        "`-Xms` sets the initial heap size, `-Xmx` the maximum heap, and `-Xss` the stack size of each thread. For example `java -Xms512m -Xmx2g -jar app.jar`. In containers, `-XX:MaxRAMPercentage` sets the share of the container memory that the heap may use, and the process always uses more than the heap alone.",
        "`StackOverflowError` means the **stack** is full, usually endless recursion. `OutOfMemoryError: Java heap space` means the **heap** is full. `OutOfMemoryError: Metaspace` means class metadata ran out, which happens when classes are loaded without being unloaded, for example after many redeployments. Read the **message** after `OutOfMemoryError`, because it names the resource.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Saying that objects are stored on the stack.",
          fix: "Objects are on the heap. The stack holds primitives and references.",
        },
        {
          mistake: "Confusing StackOverflowError with OutOfMemoryError.",
          fix: "The stack and the heap are different areas.",
        },
        {
          mistake: "Setting -Xmx equal to the whole container memory.",
          fix: "Leave room for Metaspace, stacks and other memory.",
        },
        {
          mistake: "Comparing strings with `==`.",
          fix: "Use `equals`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A recursive parser",
      scenario:
        "A parser written with recursion fails on very long input with StackOverflowError.",
      body: [
        "Each nested call needs a frame, so deep input exhausts the stack. Rewrite the deepest part as a loop with an explicit `Deque` on the heap, or, as a last resort, raise `-Xss` for the thread that needs it.",
        "The heap is much larger than a thread stack, so moving the depth to a heap structure fixes the problem.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "hs-where",
      prompt: "Where is a local `int x = 5;` stored?",
      options: ["In the stack frame", "On the heap", "In Metaspace"],
      answer: 0,
      explanation: "Local primitives live in the frame of the method call.",
    },
    {
      type: "single",
      id: "hs-so",
      prompt: "Which error means that the thread stack is full?",
      options: [
        "StackOverflowError",
        "OutOfMemoryError",
        "NoClassDefFoundError",
      ],
      answer: 0,
      explanation: "It is usually caused by endless recursion.",
    },
    {
      type: "truefalse",
      id: "hs-xmx",
      statement: "-Xmx limits all the memory that the JVM process uses.",
      answer: false,
      explanation:
        "It limits the heap. Metaspace, thread stacks and native memory are extra.",
    },
    {
      type: "output",
      id: "hs-intern",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'String s1 = new String("x");\nString s2 = "x";\nSystem.out.println((s1 == s2) + " " + (s1.intern() == s2));',
      },
      options: ["false true", "true true", "false false"],
      answer: 0,
      explanation:
        "`new String` makes a separate object. `intern()` returns the pooled instance.",
    },
  ],
  assignment: {
    title: "Provoke and read the errors",
    task: [
      "Write a program that causes `StackOverflowError`, one that causes `OutOfMemoryError: Java heap space` with a small `-Xmx`, and print the messages.",
      "Print the string identity results for literals, `new String` and `intern`.",
    ],
    checklist: [
      "I produced both errors on purpose",
      "I read the message after OutOfMemoryError",
      "I explained the string results with the pool",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "hs-ex",
      title: "Recursion to a loop",
      task: [
        "Write `static long sumTo(int n)` using a loop, and explain in a comment why a recursive version could fail for large `n`.",
      ],
      language: "java",
      starter: "public class SumTo {\n  // your code\n}",
      solution:
        "public class SumTo {\n  // A recursive version needs one stack frame per call, so a very large n overflows the stack.\n  static long sumTo(int n) {\n    long total = 0;\n    for (int i = 1; i <= n; i++) {\n      total += i;\n    }\n    return total;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(sumTo(1_000_000));\n  }\n}",
      hints: ["A loop reuses one frame."],
      checklist: [
        "No recursion is used",
        "The comment explains the stack frames",
        "The result is correct for a large n",
      ],
    },
  ],
  revisionNotes: [
    "Heap: objects (shared, garbage collected); stack: frames per thread; Metaspace: class metadata",
    "StackOverflowError (stack) vs OutOfMemoryError (heap, Metaspace, ...)",
    "Young generation (Eden + survivors) → old generation; string pool is in the heap",
    "-Xms, -Xmx, -Xss; process memory is more than the heap",
  ],
  resources: [
    {
      label: "The Java Virtual Machine Specification: Run-Time Data Areas",
      url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html",
    },
    {
      label: "HotSpot GC Tuning Guide: Garbage Collector Implementation",
      url: "https://docs.oracle.com/en/java/javase/21/gctuning/garbage-collector-implementation.html",
    },
  ],
})
