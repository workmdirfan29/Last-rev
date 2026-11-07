import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "functions",
  title: "Functions: declarations, expressions and arrow functions",
  topic: "Functions",
  minutes: 60,
  overview:
    "Write functions in the three common forms, use default and rest parameters, and understand return values and callbacks.",
  objectives: [
    "Write function declarations, expressions and arrow functions",
    "Use default parameters, rest parameters and destructured parameters",
    "Pass a function as an argument and return one from another",
  ],
  prerequisites: ["lesson.javascript.type-coercion"],
  sections: [
    {
      kind: "explain",
      heading: "Three ways to write a function",
      body: [
        "A **function declaration** starts with the keyword `function` and a name: `function add(a, b) { return a + b }`. Declarations are hoisted, so you can call them before the line where they are written.",
        "A **function expression** gives a function to a variable: `const add = function (a, b) { return a + b }`. It is not available before that line runs.",
        "An **arrow function** is a shorter expression: `const add = (a, b) => a + b`. With one expression after the arrow, the value is returned without the `return` keyword. Arrow functions have no `this` of their own, which a later lesson explains.",
      ],
    },
    {
      kind: "code",
      heading: "Parameters",
      example: {
        title: "Defaults, rest and destructuring",
        language: "javascript",
        code: "function greet(name = 'friend', ...extras) {\n  return 'Hello ' + name + ' ' + extras.length;\n}\nconsole.log(greet());\nconsole.log(greet('Asha', 1, 2, 3));\n\nfunction area({ width, height = 1 }) {\n  return width * height;\n}\nconsole.log(area({ width: 4, height: 5 }));\nconsole.log(area({ width: 4 }));",
        walkthrough: [
          "A default value is used when the argument is `undefined`, so `greet()` prints `Hello friend 0`.",
          "`...extras` collects all the remaining arguments into an array, so the second call prints `Hello Asha 3`.",
          "Destructuring in the parameter list takes `width` and `height` from the object, and `height` defaults to `1`.",
          "The calls print `20` and `4`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Functions are values",
      body: [
        "In JavaScript, a function is an object that you can store in a variable, pass as an argument and return from another function. A function that receives or returns a function is called a **higher-order function**.",
        "A function passed to another function to be called later is a **callback**. Array methods such as `map`, `filter` and `forEach` take callbacks.",
        "A function without a `return` statement returns `undefined`. A `return` ends the function immediately, so code after it never runs.",
      ],
    },
    {
      kind: "code",
      heading: "A function that returns a function",
      example: {
        title: "Making a multiplier",
        language: "javascript",
        code: "function multiplier(factor) {\n  return (n) => n * factor;\n}\nconst double = multiplier(2);\nconst triple = multiplier(3);\nconsole.log(double(5), triple(5));\nconsole.log([1, 2, 3].map(double));",
        walkthrough: [
          "`multiplier(2)` returns a new function that remembers `factor`.",
          "`double(5)` is `10`, and `triple(5)` is `15`.",
          "`map` calls `double` once for each element, so the last line prints `[ 2, 4, 6 ]`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting `return` in a block body arrow function.",
          fix: "With braces, write `return`. Without braces, the expression is returned automatically.",
        },
        {
          mistake:
            "Returning an object literal from an arrow function as `() => { a: 1 }`.",
          fix: "Wrap it in parentheses: `() => ({ a: 1 })`. Otherwise the braces are read as a block.",
        },
        {
          mistake:
            "Calling a callback immediately: `button.onclick = handle()`.",
          fix: "Pass the function itself: `button.onclick = handle`.",
        },
        {
          mistake: "Changing an object parameter and surprising the caller.",
          fix: "Objects are passed by reference. Return a new object, or copy first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reusable validation",
      scenario:
        "A signup form has several fields, and each needs a different rule.",
      body: [
        "Write each rule as a small function, such as `isEmail(value)` or `minLength(8)`, and keep them in an array. A loop then runs every rule over the value and collects the messages.",
        "Because functions are values, adding a new rule means adding one function to the array.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "default-param",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "function f(a, b = 10) {\n  return a + b;\n}\nconsole.log(f(1), f(1, 2));",
      },
      options: ["11 3", "1 2", "NaN 3"],
      answer: 0,
      explanation:
        "`b` defaults to `10` only when no value is given, so `f(1)` is `11` and `f(1, 2)` is `3`.",
    },
    {
      type: "single",
      id: "arrow-object",
      prompt: "Which arrow function returns the object `{ ok: true }`?",
      options: [
        "() => ({ ok: true })",
        "() => { ok: true }",
        "() => [ok: true]",
      ],
      answer: 0,
      explanation:
        "Without parentheses the braces form a block, and `ok: true` is a label. Parentheses make it an object literal.",
    },
    {
      type: "truefalse",
      id: "hoist-decl",
      statement:
        "A function declaration can be called before the line where it is written.",
      answer: true,
      explanation:
        "Declarations are hoisted completely. A function expression stored in a `const` is not.",
    },
    {
      type: "blank",
      id: "rest-param",
      prompt:
        "To collect all remaining arguments into an array, write `function f(a, ___rest)`, using three dots before the name.",
      answer: "...",
      explanation:
        "The rest parameter `...rest` gathers the extra arguments into an array.",
    },
  ],
  assignment: {
    title: "Build a small toolbox",
    task: [
      "Write `compose(f, g)` that returns a function which applies `g` first and then `f`.",
      "Write `once(fn)` that returns a function that runs `fn` only the first time and returns the same result after.",
    ],
    checklist: [
      "compose works with two arrow functions",
      "once calls the original function one time only",
      "I tested both with console.log",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "sum-all",
      title: "Sum any number of values",
      task: [
        "Write `sumAll(...numbers)` that returns the sum of all the arguments, and `0` when there are none.",
      ],
      language: "javascript",
      starter: "function sumAll(...numbers) {\n  // your code\n}",
      solution:
        "function sumAll(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}",
      hints: ["The rest parameter gives you an array. `reduce` can add it up."],
      checklist: [
        "No arguments gives 0",
        "One argument gives that number",
        "Negative numbers work",
      ],
      run: {
        entry: "sumAll",
        cases: [
          {
            name: "none",
            args: [],
            expected: 0,
          },
          {
            name: "one",
            args: [5],
            expected: 5,
          },
          {
            name: "several",
            args: [1, 2, 3, 4],
            expected: 10,
          },
          {
            name: "negative",
            args: [-2, 5],
            expected: 3,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Declaration (hoisted), expression, arrow function",
    "Default, rest and destructured parameters",
    "Functions are values: callbacks and higher-order functions",
    "Arrow returning an object needs parentheses",
  ],
  resources: [
    {
      label: "MDN: Functions",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    },
    {
      label: "MDN: Arrow function expressions",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions",
    },
  ],
})
