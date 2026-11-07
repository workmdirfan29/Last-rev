import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "usememo-and-usecallback",
  title: "useMemo and useCallback",
  topic: "useMemo & useCallback",
  minutes: 60,
  overview:
    "Cache calculated values and functions between renders, and know when this actually helps.",
  objectives: [
    "Use useMemo to cache an expensive calculation",
    "Use useCallback to keep a function stable for memoised children and effects",
    "Decide when not to use them",
  ],
  prerequisites: ["lesson.react-hooks.useeffect"],
  sections: [
    {
      kind: "explain",
      heading: "useMemo",
      body: [
        "`useMemo(calculate, dependencies)` calls `calculate` during rendering and **remembers the result**. On the next render, if the dependencies are equal to the previous ones, React returns the remembered result without calling the function again. It is a performance tool, and your code must still work correctly without it.",
        "Use it when a calculation is **really slow**, for example filtering and sorting thousands of items, and the result is needed on renders where its inputs did not change. A good test is to measure the time with `console.time`: if the calculation takes a millisecond or more, memoising may help.",
        "The calculation must be **pure**, because React may call it more than once, and may throw away the cached value, for example to free memory. Do not put side effects in it.",
      ],
    },
    {
      kind: "code",
      heading: "Memoising a calculation",
      example: {
        title: "Filter and sort",
        language: "jsx",
        code: "function ProductTable({ products, query, dark }) {\n  const visible = useMemo(() => {\n    return products\n      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))\n      .toSorted((a, b) => a.price - b.price);\n  }, [products, query]);\n\n  return (\n    <table className={dark ? 'dark' : 'light'}>\n      <tbody>\n        {visible.map((p) => <tr key={p.id}><td>{p.name}</td></tr>)}\n      </tbody>\n    </table>\n  );\n}",
        walkthrough: [
          "The list is calculated again only when `products` or `query` changes.",
          "Changing `dark` renders the table again, but does not repeat the filter and sort.",
          "The dependencies are the values that the calculation uses.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "useCallback and stable values",
      body: [
        "`useCallback(fn, dependencies)` returns the **same function** between renders, until a dependency changes. It is the same as `useMemo(() => fn, dependencies)`. A function written in a component is a **new** function on every render, which is fine, unless something compares it.",
        "Two reasons to use it. First, passing the function as a prop to a child wrapped in `memo`, so that the child can skip its render because the prop did not change. Second, using the function as a **dependency of an effect** or another hook, so that the effect does not run on every render.",
        "Without `memo` on the child, `useCallback` gives no benefit, because the child renders anyway when the parent renders. Do not add it to every function.",
      ],
    },
    {
      kind: "code",
      heading: "Stable callback for a memo child",
      example: {
        title: "useCallback with memo",
        language: "jsx",
        code: "const Item = memo(function Item({ item, onToggle }) {\n  return (\n    <li onClick={() => onToggle(item.id)}>\n      {item.title} {item.done ? 'done' : ''}\n    </li>\n  );\n});\n\nfunction Todos({ items, setItems }) {\n  const onToggle = useCallback(\n    (id) => setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i))),\n    [setItems]\n  );\n  return <ul>{items.map((i) => <Item key={i.id} item={i} onToggle={onToggle} />)}</ul>;\n}",
        walkthrough: [
          "`Item` is memoised, so it renders again only if `item` or `onToggle` changes.",
          "`onToggle` uses the updater form of the setter, so it does not need `items` as a dependency, and stays the same function.",
          "When one item changes, only that row renders again.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "When not to use them",
      body: [
        "Memoisation is not free. It adds code, dependency lists to keep right, and memory, and React still has to compare the dependencies on every render. For a cheap calculation, the comparison can cost as much as the work it saves.",
        "Try other fixes first: move state down, pass children as props, or split the component. Measure with the Profiler before and after. A related tool, the React Compiler, can memoise automatically when your code follows the rules, which makes many manual calls unnecessary.",
        "Also note: a value that is an object, array or function created in render, and used in a dependency list, changes on **every render**, which defeats the purpose. Wrap it, or move it out.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Wrapping every value in `useMemo` and every function in `useCallback`.",
          fix: "Use them where a measurement or a `memo` child gives a reason.",
        },
        {
          mistake: "Using `useCallback` for a child that is not memoised.",
          fix: "The child renders anyway. Add `memo` or remove `useCallback`.",
        },
        {
          mistake: "Missing dependencies in the list.",
          fix: "Include everything the function uses, or use the updater form of setters.",
        },
        {
          mistake: "Relying on `useMemo` to keep a value forever.",
          fix: "It is only a performance hint. The code must work without it.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A search page",
      scenario:
        "A search page filters 5,000 products and shows them in a memoised grid.",
      body: [
        "The filtered list is wrapped in `useMemo`, and the handlers passed to the grid are wrapped in `useCallback`. Typing in an unrelated field no longer repeats the filter or renders the rows.",
        "The Profiler confirms that the rows no longer render, so the extra code earns its place.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "usememo-what",
      prompt: "What does `useMemo` do?",
      options: [
        "Caches the result of a calculation until its dependencies change",
        "Runs code after the render",
        "Stores state",
      ],
      answer: 0,
      explanation: "`useMemo` remembers a calculated value between renders.",
    },
    {
      type: "single",
      id: "usecallback-equal",
      prompt: "`useCallback(fn, deps)` is the same as...",
      options: [
        "useMemo(() => fn, deps)",
        "useEffect(fn, deps)",
        "useState(fn)",
      ],
      answer: 0,
      explanation:
        "It caches the function itself, the same as memoising a value that is a function.",
    },
    {
      type: "truefalse",
      id: "callback-always",
      statement: "`useCallback` always makes the application faster.",
      answer: false,
      explanation:
        "It helps only when something compares the function, such as a memoised child or an effect. Otherwise it adds cost.",
    },
    {
      type: "truefalse",
      id: "memo-guarantee",
      statement:
        "React guarantees that a `useMemo` value is never recalculated while the dependencies stay equal.",
      answer: false,
      explanation:
        "It is a performance hint. React may discard the cached value, so the code must work without it.",
    },
  ],
  assignment: {
    title: "Measure a memoisation",
    task: [
      "Create a list of 3,000 items with a filter and an unrelated counter.",
      "Record the Profiler without memoisation, add `useMemo` for the list and `memo` and `useCallback` for the rows, and record again. Keep only the changes that helped.",
    ],
    checklist: [
      "I have two measurements",
      "I removed one memoisation that did not help",
      "The dependency lists pass the lint rule",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "memo-deps",
      title: "Find the missing dependency",
      task: [
        "This `useCallback` has a bug: the function sometimes uses an old `step`. Fix the dependency list, and then write the version that needs no dependency by using the updater form.",
      ],
      language: "jsx",
      starter:
        "function Counter({ step }) {\n  const [count, setCount] = useState(0);\n  const add = useCallback(() => setCount(count + step), []);\n  return <button onClick={add}>{count}</button>;\n}",
      solution:
        "function Counter({ step }) {\n  const [count, setCount] = useState(0);\n  const add = useCallback(() => setCount((c) => c + step), [step]);\n  return <button onClick={add}>{count}</button>;\n}",
      hints: [
        "The updater form removes the need for `count`, but `step` is still used.",
      ],
      checklist: [
        "step is in the dependency list",
        "The updater form is used for count",
        "The click always adds the current step",
      ],
    },
  ],
  revisionNotes: [
    "`useMemo` caches a calculated value; `useCallback` caches a function",
    "Use them for slow calculations, memoised children and effect dependencies",
    "Dependencies must list everything used; setter updaters reduce dependencies",
    "Measure first; they are performance hints, not guarantees",
  ],
  resources: [
    {
      label: "React: useMemo",
      url: "https://react.dev/reference/react/useMemo",
    },
    {
      label: "React: useCallback",
      url: "https://react.dev/reference/react/useCallback",
    },
    {
      label: "React: memo",
      url: "https://react.dev/reference/react/memo",
    },
  ],
})
