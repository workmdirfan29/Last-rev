import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "interfaces",
  title: "Interfaces: contracts, default methods and functional interfaces",
  topic: "Interfaces",
  minutes: 70,
  overview:
    "Define and implement interfaces, use default and static methods, resolve conflicts, and write functional interfaces.",
  objectives: [
    "Define and implement interfaces and use them as types",
    "Use default, static and private interface methods",
    "Resolve a default method conflict and write a functional interface",
  ],
  prerequisites: ["lesson.java-oop.abstract-classes-and-encapsulation"],
  sections: [
    {
      kind: "explain",
      heading: "What an interface is",
      body: [
        "An **interface** is a contract: it lists methods that implementing classes must provide, without saying how. A class uses `implements`, and can implement **several** interfaces. An interface is also a **type**: you can write `PaymentGateway gateway = new RazorpayGateway();` and use the variable without knowing the class.",
        "Interface methods are `public` and abstract unless they are `default`, `static` or `private`. Interface fields are constants (`public static final`). An interface has no constructors and no instance state. An interface can extend one or more interfaces.",
        "Program against interfaces at real boundaries: external systems, storage, and anything that you want to replace in tests.",
      ],
    },
    {
      kind: "explain",
      heading: "default, static and private methods",
      body: [
        "Since Java 8, an interface can have **default methods** with a body, which every implementing class inherits unless it overrides them. They were added so that existing interfaces, such as `List`, could get new methods without breaking all implementations. An interface can also have **static methods**, called with the interface name, and, since Java 9, **private methods** that share code between default methods.",
        "If a class inherits the same default method from two interfaces, it **must override** the method and can choose a parent with `InterfaceName.super.method()`. A method in a class always wins over a default method of an interface.",
      ],
    },
    {
      kind: "code",
      heading: "Default methods and conflicts",
      example: {
        title: "A conflict resolved",
        language: "java",
        code: 'public class Main {\n  interface Bird {\n    default String move() { return "fly"; }\n  }\n  interface Swimmer {\n    default String move() { return "swim"; }\n    static Swimmer of() { return new Swimmer() {}; }\n  }\n  static class Duck implements Bird, Swimmer {\n    @Override\n    public String move() {\n      return Bird.super.move() + " and " + Swimmer.super.move();\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(new Duck().move());\n    System.out.println(Swimmer.of().move());\n  }\n}',
        walkthrough: [
          "Both interfaces give `move` a default body, so `Duck` must override it.",
          "`Bird.super.move()` picks one parent's version explicitly.",
          "`Swimmer.of()` is a static method on the interface. The output is `fly and swim` and `swim`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Functional interfaces and design",
      body: [
        "A **functional interface** has exactly one abstract method, so a lambda can implement it. `@FunctionalInterface` makes the compiler check the rule. Examples are `Runnable`, `Comparator` and `Function`.",
        "Keep interfaces **small and focused**. A large interface forces implementers to write methods they do not need, which is why the Interface Segregation Principle says to split it. A marker interface has no methods and only tags a class, such as `Serializable`.",
        "Choose an interface for a **capability** that unrelated classes can share, and an abstract class for a family of related classes with shared code and state.",
      ],
    },
    {
      kind: "code",
      heading: "A custom functional interface",
      example: {
        title: "Discount",
        language: "java",
        code: "public class Main {\n  @FunctionalInterface\n  interface Discount {\n    double apply(double price);\n\n    default Discount then(Discount next) {\n      return p -> next.apply(apply(p));\n    }\n  }\n\n  public static void main(String[] args) {\n    Discount tenPercent = p -> p * 0.9;\n    Discount minusFifty = p -> p - 50;\n    System.out.println(tenPercent.then(minusFifty).apply(500));\n  }\n}",
        walkthrough: [
          "`Discount` has one abstract method, so lambdas can implement it.",
          "The default method `then` combines two discounts into one.",
          "`500` becomes `450` and then `400`, so the output is `400.0`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting `public` when implementing an interface method.",
          fix: "Interface methods are public, so the implementation must be public.",
        },
        {
          mistake: "Writing one huge interface for a whole service.",
          fix: "Split it into small, focused interfaces.",
        },
        {
          mistake: "Ignoring a default method conflict.",
          fix: "Override the method and choose with `Interface.super.method()`.",
        },
        {
          mistake: "Calling a static interface method through an object.",
          fix: "Call it with the interface name.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Notification channels",
      scenario: "An application sends notifications by email, SMS and push.",
      body: [
        "Define `Channel` with `send(Message)`. Each channel implements it. The application holds a `List<Channel>` and sends to all of them. In tests, a fake `Channel` records the messages.",
        "A new channel is a new class, and nothing else changes.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "if-multiple",
      prompt: "How many interfaces can a class implement?",
      options: ["Any number", "One", "Two"],
      answer: 0,
      explanation:
        "A class can implement many interfaces, but extend only one class.",
    },
    {
      type: "single",
      id: "if-default",
      prompt: "Why were default methods added in Java 8?",
      options: [
        "To add methods to existing interfaces without breaking implementations",
        "To make interfaces faster",
        "To allow constructors",
      ],
      answer: 0,
      explanation: "They let interfaces such as `List` evolve.",
    },
    {
      type: "truefalse",
      id: "if-fields",
      statement: "Fields declared in an interface are constants.",
      answer: true,
      explanation: "They are implicitly `public static final`.",
    },
    {
      type: "output",
      id: "if-lambda",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'interface Op { int apply(int a, int b); }\npublic class Main {\n  public static void main(String[] args) {\n    Op add = (a, b) -> a + b;\n    Op mul = (a, b) -> a * b;\n    System.out.println(add.apply(2, 3) + " " + mul.apply(2, 3));\n  }\n}',
      },
      options: ["5 6", "6 5", "5 5"],
      answer: 0,
      explanation: "A lambda implements the single abstract method.",
    },
  ],
  assignment: {
    title: "Design a plug-in point",
    task: [
      "Define an interface `Exporter` with a method `export(List<String>)`, and write `CsvExporter` and `JsonExporter`.",
      "Add a default method that exports a single item, and a lambda-based exporter for tests.",
    ],
    checklist: [
      "The calling code uses only the interface",
      "A default method is used",
      "A lambda exporter is used in a test",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "if-ex",
      title: "An interface with a default method",
      task: [
        "Write `interface Greeter` with an abstract `name()` and a default `greet()` that returns `Hello, ` plus the name. Implement it with a lambda-style class or anonymous class and print the greeting.",
      ],
      language: "java",
      starter: "public class GreeterDemo {\n  // your code\n}",
      solution:
        'public class GreeterDemo {\n  interface Greeter {\n    String name();\n\n    default String greet() {\n      return "Hello, " + name();\n    }\n  }\n\n  public static void main(String[] args) {\n    Greeter g = () -> "Asha";\n    System.out.println(g.greet());\n  }\n}',
      hints: [
        "An interface with one abstract method can be written as a lambda.",
      ],
      checklist: [
        "The default method uses the abstract one",
        "The greeting is Hello, Asha",
        "No class is needed for the lambda",
      ],
    },
  ],
  revisionNotes: [
    "Interface = contract and a type; a class can implement many",
    "default, static and private methods; resolve conflicts with `Iface.super.method()`",
    "Functional interface = one abstract method",
    "Keep interfaces small; interface for capability, abstract class for shared code",
  ],
  resources: [
    {
      label: "The Java Tutorials: Interfaces",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html",
    },
    {
      label: "The Java Tutorials: Default Methods",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html",
    },
    {
      label:
        "The Java Tutorials: Multiple Inheritance of State, Implementation, and Type",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/multipleinheritance.html",
    },
  ],
})
