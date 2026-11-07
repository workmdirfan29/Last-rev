import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-exceptions", {
  slug: "custom-exceptions",
  title: "Custom exceptions and exception chaining",
  topic: "Custom exceptions",
  minutes: 40,
  overview:
    "Create your own exception classes, choose between checked and unchecked, and chain exceptions so no information is lost.",
  objectives: [
    "Write a custom exception with useful constructors and fields",
    "Choose checked or unchecked with a clear rule",
    "Chain exceptions with a cause and read the chain",
  ],
  prerequisites: ["lesson.java-exceptions.try-catch-finally"],
  sections: [
    {
      kind: "explain",
      heading: "Why create your own",
      body: [
        "Standard exceptions such as `IllegalArgumentException` fit many cases. Create your own when a failure has a **meaning in your domain** that callers may want to handle separately, such as `InsufficientBalanceException` or `OrderNotFoundException`. A custom type lets a caller catch exactly that problem, and it can carry data, such as the missing amount.",
        "Extend `Exception` for a **checked** exception, or `RuntimeException` for an **unchecked** one. Name the class after the problem and end the name with `Exception`. Give it constructors that take a message and, usually, a cause, and pass them to `super`.",
        "The rule from the Java Tutorials: if a client can reasonably recover, make it **checked**; if not, make it **unchecked**.",
      ],
    },
    {
      kind: "code",
      heading: "A custom exception",
      example: {
        title: "InsufficientBalanceException",
        language: "java",
        code: 'public class Main {\n  static class InsufficientBalanceException extends Exception {\n    private final double missing;\n\n    InsufficientBalanceException(double missing) {\n      super("Balance is short by " + missing);\n      this.missing = missing;\n    }\n\n    double getMissing() {\n      return missing;\n    }\n  }\n\n  static void withdraw(double balance, double amount) throws InsufficientBalanceException {\n    if (amount > balance) {\n      throw new InsufficientBalanceException(amount - balance);\n    }\n  }\n\n  public static void main(String[] args) {\n    try {\n      withdraw(100, 130);\n    } catch (InsufficientBalanceException e) {\n      System.out.println(e.getMessage() + " / " + e.getMissing());\n    }\n  }\n}',
        walkthrough: [
          "The class extends `Exception`, so it is checked and callers must handle it.",
          "The message goes to `super`, and the extra field lets the caller show the amount.",
          "`withdraw` declares the exception, and the `catch` block prints `Balance is short by 30.0 / 30.0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Chaining",
      body: [
        'When you catch a low-level exception and throw a more meaningful one, pass the original as the **cause**: `new UserNotLoadedException("Cannot load user 7", e)`. The stack trace then shows `Caused by:` with the original problem, and `getCause()` returns it. Without the cause, the information about what really failed is lost.',
        "Wrap an exception when you cross a **layer boundary**, so higher layers do not depend on low-level types such as `SQLException`. Do not wrap when the original exception is already meaningful, and do not wrap the same exception several times.",
        "Many standard exceptions have a constructor that takes a cause. If yours does not, call `initCause`.",
      ],
    },
    {
      kind: "code",
      heading: "Wrapping with a cause",
      example: {
        title: "Cause chain",
        language: "java",
        code: 'public class Main {\n  static class ConfigException extends RuntimeException {\n    ConfigException(String message, Throwable cause) {\n      super(message, cause);\n    }\n  }\n\n  static int loadPort(String text) {\n    try {\n      return Integer.parseInt(text);\n    } catch (NumberFormatException e) {\n      throw new ConfigException("Invalid port: " + text, e);\n    }\n  }\n\n  public static void main(String[] args) {\n    try {\n      loadPort("80x");\n    } catch (ConfigException e) {\n      System.out.println(e.getMessage());\n      System.out.println(e.getCause().getClass().getSimpleName());\n    }\n  }\n}',
        walkthrough: [
          "The low-level `NumberFormatException` is caught and replaced by a clearer `ConfigException`.",
          "The original is passed as the cause, so nothing is lost.",
          "The output is `Invalid port: 80x` and `NumberFormatException`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Creating a custom exception that adds nothing to a standard one.",
          fix: "Use `IllegalArgumentException` or `IllegalStateException` when they describe the problem.",
        },
        {
          mistake: "Not passing the cause to `super`.",
          fix: "Add a constructor with a cause, and use it when you wrap.",
        },
        {
          mistake: "Making every custom exception checked.",
          fix: "Use checked only when the caller can recover. Otherwise extend `RuntimeException`.",
        },
        {
          mistake:
            "Putting heavy logic or non-serialisable state in an exception.",
          fix: "Keep exceptions small. They carry facts about what went wrong.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A service layer",
      scenario:
        "A repository throws `SQLException`, and the web layer should not know about SQL.",
      body: [
        "The service catches `SQLException` and throws `OrderNotFoundException` or `OrderServiceException` with the original as the cause. The web layer handles the domain exceptions and turns them into responses.",
        "The log still shows the SQL problem through the cause chain.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "custom-extends",
      prompt: "Which class does a custom unchecked exception extend?",
      options: ["RuntimeException", "Exception", "Error"],
      answer: 0,
      explanation:
        "A custom exception that extends `Exception` is checked. Extending `RuntimeException` makes it unchecked.",
    },
    {
      type: "single",
      id: "custom-cause",
      prompt: "What does passing a cause to a new exception keep?",
      options: [
        "The original failure in the stack trace",
        "The original method name only",
        "Nothing",
      ],
      answer: 0,
      explanation:
        "The stack trace shows `Caused by:` with the original exception.",
    },
    {
      type: "truefalse",
      id: "custom-rule",
      statement: "A custom exception must always be checked.",
      answer: false,
      explanation:
        "Choose checked only if callers can reasonably recover. Otherwise unchecked is better.",
    },
    {
      type: "blank",
      id: "custom-suffix",
      prompt: "By convention, the name of an exception class ends with ___.",
      answer: "Exception",
      explanation: "For example `InsufficientBalanceException`.",
    },
  ],
  assignment: {
    title: "Design exceptions for a small service",
    task: [
      "Design a small `UserService` with a repository that throws `SQLException`.",
      "Create one checked and one unchecked custom exception, wrap the `SQLException` with its cause, and handle both in `main`.",
    ],
    checklist: [
      "The cause is kept",
      "I can justify checked versus unchecked for each",
      "No exception is swallowed",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "custom-ex",
      title: "Write a validation exception",
      task: [
        "Write `ValidationException` (unchecked) with a `field` name and a message, and a method `checkAge(int age)` that throws it for ages below 0 or above 150, naming the field `age`.",
      ],
      language: "java",
      starter: "public class Validation {\n  // your code\n}",
      solution:
        'public class Validation {\n  static class ValidationException extends RuntimeException {\n    private final String field;\n\n    ValidationException(String field, String message) {\n      super(message);\n      this.field = field;\n    }\n\n    String getField() {\n      return field;\n    }\n  }\n\n  static void checkAge(int age) {\n    if (age < 0 || age > 150) {\n      throw new ValidationException("age", "Age out of range: " + age);\n    }\n  }\n\n  public static void main(String[] args) {\n    try {\n      checkAge(200);\n    } catch (ValidationException e) {\n      System.out.println(e.getField() + ": " + e.getMessage());\n    }\n  }\n}',
      hints: [
        "Pass the message to `super`, and keep the field in a final field.",
      ],
      checklist: [
        "The class extends RuntimeException",
        "The field name is available to the handler",
        "Both bounds are checked",
      ],
    },
  ],
  revisionNotes: [
    "Create custom exceptions for domain failures: extend Exception (checked) or RuntimeException (unchecked)",
    "Constructors with a message and a cause, passed to `super`",
    "Checked if the caller can recover; unchecked otherwise",
    "Wrap at layer boundaries and always keep the cause",
  ],
  resources: [
    {
      label: "The Java Tutorials: How to Throw Exceptions",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/throwing.html",
    },
    {
      label: "The Java Tutorials: Chained Exceptions",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/chained.html",
    },
    {
      label: "The Java Tutorials: Unchecked Exceptions - The Controversy",
      url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html",
    },
  ],
})
