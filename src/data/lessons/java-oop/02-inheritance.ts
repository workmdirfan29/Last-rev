import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "inheritance",
  title: "Inheritance, super, final and composition",
  topic: "Inheritance",
  minutes: 80,
  overview:
    "Extend classes, call parent constructors and methods, understand construction order and the final keyword, and decide between inheritance and composition.",
  objectives: [
    "Write a subclass that reuses and changes behaviour",
    "Predict the order of constructors and the use of super",
    "Choose between inheritance and composition",
  ],
  prerequisites: ["lesson.java-oop.classes-and-objects"],
  sections: [
    {
      kind: "explain",
      heading: "extends and super",
      body: [
        "**Inheritance** lets a class, the **subclass**, take the fields and methods of another class, the **superclass**, with `extends`, and add or change behaviour. It models an *is-a* relationship: a `Car` is a `Vehicle`. Java allows a class to extend **only one** class, and every class extends `Object`.",
        "`super` refers to the superclass. `super(...)` calls its constructor, and must be the first statement of a constructor. If you do not write it, the compiler inserts `super()`, which fails if the parent has no no-argument constructor. `super.method()` calls the parent's version of a method.",
        "Private members of the superclass exist in the object but cannot be used by name in the subclass. Use `protected` for members that subclasses may need, and prefer methods over exposing fields.",
      ],
    },
    {
      kind: "code",
      heading: "Construction order",
      example: {
        title: "Parent first",
        language: "java",
        code: 'public class Main {\n  static class Animal {\n    Animal() {\n      System.out.println("Animal");\n    }\n\n    String sound() {\n      return "...";\n    }\n  }\n\n  static class Dog extends Animal {\n    Dog() {\n      System.out.println("Dog");\n    }\n\n    @Override\n    String sound() {\n      return super.sound() + "Woof";\n    }\n  }\n\n  public static void main(String[] args) {\n    Animal a = new Dog();\n    System.out.println(a.sound());\n  }\n}',
        walkthrough: [
          "Creating a `Dog` first runs the `Animal` constructor, through the implicit `super()`.",
          "Then the rest of the `Dog` constructor runs.",
          "`sound` is overridden and calls the parent version with `super.sound()`. The output is `Animal`, `Dog`, `...Woof`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "final and the limits of inheritance",
      body: [
        "`final` on a **variable** means it is assigned only once. On a **method** it cannot be overridden. On a **class** it cannot be extended, as with `String`. Use `final` to protect behaviour and to build immutable classes.",
        "A subclass should be usable wherever its parent is expected, with the same promises. Overriding a method to throw `UnsupportedOperationException`, or to do something that surprises callers, breaks this. Calling an overridable method from a constructor is risky, because it can run before the subclass has initialised its fields.",
        "Inheritance also **couples** the subclass tightly to the parent: a change in the parent can break every child.",
      ],
    },
    {
      kind: "explain",
      heading: "Composition",
      body: [
        "**Composition** means a class holds a reference to another object and **delegates** work to it. It models *has-a*: a `Car` has an `Engine`. It is more flexible than inheritance, because the part can be replaced at run time, tested alone, shared, and combined from several sources.",
        "A common guideline is to **favour composition** and use inheritance only for a true is-a relationship, where the subclass can really stand in for the parent. If you only want to reuse a method, compose instead of extending.",
      ],
    },
    {
      kind: "code",
      heading: "Composition",
      example: {
        title: "Delegating to a part",
        language: "java",
        code: 'public class Main {\n  interface MessageSender {\n    void send(String text);\n  }\n\n  static class Notifier {\n    private final MessageSender sender;\n\n    Notifier(MessageSender sender) {\n      this.sender = sender;\n    }\n\n    void notifyUser(String text) {\n      sender.send("[notice] " + text);\n    }\n  }\n\n  public static void main(String[] args) {\n    Notifier n = new Notifier(text -> System.out.println("console: " + text));\n    n.notifyUser("hello");\n  }\n}',
        walkthrough: [
          "`Notifier` holds a `MessageSender` and delegates to it. It does not extend a sender class.",
          "Any implementation can be passed in: email, SMS, or a fake in a test.",
          "Here a lambda is the sender, so the output is `console: [notice] hello`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Extending a class only to reuse a method.",
          fix: "Compose: hold the other object and call it.",
        },
        {
          mistake: "Forgetting that the parent has no no-argument constructor.",
          fix: "Call `super(args)` explicitly.",
        },
        {
          mistake: "Calling an overridable method in a constructor.",
          fix: "Avoid it, or make the method `final` or `private`.",
        },
        {
          mistake: "Deep inheritance trees.",
          fix: "Keep hierarchies shallow, and use interfaces and composition.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Vehicles and payments",
      scenario:
        "A rental system has cars and bikes, and also several ways to pay.",
      body: [
        "Cars and bikes share data and rules and are true vehicles, so `Vehicle` is a sensible parent. Payment methods vary independently, so a `Rental` holds a `PaymentMethod` and delegates to it.",
        "The first is inheritance for a stable is-a relationship, and the second is composition for a changeable part.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "inh-order",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'class A { A() { System.out.print("A "); } }\nclass B extends A { B() { System.out.print("B "); } }\npublic class Main {\n  public static void main(String[] args) {\n    new B();\n  }\n}',
      },
      options: ["A B", "B A", "B"],
      answer: 0,
      explanation: "The superclass constructor always runs first.",
    },
    {
      type: "single",
      id: "inh-multiple",
      prompt: "How many classes can a Java class extend?",
      options: ["One", "Two", "As many as needed"],
      answer: 0,
      explanation:
        "Java has single inheritance of classes. A class can implement many interfaces.",
    },
    {
      type: "truefalse",
      id: "inh-final-class",
      statement: "A `final` class can be extended by one subclass.",
      answer: false,
      explanation: "A final class cannot be extended.",
    },
    {
      type: "single",
      id: "inh-choose",
      prompt: "When is composition better than inheritance?",
      options: [
        "When you only want to reuse behaviour, not model is-a",
        "When the types form a true hierarchy",
        "Never",
      ],
      answer: 0,
      explanation: "Composition is more flexible and avoids tight coupling.",
    },
  ],
  assignment: {
    title: "Refactor inheritance to composition",
    task: [
      "Write a class `Stack` that extends `ArrayList`, and note what is wrong with it, such as the exposed `add(index, x)`.",
      "Rewrite it with composition: a `Stack` that holds a list and offers only `push`, `pop` and `peek`.",
    ],
    checklist: [
      "The new class exposes only the stack operations",
      "I can explain the coupling problem",
      "Tests pass for both versions",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "inh-ex",
      title: "Extend and call super",
      task: [
        "Write `Shape` with a method `describe()` that returns `shape`, and `Circle extends Shape` whose `describe()` returns the parent text plus ` circle`. Print `new Circle().describe()`.",
      ],
      language: "java",
      starter: "public class ShapeDemo {\n  // your code\n}",
      solution:
        'public class ShapeDemo {\n  static class Shape {\n    String describe() {\n      return "shape";\n    }\n  }\n\n  static class Circle extends Shape {\n    @Override\n    String describe() {\n      return super.describe() + " circle";\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(new Circle().describe());\n  }\n}',
      hints: ["Use `@Override` and `super.describe()`."],
      checklist: [
        "Circle overrides describe",
        "The parent version is reused with super",
        "The output is shape circle",
      ],
    },
  ],
  revisionNotes: [
    "`extends`: is-a, single inheritance; `super(...)` and `super.method()`",
    "Parent constructors run first; avoid calling overridable methods in constructors",
    "`final` on variables, methods and classes",
    "Favour composition; inherit only for a true is-a relationship",
  ],
  resources: [
    {
      label: "The Java Tutorials: Inheritance",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html",
    },
    {
      label: "The Java Tutorials: Using the Keyword super",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/super.html",
    },
    {
      label: "The Java Tutorials: Writing Final Classes and Methods",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/final.html",
    },
  ],
})
