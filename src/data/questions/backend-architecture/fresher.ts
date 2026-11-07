import { defineQuestions } from "../author"
import { g } from "../brief"

const SB = "https://docs.spring.io/spring-boot/reference"
const SF = "https://docs.spring.io/spring-framework/reference"
const AZ = "https://learn.microsoft.com/en-us/azure/architecture"

export default defineQuestions("backend-architecture", "fresher", [
  g({
    slug: "layered-architecture",
    topic: "Layered architecture",
    d: "easy",
    title: "What is a layered architecture, and which layers does a typical backend have?",
    kw: ["layered architecture", "presentation layer", "business layer", "data access layer", "separation of concerns"],
    intent: "Checks that you can explain the idea and the usual layers.",
    short:
      "A layered architecture divides an application into horizontal layers, each with one responsibility, where a layer depends only on the layer below it. A typical backend has a web or API layer that handles HTTP requests and responses, a service or business layer that holds the rules and the use cases, and a data access layer that talks to the database. This separation of concerns makes the code easier to understand, test and change, because, for example, the database technology can change without touching the web layer. The risk is a layer that only passes calls through, or business logic that leaks into the wrong layer.",
    detail: [
      "The dependency direction is one-way: web → service → data access.",
      "Each layer is tested differently: the service with unit tests, the web layer with request tests, the data layer with a real database.",
      "A domain model can sit in the middle, used by all layers.",
    ],
    ex: "`OrderController` calls `OrderService`, which uses `OrderRepository`, and the controller never touches the database.",
    mistakes: [
      "Letting the web layer call the repository directly and skipping the service.",
      "Letting a lower layer depend on a higher one.",
    ],
    follow: ["What are the problems of a layered design?"],
    points: [
      "Web, service, data access",
      "One-way dependencies",
      "Separation of concerns",
    ],
    notes: "Layers: API → service → data access. Dependencies go downward only.",
    src: [
      ["Microsoft Learn: N-tier architecture style", `${AZ}/guide/architecture-styles/n-tier`],
      ["Spring Boot Reference: Structuring Your Code", `${SB}/using/structuring-your-code.html`],
    ],
  }),
  g({
    slug: "controller-service-repository",
    topic: "Controller-Service-Repository",
    d: "easy",
    title: "What does each of the controller, service and repository do in a Spring application?",
    kw: ["controller", "service", "repository", "@RestController", "@Service"],
    intent: "Checks the standard split of responsibilities and the stereotype annotations.",
    short:
      "The controller, marked `@RestController`, is the HTTP adapter: it receives the request, validates the input shape, calls the service, and turns the result into a response with the right status. The service, marked `@Service`, holds the business logic and the use cases, and defines the transaction boundary. The repository, marked `@Repository` or a Spring Data interface, hides the data access: it loads and saves entities, and nothing else. The controller should have no business rules and no database code, and the repository should have no business rules or HTTP knowledge.",
    detail: [
      "Each class is a bean, and the dependencies are injected through constructors.",
      "A service can call other services, but avoid circular calls between them.",
      "Mapping between request DTOs, entities and response DTOs happens at the edges of the service layer.",
    ],
    ex: "`POST /orders` is received by the controller, `OrderService.place` checks the stock and saves the order, and `OrderRepository` writes the rows.",
    code: [
      "The three classes",
      "@RestController\n@RequestMapping(\"/api/orders\")\nclass OrderController {\n  private final OrderService service;\n  OrderController(OrderService service) { this.service = service; }\n\n  @PostMapping\n  ResponseEntity<OrderDto> place(@Valid @RequestBody PlaceOrder request) {\n    return ResponseEntity.status(HttpStatus.CREATED).body(service.place(request));\n  }\n}\n\n@Service\nclass OrderService {\n  private final OrderRepository orders;\n  OrderService(OrderRepository orders) { this.orders = orders; }\n\n  @Transactional\n  OrderDto place(PlaceOrder request) { /* rules, then orders.save(...) */ return null; }\n}\n\ninterface OrderRepository extends JpaRepository<Order, Long> { }",
      [
        "The controller handles HTTP and delegates.",
        "The service is the transaction and business boundary.",
        "The repository only stores and loads.",
      ],
      "java",
    ],
    mistakes: [
      "Writing business rules in the controller.",
      "Returning entities from the controller.",
    ],
    follow: ["Where does the transaction start?"],
    points: [
      "Controller: HTTP adapter",
      "Service: rules, transactions",
      "Repository: persistence",
    ],
    notes: "Controller = HTTP, Service = business rules + transaction, Repository = data access.",
    src: [
      ["Spring Framework Reference: Classpath Scanning and Managed Components", `${SF}/core/beans/classpath-scanning.html`],
      ["Spring Boot Reference: Structuring Your Code", `${SB}/using/structuring-your-code.html`],
    ],
  }),
  g({
    slug: "thin-controllers",
    topic: "Controller-Service-Repository",
    d: "easy",
    title: "Why should controllers be thin?",
    kw: ["thin controller", "business logic", "testability", "reuse", "single responsibility"],
    intent: "Checks that you keep business rules out of the HTTP layer.",
    short:
      "A controller is an adapter between HTTP and your application, so it should only read the request, check its shape, call one service method, and build the response. If business rules live in the controller, they cannot be reused by other entry points, such as a scheduled job, a message listener or a command-line tool, and they are harder to test, because you need a web request to reach them. Thin controllers keep the rules in services that are plain Java classes, easy to unit test, and keep the controller code about HTTP only: statuses, headers and formats.",
    detail: [
      "A controller method longer than about a dozen lines is a hint that logic should move.",
      "Transactions belong to the service, so that one operation commits or rolls back as a whole.",
      "Cross-cutting concerns, such as error mapping, go into a controller advice.",
    ],
    ex: "A nightly job and the REST endpoint both call `InvoiceService.generate`, so the rule exists once.",
    mistakes: [
      "Calling several repositories from a controller.",
      "Putting calculations or validation of business rules in controller methods.",
    ],
    follow: ["How do you test a thin controller?"],
    points: [
      "HTTP concerns only",
      "Rules in services, reusable",
      "Easier unit tests",
    ],
    notes: "Thin controller: parse, delegate, respond. Business rules live in services.",
    src: [
      ["Spring Framework Reference: Annotated Controllers", `${SF}/web/webmvc/mvc-controller.html`],
      ["Spring Boot Reference: Structuring Your Code", `${SB}/using/structuring-your-code.html`],
    ],
  }),
  g({
    slug: "service-layer-responsibilities",
    topic: "Service separation",
    d: "medium",
    title: "What belongs in the service layer, and how do you keep services focused?",
    kw: ["service layer", "use case", "transaction boundary", "single responsibility", "domain logic"],
    intent: "Checks that you can design services around use cases and avoid a God service.",
    short:
      "The service layer expresses the use cases of the application, such as placing an order or cancelling it. It enforces business rules, coordinates repositories and other services, controls the transaction, and returns results to the caller. To keep services focused, group them by business capability, name methods after the use case, and split a class that has become large or unrelated, which is often called a God service. A service should not know about HTTP, and it should not return database details. If a rule belongs to one entity, put it on the entity itself, rather than spreading it over services.",
    detail: [
      "One service class per aggregate or capability is a common starting point.",
      "A service that depends on many others is a sign that it does too much.",
      "Keep services free of state, so that a single instance can serve all requests.",
    ],
    ex: "`OrderService` handles placing and cancelling orders, and `ShippingService` handles delivery, instead of one `ShopService`.",
    mistakes: [
      "A single service class with dozens of unrelated methods.",
      "Services that return entities with lazy fields to the controller.",
    ],
    follow: ["What is a God service?"],
    points: [
      "Use cases, rules, transactions",
      "Organised by capability",
      "No HTTP knowledge",
    ],
    notes: "Services = use cases + rules + transactions, grouped by capability, no HTTP knowledge.",
    src: [
      ["Spring Framework Reference: @Transactional", `${SF}/data-access/transaction/declarative/annotations.html`],
      ["Spring Boot Reference: Structuring Your Code", `${SB}/using/structuring-your-code.html`],
    ],
  }),
  g({
    slug: "separation-by-feature-vs-layer",
    topic: "Service separation",
    d: "medium",
    title: "Should you organise packages by layer or by feature?",
    kw: ["package by feature", "package by layer", "cohesion", "modular monolith", "package-private"],
    intent: "Checks that you can structure code so that related things stay together.",
    short:
      "Package by layer puts all controllers in one package, all services in another and all repositories in a third. It is easy to start with, but one feature is spread over many packages, and everything must be public so that layers can see each other. Package by feature puts everything that belongs to one capability, its controller, service, repository and entities, in one package, such as `orders` and `customers`. Related code changes together, most classes can be package-private, and a feature can later be extracted into a module or service. Larger applications usually benefit from package by feature.",
    detail: [
      "Spring Boot's guidance is to put the main class in a root package, and the feature packages below it.",
      "Dependencies between feature packages should be few and explicit.",
      "A modular monolith uses this structure to get clear boundaries inside one deployable application.",
    ],
    ex: "The `orders` package has `OrderController`, `OrderService`, `OrderRepository` and `Order`, and only the controller and the service interface are public.",
    mistakes: [
      "Making every class public only so that other layers can reach it.",
      "Cyclic dependencies between feature packages.",
    ],
    follow: ["What is a modular monolith?"],
    points: [
      "By layer: easy start, scattered features",
      "By feature: cohesive, encapsulated",
      "Prefer by feature for larger applications",
    ],
    notes: "Package by feature keeps related code together and allows package-private classes.",
    src: [
      ["Spring Boot Reference: Structuring Your Code", `${SB}/using/structuring-your-code.html`],
      ["Microsoft Learn: Architecture styles", `${AZ}/guide/architecture-styles/`],
    ],
  }),
  g({
    slug: "dependency-direction-and-interfaces",
    topic: "Service separation",
    d: "medium",
    title: "How do interfaces and dependency injection keep layers loosely coupled?",
    kw: ["dependency inversion", "interface", "constructor injection", "loose coupling", "testing"],
    intent: "Checks that you can make parts replaceable and testable.",
    short:
      "When a service depends on an interface, such as `PaymentGateway`, and not on a concrete class, it does not know how the work is done. The implementation is chosen by configuration and injected through the constructor, so you can replace it, for example with a different provider or with a fake in tests, without changing the service. This is the dependency inversion principle, and Spring's dependency injection supports it. Not every class needs an interface: use one at real boundaries, such as external systems, where more than one implementation is possible or where you need a test double.",
    detail: [
      "An interface with a single implementation that never changes only adds indirection.",
      "Spring Data repositories are already interfaces.",
      "Constructor injection makes the dependencies visible and lets fields be final.",
    ],
    ex: "`OrderService` uses `PaymentGateway`, with a Razorpay implementation in production and a fake in tests.",
    mistakes: [
      "Creating an interface for every class by habit.",
      "Creating dependencies with `new` inside services.",
    ],
    follow: ["When is an interface not worth it?"],
    points: [
      "Depend on abstractions at boundaries",
      "Constructor injection",
      "Replaceable in tests",
    ],
    notes: "Interfaces at real boundaries + constructor injection = replaceable, testable parts.",
    src: [
      ["Spring Framework Reference: Dependency Injection", `${SF}/core/beans/dependencies/factory-collaborators.html`],
      ["Microsoft Learn: Anti-corruption Layer pattern", `${AZ}/patterns/anti-corruption-layer`],
    ],
  }),
  g({
    slug: "dto-validation-layers",
    topic: "DTOs & validation",
    d: "medium",
    title: "Where should validation happen: controller, service or database?",
    kw: ["validation", "Bean Validation", "business rule", "constraint", "defence in depth"],
    intent: "Checks that you know each layer validates something different.",
    short:
      "Validate at several layers, each for what it can know. At the edge, the controller checks the shape of the input with Bean Validation on the request DTO: required fields, lengths, formats and ranges, and rejects bad input with `400`. The service enforces business rules that need context, such as whether there is enough stock or whether the user may do this, and signals a violation with a domain exception. The database enforces the final guarantees with constraints, such as `NOT NULL`, unique keys and foreign keys, because it is the only place that sees every writer and every race. Do not rely on one layer alone.",
    detail: [
      "A uniqueness check in code can race, so a unique constraint is still necessary.",
      "Do not trust the client, even if the front end also validates.",
      "Return clear, field-level messages for shape errors.",
    ],
    ex: "A signup is rejected at the edge if the email format is wrong, in the service if the email is banned, and by a unique index if two requests race.",
    mistakes: [
      "Checking only in the front end.",
      "Relying on a service check for uniqueness without a database constraint.",
    ],
    follow: ["Why is a unique index still needed?"],
    points: [
      "Edge: shape (400)",
      "Service: business rules",
      "Database: final guarantees",
    ],
    notes: "Validate shape at the edge, rules in the service, integrity in the database.",
    src: [
      ["Spring Framework Reference: Bean Validation", `${SF}/core/validation/beanvalidation.html`],
      ["Spring Framework Reference: Validation in controller methods", `${SF}/web/webmvc/mvc-controller/ann-validation.html`],
    ],
  }),
  g({
    slug: "dto-mapping-strategies",
    topic: "DTOs & validation",
    d: "medium",
    title: "How do you map between entities and DTOs, and where does the mapping live?",
    kw: ["DTO mapping", "mapper", "MapStruct", "record", "layer boundary"],
    intent: "Checks that you keep the mapping explicit and at the right boundary.",
    short:
      "Map between entities and DTOs at the boundary of the service layer, so that controllers only see DTOs and repositories only see entities. Mapping can be written by hand, in a small mapper class or in static factory methods on the DTO, which is clear and needs no library. For many fields, a generator such as MapStruct creates the mapping code at build time. Use separate DTOs for requests and responses, because they differ, and for each use case that needs a different shape. Never map blindly from a request onto an entity, because a client could then set fields it must not control.",
    detail: [
      "Records are a good fit for DTOs, because they are immutable and short.",
      "Mapping inside a transaction avoids lazy-loading problems, because the data can still be loaded.",
      "Keep the mapping free of business rules.",
    ],
    ex: "`OrderMapper.toDto(order)` creates an `OrderDto` with only the fields that the API promises.",
    code: [
      "A hand-written mapper",
      "record OrderDto(Long id, String status, BigDecimal total) {\n  static OrderDto from(Order order) {\n    return new OrderDto(order.getId(), order.getStatus().name(), order.getTotal());\n  }\n}\n\nrecord PlaceOrder(@NotNull Long productId, @Min(1) int quantity) { }",
      [
        "The response DTO exposes exactly three fields.",
        "The request DTO is separate and carries the validation rules.",
        "The entity never leaves the service layer.",
      ],
      "java",
    ],
    mistakes: [
      "Binding the request directly onto an entity.",
      "Using one DTO for both requests and responses.",
    ],
    follow: ["Why separate request and response DTOs?"],
    points: [
      "Map at the service boundary",
      "Hand-written or generated mappers",
      "Separate request and response DTOs",
    ],
    notes: "Map at the service boundary; separate request/response DTOs; never bind requests onto entities.",
    src: [
      ["Spring Framework Reference: @RequestBody", `${SF}/web/webmvc/mvc-controller/ann-methods/requestbody.html`],
      ["Spring Framework Reference: Annotated Controllers", `${SF}/web/webmvc/mvc-controller.html`],
    ],
  }),
  g({
    slug: "pagination-and-limits-api",
    topic: "DTOs & validation",
    d: "medium",
    title: "How should a list endpoint handle pagination, filtering and limits?",
    kw: ["pagination", "page size limit", "filtering", "sorting", "response envelope"],
    intent: "Checks that an API cannot be made to return unlimited data.",
    short:
      "Never return an unbounded list. Accept paging parameters, such as `page` and `size`, or a cursor, apply a sensible default and a hard maximum for the size, and return the items together with the paging information, such as the total or a link to the next page. Allow filtering and sorting only on fields that you have chosen, and which are indexed, and reject unknown sort fields instead of passing them to the database. Offset paging is simple but slows down for large offsets, while cursor or keyset paging stays fast. Document the limits, so clients know them.",
    detail: [
      "Spring Data's `Pageable` can be bound from request parameters, with a configured maximum page size.",
      "Return `400` for an invalid page or size, or clamp the value and say so.",
      "A stable sort with a tie-breaker, such as the id, avoids duplicates between pages.",
    ],
    ex: "`GET /orders?page=0&size=20&sort=createdAt,desc`, with a maximum size of 100.",
    mistakes: [
      "Returning every row of a large table.",
      "Allowing a sort on any column name from the request.",
    ],
    follow: ["Why can large offsets be slow?"],
    points: [
      "Default and maximum size",
      "Allow-listed filters and sort fields",
      "Cursor paging scales better",
    ],
    notes: "Bound every list: default and max page size, allow-listed sort and filter fields.",
    src: [
      ["Microsoft Learn: Web API design best practices (filtering and paginating)", `${AZ}/best-practices/api-design`],
      ["Microsoft Learn: Web API implementation best practices", `${AZ}/best-practices/api-implementation`],
    ],
  }),
  g({
    slug: "consistent-error-responses",
    topic: "Error handling strategy",
    d: "medium",
    title: "How do you design consistent error handling across a backend?",
    kw: ["error handling", "@RestControllerAdvice", "domain exception", "status codes", "ProblemDetail"],
    intent: "Checks that errors have one shape and one place where they are mapped.",
    short:
      "Services throw domain exceptions that describe what went wrong in business terms, such as `OrderNotFoundException`, and know nothing about HTTP. One `@RestControllerAdvice` maps each exception type to an HTTP status and a standard body: `400` for invalid input, `401` and `403` for authentication and permission problems, `404` for a missing resource, `409` for a conflict, and `500` for the unexpected. Every error uses the same format, ideally Problem Details with a type, title, status and detail. Unexpected errors are logged in full on the server with a correlation id, and only a safe message and that id are returned to the client.",
    detail: [
      "The same exception always gives the same response, which makes the API predictable.",
      "Never return stack traces, SQL or internal class names.",
      "Test the error responses, not only the successful ones.",
    ],
    ex: "A missing order returns `404` with a Problem Details body, and a bug returns `500` with an error id that support can find in the logs.",
    mistakes: [
      "Returning `200` with an error message in the body.",
      "Handling errors differently in every controller.",
    ],
    follow: ["What is Problem Details?"],
    points: [
      "Domain exceptions, one central mapping",
      "Correct 4xx/5xx and one body format",
      "Log details, return a safe message and an id",
    ],
    notes: "Domain exceptions → one `@RestControllerAdvice` → status + standard body; log details, hide internals.",
    src: [
      ["Spring Framework Reference: Error Responses", `${SF}/web/webmvc/mvc-ann-rest-exceptions.html`],
      ["Spring Framework Reference: Controller Advice", `${SF}/web/webmvc/mvc-controller/ann-advice.html`],
    ],
  }),
  g({
    slug: "exception-translation-layers",
    topic: "Error handling strategy",
    d: "hard",
    title: "How should exceptions cross layer boundaries?",
    kw: ["exception translation", "layer boundary", "DataAccessException", "wrapping", "abstraction leak"],
    intent: "Checks that lower-level details do not leak into higher layers.",
    short:
      "Each layer should expose exceptions that make sense at its own level. The data access layer should not leak database-specific errors, so Spring translates them into its `DataAccessException` hierarchy, and a repository can go further by turning a constraint violation into a domain exception such as `DuplicateEmailException`. The service throws domain exceptions about the business rule. The web layer maps them to HTTP. When you wrap an exception, keep the original as the cause so the stack trace is not lost. Do not catch an exception just to log it and rethrow it at every layer, because that produces duplicate logs.",
    detail: [
      "A checked exception that is declared on every method of many layers is a sign that an unchecked one would be simpler.",
      "Handle an exception at the layer that can do something useful about it.",
      "Log once, at the layer that handles it.",
    ],
    ex: "A unique-key violation becomes `DuplicateEmailException` in the service, and the advice maps it to `409`.",
    code: [
      "Translate and keep the cause",
      "try {\n  users.save(user);\n} catch (DataIntegrityViolationException e) {\n  throw new DuplicateEmailException(user.getEmail(), e);   // cause kept\n}",
      [
        "The database-level exception is caught at the layer that understands it.",
        "A domain exception is thrown instead, with the original as its cause.",
      ],
      "java",
    ],
    mistakes: [
      "Letting `SQLException` or JPA exceptions reach the controller.",
      "Logging and rethrowing at every layer.",
    ],
    follow: ["Where should an exception be logged?"],
    points: [
      "Translate to the language of the layer",
      "Keep the cause",
      "Log once where it is handled",
    ],
    notes: "Translate low-level exceptions to domain ones, keep the cause, log once.",
    src: [
      ["Spring Framework Reference: Declarative Transaction Management (rollback rules)", `${SF}/data-access/transaction/declarative/rolling-back.html`],
      ["Spring Framework Reference: Error Responses", `${SF}/web/webmvc/mvc-ann-rest-exceptions.html`],
    ],
  }),
  g({
    slug: "logging-practices-backend",
    topic: "Error handling strategy",
    d: "medium",
    title: "What are good logging practices in a backend service?",
    kw: ["logging", "log levels", "SLF4J", "correlation id", "structured logging"],
    intent: "Checks that logs are useful for diagnosis and safe.",
    short:
      "Use a logging facade such as SLF4J, with Logback as Spring Boot's default, and write messages with placeholders, as in `log.info(\"Order {} placed\", id)`. Choose levels deliberately: `ERROR` for failures that need attention, `WARN` for problems that were handled, `INFO` for important business events, and `DEBUG` for details that you switch on when diagnosing. Include a correlation id in every line, so one request can be followed through the system. Never log passwords, tokens or personal data. Log exceptions with their stack trace, once, and send the logs to a central place instead of reading files on each server.",
    detail: [
      "Structured logs, such as JSON, are easier to search and filter than free text.",
      "Too much logging costs performance and money, and hides the important lines.",
      "Log levels can be changed at run time for a package, to investigate a problem.",
    ],
    ex: "Every log line has a `traceId`, and a search for it shows everything that happened for one failed checkout.",
    mistakes: [
      "Logging secrets or full request bodies with personal data.",
      "Building log strings by concatenation at `DEBUG` level in hot code.",
    ],
    follow: ["What is a correlation id?"],
    points: [
      "Facade + placeholders",
      "Use levels deliberately",
      "Correlation id; no secrets; central collection",
    ],
    notes: "SLF4J with placeholders, meaningful levels, a correlation id, no secrets.",
    src: [
      ["Spring Boot Reference: Logging", `${SB}/features/logging.html`],
      ["Spring Boot Reference: Actuator", `${SB}/actuator/index.html`],
    ],
  }),
  g({
    slug: "twelve-factor-configuration",
    topic: "Configuration & environments",
    d: "medium",
    title: "How should configuration differ between environments?",
    kw: ["externalised configuration", "profiles", "environment variables", "same artifact", "secrets"],
    intent: "Checks that one build runs everywhere with different settings.",
    short:
      "Build the application once and run the same artifact in every environment. The settings that differ, such as database URLs, credentials, API endpoints and feature flags, are kept outside the code and supplied at start-up: through environment variables, mounted files, a configuration server or the platform's own configuration objects. Spring Boot reads these sources in a defined order, so a value in the environment overrides the packaged default. Profiles can switch on environment-specific beans or property files. Secrets must never be committed to the repository, and the application should fail fast at start-up when a required setting is missing.",
    detail: [
      "Keep the number of differences between environments small, so that testing means something.",
      "Validate configuration with `@ConfigurationProperties` and `@Validated`.",
      "Document every setting and its default.",
    ],
    ex: "The same jar runs in test and production, with `SPRING_DATASOURCE_URL` and `SPRING_PROFILES_ACTIVE` set differently.",
    mistakes: [
      "Rebuilding the application for each environment.",
      "Committing production credentials.",
    ],
    follow: ["How does Spring Boot order configuration sources?"],
    points: [
      "One artifact, external configuration",
      "Environment variables and profiles",
      "No secrets in the repository",
    ],
    notes: "Build once, configure from outside (env vars, profiles); validate settings; keep secrets out of git.",
    src: [
      ["Spring Boot Reference: Externalized Configuration", `${SB}/features/external-config.html`],
      ["Spring Boot Reference: Profiles", `${SB}/features/profiles.html`],
    ],
  }),
  g({
    slug: "typed-configuration-validation",
    topic: "Configuration & environments",
    d: "medium",
    title: "How do you read and validate settings in a type-safe way?",
    kw: ["@ConfigurationProperties", "@Validated", "fail fast", "binding", "immutable configuration"],
    intent: "Checks that bad configuration is caught at start-up and not in production traffic.",
    short:
      "Group related settings into a class or a record annotated with `@ConfigurationProperties(prefix = \"app.payments\")`, and Spring Boot binds the properties to it, converting types such as durations and lists. Add `@Validated` and constraint annotations, such as `@NotBlank` and `@Min`, and the application refuses to start when a required value is missing or wrong, which is much better than a failure in the middle of a request. Using a record makes the settings immutable, and the object can be injected wherever it is needed, with no scattered `@Value` strings.",
    detail: [
      "Defaults can be given in the code, and overridden by the environment.",
      "Relaxed binding means that `APP_PAYMENTS_TIMEOUT` can set `app.payments.timeout`.",
      "Do not log sensitive settings.",
    ],
    ex: "The payment client settings, the base URL and the timeout, are one validated record.",
    code: [
      "A validated settings record",
      "@ConfigurationProperties(prefix = \"app.payments\")\n@Validated\nrecord PaymentProperties(\n    @NotBlank String baseUrl,\n    @DefaultValue(\"3s\") Duration timeout) { }",
      [
        "The prefix groups the settings.",
        "`@NotBlank` makes start-up fail if the URL is missing.",
        "The `Duration` is converted from a text such as `3s`.",
      ],
      "java",
    ],
    mistakes: [
      "Scattering `@Value` strings through the code.",
      "Discovering a missing setting only when the first request arrives.",
    ],
    follow: ["What is relaxed binding?"],
    points: [
      "Group settings in one typed class",
      "Validate at start-up",
      "Fail fast",
    ],
    notes: "`@ConfigurationProperties` + `@Validated` = typed, validated settings that fail fast.",
    src: [
      ["Spring Boot Reference: Type-safe Configuration Properties", `${SB}/features/external-config.html`],
      ["Spring Boot Reference: Externalized Configuration", `${SB}/features/external-config.html`],
    ],
  }),
  g({
    slug: "rest-api-design-principles",
    topic: "DTOs & validation",
    d: "easy",
    title: "What are the main principles of good REST API design?",
    kw: ["REST", "resources", "HTTP methods", "status codes", "statelessness"],
    intent: "Checks that you design resource-oriented, predictable APIs.",
    short:
      "Model the API around resources, named with plural nouns, such as `/orders` and `/orders/{id}`, and use the HTTP methods for the actions: `GET` to read, `POST` to create, `PUT` or `PATCH` to change, and `DELETE` to remove. Use the standard status codes with their meaning, such as `201` after creation and `404` for a missing resource. Keep the server stateless, so every request carries what is needed, and make the representations consistent, with the same field names and formats everywhere. Support paging and filtering for collections, and version the API so that it can evolve without breaking clients.",
    detail: [
      "`GET` must be safe, and `PUT` and `DELETE` idempotent.",
      "Use ISO-8601 for dates and a single error format.",
      "Document the API, for example with an OpenAPI description.",
    ],
    ex: "`POST /orders` creates an order and returns `201` with a `Location` header, and `GET /orders/42` returns it.",
    mistakes: [
      "Verbs in URLs, such as `/createOrder`.",
      "Using `200` for every response.",
    ],
    follow: ["Which HTTP methods are idempotent?"],
    points: [
      "Resources and HTTP methods",
      "Correct status codes",
      "Consistency, paging, versioning",
    ],
    notes: "Plural-noun resources, HTTP methods for actions, correct status codes, stateless, consistent.",
    src: [
      ["Microsoft Learn: Web API design best practices", `${AZ}/best-practices/api-design`],
      ["Microsoft Learn: Web API implementation best practices", `${AZ}/best-practices/api-implementation`],
    ],
  }),
  g({
    slug: "caching-in-backend",
    topic: "Configuration & environments",
    d: "medium",
    title: "How does caching work in a Spring backend, and what are its risks?",
    kw: ["@Cacheable", "@CacheEvict", "cache abstraction", "TTL", "stale data"],
    intent: "Checks that you add caching deliberately and handle invalidation.",
    short:
      "Spring's cache abstraction caches the result of a method: `@Cacheable(\"products\")` returns a stored value for the same arguments instead of running the method again, `@CacheEvict` removes entries when the data changes, and `@CachePut` updates an entry. The caching provider, such as an in-memory cache or Redis, is chosen by configuration. The main risks are stale data, so every cache needs an expiry time and an invalidation plan, memory use, so it needs a size limit, and wrong keys. Cache only data that is read much more than it is changed, and measure the hit rate. Like `@Transactional`, it works through proxies, so a call inside the same class bypasses it.",
    detail: [
      "A cache is a copy, and the database remains the source of truth.",
      "Caching per user data needs the user in the key, or it leaks data between users.",
      "A shared cache is needed when there are several application instances.",
    ],
    ex: "A product-details method is cached for ten minutes and evicted when the product is updated.",
    code: [
      "Cache and evict",
      "@Service\nclass ProductService {\n\n  @Cacheable(\"products\")\n  public Product find(long id) { return repository.findById(id).orElseThrow(); }\n\n  @CacheEvict(value = \"products\", key = \"#product.id\")\n  public void update(Product product) { repository.save(product); }\n}",
      [
        "The first `find` for an id runs the method and stores the result.",
        "Later calls with the same id return the cached value.",
        "`update` removes the entry, so that the next read is fresh.",
      ],
      "java",
    ],
    mistakes: [
      "Caching without an expiry or an invalidation rule.",
      "Forgetting that a self-invocation skips the cache.",
    ],
    follow: ["Why must the user be part of the key for per-user data?"],
    points: [
      "@Cacheable, @CacheEvict, @CachePut",
      "Expiry, size limit, invalidation",
      "Proxy-based, same limits as @Transactional",
    ],
    notes: "`@Cacheable` / `@CacheEvict`: set expiry and invalidation; the cache is a copy, not the truth.",
    src: [
      ["Spring Framework Reference: Cache Abstraction", `${SF}/integration/cache.html`],
      ["Microsoft Learn: Cache-Aside pattern", `${AZ}/patterns/cache-aside`],
    ],
  }),
  g({
    slug: "rate-limiting-and-throttling",
    topic: "Error handling strategy",
    d: "medium",
    title: "What are rate limiting and throttling, and why does an API need them?",
    kw: ["rate limiting", "throttling", "429 Too Many Requests", "Retry-After", "abuse protection"],
    intent: "Checks that you protect the service from overload and abuse.",
    short:
      "Rate limiting restricts how many requests a client may make in a period, for example 100 per minute per API key. Throttling slows down or rejects requests when the system is under load. Both protect the service from abuse, from a faulty client that loops, and from overload, and they share capacity fairly among clients. When a client exceeds the limit, return `429 Too Many Requests`, ideally with a `Retry-After` header that says when to try again. Limits are often applied in the API gateway, with different limits for different clients or plans, and the limits should be documented.",
    detail: [
      "Limit by a stable identity, such as the API key or the user, and not only by IP address.",
      "A distributed service needs a shared counter, for example in Redis, so that all instances apply the same limit.",
      "Clients should respect the header and back off.",
    ],
    ex: "A free plan allows 60 requests per minute, and a request over that gets `429` with `Retry-After: 20`.",
    mistakes: [
      "No limits on a public API.",
      "Counting only per server instance when there are several.",
    ],
    follow: ["Where do you usually apply the limit?"],
    points: [
      "Limits per client and period",
      "429 with Retry-After",
      "Shared counters in a cluster",
    ],
    notes: "Rate limit per client; reject with `429` and `Retry-After`; apply at the gateway.",
    src: [
      ["Microsoft Learn: Rate Limiting pattern", `${AZ}/patterns/rate-limiting-pattern`],
      ["Microsoft Learn: Throttling pattern", `${AZ}/patterns/throttling`],
    ],
  }),
  g({
    slug: "stateless-services-and-scaling",
    topic: "Layered architecture",
    d: "medium",
    title: "Why should backend services be stateless, and where does the state go?",
    kw: ["stateless", "horizontal scaling", "session", "external state", "load balancer"],
    intent: "Checks that you can scale a service by adding instances.",
    short:
      "A stateless service keeps no user or request state in its own memory between requests, so any instance can handle any request. That lets a load balancer spread requests freely, instances can be added, removed or restarted at any time, and a crashed instance loses nothing. The state moves to shared systems: durable data in the database, short-lived or shared data in a cache such as Redis, and the identity of the user in a token sent with each request, or in a shared session store. Local in-memory caches are allowed when losing them only costs speed.",
    detail: [
      "Sticky sessions tie users to one instance, which weakens the benefits of scaling.",
      "Singleton beans must not hold per-user fields.",
      "Files written to the local disk disappear with the container, so use shared storage.",
    ],
    ex: "Three identical instances sit behind a load balancer, and a user's cart lives in Redis, so any instance can serve the next request.",
    mistakes: [
      "Storing the logged-in user in a field of a singleton bean.",
      "Depending on files on the local disk of one instance.",
    ],
    follow: ["What are sticky sessions?"],
    points: [
      "No per-user state in memory",
      "State in the database, cache or token",
      "Easy horizontal scaling",
    ],
    notes: "Stateless instances behind a load balancer; keep state in the database, cache or token.",
    src: [
      ["Microsoft Learn: N-tier architecture style", `${AZ}/guide/architecture-styles/n-tier`],
      ["Spring Boot Reference: Servlet Web Applications", `${SB}/web/servlet.html`],
    ],
  }),
  g({
    slug: "transaction-boundaries-design",
    topic: "Service separation",
    d: "medium",
    title: "Where should transaction boundaries be placed in a backend?",
    kw: ["transaction boundary", "@Transactional", "use case", "read-only", "long transaction"],
    intent: "Checks that a transaction matches one business operation.",
    short:
      "A transaction should cover one business operation, so the boundary is the public service method that implements the use case, and not the controller or the individual repository calls. Everything that must succeed or fail together is inside it, for example saving the order and reducing the stock. Keep transactions short, because they hold locks and database connections, and never call a slow external service from inside one. Mark pure reads as `readOnly`. Remember that Spring applies `@Transactional` through proxies, so the call has to come from another bean, and by default only runtime exceptions cause a rollback.",
    detail: [
      "A repository method is transactional on its own, but a use case with several calls needs the service-level transaction.",
      "Sending an email or calling a payment API inside a transaction is risky, because the transaction can still roll back.",
      "Use events or an outbox for the work that must happen only after a commit.",
    ],
    ex: "`placeOrder` is one transaction, and the confirmation email is sent after it commits.",
    mistakes: [
      "Putting `@Transactional` on controllers.",
      "Calling a remote service in the middle of a transaction.",
    ],
    follow: ["How do you send an email only after a commit?"],
    points: [
      "One use case, one transaction",
      "Short, with no remote calls inside",
      "readOnly for reads",
    ],
    notes: "Transaction = one use case at the service layer. Short, no remote calls inside.",
    src: [
      ["Spring Framework Reference: Using @Transactional", `${SF}/data-access/transaction/declarative/annotations.html`],
      ["Spring Framework Reference: Rolling Back", `${SF}/data-access/transaction/declarative/rolling-back.html`],
    ],
  }),
  g({
    slug: "testing-layers",
    topic: "Layered architecture",
    d: "medium",
    title: "How do you test each layer of a backend?",
    kw: ["unit test", "@WebMvcTest", "@DataJpaTest", "Mockito", "integration test"],
    intent: "Checks that you match the test type to the layer.",
    short:
      "Test each layer in the way that suits it. Service classes are plain Java, so unit tests with mocks for their dependencies, using JUnit and Mockito, check the business rules quickly. The web layer is tested with `@WebMvcTest` and `MockMvc`, which load only the controllers, with the services mocked, to check mappings, validation, status codes and JSON. The data layer is tested with `@DataJpaTest` against a real database, preferably the same kind as production, for example in a container, to check queries and mappings. A few `@SpringBootTest` integration tests cover the whole flow. Many fast tests, and few slow ones, give the best feedback.",
    detail: [
      "Do not test the framework. Test your own rules and mappings.",
      "Tests should not depend on each other or on the order of execution.",
      "Use test data builders to keep the set-up readable.",
    ],
    ex: "A unit test checks that an order is rejected when the stock is too low, and a `MockMvc` test checks that the controller returns `409`.",
    mistakes: [
      "Testing everything with slow full-context tests.",
      "Testing only against an in-memory database that behaves differently from production.",
    ],
    follow: ["What does @WebMvcTest load?"],
    points: [
      "Services: unit tests with mocks",
      "Web: @WebMvcTest",
      "Data: @DataJpaTest on a real database type",
    ],
    notes: "Unit-test services, slice-test web and data layers, a few full integration tests.",
    src: [
      ["Spring Boot Reference: Testing", `${SB}/testing/index.html`],
      ["Spring Boot Reference: Testing Spring Boot Applications", `${SB}/testing/spring-boot-applications.html`],
    ],
  }),
  g({
    slug: "modular-monolith",
    topic: "Service separation",
    d: "hard",
    title: "What is a modular monolith, and when is it a better choice than microservices?",
    kw: ["modular monolith", "module boundaries", "single deployment", "encapsulation", "evolution"],
    intent: "Checks that you consider a simpler alternative to microservices.",
    short:
      "A modular monolith is one deployable application whose code is divided into modules with clear boundaries, each module owning its data and exposing a small public interface, so that other modules cannot reach its internals. It gives most of the design benefits of microservices, such as low coupling and clear ownership, without the operational cost of a distributed system: one deployment, local calls, and ordinary transactions. It suits small and medium teams and products whose domain is still being learned. If a module later needs independent scaling or deployment, its clear boundary makes it the natural candidate to extract.",
    detail: [
      "Boundaries must be enforced, for example with package-private classes and architecture tests, or they erode.",
      "Modules communicate through public interfaces or events, and not by reading each other's tables.",
      "It avoids paying for a distributed system before it is needed.",
    ],
    ex: "An application has `orders`, `catalogue` and `billing` modules in one jar, and each module's repository is package-private.",
    mistakes: [
      "Calling a module's internal classes from another module.",
      "Letting modules share tables freely.",
    ],
    follow: ["How do you enforce module boundaries?"],
    points: [
      "One deployment, clear module boundaries",
      "Each module owns its data",
      "Extract a module later if needed",
    ],
    notes: "Modular monolith: strong module boundaries in one deployable. Extract services only when needed.",
    src: [
      ["Microsoft Learn: Architecture styles", `${AZ}/guide/architecture-styles/`],
      ["Spring Boot Reference: Structuring Your Code", `${SB}/using/structuring-your-code.html`],
    ],
  }),
  g({
    slug: "health-and-graceful-operations",
    topic: "Configuration & environments",
    d: "medium",
    title: "What should a production-ready backend provide besides its features?",
    kw: ["production-ready", "Actuator", "health checks", "graceful shutdown", "metrics"],
    intent: "Checks that you think about operating the service and not only writing it.",
    short:
      "A production-ready service can be observed, managed and stopped safely. It exposes health endpoints for the platform, and metrics for monitoring, which Spring Boot Actuator provides. It writes structured logs with a correlation id. It reads its configuration from the environment and validates it at start-up. It handles a shutdown signal gracefully, finishing the requests in progress before it stops, which Spring Boot supports with the graceful shutdown setting. It limits request sizes, timeouts and rates, protects its endpoints with authentication, and has documented runbooks and alerts for the failures that can be expected.",
    detail: [
      "Actuator endpoints must be secured, and only the needed ones exposed.",
      "Test that the service starts, stops and recovers, and not only that its endpoints work.",
      "Version information, such as the build number, helps support to know what is running.",
    ],
    ex: "On a deployment, the old instance stops accepting new requests, finishes the current ones, and then exits.",
    mistakes: [
      "Exposing all Actuator endpoints publicly.",
      "Killing the process while requests are still running.",
    ],
    follow: ["How do you enable graceful shutdown in Spring Boot?"],
    points: [
      "Health and metrics",
      "Graceful shutdown",
      "Limits, security, runbooks",
    ],
    notes: "Production-ready: Actuator health/metrics, graceful shutdown, limits, secured endpoints, alerts.",
    src: [
      ["Spring Boot Reference: Actuator", `${SB}/actuator/index.html`],
      ["Spring Boot Reference: Embedded Web Servers (graceful shutdown)", `${SB}/web/graceful-shutdown.html`],
    ],
  }),
  g({
    slug: "idempotent-api-design",
    topic: "Error handling strategy",
    d: "hard",
    title: "How do you make a create or payment endpoint safe against duplicate requests?",
    kw: ["idempotency key", "duplicate request", "POST", "retry", "unique constraint"],
    intent: "Checks that you design for clients that retry after a timeout.",
    short:
      "A client that does not receive a response, because of a timeout, will often send the request again, and a non-idempotent `POST` can then create two orders or two payments. To prevent it, the client sends a unique idempotency key in a header with the request. The server stores the key with the result, in the same transaction as the business change, protected by a unique constraint. If the same key arrives again, the server returns the stored result instead of repeating the work. Keys are kept long enough to cover realistic retries, and a key reused with a different request body is rejected.",
    detail: [
      "`PUT` and `DELETE` are already idempotent by definition, and `POST` is not.",
      "The unique constraint handles two identical requests that arrive at the same moment.",
      "Document the header and how long keys are remembered.",
    ],
    ex: "A payment request with `Idempotency-Key: 7f3a...` is charged once, and the retry gets the same response.",
    mistakes: [
      "Retrying a `POST` payment without a key.",
      "Checking for the key in code without a unique constraint, which can race.",
    ],
    follow: ["What if the same key comes with a different body?"],
    points: [
      "Client sends a unique key",
      "Server stores key and result transactionally",
      "Repeat returns the stored result",
    ],
    notes: "Idempotency-Key header + stored result + unique constraint = safe retries for `POST`.",
    src: [
      ["Microsoft Learn: Web API implementation best practices", `${AZ}/best-practices/api-implementation`],
      ["Microsoft Learn: Retry pattern", `${AZ}/patterns/retry`],
    ],
  }),
  g({
    slug: "api-documentation-openapi",
    topic: "DTOs & validation",
    d: "easy",
    title: "Why document an API, and what is OpenAPI?",
    kw: ["OpenAPI", "API documentation", "contract", "Swagger", "client generation"],
    intent: "Checks that you treat the API as a contract that others rely on.",
    short:
      "An API is a contract between the people who write it and the people who use it, so it must be documented: the endpoints, the parameters, the request and response bodies, the status codes and the errors. OpenAPI is a standard, machine-readable format for describing REST APIs, in YAML or JSON. From one description, tools can produce interactive documentation, generate client code, create mocks and check that the real API still matches it. Keeping the description in the repository, and updated with the code, stops the documentation from drifting away from the behaviour.",
    detail: [
      "A change to the description is a visible change to the contract, so it can be reviewed.",
      "Examples of requests and responses help clients more than long text.",
      "Describe error responses too, and not only the successful ones.",
    ],
    ex: "The front-end team generates its API client from the OpenAPI file of the backend.",
    mistakes: [
      "Documentation that is written once and never updated.",
      "Describing only the success responses.",
    ],
    follow: ["How do you keep the documentation in sync with the code?"],
    points: [
      "API = contract",
      "OpenAPI: standard machine-readable description",
      "Keep it in the repository and review changes",
    ],
    notes: "Document the API as a contract with OpenAPI; keep it versioned with the code.",
    src: [
      ["Microsoft Learn: Web API design best practices", `${AZ}/best-practices/api-design`],
      ["Microsoft Learn: Web API implementation best practices", `${AZ}/best-practices/api-implementation`],
    ],
  }),
  g({
    slug: "separation-of-config-and-code-secrets",
    topic: "Configuration & environments",
    d: "easy",
    title: "How do you handle secrets, such as database passwords and API keys, in a backend?",
    kw: ["secrets", "environment variables", "secret manager", "rotation", "least privilege"],
    intent: "Checks the basic habits that prevent credential leaks.",
    short:
      "Secrets must never be written in the source code, in a file in the repository, or in a container image, because anyone with access to those can read them, and the history keeps them for good. Supply them at run time from the environment, such as environment variables or mounted files, or from a secret manager that the platform provides, and give the application access only to the secrets that it needs. Rotate them regularly and after any suspected leak, use a different secret in each environment, and keep them out of logs and error messages. A secret that was committed once must be treated as leaked and replaced.",
    detail: [
      "Spring Boot can read a value from an environment variable through a placeholder such as `${DB_PASSWORD}`.",
      "Use a separate database user with minimal rights for the application.",
      "Scanning tools can find secrets that were committed by mistake.",
    ],
    ex: "The container receives `DB_PASSWORD` from the platform's secret store, and the properties file contains only the placeholder.",
    mistakes: [
      "Committing a `.env` file or a properties file with real credentials.",
      "Reusing one credential for all environments.",
    ],
    follow: ["What do you do if a secret was committed?"],
    points: [
      "Never in code, repository or image",
      "Supplied at run time",
      "Rotate, and use one per environment",
    ],
    notes: "Secrets come from the environment or a secret manager; rotate; a committed secret is a leaked secret.",
    src: [
      ["Spring Boot Reference: Externalized Configuration", `${SB}/features/external-config.html`],
      ["Spring Boot Reference: Profiles", `${SB}/features/profiles.html`],
    ],
  }),
])
