import { defineLesson } from "@/data/lessons/author"

export default defineLesson("express", {
  slug: "project-structure",
  title: "Structuring an Express project",
  topic: "Project structure",
  minutes: 50,
  overview:
    "Organise an Express application so it is easy to read, test and grow: separate the app from the server, group routes, keep logic out of handlers and manage configuration.",
  objectives: [
    "Separate creating the app from starting the server",
    "Organise routes, controllers and services, and explain what each is for",
    "Keep configuration and secrets out of the code and handle a graceful shutdown",
  ],
  prerequisites: ["lesson.express.routing", "lesson.express.middleware"],
  sections: [
    {
      kind: "explain",
      heading: "Why structure matters",
      body: [
        "Express does not force a structure on you, which is flexible but easy to misuse. A single file with every route and every database call becomes hard to read and to test.",
        "The usual answer is to split responsibilities. **Routes** map paths to handlers. **Controllers** (the handlers) read the request and send the response. **Services** hold the business logic and know nothing about `req` and `res`. A data layer talks to the database.",
        "The Express application generator creates a skeleton project with folders for routes, views and static files, which is a useful starting point to read, although you will reshape it for your own project.",
      ],
    },
    {
      kind: "diagram",
      heading: "A common layout",
      diagram: {
        kind: "table",
        title: "Files and their jobs",
        headers: ["File or folder", "Job"],
        rows: [
          ["`server.js`", "Reads configuration, starts listening, handles shutdown"],
          ["`app.js`", "Creates the Express app and registers middleware and routers"],
          ["`routes/`", "One router per resource, mapping paths to controllers"],
          ["`controllers/`", "Read the request, call a service, send the response"],
          ["`services/`", "Business logic that is independent of Express"],
          ["`middleware/`", "Reusable middleware, such as authentication and error handling"],
          ["`config/`", "Settings loaded from the environment"],
        ],
      },
    },
    {
      kind: "code",
      heading: "App and server apart",
      example: {
        title: "Two small files",
        language: "javascript",
        code: "// app.js\nimport express from 'express';\nimport { router as books } from './routes/books.js';\nimport { errorHandler } from './middleware/error-handler.js';\n\nexport function createApp() {\n  const app = express();\n  app.use(express.json());\n  app.use('/books', books);\n  app.use(errorHandler);\n  return app;\n}\n\n// server.js\nimport { createApp } from './app.js';\n\nconst port = Number(process.env.PORT ?? 3000);\nconst server = createApp().listen(port, () => {\n  console.log(`listening on ${port}`);\n});\n\nprocess.on('SIGTERM', () => {\n  server.close(() => process.exit(0));\n});",
        walkthrough: [
          "`createApp` builds and returns the application without listening, so tests can use it without opening a port.",
          "`server.js` is the only file that listens, and it takes the port from the environment with a default.",
          "On `SIGTERM`, `server.close` stops accepting new connections and lets current requests finish before the process exits, which is a graceful shutdown.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Configuration and security",
      body: [
        "Read settings such as the port, database address and secrets from environment variables, and keep secrets out of the source code and version control.",
        "The Express security guidance includes using TLS, setting security-related HTTP headers with a middleware such as helmet, keeping dependencies updated and not leaking error details in production.",
        "For performance in production the Express documentation suggests, among other things, using gzip compression, avoiding synchronous functions and logging properly. Set `NODE_ENV` to `production`.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting business logic in the route handlers.",
          fix: "Move it to a service that takes plain arguments, so it can be tested without HTTP.",
        },
        {
          mistake: "Calling listen inside the file that defines the app.",
          fix: "Export the app and start it from a separate server file.",
        },
        {
          mistake: "Hard-coding secrets in source files.",
          fix: "Read them from environment variables.",
        },
        {
          mistake: "One enormous routes file.",
          fix: "One router per resource, mounted with app.use.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Making an app testable",
      scenario:
        "You want to test your endpoints without starting a real server on a fixed port.",
      body: [
        "Because `createApp()` returns an app without listening, a test can pass it to an HTTP testing tool that starts it on a temporary port.",
        "Keep services free of `req` and `res` as well, so most of your tests are plain function tests.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "services-know",
      prompt: "What should a service in this layout know about?",
      options: [
        "Business rules, not req and res",
        "The request and response objects",
        "Which port the server uses",
      ],
      answer: 0,
      explanation:
        "Services hold business logic and stay independent of Express, which makes them easy to test.",
    },
    {
      type: "truefalse",
      id: "secrets-in-code",
      statement: "Database passwords should be written directly in the source code for simplicity.",
      answer: false,
      explanation:
        "Secrets belong in environment variables or a secrets store, not in source code.",
    },
    {
      type: "single",
      id: "separate-listen",
      prompt: "Why separate the app file from the file that calls listen?",
      options: [
        "Tests can use the app without opening a port",
        "It makes the app faster",
        "Express requires it",
      ],
      answer: 0,
      explanation:
        "An exported app can be passed to test tools without a fixed port.",
    },
    {
      type: "blank",
      id: "shutdown-method",
      prompt: "On shutdown, call server.___() to stop accepting new connections.",
      answer: "close",
      explanation:
        "`server.close()` stops accepting new connections and lets current ones finish.",
    },
  ],
  assignment: {
    title: "Restructure a one-file app",
    task: [
      "Take an Express app in a single file and split it into app.js, server.js, a router, a controller and a service.",
      "Move the port and any secrets into environment variables and add a graceful shutdown.",
    ],
    checklist: [
      "createApp is exported and does not listen",
      "Routes, controllers and services are in separate files",
      "Configuration comes from the environment",
      "SIGTERM closes the server",
    ],
    hints: ["Do it one resource at a time and re-run the app after each step."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "read-config",
      title: "Read configuration",
      task: [
        "Write `readConfig(env)` that takes an object of environment variables and returns `{ port, nodeEnv }`. The port is a number (default 3000 when PORT is missing). nodeEnv defaults to 'development'.",
      ],
      language: "javascript",
      starter: "function readConfig(env) {\n  // your code\n}",
      solution:
        "function readConfig(env) {\n  return {\n    port: Number(env.PORT ?? 3000),\n    nodeEnv: env.NODE_ENV ?? 'development',\n  };\n}",
      hints: ["Environment values are strings, so convert PORT to a number."],
      checklist: [
        "PORT becomes a number",
        "Defaults apply when values are missing",
        "No environment variable is read from the global",
      ],
      run: {
        entry: "readConfig",
        cases: [
          { name: "empty", args: [{}], expected: { port: 3000, nodeEnv: "development" } },
          { name: "port set", args: [{ PORT: "8080" }], expected: { port: 8080, nodeEnv: "development" } },
          { name: "production", args: [{ PORT: "80", NODE_ENV: "production" }], expected: { port: 80, nodeEnv: "production" } },
        ],
      },
    },
  ],
  revisionNotes: [
    "Separate createApp (build) from server.js (listen)",
    "Routes map paths, controllers handle HTTP, services hold logic",
    "Configuration and secrets come from the environment",
    "Close the server on SIGTERM for a graceful shutdown",
  ],
  resources: [
    {
      label: "Express: Application generator",
      url: "https://expressjs.com/en/starter/generator/",
    },
    {
      label: "Express: Production best practices: performance",
      url: "https://expressjs.com/en/advanced/best-practice-performance/",
    },
    {
      label: "Express: Production best practices: security",
      url: "https://expressjs.com/en/advanced/best-practice-security/",
    },
    {
      label: "Express: Health checks and graceful shutdown",
      url: "https://expressjs.com/en/advanced/healthcheck-graceful-shutdown/",
    },
  ],
})
