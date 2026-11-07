import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "window-functions",
  title: "Window functions",
  topic: "Window functions",
  minutes: 80,
  overview:
    "Calculate across related rows without collapsing them: OVER, PARTITION BY, ORDER BY, ranking functions, LAG and LEAD, and running totals.",
  objectives: [
    "Explain how a window function differs from GROUP BY",
    "Use ROW_NUMBER, RANK and DENSE_RANK, and know how they treat ties",
    "Write running totals and compare a row with the previous one using SUM OVER and LAG",
  ],
  prerequisites: ["lesson.sql.aggregation"],
  sections: [
    {
      kind: "explain",
      heading: "Calculations that keep the rows",
      body: [
        "A **window function** performs a calculation across a set of rows related to the current row, but unlike a plain aggregate it does not collapse them into one row. Every row stays in the result and gets its own computed value.",
        "The `OVER` clause defines the window. `PARTITION BY` splits the rows into groups, like `GROUP BY` does for aggregates, and `ORDER BY` inside `OVER` sets the order within each partition. `OVER ()` with nothing inside treats all rows as one window.",
        "Any aggregate can be used as a window function by adding `OVER`, for example `SUM(total) OVER (PARTITION BY customer_id)`. There are also functions made for windows, such as `ROW_NUMBER`, `RANK`, `LAG` and `LEAD`.",
      ],
    },
    {
      kind: "code",
      heading: "Ranking and running totals",
      example: {
        title: "Four common window calculations",
        language: "sql",
        code: "SELECT id, customer_id, total,\n       ROW_NUMBER() OVER (ORDER BY total DESC) AS position\nFROM orders;\n\nSELECT customer_id, total,\n       ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total DESC) AS rank_in_customer\nFROM orders;\n\nSELECT id, customer_id, total,\n       SUM(total) OVER (PARTITION BY customer_id ORDER BY created) AS running_total\nFROM orders;\n\nSELECT id, total,\n       total - LAG(total) OVER (ORDER BY created) AS change_from_previous\nFROM orders;",
        walkthrough: [
          "`ROW_NUMBER()` numbers rows 1, 2, 3 in the window order, with no ties.",
          "Adding `PARTITION BY customer_id` restarts the numbering for each customer, which gives 'the largest order of each customer' when you keep row number 1.",
          "A `SUM` with `ORDER BY` inside `OVER` becomes a **running total**: each row adds the rows up to and including itself within the partition.",
          "`LAG(total)` reads the value from the previous row in the window order, and is NULL for the first row. `LEAD` reads the next row.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Ranking functions and ties",
      diagram: {
        kind: "table",
        title: "Scores 90, 90, 80, 70 ranked from high to low",
        headers: ["Score", "ROW_NUMBER", "RANK", "DENSE_RANK"],
        rows: [
          ["90", "1", "1", "1"],
          ["90", "2", "1", "1"],
          ["80", "3", "3", "2"],
          ["70", "4", "4", "3"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Where window functions can appear",
      body: [
        "Window functions are allowed only in the `SELECT` list and in `ORDER BY`. They are calculated after `WHERE`, `GROUP BY` and `HAVING`, so you cannot filter on them directly in the same query's `WHERE`.",
        "To keep only rows with a given rank, put the query in a subquery or a `WITH` query and filter in the outer query.",
        "If two rows tie on the `ORDER BY` value, `ROW_NUMBER` still gives them different numbers, in an unspecified order unless you add a tie-breaker column.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting a window function in WHERE.",
          fix: "Compute it in a subquery or WITH query and filter in the outer query.",
        },
        {
          mistake: "Using GROUP BY when you need to keep every row.",
          fix: "Use a window function so the detail rows stay.",
        },
        {
          mistake: "Forgetting ORDER BY inside OVER for ranking or LAG.",
          fix: "The result depends on the order, so always state it.",
        },
        {
          mistake: "Assuming ROW_NUMBER is stable for ties.",
          fix: "Add another column to the ORDER BY to break ties.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "The biggest order of each customer",
      scenario:
        "You need each customer's largest order, with its date and id.",
      body: [
        "Number each customer's orders by total in a subquery: `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total DESC) AS rn`. In the outer query keep `WHERE rn = 1`.",
        "A `GROUP BY` with `MAX(total)` would give the amount but not the other columns of that order, which is why the window function is a better fit here.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "window-vs-group",
      prompt: "How does a window function differ from GROUP BY?",
      options: [
        "It keeps every row and adds a computed value",
        "It collapses rows into one per group",
        "It can only be used with COUNT",
      ],
      answer: 0,
      explanation:
        "Window functions calculate across related rows without collapsing them.",
    },
    {
      type: "single",
      id: "rank-gap",
      prompt: "Scores 90, 90, 80 are ranked from high to low. What does RANK() give the 80?",
      options: ["3", "2", "1"],
      answer: 0,
      explanation:
        "RANK leaves a gap after a tie, so the 80 is rank 3. DENSE_RANK would give 2.",
    },
    {
      type: "truefalse",
      id: "window-in-where",
      statement: "You can use ROW_NUMBER() OVER (...) directly in the same query's WHERE clause.",
      answer: false,
      explanation:
        "Window functions are evaluated after WHERE. Filter on them in an outer query.",
    },
    {
      type: "blank",
      id: "previous-row",
      prompt: "The function ___ reads a value from the previous row in the window.",
      answer: "LAG",
      explanation:
        "`LAG(column)` returns the value from the previous row, and `LEAD` the next.",
    },
  ],
  assignment: {
    title: "Window workbook",
    task: [
      "With an orders table, write queries for: the rank of each order by total, the largest order per customer, a running total per customer and the change from the previous order.",
      "Compare ROW_NUMBER, RANK and DENSE_RANK on data with ties.",
    ],
    checklist: [
      "I used PARTITION BY and ORDER BY inside OVER",
      "I filtered on a rank through a subquery or WITH query",
      "I produced a running total",
      "I explained the differences between the three ranking functions",
    ],
    hints: ["Insert two orders with the same total to see how ties behave."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "latest-order-per-customer",
      title: "Latest order per customer",
      task: [
        "Write a query that returns the id, customer_id and created date of each customer's most recent order.",
      ],
      language: "sql",
      starter: "SELECT\nFROM orders\n;",
      solution:
        "SELECT id, customer_id, created\nFROM (\n  SELECT id, customer_id, created,\n         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created DESC) AS rn\n  FROM orders\n  WHERE customer_id IS NOT NULL\n) ranked\nWHERE rn = 1;",
      hints: ["Number each customer's orders newest first, then keep number 1."],
      checklist: [
        "ROW_NUMBER is partitioned by customer",
        "The window orders by created, descending",
        "The outer query keeps rn = 1",
      ],
    },
  ],
  revisionNotes: [
    "Window functions keep all rows: expr OVER (PARTITION BY … ORDER BY …)",
    "ROW_NUMBER has no ties; RANK has gaps after ties; DENSE_RANK has none",
    "SUM … OVER (… ORDER BY …) is a running total; LAG/LEAD read neighbours",
    "Filter on window results in an outer query",
  ],
  resources: [
    {
      label: "PostgreSQL tutorial: Window functions",
      url: "https://www.postgresql.org/docs/current/tutorial-window.html",
    },
    {
      label: "PostgreSQL: Window functions",
      url: "https://www.postgresql.org/docs/current/functions-window.html",
    },
  ],
})
