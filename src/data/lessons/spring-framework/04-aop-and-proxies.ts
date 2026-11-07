import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-framework", {
  slug: "aop-and-proxies",
  title: "Aspect-oriented programming and Spring proxies",
  topic: "AOP",
  minutes: 90,
  overview:
    "Understand cross-cutting concerns, write aspects with advice and pointcuts, and know how proxies work and why self-invocation bypasses them.",
  objectives: [
    "Explain aspect, advice, pointcut and join point",
    "Write @Around and @Before advice",
    "Explain JDK and CGLIB proxies, self-invocation and @Transactional",
  ],
  prerequisites: ["lesson.spring-framework.beans-scopes-and-lifecycle"],
  sections: [
    {
      kind: "explain",
      heading: "Cross-cutting concerns",
      body: [
        "**Aspect-oriented programming (AOP)** separates **cross-cutting concerns**, such as logging, security checks, transactions and timing, from business logic, so they are written **once** and applied to many places, and not copied into each method. The main terms: an **aspect** is a class that holds the cross-cutting logic. A **join point** is a point where an aspect can act, which in Spring AOP is always a **method execution**. **Advice** is the action taken at a join point. A **pointcut** is an expression that selects which join points the advice applies to.",
        "Typical Spring uses are `@Transactional`, `@Cacheable` and the security annotations. They are applied by AOP, without changing your code.",
      ],
    },
    {
      kind: "explain",
      heading: "Advice types",
      body: [
        "`@Before` runs before the method. `@AfterReturning` runs after it returns normally, and can read the result. `@AfterThrowing` runs when it throws. `@After` runs in both cases, like `finally`. **`@Around`** is the most powerful: it wraps the call, receives a `ProceedingJoinPoint`, decides whether and when to call `proceed()`, and can change the arguments, the result or the exception. Use the weakest advice that does the job, and `@Around` for timing, caching and retry.",
        "In `@Around`, forgetting `proceed()` means that the target method never runs, and the advice must **return the result** of `proceed()`. Aspects must be Spring beans, for example with `@Component`, and Spring Boot enables `@AspectJ` support automatically.",
      ],
    },
    {
      kind: "code",
      heading: "A timing aspect",
      example: {
        title: "@Around",
        language: "java",
        code: '@Aspect\n@Component\nclass TimingAspect {\n\n  @Around("execution(* com.shop.service..*(..))")\n  Object time(ProceedingJoinPoint pjp) throws Throwable {\n    long start = System.nanoTime();\n    try {\n      return pjp.proceed();\n    } finally {\n      long ms = (System.nanoTime() - start) / 1_000_000;\n      System.out.println(pjp.getSignature() + " took " + ms + " ms");\n    }\n  }\n}',
        walkthrough: [
          "The pointcut `execution(* com.shop.service..*(..))` selects every method in the `service` package and below.",
          "`proceed()` calls the real method, and its result is returned to the caller.",
          "`finally` makes sure that the time is logged even when the method throws.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "How it works: proxies",
      body: [
        "Spring AOP is **proxy-based**. It creates a proxy object that wraps the target bean and has the same type. Callers receive the proxy from the container. When they call a method, the proxy runs the matching advice and then the real method. If the target implements an interface, Spring can use a **JDK dynamic proxy**. Otherwise it uses **CGLIB**, which creates a subclass at run time, and Spring Boot uses CGLIB by default. Because the proxy is a subclass, `final` classes and methods cannot be advised.",
        "The proxy is usually created by a `BeanPostProcessor`, after the bean is initialised. Only calls that go **through the proxy** are advised.",
      ],
    },
    {
      kind: "explain",
      heading: "Self-invocation and @Transactional",
      body: [
        "When one method of a bean calls **another method of the same bean**, it is a plain Java call on `this`, the real object. The proxy is **skipped**, so the advice does not run. This is the famous **self-invocation** problem. A `@Transactional(REQUIRES_NEW)` method that is called from another method of the same class does not start a new transaction. The same applies to `@Cacheable`, `@Async` and security annotations.",
        "The usual fix is to move the method to **another bean** and inject it, so the call goes through a proxy. `@Transactional` itself is declarative transaction management built on AOP: a proxy starts a transaction before the method, commits when it returns, and rolls back on a **`RuntimeException` or `Error`** by default. Checked exceptions commit, unless you add `rollbackFor`. If you catch the exception inside the method, the proxy never sees it, so the transaction commits.",
        "**AspectJ** is a complete AOP system that weaves aspects into bytecode at compile time or load time. It can advise field access, constructors and non-Spring objects, and has no self-invocation limit, but it needs an extra compiler or agent. Start with Spring AOP.",
      ],
    },
    {
      kind: "code",
      heading: "The proxy is bypassed",
      example: {
        title: "Self-invocation",
        language: "java",
        code: "@Service\nclass OrderService {\n\n  public void process(Order order) {\n    saveAudit(order);          // plain call on this: no proxy, no new transaction\n  }\n\n  @Transactional(propagation = Propagation.REQUIRES_NEW)\n  public void saveAudit(Order order) {\n    // ...\n  }\n}\n\n// fix: move saveAudit to AuditService and inject it,\n// so the call goes through the AuditService proxy",
        walkthrough: [
          "`process` calls `saveAudit` directly on the real object, so the proxy and its transactional advice are not involved.",
          "In a separate `AuditService` bean, the same call would go through the proxy and start a new transaction.",
          "Tests that check that the transaction really starts catch this problem early.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Putting @Transactional on a method and calling it from the same class.",
          fix: "Call it from another bean.",
        },
        {
          mistake:
            "Declaring a class or method `final` and wondering why advice is skipped.",
          fix: "Remove `final`, or use an interface proxy.",
        },
        {
          mistake: "Not calling `proceed()` in @Around advice.",
          fix: "Call it and return its result.",
        },
        {
          mistake: "Using AOP for business logic that belongs in services.",
          fix: "Use aspects for cross-cutting concerns only.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Auditing service calls",
      scenario:
        "A team wants to log the user, the method and the duration of every call in the service layer.",
      body: [
        "One `@Around` aspect with a pointcut on the service package does it, with no change to the services. It reads the current user from the security context, calls `proceed()`, and logs in `finally`.",
        "A new service is covered automatically.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "aop-proxy",
      prompt: "How does Spring AOP apply advice?",
      options: [
        "Through a proxy around the bean",
        "By changing the source code",
        "By editing bytecode at compile time",
      ],
      answer: 0,
      explanation: "JDK proxies or CGLIB subclasses.",
    },
    {
      type: "single",
      id: "aop-self",
      prompt:
        "Why does calling a @Transactional method from the same class not start a transaction?",
      options: [
        "The call bypasses the proxy",
        "Transactions are disabled",
        "The method must be static",
      ],
      answer: 0,
      explanation: "Only calls through the proxy are advised.",
    },
    {
      type: "truefalse",
      id: "aop-final",
      statement: "CGLIB can advise a final method.",
      answer: false,
      explanation:
        "CGLIB creates a subclass, so final classes and methods cannot be advised.",
    },
    {
      type: "single",
      id: "aop-rollback",
      prompt: "By default, which exceptions roll back a @Transactional method?",
      options: [
        "RuntimeException and Error",
        "All exceptions",
        "Only checked exceptions",
      ],
      answer: 0,
      explanation: "Add `rollbackFor` for checked exceptions.",
    },
  ],
  assignment: {
    title: "An aspect and its limits",
    task: [
      "Write a timing aspect for a service package, and an annotation-based aspect with a custom annotation `@Timed`.",
      "Show the self-invocation problem with `@Transactional(REQUIRES_NEW)` and fix it by moving the method to another bean.",
    ],
    checklist: [
      "The aspect needs no change in the services",
      "I demonstrated the self-invocation problem",
      "The fix goes through a proxy",
    ],
    minutes: 40,
  },
  exercises: [
    {
      slug: "aop-ex",
      title: "Write a before advice",
      task: [
        "Write an aspect with a `@Before` advice that logs the name of every method called in classes whose name ends with `Service` in the package `com.shop.service`.",
      ],
      language: "java",
      starter: "@Aspect\n@Component\nclass LogAspect {\n  // your code\n}",
      solution:
        '@Aspect\n@Component\nclass LogAspect {\n  @Before("execution(* com.shop.service.*Service.*(..))")\n  void logCall(JoinPoint joinPoint) {\n    System.out.println("Calling " + joinPoint.getSignature().getName());\n  }\n}',
      hints: ["Use `@Before` with an `execution` pointcut and `JoinPoint`."],
      checklist: [
        "The pointcut selects the service classes",
        "The advice reads the method name",
        "The aspect is a Spring bean",
      ],
    },
  ],
  revisionNotes: [
    "AOP: aspect, join point (method execution), advice, pointcut",
    "Advice: Before, AfterReturning, AfterThrowing, After, Around (call and return proceed())",
    "Proxies: JDK for interfaces, CGLIB otherwise; final cannot be advised",
    "Self-invocation bypasses the proxy; @Transactional rolls back on RuntimeException/Error by default",
  ],
  resources: [
    {
      label:
        "Spring Framework Reference: Aspect Oriented Programming with Spring",
      url: "https://docs.spring.io/spring-framework/reference/core/aop.html",
    },
    {
      label: "Spring Framework Reference: Proxying Mechanisms",
      url: "https://docs.spring.io/spring-framework/reference/core/aop/proxying.html",
    },
    {
      label: "Spring Framework Reference: Using @Transactional",
      url: "https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html",
    },
  ],
})
