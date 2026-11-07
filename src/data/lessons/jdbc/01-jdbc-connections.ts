import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jdbc", {
  slug: "jdbc-connections",
  title: "JDBC basics: drivers, connections and reading results",
  topic: "Connections",
  minutes: 40,
  overview:
    "Understand JDBC, connect with DriverManager or a DataSource, run a query, read a ResultSet and close everything correctly.",
  objectives: [
    "Explain the roles of the JDBC API and the driver",
    "Open a connection and run a query with try-with-resources",
    "Read a ResultSet including NULL values",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "The API and the driver",
      body: [
        "**JDBC**, Java Database Connectivity, is the standard Java API in `java.sql` and `javax.sql` for working with relational databases. Your code uses interfaces such as `Connection`, `Statement`, `PreparedStatement` and `ResultSet`. The real work is done by a **JDBC driver**, a library supplied for one database, which implements those interfaces. The usual steps are: get a connection, create a statement, execute SQL, read the results, and close everything.",
        "Since JDBC 4, drivers on the class path register themselves, so `Class.forName` is no longer needed. A missing driver shows up as *No suitable driver found*. `DriverManager.getConnection(url, user, password)` returns a `Connection`. The URL has the form `jdbc:subprotocol://host:port/database`, for example `jdbc:postgresql://localhost:5432/shop`.",
        "**Credentials must not be written in the source code.** Read them from environment variables or a secret store. `DataSource`, from `javax.sql`, is the preferred way to get connections in applications: the details are configured in one place, and it can be backed by a connection pool.",
      ],
    },
    {
      kind: "code",
      heading: "A query",
      example: {
        title: "Connect, query, read",
        language: "java",
        code: 'String url = System.getenv("DB_URL");\nString user = System.getenv("DB_USER");\nString password = System.getenv("DB_PASSWORD");\n\ntry (Connection con = DriverManager.getConnection(url, user, password);\n     PreparedStatement ps = con.prepareStatement("SELECT id, name, discount FROM products WHERE price < ?")) {\n  ps.setBigDecimal(1, new BigDecimal("500"));\n  try (ResultSet rs = ps.executeQuery()) {\n    while (rs.next()) {\n      long id = rs.getLong("id");\n      String name = rs.getString("name");\n      BigDecimal discount = rs.getObject("discount", BigDecimal.class);   // NULL stays null\n      System.out.println(id + " " + name + " " + discount);\n    }\n  }\n} catch (SQLException e) {\n  System.err.println("Database error: " + e.getMessage());\n}',
        walkthrough: [
          "The settings come from the environment, and try-with-resources closes the result set, the statement and the connection in reverse order, even when an exception occurs.",
          "A `ResultSet` has a cursor that starts **before** the first row. `next()` moves it and returns `false` at the end.",
          "`getInt` and `getDouble` return `0` for SQL `NULL`. `getObject(col, Type.class)` returns `null`, or call `wasNull()` right after reading.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Closing and mapping",
      body: [
        "`Connection`, `Statement`, `PreparedStatement` and `ResultSet` all implement `AutoCloseable`, so use try-with-resources. A leaked connection is never returned to a pool, and eventually every request waits. Do not return a `ResultSet` from a method after its connection is closed: copy the data into objects first.",
        "JDBC maps SQL types to Java types: `VARCHAR` to `String`, `BIGINT` to `long`, `DECIMAL` and `NUMERIC` to **`BigDecimal`**, `BOOLEAN` to `boolean`, `DATE` and `TIMESTAMP` to `LocalDate` and `LocalDateTime` (read with `getObject(col, LocalDate.class)`). **Money must be a decimal type read as `BigDecimal`, never a floating-point type.** The Data Access Object (DAO) pattern keeps all this code behind an interface, so business logic contains no SQL.",
      ],
    },
    {
      kind: "code",
      heading: "A DAO",
      example: {
        title: "SQL in one place",
        language: "java",
        code: 'interface ProductDao {\n  Optional<Product> findById(long id);\n}\n\nclass JdbcProductDao implements ProductDao {\n  private final DataSource dataSource;\n\n  JdbcProductDao(DataSource dataSource) {\n    this.dataSource = dataSource;\n  }\n\n  public Optional<Product> findById(long id) {\n    String sql = "SELECT id, name, price FROM products WHERE id = ?";\n    try (Connection con = dataSource.getConnection();\n         PreparedStatement ps = con.prepareStatement(sql)) {\n      ps.setLong(1, id);\n      try (ResultSet rs = ps.executeQuery()) {\n        return rs.next()\n            ? Optional.of(new Product(rs.getLong(1), rs.getString(2), rs.getBigDecimal(3)))\n            : Optional.empty();\n      }\n    } catch (SQLException e) {\n      throw new DataAccessFailure("Could not load product " + id, e);\n    }\n  }\n}',
        walkthrough: [
          "The interface hides the technology, and the JDBC class holds all the SQL and the mapping.",
          "A `DataSource` is injected, so the connection details are configured elsewhere.",
          "A `SQLException` is turned into an application exception, with the original as the cause.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting the database password in the source code.",
          fix: "Read it from the environment.",
        },
        {
          mistake: "Closing only the connection.",
          fix: "Use try-with-resources for all of them.",
        },
        {
          mistake:
            "Using `getInt` and treating `0` as a real value for a nullable column.",
          fix: "Use `getObject(col, Integer.class)` or `wasNull()`.",
        },
        {
          mistake: "Storing prices in a `double` column.",
          fix: "Use `DECIMAL` and `BigDecimal`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A command-line importer",
      scenario: "A small tool reads a table and prints a report.",
      body: [
        "It reads the three connection settings from the environment, opens one connection in try-with-resources, and reads the rows in a `while (rs.next())` loop. Nothing is kept open after the report.",
        "For a server application the same code gets its connections from a pooled `DataSource`.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "jc-driver",
      prompt: "What does the JDBC driver do?",
      options: [
        "Implements the JDBC interfaces for one database",
        "Stores the data",
        "Compiles SQL",
      ],
      answer: 0,
      explanation:
        "Your code uses the interfaces and the driver talks to the database.",
    },
    {
      type: "single",
      id: "jc-close",
      prompt: "What is the best way to close JDBC resources?",
      options: [
        "try-with-resources",
        "Rely on garbage collection",
        "Close only the connection",
      ],
      answer: 0,
      explanation: "They are closed in reverse order, even on exceptions.",
    },
    {
      type: "truefalse",
      id: "jc-int-null",
      statement: '`rs.getInt("col")` returns null for an SQL NULL.',
      answer: false,
      explanation:
        "It returns 0. Use `getObject(col, Integer.class)` or `wasNull()`.",
    },
    {
      type: "blank",
      id: "jc-bigdecimal",
      prompt: "Money columns should be read as ___, not double.",
      answer: "BigDecimal",
      explanation: "Decimal types avoid rounding errors.",
    },
  ],
  assignment: {
    title: "Read a table",
    task: [
      "Write a program that connects with settings from the environment and prints the rows of a table with a parameterised filter.",
      "Handle a nullable column correctly and close everything with try-with-resources.",
    ],
    checklist: [
      "No credentials in the code",
      "NULL is handled",
      "All resources are closed",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "jc-ex",
      title: "Count the rows",
      task: [
        "Write `static int countProducts(DataSource ds)` that runs `SELECT COUNT(*) FROM products` and returns the number, closing all resources.",
      ],
      language: "java",
      starter:
        "static int countProducts(DataSource ds) throws SQLException {\n  // your code\n}",
      solution:
        'static int countProducts(DataSource ds) throws SQLException {\n  try (Connection con = ds.getConnection();\n       PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM products");\n       ResultSet rs = ps.executeQuery()) {\n    rs.next();\n    return rs.getInt(1);\n  }\n}',
      hints: ["Declare all three resources in the try header."],
      checklist: [
        "All resources are in the try header",
        "The count is read from column 1",
        "SQLException is declared",
      ],
    },
  ],
  revisionNotes: [
    "JDBC = API; the driver implements it; drivers on the class path self-register",
    "URL: `jdbc:subprotocol://host:port/db`; credentials from the environment",
    "try-with-resources; copy data out before closing; NULL: `getObject` or `wasNull`",
    "DECIMAL → BigDecimal; DAO keeps SQL in one place",
  ],
  resources: [
    {
      label: "The Java Tutorials: JDBC Introduction",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html",
    },
    {
      label: "The Java Tutorials: Establishing a Connection",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/connecting.html",
    },
    {
      label: "The Java Tutorials: Retrieving Values from Result Sets",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/retrieving.html",
    },
  ],
})
