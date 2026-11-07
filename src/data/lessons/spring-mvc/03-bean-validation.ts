import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-mvc", {
  slug: "bean-validation",
  title: "Validation with Bean Validation",
  topic: "Validation",
  minutes: 70,
  overview:
    "Validate request bodies and parameters, write groups and custom constraints, and return clear errors.",
  objectives: [
    "Validate a request body with @Valid",
    "Tell @Valid from @Validated and use groups",
    "Return field-level errors and write a custom constraint",
  ],
  prerequisites: ["lesson.spring-mvc.request-mapping"],
  sections: [
    {
      kind: "explain",
      heading: "Validating a request body",
      body: [
        "Add Bean Validation constraints to the fields of the request DTO, such as `@NotBlank`, `@Size`, `@Email`, `@Min` and `@NotNull`, and put `@Valid` before the `@RequestBody` parameter. Spring validates the object after binding, and if there are violations it throws `MethodArgumentNotValidException`, which by default gives a **`400 Bad Request`**. Boot needs the validation starter on the class path. The constraints come from Jakarta Bean Validation, with Hibernate Validator as the implementation.",
        "Validation at the controller keeps bad data away from the services, but the service layer must still protect its own rules, and **business rules** that need context, such as stock levels, belong in the service. The database enforces the final guarantees with constraints, because only it sees every writer and every race.",
      ],
    },
    {
      kind: "code",
      heading: "A validated DTO",
      example: {
        title: "@Valid",
        language: "java",
        code: 'record SignupRequest(\n    @NotBlank String name,\n    @Email @NotBlank String email,\n    @Size(min = 8) String password) {\n}\n\n@PostMapping("/signup")\nResponseEntity<Void> signup(@Valid @RequestBody SignupRequest request) {\n  service.register(request);\n  return ResponseEntity.status(HttpStatus.CREATED).build();\n}',
        walkthrough: [
          "The constraints describe the valid **shape** of the data.",
          "`@Valid` triggers validation before the method body runs.",
          "A violation produces a `400` response, and the method is not called.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "@Valid, @Validated and parameters",
      body: [
        "`@Valid` is the standard annotation. It triggers validation and **cascades** into nested objects that are also marked `@Valid`. `@Validated` is Spring's variant. It supports **validation groups**, which apply different constraints in different situations, such as creating and updating, and, on a class, it turns on method-level validation of simple parameters. Nested objects need `@Valid` on the field, or their constraints are ignored.",
        "Constraints can go directly on simple parameters: `@PathVariable @Positive long id`, `@RequestParam @Min(1) @Max(100) int size`. In recent Spring versions (6.1 and later), controller methods with constraints on their parameters are validated automatically, and a failure raises `HandlerMethodValidationException`, which gives `400`. In older setups, `@Validated` on the class raises `ConstraintViolationException`, which you must map to `400` yourself, or it becomes a `500`. **Handle the exception that your version raises.**",
      ],
    },
    {
      kind: "code",
      heading: "Groups and nesting",
      example: {
        title: "@Validated",
        language: "java",
        code: 'interface OnCreate { }\ninterface OnUpdate { }\n\nrecord UserDto(\n    @Null(groups = OnCreate.class) @NotNull(groups = OnUpdate.class) Long id,\n    @NotBlank String name,\n    @Valid AddressDto address) {\n}\n\n@PutMapping("/users/{id}")\nUserDto update(@Validated(OnUpdate.class) @RequestBody UserDto dto) {\n  return service.update(dto);\n}\n\n@GetMapping("/orders")\nList<OrderDto> list(@RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {\n  return service.page(size);\n}',
        walkthrough: [
          "The rule for `id` depends on the group: it must be absent on creation and present on update.",
          "`@Valid` on `address` makes validation go into the nested object.",
          "The page size is limited to 100, which also protects the server from huge responses.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Clear error responses and custom constraints",
      body: [
        "For REST APIs, handle `MethodArgumentNotValidException` in a `@RestControllerAdvice`: read the **field errors** and return a `400` with a consistent body that lists each field with its message, so the client can show the errors next to the form fields. Do not return internal details such as class names or stack traces.",
        "A **custom constraint** is an annotation marked with `@Constraint(validatedBy = ...)` that has the required `message`, `groups` and `payload` attributes, together with a class that implements `ConstraintValidator<MyAnnotation, FieldType>` and an `isValid` method. Treat `null` as valid and let `@NotNull` decide on presence. Spring creates the validator as a bean, so it can inject other beans. A uniqueness check against the database is only advisory, so keep a unique index too.",
      ],
    },
    {
      kind: "code",
      heading: "A handler and a custom constraint",
      example: {
        title: "Field errors",
        language: "java",
        code: '@RestControllerAdvice\nclass ApiExceptionHandler {\n\n  @ExceptionHandler(MethodArgumentNotValidException.class)\n  ResponseEntity<Map<String, String>> invalid(MethodArgumentNotValidException ex) {\n    Map<String, String> errors = new LinkedHashMap<>();\n    ex.getBindingResult().getFieldErrors()\n        .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));\n    return ResponseEntity.badRequest().body(errors);\n  }\n}\n\n@Target({ElementType.FIELD, ElementType.PARAMETER})\n@Retention(RetentionPolicy.RUNTIME)\n@Constraint(validatedBy = PincodeValidator.class)\n@interface Pincode {\n  String message() default "must be a 6-digit pincode";\n  Class<?>[] groups() default {};\n  Class<? extends Payload>[] payload() default {};\n}\n\nclass PincodeValidator implements ConstraintValidator<Pincode, String> {\n  public boolean isValid(String value, ConstraintValidatorContext ctx) {\n    return value == null || value.matches("[1-9][0-9]{5}");\n  }\n}',
        walkthrough: [
          "The handler collects each field and its message into one map and returns `400`.",
          "The annotation names its validator and has the three required attributes.",
          "The validator returns `true` for `null`, so presence is left to `@NotNull`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting `@Valid`, so the constraints are never checked.",
          fix: "Add it to the parameter.",
        },
        {
          mistake: "Forgetting `@Valid` on a nested object.",
          fix: "Mark the field `@Valid`.",
        },
        {
          mistake: "Letting a ConstraintViolationException become a 500.",
          fix: "Map it to 400.",
        },
        {
          mistake: "Relying on controller validation only.",
          fix: "Keep rules in the services and constraints in the database.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A signup form",
      scenario:
        "A signup request has an email, a password and a pincode, and the client must show an error next to each field.",
      body: [
        'Constraints on the DTO and one advice produce `{ "email": "must be a well-formed email address", "pincode": "must be a 6-digit pincode" }`. The service checks the business rule that the email is not banned, and a unique index protects against two signups at the same moment.',
        "Each layer checks what it can know.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "bv-valid",
      prompt: "What does @Valid on a @RequestBody parameter do?",
      options: [
        "Triggers validation of the object",
        "Makes the parameter optional",
        "Converts it to a string",
      ],
      answer: 0,
      explanation: "A violation gives `MethodArgumentNotValidException`.",
    },
    {
      type: "single",
      id: "bv-groups",
      prompt: "Which annotation supports validation groups?",
      options: ["@Validated", "@Valid", "@NotNull"],
      answer: 0,
      explanation: "`@Valid` is the standard annotation without groups.",
    },
    {
      type: "truefalse",
      id: "bv-null",
      statement:
        "A custom validator should return false for null so that the constraint is mandatory.",
      answer: false,
      explanation: "Return true for null and use @NotNull for presence.",
    },
    {
      type: "single",
      id: "bv-nested",
      prompt: "How do you validate a nested object?",
      options: [
        "Mark the field @Valid",
        "It is validated automatically",
        "Use @Autowired",
      ],
      answer: 0,
      explanation: "Without `@Valid`, nested constraints are ignored.",
    },
  ],
  assignment: {
    title: "Validate a form",
    task: [
      "Build a signup endpoint with at least six constraints, a nested address with `@Valid`, and a custom constraint.",
      "Return field errors in one handler, and add a paging parameter with `@Min` and `@Max`.",
    ],
    checklist: [
      "Errors name the field and the message",
      "The nested object is validated",
      "The paging limit is enforced",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "bv-ex",
      title: "Write the DTO",
      task: [
        "Write a record `ProductRequest` with a required name of at most 80 characters, a price that must be positive, and a quantity of at least 0. Add the controller method that validates it.",
      ],
      language: "java",
      starter: "// your code",
      solution:
        'record ProductRequest(\n    @NotBlank @Size(max = 80) String name,\n    @Positive BigDecimal price,\n    @Min(0) int quantity) {\n}\n\n@PostMapping("/api/products")\nResponseEntity<Void> create(@Valid @RequestBody ProductRequest request) {\n  service.create(request);\n  return ResponseEntity.status(HttpStatus.CREATED).build();\n}',
      hints: ["Use `@NotBlank`, `@Size`, `@Positive`, `@Min` and `@Valid`."],
      checklist: [
        "All three fields have constraints",
        "@Valid is on the parameter",
        "The status is 201",
      ],
    },
  ],
  revisionNotes: [
    "Constraints on the DTO + `@Valid @RequestBody` → 400 on a violation",
    "`@Valid` cascades; `@Validated` adds groups and class-level parameter validation",
    "Handle MethodArgumentNotValidException (and the parameter validation exception of your version) centrally",
    "Custom constraint: annotation + ConstraintValidator; null is valid; keep a database constraint",
  ],
  resources: [
    {
      label: "Spring Framework Reference: Bean Validation",
      url: "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html",
    },
    {
      label: "Spring Framework Reference: Validation in controller methods",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html",
    },
  ],
})
