import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "abstract-classes-and-encapsulation",
  title: "Abstraction: abstract classes and encapsulation",
  topic: "Abstraction",
  minutes: 60,
  overview:
    "Use abstract classes for shared code with required parts, and separate abstraction from encapsulation.",
  objectives: [
    "Write an abstract class with abstract and concrete methods",
    "Use the template method idea",
    "Explain abstraction and encapsulation as different ideas",
  ],
  prerequisites: ["lesson.java-oop.polymorphism"],
  sections: [
    {
      kind: "explain",
      heading: "Abstract classes",
      body: [
        "An **abstract class** is declared with `abstract` and cannot be instantiated. It may contain **abstract methods**, which have no body and must be implemented by the first concrete subclass, and also ordinary methods, fields and constructors. It is a **partial** base class: it shares code and state, and forces subclasses to supply the parts that differ.",
        "A class with at least one abstract method must be abstract. A subclass that does not implement every abstract method must be abstract too. The constructor of an abstract class runs when a subclass object is created.",
        "The **template method** pattern uses this: the abstract class has a `final` method that fixes the steps of an algorithm, and calls abstract methods for the steps that vary.",
      ],
    },
    {
      kind: "code",
      heading: "A template method",
      example: {
        title: "Report",
        language: "java",
        code: 'public class Main {\n  static abstract class Report {\n    public final String generate() {\n      return header() + body() + "\\n";\n    }\n\n    String header() {\n      return "REPORT: ";\n    }\n\n    abstract String body();\n  }\n\n  static class CsvReport extends Report {\n    String body() {\n      return "a,b,c";\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.print(new CsvReport().generate());\n  }\n}',
        walkthrough: [
          "`generate` is shared code, and is `final` so that subclasses cannot change the steps.",
          "`body` has no implementation, so every concrete subclass must provide it.",
          "`new Report()` would not compile, but `new CsvReport()` does. The output is `REPORT: a,b,c`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Abstraction and encapsulation",
      body: [
        "**Abstraction** means showing **what** something does and hiding **how**. You achieve it with interfaces and abstract classes, so callers depend on a simple contract. It works at the **design** level.",
        "**Encapsulation** means protecting the data of an object by making the fields private and allowing changes only through methods that enforce the rules. It works at the level of **one class**. They support each other: a class hides its details (encapsulation) behind a contract that callers rely on (abstraction).",
        "Choose an abstract class when related classes share **code and state**. Choose an interface when unrelated classes share a **capability**. A class can extend only one abstract class but implement many interfaces.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Trying to instantiate an abstract class.",
          fix: "Create an instance of a concrete subclass.",
        },
        {
          mistake:
            "Using an abstract class when a class may need to extend something else.",
          fix: "Use an interface, which a class can implement in addition.",
        },
        {
          mistake:
            "Treating getters and setters for every field as encapsulation.",
          fix: "Expose behaviour, not just data, and enforce rules in methods.",
        },
        {
          mistake:
            "Describing abstraction and encapsulation with the same definition.",
          fix: "Abstraction hides complexity behind a contract. Encapsulation protects state.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Importing data",
      scenario:
        "An application imports data from CSV, JSON and XML files with the same steps: open, parse, validate, save.",
      body: [
        "An abstract `Importer` fixes the steps in a final `run()` method, and leaves `parse` abstract. `CsvImporter` and `JsonImporter` supply only the parsing. Validation and saving are written once.",
        "The shared behaviour is not copied, and each format class is small.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "abs-inst",
      prompt:
        "What happens if you write `new Report()` for an abstract class `Report`?",
      options: ["A compile error", "A runtime error", "An empty object"],
      answer: 0,
      explanation: "Abstract classes cannot be instantiated.",
    },
    {
      type: "single",
      id: "abs-which",
      prompt: "Which statement is true?",
      options: [
        "An abstract class can have fields and constructors",
        "An abstract class cannot have concrete methods",
        "An abstract class must have no abstract methods",
      ],
      answer: 0,
      explanation: "It can mix abstract and concrete methods, and hold state.",
    },
    {
      type: "truefalse",
      id: "abs-enc",
      statement: "Abstraction and encapsulation mean the same thing.",
      answer: false,
      explanation:
        "Abstraction hides how something works behind a contract. Encapsulation protects the state of an object.",
    },
    {
      type: "blank",
      id: "abs-kw",
      prompt:
        "A method without a body in an abstract class is declared with the keyword ___.",
      answer: "abstract",
      explanation: "A concrete subclass must implement it.",
    },
  ],
  assignment: {
    title: "Template method",
    task: [
      "Design an abstract `Importer` with a final `run()` method, and two subclasses for different formats.",
      "Show with a test that `run()` cannot be overridden and that each subclass only implements parsing.",
    ],
    checklist: [
      "run is final",
      "Subclasses implement only the varying step",
      "I can explain the difference between abstraction and encapsulation",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "abs-ex",
      title: "A shape base class",
      task: [
        "Write an abstract class `Shape` with an abstract `area()` and a concrete `describe()` that returns `area: ` plus the area. Implement `Rect` and print its description.",
      ],
      language: "java",
      starter: "public class AbstractDemo {\n  // your code\n}",
      solution:
        'public class AbstractDemo {\n  static abstract class Shape {\n    abstract double area();\n\n    String describe() {\n      return "area: " + area();\n    }\n  }\n\n  static class Rect extends Shape {\n    private final double w;\n    private final double h;\n\n    Rect(double w, double h) {\n      this.w = w;\n      this.h = h;\n    }\n\n    @Override\n    double area() {\n      return w * h;\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(new Rect(2, 3).describe());\n  }\n}',
      hints: [
        "`describe` calls the abstract method, so each subclass gets its own result.",
      ],
      checklist: [
        "Shape is abstract",
        "describe is concrete and uses area",
        "Rect implements area",
      ],
    },
  ],
  revisionNotes: [
    "Abstract classes: partial implementation, no instances, may hold state",
    "Template method: final algorithm, abstract steps",
    "Abstraction = what, not how; encapsulation = protect state",
    "Abstract class for shared code and state; interface for a capability",
  ],
  resources: [
    {
      label: "The Java Tutorials: Abstract Methods and Classes",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html",
    },
    {
      label: "The Java Tutorials: Controlling Access to Members of a Class",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html",
    },
  ],
})
