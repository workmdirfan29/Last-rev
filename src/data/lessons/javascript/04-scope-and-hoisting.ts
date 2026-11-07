import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "scope-and-hoisting",
  title: "Scope, hoisting and the temporal dead zone",
  topic: "Scope & hoisting",
  minutes: 60,
  overview:
    "See where a variable can be used, how var, let and const differ, and what hoisting really does.",
  objectives: [
    "Explain global, function and block scope",
    "Compare var, let and const",
    "Predict the result of using a variable before its declaration",
  ],
  prerequisites: ["lesson.javascript.functions"],
  sections: [
    {
      kind: "explain",
      heading: "What scope is",
      body: [
        "**Scope** is the part of the code where a variable can be used. JavaScript has **global scope**, **function scope** and **block scope**. A block is the code between `{` and `}` in an `if`, a loop or a plain pair of braces.",
        "`let` and `const` are block scoped: they exist only inside the nearest pair of braces. `var` is function scoped: it ignores blocks and lives in the whole function.",
        "When code uses a name, JavaScript looks in the current scope first, then in the scope around it, and so on up to the global scope. This chain is called the **scope chain**. An inner scope can read the variables of an outer scope, but not the other way round.",
      ],
    },
    {
      kind: "code",
      heading: "var, let and const in a block",
      example: {
        title: "Block scope",
        language: "javascript",
        code: "if (true) {\n  var a = 1;\n  let b = 2;\n  const c = 3;\n}\nconsole.log(a);\nconsole.log(typeof b);\nconsole.log(typeof c);",
        walkthrough: [
          "`var a` leaks out of the `if` block, so `a` prints `1`.",
          "`let b` and `const c` stay inside the block, so outside it they are not defined.",
          "`typeof` on a name that does not exist gives `'undefined'` instead of an error, so the last two lines print `undefined`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Hoisting",
      body: [
        "Before running a scope, JavaScript reads the declarations in it. This is called **hoisting**. A `var` is hoisted and set to `undefined`, so you can read it before its line and get `undefined`. A function declaration is hoisted with its body.",
        "`let` and `const` are also hoisted, but they cannot be used before the line that declares them. The time between the start of the scope and that line is the **temporal dead zone**, and reading the variable there throws a `ReferenceError`.",
        "The practical rule: declare variables at the top of their scope, prefer `const`, use `let` only when you must reassign, and avoid `var`.",
      ],
    },
    {
      kind: "code",
      heading: "Hoisting and the dead zone",
      example: {
        title: "Reading before declaring",
        language: "javascript",
        code: "console.log(x);\nvar x = 5;\n\nhello();\nfunction hello() {\n  console.log('hello');\n}\n\ntry {\n  console.log(y);\n  let y = 1;\n} catch (e) {\n  console.log(e.name);\n}",
        walkthrough: [
          "`x` is hoisted and has the value `undefined` at the first line, so it prints `undefined`.",
          "The function declaration is fully hoisted, so `hello()` works before it is written.",
          "`y` is in the temporal dead zone, so reading it throws a `ReferenceError`, and the catch block prints its name.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `var` in a loop and a callback.",
          fix: "Use `let`. Each loop pass then gets its own variable.",
        },
        {
          mistake: "Assigning to a name that was never declared.",
          fix: "Always declare. In sloppy mode it creates a global variable, and in strict mode it throws.",
        },
        {
          mistake:
            "Reusing the same name in an inner scope by accident (shadowing).",
          fix: "Choose different names, so that the outer variable is still reachable.",
        },
        {
          mistake: "Declaring everything at global scope.",
          fix: "Keep variables in the smallest scope that works, or inside a module.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A loop that creates buttons",
      scenario:
        "A page makes five buttons, and each button must show its own number when clicked.",
      body: [
        "With `for (var i = 0; i < 5; i++)`, there is only one `i` for the whole function, so every click handler sees the final value, `5`.",
        "Changing `var` to `let` gives each pass of the loop a new `i`, and each handler remembers its own number.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "var-hoist",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log(typeof a);\nvar a = 1;\nconsole.log(typeof a);",
      },
      options: [
        "undefined then number",
        "number then number",
        "ReferenceError",
      ],
      answer: 0,
      explanation:
        "The hoisted `var` is `undefined` before its line, and a number after it.",
    },
    {
      type: "output",
      id: "loop-let",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const fns = [];\nfor (let i = 0; i < 3; i++) {\n  fns.push(() => i);\n}\nconsole.log(fns.map((f) => f()));",
      },
      options: ["[ 0, 1, 2 ]", "[ 3, 3, 3 ]", "[ 2, 2, 2 ]"],
      answer: 0,
      explanation:
        "`let` creates a new `i` for each pass, so each function keeps its own value.",
    },
    {
      type: "single",
      id: "block-scoped",
      prompt: "Which declarations are block scoped?",
      options: ["let and const", "var and let", "var only"],
      answer: 0,
      explanation:
        "`let` and `const` respect blocks. `var` is function scoped.",
    },
    {
      type: "truefalse",
      id: "tdz",
      statement:
        "Reading a `let` variable before its declaration line throws a ReferenceError.",
      answer: true,
      explanation:
        "The variable is in the temporal dead zone from the start of the scope until its declaration runs.",
    },
  ],
  assignment: {
    title: "Predict the output",
    task: [
      "Write five short snippets that use `var`, `let`, `const`, a function declaration and a function expression before and after their lines.",
      "Write down what each prints before you run it, and explain every difference.",
    ],
    checklist: [
      "I predicted before running",
      "I found one temporal dead zone error on purpose",
      "I can explain hoisting in two sentences",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "capture-loop",
      title: "Capture the loop index",
      task: [
        "Write `captureLoop(n)`. Inside it, make `n` functions in a loop, where the function at position `i` returns `i`. After the loop, call every function and return the array of results.",
      ],
      language: "javascript",
      starter: "function captureLoop(n) {\n  // your code\n}",
      solution:
        "function captureLoop(n) {\n  const fns = [];\n  for (let i = 0; i < n; i++) {\n    fns.push(() => i);\n  }\n  return fns.map((f) => f());\n}",
      hints: ["`let` in the loop header gives each pass its own variable."],
      checklist: [
        "captureLoop(3) is [0, 1, 2]",
        "captureLoop(0) is an empty array",
        "I used let and not var",
      ],
      run: {
        entry: "captureLoop",
        cases: [
          {
            name: "three",
            args: [3],
            expected: [0, 1, 2],
          },
          {
            name: "zero",
            args: [0],
            expected: [],
          },
          {
            name: "five",
            args: [5],
            expected: [0, 1, 2, 3, 4],
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Global, function and block scope; scope chain looks outward",
    "`let` and `const` are block scoped, `var` is function scoped",
    "Hoisting: `var` is undefined before its line, `let`/`const` are in the dead zone",
    "Prefer const, then let, avoid var",
  ],
  resources: [
    {
      label: "MDN: Grammar and types (variable scope and hoisting)",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types",
    },
    {
      label: "MDN: let",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
    },
  ],
})
