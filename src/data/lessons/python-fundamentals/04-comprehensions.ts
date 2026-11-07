import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "comprehensions",
  title: "Comprehensions and generator expressions",
  topic: "Comprehensions",
  minutes: 50,
  overview:
    "Build lists, dicts and sets in one readable expression, add conditions and nested loops, and use generator expressions to avoid building whole lists.",
  objectives: [
    "Write list, dict and set comprehensions with a condition",
    "Read a comprehension with two for clauses",
    "Explain how a generator expression differs from a list comprehension",
    "Know when a plain loop is clearer",
  ],
  prerequisites: ["lesson.python-fundamentals.control-flow"],
  sections: [
    {
      kind: "explain",
      heading: "A compact way to build collections",
      body: [
        "A **comprehension** builds a new collection from an iterable in a single expression. `[expression for item in iterable if condition]` reads as 'the expression, for each item, if the condition holds'.",
        "The same shape works with braces: `{key: value for ...}` builds a dict and `{expression for ...}` builds a set. The `if` is optional and filters items before they reach the expression.",
        "A comprehension is not just shorter; it also states the intent, 'make a list of these values', without the empty list and `append` of the loop version.",
      ],
    },
    {
      kind: "code",
      heading: "The four forms",
      example: {
        title: "List, dict, set and nested",
        language: "python",
        code: "print([n * n for n in range(5) if n % 2 == 0])\nprint({w: len(w) for w in [\"a\", \"bb\"]})\nprint({n % 3 for n in range(10)})\nprint([(i, j) for i in range(2) for j in range(2)])\nprint(sum(n for n in range(4)))",
        walkthrough: [
          "The list comprehension keeps even numbers and squares them: `[0, 4, 16]`.",
          "The dict comprehension maps each word to its length: `{'a': 1, 'bb': 2}`.",
          "The set comprehension collects remainders and removes duplicates, giving `{0, 1, 2}`.",
          "Two `for` clauses behave like nested loops, with the first as the outer loop: `[(0, 0), (0, 1), (1, 0), (1, 1)]`.",
          "`sum(n for n in range(4))` passes a **generator expression** to `sum` and prints `6`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Generators are lazy",
      example: {
        title: "A generator expression",
        language: "python",
        code: "gen = (n for n in range(3))\nprint(next(gen))\nprint(list(gen))",
        walkthrough: [
          "Round brackets create a **generator expression**. It does not build a list; it produces one value at a time when asked.",
          "`next(gen)` takes the first value, `0`. `list(gen)` then collects what is left, `[1, 2]`.",
          "A generator can be consumed only once. After that, it is empty. This laziness saves memory when the data is large or when you stop early, as `sum` or `any` do.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Keeping them readable",
      body: [
        "A comprehension with one loop and at most one condition is clear. When it needs several conditions, nested logic or side effects such as printing, use a regular `for` loop instead.",
        "A comprehension has its own scope: the loop variable does not leak into the surrounding code in Python 3.",
        "If an expression value depends on a condition, put the conditional in the expression part: `[x if x > 0 else 0 for x in nums]`. A trailing `if` only filters.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing a long, nested comprehension nobody can read.",
          fix: "Switch to a loop or split it into named steps.",
        },
        {
          mistake: "Using a comprehension only for its side effects, such as [print(x) for x in xs].",
          fix: "Use a plain for loop when you are not building a collection.",
        },
        {
          mistake: "Expecting a generator to be reusable.",
          fix: "A generator is exhausted after one pass; build a list if you need several passes.",
        },
        {
          mistake: "Putting if/else after the for clause.",
          fix: "Use the conditional expression before the for: [a if cond else b for x in xs].",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Cleaning a column of data",
      scenario:
        "You have a list of strings read from a file, some blank, and you want trimmed, lowercase, non-empty values.",
      body: [
        "`cleaned = [s.strip().lower() for s in raw if s.strip()]` does the whole job in one line. The condition removes blank entries and the expression normalises the rest.",
        "To count each unique value afterwards, build a set with `{s.strip().lower() for s in raw}`.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "list-comp-output",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "print([n * n for n in range(5) if n % 2 == 0])",
      },
      options: ["[0, 4, 16]", "[1, 9]", "[0, 1, 4, 9, 16]"],
      answer: 0,
      explanation:
        "Only the even numbers 0, 2 and 4 pass the filter, and each is squared.",
    },
    {
      type: "output",
      id: "gen-output",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "gen = (n for n in range(3))\nprint(next(gen))\nprint(list(gen))",
      },
      options: ["0 then [1, 2]", "0 then [0, 1, 2]", "[0, 1, 2] then []"],
      answer: 0,
      explanation:
        "next takes the first value; list then collects the remaining ones.",
    },
    {
      type: "single",
      id: "set-comp-braces",
      prompt: "Which brackets make a set comprehension?",
      options: ["{expression for x in xs}", "[expression for x in xs]", "(expression for x in xs)"],
      answer: 0,
      explanation:
        "Braces without a key: value pair make a set. Square brackets make a list and round brackets a generator.",
    },
    {
      type: "truefalse",
      id: "generator-reuse",
      statement: "A generator expression can be iterated over many times.",
      answer: false,
      explanation:
        "A generator is consumed as you iterate; a second pass finds it empty.",
    },
  ],
  assignment: {
    title: "Rewrite loops as comprehensions",
    task: [
      "Take five small loops that build a list, dict or set (for example squares of even numbers, a word-length mapping, unique first letters) and rewrite each as a comprehension.",
      "For one of them, show a version that is clearer as a plain loop and explain why.",
    ],
    checklist: [
      "At least one list, one dict and one set comprehension",
      "One comprehension has a condition",
      "One uses a generator expression with sum, any or max",
      "The loop-is-clearer example is explained",
    ],
    hints: ["Read your comprehension aloud as 'x for each item if condition'."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "word-lengths",
      title: "Word lengths",
      task: [
        "Write long_words(words, n) that returns a dict mapping each word with more than n letters to its length. Use a dict comprehension.",
      ],
      language: "python",
      starter: "def long_words(words, n):\n    pass",
      solution:
        "def long_words(words, n):\n    return {w: len(w) for w in words if len(w) > n}",
      hints: ["The condition goes at the end of the comprehension."],
      checklist: [
        "long_words(['a', 'abc', 'abcd'], 2) is {'abc': 3, 'abcd': 4}",
        "An empty list returns an empty dict",
        "Words of exactly n letters are excluded",
      ],
    },
  ],
  revisionNotes: [
    "[expr for x in it if cond]; braces for dict and set",
    "Several for clauses behave like nested loops, first is outer",
    "Generator expressions are lazy and single-use",
    "Use a loop when the logic is not simple or has side effects",
  ],
  resources: [
    {
      label: "The Python Tutorial: List comprehensions",
      url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
    },
    {
      label: "The Python Tutorial: Dictionaries",
      url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries",
    },
    {
      label: "Python reference: Displays for lists, sets and dictionaries",
      url: "https://docs.python.org/3/reference/expressions.html#displays-for-lists-sets-and-dictionaries",
    },
  ],
})
