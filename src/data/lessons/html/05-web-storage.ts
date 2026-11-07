import { defineLesson } from "@/data/lessons/author"

export default defineLesson("html", {
  slug: "web-storage",
  title: "Web storage: localStorage and sessionStorage",
  topic: "Web storage",
  minutes: 40,
  overview:
    "Store small key and value pairs in the browser with localStorage and sessionStorage, understand how long each lasts, and know what not to put there.",
  objectives: [
    "Read, write and remove items with the Storage methods",
    "Explain the difference between localStorage, sessionStorage and cookies",
    "Store objects with JSON and know why secrets do not belong in storage",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Two storage areas",
      body: [
        "The Web Storage API lets a page keep key and value pairs in the browser, in a more convenient way than cookies. There are two areas: `localStorage` and `sessionStorage`.",
        "`localStorage` is shared by all documents of the same **origin** and keeps its data even after the browser is closed and reopened. It has no expiration time.",
        "`sessionStorage` is separate for each browser tab and origin, and its data is cleared when the page session ends, which means when the tab is closed.",
        "Both store **strings**. Keys and values are always strings, and numbers are converted automatically.",
      ],
    },
    {
      kind: "code",
      heading: "Using the Storage methods",
      example: {
        title: "Save a preference and read it back",
        language: "javascript",
        code: "localStorage.setItem('theme', 'dark');\n\nconst theme = localStorage.getItem('theme');\nconsole.log(theme);\n\nconst settings = { fontSize: 18, compact: true };\nlocalStorage.setItem('settings', JSON.stringify(settings));\nconst saved = JSON.parse(localStorage.getItem('settings') ?? '{}');\nconsole.log(saved.fontSize);\n\nlocalStorage.removeItem('theme');\nconsole.log(localStorage.getItem('theme'));",
        walkthrough: [
          "`setItem(key, value)` stores a value, and `getItem(key)` returns it, or `null` if the key does not exist.",
          "An object must be turned into a string with `JSON.stringify` before storing, and turned back with `JSON.parse`.",
          "`getItem` can return `null`, so supply a fallback such as `'{}'` before parsing.",
          "`removeItem(key)` deletes one item, and `clear()` deletes everything for the origin.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Storage compared",
      diagram: {
        kind: "table",
        title: "localStorage, sessionStorage and cookies",
        headers: ["", "localStorage", "sessionStorage", "Cookies"],
        rows: [
          ["Lifetime", "No expiration", "Until the tab session ends", "Set by the server or script"],
          ["Scope", "Origin", "Origin and tab", "Per site rules"],
          ["Sent with requests", "No", "No", "Yes, to the matching server"],
          ["Values", "Strings", "Strings", "Strings"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Cautions",
      body: [
        "Storage can be read by any script that runs on the page, so do not keep passwords or other secrets there. Keep sensitive data on the server.",
        "Reading and writing is synchronous, so keep the amount small and avoid storing large values in a loop.",
        "Storage can be missing or throw an error, for example when the browser blocks site data, so wrap access in a try and catch and let the page work without it.",
        "When storage changes in one tab, other tabs of the same origin receive a `storage` event, which you can use to stay in sync.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Storing an object directly.",
          fix: "The object becomes the text '[object Object]'. Use JSON.stringify and JSON.parse.",
        },
        {
          mistake: "Expecting a number back from getItem.",
          fix: "Values are strings. Convert with Number() when you need a number.",
        },
        {
          mistake: "Keeping tokens or passwords in storage.",
          fix: "Any script on the page can read storage, so keep secrets out of it.",
        },
        {
          mistake: "Assuming storage always works.",
          fix: "Handle the case where it is unavailable or throws.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Remembering a theme choice",
      scenario:
        "A site has a light and a dark theme, and the visitor's choice should still apply tomorrow.",
      body: [
        "When the visitor picks a theme, save it with `localStorage.setItem('theme', value)`. On page load, read it with `getItem` and apply it, falling back to the default when the result is `null`.",
        "A preference is a good fit for storage because it is small, not secret and only needed in the browser. A shopping basket that must be shared across devices belongs on the server.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "local-lifetime",
      prompt: "Which storage keeps data after the browser is closed and reopened?",
      options: ["localStorage", "sessionStorage", "Neither"],
      answer: 0,
      explanation:
        "`localStorage` has no expiration time. `sessionStorage` is cleared when the tab session ends.",
    },
    {
      type: "output",
      id: "stored-number",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "localStorage.setItem('n', 5);\nconsole.log(typeof localStorage.getItem('n'));",
      },
      options: ["string", "number", "undefined"],
      answer: 0,
      explanation:
        "Storage keeps strings, so the number 5 comes back as the string '5'.",
    },
    {
      type: "truefalse",
      id: "store-secrets",
      statement: "It is safe to keep a password in localStorage because only your page can read it.",
      answer: false,
      explanation:
        "Any script running on the page can read storage, so secrets do not belong there.",
    },
    {
      type: "blank",
      id: "object-store",
      prompt: "To store an object you first call JSON.___ on it.",
      answer: "stringify",
      explanation:
        "`JSON.stringify` turns the object into a string that storage can hold.",
    },
  ],
  assignment: {
    title: "Remember a to-do list",
    task: [
      "Write a small page where a visitor can add to-do items, and the list is still there after reloading.",
      "Save the list as JSON in localStorage and handle the case where nothing is stored yet.",
    ],
    checklist: [
      "Items are saved with JSON.stringify",
      "The list is loaded with JSON.parse and a fallback",
      "The page works when storage is empty",
      "No secret data is stored",
    ],
    hints: ["Load the list once on page load and save it after each change."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "load-saved-count",
      title: "Visit counter",
      task: [
        "Write `nextCount(stored)` that takes the stored text (a string or null) and returns the next count as a number: 1 when nothing is stored, otherwise the stored number plus one.",
      ],
      language: "javascript",
      starter: "function nextCount(stored) {\n  // your code\n}",
      solution:
        "function nextCount(stored) {\n  if (stored === null) return 1;\n  return Number(stored) + 1;\n}",
      hints: ["Stored values are strings, so convert before adding."],
      checklist: [
        "null gives 1",
        "'4' gives 5",
        "The result is a number, not a string",
      ],
      run: {
        entry: "nextCount",
        cases: [
          { name: "nothing stored", args: [null], expected: 1 },
          { name: "four stored", args: ["4"], expected: 5 },
          { name: "zero stored", args: ["0"], expected: 1 },
        ],
      },
    },
  ],
  revisionNotes: [
    "localStorage: origin-wide, no expiration. sessionStorage: per tab, cleared with the session",
    "Storage holds strings: use JSON.stringify and JSON.parse for objects",
    "Do not store secrets: scripts on the page can read storage",
    "Wrap access in try/catch and have a fallback when storage is empty",
  ],
  resources: [
    {
      label: "MDN: Web Storage API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
    },
    {
      label: "MDN: Using the Web Storage API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API",
    },
    {
      label: "MDN: Window.localStorage",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
    },
  ],
})
