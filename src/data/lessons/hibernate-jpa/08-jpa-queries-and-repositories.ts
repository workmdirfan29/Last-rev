import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "jpa-queries-and-repositories",
  title: "Queries: JPQL, Spring Data repositories, paging and bulk operations",
  topic: "JPA queries",
  minutes: 70,
  overview:
    "Write JPQL and derived queries, use @Query, paging and Specifications, and perform batch and bulk operations efficiently.",
  objectives: [
    "Write JPQL with named parameters and derived query methods",
    "Use paging, @Modifying and Specifications",
    "Insert and update many rows efficiently",
  ],
  prerequisites: ["lesson.hibernate-jpa.entity-lifecycle"],
  sections: [
    {
      kind: "explain",
      heading: "JPQL and derived queries",
      body: [
        "**JPQL**, the Jakarta Persistence Query Language, looks like SQL but uses **entity and field names** instead of table and column names, and is translated to the SQL of the database. Always use **named parameters** such as `:min`, set with `setParameter`, and never join values into the string. A `TypedQuery<Product>` returns the right Java type. Native SQL is available when you need database-specific features.",
        "With Spring Data JPA, an interface that extends `JpaRepository<Entity, IdType>` gets ready methods such as `save`, `findById`, `findAll`, `deleteById` and `count`, and an implementation that Spring generates at run time. For custom queries you declare methods whose **names follow a convention**, such as `findByEmail`, `findByStatusAndCreatedAtAfter` or `existsByEmail`, and Spring Data derives the query from the name. A name that does not match a property fails at **start-up**. For long names or complex queries use `@Query`.",
      ],
    },
    {
      kind: "code",
      heading: "Repository methods",
      example: {
        title: "Derived and explicit queries",
        language: "java",
        code: 'public interface UserRepository extends JpaRepository<User, Long> {\n\n  Optional<User> findByEmail(String email);\n\n  boolean existsByEmail(String email);\n\n  Page<User> findByStatus(Status status, Pageable pageable);\n\n  @Query("select u from User u where u.createdAt > :since order by u.createdAt desc")\n  List<User> recent(@Param("since") Instant since);\n\n  @Modifying(clearAutomatically = true)\n  @Query("update User u set u.status = :to where u.status = :from and u.lastSeen < :before")\n  int deactivate(@Param("from") Status from, @Param("to") Status to, @Param("before") Instant before);\n}',
        walkthrough: [
          "No class implements the interface: Spring Data generates it from the method names.",
          "`@Query` gives an explicit JPQL query with named parameters.",
          "`@Modifying` marks a bulk change. It runs straight in the database and bypasses the persistence context, so `clearAutomatically = true` clears stale entities. It does not increase `@Version`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Paging and dynamic queries",
      body: [
        'A repository method can take a **`Pageable`** and return a `Page<T>`, a `Slice<T>` or a `List<T>`. Create the request with `PageRequest.of(pageIndex, size, Sort.by("createdAt").descending())`, and page indexes start at **0**. A `Page` also runs a second **`COUNT`** query for the total. A `Slice` skips the count and only knows whether there is a next page, which is cheaper. **Always limit the page size**, and sort on an indexed column with a unique tie-breaker such as the id. Offset paging becomes slow for large offsets, and keyset paging scales better.',
        "When the conditions depend on what the user filled in, use the **Criteria API** or Spring Data **`Specification`s**: each condition is a small reusable object, and you combine them with `and` and `or`. A repository that extends `JpaSpecificationExecutor` can run `findAll(spec, pageable)`. For fixed queries, a method or `@Query` is simpler.",
      ],
    },
    {
      kind: "code",
      heading: "Composing filters",
      example: {
        title: "Specification",
        language: "java",
        code: 'class ProductSpecs {\n  static Specification<Product> nameContains(String text) {\n    return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + text.toLowerCase() + "%");\n  }\n\n  static Specification<Product> priceAtMost(BigDecimal max) {\n    return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), max);\n  }\n}\n\nSpecification<Product> spec = Specification.where(null);\nif (name != null) spec = spec.and(ProductSpecs.nameContains(name));\nif (max != null) spec = spec.and(ProductSpecs.priceAtMost(max));\nPage<Product> page = repository.findAll(spec, PageRequest.of(0, 20, Sort.by("id")));',
        walkthrough: [
          "Each condition is a small `Specification`.",
          "Conditions are added only when the filter value is present.",
          "The repository runs the combined query with paging.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Many rows",
      body: [
        "Saving many entities one by one fills the persistence context and sends many statements. Turn on JDBC batching with `hibernate.jdbc.batch_size`, for example `50`, and use an id strategy that allows it, such as `SEQUENCE`, because `IDENTITY` disables batched inserts. In a loop, call **`flush()` and then `clear()`** on the `EntityManager` every batch, so the context does not grow without limit. For changes that need no entities, a **bulk `UPDATE` or `DELETE`** query is much faster, and for huge loads, plain JDBC batching or the database's bulk loader can be better. Test with the SQL log, to confirm that statements are really batched.",
      ],
    },
    {
      kind: "code",
      heading: "Batching with flush and clear",
      example: {
        title: "Memory stays constant",
        language: "java",
        code: "// application.properties\n// spring.jpa.properties.hibernate.jdbc.batch_size=50\n// spring.jpa.properties.hibernate.order_inserts=true\n\n@Transactional\nvoid importAll(List<Product> products) {\n  int count = 0;\n  for (Product p : products) {\n    em.persist(p);\n    if (++count % 50 == 0) {\n      em.flush();\n      em.clear();\n    }\n  }\n}",
        walkthrough: [
          "Batching is enabled by the property.",
          "Every 50 entities, the changes are sent and the context is cleared.",
          "Memory stays constant, however long the list is.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Concatenating values into a JPQL string.",
          fix: "Use named parameters.",
        },
        {
          mistake: "Allowing a client to ask for a huge page size.",
          fix: "Cap it.",
        },
        {
          mistake:
            "Using managed entities after a bulk update without clearing.",
          fix: "Use clearAutomatically or reload.",
        },
        {
          mistake: "Using IDENTITY ids and expecting batching.",
          fix: "Use a sequence.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A search page",
      scenario:
        "A product search has five optional filters, paging and a sort order.",
      body: [
        "Each filter is a `Specification`, combined at run time, with `Pageable` limited to 100. The list is a projection, and an import job uses batching with flush and clear.",
        "Each tool matches one need.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "jq-names",
      prompt: "What does JPQL use instead of table names?",
      options: ["Entity names", "Index names", "File names"],
      answer: 0,
      explanation: "Fields replace columns.",
    },
    {
      type: "single",
      id: "jq-param",
      prompt: "How should values be added to a JPQL query?",
      options: ["Named parameters", "String concatenation", "Escaping quotes"],
      answer: 0,
      explanation: "Parameters prevent injection.",
    },
    {
      type: "truefalse",
      id: "jq-ident",
      statement: "IDENTITY ids allow batched inserts.",
      answer: false,
      explanation: "A sequence is needed for batching.",
    },
    {
      type: "single",
      id: "jq-slice",
      prompt: "What does Slice skip compared with Page?",
      options: ["The count query", "The sorting", "The paging"],
      answer: 0,
      explanation: "A Slice knows only whether there is a next page.",
    },
  ],
  assignment: {
    title: "A searchable repository",
    task: [
      "Write a repository with a derived query, a `@Query`, a paged method and a Specification search with three filters.",
      "Write an import that inserts 10,000 rows with batching, flush and clear, and measure it.",
    ],
    checklist: [
      "Parameters are used everywhere",
      "Page size is limited",
      "The import uses constant memory",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "jq-ex",
      title: "Write two repository methods",
      task: [
        "Add to `ProductRepository`: a derived query for products with a price below a limit ordered by price, and a paged method for a category.",
      ],
      language: "java",
      starter:
        "interface ProductRepository extends JpaRepository<Product, Long> {\n  // your code\n}",
      solution:
        "interface ProductRepository extends JpaRepository<Product, Long> {\n\n  List<Product> findByPriceLessThanOrderByPriceAsc(BigDecimal limit);\n\n  Page<Product> findByCategory(String category, Pageable pageable);\n}",
      hints: [
        "Follow the naming convention: `findBy<Property><Keyword>OrderBy<Property>`.",
      ],
      checklist: [
        "The derived name matches the property",
        "The paged method takes a Pageable",
        "No implementation is written",
      ],
    },
  ],
  revisionNotes: [
    "JPQL: entities and fields, named parameters; derived queries from method names",
    "@Query, @Modifying(clearAutomatically); Pageable → Page (count) or Slice",
    "Specification for dynamic filters; cap page sizes",
    "Batch: batch_size + SEQUENCE + flush/clear; bulk UPDATE/DELETE for no-entity changes",
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
      label: "Spring Data JPA Reference: Specifications",
      url: "https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html",
    },
  ],
})
