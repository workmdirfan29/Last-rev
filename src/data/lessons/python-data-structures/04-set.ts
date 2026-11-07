import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-data-structures", {
  slug: "set",
  title: "Sets and set operations",
  topic: "set",
  minutes: 40,
  overview:
    "Use sets for uniqueness and fast membership tests: creation, the empty-set trap, union, intersection and difference, frozenset, and what a set cannot hold.",
  objectives: [
    "Create sets and remove duplicates",
    "Use union, intersection, difference and symmetric difference",
    "Know that {} is an empty dict and set() is an empty set",
    "Explain why set members must be hashable",
  ],
  prerequisites: ["lesson.python-data-structures.dict"],
  sections: [
    {
      kind: "explain",
      heading: "An unordered collection of unique items",
      body: [
        "A `set` holds **unique** items with **no defined order**. Duplicates disappear automatically: `{1, 2, 2, 3}` is `{1, 2, 3}`. You cannot index a set or rely on its order.",
        "Like dictionary keys, set members must be **hashable**. Numbers, strings and tuples of those are fine; lists, dicts and sets are not. The hash table is what makes `x in s` take constant time on average, where `x in some_list` has to scan.",
        "An empty set is written `set()`. The literal `{}` creates an empty **dict**.",
      ],
    },
    {
      kind: "code",
      heading: "Creating and combining",
      example: {
        title: "Set algebra",
        language: "python",
        code: "s = {1, 2, 2, 3}\nprint(s, type({}).__name__, type(set()).__name__)\nprint({1, 2} | {2, 3})\nprint({1, 2} & {2, 3})\nprint({1, 2} - {2, 3})\nprint({1, 2} ^ {2, 3})\nprint({1, 2} <= {1, 2, 3}, {1, 2}.isdisjoint({3}))\nprint(len(set(\"hello\")), list(dict.fromkeys([3, 1, 3, 2, 1])))",
        walkthrough: [
          "`{1, 2, 2, 3}` collapses to `{1, 2, 3}`. `{}` is a `dict` and `set()` is a `set`.",
          "Union `|` combines all items: `{1, 2, 3}`. Intersection `&` keeps items in both: `{2}`.",
          "Difference `-` keeps items only in the left set: `{1}`. Symmetric difference `^` keeps items in exactly one of the sets: `{1, 3}`.",
          "`<=` tests subset and `isdisjoint` tests that the sets share nothing. Both print `True`.",
          "`len(set(\"hello\"))` is `4` because the letter l repeats. To remove duplicates **and keep order**, use `list(dict.fromkeys(items))`, giving `[3, 1, 2]`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Modifying and what is not allowed",
      example: {
        title: "add, discard, remove and frozenset",
        language: "python",
        code: "s = {1, 2, 3}\ns.add(4)\ns.discard(99)\ns.remove(4)\nprint(s)\n\ntry:\n    s.remove(99)\nexcept KeyError as e:\n    print(\"KeyError:\", e)\n\ntry:\n    {[1]}\nexcept TypeError as e:\n    print(\"TypeError:\", e)\n\nfs = frozenset([1, 2])\nprint(fs, {fs: 1})",
        walkthrough: [
          "`add` inserts an item. `discard` removes it if present and does nothing otherwise. `remove` raises `KeyError` when the item is missing.",
          "A list cannot be a member: `TypeError: unhashable type: 'list'`.",
          "A `frozenset` is an immutable set. Because it is hashable, it can be a member of another set or a dictionary key.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Creating an empty set with {}.",
          fix: "Write set(); {} is a dict.",
        },
        {
          mistake: "Depending on the order of a set.",
          fix: "Sort it if you need an order: sorted(s).",
        },
        {
          mistake: "Putting a list into a set.",
          fix: "Convert it to a tuple first, or use a frozenset.",
        },
        {
          mistake: "Using remove when the item may be missing.",
          fix: "Use discard to avoid a KeyError.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Common followers",
      scenario:
        "Two lists hold the usernames that follow two accounts, and you want those who follow both.",
      body: [
        "`set(a) & set(b)` gives the common followers; `set(a) | set(b)` gives everyone; `set(a) - set(b)` gives those who follow only the first account.",
        "Turning the lists into sets also removes duplicates and makes the membership tests quick.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "empty-set",
      prompt: "How do you create an empty set?",
      options: ["set()", "{}", "[]"],
      answer: 0,
      explanation:
        "{} creates an empty dict. set() creates an empty set.",
    },
    {
      type: "output",
      id: "set-diff",
      prompt: "What does this print?",
      code: { language: "python", code: "print({1, 2} - {2, 3})" },
      options: ["{1}", "{3}", "{1, 3}"],
      answer: 0,
      explanation:
        "Difference keeps items that are in the left set but not in the right one.",
    },
    {
      type: "output",
      id: "sym-diff",
      prompt: "What does this print?",
      code: { language: "python", code: "print({1, 2} ^ {2, 3})" },
      options: ["{1, 3}", "{2}", "{1, 2, 3}"],
      answer: 0,
      explanation:
        "Symmetric difference keeps items that are in exactly one of the two sets.",
    },
    {
      type: "truefalse",
      id: "set-members",
      statement: "A set can contain a list as a member.",
      answer: false,
      explanation:
        "Set members must be hashable, and lists are not.",
    },
  ],
  assignment: {
    title: "Set operations on survey data",
    task: [
      "Given two lists of students who chose course A and course B, print the students in both, in either, only in A and in exactly one course.",
      "Then remove duplicates from a list of words while keeping the first occurrence order, and explain why a set alone would lose the order.",
    ],
    checklist: [
      "All four set operations are used",
      "The result is shown sorted for readability",
      "Duplicates are removed while keeping order",
      "I can explain why {} is not an empty set",
    ],
    hints: ["Use sorted() when printing sets."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "common-items",
      title: "Common items",
      task: [
        "Write common(a, b) that returns a sorted list of the items that appear in both lists, without duplicates. common([3, 1, 2, 2], [2, 3, 5]) is [2, 3].",
      ],
      language: "python",
      starter: "def common(a, b):\n    pass",
      solution:
        "def common(a, b):\n    return sorted(set(a) & set(b))",
      hints: ["Intersect two sets, then sort."],
      checklist: [
        "common([3, 1, 2, 2], [2, 3, 5]) is [2, 3]",
        "No duplicates in the result",
        "An empty overlap returns an empty list",
      ],
    },
  ],
  revisionNotes: [
    "Unique, unordered, hashable members; set() is empty, {} is a dict",
    "| union, & intersection, - difference, ^ symmetric difference",
    "add, discard (safe), remove (KeyError); frozenset is immutable and hashable",
    "Membership tests are constant time on average",
  ],
  resources: [
    {
      label: "The Python Tutorial: Sets",
      url: "https://docs.python.org/3/tutorial/datastructures.html#sets",
    },
    {
      label: "Set types: set, frozenset",
      url: "https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset",
    },
  ],
})
