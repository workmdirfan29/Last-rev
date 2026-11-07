import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "enums-and-immutable-classes",
  title: "Enums and immutable classes",
  topic: "Advanced Java",
  minutes: 45,
  overview:
    "Model a fixed set of choices with an enum, and design a class whose objects never change, so they are safe to share.",
  objectives: [
    "Declare an enum with fields and methods, and use it in a `switch`",
    "Use `values`, `valueOf`, `name` and `ordinal` correctly",
    "Design an immutable class and explain why it is thread safe",
  ],
  prerequisites: ["lesson.java-core.varargs-static-and-initialisation"],
  sections: [
    {
      kind: "explain",
      heading: "Enums",
      body: [
        "An **enum** is a type with a fixed set of named constants, such as `MONDAY` or `PENDING`. It is better than using strings or numbers for choices, because the compiler rejects a value that is not in the list.",
        "Each constant is an object. An enum can have fields, a constructor and methods, and it can be used in a `switch`. Constants are compared with `==`.",
        '`values()` returns an array of all the constants, `valueOf("NAME")` finds a constant by its text and throws an exception if it does not exist, `name()` returns the text and `ordinal()` returns the position. Avoid storing `ordinal()`, because it changes when the order changes.',
      ],
    },
    {
      kind: "code",
      heading: "An enum with data",
      example: {
        title: "Order status with a label",
        language: "java",
        code: 'public enum Status {\n  PENDING("Waiting"),\n  SHIPPED("On the way"),\n  DELIVERED("Done");\n\n  private final String label;\n\n  Status(String label) {\n    this.label = label;\n  }\n\n  public String getLabel() {\n    return label;\n  }\n\n  public boolean isFinished() {\n    return this == DELIVERED;\n  }\n}\n\n// usage\nStatus s = Status.valueOf("SHIPPED");\nSystem.out.println(s.getLabel());\nfor (Status x : Status.values()) {\n  System.out.println(x + " " + x.ordinal());\n}',
        walkthrough: [
          "Each constant calls the constructor with its label. The constructor of an enum is private by default.",
          '`valueOf("SHIPPED")` finds the constant and the label prints `On the way`.',
          "`values()` lets you loop over every constant. `toString` prints the name, and `ordinal` prints 0, 1 and 2.",
          "`this == DELIVERED` compares constants with `==`, which is correct for enums.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Immutable classes",
      body: [
        "An **immutable** class creates objects that cannot change after construction. `String` and the wrapper classes are examples. Immutable objects are easy to reason about and are safe to share between threads without locks.",
        "To write one: make the class `final`, make all fields `private final`, set them in the constructor, provide no setters, and never hand out references to mutable internals. If a field is a mutable object such as a `Date` or a list, copy it on the way in and on the way out.",
        "Instead of changing an object, you create a new one with the new value. These are often called **with** methods, such as `withAmount(...)`.",
      ],
    },
    {
      kind: "code",
      heading: "A money class that cannot change",
      example: {
        title: "An immutable Money with a defensive copy",
        language: "java",
        code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\npublic final class Receipt {\n  private final long amountInPaise;\n  private final List<String> items;\n\n  public Receipt(long amountInPaise, List<String> items) {\n    this.amountInPaise = amountInPaise;\n    this.items = new ArrayList<>(items);\n  }\n\n  public long getAmountInPaise() {\n    return amountInPaise;\n  }\n\n  public List<String> getItems() {\n    return Collections.unmodifiableList(items);\n  }\n\n  public Receipt withAmount(long newAmount) {\n    return new Receipt(newAmount, items);\n  }\n}",
        walkthrough: [
          "The class is `final`, so nobody can extend it and add changing behaviour.",
          "Every field is `private final`, and there are no setters.",
          "The constructor copies the list, so the caller cannot change the receipt later through its own list.",
          "`getItems` returns a read-only view, so callers cannot change the list either.",
          "`withAmount` returns a new object instead of changing this one.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Storing an enum's `ordinal()` in a database.",
          fix: "Store `name()`. The ordinal changes when someone reorders or adds constants.",
        },
        {
          mistake:
            "Making a field `final` but keeping a reference to a mutable list.",
          fix: "`final` fixes the reference, not the contents. Copy the list in, and return an unmodifiable view out.",
        },
        {
          mistake: "Calling `Status.valueOf(userInput)` with unchecked text.",
          fix: "It throws `IllegalArgumentException` for an unknown name. Catch it or check against `values()` first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Safe shared data",
      scenario:
        "A web application shares configuration and money values between many requests at the same time.",
      body: [
        "Immutable value classes such as a `Money` or a `Config` need no locking, because no thread can change them. If a value must change, you replace the whole object with a new one.",
        "Enums fit the fixed choices around them: order status, user role, payment method. A `switch` over an enum also makes the compiler warn you when you add a new constant and forget to handle it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "enum-compare",
      prompt: "How should two enum constants be compared?",
      options: [
        "With ==",
        "With compareTo only",
        "By converting to strings and using ==",
      ],
      answer: 0,
      explanation:
        "Each constant is a single object, so `==` is correct and safe, and it never throws a `NullPointerException` on the left side.",
    },
    {
      type: "output",
      id: "enum-valueof",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'enum Level { LOW, HIGH }\nLevel l = Level.valueOf("HIGH");\nSystem.out.println(l.ordinal());',
      },
      options: ["1", "0", "HIGH"],
      answer: 0,
      explanation:
        "`HIGH` is the second constant, so its ordinal is 1. The ordinal starts at 0.",
    },
    {
      type: "truefalse",
      id: "final-field-list",
      statement:
        "A `private final List<String>` field makes the contents of the list impossible to change.",
      answer: false,
      explanation:
        "`final` only stops the reference from being reassigned. The list can still be changed unless you copy it and expose it read-only.",
    },
    {
      type: "multi",
      id: "immutable-recipe",
      prompt: "Which are part of making a class immutable?",
      options: [
        "Make the fields `private final`",
        "Provide no setters",
        "Copy mutable inputs in the constructor",
        "Add a public `reset()` method",
      ],
      answers: [0, 1, 2],
      explanation:
        "Final private fields, no setters and defensive copies are the recipe. A `reset()` method would allow change.",
    },
  ],
  assignment: {
    title: "Traffic light and an immutable point",
    task: [
      "Create an enum `Light` with RED, YELLOW and GREEN. Each has a wait time in seconds and a method `next()` that returns the next light in the cycle.",
      "Create an immutable class `Point` with `x` and `y`, a method `move(dx, dy)` that returns a new `Point`, and a short test that proves the original did not change.",
    ],
    checklist: [
      "`next()` from GREEN returns to YELLOW or RED according to your cycle, and I wrote the cycle down",
      "`Point` is final with private final fields and no setters",
      "My test prints the original and the moved point",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "weekday-enum",
      title: "Weekend check",
      task: [
        "Create an enum `Day` with MON to SUN. Add `boolean isWeekend()` that returns true for SAT and SUN. Use a `switch` expression.",
      ],
      language: "java",
      starter:
        "public enum Day {\n  MON, TUE, WED, THU, FRI, SAT, SUN;\n\n  public boolean isWeekend() {\n    // your code\n    return false;\n  }\n}",
      solution:
        "public enum Day {\n  MON, TUE, WED, THU, FRI, SAT, SUN;\n\n  public boolean isWeekend() {\n    return switch (this) {\n      case SAT, SUN -> true;\n      default -> false;\n    };\n  }\n}",
      hints: ["You can switch on `this` inside an enum method."],
      checklist: [
        "SAT and SUN return true",
        "The other five days return false",
        "I used a switch expression, not a chain of ifs",
      ],
    },
  ],
  revisionNotes: [
    "Enum: a fixed set of constants that are objects, compare with `==`",
    "`valueOf` throws for an unknown name, store `name()` not `ordinal()`",
    "Immutable: final class, private final fields, no setters, defensive copies",
    "Immutable objects are thread safe without locks",
  ],
  resources: [
    {
      label: "The Java Tutorials: Enum Types",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html",
    },
    {
      label: "The Java Tutorials: A Strategy for Defining Immutable Objects",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/imstrat.html",
    },
  ],
})
