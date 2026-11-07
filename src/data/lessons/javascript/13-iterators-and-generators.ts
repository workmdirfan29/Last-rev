import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "iterators-and-generators",
  title: "Iterators and generators",
  topic: "Iterators & generators",
  minutes: 45,
  overview:
    "Learn the iteration protocol that for...of uses, and write generators that produce values one at a time.",
  objectives: [
    "Explain the iterable and iterator protocols",
    "Write a generator function with yield",
    "Use generators for lazy and infinite sequences",
  ],
  prerequisites: ["lesson.javascript.es6-syntax-values"],
  sections: [
    {
      kind: "explain",
      heading: "The iteration protocol",
      body: [
        "An **iterable** is an object with a `[Symbol.iterator]()` method that returns an **iterator**. An iterator is an object with a `next()` method that returns `{ value, done }`. When `done` is `true`, the sequence has ended.",
        "`for...of`, spread `[...x]`, array destructuring, `Array.from`, `Map` and `Set` constructors all use this protocol. Arrays, strings, Maps and Sets are iterable. A plain object is **not** iterable, so `for (const x of {})` throws a `TypeError`.",
      ],
    },
    {
      kind: "code",
      heading: "A manual iterator",
      example: {
        title: "next() and done",
        language: "javascript",
        code: "const it = [10, 20][Symbol.iterator]();\nconsole.log(it.next());\nconsole.log(it.next());\nconsole.log(it.next());\n\nconst range = {\n  from: 1,\n  to: 3,\n  [Symbol.iterator]() {\n    let n = this.from;\n    const end = this.to;\n    return { next: () => (n <= end ? { value: n++, done: false } : { value: undefined, done: true }) };\n  },\n};\nconsole.log([...range]);",
        walkthrough: [
          "Each call to `next()` returns the next value, and finally `done: true`.",
          "The `range` object has a `[Symbol.iterator]` method, so it is iterable.",
          "The spread syntax calls `next()` until `done` is `true`, so it gives `[ 1, 2, 3 ]`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Generators",
      body: [
        "A **generator function** is written with `function*`. When you call it, nothing runs yet. It returns a generator object, which is an iterator. Each `next()` runs the code until the next `yield`, which hands out a value and **pauses** the function with all its variables.",
        "Generators make iterators much shorter than writing `next()` by hand. They are **lazy**: a value is calculated only when it is asked for, so a generator can describe an infinite sequence, and you take only what you need.",
        "`yield*` hands over to another iterable. A value passed into `next(value)` becomes the result of the `yield` expression, which allows two-way communication, but this is rarely needed.",
      ],
    },
    {
      kind: "code",
      heading: "A lazy sequence",
      example: {
        title: "function* and yield",
        language: "javascript",
        code: "function* count(start) {\n  let n = start;\n  while (true) {\n    yield n++;\n  }\n}\nfunction* take(iterable, limit) {\n  let i = 0;\n  for (const x of iterable) {\n    if (i++ >= limit) return;\n    yield x;\n  }\n}\nconsole.log([...take(count(5), 3)]);\nconst g = count(1);\nconsole.log(g.next().value, g.next().value);",
        walkthrough: [
          "`count` never ends, but it only calculates a number when asked.",
          "`take` stops after `limit` values, so the spread finishes and gives `[ 5, 6, 7 ]`.",
          "A generator keeps its place between calls, so the two `next()` calls give `1` and `2`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Spreading or looping over an infinite generator.",
          fix: "Limit it with a helper like `take`, or break out of the loop.",
        },
        {
          mistake:
            "Calling a generator function and expecting its code to run.",
          fix: "Calling it only creates the generator. Code runs when `next()` is called.",
        },
        {
          mistake: "Reusing a finished generator.",
          fix: "A generator that is done stays done. Call the function again for a new one.",
        },
        {
          mistake: "Looping over a plain object with `for...of`.",
          fix: "Use `Object.entries(obj)`, which returns an iterable array.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Paging through results",
      scenario:
        "An API returns data in pages of 20, and you want a simple loop over all the items.",
      body: [
        "An async generator can fetch a page, `yield` each item, and fetch the next page only when the loop needs it. The code that uses it is just a `for await...of` loop.",
        "The paging detail stays inside the generator.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "generator-next",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "function* g() {\n  yield 1;\n  yield 2;\n}\nconst it = g();\nconsole.log(it.next().value, it.next().value, it.next().done);",
      },
      options: ["1 2 true", "1 2 false", "1 1 true"],
      answer: 0,
      explanation: "The third `next()` finds the end, so `done` is `true`.",
    },
    {
      type: "output",
      id: "spread-generator",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "function* abc() {\n  yield 'a';\n  yield 'b';\n}\nconsole.log([...abc(), ...abc()].join(''));",
      },
      options: ["abab", "ab", "aabb"],
      answer: 0,
      explanation:
        "Each call to `abc()` makes a new generator, so the sequence is repeated.",
    },
    {
      type: "single",
      id: "iterable-object",
      prompt: "Is a plain object `{ a: 1 }` iterable?",
      options: [
        "No, it has no [Symbol.iterator]",
        "Yes, for...of works on all objects",
        "Only if it is frozen",
      ],
      answer: 0,
      explanation:
        "Plain objects are not iterable. Use `Object.entries(obj)` instead.",
    },
    {
      type: "truefalse",
      id: "generator-lazy",
      statement: "A generator function runs its body as soon as you call it.",
      answer: false,
      explanation:
        "Calling it creates a generator object. The body runs when `next()` is called.",
    },
  ],
  assignment: {
    title: "Build a small library of generators",
    task: [
      "Write generators `range(start, end)`, `fibonacci()` (infinite) and a `take(iterable, n)` helper.",
      "Use them to print the first ten Fibonacci numbers.",
    ],
    checklist: [
      "fibonacci does not run forever",
      "take stops early",
      "I can explain what yield does in one sentence",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "range-list",
      title: "A range as a list",
      task: [
        "Write `rangeList(start, end)` that uses a generator internally and returns an array with the numbers from `start` up to but not including `end`.",
      ],
      language: "javascript",
      starter: "function rangeList(start, end) {\n  // your code\n}",
      solution:
        "function rangeList(start, end) {\n  function* range() {\n    for (let n = start; n < end; n++) yield n;\n  }\n  return [...range()];\n}",
      hints: ["Use `function*` and `yield`, then spread the generator."],
      checklist: [
        "The end is not included",
        "An empty range gives an empty array",
        "I used a generator",
      ],
      run: {
        entry: "rangeList",
        cases: [
          {
            name: "simple",
            args: [1, 4],
            expected: [1, 2, 3],
          },
          {
            name: "empty",
            args: [3, 3],
            expected: [],
          },
          {
            name: "negative",
            args: [-2, 1],
            expected: [-2, -1, 0],
          },
          {
            name: "single",
            args: [5, 6],
            expected: [5],
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Iterable: has `[Symbol.iterator]`; iterator: `next()` returns `{ value, done }`",
    "`function*` + `yield` = a pausable, lazy iterator",
    "Plain objects are not iterable; use `Object.entries`",
    "A finished generator stays finished",
  ],
  resources: [
    {
      label: "MDN: Iteration protocols",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols",
    },
    {
      label: "MDN: Generator",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator",
    },
    {
      label: "MDN: Iterators and generators",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators",
    },
  ],
})
