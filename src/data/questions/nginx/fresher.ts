import { defineQuestions } from "../author"
import { q } from "../compact"

const N = "https://nginx.org/en/docs"
const NH = `${N}/http`
const LE = "https://letsencrypt.org"

export default defineQuestions("nginx", "fresher", [
  q({
    slug: "what-is-nginx",
    topic: "Reverse proxy",
    d: "easy",
    title: "What is nginx and what is it used for?",
    kw: [
      "nginx",
      "web server",
      "reverse proxy",
      "load balancer",
      "static files",
    ],
    intent: "A foundation question: checks you know nginx's main roles.",
    short:
      "Nginx is a high-performance web server that is also commonly used as a reverse proxy, load balancer, HTTP cache and TLS terminator. It serves static files efficiently, forwards requests to application servers such as a Node.js or Java service, and handles HTTPS in front of them. It uses an event-driven design with a master process and worker processes, so a few workers can handle many connections.",
    detail: [
      "A typical setup puts nginx in front of the app so the app does not face the internet directly.",
      "Configuration is a text file of directives grouped in blocks.",
      "It can also compress responses, limit request rates and redirect URLs.",
    ],
    ex: "A server runs nginx on ports 80 and 443; it serves the React build files and proxies `/api` requests to a Node service on port 3000.",
    mistakes: [
      "Exposing the app server directly to the internet.",
      "Thinking nginx runs the application code.",
    ],
    follow: ["What does a reverse proxy do?"],
    points: [
      "Web server and reverse proxy",
      "Load balancing, caching, TLS termination",
      "Event-driven master and workers",
      "Fronts the application",
    ],
    notes: ["The front door of your servers."],
    src: [
      ["nginx: Beginner's guide", `${N}/beginners_guide.html`],
      ["nginx documentation", `${N}/`],
    ],
  }),
  q({
    slug: "forward-vs-reverse-proxy",
    topic: "Reverse proxy",
    d: "easy",
    title:
      "What is the difference between a forward proxy and a reverse proxy?",
    kw: [
      "forward proxy",
      "reverse proxy",
      "client side",
      "server side",
      "gateway",
    ],
    intent: "Checks you know which side each proxy represents.",
    short:
      "A forward proxy sits in front of clients and makes requests to the internet on their behalf, for example a company proxy that filters or caches outbound traffic. A reverse proxy sits in front of servers: clients talk to it as if it were the real server, and it forwards the requests to one or more backend servers and returns their responses. A reverse proxy hides the backend, can balance load, terminate TLS, cache responses and add security controls.",
    detail: [
      "Clients usually do not know a reverse proxy exists.",
      "Backends can be added, removed or moved without clients noticing.",
      "Nginx is most often used as a reverse proxy.",
    ],
    ex: "Users visit `example.com`; nginx receives the request and forwards it to an internal app on a private address.",
    mistakes: [
      "Mixing up which side the proxy protects.",
      "Exposing backend ports in addition to the proxy.",
    ],
    follow: ["Name two benefits of a reverse proxy."],
    points: [
      "Forward: represents clients",
      "Reverse: represents servers",
      "Reverse proxy hides and balances backends",
      "Can terminate TLS and cache",
    ],
    notes: ["Reverse proxy = in front of the servers."],
    src: [
      ["nginx: Beginner's guide (proxy server)", `${N}/beginners_guide.html`],
      ["nginx: proxy module", `${NH}/ngx_http_proxy_module.html`],
    ],
  }),
  q({
    slug: "nginx-config-structure",
    topic: "Reverse proxy",
    d: "easy",
    title: "How is an nginx configuration structured?",
    kw: [
      "nginx.conf",
      "directives",
      "contexts",
      "server block",
      "location block",
    ],
    intent: "Checks you can read a basic nginx config.",
    short:
      "The configuration is made of directives, which are simple (a name, parameters and a semicolon) or block directives that contain others in braces. Blocks form contexts: the main context, then `events`, then `http`, which contains `server` blocks for each virtual host (matched by `listen` and `server_name`), which contain `location` blocks matched against the request URI. Directives are inherited from outer to inner contexts unless overridden. The main file is usually `/etc/nginx/nginx.conf`, which includes other files.",
    detail: [
      "A missing semicolon is a common syntax error.",
      "Check the file with `nginx -t` before reloading.",
      "Reload without dropping connections with `nginx -s reload`.",
    ],
    ex: "One `server` block serves `example.com` and another serves `api.example.com`, each with their own locations.",
    code: [
      [
        "Minimal server",
        "nginx",
        `server {\n    listen 80;\n    server_name example.com;\n\n    location / {\n        root /var/www/html;\n        index index.html;\n    }\n}`,
        [
          "`listen` and `server_name` choose the server.",
          "`location /` handles requests for the path.",
          "`root` says where files are.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting semicolons.",
      "Reloading without testing the config.",
    ],
    follow: ["How do you test a config safely?"],
    points: [
      "Directives and blocks",
      "http > server > location",
      "Inheritance of directives",
      "Test with nginx -t, then reload",
    ],
    notes: ["nginx -t before reload."],
    src: [
      ["nginx: Beginner's guide", `${N}/beginners_guide.html`],
      ["nginx: Controlling nginx", `${N}/control.html`],
    ],
  }),
  q({
    slug: "proxy-pass-reverse-proxy-config",
    topic: "Reverse proxy",
    d: "medium",
    title: "How do you configure nginx as a reverse proxy to a Node.js app?",
    kw: [
      "proxy_pass",
      "proxy_set_header",
      "x-forwarded-for",
      "host header",
      "upstream app",
    ],
    intent:
      "Checks you can write the standard proxy block with correct headers.",
    short:
      'Use a `location` block with `proxy_pass` pointing to the backend, for example `proxy_pass http://127.0.0.1:3000;`. By default nginx changes the `Host` header to the proxied address and hides the client\'s IP, so set headers the app needs: `proxy_set_header Host $host;`, `X-Real-IP $remote_addr`, `X-Forwarded-For $proxy_add_x_forwarded_for` and `X-Forwarded-Proto $scheme`. The application should then trust the proxy, for example `app.set("trust proxy", 1)` in Express, to see the real client IP and the original protocol.',
    detail: [
      "`proxy_read_timeout` defaults to 60 seconds, after which a silent backend connection is closed.",
      "Bind the app to localhost or a private network so it is reachable only through nginx.",
      "Proxy only the paths that belong to the app, such as `/api`.",
    ],
    ex: "`example.com/api/` is proxied to a Node service on port 3000 and the app sees the real client address.",
    code: [
      [
        "Proxy to Node",
        "nginx",
        `location /api/ {\n    proxy_pass http://127.0.0.1:3000;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto $scheme;\n}`,
        [
          "`proxy_pass` forwards the request.",
          "The headers pass the client's details to the app.",
        ],
      ],
    ],
    mistakes: [
      "Not forwarding the client IP, so logs and rate limits see only 127.0.0.1.",
      "Leaving the app port open to the internet.",
    ],
    follow: ["Why set X-Forwarded-Proto?"],
    points: [
      "proxy_pass to the backend",
      "Set Host and X-Forwarded-* headers",
      "App must trust the proxy",
      "Keep the app on a private address",
    ],
    notes: ["proxy_pass plus forwarded headers."],
    src: [["nginx: ngx_http_proxy_module", `${NH}/ngx_http_proxy_module.html`]],
  }),
  q({
    slug: "location-matching-order",
    topic: "Reverse proxy",
    d: "hard",
    title: "How does nginx choose which location block handles a request?",
    kw: [
      "location matching",
      "exact match",
      "prefix location",
      "regex location",
      "^~",
    ],
    intent:
      "Checks you understand the precedence rules, a common source of config bugs.",
    short:
      "Nginx first checks prefix locations and remembers the one with the longest matching prefix; an exact match `= /path` ends the search immediately. If the longest prefix has the `^~` modifier, regular expressions are skipped. Otherwise regex locations (`~` case-sensitive and `~*` case-insensitive) are checked in the order they appear in the file, and the first match wins; if none match, the remembered prefix location is used. So order matters for regexes, but not for plain prefixes.",
    detail: [
      "Matching is done against the normalised URI.",
      "Named locations like `@fallback` are for internal redirects.",
      "Use `nginx -T` or test requests with curl to confirm which block responds.",
    ],
    ex: "`location ^~ /static/` ensures that static files are not caught by a broad regex such as `~ \\.php$`.",
    code: [
      [
        "Precedence examples",
        "nginx",
        `location = /health { return 200 "ok"; }   # exact\nlocation ^~ /static/ { root /var/www; }    # prefix, skips regex\nlocation ~* \\.(png|jpg)$ { expires 30d; }   # regex\nlocation / { proxy_pass http://app; }       # fallback prefix`,
        [
          "Exact matches win at once.",
          "`^~` prefers the prefix over regexes.",
          "`/` catches anything else.",
        ],
      ],
    ],
    mistakes: [
      "Assuming the first listed block wins for prefixes.",
      "Regex locations that unexpectedly catch API paths.",
    ],
    follow: ["What does the ^~ modifier do?"],
    points: [
      "= exact first",
      "Longest prefix is remembered",
      "^~ skips regex",
      "Regexes checked in file order",
    ],
    notes: ["Exact, longest prefix, then regex."],
    src: [
      ["nginx: location directive", `${NH}/ngx_http_core_module.html#location`],
      ["nginx: How nginx processes a request", `${NH}/request_processing.html`],
    ],
  }),
  q({
    slug: "serve-spa-with-try-files",
    topic: "Reverse proxy",
    d: "medium",
    title:
      "How do you serve a single-page app with nginx so refreshes on client routes work?",
    kw: [
      "try_files",
      "spa fallback",
      "index.html",
      "client-side routing",
      "static hosting",
    ],
    intent: "Checks you can avoid 404s on deep links in a React app.",
    short:
      "Serve the build output with `root` and add `try_files $uri $uri/ /index.html;` in the main location. Nginx then checks whether the requested file exists, and if not, serves `index.html`, so the browser loads the app and the client-side router handles the path. Without this fallback, refreshing `/products/42` makes nginx look for that file, find nothing and return 404. API routes are proxied separately so they do not fall back to the HTML.",
    detail: [
      "`try_files` checks files in order and uses the last parameter as the fallback.",
      "Hashed assets can have long cache headers while `index.html` is not cached.",
      "Missing static files, such as images, should still return 404 rather than HTML.",
    ],
    ex: "The site serves `/usr/share/nginx/html` and refreshing any app route still shows the app.",
    code: [
      [
        "SPA fallback",
        "nginx",
        `server {\n    listen 80;\n    root /usr/share/nginx/html;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    location /api/ {\n        proxy_pass http://127.0.0.1:3000;\n    }\n}`,
        [
          "Unknown paths fall back to `index.html`.",
          "`/api/` is proxied, not served from files.",
        ],
      ],
    ],
    mistakes: [
      "No fallback, so deep links 404.",
      "Falling back to index.html for API or asset paths.",
    ],
    follow: ["Why is index.html not cached for long?"],
    points: [
      "try_files with index.html fallback",
      "Router takes over in the browser",
      "Proxy the API separately",
      "Cache hashed assets, not the HTML",
    ],
    notes: ["Unknown path goes to index.html."],
    src: [["nginx: try_files", `${NH}/ngx_http_core_module.html#try_files`]],
  }),
  q({
    slug: "nginx-502-504-troubleshooting",
    topic: "Reverse proxy",
    d: "medium",
    title:
      "What do 502 and 504 errors from nginx mean and how do you troubleshoot them?",
    kw: [
      "502 bad gateway",
      "504 gateway timeout",
      "upstream",
      "error log",
      "proxy timeout",
    ],
    intent: "Checks you can diagnose proxy errors.",
    short:
      "A 502 Bad Gateway means nginx, acting as a proxy, got an invalid response or could not connect to the backend, for example because the app is down, crashed or listening on a different port. A 504 Gateway Timeout means the backend did not respond in time; the default `proxy_read_timeout` is 60 seconds. Check that the app is running and reachable from the server with curl, verify the `proxy_pass` address and port, and read the nginx error log (`/var/log/nginx/error.log`), which states the cause.",
    detail: [
      "Slow queries or an overloaded backend usually cause 504.",
      "A SELinux or firewall rule can block the connection to the backend.",
      "Fix the cause in the app; raising timeouts only hides slowness.",
    ],
    ex: "After a deploy the Node process crashed on start; nginx returned 502 until the app was fixed and restarted.",
    mistakes: [
      "Restarting nginx when the backend is the problem.",
      "Only increasing timeouts.",
    ],
    follow: ["Where does nginx log errors?"],
    points: [
      "502 = bad or no backend response",
      "504 = backend too slow",
      "Check the app and port",
      "Read error.log",
    ],
    notes: ["502 down, 504 slow."],
    src: [
      [
        "nginx: proxy_read_timeout",
        `${NH}/ngx_http_proxy_module.html#proxy_read_timeout`,
      ],
      ["nginx: error_log and logging", `${N}/ngx_core_module.html`],
    ],
  }),
  q({
    slug: "nginx-websocket-proxy",
    topic: "Reverse proxy",
    d: "hard",
    title: "How do you proxy WebSocket connections through nginx?",
    kw: [
      "websocket proxy",
      "upgrade header",
      "proxy_http_version",
      "connection upgrade",
      "socket.io",
    ],
    intent: "Checks you know why WebSockets need extra headers.",
    short:
      'A WebSocket starts as an HTTP request asking to upgrade the connection, and nginx treats `Upgrade` and `Connection` as hop-by-hop headers that are not passed to the backend by default. To proxy WebSockets, use HTTP/1.1 to the backend and pass them explicitly: `proxy_http_version 1.1;`, `proxy_set_header Upgrade $http_upgrade;` and `proxy_set_header Connection "upgrade";`. Also consider a longer `proxy_read_timeout`, since idle connections are closed after the timeout unless the app sends pings.',
    detail: [
      "Libraries like Socket.IO need sticky sessions when several backend instances run without a shared adapter.",
      "Use `wss://` (TLS) at the public edge.",
      "The same location may need a different timeout than ordinary API routes.",
    ],
    ex: "A chat app's `/socket.io/` path is proxied with the upgrade headers.",
    code: [
      [
        "WebSocket proxy",
        "nginx",
        `location /ws/ {\n    proxy_pass http://127.0.0.1:3000;\n    proxy_http_version 1.1;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection "upgrade";\n    proxy_read_timeout 300s;\n}`,
        [
          "HTTP/1.1 and the upgrade headers allow the handshake.",
          "A longer read timeout keeps idle sockets alive.",
        ],
      ],
    ],
    mistakes: [
      "Omitting the upgrade headers so the handshake fails.",
      "Leaving the default timeout, so idle connections drop.",
    ],
    follow: ["Why must HTTP/1.1 be used to the backend?"],
    points: [
      "Upgrade and Connection headers",
      "proxy_http_version 1.1",
      "Longer read timeout",
      "Sticky sessions for multi-instance Socket.IO",
    ],
    notes: ["Pass the upgrade explicitly."],
    src: [["nginx: WebSocket proxying", `${NH}/websocket.html`]],
  }),
  q({
    slug: "nginx-upstream-load-balancing-basics",
    topic: "Load balancing",
    d: "easy",
    title: "How does nginx load balance requests across several app servers?",
    kw: [
      "upstream",
      "load balancing",
      "round robin",
      "backend servers",
      "scalability",
    ],
    intent: "Checks you can set up the basic upstream block.",
    short:
      "Define an `upstream` block that lists the backend servers, then point `proxy_pass` at the upstream name. By default nginx distributes requests among the servers in round-robin order, so each server gets requests in turn. This spreads load across several instances, so the app can handle more traffic and one instance can be taken out for maintenance without downtime. Servers can be given weights to receive proportionally more requests.",
    detail: [
      "Each backend needs the same code and access to the same shared data.",
      "Session state should be kept in a shared store rather than server memory.",
      "A server that fails is temporarily skipped.",
    ],
    ex: "Three Node instances on ports 3001 to 3003 share traffic behind one nginx.",
    code: [
      [
        "Upstream group",
        "nginx",
        `upstream api {\n    server 127.0.0.1:3001;\n    server 127.0.0.1:3002;\n    server 127.0.0.1:3003 weight=2;\n}\n\nserver {\n    listen 80;\n    location /api/ { proxy_pass http://api; }\n}`,
        [
          "The upstream lists the instances.",
          "`weight=2` sends that server twice the traffic.",
          "`proxy_pass` uses the group name.",
        ],
      ],
    ],
    mistakes: [
      "Keeping sessions in each server's memory.",
      "Different code versions on different instances.",
    ],
    follow: ["What is the default balancing method?"],
    points: [
      "upstream block lists servers",
      "Default is round-robin",
      "Weights adjust share",
      "State must be shared",
    ],
    notes: ["Upstream group, then proxy_pass."],
    src: [
      ["nginx: Using nginx as HTTP load balancer", `${NH}/load_balancing.html`],
      [
        "nginx: ngx_http_upstream_module",
        `${NH}/ngx_http_upstream_module.html`,
      ],
    ],
  }),
  q({
    slug: "nginx-balancing-methods",
    topic: "Load balancing",
    d: "medium",
    title:
      "What load balancing methods does nginx offer and when would you use each?",
    kw: ["round robin", "least_conn", "ip_hash", "weighted", "sticky sessions"],
    intent: "Checks you can pick a method for the workload.",
    short:
      "Round-robin, the default, distributes requests evenly in turn and suits similar requests. `least_conn` sends the next request to the server with the fewest active connections, which helps when requests take very different times. `ip_hash` picks the server from a hash of the client's IP address, so the same client generally reaches the same server, which provides simple session persistence when state is kept in server memory. Weights adjust any method to favour stronger servers.",
    detail: [
      "`ip_hash` can be uneven when many clients share one IP, such as behind a corporate NAT.",
      "Prefer storing sessions in a shared store so any server can handle any request.",
      "Other methods, such as hash on a key, exist.",
    ],
    ex: "A service with some slow report requests uses `least_conn` so long requests do not pile up on one instance.",
    mistakes: [
      "ip_hash as a substitute for proper shared session storage.",
      "Round-robin with very uneven request durations.",
    ],
    follow: ["What is a problem with ip_hash?"],
    points: [
      "Round-robin default",
      "least_conn for uneven requests",
      "ip_hash for persistence",
      "Weights adjust share",
    ],
    notes: ["Match the method to the workload."],
    src: [
      ["nginx: Using nginx as HTTP load balancer", `${NH}/load_balancing.html`],
    ],
  }),
  q({
    slug: "nginx-passive-health-checks",
    topic: "Load balancing",
    d: "medium",
    title: "How does nginx handle a failed backend server?",
    kw: [
      "max_fails",
      "fail_timeout",
      "passive health check",
      "backup server",
      "failover",
    ],
    intent: "Checks you know the built-in failure detection and its limits.",
    short:
      "Nginx performs passive (in-band) health checks: if communication with a server fails, it counts the failure, and after `max_fails` consecutive failures within `fail_timeout` it marks that server unavailable for a while and sends traffic to the others. A server can be marked `backup` so it is used only when the primary servers are unavailable, and `down` to take one out manually. Active health checks that probe servers periodically are part of the commercial version, so applications should also expose health endpoints for external monitoring.",
    detail: [
      "A failed request may be retried on another server according to `proxy_next_upstream`.",
      "Be careful retrying non-idempotent requests such as POST.",
      "Monitoring and alerting still matter, since nginx only reacts to traffic it sees.",
    ],
    ex: "One of three instances crashes; nginx stops sending requests to it until it recovers.",
    mistakes: [
      "Assuming nginx actively probes backends in the open-source version.",
      "Retrying payments automatically.",
    ],
    follow: ["What is a backup server?"],
    points: [
      "Passive checks on real traffic",
      "max_fails and fail_timeout",
      "backup and down parameters",
      "Active probing is commercial",
    ],
    notes: ["Passive health checks only."],
    src: [
      [
        "nginx: Using nginx as HTTP load balancer (health checks)",
        `${NH}/load_balancing.html`,
      ],
      [
        "nginx: ngx_http_upstream_module",
        `${NH}/ngx_http_upstream_module.html`,
      ],
    ],
  }),
  q({
    slug: "stateless-apps-behind-load-balancer",
    topic: "Load balancing",
    d: "medium",
    title: "What must an application do to work well behind a load balancer?",
    kw: [
      "stateless",
      "shared session store",
      "sticky sessions",
      "horizontal scaling",
      "file uploads",
    ],
    intent: "Checks you understand why instances must be interchangeable.",
    short:
      "Any instance should be able to serve any request, so the application keeps no important state in its own memory or disk. Store sessions in a shared store such as Redis or use tokens, keep uploaded files in shared or object storage, run scheduled jobs on only one instance or a separate worker, and put configuration in the environment. Then instances can be added, removed or replaced freely. Sticky sessions are a fallback when state cannot be shared, but they make balancing uneven and failures more disruptive.",
    detail: [
      "Logs should go to stdout or a central system, not local files on one instance.",
      "Database connection pools should be sized for the number of instances.",
      "Deploy instances one by one to avoid downtime.",
    ],
    ex: "After moving sessions from memory to Redis, users stay logged in whichever instance answers.",
    mistakes: [
      "Local file storage for uploads.",
      "Cron jobs running on every instance.",
    ],
    follow: ["When would you use sticky sessions?"],
    points: [
      "Interchangeable instances",
      "Shared session and file storage",
      "One instance for scheduled jobs",
      "Sticky sessions as a last resort",
    ],
    notes: ["Stateless instances scale."],
    src: [
      [
        "nginx: Using nginx as HTTP load balancer (session persistence)",
        `${NH}/load_balancing.html`,
      ],
    ],
  }),
  q({
    slug: "nginx-rate-limiting",
    topic: "Load balancing",
    d: "hard",
    title: "How do you rate limit requests in nginx?",
    kw: ["limit_req", "limit_req_zone", "burst", "rate limiting", "429"],
    intent: "Checks you can protect endpoints at the proxy.",
    short:
      "Define a shared memory zone with `limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;` in the `http` block, which tracks requests per client IP, then apply it in a location with `limit_req zone=api burst=20 nodelay;`. Requests above the rate are delayed or rejected; `burst` allows short spikes, and `limit_req_status 429;` returns the standard Too Many Requests code instead of the default 503. Stricter zones suit login endpoints. Behind another proxy, make sure the real client IP is used.",
    detail: [
      "The zone size determines how many client states can be stored.",
      "`limit_conn` limits simultaneous connections per key.",
      "Application-level limits by user or API key complement the IP-based ones.",
    ],
    ex: "The login location allows 5 requests per minute per IP, while the rest of the API allows 10 per second.",
    code: [
      [
        "Limit by IP",
        "nginx",
        `http {\n    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;\n\n    server {\n        location /api/login {\n            limit_req zone=login burst=3 nodelay;\n            limit_req_status 429;\n            proxy_pass http://127.0.0.1:3000;\n        }\n    }\n}`,
        [
          "The zone counts requests per client IP.",
          "`burst=3` tolerates a small spike.",
          "Excess requests get 429.",
        ],
      ],
    ],
    mistakes: [
      "Limiting by the proxy's IP, so all users share one bucket.",
      "No limit on login.",
    ],
    follow: ["What does burst do?"],
    points: [
      "limit_req_zone defines the key and rate",
      "limit_req applies it",
      "burst for spikes",
      "limit_req_status 429",
    ],
    notes: ["Zone, limit, status 429."],
    src: [
      [
        "nginx: ngx_http_limit_req_module",
        `${NH}/ngx_http_limit_req_module.html`,
      ],
    ],
  }),
  q({
    slug: "tls-termination-https-server",
    topic: "TLS",
    d: "medium",
    title: "How do you configure HTTPS in nginx, and what is TLS termination?",
    kw: [
      "ssl_certificate",
      "tls termination",
      "listen 443 ssl",
      "ssl_certificate_key",
      "https",
    ],
    intent: "Checks you can enable HTTPS and know what termination means.",
    short:
      "TLS termination means nginx handles the encrypted HTTPS connection with clients and passes plain HTTP to the backend over a trusted private network, so the application does not need to manage certificates. Enable it by listening on 443 with `listen 443 ssl;` and pointing `ssl_certificate` to the certificate chain and `ssl_certificate_key` to the private key. Nginx's default protocols are TLS 1.2 and TLS 1.3. The private key must be readable only by root and the certificate must match the server name.",
    detail: [
      "Send `X-Forwarded-Proto https` so the app knows the original scheme.",
      "Reloading nginx picks up renewed certificates.",
      "Use HTTP/2 for better performance with many assets.",
    ],
    ex: "Browsers connect to nginx over HTTPS; nginx forwards to the Node app on localhost over HTTP.",
    code: [
      [
        "HTTPS server",
        "nginx",
        `server {\n    listen 443 ssl;\n    server_name example.com;\n\n    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    location / {\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_pass http://127.0.0.1:3000;\n    }\n}`,
        [
          "`listen 443 ssl` turns on TLS.",
          "The certificate and key are configured.",
          "The app receives plain HTTP internally.",
        ],
      ],
    ],
    mistakes: [
      "Using only the leaf certificate instead of the full chain.",
      "A private key readable by other users.",
    ],
    follow: ["What does the app need to know about the original scheme?"],
    points: [
      "Nginx terminates TLS",
      "listen 443 ssl plus cert and key",
      "Defaults TLS 1.2 and 1.3",
      "Forward the original scheme",
    ],
    notes: ["Certificate and key, then listen 443 ssl."],
    src: [
      [
        "nginx: Configuring HTTPS servers",
        `${NH}/configuring_https_servers.html`,
      ],
      ["nginx: ngx_http_ssl_module", `${NH}/ngx_http_ssl_module.html`],
    ],
  }),
  q({
    slug: "redirect-http-to-https",
    topic: "TLS",
    d: "easy",
    title: "How do you redirect HTTP to HTTPS in nginx?",
    kw: ["301 redirect", "return 301", "http to https", "port 80", "hsts"],
    intent: "Checks you can force secure connections.",
    short:
      "Keep a server block listening on port 80 whose only job is to redirect: `return 301 https://$host$request_uri;`. That sends a permanent redirect to the same host and path over HTTPS. The `return` directive is simpler and more efficient than a rewrite. Once HTTPS works everywhere you can add the `Strict-Transport-Security` header on the HTTPS server so browsers use HTTPS directly in future.",
    detail: [
      "Let's Encrypt HTTP-01 validation needs port 80 to stay reachable for `/.well-known/acme-challenge/`.",
      "`$request_uri` keeps the path and query string.",
      "Make sure the HTTPS site works before adding HSTS.",
    ],
    ex: "Visiting `http://example.com/pricing?x=1` lands on `https://example.com/pricing?x=1`.",
    code: [
      [
        "HTTP redirect",
        "nginx",
        `server {\n    listen 80;\n    server_name example.com www.example.com;\n    return 301 https://$host$request_uri;\n}`,
        [
          "Port 80 only redirects.",
          "`$host` and `$request_uri` keep the destination.",
        ],
      ],
    ],
    mistakes: [
      "Redirect loops from a mismatched backend scheme.",
      "Enabling HSTS before HTTPS is reliable.",
    ],
    follow: ["What does HSTS add?"],
    points: [
      "return 301 on port 80",
      "Use $host$request_uri",
      "Keep port 80 for ACME challenges",
      "HSTS afterwards",
    ],
    notes: ["301 to https."],
    src: [
      [
        "nginx: Configuring HTTPS servers",
        `${NH}/configuring_https_servers.html`,
      ],
      ["nginx: rewrite module (return)", `${NH}/ngx_http_rewrite_module.html`],
    ],
  }),
  q({
    slug: "tls-protocols-and-hardening",
    topic: "TLS",
    d: "medium",
    title: "How do you harden TLS settings and hide server details in nginx?",
    kw: [
      "ssl_protocols",
      "tls 1.3",
      "server_tokens off",
      "security headers",
      "cipher suites",
    ],
    intent: "Checks you know a few easy hardening settings.",
    short:
      "Allow only modern protocols with `ssl_protocols TLSv1.2 TLSv1.3;`, which is the default in current nginx, and avoid enabling old SSL or TLS 1.0 and 1.1. Keep OpenSSL and nginx updated, use certificates with the full chain, and add `Strict-Transport-Security`. Setting `server_tokens off;` stops nginx from showing its version in error pages and the `Server` header. Add other security headers such as `X-Content-Type-Options` with `add_header ... always`, and test the site with an SSL checker.",
    detail: [
      "Hiding the version is minor hardening; it does not replace patching.",
      "Cipher suite lists should follow a maintained recommendation rather than a hand-made list.",
      "`add_header` inside a location replaces inherited headers, so repeat them where needed.",
    ],
    ex: "The HTTPS server sets protocols, HSTS and `server_tokens off`, and passes an external TLS test.",
    mistakes: [
      "Enabling legacy TLS versions for old clients without need.",
      "Assuming hiding the version makes the server safe.",
    ],
    follow: ["What does server_tokens do?"],
    points: [
      "TLS 1.2 and 1.3 only",
      "HSTS and security headers",
      "server_tokens off",
      "Keep software patched",
    ],
    notes: ["Modern TLS, patched software."],
    src: [
      [
        "nginx: ngx_http_ssl_module (ssl_protocols)",
        `${NH}/ngx_http_ssl_module.html#ssl_protocols`,
      ],
      ["nginx: server_tokens", `${NH}/ngx_http_core_module.html#server_tokens`],
    ],
  }),
  q({
    slug: "nginx-request-size-and-timeouts",
    topic: "TLS",
    d: "medium",
    title: "Why do uploads fail with 413 in nginx, and how do you fix it?",
    kw: [
      "client_max_body_size",
      "413",
      "request entity too large",
      "uploads",
      "proxy timeouts",
    ],
    intent: "Checks you know the default body limit.",
    short:
      "Nginx limits the client request body size with `client_max_body_size`, which defaults to 1 MB. A larger request, such as a file upload, is rejected with `413 Request Entity Too Large`, often before it ever reaches your app. Raise the limit in the relevant `http`, `server` or `location` context, for example `client_max_body_size 20m;`, to match what the application accepts. Keep the limit as low as reasonable to avoid abuse, and also set matching limits in the app.",
    detail: [
      "Browsers often cannot display the 413 page clearly.",
      "Large uploads may also need longer proxy timeouts.",
      "Apply a bigger limit only to the upload location.",
    ],
    ex: "Avatar uploads of 3 MB fail until the upload location gets `client_max_body_size 5m`.",
    code: [
      [
        "Allow larger uploads on one path",
        "nginx",
        `location /api/upload {\n    client_max_body_size 20m;\n    proxy_pass http://127.0.0.1:3000;\n}`,
        [
          "Only the upload route accepts 20 MB.",
          "Other routes keep the 1 MB default.",
        ],
      ],
    ],
    mistakes: [
      "Disabling the limit globally.",
      "Fixing nginx but not the app's own limit.",
    ],
    follow: ["What is the default limit?"],
    points: [
      "Default is 1m",
      "413 when exceeded",
      "Raise per location",
      "Match the app's limit",
    ],
    notes: ["413 means raise client_max_body_size."],
    src: [
      [
        "nginx: client_max_body_size",
        `${NH}/ngx_http_core_module.html#client_max_body_size`,
      ],
    ],
  }),
  q({
    slug: "nginx-static-caching-headers",
    topic: "Caching",
    d: "easy",
    title: "How do you set cache headers for static files in nginx?",
    kw: [
      "expires",
      "cache-control",
      "static assets",
      "add_header",
      "hashed filenames",
    ],
    intent: "Checks you can make browsers cache assets properly.",
    short:
      "Use the `expires` directive or `add_header Cache-Control` in a location for static assets: for hashed build files, `expires 1y;` with `Cache-Control: public, immutable` lets browsers keep them for a year, because a new deploy produces new file names. Serve the HTML entry file with `no-cache` so users get updates. Enable `gzip` for text files. This reduces requests and bandwidth without touching the application.",
    detail: [
      "`expires` sets both `Expires` and `Cache-Control: max-age`.",
      "Do not cache files with fixed names for a long time.",
      "`etag` and `If-Modified-Since` handling are enabled for static files by default.",
    ],
    ex: "`/assets/*.js` gets a year of caching and `/index.html` is revalidated on each load.",
    code: [
      [
        "Static cache headers",
        "nginx",
        `location /assets/ {\n    expires 1y;\n    add_header Cache-Control "public, immutable";\n}\n\nlocation = /index.html {\n    add_header Cache-Control "no-cache";\n}`,
        [
          "Hashed assets are cached for a year.",
          "The HTML shell is always revalidated.",
        ],
      ],
    ],
    mistakes: [
      "Long caching on files that keep the same name.",
      "Caching index.html so users never see updates.",
    ],
    follow: ["Why can hashed files be cached forever?"],
    points: [
      "expires and Cache-Control",
      "Long cache for hashed assets",
      "no-cache for the HTML",
      "Enable gzip",
    ],
    notes: ["Hashed assets forever, HTML never."],
    src: [
      ["nginx: ngx_http_headers_module", `${NH}/ngx_http_headers_module.html`],
      ["nginx: ngx_http_gzip_module", `${NH}/ngx_http_gzip_module.html`],
    ],
  }),
  q({
    slug: "nginx-gzip-compression",
    topic: "Caching",
    d: "easy",
    title: "How does gzip compression work in nginx?",
    kw: [
      "gzip on",
      "gzip_types",
      "compression",
      "content-encoding",
      "bandwidth",
    ],
    intent: "Checks you can reduce transfer size of text responses.",
    short:
      "Gzip compression is off by default; enable it with `gzip on;` and choose which MIME types to compress with `gzip_types`, such as `text/css application/javascript application/json`. Text formats compress very well, so pages load faster over slow connections. HTML is compressed by default when gzip is on, but already-compressed formats like images, video and zip files should not be compressed again. The browser signals support with `Accept-Encoding`, and nginx adds `Content-Encoding: gzip` and `Vary: Accept-Encoding`.",
    detail: [
      "`gzip_min_length` skips tiny responses.",
      "Compression uses CPU, so pick a moderate `gzip_comp_level`.",
      "Brotli is a newer alternative that needs an extra module.",
    ],
    ex: "Turning on gzip for JSON and JavaScript cuts the transfer size of an API and the bundle by well over half.",
    code: [
      [
        "Enable gzip",
        "nginx",
        `gzip on;\ngzip_min_length 1024;\ngzip_types text/css application/javascript application/json image/svg+xml;`,
        [
          "Compression is enabled.",
          "Small responses are skipped.",
          "Text-like types are compressed.",
        ],
      ],
    ],
    mistakes: [
      "Compressing images and videos again.",
      "Forgetting JSON and JavaScript types.",
    ],
    follow: ["Which header shows that compression was used?"],
    points: [
      "Off by default",
      "gzip on and gzip_types",
      "Compress text, not images",
      "Vary: Accept-Encoding",
    ],
    notes: ["Compress text types."],
    src: [["nginx: ngx_http_gzip_module", `${NH}/ngx_http_gzip_module.html`]],
  }),
  q({
    slug: "nginx-proxy-cache",
    topic: "Caching",
    d: "hard",
    title: "How does nginx proxy caching work?",
    kw: [
      "proxy_cache_path",
      "proxy_cache",
      "proxy_cache_valid",
      "cache zone",
      "x-cache-status",
    ],
    intent: "Checks you can cache backend responses at the proxy.",
    short:
      "Nginx can store responses from the backend and serve repeats without contacting it. Declare a cache with `proxy_cache_path` in the `http` block, giving a directory, a shared memory `keys_zone` and options such as `max_size`, then enable it in a location with `proxy_cache zone_name;` and set lifetimes with `proxy_cache_valid`, for example `proxy_cache_valid 200 10m;`. Cache only responses that are the same for all users, never personalised ones, and add `X-Cache-Status` via `$upstream_cache_status` to see hits and misses.",
    detail: [
      "`proxy_cache_use_stale` serves old content when the backend is down or updating.",
      "The cache key defaults to the scheme, host and URI; vary it deliberately.",
      "By default nginx respects the backend's `Cache-Control` and `Set-Cookie` headers in deciding what to cache.",
    ],
    ex: "A public product listing endpoint is cached for one minute, reducing database load during traffic spikes.",
    code: [
      [
        "Proxy cache",
        "nginx",
        `proxy_cache_path /var/cache/nginx keys_zone=api_cache:10m max_size=1g inactive=60m;\n\nserver {\n    location /api/products {\n        proxy_cache api_cache;\n        proxy_cache_valid 200 1m;\n        add_header X-Cache-Status $upstream_cache_status;\n        proxy_pass http://127.0.0.1:3000;\n    }\n}`,
        [
          "The cache zone is declared once.",
          "The location enables it and sets a lifetime.",
          "The header shows HIT or MISS.",
        ],
      ],
    ],
    mistakes: [
      "Caching responses that contain user data.",
      "Not checking whether the cache is actually being hit.",
    ],
    follow: ["What does proxy_cache_use_stale do?"],
    points: [
      "proxy_cache_path declares the cache",
      "proxy_cache and proxy_cache_valid enable it",
      "Cache shared responses only",
      "Verify with a status header",
    ],
    notes: ["Declare, enable, verify."],
    src: [
      [
        "nginx: proxy_cache module directives",
        `${NH}/ngx_http_proxy_module.html#proxy_cache`,
      ],
      [
        "nginx: proxy_cache_valid",
        `${NH}/ngx_http_proxy_module.html#proxy_cache_valid`,
      ],
      [
        "nginx: proxy_cache_use_stale",
        `${NH}/ngx_http_proxy_module.html#proxy_cache_use_stale`,
      ],
    ],
  }),
  q({
    slug: "nginx-cache-bypass-and-invalidation",
    topic: "Caching",
    d: "hard",
    title:
      "When should nginx not cache a response, and how do you skip the cache?",
    kw: [
      "proxy_cache_bypass",
      "proxy_no_cache",
      "authorization header",
      "cookies",
      "private responses",
    ],
    intent: "Checks you avoid leaking private data through a shared cache.",
    short:
      "A shared proxy cache serves one stored response to many users, so private responses such as account pages or anything depending on a cookie or `Authorization` header must not be cached. Use `proxy_no_cache` to prevent a response being stored, and `proxy_cache_bypass` to skip the cache for a request, for example when a cookie or header is present. Cache only clearly public endpoints, vary the cache key when responses differ, and keep cache lifetimes short for data that changes.",
    detail: [
      "Also let the backend send `Cache-Control: private` or `no-store` for personal responses.",
      "Purging individual entries is easier with additional modules or commercial features, so short TTLs are the simple route.",
      "Test with two different users to check there is no leakage.",
    ],
    ex: "Requests carrying a session cookie bypass the cache, so signed-in users always see their own page.",
    mistakes: [
      "Caching responses that vary by user.",
      "Long lifetimes with no way to purge.",
    ],
    follow: ["Why does a shared cache need extra care?"],
    points: [
      "Do not cache private responses",
      "proxy_no_cache and proxy_cache_bypass",
      "Short TTLs for changing data",
      "Test with different users",
    ],
    notes: ["Shared cache, shared responses only."],
    src: [["nginx: ngx_http_proxy_module", `${NH}/ngx_http_proxy_module.html`]],
  }),
  q({
    slug: "cache-layers-browser-cdn-nginx",
    topic: "Caching",
    d: "medium",
    title: "How do browser caching, nginx caching and a CDN fit together?",
    kw: [
      "cdn",
      "browser cache",
      "proxy cache",
      "cache layers",
      "origin server",
    ],
    intent: "Checks you can reason about layered caches.",
    short:
      "A request can be answered at several layers. The browser cache holds files for one user and avoids requests entirely when a response is fresh. A CDN stores copies at locations close to users and shields the origin. Nginx's own proxy cache sits in front of the application and avoids repeated work for the backend. Cache headers such as `Cache-Control` tell each layer how long it may keep a response, so set them carefully and decide at which layer each kind of content should be cached.",
    detail: [
      "Static assets belong in the browser cache and the CDN.",
      "Dynamic public data may use short proxy caching.",
      "Personalised responses should be uncacheable at shared layers.",
    ],
    ex: "Hashed JS files are cached by the browser for a year; the product list is cached by nginx for a minute; the account page is never cached.",
    mistakes: [
      "Caching at every layer without a plan for invalidation.",
      "No cache headers, leaving caches to guess.",
    ],
    follow: ["Which content must not be cached by shared layers?"],
    points: [
      "Browser, CDN, proxy layers",
      "Headers govern each layer",
      "Assets cache longest",
      "Personal data not at shared layers",
    ],
    notes: ["Choose the layer per content type."],
    src: [
      [
        "MDN: HTTP caching",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching",
      ],
      ["nginx: ngx_http_proxy_module", `${NH}/ngx_http_proxy_module.html`],
    ],
  }),
  q({
    slug: "lets-encrypt-what-and-how",
    topic: "HTTPS & Let's Encrypt",
    d: "easy",
    title: "What is Let's Encrypt and how long do its certificates last?",
    kw: [
      "let's encrypt",
      "free certificates",
      "acme",
      "90 days",
      "domain validation",
    ],
    intent: "Checks you know where free, automated certificates come from.",
    short:
      "Let's Encrypt is a free, automated certificate authority that issues Domain Validation certificates, so websites can enable HTTPS at no cost. Certificates are issued through the ACME protocol by a client such as Certbot, which proves you control the domain. Its default certificates are valid for 90 days, and the recommendation is to renew them every 60 days, which is why renewal must be automated. It does not issue organisation-validated or extended-validation certificates.",
    detail: [
      "Short lifetimes limit the damage from compromised keys and push people to automate.",
      "Rate limits exist on how many certificates can be requested, so test with the staging environment.",
      "A clock job or systemd timer usually runs the renewal.",
    ],
    ex: "A small business site gets a certificate for its domain in minutes and renews it automatically.",
    mistakes: [
      "Forgetting that certificates expire and having no renewal.",
      "Hitting rate limits by requesting repeatedly while testing.",
    ],
    follow: ["Why do certificates last only 90 days?"],
    points: [
      "Free, automated CA",
      "ACME protocol with a client",
      "90-day validity, renew every 60",
      "Domain validation only",
    ],
    notes: ["Free HTTPS, renew automatically."],
    src: [
      ["Let's Encrypt: FAQ", `${LE}/docs/faq/`],
      ["Let's Encrypt: How it works", `${LE}/how-it-works/`],
    ],
  }),
  q({
    slug: "acme-challenges-http01-dns01",
    topic: "HTTPS & Let's Encrypt",
    d: "medium",
    title: "What are the HTTP-01 and DNS-01 challenges?",
    kw: [
      "http-01",
      "dns-01",
      "acme challenge",
      "wildcard certificate",
      "domain control",
    ],
    intent: "Checks you know how a CA verifies domain ownership.",
    short:
      "Before issuing a certificate, Let's Encrypt asks you to prove control of the domain. With HTTP-01, the ACME client places a token file at `http://<domain>/.well-known/acme-challenge/<token>` on your web server, and the CA fetches it over port 80; it is the most common type but cannot issue wildcard certificates. With DNS-01, you publish a specific value in a TXT record under the domain, which works even when the server is not reachable from the internet and is required for wildcard certificates, but is harder to automate because it needs DNS API access.",
    detail: [
      "HTTP-01 needs port 80 open and the path reachable, so do not redirect or block the challenge path incorrectly.",
      "With several servers behind a load balancer, the challenge file must be available on all of them.",
      "Keep DNS API credentials narrowly scoped.",
    ],
    ex: "A single site uses HTTP-01, while a company that needs `*.example.com` uses DNS-01.",
    mistakes: [
      "Blocking port 80 and breaking renewal.",
      "Trying to get a wildcard with HTTP-01.",
    ],
    follow: ["Which challenge supports wildcard certificates?"],
    points: [
      "HTTP-01: file over port 80",
      "DNS-01: TXT record",
      "Wildcards need DNS-01",
      "Port 80 and path must stay reachable",
    ],
    notes: ["HTTP-01 for one site, DNS-01 for wildcards."],
    src: [["Let's Encrypt: Challenge types", `${LE}/docs/challenge-types/`]],
  }),
  q({
    slug: "certbot-nginx-renewal",
    topic: "HTTPS & Let's Encrypt",
    d: "medium",
    title: "How do you obtain and automatically renew a certificate for nginx?",
    kw: [
      "certbot",
      "certbot --nginx",
      "renewal",
      "systemd timer",
      "reload nginx",
    ],
    intent: "Checks you can set up HTTPS end to end and keep it working.",
    short:
      "Point your domain's DNS at the server, open ports 80 and 443, install an ACME client such as Certbot with its nginx plugin, and run it for your domain; it validates the domain, obtains the certificate and can edit the nginx configuration to use it. Certificates are stored in `/etc/letsencrypt/live/<domain>/` as `fullchain.pem` and `privkey.pem`. Renewal is automated by a timer or cron job that runs `certbot renew`, and nginx needs to be reloaded to use the new files, which a deploy hook can do. Test with `certbot renew --dry-run`.",
    detail: [
      "Check that the timer is active, since a forgotten renewal causes an outage at expiry.",
      "Monitor certificate expiry with an external check.",
      "Use the staging environment to avoid rate limits while experimenting.",
    ],
    ex: "`sudo certbot --nginx -d example.com -d www.example.com` obtains the certificate, and a timer renews it before expiry.",
    code: [
      [
        "Typical commands",
        "bash",
        `sudo certbot --nginx -d example.com -d www.example.com\nsudo certbot renew --dry-run\nsudo systemctl list-timers | grep certbot`,
        [
          "The first obtains the certificate and configures nginx.",
          "The dry run tests renewal.",
          "The timer check confirms automation.",
        ],
      ],
    ],
    mistakes: [
      "Assuming renewal works without testing it.",
      "Not reloading nginx after renewal.",
    ],
    follow: ["How would you know a certificate is about to expire?"],
    points: [
      "Open ports 80 and 443",
      "ACME client obtains and installs",
      "Automatic renewal and reload",
      "Dry run and expiry monitoring",
    ],
    notes: ["Obtain, auto-renew, test the renewal."],
    src: [
      ["Let's Encrypt: Getting started", `${LE}/getting-started/`],
      ["Let's Encrypt: FAQ (renewal)", `${LE}/docs/faq/`],
    ],
  }),
  q({
    slug: "full-https-setup-checklist",
    topic: "HTTPS & Let's Encrypt",
    d: "hard",
    title: "What does a complete, correct HTTPS setup on nginx include?",
    kw: ["https checklist", "hsts", "redirect", "fullchain", "mixed content"],
    intent: "Checks you can bring the pieces together and verify them.",
    short:
      "A complete setup has a valid certificate whose chain is served in full (`fullchain.pem`), a server block on 443 with the certificate and key, modern TLS protocols, a port-80 server that redirects to HTTPS while still allowing ACME validation, automatic renewal with a reload, and an HSTS header once everything works. The application must trust the proxy so it knows the original scheme, cookies need the `Secure` flag, and the pages must avoid mixed content. Verify with a browser, `curl -I`, and an external TLS test.",
    detail: [
      "Certificates must cover every host name users type, including `www`.",
      "Check that redirects do not loop between http and https.",
      "Document renewal and certificate expiry alerts for the team.",
    ],
    ex: "After setup, `http://example.com` returns a 301 to `https://example.com`, the browser shows a valid certificate, and cookies carry the Secure flag.",
    mistakes: [
      "Serving an incomplete chain.",
      "Mixed content that browsers block.",
    ],
    follow: ["What is mixed content?"],
    points: [
      "Full chain, key, modern protocols",
      "Redirect port 80",
      "Renewal plus reload",
      "HSTS, Secure cookies, no mixed content",
    ],
    notes: ["Certificate, redirect, renewal, headers."],
    src: [
      [
        "nginx: Configuring HTTPS servers",
        `${NH}/configuring_https_servers.html`,
      ],
      ["Let's Encrypt: Getting started", `${LE}/getting-started/`],
    ],
  }),
  q({
    slug: "nginx-logs-and-reload",
    topic: "Reverse proxy",
    d: "easy",
    title: "Where does nginx write logs and how do you reload it safely?",
    kw: [
      "access_log",
      "error_log",
      "nginx -t",
      "nginx -s reload",
      "log format",
    ],
    intent: "Checks you can operate and debug nginx day to day.",
    short:
      "Nginx writes an access log of each request (by default `/var/log/nginx/access.log`) and an error log (`/var/log/nginx/error.log`) for problems, controlled by the `access_log` and `error_log` directives. When something fails, the error log is the first place to look. After changing configuration run `nginx -t` to test it, then `nginx -s reload` (or `systemctl reload nginx`), which starts new workers with the new config and lets old ones finish their current requests, so there is no downtime.",
    detail: [
      "A custom `log_format` can add upstream response time and cache status.",
      "Rotate logs so they do not fill the disk.",
      "Raise the error log level temporarily when debugging.",
    ],
    ex: "A bad config is caught by `nginx -t` before the reload, so the live site stays up.",
    mistakes: [
      "Restarting instead of reloading, dropping connections.",
      "Reloading without testing.",
    ],
    follow: ["What does nginx -s reload do?"],
    points: [
      "access_log and error_log",
      "nginx -t tests the config",
      "Reload is graceful",
      "Rotate logs",
    ],
    notes: ["Test, then reload."],
    src: [
      ["nginx: Controlling nginx", `${N}/control.html`],
      ["nginx: ngx_http_log_module", `${NH}/ngx_http_log_module.html`],
    ],
  }),
])
