import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-data-structures", {
  slug: "collections-module",
  title: "The collections module",
  topic: "collections module",
  minutes: 50,
  overview:
    "Use Counter, defaultdict, deque, namedtuple and ChainMap from the standard library for counting, grouping, queues and readable records.",
  objectives: [
    "Count items with Counter and read the most common ones",
    "Group values with defaultdict",
    "Use deque as a fast queue or a bounded buffer",
    "Create readable records with namedtuple",
  ],
  prerequisites: ["lesson.python-data-structures.dict"],
  sections: [
    {
      kind: "explain",
      heading: "Specialised containers",
      body: [
        "The `collections` module provides containers that fill the gaps left by the built-in types. They are in the standard library, so there is nothing to install.",
        "The ones you will use most are `Counter` (count things), `defaultdict` (a dict with a default value factory), `deque` (a double-ended queue), `namedtuple` (a tuple with named fields) and `ChainMap` (several dicts viewed as one).",
      ],
    },
    {
      kind: "code",
      heading: "Counter and defaultdict",
      example: {
        title: "Counting and grouping",
        language: "python",
        code: "from collections import Counter, defaultdict\n\nc = Counter([\"a\", \"b\", \"a\"])\nprint(c[\"a\"], c[\"zz\"], c.most_common())\nprint(Counter(\"banana\").most_common(1))\nprint(c + Counter([\"b\"]))\n\nwords = [\"apple\", \"avocado\", \"bean\"]\ngroups = defaultdict(list)\nfor w in words:\n    groups[w[0]].append(w)\nprint(dict(groups))",
        walkthrough: [
          "`Counter` is a dict subclass for counting hashable items. A missing item counts as `0` instead of raising `KeyError`, so `c[\"zz\"]` is `0`.",
          "`most_common(n)` returns the `n` most frequent items as `(item, count)` pairs, highest first. Without an argument it lists all of them.",
          "Counters can be added: `c + Counter([\"b\"])` adds the counts, so `b` becomes 2.",
          "`defaultdict(list)` creates an empty list the first time a missing key is read, so `groups[w[0]].append(w)` works without a check. Here the words are grouped by first letter.",
        ],
      },
    },
    {
      kind: "code",
      heading: "deque, namedtuple and ChainMap",
      example: {
        title: "Queues, records and layered settings",
        language: "python",
        code: "from collections import deque, namedtuple, ChainMap\n\ndq = deque([1, 2, 3], maxlen=3)\ndq.append(4)\ndq.appendleft(0)\nprint(dq)\n\nq = deque([1, 2, 3])\nprint(q.popleft(), q.pop(), q)\n\nP = namedtuple(\"P\", \"x y\")\np = P(1, 2)\nprint(p, p.x, p._replace(x=5), p._asdict())\n\nsettings = ChainMap({\"a\": 1}, {\"a\": 2, \"b\": 3})\nprint(settings[\"a\"], settings[\"b\"])",
        walkthrough: [
          "A `deque` adds and removes at **both ends** in constant time. With `maxlen=3`, adding to one end pushes an item off the other: after `append(4)` and `appendleft(0)` the deque is `deque([0, 2, 3], maxlen=3)`.",
          "`popleft()` removes from the front and `pop()` from the back, so a deque works well as a queue where `list.pop(0)` would be slow. The line prints `1 3 deque([2])`.",
          "`namedtuple(\"P\", \"x y\")` makes a tuple subclass with named fields. `p.x` reads by name, `_replace` returns a copy with a field changed, and `_asdict()` converts to a dict.",
          "`ChainMap` searches several mappings in order. `settings[\"a\"]` finds `1` in the first map; `settings[\"b\"]` falls through to the second and finds `3`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Which one to use",
      diagram: {
        kind: "table",
        title: "Choosing a container",
        headers: ["Need", "Use"],
        rows: [
          ["Count occurrences, find the most common", "Counter"],
          ["Group values under keys without checking if the key exists", "defaultdict(list) or defaultdict(set)"],
          ["Queue or stack with fast operations at both ends, or a fixed-size window", "deque"],
          ["A small record with named fields", "namedtuple (or a dataclass)"],
          ["Layered lookups such as defaults then overrides", "ChainMap"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using a list with pop(0) as a queue.",
          fix: "Use deque and popleft().",
        },
        {
          mistake: "Reading a missing key of a defaultdict just to test for it.",
          fix: "Reading creates the key. Use 'key in d' to test without creating it.",
        },
        {
          mistake: "Writing manual get-and-add counting loops.",
          fix: "Use Counter, which also gives most_common.",
        },
        {
          mistake: "Forgetting that a deque with maxlen drops items silently.",
          fix: "Use maxlen only when losing the oldest item is the intention.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Most common words",
      scenario:
        "You need the five most frequent words in a piece of text.",
      body: [
        "`Counter(text.lower().split()).most_common(5)` returns the answer in one line.",
        "For the last ten lines of a log, `deque(lines, maxlen=10)` keeps only the newest ten as it reads, without storing the whole file.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "counter-missing",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "from collections import Counter\nc = Counter([\"a\", \"b\", \"a\"])\nprint(c[\"zz\"])",
      },
      options: ["0", "None", "A KeyError"],
      answer: 0,
      explanation:
        "A Counter returns 0 for an item it has not seen.",
    },
    {
      type: "output",
      id: "deque-maxlen",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "from collections import deque\ndq = deque([1, 2, 3], maxlen=3)\ndq.append(4)\nprint(list(dq))",
      },
      options: ["[2, 3, 4]", "[1, 2, 3, 4]", "[1, 2, 3]"],
      answer: 0,
      explanation:
        "The deque is full, so appending 4 pushes the oldest item (1) out of the other end.",
    },
    {
      type: "single",
      id: "fast-queue",
      prompt: "Which structure removes from the front in constant time?",
      options: ["deque", "list", "tuple"],
      answer: 0,
      explanation:
        "deque.popleft() is constant time. list.pop(0) shifts every other item.",
    },
    {
      type: "truefalse",
      id: "namedtuple-immutable",
      statement: "A namedtuple instance is immutable, so p._replace(x=5) returns a new instance.",
      answer: true,
      explanation:
        "Fields cannot be assigned; _replace builds a copy with the change.",
    },
  ],
  assignment: {
    title: "Text statistics",
    task: [
      "Write a script that reads a paragraph of text and prints the five most common words (Counter), groups the words by their first letter (defaultdict) and keeps a rolling window of the last three words (deque with maxlen).",
      "Represent each word statistic as a namedtuple with fields word and count.",
    ],
    checklist: [
      "Counter's most_common is used",
      "defaultdict groups the words without key checks",
      "The deque keeps only the last three words",
      "A namedtuple is used for the result records",
    ],
    hints: ["`Word(*pair)` builds a namedtuple from a (word, count) pair."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "first-letter-groups",
      title: "Group by first letter",
      task: [
        "Write by_first_letter(words) that returns a dict mapping each first letter to the list of words that start with it, in input order. Use defaultdict. by_first_letter(['ant', 'bee', 'ape']) is {'a': ['ant', 'ape'], 'b': ['bee']}.",
      ],
      language: "python",
      starter: "from collections import defaultdict\n\ndef by_first_letter(words):\n    pass",
      solution:
        "from collections import defaultdict\n\ndef by_first_letter(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[w[0]].append(w)\n    return dict(groups)",
      hints: ["Convert the defaultdict to a normal dict before returning."],
      checklist: [
        "by_first_letter(['ant', 'bee', 'ape']) is {'a': ['ant', 'ape'], 'b': ['bee']}",
        "No explicit check for a missing key",
        "An empty list returns an empty dict",
      ],
    },
  ],
  revisionNotes: [
    "Counter counts and gives most_common; missing items count as 0",
    "defaultdict(factory) creates a default on first access",
    "deque: fast at both ends, maxlen for a window; popleft for queues",
    "namedtuple for named fields; ChainMap for layered lookups",
  ],
  resources: [
    {
      label: "collections: container datatypes",
      url: "https://docs.python.org/3/library/collections.html",
    },
    {
      label: "The Python Tutorial: Using lists as queues",
      url: "https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-queues",
    },
  ],
})
