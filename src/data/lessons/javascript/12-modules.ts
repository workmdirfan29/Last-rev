import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "modules",
  title: "ES modules: import and export",
  topic: "Modules",
  minutes: 45,
  overview:
    "Split code into files with import and export, and understand named and default exports, dynamic import and how modules are loaded.",
  objectives: [
    "Write named and default exports and import them",
    "Explain why module code is in strict mode with its own scope",
    "Load code on demand with dynamic import",
  ],
  prerequisites: ["lesson.javascript.es6-syntax-values"],
  sections: [
    {
      kind: "explain",
      heading: "Why modules",
      body: [
        "A **module** is a file with its own scope. Names that you declare in it are not visible outside unless you **export** them, and other files must **import** what they use. This avoids global name clashes and makes dependencies visible.",
        'Module code runs in strict mode, a module is executed **once** even when several files import it, and top-level `this` is `undefined`. In a browser you load a module with `<script type="module" src="app.js">`, and Node treats files as modules when they end in `.mjs` or when `package.json` has `"type": "module"`.',
      ],
    },
    {
      kind: "code",
      heading: "Named and default exports",
      example: {
        title: "Two files",
        language: "javascript",
        code: "// math.js\nexport const PI = 3.14159;\nexport function square(n) {\n  return n * n;\n}\nexport default function cube(n) {\n  return n * n * n;\n}\n\n// app.js\nimport cube, { PI, square as sq } from './math.js';\nimport * as math from './math.js';\nconsole.log(sq(3), cube(2), PI);\nconsole.log(Object.keys(math));",
        walkthrough: [
          "A file can have many **named exports** and one **default export**.",
          "The default export is imported without braces, and it can have any local name.",
          "Named imports use braces and must match the exported names, and `as` renames them.",
          "`import * as math` collects all the exports in one namespace object.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Live bindings and dynamic import",
      body: [
        "An imported name is a **live, read-only view** of the exported variable. The importing file cannot assign to it, but it sees the new value if the exporting module changes it.",
        "`import()` is a function-like expression that loads a module **on demand** and returns a promise: `const mod = await import('./chart.js')`. Use it to load heavy code only when it is needed, which makes the first page load faster. A bundler can split the code at each dynamic import.",
        "Imports are resolved before the code runs, so `import` statements are hoisted to the top, and cannot be inside blocks. Circular imports are possible, but they can give `undefined` values, so avoid them.",
      ],
    },
    {
      kind: "code",
      heading: "Loading on demand",
      example: {
        title: "Dynamic import",
        language: "javascript",
        code: "async function showChart(data) {\n  const { drawChart } = await import('./chart.js');\n  drawChart(data);\n}\n\nbutton.addEventListener('click', () => showChart([1, 2, 3]));",
        walkthrough: [
          "Nothing from `chart.js` is loaded until the first click.",
          "`await import(...)` resolves to the module's namespace, and the destructuring takes `drawChart` from it.",
          "Later clicks reuse the module that is already loaded.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting the file extension in a browser import.",
          fix: "Browsers need the full path, such as `./math.js`.",
        },
        {
          mistake: "Importing a named export without braces.",
          fix: "Use `{ name }`. Only a default export has no braces.",
        },
        {
          mistake: "Creating circular imports between two files.",
          fix: "Move the shared code to a third file.",
        },
        {
          mistake: "Trying to change an imported variable.",
          fix: "Imports are read-only. Export a function that changes the value instead.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Splitting a large script",
      scenario:
        "A 1,500-line `script.js` has helpers, API calls and UI code mixed together.",
      body: [
        "Move the helpers into `utils.js`, the network code into `api.js` and the screen code into `ui.js`, and export only what other files need.",
        "Each file now has one job, and it is clear from the import lines what each one depends on.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "default-import",
      prompt:
        "How do you import a default export called `cube` from './math.js'?",
      options: [
        "import cube from './math.js'",
        "import { cube } from './math.js'",
        "import * cube from './math.js'",
      ],
      answer: 0,
      explanation:
        "A default export is imported without braces, and with any local name.",
    },
    {
      type: "single",
      id: "module-scope",
      prompt:
        "A variable declared at the top of a module file without `export` is...",
      options: [
        "Private to that module",
        "A global variable",
        "Exported automatically",
      ],
      answer: 0,
      explanation:
        "Modules have their own scope. Only exported names are visible to other files.",
    },
    {
      type: "truefalse",
      id: "dynamic-promise",
      statement: "`import('./a.js')` returns a promise.",
      answer: true,
      explanation:
        "Dynamic import loads on demand and resolves to the module namespace object.",
    },
    {
      type: "blank",
      id: "type-module",
      prompt:
        'In an HTML page, a module script needs `<script type="___" src="app.js">`.',
      answer: "module",
      explanation:
        '`type="module"` tells the browser to treat the file as an ES module.',
    },
  ],
  assignment: {
    title: "Split a script into modules",
    task: [
      "Take a small program of about 60 lines with at least three groups of functions.",
      'Move each group into its own file, add the exports and imports, and run it with `type="module"` or in Node with `.mjs` files.',
    ],
    checklist: [
      "Each file has one clear job",
      "No circular imports",
      "The program works the same as before",
    ],
    minutes: 25,
  },
  exercises: [],
  revisionNotes: [
    "`export` makes a name visible, `import` brings it in",
    "One default export per file, many named exports",
    "Modules run once, in strict mode, with their own scope",
    "`import()` loads code on demand and returns a promise",
  ],
  resources: [
    {
      label: "MDN: JavaScript modules",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
    },
    {
      label: "MDN: import",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import",
    },
    {
      label: "MDN: export",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export",
    },
  ],
})
