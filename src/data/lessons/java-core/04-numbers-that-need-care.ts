import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "numbers-that-need-care",
  title: "Overflow, floating point and BigDecimal",
  topic: "Data types",
  minutes: 50,
  overview:
    "See what happens when an int runs out of room, why 0.1 + 0.2 is not 0.3, and how to handle money and very large numbers safely.",
  objectives: [
    "Explain integer overflow and detect it with `Math.addExact`",
    "Explain why floating-point numbers are not exact",
    "Use `BigDecimal` and `compareTo` for money",
  ],
  prerequisites: ["lesson.java-core.primitive-types"],
  sections: [
    {
      kind: "explain",
      heading: "When an int runs out of room",
      body: [
        "An `int` holds a fixed range, from about minus 2.1 billion to plus 2.1 billion. When a calculation goes past the largest value, Java does not warn you. The number **wraps around** to the other end.",
        "`Integer.MAX_VALUE` is the largest `int`. Adding 1 to it gives the smallest, a large negative number. This is called **overflow**.",
        "If a result can be large, use `long`. If you want an error instead of silent wrapping, use `Math.addExact`, `Math.multiplyExact` and similar methods. They throw an `ArithmeticException` on overflow.",
      ],
    },
    {
      kind: "code",
      heading: "Overflow in practice",
      example: {
        title: "Wrapping and exact arithmetic",
        language: "java",
        code: 'int big = Integer.MAX_VALUE;\nSystem.out.println(big + 1);\n\nlong safe = (long) big + 1;\nSystem.out.println(safe);\n\ntry {\n  Math.addExact(big, 1);\n} catch (ArithmeticException e) {\n  System.out.println("overflow detected");\n}',
        walkthrough: [
          "`big + 1` wraps around and prints `-2147483648`.",
          "Casting to `long` first gives the correct `2147483648`, because `long` has room.",
          "`Math.addExact` throws instead of wrapping, so the `catch` block runs.",
          "The cast must come before the addition. `(long) (big + 1)` would cast the wrapped result.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Why 0.1 + 0.2 is not 0.3",
      body: [
        "Computers store `float` and `double` in binary. Many decimal fractions, such as `0.1`, have no exact binary form, just as one third has no exact decimal form. The stored value is very close, but not exact.",
        "That is why `0.1 + 0.2` prints `0.30000000000000004`. For measurements this tiny error does not matter. For money it does.",
        "Never compare two decimals with `==`. Compare them with a small tolerance, or use `BigDecimal`.",
      ],
    },
    {
      kind: "code",
      heading: "BigDecimal for exact decimals",
      example: {
        title: "Money with BigDecimal",
        language: "java",
        code: 'import java.math.BigDecimal;\nimport java.math.RoundingMode;\n\nBigDecimal a = new BigDecimal("0.10");\nBigDecimal b = new BigDecimal("0.20");\nSystem.out.println(a.add(b));\n\nBigDecimal price = new BigDecimal("19.99");\nBigDecimal total = price.multiply(new BigDecimal("3"));\nSystem.out.println(total);\n\nBigDecimal x = new BigDecimal("2.0");\nBigDecimal y = new BigDecimal("2.00");\nSystem.out.println(x.equals(y));\nSystem.out.println(x.compareTo(y));\nSystem.out.println(new BigDecimal("10").divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP));',
        walkthrough: [
          "Build a `BigDecimal` from a `String`. `new BigDecimal(0.1)` would copy the double's tiny error.",
          "`add` and `multiply` are exact, so the output is `0.30` and `59.97`.",
          "`equals` also compares the scale, so `2.0` and `2.00` are not equal.",
          "`compareTo` returns `0` when the numbers are equal in value. Use it to compare.",
          "`divide` needs a scale and a rounding mode, otherwise a result like one third throws an exception.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Using `double` for prices and totals.",
          fix: "Use `BigDecimal`, or keep the amount as a `long` number of the smallest unit, such as paise.",
        },
        {
          mistake: "Creating `new BigDecimal(0.1)`.",
          fix: 'Pass a string: `new BigDecimal("0.1")`.',
        },
        {
          mistake: "Comparing `BigDecimal` values with `equals`.",
          fix: "Use `compareTo`. It ignores the scale and compares the value.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A shopping cart total",
      scenario: "An online shop adds up item prices and applies a discount.",
      body: [
        "Store each price as a `BigDecimal` made from a string. Add the items with `add`, apply the discount with `multiply`, and round only at the end with `setScale(2, RoundingMode.HALF_UP)`.",
        "Round once at the end. Rounding after every step can drift away from the amount the accountant expects.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "int-overflow",
      prompt: "What does the overflow line print?",
      code: {
        language: "java",
        code: "int x = Integer.MAX_VALUE;\nSystem.out.println(x + 1);",
      },
      options: ["-2147483648", "2147483648", "An exception is thrown"],
      answer: 0,
      explanation:
        "The `int` wraps around silently, so the result is the smallest `int`.",
    },
    {
      type: "single",
      id: "bigdecimal-construct",
      prompt: "Which is the safe way to create a `BigDecimal` for 0.1?",
      options: [
        'new BigDecimal("0.1")',
        "new BigDecimal(0.1)",
        "(BigDecimal) 0.1",
      ],
      answer: 0,
      explanation:
        "A string holds the exact decimal text. A `double` argument already contains the binary error.",
    },
    {
      type: "truefalse",
      id: "bigdecimal-equals-scale",
      statement:
        '`new BigDecimal("2.0").equals(new BigDecimal("2.00"))` is `true`.',
      answer: false,
      explanation:
        "`equals` also compares the scale. Use `compareTo`, which returns `0` for equal values.",
    },
    {
      type: "blank",
      id: "exact-method",
      prompt:
        "The method `Math.___Exact(a, b)` throws an exception when adding two ints overflows.",
      answer: "add",
      explanation:
        "`Math.addExact` throws `ArithmeticException` instead of wrapping around.",
    },
  ],
  assignment: {
    title: "A safe total",
    task: [
      "Write a program that adds the prices 19.99, 5.01 and 0.10 using `BigDecimal`, and prints the total.",
      "Then print the same sum using `double`, and note the difference in a comment.",
    ],
    checklist: [
      "I created each BigDecimal from a string",
      "The BigDecimal total is exactly 25.10",
      "I wrote down what the double version printed",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "detect-overflow",
      title: "Detect overflow",
      task: [
        "Write a method `int safeAdd(int a, int b)` that returns the sum, or throws an `ArithmeticException` if the sum does not fit in an `int`.",
      ],
      language: "java",
      starter:
        "public class Safe {\n  static int safeAdd(int a, int b) {\n    // your code\n    return 0;\n  }\n}",
      solution:
        "public class Safe {\n  static int safeAdd(int a, int b) {\n    return Math.addExact(a, b);\n  }\n}",
      hints: ["The `Math` class already has a method for this."],
      checklist: [
        "`safeAdd(Integer.MAX_VALUE, 1)` throws",
        "`safeAdd(2, 3)` returns 5",
      ],
    },
  ],
  revisionNotes: [
    "int overflow wraps silently, long or addExact avoids surprises",
    "float and double are binary, so 0.1 is not exact",
    "BigDecimal from a String, compare with compareTo",
    "Round money once, at the end",
  ],
  resources: [
    {
      label: "Java SE API: BigDecimal",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html",
    },
    {
      label: "The Java Tutorials: Primitive Data Types",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html",
    },
  ],
})
