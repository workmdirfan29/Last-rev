import { defineQuestions } from "../author"
import { g } from "../brief"

const PG = "https://www.postgresql.org/docs/current"

export default defineQuestions("postgresql", "fresher", [
  g({
    slug: "integer-types-and-numeric",
    topic: "Data types",
    d: "easy",
    title: "Which numeric types does PostgreSQL offer, and when do you use integer, bigint or numeric?",
    kw: ["smallint", "integer", "bigint", "numeric", "decimal"],
    intent:
      "Checks that you pick a numeric type for range and exactness, not by habit.",
    short:
      "PostgreSQL has smallint (2 bytes), integer (4 bytes) and bigint (8 bytes) for whole numbers, and attempts to store a value outside the allowed range raise an error. The documentation calls integer the common choice, as it offers the best balance between range, storage size and performance. numeric, also called decimal, stores user-specified precision exactly, up to 131072 digits before the decimal point and 16383 after it. real and double precision are variable-precision and inexact. Use bigint when values may exceed about 2.1 billion, and numeric for money-like values where exact decimals matter.",
    detail: [
      "smallint ranges from -32768 to +32767 and integer from -2147483648 to +2147483647.",
      "numeric(precision, scale) lets you fix the number of digits.",
      "The serial types are autoincrementing integers built on top of these.",
    ],
    ex: "A prices column is numeric(10, 2), while an order counter that will grow for years is bigint.",
    mistakes: [
      "Using integer for an id that may exceed its range.",
      "Storing money in real or double precision.",
    ],
    follow: ["Why are floating-point types inexact?"],
    points: [
      "smallint, integer, bigint by range",
      "integer is the usual choice",
      "numeric is exact",
      "Out-of-range values raise errors",
    ],
    notes: "integer by default, bigint for large ranges, numeric for exact decimals.",
    src: [["PostgreSQL: Numeric Types", `${PG}/datatype-numeric.html`]],
  }),
  g({
    slug: "numeric-vs-floating-point",
    topic: "Data types",
    d: "medium",
    title: "What is the difference between numeric and floating-point types in PostgreSQL?",
    kw: ["numeric", "real", "double precision", "inexact", "NaN"],
    intent:
      "Checks that you know why exactness matters for some values.",
    short:
      "numeric stores values with user-specified precision and the documentation describes it as exact. real, with 4 bytes and about 6 decimal digits of precision, and double precision, with 8 bytes and about 15 digits, are variable-precision and inexact: some values cannot be represented exactly and are stored as approximations. Floating-point types also support special values such as Infinity and NaN; PostgreSQL treats NaN values as equal, and greater than all non-NaN values, so they can be sorted and used in tree-based indexes. PostgreSQL also accepts float(p), mapping float(1) to float(24) to real and float(25) to float(53) to double precision.",
    detail: [
      "The documentation's table lists range and precision for each type.",
      "A float with no precision specified is taken to mean double precision.",
      "Use numeric for amounts that must add up exactly.",
    ],
    ex: "Invoice totals use numeric so the sum of line items is exact, while sensor readings use double precision.",
    mistakes: [
      "Comparing floating-point results for exact equality.",
      "Assuming NaN behaves like in other systems when sorting.",
    ],
    follow: ["How are autoincrementing ids created?"],
    points: [
      "numeric: user-specified precision, exact",
      "real and double precision: inexact",
      "NaN sorts after other values",
      "float(p) maps to real or double precision",
    ],
    notes: "Exact decimals: numeric. Approximate measurements: double precision.",
    src: [["PostgreSQL: Numeric Types", `${PG}/datatype-numeric.html`]],
  }),
  g({
    slug: "serial-vs-identity-columns",
    topic: "Data types",
    d: "medium",
    title: "What are serial types, and how do they relate to identity columns?",
    kw: ["serial", "bigserial", "identity column", "sequence", "autoincrement"],
    intent:
      "Checks that you know how auto-generated keys work and a transaction gotcha.",
    short:
      "smallserial, serial and bigserial are PostgreSQL-specific ways to create an autoincrementing column; serial is a 4-byte integer from 1 to 2147483647 and bigserial an 8-byte integer. The documentation notes that another way is the SQL-standard identity column feature. Behind the scenes a sequence generates the values. Changes made to a sequence, and therefore the counter of a serial column, are immediately visible to all other transactions and are not rolled back if the transaction that made them aborts. This means that rolled-back inserts can leave gaps in the numbers, so do not rely on ids being consecutive.",
    detail: [
      "Pick bigserial or a bigint identity column when the table may grow very large.",
      "Gaps are normal and harmless for surrogate keys.",
      "Generated columns are a different feature, computed from other columns.",
    ],
    ex: "An orders table uses a bigint identity column as its primary key and shows ids with gaps after failed inserts.",
    mistakes: [
      "Using serial's integer range for a table that will pass two billion rows.",
      "Treating ids as a gap-free counter, for example for invoice numbers.",
    ],
    follow: ["Why does a rollback not reset the sequence?"],
    points: [
      "serial = autoincrementing integer",
      "Identity is the SQL-standard way",
      "Sequences ignore rollbacks",
      "Gaps are expected",
    ],
    notes: "Sequence values are never handed back.",
    src: [
      ["PostgreSQL: Numeric Types", `${PG}/datatype-numeric.html`],
      ["PostgreSQL: Transaction Isolation", `${PG}/transaction-iso.html`],
    ],
  }),
  g({
    slug: "text-vs-varchar-char",
    topic: "Data types",
    d: "easy",
    title: "What is the difference between text, varchar(n) and char(n) in PostgreSQL?",
    kw: ["text", "varchar", "char", "character varying", "blank-padded"],
    intent:
      "Checks that you do not carry over performance myths from other databases.",
    short:
      "character varying(n), or varchar(n), is variable-length with a limit, character(n), or char(n), is fixed-length and blank-padded, and text is variable unlimited length. Storing a string longer than n characters into varchar(n) or char(n) raises an error, unless the excess characters are all spaces. The documentation's tip says there is no performance difference among these three types, apart from increased storage space for the blank-padded type and a few extra CPU cycles to check the length in a constrained column. It adds that character(n) has performance advantages in some other systems, but not in PostgreSQL, where it is usually the slowest.",
    detail: [
      "n counts characters, not bytes.",
      "If you want no upper limit, use text or varchar without a length.",
      "Use a length limit only when it is a real business rule.",
    ],
    ex: "A comments column is text, while a country code that must be two characters is checked with a constraint.",
    mistakes: [
      "Choosing char(n) in the belief that it is faster.",
      "Inventing an arbitrary length limit that later truncates real data.",
    ],
    follow: ["How would you enforce a format on a text column?"],
    points: [
      "varchar(n) limits length",
      "char(n) pads with blanks",
      "text has no limit",
      "No performance advantage for char(n)",
    ],
    notes: "Prefer text or varchar; avoid char(n).",
    src: [["PostgreSQL: Character Types", `${PG}/datatype-character.html`]],
  }),
  g({
    slug: "timestamp-vs-timestamptz",
    topic: "Data types",
    d: "medium",
    title: "What is the difference between timestamp and timestamptz in PostgreSQL?",
    kw: ["timestamp", "timestamptz", "time zone", "UTC", "date/time"],
    intent:
      "Checks that you store points in time without time-zone surprises.",
    short:
      "timestamp, short for timestamp without time zone, stores a date and time as written, and PostgreSQL silently ignores any time zone in the input. timestamp with time zone, abbreviated timestamptz, converts an input with an explicit zone to UTC; if no zone is stated, the input is assumed to be in the session's TimeZone setting. The value is stored internally as UTC and the original zone is not retained. On output it is always converted from UTC to the current TimeZone and displayed as local time. Both take 8 bytes and have 1 microsecond resolution. Use timestamptz for moments in time such as event times.",
    detail: [
      "The SQL standard says that writing just timestamp means timestamp without time zone, and PostgreSQL honours this.",
      "AT TIME ZONE converts between zones in a query.",
      "The documentation calls time with time zone of questionable usefulness.",
    ],
    ex: "Order creation times are timestamptz, so a user in another zone sees the same moment in their local time.",
    mistakes: [
      "Using plain timestamp for events and losing the zone information.",
      "Expecting timestamptz to remember the original zone.",
    ],
    follow: ["How do you show the time in another zone?"],
    points: [
      "timestamptz stored as UTC",
      "Output converts to current TimeZone",
      "timestamp ignores zone input",
      "Use timestamptz for instants",
    ],
    notes: "timestamptz for moments; timestamp for local wall-clock values.",
    src: [["PostgreSQL: Date/Time Types", `${PG}/datatype-datetime.html`]],
  }),
  g({
    slug: "json-vs-jsonb",
    topic: "Data types",
    d: "medium",
    title: "What is the difference between json and jsonb, and which should you use?",
    kw: ["json", "jsonb", "binary format", "indexing", "document"],
    intent:
      "Checks that you know the trade-off between preserving input and processing speed.",
    short:
      "Both types store JSON data and enforce that each stored value is valid JSON, which storing it as text would not. The json type stores an exact copy of the input text, which processing functions must reparse on each execution; it preserves white space, key order and duplicate keys. jsonb stores a decomposed binary format that is slightly slower to input because of the conversion, but significantly faster to process, and it supports indexing. jsonb does not preserve white space or key order and keeps only the last value of a duplicate key. The documentation says most applications should prefer jsonb.",
    detail: [
      "jsonb has containment and existence operators and can be indexed, for example with GIN.",
      "jsonpath is a type for efficient JSON query expressions.",
      "The documentation has a section on designing JSON documents.",
    ],
    ex: "A table keeps flexible product attributes in a jsonb column with a GIN index for containment queries.",
    mistakes: [
      "Choosing json only because it keeps the text exactly, then querying it heavily.",
      "Putting data that should be relational into one JSON column.",
    ],
    follow: ["What index type suits jsonb?"],
    points: [
      "Both validate JSON",
      "json keeps the exact text",
      "jsonb is binary and indexable",
      "Prefer jsonb for most uses",
    ],
    notes: "jsonb unless you must preserve the exact input text.",
    src: [["PostgreSQL: JSON Types", `${PG}/datatype-json.html`]],
  }),
  g({
    slug: "arrays-and-enums",
    topic: "Data types",
    d: "medium",
    title: "What are PostgreSQL arrays and enumerated types, and when are they appropriate?",
    kw: ["array", "enum", "integer[]", "composite", "type safety"],
    intent:
      "Checks that you know two PostgreSQL-specific type features and their trade-offs.",
    short:
      "PostgreSQL lets a table column be defined as a variable-length multidimensional array. Arrays of any built-in or user-defined base type, enum type, composite type, range type or domain can be created, and the type is named by appending square brackets, such as integer[]. Enumerated types are data types made of a static, ordered set of values, which you create with CREATE TYPE; their order is the order in which the values were listed, and the documentation has sections on ordering and type safety. Arrays suit small lists belonging to one row, and enums a short fixed set of states.",
    detail: [
      "Arrays can be searched with array operators and indexed with GIN.",
      "The enum documentation has sections on ordering, type safety and implementation details.",
      "Arrays are searched with array operators; a GIN index supports them.",
    ],
    ex: "A post table has tags text[], while order status is an enum of pending, paid and shipped.",
    mistakes: [
      "Storing relationships between entities as arrays of ids instead of using foreign keys.",
      "Ignoring that an enum defines a static set of values.",
    ],
    follow: ["Which index type supports array search?"],
    points: [
      "Arrays append [] to a type",
      "Enums are ordered sets of values",
      "Good for small, stable cases",
      "Relationships need foreign keys",
    ],
    notes: "Arrays for small lists, enums for stable sets, tables for the rest.",
    src: [
      ["PostgreSQL: Arrays", `${PG}/arrays.html`],
      ["PostgreSQL: Enumerated Types", `${PG}/datatype-enum.html`],
    ],
  }),
  g({
    slug: "why-indexes-help",
    topic: "PostgreSQL indexes",
    d: "easy",
    title: "What is an index and why does it speed up queries?",
    kw: ["index", "CREATE INDEX", "sequential scan", "search tree", "write cost"],
    intent:
      "Checks that you understand what an index does and that it has a cost.",
    short:
      "Without an index, a query such as SELECT content FROM test1 WHERE id = constant would have to scan the entire table row by row. If the system maintains an index on the id column, it can use a more efficient method, such as walking a few levels deep into a search tree. The documentation compares it to a book's alphabetic index. You create one with CREATE INDEX and remove it with DROP INDEX, and the system keeps it up to date automatically.",
    detail: [
      "Indexes can be added to and removed from tables at any time.",
      "Index maintenance adds work to inserts, updates and deletes.",
      "The planner decides whether to use an index for a given query.",
    ],
    ex: "CREATE INDEX orders_customer_id_idx ON orders (customer_id) speeds up looking up a customer's orders.",
    mistakes: [
      "Indexing every column without looking at the queries.",
      "Assuming a query will always use an index that exists.",
    ],
    follow: ["Which index types does PostgreSQL support?"],
    points: [
      "Avoids scanning the whole table",
      "CREATE INDEX and DROP INDEX",
      "Maintained automatically",
      "Foresee useful indexes",
    ],
    notes: "Index the columns your queries filter and join on.",
    src: [["PostgreSQL: Indexes introduction", `${PG}/indexes-intro.html`]],
  }),
  g({
    slug: "index-types-overview",
    topic: "PostgreSQL indexes",
    d: "medium",
    title: "Which index types does PostgreSQL provide, and what is each good for?",
    kw: ["B-tree", "hash", "GiST", "GIN", "BRIN"],
    intent:
      "Checks that you can match an index type to the kind of query.",
    short:
      "PostgreSQL provides B-tree, Hash, GiST, SP-GiST, GIN and BRIN indexes, plus the bloom extension, each using a different algorithm. CREATE INDEX makes B-tree indexes by default, which fit the most common situations: they handle equality and range queries on sortable data, and can return data in sorted order. Hash indexes handle only simple equality comparisons. GiST is an infrastructure for many strategies, for example geometric data and nearest-neighbour searches. GIN is an inverted index suited to values containing multiple components, such as arrays. BRIN stores summaries of consecutive block ranges and works best for columns well-correlated with the physical order of the table.",
    detail: [
      "You select a non-default type with USING, as in CREATE INDEX name ON table USING HASH (column).",
      "Each type supports particular operators through operator classes.",
      "Start with B-tree unless a query needs something else.",
    ],
    ex: "A B-tree serves created_at ranges, a GIN index serves tag-array searches, and BRIN suits a huge append-only log ordered by time.",
    mistakes: [
      "Using a hash index and expecting it to help range queries.",
      "Assuming every index type can be unique.",
    ],
    follow: ["What operators can a B-tree use?"],
    points: [
      "B-tree is the default",
      "Hash: equality only",
      "GIN: multi-valued data",
      "BRIN: block range summaries",
    ],
    notes: "B-tree first; others for specific data shapes.",
    src: [["PostgreSQL: Index Types", `${PG}/indexes-types.html`]],
  }),
  g({
    slug: "btree-operators-and-like",
    topic: "PostgreSQL indexes",
    d: "medium",
    title: "Which queries can a B-tree index support, including LIKE patterns?",
    kw: ["B-tree", "range query", "LIKE", "anchored pattern", "IS NULL"],
    intent:
      "Checks that you know when an index is usable for a given predicate.",
    short:
      "The planner will consider a B-tree index whenever an indexed column is compared with <, <=, =, >= or >. Constructs equivalent to combinations of these, such as BETWEEN and IN, can also use a B-tree search, and so can IS NULL and IS NOT NULL on an indexed column. For pattern matching, the optimizer can use a B-tree for LIKE and ~ only if the pattern is a constant anchored at the beginning of the string, for example col LIKE 'foo%', and not col LIKE '%bar'. Outside the C locale, pattern matching needs a special operator class.",
    detail: [
      "Case-insensitive ILIKE can use a B-tree only if the pattern starts with non-alphabetic characters.",
      "An expression index on lower(col) supports case-insensitive equality.",
      "Leading wildcards need a different approach, such as a text search index.",
    ],
    ex: "WHERE name LIKE 'Pat%' can use a B-tree index on name, while WHERE name LIKE '%son' cannot.",
    mistakes: [
      "Expecting an index to help a leading-wildcard LIKE.",
      "Forgetting the operator class for pattern matching in a non-C locale.",
    ],
    follow: ["How do you index a lowercase comparison?"],
    points: [
      "Supports <, <=, =, >=, >",
      "BETWEEN and IN too",
      "LIKE only with an anchored prefix",
      "Can serve ORDER BY",
    ],
    notes: "Anchored prefix patterns use a B-tree; leading wildcards do not.",
    src: [["PostgreSQL: Index Types", `${PG}/indexes-types.html`]],
  }),
  g({
    slug: "multicolumn-index-leftmost",
    topic: "PostgreSQL indexes",
    d: "medium",
    title: "How does a multicolumn index work, and why does column order matter?",
    kw: ["multicolumn index", "leading column", "composite index", "B-tree", "column order"],
    intent:
      "Checks that you can design a composite index for the queries you have.",
    short:
      "An index can be defined on more than one column, for example CREATE INDEX test2_mm_idx ON test2 (major, minor), which suits queries that filter on both. Currently only B-tree, GiST, GIN and BRIN indexes support multiple key columns, and an index can have up to 32 columns, including INCLUDE columns. A multicolumn B-tree can be used with conditions on any subset of its columns, but it is most efficient when there are constraints on the leading, leftmost columns: equality on leading columns plus any inequality on the first column without an equality limit the portion of the index scanned.",
    detail: [
      "Constraints on later columns are still checked inside the index, saving visits to the table.",
      "Newer versions can apply a skip scan optimisation in some cases.",
      "INCLUDE columns count toward the 32-column limit.",
    ],
    ex: "An index on (customer_id, created_at) serves 'orders of customer X in a date range' and also 'orders of customer X'.",
    mistakes: [
      "Creating an index on (b, a) when queries always filter on a first.",
      "Creating many overlapping indexes without checking they are used.",
    ],
    follow: ["What is a covering index?"],
    points: [
      "Several key columns",
      "Leftmost columns matter most",
      "B-tree, GiST, GIN, BRIN support it",
      "Up to 32 columns",
    ],
    notes: "Order columns by how the queries use them, leftmost first.",
    src: [["PostgreSQL: Multicolumn Indexes", `${PG}/indexes-multicolumn.html`]],
  }),
  g({
    slug: "unique-indexes-and-constraints",
    topic: "PostgreSQL indexes",
    d: "easy",
    title: "How do unique indexes relate to unique constraints and primary keys?",
    kw: ["unique index", "unique constraint", "primary key", "NULLS NOT DISTINCT", "B-tree"],
    intent:
      "Checks that you know how uniqueness is enforced and how nulls behave.",
    short:
      "Indexes can enforce uniqueness of a column's value, or the combined values of several columns, with CREATE UNIQUE INDEX. Currently only B-tree indexes can be declared unique. When an index is unique, multiple table rows with equal indexed values are not allowed. By default null values in a unique column are not considered equal, so multiple nulls are allowed; the NULLS NOT DISTINCT option makes nulls count as equal. A multicolumn unique index only rejects cases where all indexed columns are equal in multiple rows. PostgreSQL automatically creates a unique index when a unique constraint or primary key is defined for a table.",
    detail: [
      "Unique indexes on expressions can enforce rules that simple unique constraints cannot.",
      "ON CONFLICT upserts depend on a unique index or constraint.",
      "NULLS NOT DISTINCT can be set on a unique index.",
    ],
    ex: "A unique index on lower(email) prevents two accounts whose emails differ only in case.",
    mistakes: [
      "Expecting a unique column to reject multiple nulls.",
      "Creating a separate index on a column that already has a primary key.",
    ],
    follow: ["How do you index an expression?"],
    points: [
      "Only B-tree can be unique",
      "Nulls are distinct by default",
      "Constraints create indexes",
      "Multicolumn uniqueness needs all columns equal",
    ],
    notes: "A unique constraint is backed by a unique index.",
    src: [["PostgreSQL: Unique Indexes", `${PG}/indexes-unique.html`]],
  }),
  g({
    slug: "partial-and-expression-indexes",
    topic: "PostgreSQL indexes",
    d: "hard",
    title: "What are partial indexes and expression indexes?",
    kw: ["partial index", "expression index", "predicate", "lower()", "index size"],
    intent:
      "Checks that you can make an index smaller or match a computed condition.",
    short:
      "A partial index is built over a subset of a table, defined by a predicate, and contains entries only for rows that satisfy it. A major use is avoiding indexing common values, since a query for a value that is more than a few percent of the rows will not use the index anyway; this shrinks the index and speeds up many updates. An expression index is built on a function or scalar expression, for example CREATE INDEX ON test1 (lower(col1)), so WHERE lower(col1) = 'value' can use it. Declared UNIQUE, it can enforce case-insensitive uniqueness.",
    detail: [
      "Functions used in index expressions must be immutable.",
      "The query's WHERE clause must imply the partial index predicate for the planner to use it.",
      "Functions used in an index expression must be marked immutable.",
    ],
    ex: "CREATE INDEX ON orders (customer_id) WHERE status = 'open' indexes only the small set of open orders.",
    mistakes: [
      "Writing a query that does not match the index expression, so the index is ignored.",
      "Creating a partial index whose predicate hides rows the queries need.",
    ],
    follow: ["How do you check whether an index is used?"],
    points: [
      "Partial: index only rows matching a predicate",
      "Smaller and faster to maintain",
      "Expression: index a computed value",
      "Query must match the definition",
    ],
    notes: "Index just the rows or expressions your queries use.",
    src: [
      ["PostgreSQL: Partial Indexes", `${PG}/indexes-partial.html`],
      ["PostgreSQL: Indexes on Expressions", `${PG}/indexes-expressional.html`],
      ["PostgreSQL: CREATE INDEX", `${PG}/sql-createindex.html`],
    ],
  }),
  g({
    slug: "index-only-scans-covering-indexes",
    topic: "PostgreSQL indexes",
    d: "hard",
    title: "What are index-only scans and covering indexes?",
    kw: ["index-only scan", "covering index", "INCLUDE", "heap", "visibility map"],
    intent:
      "Checks that you understand why an index may avoid reading the table.",
    short:
      "All PostgreSQL indexes are secondary indexes, stored separately from the table's heap, so an ordinary index scan fetches data from both the index and the heap, and heap access can involve a lot of slow random reads. An index-only scan answers a query from the index alone, returning values directly from each index entry without consulting the heap. The index type must support it, and B-tree indexes always do. A covering index adds extra columns with INCLUDE, as non-key columns: they cannot be used in search conditions or uniqueness checks, but can be returned by an index-only scan.",
    detail: [
      "VACUUM updates the visibility map, which speeds up index-only scans.",
      "The index must contain all columns the query reads.",
      "A non-key column is disregarded for uniqueness checks.",
    ],
    ex: "An index on (customer_id) INCLUDE (total) answers 'totals for a customer' without touching the table.",
    mistakes: [
      "Including many wide columns and bloating the index.",
      "Expecting an index-only scan on a table that is rarely vacuumed.",
    ],
    follow: ["Why does VACUUM matter here?"],
    points: [
      "Answer from the index without the heap",
      "B-tree always supports it",
      "INCLUDE adds non-key columns",
      "Visibility map helps",
    ],
    notes: "Index-only scans skip the table heap.",
    src: [
      ["PostgreSQL: Index-Only Scans and Covering Indexes", `${PG}/indexes-index-only-scans.html`],
      ["PostgreSQL: CREATE INDEX", `${PG}/sql-createindex.html`],
      ["PostgreSQL: Routine Vacuuming", `${PG}/routine-vacuuming.html`],
    ],
  }),
  g({
    slug: "create-index-concurrently",
    topic: "PostgreSQL indexes",
    d: "medium",
    title: "What does CREATE INDEX CONCURRENTLY do, and why use it on a live table?",
    kw: ["CREATE INDEX CONCURRENTLY", "locks", "production", "writes", "index build"],
    intent:
      "Checks that you can add an index without stopping writes.",
    short:
      "A standard CREATE INDEX locks out writes, but not reads, on the table until it is done. With the CONCURRENTLY option, PostgreSQL builds the index without taking any locks that prevent concurrent inserts, updates or deletes on the table. This makes it suitable for adding an index to a busy production table. The documentation notes there are several caveats to be aware of when using the option, in its 'Building Indexes Concurrently' section, so read it before relying on it. For temporary tables, CREATE INDEX is always non-concurrent, because no other session can access them.",
    detail: [
      "Other options include UNIQUE, USING method, INCLUDE and a WHERE predicate for partial indexes.",
      "IF NOT EXISTS avoids an error when an index with the name already exists.",
      "A standard build locks out writes but not reads until it finishes.",
    ],
    ex: "A team adds an index to a busy orders table with CREATE INDEX CONCURRENTLY during working hours.",
    mistakes: [
      "Running a plain CREATE INDEX on a large live table and blocking writes.",
      "Skipping the documentation's caveats for concurrent builds.",
    ],
    follow: ["Which other index options exist?"],
    points: [
      "Normal build blocks writes",
      "CONCURRENTLY allows writes",
      "Has documented caveats",
      "Not applicable to temporary tables",
    ],
    notes: "CREATE INDEX CONCURRENTLY for live tables.",
    src: [["PostgreSQL: CREATE INDEX", `${PG}/sql-createindex.html`]],
  }),
  g({
    slug: "explain-query-plan",
    topic: "Query planner",
    d: "easy",
    title: "What does EXPLAIN show?",
    kw: ["EXPLAIN", "query plan", "plan node", "cost", "seq scan"],
    intent:
      "Checks that you can read the basic output used to tune queries.",
    short:
      "PostgreSQL devises a query plan for each query, and EXPLAIN displays the plan that the planner generates for a statement. The structure of a plan is a tree of plan nodes. Nodes at the bottom are scan nodes that return raw rows from a table, such as sequential scans, index scans and bitmap index scans, and nodes above them perform joins, aggregation or sorting. The output has one line per node, showing the node type and the planner's cost estimates. The first line has the estimated total cost for the whole plan, and this is the number the planner seeks to minimise. EXPLAIN alone does not run the query.",
    detail: [
      "The numbers in parentheses are estimated start-up cost, total cost, number of rows and average row width.",
      "Choosing the right plan is critical for performance.",
      "Options such as FORMAT JSON change the output format.",
    ],
    ex: "EXPLAIN SELECT * FROM tenk1 shows a Seq Scan node with its cost and row estimates.",
    mistakes: [
      "Treating cost numbers as milliseconds.",
      "Reading the plan from the top only and ignoring the scan nodes at the bottom.",
    ],
    follow: ["What does EXPLAIN ANALYZE add?"],
    points: [
      "Shows the chosen plan",
      "Tree of plan nodes",
      "Cost estimates per node",
      "Does not execute the query",
    ],
    notes: "EXPLAIN shows estimates; the planner minimises the top cost.",
    src: [
      ["PostgreSQL: Using EXPLAIN", `${PG}/using-explain.html`],
      ["PostgreSQL: EXPLAIN", `${PG}/sql-explain.html`],
    ],
  }),
  g({
    slug: "explain-analyze-actual-times",
    topic: "Query planner",
    d: "medium",
    title: "What does EXPLAIN ANALYZE add, and what is the risk?",
    kw: ["EXPLAIN ANALYZE", "actual time", "rows", "buffers", "execution"],
    intent:
      "Checks that you can compare estimates with reality and know the command runs the query.",
    short:
      "The ANALYZE option checks the accuracy of the planner's estimates. With it, EXPLAIN actually executes the query and then displays the true row counts and the true run time accumulated within each plan node, along with the estimates a plain EXPLAIN shows. You compare estimated and actual rows: a big difference suggests poor statistics. The BUFFERS option adds information about buffer usage, such as shared hits and reads. Because it runs the statement, EXPLAIN ANALYZE on an UPDATE, DELETE or INSERT really changes data, so wrap it in a transaction and roll back, or run it on a copy.",
    detail: [
      "The documentation has a section of caveats about how to interpret the timings.",
      "loops shows how many times a node ran, so multiply per-loop times accordingly.",
      "A different row estimate than reality is the first thing to look for.",
    ],
    ex: "EXPLAIN (ANALYZE, BUFFERS) SELECT ... shows each node's actual time and buffer usage.",
    mistakes: [
      "Running EXPLAIN ANALYZE on a data-changing statement outside a transaction.",
      "Ignoring the loops count when reading per-node time.",
    ],
    follow: ["How are planner statistics updated?"],
    points: [
      "Executes the statement",
      "Shows actual rows and time",
      "Compare to estimates",
      "BUFFERS shows I/O",
    ],
    notes: "EXPLAIN ANALYZE runs it; wrap writes in a rollback.",
    src: [
      ["PostgreSQL: Using EXPLAIN", `${PG}/using-explain.html`],
      ["PostgreSQL: EXPLAIN", `${PG}/sql-explain.html`],
    ],
  }),
  g({
    slug: "planner-statistics-analyze",
    topic: "Query planner",
    d: "medium",
    title: "How does the planner know how many rows a query returns, and what is ANALYZE?",
    kw: ["ANALYZE", "statistics", "pg_statistic", "reltuples", "row estimates"],
    intent:
      "Checks that you know plans depend on statistics and how they are refreshed.",
    short:
      "The planner estimates costs using statistics about the contents of tables. ANALYZE collects these statistics about table contents and stores the results in the pg_statistic system catalog; the query planner then uses them to determine the most efficient execution plans. The table-level counts reltuples and relpages are not updated on the fly, so they usually hold somewhat out-of-date values; they are updated by VACUUM, ANALYZE and a few DDL commands such as CREATE INDEX. After a large load or change, running ANALYZE on the table gives the planner fresh numbers, and VACUUM ANALYZE does a vacuum then an analyze.",
    detail: [
      "Without a table list, ANALYZE processes every table and materialized view you may analyze.",
      "Autovacuum can run ANALYZE automatically in the background.",
      "Bad row estimates are a common cause of poor plans.",
    ],
    ex: "After loading millions of rows, a team runs ANALYZE orders so plans use the new row counts.",
    mistakes: [
      "Tuning queries before checking that statistics are current.",
      "Assuming the planner always knows the exact row count.",
    ],
    follow: ["What does VACUUM do?"],
    points: [
      "Planner relies on statistics",
      "ANALYZE fills pg_statistic",
      "Counts can be out of date",
      "Run after big changes",
    ],
    notes: "Stale statistics lead to bad plans; ANALYZE refreshes them.",
    src: [
      ["PostgreSQL: ANALYZE", `${PG}/sql-analyze.html`],
      ["PostgreSQL: Statistics Used by the Planner", `${PG}/planner-stats.html`],
    ],
  }),
  g({
    slug: "scan-types-seq-index-bitmap",
    topic: "Query planner",
    d: "medium",
    title: "What are sequential, index and bitmap scans, and why might the planner skip an index?",
    kw: ["seq scan", "index scan", "bitmap scan", "planner", "selectivity"],
    intent:
      "Checks that you understand that using an index is a planner decision, not a rule.",
    short:
      "A sequential scan reads the whole table. An index scan uses an index to find matching rows and then fetches them from the table heap. A bitmap index scan builds a bitmap of matching rows from the index and then visits the heap in sorted order, which reduces random access when many rows match. EXPLAIN output shows which scan node the planner picked. The planner chooses the plan with the lowest estimated cost, so it may legitimately skip an index: the documentation notes that a query searching for a common value, one that accounts for more than a few percent of the rows, will not use an index anyway.",
    detail: [
      "Bitmap scans do the heap accesses in sorted order to reduce random access.",
      "Statistics and cost estimates affect the choice.",
      "Index-only scans avoid the heap when the index has all needed columns.",
    ],
    ex: "WHERE status = 'paid' on a table where most orders are paid uses a sequential scan, even if status is indexed.",
    mistakes: [
      "Forcing the use of an index without checking the plan.",
      "Assuming a seq scan always means a missing index.",
    ],
    follow: ["How do join strategies differ?"],
    points: [
      "Seq scan reads everything",
      "Index scan follows an index",
      "Bitmap scan batches heap access",
      "Planner picks the lowest cost",
    ],
    notes: "Lowest estimated cost wins, not 'always use an index'.",
    src: [
      ["PostgreSQL: Using EXPLAIN", `${PG}/using-explain.html`],
      ["PostgreSQL: Partial Indexes", `${PG}/indexes-partial.html`],
      ["PostgreSQL: Index-Only Scans and Covering Indexes", `${PG}/indexes-index-only-scans.html`],
    ],
  }),
  g({
    slug: "join-strategies",
    topic: "Query planner",
    d: "hard",
    title: "What are the nested loop, merge and hash join strategies?",
    kw: ["nested loop join", "merge join", "hash join", "join strategy", "planner"],
    intent:
      "Checks that you know the three ways PostgreSQL can execute a join.",
    short:
      "There are three join strategies. In a nested loop join the right relation is scanned once for every row found in the left relation; it is easy to implement but can be very time consuming, though it is a good strategy when the right relation can be scanned with an index. In a merge join each relation is sorted on the join attributes first and then the two are scanned in parallel. In a hash join one relation is loaded into a hash table that the other is probed against. The planner picks by estimated cost.",
    detail: [
      "The strategy appears as a node in EXPLAIN output, such as Nested Loop.",
      "Indexes on join columns make nested loops cheaper.",
      "Row estimates strongly influence which join is chosen.",
    ],
    ex: "A join of ten selected orders to customers by an indexed key is a nested loop with index lookups.",
    mistakes: [
      "Assuming a nested loop is always bad.",
      "Ignoring a bad row estimate that led to the wrong join type.",
    ],
    follow: ["How do you see which join was used?"],
    points: [
      "Nested loop: repeat inner scan per outer row",
      "Merge join: sort both sides",
      "Hash join: build and probe a hash table",
      "Cost-based choice",
    ],
    notes: "Three join methods; the planner chooses by cost.",
    src: [["PostgreSQL: Planner/Optimizer", `${PG}/planner-optimizer.html`]],
  }),
  g({
    slug: "mvcc-readers-do-not-block-writers",
    topic: "MVCC",
    d: "medium",
    title: "What is MVCC in PostgreSQL, and why do readers not block writers?",
    kw: ["MVCC", "multiversion concurrency control", "snapshot", "locking", "isolation"],
    intent:
      "Checks that you understand the core concurrency model of PostgreSQL.",
    short:
      "PostgreSQL maintains data consistency using a multiversion model, MVCC. Each SQL statement sees a snapshot of the data as it was some time ago, regardless of the current state of the underlying data. That prevents statements from viewing inconsistent data produced by concurrent transactions updating the same rows, and it provides transaction isolation for each session. The main advantage over locking is that locks acquired for reading data do not conflict with locks acquired for writing, so reading never blocks writing and writing never blocks reading. The documentation says proper use of MVCC will generally give better performance than explicit locks, which remain available for special cases.",
    detail: [
      "Table-level and row-level locks exist for cases that need explicit control.",
      "PostgreSQL keeps this guarantee even at the strictest isolation level through Serializable Snapshot Isolation.",
      "Old row versions are cleaned up later by VACUUM.",
    ],
    ex: "A long report query keeps reading a consistent snapshot while other sessions keep inserting and updating orders.",
    mistakes: [
      "Using explicit table locks to solve problems MVCC already handles.",
      "Assuming a read waits for a writer to commit.",
    ],
    follow: ["What happens to old row versions?"],
    points: [
      "Each statement sees a snapshot",
      "Reads do not block writes",
      "Writes do not block reads",
      "Explicit locks are the exception",
    ],
    notes: "Snapshots instead of read locks.",
    src: [["PostgreSQL: Concurrency Control introduction", `${PG}/mvcc-intro.html`]],
  }),
  g({
    slug: "isolation-levels",
    topic: "MVCC",
    d: "hard",
    title: "Which transaction isolation levels does PostgreSQL implement?",
    kw: ["isolation level", "read committed", "repeatable read", "serializable", "phenomena"],
    intent:
      "Checks that you can relate the standard levels to PostgreSQL's real behaviour.",
    short:
      "The SQL standard defines four isolation levels in terms of phenomena: dirty read, nonrepeatable read, phantom read and serialization anomaly. You can request any of the four in PostgreSQL, but internally only three distinct levels are implemented, because Read Uncommitted behaves like Read Committed. Read Committed is the default: each query sees only data committed before the query began. Repeatable Read sees only data committed before the transaction began, and in PostgreSQL it also prevents phantom reads, which is stronger than the standard requires; serialization anomalies remain possible. Serializable prevents all the phenomena.",
    detail: [
      "Applications using Repeatable Read or Serializable must be prepared to retry transactions that fail with serialization failures.",
      "Even in Read Committed, a transaction sees its own earlier changes.",
      "SET TRANSACTION or BEGIN ISOLATION LEVEL chooses the level.",
    ],
    ex: "A report that must see one consistent state across several queries runs in Repeatable Read.",
    mistakes: [
      "Assuming Read Uncommitted allows dirty reads in PostgreSQL.",
      "Using a stricter level without code to retry serialization failures.",
    ],
    follow: ["What happens when a serialization failure occurs?"],
    points: [
      "Read Committed by default",
      "Read Uncommitted behaves like Read Committed",
      "Repeatable Read: transaction-wide snapshot",
      "Serializable prevents all phenomena",
    ],
    notes: "Three real levels; stricter levels need retries.",
    src: [["PostgreSQL: Transaction Isolation", `${PG}/transaction-iso.html`]],
  }),
  g({
    slug: "vacuum-dead-tuples",
    topic: "MVCC",
    d: "medium",
    title: "What is VACUUM, and why does PostgreSQL need it?",
    kw: ["VACUUM", "dead tuples", "autovacuum", "visibility map", "VACUUM FULL"],
    intent:
      "Checks that you connect MVCC to the maintenance it requires.",
    short:
      "In normal operation, tuples that are deleted or obsoleted by an update are not physically removed from their table; they remain until a VACUUM is done. VACUUM reclaims storage occupied by dead tuples, so it must be run periodically, especially on frequently updated tables. The documentation lists the reasons for vacuuming: recover or reuse disk space, update planner statistics, update the visibility map that speeds up index-only scans, and protect against transaction ID wraparound. For many installations, the autovacuum daemon handles this. Standard VACUUM runs alongside normal operations, while VACUUM FULL reclaims more space but is much slower and needs an ACCESS EXCLUSIVE lock.",
    detail: [
      "VACUUM ANALYZE performs a vacuum then an analyze.",
      "You may need to adjust the autovacuum parameters for busy tables.",
      "Commands like ALTER TABLE cannot run on a table while it is being vacuumed.",
    ],
    ex: "A heavily updated table grows in size until autovacuum or a manual VACUUM makes the space reusable.",
    mistakes: [
      "Disabling autovacuum to save resources.",
      "Running VACUUM FULL on a busy table during working hours.",
    ],
    follow: ["What is the visibility map?"],
    points: [
      "Updates and deletes leave dead tuples",
      "VACUUM reclaims their space",
      "Autovacuum does it automatically",
      "VACUUM FULL takes an exclusive lock",
    ],
    notes: "MVCC leaves old versions; VACUUM cleans them.",
    src: [
      ["PostgreSQL: VACUUM", `${PG}/sql-vacuum.html`],
      ["PostgreSQL: Routine Vacuuming", `${PG}/routine-vacuuming.html`],
    ],
  }),
  g({
    slug: "row-level-locks-for-update",
    topic: "MVCC",
    d: "hard",
    title: "When do you need explicit locking such as SELECT ... FOR UPDATE?",
    kw: ["FOR UPDATE", "row-level lock", "explicit locking", "lock modes", "ROW SHARE"],
    intent:
      "Checks that you know when MVCC alone is not enough and what the lock modes are.",
    short:
      "PostgreSQL provides various lock modes to control concurrent access, and they can be used for application-controlled locking in situations where MVCC does not give the desired behaviour. Most commands acquire appropriate locks automatically. A plain SELECT takes only an ACCESS SHARE lock on the tables it reads, which conflicts only with ACCESS EXCLUSIVE. A SELECT with FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE or FOR KEY SHARE takes a ROW SHARE table lock and locks the selected rows. UPDATE, DELETE, INSERT and MERGE take ROW EXCLUSIVE on the target table. Use FOR UPDATE when you read a row and then update it based on what you read.",
    detail: [
      "The documentation also covers page-level locks, deadlocks and advisory locks.",
      "Lock modes conflict with each other according to a table in the documentation.",
      "Commands such as TRUNCATE take strong locks automatically.",
    ],
    ex: "A booking system selects the available seat with FOR UPDATE so two transactions cannot take it at once.",
    mistakes: [
      "Locking whole tables when row locks would do.",
      "Using explicit locks where MVCC already gives the behaviour you need.",
    ],
    follow: ["What is a deadlock?"],
    points: [
      "MVCC does not cover every case",
      "SELECT FOR UPDATE locks rows",
      "Plain SELECT takes ACCESS SHARE",
      "Row locks via FOR UPDATE and similar",
    ],
    notes: "Use explicit locks only where MVCC is not enough.",
    src: [["PostgreSQL: Explicit Locking", `${PG}/explicit-locking.html`]],
  }),
  g({
    slug: "transaction-all-or-nothing",
    topic: "PostgreSQL transactions",
    d: "easy",
    title: "What is a transaction, and how do BEGIN, COMMIT and ROLLBACK work?",
    kw: ["transaction", "BEGIN", "COMMIT", "ROLLBACK", "atomicity"],
    intent:
      "Checks that you can explain all-or-nothing behaviour and the default autocommit.",
    short:
      "A transaction bundles multiple steps into a single, all-or-nothing operation. The intermediate states between the steps are not visible to other concurrent transactions, and if a failure prevents the transaction from completing, none of the steps affect the database at all. BEGIN starts a transaction block: all statements after it run in a single transaction until an explicit COMMIT or ROLLBACK. By default, without BEGIN, PostgreSQL runs in autocommit mode, where each statement is its own transaction and is committed at its end if successful. The documentation's example is a bank transfer, where either all the updates happen or none of them do.",
    detail: [
      "COMMIT makes the changes permanent and visible to others.",
      "ROLLBACK discards everything done in the transaction.",
      "Some client libraries start transactions for you, so check what yours does.",
    ],
    ex: "A transfer updates two account balances inside one BEGIN ... COMMIT block.",
    mistakes: [
      "Relying on autocommit for steps that must succeed together.",
      "Leaving a transaction open and holding locks.",
    ],
    follow: ["What is a savepoint?"],
    points: [
      "All steps or none",
      "BEGIN starts a block",
      "COMMIT or ROLLBACK ends it",
      "Autocommit is the default",
    ],
    notes: "BEGIN ... COMMIT groups statements into one atomic unit.",
    src: [
      ["PostgreSQL: Transactions", `${PG}/tutorial-transactions.html`],
      ["PostgreSQL: BEGIN", `${PG}/sql-begin.html`],
    ],
  }),
  g({
    slug: "savepoints",
    topic: "PostgreSQL transactions",
    d: "medium",
    title: "What is a savepoint, and when is it useful?",
    kw: ["SAVEPOINT", "ROLLBACK TO", "RELEASE SAVEPOINT", "partial rollback", "transaction"],
    intent:
      "Checks that you can undo part of a transaction without abandoning all of it.",
    short:
      "SAVEPOINT establishes a new savepoint within the current transaction. A savepoint is a special mark inside a transaction that allows all commands executed after it was established to be rolled back, restoring the transaction state to what it was at the time of the savepoint. Use ROLLBACK TO to roll back to a savepoint, and RELEASE SAVEPOINT to destroy a savepoint while keeping the effects of the commands after it. Savepoints can only be established inside a transaction block. If savepoints with the same name already exist, they become inaccessible until newer ones with that name are released. Savepoints let you retry a failed step without losing earlier work.",
    detail: [
      "The rest of the transaction stays intact after a rollback to a savepoint.",
      "They are often used when a statement might fail, such as an insert that may violate a constraint.",
      "Releasing a savepoint does not commit anything by itself.",
    ],
    ex: "A batch import sets a savepoint before each record, and rolls back to it if that record fails validation.",
    mistakes: [
      "Using a savepoint outside a transaction block.",
      "Thinking RELEASE SAVEPOINT commits the work.",
    ],
    follow: ["How do isolation levels affect a transaction?"],
    points: [
      "A mark inside a transaction",
      "ROLLBACK TO undoes later work",
      "RELEASE SAVEPOINT keeps it",
      "Only inside a transaction block",
    ],
    notes: "Savepoints give partial rollback.",
    src: [["PostgreSQL: SAVEPOINT", `${PG}/sql-savepoint.html`]],
  }),
  g({
    slug: "set-transaction-characteristics",
    topic: "PostgreSQL transactions",
    d: "medium",
    title: "How do you set a transaction's isolation level and access mode?",
    kw: ["SET TRANSACTION", "isolation level", "read only", "deferrable", "BEGIN"],
    intent:
      "Checks that you know where to choose a transaction's behaviour.",
    short:
      "SET TRANSACTION sets the characteristics of the current transaction, and it has no effect on subsequent transactions. SET SESSION CHARACTERISTICS sets the defaults for later transactions in a session, which SET TRANSACTION can override for a single one. The characteristics are the isolation level, the access mode (read/write or read-only), and the deferrable mode. The isolation level controls what data the transaction can see while others run concurrently: READ COMMITTED, the default, lets a statement see only rows committed before it began, and REPEATABLE READ lets all statements of the transaction see only rows committed before its first query. You can also pass the characteristics directly to BEGIN.",
    detail: [
      "BEGIN accepts ISOLATION LEVEL, READ WRITE or READ ONLY, and DEFERRABLE.",
      "The access mode can be read/write or read-only.",
      "SET TRANSACTION must be run before the first query in the transaction.",
    ],
    ex: "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY starts a consistent read-only report transaction.",
    mistakes: [
      "Expecting SET TRANSACTION to change later transactions.",
      "Setting the isolation level after the first query.",
    ],
    follow: ["What if a serialization failure happens?"],
    points: [
      "SET TRANSACTION affects the current one",
      "SET SESSION CHARACTERISTICS sets defaults",
      "Isolation level and access mode",
      "BEGIN can set them too",
    ],
    notes: "Choose characteristics at BEGIN or with SET TRANSACTION.",
    src: [
      ["PostgreSQL: SET TRANSACTION", `${PG}/sql-set-transaction.html`],
      ["PostgreSQL: BEGIN", `${PG}/sql-begin.html`],
    ],
  }),
  g({
    slug: "serialization-failures-retry",
    topic: "PostgreSQL transactions",
    d: "hard",
    title: "What is a serialization failure, and how should an application handle it?",
    kw: ["serialization failure", "retry", "repeatable read", "serializable", "concurrent update"],
    intent:
      "Checks that you design for retries at stricter isolation levels.",
    short:
      "At the Repeatable Read and Serializable levels, a transaction can be asked to fail because the database cannot keep the isolation guarantee when concurrent transactions change the same data; this is reported as a serialization failure. The documentation says applications using these levels must be prepared to retry transactions that fail this way. In Repeatable Read, UPDATE, DELETE, MERGE and SELECT FOR UPDATE find only rows committed as of the transaction start, and a row already changed by another committed transaction causes a failure. Handle it by catching the error, rolling back and running the whole transaction again, with a limit on attempts.",
    detail: [
      "The retry must repeat the whole transaction, including reads.",
      "Keep transactions short to make conflicts less likely.",
      "Read Committed, the default, behaves differently and does not raise these failures in the same way.",
    ],
    ex: "A booking service retries a failed Serializable transaction up to three times before reporting an error.",
    mistakes: [
      "Retrying only the failed statement instead of the whole transaction.",
      "Using Serializable with no retry logic.",
    ],
    follow: ["Which level is the default?"],
    points: [
      "Stricter levels can abort a transaction",
      "Applications must retry",
      "Retry the whole transaction",
      "Short transactions help",
    ],
    notes: "Catch, roll back, retry whole transaction.",
    src: [["PostgreSQL: Transaction Isolation", `${PG}/transaction-iso.html`]],
  }),
])
