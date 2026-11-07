/**
 * Where a question's sourceRef may point. Official documentation and standards only. Extend this list
 * when a new module needs another official site: it is data, not code.
 *
 * `host` matches the hostname itself or any subdomain of it (so `react.dev` allows `www.react.dev`).
 * `pathPrefix`, when present, narrows a shared host to its documentation area.
 */
export interface AllowedSource {
  host: string
  pathPrefix?: string
  /** Why this site is trusted, for reviewers. */
  note: string
}

export const ALLOWED_SOURCES: readonly AllowedSource[] = [
  // Web platform and JavaScript
  { host: "developer.mozilla.org", note: "MDN Web Docs" },
  { host: "tc39.es", note: "ECMAScript specification" },
  { host: "ecma-international.org", note: "ECMAScript standard" },
  { host: "w3.org", note: "W3C standards" },
  { host: "whatwg.org", note: "WHATWG living standards" },
  { host: "web.dev", note: "Google web platform guidance" },
  // Frontend frameworks and tooling
  { host: "react.dev", note: "React documentation" },
  { host: "reactrouter.com", note: "React Router documentation" },
  { host: "redux-toolkit.js.org", note: "Redux Toolkit documentation" },
  { host: "redux.js.org", note: "Redux documentation" },
  { host: "react-redux.js.org", note: "React Redux documentation" },
  { host: "zustand.docs.pmnd.rs", note: "Zustand documentation" },
  { host: "tanstack.com", note: "TanStack documentation" },
  { host: "typescriptlang.org", note: "TypeScript documentation" },
  { host: "tailwindcss.com", note: "Tailwind CSS documentation" },
  { host: "ui.shadcn.com", note: "shadcn/ui documentation" },
  {
    host: "recharts.github.io",
    pathPrefix: "/en-US",
    note: "Recharts documentation",
  },
  { host: "vitest.dev", note: "Vitest documentation" },
  { host: "jestjs.io", note: "Jest documentation" },
  { host: "testing-library.com", note: "Testing Library documentation" },
  { host: "mswjs.io", note: "Mock Service Worker documentation" },
  { host: "docs.pytest.org", note: "pytest documentation" },
  { host: "playwright.dev", note: "Playwright documentation" },
  { host: "help.figma.com", note: "Figma Help Center" },
  {
    host: "agilemanifesto.org",
    note: "Manifesto for Agile Software Development",
  },
  { host: "scrumguides.org", note: "The Scrum Guide" },
  { host: "code.visualstudio.com", note: "Visual Studio Code documentation" },
  { host: "site.mockito.org", note: "Mockito documentation" },
  { host: "junit.org", note: "JUnit documentation" },
  {
    host: "developer.chrome.com",
    pathPrefix: "/docs",
    note: "Chrome DevTools and Lighthouse documentation",
  },
  { host: "zod.dev", note: "Zod documentation" },
  { host: "react-hook-form.com", note: "React Hook Form documentation" },
  { host: "reactnative.dev", note: "React Native documentation" },
  { host: "docs.expo.dev", note: "Expo documentation" },
  // Java
  { host: "docs.oracle.com", note: "Oracle Java documentation" },
  { host: "openjdk.org", note: "OpenJDK" },
  { host: "docs.spring.io", note: "Spring documentation" },
  { host: "hibernate.org", note: "Hibernate documentation" },
  { host: "jakarta.ee", note: "Jakarta EE specifications" },
  { host: "logging.apache.org", note: "Apache Logging (Log4j)" },
  // Node
  { host: "nodejs.org", note: "Node.js documentation" },
  { host: "expressjs.com", note: "Express documentation" },
  { host: "mongoosejs.com", note: "Mongoose documentation" },
  // Python and data
  { host: "docs.python.org", note: "Python documentation" },
  { host: "python.org", note: "Python language site" },
  { host: "docs.djangoproject.com", note: "Django documentation" },
  {
    host: "django-rest-framework.org",
    note: "Django REST framework documentation",
  },
  { host: "fastapi.tiangolo.com", note: "FastAPI documentation" },
  { host: "numpy.org", note: "NumPy documentation" },
  { host: "pandas.pydata.org", note: "pandas documentation" },
  { host: "matplotlib.org", note: "Matplotlib documentation" },
  { host: "scikit-learn.org", note: "scikit-learn documentation" },
  { host: "pytorch.org", note: "PyTorch documentation" },
  { host: "tensorflow.org", note: "TensorFlow documentation" },
  // Databases
  { host: "postgresql.org", note: "PostgreSQL documentation" },
  { host: "mongodb.com", pathPrefix: "/docs", note: "MongoDB documentation" },
  { host: "dev.mysql.com", note: "MySQL reference manual" },
  { host: "sqlite.org", note: "SQLite documentation" },
  {
    host: "learn.microsoft.com",
    pathPrefix: "/en-us/",
    note: "Microsoft Learn documentation",
  },
  { host: "redis.io", note: "Redis documentation" },
  {
    host: "razorpay.com",
    pathPrefix: "/docs",
    note: "Razorpay payments documentation",
  },
  // DevOps, Linux and cloud
  { host: "git-scm.com", note: "Git documentation" },
  { host: "docs.github.com", note: "GitHub documentation" },
  {
    host: "support.atlassian.com",
    note: "Atlassian (Jira, Bitbucket) documentation",
  },
  { host: "docs.docker.com", note: "Docker documentation" },
  { host: "nginx.org", note: "Nginx documentation" },
  { host: "jenkins.io", note: "Jenkins documentation" },
  { host: "pm2.keymetrics.io", note: "PM2 documentation" },
  { host: "letsencrypt.org", note: "Let's Encrypt documentation" },
  { host: "kernel.org", note: "Linux kernel documentation and man pages" },
  { host: "man7.org", note: "Linux man pages" },
  { host: "gnu.org", note: "GNU manuals" },
  {
    host: "ubuntu.com",
    pathPrefix: "/server/docs",
    note: "Ubuntu Server documentation",
  },
  { host: "docs.aws.amazon.com", note: "AWS documentation" },
  {
    host: "kubernetes.io",
    pathPrefix: "/docs",
    note: "Kubernetes documentation",
  },
  // Standards, security and protocols
  { host: "datatracker.ietf.org", note: "IETF RFCs" },
  { host: "rfc-editor.org", note: "IETF RFCs" },
  { host: "owasp.org", note: "OWASP" },
  { host: "openapis.org", note: "OpenAPI Initiative" },
  { host: "swagger.io", pathPrefix: "/docs", note: "Swagger documentation" },
  { host: "learning.postman.com", note: "Postman documentation" },
  { host: "oauth.net", note: "OAuth specifications" },
  { host: "openid.net", note: "OpenID specifications" },
  // AI
  {
    host: "platform.openai.com",
    pathPrefix: "/docs",
    note: "OpenAI API documentation",
  },
  { host: "docs.anthropic.com", note: "Anthropic documentation" },
  {
    host: "huggingface.co",
    pathPrefix: "/docs",
    note: "Hugging Face documentation",
  },
  { host: "python.langchain.com", note: "LangChain documentation" },
  { host: "docs.langchain.com", note: "LangChain documentation" },
  // Data science
  { host: "docs.scipy.org", note: "SciPy documentation" },
  { host: "docs.jupyter.org", note: "Project Jupyter documentation" },
  { host: "seaborn.pydata.org", note: "Seaborn documentation" },
  { host: "airflow.apache.org", note: "Apache Airflow documentation" },
  // Mobile
  { host: "reactnavigation.org", note: "React Navigation documentation" },
  { host: "developer.android.com", note: "Android developer documentation" },
  {
    host: "support.google.com",
    pathPrefix: "/googleplay",
    note: "Google Play Console help",
  },
]
