import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "functions",
  title: "Functions, arguments and scope",
  topic: "Functions",
  minutes: 80,
  overview:
    "Define functions with default, keyword, *args and **kwargs parameters, understand return values and scope, avoid the mutable default trap, and use lambdas and closures.",
  objectives: [
    "Define and call functions with positional, keyword and default arguments",
    "Collect extra arguments with *args and **kwargs",
    "Explain local, enclosing, global and built-in scope",
    "Avoid mutable default arguments and use nonlocal in a closure",
  ],
  prerequisites: ["lesson.python-fundamentals.control-flow"],
  sections: [
    {
      kind: "explain",
      heading: "Defining functions",
      body: [
        "A function is defined with `def name(parameters):` followed by an indented body. It returns a value with `return`; a function without a `return` (or with a bare `return`) gives back `None`. A string placed first in the body is the **docstring**, which tools and `help()` display.",
        "Parameters can have **default values**, and callers can pass arguments by position or by keyword (`greet(name=\"Ana\")`). Parameters with defaults must come after those without.",
        "Functions are objects: you can store them in variables, pass them as arguments and return them from other functions.",
      ],
    },
    {
      kind: "code",
      heading: "Arguments",
      example: {
        title: "Defaults, *args and **kwargs",
        language: "python",
        code: "def add(a, b=2, *args, **kw):\n    return (a, b, args, kw)\n\nprint(add(1))\nprint(add(1, 3, 4, 5, x=9))\n\ndef noret():\n    pass\n\nprint(noret())\nprint(sorted([\"bb\", \"a\", \"ccc\"], key=len))\nsq = lambda n: n * n\nprint(sq(4))",
        walkthrough: [
          "`add(1)` uses the default `b=2`, with no extra positional or keyword arguments: `(1, 2, (), {})`.",
          "`*args` collects extra positional arguments into a **tuple**; `**kw` collects extra keyword arguments into a **dict**. So `add(1, 3, 4, 5, x=9)` gives `(1, 3, (4, 5), {'x': 9})`.",
          "A function with no `return` returns `None`, so `print(noret())` prints `None`.",
          "A **lambda** is a small anonymous function with one expression. It is handy for a `key=` argument such as `sorted(..., key=len)`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "The mutable default trap",
      example: {
        title: "Defaults are evaluated once",
        language: "python",
        code: "def bad(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nprint(bad(1), bad(2))\n\ndef good(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket\n\nprint(good(1), good(2))",
        walkthrough: [
          "A default value is created **once**, when the function is defined, not on every call. The empty list in `bad` is shared across calls, so both results show `[1, 2]`.",
          "The fix is to use `None` as the default and create a new list inside the function. `good(1)` and `good(2)` return `[1]` and `[2]`.",
          "Immutable defaults such as numbers, strings and `None` are safe.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Scope and closures",
      body: [
        "Python looks up a name in this order: **L**ocal, **E**nclosing functions, **G**lobal (module), then **B**uilt-in. Assigning to a name inside a function makes it local to that function, so a global with the same name is not changed.",
        "An inner function can use variables of the function that contains it; this is a **closure**. To rebind such a variable from the inner function, declare it `nonlocal`. Use `global` for module-level names, though passing arguments and returning values is usually clearer.",
      ],
    },
    {
      kind: "code",
      heading: "A closure with nonlocal",
      example: {
        title: "A counter",
        language: "python",
        code: "def counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\n\nc1 = counter()\nc1()\nprint(c1())\n\nv = 10\ndef shadow():\n    v = 1\n    return v\nprint(shadow(), v)",
        walkthrough: [
          "`counter()` returns the inner function `inc`, which remembers `count` even after `counter` has returned.",
          "Without `nonlocal`, `count += 1` would treat `count` as a new local variable and fail. Calling `c1()` twice gives `2`.",
          "In `shadow`, assigning `v = 1` creates a local `v`. The global `v` is untouched, so the output is `1 10`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "A mutable default such as def f(x, items=[]).",
          fix: "Use None and create the list inside the function.",
        },
        {
          mistake: "Forgetting return, so the caller receives None.",
          fix: "Return the result explicitly.",
        },
        {
          mistake: "Modifying a global inside a function without declaring it.",
          fix: "Pass values in and return results, or declare global/nonlocal deliberately.",
        },
        {
          mistake: "Calling a function without parentheses and expecting its result.",
          fix: "f is the function object; f() calls it.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A flexible logging helper",
      scenario:
        "You want a helper that prints a message with an optional prefix and any number of extra details.",
      body: [
        "Define `log(message, *details, prefix=\"INFO\")`. Callers write `log(\"saved\", \"user 7\", \"3 rows\")` or `log(\"failed\", prefix=\"ERROR\")`.",
        "Placing `prefix` after `*details` makes it keyword-only, which keeps call sites readable.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "default-trap",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "def f(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nf(1)\nprint(f(2))",
      },
      options: ["[1, 2]", "[2]", "[1]"],
      answer: 0,
      explanation:
        "The default list is created once and shared, so the second call sees the first call's item.",
    },
    {
      type: "output",
      id: "args-kwargs",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "def add(a, b=2, *args, **kw):\n    return (a, b, args, kw)\n\nprint(add(1, 3, 4, 5, x=9))",
      },
      options: ["(1, 3, (4, 5), {'x': 9})", "(1, 3, [4, 5], {'x': 9})", "(1, 2, (3, 4, 5), {'x': 9})"],
      answer: 0,
      explanation:
        "b takes the second positional value (3); *args collects the rest as a tuple; **kw collects keywords as a dict.",
    },
    {
      type: "single",
      id: "no-return",
      prompt: "What does a function with no return statement give back?",
      options: ["None", "0", "An empty string"],
      answer: 0,
      explanation:
        "Falling off the end of a function returns None.",
    },
    {
      type: "blank",
      id: "closure-keyword",
      prompt: "To rebind a variable of the enclosing function from an inner function, declare it ___.",
      answer: "nonlocal",
      explanation:
        "nonlocal refers to a name in the nearest enclosing function scope.",
    },
  ],
  assignment: {
    title: "A small function library",
    task: [
      "Write three functions in one file: one with a default argument, one that accepts *args and returns their average, and one factory that returns a function multiplying by a fixed number (a closure).",
      "Add a short docstring to each and a block of calls that prints their results.",
    ],
    checklist: [
      "A default argument is used and shown with and without a value",
      "The average function handles an empty call without crashing",
      "The factory returns a working closure",
      "No mutable default arguments are used",
    ],
    hints: ["Check len(args) before dividing."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "make-multiplier",
      title: "Closure factory",
      task: [
        "Write make_multiplier(factor) that returns a function. The returned function takes one number and returns it multiplied by factor.",
      ],
      language: "python",
      starter: "def make_multiplier(factor):\n    pass",
      solution:
        "def make_multiplier(factor):\n    def multiply(n):\n        return n * factor\n    return multiply",
      hints: ["Define a function inside and return it without calling it."],
      checklist: [
        "make_multiplier(3)(4) is 12",
        "Two multipliers do not affect each other",
        "The inner function is returned, not called",
      ],
    },
    {
      slug: "append-safe",
      title: "Fix the default",
      task: [
        "Rewrite def add_tag(tag, tags=[]) so each call without a list starts with a fresh empty list.",
      ],
      language: "python",
      starter: "def add_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags",
      solution:
        "def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags",
      hints: ["Use None as the default."],
      checklist: [
        "add_tag('a') and add_tag('b') return separate lists",
        "A list passed in is still used",
      ],
    },
  ],
  revisionNotes: [
    "def, return (None by default), docstring, defaults after non-defaults",
    "*args is a tuple, **kwargs is a dict; keyword-only parameters follow *args",
    "Defaults are evaluated once: never use a mutable default",
    "LEGB scope; closures remember enclosing variables; nonlocal rebinding",
  ],
  resources: [
    {
      label: "The Python Tutorial: Defining functions",
      url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
    },
    {
      label: "The Python Tutorial: More on defining functions",
      url: "https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions",
    },
    {
      label: "The Python Tutorial: Python scopes and namespaces",
      url: "https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces",
    },
  ],
})
