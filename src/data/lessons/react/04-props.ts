import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "props",
  title: "Props: passing data to components",
  topic: "Props",
  minutes: 35,
  overview:
    "Pass data and functions to child components, give default values, use children, and keep props read-only.",
  objectives: [
    "Pass props and destructure them in a component",
    "Use default values, the spread syntax and the children prop",
    "Explain why props are read-only and how a child talks back to its parent",
  ],
  prerequisites: ["lesson.react.components"],
  sections: [
    {
      kind: "explain",
      heading: "Passing props",
      body: [
        '**Props** are the inputs of a component. You write them as attributes: `<Avatar size={48} name="Asha" />`, and the component receives one object, usually destructured in the parameter list: `function Avatar({ size, name })`. A prop can be any JavaScript value: text, a number, an object, an array, a function, or JSX.',
        "A string can be written with quotes, and every other value needs braces. A default value is given in the destructuring: `{ size = 32 }`. The default is used when the prop is `undefined`.",
        "The spread syntax passes a whole object as props: `<Profile {...user} />`. Use it carefully, because it hides which props are passed.",
      ],
    },
    {
      kind: "code",
      heading: "Props with defaults and children",
      example: {
        title: "A reusable card",
        language: "jsx",
        code: "function Card({ title, tone = 'plain', children }) {\n  return (\n    <section className={'card ' + tone}>\n      <h2>{title}</h2>\n      {children}\n    </section>\n  );\n}\n\nexport default function Page() {\n  return (\n    <Card title=\"Tips\" tone=\"info\">\n      <p>Drink water.</p>\n      <p>Take a walk.</p>\n    </Card>\n  );\n}",
        walkthrough: [
          "`tone` has a default value of `'plain'`.",
          "`children` is whatever you write between the opening and closing tags of the component.",
          "`Card` does not know what is inside it, which makes it reusable for any content.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Props are read-only",
      body: [
        "A component must **never change its props**. Props are like the arguments of a function, and the parent owns them. If a component needs to remember or change something, it needs **state**, which a later lesson covers.",
        "A child talks back to its parent by receiving a **function as a prop**, and calling it. The parent decides what the call means. This is how a button inside a child can change the state that lives in the parent.",
        "Because data flows **one way**, from parent to child, you can always find where a value comes from by following the props upwards.",
      ],
    },
    {
      kind: "code",
      heading: "A callback prop",
      example: {
        title: "Child tells parent",
        language: "jsx",
        code: "function LikeButton({ onLike, count }) {\n  return <button onClick={() => onLike(1)}>Like ({count})</button>;\n}\n\nfunction Post() {\n  const [likes, setLikes] = useState(0);\n  return <LikeButton count={likes} onLike={(n) => setLikes(likes + n)} />;\n}",
        walkthrough: [
          "`Post` owns the state, and gives `LikeButton` the count and a function.",
          "The button calls `onLike`, and the parent updates its own state.",
          "`LikeButton` never changes the count itself.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Changing a prop inside the child, such as `props.items.push(x)`.",
          fix: "Treat props as read-only. Ask the parent to change the data through a callback.",
        },
        {
          mistake: "Passing too many props through many levels.",
          fix: "Group related data, use composition, or use context for widely shared data.",
        },
        {
          mistake:
            "Calling the callback while rendering: `onClick={handle()}`.",
          fix: "Pass the function, `onClick={handle}`, or wrap it, `onClick={() => handle(id)}`.",
        },
        {
          mistake: "Using `{...props}` everywhere.",
          fix: "Pass the props that the child needs, so the code stays clear.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A reusable button",
      scenario:
        "A design system needs a `Button` with a label, a size, a disabled state and a click handler.",
      body: [
        'Give it props for each variation, with defaults for the common case, and a `children` prop for custom content. Callers then write `<Button size="lg" onClick={save}>Save</Button>`.',
        "A small, well-named set of props makes the component easy to use correctly.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "children-what",
      prompt: "What is the `children` prop?",
      options: [
        "The content written between the opening and closing tags",
        "A list of child components defined in the file",
        "A function called after render",
      ],
      answer: 0,
      explanation:
        "Anything between `<Card>` and `</Card>` is passed as `children`.",
    },
    {
      type: "single",
      id: "default-when",
      prompt: "When is a default value in `{ size = 32 }` used?",
      options: [
        "When the prop is undefined",
        "When the prop is null",
        "When the prop is 0",
      ],
      answer: 0,
      explanation:
        "Defaults apply to `undefined` only. `null` and `0` are real values.",
    },
    {
      type: "truefalse",
      id: "props-change",
      statement: "A component may change the props that it receives.",
      answer: false,
      explanation:
        "Props are read-only. Use state, or ask the parent through a callback.",
    },
    {
      type: "single",
      id: "child-to-parent",
      prompt: "How does a child component send information to its parent?",
      options: [
        "By calling a function that the parent passed as a prop",
        "By changing its own props",
        "By editing the parent file",
      ],
      answer: 0,
      explanation:
        "Data goes down as props, and events go up through callback props.",
    },
  ],
  assignment: {
    title: "A reusable component set",
    task: [
      "Build `Button`, `Card` and `Badge` components with props for variations and defaults.",
      "Use `children` in `Card`, and a callback prop in `Button`, and show all three on one page.",
    ],
    checklist: [
      "Each component has sensible defaults",
      "Card shows any children",
      "Button reports clicks to the parent",
    ],
    minutes: 15,
  },
  exercises: [
    {
      slug: "props-practice",
      title: "Add default props",
      task: [
        "Write a `Tag` component with the props `label`, `color` (default `'gray'`) and `onRemove`. It shows the label and a button that calls `onRemove` with the label.",
      ],
      language: "jsx",
      starter: "function Tag(props) {\n  // your code\n}",
      solution:
        "function Tag({ label, color = 'gray', onRemove }) {\n  return (\n    <span className={'tag ' + color}>\n      {label}\n      <button onClick={() => onRemove(label)}>Remove</button>\n    </span>\n  );\n}",
      hints: [
        "Destructure the props, and wrap the callback in an arrow function.",
      ],
      checklist: [
        "color defaults to gray",
        "onRemove receives the label",
        "The component does not change its props",
      ],
    },
  ],
  revisionNotes: [
    "Props are the inputs; they flow down and are read-only",
    "Defaults with `{ x = value }`; `children` is the content between the tags",
    "Pass functions as props so a child can tell its parent",
    "Pass a function, do not call it: `onClick={handle}`",
  ],
  resources: [
    {
      label: "React: Passing Props to a Component",
      url: "https://react.dev/learn/passing-props-to-a-component",
    },
  ],
})
