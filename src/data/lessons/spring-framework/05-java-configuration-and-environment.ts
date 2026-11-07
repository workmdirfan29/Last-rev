import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-framework", {
  slug: "java-configuration-and-environment",
  title: "Java configuration, component scanning and the Environment",
  topic: "Configuration",
  minutes: 60,
  overview:
    "Configure beans with @Configuration and @Bean, understand component scanning, compose configurations, and use profiles and properties.",
  objectives: [
    "Write @Configuration classes with @Bean methods",
    "Explain component scanning and how @Configuration is proxied",
    "Use @Value, @PropertySource, @Profile and @Conditional",
  ],
  prerequisites: ["lesson.spring-framework.beans-scopes-and-lifecycle"],
  sections: [
    {
      kind: "explain",
      heading: "@Configuration and @Bean",
      body: [
        "`@Configuration` marks a class as a source of **bean definitions**. Each method annotated with `@Bean` returns an object that becomes a bean, named after the method unless you give a name. This Java-based configuration is type-safe and refactoring-friendly, and it can create beans from classes that you cannot annotate, such as library classes. Dependencies are passed as **method parameters**, which Spring injects. It replaced the XML configuration of older Spring versions.",
        "A `@Bean` method can set `initMethod` and `destroyMethod`. Conditional annotations such as `@Profile` and Boot's `@ConditionalOnProperty` switch bean methods on and off.",
      ],
    },
    {
      kind: "code",
      heading: "A configuration class",
      example: {
        title: "Beans from methods",
        language: "java",
        code: "@Configuration\nclass AppConfig {\n\n  @Bean\n  Clock clock() {\n    return Clock.systemUTC();\n  }\n\n  @Bean\n  TokenService tokenService(Clock clock) {\n    return new TokenService(clock, Duration.ofMinutes(15));\n  }\n}",
        walkthrough: [
          "`clock()` registers a `Clock` bean named `clock`.",
          "`tokenService` receives that bean as a **parameter**, so Spring injects it.",
          "Business logic does not belong in a configuration class: it only wires objects.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Component scanning and proxied configuration",
      body: [
        '**Component scanning** makes Spring search the class path under given packages for classes annotated with `@Component` or one of its specialisations. `@ComponentScan("com.shop")` enables it, and Spring Boot\'s `@SpringBootApplication` includes it and scans the package of the main class and below. A bean outside the scanned packages is not found unless you add its package with `scanBasePackages`, or import it.',
        "Classes annotated with `@Configuration` are **subclassed by Spring with CGLIB**. The subclass overrides each `@Bean` method so that a call to it first checks whether the singleton already exists in the container, and returns it. So, inside a configuration class, `return new Service(repo())`, where `repo()` is another `@Bean` method, gives the **shared** bean, and not a new object. With `proxyBeanMethods = false`, or in a plain `@Component`, there is no such proxy, so you should pass other beans as **method parameters** instead.",
      ],
    },
    {
      kind: "explain",
      heading: "Composition and conditions",
      body: [
        "Split a large configuration into several `@Configuration` classes grouped by feature, and combine them with `@Import(OtherConfig.class)`. `@Conditional` and its variants register a bean **only when a condition is true**. This is exactly how Spring Boot's auto-configuration decides what to create.",
        'Read values with `@Value("${app.name}")`, with a default as in `${app.timeout:30}`. `@Value("#{...}")` evaluates a Spring Expression Language expression. `@PropertySource("classpath:app.properties")` adds a file to the `Environment`. The `Environment` also resolves **profiles**: `@Profile("dev")` registers a bean only for that profile, and `!prod` and `dev | test` are valid expressions. For groups of related settings, `@ConfigurationProperties` is cleaner.',
      ],
    },
    {
      kind: "code",
      heading: "Properties and profiles",
      example: {
        title: "Plain Spring",
        language: "java",
        code: '@Configuration\n@PropertySource("classpath:app.properties")\n@Import(PersistenceConfig.class)\nclass AppConfig {\n\n  @Bean\n  @Profile("dev")\n  EmailSender consoleSender() {\n    return new ConsoleEmailSender();\n  }\n}\n\n@Component\nclass MailSettings {\n  @Value("${mail.host}")\n  private String host;\n\n  @Value("${mail.timeout:30}")\n  private int timeoutSeconds;\n}',
        walkthrough: [
          "The properties file is added to the environment.",
          '`@Import` brings in another configuration class, and `@Profile("dev")` registers the sender only in development.',
          "`${mail.host}` must exist, or start-up fails. `${mail.timeout:30}` uses `30` if the property is absent.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting a bean outside the scanned packages.",
          fix: "Move it, or add the package to the scan.",
        },
        {
          mistake: "Calling a `@Bean` method directly in a lite-mode class.",
          fix: "Pass the other bean as a method parameter.",
        },
        {
          mistake: "Forgetting a default for an optional property.",
          fix: "Use `${name:default}`.",
        },
        {
          mistake: "Keeping all beans in one huge configuration class.",
          fix: "Split by feature and use `@Import`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Modular configuration",
      scenario:
        "An application has persistence, security and messaging parts, and each team owns one.",
      body: [
        "Each part has its own `@Configuration` class, and a root `AppConfig` imports them. Beans that only make sense in some environments carry `@Profile`, and settings come from properties.",
        "The structure of the configuration matches the structure of the team.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cfg-bean",
      prompt: "What does a @Bean method do?",
      options: [
        "Returns an object that becomes a bean",
        "Starts the server",
        "Reads a property file",
      ],
      answer: 0,
      explanation: "Parameters are injected by Spring.",
    },
    {
      type: "single",
      id: "cfg-scan",
      prompt: "Which package does @SpringBootApplication scan?",
      options: [
        "The package of the main class and its sub-packages",
        "All packages on the class path",
        "Only com.example",
      ],
      answer: 0,
      explanation: "Put the main class in the root package.",
    },
    {
      type: "truefalse",
      id: "cfg-proxy",
      statement:
        "Inside a @Configuration class, calling a @Bean method returns the singleton bean.",
      answer: true,
      explanation: "The class is proxied with CGLIB.",
    },
    {
      type: "blank",
      id: "cfg-default",
      prompt:
        'In `@Value("${mail.timeout:30}")`, the number after the colon is the ___ value.',
      answer: "default",
      explanation: "It is used when the property is absent.",
    },
  ],
  assignment: {
    title: "Configure by hand",
    task: [
      "Write a Spring application with only a Java configuration (no component scanning) that wires a service, a repository and a clock.",
      "Add a profile-specific bean and a property with a default, then start it with each profile.",
    ],
    checklist: [
      "No XML and no component scanning",
      "A @Profile bean is chosen by the active profile",
      "A property has a default value",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "cfg-ex",
      title: "Wire two beans",
      task: [
        "Write a `@Configuration` class that defines a `Clock` bean and a `TokenService` bean that receives the clock as a parameter.",
      ],
      language: "java",
      starter: "@Configuration\nclass TokenConfig {\n  // your code\n}",
      solution:
        "@Configuration\nclass TokenConfig {\n  @Bean\n  Clock clock() {\n    return Clock.systemUTC();\n  }\n\n  @Bean\n  TokenService tokenService(Clock clock) {\n    return new TokenService(clock);\n  }\n}",
      hints: [
        "Pass the clock as a method parameter, and do not call `clock()` yourself.",
      ],
      checklist: [
        "Two bean methods",
        "The clock is a parameter",
        "The class has @Configuration",
      ],
    },
  ],
  revisionNotes: [
    "`@Configuration` + `@Bean`: Java-based bean definitions; parameters are injected",
    "`@ComponentScan` finds annotated classes; configuration classes are CGLIB-proxied",
    "`@Import`, `@Conditional`, `@Profile` compose and switch configuration",
    '`@Value("${prop:default}")`, `@PropertySource`, `Environment`',
  ],
  resources: [
    {
      label: "Spring Framework Reference: Java-based Container Configuration",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/java.html",
    },
    {
      label: "Spring Framework Reference: Environment Abstraction",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/environment.html",
    },
    {
      label: "Spring Framework Reference: Using @Value",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/value-annotations.html",
    },
  ],
})
