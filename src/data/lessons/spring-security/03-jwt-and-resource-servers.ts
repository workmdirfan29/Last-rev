import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-security", {
  slug: "jwt-and-resource-servers",
  title: "JWT and stateless authentication with Spring Security",
  topic: "JWT with Spring Security",
  minutes: 90,
  overview:
    "Understand JWT, configure Spring Security as a resource server, map claims to authorities, and handle expiry, refresh and revocation.",
  objectives: [
    "Describe the parts of a JWT and what it protects",
    "Configure a stateless resource server and validate tokens",
    "Map claims to authorities and plan expiry and revocation",
  ],
  prerequisites: ["lesson.spring-security.authorization-rules"],
  sections: [
    {
      kind: "explain",
      heading: "What a JWT is",
      body: [
        "A **JSON Web Token** has three parts separated by dots: a **header** with the signing algorithm, a **payload** with **claims** such as the subject (`sub`), the issuer (`iss`), the expiry (`exp`) and custom data, and a **signature**. The first two parts are base64url-encoded JSON, so **anyone can read them**. The signature proves that the token was created by someone who holds the key and has not been changed. A signed JWT is therefore **tamper-evident but not secret**: never put passwords or sensitive personal data in it.",
        "The server verifies the signature and checks `exp` before trusting any claim. A token can be signed with a shared secret (HMAC) or with a private key (RSA or EC) and verified with the public key.",
      ],
    },
    {
      kind: "explain",
      heading: "The stateless flow",
      body: [
        "The client first authenticates, for example by posting its credentials to a login endpoint or to an authorisation server, and receives a signed token. For every later request, it sends the token in the **`Authorization: Bearer <token>`** header. The server validates the token on each request and builds the authenticated user from its claims, and keeps **no session**, so each request is independent and any instance can serve it.",
        "In Spring Security you configure the application as an **OAuth 2 resource server**: `oauth2ResourceServer(o -> o.jwt(...))`, with the session policy `STATELESS`. Resource server support **validates** tokens. Issuing them is done by an authorisation server or your own login code. With a header token, CSRF protection is normally not needed, because browsers do not attach the header automatically. The token must be sent only over HTTPS.",
      ],
    },
    {
      kind: "code",
      heading: "A stateless API",
      example: {
        title: "oauth2ResourceServer",
        language: "java",
        code: '@Bean\nSecurityFilterChain api(HttpSecurity http) throws Exception {\n  http\n    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n    .csrf(csrf -> csrf.disable())\n    .authorizeHttpRequests(a -> a\n        .requestMatchers("/auth/login").permitAll()\n        .anyRequest().authenticated())\n    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()));\n  return http.build();\n}\n\n# application.properties\n# spring.security.oauth2.resourceserver.jwt.issuer-uri=https://login.example.com',
        walkthrough: [
          "No HTTP session is created or used.",
          "CSRF is disabled only because authentication uses a header token, not a cookie.",
          "With `issuer-uri`, Boot builds a `JwtDecoder` that discovers the issuer's public keys, and validates signature, expiry and issuer on each request.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Claims to authorities",
      body: [
        'By default, the resource server reads the `scope` or `scp` claim, and turns each scope into an authority with the prefix **`SCOPE_`**, so a scope `orders:read` becomes `SCOPE_orders:read`, checked with `hasAuthority("SCOPE_orders:read")`. If your token carries roles in another claim, such as `roles`, configure a `JwtAuthenticationConverter` with a `JwtGrantedAuthoritiesConverter` that sets the claim name and the prefix, and register it. Then `hasRole("ADMIN")` works with `ROLE_ADMIN`.',
        "Keep the data in the token small, and do not put quickly changing permissions in it, because it stays valid until it expires. The **algorithm must be fixed by your configuration**, and never chosen by the token. Reject unsigned tokens, and validate the **audience** too, so a token meant for another service is not accepted.",
      ],
    },
    {
      kind: "code",
      heading: "Mapping a roles claim",
      example: {
        title: "JwtAuthenticationConverter",
        language: "java",
        code: '@Bean\nJwtAuthenticationConverter jwtAuthenticationConverter() {\n  JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();\n  authorities.setAuthoritiesClaimName("roles");\n  authorities.setAuthorityPrefix("ROLE_");\n\n  JwtAuthenticationConverter converter = new JwtAuthenticationConverter();\n  converter.setJwtGrantedAuthoritiesConverter(authorities);\n  return converter;\n}\n\n// http.oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(jwtAuthenticationConverter())));',
        walkthrough: [
          "The converter reads the `roles` claim.",
          "Each value gets the `ROLE_` prefix, so `hasRole` rules work.",
          "The converter is plugged into the JWT configuration of the resource server.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Expiry, refresh and revocation",
      body: [
        "A JWT is valid until it expires, and the server looks nothing up, so it **cannot be cancelled easily** before that. The usual design is a **short-lived access token**, for example a few minutes, and a **longer-lived refresh token**. When the access token expires, the client sends the refresh token to get a new one. The refresh token is tracked on the server, so it can be revoked at logout or when it is stolen, and it should be **rotated** on use. Revoking access tokens at once needs extra state, such as a deny-list, which brings back some of the cost of sessions.",
        "**JWT versus sessions:** a server-side session can be ended at once, keeps data off the client and is simple for server-rendered sites, but the server must store the state. A JWT needs no session store and suits APIs, mobile apps and third-party clients, but is hard to revoke. Neither is automatically more secure. Many applications use sessions for the website and tokens for the API.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting secrets in the payload.",
          fix: "The payload is readable. Keep it free of secrets.",
        },
        {
          mistake: "Skipping signature, expiry or audience checks.",
          fix: "Use the resource server support, which validates them.",
        },
        {
          mistake: "Disabling CSRF for a cookie-based session application.",
          fix: "Disable it only for header-token APIs.",
        },
        {
          mistake: "Issuing access tokens that last for days.",
          fix: "Use short access tokens and revocable refresh tokens.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A mobile app and an API",
      scenario:
        "A mobile app calls an API, and users must be able to log out everywhere.",
      body: [
        "The app logs in once and gets a 10-minute access token and a refresh token. The API is a stateless resource server. Logging out deletes the refresh token on the server, so no new access tokens are issued, and the old one expires within minutes.",
        "The design accepts a short delay in exchange for a simple, stateless API.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "jwt-parts",
      prompt: "What are the three parts of a JWT?",
      options: [
        "Header, payload, signature",
        "Key, value, hash",
        "User, password, role",
      ],
      answer: 0,
      explanation: "The first two are readable.",
    },
    {
      type: "single",
      id: "jwt-scope",
      prompt:
        "What prefix does Spring Security add to scope authorities by default?",
      options: ["SCOPE_", "ROLE_", "AUTH_"],
      answer: 0,
      explanation: "Configure a converter for other claims such as `roles`.",
    },
    {
      type: "truefalse",
      id: "jwt-secret",
      statement: "A JWT payload is encrypted, so it can hold passwords.",
      answer: false,
      explanation: "A signed JWT is readable. Do not put secrets in it.",
    },
    {
      type: "single",
      id: "jwt-revoke",
      prompt: "Why is a JWT hard to revoke?",
      options: [
        "The server keeps no state and the token is valid until it expires",
        "It is encrypted",
        "It is too short",
      ],
      answer: 0,
      explanation: "Short expiry and refresh tokens manage the risk.",
    },
  ],
  assignment: {
    title: "A resource server",
    task: [
      "Configure a Spring Boot API as a stateless resource server with `issuer-uri`, and call it with and without a bearer token.",
      "Add a converter for a `roles` claim, protect an admin endpoint with `hasRole`, and write down your expiry, refresh and logout design.",
    ],
    checklist: [
      "The API returns 401 without a token",
      "Roles from the claim work with hasRole",
      "I can explain why CSRF is off here",
    ],
    minutes: 40,
  },
  exercises: [
    {
      slug: "jwt-ex",
      title: "Map the roles claim",
      task: [
        'Write the bean that makes `hasRole("ADMIN")` work when the token has the claim `"roles": ["ADMIN"]`.',
      ],
      language: "java",
      starter:
        "@Bean\nJwtAuthenticationConverter jwtAuthenticationConverter() {\n  // your code\n}",
      solution:
        '@Bean\nJwtAuthenticationConverter jwtAuthenticationConverter() {\n  JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();\n  authorities.setAuthoritiesClaimName("roles");\n  authorities.setAuthorityPrefix("ROLE_");\n\n  JwtAuthenticationConverter converter = new JwtAuthenticationConverter();\n  converter.setJwtGrantedAuthoritiesConverter(authorities);\n  return converter;\n}',
      hints: ["Set the claim name and the `ROLE_` prefix."],
      checklist: [
        "The claim name is roles",
        "The prefix is ROLE_",
        "The converter is returned",
      ],
    },
  ],
  revisionNotes: [
    "JWT = header.payload.signature: tamper-evident, readable, not encrypted",
    "Stateless: `Authorization: Bearer`, STATELESS sessions, `oauth2ResourceServer`",
    "Default scope → SCOPE_; custom claims need a converter; fix the algorithm, check the audience",
    "Short access tokens + revocable refresh tokens; JWT vs sessions is a trade-off",
  ],
  resources: [
    {
      label: "Spring Security Reference: OAuth 2.0 Resource Server JWT",
      url: "https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html",
    },
    {
      label: "Spring Security Reference: OAuth 2.0 Resource Server",
      url: "https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html",
    },
    {
      label: "Spring Security Reference: Session Management",
      url: "https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html",
    },
  ],
})
