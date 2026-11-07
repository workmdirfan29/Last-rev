import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-mvc", {
  slug: "request-mapping",
  title: "Request mapping, parameters and content negotiation",
  topic: "Request mapping",
  minutes: 50,
  overview:
    "Map URLs and HTTP methods to handler methods, read path variables, parameters, headers and cookies, and control media types.",
  objectives: [
    "Use @RequestMapping and the method shortcuts",
    "Read path variables, request parameters, headers and cookies",
    "Use consumes and produces and know 415 and 406",
  ],
  prerequisites: ["lesson.spring-mvc.dispatcher-servlet-and-controllers"],
  sections: [
    {
      kind: "explain",
      heading: "Mapping requests",
      body: [
        "`@RequestMapping` maps a request to a handler method, or to a class, by URL path, HTTP method, headers and media types. On a class it gives a common **prefix**, and on a method the rest of the path. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping` and `@DeleteMapping` are shortcuts with a fixed HTTP method, and make the code clearer. If two methods match the same request, Spring fails at **start-up** with an ambiguous mapping error. A request that matches the path but not the method gets `405 Method Not Allowed`.",
        "`@PathVariable` reads a value from the URL path, as in `/orders/{id}`, and identifies a resource. `@RequestParam` reads a query string parameter or a form field, as in `/orders?status=PAID`, for optional filters, sorting and paging. A request parameter is **required by default**, and fails with `400` when it is missing, unless you set `required = false` or `defaultValue`.",
      ],
    },
    {
      kind: "code",
      heading: "Class and method mapping",
      example: {
        title: "Path variable and parameters",
        language: "java",
        code: '@RestController\n@RequestMapping("/api/users/{userId}/orders")\nclass UserOrderController {\n\n  @GetMapping\n  List<OrderDto> list(\n      @PathVariable long userId,\n      @RequestParam(required = false) String status,\n      @RequestParam(defaultValue = "0") int page) {\n    return service.find(userId, status, page);\n  }\n\n  @GetMapping("/{orderId}")\n  OrderDto get(@PathVariable long userId, @PathVariable long orderId) {\n    return service.find(userId, orderId);\n  }\n}',
        walkthrough: [
          "The class mapping adds the prefix, with the path variable `userId`.",
          "`status` is optional, and `page` defaults to `0`.",
          "A value that cannot be converted, such as `abc` for a `long`, gives `400 Bad Request`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Headers, cookies and media types",
      body: [
        '`@RequestHeader("X-Request-Id") String id` injects a header, and `@CookieValue("theme") String theme` injects a cookie. Both are required by default. To set headers on the response, return a `ResponseEntity`. Never put secrets in a cookie that JavaScript can read, and prefer the `Authorization` header and Spring Security for authentication.',
        "`consumes` limits a mapping to requests whose **`Content-Type`** is one of the given media types, such as `application/json`. A request with another type gets **`415 Unsupported Media Type`**. `produces` limits a mapping to requests whose **`Accept`** header allows the given type, and sets the response `Content-Type`. A request that accepts none of the produced types gets **`406 Not Acceptable`**. This choice of a representation is **content negotiation**, and Spring picks a message converter that can write that type.",
      ],
    },
    {
      kind: "code",
      heading: "Restricting types",
      example: {
        title: "consumes and produces",
        language: "java",
        code: '@PostMapping(\n    value = "/api/orders",\n    consumes = MediaType.APPLICATION_JSON_VALUE,\n    produces = MediaType.APPLICATION_JSON_VALUE)\nResponseEntity<OrderDto> create(\n    @RequestBody CreateOrder request,\n    @RequestHeader(value = "X-Request-Id", required = false) String requestId) {\n  OrderDto created = service.create(request);\n  return ResponseEntity.created(URI.create("/api/orders/" + created.id())).body(created);\n}',
        walkthrough: [
          "Only requests that send JSON are accepted, otherwise `415`.",
          "The response is JSON, and the client's `Accept` header must allow it, otherwise `406`.",
          "`ResponseEntity.created(uri)` returns `201` with a `Location` header.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Mapping two methods to the same path and method.",
          fix: "Make each mapping unique.",
        },
        {
          mistake:
            "Forgetting that a request parameter is required by default.",
          fix: "Set `required = false` or a default.",
        },
        {
          mistake:
            "Putting a filter into the path, or an id into a query parameter.",
          fix: "Ids go in the path, filters in the query.",
        },
        {
          mistake: "Mixing up 415 (request type) and 406 (response type).",
          fix: "415 is Content-Type, 406 is Accept.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A search endpoint",
      scenario:
        "`GET /products?category=pens&sort=price&page=2` must filter, sort and page.",
      body: [
        "Read each as a `@RequestParam` with a default, and put them into a small query object. The product itself is `GET /products/{id}`, with the id as a path variable.",
        "Filters are optional and the resource identity is not.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rm-path-vs-param",
      prompt: "Which should carry the id of a resource?",
      options: ["A path variable", "A request parameter", "A cookie"],
      answer: 0,
      explanation: "Path variables identify, parameters filter.",
    },
    {
      type: "single",
      id: "rm-415",
      prompt:
        "Which status does a request with an unsupported Content-Type get?",
      options: ["415", "406", "404"],
      answer: 0,
      explanation:
        "`406` is for a response type that the client does not accept.",
    },
    {
      type: "truefalse",
      id: "rm-required",
      statement: "A @RequestParam is optional by default.",
      answer: false,
      explanation:
        "It is required by default. Set `required = false` or `defaultValue`.",
    },
    {
      type: "blank",
      id: "rm-produces",
      prompt: "The attribute that restricts the response media type is ___.",
      answer: "produces",
      explanation: "It is matched against the Accept header.",
    },
  ],
  assignment: {
    title: "Map a small API",
    task: [
      "Write controllers for `/api/books` and `/api/books/{id}` with paging parameters, a header and a cookie.",
      "Send a request with a wrong Content-Type and a wrong Accept header, and record the statuses.",
    ],
    checklist: [
      "I received 415 and 406 on purpose",
      "A missing required parameter gives 400",
      "A creation returns 201 with Location",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "rm-ex",
      title: "Write the mappings",
      task: [
        "Write a controller with `GET /api/products/{id}` and `GET /api/products` with optional `category` and `page` (default 0) parameters.",
      ],
      language: "java",
      starter:
        '@RestController\n@RequestMapping("/api/products")\nclass ProductController {\n  // your code\n}',
      solution:
        '@RestController\n@RequestMapping("/api/products")\nclass ProductController {\n  private final ProductService service;\n\n  ProductController(ProductService service) {\n    this.service = service;\n  }\n\n  @GetMapping("/{id}")\n  ProductDto get(@PathVariable long id) {\n    return service.find(id);\n  }\n\n  @GetMapping\n  List<ProductDto> list(\n      @RequestParam(required = false) String category,\n      @RequestParam(defaultValue = "0") int page) {\n    return service.list(category, page);\n  }\n}',
      hints: [
        "The id is a path variable, and the filters are request parameters.",
      ],
      checklist: [
        "The class has a prefix",
        "category is optional",
        "page has a default",
      ],
    },
  ],
  revisionNotes: [
    "`@RequestMapping` + `@GetMapping`...; class prefix, method path",
    "`@PathVariable` identifies; `@RequestParam` filters (required by default)",
    "`consumes` ↔ Content-Type → 415; `produces` ↔ Accept → 406",
    "`@RequestHeader`, `@CookieValue`, `ResponseEntity` for headers",
  ],
  resources: [
    {
      label: "Spring Framework Reference: Request Mapping",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html",
    },
    {
      label: "Spring Framework Reference: @RequestParam",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestparam.html",
    },
    {
      label: "Spring Framework Reference: @RequestHeader",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestheader.html",
    },
  ],
})
