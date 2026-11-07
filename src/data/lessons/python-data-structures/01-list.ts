import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-data-structures", {
  slug: "list",
  title: "Lists: methods, slicing and cost",
  topic: "list",
  minutes: 50,
  overview:
    "Use Python's ordered, mutable list: indexing and slicing, the main methods, sorting, shallow versus deep copies, and which operations are cheap or expensive.",
  objectives: [
    "Create, index, slice and modify lists",
    "Choose between append, extend, insert, pop and remove",
    "Explain sort() versus sorted() and why sort() returns None",
    "Avoid the shared-row trap and understand shallow copies",
    "State the cost of common list operations",
  ],
  prerequisites: ["python-fundamentals"],
  sections: [
    {
      kind: "explain",
      heading: "What a list is",
      body: [
        "A `list` is an **ordered, mutable** sequence that can hold items of different types. It is written with square brackets: `[3, 1, 2]`. Positions start at 0, and negative indexes count from the end, so `a[-1]` is the last item.",
        "Internally a list stores references to objects in a contiguous array. That makes indexing by position fast, and adding to or removing from the end cheap. Changes near the front or middle are costlier because other items must shift.",
      ],
    },
    {
      kind: "code",
      heading: "Modifying a list",
      example: {
        title: "The everyday methods",
        language: "python",
        code: "l = [1, 2, 3]\nl.extend([4, 5])\nl.append([6])\nprint(l)\n\nm = [1, 2, 3, 4]\nlast = m.pop()\nfirst = m.pop(0)\nprint(last, first, m)\nm.insert(1, \"x\")\nprint(m)\nm.remove(\"x\")\nprint(m)\ndel m[0]\nprint(m)",
        walkthrough: [
          "`append(x)` adds **one** item, even if it is a list. `extend(iterable)` adds each item of the iterable. So `l` ends as `[1, 2, 3, 4, 5, [6]]`.",
          "`pop()` removes and returns the last item (`4`); `pop(0)` removes the first (`1`), leaving `[2, 3]`.",
          "`insert(i, x)` puts `x` before position `i`; `remove(x)` deletes the first item equal to `x`; `del m[0]` deletes by position.",
          "`remove` raises `ValueError` if the item is missing, and `pop` raises `IndexError` on an empty list.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Slicing and sorting",
      example: {
        title: "Slices copy; sort() returns None",
        language: "python",
        code: "a = [1, 2, 3, 4, 5]\nprint(a[1:4], a[::2], a[::-1], a[-2:], a[10:])\nb = a[:]\nb[0] = 99\nprint(a[0])\n\nl = [3, 1, 2]\nresult = l.sort()\nprint(result, l)\nprint(sorted([3, 1, 2], reverse=True))\nprint(sorted([\"bb\", \"a\", \"ccc\"], key=len))",
        walkthrough: [
          "A slice `a[start:stop:step]` makes a **new** list. `a[1:4]` is `[2, 3, 4]`, `a[::2]` is `[1, 3, 5]`, `a[::-1]` is reversed, and a slice past the end is just empty: `[]`.",
          "`b = a[:]` is a shallow copy, so changing `b[0]` leaves `a[0]` as `1`.",
          "`l.sort()` sorts **in place** and returns `None`, which is why `result` prints `None`. `sorted(x)` returns a **new** sorted list and leaves the original alone.",
          "Both accept `reverse=True` and a `key=` function. Sorting is stable: items with equal keys keep their original order.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Nested lists and copies",
      example: {
        title: "The shared-row trap",
        language: "python",
        code: "import copy\n\nm = [[0] * 2] * 2\nm[0][0] = 1\nprint(m)\n\nm = [[0] * 2 for _ in range(2)]\nm[0][0] = 1\nprint(m)\n\nn = [[1], [2]]\nshallow = n.copy()\nshallow[0].append(9)\nprint(n)\ndeep = copy.deepcopy(n)\ndeep[0].append(7)\nprint(n, deep)",
        walkthrough: [
          "`[[0] * 2] * 2` repeats the **same inner list** twice, so changing one row changes both: `[[1, 0], [1, 0]]`.",
          "A comprehension builds a separate inner list for each row, so only the first row changes: `[[1, 0], [0, 0]]`.",
          "`n.copy()` is shallow: the outer list is new but the inner lists are shared, so appending through `shallow[0]` also changes `n`.",
          "`copy.deepcopy` copies the nested objects as well, so changing `deep` leaves `n` alone.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Cost of common operations",
      diagram: {
        kind: "table",
        title: "What to expect",
        headers: ["Operation", "Cost", "Why"],
        rows: [
          ["a[i], a[i] = x, len(a)", "Constant time", "Direct position in an array"],
          ["append(x), pop()", "Constant time on average", "Work happens at the end"],
          ["insert(0, x), pop(0)", "Linear time", "Every other item shifts one place"],
          ["x in a, a.index(x), a.remove(x)", "Linear time", "May scan the whole list"],
          ["sort()", "n log n", "Comparison sort"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing l = l.sort() and ending up with None.",
          fix: "Call l.sort() on its own line, or use l = sorted(l).",
        },
        {
          mistake: "Using append when you meant extend.",
          fix: "append adds one item; extend adds each item of an iterable.",
        },
        {
          mistake: "Removing items from a list while looping over it.",
          fix: "Build a new list with a comprehension, or loop over a copy.",
        },
        {
          mistake: "Using a list as a queue with pop(0).",
          fix: "Use collections.deque, which removes from the left in constant time.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Top three scores",
      scenario:
        "You have a list of scores and want the three highest without changing the original list.",
      body: [
        "`sorted(scores, reverse=True)[:3]` returns a new list with the three largest values and leaves `scores` unchanged. For a very large list `heapq.nlargest(3, scores)` avoids sorting everything.",
        "To remove duplicates first while keeping order, `list(dict.fromkeys(scores))` works because dicts keep insertion order.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "sort-none",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "l = [3, 1, 2]\nresult = l.sort()\nprint(result)",
      },
      options: ["None", "[1, 2, 3]", "[3, 1, 2]"],
      answer: 0,
      explanation:
        "list.sort() sorts in place and returns None.",
    },
    {
      type: "output",
      id: "shared-rows",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "m = [[0] * 2] * 2\nm[0][0] = 1\nprint(m)",
      },
      options: ["[[1, 0], [1, 0]]", "[[1, 0], [0, 0]]", "[[0, 0], [0, 0]]"],
      answer: 0,
      explanation:
        "Both rows are the same list object, so a change in one shows in the other.",
    },
    {
      type: "single",
      id: "append-extend",
      prompt: "What is the result of l = [1, 2]; l.append([3, 4])?",
      options: ["[1, 2, [3, 4]]", "[1, 2, 3, 4]", "[[1, 2], [3, 4]]"],
      answer: 0,
      explanation:
        "append adds its argument as one item, so the list is nested inside.",
    },
    {
      type: "truefalse",
      id: "pop-front-cost",
      statement: "pop(0) on a list is slow for long lists because every other item must shift.",
      answer: true,
      explanation:
        "Removing from the front is linear time. A deque removes from either end quickly.",
    },
  ],
  assignment: {
    title: "List workout",
    task: [
      "Write a script that starts with a list of ten numbers and, without changing the original, prints: the sorted list, the three largest, every second item, the list reversed, and the list with duplicates removed (keep the first occurrence).",
      "Then show the shared-row trap and its fix, and a shallow versus deep copy of a nested list.",
    ],
    checklist: [
      "The original list is unchanged after all operations",
      "The duplicate removal keeps the first occurrence order",
      "The shared-row trap and its fix are both shown",
      "A deep copy is used where nested data must be independent",
    ],
    hints: ["`list(dict.fromkeys(items))` removes duplicates and keeps order."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "rotate-left",
      title: "Rotate a list",
      task: [
        "Write rotate_left(items, k) that returns a new list with the first k items moved to the end. rotate_left([1, 2, 3, 4], 1) is [2, 3, 4, 1]. Do not change the input; handle k larger than the length.",
      ],
      language: "python",
      starter: "def rotate_left(items, k):\n    pass",
      solution:
        "def rotate_left(items, k):\n    if not items:\n        return []\n    k = k % len(items)\n    return items[k:] + items[:k]",
      hints: ["Use slicing and the remainder operator for k."],
      checklist: [
        "rotate_left([1, 2, 3, 4], 1) is [2, 3, 4, 1]",
        "k larger than the length wraps around",
        "An empty list returns an empty list",
        "The input list is not modified",
      ],
    },
  ],
  revisionNotes: [
    "Ordered, mutable; append one, extend many; insert, pop, remove, del",
    "Slicing returns a new list; sort() is in place and returns None; sorted() is new",
    "[[0]*2]*2 shares rows; copy() is shallow; deepcopy copies nested objects",
    "Index and append are cheap; insert at front, x in a, remove are linear",
  ],
  resources: [
    {
      label: "The Python Tutorial: More on lists",
      url: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists",
    },
    {
      label: "Sequence types: list, tuple, range",
      url: "https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range",
    },
    {
      label: "Sorting techniques",
      url: "https://docs.python.org/3/howto/sorting.html",
    },
  ],
})
