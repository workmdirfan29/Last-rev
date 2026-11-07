import { defineLesson } from "@/data/lessons/author"

export default defineLesson("nodejs", {
  slug: "modules",
  title: "Modules: CommonJS and ES modules",
  topic: "Modules",
  minutes: 60,
  overview:
    "Learn how Node.js loads code: CommonJS with require and module.exports, ES modules with import and export, how Node decides which one a file is, and how they differ.",
  objectives: [
    "Write and import modules in both CommonJS and ES module syntax",
    "Explain how Node.js decides whether a file is CommonJS or an ES module",
    "Name the main differences, such as __dirname, file extensions and the module cache",
  ],
  prerequisites: ["javascript"],
  sections: [
    {
      kind: "explain",
      heading: "Two module systems",
      body: [
        "Node.js has two systems. **CommonJS** is the original one: a file uses `require()` to load other modules and sets `module.exports` to share values. **ES modules** (ESM) are the standard JavaScript system, using `import` and `export`.",
        "Node.js treats a `.cjs` file as CommonJS and a `.mjs` file as an ES module. For `.js` files it looks at the nearest `package.json`: `\"type\": \"module\"` makes them ES modules, and `\"type\": \"commonjs\"`, or no setting, makes them CommonJS.",
        "Built-in modules can be loaded with the `node:` prefix, such as `node:fs`, which makes clear they are not packages from npm.",
      ],
    },
    {
      kind: "code",
      heading: "The same module in both styles",
      example: {
        title: "CommonJS and ESM",
        language: "javascript",
        code: "// math.cjs\nfunction add(a, b) {\n  return a + b;\n}\nmodule.exports = { add };\n\n// main.cjs\nconst { add } = require('./math.cjs');\nconsole.log(add(2, 3));\n\n// math.mjs\nexport function add(a, b) {\n  return a + b;\n}\n\n// main.mjs\nimport { add } from './math.mjs';\nimport { readFile } from 'node:fs/promises';\nconsole.log(add(2, 3));",
        walkthrough: [
          "In CommonJS, `module.exports` is the value that `require` returns. The call runs synchronously.",
          "In an ES module, `export` marks what is shared and `import` brings it in. Imports are resolved before the module body runs.",
          "ES module specifiers need the file extension for relative files: `'./math.mjs'`, not `'./math'`.",
          "`node:fs/promises` is a built-in module loaded by name.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Differences that matter",
      body: [
        "A CommonJS module is wrapped in a function that provides `require`, `module`, `exports`, `__filename` and `__dirname`. An ES module has none of these. Use `import.meta.url`, `import.meta.filename` and `import.meta.dirname` to find the file's location.",
        "CommonJS caches a module after its first load, so `require` of the same file returns the same `module.exports` object. You can inspect the cache with `require.cache`.",
        "An ES module can load a CommonJS module with `import`. A CommonJS file loads an ES module with `import()`, which returns a promise. ES modules also support top-level `await`.",
        "`exports` is just a shortcut to `module.exports`. Reassigning `exports = …` does nothing; assign to `module.exports` instead.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using require in a file that Node treats as an ES module.",
          fix: "Use import, or rename the file to .cjs, or set the package type to commonjs.",
        },
        {
          mistake: "Leaving the file extension out of a relative import in ESM.",
          fix: "Write the full path with its extension.",
        },
        {
          mistake: "Assigning to exports instead of module.exports.",
          fix: "exports is a reference to the original object. Assign to module.exports to replace it.",
        },
        {
          mistake: "Using __dirname in an ES module.",
          fix: "Use import.meta.dirname or derive the path from import.meta.url.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Moving a project to ES modules",
      scenario:
        "An older project uses require everywhere and you want to move it to ES modules.",
      body: [
        "Add `\"type\": \"module\"` to `package.json`, change `require` to `import`, add `.js` extensions to relative imports, and replace `__dirname` with `import.meta.dirname`.",
        "Do it a folder at a time, keeping a `.cjs` file where a library still needs CommonJS, and run the tests after every step.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "type-module",
      prompt: "What makes Node.js treat .js files in a package as ES modules?",
      options: ['"type": "module" in package.json', 'A file named index.mjs only', 'The word import in the file'],
      answer: 0,
      explanation:
        'The nearest package.json "type" field decides how .js files are treated.',
    },
    {
      type: "truefalse",
      id: "dirname-esm",
      statement: "__dirname is available inside an ES module.",
      answer: false,
      explanation:
        "ES modules do not have __dirname. Use import.meta.dirname or import.meta.url.",
    },
    {
      type: "output",
      id: "exports-reassign",
      prompt: "What does this CommonJS file export?",
      code: {
        language: "javascript",
        code: "exports = { a: 1 };\nmodule.exports.b = 2;\nconsole.log(Object.keys(module.exports));",
      },
      options: ["['b']", "['a', 'b']", "['a']"],
      answer: 0,
      explanation:
        "Reassigning exports only changes the local variable. module.exports is still the original object, which now has b.",
    },
    {
      type: "blank",
      id: "dynamic-import",
      prompt: "A CommonJS file can load an ES module with the ___() function, which returns a promise.",
      answer: "import",
      explanation:
        "Dynamic `import()` works in both module systems and returns a promise.",
    },
  ],
  assignment: {
    title: "One library, two styles",
    task: [
      "Write a small utility module with two functions, once as CommonJS and once as an ES module.",
      "Import each from a script of the matching kind and print the results.",
    ],
    checklist: [
      "The CommonJS version uses module.exports",
      "The ES version uses export and a file extension in the import",
      "I tried require on the ES module and read the error",
      "I can explain how Node picked the module type",
    ],
    hints: ["Use the .cjs and .mjs extensions so no package.json setting is needed."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "module-registry",
      title: "A tiny cache",
      task: [
        "A module is loaded once and then cached. Write `makeCache(loader)` that returns a function `get(key)`. It calls `loader(key)` the first time a key is requested and returns the stored value afterwards.",
      ],
      language: "javascript",
      starter: "function makeCache(loader) {\n  // your code\n}",
      solution:
        "function makeCache(loader) {\n  const store = new Map();\n  return function get(key) {\n    if (!store.has(key)) store.set(key, loader(key));\n    return store.get(key);\n  };\n}",
      hints: ["Use a Map and check has(key) before calling the loader."],
      checklist: [
        "The loader runs once per key",
        "The same value is returned on later calls",
        "Different keys are cached separately",
      ],
    },
  ],
  revisionNotes: [
    "CommonJS: require and module.exports. ESM: import and export",
    ".cjs and .mjs decide directly; .js follows package.json type",
    "ESM has no __dirname or require; use import.meta.dirname and import()",
    "Modules are cached after the first load",
  ],
  resources: [
    {
      label: "Node.js: Modules: CommonJS modules",
      url: "https://nodejs.org/api/modules.html",
    },
    {
      label: "Node.js: Modules: ECMAScript modules",
      url: "https://nodejs.org/api/esm.html",
    },
    {
      label: "Node.js: Modules: Packages",
      url: "https://nodejs.org/api/packages.html",
    },
  ],
})
