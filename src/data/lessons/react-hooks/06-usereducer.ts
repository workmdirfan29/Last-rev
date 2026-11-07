import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "usereducer",
  title: "useReducer: state with many updates",
  topic: "useReducer",
  minutes: 50,
  overview:
    "Use a reducer to manage state that has several related fields or many kinds of updates, and compare it with useState.",
  objectives: [
    "Write a reducer function and use dispatch with actions",
    "Choose between useState and useReducer",
    "Combine a reducer with context for shared state",
  ],
  prerequisites: ["lesson.react-hooks.usestate-in-depth"],
  sections: [
    {
      kind: "explain",
      heading: "Reducers",
      body: [
        "`useReducer(reducer, initialState)` returns `[state, dispatch]`. The **reducer** is a pure function `(state, action) => newState`. Instead of calling several setters in handlers, you **describe what happened** with an action, `dispatch({ type: 'added', text })`, and the reducer decides how the state changes.",
        "All the update logic is in one place, outside the component, where it can be read and tested on its own. Handlers become short: they only say what happened.",
        "A reducer must be **pure** and must not change the old state. Return a new object or array for each change, and return the same state for an unknown action, or throw an error.",
      ],
    },
    {
      kind: "code",
      heading: "A to-do reducer",
      example: {
        title: "Actions and state",
        language: "jsx",
        code: "function todoReducer(state, action) {\n  switch (action.type) {\n    case 'added':\n      return [...state, { id: action.id, text: action.text, done: false }];\n    case 'toggled':\n      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));\n    case 'removed':\n      return state.filter((t) => t.id !== action.id);\n    default:\n      throw new Error('Unknown action: ' + action.type);\n  }\n}\n\nfunction Todos() {\n  const [todos, dispatch] = useReducer(todoReducer, []);\n  return (\n    <>\n      <button onClick={() => dispatch({ type: 'added', id: Date.now(), text: 'New' })}>Add</button>\n      <p>{todos.length} items</p>\n    </>\n  );\n}",
        walkthrough: [
          "Each `case` returns a new array, and does not change the old one.",
          "The component only dispatches actions that describe events.",
          "An unknown action throws, which finds typing mistakes early.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "useState or useReducer",
      body: [
        "Use `useState` for simple, independent values. Use `useReducer` when the next state depends on the previous one in several ways, when many handlers update the same state, when the state has several related fields, or when you want to test the update logic alone.",
        "A reducer is also helpful for **state machines**, such as a request with the states `idle`, `loading`, `ok` and `error`, because the reducer can refuse transitions that make no sense.",
        "To share state across a part of the tree, put `state` and `dispatch` in **two contexts**, one for each. The `dispatch` function never changes, so components that only dispatch do not render when the state changes.",
      ],
    },
    {
      kind: "code",
      heading: "A status machine",
      example: {
        title: "A request reducer",
        language: "jsx",
        code: "const initial = { status: 'idle', data: null, error: null };\n\nfunction requestReducer(state, action) {\n  switch (action.type) {\n    case 'start':\n      return { status: 'loading', data: null, error: null };\n    case 'success':\n      return { status: 'ok', data: action.data, error: null };\n    case 'failure':\n      return { status: 'error', data: null, error: action.error };\n    default:\n      return state;\n  }\n}\n\nfunction useRequest(load) {\n  const [state, dispatch] = useReducer(requestReducer, initial);\n  useEffect(() => {\n    dispatch({ type: 'start' });\n    load()\n      .then((data) => dispatch({ type: 'success', data }))\n      .catch((error) => dispatch({ type: 'failure', error }));\n  }, [load]);\n  return state;\n}",
        walkthrough: [
          "The three actions describe what happened, and the reducer builds a complete state for each.",
          "A state such as `loading` with an error is not possible, because each case sets every field.",
          "`dispatch` is stable, so it does not need to be in the effect dependencies.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Changing the state inside the reducer: `state.push(x)`.",
          fix: "Return a new array or object.",
        },
        {
          mistake:
            "Doing side effects in the reducer, such as fetching or saving.",
          fix: "A reducer must be pure. Do side effects in handlers or effects.",
        },
        {
          mistake: "Using `useReducer` for a single boolean.",
          fix: "Use `useState`. A reducer is helpful when updates are many or complex.",
        },
        {
          mistake: "Dispatching an action with a vague name like `update`.",
          fix: "Name actions for what happened, such as `item_added`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A checkout form",
      scenario:
        "A checkout screen has an address, a payment method, a coupon, a list of items and a status.",
      body: [
        "A reducer with actions such as `address_changed`, `coupon_applied`, `item_removed` and `submitted` keeps all the rules in one place, for example that removing the last item clears the coupon.",
        "Because the reducer is a pure function, it can be unit tested with a list of actions and the expected state.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "reducer-signature",
      prompt: "What is the signature of a reducer?",
      options: [
        "(state, action) => newState",
        "(action) => void",
        "(props) => JSX",
      ],
      answer: 0,
      explanation:
        "A reducer takes the current state and an action, and returns the next state.",
    },
    {
      type: "truefalse",
      id: "reducer-mutate",
      statement:
        "A reducer may change the existing state object and return it.",
      answer: false,
      explanation:
        "It must be pure. Return a new object or array and leave the old one alone.",
    },
    {
      type: "single",
      id: "when-reducer",
      prompt: "When is `useReducer` a better fit than `useState`?",
      options: [
        "Many related fields updated by many kinds of events",
        "A single boolean",
        "A value that never changes",
      ],
      answer: 0,
      explanation:
        "A reducer collects complex update logic in one testable function.",
    },
    {
      type: "single",
      id: "dispatch-stable",
      prompt: "Why is `dispatch` useful in a context?",
      options: [
        "It never changes, so dispatching components need not render with the state",
        "It stores the state",
        "It is faster than a setter",
      ],
      answer: 0,
      explanation:
        "The identity of `dispatch` is stable, so components that only dispatch can avoid renders caused by state changes.",
    },
  ],
  assignment: {
    title: "A reducer with tests",
    task: [
      "Write a reducer for a shopping cart with add, remove, change quantity and clear actions, and use it with `useReducer`.",
      "Write at least five unit tests that call the reducer with actions and check the new state.",
    ],
    checklist: [
      "The reducer never changes the old state",
      "Unknown actions are handled",
      "Every action has a test",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "reducer-write",
      title: "Write the counter reducer",
      task: [
        "Write `counterReducer(state, action)` for the actions `{ type: 'inc' }`, `{ type: 'dec' }`, `{ type: 'set', value }` and `{ type: 'reset' }`. The state is `{ count: 0 }`. Unknown actions throw an error.",
      ],
      language: "jsx",
      starter: "function counterReducer(state, action) {\n  // your code\n}",
      solution:
        "function counterReducer(state, action) {\n  switch (action.type) {\n    case 'inc':\n      return { count: state.count + 1 };\n    case 'dec':\n      return { count: state.count - 1 };\n    case 'set':\n      return { count: action.value };\n    case 'reset':\n      return { count: 0 };\n    default:\n      throw new Error('Unknown action: ' + action.type);\n  }\n}",
      hints: ["Return a new object in each case."],
      checklist: [
        "Each case returns a new object",
        "Unknown actions throw",
        "reset returns the initial state",
      ],
    },
  ],
  revisionNotes: [
    "Reducer: pure `(state, action) => newState`; components `dispatch` actions",
    "Use it for complex, related state; keep `useState` for simple values",
    "Name actions after events; reducers have no side effects",
    "Put state and dispatch in separate contexts to share them",
  ],
  resources: [
    {
      label: "React: useReducer",
      url: "https://react.dev/reference/react/useReducer",
    },
    {
      label: "React: Extracting State Logic into a Reducer",
      url: "https://react.dev/learn/extracting-state-logic-into-a-reducer",
    },
    {
      label: "React: Scaling Up with Reducer and Context",
      url: "https://react.dev/learn/scaling-up-with-reducer-and-context",
    },
  ],
})
