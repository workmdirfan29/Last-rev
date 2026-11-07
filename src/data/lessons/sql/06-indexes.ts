import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "indexes",
  title: "Indexes: what they are and when they help",
  topic: "Indexes",
  minutes: 70,
  overview:
    "Learn how an index speeds up lookups, how to create one, what multicolumn, unique and partial indexes are, and the cost of too many indexes.",
  objectives: [
    "Explain why an index speeds up reads and slows down writes",
    "Create single-column, multicolumn and unique indexes with CREATE INDEX",
    "Choose the column order of a multicolumn index and recognise when an index will not be used",
  ],
  prerequisites: ["lesson.sql.select-and-filtering"],
  sections: [
    {
      kind: "explain",
      heading: "A book's index for a table",
      body: [
        "Without an index, a query such as `SELECT content FROM test1 WHERE id = 42` must scan the whole table, row by row. If the system has an **index** on `id`, it can find the matching rows much more efficiently, for example by walking a few levels down a search tree.",
        "The PostgreSQL documentation compares it to the alphabetical index at the end of a book: instead of reading every page, you look the term up and go to the right page.",
        "You create one with `CREATE INDEX name ON table (column)` and remove it with `DROP INDEX`. Once created, the database keeps it up to date automatically, so no change to your queries is needed. The cost is that every insert, update and delete on the table also has to maintain the index, and an index takes disk space.",
      ],
    },
    {
      kind: "code",
      heading: "Creating indexes",
      example: {
        title: "Single, multicolumn and unique",
        language: "sql",
        code: "CREATE INDEX orders_customer_idx ON orders (customer_id);\n\nCREATE INDEX orders_customer_created_idx\n  ON orders (customer_id, created);\n\nCREATE UNIQUE INDEX customers_email_idx ON customers (email);\n\nCREATE INDEX orders_open_idx ON orders (created)\n  WHERE status = 'open';\n\nDROP INDEX orders_customer_idx;",
        walkthrough: [
          "A single-column index speeds up lookups and joins on `customer_id`.",
          "A **multicolumn** index on `(customer_id, created)` helps queries that filter by customer, and by customer and date. It is most efficient when the query constrains the leading (leftmost) columns.",
          "A **unique** index also enforces that no two rows have the same value. A primary key or unique constraint creates one automatically.",
          "A **partial** index covers only the rows that satisfy its `WHERE` condition, which keeps it small when you query only that subset.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "What an index can and cannot help with",
      body: [
        "In PostgreSQL the default index type is the **B-tree**, which handles equality and range comparisons (`<`, `<=`, `=`, `>=`, `>`), `BETWEEN`, `IN`, `IS NULL` and sorting. It can also help `LIKE 'abc%'` when the pattern is anchored at the start, but not `LIKE '%abc'`.",
        "A function applied to the column usually prevents the index being used: `WHERE lower(email) = 'a@x.com'` cannot use a plain index on `email`. An **expression index** on `lower(email)` solves that.",
        "The planner chooses whether to use an index. If a query returns a large share of the table, a sequential scan can be cheaper, so an unused index is not necessarily a bug. Use `EXPLAIN` to see what the planner does.",
        "Index the columns you filter, join and sort on, and keep the number of indexes modest because each one slows writes.",
      ],
    },
    {
      kind: "diagram",
      heading: "Multicolumn index order",
      diagram: {
        kind: "table",
        title: "Index on (customer_id, created)",
        headers: ["Query condition", "Helped well?"],
        rows: [
          ["customer_id = 5", "Yes: leading column"],
          ["customer_id = 5 AND created > '2025-01-01'", "Yes: both columns"],
          ["created > '2025-01-01' only", "Poorly: leading column not constrained"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Indexing every column.",
          fix: "Each index slows writes and uses space. Add indexes for real query patterns.",
        },
        {
          mistake: "Wrapping an indexed column in a function in WHERE.",
          fix: "Compare the plain column, or create an expression index that matches.",
        },
        {
          mistake: "Putting the columns of a multicolumn index in the wrong order.",
          fix: "Put the column you always constrain with equality first.",
        },
        {
          mistake: "Assuming the index will always be used.",
          fix: "Check the plan with EXPLAIN on realistic data.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Speeding up a slow lookup",
      scenario:
        "A page that lists a customer's recent orders is slow because the orders table has millions of rows.",
      body: [
        "The query filters by `customer_id` and sorts by `created`. A multicolumn index on `(customer_id, created)` lets the database find that customer's rows and read them in date order.",
        "Create it, run `EXPLAIN` before and after, and confirm that the plan changed from scanning the whole table to using the index.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "index-tradeoff",
      prompt: "What is the main cost of adding an index?",
      options: [
        "Slower inserts, updates and deletes, and extra disk space",
        "Slower SELECT queries",
        "Loss of data",
      ],
      answer: 0,
      explanation:
        "The database must maintain every index when rows change, and the index takes space.",
    },
    {
      type: "single",
      id: "like-index",
      prompt: "Which pattern can a B-tree index help in PostgreSQL?",
      options: ["LIKE 'abc%'", "LIKE '%abc'", "LIKE '%abc%'"],
      answer: 0,
      explanation:
        "A pattern anchored at the start can use the index. A leading wildcard cannot.",
    },
    {
      type: "truefalse",
      id: "function-blocks",
      statement: "WHERE lower(email) = 'a@x.com' can use a plain index on email.",
      answer: false,
      explanation:
        "The index is on email, not lower(email). Use an expression index on lower(email).",
    },
    {
      type: "blank",
      id: "unique-index",
      prompt: "A ___ index also guarantees that no two rows have the same value.",
      answer: "unique",
      explanation:
        "`CREATE UNIQUE INDEX` enforces uniqueness as well as speeding up lookups.",
    },
  ],
  assignment: {
    title: "Index experiment",
    task: [
      "Create a table with many rows (use a generating query or a script), run a lookup by a column with and without an index, and compare the plans with EXPLAIN.",
      "Try a multicolumn index and test queries that use the leading column, both columns and only the second column.",
    ],
    checklist: [
      "I saw a sequential scan change into an index scan",
      "I tested a function in WHERE and then an expression index",
      "I tested the leading-column rule on a multicolumn index",
      "I noted the extra work for writes",
    ],
    hints: ["Run ANALYZE after loading data so the planner has good statistics."],
    minutes: 35,
  },
  exercises: [
    {
      slug: "choose-the-index",
      title: "Write the index",
      task: [
        "Queries often run `SELECT * FROM orders WHERE customer_id = ? AND created >= ? ORDER BY created`. Write the statement that creates the best multicolumn index for them, named orders_customer_created_idx.",
      ],
      language: "sql",
      starter: "CREATE INDEX\n;",
      solution:
        "CREATE INDEX orders_customer_created_idx\n  ON orders (customer_id, created);",
      hints: ["Equality column first, then the range and sort column."],
      checklist: [
        "The index is on orders",
        "customer_id comes first",
        "created comes second",
      ],
    },
  ],
  revisionNotes: [
    "An index avoids scanning the whole table; it costs write time and space",
    "B-tree: equality, ranges, sorting, anchored LIKE",
    "Multicolumn: leftmost columns matter; unique and partial indexes exist",
    "Functions on indexed columns need expression indexes; check plans with EXPLAIN",
  ],
  resources: [
    {
      label: "PostgreSQL: Indexes introduction",
      url: "https://www.postgresql.org/docs/current/indexes-intro.html",
    },
    {
      label: "PostgreSQL: Index types",
      url: "https://www.postgresql.org/docs/current/indexes-types.html",
    },
    {
      label: "PostgreSQL: Multicolumn indexes",
      url: "https://www.postgresql.org/docs/current/indexes-multicolumn.html",
    },
    {
      label: "PostgreSQL: Indexes on expressions",
      url: "https://www.postgresql.org/docs/current/indexes-expressional.html",
    },
  ],
})
