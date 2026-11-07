import { defineLesson } from "@/data/lessons/author"

export default defineLesson("sql", {
  slug: "normalization",
  title: "Normalization: first, second and third normal form",
  topic: "Normalization",
  minutes: 70,
  overview:
    "Organise tables to remove redundancy and inconsistent dependencies: first, second and third normal form, with examples, and when it is reasonable to relax the rules.",
  objectives: [
    "Define normalization and say why redundancy causes maintenance problems",
    "Apply first, second and third normal form to a table",
    "Explain when a designer might choose to break a rule and what must be done about it",
  ],
  prerequisites: ["lesson.sql.joins"],
  sections: [
    {
      kind: "explain",
      heading: "What normalization is",
      body: [
        "**Normalization** is the process of organising data in a database. It includes creating tables and establishing relationships between them according to rules designed to protect the data and to make the database more flexible by eliminating **redundancy** and **inconsistent dependency**.",
        "Redundant data wastes disk space and creates maintenance problems. If data that exists in more than one place must be changed, it must be changed in exactly the same way everywhere. A customer's address is easier to change if it is stored only in the customers table.",
        "An inconsistent dependency is data stored where it does not belong. An employee's salary depends on the employee, so it belongs in the employees table, not in the customers table.",
        "The rules are called **normal forms**. If the first rule is observed, the database is in first normal form; if the first three are, it is in third normal form, which is considered the highest level necessary for most applications.",
      ],
    },
    {
      kind: "diagram",
      heading: "The first three normal forms",
      diagram: {
        kind: "table",
        title: "Rules in short",
        headers: ["Form", "Rule", "Typical fix"],
        rows: [
          ["First (1NF)", "No repeating groups; each set of related data in its own table; a primary key", "Move Vendor Code 1, 2, 3 into a separate vendors table"],
          ["Second (2NF)", "Values that apply to multiple records go in their own table, linked by a foreign key; a record depends on the whole key", "Store a customer's address once, not in every order"],
          ["Third (3NF)", "Fields that do not depend on the key do not belong in the table", "Move university details out of a candidates table"],
        ],
      },
    },
    {
      kind: "code",
      heading: "From one table to three",
      example: {
        title: "Removing repeated customer data",
        language: "sql",
        code: "-- Before: customer data repeated on every order row\nCREATE TABLE orders_flat (\n  order_id      integer PRIMARY KEY,\n  customer_name text,\n  customer_city text,\n  item          text,\n  quantity      integer\n);\n\n-- After: each fact stored once\nCREATE TABLE customers (\n  id   integer PRIMARY KEY,\n  name text NOT NULL,\n  city text\n);\n\nCREATE TABLE orders (\n  id          integer PRIMARY KEY,\n  customer_id integer NOT NULL REFERENCES customers (id)\n);\n\nCREATE TABLE order_items (\n  order_id integer REFERENCES orders (id),\n  item     text,\n  quantity integer,\n  PRIMARY KEY (order_id, item)\n);",
        walkthrough: [
          "In `orders_flat`, a customer's name and city repeat on every order, so changing a city means updating many rows and risking inconsistent values.",
          "After splitting, the city is stored once in `customers`. Orders refer to it with a foreign key.",
          "The items of an order are separate rows in `order_items`, instead of columns such as item1 and item2, which satisfies first normal form.",
          "Joins bring the data back together when a query needs it.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Breaking the rules on purpose",
      body: [
        "Following third normal form is theoretically desirable but not always practical. Normalization needs more tables, and many small tables can add join work and complexity.",
        "If you decide to violate one of the first three rules, make sure your application anticipates the problems that could result, such as redundant data and inconsistent dependencies. For example, storing a copy of a product's price on an order line is a deliberate choice, because the price at the time of purchase must not change later.",
        "Fourth and fifth normal forms (and Boyce-Codd normal form) exist, but they are rarely needed in everyday design.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Columns such as phone1, phone2, phone3.",
          fix: "Put the phone numbers in a separate table, one row per number.",
        },
        {
          mistake: "Repeating descriptive data on every row.",
          fix: "Store it once in the table it belongs to and refer to it by key.",
        },
        {
          mistake: "Storing a comma-separated list in one column.",
          fix: "Use a related table with one row per value.",
        },
        {
          mistake: "Denormalising without a reason.",
          fix: "Do it deliberately, for a measured benefit, and keep the copies consistent.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reviewing a spreadsheet-style table",
      scenario:
        "A table lists students with columns for name, course1, course2, course3 and the teacher's phone number for each course.",
      body: [
        "Repeating course columns break first normal form: create a `courses` table and an `enrolments` table linking students to courses. The teacher's phone number depends on the course (or teacher), not on the student, so it belongs in the course or teacher table.",
        "After the change, a teacher's phone number is stored once, and a student can take any number of courses.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "first-nf",
      prompt: "Which design breaks first normal form?",
      options: [
        "Columns vendor1, vendor2 and vendor3 in an item table",
        "A vendors table linked by a key",
        "A primary key on every table",
      ],
      answer: 0,
      explanation:
        "Repeating groups of similar columns should be moved to a separate table.",
    },
    {
      type: "truefalse",
      id: "third-highest",
      statement: "Third normal form is generally considered the highest level necessary for most applications.",
      answer: true,
      explanation:
        "Higher forms exist, but third normal form is enough for most applications.",
    },
    {
      type: "single",
      id: "why-normalize",
      prompt: "What problem does storing a customer's address on every order row create?",
      options: [
        "Redundant data that must be changed in many places",
        "Faster queries",
        "Fewer tables to maintain",
      ],
      answer: 0,
      explanation:
        "Redundant copies waste space and risk becoming inconsistent when one is changed.",
    },
    {
      type: "blank",
      id: "link-tables",
      prompt: "Separate tables are related to each other with a ___ key.",
      answer: "foreign",
      explanation:
        "A foreign key in one table refers to the primary key of another.",
    },
  ],
  assignment: {
    title: "Normalise a flat table",
    task: [
      "Take a flat table such as a spreadsheet of invoices (customer details, product details and quantities on every row) and split it into normalised tables.",
      "Write CREATE TABLE statements with primary and foreign keys, and write one deliberate exception with a reason.",
    ],
    checklist: [
      "No repeating groups remain",
      "Each fact is stored in one place",
      "Tables are linked by foreign keys",
      "I can explain which normal form each change achieved",
    ],
    hints: ["Ask of each column: what does this value depend on?"],
    minutes: 35,
  },
  exercises: [
    {
      slug: "split-the-table",
      title: "Split the table",
      task: [
        "A table students(id, name, course1, course2, course3) breaks first normal form. Write CREATE TABLE statements for courses(id, title) and enrolments(student_id, course_id) with keys, so a student can take any number of courses.",
      ],
      language: "sql",
      starter: "CREATE TABLE courses (\n);\n\nCREATE TABLE enrolments (\n);",
      solution:
        "CREATE TABLE courses (\n  id    integer PRIMARY KEY,\n  title text NOT NULL\n);\n\nCREATE TABLE enrolments (\n  student_id integer REFERENCES students (id),\n  course_id  integer REFERENCES courses (id),\n  PRIMARY KEY (student_id, course_id)\n);",
      hints: ["The enrolments table needs a composite primary key of the two ids."],
      checklist: [
        "courses has a primary key",
        "enrolments has two foreign keys",
        "The pair of ids is the primary key",
      ],
    },
  ],
  revisionNotes: [
    "Normalization removes redundancy and inconsistent dependency",
    "1NF: no repeating groups, a primary key. 2NF: shared values in their own table. 3NF: fields depend on the key",
    "Relate tables with foreign keys",
    "Breaking a rule is a deliberate choice; plan for the consequences",
  ],
  resources: [
    {
      label: "Microsoft Learn: Description of the database normalization basics",
      url: "https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description",
    },
    {
      label: "PostgreSQL: Constraints (primary and foreign keys)",
      url: "https://www.postgresql.org/docs/current/ddl-constraints.html",
    },
  ],
})
