import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "sealed-types-and-pattern-switch",
  title: "Sealed types and pattern matching for switch",
  topic: "Sealed classes",
  minutes: 30,
  overview:
    "Restrict a hierarchy with sealed types and use pattern matching in switch to handle every case safely.",
  objectives: [
    "Declare a sealed interface with permitted subtypes",
    "Write an exhaustive switch over a sealed type",
    "Combine records, sealed types and patterns",
  ],
  prerequisites: ["lesson.java-8-plus.records"],
  sections: [
    {
      kind: "explain",
      heading: "Sealed types",
      body: [
        "A **sealed** class or interface, final in Java 17, says exactly which classes may extend or implement it, with `permits`. Each permitted subtype must be `final`, `sealed` or `non-sealed`. This makes the set of possible types **closed** and known to the compiler.",
        "Records are implicitly final, so they are a natural fit as permitted subtypes. If the subtypes are in the same file, the `permits` clause can be left out. An enum is for a fixed set of constants of one shape, and a sealed hierarchy is for a fixed set of kinds that may carry different data.",
      ],
    },
    {
      kind: "explain",
      heading: "switch with patterns",
      body: [
        "A `switch` expression returns a value, uses arrows, does not fall through, and must cover all the possible values. Since Java 21, `switch` also supports **patterns**: a case can test the type and bind a variable, such as `case Circle c -> ...`, with an optional `when` guard. Record patterns take a record apart: `case Rect(double w, double h) -> ...`.",
        "When the selector has a sealed type and the cases cover all permitted subtypes, the switch is **exhaustive** and needs no `default`. If someone later adds a new subtype, every switch that does not handle it stops compiling, and the compiler shows you where to update. Avoid `default` for this reason, because it hides the missing case.",
      ],
    },
    {
      kind: "code",
      heading: "An exhaustive switch",
      example: {
        title: "Sealed interface and records",
        language: "java",
        code: 'public class Main {\n  sealed interface Shape permits Circle, Rect {}\n  record Circle(double radius) implements Shape {}\n  record Rect(double width, double height) implements Shape {}\n\n  static double area(Shape s) {\n    return switch (s) {\n      case Circle c -> Math.PI * c.radius() * c.radius();\n      case Rect(double w, double h) -> w * h;\n    };\n  }\n\n  public static void main(String[] args) {\n    for (Shape s : List.of(new Circle(1), new Rect(2, 3))) {\n      System.out.printf("%.2f%n", area(s));\n    }\n  }\n}',
        walkthrough: [
          "`Shape` can only be a `Circle` or a `Rect`, and the compiler knows it.",
          "The switch covers both cases, so no `default` is needed.",
          "`case Rect(double w, double h)` takes the record apart in the case label.",
          "The output is `3.14` and `6.00`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Guards and a result type",
      example: {
        title: "when and null",
        language: "java",
        code: 'public class Main {\n  sealed interface Result permits Ok, Failure {}\n  record Ok(int value) implements Result {}\n  record Failure(String message) implements Result {}\n\n  static String text(Result r) {\n    return switch (r) {\n      case Ok ok when ok.value() < 0 -> "negative";\n      case Ok ok -> "value " + ok.value();\n      case Failure f -> "error: " + f.message();\n    };\n  }\n\n  public static void main(String[] args) {\n    for (Result r : List.of(new Ok(5), new Ok(-1), new Failure("bad input"))) {\n      System.out.println(text(r));\n    }\n  }\n}',
        walkthrough: [
          "A `when` guard refines a case, and the guarded case must come before the general one.",
          "A `Result` is either `Ok` or `Failure`, so the switch is still exhaustive.",
          "The output is `value 5`, `negative` and `error: bad input`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Adding a `default` to a switch over a sealed type.",
          fix: "Leave it out, so that the compiler reports new subtypes.",
        },
        {
          mistake: "Putting a general case before a more specific one.",
          fix: "Order cases from specific to general. The compiler reports an unreachable case.",
        },
        {
          mistake:
            "Forgetting `final`, `sealed` or `non-sealed` on a permitted subclass.",
          fix: "Every permitted subtype must declare how it continues.",
        },
        {
          mistake: "Sealing a hierarchy that others must be able to extend.",
          fix: "Keep extension points open. Seal only closed sets.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A payment result",
      scenario:
        "A payment can succeed, be declined, or fail with an error code, and each case has different data.",
      body: [
        "Model it as a sealed interface with three records. The code that shows a message uses an exhaustive `switch`. When the team later adds `Pending`, the compiler points at every switch that must handle it.",
        "A method that returns a plain boolean or a nullable error string would not give this protection.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "seal-permits",
      prompt: "What does `permits` do?",
      options: [
        "Lists the only classes that may extend the sealed type",
        "Lets any class extend it",
        "Makes the class abstract",
      ],
      answer: 0,
      explanation: "A sealed type allows only the listed subtypes.",
    },
    {
      type: "single",
      id: "seal-default",
      prompt:
        "Why is it better not to add `default` to a switch over a sealed type?",
      options: [
        "The compiler then reports a new subtype that is not handled",
        "default is not allowed",
        "default makes it slower",
      ],
      answer: 0,
      explanation:
        "Without `default`, adding a subtype makes the switch non-exhaustive, which is a compile error.",
    },
    {
      type: "truefalse",
      id: "seal-record",
      statement: "A record can be a permitted subtype of a sealed interface.",
      answer: true,
      explanation:
        "Records are implicitly final, so they satisfy the rule for permitted subtypes.",
    },
    {
      type: "output",
      id: "seal-out",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'public class Main {\n  sealed interface S permits A, B {}\n  record A() implements S {}\n  record B() implements S {}\n\n  public static void main(String[] args) {\n    S s = new B();\n    System.out.println(switch (s) { case A a -> "a"; case B b -> "b"; });\n  }\n}',
      },
      options: ["b", "a", "ab"],
      answer: 0,
      explanation: "The pattern `case B b` matches the actual type.",
    },
  ],
  assignment: {
    title: "Model with sealed types",
    task: [
      "Model a small expression language with a sealed interface `Expr` and records `Num`, `Add` and `Mul`.",
      "Write `eval(Expr)` and `show(Expr)` with exhaustive switches, then add a `Neg` record and fix every switch that the compiler reports.",
    ],
    checklist: [
      "Both switches are exhaustive without default",
      "Adding Neg gave compile errors that I fixed",
      "The records are immutable",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "seal-ex",
      title: "Describe a shape",
      task: [
        "Write a sealed interface `Shape` with records `Circle(double radius)` and `Square(double side)`, and `static String describe(Shape s)` using an exhaustive switch that returns `circle` or `square` with the size.",
      ],
      language: "java",
      starter: "public class Shapes {\n  // your code\n}",
      solution:
        'public class Shapes {\n  sealed interface Shape permits Circle, Square {}\n\n  record Circle(double radius) implements Shape {}\n\n  record Square(double side) implements Shape {}\n\n  static String describe(Shape s) {\n    return switch (s) {\n      case Circle c -> "circle " + c.radius();\n      case Square q -> "square " + q.side();\n    };\n  }\n\n  public static void main(String[] args) {\n    System.out.println(describe(new Square(2)));\n  }\n}',
      hints: ["Cover both permitted types and do not add `default`."],
      checklist: [
        "The switch is exhaustive without default",
        "Both shapes are records",
        "describe returns a value",
      ],
    },
  ],
  revisionNotes: [
    "`sealed ... permits`: a closed set of subtypes, each final, sealed or non-sealed",
    "Pattern switch: type patterns, record patterns and `when` guards",
    "Exhaustive switch over a sealed type needs no default",
    "Sealed + records give safe, closed data models",
  ],
  resources: [
    {
      label: "Java Language Updates: Sealed Classes",
      url: "https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html",
    },
    {
      label: "Java Language Updates: Pattern Matching",
      url: "https://docs.oracle.com/en/java/javase/21/language/pattern-matching.html",
    },
  ],
})
