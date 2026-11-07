import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "custom-hooks",
  title: "Custom hooks: sharing logic",
  topic: "Custom hooks",
  minutes: 60,
  overview:
    "Write custom hooks to reuse stateful logic, design their inputs and outputs, and test them.",
  objectives: [
    "Extract repeated logic into a custom hook",
    "Design a hook's arguments and return value",
    "Explain what custom hooks share and what they do not",
  ],
  prerequisites: ["lesson.react-hooks.useref"],
  sections: [
    {
      kind: "explain",
      heading: "Why custom hooks",
      body: [
        "When two components use the **same stateful logic**, such as tracking the online status, reading from local storage or fetching, you can extract that logic into a **custom hook**: a function whose name starts with `use` and that calls other hooks. Components then call it like any hook.",
        "A custom hook shares the **logic**, not the **state**. Each component that calls the hook gets its own state and effects. It also keeps components short, because they say *what* they need (`useOnlineStatus()`), and the hook holds *how*.",
        "Name hooks for what they do, and keep each one focused. A hook that does five unrelated things is as hard to understand as a large component.",
      ],
    },
    {
      kind: "code",
      heading: "A storage hook",
      example: {
        title: "useLocalStorage",
        language: "jsx",
        code: "function useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => {\n    try {\n      const text = localStorage.getItem(key);\n      return text === null ? initial : JSON.parse(text);\n    } catch {\n      return initial;\n    }\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}\n\nfunction Settings() {\n  const [theme, setTheme] = useLocalStorage('theme', 'light');\n  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>;\n}",
        walkthrough: [
          "The hook has the same shape as `useState`: it returns a value and a setter, so using it is familiar.",
          "Reading is lazy and wrapped in `try/catch`, so damaged data does not break the page.",
          "The effect saves the value whenever it changes. Two components that use the hook with different keys have separate state.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Designing a hook",
      body: [
        "Think about the **inputs** and **outputs**. Return an array of two or three values when callers will want to name them, as `useState` does, and an object when there are several named values. Accept options in an object for anything optional.",
        "The values you pass in are **reactive**: if they change, the hook must respond, so they belong in the dependency lists of its effects. If a hook accepts a callback, callers often pass a new function each render. Store the latest callback in a ref, or document that it should be stable.",
        "Hooks can use other hooks, so you can build up: `useDebounced` inside `useSearch`. Avoid creating wrapper hooks around a single built-in hook without adding value, such as a `useMount` that only calls `useEffect(fn, [])`. It hides the rules that the lint tools check.",
      ],
    },
    {
      kind: "code",
      heading: "A data fetching hook",
      example: {
        title: "useFetch",
        language: "jsx",
        code: "function useFetch(url) {\n  const [state, setState] = useState({ status: 'loading', data: null });\n\n  useEffect(() => {\n    const controller = new AbortController();\n    setState({ status: 'loading', data: null });\n    fetch(url, { signal: controller.signal })\n      .then((r) => {\n        if (!r.ok) throw new Error('HTTP ' + r.status);\n        return r.json();\n      })\n      .then((data) => setState({ status: 'ok', data }))\n      .catch((error) => {\n        if (error.name !== 'AbortError') setState({ status: 'error', data: null });\n      });\n    return () => controller.abort();\n  }, [url]);\n\n  return state;\n}",
        walkthrough: [
          "The hook returns one object with a status, so components cannot mix up flags.",
          "The dependency is `url`, so changing the URL starts a new request and cancels the old one.",
          "For production use, a data fetching library adds caching, retries and de-duplication, so write your own only for simple cases.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Calling a custom hook conditionally.",
          fix: "Custom hooks follow the same rules as built-in hooks.",
        },
        {
          mistake: "Expecting two components to share state through a hook.",
          fix: "Hooks share logic only. For shared state, lift it up or use context.",
        },
        {
          mistake: "Naming a function `useX` that does not call any hook.",
          fix: "Use the `use` prefix only for functions that call hooks.",
        },
        {
          mistake: "A giant hook that does everything.",
          fix: "Split it by concern, and compose small hooks.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reusing online status",
      scenario:
        "A header shows an offline banner, and a form disables its submit button when the user is offline.",
      body: [
        "`useOnlineStatus()` subscribes to the `online` and `offline` events and returns a boolean. Both components call it, and each has its own subscription. If the way of detecting changes later, only the hook changes.",
        "The components became simpler, and the logic is written once.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "custom-hook-share",
      prompt: "What does a custom hook share between components?",
      options: ["The logic, not the state", "The state", "The rendered output"],
      answer: 0,
      explanation:
        "Each component that calls the hook gets its own copy of the state.",
    },
    {
      type: "single",
      id: "custom-hook-rules",
      prompt: "Which rule applies to custom hooks?",
      options: [
        "They must be called at the top level, like built-in hooks",
        "They can be called in loops",
        "They cannot call other hooks",
      ],
      answer: 0,
      explanation:
        "Custom hooks follow the rules of hooks, and they can call other hooks.",
    },
    {
      type: "truefalse",
      id: "use-prefix",
      statement:
        "A function that calls no hooks should still be named with the `use` prefix.",
      answer: false,
      explanation:
        "The prefix means that the function calls hooks. Use it only for those.",
    },
    {
      type: "blank",
      id: "return-array",
      prompt:
        "A hook such as useState returns an ___ so that callers can choose their own names for the values.",
      answer: "array",
      explanation:
        "Returning an array lets callers rename the values with destructuring.",
    },
  ],
  assignment: {
    title: "Extract three hooks",
    task: [
      "Find repeated logic in a project, or write three small components, and extract `useToggle`, `useDebounced` and `useOnlineStatus` hooks.",
      "Use each hook in two components, and write a test for each with a test renderer.",
    ],
    checklist: [
      "Each hook has one clear job",
      "Two components using a hook do not share state",
      "I wrote a test for each hook",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "use-counter",
      title: "Write a counter hook",
      task: [
        "Write `useCounter(initial = 0, step = 1)` that returns `{ count, increment, decrement, reset }`. The functions must not need `count` in their dependencies.",
      ],
      language: "jsx",
      starter:
        "function useCounter(initial = 0, step = 1) {\n  // your code\n}",
      solution:
        "function useCounter(initial = 0, step = 1) {\n  const [count, setCount] = useState(initial);\n  const increment = useCallback(() => setCount((c) => c + step), [step]);\n  const decrement = useCallback(() => setCount((c) => c - step), [step]);\n  const reset = useCallback(() => setCount(initial), [initial]);\n  return { count, increment, decrement, reset };\n}",
      hints: [
        "Use the updater form of the setter so that `count` is not a dependency.",
      ],
      checklist: [
        "The updater form is used",
        "The functions are stable between renders when step and initial stay the same",
        "The hook name starts with use",
      ],
    },
  ],
  revisionNotes: [
    "A custom hook is a `use...` function that calls hooks; it shares logic, not state",
    "Return an array for few values or an object for many; accept options in an object",
    "Reactive inputs belong in dependency lists; keep hooks small and focused",
    "Use a data library for production fetching",
  ],
  resources: [
    {
      label: "React: Reusing Logic with Custom Hooks",
      url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
    {
      label: "React: Rules of Hooks",
      url: "https://react.dev/reference/rules/rules-of-hooks",
    },
  ],
})
