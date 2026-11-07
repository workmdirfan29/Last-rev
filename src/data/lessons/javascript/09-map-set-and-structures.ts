import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "map-set-and-structures",
  title: "Map, Set, WeakMap and typed collections",
  topic: "Data structures",
  minutes: 60,
  overview:
    "Choose between objects, Map and Set, and use them for lookups, unique values and counting.",
  objectives: [
    "Use Map for key/value data with any key type",
    "Use Set to remove duplicates and test membership",
    "Know when WeakMap and WeakSet are appropriate",
  ],
  prerequisites: ["lesson.javascript.arrays"],
  sections: [
    {
      kind: "explain",
      heading: "Map",
      body: [
        "A `Map` stores key and value pairs. Unlike an object, a Map can use **any value as a key**, including objects and numbers, it remembers the **insertion order**, and it has a `size` property. The methods are `set(key, value)`, `get(key)`, `has(key)`, `delete(key)` and `clear()`.",
        "You can loop over a Map with `for (const [key, value] of map)`. `map.keys()`, `map.values()` and `map.entries()` give iterators. A Map is a good choice when keys are added and removed often, or are not strings.",
        "A plain object is fine for fixed records with known string keys, such as `{ name, age }`.",
      ],
    },
    {
      kind: "code",
      heading: "Counting with a Map",
      example: {
        title: "Word counter",
        language: "javascript",
        code: "const counts = new Map();\nfor (const word of ['a', 'b', 'a', 'c', 'a']) {\n  counts.set(word, (counts.get(word) ?? 0) + 1);\n}\nconsole.log(counts.get('a'), counts.size);\nconsole.log([...counts.entries()]);\nconsole.log(counts.has('z'));",
        walkthrough: [
          "`counts.get(word) ?? 0` gives `0` for a word that has not been seen yet.",
          "`a` appears three times, and there are three different words.",
          "`entries()` gives pairs in insertion order, and `has` tests whether a key exists.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Set",
      body: [
        "A `Set` stores **unique values**. Adding a value that is already in the set does nothing. The methods are `add`, `has`, `delete`, `clear` and the `size` property, and a Set keeps insertion order.",
        "Removing duplicates from an array is a common use: `[...new Set(array)]`. Testing membership with `set.has(x)` is fast, and is much quicker than `array.includes(x)` for large collections.",
        "Values are compared with the same-value-zero rule, which treats `NaN` as equal to itself and two different objects as different.",
      ],
    },
    {
      kind: "code",
      heading: "Unique values and set operations",
      example: {
        title: "Set in practice",
        language: "javascript",
        code: "const tags = ['js', 'css', 'js', 'html', 'css'];\nconst unique = [...new Set(tags)];\nconsole.log(unique);\nconst a = new Set([1, 2, 3]);\nconst b = new Set([2, 3, 4]);\nconst both = [...a].filter((x) => b.has(x));\nconsole.log(both);\nconsole.log(new Set([NaN, NaN]).size);",
        walkthrough: [
          "The spread of a Set turns it back into an array without duplicates.",
          "An intersection is the elements of `a` that `b` also has.",
          "`NaN` counts as one value in a Set, so the size is `1`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "WeakMap and WeakSet",
      body: [
        "A `WeakMap` holds its **keys weakly**, and the keys must be objects. If nothing else refers to a key object, the garbage collector can remove it, and its entry disappears. A `WeakSet` works in the same way for objects.",
        "They cannot be looped over and have no `size`, because their contents can change at any time. Use them to attach extra data to objects that you do not own, such as caching a result for a DOM element, without keeping the element in memory.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using an object as a map with keys that come from users.",
          fix: "Keys such as `__proto__` can cause trouble. Use a `Map`.",
        },
        {
          mistake: "Using `array.includes` in a loop over a big list.",
          fix: "Put the values in a `Set` first, and use `has`.",
        },
        {
          mistake: "Reading `map.size` as `map.length`.",
          fix: "A Map and a Set have `size`, and arrays have `length`.",
        },
        {
          mistake:
            "Using objects as Set members and expecting equal-looking objects to match.",
          fix: "Two different objects are different values. Compare by an id instead.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Counting visitors",
      scenario:
        "A page tracks which user ids visited today and how many times each visited.",
      body: [
        "A `Set` of ids answers 'how many different visitors?' with `size`. A `Map` from id to a count answers 'how many times did each visit?'.",
        "Choosing the structure that matches the question keeps the code short and fast.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "set-dups",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log(new Set([1, 1, 2, '1']).size);",
      },
      options: ["3", "2", "4"],
      answer: 0,
      explanation:
        "The number `1` and the string `'1'` are different values, so the set has `1`, `2` and `'1'`.",
    },
    {
      type: "output",
      id: "map-order",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const m = new Map([['b', 1], ['a', 2]]);\nm.set('c', 3);\nconsole.log([...m.keys()].join(''));",
      },
      options: ["bac", "abc", "cba"],
      answer: 0,
      explanation:
        "A Map keeps insertion order, so the keys come out as `b`, `a`, `c`.",
    },
    {
      type: "single",
      id: "map-key-types",
      prompt: "What can a Map use as a key?",
      options: [
        "Any value, including objects",
        "Only strings",
        "Only strings and numbers",
      ],
      answer: 0,
      explanation: "Unlike a plain object, a Map accepts any value as a key.",
    },
    {
      type: "truefalse",
      id: "weakmap-loop",
      statement: "You can loop over the entries of a WeakMap.",
      answer: false,
      explanation:
        "A WeakMap has no iteration methods and no size, because its entries can be collected at any time.",
    },
  ],
  assignment: {
    title: "Pick the right structure",
    task: [
      "Write a function that counts how often each letter appears in a sentence, using a `Map`.",
      "Write a second function that returns the words that appear in two given sentences, using `Set`.",
    ],
    checklist: [
      "The counts ignore case",
      "The common words contain no duplicates",
      "I can explain why I chose Map and Set",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "first-duplicate",
      title: "Find the first duplicate",
      task: [
        "Write `firstDuplicate(values)` that returns the first value that appears a second time while reading from left to right, or `null` if there is no duplicate.",
      ],
      language: "javascript",
      starter: "function firstDuplicate(values) {\n  // your code\n}",
      solution:
        "function firstDuplicate(values) {\n  const seen = new Set();\n  for (const v of values) {\n    if (seen.has(v)) return v;\n    seen.add(v);\n  }\n  return null;\n}",
      hints: ["Keep the values you have already seen in a Set."],
      checklist: [
        "No duplicate gives null",
        "The first repeated value is returned",
        "It runs in one pass",
      ],
      run: {
        entry: "firstDuplicate",
        cases: [
          {
            name: "none",
            args: [[1, 2, 3]],
            expected: null,
          },
          {
            name: "simple",
            args: [[1, 2, 1, 2]],
            expected: 1,
          },
          {
            name: "later",
            args: [["a", "b", "b", "a"]],
            expected: "b",
          },
          {
            name: "empty",
            args: [[]],
            expected: null,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Map: any key type, insertion order, `size`",
    "Set: unique values, fast `has`, `[...new Set(array)]` removes duplicates",
    "WeakMap/WeakSet: object keys held weakly, not iterable",
    "Use the structure that matches the question",
  ],
  resources: [
    {
      label: "MDN: Keyed collections",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections",
    },
    {
      label: "MDN: Map",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
    },
    {
      label: "MDN: Set",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",
    },
  ],
})
