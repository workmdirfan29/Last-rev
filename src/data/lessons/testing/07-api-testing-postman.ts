import { defineLesson } from "@/data/lessons/author"

export default defineLesson("testing", {
  slug: "api-testing-postman",
  title: "API testing with Postman",
  topic: "API testing with Postman",
  minutes: 60,
  overview:
    "Test HTTP APIs with Postman: requests, collections, environment variables, post-response test scripts with pm.test and pm.expect, chaining requests and running collections automatically.",
  objectives: [
    "Explain collections, environments and variables",
    "Write test scripts with pm.test, pm.expect and pm.response",
    "Check status, headers and JSON bodies, including error cases",
    "Chain requests with variables and run a collection",
    "Know how to run a collection from the command line or CI",
  ],
  prerequisites: ["lesson.http.status-codes"],
  sections: [
    {
      kind: "explain",
      heading: "What Postman does",
      body: [
        "**Postman** is a tool for building, sending and testing HTTP requests. You group requests in a **collection**, and use **variables** so the same collection works against different servers. Each request can have a **post-response script** (the *Scripts* tab, *Post-response*) that runs after the response arrives and checks it with assertions. The results show in the *Test Results* tab.",
        "An **environment** is a named set of variables, for example `local` with `baseUrl = http://localhost:8000` and `production` with the real address. In the request you write `{{baseUrl}}/v1/books`, and Postman fills in the value from the selected environment. This keeps secrets and addresses out of the requests themselves.",
      ],
    },
    {
      kind: "code",
      heading: "Test script for a GET request",
      example: {
        title: "pm.test, pm.expect and pm.response",
        language: "javascript",
        code: '// Request: GET {{baseUrl}}/v1/books/1\n// Post-response script:\npm.test("status is 200", function () {\n  pm.response.to.have.status(200)\n})\n\npm.test("responds with JSON", function () {\n  pm.response.to.be.json\n})\n\npm.test("returns the expected book", function () {\n  const book = pm.response.json()\n  pm.expect(book.id).to.equal(1)\n  pm.expect(book.title).to.equal("Dune")\n  pm.expect(book).to.have.property("_links")\n})\n\npm.test("is fast enough", function () {\n  pm.expect(pm.response.responseTime).to.be.below(1000)\n})',
        walkthrough: [
          'A test is `pm.test("name", function () { ... })`. The test passes if the function finishes without throwing and fails if an assertion throws. The name appears in the test results.',
          "`pm.response.to.have.status(200)` checks the status code. `pm.response.to.be.json` checks that the body is JSON. `pm.response.json()` parses the body into an object.",
          '`pm.expect(...)` uses the **Chai BDD** style: `.to.equal`, `.to.have.property`, `.to.be.below`, `.to.include`, `.to.be.an("array")`. `pm.response.responseTime` is the time in milliseconds.',
          "Here the request is `GET {{baseUrl}}/v1/books/1` against the practice API from the REST module. In Postman, enter the request in the URL bar and the script in *Scripts > Post-response*. All four tests pass.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Create, validate and chain",
      example: {
        title: "A POST that stores a variable for the next request",
        language: "javascript",
        code: '// Request: POST {{baseUrl}}/v1/books\n// Body (raw JSON): {"title": "Kim", "author": "Kipling", "year": 1901}\n// Post-response script:\npm.test("created with 201", function () {\n  pm.response.to.have.status(201)\n})\n\npm.test("Location header points to the new book", function () {\n  pm.response.to.have.header("Location")\n  pm.expect(pm.response.headers.get("Location")).to.match(/^\\/v1\\/books\\/\\d+$/)\n})\n\npm.test("body echoes the data and has an id", function () {\n  const book = pm.response.json()\n  pm.expect(book).to.include({ title: "Kim", year: 1901 })\n  pm.expect(book.id).to.be.a("number")\n  // Save the id so the next request can use {{bookId}}\n  pm.collectionVariables.set("bookId", book.id)\n})\n\npm.test("the id was stored", function () {\n  pm.expect(pm.collectionVariables.get("bookId")).to.equal(6)\n})',
        walkthrough: [
          "The body is set in the *Body* tab as raw JSON, with `Content-Type: application/json`. The API answers `201 Created`.",
          '`pm.response.to.have.header("Location")` checks the header exists; `pm.response.headers.get(...)` reads it, and `.to.match(regex)` checks its format.',
          '`pm.expect(book).to.include({...})` checks that selected properties match; `.to.be.a("number")` checks the type.',
          '`pm.collectionVariables.set("bookId", book.id)` saves the new id. A later request can use `{{baseUrl}}/v1/books/{{bookId}}` to read, update or delete **that** book, so a collection can run a whole scenario: create, read, update, delete. (Use `pm.environment.set` to store a value in the active environment instead.)',
        ],
      },
    },
    {
      kind: "code",
      heading: "Test the error cases too",
      example: {
        title: "Negative tests",
        language: "javascript",
        code: '// Request: POST {{baseUrl}}/v1/books\n// Body (raw JSON): {"title": "X", "author": "Y", "year": "no"}\n// Post-response script:\npm.test("rejects invalid input with 422", function () {\n  pm.response.to.have.status(422)\n})\n\npm.test("explains which field is wrong", function () {\n  const problem = pm.response.json()\n  pm.expect(problem.title).to.equal("Validation failed")\n  pm.expect(problem.errors[0].field).to.equal("year")\n})\n\npm.test("uses the problem+json media type", function () {\n  pm.expect(pm.response.headers.get("Content-Type")).to.include("problem+json")\n})',
        walkthrough: [
          "A good API test suite checks failures as well as successes. Here invalid input must produce `422` with a clear error body in the `application/problem+json` format.",
          "Also test missing authentication (`401`), forbidden access (`403`), unknown ids (`404`) and wrong content types (`415`).",
          "Because each test has a name, the results tell you exactly which promise of the API was broken.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Collections, runner and automation",
      body: [
        "Scripts can be added at three levels: a request, a folder, or the whole collection. Collection and folder scripts run after every request below them, so shared checks (for example 'response time below 2 seconds' or 'no 5xx status') are written once. Order of execution: collection, folder, then request.",
        "The **Collection Runner** runs all requests in order with an environment and reports passed and failed tests; you can feed it a data file to repeat the run with different inputs. The same collection can be run from a terminal or CI with the Postman CLI or the open-source Newman, so API tests become part of the regression suite and block a bad deployment. Export the collection and environment (without secrets) into version control, or keep them in a shared workspace.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Only testing the happy path.",
          fix: "Add tests for errors, validation, authentication and edge cases.",
        },
        {
          mistake: "Hard-coding the host and credentials in every request.",
          fix: "Use variables and environments; keep secrets out of shared collections.",
        },
        {
          mistake: "Tests that depend on data left from earlier runs.",
          fix: "Create the data in the collection, or reset the test database before each run.",
        },
        {
          mistake: "Assertions that only check the status code.",
          fix: "Check the body, important headers and the response time as well.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An API check in the pipeline",
      scenario: "Every pull request must prove that the API still behaves.",
      body: [
        "Keep a collection with scenarios (create, read, update, delete and error cases). In CI, start the API, run the collection with the Postman CLI or Newman using the `ci` environment, and fail the build if any test fails. When the API changes on purpose, update the tests in the same pull request.",
        "Combine it with contract documentation (OpenAPI) so the requests stay aligned with the specification.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pm-test",
      prompt: "Which function defines a named test in a Postman script?",
      options: ["pm.test", "pm.run", "pm.check"],
      answer: 0,
      explanation:
        "pm.test(name, fn) defines a test; assertions inside use pm.expect.",
    },
    {
      type: "single",
      id: "env-variable",
      prompt: "What does {{baseUrl}} in a Postman request refer to?",
      options: [
        "A variable whose value comes from the selected environment",
        "A fixed text",
        "A JavaScript function",
      ],
      answer: 0,
      explanation: "Double curly braces insert the value of a variable.",
    },
    {
      type: "single",
      id: "pm-chai",
      prompt: "Which assertion style does pm.expect use?",
      options: ["Chai BDD", "JUnit assertions", "Python assert"],
      answer: 0,
      explanation: "pm.expect is Chai BDD: expect(x).to.equal(y).",
    },
    {
      type: "truefalse",
      id: "negative-tests",
      statement:
        "A good API test collection includes tests for error responses such as 404 and 422.",
      answer: true,
      explanation:
        "Failures are part of the API's contract and must be tested.",
    },
  ],
  assignment: {
    title: "A collection for the practice API",
    task: [
      "In Postman (or with curl if you cannot install it), build a collection for the practice REST API with an environment variable baseUrl: list books, create a book (store the id), read it, replace it and delete it, then check that a second read gives 404.",
      "Add tests with pm.test to every request, including one error case, and run the collection with the Collection Runner.",
    ],
    checklist: [
      "baseUrl is a variable in an environment",
      "Each request has status and body tests",
      "The created id is passed to the next requests",
      "An error case is tested and the collection runs end to end",
    ],
    hints: ["Use {{bookId}} in the later URLs."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "pm-script",
      title: "Write the tests",
      task: [
        "Write a Post-response script for DELETE {{baseUrl}}/v1/books/1 that checks the status is 204 and the body is empty.",
      ],
      language: "javascript",
      starter: 'pm.test("", function () {\n})',
      solution:
        'pm.test("returns 204", function () {\n  pm.response.to.have.status(204)\n})\n\npm.test("has an empty body", function () {\n  pm.expect(pm.response.text()).to.equal("")\n})',
      hints: ["pm.response.text() returns the raw body."],
      checklist: ["Status 204 is checked", "The body is checked for emptiness"],
    },
  ],
  revisionNotes: [
    "Postman: collections of requests, environments with variables like {{baseUrl}}",
    "Scripts > Post-response: pm.test + pm.expect (Chai BDD), pm.response.to.have.status, pm.response.json()",
    "Test failures and edge cases; store ids with collection or environment variables to chain requests",
    "Run collections in the Collection Runner, with the Postman CLI or Newman in CI",
  ],
  resources: [
    {
      label: "Postman: Write tests (post-response scripts)",
      url: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/",
    },
    {
      label: "Postman: Collections overview",
      url: "https://learning.postman.com/docs/use/use-collections/overview/",
    },
    {
      label: "Postman: Variables",
      url: "https://learning.postman.com/docs/use/send-requests/variables/variables/",
    },
    {
      label: "Postman: Collection runs",
      url: "https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/",
    },
  ],
})
