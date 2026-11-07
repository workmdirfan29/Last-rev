import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "state",
  title: "State: remembering values with useState",
  topic: "State",
  minutes: 50,
  overview:
    "Add state to a component, understand how updates are queued and batched, and update objects and arrays without changing them.",
  objectives: [
    "Use useState and explain what happens when the setter is called",
    "Use the updater form when the new value depends on the old one",
    "Update objects and arrays immutably",
  ],
  prerequisites: ["lesson.react.props"],
  sections: [
    {
      kind: "explain",
      heading: "Why state",
      body: [
        "A normal variable inside a component is lost when the component renders again, and changing it does not make React render. **State** solves both problems. React keeps the state value between renders, and calling the **setter** function tells React to render the component again with the new value.",
        "You add state with the `useState` hook: `const [count, setCount] = useState(0)`. It returns the current value and the setter. The value given to `useState` is only the **initial** value, used the first time.",
        "Each instance of a component has its own state. Two `Counter` components on a page do not share their counts.",
      ],
    },
    {
      kind: "code",
      heading: "A counter",
      example: {
        title: "useState",
        language: "jsx",
        code: "import { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Add one</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}",
        walkthrough: [
          "`count` is the current value, and `setCount` asks React to change it.",
          "Clicking a button calls the setter. React renders `Counter` again, and now `count` has the new value.",
          "The handler is a function that runs later, so it is allowed to change state. Rendering itself must not.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "State is a snapshot",
      body: [
        "During one render, the state variable has **one fixed value**. Calling `setCount(count + 1)` three times in the same handler does not add three: each call uses the same `count`, and the final value is `count + 1`.",
        "When the next value depends on the previous one, pass an **updater function**: `setCount((c) => c + 1)`. React calls it with the latest queued value. Three updater calls add three. React also **batches** the updates from one event, so it renders once after the handler finishes.",
        "Calling the setter does not change the variable in the current handler. The new value is available in the next render.",
      ],
    },
    {
      kind: "code",
      heading: "Snapshot and updater",
      example: {
        title: "Three updates",
        language: "jsx",
        code: "function Triple() {\n  const [n, setN] = useState(0);\n\n  function addDirect() {\n    setN(n + 1);\n    setN(n + 1);\n    setN(n + 1);\n  }\n  function addUpdater() {\n    setN((c) => c + 1);\n    setN((c) => c + 1);\n    setN((c) => c + 1);\n  }\n  return (\n    <>\n      <p>{n}</p>\n      <button onClick={addDirect}>+1 (three calls)</button>\n      <button onClick={addUpdater}>+3 (updater)</button>\n    </>\n  );\n}",
        walkthrough: [
          "In `addDirect`, every call uses the same `n`, so starting from `0`, the result is `1`.",
          "In `addUpdater`, each call receives the result of the previous one, so the result is `3`.",
          "Use the updater form whenever the new state is based on the old state.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Objects and arrays",
      body: [
        "React compares the new state with the old one. If you **change an object or array in place** and set the same object again, React sees no difference and may skip the update. Treat state as **immutable**: create a new object or array with the change.",
        "Use the spread syntax for objects, `setUser({ ...user, name: 'Ravi' })`, and for arrays, `setItems([...items, newItem])`. Use `filter` to remove, and `map` to change one element: `setItems(items.map((i) => (i.id === id ? { ...i, done: true } : i)))`. Methods such as `push`, `splice` and `sort` change the array in place, so do not use them on state directly.",
        "Keep the state **small and without duplicates**. If a value can be calculated from other state or props, calculate it while rendering and do not store it.",
      ],
    },
    {
      kind: "code",
      heading: "Updating without changing",
      example: {
        title: "New objects and arrays",
        language: "jsx",
        code: "function Todos() {\n  const [todos, setTodos] = useState([{ id: 1, text: 'Learn', done: false }]);\n\n  function add(text) {\n    setTodos([...todos, { id: Date.now(), text, done: false }]);\n  }\n  function toggle(id) {\n    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));\n  }\n  function remove(id) {\n    setTodos(todos.filter((t) => t.id !== id));\n  }\n  return <button onClick={() => add('New')}>Add ({todos.length})</button>;\n}",
        walkthrough: [
          "`add` creates a new array with the old items and the new one.",
          "`toggle` creates a new array where only the matching item is a new object.",
          "`remove` uses `filter` to build an array without the item. None of them change the old array.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Changing state directly, such as `todos.push(x)`.",
          fix: "Create a new array and call the setter.",
        },
        {
          mistake:
            "Calling `setCount(count + 1)` several times and expecting more than one.",
          fix: "Use `setCount((c) => c + 1)`.",
        },
        {
          mistake:
            "Reading the state right after the setter and expecting the new value.",
          fix: "The new value shows in the next render. Use the value that you passed to the setter.",
        },
        {
          mistake:
            "Storing a value in state that can be calculated, such as the length of a list.",
          fix: "Calculate it while rendering.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A shopping cart",
      scenario:
        "A cart holds items, and the user can add, remove and change quantities.",
      body: [
        "Keep an array of `{ id, quantity }` in state. Each action creates a new array with `map`, `filter` or spread. The total price is calculated while rendering from the array and the price list, and is not stored.",
        "One source of truth in state, and calculated values around it, keeps the cart consistent.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "state-snapshot",
      prompt: "The count starts at 0. How much does one click add?",
      code: {
        language: "jsx",
        code: "function Bump() {\n  const [n, setN] = useState(0);\n  return (\n    <button\n      onClick={() => {\n        setN(n + 1);\n        setN(n + 1);\n      }}\n    >\n      {n}\n    </button>\n  );\n}",
      },
      options: ["1", "2", "0"],
      answer: 0,
      explanation:
        "Both calls use the same snapshot of `n`, which is `0`, so the result after one click is `1`.",
    },
    {
      type: "single",
      id: "immutable-array",
      prompt: "Which line updates an array in state correctly?",
      options: [
        "setItems([...items, newItem])",
        "items.push(newItem)",
        "items[items.length] = newItem",
      ],
      answer: 0,
      explanation:
        "Create a new array. In-place changes do not tell React that anything changed.",
    },
    {
      type: "truefalse",
      id: "initial-only",
      statement: "The value passed to useState is used on every render.",
      answer: false,
      explanation:
        "It is the initial value. React uses it only the first time.",
    },
    {
      type: "blank",
      id: "updater-form",
      prompt:
        "When the new value depends on the old one, pass a function: `setCount(c => c ___ 1)`.",
      answer: "+",
      explanation:
        "The updater function receives the latest value and returns the next one.",
    },
  ],
  assignment: {
    title: "To-do state",
    task: [
      "Build a to-do list with state: add, toggle and remove items, and show how many are done.",
      "Never change the array in place, and calculate the count while rendering.",
    ],
    checklist: [
      "No push, splice or direct assignment on state",
      "The done count is not stored in state",
      "Two lists on a page do not affect each other",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "state-update",
      title: "Update one item",
      task: [
        "Write `renameTodo(todos, id, text)` as a plain function that returns a **new** array in which the todo with the given id has the new text, and every other todo is the same object as before. Then show how a component would call it.",
      ],
      language: "jsx",
      starter: "function renameTodo(todos, id, text) {\n  // your code\n}",
      solution:
        "function renameTodo(todos, id, text) {\n  return todos.map((t) => (t.id === id ? { ...t, text } : t));\n}\n\n// in a component:\n// setTodos((current) => renameTodo(current, 2, 'New text'));",
      hints: ["Use `map`, and the spread syntax for the changed item."],
      checklist: [
        "The original array is not changed",
        "Only the matching item is a new object",
        "The setter receives the new array",
      ],
    },
  ],
  revisionNotes: [
    "State survives renders; the setter schedules a new render",
    "State is a snapshot per render; use `setX(prev => ...)` for updates based on the old value",
    "Treat state as immutable: spread, map, filter",
    "Do not store values that can be calculated",
  ],
  resources: [
    {
      label: "React: State: A Component's Memory",
      url: "https://react.dev/learn/state-a-components-memory",
    },
    {
      label: "React: Updating Objects in State",
      url: "https://react.dev/learn/updating-objects-in-state",
    },
    {
      label: "React: Updating Arrays in State",
      url: "https://react.dev/learn/updating-arrays-in-state",
    },
  ],
})
