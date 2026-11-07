import { defineQuestions } from "../author"
import { g } from "../brief"

const PD = "https://pandas.pydata.org/docs/reference/api"
const PDG = "https://pandas.pydata.org/docs/user_guide"
const PG = "https://www.postgresql.org/docs/current"
const AF = "https://airflow.apache.org/docs/apache-airflow/stable"
const PY = "https://docs.python.org/3"

export default defineQuestions("etl", "fresher", [
  g({
    slug: "what-is-etl",
    topic: "Pipelines & scheduling",
    d: "easy",
    title: "What does ETL mean, and what does each step do?",
    kw: ["etl", "extract", "transform", "load", "pipeline"],
    intent:
      "Checks that you can define the three steps and give an example of each.",
    short:
      "ETL stands for extract, transform and load. Extract reads data from a source such as a file, an API or a database. Transform cleans and reshapes it: fixing types, removing duplicates, handling missing values and joining sources. Load writes the result to a target, commonly a database table or a warehouse, where people and tools can query it. The Apache Airflow TaskFlow tutorial shows this as a simple pipeline with three tasks, extract, then transform, then load, where each task's output feeds the next. The same pattern is applied to many sources on a schedule.",
    detail: [
      "Each step is usually a separate task, so a failure can be retried without redoing the others.",
      "Airflow represents the pipeline as a Dag whose tasks depend on one another.",
      "Pipelines are repeated on a schedule, so they must be safe to re-run.",
    ],
    ex: "A nightly job reads yesterday's orders from a CSV export, cleans them with pandas and loads them into a PostgreSQL table.",
    mistakes: [
      "Treating ETL as a single script with no separate stages.",
      "Forgetting that the load step must cope with being run twice.",
    ],
    follow: ["How do you schedule a pipeline?"],
    points: [
      "Extract: read from sources",
      "Transform: clean and reshape",
      "Load: write to the target",
      "Separate, retryable steps",
    ],
    notes: "Extract, transform, load; each step a task.",
    src: [["Apache Airflow: TaskFlow tutorial", `${AF}/tutorial/taskflow.html`]],
  }),
  g({
    slug: "extract-from-csv-with-pandas",
    topic: "Extract from sources",
    d: "easy",
    title: "How do you extract data from a CSV file with pandas, and which options matter?",
    kw: ["read_csv", "dtype", "parse_dates", "na_values", "usecols"],
    intent:
      "Checks that you read files with explicit types and missing-value rules instead of relying on guesses.",
    short:
      "pandas.read_csv reads a comma-separated file into a DataFrame. The path can be a local file or a URL, and the function supports reading in chunks. Options that matter for ETL include usecols to read only some columns, dtype to set column types explicitly, parse_dates to parse date columns, and na_values to say which strings mean missing, with keep_default_na controlling whether the default markers are also used. nrows reads a sample of rows and on_bad_lines controls what happens with malformed lines, raising an error by default. Setting these explicitly makes the extract step predictable.",
    detail: [
      "encoding and sep, or delimiter, handle files that are not UTF-8 or not comma separated.",
      "Reading a sample with nrows is a quick way to inspect a new source.",
      "The compression argument defaults to inferring the compression from the file name.",
    ],
    ex: "An extract script reads only the needed columns, sets dtype for the id column as text and parses the order date.",
    mistakes: [
      "Letting pandas guess types for identifiers with leading zeros.",
      "Ignoring bad lines silently without recording how many were skipped.",
    ],
    follow: ["How do you read a file too large for memory?"],
    points: [
      "read_csv returns a DataFrame",
      "usecols, dtype, parse_dates",
      "na_values defines missing markers",
      "on_bad_lines handles malformed rows",
    ],
    notes: "Be explicit about columns, types, dates and missing markers.",
    src: [["pandas: read_csv", `${PD}/pandas.read_csv.html`]],
  }),
  g({
    slug: "read-large-files-in-chunks",
    topic: "Extract from sources",
    d: "medium",
    title: "How do you process a file that is too large to fit in memory?",
    kw: ["chunksize", "iterator", "read_csv", "memory", "streaming"],
    intent:
      "Checks that you can extract in pieces instead of loading everything at once.",
    short:
      "pandas.read_csv supports iterating over a file in chunks. When you pass chunksize, the function returns an iterator that yields DataFrames of that many rows instead of loading the entire file into memory. You loop over the chunks, transform each one and write it to the target before reading the next, so memory use stays bounded. read_json likewise returns an iterator when chunksize is specified, for line-delimited JSON. You can also limit the work with usecols to read fewer columns and dtype to use compact types. Aggregations that need the whole dataset, such as a total, are accumulated across chunks.",
    detail: [
      "Process and load each chunk, rather than collecting all chunks back into one DataFrame.",
      "usecols and dtype reduce the memory needed per chunk.",
      "read_json takes a chunksize for line-delimited JSON.",
    ],
    ex: "A script reads a 5 GB log file 100,000 rows at a time, filters each chunk and appends it to a table.",
    mistakes: [
      "Concatenating all chunks and defeating the purpose.",
      "Computing a statistic such as a mean per chunk and treating it as the overall value.",
    ],
    follow: ["How would you load each chunk into a database?"],
    points: [
      "chunksize returns an iterator",
      "Each chunk is a DataFrame",
      "Load as you go",
      "Accumulate aggregates carefully",
    ],
    notes: "read_csv(..., chunksize=n) streams the file.",
    code: [
      "Chunked extract and load",
      `import pandas as pd

for chunk in pd.read_csv("events.csv", chunksize=100_000):
    cleaned = chunk.dropna(subset=["user_id"])
    cleaned.to_sql("events", engine, if_exists="append", index=False)`,
      [
        "chunksize makes read_csv yield DataFrames of 100,000 rows.",
        "Each chunk is cleaned on its own.",
        "to_sql appends the chunk to the target table.",
      ],
      "python",
    ],
    src: [
      ["pandas: read_csv", `${PD}/pandas.read_csv.html`],
      ["pandas: read_json", `${PD}/pandas.read_json.html`],
    ],
  }),
  g({
    slug: "extract-from-json-and-csv-stdlib",
    topic: "Extract from sources",
    d: "easy",
    title: "How do you read JSON and CSV data with Python's standard library?",
    kw: ["json", "csv", "DictReader", "json.load", "standard library"],
    intent:
      "Checks that you can extract data without third-party packages when needed.",
    short:
      "The csv module reads and writes tabular data in CSV format. Its reader and writer objects work with sequences, and DictReader and DictWriter read and write rows in dictionary form, using the header row for the keys. The json module encodes and decodes JSON: json.load reads JSON from a file object and json.loads from a string, returning Python dictionaries and lists. Both are useful for small extracts and for validating inputs before handing them to pandas. For nested JSON you often need to flatten it into rows, and pandas.read_json can read JSON files and JSON-like data into pandas objects.",
    detail: [
      "Open CSV files with newline='' as the csv documentation recommends.",
      "DictReader uses the header row for the dictionary keys.",
      "read_json supports line-delimited JSON and compressed files.",
    ],
    ex: "A script reads a configuration file with json.load and a customer list with csv.DictReader.",
    mistakes: [
      "Splitting CSV lines on commas by hand, which breaks on quoted fields.",
      "Assuming every JSON record has the same keys.",
    ],
    follow: ["How would you flatten nested JSON?"],
    points: [
      "csv.reader and DictReader",
      "json.load and json.loads",
      "Use real parsers, not string splitting",
      "pandas.read_json for table-like JSON",
    ],
    notes: "csv for tables, json for nested data.",
    src: [
      ["Python: csv module", `${PY}/library/csv.html`],
      ["Python: json module", `${PY}/library/json.html`],
      ["pandas: read_json", `${PD}/pandas.read_json.html`],
    ],
  }),
  g({
    slug: "extract-from-database-read-sql",
    topic: "Extract from sources",
    d: "easy",
    title: "How do you extract data from a database into pandas?",
    kw: ["read_sql", "read_sql_query", "sqlalchemy", "query", "database"],
    intent:
      "Checks that you can pull a query result into a DataFrame and know the safe way to pass values.",
    short:
      "pandas.read_sql reads a SQL query or a database table into a DataFrame. It is a convenience wrapper around read_sql_query and read_sql_table and delegates depending on the input: a SQL query goes to read_sql_query, and a table name goes to read_sql_table. You pass the query and a connection, and you can pass parameters separately instead of building the SQL string by hand. Select only the columns and rows you need in the query, because filtering in the database is cheaper than extracting everything. The Python sqlite3 module offers a similar approach for SQLite files.",
    detail: [
      "Use a query with a date filter for incremental extracts.",
      "The pandas documentation warns that it does not sanitise inputs to to_sql, so rely on parameters and the driver's protections.",
    ],
    ex: "An extract runs a query for orders created since the last run and reads it with read_sql_query.",
    mistakes: [
      "Formatting user-supplied values straight into the SQL string.",
      "Selecting the whole table when only a day of data is needed.",
    ],
    follow: ["How do you extract only new rows?"],
    points: [
      "read_sql wraps query and table readers",
      "Pass parameters, not string concatenation",
      "Filter in the database",
      "Incremental by date",
    ],
    notes: "Push filters into the query; pass parameters safely.",
    src: [
      ["pandas: read_sql", `${PD}/pandas.read_sql.html`],
      ["Python: sqlite3 module", `${PY}/library/sqlite3.html`],
    ],
  }),
  g({
    slug: "incremental-vs-full-extract",
    topic: "Extract from sources",
    d: "medium",
    title: "What is the difference between a full extract and an incremental extract?",
    kw: ["incremental load", "full load", "data interval", "logical date", "watermark"],
    intent:
      "Checks that you can limit each run to new or changed data and tie runs to a time window.",
    short:
      "A full extract reads the whole source each run, which is simple but grows more expensive as data grows. An incremental extract reads only data that is new or changed since the last run, usually by filtering on a timestamp. Airflow supports this by giving each Dag run a data interval, the time range it operates in. For a daily schedule each interval starts at midnight and ends at the next midnight, and a run is scheduled after its interval ends so it can collect all the data for that period. The logical date marks the start of the data interval, not when the run actually executes.",
    detail: [
      "Using the interval boundaries in the query makes reruns and backfills reproducible.",
      "Backfills reuse the same interval logic for past dates.",
    ],
    ex: "A daily job extracts orders whose created time falls inside its data interval, not 'the last 24 hours from now'.",
    mistakes: [
      "Using the current time in the query, which gives different results when re-run.",
      "Assuming the logical date is the time the run started.",
    ],
    follow: ["What is a backfill?"],
    points: [
      "Full: whole source each time",
      "Incremental: only new or changed",
      "Data interval defines the window",
      "Logical date = start of the interval",
    ],
    notes: "Tie the query to the run's data interval, not the clock.",
    src: [["Apache Airflow: Dag Runs", `${AF}/core-concepts/dag-run.html`]],
  }),
  g({
    slug: "handling-missing-values",
    topic: "Transform & clean",
    d: "easy",
    title: "How do you handle missing values in pandas?",
    kw: ["dropna", "fillna", "isna", "missing data", "NaN"],
    intent:
      "Checks that you choose between dropping and filling deliberately.",
    short:
      "pandas uses sentinel values to represent missing data, depending on the data type; numpy.nan is used for NumPy data types. isna shows where values are missing. DataFrame.dropna removes missing values: axis chooses rows or columns, how='any' drops if any value is missing and how='all' only if all are, thresh sets a minimum number of non-missing values, and subset restricts the check to certain columns. DataFrame.fillna replaces missing values with a scalar or with a dict or Series giving a value per column. Decide per column whether dropping, filling or keeping the gap is right, and record the rule.",
    detail: [
      "The missing-data guide explains which values count as missing for each type.",
      "fillna accepts a dict giving a value per column.",
    ],
    ex: "Rows with no customer id are dropped, while a missing discount is filled with 0.",
    mistakes: [
      "Dropping rows silently and losing data without a log.",
      "Filling every column with the same value.",
    ],
    follow: ["How do you find duplicate rows?"],
    points: [
      "isna finds gaps",
      "dropna removes rows or columns",
      "fillna replaces with a value per column",
      "Log what you changed",
    ],
    notes: "Decide per column: drop, fill or keep.",
    src: [
      ["pandas: dropna", `${PD}/pandas.DataFrame.dropna.html`],
      ["pandas: fillna", `${PD}/pandas.DataFrame.fillna.html`],
      ["pandas: Working with missing data", `${PDG}/missing_data.html`],
    ],
  }),
  g({
    slug: "removing-duplicates",
    topic: "Transform & clean",
    d: "easy",
    title: "How do you find and remove duplicate rows in pandas?",
    kw: ["drop_duplicates", "duplicated", "subset", "keep", "deduplication"],
    intent:
      "Checks that you define what a duplicate means before deleting rows.",
    short:
      "DataFrame.duplicated returns a boolean Series marking duplicate rows, where rows count as duplicated when the same values appear more than once across the requested columns. DataFrame.drop_duplicates returns the frame with duplicate rows removed. Both take a subset argument, to consider only certain columns, by default all of them, and keep, which can be 'first', 'last' or False. 'first' drops duplicates except for the first occurrence, 'last' except for the last, and False drops all duplicates. Indexes are ignored. Choose the subset that really identifies a record, such as an order id, and keep the most recent version if records update.",
    detail: [
      "Sort by a timestamp before drop_duplicates(keep='last') to keep the latest record.",
      "Check the count with duplicated().sum() before and after.",
      "Duplicates can also be removed in the database with a unique constraint.",
    ],
    ex: "Orders are deduplicated on order_id, keeping the row with the latest update time.",
    mistakes: [
      "Deduplicating on all columns when only some identify the record.",
      "Dropping duplicates without checking why they occur.",
    ],
    follow: ["How can the target table prevent duplicates?"],
    points: [
      "duplicated marks, drop_duplicates removes",
      "subset chooses identifying columns",
      "keep: first, last or False",
      "Sort first to keep the latest",
    ],
    notes: "Define the key, then drop_duplicates(subset=key).",
    src: [
      ["pandas: drop_duplicates", `${PD}/pandas.DataFrame.drop_duplicates.html`],
      ["pandas: duplicated", `${PD}/pandas.DataFrame.duplicated.html`],
    ],
  }),
  g({
    slug: "fixing-data-types",
    topic: "Transform & clean",
    d: "easy",
    title: "How do you convert columns to the right data types in pandas?",
    kw: ["astype", "to_numeric", "to_datetime", "errors coerce", "dtype"],
    intent:
      "Checks that you can convert types and handle values that fail to parse.",
    short:
      "DataFrame.astype casts a pandas object to a specified dtype, either one dtype for everything or a mapping of column names to dtypes. pandas.to_numeric converts to a numeric type, and pandas.to_datetime converts to datetime. Both have an errors argument whose default is 'raise', so invalid parsing raises an exception; with 'coerce' invalid values are set to NaN, or NaT for dates, so you can find and handle them. Using coerce and then counting the new missing values is a common way to spot bad data without stopping the pipeline. Convert types early in the transform step.",
    detail: [
      "to_datetime can parse a DataFrame with year, month and day columns.",
      "The dayfirst option helps with day-first date strings.",
      "Store dates as real datetimes, not text, before loading.",
    ],
    ex: "pd.to_numeric(df['price'], errors='coerce') turns 'N/A' into NaN so the bad rows can be counted.",
    mistakes: [
      "Leaving numbers as text and sorting them alphabetically.",
      "Using coerce and never checking how many values it nulled.",
    ],
    follow: ["How do you validate the result?"],
    points: [
      "astype casts columns",
      "to_numeric and to_datetime parse",
      "errors='raise' by default",
      "errors='coerce' gives NaN or NaT",
    ],
    notes: "Convert, coerce, then count the failures.",
    src: [
      ["pandas: astype", `${PD}/pandas.DataFrame.astype.html`],
      ["pandas: to_numeric", `${PD}/pandas.to_numeric.html`],
      ["pandas: to_datetime", `${PD}/pandas.to_datetime.html`],
    ],
  }),
  g({
    slug: "joining-datasets-merge",
    topic: "Transform & clean",
    d: "medium",
    title: "How do you join two datasets in pandas, and what do the join types mean?",
    kw: ["merge", "join", "how", "left join", "validate"],
    intent:
      "Checks that you pick the right join and guard against accidental row multiplication.",
    short:
      "DataFrame.merge merges DataFrames with a database-style join, on columns or indexes. The how argument chooses the join type and defaults to 'inner'. When joining columns on columns, the DataFrame indexes are ignored. Use on, or left_on and right_on, to name the key columns. The suffixes argument renames overlapping column names, indicator adds a column showing where each row came from, and validate checks that the merge has the type you expect, such as one-to-one or one-to-many, so a duplicated key raises an error instead of silently multiplying rows. A left join keeps every row of the left side.",
    detail: [
      "The documentation warns that null keys on both sides can match each other.",
      "Check row counts before and after a merge.",
      "The same logic applies to SQL JOINs when transforming inside the database.",
    ],
    ex: "Orders are left-merged with a customer table on customer_id with validate='many_to_one'.",
    mistakes: [
      "Merging on a key that is not unique and multiplying rows.",
      "Using an inner join and losing rows that have no match.",
    ],
    follow: ["How do you detect unmatched rows?"],
    points: [
      "Database-style join",
      "how defaults to inner",
      "validate guards the relationship",
      "indicator shows row origin",
    ],
    notes: "Check keys are unique on the 'one' side.",
    src: [["pandas: DataFrame.merge", `${PD}/pandas.DataFrame.merge.html`]],
  }),
  g({
    slug: "transform-with-groupby-aggregation",
    topic: "Transform & clean",
    d: "medium",
    title: "How do you aggregate data in the transform step with groupby?",
    kw: ["groupby", "aggregation", "agg", "summary table", "transform"],
    intent:
      "Checks that you can produce summary tables from detailed records.",
    short:
      "DataFrame.groupby splits the data into groups by one or more columns so you can apply an aggregation to each group, such as a sum, count or mean, and combine the results. In a transform step this turns detailed event rows into summary tables, for example revenue per day per product. You name the grouping columns, then call agg with the columns and functions you want. The result is a new DataFrame whose index is the group keys, which you can reset into columns before loading. The same idea is expressed in SQL with GROUP BY, and doing it in the database is often faster when the data is already there.",
    detail: [
      "Be clear about the grain of the result: one row per what?",
      "Check that totals before and after aggregation still reconcile.",
      "Named aggregations make column names clear.",
    ],
    ex: "Order lines are grouped by order_date and product to produce daily sales per product.",
    mistakes: [
      "Losing the grain and mixing rows of different levels.",
      "Aggregating before cleaning bad values.",
    ],
    follow: ["How do you verify the totals?"],
    points: [
      "Group by key columns",
      "Aggregate with sum, count, mean",
      "Know the grain of the output",
      "SQL GROUP BY is the same idea",
    ],
    notes: "Define the grain, then group and aggregate.",
    src: [["pandas: DataFrame.groupby", `${PD}/pandas.DataFrame.groupby.html`]],
  }),
  g({
    slug: "load-to-database-to-sql",
    topic: "Load & warehousing basics",
    d: "medium",
    title: "How do you load a DataFrame into a database, and what does if_exists do?",
    kw: ["to_sql", "if_exists", "append", "replace", "chunksize"],
    intent:
      "Checks that you control what happens when the target table already exists.",
    short:
      "DataFrame.to_sql writes the records stored in a DataFrame to a SQL database; databases supported by SQLAlchemy are supported, and tables can be newly created, appended to or overwritten. The if_exists argument decides what to do if the table exists: 'fail', the default, raises an error, 'replace' drops the table and recreates it, and 'append' inserts new rows. The index argument controls whether the DataFrame index is written, True by default, and chunksize writes in batches. The documentation warns that pandas does not sanitise inputs to to_sql, so check the underlying driver's protection against injection.",
    detail: [
      "A dtype mapping sets column types explicitly.",
      "Recent pandas versions also offer a mode that deletes the rows before inserting.",
      "Appending the same data twice creates duplicates, so design for re-runs.",
    ],
    ex: "df.to_sql('daily_sales', engine, if_exists='append', index=False) adds one day's rows to the table.",
    mistakes: [
      "Using replace on a production table and losing its indexes and constraints.",
      "Leaving index=True and writing an unwanted column.",
    ],
    follow: ["How do you make the load idempotent?"],
    points: [
      "to_sql writes via SQLAlchemy",
      "if_exists: fail, replace, append",
      "index=False to skip the index",
      "No automatic duplicate protection",
    ],
    notes: "append for new rows; replace rebuilds the table.",
    src: [["pandas: DataFrame.to_sql", `${PD}/pandas.DataFrame.to_sql.html`]],
  }),
  g({
    slug: "bulk-load-copy-command",
    topic: "Load & warehousing basics",
    d: "medium",
    title: "Why is PostgreSQL's COPY faster than many INSERT statements for loading?",
    kw: ["COPY", "bulk load", "INSERT", "autocommit", "PostgreSQL"],
    intent:
      "Checks that you know the right tool for large loads.",
    short:
      "COPY moves data between PostgreSQL tables and files. COPY FROM loads data from a file into a table, appending to whatever is already there. The PostgreSQL documentation says to use COPY to load all the rows in one command instead of a series of INSERT commands: it is optimised for large numbers of rows, is less flexible than INSERT, and incurs significantly less overhead for large data loads. It adds that loading many rows with COPY is almost always faster than INSERT, even with prepared statements and batching in one transaction. If you must use INSERT, turn off autocommit and commit once at the end.",
    detail: [
      "COPY accepts options such as FORMAT, DELIMITER, HEADER and NULL.",
      "COPY is a single command, so there is no need to disable autocommit.",
      "Loading in one transaction means a failure does not leave partially loaded data.",
    ],
    ex: "A nightly job writes a cleaned CSV and loads it with COPY events FROM STDIN WITH (FORMAT csv, HEADER).",
    mistakes: [
      "Looping over rows with individual INSERT statements and autocommit on.",
      "Not checking row counts after the load.",
    ],
    follow: ["What else speeds up large loads?"],
    points: [
      "COPY FROM loads a file into a table",
      "Much less overhead than INSERT",
      "One command, one transaction",
      "Check counts afterwards",
    ],
    notes: "Prefer COPY for bulk loads.",
    src: [
      ["PostgreSQL: COPY", `${PG}/sql-copy.html`],
      ["PostgreSQL: Populating a Database", `${PG}/populate.html`],
    ],
  }),
  g({
    slug: "upsert-on-conflict",
    topic: "Load & warehousing basics",
    d: "hard",
    title: "How do you make a load idempotent with an upsert (INSERT ... ON CONFLICT)?",
    kw: ["upsert", "ON CONFLICT", "idempotent", "unique constraint", "DO UPDATE"],
    intent:
      "Checks that re-running a load does not create duplicates or lose updates.",
    short:
      "In PostgreSQL, INSERT can include an ON CONFLICT clause that specifies an alternative action to raising a unique constraint or exclusion constraint violation error. ON CONFLICT DO UPDATE guarantees an atomic INSERT or UPDATE outcome: provided there is no independent error, one of those two outcomes is guaranteed, even under high concurrency. This is also known as upsert. With a unique key on the business key, you can re-run the same load and existing rows are updated instead of duplicated, which makes the load idempotent. ON CONFLICT DO NOTHING is the alternative that skips rows that already exist.",
    detail: [
      "The conflict target names the unique columns or constraint that define a conflict.",
      "A RETURNING clause returns the values of the rows inserted or updated.",
      "PostgreSQL also has a MERGE command for more general cases.",
    ],
    ex: "INSERT INTO customers (id, name) VALUES (1, 'A') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name.",
    mistakes: [
      "Upserting without a unique constraint on the key.",
      "Using plain INSERT for a job that may be retried.",
    ],
    follow: ["How else can you make a load safe to repeat?"],
    points: [
      "ON CONFLICT handles key clashes",
      "DO UPDATE is atomic",
      "Needs a unique constraint",
      "Makes retries safe",
    ],
    notes: "Unique key plus ON CONFLICT = idempotent load.",
    code: [
      "Upsert a customer row",
      `INSERT INTO customers (id, name, city)
VALUES (1, 'Asha', 'Pune')
ON CONFLICT (id)
DO UPDATE SET name = EXCLUDED.name, city = EXCLUDED.city;`,
      [
        "The insert tries to add a row with id 1.",
        "If id 1 already exists, the unique conflict triggers DO UPDATE.",
        "EXCLUDED refers to the row that was proposed for insertion.",
      ],
      "sql",
    ],
    src: [["PostgreSQL: INSERT", `${PG}/sql-insert.html`]],
  }),
  g({
    slug: "transactions-for-loads",
    topic: "Load & warehousing basics",
    d: "medium",
    title: "Why should a load run inside a transaction?",
    kw: ["transaction", "all-or-nothing", "commit", "rollback", "atomic"],
    intent:
      "Checks that a failed load does not leave half the data behind.",
    short:
      "A transaction bundles multiple steps into a single all-or-nothing operation. The intermediate states between the steps are not visible to other concurrent transactions, and if a failure prevents the transaction from completing, none of the steps affect the database at all. For a load, this means either every row is written and committed, or none are, so a failure in the middle does not leave a partially loaded table. The PostgreSQL documentation also notes an extra benefit when populating a database: with all insertions in one transaction, if one row fails, all rows inserted up to that point are rolled back. Commit once at the end.",
    detail: [
      "In plain SQL you issue BEGIN at the start and COMMIT at the end.",
      "Some client libraries start transactions automatically, so check what yours does.",
      "A COPY command is a single statement and is atomic by itself.",
    ],
    ex: "A job truncates a staging table and loads new rows in one transaction, so readers never see an empty table.",
    mistakes: [
      "Committing after every row so a failure leaves a partial load.",
      "Holding a transaction open while doing slow work outside the database.",
    ],
    follow: ["How do you make a retry safe?"],
    points: [
      "All-or-nothing",
      "Intermediate states hidden from others",
      "Failure rolls everything back",
      "Commit once at the end",
    ],
    notes: "Wrap the load in one transaction.",
    src: [
      ["PostgreSQL: Transactions", `${PG}/tutorial-transactions.html`],
      ["PostgreSQL: Populating a Database", `${PG}/populate.html`],
    ],
  }),
  g({
    slug: "staging-table-pattern",
    topic: "Load & warehousing basics",
    d: "medium",
    title: "What is a staging table and why load into one first?",
    kw: ["staging table", "truncate", "load", "validate", "swap"],
    intent:
      "Checks that you separate raw loading from the final tables.",
    short:
      "A staging table is an intermediate table that receives raw or lightly cleaned data before it goes to the final table. Loading into staging first lets you check row counts and constraints before touching the tables people query, and the final step becomes a single SQL statement such as an upsert or an insert-select inside one transaction. PostgreSQL supports TRUNCATE to quickly empty a table before each run, and the documentation notes that COPY is fastest when used within the same transaction as an earlier CREATE TABLE or TRUNCATE command because no WAL needs to be written in that case.",
    detail: [
      "Staging data is replaced on every run, so it holds only the current batch.",
      "Moving data from staging to final tables can use INSERT ... SELECT, ON CONFLICT or MERGE.",
      "Keeping raw data in staging makes debugging easier.",
    ],
    ex: "A job truncates stg_orders, loads the day's file with COPY, checks counts, then upserts into orders.",
    mistakes: [
      "Loading straight into the final table and exposing half-validated data.",
      "Forgetting to clear staging between runs.",
    ],
    follow: ["How do you validate the staged data?"],
    points: [
      "Intermediate table for the batch",
      "Validate before publishing",
      "TRUNCATE then COPY",
      "Final step is one statement",
    ],
    notes: "Stage, validate, then publish.",
    src: [
      ["PostgreSQL: Populating a Database", `${PG}/populate.html`],
      ["PostgreSQL: INSERT", `${PG}/sql-insert.html`],
    ],
  }),
  g({
    slug: "columnar-formats-parquet",
    topic: "Load & warehousing basics",
    d: "medium",
    title: "Why write data as Parquet instead of CSV?",
    kw: ["parquet", "to_parquet", "columnar format", "compression", "csv"],
    intent:
      "Checks that you know a common file format for storing analytical data.",
    short:
      "DataFrame.to_parquet writes a DataFrame to the binary Parquet format. You can choose different Parquet backends, and there is an option for compression. Unlike CSV, which is plain text, Parquet is a binary format. The pandas documentation's input and output guide lists Parquet alongside CSV, JSON and SQL as supported formats. In a pipeline, Parquet is a common choice for intermediate files and for data lake storage, while CSV remains useful for exchange with people and simple tools.",
    detail: [
      "A partitioned dataset can be written to a directory.",
      "The pandas IO guide lists Parquet alongside CSV, JSON and SQL as supported formats.",
      "Parquet needs an extra library, called a backend, installed.",
    ],
    ex: "A job saves cleaned data as compressed Parquet files that downstream analysis reads column by column.",
    mistakes: [
      "Using plain text files for large tables when a binary format would do.",
      "Forgetting to install a Parquet backend.",
    ],
    follow: ["When is CSV still the right choice?"],
    points: [
      "Binary, typed format",
      "Optional compression",
      "Needs a backend library",
      "Good for analytics storage",
    ],
    notes: "Typed, compressed columnar files beat CSV for analytics.",
    src: [
      ["pandas: DataFrame.to_parquet", `${PD}/pandas.DataFrame.to_parquet.html`],
      ["pandas: IO tools", `${PDG}/io.html`],
    ],
  }),
  g({
    slug: "write-csv-output",
    topic: "Load & warehousing basics",
    d: "easy",
    title: "How do you write a DataFrame to CSV and which options matter?",
    kw: ["to_csv", "index", "encoding", "header", "float_format"],
    intent:
      "Checks that you produce clean output files for downstream systems.",
    short:
      "DataFrame.to_csv writes a DataFrame to a comma-separated file. The options that matter for a pipeline are index, to decide whether the row index is written; header, to control the header row; sep for the delimiter; encoding for the text encoding; and na_rep for how missing values are written. If no path is given, it returns the CSV text as a string. Agree the format with the receiving system, including the delimiter, encoding, header and date format, and write the file to a temporary name before moving it into place, so readers never see a half-written file.",
    detail: [
      "The compression argument can write compressed output.",
      "Quote handling follows the csv module's rules.",
      "Include a run date in the file name to keep files from different runs apart.",
    ],
    ex: "df.to_csv('sales_2026-01-05.csv', index=False, encoding='utf-8') produces the daily export.",
    mistakes: [
      "Writing the index column by accident.",
      "Letting a consumer read a file that is still being written.",
    ],
    follow: ["Why might you prefer Parquet?"],
    points: [
      "to_csv writes the file",
      "index=False avoids extra column",
      "Set encoding and delimiter",
      "Write to a temporary name first",
    ],
    notes: "to_csv(path, index=False) plus an agreed format.",
    src: [["pandas: DataFrame.to_csv", `${PD}/pandas.DataFrame.to_csv.html`]],
  }),
  g({
    slug: "airflow-dag-and-tasks",
    topic: "Pipelines & scheduling",
    d: "easy",
    title: "What are a Dag, tasks and operators in Apache Airflow?",
    kw: ["airflow", "dag", "task", "operator", "dependencies"],
    intent:
      "Checks that you know the vocabulary of the most common pipeline orchestrator.",
    short:
      "Airflow is a platform to build and run workflows. A workflow is represented as a Dag, a directed acyclic graph, which contains individual pieces of work called tasks arranged with dependencies and data flows taken into account. A Dag specifies the order in which tasks run, how often the Dag runs, how many times to retry and whether there are timeouts. It does not care what happens inside the tasks. A task is the basic unit of execution. Operators are predefined task templates, for example BashOperator for a shell command, and you declare dependencies with the >> operator, such as extract >> transform >> load.",
    detail: [
      "A Dag can be declared with a context manager, a constructor or the @dag decorator.",
      "A task can also be a Python function decorated with @task.",
      "A Dag Run is one instantiation of the Dag in time.",
    ],
    ex: "extract >> transform >> load defines three tasks that must run in that order.",
    mistakes: [
      "Putting heavy work in the Dag file itself instead of in tasks.",
      "Using one huge task for the whole pipeline.",
    ],
    follow: ["How do tasks pass data to each other?"],
    points: [
      "Dag = tasks plus dependencies",
      "Operators are task templates",
      "Dependencies with >>",
      "Dag Run = one run in time",
    ],
    notes: "A Dag is a graph of tasks with a schedule.",
    src: [
      ["Apache Airflow: Architecture overview", `${AF}/core-concepts/overview.html`],
      ["Apache Airflow: Dags", `${AF}/core-concepts/dags.html`],
      ["Apache Airflow: Tasks", `${AF}/core-concepts/tasks.html`],
      ["Apache Airflow: Operators", `${AF}/core-concepts/operators.html`],
    ],
  }),
  g({
    slug: "airflow-scheduling-cron",
    topic: "Pipelines & scheduling",
    d: "easy",
    title: "How do you schedule a Dag in Airflow?",
    kw: ["schedule", "cron expression", "@daily", "timedelta", "start_date"],
    intent:
      "Checks that you can express a schedule and know the common presets.",
    short:
      "You set the Dag's schedule argument to a cron expression, a datetime.timedelta object, or one of the cron presets. The presets include @once, to schedule once and only once, @hourly, @daily, @weekly, @monthly and @yearly, and None for Dags that are only triggered externally. @daily is the same as the cron expression 0 0 * * *, running once a day at midnight. The Dag's start_date marks the start of its first data interval. Airflow parses cron expressions with the croniter library, which supports an extended syntax, and for more elaborate needs you can implement a custom timetable.",
    detail: [
      "A run is created after its data interval ends.",
      "@continuous runs the next run as soon as the previous one finishes.",
      "Catchup settings control whether missed intervals are run automatically.",
    ],
    ex: "schedule='@daily' with a start date of 2025-01-01 gives a run for each day after 2025-01-01.",
    mistakes: [
      "Expecting a daily Dag to run at the start of the day it covers.",
      "Writing a cron expression without testing which times it produces.",
    ],
    follow: ["What is a backfill?"],
    points: [
      "schedule takes cron, timedelta or preset",
      "@daily = 0 0 * * *",
      "None = externally triggered",
      "Custom timetables for complex cases",
    ],
    notes: "schedule='@daily' or a cron string.",
    src: [
      ["Apache Airflow: Cron & Time Intervals", `${AF}/authoring-and-scheduling/cron.html`],
      ["Apache Airflow: Dag Runs", `${AF}/core-concepts/dag-run.html`],
    ],
  }),
  g({
    slug: "airflow-backfill",
    topic: "Pipelines & scheduling",
    d: "medium",
    title: "What is a backfill, and what are the reprocessing options?",
    kw: ["backfill", "reprocess", "logical date", "max_active_runs", "dry run"],
    intent:
      "Checks that you can rerun a pipeline for past periods safely.",
    short:
      "Backfill is when you create runs for past dates of a Dag. You provide a Dag, a start date and an end date, and Airflow creates runs in that range according to the Dag's schedule, through the CLI or REST API. There are three reprocessing options. With none, if a run already exists for the logical date, no other is created whatever its state. With failed, a new run is created only if the existing run failed. With completed, a new run is created if the existing run is completed or failed. A run still running or queued is never duplicated.",
    detail: [
      "max_active_runs controls how many backfill runs execute concurrently.",
      "The --run-backwards option runs the latest dates first.",
      "A dry run prints the dates that would be considered.",
    ],
    ex: "After fixing a bug, the team backfills the last month of a daily Dag with the completed reprocessing behaviour.",
    mistakes: [
      "Backfilling a pipeline that is not idempotent and creating duplicates.",
      "Starting all runs at once and overloading the source.",
    ],
    follow: ["How do you make tasks safe to rerun?"],
    points: [
      "Create runs for past dates",
      "Reprocessing: none, failed, completed",
      "Control concurrency",
      "Dry run first",
    ],
    notes: "Backfill reruns past intervals; tasks must be idempotent.",
    src: [["Apache Airflow: Backfill", `${AF}/core-concepts/backfill.html`]],
  }),
  g({
    slug: "airflow-retries-default-args",
    topic: "Pipelines & scheduling",
    d: "medium",
    title: "How do you make pipeline tasks retry on failure in Airflow?",
    kw: ["retries", "retry_delay", "default_args", "failure", "timeout"],
    intent:
      "Checks that you can handle transient errors without manual reruns.",
    short:
      "In Airflow you set retries and retry_delay on a task, or for every task in a Dag through default_args. The tutorial's default_args example uses retries of 1 and a retry_delay of five minutes, and notes that these values are passed to each operator and can be overridden per task. A task is then retried automatically after a failure, which helps with temporary problems such as a brief network error. The Dag itself is not concerned with what happens inside tasks, only with how to run them: the order, how many times to retry, whether there are timeouts. Retries only help if the task is safe to run again.",
    detail: [
      "An execution_timeout stops a task that runs too long.",
      "Callbacks such as on_failure_callback can alert you when a task finally fails.",
      "Check the Dag Run status to see whether the whole run succeeded.",
    ],
    ex: "default_args={'retries': 3, 'retry_delay': timedelta(minutes=5)} retries every task up to three times.",
    mistakes: [
      "Retrying a non-idempotent load that then duplicates rows.",
      "Retrying forever instead of alerting someone.",
    ],
    follow: ["How do you alert on failure?"],
    points: [
      "retries and retry_delay",
      "default_args apply to all tasks",
      "Override per task",
      "Needs idempotent tasks",
    ],
    notes: "default_args = {'retries': n, 'retry_delay': ...}.",
    src: [
      ["Apache Airflow: Fundamentals tutorial", `${AF}/tutorial/fundamentals.html`],
      ["Apache Airflow: Dags", `${AF}/core-concepts/dags.html`],
    ],
  }),
  g({
    slug: "airflow-xcom-small-data",
    topic: "Pipelines & scheduling",
    d: "medium",
    title: "How do tasks share data in Airflow, and what is the limit?",
    kw: ["xcom", "xcom_push", "xcom_pull", "return_value", "taskflow"],
    intent:
      "Checks that you pass small values between tasks and keep big data in storage.",
    short:
      "Tasks are isolated by default and may run on different machines. XComs, short for cross-communications, are the mechanism that lets tasks talk to each other. An XCom is identified by a key, the task_id and the dag_id it came from, and can hold any serialisable value, but the documentation says they are only designed for small amounts of data and you should not use them to pass around large values like dataframes. Values are pushed and pulled with xcom_push and xcom_pull. Many operators auto-push their result under the key return_value, and with the TaskFlow API returning a value from an @task function passes it to the next task.",
    detail: [
      "For large data, write to storage such as a database or files and pass the location.",
      "XCom operations should be done through the task context.",
      "The TaskFlow tutorial builds an extract, transform, load pipeline this way.",
    ],
    ex: "The extract task writes a file and returns its path, and the transform task receives that path.",
    mistakes: [
      "Passing a whole DataFrame through XCom.",
      "Assuming tasks share memory.",
    ],
    follow: ["What is the TaskFlow API?"],
    points: [
      "XCom = cross-communication",
      "Small serialisable values only",
      "return_value is the default key",
      "Pass locations, not big data",
    ],
    notes: "Pass paths and ids through XCom, not datasets.",
    src: [
      ["Apache Airflow: XComs", `${AF}/core-concepts/xcoms.html`],
      ["Apache Airflow: TaskFlow tutorial", `${AF}/tutorial/taskflow.html`],
    ],
  }),
  g({
    slug: "airflow-sensors-wait-for-data",
    topic: "Pipelines & scheduling",
    d: "medium",
    title: "What is a sensor in Airflow, and what are poke and reschedule modes?",
    kw: ["sensor", "poke", "reschedule", "timeout", "wait for file"],
    intent:
      "Checks that you can make a pipeline wait for its input without wasting resources.",
    short:
      "Sensors are a special type of Operator designed to do exactly one thing: wait for something to occur. It can be time-based, a file arriving or an external event. The sensor waits until the thing happens and then succeeds so downstream tasks can run, or fails if it does not happen within the configured timeout, so you can be alerted. Because they are mostly idle, sensors have two modes. In poke mode, the default, the sensor takes up a worker slot for its entire runtime. In reschedule mode it takes a slot only when checking and sleeps between checks. The documentation says the trade-off is latency.",
    detail: [
      "A sensor checking every second should be in poke mode, while one checking every minute should be in reschedule mode.",
      "All sensors inherit from BaseSensorOperator and share common parameters such as the timeout.",
      "Deferrable operators and triggers are a further option.",
    ],
    ex: "The pipeline's first task waits for the day's export file to appear before extract starts.",
    mistakes: [
      "Using poke mode with a long interval and wasting a worker slot.",
      "Setting no timeout, so the Dag waits forever.",
    ],
    follow: ["How do you alert when data never arrives?"],
    points: [
      "Wait for an event",
      "Succeed or fail on timeout",
      "poke holds a slot; reschedule releases it",
      "Latency trade-off",
    ],
    notes: "Sensor = a task that waits.",
    src: [["Apache Airflow: Sensors", `${AF}/core-concepts/sensors.html`]],
  }),
  g({
    slug: "idempotent-pipelines",
    topic: "Pipelines & scheduling",
    d: "hard",
    title: "What does it mean for a pipeline task to be idempotent, and how do you achieve it?",
    kw: ["idempotent", "rerun", "upsert", "data interval", "overwrite partition"],
    intent:
      "Checks that you design runs that give the same result when repeated.",
    short:
      "An idempotent task gives the same final result no matter how many times it runs for the same input. This matters because pipelines are retried after failures and rerun in backfills. To achieve it, tie each run to its data interval instead of the current time, and make the load replace or merge, not blindly append. In PostgreSQL, an INSERT ... ON CONFLICT DO UPDATE upsert on a unique key gives an atomic insert-or-update outcome, so repeated loads do not duplicate rows. Another approach is to replace the whole slice for the run's interval inside one transaction, so a rerun overwrites the same rows.",
    detail: [
      "Airflow's logical date and data interval give each run a stable window.",
      "A transaction ensures a failed load leaves no partial rows.",
      "Test idempotence by running the same interval twice and comparing results.",
    ],
    ex: "A run for 2026-01-05 deletes and reloads only that day's rows in one transaction.",
    mistakes: [
      "Appending without a key, so each retry adds duplicates.",
      "Using 'now' inside a transform, making reruns differ.",
    ],
    follow: ["How do you test it?"],
    points: [
      "Same input, same result",
      "Window by data interval",
      "Upsert or replace the slice",
      "Use a transaction",
    ],
    notes: "Rerun-safe = keyed upsert or replace-the-slice.",
    src: [
      ["Apache Airflow: Dag Runs", `${AF}/core-concepts/dag-run.html`],
      ["PostgreSQL: INSERT", `${PG}/sql-insert.html`],
      ["PostgreSQL: Transactions", `${PG}/tutorial-transactions.html`],
    ],
  }),
  g({
    slug: "data-quality-constraints",
    topic: "Data quality checks",
    d: "medium",
    title: "How can database constraints act as data quality checks?",
    kw: ["constraints", "check constraint", "not null", "unique", "primary key"],
    intent:
      "Checks that you let the target enforce rules rather than relying only on code.",
    short:
      "SQL lets you define constraints on columns and tables, which give you as much control over data as you wish. If a user attempts to store data that would violate a constraint, an error is raised, even when the value came from a default. PostgreSQL supports check constraints, the most generic type, not-null constraints, unique constraints, primary keys, foreign keys and exclusion constraints. For example, a check can require a product price to be positive, a unique constraint means only one row per product number, and a foreign key ensures an order refers to an existing customer. Constraints in the target catch bad data that slips past pipeline code.",
    detail: [
      "A failed constraint stops the load transaction, so bad batches do not partially load.",
      "Unique constraints are also what ON CONFLICT upserts rely on.",
      "The PostgreSQL population guide lists removing foreign key constraints as one option for very large loads.",
    ],
    ex: "The orders table has NOT NULL on order_id, UNIQUE on order_id and CHECK (amount >= 0).",
    mistakes: [
      "Relying only on pipeline code and leaving the table unconstrained.",
      "Ignoring constraint errors by loading with errors suppressed.",
    ],
    follow: ["What checks would you run before loading?"],
    points: [
      "Constraints reject bad data",
      "CHECK, NOT NULL, UNIQUE, keys",
      "Errors stop the transaction",
      "Defence in depth",
    ],
    notes: "Let the database refuse invalid rows.",
    src: [["PostgreSQL: Constraints", `${PG}/ddl-constraints.html`]],
  }),
  g({
    slug: "data-quality-checks-in-pandas",
    topic: "Data quality checks",
    d: "medium",
    title: "What data quality checks would you run in a pandas transform step?",
    kw: ["data quality", "isna", "duplicated", "validate merge", "row counts"],
    intent:
      "Checks that you can name concrete, testable checks rather than 'clean the data'.",
    short:
      "Useful checks are specific and cheap. Missing values: isna shows how many values are missing in each column. Duplicates: duplicated marks rows that repeat across the key columns, and its sum should be zero for a unique key. Types and ranges: to_numeric and to_datetime with errors='coerce' turn unparseable values into NaN or NaT so you can count them. Joins: merge has a validate option that raises an error if the relationship is not what you expected, and indicator shows unmatched rows. Also compare row counts before and after each step and fail the task, rather than continue, when a check breaks.",
    detail: [
      "Log the counts so a drift over time is visible.",
      "Keep rejected rows in a separate table for inspection instead of discarding them silently.",
      "Run the same checks on the output before loading.",
    ],
    ex: "The transform asserts there are no duplicated order ids and that every order matched a customer.",
    mistakes: [
      "Writing checks that only print and never stop the pipeline.",
      "Checking only the input and not the output.",
    ],
    follow: ["How do checks fit into the schedule?"],
    points: [
      "Count missing values",
      "Check key uniqueness",
      "Coerce and count bad values",
      "Validate joins and row counts",
    ],
    notes: "Make each check a fail-or-pass test.",
    code: [
      "Simple fail-fast checks",
      `assert df["order_id"].is_unique
assert df["amount"].notna().all()
assert df["order_date"].notna().all()

merged = orders.merge(customers, on="customer_id", how="left",
                      validate="many_to_one", indicator=True)
assert (merged["_merge"] == "both").all()`,
      [
        "The first three lines check uniqueness and missing values.",
        "validate raises an error if the customers table has duplicate keys.",
        "indicator lets the last check find orders with no customer.",
      ],
      "python",
    ],
    src: [
      ["pandas: DataFrame.merge", `${PD}/pandas.DataFrame.merge.html`],
      ["pandas: DataFrame.duplicated", `${PD}/pandas.DataFrame.duplicated.html`],
      ["pandas: Working with missing data", `${PDG}/missing_data.html`],
      ["pandas: to_numeric", `${PD}/pandas.to_numeric.html`],
    ],
  }),
  g({
    slug: "monitoring-and-alerting-callbacks",
    topic: "Data quality checks",
    d: "hard",
    title: "How do you get alerted when a pipeline fails?",
    kw: ["callbacks", "on_failure_callback", "alerting", "monitoring", "dag run status"],
    intent:
      "Checks that failures are noticed and acted on, not found by a user days later.",
    short:
      "Airflow can run callbacks when a Dag or task changes state, such as on_failure_callback, which you can set in default_args as a function or a list of functions. A Dag Run's status is decided when all tasks reach terminal states: it is success if all leaf tasks are success or skipped, and failed if any leaf is failed or upstream_failed. The UI shows Dags whose latest run failed in a Failed tab. Sensors fail on timeout so that you are alerted through the usual mechanisms when data does not arrive. Combine task retries for transient errors with a callback that notifies someone when a task finally fails.",
    detail: [
      "A leaf task with trigger rule all_done runs regardless of upstream results, which can hide failures in the Dag Run status.",
      "Logs per task help locate the failing step.",
      "Alerts should say which Dag, task and data interval failed.",
    ],
    ex: "A failed load task calls a function that posts the Dag id and logical date to the team's channel.",
    mistakes: [
      "Using a trigger rule that marks the whole run successful despite a failure.",
      "Only alerting after retries have all been spent, with no context.",
    ],
    follow: ["How do retries relate to alerts?"],
    points: [
      "Callbacks on failure",
      "Dag Run status from leaf tasks",
      "Sensors fail on timeout",
      "Include run context in alerts",
    ],
    notes: "Retry transient errors, alert on final failure.",
    src: [
      ["Apache Airflow: Callbacks", `${AF}/administration-and-deployment/logging-monitoring/callbacks.html`],
      ["Apache Airflow: Dag Runs", `${AF}/core-concepts/dag-run.html`],
      ["Apache Airflow: Sensors", `${AF}/core-concepts/sensors.html`],
    ],
  }),
  g({
    slug: "credentials-connections-variables",
    topic: "Pipelines & scheduling",
    d: "medium",
    title: "How should a pipeline store database credentials and settings?",
    kw: ["connections", "variables", "secrets", "configuration", "credentials"],
    intent:
      "Checks that credentials are kept out of code.",
    short:
      "In Airflow, a Connection stores how to reach an external system, with the host, login and other details, so tasks refer to it by an id instead of embedding credentials in code. The Connections page in the documentation also describes testing a connection, including running the test on a worker so that credentials are only used where tasks use them. Variables are Airflow's runtime configuration concept: a general key/value store that is global, can be queried from tasks and can be set in the UI or uploaded as JSON. Keep secrets in connections, not in Dag files or version control.",
    detail: [
      "Variables are read with Variable.get inside tasks.",
      "Variables are Airflow's runtime configuration concept.",
      "A connection can be tested before use.",
    ],
    ex: "The load task opens the database through the connection 'warehouse_db' instead of a hard-coded password.",
    mistakes: [
      "Hard-coding a password in the Dag file.",
      "Putting secrets in a plain variable.",
    ],
    follow: ["What else belongs in configuration, not code?"],
    points: [
      "Connections hold access details",
      "Variables hold runtime settings",
      "Refer by id",
      "Keep secrets out of code",
    ],
    notes: "Tasks use a connection id, never a literal password.",
    src: [
      ["Apache Airflow: Managing Connections", `${AF}/howto/connection.html`],
      ["Apache Airflow: Variables", `${AF}/core-concepts/variables.html`],
    ],
  }),
])
