import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "http-methods-in-rest",
  title: "HTTP methods in a REST API",
  topic: "HTTP methods",
  minutes: 45,
  overview:
    "Use GET, POST, PUT, PATCH and DELETE correctly in an API: what each one promises about safety and idempotency, how PUT differs from PATCH, and which method a client may retry.",
  objectives: [
    "State the contract of each method",
    "Use PUT for replacement and PATCH for partial updates",
    "Show that PUT and DELETE are idempotent in effect",
    "Decide which requests are safe to retry",
  ],
  prerequisites: ["lesson.rest-apis.crud-design"],
  sections: [
    {
      kind: "explain",
      heading: "The contract of each method",
      body: [
        "`GET` reads and must not change state, so caches and crawlers can call it freely. `POST` processes a request, usually creating a resource; it is neither safe nor idempotent. `PUT` replaces the target resource with the representation in the request: all fields are sent. `PATCH` applies a partial change: only the fields to change are sent. `DELETE` removes the resource.",
        '`PUT` and `DELETE` are **idempotent**: sending the same request once or ten times leaves the server in the same state. Note that the *response* may differ (the second `DELETE` returns `404`), but the state does not. `PATCH` is not guaranteed to be idempotent: a patch such as `{"year": 1817}` is, while a patch saying "increase the stock by 1" is not.',
      ],
    },
    {
      kind: "code",
      heading: "PUT, PATCH and DELETE repeated",
      example: {
        title: "Idempotency in practice",
        language: "bash",
        code: 'curl -s -X PUT -H \'Content-Type: application/json\' -d \'{"title":"Emma","author":"Austen","year":1816}\' localhost:8000/v1/books/2\necho\ncurl -s -X PUT -H \'Content-Type: application/json\' -d \'{"title":"Emma","author":"Austen","year":1816}\' localhost:8000/v1/books/2\necho\ncurl -s -X PATCH -H \'Content-Type: application/json\' -d \'{"year":1900}\' localhost:8000/v1/books/2\necho\ncurl -s -o /dev/null -w "%{http_code}\\n" -X DELETE localhost:8000/v1/books/2\ncurl -s -o /dev/null -w "%{http_code}\\n" -X DELETE localhost:8000/v1/books/2\ncurl -s localhost:8000/v1/books?limit=1 -D - -o /dev/null | grep -i \'^x-total-count\' | tr -d \'\\r\'',
        walkthrough: [
          "Sending the same `PUT` twice gives identical results: the book is replaced with the same content. The state after two calls equals the state after one.",
          '`PATCH` with `{"year": 1900}` changes only the year; title and author are untouched.',
          "The first `DELETE` returns `204`. The second returns `404` because the book is already gone. The **state** is the same (the book does not exist) after one or many deletes, which is what idempotent means; the status code is allowed to differ.",
          "`X-Total-Count` is `4` at the end: five books minus the deleted one.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Choosing between PUT, PATCH and POST",
      diagram: {
        kind: "table",
        title: "Decision table",
        headers: ["You want to...", "Use"],
        rows: [
          [
            "Add a new item and let the server choose its id",
            "POST to the collection",
          ],
          ["Replace an item completely (a known id)", "PUT to the item"],
          ["Change a few fields", "PATCH to the item"],
          [
            "Run an action that is not CRUD, such as sending an email",
            "POST to an action resource, e.g. POST /orders/9/cancellation",
          ],
          ["Read", "GET"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Retries and safety",
      body: [
        "Networks fail: a client that gets a timeout does not know whether the server processed the request. It is **safe to retry** `GET`, `PUT` and `DELETE` (and `HEAD`, `OPTIONS`) because repeating them does not change the outcome. Retrying `POST` can create duplicates, unless you add an idempotency key (a later lesson).",
        "Servers should answer `405 Method Not Allowed` with an `Allow` header when a method is not supported for a URL, and `OPTIONS` can be used to discover the allowed methods. Browsers also send `OPTIONS` automatically as a *preflight* request for cross-origin calls (CORS).",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using POST for everything.",
          fix: "Use the method that matches the operation so that clients, caches and tools behave correctly.",
        },
        {
          mistake: "Using GET to change data.",
          fix: "GET must be safe. Use POST, PUT, PATCH or DELETE.",
        },
        {
          mistake: "Treating PUT as a partial update.",
          fix: "PUT replaces the whole resource; use PATCH for partial changes.",
        },
        {
          mistake: "Retrying POST requests blindly.",
          fix: "Use an idempotency key or check before retrying.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Updating a profile",
      scenario: "A mobile app lets users edit only their display name.",
      body: [
        '`PATCH /users/me` with `{"displayName": "Ana"}` changes just that field. If the app instead sent the whole profile with `PUT`, an older copy of the profile could overwrite changes made elsewhere, such as a new email address.',
        "If the connection drops, the app can safely repeat the same PATCH to the same value.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "put-vs-patch",
      prompt: "What is the difference between PUT and PATCH?",
      options: [
        "PUT sends the full replacement; PATCH sends only the changes",
        "PUT creates, PATCH deletes",
        "There is none",
      ],
      answer: 0,
      explanation: "PUT replaces the resource; PATCH is a partial update.",
    },
    {
      type: "single",
      id: "retry-safe",
      prompt: "Which request is safe to retry automatically after a timeout?",
      options: ["DELETE /books/3", "POST /orders", "POST /payments"],
      answer: 0,
      explanation:
        "DELETE is idempotent; blind POST retries may create duplicates.",
    },
    {
      type: "truefalse",
      id: "delete-twice",
      statement:
        "Because the second DELETE returns 404, DELETE is not idempotent.",
      answer: false,
      explanation:
        "Idempotency is about the server's state, which is the same after one or many deletes.",
    },
    {
      type: "blank",
      id: "allow-header",
      prompt:
        "A 405 response should include an ___ header listing the supported methods.",
      answer: "Allow",
      explanation: "The Allow header names the methods the resource supports.",
      accepted: ["allow"],
    },
  ],
  assignment: {
    title: "Method contract table",
    task: [
      "Create a table of all methods with safe, idempotent and retry-safe columns, with one sentence of evidence from the practice server for each (for example repeat a PUT twice and compare).",
      "Write a short rule for your team: when to use PATCH and when PUT.",
    ],
    checklist: [
      "Safe and idempotent are correct for each method",
      "Two idempotency experiments were run",
      "The retry rule is explained",
      "The PUT/PATCH rule is clear",
    ],
    hints: ["Compare responses and the X-Total-Count header."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "method-choice",
      title: "Choose the method",
      task: [
        "Write the method for: (1) rename a project; (2) replace a whole configuration document; (3) add a comment to a post; (4) remove a session; (5) check whether a URL exists without downloading it.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. PATCH\n2. PUT\n3. POST\n4. DELETE\n5. HEAD",
      hints: ["Partial change, full replace, create, remove, headers only."],
      checklist: [
        "PATCH for a partial change",
        "PUT for a full replacement",
        "POST for creating a comment",
        "DELETE for a session",
        "HEAD for a check",
      ],
    },
  ],
  revisionNotes: [
    "GET safe; PUT/DELETE idempotent; POST neither; PATCH not guaranteed idempotent",
    "PUT replaces all fields; PATCH sends only changes",
    "Idempotent = same server state after repeats; the response may differ",
    "Retry GET/PUT/DELETE; protect POST with an idempotency key",
  ],
  resources: [
    {
      label: "MDN: HTTP request methods",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods",
    },
    {
      label: "MDN: Idempotent",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent",
    },
    {
      label: "RFC 5789: PATCH method",
      url: "https://www.rfc-editor.org/rfc/rfc5789.html",
    },
    {
      label: "RFC 9110: HTTP semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    },
  ],
})
