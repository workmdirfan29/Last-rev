import { defineQuestions } from "../author"
import { g } from "../brief"

const S = "https://docs.spring.io/spring-boot/reference"

export default defineQuestions("spring-boot", "fresher", [
  g({
    slug: "what-is-spring-boot",
    topic: "Auto-configuration",
    d: "easy",
    title: "What is Spring Boot and what problem does it solve?",
    kw: [
      "spring boot",
      "auto-configuration",
      "starters",
      "embedded server",
      "opinionated",
    ],
    intent:
      "Checks that you can say what Boot adds on top of the Spring Framework.",
    short:
      "Spring Boot is a way to build Spring applications with very little set-up. It takes an opinionated approach: starter dependencies bring in a tested set of libraries, auto-configuration creates sensible default beans from what it finds on the classpath, and an embedded server such as Tomcat lets you run the application as a plain `java -jar`. You can still override every default, so it removes boilerplate configuration but not the Spring Framework underneath.",
    detail: [
      "Spring Boot is not a replacement for Spring. It builds on the Spring Framework.",
      "It also provides production features such as Actuator for health and metrics, and externalised configuration.",
      "No XML configuration is needed, and the defaults change when you add or remove dependencies.",
    ],
    ex: "Adding the web starter and one `main` method is enough to start a REST service on port 8080.",
    mistakes: [
      "Saying that Boot is a different framework from Spring.",
      "Thinking auto-configuration is magic that cannot be changed.",
    ],
    follow: ["What does @SpringBootApplication do?"],
    points: [
      "Starters, auto-configuration, embedded server",
      "Built on the Spring Framework",
      "Defaults can be overridden",
    ],
    notes:
      "Boot = starters + auto-configuration + embedded server, on top of Spring.",
    src: [
      ["Spring Boot Reference: Documentation overview", `${S}/index.html`],
      [
        "Spring Boot Reference: Auto-configuration",
        `${S}/using/auto-configuration.html`,
      ],
    ],
  }),
  g({
    slug: "springbootapplication-annotation",
    topic: "Auto-configuration",
    d: "easy",
    title: "What does `@SpringBootApplication` do?",
    kw: [
      "@SpringBootApplication",
      "@EnableAutoConfiguration",
      "@ComponentScan",
      "@SpringBootConfiguration",
      "main class",
    ],
    intent:
      "Checks that you know the three annotations inside the one you always write.",
    short:
      "`@SpringBootApplication` is a convenience annotation that combines three: `@SpringBootConfiguration`, which marks the class as a source of bean definitions, `@EnableAutoConfiguration`, which turns on auto-configuration, and `@ComponentScan`, which scans the package of the class and its sub-packages for components such as `@Component`, `@Service` and `@RestController`. This is why the main class is placed in the root package of the application.",
    detail: [
      "Classes outside the main class's package are not found by the scan unless you configure `scanBasePackages`.",
      "You can use the three annotations separately, but most applications do not need to.",
      "`SpringApplication.run` starts the application context and the embedded server.",
    ],
    ex: "The class `com.shop.ShopApplication` finds beans in `com.shop.orders` but not in `org.other.utils`.",
    code: [
      "The main class",
      "package com.shop;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class ShopApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(ShopApplication.class, args);\n  }\n}",
      [
        "The annotation enables configuration, auto-configuration and component scanning.",
        "Scanning starts at `com.shop` and covers its sub-packages.",
        "`SpringApplication.run` creates the context and starts the server.",
      ],
      "java",
    ],
    mistakes: [
      "Putting the main class in a sub-package, so beans in sibling packages are not found.",
      "Using the default (unnamed) package.",
    ],
    follow: ["Why must the main class be in a root package?"],
    points: [
      "SpringBootConfiguration + EnableAutoConfiguration + ComponentScan",
      "Scans its own package and below",
      "run() starts the context",
    ],
    notes: "Three annotations in one. Put the main class in the root package.",
    src: [
      [
        "Spring Boot Reference: Using the @SpringBootApplication Annotation",
        `${S}/using/using-the-springbootapplication-annotation.html`,
      ],
      [
        "Spring Boot Reference: Structuring Your Code",
        `${S}/using/structuring-your-code.html`,
      ],
    ],
  }),
  g({
    slug: "how-auto-configuration-works",
    topic: "Auto-configuration",
    d: "medium",
    title: "How does Spring Boot auto-configuration work?",
    kw: [
      "auto-configuration",
      "@Conditional",
      "classpath",
      "imports file",
      "beans",
    ],
    intent:
      "Checks that you understand it as conditional bean registration, not magic.",
    short:
      "Auto-configuration classes are ordinary `@Configuration` classes that Boot lists in a file inside its libraries. When `@EnableAutoConfiguration` is active, Boot loads those classes and each one registers beans only if its conditions are met, for example that a certain class is on the classpath, that a property has a given value, or that you have not defined a bean of that type yourself. So adding the JDBC driver and a data source URL gives you a configured `DataSource`, and a missing library gives you nothing.",
    detail: [
      "Conditions use annotations such as `@ConditionalOnClass`, `@ConditionalOnProperty` and `@ConditionalOnMissingBean`.",
      "Your own beans take priority, because most auto-configured beans back off when a bean of the same type exists.",
      "Start the application with `--debug` to print a report of which auto-configurations matched and why.",
    ],
    ex: "With `spring-boot-starter-web` on the classpath, Boot configures an embedded Tomcat and Spring MVC.",
    mistakes: [
      "Fighting an auto-configuration instead of defining your own bean, which makes it back off.",
      "Not looking at the conditions report when a bean is unexpectedly missing.",
    ],
    follow: ["How do you see which auto-configurations were applied?"],
    points: [
      "Conditional @Configuration classes",
      "Driven by classpath, properties and existing beans",
      "--debug prints the report",
    ],
    notes:
      "Auto-configuration = conditional beans based on classpath, properties and your own beans.",
    src: [
      [
        "Spring Boot Reference: Auto-configuration",
        `${S}/using/auto-configuration.html`,
      ],
      [
        "Spring Boot Reference: Creating Your Own Auto-configuration",
        `${S}/features/developing-auto-configuration.html`,
      ],
    ],
  }),
  g({
    slug: "back-off-and-custom-beans",
    topic: "Auto-configuration",
    d: "medium",
    title: "How do you replace or turn off an auto-configured bean?",
    kw: [
      "@ConditionalOnMissingBean",
      "exclude",
      "back off",
      "spring.autoconfigure.exclude",
      "custom bean",
    ],
    intent:
      "Checks that you can change a default without fighting the framework.",
    short:
      "The simplest way is to define your own bean of that type. Most auto-configured beans are marked `@ConditionalOnMissingBean`, so they back off and yours is used. To switch off a whole auto-configuration, list it in `exclude` of `@SpringBootApplication` or `@EnableAutoConfiguration`, or in the property `spring.autoconfigure.exclude`. Many features can also be changed with a property, which is the first thing to check.",
    detail: [
      "Excluding a class that is not on the classpath fails, so use `excludeName` with a string in that case.",
      "Replacing a bean can disable other auto-configuration that depends on it.",
      "Prefer properties, then your own bean, then exclusion.",
    ],
    ex: "A project defines its own `ObjectMapper` bean with custom settings, so Boot's default one is not created.",
    code: [
      "Own bean and exclusion",
      "@Bean\nObjectMapper objectMapper() {\n  return new ObjectMapper().findAndRegisterModules();\n}\n\n// or turn an auto-configuration off\n@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)\npublic class ToolApplication { }",
      [
        "A bean of the same type makes the default one back off.",
        "`exclude` switches off the whole auto-configuration class.",
      ],
      "java",
    ],
    mistakes: [
      "Excluding auto-configuration when a property would have been enough.",
      "Defining a bean of the same type and expecting both to exist.",
    ],
    follow: ["What does @ConditionalOnMissingBean mean?"],
    points: [
      "Own bean makes the default back off",
      "exclude switches a class off",
      "Check properties first",
    ],
    notes:
      "Own bean → default backs off. `exclude` for a whole auto-configuration.",
    src: [
      [
        "Spring Boot Reference: Auto-configuration",
        `${S}/using/auto-configuration.html`,
      ],
      [
        "Spring Boot Reference: Creating Your Own Auto-configuration",
        `${S}/features/developing-auto-configuration.html`,
      ],
    ],
  }),
  g({
    slug: "embedded-server",
    topic: "Auto-configuration",
    d: "easy",
    title: "What is the embedded server in Spring Boot, and can you change it?",
    kw: ["embedded server", "tomcat", "jetty", "undertow", "server.port"],
    intent:
      "Checks that you know how a Boot web application is run and packaged.",
    short:
      "A Boot web application contains its own servlet container, Tomcat by default, so you build one executable jar and start it with `java -jar`, with no separate server installation or WAR deployment. The port is set with `server.port`. To use another container such as Jetty, exclude the Tomcat starter from the web starter and add the Jetty starter.",
    detail: [
      "`server.port=0` picks a random free port, which is useful in tests.",
      "Other `server.*` properties set the context path, compression and SSL.",
      "A WAR can still be built for an external server, but an executable jar is the usual choice.",
    ],
    ex: "A team ships one jar in a container image, and starts it with `java -jar app.jar --server.port=9090`.",
    mistakes: [
      "Installing Tomcat separately for a normal Boot jar.",
      "Hard-coding the port in code instead of a property.",
    ],
    follow: ["How do you change the port?"],
    points: [
      "Tomcat is the default",
      "Runs as a plain jar",
      "server.port sets the port",
    ],
    notes:
      "Embedded Tomcat by default; `server.port`; swap the starter for Jetty.",
    src: [
      [
        "Spring Boot Reference: Servlet Web Applications",
        `${S}/web/servlet.html`,
      ],
      [
        "Spring Boot Reference: Common Application Properties",
        "https://docs.spring.io/spring-boot/appendix/application-properties/index.html",
      ],
    ],
  }),
  g({
    slug: "what-are-starters",
    topic: "Starters",
    d: "easy",
    title: "What are Spring Boot starters?",
    kw: [
      "starter",
      "spring-boot-starter-web",
      "dependency",
      "pom",
      "transitive",
    ],
    intent: "Checks that you know starters are dependency bundles.",
    short:
      "A starter is a single dependency that pulls in a curated set of libraries for one kind of task, with compatible versions, so you do not choose each one yourself. For example `spring-boot-starter-web` brings Spring MVC, JSON support and an embedded Tomcat, and `spring-boot-starter-data-jpa` brings Spring Data JPA and Hibernate. A starter has no code of its own. It gives you the dependencies, and auto-configuration then reacts to them.",
    detail: [
      "Starters follow the naming pattern `spring-boot-starter-*`.",
      "Third-party libraries name theirs `*-spring-boot-starter`.",
      "You still declare only the starter's version through the parent or the BOM.",
    ],
    ex: "Adding `spring-boot-starter-test` gives JUnit, Mockito, AssertJ and Spring's test support in one line.",
    code: [
      "Starters in a Maven build",
      "<dependencies>\n  <dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n  </dependency>\n  <dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-test</artifactId>\n    <scope>test</scope>\n  </dependency>\n</dependencies>",
      [
        "No version is written, because the parent manages it.",
        "The test starter has the `test` scope, so it is not in the final jar.",
      ],
      "xml",
    ],
    mistakes: [
      "Adding many separate libraries by hand with mismatched versions.",
      "Putting `spring-boot-starter-test` in the default scope.",
    ],
    follow: ["Where do the versions come from?"],
    points: [
      "A bundle of dependencies",
      "spring-boot-starter-* naming",
      "Auto-configuration reacts to what they add",
    ],
    notes:
      "A starter = a curated dependency bundle, e.g. web, data-jpa, test, validation.",
    src: [
      [
        "Spring Boot Reference: Build Systems (Starters)",
        `${S}/using/build-systems.html`,
      ],
      [
        "Spring Boot Reference: Auto-configuration",
        `${S}/using/auto-configuration.html`,
      ],
    ],
  }),
  g({
    slug: "starter-parent-and-bom",
    topic: "Starters",
    d: "medium",
    title:
      "What do `spring-boot-starter-parent` and the dependency management BOM do?",
    kw: [
      "spring-boot-starter-parent",
      "BOM",
      "dependency management",
      "spring-boot-dependencies",
      "versions",
    ],
    intent: "Checks that you know where dependency versions come from.",
    short:
      "`spring-boot-starter-parent` is a Maven parent that gives your project default settings, such as the Java version property, UTF-8 encoding, plugin configuration and, above all, dependency management: a tested list of versions for hundreds of libraries, so you write dependencies without a version. If your project already has another parent, import `spring-boot-dependencies` as a BOM in `dependencyManagement` instead to get the same versions. In Gradle, the Spring Boot plugin and the dependency management plugin do this.",
    detail: [
      "Upgrading Boot upgrades the managed library versions together.",
      "A version you write yourself overrides the managed one, which should be done with care.",
      "Boot versions have a support period, so a project should plan upgrades.",
    ],
    ex: "The project's parent is `spring-boot-starter-parent` 3.x, so Jackson and Hibernate versions are already chosen for it.",
    mistakes: [
      "Writing versions for libraries that Boot already manages, which can cause conflicts.",
      "Never upgrading, and ending up on an unsupported Boot version.",
    ],
    follow: ["What is a BOM?"],
    points: [
      "Parent supplies defaults and managed versions",
      "BOM import when you have another parent",
      "Override versions rarely",
    ],
    notes:
      "Parent or BOM = tested version set, so dependencies need no version.",
    src: [
      ["Spring Boot Reference: Build Systems", `${S}/using/build-systems.html`],
      [
        "Spring Boot Reference: Dependency Versions",
        "https://docs.spring.io/spring-boot/appendix/dependency-versions/index.html",
      ],
    ],
  }),
  g({
    slug: "common-starters",
    topic: "Starters",
    d: "easy",
    title: "Which starters would you add for a REST API with a database?",
    kw: [
      "starter-web",
      "starter-data-jpa",
      "starter-validation",
      "starter-actuator",
      "starter-security",
    ],
    intent: "Checks that you can pick dependencies for a typical service.",
    short:
      "A typical REST API with a relational database uses `spring-boot-starter-web` for the controllers and JSON, `spring-boot-starter-data-jpa` for repositories and Hibernate, a database driver such as PostgreSQL or H2, `spring-boot-starter-validation` for request validation, `spring-boot-starter-actuator` for health and metrics, `spring-boot-starter-security` if the endpoints need protection, and `spring-boot-starter-test` for tests.",
    detail: [
      "The driver is not part of the JPA starter and has to be added on its own.",
      "Add only what you need, because every starter brings its own auto-configuration.",
      "Spring Initializr at start.spring.io generates a project with the chosen starters.",
    ],
    ex: "A product service uses web, data-jpa, PostgreSQL, validation and actuator, and test for its tests.",
    mistakes: [
      "Forgetting the database driver and getting a data source error at start-up.",
      "Adding the security starter without configuring rules, which protects every endpoint by default.",
    ],
    follow: ["What happens when you add the security starter?"],
    points: [
      "web, data-jpa, validation, actuator, test",
      "Driver added separately",
      "Initializr generates a project",
    ],
    notes: "REST + DB: web, data-jpa, driver, validation, actuator, test.",
    src: [
      ["Spring Boot Reference: Build Systems", `${S}/using/build-systems.html`],
      ["Spring Boot Reference: SQL Databases", `${S}/data/sql.html`],
    ],
  }),
  g({
    slug: "devtools-and-restart",
    topic: "Starters",
    d: "easy",
    title: "What is Spring Boot DevTools?",
    kw: [
      "devtools",
      "automatic restart",
      "livereload",
      "development",
      "optional",
    ],
    intent:
      "Checks that you know the development aid and its production limit.",
    short:
      "`spring-boot-devtools` is a dependency for development time. It restarts the application automatically when files on the classpath change, using a quick restart mechanism that is faster than a cold start, enables a LiveReload server for browsers, and sets development-friendly defaults such as turning off template caching. It is disabled when the application runs as a fully packaged jar, and it should be declared as optional or in a development-only scope so it does not reach production.",
    detail: [
      "Restart is triggered by recompilation, so with an IDE you rebuild the project.",
      "Properties such as `spring.devtools.restart.enabled` control the behaviour.",
      "It is not meant for production and the build plugin leaves it out of the executable jar by default.",
    ],
    ex: "You change a controller, the IDE recompiles it, and the application restarts in a second or two.",
    mistakes: [
      "Expecting DevTools to be active in a production jar.",
      "Leaving DevTools as a normal compile dependency in a library.",
    ],
    follow: ["How does DevTools restart faster than a cold start?"],
    points: [
      "Automatic restart and LiveReload",
      "Development-only",
      "Excluded from the packaged jar",
    ],
    notes:
      "DevTools: auto restart for development, optional dependency, not for production.",
    src: [
      ["Spring Boot Reference: Developer Tools", `${S}/using/devtools.html`],
      ["Spring Boot Reference: Build Systems", `${S}/using/build-systems.html`],
    ],
  }),
  g({
    slug: "what-are-profiles",
    topic: "Profiles",
    d: "easy",
    title: "What are Spring profiles and why do you use them?",
    kw: [
      "profiles",
      "dev",
      "prod",
      "environment",
      "application-dev.properties",
    ],
    intent:
      "Checks that you can make the same code run in different environments.",
    short:
      "A profile is a named set of configuration, such as `dev`, `test` or `prod`, that you can switch on when you start the application. Beans can be tied to a profile with `@Profile`, and property files can be profile-specific, for example `application-dev.properties`. Properties from the active profile's file override the values in `application.properties`, so one build can use a local database in development and a real one in production.",
    detail: [
      "More than one profile can be active at the same time.",
      "If no profile is active, the `default` profile is used.",
      "Profiles must not hold secrets in the repository. Secrets come from the environment or a secret store.",
    ],
    ex: "`application-dev.properties` points to an H2 database, and `application-prod.properties` points to PostgreSQL through environment variables.",
    mistakes: [
      "Creating many profiles for tiny differences that a property could handle.",
      "Committing production passwords into a profile file.",
    ],
    follow: ["How do you activate a profile?"],
    points: [
      "Named configuration sets",
      "Profile-specific property files override the defaults",
      "Secrets stay out of the repository",
    ],
    notes:
      "Profiles = per-environment config: `application-{profile}.properties`, `@Profile`.",
    src: [
      ["Spring Boot Reference: Profiles", `${S}/features/profiles.html`],
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
    ],
  }),
  g({
    slug: "activate-a-profile",
    topic: "Profiles",
    d: "easy",
    title: "How do you activate a profile?",
    kw: [
      "spring.profiles.active",
      "SPRING_PROFILES_ACTIVE",
      "command line",
      "environment variable",
      "profile",
    ],
    intent: "Checks that you know how to select an environment at start-up.",
    short:
      "Set the property `spring.profiles.active`. You can pass it on the command line as `--spring.profiles.active=prod`, as the system property `-Dspring.profiles.active=prod`, or as the environment variable `SPRING_PROFILES_ACTIVE=prod`, which suits containers. Setting it inside `application.properties` works for a default, but the command line and environment variable override it, so the deployment decides the profile without a rebuild.",
    detail: [
      "`spring.profiles.include` adds profiles on top of the active ones.",
      'In tests, the `@ActiveProfiles("test")` annotation picks the profile.',
      "Profile groups let one name stand for several profiles.",
    ],
    ex: "The container is started with `SPRING_PROFILES_ACTIVE=prod`, with no change to the jar.",
    code: [
      "Three ways to select a profile",
      "java -jar app.jar --spring.profiles.active=prod\njava -Dspring.profiles.active=prod -jar app.jar\nSPRING_PROFILES_ACTIVE=prod java -jar app.jar",
      [
        "A command-line argument.",
        "A JVM system property.",
        "An environment variable, which is usual in containers.",
      ],
    ],
    mistakes: [
      "Hard-coding `prod` in `application.properties` and forgetting to override it elsewhere.",
      "Not activating the `test` profile in tests that need test settings.",
    ],
    follow: ["How do you use a profile in a test?"],
    points: [
      "spring.profiles.active",
      "Command line, system property or environment variable",
      "@ActiveProfiles in tests",
    ],
    notes:
      "`--spring.profiles.active=prod` or `SPRING_PROFILES_ACTIVE`; `@ActiveProfiles` in tests.",
    src: [
      ["Spring Boot Reference: Profiles", `${S}/features/profiles.html`],
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
    ],
  }),
  g({
    slug: "profile-annotation",
    topic: "Profiles",
    d: "medium",
    title: "How does the `@Profile` annotation work?",
    kw: [
      "@Profile",
      "conditional bean",
      "dev profile",
      "profile expression",
      "bean",
    ],
    intent:
      "Checks that you can make a bean available only in some environments.",
    short:
      '`@Profile("dev")` on a `@Component`, `@Configuration` class or `@Bean` method means the bean is registered only when the `dev` profile is active. A negation such as `@Profile("!prod")` registers it in every environment except production, and an expression such as `"dev | test"` combines profiles. It is used to swap implementations, for example a fake email sender in development and the real one in production.',
    detail: [
      "A bean with no `@Profile` is always registered.",
      "Two beans of the same type with different profiles let you choose one by profile.",
      "Too many profile-specific beans make the application hard to reason about, so keep it to a few well-named cases.",
    ],
    ex: "`ConsoleEmailSender` is used under `dev`, and `SmtpEmailSender` under `prod`.",
    code: [
      "Two implementations by profile",
      '@Service\n@Profile("dev")\nclass ConsoleEmailSender implements EmailSender {\n  public void send(String to, String body) {\n    System.out.println("To " + to + ": " + body);\n  }\n}\n\n@Service\n@Profile("prod")\nclass SmtpEmailSender implements EmailSender {\n  public void send(String to, String body) { /* send for real */ }\n}',
      [
        "Only one of the two classes is registered, depending on the active profile.",
        "Code that depends on `EmailSender` does not change.",
      ],
      "java",
    ],
    mistakes: [
      "Having no active profile that matches, so no `EmailSender` bean exists.",
      "Using profiles to hide behaviour that should be a plain property.",
    ],
    follow: ["What happens if no bean matches the active profile?"],
    points: [
      "Registers a bean only for chosen profiles",
      "! and | expressions",
      "Swap implementations by environment",
    ],
    notes:
      '`@Profile("dev")`, `@Profile("!prod")`: register a bean only for some profiles.',
    src: [
      ["Spring Boot Reference: Profiles", `${S}/features/profiles.html`],
      [
        "Spring Framework Reference: @Profile",
        "https://docs.spring.io/spring-framework/reference/core/beans/environment.html",
      ],
    ],
  }),
  g({
    slug: "externalized-configuration-order",
    topic: "Profiles",
    d: "medium",
    title: "Where can configuration come from, and which source wins?",
    kw: [
      "externalized configuration",
      "property sources",
      "command line",
      "environment variables",
      "application.properties",
    ],
    intent:
      "Checks that you know how to override a setting without rebuilding.",
    short:
      "Spring Boot reads configuration from many sources in a defined order, and a later, higher-priority source overrides an earlier one. In general, command-line arguments and OS environment variables override the `application.properties` or `application.yml` files, and profile-specific files override the general ones. Defaults in the code have the lowest priority. This lets you set a safe default in the jar and override it per environment.",
    detail: [
      "Boot converts names, so the environment variable `SERVER_PORT` can set `server.port`.",
      "Files can be placed next to the jar or in a `config` folder, and they override the packaged ones.",
      "The reference lists the full order. Do not memorise it, but know that command line and environment win.",
    ],
    ex: "The jar defaults to port 8080, and the container sets `SERVER_PORT=9000`, which wins.",
    mistakes: [
      "Rebuilding the application to change one setting.",
      "Putting secrets in `application.properties` in the repository.",
    ],
    follow: ["How do you pass a database password to a container?"],
    points: [
      "Many sources with a defined order",
      "Command line and environment variables win",
      "Profile files override the general one",
    ],
    notes:
      "Override order (simplified): command line / env > profile file > application.properties > defaults.",
    src: [
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
      ["Spring Boot Reference: Profiles", `${S}/features/profiles.html`],
    ],
  }),
  g({
    slug: "what-is-actuator",
    topic: "Actuator",
    d: "easy",
    title: "What is Spring Boot Actuator?",
    kw: ["actuator", "health", "metrics", "monitoring", "production-ready"],
    intent:
      "Checks that you know the built-in tools for running an application in production.",
    short:
      "Actuator adds production-ready features to a Boot application, mainly endpoints that report on its state: `health` says whether the application and its dependencies, such as the database, are up, `info` shows application details, `metrics` exposes measurements such as memory, requests and the JVM, and others show the loggers, environment or mappings. You add `spring-boot-starter-actuator`, and monitoring systems and orchestrators can then check the application automatically.",
    detail: [
      "Endpoints can be accessed over HTTP or JMX.",
      "Only a few endpoints are exposed over HTTP by default, because many can reveal sensitive details.",
      "Actuator integrates with Micrometer to send metrics to monitoring systems.",
    ],
    ex: "A load balancer calls `/actuator/health` to decide whether an instance should receive traffic.",
    mistakes: [
      "Exposing every endpoint publicly without security.",
      "Thinking that health only checks that the process is running.",
    ],
    follow: ["Which endpoints are exposed by default?"],
    points: [
      "Endpoints for health, info and metrics",
      "Added by the actuator starter",
      "Secure what you expose",
    ],
    notes:
      "Actuator = production endpoints: `/actuator/health`, `/info`, `/metrics`.",
    src: [
      ["Spring Boot Reference: Actuator", `${S}/actuator/index.html`],
      ["Spring Boot Reference: Endpoints", `${S}/actuator/endpoints.html`],
    ],
  }),
  g({
    slug: "exposing-actuator-endpoints",
    topic: "Actuator",
    d: "medium",
    title: "How do you expose and secure Actuator endpoints?",
    kw: [
      "management.endpoints.web.exposure.include",
      "health details",
      "show-details",
      "actuator security",
      "management port",
    ],
    intent: "Checks that you do not leak internals when you add monitoring.",
    short:
      "Over HTTP, only the `health` endpoint is exposed by default. To expose more, set `management.endpoints.web.exposure.include`, for example to `health,info,metrics`, and avoid `*` in production. The detail of the health response is controlled with `management.endpoint.health.show-details`. Endpoints should be protected with Spring Security or kept on a separate management port that is reachable only from the internal network.",
    detail: [
      "`management.server.port` moves Actuator to another port that can be closed to the public.",
      "Some endpoints, such as `env` and `heapdump`, can reveal secrets and internals.",
      "Sanitising of sensitive values is applied to some endpoints, but you should not rely on it alone.",
    ],
    ex: "The service exposes `health,info,metrics` on a management port that only the monitoring system can reach.",
    code: [
      "Actuator settings",
      "management.endpoints.web.exposure.include=health,info,metrics\nmanagement.endpoint.health.show-details=when-authorized\nmanagement.server.port=9090",
      [
        "Only three endpoints are exposed over HTTP.",
        "Health details are shown only to authorised users.",
        "Actuator listens on its own port.",
      ],
      "properties",
    ],
    mistakes: [
      "Setting exposure to `*` on a public port.",
      "Showing full health details to anonymous users.",
    ],
    follow: ["Why can the env endpoint be dangerous?"],
    points: [
      "Only health is exposed by default",
      "exposure.include chooses endpoints",
      "Secure or move to a management port",
    ],
    notes:
      "`management.endpoints.web.exposure.include=health,info,metrics`; secure the rest.",
    src: [
      ["Spring Boot Reference: Endpoints", `${S}/actuator/endpoints.html`],
      [
        "Spring Boot Reference: Monitoring and Management over HTTP",
        `${S}/actuator/monitoring.html`,
      ],
    ],
  }),
  g({
    slug: "health-and-probes",
    topic: "Actuator",
    d: "medium",
    title:
      "How does the health endpoint work, and what are liveness and readiness?",
    kw: ["health", "HealthIndicator", "liveness", "readiness", "kubernetes"],
    intent:
      "Checks that you can report health and support container orchestration.",
    short:
      "The health endpoint combines the status of several health indicators, such as the database, disk space and any you write by implementing `HealthIndicator`, and reports `UP`, or `DOWN` when a required part fails. Spring Boot also supports liveness and readiness probes. Liveness tells an orchestrator whether the application is alive or must be restarted. Readiness tells it whether the application is ready to receive traffic, so an instance that is still starting or temporarily busy is not sent requests.",
    detail: [
      "Probes are enabled automatically on Kubernetes and can be enabled with `management.endpoint.health.probes.enabled=true`.",
      "A liveness check should not depend on external systems, or a database outage would restart every instance.",
      "Custom indicators should be quick, because the health endpoint is called often.",
    ],
    ex: "Kubernetes calls the readiness probe before sending traffic to a new pod, and the liveness probe to decide whether to restart it.",
    code: [
      "A custom health indicator",
      '@Component\nclass PaymentGatewayHealth implements HealthIndicator {\n  public Health health() {\n    boolean up = gateway.ping();\n    return up ? Health.up().build()\n              : Health.down().withDetail("reason", "no reply").build();\n  }\n}',
      [
        "The class is picked up as a health contributor.",
        "It returns `UP` or `DOWN` with an optional detail.",
        "The health endpoint combines it with the other indicators.",
      ],
      "java",
    ],
    mistakes: [
      "Making the liveness probe depend on the database.",
      "Writing a slow health check that times out the probe.",
    ],
    follow: ["What is the difference between liveness and readiness?"],
    points: [
      "Aggregates health indicators",
      "Liveness: restart or not",
      "Readiness: send traffic or not",
    ],
    notes:
      "Health = indicators combined. Liveness restarts, readiness gates traffic.",
    src: [
      [
        "Spring Boot Reference: Endpoints (Health)",
        `${S}/actuator/endpoints.html`,
      ],
      [
        "Spring Boot Reference: Kubernetes Probes",
        `${S}/actuator/endpoints.html#actuator.endpoints.kubernetes-probes`,
      ],
    ],
  }),
  g({
    slug: "actuator-metrics",
    topic: "Actuator",
    d: "medium",
    title: "How are metrics collected in Spring Boot? (Micrometer)",
    kw: ["metrics", "micrometer", "meter registry", "counter", "prometheus"],
    intent:
      "Checks that you know how application numbers reach a monitoring tool.",
    short:
      "Spring Boot uses Micrometer, a facade for metrics. Actuator registers many meters for you, such as JVM memory, CPU, HTTP server requests and the data source, and you can read them at `/actuator/metrics`. You create your own with a `MeterRegistry`, for example a `Counter` for orders placed or a `Timer` for a slow call. Adding a registry dependency for a system such as Prometheus exposes the same meters in that system's format.",
    detail: [
      "Meters can have tags, such as `status=500`, to slice the data.",
      "Micrometer is vendor-neutral, so changing the monitoring system does not change your code.",
      "Avoid tags with unlimited values, such as user ids, because they create too many time series.",
    ],
    ex: "The checkout code increments an `orders.placed` counter, which appears on a dashboard.",
    code: [
      "A custom counter",
      '@Service\nclass OrderService {\n  private final Counter placed;\n\n  OrderService(MeterRegistry registry) {\n    this.placed = Counter.builder("orders.placed").register(registry);\n  }\n\n  void place(Order order) {\n    // ...save the order\n    placed.increment();\n  }\n}',
      [
        "`MeterRegistry` is injected by Boot.",
        "The counter is registered once, in the constructor.",
        "`increment` is called for each order.",
      ],
      "java",
    ],
    mistakes: [
      "Using high-cardinality tags such as user ids.",
      "Creating a new meter on every request instead of reusing one.",
    ],
    follow: ["What is a tag on a metric?"],
    points: [
      "Micrometer is the metrics facade",
      "MeterRegistry for custom meters",
      "Registry dependency picks the monitoring system",
    ],
    notes:
      "Micrometer: `MeterRegistry`, counters and timers, and avoid high-cardinality tags.",
    src: [
      ["Spring Boot Reference: Metrics", `${S}/actuator/metrics.html`],
      ["Spring Boot Reference: Endpoints", `${S}/actuator/endpoints.html`],
    ],
  }),
  g({
    slug: "springboottest-annotation",
    topic: "Testing",
    d: "medium",
    title: "What does `@SpringBootTest` do?",
    kw: [
      "@SpringBootTest",
      "integration test",
      "application context",
      "webEnvironment",
      "RANDOM_PORT",
    ],
    intent:
      "Checks that you know when to load the whole application in a test.",
    short:
      "`@SpringBootTest` starts a full Spring application context for the test, with the same auto-configuration as the real application, so you can test several layers together as an integration test. By default it uses a mock web environment. With `webEnvironment = RANDOM_PORT` it starts a real embedded server on a free port, and you call it with `TestRestTemplate` or `WebTestClient`. It is slower than a unit test, so use it for a few important flows and not for every class.",
    detail: [
      "The context is cached and reused between tests that share the same configuration.",
      'Use `@ActiveProfiles("test")` to select test settings.',
      "Prefer slice tests or plain unit tests for most of your checks.",
    ],
    ex: "One test starts the application on a random port and checks that creating an order through the HTTP API stores it in the test database.",
    code: [
      "An integration test",
      '@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\nclass HealthIT {\n  @Autowired TestRestTemplate rest;\n\n  @Test\n  void healthIsUp() {\n    var response = rest.getForEntity("/actuator/health", String.class);\n    assertEquals(200, response.getStatusCode().value());\n  }\n}',
      [
        "The whole application starts on a random port.",
        "`TestRestTemplate` is configured to call that port.",
        "The test checks the real HTTP response.",
      ],
      "java",
    ],
    mistakes: [
      "Using `@SpringBootTest` for every test, which makes the suite slow.",
      "Using a fixed port, which fails when it is already in use.",
    ],
    follow: ["What is a slice test?"],
    points: [
      "Loads the full context",
      "RANDOM_PORT starts a real server",
      "Use it sparingly",
    ],
    notes:
      "`@SpringBootTest` = full context integration test; `RANDOM_PORT` for a real server.",
    src: [
      [
        "Spring Boot Reference: Testing Spring Boot Applications",
        `${S}/testing/spring-boot-applications.html`,
      ],
      ["Spring Boot Reference: Testing", `${S}/testing/index.html`],
    ],
  }),
  g({
    slug: "slice-tests",
    topic: "Testing",
    d: "medium",
    title: "What are slice tests such as `@WebMvcTest` and `@DataJpaTest`?",
    kw: ["@WebMvcTest", "@DataJpaTest", "slice test", "MockMvc", "test slices"],
    intent: "Checks that you can test one layer quickly.",
    short:
      "A slice test loads only the part of the application that one layer needs. `@WebMvcTest` starts the Spring MVC infrastructure and the controllers, but not services or repositories, so you test request mapping, validation and JSON with `MockMvc`, with other dependencies replaced by mocks. `@DataJpaTest` loads only JPA repositories and entities with an in-memory database by default. Slice tests start faster than `@SpringBootTest` and are more focused.",
    detail: [
      "Other slices exist, such as `@JsonTest` and `@RestClientTest`.",
      "The code under test needs the beans it depends on to be mocked or imported.",
      "`@DataJpaTest` rolls back each test's transaction by default.",
    ],
    ex: "A controller test sends a request to `/orders/1` with MockMvc and checks the status and JSON, with the service mocked.",
    mistakes: [
      "Expecting the service beans to exist in a `@WebMvcTest`.",
      "Using `@SpringBootTest` for a check that a slice could do in a fraction of the time.",
    ],
    follow: ["How do you provide a mock for the service?"],
    points: [
      "Load one layer only",
      "WebMvcTest for controllers",
      "DataJpaTest for repositories",
    ],
    notes:
      "Slice tests load one layer: `@WebMvcTest` (web), `@DataJpaTest` (JPA).",
    src: [
      [
        "Spring Boot Reference: Testing Spring Boot Applications",
        `${S}/testing/spring-boot-applications.html`,
      ],
      ["Spring Boot Reference: Testing", `${S}/testing/index.html`],
    ],
  }),
  g({
    slug: "mockmvc-controller-test",
    topic: "Testing",
    d: "medium",
    title: "How do you test a REST controller with MockMvc?",
    kw: ["MockMvc", "@WebMvcTest", "perform", "jsonPath", "status"],
    intent: "Checks that you can test the web layer without starting a server.",
    short:
      'With `@WebMvcTest(OrderController.class)` Boot creates a `MockMvc` that sends requests through the Spring MVC machinery without a network. You call `mockMvc.perform(get("/orders/1"))`, and assert on the status, headers and body with `andExpect`, for example `status().isOk()` and `jsonPath("$.id").value(1)`. The service the controller uses is replaced by a mock bean, and you set what it returns for each test.',
    detail: [
      "Mocking beans in the Spring context is done with `@MockBean`, which newer Spring versions replace with `@MockitoBean`. Use the one your version supports.",
      "A test for a `POST` sets the content type and the JSON body.",
      "Validation errors and error responses can be tested in the same way.",
    ],
    ex: "A test posts an order with a missing field and checks that the response status is `400`.",
    code: [
      "A controller test",
      '@WebMvcTest(OrderController.class)\nclass OrderControllerTest {\n  @Autowired MockMvc mockMvc;\n  @MockitoBean OrderService service;\n\n  @Test\n  void returnsOrder() throws Exception {\n    when(service.find(1L)).thenReturn(new OrderDto(1L, "paid"));\n\n    mockMvc.perform(get("/orders/1"))\n        .andExpect(status().isOk())\n        .andExpect(jsonPath("$.status").value("paid"));\n  }\n}',
      [
        "Only the web layer for `OrderController` is loaded.",
        "The mocked service returns a fixed value.",
        "The request is performed without a real server.",
        "The status and a JSON field are asserted.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting to mock the service and getting a missing bean error.",
      "Testing business rules through the controller instead of the service.",
    ],
    follow: ["How would you test a POST with validation?"],
    points: [
      "No network, no server",
      "perform and andExpect",
      "Service replaced with a mock bean",
    ],
    notes:
      "`@WebMvcTest` + `MockMvc.perform(...).andExpect(...)`, with the service mocked.",
    src: [
      [
        "Spring Boot Reference: Testing Spring MVC Tests",
        `${S}/testing/spring-boot-applications.html`,
      ],
      [
        "Spring Framework Reference: MockMvc",
        "https://docs.spring.io/spring-framework/reference/testing/mockmvc.html",
      ],
    ],
  }),
  g({
    slug: "configuration-properties",
    topic: "Configuration properties",
    d: "medium",
    title: "What is `@ConfigurationProperties`?",
    kw: [
      "@ConfigurationProperties",
      "type-safe configuration",
      "binding",
      "prefix",
      "record",
    ],
    intent: "Checks that you group settings into a typed object.",
    short:
      '`@ConfigurationProperties(prefix = "app.mail")` binds all the properties that start with a prefix to the fields of a class, or of a record, so settings are typed, grouped and easy to pass around instead of being read one by one. Boot handles type conversion and relaxed naming, so `app.mail.from-address`, `APP_MAIL_FROMADDRESS` and `appMail.fromAddress` can all set the same field. The class must be registered with `@EnableConfigurationProperties` or `@ConfigurationPropertiesScan`.',
    detail: [
      "A record with a constructor gives an immutable settings object.",
      "Nested objects, lists and maps are supported.",
      "Add `@Validated` and Bean Validation annotations to fail at start-up when a required setting is missing.",
    ],
    ex: "A mail service takes an `AppMailProperties` object with the sender, host and timeout instead of three `@Value` fields.",
    code: [
      "Typed settings as a record",
      '@ConfigurationProperties(prefix = "app.mail")\n@Validated\npublic record AppMailProperties(\n    @NotBlank String from,\n    @NotBlank String host,\n    @DefaultValue("5s") Duration timeout) { }\n\n// app.mail.from=noreply@shop.test\n// app.mail.host=smtp.shop.test',
      [
        "The prefix selects which properties are bound.",
        "A record makes the settings immutable.",
        "`@DefaultValue` gives a default, and the `Duration` is converted from text.",
        "`@NotBlank` makes the application fail to start without these values.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting to register the class, so it is never bound.",
      "Reading many `@Value` fields for one group of settings.",
    ],
    follow: ["What is relaxed binding?"],
    points: [
      "Binds a prefix to a typed object",
      "Relaxed binding and conversion",
      "Validate at start-up",
    ],
    notes:
      "`@ConfigurationProperties(prefix)` + `@Validated`; register with `@ConfigurationPropertiesScan`.",
    src: [
      [
        "Spring Boot Reference: Type-safe Configuration Properties",
        `${S}/features/external-config.html#features.external-config.typesafe-configuration-properties`,
      ],
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
    ],
  }),
  g({
    slug: "value-vs-configuration-properties",
    topic: "Configuration properties",
    d: "medium",
    title:
      "What is the difference between `@Value` and `@ConfigurationProperties`?",
    kw: [
      "@Value",
      "@ConfigurationProperties",
      "SpEL",
      "relaxed binding",
      "type-safe",
    ],
    intent: "Checks that you choose the right tool for a setting.",
    short:
      '`@Value("${app.name}")` injects one property, and it also supports default values and Spring Expression Language. It is quick for a single value but has only limited relaxed binding, no built-in grouping, and the metadata for the IDE is not generated. `@ConfigurationProperties` binds a whole group of related properties to a typed class, supports relaxed binding, nesting, lists and validation, and is the better choice when you have more than one or two related settings.',
    detail: [
      "`@Value` is fine for a single simple value, such as a feature name.",
      "`@ConfigurationProperties` objects are easy to unit test because they are plain classes.",
      "Both read from the same property sources.",
    ],
    ex: "One `@Value` reads the application name for a log line, while a `MailProperties` class holds all the mail settings.",
    mistakes: [
      "Scattering `@Value` fields with the same prefix across many classes.",
      "Mixing both styles for the same group of settings.",
    ],
    follow: ["How do you give @Value a default?"],
    points: [
      "@Value: one value, supports SpEL",
      "@ConfigurationProperties: typed group",
      "Prefer the group for several related settings",
    ],
    notes: "`@Value` for one value, `@ConfigurationProperties` for a group.",
    src: [
      [
        "Spring Boot Reference: Typesafe Configuration Properties",
        `${S}/features/external-config.html#features.external-config.typesafe-configuration-properties`,
      ],
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
    ],
  }),
  g({
    slug: "secrets-and-configuration",
    topic: "Configuration properties",
    d: "easy",
    title:
      "How should you handle passwords and secrets in Spring Boot configuration?",
    kw: [
      "secrets",
      "environment variables",
      "password",
      "configuration",
      "vault",
    ],
    intent: "Checks that you do not commit secrets.",
    short:
      "Do not put real passwords, tokens or keys in `application.properties` or in the repository. Keep a placeholder or a safe default in the file, such as `spring.datasource.password=${DB_PASSWORD}`, and supply the real value from an environment variable, a secret store such as a Kubernetes secret, or a secrets manager at deployment time. Boot reads the value from the environment, so the same jar runs everywhere with different secrets.",
    detail: [
      "A secret that was committed once stays in the history and should be rotated.",
      "Actuator can show configuration, so sensitive values must be masked and the endpoints secured.",
      "Local development can use a git-ignored file with local values.",
    ],
    ex: "The container receives `DB_PASSWORD` from the platform's secret store, and the property file refers to it with `${DB_PASSWORD}`.",
    code: [
      "A placeholder instead of a secret",
      "spring.datasource.url=jdbc:postgresql://db:5432/shop\nspring.datasource.username=${DB_USER}\nspring.datasource.password=${DB_PASSWORD}",
      [
        "The file contains placeholders only.",
        "The real values come from environment variables at run time.",
      ],
      "properties",
    ],
    mistakes: [
      "Committing the production password in a profile file.",
      "Printing the full configuration in logs.",
    ],
    follow: ["What do you do if a secret was committed?"],
    points: [
      "No secrets in the repository",
      "Placeholders plus environment variables",
      "Rotate leaked secrets",
    ],
    notes: "Use `${ENV_VAR}` placeholders and set secrets in the environment.",
    src: [
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
      ["Spring Boot Reference: Endpoints", `${S}/actuator/endpoints.html`],
    ],
  }),
  g({
    slug: "test-properties-and-profiles",
    topic: "Testing",
    d: "medium",
    title: "How do you change configuration for a test?",
    kw: [
      "@ActiveProfiles",
      "@TestPropertySource",
      "properties",
      "test configuration",
      "application-test.properties",
    ],
    intent:
      "Checks that you can give a test its own settings without touching production files.",
    short:
      'Put test-only settings in `src/test/resources`, where an `application.properties` or `application-test.properties` is picked up for tests. Select a profile with `@ActiveProfiles("test")`, set a few properties directly with `@SpringBootTest(properties = "app.feature=false")` or `@TestPropertySource`, and use `@DynamicPropertySource` when a value is only known at run time, such as the port of a database container. Test settings have a higher priority than the main configuration.',
    detail: [
      "Keep test settings small and close to the test that needs them.",
      "Never point a test at a shared or production database.",
      "Properties set on the test annotation apply only to that test class.",
    ],
    ex: "A test class sets `spring.datasource.url` to an in-memory database and turns off an external payment client.",
    code: [
      "Test settings on the annotation",
      '@SpringBootTest(properties = {"app.payments.enabled=false"})\n@ActiveProfiles("test")\nclass OrderServiceIT {\n  // runs with the test profile and the payments client switched off\n}',
      [
        "`properties` sets values for this test class only.",
        "`@ActiveProfiles` loads `application-test.properties`.",
      ],
      "java",
    ],
    mistakes: [
      "Running tests against a real shared database.",
      "Copying the whole production configuration into the test resources.",
    ],
    follow: ["How do you set a property that is known only at run time?"],
    points: [
      "src/test/resources for test settings",
      "@ActiveProfiles and @TestPropertySource",
      "@DynamicPropertySource for run-time values",
    ],
    notes:
      "Test config: `@ActiveProfiles`, `properties = ...`, `@DynamicPropertySource`.",
    src: [
      [
        "Spring Boot Reference: Testing Spring Boot Applications",
        `${S}/testing/spring-boot-applications.html`,
      ],
      [
        "Spring Boot Reference: Externalized Configuration",
        `${S}/features/external-config.html`,
      ],
    ],
  }),
  g({
    slug: "testcontainers-database-tests",
    topic: "Testing",
    d: "hard",
    title: "Why use Testcontainers for database tests in Spring Boot?",
    kw: [
      "testcontainers",
      "@ServiceConnection",
      "integration test",
      "real database",
      "docker",
    ],
    intent:
      "Checks that you know how to test against the same kind of database you run in production.",
    short:
      "Testcontainers starts a throwaway Docker container, such as a real PostgreSQL, for a test run. This avoids differences between an in-memory database like H2 and the production database, for example in SQL dialect, types and locking. Spring Boot supports it directly: a container bean annotated with `@ServiceConnection` is detected, and Boot configures the connection properties automatically, so no manual URL is needed. The cost is that tests need Docker and start a bit slower.",
    detail: [
      "A container can be shared by all tests in a class, or by the whole suite, to save start-up time.",
      "The container is removed after the test run, so tests start from a clean state.",
      "For quick checks of business logic, keep using plain unit tests.",
    ],
    ex: "A repository test runs the real PostgreSQL queries against a PostgreSQL container, and finds a dialect problem that H2 hid.",
    code: [
      "A container with automatic connection settings",
      '@SpringBootTest\n@Testcontainers\nclass OrderRepositoryIT {\n  @Container\n  @ServiceConnection\n  static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");\n\n  // the DataSource now points to the container\n}',
      [
        "The `@Container` field starts a PostgreSQL container for the tests.",
        "`@ServiceConnection` tells Boot to use it for the data source settings.",
      ],
      "java",
    ],
    mistakes: [
      "Testing only against H2 and trusting the result for PostgreSQL.",
      "Starting a new container for every test method.",
    ],
    follow: ["What is the downside of Testcontainers?"],
    points: [
      "Real database in a container",
      "@ServiceConnection configures the connection",
      "Needs Docker, slower to start",
    ],
    notes:
      "Testcontainers = real database in tests; `@ServiceConnection` wires it up.",
    src: [
      [
        "Spring Boot Reference: Testcontainers",
        `${S}/testing/testcontainers.html`,
      ],
      ["Spring Boot Reference: Testing", `${S}/testing/index.html`],
    ],
  }),
  g({
    slug: "logging-levels-in-boot",
    topic: "Configuration properties",
    d: "easy",
    title: "How do you set log levels in Spring Boot?",
    kw: [
      "logging.level",
      "logback",
      "log level",
      "logging.file.name",
      "application.properties",
    ],
    intent: "Checks that you can change logging without code changes.",
    short:
      "Spring Boot uses Logback by default through SLF4J, and it logs to the console at `INFO`. You set levels with properties: `logging.level.root=WARN` for everything, and `logging.level.com.shop.orders=DEBUG` for one package or class. Levels from most to least detailed are `TRACE`, `DEBUG`, `INFO`, `WARN` and `ERROR`. `logging.file.name` writes to a file, and Actuator's `loggers` endpoint can change a level at run time without a restart.",
    detail: [
      "Use `DEBUG` temporarily to diagnose a problem, and do not leave it on in production.",
      "Never log passwords, tokens or personal data.",
      'Use parameterised messages, such as `log.info("Order {} placed", id)`, rather than string concatenation.',
    ],
    ex: "While investigating a bug, the team raises one package to `DEBUG` for an hour and then puts it back to `INFO`.",
    code: [
      "Log levels in properties",
      "logging.level.root=WARN\nlogging.level.com.shop.orders=DEBUG\nlogging.level.org.hibernate.SQL=DEBUG",
      [
        "The root level is quiet.",
        "One package is detailed for diagnosis.",
        "Hibernate's SQL logger shows the generated queries.",
      ],
      "properties",
    ],
    mistakes: [
      "Leaving `DEBUG` on for everything in production.",
      "Logging sensitive data.",
    ],
    follow: ["How do you change a log level without a restart?"],
    points: [
      "Logback by default",
      "logging.level.<package>=LEVEL",
      "Actuator loggers endpoint changes it live",
    ],
    notes:
      "`logging.level.root=WARN`, `logging.level.com.shop=DEBUG`. Never log secrets.",
    src: [
      ["Spring Boot Reference: Logging", `${S}/features/logging.html`],
      [
        "Spring Boot Reference: Endpoints (loggers)",
        `${S}/actuator/endpoints.html`,
      ],
    ],
  }),
])
