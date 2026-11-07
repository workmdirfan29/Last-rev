import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-exceptions", {
  slug: "try-catch-finally",
  title: "try, catch, finally and the order of execution",
  topic: "try/catch/finally",
  minutes: 45,
  overview:
    "Handle exceptions with try, catch and finally, order the catch blocks, use multi-catch, and predict what runs when.",
  objectives: [
    "Write try, catch and finally and trace the flow",
    "Order catch blocks from specific to general and use multi-catch",
    "Rethrow, wrap and log exceptions without hiding the cause",
  ],
  prerequisites: ["lesson.java-exceptions.exception-hierarchy"],
  sections: [
    {
      kind: "explain",
      heading: "try, catch and finally",
      body: [
        "Code that might throw goes in a `try` block. If an exception is thrown, the rest of the block is skipped and Java looks for the first `catch` block whose type matches the exception, and runs it. The exception is available in the catch parameter, with methods such as `getMessage()` and `printStackTrace()`.",
        "A `finally` block runs after the `try` block and any matching `catch`, **whether or not** an exception happened, and even if there is a `return` in the `try` or `catch`. It is used for cleanup. It does not run if the JVM stops first, for example after `System.exit()`.",
        "A `try` needs at least one `catch` block or a `finally` block.",
      ],
    },
    {
      kind: "code",
      heading: "The flow",
      example: {
        title: "Which blocks run",
        language: "java",
        code: 'public class Main {\n  static int test(String text) {\n    try {\n      return Integer.parseInt(text);\n    } catch (NumberFormatException e) {\n      System.out.println("bad number");\n      return -1;\n    } finally {\n      System.out.println("finally");\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(test("12"));\n    System.out.println(test("x"));\n  }\n}',
        walkthrough: [
          'For `"12"`, the `try` returns `12`, and `finally` still runs before the method returns.',
          'For `"x"`, `parseInt` throws, the `catch` block prints and returns `-1`, and `finally` runs again.',
          "The output is `finally`, `12`, `bad number`, `finally`, `-1`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Several catch blocks",
      body: [
        "A `try` can have several `catch` blocks. Java checks them from top to bottom and runs the first one that matches. So **the more specific type must come first**. If a general type such as `Exception` is first, a later `catch` for a subclass can never run, and the code does not compile.",
        "Since Java 7, one `catch` can handle several unrelated exception types with a pipe: `catch (IOException | SQLException e)`. The types must not be related by inheritance, and the parameter is implicitly final.",
        "Keep the `try` block small, so you know which statement failed, and handle each kind of failure at a level that can do something useful about it.",
      ],
    },
    {
      kind: "code",
      heading: "Order and multi-catch",
      example: {
        title: "Specific first",
        language: "java",
        code: 'import java.io.*;\n\npublic class Main {\n  static void read(boolean missing) throws IOException {\n    if (missing) throw new FileNotFoundException("no file");\n    throw new IOException("disk problem");\n  }\n\n  public static void main(String[] args) {\n    for (boolean missing : new boolean[] {true, false}) {\n      try {\n        read(missing);\n      } catch (FileNotFoundException e) {\n        System.out.println("missing: " + e.getMessage());\n      } catch (IOException | IllegalStateException e) {\n        System.out.println("other: " + e.getMessage());\n      }\n    }\n  }\n}',
        walkthrough: [
          "`FileNotFoundException` is a subclass of `IOException`, so it is caught first.",
          "The second block catches `IOException` and `IllegalStateException` with the same handler.",
          "The output is `missing: no file` and then `other: disk problem`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Do not hide the failure",
      body: [
        "An **empty catch block**, or one that only prints a vague message, hides the failure. The program continues in a wrong state, and the bug appears later, far from its cause. Handle the problem for real, for example with a fallback, or log it **with its stack trace**, and rethrow it, or let it propagate.",
        'When you catch a low-level exception and throw a more meaningful one, pass the original as the **cause**: `throw new ConfigException("Cannot load config", e)`. The stack trace then shows both. Log an exception once, at the level that handles it, and not at every layer.',
        "A `return` or `throw` inside `finally` replaces the result or exception of the `try`, and hides the original problem. Avoid it.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "An empty catch block.",
          fix: "Log with the stack trace, handle it, or rethrow.",
        },
        {
          mistake:
            "Putting `catch (Exception e)` before specific catch blocks.",
          fix: "Put specific types first. Otherwise the code does not compile.",
        },
        {
          mistake: "Returning a value from `finally`.",
          fix: "It overrides the `try` result and swallows exceptions. Use `finally` only for cleanup.",
        },
        {
          mistake: "Wrapping an exception without the cause.",
          fix: "Pass the original exception as the cause.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Parsing a form field",
      scenario:
        "A web form field gives text that should be a whole number, and users type letters.",
      body: [
        "Catch `NumberFormatException` where the text is parsed, give the user a clear message, and keep the program running. Do not catch it far away where the context is lost.",
        "`finally` is not needed here. Use it when something must be released, such as a connection.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "tcf-order",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'try {\n  System.out.println("try");\n  throw new RuntimeException();\n} catch (RuntimeException e) {\n  System.out.println("catch");\n} finally {\n  System.out.println("finally");\n}',
      },
      options: ["try, catch, finally", "try, finally", "catch, finally"],
      answer: 0,
      explanation:
        "The exception moves control to the `catch` block, and `finally` runs last.",
    },
    {
      type: "output",
      id: "tcf-return",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'public class Main {\n  static int f() {\n    try {\n      return 1;\n    } finally {\n      System.out.println("cleanup");\n    }\n  }\n  public static void main(String[] a) {\n    System.out.println(f());\n  }\n}',
      },
      options: ["cleanup then 1", "1 then cleanup", "1 only"],
      answer: 0,
      explanation:
        "`finally` runs before the method actually returns, so `cleanup` is printed first.",
    },
    {
      type: "single",
      id: "tcf-order-rule",
      prompt:
        "Why does `catch (Exception e)` before `catch (IOException e)` not compile?",
      options: [
        "The second block could never run",
        "Exception is final",
        "IOException is a checked type",
      ],
      answer: 0,
      explanation:
        "A general type catches everything that the specific one would, so the later block is unreachable.",
    },
    {
      type: "truefalse",
      id: "tcf-exit",
      statement: "A `finally` block always runs, even after `System.exit()`.",
      answer: false,
      explanation: "`System.exit()` stops the JVM, so `finally` does not run.",
    },
  ],
  assignment: {
    title: "Trace the flow",
    task: [
      "Write six small `try/catch/finally` programs with returns, rethrows and nested blocks.",
      "Predict the output of each on paper before you run it, and explain any difference.",
    ],
    checklist: [
      "I predicted before running",
      "I tried a return inside finally and explained the result",
      "I used the cause when wrapping an exception",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "tcf-ex",
      title: "Safe parse",
      task: [
        "Write `static int parseOrDefault(String text, int fallback)` that returns the parsed number, or `fallback` if the text is not a number. Print a short message when the fallback is used.",
      ],
      language: "java",
      starter: "public class Parser {\n  // your code\n}",
      solution:
        'public class Parser {\n  static int parseOrDefault(String text, int fallback) {\n    try {\n      return Integer.parseInt(text.trim());\n    } catch (NumberFormatException e) {\n      System.out.println("Not a number: " + text);\n      return fallback;\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(parseOrDefault("42", 0));\n    System.out.println(parseOrDefault("x", 0));\n  }\n}',
      hints: ["Catch the specific exception that `parseInt` throws."],
      checklist: [
        "A valid number is returned",
        "Text that is not a number gives the fallback",
        "No empty catch block",
      ],
    },
  ],
  revisionNotes: [
    "First matching catch runs; specific types before general ones",
    "`finally` runs on every normal path, but not after System.exit",
    "Multi-catch: `catch (A | B e)`; never leave a catch empty",
    "Wrap with the cause; log once with the stack trace",
  ],
  resources: [
    {
      label: "The Java Tutorials: The try Block",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/try.html",
    },
    {
      label: "The Java Tutorials: The finally Block",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html",
    },
    {
      label: "The Java Tutorials: Catching and Handling Exceptions",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html",
    },
  ],
})
