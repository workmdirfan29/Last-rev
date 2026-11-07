import { defineQuestions } from "../author"
import { g } from "../brief"

const PG = "https://www.postgresql.org/docs/current"
const MO = "https://www.mongodb.com/docs/manual"
const DJ = "https://docs.djangoproject.com/en/stable"

export default defineQuestions("database-design", "fresher", [
  g({
    slug: "primary-key-purpose",
    topic: "Entity-relationship modelling",
    d: "easy",
    title: "What is a primary key and what must it guarantee?",
    kw: ["primary key", "unique identifier", "not null", "composite key", "entity"],
    intent:
      "Checks that you can say what identifies each row of an entity.",
    short:
      "A primary key constraint indicates that a column, or a group of columns, can be used as a unique identifier for the rows in a table. It requires that the values be both unique and not null. Adding a primary key in PostgreSQL automatically creates a unique B-tree index on the column or columns and marks them NOT NULL. A table can have at most one primary key, although it can have any number of unique constraints. PostgreSQL does not require one, but the documentation says it is usually best to have one. Primary keys can span several columns.",
    detail: [
      "A primary key is useful for documentation and for client applications that need to identify a row.",
      "Foreign keys in other tables refer to the primary key by default.",
      "A primary key can be declared as a column constraint or as a table constraint.",
    ],
    ex: "An orders table has order_id integer PRIMARY KEY, and every other table that refers to an order uses that id.",
    mistakes: [
      "Creating tables with no primary key.",
      "Using a value that can change, such as an email address, as the key.",
    ],
    follow: ["What is a foreign key?"],
    points: [
      "Unique and not null",
      "At most one per table",
      "Can span several columns",
      "Creates a unique index",
    ],
    notes: "Primary key = unique + not null identity of a row.",
    src: [["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`]],
  }),
  g({
    slug: "foreign-key-referential-integrity",
    topic: "Entity-relationship modelling",
    d: "easy",
    title: "What is a foreign key and what is referential integrity?",
    kw: ["foreign key", "referential integrity", "REFERENCES", "referencing table", "orphan rows"],
    intent:
      "Checks that you can express a relationship between two tables in the schema itself.",
    short:
      "A foreign key constraint specifies that the values in a column, or group of columns, must match the values appearing in some row of another table. This maintains referential integrity between the two related tables. For example, an orders table can have product_no integer REFERENCES products (product_no), which makes it impossible to create an order with a non-null product_no that does not appear in the products table. The orders table is the referencing table and products the referenced table. If you leave out the column list, the primary key of the referenced table is used. A foreign key can also span several columns, and the number and types must match.",
    detail: [
      "A foreign key column can be NULL, and a NULL is not checked against the referenced table.",
      "A table can have more than one foreign key.",
      "A foreign key can reference the same table, which is called a self-referential foreign key.",
    ],
    ex: "order_items.order_id REFERENCES orders ensures every item belongs to an order that exists.",
    mistakes: [
      "Relying on application code alone to prevent orphan rows.",
      "Mixing types between the referencing and referenced columns.",
    ],
    follow: ["What happens when the referenced row is deleted?"],
    points: [
      "Values must exist in the referenced table",
      "Maintains referential integrity",
      "Defaults to the referenced primary key",
      "Can reference its own table",
    ],
    notes: "Foreign keys make relationships enforceable.",
    src: [["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`]],
  }),
  g({
    slug: "on-delete-actions",
    topic: "Entity-relationship modelling",
    d: "medium",
    title: "What do ON DELETE NO ACTION, RESTRICT and CASCADE do?",
    kw: ["ON DELETE", "CASCADE", "RESTRICT", "NO ACTION", "SET NULL"],
    intent:
      "Checks that you decide what happens to dependent rows when a parent row is deleted.",
    short:
      "A foreign key's ON DELETE clause says what happens when a referenced row is deleted. The default is NO ACTION: the deletion is allowed to proceed, but the foreign key constraint must still hold, so it usually results in an error, and the check can be deferred to later in the transaction. RESTRICT is stricter: it prevents deletion of a referenced row and cannot be deferred. CASCADE says that when a referenced row is deleted, the rows referencing it are automatically deleted as well. SET NULL and SET DEFAULT set the referencing columns to null or their defaults.",
    detail: [
      "The PostgreSQL example uses ON DELETE RESTRICT for the product and ON DELETE CASCADE for the order.",
      "CASCADE is convenient but can remove a lot of data from one delete.",
      "Think about the rule before adding the constraint.",
    ],
    ex: "Deleting an order removes its order_items by CASCADE, but a product that is still in an order cannot be deleted.",
    mistakes: [
      "Using CASCADE everywhere without thinking about what is deleted.",
      "Expecting the default to delete dependent rows.",
    ],
    follow: ["How is a many-to-many relationship modelled?"],
    points: [
      "Default NO ACTION",
      "RESTRICT blocks deletion",
      "CASCADE deletes dependents",
      "SET NULL and SET DEFAULT also exist",
    ],
    notes: "Pick the delete rule from the business rule.",
    src: [["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`]],
  }),
  g({
    slug: "one-to-many-relationship",
    topic: "Entity-relationship modelling",
    d: "easy",
    title: "How do you model a one-to-many relationship in a relational database?",
    kw: ["one-to-many", "many-to-one", "foreign key", "parent", "child"],
    intent:
      "Checks that you put the foreign key on the 'many' side.",
    short:
      "In a one-to-many relationship, one row of the parent table relates to many rows of the child table. In a relational database you model it with a foreign key column in the child table that references the parent's primary key. In the PostgreSQL documentation, an orders table has a product_no column that references products, which guarantees that every order refers to an existing product. Django describes the same thing as a many-to-one relationship, defined with ForeignKey on the model that has the 'many' side: a Manufacturer makes multiple cars, but each Car has only one Manufacturer, so Car holds the foreign key.",
    detail: [
      "The foreign key sits on the 'many' side, never as a list in the 'one' side.",
      "An index on the foreign key column helps queries from parent to children.",
      "Choose the delete rule when you define the key.",
    ],
    ex: "Each Order row has a customer_id referencing customers, so one customer can have many orders.",
    mistakes: [
      "Putting a list of child ids in the parent table.",
      "Forgetting the foreign key and leaving the relationship unenforced.",
    ],
    follow: ["How do you model many-to-many?"],
    points: [
      "Foreign key on the many side",
      "References the parent's primary key",
      "Django: ForeignKey",
      "Pick the delete rule",
    ],
    notes: "The child table holds the foreign key.",
    src: [
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
      ["Django: Models, relationships", `${DJ}/topics/db/models/`],
    ],
  }),
  g({
    slug: "many-to-many-join-table",
    topic: "Entity-relationship modelling",
    d: "medium",
    title: "How do you model a many-to-many relationship with a join table?",
    kw: ["many-to-many", "join table", "junction table", "composite primary key", "order_items"],
    intent:
      "Checks that you can resolve many-to-many with an extra table that can carry its own columns.",
    short:
      "A table can have more than one foreign key, and this is how many-to-many relationships are implemented. In the PostgreSQL example, to allow an order to contain many products and a product to be in many orders, you add an order_items table with a foreign key to products, a foreign key to orders and a quantity column. Its primary key is the pair (product_no, order_id), so the primary key overlaps with the foreign keys. The join table can hold attributes of the relationship itself, such as quantity. Django offers ManyToManyField, which creates such a table for you, placed on one of the two models only.",
    detail: [
      "The ON DELETE rules on the join table decide what happens when either side is removed.",
      "Django's ManyToManyField should go on the model that is edited on a form, but only on one of the two.",
      "Use an explicit join model when the relationship has its own data.",
    ],
    ex: "students and courses are linked by an enrolments table with student_id, course_id and enrolled_on.",
    mistakes: [
      "Storing comma-separated ids in a column.",
      "Forgetting a composite key, so the same pair can be inserted twice.",
    ],
    follow: ["What delete rules would you use on the join table?"],
    points: [
      "Join table with two foreign keys",
      "Composite primary key prevents duplicates",
      "Can hold relationship attributes",
      "Django ManyToManyField automates it",
    ],
    notes: "Many-to-many = two one-to-many relationships through a join table.",
    code: [
      "Join table for orders and products",
      `CREATE TABLE order_items (
  product_no integer REFERENCES products ON DELETE RESTRICT,
  order_id   integer REFERENCES orders   ON DELETE CASCADE,
  quantity   integer,
  PRIMARY KEY (product_no, order_id)
);`,
      [
        "Two foreign keys link each row to a product and an order.",
        "The composite primary key stops the same pair appearing twice.",
        "quantity is an attribute of the relationship itself.",
      ],
      "sql",
    ],
    src: [
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
      ["Django: Models, relationships", `${DJ}/topics/db/models/`],
    ],
  }),
  g({
    slug: "one-to-one-relationship",
    topic: "Entity-relationship modelling",
    d: "medium",
    title: "When and how do you model a one-to-one relationship?",
    kw: ["one-to-one", "OneToOneField", "unique foreign key", "extends", "embedding"],
    intent:
      "Checks that you know when a separate table for the same entity makes sense.",
    short:
      "A one-to-one relationship means each row of one table relates to at most one row of another. In Django you define it with OneToOneField, which the documentation says is most useful on the primary key of an object that extends another object in some way. The example: a Restaurant extends a Place, so instead of repeating address and phone fields, Restaurant has a OneToOneField to Place. In plain SQL you get the same effect with a foreign key that is also unique, or that is itself the primary key. In MongoDB, a patient and a medical record can be modelled by embedding one in the other.",
    detail: [
      "A separate table suits optional data that applies to only some rows.",
      "Model inheritance in Django uses an implicit one-to-one relation.",
      "If the two always change together, consider keeping them in one table.",
    ],
    ex: "A users table and a user_profiles table share the same key, with user_profiles.user_id as primary key and foreign key.",
    mistakes: [
      "Splitting a table into two one-to-one tables with no reason.",
      "Forgetting the unique constraint, which turns it into one-to-many.",
    ],
    follow: ["When would you embed instead?"],
    points: [
      "At most one related row each way",
      "Foreign key plus uniqueness",
      "Django OneToOneField",
      "MongoDB often embeds",
    ],
    notes: "One-to-one = a unique foreign key.",
    src: [
      ["Django: Models, relationships", `${DJ}/topics/db/models/`],
      ["MongoDB: Data Modeling", `${MO}/data-modeling/`],
    ],
  }),
  g({
    slug: "self-referential-hierarchy",
    topic: "Entity-relationship modelling",
    d: "medium",
    title: "How do you model a hierarchy such as categories or an org chart?",
    kw: ["self-referential foreign key", "tree", "parent_id", "hierarchy", "recursive relationship"],
    intent:
      "Checks that you can model a tree with one table that refers to itself.",
    short:
      "Sometimes the other table of a foreign key constraint is the same table; this is called a self-referential foreign key. The PostgreSQL documentation gives the example of rows representing nodes of a tree: node_id is the primary key, parent_id is declared REFERENCES tree, and name holds the data. A top-level node has a NULL parent_id, while non-null parent_id values are constrained to reference valid rows. This models categories, folders, comments with replies or an employee-manager chart in a single table. Django supports the same idea with recursive relationships, where a model has a relationship to itself.",
    detail: [
      "The foreign key guarantees no node points to a parent that does not exist.",
      "Queries over several levels need recursive queries or repeated joins.",
      "Other databases or MongoDB handle large hierarchical data sets with references.",
    ],
    ex: "A categories table has parent_id REFERENCES categories, with NULL for top-level categories.",
    mistakes: [
      "Storing the whole path as text without any constraint.",
      "Ignoring the delete rule for a node that has children.",
    ],
    follow: ["How do you query all descendants?"],
    points: [
      "Table references itself",
      "NULL parent means the root",
      "Foreign key keeps the tree valid",
      "Django: recursive relationship",
    ],
    notes: "parent_id REFERENCES the same table.",
    src: [
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
      ["Django: Models, relationships", `${DJ}/topics/db/models/`],
    ],
  }),
  g({
    slug: "not-null-unique-check-constraints",
    topic: "Schema design for applications",
    d: "easy",
    title: "Which constraints should a table definition include besides keys?",
    kw: ["NOT NULL", "UNIQUE", "CHECK constraint", "constraints", "data integrity"],
    intent:
      "Checks that you push data rules into the schema.",
    short:
      "Data types constrain what can be stored, but often too coarsely, so SQL lets you define constraints on columns and tables. A not-null constraint specifies that a column must not hold the null value. A unique constraint ensures that the data in a column, or group of columns, is unique among the rows, for example only one row per product number. A check constraint, the most generic type, lets you require that a value in a column satisfy a Boolean expression, for example that a price must be positive. Violating a constraint raises an error.",
    detail: [
      "Constraints give the database the job of rejecting invalid data no matter which application writes it.",
      "A constraint can be given an explicit name.",
      "Django has CheckConstraint and UniqueConstraint classes for the same purpose.",
    ],
    ex: "price numeric CHECK (price > 0) and sku text NOT NULL UNIQUE on a products table.",
    mistakes: [
      "Relying on the application to validate everything.",
      "Allowing nulls in columns that are always required.",
    ],
    follow: ["How are constraints created in a migration?"],
    points: [
      "NOT NULL for required columns",
      "UNIQUE for one-per-value rules",
      "CHECK for value rules",
      "Errors on violation",
    ],
    notes: "Put the rules in the schema.",
    src: [
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
      ["Django: Constraints reference", `${DJ}/ref/models/constraints/`],
    ],
  }),
  g({
    slug: "views-encapsulate-schema",
    topic: "Schema design for applications",
    d: "medium",
    title: "How do views help schema design?",
    kw: ["view", "CREATE VIEW", "encapsulation", "interface", "schema evolution"],
    intent:
      "Checks that you can hide table structure behind a stable interface.",
    short:
      "A view gives a name to a query so that you can refer to it like an ordinary table without retyping the query, for example CREATE VIEW myview AS SELECT ... joining weather and cities. The PostgreSQL tutorial says that making liberal use of views is a key aspect of good SQL database design. Views allow you to encapsulate the details of the structure of your tables, which might change as your application evolves, behind consistent interfaces. Views can be used almost anywhere a real table can, and you can build views upon other views. They help applications keep working when you reorganise the underlying tables.",
    detail: [
      "A view does not store its own data unless it is a materialized view.",
      "CREATE VIEW has its own reference page in the SQL commands section.",
      "The tutorial builds a view over a join of two tables.",
    ],
    ex: "A customer_orders view joins customers, orders and items, and reports query that view instead of repeating the joins.",
    mistakes: [
      "Layering many views until the final query is hard to understand.",
      "Assuming a view automatically makes a slow query fast.",
    ],
    follow: ["What is a generated column?"],
    points: [
      "A named query",
      "Used like a table",
      "Hides table structure",
      "Can build on other views",
    ],
    notes: "Views are stable interfaces over changing tables.",
    src: [
      ["PostgreSQL: Views", `${PG}/tutorial-views.html`],
      ["PostgreSQL: CREATE VIEW", `${PG}/sql-createview.html`],
    ],
  }),
  g({
    slug: "schemas-namespaces",
    topic: "Schema design for applications",
    d: "medium",
    title: "What is a schema in PostgreSQL, and why use several?",
    kw: ["schema", "namespace", "CREATE SCHEMA", "search path", "database"],
    intent:
      "Checks that you know schemas group objects inside one database.",
    short:
      "A PostgreSQL database cluster contains one or more named databases, and a database contains one or more named schemas, which in turn contain tables. The same object name can be used in different schemas without conflict, for example schema1 and myschema can both contain a table named mytable. Unlike databases, schemas are not rigidly separated: a user can access objects in any schema of the database they are connected to, if they have privileges. Reasons to use schemas include letting many users share a database without interfering, organising objects into logical groups, and keeping third-party applications' objects separate.",
    detail: [
      "CREATE SCHEMA creates one, and objects are referred to with a qualified name such as schema.table.",
      "Schemas are analogous to operating-system directories, except that they cannot be nested.",
      "The schema search path decides which schema is used when a name is not qualified.",
    ],
    ex: "An application keeps its tables in an app schema and reporting views in a reports schema.",
    mistakes: [
      "Putting everything in the public schema without any organisation.",
      "Assuming schemas fully separate users without granting privileges.",
    ],
    follow: ["What is the search path?"],
    points: [
      "Database contains schemas",
      "Schemas contain tables and more",
      "Same names allowed in different schemas",
      "Cannot be nested",
    ],
    notes: "Schemas are namespaces inside a database.",
    src: [["PostgreSQL: Schemas", `${PG}/ddl-schemas.html`]],
  }),
  g({
    slug: "generated-columns",
    topic: "Schema design for applications",
    d: "medium",
    title: "What is a generated column?",
    kw: ["generated column", "GENERATED ALWAYS AS", "stored", "virtual", "computed column"],
    intent:
      "Checks that you can store a derived value without keeping it in sync by hand.",
    short:
      "A generated column is a special column that is always computed from other columns, so it is for columns what a view is for tables. There are two kinds: stored and virtual. A stored generated column is computed when the row is written, inserted or updated, and occupies storage like a normal column. A virtual one occupies no storage and is computed when it is read; this is the default. You create one with GENERATED ALWAYS AS in CREATE TABLE, for example height_in numeric GENERATED ALWAYS AS (height_cm / 2.54). It cannot be written to directly.",
    detail: [
      "A stored generated column is similar to a materialized view that is always updated automatically.",
      "In INSERT or UPDATE you may only specify the keyword DEFAULT for it.",
      "It keeps derived values from drifting out of date.",
    ],
    ex: "total_price numeric GENERATED ALWAYS AS (unit_price * quantity) STORED.",
    mistakes: [
      "Maintaining a derived value by hand in application code.",
      "Trying to insert a value into a generated column.",
    ],
    follow: ["How does it differ from a default value?"],
    points: [
      "Always computed from other columns",
      "Stored or virtual",
      "Cannot be written directly",
      "Stays consistent",
    ],
    notes: "Let the database compute derived values.",
    src: [["PostgreSQL: Generated Columns", `${PG}/ddl-generated-columns.html`]],
  }),
  g({
    slug: "table-partitioning-basics",
    topic: "Schema design for applications",
    d: "hard",
    title: "What is table partitioning and what are its benefits?",
    kw: ["partitioning", "partition", "DETACH PARTITION", "bulk delete", "large tables"],
    intent:
      "Checks that you know when splitting one logical table into pieces helps.",
    short:
      "Partitioning refers to splitting what is logically one large table into smaller physical pieces. PostgreSQL lists several benefits. Query performance can improve dramatically in certain situations, particularly when most of the heavily accessed rows are in a single partition or a few partitions. Heavily used parts of the indexes are more likely to fit in memory. Bulk loads and deletes can be accomplished by adding or removing partitions, if the usage pattern is accounted for in the design, and dropping a partition with DROP TABLE or ALTER TABLE DETACH PARTITION is far faster than a bulk delete and avoids its VACUUM overhead. Seldom-used data can be moved to cheaper storage.",
    detail: [
      "The documentation covers declarative partitioning, inheritance-based partitioning and partition pruning.",
      "The partitioning design should match how the data is queried and removed.",
      "It is a design decision, so plan it before the table grows very large.",
    ],
    ex: "A logs table is partitioned by month so old months are removed by dropping a partition.",
    mistakes: [
      "Partitioning a small table that gains nothing from it.",
      "Choosing a partition key that queries never filter on.",
    ],
    follow: ["How does retention fit partitioning?"],
    points: [
      "One logical table in physical pieces",
      "Helps when queries hit few partitions",
      "Fast bulk removal",
      "Match the key to access patterns",
    ],
    notes: "Partition by what you query and delete by.",
    src: [["PostgreSQL: Table Partitioning", `${PG}/ddl-partitioning.html`]],
  }),
  g({
    slug: "schema-design-for-queries-indexes",
    topic: "Schema design for applications",
    d: "medium",
    title: "How do application queries influence the schema and indexes you design?",
    kw: ["access patterns", "indexes", "workload", "query patterns", "schema design"],
    intent:
      "Checks that you design from how data is read and written, not just from the entities.",
    short:
      "A schema should be designed for the operations the application actually performs. Without an index, a query that filters on a column must scan the whole table row by row; with an index on that column the database can find rows much more efficiently. The PostgreSQL documentation says it is the task of the database programmer to foresee which indexes will be useful. The MongoDB schema design process follows the same logic: identify your workload, the operations your application runs most frequently, then map relationships, apply design patterns and create indexes that support your common query patterns. Start from the queries, then shape tables and indexes around them.",
    detail: [
      "MongoDB lists unnecessary indexes as an anti-pattern because they degrade write performance.",
      "MongoDB suggests planning the schema early, before running at production scale.",
      "Revisit the design when the workload changes.",
    ],
    ex: "Because the app lists a customer's recent orders, orders gets an index on (customer_id, created_at).",
    mistakes: [
      "Designing tables from a diagram alone and finding the queries slow later.",
      "Indexing every column.",
    ],
    follow: ["How does MongoDB's design process work?"],
    points: [
      "Start from the workload",
      "Indexes follow common queries",
      "Writes pay for indexes",
      "Plan early, revisit later",
    ],
    notes: "Design for the queries you will run.",
    src: [
      ["PostgreSQL: Indexes introduction", `${PG}/indexes-intro.html`],
      ["MongoDB: Designing Your Schema", `${MO}/data-modeling/schema-design-process/`],
      ["MongoDB: Schema Design Anti-Patterns", `${MO}/data-modeling/design-antipatterns/`],
    ],
  }),
  g({
    slug: "sql-vs-nosql-schema-flexibility",
    topic: "SQL vs NoSQL",
    d: "medium",
    title: "How does schema flexibility differ between a relational database and MongoDB?",
    kw: ["flexible schema", "schema validation", "polymorphic data", "relational", "document model"],
    intent:
      "Checks that you can compare enforced and flexible schemas fairly.",
    short:
      "In a relational database such as PostgreSQL each table has a defined set of columns with data types and constraints, and every row follows it. MongoDB has a flexible data model: documents in a single collection are not required to have the same set of fields or data types, so you can store polymorphic data and add new fields without rewriting existing documents or running a schema migration. When you want structure, schema validation lets you create rules for fields, such as allowed data types and value ranges. It is most useful for an established application with a defined data structure. Flexibility moves responsibility for consistency toward the application.",
    detail: [
      "Validation rules do not need to cover every field in a document unless your application requires it.",
      "After validation rules are added, inserts must match them according to the validation level.",
      "Even in MongoDB, planning the schema early helps performance at scale.",
    ],
    ex: "A product catalogue stores items with different attributes in one MongoDB collection, with validation requiring a price.",
    mistakes: [
      "Treating 'schemaless' as 'no design needed'.",
      "Leaving data types unchecked and getting inconsistent documents.",
    ],
    follow: ["What does schema validation check?"],
    points: [
      "Relational: fixed columns and types",
      "MongoDB: flexible documents",
      "Validation adds structure when needed",
      "Consistency is a design duty",
    ],
    notes: "Flexible does not mean unstructured; add validation as the schema settles.",
    src: [
      ["MongoDB: Data Modeling", `${MO}/data-modeling/`],
      ["MongoDB: Schema Validation", `${MO}/core/schema-validation/`],
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
    ],
  }),
  g({
    slug: "store-data-accessed-together",
    topic: "SQL vs NoSQL",
    d: "medium",
    title: "How does the 'data accessed together should be stored together' principle differ from normalisation?",
    kw: ["access patterns", "denormalised", "joins", "embedding", "normalised"],
    intent:
      "Checks that you can contrast designing around entities with designing around reads.",
    short:
      "A core principle of data modelling in MongoDB is that data that is accessed together should be stored together, and you should structure your data model on your application's data access patterns to optimise performance. Embedded documents store related data in one document, so related data can be retrieved in a single operation; the documentation calls these denormalised models. References instead store links between documents and result in normalised data models, because the data is divided into several collections and not duplicated. Neither is always better: it depends on how the data is read and updated.",
    detail: [
      "Embedding can also update related data in a single atomic write.",
      "Referencing fits many-to-many relationships and data queried on its own.",
      "MongoDB's examples include embedding a department in employee documents.",
    ],
    ex: "A product page that always shows the five latest reviews embeds them, while all older reviews live in a reviews collection.",
    mistakes: [
      "Applying one style to every relationship without looking at access patterns.",
      "Embedding data that changes constantly and is duplicated elsewhere.",
    ],
    follow: ["When do you reference instead of embed?"],
    points: [
      "Store together what is read together",
      "Embedding = denormalised",
      "Referencing = normalised",
      "Decide by access pattern",
    ],
    notes: "Read patterns drive the design.",
    src: [
      ["MongoDB: Data Modeling", `${MO}/data-modeling/`],
      ["MongoDB: Embedded Data", `${MO}/data-modeling/embedding/`],
      ["MongoDB: Reference Data", `${MO}/data-modeling/referencing/`],
    ],
  }),
  g({
    slug: "transactions-sql-vs-mongodb",
    topic: "SQL vs NoSQL",
    d: "medium",
    title: "How do transactions compare in PostgreSQL and MongoDB?",
    kw: ["transactions", "ACID", "atomic", "single-document", "multi-document"],
    intent:
      "Checks that you know both support atomic multi-step work and how document design reduces the need.",
    short:
      "In PostgreSQL a transaction bundles multiple steps into a single, all-or-nothing operation, and it is the basic mechanism for keeping related changes consistent. MongoDB supports multi-document ACID transactions across multiple operations, collections, databases, documents and shards, with atomicity, consistency, isolation and durability according to the configured read and write concern. In MongoDB an operation on a single document is atomic, and the document model supports embedding related data within one document, which reduces the need for multi-document transactions. When the application needs atomicity across multiple documents, use transactions. So data modelling choices in MongoDB influence how often you need them.",
    detail: [
      "Embedding lets related data be updated in a single atomic write.",
      "PostgreSQL's default autocommit mode treats each statement as its own transaction.",
      "Choose the model first, then add transactions where the model needs them.",
    ],
    ex: "A MongoDB order document embeds its items, so one write creates the whole order atomically.",
    mistakes: [
      "Assuming a document database cannot do ACID transactions.",
      "Splitting data across many collections and then needing transactions everywhere.",
    ],
    follow: ["When does embedding avoid a transaction?"],
    points: [
      "SQL: all-or-nothing transactions",
      "MongoDB: single-document operations are atomic",
      "MongoDB also has multi-document transactions",
      "Embedding reduces the need",
    ],
    notes: "Both support ACID; document design reduces how often you need it.",
    src: [
      ["PostgreSQL: Transactions", `${PG}/tutorial-transactions.html`],
      ["MongoDB: Transactions", `${MO}/core/transactions/`],
    ],
  }),
  g({
    slug: "choosing-sql-or-document-store",
    topic: "SQL vs NoSQL",
    d: "hard",
    title: "How would you decide between PostgreSQL and MongoDB for a new feature?",
    kw: ["relational", "document database", "trade-offs", "data model", "access patterns"],
    intent:
      "Checks that you decide from the data and the access patterns instead of fashion.",
    short:
      "Decide from the shape of the data and how it is used. PostgreSQL enforces structure with types, primary and foreign keys and constraints, supports joins and many-to-many relationships through join tables, and handles flexible parts with json and jsonb columns. MongoDB suits data with varied attributes that is read as whole documents: it stores polymorphic data in one collection, lets you embed related data, evolves without migrations, and can enforce structure later with schema validation. Both support transactions. If your data is highly relational with many cross-entity queries, or needs strong constraints, a relational design is natural; if documents are read whole and vary in shape, a document design fits.",
    detail: [
      "PostgreSQL's jsonb type lets one relational table hold flexible attributes.",
      "MongoDB's references and $lookup can model relationships, but too many $lookup operations are listed as an anti-pattern.",
      "PostgreSQL and MongoDB both document how to enforce or validate structure.",
    ],
    ex: "Billing, with strict relationships and constraints, stays in PostgreSQL, while a content catalogue with varying attributes uses documents.",
    mistakes: [
      "Choosing a database by popularity.",
      "Forcing a highly relational model into documents and relying on many lookups.",
    ],
    follow: ["What are common document-design anti-patterns?"],
    points: [
      "Look at data shape and access patterns",
      "Relational: constraints and joins",
      "Documents: flexible, read whole",
      "Both support transactions",
    ],
    notes: "Match the database to the data and the queries.",
    src: [
      ["MongoDB: Data Modeling", `${MO}/data-modeling/`],
      ["MongoDB: Schema Design Anti-Patterns", `${MO}/data-modeling/design-antipatterns/`],
      ["PostgreSQL: JSON Types", `${PG}/datatype-json.html`],
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
    ],
  }),
  g({
    slug: "mongodb-embed-vs-reference",
    topic: "Document modelling decisions",
    d: "medium",
    title: "When do you embed data and when do you reference it in MongoDB?",
    kw: ["embedding", "referencing", "denormalised", "normalised", "one-to-many"],
    intent:
      "Checks that you can choose between the two core relationship patterns with reasons.",
    short:
      "Embedded documents store related data in a single document, using arrays and sub-documents. They give better read performance, retrieval of related data in a single operation, and a single atomic write for updates. Use embedding for contains relationships, such as a contact with an address, and for one-to-many relationships where children are viewed with the parent. References store links from one document to another and give normalised data. Use them when embedding would duplicate data without enough read benefit, for example when the embedded data changes often, when you have complex many-to-many relationships or large hierarchies, or when you query the related entity on its own.",
    detail: [
      "Documents in MongoDB must be smaller than 16 mebibytes.",
      "Rolling up many small documents into larger ones can improve performance.",
      "You can mix both in the same model.",
    ],
    ex: "An address is embedded in a contact, while the user referenced by many contacts is stored once and linked by id.",
    mistakes: [
      "Embedding data that is updated frequently and duplicated in many places.",
      "Referencing everything and then needing many lookups.",
    ],
    follow: ["What limits embedding?"],
    points: [
      "Embed for contains and parent-viewed children",
      "Reference for changing or shared data",
      "Embedding gives single-read, atomic write",
      "Mind the 16 MiB limit",
    ],
    notes: "Embed what is read and changed together.",
    src: [
      ["MongoDB: Embedded Data", `${MO}/data-modeling/embedding/`],
      ["MongoDB: Reference Data", `${MO}/data-modeling/referencing/`],
    ],
  }),
  g({
    slug: "mongodb-document-size-unbounded-arrays",
    topic: "Document modelling decisions",
    d: "medium",
    title: "What is the document size limit, and why are unbounded arrays an anti-pattern?",
    kw: ["16 MiB", "document size", "unbounded array", "bloated documents", "GridFS"],
    intent:
      "Checks that you design arrays and embedded data to stay bounded.",
    short:
      "The maximum BSON document size in MongoDB is 16 mebibytes. The limit helps ensure that a single document cannot use an excessive amount of RAM or bandwidth, and for larger files MongoDB provides GridFS. The documentation lists an unbounded array as a schema design anti-pattern: a document stores an array that can grow too large, which can exceed the document size limit and reduce index performance. Excessively large, bloated documents can also degrade your most common queries. So when a one-to-many relationship has an unlimited or very large 'many' side, such as comments on a popular post, store the children in their own collection and reference the parent.",
    detail: [
      "BSON documents can also be nested to a limited depth.",
      "The listed anti-patterns also include too many collections, unnecessary indexes and too many $lookup operations.",
      "Bound the array, or move the children out.",
    ],
    ex: "A blog post embeds its latest five comments, and all comments live in a comments collection that references the post.",
    mistakes: [
      "Embedding every comment in the post document forever.",
      "Putting large binary data inside documents instead of GridFS.",
    ],
    follow: ["How can older data be handled?"],
    points: [
      "16 MiB per document",
      "Unbounded arrays can exceed it",
      "Large documents slow common queries",
      "Move unbounded children to a collection",
    ],
    notes: "Embed only bounded data.",
    src: [
      ["MongoDB: Limits and Thresholds", `${MO}/reference/limits/`],
      ["MongoDB: Schema Design Anti-Patterns", `${MO}/data-modeling/design-antipatterns/`],
      ["MongoDB: Embedded Data", `${MO}/data-modeling/embedding/`],
    ],
  }),
  g({
    slug: "mongodb-duplicate-data-tradeoff",
    topic: "Document modelling decisions",
    d: "hard",
    title: "When is it acceptable to duplicate data in a document model?",
    kw: ["duplicate data", "denormalisation", "update frequency", "read performance", "joins"],
    intent:
      "Checks that you can weigh read benefit against update cost.",
    short:
      "When you embed related data you may duplicate data between collections. Duplicating lets your application query information about multiple entities in a single query, while logically separating entities in your model. One concern is increased storage cost, but the MongoDB documentation says the benefits of optimising access patterns generally outweigh it. Before duplicating, consider the read performance benefit, since duplication can remove the need for joins across collections, and how often the duplicated data must be updated. The extra logic for infrequent updates is less costly than lookups on every read, but frequently updating duplicated data can cause heavy workloads and performance problems.",
    detail: [
      "Good candidates are values that rarely change, such as a product name copied into an order.",
      "Poor candidates are values updated often, such as a stock count.",
      "The documentation walks through an e-commerce example of duplicating data.",
    ],
    ex: "Each order item copies the product name and price at the time of purchase.",
    mistakes: [
      "Duplicating frequently changing values and then updating many copies.",
      "Duplicating without a plan for updates.",
    ],
    follow: ["When do you reference instead?"],
    points: [
      "Duplication avoids joins",
      "Storage is rarely the main cost",
      "Update frequency is the key factor",
      "Plan how copies stay in sync",
    ],
    notes: "Duplicate what rarely changes.",
    src: [["MongoDB: Handle Duplicate Data", `${MO}/data-modeling/handle-duplicate-data/`]],
  }),
  g({
    slug: "mongodb-schema-design-process",
    topic: "Document modelling decisions",
    d: "medium",
    title: "What are the steps of the MongoDB schema design process?",
    kw: ["schema design process", "workload", "map relationships", "design patterns", "indexes"],
    intent:
      "Checks that you have a repeatable way to design a document schema.",
    short:
      "The schema design process identifies the data your application needs and organises it to optimise performance. It has four steps. First, identify your workload: the operations your application runs most frequently. Second, map relationships: identify the relationships in your data and decide whether to link or embed related data. Third, apply schema design patterns to optimise reads and writes. Fourth, create indexes to support common query patterns. The documentation advises planning and designing your schema early in development to prevent performance issues as the application grows, and says the flexible model lets you evolve the schema iteratively afterwards.",
    detail: [
      "You may start with a simple schema for basic functionality before optimising.",
      "New fields can be added without rewriting existing documents.",
      "Schema validation can be added once the structure is established.",
    ],
    ex: "For a shop, the team lists the product page and checkout operations, decides what to embed, then adds indexes.",
    mistakes: [
      "Skipping the workload step and guessing which data is read together.",
      "Designing once and never revisiting.",
    ],
    follow: ["Which design patterns exist?"],
    points: [
      "Identify workload",
      "Map relationships",
      "Apply design patterns",
      "Create indexes",
    ],
    notes: "Workload, relationships, patterns, indexes.",
    src: [["MongoDB: Designing Your Schema", `${MO}/data-modeling/schema-design-process/`]],
  }),
  g({
    slug: "mongodb-schema-design-patterns",
    topic: "Document modelling decisions",
    d: "hard",
    title: "Which schema design patterns does MongoDB describe?",
    kw: ["computed values", "archive pattern", "polymorphic data", "schema versioning", "single collection"],
    intent:
      "Checks that you know named solutions to common modelling problems.",
    short:
      "MongoDB groups schema design patterns by the problem they solve. The computed values pattern performs calculations in the database so results are ready when the client asks. The group data pattern groups data into series to improve performance and handle outliers. The polymorphic data pattern handles variable fields and data types in a single collection. Document and schema versioning prepare for schema changes as requirements evolve. The archive pattern moves old data to a separate location, increasing storage and performance where data is accessed most often. The single collection pattern uses references to group related documents of different types into one collection. Apply patterns after you have mapped relationships.",
    detail: [
      "Patterns optimise reads and writes for specific access patterns.",
      "They are applied on top of the embed-or-reference decision.",
      "Pick a pattern only when you have the problem it solves.",
    ],
    ex: "A dashboard stores precomputed daily totals so it does not aggregate every order on each view.",
    mistakes: [
      "Applying patterns before understanding the workload.",
      "Using a pattern without a clear problem.",
    ],
    follow: ["How does the archive pattern help?"],
    points: [
      "Computed values: precompute results",
      "Polymorphic: varied documents in one collection",
      "Versioning: prepare for change",
      "Archive: move old data away",
    ],
    notes: "Patterns solve specific access problems.",
    src: [["MongoDB: Schema Design Patterns", `${MO}/data-modeling/design-patterns/`]],
  }),
  g({
    slug: "mongodb-design-antipatterns",
    topic: "Document modelling decisions",
    d: "hard",
    title: "What are common MongoDB schema design anti-patterns?",
    kw: ["anti-patterns", "$lookup", "too many collections", "unnecessary indexes", "bloated documents"],
    intent:
      "Checks that you can spot inefficient structures before they cause problems.",
    short:
      "Schema design anti-patterns are inefficient ways to structure a schema; they create unnecessary complexity and cause performance issues. The MongoDB documentation lists five. Unbounded arrays, where a document stores an array that can grow too large. Too many collections, which can decrease storage engine performance. Unnecessary indexes, which consume extra disk space and can degrade write performance. Bloated documents, where excessively large documents slow common queries. Too many $lookup operations, which increase query complexity and reduce performance. Recognising them early helps you build applications with better performance, and tools such as Atlas Performance Advisor can flag some of them.",
    detail: [
      "Many $lookup operations are a sign that the data may be modelled too relationally for a document store.",
      "Remove indexes that no query uses.",
      "Review the model whenever access patterns change.",
    ],
    ex: "A team finds a collection with an array that grows with every event and moves the events to their own collection.",
    mistakes: [
      "Treating a document database as a set of relational tables joined with $lookup.",
      "Keeping indexes just in case.",
    ],
    follow: ["How do you keep arrays bounded?"],
    points: [
      "Unbounded arrays",
      "Too many collections",
      "Unnecessary indexes",
      "Bloated documents and too many $lookup",
    ],
    notes: "Five named anti-patterns to avoid.",
    src: [["MongoDB: Schema Design Anti-Patterns", `${MO}/data-modeling/design-antipatterns/`]],
  }),
  g({
    slug: "migrations-version-control-for-schema",
    topic: "Migrations",
    d: "easy",
    title: "What is a database migration and why use them?",
    kw: ["migration", "schema change", "makemigrations", "migrate", "version control"],
    intent:
      "Checks that you treat schema changes as versioned, repeatable code.",
    short:
      "Migrations are Django's way of propagating changes you make to your models, such as adding a field or deleting a model, into your database schema. The documentation says to think of migrations as a version control system for your database schema. makemigrations packages model changes into individual migration files, analogous to commits, and migrate applies those to the database. sqlmigrate shows the SQL of a migration and showmigrations lists their status. Migration files are designed to be committed and distributed as part of your codebase: you make them once on your development machine and run the same migrations on colleagues' machines, staging and production, so the schema changes consistently.",
    detail: [
      "Migrations run the same way on the same dataset and produce consistent results.",
      "Each migration is made of operations.",
      "Migrations are supported on all backends Django ships with.",
    ],
    ex: "A developer adds a field to a model, runs makemigrations, commits the file and CI applies it with migrate.",
    mistakes: [
      "Editing the production schema by hand with no migration file.",
      "Changing an already-applied migration instead of adding a new one.",
    ],
    follow: ["What is a data migration?"],
    points: [
      "Schema changes as versioned files",
      "makemigrations creates, migrate applies",
      "Commit them with the code",
      "Same steps in every environment",
    ],
    notes: "Migrations = version control for the schema.",
    src: [["Django: Migrations", `${DJ}/topics/migrations/`]],
  }),
  g({
    slug: "data-migrations-runpython",
    topic: "Migrations",
    d: "medium",
    title: "What is a data migration, and how does it differ from a schema migration?",
    kw: ["data migration", "RunPython", "schema migration", "empty migration", "backfill"],
    intent:
      "Checks that you separate changing structure from changing data.",
    short:
      "As well as changing the database schema, migrations can change the data itself. Migrations that alter data are usually called data migrations, and the Django documentation says they are best written as separate migrations, sitting alongside your schema migrations. Django cannot generate data migrations automatically as it does schema migrations, but they are not hard to write. The main operation is RunPython: you create an empty migration with makemigrations --empty, then add a function that transforms the data and register it as an operation. Separating the two keeps each migration small, easier to reverse and easier to review.",
    detail: [
      "A migration lists dependencies on earlier migrations.",
      "Data migrations are useful for backfilling a new column from old data.",
      "Data and schema steps can be ordered as separate migrations.",
    ],
    ex: "After adding full_name, a data migration fills it by combining first_name and last_name.",
    mistakes: [
      "Mixing a big data change into a schema migration.",
      "Writing a data migration with no way to reverse it.",
    ],
    follow: ["How do you reverse a migration?"],
    points: [
      "Data migrations change data",
      "Keep them separate from schema migrations",
      "Written with RunPython",
      "Started with makemigrations --empty",
    ],
    notes: "Separate structure changes from data changes.",
    src: [["Django: Migrations", `${DJ}/topics/migrations/`]],
  }),
  g({
    slug: "reversing-migrations-dependencies",
    topic: "Migrations",
    d: "medium",
    title: "How are migrations reversed, and how do dependencies order them?",
    kw: ["reverse migration", "migrate zero", "dependencies", "unapply", "ordering"],
    intent:
      "Checks that you know how to roll back and why order matters.",
    short:
      "Migrations can be reversed with migrate by passing the number of the previous migration; for example, migrate books 0002 reverses books.0003. To reverse all migrations applied for an app, use the name zero. Order matters because migrations depend on each other: when you add a foreign key from one app to another, the resulting migration contains a dependency on a migration in the other app. When migrations run, the other app's migration runs first and creates the table the foreign key references, and then the migration that adds the column and constraint runs. Without that ordering, the database would raise an error.",
    detail: [
      "A data migration needs a reverse function for it to be reversible.",
      "Dependencies are written in each migration's dependencies list.",
      "Restricting a command to one app can still pull in dependencies from other apps.",
    ],
    ex: "migrate books 0002 unapplies the third migration, leaving the first two applied.",
    mistakes: [
      "Assuming every migration can be undone safely.",
      "Ignoring cross-app dependencies and applying changes out of order.",
    ],
    follow: ["How do you add a unique column safely?"],
    points: [
      "migrate app NNNN goes back",
      "zero unapplies everything",
      "Dependencies enforce order",
      "Not all operations reverse cleanly",
    ],
    notes: "Migrations form an ordered, dependent chain.",
    src: [["Django: Migrations", `${DJ}/topics/migrations/`]],
  }),
  g({
    slug: "safe-add-column-large-table",
    topic: "Migrations",
    d: "medium",
    title: "How do you add a column to a large PostgreSQL table safely?",
    kw: ["ALTER TABLE", "ADD COLUMN", "default value", "volatile default", "table rewrite"],
    intent:
      "Checks that you know which schema changes are cheap and which touch every row.",
    short:
      "Use ALTER TABLE ... ADD COLUMN. The new column is initially filled with the default value you give, or null if you give none. With a constant default, PostgreSQL does not update each row when the statement runs: the default is returned when a row is next accessed and applied when the table is rewritten, so it is very fast even on large tables. If the default is volatile, for example clock_timestamp(), each row must be updated at that moment. To avoid a lengthy update, add the column with no default, fill it with UPDATE, then add the default.",
    detail: [
      "You can define constraints on the column in the same ALTER TABLE.",
      "ALTER TABLE also drops columns, changes types, renames columns and tables, and adds or removes constraints.",
      "A DEFAULT can be added afterwards with a separate ALTER TABLE.",
    ],
    ex: "ALTER TABLE products ADD COLUMN description text adds a nullable column without rewriting rows.",
    mistakes: [
      "Adding a column with a volatile default to a huge table during busy hours.",
      "Changing a column type without checking the rewrite cost.",
    ],
    follow: ["How do you add an index without blocking writes?"],
    points: [
      "ADD COLUMN with constant default is fast",
      "Volatile default updates every row",
      "Add, fill, then set default",
      "ALTER TABLE covers many changes",
    ],
    notes: "Constant default: cheap. Volatile default: updates each row.",
    src: [
      ["PostgreSQL: Modifying Tables", `${PG}/ddl-alter.html`],
      ["PostgreSQL: ALTER TABLE", `${PG}/sql-altertable.html`],
    ],
  }),
  g({
    slug: "adding-unique-field-to-existing-table",
    topic: "Migrations",
    d: "hard",
    title: "Why does adding a unique, non-nullable column to a table with data fail, and how do you do it safely?",
    kw: ["unique field", "non-nullable", "existing rows", "multi-step migration", "default"],
    intent:
      "Checks that you plan multi-step migrations for constraints that existing data could violate.",
    short:
      "Applying a plain migration that adds a unique, non-nullable field to a table with existing rows raises an error, because the default used to fill the existing rows is generated only once, which breaks the unique constraint. The Django documentation describes a multi-step approach. First add the field to the model with a default and unique=True and generate the migration. Then split it so that the field is added in a first step without the uniqueness, a separate data migration fills a distinct value for each existing row, and a last step makes the field unique and non-null. Each step is small and can be checked before the next.",
    detail: [
      "The same reasoning applies to any constraint that existing data could violate.",
      "Check for duplicates and nulls before adding the constraint.",
      "In PostgreSQL, adding a primary key creates a unique index and marks the column NOT NULL.",
    ],
    ex: "A new public_id column is added nullable, backfilled with unique values per row, then made unique and not null.",
    mistakes: [
      "Adding a unique column with one constant default for all rows.",
      "Making the change in one step on a large production table.",
    ],
    follow: ["How do you backfill the values?"],
    points: [
      "One default breaks uniqueness",
      "Add, backfill, then constrain",
      "Several small migrations",
      "Check existing data first",
    ],
    notes: "Add loose, backfill, then tighten.",
    src: [
      ["Django: Writing database migrations", `${DJ}/howto/writing-migrations/`],
      ["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`],
    ],
  }),
  g({
    slug: "index-migrations-concurrently",
    topic: "Migrations",
    d: "hard",
    title: "How do you add an index in a migration without blocking writes on PostgreSQL?",
    kw: ["CREATE INDEX CONCURRENTLY", "index migration", "locks", "production", "writes"],
    intent:
      "Checks that you know the locking effect of index creation in a live system.",
    short:
      "A standard CREATE INDEX locks out writes, but not reads, on the table until it finishes. With the CONCURRENTLY option, PostgreSQL builds the index without taking any locks that prevent concurrent inserts, updates or deletes, which makes it suitable for adding an index to a busy table. The documentation points to caveats in its 'Building Indexes Concurrently' section, so read them first. In a migration this means choosing the concurrent form for large production tables.",
    detail: [
      "Django's index classes and migration operations create the index definition from the model.",
      "UNIQUE, INCLUDE and a WHERE predicate are other CREATE INDEX options.",
      "Index operations are available in Django migrations.",
    ],
    ex: "A migration adds an index on orders (customer_id) with the concurrent option during normal traffic.",
    mistakes: [
      "Running a plain CREATE INDEX on a large live table.",
      "Skipping the documentation's caveats for concurrent builds.",
    ],
    follow: ["What does the concurrent build trade off?"],
    points: [
      "Plain build blocks writes",
      "CONCURRENTLY does not",
      "Read the caveats",
      "Use it for large live tables",
    ],
    notes: "Large live table: use CREATE INDEX CONCURRENTLY.",
    src: [
      ["PostgreSQL: CREATE INDEX", `${PG}/sql-createindex.html`],
      ["Django: Index reference", `${DJ}/ref/models/indexes/`],
    ],
  }),
  g({
    slug: "document-schema-evolution-no-migration",
    topic: "Migrations",
    d: "medium",
    title: "How does schema evolution differ in MongoDB compared with relational migrations?",
    kw: ["schema evolution", "document versioning", "flexible schema", "no migration", "schema validation"],
    intent:
      "Checks that you know changing a document schema is easier but still needs planning.",
    short:
      "MongoDB's flexible data model lets you evolve your data model as your application changes: you can add new fields and new content types without rewriting existing documents or running a schema migration. Documents in one collection can have different fields. The documentation lists document and schema versioning as a design pattern that prepares for schema changes as technical requirements change. Once the structure is established, schema validation can enforce rules to prevent unintended schema changes and data type errors. In a relational database such as PostgreSQL, a structural change goes through ALTER TABLE, usually inside a versioned migration, and existing rows are changed according to the new definition.",
    detail: [
      "Application code must handle documents written under earlier versions of the schema.",
      "Validation rules apply to inserts and updates after they are added.",
      "Plan changes even though the database does not force you to.",
    ],
    ex: "A new optional field is added to new documents only, and the code treats a missing field as a default.",
    mistakes: [
      "Assuming a flexible schema means no need to plan changes.",
      "Writing code that breaks on older documents.",
    ],
    follow: ["What does schema validation prevent?"],
    points: [
      "Add fields without a migration",
      "Versioning pattern for schema change",
      "Validation locks in structure",
      "Relational changes use ALTER TABLE",
    ],
    notes: "Flexible schema shifts migration work into the application.",
    src: [
      ["MongoDB: Data Modeling", `${MO}/data-modeling/`],
      ["MongoDB: Schema Design Patterns", `${MO}/data-modeling/design-patterns/`],
      ["MongoDB: Schema Validation", `${MO}/core/schema-validation/`],
      ["PostgreSQL: Modifying Tables", `${PG}/ddl-alter.html`],
    ],
  }),
])
