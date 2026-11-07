import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "mocking",
  title: "Mocking and test doubles",
  topic: "Mocking",
  minutes: 60,
  overview:
    "Replace slow or unpredictable dependencies with test doubles: stubs, spies and mocks with vi.fn and vi.spyOn, fake timers, and when not to mock.",
  objectives: [
    "Name the kinds of test double: dummy, stub, fake, spy and mock",
    "Create a mock function and assert how it was called",
    "Use stubs to control return values, including async ones",
    "Control time with fake timers",
    "Recognise over-mocking",
  ],
  prerequisites: ["lesson.testing.unit-tests"],
  sections: [
    {
      kind: "explain",
      heading: "Test doubles",
      body: [
        "A unit under test often depends on things that are slow, random, expensive or outside your control: a payment service, the clock, an email server, the network. A **test double** stands in for such a dependency so that the test stays fast and deterministic. The common kinds: a **dummy** (passed around but never used), a **stub** (returns canned answers), a **fake** (a simple working implementation, such as an in-memory repository), a **spy** (records how it was called while the real behaviour may remain) and a **mock** (a double with expectations about the calls it should receive). Many tools use the word *mock* for all of them.",
        "The easiest way to use doubles is **dependency injection**: pass the dependency into the function or class instead of creating it inside. Then the test passes in a double and the production code passes in the real thing.",
      ],
    },
    {
      kind: "code",
      heading: "A mock function as a spy and a stub",
      example: {
        title: "vi.fn",
        language: "javascript",
        code: 'import { describe, expect, it, vi } from "vitest"\n\nasync function notifyOverdue(users, emailer) {\n  let sent = 0\n  for (const user of users) {\n    if (user.overdue) {\n      await emailer.send(user.email, "Your invoice is overdue")\n      sent++\n    }\n  }\n  return sent\n}\n\ndescribe("notifyOverdue", () => {\n  it("emails only the users with an overdue invoice", async () => {\n    const emailer = { send: vi.fn().mockResolvedValue(true) }\n    const users = [\n      { email: "a@example.com", overdue: true },\n      { email: "b@example.com", overdue: false },\n      { email: "c@example.com", overdue: true },\n    ]\n\n    const sent = await notifyOverdue(users, emailer)\n\n    expect(sent).toBe(2)\n    expect(emailer.send).toHaveBeenCalledTimes(2)\n    expect(emailer.send).toHaveBeenCalledWith("a@example.com", "Your invoice is overdue")\n    expect(emailer.send).not.toHaveBeenCalledWith("b@example.com", expect.anything())\n  })\n\n  it("propagates an error from the emailer", async () => {\n    const emailer = { send: vi.fn().mockRejectedValue(new Error("smtp down")) }\n    await expect(notifyOverdue([{ email: "a@example.com", overdue: true }], emailer)).rejects.toThrow("smtp down")\n  })\n})',
        walkthrough: [
          "The emailer is **injected**, so the test passes a plain object whose `send` is a mock function: `vi.fn()` records every call and `mockResolvedValue(true)` makes it return a resolved promise (a **stub** answer).",
          "The assertions use the mock as a **spy**: `toHaveBeenCalledTimes(2)` and `toHaveBeenCalledWith(...)` check which emails were sent, and `not.toHaveBeenCalledWith` checks that nobody else got one. `expect.anything()` matches any value.",
          "`mockRejectedValue` makes the stub fail, which lets you test the error path that would be hard to produce with a real mail server. Use `await expect(promise).rejects.toThrow(...)` for async errors.",
          "No real email is sent, nothing depends on the network and the test runs in a few milliseconds.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Spying on methods and controlling time",
      example: {
        title: "vi.spyOn and fake timers",
        language: "javascript",
        code: 'import { afterEach, describe, expect, it, vi } from "vitest"\n\nconst greeter = {\n  greeting() {\n    return "Good " + (new Date().getHours() < 12 ? "morning" : "afternoon")\n  },\n  greet(name) {\n    return `${this.greeting()}, ${name}`\n  },\n}\n\ndescribe("greeter", () => {\n  afterEach(() => {\n    vi.restoreAllMocks()\n    vi.useRealTimers()\n  })\n\n  it("uses the greeting it is given (spyOn with a stubbed return value)", () => {\n    vi.spyOn(greeter, "greeting").mockReturnValue("Hello")\n    expect(greeter.greet("Ana")).toBe("Hello, Ana")\n  })\n\n  it("depends on the clock (fake timers and a fixed time)", () => {\n    vi.useFakeTimers()\n    vi.setSystemTime(new Date("2024-05-01T09:00:00"))\n    expect(greeter.greet("Ana")).toBe("Good morning, Ana")\n    vi.setSystemTime(new Date("2024-05-01T15:00:00"))\n    expect(greeter.greet("Ana")).toBe("Good afternoon, Ana")\n  })\n\n  it("runs delayed code without waiting (advanceTimersByTime)", () => {\n    vi.useFakeTimers()\n    const callback = vi.fn()\n    setTimeout(callback, 5000)\n    expect(callback).not.toHaveBeenCalled()\n    vi.advanceTimersByTime(5000)\n    expect(callback).toHaveBeenCalledTimes(1)\n  })\n})',
        walkthrough: [
          '`vi.spyOn(object, "method")` wraps an existing method. With `mockReturnValue` it also replaces the result, so `greet` uses `"Hello"` without calling the real clock.',
          "Time makes tests flaky. `vi.useFakeTimers()` and `vi.setSystemTime(...)` make `new Date()` return a fixed moment, so the test gives the same result at any hour of the day.",
          "`vi.advanceTimersByTime(5000)` moves the fake clock forward, so code that waits five seconds can be tested instantly.",
          "`afterEach` restores everything. Always undo spies and timers (`vi.restoreAllMocks()`, `vi.useRealTimers()`), or one test can leak its doubles into the next one.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Mock modules and the limits of mocking",
      body: [
        'To replace a whole module (for example one that calls a network library) Vitest has `vi.mock("./path", factory)`, which is hoisted to the top of the file. Jest has the same idea with `jest.mock`; in Java, Mockito offers `mock(Class)` and `when(...).thenReturn(...)`; in Python, `unittest.mock` and pytest\'s `monkeypatch` do the same job.',
        "Mock the **boundaries** of your system (network, clock, randomness, email, payment), not your own internals. **Over-mocking** makes tests that only repeat the implementation: they pass while the real system is broken and fail when you refactor. If a test needs many mocks, the design may have too many dependencies. Prefer a **fake** (an in-memory implementation) over a long list of stubbed calls, and cover the real integration with a few integration tests.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Mocking everything, including the code you wrote.",
          fix: "Mock only boundaries such as network, time and external services.",
        },
        {
          mistake: "Forgetting to restore mocks and timers.",
          fix: "Use afterEach with restoreAllMocks and useRealTimers.",
        },
        {
          mistake:
            "Asserting that a mock was called without checking the arguments.",
          fix: "Check the arguments and the number of calls that matter.",
        },
        {
          mistake: "Tests that mirror the implementation line by line.",
          fix: "Assert on results and important interactions only.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Testing a function that charges a card",
      scenario:
        "chargeCustomer(order, paymentGateway) must charge once and mark the order as paid.",
      body: [
        'Inject a stub gateway with `charge: vi.fn().mockResolvedValue({ id: "tx1" })`. Assert that `charge` was called once with the order total and that the order is now paid. Add a second test where `charge` rejects and the order stays unpaid.',
        "A separate integration test against the payment provider's sandbox checks the real contract.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "stub-vs-spy",
      prompt: "A test double that returns canned answers is called a...",
      options: ["Stub", "Spy", "Dummy"],
      answer: 0,
      explanation: "A stub supplies fixed responses; a spy records calls.",
    },
    {
      type: "single",
      id: "fake-timers",
      prompt: "Why use fake timers in tests?",
      options: [
        "To control time and avoid waiting or flaky results",
        "To make the code faster in production",
        "To skip assertions",
      ],
      answer: 0,
      explanation: "Fake timers make time deterministic.",
    },
    {
      type: "truefalse",
      id: "overmock",
      statement:
        "A test that mocks every dependency and only repeats the implementation is a good test.",
      answer: false,
      explanation:
        "Over-mocked tests pass while the system is broken and break on every refactor.",
    },
    {
      type: "blank",
      id: "restore-fn",
      prompt: "To undo spies after each test in Vitest, call vi.___AllMocks().",
      answer: "restore",
      explanation:
        "`vi.restoreAllMocks()` restores the original implementations.",
    },
  ],
  assignment: {
    title: "Mock the boundaries",
    task: [
      "Write a function sendWelcomeEmails(users, emailer, clock) that sends one email to each user who joined in the last 24 hours, using an injected emailer and an injected clock function.",
      "Test it with a stub emailer, a fixed clock and a case where the emailer rejects.",
    ],
    checklist: [
      "Dependencies are injected",
      "The mock's calls and arguments are asserted",
      "Time is controlled",
      "The error path is tested",
    ],
    hints: ['Pass `() => new Date("2024-05-01T12:00:00Z")` as the clock.'],
    minutes: 25,
  },
  exercises: [
    {
      slug: "call-counter",
      title: "A function with a callback",
      task: [
        "Write retry(fn, times) that calls fn up to times times and returns the first call's result that does not throw; if all calls throw, it throws the last error. (You will test it with a mock.)",
      ],
      language: "javascript",
      starter: "function retry(fn, times) {\n}",
      solution:
        "function retry(fn, times) {\n  let last\n  for (let i = 0; i < times; i++) {\n    try {\n      return fn()\n    } catch (err) {\n      last = err\n    }\n  }\n  throw last\n}",
      hints: ["Remember the last error."],
      checklist: [
        "Stops at the first success",
        "Throws the last error when all calls fail",
      ],
    },
  ],
  revisionNotes: [
    "Doubles: dummy, stub (canned answers), fake (simple working copy), spy (records), mock (expectations)",
    "Inject dependencies; vi.fn, mockReturnValue, mockResolvedValue, toHaveBeenCalledWith",
    "vi.spyOn to wrap methods; restoreAllMocks after each test",
    "Fake timers control time; mock boundaries, not internals",
  ],
  resources: [
    {
      label: "Vitest: vi API",
      url: "https://vitest.dev/api/vi",
    },
    {
      label: "Vitest: Mocking guide",
      url: "https://vitest.dev/guide/mocking",
    },
    {
      label: "Mockito",
      url: "https://site.mockito.org/",
    },
    {
      label: "pytest: monkeypatch",
      url: "https://docs.pytest.org/en/stable/how-to/monkeypatch.html",
    },
  ],
})
