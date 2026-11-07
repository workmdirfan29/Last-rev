import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "es6-syntax-values",
  title: "ES6 syntax: variables, templates, destructuring and spread",
  topic: "ES6 syntax",
  minutes: 50,
  overview:
    "Use the modern syntax for declaring variables, building strings, taking values out of objects and arrays, and copying or merging data.",
  objectives: [
    "Use let and const, template literals and default values",
    "Destructure arrays and objects, including nested and renamed values",
    "Use spread and rest to copy, merge and collect values",
  ],
  prerequisites: ["lesson.javascript.objects-and-prototypes"],
  sections: [
    {
      kind: "explain",
      heading: "let, const and template literals",
      body: [
        "Use `const` for values that are not reassigned and `let` for values that are. Both are block scoped. **Template literals** use backticks and let you put expressions inside `${...}`, and they can span several lines.",
        "A template literal is clearer than joining strings with `+`: `` `Hello ${user.name}, you have ${count} messages` ``. A **tagged template** puts a function before the backtick, which is how some libraries build safe queries.",
        "Shorthand properties let you write `{ name, age }` instead of `{ name: name, age: age }`, and computed keys let you write `{ [key]: value }` with a key that is calculated.",
      ],
    },
    {
      kind: "code",
      heading: "Strings and shorthand",
      example: {
        title: "Modern object literals",
        language: "javascript",
        code: "const name = 'Asha';\nconst age = 21;\nconst field = 'city';\nconst person = { name, age, [field]: 'Pune' };\nconsole.log(person);\nconsole.log(`${name} is ${age + 1} next year`);\nconsole.log(`line one\nline two`);",
        walkthrough: [
          "`{ name, age }` takes the property names from the variable names.",
          "`[field]` uses the value of `field`, which is `'city'`, as the key.",
          "Expressions inside `${}` are evaluated, so `age + 1` gives `22`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Destructuring",
      body: [
        "**Destructuring** takes values out of arrays and objects into variables. For arrays, the position matters: `const [first, , third] = list`. For objects, the names matter: `const { name, age } = person`.",
        "You can rename with a colon, `{ name: userName }`, give defaults with `=`, `{ role = 'user' }`, go into nested objects, `{ address: { city } }`, and collect the rest with `...`. It also works in function parameters, which makes functions that take options easy to read.",
        "Swapping two variables needs no temporary variable: `[a, b] = [b, a]`.",
      ],
    },
    {
      kind: "code",
      heading: "Destructuring in practice",
      example: {
        title: "Arrays, objects and parameters",
        language: "javascript",
        code: "const [first, second = 0, ...others] = [10, undefined, 30, 40];\nconsole.log(first, second, others);\nconst { id, tags: [mainTag], owner: { name: ownerName } } = {\n  id: 7,\n  tags: ['js', 'css'],\n  owner: { name: 'Ravi' },\n};\nconsole.log(id, mainTag, ownerName);\nfunction connect({ host = 'localhost', port = 80 } = {}) {\n  return host + ':' + port;\n}\nconsole.log(connect(), connect({ port: 8080 }));",
        walkthrough: [
          "`second` is `undefined` in the array, so its default `0` is used, and `...others` collects the rest.",
          "The object pattern goes into the nested array and object in one line.",
          "A destructured parameter with defaults, and `= {}` for a missing argument, makes every option optional.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Spread and rest",
      body: [
        "The three dots do two jobs. **Spread** expands an array, a string or an object into separate items: `[...a, ...b]`, `{ ...a, ...b }`, `Math.max(...numbers)`. **Rest** collects the remaining items into an array or object, in a parameter list or a destructuring pattern.",
        "Spread makes a **shallow** copy. The first level is new, but nested objects are still shared with the original.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Destructuring a value that can be `null` or `undefined`.",
          fix: "Give a default, such as `= {}`, or check first. Destructuring `null` throws a `TypeError`.",
        },
        {
          mistake: "Writing the pattern in the wrong order for arrays.",
          fix: "Array patterns match by position and object patterns match by name.",
        },
        {
          mistake: "Using spread for a deep copy.",
          fix: "Use `structuredClone` when nested data must not be shared.",
        },
        {
          mistake:
            "Starting a statement with a destructuring assignment `{ a } = obj`.",
          fix: "Wrap it in parentheses: `({ a } = obj)`, otherwise the braces are read as a block.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Options for a function",
      scenario:
        "A `createChart` function needs a title, a size and some colours, and most of them are optional.",
      body: [
        "Take one options object with destructuring and defaults in the parameter list. Callers pass only what they want to change, and the order does not matter.",
        "Spread lets the function merge the options with a set of defaults in one expression.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "destructure-defaults",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const { a = 1, b = 2 } = { a: undefined, b: null };\nconsole.log(a, b);",
      },
      options: ["1 null", "1 2", "undefined null"],
      answer: 0,
      explanation:
        "A default applies only to `undefined`, so `a` becomes `1`, while `null` stays `null`.",
    },
    {
      type: "output",
      id: "spread-merge",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const x = { a: 1, b: 2 };\nconst y = { ...x, b: 3, c: 4 };\nconsole.log(y);",
      },
      options: [
        "{ a: 1, b: 3, c: 4 }",
        "{ a: 1, b: 2, c: 4 }",
        "{ b: 3, c: 4 }",
      ],
      answer: 0,
      explanation: "Later keys replace earlier ones, so `b` is `3`.",
    },
    {
      type: "single",
      id: "rest-vs-spread",
      prompt: "In `const [head, ...tail] = list`, what does `...tail` do?",
      options: [
        "Collects the remaining items into an array",
        "Copies the whole list",
        "Removes the first item from list",
      ],
      answer: 0,
      explanation:
        "In a pattern, `...` is the rest syntax and gathers what is left.",
    },
    {
      type: "truefalse",
      id: "spread-shallow",
      statement: "Spreading an object copies nested objects too.",
      answer: false,
      explanation: "It is a shallow copy, and nested objects are shared.",
    },
  ],
  assignment: {
    title: "Refactor to modern syntax",
    task: [
      "Take a small function written with `var`, string concatenation and manual property access, and rewrite it with `const`, template literals and destructuring.",
      "Add default values and an options object.",
    ],
    checklist: [
      "No var and no string joining with +",
      "The function uses destructuring in its parameters",
      "I tested the old and new versions with the same inputs",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "swap-and-sum",
      title: "Merge options",
      task: [
        "Write `withDefaults(options)` that returns a new object with the defaults `{ size: 10, color: 'blue', visible: true }` and the properties of `options` on top. The input must not be changed.",
      ],
      language: "javascript",
      starter: "function withDefaults(options) {\n  // your code\n}",
      solution:
        "function withDefaults(options) {\n  return { size: 10, color: 'blue', visible: true, ...options };\n}",
      hints: ["Put the defaults first and the spread of `options` after them."],
      checklist: [
        "Missing options use the defaults",
        "Given options replace the defaults",
        "The input object is unchanged",
      ],
      run: {
        entry: "withDefaults",
        cases: [
          {
            name: "empty",
            args: [{}],
            expected: {
              size: 10,
              color: "blue",
              visible: true,
            },
          },
          {
            name: "override",
            args: [
              {
                size: 20,
              },
            ],
            expected: {
              size: 20,
              color: "blue",
              visible: true,
            },
          },
          {
            name: "extra",
            args: [
              {
                id: 1,
                visible: false,
              },
            ],
            expected: {
              size: 10,
              color: "blue",
              visible: false,
              id: 1,
            },
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Template literals: backticks and `${expression}`",
    "Destructuring by position (arrays) and by name (objects), with defaults and renaming",
    "Spread expands, rest collects; both copy only one level",
    "A default applies only for `undefined`",
  ],
  resources: [
    {
      label: "MDN: Destructuring assignment",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
    },
    {
      label: "MDN: Template literals",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals",
    },
    {
      label: "MDN: Spread syntax",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
    },
  ],
})
