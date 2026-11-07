import { defineQuestions } from "../author"

const EX = "https://expressjs.com/en"

export default defineQuestions("express", "fresher", [
  {
    slug: "what-is-express",
    topic: "Routing",
    difficulty: "easy",
    title: "What is Express.js and why is it used with Node.js?",
    keywords: ["express", "framework", "routing", "middleware", "node http"],
    interviewerIntent:
      "A warm-up that checks what Express adds on top of Node's built-in http module.",
    shortAnswer:
      "Express is a small, unopinionated web framework for Node.js. It builds on the built-in `http` module and adds routing, a middleware pipeline, helpers for requests and responses, and support for template engines and static files. You write less boilerplate than with plain `http`, and a large ecosystem of middleware covers common needs such as parsing, authentication and logging.",
    detailedAnswer: [
      "Express does not force a project structure, a database or an ORM. You choose them.",
      "The core ideas are routes, which map a method and a path to a handler, and middleware, which are functions that run in sequence for each request.",
      "An Express app is a function you can pass to `http.createServer`, which is why it works with any Node server setup.",
      "It is a thin layer, so many other frameworks, such as NestJS, build on top of it.",
    ],
    realWorldExample:
      "A REST API for an online shop uses Express routes for products and orders, middleware for JSON parsing and authentication, and a central error handler.",
    codeExamples: [
      {
        title: "A minimal Express server",
        language: "javascript",
        code: `import express from "express"

const app = express()
app.use(express.json())

app.get("/health", (req, res) => {
  res.json({ ok: true })
})

app.listen(3000, () => console.log("listening on 3000"))`,
        walkthrough: [
          "`express()` creates the application object.",
          "`express.json()` is middleware that parses JSON request bodies.",
          "`app.get` registers a handler for GET requests to `/health`.",
          "`res.json` sets the content type and sends the response.",
        ],
      },
    ],
    commonMistakes: [
      "Calling Express a language or a database.",
      "Saying it cannot be used without a template engine.",
    ],
    followUps: [
      {
        question:
          "How is Express different from using the http module directly?",
      },
    ],
    answerTips: ["Say 'routing plus middleware on top of http'."],
    keyPoints: [
      "Minimal, unopinionated framework",
      "Built on Node's http",
      "Routing and middleware",
      "Large middleware ecosystem",
    ],
    revisionNotes: ["Express = routes + middleware."],
    sourceRefs: [
      { label: "Express: Hello world", url: `${EX}/starter/hello-world.html` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "routing-basics",
    topic: "Routing",
    difficulty: "easy",
    title:
      "How does routing work in Express? How do you handle different HTTP methods?",
    keywords: [
      "routing",
      "app.get",
      "app.post",
      "route handler",
      "path",
      "app.all",
    ],
    interviewerIntent:
      "Checks that you can map methods and paths to handlers, the basis of every Express app.",
    shortAnswer:
      "A route connects an HTTP method and a path to a handler function. You register it with `app.get`, `app.post`, `app.put`, `app.patch` or `app.delete`, and `app.all` matches every method. The handler receives the request, the response and optionally `next`. Express checks routes in the order you define them and runs the first matching handler that sends a response.",
    detailedAnswer: [
      "Paths can be strings, patterns or regular expressions, and can include parameters such as `/users/:id`.",
      "Order matters: a general route registered before a specific one can hide it.",
      "A handler must end the request by sending a response, or call `next()` to pass control on.",
      '`app.route("/users")` lets you chain several methods for the same path.',
    ],
    realWorldExample:
      "`GET /products` lists products, `POST /products` creates one, and `DELETE /products/:id` removes one, all defined on a router.",
    codeExamples: [
      {
        title: "Methods on one path",
        language: "javascript",
        code: `app.get("/books", (req, res) => res.json(books))
app.post("/books", (req, res) => {
  books.push(req.body)
  res.status(201).json(req.body)
})

app.route("/books/:id")
  .get((req, res) => res.json(find(req.params.id)))
  .delete((req, res) => res.sendStatus(204))`,
        walkthrough: [
          "Each call maps a method and path to a handler.",
          "The POST handler returns status 201, meaning created.",
          "`app.route` groups the GET and DELETE handlers for the same path.",
          "`req.params.id` holds the value from the URL.",
        ],
      },
    ],
    commonMistakes: [
      "Registering a catch-all route before specific ones.",
      "Forgetting to send a response, leaving the request hanging.",
    ],
    followUps: [
      { question: "What is the difference between app.use and app.get?" },
    ],
    answerTips: ["Mention that order matters."],
    keyPoints: [
      "Method plus path to handler",
      "app.get, post, put, delete",
      "Order matters",
      "app.route chains methods",
    ],
    revisionNotes: ["First matching route that responds wins."],
    sourceRefs: [
      { label: "Express: Routing", url: `${EX}/guide/routing.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "route-parameters-and-query-strings",
    topic: "Routing",
    difficulty: "easy",
    title:
      "What are route parameters, query strings and the request body in Express?",
    keywords: [
      "req.params",
      "req.query",
      "req.body",
      "route parameters",
      "query string",
      "express.json",
    ],
    interviewerIntent:
      "Checks that you know the three places a client sends data and how to read each.",
    shortAnswer:
      "Route parameters are parts of the path, such as `/users/42`, read from `req.params`. The query string is the part after `?`, such as `?page=2&sort=name`, read from `req.query`. The request body carries data for POST, PUT and PATCH requests and is read from `req.body` after a body parser like `express.json()` has run. Values from `params` and `query` are always strings.",
    detailedAnswer: [
      "Use parameters to identify a resource and query strings for optional filters, sorting and paging.",
      "Without `express.json()` or `express.urlencoded()`, `req.body` is undefined.",
      "Always validate and convert values, for example with `Number(req.params.id)`.",
      'Headers are another input and are read from `req.headers` or `req.get("name")`.',
    ],
    realWorldExample:
      "`GET /products?category=books&page=2` uses query strings for filtering, while `GET /products/17` uses a parameter for one product.",
    codeExamples: [
      {
        title: "Reading all three",
        language: "javascript",
        code: `app.use(express.json())

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id)
  const page = Number(req.query.page ?? 1)
  res.json({ id, page })
})

app.post("/users", (req, res) => {
  const { name, email } = req.body
  res.status(201).json({ name, email })
})`,
        walkthrough: [
          "`req.params.id` comes from the path and is converted to a number.",
          "`req.query.page` comes from the query string, with a default of 1.",
          "`req.body` is filled in by the JSON parser.",
          "Destructuring picks out the fields the endpoint needs.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting the body parser.",
      "Treating params and query values as numbers without converting them.",
    ],
    followUps: [{ question: "How do you validate request input?" }],
    answerTips: ["Say 'params identify, query filters, body creates'."],
    keyPoints: [
      "req.params for path values",
      "req.query for the query string",
      "req.body needs a parser",
      "Values are strings",
    ],
    revisionNotes: ["Params, query, body: three input places."],
    sourceRefs: [
      { label: "Express: API reference (req)", url: `${EX}/4x/api.html#req` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "what-is-middleware",
    topic: "Middleware",
    difficulty: "medium",
    title: "What is middleware in Express? How does next() work?",
    keywords: [
      "middleware",
      "next",
      "request pipeline",
      "app.use",
      "req",
      "res",
    ],
    interviewerIntent:
      "The central Express concept. The interviewer wants to hear that middleware is a chain and that next() hands control on.",
    shortAnswer:
      "Middleware is a function with access to the request, the response and `next`. Express runs middleware in the order it was registered. Each one can read or change the request and response, end the request by sending a response, or call `next()` to pass control to the next function. If it does neither, the request hangs. Calling `next(err)` skips to the error-handling middleware.",
    detailedAnswer: [
      "Application-level middleware is added with `app.use`, router-level with `router.use`, and route-specific middleware is passed before the handler.",
      "Common uses are logging, parsing, authentication, validation and CORS.",
      "Express ships with a few built-ins, such as `express.json` and `express.static`, and the rest come from packages.",
      "Think of it as a pipeline: each step does one small job and then passes the request on.",
    ],
    realWorldExample:
      "A request passes through a logger, a JSON parser, an authentication check and then the route handler, each as a separate middleware.",
    codeExamples: [
      {
        title: "A logging middleware",
        language: "javascript",
        code: `function logger(req, res, next) {
  const start = Date.now()
  res.on("finish", () => {
    console.log(req.method, req.originalUrl, res.statusCode, Date.now() - start + "ms")
  })
  next()                       // pass control on
}

app.use(logger)
app.get("/", (req, res) => res.send("hello"))`,
        walkthrough: [
          "The function receives `req`, `res` and `next`.",
          "It registers a listener that logs when the response finishes.",
          "`next()` hands the request to the next middleware or route.",
          "`app.use(logger)` applies it to every request that comes after.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting to call next() or send a response.",
      "Registering middleware after the routes that need it.",
    ],
    followUps: [{ question: "What happens when you call next(err)?" }],
    answerTips: ["Describe it as a pipeline and mention the order."],
    keyPoints: [
      "Function with req, res, next",
      "Runs in registration order",
      "Either respond or call next",
      "next(err) goes to error handling",
    ],
    revisionNotes: ["Respond or call next. Never neither."],
    sourceRefs: [
      {
        label: "Express: Using middleware",
        url: `${EX}/guide/using-middleware.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "types-of-middleware",
    topic: "Middleware",
    difficulty: "medium",
    title: "What are the types of middleware in Express?",
    keywords: [
      "application-level",
      "router-level",
      "error-handling",
      "built-in",
      "third-party",
      "middleware types",
    ],
    interviewerIntent:
      "Checks that you can classify middleware and know where each kind is used.",
    shortAnswer:
      "Express lists five kinds: application-level middleware bound to the app with `app.use`, router-level middleware bound to an `express.Router`, error-handling middleware with four parameters `(err, req, res, next)`, built-in middleware such as `express.json` and `express.static`, and third-party middleware from npm such as `cors` or `helmet`. They all use the same chain and the same `next` mechanism.",
    detailedAnswer: [
      "Router-level middleware only runs for requests that reach that router, which keeps parts of the app separate.",
      "Error-handling middleware must have exactly four parameters, otherwise Express does not treat it as an error handler.",
      'You can also pass middleware only to a single route, for example `app.get("/admin", requireAdmin, handler)`.',
      "Use third-party packages carefully and keep them updated, because they run on every request.",
    ],
    realWorldExample:
      "`helmet` adds security headers at application level, an `adminRouter.use(requireAdmin)` guards only admin routes, and one error handler at the end formats all errors.",
    codeExamples: [
      {
        title: "Different kinds side by side",
        language: "javascript",
        code: `import express from "express"
import helmet from "helmet"

const app = express()
app.use(helmet())                         // third-party, application-level
app.use(express.json())                   // built-in

const admin = express.Router()
admin.use(requireAdmin)                   // router-level
admin.get("/stats", (req, res) => res.json({ users: 10 }))
app.use("/admin", admin)

app.use((err, req, res, next) => {        // error-handling: four parameters
  res.status(500).json({ message: "Something went wrong" })
})`,
        walkthrough: [
          "`helmet` is third-party and applies to the whole app.",
          "`express.json` is built into Express.",
          "The router applies `requireAdmin` only to paths under `/admin`.",
          "The four-parameter function is recognised as the error handler.",
        ],
      },
    ],
    commonMistakes: [
      "Writing an error handler with three parameters.",
      "Expecting router middleware to run for other routes.",
    ],
    followUps: [
      {
        question: "Where should the error handler be registered?",
        hint: "After all routes.",
      },
    ],
    answerTips: [
      "List the five types in a single breath, then give one example each.",
    ],
    keyPoints: [
      "Application-level",
      "Router-level",
      "Error-handling (4 params)",
      "Built-in and third-party",
    ],
    revisionNotes: ["Five kinds, one chain."],
    sourceRefs: [
      {
        label: "Express: Using middleware",
        url: `${EX}/guide/using-middleware.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "writing-custom-middleware",
    topic: "Middleware",
    difficulty: "medium",
    title:
      "How do you write a custom middleware, such as an authentication check or a validator?",
    keywords: [
      "custom middleware",
      "authentication middleware",
      "validation",
      "req object",
      "next(err)",
      "401",
    ],
    interviewerIntent:
      "A common live task. It checks that you can write a reusable middleware and stop the chain correctly.",
    shortAnswer:
      "Write a function `(req, res, next)`. Inspect the request, and if something is wrong send an error response and return, so the chain stops. If it is fine, optionally attach data such as `req.user` and call `next()`. To make it configurable, write a function that takes options and returns the middleware. For errors you want the central handler to deal with, call `next(err)` instead of responding directly.",
    detailedAnswer: [
      "Always `return` after sending a response, otherwise the code can continue and try to send a second response.",
      "Attaching data to `req` lets later handlers use it, but in TypeScript you need to extend the `Request` type.",
      "Keep middleware small and focused so that it can be reused on many routes.",
      "Async middleware must handle rejected promises, either with try/catch and `next(err)` or with a wrapper.",
    ],
    realWorldExample:
      "A `requireAuth` middleware reads a token from the header, verifies it, attaches the user to `req.user`, and is applied to every private route.",
    codeExamples: [
      {
        title: "Auth check and a configurable validator",
        language: "javascript",
        code: `function requireAuth(req, res, next) {
  const token = req.get("Authorization")?.replace("Bearer ", "")
  if (!token) return res.status(401).json({ message: "Missing token" })
  try {
    req.user = verifyToken(token)
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
}

const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => !req.body?.[f])
  if (missing.length) return res.status(400).json({ message: "Missing: " + missing.join(", ") })
  next()
}

app.post("/orders", requireAuth, requireFields("item", "qty"), createOrder)`,
        walkthrough: [
          "`requireAuth` stops the chain with 401 when the token is missing or invalid.",
          "On success it attaches the user and calls `next()`.",
          "`requireFields` returns a middleware configured with field names.",
          "Both are listed before the handler on the route.",
        ],
      },
    ],
    commonMistakes: [
      "Sending a response and forgetting to return.",
      "Not catching errors in async middleware.",
    ],
    followUps: [{ question: "How do you handle async errors in Express 4?" }],
    answerTips: [
      "Show the factory pattern, it separates juniors from experienced developers.",
    ],
    keyPoints: [
      "Respond and return, or call next",
      "Attach data to req",
      "Factory for options",
      "Handle async errors",
    ],
    revisionNotes: ["Stop the chain with a response, continue with next."],
    sourceRefs: [
      {
        label: "Express: Writing middleware",
        url: `${EX}/guide/writing-middleware.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "express-router",
    topic: "Project structure",
    difficulty: "easy",
    title: "What is express.Router() and why do you use it?",
    keywords: [
      "express.Router",
      "modular routes",
      "mini app",
      "app.use mount",
      "route organisation",
    ],
    interviewerIntent:
      "Checks that you can split an app into modules instead of one huge file.",
    shortAnswer:
      '`express.Router()` creates a mini application that holds its own routes and middleware. You export it from a file and mount it on the main app with `app.use("/prefix", router)`. This keeps routes grouped by feature, such as users, products or orders, lets you apply middleware to just one group, and makes the code easier to test and maintain.',
    detailedAnswer: [
      'Routes defined on a router are relative to the mount path, so `router.get("/")` mounted at `/users` handles `GET /users`.',
      "Routers can be nested and can have their own `router.use` middleware.",
      "`express.Router({ mergeParams: true })` lets a child router read parameters from its parent path.",
      "A router is still just middleware, so it follows the same order rules.",
    ],
    realWorldExample:
      "`routes/users.js`, `routes/orders.js` and `routes/products.js` each export a router, and `app.js` mounts them under `/api/users`, `/api/orders` and `/api/products`.",
    codeExamples: [
      {
        title: "A feature router",
        language: "javascript",
        code: `// routes/users.js
import { Router } from "express"
const router = Router()

router.get("/", listUsers)
router.get("/:id", getUser)
router.post("/", createUser)

export default router

// app.js
import usersRouter from "./routes/users.js"
app.use("/api/users", usersRouter)`,
        walkthrough: [
          "The router defines routes relative to its mount point.",
          "It is exported as a module.",
          "`app.use` mounts it under `/api/users`.",
          "`GET /api/users/5` reaches the `:id` route.",
        ],
      },
    ],
    commonMistakes: [
      "Repeating the prefix inside the router and the mount.",
      "Forgetting that params are not shared without mergeParams.",
    ],
    followUps: [{ question: "What does mergeParams do?" }],
    answerTips: ["Say 'one router per feature'."],
    keyPoints: [
      "Mini app with routes and middleware",
      "Mounted with app.use",
      "Routes relative to the mount path",
      "One router per feature",
    ],
    revisionNotes: ["Router = modular routes."],
    sourceRefs: [
      {
        label: "Express: Routing (express.Router)",
        url: `${EX}/guide/routing.html#express-router`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "mvc-project-structure",
    topic: "Project structure",
    difficulty: "medium",
    title:
      "How do you structure an Express project? What are routes, controllers, services and models?",
    keywords: [
      "project structure",
      "MVC",
      "controller",
      "service",
      "model",
      "layered architecture",
      "separation of concerns",
    ],
    interviewerIntent:
      "Checks that you separate HTTP concerns from business logic so the code stays testable.",
    shortAnswer:
      "A common structure has layers. Routes map URLs to controllers. Controllers read the request, call a service and send the response. Services hold the business logic and know nothing about HTTP. Models or repositories talk to the database. Configuration, middleware and utilities live in their own folders. This separation makes each part easier to test, change and reuse.",
    detailedAnswer: [
      "A controller should be thin: validate input, call a service, shape the response.",
      "Services can be tested without starting a server, because they take plain values.",
      "Keep configuration and secrets in one module that reads environment variables.",
      "Organising by feature, such as `users/` containing its routes, controller and service, scales well in larger apps.",
    ],
    realWorldExample:
      "The `POST /orders` route calls `orderController.create`, which calls `orderService.place`, which uses the `Order` model and a payment service.",
    codeExamples: [
      {
        title: "Controller calling a service",
        language: "javascript",
        code: `// orderController.js
export async function create(req, res, next) {
  try {
    const order = await orderService.place(req.user.id, req.body)
    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

// orderService.js
export async function place(userId, input) {
  if (!input.items?.length) throw new BadRequestError("No items")
  return Order.create({ userId, ...input })
}`,
        walkthrough: [
          "The controller reads the request and sends the response.",
          "The service holds the rules and does not use `req` or `res`.",
          "Errors are passed to the central error handler with `next(err)`.",
          "The service can be unit tested directly.",
        ],
      },
    ],
    commonMistakes: [
      "Putting business logic and database queries inside route handlers.",
      "Passing req and res into services.",
    ],
    followUps: [
      { question: "How would you organise the folders for a medium-size API?" },
    ],
    answerTips: ["Mention testability as the reason for layers."],
    keyPoints: [
      "Routes, controllers, services, models",
      "Thin controllers",
      "Services know nothing about HTTP",
      "Feature folders scale",
    ],
    revisionNotes: ["HTTP at the edge, logic in the middle."],
    sourceRefs: [
      { label: "Express: Routing", url: `${EX}/guide/routing.html` },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "error-handling-middleware",
    topic: "Error handling",
    difficulty: "medium",
    title:
      "How does error handling work in Express? How do you write a central error handler?",
    keywords: [
      "error handling",
      "error middleware",
      "next(err)",
      "four parameters",
      "status code",
      "default error handler",
    ],
    interviewerIntent:
      "Checks that you can turn errors into consistent responses instead of crashing or leaking details.",
    shortAnswer:
      "Express catches errors thrown synchronously in a handler and passes them to the error-handling middleware. For async code, you must pass the error with `next(err)`. An error handler is a middleware with four parameters `(err, req, res, next)` registered after all routes. It decides the status code and the response body, logs the error, and avoids leaking stack traces to clients in production.",
    detailedAnswer: [
      "If you do not write one, Express uses a default handler that returns the stack trace in development.",
      "Custom error classes with a `status` property let the handler pick the right code.",
      "Add a catch-all 404 handler before the error handler for unknown routes.",
      "Express 5 forwards rejected promises from async handlers automatically, while Express 4 needs a wrapper or try/catch.",
    ],
    realWorldExample:
      "A `NotFoundError` thrown in a service becomes a 404 JSON response, while an unexpected error becomes a generic 500 and is logged for developers.",
    codeExamples: [
      {
        title: "404 and a central error handler",
        language: "javascript",
        code: `class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await findUser(req.params.id)
    if (!user) throw new HttpError(404, "User not found")
    res.json(user)
  } catch (err) { next(err) }
})

app.use((req, res) => res.status(404).json({ message: "Not found" }))

app.use((err, req, res, next) => {
  const status = err.status ?? 500
  if (status === 500) console.error(err)
  res.status(status).json({ message: status === 500 ? "Server error" : err.message })
})`,
        walkthrough: [
          "A custom error carries the HTTP status.",
          "The async handler passes errors on with `next(err)`.",
          "The 404 handler catches routes that no earlier handler matched.",
          "The four-parameter handler picks the status and hides details for 500 errors.",
        ],
      },
    ],
    commonMistakes: [
      "Placing the error handler before the routes.",
      "Sending stack traces to clients in production.",
    ],
    followUps: [
      {
        question:
          "How do you handle errors in async route handlers in Express 4?",
      },
    ],
    answerTips: ["Mention the four-parameter signature and the placement."],
    keyPoints: [
      "Four parameters",
      "Registered last",
      "next(err) for async errors",
      "Do not leak internals",
    ],
    revisionNotes: ["One central handler, registered last."],
    sourceRefs: [
      {
        label: "Express: Error handling",
        url: `${EX}/guide/error-handling.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "async-errors-in-express",
    topic: "Error handling",
    difficulty: "medium",
    title:
      "Why do errors in async route handlers need special care in Express?",
    keywords: [
      "async handler",
      "unhandled rejection",
      "wrapper",
      "try catch",
      "Express 5",
      "next(err)",
    ],
    interviewerIntent:
      "A classic trap. It checks that you know a rejected promise is not caught automatically in Express 4.",
    shortAnswer:
      "In Express 4, a thrown error in synchronous code is caught, but a rejected promise inside an `async` handler is not forwarded to the error middleware, so the request hangs or the process reports an unhandled rejection. Wrap the body in try/catch and call `next(err)`, or use a small wrapper that forwards rejections. Express 5 handles rejected promises from async handlers automatically.",
    detailedAnswer: [
      "A wrapper like `const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next)` avoids repeating try/catch.",
      "Libraries such as `express-async-errors` patch Express 4 to do this.",
      "Always handle errors from database calls and external requests.",
      "Check your Express version, because the behaviour differs between 4 and 5.",
    ],
    realWorldExample:
      "A route awaited a database call that failed. Without a catch the request never finished and the client timed out, until the handler was wrapped.",
    codeExamples: [
      {
        title: "A wrapper for async handlers",
        language: "javascript",
        code: `const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

app.get("/orders/:id", wrap(async (req, res) => {
  const order = await Order.findById(req.params.id)   // may reject
  if (!order) return res.status(404).json({ message: "Not found" })
  res.json(order)
}))`,
        walkthrough: [
          "`wrap` returns a middleware that calls the async function.",
          "Any rejection is passed to `next`, which reaches the error handler.",
          "The handler itself stays short and has no try/catch.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming async errors are caught automatically in Express 4.",
      "Forgetting to handle failed database calls.",
    ],
    followUps: [{ question: "How does Express 5 change this?" }],
    answerTips: ["Mention the version difference."],
    keyPoints: [
      "Rejections are not forwarded in Express 4",
      "Use try/catch with next(err) or a wrapper",
      "Express 5 forwards them",
      "Always handle DB errors",
    ],
    revisionNotes: ["Async plus Express 4 needs next(err)."],
    sourceRefs: [
      {
        label: "Express: Error handling (asynchronous code)",
        url: `${EX}/guide/error-handling.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "http-status-codes-in-apis",
    topic: "REST API development",
    difficulty: "easy",
    title: "Which HTTP status codes should a REST API return and when?",
    keywords: [
      "status codes",
      "200",
      "201",
      "204",
      "400",
      "401",
      "403",
      "404",
      "500",
    ],
    interviewerIntent:
      "Checks that you return meaningful codes instead of always sending 200.",
    shortAnswer:
      "Use 200 for a successful read or update, 201 when something is created, and 204 for success with no body, such as a delete. Use 400 for invalid input, 401 when the user is not authenticated, 403 when they are authenticated but not allowed, 404 when a resource does not exist, 409 for a conflict, and 500 for an unexpected server error. Pick the code that tells the client what to do next.",
    detailedAnswer: [
      "The first digit tells the class: 2xx success, 3xx redirection, 4xx client error, 5xx server error.",
      "In Express set the code with `res.status(201)` and send with `.json()`, or use `res.sendStatus(204)`.",
      "Return a consistent error body, such as `{ message, code }`, so clients can handle it.",
      "Do not use 200 with an error message inside the body for failures.",
    ],
    realWorldExample:
      "`POST /users` with an existing email returns 409, while `GET /users/9999` returns 404, so the client can show the right message.",
    codeExamples: [
      {
        title: "Meaningful status codes",
        language: "javascript",
        code: `app.post("/users", async (req, res) => {
  if (!req.body.email) return res.status(400).json({ message: "Email is required" })
  if (await exists(req.body.email)) return res.status(409).json({ message: "Email already used" })
  const user = await create(req.body)
  res.status(201).json(user)
})

app.delete("/users/:id", async (req, res) => {
  const removed = await remove(req.params.id)
  if (!removed) return res.status(404).json({ message: "User not found" })
  res.sendStatus(204)
})`,
        walkthrough: [
          "Missing input returns 400.",
          "A duplicate returns 409.",
          "A successful create returns 201 with the new user.",
          "A delete returns 204 with no body, or 404 if there was nothing to delete.",
        ],
      },
    ],
    commonMistakes: [
      "Returning 200 for every response.",
      "Confusing 401 and 403.",
    ],
    followUps: [{ question: "What is the difference between 401 and 403?" }],
    answerTips: ["Group them by the first digit, then name the main ones."],
    keyPoints: [
      "200, 201, 204 for success",
      "400 bad input",
      "401 not authenticated, 403 not allowed",
      "404, 409, 500",
    ],
    revisionNotes: ["Status code tells the client what happened."],
    sourceRefs: [
      {
        label: "MDN: HTTP response status codes",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "rest-crud-api",
    topic: "REST API development",
    difficulty: "medium",
    title: "How would you design a REST API with CRUD endpoints in Express?",
    keywords: [
      "REST",
      "CRUD",
      "resources",
      "HTTP methods",
      "idempotent",
      "naming",
    ],
    interviewerIntent:
      "Checks that you map operations to methods and paths cleanly and know what each method means.",
    shortAnswer:
      "Model each thing as a resource with a plural noun path: `GET /books` lists, `GET /books/:id` reads one, `POST /books` creates, `PUT /books/:id` replaces, `PATCH /books/:id` updates part, and `DELETE /books/:id` removes. Use the HTTP method for the action, not the URL. Return JSON and correct status codes, and keep GET, PUT and DELETE idempotent, meaning repeating them has the same effect.",
    detailedAnswer: [
      "Avoid verbs in paths such as `/getBooks`. The method already says what you are doing.",
      "Use nested paths for clear relationships, such as `/authors/:id/books`, but keep nesting shallow.",
      "Version the API, for example `/api/v1/books`, so that you can change it later.",
      "Validate input and use pagination for lists.",
    ],
    realWorldExample:
      "A library app exposes `/api/v1/books` and `/api/v1/authors`, each with the same five operations, so any client can predict the endpoints.",
    codeExamples: [
      {
        title: "CRUD routes for books",
        language: "javascript",
        code: `const router = Router()

router.get("/", async (req, res) => res.json(await Book.find()))
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (!book) return res.status(404).json({ message: "Not found" })
  res.json(book)
})
router.post("/", async (req, res) => res.status(201).json(await Book.create(req.body)))
router.patch("/:id", async (req, res) => res.json(await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })))
router.delete("/:id", async (req, res) => { await Book.findByIdAndDelete(req.params.id); res.sendStatus(204) })`,
        walkthrough: [
          "Each route uses the method that matches the action.",
          "The single-item routes use the `:id` parameter.",
          "Create returns 201 and delete returns 204.",
          "`{ new: true }` returns the updated document, not the old one.",
        ],
      },
    ],
    commonMistakes: ["Putting verbs in URLs.", "Using POST for everything."],
    followUps: [{ question: "What is the difference between PUT and PATCH?" }],
    answerTips: ["Say 'nouns in the path, verbs in the method'."],
    keyPoints: [
      "Resources as plural nouns",
      "Method means the action",
      "Correct status codes",
      "Version and paginate",
    ],
    revisionNotes: ["Nouns in URLs, verbs in methods."],
    sourceRefs: [
      { label: "Express: Routing", url: `${EX}/guide/routing.html` },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "put-vs-patch-and-idempotency",
    topic: "REST API development",
    difficulty: "medium",
    title:
      "What is the difference between PUT and PATCH? What does idempotent mean?",
    keywords: [
      "PUT",
      "PATCH",
      "idempotent",
      "safe methods",
      "POST",
      "partial update",
    ],
    interviewerIntent:
      "A common REST question that checks understanding of method semantics, not just names.",
    shortAnswer:
      "PUT replaces a whole resource with the data you send, so missing fields are removed or reset. PATCH changes only the fields you send. An operation is idempotent if repeating it gives the same result as doing it once. GET, PUT and DELETE are idempotent, and POST is not, because sending it twice usually creates two resources. PATCH can be idempotent depending on how it is used.",
    detailedAnswer: [
      "Safe methods, such as GET, do not change data on the server.",
      "Idempotency matters for retries: a client can safely repeat a PUT after a timeout.",
      "To make POST safe to retry, many APIs accept an idempotency key header.",
      "Use PATCH for small updates like changing one field, and PUT when the client holds the full object.",
    ],
    realWorldExample:
      '`PATCH /users/5` with `{ "phone": "..." }` changes only the phone, while `PUT /users/5` must include every field.',
    commonMistakes: [
      "Using PUT for partial updates.",
      "Thinking POST is idempotent.",
    ],
    followUps: [
      { question: "Is DELETE idempotent if the second call returns 404?" },
    ],
    answerTips: ["Give the retry example, it shows why idempotency matters."],
    keyPoints: [
      "PUT replaces",
      "PATCH changes parts",
      "Idempotent = same result when repeated",
      "POST is not idempotent",
    ],
    revisionNotes: ["PUT replaces, PATCH patches."],
    sourceRefs: [
      {
        label: "MDN: HTTP request methods",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "serving-static-files",
    topic: "Routing",
    difficulty: "easy",
    title: "How do you serve static files in Express?",
    keywords: [
      "express.static",
      "static files",
      "public folder",
      "mount path",
      "caching",
    ],
    interviewerIntent:
      "A basic but practical question about assets such as images, CSS and a built front end.",
    shortAnswer:
      'Use the built-in `express.static` middleware: `app.use(express.static("public"))` serves files from the `public` folder, so `public/logo.png` is available at `/logo.png`. You can mount it under a path, such as `app.use("/assets", express.static("public"))`. Use an absolute path built from `__dirname` or `import.meta` to avoid depending on the working directory, and set cache headers for production.',
    detailedAnswer: [
      "Register static middleware before routes that might otherwise match the same URLs.",
      "For a single-page application, serve the build folder and add a fallback that sends `index.html` for unknown routes.",
      "In production a reverse proxy such as Nginx or a CDN often serves static files more efficiently.",
      "Options such as `maxAge` control browser caching.",
    ],
    realWorldExample:
      "A React build is placed in `dist`, served with `express.static`, and the API lives under `/api` in the same app.",
    codeExamples: [
      {
        title: "Static files and a SPA fallback",
        language: "javascript",
        code: `import path from "node:path"
import { fileURLToPath } from "node:url"

const dir = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(dir, "dist")

app.use("/api", apiRouter)
app.use(express.static(dist, { maxAge: "1d" }))
app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")))`,
        walkthrough: [
          "The path is built from the file location, not the working directory.",
          "The API router is mounted before the static files.",
          "`maxAge` lets browsers cache the files for a day.",
          "Any other URL returns `index.html`, so client-side routing works.",
        ],
      },
    ],
    commonMistakes: [
      "Using a relative path that breaks when started from another folder.",
      "Serving static files after a catch-all route.",
    ],
    followUps: [
      { question: "Why might you serve static files from Nginx instead?" },
    ],
    answerTips: ["Mention the SPA fallback."],
    keyPoints: [
      "express.static middleware",
      "Folder maps to URL root",
      "Use absolute paths",
      "Cache in production",
    ],
    revisionNotes: ["express.static serves a folder."],
    sourceRefs: [
      {
        label: "Express: Serving static files",
        url: `${EX}/starter/static-files.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "cors-in-express",
    topic: "Middleware",
    difficulty: "medium",
    title: "What is CORS and how do you handle it in an Express API?",
    keywords: [
      "CORS",
      "cors middleware",
      "preflight",
      "Access-Control-Allow-Origin",
      "same-origin policy",
      "credentials",
    ],
    interviewerIntent:
      "A very common practical problem when a front end on one origin calls an API on another.",
    shortAnswer:
      "Browsers block a page from reading responses from a different origin unless the server allows it with CORS headers such as `Access-Control-Allow-Origin`. For some requests the browser first sends a preflight `OPTIONS` request. In Express you usually add the `cors` middleware with a list of allowed origins, methods and headers. CORS is enforced by browsers only, and it is not a security feature for your server.",
    detailedAnswer: [
      "An origin is the combination of scheme, host and port, so `http://localhost:3000` and `http://localhost:5173` are different origins.",
      "If cookies or credentials are sent, you must name an exact origin and enable `credentials`. A wildcard is not allowed.",
      "Allow only the origins you need rather than `*` for private APIs.",
      "Server-to-server calls and tools like curl ignore CORS, so you still need authentication.",
    ],
    realWorldExample:
      "A React app on `localhost:5173` calls an Express API on `localhost:3000`, and the browser blocks it until the API allows that origin.",
    codeExamples: [
      {
        title: "Configuring cors",
        language: "javascript",
        code: `import cors from "cors"

app.use(
  cors({
    origin: ["http://localhost:5173", "https://app.example.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
)`,
        walkthrough: [
          "Only the listed origins are allowed to call the API from a browser.",
          "The allowed methods are listed for the preflight response.",
          "`credentials: true` allows cookies to be sent, which needs exact origins.",
          "The middleware is registered before the routes.",
        ],
      },
    ],
    commonMistakes: [
      "Using a wildcard origin with credentials.",
      "Thinking CORS protects the server from other clients.",
    ],
    followUps: [{ question: "What is a preflight request?" }],
    answerTips: ["Say that CORS is a browser rule, not server security."],
    keyPoints: [
      "Origin = scheme, host, port",
      "Server sends allow headers",
      "Preflight OPTIONS",
      "Not a replacement for authentication",
    ],
    revisionNotes: ["CORS is the browser asking permission."],
    sourceRefs: [
      {
        label: "MDN: Cross-Origin Resource Sharing (CORS)",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "request-validation",
    topic: "REST API development",
    difficulty: "medium",
    title: "How do you validate request data in an Express API?",
    keywords: [
      "validation",
      "Joi",
      "Zod",
      "express-validator",
      "sanitisation",
      "400 Bad Request",
    ],
    interviewerIntent:
      "Checks that you never trust client input and know a practical way to validate it.",
    shortAnswer:
      "Never trust input from the client. Validate the body, params and query against a schema, using a library such as Zod, Joi or express-validator, in a middleware that runs before the handler. If validation fails, return 400 with clear messages. Validation also converts types and strips unknown fields. Keep server-side validation even if the front end validates too.",
    detailedAnswer: [
      "A schema describes the allowed shape: required fields, types, lengths and formats.",
      "Parsing with a schema returns clean, typed data that the handler can use safely.",
      "Sanitise or escape data that will be stored or shown, to prevent injection and cross-site scripting.",
      "Reuse schemas between routes and, in TypeScript projects, infer types from them.",
    ],
    realWorldExample:
      "A `POST /users` route uses a Zod schema that requires a valid email and a password of at least eight characters, and rejects anything else with a 400.",
    codeExamples: [
      {
        title: "A validation middleware with Zod",
        language: "javascript",
        code: `import { z } from "zod"

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues.map((i) => i.message) })
  }
  req.body = result.data           // clean, typed data
  next()
}

app.post("/users", validate(userSchema), createUser)`,
        walkthrough: [
          "The schema describes a valid user.",
          "The middleware checks the body and returns 400 with messages when it fails.",
          "On success the cleaned data replaces `req.body`.",
          "The handler can then trust the input.",
        ],
      },
    ],
    commonMistakes: [
      "Relying only on front-end validation.",
      "Using the body without checking it.",
    ],
    followUps: [
      {
        question: "What is the difference between validation and sanitisation?",
      },
    ],
    answerTips: [
      "Say 'validate at the edge, with a schema, before the handler'.",
    ],
    keyPoints: [
      "Never trust input",
      "Schema-based validation",
      "400 with clear messages",
      "Server-side always",
    ],
    revisionNotes: ["Validate before you handle."],
    sourceRefs: [
      {
        label: "Express: Production best practices: security",
        url: `${EX}/advanced/best-practice-security.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "pagination-filtering-sorting",
    topic: "REST API development",
    difficulty: "medium",
    title:
      "How do you implement pagination, filtering and sorting in a list endpoint?",
    keywords: [
      "pagination",
      "limit",
      "offset",
      "cursor",
      "filtering",
      "sorting",
      "query string",
    ],
    interviewerIntent:
      "A practical API design question. Large lists must never be returned in one response.",
    shortAnswer:
      "Accept `page` and `limit` (or `offset` and `limit`) in the query string, set sensible defaults and a maximum limit, and return only that slice. For filtering, accept fields such as `category` or `status` and build the query from the allowed ones. For sorting, accept `sort` with a whitelist of fields. Return the total count and paging details so clients can build pagination. For very large data, cursor-based pagination scales better than offsets.",
    detailedAnswer: [
      "Always cap `limit`, otherwise a client can request a huge page.",
      "Whitelist filter and sort fields, so users cannot query internal columns or inject operators.",
      "Offset pagination can skip or repeat rows when data changes, and it gets slow on large tables.",
      "A cursor, such as the last seen id or date, gives stable and fast paging.",
    ],
    realWorldExample:
      "`GET /products?category=books&sort=price&page=2&limit=20` returns the second page of 20 books ordered by price, with `total` in the response.",
    codeExamples: [
      {
        title: "A paginated list route",
        language: "javascript",
        code: `app.get("/products", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Number(req.query.limit) || 20)

  const filter = {}
  if (req.query.category) filter.category = String(req.query.category)

  const sortable = ["price", "name", "createdAt"]
  const sortBy = sortable.includes(req.query.sort) ? req.query.sort : "createdAt"

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ [sortBy]: 1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ])
  res.json({ items, page, limit, total })
})`,
        walkthrough: [
          "Page and limit have defaults, and the limit has a maximum of 50.",
          "Only an allowed filter and sort field are used.",
          "The items and the total count are fetched together.",
          "The response includes paging details for the client.",
        ],
      },
    ],
    commonMistakes: [
      "No maximum limit.",
      "Passing query values straight into the database query.",
    ],
    followUps: [
      { question: "Why can offset pagination be slow on large tables?" },
    ],
    answerTips: [
      "Mention caps and whitelists, then cursor pagination as the scalable option.",
    ],
    keyPoints: [
      "page and limit with a cap",
      "Whitelist filters and sort fields",
      "Return the total",
      "Cursor for large data",
    ],
    revisionNotes: ["Never return an unbounded list."],
    sourceRefs: [
      {
        label: "Express: API reference (req.query)",
        url: `${EX}/4x/api.html#req.query`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "authentication-with-jwt-in-express",
    topic: "Middleware",
    difficulty: "medium",
    title: "How do you protect routes with JWT authentication in Express?",
    keywords: [
      "JWT",
      "authentication",
      "Authorization header",
      "jsonwebtoken",
      "protected routes",
      "token verification",
    ],
    interviewerIntent:
      "A very common backend task. The interviewer checks the login flow and where verification happens.",
    shortAnswer:
      "On login, verify the user's credentials, then sign a JSON Web Token containing the user id and an expiry and return it. The client sends it in the `Authorization: Bearer <token>` header with later requests. A middleware verifies the signature and expiry and attaches the user to `req`, or returns 401. Apply that middleware to protected routes. Keep the secret in an environment variable and use short expiry times.",
    detailedAnswer: [
      "A JWT is signed, not encrypted, so never put secrets in its payload.",
      "Store tokens carefully on the client. HttpOnly cookies protect against script access, while localStorage is exposed to cross-site scripting.",
      "Use refresh tokens for longer sessions, and a way to revoke them.",
      "Hash passwords with bcrypt or argon2 and never store them in plain text.",
    ],
    realWorldExample:
      "`POST /login` returns a token valid for 15 minutes, and `GET /profile` uses `requireAuth` to read the user id from the token.",
    codeExamples: [
      {
        title: "Login and a protected route",
        language: "javascript",
        code: `import jwt from "jsonwebtoken"

app.post("/login", async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password)
  if (!user) return res.status(401).json({ message: "Wrong email or password" })
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" })
  res.json({ token })
})

function requireAuth(req, res, next) {
  const token = req.get("Authorization")?.split(" ")[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

app.get("/profile", requireAuth, (req, res) => res.json({ id: req.user.sub }))`,
        walkthrough: [
          "Login checks the credentials and signs a token with an expiry.",
          "The secret comes from an environment variable.",
          "`requireAuth` verifies the token and attaches the payload to the request.",
          "The profile route is protected by listing the middleware before the handler.",
        ],
      },
    ],
    commonMistakes: [
      "Putting sensitive data in the payload.",
      "Using a long-lived token with no way to revoke it.",
    ],
    followUps: [
      { question: "Where should the token be stored in the browser?" },
    ],
    answerTips: ["Mention that JWTs are signed, not encrypted."],
    keyPoints: [
      "Sign on login",
      "Verify in middleware",
      "Bearer header",
      "Short expiry, secret in env",
    ],
    revisionNotes: ["Sign once, verify on every request."],
    sourceRefs: [
      {
        label: "Express: Production best practices: security",
        url: `${EX}/advanced/best-practice-security.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "security-headers-and-rate-limiting",
    topic: "Middleware",
    difficulty: "medium",
    title:
      "How do you secure an Express app? What are helmet and rate limiting?",
    keywords: [
      "helmet",
      "rate limiting",
      "security headers",
      "HTTPS",
      "x-powered-by",
      "brute force",
    ],
    interviewerIntent:
      "Checks the basic hardening steps that every production Express API should have.",
    shortAnswer:
      "Use `helmet` to set secure HTTP headers, add rate limiting with a package such as `express-rate-limit` to slow brute-force and abuse, validate all input, limit the request body size, use HTTPS, and disable the `X-Powered-By` header. Keep dependencies updated, hash passwords, never log secrets, and avoid detailed error messages in production.",
    detailedAnswer: [
      "Helmet sets headers such as Content-Security-Policy and X-Content-Type-Options in one call.",
      "Rate limits are applied per client, for example by IP address, and are stricter on login routes.",
      "Behind a proxy or load balancer, set `trust proxy` so that the client IP is read correctly.",
      "Use `NODE_ENV=production`, which makes Express faster and less verbose.",
    ],
    realWorldExample:
      "A login endpoint allows ten attempts per fifteen minutes per IP, and the whole API sends secure headers through helmet.",
    codeExamples: [
      {
        title: "Basic hardening",
        language: "javascript",
        code: `import helmet from "helmet"
import rateLimit from "express-rate-limit"

app.disable("x-powered-by")
app.use(helmet())
app.use(express.json({ limit: "100kb" }))

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 })
app.post("/login", loginLimiter, login)`,
        walkthrough: [
          "The framework header is removed so the stack is not advertised.",
          "`helmet` adds protective headers to every response.",
          "The body size is capped.",
          "The limiter allows ten login attempts per fifteen minutes.",
        ],
      },
    ],
    commonMistakes: [
      "Running without rate limiting on login.",
      "Leaving the default error output on in production.",
    ],
    followUps: [
      { question: "Why do you need trust proxy behind a load balancer?" },
    ],
    answerTips: ["List four items: helmet, limits, validation, HTTPS."],
    keyPoints: [
      "helmet for headers",
      "Rate limit, especially login",
      "Limit body size",
      "HTTPS and dependency updates",
    ],
    revisionNotes: ["Headers, limits, validation, HTTPS."],
    sourceRefs: [
      {
        label: "Express: Production best practices: security",
        url: `${EX}/advanced/best-practice-security.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "express-json-and-urlencoded",
    topic: "Middleware",
    difficulty: "easy",
    title: "What do express.json() and express.urlencoded() do?",
    keywords: [
      "express.json",
      "express.urlencoded",
      "body parser",
      "req.body",
      "content-type",
      "extended",
    ],
    interviewerIntent:
      "Checks that you know why req.body is empty without a body parser and which one to use.",
    shortAnswer:
      "Both are built-in middleware that read the request body and put the result in `req.body`. `express.json()` parses bodies with `Content-Type: application/json`. `express.urlencoded()` parses form submissions with `application/x-www-form-urlencoded`. Without them `req.body` is undefined. For file uploads with `multipart/form-data` you need another package such as multer.",
    detailedAnswer: [
      "They only parse requests whose content type matches, and skip the rest.",
      "`extended: true` in `urlencoded` allows nested objects, using the `qs` library.",
      'Set a size limit, for example `express.json({ limit: "100kb" })`, to prevent very large bodies.',
      "Register them before the routes that read the body.",
    ],
    realWorldExample:
      "A React front end posts JSON, so the API uses `express.json()`, while an HTML login form posts url-encoded data and needs `express.urlencoded()`.",
    codeExamples: [
      {
        title: "Registering the parsers",
        language: "javascript",
        code: `app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({ extended: true }))

app.post("/contact", (req, res) => {
  console.log(req.body)         // { name: "Asha", message: "Hi" }
  res.sendStatus(204)
})`,
        walkthrough: [
          "The JSON parser handles `application/json` bodies.",
          "The urlencoded parser handles form posts.",
          "Both fill `req.body` before the route runs.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting the parser and getting undefined.",
      "Registering the parser after the route.",
    ],
    followUps: [{ question: "How do you handle file uploads?" }],
    answerTips: ["Mention content types."],
    keyPoints: [
      "Fill req.body",
      "json for JSON, urlencoded for forms",
      "Order matters",
      "multer for files",
    ],
    revisionNotes: ["No parser, no req.body."],
    sourceRefs: [
      {
        label: "Express: API reference (express.json)",
        url: `${EX}/4x/api.html#express.json`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "request-response-objects",
    topic: "Routing",
    difficulty: "easy",
    title: "What are the main methods on the Express req and res objects?",
    keywords: [
      "req",
      "res",
      "res.send",
      "res.json",
      "res.status",
      "res.redirect",
      "res.cookie",
    ],
    interviewerIntent:
      "Checks daily familiarity with the request and response APIs.",
    shortAnswer:
      "`req` gives access to `params`, `query`, `body`, `headers`, `cookies` (with a parser), `method` and `path`. On `res`, `status()` sets the code, `json()` sends JSON, `send()` sends text or a buffer, `sendStatus()` sends a code with its text, `redirect()` redirects, `set()` sets headers, `cookie()` sets a cookie and `sendFile()` sends a file. Each response can be sent only once.",
    detailedAnswer: [
      "`res.status(201).json(obj)` chains because `status` returns the response.",
      "Sending a response twice causes the error 'Cannot set headers after they are sent'.",
      "`res.locals` holds data for the lifetime of one request and is useful for sharing between middleware and views.",
      "`res.end()` ends the response without data.",
    ],
    realWorldExample:
      "A route reads `req.params.id`, sets a `Cache-Control` header with `res.set`, and sends the item with `res.json`.",
    codeExamples: [
      {
        title: "Common req and res calls",
        language: "javascript",
        code: `app.get("/items/:id", (req, res) => {
  const item = find(req.params.id)
  if (!item) return res.status(404).json({ message: "Not found" })

  res.set("Cache-Control", "public, max-age=60")
  res.json(item)
})

app.get("/old", (req, res) => res.redirect(301, "/new"))
app.get("/report", (req, res) => res.sendFile("/files/report.pdf"))`,
        walkthrough: [
          "The route reads the id from `req.params`.",
          "`return` stops the handler after the 404 so nothing is sent twice.",
          "`res.set` adds a header and `res.json` sends the body.",
          "`redirect` and `sendFile` cover two other common responses.",
        ],
      },
    ],
    commonMistakes: [
      "Sending two responses.",
      "Forgetting to return after an early response.",
    ],
    followUps: [
      { question: "What causes 'Cannot set headers after they are sent'?" },
    ],
    answerTips: ["Mention chaining and the send-once rule."],
    keyPoints: [
      "req: params, query, body, headers",
      "res: status, json, send, redirect",
      "Send only once",
      "return after early responses",
    ],
    revisionNotes: ["One request, one response."],
    sourceRefs: [
      { label: "Express: API reference (res)", url: `${EX}/4x/api.html#res` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "app-use-vs-app-get-and-order",
    topic: "Routing",
    difficulty: "medium",
    title:
      "What is the difference between app.use() and app.get()? Why does the order of routes matter?",
    keywords: [
      "app.use",
      "app.get",
      "mount path",
      "route order",
      "path prefix",
      "middleware order",
    ],
    interviewerIntent:
      "Checks that you understand matching rules, which cause many real bugs.",
    shortAnswer:
      "`app.get(path, handler)` matches only GET requests whose path matches exactly (apart from parameters). `app.use(path, fn)` matches every method and any path that starts with the given prefix, and strips that prefix from the URL the middleware sees. Express processes handlers in the order they are registered, so a broad `app.use` or a catch-all route placed too early can stop later routes from ever running.",
    detailedAnswer: [
      "`app.use` without a path applies to every request.",
      "`app.all` matches every method for an exact path, while `app.use` matches a prefix.",
      "Register specific routes before general ones, and the catch-all 404 handler near the end.",
      "A middleware that does not call `next()` also stops everything after it.",
    ],
    realWorldExample:
      "A `/:slug` route registered before `/about` captures the request for `/about`, so the about page never shows.",
    commonMistakes: [
      "Registering a wildcard route before specific routes.",
      "Using app.use where a method-specific route was intended.",
    ],
    followUps: [
      {
        question:
          "What does req.path look like inside a router mounted at /api?",
      },
    ],
    answerTips: ["Use the `/:slug` before `/about` example."],
    keyPoints: [
      "use = any method and prefix",
      "get = one method, specific path",
      "Order decides the winner",
      "404 handler near the end",
    ],
    revisionNotes: ["First match wins."],
    sourceRefs: [
      {
        label: "Express: Using middleware",
        url: `${EX}/guide/using-middleware.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "environment-and-production-best-practices",
    topic: "Project structure",
    difficulty: "medium",
    title: "What are the best practices for running Express in production?",
    keywords: [
      "production",
      "NODE_ENV",
      "logging",
      "compression",
      "process manager",
      "reverse proxy",
      "graceful shutdown",
    ],
    interviewerIntent:
      "Checks that you think beyond writing routes to how the app runs.",
    shortAnswer:
      "Set `NODE_ENV=production`, run behind a reverse proxy such as Nginx with HTTPS, and use a process manager or container orchestrator to restart the app if it crashes. Use gzip compression, structured logging, environment variables for configuration, a health-check endpoint, graceful shutdown on SIGTERM, and secure headers. Handle errors centrally and avoid blocking the event loop with synchronous work.",
    detailedAnswer: [
      "`NODE_ENV=production` enables caching of views and makes error messages less detailed.",
      "Do not use `console.log` for everything: use a logger such as pino or winston with levels.",
      "Run several instances, with the cluster module, PM2 or container replicas, to use all CPU cores.",
      "Monitor the app, and set up alerts for errors and slow responses.",
    ],
    realWorldExample:
      "An API runs in a container behind a load balancer, exposes `/health` for checks, logs JSON lines, and shuts down gracefully during deploys.",
    commonMistakes: [
      "Running with the development settings in production.",
      "Using synchronous calls inside request handlers.",
    ],
    followUps: [
      { question: "Why is a reverse proxy useful in front of Node?" },
    ],
    answerTips: [
      "Group the answer: environment, process, security, observability.",
    ],
    keyPoints: [
      "NODE_ENV=production",
      "Reverse proxy and HTTPS",
      "Process manager and health check",
      "Structured logs and graceful shutdown",
    ],
    revisionNotes: ["Run it like a service, not like a script."],
    sourceRefs: [
      {
        label:
          "Express: Production best practices: performance and reliability",
        url: `${EX}/advanced/best-practice-performance.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "express-with-database-connection",
    topic: "Project structure",
    difficulty: "medium",
    title: "How do you connect an Express app to a database properly?",
    keywords: [
      "database connection",
      "connection pool",
      "startup",
      "environment variable",
      "mongoose",
      "graceful shutdown",
    ],
    interviewerIntent:
      "Checks that you connect once, reuse the connection and fail clearly when the database is unavailable.",
    shortAnswer:
      "Create the database connection or pool once when the application starts, not inside each request, and reuse it. Read the connection string from an environment variable. Start listening for requests only after the connection works, or expose a health check that reports the status. Handle connection errors, and close the connection when the server shuts down. Pass the database access through repositories or models, not directly from handlers.",
    detailedAnswer: [
      "Connection pools let many requests share a small number of connections, which is much cheaper than opening one per request.",
      "If the database is down at startup, fail fast with a clear message instead of serving broken responses.",
      "Retry with backoff for transient errors, but do not hide permanent failures.",
      "Keep credentials out of the code and never log the connection string.",
    ],
    realWorldExample:
      "The app connects to MongoDB at startup, then calls `app.listen`, and closes the connection when it receives SIGTERM.",
    codeExamples: [
      {
        title: "Connect first, then listen",
        language: "javascript",
        code: `import mongoose from "mongoose"

async function start() {
  await mongoose.connect(process.env.MONGODB_URL)
  console.log("database connected")

  const server = app.listen(process.env.PORT ?? 3000)

  process.on("SIGTERM", () => {
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
  })
}

start().catch((err) => {
  console.error("startup failed:", err.message)
  process.exit(1)
})`,
        walkthrough: [
          "The connection string comes from the environment.",
          "The server starts listening only after the connection succeeds.",
          "On SIGTERM the server stops accepting requests and the database closes.",
          "A failed startup exits with a clear message.",
        ],
      },
    ],
    commonMistakes: [
      "Opening a new connection per request.",
      "Starting the server before the database is ready.",
    ],
    followUps: [{ question: "What is a connection pool and why use one?" }],
    answerTips: ["Say 'connect once, reuse, close on shutdown'."],
    keyPoints: [
      "Connect once at startup",
      "Use a pool",
      "Listen after connecting",
      "Close on shutdown",
    ],
    revisionNotes: ["One connection setup, many requests."],
    sourceRefs: [
      {
        label: "Express: Database integration",
        url: `${EX}/guide/database-integration.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "testing-express-apis",
    topic: "Project structure",
    difficulty: "medium",
    title: "How do you test an Express API?",
    keywords: [
      "testing",
      "supertest",
      "unit tests",
      "integration tests",
      "mocking",
      "separate app and server",
    ],
    interviewerIntent:
      "Checks that you can test routes without starting a real server on a port.",
    shortAnswer:
      "Export the Express `app` separately from the code that calls `listen`, so tests can import it. Use a library such as Supertest to send HTTP requests to the app in memory and assert on status codes and bodies. Unit test services and middleware on their own, and integration test routes with a test database or mocks. Reset state between tests and run them in CI.",
    detailedAnswer: [
      "Splitting `app.js` and `server.js` is the key structural step.",
      "Mock external services such as payment providers, and use a separate database for tests.",
      "Test the unhappy paths too: invalid input, missing auth and missing resources.",
      "Pure functions and services are the easiest and fastest tests.",
    ],
    realWorldExample:
      "A test posts an invalid user to `/users` with Supertest and checks that the response status is 400 and the message names the missing field.",
    codeExamples: [
      {
        title: "A Supertest example",
        language: "javascript",
        code: `import request from "supertest"
import { test } from "node:test"
import assert from "node:assert/strict"
import app from "./app.js"      // app is exported without calling listen

test("POST /users rejects a missing email", async () => {
  const res = await request(app).post("/users").send({ name: "Asha" })
  assert.equal(res.status, 400)
  assert.match(res.body.message, /email/i)
})`,
        walkthrough: [
          "The app is imported without starting a server.",
          "Supertest sends the request directly to the app.",
          "The test asserts the status code and the error message.",
        ],
      },
    ],
    commonMistakes: [
      "Calling listen inside the same file that tests import.",
      "Testing only the happy path.",
    ],
    followUps: [{ question: "How do you isolate the database in tests?" }],
    answerTips: ["Mention splitting app and server."],
    keyPoints: [
      "Export app, listen elsewhere",
      "Supertest for HTTP assertions",
      "Unit test services",
      "Test error paths",
    ],
    revisionNotes: ["Test the app object, not a port."],
    sourceRefs: [
      {
        label: "Node.js: Test runner",
        url: "https://nodejs.org/api/test.html",
      },
    ],
    estimatedMinutes: 4,
  },
])
