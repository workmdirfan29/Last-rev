import { defineLesson } from "@/data/lessons/author"

export default defineLesson("express", {
  slug: "routing",
  title: "Routing in Express",
  topic: "Routing",
  minutes: 50,
  overview:
    "Learn how Express matches a request to a handler: methods, paths, route parameters, query strings, response methods and modular routers.",
  objectives: [
    "Define routes with app.METHOD(path, handler) and read req.params and req.query",
    "Send responses with the right res method and explain what happens if none is called",
    "Group related routes in an express.Router",
  ],
  prerequisites: ["lesson.nodejs.async-patterns"],
  sections: [
    {
      kind: "explain",
      heading: "Routes",
      body: [
        "A **route** tells Express what to do when a request arrives with a certain HTTP method and path. The shape is `app.METHOD(PATH, HANDLER)`, where `METHOD` is a lower-case HTTP method such as `get` or `post`.",
        "The handler receives the request (`req`) and response (`res`) objects. A route handler must end the request-response cycle by calling a response method. If none of them is called, the client request is left hanging.",
        "Routes are checked in the order they are defined, and the first handler that sends a response ends the cycle.",
      ],
    },
    {
      kind: "code",
      heading: "Paths, parameters and responses",
      example: {
        title: "A few routes",
        language: "javascript",
        code: "import express from 'express';\n\nconst app = express();\napp.use(express.json());\n\napp.get('/', (req, res) => {\n  res.send('Hello');\n});\n\napp.get('/users/:userId', (req, res) => {\n  res.json({ id: req.params.userId });\n});\n\napp.get('/search', (req, res) => {\n  res.json({ term: req.query.q });\n});\n\napp.post('/users', (req, res) => {\n  res.status(201).json(req.body);\n});\n\napp.listen(3000);",
        walkthrough: [
          "`express()` creates the application. `app.get('/', …)` handles GET requests to the root path.",
          "`:userId` is a named route parameter. For `/users/34`, `req.params.userId` is the string `'34'`.",
          "The query string `?q=express` appears in `req.query`. Values are strings.",
          "`express.json()` is built-in middleware that parses a JSON body into `req.body`. `res.status(201).json(…)` sets the status and sends JSON.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Response methods",
      diagram: {
        kind: "table",
        title: "Methods that end the cycle",
        headers: ["Method", "Use"],
        rows: [
          ["`res.send()`", "Send a response of various types"],
          ["`res.json()`", "Send a JSON response"],
          ["`res.redirect()`", "Redirect the request"],
          ["`res.sendFile()`", "Send a file"],
          ["`res.render()`", "Render a view template"],
          ["`res.end()`", "End the response with no data"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Modular routers",
      example: {
        title: "express.Router",
        language: "javascript",
        code: "// routes/books.js\nimport express from 'express';\n\nexport const router = express.Router();\n\nrouter.get('/', (req, res) => {\n  res.json([]);\n});\n\nrouter.get('/:id', (req, res) => {\n  res.json({ id: req.params.id });\n});\n\n// app.js\nimport { router as books } from './routes/books.js';\napp.use('/books', books);",
        walkthrough: [
          "An `express.Router` is a mini application that holds routes and middleware.",
          "Mounting it with `app.use('/books', books)` prefixes every route in the router with `/books`.",
          "`router.get('/:id')` therefore answers `GET /books/42`.",
          "This keeps related routes in one file and the main application file short.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "A handler that never sends a response.",
          fix: "Call res.send, res.json or another response method on every path, or the client waits.",
        },
        {
          mistake: "Sending two responses for one request.",
          fix: "Return after sending, so later code does not try to send again.",
        },
        {
          mistake: "Treating route parameters as numbers.",
          fix: "They are strings. Convert and validate them before use.",
        },
        {
          mistake: "Putting a broad route before a specific one.",
          fix: "Routes match in order, so define the specific routes first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A small books API",
      scenario:
        "You need endpoints to list books, get one book by id and add a book.",
      body: [
        "Create `GET /books`, `GET /books/:id` and `POST /books` in a router mounted at `/books`. The POST handler reads `req.body` thanks to `express.json()` and answers `201` with the new book.",
        "Check the id parameter, and answer `404` with a JSON message when no book matches.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "read-param",
      prompt: "Where do you find the value of :userId in a route?",
      options: ["req.params.userId", "req.query.userId", "req.body.userId"],
      answer: 0,
      explanation:
        "Named route parameters are populated in req.params.",
    },
    {
      type: "truefalse",
      id: "no-response",
      statement: "If a route handler never calls a response method, the client request is left hanging.",
      answer: true,
      explanation:
        "The handler must end the request-response cycle.",
    },
    {
      type: "single",
      id: "router-mount",
      prompt: "After app.use('/books', router), which request does router.get('/:id') handle?",
      options: ["GET /books/42", "GET /42", "GET /books"],
      answer: 0,
      explanation:
        "The router is mounted under /books, so its paths are relative to that prefix.",
    },
    {
      type: "blank",
      id: "json-parser",
      prompt: "express.___() is built-in middleware that parses a JSON request body.",
      answer: "json",
      explanation:
        "`express.json()` populates req.body from JSON requests.",
    },
  ],
  assignment: {
    title: "Notes API routes",
    task: [
      "Build an Express app with routes to list notes, get a note by id, create a note and delete a note, using an in-memory array.",
      "Put the routes in an express.Router and mount it at /notes.",
    ],
    checklist: [
      "Each route sends a response on every path",
      "The id parameter is converted and checked",
      "A missing note returns 404",
      "A created note returns 201",
    ],
    hints: ["Test each route with a command-line HTTP client."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "parse-route-params",
      title: "Read route parameters",
      task: [
        "Write `matchRoute(pattern, path)` for patterns like '/users/:id/books/:bookId'. It should return an object with the parameter values (as strings), or null if the path does not match. Segments are separated by '/' and a segment starting with ':' is a parameter.",
      ],
      language: "javascript",
      starter: "function matchRoute(pattern, path) {\n  // your code\n}",
      solution:
        "function matchRoute(pattern, path) {\n  const p = pattern.split('/');\n  const q = path.split('/');\n  if (p.length !== q.length) return null;\n  const params = {};\n  for (let i = 0; i < p.length; i++) {\n    if (p[i].startsWith(':')) params[p[i].slice(1)] = q[i];\n    else if (p[i] !== q[i]) return null;\n  }\n  return params;\n}",
      hints: ["Split both strings on '/' and compare segment by segment."],
      checklist: [
        "Parameter names come from the pattern",
        "Literal segments must match exactly",
        "A different number of segments returns null",
      ],
      run: {
        entry: "matchRoute",
        cases: [
          { name: "one param", args: ["/users/:id", "/users/34"], expected: { id: "34" } },
          { name: "two params", args: ["/users/:id/books/:bookId", "/users/34/books/8989"], expected: { id: "34", bookId: "8989" } },
          { name: "literal mismatch", args: ["/users/:id", "/people/34"], expected: null },
          { name: "length mismatch", args: ["/users/:id", "/users"], expected: null },
        ],
      },
    },
  ],
  revisionNotes: [
    "app.METHOD(path, handler): routes match in order",
    "req.params for :name segments, req.query for the query string, req.body after express.json()",
    "A handler must send a response; res.json, res.send, res.redirect and others end the cycle",
    "express.Router groups routes; app.use(prefix, router) mounts it",
  ],
  resources: [
    {
      label: "Express: Routing",
      url: "https://expressjs.com/en/guide/routing/",
    },
    {
      label: "Express: Basic routing",
      url: "https://expressjs.com/en/starter/basic-routing/",
    },
    {
      label: "Express: API reference",
      url: "https://expressjs.com/en/api/",
    },
  ],
})
