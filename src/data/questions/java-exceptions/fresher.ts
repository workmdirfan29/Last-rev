import { defineQuestions } from "../author"
import { g } from "../brief"

const E = "https://docs.oracle.com/javase/tutorial/essential/exceptions"
const API =
  "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang"

export default defineQuestions("java-exceptions", "fresher", [
  g({
    slug: "what-is-an-exception",
    topic: "Hierarchy",
    d: "easy",
    title: "What is an exception in Java and why do we handle it?",
    kw: [
      "exception",
      "Throwable",
      "error handling",
      "stack trace",
      "exceptional event",
    ],
    intent: "Checks that you know what an exception is before the syntax.",
    short:
      "An exception is an event that happens while a program runs and disrupts the normal flow of instructions, such as a missing file, a bad number or a failed network call. When it happens, Java creates an exception object that holds the type, a message and the stack trace, and throws it. The runtime then looks up the call stack for code that catches it. Handling exceptions lets a program report the problem or recover, instead of crashing, and keeps the error-handling code separate from the normal logic.",
    detail: [
      "All exceptions are objects of classes that extend `Throwable`.",
      "If nothing catches the exception, the thread ends and the stack trace is printed.",
      "Good handling means catching what you can deal with, and letting the rest move up.",
    ],
    ex: "A program that reads a user's file catches `FileNotFoundException` and asks for another path instead of stopping.",
    mistakes: [
      "Treating exceptions as normal control flow, for example to end a loop.",
      "Catching an exception and doing nothing.",
    ],
    follow: ["What is the difference between an Error and an Exception?"],
    points: [
      "An event that breaks normal flow",
      "An object that extends Throwable",
      "Propagates up the call stack until caught",
    ],
    notes:
      "Exception = object thrown at run time and propagated up the call stack.",
    src: [
      ["The Java Tutorials: What Is an Exception?", `${E}/definition.html`],
      ["The Java Tutorials: Exceptions", `${E}/index.html`],
    ],
  }),
  g({
    slug: "exception-hierarchy",
    topic: "Hierarchy",
    d: "easy",
    title: "Explain the exception class hierarchy in Java.",
    kw: ["Throwable", "Exception", "Error", "RuntimeException", "hierarchy"],
    intent: "Checks that you can draw the tree and say what each branch means.",
    short:
      "`Throwable` is the root of everything that can be thrown. It has two main branches. `Error` represents serious problems of the runtime that an application should not normally try to handle, such as `OutOfMemoryError` and `StackOverflowError`. `Exception` represents conditions that a program might want to handle. Under `Exception`, `RuntimeException` and its subclasses are unchecked exceptions, and all the other exceptions, such as `IOException`, are checked exceptions.",
    detail: [
      "Only `Throwable` and its subclasses can be used with `throw` and `catch`.",
      "`Exception` and `RuntimeException` are catchable, but catching them broadly hides bugs.",
      "The compiler enforces handling only for checked exceptions.",
    ],
    ex: "`FileNotFoundException` is a checked `IOException`, while `NullPointerException` is an unchecked `RuntimeException`.",
    mistakes: [
      "Saying that `Error` is a subclass of `Exception`. Both extend `Throwable`.",
      "Catching `Throwable` in ordinary application code.",
    ],
    follow: [
      "What is the difference between checked and unchecked exceptions?",
    ],
    points: [
      "Throwable → Error and Exception",
      "RuntimeException = unchecked",
      "Other Exception subclasses = checked",
    ],
    notes:
      "Throwable → {Error, Exception → {RuntimeException (unchecked), others (checked)}}.",
    src: [
      ["Java SE API: Throwable", `${API}/Throwable.html`],
      [
        "The Java Tutorials: The Catch or Specify Requirement",
        `${E}/catchOrDeclare.html`,
      ],
    ],
  }),
  g({
    slug: "checked-vs-unchecked",
    topic: "Hierarchy",
    d: "easy",
    title: "What is the difference between checked and unchecked exceptions?",
    kw: [
      "checked exception",
      "unchecked exception",
      "RuntimeException",
      "IOException",
      "catch or specify",
    ],
    intent: "Checks one of the most common Java interview questions.",
    short:
      "A checked exception is checked by the compiler: any code that can throw one must either catch it or declare it with `throws`, otherwise it does not compile. `IOException` and `SQLException` are examples, and they represent conditions outside the program's control that callers can reasonably recover from. An unchecked exception extends `RuntimeException` or `Error`, and the compiler does not force you to handle it. They usually show programming mistakes, such as `NullPointerException` or `IllegalArgumentException`, which you should fix instead of catch.",
    detail: [
      "Checked exceptions make the failure part of a method's signature.",
      "Many modern libraries use unchecked exceptions, to avoid long `throws` lists.",
      "You may still catch an unchecked exception when you can really handle it.",
    ],
    ex: '`Files.readString(path)` declares `IOException`, so the caller has to handle it, while `Integer.parseInt("x")` throws an unchecked `NumberFormatException`.',
    mistakes: [
      "Catching and ignoring a checked exception just to silence the compiler.",
      "Using checked exceptions for bugs that the caller cannot recover from.",
    ],
    follow: [
      "When would you create a checked and when an unchecked custom exception?",
    ],
    points: [
      "Checked: handle or declare",
      "Unchecked: RuntimeException and Error",
      "Unchecked usually means a bug",
    ],
    notes:
      "Checked = compiler forces handling. Unchecked = RuntimeException/Error.",
    src: [
      [
        "The Java Tutorials: The Catch or Specify Requirement",
        `${E}/catchOrDeclare.html`,
      ],
      [
        "The Java Tutorials: Unchecked Exceptions — The Controversy",
        `${E}/runtime.html`,
      ],
    ],
  }),
  g({
    slug: "error-vs-exception",
    topic: "Hierarchy",
    d: "easy",
    title: "What is the difference between an `Error` and an `Exception`?",
    kw: [
      "Error",
      "Exception",
      "OutOfMemoryError",
      "StackOverflowError",
      "recoverable",
    ],
    intent:
      "Checks that you know which problems a program should try to handle.",
    short:
      "Both extend `Throwable`. An `Exception` is a condition that an application can reasonably catch and handle, such as a missing file or invalid input. An `Error` signals a serious problem in the Java Virtual Machine or its environment, for example `OutOfMemoryError`, `StackOverflowError` or `NoClassDefFoundError`. Applications usually cannot recover from an `Error`, so they should not catch it, and the right response is normally to let the program fail, log it and fix the cause.",
    detail: [
      "`StackOverflowError` usually comes from endless recursion, which is a bug to fix.",
      "A `catch (Error e)` can be right in a framework that must report a failure and shut down cleanly.",
      "Errors are unchecked.",
    ],
    ex: "A method that calls itself without a stopping condition ends in `StackOverflowError`.",
    mistakes: [
      "Catching `OutOfMemoryError` and carrying on as if nothing happened.",
      "Believing that an `Error` is a kind of `Exception`.",
    ],
    follow: ["What causes StackOverflowError?"],
    points: [
      "Exception: handle it",
      "Error: serious JVM problem",
      "Both are Throwable",
    ],
    notes:
      "Exception = recoverable by the program. Error = serious JVM-level problem.",
    src: [
      ["Java SE API: Error", `${API}/Error.html`],
      ["Java SE API: Exception", `${API}/Exception.html`],
    ],
  }),
  g({
    slug: "common-runtime-exceptions",
    topic: "Hierarchy",
    d: "easy",
    title: "Which runtime exceptions do you see often, and what causes each?",
    kw: [
      "NullPointerException",
      "ArrayIndexOutOfBoundsException",
      "ClassCastException",
      "NumberFormatException",
      "IllegalArgumentException",
    ],
    intent: "Checks that you recognise the usual causes by name.",
    short:
      "`NullPointerException` happens when you use a reference that is `null`, for example calling a method on it. `ArrayIndexOutOfBoundsException` and `IndexOutOfBoundsException` come from an index that is outside the valid range. `ClassCastException` is a cast to a type that the object does not have. `NumberFormatException` comes from parsing text that is not a number. `IllegalArgumentException` is thrown for an argument that a method rejects. `ArithmeticException` is thrown by an integer division by zero. `ConcurrentModificationException` appears when a collection is changed during iteration.",
    detail: [
      "All of them are unchecked, and each points at a bug or at unvalidated input.",
      "Validate arguments early and throw `IllegalArgumentException` with a clear message.",
      "Since Java 14, helpful `NullPointerException` messages name the variable that was `null`.",
    ],
    ex: '`Integer.parseInt("12a")` throws `NumberFormatException`, and `10 / 0` throws `ArithmeticException`.',
    mistakes: [
      "Catching `NullPointerException` instead of checking for `null` or using `Optional` or `Objects.requireNonNull`.",
      "Forgetting that dividing a double by zero does not throw but gives infinity.",
    ],
    follow: ["How do you avoid a NullPointerException?"],
    points: [
      "NPE: null reference",
      "Index exceptions: out of range",
      "NumberFormatException: bad text",
    ],
    notes:
      "NPE, IndexOutOfBounds, ClassCast, NumberFormat, IllegalArgument, Arithmetic: all unchecked.",
    src: [
      [
        "Java SE API: RuntimeException (direct subclasses)",
        `${API}/RuntimeException.html`,
      ],
      ["Java SE API: NullPointerException", `${API}/NullPointerException.html`],
    ],
  }),
  g({
    slug: "throw-vs-throws",
    topic: "Hierarchy",
    d: "easy",
    title: "What is the difference between `throw` and `throws`?",
    kw: [
      "throw",
      "throws",
      "declare exception",
      "throw statement",
      "method signature",
    ],
    intent: "Checks that you do not mix up two similar words.",
    short:
      '`throw` is a statement that actually throws one exception object at that point, as in `throw new IllegalArgumentException("Age is negative")`. `throws` is a part of a method declaration that lists the checked exceptions the method may pass to its caller, as in `void read() throws IOException`. `throw` happens at run time inside the method body, and `throws` is information in the signature that the compiler uses to check the callers.',
    detail: [
      "A method can declare several exceptions, separated by commas.",
      "Unchecked exceptions need not be declared, though they can be, for documentation.",
      "An overriding method cannot declare broader checked exceptions than the method it overrides.",
    ],
    ex: "A `readConfig` method declares `throws IOException`, and inside it a check throws `IllegalStateException` if the file is empty.",
    code: [
      "throw and throws",
      'static void setAge(int age) {\n  if (age < 0) {\n    throw new IllegalArgumentException("Age is negative: " + age);\n  }\n}\n\nstatic String read(Path p) throws IOException {\n  return Files.readString(p);\n}',
      [
        "`throw` creates and throws the exception when the check fails.",
        "`throws IOException` tells callers that they must handle the checked exception.",
      ],
      "java",
    ],
    mistakes: [
      "Writing `throws new Exception()` or `throw IOException`.",
      "Declaring `throws Exception` on every method to avoid handling.",
    ],
    follow: [
      "Can you throw a checked exception from a method that does not declare it?",
    ],
    points: [
      "throw: the action, one object",
      "throws: the declaration of possible exceptions",
      "Checked exceptions must be declared or caught",
    ],
    notes: "`throw` = do it. `throws` = declare it.",
    src: [
      ["The Java Tutorials: How to Throw Exceptions", `${E}/throwing.html`],
      [
        "The Java Tutorials: Specifying the Exceptions Thrown by a Method",
        `${E}/catchOrDeclare.html`,
      ],
    ],
  }),
  g({
    slug: "try-catch-basics",
    topic: "try/catch/finally",
    d: "easy",
    title: "How does `try`/`catch` work?",
    kw: ["try", "catch", "exception handler", "stack unwinding", "getMessage"],
    intent:
      "Checks that you can handle an exception and know what runs afterwards.",
    short:
      "Code that might throw is placed in a `try` block. If an exception is thrown, the rest of the `try` block is skipped, and Java looks for the first `catch` block whose type matches the exception, and runs it. After the `catch` block, execution continues after the whole `try` statement. If no `catch` matches, the exception goes up to the caller. The exception object is available in the catch parameter, with methods such as `getMessage()` and `printStackTrace()`.",
    detail: [
      "Only the exceptions that match the declared type are caught, including its subclasses.",
      "Keep the `try` block as small as is practical, so you know what failed.",
      "Log the exception with its stack trace, not only the message.",
    ],
    ex: 'Parsing a number from a form field is wrapped in `try`, and the `catch` shows "Please enter a number".',
    code: [
      "Catching a bad number",
      'String input = "12a";\ntry {\n  int n = Integer.parseInt(input);\n  System.out.println("Parsed " + n);\n} catch (NumberFormatException e) {\n  System.out.println("Not a number: " + e.getMessage());\n}\nSystem.out.println("Done");',
      [
        "`parseInt` throws, so the `Parsed` line is skipped.",
        "The `catch` block runs and prints the message.",
        "The program then continues and prints `Done`.",
      ],
      "java",
    ],
    mistakes: [
      "Leaving the `catch` block empty.",
      "Putting a large amount of unrelated code inside one `try`.",
    ],
    follow: ["What happens if no catch block matches?"],
    points: [
      "First matching catch runs",
      "Rest of try is skipped",
      "Execution continues after the try statement",
    ],
    notes: "`try` runs the risky code; the first matching `catch` handles it.",
    src: [
      ["The Java Tutorials: The try Block", `${E}/try.html`],
      ["The Java Tutorials: The catch Blocks", `${E}/catch.html`],
    ],
  }),
  g({
    slug: "multiple-catch-order",
    topic: "try/catch/finally",
    d: "medium",
    title:
      "How do multiple `catch` blocks and the multi-catch syntax work? Does the order matter?",
    kw: [
      "multiple catch",
      "multi-catch",
      "specific before general",
      "unreachable catch",
      "pipe",
    ],
    intent: "Checks that you know the ordering rule the compiler enforces.",
    short:
      "A `try` can have several `catch` blocks, and Java checks them from top to bottom and runs the first that matches. So the more specific exception types must come before their superclasses, and if a general type such as `Exception` comes first, a later `catch` for a subclass is unreachable and the code does not compile. Since Java 7, one `catch` can handle several unrelated types with a pipe, `catch (IOException | SQLException e)`. The types in a multi-catch cannot be related by inheritance.",
    detail: [
      "In a multi-catch, the parameter is implicitly final.",
      "Use separate blocks when each type needs different handling.",
      "A catch for `Exception` last can serve as a safety net, but be careful not to hide bugs.",
    ],
    ex: "File code catches `FileNotFoundException` with a message for the user, then `IOException` for other read problems.",
    code: [
      "Specific first, then general",
      'try {\n  process(path);\n} catch (FileNotFoundException e) {\n  System.out.println("No such file");\n} catch (IOException | IllegalStateException e) {\n  System.out.println("Problem: " + e.getMessage());\n}',
      [
        "`FileNotFoundException` is a subclass of `IOException`, so it must come first.",
        "The second block is a multi-catch for two unrelated types.",
      ],
      "java",
    ],
    mistakes: [
      "Putting `catch (Exception e)` before a more specific catch, which is a compile error.",
      "Writing a multi-catch with a type and its own subclass.",
    ],
    follow: ["Why can you not catch a subclass after its superclass?"],
    points: [
      "Specific before general",
      "Multi-catch with |",
      "Types in multi-catch must be unrelated",
    ],
    notes:
      "Order catch blocks from most specific to most general. Use `A | B` for the same handling.",
    src: [
      [
        "The Java Tutorials: Catching and Handling Exceptions",
        `${E}/handling.html`,
      ],
      ["The Java Tutorials: The catch Blocks", `${E}/catch.html`],
    ],
  }),
  g({
    slug: "finally-block",
    topic: "try/catch/finally",
    d: "medium",
    title: "What does the `finally` block do? Does it always run?",
    kw: [
      "finally",
      "cleanup",
      "System.exit",
      "resource release",
      "return in finally",
    ],
    intent: "Checks that you know what finally guarantees and its limits.",
    short:
      "A `finally` block runs after the `try` block and any matching `catch`, whether or not an exception was thrown, and even if the `try` or `catch` contains a `return`. It is used for cleanup such as closing resources. It does not run when the JVM stops before reaching it, for example after `System.exit()`, a fatal JVM error, or when the thread is killed. If `finally` itself returns or throws, that replaces the outcome of the `try`.",
    detail: [
      "A `try` needs at least one `catch` or a `finally`.",
      "For resources, try-with-resources is a cleaner alternative.",
      "Avoid `return` and `throw` inside `finally`, because they hide the original result.",
    ],
    ex: "A method opens a connection, and `finally` closes it whether the query succeeds or fails.",
    code: [
      "finally runs even on return",
      'static int test() {\n  try {\n    return 1;\n  } finally {\n    System.out.println("cleanup");\n  }\n}\n\nSystem.out.println(test());',
      [
        "The `try` block returns `1`.",
        "Before the method actually returns, `finally` prints `cleanup`.",
        "The output is `cleanup` and then `1`.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that `finally` always runs, with no exceptions.",
      "Returning a value from `finally`, which overrides the real result or exception.",
    ],
    follow: ["What happens if the finally block throws an exception?"],
    points: [
      "Runs with or without an exception",
      "Does not run after System.exit",
      "Do not return from finally",
    ],
    notes:
      "`finally` = cleanup that runs on every normal exit path; not after `System.exit`.",
    src: [
      ["The Java Tutorials: The finally Block", `${E}/finally.html`],
      [
        "The Java Tutorials: Putting It All Together",
        `${E}/putItTogether.html`,
      ],
    ],
  }),
  g({
    slug: "return-in-try-and-finally",
    topic: "try/catch/finally",
    d: "hard",
    title:
      "What does this code print when both `try` and `finally` have a `return`?",
    kw: [
      "finally return",
      "return value",
      "try finally order",
      "puzzle",
      "overriding return",
    ],
    intent: "Checks that you can trace a classic puzzle about finally.",
    short:
      "A `return` inside `finally` wins. The `try` computes its return value first and holds it, then `finally` runs, and if `finally` executes its own `return`, that value replaces the earlier one and the method returns it. The same happens to an exception: a `return` in `finally` makes the thrown exception disappear. If `finally` only changes a local primitive variable without returning, the value already prepared by the `try` is unchanged.",
    detail: [
      "For an object, `finally` can change the object's contents, and the caller sees the change, because the reference was copied.",
      "This is why `return` in `finally` is considered bad practice, and most compilers and linters warn about it.",
      "Trace the order of events: evaluate the return expression, run `finally`, then leave.",
    ],
    ex: "A method with `try { return 1; } finally { return 2; }` returns `2`.",
    code: [
      "Which value is returned?",
      "static int a() {\n  try { return 1; } finally { return 2; }\n}\n\nstatic int b() {\n  int x = 1;\n  try { return x; } finally { x = 5; }\n}\n\nSystem.out.println(a());\nSystem.out.println(b());",
      [
        "In `a`, the `return 2` in `finally` replaces the value `1`, so the output is `2`.",
        "In `b`, the value `1` is saved before `finally` runs, so changing `x` later has no effect.",
        "The output is `2` and then `1`.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting `b()` to return `5`.",
      "Using `return` in `finally` and losing an exception.",
    ],
    follow: [
      "What happens to an exception thrown in try when finally returns?",
    ],
    points: [
      "The return value is computed first",
      "A return in finally overrides it",
      "Avoid return in finally",
    ],
    notes:
      "`return` in `finally` replaces the try's result and swallows exceptions.",
    src: [
      ["The Java Tutorials: The finally Block", `${E}/finally.html`],
      [
        "Java Language Specification: The try statement",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.2",
      ],
    ],
  }),
  g({
    slug: "final-finally-finalize",
    topic: "try/catch/finally",
    d: "easy",
    title: "What is the difference between `final`, `finally` and `finalize`?",
    kw: ["final", "finally", "finalize", "garbage collection", "deprecated"],
    intent: "Checks a classic question about three similar-sounding words.",
    short:
      "`final` is a modifier: a final variable can be assigned once, a final method cannot be overridden and a final class cannot be extended. `finally` is a block after `try` that holds cleanup code that runs whether or not an exception occurred. `finalize()` is a method of `Object` that the garbage collector used to call before reclaiming an object. It is deprecated for removal, because it is unpredictable and slow, and you should use try-with-resources or `Cleaner` instead.",
    detail: [
      "There is no guarantee that `finalize` runs at a specific time, or at all.",
      "Resources such as files and connections must be closed explicitly, and not left to the garbage collector.",
      "Mentioning that `finalize` is deprecated shows that you know current Java.",
    ],
    ex: "A `final` constant, a `finally` block that closes a file, and a legacy class that overrides `finalize` are three unrelated things.",
    mistakes: [
      "Relying on `finalize` to close files.",
      "Thinking that the three terms are related.",
    ],
    follow: ["What should you use instead of finalize?"],
    points: [
      "final: modifier",
      "finally: cleanup block",
      "finalize: deprecated GC hook",
    ],
    notes:
      "final = modifier, finally = block, finalize = deprecated method; close resources explicitly.",
    src: [
      ["The Java Tutorials: The finally Block", `${E}/finally.html`],
      ["Java SE API: Object.finalize", `${API}/Object.html#finalize()`],
    ],
  }),
  g({
    slug: "exception-propagation",
    topic: "try/catch/finally",
    d: "medium",
    title: "How does an exception propagate through the call stack?",
    kw: [
      "propagation",
      "call stack",
      "stack unwinding",
      "uncaught exception",
      "handler",
    ],
    intent:
      "Checks that you understand where an exception goes when a method does not catch it.",
    short:
      "When a method throws an exception and does not catch it, the method ends at once and the exception passes to the method that called it, and then to that method's caller, and so on, unwinding the call stack. At each level, Java looks for a matching `catch`. If one is found, the handler runs and normal execution resumes there. If the exception reaches the top of the thread's stack without being caught, the thread ends and the default handler prints the stack trace.",
    detail: [
      "`finally` blocks on the way up still run.",
      "This is why you should handle an exception at the level that can do something useful about it.",
      "In a web application, a central handler usually turns uncaught exceptions into an error response.",
    ],
    ex: "`controller → service → repository`: the repository throws, the service does not catch it, and the controller's handler returns an error message.",
    mistakes: [
      "Catching an exception at a low level, where nothing meaningful can be done, and hiding it.",
      "Forgetting that unchecked exceptions also propagate.",
    ],
    follow: ["Where should an exception be handled?"],
    points: [
      "Uncaught → goes to the caller",
      "finally blocks run on the way",
      "Handle where you can act",
    ],
    notes:
      "An uncaught exception unwinds the call stack until a matching `catch` is found.",
    src: [
      ["The Java Tutorials: Advantages of Exceptions", `${E}/advantages.html`],
      [
        "The Java Tutorials: Catching and Handling Exceptions",
        `${E}/handling.html`,
      ],
    ],
  }),
  g({
    slug: "reading-a-stack-trace",
    topic: "try/catch/finally",
    d: "easy",
    title: "How do you read a stack trace?",
    kw: [
      "stack trace",
      "printStackTrace",
      "Caused by",
      "line number",
      "debugging",
    ],
    intent: "Checks that you can find the cause of a failure quickly.",
    short:
      "A stack trace starts with the exception type and message, followed by one line per method call, from the place where it was thrown, at the top, down to the program's entry point. Each line shows the class, the method, the file and the line number. Read from the top to find where it happened, and look for the first line that is in your own code. If the trace has a `Caused by:` section, the lowest cause is usually the root problem.",
    detail: [
      "Lines from libraries and frameworks are often long, so scan for your package name.",
      'Log the whole exception with a logger, `log.error("message", e)`, and not only `e.getMessage()`.',
      "Suppressed exceptions appear as `Suppressed:` lines.",
    ],
    ex: "A trace ends with `Caused by: java.sql.SQLException: Connection refused`, which shows that the database was not reachable.",
    mistakes: [
      "Logging only the message and losing the stack trace.",
      "Reading only the last line and missing the `Caused by` section.",
    ],
    follow: ["What does Caused by tell you?"],
    points: [
      "Top: where it was thrown",
      "First line in your code",
      "Caused by: the root cause",
    ],
    notes: "Read from the top, find your own code, then check `Caused by`.",
    src: [
      [
        "Java SE API: Throwable.printStackTrace",
        `${API}/Throwable.html#printStackTrace()`,
      ],
      ["The Java Tutorials: Chained Exceptions", `${E}/chained.html`],
    ],
  }),
  g({
    slug: "swallowing-exceptions",
    topic: "try/catch/finally",
    d: "medium",
    title:
      "What is wrong with swallowing an exception? What should you do instead?",
    kw: [
      "swallow exception",
      "empty catch",
      "logging",
      "rethrow",
      "anti-pattern",
    ],
    intent: "Checks that you do not hide failures.",
    short:
      "Swallowing an exception means catching it and doing nothing, or only printing a vague message, so the failure is hidden and the program continues in a wrong state. The bug then appears later, far from its cause, and is very hard to find. Instead, handle the problem for real, for example by retrying or using a fallback, or log it with its stack trace and rethrow it, or let it propagate. If you really must ignore one, say why in a comment.",
    detail: [
      "Log and rethrow at the same level creates duplicate log lines, so do one or the other at each level.",
      "`e.printStackTrace()` is not real logging for an application.",
      "Catch `InterruptedException` carefully: restore the interrupt flag with `Thread.currentThread().interrupt()`.",
    ],
    ex: "A catch block that ignores a failed save makes the user think their data was stored.",
    code: [
      "Handle, wrap or propagate",
      'try {\n  repository.save(order);\n} catch (SQLException e) {\n  throw new OrderSaveException("Could not save order " + order.id(), e);\n}',
      [
        "The failure is not hidden.",
        "A clearer exception with context is thrown, and the original is kept as the cause.",
      ],
      "java",
    ],
    mistakes: [
      "An empty `catch` block.",
      "Catching and logging at every layer, producing the same error many times.",
    ],
    follow: ["How do you handle InterruptedException correctly?"],
    points: [
      "Hidden failures cause hidden bugs",
      "Log with the stack trace, or rethrow",
      "Keep the cause when wrapping",
    ],
    notes:
      "Never leave a catch empty: handle, wrap with the cause, or let it propagate.",
    src: [
      [
        "The Java Tutorials: Catching and Handling Exceptions",
        `${E}/handling.html`,
      ],
      ["The Java Tutorials: Chained Exceptions", `${E}/chained.html`],
    ],
  }),
  g({
    slug: "custom-exceptions",
    topic: "Custom exceptions",
    d: "easy",
    title: "How do you create a custom exception?",
    kw: [
      "custom exception",
      "extends Exception",
      "extends RuntimeException",
      "constructor",
      "serialVersionUID",
    ],
    intent: "Checks that you can model a domain error with its own type.",
    short:
      "Create a class that extends `Exception` for a checked exception, or `RuntimeException` for an unchecked one, and give it constructors that take a message and, usually, a cause. Name it after the problem and end the name with `Exception`, such as `InsufficientBalanceException`. A custom type lets callers catch exactly that failure, and it can carry useful fields, such as the missing amount.",
    detail: [
      "Pass the message and the cause to `super(...)`, so the stack trace chain is kept.",
      "Add fields only for data that callers need to react to the error.",
      "Do not create a new exception class when an existing one, such as `IllegalArgumentException`, describes it well.",
    ],
    ex: "A banking service throws `InsufficientBalanceException` with the missing amount, and the screen shows it.",
    code: [
      "A custom unchecked exception",
      'public class InsufficientBalanceException extends RuntimeException {\n  private final double missing;\n\n  public InsufficientBalanceException(double missing) {\n    super("Balance is short by " + missing);\n    this.missing = missing;\n  }\n\n  public double getMissing() {\n    return missing;\n  }\n}',
      [
        "It extends `RuntimeException`, so callers need not declare it.",
        "The message is passed to `super`.",
        "The extra field lets the caller show the amount.",
      ],
      "java",
    ],
    mistakes: [
      "Creating a custom exception that adds nothing over a standard one.",
      "Not passing the cause to `super`, which loses the original stack trace.",
    ],
    follow: ["When would you make a custom exception checked?"],
    points: [
      "Extend Exception or RuntimeException",
      "Constructors with message and cause",
      "Add fields callers need",
    ],
    notes:
      "Custom exception: extend `Exception` or `RuntimeException`, pass message and cause to `super`.",
    src: [
      ["The Java Tutorials: How to Throw Exceptions", `${E}/throwing.html`],
      ["The Java Tutorials: Chained Exceptions", `${E}/chained.html`],
    ],
  }),
  g({
    slug: "checked-or-unchecked-custom",
    topic: "Custom exceptions",
    d: "medium",
    title: "Should a custom exception be checked or unchecked?",
    kw: [
      "checked",
      "unchecked",
      "recoverable",
      "API design",
      "RuntimeException",
    ],
    intent: "Checks that you can decide with a rule and not by habit.",
    short:
      "The Java Tutorials give a simple rule: if a client can reasonably be expected to recover from the exception, make it checked, and if the client cannot do anything about it, make it unchecked. Checked exceptions force callers to consider the failure, which fits expected conditions such as a payment declined. Unchecked exceptions fit programming errors and conditions that most callers cannot handle locally. Many frameworks use unchecked exceptions to keep signatures clean, and handle them centrally.",
    detail: [
      "A long chain of `throws` through many layers is a sign that an unchecked exception may be better.",
      "Whichever you choose, document it in the Javadoc.",
      "A common pattern is to wrap a low-level checked exception into an unchecked domain one at a layer boundary.",
    ],
    ex: "`PaymentDeclinedException` is checked, so the checkout code must offer another payment method, while `InvalidConfigurationException` is unchecked.",
    mistakes: [
      "Making everything checked and having `throws` clauses everywhere.",
      "Making everything unchecked, so callers forget about failures they could handle.",
    ],
    follow: ["How do you convert a checked exception into an unchecked one?"],
    points: [
      "Recoverable → checked",
      "Not recoverable → unchecked",
      "Wrap at layer boundaries",
    ],
    notes: "Can the caller recover? Checked. Otherwise unchecked.",
    src: [
      [
        "The Java Tutorials: Unchecked Exceptions — The Controversy",
        `${E}/runtime.html`,
      ],
      [
        "The Java Tutorials: The Catch or Specify Requirement",
        `${E}/catchOrDeclare.html`,
      ],
    ],
  }),
  g({
    slug: "exception-chaining",
    topic: "Custom exceptions",
    d: "medium",
    title: "What is exception chaining and why keep the cause?",
    kw: [
      "exception chaining",
      "getCause",
      "initCause",
      "wrap exception",
      "Caused by",
    ],
    intent: "Checks that you do not lose the original error when wrapping.",
    short:
      'Exception chaining means that when you catch one exception and throw another, you pass the original as the cause of the new one, for example `new ServiceException("Cannot load user", e)`. The new exception has a clear, high-level meaning for your layer, and `getCause()` plus the `Caused by:` section of the stack trace still show the low-level reason. Without the cause, the information about what really failed is lost.',
    detail: [
      "Most exception classes have a constructor that accepts a cause. If not, use `initCause`.",
      "Wrap when crossing a layer boundary, so that callers do not depend on low-level exception types.",
      "Do not wrap when the original exception is already meaningful to the caller.",
    ],
    ex: "A repository catches `SQLException` and throws `UserNotLoadedException` with the `SQLException` as its cause.",
    code: [
      "Wrapping with a cause",
      'try {\n  return dao.find(id);\n} catch (SQLException e) {\n  throw new UserNotLoadedException("Cannot load user " + id, e);\n}',
      [
        "The new exception describes the problem in the language of this layer.",
        "The `SQLException` is passed as the cause and shows in the stack trace.",
      ],
      "java",
    ],
    mistakes: [
      "Throwing a new exception without the cause.",
      "Wrapping the same exception several times in the same call path.",
    ],
    follow: ["What does getCause return?"],
    points: [
      "Pass the original as the cause",
      "Keeps the root problem visible",
      "Wrap at layer boundaries",
    ],
    notes: "`new MyException(message, cause)` keeps the original failure.",
    src: [
      ["The Java Tutorials: Chained Exceptions", `${E}/chained.html`],
      ["Java SE API: Throwable", `${API}/Throwable.html`],
    ],
  }),
  g({
    slug: "exception-handling-best-practices",
    topic: "Custom exceptions",
    d: "medium",
    title: "What are good practices for exception handling?",
    kw: [
      "best practices",
      "specific exceptions",
      "fail fast",
      "logging",
      "clean up",
    ],
    intent: "Checks that you have a sensible approach and not only syntax.",
    short:
      "Catch the most specific exception that you can handle, and not a broad `Exception` or `Throwable`. Fail fast by validating inputs early and throwing a clear exception with a helpful message. Never swallow an exception, and log it once, with its stack trace, at the level that handles it. Keep the cause when you wrap. Release resources with try-with-resources. Do not use exceptions for normal control flow, and do not expose internal details, such as stack traces or SQL, to end users.",
    detail: [
      "Put useful data in the message, such as the id and the value that was wrong, but never passwords or personal data.",
      "Document the exceptions a method throws in its Javadoc with `@throws`.",
      "Handle each exception at the layer that can decide what to do.",
    ],
    ex: "A web service logs the full error on the server, and returns a short, safe message and an error code to the client.",
    mistakes: [
      "`catch (Exception e) {}` around large blocks of code.",
      "Showing a raw stack trace to a user.",
    ],
    follow: ["Why should you not use exceptions for control flow?"],
    points: [
      "Specific catches, fail fast",
      "Log once, keep the cause",
      "Do not leak internals",
    ],
    notes:
      "Be specific, fail fast, log once with the stack trace, keep the cause, close resources.",
    src: [
      ["The Java Tutorials: Exceptions", `${E}/index.html`],
      ["The Java Tutorials: Advantages of Exceptions", `${E}/advantages.html`],
    ],
  }),
  g({
    slug: "exceptions-in-method-overriding",
    topic: "Hierarchy",
    d: "hard",
    title: "What are the rules for exceptions when you override a method?",
    kw: [
      "overriding",
      "throws clause",
      "checked exception",
      "narrower exception",
      "Liskov",
    ],
    intent: "Checks that you know how exceptions interact with inheritance.",
    short:
      "An overriding method may declare the same checked exceptions as the method it overrides, narrower ones (subclasses), or none, but it cannot declare new or broader checked exceptions. The reason is that code written against the superclass handles only the exceptions that the superclass method declared, so a subclass must not surprise it. An overriding method is free to throw any unchecked exception. Constructors are not overridden, so the rule does not apply to them in the same way.",
    detail: [
      "If the parent method declares `throws IOException`, the child can declare `FileNotFoundException`, but not `Exception`.",
      "A child method that throws no checked exception is always allowed.",
      "The same logic applies to interface methods and their implementations.",
    ],
    ex: "`class Parent { void read() throws IOException {} }` can be overridden by `void read() throws FileNotFoundException` but not by `void read() throws Exception`.",
    mistakes: [
      "Declaring a broader checked exception in the overriding method.",
      "Thinking that the same restriction applies to unchecked exceptions.",
    ],
    follow: ["Why is this restriction needed?"],
    points: [
      "Same, narrower, or none",
      "Not broader checked exceptions",
      "Unchecked are always allowed",
    ],
    notes:
      "An override cannot throw broader checked exceptions than the original.",
    src: [
      [
        "The Java Tutorials: Overriding and Hiding Methods",
        "https://docs.oracle.com/javase/tutorial/java/IandI/override.html",
      ],
      [
        "Java Language Specification: Method Throws",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.8.3",
      ],
    ],
  }),
  g({
    slug: "try-with-resources",
    topic: "try-with-resources",
    d: "easy",
    title: "What is try-with-resources and why is it better than `finally`?",
    kw: [
      "try-with-resources",
      "AutoCloseable",
      "close",
      "resource leak",
      "Java 7",
    ],
    intent: "Checks that you close resources safely and with less code.",
    short:
      "Try-with-resources, added in Java 7, declares resources in parentheses after `try`, such as `try (BufferedReader r = Files.newBufferedReader(path)) { ... }`. Each resource must implement `AutoCloseable`, and Java closes it automatically when the block ends, whether normally or because of an exception. It replaces a long `try/finally` with null checks and nested `try` blocks, avoids forgetting `close`, and handles an exception thrown by `close` correctly.",
    detail: [
      "A `catch` or `finally` can still follow, and it runs after the resources are closed.",
      "Files, streams, database connections and sockets are typical resources.",
      "The resources are closed in the reverse order of their creation.",
    ],
    ex: "Reading a file line by line with a `BufferedReader` declared in the `try` header, with no explicit `close()`.",
    code: [
      "Automatic close",
      "static String firstLine(Path path) throws IOException {\n  try (BufferedReader reader = Files.newBufferedReader(path)) {\n    return reader.readLine();\n  }\n}",
      [
        "The reader is declared in the `try` parentheses.",
        "It is closed automatically after `return`, or if `readLine` throws.",
        "No `finally` block is needed.",
      ],
      "java",
    ],
    mistakes: [
      "Opening a resource outside the `try` and forgetting to close it.",
      "Writing a manual `finally` with `close()` that can itself throw and hide the first exception.",
    ],
    follow: ["What interface must a resource implement?"],
    points: [
      "Resources in the try header",
      "Closed automatically, in reverse order",
      "Replaces try/finally cleanup",
    ],
    notes: "`try (Resource r = ...) { }` closes `r` automatically.",
    src: [
      [
        "The Java Tutorials: The try-with-resources Statement",
        `${E}/tryResourceClose.html`,
      ],
      ["Java SE API: AutoCloseable", `${API}/AutoCloseable.html`],
    ],
  }),
  g({
    slug: "autocloseable-custom-resource",
    topic: "try-with-resources",
    d: "medium",
    title: "How do you make your own class work with try-with-resources?",
    kw: [
      "AutoCloseable",
      "Closeable",
      "close method",
      "custom resource",
      "idempotent close",
    ],
    intent: "Checks that you can apply the pattern to your own code.",
    short:
      "Implement `AutoCloseable`, which has one method, `void close() throws Exception`. You may narrow the signature to throw a more specific exception or none. Put the cleanup in `close()`, such as releasing a lock or ending a session, and make it safe to call more than once. Then the class can be used in a try-with-resources header. `Closeable` is the I/O version, whose `close` throws `IOException`, and it is a sub-interface of `AutoCloseable`.",
    detail: [
      "The documentation of `AutoCloseable` recommends that `close` should be idempotent, meaning that a second call has no extra effect.",
      "If `close` can fail, throw a specific exception, and the caller can see it.",
      "Use it for any scoped resource, such as a timer or a temporary file.",
    ],
    ex: "A `Timer` class prints how long a block took when it is closed.",
    code: [
      "A custom resource",
      'class Timer implements AutoCloseable {\n  private final long start = System.nanoTime();\n  private final String label;\n  Timer(String label) { this.label = label; }\n\n  @Override\n  public void close() {\n    long ms = (System.nanoTime() - start) / 1_000_000;\n    System.out.println(label + " took " + ms + " ms");\n  }\n}\n\ntry (Timer t = new Timer("load")) {\n  // work\n}',
      [
        "`Timer` implements `AutoCloseable`.",
        "`close` has no `throws`, because it cannot fail.",
        "The report is printed when the block ends.",
      ],
      "java",
    ],
    mistakes: [
      "Writing a `close` that fails if it is called twice.",
      "Putting the cleanup in a separate method that callers must remember to call.",
    ],
    follow: ["What is the difference between Closeable and AutoCloseable?"],
    points: [
      "Implement AutoCloseable",
      "close should be idempotent",
      "Closeable throws IOException",
    ],
    notes: "Implement `AutoCloseable.close()` and make it safe to call twice.",
    src: [
      ["Java SE API: AutoCloseable", `${API}/AutoCloseable.html`],
      [
        "The Java Tutorials: The try-with-resources Statement",
        `${E}/tryResourceClose.html`,
      ],
    ],
  }),
  g({
    slug: "multiple-resources-close-order",
    topic: "try-with-resources",
    d: "medium",
    title: "In what order are multiple resources closed in try-with-resources?",
    kw: [
      "multiple resources",
      "close order",
      "reverse order",
      "try-with-resources",
      "semicolon",
    ],
    intent:
      "Checks that you can predict the output of a try-with-resources with two resources.",
    short:
      "Several resources can be declared in the header, separated by semicolons. They are initialised in the order they are written, and closed in the opposite order, so the last one opened is the first one closed. This is important when one resource depends on another, because the dependent one is closed first. The resources are closed before any `catch` or `finally` block runs.",
    detail: [
      "If creating the second resource throws, the first one is still closed.",
      "An exception in one `close` does not stop the others from being closed.",
      "Resources are implicitly final in the header.",
    ],
    ex: "A `Connection` and a `Statement` created from it: the statement is closed before the connection.",
    code: [
      "Reverse order of closing",
      'class R implements AutoCloseable {\n  private final String name;\n  R(String name) { this.name = name; System.out.println("open " + name); }\n  public void close() { System.out.println("close " + name); }\n}\n\ntry (R a = new R("A"); R b = new R("B")) {\n  System.out.println("body");\n}',
      [
        "`A` and then `B` are opened, in the written order.",
        "The body runs.",
        "They are closed in reverse. The output is `open A`, `open B`, `body`, `close B`, `close A`.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting the resources to be closed in the order they were opened.",
      "Assuming that `catch` runs before the resources are closed.",
    ],
    follow: ["What if the second resource fails to open?"],
    points: [
      "Opened in order, closed in reverse",
      "Closed before catch and finally",
      "All are closed even if one fails",
    ],
    notes: "Resources close in reverse order, before any `catch` or `finally`.",
    src: [
      [
        "The Java Tutorials: The try-with-resources Statement",
        `${E}/tryResourceClose.html`,
      ],
      [
        "Java Language Specification: try-with-resources",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3",
      ],
    ],
  }),
  g({
    slug: "suppressed-exceptions",
    topic: "try-with-resources",
    d: "hard",
    title: "What are suppressed exceptions in try-with-resources?",
    kw: [
      "suppressed exception",
      "addSuppressed",
      "getSuppressed",
      "close exception",
      "primary exception",
    ],
    intent: "Checks that you know how two exceptions are reported at once.",
    short:
      "If the `try` body throws an exception, and then closing a resource also throws one, try-with-resources keeps the exception from the body as the primary exception and attaches the one from `close()` to it as a suppressed exception. You can read them with `getSuppressed()`, and they are printed in the stack trace under `Suppressed:`. With a manual `finally`, the exception from `close()` would replace the original and hide the real problem, which is why try-with-resources is safer.",
    detail: [
      "The methods are `Throwable.addSuppressed` and `Throwable.getSuppressed`.",
      "If the body does not throw, an exception from `close` is thrown normally as the primary one.",
      "With several resources, each failed `close` adds one more suppressed exception.",
    ],
    ex: "A failed write throws an `IOException`, and the following failure to close the file is attached as suppressed, so both appear in the log.",
    mistakes: [
      "Writing `finally { resource.close(); }` and losing the first exception when `close` throws.",
      "Not looking at the `Suppressed:` part of a stack trace.",
    ],
    follow: ["How would a manual finally lose the original exception?"],
    points: [
      "Body exception stays primary",
      "close exceptions are attached as suppressed",
      "Safer than a manual finally",
    ],
    notes:
      "Primary = exception from the body. Failures in `close()` become suppressed.",
    src: [
      [
        "The Java Tutorials: Suppressed Exceptions",
        `${E}/tryResourceClose.html`,
      ],
      [
        "Java SE API: Throwable.addSuppressed",
        `${API}/Throwable.html#addSuppressed(java.lang.Throwable)`,
      ],
    ],
  }),
  g({
    slug: "effectively-final-resources",
    topic: "try-with-resources",
    d: "medium",
    title: "Can you use an existing variable in try-with-resources?",
    kw: [
      "Java 9",
      "effectively final",
      "existing variable",
      "try-with-resources",
      "resource variable",
    ],
    intent: "Checks that you know a small improvement of newer Java versions.",
    short:
      "Since Java 9, you can use a variable that is declared earlier directly in the try header, as long as it is `final` or effectively final, meaning that it is never reassigned: `try (reader) { ... }`. Before Java 9 you had to declare the resource inside the parentheses. The resource is still closed automatically at the end of the block. This is helpful when the resource is created elsewhere, for example by a method parameter.",
    detail: [
      "The variable can still be used after the block, but it is already closed.",
      "It must not be reassigned anywhere in the method.",
      "This does not change the closing order or the suppressed exception behaviour.",
    ],
    ex: "A method receives a `BufferedReader` parameter and uses `try (reader)` to make sure that it is closed.",
    code: [
      "An existing variable as a resource",
      "static String firstLine(BufferedReader reader) throws IOException {\n  try (reader) {\n    return reader.readLine();\n  }\n}",
      [
        "`reader` is a parameter that is never reassigned, so it is effectively final.",
        "It is used directly in the header and is closed when the block ends.",
      ],
      "java",
    ],
    mistakes: [
      "Reassigning the variable and then using it as a resource.",
      "Using it after the block, when it is already closed.",
    ],
    follow: ["Who should close a resource that was passed in as a parameter?"],
    points: [
      "Java 9+ allows try (existingVariable)",
      "Must be final or effectively final",
      "Still closed automatically",
    ],
    notes: "Java 9+: `try (reader) { ... }` for an effectively final variable.",
    src: [
      [
        "The Java Tutorials: The try-with-resources Statement",
        `${E}/tryResourceClose.html`,
      ],
      [
        "Java Language Specification: try-with-resources",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3",
      ],
    ],
  }),
  g({
    slug: "optional-and-null-handling",
    topic: "Hierarchy",
    d: "medium",
    title: "How do you avoid a `NullPointerException` in practice?",
    kw: [
      "NullPointerException",
      "null check",
      "Optional",
      "Objects.requireNonNull",
      "defensive",
    ],
    intent:
      "Checks that you have practical habits and not only the definition.",
    short:
      'Validate arguments at the start of a method with `Objects.requireNonNull(value, "value must not be null")`, so a failure happens early with a clear message. Do not return `null` for "nothing" when a method can return an empty collection, an empty string or an `Optional`. Use `Optional` for return values that may be absent, and not for fields or parameters. Check for `null` before use where it is a legitimate value, put the literal first in comparisons, as in `"yes".equals(answer)`, and prefer immutable objects that are created fully initialised.',
    detail: [
      "Since Java 14, the message of a `NullPointerException` tells you which variable or method result was `null`.",
      "Annotations such as `@Nullable` and `@NonNull` from tools help static checkers find problems.",
      "Never catch `NullPointerException` to hide a bug.",
    ],
    ex: "A search method returns `List.of()` when nothing is found, so the caller can loop without a null check.",
    code: [
      "Early checks and safe returns",
      'String normalise(String name) {\n  Objects.requireNonNull(name, "name must not be null");\n  return name.trim().toLowerCase();\n}\n\nList<Order> ordersFor(String user) {\n  return found ? orders : List.of();\n}\n\nboolean yes = "yes".equals(answer);',
      [
        "`requireNonNull` fails fast with a clear message.",
        "A method returns an empty list instead of `null`.",
        "Calling `equals` on the literal never throws a `NullPointerException`.",
      ],
      "java",
    ],
    mistakes: [
      "Returning `null` for an empty collection.",
      "Using `Optional.get()` without checking, which can also throw.",
    ],
    follow: ["When should you use Optional?"],
    points: [
      "Fail fast with requireNonNull",
      "Return empty collections or Optional",
      "Literal first in equals",
    ],
    notes:
      '`Objects.requireNonNull`, empty collections instead of null, `"x".equals(s)`.',
    src: [
      [
        "Java SE API: Objects.requireNonNull",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html",
      ],
      ["Java SE API: NullPointerException", `${API}/NullPointerException.html`],
    ],
  }),
])
