import { defineQuestions } from "../author"
import { g } from "../brief"

const SPEC = "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html"
const SD = "https://docs.spring.io/spring-data/jpa/reference"
const HIB = "https://hibernate.org/orm/documentation/"

export default defineQuestions("hibernate-jpa", "fresher", [
  g({
    slug: "jpa-vs-hibernate",
    topic: "Entities",
    d: "easy",
    title: "What is the difference between JPA, Hibernate and Spring Data JPA?",
    kw: ["JPA", "Hibernate", "Spring Data JPA", "ORM", "specification"],
    intent: "Checks that you can separate a specification, an implementation and a convenience layer.",
    short:
      "JPA, the Jakarta Persistence API, is a specification: it defines the annotations, the `EntityManager` API and the query language for mapping Java objects to relational tables, but it has no code of its own. Hibernate is the most widely used implementation, a provider that does the actual work and adds features beyond the specification. Spring Data JPA is a layer on top of JPA that generates repository implementations from interfaces, so that simple queries need no code. In a Spring Boot application, you normally use all three together: JPA annotations, Hibernate underneath, and Spring Data repositories.",
    detail: [
      "Code that uses only the JPA API can, in principle, switch providers.",
      "Hibernate-specific annotations exist, but they tie the code to Hibernate.",
      "Since Jakarta EE 9, the package names changed from `javax.persistence` to `jakarta.persistence`.",
    ],
    ex: "A `@Entity` class (JPA) is saved by a `JpaRepository` (Spring Data) and Hibernate generates the SQL.",
    mistakes: [
      "Saying that JPA is a framework that you can run without a provider.",
      "Mixing the old `javax.persistence` and the new `jakarta.persistence` imports.",
    ],
    follow: ["Why is the package name jakarta.persistence?"],
    points: [
      "JPA: specification",
      "Hibernate: implementation",
      "Spring Data JPA: repository layer",
    ],
    notes: "JPA = spec. Hibernate = provider. Spring Data JPA = generated repositories on top.",
    src: [
      ["Jakarta Persistence Specification", SPEC],
      ["Spring Data JPA Reference", `${SD}/index.html`],
    ],
  }),
  g({
    slug: "entity-basics",
    topic: "Entities",
    d: "easy",
    title: "How do you define a JPA entity, and what are the basic requirements?",
    kw: ["@Entity", "@Id", "@Table", "@Column", "no-arg constructor"],
    intent: "Checks that you can write a correct, minimal entity.",
    short:
      "An entity is a class annotated with `@Entity` that is mapped to a table. It must have a primary key field marked with `@Id`, a no-argument constructor that is public or protected, and it must not be `final`, because the provider may create subclasses or proxies of it. By default, the table is named after the class and the columns after the fields, and you change that with `@Table` and `@Column`. Use `@Column` to set `nullable`, `length` and `unique`, which also document the schema.",
    detail: [
      "The provider needs to create instances itself and to set fields, so the entity should not be a record.",
      "Use wrapper types, such as `Long`, for the id, because a new entity has no id yet, which is `null`.",
      "Keep entities free of business-unrelated logic such as JSON or UI annotations.",
    ],
    ex: "A `Product` entity has an `id`, a `name`, a `price` and a `createdAt` field.",
    code: [
      "A minimal entity",
      "@Entity\n@Table(name = \"products\")\npublic class Product {\n\n  @Id\n  @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n\n  @Column(nullable = false, length = 100)\n  private String name;\n\n  @Column(nullable = false, precision = 10, scale = 2)\n  private BigDecimal price;\n\n  protected Product() { }              // required by JPA\n\n  public Product(String name, BigDecimal price) {\n    this.name = name;\n    this.price = price;\n  }\n}",
      [
        "`@Entity` and `@Id` are the minimum.",
        "`@Column` documents the constraints of each column.",
        "The protected no-argument constructor is for the provider, and the public one is for your code.",
      ],
      "java",
    ],
    mistakes: [
      "Making the entity class `final` or using a record.",
      "Using a primitive `long` for the id.",
    ],
    follow: ["Why does an entity need a no-argument constructor?"],
    points: [
      "@Entity + @Id",
      "No-arg constructor, not final",
      "Use wrapper type for ids",
    ],
    notes: "`@Entity`, `@Id`, a no-arg constructor, non-final class; `@Table` / `@Column` to customise.",
    src: [
      ["Jakarta Persistence Specification: Entities", SPEC],
      ["Spring Data JPA Reference: Getting Started", `${SD}/jpa/getting-started.html`],
    ],
  }),
  g({
    slug: "id-generation-strategies",
    topic: "Entities",
    d: "medium",
    title: "What are the `@GeneratedValue` strategies, and which should you use?",
    kw: ["@GeneratedValue", "IDENTITY", "SEQUENCE", "AUTO", "UUID"],
    intent: "Checks that you know how ids are created and the consequence for batching.",
    short:
      "`GenerationType.IDENTITY` uses a database auto-increment column: simple, but the id is known only after the row is inserted, so the provider must insert immediately and cannot batch inserts. `SEQUENCE` asks a database sequence for ids, so ids can be obtained before the insert, which allows batching, and it is the usual choice for databases that have sequences. `TABLE` simulates a sequence with a table and is rarely used. `AUTO` lets the provider choose. A UUID can also be used, when ids should be created outside the database. Choose by what the database supports and by whether you need batch inserts.",
    detail: [
      "A sequence can have an allocation size, so that one call reserves many ids.",
      "The database and the entity must agree on the sequence name and increment, or you get errors or gaps.",
      "UUIDs avoid collisions between systems, but they are larger, and random ones can be less friendly to indexes.",
    ],
    ex: "A PostgreSQL project uses `SEQUENCE` so that Hibernate can batch the inserts of an import.",
    code: [
      "A sequence-based id",
      "@Id\n@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = \"product_seq\")\n@SequenceGenerator(name = \"product_seq\", sequenceName = \"product_seq\", allocationSize = 50)\nprivate Long id;",
      [
        "The generator names the database sequence.",
        "`allocationSize = 50` lets the provider reserve 50 ids at a time.",
        "Ids are known before the insert, so inserts can be batched.",
      ],
      "java",
    ],
    mistakes: [
      "Using `IDENTITY` and expecting batch inserts.",
      "A sequence increment that differs from the `allocationSize`.",
    ],
    follow: ["Why can IDENTITY not be batched?"],
    points: [
      "IDENTITY: simple, no batching",
      "SEQUENCE: batching, ids before insert",
      "Match the allocation size with the database",
    ],
    notes: "`SEQUENCE` for batching; `IDENTITY` is simple but inserts immediately; keep allocation sizes in sync.",
    src: [
      ["Jakarta Persistence Specification: Primary Keys and Entity Identity", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "enums-dates-and-embeddables",
    topic: "Entities",
    d: "medium",
    title: "How do you map enums, dates and value objects? (`@Enumerated`, `@Embeddable`)",
    kw: ["@Enumerated", "EnumType.STRING", "@Embeddable", "@Embedded", "java.time"],
    intent: "Checks that you map common types safely.",
    short:
      "An enum field is mapped with `@Enumerated`. The default is `ORDINAL`, which stores the position of the constant, so reordering the enum silently corrupts old data. Use `EnumType.STRING`, which stores the name. Modern JPA supports `java.time` types such as `LocalDate` and `Instant` directly. A value object without its own identity is mapped with `@Embeddable` on its class and `@Embedded` in the owner, and its fields become columns in the owner's table, for example an `Address` inside a `Customer`.",
    detail: [
      "Renaming an enum constant also changes the stored value with `STRING`, so plan migrations.",
      "`@AttributeOverride` renames the columns of an embedded object when it is used twice.",
      "Embeddables make the model clearer, without any extra join.",
    ],
    ex: "An `Order` has an `OrderStatus` enum stored as text and a `ShippingAddress` embedded value.",
    code: [
      "Enum as a string and an embedded value",
      "@Embeddable\npublic class Address {\n  private String street;\n  private String city;\n  private String pincode;\n}\n\n@Entity\npublic class Customer {\n  @Id @GeneratedValue private Long id;\n\n  @Enumerated(EnumType.STRING)\n  private CustomerType type;\n\n  @Embedded\n  private Address address;\n}",
      [
        "The enum is stored by name, so reordering is safe.",
        "The address fields become columns of the `customer` table.",
      ],
      "java",
    ],
    mistakes: [
      "Leaving the default `ORDINAL` for enums.",
      "Creating a separate entity and table for a simple value object.",
    ],
    follow: ["What problem does ORDINAL cause?"],
    points: [
      "EnumType.STRING, not ORDINAL",
      "java.time types are supported",
      "@Embeddable for value objects",
    ],
    notes: "`@Enumerated(EnumType.STRING)`; `@Embeddable`/`@Embedded` for value objects.",
    src: [
      ["Jakarta Persistence Specification: Basic Types and Embeddable Classes", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "equals-hashcode-entities",
    topic: "Entities",
    d: "hard",
    title: "How should you implement `equals` and `hashCode` for an entity?",
    kw: ["equals", "hashCode", "entity identity", "business key", "proxy"],
    intent: "Checks one of the more subtle design points of entity classes.",
    short:
      "The difficulty is that an entity's id is `null` until it is saved, so an `equals` and `hashCode` based on the generated id changes when the entity is persisted, which breaks hash-based collections that already hold it. Safe options are to use a business key that never changes and is unique, such as an email or an ISBN, or to use the id for `equals` only when it is not `null`, with a constant `hashCode`. Compare by class carefully, because Hibernate may give you a proxy subclass, so use `instanceof` or the real class. Do not include lazy collections, which would trigger loading.",
    detail: [
      "If you never put unsaved entities in sets or maps, an id-based approach is simpler.",
      "Lombok's generated `equals` on all fields is a common mistake for entities.",
      "Be clear about the rule in the team, and test it.",
    ],
    ex: "A `User` is compared by its unique, immutable `email`, and the id is not used.",
    code: [
      "Equality by a business key",
      "@Override\npublic boolean equals(Object o) {\n  if (this == o) return true;\n  if (!(o instanceof User other)) return false;\n  return email != null && email.equals(other.getEmail());\n}\n\n@Override\npublic int hashCode() {\n  return Objects.hash(email);\n}",
      [
        "`instanceof` works with proxy subclasses.",
        "Only the stable business key takes part.",
        "The hash code does not change when the entity is saved.",
      ],
      "java",
    ],
    mistakes: [
      "Using the generated id in `hashCode` for an entity kept in a `HashSet` before saving.",
      "Including a lazy collection in `equals`.",
    ],
    follow: ["Why can an id-based hashCode break a HashSet?"],
    points: [
      "Id is null before save",
      "Use a stable business key",
      "Use instanceof because of proxies",
    ],
    notes: "Base `equals`/`hashCode` on a stable business key; avoid generated ids and lazy collections.",
    src: [
      ["Jakarta Persistence Specification: Entities", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "one-to-many-many-to-one",
    topic: "Relationships",
    d: "medium",
    title: "How do you map `@OneToMany` and `@ManyToOne`, and what is the owning side?",
    kw: ["@OneToMany", "@ManyToOne", "mappedBy", "owning side", "foreign key"],
    intent: "Checks that you know where the foreign key lives and who controls it.",
    short:
      "A many-to-one relation, such as many orders for one customer, is mapped with `@ManyToOne` on the order, and the foreign key column is in the order's table. The one-to-many side, the customer's list of orders, is mapped with `@OneToMany(mappedBy = \"customer\")`. The side that has the foreign key is the owning side, and the `mappedBy` side is the inverse side. JPA writes the relationship to the database only from the owning side, so you must set the `customer` on the order. Without `mappedBy`, a unidirectional `@OneToMany` uses an extra join table.",
    detail: [
      "Keep both sides in sync with helper methods such as `addOrder`.",
      "A unidirectional `@ManyToOne` is often enough, and avoids the work of keeping two sides consistent.",
      "`@JoinColumn` names the foreign key column.",
    ],
    ex: "`Order` has `@ManyToOne Customer customer`, and `Customer` has `@OneToMany(mappedBy = \"customer\") List<Order> orders`.",
    code: [
      "A bidirectional relation",
      "@Entity\nclass Customer {\n  @Id @GeneratedValue Long id;\n\n  @OneToMany(mappedBy = \"customer\", cascade = CascadeType.ALL, orphanRemoval = true)\n  private List<Order> orders = new ArrayList<>();\n\n  void addOrder(Order order) {\n    orders.add(order);\n    order.setCustomer(this);   // sets the owning side\n  }\n}\n\n@Entity\nclass Order {\n  @Id @GeneratedValue Long id;\n\n  @ManyToOne(fetch = FetchType.LAZY)\n  @JoinColumn(name = \"customer_id\")\n  private Customer customer;\n\n  void setCustomer(Customer customer) { this.customer = customer; }\n}",
      [
        "`Order` owns the relation, because it holds the `customer_id` column.",
        "`mappedBy` marks `Customer.orders` as the inverse side.",
        "The helper method updates both sides.",
      ],
      "java",
    ],
    mistakes: [
      "Adding to the list only and not setting the owning side, so that nothing is saved.",
      "Using `@OneToMany` without `mappedBy` and getting an unexpected join table.",
    ],
    follow: ["Which side writes the foreign key?"],
    points: [
      "Foreign key side = owning side",
      "mappedBy marks the inverse side",
      "Keep both sides in sync",
    ],
    notes: "`@ManyToOne` owns the FK; `@OneToMany(mappedBy=...)` is the inverse side; sync both.",
    src: [
      ["Jakarta Persistence Specification: Relationships", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "many-to-many-mapping",
    topic: "Relationships",
    d: "medium",
    title: "How do you map a many-to-many relationship, and why is an association entity often better?",
    kw: ["@ManyToMany", "@JoinTable", "association entity", "extra columns", "Set vs List"],
    intent: "Checks that you can map it and know its limits.",
    short:
      "`@ManyToMany` maps a relation through a join table, for example students and courses, with `@JoinTable` naming the table and its two foreign key columns, and `mappedBy` on the other side. It is simple when the link has no data of its own. As soon as the relation needs extra columns, such as the enrolment date or a grade, you need an association entity, such as `Enrollment`, with a `@ManyToOne` to each side, and the many-to-many becomes two one-to-many relations. Prefer a `Set` for a many-to-many collection, because a `List` without an order column can make Hibernate delete and re-insert all the rows when one changes.",
    detail: [
      "Never use `CascadeType.REMOVE` on a many-to-many, because it can delete shared rows.",
      "Many models start with a plain many-to-many and are later changed to an association entity.",
      "Keep both sides in sync with helper methods.",
    ],
    ex: "`Student` and `Course` use a join table, and `Enrollment` is introduced when the grade needs to be stored.",
    code: [
      "A simple many-to-many",
      "@Entity\nclass Student {\n  @Id @GeneratedValue Long id;\n\n  @ManyToMany\n  @JoinTable(name = \"enrollments\",\n      joinColumns = @JoinColumn(name = \"student_id\"),\n      inverseJoinColumns = @JoinColumn(name = \"course_id\"))\n  private Set<Course> courses = new HashSet<>();\n}\n\n@Entity\nclass Course {\n  @Id @GeneratedValue Long id;\n\n  @ManyToMany(mappedBy = \"courses\")\n  private Set<Student> students = new HashSet<>();\n}",
      [
        "`Student` owns the relation and defines the join table.",
        "`Course` is the inverse side.",
        "A `Set` avoids needless delete and re-insert of rows.",
      ],
      "java",
    ],
    mistakes: [
      "Using `CascadeType.REMOVE` on a many-to-many.",
      "Trying to add extra columns to a plain join table.",
    ],
    follow: ["When do you need an association entity?"],
    points: [
      "Join table, owning and inverse side",
      "Extra data → association entity",
      "Prefer Set",
    ],
    notes: "`@ManyToMany` + `@JoinTable`. Extra columns → association entity. Prefer `Set`.",
    src: [
      ["Jakarta Persistence Specification: Relationships", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "cascade-and-orphan-removal",
    topic: "Relationships",
    d: "medium",
    title: "What do cascade types and `orphanRemoval` do?",
    kw: ["CascadeType", "orphanRemoval", "PERSIST", "REMOVE", "parent child"],
    intent: "Checks that you can manage the life cycle of children through the parent.",
    short:
      "Cascading passes an operation from a parent entity to its related entities. `CascadeType.PERSIST` saves new children when the parent is saved, `MERGE` merges them, `REMOVE` deletes them when the parent is deleted, and `ALL` includes all operations. `orphanRemoval = true` deletes a child when it is removed from the parent's collection, because it no longer belongs to anything. Use them for a true parent-child composition, where the child cannot exist without the parent, such as order lines in an order, and not for relations between independent entities.",
    detail: [
      "Cascading `REMOVE` from a child to a shared parent can delete data that other rows still need.",
      "Orphan removal works with `@OneToMany` and `@OneToOne`.",
      "The database foreign key and the cascade setting should agree.",
    ],
    ex: "Deleting an order deletes its lines, and removing a line from the list deletes that row.",
    mistakes: [
      "Putting `CascadeType.ALL` on a `@ManyToOne`, so that deleting a child deletes the shared parent.",
      "Using cascade between unrelated aggregates.",
    ],
    follow: ["What is the difference between cascade REMOVE and orphanRemoval?"],
    points: [
      "Cascade passes operations to children",
      "orphanRemoval deletes removed children",
      "Only for real composition",
    ],
    notes: "Cascade ALL + orphanRemoval for owned children (order lines). Never on shared parents.",
    src: [
      ["Jakarta Persistence Specification: Cascade and Orphan Removal", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "lazy-vs-eager-fetching",
    topic: "Fetching",
    d: "easy",
    title: "What is the difference between lazy and eager fetching, and what are the defaults?",
    kw: ["FetchType.LAZY", "FetchType.EAGER", "default fetch", "proxy", "performance"],
    intent: "Checks that you know when related data is loaded.",
    short:
      "With lazy fetching, a related entity or collection is loaded from the database only when you first access it, and the provider puts a proxy or a lazy collection in its place. With eager fetching, it is loaded at once together with the owner. The defaults in JPA are: `@OneToMany` and `@ManyToMany` are lazy, while `@ManyToOne` and `@OneToOne` are eager. Eager loading of many relations can create huge joins and many queries, so the usual advice is to make associations lazy and to load what you need for each use case with a query.",
    detail: [
      "`EAGER` cannot be turned off for a single query, but `LAZY` can be turned into a join fetch when needed.",
      "Accessing a lazy association after the session is closed throws `LazyInitializationException`.",
      "The right amount of data depends on the screen or the API call.",
    ],
    ex: "A list page loads orders without their lines, and the detail page loads one order with its lines.",
    code: [
      "Making an association lazy",
      "@ManyToOne(fetch = FetchType.LAZY)\n@JoinColumn(name = \"customer_id\")\nprivate Customer customer;",
      [
        "By default, `@ManyToOne` is eager.",
        "`LAZY` loads the customer only when the field is used.",
      ],
      "java",
    ],
    mistakes: [
      "Leaving `@ManyToOne` eager everywhere and loading far too much.",
      "Marking everything eager to avoid `LazyInitializationException`.",
    ],
    follow: ["What is LazyInitializationException?"],
    points: [
      "Lazy: on first access",
      "Defaults: to-many lazy, to-one eager",
      "Load what you need per use case",
    ],
    notes: "To-many are lazy by default, to-one eager. Prefer lazy and fetch explicitly per query.",
    src: [
      ["Jakarta Persistence Specification: Relationship Fetching", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "lazy-initialization-exception",
    topic: "Fetching",
    d: "medium",
    title: "What causes `LazyInitializationException` and how do you fix it properly?",
    kw: ["LazyInitializationException", "persistence context", "join fetch", "DTO projection", "open session in view"],
    intent: "Checks that you fix the cause and do not just switch to eager loading.",
    short:
      "A lazy association can be loaded only while the persistence context, the session that loaded the entity, is open. If you read the association after the transaction has ended, for example in a controller or while serialising to JSON, there is no session to load it, and Hibernate throws `LazyInitializationException`. Proper fixes are to load what is needed inside the transaction, with `JOIN FETCH`, an entity graph, or by mapping to a DTO with exactly the needed data, and to return DTOs from the service layer. Switching the association to eager, or keeping the session open for the whole web request, hides the problem and creates others.",
    detail: [
      "Spring Boot enables \"open in view\" by default, which keeps the session open during the request. Many teams switch it off with `spring.jpa.open-in-view=false`.",
      "With a DTO, the query selects only the needed columns, which is also faster.",
      "Initialising a collection by calling `size()` in the service works but is a workaround.",
    ],
    ex: "The service loads an order with its lines using `JOIN FETCH` and returns an `OrderDto`, so the controller never touches a lazy field.",
    code: [
      "Fetch what you need inside the transaction",
      "@Query(\"select o from Order o join fetch o.lines where o.id = :id\")\nOptional<Order> findWithLines(@Param(\"id\") Long id);\n\n@Transactional(readOnly = true)\nOrderDto get(Long id) {\n  Order order = repository.findWithLines(id).orElseThrow();\n  return mapper.toDto(order);   // lines are loaded, session still open\n}",
      [
        "`join fetch` loads the lines in the same query.",
        "The mapping to a DTO happens inside the transaction.",
        "The controller receives plain data and never touches a lazy proxy.",
      ],
      "java",
    ],
    mistakes: [
      "Changing every association to `EAGER` to remove the exception.",
      "Returning entities from controllers and serialising lazy fields.",
    ],
    follow: ["What does open-in-view do?"],
    points: [
      "Lazy loading needs an open session",
      "Fix: join fetch, entity graph or DTO",
      "Do not make everything eager",
    ],
    notes: "Load needed data inside the transaction (join fetch / DTO). Do not just make it eager.",
    src: [
      ["Spring Boot Reference: SQL Databases (Open EntityManager in View)", "https://docs.spring.io/spring-boot/reference/data/sql.html"],
      ["Jakarta Persistence Specification: Persistence Contexts", SPEC],
    ],
  }),
  g({
    slug: "n-plus-one-problem",
    topic: "N+1 problem",
    d: "medium",
    title: "What is the N+1 select problem?",
    kw: ["N+1", "lazy loading", "query count", "performance", "SQL logging"],
    intent: "Checks that you recognise the most common ORM performance problem.",
    short:
      "The N+1 problem happens when you load a list of N entities with one query, and then access a lazy association on each of them, which runs one extra query per entity, so N+1 queries in total. With 100 orders and their customers, that is 101 queries instead of one or two. It is invisible in the code, because the extra queries happen on access, and it is slow when the data grows. You detect it by logging the SQL or counting queries in tests, and fix it by fetching the association together with the list, with `JOIN FETCH`, an entity graph or batch fetching.",
    detail: [
      "Set `spring.jpa.show-sql=true`, or better a proper SQL logger, in development to see the queries.",
      "A query-count assertion in an integration test prevents regressions.",
      "A DTO query that selects the needed columns avoids the problem altogether.",
    ],
    ex: "A page that lists orders and prints each customer's name runs a query per row, until a join fetch is added.",
    mistakes: [
      "Not looking at the generated SQL.",
      "Fixing it with eager fetching, which often makes it worse in other places.",
    ],
    follow: ["How do you detect it?"],
    points: [
      "1 query + N queries for associations",
      "Hidden until you log the SQL",
      "Fix with join fetch, entity graph or DTOs",
    ],
    notes: "N+1 = one query for the list, one per row for a lazy association. Fetch together or use DTOs.",
    src: [
      ["Hibernate ORM Documentation", HIB],
      ["Spring Data JPA Reference: Query Methods", `${SD}/jpa/query-methods.html`],
    ],
  }),
  g({
    slug: "join-fetch-and-entity-graph",
    topic: "N+1 problem",
    d: "hard",
    title: "How do `JOIN FETCH`, `@EntityGraph` and batch fetching solve N+1, and what are their limits?",
    kw: ["JOIN FETCH", "@EntityGraph", "batch size", "MultipleBagFetchException", "pagination"],
    intent: "Checks that you know several tools and their trade-offs.",
    short:
      "`JOIN FETCH` in a query loads the association in the same SQL statement with a join. `@EntityGraph`, which Spring Data lets you put on a repository method, declares which attributes to load without writing the query. Both solve the N+1 problem for that use case. The limits: fetching a collection with a join multiplies the rows, and applying pagination to it can force the provider to load everything into memory. Fetching two `List` collections at once can throw `MultipleBagFetchException`. Batch fetching, with `@BatchSize` or the Hibernate batch size setting, loads lazy associations for several entities with one query, which is a good fallback.",
    detail: [
      "For paginated lists, fetch the page of ids first, and load the associations in a second step, or use a DTO query.",
      "Joining a to-one association is cheap, and joining a to-many needs care.",
      "Always check the generated SQL after the change.",
    ],
    ex: "The list endpoint uses `@EntityGraph(attributePaths = \"customer\")`, so the customer is loaded with the orders in one query.",
    code: [
      "An entity graph on a repository method",
      "interface OrderRepository extends JpaRepository<Order, Long> {\n\n  @EntityGraph(attributePaths = {\"customer\"})\n  List<Order> findByStatus(OrderStatus status);\n\n  @Query(\"select distinct o from Order o join fetch o.lines where o.status = :status\")\n  List<Order> findWithLines(@Param(\"status\") OrderStatus status);\n}",
      [
        "The entity graph adds the customer to the same query.",
        "`join fetch` loads the lines, and `distinct` removes duplicate orders caused by the join.",
        "Pagination on the second method would be done in memory, so avoid it there.",
      ],
      "java",
    ],
    mistakes: [
      "Paginating a query that join-fetches a collection.",
      "Fetching two bag collections in one query.",
    ],
    follow: ["What is MultipleBagFetchException?"],
    points: [
      "JOIN FETCH and @EntityGraph load associations with the query",
      "Collections + pagination are a trap",
      "Batch size is a fallback",
    ],
    notes: "`JOIN FETCH` / `@EntityGraph` fix N+1; beware pagination with collections and two bags.",
    src: [
      ["Spring Data JPA Reference: Query Methods", `${SD}/jpa/query-methods.html`],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "fetch-dto-projections",
    topic: "Fetching",
    d: "medium",
    title: "What are projections, and when should you use a DTO query instead of loading entities?",
    kw: ["projection", "DTO", "interface projection", "class-based projection", "select new"],
    intent: "Checks that you load only what the use case needs.",
    short:
      "A projection reads only some columns, instead of a whole entity. In Spring Data JPA, a repository method can return an interface with getters for the needed fields, or a record or class that is built from them, and the query selects only those columns. This is faster, uses less memory, avoids loading associations by accident, and the result is not a managed entity, so nothing is tracked for changes. Use projections for read-only views, such as lists and reports, and entities when you are going to change and save the data.",
    detail: [
      "A JPQL `select new com.shop.OrderSummary(o.id, o.total)` builds a DTO directly.",
      "Interface projections can be closed, with exact property names, which let the query select just those.",
      "Projections are not tracked, so changes to them are never saved.",
    ],
    ex: "The orders list reads only `id`, `status` and `total` through a record projection.",
    code: [
      "A record projection",
      "record OrderSummary(Long id, String status, BigDecimal total) { }\n\ninterface OrderRepository extends JpaRepository<Order, Long> {\n\n  @Query(\"select new com.shop.OrderSummary(o.id, o.status, o.total) from Order o where o.customer.id = :cid\")\n  List<OrderSummary> summaries(@Param(\"cid\") Long customerId);\n}",
      [
        "The query selects three columns only.",
        "The result is a list of records, not managed entities.",
        "No association is loaded, so no N+1 can happen.",
      ],
      "java",
    ],
    mistakes: [
      "Loading full entities only to show two fields.",
      "Trying to modify a projection and expecting it to be saved.",
    ],
    follow: ["What is the difference between an entity and a projection?"],
    points: [
      "Select only needed columns",
      "Not managed, not tracked",
      "Good for read-only views",
    ],
    notes: "Use projections / DTO queries for read-only lists; entities for changes.",
    src: [
      ["Spring Data JPA Reference: Projections", `${SD}/repositories/projections.html`],
      ["Spring Data JPA Reference: Query Methods", `${SD}/jpa/query-methods.html`],
    ],
  }),
  g({
    slug: "first-level-cache",
    topic: "Caching",
    d: "medium",
    title: "What is the first-level cache (persistence context)?",
    kw: ["first-level cache", "persistence context", "EntityManager", "identity map", "dirty checking"],
    intent: "Checks that you know the session-scoped cache that is always on.",
    short:
      "The persistence context is the set of entities that an `EntityManager`, also called a session, currently manages, and it acts as the first-level cache. Within it, each database row is represented by at most one entity object, so loading the same id twice in one transaction returns the same Java object, with only one query. It also supports automatic dirty checking: changes to a managed entity are detected and written at flush time. The cache is scoped to the session or transaction, it cannot be turned off, and it is not shared between requests.",
    detail: [
      "`find` checks the persistence context first, before it queries the database.",
      "A very long transaction that loads many entities makes the context large, and `clear` or `detach` can free it.",
      "A query that is run through JPQL still goes to the database, but the returned rows are matched with the managed entities.",
    ],
    ex: "Two `find(Product.class, 5L)` calls in one transaction run one query, and both return the same object.",
    code: [
      "Same id, same object",
      "@Transactional\nvoid demo(EntityManager em) {\n  Product a = em.find(Product.class, 5L);   // SQL select\n  Product b = em.find(Product.class, 5L);   // no SQL, from the context\n  System.out.println(a == b);               // true\n}",
      [
        "The first call runs a select.",
        "The second call returns the managed entity from the first-level cache.",
        "Both references point to the same object.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting the first-level cache to be shared between users.",
      "Loading huge numbers of entities in one transaction and running out of memory.",
    ],
    follow: ["What is dirty checking?"],
    points: [
      "One object per row per session",
      "Always on, session-scoped",
      "Enables dirty checking",
    ],
    notes: "First-level cache = the persistence context: one entity per id, per session; always on.",
    src: [
      ["Jakarta Persistence Specification: Persistence Contexts", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "second-level-and-query-cache",
    topic: "Caching",
    d: "hard",
    title: "What is the second-level cache, and when should you use it?",
    kw: ["second-level cache", "@Cacheable", "query cache", "Ehcache", "stale data"],
    intent: "Checks that you know it is optional, shared, and has consistency costs.",
    short:
      "The second-level cache is an optional cache shared by all sessions of a session factory, so that entity data can be reused across transactions without going to the database. It is turned on with settings and a cache provider, and entities are marked as cacheable, for example with `@Cacheable`. It suits data that is read often and changes rarely, such as reference data, and it brings the risks of stale data and extra memory use, especially in a cluster with several application instances. A query cache can store query results, but it is invalidated whenever the related tables change, so it helps in narrow cases. Measure first.",
    detail: [
      "The first-level cache is on by default, and the second-level cache is not.",
      "Updates made outside the application, directly in the database, are not seen until the cache entry expires.",
      "An application-level cache, such as Spring's cache abstraction, is often simpler to reason about.",
    ],
    ex: "A table of countries is cached in the second-level cache, because it hardly ever changes.",
    mistakes: [
      "Caching frequently changing data and serving stale values.",
      "Turning the cache on without measuring the benefit.",
    ],
    follow: ["How does it differ from the first-level cache?"],
    points: [
      "Optional, shared across sessions",
      "For read-mostly data",
      "Stale data and cluster risks",
    ],
    notes: "Second-level cache: optional, shared, read-mostly data only. Measure first.",
    src: [
      ["Jakarta Persistence Specification: Cache API", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "transactional-in-jpa",
    topic: "Transactions",
    d: "medium",
    title: "How do transactions work with JPA and Spring? (`@Transactional`, `readOnly`)",
    kw: ["@Transactional", "readOnly", "flush", "rollback", "service layer"],
    intent: "Checks where to put the transaction boundary and what it does to entities.",
    short:
      "With Spring, you put `@Transactional` on service methods, so that a transaction starts when the method begins and is committed, or rolled back on a runtime exception, when it ends. The `EntityManager` and the persistence context are bound to that transaction. Changes to managed entities are written to the database at commit, or earlier at a flush. `readOnly = true` tells Spring and Hibernate that the transaction does not change data, and lets them skip dirty checking and some work, which suits queries. Keep the boundary in the service layer, where a business operation is defined, and not in the repositories or controllers.",
    detail: [
      "Spring Data repository methods are already transactional by default.",
      "A `RuntimeException` rolls the transaction back, and a checked exception does not unless you configure it.",
      "Do not call remote services inside a long transaction.",
    ],
    ex: "`OrderService.place` creates the order, reduces the stock and saves both in one transaction.",
    code: [
      "A service transaction",
      "@Service\nclass OrderService {\n\n  @Transactional\n  public Long place(PlaceOrder request) {\n    Product product = products.findById(request.productId()).orElseThrow();\n    product.reduceStock(request.quantity());       // changed, saved at commit\n    return orders.save(new Order(product, request.quantity())).getId();\n  }\n\n  @Transactional(readOnly = true)\n  public OrderDto find(Long id) {\n    return mapper.toDto(orders.findById(id).orElseThrow());\n  }\n}",
      [
        "The stock change and the new order are committed together or not at all.",
        "The product is managed, so the change is saved without an explicit `save`.",
        "The read method is marked `readOnly`.",
      ],
      "java",
    ],
    mistakes: [
      "Putting `@Transactional` on controllers.",
      "Catching the exception inside the method, so that the transaction commits.",
    ],
    follow: ["What does readOnly do?"],
    points: [
      "Boundary in the service layer",
      "Persistence context lives with the transaction",
      "Runtime exception → rollback",
    ],
    notes: "`@Transactional` on service methods; `readOnly = true` for queries; changes flush at commit.",
    src: [
      ["Spring Data JPA Reference: Transactionality", `${SD}/jpa/transactions.html`],
      ["Spring Framework Reference: JPA", "https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html"],
    ],
  }),
  g({
    slug: "locking-optimistic-pessimistic",
    topic: "Transactions",
    d: "hard",
    title: "How do `@Version` and pessimistic locking prevent lost updates in JPA?",
    kw: ["@Version", "OptimisticLockException", "PESSIMISTIC_WRITE", "lost update", "@Lock"],
    intent: "Checks that you can protect data that several users change.",
    short:
      "Optimistic locking uses a `@Version` field, a number or a timestamp. Hibernate adds it to the `UPDATE` condition and increments it, and if another transaction changed the row meanwhile, no row matches and the provider throws an `OptimisticLockException`, so that the user can reload and retry. It needs no database locks and suits rare conflicts. Pessimistic locking locks the rows in the database, for example with `LockModeType.PESSIMISTIC_WRITE`, which issues `SELECT ... FOR UPDATE`, so others wait. It suits frequent conflicts, but it holds locks and can cause deadlocks. In Spring Data, `@Lock` on a repository method sets the mode.",
    detail: [
      "Always handle the exception, for example by returning `409 Conflict`.",
      "Never set the version field yourself.",
      "Keep pessimistic transactions short, and set a lock timeout.",
    ],
    ex: "A stock row uses `@Version`, and a seat booking uses `PESSIMISTIC_WRITE` while the seat is being assigned.",
    code: [
      "Version and a locked query",
      "@Entity\nclass Product {\n  @Id @GeneratedValue Long id;\n  @Version Long version;\n  int stock;\n}\n\ninterface SeatRepository extends JpaRepository<Seat, Long> {\n  @Lock(LockModeType.PESSIMISTIC_WRITE)\n  @Query(\"select s from Seat s where s.id = :id\")\n  Optional<Seat> lockById(@Param(\"id\") Long id);\n}",
      [
        "`@Version` turns on optimistic locking for `Product`.",
        "The locked query makes the database lock the row until the transaction ends.",
      ],
      "java",
    ],
    mistakes: [
      "Ignoring `OptimisticLockException`.",
      "Holding pessimistic locks across user think-time.",
    ],
    follow: ["How would you report a version conflict in a REST API?"],
    points: [
      "@Version: optimistic, no DB lock",
      "PESSIMISTIC_WRITE: SELECT FOR UPDATE",
      "Handle the conflict explicitly",
    ],
    notes: "`@Version` for optimistic locking; `@Lock(PESSIMISTIC_WRITE)` for pessimistic. Handle conflicts.",
    src: [
      ["Spring Data JPA Reference: Locking", `${SD}/jpa/locking.html`],
      ["Jakarta Persistence Specification: Locking", SPEC],
    ],
  }),
  g({
    slug: "entity-lifecycle-states",
    topic: "Entity lifecycle",
    d: "medium",
    title: "What are the states of an entity in JPA?",
    kw: ["transient", "managed", "detached", "removed", "entity lifecycle"],
    intent: "Checks that you understand when changes are saved automatically.",
    short:
      "An entity is in one of four states. New, or transient: created with `new`, not associated with a persistence context and not in the database. Managed, or persistent: attached to a persistence context, and any change is written to the database at flush. Detached: it has an identity in the database, but its persistence context is closed, or it was detached, so changes are no longer tracked. Removed: scheduled for deletion at flush. `persist` makes a new entity managed, `find` or a query returns managed entities, `merge` copies the state of a detached entity into a managed one, and `remove` marks one for deletion.",
    detail: [
      "After the transaction ends, entities become detached.",
      "An entity that was loaded and changed in a transaction needs no explicit `save`, because it is managed.",
      "Passing a detached entity to `persist` throws an exception.",
    ],
    ex: "A product loaded in a transaction is managed, and a changed price is saved at commit with no extra call.",
    mistakes: [
      "Expecting a change to a detached entity to be saved.",
      "Calling `persist` on an entity that already has an id and is detached.",
    ],
    follow: ["What does merge do?"],
    points: [
      "New, managed, detached, removed",
      "Managed entities are tracked",
      "persist, merge, remove change the state",
    ],
    notes: "New → managed (`persist`/`find`) → detached (session closes) → `merge`; removed via `remove`.",
    src: [
      ["Jakarta Persistence Specification: Entity Instance's Life Cycle", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "persist-vs-merge-vs-save",
    topic: "Entity lifecycle",
    d: "medium",
    title: "What is the difference between `persist`, `merge` and Spring Data's `save`?",
    kw: ["persist", "merge", "save", "isNew", "detached entity"],
    intent: "Checks that you know what each call does to the entity instance.",
    short:
      "`persist(entity)` makes a new entity managed, and the same instance becomes managed, so it must not already have a database identity. `merge(entity)` is for a detached or new entity: it copies the state onto a managed instance, which it loads or creates, and returns that managed copy, while the instance you passed stays unmanaged. Spring Data's `save` decides which one to call: if the entity is new, which means it has no id or version, it calls `persist`, and otherwise `merge`. So after `merge`, you must use the returned object.",
    detail: [
      "`merge` can issue a select first to load the existing row.",
      "For a managed entity, no `save` is needed to store changes.",
      "Entities with assigned ids, and without a version field, may be treated as not new, which causes a merge and an extra select.",
    ],
    ex: "`orders.save(order)` for a new order calls `persist`, and for an edited, detached order calls `merge`.",
    mistakes: [
      "Using the passed instance after `merge`, instead of the returned one.",
      "Calling `save` on every managed entity out of habit.",
    ],
    follow: ["How does Spring Data decide whether an entity is new?"],
    points: [
      "persist: new → managed, same instance",
      "merge: copy state, returns a managed copy",
      "save chooses between them",
    ],
    notes: "`persist` for new, `merge` for detached (use the returned instance); `save` picks one.",
    src: [
      ["Spring Data JPA Reference: Saving Entities", `${SD}/jpa/entity-persistence.html`],
      ["Jakarta Persistence Specification: EntityManager", SPEC],
    ],
  }),
  g({
    slug: "dirty-checking-and-flush",
    topic: "Entity lifecycle",
    d: "medium",
    title: "What are dirty checking and flush?",
    kw: ["dirty checking", "flush", "FlushModeType", "commit", "write-behind"],
    intent: "Checks that you know when SQL is really sent to the database.",
    short:
      "Dirty checking means that the provider remembers the state of each managed entity when it was loaded, and at flush time compares it with the current state, and it generates `UPDATE` statements for the entities that changed. A flush sends the pending changes, inserts, updates and deletes, to the database, but it does not commit. It happens automatically before a transaction commits, and usually before a query that could be affected by the pending changes, or when you call `flush()`. SQL is therefore sent later than the Java code that caused it, which explains why an exception may appear at commit and not on the line that changed the entity.",
    detail: [
      "A flush does not end the transaction, and a rollback can still undo it.",
      "Calling `flush()` yourself can force a constraint error to show up at a known place.",
      "Changing many entities means a lot of comparison work, so large imports should be done in batches.",
    ],
    ex: "The code changes a product's price and no `save` is called, but an `UPDATE` is sent at commit.",
    mistakes: [
      "Expecting an immediate SQL statement at the line that changes a field.",
      "Thinking that a flush is a commit.",
    ],
    follow: ["Why does a constraint violation appear at commit?"],
    points: [
      "Compares current state to the loaded state",
      "Flush sends SQL, commit ends the transaction",
      "SQL is delayed",
    ],
    notes: "Dirty checking finds changed entities; flush sends the SQL; commit makes it permanent.",
    src: [
      ["Jakarta Persistence Specification: Flush Modes and Persistence Contexts", SPEC],
      ["Hibernate ORM Documentation", HIB],
    ],
  }),
  g({
    slug: "jpql-basics",
    topic: "JPA queries",
    d: "easy",
    title: "What is JPQL and how is it different from SQL?",
    kw: ["JPQL", "createQuery", "named parameter", "entity query", "TypedQuery"],
    intent: "Checks that you can write a simple query against entities.",
    short:
      "JPQL, the Jakarta Persistence Query Language, is an object-oriented query language. It looks like SQL, but it uses entity names and field names instead of table and column names, and it is translated to the SQL of the database. For example `select p from Product p where p.price > :min order by p.name`. Always use named parameters, such as `:min`, which are set with `setParameter`, and never join values into the string. A `TypedQuery<Product>` returns the right Java type. Because it is independent of the database, JPQL queries are portable.",
    detail: [
      "`select p from Product p` selects entities, and `select p.name from Product p` selects a field.",
      "Joins follow the mapped relations, as in `join o.customer c`.",
      "Native SQL is available with `createNativeQuery` when you need database-specific features.",
    ],
    ex: "`select o from Order o where o.status = :status` returns the orders in a given status.",
    code: [
      "A typed query with a parameter",
      "List<Product> cheap = em.createQuery(\n        \"select p from Product p where p.price < :max order by p.price\", Product.class)\n    .setParameter(\"max\", new BigDecimal(\"500\"))\n    .setMaxResults(20)\n    .getResultList();",
      [
        "The query names the entity `Product`, not a table.",
        "The value is bound as a named parameter, which is safe against injection.",
        "`setMaxResults` limits the result.",
      ],
      "java",
    ],
    mistakes: [
      "Concatenating values into a JPQL string.",
      "Using table or column names in JPQL.",
    ],
    follow: ["When would you use a native query?"],
    points: [
      "Queries entities and fields",
      "Named parameters",
      "Portable across databases",
    ],
    notes: "JPQL uses entity and field names with `:param` parameters; translated to SQL.",
    src: [
      ["Jakarta Persistence Specification: Query Language", SPEC],
      ["Spring Data JPA Reference: Using @Query", `${SD}/jpa/query-methods.html`],
    ],
  }),
  g({
    slug: "spring-data-repositories",
    topic: "JPA queries",
    d: "easy",
    title: "How do Spring Data JPA repositories and derived query methods work?",
    kw: ["JpaRepository", "derived query", "findBy", "query methods", "repository interface"],
    intent: "Checks that you know how queries are generated from method names.",
    short:
      "You declare an interface that extends `JpaRepository<Entity, IdType>`, and Spring Data creates the implementation at run time, with ready methods such as `save`, `findById`, `findAll`, `deleteById` and `count`. For custom queries, you only declare methods whose names follow a convention, such as `findByEmail`, `findByStatusAndCreatedAtAfter` or `existsByEmail`, and Spring Data derives the query from the name. For longer names or complex queries, use `@Query`. If a name does not match a property, the application fails at start-up, which finds the mistake early.",
    detail: [
      "Keywords include `And`, `Or`, `Between`, `LessThan`, `Like`, `In`, `OrderBy` and `IgnoreCase`.",
      "A method that returns `Optional` signals that the result may be absent.",
      "Very long derived names are hard to read. Switch to `@Query` then.",
    ],
    ex: "`Optional<User> findByEmail(String email)` gives a lookup by email with no implementation.",
    code: [
      "A repository interface",
      "public interface UserRepository extends JpaRepository<User, Long> {\n\n  Optional<User> findByEmail(String email);\n\n  boolean existsByEmail(String email);\n\n  List<User> findByStatusAndCreatedAtAfterOrderByCreatedAtDesc(Status status, Instant since);\n}",
      [
        "No class implements the interface. Spring Data generates it.",
        "The method names are parsed into queries on the entity's properties.",
        "A wrong property name fails at start-up.",
      ],
      "java",
    ],
    mistakes: [
      "Writing an implementation class for a simple lookup.",
      "Inventing a long, unreadable derived method name.",
    ],
    follow: ["When do you use @Query instead?"],
    points: [
      "Interface only, generated implementation",
      "Method names become queries",
      "Mistakes fail at start-up",
    ],
    notes: "`extends JpaRepository`; `findByX...` method names are turned into queries.",
    src: [
      ["Spring Data JPA Reference: Query Methods", `${SD}/jpa/query-methods.html`],
      ["Spring Data JPA Reference: Core Concepts", `${SD}/repositories/core-concepts.html`],
    ],
  }),
  g({
    slug: "query-annotation-and-modifying",
    topic: "JPA queries",
    d: "medium",
    title: "How do `@Query`, `@Param` and `@Modifying` work?",
    kw: ["@Query", "@Param", "@Modifying", "nativeQuery", "bulk update"],
    intent: "Checks that you can write explicit and bulk queries in a repository.",
    short:
      "`@Query` on a repository method gives an explicit JPQL query, or a native SQL query with `nativeQuery = true`. Named parameters are bound with `@Param(\"name\")` and used as `:name`. For a query that changes data, such as a bulk `UPDATE` or `DELETE`, you add `@Modifying`, and the method returns the number of rows changed. A bulk statement goes straight to the database and bypasses the persistence context, so already loaded entities are not updated. Use `clearAutomatically = true` so the context is cleared afterwards, and run it inside a transaction.",
    detail: [
      "A bulk update is much faster than loading and saving many entities.",
      "It does not run entity callbacks and does not increase the `@Version`.",
      "Native queries tie the code to a database dialect.",
    ],
    ex: "A job closes all orders older than 90 days with one bulk `UPDATE` and returns the count.",
    code: [
      "A bulk update",
      "public interface OrderRepository extends JpaRepository<Order, Long> {\n\n  @Modifying(clearAutomatically = true)\n  @Transactional\n  @Query(\"update Order o set o.status = :to where o.status = :from and o.createdAt < :before\")\n  int closeOld(@Param(\"from\") Status from, @Param(\"to\") Status to, @Param(\"before\") Instant before);\n}",
      [
        "`@Modifying` marks the query as a data change, and the method returns the number of rows.",
        "The statement runs directly in the database.",
        "`clearAutomatically` clears the persistence context so that stale entities are dropped.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting `@Modifying`, which gives an error for an update query.",
      "Using managed entities after a bulk update without clearing the context.",
    ],
    follow: ["Why does a bulk update bypass the persistence context?"],
    points: [
      "@Query for explicit JPQL or SQL",
      "@Param binds named parameters",
      "@Modifying for bulk changes, clear the context",
    ],
    notes: "`@Query` + `@Param`; add `@Modifying(clearAutomatically = true)` for bulk updates and deletes.",
    src: [
      ["Spring Data JPA Reference: Using @Query", `${SD}/jpa/query-methods.html`],
      ["Spring Data JPA Reference: Query Methods", `${SD}/jpa/query-methods.html`],
    ],
  }),
  g({
    slug: "pagination-and-sorting-jpa",
    topic: "JPA queries",
    d: "medium",
    title: "How do you paginate and sort results in Spring Data JPA?",
    kw: ["Pageable", "Page", "Slice", "Sort", "PageRequest"],
    intent: "Checks that you return data in pages and know the cost of a count query.",
    short:
      "A repository method can take a `Pageable` parameter and return a `Page<T>`, a `Slice<T>` or a `List<T>`. You create the request with `PageRequest.of(pageIndex, size, Sort.by(\"createdAt\").descending())`, and page indexes start at 0. A `Page` also runs a second `COUNT` query to give the total number of elements and pages. A `Slice` skips the count and only knows whether there is a next page, which is cheaper for long lists. Always limit the page size, and sort on an indexed column with a unique tie-breaker, such as the id.",
    detail: [
      "In a controller, a `Pageable` argument is filled from the `page`, `size` and `sort` request parameters.",
      "Offset-based paging becomes slow for large offsets, and keyset paging scales better.",
      "Do not paginate a query that join-fetches a collection.",
    ],
    ex: "`GET /orders?page=0&size=20&sort=createdAt,desc` returns the first 20 orders, newest first.",
    code: [
      "A page of orders",
      "interface OrderRepository extends JpaRepository<Order, Long> {\n  Page<Order> findByStatus(Status status, Pageable pageable);\n}\n\nPageable pageable = PageRequest.of(0, 20, Sort.by(\"createdAt\").descending().and(Sort.by(\"id\")));\nPage<Order> page = repository.findByStatus(Status.PAID, pageable);\nSystem.out.println(page.getTotalElements() + \" total, \" + page.getContent().size() + \" on this page\");",
      [
        "The `Pageable` carries the page number, size and sorting.",
        "The id is a tie-breaker, so pages do not overlap.",
        "A `Page` includes a count query for the total.",
      ],
      "java",
    ],
    mistakes: [
      "Allowing a client to ask for a page size of a million.",
      "Using a `Page` when the total is never shown, and paying for the count.",
    ],
    follow: ["What is the difference between Page and Slice?"],
    points: [
      "Pageable in, Page or Slice out",
      "Page runs a count query",
      "Limit the page size",
    ],
    notes: "`Pageable` + `Page` (with count) or `Slice` (no count). Limit the size, sort with a tie-breaker.",
    src: [
      ["Spring Data JPA Reference: Query Methods (paging and sorting)", `${SD}/jpa/query-methods.html`],
      ["Spring Data JPA Reference: Core Concepts", `${SD}/repositories/core-concepts.html`],
    ],
  }),
  g({
    slug: "criteria-and-specifications",
    topic: "JPA queries",
    d: "hard",
    title: "When do you use the Criteria API or Specifications instead of fixed queries?",
    kw: ["Criteria API", "Specification", "dynamic query", "JpaSpecificationExecutor", "search filter"],
    intent: "Checks that you can build queries whose conditions vary at run time.",
    short:
      "When the conditions of a query depend on what the user filled in, for example an optional name, price range and category, fixed JPQL strings need many variants. The Criteria API builds a query with Java objects, so you can add a condition only when a value is present, and it is type-safe when used with the metamodel. Spring Data's `Specification` wraps this: each condition is a small reusable object, and you combine them with `and` and `or`. A repository that extends `JpaSpecificationExecutor` can then run `findAll(spec, pageable)`. For fixed queries, a plain method or `@Query` is simpler.",
    detail: [
      "Specifications keep the conditions reusable and testable.",
      "Check the generated SQL and indexes for flexible searches.",
      "Querydsl is a popular alternative for type-safe dynamic queries.",
    ],
    ex: "A product search page has five optional filters, and each one becomes a `Specification` that is combined at run time.",
    code: [
      "Composing optional filters",
      "class ProductSpecs {\n  static Specification<Product> nameContains(String text) {\n    return (root, query, cb) -> cb.like(cb.lower(root.get(\"name\")), \"%\" + text.toLowerCase() + \"%\");\n  }\n  static Specification<Product> priceAtMost(BigDecimal max) {\n    return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(\"price\"), max);\n  }\n}\n\nSpecification<Product> spec = Specification.where(null);\nif (name != null) spec = spec.and(ProductSpecs.nameContains(name));\nif (max != null) spec = spec.and(ProductSpecs.priceAtMost(max));\nPage<Product> page = repository.findAll(spec, pageable);",
      [
        "Each condition is a small `Specification`.",
        "Conditions are added only when the filter value is present.",
        "The repository runs the combined query with paging.",
      ],
      "java",
    ],
    mistakes: [
      "Concatenating a JPQL string for optional filters.",
      "Using the Criteria API for a query that never changes.",
    ],
    follow: ["What is the alternative to Specifications?"],
    points: [
      "Dynamic conditions at run time",
      "Specifications are reusable pieces",
      "Use fixed queries when nothing varies",
    ],
    notes: "Optional filters → Criteria / `Specification` combined with `and`; fixed queries → `@Query`.",
    src: [
      ["Spring Data JPA Reference: Specifications", `${SD}/jpa/specifications.html`],
      ["Jakarta Persistence Specification: Criteria API", SPEC],
    ],
  }),
  g({
    slug: "jpa-batch-and-bulk-operations",
    topic: "JPA queries",
    d: "hard",
    title: "How do you insert or update many rows efficiently with JPA?",
    kw: ["hibernate.jdbc.batch_size", "batch insert", "flush and clear", "saveAll", "bulk"],
    intent: "Checks that you can avoid loading and tracking huge numbers of entities.",
    short:
      "Saving many entities one by one fills the persistence context and sends many statements. Turn on JDBC batching with the Hibernate setting `hibernate.jdbc.batch_size`, for example `50`, and use an id strategy that allows it, such as `SEQUENCE`, because `IDENTITY` disables batched inserts. In a loop, call `flush()` and then `clear()` on the `EntityManager` every batch, so that the persistence context does not grow without limit. For changes that do not need entities, a bulk `UPDATE` or `DELETE` query is much faster, and for very large loads, plain JDBC batching or the database's bulk loader can be better.",
    detail: [
      "`saveAll` does not make the inserts faster by itself.",
      "Ordering inserts and updates with the `order_inserts` and `order_updates` settings improves batching.",
      "Test with the SQL log or statistics, to confirm that statements are really batched.",
    ],
    ex: "An import of 100,000 rows uses a batch size of 50, a sequence id and a flush and clear after every 50 entities.",
    code: [
      "Batching with flush and clear",
      "// application.properties\n// spring.jpa.properties.hibernate.jdbc.batch_size=50\n// spring.jpa.properties.hibernate.order_inserts=true\n\n@Transactional\nvoid importAll(List<Product> products) {\n  int count = 0;\n  for (Product p : products) {\n    em.persist(p);\n    if (++count % 50 == 0) {\n      em.flush();\n      em.clear();\n    }\n  }\n}",
      [
        "Batching is enabled by the property.",
        "Every 50 entities, the changes are sent and the context is cleared.",
        "Memory stays constant, however long the list is.",
      ],
      "java",
    ],
    mistakes: [
      "Using `IDENTITY` ids and wondering why the inserts are not batched.",
      "Never clearing the persistence context in a long loop.",
    ],
    follow: ["Why does IDENTITY prevent batching?"],
    points: [
      "Enable JDBC batch size",
      "SEQUENCE ids, not IDENTITY",
      "flush + clear in loops; bulk queries when possible",
    ],
    notes: "`hibernate.jdbc.batch_size` + SEQUENCE ids + `flush()`/`clear()` per batch.",
    src: [
      ["Hibernate ORM Documentation", HIB],
      ["Spring Boot Reference: SQL Databases", "https://docs.spring.io/spring-boot/reference/data/sql.html"],
    ],
  }),
  g({
    slug: "jpa-schema-management",
    topic: "Entities",
    d: "easy",
    title: "What does `spring.jpa.hibernate.ddl-auto` do, and what should you use in production?",
    kw: ["ddl-auto", "Flyway", "Liquibase", "schema migration", "validate"],
    intent: "Checks that you do not let Hibernate change a production schema.",
    short:
      "The `ddl-auto` property tells Hibernate what to do with the database schema at start-up: `none` does nothing, `validate` checks that the schema matches the entities and fails if not, `update` tries to add missing tables and columns, `create` rebuilds the schema, and `create-drop` also removes it when the application stops. `create`, `create-drop` and `update` are for experiments and tests. In production, use `validate` or `none`, and manage the schema with a migration tool such as Flyway or Liquibase, which applies versioned, reviewed scripts in order and records what has run.",
    detail: [
      "`update` cannot drop or rename things and can behave unpredictably, so it is not a migration tool.",
      "Spring Boot defaults to `create-drop` for an embedded database and `none` for others.",
      "Keep migration scripts in the repository, and never edit one that has already been applied.",
    ],
    ex: "Development uses an in-memory database with `create-drop`, and production uses Flyway with `validate`.",
    mistakes: [
      "Running `update` or `create` against a production database.",
      "Editing an old migration that has already been applied.",
    ],
    follow: ["Why is update not a good migration tool?"],
    points: [
      "none, validate, update, create, create-drop",
      "Production: validate or none",
      "Use Flyway or Liquibase",
    ],
    notes: "Production: `ddl-auto=validate` or `none` + Flyway/Liquibase migrations.",
    src: [
      ["Spring Boot Reference: Creating and Dropping JPA Databases", "https://docs.spring.io/spring-boot/reference/data/sql.html"],
      ["Spring Boot Reference: Database Initialization", "https://docs.spring.io/spring-boot/how-to/data-initialization.html"],
    ],
  }),
])
