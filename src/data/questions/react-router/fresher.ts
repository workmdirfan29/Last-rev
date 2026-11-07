import { defineQuestions } from "../author"
import { q } from "../compact"

const R = "https://reactrouter.com"
const A = `${R}/api`

export default defineQuestions("react-router", "fresher", [
  q({
    slug: "what-is-client-side-routing",
    topic: "Routes",
    d: "easy",
    title: "What is client-side routing and why does a React app use it?",
    kw: [
      "client-side routing",
      "single page application",
      "history api",
      "react router",
      "navigation",
    ],
    intent: "Checks you understand why a single-page app needs a router.",
    short:
      "Client-side routing means the browser stays on one HTML page while JavaScript changes the URL with the History API and swaps the components shown for each route. Clicking a link does not request a new document from the server, so navigation is fast and state in the app, such as a layout, can be kept. React Router is the common library that maps URLs to components and keeps the address bar in sync.",
    detail: [
      "Each URL such as `/products/42` is matched to a route that renders a component tree.",
      "Back and forward buttons keep working because the router uses browser history.",
      "The server must still return the app's `index.html` for deep links, otherwise a refresh on `/products/42` returns a 404.",
    ],
    ex: "In a dashboard, moving from Orders to Customers keeps the sidebar mounted and replaces only the main panel, with no full page reload.",
    mistakes: [
      "Using plain `a` tags that reload the whole page.",
      "Forgetting server fallback to index.html for deep links.",
    ],
    follow: ["Why does refreshing a deep link sometimes give a 404?"],
    points: [
      "URL changes without a page load",
      "Routes map URLs to components",
      "History API keeps back and forward working",
      "Server needs an index.html fallback",
    ],
    notes: ["One document, many URLs."],
    src: [["React Router: Routing", `${R}/start/declarative/routing`]],
  }),
  q({
    slug: "routes-and-route-components",
    topic: "Routes",
    d: "easy",
    title: "How do you declare routes with BrowserRouter, Routes and Route?",
    kw: ["BrowserRouter", "Routes", "Route", "path", "element"],
    intent: "Checks you can set up basic routing from scratch.",
    short:
      'Wrap the app in a router such as `BrowserRouter`, which enables routing using the browser\'s history. Inside it, `Routes` holds a set of `Route` elements; each `Route` has a `path` and an `element` to render. The router matches the current URL against the paths and renders the matching element. A route with `path="*"` can act as a catch-all for unknown URLs.',
    detail: [
      "`Routes` picks the best match, so the order of routes in the code does not matter.",
      "Data routers such as `createBrowserRouter` define the same tree as route objects.",
      "The router must be an ancestor of any `Link` or routing hook.",
    ],
    ex: "An app declares `/` for Home, `/about` for About and `*` for a Not Found page.",
    code: [
      [
        "Basic routes",
        "tsx",
        `import { BrowserRouter, Routes, Route } from "react-router"\n\nexport function App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  )\n}`,
        [
          "`BrowserRouter` provides routing context.",
          "Each `Route` maps a path to an element.",
          "The `*` route catches everything else.",
        ],
      ],
    ],
    mistakes: [
      "Using Link or hooks outside a router.",
      "Forgetting a catch-all route.",
    ],
    follow: ["What does the * path do?"],
    points: [
      "Router wraps the app",
      "Routes holds Route children",
      "path + element",
      "* for not found",
    ],
    notes: ["Router > Routes > Route."],
    src: [
      ["React Router: Routing (declarative)", `${R}/start/declarative/routing`],
      ["React Router: Routes", `${A}/components/Routes`],
    ],
  }),
  q({
    slug: "dynamic-segments-useparams",
    topic: "Routes",
    d: "easy",
    title: "How do dynamic route parameters work with useParams?",
    kw: [
      "useParams",
      "dynamic segment",
      "route parameter",
      "path param",
      "string",
    ],
    intent: "Checks you can read values out of the URL path.",
    short:
      'A path segment that starts with a colon, such as `/users/:userId`, is a dynamic segment that matches any value in that position. Inside the matched component the `useParams` hook returns an object with those values, for example `{ userId: "42" }`. The values are always strings, so convert them yourself if you need a number, and remember they can be undefined if the route does not define them.',
    detail: [
      "Several segments are allowed: `/shops/:shopId/items/:itemId`.",
      "Use the param to fetch the right record, and handle a missing or invalid id.",
      "Params belong in the path for identifying a resource; filters belong in the query string.",
    ],
    ex: "A product detail page at `/products/:productId` reads the id and fetches that product.",
    code: [
      [
        "Reading a param",
        "tsx",
        `<Route path="/products/:productId" element={<Product />} />\n\nfunction Product() {\n  const { productId } = useParams()\n  return <h1>Product {productId}</h1>\n}`,
        [
          "`:productId` matches any single segment.",
          "`useParams` returns it as a string.",
        ],
      ],
    ],
    mistakes: [
      "Treating the param as a number without converting.",
      "Not handling an id that does not exist.",
    ],
    follow: ["How is a query string read differently?"],
    points: [
      "Colon prefix marks a param",
      "useParams returns strings",
      "Multiple params allowed",
      "Identify resources in the path",
    ],
    notes: ["Params are always strings."],
    src: [["React Router: useParams", `${A}/hooks/useParams`]],
  }),
  q({
    slug: "not-found-splat-route",
    topic: "Routes",
    d: "easy",
    title: "How do you show a 404 page for unknown URLs?",
    kw: ["not found", "splat route", "catch-all", "path star", "404"],
    intent: "Checks you handle URLs that match no route.",
    short:
      'Add a route with `path="*"`, called a splat route, which matches any URL that no other route matches. Because the router ranks matches, specific routes win over the splat, so it only shows when nothing else fits. The component can show a friendly message and a link home. Note that a client-side 404 page still comes from a successful server response, so it does not set an HTTP 404 status by itself.',
    detail: [
      "A splat can also capture the rest of a path, which is available as the `*` param.",
      "Inside a nested route a splat only catches unmatched paths under that parent.",
      "Do not leave users on a blank screen for unknown URLs.",
    ],
    ex: "Visiting `/oders` (a typo) shows a 'Page not found' message with a link back to Orders and Home.",
    mistakes: [
      "No catch-all route so the page is blank.",
      "Assuming the browser receives an HTTP 404 status.",
    ],
    follow: ["Where would you put a 404 inside a layout?"],
    points: [
      'path="*" matches the rest',
      "Specific routes still win",
      "Show a helpful message",
      "Does not itself set an HTTP status",
    ],
    notes: ["Always add a * route."],
    src: [
      ["React Router: Route", `${A}/components/Route`],
      ["React Router: Routing", `${R}/start/declarative/routing`],
    ],
  }),
  q({
    slug: "route-ranking-and-matching",
    topic: "Routes",
    d: "medium",
    title: "How does React Router decide which route matches?",
    kw: [
      "route matching",
      "ranking",
      "specificity",
      "static segment",
      "dynamic",
    ],
    intent: "Checks you know matching is by best fit, not by order.",
    short:
      "React Router ranks the routes that match the URL and renders the best one, rather than the first one in the list. Static segments such as `/users/new` rank higher than dynamic ones like `/users/:id`, and both rank higher than a splat `*`. So you do not need to order routes carefully, and `/users/new` will not be mistaken for a user with the id `new`.",
    detail: [
      "Matching is applied segment by segment against the URL path.",
      "Index routes match the parent's exact path.",
      "Matching is case-insensitive by default.",
    ],
    ex: "With both `/users/new` and `/users/:id` defined, visiting `/users/new` shows the create form and `/users/7` shows user 7.",
    mistakes: [
      "Assuming the first listed route wins.",
      "Naming a dynamic param route to compete with a static one without checking.",
    ],
    follow: ["What does an index route match?"],
    points: [
      "Best match wins, not order",
      "Static > dynamic > splat",
      "Segment by segment",
      "Case-insensitive by default",
    ],
    notes: ["Ranking beats order."],
    src: [
      ["React Router: Routing", `${R}/start/declarative/routing`],
      ["React Router: Route", `${A}/components/Route`],
    ],
  }),
  q({
    slug: "nested-routes-and-outlet",
    topic: "Nested routes",
    d: "easy",
    title: "What are nested routes and what does Outlet do?",
    kw: ["nested routes", "Outlet", "child routes", "layout", "parent route"],
    intent: "Checks you understand how a parent route renders its children.",
    short:
      "Nested routes put `Route` elements inside another `Route`, so URLs map to a tree of components. The child's path is added to the parent's path. The parent's component renders the `Outlet` component wherever the matching child should appear, so shared layout like a header or a sidebar stays in place while only the outlet content changes.",
    detail: [
      "Nesting mirrors the UI: a settings page with tabs has a parent for the page and a child for each tab.",
      "If the parent does not render an `Outlet`, the children never show.",
      "The tree of matches is also used by data loading and error handling.",
    ],
    ex: "`/settings/profile` and `/settings/billing` share a Settings layout with a side menu and render their own panels in the outlet.",
    code: [
      [
        "Parent with Outlet",
        "tsx",
        `<Route path="settings" element={<SettingsLayout />}>\n  <Route path="profile" element={<Profile />} />\n  <Route path="billing" element={<Billing />} />\n</Route>\n\nfunction SettingsLayout() {\n  return (\n    <div>\n      <SettingsMenu />\n      <Outlet />\n    </div>\n  )\n}`,
        [
          "Child paths are joined to `settings`.",
          "`Outlet` marks where the active child renders.",
          "The menu stays mounted between children.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to render Outlet in the parent.",
      "Repeating the parent path in the child's path.",
    ],
    follow: ["What happens if the parent has no Outlet?"],
    points: [
      "Routes nest like the UI",
      "Child paths join the parent's",
      "Outlet shows the matched child",
      "Shared layout stays mounted",
    ],
    notes: ["No Outlet, no child."],
    src: [
      ["React Router: Outlet", `${A}/components/Outlet`],
      ["React Router: Routing", `${R}/start/declarative/routing`],
    ],
  }),
  q({
    slug: "layout-routes-and-index-routes",
    topic: "Nested routes",
    d: "medium",
    title: "What are layout routes and index routes?",
    kw: [
      "layout route",
      "index route",
      "pathless route",
      "default child",
      "nested",
    ],
    intent:
      "Checks you can share layouts without adding path segments, and give a parent a default child.",
    short:
      "A layout route is a route that wraps child routes in shared UI. If it has no `path`, it adds no URL segment and just provides the layout, for example a header shared by several pages. An index route is a child with the `index` prop instead of a path; it renders in the parent's `Outlet` when the URL matches the parent's path exactly, giving the parent a default child.",
    detail: [
      "An index route cannot have children.",
      "A pathless layout can group routes that need the same wrapper or guard.",
      "Without an index route, a parent matched on its own path renders an empty outlet.",
    ],
    ex: "A `/dashboard` parent shows an overview page by default through an index route, while `/dashboard/reports` shows the reports page.",
    code: [
      [
        "Index and pathless layout",
        "tsx",
        `<Route element={<AppLayout />}>\n  <Route index element={<Home />} />\n  <Route path="dashboard" element={<DashboardLayout />}>\n    <Route index element={<Overview />} />\n    <Route path="reports" element={<Reports />} />\n  </Route>\n</Route>`,
        [
          "The outer route has no path, so it only adds layout.",
          "`index` renders when the URL equals the parent path.",
          "`reports` renders under `/dashboard/reports`.",
        ],
      ],
    ],
    mistakes: [
      "Giving a layout route a path that appears in URLs by accident.",
      "Forgetting an index route so the parent shows an empty area.",
    ],
    follow: ["Can an index route have children?"],
    points: [
      "Layout route wraps children",
      "No path means no URL segment",
      "Index = default child",
      "Index cannot have children",
    ],
    notes: ["Index renders at the parent's exact URL."],
    src: [
      ["React Router: Route", `${A}/components/Route`],
      ["React Router: Routing", `${R}/start/declarative/routing`],
    ],
  }),
  q({
    slug: "relative-links-and-routes",
    topic: "Nested routes",
    d: "medium",
    title: "How do relative paths work in nested routes and links?",
    kw: [
      "relative link",
      "relative path",
      "to prop",
      "leading slash",
      "nested routes",
    ],
    intent: "Checks you know how a path without a leading slash is resolved.",
    short:
      'A child route\'s `path` without a leading slash is relative to its parent, and the same applies to a `Link` `to` value: `to="details"` resolves relative to the route the link is rendered in, while `to="/details"` is absolute from the root of the app. Relative links keep working if the parent path later changes, so use them inside nested sections and absolute paths for site-wide links like Home.',
    detail: [
      "`..` in a `to` value goes up a route level.",
      "Hard-coding full paths in every nested component makes route changes painful.",
      "The resolved path is what appears in the address bar.",
    ],
    ex: 'Inside `/projects/12`, a link with `to="settings"` goes to `/projects/12/settings`.',
    mistakes: [
      "Adding a leading slash by habit and breaking nested links.",
      "Hard-coding the parent path in every child.",
    ],
    follow: ["How would you link back to the parent?"],
    points: [
      "No leading slash = relative",
      "Leading slash = from the root",
      "Relative links survive path changes",
      "Use absolute for global links",
    ],
    notes: ["Leading slash decides absolute vs relative."],
    src: [
      ["React Router: Link", `${A}/components/Link`],
      ["React Router: Navigating", `${R}/start/declarative/navigating`],
    ],
  }),
  q({
    slug: "link-vs-anchor",
    topic: "Navigation",
    d: "easy",
    title: "What is the difference between Link and a plain anchor tag?",
    kw: [
      "Link",
      "anchor",
      "client-side navigation",
      "full page reload",
      "to prop",
    ],
    intent: "Checks you know why routing links should not be plain `a` tags.",
    short:
      "`Link` renders an `a` element but intercepts the click and tells the router to change the URL, so the app updates without a full page reload. A plain `<a href>` makes the browser request a new document from the server, throwing away the app's in-memory state. Use `Link` for navigation inside the app and a normal `a` for external sites. `Link` keeps normal link features such as opening in a new tab.",
    detail: [
      "`Link` takes `to` instead of `href`.",
      "It also supports `replace` and `state` options.",
      "A rendered `Link` is still a real link, so it stays accessible and crawlable.",
    ],
    ex: 'A navigation menu uses `<Link to="/orders">Orders</Link>` so the sidebar and fetched data survive the click.',
    code: [
      [
        "Link usage",
        "tsx",
        `import { Link } from "react-router"\n\n<Link to="/orders">Orders</Link>\n<a href="https://example.com">External site</a>`,
        [
          "`Link` navigates inside the app.",
          "A normal anchor is right for outside URLs.",
        ],
      ],
    ],
    mistakes: [
      "Using `a href` for internal pages and reloading the app.",
      "Using onClick with navigate on a div instead of a link.",
    ],
    follow: ["How do you open an internal route in a new tab?"],
    points: [
      "Link renders an anchor",
      "No page reload",
      "to, not href",
      "Anchor for external sites",
    ],
    notes: ["Internal: Link. External: a."],
    src: [
      ["React Router: Link", `${A}/components/Link`],
      ["React Router: Navigating", `${R}/start/declarative/navigating`],
    ],
  }),
  q({
    slug: "navlink-active-state",
    topic: "Navigation",
    d: "easy",
    title: "What is NavLink and how does it show the active page?",
    kw: [
      "NavLink",
      "active class",
      "aria-current",
      "end prop",
      "navigation menu",
    ],
    intent: "Checks you can style the current menu item.",
    short:
      '`NavLink` is a `Link` that knows whether it matches the current URL. By default it adds an `active` class and `aria-current="page"` to the rendered anchor when it is active, and it also marks a pending state while navigation is loading. You can pass a function to `className` or `style` that receives `isActive` and `isPending` to style it your way. The `end` prop makes a link active only on an exact match, which is needed for the home link.',
    detail: [
      "Without `end`, a link to `/` would be active on every page because every path starts with it.",
      "`aria-current` helps screen reader users know the current page.",
      "Use plain `Link` for links that do not need active styling.",
    ],
    ex: "A top menu highlights the Orders item while the user is on `/orders` and `/orders/17`.",
    code: [
      [
        "Active styling",
        "tsx",
        `<NavLink\n  to="/"\n  end\n  className={({ isActive }) => (isActive ? "nav active" : "nav")}\n>\n  Home\n</NavLink>`,
        [
          "`end` stops Home being active everywhere.",
          "The `className` function receives `isActive`.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting `end` on the root link.",
      "Styling active links with manual path checks.",
    ],
    follow: ["What does aria-current do?"],
    points: [
      "Link with active awareness",
      "Adds active class and aria-current",
      "className can be a function",
      "Use end for exact matching",
    ],
    notes: ["end on the home link."],
    src: [["React Router: NavLink", `${A}/components/NavLink`]],
  }),
  q({
    slug: "usenavigate-hook",
    topic: "Navigation",
    d: "easy",
    title: "When should you use the useNavigate hook?",
    kw: [
      "useNavigate",
      "programmatic navigation",
      "replace",
      "navigate -1",
      "redirect",
    ],
    intent: "Checks you navigate imperatively only where a link will not do.",
    short:
      '`useNavigate` returns a function that changes the URL from code, for example after a form submits or a timer finishes: `navigate("/orders")`. Passing a number such as `navigate(-1)` goes back in history, and `{ replace: true }` replaces the current history entry instead of adding one. For ordinary clicks prefer `Link`, because it is a real link and works with keyboards, screen readers and open-in-new-tab.',
    detail: [
      "Calling `navigate` during render is a bug; call it in an event handler or an effect.",
      "`replace` avoids the Back button returning to a page such as a finished login.",
      "In data routers, returning `redirect()` from a loader or action is often cleaner.",
    ],
    ex: 'After a successful login the app calls `navigate("/dashboard", { replace: true })` so Back does not return to the login form.',
    code: [
      [
        "Navigate after an action",
        "tsx",
        `const navigate = useNavigate()\n\nasync function onSubmit() {\n  await save()\n  navigate("/orders", { replace: true })\n}`,
        [
          "`navigate` is called after the async work finishes.",
          "`replace` swaps the history entry.",
        ],
      ],
    ],
    mistakes: [
      "Calling navigate during render.",
      "Using onClick plus navigate where a Link would be accessible.",
    ],
    follow: ["What does navigate(-1) do?"],
    points: [
      "Imperative navigation",
      "navigate(-1) goes back",
      "replace swaps the history entry",
      "Prefer Link for clicks",
    ],
    notes: ["Link for clicks, navigate for results."],
    src: [["React Router: useNavigate", `${A}/hooks/useNavigate`]],
  }),
  q({
    slug: "navigate-component-redirect",
    topic: "Navigation",
    d: "easy",
    title: "How do you redirect declaratively with the Navigate component?",
    kw: ["Navigate", "redirect", "replace", "declarative", "legacy path"],
    intent: "Checks you know how to redirect while rendering.",
    short:
      'Rendering `<Navigate to="/login" replace />` changes the location as soon as the component renders, which is useful for redirecting when some condition is true, such as a user who is not signed in or an old URL that moved. Using `replace` keeps the redirect out of the history stack, so the Back button does not bounce the user straight back to the redirecting page.',
    detail: [
      "It is the component form of `useNavigate`, so it works inside JSX without handlers.",
      "In data routers, `redirect()` in a loader happens before rendering at all.",
      "Do not render it unconditionally or it loops.",
    ],
    ex: 'An old `/home` URL is kept working by a route that renders `<Navigate to="/" replace />`.',
    code: [
      [
        "Redirect an old path",
        "tsx",
        `<Route path="/home" element={<Navigate to="/" replace />} />`,
        ["Visiting `/home` immediately replaces it with `/`."],
      ],
    ],
    mistakes: [
      "Forgetting `replace` and trapping the Back button.",
      "Rendering Navigate without a condition and causing a loop.",
    ],
    follow: ["How does a loader redirect differ?"],
    points: [
      "Redirects on render",
      "Use replace to keep history clean",
      "Component form of navigate",
      "Guard it with a condition",
    ],
    notes: ["Navigate replace for redirects."],
    src: [["React Router: Navigate", `${A}/components/Navigate`]],
  }),
  q({
    slug: "usesearchparams-hook",
    topic: "Navigation",
    d: "medium",
    title: "How do you read and update query strings with useSearchParams?",
    kw: [
      "useSearchParams",
      "query string",
      "filters",
      "URLSearchParams",
      "shareable state",
    ],
    intent: "Checks you can keep filter and page state in the URL.",
    short:
      '`useSearchParams` works like `useState` for the query string: it returns the current `URLSearchParams` and a setter. Read a value with `searchParams.get("page")` (a string or null) and update the URL by calling `setSearchParams` with new values. Keeping filters, sorting and page numbers in the URL makes the view shareable, bookmarkable and restorable with the Back button.',
    detail: [
      "Values are strings, so parse numbers and give defaults for missing ones.",
      "Setting params replaces the existing query, so copy the current params when you want to keep others.",
      "Validate values from the URL, since anyone can edit it.",
    ],
    ex: "A product list reads `?category=shoes&page=2` to decide what to show, so a shared link opens the same view.",
    code: [
      [
        "Page from the URL",
        "tsx",
        `const [params, setParams] = useSearchParams()\nconst page = Number(params.get("page") ?? "1")\n\nfunction next() {\n  setParams({ page: String(page + 1) })\n}`,
        [
          "`get` returns a string, converted with `Number`.",
          "`setParams` updates the URL and re-renders.",
        ],
      ],
    ],
    mistakes: [
      "Treating values as numbers.",
      "Trusting the URL value without validation.",
    ],
    follow: ["Why keep filter state in the URL?"],
    points: [
      "Query string as state",
      "get returns string or null",
      "Shareable and bookmarkable",
      "Validate URL input",
    ],
    notes: ["URL state is shareable state."],
    src: [["React Router: useSearchParams", `${A}/hooks/useSearchParams`]],
  }),
  q({
    slug: "uselocation-hook",
    topic: "Navigation",
    d: "easy",
    title: "What does useLocation return and when is it useful?",
    kw: ["useLocation", "pathname", "search", "location state", "hash"],
    intent: "Checks you know how to read the current URL information.",
    short:
      "`useLocation` returns the current location object, with `pathname`, `search`, `hash`, `state` and `key`. Components re-render when the location changes, so it is useful for reacting to route changes, such as tracking page views, closing a menu or reading `state` that was passed through `Link` or `navigate`. For query values prefer `useSearchParams`, and for path values use `useParams`.",
    detail: [
      "`state` lets you pass data like where a user came from without putting it in the URL.",
      "State passed that way is stored in browser history and does not survive if the session history is lost.",
      "Do not use location as a place for large data.",
    ],
    ex: "After a redirect to login, the login page reads `location.state.from` to send the user back to the page they wanted.",
    mistakes: [
      "Parsing `location.search` by hand when useSearchParams exists.",
      "Putting large objects into location state.",
    ],
    follow: ["How do you pass state when navigating?"],
    points: [
      "pathname, search, hash, state, key",
      "Re-renders on change",
      "state carries small data",
      "Use specialised hooks for params",
    ],
    notes: ["useLocation = where we are now."],
    src: [["React Router: useLocation", `${A}/hooks/useLocation`]],
  }),
  q({
    slug: "browserrouter-vs-hashrouter",
    topic: "Navigation",
    d: "medium",
    title: "What is the difference between BrowserRouter and HashRouter?",
    kw: [
      "BrowserRouter",
      "HashRouter",
      "hash",
      "history api",
      "server configuration",
    ],
    intent:
      "Checks you understand the deployment consequence of the router type.",
    short:
      "`BrowserRouter` uses the History API to produce clean URLs such as `/products/42`, and it is the usual choice, but the server must serve `index.html` for those paths or a refresh gives a 404. `HashRouter` stores the location after a `#`, for example `/#/products/42`. Hash fragments are never sent to the server, so it works on static hosts without any rewrite rules, at the cost of less clean URLs.",
    detail: [
      "Use `HashRouter` only when you cannot configure the server.",
      "A server rewrite such as nginx `try_files` sends every unknown path to `index.html`.",
      "`MemoryRouter` keeps history in memory, which suits tests.",
    ],
    ex: "An app on a plain file host with no rewrite support uses `HashRouter`; the same app on nginx with a fallback uses `BrowserRouter`.",
    mistakes: [
      "Deploying a BrowserRouter app without a fallback to index.html.",
      "Using HashRouter when the server could simply be configured.",
    ],
    follow: ["What does MemoryRouter suit?"],
    points: [
      "BrowserRouter: clean URLs, needs fallback",
      "HashRouter: # URLs, no server config",
      "MemoryRouter for tests",
      "Pick based on the host",
    ],
    notes: ["Clean URLs need a server fallback."],
    src: [
      ["React Router: BrowserRouter", `${A}/declarative-routers/BrowserRouter`],
      ["React Router: HashRouter", `${A}/declarative-routers/HashRouter`],
      ["React Router: MemoryRouter", `${A}/declarative-routers/MemoryRouter`],
    ],
  }),
  q({
    slug: "createbrowserrouter-routerprovider",
    topic: "Data routers",
    d: "medium",
    title: "What is a data router and how do you create one?",
    kw: [
      "createBrowserRouter",
      "RouterProvider",
      "data router",
      "route objects",
      "loader",
    ],
    intent: "Checks you know the data-router setup and why it exists.",
    short:
      "A data router is created with `createBrowserRouter`, which takes an array of route objects, and rendered with `<RouterProvider router={router} />`. Because the router knows the whole route tree outside React rendering, routes can declare `loader` and `action` functions, error boundaries and pending states, and the router coordinates data loading with navigation. It supports everything the declarative `Routes` setup does, as plain objects.",
    detail: [
      "Route objects have `path`, `element` (or `Component`), `children`, `loader`, `action`, `errorElement` and more.",
      "The router object is created once, outside components.",
      "Data loading happens as part of the navigation, avoiding render-then-fetch waterfalls.",
    ],
    ex: "An app lists its routes as objects and each route owns the data it needs through a loader.",
    code: [
      [
        "Create a data router",
        "tsx",
        `import { createBrowserRouter, RouterProvider } from "react-router"\n\nconst router = createBrowserRouter([\n  {\n    path: "/",\n    element: <Root />,\n    children: [{ path: "orders", element: <Orders />, loader: ordersLoader }],\n  },\n])\n\n<RouterProvider router={router} />`,
        [
          "Routes are described as objects with nested `children`.",
          "`loader` runs before the route renders.",
          "`RouterProvider` mounts the router.",
        ],
      ],
    ],
    mistakes: [
      "Creating the router inside a component so it is rebuilt on every render.",
      "Mixing it with a separate BrowserRouter.",
    ],
    follow: ["What benefit does a loader give over fetching in useEffect?"],
    points: [
      "createBrowserRouter + RouterProvider",
      "Routes as objects",
      "Loaders and actions",
      "Create the router once",
    ],
    notes: ["Create the router outside components."],
    src: [
      [
        "React Router: createBrowserRouter",
        `${A}/data-routers/createBrowserRouter`,
      ],
      ["React Router: RouterProvider", `${A}/data-routers/RouterProvider`],
      ["React Router: Route objects", `${R}/start/data/route-object`],
    ],
  }),
  q({
    slug: "loaders-and-useloaderdata",
    topic: "Data routers",
    d: "medium",
    title: "What is a loader and how does useLoaderData work?",
    kw: ["loader", "useLoaderData", "data loading", "params", "request"],
    intent: "Checks you understand route-level data loading.",
    short:
      "A `loader` is a function on a route that fetches the data the route needs. The router calls it when the user navigates to that route, before rendering it, and passes an object with the `params` and the `request`. The component reads the returned value with `useLoaderData`. Loaders for nested routes run in parallel, which avoids the chain of fetches that happens when each component fetches after it mounts.",
    detail: [
      "Return data directly, or a `Response` for more control.",
      "Throwing inside a loader sends the error to the route's error boundary.",
      "After an action, loaders re-run so the page shows fresh data.",
    ],
    ex: "A product route loads its product by id in the loader, so the component renders with data already available.",
    code: [
      [
        "Load by param",
        "tsx",
        `async function productLoader({ params }) {\n  const res = await fetch(\`/api/products/\${params.productId}\`)\n  if (!res.ok) throw new Response("Not found", { status: 404 })\n  return res.json()\n}\n\nfunction Product() {\n  const product = useLoaderData()\n  return <h1>{product.name}</h1>\n}`,
        [
          "The loader receives `params` and fetches the product.",
          "Throwing a Response routes to the error boundary.",
          "`useLoaderData` returns the result.",
        ],
      ],
    ],
    mistakes: [
      "Fetching again inside the component.",
      "Not handling a failed response in the loader.",
    ],
    follow: ["When do loaders run again?"],
    points: [
      "Runs before the route renders",
      "Receives params and request",
      "useLoaderData reads the result",
      "Nested loaders run in parallel",
    ],
    notes: ["Loader fetches, component renders."],
    src: [
      ["React Router: Data loading", `${R}/start/data/data-loading`],
      ["React Router: useLoaderData", `${A}/hooks/useLoaderData`],
    ],
  }),
  q({
    slug: "actions-and-form",
    topic: "Data routers",
    d: "medium",
    title: "How do actions and the Form component handle submissions?",
    kw: ["action", "Form", "formData", "mutation", "revalidation"],
    intent: "Checks you know the data-router way to submit changes.",
    short:
      "A route `action` is a function that handles a submission, usually a mutation such as creating or deleting a record. The router `Form` component submits to it without a full page reload; the action receives the `request`, from which `await request.formData()` returns the submitted fields. When the action finishes, the router automatically re-runs the active loaders so the UI shows up-to-date data. An action can return data or `redirect()` to another page.",
    detail: [
      "`Form` renders a real `form`, so it works with the keyboard and falls back to a normal submission.",
      "The submission method (POST, PUT, DELETE and so on) is available on `request.method`.",
      "Validation errors can be returned from the action and read with `useActionData`.",
    ],
    ex: "Submitting a new-task form posts to the route's action, which saves the task and redirects to the task list that is reloaded automatically.",
    code: [
      [
        "An action",
        "tsx",
        `async function createAction({ request }) {\n  const form = await request.formData()\n  await save({ title: String(form.get("title")) })\n  return redirect("/tasks")\n}\n\n<Form method="post">\n  <input name="title" />\n  <button>Add</button>\n</Form>`,
        [
          "`Form` posts to the route's action.",
          "`formData()` reads the fields.",
          "`redirect` navigates after success.",
        ],
      ],
    ],
    mistakes: [
      "Using onSubmit with fetch and forgetting that loaders must be refreshed.",
      "Trusting form data without validating it.",
    ],
    follow: ["How are validation errors returned?"],
    points: [
      "action handles mutations",
      "Form submits without reload",
      "formData from the request",
      "Loaders revalidate afterwards",
    ],
    notes: ["Action mutates, loaders refresh."],
    src: [
      ["React Router: Actions", `${R}/start/data/actions`],
      ["React Router: Form", `${A}/components/Form`],
    ],
  }),
  q({
    slug: "route-error-boundaries",
    topic: "Data routers",
    d: "medium",
    title:
      "How do you handle errors in routes with errorElement and useRouteError?",
    kw: [
      "errorElement",
      "useRouteError",
      "error boundary",
      "loader error",
      "404 response",
    ],
    intent: "Checks you know how errors are isolated per route.",
    short:
      "A route can define an `errorElement` (or `ErrorBoundary`) that renders instead of the route when its loader, action or component throws. Inside it, `useRouteError` returns whatever was thrown. Errors bubble to the nearest route that has an error element, so a failing child shows its error inside the parent's layout while the rest of the page keeps working. A thrown `Response`, such as a 404, can be checked for its status.",
    detail: [
      "Without any error element, the router shows a default error screen.",
      "Put one at the root as a safety net and more specific ones where useful.",
      "Check the type of error before reading properties from it.",
    ],
    ex: "A missing product throws a 404 Response from its loader, and its error element shows 'Product not found' within the page layout.",
    code: [
      [
        "Error element",
        "tsx",
        `{ path: "products/:id", element: <Product />, loader: productLoader, errorElement: <ProductError /> }\n\nfunction ProductError() {\n  const error = useRouteError()\n  return <p>Something went wrong.</p>\n}`,
        [
          "The error element is attached to the route.",
          "`useRouteError` reads what was thrown.",
        ],
      ],
    ],
    mistakes: [
      "No error element so users see the default screen.",
      "Showing raw error messages to users.",
    ],
    follow: ["Where does an error bubble to?"],
    points: [
      "errorElement per route",
      "useRouteError reads the error",
      "Bubbles to the nearest boundary",
      "Add a root-level fallback",
    ],
    notes: ["Errors bubble up the route tree."],
    src: [
      ["React Router: useRouteError", `${A}/hooks/useRouteError`],
      ["React Router: Route objects", `${R}/start/data/route-object`],
    ],
  }),
  q({
    slug: "usenavigation-pending-ui",
    topic: "Data routers",
    d: "medium",
    title: "How do you show a pending state with useNavigation?",
    kw: [
      "useNavigation",
      "pending UI",
      "navigation state",
      "loading",
      "submitting",
    ],
    intent:
      "Checks you can give feedback while a navigation or submission is in progress.",
    short:
      "`useNavigation` returns the state of the current navigation, where `navigation.state` is `idle`, `loading` (a loader is running for the next page) or `submitting` (an action is running). Use it for a global progress bar, to dim the old page, or to disable a submit button while saving. Because the old page stays visible until the new data is ready, this feedback stops the app from feeling frozen.",
    detail: [
      "`navigation.formData` is available during a submission, for optimistic UI.",
      "Use `useFetcher` for pending state of submissions that should not navigate.",
      "`NavLink` also exposes an `isPending` flag for individual links.",
    ],
    ex: 'A top-of-page loading bar shows whenever `navigation.state !== "idle"`.',
    code: [
      [
        "Global loading flag",
        "tsx",
        `function Root() {\n  const navigation = useNavigation()\n  const busy = navigation.state !== "idle"\n  return <main aria-busy={busy}><Outlet /></main>\n}`,
        [
          "`state` is not `idle` while loading or submitting.",
          "The flag is used to mark the area as busy.",
        ],
      ],
    ],
    mistakes: [
      "No feedback so users click twice.",
      "Blocking the whole UI instead of subtle feedback.",
    ],
    follow: ["What is useFetcher for?"],
    points: [
      "idle, loading, submitting",
      "Old page stays until ready",
      "Use for progress and disabled buttons",
      "Fetcher for non-navigating submits",
    ],
    notes: ["Check navigation.state."],
    src: [
      ["React Router: Pending UI", `${R}/start/data/pending-ui`],
      ["React Router: useNavigation", `${A}/hooks/useNavigation`],
    ],
  }),
  q({
    slug: "redirect-in-loaders",
    topic: "Data routers",
    d: "medium",
    title: "How do you redirect from a loader or action?",
    kw: ["redirect", "loader", "action", "response", "authentication"],
    intent: "Checks you can redirect before rendering.",
    short:
      'Return `redirect("/path")` from a loader or action, and the router navigates there instead of rendering the current route. Redirecting from a loader happens before any UI is shown, so there is no flash of protected content, which makes it a neat way to guard routes or to send the user to a new page after a successful action. `redirect` creates a `Response` with a redirect status and a `Location` header.',
    detail: [
      "It works with both `return` and `throw`.",
      "Redirects after a successful mutation follow the Post/Redirect/Get pattern, which avoids resubmitting a form on refresh.",
      "Compared with the `Navigate` component, no render of the redirecting page happens.",
    ],
    ex: 'A dashboard loader checks the session and returns `redirect("/login")` when there is none.',
    code: [
      [
        "Guard in a loader",
        "tsx",
        `async function dashboardLoader() {\n  const user = await getUser()\n  if (!user) return redirect("/login")\n  return user\n}`,
        [
          "The loader checks for a user before rendering.",
          "`redirect` sends anonymous visitors to login.",
        ],
      ],
    ],
    mistakes: [
      "Using Navigate and flashing the protected page.",
      "Redirecting without checking on the server too.",
    ],
    follow: ["Why is Post/Redirect/Get useful?"],
    points: [
      "redirect() returns a Response",
      "Runs before render",
      "Works from loaders and actions",
      "Post/Redirect/Get after mutations",
    ],
    notes: ["Redirect before rendering."],
    src: [["React Router: redirect", `${A}/utils/redirect`]],
  }),
  q({
    slug: "usefetcher-hook",
    topic: "Data routers",
    d: "hard",
    title: "What is useFetcher and when would you use it instead of Form?",
    kw: [
      "useFetcher",
      "fetcher.Form",
      "no navigation",
      "inline mutation",
      "pending state",
    ],
    intent:
      "Checks you know how to call loaders and actions without navigating.",
    short:
      "`useFetcher` gives you a fetcher object that can load data from a loader or submit to an action without changing the URL. Use `fetcher.Form` or `fetcher.submit` for in-place interactions such as a like button, deleting a row, or saving a field, where leaving the page would be wrong. Each fetcher has its own `state` and `data`, and after a submission the router still revalidates the loaders so the page stays up to date.",
    detail: [
      "Several fetchers can be active at once, each with its own pending state.",
      "A normal `Form` triggers a navigation; a fetcher does not.",
      "`fetcher.formData` can drive optimistic updates.",
    ],
    ex: "A todo list marks an item done through a fetcher form, and the checkbox updates in place without a page transition.",
    code: [
      [
        "Inline mutation",
        "tsx",
        `function DoneButton({ id }) {\n  const fetcher = useFetcher()\n  return (\n    <fetcher.Form method="post" action={\`/todos/\${id}/done\`}>\n      <button disabled={fetcher.state !== "idle"}>Done</button>\n    </fetcher.Form>\n  )\n}`,
        [
          "`fetcher.Form` submits without navigating.",
          "`fetcher.state` disables the button while saving.",
        ],
      ],
    ],
    mistakes: [
      "Using Form for a small inline change and navigating away.",
      "Ignoring the fetcher's pending state.",
    ],
    follow: ["Can there be more than one fetcher on a page?"],
    points: [
      "Load or submit without navigation",
      "Own state and data per fetcher",
      "Loaders still revalidate",
      "Form navigates, fetcher does not",
    ],
    notes: ["Fetcher = form without navigation."],
    src: [["React Router: useFetcher", `${A}/hooks/useFetcher`]],
  }),
  q({
    slug: "protected-route-layout",
    topic: "Protected routes",
    d: "medium",
    title: "How do you build a protected route in React Router?",
    kw: [
      "protected route",
      "private route",
      "auth guard",
      "Outlet",
      "Navigate",
    ],
    intent:
      "Checks you can gate pages behind sign-in in a clean, reusable way.",
    short:
      'Create a layout route component that checks whether the user is signed in. If so it renders `<Outlet />` so the nested protected pages show, otherwise it renders `<Navigate to="/login" replace />`. Wrap all private routes inside this one layout route instead of repeating the check on each page. Remember that this only controls the user interface: the real protection must be enforced by the server API.',
    detail: [
      "Show a loading state while the session is still being checked, otherwise signed-in users are redirected by mistake.",
      "The same pattern works for role checks, such as an admin-only area.",
      "In a data router, a loader that returns `redirect()` can do the same check before rendering.",
    ],
    ex: "All `/app/*` routes sit under one `RequireAuth` layout; anonymous visitors are sent to `/login`.",
    code: [
      [
        "A guard layout",
        "tsx",
        `function RequireAuth() {\n  const { user, loading } = useAuth()\n  const location = useLocation()\n  if (loading) return <Spinner />\n  if (!user) return <Navigate to="/login" replace state={{ from: location }} />\n  return <Outlet />\n}\n\n<Route element={<RequireAuth />}>\n  <Route path="dashboard" element={<Dashboard />} />\n</Route>`,
        [
          "The guard renders `Outlet` only for signed-in users.",
          "It waits while the session loads.",
          "`state.from` remembers the wanted page.",
        ],
      ],
    ],
    mistakes: [
      "Treating a client-side guard as real security.",
      "Redirecting before the session check has finished.",
    ],
    follow: ["Why must the API also check authorisation?"],
    points: [
      "Layout route with Outlet or Navigate",
      "Wrap all private routes once",
      "Handle the loading state",
      "Server must enforce access",
    ],
    notes: ["UI guard is convenience, server is security."],
    src: [
      ["React Router: Navigate", `${A}/components/Navigate`],
      ["React Router: Outlet", `${A}/components/Outlet`],
    ],
  }),
  q({
    slug: "redirect-back-after-login",
    topic: "Protected routes",
    d: "medium",
    title: "How do you send a user back to the page they wanted after login?",
    kw: ["login redirect", "location state", "from", "return url", "navigate"],
    intent:
      "Checks you can carry the intended destination through the login flow.",
    short:
      'When the guard redirects an anonymous visitor, pass the page they tried to open, for example in location state: `<Navigate to="/login" state={{ from: location }} replace />`. The login page reads it with `useLocation` and after a successful sign-in calls `navigate(from, { replace: true })`, falling back to a default such as the dashboard when there is none. Only redirect to internal paths; never send users to a URL taken blindly from the query string, which would be an open redirect.',
    detail: [
      "A query parameter like `?next=/orders` also works but must be validated.",
      "Check that the target starts with a single `/` and is not a full external URL.",
      "Using `replace` keeps the login page out of Back history.",
    ],
    ex: "A user opens `/orders/17` from a bookmark, signs in, and lands on `/orders/17` instead of the home page.",
    mistakes: [
      "Always sending users to the home page after login.",
      "Trusting a `next` query value and allowing an open redirect.",
    ],
    follow: ["What is an open redirect?"],
    points: [
      "Carry the target in state",
      "Read it in the login page",
      "Fall back to a default",
      "Validate internal paths only",
    ],
    notes: ["Never redirect to an unchecked external URL."],
    src: [
      ["React Router: useLocation", `${A}/hooks/useLocation`],
      ["React Router: useNavigate", `${A}/hooks/useNavigate`],
    ],
  }),
  q({
    slug: "role-based-route-guard",
    topic: "Protected routes",
    d: "hard",
    title: "How would you restrict routes by role, such as admin-only pages?",
    kw: ["role-based", "authorization", "admin route", "forbidden", "guard"],
    intent:
      "Checks you separate authentication from authorisation and know the limits of UI checks.",
    short:
      "Authentication asks who the user is; authorisation asks what they may do. A role guard is another layout route that receives the allowed roles, compares them with the current user's role and renders `Outlet` if allowed. Otherwise it shows a 'Not allowed' page or redirects, and anonymous visitors are sent to login instead. The role check in the browser only hides the UI; the API must check the role on every request, because client code can be changed by the user.",
    detail: [
      "Hide menu items the user cannot use, to avoid confusion.",
      "Prefer permissions such as `orders:delete` over many role names, if the app grows.",
      "Show a clear forbidden message rather than a blank page.",
    ],
    ex: "`/admin/*` routes sit under a guard that allows only the `admin` role, while every API endpoint behind them also verifies the role on the server.",
    code: [
      [
        "Role guard",
        "tsx",
        `function RequireRole({ roles }: { roles: string[] }) {\n  const { user } = useAuth()\n  if (!user) return <Navigate to="/login" replace />\n  if (!roles.includes(user.role)) return <Forbidden />\n  return <Outlet />\n}`,
        [
          "Anonymous users go to login.",
          "Wrong roles see a Forbidden page.",
          "Allowed roles see the nested routes.",
        ],
      ],
    ],
    mistakes: [
      "Relying only on hidden links for security.",
      "Mixing up unauthenticated (login) and forbidden (no permission).",
    ],
    follow: ["Why can the browser check not be trusted?"],
    points: [
      "Authentication vs authorisation",
      "Guard layout checks roles",
      "Forbidden differs from login",
      "Server enforces permissions",
    ],
    notes: ["401 means sign in, 403 means not allowed."],
    src: [
      ["React Router: Outlet", `${A}/components/Outlet`],
      ["React Router: Navigate", `${A}/components/Navigate`],
    ],
  }),
])
