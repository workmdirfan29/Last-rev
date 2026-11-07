import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-oop", {
  slug: "dunder-methods",
  title: "Dunder (special) methods",
  topic: "Dunder methods",
  minutes: 70,
  overview:
    "Make your objects work with Python's operators and built-ins by implementing special methods: comparison, arithmetic, length, truthiness, indexing, iteration, hashing and context managers.",
  objectives: [
    "Explain how built-ins and operators call special methods",
    "Implement __eq__, __add__, __len__, __bool__, __getitem__ and __iter__",
    "Explain the link between __eq__ and __hash__",
    "Write a context manager with __enter__ and __exit__",
  ],
  prerequisites: ["lesson.python-oop.classes"],
  sections: [
    {
      kind: "explain",
      heading: "The data model",
      body: [
        "Python's **data model** defines special methods whose names start and end with two underscores, called **dunder** (double underscore) methods. You rarely call them directly. Instead, the language calls them for you: `len(x)` calls `x.__len__()`, `a + b` calls `a.__add__(b)`, `a == b` calls `a.__eq__(b)`, and `for i in x` calls `x.__iter__()`.",
        "By implementing them, your own classes behave like built-in types. This is the reason a `list`, a `dict` and your class can all work with `len()`, `in`, `for` and `with`.",
      ],
    },
    {
      kind: "code",
      heading: "A vector class",
      example: {
        title: "Operators, size and iteration",
        language: "python",
        code: "class Vec:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __add__(self, o):\n        return Vec(self.x + o.x, self.y + o.y)\n\n    def __eq__(self, o):\n        return (self.x, self.y) == (o.x, o.y)\n\n    def __repr__(self):\n        return f\"Vec({self.x}, {self.y})\"\n\n    def __len__(self):\n        return 2\n\n    def __bool__(self):\n        return bool(self.x or self.y)\n\n    def __getitem__(self, i):\n        return (self.x, self.y)[i]\n\n    def __iter__(self):\n        return iter((self.x, self.y))\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\nprint(Vec(1, 2) + Vec(3, 4))\nprint(Vec(1, 2) == Vec(1, 2))\nprint(len(Vec(1, 2)), bool(Vec(0, 0)), Vec(5, 6)[1])\nprint(list(Vec(7, 8)))\nprint(len({Vec(1, 2), Vec(1, 2)}))",
        walkthrough: [
          "`__add__` defines `+` and returns a new `Vec`: `Vec(4, 6)`. `__eq__` makes two vectors with equal parts equal: `True`.",
          "`len(Vec(1, 2))` calls `__len__` and gives `2`. `bool(Vec(0, 0))` calls `__bool__` and gives `False`; without `__bool__`, Python would use `__len__`, and without both every object is true.",
          "`__getitem__` supports `v[1]`. `__iter__` makes the object iterable, so `list(Vec(7, 8))` is `[7, 8]`.",
          "Two equal vectors need the same hash to behave in a set. With `__hash__` defined from the same fields, the set collapses them: its length is `1`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Equality and hashing",
      body: [
        "Objects that compare equal must have equal hashes if they are to be used as dictionary keys or set members. When you define `__eq__` in a class without defining `__hash__`, Python sets `__hash__` to `None`, making instances **unhashable**. Define both together, based on the same immutable fields.",
        "Only hash objects that you will not mutate while they are in a set or used as a key, or lookups will fail.",
        "For ordering (`<`, `>`), implement `__lt__` and friends, or use `functools.total_ordering`, or a dataclass with `order=True`.",
      ],
    },
    {
      kind: "code",
      heading: "Context managers",
      example: {
        title: "__enter__ and __exit__",
        language: "python",
        code: "class Ctx:\n    def __enter__(self):\n        print(\"enter\")\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        print(\"exit\")\n        return False\n\nwith Ctx():\n    print(\"body\")",
        walkthrough: [
          "A `with` statement calls `__enter__` first. Its return value is bound by `as`.",
          "`__exit__` is called when the block ends, even if an exception occurred. It receives the exception details, and returning a true value would suppress the exception. Returning `False` lets it propagate.",
          "The output is `enter`, `body`, `exit`. This is how files, locks and database connections release their resources.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Defining __eq__ but not __hash__ and then using instances in a set.",
          fix: "Define __hash__ from the same fields, or accept that the class is unhashable.",
        },
        {
          mistake: "Calling dunder methods directly, such as x.__len__().",
          fix: "Use the built-in: len(x).",
        },
        {
          mistake: "Making __add__ modify and return self.",
          fix: "Return a new object, as the built-in numbers do.",
        },
        {
          mistake: "Raising the wrong error in __getitem__ so iteration never stops.",
          fix: "Raise IndexError for an out-of-range index, or define __iter__.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A money type",
      scenario:
        "A small Money class holds an amount and a currency code and should add and compare cleanly.",
      body: [
        "Implement `__add__` that raises `ValueError` for different currencies, `__eq__` and `__hash__` using the tuple `(amount, currency)`, and `__repr__` for debugging.",
        "Then `Money(5, 'EUR') + Money(7, 'EUR')` reads like arithmetic and `{Money(1, 'EUR')}` behaves as a set member.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "len-dunder",
      prompt: "Which special method does len(x) call?",
      options: ["__len__", "__size__", "__count__"],
      answer: 0,
      explanation:
        "len(x) calls type(x).__len__(x).",
    },
    {
      type: "output",
      id: "set-of-equal-vecs",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class Vec:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __eq__(self, o):\n        return (self.x, self.y) == (o.x, o.y)\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\nprint(len({Vec(1, 2), Vec(1, 2)}))",
      },
      options: ["1", "2", "A TypeError"],
      answer: 0,
      explanation:
        "Equal objects with equal hashes collapse into one set member.",
    },
    {
      type: "output",
      id: "with-order",
      prompt: "What are the printed lines, in order?",
      code: {
        language: "python",
        code: "class Ctx:\n    def __enter__(self):\n        print(\"enter\")\n        return self\n\n    def __exit__(self, *args):\n        print(\"exit\")\n        return False\n\nwith Ctx():\n    print(\"body\")",
      },
      options: ["enter, body, exit", "body, enter, exit", "enter, exit, body"],
      answer: 0,
      explanation:
        "__enter__ runs first, then the block, then __exit__.",
    },
    {
      type: "truefalse",
      id: "eq-without-hash",
      statement: "A class that defines __eq__ but not __hash__ becomes unhashable.",
      answer: true,
      explanation:
        "Python sets __hash__ to None in that case, so instances cannot be set members or dictionary keys.",
    },
  ],
  assignment: {
    title: "A Money class",
    task: [
      "Write a Money class with amount and currency and implement __add__, __eq__, __hash__, __repr__, __bool__ (false for zero) and __lt__.",
      "Show sorting a list of Money, using one in a set and the error for adding different currencies.",
    ],
    checklist: [
      "Adding returns a new Money",
      "Equal values hash equally",
      "Different currencies raise ValueError",
      "A list of Money can be sorted",
    ],
    hints: ["Use `functools.total_ordering` to get all comparisons from __eq__ and __lt__."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "playlist-class",
      title: "A playlist",
      task: [
        "Write Playlist(songs) holding a list. Implement __len__, __getitem__, __iter__ and __contains__ so that len(p), p[0], 'x' in p and for-loops work. __repr__ should show Playlist(['a', 'b']).",
      ],
      language: "python",
      starter: "class Playlist:\n    pass",
      solution:
        "class Playlist:\n    def __init__(self, songs):\n        self._songs = list(songs)\n\n    def __len__(self):\n        return len(self._songs)\n\n    def __getitem__(self, i):\n        return self._songs[i]\n\n    def __iter__(self):\n        return iter(self._songs)\n\n    def __contains__(self, song):\n        return song in self._songs\n\n    def __repr__(self):\n        return f'Playlist({self._songs!r})'",
      hints: ["Delegate to the internal list in each method."],
      checklist: [
        "len(Playlist(['a', 'b'])) is 2",
        "'a' in the playlist is True",
        "Iteration yields the songs in order",
        "repr is Playlist(['a', 'b'])",
      ],
    },
  ],
  revisionNotes: [
    "Built-ins and operators call dunder methods: len, +, ==, for, with",
    "__repr__/__str__, __eq__/__hash__ together, __bool__ then __len__ for truth",
    "__getitem__, __iter__, __contains__ make a container",
    "__enter__/__exit__ implement context managers; __exit__ runs even on errors",
  ],
  resources: [
    {
      label: "Data model: special method names",
      url: "https://docs.python.org/3/reference/datamodel.html#special-method-names",
    },
    {
      label: "The Python Tutorial: Iterators",
      url: "https://docs.python.org/3/tutorial/classes.html#iterators",
    },
    {
      label: "contextlib: utilities for with-statement contexts",
      url: "https://docs.python.org/3/library/contextlib.html",
    },
  ],
})
