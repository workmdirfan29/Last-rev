import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-mvc", {
  slug: "rest-controllers-and-dtos",
  title: "REST controllers, ResponseEntity and DTOs",
  topic: "REST controllers & DTOs",
  minutes: 60,
  overview:
    "Build a CRUD API with correct status codes, use ResponseEntity, keep entities out of the API with DTOs, and shape JSON.",
  objectives: [
    "Map HTTP methods to CRUD operations with the right statuses",
    "Use ResponseEntity and Location headers",
    "Use DTOs and control JSON with Jackson",
  ],
  prerequisites: ["lesson.spring-mvc.exception-handling-mvc"],
  sections: [
    {
      kind: "explain",
      heading: "A CRUD API",
      body: [
        "Use `@RestController` with a base path for the resource, such as `/api/orders`. `GET /orders` lists, `GET /orders/{id}` reads one, `POST /orders` creates, `PUT /orders/{id}` replaces, `PATCH` changes part of it, and `DELETE /orders/{id}` removes. Use **nouns** for resources, not verbs, and return meaningful **status codes**: `200` for success, `201` with a `Location` header for a creation, `204` for no content, and `404` when a resource is missing. The controller stays **thin** and calls a service. `GET` must not change data, and `PUT` and `DELETE` should be idempotent.",
        "`ResponseEntity<T>` represents the whole HTTP response: status, headers and body. Use it when the status varies at run time, or to set headers. `ResponseEntity.ok(body)`, `created(uri).body(body)`, `noContent().build()` and `notFound().build()` are the usual builders.",
      ],
    },
    {
      kind: "code",
      heading: "CRUD endpoints",
      example: {
        title: "Statuses and Location",
        language: "java",
        code: '@RestController\n@RequestMapping("/api/orders")\nclass OrderController {\n  private final OrderService service;\n\n  OrderController(OrderService service) {\n    this.service = service;\n  }\n\n  @GetMapping("/{id}")\n  ResponseEntity<OrderDto> get(@PathVariable long id) {\n    return service.findOptional(id)\n        .map(ResponseEntity::ok)\n        .orElseGet(() -> ResponseEntity.notFound().build());\n  }\n\n  @PostMapping\n  ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrder request) {\n    OrderDto created = service.create(request);\n    return ResponseEntity.created(URI.create("/api/orders/" + created.id())).body(created);\n  }\n\n  @DeleteMapping("/{id}")\n  @ResponseStatus(HttpStatus.NO_CONTENT)\n  void delete(@PathVariable long id) {\n    service.delete(id);\n  }\n}',
        walkthrough: [
          "`get` chooses between `200` with the order and `404` with no body.",
          "`create` returns `201` with a `Location` header that tells the client where the new resource is.",
          "`delete` returns `204`, and the controller only delegates to the service.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "DTOs, not entities",
      body: [
        "An **entity** is the persistence model. A **DTO** is the model of the API request or response. Exposing entities directly couples the API to the database schema, so a column rename breaks clients. It can **leak fields** such as password hashes, allows clients to set fields they should not (**mass assignment**), can trigger **lazy-loading** errors or extra queries during serialisation, and creates endless loops with bidirectional relations. DTOs, often written as **records**, expose exactly the fields that the API promises.",
        "Use separate **request** and **response** DTOs, because the data to create something often differs from what you return. Map at the edge of the service layer, by hand or with a generator such as MapStruct, and never bind a request directly onto an entity.",
      ],
    },
    {
      kind: "explain",
      heading: "JSON with Jackson",
      body: [
        '`@RequestBody` reads the body with an `HttpMessageConverter`, and Spring Boot uses **Jackson** for JSON. Jackson annotations on a DTO control the JSON: `@JsonProperty("order_id")` sets a name, `@JsonIgnore` leaves a field out, `@JsonInclude(JsonInclude.Include.NON_NULL)` omits null fields, and `@JsonFormat` sets a date format. Application-wide settings go in `spring.jackson.*`.',
        "Write dates in **ISO-8601** format, not as numbers, so clients do not have to guess. Malformed JSON gives `400`, and a missing or wrong `Content-Type` gives `415`.",
      ],
    },
    {
      kind: "code",
      heading: "Request and response DTOs",
      example: {
        title: "Records for the API",
        language: "java",
        code: 'record CreateUserRequest(\n    @NotBlank String name,\n    @Email String email,\n    @Size(min = 8) String password) {\n}\n\n@JsonInclude(JsonInclude.Include.NON_NULL)\nrecord UserDto(\n    long id,\n    String name,\n    String email,\n    @JsonProperty("created_at") Instant createdAt) {\n\n  static UserDto from(User user) {\n    return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());\n  }\n}',
        walkthrough: [
          "The request DTO carries the password and the validation rules.",
          "The response DTO has no password and no internal fields, and its JSON uses `created_at` and omits null fields.",
          "`from` makes the mapping explicit, in one place.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Returning a JPA entity from a controller.",
          fix: "Return a DTO.",
        },
        {
          mistake: "Binding a request body directly to an entity.",
          fix: "Bind to a request DTO and map.",
        },
        {
          mistake: "Using verbs in URLs, such as `/getOrder`.",
          fix: "Use nouns, and the HTTP method for the action.",
        },
        {
          mistake: "Putting business logic in the controller.",
          fix: "Delegate to a service.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A user API",
      scenario:
        "An API creates and reads users, and users have a password hash and internal flags.",
      body: [
        "`CreateUserRequest` accepts the password. `UserDto` returns only the public fields. The service maps between them and the `User` entity, which never leaves the service layer.",
        "A change to the table does not change the API.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rc-created",
      prompt: "Which status do you return after creating a resource?",
      options: ["201 with a Location header", "200", "204"],
      answer: 0,
      explanation:
        "The `Location` header gives the address of the new resource.",
    },
    {
      type: "single",
      id: "rc-dto",
      prompt: "Why return a DTO instead of an entity?",
      options: [
        "It hides internal fields and decouples the API from the schema",
        "DTOs are faster to write",
        "Entities cannot be serialised",
      ],
      answer: 0,
      explanation: "It also avoids lazy-loading problems and mass assignment.",
    },
    {
      type: "truefalse",
      id: "rc-verbs",
      statement: "URLs should contain verbs such as /getOrder.",
      answer: false,
      explanation:
        "Use nouns for resources and the HTTP method for the action.",
    },
    {
      type: "blank",
      id: "rc-nocontent",
      prompt:
        "A successful DELETE usually returns status 204, which means No ___.",
      answer: "Content",
      explanation: "The response has no body.",
    },
  ],
  assignment: {
    title: "Build a CRUD API",
    task: [
      "Build a CRUD API for books with request and response DTOs, `ResponseEntity` where the status varies, and Jackson annotations.",
      "Test it with MockMvc for 200, 201, 204 and 404.",
    ],
    checklist: [
      "No entity is returned",
      "Creation returns Location",
      "Each status is tested",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "rc-ex",
      title: "Return the right status",
      task: [
        "Write a controller method `GET /api/books/{id}` that returns `200` with the DTO when the book exists, and `404` when it does not, using `Optional`.",
      ],
      language: "java",
      starter:
        '@GetMapping("/api/books/{id}")\nResponseEntity<BookDto> get(@PathVariable long id) {\n  // your code\n}',
      solution:
        '@GetMapping("/api/books/{id}")\nResponseEntity<BookDto> get(@PathVariable long id) {\n  return service.findBook(id)\n      .map(ResponseEntity::ok)\n      .orElseGet(() -> ResponseEntity.notFound().build());\n}',
      hints: ["Use `map(ResponseEntity::ok)` and `orElseGet`."],
      checklist: [
        "200 for a present book",
        "404 for a missing book",
        "No null check",
      ],
    },
  ],
  revisionNotes: [
    "HTTP method = operation; 201 + Location, 204, 404; nouns in URLs; thin controllers",
    "`ResponseEntity` = status + headers + body",
    "Request and response DTOs; never expose entities; map at the service edge",
    "Jackson annotations; ISO-8601 dates; `spring.jackson.*`",
  ],
  resources: [
    {
      label: "Spring Framework Reference: ResponseEntity",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responseentity.html",
    },
    {
      label: "Spring Framework Reference: @RequestBody",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html",
    },
    {
      label: "Spring Framework Reference: Jackson JSON",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/jackson.html",
    },
  ],
})
