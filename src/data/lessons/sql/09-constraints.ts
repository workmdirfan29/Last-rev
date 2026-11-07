import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "constraints",
  title: "Constraints: keeping data valid",
  topic: "Constraints",
  minutes: 45,
  overview:
    "Let the database reject bad data: NOT NULL, UNIQUE, CHECK, primary keys, foreign keys and their ON DELETE actions.",
  objectives: [
    "Declare NOT NULL, UNIQUE, CHECK, PRIMARY KEY and FOREIGN KEY constraints",
    "Explain what each constraint prevents",
    "Choose an ON DELETE action for a foreign key",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Rules the database enforces",
      body: [
        "Data types limit what a column can hold, but often too coarsely. A price column of type `numeric` accepts negative numbers, even though a product price should be positive. **Constraints** let you add rules on columns and tables, and if a statement would violate one, the database raises an error and the change is not made.",
        "A **NOT NULL** constraint says a column must always have a value. A **UNIQUE** constraint says the values in a column, or group of columns, must be distinct across rows. A **CHECK** constraint says a value must satisfy a Boolean expression.",
        "A **primary key** identifies each row: it requires values that are both unique and not null, and a table can have at most one. A **foreign key** says the values in a column must match values in a row of another table, which maintains **referential integrity** between the two tables.",
      ],
    },
    {
      kind: "code",
      heading: "Declaring constraints",
      example: {
        title: "A products and orders schema",
        language: "sql",
        code: "CREATE TABLE products (\n  product_no integer PRIMARY KEY,\n  name       text NOT NULL,\n  sku        text UNIQUE,\n  price      numeric CHECK (price > 0)\n);\n\nCREATE TABLE orders (\n  order_id   integer PRIMARY KEY,\n  product_no integer REFERENCES products (product_no) ON DELETE RESTRICT,\n  quantity   integer NOT NULL CHECK (quantity > 0)\n);",
        walkthrough: [
          "`PRIMARY KEY` on `product_no` makes it unique and not null, and the database creates an index for it.",
          "`NOT NULL` on `name` and `quantity` means they must be provided.",
          "`UNIQUE` on `sku` rejects a second row with the same sku. By default, NULLs are not considered equal, so several rows may have a NULL sku.",
          "`CHECK (price > 0)` rejects zero and negative prices.",
          "`REFERENCES products` makes `orders.product_no` match an existing product. `ON DELETE RESTRICT` stops a product being deleted while an order refers to it.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "What happens on delete",
      body: [
        "A foreign key says what should happen when the referenced row is deleted. The default, `NO ACTION`, raises an error if rows still refer to it. `RESTRICT` prevents the deletion and cannot be deferred.",
        "`CASCADE` deletes the referencing rows too, which suits dependent data such as order items when an order is removed. `SET NULL` and `SET DEFAULT` set the referencing columns to NULL or to their default.",
        "Choose by the business rule. Cascading is convenient, but one delete can remove a lot of data, so use it deliberately.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Relying only on application code to validate data.",
          fix: "Add constraints too, so every writer is held to the same rules.",
        },
        {
          mistake: "Forgetting that NULL passes a CHECK condition that evaluates to unknown.",
          fix: "Add NOT NULL when a value is required.",
        },
        {
          mistake: "Using CASCADE everywhere.",
          fix: "Choose the action that matches what should happen to the dependent rows.",
        },
        {
          mistake: "No primary key on a table.",
          fix: "Give every table a primary key that identifies its rows.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Making a signup table safe",
      scenario:
        "A users table must have a unique email, a non-empty name and an age that is not negative.",
      body: [
        "Declare `email text NOT NULL UNIQUE`, `name text NOT NULL CHECK (name <> '')` and `age integer CHECK (age >= 0)`. Now an insert that breaks any rule fails with an error you can show to the user.",
        "Handle the unique violation in the application, for example by telling the user that the email is already registered.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pk-guarantee",
      prompt: "What must be true of a primary key's values?",
      options: ["Unique and not null", "Unique but may be null", "Numeric only"],
      answer: 0,
      explanation:
        "A primary key requires values that are both unique and not null.",
    },
    {
      type: "truefalse",
      id: "multi-null-unique",
      statement: "By default, a UNIQUE column in PostgreSQL may contain several NULL values.",
      answer: true,
      explanation:
        "NULLs are not considered equal, so they do not violate uniqueness (unless NULLS NOT DISTINCT is used).",
    },
    {
      type: "single",
      id: "cascade-effect",
      prompt: "What does ON DELETE CASCADE do?",
      options: [
        "Deletes rows that refer to the deleted row",
        "Prevents the deletion",
        "Sets the referencing column to NULL",
      ],
      answer: 0,
      explanation:
        "CASCADE deletes the referencing rows automatically.",
    },
    {
      type: "blank",
      id: "check-keyword",
      prompt: "A ___ constraint requires that a value satisfy a Boolean expression, such as price > 0.",
      answer: "CHECK",
      explanation:
        "`CHECK (expression)` is the most general constraint type.",
    },
  ],
  assignment: {
    title: "Constrain a schema",
    task: [
      "Design tables for authors and books with a foreign key from books to authors, a unique ISBN, a positive page count and a required title.",
      "Write inserts that violate each constraint and record the error each produces.",
    ],
    checklist: [
      "Every table has a primary key",
      "The foreign key has an ON DELETE action I can justify",
      "Each constraint was tested with a failing insert",
      "Required columns are NOT NULL",
    ],
    hints: ["Run the failing inserts one at a time and read the error messages."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "add-constraints",
      title: "Add the constraints",
      task: [
        "Write CREATE TABLE members with: id as primary key, email required and unique, and level as an integer between 1 and 5.",
      ],
      language: "sql",
      starter: "CREATE TABLE members (\n);",
      solution:
        "CREATE TABLE members (\n  id    integer PRIMARY KEY,\n  email text NOT NULL UNIQUE,\n  level integer CHECK (level BETWEEN 1 AND 5)\n);",
      hints: ["A CHECK can use BETWEEN."],
      checklist: [
        "id is the primary key",
        "email is NOT NULL and UNIQUE",
        "level is limited to 1 to 5",
      ],
    },
  ],
  revisionNotes: [
    "NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY",
    "Primary key = unique + not null; one per table",
    "Foreign key keeps referential integrity; choose RESTRICT, CASCADE, SET NULL deliberately",
    "Constraints protect data from every writer, not just one application",
  ],
  resources: [
    {
      label: "PostgreSQL: Constraints",
      url: "https://www.postgresql.org/docs/current/ddl-constraints.html",
    },
    {
      label: "PostgreSQL: CREATE TABLE",
      url: "https://www.postgresql.org/docs/current/sql-createtable.html",
    },
  ],
})
