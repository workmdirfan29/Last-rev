import { defineQuestions } from "../author"

const PG = "https://www.postgresql.org/docs/current"

export default defineQuestions("sql", "fresher", [
  {
    slug: "where-vs-having",
    topic: "Aggregation",
    difficulty: "easy",
    title: "What is the difference between WHERE and HAVING?",
    keywords: ["where", "having", "group by", "aggregate", "filter"],
    interviewerIntent:
      "Tests whether you understand the order in which SQL evaluates a query.",
    shortAnswer:
      "`WHERE` filters individual rows before grouping, so it cannot use aggregate functions. `HAVING` filters groups after `GROUP BY` and can use aggregates like `COUNT` or `SUM`. Filter rows with `WHERE` first whenever possible, because it reduces the data before aggregation.",
    detailedAnswer: [
      "Logical execution order: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.",
      "Because `WHERE` runs before grouping, aggregate values don't exist yet, so `WHERE COUNT(*) > 5` is invalid. `HAVING` runs after groups are formed.",
      "Put conditions on plain columns in `WHERE` — it's faster because fewer rows are grouped, and can use indexes. Use `HAVING` only for conditions on aggregates.",
    ],
    realWorldExample:
      "Find customers from India who placed more than 5 orders: `WHERE country = 'India'` filters rows, `HAVING COUNT(*) > 5` filters the grouped result.",
    codeExamples: [
      {
        title: "Both together",
        language: "sql",
        code: `SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS spent
FROM orders
WHERE status = 'PAID'            -- row filter (before grouping)
GROUP BY customer_id
HAVING COUNT(*) > 5              -- group filter (after grouping)
ORDER BY spent DESC;`,
        walkthrough: [
          "`WHERE` keeps only paid orders before any grouping happens.",
          "`GROUP BY` collects the remaining rows into one group per customer.",
          "`HAVING` keeps only customers whose group has more than 5 orders.",
          "`ORDER BY` sorts the final result by total spent.",
        ],
      },
    ],
    commonMistakes: [
      "Using an aggregate in `WHERE`.",
      "Putting a plain-column condition in `HAVING`, which is slower.",
    ],
    followUps: [
      {
        question: "Can you use a column alias in WHERE?",
        hint: "No — SELECT is evaluated after WHERE.",
      },
      { question: "What is the logical order of SQL query execution?" },
    ],
    answerTips: [
      "State the execution order — it explains the rule instead of just stating it.",
    ],
    keyPoints: [
      "WHERE: rows, before grouping",
      "HAVING: groups, after grouping",
      "Aggregates only in HAVING",
      "Filter early with WHERE",
    ],
    revisionNotes: ["WHERE rows → GROUP BY → HAVING groups."],
    sourceRefs: [
      {
        label: "PostgreSQL: GROUP BY and HAVING",
        url: `${PG}/queries-table-expressions.html#QUERIES-GROUP`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "types-of-joins",
    topic: "Joins",
    difficulty: "easy",
    title: "Explain INNER, LEFT, RIGHT and FULL OUTER JOIN with an example.",
    keywords: ["join", "inner join", "left join", "outer join", "null"],
    interviewerIntent:
      "Joins appear in almost every SQL interview. They test whether you can reason about which rows survive.",
    shortAnswer:
      "`INNER JOIN` returns only rows that match in both tables. `LEFT JOIN` returns all rows from the left table plus matching rows from the right, with NULLs where there is no match. `RIGHT JOIN` is the mirror image. `FULL OUTER JOIN` returns all rows from both tables, filling NULLs on whichever side has no match.",
    detailedAnswer: [
      "Imagine `customers` and `orders`. An **INNER JOIN** gives only customers who have orders.",
      "A **LEFT JOIN** from customers to orders gives *every* customer; customers without orders get NULL in the order columns. This is how you find 'customers with no orders': `WHERE o.id IS NULL`.",
      "**RIGHT JOIN** is rarely used — swap table order and use LEFT JOIN for readability.",
      "**FULL OUTER JOIN** keeps unmatched rows from both sides. `CROSS JOIN` returns every combination (Cartesian product).",
      "Be careful: a condition on the right table in the `WHERE` clause of a LEFT JOIN turns it into an inner join. Put such conditions in the `ON` clause.",
    ],
    realWorldExample:
      "A report must list all products, including those never sold. A LEFT JOIN from `products` to `order_items` keeps unsold products with a NULL quantity, while an INNER JOIN would silently drop them.",
    codeExamples: [
      {
        title: "Customers with no orders",
        language: "sql",
        code: `-- All customers with their order count (0 if none)
SELECT c.id, c.name, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- Only customers with no orders
SELECT c.*
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`,
        walkthrough: [
          "LEFT JOIN keeps every customer even if no order matches.",
          "`COUNT(o.id)` ignores NULLs, so customers without orders show 0.",
          "In the second query, `o.id IS NULL` keeps only the rows where the join found no match.",
        ],
      },
    ],
    diagram: {
      kind: "table",
      title: "Which rows survive?",
      headers: [
        "Join",
        "Matched rows",
        "Unmatched left rows",
        "Unmatched right rows",
      ],
      rows: [
        ["INNER", "Yes", "No", "No"],
        ["LEFT", "Yes", "Yes (right = NULL)", "No"],
        ["RIGHT", "Yes", "No", "Yes (left = NULL)"],
        ["FULL OUTER", "Yes", "Yes", "Yes"],
      ],
    },
    commonMistakes: [
      "Filtering the right table in `WHERE` after a LEFT JOIN (silently makes it an INNER JOIN).",
      "Joining without an `ON` condition and getting a Cartesian product.",
      "Using `COUNT(*)` instead of `COUNT(o.id)` on a LEFT JOIN.",
    ],
    followUps: [
      {
        question: "What is a self join? Give an example.",
        hint: "Employees and their managers in one table.",
      },
      { question: "What is the difference between JOIN and UNION?" },
    ],
    answerTips: [
      "Use customers/orders and finish with the 'no orders' query — it is the follow-up interviewers ask anyway.",
    ],
    keyPoints: [
      "INNER: both match",
      "LEFT: all left + matches",
      "FULL: everything",
      "WHERE after LEFT JOIN can negate it",
    ],
    revisionNotes: ["LEFT JOIN + IS NULL = rows with no match."],
    sourceRefs: [
      {
        label: "PostgreSQL: Joins Between Tables",
        url: `${PG}/tutorial-join.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "primary-vs-foreign-key",
    topic: "Constraints",
    difficulty: "easy",
    title: "What are primary keys and foreign keys? How do they differ?",
    keywords: [
      "primary key",
      "foreign key",
      "constraint",
      "referential integrity",
      "unique",
    ],
    interviewerIntent:
      "Fundamental data-modelling knowledge: identity and relationships.",
    shortAnswer:
      "A primary key uniquely identifies each row in a table; it cannot be NULL or duplicated, and a table has only one. A foreign key is a column that references the primary key of another table to create a relationship and enforce referential integrity, so you cannot reference a row that does not exist.",
    detailedAnswer: [
      "The **primary key** guarantees row identity and is automatically indexed. It can be a natural key (e.g. ISBN) or a surrogate key (auto-increment id / UUID), and may be composite.",
      "A **foreign key** may be NULL (if the relationship is optional) and may repeat — many orders can reference one customer.",
      "Foreign keys enforce rules: you can't insert an order for a non-existent customer, and you can't delete a customer who has orders unless you define an action — `ON DELETE CASCADE`, `SET NULL`, or `RESTRICT`.",
      "A `UNIQUE` constraint also prevents duplicates but allows NULL (behaviour varies by database), and a table can have several.",
    ],
    realWorldExample:
      "In an e-commerce schema, `orders.customer_id` is a foreign key to `customers.id`. Deleting a customer with `ON DELETE RESTRICT` is blocked until their orders are handled.",
    codeExamples: [
      {
        title: "Schema with relationships",
        language: "sql",
        code: `CREATE TABLE customers (
  id    BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  total       NUMERIC(10,2) NOT NULL CHECK (total >= 0)
);`,
        walkthrough: [
          "`customers.id` is the primary key; `email` is unique but not the key.",
          "`orders.customer_id` is a foreign key referencing `customers(id)`.",
          "`ON DELETE RESTRICT` blocks deleting a customer who still has orders.",
          "`CHECK` adds an extra rule: totals can't be negative.",
        ],
      },
    ],
    commonMistakes: [
      "Saying a foreign key must be unique.",
      "Not indexing foreign key columns, which slows joins and deletes.",
      "Using a mutable value (such as email) as the primary key.",
    ],
    followUps: [
      {
        question:
          "What is the difference between a primary key and a unique key?",
      },
      { question: "What is a composite key?" },
      { question: "What does ON DELETE CASCADE do and when is it dangerous?" },
    ],
    answerTips: ["Mention referential integrity by name."],
    keyPoints: [
      "PK: unique, not null, one per table",
      "FK: references another table's key",
      "Referential integrity",
      "ON DELETE actions",
    ],
    revisionNotes: ["PK identifies. FK relates. Both enforce integrity."],
    sourceRefs: [
      { label: "PostgreSQL: Constraints", url: `${PG}/ddl-constraints.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "delete-truncate-drop",
    topic: "DDL & DML",
    difficulty: "easy",
    title: "What is the difference between DELETE, TRUNCATE and DROP?",
    keywords: ["delete", "truncate", "drop", "dml", "ddl", "rollback"],
    interviewerIntent:
      "Checks you understand the scope, speed and recoverability of destructive commands.",
    shortAnswer:
      "`DELETE` removes selected rows (with an optional `WHERE`), logs each row, fires row triggers and can be rolled back. `TRUNCATE` quickly removes all rows from a table while keeping its structure. `DROP` removes the table itself — structure, data and indexes. DELETE is DML; TRUNCATE and DROP are DDL.",
    detailedAnswer: [
      "`DELETE FROM t WHERE ...` is selective and row-by-row, so it's slower on large tables but gives precise control and fires `ON DELETE` triggers.",
      "`TRUNCATE TABLE t` empties the whole table fast, reclaims space, and may reset identity counters (`RESTART IDENTITY` in PostgreSQL). It can't take a `WHERE`.",
      "Transaction behaviour differs per database: in PostgreSQL both `DELETE` and `TRUNCATE` are transactional and can be rolled back; in MySQL and Oracle, `TRUNCATE` causes an implicit commit.",
      "`DROP TABLE t` removes the object entirely; recreating it is the only way back. Treat DROP and TRUNCATE like production-level hazards: use a transaction, confirm the environment, and have a backup.",
    ],
    realWorldExample:
      "Clearing a staging table before every nightly import is a good use of `TRUNCATE`. Removing a single customer's data for a privacy request needs `DELETE ... WHERE`.",
    codeExamples: [
      {
        title: "Three commands, three scopes",
        language: "sql",
        code: `DELETE FROM sessions WHERE expires_at < now();   -- some rows
TRUNCATE TABLE import_staging RESTART IDENTITY;  -- all rows, keep table
DROP TABLE IF EXISTS tmp_report;                 -- the table itself`,
        walkthrough: [
          "`DELETE` removes only expired sessions.",
          "`TRUNCATE` empties the staging table and restarts its id sequence.",
          "`DROP` deletes the temporary report table completely.",
        ],
      },
    ],
    commonMistakes: [
      "Running `DELETE` without `WHERE`.",
      "Assuming TRUNCATE can always be rolled back (database-dependent).",
      "Using DELETE to clear millions of rows when TRUNCATE is appropriate.",
    ],
    followUps: [
      {
        question: "How would you safely delete millions of rows?",
        hint: "Batch with LIMIT/CTE, commit between batches, or partition and drop partitions.",
      },
      { question: "Do DELETE and TRUNCATE reset auto-increment?" },
    ],
    answerTips: ["Sort the answer by scope: some rows → all rows → the table."],
    keyPoints: [
      "DELETE: rows, WHERE, triggers, DML",
      "TRUNCATE: all rows, fast, DDL",
      "DROP: removes the table",
      "Transaction rules vary by DB",
    ],
    revisionNotes: ["DELETE some, TRUNCATE all, DROP table."],
    sourceRefs: [
      { label: "PostgreSQL: TRUNCATE", url: `${PG}/sql-truncate.html` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "group-by-basics",
    topic: "Aggregation",
    difficulty: "easy",
    title:
      "How does GROUP BY work, and what is the difference between COUNT(*) and COUNT(column)?",
    keywords: ["group by", "count", "aggregate", "null", "distinct"],
    interviewerIntent:
      "Tests aggregation fundamentals and NULL handling, which cause many real-world reporting bugs.",
    shortAnswer:
      "`GROUP BY` splits rows into groups that share the same values in the listed columns, and aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) compute one result per group. Every selected column must either be in `GROUP BY` or be inside an aggregate. `COUNT(*)` counts rows; `COUNT(column)` counts only rows where that column is not NULL.",
    detailedAnswer: [
      "Without `GROUP BY`, aggregates collapse the whole table into one row. With it, you get one row per distinct combination of the grouped columns.",
      "Aggregates ignore NULLs except `COUNT(*)`. So `COUNT(phone)` counts customers with a phone number, whereas `COUNT(*)` counts all customers. `COUNT(DISTINCT city)` counts unique non-null cities.",
      "PostgreSQL requires every non-aggregated column in `SELECT` to appear in `GROUP BY` (or be functionally dependent on the primary key). MySQL in permissive modes may allow ambiguous queries — avoid them.",
      "Use `HAVING` to filter groups and `ORDER BY` to sort them.",
    ],
    realWorldExample:
      "A sales report: total revenue and number of orders per month — `GROUP BY date_trunc('month', created_at)`.",
    codeExamples: [
      {
        title: "COUNT variants",
        language: "sql",
        code: `SELECT
  COUNT(*)              AS all_customers,
  COUNT(phone)          AS with_phone,
  COUNT(DISTINCT city)  AS distinct_cities
FROM customers;

SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
ORDER BY customers DESC;`,
        walkthrough: [
          "`COUNT(*)` counts every row.",
          "`COUNT(phone)` skips rows where `phone` is NULL.",
          "`COUNT(DISTINCT city)` counts each non-null city once.",
          "The second query returns one row per city with how many customers it has.",
        ],
      },
    ],
    commonMistakes: [
      "Selecting a non-grouped, non-aggregated column.",
      "Expecting `COUNT(column)` to count NULLs.",
      "Forgetting `AVG` ignores NULLs, which can skew results.",
    ],
    followUps: [
      {
        question: "How do NULLs behave in GROUP BY?",
        hint: "All NULLs form a single group.",
      },
      { question: "What is the difference between WHERE and HAVING?" },
    ],
    answerTips: ["Show the three COUNT variants side by side."],
    keyPoints: [
      "One row per group",
      "Aggregates ignore NULLs (except COUNT(*))",
      "Select list must be grouped or aggregated",
      "HAVING filters groups",
    ],
    revisionNotes: [
      "COUNT(*) rows, COUNT(col) non-null, COUNT(DISTINCT col) unique.",
    ],
    sourceRefs: [
      {
        label: "PostgreSQL: Aggregate Functions",
        url: `${PG}/tutorial-agg.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "what-is-an-index",
    topic: "Indexes",
    difficulty: "medium",
    title:
      "What is a database index and what are the trade-offs of adding one?",
    keywords: ["index", "b-tree", "performance", "query", "write overhead"],
    interviewerIntent:
      "Tests basic performance reasoning — knowing both the benefit and the cost.",
    shortAnswer:
      "An index is a separate data structure (commonly a B-tree) that lets the database find rows by the indexed column without scanning the whole table, much like a book's index. It speeds up reads (`WHERE`, `JOIN`, `ORDER BY`) but costs storage and slows writes, because every insert, update and delete must also maintain the index.",
    detailedAnswer: [
      "Without an index the database does a **sequential scan** — reading every row. With a B-tree index on the filtered column it can jump to matching rows in roughly logarithmic time.",
      "Index columns used frequently in `WHERE`, `JOIN` conditions (foreign keys!) and `ORDER BY`, and that are **selective** (many distinct values). An index on a boolean column with 50/50 distribution rarely helps.",
      "**Composite indexes** follow the *left-most prefix* rule: an index on `(a, b)` helps queries on `a` and on `a, b`, but not on `b` alone.",
      "Costs: extra disk space, slower `INSERT/UPDATE/DELETE`, and more for the planner to consider. Don't index everything — add indexes for real query patterns and check with `EXPLAIN` (or `EXPLAIN ANALYZE`).",
      "Functions on the column (`WHERE lower(email) = ...`) can prevent index use unless you create an expression index.",
    ],
    realWorldExample:
      "Login lookups by `email` on a 10-million-row `users` table took seconds. Adding a unique index on `email` brought them down to milliseconds, and also enforced uniqueness.",
    codeExamples: [
      {
        title: "Creating and verifying an index",
        language: "sql",
        code: `CREATE INDEX idx_orders_customer_created
  ON orders (customer_id, created_at);

EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
-- Expect "Index Scan" instead of "Seq Scan"`,
        walkthrough: [
          "The composite index supports filtering by customer and sorting by date.",
          "`EXPLAIN ANALYZE` runs the query and shows the real plan and timing.",
          "An `Index Scan` (rather than `Seq Scan`) confirms the planner is using the index.",
        ],
      },
    ],
    commonMistakes: [
      "Indexing every column.",
      "Ignoring the left-most prefix rule for composite indexes.",
      "Wrapping the indexed column in a function in the WHERE clause.",
      "Never checking the query plan.",
    ],
    followUps: [
      { question: "What is a clustered vs non-clustered index?" },
      {
        question: "Why might the database ignore your index?",
        hint: "Low selectivity, small table, function on column, type mismatch.",
      },
    ],
    answerTips: [
      "Give both sides: faster reads, slower writes. Interviewers listen for the trade-off.",
    ],
    keyPoints: [
      "B-tree speeds lookups",
      "Costs space and write speed",
      "Index selective, frequently filtered columns",
      "Left-most prefix rule",
      "Verify with EXPLAIN",
    ],
    revisionNotes: ["Read faster, write slower. Check EXPLAIN."],
    sourceRefs: [
      { label: "PostgreSQL: Indexes", url: `${PG}/indexes-intro.html` },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "sql-command-categories",
    topic: "DDL & DML",
    difficulty: "easy",
    title: "What are DDL, DML, DCL and TCL commands in SQL?",
    keywords: [
      "DDL",
      "DML",
      "DCL",
      "TCL",
      "CREATE",
      "INSERT",
      "GRANT",
      "COMMIT",
    ],
    interviewerIntent:
      "A standard vocabulary check. It shows whether you can place any SQL statement in a category.",
    shortAnswer:
      "SQL commands are grouped by purpose. DDL defines structure: CREATE, ALTER, DROP and TRUNCATE. DML changes data: INSERT, UPDATE and DELETE. DCL controls permissions: GRANT and REVOKE. TCL manages transactions: COMMIT, ROLLBACK and SAVEPOINT. SELECT is often listed as DQL, a query command.",
    detailedAnswer: [
      "DDL statements change the schema: tables, columns, indexes and views. Many databases commit them immediately, but PostgreSQL lets you roll back DDL inside a transaction.",
      "DML statements work on rows and can be rolled back inside a transaction.",
      "DCL decides who can do what: `GRANT SELECT ON orders TO analyst`.",
      "TCL groups several DML statements into one unit of work that either completes or is undone.",
      "Classification varies by textbook. For example, TRUNCATE is usually called DDL and SELECT is sometimes counted as DML.",
    ],
    realWorldExample:
      "A migration script uses DDL to add a column, DML to backfill it, DCL to give the reporting role read access, and TCL to wrap the backfill in a transaction.",
    codeExamples: [
      {
        title: "One example of each",
        language: "sql",
        code: `CREATE TABLE accounts (id INT PRIMARY KEY, balance NUMERIC);  -- DDL
INSERT INTO accounts VALUES (1, 500);                          -- DML
GRANT SELECT ON accounts TO reporting;                         -- DCL
BEGIN;                                                         -- TCL
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;`,
        walkthrough: [
          "`CREATE TABLE` defines a new structure, so it is DDL.",
          "`INSERT` adds a row, so it is DML.",
          "`GRANT` gives a role permission, so it is DCL.",
          "`BEGIN` and `COMMIT` mark a transaction, so they are TCL.",
        ],
      },
    ],
    commonMistakes: [
      "Calling DELETE a DDL command.",
      "Saying DDL can never be rolled back in any database.",
    ],
    followUps: [
      { question: "What is the difference between DELETE, TRUNCATE and DROP?" },
    ],
    answerTips: [
      "Give one command from each group, it shows you can classify rather than memorise.",
    ],
    keyPoints: [
      "DDL = structure",
      "DML = data",
      "DCL = permissions",
      "TCL = transactions",
    ],
    revisionNotes: ["Structure, data, permission, transaction."],
    sourceRefs: [
      { label: "PostgreSQL: SQL Commands", url: `${PG}/sql-commands.html` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "distinct-order-by-limit",
    topic: "SELECT & filtering",
    difficulty: "easy",
    title:
      "How do DISTINCT, ORDER BY and LIMIT work? How do you paginate results?",
    keywords: [
      "DISTINCT",
      "ORDER BY",
      "LIMIT",
      "OFFSET",
      "pagination",
      "FETCH FIRST",
    ],
    interviewerIntent:
      "Checks that you know result order is not guaranteed without ORDER BY and that you can page through data.",
    shortAnswer:
      "`DISTINCT` removes duplicate rows from the result. `ORDER BY` sorts the result, ascending by default, and is the only way to get a guaranteed order. `LIMIT n` returns only the first n rows and `OFFSET m` skips m rows first, which together give pagination. The standard form is `FETCH FIRST n ROWS ONLY`.",
    detailedAnswer: [
      "Without `ORDER BY`, a table has no guaranteed row order, even if the rows came back in insertion order yesterday.",
      "Paging with `LIMIT` and `OFFSET` needs a stable `ORDER BY`, ideally on a unique column, otherwise rows can repeat or go missing between pages.",
      "Large offsets are slow because the database still reads and discards the skipped rows. Keyset pagination, such as `WHERE id > last_seen_id ORDER BY id LIMIT 20`, scales better.",
      "SQL Server uses `TOP n` and Oracle uses `FETCH FIRST`, so syntax differs between databases.",
    ],
    realWorldExample:
      "An orders screen shows 20 rows per page sorted by newest first. Page 3 is `ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 40`.",
    codeExamples: [
      {
        title: "Sorting and paging",
        language: "sql",
        code: `SELECT DISTINCT city FROM customers ORDER BY city;

SELECT id, total
FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 40;       -- page 3

SELECT id, total FROM orders
WHERE id < 1000           -- keyset pagination
ORDER BY id DESC
LIMIT 20;`,
        walkthrough: [
          "`DISTINCT` returns each city once, and `ORDER BY` sorts the list.",
          "The id is added to the sort so rows with the same timestamp keep a stable order.",
          "`OFFSET 40` skips the first two pages of 20 rows.",
          "Keyset pagination continues from the last seen id and avoids reading skipped rows.",
        ],
      },
    ],
    commonMistakes: [
      "Paging without ORDER BY.",
      "Using very large OFFSET values on big tables.",
    ],
    followUps: [
      {
        question: "Why can DISTINCT be expensive?",
        hint: "It needs a sort or hash to find duplicates.",
      },
    ],
    answerTips: [
      "Mention keyset pagination as the scalable alternative to OFFSET.",
    ],
    keyPoints: [
      "No ORDER BY, no guaranteed order",
      "LIMIT plus OFFSET paginates",
      "Add a unique column for stable order",
      "Large OFFSET is slow",
    ],
    revisionNotes: ["Always ORDER BY when paging."],
    sourceRefs: [
      { label: "PostgreSQL: Sorting Rows", url: `${PG}/queries-order.html` },
      {
        label: "PostgreSQL: LIMIT and OFFSET",
        url: `${PG}/queries-limit.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "null-handling",
    topic: "SELECT & filtering",
    difficulty: "medium",
    title:
      "How does NULL behave in SQL? Why does WHERE column = NULL return nothing?",
    keywords: [
      "NULL",
      "IS NULL",
      "COALESCE",
      "three-valued logic",
      "unknown",
      "comparison",
    ],
    interviewerIntent:
      "NULL logic catches many developers out. Interviewers test whether you know it means unknown, not zero or empty.",
    shortAnswer:
      "NULL means a missing or unknown value, not zero and not an empty string. Any comparison with NULL, including `= NULL` and `NULL = NULL`, gives unknown rather than true, so the row is filtered out. Use `IS NULL` and `IS NOT NULL` to test for it, and `COALESCE` to supply a default.",
    detailedAnswer: [
      "SQL uses three-valued logic: true, false and unknown. A `WHERE` clause keeps only rows where the condition is true.",
      "Arithmetic with NULL gives NULL, so `price + NULL` is NULL.",
      "Most aggregate functions ignore NULLs. `AVG` skips them, and `COUNT(column)` does not count them, while `COUNT(*)` counts every row.",
      "`COALESCE(a, b, c)` returns the first non-null argument.",
      "Be careful with `NOT IN` when the list can contain NULL, because it then matches nothing.",
    ],
    realWorldExample:
      "A report shows `COALESCE(discount, 0)` so that missing discounts count as zero in the total instead of turning the whole sum into NULL.",
    codeExamples: [
      {
        title: "Testing for NULL",
        language: "sql",
        code: `SELECT * FROM users WHERE phone = NULL;        -- returns no rows
SELECT * FROM users WHERE phone IS NULL;       -- correct

SELECT name, COALESCE(phone, 'not given') AS contact
FROM users;

SELECT 5 + NULL;   -- NULL`,
        walkthrough: [
          "A comparison with NULL is unknown, so the first query returns nothing.",
          "`IS NULL` is the correct test.",
          "`COALESCE` replaces a missing value with a default for display.",
          "Arithmetic with NULL produces NULL.",
        ],
      },
    ],
    commonMistakes: [
      "Writing `= NULL` instead of `IS NULL`.",
      "Treating NULL as zero or as an empty string.",
      "Forgetting that NOT IN fails when the list contains NULL.",
    ],
    followUps: [
      {
        question: "What is the difference between COUNT(*) and COUNT(column)?",
      },
    ],
    answerTips: [
      "Say 'unknown' rather than 'empty'. It explains every NULL rule.",
    ],
    keyPoints: [
      "NULL = unknown",
      "Comparisons give unknown, not true",
      "IS NULL to test",
      "COALESCE for defaults",
    ],
    revisionNotes: ["NULL is unknown, test with IS NULL."],
    sourceRefs: [
      {
        label: "PostgreSQL: Comparison Functions and Operators",
        url: `${PG}/functions-comparison.html`,
      },
      {
        label: "PostgreSQL: Conditional Expressions (COALESCE)",
        url: `${PG}/functions-conditional.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "self-join-and-cross-join",
    topic: "Joins",
    difficulty: "medium",
    title: "What is a self join and a cross join? When would you use each?",
    keywords: [
      "self join",
      "cross join",
      "cartesian product",
      "alias",
      "hierarchy",
    ],
    interviewerIntent:
      "Checks that you can use joins beyond the basic INNER and LEFT ones.",
    shortAnswer:
      "A self join joins a table to itself using two different aliases, which is how you relate rows in the same table, such as an employee and their manager. A cross join returns every combination of rows from two tables, the Cartesian product, so m rows and n rows give m times n rows. It has no join condition.",
    detailedAnswer: [
      "In a self join you must alias the table twice, otherwise the column names are ambiguous.",
      "Typical self join uses are employee-manager hierarchies, finding pairs of rows in the same table, and comparing a row to the previous one.",
      "A cross join is used to generate combinations, for example every size with every colour for a product catalogue.",
      "Accidentally leaving out the join condition produces a Cartesian product and a huge result.",
    ],
    realWorldExample:
      "An HR screen lists every employee with their manager's name using a self join on `manager_id = id`. A shop builds a variant list with a cross join of sizes and colours.",
    codeExamples: [
      {
        title: "Employee and manager",
        language: "sql",
        code: `SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

SELECT s.size, c.colour
FROM sizes s
CROSS JOIN colours c;      -- every size with every colour`,
        walkthrough: [
          "The same table appears twice with the aliases `e` and `m`.",
          "A LEFT JOIN keeps employees who have no manager, such as the CEO.",
          "The cross join pairs each size with each colour.",
          "Three sizes and four colours produce twelve rows.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting to alias the table in a self join.",
      "Getting a Cartesian product by omitting the join condition.",
    ],
    followUps: [
      {
        question:
          "How would you find employees who earn more than their manager?",
      },
    ],
    answerTips: [
      "Use the employee and manager example, interviewers expect it.",
    ],
    keyPoints: [
      "Self join needs two aliases",
      "Used for hierarchies",
      "Cross join = m times n rows",
      "No ON clause for cross join",
    ],
    revisionNotes: [
      "Self join: same table twice. Cross join: all combinations.",
    ],
    sourceRefs: [
      {
        label: "PostgreSQL: Joined Tables",
        url: `${PG}/queries-table-expressions.html#QUERIES-JOIN`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "union-vs-union-all",
    topic: "Joins",
    difficulty: "easy",
    title:
      "What is the difference between UNION and UNION ALL? What about INTERSECT and EXCEPT?",
    keywords: [
      "UNION",
      "UNION ALL",
      "INTERSECT",
      "EXCEPT",
      "set operations",
      "duplicates",
    ],
    interviewerIntent:
      "A frequent comparison question that checks both the semantics and the performance cost of removing duplicates.",
    shortAnswer:
      "`UNION` combines the results of two queries and removes duplicate rows. `UNION ALL` combines them and keeps every row, so it is faster because it skips the duplicate check. `INTERSECT` returns only rows present in both results, and `EXCEPT` returns rows from the first result that are not in the second. The queries need the same number of columns with compatible types.",
    detailedAnswer: [
      "Column names in the result come from the first query.",
      "Use `UNION ALL` when you know there are no duplicates or you want them, which is common when combining data from different sources.",
      "`UNION` compares whole rows, so a difference in any column keeps both rows.",
      "Oracle uses `MINUS` instead of `EXCEPT`.",
    ],
    realWorldExample:
      "A report combines `orders_2023` and `orders_2024` with `UNION ALL`, because rows from different years cannot be duplicates and the sort is wasted work.",
    codeExamples: [
      {
        title: "Set operations",
        language: "sql",
        code: `SELECT email FROM newsletter_subscribers
UNION
SELECT email FROM customers;          -- unique emails

SELECT email FROM newsletter_subscribers
UNION ALL
SELECT email FROM customers;          -- keeps duplicates

SELECT email FROM customers
EXCEPT
SELECT email FROM unsubscribed;       -- customers not unsubscribed`,
        walkthrough: [
          "`UNION` returns each email once even if it appears in both tables.",
          "`UNION ALL` returns every row, including the duplicate emails.",
          "`EXCEPT` removes emails that appear in the second query.",
        ],
      },
    ],
    commonMistakes: [
      "Using UNION when UNION ALL would do, paying for an unneeded sort.",
      "Mismatched column counts or types.",
    ],
    followUps: [
      {
        question: "How is UNION different from a JOIN?",
        hint: "UNION stacks rows, JOIN adds columns.",
      },
    ],
    answerTips: ["Mention the performance reason for choosing UNION ALL."],
    keyPoints: [
      "UNION removes duplicates",
      "UNION ALL keeps all rows and is faster",
      "Same column count and types",
      "INTERSECT and EXCEPT compare results",
    ],
    revisionNotes: ["UNION dedupes, UNION ALL does not."],
    sourceRefs: [
      {
        label: "PostgreSQL: Combining Queries",
        url: `${PG}/queries-union.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "count-star-vs-count-column",
    topic: "Aggregation",
    difficulty: "easy",
    title:
      "What is the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column)?",
    keywords: ["COUNT", "COUNT(*)", "COUNT DISTINCT", "NULL", "aggregate"],
    interviewerIntent:
      "A common trap that checks whether you know how aggregates treat NULL values.",
    shortAnswer:
      "`COUNT(*)` counts all rows in the group, including rows with NULLs. `COUNT(column)` counts only rows where that column is not NULL. `COUNT(DISTINCT column)` counts the number of different non-null values. Other aggregates such as SUM and AVG also ignore NULLs.",
    detailedAnswer: [
      "If a `phone` column has 10 rows with 3 NULLs, `COUNT(*)` is 10 and `COUNT(phone)` is 7.",
      "`COUNT(DISTINCT phone)` is at most 7 because duplicates are counted once.",
      "On an empty table, `COUNT` returns 0 while `SUM` and `AVG` return NULL.",
      "`COUNT(1)` and `COUNT(*)` give the same result. Neither is meaningfully faster in modern databases.",
    ],
    realWorldExample:
      "A dashboard shows total users with `COUNT(*)`, users who gave a phone number with `COUNT(phone)`, and the number of countries with `COUNT(DISTINCT country)`.",
    codeExamples: [
      {
        title: "Three ways to count",
        language: "sql",
        code: `SELECT
  COUNT(*)                AS all_rows,
  COUNT(phone)            AS with_phone,
  COUNT(DISTINCT country) AS countries
FROM users;`,
        walkthrough: [
          "`COUNT(*)` counts every row regardless of NULLs.",
          "`COUNT(phone)` skips rows where the phone is NULL.",
          "`COUNT(DISTINCT country)` counts each country once.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting COUNT(column) to count NULLs.",
      "Expecting SUM on an empty table to return 0.",
    ],
    followUps: [
      {
        question: "How do you make SUM return 0 on no rows?",
        hint: "COALESCE(SUM(x), 0).",
      },
    ],
    answerTips: ["Use a small numeric example: 10 rows, 3 NULLs."],
    keyPoints: [
      "COUNT(*) counts rows",
      "COUNT(col) skips NULLs",
      "DISTINCT counts unique values",
      "Aggregates ignore NULL",
    ],
    revisionNotes: ["Star counts rows, column counts non-NULLs."],
    sourceRefs: [
      {
        label: "PostgreSQL: Aggregate Functions",
        url: `${PG}/functions-aggregate.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "find-and-remove-duplicates",
    topic: "Aggregation",
    difficulty: "medium",
    title:
      "How do you find duplicate rows in a table? How do you delete them and keep one copy?",
    keywords: [
      "duplicates",
      "GROUP BY",
      "HAVING",
      "ROW_NUMBER",
      "DELETE",
      "unique",
    ],
    interviewerIntent:
      "A very practical coding question that combines grouping, window functions and safe deletion.",
    shortAnswer:
      "Group by the columns that define a duplicate and keep groups with `HAVING COUNT(*) > 1`. To delete extras while keeping one, number the rows within each duplicate group with `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY id)` and delete the rows numbered above 1. Afterwards add a unique constraint so duplicates cannot return.",
    detailedAnswer: [
      "Decide first what counts as a duplicate, for example the same email in lower case.",
      "Look at the rows before deleting them. Run the `SELECT` version of your query and check the result.",
      "Do the delete inside a transaction so you can roll back if the result looks wrong.",
      "A `UNIQUE` constraint or unique index is the long-term fix. Cleaning without it only delays the problem.",
    ],
    realWorldExample:
      "An import job ran twice and created two rows per customer email. A cleanup script keeps the lowest id per email and a unique index on the email prevents a repeat.",
    codeExamples: [
      {
        title: "Find and delete duplicates",
        language: "sql",
        code: `-- Find them
SELECT email, COUNT(*) AS copies
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Keep the lowest id per email, delete the rest
DELETE FROM users
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
  ) t
  WHERE rn > 1
);

ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);`,
        walkthrough: [
          "The first query lists every email that appears more than once.",
          "`ROW_NUMBER` numbers the rows inside each email group by id.",
          "Rows numbered above 1 are the extra copies, so they are deleted.",
          "The unique constraint stops the same email from being inserted again.",
        ],
      },
    ],
    commonMistakes: [
      "Deleting without checking the rows first.",
      "Not adding a constraint afterwards.",
    ],
    followUps: [
      { question: "How would you do this if the table has no id column?" },
    ],
    answerTips: [
      "Say you would run it in a transaction and add a unique constraint afterwards.",
    ],
    keyPoints: [
      "GROUP BY with HAVING COUNT > 1",
      "ROW_NUMBER to pick one to keep",
      "Test with SELECT first",
      "Prevent with UNIQUE",
    ],
    revisionNotes: ["Find with HAVING, delete with ROW_NUMBER."],
    sourceRefs: [
      {
        label: "PostgreSQL: GROUP BY and HAVING",
        url: `${PG}/queries-table-expressions.html#QUERIES-GROUP`,
      },
      {
        label: "PostgreSQL: Window Functions",
        url: `${PG}/tutorial-window.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "nth-highest-salary",
    topic: "Subqueries",
    difficulty: "medium",
    title: "How do you find the second highest (or Nth highest) salary in SQL?",
    keywords: [
      "second highest salary",
      "nth highest",
      "DENSE_RANK",
      "LIMIT OFFSET",
      "subquery",
      "ties",
    ],
    interviewerIntent:
      "One of the best-known SQL interview problems. It tests ties, NULL results and knowing more than one approach.",
    shortAnswer:
      "There are three common ways. Use `ORDER BY salary DESC LIMIT 1 OFFSET n-1` on distinct salaries, use a subquery such as `MAX(salary) WHERE salary < (SELECT MAX(salary))` for the second highest, or use `DENSE_RANK()` and keep the rows with rank n. `DENSE_RANK` handles ties correctly and works for any n.",
    detailedAnswer: [
      "Ties matter. If two people earn the highest salary, the second highest value is the next lower number, not the same one again, so use `DISTINCT` or `DENSE_RANK`.",
      "With `LIMIT` and `OFFSET`, no result row means that there is no Nth value, and the query returns no rows rather than NULL.",
      "The `MAX` subquery returns NULL when there is no second salary, which is often what the interviewer asks for.",
      "`DENSE_RANK` lets you also return the employees with that salary, not only the value.",
    ],
    realWorldExample:
      "A payroll review lists employees earning the third highest salary in each department using `DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)`.",
    codeExamples: [
      {
        title: "Three approaches",
        language: "sql",
        code: `-- 1) DISTINCT + OFFSET
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- 2) Subquery for the second highest
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- 3) DENSE_RANK for any n
SELECT name, salary FROM (
  SELECT name, salary,
         DENSE_RANK() OVER (ORDER BY salary DESC) AS r
  FROM employees
) t
WHERE r = 2;`,
        walkthrough: [
          "The first query removes duplicate salaries, sorts them, and skips the highest.",
          "The second finds the maximum among salaries lower than the overall maximum.",
          "The third ranks salaries so that ties share a rank, then keeps rank 2.",
          "Change the number in `r = 2` to get the Nth highest.",
        ],
      },
    ],
    commonMistakes: [
      "Ignoring ties and returning the highest salary twice.",
      "Using ROW_NUMBER, which gives tied salaries different numbers.",
    ],
    followUps: [
      { question: "How would you get the Nth highest salary per department?" },
    ],
    answerTips: ["Offer two approaches and mention how each treats ties."],
    keyPoints: [
      "Handle ties with DISTINCT or DENSE_RANK",
      "OFFSET approach is short",
      "Subquery approach returns NULL if none",
      "DENSE_RANK works for any N",
    ],
    revisionNotes: ["Distinct salaries, then rank."],
    sourceRefs: [
      {
        label: "PostgreSQL: LIMIT and OFFSET",
        url: `${PG}/queries-limit.html`,
      },
      {
        label: "PostgreSQL: Window Functions",
        url: `${PG}/functions-window.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "subquery-types",
    topic: "Subqueries",
    difficulty: "medium",
    title:
      "What is a subquery? Explain scalar, derived-table and correlated subqueries.",
    keywords: [
      "subquery",
      "scalar subquery",
      "derived table",
      "correlated subquery",
      "nested query",
    ],
    interviewerIntent:
      "Checks that you can read and write queries inside queries and know when one depends on the outer row.",
    shortAnswer:
      "A subquery is a query nested inside another query. A scalar subquery returns a single value and can be used where a value is expected. A derived table is a subquery in the FROM clause that acts like a temporary table. A correlated subquery refers to columns of the outer query, so it is evaluated for each outer row, at least conceptually.",
    detailedAnswer: [
      "A non-correlated subquery runs independently of the outer query and can be evaluated once.",
      "A correlated subquery cannot run on its own because it uses an outer column, such as `WHERE e.department_id = d.id`.",
      "Optimisers often rewrite subqueries as joins, so the SQL you write does not always match the execution plan.",
      "Common table expressions (`WITH ...`) name a subquery and make complex queries easier to read.",
    ],
    realWorldExample:
      "Listing employees who earn more than their department's average uses a correlated subquery or a derived table that computes each department's average.",
    codeExamples: [
      {
        title: "Scalar and correlated subqueries",
        language: "sql",
        code: `-- Scalar: above the company average
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Correlated: above their own department's average
SELECT e.name, e.salary FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees
  WHERE department_id = e.department_id
);`,
        walkthrough: [
          "The inner query returns one number, so it works as a scalar value.",
          "The second inner query uses `e.department_id` from the outer query.",
          "That dependency makes it correlated: the average depends on the current row's department.",
        ],
      },
    ],
    commonMistakes: [
      "Writing a scalar subquery that returns more than one row, which raises an error.",
      "Assuming a correlated subquery is always slow.",
    ],
    followUps: [
      { question: "How would you rewrite the correlated query as a join?" },
    ],
    answerTips: [
      "Use the above-average-salary example for scalar and correlated versions.",
    ],
    keyPoints: [
      "Subquery = query inside a query",
      "Scalar returns one value",
      "Derived table is in FROM",
      "Correlated depends on the outer row",
    ],
    revisionNotes: ["Correlated subqueries use the outer row."],
    sourceRefs: [
      {
        label: "PostgreSQL: Subquery Expressions",
        url: `${PG}/functions-subquery.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "in-vs-exists",
    topic: "Subqueries",
    difficulty: "medium",
    title: "What is the difference between IN and EXISTS?",
    keywords: ["IN", "EXISTS", "subquery", "semi join", "NULL", "performance"],
    interviewerIntent:
      "Checks that you understand what each operator tests and do not repeat folklore about which is faster.",
    shortAnswer:
      "`IN` checks whether a value equals any value returned by a list or subquery. `EXISTS` checks whether a subquery returns at least one row and ignores what the rows contain. `EXISTS` can stop at the first match and handles NULLs more safely. Modern optimisers often turn both into the same semi-join plan, so check with EXPLAIN instead of assuming one is faster.",
    detailedAnswer: [
      "`IN` is easy to read for small lists of constants: `status IN ('PAID', 'SHIPPED')`.",
      "`EXISTS` is natural for correlated checks such as 'customers who have at least one order'.",
      "`NOT IN` and `NOT EXISTS` behave differently when the subquery can return NULL.",
      "The old advice 'EXISTS is always faster' is not reliable. Measure the real plan.",
    ],
    realWorldExample:
      "Finding customers who have placed at least one order with `WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)`.",
    codeExamples: [
      {
        title: "The same question two ways",
        language: "sql",
        code: `SELECT name FROM customers c
WHERE c.id IN (SELECT customer_id FROM orders);

SELECT name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);`,
        walkthrough: [
          "The `IN` query compares each customer id with the list of ids from orders.",
          "The `EXISTS` query only asks whether a matching order row exists.",
          "Both return customers who have at least one order.",
        ],
      },
    ],
    commonMistakes: [
      "Claiming EXISTS is always faster.",
      "Using NOT IN when the subquery can contain NULL.",
    ],
    followUps: [
      {
        question: "What goes wrong with NOT IN if the subquery returns a NULL?",
      },
    ],
    answerTips: [
      "Say that you would read the EXPLAIN output rather than guess.",
    ],
    keyPoints: [
      "IN compares values",
      "EXISTS tests for any row",
      "Optimisers often treat them alike",
      "NULL behaviour differs for NOT IN",
    ],
    revisionNotes: ["IN compares, EXISTS checks existence."],
    sourceRefs: [
      {
        label: "PostgreSQL: Subquery Expressions",
        url: `${PG}/functions-subquery.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "not-in-null-trap",
    topic: "Subqueries",
    difficulty: "hard",
    title:
      "Why does a NOT IN subquery return no rows when the list contains NULL? What is the fix?",
    keywords: [
      "NOT IN",
      "NULL",
      "NOT EXISTS",
      "three-valued logic",
      "anti join",
      "LEFT JOIN",
    ],
    interviewerIntent:
      "A well-known trap. It shows whether you truly understand NULL and three-valued logic.",
    shortAnswer:
      "`x NOT IN (1, 2, NULL)` expands to `x <> 1 AND x <> 2 AND x <> NULL`. The last part is unknown, so the whole condition is never true and no rows are returned. The fixes are to use `NOT EXISTS`, to filter the NULLs out of the subquery, or to use a `LEFT JOIN ... WHERE right.id IS NULL`.",
    detailedAnswer: [
      "`NOT IN` is true only when the value differs from every item in the list. A NULL item makes that comparison unknown instead of true.",
      "`NOT EXISTS` only asks whether a matching row exists, so NULLs in the other table do not poison the result.",
      "The `LEFT JOIN ... IS NULL` form is the 'anti join' pattern and often produces a similar plan.",
      "The safest habit is to prefer `NOT EXISTS` when the subquery column could be NULL.",
    ],
    realWorldExample:
      "A query for products that were never ordered uses `NOT IN (SELECT product_id FROM order_items)`. One legacy row with a NULL product_id makes the query return nothing, and the missing report goes unnoticed.",
    codeExamples: [
      {
        title: "The trap and the fixes",
        language: "sql",
        code: `-- Returns no rows if order_items.product_id has any NULL
SELECT * FROM products
WHERE id NOT IN (SELECT product_id FROM order_items);

-- Fix 1: NOT EXISTS
SELECT * FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM order_items oi WHERE oi.product_id = p.id
);

-- Fix 2: anti join
SELECT p.* FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.product_id IS NULL;`,
        walkthrough: [
          "A single NULL in the subquery makes the NOT IN condition unknown for every product.",
          "`NOT EXISTS` checks for a matching row and is not affected by NULLs.",
          "The anti join keeps only the products with no match on the right side.",
        ],
      },
    ],
    commonMistakes: [
      "Using NOT IN on a nullable column.",
      "Not noticing that an empty result is wrong.",
    ],
    followUps: [
      {
        question: "Does the same problem happen with IN?",
        hint: "IN can still match a real value, so it does not return nothing.",
      },
    ],
    answerTips: [
      "Walk through the expansion to `AND x <> NULL`, it makes the reason clear.",
    ],
    keyPoints: [
      "NOT IN with NULL gives no rows",
      "Reason: unknown in an AND chain",
      "Use NOT EXISTS",
      "Or filter NULLs or use an anti join",
    ],
    revisionNotes: ["NOT IN plus NULL equals nothing."],
    sourceRefs: [
      {
        label: "PostgreSQL: Subquery Expressions (NOT IN)",
        url: `${PG}/functions-subquery.html#FUNCTIONS-SUBQUERY-NOTIN`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "row-number-rank-dense-rank",
    topic: "Window functions",
    difficulty: "medium",
    title: "What is the difference between ROW_NUMBER, RANK and DENSE_RANK?",
    keywords: [
      "ROW_NUMBER",
      "RANK",
      "DENSE_RANK",
      "window function",
      "ties",
      "PARTITION BY",
    ],
    interviewerIntent:
      "A standard window-function question that depends on how ties are handled.",
    shortAnswer:
      "All three number rows within an ordered window. `ROW_NUMBER` gives every row a unique number even when values tie. `RANK` gives tied rows the same rank and then skips numbers, so 1, 1, 3. `DENSE_RANK` gives tied rows the same rank without gaps, so 1, 1, 2. Add `PARTITION BY` to restart the numbering for each group.",
    detailedAnswer: [
      "For scores 90, 90, 80: `ROW_NUMBER` is 1, 2, 3, `RANK` is 1, 1, 3 and `DENSE_RANK` is 1, 1, 2.",
      "With `ROW_NUMBER`, the order of tied rows is arbitrary unless you add a tiebreaker column to `ORDER BY`.",
      "Use `ROW_NUMBER` to pick exactly one row per group, `RANK` for sports-style rankings and `DENSE_RANK` for 'Nth highest' questions.",
      "You cannot filter on a window function in `WHERE`, so wrap the query in a subquery or CTE first.",
    ],
    realWorldExample:
      "Listing the three highest-revenue products in each category:`DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC)` and keep rows where the rank is 3 or less.",
    codeExamples: [
      {
        title: "Ties compared",
        language: "sql",
        code: `SELECT name, score,
  ROW_NUMBER() OVER (ORDER BY score DESC) AS rn,
  RANK()       OVER (ORDER BY score DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY score DESC) AS drnk
FROM results;
-- score 90: rn 1, rnk 1, drnk 1
-- score 90: rn 2, rnk 1, drnk 1
-- score 80: rn 3, rnk 3, drnk 2`,
        walkthrough: [
          "All three functions use the same ordering by score.",
          "`ROW_NUMBER` breaks the tie arbitrarily to give 1 and 2.",
          "`RANK` gives both 90s rank 1 and the next rank becomes 3.",
          "`DENSE_RANK` also gives both rank 1 but the next rank is 2.",
        ],
      },
    ],
    commonMistakes: [
      "Using ROW_NUMBER for Nth highest and mishandling ties.",
      "Trying to use a window function inside WHERE.",
    ],
    followUps: [
      {
        question:
          "How would you get the two highest salaries in every department?",
      },
    ],
    answerTips: [
      "Use the 90, 90, 80 example. It shows all three behaviours in one table.",
    ],
    keyPoints: [
      "ROW_NUMBER unique",
      "RANK has gaps after ties",
      "DENSE_RANK has no gaps",
      "PARTITION BY restarts per group",
    ],
    revisionNotes: ["1,2,3 vs 1,1,3 vs 1,1,2."],
    sourceRefs: [
      {
        label: "PostgreSQL: Window Functions",
        url: `${PG}/functions-window.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "window-functions-vs-group-by",
    topic: "Window functions",
    difficulty: "medium",
    title: "How are window functions different from GROUP BY?",
    keywords: [
      "window function",
      "GROUP BY",
      "OVER",
      "PARTITION BY",
      "running total",
      "aggregate",
    ],
    interviewerIntent:
      "Checks that you know when to keep detail rows while still using aggregates.",
    shortAnswer:
      "`GROUP BY` collapses rows into one row per group, so the individual rows are lost. A window function computes a value across a set of related rows but keeps every original row, adding the result as an extra column. Use `GROUP BY` for summaries and window functions for running totals, rankings and comparisons with the group average.",
    detailedAnswer: [
      "The `OVER (...)` clause defines the window. `PARTITION BY` splits rows into groups and `ORDER BY` inside it sets the order for running calculations.",
      "Any aggregate such as `SUM` or `AVG` can be used as a window function by adding `OVER`.",
      "Window functions run after `WHERE`, `GROUP BY` and `HAVING`, so you cannot filter on their result in the same query level.",
      "Support is part of the SQL standard and is available in PostgreSQL, MySQL 8+, SQL Server and Oracle.",
    ],
    realWorldExample:
      "A sales sheet shows every order next to the customer's total spend and a running total by date, without collapsing the orders into one line per customer.",
    codeExamples: [
      {
        title: "Collapse versus keep",
        language: "sql",
        code: `-- GROUP BY: one row per customer
SELECT customer_id, SUM(total) AS spent
FROM orders GROUP BY customer_id;

-- Window: every order, plus the customer's total and a running sum
SELECT id, customer_id, total,
  SUM(total) OVER (PARTITION BY customer_id) AS customer_spent,
  SUM(total) OVER (PARTITION BY customer_id ORDER BY created_at) AS running
FROM orders;`,
        walkthrough: [
          "The first query returns one summary row for each customer.",
          "The second keeps each order row.",
          "The first window sum repeats the customer's total on every order row.",
          "Adding `ORDER BY` inside the window turns the second sum into a running total.",
        ],
      },
    ],
    commonMistakes: [
      "Trying to filter by a window result in WHERE.",
      "Using GROUP BY and losing the detail rows you needed.",
    ],
    followUps: [{ question: "What is a frame clause such as ROWS BETWEEN?" }],
    answerTips: [
      "Use the phrase 'keeps the rows' to separate it from GROUP BY.",
    ],
    keyPoints: [
      "GROUP BY collapses rows",
      "Window keeps all rows",
      "OVER with PARTITION BY and ORDER BY",
      "Cannot filter in the same WHERE",
    ],
    revisionNotes: ["GROUP BY shrinks, windows keep."],
    sourceRefs: [
      {
        label: "PostgreSQL: Window Functions tutorial",
        url: `${PG}/tutorial-window.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "composite-index-column-order",
    topic: "Indexes",
    difficulty: "medium",
    title: "What is a composite index? Why does the column order matter?",
    keywords: [
      "composite index",
      "multicolumn index",
      "leftmost prefix",
      "column order",
      "B-tree",
    ],
    interviewerIntent:
      "Checks that you can design an index for a real query, not just say 'add an index'.",
    shortAnswer:
      "A composite index covers several columns, such as `(country, city)`. In a B-tree it is sorted by the first column, then the second within it. So it is most useful for queries that filter on the leading column or columns, the leftmost prefix. A query that filters only on `city` cannot use it efficiently. Put the columns you filter by equality first.",
    detailedAnswer: [
      "An index on `(a, b, c)` helps filters on `a`, on `a, b` and on `a, b, c`. It is much less useful for a filter only on `b` or `c`.",
      "Equality conditions usually go before range conditions, because a range on one column limits how the later columns can be used.",
      "An index can also satisfy `ORDER BY` when the sort order matches the index order, avoiding a separate sort.",
      "Each extra index slows writes and uses space, so create indexes for real queries and check them with `EXPLAIN`.",
    ],
    realWorldExample:
      "An orders list filtered by `customer_id` and sorted by `created_at DESC` is served by an index on `(customer_id, created_at)`.",
    codeExamples: [
      {
        title: "Index matching the query",
        language: "sql",
        code: `CREATE INDEX idx_orders_customer_created
  ON orders (customer_id, created_at DESC);

-- Uses the index well:
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 10;

-- Poor fit for this index (no leading column):
SELECT * FROM orders WHERE created_at > '2025-01-01';`,
        walkthrough: [
          "The index is sorted by customer first, then by newest date.",
          "The first query finds the customer's rows and reads them in the right order.",
          "The second query does not filter on the leading column, so this index is not a good fit.",
        ],
      },
    ],
    commonMistakes: [
      "Putting a low-selectivity or range column first.",
      "Creating a separate single-column index for every column.",
    ],
    followUps: [{ question: "What is a covering index?" }],
    answerTips: [
      "Explain the phone-book analogy: sorted by surname then first name.",
    ],
    keyPoints: [
      "Sorted by first column, then the next",
      "Leftmost prefix rule",
      "Equality columns first",
      "Verify with EXPLAIN",
    ],
    revisionNotes: ["Order columns like a phone book."],
    sourceRefs: [
      {
        label: "PostgreSQL: Multicolumn Indexes",
        url: `${PG}/indexes-multicolumn.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "normalization-forms",
    topic: "Normalization",
    difficulty: "medium",
    title: "What is normalization? Explain 1NF, 2NF and 3NF with examples.",
    keywords: [
      "normalization",
      "1NF",
      "2NF",
      "3NF",
      "partial dependency",
      "transitive dependency",
      "denormalization",
    ],
    interviewerIntent:
      "A theory question that tests whether you can spot redundancy and fix a table design.",
    shortAnswer:
      "Normalization organises tables to reduce redundancy and update problems. First normal form (1NF) needs atomic values and no repeating groups. Second normal form (2NF) is 1NF with no partial dependency, meaning no column depends on only part of a composite key. Third normal form (3NF) is 2NF with no transitive dependency, meaning non-key columns depend only on the key.",
    detailedAnswer: [
      "1NF: do not store a comma-separated list like `phones = '111,222'` in one cell. Use one row per value.",
      "2NF: in `order_items(order_id, product_id, product_name, qty)`, `product_name` depends only on `product_id`, so it belongs in a `products` table.",
      "3NF: if `employees` stores `department_id` and `department_name`, the name depends on the department, not the employee. Move it to `departments`.",
      "Normalization reduces update anomalies. Deliberate denormalization can be justified for read-heavy reporting, but it should be a conscious choice.",
    ],
    realWorldExample:
      "A customer's address was copied onto every order row. Changing it required updating thousands of rows and left some orders with the old address. Moving addresses into their own table fixed it.",
    codeExamples: [
      {
        title: "Splitting a table for 3NF",
        language: "sql",
        code: `-- Before: department_name depends on department_id, not on the employee
-- employees(id, name, department_id, department_name)

CREATE TABLE departments (
  id   INT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE employees (
  id            INT PRIMARY KEY,
  name          TEXT NOT NULL,
  department_id INT REFERENCES departments(id)
);`,
        walkthrough: [
          "The department name was repeated on every employee row.",
          "The department's facts move to their own table.",
          "Employees keep only the key that points to the department.",
          "Renaming a department is now a single-row update.",
        ],
      },
    ],
    commonMistakes: [
      "Memorising the definitions without an example.",
      "Normalising everything without considering query cost.",
    ],
    followUps: [{ question: "When is denormalization a good idea?" }],
    answerTips: ["For each form, give one broken table and its fix."],
    keyPoints: [
      "1NF: atomic values",
      "2NF: no partial dependency",
      "3NF: no transitive dependency",
      "Goal: less redundancy and fewer anomalies",
    ],
    revisionNotes: ["The key, the whole key, nothing but the key."],
    sourceRefs: [
      {
        label: "Microsoft Learn: Database normalization basics",
        url: "https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "acid-properties",
    topic: "Transactions",
    difficulty: "easy",
    title: "What are the ACID properties of a database transaction?",
    keywords: [
      "ACID",
      "atomicity",
      "consistency",
      "isolation",
      "durability",
      "transaction",
      "rollback",
    ],
    interviewerIntent:
      "A foundation question for transactions. A bank transfer example is expected.",
    shortAnswer:
      "ACID describes reliable transactions. Atomicity means all the steps happen or none do. Consistency means a transaction moves the database from one valid state to another, respecting constraints. Isolation means concurrent transactions do not see each other's unfinished work, to a degree set by the isolation level. Durability means committed data survives crashes.",
    detailedAnswer: [
      "In a transfer, debiting one account and crediting another must be atomic. If the credit fails, the debit is rolled back.",
      "Consistency is partly enforced by constraints: a check that a balance cannot go negative rejects invalid changes.",
      "Isolation is a spectrum. Stronger levels prevent more anomalies but allow less concurrency.",
      "Durability is usually provided by writing a log to disk before reporting the commit as successful.",
    ],
    realWorldExample:
      "A payment moves 500 from account A to account B. A crash after the debit but before the credit leaves the money missing without atomicity.",
    codeExamples: [
      {
        title: "An atomic transfer",
        language: "sql",
        code: `BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
-- If anything fails before COMMIT, run ROLLBACK and neither update is kept.`,
        walkthrough: [
          "`BEGIN` starts a transaction.",
          "Both updates belong to the same unit of work.",
          "`COMMIT` makes them permanent together.",
          "`ROLLBACK` would undo both if there was an error.",
        ],
      },
    ],
    commonMistakes: [
      "Describing the letters without an example.",
      "Saying isolation means transactions never overlap.",
    ],
    followUps: [{ question: "What are the transaction isolation levels?" }],
    answerTips: ["Use the bank transfer example for all four letters."],
    keyPoints: [
      "Atomicity: all or nothing",
      "Consistency: valid state to valid state",
      "Isolation: concurrent work is separated",
      "Durability: commits survive crashes",
    ],
    revisionNotes: ["All or nothing, valid, separate, permanent."],
    sourceRefs: [
      {
        label: "PostgreSQL: Transactions tutorial",
        url: `${PG}/tutorial-transactions.html`,
      },
      {
        label: "PostgreSQL: Transaction Isolation",
        url: `${PG}/transaction-iso.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "sql-constraints",
    topic: "Constraints",
    difficulty: "easy",
    title:
      "What constraints does SQL provide? What is the difference between UNIQUE and PRIMARY KEY?",
    keywords: [
      "constraints",
      "NOT NULL",
      "UNIQUE",
      "PRIMARY KEY",
      "CHECK",
      "FOREIGN KEY",
      "DEFAULT",
    ],
    interviewerIntent:
      "Checks that you let the database enforce rules instead of relying only on application code.",
    shortAnswer:
      "Constraints are rules the database enforces on column values: `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` and `CHECK`. `DEFAULT` supplies a value when none is given. A table can have only one primary key, which is unique and not null, and can have many `UNIQUE` constraints. In most databases a `UNIQUE` column can hold NULLs.",
    detailedAnswer: [
      "`CHECK (price >= 0)` rejects negative prices no matter which application writes the data.",
      "A `FOREIGN KEY` keeps child rows pointing to existing parent rows, so there are no orphaned orders.",
      "`UNIQUE` can be applied to a combination of columns, such as `(user_id, product_id)`.",
      "Constraints give you a safety net that works for every client, including scripts and manual fixes.",
    ],
    realWorldExample:
      "An `email` column is `NOT NULL UNIQUE`, so the database refuses a second account with the same email even if two requests arrive at the same moment.",
    codeExamples: [
      {
        title: "Constraints in a table definition",
        language: "sql",
        code: `CREATE TABLE products (
  id      INT PRIMARY KEY,
  sku     TEXT NOT NULL UNIQUE,
  price   NUMERIC NOT NULL CHECK (price >= 0),
  stock   INT NOT NULL DEFAULT 0,
  brand_id INT REFERENCES brands(id)
);`,
        walkthrough: [
          "The primary key identifies each row and cannot be null.",
          "`sku` must be present and unique.",
          "`CHECK` blocks negative prices.",
          "`DEFAULT` sets stock to 0 when no value is supplied, and the foreign key links to `brands`.",
        ],
      },
    ],
    commonMistakes: [
      "Validating only in application code.",
      "Assuming UNIQUE forbids NULL in every database.",
    ],
    followUps: [{ question: "Can a table have a composite primary key?" }],
    answerTips: [
      "Say that constraints protect the data from every writer, not just your app.",
    ],
    keyPoints: [
      "NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK",
      "One primary key per table",
      "Many UNIQUE allowed",
      "DEFAULT fills missing values",
    ],
    revisionNotes: ["The database enforces the rules."],
    sourceRefs: [
      { label: "PostgreSQL: Constraints", url: `${PG}/ddl-constraints.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "view-vs-materialized-view",
    topic: "DDL & DML",
    difficulty: "medium",
    title: "What is a view? How does it differ from a materialized view?",
    keywords: [
      "view",
      "materialized view",
      "REFRESH",
      "stored query",
      "performance",
      "virtual table",
    ],
    interviewerIntent:
      "Tests whether you understand the trade-off between freshness and speed.",
    shortAnswer:
      "A view is a saved query that behaves like a virtual table. It stores no data, and the query runs each time you use the view, so results are always current. A materialized view stores the query result physically, so reads are fast, but the data is only as fresh as its last refresh. Not every database supports materialized views.",
    detailedAnswer: [
      "Views simplify complex joins, hide columns for security and give a stable interface when tables change.",
      "A materialized view must be refreshed, for example with `REFRESH MATERIALIZED VIEW`, either on a schedule or after changes.",
      "Materialized views suit expensive reports that do not need to be live.",
      "Whether a view can be updated depends on how it is defined. Simple single-table views often can.",
    ],
    realWorldExample:
      "A monthly revenue dashboard queries a materialized view that is refreshed every night, instead of recalculating a heavy aggregation for every page load.",
    codeExamples: [
      {
        title: "View and materialized view",
        language: "sql",
        code: `CREATE VIEW active_customers AS
SELECT id, name, email FROM customers WHERE active = true;

CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT date_trunc('month', created_at) AS month, SUM(total) AS revenue
FROM orders GROUP BY 1;

REFRESH MATERIALIZED VIEW monthly_revenue;`,
        walkthrough: [
          "The view stores only the query and always reads the current rows.",
          "The materialized view stores the aggregated result on disk.",
          "The result is not updated until the refresh command runs.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming a view makes the query faster.",
      "Forgetting to refresh a materialized view.",
    ],
    followUps: [{ question: "Can you insert into a view?" }],
    answerTips: ["Frame it as a trade-off: always fresh versus fast to read."],
    keyPoints: [
      "View = saved query, no data",
      "Materialized view stores results",
      "Materialized views need refreshing",
      "Views simplify and secure access",
    ],
    revisionNotes: ["View is live, materialized view is a snapshot."],
    sourceRefs: [
      { label: "PostgreSQL: CREATE VIEW", url: `${PG}/sql-createview.html` },
      {
        label: "PostgreSQL: CREATE MATERIALIZED VIEW",
        url: `${PG}/sql-creatematerializedview.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "optimize-a-slow-query",
    topic: "Query optimization",
    difficulty: "medium",
    title:
      "How do you find out why a SQL query is slow and speed it up? What does EXPLAIN show?",
    keywords: [
      "EXPLAIN",
      "EXPLAIN ANALYZE",
      "slow query",
      "sequential scan",
      "index",
      "query plan",
    ],
    interviewerIntent:
      "Checks that you diagnose with the query plan instead of guessing.",
    shortAnswer:
      "Run `EXPLAIN` to see the plan the database chose, and `EXPLAIN ANALYZE` to also run the query and see real times and row counts. Look for sequential scans on large tables, missing or unused indexes, big gaps between estimated and actual rows, and expensive sorts or joins. Then fix the cause: add a suitable index, rewrite the query, select fewer columns or reduce the rows early.",
    detailedAnswer: [
      "`EXPLAIN ANALYZE` actually executes the statement, so wrap data-changing statements in a transaction and roll back.",
      "Applying a function to an indexed column, such as `WHERE LOWER(email) = ...`, can stop a normal index from being used. Index the expression or compare without the function.",
      "`SELECT *` reads more data than needed and prevents index-only scans.",
      "Stale statistics lead to bad plans. In PostgreSQL, `ANALYZE` refreshes them.",
    ],
    realWorldExample:
      "A search page took seconds. `EXPLAIN ANALYZE` showed a sequential scan over millions of rows. Adding an index on the filtered column cut the time to milliseconds.",
    codeExamples: [
      {
        title: "Reading the plan",
        language: "sql",
        code: `EXPLAIN ANALYZE
SELECT id, total FROM orders WHERE customer_id = 42;

-- Seq Scan on orders   -> reads the whole table
CREATE INDEX idx_orders_customer ON orders (customer_id);
-- Index Scan using idx_orders_customer -> reads only matching rows`,
        walkthrough: [
          "`EXPLAIN ANALYZE` prints the plan with actual timings.",
          "A sequential scan on a large table is a common sign of a missing index.",
          "The new index lets the planner read only the rows for that customer.",
          "Re-run the explain to confirm the plan changed and the time dropped.",
        ],
      },
    ],
    commonMistakes: [
      "Adding indexes without looking at the plan.",
      "Running EXPLAIN ANALYZE on a destructive statement outside a transaction.",
    ],
    followUps: [
      {
        question: "Why might the database ignore an index you created?",
        hint: "Low selectivity, a function on the column, or a type mismatch.",
      },
    ],
    answerTips: [
      "Describe a repeatable loop: measure, read the plan, change one thing, measure again.",
    ],
    keyPoints: [
      "EXPLAIN shows the plan",
      "ANALYZE shows real timings",
      "Watch for sequential scans and bad estimates",
      "Change one thing and re-measure",
    ],
    revisionNotes: ["Measure, read the plan, fix, re-measure."],
    sourceRefs: [
      { label: "PostgreSQL: Using EXPLAIN", url: `${PG}/using-explain.html` },
    ],
    estimatedMinutes: 5,
  },
])
