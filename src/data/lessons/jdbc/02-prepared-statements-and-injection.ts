import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jdbc", {
  slug: "prepared-statements-and-injection",
  title: "PreparedStatement, SQL injection, batches and stored procedures",
  topic: "PreparedStatement",
  minutes: 45,
  overview:
    "Use parameterised queries to prevent SQL injection, call the right execute method, insert in batches, get generated keys, and call stored procedures.",
  objectives: [
    "Explain SQL injection and the parameterised-query fix",
    "Choose executeQuery, executeUpdate or execute",
    "Use batches, generated keys and CallableStatement",
  ],
  prerequisites: ["lesson.jdbc.jdbc-connections"],
  sections: [
    {
      kind: "explain",
      heading: "SQL injection",
      body: [
        "A `Statement` runs a SQL string that you build yourself. **Joining user input into it can allow SQL injection**: input such as `' OR '1'='1` changes the meaning of the query, and can read, change or delete data. A `PreparedStatement` takes SQL with **`?` placeholders**, and you set the values with `setString`, `setInt` and the other setters. The values are sent as **data**, not as SQL text, so they cannot change the structure of the query. The database can also reuse the parsed statement, which can help performance.",
        "Parameter indexes start at **1**. Placeholders can be used for values, **not for table or column names**. When a column name or a sort order must be dynamic, choose it from a fixed **allow list** in your code. Extra layers: validate input, give the database user only the permissions it needs, and never show raw database errors to users. ORMs are safe when you use their parameter binding, but a query built by string concatenation in HQL or native SQL is as vulnerable as plain JDBC.",
      ],
    },
    {
      kind: "code",
      heading: "Unsafe and safe",
      example: {
        title: "Parameters and an allow list",
        language: "java",
        code: 'private static final Set<String> SORTABLE = Set.of("name", "price");\n\nList<String> find(Connection con, String category, String requestedSort) throws SQLException {\n  String sortBy = SORTABLE.contains(requestedSort) ? requestedSort : "name";\n  String sql = "SELECT name FROM products WHERE category = ? ORDER BY " + sortBy;\n\n  // unsafe: "... WHERE category = \'" + category + "\'" would let input become SQL\n  try (PreparedStatement ps = con.prepareStatement(sql)) {\n    ps.setString(1, category);\n    List<String> names = new ArrayList<>();\n    try (ResultSet rs = ps.executeQuery()) {\n      while (rs.next()) names.add(rs.getString(1));\n    }\n    return names;\n  }\n}',
        walkthrough: [
          "The value `category` is a **parameter**, so it is always treated as data.",
          "A column name cannot be a parameter, so it comes from a fixed list in the code, and input can never become SQL text.",
          "The unsafe form is shown only in a comment.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The execute methods",
      body: [
        "`executeQuery` runs a statement that returns rows, normally a `SELECT`, and returns a `ResultSet`. `executeUpdate` runs `INSERT`, `UPDATE`, `DELETE` and DDL, and returns an `int`: the number of rows affected. `execute` is the general method for unknown or multiple results. Calling the wrong method for the statement throws `SQLException`. **Check the update count**: an `UPDATE` that returns `0` means that no row matched.",
        "For many rows, add each parameter set with **`addBatch()`** and send them together with `executeBatch()`, which reduces network round trips. Do it inside a transaction, and in chunks of a few hundred rows. To read an id that the database generates, prepare the statement with `Statement.RETURN_GENERATED_KEYS` and read `getGeneratedKeys()`.",
      ],
    },
    {
      kind: "code",
      heading: "A batch insert",
      example: {
        title: "addBatch and generated keys",
        language: "java",
        code: 'con.setAutoCommit(false);\ntry (PreparedStatement ps = con.prepareStatement(\n        "INSERT INTO products(name, price) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS)) {\n  for (Product p : products) {\n    ps.setString(1, p.name());\n    ps.setBigDecimal(2, p.price());\n    ps.addBatch();\n  }\n  ps.executeBatch();\n  try (ResultSet keys = ps.getGeneratedKeys()) {\n    while (keys.next()) {\n      System.out.println("new id " + keys.getLong(1));\n    }\n  }\n  con.commit();\n} catch (SQLException e) {\n  con.rollback();\n  throw e;\n}',
        walkthrough: [
          "Each loop pass adds one parameter set to the batch, and `executeBatch` sends them together.",
          "The generated ids are read afterwards.",
          "The whole import is committed, or rolled back if anything fails.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Stored procedures",
      body: [
        'A **`CallableStatement`** is created with `con.prepareCall("{call procedure_name(?, ?)}")`, using the standard JDBC call syntax, which the driver translates for the database. Set input parameters with the same setters as a prepared statement, register output parameters with `registerOutParameter(index, type)`, call `execute()`, and read the outputs with the getters. A function that returns a value uses `{? = call function_name(?)}`. Business logic in procedures is harder to test and version, so use them where the database needs them.',
      ],
    },
    {
      kind: "code",
      heading: "An output parameter",
      example: {
        title: "CallableStatement",
        language: "java",
        code: 'try (CallableStatement cs = con.prepareCall("{call apply_discount(?, ?, ?)}")) {\n  cs.setLong(1, orderId);\n  cs.setInt(2, 10);\n  cs.registerOutParameter(3, Types.NUMERIC);\n  cs.execute();\n  BigDecimal newTotal = cs.getBigDecimal(3);\n  System.out.println(newTotal);\n}',
        walkthrough: [
          "The first two parameters are inputs, and the third is registered as an output of type `NUMERIC`.",
          "After `execute()`, the output is read with `getBigDecimal(3)`.",
          "The call string is a fixed text. It is never built from user input.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Building SQL with string concatenation.",
          fix: "Use `?` placeholders.",
        },
        {
          mistake: "Using `setString(0, ...)`.",
          fix: "The first parameter is 1.",
        },
        {
          mistake: "Concatenating a sort column from the request.",
          fix: "Use an allow list.",
        },
        {
          mistake: "Ignoring the update count.",
          fix: "Check it when a row may not exist.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A login query",
      scenario: "A login checks an email and a password hash.",
      body: [
        "The query is `SELECT id, password_hash FROM users WHERE email = ?`, with the email as a parameter. The code compares the stored hash with the submitted password through the encoder, and never builds SQL from the form fields.",
        "Injection fails because the input is never part of the SQL text.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ps-inject",
      prompt: "How do you prevent SQL injection in JDBC?",
      options: [
        "Use PreparedStatement with parameters",
        "Escape quotes by hand",
        "Use Statement with trimmed input",
      ],
      answer: 0,
      explanation: "Parameters are sent as data.",
    },
    {
      type: "single",
      id: "ps-index",
      prompt: "What is the index of the first parameter in setString?",
      options: ["1", "0", "-1"],
      answer: 0,
      explanation: "JDBC parameter indexes start at 1.",
    },
    {
      type: "truefalse",
      id: "ps-ident",
      statement: "A `?` placeholder can be used for a column name.",
      answer: false,
      explanation:
        "Placeholders are for values only. Use an allow list for identifiers.",
    },
    {
      type: "single",
      id: "ps-update",
      prompt:
        "Which method runs an UPDATE and returns the number of rows changed?",
      options: ["executeUpdate", "executeQuery", "getGeneratedKeys"],
      answer: 0,
      explanation: "`executeQuery` is for statements that return rows.",
    },
  ],
  assignment: {
    title: "Injection and batches",
    task: [
      "Write a vulnerable query and show an injection input, then fix it with a parameter and an allow list for sorting.",
      "Insert 1,000 rows with a batch in a transaction and read the generated keys.",
    ],
    checklist: [
      "The injection no longer works",
      "The batch is in a transaction",
      "Keys are read after the batch",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "ps-ex",
      title: "A safe lookup",
      task: [
        "Write `static Optional<String> emailOf(Connection con, long id)` that reads the email of a user with a `PreparedStatement`.",
      ],
      language: "java",
      starter:
        "static Optional<String> emailOf(Connection con, long id) throws SQLException {\n  // your code\n}",
      solution:
        'static Optional<String> emailOf(Connection con, long id) throws SQLException {\n  try (PreparedStatement ps = con.prepareStatement("SELECT email FROM users WHERE id = ?")) {\n    ps.setLong(1, id);\n    try (ResultSet rs = ps.executeQuery()) {\n      return rs.next() ? Optional.of(rs.getString(1)) : Optional.empty();\n    }\n  }\n}',
      hints: ["Use `setLong(1, id)` and `executeQuery`."],
      checklist: [
        "The id is a parameter",
        "A missing user gives an empty Optional",
        "Resources are closed",
      ],
    },
  ],
  revisionNotes: [
    "PreparedStatement with `?` prevents SQL injection; indexes start at 1; allow-list identifiers",
    "executeQuery → ResultSet; executeUpdate → row count; check the count",
    "addBatch/executeBatch in a transaction; RETURN_GENERATED_KEYS",
    "CallableStatement: `{call proc(?, ?)}`, registerOutParameter",
  ],
  resources: [
    {
      label: "The Java Tutorials: Using Prepared Statements",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html",
    },
    {
      label: "The Java Tutorials: Using Stored Procedures",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/storedprocedures.html",
    },
    {
      label: "Java SE API: PreparedStatement",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html",
    },
  ],
})
