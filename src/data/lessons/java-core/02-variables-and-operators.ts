import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "variables-and-operators",
  title: "Variables, scope and operators",
  topic: "Basics",
  minutes: 45,
  overview:
    "Store values in variables, know where a variable can be used, and combine values with arithmetic, comparison and logical operators.",
  objectives: [
    "Declare and assign variables, including constants with `final`",
    "Explain local, instance and static variables and where each is visible",
    "Use arithmetic, comparison and logical operators, and predict integer division",
  ],
  prerequisites: ["lesson.java-core.first-program"],
  sections: [
    {
      kind: "explain",
      heading: "Variables and constants",
      body: [
        "A **variable** is a named place that holds a value. In Java every variable has a type that you declare, such as `int count = 3;`. The type decides what the variable can hold.",
        "Add `final` to make a variable a **constant**: it can be assigned once and never changed. Constants are usually written in capital letters, such as `MAX_USERS`.",
        "Names start with a letter, `_` or `$`, are case sensitive, and by convention use camelCase for variables such as `totalPrice`.",
      ],
    },
    {
      kind: "explain",
      heading: "Where a variable lives",
      body: [
        "A **local variable** is declared inside a method or a block. It exists only while that code runs and has no default value, so you must assign it before you read it.",
        "An **instance variable** is declared in a class without `static`. Every object gets its own copy, and it starts with a default value such as `0` or `null`.",
        "A **static variable** is declared with `static`. It belongs to the class, and every object shares the same one.",
      ],
    },
    {
      kind: "code",
      heading: "Three kinds of variables",
      example: {
        title: "Local, instance and static",
        language: "java",
        code: "public class Counter {\n  static int created = 0;\n  int value;\n\n  Counter() {\n    created++;\n  }\n\n  void bump() {\n    int step = 2;\n    value += step;\n  }\n}",
        walkthrough: [
          "`created` is static, so all `Counter` objects share one number.",
          "`value` is an instance variable, so each object has its own.",
          "`step` is local. It is created when `bump` runs and disappears when it returns.",
          "`value += step` is short for `value = value + step`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Operators",
      example: {
        title: "Arithmetic, comparison and logic",
        language: "java",
        code: 'int a = 7;\nint b = 2;\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println((double) a / b);\nSystem.out.println(a > b && b > 0);\nint c = a++;\nSystem.out.println(c + " " + a);',
        walkthrough: [
          "`a / b` is `3`. When both sides are `int`, Java drops the fraction.",
          "`a % b` is the remainder, `1`.",
          "Casting one side to `double` first gives `3.5`.",
          "`&&` means AND. The result is `true` only when both comparisons are true.",
          "`a++` returns the old value, so `c` is `7` and `a` becomes `8`.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Using a local variable before giving it a value.",
          fix: "Assign it first. The compiler reports an error because locals have no default.",
        },
        {
          mistake: "Expecting `7 / 2` to be `3.5`.",
          fix: "Integer division drops the fraction. Make one operand a `double`, such as `7 / 2.0`.",
        },
        {
          mistake: "Writing `=` when you mean `==` in a comparison.",
          fix: "`=` assigns, and `==` compares. Use `==` inside conditions.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A price with tax",
      scenario: "A shop calculates the final price of an item including tax.",
      body: [
        "Store the price and the tax rate in variables. Use a constant for the rate, such as `final double TAX_RATE = 0.18;`, so the number has a name and one place to change.",
        "Multiply carefully: `price * (1 + TAX_RATE)` uses decimals, while whole-number maths would lose the fraction.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "integer-division",
      prompt: "What is printed for integer division?",
      code: { language: "java", code: "System.out.println(7 / 2);" },
      options: ["3", "3.5", "4"],
      answer: 0,
      explanation:
        "Both operands are `int`, so the result is an `int` and the fraction is dropped.",
    },
    {
      type: "single",
      id: "static-shared",
      prompt: "A `static` variable of a class is...",
      options: [
        "shared by all objects of the class",
        "copied for every object",
        "only visible inside one method",
      ],
      answer: 0,
      explanation:
        "A static variable belongs to the class itself, so every object sees the same one.",
    },
    {
      type: "truefalse",
      id: "final-reassign",
      statement:
        "A variable declared `final` can be assigned a new value later.",
      answer: false,
      explanation:
        "`final` allows one assignment. A second assignment is a compile error.",
    },
    {
      type: "blank",
      id: "remainder-operator",
      prompt: "The operator ___ gives the remainder of a division.",
      answer: "%",
      accepted: ["modulo", "modulus"],
      explanation: "`%` returns the remainder, so `7 % 2` is `1`.",
    },
  ],
  assignment: {
    title: "Simple interest calculator",
    task: [
      "Write a program with variables for a principal amount, a yearly rate and a number of years.",
      "Calculate simple interest as principal times rate times years divided by 100, and print it.",
    ],
    checklist: [
      "I used `double` for money and rate",
      "The rate or the divisor is a named constant or variable, not repeated numbers",
      "I checked the result with one example by hand",
    ],
    hints: ["Use a `double` so that the result keeps its decimals."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "swap-two-numbers",
      title: "Swap two variables",
      task: [
        "You have `int a = 4;` and `int b = 9;`. Swap their values so that `a` is 9 and `b` is 4, then print both.",
      ],
      language: "java",
      starter:
        'public class Swap {\n  public static void main(String[] args) {\n    int a = 4;\n    int b = 9;\n    // swap here\n    System.out.println(a + " " + b);\n  }\n}',
      solution:
        'public class Swap {\n  public static void main(String[] args) {\n    int a = 4;\n    int b = 9;\n    int temp = a;\n    a = b;\n    b = temp;\n    System.out.println(a + " " + b);\n  }\n}',
      hints: [
        "Keep the first value in a temporary variable before you overwrite it.",
      ],
      checklist: [
        "I used a temporary variable",
        "It prints 9 4",
        "I compiled and ran it myself",
      ],
    },
  ],
  revisionNotes: [
    "Locals need a value before use, fields get defaults",
    "`final` means one assignment",
    "`int / int` drops the fraction",
    "`=` assigns, `==` compares",
  ],
  resources: [
    {
      label: "The Java Tutorials: Variables",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html",
    },
    {
      label: "The Java Tutorials: Operators",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html",
    },
  ],
})
