import { mod } from "./factory"

export const DATABASE_MODULES = [
  mod(
    "sql",
    "SQL",
    "database",
    "database",
    "beginner",
    "Queries, joins, aggregation, subqueries, window functions, indexing, transactions and optimisation.",
    [
      ["SELECT & filtering", 60],
      ["Joins", 90],
      ["Aggregation", 60],
      ["Subqueries", 60],
      ["Window functions", 80],
      ["Indexes", 70],
      ["Normalization", 70],
      ["Transactions", 60],
      ["Constraints", 45],
      ["DDL & DML", 50],
      ["Query optimization", 70],
    ]
  ),
  mod(
    "postgresql",
    "PostgreSQL",
    "database",
    "database",
    "intermediate",
    "Postgres-specific features, query planning, transactions and tuning.",
    [
      ["Data types", 40],
      ["PostgreSQL indexes", 70],
      ["Query planner", 80],
      ["MVCC", 70],
      ["PostgreSQL transactions", 60],
    ],
    { prerequisites: ["sql"] }
  ),
  mod(
    "mongodb",
    "MongoDB & Mongoose",
    "database",
    "database",
    "intermediate",
    "Document modelling, aggregation, indexing, transactions and Mongoose patterns.",
    [
      ["Document modelling", 90],
      ["Aggregation", 100],
      ["Indexes", 60],
      ["Mongoose", 100],
      ["Transactions & consistency", 45],
    ],
    { alsoIn: ["mern-backend"] }
  ),
  mod(
    "database-design",
    "Database Design",
    "database",
    "database",
    "intermediate",
    "Modelling data: relations, schemas, SQL versus NoSQL and migrations.",
    [
      ["Entity-relationship modelling", 70],
      ["Schema design for applications", 70],
      ["SQL vs NoSQL", 50],
      ["Document modelling decisions", 45],
      ["Migrations", 45],
    ],
    { prerequisites: ["sql"] }
  ),
]
