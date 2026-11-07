import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "idempotency",
  title: "Idempotency and safe retries",
  topic: "Idempotency",
  minutes: 40,
  overview:
    "Make unsafe requests safe to retry: which methods are idempotent, why POST is the problem, and how an Idempotency-Key header lets a server replay the original result instead of creating a duplicate.",
  objectives: [
    "Define idempotency for HTTP and APIs",
    "Explain how a timeout can cause duplicate POSTs",
    "Use an Idempotency-Key header and replay semantics",
    "Handle a reused key with a different payload",
  ],
  prerequisites: ["lesson.rest-apis.http-methods-in-rest"],
  sections: [
    {
      kind: "explain",
      heading: "The duplicate problem",
      body: [
        "A client sends `POST /payments` and the connection times out. Did the server process it? The client cannot know. If it retries, the customer may be charged twice; if it does not, the payment may be lost. `GET`, `PUT` and `DELETE` are idempotent by definition, so retrying them is safe, but `POST` is not.",
        "The usual solution is an **idempotency key**: a unique value that the client generates (for example a UUID) for each logical operation and sends in an `Idempotency-Key` header. The server stores the first result under that key. A later request with the same key does **not** repeat the work; the server returns the stored response. This pattern is described in an IETF draft and is widely used by payment APIs.",
      ],
    },
    {
      kind: "code",
      heading: "POST with and without a key",
      example: {
        title: "Duplicates versus replays",
        language: "bash",
        code: "post() { curl -s -D - -o /dev/null -X POST -H 'Content-Type: application/json' \"$@\" -d '{\"title\":\"A\",\"author\":\"B\",\"year\":2000}' localhost:8000/v1/books | grep -iE '^(HTTP|location|idempotency-replayed)' | tr -d '\\r'; }\npost\npost\necho --- with a key\npost -H 'Idempotency-Key: order-1'\npost -H 'Idempotency-Key: order-1'\ncurl -s -D - -o /dev/null 'localhost:8000/v1/books?limit=1' | grep -i '^x-total-count' | tr -d '\\r'\ncurl -s -w ' [%{http_code}]\\n' -X POST -H 'Content-Type: application/json' -H 'Idempotency-Key: order-1' -d '{\"title\":\"Other\",\"author\":\"B\",\"year\":2001}' localhost:8000/v1/books",
        walkthrough: [
          "Two `POST` requests without a key create two books: ids 6 and 7. This is the duplicate problem.",
          "With `Idempotency-Key: order-1`, the first request creates book 8. The second sends the same key and the same body, so the server replays the stored response: same status `201`, same `Location: /v1/books/8`, plus `Idempotency-Replayed: true`. No new book is created.",
          "The total is `8` books: the original five, the two duplicates and exactly one keyed book.",
          "Reusing the key with a **different** payload is a client bug, so the server refuses with `422`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Designing the server side",
      body: [
        "Store the key together with a fingerprint of the request and the response. Keys should expire after a while (for example 24 hours). Make the check-and-store step atomic so two concurrent requests with the same key cannot both run. Scope keys to the caller so that two customers cannot clash. Return the same status and body on replay, and an error if the same key arrives with a different payload.",
        "Idempotency is also a database concern: natural unique constraints (for example a unique order reference) stop duplicates even if the application logic fails.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Retrying POST requests without an idempotency key.",
          fix: "Generate one key per logical operation and send it on every retry.",
        },
        {
          mistake: "Generating a new key for each retry.",
          fix: "That defeats the purpose; reuse the same key for the same operation.",
        },
        {
          mistake: "Keeping keys forever.",
          fix: "Expire them after a defined time.",
        },
        {
          mistake: "Accepting the same key with different data silently.",
          fix: "Reject it with an error (422 in the draft).",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Retrying a payment",
      scenario: "A mobile app must submit a payment on a flaky network.",
      body: [
        "The app creates a UUID when the user taps 'Pay' and sends it as `Idempotency-Key`. If the request times out, the app retries with the same key. The server either completes the payment once or replays the earlier result, so the customer is never charged twice.",
        "If the user changes the amount and taps 'Pay' again, the app generates a new key because it is a new operation.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "idempotent-meaning",
      prompt: "What does it mean that an operation is idempotent?",
      options: [
        "Repeating it has the same effect on state as doing it once",
        "It always returns the same response body",
        "It is always fast",
      ],
      answer: 0,
      explanation:
        "The server state is the same after one or many identical requests.",
    },
    {
      type: "single",
      id: "key-reuse",
      prompt:
        "A client reuses an Idempotency-Key with the same body. What should the server do?",
      options: [
        "Return the stored response without repeating the work",
        "Create another resource",
        "Delete the first resource",
      ],
      answer: 0,
      explanation: "A replay returns the original result.",
    },
    {
      type: "truefalse",
      id: "new-key-retry",
      statement:
        "A client should create a new Idempotency-Key for every retry of the same payment.",
      answer: false,
      explanation: "Reuse the same key so the server can recognise the retry.",
    },
    {
      type: "blank",
      id: "idem-header",
      prompt: "The request header that carries the idempotency key is ___-Key.",
      answer: "Idempotency",
      explanation: "The header is called Idempotency-Key.",
      accepted: ["idempotency"],
    },
  ],
  assignment: {
    title: "Duplicate-proof checkout",
    task: [
      "Describe how you would add idempotency to POST /orders: key format, storage, expiry, concurrency and the responses for replay and for key reuse with a different body.",
      "Reproduce the duplicate problem and its fix on the practice server and report the totals.",
    ],
    checklist: [
      "The duplicate scenario is described",
      "Replay and conflict responses are specified",
      "Key expiry and scoping are mentioned",
      "The practice server demo shows one created resource",
    ],
    hints: ["Compare X-Total-Count before and after."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "idem-methods",
      title: "Idempotent or not?",
      task: [
        "Mark each as I (idempotent) or N (not): (1) PUT /users/5; (2) POST /orders without a key; (3) DELETE /sessions/9; (4) POST /orders with the same Idempotency-Key; (5) PATCH balance increase by 10.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. I\n2. N\n3. I\n4. I\n5. N",
      hints: ["Think about repeating the request."],
      checklist: [
        "PUT and DELETE are idempotent",
        "POST without a key is not",
        "A keyed POST is replayed",
        "An increment patch is not idempotent",
      ],
    },
  ],
  revisionNotes: [
    "Idempotent: same server state after repeats; GET/PUT/DELETE are, POST is not",
    "Timeouts cause uncertain outcomes and duplicate POSTs",
    "Idempotency-Key: store first result, replay on same key and body, reject different body",
    "Expire keys; atomic check; scope per caller; unique constraints as a backstop",
  ],
  resources: [
    {
      label: "MDN: Idempotency-Key",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Idempotency-Key",
    },
    {
      label: "IETF draft: The Idempotency-Key HTTP header field",
      url: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/",
    },
    {
      label: "MDN: Idempotent",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent",
    },
  ],
})
