import { defineLesson } from "@/data/lessons/author"

export default defineLesson("css", {
  slug: "specificity-and-cascade",
  title: "Specificity and the cascade",
  topic: "Specificity",
  minutes: 45,
  overview:
    "Understand which CSS rule wins when several match: how specificity is counted, what source order does, and how !important and the special selectors affect the result.",
  objectives: [
    "Calculate the specificity of a selector as ID, class and type counts",
    "Explain how source order decides between equal specificity",
    "Describe what !important, :where() and :is() do to the result",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Why one rule wins",
      body: [
        "Several rules can match the same element and set the same property. The **cascade** decides which one applies. It looks at the origin and importance of the declaration, then the **specificity** of the selector, and finally the order in the source.",
        "Specificity is a three-column value written ID - CLASS - TYPE. You count the selector components in each category of the selector that matches the element.",
        "ID selectors such as `#menu` add to the first column. Class selectors (`.card`), attribute selectors (`[type=\"text\"]`) and pseudo-classes (`:hover`) add to the second. Type selectors (`p`, `h1`) and pseudo-elements (`::before`) add to the third. Columns are compared from left to right, so a single ID beats any number of classes.",
      ],
    },
    {
      kind: "code",
      heading: "Counting specificity",
      example: {
        title: "Which colour wins?",
        language: "css",
        code: "p { color: black; }\n.note { color: blue; }\np.note { color: green; }\n#intro { color: red; }\nbody #intro.note { color: purple; }",
        walkthrough: [
          "`p` is 0-0-1. `.note` is 0-1-0, so it beats `p`.",
          "`p.note` is 0-1-1: one class and one type, so it beats `.note` alone.",
          "`#intro` is 1-0-0, which beats every selector with no ID.",
          "`body #intro.note` is 1-1-2, so it beats `#intro` for an element that matches both.",
          "If two selectors have the same specificity, the one that appears later in the stylesheet wins.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Special cases",
      body: [
        "The universal selector `*` and combinators such as the space, `>` and `+` add nothing to specificity. The pseudo-class `:where()` and its arguments also count as zero.",
        "`:is()`, `:not()` and `:has()` add no weight themselves, but the specificity of their most specific argument is used.",
        "Inline styles written in the `style` attribute beat any selector in a stylesheet. A declaration marked `!important` beats normal declarations whatever their specificity, and among important declarations specificity applies again. Overusing `!important` makes later changes hard.",
        "Cascade layers with `@layer` let you decide the order of groups of rules, so that a framework's rules can be placed below your own without raising specificity.",
      ],
    },
    {
      kind: "diagram",
      heading: "Specificity of common selectors",
      diagram: {
        kind: "table",
        title: "ID - CLASS - TYPE",
        headers: ["Selector", "Specificity"],
        rows: [
          ["`*`", "0-0-0"],
          ["`li`", "0-0-1"],
          ["`.item`", "0-1-0"],
          ["`ul .item`", "0-1-1"],
          ["`a:hover`", "0-1-1"],
          ["`#nav .item`", "1-1-0"],
          ["`:where(.a, .b)`", "0-0-0"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Fixing a stubborn style by adding !important.",
          fix: "Find which rule wins in the developer tools and adjust the selector or the order instead.",
        },
        {
          mistake: "Writing very long selectors with IDs to be safe.",
          fix: "Prefer a single class. Low and even specificity keeps a stylesheet easy to change.",
        },
        {
          mistake: "Thinking that more elements in the selector always win.",
          fix: "Compare the columns from left to right: one class beats any number of types.",
        },
        {
          mistake: "Forgetting that source order matters for equal specificity.",
          fix: "The later rule wins, so keep overrides after the base rules.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Why does my style not apply?",
      scenario:
        "You add `.button { background: blue; }` but the button stays grey.",
      body: [
        "Open the developer tools, select the button and look at the Styles panel. A crossed-out declaration shows a rule that lost. The winning rule is shown above it, for example `#header a { background: grey; }`. Its specificity is 1-0-1, which beats your 0-1-0, so it wins even though yours comes later.",
        "Choose the lightest fix: write a selector with enough specificity, such as `#header .button` (1-1-0), restructure the selectors or use a cascade layer, and keep `!important` as a last resort.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "id-vs-classes",
      prompt: "Which selector is most specific?",
      options: ["#title", ".a.b.c.d", "div p span"],
      answer: 0,
      explanation:
        "One ID (1-0-0) beats any number of classes, because the ID column is compared first.",
    },
    {
      type: "output",
      id: "later-wins",
      prompt: "What colour is the paragraph?",
      code: {
        language: "css",
        code: "p.intro { color: red; }\n.intro { color: blue; }",
      },
      options: ["red", "blue", "black"],
      answer: 0,
      explanation:
        "`p.intro` is 0-1-1 and `.intro` is 0-1-0, so the first rule wins whatever the order.",
    },
    {
      type: "truefalse",
      id: "where-zero",
      statement: ":where() adds no specificity.",
      answer: true,
      explanation:
        ":where() and its arguments count as 0-0-0, which makes it useful for easy-to-override defaults.",
    },
    {
      type: "blank",
      id: "equal-specificity",
      prompt: "When two rules have equal specificity, the one that comes ___ in the source wins.",
      answer: "later",
      accepted: ["last"],
      explanation:
        "With equal specificity, source order decides, and the later rule wins.",
    },
  ],
  assignment: {
    title: "Specificity table",
    task: [
      "Write ten selectors of your own and work out the specificity of each as ID-CLASS-TYPE.",
      "Create a test page where some of them target the same element, and check in the developer tools which one wins.",
    ],
    checklist: [
      "I counted IDs, classes and types for every selector",
      "I confirmed the winner in the developer tools",
      "I resolved one conflict without !important",
      "I can explain why a class beats many type selectors",
    ],
    hints: ["Give each rule a different colour so the winner is obvious."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "make-it-blue",
      title: "Make the link blue",
      task: [
        "The link inside the navigation stays grey. Change only the second rule so the link becomes blue, without using !important and without changing the first rule.",
      ],
      language: "css",
      starter: "#nav a {\n  color: grey;\n}\n\n.link {\n  color: blue;\n}",
      solution: "#nav a {\n  color: grey;\n}\n\n#nav .link {\n  color: blue;\n}",
      hints: ["`#nav a` is 1-0-1 and `.link` is 0-1-0. What would make the second selector at least 1-1-0?"],
      checklist: [
        "The second rule has higher specificity than #nav a",
        "No !important is used",
        "The first rule is unchanged",
      ],
    },
  ],
  revisionNotes: [
    "Specificity = ID - CLASS - TYPE, compared left to right",
    "Equal specificity: the later rule wins",
    "*, combinators and :where() add 0; :is() and :not() use their most specific argument",
    "Inline styles beat selectors; !important beats normal declarations; use sparingly",
  ],
  resources: [
    {
      label: "MDN: Specificity",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity",
    },
    {
      label: "MDN: !important",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/important",
    },
    {
      label: "MDN: @layer",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@layer",
    },
  ],
})
