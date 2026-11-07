import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "tdd",
  title: "Test-driven development",
  topic: "TDD",
  minutes: 60,
  overview:
    "Practise red-green-refactor: write a failing test first, make it pass with the simplest code, then clean up. Build a small string calculator step by step.",
  objectives: [
    "Describe the red, green, refactor cycle",
    "Write the smallest failing test and the simplest code to pass it",
    "Refactor safely with passing tests",
    "Explain benefits and limits of TDD",
  ],
  prerequisites: ["lesson.testing.unit-tests"],
  sections: [
    {
      kind: "explain",
      heading: "The cycle",
      body: [
        "**Test-driven development (TDD)** reverses the usual order. You write a test for behaviour that does not exist yet, see it **fail**, write just enough code to make it **pass**, and then improve the code while the tests protect you. The loop is called **red, green, refactor**.",
        "**Red**: write one small failing test; watch it fail for the right reason (a test that never failed proves nothing). **Green**: write the simplest code that passes, even if it looks silly. **Refactor**: remove duplication and improve names with all tests green. Then pick the next small behaviour. Each loop takes a few minutes.",
      ],
    },
    {
      kind: "diagram",
      heading: "Red, green, refactor",
      diagram: {
        kind: "flow",
        title: "One turn of the loop",
        steps: [
          {
            label: "Red",
            detail: "Write a failing test for the next small behaviour",
          },
          {
            label: "Green",
            detail: "Make it pass with the simplest possible code",
          },
          {
            label: "Refactor",
            detail:
              "Clean up the code and the tests; run them after every change",
          },
          {
            label: "Repeat",
            detail:
              "Choose the next behaviour, starting with the simplest cases",
          },
        ],
      },
    },
    {
      kind: "code",
      heading: "Step 1: the first red test",
      example: {
        title: "A test for code that does not exist yet",
        language: "javascript",
        code: 'import { expect, it } from "vitest"\n\nfunction add(numbers) {}\n\nit("returns 0 for an empty string", () => {\n  expect(add("")).toBe(0)\n})',
        walkthrough: [
          'The kata is a string calculator: `add("1,2")` returns `3`. We start with the simplest case, the empty string, and an empty function.',
          "The test fails (**red**) because `add` returns `undefined`, not `0`. Read the failure message: it says what was expected and what was received. Failing for the right reason is part of the process.",
          "Only now do we write code: the simplest thing that passes is `return 0`. That looks too easy, which is the point; the next tests will force a real implementation.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Steps 2 to 5: grow the behaviour",
      example: {
        title: "Each new test forces a little more code",
        language: "javascript",
        code: 'import { describe, expect, it } from "vitest"\n\nfunction add(numbers) {\n  if (numbers === "") return 0\n  return numbers\n    .split(/[,\\n]/)\n    .map(Number)\n    .reduce((sum, n) => sum + n, 0)\n}\n\ndescribe("add", () => {\n  it("returns 0 for an empty string", () => {\n    expect(add("")).toBe(0)\n  })\n  it("returns the number itself for a single number", () => {\n    expect(add("7")).toBe(7)\n  })\n  it("adds two numbers separated by a comma", () => {\n    expect(add("1,2")).toBe(3)\n  })\n  it("adds any amount of numbers", () => {\n    expect(add("1,2,3,4")).toBe(10)\n  })\n  it("accepts new lines as separators too", () => {\n    expect(add("1\\n2,3")).toBe(6)\n  })\n})',
        walkthrough: [
          'Each test was written first and watched failing: a single number (`"7"`), two numbers, many numbers and new lines as separators. After each one, the simplest change made it pass.',
          'The first version after `return 0` might be `return Number(numbers)`, which handles one number. The test for `"1,2"` then fails and forces `split(",")`. The next ones force `reduce` and the regular expression for both separators.',
          "In the **refactor** step we replaced a loop with `map` and `reduce` and named things clearly. With all tests green, we could change the structure without fear: if something breaks, a test says so at once.",
          "The next red tests would be negative numbers (throw an error that lists them), ignoring numbers above 1000 and custom delimiters. Each one is added the same way.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Why and when",
      body: [
        "TDD gives you a **safety net** of tests, pushes you to design code that is easy to test (small functions with injected dependencies), keeps the work in small steps and documents the behaviour with examples. It does not replace thinking: you still choose good cases, including edge cases and errors.",
        "It works best for logic with clear rules (calculations, parsing, validation, business rules). It is less natural for exploring a new idea or for visual layout, where you may write the test after the first sketch. Tests written after the code are still valuable; what matters most is that the tests exist, are fast and are trusted.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing many tests before any code.",
          fix: "Write one failing test, make it pass, then the next.",
        },
        {
          mistake: "Never watching the test fail.",
          fix: "A test that has never failed may check nothing. Run it red first.",
        },
        {
          mistake: "Writing more code than the test needs.",
          fix: "Do the simplest thing; let the next test force the next step.",
        },
        {
          mistake: "Skipping the refactor step.",
          fix: "Clean up while the tests are green, or the code decays.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A password rule",
      scenario:
        "Business asks: a password needs at least 8 characters, a digit and a letter.",
      body: [
        "Start with the simplest failing test (`short` is rejected), make it pass, then add the digit rule, then the letter rule, refactoring after each. The list of tests becomes a readable specification of the rule, and later changes (a new rule) start with a new failing test.",
        "Tests that describe behaviour in plain language double as documentation.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "red-meaning",
      prompt: "In TDD, what does the red step mean?",
      options: [
        "Write a test and see it fail",
        "Delete the failing code",
        "Refactor the tests",
      ],
      answer: 0,
      explanation: "Red is the failing test that describes the next behaviour.",
    },
    {
      type: "single",
      id: "simplest",
      prompt: "After a failing test, what should you write?",
      options: [
        "The simplest code that makes it pass",
        "The complete final implementation",
        "Documentation",
      ],
      answer: 0,
      explanation: "Do the simplest thing; the next test will force more.",
    },
    {
      type: "single",
      id: "refactor-when",
      prompt: "When do you refactor in TDD?",
      options: ["When all tests are green", "While tests are red", "Never"],
      answer: 0,
      explanation: "Refactor under the protection of passing tests.",
    },
    {
      type: "truefalse",
      id: "never-failed",
      statement:
        "A test that you have never seen fail can still be trusted completely.",
      answer: false,
      explanation:
        "It might check nothing. Seeing it fail first proves it can detect the problem.",
    },
  ],
  assignment: {
    title: "Kata: FizzBuzz by TDD",
    task: [
      "Implement fizzBuzz(n) (3 gives Fizz, 5 gives Buzz, 15 gives FizzBuzz, others the number as a string) using red-green-refactor. Commit after each green step (or note the step).",
      "List the sequence of tests you wrote and what each one forced you to add.",
    ],
    checklist: [
      "Every test was seen failing before the code was written",
      "Steps were small",
      "A refactoring step was done with all tests green",
      "The test list reads like a specification",
    ],
    hints: ['Start with 1 returns "1".'],
    minutes: 30,
  },
  exercises: [
    {
      slug: "string-sum",
      title: "Make the tests pass",
      task: [
        "Write add(numbers) for the string calculator: an empty string gives 0; otherwise sum the numbers separated by commas or new lines.",
      ],
      language: "javascript",
      starter: "function add(numbers) {\n}",
      solution:
        'function add(numbers) {\n  if (numbers === "") return 0\n  return numbers.split(/[,\\n]/).map(Number).reduce((sum, n) => sum + n, 0)\n}',
      hints: ["Split with a regular expression for both separators."],
      checklist: [
        "Empty string gives 0",
        "Commas and new lines both separate numbers",
      ],
      run: {
        entry: "add",
        cases: [
          {
            name: "empty",
            args: [""],
            expected: 0,
          },
          {
            name: "one",
            args: ["7"],
            expected: 7,
          },
          {
            name: "two",
            args: ["1,2"],
            expected: 3,
          },
          {
            name: "newline",
            args: ["1\n2,3"],
            expected: 6,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Red: failing test; Green: simplest passing code; Refactor: clean up with tests green",
    "Small steps; watch each test fail first",
    "Simplest cases first; let tests force the design",
    "TDD fits rules-based logic best",
  ],
  resources: [
    {
      label: "Vitest: Getting started",
      url: "https://vitest.dev/guide/",
    },
    {
      label: "Vitest: Test API",
      url: "https://vitest.dev/api/test",
    },
    {
      label: "JUnit 5 user guide",
      url: "https://junit.org/junit5/docs/current/user-guide/",
    },
    {
      label: "pytest: Get started",
      url: "https://docs.pytest.org/en/stable/getting-started.html",
    },
  ],
})
