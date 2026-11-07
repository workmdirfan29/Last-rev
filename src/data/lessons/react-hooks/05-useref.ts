import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "useref",
  title: "useRef: refs for the DOM and for values that do not render",
  topic: "useRef",
  minutes: 40,
  overview:
    "Use refs to reach DOM elements and to store values that must persist without causing a render.",
  objectives: [
    "Create a ref and attach it to a DOM element",
    "Explain the difference between a ref and state",
    "Use refs for timers, previous values and focus, and avoid reading them while rendering",
  ],
  prerequisites: ["lesson.react-hooks.useeffect"],
  sections: [
    {
      kind: "explain",
      heading: "What a ref is",
      body: [
        "`useRef(initial)` returns an object `{ current: initial }`. React keeps **the same object** between renders. Changing `ref.current` does **not** cause a render, and the value is not reset when the component renders again.",
        "A ref is an escape hatch for things that are not part of what is shown: the id of a timer, a previous value, a flag, a reference to a DOM element. If a value should appear on the screen, it must be **state**, because only state changes cause a render.",
        "Read and write `ref.current` in **event handlers and effects**, not during rendering. Reading it while rendering makes the component impure, because the result can differ for the same inputs.",
      ],
    },
    {
      kind: "code",
      heading: "A DOM ref",
      example: {
        title: "Focus an input",
        language: "jsx",
        code: "function SearchBox() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    inputRef.current.focus();\n  }, []);\n\n  return (\n    <>\n      <input ref={inputRef} placeholder=\"Search\" />\n      <button onClick={() => (inputRef.current.value = '')}>Clear</button>\n    </>\n  );\n}",
        walkthrough: [
          "`ref={inputRef}` tells React to put the DOM element in `inputRef.current` after rendering.",
          "The effect runs after the first render, when the element exists, and focuses it.",
          "Before the element is attached, `current` is `null`, so do not use it during rendering.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Refs versus state",
      body: [
        "State: changing it **renders** the component, and it is read during rendering. Ref: changing it **does not render**, and it is read in handlers and effects. Use a ref when a change must not update the screen.",
        "Typical uses are the id returned by `setTimeout` or `setInterval`, so that a handler can clear it later, the previous value of a prop, a value that an effect needs to read at its latest value without being a dependency, and the DOM nodes of a measured or focused element.",
        "Use refs to touch the DOM only for things React does not manage: focus, scrolling, measuring, and playing media. Do not use them to change the text or the structure that React renders, because React and your code would fight over the same elements.",
      ],
    },
    {
      kind: "code",
      heading: "Timer id and previous value",
      example: {
        title: "Refs that do not render",
        language: "jsx",
        code: "function Stopwatch() {\n  const [seconds, setSeconds] = useState(0);\n  const timerRef = useRef(null);\n\n  function start() {\n    if (timerRef.current !== null) return;\n    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);\n  }\n  function stop() {\n    clearInterval(timerRef.current);\n    timerRef.current = null;\n  }\n  useEffect(() => stop, []);\n  return (\n    <>\n      <p>{seconds}</p>\n      <button onClick={start}>Start</button>\n      <button onClick={stop}>Stop</button>\n    </>\n  );\n}",
        walkthrough: [
          "The timer id is kept in a ref, so changing it does not render, and it survives between renders.",
          "`start` ignores a second click while a timer is running.",
          "`useEffect(() => stop, [])` returns `stop` as the clean-up, so the timer stops when the component is removed.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Reading or writing `ref.current` during rendering.",
          fix: "Use it in handlers and effects. For rendered values, use state.",
        },
        {
          mistake:
            "Using a ref instead of state for a value shown on the screen.",
          fix: "The screen will not update. Use state.",
        },
        {
          mistake:
            "Using a ref before it is attached, when `current` is `null`.",
          fix: "Use it in an effect or a handler, and check for `null` if it may be absent.",
        },
        {
          mistake: "Changing DOM that React renders through a ref.",
          fix: "Let React manage it. Use refs for focus, scroll and measurement only.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Scroll to the newest message",
      scenario:
        "A chat list should scroll to the bottom when a message is added.",
      body: [
        "Keep a ref on the element at the end of the list. An effect that depends on `messages.length` calls `endRef.current.scrollIntoView()`. Scrolling is a DOM action that React does not manage, so a ref is the right tool.",
        "The list itself is still rendered from state.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "ref-render",
      prompt: "What happens when you change `ref.current`?",
      options: [
        "Nothing is rendered",
        "The component renders again",
        "The ref is reset",
      ],
      answer: 0,
      explanation:
        "Refs are mutable boxes. Changing them does not cause a render.",
    },
    {
      type: "single",
      id: "ref-for",
      prompt: "Which is a good use of a ref?",
      options: [
        "Keeping a timer id",
        "Showing a counter on screen",
        "Storing the list of products",
      ],
      answer: 0,
      explanation:
        "A timer id is not displayed. A counter on screen must be state.",
    },
    {
      type: "truefalse",
      id: "ref-read-render",
      statement: "Reading `ref.current` while rendering is recommended.",
      answer: false,
      explanation:
        "It makes the component impure. Read refs in handlers and effects.",
    },
    {
      type: "blank",
      id: "ref-attr",
      prompt:
        "To attach a ref to a DOM element, write `<input ___={inputRef} />`.",
      answer: "ref",
      explanation:
        "The `ref` attribute tells React to store the element in `inputRef.current`.",
    },
  ],
  assignment: {
    title: "Focus and timers",
    task: [
      "Build a form that focuses the first invalid field on submit, using refs, and a stopwatch with start and stop.",
      "Check that the stopwatch does not leak when the component is removed.",
    ],
    checklist: [
      "The first invalid input gets focus",
      "Starting twice does not create two timers",
      "The timer stops on removal",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "prev-value",
      title: "Track the previous value",
      task: [
        "Write a `usePrevious(value)` hook that returns the value from the previous render, using a ref and an effect. On the first render it returns `undefined`.",
      ],
      language: "jsx",
      starter: "function usePrevious(value) {\n  // your code\n}",
      solution:
        "function usePrevious(value) {\n  const ref = useRef();\n  useEffect(() => {\n    ref.current = value;\n  });\n  return ref.current;\n}",
      hints: [
        "The effect runs after the render, so the ref still holds the old value while rendering.",
      ],
      checklist: [
        "The first render returns undefined",
        "The ref is updated after the render",
        "No state is used",
      ],
    },
  ],
  revisionNotes: [
    "`useRef` gives a stable `{ current }` object; changing it does not render",
    "DOM refs: focus, scroll and measure; do not manage rendered content",
    "Refs for timer ids and previous values; state for what is shown",
    "Do not read or write `current` during rendering",
  ],
  resources: [
    {
      label: "React: useRef",
      url: "https://react.dev/reference/react/useRef",
    },
    {
      label: "React: Referencing Values with Refs",
      url: "https://react.dev/learn/referencing-values-with-refs",
    },
    {
      label: "React: Manipulating the DOM with Refs",
      url: "https://react.dev/learn/manipulating-the-dom-with-refs",
    },
  ],
})
