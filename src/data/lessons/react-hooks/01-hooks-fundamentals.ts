import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "hooks-fundamentals",
  title: "Hooks: what they are and the rules",
  topic: "Fundamentals",
  minutes: 40,
  overview:
    "Understand what hooks are, why they exist, and the two rules that every hook follows.",
  objectives: [
    "Explain what a hook is and which built-in hooks exist",
    "Apply the rules: only call hooks at the top level, and only from components or custom hooks",
    "Explain why the order of hook calls must not change",
  ],
  prerequisites: ["lesson.react.state"],
  sections: [
    {
      kind: "explain",
      heading: "What hooks are",
      body: [
        "A **hook** is a function that lets a function component use React features: state, effects, context, refs and more. Hook names start with `use`, such as `useState`, `useEffect` and `useContext`. Before hooks, these features needed class components.",
        "The built-in hooks fall into groups. **State**: `useState`, `useReducer`. **Effects**: `useEffect`, `useLayoutEffect`. **Context**: `useContext`. **Refs**: `useRef`. **Performance**: `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`. You can also write your own hooks, which combine the built-in ones.",
        "Hooks only work inside a component or inside another hook. They are not available in plain functions, in class components or in event handlers.",
      ],
    },
    {
      kind: "explain",
      heading: "The two rules of hooks",
      body: [
        "**Rule 1: only call hooks at the top level.** Do not call them inside conditions, loops, nested functions or after an early `return`. **Rule 2: only call hooks from React function components or from custom hooks.**",
        "The reason is how React finds the state of a hook. It does not use names. It remembers the state of a component as a **list**, and matches each hook call to its place in the list by the **order** of the calls. If a hook is skipped in one render, every hook after it would get the wrong value.",
        "The lint plugin `eslint-plugin-react-hooks` checks these rules for you, and also checks the dependency lists of effects. Keep it enabled.",
      ],
    },
    {
      kind: "code",
      heading: "Right and wrong",
      example: {
        title: "Order of calls",
        language: "jsx",
        code: "function Good({ show }) {\n  const [count, setCount] = useState(0);\n  const [name, setName] = useState('');\n  if (!show) return null;\n  return <p>{name} {count}</p>;\n}\n\nfunction Bad({ show }) {\n  if (!show) return null;\n  const [count, setCount] = useState(0);\n  return <p>{count}</p>;\n}",
        walkthrough: [
          "In `Good`, both hooks are called on every render before any `return`, so the order is always the same.",
          "In `Bad`, the early `return` means that `useState` is sometimes called and sometimes not, which breaks the list of hooks.",
          "The lint rule reports the `Bad` version as an error.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Hooks follow the render",
      body: [
        "Hooks read and write information that React keeps for **this component instance**. Two instances of the same component each have their own state. State is kept between renders and is lost when the component is removed from the page.",
        "Because a render must be pure, hooks that change things, such as effects, do not run during the render. They run **after** React has updated the screen. Hooks that only read a value, such as `useContext`, can be used during rendering.",
        "A custom hook is a normal function that calls other hooks. It shares **logic**, but not **state**: two components that call the same custom hook each get their own copy of the state.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Calling a hook inside an `if`.",
          fix: "Move the condition inside the hook or after it, so that the hook is always called.",
        },
        {
          mistake:
            "Calling a hook in a normal function or in an event handler.",
          fix: "Hooks work only in components and custom hooks. Call the hook at the top of the component and use its result in the handler.",
        },
        {
          mistake: "Calling hooks after an early return.",
          fix: "Put all hook calls before any return.",
        },
        {
          mistake: "Disabling the lint rule to silence a warning.",
          fix: "The warning points at a real bug. Fix the code.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A conditional feature",
      scenario:
        "A component should load a user's details, but only when a user id exists.",
      body: [
        "Do not wrap `useEffect` in `if (id)`. Call the effect every time, and put the condition **inside** it: `useEffect(() => { if (!id) return; ... }, [id])`.",
        "The hook is always called, and the behaviour depends on the data.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "hook-prefix",
      prompt: "What do all hook names start with?",
      options: ["use", "get", "on"],
      answer: 0,
      explanation:
        "The `use` prefix marks a function as a hook, and lets the lint rules check it.",
    },
    {
      type: "single",
      id: "hook-order-why",
      prompt: "Why must hooks be called in the same order on every render?",
      options: [
        "React matches state to hooks by their call order",
        "Hooks run faster that way",
        "JavaScript requires it",
      ],
      answer: 0,
      explanation:
        "React keeps a list of hook states per component, and the position in the list identifies each hook.",
    },
    {
      type: "truefalse",
      id: "hook-in-handler",
      statement: "You can call `useState` inside an `onClick` handler.",
      answer: false,
      explanation:
        "Hooks must be called at the top level of a component or custom hook, and not in handlers.",
    },
    {
      type: "truefalse",
      id: "share-state",
      statement:
        "Two components that call the same custom hook share the same state.",
      answer: false,
      explanation:
        "A custom hook shares logic only. Each component gets its own state.",
    },
  ],
  assignment: {
    title: "Find the rule breaks",
    task: [
      "Write five small components that break the rules of hooks in different ways, such as a hook in a condition, a loop, a handler, a normal function and after a return.",
      "Enable the lint rule, note each message, and fix every component.",
    ],
    checklist: [
      "I broke each rule once",
      "The lint plugin reports each one",
      "My fixes keep the behaviour",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "hook-fix",
      title: "Fix the hook call",
      task: [
        "This component breaks the rules of hooks. Fix it so that it behaves the same and follows the rules.",
      ],
      language: "jsx",
      starter:
        "function Profile({ user }) {\n  if (!user) {\n    return <p>No user</p>;\n  }\n  const [editing, setEditing] = useState(false);\n  return <button onClick={() => setEditing(!editing)}>{user.name}</button>;\n}",
      solution:
        "function Profile({ user }) {\n  const [editing, setEditing] = useState(false);\n  if (!user) {\n    return <p>No user</p>;\n  }\n  return <button onClick={() => setEditing(!editing)}>{user.name}</button>;\n}",
      hints: ["Move the hook above the early return."],
      checklist: [
        "useState is called before any return",
        "The output is the same as before",
        "The lint rule passes",
      ],
    },
  ],
  revisionNotes: [
    "A hook is a function starting with `use` that gives a component a React feature",
    "Call hooks at the top level, and only in components and custom hooks",
    "React matches hooks by call order",
    "Custom hooks share logic, not state",
  ],
  resources: [
    {
      label: "React: Rules of Hooks",
      url: "https://react.dev/reference/rules/rules-of-hooks",
    },
    {
      label: "React: Built-in React Hooks",
      url: "https://react.dev/reference/react/hooks",
    },
  ],
})
