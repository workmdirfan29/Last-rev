import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-framework", {
  slug: "beans-scopes-and-lifecycle",
  title: "Beans, scopes and the bean life cycle",
  topic: "Beans & scopes",
  minutes: 80,
  overview:
    "Define beans, choose a scope, understand thread safety of singletons, and use life-cycle callbacks and post-processors.",
  objectives: [
    "Choose between singleton, prototype and web scopes",
    "Explain why singleton beans must be stateless",
    "Describe the bean life cycle and where to put init and clean-up code",
  ],
  prerequisites: ["lesson.spring-framework.wiring-beans-qualifiers-and-cycles"],
  sections: [
    {
      kind: "explain",
      heading: "Scopes",
      body: [
        "A **bean** is an object that the container creates, assembles and manages. You define beans with a stereotype on your own class, or with a `@Bean` method for a class that you do not own. The **scope** says how many instances you get. The default is **`singleton`**: one instance per bean definition, shared everywhere. **`prototype`** creates a new instance every time the bean is requested. In a web application there are also `request`, `session`, `application` and `websocket` scopes. You choose with `@Scope`.",
        "A Spring singleton is one per **container**, which is not the same as the Singleton design pattern, which is one per class loader. Spring does not manage the whole life cycle of a prototype: it does not call its destroy callbacks.",
      ],
    },
    {
      kind: "explain",
      heading: "Singletons must be stateless",
      body: [
        "Many request threads use one singleton bean **at the same time**, and Spring adds no synchronisation. A singleton is safe only if it is **stateless**, or its state is immutable, or you protect the shared mutable state yourself. A mutable field in a service, such as a counter or the current user, is a race condition. Keep per-user state in the request, the session or a database, and let services receive all data through method parameters.",
        "A **prototype injected into a singleton** is injected only **once**, when the singleton is created, so the singleton keeps one prototype instance for its whole life. To get a fresh instance each time, inject an `ObjectProvider<T>` and call `getObject()`, use `@Lookup`, or use a scoped proxy.",
      ],
    },
    {
      kind: "code",
      heading: "Scopes and a provider",
      example: {
        title: "Prototype in a singleton",
        language: "java",
        code: "@Component\n@Scope(\"prototype\")\nclass ReportBuilder {\n  private final StringBuilder text = new StringBuilder();\n  ReportBuilder add(String line) { text.append(line).append('\\n'); return this; }\n  String build() { return text.toString(); }\n}\n\n@Service\nclass ReportService {\n  private final ObjectProvider<ReportBuilder> builders;\n\n  ReportService(ObjectProvider<ReportBuilder> builders) {\n    this.builders = builders;\n  }\n\n  String report(List<String> lines) {\n    ReportBuilder builder = builders.getObject();   // a new instance every time\n    lines.forEach(builder::add);\n    return builder.build();\n  }\n}",
        walkthrough: [
          "`ReportBuilder` holds state, so it must not be a shared singleton.",
          "The service is a singleton, and injects a provider and not the builder itself.",
          "`getObject()` asks the container for a new `ReportBuilder` on every call, so two reports never mix.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The bean life cycle",
      body: [
        "For a singleton, the container **instantiates** the class, **injects** its dependencies, and calls the `Aware` callbacks. It runs `BeanPostProcessor.postProcessBeforeInitialization`, then the initialisation methods: **`@PostConstruct`**, then `afterPropertiesSet` for an `InitializingBean`, then a custom `initMethod`. After `postProcessAfterInitialization`, which is where **proxies** are often created, the bean is ready. When the context closes, the destruction callbacks run: **`@PreDestroy`**, `DisposableBean.destroy`, and a custom `destroyMethod`.",
        "Put initialisation that needs injected dependencies in `@PostConstruct`, because a constructor runs **before** the injection of fields and setters. Use `@PreDestroy` to release resources such as threads or connections. In Spring 6 the annotations are in the `jakarta.annotation` package.",
        "A `BeanFactoryPostProcessor` works on bean **definitions** before any bean is created, for example to resolve `${...}` placeholders. A `BeanPostProcessor` works on bean **instances**, and many Spring features are built on it: `@Autowired` processing, `@PostConstruct` handling and the proxies for `@Transactional`. `@Lazy` delays the creation of a bean until its first use, which can shorten start-up but moves errors to run time.",
      ],
    },
    {
      kind: "code",
      heading: "Init and destroy",
      example: {
        title: "@PostConstruct and @PreDestroy",
        language: "java",
        code: "@Component\nclass CacheWarmer {\n  private final ProductRepository repository;\n  private Map<Long, Product> cache = Map.of();\n\n  CacheWarmer(ProductRepository repository) {\n    this.repository = repository;\n  }\n\n  @PostConstruct\n  void init() {\n    cache = repository.findAll().stream()\n        .collect(Collectors.toMap(Product::getId, p -> p));\n  }\n\n  @PreDestroy\n  void shutdown() {\n    cache = Map.of();\n  }\n}",
        walkthrough: [
          "`init` runs once, after injection and before the bean is used, so the repository is available.",
          "`shutdown` runs when the context closes.",
          "Neither callback runs for a prototype bean on shutdown.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Storing per-user data in a singleton bean.",
          fix: "Keep services stateless.",
        },
        {
          mistake:
            "Injecting a prototype and expecting a new instance per call.",
          fix: "Inject an ObjectProvider.",
        },
        {
          mistake: "Using injected fields in the constructor and getting null.",
          fix: "Use the constructor parameters, or @PostConstruct.",
        },
        {
          mistake: "Expecting @PreDestroy to run for prototype beans.",
          fix: "The container does not manage their destruction.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A cache warm-up",
      scenario:
        "A service loads reference data once at start-up, and releases a thread pool at shutdown.",
      body: [
        "`@PostConstruct` loads the data after the repository has been injected. `@PreDestroy` shuts the pool down, so the application can stop cleanly.",
        "Both callbacks are plain methods, with no Spring interface to implement.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "bs-default",
      prompt: "What is the default bean scope?",
      options: ["singleton", "prototype", "request"],
      answer: 0,
      explanation: "One shared instance per container.",
    },
    {
      type: "single",
      id: "bs-proto-single",
      prompt: "What happens when a prototype is injected into a singleton?",
      options: [
        "It is injected once and kept",
        "A new instance is injected on every call",
        "An exception is thrown",
      ],
      answer: 0,
      explanation: "Use ObjectProvider for a fresh instance.",
    },
    {
      type: "truefalse",
      id: "bs-thread",
      statement: "Spring makes singleton beans thread-safe automatically.",
      answer: false,
      explanation: "Keep them stateless, or protect shared state yourself.",
    },
    {
      type: "blank",
      id: "bs-init",
      prompt:
        "Initialisation code that needs injected dependencies belongs in a method annotated with @___.",
      answer: "PostConstruct",
      explanation: "The constructor runs before field and setter injection.",
    },
  ],
  assignment: {
    title: "Scopes and life cycle",
    task: [
      "Create a singleton service and a prototype builder, and show with logging that the builder is created for each use through an `ObjectProvider`.",
      "Log the order of the constructor, `@PostConstruct` and `@PreDestroy` of a bean.",
    ],
    checklist: [
      "The order of callbacks is logged",
      "No state is kept in a singleton",
      "Two calls get two builders",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "bs-ex",
      title: "Make it stateless",
      task: [
        "This singleton service stores the last user in a field, which is shared by all requests. Rewrite it so that it is safe.",
      ],
      language: "java",
      starter:
        '@Service\nclass GreetingService {\n  private String lastUser;\n\n  String greet(String user) {\n    lastUser = user;\n    return "Hello " + lastUser;\n  }\n}',
      solution:
        '@Service\nclass GreetingService {\n  String greet(String user) {\n    return "Hello " + user;\n  }\n}',
      hints: ["The result can be built from the method parameter alone."],
      checklist: [
        "There is no mutable field",
        "The method uses only its parameter",
        "The class is safe for concurrent use",
      ],
    },
  ],
  revisionNotes: [
    "Scopes: singleton (default), prototype, request, session, application, websocket",
    "Singletons are shared by all threads: keep them stateless",
    "Prototype in a singleton is injected once: use ObjectProvider",
    "Life cycle: construct → inject → @PostConstruct → use → @PreDestroy",
  ],
  resources: [
    {
      label: "Spring Framework Reference: Bean Scopes",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html",
    },
    {
      label: "Spring Framework Reference: Customizing the Nature of a Bean",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html",
    },
    {
      label: "Spring Framework Reference: Container Extension Points",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/factory-extension.html",
    },
  ],
})
