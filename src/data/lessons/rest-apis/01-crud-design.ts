import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "crud-design",
  title: "Designing a CRUD API around resources",
  topic: "CRUD design",
  minutes: 45,
  overview:
    "Model an API as resources with plural nouns in the URL, map create, read, update and delete to HTTP methods, and use a consistent JSON representation. Includes a practice server for the whole module.",
  objectives: [
    "Explain resources, representations and statelessness",
    "Design URLs from nouns and collections",
    "Map CRUD operations to HTTP methods and status codes",
    "Run and call a small REST API with curl",
  ],
  prerequisites: ["http"],
  sections: [
    {
      kind: "explain",
      heading: "What REST means in practice",
      body: [
        "**REST** (Representational State Transfer) is a style for designing web APIs. The central idea is the **resource**: a thing the API exposes, such as a book, an order or a user. A resource has an address (a URL) and one or more **representations**, most often JSON. Clients do not call functions; they use standard HTTP methods on resources.",
        "A RESTful API is **stateless**: every request carries everything the server needs, such as the credentials and the identifiers, and the server keeps no conversation state between requests. That makes it easy to scale and to cache. The interface is **uniform**: the same methods and status codes mean the same thing across resources.",
      ],
    },
    {
      kind: "diagram",
      heading: "CRUD to HTTP",
      diagram: {
        kind: "table",
        title: "One resource, five operations",
        headers: ["Operation", "Method and URL", "Success status"],
        rows: [
          ["List books", "GET /v1/books", "200 OK"],
          ["Read one book", "GET /v1/books/3", "200 OK"],
          ["Create a book", "POST /v1/books", "201 Created + Location header"],
          ["Replace a book", "PUT /v1/books/3", "200 OK"],
          ["Change part of a book", "PATCH /v1/books/3", "200 OK"],
          ["Delete a book", "DELETE /v1/books/3", "204 No Content"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "URL design rules",
      body: [
        "Use **nouns**, not verbs: `/books`, not `/getBooks` or `/createBook`; the method already says what to do. Use **plural** collection names (`/books`) and an identifier for one item (`/books/3`). Nest only when the child cannot exist without the parent (`/orders/9/items`), and avoid deep nesting.",
        "Use lowercase words, hyphens for multi-word names, and no file extensions or implementation details in the URL. Keep field names consistent in the JSON (for example always `camelCase` or always `snake_case`).",
      ],
    },
    {
      kind: "code",
      heading: "The practice API",
      example: {
        title: "server.py (Python standard library only)",
        language: "python",
        code: 'import json\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\nfrom urllib.parse import parse_qs, urlparse\n\nBOOKS = {\n    1: {"id": 1, "title": "Dune", "author": "Herbert", "year": 1965},\n    2: {"id": 2, "title": "Emma", "author": "Austen", "year": 1815},\n    3: {"id": 3, "title": "Ulysses", "author": "Joyce", "year": 1922},\n    4: {"id": 4, "title": "Persuasion", "author": "Austen", "year": 1817},\n    5: {"id": 5, "title": "Dracula", "author": "Stoker", "year": 1897},\n}\nKEYS = {}\nOPENAPI = {\n    "openapi": "3.0.3",\n    "info": {"title": "Books API", "version": "1.0.0"},\n    "paths": {\n        "/v1/books": {"get": {"summary": "List books"}, "post": {"summary": "Create a book"}},\n        "/v1/books/{id}": {"get": {"summary": "Get a book"}, "put": {"summary": "Replace a book"}, "delete": {"summary": "Delete a book"}},\n    },\n}\n\n\ndef present(book, version):\n    if version == "v2":\n        return {"id": book["id"], "title": book["title"], "authors": [book["author"]], "year": book["year"]}\n    return dict(book)\n\n\ndef validate(data, partial=False):\n    errors = []\n    rules = {"title": str, "author": str, "year": int}\n    for field, kind in rules.items():\n        if field not in data:\n            if not partial:\n                errors.append({"field": field, "message": "is required"})\n        elif not isinstance(data[field], kind) or isinstance(data[field], bool):\n            errors.append({"field": field, "message": "must be " + ("an integer" if kind is int else "a string")})\n    return errors\n\n\nclass Handler(BaseHTTPRequestHandler):\n    protocol_version = "HTTP/1.1"\n\n    def reply(self, status, obj=None, headers=None, ctype="application/json"):\n        body = b"" if obj is None else json.dumps(obj).encode()\n        self.send_response(status)\n        if obj is not None:\n            self.send_header("Content-Type", ctype)\n        for k, v in (headers or {}).items():\n            self.send_header(k, v)\n        self.send_header("Content-Length", str(len(body)))\n        self.end_headers()\n        if self.command != "HEAD":\n            self.wfile.write(body)\n\n    def problem(self, status, title, errors=None):\n        obj = {"type": "about:blank", "title": title, "status": status}\n        if errors:\n            obj["errors"] = errors\n        self.reply(status, obj, ctype="application/problem+json")\n\n    def route(self):\n        url = urlparse(self.path)\n        parts = [p for p in url.path.split("/") if p]\n        return url, parse_qs(url.query), parts\n\n    def body(self):\n        n = int(self.headers.get("Content-Length") or 0)\n        raw = self.rfile.read(n) if n else b""\n        if "json" not in (self.headers.get("Content-Type") or ""):\n            self.problem(415, "Content-Type must be application/json")\n            return None\n        try:\n            data = json.loads(raw or b"{}")\n        except ValueError:\n            self.problem(400, "Malformed JSON")\n            return None\n        if not isinstance(data, dict):\n            self.problem(400, "JSON object expected")\n            return None\n        return data\n\n    def do_GET(self):\n        url, q, parts = self.route()\n        if parts == ["openapi.json"]:\n            return self.reply(200, OPENAPI)\n        if len(parts) == 2 and parts[0] in ("v1", "v2") and parts[1] == "books":\n            return self.list_books(parts[0], q)\n        if len(parts) == 3 and parts[0] in ("v1", "v2") and parts[1] == "books" and parts[2].isdigit():\n            book = BOOKS.get(int(parts[2]))\n            if not book:\n                return self.problem(404, "Book not found")\n            base = f"/{parts[0]}/books"\n            out = present(book, parts[0])\n            out["_links"] = {\n                "self": {"href": f"{base}/{book[\'id\']}"},\n                "collection": {"href": base},\n                "update": {"href": f"{base}/{book[\'id\']}", "method": "PUT"},\n                "delete": {"href": f"{base}/{book[\'id\']}", "method": "DELETE"},\n            }\n            return self.reply(200, out, self.sunset(parts[0]))\n        self.problem(404, "No such resource")\n\n    do_HEAD = do_GET\n\n    def sunset(self, version):\n        if version == "v1":\n            return {"Sunset": "Wed, 31 Dec 2031 23:59:59 GMT", "Link": \'</v2/books>; rel="successor-version"\'}\n        return {}\n\n    def list_books(self, version, q):\n        items = list(BOOKS.values())\n        if "author" in q:\n            items = [b for b in items if b["author"].lower() == q["author"][0].lower()]\n        if "year" in q:\n            items = [b for b in items if str(b["year"]) == q["year"][0]]\n        if "min_year" in q:\n            items = [b for b in items if b["year"] >= int(q["min_year"][0])]\n        for spec in reversed(q.get("sort", [""])[0].split(",") if "sort" in q else []):\n            field = spec.lstrip("-")\n            if field not in ("title", "author", "year", "id"):\n                return self.problem(400, f"Cannot sort by {field}")\n            items.sort(key=lambda b: b[field], reverse=spec.startswith("-"))\n        limit = max(1, min(int(q.get("limit", ["10"])[0]), 50))\n        headers = self.sunset(version)\n        if "after" in q:\n            after = int(q["after"][0])\n            rest = [b for b in items if b["id"] > after]\n            page = rest[:limit]\n            nxt = page[-1]["id"] if len(rest) > limit else None\n            return self.reply(200, {"data": [present(b, version) for b in page], "next_cursor": nxt}, headers)\n        page_no = max(1, int(q.get("page", ["1"])[0]))\n        total = len(items)\n        pages = max(1, -(-total // limit))\n        start = (page_no - 1) * limit\n        links = []\n        base = f"/{version}/books"\n        if page_no < pages:\n            links.append(f\'<{base}?page={page_no + 1}&limit={limit}>; rel="next"\')\n        if page_no > 1:\n            links.append(f\'<{base}?page={page_no - 1}&limit={limit}>; rel="prev"\')\n        if links:\n            headers["Link"] = (headers.get("Link", "") + ", " if "Link" in headers else "") + ", ".join(links)\n        headers["X-Total-Count"] = str(total)\n        meta = {"page": page_no, "limit": limit, "total": total, "pages": pages}\n        self.reply(200, {"data": [present(b, version) for b in items[start:start + limit]], "meta": meta}, headers)\n\n    def do_POST(self):\n        url, q, parts = self.route()\n        if parts != ["v1", "books"]:\n            return self.problem(404, "No such resource")\n        data = self.body()\n        if data is None:\n            return\n        key = self.headers.get("Idempotency-Key")\n        if key and key in KEYS:\n            stored_data, stored = KEYS[key]\n            if stored_data != data:\n                return self.problem(422, "Idempotency-Key was already used with a different request")\n            return self.reply(stored["status"], stored["obj"], {"Location": stored["location"], "Idempotency-Replayed": "true"})\n        errors = validate(data)\n        if errors:\n            return self.problem(422, "Validation failed", errors)\n        new_id = max(BOOKS) + 1\n        BOOKS[new_id] = {"id": new_id, "title": data["title"], "author": data["author"], "year": data["year"]}\n        loc = f"/v1/books/{new_id}"\n        if key:\n            KEYS[key] = (data, {"status": 201, "obj": BOOKS[new_id], "location": loc})\n        self.reply(201, BOOKS[new_id], {"Location": loc})\n\n    def do_PUT(self):\n        url, q, parts = self.route()\n        if not (len(parts) == 3 and parts[:2] == ["v1", "books"] and parts[2].isdigit()):\n            return self.problem(404, "No such resource")\n        data = self.body()\n        if data is None:\n            return\n        if int(parts[2]) not in BOOKS:\n            return self.problem(404, "Book not found")\n        errors = validate(data)\n        if errors:\n            return self.problem(422, "Validation failed", errors)\n        BOOKS[int(parts[2])] = {"id": int(parts[2]), "title": data["title"], "author": data["author"], "year": data["year"]}\n        self.reply(200, BOOKS[int(parts[2])])\n\n    def do_PATCH(self):\n        url, q, parts = self.route()\n        if not (len(parts) == 3 and parts[:2] == ["v1", "books"] and parts[2].isdigit()):\n            return self.problem(404, "No such resource")\n        data = self.body()\n        if data is None:\n            return\n        book = BOOKS.get(int(parts[2]))\n        if not book:\n            return self.problem(404, "Book not found")\n        errors = validate(data, partial=True)\n        if errors:\n            return self.problem(422, "Validation failed", errors)\n        book.update({k: v for k, v in data.items() if k in ("title", "author", "year")})\n        self.reply(200, book)\n\n    def do_DELETE(self):\n        url, q, parts = self.route()\n        if not (len(parts) == 3 and parts[:2] == ["v1", "books"] and parts[2].isdigit()):\n            return self.problem(404, "No such resource")\n        if BOOKS.pop(int(parts[2]), None) is None:\n            return self.problem(404, "Book not found")\n        self.reply(204)\n\n    def log_message(self, *args):\n        pass\n\n\nThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()',
        walkthrough: [
          "Save this as `server.py` and start it with `python3 server.py`; it listens on `127.0.0.1:8000`. It keeps five books in memory, so restarting resets everything.",
          "`/v1/books` supports listing with filtering, sorting and pagination, creating with validation and an `Idempotency-Key` header, and `/v1/books/{id}` supports GET, PUT, PATCH and DELETE.",
          "`/v2/books` is a newer representation used in the versioning lesson, and `/openapi.json` is a tiny API description for the documentation lesson.",
          "Errors are returned as `application/problem+json` documents that follow RFC 9457 (a `title`, a `status` and optional details).",
          "You do not need to read all the code now; each lesson in this module uses one part of it.",
        ],
      },
      intro:
        "Every lesson in this module uses this server. Run it in one terminal and use curl in another.",
    },
    {
      kind: "code",
      heading: "A CRUD session",
      example: {
        title: "Create, read, update and delete",
        language: "bash",
        code: 'curl -s localhost:8000/v1/books/1\necho\ncurl -s -D - -o /dev/null -X POST -H \'Content-Type: application/json\' -d \'{"title":"Kim","author":"Kipling","year":1901}\' localhost:8000/v1/books | grep -iE \'^(HTTP|location)\' | tr -d \'\\r\'\ncurl -s -X PUT -H \'Content-Type: application/json\' -d \'{"title":"Emma","author":"Austen","year":1816}\' localhost:8000/v1/books/2\necho\ncurl -s -X PATCH -H \'Content-Type: application/json\' -d \'{"year":1817}\' localhost:8000/v1/books/2\necho\ncurl -s -o /dev/null -w "%{http_code}\\n" -X DELETE localhost:8000/v1/books/2\ncurl -s -o /dev/null -w "%{http_code}\\n" localhost:8000/v1/books/2',
        walkthrough: [
          "`GET /v1/books/1` returns one book. It also carries a `_links` object, which you meet in the HATEOAS lesson.",
          "`POST` creates book 6 and answers `201 Created` with `Location: /v1/books/6`, the address of the new resource.",
          "`PUT` replaces book 2 completely: the response shows the new year, 1816. `PATCH` changes only the fields you send: the year becomes 1817 and the other fields stay.",
          "`DELETE` returns `204` with no body. A later `GET` of the same book gives `404`, because the resource no longer exists.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Verbs in URLs, such as /deleteUser?id=4.",
          fix: "Use DELETE /users/4. The method is the verb.",
        },
        {
          mistake:
            "Returning 200 for everything and putting the real outcome in the body.",
          fix: "Use accurate status codes so clients and tools can react.",
        },
        {
          mistake: "Mixing singular and plural names (/book and /books).",
          fix: "Use plural collections consistently.",
        },
        {
          mistake: "Storing client session state on the server between calls.",
          fix: "Keep the API stateless; send a token with each request.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Designing a to-do API",
      scenario: "A team needs an API for tasks and projects.",
      body: [
        'Resources: `/projects` and `/tasks`. List and create with `GET` and `POST /tasks`; one task at `/tasks/12`; the tasks of a project at `/projects/3/tasks`. Mark done with `PATCH /tasks/12` and body `{"done": true}` instead of a verb URL like `/tasks/12/complete`.',
        "Return `201` with `Location` on create, `204` on delete, and a problem document on errors.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rest-noun",
      prompt: "Which URL follows REST naming guidance?",
      options: [
        "DELETE /books/3",
        "POST /deleteBook?id=3",
        "GET /removeBook/3",
      ],
      answer: 0,
      explanation: "The URL names the resource; the method says the action.",
    },
    {
      type: "single",
      id: "create-status",
      prompt:
        "Which status and header does a successful POST that creates a resource return?",
      options: [
        "201 Created with a Location header",
        "200 OK with no header",
        "204 No Content",
      ],
      answer: 0,
      explanation:
        "201 plus Location tells the client where the new resource is.",
    },
    {
      type: "truefalse",
      id: "stateless",
      statement:
        "In a stateless REST API, the server keeps client conversation state between requests.",
      answer: false,
      explanation:
        "Every request must carry what the server needs; the server stores no session state of the conversation.",
    },
    {
      type: "blank",
      id: "delete-status",
      prompt: "A successful DELETE that returns no body uses status ___.",
      answer: "204",
      explanation: "204 No Content.",
    },
  ],
  assignment: {
    title: "Design and test an API",
    task: [
      "Design the URLs and methods for a library API with books, members and loans (a table of operation, method, URL and status).",
      "Start the practice server and run a full create, read, replace, update and delete session on books with curl, recording each status code.",
    ],
    checklist: [
      "URLs use plural nouns and no verbs",
      "Every operation has the right method and status",
      "Create returned 201 with a Location header",
      "The deleted book returned 404 afterwards",
    ],
    hints: ["curl -i shows status and headers."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "crud-table",
      title: "CRUD table",
      task: [
        "Write the method and URL for: list all orders; read order 7; create an order; replace order 7; delete order 7.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution:
        "1. GET /orders\n2. GET /orders/7\n3. POST /orders\n4. PUT /orders/7\n5. DELETE /orders/7",
      hints: ["Collections are plural nouns."],
      checklist: [
        "List uses GET on the collection",
        "Create uses POST on the collection",
        "Replace and delete use the item URL",
      ],
    },
  ],
  revisionNotes: [
    "Resources with plural-noun URLs; methods are the verbs",
    "GET list/read, POST create (201 + Location), PUT replace, PATCH partial, DELETE (204)",
    "Stateless requests; uniform interface; JSON representations",
    "Consistent names; errors as problem documents",
  ],
  resources: [
    {
      label: "MDN: REST",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
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
