import { defineQuestions } from "../author"
import { q } from "../compact"

const RTK = "https://redux-toolkit.js.org"
const RX = "https://redux.js.org"
const Z = "https://zustand.docs.pmnd.rs"
const RD = "https://react.dev"

export default defineQuestions("state-management", "fresher", [
  q({
    slug: "what-is-redux-three-principles",
    topic: "Redux Toolkit",
    d: "easy",
    title: "What is Redux and what are its three principles?",
    kw: ["redux", "store", "action", "reducer", "single source of truth"],
    intent:
      "Checks you understand the core idea behind Redux before the tooling.",
    short:
      "Redux is a library for managing application state in one central store with predictable updates. Its three principles are: a single source of truth, meaning the whole app state lives in one store; state is read-only, so the only way to change it is to dispatch an action that describes what happened; and changes are made with pure reducer functions that take the previous state and an action and return the next state.",
    detail: [
      "Because every change is an action passed through reducers, the history of changes is easy to inspect and debug.",
      "Components read state through selectors and send actions with `dispatch`.",
      "Redux is not required for every app; it helps when many parts of the app share and update the same state.",
    ],
    ex: "In a shopping app the cart items live in the store; clicking 'Add' dispatches an action and the cart reducer returns a new cart.",
    mistakes: [
      "Putting every piece of state into Redux, including simple form input.",
      "Changing state directly instead of dispatching actions.",
    ],
    follow: ["What is a pure function and why must reducers be pure?"],
    points: [
      "One store as source of truth",
      "State changes only via actions",
      "Reducers are pure functions",
      "Predictable and debuggable",
    ],
    notes: ["Action in, reducer computes new state."],
    src: [
      [
        "Redux: Three principles",
        `${RX}/understanding/thinking-in-redux/three-principles`,
      ],
    ],
  }),
  q({
    slug: "why-redux-toolkit",
    topic: "Redux Toolkit",
    d: "easy",
    title:
      "What is Redux Toolkit and why is it the recommended way to write Redux?",
    kw: [
      "redux toolkit",
      "rtk",
      "boilerplate",
      "configureStore",
      "createSlice",
    ],
    intent: "Checks you know modern Redux is written with Redux Toolkit.",
    short:
      "Redux Toolkit, or RTK, is the official, opinionated toolset for writing Redux logic. It removes much of the boilerplate of hand-written Redux by providing `configureStore` for store setup, `createSlice` for reducers and actions together, `createAsyncThunk` for async logic and RTK Query for data fetching. The Redux team recommends it as the standard way to use Redux, and it includes good defaults such as Redux DevTools support and checks that catch common mistakes.",
    detail: [
      "It builds on the same Redux principles; the store, actions and reducers are still the same ideas.",
      "Immer is built in, so reducers can be written in a simpler style.",
      "Older code that writes switch-statement reducers by hand can be migrated gradually.",
    ],
    ex: "A new project uses `configureStore` and a few `createSlice` files instead of separate action types, action creators and switch reducers.",
    mistakes: [
      "Writing hand-made action types for new code.",
      "Treating Redux Toolkit as a different library to Redux.",
    ],
    follow: ["What does createSlice generate for you?"],
    points: [
      "Official recommended approach",
      "Less boilerplate",
      "Includes Immer and DevTools setup",
      "Same Redux concepts underneath",
    ],
    notes: ["Use RTK for all new Redux code."],
    src: [
      [
        "Redux: Why Redux Toolkit is how you should use Redux",
        `${RX}/introduction/why-rtk-is-redux-today`,
      ],
      ["Redux Toolkit: Getting started", `${RTK}/introduction/getting-started`],
    ],
  }),
  q({
    slug: "configurestore-and-provider",
    topic: "Redux Toolkit",
    d: "easy",
    title: "How do you set up a Redux store with configureStore and Provider?",
    kw: ["configureStore", "Provider", "store setup", "reducer", "devtools"],
    intent: "Checks you can wire a Redux store into a React app.",
    short:
      "Call `configureStore` with a `reducer` object that maps state keys to slice reducers, and wrap the app in react-redux's `<Provider store={store}>` so components can reach the store. `configureStore` also sets up the default middleware, including thunk support and development-time checks for state mutations and non-serializable values, and enables Redux DevTools. Each key in the reducer object becomes a top-level slice of state.",
    detail: [
      "The store is created once, outside components.",
      "TypeScript users export `RootState` and `AppDispatch` types from the store.",
      "Only serialisable values such as plain objects, arrays and primitives should be kept in state.",
    ],
    ex: "An app registers `cart` and `user` slice reducers, then wraps `<App />` in the Provider in the entry file.",
    code: [
      [
        "Store and provider",
        "tsx",
        `import { configureStore } from "@reduxjs/toolkit"\nimport { Provider } from "react-redux"\n\nexport const store = configureStore({\n  reducer: { cart: cartReducer, user: userReducer },\n})\n\n<Provider store={store}>\n  <App />\n</Provider>`,
        [
          "`reducer` maps state keys to slice reducers.",
          "`Provider` exposes the store to every component below.",
        ],
      ],
    ],
    mistakes: [
      "Creating the store inside a component.",
      "Storing class instances or functions in state.",
    ],
    follow: ["Why should state be serialisable?"],
    points: [
      "configureStore with a reducer map",
      "Provider wraps the app",
      "Default middleware and DevTools",
      "Create the store once",
    ],
    notes: ["configureStore + Provider."],
    src: [
      ["Redux Toolkit: configureStore", `${RTK}/api/configureStore`],
      ["Redux Toolkit: Quick start", `${RTK}/tutorials/quick-start`],
    ],
  }),
  q({
    slug: "createslice-and-immer",
    topic: "Redux Toolkit",
    d: "medium",
    title:
      "What does createSlice do, and how can reducers look like they mutate state?",
    kw: ["createSlice", "immer", "reducers", "action creators", "draft state"],
    intent: "Checks you understand slices and the role of Immer.",
    short:
      "`createSlice` takes a name, an initial state and an object of reducer functions, and returns the slice reducer plus matching action creators. Inside those reducers you may write code that appears to mutate state, such as `state.items.push(x)`, because Redux Toolkit uses Immer: you are changing a draft copy, and Immer produces a new immutable state from the changes. You can instead return a new value, but you must not do both in the same reducer.",
    detail: [
      "The action type strings are generated from the slice name and the reducer key, such as `cart/addItem`.",
      "Mutating syntax is safe only inside `createSlice` or `createReducer`, not in plain reducers.",
      "State outside reducers must still be treated as read-only.",
    ],
    ex: "A cart slice defines `addItem` and `removeItem` reducers, and components call `dispatch(addItem(product))`.",
    code: [
      [
        "A slice",
        "ts",
        `const cartSlice = createSlice({\n  name: "cart",\n  initialState: { items: [] as Item[] },\n  reducers: {\n    addItem(state, action: PayloadAction<Item>) {\n      state.items.push(action.payload)\n    },\n  },\n})\n\nexport const { addItem } = cartSlice.actions\nexport default cartSlice.reducer`,
        [
          "The reducer writes to a draft; Immer returns new state.",
          "Action creators are generated from reducer names.",
          "The reducer is exported to the store.",
        ],
      ],
    ],
    mistakes: [
      "Both mutating the draft and returning a new value.",
      "Mutating state outside a slice reducer.",
    ],
    follow: ["What does Immer do behind the scenes?"],
    points: [
      "Name, initialState, reducers",
      "Generates actions and reducer",
      "Immer drafts allow mutating syntax",
      "Mutate or return, not both",
    ],
    notes: ["Immer makes safe immutable updates look simple."],
    src: [
      ["Redux Toolkit: createSlice", `${RTK}/api/createSlice`],
      [
        "Redux Toolkit: Writing reducers with Immer",
        `${RTK}/usage/immer-reducers`,
      ],
    ],
  }),
  q({
    slug: "reducers-pure-and-immutable",
    topic: "Redux Toolkit",
    d: "medium",
    title: "Why must Redux reducers be pure and treat state immutably?",
    kw: [
      "pure function",
      "immutability",
      "side effects",
      "reducer",
      "time travel",
    ],
    intent: "Checks you understand the rules reducers follow and why.",
    short:
      "A reducer must calculate the next state only from the previous state and the action, with no side effects: no API calls, no random numbers or dates, and no changing of the arguments. It must return a new object when something changes rather than editing the old one. Purity makes updates predictable and testable, lets Redux and React detect changes by comparing references, and keeps tools such as DevTools time-travel debugging reliable.",
    detail: [
      "Side effects belong in thunks, listeners or components, not in reducers.",
      "With Redux Toolkit, Immer handles the immutable copying inside slices.",
      "In development, Redux Toolkit's middleware warns when state is mutated.",
    ],
    ex: "A reducer that calls `Date.now()` would give different results for the same action, breaking replay in DevTools; the timestamp is added to the action before dispatch instead.",
    mistakes: [
      "Calling an API inside a reducer.",
      "Mutating the previous state object.",
    ],
    follow: ["Where should side effects go instead?"],
    points: [
      "Same input gives same output",
      "No side effects",
      "Return new objects",
      "Enables change detection and debugging",
    ],
    notes: ["Reducers compute, they never do."],
    src: [
      [
        "Redux: Immutable update patterns",
        `${RX}/usage/structuring-reducers/immutable-update-patterns`,
      ],
      [
        "Redux: Three principles",
        `${RX}/understanding/thinking-in-redux/three-principles`,
      ],
    ],
  }),
  q({
    slug: "useselector-usedispatch",
    topic: "Redux Toolkit",
    d: "easy",
    title:
      "How do components read and update Redux state with useSelector and useDispatch?",
    kw: ["useSelector", "useDispatch", "react-redux", "selector", "dispatch"],
    intent: "Checks you can connect React components to a store.",
    short:
      "`useSelector` takes a selector function that picks the needed piece of state, for example `(state) => state.cart.items`, and re-renders the component when the selected value changes. `useDispatch` returns the store's `dispatch` function, which you call with an action such as `dispatch(addItem(product))`. Select the smallest piece of state the component needs, so unrelated state changes do not re-render it.",
    detail: [
      "The result of a selector is compared by reference with the previous one.",
      "Do not return a new object or array from a selector on every call, because that causes extra renders.",
      "In TypeScript, typed `useAppSelector` and `useAppDispatch` hooks avoid repeating types.",
    ],
    ex: "A cart badge selects only the item count, so it does not re-render when the user's profile changes.",
    code: [
      [
        "Reading and dispatching",
        "tsx",
        `function AddButton({ product }) {\n  const dispatch = useDispatch()\n  const count = useSelector((s: RootState) => s.cart.items.length)\n  return (\n    <button onClick={() => dispatch(addItem(product))}>\n      Add ({count})\n    </button>\n  )\n}`,
        [
          "`useSelector` subscribes to just the item count.",
          "`dispatch` sends the action to the reducers.",
        ],
      ],
    ],
    mistakes: [
      "Selecting the whole state object.",
      "Returning a fresh array from a selector every time.",
    ],
    follow: ["When does a component re-render after useSelector?"],
    points: [
      "useSelector reads",
      "useDispatch sends actions",
      "Select the smallest value",
      "Reference comparison decides re-render",
    ],
    notes: ["Small selectors, fewer renders."],
    src: [
      [
        "React Redux: Getting started",
        "https://react-redux.js.org/introduction/getting-started",
      ],
      ["Redux Toolkit: Quick start", `${RTK}/tutorials/quick-start`],
    ],
  }),
  q({
    slug: "createasyncthunk-basics",
    topic: "Redux Toolkit",
    d: "medium",
    title: "How does createAsyncThunk handle async requests?",
    kw: [
      "createAsyncThunk",
      "thunk",
      "pending",
      "fulfilled",
      "rejected",
      "extraReducers",
    ],
    intent: "Checks you can model loading and error states for async work.",
    short:
      "`createAsyncThunk` takes an action type prefix and an async function, and returns a thunk action creator. When dispatched, it automatically dispatches `pending`, then `fulfilled` with the returned value or `rejected` with an error. A slice handles these in its `extraReducers`, which lets you store a status such as `loading`, `succeeded` or `failed`, plus the data or error. For server data, RTK Query usually removes the need to write this by hand.",
    detail: [
      "The async function receives the argument you pass to dispatch.",
      "Returned values must be serialisable.",
      "Lifecycle actions give the UI the information needed for spinners and error messages.",
    ],
    ex: "A `fetchOrders` thunk loads the orders list; the orders slice sets `status` to `loading` on pending and stores the result on fulfilled.",
    code: [
      [
        "Thunk and slice",
        "ts",
        `export const fetchOrders = createAsyncThunk("orders/fetch", async () => {\n  const res = await fetch("/api/orders")\n  return (await res.json()) as Order[]\n})\n\nconst slice = createSlice({\n  name: "orders",\n  initialState: { items: [] as Order[], status: "idle" },\n  reducers: {},\n  extraReducers: (b) => {\n    b.addCase(fetchOrders.pending, (s) => { s.status = "loading" })\n    b.addCase(fetchOrders.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload })\n    b.addCase(fetchOrders.rejected, (s) => { s.status = "failed" })\n  },\n})`,
        [
          "The thunk returns the data.",
          "Redux dispatches pending, fulfilled or rejected for you.",
          "`extraReducers` updates state for each.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to handle the rejected case.",
      "Rewriting caching and refetching logic that RTK Query already provides.",
    ],
    follow: ["When would you use RTK Query instead?"],
    points: [
      "Generates pending, fulfilled, rejected",
      "Handled in extraReducers",
      "Track status in state",
      "RTK Query for server data",
    ],
    notes: ["Three lifecycle actions for free."],
    src: [["Redux Toolkit: createAsyncThunk", `${RTK}/api/createAsyncThunk`]],
  }),
  q({
    slug: "selectors-and-createselector",
    topic: "Redux Toolkit",
    d: "medium",
    title: "What are selectors and why use createSelector?",
    kw: [
      "selector",
      "createSelector",
      "memoization",
      "derived data",
      "reselect",
    ],
    intent: "Checks you derive data from state instead of storing it.",
    short:
      "A selector is a function that reads or derives data from the Redux state, such as `selectCartTotal`. Keeping selectors in one place means components do not depend on the state shape. `createSelector` builds a memoized selector: it recomputes the result only when its input selectors return new values, so an expensive calculation or a derived array keeps the same reference between renders. Derived values should be calculated with selectors, not stored in state.",
    detail: [
      "Storing totals or filtered lists as extra state risks them getting out of sync.",
      "Memoization also stops components re-rendering because of a fresh array with the same contents.",
      "Selectors are plain functions, so they are easy to unit test.",
    ],
    ex: "`selectVisibleTodos` combines the todo list and the current filter, and recomputes only when one of them changes.",
    code: [
      [
        "A memoized selector",
        "ts",
        `const selectItems = (s: RootState) => s.cart.items\nconst selectTotal = createSelector([selectItems], (items) =>\n  items.reduce((sum, i) => sum + i.price * i.qty, 0)\n)`,
        [
          "The input selector picks the items.",
          "The result function runs only when items change.",
        ],
      ],
    ],
    mistakes: [
      "Storing derived data in state.",
      "Returning a new array from a plain selector that is used on every render.",
    ],
    follow: ["Why store only the minimal state?"],
    points: [
      "Selectors read and derive",
      "Hide the state shape",
      "createSelector memoizes",
      "Do not store derived data",
    ],
    notes: ["Derive, do not duplicate."],
    src: [
      [
        "Redux: Deriving data with selectors",
        `${RX}/usage/deriving-data-selectors`,
      ],
      ["Redux Toolkit: createSelector", `${RTK}/api/createSelector`],
    ],
  }),
  q({
    slug: "rtk-query-overview",
    topic: "Redux Toolkit",
    d: "medium",
    title: "What is RTK Query and what does it give you?",
    kw: ["rtk query", "createApi", "caching", "data fetching", "hooks"],
    intent: "Checks you know Redux Toolkit has built-in server-data handling.",
    short:
      "RTK Query is the data fetching and caching tool included in Redux Toolkit. You define an API slice with `createApi`, describing endpoints for queries and mutations, and it generates React hooks such as `useGetPostsQuery`. It tracks loading and error status, caches responses, removes duplicate requests, and can refetch after mutations using cache tags. It covers the work people often write by hand with thunks and reducers.",
    detail: [
      "The cached data is kept in the Redux store.",
      "Endpoints have names, and hooks are generated from them.",
      "Tags let a mutation invalidate cached data so it is fetched again.",
    ],
    ex: "A `getProducts` endpoint is used in two components; RTK Query makes one request and shares the cached result.",
    mistakes: [
      "Copying API responses into a slice by hand.",
      "Ignoring tag invalidation after mutations.",
    ],
    follow: ["How does it compare with TanStack Query?"],
    points: [
      "Part of Redux Toolkit",
      "createApi defines endpoints",
      "Generates hooks",
      "Caches and dedupes requests",
    ],
    notes: ["Server data: RTK Query, not slices."],
    src: [
      ["Redux Toolkit: RTK Query overview", `${RTK}/rtk-query/overview`],
      ["Redux Toolkit: Queries", `${RTK}/rtk-query/usage/queries`],
    ],
  }),
  q({
    slug: "what-is-zustand",
    topic: "Zustand",
    d: "easy",
    title: "What is Zustand and how do you create a store?",
    kw: ["zustand", "create", "store", "hook", "set"],
    intent: "Checks you can build a small global store with Zustand.",
    short:
      "Zustand is a small state management library for React. You call `create` with a function that returns the initial state and the actions, and it returns a hook you use in components. The function receives `set` to update state. There is no provider needed, and a component re-renders only when the part of state it selects changes.",
    detail: [
      "State and actions live together in one object.",
      "`set` merges the new object into the existing state at the top level.",
      "The store hook can also be used outside React with `getState`.",
    ],
    ex: "A counter store has `count` and `increment`, and any component calls the hook to read or update them.",
    code: [
      [
        "A counter store",
        "ts",
        `import { create } from "zustand"\n\nconst useCounter = create<{ count: number; increment: () => void }>((set) => ({\n  count: 0,\n  increment: () => set((s) => ({ count: s.count + 1 })),\n}))\n\nfunction Counter() {\n  const count = useCounter((s) => s.count)\n  const increment = useCounter((s) => s.increment)\n  return <button onClick={increment}>{count}</button>\n}`,
        [
          "`create` returns a hook bound to the store.",
          "`set` receives the previous state to compute the next.",
          "Components select only what they need.",
        ],
      ],
    ],
    mistakes: [
      "Expecting a provider to be needed.",
      "Selecting the entire store in every component.",
    ],
    follow: ["How does it differ from Redux?"],
    points: [
      "create returns a hook",
      "No provider required",
      "set updates state",
      "Select slices to limit renders",
    ],
    notes: ["create + selector hook."],
    src: [
      ["Zustand: Introduction", `${Z}/learn/getting-started/introduction`],
      ["Zustand: create", `${Z}/reference/apis/create`],
    ],
  }),
  q({
    slug: "zustand-selectors-rerenders",
    topic: "Zustand",
    d: "medium",
    title: "How do selectors control re-renders in Zustand?",
    kw: ["selector", "re-render", "object.is", "zustand", "subscription"],
    intent: "Checks you know how to avoid needless renders with a store hook.",
    short:
      "When you call the store hook with a selector, such as `useStore((s) => s.count)`, the component subscribes only to that value and re-renders when it changes by strict comparison. If you call the hook with no selector, the component receives the whole state and re-renders on every change. Selecting a single primitive or a stable reference is the simplest way to keep components fast.",
    detail: [
      "Selecting actions is safe because their function references normally stay the same.",
      "A selector that builds a new object or array each time will report a change on every update.",
      "`useShallow` handles the case of picking several values at once.",
    ],
    ex: "A header reading only the user's name is not re-rendered when the cart in the same store changes.",
    mistakes: [
      "Calling the hook with no selector.",
      "Returning a new object from the selector each time.",
    ],
    follow: ["How do you select several values at once?"],
    points: [
      "Selector limits subscription",
      "No selector means whole state",
      "Strict equality comparison",
      "Select stable values",
    ],
    notes: ["Select what you render."],
    src: [
      ["Zustand: Introduction", `${Z}/learn/getting-started/introduction`],
      [
        "Zustand: Prevent rerenders with useShallow",
        `${Z}/learn/guides/prevent-rerenders-with-use-shallow`,
      ],
    ],
  }),
  q({
    slug: "zustand-useshallow",
    topic: "Zustand",
    d: "hard",
    title: "What is useShallow in Zustand and when do you need it?",
    kw: [
      "useShallow",
      "shallow comparison",
      "multiple values",
      "selector",
      "zustand",
    ],
    intent: "Checks you can select several values without extra renders.",
    short:
      "When a selector returns a new object or array, such as `(s) => ({ a: s.a, b: s.b })`, it is a different reference on every call, so the component re-renders after any store change. Wrapping the selector with `useShallow` compares the returned object's top-level values and keeps the previous reference when none changed. Use it when you pick multiple values in one selector, or you may instead call the hook once for each value.",
    detail: [
      "It performs a shallow comparison, not a deep one.",
      "For a single primitive value you do not need it.",
      "It is imported from `zustand/react/shallow`.",
    ],
    ex: "A profile component picks `name` and `email` together with `useShallow`, and does not re-render when unrelated parts of the store change.",
    code: [
      [
        "Select two values",
        "ts",
        `import { useShallow } from "zustand/react/shallow"\n\nconst { name, email } = useUserStore(\n  useShallow((s) => ({ name: s.name, email: s.email }))\n)`,
        [
          "The selector builds a new object each time.",
          "`useShallow` returns the old object if the values are equal.",
        ],
      ],
    ],
    mistakes: [
      "Returning an object from a selector with no equality handling.",
      "Using useShallow for deeply nested values and expecting a deep check.",
    ],
    follow: ["What is the alternative to useShallow?"],
    points: [
      "New object each call causes renders",
      "useShallow compares top-level values",
      "Shallow only",
      "Single primitives do not need it",
    ],
    notes: ["Multiple values: wrap with useShallow."],
    src: [
      ["Zustand: useShallow", `${Z}/reference/hooks/use-shallow`],
      [
        "Zustand: Prevent rerenders with useShallow",
        `${Z}/learn/guides/prevent-rerenders-with-use-shallow`,
      ],
    ],
  }),
  q({
    slug: "zustand-updating-nested-state",
    topic: "Zustand",
    d: "medium",
    title: "How do you update nested state in Zustand?",
    kw: ["set", "nested state", "spread", "immer", "immutable update"],
    intent:
      "Checks you know that `set` merges only one level and state is immutable.",
    short:
      "Zustand's `set` shallowly merges the object you return into the state, so top-level keys you do not mention are kept. Nested objects are not merged: you must copy them yourself with the spread operator, for example `set((s) => ({ user: { ...s.user, name } }))`. State must not be mutated directly. The optional immer middleware lets you write mutating-style updates on a draft if deeply nested updates become noisy.",
    detail: [
      "Passing `true` as a second argument to `set` replaces the whole state instead of merging.",
      "Keeping state flat reduces the need for deep updates.",
      "Arrays are updated with methods that return new arrays, such as `map` and `filter`.",
    ],
    ex: "Updating a user's city inside `profile.address` copies each level with spread to keep the other fields.",
    code: [
      [
        "Nested update",
        "ts",
        `set((s) => ({\n  profile: {\n    ...s.profile,\n    address: { ...s.profile.address, city: "Pune" },\n  },\n}))`,
        [
          "Each level is copied so sibling fields survive.",
          "The result is a new state object, not a mutation.",
        ],
      ],
    ],
    mistakes: [
      "Assigning to a nested property directly.",
      "Expecting nested objects to be merged automatically.",
    ],
    follow: ["When would you use the immer middleware?"],
    points: [
      "set merges one level",
      "Copy nested objects",
      "Never mutate state",
      "Keep state flat",
    ],
    notes: ["Shallow merge only."],
    src: [["Zustand: Updating state", `${Z}/learn/guides/updating-state`]],
  }),
  q({
    slug: "zustand-persist-middleware",
    topic: "Zustand",
    d: "medium",
    title: "How do you persist Zustand state with the persist middleware?",
    kw: ["persist", "middleware", "localStorage", "partialize", "rehydrate"],
    intent: "Checks you can keep selected state across page reloads.",
    short:
      "Wrap the store creator with the `persist` middleware and give it a unique `name`, which becomes the storage key. By default it saves state to `localStorage` as JSON and restores it when the store is created. Use the `partialize` option to save only some fields, and the `storage` option to use `sessionStorage` or another storage. Do not persist secrets such as tokens in plain browser storage.",
    detail: [
      "Only serialisable state can be persisted; functions are not saved.",
      "A `version` and `migrate` function help when the stored shape changes between releases.",
      "Hydration may happen after the first render, so UI can briefly show initial values.",
    ],
    ex: "A theme store persists the chosen colour scheme, so the setting survives a reload.",
    code: [
      [
        "Persisted store",
        "ts",
        `import { create } from "zustand"\nimport { persist } from "zustand/middleware"\n\ntype Theme = { dark: boolean; toggle: () => void }\n\nconst useTheme = create<Theme>()(\n  persist(\n    (set) => ({ dark: false, toggle: () => set((s) => ({ dark: !s.dark })) }),\n    { name: "theme" }\n  )\n)`,
        [
          "`persist` wraps the store creator.",
          "`name` is the storage key.",
          "State is restored on load.",
        ],
      ],
    ],
    mistakes: [
      "Persisting sensitive data in localStorage.",
      "Changing the state shape without a version and migration.",
    ],
    follow: ["Why not store access tokens this way?"],
    points: [
      "Wrap with persist and a name",
      "Defaults to localStorage",
      "partialize chooses fields",
      "Version and migrate for changes",
    ],
    notes: ["Persist preferences, not secrets."],
    src: [["Zustand: persist", `${Z}/reference/middlewares/persist`]],
  }),
  q({
    slug: "zustand-outside-react-and-devtools",
    topic: "Zustand",
    d: "medium",
    title:
      "Can you use a Zustand store outside React components, and how do you debug it?",
    kw: ["getState", "setState", "subscribe", "devtools", "outside react"],
    intent: "Checks you know the store is usable beyond hooks.",
    short:
      "Yes. The hook returned by `create` also has `getState`, `setState` and `subscribe` attached, so non-React code such as an API client can read the token with `useAuth.getState().token` or update state with `setState`. For debugging, the `devtools` middleware connects the store to the Redux DevTools browser extension, where you can inspect state and see each change. Using `getState` inside a component would not subscribe it to updates, so use the hook there.",
    detail: [
      "Name actions in `set` calls (the third argument) for clearer DevTools entries.",
      "`subscribe` lets non-React code react to state changes.",
      "Enable devtools only where useful, since it adds overhead.",
    ],
    ex: "An HTTP client reads the current user's token from the store when it builds a request header.",
    code: [
      [
        "Outside a component",
        "ts",
        `const token = useAuth.getState().token\nuseAuth.setState({ token: null })`,
        [
          "`getState` reads the current snapshot.",
          "`setState` updates the store without a component.",
        ],
      ],
    ],
    mistakes: [
      "Calling getState in a component and expecting re-renders.",
      "Leaving devtools on in a public build when not needed.",
    ],
    follow: ["How do you listen to changes outside React?"],
    points: [
      "getState, setState, subscribe on the hook",
      "Works in plain modules",
      "devtools middleware for debugging",
      "Use the hook in components",
    ],
    notes: ["getState does not subscribe."],
    src: [
      ["Zustand: create", `${Z}/reference/apis/create`],
      ["Zustand: devtools", `${Z}/reference/middlewares/devtools`],
    ],
  }),
  q({
    slug: "zustand-slices-pattern",
    topic: "Zustand",
    d: "hard",
    title:
      "How do you organise a larger Zustand store with the slices pattern?",
    kw: [
      "slices pattern",
      "store organisation",
      "zustand",
      "modularity",
      "combine",
    ],
    intent: "Checks you can keep a growing store maintainable.",
    short:
      "The slices pattern splits one large store into several slice creator functions, each owning a piece of state and its actions, such as a cart slice and a user slice. Each creator receives `set` and `get`, and a single `create` call spreads them together into the combined store. This keeps files small and focused while components still use one hook with selectors. Slices can read each other's state through `get`.",
    detail: [
      "A single store with slices is an alternative to several separate stores.",
      "Separate stores are also fine when the state is unrelated.",
      "Keep slice names and action names clear to avoid collisions.",
    ],
    ex: "An app combines `createCartSlice` and `createUserSlice` into one `useBoundStore`.",
    code: [
      [
        "Combining slices",
        "ts",
        `const createCartSlice = (set) => ({\n  items: [],\n  addItem: (i) => set((s) => ({ items: [...s.items, i] })),\n})\nconst createUserSlice = (set) => ({\n  name: "",\n  setName: (name) => set({ name }),\n})\n\nexport const useBoundStore = create((...a) => ({\n  ...createCartSlice(...a),\n  ...createUserSlice(...a),\n}))`,
        [
          "Each slice owns its state and actions.",
          "One `create` call merges them into one store.",
        ],
      ],
    ],
    mistakes: [
      "One huge file for all state.",
      "Two slices using the same key by accident.",
    ],
    follow: ["When would separate stores be better?"],
    points: [
      "Slice creators per feature",
      "Combined in one create call",
      "Slices can use get",
      "Avoid key collisions",
    ],
    notes: ["Split by feature, combine once."],
    src: [["Zustand: Slices pattern", `${Z}/learn/guides/slices-pattern`]],
  }),
  q({
    slug: "server-state-vs-client-state",
    topic: "Server vs client state",
    d: "easy",
    title: "What is the difference between server state and client state?",
    kw: ["server state", "client state", "async", "stale data", "ownership"],
    intent: "Checks you can separate remote data from UI state.",
    short:
      "Client state is owned entirely by the browser and is synchronous, such as whether a menu is open, a selected tab or a form draft. Server state lives on a remote server, is fetched asynchronously, can be changed by other users, and can become stale. Because the app only holds a cached copy, server state needs loading and error handling, caching, refetching and invalidation, which a data-fetching library handles better than a plain store.",
    detail: [
      "Different tools suit the two: a query library for server state, and `useState`, context or a store for client state.",
      "Mixing them in one store makes you re-implement caching by hand.",
      "Some state is in between, such as a draft of server data being edited.",
    ],
    ex: "The list of orders is server state; whether the filter panel is open is client state.",
    mistakes: [
      "Copying fetched data into a global store.",
      "Treating cached server data as always up to date.",
    ],
    follow: ["Which tool would you use for each?"],
    points: [
      "Client: local and synchronous",
      "Server: remote, async, can be stale",
      "Different tools fit each",
      "Do not mirror server data in a store",
    ],
    notes: ["You own client state; you only cache server state."],
    src: [
      [
        "TanStack Query: Does this replace client state?",
        "https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state",
      ],
      [
        "TanStack Query: Overview",
        "https://tanstack.com/query/latest/docs/framework/react/overview",
      ],
    ],
  }),
  q({
    slug: "avoid-copying-server-data-into-store",
    topic: "Server vs client state",
    d: "medium",
    title: "Why shouldn't you copy fetched data into Redux or Zustand?",
    kw: [
      "server data",
      "store duplication",
      "cache",
      "stale",
      "single source of truth",
    ],
    intent:
      "Checks you understand the cost of manually caching server responses.",
    short:
      "Copying API responses into a global store makes you responsible for what a data library gives you: loading and error flags, caching, de-duplicating requests, knowing when data is stale, refetching, and invalidating after changes. It also creates two sources of truth that drift apart. Keep fetched data in a server-state tool such as TanStack Query or RTK Query, and keep the store for real client state.",
    detail: [
      "A manual store often loads once and never refreshes, showing stale data.",
      "Mutations need to update every copy of the data.",
      "If you do need to edit a fetched record, keep only the draft in local state.",
    ],
    ex: "A team that loads users into Redux has to write refresh logic after every edit, which a query cache with invalidation does automatically.",
    mistakes: [
      "Fetching in useEffect and dispatching into a slice for every endpoint.",
      "Never invalidating copied data.",
    ],
    follow: ["What would you keep in the global store?"],
    points: [
      "Two sources of truth drift",
      "You lose caching and invalidation",
      "Use a server-state tool",
      "Store only real client state",
    ],
    notes: ["Fetched data belongs in a query cache."],
    src: [
      [
        "TanStack Query: Does this replace client state?",
        "https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state",
      ],
      ["Redux Toolkit: RTK Query overview", `${RTK}/rtk-query/overview`],
    ],
  }),
  q({
    slug: "derived-state-not-stored",
    topic: "Server vs client state",
    d: "medium",
    title:
      "Why should you calculate derived values instead of storing them in state?",
    kw: [
      "derived state",
      "redundant state",
      "state structure",
      "single source of truth",
      "sync bugs",
    ],
    intent: "Checks you apply React's guidance for minimal state.",
    short:
      "If a value can be calculated from existing state or props, such as a full name from first and last names, or a filtered list from the list and a filter, calculate it during rendering instead of storing it in another state variable. Redundant state has to be kept in sync, and forgetting to update it in one place causes bugs where the screen shows contradictory data. Store the minimal source of truth and derive everything else.",
    detail: [
      "React's guidance on structuring state is to avoid redundant, duplicated and contradictory state.",
      "An expensive derivation can be memoised with `useMemo`.",
      "Copying props into state means later prop changes are ignored.",
    ],
    ex: "A todo app stores the list and the filter, and computes the visible todos while rendering instead of keeping a second `visibleTodos` state.",
    code: [
      [
        "Derive while rendering",
        "tsx",
        `const [todos, setTodos] = useState<Todo[]>([])\nconst [filter, setFilter] = useState<"all" | "done">("all")\nconst visible = filter === "all" ? todos : todos.filter((t) => t.done)`,
        [
          "Only the list and filter are state.",
          "`visible` is recalculated on each render.",
        ],
      ],
    ],
    mistakes: [
      "Storing the filtered list in state.",
      "Copying props into state and never updating it.",
    ],
    follow: ["When is useMemo appropriate here?"],
    points: [
      "Store the minimum",
      "Derive the rest",
      "Avoid redundant and duplicate state",
      "Do not mirror props",
    ],
    notes: ["If you can compute it, do not store it."],
    src: [
      [
        "React: Choosing the state structure",
        `${RD}/learn/choosing-the-state-structure`,
      ],
    ],
  }),
  q({
    slug: "url-as-state",
    topic: "Server vs client state",
    d: "medium",
    title: "What kinds of state belong in the URL?",
    kw: [
      "url state",
      "query string",
      "shareable",
      "bookmarkable",
      "search params",
    ],
    intent: "Checks you consider the URL as a place for state.",
    short:
      "State that should survive a reload, be shareable as a link or work with the Back button belongs in the URL: the selected resource id in the path, and filters, sorting, search text and page number in the query string. Reading it with a router hook such as `useSearchParams` makes the URL the single source of truth, so you do not duplicate it in a store. Do not put private or large data in a URL.",
    detail: [
      "Users can open the same view from a link or a bookmark.",
      "URL values are strings and can be edited by anyone, so validate them.",
      "Transient UI state such as an open tooltip does not belong in the URL.",
    ],
    ex: "A product list with `?category=shoes&sort=price&page=3` opens exactly the same view when shared.",
    mistakes: [
      "Keeping filters in a store so links cannot reproduce the view.",
      "Putting sensitive data in the URL.",
    ],
    follow: ["Which hook reads query parameters?"],
    points: [
      "Shareable, bookmarkable state",
      "Path for ids, query for filters",
      "URL as the single source",
      "Validate and avoid secrets",
    ],
    notes: ["If a link should reproduce it, use the URL."],
    src: [
      [
        "React Router: useSearchParams",
        "https://reactrouter.com/api/hooks/useSearchParams",
      ],
    ],
  }),
  q({
    slug: "start-with-local-state",
    topic: "Choosing where state lives",
    d: "easy",
    title: "How do you decide where a piece of state should live?",
    kw: [
      "local state",
      "lifting state up",
      "state placement",
      "useState",
      "global state",
    ],
    intent: "Checks you start small and move state only when needed.",
    short:
      "Start with local state in the component that uses it. If two components need the same state, lift it to their closest common parent and pass it down. Only when many distant components need it, and passing props becomes awkward, move it to context or a global store. Keeping state as close as possible to where it is used limits re-renders and keeps components easy to understand.",
    detail: [
      "A good question is who reads it and who changes it.",
      "Form input, open and closed flags and hover states are almost always local.",
      "State lifted too high re-renders more of the tree than needed.",
    ],
    ex: "The search text of one search box stays local, while the signed-in user needed in many places goes in a shared store or context.",
    mistakes: [
      "Making everything global from the start.",
      "Lifting state higher than the common parent.",
    ],
    follow: ["When does lifting state stop being enough?"],
    points: [
      "Local first",
      "Lift to the closest common parent",
      "Global only when widely shared",
      "Closer to use is simpler",
    ],
    notes: ["Local, then lift, then global."],
    src: [
      [
        "React: Sharing state between components",
        `${RD}/learn/sharing-state-between-components`,
      ],
      ["React: Managing state", `${RD}/learn/managing-state`],
    ],
  }),
  q({
    slug: "context-vs-store",
    topic: "Choosing where state lives",
    d: "medium",
    title: "When should you use React Context and when a state library?",
    kw: ["context", "useContext", "prop drilling", "re-render", "global store"],
    intent:
      "Checks you know what Context is good at and its rendering trade-off.",
    short:
      "Context passes a value deep into the tree without prop drilling, so it suits values that rarely change and are needed in many places, such as the theme, the language or the current user. When a context value changes, every component that reads it re-renders, so frequently changing state can cause wasteful renders. A store library with selectors such as Redux or Zustand lets components subscribe to just the part they use, which suits larger, frequently updated shared state.",
    detail: [
      "Context is a way to share a value; you still keep the value in `useState` or `useReducer`.",
      "Splitting contexts by concern reduces needless re-renders.",
      "Many apps use context for simple global values and a store for the complex ones.",
    ],
    ex: "A theme provider uses context, while a shopping cart that updates often and is read in many components uses a store.",
    mistakes: [
      "Putting rapidly changing state in one big context.",
      "Thinking Context is a state manager by itself.",
    ],
    follow: ["How does Zustand avoid the context re-render problem?"],
    points: [
      "Context avoids prop drilling",
      "All consumers re-render on change",
      "Good for rarely changing values",
      "Stores add selector subscriptions",
    ],
    notes: ["Context shares, stores subscribe."],
    src: [
      [
        "React: Passing data deeply with Context",
        `${RD}/learn/passing-data-deeply-with-context`,
      ],
      ["React: useContext", `${RD}/reference/react/useContext`],
    ],
  }),
  q({
    slug: "usereducer-for-complex-local-state",
    topic: "Choosing where state lives",
    d: "medium",
    title: "When is useReducer a better fit than useState?",
    kw: ["useReducer", "reducer", "complex state", "actions", "dispatch"],
    intent: "Checks you can pick a reducer when state logic grows.",
    short:
      "`useReducer` moves the state update logic into a reducer function that receives the current state and an action, and returns the next state. It fits when state has several related fields, when many different events update it, or when the next state depends on the previous one in non-trivial ways. It keeps the logic in one testable place outside the component. For a simple independent value, `useState` is simpler.",
    detail: [
      'Components send actions like `{ type: "added", task }` instead of calling many setters.',
      "The reducer must be pure, the same rule as in Redux.",
      "Combined with context, it forms a small built-in store.",
    ],
    ex: "A task list with add, edit, toggle and delete uses one reducer instead of four separate handlers changing the array.",
    code: [
      [
        "A small reducer",
        "tsx",
        `function reducer(state: Task[], action: Action): Task[] {\n  switch (action.type) {\n    case "added": return [...state, action.task]\n    case "deleted": return state.filter((t) => t.id !== action.id)\n    default: return state\n  }\n}\n\nconst [tasks, dispatch] = useReducer(reducer, [])`,
        [
          "The reducer holds all update rules.",
          "Components only dispatch actions.",
        ],
      ],
    ],
    mistakes: [
      "Mutating the state array in the reducer.",
      "Using a reducer for a single boolean.",
    ],
    follow: ["How is it related to Redux?"],
    points: [
      "Reducer holds update logic",
      "Good for related, complex state",
      "Must be pure",
      "useState for simple values",
    ],
    notes: ["Many events, one reducer."],
    src: [
      [
        "React: Extracting state logic into a reducer",
        `${RD}/learn/extracting-state-logic-into-a-reducer`,
      ],
      ["React: useReducer", `${RD}/reference/react/useReducer`],
    ],
  }),
  q({
    slug: "redux-vs-zustand-vs-context",
    topic: "Choosing where state lives",
    d: "medium",
    title: "How would you choose between Context, Redux Toolkit and Zustand?",
    kw: ["redux", "zustand", "context", "trade-offs", "choosing"],
    intent:
      "Checks you give a reasoned recommendation instead of naming a favourite.",
    short:
      "Choose by need. Use local state and props first. Use Context for a few values that change rarely, like theme or current user. Pick Redux Toolkit when the app is large, many people work on it, and you value strict structure, DevTools time-travel, middleware and a built-in data layer in RTK Query. Pick Zustand when you want a small, low-boilerplate store with selectors and no provider. Whatever you pick, keep server data in a query library and not in the store.",
    detail: [
      "All three can work; the right one depends on team size, complexity and familiarity.",
      "Redux imposes more structure, which helps large teams stay consistent.",
      "Zustand has a smaller API surface, so small and medium apps get going quickly.",
    ],
    ex: "A small dashboard uses TanStack Query for data, Zustand for a handful of UI preferences and local state for everything else.",
    mistakes: [
      "Choosing a library by habit without a requirement.",
      "Using a global store for server data.",
    ],
    follow: ["What requirement would make you pick Redux?"],
    points: [
      "Local first",
      "Context for rare changes",
      "Redux for large structured apps",
      "Zustand for small, simple stores",
    ],
    notes: ["Pick the smallest tool that fits."],
    src: [
      [
        "Redux: Why Redux Toolkit is how you should use Redux",
        `${RX}/introduction/why-rtk-is-redux-today`,
      ],
      ["Zustand: Introduction", `${Z}/learn/getting-started/introduction`],
      [
        "React: Scaling up with reducer and context",
        `${RD}/learn/scaling-up-with-reducer-and-context`,
      ],
    ],
  }),
  q({
    slug: "avoid-prop-drilling",
    topic: "Choosing where state lives",
    d: "easy",
    title: "What is prop drilling and how can you avoid it?",
    kw: ["prop drilling", "props", "context", "composition", "children"],
    intent:
      "Checks you know alternatives to passing props through many layers.",
    short:
      "Prop drilling is passing props through several layers of components that do not use them, just to reach a deeply nested child. It makes code harder to change. First try to restructure: extract components and pass JSX as `children`, so the intermediate layers do not need the data. If many components at different depths still need the value, use Context or a state store.",
    detail: [
      "A little drilling through two or three levels is often fine and easy to follow.",
      "Composition keeps data flow explicit, unlike hidden dependencies from context.",
      "Overusing global state to avoid drilling makes components harder to reuse.",
    ],
    ex: "A layout component receives `<UserMenu user={user} />` as a child from the page, instead of taking a `user` prop only to pass it on.",
    mistakes: [
      "Reaching for global state for a two-level prop.",
      "Passing many unrelated props through every layer.",
    ],
    follow: ["How does composition with children help?"],
    points: [
      "Props passed through unused layers",
      "Try composition first",
      "Context for widely needed values",
      "A little drilling is fine",
    ],
    notes: ["Composition before context."],
    src: [
      [
        "React: Passing data deeply with Context",
        `${RD}/learn/passing-data-deeply-with-context`,
      ],
    ],
  }),
  q({
    slug: "state-structure-principles",
    topic: "Choosing where state lives",
    d: "medium",
    title: "What principles help you structure state well?",
    kw: [
      "state structure",
      "group related state",
      "contradiction",
      "duplication",
      "nested state",
    ],
    intent: "Checks you can design state that avoids bugs.",
    short:
      "React's guidance is to group related state that changes together, avoid contradictions such as separate `isSending` and `isSent` flags that can both be true, avoid redundant state that can be calculated, avoid duplication where the same data sits in two places, and avoid deeply nested state, which is hard to update. Often a single `status` value such as `typing`, `sending` or `sent` replaces several booleans. Flat state keeps updates simple.",
    detail: [
      "Storing an id instead of a copy of the selected object avoids stale duplicates.",
      "Normalised data, where items are stored by id, simplifies updates to deep structures.",
      "Following these rules reduces the number of impossible states.",
    ],
    ex: "A form uses one `status` state with values `idle`, `submitting` and `done`, so it can never show 'submitting' and 'done' at once.",
    mistakes: [
      "Several booleans that can contradict each other.",
      "Copying the selected item instead of storing its id.",
    ],
    follow: ["Why store the selected id and not the object?"],
    points: [
      "Group related state",
      "Avoid contradictions and duplication",
      "Derive redundant values",
      "Prefer flat state",
    ],
    notes: ["One status beats many booleans."],
    src: [
      [
        "React: Choosing the state structure",
        `${RD}/learn/choosing-the-state-structure`,
      ],
      [
        "React: Reacting to input with state",
        `${RD}/learn/reacting-to-input-with-state`,
      ],
    ],
  }),
])
