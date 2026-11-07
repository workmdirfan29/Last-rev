import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "fetching-lazy-eager-and-dtos",
  title: "Fetching: lazy, eager and projections",
  topic: "Fetching",
  minutes: 70,
  overview:
    "Control when related data is loaded, fix LazyInitializationException properly, and read only what you need with projections.",
  objectives: [
    "Explain lazy and eager fetching and the defaults",
    "Fix LazyInitializationException without switching everything to eager",
    "Use DTO projections for read-only views",
  ],
  prerequisites: ["lesson.hibernate-jpa.relationships-and-cascade"],
  sections: [
    {
      kind: "explain",
      heading: "Lazy and eager",
      body: [
        "With **lazy** fetching, a related entity or collection is loaded from the database only when you first access it, and the provider puts a **proxy** or a lazy collection in its place. With **eager** fetching, it is loaded at once with the owner. The defaults: `@OneToMany` and `@ManyToMany` are **lazy**, while `@ManyToOne` and `@OneToOne` are **eager**. Eager loading of many relations can create huge joins and many queries, so the usual advice is to make associations lazy and to load what you need for each use case with a query.",
        "Accessing a lazy association after the persistence context is closed throws **`LazyInitializationException`**. Setting everything to `EAGER` hides this problem and creates others. Eager cannot be turned off for a single query, but lazy can be turned into a fetch when needed.",
      ],
    },
    {
      kind: "code",
      heading: "Fix it inside the transaction",
      example: {
        title: "join fetch and a DTO",
        language: "java",
        code: 'interface OrderRepository extends JpaRepository<Order, Long> {\n\n  @Query("select o from Order o join fetch o.lines where o.id = :id")\n  Optional<Order> findWithLines(@Param("id") Long id);\n}\n\n@Service\nclass OrderService {\n  private final OrderRepository repository;\n  private final OrderMapper mapper;\n\n  OrderService(OrderRepository repository, OrderMapper mapper) {\n    this.repository = repository;\n    this.mapper = mapper;\n  }\n\n  @Transactional(readOnly = true)\n  OrderDto get(Long id) {\n    Order order = repository.findWithLines(id).orElseThrow();\n    return mapper.toDto(order);   // lines are loaded, session still open\n  }\n}',
        walkthrough: [
          "`join fetch` loads the lines in the same query.",
          "The mapping to a DTO happens **inside the transaction**, while the session is open.",
          "The controller receives plain data and never touches a lazy proxy.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Open session in view and projections",
      body: [
        "Spring Boot enables **open in view** by default, which keeps the persistence context open during the whole web request, so lazy loading works in the controller or while serialising. Many teams switch it off with `spring.jpa.open-in-view=false`, because it hides queries outside the service layer and holds a database connection longer. Return **DTOs from the service layer** instead.",
        "A **projection** reads only some columns. In Spring Data JPA, a repository method can return an interface with getters, or a record built from the selected columns, and the query selects only those columns. This is faster, uses less memory, avoids loading associations by accident, and the result is **not a managed entity**, so nothing is tracked. Use projections for read-only views such as lists and reports, and entities when you are going to change the data.",
      ],
    },
    {
      kind: "code",
      heading: "A record projection",
      example: {
        title: "select new",
        language: "java",
        code: 'record OrderSummary(Long id, String status, BigDecimal total) { }\n\ninterface OrderRepository extends JpaRepository<Order, Long> {\n\n  @Query("select new com.shop.OrderSummary(o.id, o.status, o.total) from Order o where o.customer.id = :cid")\n  List<OrderSummary> summaries(@Param("cid") Long customerId);\n}',
        walkthrough: [
          "The query selects three columns only.",
          "The result is a list of records, not managed entities, so no association is loaded and no N+1 can happen.",
          "Changing a projection saves nothing, because it is not tracked.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Changing every association to EAGER to remove the exception.",
          fix: "Load what is needed inside the transaction.",
        },
        {
          mistake:
            "Returning entities from controllers and serialising lazy fields.",
          fix: "Return DTOs.",
        },
        {
          mistake: "Loading full entities to show two fields.",
          fix: "Use a projection.",
        },
        {
          mistake:
            "Trying to modify a projection and expecting it to be saved.",
          fix: "Load the entity for changes.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A list page and a detail page",
      scenario:
        "The list needs id, status and total of 50 orders. The detail needs one order with its lines.",
      body: [
        "The list uses a record projection with paging, and no lines are loaded. The detail uses `join fetch` for the lines of one order inside a read-only transaction, and returns a DTO.",
        "Each screen loads exactly what it needs.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ft-defaults",
      prompt: "What are the default fetch types?",
      options: [
        "To-many lazy, to-one eager",
        "Everything lazy",
        "Everything eager",
      ],
      answer: 0,
      explanation: "Make associations lazy and fetch explicitly.",
    },
    {
      type: "single",
      id: "ft-lie",
      prompt: "What causes LazyInitializationException?",
      options: [
        "Accessing a lazy association after the session is closed",
        "A missing index",
        "A wrong id",
      ],
      answer: 0,
      explanation: "There is no open persistence context to load it.",
    },
    {
      type: "truefalse",
      id: "ft-eager",
      statement:
        "Making every association EAGER is the proper fix for LazyInitializationException.",
      answer: false,
      explanation: "Load what is needed in the transaction, or use DTOs.",
    },
    {
      type: "single",
      id: "ft-proj",
      prompt: "What is true of a projection result?",
      options: [
        "It is not a managed entity",
        "It is tracked for changes",
        "It loads all associations",
      ],
      answer: 0,
      explanation: "Nothing is saved when you change it.",
    },
  ],
  assignment: {
    title: "Load only what you need",
    task: [
      "Reproduce a `LazyInitializationException` and fix it with `join fetch`, then with a projection.",
      "Turn off open-in-view and make sure that no controller touches a lazy field.",
    ],
    checklist: [
      "The fix is inside the transaction",
      "open-in-view is off",
      "The list page uses a projection",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "ft-ex",
      title: "Write a projection query",
      task: [
        "Write a record `ProductRow(Long id, String name)` and a repository method that returns only those two columns for products in a given category.",
      ],
      language: "java",
      starter: "// your code",
      solution:
        'record ProductRow(Long id, String name) { }\n\ninterface ProductRepository extends JpaRepository<Product, Long> {\n\n  @Query("select new com.shop.ProductRow(p.id, p.name) from Product p where p.category = :category")\n  List<ProductRow> rows(@Param("category") String category);\n}',
      hints: ["Use `select new` with the full class name."],
      checklist: [
        "Only two columns are selected",
        "The result is a record",
        "The category is a parameter",
      ],
    },
  ],
  revisionNotes: [
    "To-many lazy, to-one eager by default; prefer lazy and fetch per use case",
    "LazyInitializationException: load inside the transaction (join fetch, entity graph, DTO)",
    "open-in-view: off, return DTOs from services",
    "Projections: only the columns you need; not managed",
  ],
  resources: [
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
    {
      label: "Spring Data JPA Reference: Projections",
      url: "https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html",
    },
  ],
})
