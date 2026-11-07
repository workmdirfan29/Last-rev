import { defineQuestions } from "../author"
import { g } from "../brief"

const M = "https://www.mongodb.com/docs/manual"
const OP = `${M}/reference/operator/aggregation`
const MG = "https://mongoosejs.com/docs"

export default defineQuestions("mongodb", "fresher", [
  g({
    slug: "what-is-mongodb",
    topic: "Document modelling",
    d: "easy",
    title:
      "What is MongoDB and how is it different from a relational database?",
    kw: ["mongodb", "document database", "nosql", "bson", "collection"],
    intent:
      "Checks that you understand the document model and not only the word NoSQL.",
    short:
      "MongoDB is a document database. It stores data as documents, which are JSON-like records with named fields, grouped into collections instead of tables. Documents in one collection can have different fields, and a field can hold arrays and nested documents, so related data can live together in one record. A relational database spreads data over tables with a fixed schema and joins them with foreign keys.",
    detail: [
      "A document is stored in BSON, a binary format that adds types such as dates and ObjectId to JSON.",
      "MongoDB supports queries, indexes, aggregation, and transactions, so it is more than a key-value store.",
      "Neither model is better in general. The choice depends on the shape of the data and how it is read.",
    ],
    ex: "A product document holds its name, price, tags and an array of reviews in one record, so one read returns everything a product page needs.",
    mistakes: [
      "Saying that MongoDB has no schema at all, when you still design the structure of your documents.",
      "Treating it as a relational database and normalising everything into many collections.",
    ],
    follow: ["What is BSON?"],
    points: [
      "Documents in collections",
      "Flexible fields, nested data and arrays",
      "Queries, indexes, aggregation and transactions",
    ],
    notes:
      "Document database: BSON documents in collections, related data can be nested.",
    src: [
      ["MongoDB Manual: Introduction", `${M}/introduction/`],
      ["MongoDB Manual: Documents", `${M}/core/document/`],
    ],
  }),
  g({
    slug: "documents-collections-bson",
    topic: "Document modelling",
    d: "easy",
    title: "What are a database, a collection and a document? What is `_id`?",
    kw: ["document", "collection", "database", "_id", "ObjectId"],
    intent: "Checks the basic vocabulary and the primary key.",
    short:
      "A MongoDB server holds databases. A database holds collections, which are groups of documents and are roughly like tables. A document is one record of field and value pairs. Every document has an `_id` field that is unique within its collection and acts as the primary key. If you do not provide it, MongoDB generates an `ObjectId`, a 12-byte value that includes a timestamp.",
    detail: [
      "Collections are created automatically the first time you insert into them.",
      "A single document can be at most 16 MiB, so very large or fast-growing data should not live in one document.",
      "The `_id` can be any type except an array, but an ObjectId is the default.",
    ],
    ex: "In a `shop` database, the `orders` collection holds one document per order, each with its own `_id`.",
    code: [
      "A document",
      '{\n  _id: ObjectId("66a1f0c2b7a1d2e3f4a5b6c7"),\n  name: "Notebook",\n  price: 120,\n  tags: ["paper", "office"],\n  stock: { warehouse: 40, shop: 5 }\n}',
      [
        "`_id` is the unique key. Here it is an ObjectId.",
        "`tags` is an array and `stock` is a nested document.",
      ],
      "javascript",
    ],
    mistakes: [
      "Forgetting that `_id` is unique and trying to insert two documents with the same value.",
      "Thinking a collection enforces the same fields on every document by default.",
    ],
    follow: ["How big can a document be?"],
    points: [
      "Database → collections → documents",
      "_id is unique and required",
      "Default _id is an ObjectId",
    ],
    notes: "Every document has a unique `_id`; the default is an ObjectId.",
    src: [
      [
        "MongoDB Manual: Databases and Collections",
        `${M}/core/databases-and-collections/`,
      ],
      ["MongoDB Manual: Documents", `${M}/core/document/`],
    ],
  }),
  g({
    slug: "embed-or-reference",
    topic: "Document modelling",
    d: "medium",
    title: "When do you embed data and when do you reference it?",
    kw: [
      "embedding",
      "referencing",
      "data modelling",
      "one-to-many",
      "denormalisation",
    ],
    intent: "Checks the central MongoDB design decision.",
    short:
      "Embed related data inside the parent document when it is read together with the parent, is owned by it, and stays small and bounded, such as the addresses of a user. This gives one read and an atomic update. Use references, storing the `_id` of the other document, when the related data is large, grows without limit, is shared by many documents, or changes on its own. References need a second query or a `$lookup`.",
    detail: [
      "Embedding makes reads fast but duplicates data if the same item is embedded in many places.",
      "A very large array inside a document is a warning sign, because documents have a size limit and big arrays slow updates.",
      "Design for how the application queries the data, not only for how it is related.",
    ],
    ex: "A blog post embeds its few tags but references its author, because many posts share an author whose details change.",
    mistakes: [
      "Embedding an array that can grow without limit, such as every comment ever written.",
      "Referencing everything and ending up with many round trips, like in a relational design.",
    ],
    follow: ["What is the size limit of a document?"],
    points: [
      "Embed: read together, bounded, owned",
      "Reference: large, shared, unbounded",
      "Model for the queries you run",
    ],
    notes:
      "Embed small bounded data read together. Reference big, shared or growing data.",
    src: [
      ["MongoDB Manual: Data Modeling", `${M}/data-modeling/`],
      ["MongoDB Manual: Documents (size limit)", `${M}/core/document/`],
    ],
  }),
  g({
    slug: "one-to-many-modelling",
    topic: "Document modelling",
    d: "medium",
    title: "How do you model a one-to-many relationship in MongoDB?",
    kw: [
      "one-to-many",
      "embedded array",
      "parent reference",
      "child reference",
      "model",
    ],
    intent: "Checks that you have more than one pattern to choose from.",
    short:
      "There are three common patterns. Embed the many side as an array in the parent, which works when there are few and they are read with the parent. Store an array of references in the parent, which fits a modest number of children that are used on their own. Store the parent's `_id` in each child, which is the safe choice when the number of children is large or unlimited. The choice depends on how many children there are and how they are queried.",
    detail: [
      "A parent reference in each child, such as `userId` on every order, never makes the parent document grow.",
      "An index on the reference field keeps the lookup of children fast.",
      "A hybrid is common, for example embedding the last five comments and referencing the rest.",
    ],
    ex: "A user has thousands of orders, so each order stores `userId`, and an index on `userId` returns a user's orders quickly.",
    code: [
      "Child holds the parent id",
      'db.orders.insertOne({\n  userId: ObjectId("66a1f0c2b7a1d2e3f4a5b6c7"),\n  total: 540,\n  items: [{ sku: "NB-1", qty: 2 }]\n})\ndb.orders.createIndex({ userId: 1 })\ndb.orders.find({ userId: ObjectId("66a1f0c2b7a1d2e3f4a5b6c7") })',
      [
        "Each order stores the id of its user.",
        "The index makes the lookup by `userId` efficient.",
        "The order's own items are embedded because they belong to it.",
      ],
      "javascript",
    ],
    mistakes: [
      "Putting thousands of children into one array in the parent.",
      "Forgetting the index on the reference field.",
    ],
    follow: ["How do you join documents from two collections?"],
    points: [
      "Embed few children",
      "Array of references for a modest number",
      "Parent id in each child for many",
    ],
    notes:
      "Few → embed. Many → store the parent id in each child and index it.",
    src: [
      ["MongoDB Manual: Data Modeling", `${M}/data-modeling/`],
      ["MongoDB Manual: Indexes", `${M}/indexes/`],
    ],
  }),
  g({
    slug: "schema-validation",
    topic: "Document modelling",
    d: "medium",
    title: "Does MongoDB have a schema? What is schema validation?",
    kw: [
      "schema validation",
      "$jsonSchema",
      "validator",
      "flexible schema",
      "validationAction",
    ],
    intent:
      "Checks that you know flexibility is a choice and not a lack of rules.",
    short:
      "MongoDB does not force every document in a collection to have the same fields, but you can enforce rules with schema validation. You attach a validator to a collection, often written with `$jsonSchema`, that states required fields, types and ranges. Inserts and updates that break the rules are rejected, or only logged, depending on `validationAction`. This gives a flexible schema where it helps, and strict rules where the data must be reliable.",
    detail: [
      "Validation applies to inserts and updates after the validator is set.",
      "Existing documents are checked when they are updated, depending on `validationLevel`.",
      "Application-level validation, for example with Mongoose, is a separate layer and does not replace this.",
    ],
    ex: "The `users` collection requires an `email` string and an `age` of at least 0, so a bad insert is rejected by the database itself.",
    code: [
      "A validator",
      'db.createCollection("users", {\n  validator: {\n    $jsonSchema: {\n      bsonType: "object",\n      required: ["email"],\n      properties: {\n        email: { bsonType: "string" },\n        age: { bsonType: "int", minimum: 0 }\n      }\n    }\n  }\n})',
      [
        "`required` lists the fields that must exist.",
        "`properties` sets a type and a minimum for each field.",
        "Documents that do not match are rejected by default.",
      ],
      "javascript",
    ],
    mistakes: [
      "Saying that MongoDB can never enforce structure.",
      "Relying on checks in the client only.",
    ],
    follow: ["How does Mongoose validation differ from this?"],
    points: [
      "Flexible by default",
      "$jsonSchema validator per collection",
      "validationAction: error or warn",
    ],
    notes:
      "Flexible schema by default; enforce rules with a `$jsonSchema` validator.",
    src: [
      ["MongoDB Manual: Schema Validation", `${M}/core/schema-validation/`],
      ["MongoDB Manual: Data Modeling", `${M}/data-modeling/`],
    ],
  }),
  g({
    slug: "crud-basics",
    topic: "Document modelling",
    d: "easy",
    title: "How do you create, read, update and delete documents in MongoDB?",
    kw: ["insertOne", "find", "updateOne", "deleteOne", "crud"],
    intent: "Checks that you can use the basic shell methods.",
    short:
      "Use `insertOne` or `insertMany` to create, `find` or `findOne` with a filter to read, `updateOne` or `updateMany` with an update operator such as `$set` to change, and `deleteOne` or `deleteMany` to remove. The first argument is a filter that chooses which documents to act on. An update without an operator like `$set` is not allowed in `updateOne`, because it would be unclear whether to replace the whole document.",
    detail: [
      "`replaceOne` swaps a whole document, keeping its `_id`.",
      "Write methods return a result object with counts such as `matchedCount` and `modifiedCount`.",
      "An empty filter `{}` matches every document, so be careful with `deleteMany({})`.",
    ],
    ex: "A shop inserts a product, finds the ones under 500, raises one price with `$set`, and deletes a discontinued one.",
    code: [
      "The four operations",
      'db.products.insertOne({ name: "Pen", price: 10, stock: 100 })\ndb.products.find({ price: { $lt: 500 } })\ndb.products.updateOne({ name: "Pen" }, { $set: { price: 12 } })\ndb.products.deleteOne({ name: "Pen" })',
      [
        "`insertOne` creates the document.",
        "`find` takes a filter with a query operator.",
        "`updateOne` changes only the `price` field.",
        "`deleteOne` removes the first match.",
      ],
      "javascript",
    ],
    mistakes: [
      "Running `deleteMany` or `updateMany` with a filter that matches more than intended.",
      "Forgetting the update operator and replacing a whole document.",
    ],
    follow: ["What is upsert?"],
    points: [
      "insert, find, update, delete",
      "First argument is the filter",
      "Update with operators like $set",
    ],
    notes: "`insertOne`, `find`, `updateOne` with `$set`, `deleteOne`.",
    src: [
      ["MongoDB Manual: Insert Documents", `${M}/tutorial/insert-documents/`],
      ["MongoDB Manual: Query Documents", `${M}/tutorial/query-documents/`],
      ["MongoDB Manual: Update Documents", `${M}/tutorial/update-documents/`],
      ["MongoDB Manual: Delete Documents", `${M}/tutorial/remove-documents/`],
    ],
  }),
  g({
    slug: "query-operators",
    topic: "Document modelling",
    d: "easy",
    title:
      "Which query operators do you use most when filtering? ($gt, $in, $or)",
    kw: ["$gt", "$in", "$or", "$and", "query operators"],
    intent: "Checks that you can build filters beyond simple equality.",
    short:
      "A filter with several fields is an AND by default. Comparison operators include `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in` for a list of allowed values and `$nin` for the opposite. Logical operators `$and`, `$or`, `$nor` and `$not` combine conditions. `$exists` checks whether a field is present, and dot notation such as `address.city` reaches into nested fields.",
    detail: [
      "`$or` takes an array of conditions and matches if any of them match.",
      "Querying an array field with a plain value matches documents where the array contains that value.",
      "`$regex` does pattern matching, but a pattern that starts with a wildcard cannot use an index well.",
    ],
    ex: "A shop finds products that cost under 500 and are in stock, or are flagged as featured.",
    code: [
      "Combining conditions",
      'db.products.find({\n  $or: [\n    { price: { $lt: 500 }, stock: { $gt: 0 } },\n    { featured: true }\n  ],\n  category: { $in: ["pens", "paper"] }\n})',
      [
        "Fields in one object are combined with AND.",
        "`$or` matches either branch.",
        "`$in` allows any value in the list.",
      ],
      "javascript",
    ],
    mistakes: [
      "Writing two conditions for the same field as duplicate keys, so the second one overwrites the first.",
      "Expecting `$or` to be written as an object instead of an array.",
    ],
    follow: ["How do you query a nested field?"],
    points: [
      "Several fields mean AND",
      "$in for a list of values",
      "$or takes an array",
      "Dot notation for nested fields",
    ],
    notes: "Comparison: `$gt`, `$in`. Logical: `$and`, `$or`. Nested: `a.b`.",
    src: [
      ["MongoDB Manual: Query Operators", `${M}/reference/operator/query/`],
      ["MongoDB Manual: Query Documents", `${M}/tutorial/query-documents/`],
    ],
  }),
  g({
    slug: "update-operators-and-upsert",
    topic: "Document modelling",
    d: "medium",
    title:
      "What are update operators like `$set`, `$inc` and `$push`? What is upsert?",
    kw: ["$set", "$inc", "$push", "$unset", "upsert"],
    intent:
      "Checks that you update fields atomically instead of rewriting documents.",
    short:
      "Update operators change parts of a document in place. `$set` sets a field, `$unset` removes it, `$inc` adds to a number, `$push` appends to an array, `$pull` removes matching items from an array, and `$addToSet` adds only if the value is not already there. `upsert: true` makes an update insert a new document when nothing matches the filter. A single-document update is atomic, so `$inc` is safe against two requests at once.",
    detail: [
      "Using `$inc` is safer than reading a value, adding in your code and writing it back, which can lose updates.",
      "`$push` with `$each` adds several items in one operation.",
      "With an upsert, the new document is built from the filter's equality fields plus the update.",
    ],
    ex: "A page counter uses `$inc` so that two visitors at the same time both count.",
    code: [
      "Update operators and upsert",
      'db.stats.updateOne(\n  { page: "home" },\n  { $inc: { views: 1 }, $set: { last: new Date() } },\n  { upsert: true }\n)\ndb.users.updateOne({ _id: 1 }, { $push: { tags: "new" } })',
      [
        "`$inc` adds one to `views` atomically.",
        "`upsert` creates the document if `home` does not exist yet.",
        "`$push` appends to the `tags` array.",
      ],
      "javascript",
    ],
    mistakes: [
      "Reading, changing and saving a counter in application code, which loses updates.",
      "Using `$push` when you need no duplicates, where `$addToSet` is the right operator.",
    ],
    follow: ["Is a single-document update atomic?"],
    points: [
      "$set, $unset, $inc, $push, $pull",
      "upsert inserts when nothing matches",
      "Single-document updates are atomic",
    ],
    notes: "Use `$inc` for counters and `upsert: true` for create-or-update.",
    src: [
      ["MongoDB Manual: Update Operators", `${M}/reference/operator/update/`],
      ["MongoDB Manual: Update Documents", `${M}/tutorial/update-documents/`],
    ],
  }),
  g({
    slug: "projection-sort-pagination",
    topic: "Document modelling",
    d: "medium",
    title: "How do you choose fields, sort and paginate results?",
    kw: ["projection", "sort", "limit", "skip", "pagination"],
    intent: "Checks that you can shape a result and page through it sensibly.",
    short:
      "A projection, the second argument of `find`, chooses which fields to return, such as `{ name: 1, price: 1 }`, and it returns less data. `sort({ price: 1 })` orders ascending, and `-1` is descending. `limit(n)` caps the number of documents, and `skip(n)` skips the first n. Skip-based paging gets slower as the offset grows, because the server still walks past the skipped documents. For large collections, page with a range filter on an indexed field, such as `_id` greater than the last one seen.",
    detail: [
      "A projection with `1` fields includes only those fields and `_id`, unless you set `_id: 0`.",
      "Sorting on an indexed field can use the index instead of sorting in memory.",
      "A stable sort needs a tie-breaker field, such as `_id`, so pages do not overlap.",
    ],
    ex: "A product list shows 20 items per page, sorted by `_id`, and the next page asks for items with an `_id` greater than the last one.",
    code: [
      "Range-based paging",
      "db.products\n  .find({ _id: { $gt: lastId } }, { name: 1, price: 1 })\n  .sort({ _id: 1 })\n  .limit(20)",
      [
        "The filter starts after the last document of the previous page.",
        "The projection returns only two fields.",
        "Sort and limit give a stable page of 20.",
      ],
      "javascript",
    ],
    mistakes: [
      "Using a huge `skip` on a big collection.",
      "Sorting on a non-indexed field for large results.",
    ],
    follow: ["How does an index help a sort?"],
    points: [
      "Projection reduces returned fields",
      "sort, limit, skip",
      "Range paging scales better than skip",
    ],
    notes:
      "Project fields, sort with an index, and page by range instead of a big skip.",
    src: [
      [
        "MongoDB Manual: Project Fields",
        `${M}/tutorial/project-fields-from-query-results/`,
      ],
      ["MongoDB Manual: cursor.sort()", `${M}/reference/method/cursor.sort/`],
    ],
  }),
  g({
    slug: "aggregation-pipeline-basics",
    topic: "Aggregation",
    d: "medium",
    title: "What is the aggregation pipeline?",
    kw: ["aggregation pipeline", "stage", "$match", "$group", "aggregate"],
    intent: "Checks that you understand the staged way of processing data.",
    short:
      "The aggregation pipeline processes documents through an ordered list of stages. Each stage takes the documents from the previous one and transforms them, for example `$match` to filter, `$group` to summarise, `$sort`, `$project` to reshape and `$limit`. It is used for reports and calculations that a simple `find` cannot do, such as totals per category, and it runs inside the database.",
    detail: [
      "The order of stages matters, because each stage works on the output of the one before.",
      "Put `$match` first when you can, so that fewer documents flow through the later stages and an index can be used.",
      "Aggregation can also join collections with `$lookup` and write results with `$out` or `$merge`.",
    ],
    ex: "A report counts orders per day for the last month and sorts them by day.",
    code: [
      "A small pipeline",
      'db.orders.aggregate([\n  { $match: { status: "paid" } },\n  { $group: { _id: "$userId", total: { $sum: "$amount" } } },\n  { $sort: { total: -1 } },\n  { $limit: 5 }\n])',
      [
        "`$match` keeps only paid orders.",
        "`$group` adds up the amounts for each user.",
        "`$sort` and `$limit` return the five biggest customers.",
      ],
      "javascript",
    ],
    mistakes: [
      "Putting `$match` late in the pipeline, so more documents than needed are processed.",
      "Writing the pipeline in application code by loading all documents first.",
    ],
    follow: ["How does $group work?"],
    points: [
      "Ordered stages",
      "$match early, then group and sort",
      "Runs inside the database",
    ],
    notes:
      "Pipeline = ordered stages. `$match` first, then `$group`, `$sort`, `$limit`.",
    src: [
      [
        "MongoDB Manual: Aggregation Pipeline",
        `${M}/core/aggregation-pipeline/`,
      ],
      [
        "MongoDB Manual: Pipeline Optimization",
        `${M}/core/aggregation-pipeline-optimization/`,
      ],
    ],
  }),
  g({
    slug: "group-stage",
    topic: "Aggregation",
    d: "medium",
    title: "How does the `$group` stage work?",
    kw: ["$group", "$sum", "$avg", "accumulator", "group by"],
    intent: "Checks that you can summarise data per key.",
    short:
      '`$group` collects documents that share the same value of its `_id` expression and computes values for each group with accumulators such as `$sum`, `$avg`, `$min`, `$max`, `$push` and `$first`. The `_id` is the grouping key, written with a field path like `"$category"`. Using `_id: null` puts all documents in one group, which gives totals for the whole input. The output has one document per group.',
    detail: [
      "`$sum: 1` counts the documents in each group.",
      "The output order of groups is not guaranteed, so add `$sort` if you need an order.",
      "A group can be formed from several fields by using an object as the `_id`.",
    ],
    ex: "Group sales by category and return the number of sales and their average price.",
    code: [
      "Count and average per category",
      'db.sales.aggregate([\n  { $group: {\n      _id: "$category",\n      count: { $sum: 1 },\n      avgPrice: { $avg: "$price" }\n  } }\n])',
      [
        "Each distinct `category` becomes one output document.",
        "`$sum: 1` counts the documents in the group.",
        "`$avg` averages the `price` values.",
      ],
      "javascript",
    ],
    mistakes: [
      "Forgetting the `$` before the field name in the field path.",
      "Assuming groups come out in a sorted order.",
    ],
    follow: ["How do you group on two fields?"],
    points: [
      "_id is the group key",
      "Accumulators: $sum, $avg, $max, $push",
      "_id: null groups everything",
    ],
    notes: "`$group`: `_id` is the key, accumulators compute per group.",
    src: [
      ["MongoDB Manual: $group", `${OP}/group/`],
      [
        "MongoDB Manual: Aggregation Pipeline",
        `${M}/core/aggregation-pipeline/`,
      ],
    ],
  }),
  g({
    slug: "lookup-join",
    topic: "Aggregation",
    d: "medium",
    title: "How do you join collections in MongoDB? What does `$lookup` do?",
    kw: ["$lookup", "join", "left outer join", "localField", "foreignField"],
    intent: "Checks that you know the join exists and its cost.",
    short:
      "`$lookup` is an aggregation stage that does a left outer join with another collection. For each input document it finds the documents in the other collection where `localField` equals `foreignField`, and adds them to an array field named by `as`. If nothing matches, the array is empty. It is useful, but joins are slower than reading embedded data, so the data model should avoid needing one on every request.",
    detail: [
      "An index on the `foreignField` keeps the join efficient.",
      "`$unwind` after `$lookup` turns the array into one document per match.",
      "A newer form of `$lookup` accepts a sub-pipeline for more complex conditions.",
    ],
    ex: "Orders are joined with `users` so that each order shows the name of the customer.",
    code: [
      "Join orders with users",
      'db.orders.aggregate([\n  { $lookup: {\n      from: "users",\n      localField: "userId",\n      foreignField: "_id",\n      as: "customer"\n  } },\n  { $unwind: "$customer" }\n])',
      [
        "`from` is the collection to join.",
        "Matching `userId` with the user `_id` fills the `customer` array.",
        "`$unwind` flattens it into a single object.",
      ],
      "javascript",
    ],
    mistakes: [
      "Using `$lookup` everywhere instead of modelling data that is read together as embedded data.",
      "Joining on a field with no index on large collections.",
    ],
    follow: ["What does $unwind do?"],
    points: [
      "Left outer join stage",
      "Result goes into an array field",
      "Index the foreign field",
    ],
    notes:
      "`$lookup` = left outer join into an array; follow with `$unwind` if needed.",
    src: [
      ["MongoDB Manual: $lookup", `${OP}/lookup/`],
      ["MongoDB Manual: $unwind", `${OP}/unwind/`],
    ],
  }),
  g({
    slug: "project-and-unwind",
    topic: "Aggregation",
    d: "medium",
    title: "What do `$project`, `$unwind` and `$addFields` do?",
    kw: ["$project", "$unwind", "$addFields", "reshape", "array"],
    intent: "Checks that you can reshape documents in a pipeline.",
    short:
      "`$project` chooses which fields to keep or computes new ones, so it reshapes each document. `$addFields` adds or overwrites fields but keeps all the others. `$unwind` takes an array field and outputs one document for each element, which lets later stages such as `$group` work on the elements. A document whose array is empty or missing is dropped by `$unwind` unless you keep it with `preserveNullAndEmptyArrays`.",
    detail: [
      "`$project` with `1` keeps a field and with `0` removes one.",
      "After `$unwind`, the array field holds a single element in each output document.",
      "A common pattern is `$unwind` on `items`, then `$group` to total each item.",
    ],
    ex: "To count how often each tag appears, unwind `tags`, then group by tag.",
    code: [
      "Count tags",
      'db.posts.aggregate([\n  { $unwind: "$tags" },\n  { $group: { _id: "$tags", posts: { $sum: 1 } } },\n  { $sort: { posts: -1 } }\n])',
      [
        "`$unwind` makes one document per tag.",
        "`$group` counts the documents for each tag.",
        "`$sort` shows the most used tags first.",
      ],
      "javascript",
    ],
    mistakes: [
      "Forgetting that `$unwind` removes documents whose array is empty.",
      "Using `$project` and accidentally dropping fields that later stages need.",
    ],
    follow: ["How do you keep documents with empty arrays when unwinding?"],
    points: [
      "$project reshapes",
      "$addFields keeps other fields",
      "$unwind: one document per array element",
    ],
    notes:
      "`$unwind` + `$group` counts array items. `$addFields` keeps everything else.",
    src: [
      ["MongoDB Manual: $unwind", `${OP}/unwind/`],
      ["MongoDB Manual: $project", `${OP}/project/`],
      ["MongoDB Manual: $addFields", `${OP}/addFields/`],
    ],
  }),
  g({
    slug: "find-vs-aggregate",
    topic: "Aggregation",
    d: "easy",
    title: "When do you use `find` and when do you use `aggregate`?",
    kw: ["find", "aggregate", "pipeline", "report", "query"],
    intent: "Checks that you pick the simplest tool that does the job.",
    short:
      "Use `find` to read documents that match a filter, with optional projection, sort and limit. It is simple and fast for plain lookups. Use `aggregate` when you must transform or summarise the data: grouping, calculating totals, joining collections, reshaping fields or unwinding arrays. Everything `find` does can be done with `$match`, `$sort`, `$project` and `$limit`, but `find` is clearer when that is all you need.",
    detail: [
      "Aggregation can compute values inside the database, which avoids sending all documents to the application.",
      "Both can use indexes for the first matching and sorting stages.",
      "Keep the pipeline readable and add comments for the stages that are not obvious.",
    ],
    ex: "Showing one user's profile uses `find`, while a monthly revenue report per product uses `aggregate`.",
    mistakes: [
      "Loading a whole collection into the application to calculate a total.",
      "Using a long pipeline when a single `find` would do.",
    ],
    follow: ["How do you make an aggregation fast?"],
    points: [
      "find: filter and fetch",
      "aggregate: transform and summarise",
      "Compute in the database, not the app",
    ],
    notes: "`find` for lookups, `aggregate` for totals, joins and reshaping.",
    src: [
      ["MongoDB Manual: Aggregation", `${M}/aggregation/`],
      ["MongoDB Manual: Query Documents", `${M}/tutorial/query-documents/`],
    ],
  }),
  g({
    slug: "why-indexes",
    topic: "Indexes",
    d: "easy",
    title: "What is an index in MongoDB and why do you need one?",
    kw: ["index", "collection scan", "createIndex", "performance", "b-tree"],
    intent: "Checks that you know why queries get slow without indexes.",
    short:
      "An index is a separate, sorted data structure on one or more fields that lets MongoDB find matching documents without reading the whole collection. Without a usable index, a query does a collection scan and looks at every document, which gets slower as the data grows. With an index on the filtered field, MongoDB reads only the relevant entries. `createIndex({ field: 1 })` builds an ascending index.",
    detail: [
      "Every collection has a default unique index on `_id`.",
      "Indexes speed up reads, filters, sorts and joins on the indexed fields, but they cost storage and slow writes a little.",
      "Create indexes for the queries your application actually runs.",
    ],
    ex: "Searching a million users by `email` takes a collection scan until an index is added on `email`.",
    code: [
      "Add and check an index",
      'db.users.createIndex({ email: 1 })\ndb.users.find({ email: "asha@example.com" }).explain("executionStats")',
      [
        "`createIndex` builds an ascending index on `email`.",
        "`explain` shows whether the query used it.",
      ],
      "javascript",
    ],
    mistakes: [
      "Adding indexes on every field, which makes writes slower and uses memory.",
      "Never checking whether a slow query uses an index.",
    ],
    follow: ["How do you see whether a query uses an index?"],
    points: [
      "Avoids collection scans",
      "Costs storage and write speed",
      "_id is indexed by default",
    ],
    notes: "Index the fields you filter and sort on; check with `explain`.",
    src: [
      ["MongoDB Manual: Indexes", `${M}/indexes/`],
      [
        "MongoDB Manual: cursor.explain()",
        `${M}/reference/method/cursor.explain/`,
      ],
    ],
  }),
  g({
    slug: "compound-index-and-esr",
    topic: "Indexes",
    d: "hard",
    title: "What is a compound index and does the field order matter?",
    kw: ["compound index", "index prefix", "ESR rule", "sort", "field order"],
    intent:
      "Checks that you understand how the order of fields decides what an index can serve.",
    short:
      "A compound index covers several fields, for example `{ status: 1, createdAt: -1 }`. The order matters. The index supports queries on its leading fields, the prefix, so one on `{ a, b }` can serve a query on `a` or on `a` and `b`, but not on `b` alone. A useful guideline is the ESR rule: put fields tested for equality first, then the field you sort on, then fields used with a range such as `$gt`.",
    detail: [
      "A compound index can serve filter and sort together, so no in-memory sort is needed.",
      "One compound index often replaces several single-field indexes.",
      "Check the real behaviour with `explain`, because the planner considers the query shape.",
    ],
    ex: "A query for paid orders sorted by date uses `{ status: 1, createdAt: -1 }`, with the equality field first and the sort field second.",
    code: [
      "A compound index for a filter and sort",
      'db.orders.createIndex({ status: 1, createdAt: -1 })\ndb.orders.find({ status: "paid" }).sort({ createdAt: -1 })',
      [
        "`status` is tested for equality, so it comes first.",
        "`createdAt` is used for sorting, so it follows.",
        "The query can use the index for both the filter and the order.",
      ],
      "javascript",
    ],
    mistakes: [
      "Expecting an index on `{ a, b }` to help a query that filters only on `b`.",
      "Putting a range field before the sort field and losing the index sort.",
    ],
    follow: ["What is an index prefix?"],
    points: [
      "Order of fields matters",
      "Supports prefixes of the key",
      "ESR: Equality, Sort, Range",
    ],
    notes:
      "Compound index: equality fields, then sort field, then range fields.",
    src: [
      [
        "MongoDB Manual: Compound Indexes",
        `${M}/core/indexes/index-types/index-compound/`,
      ],
      ["MongoDB Manual: ESR Rule", `${M}/tutorial/equality-sort-range-rule/`],
    ],
  }),
  g({
    slug: "explain-a-query",
    topic: "Indexes",
    d: "medium",
    title: "How do you check whether a query uses an index? (`explain`)",
    kw: ["explain", "COLLSCAN", "IXSCAN", "executionStats", "query plan"],
    intent: "Checks that you measure instead of guessing about performance.",
    short:
      '`explain()` shows how MongoDB runs a query. With `explain("executionStats")` you see the winning plan, and the stage names tell you what happened: `COLLSCAN` means a full collection scan, while `IXSCAN` means an index was used. The stats also give `totalDocsExamined`, `totalKeysExamined` and `nReturned`. If many more documents are examined than returned, the query needs a better index.',
    detail: [
      "The ratio of examined to returned documents is a quick sign of an inefficient query.",
      "A `SORT` stage in the plan means an in-memory sort that an index could avoid.",
      "Re-run `explain` after adding an index to confirm the change.",
    ],
    ex: "A search reads 500,000 documents to return 10. After adding an index it examines only 10.",
    code: [
      "Reading an explain result",
      'db.orders.find({ status: "paid" }).explain("executionStats")\n// look at: winningPlan.stage (COLLSCAN or IXSCAN)\n//          executionStats.totalDocsExamined\n//          executionStats.nReturned',
      [
        "A `COLLSCAN` would mean there is no usable index.",
        "`totalDocsExamined` close to `nReturned` is efficient.",
      ],
      "javascript",
    ],
    mistakes: [
      "Adding indexes by guessing and never reading the plan.",
      "Ignoring a `SORT` stage on a large result.",
    ],
    follow: ["What does a COLLSCAN mean?"],
    points: [
      "COLLSCAN: no index used",
      "IXSCAN: index used",
      "Compare docs examined and returned",
    ],
    notes:
      "`explain('executionStats')`: look for IXSCAN and a small examined/returned ratio.",
    src: [
      [
        "MongoDB Manual: cursor.explain()",
        `${M}/reference/method/cursor.explain/`,
      ],
      ["MongoDB Manual: Indexes", `${M}/indexes/`],
    ],
  }),
  g({
    slug: "unique-and-ttl-indexes",
    topic: "Indexes",
    d: "medium",
    title: "What are unique and TTL indexes?",
    kw: [
      "unique index",
      "TTL index",
      "expireAfterSeconds",
      "duplicate key",
      "E11000",
    ],
    intent: "Checks that you know indexes can enforce rules and expire data.",
    short:
      "A unique index rejects a second document with the same value in the indexed field, such as an email, with a duplicate key error (code 11000). A TTL index, created with `expireAfterSeconds` on a date field, makes MongoDB remove documents automatically once that date is older than the given time. It suits sessions, one-time codes and temporary logs.",
    detail: [
      "A unique index is the only reliable way to prevent duplicates, because a check in application code can race.",
      "A TTL index works on a single date field, and the background task that deletes expired documents runs about once a minute, so removal is not instant.",
      "A document missing the indexed field is treated as having a null value, which matters for unique indexes.",
    ],
    ex: "A `users` collection has a unique index on `email`, and a `sessions` collection expires documents one hour after `createdAt`.",
    code: [
      "Unique and TTL",
      "db.users.createIndex({ email: 1 }, { unique: true })\ndb.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })",
      [
        "The first index makes duplicate emails fail.",
        "The second one removes sessions about an hour after `createdAt`.",
      ],
      "javascript",
    ],
    mistakes: [
      "Checking for duplicates in code only, which can race when two requests arrive together.",
      "Expecting TTL deletion to happen at the exact second.",
    ],
    follow: ["What error does a duplicate key give?"],
    points: [
      "Unique index prevents duplicates",
      "TTL removes old documents",
      "TTL deletion is not instant",
    ],
    notes:
      "Unique for emails, TTL (`expireAfterSeconds`) for sessions and temporary data.",
    src: [
      ["MongoDB Manual: Unique Indexes", `${M}/core/index-unique/`],
      ["MongoDB Manual: TTL Indexes", `${M}/core/index-ttl/`],
    ],
  }),
  g({
    slug: "index-tradeoffs",
    topic: "Indexes",
    d: "medium",
    title: "What does an index cost? Why not index every field?",
    kw: [
      "index cost",
      "write performance",
      "memory",
      "too many indexes",
      "selective",
    ],
    intent: "Checks that you see indexes as a trade-off.",
    short:
      "Every index uses storage and memory and must be updated whenever a document is inserted, changed in an indexed field or deleted, so more indexes make writes slower. Indexes only pay off for fields that queries use for filtering, sorting or joining, and they help most when they are selective, meaning the value narrows the result a lot. Indexing every field wastes resources, so create indexes for the real queries and drop the ones that are never used.",
    detail: [
      "A field with only two or three values, such as a boolean, is usually a weak index on its own.",
      "A compound index can serve several queries, which reduces the number of indexes.",
      "The database can report index usage statistics, which helps find unused indexes.",
    ],
    ex: "An analytics collection with heavy writes keeps only the two indexes its queries need, to keep inserts fast.",
    mistakes: [
      "Creating an index for every field just in case.",
      "Never reviewing indexes after the queries have changed.",
    ],
    follow: ["How do you find unused indexes?"],
    points: [
      "Each index slows writes",
      "Index what queries really use",
      "Selective fields help most",
    ],
    notes:
      "Index for real queries; each extra index costs storage and write speed.",
    src: [
      ["MongoDB Manual: Indexes", `${M}/indexes/`],
      [
        "MongoDB Manual: Compound Indexes",
        `${M}/core/indexes/index-types/index-compound/`,
      ],
    ],
  }),
  g({
    slug: "what-is-mongoose",
    topic: "Mongoose",
    d: "easy",
    title: "What is Mongoose and why use it with MongoDB?",
    kw: ["mongoose", "odm", "schema", "model", "node.js"],
    intent: "Checks that you know what Mongoose adds on top of the driver.",
    short:
      "Mongoose is an object data modelling library for MongoDB and Node.js. You define a schema that describes the fields, types, defaults and validation of a collection's documents, and Mongoose compiles it into a model that you use to create, query, update and delete documents. It adds structure, validation, middleware, population of references and convenient query helpers on top of the MongoDB driver.",
    detail: [
      "MongoDB itself is flexible, and Mongoose is the application-level layer that gives documents a defined shape.",
      "It sends commands through the official MongoDB driver.",
      "Each model maps to a collection, and its name is pluralised by default.",
    ],
    ex: "A Node API defines a `User` schema with required `email` and a default `role`, and uses the `User` model in its routes.",
    mistakes: [
      "Thinking that Mongoose replaces MongoDB.",
      "Assuming Mongoose validation runs when you write with the plain driver.",
    ],
    follow: ["What is a schema and what is a model?"],
    points: [
      "ODM for Node.js and MongoDB",
      "Schema defines the shape",
      "Model is used for queries",
    ],
    notes:
      "Mongoose = schema + model + validation + middleware over the MongoDB driver.",
    src: [
      ["Mongoose: Getting started", `${MG}/index.html`],
      ["Mongoose: Schemas", `${MG}/guide.html`],
    ],
  }),
  g({
    slug: "mongoose-schema-and-model",
    topic: "Mongoose",
    d: "easy",
    title: "How do you define a Mongoose schema and model?",
    kw: ["Schema", "model", "SchemaTypes", "default", "timestamps"],
    intent: "Checks that you can write the most common Mongoose code.",
    short:
      'You create a `new Schema({...})` that lists each field with its type and options such as `required`, `default`, `unique` or `min`, then call `mongoose.model("User", schema)` to get a model. The `timestamps: true` option adds `createdAt` and `updatedAt` automatically. The model gives you the methods for the collection, such as `create`, `find`, `findById` and `updateOne`.',
    detail: [
      "A schema can contain nested objects, arrays and references to other models with `ref`.",
      "The `unique` option creates a unique index, and it is not a validator.",
      "Schema options, such as `timestamps` and `toJSON`, are passed as the second argument.",
    ],
    ex: "A `User` model with name, email and role is used by the signup route to create new users.",
    code: [
      "A schema and a model",
      'import mongoose from "mongoose"\n\nconst userSchema = new mongoose.Schema(\n  {\n    name: { type: String, required: true, trim: true },\n    email: { type: String, required: true, unique: true, lowercase: true },\n    role: { type: String, enum: ["user", "admin"], default: "user" }\n  },\n  { timestamps: true }\n)\n\nexport const User = mongoose.model("User", userSchema)',
      [
        "Each field has a type and options.",
        "`enum` limits the allowed values and `default` fills in a missing one.",
        "`timestamps` adds `createdAt` and `updatedAt`.",
        "`mongoose.model` compiles the schema into a model.",
      ],
      "javascript",
    ],
    mistakes: [
      "Thinking `unique: true` validates and gives a friendly error. It builds an index, and the failure is a duplicate key error.",
      "Defining the model more than once in a hot-reloading environment.",
    ],
    follow: ["How do you add validation messages?"],
    points: [
      "Schema describes fields and options",
      "mongoose.model compiles it",
      "timestamps adds createdAt and updatedAt",
    ],
    notes:
      "`new Schema({...}, { timestamps: true })` then `mongoose.model(name, schema)`.",
    src: [
      ["Mongoose: Schemas", `${MG}/guide.html`],
      ["Mongoose: Models", `${MG}/models.html`],
    ],
  }),
  g({
    slug: "mongoose-validation",
    topic: "Mongoose",
    d: "medium",
    title: "How does validation work in Mongoose?",
    kw: [
      "validation",
      "required",
      "validate",
      "runValidators",
      "ValidationError",
    ],
    intent: "Checks that you know where validation runs and where it does not.",
    short:
      "Validation rules are defined in the schema, such as `required`, `min`, `max`, `minlength`, `enum`, `match` and custom `validate` functions. Mongoose runs them automatically before a document is saved with `save()` or `create()`, and throws a `ValidationError` that lists the failing fields. Validators do not run by default on update methods like `updateOne` and `findOneAndUpdate`, so you must pass `runValidators: true` there.",
    detail: [
      'Built-in validators accept a custom message, for example `required: [true, "Email is required"]`.',
      "Validation in Mongoose happens in the application. It does not stop a client that writes directly to the database.",
      "You can also call `doc.validate()` yourself.",
    ],
    ex: "A signup with no email fails with a `ValidationError` before anything is written to the database.",
    code: [
      "Handling a validation error",
      'try {\n  await User.create({ name: "Asha" })\n} catch (err) {\n  if (err.name === "ValidationError") {\n    console.log(Object.keys(err.errors)) // ["email"]\n  }\n}\n\nawait User.updateOne({ _id }, { role: "owner" }, { runValidators: true })',
      [
        "`create` validates the document first.",
        "The error lists each failing field under `errors`.",
        "`runValidators: true` turns on validation for the update.",
      ],
      "javascript",
    ],
    mistakes: [
      "Assuming validators run for `updateOne` without `runValidators`.",
      "Showing raw error objects to the user instead of a clear message.",
    ],
    follow: ["How is this different from MongoDB schema validation?"],
    points: [
      "Rules live in the schema",
      "Runs on save and create",
      "Update methods need runValidators: true",
    ],
    notes:
      "Validators run on `save`/`create`. For updates, pass `runValidators: true`.",
    src: [
      ["Mongoose: Validation", `${MG}/validation.html`],
      ["Mongoose: Schemas", `${MG}/guide.html`],
    ],
  }),
  g({
    slug: "mongoose-populate",
    topic: "Mongoose",
    d: "medium",
    title: "What does `populate` do in Mongoose?",
    kw: ["populate", "ref", "ObjectId", "references", "join"],
    intent: "Checks that you know how Mongoose resolves references.",
    short:
      '`populate` replaces a stored `ObjectId` reference with the actual document from another collection. You declare the link in the schema with `ref: "User"`, then call `.populate("author")` on a query. Mongoose runs an additional query to fetch the referenced documents and puts them in place, so it is not a database join like `$lookup`. You can limit the fields returned with the `select` option.',
    detail: [
      "Each populate adds another query, so populating many paths on many documents is costly.",
      "Populate only the fields you need.",
      "For heavy joins or reports, an aggregation with `$lookup` can be a better choice.",
    ],
    ex: "A post stores `author` as an ObjectId, and the post page populates it to show the author's name.",
    code: [
      "Reference and populate",
      'const postSchema = new mongoose.Schema({\n  title: String,\n  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }\n})\nconst Post = mongoose.model("Post", postSchema)\n\nconst post = await Post.findById(id).populate("author", "name email")',
      [
        "`ref` tells Mongoose which model the id belongs to.",
        "`populate` fetches the user and puts it in `author`.",
        "The second argument selects only the `name` and `email` fields.",
      ],
      "javascript",
    ],
    mistakes: [
      "Populating deeply on large lists, which causes many extra queries.",
      "Forgetting the `ref` in the schema.",
    ],
    follow: ["How is populate different from $lookup?"],
    points: [
      "Replaces an ObjectId with its document",
      "Needs ref in the schema",
      "Runs an extra query",
    ],
    notes:
      "`ref` in the schema, `.populate('field', 'fields to select')` in the query.",
    src: [
      ["Mongoose: Populate", `${MG}/populate.html`],
      ["Mongoose: Schemas", `${MG}/guide.html`],
    ],
  }),
  g({
    slug: "mongoose-save-vs-update",
    topic: "Mongoose",
    d: "medium",
    title:
      "What is the difference between `save()` and `updateOne()` in Mongoose?",
    kw: ["save", "updateOne", "findByIdAndUpdate", "document", "middleware"],
    intent: "Checks that you know the two update styles and their differences.",
    short:
      "`doc.save()` works on a document you loaded: you change its fields in JavaScript and save, which runs full validation and document middleware, and sends only the changed paths. `Model.updateOne()` and `findByIdAndUpdate()` send an update straight to the database without loading the document, which is a single and atomic operation but, by default, skips validators and document `save` middleware. Use `save()` when rules and hooks matter, and an update method when you need an atomic or bulk change.",
    detail: [
      "`findByIdAndUpdate` returns the old document unless you pass `new: true`.",
      "Update methods use query middleware, which is different from document middleware.",
      "For counters and other atomic changes, use `$inc` in an update method.",
    ],
    ex: "Changing a user's password uses `save()` so the hashing hook runs, and a visit counter uses `updateOne` with `$inc`.",
    code: [
      "Two styles of update",
      'const user = await User.findById(id)\nuser.name = "Asha K"\nawait user.save()\n\nawait User.updateOne({ _id: id }, { $inc: { logins: 1 } })',
      [
        "The first style loads the document, changes it and saves, so validation runs.",
        "The second style sends one atomic update without loading anything.",
      ],
      "javascript",
    ],
    mistakes: [
      "Using `findByIdAndUpdate` and expecting a `pre('save')` hook to run.",
      "Using `save()` for a counter and losing updates when two requests overlap.",
    ],
    follow: ["What is Mongoose middleware?"],
    points: [
      "save: load, change, validate, save",
      "updateOne: direct and atomic",
      "Hooks differ between the two",
    ],
    notes:
      "`save()` runs validation and save hooks; `updateOne` is direct and atomic.",
    src: [
      ["Mongoose: Documents", `${MG}/documents.html`],
      ["Mongoose: Queries", `${MG}/queries.html`],
    ],
  }),
  g({
    slug: "mongoose-middleware",
    topic: "Mongoose",
    d: "medium",
    title: "What is Mongoose middleware (hooks)?",
    kw: ["middleware", "pre save", "post", "hooks", "bcrypt"],
    intent:
      "Checks that you know where to put logic that runs around operations.",
    short:
      "Middleware, also called hooks, are functions that run before (`pre`) or after (`post`) an operation such as `save`, `validate`, `find` or `updateOne`. They are defined on the schema. A common use is hashing a password in a `pre('save')` hook, setting derived fields or cleaning up related data. Document middleware runs for `save` and `validate`, while query middleware runs for the `find` and `update` family and sees the query rather than a document.",
    detail: [
      "In a `pre` hook you call `next()`, or use an async function, to continue.",
      "Hooks must be declared before the model is compiled.",
      "Putting heavy logic in hooks can hide behaviour, so keep them small and well named.",
    ],
    ex: "A `pre('save')` hook hashes the password only when the password field was changed.",
    code: [
      "A pre-save hook",
      'userSchema.pre("save", async function () {\n  if (!this.isModified("password")) return\n  this.password = await hashPassword(this.password)\n})',
      [
        "The hook runs before every `save`.",
        "`isModified` stops it from hashing an already hashed password.",
        "An async function continues automatically when it finishes.",
      ],
      "javascript",
    ],
    mistakes: [
      "Declaring a hook after `mongoose.model` has been called, so it never runs.",
      "Expecting a `pre('save')` hook to run for `updateOne`.",
    ],
    follow: ["What is the difference between document and query middleware?"],
    points: [
      "pre and post hooks on the schema",
      "Document vs query middleware",
      "Declare before compiling the model",
    ],
    notes: "`schema.pre('save', fn)`; check `isModified` before hashing.",
    src: [
      ["Mongoose: Middleware", `${MG}/middleware.html`],
      ["Mongoose: Documents", `${MG}/documents.html`],
    ],
  }),
  g({
    slug: "mongoose-lean-queries",
    topic: "Mongoose",
    d: "medium",
    title: "What does `lean()` do in a Mongoose query?",
    kw: [
      "lean",
      "plain object",
      "performance",
      "mongoose document",
      "read-only",
    ],
    intent:
      "Checks that you know a simple read optimisation and its trade-off.",
    short:
      "By default, a Mongoose query returns full Mongoose documents that have methods, getters, change tracking and `save()`. `lean()` tells Mongoose to skip creating them and return plain JavaScript objects, which uses less memory and is faster. The price is that the results have no `save()`, no virtuals, and no schema getters or setters. Use `lean()` for read-only results that you send straight to a client.",
    detail: [
      "The performance gain is largest on queries that return many documents.",
      "Do not call `save()` on a lean result, because it is only a plain object.",
      "A virtual field, such as a computed full name, will be missing unless you use a plugin for it.",
    ],
    ex: "A list endpoint that returns 100 products as JSON uses `lean()` because it never modifies them.",
    code: [
      "A lean read",
      'const products = await Product.find({ active: true })\n  .select("name price")\n  .lean()',
      [
        "`select` limits the fields.",
        "`lean` returns plain objects, with no Mongoose features.",
      ],
      "javascript",
    ],
    mistakes: [
      "Calling `save()` on a lean result.",
      "Expecting virtuals and getters on lean results.",
    ],
    follow: ["When should you not use lean?"],
    points: [
      "Returns plain objects",
      "Faster and lighter",
      "No save() or virtuals",
    ],
    notes: "`.lean()` for read-only lists: plain objects, no document methods.",
    src: [
      ["Mongoose: Lean tutorial", `${MG}/tutorials/lean.html`],
      ["Mongoose: Queries", `${MG}/queries.html`],
    ],
  }),
  g({
    slug: "mongoose-connect",
    topic: "Mongoose",
    d: "easy",
    title: "How do you connect to MongoDB with Mongoose?",
    kw: [
      "mongoose.connect",
      "connection string",
      "environment variable",
      "await",
      "connection events",
    ],
    intent: "Checks that you handle connection settings safely.",
    short:
      "Call `await mongoose.connect(uri)` once when the application starts, and wait for it before accepting requests. The connection string, such as `mongodb://localhost:27017/shop` or an Atlas `mongodb+srv://` URI, must come from an environment variable and not from source code, because it can contain a password. Handle the rejected promise, and listen to connection events such as `error` and `disconnected` so failures are visible.",
    detail: [
      "Mongoose keeps a connection pool, so you connect once and reuse it for the whole process.",
      "Commands you issue before the connection is ready are buffered for a while by default.",
      "On shutdown, close the connection with `mongoose.disconnect()`.",
    ],
    ex: "The server reads `MONGODB_URI` from the environment, connects, and only then starts listening on its port.",
    code: [
      "Connect on startup",
      'import mongoose from "mongoose"\n\nasync function start() {\n  await mongoose.connect(process.env.MONGODB_URI)\n  app.listen(3000)\n}\n\nstart().catch((err) => {\n  console.error("Could not connect", err)\n  process.exit(1)\n})',
      [
        "The URI comes from an environment variable.",
        "The server starts listening only after the connection succeeds.",
        "A failure is logged and the process exits instead of running without a database.",
      ],
      "javascript",
    ],
    mistakes: [
      "Hard-coding the connection string, with its password, in the code.",
      "Opening a new connection for each request.",
    ],
    follow: ["What is a connection pool?"],
    points: [
      "Connect once at startup",
      "URI from an environment variable",
      "Handle errors and events",
    ],
    notes:
      "`await mongoose.connect(process.env.MONGODB_URI)` once, then start the server.",
    src: [
      ["Mongoose: Connections", `${MG}/connections.html`],
      ["Mongoose: Getting started", `${MG}/index.html`],
    ],
  }),
  g({
    slug: "single-document-atomicity",
    topic: "Transactions & consistency",
    d: "medium",
    title: "Are MongoDB operations atomic?",
    kw: [
      "atomicity",
      "single document",
      "atomic update",
      "$inc",
      "embedded document",
    ],
    intent: "Checks that you know the guarantee MongoDB gives by default.",
    short:
      "A write to a single document is atomic in MongoDB, even when it changes several fields or nested documents in that document. Another operation will see either the old or the new document, never a half-updated one. Writes that change several documents are not atomic as a group unless you use a multi-document transaction. This is one reason to keep data that changes together inside one document.",
    detail: [
      "`updateMany` is atomic for each document, but not across all the documents it changes.",
      "Operators such as `$inc` make a read-modify-write safe within a single document.",
      "Good data modelling avoids needing transactions for the common cases.",
    ],
    ex: "An order document with its items embedded can be created or updated atomically, with no transaction.",
    mistakes: [
      "Believing that `updateMany` is all-or-nothing across documents.",
      "Splitting data that must change together over several collections without need.",
    ],
    follow: ["When would you need a transaction?"],
    points: [
      "One document write is atomic",
      "Multi-document needs a transaction",
      "Model to keep related data together",
    ],
    notes:
      "Single-document writes are atomic; across documents you need a transaction.",
    src: [
      [
        "MongoDB Manual: Atomicity and Transactions",
        `${M}/core/write-operations-atomicity/`,
      ],
      ["MongoDB Manual: Transactions", `${M}/core/transactions/`],
    ],
  }),
  g({
    slug: "multi-document-transactions",
    topic: "Transactions & consistency",
    d: "hard",
    title:
      "What are multi-document transactions in MongoDB and when do you use them?",
    kw: ["transaction", "session", "withTransaction", "commit", "abort"],
    intent:
      "Checks that you can use a transaction and know it is not the default tool.",
    short:
      "A multi-document transaction makes changes to several documents, in one or more collections, succeed or fail together: either all of them are committed, or none are. You start a session, run the operations inside a transaction, and commit, or abort when something fails. They need a replica set or a sharded cluster, and they have a performance cost, so use them for operations that must be consistent, such as moving money between two accounts, and not for ordinary writes.",
    detail: [
      "Pass the `session` to every operation that belongs to the transaction.",
      "`withTransaction` handles the commit and retries some transient errors.",
      "Keep transactions short, because long ones hold resources and can hit time limits.",
    ],
    ex: "A transfer subtracts from one account and adds to another inside one transaction, so a failure never leaves only one change applied.",
    code: [
      "A transaction with Mongoose",
      "const session = await mongoose.startSession()\ntry {\n  await session.withTransaction(async () => {\n    await Account.updateOne({ _id: from }, { $inc: { balance: -amount } }, { session })\n    await Account.updateOne({ _id: to }, { $inc: { balance: amount } }, { session })\n  })\n} finally {\n  await session.endSession()\n}",
      [
        "A session groups the operations.",
        "Both updates receive the same `session`.",
        "If anything throws, the transaction is aborted and nothing is applied.",
        "The session is always ended.",
      ],
      "javascript",
    ],
    mistakes: [
      "Using a transaction for every write instead of modelling data to avoid one.",
      "Forgetting to pass the session to an operation, so it runs outside the transaction.",
    ],
    follow: ["Do transactions work on a standalone server?"],
    points: [
      "All-or-nothing across documents",
      "Needs a replica set or sharded cluster",
      "Pass the session to each operation",
    ],
    notes:
      "`session.withTransaction(...)`, pass `{ session }` to each operation.",
    src: [
      ["MongoDB Manual: Transactions", `${M}/core/transactions/`],
      ["Mongoose: Transactions", `${MG}/transactions.html`],
    ],
  }),
  g({
    slug: "replica-sets-and-write-concern",
    topic: "Transactions & consistency",
    d: "hard",
    title: "What is a replica set and what does write concern mean?",
    kw: ["replica set", "primary", "secondary", "write concern", "majority"],
    intent:
      "Checks that you understand how MongoDB keeps data available and how safe a write is.",
    short:
      'A replica set is a group of MongoDB servers that keep the same data: one primary receives all writes, and the secondaries copy its changes. If the primary fails, the members elect a new one, which keeps the database available. Write concern says how many members must confirm a write before it counts as successful. `w: 1` waits for the primary only, and `w: "majority"` waits for most members, which protects the write from being lost if the primary fails.',
    detail: [
      "Reads go to the primary by default, and you can choose to read from secondaries, which may return slightly older data.",
      "Replica sets are also required for transactions and change streams.",
      "A stronger write concern is safer but slower.",
    ],
    ex: 'A payment record is written with `w: "majority"` so that it survives an election, while a view counter uses the default.',
    code: [
      "A write with majority concern",
      'db.payments.insertOne(\n  { orderId: 1, amount: 540 },\n  { writeConcern: { w: "majority" } }\n)',
      [
        "The write is acknowledged only after most replica set members have it.",
        "It is slower than `w: 1`, but much less likely to be rolled back.",
      ],
      "javascript",
    ],
    mistakes: [
      "Treating a single server as safe from hardware failure.",
      "Reading from secondaries and expecting the very latest data.",
    ],
    follow: ["What happens when the primary goes down?"],
    points: [
      "Primary takes writes, secondaries copy",
      "Automatic election on failure",
      "w: majority for important writes",
    ],
    notes:
      "Replica set = primary + secondaries. Use `w: 'majority'` for important writes.",
    src: [
      ["MongoDB Manual: Replication", `${M}/replication/`],
      ["MongoDB Manual: Write Concern", `${M}/reference/write-concern/`],
    ],
  }),
])
