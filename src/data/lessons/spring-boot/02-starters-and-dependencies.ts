import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-boot", {
  slug: "starters-and-dependencies",
  title: "Starters and dependency management",
  topic: "Starters",
  minutes: 45,
  overview:
    "Choose starters for a typical service, understand where versions come from, and use DevTools safely.",
  objectives: [
    "Explain what a starter is and name the common ones",
    "Explain the parent POM and the dependency BOM",
    "Use DevTools in development only",
  ],
  prerequisites: ["lesson.spring-boot.spring-boot-auto-configuration"],
  sections: [
    {
      kind: "explain",
      heading: "What a starter is",
      body: [
        "A **starter** is a single dependency that pulls in a curated set of libraries for one kind of task, with compatible versions, so you do not choose each one yourself. `spring-boot-starter-web` brings Spring MVC, JSON support and an embedded Tomcat. `spring-boot-starter-data-jpa` brings Spring Data JPA and Hibernate. A starter has no code of its own: it gives you dependencies, and auto-configuration then reacts to them.",
        "Starters follow the pattern `spring-boot-starter-*`, and third-party libraries name theirs `*-spring-boot-starter`. A REST API with a database usually needs `web`, `data-jpa`, a database driver, `validation`, `actuator`, `security` if the endpoints must be protected, and `test`. The driver is not part of the JPA starter, and must be added on its own.",
      ],
    },
    {
      kind: "code",
      heading: "Starters in a Maven build",
      example: {
        title: "Dependencies without versions",
        language: "xml",
        code: "<parent>\n  <groupId>org.springframework.boot</groupId>\n  <artifactId>spring-boot-starter-parent</artifactId>\n  <version>3.3.0</version>\n</parent>\n\n<dependencies>\n  <dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n  </dependency>\n  <dependency>\n    <groupId>org.postgresql</groupId>\n    <artifactId>postgresql</artifactId>\n    <scope>runtime</scope>\n  </dependency>\n  <dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-test</artifactId>\n    <scope>test</scope>\n  </dependency>\n</dependencies>",
        walkthrough: [
          "The parent supplies the managed versions, so the dependencies have no `version` element. The version number in the example is only an illustration.",
          "The database driver has the `runtime` scope, because the code does not compile against it.",
          "The test starter has the `test` scope, so it is not part of the final jar.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Where the versions come from",
      body: [
        "`spring-boot-starter-parent` is a Maven parent that gives your project defaults, such as the Java version property, UTF-8 encoding, plugin configuration and, above all, **dependency management**: a tested list of versions for hundreds of libraries. If your project already has another parent, **import the `spring-boot-dependencies` BOM** in `dependencyManagement` to get the same versions. Gradle projects use the Spring Boot plugin and the dependency management plugin.",
        "Upgrading Boot upgrades the managed library versions together. A version that you write yourself overrides the managed one, which you should do rarely and with care. Boot versions have a support period, so plan upgrades.",
        "**DevTools**, `spring-boot-devtools`, restarts the application automatically when classes change, enables LiveReload, and turns off template caching. It is for **development only**: it is disabled when the application runs as a fully packaged jar, and should be declared as optional so that it does not reach production.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing versions for libraries that Boot manages.",
          fix: "Leave them out, and let the parent or BOM decide.",
        },
        {
          mistake: "Forgetting the database driver.",
          fix: "Add it with the runtime scope.",
        },
        {
          mistake: "Adding the security starter without rules.",
          fix: "By default it protects every endpoint. Configure the rules.",
        },
        {
          mistake: "Leaving DevTools as a normal dependency of a library.",
          fix: "Make it optional, or a development-only scope.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Starting a new service",
      scenario:
        "A team needs a REST service with PostgreSQL, validation and health checks.",
      body: [
        "Generate the project with Spring Initializr, choosing Web, Data JPA, PostgreSQL Driver, Validation and Actuator. The generated build uses the parent, so every starter and library has a compatible version.",
        "The team writes code, not dependency lists.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "st-what",
      prompt: "What is a Spring Boot starter?",
      options: [
        "A dependency that bundles a set of libraries for a task",
        "A class that starts the server",
        "A Maven plugin",
      ],
      answer: 0,
      explanation: "It has no code of its own.",
    },
    {
      type: "single",
      id: "st-version",
      prompt: "Where do the versions of Boot-managed libraries come from?",
      options: [
        "The parent POM or the BOM",
        "Always from Maven Central latest",
        "From the application.properties",
      ],
      answer: 0,
      explanation: "The parent or the imported BOM manages them.",
    },
    {
      type: "truefalse",
      id: "st-devtools",
      statement: "DevTools is meant to be active in production.",
      answer: false,
      explanation: "It is for development. It is disabled in a packaged jar.",
    },
    {
      type: "multi",
      id: "st-api",
      prompt: "Which are typical dependencies of a REST API with a database?",
      options: [
        "spring-boot-starter-web",
        "spring-boot-starter-data-jpa",
        "A database driver",
        "spring-boot-starter-test in compile scope",
      ],
      answers: [0, 1, 2],
      explanation: "The test starter belongs in the test scope.",
    },
  ],
  assignment: {
    title: "Choose the starters",
    task: [
      "Generate two projects with Spring Initializr: a REST API with a database, and a small command-line tool.",
      "Compare the dependencies and explain each starter in one sentence.",
    ],
    checklist: [
      "No version is written for managed libraries",
      "The driver has the runtime scope",
      "I can explain the parent and the BOM",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "st-ex",
      title: "List the dependencies",
      task: [
        "Write the Gradle `dependencies` block for a REST API with validation, JPA, PostgreSQL and tests. Use the starters, and the right configuration names.",
      ],
      language: "groovy",
      starter: "dependencies {\n  // your code\n}",
      solution:
        "dependencies {\n  implementation 'org.springframework.boot:spring-boot-starter-web'\n  implementation 'org.springframework.boot:spring-boot-starter-validation'\n  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'\n  runtimeOnly 'org.postgresql:postgresql'\n  testImplementation 'org.springframework.boot:spring-boot-starter-test'\n}",
      hints: [
        "The driver is `runtimeOnly`, and the test starter is `testImplementation`.",
      ],
      checklist: [
        "No versions are written",
        "The driver is runtimeOnly",
        "The test starter is testImplementation",
      ],
    },
  ],
  revisionNotes: [
    "A starter is a curated dependency bundle: web, data-jpa, validation, actuator, test",
    "The parent POM or the spring-boot-dependencies BOM manages versions",
    "The database driver is added separately, with the runtime scope",
    "DevTools: development only",
  ],
  resources: [
    {
      label: "Spring Boot Reference: Build Systems",
      url: "https://docs.spring.io/spring-boot/reference/using/build-systems.html",
    },
    {
      label: "Spring Boot Reference: Developer Tools",
      url: "https://docs.spring.io/spring-boot/reference/using/devtools.html",
    },
  ],
})
