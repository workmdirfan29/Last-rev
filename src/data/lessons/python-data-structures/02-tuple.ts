import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-data-structures", {
  slug: "tuple",
  title: "Tuples and unpacking",
  topic: "tuple",
  minutes: 30,
  overview:
    "Use tuples as fixed records: creation, the one-item comma, immutability and its limits, unpacking, and when a tuple can be a dictionary key.",
  objectives: [
    "Create tuples including the one-item form",
    "Explain what immutable means for a tuple that holds a list",
    "Unpack tuples and use starred unpacking and swaps",
    "Say when a tuple is hashable",
  ],
  prerequisites: ["lesson.python-data-structures.list"],
  sections: [
    {
      kind: "explain",
      heading: "A tuple is a fixed sequence",
      body: [
        "A `tuple` is an **ordered, immutable** sequence, written with commas and usually parentheses: `(1, 2, 3)`. Once created you cannot add, remove or replace items. It supports indexing, slicing, `len`, `in`, `count` and `index`.",
        "Use a tuple for a small group of related values that belong together, such as `(x, y)` coordinates or a `(name, age)` record. Use a list for a collection that grows or changes.",
        "Functions that 'return several values' return a tuple: `return 1, 2` builds `(1, 2)`.",
      ],
    },
    {
      kind: "code",
      heading: "Creating and unpacking",
      example: {
        title: "Commas make the tuple",
        language: "python",
        code: "t = (1, 2, 3)\nx, y, z = t\nprint(x, y, z)\nprint((1,), type((1)).__name__, type((1,)).__name__)\nprint(t[1:], t.count(2), t.index(3))\n\nfirst, *rest = [1, 2, 3, 4]\nprint(first, rest)\n\na, b = 1, 2\na, b = b, a\nprint(a, b)",
        walkthrough: [
          "**Unpacking** assigns the items to names in order: `x, y, z = t`. The number of names must match unless you use a starred name.",
          "A one-item tuple needs a trailing comma: `(1,)` is a tuple, while `(1)` is just the integer `1`. The comma, not the parentheses, creates the tuple.",
          "`first, *rest = [1, 2, 3, 4]` puts the first item in `first` and the remaining items in a **list** `rest`.",
          "`a, b = b, a` swaps two values without a temporary variable, because the right side is evaluated into a tuple first.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Immutable, but not deeply",
      example: {
        title: "A tuple that holds a list",
        language: "python",
        code: "t = (1, 2, 3)\ntry:\n    t[0] = 9\nexcept TypeError as e:\n    print(\"TypeError:\", e)\n\ntl = (1, [2])\ntl[1].append(3)\nprint(tl)\n\nprint(hash((1, 2)) == hash((1, 2)))\ntry:\n    hash((1, [2]))\nexcept TypeError as e:\n    print(\"TypeError:\", e)",
        walkthrough: [
          "Assigning to a position fails: `'tuple' object does not support item assignment`.",
          "A tuple is immutable in the sense that its **references** cannot change, but a mutable object inside it can still change. Appending to the inner list works, and the tuple now prints `(1, [2, 3])`.",
          "A tuple is **hashable** only if all its items are hashable. `(1, 2)` hashes consistently, so it can be a dictionary key or a set member. `(1, [2])` contains a list, so hashing fails with `TypeError: unhashable type: 'list'`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Tuple or list?",
      body: [
        "Choose a tuple when the number of items is fixed and each position has its own meaning, when you want to signal that the data should not change, or when you need a dictionary key made of several parts.",
        "Choose a list for a homogeneous collection of items that you add to, remove from or sort. For records with named fields, `collections.namedtuple` or a dataclass makes the code easier to read than positions.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing (5) and expecting a tuple.",
          fix: "Add the trailing comma: (5,).",
        },
        {
          mistake: "Assuming a tuple that holds a list can never change.",
          fix: "The tuple's references are fixed, but a mutable item inside can still be modified.",
        },
        {
          mistake: "Unpacking with the wrong number of names.",
          fix: "Match the count, or use a starred name to collect the extras.",
        },
        {
          mistake: "Using a tuple with a list inside as a dictionary key.",
          fix: "Convert the inner list to a tuple first so the key is hashable.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Returning two values",
      scenario:
        "A function must return both the minimum and the maximum of a list.",
      body: [
        "`return min(nums), max(nums)` returns a tuple. The caller unpacks it at once: `low, high = min_max(nums)`.",
        "Returning one tuple keeps related values together without needing a custom class for a small result.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "one-item",
      prompt: "Which expression creates a tuple with exactly one item?",
      options: ["(7,)", "(7)", "[7]"],
      answer: 0,
      explanation:
        "The trailing comma makes the tuple. (7) is just the number 7.",
    },
    {
      type: "output",
      id: "swap-output",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "a, b = 1, 2\na, b = b, a\nprint(a, b)",
      },
      options: ["2 1", "1 2", "2 2"],
      answer: 0,
      explanation:
        "The right side is evaluated first as the tuple (2, 1), then unpacked into a and b.",
    },
    {
      type: "output",
      id: "tuple-with-list",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "tl = (1, [2])\ntl[1].append(3)\nprint(tl)",
      },
      options: ["(1, [2, 3])", "A TypeError", "(1, [2])"],
      answer: 0,
      explanation:
        "The tuple cannot change its items, but the list inside it is mutable.",
    },
    {
      type: "truefalse",
      id: "tuple-key",
      statement: "A tuple of numbers can be used as a dictionary key.",
      answer: true,
      explanation:
        "A tuple is hashable when all its items are hashable.",
    },
  ],
  assignment: {
    title: "Tuple records",
    task: [
      "Write a function min_max_mean(nums) that returns a three-item tuple, and call it with unpacking.",
      "Build a dictionary whose keys are (row, column) tuples for a small grid and look up a few cells.",
    ],
    checklist: [
      "The function returns a tuple and the caller unpacks it",
      "A starred unpacking example is included",
      "The grid dictionary uses tuple keys",
      "A swap is done with tuple assignment",
    ],
    hints: ["A dict with tuple keys lets you write grid[(1, 2)] or grid[1, 2]."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "split-first-last",
      title: "First, middle, last",
      task: [
        "Write first_last(items) that returns a tuple (first, middle, last), where middle is a list of the items between them. first_last([1, 2, 3, 4]) is (1, [2, 3], 4). Assume at least two items.",
      ],
      language: "python",
      starter: "def first_last(items):\n    pass",
      solution:
        "def first_last(items):\n    first, *middle, last = items\n    return first, middle, last",
      hints: ["A starred name in the middle collects what is left."],
      checklist: [
        "first_last([1, 2, 3, 4]) is (1, [2, 3], 4)",
        "Two items give an empty middle list",
        "The result is a tuple",
      ],
    },
  ],
  revisionNotes: [
    "Ordered and immutable; the comma makes the tuple; (1,) for one item",
    "Unpacking, starred unpacking and swaps",
    "Immutable references, but a list inside can still change",
    "Hashable only if all items are hashable, so usable as a dict key",
  ],
  resources: [
    {
      label: "The Python Tutorial: Tuples and sequences",
      url: "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences",
    },
    {
      label: "Tuples",
      url: "https://docs.python.org/3/library/stdtypes.html#tuples",
    },
  ],
})
