import { defineLesson } from "@/data/lessons/author"

export default defineLesson("css", {
  slug: "transitions-and-animations",
  title: "Transitions and animations",
  topic: "Animations",
  minutes: 45,
  overview:
    "Add motion with CSS: transitions between two states, keyframe animations, transforms, and respect for users who prefer reduced motion.",
  objectives: [
    "Write a transition with property, duration, timing function and delay",
    "Define a keyframe animation with @keyframes and the animation properties",
    "Use transform for smooth motion and honour prefers-reduced-motion",
  ],
  prerequisites: ["lesson.css.box-model"],
  sections: [
    {
      kind: "explain",
      heading: "Transitions and animations",
      body: [
        "A **transition** animates the change of a property from one value to another when something changes, for example on `:hover` or when a class is added. You describe the end states in normal rules, and the transition smooths the change.",
        "A **CSS animation** is described by a set of keyframes that give the start and end states of the animation, and optionally waypoints in between. Animations can run without any trigger, and can repeat.",
        "CSS animations need no JavaScript for basic cases, and the browser can often run them efficiently.",
      ],
    },
    {
      kind: "code",
      heading: "A hover transition",
      example: {
        title: "Smoothly change colour and position",
        language: "css",
        code: ".button {\n  background: #2563eb;\n  transform: translateY(0);\n  transition: background 200ms ease, transform 200ms ease;\n}\n\n.button:hover {\n  background: #1d4ed8;\n  transform: translateY(-2px);\n}",
        walkthrough: [
          "The `transition` shorthand lists the property, the duration and the timing function.",
          "Without it, the colour would jump instantly when the pointer arrives.",
          "`ease` starts slowly, speeds up and slows down at the end. Other timing functions include `linear` and `ease-in-out`.",
          "`transform: translateY(-2px)` moves the button slightly without changing the layout of other elements.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Keyframe animations",
      example: {
        title: "A pulsing badge",
        language: "css",
        code: "@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.15); }\n  100% { transform: scale(1); }\n}\n\n.badge {\n  animation: pulse 1.5s ease-in-out infinite;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .badge {\n    animation: none;\n  }\n}",
        walkthrough: [
          "`@keyframes pulse` names the animation and describes the style at 0%, 50% and 100% of its duration.",
          "`animation: pulse 1.5s ease-in-out infinite` runs it for 1.5 seconds per cycle and repeats forever.",
          "The `prefers-reduced-motion: reduce` media query turns the animation off for people who have asked their system for less motion.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Choosing what to animate",
      body: [
        "Animating `transform` and `opacity` is usually smooth because they do not change the layout of the page. Animating `width`, `height` or `margin` makes the browser recalculate the layout and can look jerky.",
        "Keep motion short and purposeful: it should explain a change, not decorate everything. Transitions of 150 to 300 milliseconds usually feel responsive.",
        "Some users get discomfort from motion. Respect the `prefers-reduced-motion` setting by removing or reducing animation for them, especially large or repeating movement.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting transition only on the hover rule.",
          fix: "Put it on the base rule so the change animates in both directions.",
        },
        {
          mistake: "Animating layout properties such as width and margin.",
          fix: "Prefer transform and opacity for motion.",
        },
        {
          mistake: "Forgetting prefers-reduced-motion.",
          fix: "Turn off or reduce animation inside a prefers-reduced-motion: reduce query.",
        },
        {
          mistake: "Endless animation with no purpose.",
          fix: "Animate to show a change, and stop when it has done its job.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A menu that slides in",
      scenario:
        "A side menu should slide in from the left when a class is added, and not jump.",
      body: [
        "Place the menu off-screen with `transform: translateX(-100%)` and add `transition: transform 250ms ease`. When the class `open` is added, set `transform: translateX(0)`.",
        "Because only `transform` changes, the movement is smooth. Add a reduced-motion rule that sets `transition: none` for people who prefer less movement.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "transition-place",
      prompt: "Where should the transition property usually be written for a hover effect?",
      options: [
        "On the base rule of the element",
        "Only on the :hover rule",
        "Inside @keyframes",
      ],
      answer: 0,
      explanation:
        "On the base rule it animates both going into and coming out of the hover state.",
    },
    {
      type: "single",
      id: "smooth-properties",
      prompt: "Which pair of properties is usually the smoothest to animate?",
      options: ["transform and opacity", "width and height", "margin and padding"],
      answer: 0,
      explanation:
        "They do not change the layout, so the browser can animate them efficiently.",
    },
    {
      type: "truefalse",
      id: "reduced-motion",
      statement: "A page should ignore the prefers-reduced-motion setting.",
      answer: false,
      explanation:
        "The setting tells you the user wants less motion. Reduce or remove animation for them.",
    },
    {
      type: "blank",
      id: "keyframes-rule",
      prompt: "A keyframe animation is defined with the @___ at-rule.",
      answer: "keyframes",
      explanation:
        "`@keyframes name { … }` describes the style at points of the animation.",
    },
  ],
  assignment: {
    title: "Micro-interactions",
    task: [
      "Add three small animations to a page: a button hover transition, a loading spinner using @keyframes and a panel that slides open when a class is added.",
      "Add a prefers-reduced-motion rule that reduces them.",
    ],
    checklist: [
      "The hover transition works in both directions",
      "The spinner uses @keyframes and loops",
      "The panel animates transform and not width",
      "The reduced-motion query is present",
    ],
    hints: ["Keep each duration short and test with the system reduced-motion setting switched on."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "fade-in",
      title: "Fade in a message",
      task: [
        "Write a @keyframes rule named fade-in that goes from opacity 0 to 1, apply it to .message for 400ms, and turn it off for reduced motion.",
      ],
      language: "css",
      starter: "/* your keyframes */\n\n.message {\n  /* your animation */\n}",
      solution:
        "@keyframes fade-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.message {\n  animation: fade-in 400ms ease both;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .message {\n    animation: none;\n  }\n}",
      hints: ["`from` and `to` are shorthand for 0% and 100%."],
      checklist: [
        "@keyframes fade-in changes opacity from 0 to 1",
        "The animation lasts 400ms",
        "Reduced motion removes the animation",
      ],
    },
  ],
  revisionNotes: [
    "transition: property duration timing-function delay; put it on the base rule",
    "@keyframes defines the steps; animation applies them",
    "Animate transform and opacity rather than layout properties",
    "Respect prefers-reduced-motion",
  ],
  resources: [
    {
      label: "MDN: Using CSS transitions",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions",
    },
    {
      label: "MDN: Using CSS animations",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations",
    },
    {
      label: "MDN: transform",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    },
  ],
})
