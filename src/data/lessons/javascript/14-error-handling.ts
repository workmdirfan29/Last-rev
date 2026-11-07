import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "error-handling",
  title: "Error handling with try, catch and custom errors",
  topic: "Error handling",
  minutes: 40,
  overview:
    "Throw and catch errors, use finally, create your own error types, and decide where an error should be handled.",
  objectives: [
    "Use try, catch and finally correctly",
    "Throw Error objects and write a custom error class",
    "Handle errors at the right level and keep the cause",
  ],
  prerequisites: ["lesson.javascript.objects-and-prototypes"],
  sections: [
    {
      kind: "explain",
      heading: "try, catch and finally",
      body: [
        "Code that might fail goes in a `try` block. If it throws, the rest of the block is skipped and the `catch` block runs with the error. A `finally` block runs afterwards, **whether or not** an error happened, which makes it the place for cleanup.",
        "You can throw any value, but you should throw an `Error` object, because it records a `message` and a `stack`. Built-in error types include `TypeError`, `RangeError`, `ReferenceError` and `SyntaxError`. An error that is not caught ends the current task, and in the browser it is reported in the console.",
        "`catch` handles only what happens inside the `try` block, at the moment it runs. A callback that runs later is outside the block, so the error must be handled inside the callback or with a promise.",
      ],
    },
    {
      kind: "code",
      heading: "Catching and cleaning up",
      example: {
        title: "try, catch, finally",
        language: "javascript",
        code: "function parse(text) {\n  try {\n    return JSON.parse(text);\n  } catch (error) {\n    console.log(error.name);\n    return null;\n  } finally {\n    console.log('done');\n  }\n}\nconsole.log(parse('{\"a\": 1}'));\nconsole.log(parse('not json'));",
        walkthrough: [
          "The first call succeeds, so `finally` prints `done` before the function returns the object.",
          "The second call throws a `SyntaxError`, the `catch` block prints its name and returns `null`.",
          "`finally` ran in both cases, even though there was a `return` in the other blocks.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Custom errors",
      body: [
        "A custom error class extends `Error`. Give it a clear `name`, and add data that the handler needs. Then the code that catches it can test `error instanceof ValidationError` and react to that kind of problem only.",
        "The `cause` option, `new Error('message', { cause: original })`, keeps the original error when you wrap it in a more useful one, so the information is not lost.",
        "Rethrow an error that you cannot handle: `throw error` in the catch block. Handling an error means doing something useful. Catching it only to hide it makes bugs hard to find.",
      ],
    },
    {
      kind: "code",
      heading: "A validation error",
      example: {
        title: "Custom class and cause",
        language: "javascript",
        code: "class ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\nfunction check(age) {\n  if (!Number.isInteger(age)) throw new ValidationError('age', 'Age must be a whole number');\n  return age;\n}\ntry {\n  check('x');\n} catch (e) {\n  if (e instanceof ValidationError) console.log(e.field + ': ' + e.message);\n  else throw e;\n}",
        walkthrough: [
          "`super(message)` sets the message, and `name` makes the error easy to recognise.",
          "The extra `field` property tells the handler which input was wrong.",
          "The catch block handles only `ValidationError` and rethrows every other kind of error.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Leaving an empty catch block.",
          fix: "At least log the error, or rethrow it. A hidden error hides bugs.",
        },
        {
          mistake: "Throwing strings such as `throw 'failed'`.",
          fix: "Throw `new Error('failed')`, which has a stack trace.",
        },
        {
          mistake: "Wrapping a callback or a timer in try/catch outside it.",
          fix: "The callback runs later, so the block has already finished. Handle the error inside it.",
        },
        {
          mistake: "Showing `error.message` of unexpected errors to users.",
          fix: "Show a friendly message, and log the details for yourself.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reading saved settings",
      scenario:
        "An application reads a JSON string from storage, and the text may be damaged.",
      body: [
        "Wrap `JSON.parse` in a `try` block, and return default settings in the `catch` block, after logging the problem. The rest of the application can then rely on getting an object.",
        "Do the catch at the place that knows what a sensible fallback is.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "finally-order",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "function f() {\n  try {\n    return 'try';\n  } finally {\n    console.log('finally');\n  }\n}\nconsole.log(f());",
      },
      options: ["finally then try", "try then finally", "try only"],
      answer: 0,
      explanation:
        "`finally` runs before the function actually returns, so `finally` is printed first.",
    },
    {
      type: "single",
      id: "throw-what",
      prompt: "What should you throw?",
      options: ["An Error object", "A string", "A number"],
      answer: 0,
      explanation:
        "An `Error` records a message and a stack trace, which makes problems easier to find.",
    },
    {
      type: "truefalse",
      id: "catch-async",
      statement:
        "A `try/catch` around `setTimeout(callback)` catches errors thrown inside the callback.",
      answer: false,
      explanation:
        "The callback runs later, after the `try` block has finished. Handle errors inside the callback.",
    },
    {
      type: "blank",
      id: "rethrow",
      prompt:
        "In a catch block, use `___ error` to pass an error that you cannot handle to the caller.",
      answer: "throw",
      explanation: "Rethrowing keeps the problem visible instead of hiding it.",
    },
  ],
  assignment: {
    title: "Safe JSON loader",
    task: [
      "Write `loadSettings(text)` that returns the parsed object, or a default object when the text is not valid JSON.",
      "Write a `ValidationError` class, and make the function throw it when the parsed value is not an object.",
    ],
    checklist: [
      "Bad JSON returns the defaults",
      "A non-object throws ValidationError",
      "Other errors are not hidden",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "safe-parse",
      title: "Parse safely",
      task: [
        "Write `safeParse(text, fallback)` that returns the parsed JSON value, or `fallback` if the text is not valid JSON.",
      ],
      language: "javascript",
      starter: "function safeParse(text, fallback) {\n  // your code\n}",
      solution:
        "function safeParse(text, fallback) {\n  try {\n    return JSON.parse(text);\n  } catch {\n    return fallback;\n  }\n}",
      hints: [
        "`catch` can be written without a variable when you do not use the error.",
      ],
      checklist: [
        "Valid JSON is returned",
        "Invalid JSON returns the fallback",
        "null as valid JSON is returned as null",
      ],
      run: {
        entry: "safeParse",
        cases: [
          {
            name: "object",
            args: ['{"a":1}', null],
            expected: {
              a: 1,
            },
          },
          {
            name: "array",
            args: ["[1,2]", null],
            expected: [1, 2],
          },
          {
            name: "bad",
            args: ["{bad", "x"],
            expected: "x",
          },
          {
            name: "null",
            args: ["null", "x"],
            expected: null,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "`try` runs, `catch` handles, `finally` always runs",
    "Throw Error objects; extend Error for your own types",
    "Handle an error where a good fallback exists; rethrow the rest",
    "try/catch does not catch errors in later callbacks",
  ],
  resources: [
    {
      label: "MDN: Control flow and error handling",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling",
    },
    {
      label: "MDN: Error",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error",
    },
  ],
})
