import { defineQuestions } from "../author"
import { q } from "../compact"

const W = "https://web.dev/articles"
const RD = "https://react.dev"
const DT = "https://developer.chrome.com/docs/devtools"
const LH = "https://developer.chrome.com/docs/lighthouse"
const M = "https://developer.mozilla.org/en-US/docs"

export default defineQuestions("frontend-performance", "fresher", [
  q({
    slug: "what-are-core-web-vitals",
    topic: "Core Web Vitals",
    d: "easy",
    title: "What are the Core Web Vitals and their good thresholds?",
    kw: ["core web vitals", "lcp", "inp", "cls", "thresholds"],
    intent:
      "Checks you know the three user-centred metrics and what counts as good.",
    short:
      "Core Web Vitals are three metrics that measure real user experience. Largest Contentful Paint (LCP) measures loading and should be 2.5 seconds or less. Interaction to Next Paint (INP) measures responsiveness to input and should be 200 milliseconds or less. Cumulative Layout Shift (CLS) measures visual stability and should be 0.1 or less. A page is judged on the 75th percentile of page loads for all three, so most visitors should have a good experience.",
    detail: [
      "INP replaced First Input Delay as the responsiveness metric.",
      "The metrics are measured in the field from real users and can also be approximated in the lab.",
      "Improving them benefits users first, and search engines may also consider them.",
    ],
    ex: "A shop page with a slow hero image, a delayed menu click and ads that push content down would fail LCP, INP and CLS respectively.",
    mistakes: [
      "Optimising for the Lighthouse score only.",
      "Looking at the average instead of the 75th percentile.",
    ],
    follow: ["Which metric measures responsiveness?"],
    points: [
      "LCP ≤ 2.5 s",
      "INP ≤ 200 ms",
      "CLS ≤ 0.1",
      "Judged at the 75th percentile",
    ],
    notes: ["Load, respond, stay stable."],
    src: [
      ["web.dev: Web Vitals", `${W}/vitals`],
      ["web.dev: LCP", `${W}/lcp`],
      ["web.dev: INP", `${W}/inp`],
      ["web.dev: CLS", `${W}/cls`],
    ],
  }),
  q({
    slug: "optimise-lcp",
    topic: "Core Web Vitals",
    d: "medium",
    title: "How do you improve Largest Contentful Paint?",
    kw: ["lcp", "largest contentful paint", "ttfb", "preload", "fetchpriority"],
    intent: "Checks you can break LCP into parts and fix the slowest one.",
    short:
      'LCP can be broken into four subparts: time to first byte, resource load delay, resource load duration and element render delay. Find which is largest, then fix that. Reduce server response time, make sure the LCP image is discoverable in the HTML and starts loading early (for example with `fetchpriority="high"`), shrink and compress the resource with modern formats and correct sizes, and avoid render-blocking resources. Never lazy-load the LCP image.',
    detail: [
      "The LCP element is often a hero image or a large heading.",
      "Client-side rendered pages delay discovery of images until JavaScript runs.",
      "DevTools and PageSpeed Insights show the LCP element and breakdown.",
    ],
    ex: 'A hero image set to `loading="lazy"` is changed to load eagerly with high fetch priority, and LCP drops.',
    mistakes: [
      "Lazy-loading the hero image.",
      "Optimising image size when the real delay is the server or the discovery.",
    ],
    follow: ["How do you find the LCP element?"],
    points: [
      "Four subparts",
      "Fix the largest first",
      "Make the resource discoverable early",
      "Do not lazy-load it",
    ],
    notes: ["Diagnose the subpart first."],
    src: [
      ["web.dev: Optimize LCP", `${W}/optimize-lcp`],
      ["web.dev: Fetch Priority", `${W}/fetch-priority`],
    ],
  }),
  q({
    slug: "optimise-cls",
    topic: "Core Web Vitals",
    d: "medium",
    title: "What causes layout shift and how do you prevent it?",
    kw: [
      "cls",
      "layout shift",
      "image dimensions",
      "reserve space",
      "font swap",
    ],
    intent: "Checks you can name common causes and fixes.",
    short:
      "Layout shift happens when visible content moves unexpectedly, for example when an image, ad or banner loads and pushes text down. Prevent it by reserving space: set `width` and `height` attributes or `aspect-ratio` on images and videos, give ad and embed slots a fixed size, avoid inserting content above existing content after load, and use `transform` for animations instead of properties that change layout. Web fonts that swap in can also shift text, so choose fallbacks with similar metrics.",
    detail: [
      "Shifts in response to a user action such as a click do not count in CLS.",
      "Skeleton loaders should match the final size.",
      "Test with throttled networks, where shifts are easier to see.",
    ],
    ex: "Adding `width` and `height` to every product image stops the list jumping as images arrive.",
    mistakes: [
      "Images with no dimensions.",
      "Injecting a banner at the top after the page has rendered.",
    ],
    follow: ["Why are transforms safe for animation?"],
    points: [
      "Reserve space",
      "Dimensions or aspect-ratio on media",
      "Fixed slots for ads",
      "Do not insert above existing content",
    ],
    notes: ["Reserve space before content arrives."],
    src: [
      ["web.dev: Optimize CLS", `${W}/optimize-cls`],
      ["web.dev: CLS", `${W}/cls`],
    ],
  }),
  q({
    slug: "optimise-inp",
    topic: "Core Web Vitals",
    d: "hard",
    title: "What does INP measure and how do you improve it?",
    kw: [
      "inp",
      "interaction to next paint",
      "long tasks",
      "main thread",
      "responsiveness",
    ],
    intent: "Checks you connect responsiveness to main-thread work.",
    short:
      "INP measures how long it takes from a user interaction, such as a click, tap or key press, until the next frame is painted, and reports one of the slowest interactions of a visit. A slow INP usually means the main thread is busy. Improve it by breaking up long tasks, doing less work in event handlers, deferring non-urgent updates, avoiding large re-renders and heavy third-party scripts, and keeping the DOM small. In React, `useTransition` or `useDeferredValue` can keep input responsive while heavy updates wait.",
    detail: [
      "A long task is any task that runs for more than 50 ms on the main thread.",
      "Input delay, processing time and presentation delay are the three phases of an interaction.",
      "Measure in the field, since lab tools only approximate it.",
    ],
    ex: "Typing in a search box is sluggish because every keystroke re-renders a huge list; deferring the list update makes typing smooth.",
    mistakes: [
      "Heavy work directly inside click handlers.",
      "Ignoring third-party scripts.",
    ],
    follow: ["What counts as a long task?"],
    points: [
      "Click or key to next paint",
      "Main thread must be free",
      "Break up long tasks",
      "Defer non-urgent work",
    ],
    notes: ["Free the main thread."],
    src: [
      ["web.dev: Interaction to Next Paint", `${W}/inp`],
      ["web.dev: Optimize long tasks", `${W}/optimize-long-tasks`],
      ["React: useTransition", `${RD}/reference/react/useTransition`],
    ],
  }),
  q({
    slug: "lab-vs-field-data",
    topic: "Core Web Vitals",
    d: "medium",
    title: "What is the difference between lab data and field data?",
    kw: [
      "lab data",
      "field data",
      "real user monitoring",
      "crux",
      "synthetic testing",
    ],
    intent:
      "Checks you understand why the same page gets different numbers in different tools.",
    short:
      "Lab data comes from testing a page in a controlled environment, with a fixed device, network and cache, such as a Lighthouse run. It is repeatable and good for debugging and for catching regressions before release. Field data is collected from real users' visits, with different devices, networks and behaviour, such as the Chrome User Experience Report. It shows what users actually experience and is what Core Web Vitals are assessed on. Use lab data to diagnose and field data to judge.",
    detail: [
      "Metrics that need real interaction, such as INP, can only be measured properly in the field.",
      "A good lab score does not guarantee a good field result.",
      "Total Blocking Time is a lab metric often used as a proxy for responsiveness.",
    ],
    ex: "A page scores 95 in Lighthouse on a fast laptop, but field data shows slow LCP for users on low-end phones.",
    mistakes: ["Trusting one lab run.", "Ignoring field data."],
    follow: ["Why can INP not be fully measured in the lab?"],
    points: [
      "Lab: controlled and repeatable",
      "Field: real users",
      "Vitals are judged on field data",
      "Use both",
    ],
    notes: ["Lab to debug, field to decide."],
    src: [
      [
        "web.dev: Why lab and field data can be different",
        `${W}/lab-and-field-data-differences`,
      ],
      ["web.dev: Tools to measure Core Web Vitals", `${W}/vitals-tools`],
    ],
  }),
  q({
    slug: "code-splitting-dynamic-import",
    topic: "Code splitting",
    d: "easy",
    title: "What is code splitting and how does dynamic import() help?",
    kw: [
      "code splitting",
      "dynamic import",
      "bundle size",
      "chunks",
      "lazy loading",
    ],
    intent: "Checks you know how to avoid shipping all code up front.",
    short:
      "Code splitting breaks the JavaScript bundle into smaller chunks that are loaded when needed instead of all at the start, so the first page loads faster. Dynamic `import()` is the language feature that makes it possible: it loads a module on demand and returns a promise. Bundlers such as Vite and webpack see the dynamic import and create a separate chunk for it. Typical split points are routes, large libraries and rarely used features like a chart or editor.",
    detail: [
      "Less JavaScript means less to download, parse and run.",
      "Chunks are cached separately by the browser.",
      "Loading on demand adds a small delay at the moment of need, which can be hidden by prefetching.",
    ],
    ex: "A rich text editor library is loaded only when the user opens the compose screen.",
    code: [
      [
        "Dynamic import",
        "js",
        `button.addEventListener("click", async () => {\n  const { openEditor } = await import("./editor.js")\n  openEditor()\n})`,
        [
          "`import()` loads the module when the click happens.",
          "The bundler puts it in its own chunk.",
        ],
      ],
    ],
    mistakes: [
      "Putting everything in one bundle.",
      "Splitting too finely and creating many tiny requests.",
    ],
    follow: ["What are good places to split?"],
    points: [
      "Smaller initial bundle",
      "Dynamic import() creates chunks",
      "Split by route and heavy features",
      "Chunks cached separately",
    ],
    notes: ["Load what is needed now."],
    src: [
      ["MDN: Dynamic import", `${M}/Web/JavaScript/Reference/Operators/import`],
      [
        "web.dev: Reduce JavaScript payloads with code splitting",
        `${W}/reduce-javascript-payloads-with-code-splitting`,
      ],
    ],
  }),
  q({
    slug: "react-lazy-and-suspense",
    topic: "Code splitting",
    d: "medium",
    title: "How do React.lazy and Suspense work together?",
    kw: [
      "React.lazy",
      "Suspense",
      "fallback",
      "default export",
      "route splitting",
    ],
    intent:
      "Checks you can split components and show a fallback while they load.",
    short:
      '`React.lazy(() => import("./Page"))` defines a component whose code is loaded the first time it is rendered. Because it may not be ready, it must be rendered inside a `Suspense` boundary, which shows its `fallback` until the code has loaded. The imported module must have a default export that is a component. Lazy components should be declared at module level, not inside another component.',
    detail: [
      "Wrap route-level components in Suspense so a page change shows a loading indicator.",
      "An error boundary can handle a chunk that fails to load.",
      "Several lazy components can share one Suspense boundary.",
    ],
    ex: "The Reports page is lazy-loaded, so users who never open it never download its code.",
    code: [
      [
        "Lazy route",
        "tsx",
        `const Reports = lazy(() => import("./Reports"))\n\n<Suspense fallback={<Spinner />}>\n  <Reports />\n</Suspense>`,
        [
          "`lazy` defers the import.",
          "`Suspense` shows the spinner until it is ready.",
        ],
      ],
    ],
    mistakes: [
      "Declaring lazy inside a component so it reloads each render.",
      "No Suspense boundary above a lazy component.",
    ],
    follow: ["What happens if the chunk fails to load?"],
    points: [
      "lazy + dynamic import",
      "Needs a Suspense fallback",
      "Default export required",
      "Declare at module level",
    ],
    notes: ["lazy needs Suspense."],
    src: [
      ["React: lazy", `${RD}/reference/react/lazy`],
      ["React: Suspense", `${RD}/reference/react/Suspense`],
    ],
  }),
  q({
    slug: "route-based-splitting-and-prefetch",
    topic: "Code splitting",
    d: "medium",
    title:
      "Why is route-based splitting a good default, and how do you hide the loading delay?",
    kw: [
      "route-based splitting",
      "prefetch",
      "preload",
      "navigation",
      "perceived performance",
    ],
    intent:
      "Checks you choose split points users naturally cross, and know the trade-off.",
    short:
      "Routes are natural split points: users only need the code for the page they are on, and navigation is already a moment where a short load is expected. Each route becomes its own chunk. The cost is a delay when a chunk loads on first navigation. Hide it by prefetching likely next routes, for example when a link is hovered or the browser is idle, or by preloading the next chunk with a dynamic import call, so it is cached before the click.",
    detail: [
      "Keep shared code in common chunks to avoid duplication.",
      "Do not split the first, landing route away from the initial load.",
      "Measure the effect on real navigations.",
    ],
    ex: 'Hovering the Dashboard link triggers `import("./Dashboard")`, so the chunk is ready by the time the user clicks.',
    code: [
      [
        "Prefetch on hover",
        "tsx",
        `const loadDashboard = () => import("./Dashboard")\nconst Dashboard = lazy(loadDashboard)\n\n<Link to="/dashboard" onMouseEnter={loadDashboard}>Dashboard</Link>`,
        [
          "The same loader is used for lazy and for the early import.",
          "Hover starts loading before the click.",
        ],
      ],
    ],
    mistakes: [
      "Splitting the landing route.",
      "No prefetching so every first navigation waits.",
    ],
    follow: ["What is the cost of splitting?"],
    points: [
      "Routes are natural boundaries",
      "Chunk per route",
      "Prefetch likely routes",
      "Do not split the first view away",
    ],
    notes: ["Split by route, prefetch the next."],
    src: [
      ["React: lazy", `${RD}/reference/react/lazy`],
      [
        "web.dev: Reduce JavaScript payloads with code splitting",
        `${W}/reduce-javascript-payloads-with-code-splitting`,
      ],
    ],
  }),
  q({
    slug: "bundle-size-tree-shaking",
    topic: "Code splitting",
    d: "medium",
    title: "What is tree shaking and how do you keep the bundle small?",
    kw: [
      "tree shaking",
      "bundle size",
      "es modules",
      "dead code",
      "dependencies",
    ],
    intent: "Checks you know how unused code is removed and what blocks it.",
    short:
      "Tree shaking is the removal of unused exports from the final bundle. It relies on the static structure of ES modules, `import` and `export`, which lets the bundler see what is never used. To benefit, import only what you need (named imports from libraries that support it), avoid libraries that are not shaking-friendly, and keep side effects out of modules. Beyond that, analyse the bundle to find large dependencies, replace heavy libraries with lighter ones, and split big features.",
    detail: [
      "CommonJS `require` is dynamic, so it is hard to shake.",
      "A bundle analyser shows which packages are largest.",
      "Minification and compression reduce size further but do not remove unused code.",
    ],
    ex: "A date library imported wholesale adds hundreds of kilobytes; importing a single function or a lighter library cuts it down.",
    mistakes: [
      "Importing an entire library for one helper.",
      "Adding dependencies without checking their size.",
    ],
    follow: ["Why does tree shaking need ES modules?"],
    points: [
      "Removes unused exports",
      "Needs static ES module imports",
      "Prefer named imports",
      "Analyse the bundle",
    ],
    notes: ["Measure the bundle, then trim it."],
    src: [
      ["MDN: Tree shaking", `${M}/Glossary/Tree_shaking`],
      [
        "web.dev: Reduce JavaScript payloads with code splitting",
        `${W}/reduce-javascript-payloads-with-code-splitting`,
      ],
    ],
  }),
  q({
    slug: "lazy-loading-images",
    topic: "Code splitting",
    d: "easy",
    title: "How do you lazy-load images, and which images should not be lazy?",
    kw: [
      "loading lazy",
      "lazy loading images",
      "above the fold",
      "lcp image",
      "iframe",
    ],
    intent: "Checks you apply lazy loading without hurting the first view.",
    short:
      'Adding `loading="lazy"` to an `img` or `iframe` tells the browser to delay loading it until it is near the viewport, which saves bandwidth for content the user may never scroll to. Do not use it on images in the initial viewport, especially the LCP image, because delaying them makes the page load feel slower. Always include `width` and `height` so the space is reserved and layout does not shift when the image loads.',
    detail: [
      "It is a native attribute and needs no JavaScript.",
      "Use responsive images with `srcset` and `sizes` so devices fetch an appropriate size.",
      "Below-the-fold galleries and long feeds benefit most.",
    ],
    ex: 'Product thumbnails far down a list use `loading="lazy"`, while the main banner loads eagerly.',
    code: [
      [
        "Lazy image",
        "html",
        `<img src="photo.jpg" width="640" height="360" loading="lazy" alt="Mountain lake">`,
        [
          '`loading="lazy"` delays offscreen loading.',
          "Width and height reserve space.",
        ],
      ],
    ],
    mistakes: [
      "Lazy-loading the hero image.",
      "Omitting dimensions and causing layout shift.",
    ],
    follow: ["Why include width and height?"],
    points: [
      'loading="lazy" defers offscreen images',
      "Not for above-the-fold or LCP",
      "Reserve space with dimensions",
      "Use srcset for sizes",
    ],
    notes: ["Lazy below the fold only."],
    src: [
      [
        "web.dev: Browser-level image lazy-loading",
        `${W}/browser-level-image-lazy-loading`,
      ],
      ["MDN: Lazy loading", `${M}/Web/Performance/Guides/Lazy_loading`],
    ],
  }),
  q({
    slug: "why-react-rerenders",
    topic: "Memoization",
    d: "easy",
    title:
      "Why does a React component re-render, and is re-rendering always a problem?",
    kw: ["re-render", "state change", "props", "parent render", "render cost"],
    intent: "Checks you understand rendering before reaching for optimisation.",
    short:
      "A component re-renders when its own state changes, when its context changes, or when its parent re-renders, which re-renders its children by default even if their props are the same. Rendering means React calls your component to work out what the UI should be, and it only updates the DOM where the output differs. Most re-renders are cheap and harmless. Optimise only when you measure a real slowdown, usually from expensive calculations or very large trees.",
    detail: [
      "Moving state down into the component that needs it limits how much re-renders.",
      "Passing `children` as props can stop a subtree from re-rendering when the wrapper's state changes.",
      "React DevTools Profiler shows what rendered and why.",
    ],
    ex: "Typing in a search box inside a large page re-renders everything under the state owner, so the state is moved into the search component.",
    mistakes: [
      "Memoizing everything by default.",
      "Treating every re-render as a bug.",
    ],
    follow: ["How can you limit re-renders without memo?"],
    points: [
      "State, context or parent changes",
      "Children re-render by default",
      "Re-render is not DOM update",
      "Measure first",
    ],
    notes: ["Move state down before memoizing."],
    src: [
      ["React: Render and commit", `${RD}/learn/render-and-commit`],
      ["React: memo", `${RD}/reference/react/memo`],
    ],
  }),
  q({
    slug: "react-memo-usage",
    topic: "Memoization",
    d: "medium",
    title: "What does React.memo do and when does it help?",
    kw: [
      "React.memo",
      "shallow comparison",
      "props",
      "skip render",
      "pure component",
    ],
    intent:
      "Checks you know that memo compares props and can be defeated by new references.",
    short:
      "`React.memo(Component)` makes React skip re-rendering that component when its props are shallowly equal to the previous props. It helps when a component is expensive to render and its parent re-renders often with the same props. It does not help if you pass a new object, array or function on every render, since those are never equal by reference. State and context changes inside the component still re-render it.",
    detail: [
      "Comparison uses `Object.is` on each prop.",
      "Stabilise object and function props with `useMemo` and `useCallback`, or avoid creating them in the parent.",
      "A custom comparison function is possible but rarely needed.",
    ],
    ex: "A large chart component wrapped in `memo` skips re-rendering when the parent updates unrelated state.",
    code: [
      [
        "memo",
        "tsx",
        `const Chart = memo(function Chart({ data }: { data: Point[] }) {\n  return <svg>{/* expensive drawing */}</svg>\n})`,
        [
          "`memo` compares the previous and next props.",
          "If `data` is the same reference, the render is skipped.",
        ],
      ],
    ],
    mistakes: [
      "Passing a new inline object each render and expecting memo to work.",
      "Wrapping tiny components for no measurable gain.",
    ],
    follow: ["Why do inline objects defeat memo?"],
    points: [
      "Skips render if props are shallow-equal",
      "Use for expensive components",
      "New references defeat it",
      "Not a guarantee for state or context",
    ],
    notes: ["memo needs stable props."],
    src: [["React: memo", `${RD}/reference/react/memo`]],
  }),
  q({
    slug: "usememo-vs-usecallback",
    topic: "Memoization",
    d: "medium",
    title: "What is the difference between useMemo and useCallback?",
    kw: [
      "useMemo",
      "useCallback",
      "memoization",
      "referential equality",
      "dependencies",
    ],
    intent: "Checks you know what each caches and when it is useful.",
    short:
      "`useMemo(fn, deps)` caches the result of a calculation between renders and recomputes it only when a dependency changes. `useCallback(fn, deps)` caches the function itself, returning the same function reference until a dependency changes. They are the same idea for different values: `useCallback(fn, deps)` equals `useMemo(() => fn, deps)`. Use them for expensive calculations, and to keep stable props for memoized children or stable dependencies for effects, not everywhere.",
    detail: [
      "A wrong or missing dependency leads to stale values.",
      "The cache is a performance optimisation; your code must work without it.",
      "Calculations that are cheap cost more to memoize than to repeat.",
    ],
    ex: "Sorting 10,000 rows is wrapped in `useMemo` keyed by the rows and the sort order.",
    code: [
      [
        "Both hooks",
        "tsx",
        `const sorted = useMemo(() => sortRows(rows, order), [rows, order])\nconst onSelect = useCallback((id: string) => setSelected(id), [])`,
        [
          "`useMemo` caches the sorted array.",
          "`useCallback` keeps the function reference stable.",
        ],
      ],
    ],
    mistakes: ["Wrapping trivial calculations.", "Leaving out dependencies."],
    follow: ["When is useCallback actually useful?"],
    points: [
      "useMemo caches a value",
      "useCallback caches a function",
      "Dependencies control invalidation",
      "Optimisation, not correctness",
    ],
    notes: ["Value vs function."],
    src: [
      ["React: useMemo", `${RD}/reference/react/useMemo`],
      ["React: useCallback", `${RD}/reference/react/useCallback`],
    ],
  }),
  q({
    slug: "when-not-to-memoize-and-compiler",
    topic: "Memoization",
    d: "hard",
    title:
      "When should you avoid manual memoization, and what is the React Compiler?",
    kw: [
      "premature optimization",
      "react compiler",
      "measure first",
      "memoization cost",
      "profiling",
    ],
    intent: "Checks you apply memoization with judgement.",
    short:
      "Memoization has costs: extra code, dependency arrays to maintain, memory for the cache, and the comparison work itself. Add it where profiling shows a real problem, such as an expensive calculation or a memoized child that re-renders needlessly, and first try simpler fixes like moving state down or splitting components. The React Compiler is a build-time tool that automatically memoizes components and values, so it can remove the need for most manual `useMemo`, `useCallback` and `memo` in code that follows React's rules.",
    detail: [
      "Measure before and after; an optimisation with no measurable effect is just complexity.",
      "Keep components pure so tools can reason about them.",
      "Check the documentation for how to adopt the compiler in your build.",
    ],
    ex: "A team removes dozens of `useCallback` wrappers that the profiler showed made no difference.",
    mistakes: ["Memoizing by habit.", "Skipping measurement."],
    follow: ["What simpler fixes come before memoization?"],
    points: [
      "Memoization has a cost",
      "Profile first",
      "Try moving state down",
      "Compiler can automate it",
    ],
    notes: ["Measure, then memoize."],
    src: [
      ["React: React Compiler", `${RD}/learn/react-compiler`],
      ["React: useMemo", `${RD}/reference/react/useMemo`],
    ],
  }),
  q({
    slug: "usetransition-and-usedeferredvalue",
    topic: "Memoization",
    d: "hard",
    title: "How do useTransition and useDeferredValue keep the UI responsive?",
    kw: [
      "useTransition",
      "useDeferredValue",
      "concurrent rendering",
      "non-urgent update",
      "responsiveness",
    ],
    intent: "Checks you know React's tools for prioritising updates.",
    short:
      "`useTransition` lets you mark a state update as a non-urgent transition, so React keeps urgent updates such as typing responsive and can interrupt the slow render if new input arrives; it also returns `isPending` for showing feedback. `useDeferredValue` gives you a deferred copy of a value that lags behind during heavy renders, so the input updates immediately while the expensive list that depends on it updates a moment later. Both avoid blocking the main thread with one big render.",
    detail: [
      "They help rendering cost, not network speed.",
      "Use `useDeferredValue` when you receive the value as a prop or cannot wrap the setter.",
      "They improve INP for interactions that trigger heavy rendering.",
    ],
    ex: "A filter box stays smooth while a long product list re-renders in the background from a deferred query.",
    code: [
      [
        "Deferred value",
        "tsx",
        `const [query, setQuery] = useState("")\nconst deferred = useDeferredValue(query)\n\n<input value={query} onChange={(e) => setQuery(e.target.value)} />\n<Results query={deferred} />`,
        [
          "The input uses the live value.",
          "The heavy list uses the deferred value.",
        ],
      ],
    ],
    mistakes: [
      "Expecting them to speed up the render itself.",
      "Using them for network waiting.",
    ],
    follow: ["How does isPending help the user?"],
    points: [
      "Mark updates non-urgent",
      "Input stays responsive",
      "isPending for feedback",
      "Helps render-heavy updates",
    ],
    notes: ["Urgent now, heavy later."],
    src: [
      ["React: useTransition", `${RD}/reference/react/useTransition`],
      ["React: useDeferredValue", `${RD}/reference/react/useDeferredValue`],
    ],
  }),
  q({
    slug: "list-virtualization-windowing",
    topic: "Virtualization",
    d: "medium",
    title: "What is list virtualization and when do you need it?",
    kw: [
      "virtualization",
      "windowing",
      "react-window",
      "tanstack virtual",
      "long lists",
    ],
    intent: "Checks you know how to render very long lists efficiently.",
    short:
      "Virtualization, or windowing, renders only the items currently visible in the viewport, plus a small buffer, instead of every item in a long list. As the user scrolls, items are reused or swapped. This keeps the number of DOM nodes small, which reduces memory use, render time and layout cost. Libraries such as react-window and TanStack Virtual provide it. It is needed for lists of thousands of rows; for a few dozen items it only adds complexity.",
    detail: [
      "The list needs a scrolling container with a known height.",
      "Row heights are fixed or measured, which affects the implementation.",
      "Pagination or infinite loading is another way to limit the DOM size.",
    ],
    ex: "A log viewer with 100,000 lines renders about 30 rows at a time.",
    mistakes: [
      "Rendering 10,000 rows into the DOM.",
      "Virtualizing a short list.",
    ],
    follow: ["What is the alternative to virtualizing?"],
    points: [
      "Render only visible rows",
      "Fewer DOM nodes",
      "Libraries: react-window, TanStack Virtual",
      "Only for long lists",
    ],
    notes: ["Render what you can see."],
    src: [
      [
        "web.dev: Virtualize large lists with react-window",
        `${W}/virtualize-long-lists-react-window`,
      ],
      [
        "TanStack Virtual: Introduction",
        "https://tanstack.com/virtual/latest/docs/introduction",
      ],
    ],
  }),
  q({
    slug: "virtualization-trade-offs",
    topic: "Virtualization",
    d: "hard",
    title: "What are the trade-offs and pitfalls of virtualized lists?",
    kw: [
      "virtualization trade-offs",
      "accessibility",
      "find in page",
      "dynamic height",
      "scroll restoration",
    ],
    intent: "Checks you know virtualization is not free.",
    short:
      "Because off-screen items are not in the DOM, browser find-in-page cannot see them, screen readers may not know how many items exist unless you provide that information, and focus can be lost when a focused row scrolls out and is removed. Variable row heights need measuring, which adds complexity, and fast scrolling can briefly show blank space. Keep row components cheap, provide stable keys, and consider pagination or a simple list if the dataset is modest.",
    detail: [
      "Provide an accessible total, for example with ARIA attributes for set size and position.",
      "Preserve scroll position when navigating back to the list.",
      "Test with keyboard navigation and a screen reader.",
    ],
    ex: "A virtualized table announces 'row 120 of 5,000' through ARIA attributes.",
    mistakes: [
      "Ignoring accessibility.",
      "Heavy row components that negate the benefit.",
    ],
    follow: ["Why does find-in-page fail?"],
    points: [
      "Off-screen items are absent from the DOM",
      "Accessibility needs extra work",
      "Variable heights add complexity",
      "Keep rows cheap",
    ],
    notes: ["Not in the DOM, not findable."],
    src: [
      [
        "web.dev: Virtualize large lists with react-window",
        `${W}/virtualize-long-lists-react-window`,
      ],
      ["MDN: ARIA", `${M}/Web/Accessibility/ARIA`],
    ],
  }),
  q({
    slug: "react-devtools-profiler",
    topic: "React Profiler",
    d: "medium",
    title: "How do you use the React DevTools Profiler to find slow renders?",
    kw: [
      "react devtools",
      "profiler",
      "flamegraph",
      "commit",
      "why did this render",
    ],
    intent: "Checks you measure renders before optimising.",
    short:
      "The Profiler tab in React DevTools records interactions. Press record, perform the slow action, stop, and review the commits: a flamegraph shows which components rendered in each commit and how long they took, and a ranked chart lists the slowest. You can enable recording of why a component rendered, such as props or state changes. Look for components that render often with no change, or take a long time, then fix those. Profile a production-like build because development mode is slower.",
    detail: [
      "Components that did not render in a commit are shown greyed out.",
      "React's Strict Mode renders twice in development, which can inflate numbers.",
      "Compare before and after to prove an optimisation worked.",
    ],
    ex: "Profiling a typing delay reveals the whole page re-renders per keystroke because state lives too high.",
    mistakes: [
      "Profiling in development and trusting the absolute times.",
      "Optimising components the profiler never flagged.",
    ],
    follow: ["What does a greyed-out component mean?"],
    points: [
      "Record, interact, stop",
      "Flamegraph and ranked views",
      "See why a component rendered",
      "Compare before and after",
    ],
    notes: ["Record the slow action."],
    src: [
      ["React: React Developer Tools", `${RD}/learn/react-developer-tools`],
      ["React: Profiler", `${RD}/reference/react/Profiler`],
    ],
  }),
  q({
    slug: "profiler-component-onrender",
    topic: "React Profiler",
    d: "hard",
    title: "What is the <Profiler> component and its onRender callback?",
    kw: [
      "Profiler component",
      "onRender",
      "actualDuration",
      "phase",
      "production profiling",
    ],
    intent:
      "Checks you know the programmatic profiler and its production limitation.",
    short:
      '`<Profiler id="Sidebar" onRender={callback}>` wraps part of the tree and calls `onRender` each time a component inside commits an update. The callback receives the id, the phase (`mount`, `update` or `nested-update`), and timings such as `actualDuration`, the time spent rendering the profiled tree for that commit. It adds overhead, so it is disabled in production builds by default; you need a special profiling build to use it there. Use it for targeted measurements or sending data to analytics in controlled setups.',
    detail: [
      "Profile specific subtrees, not the entire app.",
      "Timings in development are inflated compared with production.",
      "For most debugging, the DevTools Profiler is easier.",
    ],
    ex: "A dashboard logs the render duration of its chart panel during a performance investigation.",
    code: [
      [
        "Profiler",
        "tsx",
        `<Profiler id="Chart" onRender={(id, phase, actualDuration) => {\n  console.log(id, phase, actualDuration)\n}}>\n  <Chart data={data} />\n</Profiler>`,
        [
          "The callback runs after each commit of the subtree.",
          "`actualDuration` is the render time.",
        ],
      ],
    ],
    mistakes: [
      "Leaving profilers in production code.",
      "Reading development timings as production numbers.",
    ],
    follow: ["Why is it disabled in production?"],
    points: [
      "Wraps a subtree",
      "onRender gets id, phase, durations",
      "Overhead, off in production by default",
      "Use for targeted measurement",
    ],
    notes: ["Targeted measurement tool."],
    src: [["React: Profiler", `${RD}/reference/react/Profiler`]],
  }),
  q({
    slug: "measure-production-build",
    topic: "React Profiler",
    d: "easy",
    title: "Why should you measure performance on a production build?",
    kw: [
      "production build",
      "development mode",
      "minification",
      "strict mode",
      "measurement",
    ],
    intent: "Checks you do not draw conclusions from development-mode numbers.",
    short:
      "Development builds include extra checks, warnings, source maps and, in React, Strict Mode double rendering, and they are not minified, so they are slower and bigger than production builds. Performance numbers from `npm run dev` can mislead you into optimising the wrong things or missing real problems. Build the app for production, serve it, and measure that, ideally on a throttled CPU and network that represent real devices.",
    detail: [
      "Run a production preview locally for quick checks.",
      "Test on a real mid-range phone when possible.",
      "Repeat measurements, since single runs vary.",
    ],
    ex: "A page that feels slow in dev is fast in a production build, so the planned optimisation is dropped.",
    mistakes: [
      "Tuning based on dev-server timings.",
      "One measurement on a fast laptop.",
    ],
    follow: ["What does Strict Mode do in development?"],
    points: [
      "Dev builds are slower",
      "Extra checks and double renders",
      "Measure the production build",
      "Throttle to simulate real devices",
    ],
    notes: ["Measure what you ship."],
    src: [
      ["React: Profiler", `${RD}/reference/react/Profiler`],
      ["Chrome DevTools: Analyze runtime performance", `${DT}/performance`],
    ],
  }),
  q({
    slug: "lighthouse-what-it-measures",
    topic: "Lighthouse",
    d: "easy",
    title: "What is Lighthouse and what does it audit?",
    kw: ["lighthouse", "audit", "performance score", "accessibility", "seo"],
    intent: "Checks you know what the tool is and where it runs.",
    short:
      "Lighthouse is an open-source, automated tool for improving the quality of web pages. It runs a series of audits against a URL, covering performance, accessibility, SEO and best practices, then produces a report with scores and guidance on how to fix failed audits. You can run it in Chrome DevTools, from the command line, as a Node module in CI, or from a web UI such as PageSpeed Insights.",
    detail: [
      "Each audit explains why it matters and how to fix it.",
      "Lighthouse CI can fail a build if scores regress.",
      "It tests one page load in a lab, so it does not replace real user data.",
    ],
    ex: "A developer runs Lighthouse in DevTools and sees that large unoptimised images are the main performance problem.",
    mistakes: [
      "Treating the score as the goal.",
      "Running it with extensions installed that skew results.",
    ],
    follow: ["Where can Lighthouse run?"],
    points: [
      "Automated page audits",
      "Performance, accessibility, SEO, best practices",
      "DevTools, CLI, Node, web UI",
      "Lab data",
    ],
    notes: ["A lab audit with fix guidance."],
    src: [["Chrome: Lighthouse overview", `${LH}/overview`]],
  }),
  q({
    slug: "lighthouse-performance-score",
    topic: "Lighthouse",
    d: "medium",
    title:
      "How is the Lighthouse performance score calculated, and why does it fluctuate?",
    kw: [
      "performance score",
      "metrics weights",
      "variability",
      "opportunities",
      "diagnostics",
    ],
    intent: "Checks you read the score correctly.",
    short:
      "The Lighthouse performance score is a weighted combination of lab metric results, such as First Contentful Paint, Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift and Speed Index. Only metrics contribute to the score; opportunities and diagnostics do not, although fixing them usually improves the metrics indirectly. The score varies between runs because of network conditions, the device, browser extensions, A/B tests and ads, so it is better to run several times and look at trends than at a single number.",
    detail: [
      "Compare runs under the same conditions.",
      "Focus on the metrics and the failed audits, not only the headline number.",
      "Field data should confirm that a change helped real users.",
    ],
    ex: "A score that moves from 85 to 91 with no code change is explained by run-to-run variation.",
    mistakes: [
      "Chasing a perfect 100.",
      "Comparing scores from different machines.",
    ],
    follow: ["What do opportunities do for the score?"],
    points: [
      "Weighted lab metrics",
      "Opportunities do not count directly",
      "Scores vary between runs",
      "Use trends and several runs",
    ],
    notes: ["Look at metrics, not just the score."],
    src: [
      [
        "Chrome: Lighthouse performance scoring",
        `${LH}/performance/performance-scoring`,
      ],
    ],
  }),
  q({
    slug: "lighthouse-in-ci-and-budgets",
    topic: "Lighthouse",
    d: "hard",
    title: "How would you use Lighthouse to prevent performance regressions?",
    kw: [
      "lighthouse ci",
      "performance budget",
      "regression",
      "ci pipeline",
      "thresholds",
    ],
    intent: "Checks you can make performance part of the delivery process.",
    short:
      "Run Lighthouse automatically in CI on key pages, using Lighthouse CI or the Node module, and fail the build or flag the pull request if scores or specific metrics fall below agreed limits. Combine it with performance budgets, such as a maximum JavaScript size or maximum LCP in the lab, so regressions are caught before release. Keep the test environment consistent and run several times, because lab results vary. Still monitor field data after release.",
    detail: [
      "Pick a few important pages, such as the landing and checkout pages.",
      "Budgets should reflect user goals, not arbitrary numbers.",
      "Store results over time to see trends.",
    ],
    ex: "A pull request that adds a large charting library fails the bundle-size budget before it is merged.",
    mistakes: [
      "Gating on a single noisy run.",
      "Budgets that nobody revisits.",
    ],
    follow: ["What is a performance budget?"],
    points: [
      "Automate in CI",
      "Budgets for size and metrics",
      "Consistent environment, multiple runs",
      "Confirm with field data",
    ],
    notes: ["Catch regressions before release."],
    src: [
      ["Chrome: Lighthouse overview", `${LH}/overview`],
      ["web.dev: Performance budgets 101", `${W}/performance-budgets-101`],
    ],
  }),
  q({
    slug: "devtools-performance-panel",
    topic: "Chrome DevTools",
    d: "medium",
    title:
      "How do you find a bottleneck with the Chrome DevTools Performance panel?",
    kw: [
      "performance panel",
      "flame chart",
      "long task",
      "cpu throttling",
      "main thread",
    ],
    intent: "Checks you can record and read a performance trace.",
    short:
      "Open the Performance panel, set CPU throttling (for example 4x slowdown) to simulate a mobile device, start recording, perform the action or load the page, and stop. The trace shows a timeline with a flame chart of main-thread activity. Look for long tasks, which run for more than 50 ms and are flagged, then expand them to see which functions took the time, such as scripting, rendering or layout. The panel also shows frames, network requests and Web Vitals markers.",
    detail: [
      "Record in an incognito window without extensions to reduce noise.",
      "Wide bars in the flame chart are the expensive calls.",
      "Repeated layout work after reading and writing styles suggests layout thrashing.",
    ],
    ex: "A trace of a laggy click shows a 400 ms task in a handler that filters a huge array.",
    mistakes: [
      "Profiling with extensions enabled.",
      "Not throttling CPU on a fast laptop.",
    ],
    follow: ["What is a long task?"],
    points: [
      "Throttle CPU first",
      "Record the action",
      "Find long tasks in the flame chart",
      "Expand to the expensive function",
    ],
    notes: ["Record, find the wide bar."],
    src: [
      ["Chrome DevTools: Analyze runtime performance", `${DT}/performance`],
      ["web.dev: Optimize long tasks", `${W}/optimize-long-tasks`],
    ],
  }),
  q({
    slug: "devtools-network-panel",
    topic: "Chrome DevTools",
    d: "easy",
    title: "What can you learn from the Network panel?",
    kw: [
      "network panel",
      "waterfall",
      "throttling",
      "disable cache",
      "request size",
    ],
    intent: "Checks you can diagnose loading problems.",
    short:
      "The Network panel lists every request with its status, type, size, timing and initiator. The waterfall shows when each request started and how long it took, which reveals slow servers, large files, request chains and render-blocking resources. You can throttle the network to simulate slow connections, disable the cache to see a first-time visit, filter by type, and inspect headers such as `Cache-Control` and `Content-Encoding`. It is the first place to look when a page loads slowly.",
    detail: [
      "Large transfer sizes suggest compression or image optimisation is needed.",
      "Many sequential requests suggest preloading or bundling opportunities.",
      "Check that static assets have long cache lifetimes.",
    ],
    ex: "The waterfall shows an uncompressed 2 MB JavaScript file, which leads to enabling compression.",
    mistakes: [
      "Testing only on a fast, cached connection.",
      "Ignoring response headers.",
    ],
    follow: ["Why disable the cache while testing?"],
    points: [
      "Requests with size and timing",
      "Waterfall shows order and delay",
      "Throttle the network",
      "Inspect caching and compression headers",
    ],
    notes: ["Waterfall tells the story."],
    src: [
      ["Chrome DevTools: Network features reference", `${DT}/network`],
      [
        "web.dev: Reduce network payloads using text compression",
        `${W}/reduce-network-payloads-using-text-compression`,
      ],
    ],
  }),
  q({
    slug: "devtools-memory-leaks",
    topic: "Chrome DevTools",
    d: "hard",
    title: "How do you detect and fix memory leaks in a front-end app?",
    kw: [
      "memory leak",
      "heap snapshot",
      "detached dom",
      "event listeners",
      "cleanup",
    ],
    intent: "Checks you know common leak sources and how to investigate.",
    short:
      "A memory leak occurs when memory that is no longer needed is still referenced, so it is never freed and usage grows over time, making the page slower or crash. The Memory panel in Chrome DevTools lets you take heap snapshots before and after repeating an action and compare them, and shows detached DOM nodes and growing object counts. Common causes are event listeners, timers and subscriptions that are not removed, closures holding large data, and growing global caches. In React, return a cleanup function from `useEffect` to remove them.",
    detail: [
      "Navigate back and forth several times and see if memory returns to baseline.",
      "Abort in-flight requests when a component unmounts.",
      "Use weak references or limits for caches.",
    ],
    ex: "A chart component adds a window resize listener and never removes it, so every visit to the page leaves another listener behind.",
    code: [
      [
        "Clean up a listener",
        "tsx",
        `useEffect(() => {\n  const onResize = () => setWidth(window.innerWidth)\n  window.addEventListener("resize", onResize)\n  return () => window.removeEventListener("resize", onResize)\n}, [])`,
        [
          "The effect adds the listener.",
          "The returned cleanup removes it on unmount.",
        ],
      ],
    ],
    mistakes: [
      "Not removing listeners or intervals.",
      "Assuming the garbage collector will always free it.",
    ],
    follow: ["What is a detached DOM node?"],
    points: [
      "Unneeded memory still referenced",
      "Compare heap snapshots",
      "Common: listeners, timers, subscriptions",
      "Clean up in useEffect",
    ],
    notes: ["Add it, remove it."],
    src: [
      ["Chrome DevTools: Fix memory problems", `${DT}/memory-problems`],
      ["React: useEffect", `${RD}/reference/react/useEffect`],
    ],
  }),
  q({
    slug: "caching-compression-fonts",
    topic: "Chrome DevTools",
    d: "medium",
    title:
      "Which network-level optimisations give the biggest gains for static assets?",
    kw: [
      "http caching",
      "compression",
      "brotli gzip",
      "fonts",
      "cache-control",
    ],
    intent:
      "Checks you know the delivery-side basics that complement code changes.",
    short:
      "Compress text assets such as HTML, CSS, JavaScript and JSON with gzip or Brotli, which can greatly reduce transfer size. Cache static files with long lifetimes using `Cache-Control` and give them content-hashed filenames, so a new deploy gets new URLs while unchanged files stay cached. Serve images in appropriate sizes and modern formats, and load web fonts efficiently, for example with `font-display: swap` so text shows with a fallback font immediately. A CDN brings content closer to users.",
    detail: [
      "HTML is usually cached briefly or revalidated, while hashed assets can be cached for a long time.",
      "Check the response headers in the Network panel to confirm they are applied.",
      "Preloading critical resources can help the LCP element start sooner.",
    ],
    ex: "After enabling Brotli and long-lived caching with hashed filenames, repeat visits download almost nothing.",
    mistakes: [
      "Long cache lifetimes on files with fixed names.",
      "Serving large uncompressed text files.",
    ],
    follow: ["Why use hashed filenames?"],
    points: [
      "Compress text assets",
      "Long cache with hashed names",
      "Right-sized modern images",
      "font-display and CDN",
    ],
    notes: ["Compress, cache, size right."],
    src: [
      [
        "web.dev: Prevent unnecessary network requests with the HTTP cache",
        `${W}/http-cache`,
      ],
      [
        "web.dev: Reduce network payloads using text compression",
        `${W}/reduce-network-payloads-using-text-compression`,
      ],
      [
        "MDN: font-display",
        `${M}/Web/CSS/Reference/At-rules/@font-face/font-display`,
      ],
    ],
  }),
])
