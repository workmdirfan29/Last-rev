import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "useeffect",
  title: "useEffect: synchronising with the outside world",
  topic: "useEffect",
  minutes: 70,
  overview:
    "Use effects to synchronise a component with something outside React, write correct dependency lists, clean up, and know when you do not need an effect.",
  objectives: [
    "Explain what an effect is for and when it runs",
    "Write dependency arrays and clean-up functions correctly",
    "Recognise cases where an effect is not needed",
  ],
  prerequisites: ["lesson.react-hooks.usestate-in-depth"],
  sections: [
    {
      kind: "explain",
      heading: "What effects are for",
      body: [
        "Rendering must be pure, so code that **does something outside the component**, such as a network request, a subscription, a timer or changing the page title, cannot run during the render. An **effect** is code that React runs **after** it has updated the screen. Effects are for **synchronising** a component with a system outside React.",
        "`useEffect(setup, dependencies)` takes a setup function and an optional list of dependencies. After each render where a dependency changed, React runs the setup. If the setup returns a function, it is the **clean-up**: React runs it before the next setup, and when the component is removed.",
        "The dependency list decides when it runs. `[]` means **once** after the first render, and clean-up when the component is removed. `[a, b]` means after the first render and whenever `a` or `b` changed. No list means after **every** render, which is rarely what you want.",
      ],
    },
    {
      kind: "code",
      heading: "Subscribe and clean up",
      example: {
        title: "A window size hook",
        language: "jsx",
        code: "function useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    function onResize() {\n      setWidth(window.innerWidth);\n    }\n    window.addEventListener('resize', onResize);\n    return () => window.removeEventListener('resize', onResize);\n  }, []);\n  return width;\n}\n\nfunction DocumentTitle({ title }) {\n  useEffect(() => {\n    document.title = title;\n  }, [title]);\n  return null;\n}",
        walkthrough: [
          "The setup adds a listener, and the clean-up removes it, so listeners do not pile up.",
          "`[]` is right here: the listener does not use any value from the component.",
          "The title effect depends on `title`, so it runs again whenever the title changes.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Dependencies tell the truth",
      body: [
        "The dependency list must contain **every reactive value** that the effect uses: props, state, and variables or functions created in the component. You do not choose the list to control when the effect runs. The list **describes** what the effect reads, and the lint rule `react-hooks/exhaustive-deps` checks it.",
        "If you leave a value out, the effect uses a **stale** value from an old render. If the list changes on every render, because it holds a new object or function each time, the effect runs every time. Fix that by moving the object inside the effect, or outside the component, or by making it stable with `useMemo` or `useCallback`.",
        "In development, `StrictMode` runs the setup, the clean-up and the setup again once. This checks that your clean-up works. If the effect behaves wrongly twice, the clean-up is missing or wrong.",
      ],
    },
    {
      kind: "code",
      heading: "Fetching with clean-up",
      example: {
        title: "Ignore stale results",
        language: "jsx",
        code: "function Profile({ id }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    fetch('/api/users/' + id, { signal: controller.signal })\n      .then((r) => r.json())\n      .then(setUser)\n      .catch((e) => {\n        if (e.name !== 'AbortError') console.error(e);\n      });\n    return () => controller.abort();\n  }, [id]);\n\n  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;\n}",
        walkthrough: [
          "The effect depends on `id`, so it runs again when `id` changes.",
          "The clean-up aborts the previous request, so an old answer cannot replace a newer one.",
          "Without it, a slow response for an old id could arrive last and show the wrong user.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "You might not need an effect",
      body: [
        "Many effects are not needed. **Calculating data from props and state** belongs in the render, not in an effect that sets more state. **Responding to a user action** belongs in the event handler, not in an effect that watches state. **Resetting state when a prop changes** can use a `key`. Data fetching is better done with a data library or a framework, which handle caching and races.",
        "Ask: does this code exist because the component was **shown**, or because the user **did** something? The first can be an effect. The second is an event handler.",
        "Avoid chains of effects where one sets state to trigger the next. Calculate everything in one place.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Leaving a value out of the dependency list.",
          fix: "List every reactive value the effect uses. Let the lint rule help.",
        },
        {
          mistake: "An effect that sets state from props to calculate a value.",
          fix: "Calculate it during the render.",
        },
        {
          mistake:
            "Forgetting clean-up for subscriptions, timers and requests.",
          fix: "Return a function that undoes the setup.",
        },
        {
          mistake: "Making the effect `async`: `useEffect(async () => ...)`.",
          fix: "Define an async function inside and call it, because the effect must return a clean-up function or nothing.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A chat room",
      scenario:
        "A component connects to a chat room by id, and must disconnect when the id changes or the component is removed.",
      body: [
        "The effect connects in its setup and returns a function that disconnects, with `[roomId]` as the dependency. Changing the room runs the clean-up for the old room and then connects to the new one.",
        "StrictMode connects, disconnects and connects again in development, which shows that the clean-up works.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "effect-deps-empty",
      prompt: "When does `useEffect(fn, [])` run its setup?",
      options: [
        "After the first render only",
        "After every render",
        "Before the first render",
      ],
      answer: 0,
      explanation:
        "An empty dependency list means that nothing can change, so the setup runs once.",
    },
    {
      type: "multi",
      id: "effect-needed",
      prompt: "For which of these is an effect appropriate?",
      options: [
        "Subscribing to a browser event",
        "Connecting to a server",
        "Calculating a filtered list from props",
        "Showing a message after a button click",
      ],
      answers: [0, 1],
      explanation:
        "Calculating from props belongs in the render, and reacting to a click belongs in the event handler.",
    },
    {
      type: "truefalse",
      id: "async-effect",
      statement: "You can pass an `async` function directly to `useEffect`.",
      answer: false,
      explanation:
        "An effect must return a clean-up function or nothing. An async function returns a promise.",
    },
    {
      type: "single",
      id: "stale-value",
      prompt:
        "What happens if an effect uses `count` but `count` is missing from the dependencies?",
      options: [
        "It reads an old value of count",
        "It runs after every render",
        "React throws an error",
      ],
      answer: 0,
      explanation:
        "The closure keeps the value from the render in which the effect was created, so it becomes stale.",
    },
  ],
  assignment: {
    title: "Effects that clean up",
    task: [
      "Write effects for a window resize listener, a timer and a fetch with an AbortController, each with the correct dependencies and clean-up.",
      "Turn on StrictMode and show that nothing leaks or runs twice with visible effects.",
    ],
    checklist: [
      "Every subscription has a clean-up",
      "The lint rule reports no missing dependency",
      "A fast change of id never shows an old result",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "effect-timer",
      title: "Write a timer effect",
      task: [
        "Write a `Clock` component with state `now` that updates every second with `setInterval`. Add the clean-up and the right dependency list.",
      ],
      language: "jsx",
      starter:
        "function Clock() {\n  const [now, setNow] = useState(new Date());\n  // your code\n  return <p>{now.toLocaleTimeString()}</p>;\n}",
      solution:
        "function Clock() {\n  const [now, setNow] = useState(new Date());\n  useEffect(() => {\n    const id = setInterval(() => setNow(new Date()), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <p>{now.toLocaleTimeString()}</p>;\n}",
      hints: ["The interval id is needed to clear it."],
      checklist: [
        "The interval is cleared on removal",
        "The dependency list is empty because nothing from the component is used",
        "StrictMode does not create two running timers",
      ],
    },
  ],
  revisionNotes: [
    "Effects run after the render to synchronise with something outside React",
    "The dependency list describes what the effect reads; list every reactive value",
    "Return a clean-up for subscriptions, timers and requests",
    "Calculate in render, react to clicks in handlers, reset with keys",
  ],
  resources: [
    {
      label: "React: useEffect",
      url: "https://react.dev/reference/react/useEffect",
    },
    {
      label: "React: Synchronizing with Effects",
      url: "https://react.dev/learn/synchronizing-with-effects",
    },
    {
      label: "React: You Might Not Need an Effect",
      url: "https://react.dev/learn/you-might-not-need-an-effect",
    },
  ],
})
