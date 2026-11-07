import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "primitive-types",
  title: "Primitive types, casting and wrappers",
  topic: "Data types",
  minutes: 50,
  overview:
    "Learn the eight primitive types, how Java converts between them, and how wrapper classes turn primitives into objects.",
  objectives: [
    "Name the eight primitive types and choose the right one for a value",
    "Explain widening and narrowing conversion and when a cast is needed",
    "Use wrapper classes, autoboxing and unboxing, and avoid the null trap",
  ],
  prerequisites: ["lesson.java-core.variables-and-operators"],
  sections: [
    {
      kind: "explain",
      heading: "The eight primitive types",
      body: [
        "A **primitive** holds a plain value, not an object. Java has eight: `byte`, `short`, `int` and `long` for whole numbers, `float` and `double` for decimals, `char` for one character, and `boolean` for true or false.",
        "`int` is the default for whole numbers and `double` for decimals. Use `long` when a value can pass about 2 billion, and add `L` to the literal, such as `3_000_000_000L`.",
        "`String` is not a primitive. It is a class, which is why it starts with a capital letter.",
      ],
    },
    {
      kind: "diagram",
      heading: "Sizes at a glance",
      diagram: {
        kind: "table",
        title: "Primitive types",
        headers: ["Type", "Size", "Holds"],
        rows: [
          ["byte", "8 bits", "Small whole numbers"],
          ["short", "16 bits", "Whole numbers"],
          ["int", "32 bits", "Whole numbers (default)"],
          ["long", "64 bits", "Large whole numbers"],
          ["float", "32 bits", "Decimals, less precise"],
          ["double", "64 bits", "Decimals (default)"],
          ["char", "16 bits", "One UTF-16 character"],
          ["boolean", "true or false", "Yes or no"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Widening and narrowing",
      example: {
        title: "When a cast is needed",
        language: "java",
        code: "int i = 42;\nlong l = i;\ndouble d = i;\n\ndouble price = 3.99;\nint whole = (int) price;\nbyte b = (byte) 130;\n\nSystem.out.println(whole);\nSystem.out.println(b);",
        walkthrough: [
          "Assigning an `int` to a `long` or a `double` is **widening**. It is automatic because no data is lost.",
          "`(int) price` is **narrowing**. You must write the cast, and the fraction is dropped, so the result is `3`, not `4`.",
          "`130` does not fit in a `byte`, so the value wraps around and `b` becomes `-126`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Wrapper classes and boxing",
      body: [
        "Each primitive has a **wrapper class**: `Integer` for `int`, `Double` for `double`, `Boolean` for `boolean`, and so on. Collections such as `List<Integer>` can hold only objects, so they use wrappers.",
        "**Autoboxing** converts a primitive to its wrapper automatically, and **unboxing** converts back. A wrapper can be `null`, and unboxing a `null` throws a `NullPointerException`.",
        "Compare wrapper objects with `equals`, not `==`. Small values are cached, so `==` can seem to work, and then fail for larger numbers.",
      ],
    },
    {
      kind: "code",
      heading: "Boxing in practice",
      example: {
        title: "Wrappers and a null trap",
        language: "java",
        code: "java.util.List<Integer> scores = new java.util.ArrayList<>();\nscores.add(90);\nint first = scores.get(0);\n\nInteger a = 1000;\nInteger b = 1000;\nSystem.out.println(a.equals(b));\n\nInteger missing = null;\n// int x = missing;",
        walkthrough: [
          "`scores.add(90)` boxes the `int` into an `Integer`.",
          "`scores.get(0)` returns an `Integer` that is unboxed into `first`.",
          "`a.equals(b)` is `true`. Using `a == b` for values this large would usually be `false`.",
          "The commented line would throw a `NullPointerException` because `missing` holds no number.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Using `double` for money.",
          fix: "Decimals such as `0.1` cannot be stored exactly in binary. Use `BigDecimal` or store the smallest unit as a `long`.",
        },
        {
          mistake: "Comparing `Integer` objects with `==`.",
          fix: "Use `equals`, or compare the unboxed `int` values.",
        },
        {
          mistake: "Writing `float f = 3.14;`.",
          fix: "A decimal literal is a `double`. Write `3.14f` for a `float`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Choosing a type for real data",
      scenario:
        "An app stores a user's age, the number of page views and a price.",
      body: [
        "Age fits in `int`. A page-view counter that may pass 2 billion belongs in `long`. A price is money, so it should not be a `double`. Store it as a `long` number of paise, or as a `BigDecimal`.",
        "A database column that may be empty maps to `Integer`, not `int`, so that `null` can mean no value.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "default-decimal-type",
      prompt: "What is the type of the literal `3.14` in Java?",
      options: ["double", "float", "decimal"],
      answer: 0,
      explanation:
        "Decimal literals are `double` unless you add `f`, as in `3.14f`.",
    },
    {
      type: "output",
      id: "narrowing-cast",
      prompt: "What is printed after the cast to int?",
      code: {
        language: "java",
        code: "double price = 3.99;\nSystem.out.println((int) price);",
      },
      options: ["3", "4", "3.99"],
      answer: 0,
      explanation:
        "A cast to `int` drops the fraction. It truncates and does not round.",
    },
    {
      type: "truefalse",
      id: "string-primitive",
      statement: "`String` is one of the eight primitive types.",
      answer: false,
      explanation:
        "`String` is a class. The eight primitives are byte, short, int, long, float, double, char and boolean.",
    },
    {
      type: "multi",
      id: "whole-number-types",
      prompt: "Which of these types hold whole numbers?",
      options: ["byte", "short", "double", "boolean"],
      answers: [0, 1],
      explanation:
        "`byte` and `short` hold whole numbers. `double` holds decimals and `boolean` holds true or false.",
    },
  ],
  assignment: {
    title: "A type chooser",
    task: [
      "Write a program that declares one variable for each of these: a person's age, a bank balance in paise, a temperature with decimals, a grade letter and a yes or no flag.",
      "Print each one. Choose the type you think fits best and add a one-line comment saying why.",
    ],
    checklist: [
      "I used five different, suitable types",
      "I did not store the balance in a `double`",
      "I wrote a short reason for each choice",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "average-without-losing-decimals",
      title: "Average of two integers",
      task: [
        "Given `int a = 7;` and `int b = 2;`, print their average as a decimal, so the output is 4.5.",
      ],
      language: "java",
      starter:
        "public class Average {\n  public static void main(String[] args) {\n    int a = 7;\n    int b = 2;\n    // print the average\n  }\n}",
      solution:
        "public class Average {\n  public static void main(String[] args) {\n    int a = 7;\n    int b = 2;\n    double average = (a + b) / 2.0;\n    System.out.println(average);\n  }\n}",
      hints: [
        "If both sides of `/` are `int`, the fraction is lost. Make one side a `double`.",
      ],
      checklist: [
        "It prints 4.5, not 4",
        "I did not change a and b to decimals in their declarations",
      ],
    },
  ],
  revisionNotes: [
    "Eight primitives: byte, short, int, long, float, double, char, boolean",
    "Widening is automatic, narrowing needs a cast and can lose data",
    "Cast truncates, it does not round",
    "Compare wrappers with equals, and beware of null unboxing",
  ],
  resources: [
    {
      label: "The Java Tutorials: Primitive Data Types",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html",
    },
    {
      label: "The Java Tutorials: Autoboxing and Unboxing",
      url: "https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html",
    },
  ],
})
