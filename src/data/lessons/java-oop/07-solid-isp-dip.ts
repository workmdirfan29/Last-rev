import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "solid-isp-dip",
  title: "SOLID (2): interface segregation, dependency inversion and injection",
  topic: "SOLID",
  minutes: 50,
  overview:
    "Apply the last two SOLID principles, understand dependency injection, and write code that is easy to test.",
  objectives: [
    "Split a fat interface into focused ones",
    "Explain dependency inversion and constructor injection",
    "Test a class by replacing its dependencies with fakes",
  ],
  prerequisites: ["lesson.java-oop.solid-srp-ocp-lsp"],
  sections: [
    {
      kind: "explain",
      heading: "Interface segregation",
      body: [
        "No class should be forced to **depend on or implement methods it does not use**. A large interface with many unrelated methods makes implementers write empty or exception-throwing methods. Split it into small, focused interfaces, such as `Reader` and `Writer`, so each class implements only the roles it has, and each client depends only on the methods it calls.",
        "A class can implement several small interfaces, so splitting costs little in Java. The standard library follows this: `Comparable`, `Iterable` and `Closeable` each describe one small capability.",
      ],
    },
    {
      kind: "code",
      heading: "Small interfaces",
      example: {
        title: "Reader and Writer",
        language: "java",
        code: 'public class Main {\n  interface Reader { String read(String id); }\n  interface Writer { void write(String id, String data); }\n\n  static class CacheView implements Reader {\n    public String read(String id) { return "cached " + id; }\n  }\n  static class Database implements Reader, Writer {\n    public String read(String id) { return "row " + id; }\n    public void write(String id, String data) { System.out.println("saved " + id); }\n  }\n\n  static void show(Reader reader) {\n    System.out.println(reader.read("7"));\n  }\n\n  public static void main(String[] args) {\n    show(new CacheView());\n    Database db = new Database();\n    show(db);\n    db.write("7", "x");\n  }\n}',
        walkthrough: [
          "`CacheView` is read-only, so it implements only `Reader`.",
          "`show` needs only reading, so it depends on `Reader` and accepts both classes.",
          "No class has an empty or unsupported method.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Dependency inversion and injection",
      body: [
        "**High-level code should depend on abstractions, not on concrete low-level classes.** An `OrderService` should depend on a `PaymentGateway` interface, not on `RazorpayGateway`. The details depend on the abstraction, and not the other way round.",
        "**Dependency injection** is the technique that supports it. An object does not create its dependencies with `new`. They are handed to it, usually through the **constructor**. A framework such as Spring can do the injection, but plain Java can too. Constructor injection makes the dependencies visible, allows `final` fields, and lets a test pass a fake.",
        "The principle is the design rule. The injection and the framework are ways to apply it.",
      ],
    },
    {
      kind: "code",
      heading: "Injection and a fake",
      example: {
        title: "Testing without the network",
        language: "java",
        code: 'public class Main {\n  interface PaymentGateway {\n    boolean charge(double amount);\n  }\n\n  static class OrderService {\n    private final PaymentGateway gateway;\n\n    OrderService(PaymentGateway gateway) {\n      this.gateway = gateway;\n    }\n\n    String checkout(double total) {\n      return gateway.charge(total) ? "paid" : "declined";\n    }\n  }\n\n  public static void main(String[] args) {\n    OrderService accepted = new OrderService(amount -> true);\n    OrderService declined = new OrderService(amount -> amount < 100);\n    System.out.println(accepted.checkout(500));\n    System.out.println(declined.checkout(500));\n  }\n}',
        walkthrough: [
          "`OrderService` knows only the `PaymentGateway` interface, and receives it in the constructor.",
          "In a test, a lambda is a fake gateway, so no network call is needed.",
          "The output is `paid` and `declined`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Implementing a large interface with methods that throw UnsupportedOperationException.",
          fix: "Split the interface.",
        },
        {
          mistake: "Creating dependencies with `new` inside a class.",
          fix: "Pass them in through the constructor.",
        },
        {
          mistake:
            "Confusing dependency inversion (a principle) with a framework.",
          fix: "The framework is one way to apply the idea.",
        },
        {
          mistake: "Creating an interface for every class.",
          fix: "Use interfaces at real boundaries, such as external systems.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Testing a checkout",
      scenario:
        "A checkout calls a payment provider over the network, and the tests are slow and fail when the network is down.",
      body: [
        "Extract a `PaymentGateway` interface, give `OrderService` the gateway through its constructor, and use a fake in tests. The tests become fast and reliable, and a new provider is one new class.",
        "The same idea applies to clocks, random numbers and email senders.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "isp-what",
      prompt: "What does interface segregation say?",
      options: [
        "Prefer several small interfaces over one large one",
        "Make every class an interface",
        "Interfaces must have one method only",
      ],
      answer: 0,
      explanation: "Clients should not depend on methods they do not use.",
    },
    {
      type: "single",
      id: "dip-what",
      prompt: "What does dependency inversion say?",
      options: [
        "Depend on abstractions, not on concrete classes",
        "Create all objects in one place with new",
        "Use static methods",
      ],
      answer: 0,
      explanation: "High-level code should depend on interfaces.",
    },
    {
      type: "truefalse",
      id: "di-framework",
      statement: "Dependency injection needs a framework such as Spring.",
      answer: false,
      explanation:
        "You can pass dependencies through constructors in plain Java. A framework only automates it.",
    },
    {
      type: "single",
      id: "di-benefit",
      prompt: "What is a main benefit of constructor injection?",
      options: [
        "The class can be tested with fakes",
        "It makes the code shorter always",
        "It removes the need for interfaces",
      ],
      answer: 0,
      explanation:
        "A test can supply a fake implementation without changing the class.",
    },
  ],
  assignment: {
    title: "Make a class testable",
    task: [
      "Take a class that creates a `new EmailSender()` inside its method and calls it.",
      "Extract an interface, inject it through the constructor, and write two tests with fakes, one for success and one for failure.",
    ],
    checklist: [
      "The class has no new for its dependency",
      "Both tests run without sending email",
      "The interface has one clear purpose",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "dip-ex",
      title: "Inject a clock",
      task: [
        "Write `interface Clock { long now(); }` and a class `Greeter` that gets a `Clock` in its constructor and returns `morning` when `now() < 12` and `later` otherwise. Test it with two fake clocks.",
      ],
      language: "java",
      starter: "public class ClockDemo {\n  // your code\n}",
      solution:
        'public class ClockDemo {\n  interface Clock {\n    long now();\n  }\n\n  static class Greeter {\n    private final Clock clock;\n\n    Greeter(Clock clock) {\n      this.clock = clock;\n    }\n\n    String greet() {\n      return clock.now() < 12 ? "morning" : "later";\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(new Greeter(() -> 9).greet());\n    System.out.println(new Greeter(() -> 15).greet());\n  }\n}',
      hints: ["The class never reads the real time. It only asks the clock."],
      checklist: [
        "The dependency is passed in the constructor",
        "Two fakes give two results",
        "No static call to the real time",
      ],
    },
  ],
  revisionNotes: [
    "ISP: small, focused interfaces; clients depend only on what they use",
    "DIP: depend on abstractions; DI passes dependencies in, usually via the constructor",
    "Fakes make tests fast and reliable",
    "Use interfaces at real boundaries, not for every class",
  ],
  resources: [
    {
      label: "The Java Tutorials: Interfaces",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html",
    },
    {
      label: "The Java Tutorials: Providing Constructors",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html",
    },
  ],
})
