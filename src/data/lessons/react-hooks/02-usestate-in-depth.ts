import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react-hooks", {
  slug: "usestate-in-depth",
  title: "useState in depth",
  topic: "useState",
  minutes: 40,
  overview:
    "Go deeper into useState: lazy initial values, state that depends on props, resetting with keys and choosing the state shape.",
  objectives: [
    "Use lazy initialisation for expensive starting values",
    "Avoid copying props into state, and reset state with a key",
    "Choose a state shape that avoids duplication and impossible states",
  ],
  prerequisites: ["lesson.react-hooks.hooks-fundamentals"],
  sections: [
    {
      kind: "explain",
      heading: "Initial state and lazy initialisation",
      body: [
        "`useState(initial)` uses `initial` only on the **first render**. If you pass a function call, `useState(readFromStorage())`, the call runs on **every** render, and only the first result is used. To run the expensive work once, pass the **function itself**: `useState(() => readFromStorage())`. This is lazy initialisation.",
        "The setter can take a value or an updater function. React **bails out** without rendering the children if the new value is the same as the current one, compared with `Object.is`. So `setCount(count)` does nothing, and setting an object that you changed in place also looks like no change.",
        "A state value may be of any type, but each update must give a **new** value for objects and arrays, as the earlier lesson explained.",
      ],
    },
    {
      kind: "code",
      heading: "Lazy initial state",
      example: {
        title: "Reading storage once",
        language: "jsx",
        code: "function loadNotes() {\n  const text = localStorage.getItem('notes');\n  return text ? JSON.parse(text) : [];\n}\n\nfunction Notes() {\n  const [notes, setNotes] = useState(loadNotes);\n  const [draft, setDraft] = useState('');\n\n  function add() {\n    const next = [...notes, draft];\n    setNotes(next);\n    localStorage.setItem('notes', JSON.stringify(next));\n    setDraft('');\n  }\n  return <button onClick={add}>Add ({notes.length})</button>;\n}",
        walkthrough: [
          "`useState(loadNotes)` passes the function itself, so React calls it only for the first render.",
          "With `useState(loadNotes())`, the storage would be read and parsed on every render, and the result thrown away.",
          "The handler saves to storage when the user adds a note.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Do not copy props into state",
      body: [
        "A common mistake is `const [name, setName] = useState(props.name)`. The state is set **once**, and later changes to the prop are ignored, so the component shows old data. If the value comes from the parent, **use the prop**. Copy a prop into state only when you really want an initial value that the user will edit, and name the prop `initialName` to show it.",
        "To reset a component's state when an identity changes, give the component a **`key`**: `<Editor key={userId} />`. A new key creates a new instance with fresh state. This is cleaner than an effect that resets many state variables.",
        "Choose the state shape with care: group values that change together, avoid values that can be calculated from others, avoid duplicated data, and avoid combinations that make no sense, such as `isLoading` and `isError` both true. One `status` value with the cases `'loading'`, `'error'` and `'ok'` cannot be in two states at once.",
      ],
    },
    {
      kind: "code",
      heading: "A shape without impossible states",
      example: {
        title: "One status instead of flags",
        language: "jsx",
        code: "function Search() {\n  const [status, setStatus] = useState('idle');\n  const [results, setResults] = useState([]);\n\n  async function run(query) {\n    setStatus('loading');\n    try {\n      setResults(await fetchResults(query));\n      setStatus('ok');\n    } catch {\n      setStatus('error');\n    }\n  }\n  if (status === 'loading') return <p>Loading...</p>;\n  if (status === 'error') return <p>Failed</p>;\n  return <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>;\n}",
        walkthrough: [
          "`status` can only be one of four values, so a screen cannot show loading and an error at the same time.",
          "The results are kept separately and used when the status is `ok`.",
          "Adding a new case, such as `'empty'`, is a small change.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Passing `useState(expensive())`.",
          fix: "Pass a function: `useState(() => expensive())`.",
        },
        {
          mistake:
            "Copying a prop into state and expecting it to stay in sync.",
          fix: "Use the prop directly, or reset with a key.",
        },
        {
          mistake: "Several boolean flags that can contradict each other.",
          fix: "Use one status value.",
        },
        {
          mistake: "Duplicating the same data in two states.",
          fix: "Keep one source of truth, and calculate the rest.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An edit form",
      scenario:
        "A form edits a user. When the user selects another person in a list, the form must show that person.",
      body: [
        "Give the form `key={user.id}` and initialise its state from the user once. Switching person creates a fresh form. There is no effect that copies new props into state, and no stale data.",
        "The key expresses the idea: this is a different thing to edit.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "lazy-init",
      prompt: "Which call runs `loadNotes` only on the first render?",
      options: [
        "useState(loadNotes)",
        "useState(loadNotes())",
        "useState(() => loadNotes)",
      ],
      answer: 0,
      explanation:
        "Passing the function lets React call it once. `loadNotes()` runs every render. The arrow in the third option returns the function, not its result.",
    },
    {
      type: "truefalse",
      id: "prop-sync",
      statement:
        "`useState(props.value)` keeps the state in sync when `props.value` changes.",
      answer: false,
      explanation:
        "The prop is only the initial value. Later changes are ignored.",
    },
    {
      type: "single",
      id: "status-flag",
      prompt:
        "Why is one `status` value often better than several boolean flags?",
      options: [
        "It prevents impossible combinations",
        "It is shorter to type",
        "It is faster",
      ],
      answer: 0,
      explanation:
        "Flags such as `isLoading` and `isError` can both be true. A single status cannot.",
    },
    {
      type: "blank",
      id: "reset-key",
      prompt:
        "To reset a component's state when an id changes, give it a different ___.",
      answer: "key",
      explanation:
        "A new key makes React create a new instance with fresh state.",
    },
  ],
  assignment: {
    title: "Refactor state",
    task: [
      "Take a component with three state variables for loading, error and data, and replace the flags with one status.",
      "Make the initial value lazy where it reads storage, and reset an edit form with a key.",
    ],
    checklist: [
      "No two flags can be true at once",
      "The storage is read once",
      "Switching the edited item resets the form",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "state-shape",
      title: "Choose the state shape",
      task: [
        "Write the `useState` lines for a quiz component that needs: the list of questions, the index of the current question, the answers given, and a finished flag. Say which of these should NOT be stored in state, and why, in a comment.",
      ],
      language: "jsx",
      starter: "function Quiz({ questions }) {\n  // your code\n}",
      solution:
        "function Quiz({ questions }) {\n  const [index, setIndex] = useState(0);\n  const [answers, setAnswers] = useState([]);\n  // questions come from props, so they are not state.\n  // finished is calculated: index >= questions.length. It is not stored.\n  const finished = index >= questions.length;\n  return finished ? <p>Done</p> : <p>{questions[index].text}</p>;\n}",
      hints: [
        "Values that can be calculated from props or other state should not be stored.",
      ],
      checklist: [
        "The questions are not copied into state",
        "finished is calculated",
        "I explained why in a comment",
      ],
    },
  ],
  revisionNotes: [
    "`useState(fn)` runs the function once; `useState(fn())` runs it every render",
    "Do not copy props into state; reset with a key",
    "One status value instead of several flags; avoid duplication",
    "The same value does not cause a render",
  ],
  resources: [
    {
      label: "React: useState",
      url: "https://react.dev/reference/react/useState",
    },
    {
      label: "React: Choosing the State Structure",
      url: "https://react.dev/learn/choosing-the-state-structure",
    },
  ],
})
