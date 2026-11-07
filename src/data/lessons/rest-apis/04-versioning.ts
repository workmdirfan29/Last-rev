import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "versioning",
  title: "API versioning",
  topic: "Versioning",
  minutes: 30,
  overview:
    "Evolve an API without breaking clients: what counts as a breaking change, URL, header and query versioning, and how to announce retirement with Sunset and successor links.",
  objectives: [
    "Tell breaking from non-breaking changes",
    "Compare URL, header and query-parameter versioning",
    "Introduce a new version and deprecate the old one",
    "Use the Sunset header and a successor-version link",
  ],
  prerequisites: ["lesson.rest-apis.status-codes"],
  sections: [
    {
      kind: "explain",
      heading: "Why version",
      body: [
        "Once clients use your API, changing it can break them. A **breaking change** forces clients to change their code: removing or renaming a field, changing a type, changing the meaning of a value or making an optional field required. **Non-breaking** changes are additive: a new optional field, a new endpoint, a new optional query parameter. Clients must be written to ignore fields they do not know.",
        "When you cannot avoid a breaking change, publish a **new version** and keep the old one running for a published period.",
      ],
    },
    {
      kind: "diagram",
      heading: "Versioning styles",
      diagram: {
        kind: "table",
        title: "Where the version lives",
        headers: ["Style", "Example", "Notes"],
        rows: [
          [
            "URL path",
            "/v2/books",
            "Most visible and easy to route, cache and test; the most common",
          ],
          [
            "Header",
            "Accept: application/vnd.myapi.v2+json",
            "Keeps URLs stable; harder to try in a browser",
          ],
          [
            "Query parameter",
            "/books?version=2",
            "Easy to add; easy to forget, can affect caching",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "v1 and v2 side by side",
      example: {
        title: "Renaming author to authors",
        language: "bash",
        code: "curl -s localhost:8000/v1/books/1 | python3 -c \"import sys, json; d = json.load(sys.stdin); d.pop('_links'); print(d)\"\ncurl -s localhost:8000/v2/books/1 | python3 -c \"import sys, json; d = json.load(sys.stdin); d.pop('_links'); print(d)\"\ncurl -s -D - -o /dev/null localhost:8000/v1/books/1 | grep -iE '^(sunset|link)' | tr -d '\\r'\ncurl -s -D - -o /dev/null localhost:8000/v2/books/1 | grep -ciE '^(sunset|link)'",
        walkthrough: [
          'Version 1 returns `"author": "Herbert"` (a single string). Version 2 returns `"authors": ["Herbert"]` (a list), a **breaking change**: old clients reading `author` would fail on v2, so both versions run side by side.',
          'The v1 response carries `Sunset: Wed, 31 Dec 2031 23:59:59 GMT` (RFC 8594), the date after which the old version will stop working, and a `Link` header with `rel="successor-version"` pointing to the replacement.',
          "The v2 response has neither header, so the count is `0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Managing the lifecycle",
      body: [
        "Announce a deprecation early, in the documentation and in the responses (the `Sunset` header and a link to the successor). Keep a changelog and measure which clients still call the old version before you retire it. Prefer small, additive changes so that new versions are rare; a version number such as `v2` is a major version, not a release counter. Do not copy the whole code base for each version: share the logic and map between representations.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Changing a field's type or name inside the same version.",
          fix: "That breaks clients. Create a new version or add a new field and keep the old one.",
        },
        {
          mistake: "Versioning every small change.",
          fix: "Additive changes do not need a new version.",
        },
        {
          mistake: "Removing an old version without notice.",
          fix: "Announce a date, send Sunset headers and monitor usage first.",
        },
        {
          mistake: "Making clients crash on unknown fields.",
          fix: "Write clients that ignore fields they do not use.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Retiring v1",
      scenario: "v1 has 40 client apps; v2 is ready.",
      body: [
        "Publish the migration guide, add `Sunset` and `Link: rel=successor-version` headers to every v1 response, log which clients still use v1 and contact their owners. After the announced date, return `410 Gone` or redirect with a clear message.",
        "Keep the date realistic and honour it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "breaking-change",
      prompt: "Which change is breaking for existing clients?",
      options: [
        "Renaming a response field",
        "Adding a new optional field",
        "Adding a new endpoint",
      ],
      answer: 0,
      explanation: "Clients that read the old name stop working.",
    },
    {
      type: "single",
      id: "sunset-header",
      prompt: "What does the Sunset header tell clients?",
      options: [
        "When the resource will stop being available",
        "Which version is newest",
        "The time zone of the server",
      ],
      answer: 0,
      explanation: "Sunset (RFC 8594) gives the retirement date.",
    },
    {
      type: "truefalse",
      id: "additive",
      statement:
        "Adding a new optional field to a response is normally a non-breaking change.",
      answer: true,
      explanation:
        "Clients should ignore unknown fields, so additive changes are safe.",
    },
    {
      type: "blank",
      id: "version-style",
      prompt:
        "Putting the version in the path, as in /v2/books, is called ___ versioning.",
      answer: "URL",
      explanation: "URL (or path) versioning is the most common style.",
      accepted: ["path", "uri", "URI", "url"],
    },
  ],
  assignment: {
    title: "Version plan",
    task: [
      "Pick an API you know and plan a v2: list three breaking changes, how v1 and v2 will run together and the dates for announcement and retirement.",
      "Show the headers (Sunset and Link) you would add to v1 responses.",
    ],
    checklist: [
      "Breaking and non-breaking changes are separated",
      "The versioning style is chosen with a reason",
      "A timeline is stated",
      "Sunset and successor headers are shown",
    ],
    hints: ["RFC 8594 describes Sunset."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "classify-changes",
      title: "Classify the change",
      task: [
        "Mark each change B (breaking) or N (non-breaking): (1) rename price to cost; (2) add an optional field description; (3) change id from number to string; (4) add GET /books/{id}/reviews; (5) make isbn required in POST.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. B\n2. N\n3. B\n4. N\n5. B",
      hints: ["Think of an old client."],
      checklist: [
        "Renames and type changes are breaking",
        "New optional fields and endpoints are not",
        "Making a field required is breaking",
      ],
    },
  ],
  revisionNotes: [
    "Breaking: remove/rename/retype/require; non-breaking: additive",
    "URL, header and query versioning; URL is most common",
    "Announce with Sunset and Link successor-version",
    "Keep old versions for a published period; measure usage",
  ],
  resources: [
    {
      label: "RFC 8594: The Sunset HTTP header field",
      url: "https://www.rfc-editor.org/rfc/rfc8594.html",
    },
    {
      label: "RFC 8288: Web linking",
      url: "https://www.rfc-editor.org/rfc/rfc8288.html",
    },
    {
      label: "MDN: HTTP headers",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers",
    },
  ],
})
