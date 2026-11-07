import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "filtering-sorting",
  title: "Filtering and sorting collections",
  topic: "Filtering & sorting",
  minutes: 30,
  overview:
    "Let clients narrow and order a collection with query parameters: equality and range filters, sort with a minus for descending and several keys, validation of allowed fields, and combination with pagination.",
  objectives: [
    "Design filter parameters for a collection",
    "Design a sort parameter with ascending, descending and multiple keys",
    "Reject unknown sort fields with 400",
    "Combine filtering, sorting and pagination",
  ],
  prerequisites: ["lesson.rest-apis.pagination"],
  sections: [
    {
      kind: "explain",
      heading: "Query parameters for collections",
      body: [
        "Filtering and sorting belong in the **query string** of the collection URL, not in new endpoints: `GET /books?author=austen&min_year=1900&sort=-year&limit=10`. The path identifies the resource (the collection); the query refines the view of it.",
        "Common conventions: simple equality filters (`author=austen`), range filters with clear names (`min_year`, `max_year`), and a `sort` parameter with a comma-separated list of fields where a leading `-` means descending (`sort=author,-year`). Document each parameter and its defaults.",
      ],
    },
    {
      kind: "code",
      heading: "Filter and sort",
      example: {
        title: "Query parameters in action",
        language: "bash",
        code: "t() { curl -s \"$1\" | python3 -c \"import sys, json; print([b['title'] for b in json.load(sys.stdin)['data']])\"; }\nt 'localhost:8000/v1/books?author=austen'\nt 'localhost:8000/v1/books?min_year=1900&sort=-year'\nt 'localhost:8000/v1/books?sort=author,-year'\nt 'localhost:8000/v1/books?author=austen&sort=-year&limit=1'\ncurl -s -w ' [%{http_code}]\\n' 'localhost:8000/v1/books?sort=secret'",
        walkthrough: [
          "`author=austen` returns the two books by that author (the match ignores case).",
          "`min_year=1900` keeps books from 1900 on, and `sort=-year` orders them newest first: `Dune` (1965) before `Ulysses` (1922).",
          "`sort=author,-year` sorts by author first and, inside each author, by year descending, so Austen's `Persuasion` (1817) comes before `Emma` (1815).",
          "Filters, sort and `limit` combine: Austen's books by year descending, one per page, gives `Persuasion`.",
          "Sorting by a field that does not exist (or must not be exposed) is rejected with `400` and a clear title. Never pass the field name straight into a database query.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Parameter patterns",
      diagram: {
        kind: "table",
        title: "Common designs",
        headers: ["Need", "Example"],
        rows: [
          ["Equality", "status=open"],
          ["Range", "min_price=10&max_price=50"],
          ["Several values", "status=open,pending"],
          ["Text search", "q=dune"],
          ["Sort", "sort=-created_at,title"],
          ["Choose fields", "fields=id,title"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Safety and performance",
      body: [
        "Allow only a fixed list of **filterable and sortable fields** and map them to columns yourself; this prevents injection and stops clients from sorting on unindexed or private data. Add database indexes for the common combinations. Apply the filter first, then sort, then paginate, and always include a unique tie-breaker (such as `id`) in the sort so the order is deterministic across pages. Return `400` for an unknown parameter value, not an empty list.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Building SQL by pasting query parameters into the query.",
          fix: "Whitelist fields and use bound parameters.",
        },
        {
          mistake: "Silently ignoring an invalid sort field.",
          fix: "Return 400 so the client knows the request was wrong.",
        },
        {
          mistake: "Sorting without a tie-breaker.",
          fix: "Add id as the last key to keep pages stable.",
        },
        {
          mistake: "Creating endpoints like /books/sortedByYear.",
          fix: "Use the sort query parameter on the collection.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A product search page",
      scenario:
        "A shop lists 10,000 products and users filter by category and price, and sort by price.",
      body: [
        "`GET /products?category=shoes&max_price=80&sort=price,id&limit=20&page=1`. The server whitelists the fields, applies the filters, sorts by `price` then `id`, and returns the first page together with `meta.total` and Link headers.",
        "Index `(category, price)` in the database so this common query stays fast.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "sort-desc",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "curl -s 'localhost:8000/v1/books?sort=-year&limit=2' | python3 -c \"import sys, json; print([b['year'] for b in json.load(sys.stdin)['data']])\"",
      },
      options: ["[1965, 1922]", "[1815, 1817]", "[1922, 1965]"],
      answer: 0,
      explanation:
        "A leading minus means descending, so the newest years come first.",
    },
    {
      type: "single",
      id: "bad-sort",
      prompt: "What should an API return for sort=password?",
      options: ["400 Bad Request", "200 with an empty list", "500"],
      answer: 0,
      explanation: "An unsupported sort field is a client error.",
    },
    {
      type: "truefalse",
      id: "tie-break",
      statement:
        "Adding a unique tie-breaker such as id to the sort keeps pages stable.",
      answer: true,
      explanation:
        "Without it, equal values can appear in different orders on different requests.",
    },
    {
      type: "blank",
      id: "sort-param",
      prompt: "To sort descending by year, use sort=___year.",
      answer: "-",
      explanation: "A leading minus sign means descending.",
      accepted: ["minus"],
    },
  ],
  assignment: {
    title: "Design the query language",
    task: [
      "For an /orders collection with fields status, total, created_at and customer_id, design the filter and sort parameters and document each with an example and the error behaviour.",
      "Test the practice server with five filter and sort combinations and a bad sort field.",
    ],
    checklist: [
      "Equality, range and sort parameters are documented",
      "Allowed fields are whitelisted",
      "Combined filter, sort and pagination was tested",
      "400 is used for invalid values",
    ],
    hints: ["Python's sort is stable, which makes multi-key sorting easy."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "query-urls",
      title: "Write the URL",
      task: [
        "Write the URL path with query for: books by Austen, newest first, 5 per page, page 2.",
      ],
      language: "markdown",
      starter: "GET ",
      solution: "GET /v1/books?author=austen&sort=-year&limit=5&page=2",
      hints: ["Use & between parameters."],
      checklist: ["author filter", "sort=-year", "limit=5 and page=2"],
    },
  ],
  revisionNotes: [
    "Filter, sort and pagination use query parameters on the collection",
    "sort=field,-field2: minus means descending",
    "Whitelist fields; 400 for invalid values; add a tie-breaker",
    "Index the common filter and sort combinations",
  ],
  resources: [
    {
      label: "MDN: URL query strings",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL",
    },
    {
      label: "MDN: REST",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
    },
    {
      label: "RFC 9110: HTTP semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    },
  ],
})
