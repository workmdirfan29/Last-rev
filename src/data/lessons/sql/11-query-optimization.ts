import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "query-optimization",
  title: "Query optimization with EXPLAIN",
  topic: "Query optimization",
  minutes: 70,
  overview:
    "Find out why a query is slow: read an execution plan with EXPLAIN and EXPLAIN ANALYZE, understand scans and joins, keep statistics current, and apply the usual fixes.",
  objectives: [
    "Read the basic parts of an EXPLAIN plan: nodes, cost, rows and actual time",
    "Explain why a query uses a sequential scan or an index scan",
    "Apply fixes in a sensible order: measure, index, rewrite the query, update statistics",
  ],
  prerequisites: ["lesson.sql.indexes", "lesson.sql.joins"],
  sections: [
    {
      kind: "explain",
      heading: "The planner chooses a plan",
      body: [
        "For every query it receives, PostgreSQL devises a **query plan**. Choosing the right plan for the structure of the query and the properties of the data is critical for performance, so the system has a planner that tries to pick a good one. `EXPLAIN` shows the plan.",
        "A plan is a tree of **nodes**. Nodes at the bottom are scan nodes that return raw rows from a table: sequential scans, index scans and bitmap scans. Nodes above them perform joins, aggregation and sorting.",
        "Each line shows the node type and the planner's cost estimates, including the estimated number of rows. The total cost on the top line is what the planner seeks to minimise. Costs are in arbitrary units, not milliseconds.",
      ],
    },
    {
      kind: "code",
      heading: "Reading a plan",
      example: {
        title: "EXPLAIN and EXPLAIN ANALYZE",
        language: "sql",
        code: "EXPLAIN\nSELECT * FROM orders WHERE customer_id = 42;\n\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42;\n\nANALYZE orders;\n\nCREATE INDEX orders_customer_idx ON orders (customer_id);",
        walkthrough: [
          "Plain `EXPLAIN` shows the plan and its estimates without running the query.",
          "`EXPLAIN ANALYZE` actually executes the query and then shows the true row counts and run time for each node next to the estimates. A big gap between estimated and actual rows suggests the statistics are poor.",
          "Because it really runs the statement, wrap `EXPLAIN ANALYZE` of an `UPDATE` or `DELETE` in a transaction and roll back.",
          "`ANALYZE` refreshes the statistics the planner uses. An index may change a `Seq Scan` into an `Index Scan` for a selective condition.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "A tuning routine",
      body: [
        "**Measure first.** Find which queries are actually slow instead of guessing, and look at the plan for the slow one.",
        "**Check statistics.** The planner relies on statistics about table contents. After large loads or deletes, run `ANALYZE` so its row estimates are current.",
        "**Add or fix indexes** for the columns you filter, join and sort on, and make sure the query is written so the index can be used, without a function around the indexed column.",
        "**Rewrite the query.** Select only the columns you need, filter early, avoid unneeded joins, and remember that a sequential scan can be the correct choice when a query returns a large share of the table.",
        "**Change one thing at a time** and compare plans and timings, so you know what helped.",
      ],
    },
    {
      kind: "diagram",
      heading: "Common plan nodes",
      diagram: {
        kind: "table",
        title: "What the nodes mean",
        headers: ["Node", "Meaning"],
        rows: [
          ["Seq Scan", "Reads the whole table"],
          ["Index Scan", "Uses an index to find rows, then reads them from the table"],
          ["Bitmap Heap Scan", "Collects matching positions from an index, then reads the table in order"],
          ["Nested Loop", "For each row of one side, look up the other side"],
          ["Hash Join", "Builds a hash table of one side and probes it with the other"],
          ["Sort", "Sorts rows, for ORDER BY or a merge join"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Adding indexes without looking at the plan.",
          fix: "Run EXPLAIN first, and confirm afterwards that the index is used and helps.",
        },
        {
          mistake: "Judging a plan on a tiny test table.",
          fix: "Test with realistic amounts of data, because the planner chooses by size.",
        },
        {
          mistake: "Treating cost numbers as seconds.",
          fix: "Costs are relative units. Use EXPLAIN ANALYZE for real time.",
        },
        {
          mistake: "Running EXPLAIN ANALYZE on a DELETE without a transaction.",
          fix: "It really runs the statement, so use BEGIN … ROLLBACK.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A slow report",
      scenario:
        "A report query takes several seconds and nobody knows why.",
      body: [
        "Run `EXPLAIN ANALYZE` and find the node with the largest actual time. If it is a sequential scan on a big table with a selective filter, an index on the filtered column is the likely fix.",
        "If the estimated rows are far from the actual rows, run `ANALYZE` and look again before changing anything else.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "analyze-runs",
      prompt: "What is special about EXPLAIN ANALYZE?",
      options: [
        "It actually executes the query and shows real times",
        "It only estimates, without running",
        "It creates indexes",
      ],
      answer: 0,
      explanation:
        "ANALYZE makes EXPLAIN execute the statement and report true row counts and run time.",
    },
    {
      type: "truefalse",
      id: "seq-scan-bad",
      statement: "A sequential scan is always a sign of a problem.",
      answer: false,
      explanation:
        "When a query needs a large share of the table, reading all of it can be the cheapest plan.",
    },
    {
      type: "single",
      id: "stale-stats",
      prompt: "The estimated rows in a plan are far from the actual rows. What should you try first?",
      options: ["Run ANALYZE on the table", "Drop all indexes", "Add LIMIT everywhere"],
      answer: 0,
      explanation:
        "ANALYZE refreshes the statistics the planner uses for its estimates.",
    },
    {
      type: "blank",
      id: "plan-command",
      prompt: "The command ___ shows the plan chosen for a query.",
      answer: "EXPLAIN",
      explanation:
        "`EXPLAIN query` displays the execution plan.",
    },
  ],
  assignment: {
    title: "Tune one query",
    task: [
      "Create a table with at least a hundred thousand rows, write a query that filters on one column, and capture its EXPLAIN ANALYZE output.",
      "Improve it with an index and ANALYZE, capture the new plan and write a short note comparing the two.",
    ],
    checklist: [
      "I identified the scan type before and after",
      "I compared estimated and actual rows",
      "I changed only one thing at a time",
      "I wrapped any write statement in a transaction and rolled back",
    ],
    hints: ["Generate test data with a query that inserts a series of numbers."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "write-the-fix",
      title: "Index and refresh",
      task: [
        "A query filters orders by status = 'open' and sorts by created. Write the two statements that create a multicolumn index named orders_status_created_idx and then refresh the planner statistics for the orders table.",
      ],
      language: "sql",
      starter: "-- your statements",
      solution:
        "CREATE INDEX orders_status_created_idx\n  ON orders (status, created);\n\nANALYZE orders;",
      hints: ["Equality column first, then the sorted column."],
      checklist: [
        "The index is on (status, created)",
        "The index has the requested name",
        "ANALYZE is run on orders",
      ],
    },
  ],
  revisionNotes: [
    "EXPLAIN shows the plan; EXPLAIN ANALYZE runs the query and shows actual rows and time",
    "Plan = tree of nodes; scans at the bottom, joins and sorts above",
    "Statistics come from ANALYZE; stale statistics give bad plans",
    "Measure, check statistics, index, rewrite, change one thing at a time",
  ],
  resources: [
    {
      label: "PostgreSQL: Using EXPLAIN",
      url: "https://www.postgresql.org/docs/current/using-explain.html",
    },
    {
      label: "PostgreSQL: Statistics used by the planner",
      url: "https://www.postgresql.org/docs/current/planner-stats.html",
    },
    {
      label: "PostgreSQL: ANALYZE",
      url: "https://www.postgresql.org/docs/current/sql-analyze.html",
    },
    {
      label: "PostgreSQL: Performance tips",
      url: "https://www.postgresql.org/docs/current/performance-tips.html",
    },
  ],
})
