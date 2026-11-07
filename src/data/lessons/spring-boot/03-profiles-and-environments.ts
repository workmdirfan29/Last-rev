import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-boot", {
  slug: "profiles-and-environments",
  title: "Profiles and externalised configuration",
  topic: "Profiles",
  minutes: 45,
  overview:
    "Run the same build in several environments with profiles, property files, environment variables and command-line arguments.",
  objectives: [
    "Activate profiles and use profile-specific files and beans",
    "Explain which configuration source wins",
    "Keep secrets out of the repository",
  ],
  prerequisites: ["lesson.spring-boot.starters-and-dependencies"],
  sections: [
    {
      kind: "explain",
      heading: "Profiles",
      body: [
        "A **profile** is a named set of configuration, such as `dev`, `test` or `prod`, that you switch on when you start the application. Beans can be tied to a profile with `@Profile`. Property files can be profile-specific: `application-dev.properties` is read when `dev` is active, and its values **override** those of `application.properties`. If no profile is active, the `default` profile is used, and several profiles can be active together.",
        'Activate a profile with the property `spring.profiles.active`: on the command line, `--spring.profiles.active=prod`, as a JVM argument, or as the environment variable `SPRING_PROFILES_ACTIVE=prod`, which suits containers. In tests, `@ActiveProfiles("test")` selects it.',
      ],
    },
    {
      kind: "code",
      heading: "Profile files and a profile bean",
      example: {
        title: "dev versus prod",
        language: "properties",
        code: "# application.properties\nspring.application.name=shop\nserver.port=8080\n\n# application-dev.properties\nspring.datasource.url=jdbc:h2:mem:shop\nlogging.level.com.shop=DEBUG\n\n# application-prod.properties\nspring.datasource.url=${DB_URL}\nspring.datasource.password=${DB_PASSWORD}",
        walkthrough: [
          "The shared file holds settings that are the same everywhere.",
          "The `dev` file points at an in-memory database and logs in detail.",
          "The `prod` file reads the URL and the password from environment variables, so no secret is stored in the file.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Different beans per profile",
      example: {
        title: "@Profile",
        language: "java",
        code: '@Service\n@Profile("dev")\nclass ConsoleEmailSender implements EmailSender {\n  public void send(String to, String body) {\n    System.out.println("To " + to + ": " + body);\n  }\n}\n\n@Service\n@Profile("prod")\nclass SmtpEmailSender implements EmailSender {\n  public void send(String to, String body) {\n    // send through the real mail server\n  }\n}',
        walkthrough: [
          "Only one of the two classes is registered, depending on the active profile.",
          "Code that depends on `EmailSender` does not change.",
          "A profile expression such as `!prod` or `dev | test` combines profiles.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Which source wins",
      body: [
        "Boot reads configuration from many sources, in a defined order, and a **later, higher-priority source overrides an earlier one**. In general: the defaults in the code have the lowest priority, then `application.properties` or `.yml`, then the profile-specific files, then **environment variables**, and **command-line arguments** have the highest priority. So you set a safe default in the jar and override it per environment, without a rebuild.",
        "Boot converts names, so the environment variable `SERVER_PORT` sets `server.port`. Files placed next to the jar, or in a `config` folder, override the packaged ones. The reference lists the complete order. Do not memorise it, but know that command line and environment win.",
        "**Secrets** such as passwords and keys must never be committed. Keep placeholders in the file, such as `${DB_PASSWORD}`, and supply the real value from the environment, a mounted file or a secret store. A secret that was committed once must be treated as leaked.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Creating many profiles for tiny differences.",
          fix: "Use a property for small differences.",
        },
        {
          mistake: "Committing the production password in a profile file.",
          fix: "Use a placeholder and an environment variable.",
        },
        {
          mistake: "Hard-coding `prod` in application.properties.",
          fix: "Let the deployment choose the profile.",
        },
        {
          mistake: "Having no bean for the active profile.",
          fix: "Make sure each profile has an implementation, or a default.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A container deployment",
      scenario:
        "The same image runs in a test and a production environment, with different databases and log levels.",
      body: [
        "The image contains `application.properties` and the profile files. The platform sets `SPRING_PROFILES_ACTIVE=prod` and the database variables for production, and other values for test. No change to the jar is needed.",
        "The environment decides, and the artifact stays the same.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pr-activate",
      prompt: "Which property activates a profile?",
      options: [
        "spring.profiles.active",
        "spring.profile.enable",
        "app.profile",
      ],
      answer: 0,
      explanation:
        "It can be set as an argument, a system property or an environment variable.",
    },
    {
      type: "single",
      id: "pr-wins",
      prompt: "Which source has the highest priority?",
      options: [
        "Command-line arguments",
        "application.properties",
        "Defaults in the code",
      ],
      answer: 0,
      explanation: "Command line and environment variables override the files.",
    },
    {
      type: "truefalse",
      id: "pr-secret",
      statement:
        "It is acceptable to commit the production database password in application-prod.properties.",
      answer: false,
      explanation: "Secrets belong in the environment or a secret store.",
    },
    {
      type: "blank",
      id: "pr-env",
      prompt:
        "The environment variable ___ sets the active profile in a container.",
      answer: "SPRING_PROFILES_ACTIVE",
      explanation: "Boot converts it to `spring.profiles.active`.",
    },
  ],
  assignment: {
    title: "Two environments",
    task: [
      "Create `application-dev.properties` and `application-prod.properties` with different data sources and log levels.",
      "Run the application with each profile, override a value from the command line and from an environment variable, and show the result.",
    ],
    checklist: [
      "The active profile is visible at start-up",
      "An environment variable overrides the file",
      "No secret is in the repository",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "pr-ex",
      title: "Environment-specific bean",
      task: [
        "Write two `@Profile` beans for a `PriceProvider` interface: `FixedPriceProvider` for `dev` that returns `100`, and `RemotePriceProvider` for `prod` that calls a remote service (a comment is enough).",
      ],
      language: "java",
      starter:
        "interface PriceProvider {\n  int price(String sku);\n}\n\n// your code",
      solution:
        'interface PriceProvider {\n  int price(String sku);\n}\n\n@Service\n@Profile("dev")\nclass FixedPriceProvider implements PriceProvider {\n  public int price(String sku) {\n    return 100;\n  }\n}\n\n@Service\n@Profile("prod")\nclass RemotePriceProvider implements PriceProvider {\n  public int price(String sku) {\n    // call the pricing service here\n    return 0;\n  }\n}',
      hints: ["Put `@Profile` next to `@Service` on each class."],
      checklist: [
        "Each class has one profile",
        "Callers use only the interface",
        "Only one bean is registered per profile",
      ],
    },
  ],
  revisionNotes: [
    "Profiles: named config sets; `application-{profile}.properties`; `@Profile` beans",
    "Activate with spring.profiles.active, SPRING_PROFILES_ACTIVE, `@ActiveProfiles`",
    "Command line and environment variables beat files; profile files beat the defaults",
    "Placeholders such as `${DB_PASSWORD}`; never commit secrets",
  ],
  resources: [
    {
      label: "Spring Boot Reference: Profiles",
      url: "https://docs.spring.io/spring-boot/reference/features/profiles.html",
    },
    {
      label: "Spring Boot Reference: Externalized Configuration",
      url: "https://docs.spring.io/spring-boot/reference/features/external-config.html",
    },
  ],
})
