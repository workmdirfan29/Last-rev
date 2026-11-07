import { defineQuestions } from "../author"
import { q } from "../compact"

const M = "https://developer.mozilla.org/en-US/docs/Web/HTTP"
const H = `${M}/Reference/Headers`
const RD = "https://redis.io/docs/latest"
const MS = "https://learn.microsoft.com/en-us/azure/architecture"
const AWS =
  "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"
const EX = "https://expressjs.com/en"

export default defineQuestions("caching", "fresher", [
  q({
    slug: "why-caching-matters",
    topic: "HTTP caching",
    d: "easy",
    title: "What is caching and what problems does it solve?",
    kw: ["caching", "latency", "load reduction", "cache hit", "cache miss"],
    intent:
      "A foundation question: checks you can explain the purpose and the cost of caching.",
    short:
      "Caching stores a copy of data or a computed result in a faster place so that repeated requests do not redo the slow work. It lowers latency for users, reduces load on databases and servers, and can cut bandwidth and cost. A cache hit means the data was found and reused; a miss means it had to be fetched or computed and then usually stored. The price is staleness and complexity, because the cached copy can differ from the source of truth.",
    detail: [
      "Caches exist at many layers: the browser, a CDN, the application, and the database.",
      "Caching works best for data that is read often and changes rarely.",
      "A good cache design decides what to cache, for how long, and how to refresh it.",
    ],
    ex: "A product catalogue read thousands of times an hour is cached for a few minutes, so the database is queried once instead of for every visitor.",
    mistakes: [
      "Caching data that changes constantly.",
      "Forgetting that cached data can be out of date.",
    ],
    follow: ["What is the difference between a hit and a miss?"],
    points: [
      "Reuse stored results",
      "Lower latency and load",
      "Hit vs miss",
      "Cost: stale data and complexity",
    ],
    notes: ["Fast copy, possible staleness."],
    src: [
      ["MDN: HTTP caching", `${M}/Guides/Caching`],
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "cache-control-basics",
    topic: "HTTP caching",
    d: "easy",
    title: "What does the Cache-Control header do?",
    kw: ["cache-control", "max-age", "public", "private", "freshness"],
    intent: "Checks you know the main header that controls HTTP caching.",
    short:
      "`Cache-Control` is the response header that tells browsers and shared caches such as CDNs how to cache a response. `max-age=N` says the response is fresh for N seconds, during which it is reused without asking the server. `public` allows any cache to store it, while `private` limits it to the user's own browser, which is needed for personalised responses. Without explicit headers, caches may apply heuristics, so set the policy deliberately.",
    detail: [
      "`s-maxage` sets the lifetime for shared caches only.",
      "Once a response is stale, a cache normally revalidates it with the server.",
      "Request headers can also carry `Cache-Control`, for example to force a reload.",
    ],
    ex: "A public image is sent with `Cache-Control: public, max-age=86400` so it is reused for a day.",
    code: [
      [
        "Setting the header in Express",
        "js",
        `app.get("/api/countries", (req, res) => {\n  res.set("Cache-Control", "public, max-age=3600")\n  res.json(countries)\n})`,
        [
          "`max-age=3600` makes the response fresh for an hour.",
          "`public` lets a CDN store it as well.",
        ],
      ],
    ],
    mistakes: [
      "Caching personalised responses as public.",
      "Relying on heuristic caching.",
    ],
    follow: ["When would you use private?"],
    points: [
      "Controls caching behaviour",
      "max-age = freshness in seconds",
      "public vs private",
      "Set it explicitly",
    ],
    notes: ["max-age for freshness, private for user data."],
    src: [
      ["MDN: Cache-Control", `${H}/Cache-Control`],
      ["MDN: HTTP caching", `${M}/Guides/Caching`],
    ],
  }),
  q({
    slug: "no-cache-vs-no-store",
    topic: "HTTP caching",
    d: "medium",
    title: "What is the difference between no-cache and no-store?",
    kw: [
      "no-cache",
      "no-store",
      "revalidation",
      "sensitive data",
      "cache-control",
    ],
    intent: "Checks you avoid the classic misreading of no-cache.",
    short:
      "`no-cache` does not mean 'do not cache'. It allows a cache to store the response, but requires it to revalidate with the origin server before reusing it, typically with a conditional request that may return `304 Not Modified`. `no-store` tells caches not to store the response at all, which is what you want for sensitive data such as account pages or personal information. `no-cache` is a good fit for content that must always be current but is expensive to resend.",
    detail: [
      "`must-revalidate` is related: once stale, the response must not be used without successful revalidation.",
      "Use `no-store` for pages with private information, and `private` where only the user's cache should hold it.",
      "Revalidation saves bandwidth because only headers travel when nothing changed.",
    ],
    ex: "An HTML shell uses `no-cache` so browsers always check for a new version, while a bank statement page uses `no-store`.",
    mistakes: [
      "Using no-cache when no-store is needed for sensitive data.",
      "Assuming no-cache disables the cache.",
    ],
    follow: ["What does a 304 response save?"],
    points: [
      "no-cache: store but revalidate",
      "no-store: do not store",
      "no-store for sensitive pages",
      "Revalidation can return 304",
    ],
    notes: ["no-cache = ask first, no-store = never keep."],
    src: [["MDN: Cache-Control", `${H}/Cache-Control`]],
  }),
  q({
    slug: "etag-conditional-requests",
    topic: "HTTP caching",
    d: "medium",
    title: "How do ETag and conditional requests work?",
    kw: [
      "etag",
      "if-none-match",
      "304 not modified",
      "conditional request",
      "revalidation",
    ],
    intent: "Checks you understand validation caching end to end.",
    short:
      "An `ETag` is an identifier for a specific version of a resource, such as a hash of its content. When a cached copy becomes stale, the client repeats the request with `If-None-Match` set to the stored ETag. If the resource is unchanged, the server replies `304 Not Modified` with no body, and the client reuses its copy; if it changed, the server sends a full `200` with the new content and ETag. This saves bandwidth, though a round trip still happens.",
    detail: [
      "`Last-Modified` with `If-Modified-Since` works the same way using timestamps.",
      "Express generates ETags for responses by default.",
      "Validation is cheaper than a full download but slower than a fresh cache hit.",
    ],
    ex: "A browser revalidates a 500 KB JSON file; the server answers 304 and nothing is downloaded.",
    code: [
      [
        "Conditional exchange",
        "http",
        `GET /data.json\nIf-None-Match: "v42"\n\nHTTP/1.1 304 Not Modified\nETag: "v42"`,
        [
          "The client sends its stored ETag.",
          "The server confirms nothing changed with 304.",
        ],
      ],
    ],
    mistakes: [
      "Expecting 304 to avoid the round trip.",
      "ETags that change on every response, defeating validation.",
    ],
    follow: ["How does Last-Modified differ from ETag?"],
    points: [
      "ETag identifies a version",
      "If-None-Match sends it back",
      "304 means reuse your copy",
      "Saves bandwidth, not the round trip",
    ],
    notes: ["304 = nothing new."],
    src: [
      ["MDN: ETag", `${H}/ETag`],
      ["MDN: HTTP conditional requests", `${M}/Guides/Conditional_requests`],
      ["MDN: 304 Not Modified", `${M}/Reference/Status/304`],
    ],
  }),
  q({
    slug: "vary-header-and-cache-keys",
    topic: "HTTP caching",
    d: "hard",
    title: "What does the Vary header do in HTTP caching?",
    kw: [
      "vary",
      "cache key",
      "accept-encoding",
      "content negotiation",
      "shared cache",
    ],
    intent:
      "Checks you understand why one URL can have several cached versions.",
    short:
      "A cache normally identifies a response by its URL and method. When the server's response depends on a request header, for example `Accept-Encoding` for gzip versus Brotli, or `Accept-Language`, it adds `Vary` naming that header. Caches then also include the value of that header in the cache key, so they do not serve a compressed response to a client that cannot read it. `Vary: Origin` is used when CORS responses differ by origin. Varying on too many headers splits the cache and lowers the hit rate.",
    detail: [
      "`Vary: *` effectively makes the response uncacheable.",
      "A missing Vary header can cause one user's version to be served to another.",
      "CDNs honour Vary and may normalise some headers.",
    ],
    ex: "An API sets `Vary: Accept-Encoding, Origin` so CDN copies are kept per encoding and per allowed origin.",
    mistakes: [
      "Forgetting Vary on CORS or compressed responses.",
      "Varying on a header with endless values such as User-Agent.",
    ],
    follow: ["Why can Vary: User-Agent be bad?"],
    points: [
      "Adds request headers to the cache key",
      "Needed for encoding, language and origin",
      "Missing Vary can serve the wrong variant",
      "Too many variants cut the hit rate",
    ],
    notes: ["Vary lists what the response depends on."],
    src: [
      ["MDN: Vary", `${H}/Vary`],
      ["MDN: HTTP caching", `${M}/Guides/Caching`],
    ],
  }),
  q({
    slug: "static-assets-fingerprinting",
    topic: "HTTP caching",
    d: "medium",
    title:
      "How do you cache static assets for a long time and still deploy updates?",
    kw: [
      "cache busting",
      "fingerprinted filenames",
      "immutable",
      "max-age one year",
      "content hash",
    ],
    intent: "Checks you know the standard strategy for versioned assets.",
    short:
      "Put a hash of the content in the file name, such as `app.3f9a1c.js`, and serve it with a very long `max-age` and the `immutable` directive, because the file at that URL will never change. When you deploy a new version, the build produces new file names, and the HTML that references them is served with a short lifetime or `no-cache`, so users pick up the new URLs immediately. Browsers keep reusing unchanged files from their cache without any request.",
    detail: [
      "Build tools such as Vite and webpack produce hashed file names automatically.",
      "Do not use long max-age on files with a fixed name like `main.js`.",
      "A CDN in front of the origin applies the same headers.",
    ],
    ex: "The HTML is `no-cache`, while `/assets/app.3f9a1c.js` is cached for a year.",
    code: [
      [
        "Long-lived static files in Express",
        "js",
        `app.use(\n  "/assets",\n  express.static("dist/assets", { maxAge: "1y", immutable: true })\n)`,
        [
          "Hashed assets are cached for a year.",
          "`immutable` tells browsers not to revalidate.",
        ],
      ],
    ],
    mistakes: [
      "Long caching on non-hashed file names.",
      "Caching the HTML for a long time, so users never see updates.",
    ],
    follow: ["Why is the HTML cached differently?"],
    points: [
      "Hash in the file name",
      "Long max-age plus immutable",
      "HTML short-lived or no-cache",
      "New deploy means new URLs",
    ],
    notes: ["Hash it, cache it forever."],
    src: [
      ["MDN: HTTP caching (cache busting)", `${M}/Guides/Caching`],
      ["Express: express.static", `${EX}/api.html`],
    ],
  }),
  q({
    slug: "private-vs-shared-caches",
    topic: "HTTP caching",
    d: "medium",
    title: "What is the difference between a private cache and a shared cache?",
    kw: [
      "private cache",
      "shared cache",
      "cdn",
      "s-maxage",
      "personalised content",
    ],
    intent: "Checks you understand who may store a response.",
    short:
      "A private cache belongs to a single user, such as the browser cache, and can store responses meant for that user. A shared cache sits between many users and the origin, such as a CDN or proxy, and stores responses to serve to different people. Because a shared cache can hand one stored response to many users, personalised or sensitive responses must be marked `Cache-Control: private` or `no-store` so they never reach it. `s-maxage` lets you give shared caches a different lifetime from browsers.",
    detail: [
      "Responses to requests with an `Authorization` header are not stored by shared caches unless explicitly allowed.",
      "The `Age` header shows how long a response has been in a cache.",
      "A CDN is a distributed shared cache that places copies near users.",
    ],
    ex: "Public blog pages are cached by the CDN for five minutes, while the account page is `private, no-store`.",
    mistakes: [
      "Letting a CDN cache pages that include user data.",
      "Not separating public and personalised responses.",
    ],
    follow: ["What does s-maxage do?"],
    points: [
      "Private: one user's browser",
      "Shared: CDN and proxies",
      "Personalised responses must be private or no-store",
      "s-maxage for shared caches",
    ],
    notes: ["Shared caches serve many users, so protect private data."],
    src: [
      ["MDN: HTTP caching", `${M}/Guides/Caching`],
      ["MDN: Cache-Control", `${H}/Cache-Control`],
    ],
  }),
  q({
    slug: "stale-while-revalidate",
    topic: "HTTP caching",
    d: "hard",
    title: "What does stale-while-revalidate do?",
    kw: [
      "stale-while-revalidate",
      "stale-if-error",
      "background revalidation",
      "freshness",
      "performance",
    ],
    intent:
      "Checks you know a directive that trades a little freshness for speed.",
    short:
      "`stale-while-revalidate=N` lets a cache keep serving a stale response for up to N seconds after it expires, while it fetches a fresh copy in the background for later requests. Users get an instant response instead of waiting for the origin, and the cache catches up quietly. A related directive, `stale-if-error`, allows serving stale content when the origin fails. They suit content where slightly old data is acceptable, such as article lists or public dashboards.",
    detail: [
      "The first stale hit is fast; the refreshed copy is used from the next request.",
      "It is not suitable for data where staleness is harmful, such as stock levels at checkout.",
      "Support depends on the cache or CDN in use.",
    ],
    ex: "A news list is sent with `max-age=60, stale-while-revalidate=300`, so readers never wait on the origin.",
    code: [
      [
        "Directive example",
        "http",
        `Cache-Control: public, max-age=60, stale-while-revalidate=300`,
        [
          "Fresh for 60 seconds.",
          "For the next 300 seconds a stale copy may be served while it refreshes.",
        ],
      ],
    ],
    mistakes: [
      "Using it for data that must be exact.",
      "Assuming every cache supports it.",
    ],
    follow: ["How does stale-if-error differ?"],
    points: [
      "Serve stale, refresh in the background",
      "Fast responses",
      "stale-if-error covers origin failures",
      "Only for tolerant content",
    ],
    notes: ["Stale now, fresh next."],
    src: [["MDN: Cache-Control", `${H}/Cache-Control`]],
  }),
  q({
    slug: "in-process-memory-cache",
    topic: "In-memory caching",
    d: "easy",
    title: "What is an in-process (in-memory) cache and what are its limits?",
    kw: ["in-memory cache", "map", "lru", "single instance", "process memory"],
    intent: "Checks you know the simplest cache and where it breaks.",
    short:
      "An in-process cache keeps data in the application's own memory, for example in a `Map` or an LRU cache library, so lookups are extremely fast and need no network. Its limits are that it disappears when the process restarts, each instance of a scaled-out app has its own separate copy, so they can disagree, and it uses the application's memory, so it needs a size limit and expiry to avoid growing without bound. It suits small, read-heavy data in a single instance.",
    detail: [
      "An LRU policy evicts the least recently used entries when the cache is full.",
      "Without a maximum size, a cache can behave like a memory leak.",
      "For shared data across instances, use an external cache such as Redis.",
    ],
    ex: "A single-server tool caches its configuration lookups in a Map with a five-minute expiry.",
    code: [
      [
        "A tiny TTL cache",
        "js",
        `const cache = new Map()\n\nfunction getCached(key, ttlMs, load) {\n  const hit = cache.get(key)\n  if (hit && hit.expires > Date.now()) return hit.value\n  const value = load()\n  cache.set(key, { value, expires: Date.now() + ttlMs })\n  return value\n}`,
        [
          "Each entry stores its value and expiry time.",
          "A hit returns without loading.",
          "A miss loads and stores the value.",
        ],
      ],
    ],
    mistakes: [
      "Unbounded caches that grow forever.",
      "Assuming all instances share the same cache.",
    ],
    follow: ["Why does scaling out break an in-process cache?"],
    points: [
      "Fast, no network",
      "Lost on restart",
      "Per-instance copies",
      "Needs size and TTL limits",
    ],
    notes: ["Fast, local, not shared."],
    src: [
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "redis-as-shared-cache",
    topic: "In-memory caching",
    d: "easy",
    title: "Why use Redis as a cache?",
    kw: [
      "redis",
      "shared cache",
      "key-value store",
      "in-memory",
      "distributed",
    ],
    intent: "Checks you know what an external in-memory cache provides.",
    short:
      "Redis is an in-memory data store that works as a fast key-value cache shared by all your application instances over the network. Because every instance reads and writes the same cache, they see consistent data, and the cache survives application restarts and deployments. It supports expiry on keys, several data types such as strings, hashes and sorted sets, and eviction policies for when memory is full. Reads take well under a millisecond on a good network, far faster than most database queries.",
    detail: [
      "It adds a network hop and an extra component to run and monitor.",
      "The app should still work, though slower, if the cache is down.",
      "Redis can also be persisted, but as a cache it is treated as disposable.",
    ],
    ex: "Three API servers behind a load balancer share one Redis cache of product data.",
    mistakes: [
      "Treating the cache as the only copy of the data.",
      "No fallback when Redis is unavailable.",
    ],
    follow: ["What happens to your app if Redis goes down?"],
    points: [
      "Shared by all instances",
      "In-memory speed",
      "Key expiry and eviction",
      "Cache is disposable",
    ],
    notes: ["One cache for every instance."],
    src: [
      ["Redis: Data types", `${RD}/develop/data-types/`],
      ["Redis: Key eviction", `${RD}/develop/reference/eviction/`],
    ],
  }),
  q({
    slug: "redis-ttl-and-expire",
    topic: "In-memory caching",
    d: "easy",
    title: "How do you set an expiry on a Redis key?",
    kw: ["ttl", "expire", "set ex", "key expiration", "volatile keys"],
    intent: "Checks you can make cached entries expire.",
    short:
      "Set a time to live (TTL) so cached data expires on its own. `SET key value EX 60` stores a value that expires after 60 seconds, `EXPIRE key seconds` adds a timeout to an existing key, and `TTL key` shows the seconds remaining. When the timeout passes the key is automatically deleted. Writing over the key with a plain `SET` clears the timeout, so set the expiry again when you update a cached value.",
    detail: [
      "A key with a timeout is called volatile in Redis terminology.",
      "Choose a TTL based on how stale the data may be.",
      "Adding a little random variation to TTLs avoids many keys expiring at the same instant.",
    ],
    ex: "A user profile is cached with a 10-minute TTL so changes show up within that time even if invalidation is missed.",
    code: [
      [
        "Caching with a TTL",
        "js",
        `await redis.set(\`user:\${id}\`, JSON.stringify(user), "EX", 600)\nconst cached = await redis.get(\`user:\${id}\`)\nconst user2 = cached ? JSON.parse(cached) : null`,
        [
          "`EX 600` expires the key after 10 minutes.",
          "`get` returns null on a miss.",
          "Values are strings, so JSON is used.",
        ],
      ],
    ],
    mistakes: [
      "Caching without any expiry.",
      "Overwriting a key and losing its TTL by accident.",
    ],
    follow: ["How do you check the remaining TTL?"],
    points: [
      "SET with EX",
      "EXPIRE and TTL commands",
      "Plain SET clears the timeout",
      "Pick TTL by staleness tolerance",
    ],
    notes: ["Every cache entry needs a TTL."],
    src: [
      ["Redis: EXPIRE", `${RD}/commands/expire/`],
      ["Redis: SET", `${RD}/commands/set/`],
    ],
  }),
  q({
    slug: "redis-eviction-policies",
    topic: "In-memory caching",
    d: "medium",
    title: "What happens when a Redis cache runs out of memory?",
    kw: [
      "maxmemory",
      "eviction policy",
      "allkeys-lru",
      "volatile-lru",
      "noeviction",
    ],
    intent: "Checks you know how a bounded cache decides what to drop.",
    short:
      "You set a memory limit with `maxmemory`; when the data exceeds it, Redis applies the configured eviction policy before accepting new data. Policies include `allkeys-lru` (evict the least recently used keys among all keys), `allkeys-lfu` (least frequently used), `volatile-lru` (only among keys that have a TTL), random variants, and `noeviction`, which rejects writes that need more memory. For a pure cache, `allkeys-lru` is a common choice, while Redis used as a primary store should not evict.",
    detail: [
      "Evicting is safe for a cache because the data can be reloaded from the source.",
      "With `volatile-*` policies, keys without a TTL are never evicted.",
      "Monitor the hit ratio and eviction count to size the cache properly.",
    ],
    ex: "A product cache with `maxmemory 512mb` and `allkeys-lru` always keeps the most recently used items.",
    mistakes: [
      "No memory limit, so Redis grows until the server runs out of memory.",
      "Using volatile policies with keys that have no TTL.",
    ],
    follow: ["When is noeviction the right choice?"],
    points: [
      "maxmemory sets the limit",
      "Eviction policy picks victims",
      "allkeys-lru common for caches",
      "Monitor hit ratio and evictions",
    ],
    notes: ["Limit memory and choose a policy."],
    src: [["Redis: Key eviction", `${RD}/develop/reference/eviction/`]],
  }),
  q({
    slug: "cache-key-design",
    topic: "In-memory caching",
    d: "medium",
    title: "How should you design cache keys?",
    kw: [
      "cache key",
      "namespacing",
      "key naming",
      "parameters in key",
      "multi-tenant",
    ],
    intent: "Checks you can avoid collisions and wrong-data bugs.",
    short:
      "A cache key must uniquely identify the data. Use a readable, consistent pattern with a namespace and all the inputs that affect the result, such as `product:42`, or `orders:user:7:page:2:status:open`. Missing a parameter causes one request to get another's cached result, and including a user or tenant id is essential for personalised data. Keep keys reasonably short, avoid unbounded user-supplied strings, and include a version prefix such as `v2:` so you can invalidate a whole class of entries by changing it.",
    detail: [
      "The same rule applies to HTTP caching: the URL and `Vary` headers form the key.",
      "Normalise parameters, such as sorting query keys, so equal requests share one entry.",
      "Avoid scanning for keys by pattern in production; design for direct lookups.",
    ],
    ex: "A search cache includes the query, filters and page in its key so different searches never mix.",
    mistakes: [
      "Omitting the user id from keys for user-specific data.",
      "Keys that differ only by parameter order.",
    ],
    follow: ["Why include a version prefix?"],
    points: [
      "Unique and predictable",
      "Include every input that changes the result",
      "Namespace and version",
      "Include user or tenant where relevant",
    ],
    notes: ["If it changes the result, it belongs in the key."],
    src: [
      ["Redis: Keyspace", `${RD}/develop/use/keyspace/`],
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "avoid-keys-command",
    topic: "In-memory caching",
    d: "hard",
    title: "Why should you avoid the KEYS command in production Redis?",
    kw: [
      "keys command",
      "scan",
      "blocking",
      "pattern matching",
      "redis performance",
    ],
    intent: "Checks you know a common operational mistake with Redis.",
    short:
      "`KEYS pattern` scans the whole keyspace in one go. Redis executes commands on a single main thread, so on a large database `KEYS` blocks all other clients while it runs and can seriously hurt performance. The Redis documentation says not to use it in regular application code and intends it for debugging and special operations. Use `SCAN`, which iterates incrementally in small batches, or, better, design keys and data structures so you can look things up directly without scanning.",
    detail: [
      "`SCAN` may return a key more than once and does not give a point-in-time snapshot.",
      "Keep a set of related keys, or version prefixes, to invalidate groups without scanning.",
      "Delete large sets of keys in batches to avoid blocking.",
    ],
    ex: "Clearing a user's cached pages is done by deleting a tracked list of keys instead of running `KEYS user:7:*`.",
    mistakes: [
      "Calling KEYS in a request handler.",
      "Deleting thousands of keys in a single blocking call.",
    ],
    follow: ["How does SCAN differ from KEYS?"],
    points: [
      "KEYS blocks the server",
      "Not for application code",
      "SCAN iterates in batches",
      "Design for direct lookups",
    ],
    notes: ["SCAN, not KEYS."],
    src: [
      ["Redis: KEYS", `${RD}/commands/keys/`],
      ["Redis: SCAN", `${RD}/commands/scan/`],
    ],
  }),
  q({
    slug: "memoization-vs-caching",
    topic: "In-memory caching",
    d: "medium",
    title: "What is memoization and how does it relate to caching?",
    kw: [
      "memoization",
      "pure function",
      "function cache",
      "cache key",
      "side effects",
    ],
    intent: "Checks you know when function-level caching is safe.",
    short:
      "Memoization is caching the result of a function call, keyed by its arguments, so calling the function again with the same arguments returns the stored result instead of recomputing. It is only safe for pure functions, whose result depends only on their inputs and which have no side effects. For functions that read changing data or time, a memoized result becomes wrong unless it has an expiry. It is a local, in-process form of caching and shares its limits: memory growth and no sharing between instances.",
    detail: [
      "Arguments must be turned into a stable key, which is awkward for objects.",
      "Add a maximum size or a TTL for long-running processes.",
      "React's `useMemo` is a related idea at the render level.",
    ],
    ex: "An expensive tax calculation is memoized by amount and region.",
    code: [
      [
        "A memoize helper",
        "js",
        `function memoize(fn) {\n  const cache = new Map()\n  return (arg) => {\n    if (!cache.has(arg)) cache.set(arg, fn(arg))\n    return cache.get(arg)\n  }\n}\n\nconst square = memoize((n) => n * n)`,
        [
          "The map stores results by argument.",
          "Repeated calls with the same argument skip the work.",
        ],
      ],
    ],
    mistakes: [
      "Memoizing functions with side effects.",
      "No limit on stored results.",
    ],
    follow: ["Which functions are safe to memoize?"],
    points: [
      "Cache results by arguments",
      "Safe for pure functions",
      "Needs size or expiry limits",
      "Local to the process",
    ],
    notes: ["Same input, same output, so reuse it."],
    src: [
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "ttl-vs-explicit-invalidation",
    topic: "Cache invalidation",
    d: "medium",
    title:
      "What are the ways to keep a cache fresh: TTL versus explicit invalidation?",
    kw: [
      "cache invalidation",
      "ttl",
      "explicit invalidation",
      "stale data",
      "eventual consistency",
    ],
    intent:
      "Checks you can reason about freshness strategies and their guarantees.",
    short:
      "With a TTL, entries expire after a fixed time. It is simple and bounds how stale data can be, but updates become visible only after the TTL. With explicit invalidation, the application deletes or updates the cached entry whenever the source data changes, so readers see changes immediately, but it needs every write path to remember to invalidate, and missing one leaves stale data. Many systems combine both: invalidate on write, and keep a TTL as a safety net so mistakes heal themselves.",
    detail: [
      "Choose the TTL from how stale the business allows the data to be.",
      "Short TTLs reduce staleness but also reduce the hit rate.",
      "Data that is rarely read after it is written, or that changes constantly, may not be worth caching.",
    ],
    ex: "Product details are deleted from the cache on update, with a one-hour TTL as a backstop.",
    mistakes: [
      "Relying only on invalidation with no TTL.",
      "A very long TTL for data that users edit.",
    ],
    follow: ["Why keep a TTL even when you invalidate?"],
    points: [
      "TTL bounds staleness",
      "Invalidation gives immediacy",
      "Combine both",
      "Match to business tolerance",
    ],
    notes: ["Invalidate on write, expire as a safety net."],
    src: [
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
      ["Microsoft Learn: Cache-Aside pattern", `${MS}/patterns/cache-aside`],
    ],
  }),
  q({
    slug: "invalidate-on-write",
    topic: "Cache invalidation",
    d: "medium",
    title:
      "Why do most designs delete the cache entry on write instead of updating it?",
    kw: [
      "invalidate on write",
      "delete cache",
      "race condition",
      "stale write",
      "cache update",
    ],
    intent: "Checks you understand a subtle consistency trade-off.",
    short:
      "When data changes, the safest simple approach is to update the data store and then delete the cached entry, so the next read loads the fresh value. Updating the cache with the new value on every write is more error-prone: two concurrent writers can store their values in the cache in a different order than in the database, leaving the cache wrong, and you may cache data nobody reads. Deleting is idempotent and cheap, and the cost is one extra miss. The Cache-Aside pattern describes this approach.",
    detail: [
      "Update the database first, then invalidate; the other order lets a reader repopulate the cache with the old value.",
      "Even then, a small window of staleness is possible with concurrent reads.",
      "Add a TTL to limit the damage of rare races.",
    ],
    ex: "After saving a user's profile in SQL, the service deletes `user:42` from Redis.",
    code: [
      [
        "Write then invalidate",
        "js",
        `async function updateUser(id, data) {\n  await db.users.update(id, data)\n  await redis.del(\`user:\${id}\`)\n}`,
        [
          "The database is the source of truth and is updated first.",
          "Deleting the key forces the next read to reload.",
        ],
      ],
    ],
    mistakes: [
      "Invalidating before the database commit.",
      "Updating the cache from several writers.",
    ],
    follow: ["What race can happen when updating the cache directly?"],
    points: [
      "Write to the store, then delete the entry",
      "Delete is idempotent",
      "Avoids out-of-order cache writes",
      "One extra miss is the price",
    ],
    notes: ["Write DB, delete cache."],
    src: [
      ["Microsoft Learn: Cache-Aside pattern", `${MS}/patterns/cache-aside`],
    ],
  }),
  q({
    slug: "versioned-keys-invalidation",
    topic: "Cache invalidation",
    d: "hard",
    title: "How can versioned keys help invalidate many cache entries at once?",
    kw: [
      "versioned keys",
      "namespace version",
      "bulk invalidation",
      "cache busting",
      "key prefix",
    ],
    intent: "Checks you know a way to invalidate groups without scanning.",
    short:
      "Instead of finding and deleting every key in a group, include a version number in the key, such as `products:v7:list`. To invalidate the whole group, increment the version stored in one small key; all new reads use the new version and so miss the old entries, which are never read again and eventually expire or are evicted. This avoids scanning for keys and works with HTTP caching too, where a changed URL means a new cache entry.",
    detail: [
      "Store the current version in a single key and read it when building keys.",
      "Old entries consume memory until their TTL ends, so use TTLs.",
      "It is the same idea as fingerprinted asset file names.",
    ],
    ex: "Bumping `catalog:version` after a bulk import makes every catalogue query reload fresh data.",
    mistakes: [
      "Forgetting TTLs, so old versions pile up.",
      "Scanning for keys to delete instead.",
    ],
    follow: ["How is this like cache busting for assets?"],
    points: [
      "Version in the key",
      "Increment to invalidate the group",
      "Old entries age out",
      "No key scanning needed",
    ],
    notes: ["Change the key, not the data."],
    src: [
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
      ["MDN: HTTP caching", `${M}/Guides/Caching`],
    ],
  }),
  q({
    slug: "mass-expiry-and-load-spikes",
    topic: "Cache invalidation",
    d: "hard",
    title:
      "What happens when many cached entries expire at the same time, and how do you reduce the impact?",
    kw: [
      "cache stampede",
      "thundering herd",
      "ttl jitter",
      "request coalescing",
      "avalanche",
    ],
    intent:
      "Checks you foresee load spikes from synchronised expiry or a hot key expiring.",
    short:
      "When many entries share the same TTL, or one very popular entry expires, a burst of requests all miss together and all hit the database to rebuild the same data, which can overload it. Reduce the risk by adding random variation to TTLs so expiry is spread out, by letting only one request rebuild a hot entry while the others wait or use the slightly stale copy, by refreshing popular entries in the background before they expire, and by limiting database concurrency. Warming the cache after a restart helps too.",
    detail: [
      "A hot key is one accessed very often, so its expiry matters most.",
      "A lock or a request-coalescing layer ensures one loader per key.",
      "Serving slightly stale data during refresh trades freshness for stability.",
    ],
    ex: "Product pages cached with TTL 600 plus 0 to 60 seconds of random jitter no longer expire in the same second after deployment.",
    mistakes: [
      "The same TTL for everything.",
      "Letting every miss query the database independently.",
    ],
    follow: ["How does jitter help?"],
    points: [
      "Simultaneous misses overload the source",
      "Randomise TTLs",
      "One loader per hot key",
      "Refresh early or serve stale briefly",
    ],
    notes: ["Spread expiry, share the rebuild."],
    src: [
      [
        "Microsoft Learn: Caching guidance (expiration and concurrency)",
        `${MS}/best-practices/caching`,
      ],
    ],
  }),
  q({
    slug: "negative-caching-and-not-found",
    topic: "Cache invalidation",
    d: "hard",
    title: "Should you cache 'not found' results?",
    kw: [
      "negative caching",
      "cache penetration",
      "null result",
      "short ttl",
      "404",
    ],
    intent: "Checks you consider requests for things that do not exist.",
    short:
      "If requests keep asking for keys that do not exist, every one is a cache miss that reaches the database, which an attacker or a bug can exploit to bypass the cache. Negative caching stores the 'not found' outcome, for example a special marker or empty value, with a short TTL so repeated lookups for the same missing item are answered from the cache. The short TTL limits harm if the item is created soon after. Pair it with input validation and rate limiting.",
    detail: [
      "Cache the miss differently from a real value, so code can tell them apart.",
      "Invalidate the negative entry when the item is created.",
      "HTTP caches can also store 404 responses for a short time.",
    ],
    ex: "Lookups for a non-existent product id are cached for 30 seconds as 'missing'.",
    mistakes: [
      "Long TTLs on 'not found', hiding a newly created item.",
      "Treating null from the cache as both 'miss' and 'missing'.",
    ],
    follow: ["How do you tell a cached 'missing' from a miss?"],
    points: [
      "Missing keys always reach the database",
      "Cache the absence briefly",
      "Distinguish absent from not cached",
      "Invalidate on creation",
    ],
    notes: ["Short TTL for 'not found'."],
    src: [
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "cache-hit-ratio-and-monitoring",
    topic: "Cache invalidation",
    d: "medium",
    title: "How do you know whether a cache is working well?",
    kw: ["hit ratio", "cache metrics", "evictions", "latency", "monitoring"],
    intent: "Checks you measure rather than assume.",
    short:
      "Measure the hit ratio (hits divided by hits plus misses), the number of evictions, memory use and the latency of cached versus uncached requests. A low hit ratio means the cache is not helping, perhaps because the TTL is too short, the keys are too specific, the cache is too small, or the data is rarely requested twice. A rising eviction count means memory pressure. Compare end-to-end response times and database load before and after to confirm the benefit.",
    detail: [
      "Redis exposes hit and miss counters in its `INFO` output.",
      "Track hit ratio per cache or key type, because an average can hide a useless cache.",
      "Keep the benefit in perspective: a cache that adds complexity but saves little is not worth it.",
    ],
    ex: "A dashboard shows a 92 percent hit ratio for product pages but 8 percent for search results, which prompts a rethink of the search key design.",
    mistakes: [
      "Adding a cache without measuring.",
      "Only watching the global hit ratio.",
    ],
    follow: ["What does a low hit ratio suggest?"],
    points: [
      "Hit ratio = hits / (hits + misses)",
      "Watch evictions and memory",
      "Compare latency and DB load",
      "Measure per cache",
    ],
    notes: ["If you do not measure it, you do not know."],
    src: [
      ["Redis: Key eviction", `${RD}/develop/reference/eviction/`],
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "cache-aside-pattern",
    topic: "Cache-aside and write-through",
    d: "easy",
    title: "What is the cache-aside pattern?",
    kw: [
      "cache-aside",
      "lazy loading",
      "read path",
      "cache miss",
      "load on demand",
    ],
    intent:
      "A core pattern: checks you can describe the usual read and write flow.",
    short:
      "In cache-aside, also called lazy loading, the application is responsible for the cache. On a read it first checks the cache; on a hit it returns the value, and on a miss it reads the data store, puts the result in the cache, and returns it. On a write it updates the data store and then invalidates the cached entry. Only requested data is cached, and a cache failure does not stop the app from working, but the first request for each item pays the miss penalty.",
    detail: [
      "Cached data can become stale if invalidation is missed, so a TTL is also used.",
      "The pattern suits read-heavy workloads.",
      "A cold cache after restart means a temporary rise in database load.",
    ],
    ex: "A product service tries Redis first, loads from the database on a miss, and caches the result for ten minutes.",
    code: [
      [
        "Cache-aside read",
        "js",
        `async function getProduct(id) {\n  const key = \`product:\${id}\`\n  const cached = await redis.get(key)\n  if (cached) return JSON.parse(cached)\n\n  const product = await db.products.findById(id)\n  if (product) await redis.set(key, JSON.stringify(product), "EX", 600)\n  return product\n}`,
        [
          "Check the cache first.",
          "On a miss, load from the database.",
          "Store the result with a TTL, then return it.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to invalidate on writes.",
      "No TTL on cached entries.",
    ],
    follow: ["What is the miss penalty?"],
    points: [
      "App checks cache, then store",
      "Populate on a miss",
      "Invalidate on write",
      "Only requested data cached",
    ],
    notes: ["Look aside, load, store."],
    src: [
      ["Microsoft Learn: Cache-Aside pattern", `${MS}/patterns/cache-aside`],
      ["AWS ElastiCache: Caching strategies (lazy loading)", AWS],
    ],
  }),
  q({
    slug: "write-through-caching",
    topic: "Cache-aside and write-through",
    d: "medium",
    title: "What is write-through caching and what are its trade-offs?",
    kw: [
      "write-through",
      "synchronous write",
      "cache consistency",
      "write latency",
      "fresh cache",
    ],
    intent:
      "Checks you know a strategy that keeps the cache current on writes.",
    short:
      "In write-through caching, every write goes to the cache and the data store together, so the cache is updated whenever the database is, and cached data is never stale. Reads then find current data in the cache. The costs are higher write latency, because each write does two operations, and the cache fills with data that may never be read, wasting memory. Write-through is often combined with a TTL and with lazy loading for entries missing from the cache.",
    detail: [
      "Missing data, for example after a node failure, is still filled on demand by lazy loading.",
      "Keeping cache and database consistent when one write fails needs care.",
      "It suits data that is read soon after it is written.",
    ],
    ex: "When a user updates their profile, the service writes the database and the cache entry in the same operation.",
    mistakes: [
      "Ignoring failure of one of the two writes.",
      "Using it for write-heavy data that is rarely read.",
    ],
    follow: ["What is the downside for memory?"],
    points: [
      "Write to cache and store together",
      "Cache never stale",
      "Slower writes",
      "May cache data nobody reads",
    ],
    notes: ["Write both, read fresh."],
    src: [
      ["AWS ElastiCache: Caching strategies (write-through)", AWS],
      ["Microsoft Learn: Cache-Aside pattern", `${MS}/patterns/cache-aside`],
    ],
  }),
  q({
    slug: "write-behind-and-read-through",
    topic: "Cache-aside and write-through",
    d: "hard",
    title: "What are read-through and write-behind caching?",
    kw: [
      "read-through",
      "write-behind",
      "write-back",
      "durability",
      "caching strategies",
    ],
    intent: "Checks you know the variants and their risks.",
    short:
      "In read-through caching the cache itself loads data from the store on a miss, so the application only talks to the cache; cache-aside is the application-managed version of this. In write-behind, also called write-back, writes go to the cache first and are saved to the data store asynchronously later, which makes writes fast and lets writes be batched. The risk is data loss and inconsistency if the cache fails before the data reaches the store, so write-behind suits data where an occasional loss is acceptable.",
    detail: [
      "Many commercial caches provide read-through and write-through or write-behind; otherwise the application emulates them.",
      "Write-behind needs a durable queue or replication to reduce the risk.",
      "Never use write-behind for payments or orders.",
    ],
    ex: "A game counts views in the cache and flushes totals to the database every minute.",
    mistakes: [
      "Write-behind for critical data.",
      "Confusing read-through with cache-aside.",
    ],
    follow: ["Which data tolerates write-behind?"],
    points: [
      "Read-through: cache loads on miss",
      "Write-behind: async write to the store",
      "Risk of loss on failure",
      "Not for critical data",
    ],
    notes: ["Fast writes, risky durability."],
    src: [
      ["Microsoft Learn: Cache-Aside pattern", `${MS}/patterns/cache-aside`],
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "choosing-a-caching-strategy",
    topic: "Cache-aside and write-through",
    d: "medium",
    title:
      "How do you choose between cache-aside, write-through and TTL-only caching?",
    kw: [
      "caching strategy",
      "read-heavy",
      "write-heavy",
      "consistency",
      "trade-offs",
    ],
    intent: "Checks you give a reasoned choice by workload.",
    short:
      "Start from the workload. For read-heavy data where small staleness is tolerable, cache-aside with a TTL and invalidation on write is the simplest and most common. When readers must always see the latest value shortly after writes, add write-through, accepting slower writes and extra memory. For data that is written constantly and read rarely, caching may not pay off. For static or rarely changing data a long TTL is enough. Whatever you pick, define acceptable staleness and what happens when the cache is down.",
    detail: [
      "Different data in the same app can use different strategies.",
      "The more guarantees you need, the more complex the cache becomes.",
      "Test the failure case by turning the cache off.",
    ],
    ex: "Reference data uses a long TTL, product details use cache-aside with invalidation, and a shopping cart avoids caching altogether.",
    mistakes: ["One strategy for all data.", "No plan for cache failure."],
    follow: ["Which data would you not cache?"],
    points: [
      "Choose by read/write pattern",
      "Cache-aside as default",
      "Write-through for fresher reads",
      "Define staleness and failure behaviour",
    ],
    notes: ["Workload decides."],
    src: [
      ["AWS ElastiCache: Caching strategies", AWS],
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
    ],
  }),
  q({
    slug: "caching-consistency-and-fallback",
    topic: "Cache-aside and write-through",
    d: "medium",
    title: "How should an application behave when the cache is unavailable?",
    kw: [
      "cache failure",
      "fallback",
      "graceful degradation",
      "timeout",
      "circuit breaker",
    ],
    intent: "Checks you treat the cache as an optimisation, not a dependency.",
    short:
      "A cache is an optimisation, so the application should still work when it is down. Catch cache errors and time out quickly, then fall back to the data store, and log the failure. Keep short timeouts on cache calls, because a hung cache can be slower than no cache. Be careful that the sudden extra load on the database does not bring it down, so consider limiting concurrency or using a circuit breaker. Do not store data only in the cache unless it can be lost.",
    detail: [
      "Cache-aside handles this naturally, since a miss falls back to the store.",
      "Monitor and alert on cache errors, not only on slowness.",
      "Test failure by stopping the cache in a staging environment.",
    ],
    ex: "When Redis times out, the product service reads from the database and records a warning instead of returning an error.",
    code: [
      [
        "Fall back on error",
        "js",
        `async function safeGet(key) {\n  try {\n    return await redis.get(key)\n  } catch (err) {\n    console.warn("cache unavailable", err.message)\n    return null\n  }\n}`,
        [
          "Errors are caught and treated as a miss.",
          "The caller then reads from the database.",
        ],
      ],
    ],
    mistakes: [
      "Letting cache errors crash the request.",
      "Long timeouts on cache calls.",
    ],
    follow: ["What risk does a cache outage create for the database?"],
    points: [
      "Cache is optional for correctness",
      "Fall back to the store",
      "Short timeouts",
      "Protect the database from the surge",
    ],
    notes: ["Cache down must not mean app down."],
    src: [
      ["Microsoft Learn: Caching guidance", `${MS}/best-practices/caching`],
      ["Microsoft Learn: Cache-Aside pattern", `${MS}/patterns/cache-aside`],
    ],
  }),
])
