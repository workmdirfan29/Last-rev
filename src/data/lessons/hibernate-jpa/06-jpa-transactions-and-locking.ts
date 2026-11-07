import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "jpa-transactions-and-locking",
  title: "Transactions and locking with JPA and Spring",
  topic: "Transactions",
  minutes: 60,
  overview:
    "Place transaction boundaries, use readOnly, and prevent lost updates with @Version and pessimistic locks.",
  objectives: [
    "Put @Transactional on the right layer and know the rollback rules",
    "Use readOnly transactions",
    "Use @Version and pessimistic locking",
  ],
  prerequisites: ["lesson.hibernate-jpa.jpa-caching"],
  sections: [
    {
      kind: "explain",
      heading: "Transaction boundaries",
      body: [
        "With Spring, put `@Transactional` on **service methods**, so a transaction starts when the method begins, and commits, or rolls back on a runtime exception, when it ends. The `EntityManager` and the persistence context are bound to that transaction. Changes to managed entities are written at commit, or earlier at a flush. A transaction should cover **one business operation**, so the boundary is the public service method that implements the use case, and not the controller or the individual repository calls. Spring Data repository methods are already transactional by default.",
        "`readOnly = true` tells Spring and Hibernate that the transaction does not change data, and lets them skip dirty checking and some work, which suits queries. Keep transactions short, and **never call a remote service inside one**: the transaction can still roll back, and it holds a connection. A `RuntimeException` rolls back, a checked exception does not unless configured, and catching the exception inside the method hides it from the proxy.",
      ],
    },
    {
      kind: "code",
      heading: "Service transactions",
      example: {
        title: "Read and write",
        language: "java",
        code: "@Service\nclass OrderService {\n  private final ProductRepository products;\n  private final OrderRepository orders;\n\n  OrderService(ProductRepository products, OrderRepository orders) {\n    this.products = products;\n    this.orders = orders;\n  }\n\n  @Transactional\n  public Long place(PlaceOrder request) {\n    Product product = products.findById(request.productId()).orElseThrow();\n    product.reduceStock(request.quantity());       // changed, saved at commit\n    return orders.save(new Order(product, request.quantity())).getId();\n  }\n\n  @Transactional(readOnly = true)\n  public OrderDto find(Long id) {\n    return mapper.toDto(orders.findById(id).orElseThrow());\n  }\n}",
        walkthrough: [
          "The stock change and the new order are committed together or not at all.",
          "The product is managed, so the change is saved without an explicit `save`.",
          "The read method is marked `readOnly`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Locking",
      body: [
        "**Optimistic locking** uses a **`@Version`** field, a number or a timestamp. Hibernate adds it to the `UPDATE` condition and increments it. If another transaction changed the row meanwhile, no row matches, and the provider throws an **`OptimisticLockException`**, so the user can reload and retry. It needs no database locks and suits rare conflicts. Never set the version field yourself, and handle the exception, for example by returning `409 Conflict`.",
        "**Pessimistic locking** locks the rows in the database, for example with `LockModeType.PESSIMISTIC_WRITE`, which issues `SELECT ... FOR UPDATE`, so others wait. It suits frequent conflicts, but holds locks and can cause deadlocks, so keep the transactions short and set a lock timeout. In Spring Data, `@Lock` on a repository method sets the mode.",
      ],
    },
    {
      kind: "code",
      heading: "Version and a locked query",
      example: {
        title: "@Version and @Lock",
        language: "java",
        code: '@Entity\nclass Product {\n  @Id @GeneratedValue Long id;\n  @Version Long version;\n  int stock;\n}\n\ninterface SeatRepository extends JpaRepository<Seat, Long> {\n  @Lock(LockModeType.PESSIMISTIC_WRITE)\n  @Query("select s from Seat s where s.id = :id")\n  Optional<Seat> lockById(@Param("id") Long id);\n}',
        walkthrough: [
          "`@Version` turns on optimistic locking for `Product`.",
          "The locked query makes the database lock the row until the transaction ends.",
          "Choose by conflict frequency: rare conflicts use a version, frequent conflicts may need a lock.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting @Transactional on controllers.",
          fix: "Use the service layer.",
        },
        {
          mistake: "Catching the exception inside the method.",
          fix: "Let it reach the proxy, so the transaction rolls back.",
        },
        {
          mistake: "Calling a remote service inside a transaction.",
          fix: "Call it before or after, or use an outbox.",
        },
        {
          mistake: "Ignoring OptimisticLockException.",
          fix: "Return 409 or retry.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Two agents edit a ticket",
      scenario:
        "Two support agents open the same ticket and both save changes.",
      body: [
        "A `@Version` field makes the second save fail with `OptimisticLockException`, and the API returns `409` with a message to reload. Nobody's change is silently lost.",
        "No database lock was held while the agents were thinking.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tx-where",
      prompt: "Where should @Transactional normally be placed?",
      options: ["On service methods", "On controllers", "On entities"],
      answer: 0,
      explanation: "The boundary is one business operation.",
    },
    {
      type: "single",
      id: "tx-ro",
      prompt: "What does readOnly = true do?",
      options: [
        "Hints that no data changes, so work can be skipped",
        "Makes the database read-only",
        "Disables the transaction",
      ],
      answer: 0,
      explanation: "It suits queries.",
    },
    {
      type: "truefalse",
      id: "tx-checked",
      statement:
        "A checked exception rolls back a @Transactional method by default.",
      answer: false,
      explanation:
        "Only RuntimeException and Error do. Add rollbackFor for checked exceptions.",
    },
    {
      type: "single",
      id: "tx-version",
      prompt: "What does @Version provide?",
      options: ["Optimistic locking", "Pessimistic locking", "Caching"],
      answer: 0,
      explanation: "A stale update fails with OptimisticLockException.",
    },
  ],
  assignment: {
    title: "Transactions and conflicts",
    task: [
      "Write a service method that changes two entities in one transaction, and show that a failure rolls back both.",
      "Add `@Version` to an entity, update it from two sessions, and handle the exception with a 409.",
    ],
    checklist: [
      "The failure rolls back both changes",
      "The second update is rejected",
      "readOnly is used for reads",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "tx-ex",
      title: "Add optimistic locking",
      task: [
        "Add a version field to `Ticket` so that concurrent updates are detected, and a handler method that maps `OptimisticLockingFailureException` to `409 Conflict`.",
      ],
      language: "java",
      starter:
        "@Entity\nclass Ticket {\n  @Id @GeneratedValue Long id;\n  String status;\n}",
      solution:
        '@Entity\nclass Ticket {\n  @Id @GeneratedValue Long id;\n  @Version Long version;\n  String status;\n}\n\n@RestControllerAdvice\nclass ConflictHandler {\n  @ExceptionHandler(OptimisticLockingFailureException.class)\n  ResponseEntity<String> conflict(OptimisticLockingFailureException ex) {\n    return ResponseEntity.status(HttpStatus.CONFLICT).body("The ticket was changed by someone else");\n  }\n}',
      hints: [
        "Spring translates the JPA exception into `OptimisticLockingFailureException`.",
      ],
      checklist: [
        "A @Version field is added",
        "The handler returns 409",
        "The user is told to reload",
      ],
    },
  ],
  revisionNotes: [
    "@Transactional on services; runtime exception → rollback; keep transactions short; readOnly for reads",
    "@Version: optimistic locking, handle the exception (409)",
    "PESSIMISTIC_WRITE: SELECT FOR UPDATE; short transactions",
    "No remote calls inside a transaction",
  ],
  resources: [
    {
      label: "Spring Data JPA Reference: Transactionality",
      url: "https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html",
    },
    {
      label: "Spring Data JPA Reference: Locking",
      url: "https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html",
    },
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
  ],
})
