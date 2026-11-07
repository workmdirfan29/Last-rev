import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "react-fundamentals",
  title: "React fundamentals: UI as a function of state",
  topic: "Fundamentals",
  minutes: 45,
  overview:
    "Understand what React does, how it differs from changing the page by hand, and how a React app starts.",
  objectives: [
    "Explain declarative UI and why React exists",
    "Describe components, the virtual tree and re-rendering at a high level",
    "Create a project and render a first component",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What React is",
      body: [
        "React is a JavaScript library for building user interfaces from small pieces called **components**. You describe **what the screen should look like** for the current data, and React works out how to update the page. This is called **declarative** UI.",
        "Without React, you change the page step by step: find an element, change its text, add a class, remove another element. With many pieces of changing data, these steps get tangled and hard to follow. With React, the screen is a **function of the data**: the same data always produces the same screen.",
        "React itself only handles the view. Routing, data fetching and state management beyond a component are provided by other libraries or by a framework built on React.",
      ],
    },
    {
      kind: "code",
      heading: "A first component",
      example: {
        title: "Function that returns JSX",
        language: "jsx",
        code: 'function Greeting({ name }) {\n  return <h1>Hello, {name}</h1>;\n}\n\nexport default function App() {\n  return (\n    <main>\n      <Greeting name="Asha" />\n      <Greeting name="Ravi" />\n    </main>\n  );\n}',
        walkthrough: [
          "`Greeting` is a component: a function that returns a description of the UI.",
          "`{name}` puts a JavaScript value inside the markup.",
          "`App` uses `Greeting` twice, with different data. Each use is an independent copy.",
          "Component names start with a capital letter, so React can tell them from ordinary HTML tags.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "How an app starts and updates",
      body: [
        "A project is usually created with a build tool such as Vite. The entry file finds an element in the HTML page, creates a **root** with `createRoot(element)` from `react-dom/client`, and calls `root.render(<App />)`. React then shows the component tree inside that element.",
        "When the data of a component changes, React **renders** the component again to get the new description of the UI. It compares the new description with the previous one and changes only the parts of the real page that are different. The description is a tree of plain JavaScript objects, which is often called the virtual tree.",
        "Your component code should be **pure**: given the same props and state, it returns the same JSX, and it does not change things outside itself while rendering. Side effects, such as fetching data, belong in event handlers or effects.",
      ],
    },
    {
      kind: "code",
      heading: "Starting the app",
      example: {
        title: "createRoot",
        language: "jsx",
        code: "import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\n\ncreateRoot(document.getElementById('root')).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);",
        walkthrough: [
          "`document.getElementById('root')` is the element in `index.html` where the app appears.",
          "`createRoot(...).render(...)` starts React.",
          "`StrictMode` adds extra checks during development, such as running some functions twice to reveal impure code.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Naming a component in lower case, `<greeting />`.",
          fix: "Use a capital letter. Lower case names are treated as HTML tags.",
        },
        {
          mistake: "Changing a variable and expecting the screen to update.",
          fix: "Only state changes make React render again. A normal variable does not.",
        },
        {
          mistake:
            "Changing the DOM directly with `document.querySelector` inside a component.",
          fix: "Let React own the elements. Describe them in JSX instead.",
        },
        {
          mistake:
            "Doing a side effect, such as a network call, directly in the body of the component.",
          fix: "The body must be pure. Use an event handler or an effect.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A product page",
      scenario:
        "A page shows a product name, a price, a photo and an add-to-cart button.",
      body: [
        "Split it into components: `ProductPage`, `ProductPhoto`, `PriceTag` and `AddToCart`. Each one has a clear job and receives the data that it shows as props.",
        "When the price changes, only the data changes, and React updates the text for you.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "declarative",
      prompt: "What does declarative UI mean in React?",
      options: [
        "You describe what the UI looks like for the current data",
        "You write the steps that change the page",
        "You write all the HTML by hand",
      ],
      answer: 0,
      explanation:
        "You describe the result for the current data, and React works out the changes to the page.",
    },
    {
      type: "single",
      id: "component-name",
      prompt: "Why must a component name start with a capital letter?",
      options: [
        "So React can tell a component from an HTML tag",
        "Because JavaScript requires it",
        "It makes the component faster",
      ],
      answer: 0,
      explanation:
        "`<Greeting />` is a component and `<greeting />` is treated as an HTML tag.",
    },
    {
      type: "truefalse",
      id: "pure-render",
      statement:
        "A component should change variables outside itself while it renders.",
      answer: false,
      explanation:
        "Rendering must be pure. The same inputs give the same output, and side effects belong in handlers or effects.",
    },
    {
      type: "blank",
      id: "root-fn",
      prompt:
        "To start a React app, call `___(element).render(<App />)` from react-dom/client.",
      answer: "createRoot",
      explanation:
        "`createRoot` creates the root of the app inside a DOM element.",
    },
  ],
  assignment: {
    title: "Your first components",
    task: [
      "Create a Vite React project, and replace the starter page with a `ProfileCard` component.",
      "Show a name, a role and a photo from three props, and use the card three times with different data.",
    ],
    checklist: [
      "The project runs with npm run dev",
      "ProfileCard is used three times with different props",
      "I can explain in two sentences what React does when the data changes",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "split-ui",
      title: "Split a page into components",
      task: [
        "Write down the component tree for a blog page that has a header, a list of posts, each with a title, a date and a Like button, and a footer.",
        "Write the JSX for `Post` and for `PostList`, which renders three posts.",
      ],
      language: "jsx",
      starter:
        "function Post(props) {\n  // your code\n}\n\nfunction PostList() {\n  // your code\n}",
      solution:
        'function Post({ title, date }) {\n  return (\n    <article>\n      <h2>{title}</h2>\n      <time>{date}</time>\n      <button>Like</button>\n    </article>\n  );\n}\n\nfunction PostList() {\n  return (\n    <section>\n      <Post title="One" date="2026-01-01" />\n      <Post title="Two" date="2026-01-02" />\n      <Post title="Three" date="2026-01-03" />\n    </section>\n  );\n}',
      hints: ["Pass the title and the date as props."],
      checklist: [
        "Post is used three times",
        "Each post shows its own data",
        "Components start with a capital letter",
      ],
    },
  ],
  revisionNotes: [
    "React = declarative UI built from components",
    "Rendering must be pure; side effects go in handlers or effects",
    "State changes make React render again and update only the differences",
    "`createRoot(element).render(<App />)` starts an app",
  ],
  resources: [
    {
      label: "React: Quick Start",
      url: "https://react.dev/learn",
    },
    {
      label: "React: Thinking in React",
      url: "https://react.dev/learn/thinking-in-react",
    },
  ],
})
