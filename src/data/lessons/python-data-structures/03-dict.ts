import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-data-structures", {
  slug: "dict",
  title: "Dictionaries: lookup, order and hashing",
  topic: "dict",
  minutes: 60,
  overview:
    "Use dictionaries to map keys to values: safe lookup, updating and merging, iteration, insertion order, why keys must be hashable, and why lookup is fast.",
  objectives: [
    "Create, read, update and delete dictionary entries",
    "Use get, setdefault, items and update",
    "Merge dictionaries and build them with comprehensions",
    "Explain hashability and the average cost of lookup",
  ],
  prerequisites: ["lesson.python-data-structures.tuple"],
  sections: [
    {
      kind: "explain",
      heading: "Key-value mapping",
      body: [
        "A `dict` maps **keys** to **values**: `{\"a\": 1, \"b\": 2}`. You read a value with `d[key]`, which raises `KeyError` if the key is missing, or with `d.get(key, default)`, which returns the default (or `None`) instead.",
        "Since Python 3.7, a dictionary remembers **insertion order**: iterating gives keys in the order they were first added. Updating the value of an existing key does not move it.",
        "Keys must be **hashable**: immutable-like objects such as numbers, strings and tuples of hashable items. Lists, dicts and sets cannot be keys because their contents can change. Values can be anything.",
      ],
    },
    {
      kind: "code",
      heading: "Everyday operations",
      example: {
        title: "Read, update, remove",
        language: "python",
        code: "d = {\"a\": 1, \"b\": 2}\nprint(d[\"a\"], d.get(\"z\"), d.get(\"z\", 0), \"a\" in d)\nprint(list(d), list(d.values()), list(d.items()))\ntry:\n    d[\"z\"]\nexcept KeyError as e:\n    print(\"KeyError:\", e)\n\nd[\"c\"] = 3\nd.update({\"a\": 10})\nprint(d)\nremoved = d.pop(\"a\")\nprint(removed, d)\nprint(d.pop(\"zz\", None))\nprint(d.setdefault(\"k\", []), d)",
        walkthrough: [
          "`d[\"a\"]` is `1`, while `d.get(\"z\")` returns `None` and `d.get(\"z\", 0)` returns `0`. `in` tests for a key, not a value.",
          "`list(d)` gives the keys. `values()` and `items()` give the values and `(key, value)` pairs.",
          "A missing key in `d[\"z\"]` raises `KeyError: 'z'`.",
          "Assigning to a new key adds it; assigning to an existing key replaces the value. `update` merges another mapping in.",
          "`pop(key)` removes and returns the value; `pop(key, default)` does not raise if the key is missing. `setdefault(key, default)` returns the existing value or inserts the default and returns it.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Building and merging",
      example: {
        title: "Comprehensions, merge and keys",
        language: "python",
        code: "print({\"x\": 1} | {\"y\": 2})\nprint({**{\"x\": 1}, **{\"x\": 5}})\nprint(dict(zip(\"ab\", [1, 2])), dict(a=1), dict([(\"k\", 1)]))\nprint({w: len(w) for w in [\"apple\", \"fig\"]})\n\ntry:\n    {[1]: 2}\nexcept TypeError as e:\n    print(\"TypeError:\", e)\n\nprint({1: \"a\", 1.0: \"b\", True: \"c\"})\nfor k, v in {\"p\": 1, \"q\": 2}.items():\n    print(k, v)",
        walkthrough: [
          "`a | b` (Python 3.9+) and `{**a, **b}` merge two dicts into a new one. When both have a key, the **right-hand** value wins: `{'x': 5}`.",
          "`dict(zip(keys, values))`, `dict(a=1)` and `dict([(key, value)])` are three ways to build one. A dict comprehension builds it from any iterable.",
          "A list as a key fails with `TypeError: unhashable type: 'list'`.",
          "`1`, `1.0` and `True` are equal and hash the same, so they are the **same key**: the result is `{1: 'c'}` (the first key is kept, the last value wins).",
          "`for k, v in d.items()` is the idiomatic way to loop over keys and values together.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Why lookup is fast",
      body: [
        "A dict is a **hash table**. To store a key, Python computes its hash, which decides where in an internal table the entry goes. To look it up, it hashes the key again and goes straight to that place, instead of comparing against every key.",
        "As a result, lookup, insertion and deletion take **constant time on average**, no matter how many entries there are. In the worst case, many keys with colliding hashes can slow it down, but Python's hashing makes that unusual.",
        "Two objects that compare equal must have the same hash. That is why mutable containers are unhashable: their hash would change when their contents change. Prefer `key in d` for a membership test over searching a list.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using d[key] for a key that might be missing.",
          fix: "Use d.get(key, default), or check with in.",
        },
        {
          mistake: "Changing a dictionary's size while looping over it.",
          fix: "Loop over list(d) or build a new dictionary.",
        },
        {
          mistake: "Using a list as a key.",
          fix: "Use a tuple for a multi-part key.",
        },
        {
          mistake: "Assuming 1 and True are different keys.",
          fix: "Equal, same-hash keys are the same key; avoid mixing them.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Counting words",
      scenario:
        "You want to count how many times each word appears in a list.",
      body: [
        "Loop over the words and write `counts[w] = counts.get(w, 0) + 1`. The `get` supplies zero the first time a word is seen.",
        "For the same task `collections.Counter` does the counting for you, and `defaultdict(int)` avoids the `get`. You will meet both in the collections lesson.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "get-default",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "d = {\"a\": 1}\nprint(d.get(\"z\", 0))",
      },
      options: ["0", "None", "A KeyError"],
      answer: 0,
      explanation:
        "get returns the default when the key is missing and never raises KeyError.",
    },
    {
      type: "output",
      id: "merge-right-wins",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "print({**{\"x\": 1}, **{\"x\": 5}})",
      },
      options: ["{'x': 5}", "{'x': 1}", "{'x': 6}"],
      answer: 0,
      explanation:
        "When a key appears twice, the later (right-hand) value wins.",
    },
    {
      type: "output",
      id: "equal-keys",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "print({1: \"a\", 1.0: \"b\", True: \"c\"})",
      },
      options: ["{1: 'c'}", "{1: 'a', 1.0: 'b', True: 'c'}", "A TypeError"],
      answer: 0,
      explanation:
        "1, 1.0 and True are equal with the same hash, so they are one key. The first key stays and the last value wins.",
    },
    {
      type: "truefalse",
      id: "list-key",
      statement: "A list can be used as a dictionary key.",
      answer: false,
      explanation:
        "Lists are mutable and unhashable. Use a tuple instead.",
    },
  ],
  assignment: {
    title: "Inventory dictionary",
    task: [
      "Build a dictionary mapping product names to quantities. Write code to add a product, increase a quantity, remove a product safely and print every item sorted by name.",
      "Add a function that merges two inventories by adding quantities of products that appear in both.",
    ],
    checklist: [
      "Missing products are handled with get or in",
      "Removal does not raise an error for a missing product",
      "The merge adds quantities for shared products",
      "Output is sorted by product name",
    ],
    hints: ["`sorted(d.items())` sorts by key."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "invert-dict",
      title: "Group by value",
      task: [
        "Write group_by_length(words) that returns a dict mapping each length to the list of words with that length, in input order. group_by_length(['a', 'bb', 'c']) is {1: ['a', 'c'], 2: ['bb']}.",
      ],
      language: "python",
      starter: "def group_by_length(words):\n    pass",
      solution:
        "def group_by_length(words):\n    groups = {}\n    for w in words:\n        groups.setdefault(len(w), []).append(w)\n    return groups",
      hints: ["setdefault returns the list so you can append in one line."],
      checklist: [
        "group_by_length(['a', 'bb', 'c']) is {1: ['a', 'c'], 2: ['bb']}",
        "An empty list returns an empty dict",
        "Words keep their input order",
      ],
    },
  ],
  revisionNotes: [
    "d[key] raises KeyError; get(key, default) does not",
    "Insertion ordered; keys must be hashable; values can be anything",
    "update, | and {**a, **b} merge; the right side wins",
    "Hash table: lookup, insert and delete are constant time on average",
  ],
  resources: [
    {
      label: "The Python Tutorial: Dictionaries",
      url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries",
    },
    {
      label: "Mapping types: dict",
      url: "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict",
    },
    {
      label: "Glossary: hashable",
      url: "https://docs.python.org/3/glossary.html#term-hashable",
    },
  ],
})
