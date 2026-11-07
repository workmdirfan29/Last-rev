import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "jsx",
  title: "JSX: markup inside JavaScript",
  topic: "JSX",
  minutes: 45,
  overview:
    "Write JSX correctly, put JavaScript expressions in it, and know the rules that differ from HTML.",
  objectives: [
    "Write JSX with expressions, attributes and conditional content",
    "Apply the JSX rules: one root, closed tags, className and camelCase",
    "Explain why JSX is safe against injected text",
  ],
  prerequisites: ["lesson.react.react-fundamentals"],
  sections: [
    {
      kind: "explain",
      heading: "What JSX is",
      body: [
        "**JSX** is a syntax that lets you write markup that looks like HTML inside JavaScript. A build tool turns each tag into a function call that creates a description of an element. JSX is not a string and not real HTML.",
        "Curly braces `{}` let you use any JavaScript **expression** inside JSX: `{user.name}`, `{price * 2}`, `{items.length}`. You can use them for text and for attribute values: `<img src={photoUrl} alt={name} />`. A statement such as `if` or `for` cannot go inside braces. Use the conditional operator, `&&` or `map` instead.",
        "The result of a component must have **one root**. Wrap siblings in a parent element or in a fragment, `<>...</>`, which adds no extra element to the page.",
      ],
    },
    {
      kind: "code",
      heading: "Expressions and attributes",
      example: {
        title: "JSX in practice",
        language: "jsx",
        code: "function Product({ item, selected }) {\n  const price = item.price * (1 + item.tax);\n  return (\n    <>\n      <h2 className={selected ? 'card selected' : 'card'}>{item.name}</h2>\n      <img src={item.photo} alt={item.name} />\n      <p>Price: {price.toFixed(2)}</p>\n      {item.stock === 0 && <p>Sold out</p>}\n      <label htmlFor=\"qty\">Quantity</label>\n      <input id=\"qty\" type=\"number\" style={{ width: '4rem' }} />\n    </>\n  );\n}",
        walkthrough: [
          "The fragment `<>...</>` gives one root without adding an element.",
          "`className` is used instead of `class`, and `htmlFor` instead of `for`.",
          "`{item.stock === 0 && <p>Sold out</p>}` shows the paragraph only when the condition is true.",
          "`style` takes an object, so there are two pairs of braces: one for the expression and one for the object. CSS property names are written in camelCase.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The rules",
      body: [
        "Every tag must be **closed**: `<br />`, `<img />` and `<input />` need the slash. Attribute names are written in camelCase: `onClick`, `tabIndex`, `maxLength`. A few words that clash with JavaScript are renamed: `className` and `htmlFor`.",
        "Values that are `null`, `undefined`, `true` or `false` render **nothing**. The number `0` renders as `0`, which is why `{count && <List />}` shows a zero when the count is zero. Write `{count > 0 && <List />}` instead.",
        "React **escapes** the values that you put in braces, so a string such as `<script>` is shown as text and does not run. This protects against many injection mistakes. The exception is the prop `dangerouslySetInnerHTML`, whose name is a warning: use it only with HTML that you have cleaned.",
      ],
    },
    {
      kind: "code",
      heading: "Choosing what to show",
      example: {
        title: "Conditions",
        language: "jsx",
        code: 'function Status({ loading, error, user }) {\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p role="alert">Something went wrong</p>;\n  return (\n    <section>\n      <h1>{user.name}</h1>\n      {user.isAdmin ? <button>Settings</button> : null}\n    </section>\n  );\n}',
        walkthrough: [
          "Early `return` statements are a clear way to handle loading and error cases.",
          "The conditional operator chooses between two pieces of JSX, and `null` shows nothing.",
          "The component still has one clear result for each combination of inputs.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing `class` and `for` in JSX.",
          fix: "Use `className` and `htmlFor`.",
        },
        {
          mistake: "Leaving a tag open, such as `<img>`.",
          fix: "Close it: `<img />`.",
        },
        {
          mistake:
            "Writing `{count && <Items />}` with a count that may be `0`.",
          fix: "Compare explicitly: `{count > 0 && <Items />}`.",
        },
        {
          mistake: "Putting an object directly in braces, such as `{user}`.",
          fix: "Objects cannot be rendered. Render its fields, such as `{user.name}`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A notification badge",
      scenario:
        "A badge shows the number of unread messages, and must be hidden when there are none.",
      body: [
        'Write `{unread > 0 && <span className="badge">{unread}</span>}`. With `{unread && ...}` the page would show a lone `0` when the count is zero.',
        "Small rules like this one prevent visible bugs in real interfaces.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "jsx-zero",
      prompt:
        "A component renders `{count && <Badge />}` with `count` equal to 0. What appears?",
      code: {
        language: "jsx",
        code: "function Bell({ count }) {\n  return <div>{count && <Badge />}</div>;\n}",
      },
      options: ["The number 0", "Nothing", "The Badge"],
      answer: 0,
      explanation:
        "`0` is a valid value to render. Use `count > 0` to get a boolean.",
    },
    {
      type: "single",
      id: "jsx-class",
      prompt: "Which attribute sets the CSS class in JSX?",
      options: ["className", "class", "cssClass"],
      answer: 0,
      explanation:
        "`class` is a reserved word in JavaScript, so JSX uses `className`.",
    },
    {
      type: "truefalse",
      id: "jsx-escape",
      statement:
        "React escapes text that you put inside curly braces, so `<script>` is shown as text.",
      answer: true,
      explanation:
        "Values in braces are escaped. Only `dangerouslySetInnerHTML` inserts raw HTML.",
    },
    {
      type: "multi",
      id: "jsx-rules",
      prompt: "Which of these are JSX rules?",
      options: [
        "Tags must be closed",
        "A component needs one root",
        "You can use an if statement inside braces",
        "Attributes use camelCase",
      ],
      answers: [0, 1, 3],
      explanation:
        "Only expressions can go inside braces. Use the conditional operator or `&&` instead of an `if` statement.",
    },
  ],
  assignment: {
    title: "Convert HTML to JSX",
    task: [
      "Take a page of plain HTML with a form, an image, a list and a styled box, and rewrite it as JSX in a component.",
      "Show one part only when a prop is true, and show the length of a list.",
    ],
    checklist: [
      "There are no console warnings about attributes",
      "The component has one root",
      "No raw count && pattern shows a lone zero",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "jsx-fix",
      title: "Fix the JSX",
      task: ["Fix the problems in this component. There are four of them."],
      language: "jsx",
      starter:
        'function Card({ title, items }) {\n  return (\n    <div class="card">\n      <h2>{title}</h2>\n      <img src="logo.png">\n      {items.length && <p>Has items</p>}\n    </div>\n    <button>Close</button>\n  );\n}',
      solution:
        'function Card({ title, items }) {\n  return (\n    <>\n      <div className="card">\n        <h2>{title}</h2>\n        <img src="logo.png" alt="" />\n        {items.length > 0 && <p>Has items</p>}\n      </div>\n      <button>Close</button>\n    </>\n  );\n}',
      hints: [
        "Look at the attribute name, the open tag, the zero problem and the number of roots.",
      ],
      checklist: [
        "class is now className",
        "The img is closed",
        "The zero case is handled",
        "There is a single root",
      ],
    },
  ],
  revisionNotes: [
    "JSX = JavaScript expressions in markup; braces `{}` for expressions",
    "One root (or a fragment), closed tags, camelCase, `className`/`htmlFor`",
    "null, undefined, true and false render nothing, but 0 renders as 0",
    "Values in braces are escaped",
  ],
  resources: [
    {
      label: "React: Writing Markup with JSX",
      url: "https://react.dev/learn/writing-markup-with-jsx",
    },
    {
      label: "React: JavaScript in JSX with Curly Braces",
      url: "https://react.dev/learn/javascript-in-jsx-with-curly-braces",
    },
  ],
})
