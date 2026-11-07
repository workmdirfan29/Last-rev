import { defineLesson } from "@/data/lessons/author"

export default defineLesson("http", {
  slug: "headers",
  title: "HTTP headers",
  topic: "Headers",
  minutes: 45,
  overview:
    "Read and set the important request and response headers: Host, Accept, Content-Type, Content-Length, Authorization, User-Agent, Location and Allow.",
  objectives: [
    "Explain what headers are and how they are written",
    "Use Content-Type and Accept to describe formats",
    "Recognise authentication, redirect and informational headers",
    "Inspect headers with curl",
  ],
  prerequisites: ["lesson.http.methods"],
  sections: [
    {
      kind: "explain",
      heading: "Headers",
      body: [
        "A **header** is a name and a value written as `Name: value` on its own line. Names are case-insensitive. Headers carry metadata about the message, the sender or the content, so the body can stay about the data itself. They exist in both requests and responses.",
        "Many headers are standard. Custom headers are allowed; the old convention of an `X-` prefix is no longer recommended, so choose a clear name.",
      ],
    },
    {
      kind: "diagram",
      heading: "Headers you will meet often",
      diagram: {
        kind: "table",
        title: "Common headers",
        headers: ["Header", "Direction", "Meaning"],
        rows: [
          [
            "Host",
            "Request",
            "The host (and port) being requested; required in HTTP/1.1",
          ],
          [
            "Accept",
            "Request",
            "Formats the client can handle, e.g. application/json",
          ],
          [
            "Content-Type",
            "Both",
            "Media type of the body, e.g. application/json",
          ],
          ["Content-Length", "Both", "Size of the body in bytes"],
          ["Authorization", "Request", "Credentials, e.g. Bearer <token>"],
          ["User-Agent", "Request", "Name of the client software"],
          ["Location", "Response", "Where the new or moved resource is"],
          ["Allow", "Response", "Methods the resource supports"],
          [
            "WWW-Authenticate",
            "Response",
            "How to authenticate (sent with 401)",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "Reading headers",
      example: {
        title: "Inspect with curl",
        language: "bash",
        code: "curl -s -D - -o /dev/null localhost:8000/items | grep -iE '^(content-type|content-length)' | tr -d '\\r'\ncurl -s -D - -o /dev/null -X POST -d '{\"name\":\"book\"}' localhost:8000/items | grep -i '^location' | tr -d '\\r'\ncurl -s -D - -o /dev/null localhost:8000/secret | grep -i '^www-authenticate' | tr -d '\\r'\ncurl -s -H 'Accept: text/html' -H 'Authorization: Bearer abc' -o /dev/null -w \"%{http_code}\\n\" localhost:8000/items",
        walkthrough: [
          "`-D -` prints the response headers to standard output and `-o /dev/null` drops the body; `grep` keeps only the headers we care about. The list response has `Content-Type: application/json` and `Content-Length: 26`.",
          "A successful `POST` returns `Location: /items/2`, the address of the new item, so the client does not have to guess it.",
          'The `/secret` path answers `401` with `WWW-Authenticate: Basic realm="demo"`, telling the client which authentication scheme to use.',
          "`-H` adds **request** headers. This server ignores `Accept` and `Authorization` and answers `200`; a real API might return `406` for an unsupported `Accept` or `401` for a bad token.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Content negotiation and bodies",
      body: [
        "The client uses `Accept` to say what it can read; the server uses `Content-Type` to say what it sent. When a client sends a body (POST, PUT, PATCH), its own `Content-Type` tells the server how to parse it. A body without the correct `Content-Type` is a common reason for `400` and `415 Unsupported Media Type` errors.",
        "`Content-Length` tells the receiver where the body ends. Servers can also use chunked transfer encoding when the size is not known in advance. Never trust the headers of a request blindly: validate them like any other input.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Sending JSON without Content-Type: application/json.",
          fix: "The server may not parse it. Always set the type of the body you send.",
        },
        {
          mistake:
            "Putting secrets (tokens) in URLs instead of the Authorization header.",
          fix: "Headers are not stored in browser history or logged by default as URLs are.",
        },
        {
          mistake: "Treating header names as case-sensitive.",
          fix: "content-type and Content-Type are the same header.",
        },
        {
          mistake: "Inventing X- headers for everything.",
          fix: "Use standard headers when one exists; otherwise choose a clear, documented name.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Debugging an API call",
      scenario: "Your client sends JSON but the server answers 415.",
      body: [
        "Run the request with `curl -v` and check the request headers: if `Content-Type` is missing or `text/plain`, add `-H 'Content-Type: application/json'`. Then compare the response `Content-Type` with what your code expects.",
        "The browser's network tab shows the same headers for each request.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "content-type-role",
      prompt: "What does the Content-Type header describe?",
      options: [
        "The format of the message body",
        "The size of the body",
        "The client's browser",
      ],
      answer: 0,
      explanation: "Content-Type is the media type, such as application/json.",
    },
    {
      type: "single",
      id: "accept-role",
      prompt: "What does the Accept request header tell the server?",
      options: [
        "Which formats the client can handle",
        "Which cookies to send",
        "Which port to use",
      ],
      answer: 0,
      explanation: "Accept lists the media types the client prefers.",
    },
    {
      type: "truefalse",
      id: "header-case",
      statement: "HTTP header names are case-insensitive.",
      answer: true,
      explanation: "Content-Type and content-type are the same header.",
    },
    {
      type: "blank",
      id: "location-header",
      prompt:
        "After creating a resource, a server usually returns its address in the ___ header.",
      answer: "Location",
      explanation: "201 Created is normally accompanied by a Location header.",
      accepted: ["location"],
    },
  ],
  assignment: {
    title: "Header detective",
    task: [
      "Use curl -v on the practice server for GET and POST requests and list five request headers and five response headers you see, with a sentence for each.",
      "Send a POST with and without Content-Type and describe what changes in the headers you send.",
    ],
    checklist: [
      "Five request and five response headers are described",
      "Content-Type was set explicitly",
      "Location was found on a 201 response",
      "I know where to see headers in the browser",
    ],
    hints: ["curl -v shows request lines with > and response lines with <."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "header-commands",
      title: "Set headers",
      task: [
        'Write a curl command that sends a GET to http://localhost:8000/items asking for JSON and using the bearer token abc123, and a second that posts {"name":"cup"} as JSON.',
      ],
      language: "bash",
      starter: "# 1\n# 2",
      solution:
        "curl -H 'Accept: application/json' -H 'Authorization: Bearer abc123' http://localhost:8000/items\ncurl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"cup\"}' http://localhost:8000/items",
      hints: ["Each -H sets one header."],
      checklist: [
        "Accept and Authorization are set on the GET",
        "Content-Type is set on the POST",
      ],
    },
  ],
  revisionNotes: [
    "Header = Name: value; names are case-insensitive",
    "Request: Host, Accept, Authorization, User-Agent. Response: Location, Allow, WWW-Authenticate",
    "Content-Type describes the body; Accept states what the client can read",
    "Inspect with curl -v / -D - or the browser network tab",
  ],
  resources: [
    {
      label: "MDN: HTTP headers",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers",
    },
    {
      label: "MDN: HTTP messages",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages",
    },
    {
      label: "RFC 9110: HTTP semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    },
  ],
})
