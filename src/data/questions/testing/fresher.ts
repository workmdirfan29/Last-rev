import { defineQuestions } from "../author"
import { q } from "../compact"

const WD = "https://web.dev/learn/testing/get-started"
const MSU =
  "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices"
const PW = "https://playwright.dev/docs"
const PM = "https://learning.postman.com/docs"
const J = "https://jestjs.io/docs"

export default defineQuestions("testing", "fresher", [
  q({
    slug: "why-test-software",
    topic: "Unit tests",
    d: "easy",
    title: "Why do we write automated tests?",
    kw: [
      "automated testing",
      "regression",
      "confidence",
      "refactoring",
      "documentation",
    ],
    intent:
      "A foundation question: checks you see tests as engineering value, not a chore.",
    short:
      "Automated tests check that code behaves as intended, every time, in seconds. They catch regressions, where a change breaks something that worked, give you the confidence to refactor, act as executable documentation of expected behaviour, and make reviews and releases safer. Compared with manual functional testing, which is slow and repeated for every change, a suite of tests can run after every build in CI. Tests do not prove the absence of bugs, and badly written tests can be brittle and costly, so they should be readable, reliable and focused on behaviour.",
    detail: [
      "Fast feedback is the main benefit: bugs found minutes after writing are cheap to fix.",
      "Tests also guide design, since hard-to-test code is often too tightly coupled.",
      "The cost is writing and maintaining them, so aim tests where risk is highest.",
    ],
    ex: "A pricing function with a dozen tests can be refactored without fear because the tests flag any change in results.",
    mistakes: [
      "Writing tests only for coverage numbers.",
      "Tests that break whenever internals change.",
    ],
    follow: ["What is a regression?"],
    points: [
      "Catch regressions",
      "Enable safe refactoring",
      "Executable documentation",
      "Fast repeatable feedback",
    ],
    notes: ["Tests buy confidence."],
    src: [
      ["Microsoft Learn: Unit testing best practices", MSU],
      ["web.dev: What testing is", `${WD}/what-testing-is`],
    ],
  }),
  q({
    slug: "unit-test-characteristics-aaa",
    topic: "Unit tests",
    d: "easy",
    title:
      "What makes a good unit test, and what is the arrange-act-assert pattern?",
    kw: [
      "unit test",
      "arrange act assert",
      "fast isolated",
      "naming",
      "single behaviour",
    ],
    intent: "Checks you can structure a clear unit test.",
    short:
      "A good unit test is fast, isolated from other tests and from slow dependencies like networks and databases, repeatable with the same result every time, and self-checking, so it passes or fails without human inspection. It checks one behaviour and has a name that states the scenario and expected result. The arrange-act-assert pattern structures it: arrange the inputs and objects, act by calling the code under test, then assert the outcome. Keeping these sections visible makes tests readable, and avoiding logic such as loops and conditionals inside tests keeps them trustworthy.",
    detail: [
      "A unit is a small piece of code, such as a function or a class.",
      "Test public behaviour rather than private implementation details.",
      "Do not share mutable state between tests.",
    ],
    ex: "`sum([1,2,3])` is called and the test asserts the result is 6.",
    code: [
      [
        "Arrange, act, assert",
        "js",
        `test("adds the VAT to the price", () => {\n  // arrange\n  const price = 1000\n  // act\n  const total = withVat(price, 0.18)\n  // assert\n  expect(total).toBe(1180)\n})`,
        [
          "Arrange sets inputs.",
          "Act calls the code.",
          "Assert checks the result.",
        ],
      ],
    ],
    mistakes: [
      "Several unrelated assertions in one test.",
      "Tests that depend on execution order.",
    ],
    follow: ["Why should tests be isolated?"],
    points: [
      "Fast, isolated, repeatable, self-checking",
      "One behaviour per test",
      "Arrange, act, assert",
      "Test behaviour, not internals",
    ],
    notes: ["Arrange, act, assert."],
    src: [
      ["Microsoft Learn: Unit testing best practices", MSU],
      ["web.dev: Test types", `${WD}/test-types`],
    ],
  }),
  q({
    slug: "test-pyramid-and-types",
    topic: "Unit tests",
    d: "medium",
    title:
      "What is the testing pyramid, and how do unit, integration and end-to-end tests differ?",
    kw: [
      "testing pyramid",
      "unit tests",
      "integration tests",
      "e2e tests",
      "test strategy",
    ],
    intent: "Checks you can balance different test levels.",
    short:
      "The testing pyramid is a model suggesting many small, fast tests at the base, fewer integration tests in the middle, and few slow end-to-end tests at the top. Unit tests check small pieces in isolation and are quick. Integration tests check that several parts work together, for example a service with its real database. End-to-end tests drive the whole application through its user interface or public API in an environment close to production; they give the most realistic confidence but are slower, more brittle and harder to debug. The names have no strict definitions, so agree on yours and pick the cheapest level that gives the confidence you need.",
    detail: [
      "The web.dev testing course notes that test types do not have rigorous definitions and strategy can take many shapes.",
      "Too many end-to-end tests make suites slow and flaky.",
      "Too few integration tests miss wiring problems.",
    ],
    ex: "A shop has hundreds of unit tests, dozens of API integration tests and a handful of E2E tests for checkout.",
    mistakes: [
      "Only E2E tests, giving slow feedback.",
      "Only unit tests, missing integration failures.",
    ],
    follow: ["What does an integration test cover?"],
    points: [
      "Many unit, fewer integration, few E2E",
      "Unit: isolated and fast",
      "Integration: parts together",
      "E2E: whole system, slowest",
    ],
    notes: ["Cheapest test that gives confidence."],
    src: [
      ["web.dev: Test types", `${WD}/test-types`],
      ["web.dev: What to test", `${WD}/what-to-test`],
    ],
  }),
  q({
    slug: "what-to-test-and-coverage",
    topic: "Unit tests",
    d: "medium",
    title:
      "How do you decide what to test, and what does code coverage tell you?",
    kw: [
      "what to test",
      "code coverage",
      "risk-based testing",
      "edge cases",
      "coverage limits",
    ],
    intent: "Checks you prioritise tests sensibly.",
    short:
      "Focus on behaviour that matters and risks that hurt: core business logic, calculations, boundaries and edge cases (empty, zero, null, maximum), error handling, security-relevant rules and code that has broken before. Trivial code and third-party libraries need less. Code coverage reports which lines or branches the tests executed, which is useful for finding untested areas, but it does not show that the assertions are meaningful; high coverage with weak assertions gives false comfort. Use coverage to find gaps, not as a target to maximise, and prefer mutation of requirements into test cases.",
    detail: [
      "Branch coverage reveals untested `if` paths.",
      "Test the contract, not private details, so refactoring stays cheap.",
      "A bug found in production deserves a new test.",
    ],
    ex: "A discount function is tested with no discount, exact boundary, above boundary and invalid input.",
    mistakes: [
      "Chasing 100 percent coverage.",
      "Testing implementation details.",
    ],
    follow: ["What does coverage not tell you?"],
    points: [
      "Test risk and behaviour",
      "Cover edge cases and errors",
      "Coverage finds gaps, not quality",
      "Add a test for every escaped bug",
    ],
    notes: ["Coverage is a flashlight, not a goal."],
    src: [
      ["web.dev: What to test", `${WD}/what-to-test`],
      ["Vitest: Coverage", "https://vitest.dev/guide/coverage"],
    ],
  }),
  q({
    slug: "integration-testing-basics",
    topic: "Integration tests",
    d: "medium",
    title: "What is integration testing and how do you do it for an API?",
    kw: [
      "integration test",
      "supertest",
      "test database",
      "api tests",
      "real dependencies",
    ],
    intent: "Checks you can test components working together.",
    short:
      "An integration test exercises several parts together, such as a route handler, validation, business logic and a real test database, to catch wiring and configuration problems that unit tests miss. For an HTTP API, start the app (or use a test client such as Supertest for Express), send real requests to it and assert on status codes and response bodies, with a separate test database that is created and reset for each run or test. Use real components where it matters and test doubles only for external services you do not control, like payment gateways. These tests are slower, so keep them focused on key flows.",
    detail: [
      "Run migrations against the test database before the suite.",
      "Clean up or use transactions so tests do not depend on each other's data.",
      "Containers (Docker) are a convenient way to run a real database in CI.",
    ],
    ex: "A test posts a new user to the API and then reads it back, with a real PostgreSQL instance behind it.",
    code: [
      [
        "An API integration test",
        "js",
        `import request from "supertest"\nimport { app } from "./app.js"\n\ntest("creates and returns a user", async () => {\n  const created = await request(app).post("/users").send({ name: "Asha" })\n  expect(created.status).toBe(201)\n\n  const res = await request(app).get(\`/users/\${created.body.id}\`)\n  expect(res.body.name).toBe("Asha")\n})`,
        [
          "Requests go through the real app.",
          "Assertions check status and body.",
        ],
      ],
    ],
    mistakes: [
      "Sharing mutable data between tests.",
      "Testing against a production database.",
    ],
    follow: ["When do you mock in an integration test?"],
    points: [
      "Several parts together",
      "Real HTTP requests and test DB",
      "Reset data between tests",
      "Mock only external services",
    ],
    notes: ["Real wiring, fake externals."],
    src: [
      ["web.dev: Test types (integration)", `${WD}/test-types`],
      ["Node.js: Test runner", "https://nodejs.org/api/test.html"],
    ],
  }),
  q({
    slug: "test-data-and-isolation",
    topic: "Integration tests",
    d: "medium",
    title: "How do you keep tests independent and avoid flaky tests?",
    kw: [
      "flaky tests",
      "test isolation",
      "test data",
      "timing issues",
      "deterministic",
    ],
    intent: "Checks you can make a suite reliable.",
    short:
      "A flaky test passes and fails without code changes, which destroys trust in the suite. Common causes are shared state or leftover data between tests, dependence on execution order, real time and randomness, uncontrolled network calls, race conditions and fixed sleeps. Make tests deterministic: build fresh data in each test, reset or roll back the database, control time with fake timers or injected clocks, seed random numbers, mock external services, and wait for conditions instead of sleeping. Quarantine and fix flaky tests promptly, and run the suite in random order to expose hidden dependencies.",
    detail: [
      "Retries can hide flakiness; use them sparingly and track retried tests.",
      "Parallel tests need separate resources such as ports and databases.",
      "Log enough information to diagnose failures in CI.",
    ],
    ex: "A test that depends on the current date is rewritten to use a fixed, injected date.",
    mistakes: [
      "setTimeout waits in tests.",
      "Tests sharing a database without cleanup.",
    ],
    follow: ["Why are sleeps a bad idea in tests?"],
    points: [
      "Flaky = nondeterministic",
      "Fresh data per test",
      "Control time and randomness",
      "Wait for conditions, not durations",
    ],
    notes: ["Deterministic or deleted."],
    src: [
      ["Playwright: Retries", `${PW}/test-retries`],
      ["Jest: Timer mocks", `${J}/timer-mocks`],
    ],
  }),
  q({
    slug: "test-doubles-mock-stub-spy-fake",
    topic: "Mocking",
    d: "medium",
    title: "What are mocks, stubs, spies and fakes?",
    kw: ["test doubles", "mock", "stub", "spy", "fake"],
    intent: "Checks you know the vocabulary and when to use each.",
    short:
      "Test doubles replace real dependencies in tests. A stub returns canned answers, such as a fixed user record, so the code under test can run. A mock is pre-programmed with expectations about the calls it should receive and fails if they do not happen. A spy wraps a real object and records how it was called while letting the real behaviour run. A fake is a lightweight working implementation, such as an in-memory repository, used instead of a real database. People often call all of these mocks. Use them to isolate slow or unpredictable dependencies, but not so much that the tests no longer check real behaviour.",
    detail: [
      "Jest's `jest.fn()` can act as a stub, mock or spy depending on use.",
      "Mocking what you own too heavily couples tests to implementation.",
      "Mock at the boundary: network, clock, file system, payment gateways.",
    ],
    ex: "A service test uses a fake in-memory repository and a stubbed email sender.",
    mistakes: [
      "Mocking everything, so nothing real is tested.",
      "Asserting on internal call order that does not matter.",
    ],
    follow: ["What is the difference between a stub and a mock?"],
    points: [
      "Stub returns canned data",
      "Mock verifies expected calls",
      "Spy records real calls",
      "Fake is a simple working implementation",
    ],
    notes: ["Replace the boundary, not the logic."],
    src: [
      ["Jest: Mock functions", `${J}/mock-functions`],
      ["web.dev: Test types", `${WD}/test-types`],
    ],
  }),
  q({
    slug: "mocking-http-and-time",
    topic: "Mocking",
    d: "medium",
    title: "How do you mock HTTP calls, the clock and randomness in tests?",
    kw: ["mock fetch", "msw", "fake timers", "date mocking", "seeded random"],
    intent: "Checks you can control the non-deterministic parts.",
    short:
      "Control every external input. For HTTP, intercept requests at the network level with a tool such as Mock Service Worker, or inject a stub client, so tests do not depend on real servers. For time, use fake timers (`jest.useFakeTimers()` or `vi.useFakeTimers()`) and set the system time so that timeouts, debounce and expiry behave predictably and instantly. For randomness and ids, inject the generator or seed it. Remember to restore real timers and clear mocks after each test, so one test cannot leak its fakes into another.",
    detail: [
      "Network-level mocking tests the real request code.",
      "Avoid hard-coding the current date; pass dates in.",
      "Reset mocks in `afterEach` or enable automatic restore in config.",
    ],
    ex: "A test advances fake time by 5 minutes to check that a session expires.",
    mistakes: [
      "Fake timers left on for later tests.",
      "Real API calls in unit tests.",
    ],
    follow: ["Why mock at the network level?"],
    points: [
      "Intercept HTTP at the boundary",
      "Fake timers for time",
      "Inject or seed randomness",
      "Restore after each test",
    ],
    notes: ["Control inputs you don't own."],
    src: [
      ["MSW: Getting started", "https://mswjs.io/docs/getting-started"],
      ["Vitest: Mocking", "https://vitest.dev/guide/mocking"],
      ["Jest: Timer mocks", `${J}/timer-mocks`],
    ],
  }),
  q({
    slug: "tdd-red-green-refactor",
    topic: "TDD",
    d: "easy",
    title: "What is test-driven development?",
    kw: ["tdd", "red green refactor", "test first", "design", "small steps"],
    intent: "Checks you understand the cycle and its purpose.",
    short:
      "Test-driven development is a way of working in short cycles: write a failing test for the next small piece of behaviour (red), write just enough code to make it pass (green), then clean up the code and tests while keeping everything passing (refactor). Writing the test first forces you to define the expected behaviour and the interface before implementing it, tends to produce smaller, decoupled units, and leaves a regression suite as a by-product. TDD is a discipline, not a requirement; many teams use it for logic-heavy code and write tests after for exploratory or user-interface work.",
    detail: [
      "Take small steps; each cycle takes minutes.",
      "See the test fail first, otherwise you do not know it can fail.",
      "Refactor only when tests are green.",
    ],
    ex: "A developer writes a failing test for a `isLeapYear` function, implements the minimum, then simplifies the code.",
    mistakes: [
      "Writing many tests before any code.",
      "Skipping the refactor step.",
    ],
    follow: ["What does red mean?"],
    points: [
      "Red: failing test",
      "Green: minimal code to pass",
      "Refactor with tests passing",
      "Small cycles",
    ],
    notes: ["Red, green, refactor."],
    src: [
      ["Microsoft Learn: Unit testing best practices", MSU],
      ["Vitest: Getting started", "https://vitest.dev/guide/"],
    ],
  }),
  q({
    slug: "tdd-example-walkthrough",
    topic: "TDD",
    d: "medium",
    title: "Can you walk through a short TDD example?",
    kw: [
      "tdd example",
      "fizzbuzz",
      "failing test first",
      "incremental design",
      "refactoring",
    ],
    intent: "Checks you can actually apply the cycle.",
    short:
      'Take a `slugify(title)` function. First test: `slugify("Hello World")` should return `hello-world`. It fails because the function does not exist (red); write the simplest code, lowercasing and replacing spaces with hyphens (green). Next, a new failing test: `slugify("  Hello,  World! ")` should return `hello-world`; extend the code to trim, remove punctuation and collapse repeated spaces, and re-run all tests. Then refactor the code into clear steps while the tests stay green. Each test captures one requirement, and the final suite documents the behaviour.',
    detail: [
      "Add a test for each new rule or bug before changing code.",
      "Triangulate: use several examples to drive a general implementation.",
      "Keep the implementation as simple as the tests demand.",
    ],
    ex: "The test list grows from the simplest case to edge cases like empty strings and accented characters.",
    code: [
      [
        "Tests that drive slugify",
        "js",
        `test("lowercases and hyphenates", () => {\n  expect(slugify("Hello World")).toBe("hello-world")\n})\n\ntest("trims and removes punctuation", () => {\n  expect(slugify("  Hello,  World! ")).toBe("hello-world")\n})\n\ntest("handles empty input", () => {\n  expect(slugify("")).toBe("")\n})`,
        [
          "Each test adds one requirement.",
          "The implementation grows only as needed.",
        ],
      ],
    ],
    mistakes: [
      "Implementing everything at once.",
      "Not running the whole suite after each change.",
    ],
    follow: ["What does triangulation mean?"],
    points: [
      "One requirement per test",
      "Fail, pass, refactor",
      "Edge cases come as new tests",
      "Run all tests each cycle",
    ],
    notes: ["Grow the code from the tests."],
    src: [
      ["Vitest: Getting started", "https://vitest.dev/guide/"],
      ["Jest: Getting started", `${J}/getting-started`],
    ],
  }),
  q({
    slug: "regression-testing",
    topic: "Regression testing",
    d: "easy",
    title: "What is regression testing?",
    kw: [
      "regression testing",
      "regression suite",
      "bug fix test",
      "ci",
      "smoke test",
    ],
    intent: "Checks you know how to protect existing behaviour.",
    short:
      "Regression testing re-runs tests after a change to check that existing behaviour has not broken. Automated suites make this cheap: the unit, integration and end-to-end tests run in CI on every pull request. When a bug is found, first write a test that reproduces it and fails, then fix the bug, so that test guards against it returning. A smaller smoke suite of the most critical flows can run quickly after each deployment, while a fuller regression suite runs before releases. Keeping tests reliable and fast makes regression testing practical.",
    detail: [
      "Manual regression checks do not scale, so automate the repeatable ones.",
      "Prioritise tests by business risk.",
      "Review and prune obsolete tests.",
    ],
    ex: "After a pricing bug, a test with the exact failing input is added to the suite.",
    mistakes: [
      "Fixing bugs without adding a test.",
      "A suite so slow that nobody runs it.",
    ],
    follow: ["What is a smoke test?"],
    points: [
      "Re-test after changes",
      "Automate in CI",
      "Reproduce bugs with a test first",
      "Smoke suite for critical flows",
    ],
    notes: ["Every bug gets a test."],
    src: [
      ["Microsoft Learn: Unit testing best practices", MSU],
      ["Playwright: Continuous integration", `${PW}/ci`],
    ],
  }),
  q({
    slug: "e2e-testing-with-playwright",
    topic: "E2E",
    d: "medium",
    title:
      "What is end-to-end testing, and how does a tool like Playwright help?",
    kw: [
      "end-to-end testing",
      "playwright",
      "browser automation",
      "locators",
      "auto-waiting",
    ],
    intent: "Checks you know how to test the app as a user would.",
    short:
      "End-to-end tests drive the real application in a real browser, clicking and typing like a user, and check what appears on screen, covering the front end, back end and database together. Playwright is a framework for this: it automates Chromium, Firefox and WebKit, finds elements with locators (preferably by role, label or text), waits automatically for elements to be ready, and has web-first assertions that retry until the condition holds, which reduces flakiness. It produces traces and screenshots for debugging failures. Keep E2E tests few and focused on critical journeys such as sign-up and checkout.",
    detail: [
      "Run them against a staging or ephemeral environment with test data.",
      "Isolate tests so they can run in parallel.",
      "Prefer user-facing locators over CSS selectors for resilience.",
    ],
    ex: "An E2E test logs in, adds an item to the cart, and checks the order confirmation page.",
    code: [
      [
        "A Playwright test",
        "ts",
        `import { test, expect } from "@playwright/test"\n\ntest("user can log in", async ({ page }) => {\n  await page.goto("/login")\n  await page.getByLabel("Email").fill("asha@example.com")\n  await page.getByLabel("Password").fill("secret")\n  await page.getByRole("button", { name: "Sign in" }).click()\n  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()\n})`,
        [
          "Locators find elements as users do.",
          "The expect assertion retries until it passes or times out.",
        ],
      ],
    ],
    mistakes: ["Too many slow E2E tests.", "Brittle CSS-selector locators."],
    follow: ["Why does auto-waiting reduce flakiness?"],
    points: [
      "Drives a real browser through user journeys",
      "Locators by role and label",
      "Auto-waiting and retrying assertions",
      "Few, critical flows",
    ],
    notes: ["Test journeys, not pixels."],
    src: [
      ["Playwright: Writing tests", `${PW}/writing-tests`],
      ["Playwright: Locators", `${PW}/locators`],
      ["Playwright: Best practices", `${PW}/best-practices`],
    ],
  }),
  q({
    slug: "e2e-debugging-and-ci",
    topic: "E2E",
    d: "hard",
    title: "How do you debug failing E2E tests and run them in CI?",
    kw: [
      "trace viewer",
      "screenshots on failure",
      "playwright ci",
      "parallel workers",
      "test retries",
    ],
    intent: "Checks you can make E2E tests practical to maintain.",
    short:
      "When an end-to-end test fails in CI you need evidence: Playwright can record a trace, a timeline with screenshots, network calls and DOM snapshots, that you open in the Trace Viewer, plus screenshots and video on failure. Run tests headless in CI with a fixed browser version, split them across parallel workers or shards for speed, and use limited retries with a report of which tests needed them. Start the application and its dependencies (database, seed data) in a known state before the run, authenticate once and reuse the storage state instead of logging in through the UI every time.",
    detail: [
      "`npx playwright test --debug` and the UI mode help locally.",
      "Block third-party calls with request mocking to avoid external flakiness.",
      "Upload the HTML report as a build artifact.",
    ],
    ex: "A failing checkout test is diagnosed by opening the trace and seeing a 500 from an API call.",
    mistakes: [
      "No artifacts from CI failures.",
      "Logging in through the UI before every test.",
    ],
    follow: ["What does the trace viewer show?"],
    points: [
      "Traces, screenshots and video",
      "Parallel workers and limited retries",
      "Known starting state",
      "Reuse authentication state",
    ],
    notes: ["Keep evidence of failures."],
    src: [
      ["Playwright: Trace viewer", `${PW}/trace-viewer`],
      ["Playwright: Continuous integration", `${PW}/ci`],
      ["Playwright: Authentication", `${PW}/auth`],
    ],
  }),
  q({
    slug: "component-testing-react-basics",
    topic: "Integration tests",
    d: "medium",
    title: "How do you test a React component without a browser?",
    kw: [
      "component testing",
      "react testing library",
      "jsdom",
      "user events",
      "accessible queries",
    ],
    intent: "Checks you can test UI behaviour at the component level.",
    short:
      "Render the component in a simulated DOM (jsdom) with React Testing Library, interact with it as a user would using `userEvent`, and assert on what is visible. Find elements by role, label or text, so tests stay close to how people use the page and encourage accessible markup. Mock the network at the boundary (for example with Mock Service Worker), and wrap the component in the providers it needs, such as a router or query client. Component tests are faster than E2E tests and cover rendering, state and events well, but do not replace a few real-browser checks.",
    detail: [
      "Avoid testing implementation details such as state variables.",
      "Use `findBy` queries for content that appears asynchronously.",
      "Check both the happy path and error states.",
    ],
    ex: "A login form test types credentials, submits and checks for an error message when the API returns 401.",
    mistakes: ["Querying by CSS class.", "Testing internal state."],
    follow: ["Why query by role?"],
    points: [
      "Render in jsdom",
      "Interact like a user",
      "Query by role and label",
      "Mock the network boundary",
    ],
    notes: ["Test what users see."],
    src: [
      [
        "Testing Library: Guiding principles",
        "https://testing-library.com/docs/guiding-principles",
      ],
      ["web.dev: Component testing", `${WD}/component-testing`],
    ],
  }),
  q({
    slug: "static-analysis-and-linting-tests",
    topic: "Unit tests",
    d: "easy",
    title:
      "How do static analysis, linting and type checking relate to testing?",
    kw: [
      "static analysis",
      "eslint",
      "type checking",
      "typescript",
      "shift left",
    ],
    intent: "Checks you know the cheapest layer of quality checks.",
    short:
      "Static analysis inspects code without running it. Type checkers like TypeScript catch wrong types and missing properties, linters such as ESLint flag suspicious patterns, unused variables and style issues, and formatters keep the code consistent. They find whole classes of bugs instantly, before any test runs, so they form the base layer of a quality strategy alongside tests. They cannot verify behaviour or business rules, so they complement, not replace, automated tests. Run them in the editor and in CI on every pull request.",
    detail: [
      "web.dev lists static analysis as one of the layers of testing.",
      "Security scanners and dependency audits are also static checks.",
      "Treat warnings as errors in CI to avoid ignored noise.",
    ],
    ex: "TypeScript flags a call with a missing argument before the code is ever run.",
    mistakes: [
      "Ignoring linter warnings.",
      "Believing types remove the need for tests.",
    ],
    follow: ["What can static analysis not detect?"],
    points: [
      "Analyse without running",
      "Types, lint, format",
      "Fast, early feedback",
      "Complements tests",
    ],
    notes: ["Cheapest bugs are caught first."],
    src: [
      ["web.dev: Static analysis", `${WD}/static-analysis`],
      ["TypeScript documentation", "https://www.typescriptlang.org/docs/"],
    ],
  }),
  q({
    slug: "snapshot-testing-pros-cons",
    topic: "Unit tests",
    d: "medium",
    title: "What is snapshot testing, and when is it a good idea?",
    kw: [
      "snapshot testing",
      "toMatchSnapshot",
      "inline snapshot",
      "update snapshots",
      "review diffs",
    ],
    intent: "Checks you use snapshots with judgement.",
    short:
      "A snapshot test stores the serialised output of code, such as a data structure or rendered markup, in a file on the first run and compares later runs with it, failing when the output changes. It is quick to write and catches unintended changes in stable, small outputs like error messages, generated configuration or serialised objects. The weakness is that it records what the code does, not whether that is right: large snapshots are hard to review, and people often update failing snapshots without reading the diff. Keep snapshots small, prefer inline snapshots, and review changes in pull requests like code.",
    detail: [
      "Snapshot files are committed alongside tests.",
      "Avoid snapshots of whole pages; assert on specific behaviour instead.",
      "Non-deterministic values such as dates must be replaced before snapshotting.",
    ],
    ex: "A formatter's output for a few input cases is snapshotted so any change is flagged for review.",
    mistakes: ["Blindly updating snapshots.", "Huge snapshots nobody reads."],
    follow: ["What is a drawback of snapshot tests?"],
    points: [
      "Compare output to a stored snapshot",
      "Good for small stable outputs",
      "Review snapshot diffs",
      "Do not snapshot everything",
    ],
    notes: ["Snapshots detect change, not correctness."],
    src: [
      ["Jest: Snapshot testing", `${J}/snapshot-testing`],
      ["Vitest: Snapshot", "https://vitest.dev/guide/snapshot"],
    ],
  }),
  q({
    slug: "testing-async-code",
    topic: "Unit tests",
    d: "medium",
    title: "How do you test asynchronous code reliably?",
    kw: [
      "async tests",
      "await",
      "promises",
      "done callback",
      "resolves rejects",
    ],
    intent: "Checks you avoid tests that pass before the work finishes.",
    short:
      "Make the test wait for the asynchronous work: declare it `async` and `await` the call, or return the promise, so the runner does not finish the test early. Use `await expect(promise).resolves.toEqual(value)` and `rejects.toThrow()` for promise results, and fake timers for code that uses `setTimeout`, so tests run instantly and deterministically. In UI tests, wait for the visible result with `findBy` queries or `waitFor` instead of fixed sleeps. A forgotten `await` is the classic cause of tests that pass while the assertions never run, so consider `expect.assertions(n)`.",
    detail: [
      "Unhandled promise rejections can fail the whole run.",
      "Avoid real network or real delays in unit tests.",
      "Make async functions return their promises so they can be awaited.",
    ],
    ex: "A test awaits `fetchUser(1)` and asserts the name, instead of checking the result in a callback after the test ended.",
    mistakes: ["Missing await.", "Arbitrary sleeps."],
    follow: ["What does expect.assertions guard against?"],
    points: [
      "async/await or return the promise",
      "resolves and rejects matchers",
      "Fake timers instead of sleeps",
      "Wait for visible results in UI tests",
    ],
    notes: ["Always await."],
    src: [
      ["Jest: Testing asynchronous code", `${J}/asynchronous`],
      [
        "Testing Library: Async APIs",
        "https://testing-library.com/docs/dom-testing-library/api-async",
      ],
    ],
  }),
  q({
    slug: "readable-test-names-and-structure",
    topic: "Unit tests",
    d: "easy",
    title: "How should you name and organise tests so they stay maintainable?",
    kw: [
      "test naming",
      "test organisation",
      "magic numbers",
      "readability",
      "one assertion",
    ],
    intent: "Checks you write tests other people can understand.",
    short:
      "A test name should say the scenario and the expected outcome, such as `rejects_an_expired_coupon`, so a failure explains itself. Group related tests, keep each test focused on one behaviour with a clear arrange, act and assert, and avoid logic like loops and conditions in tests. Use named constants or descriptive variables instead of unexplained magic numbers, build test data with small helpers, and keep tests independent so they can run in any order. Treat test code as production code: refactor duplication, but not so far that a test can no longer be read on its own.",
    detail: [
      "Failing tests should point to the cause without a debugger.",
      "Prefer fewer, clearer asserts over many unrelated ones.",
      "Delete tests that no longer describe real requirements.",
    ],
    ex: "A test named 'rejects an expired coupon' tells the reader exactly what broke.",
    mistakes: [
      "Names like test1.",
      "Tests with hidden shared setup that is hard to follow.",
    ],
    follow: ["What should a good test name contain?"],
    points: [
      "Scenario and expected result in the name",
      "One behaviour per test",
      "No logic in tests",
      "Independent tests",
    ],
    notes: ["Name the behaviour."],
    src: [["Microsoft Learn: Unit testing best practices", MSU]],
  }),
  q({
    slug: "test-environments-and-where-tests-run",
    topic: "Integration tests",
    d: "medium",
    title: "Where should different kinds of tests run?",
    kw: [
      "testing environment",
      "ci environment",
      "staging",
      "local tests",
      "production-like",
    ],
    intent: "Checks you know the trade-offs of test environments.",
    short:
      "Fast unit and component tests run locally and in every CI build. Integration tests need dependencies, so they run in CI against disposable services such as a containerised database. End-to-end tests run against a deployed, production-like environment such as staging or an ephemeral preview, with realistic configuration and seeded data. Testing in production, with monitoring, canary releases and feature flags, complements pre-release testing but does not replace it. The closer an environment is to production, the more confidence it gives, and the more it costs and the slower it runs, so choose per test type.",
    detail: [
      "web.dev's testing course discusses where tests run as part of strategy.",
      "Keep environment configuration in code so it is reproducible.",
      "Never run destructive tests against production data.",
    ],
    ex: "Unit tests run on every commit, and a nightly job runs the full E2E suite against staging.",
    mistakes: [
      "Tests that only work on one developer's machine.",
      "Sharing a staging database between parallel test runs.",
    ],
    follow: ["Why run E2E tests against a deployed environment?"],
    points: [
      "Unit tests everywhere, fast",
      "Integration in CI with disposable services",
      "E2E in staging or preview",
      "Production-like but isolated",
    ],
    notes: ["Match the environment to the test."],
    src: [
      ["web.dev: Where tests run", `${WD}/where-tests-run`],
      ["web.dev: Testing environment", `${WD}/testing-environment`],
    ],
  }),
  q({
    slug: "unit-testing-js-with-jest-or-vitest",
    topic: "Unit tests",
    d: "easy",
    title:
      "How do you write and run unit tests in JavaScript with Jest or Vitest?",
    kw: ["jest", "vitest", "describe it expect", "test runner", "npm test"],
    intent: "Checks you can set up and run a basic test suite.",
    short:
      "Install a test runner such as Jest or Vitest (Vitest suits Vite projects), add a `test` script to `package.json`, and create files named `*.test.js` or `*.test.ts` next to the code. A test uses `describe` to group, `it` or `test` to define a case, and `expect(value).toBe(expected)` or other matchers to assert. Run them with `npm test`; watch mode reruns affected tests as you edit, and `--coverage` produces a coverage report. In CI run a single non-watch pass so the pipeline fails on any test failure.",
    detail: [
      "Use matchers like `toEqual` for objects and `toThrow` for errors.",
      "Both runners support mocks, snapshots and fake timers.",
      "Keep each test independent of the others.",
    ],
    ex: "`npm test` runs all tests, and `vitest run` executes them once in CI.",
    code: [
      [
        "A first test",
        "js",
        `import { sum } from "./sum.js"\n\ndescribe("sum", () => {\n  it("adds two numbers", () => {\n    expect(sum(2, 3)).toBe(5)\n  })\n})`,
        [
          "`describe` groups tests.",
          "`it` defines a case.",
          "`expect` asserts the result.",
        ],
      ],
    ],
    mistakes: [
      "Leaving the runner in watch mode in CI.",
      "Testing several behaviours per case.",
    ],
    follow: ["How do you assert that a function throws?"],
    points: [
      "describe, it, expect",
      "Test files next to code",
      "npm test, watch mode, coverage",
      "Single run in CI",
    ],
    notes: ["Small tests, fast runs."],
    src: [
      ["Jest: Getting started", `${J}/getting-started`],
      ["Vitest: Getting started", "https://vitest.dev/guide/"],
    ],
  }),
  q({
    slug: "node-built-in-test-runner",
    topic: "Unit tests",
    d: "medium",
    title: "Does Node.js have a built-in test runner?",
    kw: [
      "node:test",
      "node --test",
      "assert",
      "built-in test runner",
      "no dependencies",
    ],
    intent: "Checks you know the dependency-free option.",
    short:
      "Yes. The `node:test` module provides a built-in test runner, run with `node --test`, which finds test files, supports `describe` and `it` (or `test`), hooks such as `before` and `afterEach`, mocking, timers and optional coverage, and prints the results in TAP-compatible or readable reporters. Pair it with `node:assert` for assertions, such as `assert.strictEqual`. It needs no extra packages, which suits small projects and libraries, whereas Jest and Vitest offer more features like richer matchers, snapshots and a watch UI.",
    detail: [
      "Use `assert.deepStrictEqual` for objects and arrays.",
      "Async tests return promises or use async functions.",
      "The runner can run files in parallel in separate processes.",
    ],
    ex: "A utility library tests itself with `node --test` and has no test dependencies.",
    code: [
      [
        "node:test example",
        "js",
        `import { test } from "node:test"\nimport assert from "node:assert/strict"\n\ntest("adds numbers", () => {\n  assert.equal(1 + 2, 3)\n})`,
        ["`test` registers a case.", "`assert` throws if the check fails."],
      ],
    ],
    mistakes: [
      "Forgetting to await async operations.",
      "Mixing test frameworks in one project.",
    ],
    follow: ["How do you run the tests?"],
    points: [
      "node:test with node --test",
      "node:assert for assertions",
      "Hooks, mocks, timers built in",
      "No dependencies",
    ],
    notes: ["Zero-dependency testing."],
    src: [
      ["Node.js: Test runner", "https://nodejs.org/api/test.html"],
      ["Node.js: Assert", "https://nodejs.org/api/assert.html"],
    ],
  }),
  q({
    slug: "api-testing-with-postman-tests",
    topic: "API testing with Postman",
    d: "easy",
    title: "How do you write automated checks for an API in Postman?",
    kw: [
      "postman tests",
      "pm.test",
      "assertions",
      "collection runner",
      "newman",
    ],
    intent: "Checks you can go beyond clicking Send.",
    short:
      "In Postman, add JavaScript to a request's test script and use `pm.test` with `pm.expect` to assert on the response: the status code, headers, response time and body fields, for example `pm.expect(pm.response.code).to.equal(200)`. Store values for later requests in variables, such as saving a token from the login response. The Collection Runner executes a whole collection in order, and Newman, the command-line runner, runs it in CI so the pipeline fails when assertions fail. Use environments for base URLs and secrets, so the same collection tests staging or production-like systems.",
    detail: [
      "Test negative cases such as invalid input and missing authentication.",
      "Chain requests to cover flows: create, read, update, delete.",
      "Keep secrets out of exported collections.",
    ],
    ex: "A CI job runs the collection with Newman after each deployment as a smoke test.",
    code: [
      [
        "Postman test script",
        "js",
        `pm.test("status is 201", () => {\n  pm.response.to.have.status(201)\n})\n\npm.test("returns the created id", () => {\n  const body = pm.response.json()\n  pm.expect(body.id).to.be.a("number")\n  pm.collectionVariables.set("orderId", body.id)\n})`,
        [
          "`pm.test` defines a check.",
          "The response body is parsed as JSON.",
          "A variable carries the id to later requests.",
        ],
      ],
    ],
    mistakes: [
      "Only checking the happy path.",
      "Hard-coded tokens in the collection.",
    ],
    follow: ["What is Newman?"],
    points: [
      "pm.test and pm.expect",
      "Variables to chain requests",
      "Collection Runner and Newman",
      "Environments for config",
    ],
    notes: ["Assert, chain, automate."],
    src: [
      [
        "Postman: Test scripts",
        `${PM}/tests-and-scripts/write-scripts/test-scripts/`,
      ],
      [
        "Postman: Collection runs",
        `${PM}/collections/running-collections/intro-to-collection-runs/`,
      ],
      [
        "Postman: Newman CLI",
        `${PM}/collections/using-newman-cli/command-line-integration-with-newman/`,
      ],
    ],
  }),
  q({
    slug: "api-test-cases-checklist",
    topic: "API testing with Postman",
    d: "medium",
    title: "What should you test for an API endpoint?",
    kw: [
      "api test cases",
      "status codes",
      "validation",
      "authorization",
      "boundary values",
    ],
    intent: "Checks you think in test cases, not just a single call.",
    short:
      "For each endpoint test the success path (status, headers, body shape and values), input validation (missing, wrong type, too long, boundary and invalid values), authentication and authorisation (no token, expired token, a user accessing another user's data), error responses (404 for unknown ids, 409 for conflicts), side effects (the data was really created or changed), idempotency of PUT and DELETE, pagination and sorting rules, rate limits, and basic performance such as response time. Use realistic test data, check that errors do not leak internals, and keep tests independent.",
    detail: [
      "A contract test checks responses against the OpenAPI schema.",
      "Security checks are part of API testing, not a separate afterthought.",
      "Automate the repeatable cases in CI.",
    ],
    ex: "For `POST /users` the cases include a valid user, duplicate email, invalid email and missing authorisation.",
    mistakes: [
      "Testing only 200 responses.",
      "Not testing authorisation between users.",
    ],
    follow: ["Which cases check authorisation?"],
    points: [
      "Success, validation, auth, errors",
      "Check side effects",
      "Boundaries and edge cases",
      "Contract against OpenAPI",
    ],
    notes: ["Happy path plus all the sad ones."],
    src: [
      [
        "Postman: Test scripts",
        `${PM}/tests-and-scripts/write-scripts/test-scripts/`,
      ],
      [
        "OWASP: REST Security Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html",
      ],
    ],
  }),
  q({
    slug: "python-unittest-pytest-basics",
    topic: "Unit tests",
    d: "medium",
    title: "How do you write unit tests in Python with unittest or pytest?",
    kw: ["unittest", "pytest", "assert", "fixtures", "test discovery"],
    intent: "Checks you can test Python code with the standard tools.",
    short:
      "Python's standard library includes `unittest`: define a class that inherits from `unittest.TestCase`, write methods starting with `test_`, use assertions such as `self.assertEqual` and run with `python -m unittest`. `pytest` is a popular third-party runner that is simpler: plain functions named `test_*` with the ordinary `assert` statement, rich failure output, parametrised tests and fixtures that provide reusable setup. `unittest.mock` provides `patch` and `MagicMock` to replace dependencies. Choose one tool per project and run it in CI.",
    detail: [
      "pytest can also run unittest-style tests.",
      "Fixtures with scopes share expensive setup safely.",
      "`pytest.mark.parametrize` runs one test over many inputs.",
    ],
    ex: "A function `is_even(n)` is tested over a list of numbers with a parametrised pytest test.",
    code: [
      [
        "pytest example",
        "python",
        `import pytest\n\n@pytest.mark.parametrize("n, expected", [(2, True), (3, False), (0, True)])\ndef test_is_even(n, expected):\n    assert is_even(n) is expected`,
        [
          "Parametrisation runs several cases.",
          "A plain `assert` checks the result.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting the test_ prefix, so tests are not discovered.",
      "Tests relying on shared global state.",
    ],
    follow: ["What does a pytest fixture do?"],
    points: [
      "unittest.TestCase in the standard library",
      "pytest uses plain assert and fixtures",
      "unittest.mock for doubles",
      "Parametrise to cover cases",
    ],
    notes: ["test_ prefix, simple asserts."],
    src: [
      ["Python: unittest", "https://docs.python.org/3/library/unittest.html"],
      ["pytest documentation", "https://docs.pytest.org/en/stable/"],
      [
        "Python: unittest.mock",
        "https://docs.python.org/3/library/unittest.mock.html",
      ],
    ],
  }),
  q({
    slug: "junit-mockito-java-testing-basics",
    topic: "Unit tests",
    d: "medium",
    title: "How do you write unit tests in Java with JUnit 5 and Mockito?",
    kw: ["junit 5", "mockito", "@Test", "assertions", "mock dependencies"],
    intent: "Checks you can test Java services.",
    short:
      "JUnit 5 is the standard Java test framework: annotate methods with `@Test`, use `Assertions` such as `assertEquals` and `assertThrows`, group setup with `@BeforeEach`, and run through Maven, Gradle or the IDE. Mockito creates mocks of collaborators so a class can be tested alone: `@Mock` and `@InjectMocks` set them up, `when(repo.find(1)).thenReturn(user)` stubs behaviour and `verify(repo).save(user)` checks an interaction. Test public behaviour, give tests descriptive names, and avoid starting the full application context in unit tests, which belongs to integration tests.",
    detail: [
      "Parameterized tests run a test over several inputs.",
      "Spring Boot offers `@SpringBootTest` and slices for integration tests.",
      "Keep one logical assertion per test where possible.",
    ],
    ex: "A `UserService` test mocks the `UserRepository` and checks the service rejects a duplicate email.",
    mistakes: [
      "Using @SpringBootTest for simple unit tests.",
      "Verifying implementation details of mocks.",
    ],
    follow: ["What does @InjectMocks do?"],
    points: [
      "@Test and Assertions",
      "Mockito mocks collaborators",
      "when/thenReturn and verify",
      "Unit tests avoid the full context",
    ],
    notes: ["Isolate the class with mocks."],
    src: [
      [
        "JUnit 5 User Guide",
        "https://junit.org/junit5/docs/current/user-guide/",
      ],
      ["Mockito", "https://site.mockito.org/"],
    ],
  }),
])
