import { defineQuestions } from "../author"
import { q } from "../compact"

const M = "https://developer.mozilla.org/en-US/docs/Web/HTTP"
const RFC = "https://www.rfc-editor.org/rfc"
const ST = `${M}/Reference/Status`
const HD = `${M}/Reference/Headers`
const ME = `${M}/Reference/Methods`

export default defineQuestions("http", "fresher", [
  q({
    slug: "what-is-http-request-response",
    topic: "Methods",
    d: "easy",
    title: "What is HTTP and how does the request-response model work?",
    kw: ["http", "request response", "stateless", "client server", "message"],
    intent:
      "A foundation question: checks you can describe the protocol's basic shape.",
    short:
      "HTTP is the application-layer protocol of the web. A client, usually a browser or app, sends a request containing a method, a target (URL path), headers and an optional body; the server answers with a response containing a status code, headers and an optional body. HTTP is stateless: each request is independent, and the server keeps no memory of earlier ones unless the application adds it with cookies, tokens or sessions. It runs over TCP (HTTP/1.1 and HTTP/2) or QUIC (HTTP/3), and HTTPS adds TLS encryption.",
    detail: [
      "Messages are text-based in HTTP/1.1 and binary-framed in HTTP/2 and HTTP/3.",
      "The client always starts the exchange.",
      "Intermediaries such as proxies, CDNs and load balancers can sit between client and server.",
    ],
    ex: "A browser sends `GET /products HTTP/1.1` with a `Host` header, and the server replies `200 OK` with HTML.",
    code: [
      [
        "A request and response",
        "http",
        `GET /api/users/42 HTTP/1.1\nHost: example.com\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":42,"name":"Asha"}`,
        [
          "The request line has method, path and version.",
          "Headers add metadata.",
          "The response starts with a status line.",
        ],
      ],
    ],
    mistakes: [
      "Assuming the server remembers the previous request.",
      "Confusing HTTP with HTTPS.",
    ],
    follow: ["What does stateless mean?"],
    points: [
      "Client sends a request, server returns a response",
      "Methods, headers, status codes",
      "Stateless",
      "HTTPS = HTTP over TLS",
    ],
    notes: ["Request in, response out, no memory."],
    src: [
      ["MDN: Overview of HTTP", `${M}/Guides/Overview`],
      ["RFC 9110: HTTP Semantics", `${RFC}/rfc9110`],
    ],
  }),
  q({
    slug: "http-get-vs-post",
    topic: "Methods",
    d: "easy",
    title: "What is the difference between GET and POST?",
    kw: ["get", "post", "safe methods", "request body", "query string"],
    intent: "The most common HTTP question.",
    short:
      "GET requests a representation of a resource and must not change server state: it is safe and idempotent, usually has no body, passes parameters in the URL query string, and responses can be cached and bookmarked. POST submits data to the server to be processed, such as creating a resource or running an action: it carries a body, is not idempotent, and is not cached by default. Because URLs appear in logs, history and referrers, never put sensitive data in a GET query string. Neither method is encrypted unless HTTPS is used.",
    detail: [
      "GET has practical URL length limits.",
      "Repeating a POST can create duplicates, so retries need care.",
      "Forms use GET for searches and POST for changes.",
    ],
    ex: "`GET /search?q=boots` is bookmarkable, while `POST /orders` creates a new order.",
    mistakes: [
      "Changing data with GET requests.",
      "Passwords in query strings.",
    ],
    follow: ["Why must GET be safe?"],
    points: [
      "GET reads, safe and idempotent",
      "POST submits and may change state",
      "Parameters in URL vs body",
      "Cacheable vs not by default",
    ],
    notes: ["GET reads, POST acts."],
    src: [
      ["MDN: GET", `${ME}/GET`],
      ["MDN: POST", `${ME}/POST`],
    ],
  }),
  q({
    slug: "http-put-patch-delete",
    topic: "Methods",
    d: "medium",
    title: "How do PUT, PATCH and DELETE differ?",
    kw: ["put", "patch", "delete", "replace", "partial update"],
    intent: "Checks you can pick the right update method.",
    short:
      "PUT replaces the target resource with the representation in the request (or creates it at that URL), so sending the same PUT repeatedly gives the same result: it is idempotent. PATCH applies a partial modification, changing only the fields sent, and is not guaranteed to be idempotent. DELETE removes the resource and is idempotent, because deleting twice leaves the same state, although the second response may be 404. Use PUT for full replacement, PATCH for small changes, and a clear contract for what the server does with missing fields.",
    detail: [
      "PATCH formats include JSON Merge Patch (RFC 7396) and JSON Patch (RFC 6902).",
      "A PUT with missing fields may clear them if it means full replacement.",
      "Successful DELETE usually returns 204 No Content or 200.",
    ],
    ex: '`PATCH /users/42` with `{"email": "new@x.com"}` changes only the email.',
    mistakes: [
      "Using PUT for partial updates and wiping fields.",
      "Assuming PATCH is always idempotent.",
    ],
    follow: ["Which of these are idempotent?"],
    points: [
      "PUT replaces",
      "PATCH partially updates",
      "DELETE removes",
      "PUT and DELETE are idempotent",
    ],
    notes: ["Replace, patch, remove."],
    src: [
      ["MDN: PUT", `${ME}/PUT`],
      ["MDN: PATCH", `${ME}/PATCH`],
      ["MDN: DELETE", `${ME}/DELETE`],
    ],
  }),
  q({
    slug: "safe-and-idempotent-methods",
    topic: "Methods",
    d: "medium",
    title: "What do 'safe' and 'idempotent' mean for HTTP methods?",
    kw: [
      "safe methods",
      "idempotent",
      "retry",
      "get put delete",
      "side effects",
    ],
    intent: "A key concept for API design and retry logic.",
    short:
      "A safe method is read-only by intent: it does not change server state, as with GET, HEAD and OPTIONS. An idempotent method has the same intended effect on the server whether it is sent once or many times: GET, HEAD, OPTIONS, PUT and DELETE are idempotent, while POST and PATCH generally are not. Idempotency matters because networks fail: a client that did not receive a response can safely retry an idempotent request, but retrying a POST may create duplicates, which is why APIs add idempotency keys for payments and orders.",
    detail: [
      "Idempotent means the final server state is the same, not that responses are identical.",
      "All safe methods are idempotent, but not the reverse.",
      "Proxies and clients may automatically retry idempotent requests.",
    ],
    ex: "A payment endpoint accepts an `Idempotency-Key` header so a retried POST does not charge twice.",
    mistakes: [
      "Using GET for actions with side effects.",
      "Retrying POST blindly.",
    ],
    follow: ["Is DELETE idempotent?"],
    points: [
      "Safe = no state change",
      "Idempotent = same effect when repeated",
      "GET, HEAD, OPTIONS safe",
      "POST needs idempotency keys",
    ],
    notes: ["Safe implies idempotent."],
    src: [
      ["RFC 9110: Methods (safe and idempotent)", `${RFC}/rfc9110`],
      [
        "MDN: Idempotent",
        "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent",
      ],
    ],
  }),
  q({
    slug: "head-and-options-methods",
    topic: "Methods",
    d: "medium",
    title: "What are the HEAD and OPTIONS methods used for?",
    kw: ["head", "options", "preflight", "allow header", "metadata"],
    intent: "Checks you know the less obvious methods.",
    short:
      "HEAD is identical to GET but the server returns only the headers, without a body, so a client can check a resource's existence, size (`Content-Length`) or last modification time cheaply. OPTIONS asks which communication options are available for a resource; the server may answer with an `Allow` header listing supported methods. Browsers use OPTIONS automatically as a CORS preflight request before certain cross-origin requests, to ask whether the real request is allowed. Both are safe and idempotent.",
    detail: [
      "`curl -I` sends a HEAD request.",
      "A server should return the same headers for HEAD as for GET.",
      "A missing OPTIONS handler is a common cause of CORS failures.",
    ],
    ex: "A download manager sends HEAD to learn the file size before downloading.",
    mistakes: [
      "Not handling OPTIONS for CORS.",
      "Expecting a body in a HEAD response.",
    ],
    follow: ["Who sends OPTIONS in a browser?"],
    points: [
      "HEAD: headers only",
      "OPTIONS: supported methods",
      "Preflight uses OPTIONS",
      "Safe and idempotent",
    ],
    notes: ["HEAD for metadata, OPTIONS for capabilities."],
    src: [
      ["MDN: HEAD", `${ME}/HEAD`],
      ["MDN: OPTIONS", `${ME}/OPTIONS`],
    ],
  }),
  q({
    slug: "http-content-type-accept",
    topic: "Headers",
    d: "easy",
    title: "What do the Content-Type and Accept headers do?",
    kw: ["content-type", "accept", "media type", "json", "content negotiation"],
    intent: "Checks you can describe how clients and servers agree on formats.",
    short:
      "`Content-Type` states the media type of the body being sent, in a request or response, such as `application/json`, `text/html; charset=utf-8` or `multipart/form-data`. The receiver uses it to parse the body, so a JSON request sent without `Content-Type: application/json` is often not parsed by the server. `Accept` is a request header listing the media types the client can handle, in order of preference; the server picks a representation to match, or returns 406 Not Acceptable (or a default). Together they implement content negotiation.",
    detail: [
      "`Accept-Language` and `Accept-Encoding` negotiate language and compression.",
      "A response varying by these headers should carry `Vary`.",
      "Form posts use `application/x-www-form-urlencoded` by default.",
    ],
    ex: "An API client sends `Accept: application/json` and `Content-Type: application/json` when posting data.",
    mistakes: [
      "Forgetting Content-Type on JSON requests.",
      "Mislabelling the response type, leading to wrong parsing.",
    ],
    follow: ["What does a 415 status mean?"],
    points: [
      "Content-Type describes the body",
      "Accept lists wanted formats",
      "Basis of content negotiation",
      "Vary for varying responses",
    ],
    notes: ["Content-Type says what I send, Accept says what I want."],
    src: [
      ["MDN: Content-Type", `${HD}/Content-Type`],
      ["MDN: Accept", `${HD}/Accept`],
      ["MDN: Content negotiation", `${M}/Guides/Content_negotiation`],
    ],
  }),
  q({
    slug: "http-authorization-header",
    topic: "Headers",
    d: "easy",
    title: "How does the Authorization header work?",
    kw: [
      "authorization header",
      "bearer token",
      "basic auth",
      "www-authenticate",
      "401",
    ],
    intent: "Checks you can send credentials to an API.",
    short:
      "The `Authorization` request header carries credentials in the form `<scheme> <credentials>`. `Basic` sends base64-encoded `user:password`, which is not encryption, so it needs HTTPS. `Bearer` sends a token, such as an OAuth access token or JWT, that grants access to whoever holds it. If credentials are missing or invalid the server returns 401 Unauthorized and may include a `WWW-Authenticate` header naming the expected scheme. Never send credentials over plain HTTP or in URLs.",
    detail: [
      "Browsers do not attach an Authorization header automatically, unlike cookies.",
      "Cross-origin calls with this header trigger a CORS preflight.",
      "Keep tokens out of logs.",
    ],
    ex: "`Authorization: Bearer eyJhbGciOi...` accompanies each API call after login.",
    mistakes: [
      "Treating Basic's base64 as secure.",
      "Tokens in query strings.",
    ],
    follow: ["What does 401 with WWW-Authenticate mean?"],
    points: [
      "Scheme plus credentials",
      "Basic is encoded, not encrypted",
      "Bearer token possession grants access",
      "401 and WWW-Authenticate",
    ],
    notes: ["Use with HTTPS only."],
    src: [
      ["MDN: Authorization", `${HD}/Authorization`],
      ["MDN: HTTP authentication", `${M}/Guides/Authentication`],
    ],
  }),
  q({
    slug: "http-host-user-agent-referer-origin",
    topic: "Headers",
    d: "medium",
    title: "What are the Host, Origin, Referer and User-Agent headers?",
    kw: [
      "host header",
      "origin header",
      "referer",
      "user-agent",
      "request headers",
    ],
    intent:
      "Checks you know the standard request headers and their uses and risks.",
    short:
      "`Host` names the server and port the client wants, which lets one IP address serve many sites (virtual hosting) and is mandatory in HTTP/1.1. `Origin` (scheme, host and port) is sent with cross-origin requests and with non-GET requests, and servers use it for CORS and CSRF checks. `Referer` (spelled with the historical typo) carries the URL of the page that linked to the request, and browsers limit what it reveals through the Referrer-Policy. `User-Agent` identifies the client software; it can be spoofed, so do not use it for security decisions. All client headers can be forged by non-browser clients.",
    detail: [
      "Behind a proxy, the original host may be in `X-Forwarded-Host`.",
      "Do not trust any request header for authorisation.",
      "Referrer data can leak URLs, so avoid secrets in them.",
    ],
    ex: "nginx routes a request to the right backend by looking at the `Host` header.",
    mistakes: [
      "Trusting headers from the client for security.",
      "Putting secrets in URLs that can leak through Referer.",
    ],
    follow: ["Why is Host required in HTTP/1.1?"],
    points: [
      "Host enables virtual hosting",
      "Origin for CORS and CSRF checks",
      "Referer shows the previous page",
      "User-Agent can be faked",
    ],
    notes: ["Headers from clients are untrusted input."],
    src: [
      ["MDN: Host", `${HD}/Host`],
      ["MDN: Origin", `${HD}/Origin`],
      ["MDN: Referer", `${HD}/Referer`],
      ["MDN: User-Agent", `${HD}/User-Agent`],
    ],
  }),
  q({
    slug: "http-forwarded-headers-proxy",
    topic: "Headers",
    d: "medium",
    title:
      "What are X-Forwarded-For and X-Forwarded-Proto, and why are they not fully trustworthy?",
    kw: [
      "x-forwarded-for",
      "x-forwarded-proto",
      "forwarded header",
      "client ip",
      "proxy",
    ],
    intent:
      "Checks you understand how apps behind proxies learn the real client.",
    short:
      "When a proxy or load balancer forwards a request, the server sees the proxy's address, not the client's. Proxies add `X-Forwarded-For` (the chain of client and proxy addresses), `X-Forwarded-Proto` (http or https) and `X-Forwarded-Host`, and the standard `Forwarded` header does the same. The application reads these only when it knows a trusted proxy set them: any client can send the same headers, so blindly trusting `X-Forwarded-For` lets attackers fake their IP, bypass rate limits or spoof logs. Frameworks offer settings like Express `trust proxy` to count only your known proxy hops.",
    detail: [
      "The rightmost entries are added by your own proxies; the leftmost can be forged.",
      "The proxy should overwrite or sanitise incoming forwarded headers from the internet.",
      "Cookies marked Secure and redirect URLs depend on the original protocol.",
    ],
    ex: "Behind nginx, Express with `trust proxy` set to 1 reports the real client IP in `req.ip`.",
    mistakes: [
      "Using the leftmost X-Forwarded-For value as truth.",
      "Not configuring trust proxy and getting 127.0.0.1 for everyone.",
    ],
    follow: ["Why can't a client's forwarded header be trusted?"],
    points: [
      "Proxies add forwarded headers",
      "Apps need to trust only their proxies",
      "Client-supplied values can be forged",
      "Configure trust proxy hops",
    ],
    notes: ["Trust the proxy, not the header."],
    src: [
      ["MDN: X-Forwarded-For", `${HD}/X-Forwarded-For`],
      ["MDN: Forwarded", `${HD}/Forwarded`],
      [
        "Express: Behind proxies",
        "https://expressjs.com/en/guide/behind-proxies.html",
      ],
    ],
  }),
  q({
    slug: "http-content-encoding-compression",
    topic: "Headers",
    d: "medium",
    title:
      "How does HTTP compression work with Accept-Encoding and Content-Encoding?",
    kw: [
      "accept-encoding",
      "content-encoding",
      "gzip",
      "brotli",
      "compression",
    ],
    intent: "Checks you know how responses are made smaller.",
    short:
      "A client sends `Accept-Encoding: gzip, br` to list the compression algorithms it supports. The server may compress the response body and says which one it used in `Content-Encoding: gzip` (or `br` for Brotli), and `Vary: Accept-Encoding` tells caches that the response depends on that request header. The client decompresses it transparently. Text such as HTML, CSS, JavaScript and JSON compresses well, while images and videos are already compressed. Compression saves bandwidth but costs CPU, so it is often done once at the reverse proxy or CDN.",
    detail: [
      "Brotli usually compresses smaller than gzip, but is slower at high levels.",
      "Compressing secrets mixed with attacker-controlled text over TLS has had side-channel attacks (BREACH).",
      "`Content-Length` refers to the compressed size on the wire.",
    ],
    ex: "nginx compresses JSON and JavaScript responses with gzip for clients that advertise support.",
    mistakes: [
      "Compressing already compressed files.",
      "Forgetting the Vary header.",
    ],
    follow: ["Which header lists supported encodings?"],
    points: [
      "Accept-Encoding lists options",
      "Content-Encoding states the choice",
      "Vary tells caches",
      "Compress text, not media",
    ],
    notes: ["Negotiate, compress, label."],
    src: [
      ["MDN: Accept-Encoding", `${HD}/Accept-Encoding`],
      ["MDN: Content-Encoding", `${HD}/Content-Encoding`],
      ["MDN: HTTP compression", `${M}/Guides/Compression`],
    ],
  }),
  q({
    slug: "http-2xx-success-codes",
    topic: "Status codes",
    d: "easy",
    title: "What do the 2xx status codes 200, 201, 202 and 204 mean?",
    kw: [
      "200 ok",
      "201 created",
      "202 accepted",
      "204 no content",
      "success codes",
    ],
    intent: "Checks you return the right success code.",
    short:
      "200 OK means the request succeeded and the response usually has a body, such as a GET result. 201 Created means a new resource was created, typically after POST or PUT, and the response should include a `Location` header pointing to it. 202 Accepted means the request was accepted for processing but is not finished, which suits asynchronous jobs. 204 No Content means success with no body, common for DELETE and some updates. Choosing precise codes helps clients react correctly without parsing the body.",
    detail: [
      "A 204 response must not include a body.",
      "For a long task, return 202 with a status URL for polling.",
      "Do not return 200 with an error in the body.",
    ],
    ex: "`POST /orders` returns `201 Created` with `Location: /orders/981`.",
    mistakes: [
      "200 for everything, including errors.",
      "A body in a 204 response.",
    ],
    follow: ["Which header goes with 201?"],
    points: [
      "200 OK",
      "201 Created with Location",
      "202 Accepted for async",
      "204 No Content",
    ],
    notes: ["Be specific about success."],
    src: [
      ["MDN: 200", `${ST}/200`],
      ["MDN: 201", `${ST}/201`],
      ["MDN: 202", `${ST}/202`],
      ["MDN: 204", `${ST}/204`],
    ],
  }),
  q({
    slug: "http-3xx-redirect-codes",
    topic: "Status codes",
    d: "medium",
    title: "What is the difference between 301, 302, 307 and 308 redirects?",
    kw: ["301", "302", "307", "308", "redirect", "location header"],
    intent: "Checks you can choose a redirect type and know its effects.",
    short:
      "Redirects use a `Location` header to send the client elsewhere. 301 Moved Permanently and 308 Permanent Redirect say the move is permanent, so clients and search engines can update links and cache the redirect; 302 Found and 307 Temporary Redirect say it is temporary. The difference between the pairs is method handling: 301 and 302 historically let clients change a POST to GET, while 307 and 308 require the same method and body to be repeated. Use 301 or 308 for permanent URL changes such as HTTP to HTTPS, and 302/307 for temporary ones.",
    detail: [
      "303 See Other tells the client to fetch another URL with GET, common after a POST.",
      "Avoid redirect chains and loops.",
      "Permanent redirects can be cached for a long time, so be sure before using them.",
    ],
    ex: "`http://example.com` returns `301` with `Location: https://example.com/`.",
    mistakes: [
      "Using a permanent redirect for a temporary change.",
      "Redirect loops.",
    ],
    follow: ["What do 307 and 308 preserve?"],
    points: [
      "301/308 permanent, 302/307 temporary",
      "307/308 keep the method",
      "Location gives the target",
      "Avoid chains",
    ],
    notes: ["Permanent or temporary; same method or not."],
    src: [
      ["MDN: 301", `${ST}/301`],
      ["MDN: 302", `${ST}/302`],
      ["MDN: 307", `${ST}/307`],
      ["MDN: 308", `${ST}/308`],
      ["MDN: Redirections", `${M}/Guides/Redirections`],
    ],
  }),
  q({
    slug: "http-4xx-client-errors",
    topic: "Status codes",
    d: "easy",
    title: "What do 400, 401, 403, 404, 409 and 422 mean?",
    kw: ["400", "401", "403", "404", "409", "422"],
    intent: "A staple: checks you can pick the right client-error code.",
    short:
      "400 Bad Request means the request is malformed or invalid. 401 Unauthorized means authentication is missing or invalid (the client is not identified). 403 Forbidden means the client is known but not allowed. 404 Not Found means the resource does not exist (or the server hides it). 409 Conflict means the request conflicts with the current state, such as a duplicate or a version clash. 422 Unprocessable Content means the syntax is fine but the data fails validation. Also common are 405 Method Not Allowed, 415 Unsupported Media Type and 429 Too Many Requests.",
    detail: [
      "Return a helpful JSON error body with a machine-readable code.",
      "Use 404 instead of 403 when you do not want to reveal that a resource exists.",
      "4xx means the client should change something before retrying.",
    ],
    ex: "Posting an invalid email returns `422` with a list of field errors, while a duplicate username returns `409`.",
    mistakes: [
      "Using 401 when 403 is correct.",
      "Returning 200 with an error message.",
    ],
    follow: ["How do 401 and 403 differ?"],
    points: [
      "400 malformed, 422 invalid",
      "401 not authenticated, 403 not allowed",
      "404 missing, 409 conflict",
      "Return a clear error body",
    ],
    notes: ["401 who are you, 403 not you."],
    src: [
      ["MDN: 400", `${ST}/400`],
      ["MDN: 401", `${ST}/401`],
      ["MDN: 403", `${ST}/403`],
      ["MDN: 409", `${ST}/409`],
      ["MDN: 422", `${ST}/422`],
    ],
  }),
  q({
    slug: "http-5xx-server-errors",
    topic: "Status codes",
    d: "easy",
    title: "What do 500, 502, 503 and 504 mean?",
    kw: ["500", "502", "503", "504", "server errors"],
    intent:
      "Checks you can read server-side failures, especially behind proxies.",
    short:
      "500 Internal Server Error means the server hit an unexpected problem handling the request. 502 Bad Gateway means a gateway or proxy received an invalid response from the upstream server (often the app is down or crashed). 503 Service Unavailable means the server cannot handle the request now, because of overload or maintenance, and may include `Retry-After`. 504 Gateway Timeout means the proxy did not get a timely response from the upstream. 5xx errors are the server's fault, so alert on them, log the details, and never expose stack traces to users.",
    detail: [
      "Clients may retry idempotent requests after 502, 503 and 504, with backoff.",
      "A spike in 5xx after a deployment suggests a bad release.",
      "Use 503 with Retry-After for planned maintenance.",
    ],
    ex: "nginx returns 502 when the Node process behind it has crashed.",
    mistakes: [
      "Returning 500 for client mistakes.",
      "Exposing internal error details.",
    ],
    follow: ["Which code means the upstream was too slow?"],
    points: [
      "500 generic server error",
      "502 bad upstream response",
      "503 unavailable, maybe Retry-After",
      "504 upstream timeout",
    ],
    notes: ["5xx: the server's problem."],
    src: [
      ["MDN: 500", `${ST}/500`],
      ["MDN: 502", `${ST}/502`],
      ["MDN: 503", `${ST}/503`],
      ["MDN: 504", `${ST}/504`],
    ],
  }),
  q({
    slug: "http-status-code-classes",
    topic: "Status codes",
    d: "easy",
    title: "What do the five classes of HTTP status codes mean?",
    kw: ["1xx", "2xx", "3xx", "4xx", "5xx"],
    intent:
      "Checks you know the grouping, so unfamiliar codes can be interpreted.",
    short:
      "The first digit gives the class. 1xx are informational (such as 101 Switching Protocols for WebSockets). 2xx means success. 3xx means redirection, and the client needs to take further action such as following a `Location`. 4xx means a client error, where the request is wrong or not allowed. 5xx means a server error, where a valid request failed. A client that sees an unknown code should treat it according to its class, for example any unknown 4xx as a client error. The right class tells clients whether retrying could help.",
    detail: [
      "304 Not Modified is a 3xx used for cache validation, not a redirect.",
      "429 Too Many Requests is a 4xx used for rate limiting.",
      "The status text is informational; code numbers are what matter.",
    ],
    ex: "A monitoring alert watches the ratio of 5xx to total responses.",
    mistakes: ["Treating 304 as an error.", "Inventing non-standard codes."],
    follow: ["How should a client treat an unknown 4xx?"],
    points: [
      "1xx info, 2xx success, 3xx redirect",
      "4xx client error, 5xx server error",
      "Unknown codes follow their class",
      "Class tells whether to retry",
    ],
    notes: ["First digit is the family."],
    src: [
      ["MDN: HTTP response status codes", `${M}/Reference/Status`],
      ["RFC 9110: Status codes", `${RFC}/rfc9110`],
    ],
  }),
  q({
    slug: "http-429-rate-limit-status",
    topic: "Status codes",
    d: "medium",
    title: "What are 429 Too Many Requests and Retry-After?",
    kw: ["429", "retry-after", "rate limiting", "backoff", "throttling"],
    intent: "Checks you handle rate-limited APIs well as client and server.",
    short:
      "429 Too Many Requests tells a client it has sent too many requests in a given time (rate limiting). The server may include a `Retry-After` header with the number of seconds to wait, or a date, before trying again. Well-behaved clients stop, wait for the indicated time, and retry with exponential backoff and jitter rather than hammering the API. Servers should return 429 rather than a 5xx, document limits, and optionally expose remaining quota headers. Limits protect services from abuse and overload.",
    detail: [
      "Limits are commonly per IP, API key or user.",
      "Retrying immediately makes things worse.",
      "RFC 6585 defines the 429 status.",
    ],
    ex: "An API client receives 429 with `Retry-After: 30` and pauses for 30 seconds.",
    mistakes: ["Retrying in a tight loop.", "Returning 503 for rate limiting."],
    follow: ["What should a client do on 429?"],
    points: [
      "429 = too many requests",
      "Retry-After says when to retry",
      "Backoff with jitter",
      "Servers document limits",
    ],
    notes: ["Respect Retry-After."],
    src: [
      ["MDN: 429", `${ST}/429`],
      ["MDN: Retry-After", `${HD}/Retry-After`],
      ["RFC 6585: Additional HTTP Status Codes", `${RFC}/rfc6585`],
    ],
  }),
  q({
    slug: "http-vs-https-tls-handshake",
    topic: "HTTPS & TLS",
    d: "easy",
    title: "What is the difference between HTTP and HTTPS?",
    kw: ["https", "tls", "certificate", "encryption", "port 443"],
    intent: "A basic security question.",
    short:
      "HTTPS is HTTP carried over a TLS-encrypted connection, normally on port 443. TLS gives confidentiality, so others on the network cannot read the traffic; integrity, so it cannot be altered unnoticed; and authentication of the server through a certificate issued by a trusted certificate authority. Plain HTTP sends everything in clear text, so passwords, cookies and tokens can be stolen or modified. Modern browsers mark HTTP sites as not secure, and many web features (service workers, geolocation, secure cookies) require HTTPS.",
    detail: [
      "A TLS handshake runs before the first HTTP request.",
      "HTTPS does not hide the host name entirely or make the site itself trustworthy.",
      "Certificates are free and automated through Let's Encrypt.",
    ],
    ex: "The browser's padlock appears only after the certificate for the domain is validated.",
    mistakes: [
      "Serving login pages over HTTP.",
      "Mixed content (HTTP resources on HTTPS pages).",
    ],
    follow: ["What does the certificate prove?"],
    points: [
      "HTTPS = HTTP over TLS",
      "Confidentiality, integrity, authentication",
      "Port 443",
      "Required for modern web features",
    ],
    notes: ["Always HTTPS."],
    src: [
      [
        "MDN: Transport Layer Security",
        "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security",
      ],
      ["RFC 8446: TLS 1.3", `${RFC}/rfc8446`],
    ],
  }),
  q({
    slug: "hsts-and-mixed-content",
    topic: "HTTPS & TLS",
    d: "medium",
    title: "What are HSTS and mixed content?",
    kw: [
      "hsts",
      "strict-transport-security",
      "mixed content",
      "https redirect",
      "downgrade",
    ],
    intent: "Checks you know how to enforce HTTPS fully.",
    short:
      "HTTP Strict Transport Security, set with the `Strict-Transport-Security` response header, tells the browser to use only HTTPS for the site for a given time (`max-age`), upgrading any http link automatically and refusing certificate errors, which blocks downgrade and stripping attacks after the first visit. Mixed content happens when an HTTPS page loads resources such as scripts, images or frames over plain HTTP; browsers block active mixed content because an attacker could alter it. Fix it by serving every resource over HTTPS, and redirect HTTP to HTTPS on the server.",
    detail: [
      "Enable HSTS only after HTTPS works for all subdomains if you use `includeSubDomains`.",
      "HSTS preload lists include domains in browsers in advance.",
      "Use relative or HTTPS URLs for assets.",
    ],
    ex: "`Strict-Transport-Security: max-age=31536000; includeSubDomains` is sent with every HTTPS response.",
    mistakes: [
      "Turning on includeSubDomains too early.",
      "Hard-coded http:// resource URLs.",
    ],
    follow: ["What does max-age control?"],
    points: [
      "HSTS forces HTTPS in the browser",
      "max-age sets the duration",
      "Mixed content weakens HTTPS pages",
      "Redirect and use HTTPS URLs",
    ],
    notes: ["HTTPS everywhere, enforced."],
    src: [
      ["MDN: Strict-Transport-Security", `${HD}/Strict-Transport-Security`],
      [
        "MDN: Mixed content",
        "https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content",
      ],
    ],
  }),
  q({
    slug: "http-versions-1-2-3",
    topic: "HTTPS & TLS",
    d: "medium",
    title: "What are the main differences between HTTP/1.1, HTTP/2 and HTTP/3?",
    kw: ["http/1.1", "http/2", "http/3", "multiplexing", "quic"],
    intent: "Checks you know why newer HTTP versions are faster.",
    short:
      "HTTP/1.1 is text-based and handles one request at a time per connection, so browsers open several connections and still suffer from head-of-line blocking. HTTP/2 uses a binary framing layer over a single TCP connection to multiplex many requests and responses concurrently, compress headers and let servers prioritise streams, though a lost TCP packet still delays all streams. HTTP/3 maps the same semantics onto QUIC, which runs over UDP, giving independent streams without TCP head-of-line blocking, faster connection setup and better handling of network changes. The methods, status codes and headers stay the same across versions.",
    detail: [
      "Browsers negotiate the version automatically, and servers typically support all three.",
      "Tricks like domain sharding and sprites are unnecessary with HTTP/2.",
      "TLS is effectively required for HTTP/2 and HTTP/3 in browsers.",
    ],
    ex: "A page with many small assets loads faster over HTTP/2 because requests are multiplexed on one connection.",
    mistakes: [
      "Optimising for HTTP/1.1 limitations that no longer apply.",
      "Assuming semantics change between versions.",
    ],
    follow: ["What problem does HTTP/3 solve?"],
    points: [
      "HTTP/1.1 text, per-connection serialisation",
      "HTTP/2 multiplexing and header compression",
      "HTTP/3 over QUIC and UDP",
      "Same semantics",
    ],
    notes: ["Same semantics, better transport."],
    src: [
      ["MDN: Evolution of HTTP", `${M}/Guides/Evolution_of_HTTP`],
      ["RFC 9113: HTTP/2", `${RFC}/rfc9113`],
      ["RFC 9114: HTTP/3", `${RFC}/rfc9114`],
    ],
  }),
  q({
    slug: "http-cookies-attributes",
    topic: "Cookies & caching headers",
    d: "medium",
    title: "How do cookies work, and what do HttpOnly, Secure and SameSite do?",
    kw: ["set-cookie", "httponly", "secure", "samesite", "cookie attributes"],
    intent: "A core question linking HTTP state and security.",
    short:
      "A server sets a cookie with a `Set-Cookie` header, and the browser stores it and sends it back in the `Cookie` header on matching requests, which is how sessions work over stateless HTTP. Attributes control behaviour: `HttpOnly` hides the cookie from JavaScript, limiting theft through XSS; `Secure` sends it only over HTTPS; `SameSite` (`Strict`, `Lax` or `None`) limits sending on cross-site requests and helps against CSRF; `Max-Age` or `Expires` sets lifetime; and `Domain` and `Path` define scope. Session cookies should be HttpOnly, Secure and SameSite.",
    detail: [
      "Cookies are sent with every matching request, so keep them small.",
      "`SameSite=None` requires `Secure`.",
      "Cookies are not the same as local storage, which stays in the browser.",
    ],
    ex: "`Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`.",
    mistakes: [
      "Session cookies readable by JavaScript.",
      "Storing large data in cookies.",
    ],
    follow: ["What does SameSite protect against?"],
    points: [
      "Set-Cookie then Cookie",
      "HttpOnly, Secure, SameSite",
      "Max-Age/Expires, Domain, Path",
      "Sent on every matching request",
    ],
    notes: ["HttpOnly, Secure, SameSite."],
    src: [
      ["MDN: Using HTTP cookies", `${M}/Guides/Cookies`],
      ["MDN: Set-Cookie", `${HD}/Set-Cookie`],
      ["RFC 6265: HTTP State Management", `${RFC}/rfc6265`],
    ],
  }),
  q({
    slug: "http-caching-headers-cache-control",
    topic: "Cookies & caching headers",
    d: "medium",
    title: "How do Cache-Control, ETag and Last-Modified control caching?",
    kw: ["cache-control", "etag", "last-modified", "max-age", "no-store"],
    intent: "Checks you can reason about browser and CDN caching.",
    short:
      "`Cache-Control` directives tell caches how to treat a response: `max-age=N` makes it fresh for N seconds, `no-cache` requires revalidation before reuse, `no-store` forbids storing it, and `private` or `public` say who may cache it. When a stored response becomes stale, the cache revalidates using validators: `ETag` (a version identifier) with `If-None-Match`, or `Last-Modified` with `If-Modified-Since`; if nothing changed the server answers `304 Not Modified` with no body. Static assets with hashed names get long `max-age`, while HTML and API data get short lifetimes or revalidation.",
    detail: [
      "`no-cache` does not mean 'do not store'; `no-store` does.",
      "`Vary` lists request headers that affect the response.",
      "Without headers, caches may guess freshness heuristically.",
    ],
    ex: "`/assets/app.3f9a.js` is sent with `Cache-Control: public, max-age=31536000, immutable`.",
    mistakes: [
      "Confusing no-cache with no-store.",
      "Long caching on non-versioned URLs.",
    ],
    follow: ["What does a 304 response mean?"],
    points: [
      "Cache-Control sets freshness and rules",
      "ETag/Last-Modified validate",
      "304 saves the body",
      "Version file names for long caching",
    ],
    notes: ["Freshness, then validation."],
    src: [
      ["MDN: HTTP caching", `${M}/Guides/Caching`],
      ["MDN: Cache-Control", `${HD}/Cache-Control`],
      ["RFC 9111: HTTP Caching", `${RFC}/rfc9111`],
    ],
  }),
  q({
    slug: "http-conditional-requests-etag",
    topic: "Cookies & caching headers",
    d: "hard",
    title:
      "How do conditional requests work, and how do they help with lost updates?",
    kw: [
      "if-none-match",
      "if-match",
      "etag",
      "412 precondition failed",
      "optimistic concurrency",
    ],
    intent: "Checks you know conditional requests beyond caching.",
    short:
      "A conditional request carries a precondition that the server evaluates. For caching, `If-None-Match` with a stored ETag returns 304 when the resource is unchanged. For safe updates, `If-Match: \"v7\"` on a PUT or PATCH tells the server to apply the change only if the resource's current ETag still matches; otherwise it returns `412 Precondition Failed`, which prevents overwriting someone else's edit (the lost update problem). This is optimistic concurrency control: no locks are held, and a client that gets 412 re-fetches, merges and retries. Servers can also require preconditions with `428 Precondition Required`.",
    detail: [
      "ETags can be content hashes or version numbers.",
      "Weak ETags (W/ prefix) indicate semantic rather than byte equality.",
      "Conditional requests also support resumable downloads with `If-Range`.",
    ],
    ex: "Two editors load the same article; the second one's save fails with 412 because the first changed the ETag.",
    mistakes: [
      "Blind PUTs that overwrite concurrent edits.",
      "ETags that change on every response.",
    ],
    follow: ["What does 412 tell the client?"],
    points: [
      "If-None-Match for caching",
      "If-Match for safe updates",
      "412 on mismatch",
      "Optimistic concurrency",
    ],
    notes: ["If-Match prevents lost updates."],
    src: [
      ["MDN: Conditional requests", `${M}/Guides/Conditional_requests`],
      ["MDN: If-Match", `${HD}/If-Match`],
      ["MDN: ETag", `${HD}/ETag`],
    ],
  }),
  q({
    slug: "http-cors-headers-basic",
    topic: "Cookies & caching headers",
    d: "medium",
    title: "How do the CORS headers let a browser call another origin?",
    kw: [
      "cors",
      "access-control-allow-origin",
      "preflight",
      "credentials",
      "same-origin policy",
    ],
    intent: "Checks you can connect HTTP headers to a common front-end error.",
    short:
      "Browsers block scripts from reading responses from other origins unless the server opts in. The server's response includes `Access-Control-Allow-Origin` naming the allowed origin (or `*`). For requests that could cause side effects, such as those with custom headers or methods like PUT and DELETE, the browser first sends an OPTIONS preflight with `Access-Control-Request-Method` and `-Headers`, and the server replies with `Access-Control-Allow-Methods` and `-Headers`. To send cookies, the client sets credentials and the server must allow credentials with a specific origin, not `*`. CORS is enforced by browsers only.",
    detail: [
      "`Access-Control-Max-Age` caches preflight results.",
      "A missing Vary: Origin can cause caches to serve the wrong CORS headers.",
      "The request may still reach the server even when the browser blocks the response.",
    ],
    ex: "A React app on `app.example.com` calling `api.example.com` needs the API to allow that origin.",
    mistakes: ["Using * with credentials.", "Not handling OPTIONS."],
    follow: ["Which header names the allowed origin?"],
    points: [
      "Access-Control-Allow-Origin opts in",
      "Preflight via OPTIONS",
      "Credentials need a specific origin",
      "Browser-enforced",
    ],
    notes: ["Server opts in, browser enforces."],
    src: [
      ["MDN: CORS", `${M}/Guides/CORS`],
      ["MDN: Access-Control-Allow-Origin", `${HD}/Access-Control-Allow-Origin`],
    ],
  }),
  q({
    slug: "http-keep-alive-and-connection-reuse",
    topic: "Headers",
    d: "medium",
    title: "What is HTTP keep-alive and why does connection reuse matter?",
    kw: [
      "keep-alive",
      "persistent connection",
      "connection reuse",
      "handshake cost",
      "connection header",
    ],
    intent: "Checks you know the cost of opening connections.",
    short:
      "Opening a connection costs round trips for the TCP handshake and, with HTTPS, the TLS handshake. Persistent connections (keep-alive) keep the TCP connection open after a response so later requests reuse it, avoiding that cost; in HTTP/1.1 connections are persistent by default unless `Connection: close` is sent, and HTTP/2 and HTTP/3 multiplex requests over one connection. Servers close idle connections after a timeout. In application code, reuse HTTP agents or connection pools for outbound requests, otherwise each call opens a new connection and wastes time and sockets.",
    detail: [
      "The `Keep-Alive` header can hint timeouts.",
      "Too long idle timeouts tie up server resources.",
      "Many sockets in TIME_WAIT suggest missing connection reuse.",
    ],
    ex: "A Node service creates one keep-alive HTTP agent for calls to a downstream API instead of a new connection per call.",
    mistakes: [
      "No pooling for outbound requests.",
      "Connection: close on every request.",
    ],
    follow: ["Why is connection setup expensive?"],
    points: [
      "Handshakes cost round trips",
      "Keep-alive reuses the connection",
      "Default in HTTP/1.1",
      "Pool outbound connections",
    ],
    notes: ["Reuse connections."],
    src: [
      ["MDN: Keep-Alive", `${HD}/Keep-Alive`],
      ["MDN: Connection", `${HD}/Connection`],
      [
        "MDN: Connection management in HTTP/1.x",
        `${M}/Guides/Connection_management_in_HTTP_1.x`,
      ],
    ],
  }),
  q({
    slug: "http-url-structure",
    topic: "Methods",
    d: "easy",
    title: "What are the parts of a URL?",
    kw: ["url", "scheme", "host", "path", "query string", "fragment"],
    intent: "Checks you can dissect the address of a resource.",
    short:
      "A URL such as `https://shop.example.com:8443/products/42?color=red#reviews` has a scheme (`https`) naming the protocol, an authority with the host (`shop.example.com`) and optionally a port (`:8443`; the default is implied by the scheme), a path (`/products/42`) identifying the resource, a query string (`?color=red`) of key-value parameters, and a fragment (`#reviews`) pointing to a part of the page. The fragment is handled by the browser and is not sent to the server. Special characters must be percent-encoded, and the `URL` and `URLSearchParams` classes parse and build URLs safely.",
    detail: [
      "Do not build query strings by string concatenation; encode values.",
      "Path segments often carry resource ids in REST APIs.",
      "Everything before the path is the origin: scheme, host and port.",
    ],
    ex: '`new URL(address).searchParams.get("color")` returns `red`.',
    code: [
      [
        "Parsing a URL",
        "js",
        `const url = new URL("https://shop.example.com:8443/products/42?color=red#reviews")\nconsole.log(url.hostname)               // shop.example.com\nconsole.log(url.pathname)               // /products/42\nconsole.log(url.searchParams.get("color")) // red\nconsole.log(url.hash)                   // #reviews`,
        ["`URL` splits the parts.", "`searchParams` reads query values."],
      ],
    ],
    mistakes: [
      "Manual string concatenation without encoding.",
      "Expecting the fragment to reach the server.",
    ],
    follow: ["Is the fragment sent to the server?"],
    points: [
      "Scheme, host, port, path, query, fragment",
      "Fragment stays in the browser",
      "Percent-encode special characters",
      "Use URL and URLSearchParams",
    ],
    notes: ["Origin = scheme + host + port."],
    src: [
      ["MDN: URL", "https://developer.mozilla.org/en-US/docs/Web/API/URL"],
      ["RFC 3986: URI Generic Syntax", `${RFC}/rfc3986`],
    ],
  }),
  q({
    slug: "http-fetch-api-basics-errors",
    topic: "Methods",
    d: "medium",
    title:
      "How do you make HTTP requests with fetch, and how do you handle errors?",
    kw: [
      "fetch",
      "response.ok",
      "res.json",
      "abortcontroller",
      "network error",
    ],
    intent: "Checks the client-side view of HTTP in JavaScript.",
    short:
      "`fetch(url, options)` returns a promise that resolves to a `Response` as soon as headers arrive. It only rejects on network failures, not on HTTP error statuses such as 404 or 500, so always check `response.ok` (status 200 to 299) and handle errors yourself. Read the body with `await response.json()` or `.text()`. For POST, set `method`, a `Content-Type` header and a body such as `JSON.stringify(data)`. Cancel a request or set a timeout with `AbortController` and its `signal`. The response body can be read only once.",
    detail: [
      "Use try/catch around await for network and parsing errors.",
      "CORS failures appear as network errors in code.",
      "Libraries like Axios throw on non-2xx statuses by default.",
    ],
    ex: "A helper function throws when `!res.ok` so callers handle failures uniformly.",
    code: [
      [
        "fetch with checks",
        "js",
        `const res = await fetch("/api/orders", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ item: 7 }),\n})\nif (!res.ok) throw new Error(\`HTTP \${res.status}\`)\nconst order = await res.json()`,
        [
          "Set the content type for JSON.",
          "Check `ok` before reading.",
          "Parse the body as JSON.",
        ],
      ],
    ],
    mistakes: ["Assuming fetch rejects on 404.", "Reading the body twice."],
    follow: ["When does the fetch promise reject?"],
    points: [
      "fetch rejects only on network errors",
      "Check response.ok",
      "json() or text() for the body",
      "AbortController cancels",
    ],
    notes: ["Always check res.ok."],
    src: [
      [
        "MDN: Using the Fetch API",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
      ],
      [
        "MDN: AbortController",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
      ],
    ],
  }),
  q({
    slug: "http-websockets-sse-vs-polling",
    topic: "Methods",
    d: "medium",
    title:
      "How do polling, Server-Sent Events and WebSockets differ for real-time updates?",
    kw: [
      "websocket",
      "server-sent events",
      "long polling",
      "real-time",
      "push",
    ],
    intent:
      "Checks you can choose a real-time technique over plain request/response HTTP.",
    short:
      "Plain HTTP is client-initiated, so servers cannot push. Polling repeatedly asks 'anything new?', which is simple but wasteful and adds delay. Server-Sent Events keep one HTTP response open so the server can stream text events to the browser (one direction), with automatic reconnection built into `EventSource`. WebSockets upgrade an HTTP connection to a persistent, full-duplex channel where both sides can send messages at any time, good for chat and collaboration. Choose SSE for simple one-way feeds, WebSockets for two-way low-latency messaging, and polling when updates are rare.",
    detail: [
      "WebSockets need extra infrastructure care: proxies, scaling and authentication.",
      "SSE works over standard HTTP and passes through most proxies.",
      "A WebSocket starts with an HTTP request and a 101 Switching Protocols response.",
    ],
    ex: "A live dashboard uses SSE for a price feed, while a chat app uses WebSockets.",
    mistakes: [
      "WebSockets for data that updates once an hour.",
      "Ignoring reconnection logic.",
    ],
    follow: ["Which status code switches to WebSockets?"],
    points: [
      "Polling is simple but wasteful",
      "SSE: server to client stream",
      "WebSocket: full duplex",
      "Choose by direction and frequency",
    ],
    notes: ["Direction decides the tool."],
    src: [
      [
        "MDN: Server-sent events",
        "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
      ],
      [
        "MDN: WebSockets API",
        "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
      ],
      ["RFC 6455: The WebSocket Protocol", `${RFC}/rfc6455`],
    ],
  }),
])
