import { defineLesson } from "@/data/lessons/author"

export default defineLesson("html", {
  slug: "accessible-html",
  title: "Accessibility: native elements, labels, focus and ARIA",
  topic: "Accessibility",
  minutes: 70,
  overview:
    "Make a page usable with a keyboard and a screen reader: choose native elements first, write useful text alternatives, manage focus and use ARIA only when HTML is not enough.",
  objectives: [
    "Explain why native HTML elements are the first tool for accessibility",
    "Write alt text, labels and link text that make sense out of context",
    "Use tabindex, aria-label and aria-labelledby correctly, and know the first rule of ARIA",
  ],
  prerequisites: ["lesson.html.semantic-elements", "lesson.html.forms-and-validation"],
  sections: [
    {
      kind: "explain",
      heading: "Who accessibility is for",
      body: [
        "Accessible pages work for people who use a keyboard instead of a mouse, a screen reader, zoom, captions or voice control. It also helps everyone in difficult conditions, such as bright light or a broken mouse.",
        "The most reliable approach is to use **native elements**. A `<button>` is focusable, works with Enter and Space and is announced as a button. A `<div>` with a click handler has none of that unless you add it yourself.",
        "The first rule of ARIA says: if you can use a native HTML element or attribute with the semantics and behaviour you need, use it instead of adding ARIA.",
      ],
    },
    {
      kind: "code",
      heading: "Text alternatives and names",
      example: {
        title: "alt text, labels and link text",
        language: "html",
        code: '<img src="chart.png" alt="Sales rose each month from January to June">\n<img src="divider.png" alt="">\n\n<a href="/report.pdf">Read the 2025 sales report</a>\n\n<label for="q">Search</label>\n<input id="q" name="q" type="search">\n\n<button aria-label="Close dialog">×</button>',
        walkthrough: [
          "`alt` describes what the image tells the reader. A purely decorative image gets an empty `alt=\"\"` so a screen reader skips it.",
          "Link text should make sense on its own. 'Read the 2025 sales report' is better than 'click here'.",
          "The input has a visible label connected to it, so it has an accessible name.",
          "The close button shows only a symbol, so `aria-label` gives it a name that a screen reader can announce.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Keyboard and focus",
      body: [
        "Everything that can be done with a mouse must be possible with the keyboard. Native links, buttons and form controls are in the tab order already.",
        "`tabindex=\"0\"` adds an element to the tab order in document order. `tabindex=\"-1\"` makes it focusable by script but not by tabbing. Avoid positive values such as `tabindex=\"4\"`, because they create a separate order that is hard to maintain.",
        "Never remove the focus outline without giving a clear replacement. Users need to see where they are.",
      ],
    },
    {
      kind: "explain",
      heading: "ARIA when HTML is not enough",
      body: [
        "ARIA attributes change what assistive technology is told. They do not change behaviour: adding `role=\"button\"` to a div does not make it respond to the keyboard.",
        "`aria-label` gives an element an accessible name from a string. `aria-labelledby` takes the id of another element and uses its text as the name. `aria-hidden=\"true\"` hides content from assistive technology, so never put it on something a user needs.",
        "Page areas are announced as landmarks when you use `<header>`, `<nav>`, `<main>` and `<footer>`. If there are several `<nav>` regions, give each a distinct label.",
      ],
    },
    {
      kind: "diagram",
      heading: "Choosing a name",
      diagram: {
        kind: "flow",
        title: "How to give a control an accessible name",
        steps: [
          { label: "Is there a native element?", detail: "Use it first." },
          { label: "Is there visible text?", detail: "Connect it with label for, or wrap the control." },
          { label: "Is the text elsewhere on the page?", detail: "Use aria-labelledby with that element's id." },
          { label: "Is there no visible text?", detail: "Use aria-label with a short string." },
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Leaving out alt on images, or writing 'image of'.",
          fix: "Describe what the image conveys, and use alt=\"\" for decoration.",
        },
        {
          mistake: "Building a button from a div and adding role=\"button\" only.",
          fix: "Use a real `<button>`. A role does not add keyboard behaviour.",
        },
        {
          mistake: "Using colour alone to show an error.",
          fix: "Add text or an icon as well, and keep enough contrast.",
        },
        {
          mistake: "Hiding focus outlines.",
          fix: "Keep a visible focus style on every interactive element.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Checking a page by keyboard",
      scenario:
        "You finish a page and want a quick accessibility check before showing it to anyone.",
      body: [
        "Put the mouse aside and press Tab. Can you reach every link and control in a sensible order, and always see where you are? Can you operate each one with Enter or Space?",
        "Then check the text: does every image have a suitable alt, does every field have a label, and is text contrast sufficient? WCAG success criterion 1.4.3 asks for a contrast ratio of at least 4.5:1 for normal text.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "decorative-alt",
      prompt: "What alt value should a purely decorative image have?",
      options: ["An empty string", "The word 'image'", "The file name"],
      answer: 0,
      explanation:
        "An empty `alt` tells assistive technology to skip the image.",
    },
    {
      type: "truefalse",
      id: "role-adds-behaviour",
      statement: "Adding `role=\"button\"` to a div makes it respond to the keyboard.",
      answer: false,
      explanation:
        "ARIA changes how an element is described, not how it behaves. A real button already has keyboard support.",
    },
    {
      type: "single",
      id: "positive-tabindex",
      prompt: "Which tabindex value should you generally avoid?",
      options: ["A positive number such as 4", "0", "-1"],
      answer: 0,
      explanation:
        "Positive values create a separate focus order that is hard to keep correct. Use 0 or -1.",
    },
    {
      type: "blank",
      id: "aria-name",
      prompt: "An icon-only button can be given a name with the ___ attribute.",
      answer: "aria-label",
      explanation:
        "`aria-label` supplies an accessible name from a string when there is no visible text.",
    },
    {
      type: "multi",
      id: "native-benefits",
      prompt: "Which of these does a native button give you?",
      options: [
        "Focus with the Tab key",
        "Activation with Enter and Space",
        "Announcement as a button",
        "Automatic colour contrast",
      ],
      answers: [0, 1, 2],
      explanation:
        "Native buttons bring focus, keyboard activation and the right role. Contrast is up to your CSS.",
    },
  ],
  assignment: {
    title: "Audit and fix a page",
    task: [
      "Take a page of your own, or write a short one with an image, a form, a menu and an icon button.",
      "Check it using only the keyboard, then fix every problem you find.",
    ],
    checklist: [
      "I can reach and use every control with the keyboard",
      "Every image has suitable alt text, or an empty alt when decorative",
      "Every form field has a label",
      "The icon button has an accessible name",
    ],
    hints: ["Make a list of problems first, then fix them one at a time."],
    minutes: 35,
  },
  exercises: [
    {
      slug: "name-the-controls",
      title: "Name the controls",
      task: [
        "Fix the markup so that every control has an accessible name and the clickable div becomes a real button.",
      ],
      language: "html",
      starter:
        '<img src="logo.png">\n<div class="btn" onclick="save()">Save</div>\n<input type="text" name="city">\n<button>✕</button>',
      solution:
        '<img src="logo.png" alt="Garden notes logo">\n<button type="button" onclick="save()">Save</button>\n<label for="city">City</label>\n<input id="city" type="text" name="city">\n<button type="button" aria-label="Close">✕</button>',
      hints: ["Which of these four needs a visible label, and which only needs aria-label?"],
      checklist: [
        "The image has a useful alt",
        "The save control is a real button",
        "The input has a connected label",
        "The icon button has aria-label",
      ],
    },
  ],
  revisionNotes: [
    "Native elements first: they bring focus, keyboard use and roles",
    "alt describes meaning; alt=\"\" for decoration; label every field",
    "tabindex 0 or -1 only; keep a visible focus style",
    "ARIA changes the description, not the behaviour; first rule: prefer native HTML",
  ],
  resources: [
    {
      label: "MDN: Accessibility",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
    },
    {
      label: "MDN: ARIA",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA",
    },
    {
      label: "MDN: tabindex",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex",
    },
    {
      label: "W3C: Understanding Contrast (Minimum)",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
    },
  ],
})
