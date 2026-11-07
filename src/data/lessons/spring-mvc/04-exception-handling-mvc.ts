import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-mvc", {
  slug: "exception-handling-mvc",
  title: "Exception handling and Problem Details",
  topic: "Exception handling",
  minutes: 60,
  overview:
    "Handle exceptions in controllers and globally, map them to the right status codes, and return a consistent error body.",
  objectives: [
    "Use @ExceptionHandler and @RestControllerAdvice",
    "Use @ResponseStatus and ResponseStatusException",
    "Return RFC 9457 Problem Details and design an error strategy",
  ],
  prerequisites: ["lesson.spring-mvc.bean-validation"],
  sections: [
    {
      kind: "explain",
      heading: "Handling exceptions",
      body: [
        "A method annotated with `@ExceptionHandler(SomeException.class)` in a controller handles that exception type, and its subclasses, when it is thrown by a handler method of the same controller. It can return a `ResponseEntity` with the right status and body. This keeps controller methods free of `try`/`catch` code. If several handlers match, the **most specific** one is used.",
        "`@ControllerAdvice` applies `@ExceptionHandler`, `@ModelAttribute` and `@InitBinder` methods to **all controllers**, or a selected set. `@RestControllerAdvice` is `@ControllerAdvice` plus `@ResponseBody`, which is what an API needs. It gives one place that maps exceptions to HTTP statuses and a standard body.",
      ],
    },
    {
      kind: "code",
      heading: "A global handler",
      example: {
        title: "@RestControllerAdvice",
        language: "java",
        code: '@RestControllerAdvice\nclass ApiExceptionHandler {\n\n  @ExceptionHandler(OrderNotFoundException.class)\n  ResponseEntity<ErrorBody> notFound(OrderNotFoundException ex) {\n    return ResponseEntity.status(404).body(new ErrorBody("NOT_FOUND", ex.getMessage()));\n  }\n\n  @ExceptionHandler(Exception.class)\n  ResponseEntity<ErrorBody> unexpected(Exception ex) {\n    log.error("Unexpected error", ex);\n    return ResponseEntity.status(500).body(new ErrorBody("INTERNAL_ERROR", "Something went wrong"));\n  }\n}\n\nrecord ErrorBody(String code, String message) { }',
        walkthrough: [
          "The advice applies to all controllers.",
          "Known exceptions map to specific statuses.",
          "The catch-all logs the real error and returns a **safe, generic** message, so internal details never reach the client.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Simple status mappings",
      body: [
        "`@ResponseStatus(HttpStatus.NOT_FOUND)` on an **exception class** makes Spring respond with that status whenever the exception escapes a controller. `ResponseStatusException` is a built-in exception that you **throw** with a status and a reason, with no extra class or handler, so it is flexible for one-off cases. For a larger API, a central advice is clearer, and keeps domain exceptions free of HTTP.",
      ],
    },
    {
      kind: "explain",
      heading: "Problem Details",
      body: [
        "**Problem Details** (RFC 9457, which replaced RFC 7807) is a standard format for machine-readable HTTP errors, with the media type `application/problem+json`. A problem has the standard members `type`, `title`, `status`, `detail` and `instance`, and may have extra fields. Spring 6 has the `ProblemDetail` class and `ErrorResponse` interface, and Spring's own exceptions can produce it when you extend `ResponseEntityExceptionHandler` or enable the Boot property for problem details. A standard format means clients do not need to learn a custom one for each API.",
        "A good strategy for a whole API: services throw **domain exceptions** that know nothing about HTTP. One advice maps them: `400` invalid input, `401` and `403` for authentication and permission, `404` missing resource, `409` conflict, `500` unexpected. All errors share one body format. Unexpected errors are logged in full with a correlation id, and the client gets a safe message and that id. The same exception always gives the same response.",
      ],
    },
    {
      kind: "code",
      heading: "A ProblemDetail",
      example: {
        title: "Standard error body",
        language: "java",
        code: '@RestControllerAdvice\nclass ProblemHandler {\n\n  @ExceptionHandler(OrderNotFoundException.class)\n  ProblemDetail notFound(OrderNotFoundException ex) {\n    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n    problem.setTitle("Order not found");\n    problem.setProperty("orderId", ex.orderId());\n    return problem;\n  }\n}\n\n@ResponseStatus(HttpStatus.CONFLICT)\nclass DuplicateEmailException extends RuntimeException {\n}\n\n// or, for a one-off case\n// throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");',
        walkthrough: [
          "The handler returns a `ProblemDetail`, and Spring writes `application/problem+json`.",
          "`setProperty` adds a custom member that the client can use.",
          "`@ResponseStatus` and `ResponseStatusException` are shorter alternatives for simple cases.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Wrapping every controller method in `try`/`catch`.",
          fix: "Throw domain exceptions and handle them in one advice.",
        },
        {
          mistake: "Returning `200` with an error body.",
          fix: "Use the status code.",
        },
        {
          mistake: "Returning an unexpected exception's message to the client.",
          fix: "Log the details, return a generic message and an id.",
        },
        {
          mistake: "A different error format in every controller.",
          fix: "Use one format, ideally Problem Details.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A consistent API",
      scenario:
        "A mobile app expects the same error shape from every endpoint.",
      body: [
        "One `@RestControllerAdvice` maps validation errors, not-found, conflict and unexpected errors to `ProblemDetail`. Tests check the status and body of each error case.",
        "The client has one error handler for the whole API.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "eh-advice",
      prompt: "What does @RestControllerAdvice do?",
      options: [
        "Applies exception handlers to all controllers and writes bodies",
        "Creates a controller",
        "Validates input",
      ],
      answer: 0,
      explanation: "It is `@ControllerAdvice` plus `@ResponseBody`.",
    },
    {
      type: "single",
      id: "eh-pd",
      prompt: "What is the media type of Problem Details?",
      options: ["application/problem+json", "application/error", "text/plain"],
      answer: 0,
      explanation: "It standardises the shape of error responses.",
    },
    {
      type: "truefalse",
      id: "eh-msg",
      statement:
        "Return the message of unexpected exceptions to the client for easier debugging.",
      answer: false,
      explanation: "Log the details and return a safe message with an id.",
    },
    {
      type: "single",
      id: "eh-specific",
      prompt: "Two handlers match an exception. Which is used?",
      options: ["The most specific one", "The first declared", "Both"],
      answer: 0,
      explanation:
        "A handler for a subclass wins over a handler for its parent.",
    },
  ],
  assignment: {
    title: "An error strategy",
    task: [
      "Create three domain exceptions and map them to 404, 409 and 400 in one advice, returning `ProblemDetail`.",
      "Add a catch-all that logs with a correlation id and hides the details, and test each case with MockMvc.",
    ],
    checklist: [
      "Every error has the same shape",
      "The unexpected error hides its details",
      "Each status is tested",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "eh-ex",
      title: "Handle one exception",
      task: [
        "Write a `@RestControllerAdvice` method that maps `InsufficientStockException` to `409 Conflict` with a `ProblemDetail` titled `Not enough stock`.",
      ],
      language: "java",
      starter: "@RestControllerAdvice\nclass StockHandler {\n  // your code\n}",
      solution:
        '@RestControllerAdvice\nclass StockHandler {\n  @ExceptionHandler(InsufficientStockException.class)\n  ProblemDetail insufficient(InsufficientStockException ex) {\n    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());\n    problem.setTitle("Not enough stock");\n    return problem;\n  }\n}',
      hints: ["Use `ProblemDetail.forStatusAndDetail` and `setTitle`."],
      checklist: [
        "The status is 409",
        "The title is set",
        "The exception type is handled",
      ],
    },
  ],
  revisionNotes: [
    "`@ExceptionHandler` in a controller; `@RestControllerAdvice` for all controllers",
    "`@ResponseStatus` on an exception; `ResponseStatusException` for one-offs",
    "ProblemDetail: standard problem+json body",
    "Domain exceptions → one advice → right status; log details, hide internals",
  ],
  resources: [
    {
      label: "Spring Framework Reference: @ExceptionHandler",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html",
    },
    {
      label: "Spring Framework Reference: Controller Advice",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html",
    },
    {
      label: "Spring Framework Reference: Error Responses",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html",
    },
  ],
})
