import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "context",
  title: "Context: sharing data without prop drilling",
  topic: "Context",
  minutes: 45,
  overview:
    "Create a context, provide a value, read it with useContext, and know when context is the right tool.",
  objectives: [
    "Create a context, a provider and a custom hook to read it",
    "Explain that a changed context value renders every component that reads it",
    "Decide between props, composition and context",
  ],
  prerequisites: ["lesson.react.composition"],
  sections: [
    {
      kind: "explain",
      heading: "What context is",
      body: [
        "**Context** lets a component pass data to every component below it in the tree, without passing it through each level as props. It is meant for data that many components at different depths need, such as the current user, the theme or the language.",
        "There are three steps. **Create** the context with `createContext(defaultValue)`. **Provide** a value with `<ThemeContext.Provider value={...}>` around the part of the tree that should see it. **Read** it in any component below with `useContext(ThemeContext)`. If there is no provider above, the component gets the default value.",
        "A component that reads a context always sees the value of the **closest provider** above it, so different parts of the app can have different values.",
      ],
    },
    {
      kind: "code",
      heading: "A theme context",
      example: {
        title: "Provider and hook",
        language: "jsx",
        code: "import { createContext, useContext, useState } from 'react';\n\nconst ThemeContext = createContext('light');\n\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nexport function useTheme() {\n  const value = useContext(ThemeContext);\n  if (typeof value === 'string') throw new Error('useTheme must be used inside ThemeProvider');\n  return value;\n}\n\nfunction ThemeButton() {\n  const { theme, setTheme } = useTheme();\n  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>;\n}",
        walkthrough: [
          "The provider keeps the theme in state and offers it, with its setter, as the context value.",
          "`useTheme` is a small custom hook. Components call it and do not need to know about the context object.",
          "The default value is a string, which is not the shape of a real value, so the hook can detect a missing provider and report a clear error.",
          "`ThemeButton` can be placed at any depth below the provider.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Context and renders",
      body: [
        "When the value of a provider changes, **every component that reads that context renders again**, even if it does not use the part that changed. React compares the value with `Object.is`. A new object created on each render, such as `value={{ theme, setTheme }}` inside a component that renders often, makes the value different each time.",
        "Keep the context value stable when possible: wrap it in `useMemo`, or split the context into two, one for data that changes and one for data that does not. Do not put fast-changing values, such as the position of the mouse, in a context.",
        "Context is not a full state management system. It transports a value. The state itself is still held by `useState` or `useReducer` in a component.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using context for every piece of shared data.",
          fix: "Try props and composition first. Use context for truly widespread data.",
        },
        {
          mistake:
            "Reading context in a component that is rendered outside the provider.",
          fix: "Place the provider high enough, and make the hook throw a clear error.",
        },
        {
          mistake:
            "Creating a new object for `value` on every render of a busy parent.",
          fix: "Memoise the value, or move the provider into its own component.",
        },
        {
          mistake: "Putting rapidly changing data into one big context.",
          fix: "Split contexts by how often they change, or use a state library.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Current user and language",
      scenario:
        "An application needs the logged-in user in the header, the settings page and many small components, and also the selected language.",
      body: [
        "Create a `UserContext` and a `LanguageContext`, each with a provider at the top of the app and a custom hook. A small component deep in the tree calls `useUser()` and does not need any prop from its ancestors.",
        "Two small contexts are better than one large one, because a language change does not render the components that only read the user.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "context-steps",
      prompt: "Which are the three steps of using context?",
      options: [
        "Create, provide, read",
        "Import, export, render",
        "Define, call, return",
      ],
      answer: 0,
      explanation:
        "`createContext`, a `Provider` with a value, and `useContext` in the reader.",
    },
    {
      type: "single",
      id: "context-closest",
      prompt:
        "Which value does `useContext` return when there are two providers above the component?",
      options: [
        "The value of the closest provider",
        "The value of the top provider",
        "The default value",
      ],
      answer: 0,
      explanation: "The closest provider above the component wins.",
    },
    {
      type: "truefalse",
      id: "context-rerender",
      statement:
        "When the context value changes, only the components that use the changed part render again.",
      answer: false,
      explanation:
        "Every component that reads the context renders again, because React compares the whole value.",
    },
    {
      type: "single",
      id: "context-vs-props",
      prompt: "When is context a good choice?",
      options: [
        "Data needed by many components at different depths",
        "Passing a value to one child",
        "Storing form fields",
      ],
      answer: 0,
      explanation:
        "For one child, use props. Context is for widely shared data such as the user or the theme.",
    },
  ],
  assignment: {
    title: "Theme and user contexts",
    task: [
      "Build a theme context with a toggle button, and a user context that shows the name in two places that are not near each other.",
      "Write a custom hook for each, and make it throw a clear error outside the provider.",
    ],
    checklist: [
      "No prop is passed through unrelated layers",
      "The hooks give a clear error without a provider",
      "I can explain which components render when the theme changes",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "context-memo",
      title: "Stabilise the value",
      task: [
        "This provider creates a new context value on every render. Change it so that the value only changes when `user` changes.",
      ],
      language: "jsx",
      starter:
        "function UserProvider({ children }) {\n  const [user, setUser] = useState(null);\n  return (\n    <UserContext.Provider value={{ user, setUser }}>\n      {children}\n    </UserContext.Provider>\n  );\n}",
      solution:
        "function UserProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const value = useMemo(() => ({ user, setUser }), [user]);\n  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;\n}",
      hints: ["`useMemo` keeps the same object until a dependency changes."],
      checklist: [
        "The value is wrapped in useMemo",
        "The dependency list contains user",
        "I explained why setUser needs no dependency",
      ],
    },
  ],
  revisionNotes: [
    "Create → provide → read: `createContext`, `Provider`, `useContext`",
    "The closest provider wins; no provider gives the default value",
    "A changed value renders every reader; keep the value stable",
    "Props and composition first, context for widely shared data",
  ],
  resources: [
    {
      label: "React: Passing Data Deeply with Context",
      url: "https://react.dev/learn/passing-data-deeply-with-context",
    },
    {
      label: "React: useContext",
      url: "https://react.dev/reference/react/useContext",
    },
    {
      label: "React: createContext",
      url: "https://react.dev/reference/react/createContext",
    },
  ],
})
