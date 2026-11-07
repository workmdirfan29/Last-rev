import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "type-coercion",
  title: "Type coercion and equality",
  topic: "Type coercion",
  minutes: 45,
  overview:
    "Understand how JavaScript converts values automatically, why `==` and `===` differ, and which values are falsy.",
  objectives: [
    "Predict the result of `+`, `==` and `if` with mixed types",
    "List the falsy values",
    "Choose `===` by default and convert types on purpose",
  ],
  prerequisites: ["lesson.javascript.data-types"],
  sections: [
    {
      kind: "explain",
      heading: "What coercion is",
      body: [
        "**Type coercion** is the automatic conversion of a value from one type to another. It happens when an operator or a statement needs a type that the value does not have.",
        "With `+`, if either side is a string, the other side is converted to a string and the two are joined. With `-`, `*` and `/`, both sides are converted to numbers. So `'5' + 1` is `'51'`, while `'5' - 1` is `4`.",
        "In a condition such as `if (value)`, the value is converted to a boolean. The values that become `false` are called **falsy**: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined` and `NaN`. Everything else is truthy, including `'0'`, `'false'`, `[]` and `{}`.",
      ],
    },
    {
      kind: "code",
      heading: "Mixed types",
      example: {
        title: "Coercion in action",
        language: "javascript",
        code: "console.log('5' + 1);\nconsole.log('5' - 1);\nconsole.log(true + 1);\nconsole.log([] + []);\nconsole.log(Boolean('0'), Boolean(''), Boolean([]));",
        walkthrough: [
          "The first line joins as strings and prints `51`.",
          "The second converts `'5'` to a number and prints `4`.",
          "`true` becomes `1`, so the third line prints `2`.",
          "Two empty arrays become empty strings and are joined, so the fourth line prints an empty line.",
          "`'0'` and `[]` are truthy, and `''` is falsy, so the last line prints `true false true`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "== and ===",
      body: [
        "`===` is **strict equality**. It is true only when the types are the same and the values are the same, with no conversion. `==` is **loose equality**: it converts the operands first, with rules that are hard to remember.",
        "Some examples of loose equality: `0 == ''` is true, `null == undefined` is true, and `'1' == 1` is true. `NaN` is not equal to anything, even to `NaN`.",
        "The habit that avoids almost every problem: use `===` and `!==`. The one common exception is `value == null`, which is a short way to test for both `null` and `undefined`.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Adding a string from an input to a number.",
          fix: "Convert first: `Number(input)`, then add.",
        },
        {
          mistake: "Writing `if (items.length == false)` or similar tricks.",
          fix: "Be explicit: `if (items.length === 0)`.",
        },
        {
          mistake: "Treating `0` or `''` as 'missing' with `if (!value)`.",
          fix: "When `0` or an empty string is a valid value, compare with `=== undefined` or use `??`.",
        },
        {
          mistake: "Comparing with `==` because it 'works'.",
          fix: "Use `===` so that the result does not depend on conversion rules.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A quantity of zero",
      scenario:
        "A shopping cart reads `quantity` from settings, and `0` is a valid quantity.",
      body: [
        "`const quantity = settings.quantity || 1` replaces a valid `0` with `1`, because `0` is falsy.",
        "The nullish coalescing operator `??` replaces only `null` and `undefined`: `settings.quantity ?? 1` keeps the `0`.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "plus-mixed",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log(1 + '2');\nconsole.log(3 - '1');",
      },
      options: ["'12' then 2", "3 then 2", "12 then 4"],
      answer: 0,
      explanation:
        "`+` with a string joins, so the result is the string `12`. `-` converts to numbers, so `3 - '1'` is `2`.",
    },
    {
      type: "single",
      id: "falsy-value",
      prompt: "Which value is truthy?",
      options: ["'0'", "0", "''", "null"],
      answer: 0,
      explanation:
        "The string `'0'` is not empty, so it is truthy. `0`, `''` and `null` are falsy.",
    },
    {
      type: "truefalse",
      id: "nan-equal",
      statement: "`NaN === NaN` is true.",
      answer: false,
      explanation:
        "`NaN` is the only value that is not equal to itself. Use `Number.isNaN`.",
    },
    {
      type: "blank",
      id: "nullish-op",
      prompt:
        "To use a default only for null and undefined, write `value ___ 'default'`.",
      answer: "??",
      explanation:
        "`??` keeps values such as `0` and `''`, while `||` replaces them.",
    },
  ],
  assignment: {
    title: "Equality table",
    task: [
      "Make a table of at least ten pairs of values, for example `0` and `''`, `null` and `undefined`, `'1'` and `1`.",
      "Predict `==` and `===` for each pair before running, then check in the console.",
    ],
    checklist: [
      "I predicted before running",
      "I explained each wrong prediction",
      "I list the eight falsy values from memory",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "safe-sum",
      title: "Add numbers from text",
      task: [
        "Write `safeSum(a, b)` that converts both arguments with `Number` and returns their sum. If either conversion gives `NaN`, return `null`.",
      ],
      language: "javascript",
      starter: "function safeSum(a, b) {\n  // your code\n}",
      solution:
        "function safeSum(a, b) {\n  const x = Number(a);\n  const y = Number(b);\n  if (Number.isNaN(x) || Number.isNaN(y)) return null;\n  return x + y;\n}",
      hints: ["Number('abc') is NaN, and NaN is never equal to itself."],
      checklist: [
        "'5' and '3' give 8",
        "Text that is not a number gives null",
        "I used Number.isNaN",
      ],
      run: {
        entry: "safeSum",
        cases: [
          {
            name: "strings",
            args: ["5", "3"],
            expected: 8,
          },
          {
            name: "mixed",
            args: [2, "4"],
            expected: 6,
          },
          {
            name: "bad",
            args: ["x", 1],
            expected: null,
          },
          {
            name: "empty",
            args: ["", 5],
            expected: 5,
          },
          {
            name: "decimal",
            args: ["1.5", "2.5"],
            expected: 4,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "`+` joins if a string is involved, other operators convert to numbers",
    "Falsy: false, 0, -0, 0n, '', null, undefined, NaN",
    "Use `===`; `??` for defaults that must keep 0 and ''",
    "NaN is not equal to itself: use Number.isNaN",
  ],
  resources: [
    {
      label: "MDN: Equality comparisons and sameness",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness",
    },
    {
      label: "MDN: Falsy",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/Falsy",
    },
  ],
})
