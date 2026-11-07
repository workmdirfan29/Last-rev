import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "jpa-entities",
  title: "JPA, Hibernate and entities",
  topic: "Entities",
  minutes: 80,
  overview:
    "Understand JPA, Hibernate and Spring Data JPA, map entities, ids and common types, and manage the schema safely.",
  objectives: [
    "Explain JPA, Hibernate and Spring Data JPA",
    "Map an entity with ids, enums, dates and embeddables",
    "Implement equals and hashCode and manage schema changes with migrations",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "JPA, Hibernate and Spring Data JPA",
      body: [
        "**JPA**, the Jakarta Persistence API, is a **specification**: it defines the annotations, the `EntityManager` API and the query language for mapping Java objects to relational tables, but has no code of its own. **Hibernate** is the most widely used **implementation**, a provider that does the actual work and adds features beyond the specification. **Spring Data JPA** is a layer on top that generates repository implementations from interfaces, so simple queries need no code. In a Spring Boot application you normally use all three: JPA annotations, Hibernate underneath, and Spring Data repositories. Since Jakarta EE 9 the package names are `jakarta.persistence`, and not `javax.persistence`.",
        "An **entity** is a class annotated with `@Entity` that is mapped to a table. It must have a primary key field marked `@Id`, a **no-argument constructor** that is public or protected, and it must not be `final`, because the provider may create subclasses or proxies of it. Records are not suitable as entities. By default the table is named after the class and the columns after the fields, and `@Table` and `@Column` change that.",
      ],
    },
    {
      kind: "code",
      heading: "A minimal entity",
      example: {
        title: "@Entity, @Id and @Column",
        language: "java",
        code: '@Entity\n@Table(name = "products")\npublic class Product {\n\n  @Id\n  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")\n  @SequenceGenerator(name = "product_seq", sequenceName = "product_seq", allocationSize = 50)\n  private Long id;\n\n  @Column(nullable = false, length = 100)\n  private String name;\n\n  @Column(nullable = false, precision = 10, scale = 2)\n  private BigDecimal price;\n\n  @Enumerated(EnumType.STRING)\n  private ProductStatus status = ProductStatus.ACTIVE;\n\n  @Embedded\n  private Dimensions dimensions;\n\n  protected Product() { }              // required by JPA\n\n  public Product(String name, BigDecimal price) {\n    this.name = name;\n    this.price = price;\n  }\n}\n\n@Embeddable\nclass Dimensions {\n  private int widthCm;\n  private int heightCm;\n}',
        walkthrough: [
          "`@Entity` and `@Id` are the minimum. `@Column` documents constraints such as length and `nullable`.",
          "`GenerationType.SEQUENCE` lets the provider get ids before the insert, which allows **batching**. `IDENTITY` uses an auto-increment column, so the row must be inserted at once and inserts cannot be batched.",
          "`EnumType.STRING` stores the **name**, so reordering the enum does not corrupt data. The default `ORDINAL` stores the position. `@Embeddable` gives a value object whose fields become columns of the owner's table.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "equals and hashCode for entities",
      body: [
        "An entity's generated id is `null` until it is saved, so an `equals` and `hashCode` based on the id **changes when the entity is persisted**, which breaks hash-based collections that already hold it. Safe options: use a **business key** that never changes and is unique, such as an email or an ISBN, or use the id in `equals` only when it is not `null` with a constant `hashCode`. Compare with `instanceof`, because Hibernate may give you a **proxy** subclass. Never include lazy collections, which would trigger loading, and avoid Lombok's generated `equals` over all fields.",
        'A **primitive** id type cannot represent "not saved yet", so use a wrapper such as `Long`.',
      ],
    },
    {
      kind: "code",
      heading: "Equality by a business key",
      example: {
        title: "equals and hashCode",
        language: "java",
        code: "@Override\npublic boolean equals(Object o) {\n  if (this == o) return true;\n  if (!(o instanceof User other)) return false;\n  return email != null && email.equals(other.getEmail());\n}\n\n@Override\npublic int hashCode() {\n  return Objects.hash(email);\n}",
        walkthrough: [
          "`instanceof` works with proxy subclasses.",
          "Only the stable business key takes part, so the hash code does not change when the entity is saved.",
          "The key must be unique and never change.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The schema",
      body: [
        "`spring.jpa.hibernate.ddl-auto` tells Hibernate what to do with the schema at start-up: `none`, `validate` (check that the schema matches and fail if not), `update` (try to add missing tables and columns), `create` and `create-drop`. `create`, `create-drop` and `update` are for experiments and tests. In **production**, use `validate` or `none`, and manage the schema with a **migration tool** such as Flyway or Liquibase, which applies versioned, reviewed scripts in order and records what has run. `update` cannot drop or rename, and can behave unpredictably, so it is not a migration tool. Never edit a migration that has already been applied.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Making the entity `final` or using a record.",
          fix: "Use a normal non-final class with a no-argument constructor.",
        },
        {
          mistake: "Leaving the default `ORDINAL` for enums.",
          fix: "Use `EnumType.STRING`.",
        },
        {
          mistake:
            "Using the generated id in `hashCode` for an unsaved entity in a HashSet.",
          fix: "Use a business key.",
        },
        {
          mistake: "Running `ddl-auto=update` in production.",
          fix: "Use `validate` and a migration tool.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A catalogue",
      scenario: "A shop stores products with a status, a size and a price.",
      body: [
        "The entity uses a sequence id, `BigDecimal` for the price, an `EnumType.STRING` status and an embedded `Dimensions`. A Flyway script creates the table, and `ddl-auto=validate` makes the application fail at start-up if the mapping and the table disagree.",
        "The schema is under version control.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "en-spec",
      prompt: "What is JPA?",
      options: [
        "A specification for object-relational mapping",
        "A database",
        "A web framework",
      ],
      answer: 0,
      explanation: "Hibernate is an implementation.",
    },
    {
      type: "single",
      id: "en-enum",
      prompt: "Which enum mapping is safe against reordering the constants?",
      options: ["EnumType.STRING", "EnumType.ORDINAL", "No annotation"],
      answer: 0,
      explanation: "The default ORDINAL stores the position.",
    },
    {
      type: "truefalse",
      id: "en-ddl",
      statement: "ddl-auto=update is a good way to manage a production schema.",
      answer: false,
      explanation: "Use `validate` or `none`, and Flyway or Liquibase.",
    },
    {
      type: "single",
      id: "en-batch",
      prompt: "Which id strategy allows batched inserts?",
      options: ["SEQUENCE", "IDENTITY", "None"],
      answer: 0,
      explanation:
        "IDENTITY needs the row to be inserted at once to get the id.",
    },
  ],
  assignment: {
    title: "Map a small model",
    task: [
      "Map a `Product` entity with a sequence id, an enum, an embedded value and a decimal price.",
      "Create the table with a migration script, set `ddl-auto=validate`, and break the mapping on purpose to see the failure.",
    ],
    checklist: [
      "The enum is stored as a string",
      "equals and hashCode use a business key",
      "validate fails when the mapping is wrong",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "en-ex",
      title: "Fix the entity",
      task: [
        "This entity has three problems. Fix them: it is final, has no no-argument constructor, and stores the status as an ordinal.",
      ],
      language: "java",
      starter:
        "@Entity\npublic final class Order {\n  @Id @GeneratedValue private long id;\n  private OrderStatus status;\n\n  public Order(OrderStatus status) {\n    this.status = status;\n  }\n}",
      solution:
        "@Entity\npublic class Order {\n  @Id @GeneratedValue private Long id;\n\n  @Enumerated(EnumType.STRING)\n  private OrderStatus status;\n\n  protected Order() { }\n\n  public Order(OrderStatus status) {\n    this.status = status;\n  }\n}",
      hints: [
        "Also use a wrapper type for the id, and keep a no-argument constructor.",
      ],
      checklist: [
        "Not final",
        "Protected no-argument constructor",
        "Enum stored as a string",
      ],
    },
  ],
  revisionNotes: [
    "JPA = spec, Hibernate = provider, Spring Data JPA = generated repositories",
    "Entity: @Entity, @Id, no-arg constructor, non-final; EnumType.STRING; @Embeddable",
    "equals/hashCode on a stable business key; use instanceof",
    "Production: ddl-auto validate/none + Flyway/Liquibase",
  ],
  resources: [
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
    {
      label: "Spring Data JPA Reference: Getting Started",
      url: "https://docs.spring.io/spring-data/jpa/reference/jpa/getting-started.html",
    },
    {
      label: "Hibernate ORM Documentation",
      url: "https://hibernate.org/orm/documentation/",
    },
  ],
})
