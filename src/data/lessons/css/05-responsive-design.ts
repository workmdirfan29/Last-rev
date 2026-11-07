import { defineLesson } from "@/data/lessons/author"

export default defineLesson("css", {
  slug: "responsive-design",
  title: "Responsive design: viewport, media queries and fluid sizing",
  topic: "Responsive design",
  minutes: 75,
  overview:
    "Make a page work on any screen size: set the viewport, use relative units, write media queries and container queries, and size things fluidly with clamp() and flexible layouts.",
  objectives: [
    "Set the viewport meta tag and explain why mobile-first CSS is useful",
    "Write media queries with min-width and use container queries for components",
    "Use relative units, max-width, clamp() and flexible images so layouts adapt without breaking",
  ],
  prerequisites: ["lesson.css.flexbox", "lesson.css.grid"],
  sections: [
    {
      kind: "explain",
      heading: "What responsive means",
      body: [
        "A responsive page adapts to the width of the screen instead of having a different site for each device. It rests on three things: a flexible layout, flexible media and **media queries** that change the design at chosen widths.",
        "First tell mobile browsers to use the real device width. Without the viewport meta tag, a phone may lay out the page as if the screen were much wider and then shrink it.",
        "Work **mobile-first**: write the styles for small screens as the base, then add `min-width` media queries that improve the layout as space grows. Base styles stay simple and each query adds only what changes.",
      ],
    },
    {
      kind: "code",
      heading: "The viewport and a media query",
      example: {
        title: "Mobile-first layout",
        language: "html",
        code: '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n<style>\n  .layout { display: grid; gap: 16px; }\n  img { max-width: 100%; height: auto; }\n\n  @media (min-width: 40em) {\n    .layout { grid-template-columns: 1fr 2fr; }\n  }\n</style>',
        walkthrough: [
          "`width=device-width` sets the width of the layout viewport to the width of the device screen.",
          "The base style is a single column with a gap, which suits a narrow screen.",
          "`img { max-width: 100%; height: auto }` stops images from being wider than their container and keeps their proportions.",
          "The media query `(min-width: 40em)` applies the two-column grid only when the viewport is at least 40em wide.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Fluid sizing",
      body: [
        "Prefer relative units for sizes that should scale: `rem` for font sizes and spacing, `%` and `fr` for widths, `vw` and `vh` for viewport-relative sizes. Use `max-width` instead of a fixed `width` for content columns, so they can shrink.",
        "`clamp(min, preferred, max)` picks a value that grows with the viewport but stays between a minimum and a maximum. For example `font-size: clamp(1rem, 2.5vw, 2rem)` gives readable text on both phones and wide screens.",
        "Choose breakpoints where your **content** starts to look wrong, not at the width of particular devices. Media queries can also test preferences, such as `prefers-reduced-motion` and `prefers-color-scheme`.",
      ],
    },
    {
      kind: "code",
      heading: "Container queries",
      intro: "A component can adapt to the space its container gives it.",
      example: {
        title: "A card that changes with its container",
        language: "css",
        code: ".card-wrap {\n  container-type: inline-size;\n}\n\n.card {\n  display: block;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    gap: 16px;\n  }\n}",
        walkthrough: [
          "`container-type: inline-size` makes `.card-wrap` a query container based on its inline (width) dimension.",
          "`@container (min-width: 400px)` applies when the container, not the viewport, is at least 400 pixels wide.",
          "The same card now lays out as a row in a wide main area and stays stacked in a narrow sidebar.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Leaving out the viewport meta tag.",
          fix: "Add width=device-width, initial-scale=1 to the head of every page.",
        },
        {
          mistake: "Fixing widths in pixels for text columns.",
          fix: "Use max-width and relative units so content can shrink.",
        },
        {
          mistake: "Choosing breakpoints for specific phones.",
          fix: "Add a breakpoint where your layout begins to break.",
        },
        {
          mistake: "Writing desktop styles first and overriding them for mobile.",
          fix: "Start from the small-screen layout and add min-width queries.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Making a blog page responsive",
      scenario:
        "A blog page has a main column and a sidebar that look right on a desktop but overflow on a phone.",
      body: [
        "Start with one column: main content first, sidebar below. Add `max-width: 100%` to images and use `rem` for text sizes.",
        "Then add a `min-width` media query at the width where there is room for two columns, and give the grid `1fr 300px`. Test by resizing the window and by using the device mode of the browser developer tools.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "mobile-first-query",
      prompt: "In mobile-first CSS, which kind of media query is normally used to add styles for larger screens?",
      options: ["min-width", "max-width", "orientation"],
      answer: 0,
      explanation:
        "Base styles suit small screens, and min-width queries add changes as the viewport grows.",
    },
    {
      type: "truefalse",
      id: "viewport-tag",
      statement: "Without the viewport meta tag, a mobile browser may lay the page out at a much wider width.",
      answer: true,
      explanation:
        "The viewport meta tag makes the layout width follow the device width.",
    },
    {
      type: "single",
      id: "clamp-meaning",
      prompt: "What does clamp(1rem, 2.5vw, 2rem) do?",
      options: [
        "Grows with the viewport but stays between 1rem and 2rem",
        "Always equals 2.5vw",
        "Always equals 1rem",
      ],
      answer: 0,
      explanation:
        "`clamp(min, preferred, max)` uses the preferred value, limited by the minimum and maximum.",
    },
    {
      type: "blank",
      id: "container-type",
      prompt: "An element becomes a size query container when you set container-___ on it.",
      answer: "type",
      explanation:
        "`container-type: inline-size` declares a containment context for container queries.",
    },
  ],
  assignment: {
    title: "Responsive landing page",
    task: [
      "Build a landing page with a header, a hero, a three-card section and a footer that works from a narrow phone width to a wide desktop.",
      "Use mobile-first CSS, at least one media query, a fluid font size with clamp() and images that never overflow.",
    ],
    checklist: [
      "The viewport meta tag is present",
      "The base layout works at a narrow width",
      "A min-width query improves the layout on wide screens",
      "Images use max-width: 100%",
      "I tested at several widths in the developer tools",
    ],
    hints: ["Resize slowly and add a breakpoint where it first looks cramped."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "two-columns-from-medium",
      title: "Two columns from a medium width",
      task: [
        "The layout should be one column by default and two equal columns when the viewport is at least 48em wide. Complete the CSS.",
      ],
      language: "css",
      starter: ".page {\n  display: grid;\n  gap: 16px;\n}\n\n/* your media query */",
      solution:
        ".page {\n  display: grid;\n  gap: 16px;\n}\n\n@media (min-width: 48em) {\n  .page {\n    grid-template-columns: 1fr 1fr;\n  }\n}",
      hints: ["Use a min-width media query and change grid-template-columns inside it."],
      checklist: [
        "The default layout is a single column",
        "A min-width query at 48em is used",
        "Two equal columns appear inside the query",
      ],
    },
  ],
  revisionNotes: [
    "Viewport meta: width=device-width, initial-scale=1",
    "Mobile-first: base styles for small screens, min-width queries for more room",
    "Use relative units, max-width, clamp() and max-width: 100% on images",
    "Container queries respond to the container's size, not the viewport",
  ],
  resources: [
    {
      label: "MDN: Using media queries",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries",
    },
    {
      label: "MDN: Viewport meta element",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element",
    },
    {
      label: "MDN: clamp()",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp",
    },
    {
      label: "MDN: Container queries",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    },
  ],
})
