import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "lists-and-keys",
  title: "Rendering lists and keys",
  topic: "Lists",
  minutes: 40,
  overview:
    "Render arrays with map, choose good keys, and filter and sort data for display.",
  objectives: [
    "Render an array of data as a list of elements",
    "Choose stable, unique keys",
    "Filter and sort for display without changing the original array",
  ],
  prerequisites: ["lesson.react.state"],
  sections: [
    {
      kind: "explain",
      heading: "Rendering a list",
      body: [
        "To show an array, **map** each item to a piece of JSX: `{items.map((item) => <li key={item.id}>{item.name}</li>)}`. `map` returns a new array of elements, and React renders them all in order.",
        "Every element in a list needs a **key**: a string or number that is unique among its siblings. React uses the key to know which item is which when the list changes, so it can keep the state, the focus and the DOM nodes of the right items. The key goes on the element returned by `map`, and is not passed to your component as a prop.",
        "Good keys are stable identities from the data, such as an id from a database. Do not generate keys while rendering, for example with `Math.random()`, because every render would give new keys.",
      ],
    },
    {
      kind: "code",
      heading: "Filter, sort and render",
      example: {
        title: "A list from data",
        language: "jsx",
        code: "function ProductList({ products, query, sortBy }) {\n  const visible = products\n    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))\n    .toSorted((a, b) => a[sortBy] - b[sortBy]);\n\n  if (visible.length === 0) return <p>No products match.</p>;\n\n  return (\n    <ul>\n      {visible.map((p) => (\n        <li key={p.id}>\n          {p.name}: {p.price}\n        </li>\n      ))}\n    </ul>\n  );\n}",
        walkthrough: [
          "`filter` and `toSorted` create new arrays, so the `products` prop is not changed.",
          "An empty result is handled with a message.",
          "Each `li` has a stable `key` from the data. The list is calculated while rendering, with no extra state.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Choosing keys",
      body: [
        "Use the **id** of the data. If your data has none, create ids when you create or load the items, and not during rendering. An array index is acceptable only for a list that never changes order and is never filtered, because it identifies a position and not an item.",
        "When a `map` returns more than one element for each item, use a fragment with a key: `<Fragment key={item.id}>...</Fragment>`. The short form `<>` cannot take a key.",
        "Keys must be **unique among siblings**, not across the whole app. Two different lists may use the same ids.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting the key.",
          fix: "Add `key` to the outermost element returned by `map`. React shows a warning in development.",
        },
        {
          mistake:
            "Using the index as a key for a list that is sorted or edited.",
          fix: "Use a stable id.",
        },
        {
          mistake:
            "Using `Math.random()` or `crypto.randomUUID()` as a key during rendering.",
          fix: "Create the id once, when the item is created.",
        },
        {
          mistake: "Sorting a state array in place with `sort()`.",
          fix: "Copy first, or use `toSorted`, because `sort` changes the array.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A chat window",
      scenario:
        "New messages are added at the bottom, and old ones may be deleted.",
      body: [
        "Each message has an id from the server and is rendered with that id as a key. Deleting one message removes only its element, and the others keep their state, for example an open menu.",
        "With index keys, deleting a message would shift every key below it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "key-where",
      prompt: "Where does the key go?",
      options: [
        "On the element returned by map",
        "Inside the child component as a prop",
        "On the array",
      ],
      answer: 0,
      explanation:
        "The key belongs to the outermost element in the `map` callback, so React can identify each item.",
    },
    {
      type: "single",
      id: "good-key",
      prompt:
        "Which is the best key for a list of orders loaded from a server?",
      options: ["The order id", "Math.random()", "The position in the array"],
      answer: 0,
      explanation:
        "A stable id from the data identifies the same order across renders.",
    },
    {
      type: "truefalse",
      id: "key-prop",
      statement: "A component can read its own `key` through `props.key`.",
      answer: false,
      explanation:
        "React uses `key` itself. It is not passed to the component.",
    },
    {
      type: "blank",
      id: "map-method",
      prompt:
        "To turn an array of data into an array of elements, use the array method ___.",
      answer: "map",
      explanation: "`map` returns a new array with one element for each item.",
    },
  ],
  assignment: {
    title: "A searchable table",
    task: [
      "Build a table of at least 15 rows from an array, with a search box, a sort button and a message for an empty result.",
      "Use stable keys and do not change the original array.",
    ],
    checklist: [
      "No key warnings in the console",
      "Sorting does not change the source array",
      "The empty state shows a message",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "list-key",
      title: "Fix the list",
      task: ["This list has three problems with keys and updates. Fix them."],
      language: "jsx",
      starter:
        "function Tags({ tags }) {\n  tags.sort();\n  return (\n    <ul>\n      {tags.map((t, i) => (\n        <li>{t.name}</li>\n      ))}\n    </ul>\n  );\n}",
      solution:
        "function Tags({ tags }) {\n  const sorted = tags.toSorted((a, b) => a.name.localeCompare(b.name));\n  return (\n    <ul>\n      {sorted.map((t) => (\n        <li key={t.id}>{t.name}</li>\n      ))}\n    </ul>\n  );\n}",
      hints: [
        "One problem changes the prop, one is a missing key, one sorts objects the wrong way.",
      ],
      checklist: [
        "The prop is not changed",
        "Each item has a stable key",
        "The objects are compared by name",
      ],
    },
  ],
  revisionNotes: [
    "`map` data to elements; every item needs a stable, unique key",
    "The key goes on the element returned by map, and is not a prop",
    "Filter and sort copies; never sort state in place",
    "Index keys are only for fixed lists",
  ],
  resources: [
    {
      label: "React: Rendering Lists",
      url: "https://react.dev/learn/rendering-lists",
    },
  ],
})
