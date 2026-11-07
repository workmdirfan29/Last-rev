import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-security", {
  slug: "authorization-rules",
  title: "Authorisation: URL rules, roles and object-level access",
  topic: "Authorization",
  minutes: 75,
  overview:
    "Protect URLs with ordered rules, understand roles and authorities, produce 401 and 403 correctly, and prevent users from reading each other's data.",
  objectives: [
    "Write authorizeHttpRequests rules in the right order",
    "Tell roles from authorities and 401 from 403",
    "Prevent insecure direct object references",
  ],
  prerequisites: ["lesson.spring-security.authentication-and-the-filter-chain"],
  sections: [
    {
      kind: "explain",
      heading: "URL rules",
      body: [
        '`authorizeHttpRequests` lists rules that match requests and say what is needed: `permitAll()`, `authenticated()`, `hasRole("ADMIN")`, `hasAuthority("orders:write")` or `denyAll()`. The rules are evaluated **in the order they are written**, and the **first matching rule** is applied, so the specific rules must come first and `anyRequest()` last. End with `anyRequest().authenticated()`, or even `denyAll()`, so that anything you forgot is protected.',
        '`requestMatchers(HttpMethod.GET, "/api/products/**")` limits a rule to a method. Path matching can be tricky with trailing slashes, so test the rules.',
      ],
    },
    {
      kind: "code",
      heading: "Rules in order",
      example: {
        title: "Specific first",
        language: "java",
        code: 'http.authorizeHttpRequests(auth -> auth\n    .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()\n    .requestMatchers("/admin/**").hasRole("ADMIN")\n    .requestMatchers("/api/orders/**").authenticated()\n    .anyRequest().denyAll());',
        walkthrough: [
          "Each request is checked against the rules from top to bottom, and the first match decides.",
          "Product reading is public, order access needs a login, and `/admin/**` needs the `ADMIN` role.",
          "`denyAll()` at the end blocks any path that was not listed.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Roles and authorities",
      body: [
        'Both are **`GrantedAuthority`** strings that represent what a user may do. An **authority** is a fine-grained permission, such as `orders:write`. A **role** is a coarse group, by convention stored with the prefix `ROLE_`, such as `ROLE_ADMIN`. **`hasRole("ADMIN")` adds the `ROLE_` prefix** and checks for `ROLE_ADMIN`, while `hasAuthority("ADMIN")` checks the exact string. A mismatch between the stored value and the check is a frequent reason for unexpected `403` responses. `User.builder().roles("ADMIN")` stores `ROLE_ADMIN`, and `.authorities("ADMIN")` stores `ADMIN`.',
        "`401 Unauthorized` means the request is **not authenticated**: the credentials are missing or invalid. The `AuthenticationEntryPoint` produces it. `403 Forbidden` means the user is authenticated but **not allowed**. The `AccessDeniedHandler` produces it. A `403` also appears on a `POST` without a valid CSRF token. For a REST API you usually customise both to return a JSON body, and not an HTML page or a redirect.",
      ],
    },
    {
      kind: "code",
      heading: "JSON for both cases",
      example: {
        title: "401 and 403",
        language: "java",
        code: 'http.exceptionHandling(ex -> ex\n    .authenticationEntryPoint((req, res, e) -> {\n      res.setStatus(401);\n      res.setContentType("application/json");\n      res.getWriter().write("{\\"error\\":\\"unauthenticated\\"}");\n    })\n    .accessDeniedHandler((req, res, e) -> {\n      res.setStatus(403);\n      res.setContentType("application/json");\n      res.getWriter().write("{\\"error\\":\\"forbidden\\"}");\n    }));',
        walkthrough: [
          "The entry point handles unauthenticated requests with `401`.",
          "The access denied handler handles authenticated users with too few rights with `403`.",
          "Both return JSON, which suits an API.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "A URL rule is not enough",
      body: [
        "A rule such as `/api/orders/**` requires a login, but it does not say **whose** order may be read. If the controller loads an order by the id in the URL and returns it, any logged-in user can read another user's order by changing the number. This is an **insecure direct object reference (IDOR)**, a form of **broken access control**, and it is one of the most common real-world security bugs.",
        "The fix is to check **ownership on the server for every object access**: query with the current user, as in `findByIdAndOwnerId(id, userId)`, or use a method-security check. Take the user from the security context and **never** from client input. Return the same `404` for an unknown order and for someone else's order. Apply the principle of **least privilege**, and write a test that logs in as user A and tries to read user B's data.",
      ],
    },
    {
      kind: "code",
      heading: "Query by owner",
      example: {
        title: "Preventing IDOR",
        language: "java",
        code: '@GetMapping("/api/orders/{id}")\nOrderDto get(@PathVariable long id, @AuthenticationPrincipal AppUser user) {\n  return orders.findByIdAndOwnerId(id, user.getId())\n      .map(mapper::toDto)\n      .orElseThrow(() -> new OrderNotFoundException(id));\n}',
        walkthrough: [
          "The current user comes from the security context, and not from the request.",
          "The query includes the owner, so another user's order is simply not found.",
          "The client gets the same `404` for an unknown order and a foreign one, so it learns nothing.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting `anyRequest().permitAll()` before specific rules.",
          fix: "Specific rules first, `anyRequest()` last.",
        },
        {
          mistake: 'Storing `ROLE_ADMIN` and checking `hasRole("ROLE_ADMIN")`.',
          fix: "`hasRole` adds the prefix for you.",
        },
        {
          mistake: "Loading by id only and trusting the login as enough.",
          fix: "Check the owner.",
        },
        {
          mistake: "Reading a user id from a request parameter.",
          fix: "Use the principal.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A support tool",
      scenario:
        "Support staff may see any order, and customers only their own.",
      body: [
        "A rule `hasRole(\"SUPPORT\")` protects the support endpoints, and customer endpoints query by the current user's id. A test for each role checks that a customer cannot read another customer's order.",
        "Both levels of checks are needed.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "az-first",
      prompt: "How are authorizeHttpRequests rules evaluated?",
      options: [
        "In order, first match wins",
        "All rules must match",
        "Last match wins",
      ],
      answer: 0,
      explanation: "Put the specific rules first.",
    },
    {
      type: "single",
      id: "az-hasrole",
      prompt: '`hasRole("ADMIN")` checks which authority?',
      options: ["ROLE_ADMIN", "ADMIN", "ROLE_USER"],
      answer: 0,
      explanation: "The prefix is added automatically.",
    },
    {
      type: "truefalse",
      id: "az-403",
      statement: "An anonymous user who is denied gets 403.",
      answer: false,
      explanation:
        "Anonymous users get 401. 403 is for authenticated users without the right.",
    },
    {
      type: "single",
      id: "az-idor",
      prompt: "How do you prevent one user reading another's order?",
      options: [
        "Check the owner on the server for each access",
        "Hide the id in the URL",
        "Use a longer id",
      ],
      answer: 0,
      explanation: "Authenticated does not mean authorised for this object.",
    },
  ],
  assignment: {
    title: "Roles and ownership",
    task: [
      "Create users with roles USER and ADMIN, protect URLs with ordered rules, and return JSON for 401 and 403.",
      "Write tests that prove that user A cannot read user B's orders.",
    ],
    checklist: [
      "The rule order is correct",
      "401 and 403 return JSON",
      "An ownership test fails without the owner check",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "az-ex",
      title: "Write the rules",
      task: [
        "Write the rules: `GET /api/books/**` is public, `/api/admin/**` needs the `ADMIN` role, and everything else needs a login.",
      ],
      language: "java",
      starter: "http.authorizeHttpRequests(auth -> auth\n    // your code\n);",
      solution:
        'http.authorizeHttpRequests(auth -> auth\n    .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()\n    .requestMatchers("/api/admin/**").hasRole("ADMIN")\n    .anyRequest().authenticated()\n);',
      hints: ["Specific rules first, `anyRequest()` last."],
      checklist: [
        "The public GET rule is first",
        "The admin rule uses hasRole",
        "The last rule authenticates everything else",
      ],
    },
  ],
  revisionNotes: [
    "Rules are first-match: specific first, `anyRequest()` last",
    "hasRole adds ROLE_; hasAuthority checks the exact string",
    "401 = not authenticated (EntryPoint); 403 = not allowed (AccessDeniedHandler)",
    "Check object ownership on the server; use the principal, not client input",
  ],
  resources: [
    {
      label: "Spring Security Reference: Authorize HttpServletRequests",
      url: "https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html",
    },
    {
      label: "Spring Security Reference: Authorization Architecture",
      url: "https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html",
    },
  ],
})
