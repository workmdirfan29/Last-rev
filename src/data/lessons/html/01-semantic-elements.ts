import { defineLesson } from "@/data/lessons/author"

export default defineLesson("html", {
  slug: "semantic-elements",
  title: "Semantic HTML: structure that means something",
  topic: "Semantics",
  minutes: 50,
  overview:
    "Learn why elements carry meaning, how to build a page from header, nav, main, article, section, aside and footer, and when a plain div is still right.",
  objectives: [
    "Explain what semantics means in HTML and why it helps people and software",
    "Choose between header, nav, main, article, section, aside and footer",
    "Use headings in a sensible order and pick button, a and lists for their real jobs",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What semantics means",
      body: [
        "**Semantics** means that an element says what its content is, not only how it looks. A `<nav>` says 'these are navigation links', and a `<button>` says 'this does something when activated'.",
        "Browsers, search tools and assistive technology such as screen readers use that meaning. A screen reader can list the headings or jump to the `<main>` area only if the page uses those elements.",
        "A `<div>` or `<span>` has no meaning. They are fine as generic containers when no better element exists, but they should not be the first choice.",
      ],
    },
    {
      kind: "code",
      heading: "A page built from landmarks",
      intro: "This is the usual outline of a page.",
      example: {
        title: "Page structure with semantic elements",
        language: "html",
        code: '<body>\n  <header>\n    <h1>Garden notes</h1>\n    <nav>\n      <a href="/">Home</a>\n      <a href="/plants">Plants</a>\n    </nav>\n  </header>\n  <main>\n    <article>\n      <h2>Growing tomatoes</h2>\n      <p>Tomatoes like sun.</p>\n    </article>\n    <aside>\n      <h2>Related</h2>\n    </aside>\n  </main>\n  <footer>\n    <p>Contact the author</p>\n  </footer>\n</body>',
        walkthrough: [
          "`<header>` holds introductory content for the page or for a section, such as the title and the navigation.",
          "`<nav>` marks a block of links used to move around the site.",
          "`<main>` holds the central content of the page. A page should have only one visible `<main>`.",
          "`<article>` is self-contained content that makes sense on its own, such as a post. `<aside>` holds related content that is not central.",
          "`<footer>` holds closing information for the page or section.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "article, section and div",
      body: [
        "Use `<article>` for a complete, independent item: a blog post, a product card or a comment. Use `<section>` for a themed group of content that normally has its own heading. Use `<div>` when you only need a box for styling and no other element fits.",
        "Headings give the page an outline. Use one `<h1>` for the main title and then `<h2>` to `<h6>` in order, without skipping levels just to get a different size. Change the size with CSS.",
        "Choose elements for their job: `<a href>` for going to another place, `<button>` for performing an action, `<ul>` or `<ol>` for lists, and `<table>` for tabular data. These elements bring keyboard support and meaning for free.",
      ],
    },
    {
      kind: "diagram",
      heading: "Which element for which content",
      diagram: {
        kind: "table",
        title: "Choosing the element",
        headers: ["Content", "Element"],
        rows: [
          ["Group of site links", "`<nav>`"],
          ["Self-contained post or card", "`<article>`"],
          ["Themed group with a heading", "`<section>`"],
          ["Side information", "`<aside>`"],
          ["Image with a caption", "`<figure>` and `<figcaption>`"],
          ["A date or time", "`<time datetime>`"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Building everything from div elements.",
          fix: "Use the element that matches the content, and keep div for generic wrappers.",
        },
        {
          mistake: "Choosing a heading level for its size.",
          fix: "Choose by the outline of the page, then style the size with CSS.",
        },
        {
          mistake: "Making a clickable div instead of a button.",
          fix: "Use `<button>`, which is focusable and works with the keyboard by default.",
        },
        {
          mistake: "Putting more than one visible `<main>` on a page.",
          fix: "Keep a single `<main>` for the unique content of the page.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Tidying up a div-only page",
      scenario:
        "A page uses divs with class names such as top, menu and bottom, and a screen reader user cannot jump between its areas.",
      body: [
        "Replace the divs with `<header>`, `<nav>`, `<main>` and `<footer>`. The visible design does not change, but the page now has landmarks that assistive technology can list and jump to.",
        "Then check the headings: one `<h1>`, then `<h2>` for each major block. The result is a page that is easier to navigate and to maintain.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "which-for-links",
      prompt: "Which element marks a block of links for moving around the site?",
      options: ["<nav>", "<aside>", "<section>", "<footer>"],
      answer: 0,
      explanation:
        "`<nav>` is for major navigation links. It becomes a landmark that assistive technology can find.",
    },
    {
      type: "truefalse",
      id: "div-has-meaning",
      statement: "A `<div>` tells assistive technology what kind of content it holds.",
      answer: false,
      explanation:
        "A div has no meaning of its own. It is a generic container.",
    },
    {
      type: "single",
      id: "action-element",
      prompt: "Which element should you use for something that performs an action when activated?",
      options: ["<button>", "<div>", "<span>"],
      answer: 0,
      explanation:
        "`<button>` is focusable, works with Enter and Space, and is announced as a button.",
    },
    {
      type: "blank",
      id: "main-count",
      prompt: "A page should have only one visible ___ element.",
      answer: "main",
      accepted: ["<main>"],
      explanation:
        "The `<main>` element holds the unique central content, so a page should not show more than one.",
    },
  ],
  assignment: {
    title: "Mark up a recipe page",
    task: [
      "Write an HTML page for a recipe with a title, a site menu, the recipe itself, a related-links area and a footer.",
      "Use semantic elements for each area and a sensible heading order.",
    ],
    checklist: [
      "There is one `<h1>` and the other headings follow in order",
      "header, nav, main and footer are used for their areas",
      "The recipe is inside an `<article>`",
      "There is no clickable div where a button or link belongs",
    ],
    hints: ["Start by listing the areas of the page, then pick an element for each."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "replace-divs",
      title: "Replace the divs",
      task: [
        "Rewrite the markup below with semantic elements so that it keeps the same content and structure.",
      ],
      language: "html",
      starter:
        '<div class="top">\n  <div class="title">My blog</div>\n  <div class="menu"><a href="/">Home</a></div>\n</div>\n<div class="content">\n  <div class="post">\n    <div class="post-title">First post</div>\n  </div>\n</div>\n<div class="bottom">Thanks for reading</div>',
      solution:
        '<header>\n  <h1>My blog</h1>\n  <nav><a href="/">Home</a></nav>\n</header>\n<main>\n  <article>\n    <h2>First post</h2>\n  </article>\n</main>\n<footer>Thanks for reading</footer>',
      hints: ["Which element holds the site title and menu at the top?"],
      checklist: [
        "The top area uses a header with the menu in a nav",
        "The content sits in main and the post in an article",
        "The title and post title use headings",
      ],
    },
  ],
  revisionNotes: [
    "Semantics = the element says what the content is",
    "header, nav, main, article, section, aside, footer give a page its landmarks",
    "Headings give the outline: one h1, then h2 to h6 in order",
    "button for actions, a for navigation, div only as a generic wrapper",
  ],
  resources: [
    {
      label: "MDN: Semantics",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics",
    },
    {
      label: "MDN: The main element",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main",
    },
    {
      label: "MDN: Heading elements",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements",
    },
  ],
})
