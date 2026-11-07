import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-exceptions", {
  slug: "exception-hierarchy",
  title: "The exception hierarchy: checked, unchecked and errors",
  topic: "Hierarchy",
  minutes: 40,
  overview:
    "Learn what an exception is, how the exception classes are organised, and how checked and unchecked exceptions differ.",
  objectives: [
    "Describe Throwable, Error, Exception and RuntimeException",
    "Tell checked from unchecked exceptions and apply the catch-or-specify rule",
    "Use throw and throws correctly",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What an exception is",
      body: [
        "An **exception** is an event during the run of a program that breaks the normal flow of instructions, such as a missing file, a bad number or a failed network call. Java represents it with an **object** that holds the type of the problem, a message and the **stack trace**, the list of method calls that led to it.",
        "When an exception is thrown, the current method stops. The runtime looks up the call stack for code that handles the exception. If nothing handles it, the thread ends and the stack trace is printed. Handling exceptions lets a program report a problem or recover, instead of crashing, and keeps the error code apart from the normal logic.",
      ],
    },
    {
      kind: "diagram",
      heading: "The class tree",
      diagram: {
        kind: "table",
        title: "Where each exception class sits",
        headers: ["Class", "Meaning", "Must be handled?"],
        rows: [
          [
            "Throwable",
            "Root of everything that can be thrown",
            "Depends on the subclass",
          ],
          [
            "Error",
            "Serious problems of the JVM, such as OutOfMemoryError",
            "No, and normally not caught",
          ],
          [
            "Exception",
            "Conditions a program can handle, such as IOException",
            "Yes, unless it is a RuntimeException",
          ],
          [
            "RuntimeException",
            "Programming mistakes, such as NullPointerException",
            "No (unchecked)",
          ],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Checked and unchecked",
      body: [
        "A **checked exception** is a subclass of `Exception` that is not a `RuntimeException`, for example `IOException` and `SQLException`. The compiler enforces the **catch or specify** rule: code that can throw one must either catch it in a `try` statement or declare it with `throws`. If you do neither, the code does not compile.",
        "An **unchecked exception** is a `RuntimeException`, an `Error` or one of their subclasses. The compiler does not force you to handle them. `NullPointerException`, `IllegalArgumentException` and `ArrayIndexOutOfBoundsException` are unchecked. They usually show a bug in the code that should be fixed, not caught.",
        "The Java Tutorials give a simple rule: if a client can reasonably be expected to **recover** from the exception, make it checked, and if not, make it unchecked.",
      ],
    },
    {
      kind: "code",
      heading: "throw and throws",
      example: {
        title: "Declaring and throwing",
        language: "java",
        code: 'static int parseAge(String text) {\n  int age = Integer.parseInt(text);\n  if (age < 0) {\n    throw new IllegalArgumentException("Age is negative: " + age);\n  }\n  return age;\n}\n\nstatic String firstLine(Path p) throws IOException {\n  return Files.readAllLines(p).get(0);\n}',
        walkthrough: [
          "`throw` creates and throws one exception object at that point.",
          "`throws IOException` in the signature tells callers that they must handle a checked exception.",
          "`NumberFormatException` from `parseInt` is unchecked, so it needs no declaration.",
          "A caller of `firstLine` must catch `IOException` or declare it too.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Saying that Error is a subclass of Exception.",
          fix: "Both extend `Throwable`. They are separate branches.",
        },
        {
          mistake: "Catching `Throwable` or `Exception` in everyday code.",
          fix: "Catch the most specific exception that you can handle.",
        },
        {
          mistake:
            "Using exceptions for normal control flow, such as ending a loop.",
          fix: "Use conditions. Exceptions are for exceptional situations.",
        },
        {
          mistake:
            "Declaring `throws Exception` on every method to avoid handling.",
          fix: "Declare the specific exceptions, so callers know what can fail.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A file reader",
      scenario:
        "A program reads a configuration file that may be missing or damaged.",
      body: [
        "Reading the file can throw a checked `IOException`, so the method either catches it and uses defaults, or declares it so the caller decides. A missing argument, in contrast, is a bug, and throws an unchecked `IllegalArgumentException`.",
        "Choosing between the two shows what kind of problem you are dealing with.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "hier-root",
      prompt: "Which class is the root of everything that can be thrown?",
      options: ["Throwable", "Exception", "Error"],
      answer: 0,
      explanation: "`Throwable` has two branches: `Error` and `Exception`.",
    },
    {
      type: "multi",
      id: "hier-unchecked",
      prompt: "Which of these are unchecked?",
      options: [
        "NullPointerException",
        "IllegalArgumentException",
        "IOException",
        "OutOfMemoryError",
      ],
      answers: [0, 1, 3],
      explanation:
        "`IOException` is a checked exception. The others are `RuntimeException` or `Error` types.",
    },
    {
      type: "truefalse",
      id: "hier-error-exc",
      statement: "Error is a subclass of Exception.",
      answer: false,
      explanation: "Both `Error` and `Exception` extend `Throwable`.",
    },
    {
      type: "blank",
      id: "hier-keyword",
      prompt:
        "A method declares the checked exceptions it may pass to its caller with the keyword ___.",
      answer: "throws",
      explanation:
        "`throw` throws an object. `throws` is part of the method signature.",
    },
  ],
  assignment: {
    title: "Classify exceptions",
    task: [
      "Write down 12 exception classes, such as `IOException`, `NumberFormatException`, `SQLException` and `StackOverflowError`, and classify each as checked, unchecked or error.",
      "Check three of them in the Java API documentation, and write one example of when each is thrown.",
    ],
    checklist: [
      "Every class is in the right group",
      "I checked three of them in the API documentation",
      "I can explain the catch-or-specify rule",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "hier-ex",
      title: "Check or declare",
      task: [
        "Write a method `readFirstLine(Path path)` that returns the first line of a file and declares the checked exception that `Files.readAllLines` can throw. Add a `main` that catches it and prints a short message.",
      ],
      language: "java",
      starter:
        "import java.io.IOException;\nimport java.nio.file.*;\n\npublic class FirstLine {\n  // your code\n}",
      solution:
        'import java.io.IOException;\nimport java.nio.file.*;\n\npublic class FirstLine {\n  static String readFirstLine(Path path) throws IOException {\n    return Files.readAllLines(path).get(0);\n  }\n\n  public static void main(String[] args) {\n    try {\n      System.out.println(readFirstLine(Path.of("notes.txt")));\n    } catch (IOException e) {\n      System.out.println("Could not read the file: " + e.getMessage());\n    }\n  }\n}',
      hints: ["The method signature needs `throws IOException`."],
      checklist: [
        "The method declares IOException",
        "main catches the specific exception",
        "The message does not hide the cause",
      ],
    },
  ],
  revisionNotes: [
    "Throwable → Error (not handled) and Exception → RuntimeException (unchecked)",
    "Checked = catch or specify; unchecked = usually a bug",
    "`throw` throws an object; `throws` declares in the signature",
    "Catch the most specific exception you can handle",
  ],
  resources: [
    {
      label: "The Java Tutorials: Exceptions",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html",
    },
    {
      label: "The Java Tutorials: The Catch or Specify Requirement",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/catchOrDeclare.html",
    },
    {
      label: "Java SE API: Throwable",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html",
    },
  ],
})
