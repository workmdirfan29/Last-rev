import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "components",
  title: "Components: building and organising them",
  topic: "Components",
  minutes: 60,
  overview:
    "Write function components, nest them, keep them pure, and decide how to split a screen into components.",
  objectives: [
    "Write and export components, and import them from other files",
    "Explain why components must be pure and never be defined inside other components",
    "Decide when to split a component",
  ],
  prerequisites: ["lesson.react.jsx"],
  sections: [
    {
      kind: "explain",
      heading: "A component is a function",
      body: [
        "A **component** is a JavaScript function that returns JSX. It can return markup, `null`, or another component. You can use it as a tag, and each use creates a separate instance with its own state.",
        "Put each component in its own file when it grows, with `export default` or a named `export`, and `import` it where needed. Name the file after the component, such as `ProfileCard.jsx`.",
        "A component can contain other components. This makes a **tree**: the top component is the root, and the others are its children and descendants. Data flows down the tree through props.",
      ],
    },
    {
      kind: "code",
      heading: "Nesting",
      example: {
        title: "Components inside components",
        language: "jsx",
        code: 'function Avatar({ src, name }) {\n  return <img className="avatar" src={src} alt={name} />;\n}\n\nfunction UserRow({ user }) {\n  return (\n    <li>\n      <Avatar src={user.photo} name={user.name} />\n      <span>{user.name}</span>\n    </li>\n  );\n}\n\nexport default function UserList({ users }) {\n  return <ul>{users.map((u) => <UserRow key={u.id} user={u} />)}</ul>;\n}',
        walkthrough: [
          "`Avatar` is the smallest piece, and `UserRow` uses it.",
          "`UserList` renders one `UserRow` for each user, and gives each row a `key`.",
          "Each component has one job, and each one can be tested and reused alone.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Pure components",
      body: [
        "A component must be **pure**: with the same props and state, it returns the same JSX, and it does not change variables that were created before the render. Changing a value that you created during the same render is fine. Changing a variable outside the component is not.",
        "Pure components are predictable, so React can call them more than once, skip work, and render in the background. In development, `StrictMode` calls components twice to help you find mistakes.",
        "Never define a component **inside** another component. The inner function is a new component on every render, so React throws away its state and rebuilds it each time. Define components at the top level of the file.",
      ],
    },
    {
      kind: "code",
      heading: "An impure component",
      example: {
        title: "A hidden bug",
        language: "jsx",
        code: "let count = 0;\n\nfunction BadCounter() {\n  count = count + 1;\n  return <p>Rendered {count} times</p>;\n}\n\nfunction GoodLabel({ count }) {\n  return <p>Rendered {count} times</p>;\n}",
        walkthrough: [
          "`BadCounter` changes a variable outside itself while it renders, so it shows different results for the same input.",
          "In `StrictMode` it would even skip a number, because it renders twice.",
          "`GoodLabel` only reads its props, so it is pure and predictable.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Defining a component inside another component.",
          fix: "Move it to the top level. Pass data with props.",
        },
        {
          mistake: "Changing a global variable during rendering.",
          fix: "Keep state in `useState`, and change it in event handlers.",
        },
        {
          mistake: "Creating one huge component for the whole page.",
          fix: "Split it by responsibility into smaller components.",
        },
        {
          mistake: "Splitting into tiny components for every tag.",
          fix: "Split where there is reuse, a clear name, or separate state.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "When to split",
      scenario:
        "A 300-line `Dashboard` component has a header, a filter bar, a table and a chart, and the code is hard to read.",
      body: [
        "Extract `FilterBar`, `OrdersTable` and `SalesChart`, each with its own props. The `Dashboard` now only arranges the pieces and holds the shared state.",
        "A good sign is that a component can be described in one short sentence.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pure-def",
      prompt: "What makes a component pure?",
      options: [
        "The same props and state always give the same JSX",
        "It has no props",
        "It never uses state",
      ],
      answer: 0,
      explanation:
        "Purity is about predictability, not about the absence of state.",
    },
    {
      type: "single",
      id: "inner-component",
      prompt:
        "What is wrong with defining a component inside another component?",
      options: [
        "It is recreated on every render and loses its state",
        "It cannot receive props",
        "It cannot return JSX",
      ],
      answer: 0,
      explanation:
        "The inner function is a new component each time, so React cannot keep its state.",
    },
    {
      type: "truefalse",
      id: "file-per-component",
      statement: "A component must be in its own file.",
      answer: false,
      explanation: "It is a good habit when it grows, but not a rule.",
    },
    {
      type: "blank",
      id: "export-kw",
      prompt:
        "To use a component in another file, write `___ default function App() { ... }` in its file.",
      answer: "export",
      explanation:
        "`export default` makes the component available to `import` in other files.",
    },
  ],
  assignment: {
    title: "Break up a page",
    task: [
      "Take a page design with at least five areas, such as a header, a search bar, a list, cards and a footer.",
      "Write the component tree on paper first, then build it with one file per component, and pass the data down with props.",
    ],
    checklist: [
      "No component is defined inside another",
      "Each component has a short, clear name",
      "The page looks the same as the design",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "pure-fix",
      title: "Make it pure",
      task: [
        "This component changes a variable outside itself. Rewrite it so that it is pure and still shows the total.",
      ],
      language: "jsx",
      starter:
        "let total = 0;\n\nfunction Cart({ prices }) {\n  prices.forEach((p) => {\n    total += p;\n  });\n  return <p>Total: {total}</p>;\n}",
      solution:
        "function Cart({ prices }) {\n  const total = prices.reduce((sum, p) => sum + p, 0);\n  return <p>Total: {total}</p>;\n}",
      hints: ["Calculate the value from the props inside the component."],
      checklist: [
        "There is no variable outside the component",
        "The total is correct on every render",
        "Rendering twice gives the same result",
      ],
    },
  ],
  revisionNotes: [
    "A component is a function that returns JSX; use it as a tag",
    "Components must be pure and defined at the top level",
    "Data flows down the tree through props",
    "Split by responsibility and reuse",
  ],
  resources: [
    {
      label: "React: Your First Component",
      url: "https://react.dev/learn/your-first-component",
    },
    {
      label: "React: Keeping Components Pure",
      url: "https://react.dev/learn/keeping-components-pure",
    },
    {
      label: "React: Importing and Exporting Components",
      url: "https://react.dev/learn/importing-and-exporting-components",
    },
  ],
})
