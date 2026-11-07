import { defineQuestions } from "../author"

export default defineQuestions("react", "intermediate", [
  {
    slug: "why-components-rerender",
    topic: "Performance",
    difficulty: "medium",
    title:
      "A component re-renders more often than you expect. How do you find out why and fix it?",
    keywords: [
      "re-render",
      "memo",
      "profiler",
      "context",
      "performance",
      "React.memo",
    ],
    interviewerIntent:
      "Experienced candidates are expected to debug performance with tools and reasoning, not by sprinkling `useMemo` everywhere.",
    shortAnswer:
      "First measure with the React DevTools Profiler (enable 'record why each component rendered'). A component re-renders when its state changes, its parent re-renders, or a context it reads changes. Fix the cause: move state down, split components, pass stable props, then use `React.memo`/`useMemo` only where profiling shows a real cost.",
    detailedAnswer: [
      "Re-rendering itself is normal and cheap. It is a problem only when render work is expensive or happens at high frequency (typing, scrolling, animation).",
      "**Diagnose first.** Use the Profiler's flamegraph and the 'why did this render' option. Look for the *root cause component* — usually a state update high in the tree.",
      "**Common causes and fixes:** (1) state lives too high — move it down to the component that needs it; (2) an expensive subtree sits under a frequently changing parent — extract it, or pass it as `children` so it is not recreated; (3) new object/function props defeat `React.memo` — stabilise them with `useMemo`/`useCallback`; (4) a context value changes identity every render — memoize the value or split the context.",
      "Apply `React.memo` to components that re-render often with unchanged props **and** are expensive to render. Memoizing everything adds comparison cost and makes code harder to read.",
      "For long lists, virtualise (render only visible rows). With React Compiler enabled, many manual memoizations become unnecessary — but understanding the mechanics is still expected.",
    ],
    realWorldExample:
      "A dashboard with a search box lagged on every keystroke because the typed value lived in the page component, re-rendering a heavy chart. Moving the input state into a `SearchBox` child (and debouncing the filter) removed the lag without any memoization.",
    codeExamples: [
      {
        title: "Move state down instead of memoizing",
        language: "tsx",
        code: `// Before: typing re-renders <HeavyChart />
function Page() {
  const [query, setQuery] = useState("")
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <HeavyChart />
    </>
  )
}

// After: state is local to the input
function SearchBox() {
  const [query, setQuery] = useState("")
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
function Page() {
  return (
    <>
      <SearchBox />
      <HeavyChart />
    </>
  )
}`,
        walkthrough: [
          "In 'Before', `query` belongs to `Page`, so every keystroke re-renders `Page` and all its children including `HeavyChart`.",
          "In 'After', only `SearchBox` owns the state, so only it re-renders.",
          "No `memo`, `useMemo` or `useCallback` needed — the structure fixed the problem.",
        ],
      },
    ],
    commonMistakes: [
      "Wrapping everything in `useMemo`/`useCallback` without measuring.",
      "Using `React.memo` on a component that receives a new object or function prop on every render.",
      "Putting rapidly changing values in a large shared context.",
    ],
    followUps: [
      {
        question: "Why might React.memo not prevent a re-render?",
        hint: "Unstable props, or the component reads a context that changed.",
      },
      {
        question: "How does the children-as-props pattern avoid re-renders?",
        hint: "The element is created by the parent of the stateful component and keeps its identity.",
      },
      { question: "When would you reach for virtualization?" },
    ],
    answerTips: [
      "Lead with 'I would profile first' — it signals engineering maturity.",
      "Name the root-cause pattern (state too high) before naming any API.",
    ],
    keyPoints: [
      "Measure with the Profiler",
      "Move state down / split components",
      "Stabilise props before memo",
      "Memoize selectively",
      "Context identity matters",
    ],
    revisionNotes: ["Profile → find root cause → restructure → memoize last."],
    sourceRefs: [
      {
        label: "React Profiler",
        url: "https://react.dev/reference/react/Profiler",
      },
    ],
    estimatedMinutes: 6,
    relatedIds: ["react.fresher.virtual-dom", "react.fresher.lifting-state-up"],
  },
  {
    slug: "error-boundaries",
    topic: "Error handling",
    difficulty: "medium",
    title: "What are error boundaries, and what errors can they not catch?",
    keywords: [
      "error boundary",
      "componentDidCatch",
      "getDerivedStateFromError",
      "fallback",
      "resilience",
    ],
    interviewerIntent:
      "Checks production-readiness thinking: how a React app fails gracefully.",
    shortAnswer:
      "An error boundary is a class component that catches errors thrown while rendering its child tree and shows a fallback UI instead of unmounting the whole app. It does not catch errors in event handlers, asynchronous code, server-side rendering, or errors thrown in the boundary itself.",
    detailedAnswer: [
      "Without a boundary, an uncaught error during rendering unmounts the entire React tree and leaves a blank screen.",
      "A boundary implements `static getDerivedStateFromError` (to switch to fallback UI) and optionally `componentDidCatch` (to log the error to a monitoring service). There is still no hook equivalent; most teams use the `react-error-boundary` package.",
      "**Not caught:** event handlers (use try/catch), asynchronous code such as `setTimeout` and promises (handle with `.catch` or set error state and throw it during render), SSR, and errors in the boundary itself.",
      "Place boundaries strategically: one around the app as a last resort, and finer-grained ones around independent widgets so one failing chart does not take down the page. Pair them with a retry/reset action.",
    ],
    realWorldExample:
      "A dashboard has six widgets. Wrapping each in its own boundary means a malformed API response in the revenue chart shows 'Couldn't load this chart — Retry' while the other five keep working.",
    codeExamples: [
      {
        title: "Boundary with a reset",
        language: "tsx",
        code: `import { ErrorBoundary } from "react-error-boundary"

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

<ErrorBoundary FallbackComponent={Fallback} onError={logToMonitoring}>
  <RevenueChart />
</ErrorBoundary>`,
        walkthrough: [
          "If `RevenueChart` throws while rendering, the boundary catches it.",
          "`Fallback` is rendered instead, with a button that resets the boundary's error state.",
          "`onError` is where you would send the error to Sentry or another monitoring service.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting a boundary to catch errors from `onClick` handlers or promises.",
      "A single boundary at the root only, so any small failure blanks the page.",
      "No logging in `componentDidCatch`/`onError`.",
    ],
    followUps: [
      {
        question: "How would you surface an async error to an error boundary?",
        hint: "Catch it, store it in state, and throw it during render.",
      },
      { question: "Why are error boundaries still class components?" },
    ],
    answerTips: [
      "Mention granularity (several small boundaries) and monitoring — that is what separates experience from textbook knowledge.",
    ],
    keyPoints: [
      "Catches render-time errors in the child tree",
      "Does not catch handlers, async, SSR",
      "Use granular boundaries",
      "Always log and offer recovery",
    ],
    revisionNotes: ["Render errors only. Wrap widgets. Log + reset."],
    sourceRefs: [
      {
        label: "Catching rendering errors with an error boundary",
        url: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
      },
    ],
    estimatedMinutes: 4,
  },
])
