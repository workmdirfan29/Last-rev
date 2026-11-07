import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "jpa-caching",
  title: "Caching: the first-level and second-level cache",
  topic: "Caching",
  minutes: 60,
  overview:
    "Understand the persistence context as a first-level cache, dirty checking, and when a second-level or query cache is worth its risks.",
  objectives: [
    "Explain the persistence context and identity guarantee",
    "Explain dirty checking and flush",
    "Decide when a second-level cache is appropriate",
  ],
  prerequisites: ["lesson.hibernate-jpa.fetching-lazy-eager-and-dtos"],
  sections: [
    {
      kind: "explain",
      heading: "The first-level cache",
      body: [
        "The **persistence context** is the set of entities that an `EntityManager`, also called a session, currently manages, and it acts as the **first-level cache**. Within it, each database row is represented by **at most one entity object**, so loading the same id twice in one transaction returns the **same Java object**, with only one query. `find` checks the persistence context first. It is always on, it is scoped to the session or transaction, and it is **not shared** between requests. A very long transaction that loads many entities makes the context large, and `clear` or `detach` can free it.",
        "A JPQL query still goes to the database, but the returned rows are matched with the managed entities.",
      ],
    },
    {
      kind: "code",
      heading: "Same id, same object",
      example: {
        title: "The identity map",
        language: "java",
        code: "@Transactional\nvoid demo(EntityManager em) {\n  Product a = em.find(Product.class, 5L);   // SQL select\n  Product b = em.find(Product.class, 5L);   // no SQL, served from the context\n  System.out.println(a == b);               // true\n}",
        walkthrough: [
          "The first call runs a select.",
          "The second call returns the managed entity from the first-level cache.",
          "Both references point to the same object.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Dirty checking and flush",
      body: [
        "**Dirty checking** means that the provider remembers the state of each managed entity when it was loaded, and at **flush** time compares it with the current state and generates `UPDATE` statements for the entities that changed. This is why a managed entity needs no `save` call. A **flush** sends the pending changes, inserts, updates and deletes, to the database, but it is **not a commit**. It happens automatically before a transaction commits, and usually before a query that could be affected, or when you call `flush()`. So SQL is sent **later** than the Java code that caused it, and an exception may appear at commit and not on the line that changed the entity.",
      ],
    },
    {
      kind: "explain",
      heading: "The second-level and query cache",
      body: [
        "The **second-level cache** is an optional cache **shared by all sessions** of a session factory, so entity data can be reused across transactions without going to the database. It needs a cache provider and cacheable entities, for example with `@Cacheable`. It suits data that is **read often and changes rarely**, such as reference data, and it brings the risks of **stale data** and extra memory use, especially in a cluster. Updates made outside the application are not seen until the entry expires. A **query cache** stores query results, but it is invalidated whenever the related tables change, so it helps in narrow cases. **Measure before adding either.**",
        "An application-level cache, such as Spring's cache abstraction, is often simpler to reason about.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Expecting the first-level cache to be shared between users.",
          fix: "It lives for one session or transaction.",
        },
        {
          mistake: "Calling `save` on every managed entity out of habit.",
          fix: "Changes to managed entities are written at flush.",
        },
        {
          mistake: "Loading huge numbers of entities in one transaction.",
          fix: "Process in batches and clear the context.",
        },
        {
          mistake:
            "Caching frequently changing data in the second-level cache.",
          fix: "Cache only read-mostly data.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A country list",
      scenario:
        "An application reads a list of 200 countries on almost every page and changes it once a year.",
      body: [
        "The countries are a good candidate for a second-level cache, or a simple application cache with expiry. Orders, which change all the time, are not cached.",
        "The decision follows how often the data changes.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ca-first",
      prompt: "What is the first-level cache?",
      options: [
        "The persistence context of a session",
        "A shared cache in Redis",
        "The database buffer",
      ],
      answer: 0,
      explanation: "It is always on and not shared.",
    },
    {
      type: "single",
      id: "ca-dirty",
      prompt: "What does dirty checking do?",
      options: [
        "Detects changed entities and writes UPDATEs at flush",
        "Deletes invalid data",
        "Validates input",
      ],
      answer: 0,
      explanation: "A managed entity needs no explicit save.",
    },
    {
      type: "truefalse",
      id: "ca-flush",
      statement: "A flush commits the transaction.",
      answer: false,
      explanation:
        "It sends the SQL, but the transaction can still be rolled back.",
    },
    {
      type: "single",
      id: "ca-second",
      prompt: "When is a second-level cache a good idea?",
      options: [
        "For read-mostly reference data",
        "For frequently changing data",
        "Always",
      ],
      answer: 0,
      explanation: "Stale data is the main risk.",
    },
  ],
  assignment: {
    title: "Observe the caches",
    task: [
      "Load the same entity twice in a transaction and show that one SQL runs, and that both references are the same object.",
      "Change a managed entity without calling save and show the UPDATE at commit, with SQL logging.",
    ],
    checklist: [
      "I saw one select for two finds",
      "I saw the update at commit",
      "I can explain when I would add a second-level cache",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "ca-ex",
      title: "Predict the SQL",
      task: [
        "For this code, write in a comment how many SQL statements run and which: a select, an update, or both.\n",
      ],
      language: "java",
      starter:
        '@Transactional\nvoid rename(Long id) {\n  Product p = repository.findById(id).orElseThrow();\n  p.setName("New name");\n}',
      solution:
        '@Transactional\nvoid rename(Long id) {\n  // One select to load the product, then one update at commit: the entity is managed,\n  // so dirty checking finds the change. No save call is needed.\n  Product p = repository.findById(id).orElseThrow();\n  p.setName("New name");\n}',
      hints: ["The entity is managed, and the transaction commits at the end."],
      checklist: ["One select", "One update at commit", "No save call"],
    },
  ],
  revisionNotes: [
    "First-level cache = persistence context: one entity per id per session; always on",
    "Dirty checking at flush; flush ≠ commit",
    "Second-level cache: optional, shared, read-mostly data; stale-data risk",
    "Measure before adding caches",
  ],
  resources: [
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
    {
      label: "Hibernate ORM Documentation",
      url: "https://hibernate.org/orm/documentation/",
    },
  ],
})
