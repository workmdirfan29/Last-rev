import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "control-flow",
  title: "Control flow: if, loops and match",
  topic: "Control flow",
  minutes: 60,
  overview:
    "Write decisions and loops in Python: if/elif/else, for and while, range, break and continue, the loop else clause, enumerate and zip, and structural pattern matching.",
  objectives: [
    "Write if/elif/else chains with correct indentation",
    "Loop with for and while, and choose range, enumerate or zip",
    "Use break, continue and the loop else clause",
    "Use a match statement for multi-way decisions",
  ],
  prerequisites: ["lesson.python-fundamentals.types"],
  sections: [
    {
      kind: "explain",
      heading: "Blocks and conditions",
      body: [
        "Python marks blocks by **indentation**, not braces. The usual indent is four spaces, and every statement in a block must use the same indent. A line ending in a colon starts a block.",
        "`if`, `elif` and `else` choose one branch. The condition can be any expression, because every object has a truth value. Combine conditions with `and`, `or` and `not`; they short-circuit, so the right side is evaluated only if needed. Comparisons can be chained: `0 < x < 10`.",
      ],
    },
    {
      kind: "code",
      heading: "Loops",
      example: {
        title: "for, range, enumerate and zip",
        language: "python",
        code: "print(list(range(2, 10, 3)))\nprint(list(range(5, 0, -2)))\n\nfor i, ch in enumerate(\"ab\", start=1):\n    print(i, ch)\n\nprint(list(zip([1, 2, 3], \"ab\")))\n\nfor n in [2, 3, 4]:\n    if n == 9:\n        break\nelse:\n    print(\"no break\")",
        walkthrough: [
          "`range(start, stop, step)` produces integers up to but not including `stop`: `range(2, 10, 3)` gives `2, 5, 8`. A negative step counts down.",
          "`for` loops over any iterable. `enumerate` gives `(index, item)` pairs, and `start=1` begins counting at 1, so you do not need a manual counter.",
          "`zip` pairs up items from several iterables and stops at the shortest, so the result has two pairs.",
          "The `else` of a loop runs only if the loop finished **without** hitting `break`. Here no item equals 9, so it prints `no break`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "while, break and continue",
      body: [
        "`while condition:` repeats as long as the condition is true. Make sure something in the body changes the condition, or the loop never ends.",
        "`break` leaves the nearest loop immediately. `continue` skips to the next iteration. `pass` does nothing and is a placeholder for an empty block.",
        "Prefer `for` when you know what you are iterating over. Use `while` when you loop until a condition changes, such as reading input until the user types 'quit'.",
      ],
    },
    {
      kind: "code",
      heading: "match statement",
      example: {
        title: "Structural pattern matching (Python 3.10+)",
        language: "python",
        code: "def grade(score):\n    match score:\n        case 100:\n            return \"perfect\"\n        case n if n >= 50:\n            return \"pass\"\n        case _:\n            return \"fail\"\n\nprint(grade(100), grade(70), grade(10))",
        walkthrough: [
          "`match` compares the subject against each `case` pattern in order and runs the first that matches.",
          "A literal pattern like `100` matches that value. A name pattern such as `n` captures the value, and `if n >= 50` is a **guard** that must also be true.",
          "`_` is the wildcard that matches anything, so it acts as the default. The output is `perfect pass fail`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Mixing tabs and spaces or misaligning a block.",
          fix: "Use four spaces everywhere; configure your editor to do so.",
        },
        {
          mistake: "A while loop that never changes its condition.",
          fix: "Update the variable inside the loop, or use a break on a clear exit condition.",
        },
        {
          mistake: "Using range(len(items)) just to read items.",
          fix: "Loop over the items directly, or use enumerate when you need the index.",
        },
        {
          mistake: "Misreading the loop else as 'when the loop is empty'.",
          fix: "It runs when the loop ends without break.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Searching a list",
      scenario:
        "You need to find the first negative number in a list and report if there is none.",
      body: [
        "Loop over the numbers; on the first negative, print it and `break`. Put an `else` on the loop to print 'no negatives', which runs only when no break happened.",
        "This avoids a separate 'found' flag variable.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "range-output",
      prompt: "What does this print?",
      code: { language: "python", code: "print(list(range(2, 10, 3)))" },
      options: ["[2, 5, 8]", "[2, 5, 8, 10]", "[3, 6, 9]"],
      answer: 0,
      explanation:
        "range stops before 10 and steps by 3: 2, 5, 8.",
    },
    {
      type: "output",
      id: "for-else-output",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "for n in [2, 3, 4]:\n    if n == 9:\n        break\nelse:\n    print(\"no break\")",
      },
      options: ["no break", "Nothing", "An error"],
      answer: 0,
      explanation:
        "The loop never hit break, so its else block runs.",
    },
    {
      type: "single",
      id: "zip-length",
      prompt: "How many pairs does list(zip([1, 2, 3], \"ab\")) contain?",
      options: ["2", "3", "5"],
      answer: 0,
      explanation:
        "zip stops at the shortest input, which has two items.",
    },
    {
      type: "truefalse",
      id: "continue-meaning",
      statement: "continue skips the rest of the current iteration and moves to the next one.",
      answer: true,
      explanation:
        "continue jumps to the next iteration, while break leaves the loop.",
    },
  ],
  assignment: {
    title: "A small number game",
    task: [
      "Write a program that picks a fixed secret number, then loops over a list of guesses and prints 'too low', 'too high' or 'correct' for each, stopping at the first correct guess.",
      "Use enumerate to print the guess number and a loop else to report 'not found' when none matched.",
    ],
    checklist: [
      "if/elif/else gives the three outcomes",
      "The loop stops with break on a correct guess",
      "enumerate numbers the guesses from 1",
      "The loop else reports when nothing matched",
    ],
    hints: ["Put the else at the same indent as the for."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "fizz-labels",
      title: "Label numbers",
      task: [
        "Write labels(n) that returns a list for the numbers 1 to n: 'fizz' for multiples of 3, 'buzz' for multiples of 5, 'fizzbuzz' for both, and the number as a string otherwise.",
      ],
      language: "python",
      starter: "def labels(n):\n    pass",
      solution:
        "def labels(n):\n    out = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            out.append('fizzbuzz')\n        elif i % 3 == 0:\n            out.append('fizz')\n        elif i % 5 == 0:\n            out.append('buzz')\n        else:\n            out.append(str(i))\n    return out",
      hints: ["Test the 'both' case first."],
      checklist: [
        "labels(5) is ['1', '2', 'fizz', '4', 'buzz']",
        "15 gives 'fizzbuzz'",
        "range includes n",
      ],
    },
  ],
  revisionNotes: [
    "Indentation defines blocks; a colon starts one",
    "range stops before the stop value; enumerate gives index and item; zip stops at the shortest",
    "break leaves, continue skips, loop else runs when no break happened",
    "match with literal, capture, guard and wildcard patterns (3.10+)",
  ],
  resources: [
    {
      label: "The Python Tutorial: More control flow tools",
      url: "https://docs.python.org/3/tutorial/controlflow.html",
    },
    {
      label: "The Python Tutorial: Looping techniques",
      url: "https://docs.python.org/3/tutorial/datastructures.html#looping-techniques",
    },
  ],
})
