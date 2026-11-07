import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "composition",
  title: "Composition: children, slots and avoiding prop drilling",
  topic: "Composition",
  minutes: 60,
  overview:
    "Build flexible components by composing them, using children and slot props, and avoid passing data through many layers.",
  objectives: [
    "Use children and named slot props to build flexible layouts",
    "Prefer composition over inheritance and over many boolean props",
    "Lift state up and recognise prop drilling",
  ],
  prerequisites: ["lesson.react.props"],
  sections: [
    {
      kind: "explain",
      heading: "Composition, not inheritance",
      body: [
        "React favours **composition**: building a component by combining other components. You pass content into a component with `children`, or in props that hold JSX. React does not use inheritance between components, and there is nothing that composition cannot do.",
        "`children` is good for one area of content. For several areas, use **slot props**, which are props whose value is JSX: `<Layout header={<Nav />} sidebar={<Menu />}>content</Layout>`. The component places each piece where it belongs and knows nothing about what it is.",
        "This keeps components small and reusable, and avoids a long list of props that only configure what to show.",
      ],
    },
    {
      kind: "code",
      heading: "A layout with slots",
      example: {
        title: "children and slot props",
        language: "jsx",
        code: 'function Layout({ header, sidebar, children }) {\n  return (\n    <div className="layout">\n      <header>{header}</header>\n      <aside>{sidebar}</aside>\n      <main>{children}</main>\n    </div>\n  );\n}\n\nexport default function Page() {\n  return (\n    <Layout header={<h1>Shop</h1>} sidebar={<Filters />}>\n      <ProductGrid />\n    </Layout>\n  );\n}',
        walkthrough: [
          "`Layout` decides the structure and has no knowledge of the content.",
          "`header` and `sidebar` are slots, and the content between the tags is `children`.",
          "A different page can reuse the same layout with other content.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Lifting state up",
      body: [
        "When two components need the same changing data, move the state to their **closest common parent**, and pass the value down and a callback up. This is called **lifting state up**. There is then one source of truth, and the components stay in sync.",
        "A sign that state should be lifted is that you are copying data from one component to another, or keeping two states in sync with an effect.",
        "Keep state **as low as possible**: only lift it when more than one component needs it. State that only one component uses should stay in that component.",
      ],
    },
    {
      kind: "code",
      heading: "Shared state",
      example: {
        title: "A parent owns the value",
        language: "jsx",
        code: 'function Temperature() {\n  const [celsius, setCelsius] = useState(20);\n  return (\n    <>\n      <Input label="Celsius" value={celsius} onChange={setCelsius} />\n      <Input label="Fahrenheit" value={celsius * 1.8 + 32} onChange={(f) => setCelsius((f - 32) / 1.8)} />\n    </>\n  );\n}',
        walkthrough: [
          "The state lives in `Temperature`, the closest parent of both inputs.",
          "Each `Input` shows the value that it gets and reports changes upward.",
          "Fahrenheit is calculated from the single state value, so the two fields cannot disagree.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Prop drilling and its cures",
      body: [
        "**Prop drilling** means passing a prop through many components that do not use it, just to reach a deep child. It makes code harder to change. First try composition: instead of passing data down, pass the **already built JSX** down. A component can receive `<Avatar user={user} />` as a prop, so the layers between never see `user`.",
        "If many components at different depths need the same data, such as the current user or the theme, **context** is the tool, which is the topic of a later lesson. Do not reach for it first: composition solves many cases more simply.",
        "Avoid a large number of boolean props such as `primary`, `large`, `outlined`, `rounded`. Combinations multiply, and the code inside becomes a pile of conditions. Make separate small components, or pass the variation as one prop with a few named values.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Passing a prop through five layers that do not use it.",
          fix: "Compose: pass built JSX, or use context for truly global data.",
        },
        {
          mistake:
            "Keeping the same data in two components with an effect to sync them.",
          fix: "Lift the state to the common parent.",
        },
        {
          mistake: "Creating a component with ten boolean props.",
          fix: "Split it into smaller components, or use a variant prop.",
        },
        {
          mistake: "Lifting all state to the top of the app.",
          fix: "Keep state as close as possible to where it is used.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A modal dialog",
      scenario:
        "An application needs dialogs with a title, some content and buttons, in many places.",
      body: [
        "Create a `Dialog` that renders the frame and accepts `title`, `children` and `actions` slots. Each screen composes its own content, and the dialog handles the open state and the focus.",
        "One component then serves every dialog, and no screen needs a special prop.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "children-slot",
      prompt: "What is a slot prop?",
      options: [
        "A prop whose value is JSX that the component places somewhere",
        "A prop that is always a string",
        "A default prop",
      ],
      answer: 0,
      explanation:
        "Slot props let a component accept several pieces of content, such as a header and a sidebar.",
    },
    {
      type: "single",
      id: "lift-where",
      prompt:
        "Two sibling components need the same changing value. Where should the state go?",
      options: [
        "In their closest common parent",
        "In both siblings, kept in sync with an effect",
        "In a global variable",
      ],
      answer: 0,
      explanation:
        "Lifting state to the closest common parent gives one source of truth.",
    },
    {
      type: "truefalse",
      id: "inherit",
      statement:
        "React recommends building components by inheriting from other components.",
      answer: false,
      explanation: "React recommends composition. Inheritance is not needed.",
    },
    {
      type: "single",
      id: "drilling",
      prompt: "What is prop drilling?",
      options: [
        "Passing props through components that do not use them",
        "Passing a function as a prop",
        "Using many props",
      ],
      answer: 0,
      explanation:
        "The data passes through layers that only forward it to a deeper child.",
    },
  ],
  assignment: {
    title: "Compose a layout and a dialog",
    task: [
      "Build a `Layout` with header, sidebar and children slots, and a `Dialog` with a title, children and an actions slot.",
      "Use them on two different pages, and show a case where you lifted state to a parent.",
    ],
    checklist: [
      "Layout and Dialog know nothing about their content",
      "No prop is only forwarded through more than two layers",
      "State is as low as possible",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "composition-refactor",
      title: "Replace boolean props",
      task: [
        "This `Button` has boolean props for each look. Rewrite it with one `variant` prop that accepts `'primary'`, `'danger'` or `'plain'`, and a default of `'plain'`.",
      ],
      language: "jsx",
      starter:
        "function Button({ primary, danger, children }) {\n  let cls = 'btn';\n  if (primary) cls += ' primary';\n  if (danger) cls += ' danger';\n  return <button className={cls}>{children}</button>;\n}",
      solution:
        "function Button({ variant = 'plain', children }) {\n  return <button className={'btn ' + variant}>{children}</button>;\n}",
      hints: ["Use the variant value directly in the class name."],
      checklist: [
        "Only one variant can be active",
        "The default is plain",
        "The call site is shorter and clearer",
      ],
    },
  ],
  revisionNotes: [
    "Compose with `children` and slot props; React does not use inheritance",
    "Lift state to the closest common parent; keep it as low as possible",
    "Prop drilling: try composition first, then context",
    "Avoid many boolean props: use a variant or separate components",
  ],
  resources: [
    {
      label: "React: Sharing State Between Components",
      url: "https://react.dev/learn/sharing-state-between-components",
    },
    {
      label: "React: Passing Props to a Component (children)",
      url: "https://react.dev/learn/passing-props-to-a-component",
    },
    {
      label: "React: Passing Data Deeply with Context",
      url: "https://react.dev/learn/passing-data-deeply-with-context",
    },
  ],
})
