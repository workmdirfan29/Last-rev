import { defineLesson } from "@/data/lessons/author"

export default defineLesson("hibernate-jpa", {
  slug: "entity-lifecycle",
  title: "The entity life cycle: persist, merge, remove and detach",
  topic: "Entity lifecycle",
  minutes: 50,
  overview:
    "Know the four entity states and what persist, merge, remove and Spring Data's save do.",
  objectives: [
    "Name the four states of an entity",
    "Explain persist versus merge and how save chooses",
    "Know when changes are saved automatically",
  ],
  prerequisites: ["lesson.hibernate-jpa.jpa-transactions-and-locking"],
  sections: [
    {
      kind: "explain",
      heading: "Four states",
      body: [
        "An entity is in one of four states. **New**, or transient: created with `new`, not associated with a persistence context, and not in the database. **Managed**, or persistent: attached to a persistence context, and any change is written to the database at flush. **Detached**: it has a database identity, but its persistence context is closed, or it was detached, so changes are no longer tracked. **Removed**: scheduled for deletion at flush.",
        "After the transaction ends, entities become **detached**. A change to a detached entity is **not saved**. An entity that was loaded and changed inside a transaction needs no explicit `save`.",
      ],
    },
    {
      kind: "explain",
      heading: "persist, merge, remove and save",
      body: [
        "**`persist(entity)`** makes a new entity managed, and the **same instance** becomes managed. It must not already have a database identity. **`merge(entity)`** is for a detached or new entity: it copies the state onto a managed instance, which it loads or creates, and **returns that managed copy**, while the instance you passed stays unmanaged. After `merge`, **use the returned object**. **`remove(entity)`** marks a managed entity for deletion.",
        "Spring Data's **`save`** decides which to call: if the entity is new, which means it has no id or version, it calls `persist`, and otherwise `merge`. `merge` can issue a select first. Entities with assigned ids and no version field may be treated as not new, which causes a merge and an extra select.",
      ],
    },
    {
      kind: "code",
      heading: "Managed and detached",
      example: {
        title: "What is saved",
        language: "java",
        code: '@Transactional\nvoid rename(Long id, String name) {\n  Product p = repository.findById(id).orElseThrow();   // managed\n  p.setName(name);                                      // saved at commit, no save call\n}\n\nProduct detached = repository.findById(1L).orElseThrow();   // transaction ended: detached\ndetached.setName("lost");                                 // not saved\nProduct saved = repository.save(detached);                // merge: use the returned instance',
        walkthrough: [
          "Inside the transaction the product is managed, so dirty checking saves the change at commit.",
          "Outside a transaction, the entity is detached, and the change is not saved by itself.",
          "`save` on a detached entity merges it, and returns the managed copy.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Why it matters",
      body: [
        "Many bugs come from the wrong mental model: expecting a change to a detached entity to be saved, calling `persist` on an entity that has an id and is detached, or using the passed instance after `merge`. When you load, change and save inside one service transaction, the entity stays managed, and everything works without extra calls.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Expecting a change to a detached entity to be saved.",
          fix: "Load it in a transaction, or merge it.",
        },
        {
          mistake: "Calling `persist` on a detached entity.",
          fix: "Use `merge`, or `save`.",
        },
        {
          mistake: "Using the instance that you passed to `merge`.",
          fix: "Use the returned instance.",
        },
        {
          mistake: "Calling `save` on every managed entity out of habit.",
          fix: "It is not needed inside the transaction.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An update endpoint",
      scenario: "A REST endpoint updates a product with data from a request.",
      body: [
        "The service loads the product by id inside a transaction, copies the allowed fields from the request, and returns a DTO. No `save` is needed, and the controller never sees a detached entity.",
        "This also avoids binding the request onto an entity.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "lc-managed",
      prompt: "What happens to a change on a managed entity?",
      options: [
        "It is written at flush or commit",
        "It is ignored",
        "It throws an exception",
      ],
      answer: 0,
      explanation: "That is dirty checking.",
    },
    {
      type: "single",
      id: "lc-merge",
      prompt: "What does merge return?",
      options: [
        "The managed copy",
        "The same instance that was passed",
        "void",
      ],
      answer: 0,
      explanation: "Use the returned object.",
    },
    {
      type: "truefalse",
      id: "lc-detached",
      statement: "A change to a detached entity is saved automatically.",
      answer: false,
      explanation: "Detached entities are not tracked.",
    },
    {
      type: "multi",
      id: "lc-states",
      prompt: "Which are entity states?",
      options: ["New", "Managed", "Detached", "Frozen"],
      answers: [0, 1, 2],
      explanation: "The fourth state is Removed.",
    },
  ],
  assignment: {
    title: "Trace the states",
    task: [
      "Write a test that creates, saves, loads, detaches and merges an entity, printing its state at each step.",
      "Show that a change after the transaction is lost, and that a change inside is saved without calling save.",
    ],
    checklist: [
      "I named the state at each step",
      "I used the merge result",
      "The lost update is demonstrated",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "lc-ex",
      title: "Write the service method",
      task: [
        "Write `@Transactional ProductDto rename(Long id, String name)` that loads the product, changes the name and returns a DTO, without calling save.",
      ],
      language: "java",
      starter:
        "@Transactional\nProductDto rename(Long id, String name) {\n  // your code\n}",
      solution:
        "@Transactional\nProductDto rename(Long id, String name) {\n  Product product = repository.findById(id).orElseThrow();\n  product.setName(name);\n  return ProductDto.from(product);\n}",
      hints: [
        "The entity is managed in the transaction, so the change is saved at commit.",
      ],
      checklist: [
        "No save call",
        "The method is transactional",
        "A DTO is returned",
      ],
    },
  ],
  revisionNotes: [
    "States: new, managed, detached, removed",
    "persist (new → managed), merge (copy to a managed instance, use the result), remove",
    "save = persist or merge; managed entities need no save",
    "Detached entities are not tracked",
  ],
  resources: [
    {
      label: "Jakarta Persistence Specification",
      url: "https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html",
    },
    {
      label: "Spring Data JPA Reference: Saving Entities",
      url: "https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html",
    },
  ],
})
