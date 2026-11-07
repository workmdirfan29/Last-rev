import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-security", {
  slug: "authentication-and-the-filter-chain",
  title: "Authentication and the filter chain",
  topic: "Authentication",
  minutes: 90,
  overview:
    "Understand what Spring Security does, how its filter chain and authentication flow work, and how to load users and store passwords safely.",
  objectives: [
    "Explain authentication versus authorisation and the default behaviour",
    "Describe the filter chain, AuthenticationManager and SecurityContext",
    "Use UserDetailsService, PasswordEncoder, form login and HTTP Basic",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What Spring Security is",
      body: [
        "**Spring Security** provides **authentication**, which checks who the user is, **authorisation**, which checks what the user may do, and protection against common attacks such as CSRF, session fixation and clickjacking. For a web application it is a **chain of servlet filters** in front of your controllers. When you add the Spring Boot security starter with no configuration, every endpoint requires authentication, a default login form and HTTP Basic are enabled, and a generated password for a user named `user` is printed at start-up. You then replace these defaults with your own configuration. The defaults are deliberately strict: deny unless you allow.",
        "Spring Security registers one filter, `DelegatingFilterProxy`, which hands each request to the `FilterChainProxy`. That chooses the `SecurityFilterChain` whose matcher fits, and the request passes through that chain's filters, which handle the security context, CSRF, authentication and authorisation. You configure it by declaring a **`SecurityFilterChain` bean** built from `HttpSecurity`. The old `WebSecurityConfigurerAdapter` is gone.",
      ],
    },
    {
      kind: "code",
      heading: "A filter chain bean",
      example: {
        title: "SecurityFilterChain",
        language: "java",
        code: '@Configuration\n@EnableWebSecurity\nclass SecurityConfig {\n\n  @Bean\n  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    http\n      .authorizeHttpRequests(auth -> auth\n          .requestMatchers("/public/**").permitAll()\n          .anyRequest().authenticated())\n      .formLogin(Customizer.withDefaults())\n      .httpBasic(Customizer.withDefaults());\n    return http.build();\n  }\n}',
        walkthrough: [
          "A `SecurityFilterChain` bean replaces the old adapter class.",
          "`/public/**` is open, and every other request requires authentication.",
          "`formLogin` and `httpBasic` add their filters to the chain.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The authentication flow",
      body: [
        "A filter reads the credentials and creates an **unauthenticated** `Authentication` object, such as a username and password token. It passes it to the **`AuthenticationManager`**, usually a `ProviderManager`, which asks its **`AuthenticationProvider`s** in turn until one supports and accepts it. The common `DaoAuthenticationProvider` loads the user with a **`UserDetailsService`** and checks the password with a **`PasswordEncoder`**. On success it returns a fully populated `Authentication`, with the principal and the authorities, and it is stored in the **`SecurityContext`**, held by the `SecurityContextHolder`. On failure, an `AuthenticationException` is thrown.",
        "The `SecurityContext` is normally kept in the HTTP session between requests, or not stored at all in a stateless API. In a controller, `@AuthenticationPrincipal` or a `Principal` argument is a clean way to get the current user.",
      ],
    },
    {
      kind: "explain",
      heading: "Passwords and users",
      body: [
        "Passwords must **never be stored in plain text**, or with a fast hash such as MD5 or plain SHA-256. Use a **slow, salted, adaptive** algorithm. The `PasswordEncoder` interface has `encode` to hash and `matches` to compare. `BCryptPasswordEncoder` is the common implementation: it adds a random salt, so the same password gives a different hash every time, and has a cost factor that you can raise. `PasswordEncoderFactories.createDelegatingPasswordEncoder()` stores an id such as `{bcrypt}` with the hash, which allows the algorithm to change later. A hash cannot be decrypted, so a forgotten password is reset, never recovered.",
        "To load users from your own database, implement `UserDetailsService.loadUserByUsername(String)`, return a `UserDetails` with the **hash**, the authorities and the account flags, or throw `UsernameNotFoundException`, and expose it as a bean. Do not tell the client whether the username or the password was wrong.",
      ],
    },
    {
      kind: "code",
      heading: "Users from a database",
      example: {
        title: "UserDetailsService and encoder",
        language: "java",
        code: '@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder();\n}\n\n@Service\nclass DbUserDetailsService implements UserDetailsService {\n  private final UserRepository users;\n\n  DbUserDetailsService(UserRepository users) {\n    this.users = users;\n  }\n\n  @Override\n  public UserDetails loadUserByUsername(String email) {\n    AppUser u = users.findByEmail(email)\n        .orElseThrow(() -> new UsernameNotFoundException("Unknown user"));\n    return User.withUsername(u.getEmail())\n        .password(u.getPasswordHash())\n        .roles(u.getRole())\n        .disabled(!u.isActive())\n        .build();\n  }\n}',
        walkthrough: [
          "The encoder bean lets Spring Security use the same encoder when it checks a login.",
          "The service finds the user, or throws `UsernameNotFoundException`, and builds a `UserDetails` with the stored hash and the roles.",
          "The provider compares the submitted password with that hash. The raw password is never read.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Form login and HTTP Basic",
      body: [
        "**Form login** shows an HTML login page, checks the credentials once, and then keeps the user logged in with a session cookie. It suits server-rendered sites used by people. **HTTP Basic** sends the username and password with **every request** in the `Authorization: Basic` header, encoded with base64, which is **not encryption**, so it must be used over HTTPS only. It suits simple service-to-service calls, but exposes the credentials on every request. For modern APIs and single-page applications, token-based authentication is usually used, which a later lesson covers.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Confusing authentication (who) with authorisation (what they may do).",
          fix: "They are separate steps.",
        },
        {
          mistake: "Storing passwords with a fast hash, or in plain text.",
          fix: "Use BCrypt or the delegating encoder.",
        },
        {
          mistake: "Extending WebSecurityConfigurerAdapter.",
          fix: "It no longer exists. Declare a SecurityFilterChain bean.",
        },
        {
          mistake:
            "Returning different errors for an unknown user and a wrong password.",
          fix: "Use one generic message.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Adding login to a web app",
      scenario:
        "An application needs a login page backed by its own user table.",
      body: [
        "Add the security starter, a `UserDetailsService` that reads the table, a `BCryptPasswordEncoder` bean, and a filter chain with form login. Signup stores `encode(rawPassword)`, and the framework checks logins.",
        "No code of yours compares passwords.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "auth-vs-authz",
      prompt:
        "What is the difference between authentication and authorisation?",
      options: [
        "Who you are versus what you may do",
        "Login versus logout",
        "Passwords versus tokens",
      ],
      answer: 0,
      explanation: "Authentication comes first.",
    },
    {
      type: "single",
      id: "auth-encoder",
      prompt: "Which is the right way to store a password?",
      options: ["A salted, adaptive hash such as bcrypt", "Plain text", "MD5"],
      answer: 0,
      explanation: "The hash is slow on purpose, and cannot be reversed.",
    },
    {
      type: "truefalse",
      id: "auth-basic",
      statement: "HTTP Basic encrypts the credentials.",
      answer: false,
      explanation: "Base64 is only an encoding. Use HTTPS.",
    },
    {
      type: "blank",
      id: "auth-bean",
      prompt:
        "The modern way to configure the filter chain is to declare a ___ bean.",
      answer: "SecurityFilterChain",
      explanation: "The adapter class was removed.",
    },
  ],
  assignment: {
    title: "Secure a small app",
    task: [
      "Add Spring Security to a project, replace the generated user with users from a table, and hash the passwords with BCrypt.",
      "Test that a wrong password and an unknown user produce the same response, and print the filters that ran with debug logging.",
    ],
    checklist: [
      "Passwords are hashed with BCrypt",
      "Unknown user and wrong password look the same",
      "I can name the main filters in the chain",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "auth-ex",
      title: "Create a user with a hash",
      task: [
        "Write a method `register(String email, String rawPassword)` in a service that saves an `AppUser` with the password hashed by the `PasswordEncoder`.",
      ],
      language: "java",
      starter: "@Service\nclass SignupService {\n  // your code\n}",
      solution:
        "@Service\nclass SignupService {\n  private final UserRepository users;\n  private final PasswordEncoder encoder;\n\n  SignupService(UserRepository users, PasswordEncoder encoder) {\n    this.users = users;\n    this.encoder = encoder;\n  }\n\n  void register(String email, String rawPassword) {\n    users.save(new AppUser(email, encoder.encode(rawPassword)));\n  }\n}",
      hints: ["Never store the raw password."],
      checklist: [
        "The password is encoded before saving",
        "The encoder is injected",
        "The raw password is not kept",
      ],
    },
  ],
  revisionNotes: [
    "Authentication = who; authorisation = what; Boot secures everything by default",
    "DelegatingFilterProxy → FilterChainProxy → SecurityFilterChain",
    "Filter → AuthenticationManager → provider → UserDetailsService + PasswordEncoder → SecurityContext",
    "BCrypt (or the delegating encoder); Basic needs HTTPS; form login uses a session",
  ],
  resources: [
    {
      label: "Spring Security Reference: Architecture",
      url: "https://docs.spring.io/spring-security/reference/servlet/architecture.html",
    },
    {
      label: "Spring Security Reference: Authentication Architecture",
      url: "https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html",
    },
    {
      label: "Spring Security Reference: Password Storage",
      url: "https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/storage.html",
    },
  ],
})
