import { defineQuestions } from "../author"
import { q } from "../compact"

const AZ = "https://learn.microsoft.com/en-us/azure/architecture"
const P = `${AZ}/patterns`
const AWS = "https://docs.aws.amazon.com"
const SQS = `${AWS}/AWSSimpleQueueService/latest/SQSDeveloperGuide`
const ELB = `${AWS}/elasticloadbalancing/latest`
const PG = "https://www.postgresql.org/docs/current"

export default defineQuestions("system-design", "fresher", [
  q({
    slug: "system-design-interview-approach",
    topic: "Trade-offs",
    d: "easy",
    title: "How do you approach a system design question?",
    kw: [
      "system design approach",
      "requirements",
      "high-level design",
      "bottlenecks",
      "trade-offs",
    ],
    intent: "A foundation question: checks you have a repeatable structure.",
    short:
      "Work through it in steps. Clarify the requirements first: what the system must do (functional) and the qualities it needs such as scale, latency, availability and consistency (non-functional). Estimate the load, for example users, requests per second and data size. Sketch a high-level design with clients, load balancer, application servers, data stores, cache and queues, then define the data model and the main APIs. Dive into the parts that are hardest or most important, identify bottlenecks and single points of failure, and discuss trade-offs and alternatives out loud. State assumptions, keep it simple first, then scale it.",
    detail: [
      "There is rarely one right answer; reasoning and trade-offs matter.",
      "Start with a design that works for a small load, then evolve it.",
      "Mention monitoring, security and failure handling.",
    ],
    ex: "For a URL shortener, you clarify read-heavy traffic, estimate requests per second, then add a cache and a key-generation strategy.",
    mistakes: [
      "Jumping to technologies before requirements.",
      "Not discussing trade-offs.",
    ],
    follow: ["Which numbers would you estimate first?"],
    points: [
      "Clarify requirements",
      "Estimate load",
      "High-level design then deep dive",
      "Find bottlenecks and trade-offs",
    ],
    notes: ["Requirements, estimate, design, refine."],
    src: [
      [
        "Azure Architecture Center: Design principles",
        `${AZ}/guide/design-principles/`,
      ],
      [
        "AWS Well-Architected Framework",
        `${AWS}/wellarchitected/latest/framework/welcome.html`,
      ],
    ],
  }),
  q({
    slug: "vertical-vs-horizontal-scaling",
    topic: "Scalability",
    d: "easy",
    title: "What is the difference between vertical and horizontal scaling?",
    kw: [
      "vertical scaling",
      "horizontal scaling",
      "scale up",
      "scale out",
      "stateless",
    ],
    intent: "A staple question about growth.",
    short:
      "Vertical scaling (scale up) means giving a single machine more resources, such as more CPU, memory or faster disks. It is simple, with no code change, but has a hard ceiling, can be costly, and leaves a single point of failure. Horizontal scaling (scale out) means adding more machines and spreading the load across them with a load balancer. It scales much further and improves availability, but needs the application to work across several instances: stateless services, shared session or cache stores, and data partitioning. Cloud design guidance favours designing to scale out.",
    detail: [
      "Databases are harder to scale out than stateless web servers.",
      "Auto scaling adds and removes instances with demand.",
      "A mix is common: bigger databases, many small app servers.",
    ],
    ex: "A web tier grows from two to ten identical instances behind a load balancer during a sale.",
    mistakes: [
      "Stateful servers that cannot be duplicated.",
      "Scaling up only, until the biggest machine is not enough.",
    ],
    follow: ["What must change in an app to scale out?"],
    points: [
      "Up: bigger machine, simple, limited",
      "Out: more machines, scalable",
      "Stateless design enables scale-out",
      "Load balancer distributes",
    ],
    notes: ["Up is simple, out is scalable."],
    src: [
      [
        "Azure Architecture Center: Design to scale out",
        `${AZ}/guide/design-principles/scale-out`,
      ],
      [
        "AWS: What is Amazon EC2 Auto Scaling?",
        `${AWS}/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html`,
      ],
    ],
  }),
  q({
    slug: "stateless-services-and-session-state",
    topic: "Scalability",
    d: "medium",
    title: "Why should services be stateless, and where does state go?",
    kw: [
      "stateless services",
      "session store",
      "shared state",
      "sticky sessions",
      "scalability",
    ],
    intent: "Checks you know how state interacts with scaling.",
    short:
      "A stateless service keeps no per-client data between requests in its own memory, so any instance can handle any request. That lets you add or remove instances freely, restart them without losing user data and balance load evenly. State is moved out of the instance: user sessions into a shared store such as Redis or into signed tokens, uploaded files into object storage, and business data into databases. Sticky sessions that pin a user to one server are a fallback that complicates failover and balancing. Keeping the service stateless is a key part of scaling out and of resilience.",
    detail: [
      "Configuration comes from the environment, not local files.",
      "Background jobs should run through queues, not in the web process.",
      "Local caches are allowed, but they must be disposable.",
    ],
    ex: "Moving sessions from process memory into Redis lets three API instances serve the same user in turn.",
    mistakes: [
      "Sessions in server memory with several instances.",
      "Writing uploads to local disk.",
    ],
    follow: ["Where would you store user sessions?"],
    points: [
      "Any instance can serve any request",
      "State in shared stores",
      "Sticky sessions are a fallback",
      "Enables elasticity",
    ],
    notes: ["Keep servers disposable."],
    src: [
      [
        "Azure Architecture Center: Design to scale out",
        `${AZ}/guide/design-principles/scale-out`,
      ],
      [
        "Redis: Replication",
        "https://redis.io/docs/latest/operate/oss_and_stack/management/replication/",
      ],
    ],
  }),
  q({
    slug: "auto-scaling-basics",
    topic: "Scalability",
    d: "medium",
    title: "How does auto scaling work, and what should drive it?",
    kw: [
      "auto scaling",
      "scaling policies",
      "cpu utilisation",
      "scale in",
      "cooldown",
    ],
    intent: "Checks you can reason about elastic capacity.",
    short:
      "Auto scaling adjusts the number of instances to match demand. A scaling policy watches a metric, such as average CPU, request count per instance or queue length, and adds instances when it exceeds a target and removes them when it falls. A minimum count keeps the service available and a maximum caps cost. Delays matter: new instances take time to start and warm up, so use cooldowns and scale on a metric that reflects load, and consider scheduled scaling for predictable peaks. Scaling works best with stateless instances behind a load balancer and health checks.",
    detail: [
      "Scaling on the queue depth suits worker services.",
      "Scale in gently to avoid thrashing.",
      "Databases and downstream services must cope with the extra load.",
    ],
    ex: "A group scales between 2 and 10 instances to hold CPU near 50 percent.",
    mistakes: [
      "Scaling on a metric that does not reflect load.",
      "Ignoring startup time.",
    ],
    follow: ["Why have both a minimum and a maximum?"],
    points: [
      "Metric-based add and remove",
      "Min and max limits",
      "Cooldowns for stability",
      "Needs stateless instances",
    ],
    notes: ["Scale on load, not guesses."],
    src: [
      [
        "Azure Architecture Center: Autoscaling",
        `${AZ}/best-practices/auto-scaling`,
      ],
      [
        "AWS: What is Amazon EC2 Auto Scaling?",
        `${AWS}/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html`,
      ],
    ],
  }),
  q({
    slug: "cdn-and-static-content-offload",
    topic: "Scalability",
    d: "easy",
    title: "How does a CDN help a system scale?",
    kw: [
      "cdn",
      "edge caching",
      "static content hosting",
      "latency",
      "origin offload",
    ],
    intent: "Checks you offload what you can from the origin.",
    short:
      "A content delivery network caches content at edge locations close to users. Static assets such as images, scripts and videos are served from the edge, which reduces latency for users far from the origin, and also removes a large share of requests from the application servers, so the origin can handle more users. Cache headers control how long content stays at the edge, and versioned file names allow long lifetimes with instant updates. CDNs also absorb traffic spikes and attacks, terminate TLS near users and can cache some API responses that are safe to share.",
    detail: [
      "Origin storage such as object storage plus a CDN is a classic pattern for static sites.",
      "Do not cache personalised responses at shared edges.",
      "Invalidate or version when content changes.",
    ],
    ex: "A site serves all images and bundles from the CDN, so the origin only handles HTML and API calls.",
    mistakes: [
      "Caching private data at the edge.",
      "No cache-busting strategy.",
    ],
    follow: ["What makes content cacheable at the edge?"],
    points: [
      "Edge caches near users",
      "Offloads the origin",
      "Cache headers and versioned names",
      "Good for static assets",
    ],
    notes: ["Serve from the edge."],
    src: [
      [
        "Azure Architecture Center: Static Content Hosting pattern",
        `${P}/static-content-hosting`,
      ],
      [
        "AWS: What is Amazon CloudFront?",
        `${AWS}/AmazonCloudFront/latest/DeveloperGuide/Introduction.html`,
      ],
    ],
  }),
  q({
    slug: "caching-layers-in-system-design",
    topic: "Caching",
    d: "medium",
    title:
      "Where can you add caching in a system, and what are the trade-offs?",
    kw: [
      "caching layers",
      "browser cache",
      "cdn",
      "application cache",
      "database cache",
    ],
    intent: "Checks you can place caches deliberately.",
    short:
      "Caches can sit at several layers: the browser, a CDN at the edge, a reverse proxy, an in-memory application cache such as Redis in front of the database, and the database's own buffer cache. Each layer cuts latency and load on the layer behind it. The trade-offs are staleness (cached data can be out of date), complexity (how and when to invalidate), memory cost and extra failure modes, such as a cold cache after a restart overwhelming the database. Cache data that is read often and changes rarely, set sensible expiry times, and decide how stale each kind of data may be.",
    detail: [
      "Measure the hit ratio to see whether a cache helps.",
      "Plan for cache failure: the system should still work, only slower.",
      "Do not cache what is cheap to compute or highly personal without care.",
    ],
    ex: "Product pages are cached for a few minutes in Redis, with the CDN caching the images.",
    mistakes: [
      "No invalidation plan.",
      "Treating the cache as the only copy of data.",
    ],
    follow: ["What is a cache stampede risk?"],
    points: [
      "Browser, CDN, proxy, application, database caches",
      "Cuts latency and load",
      "Cost: staleness and complexity",
      "Plan for cold start and failure",
    ],
    notes: ["Cache read-heavy, slow-changing data."],
    src: [
      [
        "Azure Architecture Center: Caching guidance",
        `${AZ}/best-practices/caching`,
      ],
      [
        "AWS ElastiCache: What is ElastiCache?",
        `${AWS}/AmazonElastiCache/latest/dg/WhatIs.html`,
      ],
    ],
  }),
  q({
    slug: "cache-aside-write-through-design",
    topic: "Caching",
    d: "medium",
    title:
      "How do cache-aside and write-through work, and when would you choose each?",
    kw: [
      "cache-aside",
      "write-through",
      "read-through",
      "consistency",
      "lazy loading",
    ],
    intent: "Checks you can pick a caching strategy for a workload.",
    short:
      "In cache-aside the application checks the cache first, loads from the database on a miss, stores the result and returns it; on writes it updates the database and invalidates the cached item. Only requested data is cached, and the system keeps working if the cache fails, but the first request for each item is slow and data can be briefly stale. In write-through, writes go to the cache and the database together, so the cache is always current, at the cost of slower writes and caching data that may never be read. Choose cache-aside for read-heavy general workloads and write-through when reads must see fresh data right after writes.",
    detail: [
      "Add a TTL as a safety net in both approaches.",
      "Write-behind defers database writes and risks data loss.",
      "Consistency requirements decide the strategy.",
    ],
    ex: "A catalogue service uses cache-aside, and a profile service uses write-through so the user sees changes immediately.",
    mistakes: ["Updating the cache before the database commit.", "No TTL."],
    follow: ["What is the downside of write-through?"],
    points: [
      "Cache-aside: lazy load, invalidate on write",
      "Write-through: update both",
      "Trade freshness against write cost",
      "TTL as a backstop",
    ],
    notes: ["Lazy versus eager."],
    src: [
      ["Azure Architecture Center: Cache-Aside pattern", `${P}/cache-aside`],
      [
        "AWS ElastiCache: Caching strategies",
        `${AWS}/AmazonElastiCache/latest/dg/Strategies.html`,
      ],
    ],
  }),
  q({
    slug: "sql-vs-nosql-choice",
    topic: "Databases",
    d: "medium",
    title: "How do you choose between a SQL and a NoSQL database?",
    kw: [
      "sql vs nosql",
      "relational",
      "document store",
      "key-value",
      "data model",
    ],
    intent: "Checks you choose a data store by requirements, not fashion.",
    short:
      "Relational (SQL) databases store structured data in tables with a schema, support joins, strong consistency and ACID transactions, and suit data with relationships and integrity requirements such as orders and payments. NoSQL covers several models: document stores for flexible JSON-like records, key-value stores for very fast lookups, wide-column stores for huge write volumes, and graph databases for relationships. They often scale horizontally more easily and allow flexible schemas, but may offer weaker joins or consistency guarantees. Pick by data shape, access patterns, consistency needs and scale, and it is common to use more than one store.",
    detail: [
      "Start with relational unless there is a clear reason not to.",
      "Design NoSQL schemas around queries, not normalised entities.",
      "Microsoft's guidance recommends using the best data store for each workload.",
    ],
    ex: "Orders and payments live in PostgreSQL, while product search data lives in a document store.",
    mistakes: [
      "Choosing NoSQL for scale you do not have.",
      "Modelling relational data in a store without joins.",
    ],
    follow: ["What does ACID guarantee?"],
    points: [
      "SQL: schema, joins, transactions",
      "NoSQL: several models, flexible, scale-out",
      "Choose by access pattern and consistency",
      "Polyglot persistence is common",
    ],
    notes: ["Data shape and queries decide."],
    src: [
      [
        "Azure Architecture Center: Understand data store models",
        `${AZ}/data-guide/technology-choices/understand-data-store-models`,
      ],
      [
        "Azure Architecture Center: Use the best data store",
        `${AZ}/guide/design-principles/use-the-best-data-store`,
      ],
    ],
  }),
  q({
    slug: "database-replication-and-read-replicas",
    topic: "Databases",
    d: "medium",
    title: "What is database replication, and how do read replicas help?",
    kw: [
      "replication",
      "primary replica",
      "read replica",
      "failover",
      "replication lag",
    ],
    intent: "Checks you know how to scale reads and improve availability.",
    short:
      "Replication copies data from a primary database to one or more replicas. Replicas can serve read-only queries, spreading read traffic and offloading the primary, which suits read-heavy systems, and a standby replica can be promoted if the primary fails, improving availability. Replication is often asynchronous, so a replica can lag slightly behind and may return stale data; synchronous replication avoids this at the price of slower writes. Applications must send writes to the primary and decide which reads can tolerate lag, for example reading your own writes from the primary.",
    detail: [
      "Replicas do not scale writes; that needs partitioning.",
      "Failover must be tested and automated to be reliable.",
      "PostgreSQL, MongoDB and managed services like RDS all support replication.",
    ],
    ex: "Reports run on a read replica so they do not slow down customer checkouts on the primary.",
    mistakes: [
      "Reading just-written data from a lagging replica.",
      "Assuming replicas scale writes.",
    ],
    follow: ["What is replication lag?"],
    points: [
      "Primary plus replicas",
      "Replicas serve reads and standby failover",
      "Async replication can lag",
      "Writes still go to the primary",
    ],
    notes: ["Replicas scale reads."],
    src: [
      [
        "AWS RDS: Read replicas",
        `${AWS}/AmazonRDS/latest/UserGuide/USER_ReadRepl.html`,
      ],
      [
        "PostgreSQL: High availability, load balancing and replication",
        `${PG}/high-availability.html`,
      ],
      [
        "MongoDB: Replication",
        "https://www.mongodb.com/docs/manual/replication/",
      ],
    ],
  }),
  q({
    slug: "sharding-and-partitioning",
    topic: "Databases",
    d: "hard",
    title: "What is sharding, and how do you choose a shard key?",
    kw: [
      "sharding",
      "partitioning",
      "shard key",
      "hot partition",
      "horizontal partitioning",
    ],
    intent: "Checks you can scale writes and data size.",
    short:
      "Sharding splits a large dataset across multiple databases or nodes, each holding a subset of the data, so that storage and write load scale horizontally. Rows are assigned to a shard by a shard key, using ranges, a hash, or a lookup. A good key spreads data and traffic evenly and matches the most common queries, so that most requests touch one shard. A bad key creates hot spots, where one shard gets most of the traffic, or forces expensive cross-shard queries. Sharding adds complexity: cross-shard joins and transactions, rebalancing, and operations, so use it when a single node can no longer cope.",
    detail: [
      "Hashing spreads load evenly but makes range queries harder.",
      "Choose a key with high cardinality.",
      "Within one server, table partitioning can help manage large tables.",
    ],
    ex: "A multi-tenant app shards by tenant id so each tenant's data lives on one shard.",
    mistakes: [
      "Sharding too early.",
      "A monotonically increasing key that sends all new writes to one shard.",
    ],
    follow: ["What makes a good shard key?"],
    points: [
      "Split data across nodes",
      "Shard key decides placement",
      "Even distribution and query fit",
      "Cost: complexity and cross-shard operations",
    ],
    notes: ["Pick the key carefully."],
    src: [
      ["Azure Architecture Center: Sharding pattern", `${P}/sharding`],
      ["MongoDB: Sharding", "https://www.mongodb.com/docs/manual/sharding/"],
      ["PostgreSQL: Table partitioning", `${PG}/ddl-partitioning.html`],
    ],
  }),
  q({
    slug: "database-indexes-in-design",
    topic: "Databases",
    d: "medium",
    title: "How do indexes affect performance in a system design?",
    kw: [
      "database index",
      "read performance",
      "write overhead",
      "composite index",
      "query patterns",
    ],
    intent: "Checks you consider the cost and benefit of indexes.",
    short:
      "An index is an additional data structure, commonly a B-tree, that lets the database find rows without scanning the whole table, which turns a slow lookup on a large table into a fast one. The costs are extra storage and slower writes, since every insert, update or delete must maintain the indexes. So index the columns used in frequent filters, joins and sorting, use composite indexes in the order that matches queries, and avoid indexing everything. Check with `EXPLAIN` that queries use the index, and remember that an index helps only the queries it fits.",
    detail: [
      "Primary and unique keys are indexed automatically.",
      "Low-selectivity columns such as booleans are rarely good index candidates alone.",
      "Indexes are part of the access-pattern design, not an afterthought.",
    ],
    ex: "Adding an index on `orders(user_id, created_at)` makes 'recent orders for a user' fast.",
    mistakes: [
      "Indexing every column.",
      "Assuming the planner always uses an index.",
    ],
    follow: ["What is the cost of an index?"],
    points: [
      "Index speeds reads",
      "Costs writes and storage",
      "Match indexes to queries",
      "Verify with EXPLAIN",
    ],
    notes: ["Index for the queries you run."],
    src: [["PostgreSQL: Indexes", `${PG}/indexes.html`]],
  }),
  q({
    slug: "consistency-models-eventual-vs-strong",
    topic: "Databases",
    d: "hard",
    title: "What is the difference between strong and eventual consistency?",
    kw: [
      "strong consistency",
      "eventual consistency",
      "read your writes",
      "replication lag",
      "cap theorem",
    ],
    intent: "Checks you understand consistency trade-offs in distributed data.",
    short:
      "With strong consistency, a read returns the result of the latest completed write, as on a single-node database or a synchronously replicated one; it is simple to reason about but can add latency and reduce availability when nodes or networks fail. With eventual consistency, replicas may briefly return older data, and all copies converge if no new writes arrive, which improves availability and speed. Some stores let you choose per request: DynamoDB offers eventually consistent reads by default and strongly consistent reads as an option. Decide per feature: a bank balance needs strong consistency, a like counter or feed can be eventual.",
    detail: [
      "Distributed systems must trade off consistency, availability and partition tolerance when failures occur.",
      "Design the user experience around staleness, for example read-your-own-writes.",
      "Strongly consistent reads usually cost more latency or throughput.",
    ],
    ex: "A social feed may show a new post a moment late on another device, which is acceptable; a payment balance must be exact.",
    mistakes: [
      "Assuming replicas are always current.",
      "Using eventual consistency where correctness is required.",
    ],
    follow: ["Give an example where eventual consistency is acceptable."],
    points: [
      "Strong: latest write always visible",
      "Eventual: converges over time",
      "Choose per use case",
      "Trade latency and availability for freshness",
    ],
    notes: ["Correctness decides the model."],
    src: [
      [
        "AWS DynamoDB: Read consistency",
        `${AWS}/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html`,
      ],
      ["PostgreSQL: Transaction isolation", `${PG}/transaction-iso.html`],
    ],
  }),
  q({
    slug: "message-queues-decoupling",
    topic: "Queues",
    d: "easy",
    title: "What is a message queue and why use one?",
    kw: [
      "message queue",
      "decoupling",
      "asynchronous processing",
      "producer consumer",
      "buffering",
    ],
    intent: "A core question about asynchronous design.",
    short:
      "A message queue stores messages from producers until consumers process them. It decouples components in time and speed: the web request can return immediately after enqueueing work like sending email or generating a report, while workers process it in the background. It also buffers traffic spikes (queue-based load levelling), lets you scale workers independently, and improves resilience, since messages wait if a consumer is down. Costs include eventual rather than immediate results, more infrastructure, and the need to handle duplicates, failures and ordering.",
    detail: [
      "Examples: Amazon SQS, RabbitMQ, Kafka and Redis streams.",
      "Producers and consumers need only agree on the message format.",
      "Return a job id so clients can poll for the result.",
    ],
    ex: "Placing an order enqueues an 'order created' message; separate workers send the email and update inventory.",
    mistakes: [
      "Doing slow work inside the request.",
      "No monitoring of queue depth.",
    ],
    follow: ["What problem does queue-based load levelling solve?"],
    points: [
      "Producers enqueue, consumers process",
      "Decouples and buffers",
      "Scale workers independently",
      "Handle duplicates and failures",
    ],
    notes: ["Accept now, process later."],
    src: [
      [
        "Azure Architecture Center: Queue-Based Load Leveling",
        `${P}/queue-based-load-leveling`,
      ],
      ["AWS: What is Amazon SQS?", `${SQS}/welcome.html`],
    ],
  }),
  q({
    slug: "queue-delivery-semantics-idempotent",
    topic: "Queues",
    d: "hard",
    title: "What are at-least-once delivery and idempotent consumers?",
    kw: [
      "at-least-once",
      "at-most-once",
      "exactly-once",
      "idempotent consumer",
      "duplicates",
    ],
    intent: "Checks you can design consumers that survive redelivery.",
    short:
      "Most queues guarantee at-least-once delivery: a message is delivered one or more times, because if the consumer fails before acknowledging, the queue delivers it again. That means duplicates can occur. At-most-once delivery may lose messages, and true exactly-once is hard and limited. The practical answer is an idempotent consumer, where processing the same message twice has the same effect as once: record processed message ids, use unique constraints, or make operations naturally repeatable (set a value rather than increment). Amazon SQS standard queues deliver at least once, while FIFO queues add ordering and deduplication within limits.",
    detail: [
      "Acknowledge only after processing succeeds.",
      "Keep the processing time under the visibility timeout or extend it.",
      "Poison messages that always fail go to a dead-letter queue.",
    ],
    ex: "A payment consumer checks whether the order id has already been marked paid before updating the database.",
    mistakes: [
      "Assuming a message is processed exactly once.",
      "Non-idempotent side effects like sending money twice.",
    ],
    follow: ["Why does a failed consumer cause redelivery?"],
    points: [
      "At-least-once means duplicates possible",
      "Acknowledge after success",
      "Idempotent consumers",
      "Dead-letter queue for poison messages",
    ],
    notes: ["Assume duplicates."],
    src: [
      ["AWS: Amazon SQS standard queues", `${SQS}/standard-queues.html`],
      [
        "AWS: Amazon SQS visibility timeout",
        `${SQS}/sqs-visibility-timeout.html`,
      ],
      ["AWS: Dead-letter queues", `${SQS}/sqs-dead-letter-queues.html`],
    ],
  }),
  q({
    slug: "competing-consumers-worker-pools",
    topic: "Queues",
    d: "medium",
    title: "What is the competing consumers pattern?",
    kw: [
      "competing consumers",
      "worker pool",
      "parallel processing",
      "queue scaling",
      "message ordering",
    ],
    intent: "Checks you can scale queue processing.",
    short:
      "Several consumers read from the same queue and each message is handled by exactly one of them, so processing is spread across workers. Adding workers increases throughput, and if a worker fails its messages become available again for others, which improves resilience. The queue acts as a natural load balancer. The costs are that strict ordering is lost across consumers, and consumers must be idempotent, since messages can be redelivered. Where ordering matters for related messages, partition by a key so that messages for one entity go to one consumer.",
    detail: [
      "Scale the number of workers on queue depth or age of the oldest message.",
      "Use dead-letter queues for messages that keep failing.",
      "Protect downstream services from too much parallelism.",
    ],
    ex: "Twenty workers consume image-resize jobs; adding more workers shortens the backlog.",
    mistakes: [
      "Relying on global ordering with many consumers.",
      "Unbounded parallelism overwhelming the database.",
    ],
    follow: ["How do you keep order per customer?"],
    points: [
      "Many consumers, one queue",
      "Each message to one worker",
      "Scale workers with the backlog",
      "Order only within a partition or group",
    ],
    notes: ["More workers, more throughput."],
    src: [
      [
        "Azure Architecture Center: Competing Consumers pattern",
        `${P}/competing-consumers`,
      ],
      [
        "Azure Architecture Center: Priority Queue pattern",
        `${P}/priority-queue`,
      ],
    ],
  }),
  q({
    slug: "pub-sub-vs-queue",
    topic: "Queues",
    d: "medium",
    title: "What is the difference between a queue and publish/subscribe?",
    kw: [
      "publish subscribe",
      "topic",
      "fan-out",
      "point-to-point",
      "event notification",
    ],
    intent: "Checks you pick the right messaging pattern.",
    short:
      "A queue is point-to-point: each message is consumed by one consumer, which suits distributing tasks. In publish/subscribe, a publisher sends an event to a topic and every subscriber gets its own copy, so one event can trigger several independent actions. The publisher does not know who listens, which keeps services decoupled. Services such as Amazon SNS provide topics, and a common design fans out from a topic to several queues, one per consumer, combining broadcast with buffering. Use queues for work distribution and pub/sub for notifying many interested parties.",
    detail: [
      "Subscribers can be added without changing the publisher.",
      "Each subscriber should process events idempotently.",
      "Event schemas need versioning as they evolve.",
    ],
    ex: "An 'order placed' event is published once; billing, inventory and email services each receive it.",
    mistakes: [
      "Using a queue when several services need the same message.",
      "Tight coupling through shared event formats with no versioning.",
    ],
    follow: ["What is fan-out?"],
    points: [
      "Queue: one consumer per message",
      "Pub/sub: every subscriber gets a copy",
      "Decouples publisher from subscribers",
      "Topic fans out to queues",
    ],
    notes: ["Queue shares work, topic shares events."],
    src: [
      [
        "Azure Architecture Center: Publisher/Subscriber pattern",
        `${P}/publisher-subscriber`,
      ],
      ["AWS: What is Amazon SNS?", `${AWS}/sns/latest/dg/welcome.html`],
    ],
  }),
  q({
    slug: "load-balancer-l4-vs-l7",
    topic: "Load balancing",
    d: "medium",
    title: "What are layer 4 and layer 7 load balancers?",
    kw: [
      "layer 4",
      "layer 7",
      "application load balancer",
      "network load balancer",
      "routing",
    ],
    intent: "Checks you know what each kind can do.",
    short:
      "A layer 4 load balancer works at the transport level (TCP/UDP): it forwards connections based on IP address and port, without inspecting the content, so it is very fast and handles any protocol; AWS's Network Load Balancer is an example. A layer 7 load balancer works at the application level (HTTP/HTTPS): it understands requests and can route by host name, path or header, terminate TLS, rewrite headers, and apply rules, such as sending `/api` to one service and `/` to another; the Application Load Balancer is an example. Both distribute traffic across healthy targets in multiple Availability Zones using health checks.",
    detail: [
      "Layer 7 enables path-based routing for microservices.",
      "Layer 4 suits non-HTTP protocols and extreme performance.",
      "Both need redundancy so that they are not a single point of failure.",
    ],
    ex: "An Application Load Balancer routes `/api/*` to the API service and everything else to the web front end.",
    mistakes: [
      "A single load balancer instance without redundancy.",
      "Using layer 7 features when only TCP is needed.",
    ],
    follow: ["Which can route by URL path?"],
    points: [
      "L4: TCP/UDP, address and port",
      "L7: HTTP-aware routing",
      "Health checks to healthy targets",
      "Redundant across zones",
    ],
    notes: ["L4 forwards, L7 understands."],
    src: [
      [
        "AWS: What is an Application Load Balancer?",
        `${ELB}/application/introduction.html`,
      ],
      [
        "AWS: What is a Network Load Balancer?",
        `${ELB}/network/introduction.html`,
      ],
    ],
  }),
  q({
    slug: "load-balancing-algorithms-design",
    topic: "Load balancing",
    d: "medium",
    title: "Which load balancing algorithms exist and how do you choose?",
    kw: [
      "round robin",
      "least connections",
      "ip hash",
      "weighted",
      "consistent hashing",
    ],
    intent: "Checks you can match an algorithm to a workload.",
    short:
      "Round robin sends requests to servers in turn and works when requests cost about the same. Weighted round robin gives stronger servers a larger share. Least connections sends each request to the server with the fewest active connections, which handles uneven request durations better. IP hash (or a hash of another key) sends the same client to the same server, giving a form of session affinity. Consistent hashing, used for caches and sharded stores, keeps most keys on the same node when nodes are added or removed. Pair any algorithm with health checks so that failed servers are skipped.",
    detail: [
      "Affinity helps with local caches but hurts even balancing and failover.",
      "nginx supports round robin, least_conn and ip_hash in its upstream block.",
      "Slow-start avoids overwhelming a freshly added server.",
    ],
    ex: "An API with a few slow endpoints uses least connections so slow requests do not pile up on one server.",
    mistakes: [
      "Round robin with very uneven request costs.",
      "Affinity as a replacement for shared state.",
    ],
    follow: ["What does least connections optimise for?"],
    points: [
      "Round robin and weighted",
      "Least connections for uneven work",
      "Hash for affinity",
      "Consistent hashing for caches",
    ],
    notes: ["Match the algorithm to request cost."],
    src: [
      [
        "nginx: Using nginx as HTTP load balancer",
        "https://nginx.org/en/docs/http/load_balancing.html",
      ],
      [
        "Azure Architecture Center: Load-balancing options",
        `${AZ}/guide/technology-choices/load-balancing-overview`,
      ],
    ],
  }),
  q({
    slug: "health-checks-and-failover",
    topic: "Load balancing",
    d: "medium",
    title:
      "How do health checks and redundancy remove single points of failure?",
    kw: [
      "health check",
      "failover",
      "redundancy",
      "single point of failure",
      "multi-az",
    ],
    intent: "Checks you design for failure.",
    short:
      "A single point of failure is any component whose loss takes the system down. Remove them with redundancy: several instances in more than one Availability Zone, replicated databases with automatic failover, and redundant load balancers. Health checks let the load balancer detect an unhealthy instance, such as one that fails an HTTP check or times out, and stop sending it traffic until it recovers, while auto scaling replaces it. A health endpoint should reflect the ability to serve requests, including critical dependencies, but stay fast. Test failover regularly, because untested failover tends to fail when needed.",
    detail: [
      "Deep health checks can cause cascading failures if a shared dependency blips.",
      "Graceful shutdown lets in-flight requests finish.",
      "Define availability targets such as 99.9 percent and design to meet them.",
    ],
    ex: "Two web servers in separate zones sit behind a load balancer; if one fails its health check, traffic goes to the other.",
    mistakes: [
      "One instance of the database with no standby.",
      "Health checks that never fail or are too expensive.",
    ],
    follow: ["What is a single point of failure?"],
    points: [
      "Redundancy across zones",
      "Health checks remove bad instances",
      "Replace via auto scaling",
      "Test failover",
    ],
    notes: ["Two of everything, checked."],
    src: [
      [
        "Azure Architecture Center: Health Endpoint Monitoring pattern",
        `${P}/health-endpoint-monitoring`,
      ],
      [
        "Azure Architecture Center: Design principles (redundancy)",
        `${AZ}/guide/design-principles/redundancy`,
      ],
    ],
  }),
  q({
    slug: "api-gateway-and-rate-limiting-design",
    topic: "Load balancing",
    d: "medium",
    title: "What does an API gateway do, and where does rate limiting fit?",
    kw: [
      "api gateway",
      "gateway routing",
      "rate limiting",
      "authentication offload",
      "single entry point",
    ],
    intent: "Checks you know the edge components of a service architecture.",
    short:
      "An API gateway is the single entry point to a set of backend services. It routes requests to the right service, can aggregate several calls into one response, and offloads cross-cutting concerns such as TLS termination, authentication, request validation, caching, logging and rate limiting, so each service does not reimplement them. Rate limiting or throttling at the gateway protects services from overload and abuse by capping requests per client in a time window and returning 429 when exceeded. The gateway must itself be highly available and not become a bottleneck or contain business logic.",
    detail: [
      "Limit by API key, user or IP depending on the use case.",
      "Throttling helps to meet service-level commitments for all clients.",
      "Keep the gateway thin.",
    ],
    ex: "Clients call one gateway domain, which authenticates them and routes `/orders` and `/users` to separate services.",
    mistakes: ["Business logic in the gateway.", "A single gateway instance."],
    follow: ["Why offload authentication to the gateway?"],
    points: [
      "Single entry point, routing and aggregation",
      "Offloads TLS, auth, caching",
      "Rate limiting protects backends",
      "Must be redundant",
    ],
    notes: ["One front door, thin and redundant."],
    src: [
      [
        "Azure Architecture Center: Gateway Routing pattern",
        `${P}/gateway-routing`,
      ],
      [
        "Azure Architecture Center: Gateway Offloading pattern",
        `${P}/gateway-offloading`,
      ],
      [
        "Azure Architecture Center: Rate Limiting pattern",
        `${P}/rate-limiting-pattern`,
      ],
    ],
  }),
  q({
    slug: "retries-circuit-breaker-bulkhead",
    topic: "Trade-offs",
    d: "hard",
    title:
      "How do retries, circuit breakers and bulkheads make a system resilient?",
    kw: [
      "retry with backoff",
      "circuit breaker",
      "bulkhead",
      "cascading failure",
      "timeouts",
    ],
    intent: "Checks you can protect a system from failing dependencies.",
    short:
      "Remote calls fail, so protect against it. Timeouts stop a call waiting forever. Retries with exponential backoff and jitter handle transient errors, but only for idempotent operations and with limits, since blind retries amplify load. A circuit breaker watches failures to a dependency and, past a threshold, 'opens' to fail fast instead of calling it, then lets a few trial requests through to see whether it recovered, which protects both the caller and the struggling service. A bulkhead isolates resources, like separate thread pools or connection limits per dependency, so one slow dependency cannot exhaust everything. Together they prevent cascading failures.",
    detail: [
      "Provide fallbacks such as cached data or a degraded response.",
      "Monitor breaker state changes.",
      "Combine with health checks and graceful degradation.",
    ],
    ex: "When the recommendations service is down, the product page loads without recommendations instead of failing.",
    mistakes: [
      "Unlimited retries without backoff.",
      "One shared pool for all downstream calls.",
    ],
    follow: ["What does an open circuit do?"],
    points: [
      "Timeouts and bounded retries",
      "Circuit breaker fails fast",
      "Bulkheads isolate resources",
      "Fallbacks degrade gracefully",
    ],
    notes: ["Fail fast, isolate, degrade."],
    src: [
      [
        "Azure Architecture Center: Circuit Breaker pattern",
        `${P}/circuit-breaker`,
      ],
      ["Azure Architecture Center: Retry pattern", `${P}/retry`],
      ["Azure Architecture Center: Bulkhead pattern", `${P}/bulkhead`],
    ],
  }),
  q({
    slug: "monolith-vs-microservices-tradeoffs",
    topic: "Trade-offs",
    d: "medium",
    title: "What are the trade-offs between a monolith and microservices?",
    kw: [
      "monolith",
      "microservices",
      "service boundaries",
      "deployment independence",
      "operational complexity",
    ],
    intent: "Checks you can argue both sides.",
    short:
      "A monolith deploys the whole application as one unit: it is simple to develop, test, deploy and debug early on, and calls are in-process, but it becomes harder to change and scale as it grows, because everything is released and scaled together. Microservices split the system into small services around business capabilities, each owning its data, deployed and scaled independently by small teams, and using different technologies. The price is distributed-system complexity: network latency and failures, data consistency across services, versioned APIs, observability and a heavier operations burden. Many teams start with a well-structured monolith and extract services only when needed.",
    detail: [
      "The strangler fig pattern migrates gradually.",
      "Microservices need strong automation, monitoring and a DevOps culture.",
      "Wrong boundaries create a 'distributed monolith'.",
    ],
    ex: "A start-up ships a modular monolith and later splits out the payments service when it needs separate scaling and compliance.",
    mistakes: [
      "Microservices for a small team and simple product.",
      "Services sharing one database.",
    ],
    follow: ["What is a distributed monolith?"],
    points: [
      "Monolith: simple, one unit",
      "Microservices: independent, complex operations",
      "Start simple, split when needed",
      "Boundaries follow business capabilities",
    ],
    notes: ["Complexity moves, it doesn't vanish."],
    src: [
      [
        "Azure Architecture Center: Microservices architecture style",
        `${AZ}/guide/architecture-styles/microservices`,
      ],
      [
        "Azure Architecture Center: Strangler Fig pattern",
        `${P}/strangler-fig`,
      ],
    ],
  }),
  q({
    slug: "latency-throughput-and-capacity-estimation",
    topic: "Trade-offs",
    d: "medium",
    title: "How do you do a back-of-the-envelope capacity estimate?",
    kw: [
      "capacity estimation",
      "qps",
      "storage estimate",
      "peak traffic",
      "latency vs throughput",
    ],
    intent: "Checks you can size a system roughly and state assumptions.",
    short:
      "State assumptions and compute orders of magnitude. For example, with 10 million daily active users each making 20 requests a day, that is 200 million requests a day, about 2,300 requests per second on average (200,000,000 divided by 86,400), and peaks of perhaps two to five times that. For storage, multiply records per day by record size and retention: 1 million new 1 KB records a day is about 1 GB a day, roughly 365 GB a year before replication and indexes. Bandwidth is requests per second times response size. Separate reads from writes, because the ratio drives design; latency and throughput are different goals.",
    detail: [
      "Round numbers and powers of ten are fine; reasoning matters more than precision.",
      "Plan for peaks, growth and replication overhead.",
      "Revisit estimates with real measurements.",
    ],
    ex: "A 1:100 write-to-read ratio justifies caching and read replicas.",
    code: [
      [
        "Quick maths",
        "text",
        `200,000,000 requests/day / 86,400 s  ≈ 2,300 requests/s\npeak at 3x                         ≈ 7,000 requests/s\n1,000,000 records/day * 1 KB       ≈ 1 GB/day  ≈ 365 GB/year`,
        [
          "Daily volume divided by seconds in a day gives requests per second.",
          "Peaks are a multiple of the average.",
          "Storage is count times size times time.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting peaks and replication.",
      "Mixing up latency and throughput.",
    ],
    follow: ["How do you convert requests per day to per second?"],
    points: [
      "State assumptions",
      "Daily to per-second conversion",
      "Include peaks and growth",
      "Separate reads and writes",
    ],
    notes: ["Order of magnitude is enough."],
    src: [
      [
        "AWS Well-Architected: Performance efficiency pillar",
        `${AWS}/wellarchitected/latest/performance-efficiency-pillar/welcome.html`,
      ],
      [
        "Azure Architecture Center: Design principles",
        `${AZ}/guide/design-principles/`,
      ],
    ],
  }),
  q({
    slug: "design-url-shortener-example",
    topic: "Trade-offs",
    d: "medium",
    title: "How would you design a URL shortener?",
    kw: ["url shortener", "key generation", "redirect", "read heavy", "cache"],
    intent: "A classic exercise that exercises most building blocks.",
    short:
      "Functional needs: create a short code for a long URL and redirect from the short URL. The workload is read-heavy, so redirects should be fast. A `POST /urls` creates a record with a unique short code, generated from an incrementing id encoded in base62 or from random bytes checked for collisions, and a `GET /{code}` looks it up and returns a `301` or `302` redirect. Store the mapping in a key-value or relational database indexed by code, put a cache (Redis) and a CDN in front for hot links, and run stateless app servers behind a load balancer. Add rate limiting and shard by code to scale.",
    detail: [
      "A 302 allows analytics on each hit; a 301 may be cached by browsers.",
      "Avoid predictable codes if links should be private.",
      "Handle custom aliases and collisions.",
    ],
    ex: "Seven base62 characters give over three trillion combinations, enough for years of links.",
    mistakes: [
      "Ignoring the read-heavy pattern.",
      "Using sequential ids that reveal volume.",
    ],
    follow: ["301 or 302?"],
    points: [
      "Create and redirect endpoints",
      "Unique code generation",
      "Cache hot links",
      "Read-heavy, scale and shard by code",
    ],
    notes: ["Fast lookup, unique codes."],
    src: [
      ["Azure Architecture Center: Cache-Aside pattern", `${P}/cache-aside`],
      [
        "MDN: HTTP redirections",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections",
      ],
    ],
  }),
  q({
    slug: "cqrs-event-driven-and-eventual-consistency",
    topic: "Trade-offs",
    d: "hard",
    title:
      "What are CQRS and event-driven architecture good for, and what do they cost?",
    kw: [
      "cqrs",
      "event-driven",
      "event sourcing",
      "read model",
      "eventual consistency",
    ],
    intent: "Checks you know advanced patterns and their trade-offs.",
    short:
      "Command Query Responsibility Segregation separates the model for writes (commands) from the model for reads (queries), so each can be shaped and scaled independently, for example a normalised write database and a denormalised read store updated from events. In an event-driven architecture, services publish events when something happens and others react asynchronously, which decouples them and scales well. Event sourcing stores the sequence of events as the source of truth. The costs are complexity, eventual consistency between write and read sides, harder debugging, and the need for idempotent handlers and careful event versioning, so use them where the benefits are real.",
    detail: [
      "Do not apply CQRS to simple CRUD applications.",
      "Materialised views precompute query results.",
      "Observability and tracing become more important.",
    ],
    ex: "Orders are written to a transactional database, and an event updates a search index used for fast queries.",
    mistakes: [
      "Using CQRS for a simple CRUD app.",
      "Surprising users with stale read models.",
    ],
    follow: ["What is the cost of CQRS?"],
    points: [
      "Separate write and read models",
      "Events decouple services",
      "Eventual consistency",
      "Extra complexity, use sparingly",
    ],
    notes: ["Powerful, but not free."],
    src: [
      ["Azure Architecture Center: CQRS pattern", `${P}/cqrs`],
      [
        "Azure Architecture Center: Event Sourcing pattern",
        `${P}/event-sourcing`,
      ],
      [
        "Azure Architecture Center: Event-driven architecture style",
        `${AZ}/guide/architecture-styles/event-driven`,
      ],
    ],
  }),
  q({
    slug: "monitoring-and-reliability-design",
    topic: "Trade-offs",
    d: "medium",
    title: "What should a production system monitor, and what are SLOs?",
    kw: [
      "monitoring",
      "slo",
      "availability target",
      "golden signals",
      "alerts",
    ],
    intent: "Checks you plan observability and reliability targets.",
    short:
      "Monitor the user-facing health of the system and its resources: latency, traffic, errors and saturation (the golden signals), plus dependency health, queue depth, cache hit ratio, database load, and business metrics such as orders per minute. A service level objective (SLO) is a target for a measurable indicator, such as 99.9 percent of requests succeed over 30 days, which implies an error budget you can spend on releases and risk. Alerts should signal conditions that need action and link to runbooks. Without measurement you cannot tell whether a design meets its requirements, or find bottlenecks and failures quickly.",
    detail: [
      "Availability targets translate into allowed downtime, for example 99.9 percent is about 43 minutes a month.",
      "Distributed tracing shows where time goes across services.",
      "Review incidents to improve.",
    ],
    ex: "An SLO of 99.9 percent success for checkout drives alerts when the error rate climbs.",
    mistakes: ["Alerting on everything.", "No agreed targets."],
    follow: ["What is an error budget?"],
    points: [
      "Latency, traffic, errors, saturation",
      "SLOs define targets",
      "Error budgets guide risk",
      "Actionable alerts",
    ],
    notes: ["Measure what users feel."],
    src: [
      [
        "Azure Architecture Center: Monitoring and diagnostics",
        `${AZ}/best-practices/monitoring`,
      ],
      [
        "AWS Well-Architected: Reliability pillar",
        `${AWS}/wellarchitected/latest/reliability-pillar/welcome.html`,
      ],
    ],
  }),
  q({
    slug: "background-jobs-and-claim-check",
    topic: "Queues",
    d: "medium",
    title:
      "How do you run background jobs, and what is the claim check pattern?",
    kw: [
      "background jobs",
      "worker",
      "claim check",
      "large messages",
      "scheduled jobs",
    ],
    intent: "Checks you can move heavy work off the request path.",
    short:
      "Background jobs run work outside the request-response cycle: sending emails, resizing images, generating reports or syncing data. Put a job description on a queue, and let worker processes consume it, with retries, a dead-letter queue, status tracking and idempotency; scheduled jobs run on a timer and must not run twice at once. Queues have message size limits, so for large payloads use the claim check pattern: store the data in blob or object storage and put only a reference, the claim check, in the message, so the consumer fetches the payload when it processes the job. This keeps messages small and the queue fast.",
    detail: [
      "Return a job id and let the client poll for status or receive a callback.",
      "Run workers separately so they scale independently.",
      "Monitor failures and queue age.",
    ],
    ex: "A video upload stores the file in object storage, then enqueues a message with its key for transcoding workers.",
    mistakes: [
      "Large payloads in messages.",
      "Cron jobs running on every app instance.",
    ],
    follow: ["What does a claim check contain?"],
    points: [
      "Move slow work to background workers",
      "Retries, DLQ, idempotency",
      "Claim check for large payloads",
      "Scheduled jobs run once",
    ],
    notes: ["Reference, don't carry the payload."],
    src: [
      [
        "Azure Architecture Center: Background jobs",
        `${AZ}/best-practices/background-jobs`,
      ],
      ["Azure Architecture Center: Claim-Check pattern", `${P}/claim-check`],
    ],
  }),
  q({
    slug: "design-for-failure-and-data-durability",
    topic: "Trade-offs",
    d: "hard",
    title: "How do you design for data durability and disaster recovery?",
    kw: [
      "backup",
      "rpo rto",
      "multi-region",
      "disaster recovery",
      "durability",
    ],
    intent: "Checks you think about losing data and whole regions.",
    short:
      "Decide the recovery point objective (RPO, how much data loss is acceptable) and recovery time objective (RTO, how long recovery may take), then choose the approach. Take automated backups and test restores; replicate data across Availability Zones, and, if needed, to another region. Strategies range from backup and restore (cheapest, slowest), through pilot light and warm standby, to active-active multi-region (fastest, most complex and costly). Keep infrastructure as code so environments can be rebuilt, document and rehearse the runbook, and remember that replication copies mistakes and deletions too, so backups remain necessary.",
    detail: [
      "Object storage and managed databases provide high durability, but not protection from your own mistakes.",
      "Cross-region adds latency and consistency challenges.",
      "Test failover regularly.",
    ],
    ex: "A warm standby in a second region receives replicated data and can take over within minutes.",
    mistakes: [
      "Replication treated as a backup.",
      "Never testing the recovery plan.",
    ],
    follow: ["What do RPO and RTO measure?"],
    points: [
      "RPO and RTO set the targets",
      "Backups plus replication",
      "Backup, pilot light, warm standby, active-active",
      "Rehearse recovery",
    ],
    notes: ["Choose recovery by RPO and RTO."],
    src: [
      [
        "Azure Architecture Center: Disaster recovery",
        `${AZ}/reliability/disaster-recovery`,
      ],
      [
        "AWS Well-Architected: Reliability pillar",
        `${AWS}/wellarchitected/latest/reliability-pillar/welcome.html`,
      ],
    ],
  }),
])
