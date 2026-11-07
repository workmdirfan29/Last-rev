import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-boot", {
  slug: "actuator",
  title: "Actuator: health, metrics and production readiness",
  topic: "Actuator",
  minutes: 60,
  overview:
    "Add Actuator, expose the right endpoints safely, write health indicators, and collect metrics with Micrometer.",
  objectives: [
    "Explain what Actuator provides and which endpoints exist",
    "Expose and secure endpoints, and use liveness and readiness",
    "Add a custom health indicator and a custom metric",
  ],
  prerequisites: ["lesson.spring-boot.profiles-and-environments"],
  sections: [
    {
      kind: "explain",
      heading: "What Actuator adds",
      body: [
        "**Actuator** adds production-ready features to a Boot application, mainly **endpoints** that report on its state. `health` says whether the application and its dependencies, such as the database, are up. `info` shows application details, `metrics` exposes measurements such as memory, requests and the JVM, and others show the loggers, the environment or the mappings. You add `spring-boot-starter-actuator`, and monitoring systems and orchestrators can then check the application automatically.",
        "Endpoints can be reached over HTTP or JMX. Only a few are exposed over HTTP by default, because many endpoints can reveal sensitive details. Actuator uses **Micrometer** for metrics, and it can send them to monitoring systems.",
      ],
    },
    {
      kind: "code",
      heading: "Exposure settings",
      example: {
        title: "Expose and secure",
        language: "properties",
        code: "management.endpoints.web.exposure.include=health,info,metrics\nmanagement.endpoint.health.show-details=when-authorized\nmanagement.endpoint.health.probes.enabled=true\nmanagement.server.port=9090",
        walkthrough: [
          "Only three endpoints are exposed over HTTP. Avoid `*` in production.",
          "Health details are shown only to authorised users.",
          "The probes give the liveness and readiness groups, and Actuator listens on its own port, which can be closed to the public.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Health, liveness and readiness",
      body: [
        "The health endpoint combines the status of several **health indicators**, such as the database and disk space, and any you write by implementing `HealthIndicator`. It reports `UP`, or `DOWN` when a required part fails. Boot also supports **liveness** and **readiness** probes. Liveness tells an orchestrator whether the application is alive or must be **restarted**. Readiness tells it whether the application is ready to **receive traffic**, so an instance that is still starting is not sent requests.",
        "A liveness check should **not depend on external systems**, or a database outage would restart every instance. Custom indicators should be quick, because the health endpoint is called often. Endpoints such as `env` and `heapdump` can reveal secrets and internals, so they need protection or must stay unexposed.",
      ],
    },
    {
      kind: "code",
      heading: "A health indicator and a counter",
      example: {
        title: "Custom health and metric",
        language: "java",
        code: '@Component\nclass PaymentGatewayHealth implements HealthIndicator {\n  private final PaymentGateway gateway;\n\n  PaymentGatewayHealth(PaymentGateway gateway) {\n    this.gateway = gateway;\n  }\n\n  @Override\n  public Health health() {\n    return gateway.ping()\n        ? Health.up().build()\n        : Health.down().withDetail("reason", "no reply").build();\n  }\n}\n\n@Service\nclass OrderService {\n  private final Counter placed;\n\n  OrderService(MeterRegistry registry) {\n    this.placed = Counter.builder("orders.placed").register(registry);\n  }\n\n  void place(Order order) {\n    // save the order\n    placed.increment();\n  }\n}',
        walkthrough: [
          "The indicator is picked up automatically and contributes to the combined health result.",
          "`MeterRegistry` is injected by Boot, and the counter is registered once, in the constructor.",
          "`increment` is called for each order, and the metric appears at `/actuator/metrics/orders.placed`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Exposing every endpoint publicly.",
          fix: "Expose the few that are needed, secure them, or use a management port.",
        },
        {
          mistake: "Making the liveness probe depend on the database.",
          fix: "Keep liveness independent of other systems.",
        },
        {
          mistake: "Using high-cardinality tags such as user ids on metrics.",
          fix: "Use a small set of tag values.",
        },
        {
          mistake: "Writing a slow health check.",
          fix: "Keep it fast, or the probe will time out.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Running on Kubernetes",
      scenario:
        "A service is deployed with several replicas, and updates must not drop requests.",
      body: [
        "Configure the readiness probe to `/actuator/health/readiness` and the liveness probe to `/actuator/health/liveness`. A new pod receives traffic only after it is ready, and a stuck pod is restarted by the liveness probe. Metrics go to the monitoring system through Micrometer.",
        "The application tells the platform how it is doing.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ac-health",
      prompt: "What does the health endpoint report?",
      options: [
        "The combined status of health indicators",
        "The list of all beans",
        "The source code",
      ],
      answer: 0,
      explanation: "It is `UP` or `DOWN` with optional details.",
    },
    {
      type: "single",
      id: "ac-liveness",
      prompt: "What does a failing liveness probe cause?",
      options: [
        "A restart of the container",
        "Removal from the load balancer only",
        "Nothing",
      ],
      answer: 0,
      explanation:
        "A failing readiness probe removes the pod from the service.",
    },
    {
      type: "truefalse",
      id: "ac-expose",
      statement: "All Actuator endpoints are exposed over HTTP by default.",
      answer: false,
      explanation: "Only a few are, because many reveal sensitive details.",
    },
    {
      type: "blank",
      id: "ac-micrometer",
      prompt: "Spring Boot collects metrics with ___.",
      answer: "Micrometer",
      explanation: "Micrometer is the vendor-neutral metrics facade.",
    },
  ],
  assignment: {
    title: "Add Actuator",
    task: [
      "Add Actuator to a project, expose `health`, `info` and `metrics`, and open each endpoint.",
      "Write a custom health indicator and a counter, and check that both appear.",
    ],
    checklist: [
      "Only the needed endpoints are exposed",
      "Liveness does not depend on the database",
      "The custom metric increases",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "ac-ex",
      title: "A fast health indicator",
      task: [
        "Write a `HealthIndicator` for a `DiskSpaceMonitor` that returns `UP` if `freeMegabytes()` is at least 100 and `DOWN` with a detail otherwise.",
      ],
      language: "java",
      starter:
        "@Component\nclass DiskHealth implements HealthIndicator {\n  // your code\n}",
      solution:
        '@Component\nclass DiskHealth implements HealthIndicator {\n  private final DiskSpaceMonitor monitor;\n\n  DiskHealth(DiskSpaceMonitor monitor) {\n    this.monitor = monitor;\n  }\n\n  @Override\n  public Health health() {\n    long free = monitor.freeMegabytes();\n    return free >= 100\n        ? Health.up().withDetail("freeMb", free).build()\n        : Health.down().withDetail("freeMb", free).build();\n  }\n}',
      hints: ["Return `Health.up()` or `Health.down()` with a detail."],
      checklist: [
        "It is a Spring bean",
        "The check is quick",
        "A detail explains a DOWN result",
      ],
    },
  ],
  revisionNotes: [
    "Actuator: health, info, metrics, loggers and more; secure what you expose",
    "Health indicators combine; liveness restarts, readiness gates traffic",
    "Micrometer: MeterRegistry, counters, timers; avoid high-cardinality tags",
    "Use a management port or security for endpoints",
  ],
  resources: [
    {
      label: "Spring Boot Reference: Actuator",
      url: "https://docs.spring.io/spring-boot/reference/actuator/index.html",
    },
    {
      label: "Spring Boot Reference: Endpoints",
      url: "https://docs.spring.io/spring-boot/reference/actuator/endpoints.html",
    },
    {
      label: "Spring Boot Reference: Metrics",
      url: "https://docs.spring.io/spring-boot/reference/actuator/metrics.html",
    },
  ],
})
