import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-boot", {
  slug: "spring-boot-auto-configuration",
  title: "Spring Boot and auto-configuration",
  topic: "Auto-configuration",
  minutes: 90,
  overview:
    "Understand what Spring Boot adds to Spring, how auto-configuration decides what to create, how to replace or exclude it, and how the embedded server and the main class work.",
  objectives: [
    "Explain what @SpringBootApplication does",
    "Describe how conditional auto-configuration works and how to see its report",
    "Replace or exclude an auto-configured bean and change the embedded server",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What Spring Boot is",
      body: [
        "**Spring Boot** is a way to build Spring applications with very little set-up. It takes an **opinionated** approach. **Starter** dependencies bring in a tested set of libraries. **Auto-configuration** creates sensible default beans from what it finds on the class path. An **embedded server** such as Tomcat lets you run the application as a plain `java -jar`. You can still override every default. Boot does not replace the Spring Framework: it builds on it.",
        "It also provides production features such as Actuator for health and metrics, and **externalised configuration**, so the same jar runs in every environment. No XML configuration is needed.",
      ],
    },
    {
      kind: "code",
      heading: "The main class",
      example: {
        title: "@SpringBootApplication",
        language: "java",
        code: "package com.shop;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class ShopApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(ShopApplication.class, args);\n  }\n}",
        walkthrough: [
          "`@SpringBootApplication` combines three annotations: `@SpringBootConfiguration`, `@EnableAutoConfiguration` and `@ComponentScan`.",
          "Component scanning starts in the package of this class, `com.shop`, and covers its sub-packages. Put the main class in the root package of the application.",
          "`SpringApplication.run` creates the application context and starts the embedded server.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "How auto-configuration works",
      body: [
        "Auto-configuration classes are ordinary `@Configuration` classes that Boot lists in a file inside its libraries. When `@EnableAutoConfiguration` is active, Boot loads them, and each registers beans **only if its conditions are met**: a certain class is on the class path (`@ConditionalOnClass`), a property has a value (`@ConditionalOnProperty`), or you have **not** defined a bean of that type yourself (`@ConditionalOnMissingBean`).",
        "So adding a JDBC driver and a data source URL gives you a configured `DataSource`, and a missing library gives you nothing. Because most auto-configured beans **back off** when you define your own, the easiest way to replace one is to declare your own bean of that type.",
        "Start the application with `--debug`, or set `debug=true`, to print a **conditions report** that lists which auto-configurations matched and which did not, and why.",
      ],
    },
    {
      kind: "code",
      heading: "Replace or exclude",
      example: {
        title: "Own bean and exclusion",
        language: "java",
        code: "@Configuration\nclass JsonConfig {\n  @Bean\n  ObjectMapper objectMapper() {\n    return new ObjectMapper().findAndRegisterModules();\n  }\n}\n\n// switch a whole auto-configuration off\n@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)\npublic class ToolApplication {\n}",
        walkthrough: [
          "Declaring an `ObjectMapper` bean makes Boot's own `ObjectMapper` back off, so yours is used.",
          "`exclude` switches off a whole auto-configuration class, here for an application that has a driver on the class path but no database.",
          "Prefer a property first, then your own bean, and exclusion last.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The embedded server",
      body: [
        "A Boot web application contains its own servlet container, **Tomcat** by default. You build one executable jar and start it with `java -jar`, with no separate server installation and no WAR deployment. The port is set with `server.port`, and `server.port=0` picks a random free port, which is useful in tests.",
        "To use another container, such as Jetty, exclude the Tomcat starter from the web starter and add the Jetty starter. Other `server.*` properties control the context path, compression and SSL. A WAR for an external server is still possible, but an executable jar is the usual choice.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting the main class in a sub-package.",
          fix: "Put it in the root package, so scanning finds the beans in sibling packages.",
        },
        {
          mistake:
            "Fighting an auto-configuration instead of defining your own bean.",
          fix: "Define a bean of the same type, and the default backs off.",
        },
        {
          mistake: "Excluding auto-configuration when a property would do.",
          fix: "Check the documented properties first.",
        },
        {
          mistake: "Not reading the conditions report when a bean is missing.",
          fix: "Start with `--debug`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A service that needs a custom JSON format",
      scenario:
        "An API must use a specific date format and ignore unknown fields in every JSON body.",
      body: [
        "Boot configures an `ObjectMapper` that reads `spring.jackson.*` properties. Set the properties for simple cases. If more control is needed, declare your own `ObjectMapper` bean, and Boot's default backs off.",
        "The conditions report confirms that the default was not created.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ab-annotation",
      prompt: "Which annotations does @SpringBootApplication combine?",
      options: [
        "SpringBootConfiguration, EnableAutoConfiguration and ComponentScan",
        "Controller, Service and Repository",
        "Configuration and Bean only",
      ],
      answer: 0,
      explanation:
        "It marks the class as configuration, turns on auto-configuration, and scans the package.",
    },
    {
      type: "single",
      id: "ab-backoff",
      prompt: "How do you usually replace an auto-configured bean?",
      options: [
        "Define your own bean of that type",
        "Edit the Boot jar",
        "Delete the starter",
      ],
      answer: 0,
      explanation:
        "Most auto-configured beans use `@ConditionalOnMissingBean`, so they back off.",
    },
    {
      type: "truefalse",
      id: "ab-magic",
      statement: "Auto-configuration cannot be changed or switched off.",
      answer: false,
      explanation:
        "You can override it with properties, your own beans, or `exclude`.",
    },
    {
      type: "blank",
      id: "ab-debug",
      prompt:
        "Start the application with --___ to print the auto-configuration conditions report.",
      answer: "debug",
      explanation:
        "The report lists matched and unmatched auto-configurations.",
    },
  ],
  assignment: {
    title: "Explore Boot",
    task: [
      "Create a Boot project with the web starter and run it with `--debug`.",
      "Find three matched and three unmatched auto-configurations in the report, then define your own `ObjectMapper` bean and check that the default backs off.",
    ],
    checklist: [
      "I read the conditions report",
      "My own bean replaced the default",
      "I changed the port with a property",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "ab-ex",
      title: "Back off the default",
      task: [
        "Write a configuration class that defines a `Clock` bean with a fixed time for tests, and explain in a comment why this is a good use of a bean that other code receives by injection.",
      ],
      language: "java",
      starter: "@Configuration\nclass ClockConfig {\n  // your code\n}",
      solution:
        '@Configuration\nclass ClockConfig {\n  // Code that gets a Clock by injection can be tested with a fixed time\n  // and run with the system clock in production.\n  @Bean\n  Clock clock() {\n    return Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);\n  }\n}',
      hints: ["Use `Clock.fixed` and `@Bean`."],
      checklist: [
        "A bean method returns a Clock",
        "The comment explains injection",
        "No static call to the real time is needed",
      ],
    },
  ],
  revisionNotes: [
    "Boot = starters + auto-configuration + embedded server, on top of Spring",
    "@SpringBootApplication = configuration + auto-configuration + component scan; main class in the root package",
    "Conditional auto-configuration backs off for your own beans; `--debug` prints the report",
    "Embedded Tomcat; `server.port`; swap the starter for Jetty",
  ],
  resources: [
    {
      label: "Spring Boot Reference: Auto-configuration",
      url: "https://docs.spring.io/spring-boot/reference/using/auto-configuration.html",
    },
    {
      label:
        "Spring Boot Reference: Using the @SpringBootApplication Annotation",
      url: "https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html",
    },
    {
      label: "Spring Boot Reference: Servlet Web Applications",
      url: "https://docs.spring.io/spring-boot/reference/web/servlet.html",
    },
  ],
})
