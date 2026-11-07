import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "single-page-applications",
  title: "Single-page applications: routing, data loading and structure",
  topic: "Single-page applications",
  minutes: 45,
  overview:
    "Understand how a single-page application works in the browser, add client-side routing, and plan loading states, URLs and deployment.",
  objectives: [
    "Explain how a single-page application differs from a server-rendered site",
    "Set up routes, links, parameters and nested layouts",
    "Plan data loading, error states and deployment of a single-page app",
  ],
  prerequisites: ["lesson.react.component-architecture"],
  sections: [
    {
      kind: "explain",
      heading: "What a single-page application is",
      body: [
        "A **single-page application (SPA)** loads one HTML page and a bundle of JavaScript. After that, navigation happens in the browser: the app changes what is shown and the address in the address bar, without asking the server for a new HTML page. Data comes from APIs as JSON.",
        "The benefits are fast transitions after the first load and a smooth, app-like feel. The costs are a larger first download, the need for the app to handle loading and errors, extra work for search engines and for social previews, and the need to handle the browser history and the URL yourself.",
        "React alone does not include routing. A **router** library, or a framework built on React, provides it.",
      ],
    },
    {
      kind: "explain",
      heading: "Client-side routing",
      body: [
        "A router maps URLs to components. It listens to changes of the address, shows the matching route, and uses the browser **History API** to change the address without a page load. Links use a special `Link` component, which changes the route without a reload, and a normal `a` tag would reload the page.",
        "Routes can have **parameters**, such as `/orders/:id`, read with a hook. Routes can be **nested**: a parent route draws a layout, such as a header and a menu, with an outlet where the child route appears. A catch-all route shows a not-found page. Pages that need a login are placed behind a guard that redirects to the login page.",
        "Put the state that should survive a refresh or be shareable in the **URL**: the selected tab, the page number, a search term and the filters. Then the back button works and a link can be shared.",
      ],
    },
    {
      kind: "code",
      heading: "Routes, links and parameters",
      example: {
        title: "A small router setup",
        language: "jsx",
        code: "import { createBrowserRouter, RouterProvider, Link, Outlet, useParams } from 'react-router';\n\nfunction Layout() {\n  return (\n    <>\n      <nav>\n        <Link to=\"/\">Home</Link> <Link to=\"/orders\">Orders</Link>\n      </nav>\n      <Outlet />\n    </>\n  );\n}\nfunction Order() {\n  const { id } = useParams();\n  return <h1>Order {id}</h1>;\n}\n\nconst router = createBrowserRouter([\n  {\n    path: '/',\n    element: <Layout />,\n    children: [\n      { index: true, element: <h1>Home</h1> },\n      { path: 'orders/:id', element: <Order /> },\n      { path: '*', element: <h1>Not found</h1> },\n    ],\n  },\n]);\n\nexport default function App() {\n  return <RouterProvider router={router} />;\n}",
        walkthrough: [
          "The `Layout` route shows the navigation and an `Outlet`, where the child route appears.",
          "`orders/:id` has a parameter, read with `useParams`.",
          "`Link` changes the route without reloading the page, and `*` catches unknown URLs.",
          "The package and function names depend on the router version, so check the router documentation for your version.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Loading data, errors and deployment",
      body: [
        "Every screen that loads data needs three states: **loading**, **error** and **success**, and often a fourth: **empty**. Show something useful in each of them. Data libraries and router loaders help by managing caching, retries and loading flags.",
        "Because the server only has one HTML file, a direct visit to `/orders/5` or a refresh must also return `index.html`, or the server answers with a 404. Configure the host with a **fallback to index.html** for unknown paths. Plan for the title and the focus on route changes: update `document.title`, and move focus to the main heading, so keyboard and screen reader users know that the page changed.",
        "Split the code **by route** with `lazy` so that the first download stays small, and think about whether a framework with server rendering suits the project, if search visibility or first display speed are important.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `<a href>` for internal navigation.",
          fix: "Use the router `Link`, or the page reloads and the state is lost.",
        },
        {
          mistake: "Keeping the active tab or page number only in state.",
          fix: "Put it in the URL, so refresh, back and sharing work.",
        },
        {
          mistake: "Forgetting the server fallback to `index.html`.",
          fix: "Configure the host to return it for unknown paths.",
        },
        {
          mistake: "Not announcing route changes to assistive technology.",
          fix: "Update the title and move focus to the new page heading.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An orders area",
      scenario:
        "An application has a list of orders, an order detail page and a login.",
      body: [
        "Define the routes `/orders` and `/orders/:id`, inside a layout with navigation. Guard them behind the login. Keep the filter and page number in the query string. Lazy-load the order detail page, and show loading and error states on both pages.",
        "A user can refresh, go back, or share a link to a filtered list and see the same screen.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "spa-def",
      prompt: "How does navigation work in a single-page application?",
      options: [
        "JavaScript changes the view and the URL without a full page load",
        "The server sends a new HTML page for each click",
        "The browser downloads the whole app again",
      ],
      answer: 0,
      explanation:
        "Client-side routing uses the History API to change the address and the view.",
    },
    {
      type: "single",
      id: "link-vs-a",
      prompt:
        "Why use the router `Link` and not a plain `a` tag for internal pages?",
      options: [
        "A plain a tag reloads the whole page",
        "Link is faster to type",
        "a tags do not work in React",
      ],
      answer: 0,
      explanation:
        "A normal anchor makes the browser load a new page, and the app state is lost.",
    },
    {
      type: "truefalse",
      id: "url-state",
      statement:
        "State such as the current page number is better kept in the URL when users need back, refresh and sharing to work.",
      answer: true,
      explanation:
        "State in the URL survives refresh, works with the back button and can be shared.",
    },
    {
      type: "blank",
      id: "fallback-file",
      prompt:
        "A SPA host must return ___.html for unknown paths so that a refresh on a deep link works.",
      answer: "index",
      explanation:
        "The app reads the path and shows the right route, so the server must return the same HTML file.",
    },
  ],
  assignment: {
    title: "A routed mini app",
    task: [
      "Build a three-page app with a layout, a list page, a detail page with a parameter and a not-found page.",
      "Store a filter in the query string, lazy-load one page, and show loading and error states.",
    ],
    checklist: [
      "A refresh on the detail page works",
      "The back button restores the filter",
      "The page title changes on each route",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "route-plan",
      title: "Plan the routes",
      task: [
        "For a bookstore with a catalogue, a book page, a cart, a checkout that needs a login and an account area, write the route table as an array of objects with `path`, the component name, and whether it needs a login.",
      ],
      language: "jsx",
      starter:
        "const routes = [\n  // { path: '/', page: 'Catalogue', needsLogin: false },\n];",
      solution:
        "const routes = [\n  { path: '/', page: 'Catalogue', needsLogin: false },\n  { path: '/books/:id', page: 'BookPage', needsLogin: false },\n  { path: '/cart', page: 'Cart', needsLogin: false },\n  { path: '/checkout', page: 'Checkout', needsLogin: true },\n  { path: '/account', page: 'Account', needsLogin: true },\n  { path: '*', page: 'NotFound', needsLogin: false },\n];",
      hints: [
        "Do not forget the not-found route, and keep the book id as a parameter.",
      ],
      checklist: [
        "The book page uses a parameter",
        "Checkout and account need a login",
        "There is a catch-all route",
      ],
    },
  ],
  revisionNotes: [
    "An SPA loads one page, then changes views and URLs in the browser",
    "Use the router `Link`, route parameters, nested layouts and a not-found route",
    "Keep shareable state in the URL; handle loading, error, empty and success",
    "The host needs a fallback to index.html; update the title and focus on route changes",
  ],
  resources: [
    {
      label: "React: Start a New React Project",
      url: "https://react.dev/learn/start-a-new-react-project",
    },
    {
      label: "React: Synchronizing with Effects",
      url: "https://react.dev/learn/synchronizing-with-effects",
    },
  ],
})
