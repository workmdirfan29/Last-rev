import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "aggregation",
  title: "Aggregation: GROUP BY, HAVING and aggregate functions",
  topic: "Aggregation",
  minutes: 60,
  overview:
    "Summarise many rows into one: COUNT, SUM, AVG, MIN and MAX, grouping with GROUP BY, filtering groups with HAVING, and the way NULL affects aggregates.",
  objectives: [
    "Use COUNT, SUM, AVG, MIN and MAX and explain how each treats NULL",
    "Group rows with GROUP BY and filter groups with HAVING",
    "Explain the difference between WHERE and HAVING and the rule for selected columns",
  ],
  prerequisites: ["lesson.sql.select-and-filtering"],
  sections: [
    {
      kind: "explain",
      heading: "Aggregate functions",
      body: [
        "An **aggregate function** computes a single value from a set of rows: `COUNT`, `SUM`, `AVG`, `MIN` and `MAX` are the usual ones. Without `GROUP BY`, an aggregate treats the whole result as one group and returns one row.",
        "`COUNT(*)` counts rows. `COUNT(column)` counts the rows where that column is not NULL, and `COUNT(DISTINCT column)` counts the different non-NULL values. `SUM`, `AVG`, `MIN` and `MAX` ignore NULL values.",
        "`GROUP BY` splits the rows into groups that share the same values in the listed columns, and the aggregate is computed for each group.",
      ],
    },
    {
      kind: "code",
      heading: "Grouping",
      example: {
        title: "Orders per customer",
        language: "sql",
        code: "SELECT customer_id,\n       COUNT(*) AS orders,\n       SUM(total) AS spent,\n       AVG(total) AS average\nFROM orders\nGROUP BY customer_id\nORDER BY customer_id;\n\nSELECT customer_id, SUM(total) AS spent\nFROM orders\nWHERE created >= '2025-01-01'\nGROUP BY customer_id\nHAVING SUM(total) > 40;\n\nSELECT COUNT(*), COUNT(customer_id), COUNT(DISTINCT customer_id)\nFROM orders;",
        walkthrough: [
          "Each row of the first result describes one customer: how many orders, the sum and the average of their totals.",
          "`WHERE` filters rows before grouping, here by date. `HAVING` filters groups after the aggregates are computed, here keeping customers who spent more than 40.",
          "In the last query, `COUNT(*)` counts all rows, `COUNT(customer_id)` skips orders with a NULL customer, and `COUNT(DISTINCT …)` counts each customer once.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Rules to remember",
      body: [
        "Every column in the `SELECT` list must either appear in `GROUP BY` or be inside an aggregate function. Otherwise the database cannot decide which value of the column to show for the group.",
        "Use `WHERE` for conditions on individual rows and `HAVING` for conditions on aggregates. Filtering rows early with `WHERE` is usually cheaper than filtering groups later.",
        "NULL values form their own group in `GROUP BY`. Use `COALESCE` to give them a label if you want to show them clearly.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Selecting a column that is neither grouped nor aggregated.",
          fix: "Add it to GROUP BY or wrap it in an aggregate such as MAX.",
        },
        {
          mistake: "Using WHERE SUM(total) > 40.",
          fix: "Aggregates cannot appear in WHERE. Use HAVING.",
        },
        {
          mistake: "Expecting COUNT(column) to count NULLs.",
          fix: "COUNT(column) skips NULLs. Use COUNT(*) to count rows.",
        },
        {
          mistake: "Averaging averages.",
          fix: "Compute the average from the underlying rows, or sum and count separately.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A monthly sales summary",
      scenario:
        "A manager wants the number of orders and the total sales for each month, only for months above a threshold.",
      body: [
        "Extract the month from the order date, group by it, compute `COUNT(*)` and `SUM(total)`, and add `HAVING SUM(total) > …` for the threshold. Sort by month to read the result in order.",
        "Check the numbers on a small sample by adding them up by hand.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "where-vs-having",
      prompt: "Which clause filters on the result of an aggregate such as SUM?",
      options: ["HAVING", "WHERE", "ORDER BY"],
      answer: 0,
      explanation:
        "HAVING filters groups after aggregation. WHERE filters rows before it.",
    },
    {
      type: "output",
      id: "count-null",
      prompt: "orders has 5 rows and one of them has a NULL customer_id. What does COUNT(customer_id) return?",
      code: {
        language: "sql",
        code: "SELECT COUNT(customer_id) FROM orders;",
      },
      options: ["4", "5", "1"],
      answer: 0,
      explanation:
        "COUNT(column) counts only the rows where the column is not NULL, so 4.",
    },
    {
      type: "truefalse",
      id: "avg-null",
      statement: "AVG ignores NULL values.",
      answer: true,
      explanation:
        "NULL values are left out of the calculation, as in SUM, MIN and MAX.",
    },
    {
      type: "blank",
      id: "group-clause",
      prompt: "Rows that share the same values in the listed columns are collected by GROUP ___.",
      answer: "BY",
      explanation:
        "`GROUP BY columns` forms the groups.",
    },
  ],
  assignment: {
    title: "Sales summaries",
    task: [
      "Using an orders table, write queries for: orders and revenue per customer, revenue per month, customers who spent more than a threshold, and the number of distinct customers per month.",
      "Compare COUNT(*), COUNT(column) and COUNT(DISTINCT column) on data that includes NULL.",
    ],
    checklist: [
      "Every selected column is grouped or aggregated",
      "I used both WHERE and HAVING in one query",
      "I explained the three COUNT forms on the same data",
      "I checked one result by hand",
    ],
    hints: ["Add a few orders with a NULL customer to see the COUNT differences."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "big-spenders",
      title: "Big spenders",
      task: [
        "Write a query that returns each customer_id and their total spending, only for customers whose total is above 60, biggest first.",
      ],
      language: "sql",
      starter: "SELECT\nFROM orders\n;",
      solution:
        "SELECT customer_id, SUM(total) AS spent\nFROM orders\nGROUP BY customer_id\nHAVING SUM(total) > 60\nORDER BY spent DESC;",
      hints: ["Group by customer, then filter the groups with HAVING."],
      checklist: [
        "The query groups by customer_id",
        "HAVING filters on the sum",
        "The result is sorted by the total, descending",
      ],
    },
  ],
  revisionNotes: [
    "COUNT(*) counts rows; COUNT(col) skips NULLs; COUNT(DISTINCT col) counts distinct values",
    "SUM, AVG, MIN and MAX ignore NULLs",
    "WHERE filters rows before grouping; HAVING filters groups",
    "Selected columns must be grouped or aggregated",
  ],
  resources: [
    {
      label: "PostgreSQL: Aggregate functions",
      url: "https://www.postgresql.org/docs/current/functions-aggregate.html",
    },
    {
      label: "PostgreSQL tutorial: Aggregate functions",
      url: "https://www.postgresql.org/docs/current/tutorial-agg.html",
    },
    {
      label: "PostgreSQL: GROUP BY and HAVING",
      url: "https://www.postgresql.org/docs/current/queries-table-expressions.html",
    },
  ],
})
