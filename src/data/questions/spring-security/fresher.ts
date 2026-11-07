import { defineQuestions } from "../author"
import { g } from "../brief"

const R = "https://docs.spring.io/spring-security/reference/servlet"

export default defineQuestions("spring-security", "fresher", [
  g({
    slug: "what-is-spring-security",
    topic: "Authentication",
    d: "easy",
    title: "What is Spring Security and what happens when you add it to a project?",
    kw: ["Spring Security", "authentication", "authorization", "SecurityFilterChain", "default security"],
    intent: "Checks that you know what the framework does before any configuration.",
    short:
      "Spring Security is a framework that provides authentication, which checks who the user is, authorisation, which checks what the user may do, and protection against common attacks such as CSRF, session fixation and clickjacking. For a web application, it works as a chain of servlet filters in front of your controllers. When you add the Spring Boot security starter without any configuration, every endpoint requires authentication, a default login form and HTTP Basic are enabled, and a generated password for a default user named `user` is printed at start-up. You then replace these defaults with your own configuration.",
    detail: [
      "Security is applied before a request reaches the `DispatcherServlet`, because it is implemented with filters.",
      "Defaults are deliberately strict: deny unless you allow.",
      "The framework is large, and most applications use only a few parts: filter chain, authentication, and authorisation rules.",
    ],
    ex: "After adding `spring-boot-starter-security`, a request to any `/api/**` endpoint without credentials returns `401`.",
    mistakes: [
      "Confusing authentication (who) with authorisation (what they may do).",
      "Leaving the generated default user in a real deployment.",
    ],
    follow: ["How does the filter chain work?"],
    points: [
      "Authentication, authorisation, attack protection",
      "Implemented as servlet filters",
      "Secure by default, then customise",
    ],
    notes: "Spring Security = filter chain; default after adding it: everything is authenticated.",
    src: [
      ["Spring Security Reference: Getting Started", `${R}/getting-started.html`],
      ["Spring Security Reference: Architecture", `${R}/architecture.html`],
    ],
  }),
  g({
    slug: "security-filter-chain",
    topic: "Authentication",
    d: "medium",
    title: "How does the Spring Security filter chain work, and how do you configure it?",
    kw: ["SecurityFilterChain", "DelegatingFilterProxy", "FilterChainProxy", "HttpSecurity", "filters"],
    intent: "Checks that you understand the architecture and the modern configuration style.",
    short:
      "Spring Security registers a single filter, `DelegatingFilterProxy`, which hands each request to the `FilterChainProxy`. That chooses the `SecurityFilterChain` whose request matcher fits, and the request passes through that chain's filters in a fixed order, which handle things such as the security context, CSRF, authentication and authorisation. You configure it by declaring a `SecurityFilterChain` bean and building it from `HttpSecurity`. The old `WebSecurityConfigurerAdapter` was deprecated and removed, so current code uses the bean style with the lambda DSL.",
    detail: [
      "An application can have several chains, for example one for `/api/**` and one for the web pages, ordered with `@Order`.",
      "The order of filters matters, and you should not reorder them without a reason.",
      "Debug logging of `org.springframework.security` shows the filters that ran for a request.",
    ],
    ex: "A shop has an API chain that is stateless and a web chain with a login form.",
    code: [
      "A SecurityFilterChain bean",
      "@Configuration\n@EnableWebSecurity\nclass SecurityConfig {\n\n  @Bean\n  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    http\n      .authorizeHttpRequests(auth -> auth\n          .requestMatchers(\"/public/**\").permitAll()\n          .anyRequest().authenticated())\n      .formLogin(Customizer.withDefaults());\n    return http.build();\n  }\n}",
      [
        "A `SecurityFilterChain` bean replaces the old adapter class.",
        "`/public/**` is open, and everything else requires authentication.",
        "`formLogin` adds the login page and its filter to the chain.",
      ],
      "java",
    ],
    mistakes: [
      "Extending `WebSecurityConfigurerAdapter`, which no longer exists in current versions.",
      "Putting a broad `anyRequest().permitAll()` rule before the specific ones.",
    ],
    follow: ["In which order are the rules evaluated?"],
    points: [
      "DelegatingFilterProxy → FilterChainProxy → SecurityFilterChain",
      "Configure with a SecurityFilterChain bean",
      "Several chains with different matchers",
    ],
    notes: "Declare a `SecurityFilterChain` bean from `HttpSecurity`; `WebSecurityConfigurerAdapter` is gone.",
    src: [
      ["Spring Security Reference: Servlet Security: The Big Picture", `${R}/architecture.html`],
      ["Spring Security Reference: Java Configuration", `${R}/configuration/java.html`],
    ],
  }),
  g({
    slug: "authentication-flow",
    topic: "Authentication",
    d: "medium",
    title: "How does authentication work in Spring Security? (AuthenticationManager, providers, SecurityContext)",
    kw: ["AuthenticationManager", "ProviderManager", "AuthenticationProvider", "SecurityContext", "Authentication"],
    intent: "Checks that you can follow a login from the credentials to the stored result.",
    short:
      "A filter reads the credentials and creates an unauthenticated `Authentication` object, for example a username and password token. It passes it to the `AuthenticationManager`, usually a `ProviderManager`, which asks its `AuthenticationProvider`s in turn until one supports and accepts it. The common `DaoAuthenticationProvider` loads the user with a `UserDetailsService` and checks the password with a `PasswordEncoder`. On success, it returns a fully populated `Authentication`, with the principal and authorities, and it is stored in the `SecurityContext`, held by the `SecurityContextHolder`. On failure, an `AuthenticationException` is thrown.",
    detail: [
      "The `SecurityContext` is normally kept in the HTTP session between requests, or not stored at all in a stateless API.",
      "`SecurityContextHolder.getContext().getAuthentication()` gives the current user in application code.",
      "In a controller, `@AuthenticationPrincipal` or a `Principal` argument is a cleaner way to get it.",
    ],
    ex: "A user posts a username and password, and `DaoAuthenticationProvider` loads the user, checks the hash and returns an authenticated token.",
    mistakes: [
      "Checking passwords with `equals` in your own code.",
      "Reading the `SecurityContextHolder` deep in the services instead of passing the user in.",
    ],
    follow: ["Where is the authenticated user stored?"],
    points: [
      "Filter → AuthenticationManager → AuthenticationProvider",
      "UserDetailsService + PasswordEncoder",
      "Result stored in the SecurityContext",
    ],
    notes: "Credentials → `AuthenticationManager` → provider → `Authentication` in the `SecurityContext`.",
    src: [
      ["Spring Security Reference: Authentication Architecture", `${R}/authentication/architecture.html`],
      ["Spring Security Reference: DaoAuthenticationProvider", `${R}/authentication/passwords/dao-authentication-provider.html`],
    ],
  }),
  g({
    slug: "password-encoding",
    topic: "Authentication",
    d: "easy",
    title: "How should passwords be stored, and what does `PasswordEncoder` do?",
    kw: ["PasswordEncoder", "BCrypt", "hashing", "salt", "DelegatingPasswordEncoder"],
    intent: "Checks the most important security rule for credentials.",
    short:
      "Passwords must never be stored in plain text or with a fast hash such as MD5 or plain SHA-256. They should be stored with a slow, salted, adaptive hashing algorithm, so a leaked database cannot be reversed cheaply. Spring Security's `PasswordEncoder` interface has `encode`, to hash a password, and `matches`, to compare a raw password with a stored hash. `BCryptPasswordEncoder` is the common implementation, and it adds a random salt and a cost factor that you can raise over time. `PasswordEncoderFactories.createDelegatingPasswordEncoder()` stores an id such as `{bcrypt}` with the hash, which allows the algorithm to change later.",
    detail: [
      "A hash cannot be decrypted, so a forgotten password is reset, never recovered.",
      "The encoder is exposed as a bean, and the authentication provider uses it automatically.",
      "Spring Security's documentation recommends adaptive one-way functions such as bcrypt, Argon2 or scrypt.",
    ],
    ex: "On signup the service stores `passwordEncoder.encode(raw)`, and on login the provider calls `matches(raw, stored)`.",
    code: [
      "An encoder bean and its use",
      "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder();\n}\n\nString hash = passwordEncoder.encode(\"s3cret-Pass\");\nboolean ok = passwordEncoder.matches(\"s3cret-Pass\", hash);",
      [
        "The bean lets Spring Security use the same encoder when it checks a login.",
        "`encode` produces a different hash each time, because of the random salt.",
        "`matches` compares the raw password with the stored hash.",
      ],
      "java",
    ],
    mistakes: [
      "Storing passwords with a fast hash or in plain text.",
      "Comparing two hashes with `equals` instead of using `matches`.",
    ],
    follow: ["Why does bcrypt give a different hash for the same password?"],
    points: [
      "Slow, salted, one-way hashing",
      "encode and matches",
      "DelegatingPasswordEncoder allows migration",
    ],
    notes: "Use `BCryptPasswordEncoder` (or the delegating encoder). `encode` to store, `matches` to check.",
    src: [
      ["Spring Security Reference: Password Storage", `${R}/authentication/passwords/storage.html`],
      ["Spring Security Reference: PasswordEncoder", `${R}/authentication/passwords/password-encoder.html`],
    ],
  }),
  g({
    slug: "userdetailsservice-custom",
    topic: "Authentication",
    d: "medium",
    title: "How do you load users from your own database? (`UserDetailsService`)",
    kw: ["UserDetailsService", "UserDetails", "loadUserByUsername", "UsernameNotFoundException", "authorities"],
    intent: "Checks that you can connect Spring Security to your own user table.",
    short:
      "Implement `UserDetailsService` and its single method `loadUserByUsername(String username)`, which returns a `UserDetails` object with the username, the stored password hash, the authorities and the account status flags, or throws `UsernameNotFoundException`. Expose the implementation as a bean, and Spring Security's `DaoAuthenticationProvider` uses it, together with the `PasswordEncoder`, to authenticate. The `UserDetails` can be Spring's `User` builder or your own class that adapts your entity.",
    detail: [
      "Return the hash, not the raw password, and let the provider compare it.",
      "Roles stored as `ROLE_ADMIN` become granted authorities that rules can check.",
      "Do not tell the client whether the username or the password was wrong. Use a single generic message.",
    ],
    ex: "A `UserRepository.findByEmail` call backs the service, and a missing email results in `UsernameNotFoundException`.",
    code: [
      "A database-backed UserDetailsService",
      "@Service\nclass DbUserDetailsService implements UserDetailsService {\n  private final UserRepository users;\n  DbUserDetailsService(UserRepository users) { this.users = users; }\n\n  @Override\n  public UserDetails loadUserByUsername(String email) {\n    AppUser u = users.findByEmail(email)\n        .orElseThrow(() -> new UsernameNotFoundException(\"Unknown user\"));\n    return User.withUsername(u.getEmail())\n        .password(u.getPasswordHash())\n        .roles(u.getRole())\n        .disabled(!u.isActive())\n        .build();\n  }\n}",
      [
        "The service finds the user, or throws `UsernameNotFoundException`.",
        "`User.withUsername` builds a `UserDetails` with the hash and the roles.",
        "The provider compares the submitted password with that hash.",
      ],
      "java",
    ],
    mistakes: [
      "Returning the raw password or an unhashed value.",
      "Returning a different error for an unknown user and a wrong password.",
    ],
    follow: ["What does roles(\"ADMIN\") do?"],
    points: [
      "One method: loadUserByUsername",
      "Return UserDetails with a hash and authorities",
      "Expose it as a bean",
    ],
    notes: "Implement `UserDetailsService.loadUserByUsername`, return the hash and roles, expose as a bean.",
    src: [
      ["Spring Security Reference: UserDetailsService", `${R}/authentication/passwords/user-details-service.html`],
      ["Spring Security Reference: UserDetails", `${R}/authentication/passwords/user-details.html`],
    ],
  }),
  g({
    slug: "form-login-vs-http-basic",
    topic: "Authentication",
    d: "easy",
    title: "What is the difference between form login and HTTP Basic authentication?",
    kw: ["form login", "HTTP Basic", "session", "Authorization header", "stateless"],
    intent: "Checks that you can choose an authentication style for a client type.",
    short:
      "Form login shows an HTML login page, checks the submitted credentials once, and then keeps the user logged in with a session cookie. It suits server-rendered web applications used by people. HTTP Basic sends the username and password with every request in the `Authorization: Basic` header, encoded with base64, which is not encryption, so it must be used over HTTPS only. It suits simple service-to-service calls and tools, but it exposes the credentials on every request. For modern APIs and single-page applications, token-based authentication, such as JWT or OAuth 2, is usually used.",
    detail: [
      "A failed Basic request gets `401` with a `WWW-Authenticate` header.",
      "Both need HTTPS, because credentials or session ids can be stolen on plain HTTP.",
      "You can enable both in the same chain.",
    ],
    ex: "An admin web page uses form login, and a script that calls an internal reporting endpoint uses Basic over HTTPS.",
    mistakes: [
      "Treating base64 as encryption.",
      "Using Basic authentication over plain HTTP.",
    ],
    follow: ["Why is base64 not security?"],
    points: [
      "Form login: login page + session",
      "Basic: credentials on every request",
      "HTTPS is required for both",
    ],
    notes: "Form login → session cookie. Basic → credentials in every request (HTTPS only).",
    src: [
      ["Spring Security Reference: Form Login", `${R}/authentication/passwords/form.html`],
      ["Spring Security Reference: Basic Authentication", `${R}/authentication/passwords/basic.html`],
    ],
  }),
  g({
    slug: "authorize-http-requests-rules",
    topic: "Authorization",
    d: "medium",
    title: "How do you protect URLs with `authorizeHttpRequests`, and does the order of rules matter?",
    kw: ["authorizeHttpRequests", "requestMatchers", "permitAll", "hasRole", "anyRequest"],
    intent: "Checks that you can write correct URL rules and know the first-match behaviour.",
    short:
      "`authorizeHttpRequests` lists rules that match requests and say what is needed: `permitAll()` for everyone, `authenticated()` for any logged-in user, `hasRole(\"ADMIN\")` or `hasAuthority(\"orders:write\")` for specific rights, and `denyAll()`. The rules are evaluated in the order that they are written, and the first matching rule is applied, so the specific rules must come before the general ones, and `anyRequest()` must be last. A good rule is to end with `anyRequest().authenticated()`, or even `denyAll()`, so that anything you forgot is protected.",
    detail: [
      "`requestMatchers(HttpMethod.GET, \"/api/products/**\")` can limit a rule to a method.",
      "A URL rule alone is not enough for object-level checks, such as \"only the owner can see this order\".",
      "Path matching can be tricky with trailing slashes and encoded paths, so test the rules.",
    ],
    ex: "Product reading is public, order creation needs a login, and the `/admin/**` area needs the `ADMIN` role.",
    code: [
      "Rules in order",
      "http.authorizeHttpRequests(auth -> auth\n    .requestMatchers(HttpMethod.GET, \"/api/products/**\").permitAll()\n    .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\")\n    .requestMatchers(\"/api/orders/**\").authenticated()\n    .anyRequest().denyAll());",
      [
        "Each request is checked against the rules from top to bottom.",
        "The first matching rule decides.",
        "`denyAll()` at the end blocks any path that was not listed.",
      ],
      "java",
    ],
    mistakes: [
      "Putting `anyRequest().permitAll()` before specific rules.",
      "Relying only on URL rules to protect data that belongs to a particular user.",
    ],
    follow: ["How do you protect a specific user's data?"],
    points: [
      "First matching rule wins",
      "Specific rules before general ones",
      "End with anyRequest().authenticated() or denyAll()",
    ],
    notes: "Rules are first-match: specific first, `anyRequest()` last.",
    src: [
      ["Spring Security Reference: Authorize HttpServletRequests", `${R}/authorization/authorize-http-requests.html`],
      ["Spring Security Reference: Authorization Architecture", `${R}/authorization/architecture.html`],
    ],
  }),
  g({
    slug: "roles-vs-authorities",
    topic: "Authorization",
    d: "medium",
    title: "What is the difference between a role and an authority in Spring Security?",
    kw: ["role", "authority", "ROLE_ prefix", "GrantedAuthority", "hasRole"],
    intent: "Checks one of the most common sources of confusing 403 errors.",
    short:
      "Both are `GrantedAuthority` objects, which are just strings that represent what a user is allowed to do. An authority is a fine-grained permission, such as `orders:write`. A role is a coarse group of permissions, by convention stored with the prefix `ROLE_`, such as `ROLE_ADMIN`. `hasRole(\"ADMIN\")` adds the `ROLE_` prefix for you and checks for `ROLE_ADMIN`, while `hasAuthority(\"ADMIN\")` checks the exact string. A mismatch between the stored value and the check is a frequent reason for unexpected `403` responses.",
    detail: [
      "`User.builder().roles(\"ADMIN\")` stores `ROLE_ADMIN`, and `.authorities(\"ADMIN\")` stores `ADMIN`.",
      "Use roles for broad job functions and authorities for specific actions in a larger system.",
      "With JWT, the converter decides how claims become authorities.",
    ],
    ex: "A `ROLE_MANAGER` user has the authorities `orders:read` and `orders:approve`, and a rule can require either.",
    mistakes: [
      "Storing `ROLE_ADMIN` and checking `hasRole(\"ROLE_ADMIN\")`.",
      "Mixing roles and authorities inconsistently in the data.",
    ],
    follow: ["Why do I get 403 for an admin user?"],
    points: [
      "Both are GrantedAuthority strings",
      "hasRole adds the ROLE_ prefix",
      "hasAuthority checks the exact string",
    ],
    notes: "`hasRole(\"ADMIN\")` checks `ROLE_ADMIN`; `hasAuthority(\"ADMIN\")` checks `ADMIN`.",
    src: [
      ["Spring Security Reference: Authorization Architecture (Authorities)", `${R}/authorization/architecture.html`],
      ["Spring Security Reference: Authorize HttpServletRequests", `${R}/authorization/authorize-http-requests.html`],
    ],
  }),
  g({
    slug: "401-vs-403",
    topic: "Authorization",
    d: "easy",
    title: "What is the difference between 401 and 403, and how does Spring Security produce them?",
    kw: ["401 Unauthorized", "403 Forbidden", "AuthenticationEntryPoint", "AccessDeniedHandler", "authentication failure"],
    intent: "Checks that you separate authentication failures from authorisation failures.",
    short:
      "`401 Unauthorized` means that the request is not authenticated: the credentials are missing or invalid. Spring Security's `AuthenticationEntryPoint` creates this response, for example with a `WWW-Authenticate` header, or a redirect to the login page. `403 Forbidden` means that the user is authenticated but is not allowed to do this. The `AccessDeniedHandler` creates this response. For a REST API, you usually customise both so that they return a JSON error body, instead of an HTML page or a redirect.",
    detail: [
      "An anonymous user who is denied gets `401`, and a logged-in user without the right gets `403`.",
      "A `403` also appears on a `POST` without a valid CSRF token.",
      "Do not reveal in the message whether a resource exists to users who must not know.",
    ],
    ex: "A request without a token gets `401`, and a normal user calling `/admin/users` gets `403`.",
    code: [
      "JSON responses for both cases",
      "http.exceptionHandling(ex -> ex\n    .authenticationEntryPoint((req, res, e) -> {\n      res.setStatus(401);\n      res.setContentType(\"application/json\");\n      res.getWriter().write(\"{\\\"error\\\":\\\"unauthenticated\\\"}\");\n    })\n    .accessDeniedHandler((req, res, e) -> {\n      res.setStatus(403);\n      res.setContentType(\"application/json\");\n      res.getWriter().write(\"{\\\"error\\\":\\\"forbidden\\\"}\");\n    }));",
      [
        "The entry point handles unauthenticated requests with `401`.",
        "The access denied handler handles authenticated users with too few rights with `403`.",
        "Both return JSON, which suits an API.",
      ],
      "java",
    ],
    mistakes: [
      "Returning `403` for a missing login, or `401` for a missing permission.",
      "Letting an API return a redirect to an HTML login page.",
    ],
    follow: ["Which component handles each case?"],
    points: [
      "401: not authenticated",
      "403: authenticated but not allowed",
      "EntryPoint vs AccessDeniedHandler",
    ],
    notes: "401 = who are you? (`AuthenticationEntryPoint`). 403 = not allowed (`AccessDeniedHandler`).",
    src: [
      ["Spring Security Reference: Handling Security Exceptions", `${R}/architecture.html#servlet-exceptiontranslationfilter`],
      ["Spring Security Reference: Authorization Architecture", `${R}/authorization/architecture.html`],
    ],
  }),
  g({
    slug: "least-privilege-and-object-level-access",
    topic: "Authorization",
    d: "hard",
    title: "Why is a URL rule not enough, and how do you prevent one user from reading another user's data?",
    kw: ["IDOR", "object-level authorisation", "ownership check", "least privilege", "broken access control"],
    intent: "Checks that you know the most common real-world access control bug.",
    short:
      "A rule such as `/api/orders/**` requires a login, but it does not say whose order may be read. If the controller loads an order by the id in the URL and returns it, any logged-in user can read another user's order by changing the number. This is an insecure direct object reference, and it is a form of broken access control. The fix is to check ownership on the server for every object access, either by querying with the current user, as in `findByIdAndOwnerId(id, userId)`, or by a method-security check such as `@PostAuthorize`. Always apply the principle of least privilege.",
    detail: [
      "Never trust ids, roles or user ids sent by the client when the server knows the user.",
      "Return `404` rather than `403` for objects that the user should not know exist, if that matters.",
      "Write tests that log in as user A and try to read user B's data.",
    ],
    ex: "`GET /api/orders/42` returns the order only when order 42 belongs to the authenticated user.",
    code: [
      "Query by owner",
      "@GetMapping(\"/api/orders/{id}\")\nOrderDto get(@PathVariable long id, @AuthenticationPrincipal AppUser user) {\n  return orders.findByIdAndOwnerId(id, user.getId())\n      .map(mapper::toDto)\n      .orElseThrow(() -> new OrderNotFoundException(id));\n}",
      [
        "The current user comes from the security context, not from the request.",
        "The query includes the owner, so another user's order is simply not found.",
        "The client gets the same `404` for an unknown order and a foreign one.",
      ],
      "java",
    ],
    mistakes: [
      "Loading by id only and trusting the login as enough.",
      "Reading a `userId` from a request parameter instead of the security context.",
    ],
    follow: ["How would you test for this?"],
    points: [
      "URL rules do not check ownership",
      "Check the owner on every object access",
      "Use the principal, not client input",
    ],
    notes: "Authenticated ≠ authorised for this object. Query by the current user's id.",
    src: [
      ["Spring Security Reference: Method Security", `${R}/authorization/method-security.html`],
      ["Spring Security Reference: Authorization Architecture", `${R}/authorization/architecture.html`],
    ],
  }),
  g({
    slug: "what-is-a-jwt",
    topic: "JWT with Spring Security",
    d: "easy",
    title: "What is a JWT and what does it contain?",
    kw: ["JWT", "header", "payload", "signature", "claims"],
    intent: "Checks that you understand the token format and what it does not protect.",
    short:
      "A JSON Web Token has three parts separated by dots: a header with the signing algorithm, a payload with claims such as the subject (`sub`), the issuer (`iss`), the expiry (`exp`) and any custom data, and a signature. The first two parts are base64url-encoded JSON, so anyone can read them, and the signature proves that the token was created by someone who holds the key and has not been changed. A signed JWT is therefore tamper-evident but not secret, so never put passwords or sensitive personal data in it.",
    detail: [
      "The server verifies the signature and checks `exp` before trusting any claim.",
      "A token can be signed with a shared secret (HMAC) or with a private key (RSA or EC), and verified with the public key.",
      "Encrypted tokens exist (JWE), but the common JWT in APIs is only signed.",
    ],
    ex: "A token with `sub: 42`, `scope: orders:read` and `exp` in 15 minutes lets the API identify the user without a database lookup.",
    mistakes: [
      "Putting secrets in the payload because it \"looks encoded\".",
      "Trusting the claims without verifying the signature and the expiry.",
    ],
    follow: ["How does an API validate a JWT?"],
    points: [
      "header.payload.signature",
      "Signed, readable, not encrypted",
      "Verify signature and expiry",
    ],
    notes: "JWT = header.payload.signature. Tamper-evident, but readable by anyone.",
    src: [
      ["Spring Security Reference: OAuth 2.0 Resource Server JWT", `${R}/oauth2/resource-server/jwt.html`],
      ["Spring Security Reference: OAuth 2.0 Resource Server", `${R}/oauth2/resource-server/index.html`],
    ],
  }),
  g({
    slug: "jwt-stateless-flow",
    topic: "JWT with Spring Security",
    d: "medium",
    title: "How does token-based, stateless authentication work with Spring Security?",
    kw: ["stateless", "SessionCreationPolicy.STATELESS", "Bearer token", "resource server", "login endpoint"],
    intent: "Checks that you can describe the whole flow and configure the server side.",
    short:
      "The client first authenticates, for example by posting its credentials to a login endpoint or to an authorisation server, and receives a signed token. For every later request, it sends the token in the `Authorization: Bearer <token>` header. The server validates the token on each request and builds the authenticated user from its claims, and keeps no session, so each request is independent and any server instance can handle it. In Spring Security, you configure the application as an OAuth 2 resource server with `oauth2ResourceServer(oauth2 -> oauth2.jwt(...))`, and set the session policy to stateless.",
    detail: [
      "Spring Security's resource server support validates tokens. Issuing them is done by an authorisation server or by your own login code.",
      "With a stateless API using a bearer header, CSRF protection is normally not needed, because browsers do not attach the header automatically.",
      "The token must be sent only over HTTPS.",
    ],
    ex: "A mobile app logs in once, stores the token, and sends it with every call to the API.",
    code: [
      "A stateless resource server",
      "@Bean\nSecurityFilterChain api(HttpSecurity http) throws Exception {\n  http\n    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n    .csrf(csrf -> csrf.disable())\n    .authorizeHttpRequests(a -> a\n        .requestMatchers(\"/auth/login\").permitAll()\n        .anyRequest().authenticated())\n    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()));\n  return http.build();\n}",
      [
        "No HTTP session is created or used.",
        "CSRF is disabled only because authentication uses a header token, not a cookie.",
        "The resource server validates the bearer JWT on each request.",
      ],
      "java",
    ],
    mistakes: [
      "Disabling CSRF protection in an application that authenticates with a session cookie.",
      "Sending the token over plain HTTP.",
    ],
    follow: ["Why can CSRF be disabled for a bearer-token API?"],
    points: [
      "Login once, send a Bearer token on each call",
      "Server keeps no session",
      "Resource server validates the token",
    ],
    notes: "Stateless: `Authorization: Bearer <jwt>`, `SessionCreationPolicy.STATELESS`, `oauth2ResourceServer`.",
    src: [
      ["Spring Security Reference: OAuth 2.0 Resource Server JWT", `${R}/oauth2/resource-server/jwt.html`],
      ["Spring Security Reference: Session Management", `${R}/authentication/session-management.html`],
    ],
  }),
  g({
    slug: "jwt-validation-configuration",
    topic: "JWT with Spring Security",
    d: "hard",
    title: "How does Spring Security validate a JWT, and what must be checked?",
    kw: ["JwtDecoder", "NimbusJwtDecoder", "issuer-uri", "jwk-set-uri", "signature validation"],
    intent: "Checks that you know the verification steps and how the key is supplied.",
    short:
      "A `JwtDecoder` parses the token, verifies its signature with the correct key, and validates claims such as the expiry and not-before time, and optionally the issuer and audience. In Spring Boot you usually set `spring.security.oauth2.resourceserver.jwt.issuer-uri`, and the decoder discovers the public keys of the issuer, or `jwk-set-uri` to give the key set address directly. For a shared secret or a fixed public key, you create a `NimbusJwtDecoder` bean yourself. A token that fails any check is rejected with `401`.",
    detail: [
      "The algorithm must be fixed by your configuration. Never let the token choose it, and reject unsigned tokens.",
      "Keys can be rotated, so use a key set URL and let the library refresh it.",
      "Validate the audience too, so a token meant for another service is not accepted by yours.",
    ],
    ex: "The API trusts tokens only from `https://login.example.com`, signed with that issuer's published keys.",
    code: [
      "Boot properties and a custom decoder",
      "# application.properties\nspring.security.oauth2.resourceserver.jwt.issuer-uri=https://login.example.com\n\n// or a decoder from a public key\n@Bean\nJwtDecoder jwtDecoder(RSAPublicKey publicKey) {\n  return NimbusJwtDecoder.withPublicKey(publicKey).build();\n}",
      [
        "With `issuer-uri`, Boot builds a decoder that finds the issuer's keys.",
        "With a public key, you build the decoder yourself.",
        "Either way, the signature and the standard claims are checked on each request.",
      ],
      "java",
    ],
    mistakes: [
      "Skipping signature verification, or accepting a token with `alg: none`.",
      "Not checking the audience when the issuer serves many services.",
    ],
    follow: ["How are keys rotated safely?"],
    points: [
      "JwtDecoder verifies signature and claims",
      "issuer-uri or jwk-set-uri supplies the keys",
      "Fix the algorithm and validate the audience",
    ],
    notes: "`JwtDecoder` checks signature, expiry and issuer; configure `issuer-uri` or `jwk-set-uri`.",
    src: [
      ["Spring Security Reference: Minimal Configuration for JWTs", `${R}/oauth2/resource-server/jwt.html`],
      ["Spring Security Reference: Specifying the Authorization Server", `${R}/oauth2/resource-server/jwt.html`],
    ],
  }),
  g({
    slug: "jwt-claims-to-authorities",
    topic: "JWT with Spring Security",
    d: "hard",
    title: "How do JWT claims become authorities in Spring Security?",
    kw: ["JwtAuthenticationConverter", "JwtGrantedAuthoritiesConverter", "SCOPE_", "scope claim", "roles claim"],
    intent: "Checks that you can map token contents to your authorisation rules.",
    short:
      "By default, Spring Security's resource server reads the `scope` or `scp` claim, and turns each scope into an authority with the prefix `SCOPE_`, so a scope `orders:read` becomes `SCOPE_orders:read`, which a rule checks with `hasAuthority(\"SCOPE_orders:read\")`. If your token carries roles in another claim, for example `roles`, you configure a `JwtAuthenticationConverter` with a `JwtGrantedAuthoritiesConverter` that sets the claim name and the prefix, and register it on the JWT configuration. Then `hasRole(\"ADMIN\")` works with `ROLE_ADMIN` authorities.",
    detail: [
      "Keep the data in the token small, and do not put rapidly changing permissions in it, because it stays valid until it expires.",
      "The authentication principal is the `Jwt` object, and you can read custom claims from it.",
      "Test the mapping with a real token shape.",
    ],
    ex: "The token has `roles: [\"ADMIN\"]`, and the converter maps it to `ROLE_ADMIN`, so `/admin/**` rules work.",
    code: [
      "Mapping a roles claim",
      "@Bean\nJwtAuthenticationConverter jwtAuthenticationConverter() {\n  JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();\n  authorities.setAuthoritiesClaimName(\"roles\");\n  authorities.setAuthorityPrefix(\"ROLE_\");\n\n  JwtAuthenticationConverter converter = new JwtAuthenticationConverter();\n  converter.setJwtGrantedAuthoritiesConverter(authorities);\n  return converter;\n}\n\n// http.oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(jwtAuthenticationConverter())));",
      [
        "The converter reads the `roles` claim.",
        "Each value gets the `ROLE_` prefix, so `hasRole` rules work.",
        "The converter is plugged into the JWT configuration.",
      ],
      "java",
    ],
    mistakes: [
      "Checking `hasRole(\"ADMIN\")` while the authorities are `SCOPE_...`.",
      "Putting large or frequently changing permission lists inside the token.",
    ],
    follow: ["What prefix is used for scopes by default?"],
    points: [
      "Default: scope claim → SCOPE_ authorities",
      "JwtAuthenticationConverter for custom claims",
      "Keep tokens small",
    ],
    notes: "Default `scope` → `SCOPE_x`. For a `roles` claim, configure a `JwtGrantedAuthoritiesConverter`.",
    src: [
      ["Spring Security Reference: Extracting Authorities Manually", `${R}/oauth2/resource-server/jwt.html`],
      ["Spring Security Reference: OAuth 2.0 Resource Server", `${R}/oauth2/resource-server/index.html`],
    ],
  }),
  g({
    slug: "jwt-expiry-refresh-revocation",
    topic: "JWT with Spring Security",
    d: "hard",
    title: "How do you handle JWT expiry, refresh and revocation?",
    kw: ["access token", "refresh token", "token expiry", "revocation", "logout"],
    intent: "Checks that you know the main weakness of stateless tokens and how it is managed.",
    short:
      "A JWT is valid until it expires, and the server does not look anything up, so it cannot be cancelled easily before that. The usual design is a short-lived access token, for example a few minutes, and a longer-lived refresh token. When the access token expires, the client sends the refresh token to get a new one. The refresh token is tracked on the server, so it can be revoked at logout or when stolen, and it should be rotated on use. Revoking access tokens at once needs extra state, such as a deny-list, which brings back some cost of sessions.",
    detail: [
      "Short expiry limits the damage of a stolen access token.",
      "A refresh token is a long-lived credential, so protect it more carefully than the access token.",
      "Changing a user's role does not affect existing tokens until they expire.",
    ],
    ex: "An access token lives for 10 minutes, and logging out deletes the refresh token on the server, so no new access tokens can be issued.",
    mistakes: [
      "Issuing access tokens that last for days with no way to revoke them.",
      "Believing that \"logout\" removes a JWT that the client already copied.",
    ],
    follow: ["What is refresh token rotation?"],
    points: [
      "Short access tokens",
      "Refresh tokens tracked and revocable on the server",
      "Immediate revocation needs state",
    ],
    notes: "Short-lived access token + revocable refresh token. A pure JWT cannot be revoked before it expires.",
    src: [
      ["Spring Security Reference: OAuth 2.0 Resource Server", `${R}/oauth2/resource-server/index.html`],
      ["Spring Security Reference: Session Management", `${R}/authentication/session-management.html`],
    ],
  }),
  g({
    slug: "jwt-vs-session",
    topic: "JWT with Spring Security",
    d: "medium",
    title: "What are the trade-offs between JWT and server-side sessions?",
    kw: ["JWT vs session", "stateless", "session cookie", "scalability", "revocation"],
    intent: "Checks that you can compare the two without treating one as always better.",
    short:
      "With a server-side session, the server stores the login state and gives the browser only a random session id in a cookie. It can end a session at once, it keeps data off the client, and it is simple for server-rendered sites, but the server must store the state, and in a cluster it needs shared storage or sticky routing. A JWT carries the state in the token, so servers need no session store and scale easily, and it suits APIs used by mobile and third-party clients. The cost is that it cannot be revoked easily, it can grow large, and the client must store it safely.",
    detail: [
      "Neither is automatically more secure. The configuration and storage matter more.",
      "A session cookie should be `HttpOnly`, `Secure` and `SameSite`, and needs CSRF protection.",
      "Many applications use sessions for the website and tokens for the API.",
    ],
    ex: "A company's admin portal uses sessions, and its public API for partner apps uses tokens.",
    mistakes: [
      "Choosing JWT only because it is fashionable.",
      "Ignoring revocation and storage when choosing tokens.",
    ],
    follow: ["Where should a browser app keep a token?"],
    points: [
      "Session: server state, easy revocation",
      "JWT: stateless, hard to revoke",
      "Choose by client type and needs",
    ],
    notes: "Sessions: revocable, need storage. JWT: stateless, no easy revocation.",
    src: [
      ["Spring Security Reference: Session Management", `${R}/authentication/session-management.html`],
      ["Spring Security Reference: OAuth 2.0 Resource Server JWT", `${R}/oauth2/resource-server/jwt.html`],
    ],
  }),
  g({
    slug: "enable-method-security",
    topic: "Method security",
    d: "medium",
    title: "What is method security, and how do you turn it on?",
    kw: ["@EnableMethodSecurity", "@PreAuthorize", "method security", "SpEL", "defence in depth"],
    intent: "Checks that you can add rules at the service layer.",
    short:
      "Method security applies authorisation rules to Java methods, not only to URLs, using annotations such as `@PreAuthorize`, `@PostAuthorize`, `@PreFilter`, `@PostFilter` and `@Secured`. You turn it on with `@EnableMethodSecurity` on a configuration class, and Spring Security applies the checks through proxies around your beans. This protects the business logic wherever it is called from, which gives defence in depth, and it allows rules that depend on the method arguments or the returned object, which URL rules cannot express.",
    detail: [
      "`@EnableMethodSecurity` enables `@PreAuthorize` and `@PostAuthorize` by default, and replaced the older `@EnableGlobalMethodSecurity`.",
      "Because it uses proxies, it has the same limits as other proxy-based features, such as self-invocation.",
      "Keep URL rules for the coarse level and method rules for the fine level.",
    ],
    ex: "`OrderService.cancel` is allowed for the order's owner or for an admin, wherever the service is called from.",
    code: [
      "Enabling and using it",
      "@Configuration\n@EnableMethodSecurity\nclass MethodSecurityConfig { }\n\n@Service\nclass AdminService {\n  @PreAuthorize(\"hasRole('ADMIN')\")\n  void deleteUser(long id) { /* ... */ }\n}",
      [
        "`@EnableMethodSecurity` turns on the annotation checks.",
        "A call to `deleteUser` by a non-admin throws `AccessDeniedException`.",
        "The check works whether the call comes from a controller, a job or a test.",
      ],
      "java",
    ],
    mistakes: [
      "Annotating a bean without enabling method security, so that nothing is checked.",
      "Expecting the check to run on a call within the same class.",
    ],
    follow: ["Why does a self-invocation skip method security?"],
    points: [
      "@EnableMethodSecurity",
      "Annotations on services",
      "Defence in depth, proxy-based",
    ],
    notes: "`@EnableMethodSecurity` + `@PreAuthorize` on service methods; proxy-based like `@Transactional`.",
    src: [
      ["Spring Security Reference: Method Security", `${R}/authorization/method-security.html`],
      ["Spring Security Reference: Authorization Architecture", `${R}/authorization/architecture.html`],
    ],
  }),
  g({
    slug: "preauthorize-spel",
    topic: "Method security",
    d: "medium",
    title: "How do you write `@PreAuthorize` rules with SpEL?",
    kw: ["@PreAuthorize", "SpEL", "hasRole", "authentication.name", "#parameter"],
    intent: "Checks that you can express ownership and role rules in an annotation.",
    short:
      "`@PreAuthorize` takes a Spring Expression Language expression that is evaluated before the method runs, and the method is called only if the result is true. The expression can use `hasRole`, `hasAuthority`, `isAuthenticated()` and the current `authentication`, and it can refer to method parameters with `#name`. So `@PreAuthorize(\"hasRole('ADMIN') or #userId == authentication.principal.id\")` lets an admin or the user themselves call the method. A false result raises an `AccessDeniedException`, which becomes a `403`.",
    detail: [
      "Parameter names are available when the code is compiled with the `-parameters` flag, which Spring Boot builds do.",
      "Complex logic belongs in a bean, called with `@bean.canView(#id, authentication)`.",
      "Keep the expressions short, because they are strings and are not checked by the compiler.",
    ],
    ex: "A profile update method can be called by the profile's owner or an admin only.",
    code: [
      "Owner or admin",
      "@Service\nclass ProfileService {\n\n  @PreAuthorize(\"hasRole('ADMIN') or #userId == authentication.principal.id\")\n  Profile update(long userId, ProfileForm form) { /* ... */ return null; }\n\n  @PreAuthorize(\"@orderPolicy.canCancel(#orderId, authentication)\")\n  void cancel(long orderId) { /* ... */ }\n}",
      [
        "The first rule compares the argument with the current user's id.",
        "The second delegates a complex rule to a bean named `orderPolicy`.",
        "Failing either rule stops the method call with `AccessDeniedException`.",
      ],
      "java",
    ],
    mistakes: [
      "Writing long, hard-to-test expressions inside the annotation.",
      "Forgetting that the principal type must have the property that the expression uses.",
    ],
    follow: ["How do you unit test a method-security rule?"],
    points: [
      "SpEL evaluated before the call",
      "#param refers to arguments, authentication to the user",
      "Delegate complex rules to a bean",
    ],
    notes: "`@PreAuthorize(\"hasRole('ADMIN') or #id == authentication.principal.id\")`.",
    src: [
      ["Spring Security Reference: Authorizing with @PreAuthorize", `${R}/authorization/method-security.html`],
      ["Spring Security Reference: Method Security", `${R}/authorization/method-security.html`],
    ],
  }),
  g({
    slug: "postauthorize-and-postfilter",
    topic: "Method security",
    d: "hard",
    title: "What are `@PostAuthorize` and `@PostFilter`, and when do you use them?",
    kw: ["@PostAuthorize", "@PostFilter", "returnObject", "filterObject", "collection filtering"],
    intent: "Checks that you know checks that depend on the result of a method.",
    short:
      "`@PostAuthorize` runs after the method, and its expression can use `returnObject`, the value that the method returned, so it can check, for example, that the order belongs to the current user. If the check fails, an `AccessDeniedException` is thrown and the result is not returned. `@PostFilter` runs on a returned collection and removes the elements that fail the expression, using `filterObject`. They are convenient, but the method has already run, so they must not be used when the method has side effects, and `@PostFilter` loads all the elements first, which is inefficient for large data.",
    detail: [
      "For large collections, filter in the query with the current user, rather than after loading.",
      "A `@PostAuthorize` on a method that changes data does not undo the change.",
      "Prefer `@PreAuthorize` and ownership queries where possible.",
    ],
    ex: "`findOrder(id)` returns an order and `@PostAuthorize` checks `returnObject.ownerId == authentication.principal.id`.",
    code: [
      "Checks on the result",
      "@PostAuthorize(\"returnObject.ownerId == authentication.principal.id\")\nOrder findOrder(long id) {\n  return repository.findById(id).orElseThrow();\n}\n\n@PostFilter(\"filterObject.ownerId == authentication.principal.id\")\nList<Order> findAll() {\n  return repository.findAll();   // loads everything first\n}",
      [
        "The first check looks at the returned order and denies access to someone else's.",
        "The second removes other users' orders from the list, after loading them all.",
        "The query-based version of the second one would be more efficient.",
      ],
      "java",
    ],
    mistakes: [
      "Using `@PostAuthorize` on a method that modifies data.",
      "Using `@PostFilter` on a table with millions of rows.",
    ],
    follow: ["How would you avoid loading everything for @PostFilter?"],
    points: [
      "returnObject and filterObject",
      "Run after the method",
      "Not for side effects or large data",
    ],
    notes: "`@PostAuthorize` checks the result; `@PostFilter` trims a collection. Avoid for side effects and large data.",
    src: [
      ["Spring Security Reference: Authorizing with @PostAuthorize", `${R}/authorization/method-security.html`],
      ["Spring Security Reference: Filtering Method Parameters and Return Values", `${R}/authorization/method-security.html`],
    ],
  }),
  g({
    slug: "url-vs-method-security",
    topic: "Method security",
    d: "medium",
    title: "When do you use URL-based rules and when method security?",
    kw: ["URL security", "method security", "defence in depth", "service layer", "coarse-grained"],
    intent: "Checks that you can combine both levels sensibly.",
    short:
      "URL rules in `authorizeHttpRequests` are coarse: they decide which kinds of users can reach which areas, such as `/admin/**` for admins. They are applied at the edge, before the controller. Method security is fine-grained and sits next to the business logic: it can check the arguments and the returned object, for example that a user may change only their own record, and it still protects the method when it is called from a job, a message listener or another service. Use URL rules for the structure, and method rules for the business-specific decisions. Both together give defence in depth.",
    detail: [
      "URL rules can miss a path that you add later, so end with a deny or authenticate rule.",
      "Method rules can be missed on a new method, so tests should cover them.",
      "Put authorisation where the data is accessed, and not only in the UI.",
    ],
    ex: "`/admin/**` requires the admin role at the URL level, and `OrderService.cancel` checks the owner at the method level.",
    mistakes: [
      "Relying on URL rules only for data-specific access control.",
      "Relying on the UI to hide buttons as the security measure.",
    ],
    follow: ["What is defence in depth?"],
    points: [
      "URL: coarse, at the edge",
      "Method: fine, with arguments and results",
      "Use both",
    ],
    notes: "URL rules = coarse structure. Method security = business rules. Use both.",
    src: [
      ["Spring Security Reference: Authorize HttpServletRequests", `${R}/authorization/authorize-http-requests.html`],
      ["Spring Security Reference: Method Security", `${R}/authorization/method-security.html`],
    ],
  }),
  g({
    slug: "what-is-cors",
    topic: "CORS & CSRF",
    d: "easy",
    title: "What is CORS and why does the browser block my request?",
    kw: ["CORS", "same-origin policy", "preflight", "Access-Control-Allow-Origin", "origin"],
    intent: "Checks that you understand it as a browser rule and not a server security feature.",
    short:
      "Browsers enforce the same-origin policy: JavaScript from one origin, which is the scheme, host and port, cannot read responses from another origin unless that server allows it. Cross-Origin Resource Sharing (CORS) is the mechanism that lets a server say which other origins may read its responses, with headers such as `Access-Control-Allow-Origin`. For requests that could change data or use special headers, the browser first sends a preflight `OPTIONS` request to ask for permission. CORS protects users' browsers, and it is not authentication, because tools such as `curl` ignore it.",
    detail: [
      "A CORS error appears in the browser console, even though the server did respond.",
      "A front end on `localhost:5173` calling an API on `localhost:8080` is a cross-origin request.",
      "A server should allow only the origins that it trusts.",
    ],
    ex: "A React app on `https://app.shop.com` can call `https://api.shop.com` only if the API allows that origin.",
    mistakes: [
      "Thinking that CORS protects the API from other clients.",
      "Allowing every origin together with credentials.",
    ],
    follow: ["What is a preflight request?"],
    points: [
      "Same-origin policy in the browser",
      "Server allows origins with headers",
      "Preflight OPTIONS for non-simple requests",
    ],
    notes: "CORS = the server tells browsers which other origins may read its responses. Not authentication.",
    src: [
      ["Spring Security Reference: CORS", `${R}/integrations/cors.html`],
      ["MDN: Cross-Origin Resource Sharing (CORS)", "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"],
    ],
  }),
  g({
    slug: "configure-cors-spring-security",
    topic: "CORS & CSRF",
    d: "medium",
    title: "How do you configure CORS with Spring Security?",
    kw: ["CorsConfigurationSource", "cors()", "allowedOrigins", "allowCredentials", "preflight"],
    intent: "Checks that you configure it in the security chain and not only in MVC.",
    short:
      "Spring Security must handle CORS before authentication, because a preflight `OPTIONS` request carries no credentials and would otherwise be rejected with `401`. So you enable it in the filter chain with `http.cors(Customizer.withDefaults())` and provide a `CorsConfigurationSource` bean that lists the allowed origins, methods and headers. List the exact origins that you trust. You cannot combine `allowedOrigins(\"*\")` with `allowCredentials(true)`, and wildcards for credentialed requests are rejected by the browser, so name the origins, or use origin patterns carefully.",
    detail: [
      "`@CrossOrigin` on controllers also works with Spring MVC, but the chain-level configuration is the dependable one with security.",
      "`maxAge` lets the browser cache the preflight result.",
      "Different environments need different allowed origins, so take them from configuration.",
    ],
    ex: "The API allows `https://app.shop.com` with the `GET`, `POST` and `PUT` methods and the `Authorization` header.",
    code: [
      "CORS in the security chain",
      "@Bean\nSecurityFilterChain chain(HttpSecurity http) throws Exception {\n  http.cors(Customizer.withDefaults())\n      .authorizeHttpRequests(a -> a.anyRequest().authenticated());\n  return http.build();\n}\n\n@Bean\nCorsConfigurationSource corsConfigurationSource() {\n  CorsConfiguration cfg = new CorsConfiguration();\n  cfg.setAllowedOrigins(List.of(\"https://app.shop.com\"));\n  cfg.setAllowedMethods(List.of(\"GET\", \"POST\", \"PUT\", \"DELETE\"));\n  cfg.setAllowedHeaders(List.of(\"Authorization\", \"Content-Type\"));\n  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();\n  source.registerCorsConfiguration(\"/api/**\", cfg);\n  return source;\n}",
      [
        "`cors()` puts the CORS filter before authentication, so preflights succeed.",
        "The source names the exact trusted origin and the allowed methods and headers.",
        "It applies only to the `/api/**` paths.",
      ],
      "java",
    ],
    mistakes: [
      "Configuring CORS only in MVC, so preflight requests get `401`.",
      "Using `*` for origins together with credentials.",
    ],
    follow: ["Why does a preflight need CORS support in the security chain?"],
    points: [
      "http.cors() + CorsConfigurationSource",
      "Exact origins, not *",
      "Preflight must pass before authentication",
    ],
    notes: "`http.cors(...)` + a `CorsConfigurationSource` bean with exact origins.",
    src: [
      ["Spring Security Reference: CORS", `${R}/integrations/cors.html`],
      ["Spring Security Reference: Java Configuration", `${R}/configuration/java.html`],
    ],
  }),
  g({
    slug: "what-is-csrf",
    topic: "CORS & CSRF",
    d: "medium",
    title: "What is CSRF and how does Spring Security protect against it?",
    kw: ["CSRF", "cross-site request forgery", "CSRF token", "session cookie", "SameSite"],
    intent: "Checks that you know the attack and the default protection.",
    short:
      "Cross-Site Request Forgery tricks a logged-in user's browser into sending a request to your site from another site, and because the browser attaches the session cookie automatically, the server sees it as a genuine request. Spring Security protects against it by default for requests that change state, such as `POST`, `PUT` and `DELETE`: it requires a secret CSRF token, generated by the server and sent by the page with each such request, as a hidden form field or a header. A forged request from another site cannot know the token, so it is rejected with `403`.",
    detail: [
      "`SameSite` cookies add a second line of defence in modern browsers.",
      "Server-rendered forms get the token automatically with Thymeleaf.",
      "Single-page applications can read the token from a cookie, with `CookieCsrfTokenRepository`, and send it in a header.",
    ],
    ex: "A malicious page posts a transfer form to your bank's URL, and the request fails because it has no valid CSRF token.",
    mistakes: [
      "Disabling CSRF in an application that uses cookie-based sessions.",
      "Using `GET` requests to change data, which CSRF protection does not cover.",
    ],
    follow: ["When is it safe to disable CSRF protection?"],
    points: [
      "Forged request using the victim's cookie",
      "Token required on state-changing requests",
      "SameSite cookies help",
    ],
    notes: "CSRF: browser sends cookies automatically. Defence: secret CSRF token on POST/PUT/DELETE.",
    src: [
      ["Spring Security Reference: Cross Site Request Forgery (CSRF)", `${R}/exploits/csrf.html`],
      ["Spring Security Reference: CSRF and Session Cookies (SameSite)", `${R}/authentication/session-management.html`],
    ],
  }),
  g({
    slug: "when-to-disable-csrf",
    topic: "CORS & CSRF",
    d: "hard",
    title: "When can you disable CSRF protection, and when must you not?",
    kw: ["csrf disable", "stateless API", "bearer token", "cookie authentication", "CookieCsrfTokenRepository"],
    intent: "Checks that you know the reason, and not only the line of code.",
    short:
      "CSRF works because browsers attach cookies automatically. If your API authenticates every request with something that the browser does not attach on its own, such as an `Authorization: Bearer` header set by JavaScript, then a forged cross-site request carries no credentials, and CSRF protection adds little, so disabling it for that stateless API is reasonable. If authentication uses a session cookie, or any cookie that the browser sends automatically, you must keep CSRF protection enabled. A single-page app that logs in with cookies should use the cookie-based token repository and send the token in a header.",
    detail: [
      "Do not disable CSRF just because the `403` was annoying in development. Fix the client to send the token.",
      "An application with a form-login web part and a token API can use two chains, with CSRF on only for the first.",
      "Disabling CSRF does not remove the need to configure CORS and security headers.",
    ],
    ex: "A mobile API with bearer tokens disables CSRF, and the web admin site with sessions keeps it.",
    code: [
      "Token repository for a single-page app",
      "http.csrf(csrf -> csrf\n    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));",
      [
        "The token is stored in a cookie that JavaScript can read.",
        "The client copies it into the `X-XSRF-TOKEN` header on each state-changing request.",
        "A cross-site page cannot read the cookie, so it cannot forge the header.",
      ],
      "java",
    ],
    mistakes: [
      "Disabling CSRF for a cookie-authenticated application.",
      "Believing that disabling CSRF is harmless because \"it is an API\".",
    ],
    follow: ["How does a single-page app send the token?"],
    points: [
      "Cookie auth → keep CSRF",
      "Header-only bearer tokens → can disable",
      "Do not disable to silence a 403",
    ],
    notes: "Disable CSRF only for stateless APIs that authenticate with a header token, never for cookie sessions.",
    src: [
      ["Spring Security Reference: Cross Site Request Forgery (CSRF)", `${R}/exploits/csrf.html`],
      ["Spring Security Reference: Single-Page Applications", `${R}/exploits/csrf.html`],
    ],
  }),
  g({
    slug: "security-headers",
    topic: "CORS & CSRF",
    d: "medium",
    title: "Which security headers does Spring Security add, and why?",
    kw: ["security headers", "X-Content-Type-Options", "Strict-Transport-Security", "Content-Security-Policy", "clickjacking"],
    intent: "Checks that you know the cheap browser-side protections.",
    short:
      "By default, Spring Security adds several response headers. `X-Content-Type-Options: nosniff` stops the browser from guessing content types. `X-Frame-Options` (or a frame-ancestors policy) prevents the page from being shown in a frame on another site, which protects against clickjacking. `Strict-Transport-Security` tells browsers to use HTTPS only for the site, and it is sent only on HTTPS responses. Cache-control headers stop sensitive pages from being cached. You can add a `Content-Security-Policy` yourself, to limit the sources of scripts and reduce the damage of cross-site scripting.",
    detail: [
      "A strict Content-Security-Policy takes planning, because it can break inline scripts.",
      "Headers reduce risk, but they do not replace input validation and output encoding.",
      "Check the headers of your deployed application, not only the code.",
    ],
    ex: "The site sets a policy that allows scripts only from its own origin and blocks framing by other sites.",
    code: [
      "Adding a content security policy",
      "http.headers(h -> h\n    .contentSecurityPolicy(csp -> csp.policyDirectives(\"default-src 'self'; frame-ancestors 'none'\")));",
      [
        "The default headers stay enabled.",
        "The policy limits content to the site's own origin and forbids framing.",
      ],
      "java",
    ],
    mistakes: [
      "Disabling all default headers to fix one problem.",
      "Adding a very permissive policy that gives no protection.",
    ],
    follow: ["What does HSTS do?"],
    points: [
      "nosniff, frame protection, HSTS, cache control by default",
      "Content-Security-Policy is added by you",
      "Defence in depth, not a replacement for validation",
    ],
    notes: "Default headers: nosniff, frame options, HSTS, cache control. Add a CSP for XSS defence.",
    src: [
      ["Spring Security Reference: Security HTTP Response Headers", `${R}/exploits/headers.html`],
      ["Spring Security Reference: Java Configuration", `${R}/configuration/java.html`],
    ],
  }),
])
