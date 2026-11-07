import { defineLesson } from "@/data/lessons/author"

export default defineLesson("html", {
  slug: "seo-basics",
  title: "SEO basics: title, description, headings and links",
  topic: "SEO basics",
  minutes: 40,
  overview:
    "Learn the parts of an HTML page that tell search engines and people what the page is about: title, meta description, headings, link text, canonical links and the lang attribute.",
  objectives: [
    "Write a clear title and meta description for a page",
    "Structure content with headings and descriptive links",
    "Use a canonical link, the lang attribute and a robots meta tag correctly",
  ],
  prerequisites: ["lesson.html.semantic-elements"],
  sections: [
    {
      kind: "explain",
      heading: "What SEO is",
      body: [
        "SEO, search engine optimisation, is the practice of making a site easier for search engines to understand and for people to find. Most of the basics are good HTML: clear structure, useful text and working links.",
        "No markup guarantees a position in search results. What you control is how clearly the page describes itself, so a person can decide whether it answers their question.",
      ],
    },
    {
      kind: "code",
      heading: "The head of a page",
      example: {
        title: "Metadata that describes the page",
        language: "html",
        code: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Growing tomatoes at home | Garden notes</title>\n    <meta name="description" content="Simple steps for growing tomatoes in pots, from seeds to the first harvest.">\n    <link rel="canonical" href="https://example.com/tomatoes">\n  </head>\n  <body>…</body>\n</html>',
        walkthrough: [
          "`lang=\"en\"` on the html element states the language of the page, which helps browsers and tools.",
          "`<title>` names the page in the browser tab, in bookmarks and usually in search results. Make it specific and different on every page.",
          "`<meta name=\"description\">` gives a short summary of the page. Search tools may show it, so write it for people.",
          "`<link rel=\"canonical\">` names the preferred address of the page when the same content is available at more than one URL.",
          "The viewport meta tag makes the page work properly on small screens.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Content that explains itself",
      body: [
        "Use one `<h1>` that matches the topic, then `<h2>` and `<h3>` to organise sections. The headings should read like an outline of the page.",
        "Write link text that describes the destination, such as 'planting calendar', and avoid 'click here'. This helps people who scan links and search tools that read them.",
        "Give images a meaningful `alt` text, use real text for important content and keep URLs short and readable.",
        "A robots meta tag such as `<meta name=\"robots\" content=\"noindex\">` asks search tools not to index a page. Use it only for pages you do not want found.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "The same title on every page.",
          fix: "Write a unique, specific title for each page.",
        },
        {
          mistake: "No meta description, or a description stuffed with keywords.",
          fix: "Write one or two clear sentences that summarise the page for a reader.",
        },
        {
          mistake: "Choosing headings for their size.",
          fix: "Use heading levels for the outline and style them with CSS.",
        },
        {
          mistake: "Link text such as 'here' or 'read more' alone.",
          fix: "Put the topic in the link text.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Preparing a blog post page",
      scenario:
        "You are publishing a post and want the page to describe itself well.",
      body: [
        "Write a title that names the topic and the site, a description of one or two sentences, one `<h1>` with the post title and `<h2>` headings for the sections.",
        "If the post can also be reached under another URL, add a canonical link to the preferred one. Check that all images have alt text and all links have meaningful text.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "title-element",
      prompt: "Where is the page title shown, apart from search results?",
      options: ["In the browser tab", "As the first paragraph", "In the footer"],
      answer: 0,
      explanation:
        "The `<title>` names the page in the tab and in bookmarks.",
    },
    {
      type: "truefalse",
      id: "meta-guarantee",
      statement: "A meta description guarantees the page ranks first in search results.",
      answer: false,
      explanation:
        "No markup guarantees a position. A description helps people judge the page.",
    },
    {
      type: "blank",
      id: "canonical-rel",
      prompt: "A link with rel=\"___\" names the preferred URL of a page.",
      answer: "canonical",
      explanation:
        "`rel=\"canonical\"` points to the preferred address when content is reachable at several.",
    },
    {
      type: "single",
      id: "good-link-text",
      prompt: "Which link text is best?",
      options: ["Planting calendar for tomatoes", "Click here", "Read more"],
      answer: 0,
      explanation:
        "Descriptive link text makes sense out of context for readers and tools.",
    },
  ],
  assignment: {
    title: "Describe three pages",
    task: [
      "Write the head section for three pages of a small site: home, an article and a contact page.",
      "Give each a unique title and description, and add lang and viewport.",
    ],
    checklist: [
      "Each page has a unique, specific title",
      "Each page has a description of one or two sentences",
      "The html element has a lang attribute",
      "At least one page uses a canonical link",
    ],
    hints: ["Read each title aloud: would it still make sense in a list of search results?"],
    minutes: 20,
  },
  exercises: [
    {
      slug: "improve-the-head",
      title: "Improve the head",
      task: [
        "Improve this head so it describes the page: give it a title, a description, a language and a viewport.",
      ],
      language: "html",
      starter:
        "<!doctype html>\n<html>\n  <head>\n    <title>Page</title>\n  </head>\n  <body></body>\n</html>",
      solution:
        '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Pot gardening for beginners | Garden notes</title>\n    <meta name="description" content="How to start a small pot garden with a few easy plants.">\n  </head>\n  <body></body>\n</html>',
      hints: ["The viewport tag helps small screens."],
      checklist: [
        "The title is specific",
        "A meta description is present",
        "lang is set on html",
        "A viewport meta tag is present",
      ],
    },
  ],
  revisionNotes: [
    "SEO basics are good HTML: title, description, headings, links, alt text",
    "Unique title and description for every page",
    "lang on html, viewport meta, canonical link for duplicate URLs",
    "noindex asks tools not to index a page; use it deliberately",
  ],
  resources: [
    {
      label: "MDN: The meta element",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta",
    },
    {
      label: "MDN: The title element",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title",
    },
    {
      label: "MDN: Link types (rel)",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel",
    },
  ],
})
