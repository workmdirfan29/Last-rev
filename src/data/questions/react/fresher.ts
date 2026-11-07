import { defineQuestions } from "../author"

const DOCS = { label: "React docs", url: "https://react.dev/learn" }

export default defineQuestions("react", "fresher", [
  {
    slug: "what-is-react",
    topic: "Fundamentals",
    difficulty: "easy",
    title:
      "What is React, and why would you use it instead of plain JavaScript?",
    keywords: ["react", "library", "declarative", "component", "ui"],
    interviewerIntent:
      "Checks that you understand the problem React solves, not just that you have used it. A good answer mentions declarative UI and components.",
    shortAnswer:
      "React is a JavaScript library for building user interfaces from reusable components. Instead of manually finding and updating DOM nodes, you describe what the UI should look like for the current state, and React updates the DOM efficiently when that state changes.",
    detailedAnswer: [
      "In plain JavaScript you write **imperative** code: find an element, change its text, add a class, remove a child. As an app grows, keeping the screen in sync with your data this way becomes error-prone.",
      "React is **declarative**. You describe the UI as a function of state — `UI = f(state)`. When state changes, React re-runs your component, compares the result with the previous one, and applies only the necessary DOM changes.",
      "UIs are built from **components**: small, reusable pieces that own their markup and logic. A page is a tree of components, which makes large interfaces easier to reason about, test and reuse.",
      "React is a *library*, not a full framework. It handles the view layer; routing, data fetching and state management are chosen separately (React Router, TanStack Query, Zustand, or a framework such as Next.js).",
    ],
    realWorldExample:
      "An e-commerce cart badge must show the right item count in the header, on the cart page and in a mini-cart. With React the count lives in one piece of state and every component that shows it re-renders automatically — no manual DOM updates to forget.",
    codeExamples: [
      {
        title: "Imperative vs declarative counter",
        language: "tsx",
        code: `// Imperative (plain JS)
let count = 0
const label = document.querySelector("#label")!
document.querySelector("#inc")!.addEventListener("click", () => {
  count++
  label.textContent = String(count) // you must remember to update the DOM
})

// Declarative (React)
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}`,
        walkthrough: [
          "In the plain JS version you own the DOM update: forgetting `label.textContent = ...` leaves the UI stale.",
          "In React you only describe the output for a given `count`.",
          "Calling `setCount` tells React the state changed; React re-renders and updates the DOM for you.",
        ],
      },
    ],
    commonMistakes: [
      "Calling React a 'framework' — it is a library; interviewers notice the distinction.",
      "Saying 'the Virtual DOM makes React fast' without explaining that the real benefit is declarative, predictable UI updates.",
    ],
    followUps: [
      {
        question: "What is the difference between a library and a framework?",
        hint: "Who controls the flow: you call a library; a framework calls you.",
      },
      { question: "What does 'declarative' mean here?" },
    ],
    answerTips: [
      "Start with the one-line definition, then contrast imperative vs declarative with a tiny example.",
      "Mention components early — it shows you think in React, not just use it.",
    ],
    keyPoints: [
      "UI is a function of state",
      "Components are the unit of reuse",
      "Declarative instead of imperative DOM manipulation",
      "React is a library for the view layer",
    ],
    revisionNotes: [
      "UI = f(state). Components. Declarative. Library not framework.",
    ],
    sourceRefs: [DOCS],
    estimatedMinutes: 3,
    relatedIds: ["react.fresher.what-is-jsx", "react.fresher.virtual-dom"],
  },
  {
    slug: "what-is-jsx",
    topic: "JSX",
    difficulty: "easy",
    title: "What is JSX? Is it required to use React?",
    keywords: ["jsx", "syntax", "babel", "createElement", "markup"],
    interviewerIntent:
      "Tests whether you know JSX is syntax sugar that compiles to JavaScript, rather than HTML living inside JS.",
    shortAnswer:
      "JSX is a syntax extension that lets you write markup-like code inside JavaScript. It is not HTML: a compiler (Babel, SWC or esbuild) turns each JSX element into a function call that creates a React element. JSX is optional, but practically every React project uses it because it is much more readable.",
    detailedAnswer: [
      'JSX looks like HTML, but it is JavaScript. `<h1 className="title">Hi</h1>` is compiled into a call that returns a plain object describing that element.',
      "Because it is JavaScript, you embed expressions with curly braces: `{user.name}`. You can use any expression there, but not statements such as `if` or `for`.",
      "A few differences from HTML follow from this: `className` instead of `class` (`class` is a reserved word), `htmlFor` instead of `for`, camelCase event handlers (`onClick`), and every component must return a **single root** element — use a fragment (`<>...</>`) if you do not want an extra DOM node.",
      "JSX also escapes embedded values by default, which protects against many XSS issues.",
    ],
    realWorldExample:
      "A product card component renders `<h2>{product.title}</h2>` and a price using `{formatPrice(product.price)}`. The markup and the logic that prepares its data live next to each other, so a change is made in one place.",
    codeExamples: [
      {
        title: "What JSX compiles to",
        language: "tsx",
        code: `// What you write
const el = <h1 className="title">Hello, {name}</h1>

// Roughly what the compiler produces (modern JSX transform)
const el2 = jsx("h1", { className: "title", children: ["Hello, ", name] })`,
        walkthrough: [
          "The JSX element becomes a function call; the tag name is the first argument.",
          "Attributes become a props object; the content becomes `children`.",
          "The result is a plain JavaScript object that React reads to decide what to render.",
        ],
      },
    ],
    commonMistakes: [
      "Saying JSX is HTML or that the browser understands it — it must be compiled.",
      "Writing `class=` or `for=` instead of `className` / `htmlFor`.",
      "Putting statements like `if` inside `{}` — use a ternary or `&&`, or compute the value beforehand.",
    ],
    followUps: [
      {
        question: "Why must a component return a single root element?",
        hint: "A function can only return one value; a fragment avoids extra DOM nodes.",
      },
      {
        question: "How does JSX prevent XSS?",
        hint: "Values are escaped before being rendered; `dangerouslySetInnerHTML` opts out.",
      },
    ],
    answerTips: [
      "Say 'syntax extension that compiles to JavaScript' — that single sentence separates strong answers from weak ones.",
    ],
    keyPoints: [
      "Compiles to function calls",
      "Expressions in {}",
      "className / htmlFor",
      "Single root or fragment",
      "Escapes values by default",
    ],
    revisionNotes: [
      "JSX = JS in disguise. {} for expressions. className. Single root.",
    ],
    sourceRefs: [
      {
        label: "Writing markup with JSX",
        url: "https://react.dev/learn/writing-markup-with-jsx",
      },
    ],
    estimatedMinutes: 3,
    relatedIds: ["react.fresher.what-is-react"],
  },
  {
    slug: "props-vs-state",
    topic: "Components",
    subtopic: "Props & state",
    difficulty: "easy",
    title: "What is the difference between props and state?",
    keywords: ["props", "state", "immutable", "data flow", "useState"],
    interviewerIntent:
      "A core React question. It checks whether you understand data ownership and one-way data flow.",
    shortAnswer:
      "Props are inputs passed from a parent to a child and are read-only for the child. State is data a component owns and manages itself, which can change over time and triggers a re-render when it does. Props flow down; to change them, the parent updates its own state.",
    detailedAnswer: [
      "**Props** are like function arguments. A component receives them, uses them to render, and must never modify them. This is what makes components predictable and reusable.",
      "**State** is a component's memory. It is created with `useState`, updated through the setter, and each update schedules a re-render with the new value.",
      "Data flows **one way**: down the tree via props. A child cannot change a prop; instead, the parent passes a callback prop (e.g. `onSelect`) that the child calls, and the parent updates its own state.",
      "A useful rule: if a value can be computed from existing props or state, it should not be state at all — derive it during render.",
    ],
    realWorldExample:
      "A `SearchPage` owns the `query` state. It passes `query` and `onChange` as props to a `SearchBox` child. Typing in the box calls `onChange`, the page updates its state, and the new `query` flows back down as a prop.",
    codeExamples: [
      {
        title: "State in the parent, props in the child",
        language: "tsx",
        code: `function Parent() {
  const [count, setCount] = useState(0) // state: owned here
  return <Counter value={count} onIncrement={() => setCount(count + 1)} />
}

function Counter({ value, onIncrement }: { value: number; onIncrement: () => void }) {
  // value is a prop: read-only here
  return <button onClick={onIncrement}>Count: {value}</button>
}`,
        walkthrough: [
          "`count` is state — only `Parent` can change it, through `setCount`.",
          "`Counter` receives `value` and `onIncrement` as props.",
          "Clicking calls the parent's callback; the parent updates state and re-renders; `Counter` receives the new `value`.",
        ],
      },
    ],
    diagram: {
      kind: "table",
      title: "Props vs state at a glance",
      headers: ["", "Props", "State"],
      rows: [
        ["Owned by", "Parent component", "The component itself"],
        ["Mutable by the component?", "No (read-only)", "Yes, via the setter"],
        [
          "Triggers re-render",
          "When the parent re-renders with new values",
          "When the setter is called",
        ],
        [
          "Typical use",
          "Configuration, data, callbacks",
          "Input values, toggles, fetched data",
        ],
      ],
    },
    commonMistakes: [
      "Mutating a prop or a state object directly (`props.user.name = ...`, `state.items.push(...)`).",
      "Copying a prop into state ('derived state') so it goes out of sync when the prop changes.",
      "Saying 'state is mutable' — you replace it through the setter, you do not mutate it.",
    ],
    followUps: [
      {
        question: "Can a child component change its parent's state?",
        hint: "Not directly — via a callback prop passed down by the parent.",
      },
      {
        question: "What is 'prop drilling' and how do you avoid it?",
        hint: "Context, composition, or a state library.",
      },
    ],
    answerTips: [
      "Use the function-argument analogy for props and 'component memory' for state — both are easy to say aloud.",
    ],
    keyPoints: [
      "Props: inputs, read-only",
      "State: owned memory, triggers re-render",
      "One-way data flow",
      "Do not store derivable values in state",
    ],
    revisionNotes: [
      "Props down, callbacks up. Never mutate. Derive instead of duplicating.",
    ],
    sourceRefs: [
      {
        label: "State: a component's memory",
        url: "https://react.dev/learn/state-a-components-memory",
      },
    ],
    estimatedMinutes: 4,
    relatedIds: ["react.fresher.lifting-state-up"],
  },
  {
    slug: "virtual-dom",
    topic: "Rendering",
    difficulty: "medium",
    title: "What is the Virtual DOM and how does reconciliation work?",
    keywords: [
      "virtual dom",
      "reconciliation",
      "diffing",
      "fiber",
      "rendering",
    ],
    interviewerIntent:
      "Checks whether you can explain React's update model accurately and avoid the common myth that the Virtual DOM is always faster than the DOM.",
    shortAnswer:
      "When state changes, React re-runs the component to produce a new tree of lightweight element objects — the 'virtual DOM'. It compares the new tree with the previous one (reconciliation), works out the minimal set of changes, and applies only those to the real DOM.",
    detailedAnswer: [
      "The Virtual DOM is not a separate technology — it is just the tree of plain objects (React elements) your components return. Creating them is cheap compared with touching the real DOM.",
      "On an update, React builds the new tree and **diffs** it against the old one. It uses two heuristics to stay fast: elements of **different types** produce different trees (it tears down and rebuilds), and **keys** identify which items in a list are the same between renders.",
      "After diffing, React commits the minimal DOM operations in one batch. This is why you should rarely touch the DOM yourself.",
      "Be precise in interviews: the Virtual DOM does not make React magically faster than hand-written DOM code. Its value is that you can write simple declarative code and still get reasonable update performance.",
    ],
    realWorldExample:
      "Typing in a search box changes one piece of state. React re-renders the results component, diffs the list, and updates only the rows that changed instead of rebuilding the whole list.",
    diagram: {
      kind: "flow",
      title: "Update flow",
      steps: [
        { label: "State changes", detail: "setState / setter is called" },
        {
          label: "Render",
          detail: "Component runs, returns a new element tree",
        },
        {
          label: "Reconcile",
          detail: "New tree diffed against the previous tree",
        },
        { label: "Commit", detail: "Minimal changes applied to the real DOM" },
      ],
    },
    commonMistakes: [
      "Claiming the Virtual DOM is always faster than the real DOM.",
      "Confusing 'render' (running the component) with 'commit' (updating the DOM) — a render does not always change the DOM.",
    ],
    followUps: [
      {
        question: "Why are keys important in lists?",
        hint: "They let the diff match items across renders.",
      },
      {
        question: "What triggers a re-render?",
        hint: "State change, parent re-render, context change.",
      },
      {
        question: "What is React Fiber?",
        hint: "The reconciliation engine since React 16 that makes rendering interruptible.",
      },
    ],
    answerTips: [
      "Use the three words render → reconcile → commit, and say clearly that the Virtual DOM is just objects.",
    ],
    keyPoints: [
      "Virtual DOM = tree of element objects",
      "Diffing finds minimal changes",
      "Types and keys guide the diff",
      "Render is not the same as commit",
    ],
    revisionNotes: ["Render → reconcile → commit. Keys + types guide diffing."],
    sourceRefs: [
      {
        label: "Render and commit",
        url: "https://react.dev/learn/render-and-commit",
      },
    ],
    estimatedMinutes: 5,
    relatedIds: ["react.fresher.keys-in-lists"],
  },
  {
    slug: "keys-in-lists",
    topic: "Lists",
    difficulty: "easy",
    title: "Why do we need keys when rendering lists in React?",
    keywords: ["key", "list", "map", "reconciliation", "index"],
    interviewerIntent:
      "A classic. It checks that you understand how React identifies list items and why using the array index can cause real bugs.",
    shortAnswer:
      "Keys give each list item a stable identity so React can tell which items were added, removed or reordered between renders. Without stable keys React may reuse the wrong component instance, which causes wrong UI state and wasted work. Use a unique id from your data — avoid the array index when the list can change.",
    detailedAnswer: [
      "When you render `items.map(...)`, React needs to match each new element with the previous one. The `key` is how it does that — it must be **unique among siblings** and **stable across renders**.",
      "With an index as key, inserting an item at the top shifts every index. React then thinks item 0 is still 'the same' component and reuses its state — so a text input inside a row can keep the old row's typed text.",
      "Keys are not passed to the component as a prop; they exist only for React. Never generate a key with `Math.random()` during render — it changes every time and forces React to destroy and recreate every item.",
      "Index keys are acceptable only for static lists that are never reordered, filtered or inserted into.",
    ],
    realWorldExample:
      "A todo list where each row has an editable input. If rows use index keys and the user deletes the first todo, the remaining inputs can show the wrong text because React reused instances by position.",
    codeExamples: [
      {
        title: "Stable keys",
        language: "tsx",
        code: `// Good: stable, unique id from the data
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}

// Risky: index changes when the list changes
{todos.map((todo, i) => (
  <TodoItem key={i} todo={todo} />
))}`,
        walkthrough: [
          "`todo.id` stays with the same todo no matter where it moves in the array.",
          "`i` stays with a position, so after a delete or reorder the key points at a different todo.",
          "React uses the key to decide whether to reuse or recreate each `TodoItem`.",
        ],
      },
    ],
    commonMistakes: [
      "Using the index as the key for dynamic lists.",
      "Using `Math.random()` or `crypto.randomUUID()` inside render.",
      "Putting the key on the wrong element — it belongs on the outermost element returned from `map`.",
    ],
    followUps: [
      {
        question: "Is it ever fine to use the index as a key?",
        hint: "Static lists that never reorder, filter or insert.",
      },
      {
        question: "Can you use a key to reset a component's state?",
        hint: "Yes — changing the key remounts the component.",
      },
    ],
    answerTips: [
      "Give the concrete bug (wrong input text after a delete) — it proves you have seen it, not just read about it.",
    ],
    keyPoints: [
      "Unique among siblings",
      "Stable across renders",
      "Index is risky for dynamic lists",
      "Never random during render",
    ],
    revisionNotes: ["key = identity. Stable id, not index, not random."],
    sourceRefs: [
      {
        label: "Rendering lists",
        url: "https://react.dev/learn/rendering-lists",
      },
    ],
    estimatedMinutes: 4,
    relatedIds: ["react.fresher.virtual-dom"],
  },
  {
    slug: "controlled-vs-uncontrolled",
    topic: "Forms",
    difficulty: "medium",
    title:
      "What is the difference between controlled and uncontrolled components?",
    keywords: [
      "controlled",
      "uncontrolled",
      "form",
      "input",
      "ref",
      "onChange",
    ],
    interviewerIntent:
      "Tests your understanding of form handling and where the source of truth for input values lives.",
    shortAnswer:
      "In a controlled component, React state is the single source of truth: the input's `value` comes from state and `onChange` updates it. In an uncontrolled component the DOM keeps the value and you read it when needed, usually through a ref or on form submit. Controlled is the default for most forms because it enables validation and instant feedback.",
    detailedAnswer: [
      "**Controlled:** `<input value={name} onChange={e => setName(e.target.value)} />`. Every keystroke goes through React, so you can validate, format or disable a submit button immediately.",
      "**Uncontrolled:** the browser manages the input. You provide an initial value with `defaultValue` and read the current value with a ref or from `FormData` on submit. It needs less code and fewer re-renders.",
      "Controlled inputs re-render on each keystroke, which is fine for most forms. For very large forms, libraries like React Hook Form use uncontrolled inputs internally to avoid re-rendering the whole form.",
      'File inputs (`<input type="file">`) are always uncontrolled, because their value is read-only for security reasons.',
    ],
    realWorldExample:
      "A signup form that disables the Submit button until the email is valid needs controlled inputs. A simple newsletter field that is only read when the form is submitted can be uncontrolled.",
    codeExamples: [
      {
        title: "Controlled vs uncontrolled",
        language: "tsx",
        code: `// Controlled
function Controlled() {
  const [name, setName] = useState("")
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

// Uncontrolled
function Uncontrolled() {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <form onSubmit={(e) => { e.preventDefault(); alert(ref.current?.value) }}>
      <input ref={ref} defaultValue="" />
      <button>Save</button>
    </form>
  )
}`,
        walkthrough: [
          "The controlled input shows whatever is in `name`; typing calls `setName`, which re-renders with the new value.",
          "The uncontrolled input holds its own value; `defaultValue` only sets the initial value.",
          "On submit we read the value from the DOM node through the ref.",
        ],
      },
    ],
    commonMistakes: [
      "Setting `value` without `onChange`, which makes the input read-only and triggers a React warning.",
      "Switching an input between controlled and uncontrolled (e.g. `value={undefined}` then a string).",
      "Using `value` when you meant `defaultValue` for an uncontrolled input.",
    ],
    followUps: [
      {
        question:
          "Why does React warn when an input changes from uncontrolled to controlled?",
      },
      {
        question:
          "How do form libraries like React Hook Form reduce re-renders?",
        hint: "They register uncontrolled inputs and read values via refs.",
      },
    ],
    answerTips: [
      "Frame it as 'who is the source of truth — React state or the DOM?'",
    ],
    keyPoints: [
      "Controlled: state is the source of truth",
      "Uncontrolled: DOM is the source of truth",
      "defaultValue vs value",
      "File inputs are always uncontrolled",
    ],
    revisionNotes: [
      "Controlled = value + onChange. Uncontrolled = ref + defaultValue.",
    ],
    sourceRefs: [
      {
        label: "<input> reference",
        url: "https://react.dev/reference/react-dom/components/input",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "lifting-state-up",
    topic: "State",
    difficulty: "medium",
    title: "What does 'lifting state up' mean and when should you do it?",
    keywords: [
      "lifting state",
      "shared state",
      "parent",
      "callback",
      "data flow",
    ],
    interviewerIntent:
      "Shows whether you can design where state should live when two components need the same data.",
    shortAnswer:
      "Lifting state up means moving state from a child to the closest common parent of the components that need it, then passing the value down as props and changes up through callbacks. It keeps a single source of truth so siblings stay in sync.",
    detailedAnswer: [
      "If two sibling components must reflect the same data, neither can own it — they cannot read each other's state. The fix is to move the state to their **closest common ancestor**.",
      "The parent passes the value down as props and passes a setter or handler down so children can request changes.",
      "Do not lift higher than necessary: the further state lives from where it is used, the more components re-render and the more props you pass through. If many levels are involved, consider context or composition.",
    ],
    realWorldExample:
      "A product list and a 'filters' sidebar both depend on the selected category. The `ProductsPage` holds `category` state and passes it to the sidebar (to highlight the choice) and to the list (to filter).",
    codeExamples: [
      {
        title: "Shared selection",
        language: "tsx",
        code: `function ProductsPage() {
  const [category, setCategory] = useState("all")
  return (
    <>
      <Filters selected={category} onSelect={setCategory} />
      <ProductList category={category} />
    </>
  )
}`,
        walkthrough: [
          "`category` lives in the common parent, `ProductsPage`.",
          "`Filters` reads it and requests changes via `onSelect`.",
          "`ProductList` reads the same value, so both stay in sync automatically.",
        ],
      },
    ],
    commonMistakes: [
      "Duplicating the same value in two components' state.",
      "Lifting state to the app root when only two nearby components need it.",
    ],
    followUps: [
      {
        question: "What if the common parent is five levels up?",
        hint: "Context, composition (children), or a state library.",
      },
    ],
    answerTips: ["Name the 'closest common ancestor' explicitly."],
    keyPoints: [
      "Single source of truth",
      "Closest common ancestor",
      "Props down, callbacks up",
      "Do not lift higher than needed",
    ],
    revisionNotes: ["Shared state → move to nearest common parent."],
    sourceRefs: [
      {
        label: "Sharing state between components",
        url: "https://react.dev/learn/sharing-state-between-components",
      },
    ],
    estimatedMinutes: 3,
    relatedIds: ["react.fresher.props-vs-state"],
  },
  {
    slug: "conditional-rendering",
    topic: "Rendering",
    difficulty: "easy",
    title:
      "How do you conditionally render content in React? What are the pitfalls of using &&?",
    keywords: [
      "conditional rendering",
      "ternary",
      "&&",
      "short-circuit",
      "null",
    ],
    interviewerIntent:
      "Checks everyday fluency and awareness of the classic `0` rendering bug with `&&`.",
    shortAnswer:
      "Use ordinary JavaScript: an `if` that returns early, a ternary for either/or, or `&&` for show-or-nothing. Returning `null` renders nothing. The pitfall with `&&` is that a falsy number like `0` is rendered as '0', so convert to a boolean first.",
    detailedAnswer: [
      "JSX is just JavaScript, so there is no special directive like `v-if`. Choose the construct that reads best: early `return null`, ternary `cond ? <A /> : <B />`, or `cond && <A />`.",
      "`false`, `null` and `undefined` render nothing. But `0` and `NaN` are valid values and **are rendered**. So `items.length && <List />` prints `0` when the array is empty.",
      "Fix it with an explicit boolean: `items.length > 0 && <List />`, or use a ternary.",
      "For complex branching, extract the logic into a variable or a small component rather than nesting ternaries inside JSX.",
    ],
    realWorldExample:
      "A notifications badge written as `{count && <Badge count={count} />}` shows a stray '0' when there are no notifications.",
    codeExamples: [
      {
        title: "The && pitfall",
        language: "tsx",
        code: `// Bug: renders "0" when count is 0
{count && <Badge count={count} />}

// Fix
{count > 0 && <Badge count={count} />}
{count ? <Badge count={count} /> : null}`,
        walkthrough: [
          "`0 && x` evaluates to `0`, and React renders the number 0.",
          "`count > 0` is a real boolean, so `false` is returned and nothing renders.",
          "A ternary makes the empty case explicit.",
        ],
      },
    ],
    commonMistakes: [
      "Using `&&` with a number or string that can be 0 or empty.",
      "Deeply nesting ternaries inside JSX.",
    ],
    followUps: [
      {
        question: "What does a component that returns null do?",
        hint: "It renders nothing but its hooks still run.",
      },
    ],
    answerTips: ["Mention the '0' bug unprompted — interviewers love it."],
    keyPoints: [
      "JSX uses plain JS for conditions",
      "null/false/undefined render nothing",
      "0 and NaN do render",
      "Extract complex branches",
    ],
    revisionNotes: ["&& with numbers → renders 0. Use > 0 or a ternary."],
    sourceRefs: [
      {
        label: "Conditional rendering",
        url: "https://react.dev/learn/conditional-rendering",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "functional-vs-class-components",
    topic: "Components",
    difficulty: "easy",
    title:
      "What is the difference between functional and class components in React?",
    keywords: [
      "functional component",
      "class component",
      "hooks",
      "this",
      "lifecycle",
      "error boundary",
    ],
    interviewerIntent:
      "Checks that you know modern React is written with function components and why classes still appear.",
    shortAnswer:
      "A functional component is a plain function that takes props and returns JSX. Since hooks arrived, it can hold state and run effects too. A class component extends `React.Component`, keeps state in `this.state` and uses lifecycle methods like `componentDidMount`. New code uses function components. Class components still work, and error boundaries are still written as classes.",
    detailedAnswer: [
      "Function components are shorter, avoid the confusion around `this`, and let you share logic with custom hooks.",
      "Class components use `render()`, `this.props`, `this.setState` and lifecycle methods.",
      "React has not removed class components, so you will meet them in older code bases.",
      "Both kinds produce the same kind of output and can be used together in one tree.",
    ],
    realWorldExample:
      "A team migrating an older code base converts class components to functions when they touch them, but keeps one class-based error boundary because React offers no function-based version.",
    codeExamples: [
      {
        title: "The same component twice",
        language: "jsx",
        code: `function Hello({ name }) {
  return <h1>Hello, {name}</h1>
}

class HelloClass extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}`,
        walkthrough: [
          "The function receives props as an argument and returns JSX.",
          "The class reads the same props from `this.props`.",
          "Both render the same heading.",
        ],
      },
    ],
    commonMistakes: [
      "Saying function components cannot have state.",
      "Saying class components are removed from React.",
    ],
    followUps: [
      {
        question: "Which feature still needs a class component?",
        hint: "Error boundaries.",
      },
    ],
    answerTips: [
      "Say that you write function components and can still read class code.",
    ],
    keyPoints: [
      "Functions plus hooks are the standard",
      "Classes use this and lifecycle methods",
      "Both are still supported",
      "Error boundaries are classes",
    ],
    revisionNotes: ["Function plus hooks for new code."],
    sourceRefs: [
      {
        label: "React docs: Your first component",
        url: "https://react.dev/learn/your-first-component",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "component-lifecycle",
    topic: "Components",
    difficulty: "medium",
    title:
      "What is the lifecycle of a React component? How do hooks map to it?",
    keywords: [
      "lifecycle",
      "mounting",
      "updating",
      "unmounting",
      "useEffect",
      "componentDidMount",
      "cleanup",
    ],
    interviewerIntent:
      "Checks that you can describe when code runs and clean up after it.",
    shortAnswer:
      "A component mounts when it first appears, updates when its props or state change, and unmounts when it is removed. Class components use `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`. Function components use `useEffect`: it runs after render, and the function it returns is the cleanup that runs before the next effect and on unmount.",
    detailedAnswer: [
      "Rendering itself must be pure. Side effects such as fetching data or subscribing belong in effects, not in the render body.",
      "`useEffect(fn, [])` with an empty dependency array runs once after the first render. A dependency list such as `[id]` runs again when `id` changes.",
      "The React documentation suggests thinking of effects as synchronising with something external, not as lifecycle events.",
      "Always clean up subscriptions, timers and listeners in the effect's returned function to avoid leaks.",
    ],
    realWorldExample:
      "A chat component subscribes to a socket in an effect when it mounts and unsubscribes in the cleanup, so leaving the screen stops the messages.",
    codeExamples: [
      {
        title: "Effect with cleanup",
        language: "jsx",
        code: `function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)   // runs on unmount
  }, [])

  return <p>{now.toLocaleTimeString()}</p>
}`,
        walkthrough: [
          "The effect starts a timer after the first render.",
          "The empty dependency array means it only runs on mount.",
          "The returned function clears the timer when the component unmounts.",
          "Without the cleanup the timer would keep running and update an unmounted component.",
        ],
      },
    ],
    commonMistakes: [
      "Fetching data directly in the render body.",
      "Forgetting the cleanup function.",
      "Leaving out dependencies the effect uses.",
    ],
    followUps: [
      {
        question: "What happens if you omit the dependency array?",
        hint: "The effect runs after every render.",
      },
    ],
    answerTips: [
      "Draw the three phases and map each to a class method and to useEffect.",
    ],
    keyPoints: [
      "Mount, update, unmount",
      "Effects run after render",
      "Return a cleanup function",
      "Dependencies control re-runs",
    ],
    revisionNotes: ["Mount, update, unmount. Clean up effects."],
    sourceRefs: [
      {
        label: "React docs: Lifecycle of reactive effects",
        url: "https://react.dev/learn/lifecycle-of-reactive-effects",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "children-and-composition",
    topic: "Composition",
    difficulty: "easy",
    title:
      "What is the children prop? What does composition over inheritance mean in React?",
    keywords: [
      "children",
      "composition",
      "inheritance",
      "slots",
      "reusable components",
    ],
    interviewerIntent:
      "Checks that you build reusable components by nesting rather than by extending classes.",
    shortAnswer:
      "`children` is a special prop that holds whatever you put between a component's opening and closing tags. It lets a component wrap arbitrary content, like a card or a modal. React favours composition, building complex UI by combining components, over inheritance, because passing props and children is enough for almost every reuse case.",
    detailedAnswer: [
      "A layout component renders `{children}` inside its own markup and does not need to know what the content is.",
      "You can also pass JSX through ordinary props, such as `header` and `footer`, to create several slots.",
      "Specialised components are made by rendering a general one with specific props, for example `ErrorAlert` renders `Alert` with a red style.",
      "React's guidance is to prefer composition, and inheritance is rarely needed for components.",
    ],
    realWorldExample:
      "A `Card` component renders a border and padding around its children. The product list, the profile page and the settings page all reuse it with different content.",
    codeExamples: [
      {
        title: "A wrapper using children",
        language: "jsx",
        code: `function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

<Card title="Profile">
  <p>Asha, Pune</p>
  <button>Edit</button>
</Card>`,
        walkthrough: [
          "`Card` draws the frame and the title.",
          "Everything between the tags arrives as `children`.",
          "`{children}` places that content inside the frame.",
          "Any content can be wrapped without changing `Card`.",
        ],
      },
    ],
    commonMistakes: [
      "Creating a class hierarchy of components.",
      "Copying a component instead of passing different children.",
    ],
    followUps: [
      {
        question:
          "How can you pass several different regions of JSX into one component?",
      },
    ],
    answerTips: [
      "Mention that children can be any JSX, text or even a function.",
    ],
    keyPoints: [
      "children = content between the tags",
      "Composition builds bigger UI from smaller parts",
      "Slots can be ordinary props",
      "Prefer composition to inheritance",
    ],
    revisionNotes: ["Wrap with children, do not inherit."],
    sourceRefs: [
      {
        label: "React docs: Passing props to a component (children)",
        url: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "props-drilling-and-context",
    topic: "Context",
    difficulty: "medium",
    title: "What is prop drilling? How does the Context API solve it?",
    keywords: [
      "prop drilling",
      "Context API",
      "createContext",
      "useContext",
      "Provider",
      "global state",
    ],
    interviewerIntent:
      "Checks that you can pass shared data through a tree and know the cost of Context.",
    shortAnswer:
      "Prop drilling is passing a prop through several layers of components that do not use it, only to reach a deep child. Context lets a parent provide a value with a Provider and any descendant read it with `useContext`, skipping the middle layers. Context is best for data like theme, locale or the current user. Every consumer re-renders when the value changes.",
    detailedAnswer: [
      "Create the context with `createContext(defaultValue)`, wrap the subtree in `<Context.Provider value={...}>` and read it with `useContext(Context)`.",
      "Before using Context, consider composition: pass the finished child element down as `children` so the middle layers do not need the data.",
      "Context is not a complete state management tool. Frequently changing values cause many re-renders, so split contexts or use a dedicated state library.",
      "Create the Provider value carefully. A new object on every render re-renders all consumers.",
    ],
    realWorldExample:
      "A `ThemeContext` provides the dark or light theme. Buttons, cards and the navbar read it directly, so the theme does not travel through every component as a prop.",
    codeExamples: [
      {
        title: "A small theme context",
        language: "jsx",
        code: `const ThemeContext = createContext("light")

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  )
}

function Button() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Save</button>
}`,
        walkthrough: [
          "`createContext` makes a context with a default value.",
          "The Provider supplies `dark` to everything inside it.",
          "`Button` reads the value directly, however deep it is nested.",
          "`Page` and the components between do not need a theme prop.",
        ],
      },
    ],
    commonMistakes: [
      "Putting everything into one big context.",
      "Creating a new object for the Provider value on every render.",
    ],
    followUps: [
      {
        question: "When would you choose Redux or Zustand instead of Context?",
      },
    ],
    answerTips: [
      "Mention composition as the first thing you try before Context.",
    ],
    keyPoints: [
      "Prop drilling passes props through unused layers",
      "Provider plus useContext skip the layers",
      "Consumers re-render when the value changes",
      "Try composition first",
    ],
    revisionNotes: ["Context skips the middle layers."],
    sourceRefs: [
      {
        label: "React docs: Passing data deeply with Context",
        url: "https://react.dev/learn/passing-data-deeply-with-context",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "react-fragments",
    topic: "JSX",
    difficulty: "easy",
    title: "What are React Fragments and why do we use them?",
    keywords: [
      "Fragment",
      "React.Fragment",
      "<></>",
      "root element",
      "extra div",
    ],
    interviewerIntent:
      "A small but common question. It checks whether you understand the single-root rule and clean markup.",
    shortAnswer:
      "A component must return one root element, but wrapping everything in an extra `div` adds needless DOM nodes and can break layouts such as tables and flex or grid containers. A Fragment groups several elements without adding a node to the DOM. Use the short syntax `<>...</>`, or `<Fragment key={id}>` when you need to give the group a key.",
    detailedAnswer: [
      "`<></>` is shorthand for `<React.Fragment></React.Fragment>`. The short form cannot take attributes.",
      "In a list, a Fragment needs a key when you map items that each render several elements, so use the long form `<Fragment key={item.id}>`.",
      "Fragments are especially useful in tables: a `tr` can contain `td` elements but not a stray `div`.",
    ],
    realWorldExample:
      "A table row component returns two `td` cells inside a Fragment so the table markup stays valid.",
    codeExamples: [
      {
        title: "Valid table cells with a Fragment",
        language: "jsx",
        code: `function Columns() {
  return (
    <>
      <td>Name</td>
      <td>Price</td>
    </>
  )
}

// <tr><Columns /></tr> -> <tr><td>Name</td><td>Price</td></tr>`,
        walkthrough: [
          "The component returns two sibling cells.",
          "The Fragment lets it have a single parent without adding an element.",
          "The rendered HTML contains only the `td` elements, so the table stays valid.",
        ],
      },
    ],
    commonMistakes: [
      "Wrapping in a div that breaks layout.",
      "Using the short syntax when a key is needed.",
    ],
    followUps: [{ question: "Why must a component return a single root?" }],
    answerTips: [
      "Use the table example, it shows a real problem a wrapper div causes.",
    ],
    keyPoints: [
      "Groups children without a DOM node",
      "<></> is the short syntax",
      "Use <Fragment key> in lists",
      "Keeps markup valid",
    ],
    revisionNotes: ["Fragment = invisible wrapper."],
    sourceRefs: [
      {
        label: "React docs: Fragment",
        url: "https://react.dev/reference/react/Fragment",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "jsx-vs-html-differences",
    topic: "JSX",
    difficulty: "easy",
    title: "What are the main differences between JSX and HTML?",
    keywords: [
      "JSX",
      "HTML",
      "className",
      "htmlFor",
      "camelCase",
      "self-closing",
      "style object",
    ],
    interviewerIntent:
      "Checks practical JSX knowledge that every React developer uses daily.",
    shortAnswer:
      "JSX looks like HTML but is JavaScript. Attributes use camelCase and some names differ: `className` instead of `class` and `htmlFor` instead of `for`. Every tag must be closed, including `<img />`. A component returns a single root element. The `style` attribute takes an object, and any JavaScript expression goes inside curly braces.",
    detailedAnswer: [
      "Event handlers are camelCase function props: `onClick={handleClick}`.",
      "`class` and `for` are reserved words in JavaScript, which is why JSX uses `className` and `htmlFor`.",
      'Inline styles use an object with camelCase keys: `style={{ backgroundColor: "red" }}`.',
      "Comments inside JSX are written `{/* comment */}`.",
      "Text is escaped by default, which protects against injecting HTML through expressions.",
    ],
    realWorldExample:
      "Copying markup from a static HTML mock-up into React often fails until `class` becomes `className`, `for` becomes `htmlFor` and unclosed `<br>` becomes `<br />`.",
    codeExamples: [
      {
        title: "HTML turned into JSX",
        language: "jsx",
        code: `// HTML:
// <label for="q" class="field">Search</label>
// <input id="q" style="margin-top:4px">

// JSX:
<>
  <label htmlFor="q" className="field">Search</label>
  <input id="q" style={{ marginTop: 4 }} />
</>`,
        walkthrough: [
          "`for` becomes `htmlFor` and `class` becomes `className`.",
          "The style string becomes an object with a camelCase key.",
          "The `input` tag is self-closed.",
        ],
      },
    ],
    commonMistakes: [
      "Using class instead of className.",
      "Passing a string to the style prop.",
    ],
    followUps: [
      {
        question: "How do you render raw HTML in React, and why is it risky?",
        hint: "dangerouslySetInnerHTML.",
      },
    ],
    answerTips: [
      "List four differences quickly: className, htmlFor, closed tags, style object.",
    ],
    keyPoints: [
      "className and htmlFor",
      "camelCase attributes",
      "All tags closed",
      "style takes an object",
    ],
    revisionNotes: ["JSX is JavaScript, not HTML."],
    sourceRefs: [
      {
        label: "React docs: Writing markup with JSX",
        url: "https://react.dev/learn/writing-markup-with-jsx",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "state-updates-and-batching",
    topic: "State",
    difficulty: "medium",
    title:
      "Why does calling setState three times in a row only add one? What is a functional update?",
    keywords: [
      "setState",
      "batching",
      "functional update",
      "snapshot",
      "stale state",
      "useState",
    ],
    interviewerIntent:
      "A classic trap that shows whether you understand state as a snapshot for each render.",
    shortAnswer:
      "State inside a render is a fixed snapshot. Calling `setCount(count + 1)` three times uses the same old `count` each time, so React batches them and the result is +1. The new value appears on the next render, not immediately after the call. Use a functional update, `setCount(c => c + 1)`, to base each change on the latest queued value and get +3.",
    detailedAnswer: [
      "React batches state updates inside event handlers, and since React 18 in most other places too, so it renders once after the handler finishes.",
      "Reading the state variable right after calling its setter still shows the old value for that render.",
      "An updater function receives the pending state and returns the next one, so several of them queue correctly.",
      "Use the functional form whenever the new value depends on the previous one.",
    ],
    realWorldExample:
      "A counter's button handler that tries to increment twice with `setCount(count + 1)` twice only adds one. Switching to `setCount(c => c + 1)` fixes it.",
    codeExamples: [
      {
        title: "Snapshot versus updater",
        language: "jsx",
        code: `function Counter() {
  const [count, setCount] = useState(0)

  function addThreeWrong() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)      // result: +1
  }
  function addThree() {
    setCount(c => c + 1)
    setCount(c => c + 1)
    setCount(c => c + 1)     // result: +3
  }
  return <button onClick={addThree}>{count}</button>
}`,
        walkthrough: [
          "In the first handler every call uses the same `count` from this render.",
          "All three updates ask for the same next value, so only one is added.",
          "The updater version receives the latest pending value each time.",
          "That queues three increments and the next render shows +3.",
        ],
      },
    ],
    commonMistakes: [
      "Reading the state right after calling the setter and expecting the new value.",
      "Using the current value when the update depends on the previous one.",
    ],
    followUps: [
      {
        question:
          "What does React do when you set the same value that the state already holds?",
      },
    ],
    answerTips: [
      "Use the word 'snapshot', it explains the whole behaviour in one idea.",
    ],
    keyPoints: [
      "State is a snapshot per render",
      "Updates are batched",
      "New value appears on the next render",
      "Use setX(prev => ...) for dependent updates",
    ],
    revisionNotes: ["Use the updater when it depends on the previous state."],
    sourceRefs: [
      {
        label: "React docs: State as a snapshot",
        url: "https://react.dev/learn/state-as-a-snapshot",
      },
      {
        label: "React docs: Queueing a series of state updates",
        url: "https://react.dev/learn/queueing-a-series-of-state-updates",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "immutable-state-updates",
    topic: "State",
    difficulty: "medium",
    title:
      "Why should you never mutate state directly in React? How do you update objects and arrays?",
    keywords: [
      "immutability",
      "mutate state",
      "spread operator",
      "map",
      "filter",
      "reference equality",
    ],
    interviewerIntent:
      "Checks that you know how React detects changes and can update nested state correctly.",
    shortAnswer:
      "React decides whether state changed by comparing references. If you mutate an object or array in place, the reference stays the same, so React may skip the re-render, and it also breaks features that rely on previous values. Instead create a new copy: use spread for objects, and `map`, `filter` and spread for arrays, then pass the new value to the setter.",
    detailedAnswer: [
      "To add: `[...items, newItem]`. To remove: `items.filter(i => i.id !== id)`. To change one: `items.map(i => i.id === id ? { ...i, done: true } : i)`.",
      'For nested objects copy every level you change: `{ ...user, address: { ...user.address, city: "Pune" } }`.',
      "Spread makes a shallow copy, so untouched nested objects are shared, which is fine as long as you do not mutate them.",
      "Libraries like Immer let you write mutating-looking code that produces immutable updates.",
    ],
    realWorldExample:
      "A todo list where `todos.push(newTodo); setTodos(todos)` does not update the screen, because the array reference did not change.",
    codeExamples: [
      {
        title: "Immutable updates",
        language: "jsx",
        code: `const [todos, setTodos] = useState([{ id: 1, text: "Learn", done: false }])

// add
setTodos([...todos, { id: 2, text: "Practise", done: false }])
// remove
setTodos(todos.filter(t => t.id !== 1))
// toggle
setTodos(todos.map(t => t.id === 1 ? { ...t, done: !t.done } : t))`,
        walkthrough: [
          "Spreading into a new array adds an item without changing the old array.",
          "`filter` returns a new array without the removed item.",
          "`map` returns a new array in which only the changed object is copied.",
          "Each setter receives a new reference, so React sees a change.",
        ],
      },
    ],
    commonMistakes: [
      "Using push, splice or direct assignment on state.",
      "Forgetting to copy a nested level.",
    ],
    followUps: [{ question: "Is spread a deep copy?" }],
    answerTips: ["Give the add, remove and update trio, it covers most cases."],
    keyPoints: [
      "Never mutate state",
      "React compares references",
      "Spread, map and filter create copies",
      "Copy each nested level you change",
    ],
    revisionNotes: ["New reference, new render."],
    sourceRefs: [
      {
        label: "React docs: Updating objects in state",
        url: "https://react.dev/learn/updating-objects-in-state",
      },
      {
        label: "React docs: Updating arrays in state",
        url: "https://react.dev/learn/updating-arrays-in-state",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "why-components-rerender",
    topic: "Rendering",
    difficulty: "medium",
    title: "When does a React component re-render?",
    keywords: [
      "re-render",
      "render",
      "commit",
      "state change",
      "parent render",
      "context",
    ],
    interviewerIntent:
      "Checks that you understand what triggers a render, which is the base of every performance discussion.",
    shortAnswer:
      "A component re-renders when its own state changes, when its parent re-renders, or when a context it reads changes. By default a parent's render re-renders all its children, even if their props did not change. A render only calculates what the UI should look like. React then updates the real DOM only where the result differs.",
    detailedAnswer: [
      "Rendering means calling your component function. It is cheap compared with DOM updates and does not always mean the screen changed.",
      "Changing a prop is not itself a trigger. The parent had to render to pass a new prop, and that render is what causes the child to render.",
      "`React.memo` lets a child skip rendering when its props are shallowly equal to the previous ones.",
      "Rendering must be pure: same props and state should produce the same output with no side effects.",
    ],
    realWorldExample:
      "Typing in a search box stored in the page component re-renders the whole page, including a heavy chart. Moving the input state into its own component stops the chart from re-rendering.",
    commonMistakes: [
      "Believing every re-render updates the DOM.",
      "Optimising before measuring.",
    ],
    followUps: [
      { question: "What is the difference between rendering and committing?" },
    ],
    answerTips: [
      "Name three triggers and then say that rendering is not the same as touching the DOM.",
    ],
    keyPoints: [
      "Own state change",
      "Parent re-render",
      "Context change",
      "Render is not a DOM update",
    ],
    revisionNotes: ["State, parent, context."],
    sourceRefs: [
      {
        label: "React docs: Render and commit",
        url: "https://react.dev/learn/render-and-commit",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "react-memo-basics",
    topic: "Performance",
    difficulty: "medium",
    title: "What is React.memo and when should you use it?",
    keywords: [
      "React.memo",
      "memoization",
      "shallow comparison",
      "performance",
      "re-render",
      "props",
    ],
    interviewerIntent:
      "Checks that you can optimise rendering with judgement instead of wrapping everything.",
    shortAnswer:
      "`React.memo` wraps a component so React skips re-rendering it when its props are shallowly equal to the previous props. It helps when a component renders often with the same props and its render is expensive. It does nothing if you pass a new object, array or function on every render. Measure first with the React Profiler before adding it.",
    detailedAnswer: [
      "Shallow comparison checks each prop with `Object.is`. A new `{}` or `() => {}` on each parent render fails that check.",
      "To keep props stable use `useMemo` for objects and `useCallback` for functions, but only when a memoized child depends on them.",
      "Memoization has its own cost: comparing props and keeping the previous result in memory.",
      "Often a better fix is to move state down or to pass `children`, so the expensive part is not re-rendered at all.",
    ],
    realWorldExample:
      "A large product table row is wrapped in `memo` so updating a filter in the parent does not re-render hundreds of unchanged rows.",
    codeExamples: [
      {
        title: "Memoized row",
        language: "jsx",
        code: `const Row = memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>
})

function List({ items }) {
  const handleSelect = useCallback((id) => console.log(id), [])
  return <ul>{items.map(i => <Row key={i.id} item={i} onSelect={handleSelect} />)}</ul>
}`,
        walkthrough: [
          "`memo` makes `Row` skip rendering when its props are the same.",
          "`handleSelect` is wrapped in `useCallback`, so the function reference stays stable.",
          "Without `useCallback` each render would create a new function and defeat `memo`.",
          "Unchanged rows are now skipped when the parent re-renders.",
        ],
      },
    ],
    commonMistakes: [
      "Wrapping every component in memo.",
      "Passing inline objects or functions to a memoized component.",
    ],
    followUps: [{ question: "How does useMemo differ from React.memo?" }],
    answerTips: ["Say 'measure first'. It signals engineering judgement."],
    keyPoints: [
      "Skips render when props are shallowly equal",
      "Breaks with unstable props",
      "Pair with useCallback or useMemo when needed",
      "Profile before optimising",
    ],
    revisionNotes: ["memo skips renders only with stable props."],
    sourceRefs: [
      {
        label: "React docs: memo",
        url: "https://react.dev/reference/react/memo",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "error-boundaries",
    topic: "Error handling",
    difficulty: "medium",
    title: "What is an error boundary in React? What errors does it not catch?",
    keywords: [
      "error boundary",
      "componentDidCatch",
      "getDerivedStateFromError",
      "fallback UI",
      "rendering errors",
    ],
    interviewerIntent:
      "Checks that you know how to stop one broken component from blanking the whole app.",
    shortAnswer:
      "An error boundary is a class component that catches errors thrown while rendering its child tree and shows a fallback UI instead of crashing the whole app. It defines `static getDerivedStateFromError` to switch to the fallback and `componentDidCatch` to log the error. It does not catch errors in event handlers, asynchronous code, server rendering, or in the boundary itself.",
    detailedAnswer: [
      "Without a boundary, an uncaught rendering error unmounts the whole React tree and leaves a blank screen.",
      "Place boundaries around independent parts of the page, such as a widget or a route, so a failure stays local.",
      "Errors in event handlers do not break rendering, so use ordinary `try/catch` there. The same goes for promises and timers.",
      "There is no hook version in React itself. Many projects use a small library that wraps the class.",
    ],
    realWorldExample:
      "A dashboard wraps each chart in an error boundary, so one chart with bad data shows 'Could not load this chart' while the rest of the dashboard keeps working.",
    codeExamples: [
      {
        title: "A basic error boundary",
        language: "jsx",
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.error(error, info.componentStack)
  }
  render() {
    return this.state.hasError ? <p>Something went wrong.</p> : this.props.children
  }
}

// <ErrorBoundary><Chart /></ErrorBoundary>`,
        walkthrough: [
          "`getDerivedStateFromError` updates the state when a child throws during rendering.",
          "`componentDidCatch` receives the error so you can log it.",
          "While `hasError` is true the fallback message replaces the broken subtree.",
          "Otherwise the boundary renders its children as normal.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting a boundary to catch errors in event handlers.",
      "Using one boundary for the whole app only.",
    ],
    followUps: [
      {
        question:
          "How do you handle errors in an async fetch inside a component?",
      },
    ],
    answerTips: ["List what it does not catch, it shows you know the limits."],
    keyPoints: [
      "Class with getDerivedStateFromError and componentDidCatch",
      "Shows a fallback UI",
      "Does not catch event handlers or async code",
      "Use several local boundaries",
    ],
    revisionNotes: ["Boundaries catch render errors only."],
    sourceRefs: [
      {
        label:
          "React docs: Component (catching rendering errors with an error boundary)",
        url: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "code-splitting-lazy-suspense",
    topic: "Performance",
    difficulty: "medium",
    title:
      "What is code splitting? How do React.lazy and Suspense work together?",
    keywords: [
      "code splitting",
      "React.lazy",
      "Suspense",
      "dynamic import",
      "bundle size",
      "fallback",
    ],
    interviewerIntent:
      "Checks that you can reduce the initial bundle and show a loading state while a chunk loads.",
    shortAnswer:
      "Code splitting divides the app bundle into smaller chunks that load on demand, so the first page loads faster. `React.lazy` takes a function that returns a dynamic `import()` and makes the component load only when it is first rendered. `Suspense` wraps it and shows a `fallback`, such as a spinner, until the chunk has loaded.",
    detailedAnswer: [
      "The usual split point is the route: each page becomes its own chunk.",
      "The lazy component's module must have a default export.",
      "A Suspense boundary can wrap several lazy components and show one fallback for all of them.",
      "Combine with an error boundary, because loading a chunk can fail, for example when the network drops.",
    ],
    realWorldExample:
      "An admin area with a heavy charting library is lazy loaded, so customers who never open the admin pages never download that code.",
    codeExamples: [
      {
        title: "Lazy loaded route component",
        language: "jsx",
        code: `import { lazy, Suspense } from "react"

const Reports = lazy(() => import("./Reports"))

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Reports />
    </Suspense>
  )
}`,
        walkthrough: [
          "`lazy` receives a function that performs a dynamic import.",
          "The `Reports` chunk is fetched the first time it is rendered.",
          "While it loads, `Suspense` shows the fallback.",
          "Once loaded, the component replaces the fallback.",
        ],
      },
    ],
    commonMistakes: [
      "Rendering a lazy component without a Suspense boundary.",
      "Forgetting a default export in the lazy module.",
    ],
    followUps: [
      {
        question: "Where would you place Suspense boundaries in a routed app?",
      },
    ],
    answerTips: [
      "Say 'split by route' first, it is the most practical answer.",
    ],
    keyPoints: [
      "Split the bundle, load on demand",
      "lazy plus dynamic import",
      "Suspense shows the fallback",
      "Handle load errors with a boundary",
    ],
    revisionNotes: ["lazy loads, Suspense waits."],
    sourceRefs: [
      {
        label: "React docs: lazy",
        url: "https://react.dev/reference/react/lazy",
      },
      {
        label: "React docs: Suspense",
        url: "https://react.dev/reference/react/Suspense",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "event-handling",
    topic: "Components",
    difficulty: "easy",
    title:
      "How do you handle events in React? What is the difference between onClick={handle} and onClick={handle()}?",
    keywords: [
      "event handling",
      "onClick",
      "preventDefault",
      "synthetic event",
      "arrow function",
      "callback",
    ],
    interviewerIntent:
      "A fundamental check that catches the classic mistake of calling the handler during render.",
    shortAnswer:
      "In React you pass a function to a camelCase event prop such as `onClick`. `onClick={handle}` passes the function so React calls it on click. `onClick={handle()}` calls it immediately during render and passes its return value, which is almost always a bug. To pass arguments, wrap the call: `onClick={() => remove(id)}`. The event object is a cross-browser wrapper.",
    detailedAnswer: [
      "Call `event.preventDefault()` to stop the default action such as a form submit reloading the page.",
      "Events bubble up through the React tree. `event.stopPropagation()` stops that.",
      "Define handlers inside the component so they can read the current props and state.",
      "Since React 17 events are attached to the root container, and the old event pooling no longer applies.",
    ],
    realWorldExample:
      "A delete button in a list uses `onClick={() => deleteItem(item.id)}` so each button removes its own row.",
    codeExamples: [
      {
        title: "Passing versus calling",
        language: "jsx",
        code: `function Buttons({ id, onDelete }) {
  function handleSave(event) {
    event.preventDefault()
    console.log("saved")
  }
  return (
    <form onSubmit={handleSave}>
      <button type="button" onClick={() => onDelete(id)}>Delete</button>
      <button type="submit">Save</button>
      {/* wrong: <button onClick={onDelete(id)}> runs during render */}
    </form>
  )
}`,
        walkthrough: [
          "`onSubmit` receives the function itself and React calls it on submit.",
          "`preventDefault` stops the browser from reloading the page.",
          "The arrow function delays the call and lets you pass `id`.",
          "The commented line shows the mistake of calling the function in the markup.",
        ],
      },
    ],
    commonMistakes: [
      "Calling the handler instead of passing it.",
      "Forgetting preventDefault on a form submit.",
    ],
    followUps: [
      {
        question:
          "Why might an inline arrow function matter for memoized children?",
      },
    ],
    answerTips: [
      "Show the two forms side by side, the difference is one pair of parentheses.",
    ],
    keyPoints: [
      "Pass the function, do not call it",
      "camelCase event names",
      "Wrap in an arrow to pass arguments",
      "preventDefault stops default behaviour",
    ],
    revisionNotes: ["Pass it, do not call it."],
    sourceRefs: [
      {
        label: "React docs: Responding to events",
        url: "https://react.dev/learn/responding-to-events",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "spa-and-client-side-routing",
    topic: "Single-page applications",
    difficulty: "medium",
    title:
      "What is a Single Page Application? How does client-side routing work?",
    keywords: [
      "SPA",
      "single page application",
      "client-side routing",
      "History API",
      "pushState",
      "React Router",
    ],
    interviewerIntent:
      "Checks that you understand how a React app navigates without full page reloads, and the trade-offs.",
    shortAnswer:
      "A single page application loads one HTML page and then updates the content with JavaScript instead of requesting a new page for every link. Client-side routing uses the History API to change the URL without a reload and renders the component that matches the new path. Libraries like React Router handle this. The server must return the same HTML for deep links.",
    detailedAnswer: [
      "Benefits: fast navigation after the first load, smooth transitions and the state can stay alive between views.",
      "Costs: the first load can be heavy unless you split code, and content that is rendered only on the client may need extra work to be indexed by search engines.",
      "Deep links like `/orders/42` must be served by the host with a fallback to `index.html`, otherwise a refresh returns a 404.",
      "Server rendering or static generation, offered by frameworks, can improve first load and discoverability.",
    ],
    realWorldExample:
      "Clicking 'Orders' in a dashboard changes the URL to `/orders` and swaps the content without reloading the sidebar, and pressing Back returns to the previous view.",
    codeExamples: [
      {
        title: "Routes in React Router",
        language: "jsx",
        code: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link> <Link to="/orders">Orders</Link></nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  )
}`,
        walkthrough: [
          "`BrowserRouter` listens to the browser URL using the History API.",
          "`Link` changes the URL without a full page load.",
          "`Routes` renders the element of the route that matches the current path.",
          "Back and forward buttons keep working because the router updates the history.",
        ],
      },
    ],
    commonMistakes: [
      "Using plain anchor tags, which reload the page.",
      "Forgetting the server fallback for deep links.",
    ],
    followUps: [
      {
        question:
          "How do you protect a route so that only logged-in users can open it?",
      },
    ],
    answerTips: [
      "Mention both the benefit (speed) and the cost (first load and deep-link hosting).",
    ],
    keyPoints: [
      "One HTML page, JavaScript updates the view",
      "History API changes the URL without reload",
      "Router maps paths to components",
      "Server needs an index.html fallback",
    ],
    revisionNotes: ["SPA = one page, many views."],
    sourceRefs: [
      {
        label: "MDN: SPA (glossary)",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/SPA",
      },
      {
        label: "MDN: History API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/History_API",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "thinking-in-react-structure",
    topic: "Component architecture",
    difficulty: "medium",
    title:
      "How do you structure a React application? What are container and presentational components?",
    keywords: [
      "component architecture",
      "container component",
      "presentational component",
      "folder structure",
      "custom hooks",
      "thinking in React",
    ],
    interviewerIntent:
      "Checks that you can break a UI into components and separate data logic from display.",
    shortAnswer:
      "Start by splitting the UI into a hierarchy of components with one responsibility each, build a static version, find the minimal state, and place that state in the closest common parent. A presentational component only renders UI from props. A container component fetches data and holds state, then passes it down. Today custom hooks often replace containers by extracting the data logic.",
    detailedAnswer: [
      "Keep components small and named for what they show, such as `ProductCard` or `OrderTable`.",
      "Group files by feature, for example `features/orders`, rather than by type alone, so related code stays together.",
      "Extract reusable logic into custom hooks like `useOrders`, which keep components focused on rendering.",
      "State should live as low in the tree as possible, and only be lifted when two components need it.",
    ],
    realWorldExample:
      "An `OrdersPage` calls `useOrders()` for data and renders `OrderTable` and `OrderFilters`, which only receive props and callbacks and are easy to test.",
    commonMistakes: [
      "Putting all data fetching and UI in one huge component.",
      "Lifting state higher than needed.",
    ],
    followUps: [
      {
        question:
          "When should state be lifted up and when should it stay local?",
      },
    ],
    answerTips: [
      "Walk through the four steps of thinking in React, then mention custom hooks.",
    ],
    keyPoints: [
      "One responsibility per component",
      "Minimal state, kept low in the tree",
      "Presentational vs container separation",
      "Custom hooks hold reusable logic",
    ],
    revisionNotes: ["Small components, state low, logic in hooks."],
    sourceRefs: [
      {
        label: "React docs: Thinking in React",
        url: "https://react.dev/learn/thinking-in-react",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "strict-mode",
    topic: "Fundamentals",
    difficulty: "medium",
    title:
      "What is React StrictMode and why do components render twice in development?",
    keywords: [
      "StrictMode",
      "double render",
      "development",
      "pure rendering",
      "effects",
      "cleanup",
    ],
    interviewerIntent:
      "Checks that you know why you see duplicate logs in development and how it finds bugs.",
    shortAnswer:
      "`StrictMode` is a development-only wrapper that runs extra checks. It renders each component twice and runs effects an additional time (set up, clean up, set up again) to expose impure rendering and missing cleanup. It does not affect the production build or the visible UI.",
    detailedAnswer: [
      "If your render function changes outside variables or gives a different output for the same input, the double render makes the bug visible.",
      "The extra effect cycle checks that your cleanup function correctly undoes what the effect did.",
      "Do not remove StrictMode to hide the duplicate logs. Fix the impurity or the missing cleanup.",
      "Vite's React template wraps the root in StrictMode by default.",
    ],
    realWorldExample:
      "A subscription that was never unsubscribed showed up in development as two active connections. The fix was to return a cleanup function from the effect.",
    codeExamples: [
      {
        title: "Enabling StrictMode",
        language: "jsx",
        code: `import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)`,
        walkthrough: [
          "The whole app is wrapped in `StrictMode`.",
          "In development React calls components and effects an extra time.",
          "The production build skips these checks, so users see no difference.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking double logs mean a bug in React.",
      "Removing StrictMode instead of fixing the effect.",
    ],
    followUps: [{ question: "What makes a component function pure?" }],
    answerTips: [
      "Explain that it is a bug detector, not a performance problem.",
    ],
    keyPoints: [
      "Development only",
      "Double render and extra effect cycle",
      "Finds impure code and missing cleanup",
      "No effect in production",
    ],
    revisionNotes: ["StrictMode reveals bugs, it does not create them."],
    sourceRefs: [
      {
        label: "React docs: StrictMode",
        url: "https://react.dev/reference/react/StrictMode",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "portals",
    topic: "Rendering",
    difficulty: "medium",
    title: "What are React Portals and when would you use them?",
    keywords: [
      "portal",
      "createPortal",
      "modal",
      "tooltip",
      "z-index",
      "DOM node",
    ],
    interviewerIntent:
      "Checks that you know how to render overlays outside their parent's DOM without losing React behaviour.",
    shortAnswer:
      "A portal renders a component's children into a different DOM node than its parent, using `createPortal(children, domNode)`. It is used for modals, tooltips and dropdowns that must escape a parent with `overflow: hidden` or a lower z-index. The portal content still belongs to the same React tree, so it keeps context and events bubble to React parents.",
    detailedAnswer: [
      'Typical target is `document.body` or a dedicated `<div id="modal-root">`.',
      "Even though the DOM node is elsewhere, props, state and context work exactly as before.",
      "An event inside the portal bubbles up to ancestors in the React tree, not the DOM tree, which can be surprising.",
      "Remember accessibility for modals: move focus into the dialog, trap it while open and restore it on close.",
    ],
    realWorldExample:
      "A confirmation dialog triggered from inside a clipped scrolling table is portalled to the body, so it can cover the whole page.",
    codeExamples: [
      {
        title: "A modal rendered into body",
        language: "jsx",
        code: `import { createPortal } from "react-dom"

function Modal({ children, onClose }) {
  return createPortal(
    <div role="dialog" aria-modal="true">
      {children}
      <button onClick={onClose}>Close</button>
    </div>,
    document.body
  )
}`,
        walkthrough: [
          "`createPortal` takes the JSX and a target DOM node.",
          "The dialog is added to `document.body` instead of inside the parent element.",
          "It is still a child in the React tree, so state, context and handlers work.",
          "The `role` and `aria-modal` attributes describe it to assistive technology.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting focus management for modals.",
      "Expecting DOM bubbling instead of React-tree bubbling.",
    ],
    followUps: [{ question: "How does event bubbling work through a portal?" }],
    answerTips: [
      "Name modals and tooltips as the use cases, and mention accessibility.",
    ],
    keyPoints: [
      "Render children into another DOM node",
      "createPortal(children, node)",
      "Still part of the React tree",
      "Events bubble through the React tree",
    ],
    revisionNotes: ["Portal: different DOM place, same React tree."],
    sourceRefs: [
      {
        label: "React docs: createPortal",
        url: "https://react.dev/reference/react-dom/createPortal",
      },
    ],
    estimatedMinutes: 4,
  },
])
