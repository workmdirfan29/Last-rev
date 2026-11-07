import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "es6-syntax-operators",
  title: "ES6 syntax: operators, symbols and newer features",
  topic: "ES6 syntax",
  minutes: 50,
  overview:
    "Use optional chaining, nullish coalescing, logical assignment, symbols, and the newer array, string and object helpers.",
  objectives: [
    "Read nested data safely with ?. and ??",
    "Use logical assignment and numeric separators",
    "Use the newer helpers such as at, flat, Object.fromEntries and structuredClone",
  ],
  prerequisites: ["lesson.javascript.es6-syntax-values"],
  sections: [
    {
      kind: "explain",
      heading: "Optional chaining and nullish coalescing",
      body: [
        "`a?.b` reads `b` only if `a` is not `null` or `undefined`, and otherwise gives `undefined` without an error. It also works for calls, `a.method?.()`, and for indexes, `a?.[0]`.",
        "`a ?? b` gives `b` only when `a` is `null` or `undefined`. It differs from `a || b`, which also replaces `0`, `''` and `false`. Together they are the standard way to read optional data with a default: `user?.settings?.theme ?? 'light'`.",
        "**Logical assignment** operators combine a test and an assignment: `a ||= b` assigns when `a` is falsy, `a &&= b` when it is truthy, and `a ??= b` when it is `null` or `undefined`.",
      ],
    },
    {
      kind: "code",
      heading: "Safe reading",
      example: {
        title: "?. and ??",
        language: "javascript",
        code: "const config = { retries: 0, nested: { depth: null } };\nconsole.log(config.retries || 3);\nconsole.log(config.retries ?? 3);\nconsole.log(config.missing?.value);\nconsole.log(config.nested?.depth ?? 'none');\nconst list = [];\nconsole.log(list[0]?.name);\nlet cache;\ncache ??= 'created';\nconsole.log(cache);",
        walkthrough: [
          "`||` replaces the valid `0` with `3`, and `??` keeps it.",
          "`config.missing` is `undefined`, so `?.value` stops there and gives `undefined`.",
          "`nested.depth` is `null`, so `??` gives `'none'`.",
          "`??=` assigns only when the variable is `null` or `undefined`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Symbols, numeric separators and small helpers",
      body: [
        "A `Symbol()` is a unique value that is often used as a hidden property key, so that it never clashes with other keys. `Symbol.iterator` is a well-known symbol that makes an object iterable.",
        "**Numeric separators** make big numbers readable: `1_000_000`. `array.at(-1)` reads the last element. `array.flat()` removes one level of nesting, and `Object.fromEntries(pairs)` builds an object from key and value pairs, the opposite of `Object.entries`.",
        "`structuredClone(value)` makes a deep copy of most data, including nested objects, arrays, maps, sets and dates. It cannot copy functions. `string.replaceAll` replaces every match, and `string.padStart` and `padEnd` pad to a length.",
      ],
    },
    {
      kind: "code",
      heading: "Small helpers",
      example: {
        title: "at, flat, fromEntries, structuredClone",
        language: "javascript",
        code: "const nums = [1, 2, 3];\nconsole.log(nums.at(-1), [[1, 2], [3]].flat());\nconst obj = Object.fromEntries([['a', 1], ['b', 2]]);\nconsole.log(obj);\nconst original = { list: [1, 2] };\nconst copy = structuredClone(original);\ncopy.list.push(3);\nconsole.log(original.list.length, 1_000_000);\nconsole.log('a-b-c'.replaceAll('-', '+'), '7'.padStart(3, '0'));",
        walkthrough: [
          "`at(-1)` counts from the end, and `flat()` removes one level of nesting.",
          "`Object.fromEntries` turns pairs into an object.",
          "`structuredClone` made a deep copy, so changing `copy.list` leaves the original at length `2`.",
          "`replaceAll` replaces every dash, and `padStart` adds zeros to the left.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Using `||` for a default when `0`, `''` or `false` are valid.",
          fix: "Use `??`.",
        },
        {
          mistake: "Chaining `?.` everywhere and hiding real bugs.",
          fix: "Use it for data that may truly be missing, and let required data fail loudly.",
        },
        {
          mistake: "Mixing `??` with `||` or `&&` without parentheses.",
          fix: "That is a syntax error. Add parentheses.",
        },
        {
          mistake: "Trying to `structuredClone` an object with functions.",
          fix: "It throws. Copy the data and keep the functions separate.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A settings screen",
      scenario:
        "The settings come from a server and any part can be missing: the whole object, a section or a single value.",
      body: [
        "Read each value with `?.` and give a default with `??`, such as `settings?.display?.fontSize ?? 16`. A saved font size of `0` is kept, and a missing one gets `16`.",
        "Use `structuredClone` to make an editable copy for the form, so that cancelling leaves the saved settings unchanged.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "nullish-vs-or",
      prompt: "What are the first two values printed?",
      code: {
        language: "javascript",
        code: "console.log(0 || 'x', 0 ?? 'x', '' ?? 'x');",
      },
      options: ["x 0", "x x", "0 0"],
      answer: 0,
      explanation:
        "`||` replaces `0` with `x`, and `??` keeps `0`. The third value, the empty string, is kept by `??`, so it prints as an empty space.",
    },
    {
      type: "output",
      id: "flat-at",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log([[1], [2, [3]]].flat().length, 'abc'.at(-1));",
      },
      options: ["3 c", "2 b", "3 a"],
      answer: 0,
      explanation:
        "`flat()` removes one level, leaving `[1, 2, [3]]`, which has 3 items. `at(-1)` is the last letter.",
    },
    {
      type: "single",
      id: "optional-call",
      prompt: "What does `obj.method?.()` do when `method` does not exist?",
      options: [
        "Gives undefined without an error",
        "Throws a TypeError",
        "Creates the method",
      ],
      answer: 0,
      explanation:
        "Optional chaining also works for calls, and stops with `undefined`.",
    },
    {
      type: "truefalse",
      id: "clone-functions",
      statement:
        "`structuredClone` can copy an object that contains functions.",
      answer: false,
      explanation:
        "Functions cannot be cloned, and `structuredClone` throws an error for them.",
    },
  ],
  assignment: {
    title: "Safe settings reader",
    task: [
      "Write `readSetting(settings, path, fallback)` for paths like `'display.fontSize'` that returns the value, or the fallback when any step is missing.",
      "Make sure that values such as `0` and `false` are returned, not replaced.",
    ],
    checklist: [
      "A missing section returns the fallback",
      "0 and false are kept",
      "I used ?. and ?? and not ||",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "get-or",
      title: "Read a nested value",
      task: [
        "Write `getOr(obj, key1, key2, fallback)` that returns `obj[key1][key2]` when both exist and are not null or undefined, and `fallback` otherwise. A value of `0` or `false` must be returned.",
      ],
      language: "javascript",
      starter: "function getOr(obj, key1, key2, fallback) {\n  // your code\n}",
      solution:
        "function getOr(obj, key1, key2, fallback) {\n  return obj?.[key1]?.[key2] ?? fallback;\n}",
      hints: ["Use `?.[key]` for dynamic keys and `??` for the fallback."],
      checklist: [
        "A missing first key gives the fallback",
        "0 is returned",
        "null gives the fallback",
      ],
      run: {
        entry: "getOr",
        cases: [
          {
            name: "present",
            args: [
              {
                a: {
                  b: 5,
                },
              },
              "a",
              "b",
              9,
            ],
            expected: 5,
          },
          {
            name: "zero",
            args: [
              {
                a: {
                  b: 0,
                },
              },
              "a",
              "b",
              9,
            ],
            expected: 0,
          },
          {
            name: "missing",
            args: [{}, "a", "b", 9],
            expected: 9,
          },
          {
            name: "null",
            args: [
              {
                a: {
                  b: null,
                },
              },
              "a",
              "b",
              9,
            ],
            expected: 9,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "`?.` stops at null/undefined; `??` defaults only for null/undefined",
    "`||=`, `&&=`, `??=` assign conditionally",
    "`at(-1)`, `flat()`, `Object.fromEntries`, `structuredClone`, `replaceAll`",
    "Numeric separators: 1_000_000",
  ],
  resources: [
    {
      label: "MDN: Optional chaining",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
    },
    {
      label: "MDN: Nullish coalescing",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing",
    },
    {
      label: "MDN: structuredClone",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone",
    },
  ],
})
