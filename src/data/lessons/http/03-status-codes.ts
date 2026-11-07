import { defineLesson } from "@/data/lessons/author"

export default defineLesson("http", {
  slug: "status-codes",
  title: "HTTP status codes",
  topic: "Status codes",
  minutes: 40,
  overview:
    "Read the five classes of status codes and know the common ones: 200, 201, 204, 301, 304, 400, 401, 403, 404, 500 and others, and how redirects work.",
  objectives: [
    "Name the five status code classes",
    "Choose the right code for a given outcome",
    "Tell 401 from 403 and 301 from 304",
    "Follow a redirect with curl",
  ],
  prerequisites: ["lesson.http.methods"],
  sections: [
    {
      kind: "explain",
      heading: "Status codes",
      body: [
        "Every response starts with a three-digit **status code** that tells the client what happened. The first digit gives the class: **1xx** informational, **2xx** success, **3xx** redirection, **4xx** client error (the request is wrong) and **5xx** server error (the server failed to handle a valid request). The text after the code (the reason phrase) is only for humans.",
        "Pick the most specific code: the client uses it to decide whether to retry, to fix the request, or to show an error.",
      ],
    },
    {
      kind: "diagram",
      heading: "Codes to know",
      diagram: {
        kind: "table",
        title: "Common status codes",
        headers: ["Code", "Name", "Use"],
        rows: [
          ["200", "OK", "Success with a body"],
          ["201", "Created", "A resource was created (send Location)"],
          [
            "204",
            "No Content",
            "Success, nothing to return (e.g. after DELETE)",
          ],
          [
            "301",
            "Moved Permanently",
            "The resource has a new permanent address",
          ],
          ["304", "Not Modified", "The cached copy is still valid"],
          ["400", "Bad Request", "The request is malformed or invalid"],
          [
            "401",
            "Unauthorized",
            "Missing or invalid credentials (authentication)",
          ],
          ["403", "Forbidden", "Authenticated but not allowed (authorisation)"],
          ["404", "Not Found", "No such resource"],
          ["409", "Conflict", "The request conflicts with the current state"],
          ["429", "Too Many Requests", "Rate limit exceeded"],
          ["500", "Internal Server Error", "Unexpected failure on the server"],
          [
            "503",
            "Service Unavailable",
            "Temporarily unable to handle the request",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "Seeing codes and redirects",
      example: {
        title: "curl and status codes",
        language: "bash",
        code: 'curl -s -o /dev/null -w "%{http_code}\\n" localhost:8000/items\ncurl -s -o /dev/null -w "%{http_code}\\n" localhost:8000/missing\ncurl -s -o /dev/null -w "%{http_code}\\n" localhost:8000/secret\ncurl -s -o /dev/null -w "%{http_code}\\n" localhost:8000/admin\ncurl -s -o /dev/null -w "%{http_code}\\n" localhost:8000/boom\ncurl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" localhost:8000/old\ncurl -s -L -o /dev/null -w "%{http_code} %{url_effective}\\n" localhost:8000/old',
        walkthrough: [
          '`-w "%{http_code}"` prints only the status: `200` for the list, `404` for an unknown path, `401` for `/secret` (no credentials), `403` for `/admin` (not allowed) and `500` for `/boom` (a failure on the server).',
          "`/old` answers `301` with a `Location` header. Without `-L`, curl shows the redirect (`301 http://localhost:8000/items`).",
          "With `-L` curl follows the `Location` header and ends on `/items` with `200`. Browsers follow redirects automatically.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Choosing between similar codes",
      body: [
        "**401 vs 403**: 401 means the server does not know who you are (send credentials); 403 means it knows who you are and still refuses. **404 vs 410**: 404 says there is no such resource now; 410 says it existed and is gone for good. **400 vs 422**: 400 for malformed requests, 422 for well-formed requests with invalid content (used by many APIs).",
        "For redirects, `301` and `308` are permanent; `302` and `307` are temporary. `307` and `308` keep the original method and body, while historically `301` and `302` could change a POST into a GET. `304` is not a redirect to a new place but an answer to a conditional request.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Returning 200 with an error message in the body.",
          fix: "Use a 4xx or 5xx status so clients and tools can detect the failure.",
        },
        {
          mistake: "Using 500 for bad input.",
          fix: "That is a client mistake: use 400 or 422.",
        },
        {
          mistake: "Confusing 401 and 403.",
          fix: "401 = who are you? 403 = you may not.",
        },
        {
          mistake: "Ignoring 429 and hammering the server.",
          fix: "Wait for the time given in Retry-After and use back-off.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Designing responses for a login endpoint",
      scenario: "You write POST /login and must pick status codes.",
      body: [
        "A successful login returns `200` (or `201` if it creates a session resource). Wrong password returns `401` with a short error message. An account that is locked returns `403`. Too many attempts returns `429`. An unexpected database failure returns `500` and is logged, but the response does not reveal internals.",
        "Document each status code in the API description so clients can handle them.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "auth-vs-forbidden",
      prompt:
        "A logged-in user requests a page they have no rights to. Which code fits?",
      options: ["403", "401", "404"],
      answer: 0,
      explanation: "403: the server knows who you are and refuses.",
    },
    {
      type: "single",
      id: "class-5xx",
      prompt: "What does a 5xx status code mean?",
      options: [
        "The server failed to handle a valid request",
        "The client sent a bad request",
        "The request was redirected",
      ],
      answer: 0,
      explanation: "5xx are server errors.",
    },
    {
      type: "truefalse",
      id: "204-body",
      statement: "A 204 No Content response has no body.",
      answer: true,
      explanation: "204 means success with nothing to return.",
    },
    {
      type: "blank",
      id: "created-code",
      prompt: "A successful creation returns status ___ Created.",
      answer: "201",
      explanation:
        "201 Created is returned after a successful POST that creates a resource.",
    },
  ],
  assignment: {
    title: "Status code map",
    task: [
      "For a library API with books and members, list ten situations (successful read, create, delete, missing book, wrong token, no permission, invalid JSON, duplicate ISBN, rate limit, database down) and give the most suitable status code for each.",
      "Use the practice server to produce at least five different codes and note the output.",
    ],
    checklist: [
      "Each situation has a specific code",
      "401 and 403 are used correctly",
      "A redirect was followed with -L",
      "5xx is reserved for server-side failures",
    ],
    hints: ['curl -s -o /dev/null -w "%{http_code}" URL'],
    minutes: 15,
  },
  exercises: [
    {
      slug: "code-choices",
      title: "Pick the code",
      task: [
        "Write the status code for: (1) a book was created; (2) the request body is not valid JSON; (3) the token is missing; (4) the book does not exist; (5) the server crashed with an unexpected error.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. 201\n2. 400\n3. 401\n4. 404\n5. 500",
      hints: ["Missing credentials is 401."],
      checklist: [
        "201 for created",
        "400 for malformed JSON",
        "401 for a missing token",
        "404 for not found",
        "500 for an unexpected failure",
      ],
    },
  ],
  revisionNotes: [
    "1xx info, 2xx success, 3xx redirect, 4xx client error, 5xx server error",
    "200 OK, 201 Created (+Location), 204 No Content",
    "301/308 permanent, 302/307 temporary, 304 Not Modified",
    "401 unauthenticated, 403 forbidden, 404 not found, 429 rate limit, 500 server error",
  ],
  resources: [
    {
      label: "MDN: HTTP response status codes",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status",
    },
    {
      label: "MDN: Redirections in HTTP",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections",
    },
    {
      label: "RFC 9110: HTTP semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    },
  ],
})
