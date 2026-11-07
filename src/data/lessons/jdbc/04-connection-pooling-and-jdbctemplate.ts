import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jdbc", {
  slug: "connection-pooling-and-jdbctemplate",
  title: "Connection pooling, Spring Boot data sources and JdbcTemplate",
  topic: "Pooling",
  minutes: 40,
  overview:
    "Understand why servers pool connections, size a pool sensibly, configure a Boot DataSource, and use JdbcTemplate to remove JDBC boilerplate.",
  objectives: [
    "Explain connection pooling and its main settings",
    "Reason about pool size and pool exhaustion",
    "Use JdbcTemplate and know when JDBC is better than an ORM",
  ],
  prerequisites: ["lesson.jdbc.jdbc-transactions"],
  sections: [
    {
      kind: "explain",
      heading: "Why pool connections",
      body: [
        "Opening a database connection is slow: it needs a network connection, authentication and session set-up. A **connection pool** keeps a number of open connections ready, hands one to a thread that asks for it, and takes it back when the thread closes it. This makes requests faster and also **limits the load on the database**, because the pool has a maximum size and extra requests wait for a free connection. **HikariCP** is the default pool in Spring Boot. With a pool, calling `close()` on a connection **returns it to the pool**, it does not close the physical connection.",
        "The important settings are the **maximum pool size**, the **time to wait for a connection**, and the **connection lifetime**. A connection that is never closed is a **leak**: it is never returned, and the pool runs dry.",
      ],
    },
    {
      kind: "code",
      heading: "Boot data source settings",
      example: {
        title: "Hikari properties",
        language: "properties",
        code: "spring.datasource.url=jdbc:postgresql://db:5432/shop\nspring.datasource.username=shop_app\nspring.datasource.password=${DB_PASSWORD}\nspring.datasource.hikari.maximum-pool-size=10\nspring.datasource.hikari.connection-timeout=3000\nspring.datasource.hikari.max-lifetime=1800000",
        walkthrough: [
          "The URL, user and password configure the connection, and the password comes from an environment variable.",
          "At most 10 connections are open at once, and a thread waits at most 3 seconds for one, then gets an error.",
          "A connection is replaced after 30 minutes, so stale connections do not build up.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Sizing a pool",
      body: [
        "The pool size is the number of queries that can run **at the same time**. The database can usefully run only as many as its CPU cores and disks allow, so a **small pool is often faster** than a large one. Remember that **every application instance has its own pool**: the sum of all pools must stay below the database's connection limit. Start with a modest number, measure the waiting time and the database load, and adjust.",
        "When the pool is exhausted, new requests wait until the timeout, then fail. The usual causes are leaks, slow queries and long transactions, and raising the size only hides them. Keep transactions short, and do not call external services while holding a connection.",
      ],
    },
    {
      kind: "explain",
      heading: "JdbcTemplate and JDBC versus an ORM",
      body: [
        "`JdbcTemplate` removes the repeated JDBC work: it gets and releases the connection, creates and closes statements and result sets, binds to the current transaction, and converts `SQLException` into Spring's unchecked `DataAccessException` hierarchy. You supply the SQL, the parameters and, for queries, a **`RowMapper`**. It uses `?` placeholders, so it is safe against injection when you use them. `NamedParameterJdbcTemplate` allows names such as `:id`.",
        "An **ORM** such as JPA with Hibernate maps tables to objects, generates the SQL for common operations and tracks changes, which saves a lot of code for typical create, read, update and delete work. **JDBC or `JdbcTemplate`** gives full control of the SQL, with no hidden queries, which suits reporting, bulk operations, complex joins and performance-critical queries. Many applications use **both**, in the same Spring transaction.",
      ],
    },
    {
      kind: "code",
      heading: "A repository with JdbcTemplate",
      example: {
        title: "No try blocks",
        language: "java",
        code: '@Repository\nclass ProductRepository {\n  private final JdbcTemplate jdbc;\n\n  ProductRepository(JdbcTemplate jdbc) {\n    this.jdbc = jdbc;\n  }\n\n  List<Product> byCategory(String category) {\n    return jdbc.query(\n        "SELECT id, name, price FROM products WHERE category = ?",\n        (rs, rowNum) -> new Product(rs.getLong("id"), rs.getString("name"), rs.getBigDecimal("price")),\n        category);\n  }\n\n  int rename(long id, String name) {\n    return jdbc.update("UPDATE products SET name = ? WHERE id = ?", name, id);\n  }\n}',
        walkthrough: [
          "No connection or statement is handled by hand.",
          "The lambda is a `RowMapper` that converts a row into a `Product`.",
          "`update` returns the number of rows changed.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Setting a very large pool because more is faster.",
          fix: "Keep it small and measure.",
        },
        {
          mistake: "Forgetting that every instance has its own pool.",
          fix: "Multiply by the number of instances.",
        },
        {
          mistake: "Holding a connection while calling a remote service.",
          fix: "Release it first.",
        },
        {
          mistake: "Building SQL by concatenation inside JdbcTemplate.",
          fix: "Use placeholders.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Five instances",
      scenario:
        "A service runs five instances, each with a pool of 20, against a database that allows 100 connections.",
      body: [
        "All pools together need 100 connections, which is the whole limit, and leaves none for administration or other services. Lower the pool size per instance, and check the waiting time to see whether it is enough.",
        "Pool size is a system-wide decision.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pool-why",
      prompt: "Why do servers use a connection pool?",
      options: [
        "Opening connections is slow and the database has a limit",
        "It makes SQL shorter",
        "It encrypts connections",
      ],
      answer: 0,
      explanation: "A pool reuses open connections and limits the load.",
    },
    {
      type: "single",
      id: "pool-close",
      prompt: "What does close() do on a pooled connection?",
      options: [
        "Returns it to the pool",
        "Closes the network connection",
        "Deletes the pool",
      ],
      answer: 0,
      explanation: "The physical connection stays open.",
    },
    {
      type: "truefalse",
      id: "pool-bigger",
      statement: "A larger pool always improves throughput.",
      answer: false,
      explanation:
        "A small pool is often faster, and the total of all pools must fit the database.",
    },
    {
      type: "blank",
      id: "pool-default",
      prompt: "Spring Boot uses the ___ connection pool by default.",
      answer: "HikariCP",
      explanation: "Its settings are under `spring.datasource.hikari.*`.",
    },
  ],
  assignment: {
    title: "Pool and template",
    task: [
      "Configure a Boot data source with a pool of 10 and a 3-second timeout, and write a repository with `JdbcTemplate`.",
      "Compute the total connections needed by your deployment, and explain what happens when the pool is exhausted.",
    ],
    checklist: [
      "No JDBC boilerplate in the repository",
      "The pool size is justified with numbers",
      "I can name three causes of pool exhaustion",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "pool-ex",
      title: "Query with JdbcTemplate",
      task: [
        "Write `int countByCategory(String category)` in a repository that uses `JdbcTemplate.queryForObject` to count the products of a category.",
      ],
      language: "java",
      starter: "int countByCategory(String category) {\n  // your code\n}",
      solution:
        'int countByCategory(String category) {\n  Integer count = jdbc.queryForObject(\n      "SELECT COUNT(*) FROM products WHERE category = ?", Integer.class, category);\n  return count == null ? 0 : count;\n}',
      hints: ["`queryForObject(sql, type, args...)` returns the single value."],
      checklist: [
        "The category is a parameter",
        "The result is unboxed safely",
        "No try block is used",
      ],
    },
  ],
  revisionNotes: [
    "Pool = reusable open connections and a limit on database load; close() returns to the pool",
    "Settings: maximum size, connection timeout, max lifetime; every instance has its own pool",
    "Exhaustion: leaks, slow queries, long transactions",
    "JdbcTemplate: no boilerplate, RowMapper, DataAccessException; JDBC and ORM can be used together",
  ],
  resources: [
    {
      label: "Spring Boot Reference: SQL Databases",
      url: "https://docs.spring.io/spring-boot/reference/data/sql.html",
    },
    {
      label: "Spring Framework Reference: Data Access with JDBC",
      url: "https://docs.spring.io/spring-framework/reference/data-access/jdbc.html",
    },
    {
      label: "The Java Tutorials: Connecting with DataSource Objects",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/connecting.html",
    },
  ],
})
