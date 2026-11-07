import { defineLesson } from "@/data/lessons/author"

export default defineLesson("express", {
  slug: "rest-api-development",
  title: "Building a REST API with Express",
  topic: "REST API development",
  minutes: 60,
  overview:
    "Put routing, middleware and error handling together to build a JSON REST API: resources, HTTP methods, status codes, validation, filtering and CORS.",
  objectives: [
    "Map CRUD operations to HTTP methods and routes for a resource",
    "Return suitable status codes and JSON bodies, including for errors",
    "Validate input, support query parameters and enable CORS deliberately",
  ],
  prerequisites: [
    "lesson.express.routing",
    "lesson.express.middleware",
    "lesson.express.error-handling",
  ],
  sections: [
    {
      kind: "explain",
      heading: "Resources and methods",
      body: [
        "A REST API models things as **resources** with URLs, such as `/books` for the collection and `/books/42` for one book. HTTP methods say what to do: `GET` reads, `POST` creates, `PUT` or `PATCH` updates and `DELETE` removes.",
        "Use nouns in URLs, not verbs, and let the method carry the action: `POST /books` rather than `/createBook`.",
        "Respond with JSON and a status code that tells the client what happened: `200` for success, `201` for a created resource, `204` for success with no body, `400` for invalid input, `404` when nothing is found and `500` for a server failure.",
      ],
    },
    {
      kind: "code",
      heading: "A complete resource",
      example: {
        title: "CRUD for books in memory",
        language: "javascript",
        code: "import express from 'express';\n\nconst app = express();\napp.use(express.json());\n\nlet nextId = 1;\nconst books = [];\n\napp.get('/books', (req, res) => {\n  const { author } = req.query;\n  res.json(author ? books.filter((b) => b.author === author) : books);\n});\n\napp.get('/books/:id', (req, res) => {\n  const book = books.find((b) => b.id === Number(req.params.id));\n  if (!book) return res.status(404).json({ error: 'Book not found' });\n  res.json(book);\n});\n\napp.post('/books', (req, res) => {\n  const { title, author } = req.body ?? {};\n  if (!title || !author) {\n    return res.status(400).json({ error: 'title and author are required' });\n  }\n  const book = { id: nextId++, title, author };\n  books.push(book);\n  res.status(201).location(`/books/${book.id}`).json(book);\n});\n\napp.delete('/books/:id', (req, res) => {\n  const i = books.findIndex((b) => b.id === Number(req.params.id));\n  if (i === -1) return res.status(404).json({ error: 'Book not found' });\n  books.splice(i, 1);\n  res.sendStatus(204);\n});",
        walkthrough: [
          "`GET /books` returns the collection and supports a filter from the query string, `?author=…`.",
          "`GET /books/:id` converts the parameter to a number and answers `404` with a JSON error when no book matches.",
          "`POST /books` validates the body, answers `400` for missing fields and `201` with the created resource and a `Location` header on success.",
          "`DELETE` answers `204` through `res.sendStatus(204)`, which sets the status and sends no body.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Validation, CORS and consistency",
      body: [
        "Never trust the request. Check that required fields are present and have the right type, reject invalid input with `400` and a clear message, and convert string parameters to the types you need.",
        "Browsers block a page from calling an API on another origin unless the API allows it with **CORS** headers. The `cors` middleware sets them. Allow only the origins you intend to, instead of every origin.",
        "Be consistent: the same JSON shape for errors, plural nouns for collections, the same style for query parameters such as filtering and sorting.",
        "Keep handlers thin. Read the request, call a service, send a response, and let the error handler deal with failures.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Returning 200 with an error message in the body.",
          fix: "Use the status code that matches the outcome, such as 400 or 404.",
        },
        {
          mistake: "Using verbs in URLs, such as /getBooks.",
          fix: "Use nouns for resources and let the HTTP method describe the action.",
        },
        {
          mistake: "Trusting req.body without validation.",
          fix: "Check required fields and types, and reject bad input with 400.",
        },
        {
          mistake: "Allowing every origin with CORS by habit.",
          fix: "List the origins that need access.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Updating a resource",
      scenario:
        "A client wants to change only the title of an existing book.",
      body: [
        "Use `PATCH /books/42` with a body such as `{ \"title\": \"New title\" }`. The handler finds the book, copies only the provided fields and answers `200` with the updated book, or `404` if there is none.",
        "Use `PUT` when the client sends a complete replacement of the resource.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "created-status",
      prompt: "Which status code fits a successful POST that creates a resource?",
      options: ["201", "200", "404"],
      answer: 0,
      explanation:
        "201 Created tells the client the resource was created.",
    },
    {
      type: "truefalse",
      id: "verbs-in-urls",
      statement: "In REST style, URLs should be nouns such as /books, and the HTTP method says what to do.",
      answer: true,
      explanation:
        "Resources are named with nouns, and the method carries the action.",
    },
    {
      type: "single",
      id: "invalid-input",
      prompt: "Which status code should a request with missing required fields receive?",
      options: ["400", "201", "500"],
      answer: 0,
      explanation:
        "400 means the request was invalid. 500 is for server failures.",
    },
    {
      type: "blank",
      id: "no-body",
      prompt: "A successful DELETE with no response body usually returns status ___.",
      answer: "204",
      explanation:
        "204 means success with no content.",
    },
  ],
  assignment: {
    title: "Tasks API",
    task: [
      "Build a REST API for tasks with list (with a ?done=true filter), get, create, update with PATCH and delete.",
      "Add validation, JSON error responses with the right status codes and the cors middleware for one allowed origin.",
    ],
    checklist: [
      "Each operation uses the proper method and status code",
      "Invalid input gets 400 with a clear message",
      "Missing tasks get 404",
      "Only one origin is allowed by CORS",
    ],
    hints: ["Test every status code path, including the error ones."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "validate-book",
      title: "Validate a request body",
      task: [
        "Write `validateBook(body)` that returns an array of error messages. The title and author must be non-empty strings. If both are valid, return an empty array. Use the messages 'title is required' and 'author is required'.",
      ],
      language: "javascript",
      starter: "function validateBook(body) {\n  // your code\n}",
      solution:
        "function validateBook(body) {\n  const errors = [];\n  const input = body ?? {};\n  if (typeof input.title !== 'string' || input.title.trim() === '') {\n    errors.push('title is required');\n  }\n  if (typeof input.author !== 'string' || input.author.trim() === '') {\n    errors.push('author is required');\n  }\n  return errors;\n}",
      hints: ["Check the type and trim before testing for an empty string."],
      checklist: [
        "A missing body gives both errors",
        "Blank strings are rejected",
        "Valid input gives an empty array",
      ],
      run: {
        entry: "validateBook",
        cases: [
          { name: "valid", args: [{ title: "Dune", author: "Herbert" }], expected: [] },
          { name: "missing author", args: [{ title: "Dune" }], expected: ["author is required"] },
          { name: "blank title", args: [{ title: "  ", author: "A" }], expected: ["title is required"] },
          { name: "no body", args: [null], expected: ["title is required", "author is required"] },
        ],
      },
    },
  ],
  revisionNotes: [
    "Resources are nouns; methods are actions: GET, POST, PUT/PATCH, DELETE",
    "200 OK, 201 Created, 204 No Content, 400 invalid input, 404 not found, 500 server error",
    "Validate input; return a consistent JSON error shape",
    "CORS: allow only the origins that need access",
  ],
  resources: [
    {
      label: "Express: Routing",
      url: "https://expressjs.com/en/guide/routing/",
    },
    {
      label: "Express: Error handling",
      url: "https://expressjs.com/en/guide/error-handling/",
    },
    {
      label: "Express: cors middleware",
      url: "https://expressjs.com/en/resources/middleware/cors/",
    },
    {
      label: "Express: API reference",
      url: "https://expressjs.com/en/api/",
    },
  ],
})
