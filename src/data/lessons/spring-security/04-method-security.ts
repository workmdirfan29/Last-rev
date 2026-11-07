import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-security", {
  slug: "method-security",
  title: "Method security",
  topic: "Method security",
  minutes: 45,
  overview:
    "Protect service methods with @PreAuthorize and related annotations, write SpEL rules, and combine URL and method security.",
  objectives: [
    "Enable method security",
    "Write @PreAuthorize and @PostAuthorize rules",
    "Choose between URL rules and method rules",
  ],
  prerequisites: ["lesson.spring-security.authorization-rules"],
  sections: [
    {
      kind: "explain",
      heading: "Rules next to the logic",
      body: [
        "**Method security** applies authorisation rules to Java methods, not only to URLs, using `@PreAuthorize`, `@PostAuthorize`, `@PreFilter`, `@PostFilter` and `@Secured`. You turn it on with **`@EnableMethodSecurity`** on a configuration class, which replaced the older `@EnableGlobalMethodSecurity`. Spring Security applies the checks through **proxies**, so it has the same limits as `@Transactional`, such as self-invocation. It protects the business logic wherever it is called from, which gives **defence in depth**, and it allows rules that depend on the arguments or the returned object.",
        "A failed check raises `AccessDeniedException`, which becomes `403`.",
      ],
    },
    {
      kind: "code",
      heading: "@PreAuthorize with SpEL",
      example: {
        title: "Roles, owners and beans",
        language: "java",
        code: '@Configuration\n@EnableMethodSecurity\nclass MethodSecurityConfig {\n}\n\n@Service\nclass ProfileService {\n\n  @PreAuthorize("hasRole(\'ADMIN\') or #userId == authentication.principal.id")\n  Profile update(long userId, ProfileForm form) {\n    // update the profile\n    return null;\n  }\n\n  @PreAuthorize("@orderPolicy.canCancel(#orderId, authentication)")\n  void cancel(long orderId) {\n    // cancel the order\n  }\n}',
        walkthrough: [
          "`@EnableMethodSecurity` turns on the annotation checks.",
          "The first rule lets an admin or the user themselves call the method, comparing the argument `#userId` with the current user.",
          "The second delegates a complex rule to a bean named `orderPolicy`, which is easier to test than a long expression.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "After the method, and choosing a level",
      body: [
        "`@PostAuthorize` runs **after** the method, and its expression can use `returnObject`, so it can check that the returned order belongs to the current user. If the check fails, an `AccessDeniedException` is thrown and the result is not returned. `@PostFilter` removes the elements of a returned collection that fail an expression, using `filterObject`. They are convenient, but the method has **already run**, so they must not be used when the method has side effects, and `@PostFilter` loads all elements first, which is inefficient for large data. Prefer `@PreAuthorize` and ownership queries.",
        "**URL rules** are coarse: they decide which kinds of users reach which areas, at the edge, before the controller. **Method rules** are fine-grained and sit next to the business logic. They still protect the method when it is called from a job, a message listener or another service. Use URL rules for the structure and method rules for the business decisions. Keep SpEL expressions short, because they are strings that the compiler does not check.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Annotating a method without enabling method security.",
          fix: "Add `@EnableMethodSecurity`, or nothing is checked.",
        },
        {
          mistake: "Long, hard-to-test SpEL expressions.",
          fix: "Delegate to a bean.",
        },
        {
          mistake: "Using `@PostAuthorize` on a method that changes data.",
          fix: "The change has happened already. Check before.",
        },
        {
          mistake: "Calling a secured method from the same class.",
          fix: "The proxy is bypassed.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An approval workflow",
      scenario: "Managers may approve orders in their own department only.",
      body: [
        '`@PreAuthorize("@approvalPolicy.canApprove(authentication, #orderId)")` on the service method calls a bean that compares the department. The rule works for the REST controller, for a scheduled job and for a message listener that call the same service.',
        "The URL rule only requires the role MANAGER.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ms-enable",
      prompt: "Which annotation turns on method security?",
      options: ["@EnableMethodSecurity", "@EnableWebSecurity", "@Secured"],
      answer: 0,
      explanation: "`@EnableGlobalMethodSecurity` is the older form.",
    },
    {
      type: "single",
      id: "ms-post",
      prompt: "When does @PostAuthorize run?",
      options: [
        "After the method, with returnObject available",
        "Before the method",
        "Only at start-up",
      ],
      answer: 0,
      explanation: "It cannot undo a change that the method made.",
    },
    {
      type: "truefalse",
      id: "ms-self",
      statement:
        "Method security works for a call from another method of the same class.",
      answer: false,
      explanation: "It is proxy-based, so self-invocation bypasses it.",
    },
    {
      type: "single",
      id: "ms-levels",
      prompt: "How should URL and method security be combined?",
      options: [
        "URL for structure, methods for business rules",
        "Only URL rules",
        "Only method rules",
      ],
      answer: 0,
      explanation: "Both together give defence in depth.",
    },
  ],
  assignment: {
    title: "Method rules",
    task: [
      "Enable method security, protect two service methods with `@PreAuthorize`, one by role and one by owner.",
      "Move a complex rule into a bean, and write a test for the bean.",
    ],
    checklist: [
      "A non-owner gets 403",
      "The complex rule is in a testable bean",
      "The URL rule still requires a login",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "ms-ex",
      title: "Owner or admin",
      task: [
        "Write the annotation for `void deleteDocument(long ownerId, long documentId)` so that only an admin or the owner (compare `#ownerId` with `authentication.principal.id`) can call it.",
      ],
      language: "java",
      starter:
        "// your code\nvoid deleteDocument(long ownerId, long documentId) {\n}",
      solution:
        "@PreAuthorize(\"hasRole('ADMIN') or #ownerId == authentication.principal.id\")\nvoid deleteDocument(long ownerId, long documentId) {\n}",
      hints: ["Use `#parameterName` for arguments."],
      checklist: [
        "Admins are allowed",
        "The owner is allowed",
        "The expression uses the parameter name",
      ],
    },
  ],
  revisionNotes: [
    "`@EnableMethodSecurity` + `@PreAuthorize` with SpEL; proxy-based like @Transactional",
    "`@PostAuthorize`/`@PostFilter` run after the method: not for side effects or big data",
    "Delegate complex rules to a bean",
    "URL rules for structure, method rules for business decisions",
  ],
  resources: [
    {
      label: "Spring Security Reference: Method Security",
      url: "https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html",
    },
    {
      label: "Spring Security Reference: Authorization Architecture",
      url: "https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html",
    },
  ],
})
