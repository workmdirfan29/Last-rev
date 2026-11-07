import { defineLesson } from "@/data/lessons/author"

export default defineLesson("css", {
  slug: "flexbox",
  title: "Flexbox: one-dimensional layout",
  topic: "Flexbox",
  minutes: 60,
  overview:
    "Learn to lay out items in a row or a column with flexbox: the main and cross axis, justify-content, align-items, wrapping, gap and the flex shorthand.",
  objectives: [
    "Create a flex container and explain the main axis and the cross axis",
    "Align and space items with justify-content, align-items and gap",
    "Control how items grow and shrink with flex and wrap them with flex-wrap",
  ],
  prerequisites: ["lesson.css.box-model"],
  sections: [
    {
      kind: "explain",
      heading: "A container and its items",
      body: [
        "Set `display: flex` on an element and it becomes a **flex container**. Its direct children become **flex items**, and they are laid out along one line, a row by default.",
        "A flex container has two axes. The **main axis** runs in the direction of `flex-direction`, which is `row` by default and can be `column`, `row-reverse` or `column-reverse`. The **cross axis** is perpendicular to it.",
        "`justify-content` aligns items along the main axis, and `align-items` aligns them along the cross axis. Which is horizontal and which is vertical depends on `flex-direction`.",
      ],
    },
    {
      kind: "code",
      heading: "A toolbar",
      example: {
        title: "Spacing and centring items",
        language: "css",
        code: ".toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  padding: 8px 16px;\n}\n\n.toolbar .title {\n  margin-right: auto;\n}",
        walkthrough: [
          "`display: flex` turns the children into flex items in a row.",
          "`justify-content: space-between` puts the first item at the start, the last at the end and shares the free space between them.",
          "`align-items: center` centres the items vertically when the direction is a row.",
          "`gap: 12px` adds space between items without needing margins on them.",
          "`margin-right: auto` on one item takes all the free space after it, which pushes the following items to the far end.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Growing, shrinking and wrapping",
      body: [
        "The `flex` shorthand sets `flex-grow`, `flex-shrink` and `flex-basis`. A single number such as `flex: 1` expands to `1 1 0%`, so the item may grow to take its share of free space, may shrink, and starts from a basis of zero.",
        "Items share free space in proportion to their `flex-grow` values. If one item has `flex: 2` and its two siblings `flex: 1`, it takes twice as much of the shared space.",
        "By default items stay on one line and may shrink. With `flex-wrap: wrap` they move onto new lines when they run out of space. `flex-basis` sets the starting size of an item before growing or shrinking.",
      ],
    },
    {
      kind: "diagram",
      heading: "Which property does what",
      diagram: {
        kind: "table",
        title: "Flexbox properties",
        headers: ["Property", "Applies to", "Effect"],
        rows: [
          ["`display: flex`", "Container", "Creates a flex container"],
          ["`flex-direction`", "Container", "Sets the main axis"],
          ["`justify-content`", "Container", "Aligns items on the main axis"],
          ["`align-items`", "Container", "Aligns items on the cross axis"],
          ["`flex-wrap`", "Container", "Allows items to wrap onto new lines"],
          ["`gap`", "Container", "Space between items"],
          ["`flex`", "Item", "Grow, shrink and basis"],
          ["`align-self`", "Item", "Overrides align-items for one item"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting display: flex on the item instead of the parent.",
          fix: "Flex properties for layout go on the container, and the items are its children.",
        },
        {
          mistake: "Forgetting that justify-content and align-items swap with flex-direction: column.",
          fix: "justify-content follows the main axis, which is vertical in a column.",
        },
        {
          mistake: "Centring with margins and guesses.",
          fix: "Use justify-content: center and align-items: center on the container.",
        },
        {
          mistake: "Expecting flex items to wrap by themselves.",
          fix: "Add flex-wrap: wrap to the container.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Centring a card on a page",
      scenario:
        "You want a card centred both horizontally and vertically in the middle of the screen.",
      body: [
        "Make the page wrapper a flex container with `display: flex`, `justify-content: center`, `align-items: center` and `min-height: 100vh`. The card, as its only child, then sits in the middle.",
        "This works the same for any size of card, so you do not need to know its dimensions in advance.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "flex-container",
      prompt: "Which declaration creates a flex container?",
      options: ["display: flex", "flex: 1", "align-items: center"],
      answer: 0,
      explanation:
        "`display: flex` on the parent creates the container. The others are properties that need a container.",
    },
    {
      type: "single",
      id: "main-axis-column",
      prompt: "In a container with flex-direction: column, which property aligns items horizontally?",
      options: ["align-items", "justify-content", "flex-wrap"],
      answer: 0,
      explanation:
        "The main axis is vertical in a column, so the horizontal cross axis is controlled by align-items.",
    },
    {
      type: "truefalse",
      id: "flex-one",
      statement: "flex: 1 lets an item grow to take a share of the free space.",
      answer: true,
      explanation:
        "`flex: 1` sets flex-grow to 1, so the item can grow into free space.",
    },
    {
      type: "blank",
      id: "wrap-property",
      prompt: "To let flex items move onto a new line, set flex-___: wrap.",
      answer: "wrap",
      explanation:
        "The property is `flex-wrap`, and `wrap` is the value that allows new lines.",
    },
  ],
  assignment: {
    title: "A flexible navigation bar",
    task: [
      "Build a navigation bar with a logo on the left, three links in the middle and a button on the right.",
      "Make it wrap sensibly on a narrow screen using flex-wrap and gap.",
    ],
    checklist: [
      "The bar is a flex container",
      "Items are spaced with gap and justify-content",
      "Items are vertically centred",
      "On a narrow window, items wrap instead of overflowing",
    ],
    hints: ["Use margin-left: auto on the last item to push it to the right."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "centre-and-space",
      title: "Centre and space",
      task: [
        "Make three boxes sit in a row, centred vertically, with equal space between them and a 16px gap as a minimum.",
      ],
      language: "css",
      starter: ".row {\n  /* your code */\n}\n\n.row > div {\n  padding: 12px;\n  background: #ddd;\n}",
      solution:
        ".row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}\n\n.row > div {\n  padding: 12px;\n  background: #ddd;\n}",
      hints: ["Which value of justify-content spreads items with equal space between them?"],
      checklist: [
        "The row is a flex container",
        "justify-content shares space between the items",
        "align-items centres them vertically",
      ],
    },
  ],
  revisionNotes: [
    "display: flex on the parent; children become flex items",
    "justify-content = main axis, align-items = cross axis; flex-direction flips them",
    "flex: 1 means grow 1, shrink 1, basis 0%; gap spaces items",
    "flex-wrap: wrap lets items use new lines",
  ],
  resources: [
    {
      label: "MDN: Basic concepts of flexbox",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox",
    },
    {
      label: "MDN: flex",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex",
    },
    {
      label: "MDN: justify-content",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content",
    },
  ],
})
