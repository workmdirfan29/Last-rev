import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "this-keyword",
  title: "The this keyword",
  topic: "this",
  minutes: 50,
  overview:
    "Learn how the value of this is decided at call time, and how bind, call, apply and arrow functions change it.",
  objectives: [
    "Predict what this refers to in a method call, a plain call and a constructor call",
    "Fix a lost this with bind or an arrow function",
    "Use call and apply to choose this yourself",
  ],
  prerequisites: ["lesson.javascript.functions"],
  sections: [
    {
      kind: "explain",
      heading: "this depends on how a function is called",
      body: [
        "In a normal function, `this` is not decided where the function is written. It is decided **when the function is called**. This is the cause of most confusion about `this`.",
        "The main cases: for a **method call** such as `user.greet()`, `this` is the object before the dot. For a **plain call** such as `greet()`, `this` is `undefined` in strict mode, which modules and classes use, and the global object otherwise. With `new`, `this` is the new object that is being created.",
        "**Arrow functions** are different: they have no `this` of their own and use the `this` of the code around them, where they were written.",
      ],
    },
    {
      kind: "code",
      heading: "Method call and lost this",
      example: {
        title: "Losing this",
        language: "javascript",
        code: "'use strict';\nconst user = {\n  name: 'Asha',\n  greet() {\n    return 'Hi ' + (this ? this.name : 'nobody');\n  },\n};\nconsole.log(user.greet());\nconst fn = user.greet;\nconsole.log(fn());",
        walkthrough: [
          "`user.greet()` is a method call, so `this` is `user` and the result is `Hi Asha`.",
          "Copying the method into `fn` and calling it alone is a plain call, so `this` is `undefined`, and the result is `Hi nobody`.",
          "The function is the same. Only the way it was called changed.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Choosing this yourself",
      body: [
        "`fn.call(thisValue, arg1, arg2)` calls the function with the `this` that you give. `fn.apply(thisValue, [arg1, arg2])` does the same with the arguments in an array. `fn.bind(thisValue)` does not call it, and returns a **new function** whose `this` is fixed.",
        "A bound function keeps its `this` even when it is passed around, which solves the lost `this` problem for callbacks such as event handlers and timers.",
        "An arrow function is often a simpler fix: `setTimeout(() => this.update(), 100)` keeps the `this` of the surrounding method.",
      ],
    },
    {
      kind: "code",
      heading: "Fixing a callback",
      example: {
        title: "bind and arrow functions",
        language: "javascript",
        code: "const timer = {\n  seconds: 0,\n  startBroken() {\n    return [1, 2].map(function () {\n      return this === undefined;\n    });\n  },\n  startArrow() {\n    return [1, 2].map(() => this.seconds + 1);\n  },\n};\nconsole.log(timer.startArrow());\n\nfunction show() {\n  return this.label;\n}\nconst bound = show.bind({ label: 'bound' });\nconsole.log(bound(), show.call({ label: 'called' }));",
        walkthrough: [
          "The arrow function inside `startArrow` uses the `this` of the method, which is `timer`, so each element gives `1`.",
          "`bind` returns a new function with `this` set to the object, so `bound()` gives `bound`.",
          "`call` sets `this` for a single call, so the last result is `called`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Passing `obj.method` as a callback and losing `this`.",
          fix: "Pass `obj.method.bind(obj)` or an arrow function `() => obj.method()`.",
        },
        {
          mistake:
            "Using an arrow function as an object method and reading `this.name`.",
          fix: "Arrow functions do not get the object as `this`. Use the method shorthand `greet() { ... }`.",
        },
        {
          mistake: "Forgetting `new` when calling a constructor function.",
          fix: "Without `new`, `this` is not a new object. Use classes, which throw an error in that case.",
        },
        {
          mistake:
            "Using `this` at the top level of a module and expecting the global object.",
          fix: "In modules, top-level `this` is `undefined`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A click handler in a class",
      scenario:
        "A component class registers `this.onClick` as a click handler, and the handler reads `this.count`.",
      body: [
        "Passing `this.onClick` as it is loses the object. Binding it once in the constructor, or defining it as an arrow function field, keeps `this` correct for every click.",
        "Check the call, not the definition, when you debug a wrong `this`.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "method-vs-plain",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "'use strict';\nconst o = {\n  v: 1,\n  get() {\n    return this === undefined ? 'none' : this.v;\n  },\n};\nconst f = o.get;\nconsole.log(o.get(), f());",
      },
      options: ["1 none", "1 1", "none none"],
      answer: 0,
      explanation:
        "The method call uses `o` as `this`. The copied function is called plainly, so `this` is `undefined` in strict mode.",
    },
    {
      type: "output",
      id: "arrow-this",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const o = {\n  n: 5,\n  run() {\n    return [1].map(() => this.n);\n  },\n};\nconsole.log(o.run());",
      },
      options: ["[ 5 ]", "[ undefined ]", "[ 1 ]"],
      answer: 0,
      explanation: "The arrow function uses the `this` of `run`, which is `o`.",
    },
    {
      type: "single",
      id: "bind-returns",
      prompt: "What does `fn.bind(obj)` return?",
      options: [
        "A new function with this set to obj",
        "The result of calling fn",
        "The object obj",
      ],
      answer: 0,
      explanation:
        "`bind` does not call the function. It returns a new, bound function.",
    },
    {
      type: "truefalse",
      id: "arrow-own-this",
      statement:
        "An arrow function has its own `this` that is set when it is called.",
      answer: false,
      explanation:
        "An arrow function uses the `this` of the code where it was written.",
    },
  ],
  assignment: {
    title: "Fix the broken handlers",
    task: [
      "Write an object `counter` with a `count` property and an `increment` method.",
      "Pass `increment` to `setTimeout` three different ways: broken, with `bind`, and with an arrow function, and log `count` after each.",
    ],
    checklist: [
      "I reproduced the lost this",
      "Both fixes give the right count",
      "I can explain why the arrow function works",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "describe-with",
      title: "Call with a chosen this",
      task: [
        "Write `describeWith(person, greeting)`. Define a helper `function say(punctuation) { return greeting + ', ' + this.name + punctuation }` inside it, call it with `person` as `this` and `'!'` as the argument, and return the result.",
      ],
      language: "javascript",
      starter: "function describeWith(person, greeting) {\n  // your code\n}",
      solution:
        "function describeWith(person, greeting) {\n  function say(punctuation) {\n    return greeting + ', ' + this.name + punctuation;\n  }\n  return say.call(person, '!');\n}",
      hints: ["`call` takes `this` as its first argument."],
      checklist: [
        "The name comes from the person object",
        "The greeting comes from the argument",
        "I used call or apply",
      ],
      run: {
        entry: "describeWith",
        cases: [
          {
            name: "hello",
            args: [
              {
                name: "Asha",
              },
              "Hello",
            ],
            expected: "Hello, Asha!",
          },
          {
            name: "hi",
            args: [
              {
                name: "Ravi",
              },
              "Hi",
            ],
            expected: "Hi, Ravi!",
          },
          {
            name: "other",
            args: [
              {
                name: "Meera",
              },
              "Welcome",
            ],
            expected: "Welcome, Meera!",
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "`this` is decided at call time, not where the function is written",
    "Method call: the object before the dot. Plain call: undefined in strict mode",
    "`call` and `apply` set `this` for one call, `bind` returns a bound function",
    "Arrow functions use the surrounding `this`",
  ],
  resources: [
    {
      label: "MDN: this",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
    },
    {
      label: "MDN: Function.prototype.bind",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind",
    },
  ],
})
