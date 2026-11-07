import { defineQuestions } from "../author"

export default defineQuestions("react-hooks", "fresher", [
  {
    slug: "usestate-functional-updates",
    topic: "useState",
    difficulty: "medium",
    title:
      "Why does calling setCount(count + 1) three times only increase the count by one?",
    keywords: [
      "useState",
      "batching",
      "functional update",
      "stale state",
      "snapshot",
    ],
    interviewerIntent:
      "Tests whether you understand that state is a snapshot per render and how batching and functional updates work.",
    shortAnswer:
      "State is a snapshot: within one render, `count` has a fixed value. Three calls to `setCount(count + 1)` all use the same old `count`, so they each set the same next value and React batches them into one update. Use the functional form `setCount(c => c + 1)` so each update builds on the previous result.",
    detailedAnswer: [
      "Every render has its own `count`. Event handlers 'close over' the value from the render they were created in. Calling `setCount(count + 1)` three times queues three updates that all say 'set to 1'.",
      "React **batches** state updates inside an event handler and re-renders once afterwards. It does not mutate `count` immediately, so the variable still holds the old value in the rest of the handler.",
      "The **updater function** form receives the latest queued state: `setCount(c => c + 1)` three times queues three functions, which React applies in order, giving +3.",
      "Use the functional form whenever the new state depends on the previous state — and always when the update may run later (timers, async callbacks) where the captured value could be stale.",
    ],
    realWorldExample:
      "A 'like' button that increments a counter inside a `setTimeout` callback can lose clicks if it uses the captured `likes` value. Using `setLikes(l => l + 1)` is always correct.",
    codeExamples: [
      {
        title: "Direct value vs updater function",
        language: "tsx",
        code: `function Counter() {
  const [count, setCount] = useState(0)

  function addThreeBroken() {
    setCount(count + 1) // 0 + 1
    setCount(count + 1) // 0 + 1
    setCount(count + 1) // 0 + 1  -> result: 1
  }

  function addThree() {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1) // -> result: 3
  }

  return <button onClick={addThree}>{count}</button>
}`,
        walkthrough: [
          "In `addThreeBroken`, `count` is 0 for the whole handler, so every call queues 'set to 1'.",
          "In `addThree`, each updater receives the result of the previous one: 0 → 1 → 2 → 3.",
          "React renders once after the handler finishes, showing 3.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting `console.log(count)` right after `setCount` to show the new value.",
      "Using the captured value inside timers or async callbacks.",
      "Mutating state objects/arrays instead of creating new ones.",
    ],
    followUps: [
      {
        question: "Does setState update the state synchronously?",
        hint: "No — the new value appears on the next render.",
      },
      {
        question: "How would you update one field of an object in state?",
        hint: "Spread into a new object: setUser(u => ({ ...u, name })).",
      },
    ],
    answerTips: [
      "Say 'state is a snapshot' — it is the sentence interviewers want to hear.",
    ],
    keyPoints: [
      "State is a snapshot per render",
      "Updates are batched",
      "Use updater functions when depending on previous state",
      "Never mutate state",
    ],
    revisionNotes: ["setX(prev => ...) when new depends on old."],
    sourceRefs: [
      {
        label: "useState reference",
        url: "https://react.dev/reference/react/useState",
      },
    ],
    estimatedMinutes: 4,
    relatedIds: ["react-hooks.fresher.useeffect-dependencies"],
  },
  {
    slug: "useeffect-dependencies",
    topic: "useEffect",
    difficulty: "medium",
    title:
      "What is the dependency array in useEffect and what happens if you get it wrong?",
    keywords: [
      "useEffect",
      "dependencies",
      "cleanup",
      "side effects",
      "infinite loop",
    ],
    interviewerIntent:
      "useEffect is the most misused hook. Interviewers use this to see whether you understand synchronization, cleanup and stale values.",
    shortAnswer:
      "`useEffect` runs after render to synchronise your component with something outside React. The dependency array lists every reactive value the effect uses; React re-runs the effect only when one of them changed. An empty array runs once after mount, no array runs after every render, and a missing dependency causes stale values.",
    detailedAnswer: [
      "Think of an effect as 'keep this outside thing in sync with these values'. The dependency array tells React *which values* the effect reads.",
      "`[]` means the effect reads no reactive values, so it runs on mount (and cleans up on unmount). Omitting the array runs the effect after **every** render. `[a, b]` runs when `a` or `b` change.",
      "**Missing dependencies** lead to stale closures — the effect keeps using an old value. **Unstable dependencies** (an object or function recreated every render) cause the effect to re-run constantly, sometimes producing an infinite loop when the effect sets state.",
      "Return a **cleanup function** to undo what the effect did (unsubscribe, clear timers, abort fetches). It runs before the next effect and on unmount. In development, React Strict Mode mounts, unmounts and remounts once to help you find missing cleanups.",
      "Do not use effects for things you can calculate during render or handle in an event handler.",
    ],
    realWorldExample:
      "A user-profile page fetches data when `userId` changes. With `[userId]` it refetches on navigation; with `[]` it would keep showing the first user's data forever.",
    codeExamples: [
      {
        title: "Fetch with cleanup",
        language: "tsx",
        code: `useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser)
    .catch((e) => {
      if (e.name !== "AbortError") setError(e)
    })

  return () => controller.abort() // cleanup when userId changes or unmount
}, [userId])`,
        walkthrough: [
          "The effect reads `userId`, so it is listed as a dependency.",
          "When `userId` changes, React runs the cleanup (aborting the old request) then runs the effect again.",
          "Aborting prevents an old, slow response from overwriting the newer one.",
        ],
      },
    ],
    commonMistakes: [
      "Disabling the exhaustive-deps lint rule instead of fixing the cause.",
      "Putting objects or functions created during render in the dependency array without memoizing.",
      "Forgetting cleanup for subscriptions, intervals and event listeners.",
      "Using an effect to derive state that could be computed during render.",
    ],
    followUps: [
      {
        question:
          "What is the difference between useEffect and useLayoutEffect?",
        hint: "useLayoutEffect runs synchronously after DOM mutations, before paint.",
      },
      {
        question: "Why does my effect run twice in development?",
        hint: "Strict Mode re-mounts to expose missing cleanup.",
      },
    ],
    answerTips: [
      "Describe an effect as synchronisation, not 'componentDidMount'. It signals modern React understanding.",
    ],
    keyPoints: [
      "Runs after render",
      "Dependencies = reactive values read inside",
      "[] once, none = every render",
      "Return cleanup",
      "Don't use effects for derivable state",
    ],
    revisionNotes: [
      "Effect = sync with outside world. List every value you read. Clean up.",
    ],
    sourceRefs: [
      {
        label: "useEffect reference",
        url: "https://react.dev/reference/react/useEffect",
      },
    ],
    estimatedMinutes: 5,
    relatedIds: [
      "react-hooks.fresher.usestate-functional-updates",
      "react-hooks.fresher.rules-of-hooks",
    ],
  },
  {
    slug: "rules-of-hooks",
    topic: "Fundamentals",
    difficulty: "easy",
    title: "What are the Rules of Hooks and why do they exist?",
    keywords: ["hooks", "rules", "order", "conditional", "eslint"],
    interviewerIntent:
      "Checks that you know the constraints of hooks and the reason behind them, not just the rules.",
    shortAnswer:
      "Call hooks only at the top level of a function component or a custom hook — never inside loops, conditions or nested functions — and only from React functions. React identifies each hook by the order it is called, so that order must be identical on every render.",
    detailedAnswer: [
      "React does not give hooks names. Internally it stores a list of hook slots per component and matches them by **call order**: the first `useState` is slot 0, the next is slot 1, and so on.",
      "If a hook is skipped in some renders (for example inside an `if`), every later hook shifts to the wrong slot and state gets mixed up. That is why hooks must always run in the same order.",
      "Hooks can be called from function components and from **custom hooks** (functions whose names start with `use`). Not from regular functions, event handlers or class components.",
      "The `eslint-plugin-react-hooks` plugin enforces both rules and the exhaustive-deps check; keep it enabled.",
    ],
    realWorldExample:
      "A component that returns early with `if (!user) return null` *before* calling `useState` works until `user` becomes defined — then React sees an extra hook and throws 'Rendered more hooks than during the previous render'.",
    codeExamples: [
      {
        title: "Conditional hook (wrong) vs fix",
        language: "tsx",
        code: `// Wrong: hook order depends on a condition
function Profile({ user }) {
  if (!user) return null
  const [tab, setTab] = useState("info") // skipped when user is null
  return <Tabs value={tab} onChange={setTab} />
}

// Right: call hooks first, then branch
function Profile({ user }) {
  const [tab, setTab] = useState("info")
  if (!user) return null
  return <Tabs value={tab} onChange={setTab} />
}`,
        walkthrough: [
          "In the first version the early return skips `useState` on some renders.",
          "React then sees a different number of hooks between renders and throws an error.",
          "Moving the hook above the early return guarantees the same order every render.",
        ],
      },
    ],
    commonMistakes: [
      "Calling a hook inside an `if`, loop or callback.",
      "Calling hooks after an early `return`.",
      "Naming a custom hook without the `use` prefix, which hides it from the linter.",
    ],
    followUps: [
      {
        question: "How do you run a hook conditionally then?",
        hint: "Move the condition inside the hook, or split into a child component that always calls it.",
      },
    ],
    answerTips: [
      "Give the reason (call order = identity), not just the rules.",
    ],
    keyPoints: [
      "Top level only",
      "Only from components or custom hooks",
      "React matches hooks by call order",
      "Custom hooks start with 'use'",
    ],
    revisionNotes: ["Same hooks, same order, every render."],
    sourceRefs: [
      {
        label: "Rules of Hooks",
        url: "https://react.dev/reference/rules/rules-of-hooks",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "what-are-react-hooks",
    topic: "Fundamentals",
    difficulty: "easy",
    title: "What are React Hooks and why were they introduced?",
    keywords: [
      "hooks",
      "useState",
      "useEffect",
      "function components",
      "custom hooks",
      "React 16.8",
    ],
    interviewerIntent:
      "A foundation question. It checks that you know what problem hooks solve, not just their names.",
    shortAnswer:
      "Hooks are functions that let function components use React features such as state and effects. They were added in React 16.8. They let you reuse stateful logic through custom hooks without wrapper components, and they keep related code together instead of splitting it across lifecycle methods. Hooks must be called at the top level of a component or another hook.",
    detailedAnswer: [
      "Before hooks, state and lifecycle needed class components, and sharing logic meant higher-order components or render props that added extra layers.",
      "Built-in hooks include `useState`, `useEffect`, `useContext`, `useRef`, `useReducer`, `useMemo` and `useCallback`.",
      "Hooks do not replace the component model. They are a way of attaching state and behaviour to function components.",
      "React relies on the order of hook calls to match state to each hook, which is why the rules of hooks exist.",
    ],
    realWorldExample:
      "A `useOnlineStatus` custom hook is written once and used in the navbar, the form and the sync indicator, each getting its own live value.",
    commonMistakes: [
      "Calling hooks inside loops, conditions or nested functions.",
      "Thinking hooks make class components obsolete overnight. Both still work.",
    ],
    followUps: [
      { question: "What are the rules of hooks and why do they exist?" },
    ],
    answerTips: [
      "Name the problem first: sharing logic and splitting related code across lifecycle methods.",
    ],
    keyPoints: [
      "Add state and effects to function components",
      "Introduced in React 16.8",
      "Enable reusable custom hooks",
      "Called at the top level only",
    ],
    revisionNotes: ["Hooks = state and effects for functions."],
    sourceRefs: [
      {
        label: "React docs: Built-in React Hooks",
        url: "https://react.dev/reference/react/hooks",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "stale-closure-in-hooks",
    topic: "Fundamentals",
    difficulty: "hard",
    title: "What is a stale closure in React hooks? Give an example and a fix.",
    keywords: [
      "stale closure",
      "setInterval",
      "useEffect",
      "dependencies",
      "functional update",
      "snapshot",
    ],
    interviewerIntent:
      "A senior-flavoured fresher question. It shows whether you understand that each render has its own values.",
    shortAnswer:
      "A stale closure happens when a function created during one render keeps using that render's old state or props after they have changed. A common case is `setInterval` inside an effect with an empty dependency array that reads `count`: it keeps seeing the first value. Fix it with a functional update, by listing the dependencies, or by storing the latest value in a ref.",
    detailedAnswer: [
      "Every render creates new variables and new functions. An effect or callback captures the ones from the render in which it was defined.",
      "With `[]` as dependencies the effect never re-creates its callback, so it keeps the first render's values.",
      "`setCount(c => c + 1)` does not read `count` at all, so it is not affected.",
      "The lint rule `react-hooks/exhaustive-deps` warns about missing dependencies and prevents most stale closures.",
    ],
    realWorldExample:
      "A timer that should add one each second stays stuck at 1 because the interval callback captured `count` as 0.",
    codeExamples: [
      {
        title: "Stuck counter and the fix",
        language: "jsx",
        code: `function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)        // stale: count is always 0 here
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Fix: setCount(c => c + 1)  (no dependency on count)
  return <p>{count}</p>
}`,
        walkthrough: [
          "The effect runs once and creates one interval callback.",
          "That callback captured `count` from the first render, which is 0.",
          "Every tick therefore calls `setCount(0 + 1)`, so the value stays at 1.",
          "The updater form reads the latest state, so the counter keeps increasing.",
        ],
      },
    ],
    commonMistakes: [
      "Silencing the exhaustive-deps warning instead of fixing the cause.",
      "Reading state inside a timer or listener created once.",
    ],
    followUps: [{ question: "How does useRef help with a stale closure?" }],
    answerTips: [
      "Explain it as 'each render has its own snapshot' and show the interval example.",
    ],
    keyPoints: [
      "Callbacks capture values from their render",
      "Empty deps freeze the captured values",
      "Functional updates avoid reading state",
      "Follow exhaustive-deps",
    ],
    revisionNotes: ["Old render, old values."],
    sourceRefs: [
      {
        label: "React docs: Synchronizing with Effects",
        url: "https://react.dev/learn/synchronizing-with-effects",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "lazy-initial-state",
    topic: "useState",
    difficulty: "medium",
    title: "What is lazy initialisation of state in useState?",
    keywords: [
      "useState",
      "lazy initial state",
      "initializer function",
      "localStorage",
      "performance",
    ],
    interviewerIntent:
      "Checks that you avoid repeating expensive work on every render.",
    shortAnswer:
      "The argument to `useState` is only used on the first render, but if you write `useState(compute())` the call to `compute()` still happens on every render. Passing a function, `useState(() => compute())`, makes React call it only once, to produce the initial value. Use this when the initial value is expensive, such as parsing data from localStorage.",
    detailedAnswer: [
      "The function must be pure and take no arguments. React may call it twice in development to check this.",
      "`useState(compute)` also works, because you pass the function without calling it.",
      "The same lazy form exists for `useReducer`'s third argument.",
      "A cheap value such as `0` or an empty string does not need it.",
    ],
    realWorldExample:
      'A theme preference stored in localStorage is read once on mount with `useState(() => localStorage.getItem("theme") ?? "light")`.',
    codeExamples: [
      {
        title: "Eager versus lazy",
        language: "jsx",
        code: `function Page() {
  // Runs parse() on every render, result ignored after the first
  const [a] = useState(parse(localStorage.getItem("data")))

  // Runs parse() only on the first render
  const [b] = useState(() => parse(localStorage.getItem("data")))
  return null
}`,
        walkthrough: [
          "The first line evaluates `parse(...)` each time the component renders.",
          "React only uses that result on the first render and ignores it afterwards.",
          "The second line passes a function, which React calls once to get the initial value.",
        ],
      },
    ],
    commonMistakes: [
      "Calling an expensive function directly in useState.",
      "Using the lazy form for trivial values.",
    ],
    followUps: [
      {
        question:
          "Why does React call initialiser functions twice in StrictMode?",
      },
    ],
    answerTips: [
      "Show the pair of lines, one with parentheses and one with an arrow function.",
    ],
    keyPoints: [
      "Initial value used on the first render only",
      "useState(compute()) still calls compute every render",
      "Pass a function to run it once",
      "Keep it pure",
    ],
    revisionNotes: ["Pass a function to compute once."],
    sourceRefs: [
      {
        label: "React docs: useState (avoiding recreating the initial state)",
        url: "https://react.dev/reference/react/useState",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "one-state-object-vs-many",
    topic: "useState",
    difficulty: "medium",
    title:
      "Should you use one state object or several useState calls? What differs from class setState?",
    keywords: [
      "useState",
      "state structure",
      "object state",
      "spread",
      "setState merge",
      "related state",
    ],
    interviewerIntent:
      "Checks that you structure state sensibly and know that setters replace rather than merge.",
    shortAnswer:
      "Group values that always change together into one object, and keep unrelated values in separate `useState` calls. Unlike class `setState`, the `useState` setter replaces the value instead of merging it, so with an object you must copy the existing fields with spread. Separate calls are simpler for independent values.",
    detailedAnswer: [
      "If two variables are always updated together, such as `x` and `y` coordinates, one object avoids them getting out of sync.",
      "Large objects with many unrelated fields are awkward, because every update must copy all the others.",
      "Avoid contradictory state. Instead of `isLoading` and `isError` both being true, use a single `status` field.",
      "For complex transitions consider `useReducer`.",
    ],
    realWorldExample:
      "A form keeps `{ name, email }` in one object for submission, while a modal's `isOpen` flag is its own state.",
    codeExamples: [
      {
        title: "Replacing versus merging",
        language: "jsx",
        code: `const [user, setUser] = useState({ name: "Asha", city: "Pune" })

// Wrong: loses "city"
setUser({ name: "Ravi" })

// Right: copy the rest, change one field
setUser({ ...user, name: "Ravi" })
// or setUser(u => ({ ...u, name: "Ravi" }))`,
        walkthrough: [
          "The setter replaces the whole object with what you pass.",
          "The first call drops the `city` field entirely.",
          "Spreading the old object keeps the other fields.",
          "The updater form is safer when several updates are queued.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting automatic merging like class setState.",
      "Storing contradictory flags such as isLoading and isError together.",
    ],
    followUps: [
      {
        question:
          "How would you model a request with loading, success and error?",
      },
    ],
    answerTips: [
      "State the merge difference clearly, it is the detail interviewers listen for.",
    ],
    keyPoints: [
      "Group related values",
      "Separate unrelated values",
      "Setter replaces, does not merge",
      "Prefer one status over several flags",
    ],
    revisionNotes: ["Setters replace. Spread to keep the rest."],
    sourceRefs: [
      {
        label: "React docs: Choosing the state structure",
        url: "https://react.dev/learn/choosing-the-state-structure",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "avoid-derived-state",
    topic: "useState",
    difficulty: "medium",
    title:
      "Why should you avoid storing derived values in state? How do you compute them instead?",
    keywords: [
      "derived state",
      "computed value",
      "single source of truth",
      "useMemo",
      "sync bugs",
    ],
    interviewerIntent:
      "Checks whether you keep one source of truth and avoid effects that copy state.",
    shortAnswer:
      "If a value can be calculated from existing props or state, calculate it during rendering instead of storing it in another state variable. Duplicated state can fall out of sync and needs an effect to copy it, which adds a wasted render. Compute the value directly, and use `useMemo` only if the calculation is genuinely expensive.",
    detailedAnswer: [
      "Example: given `items` and a `filter`, the filtered list is derived. Keep only `items` and `filter` in state.",
      "Copying a prop into state means later prop changes are ignored, which is a common source of bugs.",
      "To reset state when an identity changes, give the component a different `key` rather than syncing in an effect.",
      "Keep the minimum state, and derive everything else.",
    ],
    realWorldExample:
      "A cart stores `items`. The total and the item count are computed in the render, so they can never disagree with the items.",
    codeExamples: [
      {
        title: "Derive instead of duplicate",
        language: "jsx",
        code: `function Cart({ items }) {
  // Derived: always correct, no extra state
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.length

  // Avoid: const [total, setTotal] = useState(0) + an effect to keep it in sync
  return <p>{count} items, total {total}</p>
}`,
        walkthrough: [
          "`total` and `count` are calculated each render from the single source, `items`.",
          "There is no second copy to update or to forget updating.",
          "The commented alternative needs an effect and renders twice on each change.",
        ],
      },
    ],
    commonMistakes: [
      "Copying props into state.",
      "Using an effect only to set state from other state.",
    ],
    followUps: [
      {
        question:
          "How do you reset a component's state when a prop like userId changes?",
        hint: "Use a key.",
      },
    ],
    answerTips: ["Use the phrase 'single source of truth'."],
    keyPoints: [
      "Calculate derived values in render",
      "Fewer state variables, fewer sync bugs",
      "Do not copy props into state",
      "Reset with a key",
    ],
    revisionNotes: ["If you can compute it, do not store it."],
    sourceRefs: [
      {
        label:
          "React docs: Choosing the state structure (avoid redundant state)",
        url: "https://react.dev/learn/choosing-the-state-structure",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "form-handling-with-usestate",
    topic: "useState",
    difficulty: "easy",
    title: "How do you handle a form with several inputs using useState?",
    keywords: [
      "controlled inputs",
      "form",
      "onChange",
      "name attribute",
      "preventDefault",
      "validation",
    ],
    interviewerIntent:
      "A practical question. Interviewers want to see one handler for many inputs and correct submit handling.",
    shortAnswer:
      "Keep the form values in one state object and make each input controlled: its `value` comes from state and `onChange` updates it. A single change handler can update any field by using the input's `name` as the key. On submit call `event.preventDefault()`, validate the values, then send them. For larger forms a library such as React Hook Form reduces boilerplate.",
    detailedAnswer: [
      "Use `[name]: value` as a computed property name so the same handler works for every input.",
      'Checkboxes use `checked` instead of `value`, so read `type === "checkbox"` in the handler.',
      "Keep validation errors in state or derive them from the values.",
      "Disable the submit button while the request is running to prevent double submission.",
    ],
    realWorldExample:
      "A sign-up form with name, email and password uses one `form` state object and one `handleChange` function.",
    codeExamples: [
      {
        title: "One handler for all fields",
        language: "jsx",
        code: `function SignUp() {
  const [form, setForm] = useState({ name: "", email: "" })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  function handleSubmit(e) {
    e.preventDefault()
    console.log(form)
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  )
}`,
        walkthrough: [
          "Each input is controlled by the `form` state.",
          "`handleChange` uses the `name` attribute to decide which field to update.",
          "The updater copies the other fields and replaces only the changed one.",
          "`preventDefault` stops the browser from reloading the page on submit.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting the `name` attribute on inputs.",
      "Forgetting preventDefault on submit.",
    ],
    followUps: [
      {
        question:
          "What is the difference between controlled and uncontrolled inputs?",
      },
    ],
    answerTips: ["Show the `[name]: value` trick, it is the key idea."],
    keyPoints: [
      "Controlled inputs",
      "One handler using the name attribute",
      "preventDefault on submit",
      "Use a library for big forms",
    ],
    revisionNotes: ["value from state, onChange to state."],
    sourceRefs: [
      {
        label: "React docs: Reacting to input with state",
        url: "https://react.dev/learn/reacting-to-input-with-state",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "fetch-data-in-useeffect",
    topic: "useEffect",
    difficulty: "medium",
    title:
      "How do you fetch data in useEffect? How do you avoid race conditions?",
    keywords: [
      "fetch",
      "useEffect",
      "race condition",
      "AbortController",
      "loading state",
      "cleanup",
    ],
    interviewerIntent:
      "One of the most practical hook questions. It tests cleanup, loading and error handling together.",
    shortAnswer:
      "Start the request inside `useEffect`, store the result in state and track loading and error states. List the values the request depends on, such as an id, in the dependency array. To avoid race conditions, where an older slower response overwrites a newer one, cancel the request in the cleanup with an `AbortController`, or ignore results from outdated effects.",
    detailedAnswer: [
      "An effect callback cannot be `async` directly, so define an async function inside and call it.",
      "When the id changes quickly, two requests can be in flight. The cleanup runs before the next effect, so abort or ignore the old one.",
      "An aborted `fetch` rejects with an `AbortError`, which you should not treat as a real failure.",
      "In development StrictMode runs the effect twice, so the abort and cleanup logic is also tested.",
      "For production apps a data library such as TanStack Query handles caching, retries and race conditions for you.",
    ],
    realWorldExample:
      "A user profile page loads `/api/users/:id`. Navigating quickly between two users must never show the first user's data after the second one was requested.",
    codeExamples: [
      {
        title: "Fetch with cancellation",
        language: "jsx",
        code: `function User({ id }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setUser(null); setError(null)

    fetch("/api/users/" + id, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(setUser)
      .catch(e => { if (e.name !== "AbortError") setError(e) })

    return () => controller.abort()
  }, [id])

  if (error) return <p>Could not load user.</p>
  return user ? <h1>{user.name}</h1> : <p>Loading...</p>
}`,
        walkthrough: [
          "A new `AbortController` is created for each run of the effect.",
          "The request receives its `signal`, and a non-OK response is turned into an error.",
          "The cleanup aborts the previous request when `id` changes or the component unmounts.",
          "The abort error is ignored because it is expected.",
        ],
      },
    ],
    commonMistakes: [
      "Making the effect callback async.",
      "Not handling loading and error states.",
      "Ignoring out-of-order responses.",
    ],
    followUps: [
      {
        question:
          "Why might a library like TanStack Query be better than hand-written effects?",
      },
    ],
    answerTips: ["Always mention cleanup and loading and error states."],
    keyPoints: [
      "Fetch inside useEffect with correct dependencies",
      "Track loading and error",
      "Abort or ignore stale responses in cleanup",
      "Libraries handle this for you",
    ],
    revisionNotes: ["Fetch, cancel in cleanup, handle errors."],
    sourceRefs: [
      {
        label: "React docs: You Might Not Need an Effect (fetching data)",
        url: "https://react.dev/learn/you-might-not-need-an-effect#fetching-data",
      },
      {
        label: "MDN: AbortController",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
      },
    ],
    estimatedMinutes: 6,
  },
  {
    slug: "useeffect-infinite-loop",
    topic: "useEffect",
    difficulty: "medium",
    title: "Why does my useEffect run in an infinite loop? How do you fix it?",
    keywords: [
      "infinite loop",
      "useEffect",
      "dependency array",
      "setState",
      "object dependency",
      "re-render",
    ],
    interviewerIntent:
      "A debugging question. It checks that you can reason about renders, effects and dependencies together.",
    shortAnswer:
      "An infinite loop happens when an effect changes state on every run and that change triggers another render and another effect. Typical causes are a missing dependency array, or a dependency that is a new object, array or function on every render. Fix it by adding the right dependency array, moving the object inside the effect, stabilising it with `useMemo` or `useCallback`, or using a functional update.",
    detailedAnswer: [
      "Without a dependency array an effect runs after every render. If it calls `setState`, the cycle never ends.",
      "Objects and arrays are compared by reference. `{ page: 1 }` created in the component body is a new object every render, so the effect re-runs each time.",
      "Prefer depending on primitive values like `page` instead of the object that contains them.",
      "If you need the latest value without re-running the effect, a ref or a functional update can avoid the dependency.",
    ],
    realWorldExample:
      'An effect that fetches a list and has `options = { sort: "asc" }` in its dependencies refetches endlessly, because `options` is a new object on each render.',
    codeExamples: [
      {
        title: "A loop and two fixes",
        language: "jsx",
        code: `// Loop: no dependency array, sets state every time
useEffect(() => { setCount(count + 1) })

// Loop: new object each render as a dependency
const options = { sort: "asc" }
useEffect(() => { load(options) }, [options])

// Fixes
useEffect(() => { load({ sort: "asc" }) }, [])        // create inside
const sort = "asc"
useEffect(() => { load({ sort }) }, [sort])           // primitive dependency`,
        walkthrough: [
          "The first effect updates state after every render, so it never settles.",
          "The second depends on an object that changes identity on every render.",
          "Creating the object inside the effect removes it from the dependencies.",
          "Using a primitive value gives React something stable to compare.",
        ],
      },
    ],
    commonMistakes: [
      "Removing dependencies to silence the loop and causing stale values.",
      "Putting objects or arrays created in render into the dependency array.",
    ],
    followUps: [
      {
        question: "What does the react-hooks/exhaustive-deps lint rule check?",
      },
    ],
    answerTips: [
      "Say 'render, effect, set state, render' to explain the loop, then give the fix.",
    ],
    keyPoints: [
      "Effect sets state and triggers itself",
      "Missing array runs every render",
      "Objects and functions are new each render",
      "Depend on primitives or stabilise values",
    ],
    revisionNotes: ["New reference each render means the effect re-runs."],
    sourceRefs: [
      {
        label: "React docs: useEffect (specifying reactive dependencies)",
        url: "https://react.dev/reference/react/useEffect",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "useeffect-vs-uselayouteffect",
    topic: "useEffect",
    difficulty: "hard",
    title: "What is the difference between useEffect and useLayoutEffect?",
    keywords: [
      "useEffect",
      "useLayoutEffect",
      "paint",
      "DOM measurement",
      "flicker",
      "synchronous",
    ],
    interviewerIntent:
      "Checks that you understand when an effect runs relative to the browser painting the screen.",
    shortAnswer:
      "Both run after React updates the DOM. `useLayoutEffect` runs synchronously before the browser paints, so you can measure the DOM and update state without a visible flicker, but it blocks painting. `useEffect` usually runs after the browser has painted, so it does not delay the screen update. Use `useEffect` by default and `useLayoutEffect` only for measuring or adjusting layout.",
    detailedAnswer: [
      "A tooltip that must be positioned based on its own measured size is a typical case for `useLayoutEffect`.",
      "Slow code inside `useLayoutEffect` delays the first paint and makes the page feel sluggish.",
      "`useLayoutEffect` does not run on the server, and React warns about using it in server-rendered components in some versions.",
      "If you are unsure, start with `useEffect` and switch only when you see a flicker.",
    ],
    realWorldExample:
      "A popover measures its trigger button with `getBoundingClientRect` inside `useLayoutEffect` and positions itself before the user sees the first frame.",
    commonMistakes: [
      "Using useLayoutEffect for data fetching.",
      "Doing heavy work inside it.",
    ],
    followUps: [
      {
        question:
          "Why does useLayoutEffect cause a warning during server rendering?",
      },
    ],
    answerTips: [
      "Explain it with the browser paint step: layout effect before paint, regular effect after.",
    ],
    keyPoints: [
      "useLayoutEffect runs before paint",
      "useEffect runs after paint, in most cases",
      "Layout effect blocks rendering",
      "Use it only to measure or fix layout",
    ],
    revisionNotes: ["Layout effect before paint, effect after."],
    sourceRefs: [
      {
        label: "React docs: useLayoutEffect",
        url: "https://react.dev/reference/react/useLayoutEffect",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "you-might-not-need-an-effect",
    topic: "useEffect",
    difficulty: "medium",
    title: "When should you not use useEffect?",
    keywords: [
      "useEffect",
      "event handlers",
      "derived data",
      "key",
      "effect chains",
      "synchronisation",
    ],
    interviewerIntent:
      "Checks that you reserve effects for synchronising with external systems and avoid common misuse.",
    shortAnswer:
      "Do not use an effect to calculate values from props or state, because you can compute them during rendering. Do not use one to respond to a user action, because that belongs in an event handler. Also avoid chains of effects that set state for one another, and resetting state on a prop change, where a `key` is simpler. Effects are for synchronising with things outside React.",
    detailedAnswer: [
      "Transforming data for display belongs in the render body, optionally with `useMemo`.",
      "Sending a request after the user clicks 'Buy' belongs in the click handler, because the user action is the cause.",
      "Effects that only update state in response to other state cost an extra render each time.",
      "Good uses of effects: connecting to a server, subscribing to browser events, controlling a non-React widget and fetching data that must stay in sync with props.",
    ],
    realWorldExample:
      "A form used an effect to compute `fullName` from `firstName` and `lastName`. Removing the effect and computing it in render deleted a render and a bug.",
    commonMistakes: [
      "Syncing one state to another with an effect.",
      "Running logic in an effect that should run in an event handler.",
    ],
    followUps: [
      {
        question:
          "How do you reset a form's state when the selected user changes?",
        hint: "Pass a key.",
      },
    ],
    answerTips: [
      "Give the question: 'Is this caused by the render or by the user?'",
    ],
    keyPoints: [
      "Derive in render",
      "User actions go in handlers",
      "Avoid effect chains",
      "Effects sync with external systems",
    ],
    revisionNotes: ["Effect = sync with the outside world."],
    sourceRefs: [
      {
        label: "React docs: You Might Not Need an Effect",
        url: "https://react.dev/learn/you-might-not-need-an-effect",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "usememo-vs-usecallback",
    topic: "useMemo & useCallback",
    difficulty: "medium",
    title: "What is the difference between useMemo and useCallback?",
    keywords: [
      "useMemo",
      "useCallback",
      "memoization",
      "referential equality",
      "dependencies",
      "cache",
    ],
    interviewerIntent:
      "A standard hooks comparison. It checks that you know what each one caches.",
    shortAnswer:
      "`useMemo` caches the result of a calculation and recalculates it only when its dependencies change. `useCallback` caches a function itself so that its reference stays the same between renders unless dependencies change. `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. Both are performance tools, not something every component needs.",
    detailedAnswer: [
      "`useMemo` is for expensive calculations and for keeping the identity of objects or arrays stable.",
      "`useCallback` is mainly useful when passing a function to a memoized child or listing it as a dependency of another hook.",
      "Both accept a dependency array and compare the values with `Object.is`.",
      "React may discard cached values in some situations, so your code must work correctly without them.",
    ],
    realWorldExample:
      "A table sorts 10,000 rows with `useMemo`, and passes a stable `onSelect` to memoized rows with `useCallback`.",
    codeExamples: [
      {
        title: "Both hooks",
        language: "jsx",
        code: `function Table({ rows, query }) {
  const visible = useMemo(
    () => rows.filter(r => r.name.includes(query)).sort(byName),
    [rows, query]
  )
  const onSelect = useCallback((id) => console.log("selected", id), [])

  return visible.map(r => <Row key={r.id} row={r} onSelect={onSelect} />)
}`,
        walkthrough: [
          "`useMemo` keeps the filtered and sorted list until `rows` or `query` changes.",
          "`useCallback` keeps the same `onSelect` function between renders.",
          "A memoized `Row` can then skip re-rendering when nothing relevant changed.",
        ],
      },
    ],
    commonMistakes: [
      "Memoizing cheap calculations.",
      "Forgetting dependencies and returning stale values.",
    ],
    followUps: [
      { question: "What happens if you leave the dependency array empty?" },
    ],
    answerTips: ["Say what each caches: a value versus a function."],
    keyPoints: [
      "useMemo caches a value",
      "useCallback caches a function",
      "Both depend on a dependency array",
      "Use only when it helps",
    ],
    revisionNotes: ["Memo = value, callback = function."],
    sourceRefs: [
      {
        label: "React docs: useMemo",
        url: "https://react.dev/reference/react/useMemo",
      },
      {
        label: "React docs: useCallback",
        url: "https://react.dev/reference/react/useCallback",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "when-to-memoize",
    topic: "useMemo & useCallback",
    difficulty: "medium",
    title:
      "Should you wrap every function and value in useMemo or useCallback?",
    keywords: [
      "premature optimisation",
      "useMemo",
      "useCallback",
      "profiling",
      "React Profiler",
      "memoization cost",
    ],
    interviewerIntent:
      "Checks engineering judgement: measure first, optimise where it matters.",
    shortAnswer:
      "No. Memoization has a cost, because React must store the previous value and compare dependencies on every render, and it makes code harder to read. Use `useMemo` or `useCallback` when a calculation is measurably slow, or when a stable reference is needed for a memoized child or a hook dependency. Measure with the React Profiler before adding them.",
    detailedAnswer: [
      "Most renders are fast. A simple calculation or a small function costs less than the memoization bookkeeping.",
      "Often a structural fix is better: move state closer to where it is used, or pass `children` so expensive siblings do not re-render.",
      "Memoization only pays off when the memoized value is actually reused and the consumer, such as `React.memo`, checks it.",
      "Write correct code first, and optimise from measurements.",
    ],
    realWorldExample:
      "A developer wrapped everything in `useCallback`, but the page did not get faster because the children were not memoized. Moving the state of a text input into its own component solved the real problem.",
    commonMistakes: [
      "Optimising without measuring.",
      "Memoizing a function and passing it to a child that is not memoized.",
    ],
    followUps: [
      { question: "How do you use the React Profiler to find slow renders?" },
    ],
    answerTips: [
      "Show judgement: measure, then try restructuring, then memoize.",
    ],
    keyPoints: [
      "Memoization has a cost",
      "Measure with the Profiler",
      "Only useful with a consumer that checks identity",
      "Restructure first",
    ],
    revisionNotes: ["Measure before memoizing."],
    sourceRefs: [
      {
        label: "React docs: useMemo (should you add useMemo everywhere?)",
        url: "https://react.dev/reference/react/useMemo",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "referential-equality-in-dependencies",
    topic: "useMemo & useCallback",
    difficulty: "hard",
    title:
      "What is referential equality and why does it matter for hook dependencies?",
    keywords: [
      "referential equality",
      "Object.is",
      "dependency array",
      "new object",
      "memoization",
      "reference",
    ],
    interviewerIntent:
      "Checks the idea behind many hook bugs: objects and functions are new on every render.",
    shortAnswer:
      "React compares dependencies with `Object.is`, which checks whether two values are the same reference. Primitives like numbers and strings compare by value, but objects, arrays and functions created in the component body are new references on every render, even if their contents are identical. A dependency that is recreated every render makes effects and memoized values run again each time.",
    detailedAnswer: [
      "`{ a: 1 } === { a: 1 }` is false in JavaScript, because they are two separate objects.",
      "To keep a stable reference, create the value outside the component, move it inside the effect, or wrap it in `useMemo` or `useCallback`.",
      "Depending on primitive fields, such as `user.id`, is often simpler than depending on the whole object.",
      "This is also why `React.memo` fails when you pass a fresh inline object or function as a prop.",
    ],
    realWorldExample:
      'A chart component re-runs its expensive setup effect on every parent render because it receives `config={{ theme: "dark" }}` as a new object each time.',
    codeExamples: [
      {
        title: "Unstable and stable dependencies",
        language: "jsx",
        code: `function Chart({ data }) {
  const config = { theme: "dark" }            // new object every render
  useEffect(() => draw(data, config), [data, config])   // runs every render

  const stable = useMemo(() => ({ theme: "dark" }), [])
  useEffect(() => draw(data, stable), [data, stable])   // runs when data changes
}`,
        walkthrough: [
          "`config` is a different object on every render, so the first effect always re-runs.",
          "`useMemo` with no dependencies returns the same object each time.",
          "The second effect now only re-runs when `data` changes.",
        ],
      },
    ],
    commonMistakes: [
      "Believing objects with the same contents are equal.",
      "Passing inline objects to memoized children.",
    ],
    followUps: [
      {
        question:
          "How can you avoid needing the object as a dependency at all?",
      },
    ],
    answerTips: [
      "Start with `{} === {}` being false, then connect it to hooks.",
    ],
    keyPoints: [
      "Dependencies are compared with Object.is",
      "Objects and functions are new each render",
      "Stabilise with useMemo, useCallback or by moving them",
      "Prefer primitive dependencies",
    ],
    revisionNotes: ["Same contents is not the same reference."],
    sourceRefs: [
      {
        label:
          "React docs: useEffect (removing unnecessary object dependencies)",
        url: "https://react.dev/learn/removing-effect-dependencies#does-some-reactive-value-change-unexpectedly",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "useref-dom-and-mutable-values",
    topic: "useRef",
    difficulty: "easy",
    title: "What is useRef and what is it used for?",
    keywords: [
      "useRef",
      "ref",
      "DOM access",
      "mutable value",
      "focus",
      "timer id",
    ],
    interviewerIntent:
      "Checks that you know both uses of refs: reaching the DOM and keeping a value that does not trigger renders.",
    shortAnswer:
      "`useRef` returns an object `{ current }` that stays the same between renders. Changing `ref.current` does not cause a re-render. It has two main uses: holding a reference to a DOM element, via the `ref` attribute, so you can focus it or measure it, and storing a mutable value that must survive renders, such as a timer id or the previous value.",
    detailedAnswer: [
      "`ref.current` is `null` until React attaches the element after the first render, so read it in effects or event handlers.",
      "Avoid reading or writing `ref.current` during rendering, because that makes rendering unpredictable.",
      "Prefer state for anything shown on screen, and use a ref for data that is not part of the output.",
      "Do not change the DOM that React manages through refs, except for things like focus, scroll and measurement.",
    ],
    realWorldExample:
      "A search page focuses its input when it opens, and a debounce hook stores the timeout id in a ref so it can cancel it later.",
    codeExamples: [
      {
        title: "Focus an input and keep a timer id",
        language: "jsx",
        code: `function Search() {
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => { inputRef.current.focus() }, [])

  function onChange() {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => console.log("search"), 300)
  }
  return <input ref={inputRef} onChange={onChange} />
}`,
        walkthrough: [
          "`inputRef` is attached with the `ref` attribute, so React sets `current` to the input element.",
          "The effect runs after mount and focuses it.",
          "`timerRef` holds a timeout id that changes without needing a render.",
          "Clearing the previous timer makes the search wait until typing pauses.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting a re-render when ref.current changes.",
      "Reading ref.current during render.",
    ],
    followUps: [{ question: "How is a ref different from state?" }],
    answerTips: ["Name both uses: DOM element and persistent mutable value."],
    keyPoints: [
      "Object with a current property",
      "Same object across renders",
      "Changing it does not re-render",
      "Use for DOM access and non-render values",
    ],
    revisionNotes: ["Ref = box that survives renders without re-rendering."],
    sourceRefs: [
      {
        label: "React docs: useRef",
        url: "https://react.dev/reference/react/useRef",
      },
      {
        label: "React docs: Referencing values with refs",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "useref-vs-usestate",
    topic: "useRef",
    difficulty: "medium",
    title: "What is the difference between useRef and useState?",
    keywords: [
      "useRef",
      "useState",
      "re-render",
      "mutable",
      "persist",
      "render output",
    ],
    interviewerIntent:
      "A comparison that shows whether you can choose the right tool for a given piece of data.",
    shortAnswer:
      "Both keep a value between renders, but changing state schedules a re-render and the new value shows in the UI, while changing `ref.current` does not re-render anything. A ref's value can be mutated directly and read immediately, whereas state is a snapshot updated through its setter. Use state for data that appears on screen and a ref for values that do not affect the output.",
    detailedAnswer: [
      "If the user must see the change, such as a counter or a toggle, use state.",
      "If you only need to remember something for later, such as an interval id, the previous value or a DOM node, use a ref.",
      "Mutating a ref is the one allowed form of mutation in React, but do not do it during render.",
      "A common mistake is using a ref for a value shown in the UI and then wondering why the screen does not update.",
    ],
    realWorldExample:
      "A stopwatch keeps the displayed seconds in state, so the screen updates, and the interval id in a ref, so it can be cleared on stop.",
    codeExamples: [
      {
        title: "State for the screen, ref for the id",
        language: "jsx",
        code: `function Stopwatch() {
  const [seconds, setSeconds] = useState(0)   // shown on screen
  const intervalRef = useRef(null)             // not shown

  function start() {
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }
  function stop() { clearInterval(intervalRef.current) }

  return <p>{seconds}s <button onClick={start}>Start</button> <button onClick={stop}>Stop</button></p>
}`,
        walkthrough: [
          "`seconds` is state because the screen must update every second.",
          "`intervalRef` stores the id so `stop` can clear the timer.",
          "Setting `intervalRef.current` does not trigger a render, which is what we want.",
        ],
      },
    ],
    commonMistakes: [
      "Using a ref for displayed data.",
      "Using state for a value that never appears in the UI and causes extra renders.",
    ],
    followUps: [
      { question: "Can you use a ref to read the previous value of a prop?" },
    ],
    answerTips: [
      "Use the rule: does it appear on screen? State. Otherwise a ref.",
    ],
    keyPoints: [
      "State changes re-render",
      "Ref changes do not",
      "Ref is mutable and immediate",
      "Use ref for non-visual values",
    ],
    revisionNotes: ["On screen = state, behind the scenes = ref."],
    sourceRefs: [
      {
        label:
          "React docs: Referencing values with refs (differences between refs and state)",
        url: "https://react.dev/learn/referencing-values-with-refs",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "usereducer-basics",
    topic: "useReducer",
    difficulty: "medium",
    title: "What is useReducer? Show how a reducer and dispatch work.",
    keywords: [
      "useReducer",
      "reducer",
      "dispatch",
      "action",
      "state transitions",
      "pure function",
    ],
    interviewerIntent:
      "Checks that you can structure complex state with a reducer instead of many setters.",
    shortAnswer:
      '`useReducer(reducer, initialState)` returns the current state and a `dispatch` function. You dispatch an action, usually an object like `{ type: "add" }`, and React calls your reducer, a pure function `(state, action) => newState`, to compute the next state. It keeps all update logic in one place and suits state with several related fields or many kinds of updates.',
    detailedAnswer: [
      "The reducer must not mutate the state or perform side effects. It returns a new state object.",
      "Because the reducer is a plain function, it can be tested without rendering a component.",
      "`dispatch` has a stable identity, so it is safe to pass to children or to leave out of effect dependencies.",
      "An unknown action type should throw or return the current state, so mistakes are noticed.",
    ],
    realWorldExample:
      "A shopping cart supports add, remove, change quantity and clear. One reducer handles all four actions, and the UI only dispatches them.",
    codeExamples: [
      {
        title: "A cart reducer",
        language: "jsx",
        code: `function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.item]
    case "remove":
      return state.filter(i => i.id !== action.id)
    case "clear":
      return []
    default:
      throw new Error("Unknown action: " + action.type)
  }
}

function Cart() {
  const [items, dispatch] = useReducer(reducer, [])
  return <button onClick={() => dispatch({ type: "add", item: { id: 1 } })}>Add</button>
}`,
        walkthrough: [
          "The reducer receives the current state and an action and returns the next state.",
          "Each case returns a new array without mutating the old one.",
          "`dispatch` sends an action to the reducer.",
          "An unknown action throws, which surfaces typing mistakes quickly.",
        ],
      },
    ],
    commonMistakes: [
      "Mutating state inside the reducer.",
      "Doing side effects such as fetching inside the reducer.",
    ],
    followUps: [
      { question: "When would you choose useReducer over useState?" },
    ],
    answerTips: [
      "Say 'pure function', and mention that it can be tested on its own.",
    ],
    keyPoints: [
      "reducer(state, action) returns new state",
      "dispatch sends actions",
      "Reducer is pure",
      "Good for complex or related state",
    ],
    revisionNotes: ["Dispatch an action, the reducer decides."],
    sourceRefs: [
      {
        label: "React docs: useReducer",
        url: "https://react.dev/reference/react/useReducer",
      },
      {
        label: "React docs: Extracting state logic into a reducer",
        url: "https://react.dev/learn/extracting-state-logic-into-a-reducer",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "usereducer-vs-usestate",
    topic: "useReducer",
    difficulty: "medium",
    title: "When should you choose useReducer over useState?",
    keywords: [
      "useReducer",
      "useState",
      "complex state",
      "state transitions",
      "testing",
      "dispatch",
    ],
    interviewerIntent:
      "Checks that you pick the simplest tool and know when state logic has outgrown it.",
    shortAnswer:
      "Use `useState` for simple, independent values. Choose `useReducer` when the next state depends on the previous one in several ways, when many fields change together, or when many event handlers update the same state and you want that logic in one place. A reducer is also easy to unit test, though it adds more code, so do not use it for simple cases.",
    detailedAnswer: [
      "With `useState` the update logic is spread over the handlers. With `useReducer` the component dispatches intentions and the reducer describes how the state changes.",
      "A reducer makes the possible state transitions explicit, which helps prevent impossible combinations.",
      "`dispatch` is stable, which can simplify dependency arrays.",
      "You can start with `useState` and switch when the handlers get tangled.",
    ],
    realWorldExample:
      "A multi-step checkout with steps, errors, form data and a submitting flag is easier to reason about with one reducer than with six separate `useState` calls.",
    commonMistakes: [
      "Using a reducer for a single boolean.",
      "Putting side effects in the reducer.",
    ],
    followUps: [
      {
        question: "How can you combine useReducer with Context to share state?",
      },
    ],
    answerTips: [
      "Say 'start simple' and give the checkout example as a reason to switch.",
    ],
    keyPoints: [
      "useState for simple values",
      "useReducer for complex related updates",
      "Reducer is testable and explicit",
      "Do not over-engineer",
    ],
    revisionNotes: ["Simple: useState. Complex transitions: useReducer."],
    sourceRefs: [
      {
        label: "React docs: Comparing useState and useReducer",
        url: "https://react.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "custom-hook-basics",
    topic: "Custom hooks",
    difficulty: "easy",
    title: "What is a custom hook? What are the rules for creating one?",
    keywords: [
      "custom hook",
      "use prefix",
      "reuse logic",
      "composition",
      "rules of hooks",
    ],
    interviewerIntent:
      "Checks that you can extract reusable stateful logic and follow the naming and call rules.",
    shortAnswer:
      "A custom hook is a function whose name starts with `use` and that calls other hooks. It lets you share stateful logic between components without changing the component tree. Each component that calls the hook gets its own separate state. The same rules apply as for built-in hooks: call hooks only at the top level and only from components or other hooks.",
    detailedAnswer: [
      "The `use` prefix tells React and the linter to apply the rules of hooks to that function.",
      "A custom hook shares logic, not state. Two components using `useToggle` have independent values.",
      "It can accept arguments and return anything: a value, a pair like `useState`, or an object.",
      "Extract a hook when the same combination of state and effects appears in more than one place, or when it makes a component easier to read.",
    ],
    realWorldExample:
      "`useOnlineStatus` subscribes to the browser's online and offline events and returns a boolean, used by a banner and by the submit button.",
    codeExamples: [
      {
        title: "A small custom hook",
        language: "jsx",
        code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(v => !v), [])
  return [on, toggle]
}

function Menu() {
  const [open, toggleOpen] = useToggle()
  return <button onClick={toggleOpen}>{open ? "Close" : "Open"}</button>
}`,
        walkthrough: [
          "`useToggle` uses `useState` and `useCallback` internally.",
          "It returns the value and a stable toggle function.",
          "`Menu` uses it like any built-in hook, and keeps its own state.",
        ],
      },
    ],
    commonMistakes: [
      "Naming the function without the `use` prefix.",
      "Thinking two components share state because they use the same hook.",
    ],
    followUps: [
      {
        question:
          "How can two components share the same state if hooks do not share it?",
      },
    ],
    answerTips: ["Say 'shares logic, not state'."],
    keyPoints: [
      "Name starts with use",
      "Calls other hooks",
      "Shares logic, not state",
      "Follows the rules of hooks",
    ],
    revisionNotes: ["Custom hook = reusable logic."],
    sourceRefs: [
      {
        label: "React docs: Reusing logic with custom hooks",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "write-usefetch-hook",
    topic: "Custom hooks",
    difficulty: "medium",
    title: "How would you write a reusable useFetch hook?",
    keywords: [
      "useFetch",
      "custom hook",
      "loading",
      "error",
      "AbortController",
      "data fetching",
    ],
    interviewerIntent:
      "A common live-coding task. It combines state, effects, cleanup and a clear return shape.",
    shortAnswer:
      "Write a hook that takes a URL, keeps `data`, `loading` and `error` in state, and fetches inside `useEffect` with the URL as a dependency. Cancel the request in the cleanup with an `AbortController` so an old response cannot overwrite a newer one. Return an object with the three values so components stay simple.",
    detailedAnswer: [
      "Reset `loading` to true and clear the error when the URL changes.",
      "Check `response.ok`, because `fetch` only rejects on network failures, not on HTTP errors like 404.",
      "Ignore the `AbortError` that happens when the request is cancelled on purpose.",
      "In real projects a library such as TanStack Query adds caching, retries and deduplication, so a hand-written hook is best for learning or small apps.",
    ],
    realWorldExample:
      "Several pages load JSON from different endpoints. One `useFetch(url)` hook removes the repeated loading and error code from all of them.",
    codeExamples: [
      {
        title: "useFetch",
        language: "jsx",
        code: `function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => {
        if (error.name !== "AbortError") setState({ data: null, loading: false, error })
      })

    return () => controller.abort()
  }, [url])

  return state
}

// const { data, loading, error } = useFetch("/api/products")`,
        walkthrough: [
          "The state object holds the three values together, so they cannot disagree.",
          "The effect restarts when `url` changes and resets to the loading state.",
          "A non-OK HTTP response is converted into an error.",
          "The cleanup aborts the request, and the abort error is ignored.",
        ],
      },
    ],
    commonMistakes: [
      "Not checking response.ok.",
      "Not cancelling stale requests.",
    ],
    followUps: [
      { question: "How would you add a refetch function and caching?" },
    ],
    answerTips: [
      "Mention cancellation and the response.ok check, they separate a good answer from a basic one.",
    ],
    keyPoints: [
      "State: data, loading, error",
      "Effect depends on the url",
      "AbortController in cleanup",
      "Check response.ok",
    ],
    revisionNotes: ["useFetch = state + effect + cleanup."],
    sourceRefs: [
      {
        label: "React docs: Reusing logic with custom hooks",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
      {
        label: "MDN: Using the Fetch API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
      },
    ],
    estimatedMinutes: 6,
  },
  {
    slug: "write-usedebounce-hook",
    topic: "Custom hooks",
    difficulty: "medium",
    title: "How would you write a useDebounce hook?",
    keywords: [
      "useDebounce",
      "debounce",
      "custom hook",
      "setTimeout",
      "cleanup",
      "search input",
    ],
    interviewerIntent:
      "A classic hook-writing exercise that tests timers, cleanup and dependencies.",
    shortAnswer:
      "`useDebounce(value, delay)` keeps a copy of the value in state and updates that copy only after the value has stopped changing for the delay. Inside `useEffect`, start a `setTimeout` that sets the debounced value, and return a cleanup that clears the timer. Each new change cancels the previous timer, so only the last value in a burst gets through.",
    detailedAnswer: [
      "The dependencies are `[value, delay]`, so the timer restarts whenever either changes.",
      "Components use the debounced value to trigger the expensive work, such as a search request.",
      "This is the value-based form. A function-based debounce is a different approach for callbacks.",
      "Without the cleanup, several timers would fire and the final value could be set out of order.",
    ],
    realWorldExample:
      "A search box updates `query` on every keystroke, but the API request effect depends on `useDebounce(query, 300)`, so the request is sent after the user pauses.",
    codeExamples: [
      {
        title: "useDebounce",
        language: "jsx",
        code: `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

function Search() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  useEffect(() => { /* request using debouncedQuery */ }, [debouncedQuery])
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
        walkthrough: [
          "The input updates `query` immediately, so typing feels responsive.",
          "The hook starts a timer each time `query` changes.",
          "The cleanup cancels the previous timer, so only the last change survives.",
          "The request effect only reacts to `debouncedQuery`.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting to clear the timer.",
      "Debouncing the input's own value so typing feels laggy.",
    ],
    followUps: [
      { question: "What is the difference between debounce and throttle?" },
    ],
    answerTips: [
      "Explain that the input stays instant while only the derived value is delayed.",
    ],
    keyPoints: [
      "Copy of the value in state",
      "setTimeout inside an effect",
      "Cleanup clears the timer",
      "Depend on value and delay",
    ],
    revisionNotes: ["Timer per change, cleanup cancels the old one."],
    sourceRefs: [
      {
        label: "React docs: useEffect (cleanup)",
        url: "https://react.dev/reference/react/useEffect",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "write-uselocalstorage-hook",
    topic: "Custom hooks",
    difficulty: "medium",
    title: "How would you write a useLocalStorage hook?",
    keywords: [
      "useLocalStorage",
      "localStorage",
      "custom hook",
      "JSON",
      "lazy initial state",
      "persist state",
    ],
    interviewerIntent:
      "Tests lazy state initialisation, effects and safe handling of stored data in one small hook.",
    shortAnswer:
      "`useLocalStorage(key, initial)` behaves like `useState` but persists the value. Read the stored JSON once with a lazy initial state, and fall back to `initial` if nothing is saved or parsing fails. Write the value back in a `useEffect` whenever it changes. Wrap storage access in try/catch, because it can be unavailable or hold invalid data.",
    detailedAnswer: [
      "Use the lazy form of `useState` so storage is read only on the first render.",
      "Values are stored as strings, so use `JSON.stringify` and `JSON.parse`.",
      "Accessing `localStorage` can throw in private modes or when storage is full, so guard every call.",
      "In server-rendered apps `window` does not exist on the server, so check for it before reading storage.",
    ],
    realWorldExample:
      "A theme switch and a sidebar-collapsed flag both use the same hook, and survive a page reload.",
    codeExamples: [
      {
        title: "useLocalStorage",
        language: "jsx",
        code: `function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])

  return [value, setValue]
}

// const [theme, setTheme] = useLocalStorage("theme", "light")`,
        walkthrough: [
          "The lazy initialiser reads and parses the saved value once.",
          "Any failure falls back to the initial value instead of crashing.",
          "The effect saves the value each time it changes.",
          "The hook returns the same pair shape as `useState`.",
        ],
      },
    ],
    commonMistakes: [
      "Parsing without try/catch.",
      "Reading localStorage on every render.",
    ],
    followUps: [
      {
        question: "How would you keep two browser tabs in sync?",
        hint: "The storage event.",
      },
    ],
    answerTips: [
      "Point out that the return value mirrors useState, so it is a drop-in replacement.",
    ],
    keyPoints: [
      "Lazy initial state reads once",
      "JSON stringify and parse",
      "Effect writes changes",
      "Guard storage access",
    ],
    revisionNotes: ["useState plus persistence."],
    sourceRefs: [
      {
        label: "React docs: useState (lazy initial state)",
        url: "https://react.dev/reference/react/useState",
      },
      {
        label: "MDN: Web Storage API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "custom-hooks-do-not-share-state",
    topic: "Custom hooks",
    difficulty: "medium",
    title: "If two components use the same custom hook, do they share state?",
    keywords: [
      "custom hook",
      "shared state",
      "independent state",
      "Context",
      "lifting state",
      "state library",
    ],
    interviewerIntent:
      "Checks a common misconception: hooks share logic, not data.",
    shortAnswer:
      "No. Every call to a custom hook creates its own state, so two components that use `useCounter` have separate counters. A custom hook shares the code, not the values. To share state, lift it to a common parent and pass it down, put it in Context, or use an external store such as Zustand or Redux.",
    detailedAnswer: [
      "The state lives with the component instance that called the hook, not with the hook function.",
      "Lifting state up is the simplest option when the components are close in the tree.",
      "Context suits values read by many distant components, and an external store suits larger or frequently changing global state.",
      "A hook can also wrap a Context, for example `useAuth()` that reads `AuthContext`, which gives a clean API for shared state.",
    ],
    realWorldExample:
      "Two pages both call `useCart()` and show different numbers, until the cart state is moved into a Context provider that the hook reads.",
    commonMistakes: [
      "Assuming the hook behaves like a singleton.",
      "Using a custom hook with local state where global state was needed.",
    ],
    followUps: [
      {
        question:
          "How would you turn useCart into a shared cart for the whole app?",
      },
    ],
    answerTips: [
      "Say 'shares logic, not state' and then list the three ways to share state.",
    ],
    keyPoints: [
      "Each call has its own state",
      "Hooks share logic",
      "Share state by lifting, Context or a store",
      "A hook can wrap a Context",
    ],
    revisionNotes: ["Same hook, separate state."],
    sourceRefs: [
      {
        label:
          "React docs: Reusing logic with custom hooks (state is not shared)",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
    ],
    estimatedMinutes: 4,
  },
])
