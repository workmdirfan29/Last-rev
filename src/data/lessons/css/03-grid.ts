import { defineLesson } from "@/data/lessons/author"

export default defineLesson("css", {
  slug: "grid",
  title: "CSS Grid: two-dimensional layout",
  topic: "Grid",
  minutes: 60,
  overview:
    "Lay out content in rows and columns with CSS Grid: tracks, the fr unit, repeat and minmax, placing items and naming areas.",
  objectives: [
    "Define columns and rows with grid-template-columns and grid-template-rows",
    "Use fr, repeat() and minmax() to make flexible tracks",
    "Place items by line number or by named grid areas, and know when to use grid or flexbox",
  ],
  prerequisites: ["lesson.css.box-model"],
  sections: [
    {
      kind: "explain",
      heading: "Rows and columns",
      body: [
        "Set `display: grid` on a container and define its **tracks**, the columns and rows, with `grid-template-columns` and `grid-template-rows`. The direct children are placed into the cells in order.",
        "Grid works in two dimensions at once, unlike flexbox, which lays out items along one axis. The CSS grid layout module can create fixed and flexible track sizes, place items precisely and create extra tracks as content needs them.",
        "The **fr** unit shares the available space. In `1fr 2fr` the second column gets twice as much of the free space as the first. `gap` adds space between rows and columns.",
      ],
    },
    {
      kind: "code",
      heading: "A responsive card grid",
      example: {
        title: "repeat, minmax and gap",
        language: "css",
        code: ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 16px;\n}\n\n.fixed {\n  display: grid;\n  grid-template-columns: 200px 1fr 1fr;\n}",
        walkthrough: [
          "`repeat(auto-fit, …)` creates as many columns as fit in the container.",
          "`minmax(220px, 1fr)` makes each column at least 220 pixels wide and lets it grow to share leftover space equally.",
          "With this one rule the grid shows more columns on wide screens and fewer on narrow ones, with no media query.",
          "`.fixed` mixes a fixed 200px column with two flexible ones that share the rest.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Named areas",
      example: {
        title: "A page layout with grid-template-areas",
        language: "css",
        code: ".page {\n  display: grid;\n  grid-template-columns: 220px 1fr;\n  grid-template-areas:\n    \"header header\"\n    \"nav    main\"\n    \"footer footer\";\n  min-height: 100vh;\n}\n\n.page > header { grid-area: header; }\n.page > nav { grid-area: nav; }\n.page > main { grid-area: main; }\n.page > footer { grid-area: footer; }",
        walkthrough: [
          "Each quoted string is a row, and each word names one column cell. Repeating a name makes an item span those cells.",
          "`grid-area: header` places an element into the area with that name.",
          "The picture of the layout is visible in the code, which makes it easy to change later.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Placing items and choosing a tool",
      body: [
        "You can place an item by line numbers: `grid-column: 1 / 3` starts at line 1 and ends at line 3, so the item spans two columns. `grid-column: span 2` spans two columns from wherever the item lands.",
        "Items that have no position are placed automatically by the grid. Extra rows are added when there are more items than cells.",
        "Use grid when you think about rows and columns together, such as page layouts and card grids. Use flexbox when you lay out items along one line, such as a toolbar. They combine well: a grid of cards where each card is a flex column.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using percentages for columns and forgetting the gap.",
          fix: "Use fr units so the gap is subtracted automatically.",
        },
        {
          mistake: "Setting grid properties on the items instead of the container.",
          fix: "Define tracks on the container, then use grid-column and grid-area on items.",
        },
        {
          mistake: "Mismatched row lengths in grid-template-areas.",
          fix: "Every row must have the same number of cells, and named areas must form rectangles.",
        },
        {
          mistake: "Using grid when a simple row would do.",
          fix: "Choose flexbox for one-dimensional layouts.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A photo gallery that adapts",
      scenario:
        "A gallery should show as many columns as fit, never narrower than 180 pixels, with even spacing.",
      body: [
        "Use `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` and `gap: 12px`. Resize the window to watch the columns appear and disappear.",
        "Make the images fill their cells with `width: 100%` and `aspect-ratio`, so rows stay tidy.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "fr-unit",
      prompt: "What does 1fr 2fr do?",
      options: [
        "Two columns sharing free space in a 1 to 2 ratio",
        "Two columns of 1 and 2 pixels",
        "Two columns with a 2 pixel gap",
      ],
      answer: 0,
      explanation:
        "The fr unit shares free space in proportion, so the second column gets twice the share of the first.",
    },
    {
      type: "single",
      id: "grid-vs-flex",
      prompt: "Which layout tool works in two dimensions at once?",
      options: ["Grid", "Flexbox", "Neither of them"],
      answer: 0,
      explanation:
        "Grid handles rows and columns together. Flexbox lays out along one axis.",
    },
    {
      type: "blank",
      id: "area-property",
      prompt: "An element is put in a named area with the grid-___ property.",
      answer: "area",
      explanation:
        "`grid-area: name` places the item into the area with that name.",
    },
    {
      type: "truefalse",
      id: "minmax-grow",
      statement: "In minmax(220px, 1fr) a column can grow larger than 220px.",
      answer: true,
      explanation:
        "220px is the minimum. The 1fr maximum lets the column take a share of the free space.",
    },
  ],
  assignment: {
    title: "Two grids on one page",
    task: [
      "Build a page layout with a header, a sidebar, a main area and a footer using grid-template-areas.",
      "Inside the main area, add a gallery of at least six cards that uses repeat(auto-fit, minmax(...)).",
    ],
    checklist: [
      "The page layout uses named areas",
      "The gallery adds and removes columns as the window resizes",
      "Spacing between cards comes from gap",
      "I can explain when to use grid and when to use flexbox",
    ],
    hints: ["Start with the page layout, then fill the main area."],
    minutes: 35,
  },
  exercises: [
    {
      slug: "three-column-grid",
      title: "Three columns",
      task: [
        "Make a grid with three equal columns and a 20px gap. Make the first item span all three columns.",
      ],
      language: "css",
      starter: ".grid {\n  /* your code */\n}\n\n.grid .wide {\n  /* your code */\n}",
      solution:
        ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n\n.grid .wide {\n  grid-column: 1 / -1;\n}",
      hints: ["`1 / -1` runs from the first line to the last line."],
      checklist: [
        "There are three equal columns",
        "There is a 20px gap",
        "The wide item spans every column",
      ],
    },
  ],
  revisionNotes: [
    "display: grid on the container; tracks from grid-template-columns and -rows",
    "fr shares free space; repeat(auto-fit, minmax(min, 1fr)) makes a responsive grid",
    "Place items with grid-column, grid-row or grid-area",
    "Grid for two dimensions, flexbox for one",
  ],
  resources: [
    {
      label: "MDN: Basic concepts of grid layout",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout",
    },
    {
      label: "MDN: grid-template-columns",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns",
    },
    {
      label: "MDN: minmax()",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/minmax",
    },
  ],
})
