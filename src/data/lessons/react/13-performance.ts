import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "performance",
  title: "Performance: measuring, memo and splitting code",
  topic: "Performance",
  minutes: 60,
  overview:
    "Find real performance problems with the Profiler, and fix them with state placement, memo, useMemo, useCallback, virtualised lists and code splitting.",
  objectives: [
    "Measure before optimising, using the Profiler",
    "Reduce renders by moving state down and using memo correctly",
    "Split code with lazy and Suspense, and handle very long lists",
  ],
  prerequisites: ["lesson.react.rendering-and-reconciliation"],
  sections: [
    {
      kind: "explain",
      heading: "Measure first",
      body: [
        "React is fast for most interfaces. Rendering a component is cheap, and React only touches the DOM where something changed. Optimise only when you have a **measured** problem: an interaction that feels slow, or a profile that shows a long render.",
        "The **React Developer Tools Profiler** records the renders caused by an interaction and shows which components rendered, why, and how long each took. The browser's performance tools show the whole picture, including layout and painting, and the network. Test with a production build, because development mode is much slower.",
        "A slow screen has usually one of these causes: a component that does expensive calculations on every render, a render of a very large tree on every key press, too many elements on the page, or a large amount of JavaScript to download.",
      ],
    },
    {
      kind: "explain",
      heading: "Reduce work: state placement and memo",
      body: [
        "The first fix is often to **move state down**. If a text input changes state in a parent that holds a big list, every key press renders the list. Put the input state in a small component of its own, so only that component renders.",
        "`memo(Component)` makes React skip rendering a component when its **props are equal** to the previous ones, compared shallowly. It helps only if the props really stay the same. A new object, array or function created in the parent on each render breaks it. `useMemo(() => value, deps)` keeps a calculated value between renders, and `useCallback(fn, deps)` keeps a function. They are tools for passing **stable** values to memoised children or to effect dependencies, and for caching an expensive calculation.",
        "These tools have a cost: more code and more things to keep correct. Use them where a measurement shows a benefit. A separate tool, the React Compiler, can add memoisation automatically at build time for code that follows the rules of React.",
      ],
    },
    {
      kind: "code",
      heading: "memo and stable props",
      example: {
        title: "memo with useCallback",
        language: "jsx",
        code: "const Row = memo(function Row({ item, onSelect }) {\n  console.log('render', item.id);\n  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;\n});\n\nfunction List({ items }) {\n  const [selected, setSelected] = useState(null);\n  const [filter, setFilter] = useState('');\n\n  const handleSelect = useCallback((id) => setSelected(id), []);\n  const visible = useMemo(\n    () => items.filter((i) => i.name.includes(filter)),\n    [items, filter]\n  );\n\n  return (\n    <>\n      <input value={filter} onChange={(e) => setFilter(e.target.value)} />\n      <p>Selected: {selected}</p>\n      <ul>\n        {visible.map((item) => (\n          <Row key={item.id} item={item} onSelect={handleSelect} />\n        ))}\n      </ul>\n    </>\n  );\n}",
        walkthrough: [
          "`Row` is wrapped in `memo`, so it renders again only when `item` or `onSelect` changes.",
          "`useCallback` keeps `handleSelect` the same function between renders, so it does not break `memo`.",
          "`useMemo` avoids filtering again when only `selected` changed.",
          "Without the stable function, every row would render each time the parent renders.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Long lists and code size",
      body: [
        "A list with thousands of rows creates thousands of DOM elements, which is slow however fast React is. **Virtualisation** renders only the rows that are visible, plus a few extra, and reuses elements as the user scrolls. Libraries exist for this. Pagination and filtering reduce the number of rows as well.",
        "Large JavaScript files delay the first display. **Code splitting** loads code only when it is needed. `lazy(() => import('./Chart'))` creates a component whose code is downloaded the first time it renders, and `<Suspense fallback={<Spinner />}>` shows a fallback while it loads. Splitting by **route** is the usual first step, because users only need the code of the page they are on.",
        "Other useful habits: use stable keys, avoid creating large objects in the render, keep images small and sized, and do not store derived data in state.",
      ],
    },
    {
      kind: "code",
      heading: "Lazy loading a route",
      example: {
        title: "lazy and Suspense",
        language: "jsx",
        code: "import { lazy, Suspense } from 'react';\n\nconst Reports = lazy(() => import('./Reports.jsx'));\n\nexport default function App({ page }) {\n  return (\n    <Suspense fallback={<p>Loading page...</p>}>\n      {page === 'reports' ? <Reports /> : <Home />}\n    </Suspense>\n  );\n}",
        walkthrough: [
          "`lazy` takes a function that calls the dynamic `import()`, so the file is not part of the first download.",
          "The module must export the component as its default export.",
          "`Suspense` shows the fallback until the code arrives.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Wrapping everything in `memo`, `useMemo` and `useCallback` by habit.",
          fix: "Measure first. Use them where they remove measured work.",
        },
        {
          mistake:
            "Passing a new object or function to a memoised child on every render.",
          fix: "Make the value stable with `useMemo` or `useCallback`, or move it outside the component.",
        },
        {
          mistake: "Profiling in development mode.",
          fix: "Profile a production build for real numbers.",
        },
        {
          mistake: "Rendering ten thousand rows.",
          fix: "Virtualise, paginate or filter the list.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A typing lag",
      scenario:
        "A page shows a table of 2,000 orders, and typing in the search box above it lags.",
      body: [
        "The Profiler shows the whole table rendering for each key press. First, move the search input state into its own component, and filter with the debounced value. Then memoise the row component, and finally consider virtualising the table.",
        "Each step is measured, and you stop when the page feels fast.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "perf-first",
      prompt: "What should you do before optimising a React app?",
      options: [
        "Measure with the Profiler",
        "Wrap every component in memo",
        "Switch to class components",
      ],
      answer: 0,
      explanation:
        "Optimise measured problems only. Guessing adds code and complexity without a proven benefit.",
    },
    {
      type: "truefalse",
      id: "memo-new-fn",
      statement:
        "`memo` still helps if the parent passes a new function to the child on every render.",
      answer: false,
      explanation:
        "A new function on each render makes the props different, so `memo` cannot skip the render. Use `useCallback`, or avoid the prop.",
    },
    {
      type: "single",
      id: "lazy-what",
      prompt: "What does `lazy(() => import('./Chart'))` do?",
      options: [
        "Downloads the component code the first time it renders",
        "Makes the component render slowly",
        "Removes the component",
      ],
      answer: 0,
      explanation:
        "It splits the code, and loads it when needed. Wrap it in Suspense.",
    },
    {
      type: "multi",
      id: "perf-fixes",
      prompt: "Which can reduce slow rendering of a big screen?",
      options: [
        "Move state into a smaller component",
        "Virtualise a long list",
        "Store derived values in state",
        "Split code with lazy",
      ],
      answers: [0, 1, 3],
      explanation:
        "Storing derived values in state adds bugs and does not make rendering faster.",
    },
  ],
  assignment: {
    title: "Profile and speed up a slow page",
    task: [
      "Make a page with a 2,000-row table and a search box, and record it in the Profiler.",
      "Apply one change at a time: move state down, memoise rows, then virtualise or paginate, and record the effect of each.",
    ],
    checklist: [
      "I have a before and after number for each change",
      "I removed any memo that did not help",
      "The page feels responsive",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "stable-callback",
      title: "Keep the callback stable",
      task: [
        "`Row` is memoised, but the parent creates a new `onRemove` function on every render. Fix the parent so that `Row` is not rendered again when only the filter text changes.",
      ],
      language: "jsx",
      starter:
        "function List({ items, onRemoveItem }) {\n  const [filter, setFilter] = useState('');\n  return (\n    <>\n      <input value={filter} onChange={(e) => setFilter(e.target.value)} />\n      {items.map((i) => (\n        <Row key={i.id} item={i} onRemove={() => onRemoveItem(i.id)} />\n      ))}\n    </>\n  );\n}",
      solution:
        "function List({ items, onRemoveItem }) {\n  const [filter, setFilter] = useState('');\n  return (\n    <>\n      <input value={filter} onChange={(e) => setFilter(e.target.value)} />\n      {items.map((i) => (\n        <Row key={i.id} item={i} onRemove={onRemoveItem} />\n      ))}\n    </>\n  );\n}\n\n// Row calls onRemove(item.id) itself, so the same function is passed to every row.",
      hints: [
        "Pass the one stable function, and let `Row` call it with its own id.",
      ],
      checklist: [
        "No new function is created for each row",
        "Row receives the same props when the filter changes",
        "Row still removes the right item",
      ],
    },
  ],
  revisionNotes: [
    "Measure with the Profiler on a production build; optimise measured problems",
    "Move state down; `memo` needs stable props; `useMemo`/`useCallback` give stable values",
    "Virtualise very long lists; lazy + Suspense for code splitting",
    "Memoisation has a cost: do not add it by habit",
  ],
  resources: [
    {
      label: "React: memo",
      url: "https://react.dev/reference/react/memo",
    },
    {
      label: "React: lazy",
      url: "https://react.dev/reference/react/lazy",
    },
    {
      label: "React: useMemo",
      url: "https://react.dev/reference/react/useMemo",
    },
  ],
})
