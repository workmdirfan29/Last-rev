import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "ddl-and-dml",
  title: "DDL and DML: defining and changing data",
  topic: "DDL & DML",
  minutes: 50,
  overview:
    "Create and change tables with CREATE, ALTER and DROP, and add, change and remove rows with INSERT, UPDATE and DELETE, including RETURNING and safe habits.",
  objectives: [
    "Create, alter and drop tables with DDL statements",
    "Insert, update and delete rows, always with the right WHERE clause",
    "Use DEFAULT values, multi-row inserts and RETURNING",
  ],
  prerequisites: ["lesson.sql.select-and-filtering"],
  sections: [
    {
      kind: "explain",
      heading: "Two kinds of statement",
      body: [
        "**DDL**, data definition language, defines the structure: `CREATE TABLE`, `ALTER TABLE` and `DROP TABLE`. **DML**, data manipulation language, works with the rows: `INSERT`, `UPDATE` and `DELETE`, together with `SELECT` for reading.",
        "`CREATE TABLE` names the table and lists its columns with their data types, and optionally defaults and constraints. `ALTER TABLE` changes an existing table: add or remove columns, add or remove constraints, change defaults and data types, rename columns and tables. `DROP TABLE` removes the table and all its data.",
        "A `DEFAULT` value is used when an insert does not give a value for that column. For example `status text DEFAULT 'new'`.",
      ],
    },
    {
      kind: "code",
      heading: "Defining a table",
      example: {
        title: "CREATE and ALTER",
        language: "sql",
        code: "CREATE TABLE products (\n  id       integer PRIMARY KEY,\n  name     text NOT NULL,\n  price    numeric NOT NULL CHECK (price >= 0),\n  stock    integer DEFAULT 0\n);\n\nALTER TABLE products ADD COLUMN description text;\nALTER TABLE products ALTER COLUMN stock SET DEFAULT 10;\nALTER TABLE products RENAME COLUMN name TO title;\nALTER TABLE products DROP COLUMN description;\n\nDROP TABLE products;",
        walkthrough: [
          "The columns, types, constraints and defaults are all defined together in `CREATE TABLE`.",
          "`ADD COLUMN` adds a column. Existing rows get its default value, or NULL if there is none.",
          "`SET DEFAULT` changes the default for future inserts, and `RENAME COLUMN` renames a column.",
          "`DROP COLUMN` and `DROP TABLE` remove structure and the data in it, so use them with care.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Changing rows",
      example: {
        title: "INSERT, UPDATE, DELETE and RETURNING",
        language: "sql",
        code: "INSERT INTO products (id, name, price)\nVALUES (1, 'Pen', 1.20),\n       (2, 'Notebook', 3.50);\n\nUPDATE products\nSET price = price * 1.10\nWHERE id = 1;\n\nDELETE FROM products\nWHERE stock = 0;\n\nINSERT INTO products (id, name, price)\nVALUES (3, 'Marker', 2.80)\nRETURNING id, name;",
        walkthrough: [
          "`INSERT` names the columns and supplies values. Several rows can be inserted in one statement, which is cheaper than one statement per row. Columns you leave out take their defaults.",
          "`UPDATE … SET … WHERE` changes columns in the matching rows. Without `WHERE` it changes every row in the table.",
          "`DELETE FROM … WHERE` removes the matching rows. Without `WHERE` it deletes every row.",
          "`RETURNING` (PostgreSQL) gives back values from the rows that were inserted, updated or deleted, such as a generated id.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Working safely",
      body: [
        "Before an `UPDATE` or `DELETE`, run the same `WHERE` as a `SELECT` and check the rows it finds. Run risky changes inside a transaction so that you can `ROLLBACK` a mistake.",
        "Every change to a table's structure on a live system should be a recorded, repeatable script, so that every environment ends up with the same schema.",
        "`TRUNCATE TABLE` quickly removes all rows from a table. `DELETE` without a condition does the same but more slowly and can be rolled back in a transaction like any other change.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "UPDATE or DELETE without a WHERE clause.",
          fix: "Test the WHERE as a SELECT first, and do the change in a transaction.",
        },
        {
          mistake: "INSERT without a column list.",
          fix: "Name the columns so the statement survives a change in column order.",
        },
        {
          mistake: "Many single-row inserts in a loop.",
          fix: "Insert several rows in one statement, or use COPY for bulk loading.",
        },
        {
          mistake: "Dropping a column or table on production without a backup.",
          fix: "Take a backup and test the change on a copy first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Applying a price rise",
      scenario:
        "The price of all products in the 'paper' category must go up by 5 percent.",
      body: [
        "Start with `SELECT id, price FROM products WHERE category = 'paper'` to see which rows will change. Then `BEGIN; UPDATE products SET price = round(price * 1.05, 2) WHERE category = 'paper'; SELECT …;` and `COMMIT` when the result looks right.",
        "If the result is wrong, `ROLLBACK` and no row has changed.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ddl-vs-dml",
      prompt: "Which of these is a DDL statement?",
      options: ["ALTER TABLE", "UPDATE", "INSERT"],
      answer: 0,
      explanation:
        "ALTER TABLE changes the structure. UPDATE and INSERT change rows (DML).",
    },
    {
      type: "truefalse",
      id: "update-no-where",
      statement: "An UPDATE statement without a WHERE clause changes every row in the table.",
      answer: true,
      explanation:
        "That is why you should check the WHERE condition with a SELECT first.",
    },
    {
      type: "single",
      id: "returning-use",
      prompt: "What does RETURNING do in PostgreSQL?",
      options: [
        "Returns values from the rows that were inserted, updated or deleted",
        "Undoes the statement",
        "Returns the table structure",
      ],
      answer: 0,
      explanation:
        "RETURNING gives back columns of the affected rows, for example a generated id.",
    },
    {
      type: "blank",
      id: "remove-structure",
      prompt: "The statement DROP ___ removes a table and all its data.",
      answer: "TABLE",
      explanation:
        "`DROP TABLE name` deletes the table and its rows.",
    },
  ],
  assignment: {
    title: "Product table lifecycle",
    task: [
      "Create a products table, insert at least five rows with a multi-row insert, update some prices, delete some rows and add a column with ALTER TABLE.",
      "Do one update inside a transaction and roll it back.",
    ],
    checklist: [
      "Each UPDATE and DELETE has a tested WHERE clause",
      "I used a multi-row INSERT with a column list",
      "I added a column and checked existing rows",
      "I rolled back one change",
    ],
    hints: ["SELECT the target rows before running each UPDATE or DELETE."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "restock",
      title: "Restock the empty items",
      task: [
        "Write an UPDATE that sets stock to 25 for every product whose stock is 0 or NULL.",
      ],
      language: "sql",
      starter: "UPDATE products\n;",
      solution:
        "UPDATE products\nSET stock = 25\nWHERE stock = 0 OR stock IS NULL;",
      hints: ["NULL needs IS NULL, not = NULL."],
      checklist: [
        "The statement sets stock to 25",
        "The WHERE covers both 0 and NULL",
        "IS NULL is used for the unknown values",
      ],
    },
  ],
  revisionNotes: [
    "DDL: CREATE, ALTER, DROP. DML: INSERT, UPDATE, DELETE (and SELECT)",
    "UPDATE and DELETE without WHERE affect every row",
    "Name columns in INSERT; use multi-row inserts and RETURNING",
    "Test with SELECT, use transactions, keep schema changes in scripts",
  ],
  resources: [
    {
      label: "PostgreSQL: Data definition",
      url: "https://www.postgresql.org/docs/current/ddl.html",
    },
    {
      label: "PostgreSQL: Modifying tables",
      url: "https://www.postgresql.org/docs/current/ddl-alter.html",
    },
    {
      label: "PostgreSQL: Data manipulation",
      url: "https://www.postgresql.org/docs/current/dml.html",
    },
  ],
})
