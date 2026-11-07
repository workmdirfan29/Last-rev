import { defineLesson } from "@/data/lessons/author"

export default defineLesson("css", {
  slug: "box-model",
  title: "The box model: content, padding, border and margin",
  topic: "Box model",
  minutes: 45,
  overview:
    "Every element is a box. Learn its four layers, how width is calculated with box-sizing, and how margins behave between elements.",
  objectives: [
    "Name the four layers of the CSS box and what each one is for",
    "Explain content-box and border-box and choose between them",
    "Use margin, padding and border shorthand, and know that vertical margins can collapse",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Every element is a box",
      body: [
        "The browser lays out each element as a rectangular box with four layers, from the inside out: the **content**, the **padding** around it, the **border** around the padding, and the **margin** outside the border.",
        "Padding is space inside the border and shows the element's background. Margin is space outside the border and is always transparent. A border is a line drawn between them.",
        "In the browser developer tools you can inspect any element and see these layers drawn as coloured areas. That picture is the quickest way to understand a spacing problem.",
      ],
    },
    {
      kind: "code",
      heading: "Setting the layers",
      example: {
        title: "A card with padding, border and margin",
        language: "css",
        code: ".card {\n  width: 300px;\n  padding: 16px;\n  border: 2px solid #888;\n  margin: 24px auto;\n}\n\n.tight {\n  padding: 8px 16px;\n  margin: 0 0 12px;\n}",
        walkthrough: [
          "`padding: 16px` adds 16 pixels of space on all four sides inside the border.",
          "`border: 2px solid #888` is shorthand for the border width, style and colour.",
          "`margin: 24px auto` sets 24 pixels above and below, and `auto` on the left and right, which centres a block that has a width.",
          "Two values mean vertical then horizontal. Four values go clockwise from the top: top, right, bottom, left.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "How wide is it? box-sizing",
      body: [
        "By default `box-sizing` is `content-box`, so `width` and `height` set the size of the **content** only. Padding and border are added on top, and an element with `width: 300px`, `padding: 16px` and a 2px border takes 336px in total.",
        "With `box-sizing: border-box`, the width includes the content, padding and border. The same element then takes exactly 300px, which makes layouts much easier to predict.",
        "Many projects set `border-box` for every element with a rule such as `*, *::before, *::after { box-sizing: border-box; }`.",
      ],
    },
    {
      kind: "code",
      heading: "content-box versus border-box",
      example: {
        title: "The same numbers, different widths",
        language: "css",
        code: ".a {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}\n\n.b {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}",
        walkthrough: [
          "`.a` has 200px of content, plus 40px of padding and 10px of border, so it is 250px wide on screen.",
          "`.b` is 200px wide in total, and its content shrinks to 150px to make room.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Margin behaviour",
      body: [
        "Vertical margins of neighbouring block elements can **collapse**: when one block's bottom margin touches the next block's top margin, they combine into one space equal to the larger of the two, instead of adding up.",
        "Horizontal margins never collapse. Margins in flex and grid containers do not collapse between items either.",
        "Negative margins are allowed and pull an element towards its neighbour, but use them rarely.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Setting width: 100% together with padding on a content-box element.",
          fix: "The padding is added to the width and causes overflow. Use box-sizing: border-box.",
        },
        {
          mistake: "Adding both bottom margin and top margin and expecting the sum.",
          fix: "Vertical margins between blocks can collapse to the larger value.",
        },
        {
          mistake: "Using margin to make space inside a coloured box.",
          fix: "Use padding for space inside, and margin for space outside.",
        },
        {
          mistake: "Not looking at the developer tools.",
          fix: "Inspect the element and read the box diagram before changing numbers.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Making a button with comfortable spacing",
      scenario:
        "A button's text touches its border, and two buttons side by side touch each other.",
      body: [
        "Add `padding: 8px 16px` to give the text room inside, and `margin-right: 8px` to space the buttons apart. Padding is part of the button's clickable area, so it also makes the button easier to press.",
        "Set `box-sizing: border-box` so that a width you give the button includes its padding and border.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "layer-order",
      prompt: "Which order lists the box layers from the inside out?",
      options: [
        "content, padding, border, margin",
        "content, margin, border, padding",
        "padding, content, border, margin",
      ],
      answer: 0,
      explanation:
        "Content is inside, then padding, then the border, then the margin outside.",
    },
    {
      type: "single",
      id: "border-box-width",
      prompt: "With box-sizing: border-box, width: 200px and padding: 20px, how wide is the element in total (ignoring any border)?",
      options: ["200px", "240px", "220px"],
      answer: 0,
      explanation:
        "With border-box the width includes padding and border, so the total stays 200px.",
    },
    {
      type: "truefalse",
      id: "horizontal-margins-collapse",
      statement: "Horizontal margins between block elements collapse like vertical ones.",
      answer: false,
      explanation:
        "Only vertical margins collapse. Horizontal margins do not.",
    },
    {
      type: "blank",
      id: "inside-space",
      prompt: "The space between the content and the border is called ___.",
      answer: "padding",
      explanation:
        "Padding is inside the border. Margin is outside it.",
    },
  ],
  assignment: {
    title: "Spacing study",
    task: [
      "Make a small page with three boxes in a column. Give them different padding, borders and margins.",
      "Switch box-sizing between content-box and border-box and note how the widths change in the developer tools.",
    ],
    checklist: [
      "I used padding, border and margin on at least one box",
      "I saw the margin collapse between two stacked blocks",
      "I set border-box for all elements with one rule",
      "I can explain the total width of a box in each mode",
    ],
    hints: ["Give each box a background colour so the padding is easy to see."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "fix-the-overflow",
      title: "Fix the overflow",
      task: [
        "This box is 100% wide but sticks out of its container because of padding and border. Fix it with one change that also works for every element.",
      ],
      language: "css",
      starter: ".box {\n  width: 100%;\n  padding: 20px;\n  border: 4px solid #333;\n}",
      solution:
        "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.box {\n  width: 100%;\n  padding: 20px;\n  border: 4px solid #333;\n}",
      hints: ["Which box-sizing value includes padding and border in the width?"],
      checklist: [
        "box-sizing is set to border-box",
        "The rule applies to all elements",
        "The box now fits its container",
      ],
    },
  ],
  revisionNotes: [
    "Box layers from inside: content, padding, border, margin",
    "content-box: width is content only. border-box: width includes padding and border",
    "Margin shorthand: two values = vertical, horizontal; four = top, right, bottom, left",
    "Vertical margins can collapse; horizontal ones do not",
  ],
  resources: [
    {
      label: "MDN: The box model",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model",
    },
    {
      label: "MDN: box-sizing",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing",
    },
    {
      label: "MDN: margin",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin",
    },
  ],
})
