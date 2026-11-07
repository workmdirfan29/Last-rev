import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "data-types",
  title: "Data types: primitives and objects",
  topic: "Data types",
  minutes: 60,
  overview:
    "Learn the eight JavaScript types, how primitives differ from objects, and how to check a type correctly.",
  objectives: [
    "Name the seven primitive types and the object type",
    "Explain why primitives are copied by value and objects by reference",
    "Check types with typeof, Array.isArray and Number.isNaN, and know the traps",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "The types you have",
      body: [
        "JavaScript has seven **primitive** types: `string`, `number`, `bigint`, `boolean`, `undefined`, `null` and `symbol`. Everything else is an **object**, including arrays, functions, dates and plain `{}` objects.",
        "Primitives are immutable. You cannot change the letters of a string in place, you can only make a new string. Objects are mutable: their properties can be added, changed and removed.",
        "`number` is one type for both integers and decimals, stored as a 64-bit floating point value. For whole numbers larger than `Number.MAX_SAFE_INTEGER` (2^53 - 1) use `bigint`, written with an `n` suffix such as `123n`.",
      ],
    },
    {
      kind: "code",
      heading: "Checking a type",
      example: {
        title: "typeof and its traps",
        language: "javascript",
        code: "console.log(typeof 'hi');\nconsole.log(typeof 42);\nconsole.log(typeof undefined);\nconsole.log(typeof null);\nconsole.log(typeof [1, 2]);\nconsole.log(Array.isArray([1, 2]));\nconsole.log(typeof function () {});",
        walkthrough: [
          "`typeof` returns a string that names the type.",
          "`typeof null` is `'object'`. This is an old mistake in the language that cannot be fixed, so test for `null` with `value === null`.",
          "An array is an object, so `typeof [1, 2]` is `'object'`. Use `Array.isArray` to test for arrays.",
          "A function is also an object, but `typeof` reports `'function'` for it.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Value and reference",
      body: [
        "When you assign a primitive to another variable, the value is **copied**. Changing one variable does not affect the other.",
        "When you assign an object, the variable holds a **reference** to it. After `const b = a`, both names point to the same object, so a change through `b` is visible through `a`. To get an independent copy use the spread syntax `{ ...a }` for a shallow copy, or `structuredClone(a)` for a deep copy.",
        "`const` stops a variable from being reassigned. It does not make an object immutable, so `const list = []; list.push(1)` is allowed.",
      ],
    },
    {
      kind: "code",
      heading: "Copy or share?",
      example: {
        title: "Primitives copy, objects share",
        language: "javascript",
        code: "let a = 5;\nlet b = a;\nb = 6;\nconsole.log(a, b);\n\nconst user = { name: 'Asha' };\nconst same = user;\nconst copy = { ...user };\nsame.name = 'Ravi';\nconsole.log(user.name, copy.name);",
        walkthrough: [
          "`b = a` copies the number, so changing `b` leaves `a` at `5`.",
          "`same` points to the same object as `user`, so setting `same.name` changes what `user.name` shows.",
          "`copy` is a new object made from the old one, so it still has `'Asha'`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Testing for null with typeof.",
          fix: "Use `value === null`, because `typeof null` is `'object'`.",
        },
        {
          mistake: "Using `typeof value === 'object'` to detect an object.",
          fix: "Also exclude `null`, and use `Array.isArray` when you need to know about arrays.",
        },
        {
          mistake: "Using `value === NaN` to find NaN.",
          fix: "`NaN` is never equal to anything, even itself. Use `Number.isNaN(value)`.",
        },
        {
          mistake: "Expecting `const` to freeze an object.",
          fix: "`const` fixes the binding only. Use `Object.freeze` for a shallow freeze.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reading a value from a form",
      scenario:
        "A form field gives you the text `'42'`, and you want to add 8 to it.",
      body: [
        "Form values are strings, so `'42' + 8` joins them into `'428'`. Convert first with `Number('42')` and check the result with `Number.isNaN`.",
        "Keeping the type of each value clear, and converting once at the edge of your code, avoids most surprises.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "typeof-null",
      prompt: "What does `typeof null` return?",
      options: ["'object'", "'null'", "'undefined'"],
      answer: 0,
      explanation:
        "It is a long-standing quirk. `null` is a primitive, but `typeof` reports `'object'`. Compare with `=== null` instead.",
    },
    {
      type: "output",
      id: "copy-vs-share",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const a = { n: 1 };\nconst b = a;\nb.n = 2;\nconsole.log(a.n);",
      },
      options: ["2", "1", "undefined"],
      answer: 0,
      explanation:
        "`a` and `b` refer to the same object, so the change through `b` shows in `a`.",
    },
    {
      type: "truefalse",
      id: "const-freezes",
      statement:
        "A variable declared with `const` can never have its object contents changed.",
      answer: false,
      explanation:
        "`const` only prevents reassigning the variable. The properties of an object it holds can still change.",
    },
    {
      type: "multi",
      id: "primitive-types",
      prompt: "Which of these are primitive types?",
      options: ["string", "symbol", "array", "bigint", "function"],
      answers: [0, 1, 3],
      explanation:
        "Arrays and functions are objects. String, symbol and bigint are primitives.",
    },
  ],
  assignment: {
    title: "Type report",
    task: [
      "Write a function `describe(value)` that returns a string such as `'number'`, `'null'`, `'array'`, `'object'` or the `typeof` result for anything else.",
      "Test it with at least eight different values, including `null`, `[]`, `{}`, `NaN` and a function.",
    ],
    checklist: [
      "`null` gives 'null' and not 'object'",
      "Arrays give 'array'",
      "I tested at least eight values",
      "I can explain why `typeof NaN` is 'number'",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "type-name",
      title: "Name the type",
      task: [
        "Write `typeName(value)` that returns `'null'` for null, `'array'` for an array, and otherwise the result of `typeof`.",
      ],
      language: "javascript",
      starter: "function typeName(value) {\n  // your code\n}",
      solution:
        "function typeName(value) {\n  if (value === null) return 'null';\n  if (Array.isArray(value)) return 'array';\n  return typeof value;\n}",
      hints: ["Check `null` and arrays before falling back to `typeof`."],
      checklist: [
        "null gives 'null'",
        "An array gives 'array'",
        "A plain object gives 'object'",
      ],
      run: {
        entry: "typeName",
        cases: [
          {
            name: "null",
            args: [null],
            expected: "null",
          },
          {
            name: "array",
            args: [[1, 2]],
            expected: "array",
          },
          {
            name: "object",
            args: [
              {
                a: 1,
              },
            ],
            expected: "object",
          },
          {
            name: "string",
            args: ["hi"],
            expected: "string",
          },
          {
            name: "number",
            args: [3],
            expected: "number",
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Primitives: string, number, bigint, boolean, undefined, null, symbol",
    "Everything else is an object, and objects are copied by reference",
    "`typeof null` is 'object'. Use `=== null` and `Array.isArray`",
    "`const` fixes the binding, not the contents",
  ],
  resources: [
    {
      label: "MDN: JavaScript data types and data structures",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
    },
    {
      label: "MDN: typeof",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof",
    },
  ],
})
