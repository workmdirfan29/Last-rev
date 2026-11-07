import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-framework", {
  slug: "ioc-and-dependency-injection",
  title: "Inversion of control and dependency injection",
  topic: "IoC & DI",
  minutes: 60,
  overview:
    "Understand what the Spring container does, how dependencies are injected, and why constructor injection is preferred.",
  objectives: [
    "Explain inversion of control and dependency injection",
    "Compare constructor, setter and field injection",
    "Explain BeanFactory and ApplicationContext",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What the container does",
      body: [
        "**Inversion of control (IoC)** means that the framework, and not your code, creates the objects and wires them together. **Dependency injection (DI)** is how Spring does it: an object does not build the objects it depends on with `new`. It **declares** them, usually as constructor parameters, and the Spring container provides them. The classes then depend on **interfaces**, and not on concrete classes, so they are loosely coupled and easy to test, because a test can pass in a fake.",
        "The container reads the configuration, creates the **beans**, and injects each one where it is needed. The object does not need to know where its dependency comes from or how it is configured, so swapping an implementation is a configuration change, not a code change. IoC is the principle, and DI is one way to achieve it.",
      ],
    },
    {
      kind: "code",
      heading: "Dependencies come from outside",
      example: {
        title: "Constructor injection",
        language: "java",
        code: "@Service\nclass OrderService {\n  private final OrderRepository repository;\n  private final Clock clock;\n\n  OrderService(OrderRepository repository, Clock clock) {\n    this.repository = repository;\n    this.clock = clock;\n  }\n\n  Order place(String sku) {\n    return repository.save(new Order(sku, clock.instant()));\n  }\n}\n\n// a unit test needs no Spring at all\nOrderService service = new OrderService(fakeRepository, Clock.fixed(Instant.EPOCH, ZoneOffset.UTC));",
        walkthrough: [
          "`OrderService` never creates the repository or the clock with `new`.",
          "Spring finds a bean of each type and passes it to the constructor. A class with a single constructor needs no `@Autowired`.",
          "A test creates the service by hand with fakes, so it needs no container.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Three styles of injection",
      body: [
        "With **constructor injection**, dependencies are constructor parameters. They can be `final`, the object is never half-built, a missing dependency fails at creation, and tests can use plain `new`. With **setter injection**, Spring calls setter methods after creating the object. It suits optional dependencies. With **field injection**, `@Autowired` is placed on a field. It hides what the class needs, and the class cannot be created correctly without the container.",
        "**Prefer constructor injection.** A constructor with many parameters is a hint that the class has too many responsibilities.",
      ],
    },
    {
      kind: "code",
      heading: "Three styles side by side",
      example: {
        title: "Constructor, setter, field",
        language: "java",
        code: "@Service\nclass A {                                   // constructor injection: preferred\n  private final Repo repo;\n  A(Repo repo) { this.repo = repo; }\n}\n\n@Service\nclass B {                                   // setter injection: optional dependency\n  private Repo repo;\n  @Autowired(required = false)\n  void setRepo(Repo repo) { this.repo = repo; }\n}\n\n@Service\nclass C {                                   // field injection: avoid\n  @Autowired private Repo repo;\n}",
        walkthrough: [
          "`A` can make the field `final` and is easy to test.",
          "`B` allows the dependency to be changed after creation, which suits an optional one.",
          "`C` cannot be built with `new` in a test, because nothing sets the field.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "BeanFactory and ApplicationContext",
      body: [
        "`BeanFactory` is the basic container interface: it creates beans and injects dependencies. `ApplicationContext` extends it and adds what applications normally need: event publishing, message sources for internationalisation, resource loading, integration with Spring AOP, and the `Environment` for profiles and properties. It also creates **singleton beans eagerly** at start-up, so configuration errors show early. In practice, applications use an `ApplicationContext`, and Spring Boot creates one for you.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Saying that IoC and DI are the same.",
          fix: "IoC is the principle. DI is one technique.",
        },
        {
          mistake: "Creating a dependency with `new` inside a Spring bean.",
          fix: "Declare it and let Spring inject it.",
        },
        {
          mistake: "Using field injection everywhere because it is short.",
          fix: "Use constructor injection.",
        },
        {
          mistake: "Injecting a dozen dependencies into one class.",
          fix: "Split the class.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Swapping an implementation",
      scenario:
        "A service sends email through a real provider in production, and records messages in memory in tests.",
      body: [
        "`NotificationService` depends on an `EmailSender` interface. The container injects the SMTP implementation in production, and a test creates the service with a fake that records the messages.",
        "The service code is identical in both.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ioc-what",
      prompt: "What is dependency injection?",
      options: [
        "Dependencies are supplied to an object, not created by it",
        "Objects create all their dependencies",
        "A way to copy beans",
      ],
      answer: 0,
      explanation: "The container creates and wires the objects.",
    },
    {
      type: "single",
      id: "ioc-prefer",
      prompt: "Which injection style is preferred?",
      options: ["Constructor injection", "Field injection", "Static injection"],
      answer: 0,
      explanation:
        "It allows final fields, shows the dependencies and makes testing easy.",
    },
    {
      type: "truefalse",
      id: "ioc-ctx",
      statement:
        "ApplicationContext creates singleton beans at start-up by default.",
      answer: true,
      explanation: "That is why configuration errors appear early.",
    },
    {
      type: "single",
      id: "ioc-single-ctor",
      prompt:
        "A class has exactly one constructor. Is @Autowired needed on it?",
      options: ["No", "Yes, always", "Only for interfaces"],
      answer: 0,
      explanation:
        "Since Spring 4.3 a single constructor is used automatically.",
    },
  ],
  assignment: {
    title: "Wire a small application",
    task: [
      "Write an `OrderService`, an `OrderRepository` interface with an in-memory implementation, and a `Notifier` interface.",
      "Wire them with constructor injection in a Spring Boot application, then write a unit test that creates the service with fakes.",
    ],
    checklist: [
      "No bean creates a dependency with new",
      "The unit test starts no Spring context",
      "I can explain IoC versus DI",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "ioc-ex",
      title: "Convert field injection",
      task: [
        "This class uses field injection. Rewrite it with constructor injection and final fields.",
      ],
      language: "java",
      starter:
        "@Service\nclass ReportService {\n  @Autowired private DataSource dataSource;\n  @Autowired private Mailer mailer;\n}",
      solution:
        "@Service\nclass ReportService {\n  private final DataSource dataSource;\n  private final Mailer mailer;\n\n  ReportService(DataSource dataSource, Mailer mailer) {\n    this.dataSource = dataSource;\n    this.mailer = mailer;\n  }\n}",
      hints: ["Make the fields `final` and assign them in the constructor."],
      checklist: [
        "The fields are final",
        "There is one constructor",
        "No @Autowired is needed",
      ],
    },
  ],
  revisionNotes: [
    "IoC: the framework creates and wires objects; DI: dependencies come from outside",
    "Constructor injection: final fields, visible dependencies, easy tests",
    "ApplicationContext = BeanFactory + events, i18n, resources, environment",
    "Singletons are created at start-up",
  ],
  resources: [
    {
      label: "Spring Framework Reference: The IoC Container",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/introduction.html",
    },
    {
      label: "Spring Framework Reference: Dependency Injection",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html",
    },
  ],
})
