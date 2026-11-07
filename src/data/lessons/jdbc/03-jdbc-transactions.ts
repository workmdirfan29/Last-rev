import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jdbc", {
  slug: "jdbc-transactions",
  title: "Transactions in JDBC",
  topic: "Transactions",
  minutes: 50,
  overview:
    "Group statements into transactions with commit and rollback, understand ACID and isolation levels, use savepoints and handle SQL exceptions and lost updates.",
  objectives: [
    "Use setAutoCommit, commit and rollback correctly",
    "Explain ACID and the isolation levels",
    "Prevent lost updates with optimistic locking and read SQLException details",
  ],
  prerequisites: ["lesson.jdbc.prepared-statements-and-injection"],
  sections: [
    {
      kind: "explain",
      heading: "Commit and rollback",
      body: [
        "By default a JDBC connection is in **auto-commit** mode: each statement is its own transaction and is committed at once. To group statements, call `con.setAutoCommit(false)`, run them, and then `con.commit()` to make all of them permanent. If anything fails, call `con.rollback()` to undo everything since the last commit. This gives **atomicity**: a money transfer that debits one account and credits another must do both or neither. Keep transactions **short**, because they hold locks and a pooled connection, and restore auto-commit, or return the connection to the pool clean, when you finish. Frameworks such as Spring manage these calls with `@Transactional`.",
        "**ACID** names the four guarantees: **atomicity** (all or nothing), **consistency** (from one valid state to another), **isolation** (concurrent transactions do not interfere in a way that breaks correctness, to a degree set by the isolation level) and **durability** (committed changes survive a crash).",
      ],
    },
    {
      kind: "code",
      heading: "An all-or-nothing transfer",
      example: {
        title: "setAutoCommit, commit, rollback",
        language: "java",
        code: 'con.setAutoCommit(false);\ntry (PreparedStatement debit = con.prepareStatement("UPDATE accounts SET balance = balance - ? WHERE id = ?");\n     PreparedStatement credit = con.prepareStatement("UPDATE accounts SET balance = balance + ? WHERE id = ?")) {\n  debit.setBigDecimal(1, amount);\n  debit.setLong(2, fromId);\n  debit.executeUpdate();\n\n  credit.setBigDecimal(1, amount);\n  credit.setLong(2, toId);\n  credit.executeUpdate();\n\n  con.commit();\n} catch (SQLException e) {\n  con.rollback();\n  throw e;\n} finally {\n  con.setAutoCommit(true);\n}',
        walkthrough: [
          "Auto-commit is off, so nothing is permanent until `commit()`.",
          "If the second update fails, `rollback()` undoes the first.",
          "`finally` restores auto-commit before the connection goes back to the pool.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Isolation levels and savepoints",
      body: [
        "The **isolation level** controls how much concurrent transactions see of each other. JDBC defines four: `READ_UNCOMMITTED` allows **dirty reads** of uncommitted data. `READ_COMMITTED` prevents dirty reads. `REPEATABLE_READ` also prevents a row from changing between two reads in the same transaction. `SERIALIZABLE` also prevents **phantom rows**, new rows that match an earlier query. Higher levels are safer but cost more locking or retries. You set one with `con.setTransactionIsolation(...)`, and the default depends on the database.",
        "A **savepoint**, made with `con.setSavepoint()`, marks a point inside a transaction. `con.rollback(savepoint)` undoes only the work after it, and the transaction can still be committed. Support depends on the database, so check `DatabaseMetaData.supportsSavepoints()`.",
      ],
    },
    {
      kind: "explain",
      heading: "Errors and lost updates",
      body: [
        "`SQLException` carries a message, an **`SQLState`**, a standard five-character code that identifies the kind of error, and a vendor error code. Read `getSQLState()` to tell a constraint violation from a connection failure. Do not swallow the exception: roll back if needed, log it **with the stack trace**, and rethrow it or wrap it in your own exception with the original as the cause. A transient error, such as a deadlock, may be worth a retry. A constraint error is not.",
        "A **lost update** happens when two users read the same row, both change it, and the second save silently overwrites the first. With **optimistic locking**, the row has a version number, and the update is `WHERE id = ? AND version = ?` while it increases the version. If the update count is `0`, someone else changed the row first, and the code reports a conflict. With **pessimistic locking**, `SELECT ... FOR UPDATE` locks the row inside the transaction, so others wait.",
      ],
    },
    {
      kind: "code",
      heading: "Optimistic locking",
      example: {
        title: "Version column",
        language: "java",
        code: 'int updated = jdbc.update(\n    "UPDATE tickets SET status = ?, version = version + 1 WHERE id = ? AND version = ?",\n    newStatus, id, expectedVersion);\n\nif (updated == 0) {\n  throw new ConcurrentUpdateException("Ticket " + id + " was changed by someone else");\n}',
        walkthrough: [
          "The update succeeds only if the version is still the one the user read.",
          "A count of `0` means that another change came first.",
          "The user is told to reload, instead of silently overwriting the other change.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Leaving auto-commit on and expecting a rollback to work.",
          fix: "Turn it off before the statements.",
        },
        {
          mistake: "Not rolling back after an exception.",
          fix: "Roll back, then rethrow.",
        },
        {
          mistake: "Using SERIALIZABLE everywhere.",
          fix: "Use the lowest level that your rules need.",
        },
        {
          mistake: "Updating by id only and losing another user's change.",
          fix: "Add a version check and read the update count.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Order placement",
      scenario:
        "Placing an order inserts the order, its lines and reduces the stock.",
      body: [
        "All three changes run in one transaction, so a failure in the stock update leaves no half-created order. The stock update has `WHERE stock >= ?`, and an update count of 0 means that there was not enough stock, so the transaction is rolled back.",
        "The rule is enforced in the database statement, and not in a racy check before it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tx-default",
      prompt: "What is the default commit mode of a JDBC connection?",
      options: ["Auto-commit", "Manual commit", "No commit"],
      answer: 0,
      explanation: "Each statement is committed at once.",
    },
    {
      type: "single",
      id: "tx-acid",
      prompt: "What does atomicity guarantee?",
      options: [
        "All statements succeed together or none do",
        "Faster queries",
        "Encrypted data",
      ],
      answer: 0,
      explanation: "It is the A in ACID.",
    },
    {
      type: "truefalse",
      id: "tx-isolation",
      statement: "A higher isolation level is always better.",
      answer: false,
      explanation:
        "It costs locking or retries. Use the lowest level that your rules need.",
    },
    {
      type: "single",
      id: "tx-lost",
      prompt:
        "What does an update count of 0 mean in an optimistic-locking update?",
      options: [
        "Someone changed the row first",
        "The update was faster",
        "The row was deleted successfully",
      ],
      answer: 0,
      explanation: "The version no longer matches, so no row was updated.",
    },
  ],
  assignment: {
    title: "A safe transfer",
    task: [
      "Write a transfer method with `setAutoCommit(false)`, commit, rollback and `finally`, and test that a failure in the second update leaves the first undone.",
      "Add a version column and show that the second of two concurrent edits is rejected.",
    ],
    checklist: [
      "Rollback undoes the first update",
      "Auto-commit is restored",
      "The stale edit is rejected",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "tx-ex",
      title: "Roll back on failure",
      task: [
        "Write `static void transfer(Connection con, long from, long to, BigDecimal amount)` that runs the two updates in one transaction, with commit and rollback.",
      ],
      language: "java",
      starter:
        "static void transfer(Connection con, long from, long to, BigDecimal amount) throws SQLException {\n  // your code\n}",
      solution:
        'static void transfer(Connection con, long from, long to, BigDecimal amount) throws SQLException {\n  con.setAutoCommit(false);\n  try (PreparedStatement debit = con.prepareStatement("UPDATE accounts SET balance = balance - ? WHERE id = ?");\n       PreparedStatement credit = con.prepareStatement("UPDATE accounts SET balance = balance + ? WHERE id = ?")) {\n    debit.setBigDecimal(1, amount);\n    debit.setLong(2, from);\n    debit.executeUpdate();\n    credit.setBigDecimal(1, amount);\n    credit.setLong(2, to);\n    credit.executeUpdate();\n    con.commit();\n  } catch (SQLException e) {\n    con.rollback();\n    throw e;\n  } finally {\n    con.setAutoCommit(true);\n  }\n}',
      hints: [
        "Commit at the end, roll back in the catch block, restore auto-commit in finally.",
      ],
      checklist: [
        "Both updates are in one transaction",
        "Rollback on failure",
        "Auto-commit is restored",
      ],
    },
  ],
  revisionNotes: [
    "Auto-commit by default; `setAutoCommit(false)` → commit / rollback; keep transactions short",
    "ACID; four isolation levels (dirty, non-repeatable, phantom reads)",
    "Savepoints for partial rollback; read `SQLState`; wrap with the cause",
    "Optimistic locking: `WHERE id=? AND version=?` and check the count",
  ],
  resources: [
    {
      label: "The Java Tutorials: Using Transactions",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html",
    },
    {
      label: "The Java Tutorials: Handling SQL Exceptions",
      url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/sqlexception.html",
    },
    {
      label: "Java SE API: Connection",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Connection.html",
    },
  ],
})
