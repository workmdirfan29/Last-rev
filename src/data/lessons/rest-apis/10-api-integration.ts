import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "api-integration",
  title: "Integrating with an API from client code",
  topic: "API integration",
  minutes: 45,
  overview:
    "Call a REST API from JavaScript with fetch: build a small client, handle errors and timeouts, walk through paginated results, retry safely with backoff and use idempotency keys for POST.",
  objectives: [
    "Write a fetch wrapper that parses JSON and turns errors into exceptions",
    "Set a timeout with AbortController",
    "Walk through all pages with a cursor",
    "Retry only safe or idempotent failures with exponential backoff",
  ],
  prerequisites: [
    "lesson.rest-apis.pagination",
    "lesson.rest-apis.idempotency",
  ],
  sections: [
    {
      kind: "explain",
      heading: "Calling an API well",
      body: [
        "Calling an API is more than `fetch(url)`. Real networks are slow and unreliable, and servers return errors. A good client sets a **timeout**, checks the **status** (`res.ok`), parses the body safely, turns failures into meaningful errors, sends the right headers and retries only when it is safe.",
        "Wrap all of this once, in a small function, instead of repeating it at every call. Keep secrets such as API tokens out of the code and out of the browser when possible; send them in the `Authorization` header over HTTPS.",
      ],
    },
    {
      kind: "code",
      heading: "A small client",
      example: {
        title:
          "fetch, timeout, errors, pagination, retry and idempotency (Node.js 18 or newer)",
        language: "javascript",
        code: 'const BASE = "http://localhost:8000"\n\nasync function request(path, { method = "GET", body, headers = {}, timeoutMs = 2000 } = {}) {\n  const controller = new AbortController()\n  const timer = setTimeout(() => controller.abort(), timeoutMs)\n  try {\n    const res = await fetch(BASE + path, {\n      method,\n      headers: {\n        Accept: "application/json",\n        ...(body ? { "Content-Type": "application/json" } : {}),\n        ...headers,\n      },\n      body: body ? JSON.stringify(body) : undefined,\n      signal: controller.signal,\n    })\n    const text = await res.text()\n    const data = text ? JSON.parse(text) : null\n    if (!res.ok) {\n      const err = new Error(data?.title ?? `HTTP ${res.status}`)\n      err.status = res.status\n      err.details = data?.errors\n      throw err\n    }\n    return data\n  } finally {\n    clearTimeout(timer)\n  }\n}\n\nasync function allBooks() {\n  const books = []\n  let after = 0\n  while (after !== null) {\n    const page = await request(`/v1/books?after=${after}&limit=2`)\n    books.push(...page.data)\n    after = page.next_cursor\n  }\n  return books\n}\n\nasync function withRetry(fn, attempts = 3, delayMs = 10) {\n  for (let i = 1; ; i++) {\n    try {\n      return await fn()\n    } catch (err) {\n      const retryable = err.status === undefined || err.status === 429 || err.status >= 500\n      if (!retryable || i === attempts) throw err\n      await new Promise((r) => setTimeout(r, delayMs * 2 ** (i - 1)))\n    }\n  }\n}\n\nconsole.log((await allBooks()).map((b) => b.title).join(", "))\n\ntry {\n  await request("/v1/books", { method: "POST", body: { title: "X", author: "Y", year: "no" } })\n} catch (err) {\n  console.log(err.status, err.message, JSON.stringify(err.details))\n}\n\nlet calls = 0\nconst flaky = async () => {\n  calls++\n  if (calls < 3) throw Object.assign(new Error("unavailable"), { status: 503 })\n  return "ok"\n}\nconsole.log(await withRetry(flaky), "after", calls, "calls")\n\nconst key = "order-77"\nconst create = () => request("/v1/books", { method: "POST", headers: { "Idempotency-Key": key }, body: { title: "N", author: "M", year: 2020 } })\nconst first = await create()\nconst second = await create()\nconsole.log(first.id === second.id, (await request("/v1/books?limit=1")).meta.total)\n\ntry {\n  await request("/v1/books/99")\n} catch (err) {\n  console.log(err.status, err.message)\n}',
        walkthrough: [
          "`request()` builds the headers, serialises a JSON body, uses an `AbortController` to cancel after `timeoutMs`, parses the response and throws an `Error` that carries `status` and `details` when `res.ok` is false. `finally` clears the timer.",
          "`allBooks()` follows the cursor: it asks for `after=0`, appends the page, and continues with `next_cursor` until it is `null`. It prints `Dune, Emma, Ulysses, Persuasion, Dracula`.",
          'A bad POST body gives the practice API\'s `422`, and the code prints `422 Validation failed [{"field":"year","message":"must be an integer"}]`.',
          "`withRetry()` retries only when there was no HTTP status (a network error or timeout), or when the status is `429` or `5xx`. It waits `delayMs * 2 ** (attempt - 1)` between attempts (**exponential backoff**). The flaky function fails twice and succeeds on the third call: `ok after 3 calls`.",
          "The POST sends the same `Idempotency-Key` twice. Both calls return the same book id and only one book is created, so the next line prints `true 6`.",
          "A `404` is not retried because retrying cannot fix a missing resource: `404 Book not found`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "What to retry",
      diagram: {
        kind: "table",
        title: "Retry rules",
        headers: ["Failure", "Retry?"],
        rows: [
          [
            "Network error or timeout",
            "Yes for GET, PUT, DELETE; for POST only with an idempotency key",
          ],
          ["429 Too Many Requests", "Yes, after Retry-After, with backoff"],
          ["500, 502, 503, 504", "Yes, a limited number of times"],
          ["400, 401, 403, 404, 422", "No: fix the request or the credentials"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Good habits",
      body: [
        "Limit retries (for example three) and add a little random **jitter** so many clients do not retry at the same instant. Respect the `Retry-After` header. Log the request id returned by the server so problems can be traced. Validate the response shape before using it, because the server may change. Keep timeouts short enough for the user experience, and show a clear message when the call fails.",
        "In a browser, calls to another origin need the server to allow it with CORS headers. Never put a secret API key in client-side code that users can read.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Not checking res.ok and parsing an error page as data.",
          fix: "Check the status and throw a meaningful error.",
        },
        {
          mistake: "No timeout, so a slow server freezes the UI.",
          fix: "Use AbortController with a timeout.",
        },
        {
          mistake: "Retrying every error immediately in a loop.",
          fix: "Retry only retryable failures, with backoff, jitter and a limit.",
        },
        {
          mistake: "Retrying POST without an idempotency key.",
          fix: "Add the key or do not retry.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A dashboard that loads orders",
      scenario:
        "A web dashboard loads a customer's orders from a paginated API and must survive short outages.",
      body: [
        "The loader calls `request()` with a three-second timeout, walks all pages using the cursor, retries `503` and network errors up to three times with backoff, shows a message for `401` (log in again) and shows partial results with a warning if a later page fails.",
        "Creating an order uses an `Idempotency-Key`, so the retry after a timeout never creates two orders.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "retry-404",
      prompt: "Should a client retry a 404 response?",
      options: [
        "No, retrying will not fix a missing resource",
        "Yes, up to ten times",
        "Yes, but only on weekends",
      ],
      answer: 0,
      explanation:
        "404 is a client-side problem; retry only 429, 5xx and network failures.",
    },
    {
      type: "single",
      id: "abort-controller",
      prompt: "Which browser and Node.js API cancels a fetch after a timeout?",
      options: ["AbortController", "setInterval", "FormData"],
      answer: 0,
      explanation: "AbortController's signal aborts the request.",
    },
    {
      type: "truefalse",
      id: "backoff",
      statement: "Exponential backoff waits longer after each failed attempt.",
      answer: true,
      explanation:
        "For example 10 ms, 20 ms, 40 ms, which reduces load on a struggling server.",
    },
    {
      type: "blank",
      id: "res-ok",
      prompt:
        "To detect an HTTP error status in fetch, check the response property res.___.",
      answer: "ok",
      explanation:
        "`res.ok` is true for statuses 200 to 299; fetch does not reject on 404 or 500.",
    },
  ],
  assignment: {
    title: "Build a client",
    task: [
      "Write a small client for the practice API with request(), a paginated allBooks() and a createBook() that sends an idempotency key. Include a timeout and meaningful errors.",
      "Add retry with backoff and show it working against a flaky function you write yourself.",
    ],
    checklist: [
      "Errors carry the status and details",
      "A timeout is enforced",
      "Pagination ends when the cursor is null",
      "Only retryable failures are retried",
    ],
    hints: [
      "Run the practice server on port 8000 and use Node.js 18 or newer.",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "retry-wrapper",
      title: "Write withRetry",
      task: [
        "Write an async function withRetry(fn, attempts) that calls fn and, when it throws, tries again up to attempts times in total, then throws the last error. (Keep it simple: no delay.)",
      ],
      language: "javascript",
      starter: "async function withRetry(fn, attempts) {\n}",
      solution:
        "async function withRetry(fn, attempts) {\n  let lastError\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn()\n    } catch (err) {\n      lastError = err\n    }\n  }\n  throw lastError\n}",
      hints: ["Remember the last error and throw it after the loop."],
      checklist: [
        "fn is called at most attempts times",
        "A success returns its value",
        "The last error is thrown if all attempts fail",
      ],
    },
  ],
  revisionNotes: [
    "Wrap fetch: timeout, res.ok, JSON parse, errors with status and details",
    "Follow next_cursor until null",
    "Retry only network errors, 429 and 5xx, with backoff, jitter and a limit",
    "POST retries need an Idempotency-Key",
  ],
  resources: [
    {
      label: "MDN: Using the Fetch API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
    },
    {
      label: "MDN: AbortController",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
    },
    {
      label: "MDN: Retry-After header",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After",
    },
    {
      label: "Postman: Request basics",
      url: "https://learning.postman.com/docs/sending-requests/create-requests/request-basics/",
    },
  ],
})
