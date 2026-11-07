import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "types",
  title: "Python types and variables",
  topic: "Types",
  minutes: 70,
  overview:
    "Learn Python's built-in types, how names refer to objects, the difference between mutable and immutable objects, truthiness, and the operators that surprise beginners.",
  objectives: [
    "Name the core built-in types and check a value with type() and isinstance()",
    "Explain that a variable is a name bound to an object",
    "Tell mutable and immutable types apart and predict aliasing effects",
    "Use arithmetic, comparison and truthiness rules correctly",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Everything is an object",
      body: [
        "In Python every value is an **object** with a type. You do not declare types; a variable is just a **name** bound to an object, and the type belongs to the object. The same name can later be bound to an object of a different type.",
        "The core built-in types are `int`, `float`, `bool`, `str`, `list`, `tuple`, `dict`, `set` and `NoneType` (the type of `None`, which means 'no value'). `type(x)` returns the type of an object and `isinstance(x, int)` tests it.",
        "`bool` is a subclass of `int`, so `True` behaves like 1 and `False` like 0 in arithmetic.",
      ],
    },
    {
      kind: "code",
      heading: "Numbers and operators",
      example: {
        title: "Division, floor division, modulo and powers",
        language: "python",
        code: "print(7 / 2)      # true division\nprint(7 // 2)     # floor division\nprint(-7 // 2)    # floors towards negative infinity\nprint(7 % 3)\nprint(2 ** 10)\nprint(0.1 + 0.2)\nprint(round(2.5), round(3.5))\nprint(int(\"42\") + 1)",
        walkthrough: [
          "`/` always returns a float: `7 / 2` is `3.5`.",
          "`//` is floor division, so `-7 // 2` is `-4`, not `-3`. `%` gives the remainder, `**` is the power.",
          "Floats are binary approximations, so `0.1 + 0.2` prints `0.30000000000000004`. Compare floats with a tolerance, such as `math.isclose`.",
          "`round()` rounds halves to the nearest even number, so `round(2.5)` is `2` and `round(3.5)` is `4`.",
          "`int(\"42\")` converts a string to an integer. Python does not convert silently between str and int: `\"5\" + 5` raises a `TypeError`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Mutable and immutable",
      diagram: {
        kind: "table",
        title: "Which built-in types can change in place",
        headers: ["Type", "Mutable?", "Example"],
        rows: [
          ["int, float, bool, str, tuple", "No (immutable)", "A string cannot be edited; you build a new one"],
          ["list, dict, set", "Yes (mutable)", "list.append changes the same object"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Names, aliases and copies",
      example: {
        title: "Two names, one object",
        language: "python",
        code: "a = [1, 2]\nb = a\nb.append(3)\nprint(a)\nprint(a is b)\n\nc = a.copy()\nc.append(4)\nprint(a)\nprint(c)\nprint(a == [1, 2, 3], a is [1, 2, 3])",
        walkthrough: [
          "`b = a` does not copy the list. Both names refer to the same object, so appending through `b` changes what `a` sees: `[1, 2, 3]`.",
          "`is` tests identity (the same object); `==` tests equality of value. `a == [1, 2, 3]` is `True`, but `a is [1, 2, 3]` is `False` because the right side is a new list.",
          "`a.copy()` makes a new list, so changing `c` leaves `a` alone. It is a shallow copy: nested objects are still shared.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Truthiness",
      body: [
        "Any object can be used in a condition. These are false: `None`, `False`, zero of any numeric type (`0`, `0.0`), and empty collections or strings (`\"\"`, `[]`, `()`, `{}`, `set()`). Almost everything else is true, including the string `\" \"` and the string `\"0\"`.",
        "Use `x is None` (not `x == None`) to test for `None`. Use `isinstance(x, int)` rather than comparing `type(x)` when subclasses are acceptable.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Believing b = a copies a list.",
          fix: "Both names share one object; use a.copy() or list(a) for a shallow copy.",
        },
        {
          mistake: "Comparing with `is` for values, such as `x is 5` or `name is \"abc\"`.",
          fix: "Use == for values and reserve is for None and true identity checks.",
        },
        {
          mistake: "Comparing floats with ==.",
          fix: "Use math.isclose or compare within a tolerance.",
        },
        {
          mistake: "Concatenating a string and a number.",
          fix: "Convert explicitly with str() or use an f-string.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reading numeric input",
      scenario:
        "A script reads an age as text and needs to decide whether the user is an adult.",
      body: [
        "`input()` always returns a `str`. Convert it with `int()` before comparing: `age = int(text)`. Wrap the conversion in a `try`/`except ValueError` so that bad input does not crash the program.",
        "Then `age >= 18` is a `bool` you can use directly in a condition.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "floor-div",
      prompt: "What does this print?",
      code: { language: "python", code: "print(-7 // 2)" },
      options: ["-4", "-3", "-3.5"],
      answer: 0,
      explanation:
        "// is floor division: it rounds towards negative infinity, so -3.5 becomes -4.",
    },
    {
      type: "output",
      id: "alias-output",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "a = [1, 2]\nb = a\nb.append(3)\nprint(a)",
      },
      options: ["[1, 2, 3]", "[1, 2]", "[3]"],
      answer: 0,
      explanation:
        "b and a are two names for the same list, so the append is visible through both.",
    },
    {
      type: "truefalse",
      id: "empty-string-falsy",
      statement: "The empty string is false in a condition, but the string \" \" (one space) is true.",
      answer: true,
      explanation:
        "Only empty strings are false. A string with any character, even a space, is true.",
    },
    {
      type: "single",
      id: "immutable-type",
      prompt: "Which of these types is immutable?",
      options: ["tuple", "list", "dict"],
      answer: 0,
      explanation:
        "A tuple cannot be changed in place. Lists and dicts can.",
    },
  ],
  assignment: {
    title: "A type explorer",
    task: [
      "Write a script that takes a list of mixed values (an int, a float, a string, a list, None, True) and prints each value, its type name and whether it is truthy.",
      "Add a second part that demonstrates aliasing: create two names for one list and show that changing one changes the other, then fix it with a copy.",
    ],
    checklist: [
      "The script prints value, type name and truthiness for every item",
      "It shows that bool is a kind of int",
      "The aliasing demo and the copy fix are both shown",
      "Comparisons with None use is",
    ],
    hints: ["`type(x).__name__` gives the type's name as a string."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "describe-values",
      title: "Describe values",
      task: [
        "Write a function describe(value) that returns the string 'empty' for any false value, 'number' for int or float (but not bool), and 'other' otherwise.",
      ],
      language: "python",
      starter: "def describe(value):\n    pass",
      solution:
        "def describe(value):\n    if not value:\n        return 'empty'\n    if isinstance(value, (int, float)) and not isinstance(value, bool):\n        return 'number'\n    return 'other'",
      hints: ["bool is a subclass of int, so check for it before counting something as a number."],
      checklist: [
        "0, '' and None return 'empty'",
        "5 and 2.5 return 'number'",
        "True is not treated as a number",
        "A non-empty string returns 'other'",
      ],
    },
  ],
  revisionNotes: [
    "A variable is a name bound to an object; the type belongs to the object",
    "/ is true division, // floors, % remainder, ** power; floats are approximate",
    "Mutable: list, dict, set. Immutable: int, float, bool, str, tuple",
    "== compares values, is compares identity; test None with is",
    "False values: None, False, zeros and empty collections or strings",
  ],
  resources: [
    {
      label: "The Python Tutorial: An informal introduction to Python",
      url: "https://docs.python.org/3/tutorial/introduction.html",
    },
    {
      label: "Built-in types",
      url: "https://docs.python.org/3/library/stdtypes.html",
    },
    {
      label: "Data model",
      url: "https://docs.python.org/3/reference/datamodel.html",
    },
  ],
})
