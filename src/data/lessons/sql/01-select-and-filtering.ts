import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "select-and-filtering",
  title: "SELECT, WHERE, ORDER BY and NULL",
  topic: "SELECT & filtering",
  minutes: 60,
  overview:
    "Read data with SELECT: choose columns, filter rows with WHERE, sort and limit results, remove duplicates, and handle NULL correctly.",
  objectives: [
    "Write SELECT queries with WHERE, ORDER BY, DISTINCT, LIMIT and OFFSET",
    "Use comparison operators, AND, OR, NOT, IN, BETWEEN and LIKE",
    "Explain how NULL behaves and test for it with IS NULL",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Asking a table a question",
      body: [
        "`SELECT` retrieves rows from one or more tables. The list after `SELECT` chooses the columns, `FROM` names the table, and `WHERE` keeps only the rows for which a condition is true. `SELECT *` returns every column, but naming the columns you need is clearer and safer.",
        "`ORDER BY` sorts the result, ascending by default and descending with `DESC`. Without `ORDER BY` the database makes no promise about the order of rows. `LIMIT n` returns at most `n` rows and `OFFSET m` skips the first `m`, which is how simple paging works.",
        "`DISTINCT` removes duplicate rows from the result, and `AS` gives a column or expression a new name.",
      ],
    },
    {
      kind: "code",
      heading: "Filtering",
      example: {
        title: "Conditions on a products table",
        language: "sql",
        code: "SELECT name, price\nFROM products\nWHERE category = 'writing' AND price < 2\nORDER BY price DESC;\n\nSELECT DISTINCT category FROM products ORDER BY category;\n\nSELECT name FROM products\nWHERE price BETWEEN 2 AND 4;\n\nSELECT name FROM products\nWHERE category IN ('paper', 'office')\nORDER BY name\nLIMIT 2 OFFSET 1;\n\nSELECT name FROM products WHERE name LIKE '%er';",
        walkthrough: [
          "`AND` needs both conditions to be true. `OR` needs one. `NOT` reverses a condition, and parentheses make the grouping clear.",
          "`BETWEEN 2 AND 4` includes both ends, so it is the same as `price >= 2 AND price <= 4`.",
          "`IN (…)` tests membership of a list and is shorter than several `OR` conditions.",
          "`LIKE` matches patterns: `%` stands for any number of characters and `_` for exactly one.",
          "`LIMIT 2 OFFSET 1` skips the first row of the sorted result and returns the next two.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "NULL means unknown",
      body: [
        "`NULL` marks a missing or unknown value. It is not zero and not an empty string. Any comparison with `NULL` using `=`, `<>` or `<` gives unknown, which `WHERE` treats as not true, so the row is not returned.",
        "That is why `WHERE stock <> 100` does not return rows whose `stock` is `NULL`. To test for it, use `IS NULL` or `IS NOT NULL`.",
        "Aggregates such as `AVG` ignore `NULL` values, and `COALESCE(x, 0)` replaces a `NULL` with a fallback value.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing column = NULL.",
          fix: "Use IS NULL. A comparison with NULL is never true.",
        },
        {
          mistake: "Mixing AND and OR without parentheses.",
          fix: "AND binds tighter than OR. Add parentheses to show your intent.",
        },
        {
          mistake: "Relying on row order without ORDER BY.",
          fix: "Always add ORDER BY when the order matters, and when you use LIMIT.",
        },
        {
          mistake: "Using SELECT * in application code.",
          fix: "Name the columns you need, so changes to the table do not break the query.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A product search page",
      scenario:
        "A search page must show the cheapest in-stock paper products, ten at a time.",
      body: [
        "Filter with `WHERE category = 'paper' AND stock > 0`, sort with `ORDER BY price`, and page with `LIMIT 10 OFFSET 0`, `OFFSET 10` for the next page, and so on. Rows with an unknown `stock` do not satisfy `stock > 0`.",
        "Decide deliberately how products with a missing `stock` should be treated, and add `OR stock IS NULL` if they should appear.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "null-test",
      prompt: "How do you find rows where stock has no value?",
      options: ["WHERE stock IS NULL", "WHERE stock = NULL", "WHERE stock = ''"],
      answer: 0,
      explanation:
        "Comparisons with NULL are never true, so use IS NULL.",
    },
    {
      type: "output",
      id: "null-excluded",
      prompt: "A table has stock values 100, 250, NULL, 40 and 15. How many rows does SELECT COUNT(*) FROM products WHERE stock <> 100 return as its count?",
      code: {
        language: "sql",
        code: "SELECT COUNT(*) FROM products WHERE stock <> 100;",
      },
      options: ["3", "4", "5"],
      answer: 0,
      explanation:
        "The rows with 250, 40 and 15 qualify. The NULL row is not returned, because NULL <> 100 is unknown.",
    },
    {
      type: "truefalse",
      id: "between-inclusive",
      statement: "BETWEEN 2 AND 4 includes both 2 and 4.",
      answer: true,
      explanation:
        "BETWEEN is inclusive of both ends.",
    },
    {
      type: "blank",
      id: "remove-duplicates",
      prompt: "Use SELECT ___ to remove duplicate rows from a result.",
      answer: "DISTINCT",
      explanation:
        "`SELECT DISTINCT` returns each distinct row once.",
    },
  ],
  assignment: {
    title: "Ten queries on one table",
    task: [
      "Create a products table with a few rows, including some NULL values, and write ten queries that use WHERE, ORDER BY, DISTINCT, LIMIT, OFFSET, IN, BETWEEN, LIKE and IS NULL.",
      "For each query, write down the result you expect before you run it.",
    ],
    checklist: [
      "I used IS NULL and IS NOT NULL",
      "I checked a <> comparison against a NULL row",
      "I paged with LIMIT and OFFSET with an ORDER BY",
      "My predictions matched the results, or I understood why not",
    ],
    hints: ["Use a free in-memory SQLite or PostgreSQL database to practise."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "cheap-writing-items",
      title: "Filter and sort",
      task: [
        "Write a query that returns the name and price of products in the 'writing' category that cost less than 3, cheapest first.",
      ],
      language: "sql",
      starter: "SELECT\nFROM products\n;",
      solution:
        "SELECT name, price\nFROM products\nWHERE category = 'writing' AND price < 3\nORDER BY price ASC;",
      hints: ["Combine two conditions with AND and finish with ORDER BY."],
      checklist: [
        "Only name and price are selected",
        "Both conditions are in WHERE",
        "The result is sorted by price ascending",
      ],
    },
  ],
  revisionNotes: [
    "SELECT columns FROM table WHERE condition ORDER BY … LIMIT … OFFSET …",
    "Comparisons with NULL are unknown: use IS NULL / IS NOT NULL",
    "AND binds tighter than OR; use parentheses",
    "No ORDER BY means no promised order; LIMIT needs one",
  ],
  resources: [
    {
      label: "PostgreSQL: Queries",
      url: "https://www.postgresql.org/docs/current/queries.html",
    },
    {
      label: "PostgreSQL: Sorting rows and LIMIT / OFFSET",
      url: "https://www.postgresql.org/docs/current/queries-limit.html",
    },
    {
      label: "PostgreSQL: Comparison functions and operators",
      url: "https://www.postgresql.org/docs/current/functions-comparison.html",
    },
  ],
})
