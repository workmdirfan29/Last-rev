import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-boot", {
  slug: "testing-spring-boot",
  title: "Testing Spring Boot applications",
  topic: "Testing",
  minutes: 90,
  overview:
    "Test at the right level: plain unit tests, web-layer slices with MockMvc, data slices, full integration tests, and real databases with Testcontainers.",
  objectives: [
    "Choose between unit tests, slice tests and @SpringBootTest",
    "Test a controller with @WebMvcTest and MockMvc",
    "Configure test properties and use Testcontainers",
  ],
  prerequisites: ["lesson.spring-boot.actuator"],
  sections: [
    {
      kind: "explain",
      heading: "The testing levels",
      body: [
        "Test each part at the level that suits it. **Service classes** are plain Java, so unit tests with JUnit and Mockito check the business rules quickly, with no Spring at all. The **web layer** is tested with a slice test that loads only what is needed. The **data layer** is tested against a real database. A few **full integration tests** check the whole flow. Many fast tests and few slow ones give the best feedback.",
        "`spring-boot-starter-test` brings JUnit, Mockito, AssertJ, Spring's test support and more in one dependency. Do not test the framework: test your own rules and mappings, and test behaviour that a user or client can see.",
      ],
    },
    {
      kind: "code",
      heading: "A unit test",
      example: {
        title: "Mockito without Spring",
        language: "java",
        code: 'class OrderServiceTest {\n  private final OrderRepository repository = mock(OrderRepository.class);\n  private final OrderService service = new OrderService(repository);\n\n  @Test\n  void rejectsAnOrderWithoutStock() {\n    when(repository.stockOf("pen")).thenReturn(0);\n\n    assertThatThrownBy(() -> service.place(new PlaceOrder("pen", 1)))\n        .isInstanceOf(OutOfStockException.class);\n    verify(repository, never()).save(any());\n  }\n}',
        walkthrough: [
          "The service is created with `new` and a mock repository, so no Spring context is started and the test runs in milliseconds.",
          "`when(...).thenReturn(...)` sets what the mock returns.",
          "The test checks the behaviour, the exception, and that nothing was saved.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Slice tests",
      body: [
        "A **slice test** loads only the part of the application that one layer needs. `@WebMvcTest(OrderController.class)` starts the Spring MVC infrastructure and the controller, but not the services or repositories, which you replace with mocks. It gives you a `MockMvc` that sends requests through Spring MVC **without a network**, so you test the mapping, validation, status codes and JSON. `@DataJpaTest` loads only the JPA repositories and entities, with an in-memory database by default, and rolls back each test.",
        "Mock beans in the Spring context with `@MockBean`, or `@MockitoBean` in newer Spring versions. Use the annotation your version supports.",
      ],
    },
    {
      kind: "code",
      heading: "A web-layer test",
      example: {
        title: "@WebMvcTest and MockMvc",
        language: "java",
        code: '@WebMvcTest(OrderController.class)\nclass OrderControllerTest {\n  @Autowired\n  MockMvc mockMvc;\n\n  @MockBean\n  OrderService service;\n\n  @Test\n  void returnsAnOrder() throws Exception {\n    when(service.find(1L)).thenReturn(new OrderDto(1L, "PAID"));\n\n    mockMvc.perform(get("/api/orders/1"))\n        .andExpect(status().isOk())\n        .andExpect(jsonPath("$.status").value("PAID"));\n  }\n\n  @Test\n  void rejectsAnInvalidOrder() throws Exception {\n    mockMvc.perform(post("/api/orders")\n            .contentType(MediaType.APPLICATION_JSON)\n            .content("{\\"quantity\\": 0}"))\n        .andExpect(status().isBadRequest());\n  }\n}',
        walkthrough: [
          "Only the web layer for `OrderController` is loaded, and the service is a mock.",
          "`perform` sends a request without a server, and `andExpect` checks the status and a JSON field.",
          "The second test checks that validation rejects a bad body with `400`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Integration tests and real databases",
      body: [
        "`@SpringBootTest` starts a full application context, as in the real application, so you can test several layers together. With `webEnvironment = RANDOM_PORT` it starts a real embedded server on a free port, and you call it with `TestRestTemplate`. It is slower, so use it for a few important flows. The context is cached and reused between tests that share the same configuration.",
        'Test settings go in `src/test/resources`, in `@ActiveProfiles("test")`, in the `properties` of `@SpringBootTest`, or in `@TestPropertySource`. For a database, **Testcontainers** starts a throwaway Docker container, such as a real PostgreSQL. This avoids the differences between an in-memory database and the production database. Boot supports it directly: a container field annotated with `@ServiceConnection` is detected, and Boot configures the connection automatically. The cost is that tests need Docker.',
      ],
    },
    {
      kind: "code",
      heading: "A test with a real database",
      example: {
        title: "Testcontainers",
        language: "java",
        code: '@SpringBootTest\n@Testcontainers\nclass OrderRepositoryIT {\n  @Container\n  @ServiceConnection\n  static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");\n\n  @Autowired\n  OrderRepository repository;\n\n  @Test\n  void savesAndFindsAnOrder() {\n    Order saved = repository.save(new Order("pen", 2));\n    assertThat(repository.findById(saved.getId())).isPresent();\n  }\n}',
        walkthrough: [
          "The `@Container` field starts a PostgreSQL container for the tests, and `@ServiceConnection` tells Boot to use it for the data source.",
          "The test runs real SQL against the same kind of database as production.",
          "The container is removed after the test run, so every run starts clean.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `@SpringBootTest` for every test.",
          fix: "Use unit and slice tests for most checks.",
        },
        {
          mistake:
            "Testing only against an in-memory database that differs from production.",
          fix: "Use Testcontainers for the database-specific code.",
        },
        {
          mistake: "Expecting service beans to exist in a `@WebMvcTest`.",
          fix: "Provide mocks for them.",
        },
        {
          mistake: "Tests that depend on the order of execution.",
          fix: "Make each test independent.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A test strategy for an order service",
      scenario: "A team wants a fast build and good confidence in releases.",
      body: [
        "Hundreds of unit tests cover the rules. `@WebMvcTest` tests cover the API contract. A handful of Testcontainers tests cover the repositories and one or two `@SpringBootTest` flows cover the whole path.",
        "The suite stays fast, and each failure points to a layer.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tb-slice",
      prompt: "What does @WebMvcTest load?",
      options: [
        "Only the web layer and the controller",
        "The whole application",
        "Only the repositories",
      ],
      answer: 0,
      explanation: "Services and repositories are replaced with mocks.",
    },
    {
      type: "single",
      id: "tb-random",
      prompt: "What does webEnvironment = RANDOM_PORT do?",
      options: [
        "Starts a real server on a free port",
        "Disables the web layer",
        "Mocks the server",
      ],
      answer: 0,
      explanation: "Call it with `TestRestTemplate`.",
    },
    {
      type: "truefalse",
      id: "tb-everything",
      statement: "Every test should be a @SpringBootTest.",
      answer: false,
      explanation: "It is slow. Use unit tests and slices for most checks.",
    },
    {
      type: "blank",
      id: "tb-service-conn",
      prompt:
        "A Testcontainers field annotated with @___ makes Boot configure the connection automatically.",
      answer: "ServiceConnection",
      explanation:
        "Boot detects the container and sets the data source properties.",
    },
  ],
  assignment: {
    title: "A test pyramid",
    task: [
      "Write four unit tests for a service, two `MockMvc` tests for its controller and one Testcontainers test for its repository.",
      "Measure the run time of each group, and explain why you did not use @SpringBootTest for all of them.",
    ],
    checklist: [
      "The unit tests start no Spring context",
      "MockMvc tests check status and JSON",
      "The repository test uses the same database type as production",
    ],
    minutes: 45,
  },
  exercises: [
    {
      slug: "tb-ex",
      title: "A MockMvc test",
      task: [
        "Write a `@WebMvcTest` test that checks that `GET /api/health-check` returns status 200 and the text `ok`.",
      ],
      language: "java",
      starter:
        "@WebMvcTest(StatusController.class)\nclass StatusControllerTest {\n  // your code\n}",
      solution:
        '@WebMvcTest(StatusController.class)\nclass StatusControllerTest {\n  @Autowired\n  MockMvc mockMvc;\n\n  @Test\n  void answersOk() throws Exception {\n    mockMvc.perform(get("/api/health-check"))\n        .andExpect(status().isOk())\n        .andExpect(content().string("ok"));\n  }\n}',
      hints: ["Use `mockMvc.perform(get(...))` and `andExpect`."],
      checklist: [
        "The test starts only the web layer",
        "The status and the body are checked",
        "No network is used",
      ],
    },
  ],
  revisionNotes: [
    "Unit tests for services; slice tests (@WebMvcTest, @DataJpaTest); a few @SpringBootTest",
    "MockMvc tests the web layer without a server",
    "Test settings: test resources, @ActiveProfiles, properties, @TestPropertySource",
    "Testcontainers + @ServiceConnection for a real database",
  ],
  resources: [
    {
      label: "Spring Boot Reference: Testing",
      url: "https://docs.spring.io/spring-boot/reference/testing/index.html",
    },
    {
      label: "Spring Boot Reference: Testing Spring Boot Applications",
      url: "https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html",
    },
    {
      label: "Spring Boot Reference: Testcontainers",
      url: "https://docs.spring.io/spring-boot/reference/testing/testcontainers.html",
    },
  ],
})
