import { defineQuestions } from "../author"
import { q } from "../compact"

const MS = "https://learn.microsoft.com/en-us/azure/architecture/best-practices"
const MDN = "https://developer.mozilla.org/en-US/docs/Web/HTTP"
const RFC = "https://www.rfc-editor.org/rfc"
const OA = "https://learn.openapis.org"
const SW = "https://swagger.io/docs/specification"

export default defineQuestions("rest-apis", "fresher", [
  q({
    slug: "what-is-a-rest-api",
    topic: "CRUD design",
    d: "easy",
    title: "What is a REST API and what are its core principles?",
    kw: [
      "rest",
      "resources",
      "uniform interface",
      "stateless",
      "representation",
    ],
    intent:
      "A foundation question: checks you can explain REST without reciting buzzwords.",
    short:
      "A REST API exposes resources, anything a client can access such as an order or a user, each identified by a URI. Clients interact with representations of these resources, usually JSON, using the standard HTTP methods: GET reads, POST creates, PUT or PATCH update, DELETE removes. Key principles are a uniform interface, statelessness (each request carries all the information needed, so servers keep no client session between requests), and loose coupling between client and server so they can evolve independently. Responses use HTTP status codes, and good APIs may include links to related resources.",
    detail: [
      "REST is an architectural style, not a protocol or a standard.",
      "Statelessness makes it easy to scale horizontally behind a load balancer.",
      "Many 'REST' APIs are really HTTP JSON APIs that follow the principles loosely.",
    ],
    ex: "`GET /orders/1` returns the order as JSON, and `DELETE /orders/1` removes it.",
    mistakes: [
      "Naming endpoints after actions, such as /getOrder.",
      "Keeping client state on the server between requests.",
    ],
    follow: ["What does stateless mean for an API?"],
    points: [
      "Resources identified by URIs",
      "Standard HTTP methods",
      "Stateless requests",
      "Loose coupling",
    ],
    notes: ["Nouns for resources, verbs from HTTP."],
    src: [
      ["Microsoft Learn: Web API design best practices", `${MS}/api-design`],
      ["MDN: Overview of HTTP", `${MDN}/Guides/Overview`],
    ],
  }),
  q({
    slug: "restful-resource-naming",
    topic: "CRUD design",
    d: "easy",
    title: "How should you name REST endpoints and design resource URLs?",
    kw: [
      "resource naming",
      "plural nouns",
      "nested resources",
      "url design",
      "kebab case",
    ],
    intent: "Checks you can design predictable URLs.",
    short:
      "Design URLs around resources, not actions. Use plural nouns for collections (`/orders`) and an identifier for one item (`/orders/42`), let the HTTP method express the action, and keep URLs lowercase and consistent. Nest only to show clear ownership and keep it shallow, such as `/customers/7/orders` rather than deep chains, since long paths couple the API to its data model. Put filtering, sorting and paging in query parameters, not in the path. Avoid verbs in URLs, except for rare operations that do not fit CRUD, such as `POST /orders/42/cancel`.",
    detail: [
      "Consistency is more important than the exact style you choose.",
      "Do not expose database internals or file extensions in URLs.",
      "Version at a clear, documented point.",
    ],
    ex: "`GET /users`, `POST /users`, `GET /users/42`, `PATCH /users/42`, `DELETE /users/42` cover user management.",
    mistakes: ["Verbs in paths like /createUser.", "Deeply nested URLs."],
    follow: ["Where do filters go?"],
    points: [
      "Plural nouns for collections",
      "Id for a single resource",
      "Action expressed by HTTP method",
      "Shallow nesting, filters in query",
    ],
    notes: ["Nouns in the path, verbs in the method."],
    src: [
      ["Microsoft Learn: Web API design best practices", `${MS}/api-design`],
    ],
  }),
  q({
    slug: "crud-to-http-mapping",
    topic: "CRUD design",
    d: "easy",
    title: "How do CRUD operations map to HTTP methods and status codes?",
    kw: ["crud", "post create", "get read", "put update", "delete"],
    intent: "A core API design question.",
    short:
      "Create maps to POST on the collection (`POST /products`), returning `201 Created` with a `Location` header for the new resource. Read maps to GET: the collection (`GET /products`) or one item (`GET /products/9`), returning `200`, or `404` when it does not exist. Update maps to PUT for full replacement or PATCH for partial changes, returning `200` with the resource or `204` with no body. Delete maps to DELETE, returning `204` (or `200`). Validation failures return `400` or `422`, and conflicts `409`.",
    detail: [
      "POST to a collection lets the server choose the new id; PUT to a specific URL lets the client choose it.",
      "GET must never change data.",
      "Be consistent in what each endpoint returns on success.",
    ],
    ex: "Creating a product returns `201`, with `Location: /products/9` and the new product as JSON.",
    code: [
      [
        "Express CRUD routes",
        "js",
        `router.get("/products", list)\nrouter.post("/products", create)      // 201 + Location\nrouter.get("/products/:id", read)     // 200 or 404\nrouter.patch("/products/:id", update) // 200\nrouter.delete("/products/:id", remove) // 204`,
        [
          "Each route pairs a method with a resource path.",
          "Comments show expected success codes.",
        ],
      ],
    ],
    mistakes: ["Returning 200 for creation.", "Using POST for everything."],
    follow: ["What does POST return on success?"],
    points: [
      "POST create 201",
      "GET read 200/404",
      "PUT/PATCH update 200/204",
      "DELETE 204",
    ],
    notes: ["Create 201, delete 204."],
    src: [
      ["Microsoft Learn: Web API design best practices", `${MS}/api-design`],
      ["MDN: HTTP request methods", `${MDN}/Reference/Methods`],
    ],
  }),
  q({
    slug: "put-vs-patch-in-apis",
    topic: "HTTP methods",
    d: "medium",
    title: "When should an API use PUT and when PATCH?",
    kw: [
      "put vs patch",
      "partial update",
      "full replacement",
      "json merge patch",
      "idempotent update",
    ],
    intent: "Checks you can choose update semantics deliberately.",
    short:
      "Use PUT when the client sends the complete new representation, which replaces the resource; sending the same PUT again gives the same result, so it is idempotent and safe to retry. Use PATCH when the client sends only the changes, which is cheaper and avoids overwriting fields the client did not intend to change. Define clearly what PATCH means: JSON Merge Patch (RFC 7396) treats the body as the fields to set, with null removing a field, and JSON Patch (RFC 6902) is a list of operations. Document how missing fields are treated for each method.",
    detail: [
      "Use `If-Match` with ETags so concurrent updates do not clobber each other.",
      "Validate PATCH input as strictly as creation input.",
      "Return the updated representation so clients stay in sync.",
    ],
    ex: "A profile page sends a PATCH with only the changed `displayName`.",
    mistakes: [
      "PUT with partial data wiping other fields.",
      "Undocumented PATCH semantics.",
    ],
    follow: ["Which update method is idempotent?"],
    points: [
      "PUT replaces, idempotent",
      "PATCH changes only some fields",
      "Merge Patch or JSON Patch formats",
      "Use ETags to avoid lost updates",
    ],
    notes: ["Replace or change."],
    src: [
      ["MDN: PUT", `${MDN}/Reference/Methods/PUT`],
      ["MDN: PATCH", `${MDN}/Reference/Methods/PATCH`],
      ["RFC 7396: JSON Merge Patch", `${RFC}/rfc7396`],
    ],
  }),
  q({
    slug: "api-error-responses-problem-details",
    topic: "Status codes",
    d: "medium",
    title: "How should an API report errors?",
    kw: [
      "error response",
      "problem details",
      "rfc 9457",
      "error codes",
      "validation errors",
    ],
    intent: "Checks you design useful, consistent error bodies.",
    short:
      "Return the right HTTP status code and a consistent JSON error body. The standard Problem Details format (RFC 9457, media type `application/problem+json`) defines fields such as `type`, `title`, `status`, `detail` and `instance`, and you can add extensions such as a list of field errors for validation. Keep messages helpful but never leak stack traces, SQL or secrets, include a stable machine-readable code that clients can switch on, and a request id for support. Use 400 or 422 for invalid input, 401 and 403 for access problems, 404 for missing resources, 409 for conflicts and 5xx only for server faults.",
    detail: [
      "The same error shape across the API makes client code simple.",
      "Localised messages for users are a client concern; keep codes stable.",
      "Log the details server-side with the request id.",
    ],
    ex: "A validation failure returns 422 with an `errors` array naming each invalid field.",
    code: [
      [
        "A problem details body",
        "json",
        `{\n  "type": "https://api.example.com/problems/validation",\n  "title": "Validation failed",\n  "status": 422,\n  "detail": "Email is not valid",\n  "errors": [{ "field": "email", "message": "must be a valid email" }]\n}`,
        [
          "Standard members describe the problem.",
          "`errors` is an extension with field details.",
        ],
      ],
    ],
    mistakes: [
      "200 OK with an error message in the body.",
      "Leaking stack traces.",
    ],
    follow: ["Which media type is used for problem details?"],
    points: [
      "Right status code",
      "Consistent JSON error shape",
      "RFC 9457 problem details",
      "No internal details leaked",
    ],
    notes: ["Status, code, message, id."],
    src: [
      ["RFC 9457: Problem Details for HTTP APIs", `${RFC}/rfc9457`],
      ["Microsoft Learn: Web API implementation", `${MS}/api-implementation`],
    ],
  }),
  q({
    slug: "api-status-codes-for-rest",
    topic: "Status codes",
    d: "easy",
    title: "Which status codes should a REST API use most carefully?",
    kw: ["201 created", "204 no content", "400 vs 422", "404", "409 conflict"],
    intent: "Checks you can map outcomes to precise codes.",
    short:
      "Use 200 for successful reads and updates with a body, 201 for creation with a `Location` header, 202 for accepted asynchronous work, and 204 for success with no content (often DELETE). Use 400 for malformed requests, 422 when the request is well formed but fails validation, 401 for missing or invalid authentication, 403 when the user is authenticated but not allowed, 404 when the resource does not exist, 405 for a method not supported on that resource, 409 for conflicts such as a duplicate, 415 for an unsupported media type and 429 for rate limiting. Reserve 500 for real server errors.",
    detail: [
      "Do not return 404 for an empty list; return 200 with an empty array.",
      "A 404 can be used instead of 403 to avoid revealing existence.",
      "Be consistent: clients write logic against these codes.",
    ],
    ex: "`GET /orders?status=open` with no matches returns `200` and `[]`.",
    mistakes: ["404 for empty collections.", "500 for validation errors."],
    follow: ["What is the difference between 400 and 422?"],
    points: [
      "2xx success variations",
      "4xx precise client errors",
      "5xx only for server faults",
      "Empty list is 200",
    ],
    notes: ["Precise codes tell clients what to do."],
    src: [
      ["MDN: HTTP response status codes", `${MDN}/Reference/Status`],
      ["RFC 9110: Status codes", `${RFC}/rfc9110`],
    ],
  }),
  q({
    slug: "api-versioning-strategies",
    topic: "Versioning",
    d: "medium",
    title: "How can you version a REST API, and why does it matter?",
    kw: [
      "api versioning",
      "url versioning",
      "header versioning",
      "breaking change",
      "deprecation",
    ],
    intent: "Checks you plan for change without breaking clients.",
    short:
      "Versioning lets you change an API without breaking existing clients. Common approaches are the URL path (`/v1/orders`), which is explicit and easy to route and cache; a query parameter (`?version=2`); a custom header; or media type versioning through `Accept: application/vnd.example.v2+json`. Whatever you pick, apply it consistently. Prefer additive, backward-compatible changes (new optional fields, new endpoints) which need no new version; introduce a new version only for breaking changes such as removing or renaming fields. Communicate deprecations with notice periods and sunset information.",
    detail: [
      "Supporting many versions has maintenance cost, so retire old ones deliberately.",
      "Clients should ignore unknown fields so additions are safe.",
      "Document changes in a changelog.",
    ],
    ex: "`/v1/orders` stays stable for existing apps while `/v2/orders` changes the order structure.",
    mistakes: [
      "Breaking changes without a new version.",
      "Never retiring old versions.",
    ],
    follow: ["Which changes need a new version?"],
    points: [
      "URL, header or media type versioning",
      "Additive changes are non-breaking",
      "New version only for breaking changes",
      "Deprecate with notice",
    ],
    notes: ["Don't break clients."],
    src: [["Microsoft Learn: Web API design (versioning)", `${MS}/api-design`]],
  }),
  q({
    slug: "api-pagination-offset-cursor",
    topic: "Pagination",
    d: "medium",
    title:
      "How do you paginate a REST API, and what is the difference between offset and cursor pagination?",
    kw: [
      "pagination",
      "offset limit",
      "cursor pagination",
      "page size",
      "next link",
    ],
    intent: "A frequent design question about large collections.",
    short:
      "Returning a whole large collection is slow and wasteful, so APIs paginate. Offset (page) pagination uses `?page=3&limit=20` or `offset` and `limit`; it is simple and allows jumping to a page, but deep offsets can be slow in databases and results can shift when items are added or removed between requests. Cursor (keyset) pagination returns an opaque token for the next page, such as `?after=abc123`, which is stable and fast for large or fast-changing data and suits infinite scroll, but cannot jump to arbitrary pages. Enforce a maximum page size and return paging metadata or links.",
    detail: [
      "Always sort by a stable, unique key for consistent paging.",
      "Include `next` and `prev` links or a `nextCursor` in the response.",
      "Return the total count only if it is cheap, since counting can be expensive.",
    ],
    ex: "A feed API returns 20 items and a `nextCursor`, which the client sends to get the next 20.",
    code: [
      [
        "Cursor-based response",
        "json",
        `{\n  "items": [{ "id": 101 }, { "id": 102 }],\n  "nextCursor": "eyJpZCI6MTAyfQ",\n  "hasMore": true\n}`,
        ["Items are one page.", "The cursor identifies where to continue."],
      ],
    ],
    mistakes: ["No maximum page size.", "Unstable ordering across pages."],
    follow: ["Why can deep offsets be slow?"],
    points: [
      "Offset: simple, jumpable, can shift",
      "Cursor: stable, scalable",
      "Limit page size",
      "Return links or cursor",
    ],
    notes: ["Cursors for feeds, offsets for tables."],
    src: [["Microsoft Learn: Web API design (pagination)", `${MS}/api-design`]],
  }),
  q({
    slug: "api-filtering-sorting-searching",
    topic: "Filtering & sorting",
    d: "medium",
    title: "How should an API support filtering, sorting and searching?",
    kw: ["filtering", "sorting", "query parameters", "sort order", "search"],
    intent: "Checks you can design list endpoints that clients can query.",
    short:
      "Expose filtering, sorting and field selection on collections through query parameters, not new endpoints: `GET /orders?status=open&customerId=7`, `?sort=-createdAt,total` (a minus sign for descending), `?q=boots` for text search and `?fields=id,total` to trim the response. Whitelist the allowed fields and operators, validate values, and map them to indexed columns; never pass the raw query into a database query, which risks injection and slow scans. Combine them with pagination, and document the options and defaults.",
    detail: [
      "Use consistent names and types across endpoints.",
      "Unknown parameters should be ignored or rejected predictably.",
      "Add database indexes for common filters and sort keys.",
    ],
    ex: "`GET /products?category=shoes&minPrice=1000&sort=price&limit=20` returns the cheapest shoes.",
    mistakes: [
      "Building SQL from raw query parameters.",
      "Allowing sorting by unindexed fields on huge tables.",
    ],
    follow: ["Why whitelist sortable fields?"],
    points: [
      "Query parameters for filter, sort, search",
      "Whitelist and validate",
      "Index the common ones",
      "Combine with pagination",
    ],
    notes: ["Whitelist the query."],
    src: [
      [
        "Microsoft Learn: Web API design (filtering and sorting)",
        `${MS}/api-design`,
      ],
      [
        "OWASP: Input Validation Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
      ],
    ],
  }),
  q({
    slug: "api-idempotency-keys",
    topic: "Idempotency",
    d: "hard",
    title: "How do idempotency keys make POST requests safe to retry?",
    kw: [
      "idempotency key",
      "retry safety",
      "duplicate requests",
      "payments",
      "post retry",
    ],
    intent: "Checks you can prevent duplicate side effects when clients retry.",
    short:
      "A network timeout leaves a client unsure whether a POST was processed, and retrying could create a duplicate order or double charge. With an idempotency key, the client generates a unique value (such as a UUID) and sends it in a header like `Idempotency-Key` with the request. The server stores the key with the result of the first processing; if the same key arrives again, it returns the stored response instead of repeating the work, and if the key is reused with a different request body it rejects it. Keys expire after a window, and storing and checking them must be atomic.",
    detail: [
      "PUT and DELETE are idempotent by design; POST needs this mechanism.",
      "A unique database constraint on the key gives atomicity.",
      "The same pattern applies to webhook handlers.",
    ],
    ex: "A payment API returns the original result when a client retries with the same key after a timeout.",
    mistakes: [
      "No protection against duplicate charges.",
      "Non-atomic key checks that race.",
    ],
    follow: ["What if the same key arrives with a different body?"],
    points: [
      "Client-generated unique key",
      "Server stores key and result",
      "Replay returns the saved response",
      "Atomic check, expiry window",
    ],
    notes: ["Same key, same result."],
    src: [
      [
        "MDN: Idempotent",
        "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent",
      ],
      ["RFC 9110: Idempotent methods", `${RFC}/rfc9110`],
    ],
  }),
  q({
    slug: "api-hateoas-hypermedia",
    topic: "HATEOAS",
    d: "hard",
    title: "What is HATEOAS and is it commonly used?",
    kw: ["hateoas", "hypermedia", "links", "discoverability", "rest maturity"],
    intent:
      "Checks you understand the hypermedia constraint without overselling it.",
    short:
      "HATEOAS, Hypermedia as the Engine of Application State, is a REST constraint where responses contain links telling the client what it can do next, so the client follows links instead of hard-coding URLs. For example, an order response includes links to cancel it or pay it, and only includes those that are valid in the current state. It makes APIs more discoverable and lets servers change URLs without breaking clients. In practice many APIs include only simple links such as pagination `next` and `prev`, because full hypermedia needs client support and conventions such as Link headers (RFC 8288) or formats like HAL.",
    detail: [
      "Links can be in the body or in a `Link` header.",
      "State-dependent links also communicate permissions and workflow.",
      "It is a design choice with a cost, not a requirement for a useful API.",
    ],
    ex: "An order in the pending state lists `pay` and `cancel` links, while a paid order lists `refund`.",
    code: [
      [
        "Links in a response",
        "json",
        `{\n  "id": 42,\n  "status": "pending",\n  "_links": {\n    "self": { "href": "/orders/42" },\n    "pay": { "href": "/orders/42/payment" },\n    "cancel": { "href": "/orders/42/cancel" }\n  }\n}`,
        [
          "`self` identifies the resource.",
          "Action links reflect the current state.",
        ],
      ],
    ],
    mistakes: [
      "Assuming every REST API implements hypermedia.",
      "Adding links that clients never use.",
    ],
    follow: ["What does a Link header look like?"],
    points: [
      "Responses include links to next actions",
      "Client follows links",
      "Decouples clients from URLs",
      "Often limited to pagination links",
    ],
    notes: ["Links drive the state."],
    src: [
      ["Microsoft Learn: Web API design (HATEOAS)", `${MS}/api-design`],
      ["RFC 8288: Web Linking", `${RFC}/rfc8288`],
    ],
  }),
  q({
    slug: "api-authentication-for-rest",
    topic: "API integration",
    d: "medium",
    title: "How are REST APIs commonly authenticated?",
    kw: ["api key", "bearer token", "oauth2", "jwt", "basic auth"],
    intent: "Checks you can pick an authentication method.",
    short:
      "Common options are API keys (a secret sent in a header, suited to server-to-server use and simple access control), bearer tokens such as JWTs sent in `Authorization: Bearer ...` after a login, OAuth 2.0 for delegated access and third-party integrations, and sessions with cookies for browser apps. Always use HTTPS, keep secrets out of URLs and logs, scope tokens to the least privilege, make them expire, and allow revocation. Authenticate every request, since REST is stateless, and authorise per resource on the server.",
    detail: [
      "API keys identify applications; they are not a substitute for user authentication.",
      "Rotate keys and tokens and never commit them to git.",
      "Rate limit by key to contain abuse.",
    ],
    ex: "A mobile app logs in and sends a bearer token with each API request; a server-to-server integration uses an API key.",
    mistakes: ["API keys in query strings.", "Tokens that never expire."],
    follow: ["Where should the token be sent?"],
    points: [
      "API keys, bearer tokens, OAuth 2.0, cookies",
      "HTTPS only",
      "Least privilege and expiry",
      "Authenticate each request",
    ],
    notes: ["Every request proves itself."],
    src: [
      ["MDN: HTTP authentication", `${MDN}/Guides/Authentication`],
      [
        "OWASP: REST Security Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html",
      ],
    ],
  }),
  q({
    slug: "openapi-what-and-why",
    topic: "API documentation (Swagger/OpenAPI)",
    d: "easy",
    title: "What is OpenAPI, and how does it relate to Swagger?",
    kw: [
      "openapi",
      "swagger",
      "api specification",
      "yaml",
      "api documentation",
    ],
    intent: "Checks you know the standard for describing HTTP APIs.",
    short:
      "The OpenAPI Specification is a standard, language-agnostic way to describe HTTP APIs in YAML or JSON: servers, paths and operations, parameters, request bodies, responses, schemas and security. A machine-readable description can generate interactive documentation, client SDKs, server stubs, mock servers and tests, and it works as a contract between front-end and back-end teams. Swagger was the earlier name of the specification; today 'Swagger' mostly refers to the tooling around OpenAPI, such as Swagger UI for browsable docs and Swagger Editor.",
    detail: [
      "The current major versions are 3.0.x and 3.1.x.",
      "Keep the description in the repository and review it with code.",
      "Design-first and code-first workflows both exist.",
    ],
    ex: "A team publishes Swagger UI at `/docs`, generated from its OpenAPI file.",
    mistakes: [
      "Docs that drift from the real behaviour.",
      "Treating Swagger and OpenAPI as unrelated.",
    ],
    follow: ["What can be generated from an OpenAPI file?"],
    points: [
      "Standard API description",
      "YAML or JSON",
      "Docs, SDKs, mocks and tests from one source",
      "Swagger = tooling",
    ],
    notes: ["One description, many outputs."],
    src: [
      ["OpenAPI: Introduction", `${OA}/introduction.html`],
      ["Swagger: About OpenAPI specification", `${SW}/about/`],
    ],
  }),
  q({
    slug: "openapi-document-structure",
    topic: "API documentation (Swagger/OpenAPI)",
    d: "medium",
    title: "What does an OpenAPI document contain?",
    kw: [
      "openapi document",
      "paths",
      "components schemas",
      "parameters",
      "responses",
    ],
    intent: "Checks you can read and write a basic OpenAPI file.",
    short:
      "An OpenAPI document has an `openapi` version field and an `info` object with the API title and version, optionally `servers`, and the main `paths` object. Each path lists operations by HTTP method, such as `get` and `post`, with a summary, parameters (path, query, header), a `requestBody` and `responses` keyed by status code, each with a content type and a schema. Reusable pieces such as schemas, parameters, responses and security schemes go under `components` and are referenced with `$ref`, which avoids repetition. Security schemes and `security` requirements describe authentication.",
    detail: [
      "Schemas use JSON Schema vocabulary.",
      "Each operation should have a unique `operationId` for code generation.",
      "Validate the document with tools such as the Swagger Editor.",
    ],
    ex: "`GET /orders/{id}` documents the `id` path parameter and 200 and 404 responses referencing an `Order` schema.",
    code: [
      [
        "A minimal OpenAPI file",
        "yaml",
        `openapi: 3.0.3\ninfo:\n  title: Shop API\n  version: 1.0.0\npaths:\n  /orders/{id}:\n    get:\n      summary: Get an order\n      parameters:\n        - name: id\n          in: path\n          required: true\n          schema: { type: integer }\n      responses:\n        "200":\n          description: The order\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/Order"\n        "404":\n          description: Not found\ncomponents:\n  schemas:\n    Order:\n      type: object\n      properties:\n        id: { type: integer }\n        total: { type: number }`,
        [
          "`paths` define operations.",
          "Responses are keyed by status code.",
          "`$ref` reuses the Order schema.",
        ],
      ],
    ],
    mistakes: [
      "Duplicated schemas instead of $ref.",
      "Missing error responses.",
    ],
    follow: ["What is components used for?"],
    points: [
      "openapi, info, servers, paths",
      "Operations with parameters and responses",
      "components + $ref for reuse",
      "Security schemes",
    ],
    notes: ["paths for endpoints, components for reuse."],
    src: [
      [
        "OpenAPI: Structure of an OpenAPI description",
        `${OA}/specification/structure.html`,
      ],
      ["Swagger: Basic structure", `${SW}/v3_0/basic-structure/`],
    ],
  }),
  q({
    slug: "swagger-ui-and-docs-in-express",
    topic: "API documentation (Swagger/OpenAPI)",
    d: "medium",
    title: "How do you serve interactive API docs, and keep them accurate?",
    kw: [
      "swagger ui",
      "openapi in express",
      "interactive docs",
      "try it out",
      "contract testing",
    ],
    intent: "Checks you can make documentation useful and trustworthy.",
    short:
      "Swagger UI renders an OpenAPI file as interactive documentation where developers can read each endpoint and send test requests with 'Try it out'. In a Node project, serve it with a package such as `swagger-ui-express`, passing the parsed OpenAPI document, and mount it at a path like `/docs`; protect or disable it in production if the API is private. To keep docs accurate, treat the OpenAPI file as the source of truth, validate requests and responses against it in tests or middleware, and update it in the same pull request as the code change.",
    detail: [
      "Frameworks such as FastAPI generate OpenAPI automatically from code.",
      "Add examples to schemas so the docs are understandable.",
      "Publish the file so others can generate clients.",
    ],
    ex: "The team's CI fails if the implemented responses do not match the OpenAPI description.",
    mistakes: [
      "Stale documentation.",
      "Exposing internal admin endpoints in public docs.",
    ],
    follow: ["How do you detect doc drift?"],
    points: [
      "Swagger UI renders OpenAPI",
      "Try it out sends real requests",
      "OpenAPI file as source of truth",
      "Validate in tests",
    ],
    notes: ["Docs are only useful when current."],
    src: [
      [
        "Swagger: Swagger UI installation",
        "https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/",
      ],
      ["OpenAPI: Documenting your API", `${OA}/specification/docs.html`],
    ],
  }),
  q({
    slug: "api-security-in-openapi",
    topic: "API documentation (Swagger/OpenAPI)",
    d: "hard",
    title: "How do you describe authentication in an OpenAPI document?",
    kw: [
      "securitySchemes",
      "bearer auth",
      "api key scheme",
      "oauth2 flows",
      "security requirement",
    ],
    intent: "Checks you can document how clients authenticate.",
    short:
      "Declare the available methods under `components.securitySchemes`: an `http` scheme with `scheme: bearer` (and optionally `bearerFormat: JWT`) for bearer tokens, an `apiKey` scheme saying whether the key goes in a header, query or cookie and its name, or an `oauth2` scheme with flows and scopes. Then apply them with a `security` requirement at the top level for all operations or per operation, which can list alternatives. Tools such as Swagger UI then show an Authorize button and add the credentials to test calls. Document scopes so that clients know what each token may do.",
    detail: [
      "Public endpoints override with an empty `security: []`.",
      "Never put real secrets in the specification.",
      "Describe the 401 and 403 responses.",
    ],
    ex: "Everything requires a bearer token except `POST /login`, which sets `security: []`.",
    code: [
      [
        "Bearer security scheme",
        "yaml",
        `components:\n  securitySchemes:\n    bearerAuth:\n      type: http\n      scheme: bearer\n      bearerFormat: JWT\nsecurity:\n  - bearerAuth: []`,
        [
          "The scheme is defined once.",
          "The top-level `security` applies it to all operations.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to apply the scheme to operations.",
      "Secrets inside the spec.",
    ],
    follow: ["How do you mark one endpoint public?"],
    points: [
      "securitySchemes define methods",
      "security applies them",
      "Bearer, API key and OAuth2",
      "Empty security for public endpoints",
    ],
    notes: ["Define once, apply many."],
    src: [
      ["OpenAPI: Security", `${OA}/specification/security.html`],
      ["Swagger: Authentication", `${SW}/v3_0/authentication/`],
    ],
  }),
  q({
    slug: "postman-and-curl-api-testing",
    topic: "API integration",
    d: "easy",
    title: "How do you test a REST API manually with curl or Postman?",
    kw: [
      "postman",
      "curl",
      "api testing",
      "collections",
      "environment variables",
    ],
    intent: "Checks you can explore and verify an API.",
    short:
      "With curl you build a request on the command line, for example `curl -X POST https://api.example.com/items -H 'Content-Type: application/json' -d '{\"name\":\"pen\"}'`, and inspect the status and headers with `-i` or `-v`. Postman is a graphical client where you create requests, set the method, URL, headers, auth and body, send them and view the response. Group requests into collections, store values such as the base URL and token in environment variables, and add test scripts to check status codes and response fields so the collection can be re-run or automated in CI.",
    detail: [
      "Check status code, headers, body shape and response time.",
      "Test error cases and authorisation, not just the happy path.",
      "Do not share collections that contain real secrets.",
    ],
    ex: "A collection logs in, saves the token to an environment variable, and uses it in later requests.",
    mistakes: [
      "Only testing success responses.",
      "Hard-coded tokens in shared collections.",
    ],
    follow: ["Why use environment variables in Postman?"],
    points: [
      "curl for quick command-line requests",
      "Postman for saved collections",
      "Variables for base URL and tokens",
      "Assertions in test scripts",
    ],
    notes: ["Collections, variables, tests."],
    src: [
      ["curl(1)", "https://man7.org/linux/man-pages/man1/curl.1.html"],
      [
        "Postman: Sending your first request",
        "https://learning.postman.com/docs/getting-started/first-steps/sending-the-first-request/",
      ],
    ],
  }),
  q({
    slug: "consuming-apis-from-front-end",
    topic: "API integration",
    d: "medium",
    title: "How do you integrate a REST API in a front-end app reliably?",
    kw: [
      "api client",
      "loading states",
      "error handling",
      "timeouts",
      "retries",
    ],
    intent: "Checks you think about failure when calling APIs.",
    short:
      "Centralise API calls in a small client module that sets the base URL, adds the auth header, checks `response.ok`, parses JSON and converts failures into typed errors. Handle all UI states: loading, success, empty and error, with a way to retry. Add timeouts or cancellation with `AbortController` so requests cannot hang, and retry only idempotent requests with backoff. Validate the shape of responses at the boundary (for example with a schema), and keep server data in a query library that handles caching, refetching and deduplication rather than copying it into global state.",
    detail: [
      "Do not trust response shape: APIs change and fail.",
      "Handle 401 by refreshing the token or redirecting to login.",
      "Debounce user input that triggers requests.",
    ],
    ex: "A React app wraps `fetch` in an `api` helper and uses TanStack Query for loading and error states.",
    mistakes: [
      "Calling fetch directly everywhere with duplicated error handling.",
      "No timeout or cancellation.",
    ],
    follow: ["Which requests are safe to retry automatically?"],
    points: [
      "One API client module",
      "Handle loading, empty and error states",
      "Timeouts, cancellation and safe retries",
      "Validate responses",
    ],
    notes: ["Expect failure."],
    src: [
      [
        "MDN: Using the Fetch API",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
      ],
      [
        "TanStack Query: Overview",
        "https://tanstack.com/query/latest/docs/framework/react/overview",
      ],
    ],
  }),
  q({
    slug: "api-rate-limiting-and-throttling-design",
    topic: "API integration",
    d: "medium",
    title: "How should an API communicate and enforce rate limits?",
    kw: ["rate limit", "429", "retry-after", "quota headers", "throttling"],
    intent: "Checks you can design and consume limits properly.",
    short:
      "An API enforces limits per client, such as per API key or user, to protect capacity and ensure fair use. When a client exceeds the limit the server returns `429 Too Many Requests` and, ideally, a `Retry-After` header; many APIs also publish headers showing the limit, the remaining quota and the reset time. Document the limits, apply stricter ones to expensive or sensitive endpoints such as login, and make limit counters shared when you run several instances. Clients should honour `Retry-After`, back off exponentially with jitter, and avoid retry storms.",
    detail: [
      "Burst allowances smooth short spikes.",
      "Return 429 rather than a 5xx so clients know to wait.",
      "Consider quotas per plan for paid APIs.",
    ],
    ex: "An API allows 100 requests per minute per key and replies 429 with `Retry-After: 20` after that.",
    mistakes: ["Silent dropping of requests.", "Clients retrying immediately."],
    follow: ["What should a client do on 429?"],
    points: [
      "Limits per key or user",
      "429 with Retry-After",
      "Publish remaining quota",
      "Backoff with jitter",
    ],
    notes: ["Tell clients when to come back."],
    src: [
      ["MDN: 429 Too Many Requests", `${MDN}/Reference/Status/429`],
      ["RFC 6585: Additional HTTP Status Codes", `${RFC}/rfc6585`],
    ],
  }),
  q({
    slug: "api-validation-and-input-handling",
    topic: "CRUD design",
    d: "medium",
    title: "How should a REST API validate input?",
    kw: [
      "input validation",
      "schema validation",
      "422",
      "required fields",
      "sanitisation",
    ],
    intent: "Checks you treat all requests as untrusted.",
    short:
      "Validate every request on the server: path and query parameters, headers and the body. Check types, required fields, lengths, ranges and formats against a schema, reject unknown fields (to avoid mass assignment), and return a `400` or `422` response listing each problem. Validation is separate from authorisation: also verify that the caller may act on the specific resource. Use a schema library or OpenAPI-based validation so rules live in one place, and validate business rules (such as stock levels) in the service layer.",
    detail: [
      "Client-side validation is a convenience only.",
      "Limit body size to prevent abuse.",
      "Normalise input such as trimming whitespace before validating.",
    ],
    ex: 'Creating a user with a malformed email returns 422 and `errors: [{field: "email"}]`.',
    mistakes: ["Trusting the front end.", "Accepting any field in the body."],
    follow: ["How does validation differ from authorisation?"],
    points: [
      "Validate all inputs server-side",
      "Schema with types and formats",
      "Reject unknown fields",
      "Return 400 or 422 with details",
    ],
    notes: ["Never trust the client."],
    src: [
      [
        "OWASP: Input Validation Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
      ],
      ["Microsoft Learn: Web API implementation", `${MS}/api-implementation`],
    ],
  }),
  q({
    slug: "api-caching-and-conditional-get",
    topic: "HTTP methods",
    d: "medium",
    title: "How can a REST API use HTTP caching?",
    kw: [
      "etag",
      "cache-control",
      "conditional get",
      "304",
      "cacheable responses",
    ],
    intent: "Checks you use HTTP features instead of reinventing them.",
    short:
      "GET responses can be cached by browsers, proxies and CDNs when you send the right headers. Set `Cache-Control` with a suitable `max-age` for data that changes rarely, `private` for per-user data, and `no-store` for sensitive data. Add an `ETag` (or `Last-Modified`) so clients can revalidate with `If-None-Match` and receive `304 Not Modified` with no body when nothing changed. Use `Vary` for headers that affect the response, such as `Accept-Language`. Do not cache responses to POST, and take care that authenticated responses are not stored by shared caches.",
    detail: [
      "ETag-based `If-Match` also protects updates against conflicts.",
      "Many frameworks generate weak ETags for you.",
      "Document which endpoints are cacheable.",
    ],
    ex: "`GET /countries` is cached for an hour, while `GET /me` is `private, no-cache`.",
    mistakes: [
      "Caching personalised responses publicly.",
      "Missing Vary on negotiated content.",
    ],
    follow: ["What does 304 save?"],
    points: [
      "Cache-Control for freshness",
      "ETag for revalidation",
      "304 Not Modified",
      "Private/no-store for sensitive data",
    ],
    notes: ["Use the web's caching."],
    src: [
      ["MDN: HTTP caching", `${MDN}/Guides/Caching`],
      ["MDN: Conditional requests", `${MDN}/Guides/Conditional_requests`],
    ],
  }),
  q({
    slug: "api-bulk-and-long-running-operations",
    topic: "HTTP methods",
    d: "hard",
    title:
      "How do you design bulk operations and long-running tasks in a REST API?",
    kw: [
      "202 accepted",
      "long running operation",
      "polling",
      "bulk endpoint",
      "job resource",
    ],
    intent: "Checks you can handle work that does not fit one quick request.",
    short:
      "For work that takes long, do not hold the connection open. Accept the request, return `202 Accepted` with a `Location` header that points to a status resource such as `/jobs/123`, and let the client poll it (or receive a webhook) to see `pending`, `running`, `succeeded` or `failed`, and a link to the result when done. For bulk changes, either accept an array in one request and return per-item results (using a multi-status style response), or provide a job-based import endpoint. Keep operations idempotent with keys, and set sensible size limits.",
    detail: [
      "Return `Retry-After` hints for polling intervals.",
      "A failed item in a batch should not silently hide behind overall success.",
      "Expire old job records.",
    ],
    ex: "`POST /reports` returns 202 with `Location: /reports/jobs/77`, which the client polls until it is complete.",
    mistakes: [
      "Blocking requests for minutes.",
      "Batch responses that hide partial failures.",
    ],
    follow: ["What does 202 tell the client?"],
    points: [
      "202 Accepted with a status URL",
      "Poll or webhook for completion",
      "Per-item results for bulk",
      "Idempotency and limits",
    ],
    notes: ["Accept now, finish later."],
    src: [
      ["MDN: 202 Accepted", `${MDN}/Reference/Status/202`],
      [
        "Microsoft Learn: Web API design (asynchronous operations)",
        `${MS}/api-design`,
      ],
    ],
  }),
  q({
    slug: "api-json-conventions-dates-money",
    topic: "CRUD design",
    d: "medium",
    title:
      "What JSON conventions should an API follow for dates, ids and money?",
    kw: [
      "iso 8601",
      "json conventions",
      "camelCase",
      "money integers",
      "utc timestamps",
    ],
    intent: "Checks you avoid common data-format mistakes.",
    short:
      "Use consistent naming (commonly camelCase) and stable field types. Represent timestamps in ISO 8601 / RFC 3339 format in UTC, such as `2026-03-01T09:30:00Z`, rather than locale-specific strings. Send identifiers as strings if they might exceed JavaScript's safe integer range, and never reuse the meaning of a field. Represent money as integer amounts in the smallest currency unit (or as strings with a currency code), never as floating-point numbers. Return `null` or omit fields consistently and document which, and avoid changing field types between releases.",
    detail: [
      "JSON has no date type, so the format must be documented.",
      "JavaScript Number cannot represent integers above 2^53 exactly.",
      "Include the currency code with amounts.",
    ],
    ex: 'An order contains `"total": 49999, "currency": "INR"` and `"createdAt": "2026-03-01T09:30:00Z"`.',
    mistakes: ["Floats for prices.", "Local time without a zone."],
    follow: ["Why avoid floats for money?"],
    points: [
      "Consistent naming",
      "ISO 8601 UTC timestamps",
      "Integer money with currency",
      "Large ids as strings",
    ],
    notes: ["Be boring and consistent."],
    src: [
      ["RFC 8259: The JSON Data Interchange Format", `${RFC}/rfc8259`],
      [
        "MDN: Date.prototype.toISOString()",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString",
      ],
    ],
  }),
  q({
    slug: "api-design-first-vs-code-first",
    topic: "API documentation (Swagger/OpenAPI)",
    d: "medium",
    title:
      "What is the difference between design-first and code-first API development?",
    kw: [
      "design-first",
      "code-first",
      "contract",
      "mock server",
      "parallel development",
    ],
    intent: "Checks you understand workflow trade-offs.",
    short:
      "In design-first development you write the API contract (an OpenAPI description) before the code, review it with front-end and back-end teams, and then generate mocks, stubs and client code from it. That lets teams work in parallel and agree on behaviour early. In code-first development you build the implementation and generate the description from annotations or code, which is quick and stays close to the code, as FastAPI and some Java frameworks do, but the contract is a by-product and can be inconsistent. Teams choose by size, how many consumers exist and how much stability they need.",
    detail: [
      "Whichever you use, validate that the implementation matches the contract.",
      "Public APIs benefit from design-first review.",
      "Mock servers from the spec let front-end work start early.",
    ],
    ex: "A front-end team builds against a mock generated from the agreed OpenAPI file while the back end is implemented.",
    mistakes: [
      "Contracts that nobody reviews.",
      "Specs that drift from the implementation.",
    ],
    follow: ["What does design-first enable?"],
    points: [
      "Design-first: contract before code",
      "Code-first: spec generated from code",
      "Parallel work with mocks",
      "Keep spec and code in sync",
    ],
    notes: ["Contract first for many consumers."],
    src: [
      ["OpenAPI: Introduction", `${OA}/introduction.html`],
      ["Swagger: About OpenAPI specification", `${SW}/about/`],
    ],
  }),
  q({
    slug: "api-security-checklist-rest",
    topic: "API integration",
    d: "hard",
    title: "What are the key security checks for a REST API?",
    kw: [
      "api security",
      "authorization per resource",
      "https only",
      "input validation",
      "rate limiting",
    ],
    intent: "Checks you can name the main protections.",
    short:
      "Serve the API only over HTTPS. Authenticate every request and authorise per resource (checking that the caller owns or may access the object), which prevents broken object-level authorisation. Validate all input with schemas and reject unknown fields. Limit request sizes and rates, and return generic error messages without internals. Keep secrets and tokens out of URLs and logs, use short-lived tokens, set appropriate CORS rules, and send security headers. Log and monitor access, and keep dependencies patched. OWASP's REST Security Cheat Sheet lists these in detail.",
    detail: [
      "Do not expose more data than needed in responses; shape them explicitly.",
      "Use different keys per environment.",
      "Test with tools and review the OWASP API risks.",
    ],
    ex: "`GET /orders/{id}` checks that the order belongs to the authenticated user before returning it.",
    mistakes: [
      "Checking authentication but not ownership.",
      "Returning whole database rows.",
    ],
    follow: ["What is broken object-level authorisation?"],
    points: [
      "HTTPS and authentication",
      "Per-resource authorisation",
      "Validation and limits",
      "Minimal responses and logging",
    ],
    notes: ["Authorise the object, not just the endpoint."],
    src: [
      [
        "OWASP: REST Security Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html",
      ],
      [
        "OWASP: Authorization Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      ],
    ],
  }),
])
