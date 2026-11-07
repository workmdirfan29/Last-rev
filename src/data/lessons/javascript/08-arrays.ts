import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "arrays",
  title: "Arrays and the array methods",
  topic: "Arrays",
  minutes: 50,
  overview:
    "Work with arrays using map, filter, reduce, find, sort and the other everyday methods, and know which ones change the array.",
  objectives: [
    "Transform data with map, filter and reduce",
    "Search with find, some, every and includes",
    "Know which methods change the original array and which return a new one",
  ],
  prerequisites: ["lesson.javascript.functions"],
  sections: [
    {
      kind: "explain",
      heading: "Arrays and loops",
      body: [
        "An **array** is an ordered list. Indexes start at `0`, `length` is the number of elements, and an index that does not exist gives `undefined`. You can loop with `for...of`, which gives the values, or use the array methods that take a callback.",
        "`map(fn)` returns a new array with `fn` applied to each element. `filter(fn)` returns a new array with the elements for which `fn` returns a truthy value. `reduce(fn, start)` combines all the elements into one value. These three do **not** change the original array.",
        "`find(fn)` returns the first matching element, or `undefined`. `some(fn)` and `every(fn)` return a boolean. `includes(value)` checks whether a value is in the array, using strict equality.",
      ],
    },
    {
      kind: "code",
      heading: "map, filter and reduce",
      example: {
        title: "A small pipeline",
        language: "javascript",
        code: "const orders = [\n  { id: 1, total: 40, paid: true },\n  { id: 2, total: 25, paid: false },\n  { id: 3, total: 60, paid: true },\n];\nconst paidTotals = orders.filter((o) => o.paid).map((o) => o.total);\nconst sum = paidTotals.reduce((acc, n) => acc + n, 0);\nconsole.log(paidTotals, sum);\nconsole.log(orders.find((o) => o.total > 50).id);\nconsole.log(orders.some((o) => !o.paid), orders.every((o) => o.total > 30));",
        walkthrough: [
          "`filter` keeps the two paid orders, and `map` extracts their totals, giving `[ 40, 60 ]`.",
          "`reduce` adds them starting from `0`, so the sum is `100`.",
          "`find` returns the first order with a total over 50, which is order `3`.",
          "`some` is `true` because one order is unpaid, and `every` is `false` because order 2 is not above 30.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Methods that change the array",
      body: [
        "Some methods change the array they are called on: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse` and `fill`. This is called **mutation**, and it can cause surprises when the array is shared.",
        "Newer versions of JavaScript also have copying versions: `toSorted`, `toReversed` and `toSpliced` return a new array. You can always copy first with `[...array]` or `array.slice()`. `slice(start, end)` returns a part without changing the array, and the end index is not included.",
        "`sort()` without an argument sorts the elements as **strings**, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. For numbers, give a compare function: `sort((a, b) => a - b)`.",
      ],
    },
    {
      kind: "code",
      heading: "Sorting and copying",
      example: {
        title: "Compare functions",
        language: "javascript",
        code: "const nums = [10, 9, 1];\nconsole.log([...nums].sort());\nconsole.log([...nums].sort((a, b) => a - b));\nconsole.log(nums);\nconst words = ['pear', 'fig', 'apple'];\nconsole.log(words.slice(0, 2), words.length);\nconsole.log(words.flatMap((w) => [w, w.length]));",
        walkthrough: [
          "Without a compare function the numbers are sorted as text, so `10` comes before `9`.",
          "`a - b` sorts numbers from small to large.",
          "Copying first with the spread syntax leaves `nums` unchanged.",
          "`slice(0, 2)` returns the first two words, and `flatMap` maps and flattens one level.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `sort()` on numbers without a compare function.",
          fix: "Use `sort((a, b) => a - b)`.",
        },
        {
          mistake: "Using `map` only for its side effects.",
          fix: "Use `forEach` or `for...of` when you do not need the new array.",
        },
        {
          mistake: "Forgetting the start value in `reduce`.",
          fix: "Give a start value. Without it, an empty array throws an error.",
        },
        {
          mistake: "Changing an array that other code also uses.",
          fix: "Copy it first, or use `toSorted` and the other copying methods.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A product list",
      scenario:
        "A shop page shows only products in stock, sorted by price, with the names in upper case.",
      body: [
        "Chain the methods: `products.filter(inStock).toSorted(byPrice).map(toLabel)`. Each step returns an array that the next step uses, and the original list stays unchanged.",
        "Keeping each step small and named makes the chain easy to read and to test.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "sort-default",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log([10, 9, 1].sort());",
      },
      options: ["[ 1, 10, 9 ]", "[ 1, 9, 10 ]", "[ 10, 9, 1 ]"],
      answer: 0,
      explanation:
        "The default sort compares strings, and `'10'` comes before `'9'`.",
    },
    {
      type: "output",
      id: "map-filter",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const r = [1, 2, 3, 4].filter((n) => n % 2 === 0).map((n) => n * 10);\nconsole.log(r);",
      },
      options: ["[ 20, 40 ]", "[ 10, 30 ]", "[ 2, 4 ]"],
      answer: 0,
      explanation:
        "`filter` keeps `2` and `4`, and `map` multiplies them by 10.",
    },
    {
      type: "single",
      id: "mutating",
      prompt: "Which method changes the original array?",
      options: ["splice", "slice", "map"],
      answer: 0,
      explanation:
        "`splice` removes or inserts elements in place. `slice` and `map` return new arrays.",
    },
    {
      type: "truefalse",
      id: "reduce-start",
      statement:
        "`reduce` on an empty array with no start value throws an error.",
      answer: true,
      explanation:
        "With nothing to start from and nothing to combine, `reduce` throws a `TypeError`. Give a start value.",
    },
  ],
  assignment: {
    title: "Report from data",
    task: [
      "Make an array of at least six objects, for example students with a name, a class and a mark.",
      "Use array methods only, with no `for` loops, to find the average mark, the best student, and a list of names that passed.",
    ],
    checklist: [
      "No for loops are used",
      "The average is correct for an empty list too",
      "The original array is not changed",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "average-of",
      title: "Average of the passing marks",
      task: [
        "Write `averagePass(marks, pass)` that returns the average of the marks that are at least `pass`, rounded to one decimal place, or `0` if no mark passes.",
      ],
      language: "javascript",
      starter: "function averagePass(marks, pass) {\n  // your code\n}",
      solution:
        "function averagePass(marks, pass) {\n  const passed = marks.filter((m) => m >= pass);\n  if (passed.length === 0) return 0;\n  const sum = passed.reduce((a, b) => a + b, 0);\n  return Math.round((sum / passed.length) * 10) / 10;\n}",
      hints: ["Filter first, then check for an empty result before dividing."],
      checklist: [
        "No passing mark gives 0",
        "The result has at most one decimal place",
        "The input array is unchanged",
      ],
      run: {
        entry: "averagePass",
        cases: [
          {
            name: "mixed",
            args: [[40, 80, 90, 20], 50],
            expected: 85,
          },
          {
            name: "none",
            args: [[10, 20], 50],
            expected: 0,
          },
          {
            name: "rounding",
            args: [[51, 52, 54], 50],
            expected: 52.3,
          },
          {
            name: "all",
            args: [[60, 70], 0],
            expected: 65,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "map/filter/reduce return new values; find, some, every, includes answer questions",
    "Mutating: push, pop, shift, unshift, splice, sort, reverse",
    "Default `sort()` compares strings",
    "Copy with spread or `slice` before changing",
  ],
  resources: [
    {
      label: "MDN: Array",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    },
    {
      label: "MDN: Indexed collections",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections",
    },
  ],
})
