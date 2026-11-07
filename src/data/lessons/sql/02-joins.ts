import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "joins",
  title: "Joins: combining tables",
  topic: "Joins",
  minutes: 90,
  overview:
    "Combine rows from several tables: inner, left, right, full and cross joins, self joins, join conditions, and the common traps with NULL and duplicated rows.",
  objectives: [
    "Write INNER JOIN and LEFT JOIN queries and explain the difference",
    "Find rows that have no match using LEFT JOIN … IS NULL",
    "Explain why a condition in ON differs from the same condition in WHERE for an outer join",
  ],
  prerequisites: ["lesson.sql.select-and-filtering"],
  sections: [
    {
      kind: "explain",
      heading: "Why joins",
      body: [
        "Relational data is split into tables to avoid repetition: customers in one table, their orders in another, linked by a key. A **join** puts rows from two tables side by side when a condition matches, usually a foreign key equal to a primary key.",
        "The join condition is written in the `ON` clause. Table aliases such as `c` for customers keep the query short, and qualifying columns as `c.name` removes any doubt about where a column comes from.",
        "The main join types are **INNER** (only rows that match in both tables), **LEFT** (every row of the left table, with NULLs where there is no match), **RIGHT** (the mirror image), **FULL** (every row of both) and **CROSS** (every combination of rows).",
      ],
    },
    {
      kind: "code",
      heading: "Inner and left joins",
      example: {
        title: "Customers and their orders",
        language: "sql",
        code: "SELECT c.name, o.total\nFROM customers c\nINNER JOIN orders o ON o.customer_id = c.id;\n\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;\n\nSELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;",
        walkthrough: [
          "The inner join returns a row for each customer-order pair that matches. A customer with no orders does not appear.",
          "The left join returns every customer. For a customer without orders, the order columns are NULL.",
          "Filtering with `WHERE o.id IS NULL` after a left join keeps only the customers who have no orders. This is the standard 'find rows with no match' pattern.",
          "A customer with two orders appears twice, once for each order.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "ON versus WHERE",
      body: [
        "For an inner join, a condition in `ON` and the same condition in `WHERE` give the same result. For an outer join they do not.",
        "A condition in `ON` decides which rows match, and unmatched left rows are still kept with NULLs. A condition in `WHERE` filters the final result, so a row with NULL in the filtered column is removed, which turns a left join into an inner join.",
        "A **self join** joins a table to itself using two aliases, for example to pair customers in the same city with `a.city = b.city AND a.id < b.id`. A **cross join** has no condition and returns all combinations, so a table of 4 rows and a table of 5 rows give 20.",
      ],
    },
    {
      kind: "code",
      heading: "The trap",
      example: {
        title: "Same condition, different place",
        language: "sql",
        code: "-- keeps every customer\nSELECT c.name, o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.total > 40;\n\n-- drops customers without a large order\nSELECT c.name, o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.total > 40;",
        walkthrough: [
          "In the first query the test on `total` is part of the match. Customers without a large order stay in the result with a NULL order id.",
          "In the second query `WHERE o.total > 40` is evaluated after the join. A NULL total is not greater than 40, so those customers disappear.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting the join condition.",
          fix: "Without ON, you get a cross join with every combination of rows.",
        },
        {
          mistake: "Filtering the right table in WHERE after a LEFT JOIN.",
          fix: "Put the condition in ON if you want to keep unmatched left rows.",
        },
        {
          mistake: "Counting rows after a join without thinking about duplicates.",
          fix: "A one-to-many join repeats the left row. Use COUNT(DISTINCT …) or aggregate first.",
        },
        {
          mistake: "Joining on columns that can be NULL.",
          fix: "NULL never equals NULL, so those rows do not match.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A customer report",
      scenario:
        "A report must list every customer with their number of orders, including customers who have none.",
      body: [
        "Use a left join from customers to orders and group by the customer. `COUNT(o.id)` counts only matched orders, so customers without orders correctly show 0, whereas `COUNT(*)` would show 1.",
        "This combines the join and aggregation lessons: first decide which rows must survive, then choose what to count.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "left-keeps",
      prompt: "What does a LEFT JOIN guarantee?",
      options: [
        "Every row of the left table appears in the result",
        "Only rows with matches appear",
        "Every row of both tables appears",
      ],
      answer: 0,
      explanation:
        "A left join keeps all left rows, with NULLs where the right side has no match.",
    },
    {
      type: "output",
      id: "cross-count",
      prompt: "customers has 4 rows and products has 5 rows. How many rows does this return?",
      code: {
        language: "sql",
        code: "SELECT * FROM customers CROSS JOIN products;",
      },
      options: ["20", "9", "5"],
      answer: 0,
      explanation:
        "A cross join returns every combination: 4 × 5 = 20 rows.",
    },
    {
      type: "truefalse",
      id: "where-turns-inner",
      statement: "Putting a condition on the right table in WHERE after a LEFT JOIN can remove the unmatched left rows.",
      answer: true,
      explanation:
        "Unmatched rows have NULLs on the right side, and a condition on those columns is not true, so the rows are filtered out.",
    },
    {
      type: "blank",
      id: "no-match",
      prompt: "To find customers with no orders, LEFT JOIN orders and add WHERE o.id IS ___.",
      answer: "NULL",
      explanation:
        "Unmatched rows have NULL in every column of the right table.",
    },
  ],
  assignment: {
    title: "Join workbook",
    task: [
      "Create customers and orders tables with a customer who has several orders and one with none, and an order with no customer.",
      "Write queries for inner, left, right or full (if your database supports it), cross and self joins and compare the row counts.",
    ],
    checklist: [
      "I found customers without orders using LEFT JOIN and IS NULL",
      "I showed the difference between ON and WHERE for an outer join",
      "I counted orders per customer including zeros",
      "I predicted every row count before running the query",
    ],
    hints: ["SQLite supports left joins and, in recent versions, right and full joins."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "customers-without-orders",
      title: "Customers without orders",
      task: [
        "Write a query that returns the names of customers who have not placed any order, in alphabetical order.",
      ],
      language: "sql",
      starter: "SELECT\nFROM customers c\n;",
      solution:
        "SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL\nORDER BY c.name;",
      hints: ["Left join, then keep rows where the order id is NULL."],
      checklist: [
        "customers is the left table",
        "The unmatched rows are found with IS NULL",
        "The result is sorted by name",
      ],
    },
  ],
  revisionNotes: [
    "INNER: matches only. LEFT: all left rows. FULL: all rows of both. CROSS: all combinations",
    "ON decides matching; WHERE filters the result: they differ for outer joins",
    "LEFT JOIN … WHERE right.id IS NULL finds rows with no match",
    "One-to-many joins repeat the left row",
  ],
  resources: [
    {
      label: "PostgreSQL: Joined tables",
      url: "https://www.postgresql.org/docs/current/queries-table-expressions.html",
    },
    {
      label: "PostgreSQL tutorial: Joins between tables",
      url: "https://www.postgresql.org/docs/current/tutorial-join.html",
    },
  ],
})
