import { mod } from "./factory"

export const MERN_MODULES = [
  mod(
    "nodejs",
    "Node.js",
    "backend",
    "mern-backend",
    "intermediate",
    "Runtime model, event loop, streams, modules, internals and production concerns.",
    [
      ["Event loop", 90],
      ["Modules", 60],
      ["Streams", 90],
      ["Async patterns", 80],
      ["Clustering", 60],
      ["Node internals (V8 and libuv)", 70],
    ],
    { prerequisites: ["javascript"] }
  ),
  mod(
    "express",
    "Express.js",
    "backend",
    "mern-backend",
    "intermediate",
    "Routing, middleware, error handling, REST endpoints and structuring Express apps.",
    [
      ["Routing", 50],
      ["Middleware", 70],
      ["Error handling", 60],
      ["Project structure", 50],
      ["REST API development", 60],
    ],
    { prerequisites: ["nodejs"] }
  ),
  mod(
    "authentication",
    "Authentication & Authorization",
    "security",
    "mern-backend",
    "intermediate",
    "Sessions, JWT, OAuth2/OIDC, RBAC, OTP and secure credential handling.",
    [
      ["Sessions vs tokens", 60],
      ["JWT", 80],
      ["OAuth2/OIDC", 90],
      ["RBAC", 60],
      ["Password storage", 45],
      ["OTP", 45],
    ],
    { prerequisites: ["rest-apis"], alsoIn: ["java-backend", "foundation"] }
  ),
  mod(
    "web-security",
    "Web & API Security",
    "security",
    "mern-backend",
    "intermediate",
    "OWASP Top 10, XSS, CSRF, CORS, injection, rate limiting and secure headers.",
    [
      ["XSS", 40],
      ["CSRF", 40],
      ["CORS", 40],
      ["Injection", 45],
      ["Headers", 35],
      ["Rate limiting", 40],
      ["Input validation", 40],
    ],
    { prerequisites: ["authentication"], alsoIn: ["frontend"] }
  ),
  mod(
    "caching",
    "Caching",
    "backend",
    "mern-backend",
    "intermediate",
    "HTTP and in-memory caching, invalidation and common caching patterns.",
    [
      ["HTTP caching", 45],
      ["In-memory caching", 50],
      ["Cache invalidation", 50],
      ["Cache-aside and write-through", 45],
    ],
    { alsoIn: ["java-backend"] }
  ),
  mod(
    "payments",
    "Payment Gateway Integration",
    "backend",
    "mern-backend",
    "intermediate",
    "Accepting payments with Razorpay: orders, verification, webhooks and failure handling.",
    [
      ["Payment flow & orders", 60],
      ["Razorpay integration", 90],
      ["Webhooks & signature verification", 60],
      ["Failure & refund handling", 45],
    ],
    { prerequisites: ["rest-apis"] }
  ),
]
