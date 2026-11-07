import { defineLesson } from "@/data/lessons/author"

export default defineLesson("http", {
  slug: "cookies-and-caching",
  title: "Cookies and caching headers",
  topic: "Cookies & caching headers",
  minutes: 45,
  overview:
    "Keep state with cookies (Set-Cookie and Cookie, with Secure, HttpOnly and SameSite) and control reuse of responses with Cache-Control, ETag and conditional requests.",
  objectives: [
    "Explain how Set-Cookie and Cookie work together",
    "Choose cookie attributes for a session cookie",
    "Use Cache-Control directives such as max-age, no-cache and no-store",
    "Explain ETag, If-None-Match and 304 Not Modified",
  ],
  prerequisites: ["lesson.http.status-codes"],
  sections: [
    {
      kind: "explain",
      heading: "Cookies",
      body: [
        "HTTP is **stateless**: each request stands on its own. A **cookie** lets a server remember a client. The server sends `Set-Cookie: name=value; attributes` in a response; the browser stores it and sends `Cookie: name=value` with later requests to the same site. Cookies are used for sessions (staying logged in), preferences and tracking.",
        "Important attributes: `Max-Age` or `Expires` (lifetime; without them it is a *session cookie* that disappears when the browser closes), `Path` and `Domain` (where it is sent), `Secure` (only over HTTPS), `HttpOnly` (not readable from JavaScript, which limits theft through cross-site scripting) and `SameSite` (`Strict`, `Lax` or `None`, which controls sending on cross-site requests and helps against cross-site request forgery). `SameSite=None` requires `Secure`.",
      ],
    },
    {
      kind: "code",
      heading: "Set a cookie and send it back",
      example: {
        title: "curl with a cookie jar",
        language: "bash",
        code: "curl -s -D - -o /dev/null localhost:8000/cookie | grep -i '^set-cookie' | tr -d '\\r'\ncurl -s -c jar.txt -o /dev/null localhost:8000/cookie\ncurl -s -b jar.txt localhost:8000/whoami\necho\ncurl -s localhost:8000/whoami\necho",
        walkthrough: [
          "The `/cookie` path answers with `Set-Cookie: sid=abc123; Path=/; HttpOnly; SameSite=Lax`: a session identifier that scripts cannot read and that is not sent on most cross-site requests.",
          "`-c jar.txt` makes curl save received cookies in a file, like a browser's cookie store.",
          '`-b jar.txt` sends the stored cookies: the server\'s `/whoami` path echoes the `Cookie` header, so the answer is `{"cookie": "sid=abc123"}`.',
          'Without the jar, no cookie is sent and the answer is `{"cookie": null}`.',
        ],
      },
    },
    {
      kind: "explain",
      heading: "Caching",
      body: [
        "A **cache** keeps a copy of a response so the next request can be answered without contacting the server (or with a quick check). `Cache-Control` in the response says how. `max-age=60` means the copy is **fresh** for 60 seconds. `no-store` means do not store it at all (use it for sensitive data). `no-cache` is often misunderstood: the response may be stored, but it must be **revalidated** with the server before each reuse. `private` allows only the browser to cache it; `public` allows shared caches, too.",
        "When a copy is stale, the cache can ask the server whether it is still valid. The server gives each version an **`ETag`** (a validator). The client sends it back as `If-None-Match`. If nothing changed, the server answers **`304 Not Modified`** with no body and the client reuses its copy; this saves bandwidth. `Last-Modified` with `If-Modified-Since` does the same with dates.",
      ],
    },
    {
      kind: "code",
      heading: "ETag and conditional requests",
      example: {
        title: "Revalidation",
        language: "bash",
        code: "curl -s -D - -o /dev/null localhost:8000/cached | grep -iE '^(http|etag|cache-control)' | tr -d '\\r'\ncurl -s -D - -o /dev/null -H 'If-None-Match: \"v1\"' localhost:8000/cached | grep -iE '^(http|etag)' | tr -d '\\r'\ncurl -s -D - -o /dev/null localhost:8000/nocache | grep -i '^cache-control' | tr -d '\\r'",
        walkthrough: [
          'The first response is `200` with `ETag: "v1"` and `Cache-Control: max-age=60`, so a cache may reuse it for a minute.',
          'Sending `If-None-Match: "v1"` asks "has it changed?". The server answers `304 Not Modified` and repeats the ETag; no body is transferred.',
          "`/nocache` sends `Cache-Control: no-store`: caches must not keep it.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Directives",
      diagram: {
        kind: "table",
        title: "Cache-Control at a glance",
        headers: ["Directive", "Meaning"],
        rows: [
          ["max-age=N", "Fresh for N seconds"],
          ["no-cache", "May be stored, but revalidate before reuse"],
          ["no-store", "Do not store at all"],
          ["private / public", "Browser only / shared caches allowed"],
          ["must-revalidate", "Do not use a stale copy without checking"],
          ["immutable", "The content will never change (versioned files)"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Storing a session token in a cookie without HttpOnly and Secure.",
          fix: "Add HttpOnly, Secure and a suitable SameSite value.",
        },
        {
          mistake: "Thinking no-cache means do not cache.",
          fix: "no-store is the one that prevents storing.",
        },
        {
          mistake: "Caching personal data in shared caches.",
          fix: "Mark it private or no-store.",
        },
        {
          mistake: "Changing a file but keeping its cached URL.",
          fix: "Version the file name (app.3f2a.js) so clients fetch the new one.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Caching a static site",
      scenario:
        "Your site has versioned JavaScript files and an HTML page that changes often.",
      body: [
        "Serve `app.3f2a.js` with `Cache-Control: public, max-age=31536000, immutable` because its name changes when its content does. Serve the HTML page with `no-cache` and an `ETag` so browsers always check and usually get a cheap 304.",
        "Serve account pages with `private, no-store`.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "httponly",
      prompt: "What does the HttpOnly cookie attribute do?",
      options: [
        "Hides the cookie from JavaScript",
        "Limits it to HTTP, not HTTPS",
        "Deletes it after a day",
      ],
      answer: 0,
      explanation:
        "HttpOnly cookies cannot be read by scripts, reducing theft through XSS.",
    },
    {
      type: "single",
      id: "no-cache-meaning",
      prompt: "What does Cache-Control: no-cache mean?",
      options: [
        "The response may be stored but must be revalidated before reuse",
        "The response must never be stored",
        "The response is cached forever",
      ],
      answer: 0,
      explanation: "no-store is the directive that forbids storing.",
    },
    {
      type: "single",
      id: "etag-result",
      prompt:
        "What does the server send when If-None-Match matches the current ETag?",
      options: ["304 Not Modified", "200 OK with a new body", "404 Not Found"],
      answer: 0,
      explanation: "304 means the client's copy is still valid.",
    },
    {
      type: "truefalse",
      id: "session-cookie",
      statement:
        "A cookie without Expires or Max-Age is deleted when the browser session ends.",
      answer: true,
      explanation: "That is called a session cookie.",
    },
  ],
  assignment: {
    title: "Cookie and cache lab",
    task: [
      "With the practice server, capture the Set-Cookie header, send the cookie back with a jar and compare the results with and without it.",
      "Request /cached normally and with If-None-Match, record both status codes and explain why the second is smaller.",
    ],
    checklist: [
      "A cookie was stored and sent back",
      "Secure, HttpOnly and SameSite are each explained",
      "A 304 response was produced",
      "no-cache and no-store are told apart",
    ],
    hints: ["curl -c saves and -b sends cookies."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "cache-headers",
      title: "Choose headers",
      task: [
        "Write the Cache-Control value for (1) a versioned image that never changes, (2) a bank statement page, (3) a news page that browsers may reuse for 5 minutes. Then write a Set-Cookie header for a login session id abc that scripts cannot read and that is sent only over HTTPS.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.",
      solution:
        "1. Cache-Control: public, max-age=31536000, immutable\n2. Cache-Control: private, no-store\n3. Cache-Control: public, max-age=300\n4. Set-Cookie: sid=abc; Path=/; Secure; HttpOnly; SameSite=Lax",
      hints: ["300 seconds = 5 minutes."],
      checklist: [
        "The image is cached long and immutable",
        "The statement uses no-store",
        "The news page uses max-age=300",
        "The cookie has Secure and HttpOnly",
      ],
    },
  ],
  revisionNotes: [
    "Set-Cookie / Cookie keep state; attributes: Max-Age, Path, Domain, Secure, HttpOnly, SameSite",
    "Cache-Control: max-age, no-cache (revalidate), no-store (never keep), private/public",
    "ETag + If-None-Match -> 304 Not Modified",
    "Version static file names; never cache personal data publicly",
  ],
  resources: [
    {
      label: "MDN: Using HTTP cookies",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies",
    },
    {
      label: "MDN: HTTP caching",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching",
    },
    {
      label: "RFC 9111: HTTP caching",
      url: "https://www.rfc-editor.org/rfc/rfc9111.html",
    },
    {
      label: "RFC 6265: HTTP state management",
      url: "https://www.rfc-editor.org/rfc/rfc6265.html",
    },
  ],
})
