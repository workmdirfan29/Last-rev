import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-exceptions", {
  slug: "try-with-resources",
  title: "try-with-resources and suppressed exceptions",
  topic: "try-with-resources",
  minutes: 40,
  overview:
    "Close resources automatically with try-with-resources, write your own AutoCloseable, and understand the order of closing and suppressed exceptions.",
  objectives: [
    "Use try-with-resources to close files, streams and connections",
    "Implement AutoCloseable and predict the closing order",
    "Explain suppressed exceptions",
  ],
  prerequisites: ["lesson.java-exceptions.custom-exceptions"],
  sections: [
    {
      kind: "explain",
      heading: "Why it exists",
      body: [
        "Files, streams, database connections and sockets must be **closed** when you finish with them, or they leak. Writing this with `finally` is long and error-prone: you need null checks, and the `close()` call can itself throw an exception that **hides** the first one.",
        "**try-with-resources**, added in Java 7, declares the resources in parentheses after `try`. Each must implement `AutoCloseable`. Java closes them automatically when the block ends, whether normally or because of an exception: `try (BufferedReader r = Files.newBufferedReader(path)) { ... }`.",
        "Several resources are separated with semicolons. They are closed in the **reverse order** of their creation, and before any `catch` or `finally` block runs.",
      ],
    },
    {
      kind: "code",
      heading: "Automatic close",
      example: {
        title: "A reader that is always closed",
        language: "java",
        code: 'import java.io.*;\n\npublic class Main {\n  static String firstLine(String text) throws IOException {\n    try (BufferedReader reader = new BufferedReader(new StringReader(text))) {\n      return reader.readLine();\n    }\n  }\n\n  public static void main(String[] args) throws IOException {\n    System.out.println(firstLine("one\\ntwo"));\n  }\n}',
        walkthrough: [
          "The reader is declared in the `try` parentheses, and is closed after the `return`.",
          "No `finally` block and no null check are needed.",
          "The output is `one`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Your own resources",
      body: [
        "Any class can be used in try-with-resources if it implements `AutoCloseable`, which has one method, `void close() throws Exception`. You may narrow the signature. Put the cleanup in `close()`, and make it safe to call more than once. `Closeable`, for I/O, is a sub-interface whose `close` throws `IOException`.",
        "Since Java 9, you can use an **existing variable** that is `final` or effectively final: `try (reader) { ... }`.",
        "If the body throws an exception, and then `close()` also throws, the exception from the body stays as the **primary exception**, and the one from `close()` is attached to it as a **suppressed exception**. You read them with `getSuppressed()`, and they appear in the stack trace.",
      ],
    },
    {
      kind: "code",
      heading: "Closing order",
      example: {
        title: "Reverse order",
        language: "java",
        code: 'public class Main {\n  static class Res implements AutoCloseable {\n    private final String name;\n\n    Res(String name) {\n      this.name = name;\n      System.out.println("open " + name);\n    }\n\n    @Override\n    public void close() {\n      System.out.println("close " + name);\n    }\n  }\n\n  public static void main(String[] args) {\n    try (Res a = new Res("A"); Res b = new Res("B")) {\n      System.out.println("body");\n    }\n  }\n}',
        walkthrough: [
          "Resources are opened in the written order, `A` and then `B`.",
          "They are closed in the opposite order, `B` and then `A`.",
          "The output is `open A`, `open B`, `body`, `close B`, `close A`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Suppressed exceptions",
      example: {
        title: "Two failures",
        language: "java",
        code: 'public class Main {\n  static class Bad implements AutoCloseable {\n    @Override\n    public void close() {\n      throw new IllegalStateException("close failed");\n    }\n  }\n\n  public static void main(String[] args) {\n    try (Bad bad = new Bad()) {\n      throw new RuntimeException("body failed");\n    } catch (RuntimeException e) {\n      System.out.println(e.getMessage());\n      System.out.println(e.getSuppressed()[0].getMessage());\n    }\n  }\n}',
        walkthrough: [
          "The body throws first, so its exception is the primary one.",
          "Closing the resource then fails, and that exception is attached as suppressed.",
          "The output is `body failed` and `close failed`. With a manual `finally`, the first exception would be lost.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Opening a resource outside the try and forgetting to close it.",
          fix: "Declare it in the try header.",
        },
        {
          mistake:
            "Closing a resource in `finally` where `close()` can hide the first exception.",
          fix: "Use try-with-resources, which keeps the first exception as primary.",
        },
        {
          mistake:
            "Expecting resources to be closed in the order they were opened.",
          fix: "They are closed in reverse order.",
        },
        {
          mistake: "Writing a `close()` that fails when called twice.",
          fix: "Make `close()` safe to call more than once.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Copying a file",
      scenario: "A program reads from one file and writes to another.",
      body: [
        "Open both the input and the output stream in one try-with-resources header. If the write fails, both streams are still closed, in reverse order, and the original failure is reported with any problems from closing attached as suppressed.",
        "The code stays short, and no file handle is leaked.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "twr-order",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'class R implements AutoCloseable {\n  final String n;\n  R(String n) { this.n = n; }\n  public void close() { System.out.print(n); }\n}\npublic class Main {\n  public static void main(String[] args) {\n    try (R a = new R("1"); R b = new R("2")) {\n      System.out.print("x");\n    }\n  }\n}',
      },
      options: ["x21", "x12", "12x"],
      answer: 0,
      explanation:
        "The body prints `x`, and then the resources are closed in reverse order, `2` and then `1`.",
    },
    {
      type: "single",
      id: "twr-interface",
      prompt:
        "Which interface must a resource in try-with-resources implement?",
      options: ["AutoCloseable", "Serializable", "Runnable"],
      answer: 0,
      explanation:
        "`AutoCloseable` has the `close()` method that Java calls automatically.",
    },
    {
      type: "truefalse",
      id: "twr-before-catch",
      statement: "Resources are closed after the `catch` block runs.",
      answer: false,
      explanation:
        "They are closed before any `catch` or `finally` block runs.",
    },
    {
      type: "single",
      id: "twr-suppressed",
      prompt:
        "What happens to an exception from `close()` when the body already threw one?",
      options: [
        "It is attached as suppressed",
        "It replaces the first one",
        "It is ignored without trace",
      ],
      answer: 0,
      explanation:
        "The first exception stays primary, and the second can be read with `getSuppressed()`.",
    },
  ],
  assignment: {
    title: "Convert to try-with-resources",
    task: [
      "Take a program that reads a file with `try/finally` and null checks, and rewrite it with try-with-resources.",
      "Write an `AutoCloseable` timer that prints how long a block took, and use it with two resources to see the order.",
    ],
    checklist: [
      "No explicit close call is left",
      "The timer prints when the block ends",
      "I can state the closing order",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "twr-ex",
      title: "A timer resource",
      task: [
        "Write `Timer implements AutoCloseable` that records the start time in its constructor and prints `label took N ms` in `close()`. Use it in `main` with try-with-resources around a short loop.",
      ],
      language: "java",
      starter: "public class TimerDemo {\n  // your code\n}",
      solution:
        'public class TimerDemo {\n  static class Timer implements AutoCloseable {\n    private final long start = System.nanoTime();\n    private final String label;\n\n    Timer(String label) {\n      this.label = label;\n    }\n\n    @Override\n    public void close() {\n      long ms = (System.nanoTime() - start) / 1_000_000;\n      System.out.println(label + " took " + ms + " ms");\n    }\n  }\n\n  public static void main(String[] args) {\n    try (Timer t = new Timer("loop")) {\n      long sum = 0;\n      for (int i = 0; i < 1000; i++) sum += i;\n      System.out.println(sum);\n    }\n  }\n}',
      hints: ["`close()` here cannot fail, so it needs no `throws` clause."],
      checklist: [
        "Timer implements AutoCloseable",
        "close() prints the elapsed time",
        "The timer is used in a try-with-resources header",
      ],
    },
  ],
  revisionNotes: [
    "try-with-resources closes `AutoCloseable` resources automatically, in reverse order",
    "Resources are closed before `catch` and `finally` run",
    "A failure in `close()` after a body failure becomes a suppressed exception",
    "Java 9+: `try (existingVariable)` for effectively final variables",
  ],
  resources: [
    {
      label: "The Java Tutorials: The try-with-resources Statement",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html",
    },
    {
      label: "Java SE API: AutoCloseable",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/AutoCloseable.html",
    },
  ],
})
