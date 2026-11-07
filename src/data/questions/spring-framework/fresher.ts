import { defineQuestions } from "../author"
import { g } from "../brief"

const S = "https://docs.spring.io/spring-framework/reference"

export default defineQuestions("spring-framework", "fresher", [
  g({
    slug: "what-is-ioc-and-di",
    topic: "IoC & DI",
    d: "easy",
    title: "What are Inversion of Control and Dependency Injection in Spring?",
    kw: ["IoC", "dependency injection", "container", "bean", "loose coupling"],
    intent: "Checks the idea that everything else in Spring is built on.",
    short:
      "Inversion of Control means that the framework, not your code, creates objects and wires them together. Dependency Injection is the way Spring does it: an object does not build or look up the objects it depends on with `new`, it declares them, usually as constructor parameters, and the Spring container provides them. This makes classes loosely coupled, because they depend on interfaces and not on concrete classes, and easy to test, because a test can pass in a fake dependency.",
    detail: [
      "The container reads the configuration, creates the beans, and injects each one where it is needed.",
      "The object does not need to know where its dependency comes from or how it is configured.",
      "Swapping an implementation becomes a configuration change, not a code change.",
    ],
    ex: "An `OrderService` declares an `OrderRepository` in its constructor, and Spring injects a JPA repository in production and a fake one in a test.",
    code: [
      "Dependencies come from outside",
      "@Service\nclass OrderService {\n  private final OrderRepository repository;\n\n  OrderService(OrderRepository repository) {\n    this.repository = repository;\n  }\n\n  Order find(long id) {\n    return repository.findById(id).orElseThrow();\n  }\n}",
      [
        "`OrderService` never creates the repository with `new`.",
        "Spring finds a bean of that type and passes it to the constructor.",
        "A unit test can construct the service with a mock repository.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that IoC and DI are the same thing. DI is one way to achieve IoC.",
      "Creating dependencies with `new` inside a Spring bean.",
    ],
    follow: ["What are the types of dependency injection?"],
    points: [
      "The container creates and wires objects",
      "Classes declare, not create, dependencies",
      "Loose coupling and easy testing",
    ],
    notes:
      "IoC = the framework controls creation. DI = dependencies are supplied from outside.",
    src: [
      [
        "Spring Framework Reference: The IoC Container",
        `${S}/core/beans/introduction.html`,
      ],
      [
        "Spring Framework Reference: Dependency Injection",
        `${S}/core/beans/dependencies/factory-collaborators.html`,
      ],
    ],
  }),
  g({
    slug: "applicationcontext-vs-beanfactory",
    topic: "IoC & DI",
    d: "medium",
    title:
      "What is the difference between `BeanFactory` and `ApplicationContext`?",
    kw: [
      "BeanFactory",
      "ApplicationContext",
      "IoC container",
      "eager initialisation",
      "events",
    ],
    intent:
      "Checks that you know the two container interfaces and which one you use.",
    short:
      "`BeanFactory` is the basic container interface, which creates beans and injects their dependencies. `ApplicationContext` extends it and adds features that applications normally need: event publishing, message sources for internationalisation, resource loading, integration with Spring AOP, and access to the `Environment` for profiles and properties. It also creates singleton beans eagerly at start-up, so configuration errors show early. In practice, applications use `ApplicationContext`, and Spring Boot creates one for you.",
    detail: [
      "`AnnotationConfigApplicationContext` is the implementation for Java-based configuration.",
      "Eager creation of singletons means a missing dependency fails when the application starts, not on the first request.",
      "You can mark a bean `@Lazy` to delay its creation.",
    ],
    ex: "A missing bean definition makes the application fail on start-up with a clear message, because the context creates all singletons at once.",
    mistakes: [
      "Saying that `ApplicationContext` is a completely different thing from `BeanFactory`.",
      "Using a `BeanFactory` directly in a normal application.",
    ],
    follow: ["When are singleton beans created?"],
    points: [
      "ApplicationContext extends BeanFactory",
      "Adds events, i18n, resources, Environment, AOP integration",
      "Eager singleton creation",
    ],
    notes:
      "`ApplicationContext` = `BeanFactory` + events, i18n, resources, environment. Use it.",
    src: [
      [
        "Spring Framework Reference: BeanFactory or ApplicationContext?",
        `${S}/core/beans/introduction.html`,
      ],
      [
        "Spring Framework Reference: Additional Capabilities of the ApplicationContext",
        `${S}/core/beans/context-introduction.html`,
      ],
    ],
  }),
  g({
    slug: "types-of-injection",
    topic: "IoC & DI",
    d: "medium",
    title:
      "What are constructor, setter and field injection, and which do you prefer?",
    kw: [
      "constructor injection",
      "setter injection",
      "field injection",
      "@Autowired",
      "immutability",
    ],
    intent: "Checks that you have an opinion with reasons.",
    short:
      "With constructor injection, dependencies are passed as constructor parameters. With setter injection, Spring calls setter methods after creating the object. With field injection, `@Autowired` is placed directly on a field. Constructor injection is preferred. The dependencies can be `final`, so the object is never in a half-built state. It is clear what the class needs, a missing dependency fails at creation, and tests can create the object with plain `new`. Setter injection suits optional dependencies. Field injection hides the dependencies and needs reflection or Spring to test.",
    detail: [
      "Since Spring 4.3, a class with a single constructor needs no `@Autowired` on it.",
      "A constructor with many parameters is a hint that the class has too many responsibilities.",
      "Lombok's `@RequiredArgsConstructor` can generate the constructor, but the idea is the same.",
    ],
    ex: "A `PaymentService` takes a gateway and a clock in its constructor, and its test passes a fake gateway and a fixed clock.",
    code: [
      "Three styles",
      "@Service\nclass A {                              // constructor injection (preferred)\n  private final Repo repo;\n  A(Repo repo) { this.repo = repo; }\n}\n\n@Service\nclass B {                              // setter injection\n  private Repo repo;\n  @Autowired void setRepo(Repo repo) { this.repo = repo; }\n}\n\n@Service\nclass C {                              // field injection (avoid)\n  @Autowired private Repo repo;\n}",
      [
        "`A` can make the field `final` and is easy to test.",
        "`B` allows the dependency to be changed after creation, which suits optional ones.",
        "`C` cannot be created correctly without the container.",
      ],
      "java",
    ],
    mistakes: [
      "Using field injection everywhere because it is short.",
      "Injecting a dozen dependencies into one constructor without questioning the design.",
    ],
    follow: ["Why does constructor injection make testing easier?"],
    points: [
      "Constructor: required, final, testable",
      "Setter: optional dependencies",
      "Field: avoid",
    ],
    notes:
      "Prefer constructor injection. A single constructor needs no `@Autowired`.",
    src: [
      [
        "Spring Framework Reference: Constructor-based or Setter-based DI?",
        `${S}/core/beans/dependencies/factory-collaborators.html`,
      ],
      [
        "Spring Framework Reference: Using @Autowired",
        `${S}/core/beans/annotation-config/autowired.html`,
      ],
    ],
  }),
  g({
    slug: "autowired-ambiguity",
    topic: "IoC & DI",
    d: "medium",
    title:
      "What happens when several beans match an injection point? (`@Primary`, `@Qualifier`)",
    kw: [
      "@Qualifier",
      "@Primary",
      "NoUniqueBeanDefinitionException",
      "autowiring",
      "by type",
    ],
    intent:
      "Checks that you can resolve ambiguity and know the usual exceptions.",
    short:
      'Spring autowires by type first. If more than one bean of the required type exists, it throws `NoUniqueBeanDefinitionException`, unless it can decide. You can mark one candidate `@Primary` so it is chosen by default, or use `@Qualifier("name")` at the injection point to pick a specific bean by name or qualifier. A parameter name that matches a bean name is also used as a fallback. If no bean matches, you get `NoSuchBeanDefinitionException`, unless the dependency is optional.',
    detail: [
      "To inject all beans of a type, ask for a `List<Type>` or a `Map<String, Type>`.",
      "`@Qualifier` beats `@Primary`, because it is more specific.",
      "`ObjectProvider<Type>` or `@Autowired(required = false)` handles an absent bean.",
    ],
    ex: "Two `PaymentGateway` beans exist, `razorpay` and `stripe`, and the checkout service asks for the `razorpay` one with a qualifier.",
    code: [
      "Picking one of two beans",
      '@Component("razorpay") class RazorpayGateway implements PaymentGateway { }\n@Component("stripe")   class StripeGateway implements PaymentGateway { }\n\n@Service\nclass Checkout {\n  private final PaymentGateway gateway;\n  Checkout(@Qualifier("razorpay") PaymentGateway gateway) {\n    this.gateway = gateway;\n  }\n}',
      [
        "Two beans implement the interface, so injection by type alone is ambiguous.",
        '`@Qualifier("razorpay")` selects the bean with that name.',
        "Without it, the context would fail with `NoUniqueBeanDefinitionException`.",
      ],
      "java",
    ],
    mistakes: [
      "Leaving two candidates without `@Primary` or a qualifier.",
      "Using a bean name as a hidden fallback and then renaming the parameter.",
    ],
    follow: ["How do you inject all implementations of an interface?"],
    points: [
      "Autowiring is by type first",
      "@Primary: default choice, @Qualifier: explicit choice",
      "List<Type> injects all",
    ],
    notes:
      "Several candidates → `@Primary` or `@Qualifier`; none → `NoSuchBeanDefinitionException`.",
    src: [
      [
        "Spring Framework Reference: Fine-tuning Annotation-based Autowiring with @Primary",
        `${S}/core/beans/annotation-config/autowired-primary.html`,
      ],
      [
        "Spring Framework Reference: Fine-tuning with Qualifiers",
        `${S}/core/beans/annotation-config/autowired-qualifiers.html`,
      ],
    ],
  }),
  g({
    slug: "circular-dependencies",
    topic: "IoC & DI",
    d: "hard",
    title: "What is a circular dependency in Spring and how do you solve it?",
    kw: [
      "circular dependency",
      "BeanCurrentlyInCreationException",
      "constructor injection",
      "@Lazy",
      "design",
    ],
    intent:
      "Checks that you can recognise the error and fix the design, not only silence it.",
    short:
      "A circular dependency exists when bean A needs bean B and bean B needs bean A. With constructor injection, Spring cannot create either one first and fails with `BeanCurrentlyInCreationException`. Setter or field injection can sometimes work, because the container can create an object and inject the other one later, but since Spring Boot 2.6 circular references are prohibited by default. The best fix is to change the design: move the shared logic into a third class that both use, or break the cycle with an event or an interface. As a last resort, `@Lazy` on one parameter injects a proxy.",
    detail: [
      "A cycle is a sign that two classes know too much about each other or have the wrong responsibilities.",
      "Setting `spring.main.allow-circular-references=true` hides the problem and should be a temporary measure.",
      "Constructor injection is good here, because it reveals the cycle at start-up.",
    ],
    ex: "`UserService` and `OrderService` call each other, and the fix is a new `UserLookup` that both depend on.",
    mistakes: [
      "Enabling circular references globally to make an error disappear.",
      "Adding `@Lazy` everywhere without understanding the cause.",
    ],
    follow: ["Why does constructor injection fail with a cycle?"],
    points: [
      "A needs B and B needs A",
      "Constructor injection fails fast",
      "Fix the design first",
    ],
    notes:
      "Cycle → `BeanCurrentlyInCreationException`. Redesign; `@Lazy` is the last resort.",
    src: [
      [
        "Spring Framework Reference: Circular dependencies",
        `${S}/core/beans/dependencies/factory-collaborators.html`,
      ],
      [
        "Spring Framework Reference: Lazy-initialized Beans",
        `${S}/core/beans/dependencies/factory-lazy-init.html`,
      ],
    ],
  }),
  g({
    slug: "stereotype-annotations",
    topic: "IoC & DI",
    d: "easy",
    title:
      "What is the difference between `@Component`, `@Service`, `@Repository` and `@Controller`?",
    kw: [
      "@Component",
      "@Service",
      "@Repository",
      "@Controller",
      "stereotype annotations",
    ],
    intent: "Checks that you know which are the same and which add behaviour.",
    short:
      "`@Component` is the generic stereotype that marks a class as a Spring-managed bean found by component scanning. `@Service`, `@Repository` and `@Controller` are specialisations of it that describe the role of the class. `@Service` has no extra behaviour. It marks business logic. `@Repository` marks the data access layer and adds automatic translation of persistence exceptions into Spring's `DataAccessException` hierarchy. `@Controller` marks a web layer class that handles requests, and `@RestController` combines it with `@ResponseBody`.",
    detail: [
      "Using the right stereotype documents the architecture and lets tools and aspects target a layer.",
      "All of them are found by `@ComponentScan` and registered as singleton beans by default.",
      "A bean's default name is the class name with a lower-case first letter.",
    ],
    ex: "`OrderController` calls `OrderService`, which calls `OrderRepository`, and each carries the matching stereotype.",
    mistakes: [
      "Putting `@Component` on everything and losing the layer information.",
      "Expecting `@Service` to add transactions or other behaviour.",
    ],
    follow: ["What does @Repository add?"],
    points: [
      "@Component is the base",
      "@Service: business layer, @Controller: web layer",
      "@Repository adds exception translation",
    ],
    notes:
      "Stereotypes are all `@Component`s; `@Repository` also translates persistence exceptions.",
    src: [
      [
        "Spring Framework Reference: Using Meta-annotations and Composed Annotations",
        `${S}/core/beans/classpath-scanning.html`,
      ],
      [
        "Spring Framework Reference: Classpath Scanning and Managed Components",
        `${S}/core/beans/classpath-scanning.html`,
      ],
    ],
  }),
  g({
    slug: "what-is-a-spring-bean",
    topic: "Beans & scopes",
    d: "easy",
    title: "What is a Spring bean and how do you define one?",
    kw: ["bean", "@Bean", "@Component", "bean definition", "container"],
    intent: "Checks the basic vocabulary of the container.",
    short:
      "A bean is an object that is created, assembled and managed by the Spring IoC container. You define beans in two common ways. You can annotate your own class with a stereotype such as `@Component`, and component scanning finds it. Or, for classes that you do not own, such as a library class, you write a `@Bean` method in a `@Configuration` class that returns the object. Each bean has a name, a type and a scope, and the container controls its life cycle.",
    detail: [
      "A bean name defaults to the method name for `@Bean` methods.",
      "Not every object in an application is a bean. Objects that you create with `new` are not managed.",
      "The container keeps bean definitions, which describe how to create the bean, separately from the instances.",
    ],
    ex: "A `@Bean` method creates a configured `RestClient` object once, and other beans receive it by injection.",
    code: [
      "Two ways to define a bean",
      "@Service\nclass TaxCalculator { }              // found by component scanning\n\n@Configuration\nclass AppConfig {\n  @Bean\n  Clock clock() {                     // a class we do not own\n    return Clock.systemUTC();\n  }\n}",
      [
        "The `@Service` class is picked up by scanning.",
        "The `@Bean` method registers a `Clock` bean named `clock`.",
        "Both can now be injected into other beans.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `new` on a class and expecting Spring to inject its fields.",
      "Defining the same bean twice by scanning and by a `@Bean` method.",
    ],
    follow: ["When would you use @Bean instead of @Component?"],
    points: [
      "Container-managed object",
      "@Component for your classes, @Bean for others",
      "Has a name, type and scope",
    ],
    notes:
      "Bean = container-managed object. `@Component` (own classes) or `@Bean` (any class).",
    src: [
      [
        "Spring Framework Reference: Bean Overview",
        `${S}/core/beans/definition.html`,
      ],
      [
        "Spring Framework Reference: Using the @Bean Annotation",
        `${S}/core/beans/java/bean-annotation.html`,
      ],
    ],
  }),
  g({
    slug: "bean-scopes",
    topic: "Beans & scopes",
    d: "easy",
    title: "What are the bean scopes in Spring?",
    kw: ["bean scope", "singleton", "prototype", "request", "session"],
    intent: "Checks that you know how many instances you get and when.",
    short:
      'The default scope is `singleton`: the container creates one instance per bean definition and shares it everywhere. `prototype` creates a new instance every time the bean is requested. In a web application there are also `request` (one instance per HTTP request), `session` (one per HTTP session), `application` (one per `ServletContext`) and `websocket`. You set the scope with `@Scope`, as in `@Scope("prototype")`. Singleton fits stateless services, and the narrower scopes fit objects that hold state for one user or one request.',
    detail: [
      "A singleton in Spring is one per container and per bean definition. It is not the same as the Singleton design pattern, which is one per class loader.",
      "Spring does not manage the whole life cycle of prototype beans. It does not call their destroy callbacks.",
      "Request and session scoped beans need a scoped proxy to be injected into singletons.",
    ],
    ex: "A `ShoppingCart` is session scoped, while the `ProductService` it uses is a singleton.",
    code: [
      "Choosing a scope",
      '@Component\n@Scope("prototype")\nclass ReportBuilder { }\n\n@Component\n@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)\nclass ShoppingCart { }',
      [
        "Each request for `ReportBuilder` gives a new object.",
        "`ShoppingCart` lives as long as the session, and the proxy lets singletons use it.",
      ],
      "java",
    ],
    mistakes: [
      "Storing per-user data in a singleton bean.",
      "Saying that the Spring singleton and the Singleton pattern are the same.",
    ],
    follow: ["Is a singleton bean thread-safe?"],
    points: [
      "singleton (default), prototype",
      "request, session, application, websocket for web apps",
      "Singleton = once per container",
    ],
    notes:
      "singleton (default), prototype, request, session, application, websocket.",
    src: [
      [
        "Spring Framework Reference: Bean Scopes",
        `${S}/core/beans/factory-scopes.html`,
      ],
      [
        "Spring Framework Reference: Bean Overview",
        `${S}/core/beans/definition.html`,
      ],
    ],
  }),
  g({
    slug: "singleton-bean-thread-safety",
    topic: "Beans & scopes",
    d: "medium",
    title: "Are Spring singleton beans thread-safe?",
    kw: [
      "singleton",
      "thread safety",
      "stateless",
      "shared state",
      "concurrency",
    ],
    intent: "Checks a common mistake in web applications.",
    short:
      "No. Spring creates one shared instance of a singleton bean, and many request threads use it at the same time, but Spring does not add any synchronisation. A singleton is only safe if it is stateless, or if its state is immutable, or if the shared mutable state is protected by your own code. The usual design is to keep services and repositories stateless, so that all data comes from method parameters and local variables, and to keep per-user state in the request, the session or a database.",
    detail: [
      "A mutable field in a service, such as a counter or a `SimpleDateFormat`, is a race condition waiting to happen.",
      "Use `AtomicInteger`, a concurrent collection, or a lock when shared state is unavoidable.",
      "Narrower scopes, like `request`, give each request its own instance.",
    ],
    ex: "A controller that stores the current user in an instance field shows one user's data to another when two requests overlap.",
    mistakes: [
      "Adding an instance field to a service to remember something between calls.",
      "Assuming that Spring makes beans thread-safe.",
    ],
    follow: ["How would you keep a request-specific value?"],
    points: [
      "Shared by all threads",
      "Spring adds no synchronisation",
      "Keep singletons stateless",
    ],
    notes:
      "Singleton ≠ thread-safe. Keep beans stateless or protect shared state yourself.",
    src: [
      [
        "Spring Framework Reference: Bean Scopes (singleton)",
        `${S}/core/beans/factory-scopes.html`,
      ],
      [
        "Spring Framework Reference: The Singleton Scope",
        `${S}/core/beans/factory-scopes.html`,
      ],
    ],
  }),
  g({
    slug: "prototype-in-singleton",
    topic: "Beans & scopes",
    d: "hard",
    title: "What happens when a prototype bean is injected into a singleton?",
    kw: ["prototype", "singleton", "ObjectProvider", "@Lookup", "scoped proxy"],
    intent: "Checks that you understand when injection happens.",
    short:
      "Injection happens once, when the singleton is created, so the singleton receives one prototype instance and keeps it for its whole life. The prototype does not give a new instance for each use, which is usually not what you wanted. To get a fresh instance each time, ask the container at the moment of use: inject an `ObjectProvider<T>` or `Provider<T>` and call `getObject()`, use a method with `@Lookup`, or make the prototype a scoped proxy.",
    detail: [
      "The same applies to request and session scoped beans, which are solved by a scoped proxy.",
      "`ObjectProvider` also offers `getIfAvailable` for optional beans.",
      "Often a plain factory method or a `new` in the service is simpler than a prototype bean.",
    ],
    ex: "A singleton `ReportService` injects `ObjectProvider<ReportBuilder>` and calls `getObject()` for every report.",
    code: [
      "A fresh prototype each time",
      "@Service\nclass ReportService {\n  private final ObjectProvider<ReportBuilder> builders;\n\n  ReportService(ObjectProvider<ReportBuilder> builders) {\n    this.builders = builders;\n  }\n\n  String report() {\n    ReportBuilder builder = builders.getObject();   // new instance\n    return builder.build();\n  }\n}",
      [
        "The provider is injected once, but it is only a handle to the container.",
        "`getObject()` asks the container for a new `ReportBuilder` every time.",
      ],
      "java",
    ],
    mistakes: [
      "Injecting a prototype directly and expecting a new instance per call.",
      "Forgetting that the container does not destroy prototype beans for you.",
    ],
    follow: ["What is a scoped proxy?"],
    points: [
      "Injection happens once",
      "Use ObjectProvider, @Lookup or a scoped proxy",
      "Prototype destroy callbacks are not called",
    ],
    notes:
      "A prototype injected into a singleton is injected once. Use `ObjectProvider` for fresh instances.",
    src: [
      [
        "Spring Framework Reference: Singleton Beans with Prototype-bean Dependencies",
        `${S}/core/beans/factory-scopes.html`,
      ],
      [
        "Spring Framework Reference: Method Injection",
        `${S}/core/beans/dependencies/factory-method-injection.html`,
      ],
    ],
  }),
  g({
    slug: "bean-lifecycle",
    topic: "Beans & scopes",
    d: "medium",
    title: "Explain the life cycle of a Spring bean.",
    kw: [
      "bean lifecycle",
      "@PostConstruct",
      "@PreDestroy",
      "BeanPostProcessor",
      "InitializingBean",
    ],
    intent:
      "Checks that you know the order of the steps and where to put initialisation code.",
    short:
      "For a singleton bean, the container instantiates the class, injects its dependencies, and then calls any `Aware` callbacks. It runs `BeanPostProcessor.postProcessBeforeInitialization`, then the initialisation methods: `@PostConstruct`, then `afterPropertiesSet` if the bean implements `InitializingBean`, and then a custom `initMethod`. After `postProcessAfterInitialization`, which is where proxies are often created, the bean is ready for use. When the context closes, the destruction callbacks run in a similar order: `@PreDestroy`, `DisposableBean.destroy` and a custom `destroyMethod`.",
    detail: [
      "Put initialisation that needs injected dependencies in `@PostConstruct`, because the constructor runs before the injection of fields and setters.",
      "Use `@PreDestroy` to release resources such as threads or connections.",
      "In Spring 6, the annotations are in the `jakarta.annotation` package.",
    ],
    ex: "A cache bean loads its initial data in `@PostConstruct` and stops its refresh thread in `@PreDestroy`.",
    code: [
      "Init and destroy callbacks",
      '@Component\nclass CacheWarmer {\n  @PostConstruct\n  void init() {\n    System.out.println("loading cache");\n  }\n\n  @PreDestroy\n  void shutdown() {\n    System.out.println("stopping cache");\n  }\n}',
      [
        "`init` runs once, after injection and before the bean is used.",
        "`shutdown` runs when the context closes.",
      ],
      "java",
    ],
    mistakes: [
      "Using injected fields in the constructor and getting `null`.",
      "Expecting `@PreDestroy` to run for prototype beans.",
    ],
    follow: ["What is a BeanPostProcessor?"],
    points: [
      "Instantiate → inject → Aware → post-processors → init → ready",
      "@PostConstruct after injection",
      "@PreDestroy on close",
    ],
    notes: "Create → inject → `@PostConstruct` → ready → `@PreDestroy`.",
    src: [
      [
        "Spring Framework Reference: Customizing the Nature of a Bean",
        `${S}/core/beans/factory-nature.html`,
      ],
      [
        "Spring Framework Reference: @PostConstruct and @PreDestroy",
        `${S}/core/beans/annotation-config/postconstruct-and-predestroy-annotations.html`,
      ],
    ],
  }),
  g({
    slug: "beanpostprocessor",
    topic: "Beans & scopes",
    d: "hard",
    title:
      "What is a `BeanPostProcessor`, and how is it different from a `BeanFactoryPostProcessor`?",
    kw: [
      "BeanPostProcessor",
      "BeanFactoryPostProcessor",
      "extension point",
      "proxy",
      "PropertySourcesPlaceholderConfigurer",
    ],
    intent: "Checks that you know the container's extension points.",
    short:
      "A `BeanFactoryPostProcessor` works on bean definitions, the recipes, before any bean is created, and it can change them. The placeholder replacement of `${...}` values is an example. A `BeanPostProcessor` works on bean instances, after they are created, with callbacks before and after the initialisation methods, and it can wrap or replace the bean. Many Spring features are built on it: `@Autowired` processing, `@PostConstruct` handling, and the creation of AOP proxies for `@Transactional`.",
    detail: [
      "Beans that implement these interfaces are created very early, so they should have few dependencies.",
      "You rarely write one, but knowing them explains how annotations get their effect.",
      "A post-processor that returns a proxy instead of the bean changes what other beans receive.",
    ],
    ex: "A custom `BeanPostProcessor` could wrap every bean annotated with `@Timed` in a proxy that logs the duration.",
    mistakes: [
      "Mixing up the two. One edits definitions, the other edits instances.",
      "Injecting many beans into a post-processor, which creates them too early.",
    ],
    follow: ["How does @Transactional get applied to a bean?"],
    points: [
      "BeanFactoryPostProcessor: definitions, before creation",
      "BeanPostProcessor: instances, around initialisation",
      "Used for proxies and annotation handling",
    ],
    notes:
      "BFPP edits definitions. BPP wraps or changes instances (proxies, `@Autowired`).",
    src: [
      [
        "Spring Framework Reference: Container Extension Points",
        `${S}/core/beans/factory-extension.html`,
      ],
      [
        "Spring Framework Reference: Customizing Beans by Using a BeanPostProcessor",
        `${S}/core/beans/factory-extension.html`,
      ],
    ],
  }),
  g({
    slug: "lazy-initialization",
    topic: "Beans & scopes",
    d: "easy",
    title: "What does `@Lazy` do?",
    kw: ["@Lazy", "lazy initialisation", "start-up time", "eager", "singleton"],
    intent:
      "Checks that you know the trade-off between start-up and first use.",
    short:
      "By default, the `ApplicationContext` creates every singleton bean at start-up, which finds configuration problems early. `@Lazy` on a bean tells the container to create it only when it is first needed, which can shorten start-up and avoid creating beans that may never be used. The cost is that errors in that bean appear later, at the first request, and that request is slower. On an injection point, `@Lazy` injects a proxy that creates the real bean on first use, which is sometimes used to break a dependency cycle.",
    detail: [
      "Lazy initialisation can be enabled for the whole application in Spring Boot with a property, but it hides problems until runtime.",
      "A lazy bean that another eager bean depends on is created anyway.",
      "Use it for expensive, rarely used beans.",
    ],
    ex: "A heavy report generator that is used once a month is lazy, so it does not slow down every start-up.",
    mistakes: [
      "Making everything lazy and discovering configuration errors in production.",
      "Expecting a lazy bean to stay uncreated when an eager bean needs it.",
    ],
    follow: ["When are singleton beans created by default?"],
    points: [
      "Default: eager at start-up",
      "@Lazy: create on first use",
      "Trade-off: faster start vs later errors",
    ],
    notes:
      "`@Lazy` delays bean creation to first use. Errors then appear later.",
    src: [
      [
        "Spring Framework Reference: Lazy-initialized Beans",
        `${S}/core/beans/dependencies/factory-lazy-init.html`,
      ],
      [
        "Spring Framework Reference: Bean Overview",
        `${S}/core/beans/definition.html`,
      ],
    ],
  }),
  g({
    slug: "what-is-aop",
    topic: "AOP",
    d: "easy",
    title: "What is Aspect-Oriented Programming and what are its main terms?",
    kw: ["AOP", "aspect", "advice", "pointcut", "join point"],
    intent: "Checks that you know the purpose of AOP and its vocabulary.",
    short:
      "AOP separates cross-cutting concerns, such as logging, security checks, transactions and timing, from business logic, so that they are written once and applied to many places instead of being copied into each method. The main terms are: an aspect, a class that holds the cross-cutting logic; a join point, a point in the program where an aspect can act, which in Spring AOP is always a method execution; advice, the action taken at a join point; a pointcut, an expression that selects which join points the advice applies to; and weaving, the linking of aspects with the target code.",
    detail: [
      "The target object is the bean that is advised, and the proxy is the object that Spring puts in front of it.",
      "Spring AOP is proxy-based, so it is simple and covers the common cases.",
      "Typical Spring uses are `@Transactional`, `@Cacheable` and security annotations.",
    ],
    ex: "A logging aspect writes the duration of every method in the service package, without any code change in those methods.",
    mistakes: [
      "Using AOP for business logic that belongs in the services.",
      "Mixing up an advice (what to do) and a pointcut (where to do it).",
    ],
    follow: ["What types of advice are there?"],
    points: [
      "Cross-cutting concerns in one place",
      "Aspect, join point, advice, pointcut",
      "Spring AOP is proxy-based",
    ],
    notes:
      "Aspect = module. Advice = action. Pointcut = where. Join point = method execution.",
    src: [
      [
        "Spring Framework Reference: Aspect Oriented Programming with Spring",
        `${S}/core/aop.html`,
      ],
      [
        "Spring Framework Reference: AOP Concepts",
        `${S}/core/aop/introduction-defn.html`,
      ],
    ],
  }),
  g({
    slug: "aop-advice-types",
    topic: "AOP",
    d: "medium",
    title:
      "What are the types of advice in Spring AOP? Show an `@Around` example.",
    kw: ["@Before", "@After", "@AfterReturning", "@AfterThrowing", "@Around"],
    intent: "Checks that you can choose an advice type and write one.",
    short:
      "`@Before` runs before the method. `@AfterReturning` runs after it returns normally, and can read the returned value. `@AfterThrowing` runs when the method throws an exception. `@After` (finally) runs after the method in both cases. `@Around` is the most powerful: it wraps the call, receives a `ProceedingJoinPoint`, decides whether and when to call `proceed()`, and can change the arguments, the result or the exception. Use the weakest advice that does the job, and `@Around` for timing, caching and retry.",
    detail: [
      "In an `@Around` advice, forgetting to call `proceed()` means that the target method never runs.",
      "The advice method must return the result of `proceed()`, or the caller gets `null`.",
      "Aspects must be Spring beans, for example with `@Component`, and `@EnableAspectJAutoProxy` must be active, which Spring Boot does.",
    ],
    ex: "A timing aspect measures every call to a method in the service layer and logs a warning if it takes more than a second.",
    code: [
      "An @Around timer",
      '@Aspect\n@Component\nclass TimingAspect {\n\n  @Around("execution(* com.shop.service..*(..))")\n  Object time(ProceedingJoinPoint pjp) throws Throwable {\n    long start = System.nanoTime();\n    try {\n      return pjp.proceed();\n    } finally {\n      long ms = (System.nanoTime() - start) / 1_000_000;\n      System.out.println(pjp.getSignature() + " took " + ms + " ms");\n    }\n  }\n}',
      [
        "The pointcut selects every method in the `service` package and below.",
        "`proceed()` calls the real method, and its result is returned.",
        "`finally` makes sure the time is logged even when the method throws.",
      ],
      "java",
    ],
    mistakes: [
      "Not calling `proceed()` or not returning its result.",
      "Using `@Around` where a simple `@Before` is enough.",
    ],
    follow: ["How do you write a pointcut expression?"],
    points: [
      "Before, AfterReturning, AfterThrowing, After, Around",
      "Around controls the call with proceed()",
      "Return the result of proceed()",
    ],
    notes:
      "Five advice types; `@Around` wraps the call and must call and return `proceed()`.",
    src: [
      [
        "Spring Framework Reference: Declaring Advice",
        `${S}/core/aop/ataspectj/advice.html`,
      ],
      [
        "Spring Framework Reference: Declaring a Pointcut",
        `${S}/core/aop/ataspectj/pointcuts.html`,
      ],
    ],
  }),
  g({
    slug: "how-spring-aop-works",
    topic: "AOP",
    d: "hard",
    title: "How does Spring AOP work? JDK proxies and CGLIB",
    kw: [
      "proxy",
      "JDK dynamic proxy",
      "CGLIB",
      "target object",
      "runtime weaving",
    ],
    intent:
      "Checks that you know AOP in Spring is done with proxies at run time.",
    short:
      "Spring AOP creates a proxy object that wraps the target bean and has the same type. Callers get the proxy from the container, and when they call a method, the proxy runs the matching advice and then calls the real method. If the target implements an interface, Spring can use a JDK dynamic proxy, which implements those interfaces. Otherwise it uses CGLIB, which creates a subclass of the target at run time. Spring Boot uses CGLIB proxies by default. Because the proxy is a subclass, `final` classes and `final` methods cannot be advised.",
    detail: [
      "The proxy is created by a `BeanPostProcessor` after the bean is initialised.",
      "Only calls that go through the proxy are advised.",
      "This weaving at run time needs no special compiler or agent.",
    ],
    ex: "When you inject `OrderService` and it has `@Transactional` methods, the object you actually receive is a proxy around the real service.",
    mistakes: [
      "Declaring a class or method `final` and wondering why the advice is skipped.",
      "Thinking that `this` inside the bean is the proxy.",
    ],
    follow: ["Why does self-invocation bypass the advice?"],
    points: [
      "Proxy wraps the target",
      "JDK proxy for interfaces, CGLIB otherwise",
      "Run-time weaving with no special compiler",
    ],
    notes:
      "Spring AOP = proxies (JDK or CGLIB). Final classes and methods cannot be proxied by CGLIB.",
    src: [
      [
        "Spring Framework Reference: Proxying Mechanisms",
        `${S}/core/aop/proxying.html`,
      ],
      [
        "Spring Framework Reference: Understanding AOP Proxies",
        `${S}/core/aop/proxying.html`,
      ],
    ],
  }),
  g({
    slug: "self-invocation-problem",
    topic: "AOP",
    d: "hard",
    title:
      "Why does calling a `@Transactional` method from another method in the same class not work?",
    kw: ["self-invocation", "proxy", "@Transactional", "this", "internal call"],
    intent: "Checks one of the most common AOP surprises in real projects.",
    short:
      "Advice such as `@Transactional` is applied by a proxy that sits in front of the bean. When another bean calls the method, the call goes through the proxy, and the advice runs. When one method of the bean calls another method of the same bean, it is a plain Java call on `this`, the real object, so the proxy is skipped and the advice does not run. The usual fixes are to move the method to another bean and inject it, so the call goes through a proxy, or to restructure the code so that the transactional boundary is at the entry method.",
    detail: [
      "Injecting the bean into itself, or using the `AopContext`, can work but is a smell.",
      "AspectJ weaving, with its compile-time or load-time mode, does not have this limitation.",
      "The same rule applies to `@Cacheable`, `@Async` and `@Retryable`.",
    ],
    ex: "`process()` calls `this.saveAudit()`, which is `@Transactional(REQUIRES_NEW)`, and no new transaction is started.",
    code: [
      "The proxy is bypassed",
      "@Service\nclass OrderService {\n\n  public void process(Order order) {\n    saveAudit(order);          // plain call on this: no proxy, no new transaction\n  }\n\n  @Transactional(propagation = Propagation.REQUIRES_NEW)\n  public void saveAudit(Order order) { /* ... */ }\n}\n\n// fix: move saveAudit to AuditService and inject it,\n// so that the call goes through the proxy",
      [
        "`process` calls `saveAudit` directly on the real object.",
        "The transactional advice only exists on the proxy, so it is not applied.",
        "In a separate `AuditService` bean, the same call would go through the proxy.",
      ],
      "java",
    ],
    mistakes: [
      "Putting `@Transactional` on a private or internal method and expecting it to work.",
      "Not testing that the transaction really starts.",
    ],
    follow: ["How does AspectJ differ from Spring AOP here?"],
    points: [
      "Only calls through the proxy are advised",
      "this.method() bypasses the proxy",
      "Move the method to another bean",
    ],
    notes:
      "Self-invocation skips the proxy, so `@Transactional`, `@Cacheable`, `@Async` do not apply.",
    src: [
      [
        "Spring Framework Reference: Understanding AOP Proxies",
        `${S}/core/aop/proxying.html`,
      ],
      [
        "Spring Framework Reference: Using @Transactional",
        `${S}/data-access/transaction/declarative/annotations.html`,
      ],
    ],
  }),
  g({
    slug: "transactional-basics",
    topic: "AOP",
    d: "medium",
    title: "How does `@Transactional` work, and when does it roll back?",
    kw: [
      "@Transactional",
      "rollback",
      "checked exception",
      "propagation",
      "declarative transaction",
    ],
    intent:
      "Checks that you know the default rollback rule and the proxy behind it.",
    short:
      "`@Transactional` is declarative transaction management built on AOP. A proxy starts a transaction before the method, and commits when it returns normally, or rolls back when it throws. By default, it rolls back only for unchecked exceptions (`RuntimeException`) and `Error`, and it commits for checked exceptions, unless you add `rollbackFor`. The default propagation is `REQUIRED`: the method joins an existing transaction or starts a new one. Because it uses a proxy, it works on calls from other beans, and it is applied to public methods by default.",
    detail: [
      "`readOnly = true` is a hint that the transaction does not change data, and lets the framework and database optimise.",
      "`REQUIRES_NEW` suspends the current transaction and starts an independent one.",
      "If you catch the exception inside the method, the proxy never sees it, so the transaction commits.",
    ],
    ex: "A transfer method that debits one account and credits another is `@Transactional`, so a failure in the second step undoes the first.",
    code: [
      "A transaction with a checked-exception rollback",
      "@Service\nclass TransferService {\n\n  @Transactional(rollbackFor = InsufficientFundsException.class)\n  public void transfer(long from, long to, BigDecimal amount) throws InsufficientFundsException {\n    accounts.debit(from, amount);\n    accounts.credit(to, amount);\n  }\n}",
      [
        "A transaction starts when `transfer` is called through the proxy.",
        "An unchecked exception rolls it back by default.",
        "`rollbackFor` also makes the checked `InsufficientFundsException` roll it back.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting a rollback for a checked exception without `rollbackFor`.",
      "Catching the exception inside the method and hiding it from the proxy.",
    ],
    follow: ["What are the propagation levels?"],
    points: [
      "Built on a proxy",
      "Rolls back on unchecked exceptions and Errors by default",
      "Default propagation REQUIRED",
    ],
    notes:
      "`@Transactional`: commit on return, rollback on RuntimeException/Error; `rollbackFor` for checked.",
    src: [
      [
        "Spring Framework Reference: Using @Transactional",
        `${S}/data-access/transaction/declarative/annotations.html`,
      ],
      [
        "Spring Framework Reference: Rolling Back a Declarative Transaction",
        `${S}/data-access/transaction/declarative/rolling-back.html`,
      ],
    ],
  }),
  g({
    slug: "spring-aop-vs-aspectj",
    topic: "AOP",
    d: "hard",
    title: "What is the difference between Spring AOP and AspectJ?",
    kw: ["Spring AOP", "AspectJ", "weaving", "proxy", "join points"],
    intent:
      "Checks that you know the limits of Spring's approach and when another tool is needed.",
    short:
      "Spring AOP is proxy-based and works at run time, and it supports only method-execution join points on Spring beans. It is simple, needs no special build step, and covers the usual needs such as transactions and logging. AspectJ is a complete AOP language and weaves aspects into the bytecode at compile time, post-compile time or load time. It can advise field access, constructors, static methods and objects that are not Spring beans, and it does not have the self-invocation limit, but it needs an extra compiler or agent and is more complex. Spring can use AspectJ's annotation style and pointcut language for both.",
    detail: [
      "The `@Aspect` annotation style that Spring uses comes from AspectJ, but Spring's weaving is proxy-based.",
      "Use AspectJ only when proxy-based AOP is not enough.",
      "Spring supports load-time weaving with `@EnableLoadTimeWeaving`.",
    ],
    ex: "A project that needs to audit field changes of non-Spring domain objects uses AspectJ, while the rest of the application uses `@Transactional` through Spring AOP.",
    mistakes: [
      "Choosing AspectJ without a need that Spring AOP cannot meet.",
      "Expecting Spring AOP to advise objects created with `new`.",
    ],
    follow: ["What are the weaving types?"],
    points: [
      "Spring AOP: proxies, method execution, beans only",
      "AspectJ: bytecode weaving, any join point",
      "Start with Spring AOP",
    ],
    notes:
      "Spring AOP = proxies on beans. AspectJ = bytecode weaving, more join points, more setup.",
    src: [
      [
        "Spring Framework Reference: Choosing Which AOP Declaration Style to Use",
        `${S}/core/aop/choosing.html`,
      ],
      [
        "Spring Framework Reference: Using AspectJ with Spring Applications",
        `${S}/core/aop/using-aspectj.html`,
      ],
    ],
  }),
  g({
    slug: "java-config-configuration-bean",
    topic: "Configuration",
    d: "easy",
    title: "What are `@Configuration` and `@Bean`?",
    kw: [
      "@Configuration",
      "@Bean",
      "Java-based configuration",
      "AnnotationConfigApplicationContext",
      "bean method",
    ],
    intent: "Checks the standard way to configure beans in code.",
    short:
      "`@Configuration` marks a class as a source of bean definitions. Each method annotated with `@Bean` in it returns an object that becomes a bean, named after the method unless you give a name. This Java-based configuration is type-safe and refactoring-friendly, and it can create beans from classes that you cannot annotate, such as library classes. Dependencies can be passed as method parameters, which Spring injects. It replaced the XML configuration of older Spring versions.",
    detail: [
      "A `@Bean` method can take parameters that are other beans.",
      "`initMethod` and `destroyMethod` attributes can set callbacks.",
      "Conditional annotations such as `@Profile` and `@ConditionalOnProperty` can switch bean methods on and off.",
    ],
    ex: "An `AppConfig` class defines a `ModelMapper` bean and a `DataSource`, each in its own method.",
    code: [
      "A configuration class",
      "@Configuration\nclass AppConfig {\n\n  @Bean\n  Clock clock() {\n    return Clock.systemUTC();\n  }\n\n  @Bean\n  TokenService tokenService(Clock clock) {\n    return new TokenService(clock, Duration.ofMinutes(15));\n  }\n}",
      [
        "`clock()` registers a `Clock` bean.",
        "`tokenService` receives that bean as a parameter, so Spring injects it.",
        "No XML is needed.",
      ],
      "java",
    ],
    mistakes: [
      "Creating the same dependency with `new` inside a `@Bean` method instead of taking it as a parameter.",
      "Putting business logic in a configuration class.",
    ],
    follow: ["What does the container do with @Bean methods?"],
    points: [
      "@Configuration: a source of bean definitions",
      "@Bean: method returns a bean",
      "Parameters are injected",
    ],
    notes:
      "`@Configuration` class with `@Bean` methods = Java-based bean definitions.",
    src: [
      [
        "Spring Framework Reference: Using the @Configuration annotation",
        `${S}/core/beans/java/configuration-annotation.html`,
      ],
      [
        "Spring Framework Reference: Using the @Bean Annotation",
        `${S}/core/beans/java/bean-annotation.html`,
      ],
    ],
  }),
  g({
    slug: "component-scanning",
    topic: "Configuration",
    d: "easy",
    title: "What is component scanning?",
    kw: [
      "@ComponentScan",
      "component scanning",
      "base package",
      "stereotype",
      "@SpringBootApplication",
    ],
    intent: "Checks that you know how annotated classes become beans.",
    short:
      'Component scanning makes Spring search the class path under given packages for classes annotated with `@Component` or one of its specialisations, and register them as beans. You enable it with `@ComponentScan("com.shop")` on a configuration class. In Spring Boot, `@SpringBootApplication` includes it and scans the package of the main class and everything below. Classes outside that package are not found unless you add them with `scanBasePackages`, or import them. Filters can include or exclude classes.',
    detail: [
      "Scanning is convenient, but a very broad base package slows down start-up.",
      "The explicit alternative is a `@Bean` method or `@Import`.",
      "Test slices use filters so that they load only some of the beans.",
    ],
    ex: "The application's main class is in `com.shop`, so beans in `com.shop.orders` are found, but beans in `com.partner.lib` are not.",
    mistakes: [
      "Putting a bean outside the scanned packages and getting a `NoSuchBeanDefinitionException`.",
      "Scanning the root of a very large class path.",
    ],
    follow: ["How do you include a package outside the main class's package?"],
    points: [
      "Finds @Component classes under a package",
      "@SpringBootApplication scans its own package and below",
      "scanBasePackages for others",
    ],
    notes:
      "`@ComponentScan` registers annotated classes as beans. Keep beans under the scanned package.",
    src: [
      [
        "Spring Framework Reference: Classpath Scanning and Managed Components",
        `${S}/core/beans/classpath-scanning.html`,
      ],
      [
        "Spring Framework Reference: Using @ComponentScan",
        `${S}/core/beans/classpath-scanning.html`,
      ],
    ],
  }),
  g({
    slug: "configuration-proxy-bean-methods",
    topic: "Configuration",
    d: "hard",
    title:
      "Why does calling one `@Bean` method from another return the same singleton?",
    kw: [
      "@Configuration",
      "CGLIB",
      "proxyBeanMethods",
      "inter-bean dependencies",
      "lite mode",
    ],
    intent: "Checks that you know how `@Configuration` classes are processed.",
    short:
      "Classes annotated with `@Configuration` are subclassed by Spring with CGLIB. The subclass overrides each `@Bean` method so that a call to it first checks whether the singleton bean already exists in the container, and returns it, instead of running the method body again. So inside a configuration class, writing `return new Service(repo())`, where `repo()` is another `@Bean` method, gives the shared bean and not a new object. In a plain `@Component` class or with `proxyBeanMethods = false`, there is no such proxy, and a direct call creates a new object each time.",
    detail: [
      "Setting `proxyBeanMethods = false` speeds up start-up and avoids the proxy, so Spring Boot uses it in its own auto-configuration.",
      "With that setting, pass other beans as method parameters instead of calling the methods.",
      "This is also why configuration classes cannot be `final`.",
    ],
    ex: "Two beans that both call `dataSource()` inside the configuration class receive the same `DataSource` object.",
    mistakes: [
      "Calling a `@Bean` method directly in a lite-mode class and expecting a singleton.",
      "Making a `@Configuration` class `final`.",
    ],
    follow: ["What does proxyBeanMethods = false change?"],
    points: [
      "@Configuration classes are CGLIB subclasses",
      "Bean method calls return the singleton",
      "proxyBeanMethods = false removes the proxy",
    ],
    notes:
      "`@Configuration` is proxied, so inter-bean calls return singletons. With `proxyBeanMethods = false`, pass beans as parameters.",
    src: [
      [
        "Spring Framework Reference: Using the @Configuration annotation",
        `${S}/core/beans/java/configuration-annotation.html`,
      ],
      [
        "Spring Framework Reference: Lite @Bean Mode",
        `${S}/core/beans/java/basic-concepts.html`,
      ],
    ],
  }),
  g({
    slug: "value-and-property-sources",
    topic: "Configuration",
    d: "medium",
    title:
      "How do you read configuration values with `@Value` and `@PropertySource`?",
    kw: ["@Value", "@PropertySource", "placeholder", "SpEL", "Environment"],
    intent: "Checks that you can externalise settings in plain Spring.",
    short:
      '`@PropertySource("classpath:app.properties")` on a configuration class adds a properties file to the `Environment`. `@Value("${app.name}")` injects a property into a field or parameter, with a default as in `${app.timeout:30}`. `@Value("#{...}")` evaluates a Spring Expression Language expression. You can also inject the `Environment` and call `getProperty("app.name")`. Spring Boot reads `application.properties` automatically, and for groups of related settings, `@ConfigurationProperties` is cleaner than many `@Value` fields.',
    detail: [
      "A placeholder without a default that cannot be resolved makes start-up fail.",
      "Values are converted to the target type, for example `int`, `Duration` or `List<String>`.",
      "Never put secrets in the properties file in the repository.",
    ],
    ex: 'A `MailSender` gets its host with `@Value("${mail.host}")` and its timeout with a default of 30 seconds.',
    code: [
      "Reading properties",
      '@Configuration\n@PropertySource("classpath:app.properties")\nclass AppConfig { }\n\n@Component\nclass MailSender {\n  @Value("${mail.host}")\n  private String host;\n\n  @Value("${mail.timeout:30}")\n  private int timeoutSeconds;\n}',
      [
        "The properties file is added to the environment.",
        "`${mail.host}` must exist, or start-up fails.",
        "`${mail.timeout:30}` uses `30` when the property is absent.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting a default for an optional property.",
      "Scattering `@Value` fields for a group of settings that belongs in one typed class.",
    ],
    follow: ["What is the difference between ${...} and #{...}?"],
    points: [
      "${...} = property placeholder",
      "#{...} = SpEL expression",
      "Defaults after a colon",
    ],
    notes:
      '`@Value("${prop:default}")`, `@PropertySource` to add a file, `Environment` to read in code.',
    src: [
      [
        "Spring Framework Reference: @Value",
        `${S}/core/beans/annotation-config/value-annotations.html`,
      ],
      [
        "Spring Framework Reference: Environment Abstraction",
        `${S}/core/beans/environment.html`,
      ],
    ],
  }),
  g({
    slug: "profiles-and-environment-spring",
    topic: "Configuration",
    d: "medium",
    title: "How do profiles and the `Environment` work in Spring?",
    kw: [
      "@Profile",
      "Environment",
      "spring.profiles.active",
      "conditional beans",
      "property source",
    ],
    intent: "Checks that you can switch beans by environment in plain Spring.",
    short:
      'The `Environment` abstraction has two parts: profiles and properties. A profile is a named group of bean definitions that are registered only when that profile is active. You mark a bean or configuration class with `@Profile("dev")`, and activate profiles with the property `spring.profiles.active`, a JVM argument or an environment variable. A profile expression such as `!prod` or `dev | test` combines them. The `Environment` also gives access to properties from many sources, such as system properties, environment variables and property files, in a defined order of precedence.',
    detail: [
      "If no profile is active, the `default` profile is used.",
      "Several profiles can be active at once.",
      "Spring Boot adds profile-specific property files, such as `application-dev.properties`.",
    ],
    ex: "A `FakeEmailSender` bean exists only in the `dev` profile, and the real sender only in `prod`.",
    mistakes: [
      "Having no bean for the active profile and failing on missing dependencies.",
      "Using profiles for differences that a simple property could express.",
    ],
    follow: ["How do you activate more than one profile?"],
    points: [
      "Profiles group bean definitions",
      "Activated with spring.profiles.active",
      "Environment also resolves properties",
    ],
    notes:
      "`@Profile` + `spring.profiles.active`; `Environment` resolves profiles and properties.",
    src: [
      [
        "Spring Framework Reference: Environment Abstraction",
        `${S}/core/beans/environment.html`,
      ],
      [
        "Spring Framework Reference: Using @Profile",
        `${S}/core/beans/environment.html`,
      ],
    ],
  }),
  g({
    slug: "import-and-conditional-configuration",
    topic: "Configuration",
    d: "medium",
    title:
      "How do you combine several configuration classes? (`@Import`, `@Conditional`)",
    kw: [
      "@Import",
      "@Conditional",
      "modular configuration",
      "composition",
      "auto-configuration",
    ],
    intent:
      "Checks that you can split configuration and switch parts on conditionally.",
    short:
      "A large configuration is split into several `@Configuration` classes, grouped by feature. `@Import(OtherConfig.class)` pulls another configuration class into the current one, so that you can build the context from a few root classes. `@Conditional` and its variants, such as `@Profile`, `@ConditionalOnProperty` and `@ConditionalOnMissingBean` in Spring Boot, register a bean only when a condition is true. This is exactly how Spring Boot's auto-configuration decides what to configure from the classpath and the properties.",
    detail: [
      "`@ComponentScan` is the other way to discover configuration classes.",
      "A condition is evaluated when the bean definitions are read.",
      "You can write your own `Condition` for special cases.",
    ],
    ex: "A `SecurityConfig` and a `PersistenceConfig` are imported by an `AppConfig`, and a metrics bean is created only when a property enables it.",
    mistakes: [
      "Keeping all beans in one huge configuration class.",
      "Using conditions so heavily that nobody can tell which beans exist.",
    ],
    follow: ["How does Spring Boot use conditions?"],
    points: [
      "@Import composes configurations",
      "@Conditional registers beans on a condition",
      "Auto-configuration is built on conditions",
    ],
    notes:
      "`@Import` to compose, `@Conditional*` to register beans only when a condition holds.",
    src: [
      [
        "Spring Framework Reference: Composing Java-based Configurations",
        `${S}/core/beans/java/composing-configuration-classes.html`,
      ],
      [
        "Spring Framework Reference: Using the @Conditional annotation",
        `${S}/core/beans/java/bean-annotation.html`,
      ],
    ],
  }),
])
