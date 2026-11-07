import { defineQuestions } from "../author"
import { g } from "../brief"

const W = "https://docs.spring.io/spring-framework/reference/web/webmvc"
const C = `${W}/mvc-controller`
const M = `${C}/ann-methods`

export default defineQuestions("spring-mvc", "fresher", [
  g({
    slug: "dispatcher-servlet-flow",
    topic: "Controllers",
    d: "medium",
    title: "How does Spring MVC handle a request? What is the `DispatcherServlet`?",
    kw: ["DispatcherServlet", "front controller", "HandlerMapping", "HandlerAdapter", "ViewResolver"],
    intent: "Checks that you can trace a request through the framework.",
    short:
      "Spring MVC is built on the front controller pattern. The `DispatcherServlet` receives every request first. It asks the `HandlerMapping` which controller method should handle the request, and calls it through a `HandlerAdapter`, which resolves the method's arguments, such as path variables and the request body. The controller returns a view name or a body. For a view, the `ViewResolver` finds the template and renders it, and for a REST response, an `HttpMessageConverter` writes the returned object as JSON. Interceptors and exception resolvers take part in this flow.",
    detail: [
      "Spring Boot configures and registers the `DispatcherServlet` for you.",
      "Filters run before the `DispatcherServlet`, and interceptors run inside it, around the handler.",
      "Exceptions thrown by the handler are given to `HandlerExceptionResolver` beans, such as the one that handles `@ExceptionHandler`.",
    ],
    ex: "A `GET /orders/5` request is mapped to `OrderController.get(5)`, whose return value is converted to JSON.",
    mistakes: [
      "Describing the controller as the first thing that receives the request.",
      "Mixing up filters (servlet level) and interceptors (Spring MVC level).",
    ],
    follow: ["What is the difference between a filter and an interceptor?"],
    points: [
      "Front controller: DispatcherServlet",
      "HandlerMapping → HandlerAdapter → controller",
      "ViewResolver or message converter for the response",
    ],
    notes: "DispatcherServlet → HandlerMapping → controller method → view or message converter.",
    src: [
      ["Spring Framework Reference: DispatcherServlet", `${W}/mvc-servlet.html`],
      ["Spring Framework Reference: Processing Sequence", `${W}/mvc-servlet/sequence.html`],
    ],
  }),
  g({
    slug: "controller-vs-restcontroller",
    topic: "Controllers",
    d: "easy",
    title: "What is the difference between `@Controller` and `@RestController`?",
    kw: ["@Controller", "@RestController", "@ResponseBody", "view", "JSON"],
    intent: "Checks one of the most common Spring MVC questions.",
    short:
      "`@Controller` marks a web class whose handler methods normally return a view name, which the view resolver turns into an HTML page. `@RestController` is a shortcut for `@Controller` plus `@ResponseBody`: every method's return value is written straight to the response body, converted to JSON or another format by a message converter, with no view involved. So use `@Controller` for server-rendered pages, and `@RestController` for APIs.",
    detail: [
      "In a `@Controller`, you can still return data from one method by adding `@ResponseBody` to it.",
      "`@RestController` applies to the whole class.",
      "Returning `ResponseEntity` gives control of the status code and headers in both cases.",
    ],
    ex: "`PageController` returns `\"orders\"` to render `orders.html`, and `OrderApi` returns an `OrderDto` as JSON.",
    code: [
      "A view and a JSON response",
      "@Controller\nclass PageController {\n  @GetMapping(\"/orders\")\n  String page(Model model) {\n    model.addAttribute(\"title\", \"Orders\");\n    return \"orders\";            // view name\n  }\n}\n\n@RestController\nclass OrderApi {\n  @GetMapping(\"/api/orders/{id}\")\n  OrderDto get(@PathVariable long id) {\n    return new OrderDto(id, \"PAID\");   // written as JSON\n  }\n}",
      [
        "`PageController` returns a view name, and a template is rendered.",
        "`OrderApi` returns an object, and a message converter writes JSON.",
      ],
      "java",
    ],
    mistakes: [
      "Using `@Controller` for an API and getting a view-not-found error.",
      "Using `@RestController` and returning a view name that appears as plain text.",
    ],
    follow: ["What does @ResponseBody do?"],
    points: [
      "@Controller: views",
      "@RestController = @Controller + @ResponseBody",
      "APIs use @RestController",
    ],
    notes: "`@RestController` = `@Controller` + `@ResponseBody` on every method.",
    src: [
      ["Spring Framework Reference: @RestController", `${C}/ann.html`],
      ["Spring Framework Reference: @ResponseBody", `${M}/responsebody.html`],
    ],
  }),
  g({
    slug: "handler-method-arguments",
    topic: "Controllers",
    d: "easy",
    title: "Which arguments and return types can a controller method have?",
    kw: ["handler method", "@RequestBody", "Model", "Principal", "ResponseEntity"],
    intent: "Checks that you know how much Spring MVC resolves for you.",
    short:
      "A handler method can declare many argument types and Spring resolves them: annotated values such as `@PathVariable`, `@RequestParam`, `@RequestHeader` and `@RequestBody`, objects like `HttpServletRequest`, `Principal`, `Locale` and `Model`, and a `BindingResult` after a validated argument. Return values can be a view name, an object written as the response body, a `ResponseEntity` with status and headers, `void`, or asynchronous types such as `Callable` and `CompletableFuture`. The framework converts types, for example a numeric path segment into a `long`.",
    detail: [
      "The order of arguments is free, except that `BindingResult` must directly follow the validated object.",
      "Prefer the specific annotations over reading the raw request object.",
      "Unresolvable argument types cause an error when the handler is invoked.",
    ],
    ex: "`search(@RequestParam String q, @RequestHeader(\"X-Request-Id\") String id, Principal user)` receives three kinds of input.",
    mistakes: [
      "Taking `HttpServletRequest` and parsing parameters by hand.",
      "Putting `BindingResult` in the wrong position in the argument list.",
    ],
    follow: ["What does BindingResult hold?"],
    points: [
      "Annotated arguments are resolved by Spring",
      "Return a view, an object or a ResponseEntity",
      "Conversion is automatic",
    ],
    notes: "Handler methods take annotated and framework arguments, and return a view, a body or `ResponseEntity`.",
    src: [
      ["Spring Framework Reference: Method Arguments", `${M}/arguments.html`],
      ["Spring Framework Reference: Return Values", `${M}/return-types.html`],
    ],
  }),
  g({
    slug: "filters-vs-interceptors",
    topic: "Controllers",
    d: "medium",
    title: "What is the difference between a servlet filter and a Spring MVC interceptor?",
    kw: ["Filter", "HandlerInterceptor", "preHandle", "postHandle", "afterCompletion"],
    intent: "Checks that you know where each runs and what it can see.",
    short:
      "A servlet `Filter` is part of the servlet container: it runs before the request reaches the `DispatcherServlet`, and after the response leaves it, for every request, including static resources. It works only with the raw request and response. A `HandlerInterceptor` is part of Spring MVC: it runs inside the `DispatcherServlet`, around the controller method, with `preHandle`, `postHandle` and `afterCompletion`, and it knows which handler is going to run. Use a filter for low-level concerns such as logging requests, security or compression, and an interceptor for logic that depends on the matched handler.",
    detail: [
      "`preHandle` can stop the request by returning `false`.",
      "Filters are ordered with the `@Order` annotation or a registration bean.",
      "Spring Security itself is implemented as a chain of filters.",
    ],
    ex: "A filter adds a correlation id to every request, and an interceptor measures the time of controller methods.",
    mistakes: [
      "Using an interceptor to handle requests that never reach Spring MVC.",
      "Doing heavy work in `preHandle` for every request.",
    ],
    follow: ["Where does Spring Security hook in?"],
    points: [
      "Filter: servlet level, before DispatcherServlet",
      "Interceptor: MVC level, around the handler",
      "Interceptors know the handler",
    ],
    notes: "Filter = servlet container, raw request. Interceptor = Spring MVC, knows the handler.",
    src: [
      ["Spring Framework Reference: Interception", `${W}/mvc-servlet/handlermapping-interceptor.html`],
      ["Spring Framework Reference: Filters", `${W}/filters.html`],
    ],
  }),
  g({
    slug: "data-binding-and-model-attribute",
    topic: "Controllers",
    d: "medium",
    title: "How does data binding work with `@ModelAttribute` and type conversion?",
    kw: ["@ModelAttribute", "data binding", "type conversion", "@InitBinder", "form object"],
    intent: "Checks that you know how form fields become objects.",
    short:
      "For a form submission or query parameters, Spring creates an object of the parameter's type and binds the request parameters to its properties by name. This is data binding, and `@ModelAttribute` makes it explicit, though it is applied by default to a simple object parameter without other annotations. Spring converts text into the target types, such as numbers and dates, using registered converters and formatters. `@InitBinder` methods customise binding for a controller, for example a date format. Binding errors are collected in a `BindingResult`.",
    detail: [
      "Binding to an entity directly can let a client set fields that it should not, so bind to a form object or DTO.",
      "`@RequestBody` is different: it converts a JSON body with a message converter, not by parameter names.",
      "A `Converter` or `Formatter` bean adds support for your own types.",
    ],
    ex: "A search form posts `name` and `minPrice`, and Spring fills a `SearchForm` object with them.",
    code: [
      "Binding a form object",
      "record SearchForm(String name, Integer minPrice) { }\n\n@Controller\nclass SearchController {\n  @GetMapping(\"/search\")\n  String search(@ModelAttribute SearchForm form, Model model) {\n    model.addAttribute(\"results\", service.find(form.name(), form.minPrice()));\n    return \"results\";\n  }\n}",
      [
        "Parameters such as `?name=pen&minPrice=10` are bound to the record by name.",
        "`minPrice` is converted from text to `Integer`.",
        "The form object is also added to the model for the view.",
      ],
      "java",
    ],
    mistakes: [
      "Binding request parameters directly to a persistent entity.",
      "Confusing `@ModelAttribute` (parameters) with `@RequestBody` (body).",
    ],
    follow: ["What is the difference between @ModelAttribute and @RequestBody?"],
    points: [
      "Parameters bound by name",
      "Converters and formatters handle types",
      "Use a form object, not an entity",
    ],
    notes: "`@ModelAttribute` binds request parameters to an object; `@RequestBody` converts the body.",
    src: [
      ["Spring Framework Reference: @ModelAttribute", `${M}/modelattrib-method-args.html`],
      ["Spring Framework Reference: Type Conversion", `${M}/typeconversion.html`],
    ],
  }),
  g({
    slug: "request-mapping-annotations",
    topic: "Request mapping",
    d: "easy",
    title: "What is `@RequestMapping`, and what are `@GetMapping` and `@PostMapping`?",
    kw: ["@RequestMapping", "@GetMapping", "@PostMapping", "HTTP method", "URL mapping"],
    intent: "Checks that you can map URLs and HTTP methods to methods.",
    short:
      "`@RequestMapping` maps a request to a handler method, or to a class, by URL path, HTTP method, headers and media types. On a class it gives a common prefix, and on a method the rest of the path. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping` and `@DeleteMapping` are shortcuts for `@RequestMapping` with a fixed HTTP method, and they make code shorter and clearer. If two methods match the same request, Spring fails at start-up with an ambiguous mapping error.",
    detail: [
      "`@RequestMapping(\"/orders\")` on the class combines with `@GetMapping(\"/{id}\")` on a method into `/orders/{id}`.",
      "Patterns can use wildcards, but explicit paths are easier to maintain.",
      "A request that matches the path but not the method gets `405 Method Not Allowed`.",
    ],
    ex: "`OrderController` has `@RequestMapping(\"/api/orders\")` and separate methods for `GET`, `POST` and `DELETE`.",
    code: [
      "Class and method mapping",
      "@RestController\n@RequestMapping(\"/api/orders\")\nclass OrderController {\n\n  @GetMapping\n  List<OrderDto> list() { return service.all(); }\n\n  @GetMapping(\"/{id}\")\n  OrderDto get(@PathVariable long id) { return service.find(id); }\n\n  @PostMapping\n  ResponseEntity<OrderDto> create(@RequestBody OrderDto dto) { /* ... */ return null; }\n}",
      [
        "The class mapping adds the `/api/orders` prefix.",
        "`@GetMapping` with no path handles the collection, and `/{id}` handles one order.",
        "`@PostMapping` handles creation.",
      ],
      "java",
    ],
    mistakes: [
      "Mapping two methods to the same path and method.",
      "Using `@RequestMapping` without a method for an action that should only accept `POST`.",
    ],
    follow: ["What status does a wrong HTTP method give?"],
    points: [
      "Maps path, method, headers and media types",
      "Shortcut annotations per HTTP method",
      "Class-level prefix",
    ],
    notes: "`@RequestMapping` on the class for the prefix, `@GetMapping` etc. on methods.",
    src: [
      ["Spring Framework Reference: Request Mapping", `${C}/ann-requestmapping.html`],
      ["Spring Framework Reference: Annotated Controllers", `${C}/ann.html`],
    ],
  }),
  g({
    slug: "pathvariable-vs-requestparam",
    topic: "Request mapping",
    d: "easy",
    title: "What is the difference between `@PathVariable` and `@RequestParam`?",
    kw: ["@PathVariable", "@RequestParam", "query string", "URI template", "required"],
    intent: "Checks that you pick the right input style for an API.",
    short:
      "`@PathVariable` reads a value from a part of the URL path that is marked in the mapping, as in `/orders/{id}`, and is used to identify a specific resource. `@RequestParam` reads a query string parameter or a form field, as in `/orders?status=PAID&page=2`, and is used for optional filters, sorting and paging. A request parameter is required by default and fails with `400` when it is missing, unless you set `required = false` or give a `defaultValue`. Both convert the text to the declared type.",
    detail: [
      "Use path variables for the identity of a resource, and parameters for how to view a collection.",
      "A value that cannot be converted, such as `abc` for a `long`, gives a `400 Bad Request`.",
      "Without a name in the annotation, Spring uses the parameter name if the code is compiled with parameter names, which Spring Boot builds do.",
    ],
    ex: "`GET /users/42/orders?status=PAID` uses `42` as a path variable and `status` as a request parameter.",
    code: [
      "Both in one method",
      "@GetMapping(\"/users/{userId}/orders\")\nList<OrderDto> orders(\n    @PathVariable long userId,\n    @RequestParam(required = false) String status,\n    @RequestParam(defaultValue = \"0\") int page) {\n  return service.find(userId, status, page);\n}",
      [
        "`userId` comes from the path and identifies the user.",
        "`status` is optional, and `page` defaults to `0`.",
      ],
      "java",
    ],
    mistakes: [
      "Putting a filter into the path, or an identifier into a query parameter.",
      "Forgetting that a request parameter is required by default.",
    ],
    follow: ["What happens if a required parameter is missing?"],
    points: [
      "Path variable: identity",
      "Request parameter: filters and options",
      "Required by default",
    ],
    notes: "`@PathVariable` for ids in the path, `@RequestParam` for query options.",
    src: [
      ["Spring Framework Reference: URI Patterns", `${C}/ann-requestmapping.html`],
      ["Spring Framework Reference: @RequestParam", `${M}/requestparam.html`],
    ],
  }),
  g({
    slug: "consumes-produces-content-negotiation",
    topic: "Request mapping",
    d: "medium",
    title: "What do `consumes` and `produces` mean, and how does content negotiation work?",
    kw: ["consumes", "produces", "Content-Type", "Accept", "content negotiation"],
    intent: "Checks that you connect mappings with HTTP headers.",
    short:
      "`consumes` limits a mapping to requests whose `Content-Type` is one of the given media types, such as `application/json`. A request with another type gets `415 Unsupported Media Type`. `produces` limits a mapping to requests whose `Accept` header allows the given response type, and sets the response `Content-Type`. A request that accepts none of the produced types gets `406 Not Acceptable`. Content negotiation is the process of choosing the representation from the `Accept` header, and Spring picks a message converter that can write that type.",
    detail: [
      "A `JSON` body needs a `Content-Type: application/json` header from the client.",
      "Spring Boot supports JSON through Jackson by default, and other formats by adding converters.",
      "Narrow mappings give clear errors, but most APIs just use JSON.",
    ],
    ex: "An endpoint with `produces = \"application/json\"` answers `406` to a client that asks only for `application/xml`.",
    code: [
      "Restricting types",
      "@PostMapping(\n    value = \"/api/orders\",\n    consumes = MediaType.APPLICATION_JSON_VALUE,\n    produces = MediaType.APPLICATION_JSON_VALUE)\nOrderDto create(@RequestBody OrderDto dto) {\n  return service.create(dto);\n}",
      [
        "Only requests sending JSON are accepted.",
        "The response is JSON, and the client's `Accept` must allow it.",
      ],
      "java",
    ],
    mistakes: [
      "Mixing up `415` (request type) and `406` (response type).",
      "Sending JSON from a client without the `Content-Type` header.",
    ],
    follow: ["Which message converter writes JSON?"],
    points: [
      "consumes ↔ Content-Type → 415",
      "produces ↔ Accept → 406",
      "Message converters write the body",
    ],
    notes: "`consumes` = request Content-Type (415). `produces` = response type vs Accept (406).",
    src: [
      ["Spring Framework Reference: Consumable Media Types", `${C}/ann-requestmapping.html`],
      ["Spring Framework Reference: Producible Media Types", `${C}/ann-requestmapping.html`],
    ],
  }),
  g({
    slug: "headers-and-cookies",
    topic: "Request mapping",
    d: "easy",
    title: "How do you read request headers and cookies in a controller?",
    kw: ["@RequestHeader", "@CookieValue", "HttpHeaders", "header", "cookie"],
    intent: "Checks that you can access the non-body parts of a request.",
    short:
      "`@RequestHeader(\"X-Request-Id\") String id` injects a header value, and `@RequestHeader HttpHeaders headers` injects all of them. `@CookieValue(\"theme\") String theme` injects a cookie. As with request parameters, they are required by default, and `required = false` or `defaultValue` make them optional. A mapping can also be restricted by header with `headers = \"...\"`. To set headers or cookies on the response, return a `ResponseEntity` with headers, or write to `HttpServletResponse`.",
    detail: [
      "Header names are case-insensitive.",
      "Do not put secrets in a cookie that JavaScript can read. Use `HttpOnly` and `Secure` flags.",
      "Prefer the `Authorization` header and Spring Security for authentication, not custom headers.",
    ],
    ex: "A controller reads a correlation id from `X-Request-Id`, and a language preference from a cookie.",
    code: [
      "Reading and setting",
      "@GetMapping(\"/profile\")\nResponseEntity<String> profile(\n    @RequestHeader(value = \"X-Request-Id\", required = false) String requestId,\n    @CookieValue(value = \"theme\", defaultValue = \"light\") String theme) {\n  return ResponseEntity.ok()\n      .header(\"X-Theme-Used\", theme)\n      .body(\"request \" + requestId);\n}",
      [
        "The header is optional, and the cookie has a default.",
        "The response sets its own header with `ResponseEntity`.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting that a missing required header returns `400`.",
      "Setting a sensitive cookie without `HttpOnly` and `Secure`.",
    ],
    follow: ["How do you set a cookie in the response?"],
    points: [
      "@RequestHeader and @CookieValue",
      "Required by default",
      "ResponseEntity sets response headers",
    ],
    notes: "`@RequestHeader` and `@CookieValue` inject values; `ResponseEntity` sets response headers.",
    src: [
      ["Spring Framework Reference: @RequestHeader", `${M}/requestheader.html`],
      ["Spring Framework Reference: @CookieValue", `${M}/cookievalue.html`],
    ],
  }),
  g({
    slug: "bean-validation-basics",
    topic: "Validation",
    d: "easy",
    title: "How do you validate a request body in Spring MVC? (`@Valid`)",
    kw: ["@Valid", "Bean Validation", "@NotBlank", "@Size", "MethodArgumentNotValidException"],
    intent: "Checks that you can reject invalid input at the edge of the application.",
    short:
      "Add Bean Validation constraints to the fields of the request DTO, such as `@NotBlank`, `@Size`, `@Email`, `@Min` and `@NotNull`, and put `@Valid` before the `@RequestBody` parameter. Spring then validates the object after binding, and if there are violations, it throws `MethodArgumentNotValidException`, which by default produces a `400 Bad Request`. Validation at the controller keeps bad data away from the services, but the service layer must still protect its own rules. Spring Boot needs the validation starter on the classpath.",
    detail: [
      "The constraint annotations come from Jakarta Bean Validation, with Hibernate Validator as the implementation.",
      "Each constraint accepts a `message`, which can be shown to the client.",
      "Validation checks the shape of the data, and business rules such as \"the stock is enough\" belong in the service.",
    ],
    ex: "A signup request with a blank name or an invalid email is rejected with `400`, before any service code runs.",
    code: [
      "A validated DTO",
      "record SignupRequest(\n    @NotBlank String name,\n    @Email @NotBlank String email,\n    @Size(min = 8) String password) { }\n\n@PostMapping(\"/signup\")\nResponseEntity<Void> signup(@Valid @RequestBody SignupRequest request) {\n  service.register(request);\n  return ResponseEntity.status(HttpStatus.CREATED).build();\n}",
      [
        "The constraints describe the valid shape of the data.",
        "`@Valid` triggers validation before the method body runs.",
        "A violation produces a `400` response, and the method is not called.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting `@Valid`, so that the constraints are never checked.",
      "Relying on controller validation only, and trusting data inside the services.",
    ],
    follow: ["What exception is thrown on a validation failure?"],
    points: [
      "Constraint annotations on the DTO",
      "@Valid on the parameter",
      "Violation → 400",
    ],
    notes: "Constraints on the DTO + `@Valid @RequestBody` → `MethodArgumentNotValidException` → 400.",
    src: [
      ["Spring Framework Reference: Bean Validation", "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html"],
      ["Spring Framework Reference: Validation (Controller methods)", `${C}/ann-validation.html`],
    ],
  }),
  g({
    slug: "valid-vs-validated",
    topic: "Validation",
    d: "medium",
    title: "What is the difference between `@Valid` and `@Validated`?",
    kw: ["@Valid", "@Validated", "validation groups", "method validation", "class-level"],
    intent: "Checks that you know where each annotation comes from and what it adds.",
    short:
      "`@Valid` is the standard Jakarta annotation. It triggers validation of an object and cascades into nested objects marked with `@Valid`. `@Validated` is Spring's variant. It can be placed on a class, to turn on method-level validation of the parameters of its methods, such as `@RequestParam @Min(1) int page`, and it supports validation groups, which apply different sets of constraints in different situations, such as creating and updating. For a plain request body, either works. Use `@Valid` for nesting, and `@Validated` for groups and class-level method validation.",
    detail: [
      "Nested objects need `@Valid` on the field, or their constraints are ignored.",
      "A failed constraint on a simple parameter gives a `ConstraintViolationException` or, in newer Spring versions, a `HandlerMethodValidationException`.",
      "Groups are marker interfaces, and each constraint lists the groups it belongs to.",
    ],
    ex: "A `User` DTO requires an `id` when updating, but not when creating, which is done with two groups.",
    code: [
      "Groups and nested validation",
      "interface OnCreate { }\ninterface OnUpdate { }\n\nrecord UserDto(\n    @Null(groups = OnCreate.class) @NotNull(groups = OnUpdate.class) Long id,\n    @NotBlank String name,\n    @Valid AddressDto address) { }\n\n@PutMapping(\"/users/{id}\")\nUserDto update(@Validated(OnUpdate.class) @RequestBody UserDto dto) { return dto; }",
      [
        "The `id` rule depends on the group.",
        "`@Valid` on `address` makes validation go into the nested object.",
        "`@Validated(OnUpdate.class)` selects the update rules.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting `@Valid` on a nested object.",
      "Expecting `@Valid` to support groups.",
    ],
    follow: ["How do you validate a @RequestParam?"],
    points: [
      "@Valid: standard, cascades",
      "@Validated: Spring, groups and class-level",
      "Mark nested objects with @Valid",
    ],
    notes: "`@Valid` = standard and cascading. `@Validated` = Spring, groups and method validation.",
    src: [
      ["Spring Framework Reference: Bean Validation", "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html"],
      ["Spring Framework Reference: Validation (Controller methods)", `${C}/ann-validation.html`],
    ],
  }),
  g({
    slug: "handling-validation-errors",
    topic: "Validation",
    d: "medium",
    title: "How do you return clear validation errors to the client?",
    kw: ["BindingResult", "MethodArgumentNotValidException", "field errors", "@ExceptionHandler", "error response"],
    intent: "Checks that you turn a framework exception into a useful API response.",
    short:
      "For form-style controllers, you can add a `BindingResult` right after the validated parameter and inspect `hasErrors()` yourself. For REST APIs, a better way is a central handler, an `@ExceptionHandler` for `MethodArgumentNotValidException` in a `@RestControllerAdvice`. It reads the field errors, and returns a `400` with a consistent body that lists each field with its message, so the client can show errors next to the form fields. Do not return internal details such as class names or stack traces.",
    detail: [
      "`ex.getBindingResult().getFieldErrors()` gives the field name and the default message of each error.",
      "A consistent error format, such as Problem Details, makes it easy for clients to handle.",
      "Write the messages for users, and avoid exposing the internal property names if they differ from the API names.",
    ],
    ex: "The response to an invalid signup lists `email: must be a well-formed email address` and `password: size must be at least 8`.",
    code: [
      "A central validation handler",
      "@RestControllerAdvice\nclass ApiExceptionHandler {\n\n  @ExceptionHandler(MethodArgumentNotValidException.class)\n  ResponseEntity<Map<String, String>> invalid(MethodArgumentNotValidException ex) {\n    Map<String, String> errors = new LinkedHashMap<>();\n    ex.getBindingResult().getFieldErrors()\n        .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));\n    return ResponseEntity.badRequest().body(errors);\n  }\n}",
      [
        "The handler is applied to every controller.",
        "It collects each field and its message.",
        "The response is a `400` with a map of field errors.",
      ],
      "java",
    ],
    mistakes: [
      "Returning the default error page or a stack trace for a validation failure.",
      "Using a different error format in every controller.",
    ],
    follow: ["What is a @RestControllerAdvice?"],
    points: [
      "BindingResult for forms",
      "Central handler for APIs",
      "Consistent 400 body with field errors",
    ],
    notes: "Handle `MethodArgumentNotValidException` centrally and return field → message.",
    src: [
      ["Spring Framework Reference: @ExceptionHandler", `${C}/ann-exceptionhandler.html`],
      ["Spring Framework Reference: Controller Advice", `${C}/ann-advice.html`],
    ],
  }),
  g({
    slug: "custom-validation-constraint",
    topic: "Validation",
    d: "hard",
    title: "How do you write a custom validation annotation?",
    kw: ["ConstraintValidator", "custom constraint", "@Constraint", "validator", "Bean Validation"],
    intent: "Checks that you can extend validation beyond the built-in constraints.",
    short:
      "Create an annotation marked with `@Constraint(validatedBy = ...)` that has the required `message`, `groups` and `payload` attributes. Then write a class that implements `ConstraintValidator<MyAnnotation, FieldType>` with an `isValid` method that returns `true` when the value is acceptable. Spring creates the validator as a bean, so it can inject other beans, for example a repository for a unique-email check. Treat `null` as valid in the validator and let `@NotNull` decide on presence, so the constraints can be combined.",
    detail: [
      "A class-level constraint can compare several fields, such as `password` and `confirmPassword`.",
      "A uniqueness check against the database is only advisory, because a race is still possible, so keep a unique index too.",
      "Keep validators fast and free of side effects.",
    ],
    ex: "A `@StrongPassword` annotation checks length and character classes in one reusable place.",
    code: [
      "A custom constraint",
      "@Target({ElementType.FIELD, ElementType.PARAMETER})\n@Retention(RetentionPolicy.RUNTIME)\n@Constraint(validatedBy = IndianPincodeValidator.class)\n@interface IndianPincode {\n  String message() default \"must be a 6-digit pincode\";\n  Class<?>[] groups() default {};\n  Class<? extends Payload>[] payload() default {};\n}\n\nclass IndianPincodeValidator implements ConstraintValidator<IndianPincode, String> {\n  public boolean isValid(String value, ConstraintValidatorContext ctx) {\n    return value == null || value.matches(\"[1-9][0-9]{5}\");\n  }\n}",
      [
        "The annotation names its validator and has the three required attributes.",
        "The validator returns `true` for `null`, so presence is left to `@NotNull`.",
        "The rule can now be used on any `String` field.",
      ],
      "java",
    ],
    mistakes: [
      "Rejecting `null` inside the validator, so the constraint cannot be optional.",
      "Relying on a validator check for uniqueness without a unique database index.",
    ],
    follow: ["How would you validate that two fields match?"],
    points: [
      "Annotation + ConstraintValidator",
      "Treat null as valid",
      "Validators can inject beans",
    ],
    notes: "`@Constraint(validatedBy=...)` + `ConstraintValidator.isValid`; null is valid, use `@NotNull` separately.",
    src: [
      ["Spring Framework Reference: Configuring a Bean Validation Provider", "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html"],
      ["Spring Framework Reference: Spring-driven Method Validation", "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html"],
    ],
  }),
  g({
    slug: "validating-request-parameters",
    topic: "Validation",
    d: "medium",
    title: "How do you validate path variables and request parameters?",
    kw: ["@Validated", "@Min", "ConstraintViolationException", "HandlerMethodValidationException", "method validation"],
    intent: "Checks that you validate simple values and not only request bodies.",
    short:
      "Put constraints directly on the parameters, such as `@PathVariable @Positive long id` or `@RequestParam @Min(1) @Max(100) int size`. In recent Spring versions (6.1 and later), controller methods with constraint annotations on their parameters are validated automatically, and a failure raises `HandlerMethodValidationException`, which gives a `400`. In older setups, you add `@Validated` on the controller class, and a failure raises `ConstraintViolationException`, which you must map to a `400` yourself, or it becomes a `500`. Always handle the exception that your Spring version raises.",
    detail: [
      "Check the exception type that your version produces. It is a common source of `500` errors that should be `400`.",
      "Constraints on parameters are an input check. Authorisation checks, such as whether the user may see the order, are separate.",
      "A page size limit protects the server from huge responses.",
    ],
    ex: "`GET /orders?size=100000` is rejected because `size` is limited to 100.",
    code: [
      "Constraints on simple parameters",
      "@GetMapping(\"/orders\")\nList<OrderDto> list(\n    @RequestParam(defaultValue = \"0\") @Min(0) int page,\n    @RequestParam(defaultValue = \"20\") @Min(1) @Max(100) int size) {\n  return service.page(page, size);\n}",
      [
        "The defaults are within the limits.",
        "A value outside the limits is rejected before the method runs.",
        "The exact exception depends on the Spring version, so a handler must be in place.",
      ],
      "java",
    ],
    mistakes: [
      "Letting a `ConstraintViolationException` reach the client as a `500`.",
      "Not limiting page sizes.",
    ],
    follow: ["Why must you limit page sizes?"],
    points: [
      "Constraints on parameters",
      "Spring 6.1+ validates automatically; older: @Validated on the class",
      "Map the exception to 400",
    ],
    notes: "Constraints on parameters; handle `HandlerMethodValidationException` or `ConstraintViolationException` → 400.",
    src: [
      ["Spring Framework Reference: Validation (Controller methods)", `${C}/ann-validation.html`],
      ["Spring Framework Reference: Bean Validation", "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html"],
    ],
  }),
  g({
    slug: "exceptionhandler-annotation",
    topic: "Exception handling",
    d: "easy",
    title: "How does `@ExceptionHandler` work?",
    kw: ["@ExceptionHandler", "controller exception", "HandlerExceptionResolver", "error response", "@ResponseStatus"],
    intent: "Checks that you can turn an exception into a controlled response.",
    short:
      "A method annotated with `@ExceptionHandler(SomeException.class)` inside a controller handles that exception type, and its subclasses, when it is thrown by a handler method of the same controller. The handler method can take the exception as a parameter and return a response, for example a `ResponseEntity` with the right status and a body. It keeps the controller methods free of `try`/`catch` code, and gives a consistent error format. For handlers shared by all controllers, put them in a `@ControllerAdvice`.",
    detail: [
      "If several handlers match, the one with the most specific exception type is used.",
      "A handler can declare several exception types in the annotation.",
      "Do not let exceptions reach the user as a stack trace.",
    ],
    ex: "When `OrderController` throws `OrderNotFoundException`, the handler returns `404` and a short message.",
    code: [
      "A handler in a controller",
      "@RestController\nclass OrderController {\n  @GetMapping(\"/orders/{id}\")\n  OrderDto get(@PathVariable long id) {\n    return service.find(id);   // may throw OrderNotFoundException\n  }\n\n  @ExceptionHandler(OrderNotFoundException.class)\n  ResponseEntity<String> notFound(OrderNotFoundException ex) {\n    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());\n  }\n}",
      [
        "The controller method just throws the domain exception.",
        "The handler converts it into a `404` response.",
      ],
      "java",
    ],
    mistakes: [
      "Wrapping every controller method in `try`/`catch`.",
      "Returning `200` with an error message in the body.",
    ],
    follow: ["How do you handle exceptions for all controllers?"],
    points: [
      "Handles an exception type and its subclasses",
      "Builds the response, with status and body",
      "Most specific handler wins",
    ],
    notes: "`@ExceptionHandler(Type.class)` in a controller returns the error response for that exception.",
    src: [
      ["Spring Framework Reference: @ExceptionHandler", `${C}/ann-exceptionhandler.html`],
      ["Spring Framework Reference: Exceptions", `${W}/mvc-servlet/exceptionhandlers.html`],
    ],
  }),
  g({
    slug: "controlleradvice-global-handling",
    topic: "Exception handling",
    d: "medium",
    title: "What is `@ControllerAdvice` and `@RestControllerAdvice`?",
    kw: ["@ControllerAdvice", "@RestControllerAdvice", "global exception handler", "assignableTypes", "centralised"],
    intent: "Checks that you centralise error handling in a real application.",
    short:
      "`@ControllerAdvice` is a component that applies `@ExceptionHandler`, `@ModelAttribute` and `@InitBinder` methods to all controllers, or to a selected set. `@RestControllerAdvice` is `@ControllerAdvice` plus `@ResponseBody`, so the handler methods write their return value as the response body, which is what an API needs. This gives one place that maps exceptions to HTTP statuses and a standard body, such as `NotFound` to `404`, validation errors to `400` and unexpected errors to `500` with a safe message.",
    detail: [
      "You can limit it with `basePackages` or `assignableTypes`.",
      "A catch-all handler for `Exception` should log the details and return a generic message.",
      "Spring's `ResponseEntityExceptionHandler` is a base class that already handles the standard MVC exceptions.",
    ],
    ex: "A single `ApiExceptionHandler` maps domain exceptions and validation errors for the whole API.",
    code: [
      "One global handler",
      "@RestControllerAdvice\nclass ApiExceptionHandler {\n\n  @ExceptionHandler(OrderNotFoundException.class)\n  ResponseEntity<ErrorBody> notFound(OrderNotFoundException ex) {\n    return ResponseEntity.status(404).body(new ErrorBody(\"NOT_FOUND\", ex.getMessage()));\n  }\n\n  @ExceptionHandler(Exception.class)\n  ResponseEntity<ErrorBody> unexpected(Exception ex) {\n    log.error(\"Unexpected error\", ex);\n    return ResponseEntity.status(500).body(new ErrorBody(\"INTERNAL_ERROR\", \"Something went wrong\"));\n  }\n}\n\nrecord ErrorBody(String code, String message) { }",
      [
        "The advice applies to all controllers.",
        "Known exceptions map to specific statuses.",
        "The catch-all logs the real error and returns a safe, generic message.",
      ],
      "java",
    ],
    mistakes: [
      "Returning the exception message of unexpected errors to the client.",
      "Handling `Exception` first and hiding the more specific handlers.",
    ],
    follow: ["How do you avoid leaking internal details in errors?"],
    points: [
      "Applies handlers to all controllers",
      "RestControllerAdvice writes the body",
      "Log the details, return a safe message",
    ],
    notes: "`@RestControllerAdvice` = global `@ExceptionHandler`s that return bodies.",
    src: [
      ["Spring Framework Reference: Controller Advice", `${C}/ann-advice.html`],
      ["Spring Framework Reference: @ExceptionHandler", `${C}/ann-exceptionhandler.html`],
    ],
  }),
  g({
    slug: "responsestatus-and-responsestatusexception",
    topic: "Exception handling",
    d: "medium",
    title: "What are `@ResponseStatus` and `ResponseStatusException`?",
    kw: ["@ResponseStatus", "ResponseStatusException", "HTTP status", "exception", "404"],
    intent: "Checks the two simple ways to attach an HTTP status to an error.",
    short:
      "`@ResponseStatus(HttpStatus.NOT_FOUND)` on an exception class tells Spring to respond with that status whenever the exception escapes a controller. It is declarative and fixed for the class. `ResponseStatusException` is a built-in exception that you throw with a status and a reason, for example `throw new ResponseStatusException(HttpStatus.NOT_FOUND, \"Order not found\")`, and it needs no extra class or handler, so it is flexible for one-off cases. For a larger API, a central `@RestControllerAdvice` is usually clearer.",
    detail: [
      "`@ResponseStatus` can also set the status of a successful handler method, such as `201`.",
      "The reason is not shown by default in recent Spring Boot versions, to avoid leaking details.",
      "Domain exceptions that do not know about HTTP are better mapped in an advice.",
    ],
    ex: "A quick prototype throws `ResponseStatusException` with `404`, and the production code maps `OrderNotFoundException` centrally.",
    code: [
      "Two simple styles",
      "@ResponseStatus(HttpStatus.NOT_FOUND)\nclass OrderNotFoundException extends RuntimeException { }\n\n@GetMapping(\"/orders/{id}\")\nOrderDto get(@PathVariable long id) {\n  return repository.findById(id)\n      .map(mapper::toDto)\n      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, \"Order \" + id + \" not found\"));\n}",
      [
        "The annotated exception always produces `404`.",
        "`ResponseStatusException` sets the status where it is thrown, with no extra class.",
      ],
      "java",
    ],
    mistakes: [
      "Tying a domain exception to HTTP with `@ResponseStatus` in a layer that should not know about HTTP.",
      "Using `ResponseStatusException` with different formats across the API.",
    ],
    follow: ["What do you prefer for a large API?"],
    points: [
      "@ResponseStatus: fixed status on an exception class",
      "ResponseStatusException: status at the throw site",
      "A central advice scales best",
    ],
    notes: "`@ResponseStatus` on an exception, or throw `ResponseStatusException`. Prefer a central advice.",
    src: [
      ["Spring Framework Reference: @ResponseStatus", `${C}/ann-exceptionhandler.html`],
      ["Spring Framework Reference: Error Responses", `${W}/mvc-ann-rest-exceptions.html`],
    ],
  }),
  g({
    slug: "problem-details",
    topic: "Exception handling",
    d: "hard",
    title: "What are Problem Details (`ProblemDetail`) for error responses?",
    kw: ["ProblemDetail", "RFC 9457", "RFC 7807", "application/problem+json", "error format"],
    intent: "Checks that you know the standard way to describe API errors.",
    short:
      "Problem Details is an IETF standard for machine-readable HTTP error responses, with the media type `application/problem+json`. A problem object has standard members: `type` (a URI that identifies the kind of problem), `title`, `status`, `detail` and `instance`, and it can have extra fields. Since Spring 6, the `ProblemDetail` class and `ErrorResponse` interface support it, and the framework's own exceptions can already produce it when you extend `ResponseEntityExceptionHandler` or enable the Boot property for Problem Details. Using a standard format means that clients do not need to learn a custom one for each API.",
    detail: [
      "`ProblemDetail.forStatusAndDetail(status, text)` creates one, and `setProperty` adds custom fields.",
      "The `detail` text should help the client, and must not expose internals.",
      "It standardises the shape of errors, not the business meaning of each error code.",
    ],
    ex: "An unknown order gives `404` with `type`, `title: Not Found`, `status: 404` and `detail: Order 42 does not exist`.",
    code: [
      "Returning a ProblemDetail",
      "@RestControllerAdvice\nclass ProblemHandler {\n\n  @ExceptionHandler(OrderNotFoundException.class)\n  ProblemDetail notFound(OrderNotFoundException ex) {\n    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n    problem.setTitle(\"Order not found\");\n    problem.setProperty(\"orderId\", ex.orderId());\n    return problem;\n  }\n}",
      [
        "The handler returns a `ProblemDetail`, and Spring writes `application/problem+json`.",
        "`setProperty` adds a custom member for the client.",
      ],
      "java",
    ],
    mistakes: [
      "Inventing a different error JSON in every endpoint.",
      "Putting stack traces in the `detail` field.",
    ],
    follow: ["How do you enable problem details for Spring's own exceptions?"],
    points: [
      "Standard JSON error format",
      "type, title, status, detail, instance",
      "ProblemDetail class in Spring 6+",
    ],
    notes: "`ProblemDetail` = standard `application/problem+json` error body (Spring 6+).",
    src: [
      ["Spring Framework Reference: Error Responses", `${W}/mvc-ann-rest-exceptions.html`],
      ["Spring Framework Reference: @ControllerAdvice", `${C}/ann-advice.html`],
    ],
  }),
  g({
    slug: "error-handling-strategy",
    topic: "Exception handling",
    d: "medium",
    title: "What is a good strategy for exceptions and error responses in a REST API?",
    kw: ["error handling", "status codes", "domain exceptions", "logging", "client errors"],
    intent: "Checks that you can design error handling for a whole API and not just one handler.",
    short:
      "Services throw domain exceptions, such as `OrderNotFoundException` or `InsufficientStockException`, that know nothing about HTTP. One `@RestControllerAdvice` maps each type to a status code: `400` for invalid input, `401` and `403` for authentication and authorisation, `404` for a missing resource, `409` for a conflict, and `500` for unexpected errors. All errors use one body format, ideally Problem Details. Log unexpected errors with a stack trace and a correlation id on the server, and return only a safe message and the id to the client.",
    detail: [
      "`4xx` means that the client can fix the request, and `5xx` means that the server failed.",
      "The same exception should always give the same response.",
      "Tests should check the status and the body of each error case.",
    ],
    ex: "A client that sends an invalid order gets `400` with field errors, and an unexpected failure gives `500` with only an error id that support can look up in the logs.",
    mistakes: [
      "Using `500` for client mistakes, or `200` with an error body.",
      "Showing exception messages from unexpected errors to users.",
    ],
    follow: ["When do you return 409?"],
    points: [
      "Domain exceptions, central mapping",
      "Correct 4xx and 5xx codes",
      "Log details, return a safe message and an id",
    ],
    notes: "Domain exceptions → one advice → right status + one body format; log details, hide internals.",
    src: [
      ["Spring Framework Reference: Error Responses", `${W}/mvc-ann-rest-exceptions.html`],
      ["Spring Framework Reference: Controller Advice", `${C}/ann-advice.html`],
    ],
  }),
  g({
    slug: "rest-controller-basics",
    topic: "REST controllers & DTOs",
    d: "easy",
    title: "How do you build a REST controller for CRUD operations?",
    kw: ["REST", "CRUD", "@RestController", "ResponseEntity", "HTTP methods"],
    intent: "Checks that you can map the HTTP methods to operations correctly.",
    short:
      "Use `@RestController` with a base path for the resource, such as `/api/orders`, and map the HTTP methods to operations: `GET /orders` lists, `GET /orders/{id}` reads one, `POST /orders` creates, `PUT /orders/{id}` replaces, `PATCH` changes part of it, and `DELETE /orders/{id}` removes. Use nouns for resources, not verbs, and return meaningful status codes: `200` for success, `201` with a `Location` header for a creation, `204` for no content, and `404` when a resource is missing. The controller stays thin and calls a service.",
    detail: [
      "`GET` must not change data, and `PUT` and `DELETE` should be idempotent.",
      "Use plural nouns, and nest only when the child belongs to the parent, such as `/users/{id}/orders`.",
      "Return DTOs, and not entities.",
    ],
    ex: "An order API supports list, get, create and cancel, and each action has a clear URL and status.",
    code: [
      "CRUD endpoints",
      "@RestController\n@RequestMapping(\"/api/orders\")\nclass OrderController {\n  private final OrderService service;\n  OrderController(OrderService service) { this.service = service; }\n\n  @GetMapping public List<OrderDto> list() { return service.all(); }\n\n  @GetMapping(\"/{id}\") public OrderDto get(@PathVariable long id) { return service.find(id); }\n\n  @PostMapping\n  public ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrder request) {\n    OrderDto created = service.create(request);\n    return ResponseEntity.created(URI.create(\"/api/orders/\" + created.id())).body(created);\n  }\n\n  @DeleteMapping(\"/{id}\")\n  @ResponseStatus(HttpStatus.NO_CONTENT)\n  public void delete(@PathVariable long id) { service.delete(id); }\n}",
      [
        "Each method maps one HTTP method to one operation.",
        "Creation returns `201` with a `Location` header.",
        "Delete returns `204`, and the controller only delegates to the service.",
      ],
      "java",
    ],
    mistakes: [
      "Using verbs in URLs, such as `/getOrder`.",
      "Putting business logic in the controller.",
    ],
    follow: ["Which status do you return after creating a resource?"],
    points: [
      "HTTP method = operation",
      "201 + Location, 204, 404",
      "Thin controller, service does the work",
    ],
    notes: "`GET` list/read, `POST` create (201 + Location), `PUT`/`PATCH` update, `DELETE` (204).",
    src: [
      ["Spring Framework Reference: Annotated Controllers", `${C}/ann.html`],
      ["Spring Framework Reference: ResponseEntity", `${M}/responseentity.html`],
    ],
  }),
  g({
    slug: "responseentity-usage",
    topic: "REST controllers & DTOs",
    d: "easy",
    title: "When do you use `ResponseEntity`?",
    kw: ["ResponseEntity", "status code", "headers", "Location", "ok"],
    intent: "Checks that you can control the whole HTTP response.",
    short:
      "`ResponseEntity<T>` represents the full HTTP response: the status code, the headers and the body. You use it when a method needs to decide the status at run time, or to set headers. Convenient builders make it short: `ResponseEntity.ok(body)`, `ResponseEntity.created(uri).body(body)`, `ResponseEntity.noContent().build()` and `ResponseEntity.notFound().build()`. If a method always returns the same status, the plain return type with `@ResponseStatus` is enough.",
    detail: [
      "Use `Optional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build())` for a lookup.",
      "A `Location` header after `POST` tells the client where the new resource is.",
      "Do not return `200` for everything, and let the status carry the meaning.",
    ],
    ex: "`GET /orders/5` returns `200` with the order, or `404` with no body if it does not exist.",
    code: [
      "Choosing the status at run time",
      "@GetMapping(\"/{id}\")\nResponseEntity<OrderDto> get(@PathVariable long id) {\n  return service.findOptional(id)\n      .map(ResponseEntity::ok)\n      .orElseGet(() -> ResponseEntity.notFound().build());\n}",
      [
        "A present order becomes `200` with the body.",
        "A missing order becomes `404` with no body.",
      ],
      "java",
    ],
    mistakes: [
      "Returning `null` and a `200` status for a missing resource.",
      "Using `ResponseEntity` everywhere when a fixed status would do.",
    ],
    follow: ["How do you return 201 with a Location header?"],
    points: [
      "Status + headers + body",
      "Builders: ok, created, noContent, notFound",
      "Use when the status varies",
    ],
    notes: "`ResponseEntity` = status + headers + body, for responses that vary.",
    src: [
      ["Spring Framework Reference: ResponseEntity", `${M}/responseentity.html`],
      ["Spring Framework Reference: Return Values", `${M}/return-types.html`],
    ],
  }),
  g({
    slug: "dto-vs-entity",
    topic: "REST controllers & DTOs",
    d: "medium",
    title: "Why use DTOs instead of exposing entities in an API?",
    kw: ["DTO", "entity", "API contract", "mass assignment", "lazy loading"],
    intent: "Checks that you separate the API model from the persistence model.",
    short:
      "An entity is the persistence model, mapped to a table and managed by JPA. A DTO (data transfer object) is the model of the API request or response. Exposing entities directly couples the API to the database schema, so that a column rename breaks clients. It can leak fields such as password hashes and internal flags, allows clients to set fields that they should not (mass assignment), can trigger lazy-loading errors or extra queries during serialisation, and creates endless loops with bidirectional relations. DTOs, often written as records, expose exactly the fields that the API promises.",
    detail: [
      "Use separate request and response DTOs, because the data to create something often differs from what you return.",
      "Mapping can be written by hand or generated by a mapper library.",
      "The service layer works with entities, and the controller converts at the edge.",
    ],
    ex: "`UserDto(id, name, email)` is returned, and the `User` entity, with its password hash and roles, never leaves the service.",
    code: [
      "Request and response DTOs",
      "record CreateUserRequest(@NotBlank String name, @Email String email, @Size(min = 8) String password) { }\nrecord UserDto(long id, String name, String email) { }\n\nUserDto toDto(User user) {\n  return new UserDto(user.getId(), user.getName(), user.getEmail());\n}",
      [
        "The request DTO has the password and the validation rules.",
        "The response DTO has no password and no internal fields.",
        "The mapping makes the exposed fields explicit.",
      ],
      "java",
    ],
    mistakes: [
      "Returning a JPA entity from a controller.",
      "Binding a request body directly to an entity.",
    ],
    follow: ["What is mass assignment?"],
    points: [
      "Decouples the API from the database",
      "No leaked or settable internal fields",
      "Avoids lazy-loading and cycle problems",
    ],
    notes: "Expose DTOs (records), not entities: no leaks, no mass assignment, a stable contract.",
    src: [
      ["Spring Framework Reference: @RequestBody", `${M}/requestbody.html`],
      ["Spring Framework Reference: Jackson JSON", `${M}/jackson.html`],
    ],
  }),
  g({
    slug: "requestbody-and-message-converters",
    topic: "REST controllers & DTOs",
    d: "medium",
    title: "How does `@RequestBody` convert JSON, and what are message converters?",
    kw: ["@RequestBody", "HttpMessageConverter", "Jackson", "JSON", "deserialisation"],
    intent: "Checks that you know how bodies become objects and back.",
    short:
      "`@RequestBody` tells Spring to read the request body and convert it into the parameter's type. Spring picks an `HttpMessageConverter` that supports the request's `Content-Type` and the target type. For JSON, Spring Boot configures a Jackson converter, which deserialises JSON into your object, usually a record or a class with a constructor or setters. The same converters write return values as the response body. If the body is not valid JSON or does not match, you get a `400`, and if the content type is unsupported, a `415`.",
    detail: [
      "Jackson settings, such as the date format or ignoring unknown properties, can be set with `spring.jackson.*` properties.",
      "Annotations such as `@JsonProperty` and `@JsonIgnore` control the names and which fields are included.",
      "Unknown JSON fields are ignored by default in Spring Boot, which can hide client mistakes.",
    ],
    ex: "A `POST` with `{\"name\":\"Asha\",\"email\":\"a@x.in\"}` becomes a `SignupRequest` object in the controller.",
    code: [
      "JSON in, JSON out",
      "record SignupRequest(String name, String email) { }\nrecord SignupResponse(long id, String name) { }\n\n@PostMapping(\"/signup\")\nSignupResponse signup(@RequestBody SignupRequest request) {\n  return new SignupResponse(1L, request.name());\n}",
      [
        "The converter reads the JSON body into `SignupRequest`.",
        "The returned `SignupResponse` is written back as JSON.",
      ],
      "java",
    ],
    mistakes: [
      "Missing the `Content-Type: application/json` header in the client.",
      "Sending a body to a method that expects form parameters.",
    ],
    follow: ["How do you customise the JSON format?"],
    points: [
      "Converter chosen by Content-Type and type",
      "Jackson for JSON in Spring Boot",
      "400 for malformed JSON, 415 for an unsupported type",
    ],
    notes: "`@RequestBody` uses an `HttpMessageConverter` (Jackson for JSON) to build the object.",
    src: [
      ["Spring Framework Reference: @RequestBody", `${M}/requestbody.html`],
      ["Spring Framework Reference: HTTP Message Conversion", `${W}/mvc-config/message-converters.html`],
    ],
  }),
  g({
    slug: "jackson-customisation",
    topic: "REST controllers & DTOs",
    d: "medium",
    title: "How do you control the JSON that your API produces? (Jackson annotations)",
    kw: ["@JsonProperty", "@JsonIgnore", "@JsonInclude", "@JsonFormat", "Jackson"],
    intent: "Checks that you can shape JSON without exposing the internal model.",
    short:
      "Jackson annotations on a DTO control the JSON. `@JsonProperty(\"order_id\")` sets a field name, `@JsonIgnore` leaves a field out, `@JsonInclude(JsonInclude.Include.NON_NULL)` omits null fields, and `@JsonFormat` sets the format of dates and times. Properties such as `spring.jackson.property-naming-strategy` set a naming convention for the whole application, and `spring.jackson.default-property-inclusion` sets the inclusion rule. Dates should be written in ISO-8601 format, not as numbers, so that clients can read them without guessing.",
    detail: [
      "Records work with Jackson in recent versions.",
      "Use the Java time types, such as `Instant` and `LocalDate`, with the Jackson time module that Boot registers.",
      "Prefer DTOs over `@JsonIgnore` on entities, so that the API shape lives in one place.",
    ],
    ex: "A response uses `order_id` and omits empty fields, and a timestamp is serialised as `2026-11-04T10:30:00Z`.",
    code: [
      "Shaping a response",
      "@JsonInclude(JsonInclude.Include.NON_NULL)\nrecord OrderView(\n    @JsonProperty(\"order_id\") long id,\n    String status,\n    @JsonFormat(shape = JsonFormat.Shape.STRING) Instant createdAt,\n    String note) { }",
      [
        "`@JsonProperty` renames `id` to `order_id` in the JSON.",
        "`NON_NULL` leaves out `note` when it is `null`.",
        "The `Instant` is written as an ISO-8601 string.",
      ],
      "java",
    ],
    mistakes: [
      "Returning timestamps as numbers without documenting the unit.",
      "Annotating entities with Jackson annotations instead of using a DTO.",
    ],
    follow: ["How do you set a naming convention for the whole API?"],
    points: [
      "@JsonProperty, @JsonIgnore, @JsonInclude, @JsonFormat",
      "ISO-8601 for dates",
      "Application-wide settings through properties",
    ],
    notes: "Jackson annotations on DTOs; ISO-8601 dates; global settings with `spring.jackson.*`.",
    src: [
      ["Spring Framework Reference: Jackson JSON", `${M}/jackson.html`],
      ["Spring Framework Reference: HTTP Message Conversion", `${W}/mvc-config/message-converters.html`],
    ],
  }),
  g({
    slug: "model-view-and-redirect",
    topic: "Controllers",
    d: "easy",
    title: "How do `Model`, view names and redirects work in a server-rendered Spring MVC page?",
    kw: ["Model", "view name", "redirect", "Thymeleaf", "Post/Redirect/Get"],
    intent: "Checks that you can build a classic form page and avoid duplicate submissions.",
    short:
      "A `@Controller` method adds data to a `Model` and returns a view name, such as `\"orders\"`. The `ViewResolver` maps the name to a template, for example a Thymeleaf file, and the template renders the model's data into HTML. After a successful form submission, the method should return `\"redirect:/orders\"`, so the browser makes a new `GET` request. This Post/Redirect/Get pattern prevents the browser from submitting the form again when the user refreshes the page. `RedirectAttributes` can carry a one-time flash message through the redirect.",
    detail: [
      "Spring Boot with the Thymeleaf starter finds templates in `src/main/resources/templates` by default.",
      "A model attribute exists only for the current request, unless it is a flash attribute.",
      "Return `forward:` to continue inside the server, and `redirect:` to send the browser to another URL.",
    ],
    ex: "After a user creates an order, the controller redirects to the list page, which shows the message \"Order created\".",
    code: [
      "Post/Redirect/Get",
      "@Controller\nclass OrderPageController {\n\n  @GetMapping(\"/orders\")\n  String list(Model model) {\n    model.addAttribute(\"orders\", service.all());\n    return \"orders\";                 // templates/orders.html\n  }\n\n  @PostMapping(\"/orders\")\n  String create(@ModelAttribute OrderForm form, RedirectAttributes redirect) {\n    service.create(form);\n    redirect.addFlashAttribute(\"message\", \"Order created\");\n    return \"redirect:/orders\";\n  }\n}",
      [
        "`list` fills the model and returns the view name.",
        "`create` saves the order, then redirects to the `GET` page.",
        "The flash attribute survives the redirect and is shown once.",
      ],
      "java",
    ],
    mistakes: [
      "Returning a view directly after a `POST`, so that a refresh submits the form twice.",
      "Putting data in the model and expecting it to survive a redirect without a flash attribute.",
    ],
    follow: ["What is the difference between redirect and forward?"],
    points: [
      "Model data + view name",
      "redirect: after a successful POST",
      "Flash attributes survive one redirect",
    ],
    notes: "Return a view name for GET, `redirect:` after POST, `RedirectAttributes` for flash messages.",
    src: [
      ["Spring Framework Reference: Thymeleaf", "https://docs.spring.io/spring-framework/reference/web/webmvc-view/mvc-thymeleaf.html"],
      ["Spring Framework Reference: Return Values", `${M}/return-types.html`],
    ],
  }),
])
