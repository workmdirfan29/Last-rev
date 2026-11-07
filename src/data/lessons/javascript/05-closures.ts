import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "closures",
  title: "Closures: functions that remember",
  topic: "Closures",
  minutes: 70,
  overview:
    "Understand how a function keeps access to the variables around it, and use that for private state, factories and callbacks.",
  objectives: [
    "Define a closure and explain what it remembers",
    "Use a closure to keep private state",
    "Avoid the classic loop and memory pitfalls",
  ],
  prerequisites: ["lesson.javascript.scope-and-hoisting"],
  sections: [
    {
      kind: "explain",
      heading: "What a closure is",
      body: [
        "A **closure** is a function together with the variables that were in scope where the function was created. The function keeps access to those variables even after the outer function has finished.",
        "Every function in JavaScript is a closure, but the idea matters most when an inner function is returned or passed away. It then carries its surroundings with it, like a backpack.",
        "The closure keeps the **variables themselves**, not a copy of their values at that time. If the outer variable changes, the inner function sees the new value.",
      ],
    },
    {
      kind: "code",
      heading: "A counter with private state",
      example: {
        title: "Private variable",
        language: "javascript",
        code: "function createCounter() {\n  let count = 0;\n  return {\n    increment() {\n      count += 1;\n      return count;\n    },\n    value() {\n      return count;\n    },\n  };\n}\nconst a = createCounter();\nconst b = createCounter();\na.increment();\na.increment();\nb.increment();\nconsole.log(a.value(), b.value());\nconsole.log(a.count);",
        walkthrough: [
          "Each call to `createCounter` makes a new `count` variable.",
          "`increment` and `value` close over that variable, so they can read and change it.",
          "Outside code cannot reach `count` directly, so `a.count` is `undefined`. The only way in is through the two methods.",
          "`a` and `b` have separate counters, so the first line prints `2 1`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Why closures are useful",
      body: [
        "Closures give you **private state** without classes. They let you create **function factories**, such as a function that returns a validator for a given limit. They are also how callbacks keep the data they need after the code that created them has finished, for example in timers and event handlers.",
        "Because the variable lives as long as the closure is reachable, a closure can also keep memory alive. A long-lived callback that closes over a large object keeps that object in memory until the callback is released.",
      ],
    },
    {
      kind: "code",
      heading: "A function factory",
      example: {
        title: "Partial application",
        language: "javascript",
        code: "function limitTo(max) {\n  return (value) => value <= max;\n}\nconst isSmall = limitTo(10);\nconsole.log(isSmall(5), isSmall(50));\nconsole.log([3, 12, 7, 20].filter(isSmall));",
        walkthrough: [
          "`limitTo(10)` returns a function that remembers `max = 10`.",
          "Each test calls the same function with a different value.",
          "`filter` passes every element to `isSmall`, so only `3` and `7` remain.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Creating closures in a loop with `var`.",
          fix: "Use `let`, or create a new function scope for each pass.",
        },
        {
          mistake:
            "Expecting a closure to keep an old value of a changing variable.",
          fix: "It keeps the variable. Copy the value into a new variable if you need a snapshot.",
        },
        {
          mistake: "Keeping a closure to a large object longer than needed.",
          fix: "Release the closure, or set the reference to `null`, when you no longer need it.",
        },
        {
          mistake: "Using a closure where a simple argument would do.",
          fix: "If the data can be passed in as a parameter, that is often clearer.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A debounced search box",
      scenario:
        "A search box should call the server only after the user stops typing for 300 milliseconds.",
      body: [
        "A `debounce(fn, delay)` function returns a new function and keeps a `timerId` variable in its closure. Each call clears the old timer and starts a new one.",
        "Only the last call in a quick series runs `fn`, and the timer id is private to each debounced function.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "counter-closure",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "function make() {\n  let n = 0;\n  return () => ++n;\n}\nconst c = make();\nc();\nc();\nconsole.log(c());",
      },
      options: ["3", "1", "0"],
      answer: 0,
      explanation:
        "The returned function keeps the same `n`. It is increased on each call, so the third call returns `3`.",
    },
    {
      type: "output",
      id: "var-closures",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "var fns = [];\nfor (var i = 0; i < 3; i++) {\n  fns.push(() => i);\n}\nconsole.log(fns.map((f) => f()));",
      },
      options: ["[ 3, 3, 3 ]", "[ 0, 1, 2 ]", "[ 2, 2, 2 ]"],
      answer: 0,
      explanation:
        "With `var` there is one `i` for the whole loop, and it is `3` when the functions are finally called.",
    },
    {
      type: "truefalse",
      id: "closure-copy",
      statement:
        "A closure keeps a copy of the value that a variable had when the closure was created.",
      answer: false,
      explanation:
        "It keeps access to the variable itself, so later changes are visible.",
    },
    {
      type: "single",
      id: "closure-use",
      prompt: "Which is a typical use of a closure?",
      options: [
        "Keeping private state in a function",
        "Making a variable global",
        "Speeding up a loop",
      ],
      answer: 0,
      explanation:
        "Closures hide variables from outside code while letting the inner functions use them.",
    },
  ],
  assignment: {
    title: "Private bank account",
    task: [
      "Write `createAccount(initial)` that returns an object with `deposit(amount)`, `withdraw(amount)` and `balance()`.",
      "Do not allow a withdrawal larger than the balance, and keep the balance impossible to change from outside.",
    ],
    checklist: [
      "The balance is not a property of the returned object",
      "A too-large withdrawal is refused",
      "Two accounts do not share a balance",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "make-adder",
      title: "Make an adder",
      task: [
        "Write `addAfter(start, steps)`. Inside it, create a closure `add(n)` that increases a private total that starts at `start`. Call it for every number in `steps` and return the final total.",
      ],
      language: "javascript",
      starter: "function addAfter(start, steps) {\n  // your code\n}",
      solution:
        "function addAfter(start, steps) {\n  let total = start;\n  const add = (n) => {\n    total += n;\n    return total;\n  };\n  steps.forEach(add);\n  return total;\n}",
      hints: [
        "The inner function changes `total`, which lives in the outer function.",
      ],
      checklist: [
        "An empty list returns the start value",
        "Negative steps work",
        "The total is private to each call",
      ],
      run: {
        entry: "addAfter",
        cases: [
          {
            name: "empty",
            args: [5, []],
            expected: 5,
          },
          {
            name: "simple",
            args: [0, [1, 2, 3]],
            expected: 6,
          },
          {
            name: "negative",
            args: [10, [-3, -2]],
            expected: 5,
          },
          {
            name: "start",
            args: [100, [1]],
            expected: 101,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "A closure = a function + the variables around where it was created",
    "It keeps the variables themselves, not copies",
    "Uses: private state, factories, callbacks, debounce",
    "A long-lived closure can keep memory alive",
  ],
  resources: [
    {
      label: "MDN: Closures",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
    },
    {
      label: "MDN: Functions (closures)",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    },
  ],
})
