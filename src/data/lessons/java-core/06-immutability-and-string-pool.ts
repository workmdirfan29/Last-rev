import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "immutability-and-string-pool",
  title: "Immutable strings and the string pool",
  topic: "Strings",
  minutes: 40,
  overview:
    "Understand why strings cannot change, how the string pool saves memory, and what that means for `==`, `new String` and `intern`.",
  objectives: [
    "Explain what immutable means and name two benefits",
    "Describe the string pool and the difference between a literal and `new String`",
    "Predict the result of `==` and `equals` on different strings",
  ],
  prerequisites: ["lesson.java-core.string-basics"],
  sections: [
    {
      kind: "explain",
      heading: "What immutable means",
      body: [
        "An **immutable** object cannot be changed after it is created. Every `String` method that looks like a change, such as `concat` or `replace`, builds a **new** string and leaves the old one as it was.",
        "This has benefits. A string that nobody can change is safe to share between parts of a program and between threads. It also works well as a key in a `HashMap`, because its hash code never changes.",
        "The cost is that many small changes in a loop create many small objects. The next lesson shows the tool for that: `StringBuilder`.",
      ],
    },
    {
      kind: "explain",
      heading: "The string pool",
      body: [
        'Java keeps a special area called the **string pool**. When you write a string literal such as `"hello"`, Java reuses one shared object for every identical literal.',
        "That is safe only because strings are immutable. Two variables can point to the same object and neither can change it for the other.",
        '`new String("hello")` always creates a **new** object on the heap, even when the pool already has `"hello"`. The method `intern()` returns the pooled object for a given text.',
      ],
    },
    {
      kind: "code",
      heading: "Pool or heap?",
      example: {
        title: "Literals, new String and intern",
        language: "java",
        code: 'String a = "hello";\nString b = "hello";\nString c = new String("hello");\n\nSystem.out.println(a == b);\nSystem.out.println(a == c);\nSystem.out.println(a.equals(c));\nSystem.out.println(a == c.intern());\n\nString d = "hel" + "lo";\nString part = "hel";\nString e = part + "lo";\nSystem.out.println(a == d);\nSystem.out.println(a == e);',
        walkthrough: [
          "`a == b` is `true`. Both literals point to the same pooled object.",
          "`a == c` is `false`. `c` is a separate object created with `new`.",
          "`a.equals(c)` is `true`. The characters are the same, which is what `equals` checks.",
          '`c.intern()` returns the pooled `"hello"`, so the last comparison is `true`.',
          '`"hel" + "lo"` is joined by the compiler into one literal, so `a == d` is `true`. `part + "lo"` is built at run time, so `a == e` is `false`.',
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Where the objects live",
      diagram: {
        kind: "flow",
        title: "Two ways to get a string",
        steps: [
          {
            label: 'Literal "hello"',
            detail: "Looked up in the string pool and reused if present.",
          },
          {
            label: 'new String("hello")',
            detail: "Always makes a new object on the heap.",
          },
          {
            label: "intern()",
            detail: "Returns the pooled object with the same text.",
          },
          {
            label: "equals()",
            detail: "Compares the characters, whichever object they sit in.",
          },
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake:
            "Using `==` to compare strings because it worked in a test with literals.",
          fix: "Strings read from input, files or the network are not pooled. Always use `equals`.",
        },
        {
          mistake: 'Writing `new String("text")` for no reason.',
          fix: 'It wastes memory. Use the literal `"text"`.',
        },
        {
          mistake: 'Thinking `s.concat("x")` appends to `s`.',
          fix: 'It returns a new string. Assign it: `s = s.concat("x");`.',
        },
      ],
    },
    {
      kind: "practical",
      heading: "A bug that appears only in production",
      scenario:
        'A check `if (status == "ACTIVE")` passes in tests and fails with real data.',
      body: [
        "In the tests the status was written as a literal, so it came from the pool and `==` worked. In production the status was read from a database, which creates a new `String` object, so `==` was `false`.",
        'The fix is `"ACTIVE".equals(status)`. It compares the text and is safe when `status` is `null`.',
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "pool-literal-compare",
      prompt: "What is printed for the two literals?",
      code: {
        language: "java",
        code: 'String a = "java";\nString b = "java";\nSystem.out.println(a == b);',
      },
      options: ["true", "false", "A compile error"],
      answer: 0,
      explanation:
        "Identical literals share one pooled object, so both variables refer to the same object.",
    },
    {
      type: "output",
      id: "pool-new-compare",
      prompt: "What is printed when one string is created with new?",
      code: {
        language: "java",
        code: 'String a = "java";\nString c = new String("java");\nSystem.out.println(a == c);\nSystem.out.println(a.equals(c));',
      },
      options: ["false then true", "true then true", "false then false"],
      answer: 0,
      explanation:
        "`new` creates a separate object, so `==` is false. `equals` compares the characters and is true.",
    },
    {
      type: "truefalse",
      id: "immutable-benefit",
      statement:
        "Because strings are immutable, they can be shared safely between threads.",
      answer: true,
      explanation:
        "Nobody can change an immutable object, so sharing it cannot cause one thread to disturb another.",
    },
    {
      type: "multi",
      id: "immutable-benefits",
      prompt: "Which are benefits of immutable strings?",
      options: [
        "They can be shared safely",
        "Their hash code never changes",
        "Concatenating in a loop is always fast",
        "They can be changed in place with `set`",
      ],
      answers: [0, 1],
      explanation:
        "Sharing and a stable hash code are benefits. Concatenation in a loop creates many objects, and strings have no `set` method.",
    },
  ],
  assignment: {
    title: "Predict, then run",
    task: [
      "Write five comparisons between strings created with literals, `new String`, concatenation of literals and `intern()`.",
      "For each one, write your prediction as a comment before you run the program, then compare.",
    ],
    checklist: [
      "I predicted every result before running",
      "I used `equals` for the correct comparisons",
      "I can explain each result I got wrong",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "fix-the-comparison",
      title: "Fix the status check",
      task: [
        "This method compares with `==`. Rewrite it so that it works for any string and does not crash when `status` is `null`.",
      ],
      language: "java",
      starter:
        'public class Check {\n  static boolean isActive(String status) {\n    return status == "ACTIVE";\n  }\n}',
      solution:
        'public class Check {\n  static boolean isActive(String status) {\n    return "ACTIVE".equals(status);\n  }\n}',
      hints: ["Call `equals` on the literal, not on the variable."],
      checklist: [
        "It returns true for a string built at run time",
        "It returns false, and does not throw, for null",
      ],
    },
  ],
  revisionNotes: [
    "Immutable: methods return new strings",
    "Literals come from the pool, `new String` makes a new object",
    "`==` compares references, `equals` compares text",
    "`intern()` returns the pooled string",
  ],
  resources: [
    {
      label: "Java SE API: String (intern)",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html",
    },
    {
      label: "The Java Tutorials: Strings",
      url: "https://docs.oracle.com/javase/tutorial/java/data/strings.html",
    },
  ],
})
