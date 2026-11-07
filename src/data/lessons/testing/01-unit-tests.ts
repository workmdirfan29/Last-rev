import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "unit-tests",
  title: "Unit tests",
  topic: "Unit tests",
  minutes: 75,
  overview:
    "Write fast, isolated unit tests: the Arrange-Act-Assert pattern, good names, boundary cases, table-driven tests with it.each, matchers such as toBe, toEqual and toThrow, and what code coverage does and does not tell you.",
  objectives: [
    "Define a unit test and the qualities of a good one",
    "Structure tests with Arrange, Act, Assert",
    "Test boundaries and error cases and write table-driven tests",
    "Choose the right matcher and read a failure message",
    "Explain what coverage measures",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What a unit test is",
      body: [
        "A **unit test** checks one small piece of behaviour (a function, a method, a class) in isolation, without a database, a network or a file system. It runs in milliseconds, so you can run thousands of them after every change. The result is simple: it passes or it fails.",
        "Good tests are **F.I.R.S.T.**: *Fast*, *Isolated* (independent of other tests and of their order), *Repeatable* (same result every run, on every machine), *Self-validating* (they pass or fail by themselves, with no manual reading of output) and *Timely* (written close to the code, ideally before it). The examples use JavaScript with Vitest; the ideas are the same in JUnit (Java) or pytest (Python).",
      ],
    },
    {
      kind: "diagram",
      heading: "The same ideas in other tools",
      diagram: {
        kind: "table",
        title: "Unit-test vocabulary",
        headers: [
          "Idea",
          "Vitest (JavaScript)",
          "JUnit 5 (Java)",
          "pytest (Python)",
        ],
        rows: [
          [
            "A test",
            'it("...", () => {})',
            "@Test void name()",
            "def test_name():",
          ],
          [
            "Assertion",
            "expect(a).toBe(b)",
            "assertEquals(b, a)",
            "assert a == b",
          ],
          [
            "Group of tests",
            'describe("...", ...)',
            "a test class",
            "a test file or class",
          ],
          [
            "Expected error",
            "expect(fn).toThrow()",
            "assertThrows(...)",
            "pytest.raises(...)",
          ],
          ["Run all tests", "vitest run", "the build tool or IDE", "pytest"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Arrange, Act, Assert",
      example: {
        title: "A first unit test",
        language: "javascript",
        code: 'import { describe, it, expect } from "vitest"\n\nfunction applyDiscount(price, percent) {\n  if (price < 0) throw new RangeError("price must not be negative")\n  if (percent < 0 || percent > 100) throw new RangeError("percent must be between 0 and 100")\n  return price - (price * percent) / 100\n}\n\ndescribe("applyDiscount", () => {\n  it("takes a percentage off the price", () => {\n    // Arrange\n    const price = 200\n    // Act\n    const result = applyDiscount(price, 25)\n    // Assert\n    expect(result).toBe(150)\n  })\n\n  it("returns the same price for a 0 percent discount", () => {\n    expect(applyDiscount(80, 0)).toBe(80)\n  })\n\n  it("returns 0 for a 100 percent discount", () => {\n    expect(applyDiscount(80, 100)).toBe(0)\n  })\n\n  it("rejects a negative price", () => {\n    expect(() => applyDiscount(-1, 10)).toThrow("price must not be negative")\n  })\n\n  it("rejects a percent above 100", () => {\n    expect(() => applyDiscount(10, 101)).toThrow(RangeError)\n  })\n})',
        walkthrough: [
          "Each test follows **Arrange** (set up the input), **Act** (call the code under test) and **Assert** (check the result). Keep the three parts visible; in tiny tests the comments can be dropped.",
          "A test name should say the behaviour and the situation: `takes a percentage off the price`. When a test fails, the name should tell you what broke without opening the file.",
          "The tests cover the normal case (25 percent), the **boundaries** (0 and 100 percent) and the **error cases** (negative price, percent above 100). Bugs cluster at boundaries.",
          "To test an exception, wrap the call in a function (`() => applyDiscount(-1, 10)`) and use `toThrow`; calling it directly would throw inside the test before `expect` runs. `toThrow` accepts a message string or an error class.",
          "Run with `npx vitest run`. All five tests pass.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Table-driven tests and matchers",
      example: {
        title: "it.each, toBe versus toEqual, toBeCloseTo",
        language: "javascript",
        code: 'import { describe, it, expect } from "vitest"\n\nconst isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0\n\ndescribe("isLeapYear", () => {\n  it.each([\n    [2024, true],\n    [2023, false],\n    [1900, false],\n    [2000, true],\n  ])("isLeapYear(%i) is %s", (year, expected) => {\n    expect(isLeapYear(year)).toBe(expected)\n  })\n})\n\ndescribe("matchers", () => {\n  it("compares objects by value with toEqual", () => {\n    expect({ id: 1, tags: ["a"] }).toEqual({ id: 1, tags: ["a"] })\n  })\n\n  it("toBe checks identity, so two equal objects are not toBe", () => {\n    expect({ id: 1 }).not.toBe({ id: 1 })\n  })\n\n  it("compares floats with toBeCloseTo", () => {\n    expect(0.1 + 0.2).toBeCloseTo(0.3)\n  })\n})',
        walkthrough: [
          "`it.each` runs the same test body once per row of data. The `%i` and `%s` placeholders put the values in the test names, so each row reports separately: `isLeapYear(1900) is false`. Table-driven tests keep many cases short and readable.",
          "`toBe` uses `Object.is`: for objects it checks that both sides are the **same object**. Use `toEqual` to compare structure and values. That is why `expect({ id: 1 }).not.toBe({ id: 1 })` passes.",
          "Floating-point numbers are approximate (`0.1 + 0.2` is `0.30000000000000004`), so use `toBeCloseTo` instead of `toBe`.",
          "Other matchers you will use: `toBeTruthy`, `toBeNull`, `toContain`, `toHaveLength`, `toMatchObject`, `toThrow` and `not` to negate any of them.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Good practice and coverage",
      body: [
        "Test **behaviour**, not implementation details: if you rename a private helper, no test should break. Keep each test small and independent, with no loops or conditions inside it (a test with logic needs its own test). Do not share mutable state between tests; build what you need in each test or in a `beforeEach`.",
        "**Code coverage** reports which lines or branches ran during the tests. Low coverage shows untested code, but high coverage does **not** prove the tests are good: a test with no assertion still raises coverage. Use it to find gaps, not as a target to hit at any cost. Treat a failing test as information: read the message (Vitest shows expected and received values) before changing anything.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Tests that depend on each other or on their order.",
          fix: "Make every test independent: create its own data and reset shared state.",
        },
        {
          mistake: "Asserting on private details such as internal calls.",
          fix: "Assert on observable results so refactoring does not break tests.",
        },
        {
          mistake: "One giant test with many unrelated assertions.",
          fix: "Write one test per behaviour so a failure points to the cause.",
        },
        {
          mistake: "Comparing floating-point numbers with toBe.",
          fix: "Use toBeCloseTo.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Testing a validation function",
      scenario:
        "You must test isValidPassword(text): at least 8 characters, one digit, one letter.",
      body: [
        "List the cases first: shortest valid length (8), one below (7), no digit, no letter, empty string, a very long string, unusual characters. Put them in an `it.each` table with the expected result, plus separate tests for invalid input types if the function must reject them.",
        "When a bug is found later, add its input to the table first, watch the test fail, then fix the code.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "what-unit",
      prompt: "What is a unit test?",
      options: [
        "A fast test of one small piece of behaviour in isolation",
        "A test of the whole application in a browser",
        "A manual check by a tester",
      ],
      answer: 0,
      explanation: "Unit tests are small, fast and isolated.",
    },
    {
      type: "output",
      id: "tobe-objects",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log(Object.is({ id: 1 }, { id: 1 }))",
      },
      options: ["false", "true", "undefined"],
      answer: 0,
      explanation:
        "toBe uses Object.is; two different objects are not the same object, even with equal contents.",
    },
    {
      type: "output",
      id: "float-sum",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "console.log(0.1 + 0.2 === 0.3)",
      },
      options: ["false", "true", "NaN"],
      answer: 0,
      explanation:
        "Floating-point sums are approximate, so use toBeCloseTo in tests.",
    },
    {
      type: "truefalse",
      id: "coverage-proof",
      statement: "100 percent code coverage proves the tests are good.",
      answer: false,
      explanation:
        "Coverage shows which lines ran, not whether the assertions are meaningful.",
    },
  ],
  assignment: {
    title: "Test a small module",
    task: [
      "Write a function slugify(text) (lower-case, trim, replace runs of spaces and punctuation with a single hyphen) and a Vitest file for it with at least ten cases, using it.each, boundaries and one error case (not a string).",
      "Run the tests, then change the function so one test fails on purpose, read the failure message and fix it again.",
    ],
    checklist: [
      "Tests use Arrange, Act, Assert",
      "A table-driven test covers many inputs",
      "Boundaries and errors are tested",
      "I read a real failure message and fixed it",
    ],
    hints: ["npx vitest run --reporter=verbose lists every test."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "leap-year-fn",
      title: "Make the tests pass",
      task: [
        "Write isLeapYear(year) so these tests pass: 2024 is true, 2023 is false, 1900 is false, 2000 is true.",
      ],
      language: "javascript",
      starter: "function isLeapYear(year) {\n}",
      solution:
        "function isLeapYear(year) {\n  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0\n}",
      hints: ["Divisible by 4, except centuries, unless divisible by 400."],
      checklist: [
        "Years divisible by 4 are leap years",
        "Centuries are not, unless divisible by 400",
      ],
      run: {
        entry: "isLeapYear",
        cases: [
          {
            name: "2024",
            args: [2024],
            expected: true,
          },
          {
            name: "2023",
            args: [2023],
            expected: false,
          },
          {
            name: "1900",
            args: [1900],
            expected: false,
          },
          {
            name: "2000",
            args: [2000],
            expected: true,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Unit test: small, fast, isolated; F.I.R.S.T.",
    "Arrange, Act, Assert; name tests by behaviour",
    "Test boundaries and errors; it.each for tables",
    "toBe = identity, toEqual = value, toBeCloseTo for floats, toThrow for errors",
    "Coverage finds gaps; it does not prove quality",
  ],
  resources: [
    {
      label: "Vitest: Getting started",
      url: "https://vitest.dev/guide/",
    },
    {
      label: "Vitest: expect API",
      url: "https://vitest.dev/api/expect",
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
