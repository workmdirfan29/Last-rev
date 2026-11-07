import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "records",
  title: "Records: concise immutable data classes",
  topic: "Records",
  minutes: 40,
  overview:
    "Declare records, add validation and methods, and know where records fit and where they do not.",
  objectives: [
    "Declare a record and describe what the compiler generates",
    "Validate and normalise components with a compact constructor",
    "Choose between a record and a class",
  ],
  prerequisites: ["lesson.java-8-plus.lambdas-and-functional-interfaces"],
  sections: [
    {
      kind: "explain",
      heading: "What a record is",
      body: [
        "A **record**, final since Java 16, declares an immutable data carrier in one line: `record Point(int x, int y) {}`. From the components, the compiler generates private final fields, a **canonical constructor**, accessor methods named after the components (`x()` and `y()`), and `equals`, `hashCode` and `toString` that use all the components.",
        "A record is implicitly `final` and extends `java.lang.Record`, so it cannot extend another class. It can implement interfaces, and have methods, static fields and static methods. It cannot declare other instance fields.",
        "Records are **shallowly immutable**: the fields cannot be reassigned, but a component that is a mutable object, such as a `List`, can still be changed. Copy such components in the constructor.",
      ],
    },
    {
      kind: "code",
      heading: "A record in use",
      example: {
        title: "Generated members",
        language: "java",
        code: 'record Point(int x, int y) {\n      double distance() {\n        return Math.sqrt(x * x + y * y);\n      }\n    }\n    Point p = new Point(3, 4);\n    System.out.println(p);\n    System.out.println(p.x() + " " + p.distance());\n    System.out.println(p.equals(new Point(3, 4)));',
        walkthrough: [
          "`toString` is generated and prints `Point[x=3, y=4]`.",
          "The accessors are `x()` and `y()`, and the record can have its own methods.",
          "`equals` compares the components, so a new `Point(3, 4)` is equal.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Compact constructors",
      body: [
        "A **compact constructor** has no parameter list. It runs before the fields are assigned, and the compiler assigns the fields at the end. Use it to **validate** or **normalise** values: throw an exception for a bad value, or trim a string. You may reassign the parameters, but you cannot assign the fields.",
        "You can also write the full canonical constructor, add other constructors that call `this(...)`, and override accessors. A defensive copy such as `items = List.copyOf(items)` makes a record with a list component safe from outside changes.",
        "Use a record for values whose identity is their data: DTOs, query results, coordinates, money amounts and map keys. Use a class when the state changes, when you need inheritance, or when a framework needs a no-argument constructor and setters, as a JPA entity does.",
      ],
    },
    {
      kind: "code",
      heading: "Validation and a defensive copy",
      example: {
        title: "Compact constructor",
        language: "java",
        code: 'record Range(int from, int to) {\n      Range {\n        if (from > to) {\n          throw new IllegalArgumentException("from must be <= to");\n        }\n      }\n    }\n    record Basket(List<String> items) {\n      Basket {\n        items = List.copyOf(items);\n      }\n    }\n    try {\n      new Range(5, 1);\n    } catch (IllegalArgumentException e) {\n      System.out.println(e.getMessage());\n    }\n    List<String> source = new ArrayList<>(List.of("a"));\n    Basket basket = new Basket(source);\n    source.add("b");\n    System.out.println(basket.items());',
        walkthrough: [
          "The compact constructor of `Range` rejects an invalid object, so an invalid `Range` never exists.",
          "`Basket` copies the list, so a later change to `source` does not reach the record.",
          "The output is `from must be <= to` and `[a]`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Expecting setters on a record.",
          fix: "Records are immutable. Create a new record with the changed value.",
        },
        {
          mistake:
            "Assuming that a record with a List component is deeply immutable.",
          fix: "Copy the list in the constructor, or use an unmodifiable collection.",
        },
        {
          mistake: "Using a record as a JPA entity.",
          fix: "Entities need mutability and a default constructor. Use a class.",
        },
        {
          mistake: "Writing `this.x = x` in a compact constructor.",
          fix: "Assign the parameter, `x = ...`, and the compiler assigns the field.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A REST response",
      scenario:
        "An API returns a summary of an order with an id, a status and a total.",
      body: [
        "Declare `record OrderSummary(long id, String status, BigDecimal total) {}` and build it from the entity in the service. The record is immutable, easy to serialise, and has correct `equals` and `toString` for free.",
        "The entity with its changing state stays a class.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rec-accessor",
      prompt: "How do you read the component `x` of a record `Point`?",
      options: ["p.x()", "p.getX()", "p.x"],
      answer: 0,
      explanation:
        "Accessors have the name of the component, with no `get` prefix.",
    },
    {
      type: "multi",
      id: "rec-generated",
      prompt: "Which does the compiler generate for a record?",
      options: ["equals", "hashCode", "toString", "setters"],
      answers: [0, 1, 2],
      explanation: "Records are immutable, so no setters are generated.",
    },
    {
      type: "truefalse",
      id: "rec-extends",
      statement: "A record can extend another class.",
      answer: false,
      explanation:
        "A record extends `java.lang.Record` implicitly, so it cannot extend another class. It can implement interfaces.",
    },
    {
      type: "truefalse",
      id: "rec-deep",
      statement: "A record that holds a mutable List is deeply immutable.",
      answer: false,
      explanation:
        "The reference cannot change, but the list can. Copy it in the constructor.",
    },
  ],
  assignment: {
    title: "Model data with records",
    task: [
      "Model a small library: `Book`, `Member` and `Loan` as records, with validation in compact constructors.",
      "Show a record used as a map key, and a record that copies a list.",
    ],
    checklist: [
      "Invalid values are rejected",
      "The list component is copied",
      "I can explain when I would use a class instead",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "rec-ex",
      title: "A money record",
      task: [
        "Write `record Money(long amount, String currency)` with a compact constructor that rejects a negative amount and a blank currency, and a method `add(Money other)` that returns a new `Money` or throws if the currencies differ.",
      ],
      language: "java",
      starter: "public class MoneyDemo {\n  // your code\n}",
      solution:
        'public class MoneyDemo {\n  record Money(long amount, String currency) {\n    Money {\n      if (amount < 0) {\n        throw new IllegalArgumentException("amount must not be negative");\n      }\n      if (currency == null || currency.isBlank()) {\n        throw new IllegalArgumentException("currency is required");\n      }\n    }\n\n    Money add(Money other) {\n      if (!currency.equals(other.currency)) {\n        throw new IllegalArgumentException("different currencies");\n      }\n      return new Money(amount + other.amount, currency);\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println(new Money(100, "INR").add(new Money(50, "INR")));\n  }\n}',
      hints: [
        "Validate in the compact constructor, and create a new record in `add`.",
      ],
      checklist: [
        "Invalid values are rejected at creation",
        "add returns a new record",
        "Different currencies are refused",
      ],
    },
  ],
  revisionNotes: [
    "`record R(T a, U b) {}`: final fields, canonical constructor, accessors, equals/hashCode/toString",
    "Compact constructor for validation and defensive copies",
    "Shallowly immutable; cannot extend a class; can implement interfaces",
    "Records for data; classes for changing state and frameworks that need setters",
  ],
  resources: [
    {
      label: "Java Language Updates: Record Classes",
      url: "https://docs.oracle.com/en/java/javase/21/language/records.html",
    },
    {
      label: "JEP 395: Records",
      url: "https://openjdk.org/jeps/395",
    },
  ],
})
