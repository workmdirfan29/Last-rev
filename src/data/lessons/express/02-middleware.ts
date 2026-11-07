import { defineLesson } from "@/data/lessons/author"

export default defineLesson("express", {
  slug: "middleware",
  title: "Middleware: the request pipeline",
  topic: "Middleware",
  minutes: 70,
  overview:
    "Understand middleware functions, the next() call and their order, the kinds of middleware Express offers, and how to write your own.",
  objectives: [
    "Explain what a middleware function receives and what next() does",
    "Order middleware correctly and mount it on all paths or on one path",
    "Write application, router and error-free custom middleware for logging and authentication",
  ],
  prerequisites: ["lesson.express.routing"],
  sections: [
    {
      kind: "explain",
      heading: "What middleware is",
      body: [
        "A **middleware function** is a function with access to the request object `req`, the response object `res` and a function `next`. It runs during the request-response cycle and can run code, change `req` and `res`, end the cycle or pass control on.",
        "Calling `next()` passes control to the next middleware function. If a middleware neither calls `next()` nor sends a response, the request is left hanging.",
        "Express applications are a series of middleware calls. Even a route handler is a middleware function that ends the cycle.",
      ],
    },
    {
      kind: "code",
      heading: "Writing and mounting middleware",
      example: {
        title: "A logger and an auth check",
        language: "javascript",
        code: "import express from 'express';\n\nconst app = express();\n\nfunction logger(req, res, next) {\n  console.log(req.method, req.url);\n  next();\n}\n\nfunction requireKey(req, res, next) {\n  if (req.get('x-api-key') !== 'secret') {\n    return res.status(401).json({ error: 'unauthorised' });\n  }\n  next();\n}\n\napp.use(logger);\napp.use(express.json());\napp.use('/admin', requireKey);\n\napp.get('/', (req, res) => res.send('public'));\napp.get('/admin/stats', (req, res) => res.json({ ok: true }));",
        walkthrough: [
          "`app.use(logger)` has no path, so it runs for every request, and then `next()` continues to the next function.",
          "`app.use('/admin', requireKey)` runs only for paths that start with `/admin`.",
          "`requireKey` ends the cycle with a 401 response when the key is wrong, and returns so `next()` is not also called.",
          "Order matters: `logger` and `express.json()` are registered before the routes, so they run first.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Kinds of middleware",
      body: [
        "Express describes several kinds. **Application-level** middleware is bound to the app with `app.use()` or `app.METHOD()`. **Router-level** middleware works the same way on an `express.Router`.",
        "**Built-in** middleware includes `express.json()`, `express.urlencoded()` and `express.static()`. **Third-party** middleware, such as `cors`, is installed from npm and loaded with `app.use()`.",
        "**Error-handling** middleware has four arguments, `(err, req, res, next)`, and is covered in its own lesson.",
        "You can also pass several middleware functions to a single route, `app.get('/x', check, handler)`, so a check runs only for that route.",
      ],
    },
    {
      kind: "diagram",
      heading: "A request through the pipeline",
      diagram: {
        kind: "flow",
        title: "Order of execution",
        steps: [
          { label: "logger", detail: "Logs the request and calls next()." },
          { label: "express.json()", detail: "Parses the body into req.body and calls next()." },
          { label: "Route-specific check", detail: "Rejects bad requests or calls next()." },
          { label: "Route handler", detail: "Sends the response and ends the cycle." },
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Registering express.json() after the routes that need req.body.",
          fix: "Register middleware before the routes that depend on it.",
        },
        {
          mistake: "Forgetting to call next() or send a response.",
          fix: "Every path through a middleware must end in next() or a response.",
        },
        {
          mistake: "Calling next() after sending a response.",
          fix: "Return after sending, so the cycle ends once.",
        },
        {
          mistake: "Putting authentication after the routes it protects.",
          fix: "Mount it before them, on the path it should protect.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Request timing",
      scenario:
        "You want to log how long each request takes, for every route.",
      body: [
        "Write a middleware that records the start time, listens for the response's `finish` event, then logs the elapsed time. Call `next()` straight away so the request continues.",
        "Register it first so it covers every route and every other middleware.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "what-next-does",
      prompt: "What does next() do in a middleware function?",
      options: [
        "Passes control to the next middleware function",
        "Sends the response",
        "Restarts the server",
      ],
      answer: 0,
      explanation:
        "next() passes control on. Without it, or a response, the request hangs.",
    },
    {
      type: "truefalse",
      id: "order-matters",
      statement: "The order in which you register middleware affects when it runs.",
      answer: true,
      explanation:
        "Middleware runs in the order it was registered, so parsers must come before the routes that need them.",
    },
    {
      type: "single",
      id: "mount-path",
      prompt: "Which call runs requireKey only for paths beginning with /admin?",
      options: ["app.use('/admin', requireKey)", "app.use(requireKey)", "app.get(requireKey)"],
      answer: 0,
      explanation:
        "A path argument to app.use limits the middleware to matching paths.",
    },
    {
      type: "blank",
      id: "middleware-args",
      prompt: "A normal middleware function takes the arguments req, res and ___.",
      answer: "next",
      explanation:
        "The third argument, next, passes control onward.",
    },
  ],
  assignment: {
    title: "Pipeline of three",
    task: [
      "Add three middleware functions to an app: a request logger, a timing middleware and an API key check on /api.",
      "Test that a request without the key is rejected and that the logs appear in the right order.",
    ],
    checklist: [
      "All three are registered before the routes",
      "The key check applies only to /api",
      "Each middleware calls next() or ends the response",
      "express.json() appears before routes that read req.body",
    ],
    hints: ["Add a console.log in each middleware to see the order."],
    minutes: 35,
  },
  exercises: [
    {
      slug: "run-pipeline",
      title: "A middleware runner",
      task: [
        "Write `runPipeline(steps, input)`. Each step is a function `(value) => result`. A step returning `null` stops the pipeline and `runPipeline` returns `null`; otherwise its result is passed to the next step. Return the final value.",
      ],
      language: "javascript",
      starter: "function runPipeline(steps, input) {\n  // your code\n}",
      solution:
        "function runPipeline(steps, input) {\n  let value = input;\n  for (const step of steps) {\n    value = step(value);\n    if (value === null) return null;\n  }\n  return value;\n}",
      hints: ["Loop over the steps and stop early when a step returns null."],
      checklist: [
        "Steps run in order",
        "Each result feeds the next step",
        "null stops the pipeline",
      ],
    },
  ],
  revisionNotes: [
    "Middleware = function(req, res, next); next() passes control on",
    "Each path must call next() or send a response",
    "Order of registration is the order of execution",
    "app.use(path, fn) limits middleware to a path; built-in: json, urlencoded, static",
  ],
  resources: [
    {
      label: "Express: Using middleware",
      url: "https://expressjs.com/en/guide/using-middleware/",
    },
    {
      label: "Express: Writing middleware",
      url: "https://expressjs.com/en/guide/writing-middleware/",
    },
    {
      label: "Express: Serving static files",
      url: "https://expressjs.com/en/starter/static-files/",
    },
  ],
})
