import { defineQuestions } from "../author"
import { q } from "../compact"

const J = "https://jestjs.io/docs"
const V = "https://vitest.dev"
const TL = "https://testing-library.com/docs"
const M = "https://mswjs.io/docs"

export default defineQuestions("frontend-testing", "fresher", [
  q({
    slug: "jest-describe-it-expect",
    topic: "Jest",
    d: "easy",
    title: "What are describe, it and expect in Jest?",
    kw: ["jest", "describe", "it", "expect", "test structure"],
    intent: "Checks you can read and write a basic unit test.",
    short:
      "Jest is a JavaScript test runner with built-in assertions. `describe` groups related tests, `it` (or `test`) defines one test case with a name and a function, and `expect(value)` creates an assertion that you complete with a matcher such as `toBe(3)`. A test passes if it runs without a thrown error, and fails when an assertion fails. Good test names state the behaviour being checked.",
    detail: [
      "Tests should be independent and not depend on the order they run in.",
      "Follow arrange, act, assert: set up data, call the code, check the result.",
      "Jest finds files named `*.test.js` or inside `__tests__` folders by default.",
    ],
    ex: 'A `sum` function is tested with `expect(sum(1, 2)).toBe(3)` inside `describe("sum")`.',
    code: [
      [
        "A basic test",
        "js",
        `describe("sum", () => {\n  it("adds two numbers", () => {\n    expect(sum(1, 2)).toBe(3)\n  })\n})`,
        [
          "`describe` groups the tests.",
          "`it` names one behaviour.",
          "`expect(...).toBe(...)` is the assertion.",
        ],
      ],
    ],
    mistakes: ["Tests that depend on each other.", "Vague names like 'works'."],
    follow: ["What makes a test fail?"],
    points: [
      "describe groups, it defines a case",
      "expect plus a matcher",
      "Fails on a thrown error",
      "Independent tests",
    ],
    notes: ["Arrange, act, assert."],
    src: [
      ["Jest: Getting started", `${J}/getting-started`],
      ["Jest: Using matchers", `${J}/using-matchers`],
    ],
  }),
  q({
    slug: "jest-common-matchers",
    topic: "Jest",
    d: "easy",
    title: "What is the difference between toBe, toEqual and toStrictEqual?",
    kw: ["toBe", "toEqual", "toStrictEqual", "matchers", "object equality"],
    intent: "Checks you pick the right equality matcher.",
    short:
      "`toBe` compares with `Object.is`, so it checks identity for objects and is right for primitives. `toEqual` recursively compares the contents of objects and arrays and ignores properties with an `undefined` value. `toStrictEqual` is stricter: it also considers `undefined` properties, sparse arrays and object types. Use `toBe` for numbers and strings, and `toEqual` to compare data structures.",
    detail: [
      "`expect({a: 1}).toBe({a: 1})` fails because they are different objects.",
      "Other useful matchers are `toContain`, `toHaveLength`, `toBeTruthy`, `toBeNull` and `toThrow`.",
      "`toBeCloseTo` is for floating point numbers.",
    ],
    ex: "Comparing a returned user object with an expected one uses `toEqual`, while comparing a count uses `toBe`.",
    code: [
      [
        "Equality",
        "js",
        `expect(2 + 2).toBe(4)\nexpect({ id: 1, tags: [] }).toEqual({ id: 1, tags: [] })\nexpect(0.1 + 0.2).toBeCloseTo(0.3)`,
        [
          "`toBe` for a primitive.",
          "`toEqual` compares object contents.",
          "`toBeCloseTo` avoids float rounding problems.",
        ],
      ],
    ],
    mistakes: [
      "Using toBe to compare two objects.",
      "Comparing floats with toBe.",
    ],
    follow: ["How do you assert a function throws?"],
    points: [
      "toBe: Object.is",
      "toEqual: deep content",
      "toStrictEqual: also undefined and types",
      "toBeCloseTo for floats",
    ],
    notes: ["Primitive: toBe. Object: toEqual."],
    src: [
      ["Jest: Using matchers", `${J}/using-matchers`],
      ["Jest: Expect", `${J}/expect`],
    ],
  }),
  q({
    slug: "jest-mock-functions",
    topic: "Jest",
    d: "medium",
    title: "What are mock functions and spies in Jest?",
    kw: [
      "jest.fn",
      "mock function",
      "spyOn",
      "toHaveBeenCalledWith",
      "test double",
    ],
    intent: "Checks you can replace and observe dependencies.",
    short:
      '`jest.fn()` creates a mock function that records how it was called and can be given behaviour, for example `mockReturnValue(5)` or `mockResolvedValue(data)`. You can then assert with `toHaveBeenCalled`, `toHaveBeenCalledTimes` and `toHaveBeenCalledWith(args)`. `jest.spyOn(object, "method")` wraps an existing method to watch it, and can replace its implementation. Mocks isolate the unit under test from collaborators such as network calls.',
    detail: [
      "Pass a mock as a callback prop and check it is called when the user clicks.",
      "Reset or restore mocks between tests so one test does not leak into the next.",
      "Over-mocking makes tests pass while the real integration is broken.",
    ],
    ex: "A `Button` test passes `onClick={jest.fn()}`, clicks, and asserts the mock was called once.",
    code: [
      [
        "A mock callback",
        "js",
        `const onSave = jest.fn()\nsave({ id: 1 }, onSave)\nexpect(onSave).toHaveBeenCalledTimes(1)\nexpect(onSave).toHaveBeenCalledWith({ id: 1 })`,
        [
          "The mock records calls.",
          "Assertions check the count and arguments.",
        ],
      ],
    ],
    mistakes: [
      "Not resetting mocks between tests.",
      "Mocking so much that nothing real is tested.",
    ],
    follow: ["What does spyOn do that jest.fn does not?"],
    points: [
      "jest.fn records calls",
      "mockReturnValue sets behaviour",
      "spyOn wraps a real method",
      "Reset between tests",
    ],
    notes: ["Mock the boundary, not everything."],
    src: [
      ["Jest: Mock functions", `${J}/mock-functions`],
      ["Jest: Mock function API", `${J}/mock-function-api`],
    ],
  }),
  q({
    slug: "jest-mock-modules",
    topic: "Jest",
    d: "medium",
    title: "How do you mock a module in Jest?",
    kw: ["jest.mock", "module mock", "manual mock", "dependency", "isolation"],
    intent: "Checks you can replace a whole import in a test.",
    short:
      '`jest.mock("./api")` replaces a module with an automatic mock in which exported functions are mock functions returning undefined. You can supply a factory to define the replacement, for example `jest.mock("./api", () => ({ getUser: jest.fn() }))`, and then set return values per test. Calls to `jest.mock` are hoisted to the top of the file so the mock applies before imports are evaluated. Manual mocks can live in a `__mocks__` folder next to the module.',
    detail: [
      "Mock modules that perform I/O, time or randomness, not the logic under test.",
      "Restore or reset mocks in `afterEach` to avoid leaking between tests.",
      "Mocking at the network level with MSW is an alternative that tests more of the real code.",
    ],
    ex: "A component test mocks `./api` so `getUser` returns a fixed user without any network.",
    code: [
      [
        "Mock a module",
        "js",
        `import { getUser } from "./api"\njest.mock("./api")\n\ntest("shows the name", async () => {\n  getUser.mockResolvedValue({ name: "Asha" })\n  // render and assert\n})`,
        [
          "`jest.mock` replaces the module.",
          "`mockResolvedValue` sets what the async function returns.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting that jest.mock is hoisted.",
      "Leaving mock implementations in place for the next test.",
    ],
    follow: ["What is an alternative to mocking the module?"],
    points: [
      "jest.mock replaces a module",
      "Factory defines replacements",
      "Hoisted above imports",
      "Reset between tests",
    ],
    notes: ["Mock I/O boundaries."],
    src: [
      ["Jest: Manual mocks", `${J}/manual-mocks`],
      ["Jest: The Jest object", `${J}/jest-object`],
    ],
  }),
  q({
    slug: "jest-async-tests",
    topic: "Jest",
    d: "medium",
    title: "How do you test asynchronous code in Jest?",
    kw: ["async await", "resolves", "rejects", "promise", "done callback"],
    intent: "Checks you avoid tests that pass before the async work finishes.",
    short:
      'Make the test function `async` and `await` the code, or return the promise, so Jest waits for it. You can also write `await expect(promise).resolves.toBe(value)` and `await expect(promise).rejects.toThrow("message")`. If you forget to await or return the promise, the test finishes before the assertions run and can pass incorrectly. Use `expect.assertions(n)` to make sure the expected number of assertions ran.',
    detail: [
      "The older `done` callback style is also supported but is error-prone.",
      "Use fake timers rather than real waiting for code that uses `setTimeout`.",
      "A failing promise that nobody awaits can surface as an unhandled rejection.",
    ],
    ex: "A test awaits `fetchUser(1)` and checks the returned name.",
    code: [
      [
        "Async and rejection",
        "js",
        `test("loads a user", async () => {\n  await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "Asha" })\n})\n\ntest("rejects for a missing user", async () => {\n  await expect(fetchUser(0)).rejects.toThrow("Not found")\n})`,
        [
          "`await` makes Jest wait.",
          "`resolves` and `rejects` unwrap the promise for the matcher.",
        ],
      ],
    ],
    mistakes: [
      "Not awaiting the promise.",
      "Using setTimeout delays in tests.",
    ],
    follow: ["What does expect.assertions do?"],
    points: [
      "async/await or return the promise",
      "resolves and rejects",
      "Missing await hides failures",
      "expect.assertions guards",
    ],
    notes: ["Always await."],
    src: [["Jest: Testing asynchronous code", `${J}/asynchronous`]],
  }),
  q({
    slug: "jest-setup-fake-timers-snapshots",
    topic: "Jest",
    d: "hard",
    title: "When do you use setup hooks, fake timers and snapshots in Jest?",
    kw: [
      "beforeEach",
      "afterEach",
      "fake timers",
      "snapshot",
      "toMatchSnapshot",
    ],
    intent: "Checks you know the supporting tools and their risks.",
    short:
      "`beforeEach` and `afterEach` run setup and cleanup around every test so each starts from a known state; `beforeAll` and `afterAll` run once per file. Fake timers, enabled with `jest.useFakeTimers()`, let you control `setTimeout` and `setInterval` with `jest.advanceTimersByTime(ms)` instead of really waiting. Snapshot tests, with `toMatchSnapshot`, store the serialised output and fail when it changes; they catch unintended changes but large snapshots are hard to review and are often updated blindly, so use them sparingly.",
    detail: [
      "Restore real timers after the test with `jest.useRealTimers()`.",
      "Review snapshot diffs in code review like any other code change.",
      "Prefer explicit assertions about the behaviour that matters.",
    ],
    ex: "A debounce test advances fake time by 300ms and checks the function was called once.",
    mistakes: [
      "Updating failing snapshots without reading the diff.",
      "Large snapshots of whole pages.",
    ],
    follow: ["Why can snapshots be a weak test?"],
    points: [
      "beforeEach/afterEach isolate tests",
      "Fake timers control time",
      "Snapshots detect change, not correctness",
      "Keep snapshots small",
    ],
    notes: ["Control time; review snapshots."],
    src: [
      ["Jest: Setup and teardown", `${J}/setup-teardown`],
      ["Jest: Timer mocks", `${J}/timer-mocks`],
      ["Jest: Snapshot testing", `${J}/snapshot-testing`],
    ],
  }),
  q({
    slug: "what-is-vitest",
    topic: "Vitest",
    d: "easy",
    title: "What is Vitest and how does it compare with Jest?",
    kw: ["vitest", "vite", "test runner", "jest compatible", "esm"],
    intent: "Checks you know why a Vite project uses Vitest.",
    short:
      "Vitest is a test framework powered by Vite. It reuses your Vite configuration and transform pipeline, so TypeScript, JSX and path aliases work as in the app, and it supports ES modules natively. Its API is largely compatible with Jest, with `describe`, `it`, `expect`, mocks and snapshots, but mocks live on the `vi` object (`vi.fn`, `vi.mock`). It is fast, with a watch mode that reruns related tests.",
    detail: [
      "Run `vitest` for watch mode in development and `vitest run` for a single run, such as in CI.",
      "Settings go in the `test` section of the Vite config or a Vitest config file.",
      "Migrating from Jest is mostly renaming `jest` to `vi`.",
    ],
    ex: "A Vite React app uses Vitest so tests share the same aliases and plugins as the app.",
    mistakes: [
      "Using jest.fn in a Vitest project.",
      "Running watch mode in CI.",
    ],
    follow: ["How do you run the tests once in CI?"],
    points: [
      "Powered by Vite",
      "Jest-like API",
      "Mocks via vi",
      "vitest run for CI",
    ],
    notes: ["Same config as the app."],
    src: [
      ["Vitest: Getting started", `${V}/guide/`],
      ["Vitest: Why Vitest", `${V}/guide/why`],
      ["Vitest: Comparisons", `${V}/guide/comparisons`],
    ],
  }),
  q({
    slug: "vitest-config-and-environment",
    topic: "Vitest",
    d: "medium",
    title: "How do you configure Vitest for React components?",
    kw: [
      "vitest config",
      "environment jsdom",
      "globals",
      "setupFiles",
      "test options",
    ],
    intent: "Checks you can set up a DOM environment for component tests.",
    short:
      'Add a `test` section to the Vite or Vitest config: `environment: "jsdom"` (or `happy-dom`) gives the tests a simulated browser DOM, `setupFiles` points to a file that runs before each test file, for example to register jest-dom matchers, and `globals: true` makes `describe`, `it` and `expect` available without importing them. Without a DOM environment, React components cannot render because Vitest runs in Node by default.',
    detail: [
      "The environment can also be set per file with a comment at the top.",
      "If you use `globals`, add the Vitest types to the TypeScript config.",
      "`css` handling and aliases follow the Vite config.",
    ],
    ex: 'A project sets `environment: "jsdom"` and a setup file that imports `@testing-library/jest-dom`.',
    code: [
      [
        "Vitest config",
        "ts",
        `export default defineConfig({\n  test: {\n    environment: "jsdom",\n    globals: true,\n    setupFiles: "./src/test/setup.ts",\n  },\n})`,
        [
          "`jsdom` simulates the DOM.",
          "`globals` skips importing test functions.",
          "The setup file runs first.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting the jsdom environment so document is undefined.",
      "Using globals without the type definitions.",
    ],
    follow: ["What does the setup file usually contain?"],
    points: [
      "environment: jsdom",
      "setupFiles for shared setup",
      "globals optional",
      "Config shared with Vite",
    ],
    notes: ["jsdom plus setup file."],
    src: [
      ["Vitest: Configuring", `${V}/config/`],
      ["Vitest: Test environment", `${V}/guide/environment`],
    ],
  }),
  q({
    slug: "vitest-vi-mock-and-spies",
    topic: "Vitest",
    d: "medium",
    title: "How do vi.fn, vi.spyOn and vi.mock work in Vitest?",
    kw: ["vi.fn", "vi.spyOn", "vi.mock", "hoisting", "mock reset"],
    intent:
      "Checks you can mock with the Vitest API and know its differences from Jest.",
    short:
      '`vi.fn()` creates a mock function, `vi.spyOn(obj, "method")` observes or replaces an existing method, and `vi.mock("./module", factory)` replaces a whole module. Like Jest, calls to `vi.mock` are hoisted to the top of the file. If the factory needs variables, create them with `vi.hoisted`. Because ES modules are used, mocking is done through these helpers rather than by reassigning imports. Reset mocks between tests with `vi.resetAllMocks()` or the configuration options.',
    detail: [
      "`vi.fn().mockResolvedValue(x)` mirrors Jest's API.",
      "`vi.restoreAllMocks()` restores spied originals.",
      "Mocking at the network layer with MSW avoids many module mocks.",
    ],
    ex: "A test replaces `./api` with `vi.mock` so `getUser` returns a fixed value.",
    code: [
      [
        "Module mock",
        "ts",
        `import { getUser } from "./api"\nvi.mock("./api", () => ({ getUser: vi.fn() }))\n\ntest("uses the user", async () => {\n  vi.mocked(getUser).mockResolvedValue({ name: "Asha" })\n})`,
        [
          "The factory returns the replacement module.",
          "`vi.mocked` gives typed access to the mock.",
        ],
      ],
    ],
    mistakes: [
      "Using variables in a vi.mock factory without vi.hoisted.",
      "Not restoring spies.",
    ],
    follow: ["Why is vi.mock hoisted?"],
    points: [
      "vi.fn, vi.spyOn, vi.mock",
      "Hoisted to the top",
      "vi.hoisted for shared variables",
      "Reset between tests",
    ],
    notes: ["Same ideas as Jest, under vi."],
    src: [
      ["Vitest: Mocking", `${V}/guide/mocking`],
      ["Vitest: vi API", `${V}/api/vi`],
    ],
  }),
  q({
    slug: "vitest-timers-and-snapshots",
    topic: "Vitest",
    d: "medium",
    title: "How do fake timers and snapshots work in Vitest?",
    kw: [
      "vi.useFakeTimers",
      "advanceTimersByTime",
      "toMatchSnapshot",
      "inline snapshot",
      "time control",
    ],
    intent: "Checks you can control time and use snapshots carefully.",
    short:
      "`vi.useFakeTimers()` replaces timers so you can move time forward with `vi.advanceTimersByTime(ms)` or `vi.runAllTimers()`, which makes debounce, polling and timeout code testable without waiting. Restore real timers with `vi.useRealTimers()`. Snapshots work with `toMatchSnapshot()` and `toMatchInlineSnapshot()`, and are updated by running Vitest with the update flag after reviewing the change. Keep snapshots small and meaningful.",
    detail: [
      "Always restore real timers in `afterEach` so other tests are not affected.",
      "Inline snapshots keep the expected value next to the assertion.",
      "A snapshot records what the code does, not whether that is correct.",
    ],
    ex: "A search box with a 300ms debounce is tested by advancing fake time by 300ms.",
    mistakes: [
      "Leaving fake timers on for the next test.",
      "Updating snapshots without reviewing them.",
    ],
    follow: ["Why use inline snapshots?"],
    points: [
      "vi.useFakeTimers controls time",
      "advanceTimersByTime moves it",
      "Restore real timers",
      "Review snapshot updates",
    ],
    notes: ["Fake time on, fake time off."],
    src: [
      ["Vitest: Timers", `${V}/guide/mocking/timers`],
      ["Vitest: Snapshot", `${V}/guide/snapshot`],
    ],
  }),
  q({
    slug: "vitest-coverage",
    topic: "Vitest",
    d: "medium",
    title: "What does test coverage measure, and what are its limits?",
    kw: ["coverage", "v8", "istanbul", "lines branches", "coverage thresholds"],
    intent: "Checks you treat coverage as a signal, not a goal.",
    short:
      "Coverage reports how much of the code ran during the tests: statements, branches, functions and lines. In Vitest you enable it with the coverage option, choosing a provider such as `v8` or `istanbul`. It is useful for finding code that no test touches. It does not show that the code is tested well, because a test can execute a line without asserting anything meaningful. Chasing a percentage encourages weak tests, so use it to find gaps and review important logic directly.",
    detail: [
      "Branch coverage shows untested `if` paths, which is often more useful than line coverage.",
      "Thresholds can fail the run in CI if coverage drops, but keep them realistic.",
      "Exclude generated files and type definitions from the report.",
    ],
    ex: "A coverage report reveals the error branch of a payment function was never tested, so a test is added for it.",
    mistakes: [
      "Treating 100 percent as proof of quality.",
      "Writing assertion-free tests to raise the number.",
    ],
    follow: ["Why is branch coverage valuable?"],
    points: [
      "Measures executed code",
      "Providers v8 or istanbul",
      "Shows gaps, not quality",
      "Thresholds with care",
    ],
    notes: ["Coverage finds gaps, not bugs."],
    src: [["Vitest: Coverage", `${V}/guide/coverage`]],
  }),
  q({
    slug: "rtl-guiding-principle",
    topic: "React Testing Library",
    d: "easy",
    title: "What is the guiding principle of React Testing Library?",
    kw: [
      "react testing library",
      "user-centric",
      "implementation details",
      "behaviour",
      "guiding principles",
    ],
    intent: "Checks you test behaviour instead of internals.",
    short:
      "Testing Library's guiding principle is that the more your tests resemble the way your software is used, the more confidence they give. Tests render the component and interact with it as a user would, finding elements by role, label or text and clicking or typing, rather than checking component state, props or internal methods. That makes tests resilient to refactoring, because renaming a state variable should not break them.",
    detail: [
      "It renders into a real DOM (usually jsdom) and queries what the user would see.",
      "Avoid asserting on implementation details like hook calls or class names.",
      "If a test is hard to write this way, the UI may also be hard to use.",
    ],
    ex: "A test types into 'Email', clicks 'Save' and expects to see 'Saved', without touching the component's state.",
    mistakes: ["Testing internal state.", "Selecting elements by CSS class."],
    follow: ["What are implementation details?"],
    points: [
      "Test like a user",
      "Query what the user sees",
      "Avoid internals",
      "Resilient to refactors",
    ],
    notes: ["Behaviour, not implementation."],
    src: [
      ["Testing Library: Guiding principles", `${TL}/guiding-principles`],
      [
        "Testing Library: React Testing Library intro",
        `${TL}/react-testing-library/intro`,
      ],
    ],
  }),
  q({
    slug: "rtl-render-screen-queries",
    topic: "React Testing Library",
    d: "easy",
    title: "How do render and screen work in React Testing Library?",
    kw: ["render", "screen", "queries", "getByRole", "cleanup"],
    intent: "Checks you can write a basic component test.",
    short:
      '`render(<Component />)` mounts the component into a DOM container attached to the document. The `screen` object exposes the queries bound to the whole document, so you write `screen.getByRole("button", { name: "Save" })` without destructuring from `render`. After the test the rendered output is cleaned up automatically when the test framework supports it. Then assert with matchers from jest-dom, such as `toBeInTheDocument()`.',
    detail: [
      "`screen.debug()` prints the current DOM to help when a query fails.",
      "Queries come in `getBy`, `queryBy` and `findBy` forms.",
      "Wrap components in their providers, such as a router or query client, when rendering.",
    ],
    ex: "A test renders a greeting component and asserts the heading text is in the document.",
    code: [
      [
        "A first test",
        "tsx",
        `import { render, screen } from "@testing-library/react"\n\ntest("shows the greeting", () => {\n  render(<Greeting name="Asha" />)\n  expect(screen.getByRole("heading", { name: /hello, asha/i })).toBeInTheDocument()\n})`,
        [
          "`render` mounts the component.",
          "`screen` queries the document.",
          "The jest-dom matcher asserts presence.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting providers the component needs.",
      "Not using screen.debug when stuck.",
    ],
    follow: ["What does screen.debug do?"],
    points: [
      "render mounts into the DOM",
      "screen queries the document",
      "jest-dom matchers",
      "Provide required context",
    ],
    notes: ["render, screen, assert."],
    src: [
      [
        "Testing Library: React Testing Library intro",
        `${TL}/react-testing-library/intro`,
      ],
      ["Testing Library: API", `${TL}/react-testing-library/api`],
    ],
  }),
  q({
    slug: "rtl-query-priority",
    topic: "React Testing Library",
    d: "medium",
    title: "Which queries should you prefer in Testing Library, and why?",
    kw: [
      "getByRole",
      "getByLabelText",
      "getByTestId",
      "query priority",
      "accessible queries",
    ],
    intent:
      "Checks you choose queries that reflect how users and assistive tech find elements.",
    short:
      "Prefer queries that reflect what users and assistive technology perceive. The recommended priority starts with `getByRole`, with the accessible `name` option, then `getByLabelText` for form fields, `getByPlaceholderText`, `getByText`, `getByDisplayValue`, and then `getByAltText` and `getByTitle`. `getByTestId` is a last resort for cases where nothing else works. Using role and label queries also pushes you to build accessible markup.",
    detail: [
      "A failing `getByRole` often signals a missing label or wrong element.",
      "`getByText` suits non-interactive content.",
      "Test ids do not prove the element is visible or accessible.",
    ],
    ex: 'A form test uses `getByLabelText("Email")` and `getByRole("button", { name: "Submit" })`.',
    mistakes: [
      "Reaching for test ids first.",
      "Selecting by CSS class or tag.",
    ],
    follow: ["What does a failing getByRole tell you?"],
    points: [
      "Role first",
      "Label for form fields",
      "Text for content",
      "Test id is the last resort",
    ],
    notes: ["Query like a user."],
    src: [
      [
        "Testing Library: About queries (priority)",
        `${TL}/queries/about/#priority`,
      ],
      ["Testing Library: ByRole", `${TL}/queries/byrole`],
    ],
  }),
  q({
    slug: "rtl-getby-queryby-findby",
    topic: "React Testing Library",
    d: "medium",
    title: "What is the difference between getBy, queryBy and findBy?",
    kw: ["getBy", "queryBy", "findBy", "async queries", "absence"],
    intent:
      "Checks you use the right query variant, especially for absence and async content.",
    short:
      '`getBy` returns the element and throws if none (or more than one) matches, so it is the default for elements that should be there. `queryBy` returns `null` when nothing matches, which makes it the right choice for asserting that something is not present: `expect(screen.queryByText("Error")).not.toBeInTheDocument()`. `findBy` returns a promise that resolves when the element appears, waiting up to a timeout, so it is used for content that shows up asynchronously. The `All` variants return arrays.',
    detail: [
      "`findBy` is `getBy` combined with `waitFor`.",
      "Multiple matches throw an error with `getBy`, which keeps tests precise.",
      "Never use `getBy` to assert absence, since it throws instead of returning null.",
    ],
    ex: "After clicking 'Load', the test awaits `findByText(\"Orders loaded\")`.",
    code: [
      [
        "Three variants",
        "tsx",
        `expect(screen.getByText("Title")).toBeInTheDocument()\nexpect(screen.queryByText("Error")).not.toBeInTheDocument()\nexpect(await screen.findByText("Loaded")).toBeInTheDocument()`,
        [
          "`getBy` for present elements.",
          "`queryBy` for absence.",
          "`findBy` for async appearance.",
        ],
      ],
    ],
    mistakes: [
      "Using getBy to check something is absent.",
      "Using getBy for content that arrives later.",
    ],
    follow: ["What does the All variant return?"],
    points: [
      "getBy throws if missing",
      "queryBy returns null",
      "findBy waits asynchronously",
      "All variants return arrays",
    ],
    notes: ["Present, absent, eventual."],
    src: [
      ["Testing Library: About queries", `${TL}/queries/about`],
      ["Testing Library: Async APIs", `${TL}/dom-testing-library/api-async`],
    ],
  }),
  q({
    slug: "rtl-user-event-vs-fireevent",
    topic: "React Testing Library",
    d: "medium",
    title: "Why prefer userEvent over fireEvent?",
    kw: ["userEvent", "fireEvent", "user interaction", "events", "setup"],
    intent: "Checks you simulate realistic interactions.",
    short:
      "`fireEvent` dispatches a single DOM event, such as `click`, directly. `userEvent` simulates what a real user does and fires the whole sequence of events: typing triggers focus, key down, input and key up for each character, and clicking includes pointer and focus events. This catches more real behaviour, such as disabled buttons not responding. Call `userEvent.setup()` once per test and `await` the interactions, which are asynchronous.",
    detail: [
      "`fireEvent` is still useful for events that `userEvent` does not model.",
      'Typing with `await user.type(input, "hello")` types each character.',
      "Forgetting to await an interaction causes flaky assertions.",
    ],
    ex: "A test types a name, tabs to the next field and clicks submit using `userEvent`.",
    code: [
      [
        "userEvent",
        "tsx",
        `const user = userEvent.setup()\nrender(<Login />)\nawait user.type(screen.getByLabelText("Email"), "a@b.co")\nawait user.click(screen.getByRole("button", { name: "Sign in" }))`,
        ["`setup()` creates a user session.", "Each interaction is awaited."],
      ],
    ],
    mistakes: [
      "Not awaiting userEvent calls.",
      "Using fireEvent.change for typing.",
    ],
    follow: ["When would you still use fireEvent?"],
    points: [
      "userEvent mimics the full interaction",
      "fireEvent dispatches one event",
      "setup() then await",
      "More realistic behaviour",
    ],
    notes: ["await user.click."],
    src: [["Testing Library: user-event intro", `${TL}/user-event/intro`]],
  }),
  q({
    slug: "rtl-jest-dom-matchers",
    topic: "React Testing Library",
    d: "easy",
    title: "What does jest-dom add to your tests?",
    kw: [
      "jest-dom",
      "toBeInTheDocument",
      "toBeDisabled",
      "toHaveTextContent",
      "custom matchers",
    ],
    intent:
      "Checks you know the matcher library that makes DOM assertions readable.",
    short:
      "`@testing-library/jest-dom` adds matchers for the DOM to Jest and Vitest, such as `toBeInTheDocument`, `toBeVisible`, `toBeDisabled`, `toHaveTextContent`, `toHaveValue`, `toHaveAttribute` and `toHaveAccessibleName`. They read like the behaviour you are checking and give clearer failure messages than comparing raw properties. You import it once in the setup file so the matchers are available in every test.",
    detail: [
      "`toBeVisible` checks things like `display: none` and the `hidden` attribute.",
      "`toHaveAccessibleName` verifies the label a screen reader would announce.",
      "In Vitest, import the Vitest-specific entry or extend `expect` in the setup file.",
    ],
    ex: "A test asserts the submit button is disabled until the form is valid.",
    mistakes: [
      "Asserting `element.disabled === true` and getting poor messages.",
      "Forgetting the setup import so matchers are undefined.",
    ],
    follow: ["Where do you register the matchers?"],
    points: [
      "DOM-specific matchers",
      "Readable assertions",
      "Better error messages",
      "Register in a setup file",
    ],
    notes: ["Import once in setup."],
    src: [["Testing Library: jest-dom", `${TL}/ecosystem-jest-dom`]],
  }),
  q({
    slug: "rtl-testing-forms-and-conditional-ui",
    topic: "React Testing Library",
    d: "medium",
    title: "How would you test a form with validation errors?",
    kw: [
      "form testing",
      "validation message",
      "submit",
      "getByRole alert",
      "user flow",
    ],
    intent:
      "Checks you can test a complete user flow, including failure paths.",
    short:
      'Render the form, then act as the user: type into fields found by label, click the submit button found by role and name, and assert on what appears. For the invalid case, submit with empty or wrong values and check that the error message shows, for example with `findByRole("alert")` or `findByText`. For the valid case, fill the form correctly and check that the submit handler was called with the right values, or that the success message appears. Test both paths.',
    detail: [
      "Pass a `vi.fn()` or `jest.fn()` as the submit prop to assert on the data.",
      "Await validation that runs asynchronously.",
      "Check that focus and error messages are accessible, not only visible.",
    ],
    ex: "Submitting an empty sign-up form shows 'Email is required', and filling it correctly calls `onSubmit` with the entered values.",
    code: [
      [
        "Invalid then valid",
        "tsx",
        `const onSubmit = vi.fn()\nrender(<SignUp onSubmit={onSubmit} />)\nawait user.click(screen.getByRole("button", { name: "Create account" }))\nexpect(await screen.findByText("Email is required")).toBeInTheDocument()\nexpect(onSubmit).not.toHaveBeenCalled()`,
        [
          "Submitting empty shows the error.",
          "The submit handler is not called.",
        ],
      ],
    ],
    mistakes: [
      "Only testing the happy path.",
      "Checking internal state rather than visible messages.",
    ],
    follow: ["How would you assert the data passed to onSubmit?"],
    points: [
      "Act like a user",
      "Find by label and role",
      "Test invalid and valid paths",
      "Await async validation",
    ],
    notes: ["Test the failure path too."],
    src: [
      [
        "Testing Library: React Testing Library example",
        `${TL}/react-testing-library/example-intro`,
      ],
      ["Testing Library: About queries", `${TL}/queries/about`],
    ],
  }),
  q({
    slug: "why-msw-for-api-mocking",
    topic: "MSW",
    d: "medium",
    title:
      "What is Mock Service Worker and why use it instead of mocking fetch?",
    kw: [
      "msw",
      "mock service worker",
      "network mocking",
      "request handlers",
      "fetch",
    ],
    intent:
      "Checks you know why network-level mocking gives more realistic tests.",
    short:
      "Mock Service Worker, MSW, intercepts HTTP requests at the network level and answers them with mocked responses defined in request handlers. Your application code still calls `fetch` or Axios as usual, so the test exercises the real request code, headers and response handling instead of a replaced function. The same handlers can be reused in tests, in Storybook and in the browser during development. Mocking `fetch` directly ties tests to implementation details.",
    detail: [
      "In Node tests, `setupServer` uses the handlers; in the browser, `setupWorker` uses a service worker.",
      "Handlers describe the API contract in one place.",
      "Tests become independent of how the app makes the request.",
    ],
    ex: "A test for the orders page defines a handler for `GET /api/orders` and the page loads it as in production.",
    mistakes: [
      "Mocking fetch in every test with different shapes.",
      "Letting unmocked requests reach the real network.",
    ],
    follow: ["What is the difference between setupServer and setupWorker?"],
    points: [
      "Intercepts at the network level",
      "Real fetch code runs",
      "Reusable handlers",
      "Node and browser support",
    ],
    notes: ["Mock the network, not the client."],
    src: [
      ["MSW: Getting started", `${M}/getting-started`],
      ["MSW: Philosophy", `${M}/philosophy`],
    ],
  }),
  q({
    slug: "msw-handlers-and-server-lifecycle",
    topic: "MSW",
    d: "medium",
    title: "How do you write MSW request handlers and set up the test server?",
    kw: ["http.get", "HttpResponse", "setupServer", "listen", "resetHandlers"],
    intent: "Checks you can wire MSW into a test suite.",
    short:
      'Define handlers with the `http` helpers, for example `http.get("/api/orders", () => HttpResponse.json([...]))`, and pass them to `setupServer` from `msw/node`. In the test setup file call `server.listen()` before all tests, `server.resetHandlers()` after each test so runtime overrides do not leak, and `server.close()` after all tests. The handler resolver receives the `request` and `params` and returns a response created with `HttpResponse`.',
    detail: [
      'Use `onUnhandledRequest: "error"` in `listen` to fail on requests you forgot to mock.',
      "Relative URLs may need a base URL in a Node environment.",
      "Keep default handlers for the happy path and override per test.",
    ],
    ex: "The setup file starts the server for the whole suite, and each test relies on the default order handlers.",
    code: [
      [
        "Server setup",
        "ts",
        `import { http, HttpResponse } from "msw"\nimport { setupServer } from "msw/node"\n\nexport const server = setupServer(\n  http.get("/api/orders", () => HttpResponse.json([{ id: 1 }]))\n)\n\nbeforeAll(() => server.listen({ onUnhandledRequest: "error" }))\nafterEach(() => server.resetHandlers())\nafterAll(() => server.close())`,
        [
          "Handlers describe the API.",
          "`listen`, `resetHandlers` and `close` manage the lifecycle.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting resetHandlers so overrides leak.",
      "Ignoring unhandled requests.",
    ],
    follow: ["What does onUnhandledRequest do?"],
    points: [
      "http handlers return HttpResponse",
      "setupServer in Node",
      "listen, resetHandlers, close",
      "Fail on unhandled requests",
    ],
    notes: ["listen, reset, close."],
    src: [
      ["MSW: setupServer", `${M}/api/setup-server`],
      ["MSW: http", `${M}/api/http`],
      ["MSW: HttpResponse", `${M}/api/http-response`],
    ],
  }),
  q({
    slug: "msw-override-errors-and-loading",
    topic: "MSW",
    d: "hard",
    title: "How do you test error and loading states with MSW?",
    kw: [
      "server.use",
      "error response",
      "network error",
      "delay",
      "runtime override",
    ],
    intent: "Checks you can simulate failures for one test only.",
    short:
      "Override a handler for a single test with `server.use(...)`: return an error status such as `new HttpResponse(null, { status: 500 })`, or `HttpResponse.error()` to simulate a network failure. The override applies until `server.resetHandlers()` runs after the test, so other tests keep the default happy-path handlers. To test a loading state, delay the response with `delay()` so the UI stays in loading long enough to assert on it, then await the final state.",
    detail: [
      "Test that the user sees a helpful message and a way to retry.",
      "Check also that no stale data is shown after an error.",
      "Prefer realistic error bodies matching the real API.",
    ],
    ex: "A test makes `GET /api/orders` return 500 and expects 'Something went wrong. Try again.' on screen.",
    code: [
      [
        "A failing endpoint",
        "ts",
        `server.use(\n  http.get("/api/orders", () => new HttpResponse(null, { status: 500 }))\n)\nrender(<Orders />)\nexpect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i)`,
        [
          "`server.use` replaces the handler for this test.",
          "The UI is expected to show a failure message.",
        ],
      ],
    ],
    mistakes: [
      "Only testing the success response.",
      "Overrides leaking because resetHandlers is missing.",
    ],
    follow: ["How does MSW simulate a network failure?"],
    points: [
      "server.use overrides per test",
      "HttpResponse with status for errors",
      "HttpResponse.error for network failure",
      "delay for loading",
    ],
    notes: ["Override, assert, reset."],
    src: [
      ["MSW: setupServer.use", `${M}/api/setup-server/use`],
      ["MSW: Error responses", `${M}/http/mocking-responses/error-responses`],
      ["MSW: Network errors", `${M}/http/mocking-responses/network-errors`],
    ],
  }),
  q({
    slug: "msw-in-the-browser-development",
    topic: "MSW",
    d: "medium",
    title: "How can MSW be used in the browser during development?",
    kw: [
      "setupWorker",
      "service worker",
      "development mocking",
      "backend not ready",
      "storybook",
    ],
    intent: "Checks you know the second environment MSW supports.",
    short:
      "In the browser MSW uses a service worker, registered with `setupWorker(...handlers)` and started with `worker.start()`. The worker intercepts the app's real requests and returns the mocked responses, so a team can build the UI before the backend is ready or work offline. The same handlers used in tests can be reused. Start it only in development and keep it out of production builds.",
    detail: [
      "A worker script file must be generated into the public folder with the MSW CLI.",
      "Requests can still be seen in the browser's network tab.",
      "Remember to switch to the real API when it is ready.",
    ],
    ex: "While the orders API is still being built, the front-end team runs the app against MSW handlers.",
    mistakes: [
      "Shipping the mock worker to production.",
      "Handlers drifting from the real API.",
    ],
    follow: ["How is it different from setupServer?"],
    points: [
      "setupWorker uses a service worker",
      "Intercepts real requests",
      "Reuse handlers",
      "Development only",
    ],
    notes: ["Worker for browser, server for Node."],
    src: [
      ["MSW: setupWorker", `${M}/api/setup-worker`],
      ["MSW: Browser integration", `${M}/integrations/browser`],
    ],
  }),
  q({
    slug: "testing-custom-hooks-renderhook",
    topic: "Testing hooks & async UI",
    d: "medium",
    title: "How do you test a custom hook?",
    kw: ["renderHook", "custom hook", "act", "wrapper", "rerender"],
    intent:
      "Checks you can test hook logic without building a throwaway component.",
    short:
      "Use `renderHook(() => useCounter())` from React Testing Library. It renders a tiny test component that calls your hook and returns a `result` object whose `current` property holds the latest return value. Wrap state-changing calls in `act(() => result.current.increment())` so React applies the update before you assert. Use the `wrapper` option when the hook needs providers such as a query client, and `rerender` to change its inputs. If a hook is only used by one component, testing the component can be enough.",
    detail: [
      "Read `result.current` again after each update, since it is replaced on re-render.",
      "Test the hook's behaviour, such as its returned values and updates, not its internals.",
      "Complex asynchronous hooks may be easier to test through a component using MSW.",
    ],
    ex: "A `useCounter` hook is tested by calling `increment` inside `act` and asserting that `count` is 1.",
    code: [
      [
        "renderHook",
        "tsx",
        `const { result } = renderHook(() => useCounter())\nact(() => {\n  result.current.increment()\n})\nexpect(result.current.count).toBe(1)`,
        [
          "`result.current` holds the latest value.",
          "`act` flushes the state update before the assertion.",
        ],
      ],
    ],
    mistakes: [
      "Keeping an old result.current in a variable.",
      "Forgetting act around updates.",
    ],
    follow: ["What is the wrapper option for?"],
    points: [
      "renderHook returns result.current",
      "act for state updates",
      "wrapper for providers",
      "rerender changes inputs",
    ],
    notes: ["Read result.current after act."],
    src: [
      [
        "Testing Library: renderHook",
        `${TL}/react-testing-library/api#renderhook`,
      ],
      ["React: act", "https://react.dev/reference/react/act"],
    ],
  }),
  q({
    slug: "waitfor-and-async-ui",
    topic: "Testing hooks & async UI",
    d: "medium",
    title: "How do waitFor and findBy help with async UI?",
    kw: ["waitFor", "findBy", "async ui", "timeout", "flaky tests"],
    intent: "Checks you can wait for UI changes without fixed sleeps.",
    short:
      "UI that updates after a request or timer is not there immediately after an action, so assertions must wait. `findBy` queries wait until the element appears, and `waitFor(() => expect(...))` repeatedly runs a callback until it stops throwing or the timeout (default one second) is reached. Prefer these to arbitrary `setTimeout` waits, which make tests slow and flaky. Put one assertion in `waitFor` and side effects outside it, because the callback may run many times.",
    detail: [
      "`waitForElementToBeRemoved` waits for something such as a spinner to disappear.",
      "Increase the timeout only when there is a real reason.",
      "Use fake timers for time-based logic and real waiting only for async resolution.",
    ],
    ex: 'After submitting, the test awaits `findByText("Saved")` instead of sleeping for a second.',
    mistakes: [
      "Using fixed sleeps.",
      "Putting clicks or other side effects inside waitFor.",
    ],
    follow: ["How do you wait for a spinner to go away?"],
    points: [
      "findBy waits for presence",
      "waitFor retries assertions",
      "No fixed sleeps",
      "Keep side effects outside waitFor",
    ],
    notes: ["Wait for outcomes, not time."],
    src: [
      ["Testing Library: Async APIs", `${TL}/dom-testing-library/api-async`],
    ],
  }),
  q({
    slug: "act-warnings-explained",
    topic: "Testing hooks & async UI",
    d: "hard",
    title:
      "What does the 'not wrapped in act(...)' warning mean and how do you fix it?",
    kw: ["act warning", "state update", "async", "testing library", "flushing"],
    intent:
      "Checks you understand the cause rather than suppressing the warning.",
    short:
      "React warns when a state update happens in a test outside of `act`, because the test may assert before React has applied the update and rendered. Testing Library already wraps its own helpers like `render`, `userEvent` and `findBy` in `act`, so the warning usually means a state update happened after your test finished waiting, such as a request resolving later. The fix is to wait for the visible result with `await screen.findBy...` or `waitFor`, not to wrap everything in `act` by hand or silence the warning.",
    detail: [
      "Wrap direct calls that change state, such as `result.current.update()` from `renderHook`, in `act`.",
      "Make sure all pending requests finish, or are mocked, before the test ends.",
      "Cleaning up timers and subscriptions in components also prevents late updates.",
    ],
    ex: "A test clicked 'Load' and ended immediately; the response arrived afterwards and triggered the warning. Awaiting the loaded text fixes it.",
    mistakes: ["Silencing the warning.", "Wrapping every line in act."],
    follow: ["Why do Testing Library helpers rarely need manual act?"],
    points: [
      "act applies updates before assertions",
      "Helpers already use it",
      "Usually means unawaited async work",
      "Await the visible result",
    ],
    notes: ["Wait for the outcome."],
    src: [
      ["React: act", "https://react.dev/reference/react/act"],
      ["Testing Library: Async APIs", `${TL}/dom-testing-library/api-async`],
    ],
  }),
])
