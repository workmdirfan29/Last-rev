import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "integration-tests",
  title: "Integration tests",
  topic: "Integration tests",
  minutes: 75,
  overview:
    "Test that parts work together: a service with its repository, and an HTTP API called over a real connection. Learn the test pyramid, setup and teardown, and test data isolation.",
  objectives: [
    "Explain what integration tests cover that unit tests do not",
    "Place unit, integration and end-to-end tests on the test pyramid",
    "Write an integration test for a service and a store, and for an HTTP endpoint",
    "Use beforeEach and afterAll to isolate test data",
  ],
  prerequisites: ["lesson.testing.unit-tests"],
  sections: [
    {
      kind: "explain",
      heading: "Why unit tests are not enough",
      body: [
        "Every unit can pass its tests and the system can still fail: a function sends the wrong field name, a query returns a column the code does not expect, a URL is wrong or JSON is serialised differently. An **integration test** checks that two or more parts work **together**: your code with a real database, your service with its repository, a client with a real HTTP server.",
        "Integration tests are slower and need more setup than unit tests, so you write fewer of them. The **test pyramid** is a guide for the balance: many fast unit tests at the base, fewer integration tests in the middle, and a small number of end-to-end tests at the top.",
      ],
    },
    {
      kind: "diagram",
      heading: "The test pyramid",
      diagram: {
        kind: "table",
        title: "Levels of tests",
        headers: ["Level", "Scope", "Speed", "How many"],
        rows: [
          [
            "Unit",
            "One function or class, dependencies replaced",
            "Milliseconds",
            "Many",
          ],
          [
            "Integration",
            "Several parts together, e.g. service + database or an API call",
            "Tens of milliseconds to seconds",
            "A moderate number",
          ],
          [
            "End-to-end",
            "The whole system through the user interface",
            "Seconds",
            "A few",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "A service with a real repository",
      example: {
        title: "Two units working together",
        language: "javascript",
        code: 'import { beforeEach, describe, expect, it } from "vitest"\n\nclass InMemoryUserRepository {\n  #users = new Map()\n  #nextId = 1\n  save(user) {\n    const saved = { id: this.#nextId++, ...user }\n    this.#users.set(saved.id, saved)\n    return saved\n  }\n  findByEmail(email) {\n    return [...this.#users.values()].find((u) => u.email === email) ?? null\n  }\n}\n\nclass RegistrationService {\n  constructor(repository) {\n    this.repository = repository\n  }\n  register(email, name) {\n    const normalised = email.trim().toLowerCase()\n    if (this.repository.findByEmail(normalised)) throw new Error("email already registered")\n    return this.repository.save({ email: normalised, name })\n  }\n}\n\ndescribe("RegistrationService with its repository", () => {\n  let service\n  beforeEach(() => {\n    service = new RegistrationService(new InMemoryUserRepository())\n  })\n\n  it("stores a new user with a generated id and a normalised email", () => {\n    expect(service.register("  Ana@Example.com ", "Ana")).toEqual({ id: 1, email: "ana@example.com", name: "Ana" })\n  })\n\n  it("rejects a second registration with the same email in any case", () => {\n    service.register("ana@example.com", "Ana")\n    expect(() => service.register("ANA@example.com", "Other")).toThrow("email already registered")\n  })\n\n  it("starts every test with an empty store", () => {\n    expect(service.register("b@example.com", "B").id).toBe(1)\n  })\n})',
        walkthrough: [
          "`RegistrationService` and the repository are real objects here, not replaced by fakes of each test. The test proves the **collaboration** works: the service normalises the email, asks the repository whether it exists and saves the user.",
          "`beforeEach` builds a **fresh** service and repository before every test. That isolates the tests: the third test gets id `1` even though earlier tests saved users.",
          "In a real project the repository would talk to a database. The same test style applies with a test database (an in-memory or throw-away instance), a clean schema and cleanup between tests.",
          "Unit tests of the service alone would replace the repository with a stub; this integration test checks that the actual parts fit together.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Testing an HTTP API over a real connection",
      example: {
        title: "Start the server in the test",
        language: "javascript",
        code: 'import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"\nimport { createServer } from "node:http"\n\nconst todos = []\nconst server = createServer((req, res) => {\n  if (req.method === "GET" && req.url === "/todos") {\n    res.setHeader("Content-Type", "application/json")\n    return res.end(JSON.stringify(todos))\n  }\n  if (req.method === "POST" && req.url === "/todos") {\n    let body = ""\n    req.on("data", (chunk) => (body += chunk))\n    req.on("end", () => {\n      const todo = { id: todos.length + 1, ...JSON.parse(body) }\n      todos.push(todo)\n      res.statusCode = 201\n      res.setHeader("Content-Type", "application/json")\n      res.end(JSON.stringify(todo))\n    })\n    return\n  }\n  res.statusCode = 404\n  res.end()\n})\n\nlet base\nbeforeAll(async () => {\n  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))\n  base = `http://127.0.0.1:${server.address().port}`\n})\nafterAll(() => new Promise((resolve) => server.close(resolve)))\nbeforeEach(() => {\n  todos.length = 0\n})\n\ndescribe("todos API", () => {\n  it("creates a todo and returns 201 with the saved object", async () => {\n    const res = await fetch(`${base}/todos`, { method: "POST", body: JSON.stringify({ title: "Write tests" }) })\n    expect(res.status).toBe(201)\n    expect(await res.json()).toEqual({ id: 1, title: "Write tests" })\n  })\n\n  it("lists the todos that were created", async () => {\n    await fetch(`${base}/todos`, { method: "POST", body: JSON.stringify({ title: "A" }) })\n    const res = await fetch(`${base}/todos`)\n    expect(await res.json()).toEqual([{ id: 1, title: "A" }])\n  })\n\n  it("answers 404 for an unknown path", async () => {\n    expect((await fetch(`${base}/nope`)).status).toBe(404)\n  })\n})',
        walkthrough: [
          "`server.listen(0)` asks the operating system for a **free port**, so tests never clash with other programs or parallel test runs. The test reads the real port from `server.address()`.",
          "`beforeAll` starts the server once for the file and `afterAll` stops it, so nothing is left running. `beforeEach` clears the data so the tests do not depend on each other.",
          "`fetch` sends real HTTP requests over a real socket: the test covers routing, parsing, status codes and JSON together, which no unit test of one function can.",
          "The same pattern works for frameworks: start the app on a random port (or use the framework's test client) and call it like a client would.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Sharing data between integration tests so that they depend on order.",
          fix: "Reset the data in beforeEach, or run each test in a transaction that is rolled back.",
        },
        {
          mistake: "Using a fixed port.",
          fix: "Listen on port 0 and read the real port.",
        },
        {
          mistake: "Testing against a shared or production database.",
          fix: "Use a dedicated, disposable test database.",
        },
        {
          mistake: "Only integration tests, which makes the suite slow.",
          fix: "Keep many unit tests and a smaller set of integration tests.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Testing a repository against a database",
      scenario:
        "Your code saves orders to PostgreSQL and a bug appeared in a SQL query.",
      body: [
        "Start a throw-away database for the test run (for example in a container), apply the schema, insert known rows in `beforeEach`, call the repository method and assert on the returned data. A unit test with a mock database could never have caught a wrong column name or join.",
        "Clean up after each test so that the next one starts from a known state.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "integration-purpose",
      prompt: "What do integration tests check that unit tests cannot?",
      options: [
        "That parts work together",
        "That every line ran",
        "That the UI looks right",
      ],
      answer: 0,
      explanation:
        "They check the collaboration between components, such as a service and a database.",
    },
    {
      type: "single",
      id: "random-port",
      prompt: "Why listen on port 0 in a test?",
      options: [
        "The operating system picks a free port, avoiding clashes",
        "It makes the server faster",
        "It disables the network",
      ],
      answer: 0,
      explanation:
        "A random free port lets tests run in parallel without conflicts.",
    },
    {
      type: "single",
      id: "pyramid-shape",
      prompt:
        "In the test pyramid, which kind of test should there be the most of?",
      options: ["Unit tests", "End-to-end tests", "Manual tests"],
      answer: 0,
      explanation: "Unit tests are fast and cheap, so they form the wide base.",
    },
    {
      type: "truefalse",
      id: "shared-state",
      statement:
        "Integration tests should rely on data created by earlier tests.",
      answer: false,
      explanation:
        "Each test should set up its own data so the suite does not depend on order.",
    },
  ],
  assignment: {
    title: "Integrate two parts",
    task: [
      "Build a small ShoppingCart service that uses a real in-memory ProductCatalog. Write integration tests for adding known and unknown products, quantities and totals.",
      "Add an HTTP endpoint around it, start it on a random port in the tests and test it with fetch.",
    ],
    checklist: [
      "Both parts are real objects in the test",
      "beforeEach resets the state",
      "The server uses port 0 and is closed in afterAll",
      "At least one test checks an error status",
    ],
    hints: ["Use afterAll to close servers and connections."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "sum-lines",
      title: "Total of the cart",
      task: [
        "Write cartTotal(lines) where lines is an array of {price, quantity}. It returns the sum of price * quantity, or 0 for an empty cart.",
      ],
      language: "javascript",
      starter: "function cartTotal(lines) {\n}",
      solution:
        "function cartTotal(lines) {\n  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0)\n}",
      hints: ["reduce with a start value of 0."],
      checklist: ["Handles an empty cart", "Multiplies price by quantity"],
      run: {
        entry: "cartTotal",
        cases: [
          {
            name: "empty",
            args: [[]],
            expected: 0,
          },
          {
            name: "one line",
            args: [
              [
                {
                  price: 5,
                  quantity: 2,
                },
              ],
            ],
            expected: 10,
          },
          {
            name: "two lines",
            args: [
              [
                {
                  price: 5,
                  quantity: 2,
                },
                {
                  price: 3,
                  quantity: 1,
                },
              ],
            ],
            expected: 13,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Integration tests check collaboration of real parts",
    "Test pyramid: many unit, fewer integration, few end-to-end",
    "Isolate: beforeEach reset, disposable test database, random port",
    "Close resources in afterAll",
  ],
  resources: [
    {
      label: "Vitest: Getting started",
      url: "https://vitest.dev/guide/",
    },
    {
      label: "Vitest: Test API (hooks)",
      url: "https://vitest.dev/api/test",
    },
    {
      label: "JUnit 5 user guide",
      url: "https://junit.org/junit5/docs/current/user-guide/",
    },
  ],
})
