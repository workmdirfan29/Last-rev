import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "memory-and-garbage-collection",
  title: "Memory management and garbage collection",
  topic: "Memory & garbage collection",
  minutes: 60,
  overview:
    "Learn how JavaScript frees memory automatically, what a memory leak is, and how to find and avoid common leaks.",
  objectives: [
    "Explain reachability and how garbage collection decides what to free",
    "Recognise the common causes of memory leaks",
    "Use WeakMap, WeakRef and the browser tools to find and avoid leaks",
  ],
  prerequisites: ["lesson.javascript.closures"],
  sections: [
    {
      kind: "explain",
      heading: "Automatic memory management",
      body: [
        "JavaScript allocates memory when you create values, such as objects, arrays and functions, and a **garbage collector** frees it later. You do not free memory yourself.",
        "The collector uses **reachability**. Some values are roots: global variables, the variables on the current call stack, and the values that the running environment refers to. Anything that can be reached from a root by following references stays in memory. Everything that **cannot** be reached is garbage, and may be freed at some later time, when the engine decides.",
        "Reference counting, the idea of freeing an object when nothing points to it, is not how modern engines work. Two objects that point only to each other are still freed, if nothing reachable points to them.",
      ],
    },
    {
      kind: "code",
      heading: "Reachable or not",
      example: {
        title: "References keep objects alive",
        language: "javascript",
        code: "let user = { name: 'Asha' };\nconst copy = user;\nuser = null;\nconsole.log(copy.name);\ncopy.name = 'x';\n\nfunction make() {\n  const big = new Array(1000).fill('data');\n  return () => big.length;\n}\nlet size = make();\nconsole.log(size());\nsize = null;",
        walkthrough: [
          "After `user = null`, the object is still reachable through `copy`, so it stays and `copy.name` works.",
          "The closure returned by `make` keeps `big` alive for as long as the function is reachable.",
          "After `size = null`, nothing refers to the closure or to `big`, so the engine may free them.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Memory leaks",
      body: [
        "A **memory leak** is memory that is still reachable but is no longer needed, so the collector cannot free it. The memory use grows over time, and a long-running page or server slows down or crashes.",
        "The common causes are: a global variable or array that only grows, such as a cache without a size limit; **event listeners** that are never removed from elements that live a long time; timers (`setInterval`) that are never cleared and whose callbacks hold large objects; closures that capture more than they need; and references to removed DOM elements that are kept in a variable or an array.",
        "Many leaks come from forgetting that a long-lived object holds a reference to a short-lived one.",
      ],
    },
    {
      kind: "code",
      heading: "A leak and its fix",
      example: {
        title: "Cleanup",
        language: "javascript",
        code: "const cache = new Map();\nfunction getReport(id, compute) {\n  if (!cache.has(id)) {\n    cache.set(id, compute(id));\n  }\n  return cache.get(id);\n}\n\nfunction startPolling(render) {\n  const timer = setInterval(() => render(Date.now()), 1000);\n  return () => clearInterval(timer);\n}\nconst stop = startPolling(console.log);\nstop();",
        walkthrough: [
          "The `cache` map only grows. Every id stays in memory forever, which is a leak when ids are unlimited.",
          "A fix is a size limit, an expiry time, or a `WeakMap` keyed by objects.",
          "`startPolling` returns a function that clears the timer, and the code that created the interval must call it when it is no longer needed.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Weak references",
      body: [
        "A `WeakMap` and a `WeakSet` hold their keys **weakly**: they do not keep the key object alive, and the entry disappears when the key is collected. They are a good way to attach data to objects that you do not own.",
        "A `WeakRef` holds an object without keeping it alive, and `deref()` gives the object or `undefined` if it was collected. A `FinalizationRegistry` can run a callback after collection. Both depend on **when** the collector runs, which you cannot control, so they are for caches and not for logic that must happen.",
        "To find leaks in a browser, open the developer tools, take **heap snapshots** before and after an action and compare them, or record the memory timeline. Objects that keep growing, and the path that keeps them reachable, show the cause.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Adding listeners and never removing them from long-lived elements.",
          fix: "Remove them with `removeEventListener`, use `{ once: true }`, or an `AbortController` signal.",
        },
        {
          mistake: "Leaving `setInterval` running after the screen is closed.",
          fix: "Store the id and call `clearInterval` when the screen goes away.",
        },
        {
          mistake: "Keeping removed DOM elements in an array.",
          fix: "Remove them from the array too, so they can be collected.",
        },
        {
          mistake: "Using a plain object or Map as an unbounded cache.",
          fix: "Limit the size, add an expiry time, or use a `WeakMap`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A single-page app",
      scenario:
        "A single-page app shows many screens, and its memory use grows each time a user opens and closes a dashboard.",
      body: [
        "Each time the dashboard opens, it adds a window `resize` listener and a polling timer, and nothing removes them when it closes. Every closed dashboard stays alive through those two references.",
        "Add a cleanup step that removes the listener and clears the timer, and check with a heap snapshot that the count of dashboard objects no longer grows.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "what-is-garbage",
      prompt: "When can an object be garbage collected?",
      options: [
        "When it cannot be reached from any root",
        "When you set a variable to undefined",
        "As soon as a function returns",
      ],
      answer: 0,
      explanation:
        "The collector frees objects that are unreachable. Setting one variable to `null` is not enough if another reference exists.",
    },
    {
      type: "multi",
      id: "leak-causes",
      prompt: "Which of these can cause a memory leak?",
      options: [
        "An event listener that is never removed",
        "A cache that only grows",
        "Using const instead of let",
        "A setInterval that is never cleared",
      ],
      answers: [0, 1, 3],
      explanation:
        "`const` and `let` do not cause leaks. Forgotten listeners, unbounded caches and intervals keep memory reachable.",
    },
    {
      type: "truefalse",
      id: "weakmap-keys",
      statement: "A WeakMap keeps its key objects alive.",
      answer: false,
      explanation:
        "Keys are held weakly, so an entry can disappear when nothing else refers to the key.",
    },
    {
      type: "truefalse",
      id: "manual-free",
      statement:
        "You must free memory yourself in JavaScript with a function such as `free()`.",
      answer: false,
      explanation:
        "The garbage collector does it. You only make sure that unneeded objects are no longer reachable.",
    },
  ],
  assignment: {
    title: "Find and fix a leak",
    task: [
      "Write a small page that adds a `resize` listener and a `setInterval` every time a panel is opened, and never removes them.",
      "Use the browser's memory tools to show the growth, then add the cleanup and show that the growth stops.",
    ],
    checklist: [
      "I measured the leak before the fix",
      "I removed both the listener and the timer",
      "A second measurement shows stable memory",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "lru-set",
      title: "Keep a bounded cache",
      task: [
        "Write `touch(cache, key, max)` where `cache` is an array of keys, most recent last. Move `key` to the end (add it if missing), then drop the oldest keys at the start until the length is at most `max`. Return the new array and do not change the input.",
      ],
      language: "javascript",
      starter: "function touch(cache, key, max) {\n  // your code\n}",
      solution:
        "function touch(cache, key, max) {\n  const next = cache.filter((k) => k !== key);\n  next.push(key);\n  while (next.length > max) next.shift();\n  return next;\n}",
      hints: [
        "Remove the key if it is there, push it at the end, then remove from the front.",
      ],
      checklist: [
        "A new key is added at the end",
        "An existing key moves to the end",
        "The oldest keys are dropped when over the limit",
      ],
      run: {
        entry: "touch",
        cases: [
          {
            name: "add",
            args: [["a", "b"], "c", 5],
            expected: ["a", "b", "c"],
          },
          {
            name: "move",
            args: [["a", "b", "c"], "a", 5],
            expected: ["b", "c", "a"],
          },
          {
            name: "limit",
            args: [["a", "b", "c"], "d", 3],
            expected: ["b", "c", "d"],
          },
          {
            name: "tiny",
            args: [[], "x", 1],
            expected: ["x"],
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Objects stay in memory while they are reachable from a root",
    "A leak = memory that is reachable but no longer needed",
    "Typical leaks: growing caches, unremoved listeners, uncleared timers, kept DOM nodes",
    "WeakMap/WeakRef hold objects weakly; use heap snapshots to find leaks",
  ],
  resources: [
    {
      label: "MDN: Memory management",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
    },
    {
      label: "MDN: WeakMap",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap",
    },
    {
      label: "MDN: WeakRef",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef",
    },
  ],
})
