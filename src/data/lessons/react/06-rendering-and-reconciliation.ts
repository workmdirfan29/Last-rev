import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "rendering-and-reconciliation",
  title: "How rendering works: render, commit and reconciliation",
  topic: "Rendering",
  minutes: 75,
  overview:
    "Understand when components render, what React does in the render and commit phases, why keys and positions matter for state, and what Strict Mode checks.",
  objectives: [
    "Describe the trigger, render and commit steps",
    "Explain when a component renders again, and that a child renders when its parent renders",
    "Explain how state is tied to the position in the tree and to keys",
  ],
  prerequisites: ["lesson.react.state"],
  sections: [
    {
      kind: "explain",
      heading: "Trigger, render, commit",
      body: [
        "React updates the screen in three steps. First something **triggers** a render: the first render of the app, or a state update of a component. Then React **renders**: it calls your components to find out what should be on the screen. Finally React **commits**: it applies the differences to the real DOM, and only the nodes that changed are touched.",
        "Rendering is **not** the same as updating the DOM. A component can render, and the result may be the same as before, so nothing changes on the page. Rendering must be pure, because React may do it more than once.",
        "After the commit, the browser paints the page, and then React runs effects. This order is why code that reads the layout belongs in effects, and not in the render.",
      ],
    },
    {
      kind: "explain",
      heading: "When does a component render again",
      body: [
        "A component renders again when its **own state** changes, when its **parent renders**, or when a **context** it reads changes. The second case matters: when a component renders, all the components it returns render too, by default, even if their props did not change.",
        "This is usually fast and fine. It becomes a problem only when a render is slow. Later lessons show the tools for that. Do not add them before you have measured a problem.",
        "State updates in one event handler are **batched**: if you call several setters, React renders once after the handler. Since React 18, this is also true for updates in timeouts and promises.",
      ],
    },
    {
      kind: "code",
      heading: "Parent and child renders",
      example: {
        title: "A child renders with its parent",
        language: "jsx",
        code: "function Child() {\n  console.log('Child rendered');\n  return <p>child</p>;\n}\n\nexport default function Parent() {\n  const [n, setN] = useState(0);\n  console.log('Parent rendered');\n  return (\n    <>\n      <button onClick={() => setN(n + 1)}>{n}</button>\n      <Child />\n    </>\n  );\n}",
        walkthrough: [
          "Clicking the button changes the state of `Parent`, so `Parent` renders again.",
          "`Child` has no props and no state, but it renders again too, because its parent rendered.",
          "Nothing in the real DOM changes for `Child`: its output is the same, so the commit leaves it alone.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Reconciliation, position and keys",
      body: [
        "To find the differences, React compares the new tree with the old one. This is called **reconciliation**. If the element at the same **position** in the tree has the same type, React keeps the existing instance and its **state**, and updates its props. If the type is different, React destroys the old one and creates a new one, and the state is lost.",
        "In lists, the position is not enough when items are added, removed or moved. A **key** gives each item an identity, so React can match items between renders. You can also use a key on purpose to **reset** state: changing the `key` of a component makes React treat it as a new component.",
        "This is why defining a component inside another is a bug, and why an `input` can keep its text when a different component is shown in the same place.",
      ],
    },
    {
      kind: "code",
      heading: "Keys reset state",
      example: {
        title: "A key as an identity",
        language: "jsx",
        code: "function Editor({ userId }) {\n  const [draft, setDraft] = useState('');\n  return <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />;\n}\n\nexport default function Page({ userId }) {\n  return <Editor key={userId} userId={userId} />;\n}",
        walkthrough: [
          "Without the `key`, switching `userId` would keep the same `Editor` instance, and the draft of the previous user would stay.",
          "With `key={userId}`, a new user means a new key, so React creates a fresh `Editor` with an empty draft.",
          "A key tells React that this is a different component, even at the same position.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Strict Mode and purity",
      body: [
        "`StrictMode` is a development tool. It renders components **twice** and re-runs effects once extra, to help you find impure code and missing clean-up. The extra work does not happen in production builds.",
        "If a component behaves differently on the second render, it is impure. A typical cause is changing a variable outside the component, or reading something that changes, such as `Date.now()`, to decide the output. Move such code to an event handler or an effect.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Thinking that a render always changes the DOM.",
          fix: "Rendering only calculates the result. React changes the DOM only where the result differs.",
        },
        {
          mistake:
            "Using the array index as a key in a list that can be reordered.",
          fix: "Use a stable id. Index keys mix up state between items.",
        },
        {
          mistake: "Adding memoisation everywhere to avoid renders.",
          fix: "Renders are cheap. Measure first, and optimise only slow parts.",
        },
        {
          mistake:
            "Putting a side effect in the render because it works in development.",
          fix: "Strict Mode runs it twice. Use an event handler or an effect.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Explaining a slow screen",
      scenario:
        "A product list feels slow when the user types in a search box above it.",
      body: [
        "Each key press changes the state in the parent, so the parent and the whole list render again. First measure with the React Profiler. If the list render is the cost, memoise the list items or move the input state into its own component.",
        "Knowing that children render with the parent tells you where to look.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "render-vs-commit",
      prompt: "What happens in the commit phase?",
      options: [
        "React applies the changes to the DOM",
        "React calls your components",
        "React fetches the data",
      ],
      answer: 0,
      explanation:
        "Render calls components to get the description. Commit applies the differences to the DOM.",
    },
    {
      type: "multi",
      id: "rerender-causes",
      prompt: "Which of these makes a component render again?",
      options: [
        "Its state changes",
        "Its parent renders",
        "A context it reads changes",
        "A normal variable inside it changes",
      ],
      answers: [0, 1, 2],
      explanation:
        "A normal variable does not trigger a render. Only state, a parent render or a changed context does.",
    },
    {
      type: "truefalse",
      id: "key-reset",
      statement:
        "Changing the key of a component makes React create a new instance and reset its state.",
      answer: true,
      explanation:
        "A different key means a different identity, so the old instance is destroyed.",
    },
    {
      type: "single",
      id: "index-key",
      prompt: "Why can an array index be a bad key?",
      options: [
        "Items that move keep the wrong state",
        "Indexes are not allowed",
        "It makes rendering slower in all cases",
      ],
      answer: 0,
      explanation:
        "When items are reordered, the index no longer identifies the same item, so state attaches to the wrong one.",
    },
  ],
  assignment: {
    title: "Observe renders",
    task: [
      "Add `console.log` to a parent, a child and a memoised child, and change the parent state.",
      "Write down which components render, then change a key and show that state resets.",
    ],
    checklist: [
      "I can say why each log appeared",
      "I showed a key reset the state of a component",
      "I opened the Profiler and recorded one interaction",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "render-quiz",
      title: "Predict the renders",
      task: [
        'A `Parent` has state `count` and renders `<Child label="a" />` and `<Sibling />`. In a comment, write which of these render when `count` changes, and why. Then add one change that stops `Child` from rendering again.',
      ],
      language: "jsx",
      starter:
        '// Which components render again when count changes, and why?\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  return (\n    <>\n      <button onClick={() => setCount(count + 1)}>{count}</button>\n      <Child label="a" />\n      <Sibling />\n    </>\n  );\n}',
      solution:
        "// Parent, Child and Sibling render again: a child renders whenever its parent renders,\n// even when its props did not change.\n// To skip Child, wrap it with memo, so it renders again only when label changes.\nimport { memo } from 'react';\n\nconst Child = memo(function Child({ label }) {\n  return <p>{label}</p>;\n});\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  return (\n    <>\n      <button onClick={() => setCount(count + 1)}>{count}</button>\n      <Child label=\"a\" />\n      <Sibling />\n    </>\n  );\n}",
      hints: ["A memoised component renders again only when its props change."],
      checklist: [
        "I named all three components as rendering",
        "I wrapped Child in memo",
        "I can explain why Sibling still renders",
      ],
    },
  ],
  revisionNotes: [
    "Render phases: trigger → render (call components) → commit (update the DOM)",
    "A component renders when its state changes, its parent renders, or its context changes",
    "State belongs to the position in the tree; a key gives an identity and can reset state",
    "Strict Mode double-renders in development to expose impure code",
  ],
  resources: [
    {
      label: "React: Render and Commit",
      url: "https://react.dev/learn/render-and-commit",
    },
    {
      label: "React: Preserving and Resetting State",
      url: "https://react.dev/learn/preserving-and-resetting-state",
    },
    {
      label: "React: StrictMode",
      url: "https://react.dev/reference/react/StrictMode",
    },
  ],
})
