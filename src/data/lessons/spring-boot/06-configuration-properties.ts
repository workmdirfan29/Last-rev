import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-boot", {
  slug: "configuration-properties",
  title: "Type-safe configuration with @ConfigurationProperties",
  topic: "Configuration properties",
  minutes: 45,
  overview:
    "Bind groups of settings to typed objects, validate them at start-up, and choose between @Value and @ConfigurationProperties.",
  objectives: [
    "Bind a prefix to a record or class with @ConfigurationProperties",
    "Validate settings so that the application fails fast",
    "Decide between @Value and @ConfigurationProperties",
  ],
  prerequisites: ["lesson.spring-boot.profiles-and-environments"],
  sections: [
    {
      kind: "explain",
      heading: "Why typed settings",
      body: [
        'Reading settings with many `@Value("${...}")` strings spreads names through the code, and a missing or wrong value is noticed late. `@ConfigurationProperties(prefix = "app.mail")` binds **all the properties with a prefix** to the fields of a class or a record, so the settings are typed, grouped and easy to pass around. Boot converts types such as durations and lists, and supports **relaxed binding**: `app.mail.from-address`, `APP_MAIL_FROMADDRESS` and `appMail.fromAddress` can set the same field.',
        "Register the class with `@EnableConfigurationProperties` or `@ConfigurationPropertiesScan`. A **record** gives an immutable settings object. Add `@Validated` and Bean Validation annotations, such as `@NotBlank` and `@Min`, and the application **refuses to start** when a required value is missing or wrong, which is much better than a failure in the middle of a request.",
      ],
    },
    {
      kind: "code",
      heading: "Typed and validated settings",
      example: {
        title: "A record with defaults",
        language: "java",
        code: '@ConfigurationProperties(prefix = "app.mail")\n@Validated\npublic record MailProperties(\n    @NotBlank String from,\n    @NotBlank String host,\n    @DefaultValue("5s") Duration timeout) {\n}\n\n// application.properties\n// app.mail.from=noreply@shop.test\n// app.mail.host=smtp.shop.test\n\n@SpringBootApplication\n@ConfigurationPropertiesScan\npublic class ShopApplication {\n}',
        walkthrough: [
          "The prefix selects which properties are bound to the record.",
          '`@DefaultValue("5s")` gives a default, and the text is converted to a `Duration`.',
          "`@NotBlank` with `@Validated` makes start-up fail if `from` or `host` is missing. `@ConfigurationPropertiesScan` finds the record.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "@Value or @ConfigurationProperties",
      body: [
        '`@Value("${app.name}")` injects **one property**, with an optional default as in `${app.timeout:30}`, and it can also evaluate Spring Expression Language. It is fine for a single simple value. It has limited relaxed binding, no grouping, and no validation. `@ConfigurationProperties` is the better choice when you have more than one or two **related** settings: it supports nesting, lists, validation and metadata for the IDE.',
        "Settings objects are plain classes, so they are easy to unit test. Never log sensitive settings. Keep secrets out of the files, and supply them from the environment, as the profiles lesson showed.",
      ],
    },
    {
      kind: "code",
      heading: "A single value",
      example: {
        title: "@Value with a default",
        language: "java",
        code: '@Component\nclass StartupBanner {\n  private final String name;\n  private final int retries;\n\n  StartupBanner(@Value("${spring.application.name}") String name,\n                @Value("${app.retries:3}") int retries) {\n    this.name = name;\n    this.retries = retries;\n  }\n}',
        walkthrough: [
          "`${spring.application.name}` has no default, so start-up fails if it is missing.",
          "`${app.retries:3}` uses `3` when the property is absent.",
          "For a group of settings, use a properties class instead.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Scattering @Value strings for one group of settings.",
          fix: "Use one properties class.",
        },
        {
          mistake: "Forgetting to register the properties class.",
          fix: "Add `@ConfigurationPropertiesScan` or `@EnableConfigurationProperties`.",
        },
        {
          mistake:
            "Discovering a missing setting only when the first request arrives.",
          fix: "Validate with `@Validated`, so start-up fails.",
        },
        {
          mistake: "Mixing both styles for the same group.",
          fix: "Pick one per group of settings.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A payment client",
      scenario:
        "A payment client needs a base URL, a timeout, a retry count and an API key.",
      body: [
        "Put the URL, timeout and retries in a validated record `PaymentProperties`, and supply the key from the environment through `${PAYMENT_API_KEY}`. The application refuses to start without the URL, and the client takes one typed object.",
        "A test creates the record directly, with no Spring.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cp-prefix",
      prompt: 'What does @ConfigurationProperties(prefix = "app.mail") do?',
      options: [
        "Binds all app.mail.* properties to a typed object",
        "Reads one property",
        "Creates the properties file",
      ],
      answer: 0,
      explanation: "It groups related settings and supports validation.",
    },
    {
      type: "single",
      id: "cp-fast",
      prompt:
        "How do you make the application fail at start-up when a setting is missing?",
      options: [
        "@Validated with constraint annotations",
        "Catch the exception later",
        "Use @Value without default",
      ],
      answer: 0,
      explanation:
        "A bad or missing value stops the application before it serves requests.",
    },
    {
      type: "truefalse",
      id: "cp-relaxed",
      statement:
        "With relaxed binding, `APP_MAIL_FROMADDRESS` can set `app.mail.from-address`.",
      answer: true,
      explanation: "Boot maps environment variable names to property names.",
    },
    {
      type: "single",
      id: "cp-value",
      prompt: "When is @Value a good fit?",
      options: [
        "A single simple value",
        "A group of ten related settings",
        "A nested list of objects",
      ],
      answer: 0,
      explanation: "Use properties classes for groups.",
    },
  ],
  assignment: {
    title: "Typed settings",
    task: [
      "Replace five `@Value` fields in an example class with one `@ConfigurationProperties` record.",
      "Add validation, run without a required setting to see the failure, and write a test that creates the record.",
    ],
    checklist: [
      "The application fails at start-up without a required setting",
      "A default is used for an optional value",
      "The class that uses it takes one object",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "cp-ex",
      title: "A validated record",
      task: [
        "Write a `@ConfigurationProperties` record `CacheProperties` with the prefix `app.cache`, a `@Min(1)` integer `maxEntries` and a `Duration ttl` that defaults to `10m`.",
      ],
      language: "java",
      starter: "// your code",
      solution:
        '@ConfigurationProperties(prefix = "app.cache")\n@Validated\npublic record CacheProperties(\n    @Min(1) int maxEntries,\n    @DefaultValue("10m") Duration ttl) {\n}',
      hints: [
        "Use `@DefaultValue` on the record component and `@Validated` on the record.",
      ],
      checklist: [
        "The prefix is app.cache",
        "maxEntries is validated",
        "ttl has a default",
      ],
    },
  ],
  revisionNotes: [
    "`@ConfigurationProperties(prefix)` binds a group of settings to a typed class or record",
    "`@Validated` + constraints: fail at start-up when a setting is wrong",
    "Relaxed binding of names; Duration and list conversion",
    "`@Value` for one value; properties classes for groups",
  ],
  resources: [
    {
      label: "Spring Boot Reference: Externalized Configuration",
      url: "https://docs.spring.io/spring-boot/reference/features/external-config.html",
    },
    {
      label: "Spring Boot Reference: Profiles",
      url: "https://docs.spring.io/spring-boot/reference/features/profiles.html",
    },
  ],
})
