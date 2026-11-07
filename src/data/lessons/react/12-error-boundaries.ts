import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "error-boundaries",
  title: "Error handling: error boundaries and failed requests",
  topic: "Error handling",
  minutes: 30,
  overview:
    "Catch rendering errors with error boundaries, handle errors in events and requests, and show useful messages.",
  objectives: [
    "Explain what an error boundary catches and what it does not",
    "Handle errors in event handlers and async code with try/catch and state",
    "Show a helpful fallback and let the user recover",
  ],
  prerequisites: ["lesson.react.state"],
  sections: [
    {
      kind: "explain",
      heading: "Errors while rendering",
      body: [
        "If a component throws an error **while rendering**, React removes the whole tree from the screen, which would leave a blank page. An **error boundary** is a component that catches errors thrown by the components below it, and shows a **fallback** UI instead. You place boundaries around parts of the page, so that one broken widget does not take down everything else.",
        "A boundary is currently written as a **class component** with `static getDerivedStateFromError(error)`, which sets a flag in state, and an optional `componentDidCatch(error, info)`, where you log the error. Libraries provide ready-made boundary components, so most projects do not write the class themselves.",
        "A boundary catches errors during **rendering**, in lifecycle methods and in the constructors of the components below it. It **does not** catch errors in event handlers, in asynchronous code such as `setTimeout` and `fetch`, or in server-side rendering.",
      ],
    },
    {
      kind: "code",
      heading: "A simple boundary",
      example: {
        title: "Fallback and reset",
        language: "jsx",
        code: "import { Component } from 'react';\n\nclass ErrorBoundary extends Component {\n  state = { error: null };\n\n  static getDerivedStateFromError(error) {\n    return { error };\n  }\n  componentDidCatch(error, info) {\n    console.error('Caught', error, info.componentStack);\n  }\n  reset = () => this.setState({ error: null });\n\n  render() {\n    if (this.state.error) {\n      return (\n        <div role=\"alert\">\n          <p>Something went wrong in this section.</p>\n          <button onClick={this.reset}>Try again</button>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}\n\n// usage\n// <ErrorBoundary><Chart data={data} /></ErrorBoundary>",
        walkthrough: [
          "`getDerivedStateFromError` stores the error, and the next render shows the fallback.",
          "`componentDidCatch` is the place to log the error with the component stack.",
          "The reset button clears the error so that the children are rendered again.",
          "Only the section inside the boundary is replaced. The rest of the page keeps working.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Errors in events and requests",
      body: [
        "Because boundaries do not catch event handler or async errors, handle them yourself. Wrap the code in `try/catch` and put the result in **state**: an `error` value that the component shows. A common set of states for a request is `loading`, `error` and `data`.",
        "Check `response.ok` after `fetch`, because an HTTP error does not throw. Show a clear message and a way to try again. Log technical details for yourself, and show the user something they can understand, without internal messages or stack traces.",
        "If you really need an error from an async task to reach a boundary, you can catch it and throw it again during rendering by saving it in state and throwing it in the component body.",
      ],
    },
    {
      kind: "code",
      heading: "A request with an error state",
      example: {
        title: "try/catch and state",
        language: "jsx",
        code: "function UserCard({ id }) {\n  const [state, setState] = useState({ status: 'loading' });\n\n  useEffect(() => {\n    let ignore = false;\n    async function load() {\n      try {\n        const response = await fetch('/api/users/' + id);\n        if (!response.ok) throw new Error('HTTP ' + response.status);\n        const user = await response.json();\n        if (!ignore) setState({ status: 'ok', user });\n      } catch (error) {\n        if (!ignore) setState({ status: 'error' });\n      }\n    }\n    load();\n    return () => {\n      ignore = true;\n    };\n  }, [id]);\n\n  if (state.status === 'loading') return <p>Loading...</p>;\n  if (state.status === 'error') return <p role=\"alert\">Could not load the user.</p>;\n  return <h2>{state.user.name}</h2>;\n}",
        walkthrough: [
          "The state has three clear cases: loading, ok and error.",
          "`response.ok` is checked, because `fetch` does not reject for a 404 or 500.",
          "`ignore` stops an old request from changing the state after the component moved on.",
          'The error message is friendly and uses `role="alert"` so that assistive technology announces it.',
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Expecting an error boundary to catch an error in an `onClick` handler.",
          fix: "Use `try/catch` in the handler, and keep the error in state.",
        },
        {
          mistake: "Showing `error.message` to users.",
          fix: "Show a friendly message, and log the details.",
        },
        {
          mistake: "Wrapping the whole app in one boundary only.",
          fix: "Add boundaries around independent sections, so that a failure stays local.",
        },
        {
          mistake: "Ignoring `response.ok`.",
          fix: "Check it, and treat HTTP errors as errors.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A dashboard with widgets",
      scenario:
        "A dashboard has six widgets that load their own data, and one widget has a bug.",
      body: [
        "Wrap each widget in an error boundary with a fallback and a retry button. A broken chart shows a message in its own card, and the other five widgets keep working.",
        "Log every caught error with the component stack, so the team can find and fix the cause.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "boundary-catches",
      prompt: "What does an error boundary catch?",
      options: [
        "Errors thrown while rendering the components below it",
        "Errors in onClick handlers",
        "Errors in setTimeout callbacks",
      ],
      answer: 0,
      explanation:
        "Boundaries cover rendering, not event handlers or asynchronous code.",
    },
    {
      type: "truefalse",
      id: "fetch-reject",
      statement:
        "`fetch` rejects its promise when the server answers with a 500 status.",
      answer: false,
      explanation: "It rejects only for network failures. Check `response.ok`.",
    },
    {
      type: "blank",
      id: "boundary-method",
      prompt:
        "An error boundary class uses a static method called `getDerivedState___` to switch to the fallback.",
      answer: "FromError",
      explanation:
        "The full name is `getDerivedStateFromError`, and it returns the new state.",
    },
    {
      type: "single",
      id: "handler-errors",
      prompt: "Where should an error in a click handler be handled?",
      options: [
        "With try/catch in the handler, saving the result in state",
        "In an error boundary",
        "It is handled automatically",
      ],
      answer: 0,
      explanation:
        "Boundaries do not see event handler errors, so handle them in the handler.",
    },
  ],
  assignment: {
    title: "Make a widget fail safely",
    task: [
      "Add an error boundary around a widget that throws on purpose, with a retry button.",
      "Add a request with loading, error and data states, and log caught errors.",
    ],
    checklist: [
      "Other widgets keep working when one fails",
      "HTTP errors are treated as errors",
      "Users see friendly messages, not stack traces",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "request-state",
      title: "Model request states",
      task: [
        "Write `reduceRequest(state, action)` as a reducer for the states `loading`, `ok` and `error`. The actions are `{ type: 'start' }`, `{ type: 'done', data }` and `{ type: 'fail', message }`.",
      ],
      language: "jsx",
      starter: "function reduceRequest(state, action) {\n  // your code\n}",
      solution:
        "function reduceRequest(state, action) {\n  switch (action.type) {\n    case 'start':\n      return { status: 'loading' };\n    case 'done':\n      return { status: 'ok', data: action.data };\n    case 'fail':\n      return { status: 'error', message: action.message };\n    default:\n      return state;\n  }\n}",
      hints: [
        "Return a new object for each case, and the same state for unknown actions.",
      ],
      checklist: [
        "Each action gives one clear status",
        "Unknown actions return the old state",
        "Nothing is changed in place",
      ],
    },
  ],
  revisionNotes: [
    "Error boundaries catch rendering errors below them, with a fallback UI",
    "They do not catch errors in event handlers, async code or server rendering",
    "Handle async errors with try/catch and an error state; check `response.ok`",
    "Place boundaries around independent sections; log the error, show a friendly message",
  ],
  resources: [
    {
      label:
        "React: Component (catching rendering errors with an error boundary)",
      url: "https://react.dev/reference/react/Component",
    },
    {
      label: "React: You Might Not Need an Effect",
      url: "https://react.dev/learn/you-might-not-need-an-effect",
    },
  ],
})
