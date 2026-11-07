import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "e2e-tests",
  title: "End-to-end tests with Playwright",
  topic: "E2E",
  minutes: 60,
  overview:
    "Test the application the way a user uses it, in a real browser: locators, actions, web-first assertions with automatic waiting, configuration, and how to keep E2E tests reliable.",
  objectives: [
    "Explain what end-to-end tests cover and their cost",
    "Write a Playwright test with locators, actions and assertions",
    "Explain auto-waiting and why fixed sleeps are a mistake",
    "Choose stable locators: roles, labels and text before CSS",
    "Configure base URL and web server and run the tests",
  ],
  prerequisites: ["lesson.testing.integration-tests"],
  sections: [
    {
      kind: "explain",
      heading: "What end-to-end tests are for",
      body: [
        "An **end-to-end (E2E) test** drives the real application through its user interface in a real browser: it opens a page, types into fields, clicks buttons and checks what the user would see. It passes only if the front end, the back end, the database and the configuration all work together, so it gives the strongest confidence for important journeys such as signing up, searching and checking out.",
        "The price is speed and stability: E2E tests are the slowest tests and the most likely to be flaky, so keep them **few and valuable**: cover the main user journeys, and leave the many detailed cases to unit and integration tests (the test pyramid). **Playwright** is a popular tool for this. It runs Chromium, Firefox and WebKit, waits automatically for the page, and records traces to help debugging.",
      ],
    },
    {
      kind: "code",
      heading: "A first Playwright test",
      example: {
        title: "Locators, actions and assertions",
        language: "javascript",
        code: 'import { test, expect } from "@playwright/test"\n\nconst page_html = `\n  <h1>Sign in</h1>\n  <label>Email <input type="email"></label>\n  <label>Password <input type="password"></label>\n  <button id="go">Sign in</button>\n  <p id="status" role="status"></p>\n  <script>\n    document.getElementById("go").addEventListener("click", () => {\n      setTimeout(() => {\n        document.getElementById("status").textContent = "Welcome back, Ana"\n      }, 300)\n    })\n  </script>`\n\ntest.describe("sign in", () => {\n  test.beforeEach(async ({ page }) => {\n    await page.setContent(page_html)\n  })\n\n  test("shows the welcome message after signing in", async ({ page }) => {\n    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()\n    await page.getByLabel("Email").fill("ana@example.com")\n    await page.getByLabel("Password").fill("secret123")\n    await page.getByRole("button", { name: "Sign in" }).click()\n    await expect(page.getByRole("status")).toHaveText("Welcome back, Ana")\n  })\n\n  test("keeps the status empty before anything is clicked", async ({ page }) => {\n    await expect(page.getByRole("status")).toBeEmpty()\n    await expect(page.getByLabel("Email")).toHaveValue("")\n  })\n})',
        walkthrough: [
          '`test` and `expect` come from `@playwright/test`. Each test receives a fresh browser **page** in its own isolated context, so tests do not share cookies or storage. In a real project you would call `page.goto("/login")` instead of `page.setContent(...)`, which is used here only to make the example self-contained.',
          '**Locators** find elements the way a user perceives them: `getByRole("button", { name: "Sign in" })`, `getByLabel("Email")`, `getByText(...)`, `getByPlaceholder(...)`. Prefer these over CSS or XPath selectors, which break when the markup changes. When nothing user-facing exists, add a `data-testid` attribute and use `getByTestId`.',
          "**Actions** such as `fill` and `click` wait until the element is attached, visible, enabled and stable before they act. This is **auto-waiting**.",
          "**Web-first assertions** like `toHaveText`, `toBeVisible`, `toHaveValue` and `toBeEmpty` retry until they pass or time out. The welcome text appears 300 ms after the click, and the assertion simply waits for it. Never use fixed sleeps such as `waitForTimeout(500)`; they make tests slow and still flaky.",
          "`test.describe` groups tests and `test.beforeEach` runs before each of them. Both tests pass.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Configuration and running",
      example: {
        title: "playwright.config.js",
        language: "javascript",
        code: 'import { defineConfig } from "@playwright/test"\n\nexport default defineConfig({\n  testDir: "./e2e",\n  retries: process.env.CI ? 2 : 0,\n  use: {\n    baseURL: "http://127.0.0.1:3000",\n    trace: "on-first-retry",\n  },\n  webServer: {\n    command: "npm run start",\n    url: "http://127.0.0.1:3000",\n    reuseExistingServer: !process.env.CI,\n  },\n})',
        walkthrough: [
          '`testDir` is where the test files live. `use.baseURL` lets tests call `page.goto("/login")` with a relative path.',
          "`webServer` starts your application before the tests and waits until the `url` answers; `reuseExistingServer` skips the start if you already run it locally.",
          '`retries` re-runs failing tests (here only in continuous integration) and `trace: "on-first-retry"` records a trace of the failed run, which you open with `npx playwright show-trace` to see the page at every step.',
          "Run the tests with `npx playwright test`; add `--ui` for an interactive mode, `--headed` to watch the browser and `npx playwright codegen` to record actions as code.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Making E2E tests reliable",
      diagram: {
        kind: "table",
        title: "Practices that reduce flakiness",
        headers: ["Do", "Avoid"],
        rows: [
          [
            "Locate by role, label and text",
            "Long CSS or XPath chains tied to the markup",
          ],
          [
            "Use web-first assertions (expect(locator))",
            "Fixed sleeps and reading values once with no retry",
          ],
          [
            "Create test data through the API or database",
            "Clicking through long setup screens in every test",
          ],
          [
            "Keep tests independent and parallel",
            "Tests that need other tests to run first",
          ],
          [
            "Test a few critical journeys",
            "Testing every edge case through the browser",
          ],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using waitForTimeout (fixed sleeps).",
          fix: "Rely on auto-waiting and web-first assertions.",
        },
        {
          mistake: "Selecting elements by fragile CSS classes.",
          fix: "Use roles, labels, text or data-testid.",
        },
        {
          mistake: "Making every test log in through the UI.",
          fix: "Log in once through the API and reuse the stored session state.",
        },
        {
          mistake: "Writing hundreds of E2E tests.",
          fix: "Keep E2E tests for key journeys and push detail down to faster tests.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A checkout journey",
      scenario: "The shop must never lose the ability to buy.",
      body: [
        "Write one E2E test: open the product page, add the item to the basket, go to checkout, fill the shipping form with test data, pay with the sandbox card and assert that the order confirmation shows the order number. Seed the product through an API call before the test and clean up afterwards.",
        "Run it on every pull request in CI, with traces uploaded on failure.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "e2e-scope",
      prompt: "What does an E2E test exercise?",
      options: [
        "The whole system through the user interface",
        "One function in isolation",
        "Only the database",
      ],
      answer: 0,
      explanation: "E2E tests drive the real application like a user.",
    },
    {
      type: "single",
      id: "locator-pref",
      prompt: "Which locator is the most stable choice?",
      options: [
        'getByRole("button", { name: "Sign in" })',
        "div > div:nth-child(3) > button",
        "//div[3]/button",
      ],
      answer: 0,
      explanation:
        "Role-and-name locators follow what the user sees and survive markup changes.",
    },
    {
      type: "single",
      id: "auto-wait",
      prompt: "What does Playwright do before it clicks a button?",
      options: [
        "Waits until the button is visible, enabled and stable",
        "Nothing; it clicks at once",
        "Waits exactly one second",
      ],
      answer: 0,
      explanation: "Auto-waiting makes fixed sleeps unnecessary.",
    },
    {
      type: "truefalse",
      id: "sleep-bad",
      statement: "waitForTimeout is the recommended way to wait for the page.",
      answer: false,
      explanation:
        "Use auto-waiting and web-first assertions; fixed sleeps cause slow and flaky tests.",
    },
  ],
  assignment: {
    title: "One journey, done well",
    task: [
      "Pick a small web page or app you can run locally and write a Playwright test for one important journey (for example search, then open a result), using role or label locators and web-first assertions.",
      "Run it with --headed once to watch it, and add a trace on retry in the configuration.",
    ],
    checklist: [
      "Locators use roles, labels or text",
      "No fixed sleeps are used",
      "The configuration has baseURL and webServer",
      "I opened a trace of a run",
    ],
    hints: [
      "npx playwright codegen http://localhost:3000 records code you can clean up.",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "e2e-plan",
      title: "Choose the tests",
      task: [
        "From this list, mark which should be E2E tests (E) and which are better as unit or integration tests (U): (1) a user can sign up and sees a welcome page; (2) the email validator rejects 12 invalid formats; (3) the search page shows results after typing; (4) a discount calculation rounds to two decimals; (5) checkout completes with a sandbox card.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. E\n2. U\n3. E\n4. U\n5. E",
      hints: [
        "Journeys through the UI are E2E; detailed rules are unit tests.",
      ],
      checklist: [
        "Whole journeys are E2E",
        "Many input cases are unit tests",
        "Calculation rules are unit tests",
      ],
    },
  ],
  revisionNotes: [
    "E2E drives the real app in a browser: slow, valuable, few",
    "Locators by role, label, text; data-testid as fallback",
    "Auto-waiting and web-first assertions; no fixed sleeps",
    "Config: testDir, baseURL, webServer, retries, trace; npx playwright test",
  ],
  resources: [
    {
      label: "Playwright: Writing tests",
      url: "https://playwright.dev/docs/writing-tests",
    },
    {
      label: "Playwright: Locators",
      url: "https://playwright.dev/docs/locators",
    },
    {
      label: "Playwright: Assertions",
      url: "https://playwright.dev/docs/test-assertions",
    },
    {
      label: "Playwright: Best practices",
      url: "https://playwright.dev/docs/best-practices",
    },
  ],
})
