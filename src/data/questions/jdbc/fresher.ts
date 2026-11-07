import { defineQuestions } from "../author"
import { g } from "../brief"

const T = "https://docs.oracle.com/javase/tutorial/jdbc/basics"
const API = "https://docs.oracle.com/en/java/javase/21/docs/api/java.sql"
const SB = "https://docs.spring.io/spring-boot/reference"

export default defineQuestions("jdbc", "fresher", [
  g({
    slug: "what-is-jdbc",
    topic: "Connections",
    d: "easy",
    title: "What is JDBC and how does a Java program talk to a database with it?",
    kw: ["JDBC", "driver", "Connection", "java.sql", "database access"],
    intent: "Checks that you know the role of the standard API and of the driver.",
    short:
      "JDBC, Java Database Connectivity, is the standard Java API in the `java.sql` and `javax.sql` packages for working with relational databases. Your code uses interfaces such as `Connection`, `Statement`, `PreparedStatement` and `ResultSet`. The real work is done by a JDBC driver, a library supplied by the database vendor, which implements those interfaces for one database. The usual steps are: get a connection, create a statement, execute SQL, read the results, and close everything. Because your code depends on the interfaces, changing the database mostly means changing the driver and the URL.",
    detail: [
      "Since JDBC 4, drivers on the class path register themselves, so `Class.forName` is no longer needed.",
      "JDBC is low level. Frameworks such as Spring `JdbcTemplate` and JPA are built on top of it.",
      "SQL is database specific in places, so portability is not complete.",
    ],
    ex: "A program uses the PostgreSQL driver to run a `SELECT` and print the rows.",
    mistakes: [
      "Saying that JDBC is a database. It is an API, and the driver talks to the database.",
      "Forgetting to add the driver jar to the class path.",
    ],
    follow: ["What does the driver do?"],
    points: [
      "Standard API, vendor driver",
      "Connection → Statement → ResultSet",
      "Close resources",
    ],
    notes: "JDBC = standard API; the driver (per database) implements it.",
    src: [
      ["The Java Tutorials: JDBC Introduction", `${T}/index.html`],
      ["Java SE API: java.sql", `${API}/module-summary.html`],
    ],
  }),
  g({
    slug: "jdbc-connection-url",
    topic: "Connections",
    d: "easy",
    title: "How do you open a JDBC connection? (`DriverManager` and the URL)",
    kw: ["DriverManager", "JDBC URL", "getConnection", "credentials", "Connection"],
    intent: "Checks that you can connect and handle credentials safely.",
    short:
      "`DriverManager.getConnection(url, user, password)` returns a `Connection`. The URL names the database and has the form `jdbc:subprotocol://host:port/database`, for example `jdbc:postgresql://localhost:5432/shop`. The driver found on the class path handles the URL. The user name and password must not be written in the source code. Read them from environment variables or a secret store. Because a connection is an expensive resource, you must close it, and in real applications you use a connection pool through a `DataSource` instead of opening one for each operation.",
    detail: [
      "`getConnection` throws `SQLException`, which is a checked exception.",
      "Extra settings, such as SSL, can be added to the URL or passed as `Properties`.",
      "`DriverManager` is simple and fine for small programs and tests.",
    ],
    ex: "A command-line tool reads `DB_URL`, `DB_USER` and `DB_PASSWORD` from the environment and connects.",
    code: [
      "Connecting and closing",
      "String url = System.getenv(\"DB_URL\");   // jdbc:postgresql://localhost:5432/shop\nString user = System.getenv(\"DB_USER\");\nString password = System.getenv(\"DB_PASSWORD\");\n\ntry (Connection con = DriverManager.getConnection(url, user, password)) {\n  System.out.println(\"Connected: \" + !con.isClosed());\n} catch (SQLException e) {\n  System.err.println(\"Could not connect: \" + e.getMessage());\n}",
      [
        "The settings come from the environment, not from the code.",
        "try-with-resources closes the connection even when an exception occurs.",
        "`SQLException` is handled because it is checked.",
      ],
      "java",
    ],
    mistakes: [
      "Putting the database password in the source code.",
      "Opening a new connection for every query in a server application.",
    ],
    follow: ["Why use a connection pool?"],
    points: [
      "jdbc:subprotocol://host:port/db",
      "Close with try-with-resources",
      "Credentials from the environment",
    ],
    notes: "`DriverManager.getConnection(url, user, pass)` in try-with-resources; use a pool in servers.",
    src: [
      ["The Java Tutorials: Establishing a Connection", `${T}/connecting.html`],
      ["Java SE API: DriverManager", `${API}/java/sql/DriverManager.html`],
    ],
  }),
  g({
    slug: "datasource-vs-drivermanager",
    topic: "Connections",
    d: "medium",
    title: "What is the difference between `DriverManager` and `DataSource`?",
    kw: ["DataSource", "DriverManager", "connection pool", "JNDI", "configuration"],
    intent: "Checks that you know the preferred way to obtain connections.",
    short:
      "`DriverManager` is the original, simple facility: your code passes the URL and credentials and receives a new physical connection. `DataSource`, from `javax.sql`, is the preferred way. It is an object that represents the database and produces connections, and the connection details are configured in one place, outside the business code. A `DataSource` can be backed by a connection pool, so `getConnection()` returns a pooled connection quickly, and the code stays unchanged when the configuration or the pool library changes. Frameworks such as Spring Boot create the `DataSource` for you.",
    detail: [
      "The business code asks for a `DataSource` bean, and does not know the URL or the password.",
      "In application servers, a `DataSource` is often looked up by name through JNDI.",
      "With a pool, calling `close()` on the connection returns it to the pool and does not close the physical connection.",
    ],
    ex: "A service receives a `DataSource` through its constructor, and tests give it an in-memory database.",
    mistakes: [
      "Hard-coding `DriverManager` calls throughout the data access code.",
      "Thinking that `close()` always closes the network connection.",
    ],
    follow: ["What does close() do on a pooled connection?"],
    points: [
      "DataSource: configured once, can be pooled",
      "DriverManager: simple, new connection each time",
      "Prefer DataSource",
    ],
    notes: "Prefer `DataSource` (pooled, configured outside the code) over `DriverManager`.",
    src: [
      ["The Java Tutorials: Connecting with DataSource Objects", `${T}/connecting.html`],
      ["Java SE API: DataSource", `${API}/javax/sql/DataSource.html`],
    ],
  }),
  g({
    slug: "connection-pooling",
    topic: "Pooling",
    d: "medium",
    title: "What is connection pooling and why is it important?",
    kw: ["connection pool", "HikariCP", "maximumPoolSize", "idle connections", "leak"],
    intent: "Checks that you know why servers do not open a connection per request.",
    short:
      "Opening a database connection is slow: it needs a network connection, authentication and session set-up. A connection pool keeps a number of open connections ready, hands one to a thread that asks for it, and takes it back when the thread closes it. This makes requests faster and also limits the load on the database, because the pool has a maximum size, and extra requests wait for a free connection. HikariCP is the default pool in Spring Boot. Important settings are the maximum pool size, the time to wait for a connection, and the connection lifetime.",
    detail: [
      "A pool that is too large can overload the database, and one that is too small makes requests wait.",
      "A connection that is not closed is never returned, so the pool runs dry. This is a connection leak.",
      "Pool metrics, such as active and waiting counts, show problems early.",
    ],
    ex: "A service with a pool of 10 connections handles hundreds of requests per second, because each query holds a connection only for a few milliseconds.",
    code: [
      "Spring Boot pool settings",
      "spring.datasource.url=jdbc:postgresql://db:5432/shop\nspring.datasource.hikari.maximum-pool-size=10\nspring.datasource.hikari.connection-timeout=3000\nspring.datasource.hikari.max-lifetime=1800000",
      [
        "At most 10 connections are open at once.",
        "A thread waits at most 3 seconds for a connection, then gets an error.",
        "A connection is replaced after 30 minutes, so that stale connections do not build up.",
      ],
      "properties",
    ],
    mistakes: [
      "Setting a very large pool because \"more is faster\".",
      "Holding a connection while doing slow work, such as calling a remote service.",
    ],
    follow: ["What is a connection leak?"],
    points: [
      "Reuses open connections",
      "Limits load on the database",
      "Leaks exhaust the pool",
    ],
    notes: "Pool = reuse and limit connections. Always close; keep the pool size modest.",
    src: [
      ["Spring Boot Reference: Connection to a Production Database", `${SB}/data/sql.html`],
      ["The Java Tutorials: Connecting with DataSource Objects", `${T}/connecting.html`],
    ],
  }),
  g({
    slug: "pool-sizing-and-timeouts",
    topic: "Pooling",
    d: "hard",
    title: "How do you decide the size of a connection pool, and what happens when it is exhausted?",
    kw: ["pool size", "connection timeout", "pool exhaustion", "SQLTransientConnectionException", "throughput"],
    intent: "Checks that you can reason about the pool as a limit on concurrency.",
    short:
      "The pool size is the number of queries that can run at the same time. The database can usefully run only as many as its CPU cores and disks allow, so a small pool is often faster than a large one, and the sum of the pools of all application instances must stay below the database's own connection limit. Start with a modest number, measure the waiting time and the database load, and adjust. When the pool is exhausted, new requests wait until the connection timeout, then fail with an exception. The usual causes are leaks, slow queries and long transactions, and raising the size only hides them.",
    detail: [
      "Pool size times the number of instances must not exceed the database's maximum connections.",
      "Keep transactions short, and do not call external services inside them.",
      "Alert on pool wait time and on the number of active connections.",
    ],
    ex: "Five application instances with a pool of 20 each need 100 database connections, and the database allows only 100 in total, so the pool size should be lowered.",
    mistakes: [
      "Increasing the pool size every time that timeouts appear.",
      "Forgetting that every instance has its own pool.",
    ],
    follow: ["What are the causes of pool exhaustion?"],
    points: [
      "Pool size limits concurrent queries",
      "Total across instances must fit the database",
      "Fix leaks and slow queries first",
    ],
    notes: "Small pool, measured. Total of all pools < database limit. Exhaustion = leak or slow queries.",
    src: [
      ["Spring Boot Reference: Connection to a Production Database", `${SB}/data/sql.html`],
      ["Java SE API: DataSource", `${API}/javax/sql/DataSource.html`],
    ],
  }),
  g({
    slug: "statement-vs-preparedstatement",
    topic: "PreparedStatement",
    d: "easy",
    title: "What is the difference between `Statement` and `PreparedStatement`?",
    kw: ["Statement", "PreparedStatement", "SQL injection", "parameters", "precompiled"],
    intent: "Checks the most important JDBC security rule.",
    short:
      "A `Statement` executes a SQL string that you build yourself, so joining user input into it can allow SQL injection. A `PreparedStatement` takes SQL with `?` placeholders, and you set the values with methods such as `setString` and `setInt`. The values are sent as data, not as part of the SQL text, so they cannot change the structure of the query, which prevents injection. The database can also reuse the parsed statement, which can improve performance for repeated queries. For any query with input from outside, use `PreparedStatement`.",
    detail: [
      "Placeholders can be used for values, but not for table or column names.",
      "Parameter indexes start at 1, not at 0.",
      "`CallableStatement` is the sub-interface for stored procedures.",
    ],
    ex: "A login query uses `WHERE email = ?`, and the entered text is passed as a parameter.",
    code: [
      "Unsafe and safe",
      "String email = request.getParameter(\"email\");\n\n// unsafe: input becomes part of the SQL\nstmt.executeQuery(\"SELECT * FROM users WHERE email = '\" + email + \"'\");\n\n// safe: input is a parameter\ntry (PreparedStatement ps = con.prepareStatement(\"SELECT id, name FROM users WHERE email = ?\")) {\n  ps.setString(1, email);\n  try (ResultSet rs = ps.executeQuery()) {\n    while (rs.next()) {\n      System.out.println(rs.getString(\"name\"));\n    }\n  }\n}",
      [
        "The first query is vulnerable if `email` contains SQL.",
        "In the second, `?` is a placeholder and the value is bound with `setString(1, ...)`.",
        "The `ResultSet` is also closed with try-with-resources.",
      ],
      "java",
    ],
    mistakes: [
      "Building SQL with string concatenation or `String.format`.",
      "Using `setString(0, ...)`, because the first parameter is 1.",
    ],
    follow: ["Can a placeholder be used for a column name?"],
    points: [
      "Placeholders prevent SQL injection",
      "Indexes start at 1",
      "Values only, not identifiers",
    ],
    notes: "Always use `PreparedStatement` with `?` for external input.",
    src: [
      ["The Java Tutorials: Using Prepared Statements", `${T}/prepared.html`],
      ["Java SE API: PreparedStatement", `${API}/java/sql/PreparedStatement.html`],
    ],
  }),
  g({
    slug: "sql-injection-prevention",
    topic: "PreparedStatement",
    d: "medium",
    title: "What is SQL injection and how do you prevent it in Java?",
    kw: ["SQL injection", "parameterised query", "input validation", "least privilege", "dynamic SQL"],
    intent: "Checks that you know the attack, the main defence and the extra layers.",
    short:
      "SQL injection happens when input from a user is joined into a SQL string, so the input can change the meaning of the query, for example `' OR '1'='1`, and read, change or delete data. The main defence is to use parameterised queries, with `PreparedStatement` or an ORM that does so, and never to build SQL by concatenation. Extra layers are validating input types and lengths, giving the database user only the permissions that it needs, and not showing database error messages to users. When a column name or sort order must be dynamic, choose it from a fixed allowed list in code.",
    detail: [
      "Escaping by hand is error-prone and should not be the main defence.",
      "ORMs are safe when you use their parameter binding, but a query built by string concatenation in HQL or native SQL is as vulnerable as plain JDBC.",
      "Stored procedures are safe only if they do not build dynamic SQL from the parameters.",
    ],
    ex: "A sort parameter is checked against `name` and `price` before it is added to the `ORDER BY` clause.",
    code: [
      "A dynamic column from an allow list",
      "private static final Set<String> SORTABLE = Set.of(\"name\", \"price\");\n\nString sortBy = SORTABLE.contains(requested) ? requested : \"name\";\nString sql = \"SELECT id, name, price FROM products WHERE category = ? ORDER BY \" + sortBy;\n\ntry (PreparedStatement ps = con.prepareStatement(sql)) {\n  ps.setString(1, category);\n  // execute\n}",
      [
        "The value `category` is a parameter.",
        "The column name cannot be a parameter, so it comes from a fixed list in the code.",
        "Input can never become SQL text.",
      ],
      "java",
    ],
    mistakes: [
      "Concatenating a sort column from the request.",
      "Showing the raw `SQLException` message to the user.",
    ],
    follow: ["Is an ORM automatically safe?"],
    points: [
      "Parameterised queries",
      "Allow-list for identifiers",
      "Least privilege and no error leaks",
    ],
    notes: "Parameterise values, allow-list identifiers, least-privilege database user.",
    src: [
      ["The Java Tutorials: Using Prepared Statements", `${T}/prepared.html`],
      ["Java SE API: PreparedStatement", `${API}/java/sql/PreparedStatement.html`],
    ],
  }),
  g({
    slug: "executequery-vs-executeupdate",
    topic: "PreparedStatement",
    d: "easy",
    title: "What is the difference between `executeQuery`, `executeUpdate` and `execute`?",
    kw: ["executeQuery", "executeUpdate", "execute", "ResultSet", "update count"],
    intent: "Checks that you call the right method for each kind of SQL.",
    short:
      "`executeQuery` runs a statement that returns rows, normally a `SELECT`, and returns a `ResultSet`. `executeUpdate` runs `INSERT`, `UPDATE`, `DELETE` and DDL statements and returns an `int`, the number of rows affected, or 0 for statements that return nothing. `execute` is the general method for unknown or multiple results: it returns `true` if the first result is a `ResultSet`, and then you use `getResultSet` or `getUpdateCount`. Calling the wrong method for the statement, such as `executeQuery` with an `UPDATE`, throws `SQLException`.",
    detail: [
      "Check the update count: an `UPDATE` that returns 0 means that no row matched.",
      "For large numbers of rows, use batch methods.",
      "`getGeneratedKeys` returns database-generated ids after an insert.",
    ],
    ex: "`int n = ps.executeUpdate()` after a delete shows how many orders were removed.",
    mistakes: [
      "Using `executeQuery` for an `INSERT`.",
      "Ignoring the update count when the row may not exist.",
    ],
    follow: ["How do you get the generated id after an insert?"],
    points: [
      "executeQuery → ResultSet",
      "executeUpdate → row count",
      "execute → general",
    ],
    notes: "`executeQuery` for SELECT, `executeUpdate` for DML/DDL, `execute` when unsure.",
    src: [
      ["The Java Tutorials: Processing SQL Statements with JDBC", `${T}/processingsqlstatements.html`],
      ["Java SE API: Statement", `${API}/java/sql/Statement.html`],
    ],
  }),
  g({
    slug: "resultset-reading",
    topic: "PreparedStatement",
    d: "easy",
    title: "How do you read a `ResultSet`, and how do you handle `NULL` values?",
    kw: ["ResultSet", "next", "getString", "wasNull", "getObject"],
    intent: "Checks that you can read rows safely and know the null trap of primitives.",
    short:
      "A `ResultSet` has a cursor that starts before the first row. `next()` moves it to the next row and returns `false` when there are no more, so you read in a `while (rs.next())` loop. You read columns by name, such as `rs.getString(\"name\")`, or by index starting at 1. The getters for primitives, such as `getInt` and `getDouble`, return `0` for an SQL `NULL`, which hides the difference. Call `rs.wasNull()` right after reading the value, or use `getObject(\"col\", Integer.class)`, which returns `null` for `NULL`.",
    detail: [
      "A `ResultSet` is closed when its statement is closed or re-executed.",
      "Read columns by name for clarity, because index positions change when the query changes.",
      "Large results should be streamed with a fetch size, and not loaded into a list all at once.",
    ],
    ex: "A nullable `discount` column is read with `getObject(\"discount\", BigDecimal.class)`, so that a missing value stays `null`.",
    code: [
      "Reading rows and nulls",
      "try (PreparedStatement ps = con.prepareStatement(\"SELECT id, name, discount FROM products\");\n     ResultSet rs = ps.executeQuery()) {\n  while (rs.next()) {\n    long id = rs.getLong(\"id\");\n    String name = rs.getString(\"name\");\n    BigDecimal discount = rs.getObject(\"discount\", BigDecimal.class); // null stays null\n    System.out.println(id + \" \" + name + \" \" + discount);\n  }\n}",
      [
        "The cursor starts before the first row, and `next()` moves it.",
        "Columns are read by name.",
        "`getObject` with a class keeps an SQL `NULL` as `null`.",
      ],
      "java",
    ],
    mistakes: [
      "Using `getInt` and treating `0` as a real value when the column was `NULL`.",
      "Loading a very large result into memory.",
    ],
    follow: ["What does wasNull do?"],
    points: [
      "while (rs.next())",
      "Index from 1, prefer names",
      "Primitive getters return 0 for NULL",
    ],
    notes: "`while (rs.next())`; use `getObject(col, Type.class)` or `wasNull()` for nullable columns.",
    src: [
      ["The Java Tutorials: Retrieving Values from Result Sets", `${T}/retrieving.html`],
      ["Java SE API: ResultSet", `${API}/java/sql/ResultSet.html`],
    ],
  }),
  g({
    slug: "jdbc-batch-and-generated-keys",
    topic: "PreparedStatement",
    d: "medium",
    title: "How do you insert many rows efficiently and get the generated keys?",
    kw: ["addBatch", "executeBatch", "getGeneratedKeys", "RETURN_GENERATED_KEYS", "batch insert"],
    intent: "Checks that you reduce round trips and read database-generated ids.",
    short:
      "Instead of running one `executeUpdate` per row, add each set of parameters with `addBatch()` and send them together with `executeBatch()`, which reduces network round trips and is usually much faster. Combine it with a transaction, so that all rows are inserted or none are. To get an id that the database generates, prepare the statement with `Statement.RETURN_GENERATED_KEYS` and read `getGeneratedKeys()` after the execution. For very large loads, send the batch in chunks, for example every 500 rows.",
    detail: [
      "`executeBatch` returns an array of update counts, one per statement.",
      "If one statement in the batch fails, a `BatchUpdateException` is thrown.",
      "Some drivers need a setting to turn a batch into one multi-row statement.",
    ],
    ex: "Importing 10,000 products sends them in batches of 500 inside one transaction.",
    code: [
      "A batch insert",
      "con.setAutoCommit(false);\ntry (PreparedStatement ps = con.prepareStatement(\n        \"INSERT INTO products(name, price) VALUES (?, ?)\", Statement.RETURN_GENERATED_KEYS)) {\n  for (Product p : products) {\n    ps.setString(1, p.name());\n    ps.setBigDecimal(2, p.price());\n    ps.addBatch();\n  }\n  ps.executeBatch();\n  try (ResultSet keys = ps.getGeneratedKeys()) {\n    while (keys.next()) {\n      System.out.println(\"new id \" + keys.getLong(1));\n    }\n  }\n  con.commit();\n} catch (SQLException e) {\n  con.rollback();\n  throw e;\n}",
      [
        "Each loop pass adds one parameter set to the batch.",
        "`executeBatch` sends them together.",
        "The generated ids are read, and the whole import is committed or rolled back.",
      ],
      "java",
    ],
    mistakes: [
      "Running thousands of single inserts with a commit after each one.",
      "Building one huge batch that uses too much memory.",
    ],
    follow: ["What happens if one row in the batch fails?"],
    points: [
      "addBatch + executeBatch",
      "RETURN_GENERATED_KEYS",
      "Batch inside a transaction, in chunks",
    ],
    notes: "`addBatch()`/`executeBatch()` in a transaction; `RETURN_GENERATED_KEYS` for new ids.",
    src: [
      ["The Java Tutorials: Using Prepared Statements (batch)", `${T}/prepared.html`],
      ["Java SE API: PreparedStatement", `${API}/java/sql/PreparedStatement.html`],
    ],
  }),
  g({
    slug: "jdbc-transactions",
    topic: "Transactions",
    d: "medium",
    title: "How do transactions work in JDBC? (`setAutoCommit`, `commit`, `rollback`)",
    kw: ["setAutoCommit", "commit", "rollback", "transaction", "atomicity"],
    intent: "Checks that you can make several statements succeed or fail together.",
    short:
      "By default, a JDBC connection is in auto-commit mode: each statement is its own transaction and is committed at once. To group statements, call `con.setAutoCommit(false)`, run them, and then `con.commit()` to make all of them permanent. If anything fails, call `con.rollback()` to undo everything since the last commit. This gives atomicity: for example, a money transfer that debits one account and credits another must do both or neither. Restore auto-commit, or return the connection to the pool in a clean state, when you finish.",
    detail: [
      "A transaction should be short, because it holds locks and a pooled connection.",
      "Catch the exception, roll back, and rethrow, so the caller knows that it failed.",
      "Frameworks such as Spring manage these calls for you with `@Transactional`.",
    ],
    ex: "A transfer subtracts from account A and adds to account B in one transaction.",
    code: [
      "An all-or-nothing transfer",
      "con.setAutoCommit(false);\ntry (PreparedStatement debit = con.prepareStatement(\"UPDATE accounts SET balance = balance - ? WHERE id = ?\");\n     PreparedStatement credit = con.prepareStatement(\"UPDATE accounts SET balance = balance + ? WHERE id = ?\")) {\n  debit.setBigDecimal(1, amount);\n  debit.setLong(2, fromId);\n  debit.executeUpdate();\n\n  credit.setBigDecimal(1, amount);\n  credit.setLong(2, toId);\n  credit.executeUpdate();\n\n  con.commit();\n} catch (SQLException e) {\n  con.rollback();\n  throw e;\n} finally {\n  con.setAutoCommit(true);\n}",
      [
        "Auto-commit is off, so nothing is permanent until `commit()`.",
        "If the second update fails, `rollback()` undoes the first.",
        "`finally` restores auto-commit before the connection goes back to the pool.",
      ],
      "java",
    ],
    mistakes: [
      "Leaving auto-commit on and expecting a rollback to work.",
      "Forgetting to roll back after an exception, which leaves locks held.",
    ],
    follow: ["What is ACID?"],
    points: [
      "Auto-commit is the default",
      "setAutoCommit(false), commit, rollback",
      "Keep transactions short",
    ],
    notes: "`setAutoCommit(false)` → statements → `commit()`; `rollback()` on failure.",
    src: [
      ["The Java Tutorials: Using Transactions", `${T}/transactions.html`],
      ["Java SE API: Connection", `${API}/java/sql/Connection.html`],
    ],
  }),
  g({
    slug: "isolation-levels-jdbc",
    topic: "Transactions",
    d: "hard",
    title: "What are transaction isolation levels and what problems do they prevent?",
    kw: ["isolation level", "dirty read", "non-repeatable read", "phantom read", "setTransactionIsolation"],
    intent: "Checks that you know the read anomalies and the trade-off with concurrency.",
    short:
      "The isolation level controls how much concurrent transactions can see of each other's changes. JDBC defines four: `READ_UNCOMMITTED`, which allows dirty reads of uncommitted data; `READ_COMMITTED`, which prevents dirty reads; `REPEATABLE_READ`, which also prevents a row from changing between two reads in the same transaction; and `SERIALIZABLE`, which also prevents phantom rows, new rows that match an earlier query, and behaves as if the transactions ran one after another. Higher levels give more safety but more locking or retries and lower throughput. You set the level with `con.setTransactionIsolation(...)`, and the default depends on the database.",
    detail: [
      "Not every database supports every level in the same way, so check the documentation of yours.",
      "Many databases use `READ_COMMITTED` as the default.",
      "Choose the lowest level that your rules need, and use explicit locking for special cases.",
    ],
    ex: "A report that must see a consistent snapshot of the data uses a higher level than a simple read of a product list.",
    mistakes: [
      "Using `SERIALIZABLE` everywhere for safety and then hitting contention.",
      "Assuming that all databases implement a level in the same way.",
    ],
    follow: ["What is a phantom read?"],
    points: [
      "Four levels, four constants",
      "Dirty, non-repeatable and phantom reads",
      "Higher level = safer, slower",
    ],
    notes: "READ_UNCOMMITTED < READ_COMMITTED < REPEATABLE_READ < SERIALIZABLE.",
    src: [
      ["The Java Tutorials: Using Transactions (isolation)", `${T}/transactions.html`],
      ["Java SE API: Connection (transaction isolation)", `${API}/java/sql/Connection.html`],
    ],
  }),
  g({
    slug: "savepoints",
    topic: "Transactions",
    d: "hard",
    title: "What is a savepoint in JDBC?",
    kw: ["Savepoint", "setSavepoint", "rollback to savepoint", "partial rollback", "releaseSavepoint"],
    intent: "Checks that you know how to undo part of a transaction.",
    short:
      "A savepoint is a marker inside a transaction that you create with `con.setSavepoint()`. Later, `con.rollback(savepoint)` undoes only the work done after that marker, and the earlier work remains part of the transaction, which you can then still commit. `releaseSavepoint` removes the marker. It is useful when one step of a larger job may fail, and you want to skip it or try another path without losing everything done before.",
    detail: [
      "A savepoint is valid only inside the transaction in which it was created.",
      "Support depends on the database and the driver. Check `DatabaseMetaData.supportsSavepoints()`.",
      "Nested transaction handling in frameworks is often built on savepoints.",
    ],
    ex: "An import inserts a customer, and if the optional address insert fails, it rolls back to the savepoint and keeps the customer.",
    code: [
      "Rolling back part of a transaction",
      "con.setAutoCommit(false);\ninsertCustomer(con, customer);\nSavepoint beforeAddress = con.setSavepoint();\ntry {\n  insertAddress(con, address);\n} catch (SQLException e) {\n  con.rollback(beforeAddress);   // only the address insert is undone\n}\ncon.commit();",
      [
        "The customer insert is part of the transaction.",
        "The savepoint marks the point before the address insert.",
        "On failure, only the address work is undone, and the commit keeps the customer.",
      ],
      "java",
    ],
    mistakes: [
      "Using a savepoint after the transaction has ended.",
      "Assuming that every driver supports savepoints.",
    ],
    follow: ["How can you check whether a database supports savepoints?"],
    points: [
      "Marker inside a transaction",
      "rollback(savepoint) is a partial rollback",
      "Driver support varies",
    ],
    notes: "`setSavepoint()` / `rollback(savepoint)` undoes only the work after the marker.",
    src: [
      ["The Java Tutorials: Using Savepoints", `${T}/transactions.html`],
      ["Java SE API: Savepoint", `${API}/java/sql/Savepoint.html`],
    ],
  }),
  g({
    slug: "sqlexception-handling",
    topic: "Transactions",
    d: "medium",
    title: "How do you handle `SQLException` properly?",
    kw: ["SQLException", "SQLState", "error code", "getNextException", "constraint violation"],
    intent: "Checks that you can read the error information and avoid hiding failures.",
    short:
      "`SQLException` is a checked exception and carries three useful pieces of information: a message, an `SQLState` code, a standard five-character code that identifies the kind of error, and a vendor-specific error code. You can read `getSQLState()` to tell, for example, a constraint violation from a connection failure. Some drivers also chain further problems, which you reach with `getNextException()`. Do not swallow the exception. Roll back the transaction if needed, log it with the stack trace, and rethrow it, or wrap it in an exception of your own with the original as the cause. Never show raw SQL errors to users.",
    detail: [
      "Subclasses such as `SQLIntegrityConstraintViolationException` and `SQLTransientException` give more detail in newer drivers.",
      "A transient error, such as a deadlock or a lost connection, may be worth a retry. A constraint error is not.",
      "Spring converts these exceptions into its `DataAccessException` hierarchy.",
    ],
    ex: "A duplicate email gives a constraint violation, and the code shows \"This email is already registered\".",
    code: [
      "Reading the error",
      "try {\n  insertUser(con, user);\n} catch (SQLException e) {\n  if (e instanceof SQLIntegrityConstraintViolationException) {\n    throw new DuplicateUserException(user.email(), e);\n  }\n  log.error(\"SQL state {} code {}\", e.getSQLState(), e.getErrorCode(), e);\n  throw new DataAccessFailure(\"Could not save user\", e);\n}",
      [
        "A constraint violation becomes a meaningful domain exception.",
        "Other errors are logged with the state, the code and the stack trace.",
        "The original exception is kept as the cause.",
      ],
      "java",
    ],
    mistakes: [
      "An empty catch block.",
      "Retrying an error that cannot succeed, such as a constraint violation.",
    ],
    follow: ["Which errors are worth retrying?"],
    points: [
      "Message, SQLState, vendor code",
      "Translate to domain exceptions",
      "Log and keep the cause",
    ],
    notes: "Read `getSQLState()`; translate constraint errors; log with the cause; never show raw SQL errors.",
    src: [
      ["The Java Tutorials: Handling SQL Exceptions", `${T}/sqlexception.html`],
      ["Java SE API: SQLException", `${API}/java/sql/SQLException.html`],
    ],
  }),
  g({
    slug: "resource-closing-jdbc",
    topic: "Connections",
    d: "easy",
    title: "In what order should you close JDBC resources, and how does try-with-resources help?",
    kw: ["close", "try-with-resources", "ResultSet", "Statement", "resource leak"],
    intent: "Checks that you do not leak connections or cursors.",
    short:
      "`Connection`, `Statement`, `PreparedStatement` and `ResultSet` all implement `AutoCloseable`. They should be closed in the reverse order of their creation: the result set first, then the statement, then the connection. Closing a statement also closes its result sets, and closing a connection closes its statements, but closing each one explicitly is the safe habit. With try-with-resources, all of this is done for you, in the right order, even when an exception occurs, which prevents connection leaks. With a pool, `close()` returns the connection to the pool.",
    detail: [
      "A leaked connection is never returned to the pool, and eventually every request waits.",
      "Do not return a `ResultSet` from a method after closing its connection. Copy the data into objects first.",
      "A manual `finally` with null checks is error-prone and is replaced by try-with-resources.",
    ],
    ex: "A repository method opens the connection, statement and result set in one try header and returns a list of DTOs.",
    code: [
      "All three in one header",
      "List<String> names = new ArrayList<>();\ntry (Connection con = dataSource.getConnection();\n     PreparedStatement ps = con.prepareStatement(\"SELECT name FROM products WHERE price < ?\")) {\n  ps.setBigDecimal(1, limit);\n  try (ResultSet rs = ps.executeQuery()) {\n    while (rs.next()) {\n      names.add(rs.getString(1));\n    }\n  }\n}\nreturn names;",
      [
        "The resources are closed in reverse order: result set, statement, connection.",
        "The data is copied into a list before the connection closes.",
      ],
      "java",
    ],
    mistakes: [
      "Closing only the connection and trusting the rest to be cleaned up.",
      "Returning a `ResultSet` that belongs to a closed connection.",
    ],
    follow: ["What does close() do on a pooled connection?"],
    points: [
      "Reverse order of creation",
      "try-with-resources does it",
      "Copy data out before closing",
    ],
    notes: "Use try-with-resources: closes result set, statement, connection in order; no leaks.",
    src: [
      ["The Java Tutorials: Closing Connections", `${T}/connecting.html`],
      ["Java SE API: Connection", `${API}/java/sql/Connection.html`],
    ],
  }),
  g({
    slug: "dao-pattern",
    topic: "Connections",
    d: "medium",
    title: "What is the DAO pattern, and how does it organise JDBC code?",
    kw: ["DAO", "repository", "data access", "separation of concerns", "interface"],
    intent: "Checks that you keep SQL out of the business logic.",
    short:
      "A Data Access Object is a class that hides all the database access for one kind of data behind an interface, with methods such as `findById`, `save` and `delete`. The business logic works with objects and these methods, and it does not contain any SQL or JDBC code. The SQL lives in one place and the rest of the application does not depend on the database technology, so the implementation can be changed, or replaced by a fake in tests. The Repository in Spring is a similar idea.",
    detail: [
      "The DAO maps rows to objects and objects to parameters.",
      "Transactions are usually managed by the service layer that calls several DAOs, not by each DAO.",
      "A DAO should throw your own exceptions, not leak `SQLException` to the whole application.",
    ],
    ex: "`ProductDao` has a JDBC implementation for production and an in-memory implementation for tests.",
    code: [
      "An interface and a JDBC implementation",
      "interface ProductDao {\n  Optional<Product> findById(long id);\n}\n\nclass JdbcProductDao implements ProductDao {\n  private final DataSource dataSource;\n  JdbcProductDao(DataSource dataSource) { this.dataSource = dataSource; }\n\n  public Optional<Product> findById(long id) {\n    String sql = \"SELECT id, name, price FROM products WHERE id = ?\";\n    try (Connection con = dataSource.getConnection();\n         PreparedStatement ps = con.prepareStatement(sql)) {\n      ps.setLong(1, id);\n      try (ResultSet rs = ps.executeQuery()) {\n        return rs.next()\n            ? Optional.of(new Product(rs.getLong(1), rs.getString(2), rs.getBigDecimal(3)))\n            : Optional.empty();\n      }\n    } catch (SQLException e) {\n      throw new DataAccessFailure(\"Could not load product \" + id, e);\n    }\n  }\n}",
      [
        "The interface hides the technology.",
        "The JDBC class contains all the SQL and the mapping.",
        "A `SQLException` is converted to an application exception.",
      ],
      "java",
    ],
    mistakes: [
      "Writing SQL in controllers or services.",
      "Returning `ResultSet` objects out of the DAO.",
    ],
    follow: ["How is a DAO different from a Repository?"],
    points: [
      "Interface for data access",
      "SQL in one place",
      "Replaceable and testable",
    ],
    notes: "DAO = interface + implementation that holds all the SQL for one entity.",
    src: [
      ["The Java Tutorials: JDBC Basics", `${T}/index.html`],
      ["Spring Framework Reference: Data Access with JDBC", "https://docs.spring.io/spring-framework/reference/data-access/jdbc.html"],
    ],
  }),
  g({
    slug: "jdbctemplate",
    topic: "Connections",
    d: "medium",
    title: "What does Spring's `JdbcTemplate` do for you?",
    kw: ["JdbcTemplate", "RowMapper", "queryForObject", "DataAccessException", "boilerplate"],
    intent: "Checks that you know what is removed from raw JDBC.",
    short:
      "`JdbcTemplate` removes the repeated JDBC work: it gets and releases the connection, creates and closes statements and result sets, handles the transaction binding, and converts `SQLException` into Spring's unchecked `DataAccessException` hierarchy. You supply only the SQL, the parameters and, for queries, a `RowMapper` that turns each row into an object. It still uses `?` placeholders, so it is safe against injection when you use them. It is a good middle way between raw JDBC and a full ORM, for simple SQL-centred code.",
    detail: [
      "`NamedParameterJdbcTemplate` allows named parameters such as `:id` instead of `?`.",
      "`query`, `queryForObject`, `update` and `batchUpdate` cover most needs.",
      "`queryForObject` throws `EmptyResultDataAccessException` if there is no row.",
    ],
    ex: "A repository calls `jdbcTemplate.query(sql, mapper, category)` and gets a list of products, with no `try` blocks.",
    code: [
      "A query with a RowMapper",
      "@Repository\nclass ProductRepository {\n  private final JdbcTemplate jdbc;\n  ProductRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }\n\n  List<Product> byCategory(String category) {\n    return jdbc.query(\n        \"SELECT id, name, price FROM products WHERE category = ?\",\n        (rs, rowNum) -> new Product(rs.getLong(\"id\"), rs.getString(\"name\"), rs.getBigDecimal(\"price\")),\n        category);\n  }\n\n  int rename(long id, String name) {\n    return jdbc.update(\"UPDATE products SET name = ? WHERE id = ?\", name, id);\n  }\n}",
      [
        "No connection or statement is handled by hand.",
        "The lambda is a `RowMapper` that converts a row into a `Product`.",
        "`update` returns the number of rows changed.",
      ],
      "java",
    ],
    mistakes: [
      "Building SQL with string concatenation inside `JdbcTemplate`.",
      "Using `queryForObject` without handling a missing row.",
    ],
    follow: ["How does it handle exceptions?"],
    points: [
      "Handles connections, statements, cleanup",
      "RowMapper maps rows",
      "SQLException → DataAccessException",
    ],
    notes: "`JdbcTemplate`: no boilerplate; you give SQL, parameters and a `RowMapper`.",
    src: [
      ["Spring Framework Reference: Data Access with JDBC", "https://docs.spring.io/spring-framework/reference/data-access/jdbc.html"],
      ["Spring Boot Reference: SQL Databases", `${SB}/data/sql.html`],
    ],
  }),
  g({
    slug: "jdbc-vs-orm",
    topic: "Connections",
    d: "medium",
    title: "When would you use plain JDBC or `JdbcTemplate`, and when an ORM such as JPA?",
    kw: ["JDBC vs JPA", "ORM", "object-relational mapping", "native SQL", "reporting"],
    intent: "Checks that you choose by the problem and not by habit.",
    short:
      "An ORM such as JPA with Hibernate maps tables to objects, generates the SQL for common operations, tracks changes to objects and manages relations, which saves a lot of code for typical create, read, update and delete work on a domain model. Plain JDBC or `JdbcTemplate` gives full control of the SQL, with no hidden queries and no session state, which suits reporting, bulk operations, complex joins and performance-critical queries. Many applications use both: JPA for the domain model and SQL for reports.",
    detail: [
      "An ORM can hide problems such as N+1 queries, so the generated SQL must be watched.",
      "JDBC needs more code and mapping, but it is simple and predictable.",
      "Both can take part in the same Spring transaction, using the same `DataSource`.",
    ],
    ex: "An order system uses JPA entities for orders, and `JdbcTemplate` for a monthly sales report that joins many tables.",
    mistakes: [
      "Using an ORM for a big report and loading millions of entities.",
      "Writing JDBC mapping code for a simple CRUD model with many relations.",
    ],
    follow: ["Can you mix JPA and JdbcTemplate in one transaction?"],
    points: [
      "ORM: productivity for domain models",
      "JDBC: control and predictable SQL",
      "Mixing is normal",
    ],
    notes: "JPA for domain CRUD; JDBC/`JdbcTemplate` for reports, bulk work and tuned SQL.",
    src: [
      ["Spring Framework Reference: Data Access with JDBC", "https://docs.spring.io/spring-framework/reference/data-access/jdbc.html"],
      ["Spring Boot Reference: SQL Databases", `${SB}/data/sql.html`],
    ],
  }),
  g({
    slug: "callablestatement-stored-procedures",
    topic: "PreparedStatement",
    d: "medium",
    title: "How do you call a stored procedure from JDBC?",
    kw: ["CallableStatement", "prepareCall", "registerOutParameter", "stored procedure", "IN OUT"],
    intent: "Checks that you know the interface for stored procedures and functions.",
    short:
      "A `CallableStatement` is created with `con.prepareCall(\"{call procedure_name(?, ?)}\")`, using the standard JDBC call syntax. You set input parameters with the same `setXxx` methods as for a prepared statement, and register output parameters with `registerOutParameter(index, type)`. After `execute()`, you read the outputs with `getXxx`. The `{call ...}` escape syntax is translated by the driver into the form that the database needs, so the code is portable across drivers.",
    detail: [
      "A function call that returns a value uses the form `{? = call function_name(?)}`.",
      "A procedure can also return result sets, which you read as usual.",
      "Business logic in procedures is harder to test and version, so use them where the database really needs it.",
    ],
    ex: "A procedure `apply_discount(order_id, percent)` is called from Java and returns the new total.",
    code: [
      "An IN and an OUT parameter",
      "try (CallableStatement cs = con.prepareCall(\"{call apply_discount(?, ?, ?)}\")) {\n  cs.setLong(1, orderId);\n  cs.setInt(2, 10);\n  cs.registerOutParameter(3, Types.NUMERIC);\n  cs.execute();\n  BigDecimal newTotal = cs.getBigDecimal(3);\n  System.out.println(newTotal);\n}",
      [
        "The first two parameters are inputs.",
        "The third is registered as an output of type `NUMERIC`.",
        "After `execute()`, its value is read with `getBigDecimal(3)`.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting to register the output parameter.",
      "Building the call string from user input.",
    ],
    follow: ["How do you call a function that returns a value?"],
    points: [
      "prepareCall with {call ...}",
      "registerOutParameter for outputs",
      "Same setXxx for inputs",
    ],
    notes: "`con.prepareCall(\"{call proc(?, ?)}\")`, `registerOutParameter`, then `execute()`.",
    src: [
      ["The Java Tutorials: Using Stored Procedures", `${T}/storedprocedures.html`],
      ["Java SE API: CallableStatement", `${API}/java/sql/CallableStatement.html`],
    ],
  }),
  g({
    slug: "metadata-and-types",
    topic: "Connections",
    d: "medium",
    title: "How do JDBC types map to Java types, and what is metadata?",
    kw: ["java.sql.Types", "DatabaseMetaData", "ResultSetMetaData", "LocalDate", "BigDecimal"],
    intent: "Checks that you use the right Java types for money and dates.",
    short:
      "JDBC maps SQL types to Java types: `VARCHAR` to `String`, `INTEGER` to `int`, `BIGINT` to `long`, `DECIMAL` and `NUMERIC` to `BigDecimal`, `BOOLEAN` to `boolean`, `DATE` to `java.sql.Date` or `LocalDate`, and `TIMESTAMP` to `Timestamp` or `LocalDateTime`. Money must be a `DECIMAL` read as `BigDecimal`, never a floating-point type. Modern drivers support `getObject(col, LocalDate.class)`, which is better than the old `java.sql` date classes. Metadata is information about the database: `DatabaseMetaData` describes tables and capabilities, and `ResultSetMetaData` describes the columns of a result.",
    detail: [
      "`double` for money gives rounding errors such as `0.1 + 0.2`.",
      "Time zones are a common source of bugs. Store timestamps in UTC, with the right column type.",
      "Metadata is used by tools and generic code, and rarely by ordinary application code.",
    ],
    ex: "A price column is `NUMERIC(10,2)` and is read as `BigDecimal`, and a created-at column is read as an `Instant`-compatible timestamp.",
    mistakes: [
      "Storing prices in a `double` column.",
      "Mixing time zones between the database and the application.",
    ],
    follow: ["Why is BigDecimal used for money?"],
    points: [
      "DECIMAL → BigDecimal",
      "Use java.time types with modern drivers",
      "Metadata describes the schema and the result",
    ],
    notes: "Money → `DECIMAL`/`BigDecimal`. Dates → `getObject(col, LocalDate.class)`. Metadata describes schema.",
    src: [
      ["The Java Tutorials: Mapping SQL and Java Types", "https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html"],
      ["Java SE API: DatabaseMetaData", `${API}/java/sql/DatabaseMetaData.html`],
    ],
  }),
  g({
    slug: "jdbc-fetch-size-and-streaming",
    topic: "Pooling",
    d: "hard",
    title: "How do you read a very large result without running out of memory?",
    kw: ["fetch size", "setFetchSize", "streaming", "cursor", "pagination"],
    intent: "Checks that you can process big data sets in a controlled way.",
    short:
      "The best option is to avoid loading everything: add filters, and page the data with `LIMIT` and `OFFSET`, or better with a keyset condition such as `WHERE id > ?` on an indexed column. If you must scan a large result, process the rows one at a time inside the `while (rs.next())` loop, without adding them to a list, and set `statement.setFetchSize(n)`, which hints the driver to fetch the rows in blocks of n. Some drivers need other settings, such as turning off auto-commit, before they stream results, so check the documentation of your driver.",
    detail: [
      "The default behaviour of some drivers is to load the whole result into memory.",
      "Long-running scans hold a connection and may hold locks, so run them on a replica or off-peak where possible.",
      "A database export is often better done with the database's own bulk tools.",
    ],
    ex: "A nightly export reads one million orders in blocks of 1,000 and writes each to a file immediately.",
    code: [
      "Process and discard",
      "con.setAutoCommit(false);          // some drivers need this to stream\ntry (PreparedStatement ps = con.prepareStatement(\"SELECT id, total FROM orders WHERE created_at < ?\")) {\n  ps.setFetchSize(1000);\n  ps.setTimestamp(1, cutoff);\n  try (ResultSet rs = ps.executeQuery()) {\n    while (rs.next()) {\n      writer.write(rs.getLong(1) + \",\" + rs.getBigDecimal(2));\n    }\n  }\n}",
      [
        "The fetch size asks the driver for 1,000 rows at a time.",
        "Each row is written out and not kept in memory.",
        "The exact behaviour depends on the driver.",
      ],
      "java",
    ],
    mistakes: [
      "Adding a million rows to a `List` before processing.",
      "Using a large `OFFSET`, which gets slower for every page.",
    ],
    follow: ["Why is keyset paging better than OFFSET?"],
    points: [
      "Filter and page first",
      "Process rows one at a time",
      "setFetchSize, driver-specific",
    ],
    notes: "Page with keyset conditions; stream rows with `setFetchSize`; never collect millions in a list.",
    src: [
      ["Java SE API: Statement.setFetchSize", `${API}/java/sql/Statement.html`],
      ["Java SE API: ResultSet", `${API}/java/sql/ResultSet.html`],
    ],
  }),
  g({
    slug: "optimistic-locking-jdbc",
    topic: "Transactions",
    d: "hard",
    title: "How do you prevent two users from overwriting each other's changes?",
    kw: ["optimistic locking", "version column", "lost update", "SELECT FOR UPDATE", "pessimistic locking"],
    intent: "Checks that you know the lost-update problem and two ways to solve it.",
    short:
      "A lost update happens when two users read the same row, both change it, and the second save silently overwrites the first. With optimistic locking, the row has a version number. A user reads it with the version, and the update has the condition `WHERE id = ? AND version = ?` while it increases the version. If the update count is 0, someone else changed the row first, and the code reports a conflict so that the user can reload. With pessimistic locking, `SELECT ... FOR UPDATE` locks the row inside the transaction, so others wait. Optimistic locking suits mostly-read data with rare conflicts.",
    detail: [
      "Always check the update count, because it is the signal of a conflict.",
      "Pessimistic locks hold resources and can cause deadlocks, so keep the transactions short.",
      "JPA supports both with `@Version` and lock modes.",
    ],
    ex: "Two support agents edit the same ticket, and the second save is rejected with \"The ticket was changed by someone else\".",
    code: [
      "Optimistic update with a version column",
      "int updated = jdbc.update(\n    \"UPDATE tickets SET status = ?, version = version + 1 WHERE id = ? AND version = ?\",\n    newStatus, id, expectedVersion);\n\nif (updated == 0) {\n  throw new ConcurrentUpdateException(\"Ticket \" + id + \" was changed by someone else\");\n}",
      [
        "The update succeeds only if the version is still the one the user read.",
        "A count of 0 means that another change came first.",
        "The user is told to reload, instead of silently overwriting.",
      ],
      "java",
    ],
    mistakes: [
      "Updating by id only and losing another user's change.",
      "Ignoring the update count.",
    ],
    follow: ["When would you use pessimistic locking?"],
    points: [
      "Version column + conditional update",
      "Update count 0 = conflict",
      "FOR UPDATE for pessimistic locking",
    ],
    notes: "Optimistic: `WHERE id=? AND version=?` and check the count. Pessimistic: `SELECT ... FOR UPDATE`.",
    src: [
      ["The Java Tutorials: Using Transactions", `${T}/transactions.html`],
      ["Java SE API: PreparedStatement", `${API}/java/sql/PreparedStatement.html`],
    ],
  }),
  g({
    slug: "spring-boot-datasource",
    topic: "Pooling",
    d: "easy",
    title: "How does Spring Boot configure a `DataSource`?",
    kw: ["spring.datasource.url", "HikariCP", "auto-configuration", "schema.sql", "embedded database"],
    intent: "Checks that you can connect a Boot application to a database.",
    short:
      "Spring Boot auto-configures a `DataSource` when a JDBC driver is on the class path and the `spring.datasource.url`, `username` and `password` properties are set. It uses the HikariCP pool by default and exposes the pool settings under `spring.datasource.hikari.*`. If no URL is set and an embedded database such as H2 is on the class path, Boot configures an in-memory one, which is useful for tests. The password should come from an environment variable, not from the file in the repository.",
    detail: [
      "A `JdbcTemplate` bean is also auto-configured when the `DataSource` exists.",
      "A schema migration tool, such as Flyway or Liquibase, is the right way to create and change tables.",
      "`spring.sql.init.mode` controls whether `schema.sql` and `data.sql` run at start-up.",
    ],
    ex: "The container sets `SPRING_DATASOURCE_URL` and `SPRING_DATASOURCE_PASSWORD`, and the application connects with no code.",
    code: [
      "Boot data source properties",
      "spring.datasource.url=jdbc:postgresql://db:5432/shop\nspring.datasource.username=shop_app\nspring.datasource.password=${DB_PASSWORD}\nspring.datasource.hikari.maximum-pool-size=10",
      [
        "The URL, user and password configure the connection.",
        "The password comes from an environment variable.",
        "Hikari pool settings are tuned under `hikari`.",
      ],
      "properties",
    ],
    mistakes: [
      "Forgetting the driver dependency.",
      "Committing the database password in the properties file.",
    ],
    follow: ["How do you manage schema changes?"],
    points: [
      "Properties → auto-configured DataSource",
      "HikariCP by default",
      "Secrets from the environment",
    ],
    notes: "`spring.datasource.*` properties give a Hikari-pooled `DataSource` and a `JdbcTemplate`.",
    src: [
      ["Spring Boot Reference: SQL Databases", `${SB}/data/sql.html`],
      ["Spring Boot Reference: Externalized Configuration", `${SB}/features/external-config.html`],
    ],
  }),
  g({
    slug: "acid-properties",
    topic: "Transactions",
    d: "easy",
    title: "What does ACID mean for a database transaction?",
    kw: ["ACID", "atomicity", "consistency", "isolation", "durability"],
    intent: "Checks that you can explain the four guarantees with a simple example.",
    short:
      "ACID names the four guarantees of a transaction. Atomicity: all the statements succeed together, or none of them take effect. Consistency: a transaction moves the database from one valid state to another, so the rules and constraints always hold. Isolation: concurrent transactions do not see each other's unfinished changes in a way that breaks correctness, to a degree set by the isolation level. Durability: once a transaction is committed, its changes survive a crash. A bank transfer that debits one account and credits another is the usual example.",
    detail: [
      "In JDBC you control atomicity with `commit` and `rollback`, and isolation with `setTransactionIsolation`.",
      "Constraints such as primary keys, foreign keys and checks help to keep the data consistent.",
      "Durability is provided by the database, typically through a write-ahead log.",
    ],
    ex: "If the server crashes after the debit but before the credit, atomicity makes the database discard the debit.",
    mistakes: [
      "Describing consistency as \"the data is the same on all servers\", which is a different idea.",
      "Forgetting that isolation levels trade safety for speed.",
    ],
    follow: ["How do you get atomicity in JDBC?"],
    points: [
      "Atomicity, Consistency, Isolation, Durability",
      "Transfer example",
      "Isolation is configurable",
    ],
    notes: "ACID: all-or-nothing, valid state to valid state, isolated, durable after commit.",
    src: [
      ["The Java Tutorials: Using Transactions", `${T}/transactions.html`],
      ["Java SE API: Connection", `${API}/java/sql/Connection.html`],
    ],
  }),
  g({
    slug: "jdbc-driver-loading",
    topic: "Connections",
    d: "easy",
    title: "Do you still need `Class.forName` to load a JDBC driver?",
    kw: ["Class.forName", "driver loading", "ServiceLoader", "JDBC 4", "DriverManager"],
    intent: "Checks that you know an old habit that is no longer necessary.",
    short:
      "No. Before JDBC 4.0, you had to load the driver class yourself with `Class.forName(\"org.postgresql.Driver\")` so that it registered with `DriverManager`. Since JDBC 4.0, drivers that are on the class path are found automatically with the Java service provider mechanism, so `DriverManager.getConnection(url, ...)` just works, as long as the driver jar is present and the URL matches it. You may still see `Class.forName` in old code and old tutorials. A missing driver shows up as \"No suitable driver found\".",
    detail: [
      "The URL prefix, such as `jdbc:postgresql:`, decides which driver accepts it.",
      "In a build tool project, the driver is a dependency, usually with a runtime scope.",
      "Frameworks that provide a `DataSource` load the driver for you.",
    ],
    ex: "A project that fails with \"No suitable driver found\" is missing the driver dependency or has a mistake in the URL.",
    mistakes: [
      "Adding `Class.forName` as a fix for a missing jar, which does not help.",
      "Writing the URL prefix incorrectly.",
    ],
    follow: ["What does No suitable driver found mean?"],
    points: [
      "Automatic since JDBC 4",
      "Driver jar and URL must match",
      "Class.forName is legacy",
    ],
    notes: "JDBC 4+: drivers on the class path self-register. No `Class.forName` needed.",
    src: [
      ["Java SE API: DriverManager", `${API}/java/sql/DriverManager.html`],
      ["The Java Tutorials: Establishing a Connection", `${T}/connecting.html`],
    ],
  }),
])
