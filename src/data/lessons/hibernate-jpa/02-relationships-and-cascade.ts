import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "relationships-and-cascade",
  title: "Relationships: one-to-many, many-to-many and cascading",
  topic: "Relationships",
  minutes: 90,
  overview:
    "Map associations correctly, understand the owning side, many-to-many pitfalls, and use cascade and orphan removal for owned children.",
  objectives: [
    "Map @ManyToOne and @OneToMany with mappedBy",
    "Map @ManyToMany and know when to use an association entity",
    "Use cascade and orphanRemoval for true composition",
  ],
  prerequisites: ["lesson.hibernate-jpa.jpa-entities"],
  sections: [
    {
      kind: "explain",
      heading: "The owning side",
      body: [
        "A **many-to-one** relation, such as many orders for one customer, is mapped with `@ManyToOne` on the order, and the **foreign key column** is in the order's table. The **one-to-many** side, the customer's list of orders, is mapped with `@OneToMany(mappedBy = \"customer\")`. The side that has the foreign key is the **owning side**, and the `mappedBy` side is the **inverse side**. JPA writes the relationship to the database **only from the owning side**, so you must set `customer` on the order. Without `mappedBy`, a unidirectional `@OneToMany` uses an extra **join table**. A unidirectional `@ManyToOne` is often enough, and avoids keeping two sides consistent.",
        "Keep both sides in sync with **helper methods** such as `addOrder`. `@JoinColumn` names the foreign key column.",
      ],
    },
    {
      kind: "code",
      heading: "A bidirectional relation",
      example: {
        title: "Customer and Order",
        language: "java",
        code: '@Entity\nclass Customer {\n  @Id @GeneratedValue Long id;\n\n  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)\n  private List<Order> orders = new ArrayList<>();\n\n  void addOrder(Order order) {\n    orders.add(order);\n    order.setCustomer(this);   // sets the owning side\n  }\n}\n\n@Entity\nclass Order {\n  @Id @GeneratedValue Long id;\n\n  @ManyToOne(fetch = FetchType.LAZY)\n  @JoinColumn(name = "customer_id")\n  private Customer customer;\n\n  void setCustomer(Customer customer) { this.customer = customer; }\n}',
        walkthrough: [
          "`Order` owns the relation, because it holds the `customer_id` column.",
          "`mappedBy` marks `Customer.orders` as the inverse side.",
          "The helper method updates both sides, so nothing depends on a forgotten call.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Many-to-many",
      body: [
        "`@ManyToMany` maps a relation through a **join table**, for example students and courses, with `@JoinTable` naming the table and its two foreign key columns, and `mappedBy` on the other side. It is simple when the link has no data of its own. As soon as the relation needs **extra columns**, such as an enrolment date or a grade, use an **association entity**, such as `Enrollment`, with a `@ManyToOne` to each side, which turns the many-to-many into two one-to-many relations.",
        "Prefer a **`Set`** for a many-to-many collection, because a `List` without an order column can make Hibernate delete and re-insert all rows when one changes. **Never use `CascadeType.REMOVE`** on a many-to-many, because it can delete shared rows.",
      ],
    },
    {
      kind: "explain",
      heading: "Cascade and orphan removal",
      body: [
        "**Cascading** passes an operation from a parent to its related entities. `PERSIST` saves new children when the parent is saved, `MERGE` merges them, `REMOVE` deletes them with the parent, and `ALL` includes all. **`orphanRemoval = true`** deletes a child when it is removed from the parent's collection, because it no longer belongs to anything. Use them for a true **composition**, where the child cannot exist without the parent, such as the lines of an order, and not for relations between independent entities. Cascading `REMOVE` from a child to a shared parent can delete data that other rows need.",
        "The database foreign key and the cascade setting should agree.",
      ],
    },
    {
      kind: "code",
      heading: "A many-to-many with a Set",
      example: {
        title: "Student and Course",
        language: "java",
        code: '@Entity\nclass Student {\n  @Id @GeneratedValue Long id;\n\n  @ManyToMany\n  @JoinTable(name = "enrollments",\n      joinColumns = @JoinColumn(name = "student_id"),\n      inverseJoinColumns = @JoinColumn(name = "course_id"))\n  private Set<Course> courses = new HashSet<>();\n}\n\n@Entity\nclass Course {\n  @Id @GeneratedValue Long id;\n\n  @ManyToMany(mappedBy = "courses")\n  private Set<Student> students = new HashSet<>();\n}',
        walkthrough: [
          "`Student` owns the relation and defines the join table.",
          "`Course` is the inverse side.",
          "A `Set` avoids needless delete and re-insert of rows.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Adding to the list only and not setting the owning side.",
          fix: "Set the `customer` on the order, in a helper method.",
        },
        {
          mistake: "Using `@OneToMany` without `mappedBy`.",
          fix: "You get an unexpected join table.",
        },
        {
          mistake: "Putting `CascadeType.ALL` on a `@ManyToOne`.",
          fix: "Deleting a child would delete the shared parent.",
        },
        {
          mistake: "Trying to add extra columns to a plain join table.",
          fix: "Use an association entity.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Orders and lines",
      scenario:
        "An order has lines that cannot exist without it, and it belongs to a customer who lives on.",
      body: [
        '`Order` has `@OneToMany(mappedBy = "order", cascade = ALL, orphanRemoval = true)` for its lines, and `@ManyToOne` to the customer, with no cascade. Removing a line from the list deletes its row, and deleting an order never deletes the customer.',
        "Cascade follows ownership.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rl-owning",
      prompt: "Which side owns a one-to-many relation?",
      options: [
        "The side with the foreign key (the @ManyToOne side)",
        "The @OneToMany side",
        "Both",
      ],
      answer: 0,
      explanation: "The inverse side uses `mappedBy`.",
    },
    {
      type: "single",
      id: "rl-extra",
      prompt:
        "A relation between students and courses needs a grade. What should you use?",
      options: ["An association entity", "A List of Course", "CascadeType.ALL"],
      answer: 0,
      explanation: "A plain join table cannot hold extra columns.",
    },
    {
      type: "truefalse",
      id: "rl-cascade-m2o",
      statement: "CascadeType.ALL on a @ManyToOne is a good default.",
      answer: false,
      explanation: "Deleting a child would delete a shared parent.",
    },
    {
      type: "blank",
      id: "rl-orphan",
      prompt:
        "`orphanRemoval = true` deletes a child when it is removed from the parent's ___.",
      answer: "collection",
      explanation: "It no longer belongs to anything.",
    },
  ],
  assignment: {
    title: "Model orders",
    task: [
      "Model Customer, Order and OrderLine with the correct owning sides, helper methods and cascade only for the lines.",
      "Model Student and Course as a many-to-many, then change it to an association entity with a grade.",
    ],
    checklist: [
      "The owning side is set in the helper",
      "No cascade on shared parents",
      "The association entity holds the extra column",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "rl-ex",
      title: "Fix the mapping",
      task: [
        "This `@OneToMany` creates an unexpected join table. Fix it with `mappedBy` and add a helper method that keeps both sides in sync.",
      ],
      language: "java",
      starter:
        "@Entity\nclass Author {\n  @Id @GeneratedValue Long id;\n\n  @OneToMany\n  private List<Book> books = new ArrayList<>();\n}\n\n@Entity\nclass Book {\n  @Id @GeneratedValue Long id;\n\n  @ManyToOne\n  private Author author;\n}",
      solution:
        '@Entity\nclass Author {\n  @Id @GeneratedValue Long id;\n\n  @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)\n  private List<Book> books = new ArrayList<>();\n\n  void addBook(Book book) {\n    books.add(book);\n    book.setAuthor(this);\n  }\n}\n\n@Entity\nclass Book {\n  @Id @GeneratedValue Long id;\n\n  @ManyToOne(fetch = FetchType.LAZY)\n  private Author author;\n\n  void setAuthor(Author author) {\n    this.author = author;\n  }\n}',
      hints: ["`mappedBy` names the field on the owning side."],
      checklist: [
        "mappedBy is used",
        "The helper sets both sides",
        "The @ManyToOne is lazy",
      ],
    },
  ],
  revisionNotes: [
    "FK side = owning side; `mappedBy` marks the inverse side; sync both with helpers",
    "Many-to-many: Set, join table; extra columns → association entity; no REMOVE cascade",
    "Cascade and orphanRemoval only for owned children (composition)",
    "A unidirectional @ManyToOne is often enough",
  ],
  resources: [
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
    {
      label: "Hibernate ORM Documentation",
      url: "https://hibernate.org/orm/documentation/",
    },
  ],
})
