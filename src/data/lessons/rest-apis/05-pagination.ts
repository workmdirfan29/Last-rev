import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "pagination",
  title: "Pagination",
  topic: "Pagination",
  minutes: 40,
  overview:
    "Return large collections in pages: offset (page and limit) pagination with metadata and Link headers, cursor pagination, limits and the trade-offs of each.",
  objectives: [
    "Implement page and limit with total counts",
    "Use Link headers with rel next and prev",
    "Explain cursor pagination and when it is better",
    "Set sensible defaults and maximum page sizes",
  ],
  prerequisites: ["lesson.rest-apis.status-codes"],
  sections: [
    {
      kind: "explain",
      heading: "Why paginate",
      body: [
        "A collection can have millions of items. Returning all of them is slow, expensive and may crash the client. **Pagination** returns a slice at a time and tells the client how to ask for the next one. Always set a default page size and a maximum, so that no request can ask for everything.",
        "**Offset pagination** uses `page` (or `offset`) and `limit`: simple, supports jumping to any page, and shows totals. The drawbacks: deep pages are slower for databases, and if items are added or removed while a client reads, items can be skipped or repeated. **Cursor pagination** uses a marker (the last id seen): `after=4`. It stays fast and stable on large, changing data, but clients can only move forward or backward, not jump.",
      ],
    },
    {
      kind: "code",
      heading: "Offset pagination",
      example: {
        title: "page, limit, metadata and Link headers",
        language: "bash",
        code: "curl -s 'localhost:8000/v1/books?limit=2'\necho\ncurl -s -D - -o /dev/null 'localhost:8000/v1/books?limit=2&page=2' | grep -iE '^(x-total-count|link)' | tr -d '\\r'\ncurl -s 'localhost:8000/v1/books?limit=2&page=3'\necho",
        walkthrough: [
          "The response has a `data` array and a `meta` object with `page`, `limit`, `total` and `pages`: 5 books at 2 per page make 3 pages.",
          'The `Link` header (RFC 8288) tells the client where to go next: `rel="next"` points to page 3 and `rel="prev"` to page 1. The first entry, `rel="successor-version"`, is the version link from the previous lesson. `X-Total-Count` repeats the total.',
          "The last page has fewer items: page 3 holds only book 5.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Cursor pagination",
      example: {
        title: "after and next_cursor",
        language: "bash",
        code: "curl -s 'localhost:8000/v1/books?after=0&limit=2'\necho\ncurl -s 'localhost:8000/v1/books?after=2&limit=2'\necho\ncurl -s 'localhost:8000/v1/books?after=4&limit=2'\necho",
        walkthrough: [
          "`after=0&limit=2` returns books with an id greater than 0, the first two, and `next_cursor` is `2`, the id of the last item returned.",
          "The client passes `after=2` for the next page and gets books 3 and 4, with `next_cursor` `4`.",
          "With `after=4` only book 5 remains, so there is no next page and `next_cursor` is `null`. The client stops when the cursor is `null`.",
          'Because each request says "after this id", new items inserted earlier in the list do not shift the following pages.',
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Offset or cursor?",
      diagram: {
        kind: "table",
        title: "Trade-offs",
        headers: ["", "Offset (page/limit)", "Cursor (after)"],
        rows: [
          ["Jump to page N", "Yes", "No"],
          ["Total count", "Easy", "Usually omitted (costly)"],
          ["Deep pages on big tables", "Slower", "Fast"],
          ["Data changing while reading", "May skip or repeat items", "Stable"],
          ["Best for", "Small or admin lists", "Feeds and large collections"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "No maximum page size.",
          fix: "Cap the limit (for example 50 or 100) so a client cannot request everything.",
        },
        {
          mistake: "Offset pagination on huge, fast-changing tables.",
          fix: "Use a cursor based on an indexed, ordered column.",
        },
        {
          mistake: "Pagination without a stable sort order.",
          fix: "Always sort by a deterministic key (id) so pages do not overlap.",
        },
        {
          mistake: "Forcing clients to build URLs themselves.",
          fix: "Provide next and prev links or a next cursor.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Loading a feed",
      scenario: "A mobile app shows a long list that users scroll.",
      body: [
        "Use cursor pagination: the first request is `GET /posts?limit=20`, the response contains `next_cursor`, and the app asks for `?after=<cursor>&limit=20` when the user nears the end. When `next_cursor` is `null`, the list ends.",
        "For an admin table with page numbers, offset pagination with a total is the better fit.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cursor-benefit",
      prompt: "What is an advantage of cursor pagination?",
      options: [
        "Stable and fast on large, changing collections",
        "Lets you jump to page 50 directly",
        "Always returns the total count",
      ],
      answer: 0,
      explanation:
        "A cursor says 'after this item', so inserts and deep pages do not disturb it.",
    },
    {
      type: "single",
      id: "pages-count",
      prompt: "5 items with limit=2 give how many pages?",
      options: ["3", "2", "5"],
      answer: 0,
      explanation: "ceil(5 / 2) = 3.",
    },
    {
      type: "truefalse",
      id: "max-limit",
      statement: "An API should enforce a maximum page size.",
      answer: true,
      explanation:
        "Without a limit a client can request the entire collection at once.",
    },
    {
      type: "blank",
      id: "link-rel",
      prompt: 'A Link header marks the following page with rel="___".',
      answer: "next",
      explanation: "Link relations next and prev point to neighbouring pages.",
      accepted: ["Next"],
    },
  ],
  assignment: {
    title: "Paginate a list",
    task: [
      "Walk through the whole book list with page and limit, recording each response's meta, then repeat with cursors until next_cursor is null.",
      "Explain with an example how inserting a new item while paging can skip or repeat an item with offset pagination but not with cursors.",
    ],
    checklist: [
      "Both pagination styles were used end to end",
      "Link headers and next_cursor were read",
      "The skip/repeat problem is explained",
      "A default and a maximum limit are proposed",
    ],
    hints: ["Use limit=2 to see several pages."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "page-math",
      title: "Page maths",
      task: [
        "A collection has 47 items and the page size is 10. How many pages are there, how many items are on the last page, and what are the page and limit values to request items 21 to 30?",
      ],
      language: "markdown",
      starter: "pages:\nlast page items:\nrequest:",
      solution: "pages: 5\nlast page items: 7\nrequest: page=3&limit=10",
      hints: ["Items 21 to 30 are the third page of ten."],
      checklist: [
        "5 pages",
        "7 items on the last page",
        "page 3 with limit 10",
      ],
    },
  ],
  revisionNotes: [
    "Always paginate with default and maximum limits",
    "Offset: page, limit, meta, Link headers; Cursor: after / next_cursor",
    "Offset can skip or repeat on changing data; cursors are stable",
    "Stable sort order; give next links or cursors",
  ],
  resources: [
    {
      label: "RFC 8288: Web linking",
      url: "https://www.rfc-editor.org/rfc/rfc8288.html",
    },
    {
      label: "MDN: Link header",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Link",
    },
    {
      label: "MDN: REST",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
    },
  ],
})
