import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "browser-apis",
  title: "Browser APIs: fetch, storage, URL and observers",
  topic: "Browser APIs",
  minutes: 60,
  overview:
    "Use the built-in browser APIs for network requests, saving data, working with URLs and reacting to changes on the page.",
  objectives: [
    "Make requests with fetch and handle HTTP errors correctly",
    "Store small data with localStorage and sessionStorage, and know their limits",
    "Use URLSearchParams, timers and an IntersectionObserver",
  ],
  prerequisites: ["lesson.javascript.dom-and-events"],
  sections: [
    {
      kind: "explain",
      heading: "fetch",
      body: [
        "`fetch(url, options)` sends an HTTP request and returns a promise for the `Response`. It rejects **only on network failure**. An HTTP error such as `404` or `500` is still a successful fetch, so you must check `response.ok` yourself. Then read the body with `response.json()` or `response.text()`, which also return promises.",
        "For a request with data, set the method, the headers and the body: `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })`. An `AbortController` lets you cancel a request, for example when the user leaves the page or types a new search.",
        "Requests to another origin are limited by **CORS**. The server must send headers that allow your page's origin, or the browser blocks you from reading the response.",
      ],
    },
    {
      kind: "code",
      heading: "A careful request",
      example: {
        title: "ok check and abort",
        language: "javascript",
        code: "async function loadUser(id, signal) {\n  const response = await fetch('/api/users/' + id, { signal });\n  if (!response.ok) {\n    throw new Error('Request failed: ' + response.status);\n  }\n  return response.json();\n}\n\nconst controller = new AbortController();\nloadUser(7, controller.signal)\n  .then((user) => console.log(user.name))\n  .catch((error) => {\n    if (error.name !== 'AbortError') console.log(error.message);\n  });\ncontroller.abort();",
        walkthrough: [
          "`response.ok` is `true` for status codes 200 to 299, and the code throws for the others.",
          "The `signal` connects the request to the controller.",
          "`controller.abort()` cancels the request, and the promise rejects with an `AbortError`, which the handler ignores.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Web storage",
      body: [
        "`localStorage` keeps strings under keys, and stays after the browser is closed. `sessionStorage` is the same, but lasts only for one tab session. Use `setItem(key, value)`, `getItem(key)`, which gives `null` if the key is missing, and `removeItem(key)`.",
        "Values must be strings, so objects are saved with `JSON.stringify` and read with `JSON.parse`, inside a `try/catch`, in case the stored text is damaged. Storage is limited to a few megabytes per origin, it is **synchronous** and can slow a page if overused, and any script on the page can read it.",
        "Never store passwords, tokens or personal data that must stay private in web storage. For larger or structured data, use IndexedDB.",
      ],
    },
    {
      kind: "code",
      heading: "Saving and loading",
      example: {
        title: "localStorage with JSON",
        language: "javascript",
        code: "function save(key, value) {\n  localStorage.setItem(key, JSON.stringify(value));\n}\nfunction load(key, fallback) {\n  try {\n    const text = localStorage.getItem(key);\n    return text === null ? fallback : JSON.parse(text);\n  } catch {\n    return fallback;\n  }\n}\nsave('prefs', { theme: 'dark', size: 14 });\nconsole.log(load('prefs', {}).theme);\nconsole.log(load('missing', 'none'));",
        walkthrough: [
          "Objects must be turned into text before they are stored.",
          "`getItem` returns `null` for a missing key, which is checked before parsing.",
          "The `try/catch` returns the fallback if the stored text is not valid JSON.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "URLs, timers and observers",
      body: [
        "`new URL(text)` parses a web address into parts such as `hostname`, `pathname` and `searchParams`. `URLSearchParams` reads and builds query strings and encodes special characters for you: `new URLSearchParams({ q: 'a b' }).toString()` gives `q=a+b`. Never build query strings by joining text.",
        "`setTimeout` runs a function once after a delay, and `setInterval` repeats it. Both return an id that you pass to `clearTimeout` or `clearInterval`. Intervals that are never cleared keep running, which is a common source of leaks.",
        "An **IntersectionObserver** tells you when an element enters or leaves the visible area. It is the right tool for lazy loading images and for infinite scrolling, because you do not need scroll listeners. `ResizeObserver` and `MutationObserver` report size changes and DOM changes.",
      ],
    },
    {
      kind: "code",
      heading: "URL and observer",
      example: {
        title: "Search params and lazy loading",
        language: "javascript",
        code: "const url = new URL('https://example.com/search?q=js&page=2');\nconsole.log(url.hostname, url.searchParams.get('page'));\nurl.searchParams.set('q', 'a b');\nconsole.log(url.search);\n\nconst observer = new IntersectionObserver((entries) => {\n  for (const entry of entries) {\n    if (entry.isIntersecting) {\n      entry.target.src = entry.target.dataset.src;\n      observer.unobserve(entry.target);\n    }\n  }\n});\ndocument.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));",
        walkthrough: [
          "`searchParams.get` reads a parameter, and `set` changes it with correct encoding.",
          "`url.search` is `?q=a+b&page=2` after the change.",
          "The observer loads each image only when it comes into view, and then stops watching it.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Assuming that `fetch` rejects on a 404 or 500.",
          fix: "Check `response.ok`, and throw your own error.",
        },
        {
          mistake: "Storing objects in localStorage without `JSON.stringify`.",
          fix: "You would get the text `[object Object]`.",
        },
        {
          mistake: "Storing secrets or tokens in web storage.",
          fix: "Any script on the page can read it. Keep secrets out of storage.",
        },
        {
          mistake: "Joining a query string by hand.",
          fix: "Use `URLSearchParams`, which encodes the values.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A search box",
      scenario:
        "A search box calls an API as the user types and shows the results.",
      body: [
        "Wait until the user pauses with a debounce timer, cancel the previous request with an `AbortController`, check `response.ok`, and store the last search term in `localStorage`.",
        "These four small APIs together make the box fast, correct and friendly.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "fetch-404",
      prompt:
        "A `fetch` request receives a 404 response. What happens to the promise?",
      options: [
        "It resolves, and response.ok is false",
        "It rejects with an error",
        "It never settles",
      ],
      answer: 0,
      explanation:
        "`fetch` rejects only for network failures. HTTP errors resolve, and you must check `response.ok`.",
    },
    {
      type: "single",
      id: "storage-type",
      prompt: "What type are the values that localStorage can hold?",
      options: ["Strings", "Any object", "Numbers only"],
      answer: 0,
      explanation:
        "Values are strings, so use `JSON.stringify` and `JSON.parse` for objects.",
    },
    {
      type: "truefalse",
      id: "session-tab",
      statement: "`sessionStorage` data stays after the browser is closed.",
      answer: false,
      explanation: "It lasts only for the tab session. `localStorage` stays.",
    },
    {
      type: "blank",
      id: "encode-query",
      prompt:
        "To build and encode a query string safely, use `new ___({ q: 'a b' })`.",
      answer: "URLSearchParams",
      explanation:
        "`URLSearchParams` encodes values and builds the `key=value` text for you.",
    },
  ],
  assignment: {
    title: "Saved search history",
    task: [
      "Write `saveSearch(term)` and `loadSearches()` that keep the last five different search terms in localStorage, newest first.",
      "Write a `getJson(url)` helper that checks `response.ok`, throws a clear error and supports cancellation.",
    ],
    checklist: [
      "Corrupt stored JSON does not break the page",
      "Only five terms are kept, without duplicates",
      "A 404 gives a clear error",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "update-history",
      title: "Update a history list",
      task: [
        "Write `updateHistory(list, term, max)` that returns a new array with `term` at the front, any older copy of `term` removed, and at most `max` items. Do not change `list`.",
      ],
      language: "javascript",
      starter: "function updateHistory(list, term, max) {\n  // your code\n}",
      solution:
        "function updateHistory(list, term, max) {\n  return [term, ...list.filter((t) => t !== term)].slice(0, max);\n}",
      hints: [
        "Spread into a new array, filter out the old copy, then `slice`.",
      ],
      checklist: [
        "The newest term is first",
        "Duplicates are removed",
        "The input array is unchanged",
      ],
      run: {
        entry: "updateHistory",
        cases: [
          {
            name: "new",
            args: [["a", "b"], "c", 5],
            expected: ["c", "a", "b"],
          },
          {
            name: "duplicate",
            args: [["a", "b", "c"], "b", 5],
            expected: ["b", "a", "c"],
          },
          {
            name: "limit",
            args: [["a", "b", "c"], "d", 3],
            expected: ["d", "a", "b"],
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "`fetch` rejects only on network errors; check `response.ok`",
    "`AbortController` cancels a request",
    "localStorage/sessionStorage hold strings; no secrets there",
    "`URL`/`URLSearchParams`, timers with clear*, `IntersectionObserver` for visibility",
  ],
  resources: [
    {
      label: "MDN: Using the Fetch API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
    },
    {
      label: "MDN: Web Storage API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
    },
    {
      label: "MDN: Intersection Observer API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
    },
  ],
})
