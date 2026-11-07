import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "status-codes",
  title: "Status codes and error responses",
  topic: "Status codes",
  minutes: 40,
  overview:
    "Pick accurate status codes for an API and return errors as consistent problem documents: validation errors, bad JSON, wrong media type and missing resources.",
  objectives: [
    "Choose success, client-error and server-error codes precisely",
    "Return errors in a consistent JSON format",
    "Use 400, 415, 422 and 404 correctly",
    "Avoid leaking internal details in errors",
  ],
  prerequisites: ["lesson.rest-apis.http-methods-in-rest"],
  sections: [
    {
      kind: "explain",
      heading: "Accurate codes",
      body: [
        "A client reads the **status code** first and the body second, so the code must be accurate. Use `200` for a successful read or update, `201` for a created resource, `204` when there is nothing to return, `400` for a malformed request, `401` for missing or invalid credentials, `403` when the caller is not allowed, `404` for an unknown resource, `409` for a conflict with the current state, `415` for an unsupported media type, `422` for a well-formed request with invalid content, `429` when a rate limit is exceeded and `500` for an unexpected server failure.",
        'Do not return `200` with `{"success": false}`. Tools, caches, retry logic and monitoring all depend on the status code.',
      ],
    },
    {
      kind: "explain",
      heading: "A consistent error format",
      body: [
        "RFC 9457 defines **problem details** for HTTP APIs: a JSON document with media type `application/problem+json` and members such as `type` (a URI that identifies the kind of problem), `title` (a short summary), `status`, `detail` and any extra members your API needs, for example a list of field `errors`. Using one format everywhere lets clients write a single error handler.",
        "Error messages must help the caller fix the request without exposing stack traces, SQL or file paths.",
      ],
    },
    {
      kind: "code",
      heading: "Errors from the practice API",
      example: {
        title: "Validation, media type and missing resource",
        language: "bash",
        code: "curl -s -w ' [%{http_code}]\\n' -X POST -H 'Content-Type: application/json' -d '{\"title\":\"X\",\"author\":\"Y\",\"year\":\"no\"}' localhost:8000/v1/books\ncurl -s -w ' [%{http_code}]\\n' -X POST -H 'Content-Type: application/json' -d '{bad json' localhost:8000/v1/books\ncurl -s -w ' [%{http_code}]\\n' -X POST -H 'Content-Type: text/plain' -d 'hello' localhost:8000/v1/books\ncurl -s -w ' [%{http_code}]\\n' localhost:8000/v1/books/99\ncurl -s -D - -o /dev/null localhost:8000/v1/books/99 | grep -i '^content-type' | tr -d '\\r'",
        walkthrough: [
          'A body with `"year": "no"` is valid JSON but invalid content: the API returns **`422`** with an `errors` list naming the field and the problem.',
          "A body that is not valid JSON cannot be parsed at all: **`400`** `Malformed JSON`.",
          "Sending `text/plain` to an endpoint that only accepts JSON gives **`415`** `Content-Type must be application/json`.",
          "An unknown book gives **`404`** with a problem document, and the response header is `Content-Type: application/problem+json`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Similar codes compared",
      diagram: {
        kind: "table",
        title: "Which one?",
        headers: ["Situation", "Code"],
        rows: [
          ["Body is not valid JSON", "400"],
          [
            "Valid JSON but a field fails validation",
            "422 (some APIs use 400)",
          ],
          ["No token or an invalid token", "401"],
          ["Valid token, not allowed to do this", "403"],
          ["Create a book whose unique ISBN already exists", "409"],
          ["Too many requests per minute", "429 (with Retry-After)"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Returning 200 with an error body.",
          fix: "Return the matching 4xx or 5xx status.",
        },
        {
          mistake: "Using 500 for validation problems.",
          fix: "Those are client errors: 400 or 422.",
        },
        {
          mistake: "Different error shapes in different endpoints.",
          fix: "Use one problem-details format everywhere.",
        },
        {
          mistake: "Leaking stack traces or SQL in error responses.",
          fix: "Log the details on the server and return a short, safe message.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A signup endpoint",
      scenario: "POST /users must reject duplicates and bad input.",
      body: [
        "Malformed JSON returns `400`. A missing or malformed email returns `422` with a list of field errors. An email that already exists returns `409`. Success returns `201` with `Location: /users/42`. An unexpected database failure returns `500` with a generic message while the details go to the logs.",
        "Document each response in the API description so client developers can handle them.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "422-meaning",
      prompt: "When is 422 the best code?",
      options: [
        "The JSON is well-formed but its content is invalid",
        "The JSON cannot be parsed",
        "The user is not logged in",
      ],
      answer: 0,
      explanation:
        "400 is for malformed requests; 422 for semantic validation errors.",
    },
    {
      type: "single",
      id: "415-meaning",
      prompt:
        "Which code means the request body has an unsupported Content-Type?",
      options: ["415", "406", "405"],
      answer: 0,
      explanation: "415 Unsupported Media Type.",
    },
    {
      type: "truefalse",
      id: "200-error",
      statement: 'Returning 200 with {"success": false} is good practice.',
      answer: false,
      explanation:
        "Use a 4xx or 5xx status so clients and tools can detect failures.",
    },
    {
      type: "blank",
      id: "problem-type",
      prompt:
        "RFC 9457 error documents use the media type application/___+json.",
      answer: "problem",
      explanation: "Problem details use application/problem+json.",
    },
  ],
  assignment: {
    title: "Error contract",
    task: [
      "For three endpoints of your own API, list every error response with status, title and an example body in problem-details format.",
      "Trigger four different error codes on the practice server and compare their bodies.",
    ],
    checklist: [
      "Each endpoint lists its success and error codes",
      "Errors use one JSON format",
      "Validation errors name the failing fields",
      "No internal details are exposed",
    ],
    hints: ["Content-Type: application/problem+json"],
    minutes: 15,
  },
  exercises: [
    {
      slug: "error-codes",
      title: "Pick the error code",
      task: [
        "Write the status code for: (1) invalid JSON body; (2) year is a string; (3) no Authorization header; (4) valid token but the user is not an admin; (5) the ISBN is already registered.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. 400\n2. 422\n3. 401\n4. 403\n5. 409",
      hints: ["Authentication versus authorisation."],
      checklist: [
        "400 for unparseable JSON",
        "422 for invalid content",
        "401 for missing credentials",
        "403 for insufficient rights",
        "409 for a conflict",
      ],
    },
  ],
  revisionNotes: [
    "Accurate 2xx/4xx/5xx codes; never 200 for errors",
    "400 malformed, 422 invalid content, 415 media type, 404 missing, 409 conflict, 429 rate limit",
    "RFC 9457 problem details: application/problem+json",
    "No stack traces or internals in responses",
  ],
  resources: [
    {
      label: "RFC 9457: Problem details for HTTP APIs",
      url: "https://www.rfc-editor.org/rfc/rfc9457.html",
    },
    {
      label: "MDN: HTTP response status codes",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status",
    },
    {
      label: "RFC 9110: HTTP semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    },
  ],
})
