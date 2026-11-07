import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "subqueries",
  title: "Subqueries, EXISTS and CTEs",
  topic: "Subqueries",
  minutes: 60,
  overview:
    "Put one query inside another: scalar, list and table subqueries, correlated subqueries, EXISTS, the NOT IN trap with NULL, and WITH queries for readable steps.",
  objectives: [
    "Use a subquery in WHERE, in the SELECT list and in FROM",
    "Choose between IN, EXISTS and a join, and avoid the NOT IN trap",
    "Write a WITH query (common table expression) to name an intermediate result",
  ],
  prerequisites: ["lesson.sql.select-and-filtering", "lesson.sql.joins"],
  sections: [
    {
      kind: "explain",
      heading: "A query inside a query",
      body: [
        "A **subquery** is a `SELECT` written inside another statement, in parentheses. A **scalar** subquery returns one value and can be used where a single value is expected, such as `total > (SELECT AVG(total) FROM orders)`. A subquery that returns a column of values can be used with `IN`.",
        "A subquery in `FROM` acts as a temporary table and must be given an alias. A **correlated** subquery refers to a column of the outer query and is logically evaluated once for each outer row.",
        "`EXISTS (subquery)` is true when the subquery returns at least one row. It stops looking as soon as it finds a row, and the columns it selects do not matter, so `SELECT 1` is common.",
      ],
    },
    {
      kind: "code",
      heading: "Common shapes",
      example: {
        title: "IN, EXISTS and a scalar subquery",
        language: "sql",
        code: "SELECT name FROM customers\nWHERE id IN (SELECT customer_id FROM orders WHERE total > 40);\n\nSELECT name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);\n\nSELECT id, total FROM orders\nWHERE total > (SELECT AVG(total) FROM orders);\n\nSELECT c.name,\n       (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders\nFROM customers c;",
        walkthrough: [
          "The first query keeps customers whose id appears in the list of customers with a large order.",
          "The second is correlated: for each customer it asks whether any order refers to that customer.",
          "The third compares each order with the single average value.",
          "The last puts a correlated scalar subquery in the SELECT list to count each customer's orders, giving 0 where there are none.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "NOT IN and NULL",
      body: [
        "`x NOT IN (list)` is false if `x` equals any value, and unknown if the list contains a `NULL` and `x` matches nothing. Unknown is not true, so no rows are returned.",
        "If `orders.customer_id` can be `NULL`, `WHERE id NOT IN (SELECT customer_id FROM orders)` returns nothing at all, even for customers with no orders.",
        "Use `NOT EXISTS`, which has no such problem, or add `WHERE customer_id IS NOT NULL` to the subquery.",
      ],
    },
    {
      kind: "code",
      heading: "Common table expressions",
      example: {
        title: "WITH names the steps",
        language: "sql",
        code: "WITH spending AS (\n  SELECT customer_id, SUM(total) AS spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.name, s.spent\nFROM spending s\nJOIN customers c ON c.id = s.customer_id\nORDER BY s.spent DESC;",
        walkthrough: [
          "`WITH spending AS (…)` defines a named temporary result that exists for this one statement.",
          "The main query then uses `spending` like a table, which reads top to bottom instead of from the inside out.",
          "You can define several named queries, separated by commas, and later ones can use earlier ones.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using NOT IN with a subquery that can return NULL.",
          fix: "Use NOT EXISTS, or filter NULLs out of the subquery.",
        },
        {
          mistake: "A scalar subquery that returns more than one row.",
          fix: "Make it return exactly one value, for example with an aggregate, or use IN.",
        },
        {
          mistake: "Forgetting the alias on a subquery in FROM.",
          fix: "Give every derived table an alias.",
        },
        {
          mistake: "Deeply nested subqueries that nobody can read.",
          fix: "Name the steps with WITH.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Customers above the average",
      scenario:
        "You need the customers whose total spending is above the average spending of customers who ordered.",
      body: [
        "First compute each customer's total in a `WITH` query. Then compare each total with `(SELECT AVG(spent) FROM spending)` in the main query.",
        "Naming the first step also lets you check it on its own before building on it.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "not-in-null",
      prompt: "orders.customer_id contains a NULL. What does this return?",
      code: {
        language: "sql",
        code: "SELECT name FROM customers\nWHERE id NOT IN (SELECT customer_id FROM orders);",
      },
      options: ["No rows", "Customers with no orders", "All customers"],
      answer: 0,
      explanation:
        "Because the list contains NULL, the NOT IN test is never true, so no rows are returned. Use NOT EXISTS.",
    },
    {
      type: "single",
      id: "exists-meaning",
      prompt: "When is EXISTS (subquery) true?",
      options: [
        "When the subquery returns at least one row",
        "When the subquery returns the value 1",
        "When the subquery returns no rows",
      ],
      answer: 0,
      explanation:
        "EXISTS only checks whether any row is returned.",
    },
    {
      type: "truefalse",
      id: "derived-alias",
      statement: "A subquery used in the FROM clause needs an alias.",
      answer: true,
      explanation:
        "A derived table must be given a name so it can be referenced.",
    },
    {
      type: "blank",
      id: "cte-keyword",
      prompt: "A named temporary result for one statement is defined with ___ name AS (…).",
      answer: "WITH",
      explanation:
        "`WITH name AS (query)` defines a common table expression.",
    },
  ],
  assignment: {
    title: "Rewrite three ways",
    task: [
      "Find the customers who have placed at least one order using IN, EXISTS and a join. Then find those with none using NOT EXISTS and a LEFT JOIN.",
      "Add an order with a NULL customer and show that NOT IN breaks.",
    ],
    checklist: [
      "All three 'has orders' queries return the same customers",
      "Both 'no orders' queries return the same customers",
      "I demonstrated NOT IN returning nothing because of NULL",
      "I rewrote a nested query with WITH",
    ],
    hints: ["Use a small data set so you can compare the results by eye."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "above-average-orders",
      title: "Above-average orders",
      task: [
        "Return the id and total of orders whose total is greater than the average total of all orders, biggest first.",
      ],
      language: "sql",
      starter: "SELECT\nFROM orders\n;",
      solution:
        "SELECT id, total\nFROM orders\nWHERE total > (SELECT AVG(total) FROM orders)\nORDER BY total DESC;",
      hints: ["The average is a scalar subquery."],
      checklist: [
        "A scalar subquery computes the average",
        "Only orders above it are returned",
        "The result is sorted by total, descending",
      ],
    },
  ],
  revisionNotes: [
    "Scalar, list (IN), table (FROM) and correlated subqueries",
    "EXISTS tests for any row; NOT EXISTS is safe with NULLs",
    "NOT IN with a NULL in the list returns no rows",
    "WITH names intermediate steps",
  ],
  resources: [
    {
      label: "PostgreSQL: Subquery expressions",
      url: "https://www.postgresql.org/docs/current/functions-subquery.html",
    },
    {
      label: "PostgreSQL: WITH queries",
      url: "https://www.postgresql.org/docs/current/queries-with.html",
    },
    {
      label: "PostgreSQL: Subqueries in the FROM clause",
      url: "https://www.postgresql.org/docs/current/queries-table-expressions.html",
    },
  ],
})
