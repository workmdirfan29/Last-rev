import { defineLesson } from "@/data/lessons/author"

export default defineLesson("http", {
  slug: "methods",
  title: "HTTP methods",
  topic: "Methods",
  minutes: 45,
  overview:
    "Understand the request and response format and the main HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS), including which are safe and idempotent. Includes a small practice server you can run.",
  objectives: [
    "Describe the structure of an HTTP request and response",
    "Choose the right method for reading, creating, replacing, changing and deleting",
    "Define safe and idempotent methods and classify each method",
    "Use curl to send requests to a practice server",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Requests and responses",
      body: [
        "HTTP is a request-response protocol. A **client** (a browser, a mobile app, `curl`) sends a request and a **server** returns a response. A request has a **request line** (method, target and protocol version), **headers** and an optional **body**; a response has a **status line** (version, status code and reason), headers and an optional body.",
        "The **method** tells the server what the client wants to do with the target resource. The standard methods are defined in RFC 9110. Two properties matter: a method is **safe** if it does not change the server's state (it only reads), and **idempotent** if making the same request several times has the same effect on the server as making it once.",
      ],
    },
    {
      kind: "diagram",
      heading: "The main methods",
      diagram: {
        kind: "table",
        title: "Methods and their properties",
        headers: ["Method", "Typical use", "Safe", "Idempotent"],
        rows: [
          ["GET", "Read a resource", "Yes", "Yes"],
          ["HEAD", "Like GET but only the headers", "Yes", "Yes"],
          ["OPTIONS", "Ask which methods the target supports", "Yes", "Yes"],
          [
            "POST",
            "Create a resource or submit data for processing",
            "No",
            "No",
          ],
          [
            "PUT",
            "Replace a resource with the sent representation",
            "No",
            "Yes",
          ],
          ["PATCH", "Apply a partial change", "No", "Not guaranteed"],
          ["DELETE", "Remove a resource", "No", "Yes"],
        ],
      },
    },
    {
      kind: "code",
      heading: "The practice server",
      example: {
        title: "server.py (Python standard library only)",
        language: "python",
        code: 'import json\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\n\nITEMS = {1: {"id": 1, "name": "pen"}}\nETAG = \'"v1"\'\n\nclass Handler(BaseHTTPRequestHandler):\n    protocol_version = "HTTP/1.1"\n\n    def send(self, status, body=b"", headers=None):\n        self.send_response(status)\n        for k, v in (headers or {}).items():\n            self.send_header(k, v)\n        self.send_header("Content-Length", str(len(body)))\n        self.end_headers()\n        if self.command != "HEAD":\n            self.wfile.write(body)\n\n    def json(self, status, obj, headers=None):\n        h = {"Content-Type": "application/json"}\n        h.update(headers or {})\n        self.send(status, json.dumps(obj).encode(), h)\n\n    def read_body(self):\n        n = int(self.headers.get("Content-Length") or 0)\n        return self.rfile.read(n) if n else b""\n\n    def do_GET(self):\n        p = self.path\n        if p == "/items":\n            self.json(200, list(ITEMS.values()))\n        elif p.startswith("/items/"):\n            item = ITEMS.get(int(p.rsplit("/", 1)[1]))\n            self.json(200, item) if item else self.json(404, {"error": "not found"})\n        elif p == "/old":\n            self.send(301, headers={"Location": "/items"})\n        elif p == "/secret":\n            self.send(401, headers={"WWW-Authenticate": \'Basic realm="demo"\'})\n        elif p == "/admin":\n            self.json(403, {"error": "forbidden"})\n        elif p == "/boom":\n            self.json(500, {"error": "server error"})\n        elif p == "/cookie":\n            self.send(200, b"ok", {"Set-Cookie": "sid=abc123; Path=/; HttpOnly; SameSite=Lax"})\n        elif p == "/whoami":\n            self.json(200, {"cookie": self.headers.get("Cookie")})\n        elif p == "/cached":\n            if self.headers.get("If-None-Match") == ETAG:\n                self.send(304, headers={"ETag": ETAG})\n            else:\n                self.send(200, b"report v1", {"ETag": ETAG, "Cache-Control": "max-age=60", "Content-Type": "text/plain"})\n        elif p == "/nocache":\n            self.send(200, b"fresh", {"Cache-Control": "no-store"})\n        else:\n            self.json(404, {"error": "not found"})\n\n    do_HEAD = do_GET\n\n    def do_POST(self):\n        data = json.loads(self.read_body() or b"{}")\n        new_id = max(ITEMS) + 1\n        ITEMS[new_id] = {"id": new_id, **data}\n        self.json(201, ITEMS[new_id], {"Location": f"/items/{new_id}"})\n\n    def do_PUT(self):\n        data = json.loads(self.read_body() or b"{}")\n        i = int(self.path.rsplit("/", 1)[1])\n        ITEMS[i] = {"id": i, **data}\n        self.json(200, ITEMS[i])\n\n    def do_DELETE(self):\n        i = int(self.path.rsplit("/", 1)[1])\n        if ITEMS.pop(i, None) is None:\n            self.json(404, {"error": "not found"})\n        else:\n            self.send(204)\n\n    def do_OPTIONS(self):\n        self.send(204, headers={"Allow": "GET, POST, PUT, DELETE, HEAD, OPTIONS"})\n\n    def log_message(self, *a):\n        pass\n\nHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()',
        walkthrough: [
          "Save this as `server.py` and start it with `python3 server.py`. It listens on `127.0.0.1:8000` and keeps a small list of items in memory.",
          "`GET /items` returns the list, `POST /items` adds an item and answers `201 Created` with a `Location` header, `PUT /items/1` replaces one, `DELETE /items/1` removes one and returns `204 No Content`, and `OPTIONS` returns an `Allow` header.",
          "The other paths (`/old`, `/secret`, `/admin`, `/boom`, `/cookie`, `/whoami`, `/cached`, `/nocache`) are used in the next lessons to show redirects, errors, cookies and caching.",
          "Everything it does is held in memory, so restarting the server resets the data.",
        ],
      },
      intro:
        "This server is used by all the lessons in this module. Run it in one terminal and use another for the curl commands.",
    },
    {
      kind: "code",
      heading: "Trying the methods",
      example: {
        title: "curl against the practice server",
        language: "bash",
        code: "curl -s localhost:8000/items\necho\ncurl -s -X POST -d '{\"name\":\"book\"}' -H 'Content-Type: application/json' localhost:8000/items\necho\ncurl -s -o /dev/null -w \"%{http_code}\\n\" -X DELETE localhost:8000/items/2\ncurl -s -o /dev/null -w \"%{http_code}\\n\" localhost:8000/items/2\ncurl -s -I localhost:8000/items | head -n 1 | tr -d '\\r'\ncurl -s -i -X OPTIONS localhost:8000/items | grep -i '^allow' | tr -d '\\r'",
        walkthrough: [
          "`curl -s URL` sends a GET and prints the body: the list with one item. `-s` hides the progress meter, and `echo` adds a newline.",
          "`-X POST -d '...' -H 'Content-Type: application/json'` sends a POST with a JSON body. The server creates item 2 and returns it with status `201`.",
          '`-o /dev/null -w "%{http_code}\\n"` throws away the body and prints only the status code. Deleting item 2 (just created) gives `204`, success with no content. Asking for item 2 afterwards gives `404` because it is gone.',
          "`curl -I` sends **HEAD**: only the status line and headers come back, no body. The first line is `HTTP/1.1 200 OK`.",
          "`-X OPTIONS` asks what is allowed. The `Allow` header lists `GET, POST, PUT, DELETE, HEAD, OPTIONS`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "PUT, PATCH and POST",
      body: [
        "Use `POST` when the server decides the new resource's address or when you submit data to be processed; it is **not** idempotent, so sending it twice can create two resources. Use `PUT` to put a complete representation at a known address: repeating it leaves the same result. Use `PATCH` for a partial update; whether repeating it is safe depends on the change (`increase balance by 5` is not idempotent).",
        "Browsers submit HTML forms only with GET or POST; other methods come from JavaScript, API clients and tools like curl.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Using GET for actions that change data, such as /delete?id=5.",
          fix: "GET must be safe: crawlers, caches and prefetching may call it. Use DELETE or POST.",
        },
        {
          mistake: "Retrying a POST blindly after a timeout.",
          fix: "A POST may have succeeded. Use an idempotency key or check before retrying.",
        },
        {
          mistake: "Putting sensitive data in the URL of a GET.",
          fix: "URLs are logged and stored in history. Send secrets in a body or header over HTTPS.",
        },
        {
          mistake: "Confusing PUT and PATCH.",
          fix: "PUT sends the whole new representation; PATCH sends only the changes.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Choosing methods for a shop API",
      scenario:
        "You design endpoints for products: list, create, replace, change the price, delete.",
      body: [
        "`GET /products` lists, `POST /products` creates (201 with a Location), `PUT /products/7` replaces the whole product, `PATCH /products/7` changes only the price and `DELETE /products/7` removes it. Clients can retry the GET, PUT and DELETE calls safely after a network error.",
        "Document which methods each path allows and return `405 Method Not Allowed` with an `Allow` header for others.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "safe-method",
      prompt:
        "Which method is safe, meaning it should not change server state?",
      options: ["GET", "POST", "DELETE"],
      answer: 0,
      explanation: "GET only reads. POST and DELETE change state.",
    },
    {
      type: "single",
      id: "idempotent-method",
      prompt: "Which method is NOT idempotent?",
      options: ["POST", "PUT", "DELETE"],
      answer: 0,
      explanation:
        "Repeating a POST can create another resource; PUT and DELETE have the same effect when repeated.",
    },
    {
      type: "truefalse",
      id: "head-body",
      statement: "A response to HEAD contains the headers but no body.",
      answer: true,
      explanation: "HEAD is GET without the response body.",
    },
    {
      type: "blank",
      id: "created-method",
      prompt:
        "Creating a new resource whose address is chosen by the server is usually done with ___.",
      answer: "POST",
      explanation:
        "POST creates a subordinate resource and the server returns its location.",
      accepted: ["post"],
    },
  ],
  assignment: {
    title: "Method workout",
    task: [
      "Run the practice server and use curl to: list the items, create two items, replace one with PUT, delete one, and ask OPTIONS. Record the status code of each.",
      "For each method, write whether it is safe and idempotent, with a one-sentence reason.",
    ],
    checklist: [
      "Every method was sent with curl and its status recorded",
      "The table of safe and idempotent methods is correct",
      "A POST was repeated to show it is not idempotent",
      "A PUT was repeated to show it is idempotent",
    ],
    hints: ["Use curl -i to see headers too."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "pick-method",
      title: "Pick the method",
      task: [
        "For each action write the HTTP method: (1) read a user; (2) create a new order; (3) replace a profile completely; (4) change only an email address; (5) delete a comment.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. GET\n2. POST\n3. PUT\n4. PATCH\n5. DELETE",
      hints: ["Think: safe, creating, replacing, partial, removing."],
      checklist: [
        "GET for reading",
        "POST for creating",
        "PUT for full replacement",
        "PATCH for a partial change",
        "DELETE for removal",
      ],
    },
  ],
  revisionNotes: [
    "Request: method, target, version, headers, body. Response: status line, headers, body",
    "Safe = does not change state; idempotent = same effect when repeated",
    "GET, HEAD, OPTIONS safe; PUT, DELETE idempotent; POST not",
    "PUT replaces, PATCH changes part, POST creates",
  ],
  resources: [
    {
      label: "MDN: An overview of HTTP",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview",
    },
    {
      label: "MDN: HTTP request methods",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods",
    },
    {
      label: "RFC 9110: HTTP semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    },
  ],
})
