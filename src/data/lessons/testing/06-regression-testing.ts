import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "regression-testing",
  title: "Regression testing",
  topic: "Regression testing",
  minutes: 45,
  overview:
    "Protect working features from breaking when code changes: regression suites, writing a failing test for each bug before fixing it, choosing and automating tests in CI, and handling flaky tests.",
  objectives: [
    "Define a regression and regression testing",
    "Reproduce a bug with a failing test, then fix it",
    "Build and prioritise a regression suite and run it in CI",
    "Tell smoke, sanity and regression tests apart",
    "Deal with flaky tests",
  ],
  prerequisites: ["lesson.testing.unit-tests"],
  sections: [
    {
      kind: "explain",
      heading: "What a regression is",
      body: [
        "A **regression** is a defect in something that used to work, usually caused by a change elsewhere: a new feature, a bug fix, a refactoring, a library upgrade. **Regression testing** re-runs existing tests after a change to confirm that previous behaviour still works. The set of tests you keep for this is the **regression suite**.",
        "Manual regression testing becomes impossible as the product grows, so it must be **automated**: unit, integration and a few end-to-end tests run on every change in continuous integration (CI), and a failing build blocks the merge.",
      ],
    },
    {
      kind: "diagram",
      heading: "Related kinds of testing",
      diagram: {
        kind: "table",
        title: "Smoke, sanity and regression",
        headers: ["Kind", "Question it answers", "Scope"],
        rows: [
          [
            "Smoke test",
            "Does the build start and do the most basic things work?",
            "Very small and fast; run first",
          ],
          [
            "Sanity test",
            "Does the specific change or fix work as expected?",
            "Narrow, after a small change",
          ],
          [
            "Regression test",
            "Did the change break anything that worked before?",
            "Broad; the full automated suite",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "Every bug becomes a test",
      example: {
        title: "Failing test first, then the fix",
        language: "javascript",
        code: 'import { describe, expect, it } from "vitest"\n\n// Bug report: average([]) returns NaN and the dashboard shows "NaN%".\nfunction average(values) {\n  return values.reduce((sum, v) => sum + v, 0) / values.length\n}\n\ndescribe("average", () => {\n  it("averages a list of numbers", () => {\n    expect(average([2, 4, 6])).toBe(4)\n  })\n\n  it("returns 0 for an empty list (regression: was NaN)", () => {\n    expect(average([])).toBe(0)\n  })\n})',
        walkthrough: [
          "The first test describes behaviour that always worked. The second one reproduces the bug report: it **fails** with `expected NaN to be +0`, which proves the test catches the defect. This is the red step.",
          "Then fix the code, for example `if (values.length === 0) return 0`. Both tests pass and the second one stays in the suite for ever.",
          "From now on, if anyone changes `average` and brings the bug back, the build fails immediately. A bug that has a test cannot silently return.",
        ],
      },
    },
    {
      kind: "code",
      heading: "After the fix",
      example: {
        title: "The same tests, now green",
        language: "javascript",
        code: 'import { describe, expect, it } from "vitest"\n\nfunction average(values) {\n  if (values.length === 0) return 0\n  return values.reduce((sum, v) => sum + v, 0) / values.length\n}\n\ndescribe("average", () => {\n  it("averages a list of numbers", () => {\n    expect(average([2, 4, 6])).toBe(4)\n  })\n\n  it("returns 0 for an empty list (regression: was NaN)", () => {\n    expect(average([])).toBe(0)\n  })\n})',
        walkthrough: [
          "With the guard clause, both tests pass.",
          "Keep the name of the test descriptive and, if you use a tracker, mention the ticket number in the test name or a comment, so the reason for the test is never lost.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Managing a regression suite",
      body: [
        "Run the **fast** tests (unit, smoke) on every commit and the full suite before merging or releasing. When the suite grows too slow, run it in parallel, split it and **prioritise** tests by risk: critical user journeys and areas that change often come first. Remove tests that are obsolete or duplicate, and keep the tests as maintainable as production code.",
        "**Flaky tests** pass and fail without any code change, usually because of timing, shared state, random data or an unreliable external service. They destroy trust: people stop believing failures. Fix the cause (wait for conditions instead of sleeping, isolate data, fake time and network) or quarantine the test quickly and track it. Never just re-run until it is green. Visual regression tests (for example Playwright's `toHaveScreenshot`) compare screenshots to catch unintended UI changes.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Fixing a bug without adding a test.",
          fix: "Write the failing test first; it is the cheapest long-term protection.",
        },
        {
          mistake: "Ignoring flaky tests.",
          fix: "Fix or quarantine them at once; a flaky suite is not trusted.",
        },
        {
          mistake: "Running the whole suite only before release.",
          fix: "Run fast checks on every commit and the full suite in CI on every merge request.",
        },
        {
          mistake: "Keeping a huge suite that nobody maintains.",
          fix: "Prune, prioritise and refactor tests like code.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A release with a safety net",
      scenario: "The team ships weekly and a library upgrade is planned.",
      body: [
        "Before the upgrade, run the full regression suite to confirm a green baseline. Upgrade the library, run the suite again, and investigate each failure: it either exposes a real incompatibility or a test that was too tightly coupled to old behaviour. After the release, any production bug gets a test before the fix.",
        "A smoke test run against production right after deployment confirms that the basics work.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "regression-def",
      prompt: "What is a regression?",
      options: [
        "A defect in something that used to work",
        "A new feature",
        "A slow test",
      ],
      answer: 0,
      explanation:
        "Regressions are previously working behaviour that broke after a change.",
    },
    {
      type: "single",
      id: "bug-test-order",
      prompt: "What should you do first when a bug is reported?",
      options: [
        "Write a failing test that reproduces it",
        "Fix the code immediately",
        "Delete the related tests",
      ],
      answer: 0,
      explanation:
        "A test written first proves the bug exists and later that it is fixed.",
    },
    {
      type: "single",
      id: "smoke-meaning",
      prompt: "A smoke test checks...",
      options: [
        "That the most basic functions work after a build",
        "Every edge case",
        "Only the user interface colours",
      ],
      answer: 0,
      explanation:
        "Smoke tests are quick checks that the build is not obviously broken.",
    },
    {
      type: "truefalse",
      id: "flaky-rerun",
      statement:
        "The right response to a flaky test is to re-run the build until it passes.",
      answer: false,
      explanation:
        "Find and fix the cause, or quarantine the test; re-running hides the problem.",
    },
  ],
  assignment: {
    title: "Regression kit",
    task: [
      "Choose a function you wrote earlier, introduce (or find) a bug in it, and write the failing test first, then fix and confirm it passes.",
      "Write a short test strategy for a small product: which tests run on every commit, which on merge, which before release, and how flaky tests are handled.",
    ],
    checklist: [
      "The test failed before the fix",
      "The test name explains the bug",
      "The strategy separates fast and full runs",
      "Flaky tests have a policy",
    ],
    hints: ["Name tests after the behaviour, not the ticket alone."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "safe-divide",
      title: "Fix the regression",
      task: [
        "Write safeDivide(a, b) that returns a / b, but returns 0 when b is 0 (the old bug returned Infinity).",
      ],
      language: "javascript",
      starter: "function safeDivide(a, b) {\n}",
      solution:
        "function safeDivide(a, b) {\n  if (b === 0) return 0\n  return a / b\n}",
      hints: ["Check for zero before dividing."],
      checklist: ["Normal division still works", "Division by zero returns 0"],
      run: {
        entry: "safeDivide",
        cases: [
          {
            name: "normal",
            args: [10, 2],
            expected: 5,
          },
          {
            name: "fraction",
            args: [1, 4],
            expected: 0.25,
          },
          {
            name: "zero divisor",
            args: [5, 0],
            expected: 0,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Regression = something that worked now breaks; regression suite re-checks it",
    "Reproduce each bug with a failing test, then fix",
    "Smoke (basic), sanity (this change), regression (everything)",
    "Automate in CI, prioritise by risk, fix flaky tests",
  ],
  resources: [
    {
      label: "Vitest: Getting started",
      url: "https://vitest.dev/guide/",
    },
    {
      label: "Playwright: Best practices",
      url: "https://playwright.dev/docs/best-practices",
    },
    {
      label: "Playwright: Visual comparisons",
      url: "https://playwright.dev/docs/test-snapshots",
    },
  ],
})
