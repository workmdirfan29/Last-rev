import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "n-plus-one-problem",
  title: "The N+1 select problem and how to fix it",
  topic: "N+1 problem",
  minutes: 60,
  overview:
    "Recognise the N+1 problem, detect it from the SQL, and fix it with join fetch, entity graphs, batch fetching and DTO queries.",
  objectives: [
    "Explain what N+1 is and why it is hidden",
    "Detect it in logs and tests",
    "Fix it and know the limits of each fix",
  ],
  prerequisites: ["lesson.hibernate-jpa.fetching-lazy-eager-and-dtos"],
  sections: [
    {
      kind: "explain",
      heading: "What N+1 is",
      body: [
        "The **N+1 problem** happens when you load a list of N entities with **one** query, and then access a lazy association on each of them, which runs **one extra query per entity**: N+1 queries in total. With 100 orders and their customers, that is 101 queries instead of one or two. It is invisible in the code, because the extra queries happen on access, and it is slow when the data grows. A typical example is a list page that prints each order's customer name.",
        "You **detect** it by logging the SQL (`spring.jpa.show-sql=true` in development, or a proper SQL logger), by watching the query count in tests, and by Hibernate statistics. A query-count assertion in an integration test prevents regressions.",
      ],
    },
    {
      kind: "code",
      heading: "The problem",
      example: {
        title: "One query becomes many",
        language: "java",
        code: "List<Order> orders = orderRepository.findAll();           // 1 query\nfor (Order o : orders) {\n  System.out.println(o.getCustomer().getName());          // 1 query per order (lazy)\n}",
        walkthrough: [
          "`findAll` loads the orders with one query.",
          "Each `getCustomer().getName()` loads a customer lazily with its own query.",
          "With 100 orders, 101 queries run.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The fixes",
      body: [
        "**`JOIN FETCH`** in a query loads the association in the same SQL statement with a join. **`@EntityGraph`**, which Spring Data lets you put on a repository method, declares which attributes to load without writing the query. Both solve the problem for that use case. **Batch fetching**, with `@BatchSize` or the Hibernate batch-size setting, loads the lazy associations of several entities with one query, which is a good fallback. A **DTO query** that selects the needed columns avoids the problem altogether.",
        "The limits: fetching a **collection** with a join multiplies the rows, and applying **pagination** to it can force the provider to load everything into memory. Fetching **two `List` collections** at once can throw `MultipleBagFetchException`. For paginated lists, fetch the page of ids first and load the associations in a second step, or use a DTO query. Always check the generated SQL after the change. Fixing it with `EAGER` often makes it worse elsewhere.",
      ],
    },
    {
      kind: "code",
      heading: "Fixes in a repository",
      example: {
        title: "Entity graph and join fetch",
        language: "java",
        code: 'interface OrderRepository extends JpaRepository<Order, Long> {\n\n  @EntityGraph(attributePaths = {"customer"})\n  List<Order> findByStatus(OrderStatus status);\n\n  @Query("select distinct o from Order o join fetch o.lines where o.status = :status")\n  List<Order> findWithLines(@Param("status") OrderStatus status);\n\n  @Query("select new com.shop.OrderRow(o.id, c.name, o.total) from Order o join o.customer c")\n  List<OrderRow> rows();\n}',
        walkthrough: [
          "The entity graph adds the customer to the same query.",
          "`join fetch` loads the lines, and `distinct` removes duplicate orders caused by the join. Do not paginate this query.",
          "The third query selects only the columns needed and cannot cause N+1.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Not looking at the generated SQL.",
          fix: "Log it in development and count queries in tests.",
        },
        {
          mistake: "Fixing it with eager fetching.",
          fix: "Fetch for the use case instead.",
        },
        {
          mistake: "Paginating a query that join-fetches a collection.",
          fix: "Page the ids first, or use a DTO query.",
        },
        {
          mistake: "Fetching two bag collections in one query.",
          fix: "Fetch one, and batch the other.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A slow orders page",
      scenario:
        "A page of 50 orders takes two seconds, and the database CPU is high.",
      body: [
        "The SQL log shows 51 queries for one page. An entity graph that loads the customer reduces it to one, and a record projection for the list reduces the amount of data as well. A test asserts the number of queries.",
        "The fix is verified with numbers, not guessed.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "n1-def",
      prompt: "What is the N+1 problem?",
      options: [
        "One query for a list, plus one per element for a lazy association",
        "N queries plus one index",
        "A slow join",
      ],
      answer: 0,
      explanation: "It hides in the code and shows up in the SQL log.",
    },
    {
      type: "single",
      id: "n1-fix",
      prompt: "Which is a fix for N+1?",
      options: [
        "JOIN FETCH or @EntityGraph",
        "Adding more RAM",
        "Making the entity final",
      ],
      answer: 0,
      explanation: "Load the association together with the list.",
    },
    {
      type: "truefalse",
      id: "n1-eager",
      statement: "Switching to EAGER reliably removes N+1 problems.",
      answer: false,
      explanation: "It often makes things worse in other queries.",
    },
    {
      type: "single",
      id: "n1-page",
      prompt:
        "What is the trap of paginating a query that join-fetches a collection?",
      options: [
        "The provider may load everything into memory",
        "Pages are empty",
        "The query is invalid",
      ],
      answer: 0,
      explanation:
        "The join multiplies rows, so the database page does not match entity pages.",
    },
  ],
  assignment: {
    title: "Find and fix N+1",
    task: [
      "Create a page that lists orders with the customer name, log the SQL, and count the queries.",
      "Fix it with an entity graph, then with a DTO projection, and compare the query count and the time.",
    ],
    checklist: [
      "I counted queries before and after",
      "The fixed page runs one or two queries",
      "A test asserts the query count",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "n1-ex",
      title: "Add an entity graph",
      task: [
        "Add a repository method `findByCategory(String category)` that loads the supplier of each product in the same query, with an entity graph.",
      ],
      language: "java",
      starter:
        "interface ProductRepository extends JpaRepository<Product, Long> {\n  // your code\n}",
      solution:
        'interface ProductRepository extends JpaRepository<Product, Long> {\n\n  @EntityGraph(attributePaths = {"supplier"})\n  List<Product> findByCategory(String category);\n}',
      hints: ["Name the attribute path of the association."],
      checklist: [
        "The supplier is loaded with the products",
        "The method is a derived query",
        "No eager mapping is needed",
      ],
    },
  ],
  revisionNotes: [
    "N+1 = 1 query for the list + 1 per row for a lazy association",
    "Detect with SQL logs and query counts in tests",
    "Fix: join fetch, @EntityGraph, batch size, DTO queries",
    "Collections + pagination and two bags are traps",
  ],
  resources: [
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
    {
      label: "Spring Data JPA Reference: Query Methods",
      url: "https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html",
    },
    {
      label: "Hibernate ORM Documentation",
      url: "https://hibernate.org/orm/documentation/",
    },
  ],
})
