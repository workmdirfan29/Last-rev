import { defineQuestions } from "../author"
import { q } from "../compact"

const T = "https://tanstack.com/query/latest/docs/framework/react"
const G = `${T}/guides`

export default defineQuestions("tanstack-query", "fresher", [
  q({
    slug: "what-is-tanstack-query",
    topic: "Queries",
    d: "easy",
    title: "What problem does TanStack Query solve?",
    kw: [
      "tanstack query",
      "server state",
      "data fetching",
      "caching",
      "react query",
    ],
    intent:
      "Checks you understand why a data-fetching library exists beyond fetch in useEffect.",
    short:
      "TanStack Query, formerly React Query, manages server state in React apps: it fetches, caches, synchronises and updates data that lives on a server. It gives you loading and error status, caching, request de-duplication, background refetching, retries, pagination helpers and cache invalidation, without writing the effects, flags and reducers yourself. It is not a replacement for client state like open menus, which stays in React state or a store.",
    detail: [
      "Fetching in `useEffect` leaves you to handle races, caching, errors and refetching manually.",
      "The same data requested by several components is fetched once and shared.",
      "It works with any promise-returning function, so `fetch` and Axios both work.",
    ],
    ex: "A dashboard shows the same user list in two places; TanStack Query makes one request and keeps both views updated.",
    mistakes: [
      "Using it for purely local UI state.",
      "Copying query results into a global store.",
    ],
    follow: ["What is the difference between server state and client state?"],
    points: [
      "Manages server state",
      "Caching, dedupe, refetch, retries",
      "Works with any promise",
      "Not for client state",
    ],
    notes: ["It is an async state manager for server data."],
    src: [
      ["TanStack Query: Overview", `${T}/overview`],
      [
        "TanStack Query: Does this replace client state?",
        `${G}/does-this-replace-client-state`,
      ],
    ],
  }),
  q({
    slug: "queryclientprovider-setup",
    topic: "Queries",
    d: "easy",
    title: "How do you set up TanStack Query in a React app?",
    kw: ["QueryClient", "QueryClientProvider", "setup", "cache", "devtools"],
    intent: "Checks you know the minimal setup and what the client is.",
    short:
      "Create a `QueryClient` once, outside components, and wrap the app in `<QueryClientProvider client={queryClient}>`. The client owns the cache and the default options, and every `useQuery` and `useMutation` call below the provider uses it. Create the client at module level or keep it in a stable reference so it is not recreated on every render, which would throw away the cache.",
    detail: [
      "Default options such as `staleTime` can be set on the client for all queries.",
      "`useQueryClient()` gives components access to the client for manual cache operations.",
      "The devtools are a separate package that you add in development.",
    ],
    ex: "The app entry file creates one client and wraps `<App />` in the provider.",
    code: [
      [
        "Provider setup",
        "tsx",
        `import { QueryClient, QueryClientProvider } from "@tanstack/react-query"\n\nconst queryClient = new QueryClient()\n\nexport function Root() {\n  return (\n    <QueryClientProvider client={queryClient}>\n      <App />\n    </QueryClientProvider>\n  )\n}`,
        [
          "The client is created once at module level.",
          "The provider makes it available to all hooks.",
        ],
      ],
    ],
    mistakes: [
      "Creating the QueryClient inside a component body.",
      "Using hooks outside the provider.",
    ],
    follow: ["What does the QueryClient hold?"],
    points: [
      "One QueryClient",
      "Provider at the root",
      "Client owns the cache",
      "Do not recreate it per render",
    ],
    notes: ["QueryClient = the cache."],
    src: [
      ["TanStack Query: Quick start", `${T}/quick-start`],
      ["TanStack Query: QueryClient", `${T}/reference/QueryClient`],
    ],
  }),
  q({
    slug: "usequery-basics",
    topic: "Queries",
    d: "easy",
    title: "How does useQuery work and what does it return?",
    kw: ["useQuery", "queryKey", "queryFn", "status", "data"],
    intent: "Checks you can read data with a query and handle its states.",
    short:
      "`useQuery` takes an options object with a unique `queryKey` and a `queryFn` that returns a promise. It returns the query's `data`, an `error`, and status flags such as `isPending`, `isError`, `isSuccess` and `isFetching`. The `status` is `pending` when there is no data yet, `error` if the last attempt failed, and `success` when data is available. The component renders based on those states.",
    detail: [
      "`isPending` is about having no data; `isFetching` is true any time a request is running, including background refetches.",
      "The `queryFn` must return a promise that resolves with data or throws an error.",
      "Version 5 accepts only the single options-object form.",
    ],
    ex: 'A product page calls `useQuery` with the key `["product", id]` and shows a spinner while pending and an error message if it fails.',
    code: [
      [
        "A basic query",
        "tsx",
        `const { data, isPending, isError, error } = useQuery({\n  queryKey: ["products"],\n  queryFn: async () => {\n    const res = await fetch("/api/products")\n    if (!res.ok) throw new Error("Failed to load products")\n    return res.json() as Promise<Product[]>\n  },\n})\n\nif (isPending) return <Spinner />\nif (isError) return <p>{error.message}</p>\nreturn <ProductList items={data} />`,
        [
          "The key identifies the cached data.",
          "The function throws on a bad response.",
          "The component handles each state.",
        ],
      ],
    ],
    mistakes: [
      "Not throwing on non-2xx responses so errors look like success.",
      "Mixing up isPending and isFetching.",
    ],
    follow: ["What is the difference between isPending and isFetching?"],
    points: [
      "queryKey and queryFn",
      "data, error, status flags",
      "isPending = no data yet",
      "isFetching = request in flight",
    ],
    notes: ["Key identifies, function fetches."],
    src: [
      ["TanStack Query: Queries", `${G}/queries`],
      ["TanStack Query: useQuery", `${T}/reference/useQuery`],
    ],
  }),
  q({
    slug: "query-keys",
    topic: "Queries",
    d: "medium",
    title: "What are query keys and how should you design them?",
    kw: ["query key", "array key", "cache identity", "variables", "hashing"],
    intent: "Checks you understand how the cache identifies and groups data.",
    short:
      'A query key is an array that uniquely identifies a query in the cache. TanStack Query hashes it deterministically, so equal keys share one cache entry and a different key means a different entry. Include every variable the query function depends on, such as an id or filters, for example `["todos", { status, page }]`, so the data refetches automatically when they change. Start with a general part and add details, so you can invalidate whole groups by prefix.',
    detail: [
      "Object property order inside the key does not matter, but array order does.",
      "Keep keys consistent by defining them in helper functions or a key factory.",
      "A key that misses a dependency causes stale or wrong data being shown.",
    ],
    ex: 'Keys `["todos", "list"]` and `["todos", "detail", 5]` share the `todos` prefix, so one call can invalidate them all.',
    code: [
      [
        "Variables in the key",
        "ts",
        `useQuery({\n  queryKey: ["todos", { status, page }],\n  queryFn: () => fetchTodos({ status, page }),\n})`,
        [
          "The key contains the filters.",
          "Changing `status` or `page` selects a different cache entry and refetches.",
        ],
      ],
    ],
    mistakes: [
      "Leaving a variable out of the key.",
      "Building keys differently in different files.",
    ],
    follow: ["How do prefixes help with invalidation?"],
    points: [
      "Array that identifies the data",
      "Hashed deterministically",
      "Include all dependencies",
      "Use prefixes for grouping",
    ],
    notes: ["If the function uses it, the key has it."],
    src: [
      ["TanStack Query: Query keys", `${G}/query-keys`],
      ["TanStack Query: Query functions", `${G}/query-functions`],
    ],
  }),
  q({
    slug: "query-function-errors",
    topic: "Queries",
    d: "medium",
    title: "Why must a query function throw errors, and how does fetch behave?",
    kw: ["queryFn", "fetch", "error handling", "res.ok", "rejected promise"],
    intent:
      "Checks you know that errors are detected through a rejected promise.",
    short:
      "TanStack Query treats a query as failed only when the query function throws an error or returns a rejected promise. The `fetch` API does not reject on HTTP error statuses such as 404 or 500, only on network failures, so you must check `res.ok` and throw yourself. Otherwise an error response is cached as successful data. Libraries such as Axios throw on non-2xx statuses by default, so they need no such check.",
    detail: [
      "Once the function throws, the query goes to `error` state after the configured retries.",
      "The thrown error is available as `error` from the hook.",
      "A shared fetch helper that checks `res.ok` keeps this consistent.",
    ],
    ex: "A 404 for a missing product is turned into a thrown error, so the page shows 'Product not found' instead of trying to render the JSON error body as a product.",
    mistakes: [
      "Returning the response of a failed fetch as data.",
      "Not handling the error state in the component.",
    ],
    follow: ["How many times is a failed query retried by default?"],
    points: [
      "Failure = thrown error or rejected promise",
      "fetch does not reject on 404 or 500",
      "Check res.ok and throw",
      "Error then appears in `error`",
    ],
    notes: ["Throw on bad status."],
    src: [["TanStack Query: Query functions", `${G}/query-functions`]],
  }),
  q({
    slug: "dependent-queries-and-enabled",
    topic: "Queries",
    d: "medium",
    title: "How do you run a query only when its inputs are ready?",
    kw: [
      "enabled",
      "dependent queries",
      "conditional fetching",
      "disabled query",
      "skipToken",
    ],
    intent:
      "Checks you can sequence queries and avoid requests with missing inputs.",
    short:
      "Set the `enabled` option to a condition, such as `enabled: !!userId`, and the query will not run until it is true. This is how dependent queries are written: the second query waits for data from the first. While a query is disabled and has no data it stays in the `pending` state with `fetchStatus` idle, so `isLoading` is the right flag for the first load and `isPending` alone can show a spinner for a query that never started.",
    detail: [
      "Use the first query's result in the second query's key and function.",
      "A disabled query is not refetched on mount or by invalidation until enabled.",
      "Independent queries should not be chained, because that creates a slower waterfall.",
    ],
    ex: "A profile page first loads the user, then loads that user's projects once the user id is known.",
    code: [
      [
        "Dependent query",
        "tsx",
        `const { data: user } = useQuery({ queryKey: ["user"], queryFn: fetchUser })\n\nconst { data: projects } = useQuery({\n  queryKey: ["projects", user?.id],\n  queryFn: () => fetchProjects(user!.id),\n  enabled: !!user?.id,\n})`,
        [
          "The projects query waits until `user.id` exists.",
          "The id is part of the key.",
        ],
      ],
    ],
    mistakes: [
      "Calling the API with undefined ids.",
      "Chaining queries that do not depend on each other.",
    ],
    follow: ["What status does a disabled query have?"],
    points: [
      "enabled gates the query",
      "Used for dependent queries",
      "Disabled queries do not auto-fetch",
      "Avoid unnecessary waterfalls",
    ],
    notes: ["enabled: condition."],
    src: [
      ["TanStack Query: Dependent queries", `${G}/dependent-queries`],
      ["TanStack Query: Disabling queries", `${G}/disabling-queries`],
    ],
  }),
  q({
    slug: "query-select-transform",
    topic: "Queries",
    d: "hard",
    title: "What is the select option and when would you use it?",
    kw: [
      "select",
      "data transformation",
      "derived data",
      "structural sharing",
      "re-render",
    ],
    intent: "Checks you can derive data from a query without storing a copy.",
    short:
      "The `select` option takes a function that receives the cached data and returns a transformed value, such as a filtered list or just one field. The cache keeps the original data, and the component gets the selected result. Components re-render only when their selected value changes, so `select` helps both to shape data and to avoid unnecessary renders. Keep the function pure and, when it is expensive, stable by defining it outside the component.",
    detail: [
      "Different components can select different parts from the same cached query.",
      "Do not copy the result into `useState`; derive it.",
      "Selected output is also structurally shared to keep references stable if nothing changed.",
    ],
    ex: "A header uses `select: (todos) => todos.length` to show a count and re-renders only when the count changes.",
    code: [
      [
        "Select a count",
        "ts",
        `const { data: openCount } = useQuery({\n  queryKey: ["todos"],\n  queryFn: fetchTodos,\n  select: (todos) => todos.filter((t) => !t.done).length,\n})`,
        [
          "The cache keeps the full list.",
          "The component receives only the count.",
        ],
      ],
    ],
    mistakes: [
      "Mutating the data inside select.",
      "Copying query data into component state.",
    ],
    follow: ["Where is the original data kept?"],
    points: [
      "Transforms cached data",
      "Original data stays in the cache",
      "Limits re-renders to selected value",
      "Keep it pure",
    ],
    notes: ["select shapes, the cache stores."],
    src: [["TanStack Query: useQuery reference", `${T}/reference/useQuery`]],
  }),
  q({
    slug: "usemutation-basics",
    topic: "Mutations",
    d: "easy",
    title: "How is useMutation different from useQuery?",
    kw: [
      "useMutation",
      "mutate",
      "mutateAsync",
      "side effects",
      "post request",
    ],
    intent: "Checks you know when to use a mutation instead of a query.",
    short:
      "`useQuery` reads data and runs automatically; `useMutation` performs a side effect such as creating, updating or deleting data and runs only when you call it. It returns `mutate` and `mutateAsync` to trigger the request, plus status such as `isPending`, `isError`, `isSuccess`, `data` and `error`. Mutations are not cached by key and are not retried by default.",
    detail: [
      "`mutate` takes the variables and optional per-call callbacks.",
      "`mutateAsync` returns a promise you can await, but you must handle its errors.",
      "After a successful mutation you usually invalidate related queries.",
    ],
    ex: "A 'Create task' form calls `mutate({ title })`, disables the button while `isPending` and refreshes the task list on success.",
    code: [
      [
        "A create mutation",
        "tsx",
        `const queryClient = useQueryClient()\nconst create = useMutation({\n  mutationFn: (task: NewTask) =>\n    fetch("/api/tasks", { method: "POST", body: JSON.stringify(task) }),\n  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),\n})\n\n<button disabled={create.isPending} onClick={() => create.mutate({ title })}>Add</button>`,
        [
          "`mutate` runs the request only when called.",
          "`isPending` disables the button.",
          "`onSuccess` invalidates the list.",
        ],
      ],
    ],
    mistakes: [
      "Using useQuery for writes.",
      "Forgetting to refresh affected queries after success.",
    ],
    follow: ["What is the difference between mutate and mutateAsync?"],
    points: [
      "Runs on demand",
      "mutate and mutateAsync",
      "Status flags",
      "Invalidate related queries",
    ],
    notes: ["Query reads, mutation writes."],
    src: [
      ["TanStack Query: Mutations", `${G}/mutations`],
      ["TanStack Query: useMutation", `${T}/reference/useMutation`],
    ],
  }),
  q({
    slug: "mutation-callbacks",
    topic: "Mutations",
    d: "medium",
    title: "What are the mutation lifecycle callbacks?",
    kw: ["onMutate", "onSuccess", "onError", "onSettled", "mutation lifecycle"],
    intent: "Checks you know where to put side effects of a mutation.",
    short:
      "A mutation has callbacks for its lifecycle: `onMutate` runs before the mutation function and is where you prepare, for example for optimistic updates; `onSuccess` runs when it succeeds; `onError` runs when it fails and receives the error and the context returned from `onMutate`; `onSettled` runs at the end either way. They can be set on `useMutation` and also on a single `mutate` call, where the per-call callbacks run only if the component is still mounted.",
    detail: [
      "Returning a promise from a callback makes the mutation wait for it, for example `invalidateQueries`.",
      "The value returned from `onMutate` is passed to the other callbacks as context.",
      "Use `onSettled` for cleanup that must run on both outcomes.",
    ],
    ex: "On success a toast appears and the list is invalidated; on error the toast shows the message.",
    mistakes: [
      "Putting navigation in the hook-level callback that must not run after unmount.",
      "Ignoring errors from mutateAsync.",
    ],
    follow: ["What is the context argument?"],
    points: [
      "onMutate, onSuccess, onError, onSettled",
      "onMutate can return context",
      "Hook-level and per-call callbacks",
      "Returned promises are awaited",
    ],
    notes: ["onSettled runs after success or error."],
    src: [["TanStack Query: Mutations", `${G}/mutations`]],
  }),
  q({
    slug: "update-cache-from-mutation",
    topic: "Mutations",
    d: "medium",
    title: "How can a mutation response update the cache directly?",
    kw: [
      "setQueryData",
      "mutation response",
      "cache update",
      "invalidate vs set",
      "queryClient",
    ],
    intent: "Checks you know the alternative to refetching after a write.",
    short:
      "When a mutation returns the updated resource, you can write it straight into the cache with `queryClient.setQueryData(key, data)` in `onSuccess`, so the UI updates without another request. This avoids a refetch for the item you just changed. For lists or data that other changes may affect, invalidation with `invalidateQueries` is safer because the server is the source of truth. Always update the cache immutably, returning new objects.",
    detail: [
      "`setQueryData` also accepts an updater function that receives the old data.",
      "Updating the cache by hand risks drifting from the server, so keep it for simple cases.",
      "Both approaches can be combined: set the item, then invalidate the list.",
    ],
    ex: 'After saving a profile, the response replaces the cached `["profile"]` entry, so the form page shows the saved values at once.',
    code: [
      [
        "Write the response",
        "ts",
        `useMutation({\n  mutationFn: saveProfile,\n  onSuccess: (profile) => {\n    queryClient.setQueryData(["profile"], profile)\n  },\n})`,
        [
          "The server response becomes the cached value.",
          "No extra GET request is needed.",
        ],
      ],
    ],
    mistakes: [
      "Mutating the cached object in place.",
      "Hand-editing complex cached lists and getting them wrong.",
    ],
    follow: ["When is invalidation preferable?"],
    points: [
      "setQueryData writes to the cache",
      "Saves a refetch",
      "Update immutably",
      "Invalidate when unsure",
    ],
    notes: ["Simple: set. Complex: invalidate."],
    src: [
      [
        "TanStack Query: Updates from mutation responses",
        `${G}/updates-from-mutation-responses`,
      ],
    ],
  }),
  q({
    slug: "mutation-pending-and-errors-ui",
    topic: "Mutations",
    d: "easy",
    title:
      "How do you give users feedback while a mutation runs and when it fails?",
    kw: [
      "isPending",
      "isError",
      "mutation state",
      "disable button",
      "error message",
    ],
    intent: "Checks you cover loading and failure in write operations.",
    short:
      "Use the mutation's state: `isPending` to disable the submit button and show 'Saving...' so the user cannot submit twice, `isError` with `error` to show a clear message, and `isSuccess` to confirm or redirect. `reset()` clears the error state. Show failures near the form and keep the user's input so they can retry without retyping.",
    detail: [
      "Disabling the button prevents duplicate submissions.",
      "Do not show raw technical error text to users.",
      "Server validation messages can be shown next to the relevant fields.",
    ],
    ex: "A checkout form disables 'Pay' while pending, and on failure shows 'We could not process the order. Please try again.' while keeping the entered details.",
    mistakes: [
      "Allowing double submit while pending.",
      "Clearing the form on failure.",
    ],
    follow: ["What does reset do?"],
    points: [
      "isPending disables the button",
      "isError shows a message",
      "Keep user input on failure",
      "reset clears the state",
    ],
    notes: ["Always show pending and error states."],
    src: [
      ["TanStack Query: Mutations", `${G}/mutations`],
      ["TanStack Query: useMutation", `${T}/reference/useMutation`],
    ],
  }),
  q({
    slug: "stale-time-vs-gc-time",
    topic: "Caching & stale time",
    d: "medium",
    title: "What is the difference between staleTime and gcTime?",
    kw: ["staleTime", "gcTime", "cacheTime", "fresh", "garbage collection"],
    intent: "Checks you understand the two timers behind caching.",
    short:
      "`staleTime` is how long fetched data is considered fresh. While fresh, mounting a component reads from the cache without a refetch. The default is 0, so data is stale immediately and refetched on triggers such as mount. `gcTime` is how long unused data with no active observers stays in the cache before it is garbage collected; the default is 5 minutes. In v5 it was renamed from `cacheTime`. Stale data can still be shown while a fresh copy is fetched.",
    detail: [
      "`staleTime: Infinity` means the data never goes stale on its own.",
      "Raising `staleTime` reduces requests for data that changes rarely, such as a country list.",
      "`gcTime` controls memory and how fast a revisit finds cached data.",
    ],
    ex: "A list of countries uses a long `staleTime` and is fetched once per session, while a live order list keeps the default.",
    code: [
      [
        "Set a stale time",
        "ts",
        `useQuery({\n  queryKey: ["countries"],\n  queryFn: fetchCountries,\n  staleTime: 1000 * 60 * 60, // fresh for an hour\n})`,
        [
          "For one hour the cached list is used with no refetch.",
          "After that it becomes stale and can be refetched on triggers.",
        ],
      ],
    ],
    mistakes: [
      "Thinking gcTime controls refetching.",
      "Using the old name cacheTime in v5.",
    ],
    follow: ["What happens when stale data is rendered?"],
    points: [
      "staleTime = how long data is fresh",
      "Default staleTime is 0",
      "gcTime = how long unused data is kept",
      "Default gcTime is 5 minutes",
    ],
    notes: ["Fresh vs kept."],
    src: [
      ["TanStack Query: Important defaults", `${G}/important-defaults`],
      ["TanStack Query: Caching", `${G}/caching`],
    ],
  }),
  q({
    slug: "stale-while-revalidate-behaviour",
    topic: "Caching & stale time",
    d: "medium",
    title: "What does stale-while-revalidate mean in TanStack Query?",
    kw: [
      "stale-while-revalidate",
      "background refetch",
      "cached data",
      "isFetching",
      "refetch triggers",
    ],
    intent:
      "Checks you understand why cached data shows instantly and updates after.",
    short:
      "When a query has cached data that is stale, TanStack Query shows the cached data immediately and refetches in the background; once the new data arrives, the UI updates. The user sees content instantly instead of a spinner, and `isFetching` is true during the background request while `isPending` stays false. Stale queries are refetched automatically when a component mounts, when the window regains focus, and when the network reconnects.",
    detail: [
      "These triggers are controlled by options such as `refetchOnWindowFocus` and `refetchOnReconnect`.",
      "A subtle 'updating' indicator can use `isFetching` without hiding the content.",
      "Refetching can be turned off per query when it is not wanted.",
    ],
    ex: "Returning to the Orders tab shows the previous list at once, then it quietly updates if new orders came in.",
    mistakes: [
      "Showing a full-page spinner on every background refetch.",
      "Not knowing why requests fire on window focus.",
    ],
    follow: ["How do you disable refetch on window focus?"],
    points: [
      "Show stale data first",
      "Refetch in the background",
      "isFetching true, isPending false",
      "Triggers: mount, focus, reconnect",
    ],
    notes: ["Instant UI, fresh data soon."],
    src: [
      ["TanStack Query: Important defaults", `${G}/important-defaults`],
      [
        "TanStack Query: Window focus refetching",
        `${G}/window-focus-refetching`,
      ],
      [
        "TanStack Query: Background fetching indicators",
        `${G}/background-fetching-indicators`,
      ],
    ],
  }),
  q({
    slug: "query-retries",
    topic: "Caching & stale time",
    d: "medium",
    title: "How do automatic retries work in TanStack Query?",
    kw: ["retry", "retryDelay", "exponential backoff", "failed query", "error"],
    intent:
      "Checks you know the default behaviour for failures and how to change it.",
    short:
      "A failed query is retried automatically, three times by default for queries on the client, with an exponential backoff delay between attempts, before the query goes into the `error` state. You can set `retry` to a number, `false`, or a function that decides based on the error, and `retryDelay` to change the delay. Retrying makes transient network problems invisible, but a 404 or a validation error will not succeed by retrying, so disable retries for those.",
    detail: [
      "Mutations are not retried by default.",
      "While retrying, the query stays in `pending` or fetching state.",
      "Tests often set `retry: false` so failures show up immediately.",
    ],
    ex: "A flaky mobile connection recovers silently after a retry, while a 404 is shown straight away because the retry function skips it.",
    code: [
      [
        "Skip retry on 404",
        "ts",
        `useQuery({\n  queryKey: ["product", id],\n  queryFn: () => fetchProduct(id),\n  retry: (count, error) => error.status !== 404 && count < 2,\n})`,
        [
          "The function receives the failure count and the error.",
          "Returning false stops retrying.",
        ],
      ],
    ],
    mistakes: [
      "Retrying errors that can never succeed.",
      "Forgetting retries make tests slow.",
    ],
    follow: ["Are mutations retried by default?"],
    points: [
      "Default: 3 retries for queries",
      "Exponential backoff",
      "Configurable via retry and retryDelay",
      "Mutations not retried by default",
    ],
    notes: ["Retry transient errors only."],
    src: [["TanStack Query: Query retries", `${G}/query-retries`]],
  }),
  q({
    slug: "initial-vs-placeholder-data",
    topic: "Caching & stale time",
    d: "hard",
    title: "What is the difference between initialData and placeholderData?",
    kw: [
      "initialData",
      "placeholderData",
      "cache",
      "seeding",
      "keepPreviousData",
    ],
    intent: "Checks you understand how to avoid spinners with prior knowledge.",
    short:
      "`initialData` seeds the cache with real data: the query treats it as successful data, counts it as cached and, depending on `staleTime`, may not refetch. `placeholderData` is only displayed while real data loads, is never written to the cache, and the query stays in the `pending` state. Use `initialData` when you truly have valid data, such as from a list that already contains the item, and `placeholderData` for a temporary view that should still be fetched.",
    detail: [
      "`placeholderData: keepPreviousData` keeps showing the previous page's data while the next loads.",
      "`isPlaceholderData` tells you the shown data is not real yet.",
      "Wrong initialData can make users see wrong values without a refetch.",
    ],
    ex: "Opening a product from a list uses the list item as placeholder so the page shows the title instantly while the full detail loads.",
    mistakes: [
      "Using initialData for incomplete data and skipping the fetch.",
      "Treating placeholder data as real.",
    ],
    follow: ["What is isPlaceholderData?"],
    points: [
      "initialData is cached, real data",
      "placeholderData is temporary and not cached",
      "Placeholder keeps status pending",
      "keepPreviousData for pagination",
    ],
    notes: ["Initial = real, placeholder = pretend."],
    src: [
      ["TanStack Query: Initial query data", `${G}/initial-query-data`],
      ["TanStack Query: Placeholder query data", `${G}/placeholder-query-data`],
    ],
  }),
  q({
    slug: "prefetching-queries",
    topic: "Caching & stale time",
    d: "hard",
    title: "What is prefetching and when does it help?",
    kw: [
      "prefetchQuery",
      "prefetching",
      "hover",
      "navigation",
      "perceived performance",
    ],
    intent: "Checks you know how to warm the cache ahead of need.",
    short:
      "Prefetching loads data into the cache before a component needs it, using `queryClient.prefetchQuery` with the same key and function the real query will use. When the user then opens the page, the data is already cached and shows without a loading state. It is commonly triggered on link hover or focus, or before a route change. Whether the prefetched data is reused without refetching depends on `staleTime`.",
    detail: [
      "Prefetching does not return the data and does not throw errors.",
      "A `staleTime` greater than zero stops an immediate refetch of what was just fetched.",
      "Prefetch only likely navigations to avoid wasting bandwidth.",
    ],
    ex: "Hovering a product card prefetches its detail so the detail page opens instantly.",
    code: [
      [
        "Prefetch on hover",
        "tsx",
        `<Link\n  to={\`/products/\${id}\`}\n  onMouseEnter={() =>\n    queryClient.prefetchQuery({\n      queryKey: ["product", id],\n      queryFn: () => fetchProduct(id),\n      staleTime: 60_000,\n    })\n  }\n>`,
        [
          "Hover starts the fetch early.",
          "The key matches the detail page's query.",
          "`staleTime` keeps it fresh after the click.",
        ],
      ],
    ],
    mistakes: [
      "Using different keys for prefetch and the real query.",
      "Prefetching everything.",
    ],
    follow: ["Why must the key match?"],
    points: [
      "Warm the cache early",
      "Same key and function",
      "Trigger on hover or route change",
      "staleTime avoids refetch",
    ],
    notes: ["Prefetch with the same key."],
    src: [["TanStack Query: Prefetching", `${G}/prefetching`]],
  }),
  q({
    slug: "invalidate-queries",
    topic: "Invalidation",
    d: "medium",
    title: "What does invalidateQueries do?",
    kw: [
      "invalidateQueries",
      "stale",
      "refetch",
      "query key prefix",
      "after mutation",
    ],
    intent: "Checks you know how to refresh data after a change.",
    short:
      '`queryClient.invalidateQueries({ queryKey })` marks matching cached queries as stale and, if they are currently in use by a mounted component, refetches them immediately. Matching is by prefix, so invalidating `["todos"]` also affects `["todos", { page: 2 }]`. Call it after a mutation succeeds to make sure the screen reflects the server\'s data. Queries not currently used are only marked stale and are refetched the next time they are used.',
    detail: [
      "Return the promise from `onSuccess` to keep the mutation pending until refetching ends.",
      "More precise options let you target exact keys or filter with a predicate.",
      "Invalidation is the simple and robust default compared with editing the cache by hand.",
    ],
    ex: 'After adding a task, invalidating `["tasks"]` refetches the visible list and marks any other cached task queries stale.',
    code: [
      [
        "Invalidate after a write",
        "ts",
        `useMutation({\n  mutationFn: addTask,\n  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),\n})`,
        [
          "The mutation succeeds, then all queries starting with `tasks` are marked stale.",
          "Active ones refetch right away.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to invalidate and showing stale lists.",
      "Invalidating everything instead of a prefix.",
    ],
    follow: ["How does key prefix matching work?"],
    points: [
      "Marks matching queries stale",
      "Refetches active ones",
      "Prefix matching",
      "Call after mutations",
    ],
    notes: ["Mutation succeeds, invalidate the key."],
    src: [["TanStack Query: Query invalidation", `${G}/query-invalidation`]],
  }),
  q({
    slug: "invalidate-vs-refetch-vs-setquerydata",
    topic: "Invalidation",
    d: "hard",
    title: "When would you use invalidateQueries, refetch or setQueryData?",
    kw: [
      "refetch",
      "setQueryData",
      "invalidateQueries",
      "cache update",
      "trade-offs",
    ],
    intent: "Checks you can choose the right way to refresh data.",
    short:
      "`invalidateQueries` is the usual choice after a change: it marks related queries stale and refetches the active ones, so the server stays the source of truth. `refetch` re-runs one specific query you hold a handle to, for example from a refresh button. `setQueryData` writes data directly into the cache without a request, which is fast and suits cases where a mutation already returned the new value or for optimistic updates, but it can drift from the server if you get the update wrong.",
    detail: [
      "Invalidate by key prefix to cover all variations of a list.",
      "`refetch` ignores `enabled` and `staleTime`.",
      "A common combination is `setQueryData` for the changed item plus invalidation of the list.",
    ],
    ex: "Editing a task writes the returned task into its detail cache and invalidates the list queries.",
    mistakes: [
      "Calling refetch for data that other components also use under different keys.",
      "Hand-editing a complex list in the cache.",
    ],
    follow: ["Why can setQueryData drift from the server?"],
    points: [
      "Invalidate: safe default",
      "Refetch: one known query",
      "setQueryData: direct write, no request",
      "Combine for best UX",
    ],
    notes: ["Default to invalidation."],
    src: [
      ["TanStack Query: Query invalidation", `${G}/query-invalidation`],
      [
        "TanStack Query: Updates from mutation responses",
        `${G}/updates-from-mutation-responses`,
      ],
    ],
  }),
  q({
    slug: "invalidate-after-mutation-pattern",
    topic: "Invalidation",
    d: "medium",
    title: "How do you keep lists and detail pages in sync after an edit?",
    kw: [
      "query key factory",
      "list and detail",
      "invalidate",
      "consistency",
      "cache sync",
    ],
    intent:
      "Checks you can structure keys so one invalidation refreshes everything related.",
    short:
      'Design keys with a shared prefix, such as `["todos", "list", filters]` and `["todos", "detail", id]`. After an edit, invalidate `["todos"]`, which marks both the list queries and the detail queries stale, and the ones currently on screen refetch. A small key factory object that builds these keys keeps them consistent across the codebase. This is simpler and more reliable than manually updating each cached copy.',
    detail: [
      "A typo in a key silently creates a separate cache entry, so centralise key construction.",
      "Invalidate narrower keys when whole-group refetching would be wasteful.",
      "Pair with `staleTime` so related pages do not refetch too eagerly.",
    ],
    ex: "Completing a todo invalidates the `todos` group, and both the list page and the open detail drawer refresh.",
    code: [
      [
        "A key factory",
        "ts",
        `export const todoKeys = {\n  all: ["todos"] as const,\n  list: (filters: Filters) => [...todoKeys.all, "list", filters] as const,\n  detail: (id: number) => [...todoKeys.all, "detail", id] as const,\n}\n\nqueryClient.invalidateQueries({ queryKey: todoKeys.all })`,
        [
          "All keys share the `todos` prefix.",
          "Invalidating `all` refreshes lists and details.",
        ],
      ],
    ],
    mistakes: [
      "Inline keys with slightly different spellings.",
      "Invalidating nothing and relying on window focus.",
    ],
    follow: ["Why centralise key creation?"],
    points: [
      "Shared prefix for a group",
      "Key factory for consistency",
      "One invalidation refreshes all",
      "Narrow when needed",
    ],
    notes: ["Group by prefix, invalidate the prefix."],
    src: [
      ["TanStack Query: Query keys", `${G}/query-keys`],
      ["TanStack Query: Query invalidation", `${G}/query-invalidation`],
    ],
  }),
  q({
    slug: "paginated-queries-keep-previous-data",
    topic: "Pagination & infinite queries",
    d: "medium",
    title: "How do you paginate with TanStack Query without UI flicker?",
    kw: [
      "pagination",
      "keepPreviousData",
      "placeholderData",
      "page key",
      "isPlaceholderData",
    ],
    intent: "Checks you can paginate smoothly using the page in the query key.",
    short:
      "Put the page number in the query key, so each page is cached separately, and use `placeholderData: keepPreviousData` so the previous page stays on screen while the next one loads, instead of flashing a loading state. `isPlaceholderData` tells you the visible data is the old page, so you can disable the Next button until the new page arrives. Going back to a page you have seen shows it instantly from the cache.",
    detail: [
      "`keepPreviousData` is a function imported from the library in version 5.",
      "The server response should say if there is a next page.",
      "Prefetching the next page can make paging feel instant.",
    ],
    ex: "A table shows page 2 while page 3 loads in the background, then swaps to page 3 without a blank gap.",
    code: [
      [
        "Keep the previous page",
        "tsx",
        `const { data, isPlaceholderData } = useQuery({\n  queryKey: ["projects", page],\n  queryFn: () => fetchProjects(page),\n  placeholderData: keepPreviousData,\n})\n\n<button disabled={isPlaceholderData || !data?.hasMore} onClick={() => setPage(page + 1)}>Next</button>`,
        [
          "The page is in the key.",
          "The old data stays visible while loading.",
          "Next is disabled while the shown data is a placeholder.",
        ],
      ],
    ],
    mistakes: [
      "Leaving the page out of the key.",
      "Showing a spinner for each page change.",
    ],
    follow: ["How would you prefetch the next page?"],
    points: [
      "Page in the key",
      "placeholderData: keepPreviousData",
      "isPlaceholderData flag",
      "Pages cached separately",
    ],
    notes: ["Key the page, keep the old data."],
    src: [["TanStack Query: Paginated queries", `${G}/paginated-queries`]],
  }),
  q({
    slug: "useinfinitequery-basics",
    topic: "Pagination & infinite queries",
    d: "hard",
    title: "How does useInfiniteQuery work?",
    kw: [
      "useInfiniteQuery",
      "getNextPageParam",
      "fetchNextPage",
      "initialPageParam",
      "pages",
    ],
    intent: "Checks you can build load-more or infinite scroll lists.",
    short:
      "`useInfiniteQuery` loads data page by page and accumulates the pages. You provide an `initialPageParam`, a `queryFn` that receives `pageParam`, and `getNextPageParam`, which looks at the last page and returns the parameter for the next one, or `undefined` when there are no more pages. The result has `data.pages`, `fetchNextPage`, `hasNextPage` and `isFetchingNextPage`. Call `fetchNextPage` from a 'Load more' button or when a sentinel enters the viewport.",
    detail: [
      "The pages array is flattened for rendering, for example with `flatMap`.",
      "Cursor-based pagination from the API fits `getNextPageParam` well.",
      "In version 5, `initialPageParam` is required.",
    ],
    ex: "A feed loads 20 posts at a time; 'Load more' calls `fetchNextPage` and appends the next 20.",
    code: [
      [
        "Load more",
        "tsx",
        `const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({\n  queryKey: ["feed"],\n  queryFn: ({ pageParam }) => fetchFeed(pageParam),\n  initialPageParam: 0,\n  getNextPageParam: (last) => last.nextCursor ?? undefined,\n})\n\nconst posts = data?.pages.flatMap((p) => p.items) ?? []`,
        [
          "`pageParam` starts at `initialPageParam`.",
          "`getNextPageParam` returns the next cursor or undefined.",
          "Pages are flattened into one list.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to return undefined at the end so it loads forever.",
      "Not showing a fetching-next-page state.",
    ],
    follow: ["What does getNextPageParam returning undefined mean?"],
    points: [
      "Accumulates pages",
      "initialPageParam and getNextPageParam",
      "fetchNextPage and hasNextPage",
      "Flatten pages to render",
    ],
    notes: ["Return undefined to stop."],
    src: [
      ["TanStack Query: Infinite queries", `${G}/infinite-queries`],
      ["TanStack Query: useInfiniteQuery", `${T}/reference/useInfiniteQuery`],
    ],
  }),
  q({
    slug: "offset-vs-cursor-pagination-client",
    topic: "Pagination & infinite queries",
    d: "medium",
    title: "How do offset pages and cursors differ for a client?",
    kw: [
      "cursor pagination",
      "offset pagination",
      "page param",
      "nextCursor",
      "stable lists",
    ],
    intent:
      "Checks you can pick the pagination style that fits the UI and the API.",
    short:
      "Offset or page-number pagination asks for page N and works well for numbered tables where users jump to any page. Cursor pagination asks for items after the last item seen, using a cursor returned by the server, and suits feeds and infinite scroll because it stays consistent when items are added or removed while the user scrolls. In TanStack Query, page numbers fit `useQuery` with the page in the key, and cursors fit `useInfiniteQuery` through `getNextPageParam`.",
    detail: [
      "With offsets, inserts or deletes can make items repeat or be skipped between pages.",
      "Cursors cannot jump straight to page 10.",
      "The API design decides what the client can use.",
    ],
    ex: "An admin table uses numbered pages, while a social feed uses a cursor.",
    mistakes: [
      "Using offset paging for a rapidly changing feed.",
      "Using cursors for UI that needs page numbers.",
    ],
    follow: ["Which fits infinite scroll better?"],
    points: [
      "Offset: numbered pages",
      "Cursor: stable feeds",
      "Match the query hook to the style",
      "API decides",
    ],
    notes: ["Tables: offset. Feeds: cursor."],
    src: [
      ["TanStack Query: Paginated queries", `${G}/paginated-queries`],
      ["TanStack Query: Infinite queries", `${G}/infinite-queries`],
    ],
  }),
  q({
    slug: "optimistic-updates-concept",
    topic: "Optimistic updates",
    d: "hard",
    title: "What is an optimistic update and when is it appropriate?",
    kw: [
      "optimistic update",
      "rollback",
      "perceived performance",
      "onMutate",
      "failure",
    ],
    intent:
      "Checks you understand the trade-off of showing results before the server confirms.",
    short:
      "An optimistic update shows the expected result of a mutation in the UI immediately, before the server responds, and rolls back if the request fails. It makes interactions such as toggling a like or ticking a task feel instant. It is appropriate for actions that rarely fail and are easy to undo; it is a poor choice for operations like payments, where showing success before it is confirmed would mislead the user.",
    detail: [
      "A rollback path and an error message are required.",
      "Refetching at the end ensures the cache matches the server whatever happened.",
      "TanStack Query supports two approaches: updating the cache, and showing the pending variables in the UI.",
    ],
    ex: "Ticking a todo shows it as done instantly; if the request fails, it unticks and a message appears.",
    mistakes: [
      "Optimistic updates for payments.",
      "No rollback or error message.",
    ],
    follow: ["Which actions suit optimistic updates?"],
    points: [
      "Show the result before confirmation",
      "Needs rollback",
      "Good for low-risk actions",
      "Refetch at the end",
    ],
    notes: ["Optimism needs a rollback plan."],
    src: [["TanStack Query: Optimistic updates", `${G}/optimistic-updates`]],
  }),
  q({
    slug: "optimistic-updates-cache-approach",
    topic: "Optimistic updates",
    d: "hard",
    title: "How do you implement an optimistic update by editing the cache?",
    kw: ["onMutate", "cancelQueries", "setQueryData", "rollback", "onSettled"],
    intent:
      "Checks you know the steps that make a cache-based optimistic update safe.",
    short:
      "In `onMutate`, first cancel outgoing refetches for the key with `cancelQueries`, so they cannot overwrite the optimistic value. Then snapshot the current data with `getQueryData`, write the optimistic value with `setQueryData`, and return the snapshot as context. In `onError`, restore the snapshot from the context to roll back. In `onSettled`, call `invalidateQueries` so the cache finishes in sync with the server whether the mutation succeeded or failed.",
    detail: [
      "The snapshot is needed because the failing request cannot tell you the previous value.",
      "Use immutable updates when writing the new value.",
      "This approach changes every place that reads this cached data.",
    ],
    ex: "Renaming a todo updates the cached list at once; if the server rejects it, the old title returns.",
    code: [
      [
        "Cache-based optimistic update",
        "ts",
        `useMutation({\n  mutationFn: updateTodo,\n  onMutate: async (next) => {\n    await queryClient.cancelQueries({ queryKey: ["todos"] })\n    const previous = queryClient.getQueryData<Todo[]>(["todos"])\n    queryClient.setQueryData<Todo[]>(["todos"], (old) =>\n      old?.map((t) => (t.id === next.id ? { ...t, ...next } : t))\n    )\n    return { previous }\n  },\n  onError: (_err, _vars, ctx) => queryClient.setQueryData(["todos"], ctx?.previous),\n  onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),\n})`,
        [
          "Cancel in-flight fetches first.",
          "Save the old data and apply the new.",
          "Roll back on error.",
          "Always resync at the end.",
        ],
      ],
    ],
    mistakes: [
      "Skipping cancelQueries so a refetch overwrites the optimistic data.",
      "Not returning the snapshot for rollback.",
    ],
    follow: ["Why is cancelQueries needed?"],
    points: [
      "cancelQueries first",
      "Snapshot, then setQueryData",
      "Roll back in onError",
      "Invalidate in onSettled",
    ],
    notes: ["Cancel, snapshot, set, rollback, resync."],
    src: [["TanStack Query: Optimistic updates", `${G}/optimistic-updates`]],
  }),
  q({
    slug: "optimistic-updates-variables-approach",
    topic: "Optimistic updates",
    d: "medium",
    title: "What is the simpler variables-based way to show optimistic UI?",
    kw: [
      "mutation variables",
      "optimistic ui",
      "isPending",
      "no cache edit",
      "simple approach",
    ],
    intent: "Checks you know a lower-risk alternative to editing the cache.",
    short:
      "Instead of editing the cache, render the pending mutation's `variables` while `isPending` is true, for example showing the new item with reduced opacity at the end of the list. When the mutation settles and the list is invalidated and refetched, the real item replaces it. If it fails, the pending item simply disappears or shows a retry. There is no rollback code to write, and only the component that owns the mutation shows the optimistic state.",
    detail: [
      "It suits UI where the optimistic result appears in one place.",
      "If several components must show the change, use the cache approach.",
      "`useMutationState` can read pending variables from elsewhere.",
    ],
    ex: "A comment box shows the just-submitted comment in grey with 'Sending...' until the server accepts it.",
    mistakes: [
      "Using the cache approach when a local view is enough.",
      "Not offering a retry after failure.",
    ],
    follow: ["When is the cache approach better?"],
    points: [
      "Render pending variables",
      "No rollback code",
      "Local to one component",
      "Cache approach for many readers",
    ],
    notes: ["Simple case: show the variables."],
    src: [["TanStack Query: Optimistic updates", `${G}/optimistic-updates`]],
  }),
  q({
    slug: "tanstack-query-devtools-and-testing",
    topic: "Optimistic updates",
    d: "medium",
    title: "How do you debug and test code that uses TanStack Query?",
    kw: [
      "devtools",
      "testing",
      "retry false",
      "QueryClient per test",
      "debugging",
    ],
    intent:
      "Checks you know tooling for inspecting the cache and keeping tests isolated.",
    short:
      "The React Query Devtools, installed as a separate package and rendered in development, show every query with its key, status, data and staleness, and let you refetch or invalidate. For tests, create a fresh `QueryClient` for each test so cached data does not leak between them, wrap the component in a provider, and set `retry: false` so failures are reported immediately instead of after retries and backoff. Mock the network layer and wait for the UI with async queries such as `findBy`.",
    detail: [
      "Sharing one client across tests causes order-dependent failures.",
      "Mocking at the network level, for example with MSW, tests the real hook behaviour.",
      "Set a short or zero `gcTime` in tests to avoid timers keeping the process alive.",
    ],
    ex: "A test helper builds a new client with `retry: false`, renders the component inside a provider and waits for the data to appear.",
    code: [
      [
        "Test wrapper",
        "tsx",
        `function renderWithClient(ui: React.ReactElement) {\n  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })\n  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)\n}`,
        [
          "Each test gets its own client.",
          "Retries are off so errors show at once.",
        ],
      ],
    ],
    mistakes: [
      "Sharing one client between tests.",
      "Leaving retries on and waiting for timeouts.",
    ],
    follow: ["Why mock at the network level?"],
    points: [
      "Devtools show the cache",
      "Fresh client per test",
      "retry: false in tests",
      "Wait for async UI",
    ],
    notes: ["New client per test."],
    src: [
      ["TanStack Query: Devtools", `${T}/devtools`],
      ["TanStack Query: Testing", `${G}/testing`],
    ],
  }),
])
