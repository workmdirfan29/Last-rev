import { defineQuestions } from "../author"
import { q } from "../compact"

const OW = "https://cheatsheetseries.owasp.org/cheatsheets"
const M = "https://developer.mozilla.org/en-US/docs/Web"
const H = `${M}/HTTP/Reference/Headers`
const EX = "https://expressjs.com/en"

export default defineQuestions("web-security", "fresher", [
  q({
    slug: "owasp-risk-list-overview",
    topic: "Injection",
    d: "easy",
    title:
      "What is the OWASP list of web application risks and how do you use it?",
    kw: [
      "owasp risk list",
      "web security risks",
      "broken access control",
      "awareness",
      "checklist",
    ],
    intent:
      "Checks you know the standard awareness document for web application risks.",
    short:
      "The OWASP list of web application risks is an awareness document from the Open Worldwide Application Security Project that lists the most critical categories of web application security risk, such as broken access control, cryptographic failures and injection. It is a starting point for teams to understand common risks, not a complete checklist. Developers use it to learn about the categories, to guide code reviews and testing, and to prioritise fixes.",
    detail: [
      "The list is updated from time to time, so check the current edition.",
      "Each category explains how the weakness occurs and how to prevent it.",
      "OWASP also publishes cheat sheets with concrete guidance for each topic.",
    ],
    ex: "A team reviews each API endpoint against the access control category and adds tests for other users' data.",
    mistakes: [
      "Treating the list as a full security standard.",
      "Fixing only the categories you have heard of.",
    ],
    follow: ["Name two categories from the list."],
    points: [
      "Awareness document of major risk categories",
      "Not a complete checklist",
      "Updated periodically",
      "Cheat sheets give detail",
    ],
    notes: ["Know the categories, then dig deeper."],
    src: [
      ["OWASP: web application risk categories", "https://owasp.org/Top10/"],
    ],
  }),
  q({
    slug: "xss-types-and-impact",
    topic: "XSS",
    d: "easy",
    title: "What is cross-site scripting (XSS) and what are its types?",
    kw: ["xss", "stored xss", "reflected xss", "dom xss", "script injection"],
    intent:
      "Checks you understand how attacker scripts end up running in your page.",
    short:
      "Cross-site scripting happens when an application includes untrusted input in a page without proper handling, so an attacker's script runs in the victim's browser with the privileges of your site. It can read page data, make requests as the user, or steal tokens that are accessible to scripts. Stored XSS saves the payload on the server (for example in a comment), reflected XSS bounces it back from the request such as a query parameter, and DOM-based XSS happens entirely in client-side code that writes input into the page.",
    detail: [
      "The browser trusts the script because it appears to come from your site.",
      "The fix is to treat all input as data and encode it for the context it is output into.",
      "Content Security Policy and HttpOnly cookies reduce the damage but do not replace correct output handling.",
    ],
    ex: "A comment containing a script tag is stored and then runs for every visitor who views the page.",
    mistakes: [
      "Inserting user input into HTML with innerHTML.",
      "Believing input filtering alone is enough.",
    ],
    follow: ["How does a stored XSS differ from reflected?"],
    points: [
      "Untrusted input becomes executable script",
      "Stored, reflected, DOM-based",
      "Runs with the site's privileges",
      "Fix by contextual output encoding",
    ],
    notes: ["Data must stay data."],
    src: [
      ["MDN: Cross-site scripting (XSS)", `${M}/Security/Attacks/XSS`],
      [
        "OWASP: XSS Prevention Cheat Sheet",
        `${OW}/Cross_Site_Scripting_Prevention_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "preventing-xss-in-react",
    topic: "XSS",
    d: "medium",
    title: "How do you prevent XSS in a React application?",
    kw: [
      "react xss",
      "dangerouslySetInnerHTML",
      "escaping",
      "sanitize html",
      "javascript url",
    ],
    intent: "Checks you know what React protects and where it does not.",
    short:
      "React escapes values you put in JSX, such as `{comment.text}`, before inserting them into the DOM, which prevents most XSS. The risks come from bypassing that: `dangerouslySetInnerHTML`, setting `innerHTML` directly, `javascript:` URLs in `href` or `src` taken from user data, and using `eval` or `new Function` on input. If you must render user-provided HTML, sanitise it with a well-maintained sanitiser first, validate URL schemes, and add a Content Security Policy as a second layer.",
    detail: [
      "Server-rendered HTML or Markdown from users needs sanitising too.",
      "Third-party scripts can also be an XSS route, so limit and review them.",
      "Keep tokens out of script-readable storage to reduce impact.",
    ],
    ex: "A profile page shows the bio as text by default; the one place that allows formatting passes the HTML through a sanitiser.",
    code: [
      [
        "Safe and unsafe",
        "tsx",
        `// Safe: React escapes the text\n<p>{comment.text}</p>\n\n// Risky: renders raw HTML\n<div dangerouslySetInnerHTML={{ __html: comment.html }} />`,
        [
          "Plain JSX output is escaped.",
          "`dangerouslySetInnerHTML` skips escaping and needs sanitised input.",
        ],
      ],
    ],
    mistakes: [
      "Passing user HTML to dangerouslySetInnerHTML unsanitised.",
      "Allowing javascript: links.",
    ],
    follow: ["What does a Content Security Policy add?"],
    points: [
      "JSX escapes by default",
      "Risky: dangerouslySetInnerHTML, innerHTML, javascript: URLs",
      "Sanitise any HTML you must render",
      "CSP as defence in depth",
    ],
    notes: ["React is safe until you bypass it."],
    src: [
      [
        "React: Common components (dangerouslySetInnerHTML)",
        "https://react.dev/reference/react-dom/components/common",
      ],
      [
        "OWASP: XSS Prevention Cheat Sheet",
        `${OW}/Cross_Site_Scripting_Prevention_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "output-encoding-and-csp",
    topic: "XSS",
    d: "hard",
    title:
      "What is output encoding and how does a Content Security Policy help against XSS?",
    kw: [
      "output encoding",
      "content security policy",
      "csp",
      "script-src",
      "nonce",
    ],
    intent: "Checks you know the primary defence and the backup layer.",
    short:
      "Output encoding converts characters that have special meaning in a context, such as `<`, `>`, `&` and quotes in HTML, into harmless text, and the right encoding depends on whether the data goes into HTML, an attribute, JavaScript or a URL. It is the primary defence. A Content Security Policy, set with the `Content-Security-Policy` header, tells the browser which sources of script are allowed, for example only your own origin or scripts carrying a per-response nonce. Then an injected inline script is blocked even if encoding was missed.",
    detail: [
      "Template engines and frameworks encode by default; the danger is in opting out.",
      "A policy of `script-src 'self'` blocks inline scripts and external script hosts not listed.",
      "A report-only mode lets you test a policy before enforcing it.",
    ],
    ex: "The site sends a CSP that allows scripts only from its own origin, so an injected inline script does not execute.",
    code: [
      [
        "A CSP header",
        "http",
        `Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'`,
        [
          "Resources default to the same origin.",
          "Scripts only from the same origin.",
          "Plugins are blocked.",
        ],
      ],
    ],
    mistakes: [
      "Using unsafe-inline everywhere and losing the benefit.",
      "Encoding for HTML when the data goes into JavaScript.",
    ],
    follow: ["What is report-only mode for?"],
    points: [
      "Encode for the output context",
      "CSP restricts script sources",
      "Nonces allow specific inline scripts",
      "Defence in depth",
    ],
    notes: ["Encode first, CSP as a net."],
    src: [
      ["MDN: Content Security Policy (CSP)", `${M}/HTTP/Guides/CSP`],
      [
        "OWASP: Content Security Policy Cheat Sheet",
        `${OW}/Content_Security_Policy_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "csrf-what-and-why",
    topic: "CSRF",
    d: "easy",
    title: "What is CSRF and why does it work?",
    kw: [
      "csrf",
      "cross-site request forgery",
      "cookies",
      "state-changing request",
      "forged request",
    ],
    intent:
      "Checks you understand the attack that exploits automatic cookie sending.",
    short:
      "Cross-site request forgery tricks a logged-in user's browser into sending an unwanted request to your site from another site. It works because browsers attach the user's cookies to requests automatically, including ones triggered by a malicious page, so the server sees a valid session and performs the action, such as changing an email or transferring money. The attacker cannot read the response, but state-changing requests are enough to cause harm. Token-in-header authentication is not affected in the same way because the browser does not add it automatically.",
    detail: [
      "Only requests that change state are interesting to attackers, which is why GET must be safe.",
      "SameSite cookies and anti-CSRF tokens are the main defences.",
      "CORS does not stop simple forged form posts.",
    ],
    ex: "A hidden form on another site posts to `/account/email` and, because the cookie is sent, the email is changed.",
    mistakes: [
      "Changing data with GET requests.",
      "Assuming CORS prevents CSRF.",
    ],
    follow: ["Why does bearer token auth avoid CSRF?"],
    points: [
      "Browser sends cookies automatically",
      "Server cannot tell the request was forged",
      "State-changing endpoints are targets",
      "SameSite and tokens defend",
    ],
    notes: ["Cookies make requests look genuine."],
    src: [
      ["MDN: Cross-site request forgery (CSRF)", `${M}/Security/Attacks/CSRF`],
      [
        "OWASP: CSRF Prevention Cheat Sheet",
        `${OW}/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "csrf-defences",
    topic: "CSRF",
    d: "medium",
    title: "How do you defend against CSRF?",
    kw: [
      "samesite",
      "csrf token",
      "double submit",
      "origin header",
      "safe methods",
    ],
    intent: "Checks you can name layered defences.",
    short:
      "Use several layers. Set session cookies with `SameSite=Lax` or `Strict` so the browser does not send them on cross-site requests. Use anti-CSRF tokens: a random value tied to the session that the server embeds in forms or sends to the app, and requires with every state-changing request. Verify the `Origin` (or `Referer`) header matches your site. Never change state with GET, and require a custom header for API calls, which cross-site forms cannot set without a CORS preflight.",
    detail: [
      "Frameworks often provide CSRF middleware that handles tokens.",
      "SameSite alone is not enough in every case, such as with subdomain attackers, so tokens are still recommended.",
      "XSS defeats CSRF protection, since scripts can read tokens.",
    ],
    ex: "A form includes a hidden token that the server checks; a request without it is rejected with 403.",
    mistakes: [
      "Relying only on SameSite.",
      "Token not tied to the user session.",
    ],
    follow: ["What does SameSite=Lax change?"],
    points: [
      "SameSite cookies",
      "Anti-CSRF tokens",
      "Check Origin",
      "Safe methods must not change state",
    ],
    notes: ["Cookies get SameSite; forms get tokens."],
    src: [
      [
        "OWASP: CSRF Prevention Cheat Sheet",
        `${OW}/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html`,
      ],
      ["MDN: Set-Cookie (SameSite)", `${H}/Set-Cookie`],
    ],
  }),
  q({
    slug: "same-origin-policy",
    topic: "CORS",
    d: "easy",
    title: "What is the same-origin policy?",
    kw: [
      "same-origin policy",
      "origin",
      "scheme host port",
      "browser security",
      "cross-origin",
    ],
    intent: "Checks you know what CORS relaxes.",
    short:
      "The same-origin policy is a browser security rule that restricts how a document or script from one origin can interact with resources from another origin. An origin is the combination of scheme, host and port, so `https://app.example.com` and `https://api.example.com` are different origins, as are `http` and `https` versions. Without it, a malicious page could read your email or bank data from other tabs where you are logged in. Cross-origin reads from scripts are blocked unless the other server opts in with CORS.",
    detail: [
      "Embedding images, scripts and styles across origins is allowed, but reading their content from script is not.",
      "The policy is enforced by the browser, not by servers or other HTTP clients.",
      "It is why a front end on one port cannot call an API on another without CORS headers.",
    ],
    ex: "A React dev server on `localhost:5173` calling an API on `localhost:3000` is cross-origin because the port differs.",
    mistakes: [
      "Thinking different ports are the same origin.",
      "Believing the policy applies to curl or server-to-server calls.",
    ],
    follow: ["Which parts make up an origin?"],
    points: [
      "Origin = scheme + host + port",
      "Blocks cross-origin reads by scripts",
      "Enforced by browsers",
      "CORS is the opt-in",
    ],
    notes: ["Scheme, host, port."],
    src: [["MDN: Same-origin policy", `${M}/Security/Same-origin_policy`]],
  }),
  q({
    slug: "cors-headers-and-preflight",
    topic: "CORS",
    d: "medium",
    title: "How does CORS work, including preflight requests?",
    kw: [
      "cors",
      "access-control-allow-origin",
      "preflight",
      "options request",
      "allowed headers",
    ],
    intent:
      "Checks you can explain the headers and when the browser sends a preflight.",
    short:
      "CORS is an HTTP-header mechanism where a server tells the browser which other origins may read its responses. The server sends `Access-Control-Allow-Origin` with the allowed origin. For requests that could have side effects, such as methods other than simple GET or POST, or those with custom headers like `Authorization` or JSON content type, the browser first sends a preflight `OPTIONS` request asking about the method and headers; the server must answer with `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`. Only if the response allows it does the real request proceed.",
    detail: [
      "Preflight results can be cached with `Access-Control-Max-Age`.",
      "When a response varies by origin, add `Vary: Origin`.",
      "A CORS failure is seen as an error in the browser console, but the server may still have received the request.",
    ],
    ex: "A React app sending JSON with an `Authorization` header triggers a preflight to the API before the real call.",
    code: [
      [
        "Preflight answer",
        "http",
        `Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST, DELETE\nAccess-Control-Allow-Headers: Authorization, Content-Type\nAccess-Control-Max-Age: 600`,
        [
          "The origin must match the page's origin.",
          "Methods and headers list what is allowed.",
          "Max-Age caches the answer.",
        ],
      ],
    ],
    mistakes: [
      "Not handling OPTIONS requests.",
      "Forgetting to allow the Authorization header.",
    ],
    follow: ["Which requests trigger a preflight?"],
    points: [
      "Server opts in with Access-Control-Allow-Origin",
      "Preflight OPTIONS for non-simple requests",
      "Allow-Methods and Allow-Headers",
      "Max-Age caches preflight",
    ],
    notes: ["Browser asks first, then sends."],
    src: [
      ["MDN: Cross-Origin Resource Sharing (CORS)", `${M}/HTTP/Guides/CORS`],
    ],
  }),
  q({
    slug: "cors-credentials-and-wildcards",
    topic: "CORS",
    d: "hard",
    title: "Why can't you use a wildcard origin with credentials?",
    kw: [
      "allow-credentials",
      "wildcard origin",
      "cookies cors",
      "withCredentials",
      "origin allowlist",
    ],
    intent:
      "Checks you understand the credentialed CORS rules and safe configuration.",
    short:
      'By default, cross-origin requests do not send cookies. To send them, the client sets `credentials: "include"` and the server must reply with `Access-Control-Allow-Credentials: true`. In that case the browser rejects a wildcard `Access-Control-Allow-Origin: *`; the server must name the exact origin. That prevents any website from making authenticated requests and reading the results. A safe configuration checks the request\'s `Origin` against an allowlist and echoes it back, adding `Vary: Origin`.',
    detail: [
      "Do not blindly reflect any origin with credentials enabled; that effectively disables protection.",
      "Without credentials, `*` is acceptable for public, non-sensitive APIs.",
      "Cookies still need `SameSite=None; Secure` to be sent cross-site.",
    ],
    ex: "An API accepts credentialed requests only from `https://app.example.com` and `https://admin.example.com`.",
    mistakes: [
      "Reflecting any Origin header with credentials allowed.",
      "Using * and wondering why cookies fail.",
    ],
    follow: ["What cookie attributes are needed for cross-site cookies?"],
    points: [
      "credentials: include on the client",
      "Allow-Credentials: true on the server",
      "No wildcard origin with credentials",
      "Allowlist origins and add Vary: Origin",
    ],
    notes: ["Named origin, never * with credentials."],
    src: [
      ["MDN: CORS (credentialed requests)", `${M}/HTTP/Guides/CORS`],
      ["Express: cors middleware", `${EX}/resources/middleware/cors.html`],
    ],
  }),
  q({
    slug: "cors-is-not-server-security",
    topic: "CORS",
    d: "medium",
    title: "Does CORS protect your API from attackers?",
    kw: [
      "cors misconception",
      "browser enforced",
      "curl bypass",
      "server authorization",
      "api protection",
    ],
    intent: "Checks you do not mistake a browser rule for access control.",
    short:
      "No. CORS is enforced by browsers to control whether a web page's script may read a response from another origin. It does not stop requests from being sent, and tools like curl, Postman or a server-side script ignore it completely. An API that is not authenticated and authorised on the server is open to anyone, whatever its CORS headers say. Use CORS to allow your legitimate front ends, and protect data with authentication, authorization, validation and rate limiting.",
    detail: [
      "A request that fails CORS in the browser may still have been processed by the server.",
      "Simple forged requests (like form posts) can be sent cross-site regardless of CORS, which is why CSRF defences are separate.",
      "Misconfigured CORS can leak data to other sites when credentials are allowed.",
    ],
    ex: "Calling the API from the terminal with curl works even though the browser blocks another website from reading it.",
    mistakes: [
      "Using CORS as the only access control.",
      "Disabling CORS to fix errors without understanding them.",
    ],
    follow: ["What stops unauthorised use of an API instead?"],
    points: [
      "Enforced by browsers only",
      "Does not block requests",
      "Not an authorization mechanism",
      "Protect with server-side auth",
    ],
    notes: ["CORS shapes browsers, not attackers."],
    src: [
      ["MDN: Cross-Origin Resource Sharing (CORS)", `${M}/HTTP/Guides/CORS`],
      [
        "OWASP: REST Security Cheat Sheet",
        `${OW}/REST_Security_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "sql-injection-and-parameterized-queries",
    topic: "Injection",
    d: "easy",
    title: "What is SQL injection and how do you prevent it?",
    kw: [
      "sql injection",
      "parameterized queries",
      "prepared statements",
      "string concatenation",
      "orm",
    ],
    intent:
      "A core security question: checks you never build SQL from raw input.",
    short:
      "SQL injection happens when user input is concatenated into a SQL string, so the input can change the structure of the query, for example `' OR '1'='1`, and read, change or delete data. The primary defence is to use parameterized queries (prepared statements), which send the query text and the values separately so input is always treated as data. ORMs and query builders do this for you when used normally. Add least-privilege database accounts and input validation as extra layers.",
    detail: [
      "Escaping by hand is error-prone; parameters are the reliable fix.",
      "Identifiers such as table or column names cannot be parameterized, so allowlist them.",
      "Stored procedures are safe only if they do not build dynamic SQL from input.",
    ],
    ex: "A login query built with string concatenation lets an attacker log in without a password by closing the quote and adding a condition.",
    code: [
      [
        "Unsafe vs safe",
        "js",
        `// Unsafe: input becomes part of the SQL\ndb.query(\`SELECT * FROM users WHERE email = '\${email}'\`)\n\n// Safe: parameterized\ndb.query("SELECT * FROM users WHERE email = $1", [email])`,
        [
          "The first builds the query from input.",
          "The second sends the value separately as a parameter.",
        ],
      ],
    ],
    mistakes: [
      "Building SQL with template strings.",
      "Using a database account with full privileges.",
    ],
    follow: ["Can you parameterize a table name?"],
    points: [
      "Input changes the query structure",
      "Use parameterized queries",
      "ORMs help if used properly",
      "Least-privilege DB user",
    ],
    notes: ["Never concatenate input into SQL."],
    src: [
      [
        "OWASP: SQL Injection Prevention Cheat Sheet",
        `${OW}/SQL_Injection_Prevention_Cheat_Sheet.html`,
      ],
      [
        "OWASP: Query Parameterization Cheat Sheet",
        `${OW}/Query_Parameterization_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "nosql-injection-mongodb",
    topic: "Injection",
    d: "medium",
    title:
      "What is NoSQL injection and how does it affect Node and MongoDB apps?",
    kw: [
      "nosql injection",
      "mongodb operators",
      "$ne",
      "type validation",
      "query object",
    ],
    intent: "Checks you know injection is not limited to SQL.",
    short:
      'In MongoDB, queries are objects, and if an application passes request data straight into a query, an attacker can send operators instead of values. For example a JSON login body of `{ "email": "a@b.c", "password": { "$ne": null } }` matches any password. Prevent it by validating the shape and type of every field, so a password must be a string, rejecting objects with keys starting with `$`, using a schema validator and the ODM\'s strict schemas, and never building queries from unvalidated input.',
    detail: [
      "Express's JSON and extended query parsing can produce nested objects from user input.",
      "Hash the password and compare in code instead of querying by password.",
      "Never run user input through `$where` or JavaScript evaluation in the database.",
    ],
    ex: "A schema check rejects a login request where `password` is not a string, so the `$ne` trick fails.",
    mistakes: [
      "Passing req.body straight into find().",
      "Allowing operator keys from clients.",
    ],
    follow: ["How does schema validation stop it?"],
    points: [
      "Queries are objects",
      "Attackers send operators like $ne",
      "Validate types and shape",
      "Avoid $where with input",
    ],
    notes: ["Value expected, operator injected."],
    src: [
      [
        "OWASP: NoSQL Security Cheat Sheet",
        `${OW}/NoSQL_Security_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "command-injection-node",
    topic: "Injection",
    d: "medium",
    title: "What is OS command injection and how do you avoid it in Node.js?",
    kw: ["command injection", "child_process", "exec", "execFile", "shell"],
    intent:
      "Checks you know why building shell strings from input is dangerous.",
    short:
      "Command injection occurs when user input is included in a command run by the operating system shell, so characters like `;`, `&&` or backticks let an attacker run extra commands. In Node, `child_process.exec` runs a command string through a shell and is dangerous with input. Prefer built-in libraries over shelling out, and when you must run a program use `execFile` or `spawn` with the arguments as an array and no shell, then validate the arguments against an allowlist.",
    detail: [
      "Escaping shell metacharacters is fragile; avoiding the shell is more reliable.",
      "Run processes with the lowest privileges possible.",
      "Never pass user input to `eval`, `new Function` or `vm` as a way to compute things.",
    ],
    ex: 'An image tool that ran `exec("convert " + filename)` is changed to `execFile("convert", [filename])` with the filename validated.',
    code: [
      [
        "Avoid the shell",
        "js",
        `import { execFile } from "node:child_process"\n\nexecFile("convert", [safeName, "out.png"], (err) => {\n  if (err) console.error(err)\n})`,
        ["Arguments are passed as an array.", "No shell interprets the input."],
      ],
    ],
    mistakes: [
      "Using exec with string concatenation.",
      "Trying to escape instead of avoiding the shell.",
    ],
    follow: ["How does execFile differ from exec?"],
    points: [
      "Shell metacharacters change commands",
      "exec uses a shell",
      "execFile or spawn with an argument array",
      "Allowlist and least privilege",
    ],
    notes: ["No shell, no injection."],
    src: [
      [
        "OWASP: OS Command Injection Defense Cheat Sheet",
        `${OW}/OS_Command_Injection_Defense_Cheat_Sheet.html`,
      ],
      ["Node.js: child_process", "https://nodejs.org/api/child_process.html"],
    ],
  }),
  q({
    slug: "security-headers-overview",
    topic: "Headers",
    d: "medium",
    title: "Which HTTP security headers should a web app set?",
    kw: [
      "security headers",
      "hsts",
      "x-content-type-options",
      "referrer-policy",
      "frame-ancestors",
    ],
    intent: "Checks you know the common response headers and their roles.",
    short:
      "Useful security headers include `Strict-Transport-Security` (HSTS) to force HTTPS, `Content-Security-Policy` to restrict sources of scripts and other content, `X-Content-Type-Options: nosniff` to stop the browser guessing MIME types, `frame-ancestors` in CSP or `X-Frame-Options` to prevent clickjacking, `Referrer-Policy` to limit what is sent in the Referer header, and `Permissions-Policy` to restrict browser features. They are cheap defence-in-depth measures, set in one place such as middleware or the reverse proxy.",
    detail: [
      "Cookies should also carry `HttpOnly`, `Secure` and `SameSite`.",
      "Removing the `X-Powered-By` header avoids announcing the framework.",
      "Test headers with a scanner or browser dev tools.",
    ],
    ex: "An Express app uses Helmet to set a baseline set of headers on every response.",
    mistakes: [
      "Setting HSTS before HTTPS works everywhere.",
      "Thinking headers replace secure code.",
    ],
    follow: ["What does nosniff do?"],
    points: [
      "HSTS",
      "CSP",
      "nosniff",
      "Clickjacking protection and Referrer-Policy",
    ],
    notes: ["Headers are defence in depth."],
    src: [
      ["MDN: Strict-Transport-Security", `${H}/Strict-Transport-Security`],
      ["MDN: X-Content-Type-Options", `${H}/X-Content-Type-Options`],
      [
        "OWASP: HTTP Headers Cheat Sheet",
        `${OW}/HTTP_Headers_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "helmet-in-express",
    topic: "Headers",
    d: "easy",
    title: "What does Helmet do in an Express app?",
    kw: [
      "helmet",
      "express middleware",
      "security headers",
      "x-powered-by",
      "default headers",
    ],
    intent: "Checks you know the standard Express hardening middleware.",
    short:
      "Helmet is Express middleware that sets a collection of security-related HTTP response headers, such as `Content-Security-Policy`, `Strict-Transport-Security` and `X-Content-Type-Options`, to reasonable defaults, helping to protect against some well-known web vulnerabilities. You add it near the top of the middleware chain with `app.use(helmet())`. It also removes the `X-Powered-By` header. It is a baseline, so review and tune the defaults, especially the CSP, for your app.",
    detail: [
      "Individual headers can be configured or turned off.",
      "Express documents Helmet in its production security best practices.",
      "Helmet does not fix vulnerabilities in your own code.",
    ],
    ex: "The API calls `app.use(helmet())` before its routes, and the headers appear on all responses.",
    code: [
      [
        "Add Helmet",
        "js",
        `import express from "express"\nimport helmet from "helmet"\n\nconst app = express()\napp.use(helmet())`,
        [
          "Helmet is registered before the routes.",
          "All responses now carry the default headers.",
        ],
      ],
    ],
    mistakes: [
      "Adding Helmet after the routes.",
      "Never reviewing the CSP it sets.",
    ],
    follow: ["What else would you do for Express security?"],
    points: [
      "Sets security headers",
      "Add early in the chain",
      "Removes X-Powered-By",
      "A baseline, not a cure",
    ],
    notes: ["app.use(helmet())."],
    src: [
      [
        "Express: Production best practices: Security",
        `${EX}/advanced/best-practice-security.html`,
      ],
    ],
  }),
  q({
    slug: "clickjacking-and-frame-protection",
    topic: "Headers",
    d: "medium",
    title: "What is clickjacking and how do you prevent it?",
    kw: [
      "clickjacking",
      "x-frame-options",
      "frame-ancestors",
      "iframe",
      "ui redress",
    ],
    intent: "Checks you know how framing attacks are blocked.",
    short:
      "Clickjacking tricks a user into clicking something on your site that is loaded invisibly inside an iframe on a malicious page, for example a hidden 'Delete account' button under a fake 'Play' button. Prevent it by telling browsers who may frame your pages: the CSP `frame-ancestors` directive, such as `frame-ancestors 'none'` or `'self'`, or the older `X-Frame-Options: DENY` or `SAMEORIGIN` header. Pages that must be embedded should allow only specific trusted origins.",
    detail: [
      "`frame-ancestors` is the modern, more flexible option and takes precedence where supported.",
      "Sensitive pages such as login and payment should never be frameable by others.",
      "JavaScript frame-busting code is unreliable.",
    ],
    ex: "The banking site sends `frame-ancestors 'none'`, so it cannot be embedded in any other page.",
    mistakes: [
      "Relying on JavaScript frame busting.",
      "Leaving sensitive pages frameable.",
    ],
    follow: ["What replaces X-Frame-Options?"],
    points: [
      "Hidden iframe tricks clicks",
      "frame-ancestors in CSP",
      "X-Frame-Options DENY or SAMEORIGIN",
      "Protect sensitive pages",
    ],
    notes: ["Control who can frame you."],
    src: [
      ["MDN: X-Frame-Options", `${H}/X-Frame-Options`],
      ["MDN: Content Security Policy (CSP)", `${M}/HTTP/Guides/CSP`],
    ],
  }),
  q({
    slug: "https-and-hsts",
    topic: "Headers",
    d: "medium",
    title: "Why use HTTPS everywhere and what does HSTS do?",
    kw: ["https", "hsts", "tls", "downgrade attack", "mixed content"],
    intent:
      "Checks you understand transport security and the header that enforces it.",
    short:
      "HTTPS encrypts traffic between browser and server with TLS, providing confidentiality, integrity and server authentication, so passwords, cookies and tokens cannot be read or modified on the network. HSTS, sent as `Strict-Transport-Security: max-age=31536000; includeSubDomains`, tells the browser to use only HTTPS for your site for that period, which prevents downgrade attacks and users typing plain http. Redirect HTTP to HTTPS, mark cookies `Secure`, and avoid mixed content.",
    detail: [
      "Be sure every subdomain supports HTTPS before using `includeSubDomains`.",
      "Free certificates from Let's Encrypt make HTTPS easy for all sites.",
      "The first visit before HSTS is received can still be over HTTP unless the domain is preloaded.",
    ],
    ex: "After deployment the site redirects http to https and sends HSTS with a one-year max-age.",
    mistakes: [
      "Serving login pages over HTTP.",
      "Enabling includeSubDomains without checking subdomains.",
    ],
    follow: ["What does TLS provide?"],
    points: [
      "Encrypts and authenticates",
      "HSTS forces HTTPS",
      "Redirect and Secure cookies",
      "Avoid mixed content",
    ],
    notes: ["HTTPS plus HSTS plus Secure cookies."],
    src: [
      ["MDN: Strict-Transport-Security", `${H}/Strict-Transport-Security`],
      [
        "OWASP: Transport Layer Security Cheat Sheet",
        `${OW}/Transport_Layer_Security_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "rate-limiting-concept",
    topic: "Rate limiting",
    d: "easy",
    title: "What is rate limiting and why is it needed?",
    kw: ["rate limiting", "429", "brute force", "abuse", "throttling"],
    intent: "Checks you know why APIs limit request volume.",
    short:
      "Rate limiting restricts how many requests a client can make in a time window, for example 100 per minute per IP or per API key. It protects against brute-force logins, credential stuffing, scraping and denial-of-service, and keeps one client from using all capacity. When the limit is exceeded the server responds with `429 Too Many Requests`, ideally with a `Retry-After` header telling the client when to try again. Sensitive endpoints such as login and password reset need stricter limits.",
    detail: [
      "Limits can be per IP, user, API key or route.",
      "Return clear errors and consider headers that show the remaining quota.",
      "Combine with other protections, since attackers can use many IPs.",
    ],
    ex: "The login route allows five attempts per minute per account and IP before returning 429.",
    mistakes: [
      "No limit on login or OTP endpoints.",
      "Limits that apply only on the front end.",
    ],
    follow: ["Which header tells the client when to retry?"],
    points: [
      "Cap requests per window",
      "429 Too Many Requests",
      "Retry-After header",
      "Stricter limits on sensitive routes",
    ],
    notes: ["429 plus Retry-After."],
    src: [
      ["MDN: 429 Too Many Requests", `${M}/HTTP/Reference/Status/429`],
      ["MDN: Retry-After", `${H}/Retry-After`],
    ],
  }),
  q({
    slug: "rate-limit-algorithms",
    topic: "Rate limiting",
    d: "hard",
    title:
      "How do fixed window, sliding window and token bucket rate limiting differ?",
    kw: [
      "fixed window",
      "sliding window",
      "token bucket",
      "burst",
      "rate limit algorithm",
    ],
    intent: "Checks you know the common algorithms and their trade-offs.",
    short:
      "A fixed window counter allows N requests per window, such as per minute, and resets at the boundary; it is simple but allows a burst of up to twice the limit around the boundary. A sliding window counts requests over the last period continuously, which is smoother but needs more state. A token bucket adds tokens at a steady rate up to a capacity and spends one per request, which allows short bursts while enforcing an average rate. The choice depends on how strictly you need to control bursts.",
    detail: [
      "A leaky bucket smooths requests to a constant outflow.",
      "Distributed servers need a shared counter store, such as Redis, so limits apply globally.",
      "Increment and expire counters atomically to avoid races.",
    ],
    ex: "An API uses a token bucket so clients can burst briefly but cannot exceed an average of ten requests per second.",
    mistakes: [
      "In-memory counters on each of several servers, so the real limit is multiplied.",
      "Ignoring boundary bursts with fixed windows.",
    ],
    follow: ["Why use Redis for rate limiting?"],
    points: [
      "Fixed window: simple, boundary bursts",
      "Sliding window: smoother",
      "Token bucket: bursts with an average limit",
      "Shared store for multiple servers",
    ],
    notes: ["Pick by burst tolerance."],
    src: [
      [
        "Microsoft Learn: Rate Limiting pattern",
        "https://learn.microsoft.com/en-us/azure/architecture/patterns/rate-limiting-pattern",
      ],
    ],
  }),
  q({
    slug: "rate-limit-express-behind-proxy",
    topic: "Rate limiting",
    d: "medium",
    title:
      "What must you configure to rate limit by IP behind a proxy in Express?",
    kw: [
      "trust proxy",
      "x-forwarded-for",
      "req.ip",
      "reverse proxy",
      "client ip",
    ],
    intent:
      "Checks you know why IP-based limits can silently break behind nginx or a load balancer.",
    short:
      'Behind a reverse proxy or load balancer, the TCP connection comes from the proxy, so `req.ip` would be the proxy\'s address and every user would share one limit. The proxy passes the real client IP in `X-Forwarded-For`. In Express, set `app.set("trust proxy", n)` to the correct number of trusted proxy hops so `req.ip` reads the right entry; trusting too much lets clients spoof the header and evade limits. Then use a rate limit middleware keyed on that IP, and a shared store if you run several instances.',
    detail: [
      "Set `trust proxy` to the exact topology, not simply `true` on the open internet.",
      "Also key limits on the authenticated user or account where possible.",
      "The same applies to secure cookies, which need to know the original protocol.",
    ],
    ex: "An app behind nginx sets `trust proxy` to 1 so each visitor's IP is counted separately.",
    code: [
      [
        "Trust one proxy",
        "js",
        `const app = express()\napp.set("trust proxy", 1) // one reverse proxy in front\n\napp.get("/ip", (req, res) => res.send(req.ip))`,
        [
          "`req.ip` now reflects the client address from X-Forwarded-For.",
          "Only the first hop is trusted.",
        ],
      ],
    ],
    mistakes: [
      "Leaving trust proxy unset behind nginx.",
      "Setting it to true so clients can spoof their IP.",
    ],
    follow: ["What header carries the client IP?"],
    points: [
      "Proxy hides client IP",
      "X-Forwarded-For carries it",
      "Set trust proxy to the right number of hops",
      "Do not over-trust",
    ],
    notes: ["Trust exactly the proxies you run."],
    src: [
      ["Express: Behind proxies", `${EX}/guide/behind-proxies.html`],
      [
        "Express: Production best practices: Security",
        `${EX}/advanced/best-practice-security.html`,
      ],
    ],
  }),
  q({
    slug: "server-side-input-validation",
    topic: "Input validation",
    d: "easy",
    title:
      "Why validate input on the server, and what does good validation look like?",
    kw: [
      "input validation",
      "allowlist",
      "server-side validation",
      "schema",
      "untrusted input",
    ],
    intent: "Checks you treat all input as untrusted.",
    short:
      "Client-side validation is a convenience, because anyone can bypass the browser and send raw requests, so the server must validate every input. Good validation is allowlist-based: define what is acceptable, including type, length, range and format, and reject everything else. Validate query strings, headers, JSON bodies, path parameters and files. Use a schema validator for structure, reject unknown fields, and return a clear 400 or 422 with details. Validation complements, but never replaces, output encoding and parameterized queries.",
    detail: [
      "Validate early, before using data, and normalise values such as case and whitespace first.",
      "Check business rules too, such as stock available or date ranges.",
      "Keep error messages helpful without leaking internals.",
    ],
    ex: "A create-user endpoint accepts only a valid email, a name up to 100 characters and a role from a fixed list.",
    mistakes: [
      "Trusting the front-end form.",
      "Blocklisting known bad strings.",
    ],
    follow: ["What status code do you return for invalid input?"],
    points: [
      "Server must validate",
      "Allowlist type, length, range, format",
      "Reject unknown fields",
      "Complements encoding and parameters",
    ],
    notes: ["Never trust the client."],
    src: [
      [
        "OWASP: Input Validation Cheat Sheet",
        `${OW}/Input_Validation_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "validation-with-schema-in-express",
    topic: "Input validation",
    d: "medium",
    title:
      "How do you validate request bodies in Express with a schema library?",
    kw: [
      "zod",
      "schema validation",
      "middleware",
      "safeParse",
      "400 bad request",
    ],
    intent: "Checks you can build reusable validation middleware.",
    short:
      "Create middleware that takes a schema, validates `req.body` (and optionally params and query) against it, responds with 400 and the list of issues on failure, and otherwise replaces the request data with the parsed, typed result and calls `next()`. Libraries like Zod or Joi provide the schema language. Use strict object schemas that reject unknown keys to avoid mass assignment, and keep the schemas in one place so they can also be shared with the client.",
    detail: [
      "Use the parsed output, not the raw body, in the handler.",
      "Coerce types explicitly for query strings, which are always strings.",
      "Do not return full internal error objects to the client.",
    ],
    ex: "A `validate(createUserSchema)` middleware sits before the create-user handler.",
    code: [
      [
        "Validation middleware",
        "js",
        `const validate = (schema) => (req, res, next) => {\n  const result = schema.safeParse(req.body)\n  if (!result.success) {\n    return res.status(400).json({ errors: result.error.issues })\n  }\n  req.body = result.data\n  next()\n}\n\nrouter.post("/users", validate(createUserSchema), createUser)`,
        [
          "`safeParse` returns a result without throwing.",
          "Failures return 400 with issues.",
          "The handler receives the parsed data.",
        ],
      ],
    ],
    mistakes: [
      "Using the raw body after validation.",
      "Letting unknown fields through.",
    ],
    follow: ["What is mass assignment?"],
    points: [
      "Validation middleware per route",
      "400 with issues on failure",
      "Use parsed output",
      "Strict schemas reject extras",
    ],
    notes: ["Validate, replace, next."],
    src: [
      ["Express: Using middleware", `${EX}/guide/using-middleware.html`],
      [
        "OWASP: Input Validation Cheat Sheet",
        `${OW}/Input_Validation_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "mass-assignment",
    topic: "Input validation",
    d: "hard",
    title: "What is mass assignment and how do you prevent it?",
    kw: [
      "mass assignment",
      "over-posting",
      "allowlist fields",
      "req.body",
      "privilege escalation",
    ],
    intent:
      "Checks you know the danger of binding whole request objects to models.",
    short:
      'Mass assignment happens when an application copies all properties from the request body into a database model, such as `User.create(req.body)` or `Object.assign(user, req.body)`, so an attacker adds fields like `isAdmin: true` or `role: "admin"` that the form never offered. Prevent it by explicitly picking the allowed fields, using a strict schema that rejects unknown keys, and keeping sensitive fields such as roles and ownership under server control.',
    detail: [
      "Separate input types (DTOs) from database models.",
      "The same applies to updates, not only creation.",
      "Tests should try to send extra fields.",
    ],
    ex: "A profile update endpoint accepts only `name` and `bio`, ignoring any other properties the client sends.",
    code: [
      [
        "Pick allowed fields",
        "js",
        `const { name, bio } = req.body\nawait User.updateOne({ _id: req.user.id }, { name, bio })`,
        [
          "Only two named fields are used.",
          "Extra fields such as `role` are ignored.",
        ],
      ],
    ],
    mistakes: [
      "Passing req.body straight into create or update.",
      "Trusting a client to omit privileged fields.",
    ],
    follow: ["How does a strict schema help?"],
    points: [
      "Whole-body binding is dangerous",
      "Attackers add privileged fields",
      "Allowlist the fields",
      "Server controls roles and ownership",
    ],
    notes: ["Pick fields; never spread the body."],
    src: [
      [
        "OWASP: Input Validation Cheat Sheet",
        `${OW}/Input_Validation_Cheat_Sheet.html`,
      ],
      ["OWASP: web application risk categories", "https://owasp.org/Top10/"],
    ],
  }),
  q({
    slug: "secure-file-uploads",
    topic: "Input validation",
    d: "hard",
    title: "How do you handle file uploads securely?",
    kw: [
      "file upload",
      "mime type",
      "file size limit",
      "storage outside web root",
      "malware",
    ],
    intent: "Checks you can name the main risks and controls of uploads.",
    short:
      "Treat uploaded files as untrusted. Limit the size and number of files, allow only the file types you need and verify the real content type rather than trusting the extension or the client's `Content-Type`, and generate your own random file names instead of using the supplied name, which can contain path tricks. Store files outside the web root or in object storage, serve them with correct and safe headers (and `nosniff`), never execute them, and scan for malware where appropriate. Restrict who can upload and view files.",
    detail: [
      "Images may be re-encoded to strip embedded content.",
      "Serve user-uploaded files from a separate domain when possible to isolate scripts.",
      "Use pre-signed URLs to let clients upload directly to storage with limits.",
    ],
    ex: "An avatar upload accepts only PNG or JPEG up to 2 MB, renames the file to a random id and stores it in object storage.",
    mistakes: [
      "Trusting the file extension.",
      "Saving files with user-supplied names in a public folder.",
    ],
    follow: ["Why use random file names?"],
    points: [
      "Limit size and type",
      "Verify actual content",
      "Random names, store outside web root",
      "Never execute uploads",
    ],
    notes: ["Uploads are untrusted input."],
    src: [
      [
        "OWASP: Input Validation Cheat Sheet",
        `${OW}/Input_Validation_Cheat_Sheet.html`,
      ],
      ["MDN: X-Content-Type-Options", `${H}/X-Content-Type-Options`],
    ],
  }),
  q({
    slug: "secrets-and-dependency-security",
    topic: "Input validation",
    d: "medium",
    title: "How do you protect secrets and dependencies in a Node.js project?",
    kw: [
      "secrets management",
      "environment variables",
      "npm audit",
      "dependency vulnerabilities",
      ".env",
    ],
    intent: "Checks you cover the supply side of web security.",
    short:
      "Keep secrets such as API keys, database passwords and signing keys out of source control; load them from environment variables or a secrets manager, never commit `.env` files, and rotate any secret that leaks. Restrict each key to the least privilege it needs. For dependencies, keep them updated, review what you add, commit the lockfile, and run `npm audit` or an equivalent scanner regularly, since a vulnerable package is as dangerous as a bug in your own code.",
    detail: [
      "Different secrets for development, staging and production.",
      "Do not log secrets or return them in API responses.",
      "Automated dependency update tools help keep versions current.",
    ],
    ex: "A leaked database password found in a commit is rotated immediately and the history is cleaned up.",
    mistakes: ["Committing .env files.", "Ignoring audit warnings for months."],
    follow: ["What should you do if a secret is committed?"],
    points: [
      "Secrets outside the repo",
      "Rotate leaks",
      "Least privilege keys",
      "Audit and update dependencies",
    ],
    notes: ["Secrets out of git, deps kept current."],
    src: [
      [
        "Express: Production best practices: Security",
        `${EX}/advanced/best-practice-security.html`,
      ],
      [
        "OWASP: Secrets Management Cheat Sheet",
        `${OW}/Secrets_Management_Cheat_Sheet.html`,
      ],
    ],
  }),
  q({
    slug: "error-handling-and-info-leaks",
    topic: "Headers",
    d: "medium",
    title:
      "How should a production app handle errors without leaking information?",
    kw: [
      "error handling",
      "stack trace",
      "information disclosure",
      "NODE_ENV production",
      "generic error",
    ],
    intent: "Checks you avoid exposing internals to attackers.",
    short:
      "Detailed errors help attackers learn about your stack, file paths and queries. In production, return a generic message and an error id to the client, such as `500 Something went wrong`, while logging the full error with its stack trace on the server. Do not return database errors, stack traces or framework versions. In Express, define a central error-handling middleware, and set `NODE_ENV=production` so Express does not show stack traces to users.",
    detail: [
      "Log with enough context to debug, but do not log passwords, tokens or personal data.",
      "Use consistent error responses with a stable shape.",
      "Disable the `X-Powered-By` header to avoid advertising the framework.",
    ],
    ex: 'An unexpected failure returns `{ "error": "Internal error", "id": "a1b2" }` and the stack goes to the logs under that id.',
    mistakes: [
      "Sending err.stack to the browser.",
      "Different messages that reveal whether an account exists.",
    ],
    follow: ["Why include an error id?"],
    points: [
      "Generic message to clients",
      "Full details in server logs",
      "Central error middleware",
      "NODE_ENV=production",
    ],
    notes: ["Tell the user little, log a lot."],
    src: [
      ["Express: Error handling", `${EX}/guide/error-handling.html`],
      [
        "OWASP: Error Handling Cheat Sheet",
        `${OW}/Error_Handling_Cheat_Sheet.html`,
      ],
    ],
  }),
])
