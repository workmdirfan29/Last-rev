import { defineLesson } from "@/data/lessons/author"

export default defineLesson("express", {
  slug: "error-handling",
  title: "Error handling in Express",
  topic: "Error handling",
  minutes: 60,
  overview:
    "Learn how Express catches errors in synchronous and asynchronous handlers, how to write error-handling middleware, and how to return clear errors without leaking details.",
  objectives: [
    "Explain how Express catches synchronous errors and rejected promises",
    "Write a four-argument error-handling middleware and place it last",
    "Create typed application errors and map them to status codes without exposing stack traces",
  ],
  prerequisites: ["lesson.express.middleware"],
  sections: [
    {
      kind: "explain",
      heading: "How errors reach Express",
      body: [
        "Express catches errors that occur while running route handlers and middleware. If synchronous code throws, Express catches it and processes it with no extra work from you.",
        "For asynchronous code, the recommended way is to use `async` functions. A handler or middleware that returns a promise calls `next(value)` automatically when it rejects or throws, so errors from an `async` function reach Express too. (This is how Express 5 behaves.)",
        "You can also pass an error to `next(err)` yourself. Anything passed to `next()` other than the string `'route'` or `'router'` is treated as an error, and Express skips the remaining normal handlers and goes to the error handlers.",
      ],
    },
    {
      kind: "code",
      heading: "An error handler",
      example: {
        title: "Throwing, forwarding and handling",
        language: "javascript",
        code: "import express from 'express';\n\nclass HttpError extends Error {\n  constructor(status, message) {\n    super(message);\n    this.status = status;\n  }\n}\n\nconst app = express();\n\napp.get('/users/:id', async (req, res) => {\n  const user = await findUser(req.params.id);\n  if (!user) throw new HttpError(404, 'User not found');\n  res.json(user);\n});\n\napp.use((err, req, res, next) => {\n  if (res.headersSent) return next(err);\n  const status = err.status ?? 500;\n  const message = status === 500 ? 'Internal server error' : err.message;\n  res.status(status).json({ error: message });\n});",
        walkthrough: [
          "`HttpError` carries a status code along with the message.",
          "The `async` handler throws when the user is missing. Because it returns a promise, Express forwards the rejection to the error handler.",
          "Error-handling middleware is defined like other middleware, except it has four arguments: `(err, req, res, next)`. It is registered after all other `app.use()` and route calls.",
          "If headers were already sent, the handler delegates to the default Express error handler with `next(err)`.",
          "For unexpected errors the client gets a generic 500 message, so internal details are not leaked.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Good error responses",
      body: [
        "Choose the status code for the situation: `400` for invalid input, `401` when authentication is needed, `403` when it is not allowed, `404` when nothing is found and `500` for unexpected failures.",
        "Return a consistent JSON shape, such as `{ error: 'message' }`, so clients can handle errors uniformly. Log the full error, including the stack, on the server.",
        "Do not send stack traces or internal messages to clients in production. Express's default handler also hides them when the environment is production.",
        "You can add several error handlers; each can handle some errors and pass the rest on with `next(err)`.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Registering the error handler before the routes.",
          fix: "Define error-handling middleware last, after all other app.use() and routes.",
        },
        {
          mistake: "Using three arguments in the error handler.",
          fix: "Express recognises an error handler by its four parameters (err, req, res, next).",
        },
        {
          mistake: "Sending err.stack to the client.",
          fix: "Log it on the server and send a short message.",
        },
        {
          mistake: "Swallowing errors with an empty catch.",
          fix: "Pass the error to next(err), or rethrow it, so it is handled and logged.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A consistent error format",
      scenario:
        "Different routes currently respond to errors in different ways, and the front end has to guess.",
      body: [
        "Create an `HttpError` class with a status, throw it from handlers and services, and add one error handler that converts it to `{ error: message }` with the right status.",
        "Add a not-found middleware after the routes that creates a 404 error for unmatched paths, then lets the same handler format it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "four-args",
      prompt: "How does Express recognise an error-handling middleware?",
      options: [
        "It has four parameters: err, req, res, next",
        "Its name contains 'error'",
        "It is registered with app.error()",
      ],
      answer: 0,
      explanation:
        "Error-handling functions have four arguments instead of three.",
    },
    {
      type: "truefalse",
      id: "async-forward",
      statement: "In Express 5, an async route handler that throws sends its error to the error handlers automatically.",
      answer: true,
      explanation:
        "Handlers that return a promise call next(value) automatically on rejection or throw.",
    },
    {
      type: "single",
      id: "where-to-register",
      prompt: "Where should the error-handling middleware be registered?",
      options: ["After all other routes and middleware", "Before all routes", "Inside each route"],
      answer: 0,
      explanation:
        "Define error-handling middleware last so errors from everything above it reach it.",
    },
    {
      type: "blank",
      id: "status-missing",
      prompt: "A request for a resource that does not exist should usually get status ___.",
      answer: "404",
      explanation:
        "404 means not found.",
    },
  ],
  assignment: {
    title: "Central error handler",
    task: [
      "Add an HttpError class, a not-found middleware and one error handler to an Express app.",
      "Make one route throw a 404, another throw a 400 for bad input and a third throw an unexpected Error.",
    ],
    checklist: [
      "The error handler has four parameters and is registered last",
      "The 404 and 400 responses use the error message",
      "The unexpected error returns a generic 500 message",
      "The stack is logged on the server and not sent to the client",
    ],
    hints: ["Check res.headersSent in the handler."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "error-to-response",
      title: "Map an error to a response",
      task: [
        "Write `toResponse(err)` that returns `{ status, body }`. If `err.status` is a number, use it as the status and `{ error: err.message }` as the body. Otherwise return status 500 and `{ error: 'Internal server error' }`.",
      ],
      language: "javascript",
      starter: "function toResponse(err) {\n  // your code\n}",
      solution:
        "function toResponse(err) {\n  if (typeof err.status === 'number') {\n    return { status: err.status, body: { error: err.message } };\n  }\n  return { status: 500, body: { error: 'Internal server error' } };\n}",
      hints: ["Check that err.status is a number before trusting it."],
      checklist: [
        "Known errors keep their status and message",
        "Unknown errors give 500 and a generic message",
        "The internal message is never returned for unknown errors",
      ],
      run: {
        entry: "toResponse",
        cases: [
          { name: "not found", args: [{ status: 404, message: "User not found" }], expected: { status: 404, body: { error: "User not found" } } },
          { name: "bad input", args: [{ status: 400, message: "Invalid id" }], expected: { status: 400, body: { error: "Invalid id" } } },
          { name: "unexpected", args: [{ message: "db password is wrong" }], expected: { status: 500, body: { error: "Internal server error" } } },
        ],
      },
    },
  ],
  revisionNotes: [
    "Synchronous throws and rejected promises from handlers reach the error handlers",
    "Error handlers have four parameters and are registered last",
    "Use a status on custom errors; send short messages and log the stack on the server",
    "next(err) skips normal handlers; check res.headersSent",
  ],
  resources: [
    {
      label: "Express: Error handling",
      url: "https://expressjs.com/en/guide/error-handling/",
    },
    {
      label: "Express: Migrating to Express 5",
      url: "https://expressjs.com/en/guide/migrating-5/",
    },
    {
      label: "Express: Production best practices: security",
      url: "https://expressjs.com/en/advanced/best-practice-security/",
    },
  ],
})
