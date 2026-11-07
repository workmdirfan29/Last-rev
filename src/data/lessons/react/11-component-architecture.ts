import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "component-architecture",
  title: "Component architecture: structure, containers and custom hooks",
  topic: "Component architecture",
  minutes: 70,
  overview:
    "Organise a React project, separate logic from presentation with custom hooks, and design components for reuse and testing.",
  objectives: [
    "Organise files by feature and keep components focused",
    "Extract logic into custom hooks and keep components presentational",
    "Design component APIs that are small, clear and testable",
  ],
  prerequisites: ["lesson.react.context"],
  sections: [
    {
      kind: "explain",
      heading: "Structure a project by feature",
      body: [
        "A small project can keep all components in one folder. As it grows, group the files **by feature** and not only by kind: a `cart` folder with its components, hooks, helpers and tests is easier to find and to remove than a `components` folder with hundreds of files.",
        "A common layout is `features/<name>/` for pieces that belong to one feature, `components/` for small shared pieces such as `Button`, `hooks/` for shared hooks, and `lib/` for plain helper functions. Keep imports pointing from the feature **to** shared code, and avoid features that import each other's internals.",
        "A file should have one main thing that it exports. Names should say what a component is: `OrderList`, not `List2`.",
      ],
    },
    {
      kind: "explain",
      heading: "Separating logic from display",
      body: [
        "A component that fetches data, filters it, holds form state and also draws the markup is hard to read and to test. Move the **logic** into a **custom hook** (a function whose name starts with `use` that calls other hooks), and let the component focus on the **markup**.",
        "The hook returns what the view needs: values and functions. The component becomes a short function that is easy to read. The same hook can be used by several components, and it can be tested without drawing anything.",
        "Another way to separate concerns is the **container and presentational** split: a presentational component only receives props and draws UI, and a container gets the data and passes it down. Hooks have replaced most uses of the class-based version of this pattern.",
      ],
    },
    {
      kind: "code",
      heading: "Extracting a hook",
      example: {
        title: "Logic out of the component",
        language: "jsx",
        code: "function useDebounced(value, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}\n\nfunction useProductSearch(query) {\n  const term = useDebounced(query);\n  const [state, setState] = useState({ items: [], loading: false });\n  useEffect(() => {\n    let ignore = false;\n    setState((s) => ({ ...s, loading: true }));\n    fetch('/api/products?q=' + encodeURIComponent(term))\n      .then((r) => r.json())\n      .then((items) => {\n        if (!ignore) setState({ items, loading: false });\n      });\n    return () => {\n      ignore = true;\n    };\n  }, [term]);\n  return state;\n}\n\nexport function ProductSearch() {\n  const [query, setQuery] = useState('');\n  const { items, loading } = useProductSearch(query);\n  return (\n    <section>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n      {loading ? <p>Loading...</p> : <ProductList items={items} />}\n    </section>\n  );\n}",
        walkthrough: [
          "`useDebounced` waits until the user pauses, and cleans up its timer.",
          "`useProductSearch` hides the fetching and the loading flag, and ignores a result that arrives after a newer search started.",
          "The component only has state for the input and draws the result. It reads like a description of the screen.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Designing component APIs",
      body: [
        "A good component has a **small, clear set of props**, with sensible defaults, and does one thing. Name props for what they mean, not for how they look. Prefer passing **data and callbacks** to passing many flags. Use `children` for content.",
        "Keep components **controlled by the parent** when the parent needs to know the value, and give a local default state only when it is convenient. Components that accept `value` and `onChange` are easy to use in forms.",
        "Test components through what a user sees and does: find a button by its text, click it, and check the result on the screen. Tests that check internal state are fragile and break when you refactor.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting every file in one `components` folder.",
          fix: "Group by feature once the project grows, and keep shared pieces separate.",
        },
        {
          mistake: "A 500-line component that fetches, filters and draws.",
          fix: "Extract hooks for the logic, and smaller components for the parts.",
        },
        {
          mistake: "Props that only forward many values to a child.",
          fix: "Group the values in one object, or compose with children.",
        },
        {
          mistake: "Testing implementation details such as state names.",
          fix: "Test behaviour: what the user sees and can do.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Refactoring a dashboard",
      scenario:
        "A dashboard component has 400 lines: fetching, filters, a chart and a table.",
      body: [
        "Extract `useDashboardData(filters)` for fetching, `FilterBar` for the controls, `SalesChart` and `OrdersTable` for the parts, and leave `Dashboard` to hold the filters and arrange the pieces.",
        "Each piece can now be read, tested and changed without touching the others.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "custom-hook-name",
      prompt: "What must the name of a custom hook start with?",
      options: ["use", "hook", "get"],
      answer: 0,
      explanation:
        "The `use` prefix lets React and the lint rules know that the function follows the rules of hooks.",
    },
    {
      type: "single",
      id: "feature-folders",
      prompt: "What is the benefit of grouping files by feature?",
      options: [
        "Everything for a feature is in one place",
        "Fewer files overall",
        "Faster rendering",
      ],
      answer: 0,
      explanation:
        "Related files are easier to find, change and remove together.",
    },
    {
      type: "truefalse",
      id: "test-internals",
      statement:
        "Good component tests check the names of the internal state variables.",
      answer: false,
      explanation:
        "Test behaviour that a user can see and do. Internal details change during refactoring.",
    },
    {
      type: "multi",
      id: "api-good",
      prompt: "Which are signs of a good component API?",
      options: [
        "A small set of clear props",
        "Sensible default values",
        "Ten boolean flags",
        "Content passed with children",
      ],
      answers: [0, 1, 3],
      explanation:
        "Many boolean flags are a warning sign. Prefer a few meaningful props and composition.",
    },
  ],
  assignment: {
    title: "Refactor one big component",
    task: [
      "Take a component of 100 or more lines that fetches data, holds state and draws UI.",
      "Move the logic into one or two custom hooks and split the markup into three or more smaller components.",
    ],
    checklist: [
      "The main component is under 50 lines",
      "A hook can be used by another component",
      "The screen behaves exactly as before",
    ],
    minutes: 40,
  },
  exercises: [
    {
      slug: "hook-design",
      title: "Design the hook",
      task: [
        "Write a `useToggle(initial = false)` hook that returns `[value, toggle, set]`, where `toggle` flips the value and `set` sets it directly.",
      ],
      language: "jsx",
      starter: "function useToggle(initial = false) {\n  // your code\n}",
      solution:
        "function useToggle(initial = false) {\n  const [value, setValue] = useState(initial);\n  const toggle = () => setValue((v) => !v);\n  return [value, toggle, setValue];\n}",
      hints: [
        "Use `useState`, and return an array so that callers can name the values.",
      ],
      checklist: [
        "toggle uses the updater form",
        "set is the setter",
        "The hook name starts with use",
      ],
    },
  ],
  revisionNotes: [
    "Group by feature; shared code in shared folders",
    "Logic in custom hooks, markup in focused components",
    "Small, clear props; compose with children",
    "Test behaviour, not implementation details",
  ],
  resources: [
    {
      label: "React: Reusing Logic with Custom Hooks",
      url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
    {
      label: "React: Thinking in React",
      url: "https://react.dev/learn/thinking-in-react",
    },
    {
      label: "React: Choosing the State Structure",
      url: "https://react.dev/learn/choosing-the-state-structure",
    },
  ],
})
