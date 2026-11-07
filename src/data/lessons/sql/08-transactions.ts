import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "transactions",
  title: "Transactions and isolation",
  topic: "Transactions",
  minutes: 60,
  overview:
    "Group statements into an all-or-nothing unit with BEGIN, COMMIT and ROLLBACK, understand ACID, savepoints, and what isolation levels protect you from.",
  objectives: [
    "Write a transaction with BEGIN, COMMIT and ROLLBACK and explain atomicity",
    "Describe the ACID properties in your own words",
    "Name the read phenomena that isolation levels prevent and the default level in PostgreSQL",
  ],
  prerequisites: ["lesson.sql.select-and-filtering"],
  sections: [
    {
      kind: "explain",
      heading: "All or nothing",
      body: [
        "A **transaction** bundles multiple steps into a single, all-or-nothing operation. The intermediate states between the steps are not visible to other concurrent transactions, and if some failure prevents the transaction from completing, none of the steps affect the database at all.",
        "The classic example is a bank transfer: debit one account and credit another. The two updates must both happen or neither may.",
        "In PostgreSQL, a statement outside a transaction block runs in its own transaction and is committed when it ends (autocommit). `BEGIN` starts a block, and statements after it run in one transaction until `COMMIT` makes the changes permanent or `ROLLBACK` discards them.",
      ],
    },
    {
      kind: "code",
      heading: "A transfer",
      example: {
        title: "BEGIN, COMMIT, ROLLBACK and a savepoint",
        language: "sql",
        code: "BEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE name = 'Alice';\nUPDATE accounts SET balance = balance + 100 WHERE name = 'Bob';\n\nCOMMIT;\n\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE name = 'Alice';\nSAVEPOINT after_debit;\nUPDATE accounts SET balance = balance + 100 WHERE name = 'Wrong';\nROLLBACK TO after_debit;\nUPDATE accounts SET balance = balance + 100 WHERE name = 'Bob';\nCOMMIT;",
        walkthrough: [
          "Both updates sit between `BEGIN` and `COMMIT`, so other sessions see either the old balances or the new ones, never one change without the other.",
          "If anything fails before `COMMIT`, you issue `ROLLBACK` and neither update takes effect.",
          "A **savepoint** marks a point inside a transaction. `ROLLBACK TO after_debit` undoes only the work after it, so the debit is kept and you can retry the credit.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "ACID",
      diagram: {
        kind: "table",
        title: "What a transaction promises",
        headers: ["Property", "Meaning"],
        rows: [
          ["Atomicity", "All steps happen or none do"],
          ["Consistency", "The database moves from one valid state to another, respecting constraints"],
          ["Isolation", "Concurrent transactions do not see each other's unfinished work"],
          ["Durability", "Once committed, the changes survive a crash"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Isolation levels",
      body: [
        "Isolation is the hard part when many transactions run at once. The SQL standard defines levels by the phenomena they prevent. A **dirty read** reads data from a concurrent uncommitted transaction. A **nonrepeatable read** re-reads data and finds it changed by a transaction that committed meanwhile. A **phantom read** re-runs a query and finds a different set of rows. A **serialization anomaly** gives a result that matches no one-at-a-time order of the transactions.",
        "PostgreSQL's default level is **Read Committed**: each query sees only data committed before that query began. **Repeatable Read** sees only data committed before the transaction began. **Serializable** guarantees the same effect as running transactions one at a time.",
        "At the stricter levels, an application must be prepared to retry a transaction that fails with a serialization failure.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Doing related updates as separate autocommit statements.",
          fix: "Wrap them in one transaction so they succeed or fail together.",
        },
        {
          mistake: "Leaving a transaction open while waiting for a user.",
          fix: "Keep transactions short so locks are released quickly.",
        },
        {
          mistake: "Assuming a rolled-back transaction leaves no trace in a sequence counter.",
          fix: "Sequence values are not rolled back, so ids can have gaps.",
        },
        {
          mistake: "Using a strict isolation level without retry logic.",
          fix: "Catch serialization failures and retry the whole transaction.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Placing an order",
      scenario:
        "Placing an order must insert the order, insert its items and reduce stock, and an error in any step must leave nothing behind.",
      body: [
        "Run all three steps in one transaction. If a stock check fails, issue `ROLLBACK` and report the error; otherwise `COMMIT`.",
        "In application code, use your driver's transaction support so the rollback happens automatically when an exception is thrown.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "atomic",
      prompt: "What does atomicity mean for a transaction?",
      options: [
        "All its steps happen or none of them do",
        "It runs on one CPU core",
        "It runs faster than other statements",
      ],
      answer: 0,
      explanation:
        "Atomicity makes the transaction an all-or-nothing unit.",
    },
    {
      type: "single",
      id: "default-level",
      prompt: "What is PostgreSQL's default transaction isolation level?",
      options: ["Read Committed", "Serializable", "Repeatable Read"],
      answer: 0,
      explanation:
        "Read Committed is the default: a query sees data committed before it began.",
    },
    {
      type: "truefalse",
      id: "rollback-sequence",
      statement: "A rollback also resets the counter of a sequence or serial column.",
      answer: false,
      explanation:
        "Sequence changes are not rolled back, so ids can have gaps.",
    },
    {
      type: "blank",
      id: "undo-all",
      prompt: "The ___ command discards all the changes made in the current transaction.",
      answer: "ROLLBACK",
      explanation:
        "`ROLLBACK` ends the transaction and undoes its changes.",
    },
  ],
  assignment: {
    title: "Transfer with a failure",
    task: [
      "Create an accounts table and write a transfer as a transaction. Simulate a failure after the debit, in a second session or with an error, and check that the balances are unchanged after a rollback.",
      "Then use a savepoint to retry one step of a transaction.",
    ],
    checklist: [
      "Both updates are in one BEGIN … COMMIT",
      "After a rollback the balances are unchanged",
      "I used SAVEPOINT and ROLLBACK TO",
      "I can name the four ACID properties",
    ],
    hints: ["Check balances from a second session while the first transaction is still open."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "write-the-transfer",
      title: "Write the transfer",
      task: [
        "Write a transaction that moves 50 from the account named 'Alice' to the account named 'Bob' in the accounts(name, balance) table.",
      ],
      language: "sql",
      starter: "-- your transaction",
      solution:
        "BEGIN;\n\nUPDATE accounts SET balance = balance - 50 WHERE name = 'Alice';\nUPDATE accounts SET balance = balance + 50 WHERE name = 'Bob';\n\nCOMMIT;",
      hints: ["Two updates between BEGIN and COMMIT."],
      checklist: [
        "The transaction starts with BEGIN and ends with COMMIT",
        "Alice is debited and Bob is credited the same amount",
        "Each update has a WHERE clause",
      ],
    },
  ],
  revisionNotes: [
    "BEGIN … COMMIT / ROLLBACK: all-or-nothing; autocommit is one statement per transaction",
    "ACID: atomicity, consistency, isolation, durability",
    "Read Committed is PostgreSQL's default; stricter levels need retries",
    "SAVEPOINT allows a partial rollback",
  ],
  resources: [
    {
      label: "PostgreSQL tutorial: Transactions",
      url: "https://www.postgresql.org/docs/current/tutorial-transactions.html",
    },
    {
      label: "PostgreSQL: Transaction isolation",
      url: "https://www.postgresql.org/docs/current/transaction-iso.html",
    },
    {
      label: "PostgreSQL: SAVEPOINT",
      url: "https://www.postgresql.org/docs/current/sql-savepoint.html",
    },
  ],
})
