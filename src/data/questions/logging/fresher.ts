import { defineQuestions } from "../author"
import { q } from "../compact"

const L4 = "https://logging.apache.org/log4j/2.x/manual"
const OW =
  "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
const CW = "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs"
const EXP = "https://expressjs.com/en/advanced/best-practice-performance.html"

export default defineQuestions("logging", "fresher", [
  q({
    slug: "why-logging-matters",
    topic: "Log levels & structure",
    d: "easy",
    title:
      "Why do applications need logging, and what makes a log message useful?",
    kw: [
      "logging",
      "observability",
      "troubleshooting",
      "audit trail",
      "log message",
    ],
    intent:
      "A foundation question: checks you see logs as a tool for diagnosis and accountability.",
    short:
      "Logs are the record of what an application did, so you can diagnose failures, understand behaviour in production, investigate security incidents and keep an audit trail. A useful log message says what happened, when, where and in what context: a timestamp, a severity level, the component, a clear message, and identifiers such as a request id or user id. It must not contain secrets or sensitive personal data. Logs that are too sparse cannot explain an incident, and logs that are too noisy bury the important entries.",
    detail: [
      "OWASP's logging guidance covers when, where, who and what to record for each event.",
      "Log events at boundaries: requests, failures, important business actions, and security events such as logins.",
      "Logs complement metrics and traces rather than replacing them.",
    ],
    ex: "A failed payment is traceable from one request id through the API, the gateway call and the database update.",
    mistakes: [
      "Messages like 'error occurred' with no context.",
      "Logging passwords or tokens.",
    ],
    follow: ["What context should every log entry carry?"],
    points: [
      "Diagnosis, monitoring, audit",
      "Timestamp, level, component, message, ids",
      "No secrets or sensitive data",
      "Balance detail against noise",
    ],
    notes: ["Log what you will need at 3 a.m."],
    src: [["OWASP: Logging Cheat Sheet", OW]],
  }),
  q({
    slug: "log-levels-explained",
    topic: "Log levels & structure",
    d: "easy",
    title: "What are log levels and how do you choose one?",
    kw: [
      "log levels",
      "trace debug info warn error",
      "severity",
      "level filtering",
      "fatal",
    ],
    intent: "Checks you can pick the right severity and filter by it.",
    short:
      "Log levels classify messages by severity so output can be filtered. Common levels, from most to least severe, are FATAL, ERROR, WARN, INFO, DEBUG and TRACE. A logger set to a level emits messages at that level and anything more severe, so INFO in production drops DEBUG and TRACE. Use ERROR for failures that need attention, WARN for unexpected but handled situations, INFO for significant normal events such as startup and completed business actions, and DEBUG or TRACE for developer detail. The exact conventions vary between teams.",
    detail: [
      "Levels can be changed per logger without redeploying, in many frameworks.",
      "Log4j's documentation notes it defines the levels but not their purpose, so agree a team convention.",
      "Debug logging in production can be expensive and may expose data.",
    ],
    ex: "Production runs at INFO, and a single package is raised to DEBUG for an hour while diagnosing a problem.",
    mistakes: [
      "Logging expected conditions as ERROR.",
      "Leaving DEBUG on in production.",
    ],
    follow: ["What happens to DEBUG messages when the level is INFO?"],
    points: [
      "FATAL, ERROR, WARN, INFO, DEBUG, TRACE",
      "A level includes more severe ones",
      "ERROR for failures, INFO for milestones",
      "Agree a team convention",
    ],
    notes: ["Level = severity filter."],
    src: [
      ["Apache Log4j: Levels", `${L4}/customloglevels.html`],
      ["RFC 5424: Syslog severities", "https://www.rfc-editor.org/rfc/rfc5424"],
    ],
  }),
  q({
    slug: "structured-json-logging",
    topic: "Log levels & structure",
    d: "medium",
    title: "What is structured logging and why is it better than plain text?",
    kw: [
      "structured logging",
      "json logs",
      "log fields",
      "machine-readable",
      "searchability",
    ],
    intent: "Checks you know why logs should be queryable.",
    short:
      'Structured logging writes each event as data with named fields, typically one JSON object per line, such as `{"time":"...","level":"error","msg":"payment failed","orderId":42,"requestId":"a1"}`, instead of free text. Log tools can then filter and aggregate by field, for example all errors for one order, without fragile text parsing. Include consistent field names across services, ISO timestamps in UTC, the level, a request or correlation id and the message. Human-readable formats are still fine locally, but production logs benefit from structure.',
    detail: [
      "Log4j offers JsonTemplateLayout, a layout that encodes events as JSON, while PatternLayout is meant for human-readable text.",
      "Keep field names and types stable, since changing them breaks queries.",
      "Do not log huge payloads; log identifiers instead.",
    ],
    ex: "Searching a log platform for `requestId = a1` returns every entry from every service for that request.",
    code: [
      [
        "A JSON log line",
        "json",
        `{"time":"2026-03-01T09:30:12Z","level":"error","msg":"payment failed","orderId":42,"requestId":"a1b2c3","error":"card_declined"}`,
        [
          "Each field can be filtered separately.",
          "The request id links related lines.",
        ],
      ],
    ],
    mistakes: [
      "Unstructured sentences that need regexes to parse.",
      "Inconsistent field names across services.",
    ],
    follow: ["Which fields would you always include?"],
    points: [
      "Events as data with fields",
      "JSON lines are easy to ship and query",
      "Consistent names, UTC timestamps",
      "Include correlation ids",
    ],
    notes: ["Log data, not prose."],
    src: [
      ["Apache Log4j: Layouts", `${L4}/layouts.html`],
      ["OWASP: Logging Cheat Sheet", OW],
    ],
  }),
  q({
    slug: "correlation-ids-and-context",
    topic: "Log levels & structure",
    d: "medium",
    title: "What is a correlation (request) id and how does it help debugging?",
    kw: [
      "correlation id",
      "request id",
      "trace id",
      "mdc",
      "distributed tracing",
    ],
    intent: "Checks you can follow one request across log lines and services.",
    short:
      "A correlation id, or request id, is a unique identifier created when a request first arrives (or taken from an incoming header) and attached to every log entry produced while handling it, and passed on to downstream calls. With it you can filter the logs for a single request and see its whole path, even when many requests are interleaved or span several services. In Java, Log4j's thread context map makes values available to all log statements on the thread; in Node, AsyncLocalStorage or a logger with child contexts does the same.",
    detail: [
      "Return the id to the client, for example in a response header, so support can ask for it.",
      "Generate ids with a random generator such as a UUID.",
      "Standard tracing tools use trace and span ids for the same purpose.",
    ],
    ex: "A user reports an error and quotes the request id from the error page; support finds all related log lines in seconds.",
    mistakes: [
      "Logs from concurrent requests with no way to separate them.",
      "Not forwarding the id to downstream services.",
    ],
    follow: ["How do you carry the id through async code in Node?"],
    points: [
      "Unique id per request",
      "Attached to every log entry",
      "Forwarded to downstream services",
      "Shown to users for support",
    ],
    notes: ["One id, the whole story."],
    src: [
      ["Apache Log4j: Thread Context", `${L4}/thread-context.html`],
      [
        "Node.js: AsyncLocalStorage",
        "https://nodejs.org/api/async_context.html",
      ],
    ],
  }),
  q({
    slug: "what-not-to-log-and-log-injection",
    topic: "Log levels & structure",
    d: "medium",
    title: "What should you never write to logs, and what is log injection?",
    kw: [
      "sensitive data in logs",
      "pii",
      "log injection",
      "newline injection",
      "redaction",
    ],
    intent: "Checks you protect users and the log pipeline.",
    short:
      "Do not log secrets or sensitive data such as passwords, access tokens, encryption keys, database connection strings, payment card data and unnecessary personal information; OWASP's logging guidance lists these as data to exclude or mask. Also treat logged user input as untrusted: log injection occurs when input containing line breaks or delimiter characters forges extra log lines or corrupts a structured format, so sanitise or encode data for the output format. Restrict access to logs, since they are often readable by many people.",
    detail: [
      "Structured loggers escape values for you; manual string concatenation does not.",
      "Redact fields such as `authorization` and `password` centrally.",
      "Logs are data subject to retention and privacy rules.",
    ],
    ex: "A logger configuration masks the Authorization header and any field named password before writing.",
    mistakes: [
      "Logging whole request bodies on login routes.",
      "Concatenating raw user input into log lines.",
    ],
    follow: [
      "What could an attacker do with newline characters in a log line?",
    ],
    points: [
      "No passwords, tokens, keys, card data",
      "Redact centrally",
      "Sanitise untrusted input to avoid log injection",
      "Restrict log access",
    ],
    notes: ["Logs are not a safe place for secrets."],
    src: [["OWASP: Logging Cheat Sheet", OW]],
  }),
  q({
    slug: "what-to-log-events",
    topic: "Log levels & structure",
    d: "easy",
    title: "Which events should an application log?",
    kw: [
      "events to log",
      "security events",
      "audit log",
      "business events",
      "errors",
    ],
    intent: "Checks you decide deliberately what is worth recording.",
    short:
      "Log what you will need to understand and secure the system: application start and stop with configuration (without secrets), incoming requests with method, path, status and duration, errors and exceptions with stack traces, calls to external services and their failures, important business events such as orders and payments, and security-relevant events such as logins, failed logins, permission failures and changes to roles. Use the right level for each, and avoid logging inside tight loops or for every trivial step.",
    detail: [
      "Access logs and application logs have different purposes; both are useful.",
      "Security events should include who, what, when and from where.",
      "Log the outcome of important operations, not just the attempt.",
    ],
    ex: "A failed login logs the account id, the source IP and the time at WARN level, without the submitted password.",
    mistakes: [
      "Logging nothing about failures.",
      "Logging every loop iteration.",
    ],
    follow: ["Which security events matter?"],
    points: [
      "Startup and shutdown",
      "Requests with status and duration",
      "Errors with stack traces",
      "Business and security events",
    ],
    notes: ["Log decisions and outcomes."],
    src: [["OWASP: Logging Cheat Sheet", OW]],
  }),
  q({
    slug: "log4j-architecture",
    topic: "Log4j",
    d: "easy",
    title: "What are loggers, appenders and layouts in Log4j?",
    kw: ["log4j2", "logger", "appender", "layout", "logger context"],
    intent:
      "A core Java logging question: checks you know the three building blocks.",
    short:
      "Apache Log4j 2 splits logging into three concepts. A Logger is what your code calls to create log events. An Appender delivers events to a destination such as the console, a file, a socket or a database. A Layout formats each event into the output, for example a text pattern or JSON. Configuration connects them: it says which loggers are active at which level and which appenders they send to. Loggers are obtained by name, normally the class name, from `LogManager.getLogger()`.",
    detail: [
      "A LoggerContext holds the configuration and creates loggers.",
      "Log4j has an API and a core implementation that can be separated.",
      "The same API can drive different output destinations without code changes.",
    ],
    ex: "A service logs through a Logger; one appender writes plain text to the console and another writes JSON to a rolling file.",
    code: [
      [
        "Getting a logger",
        "java",
        `import org.apache.logging.log4j.LogManager;\nimport org.apache.logging.log4j.Logger;\n\npublic class OrderService {\n  private static final Logger LOGGER = LogManager.getLogger();\n\n  void place(long id) {\n    LOGGER.info("placing order {}", id);\n  }\n}`,
        [
          "`LogManager.getLogger()` returns a logger named after the class.",
          "The `{}` placeholder is filled with the argument.",
        ],
      ],
    ],
    mistakes: [
      "Creating loggers for each call instead of a static field.",
      "Mixing up appenders and layouts.",
    ],
    follow: ["What does an appender do?"],
    points: [
      "Logger: creates events",
      "Appender: destination",
      "Layout: format",
      "Configuration connects them",
    ],
    notes: ["Logger, appender, layout."],
    src: [
      ["Apache Log4j: Architecture", `${L4}/architecture.html`],
      ["Apache Log4j: Log4j API", `${L4}/api.html`],
    ],
  }),
  q({
    slug: "log4j-configuration-xml",
    topic: "Log4j",
    d: "medium",
    title: "How do you configure Log4j 2 with log4j2.xml?",
    kw: [
      "log4j2.xml",
      "configuration",
      "root logger",
      "appenderref",
      "monitorInterval",
    ],
    intent: "Checks you can read and write a basic configuration file.",
    short:
      "Log4j 2 reads a configuration file such as `log4j2.xml` (also JSON, YAML or properties formats) found on the classpath. It declares appenders, such as a Console with a PatternLayout, and loggers: a Root logger with a default level and appender references, and named loggers that override the level for particular packages. Setting `monitorInterval` makes Log4j poll the file and reconfigure itself when it changes, so levels can be changed without restarting. Do not provide several configuration files with the same name but different extensions.",
    detail: [
      'A `Logger` element with `additivity="false"` stops events also going to the parent\'s appenders.',
      "Library code should not ship its own configuration; applications do.",
      "Spring Boot and other frameworks can also set levels through their own properties.",
    ],
    ex: "The root logger logs INFO to the console, while `com.example.payments` logs DEBUG to a file.",
    code: [
      [
        "log4j2.xml",
        "xml",
        `<Configuration monitorInterval="30">\n  <Appenders>\n    <Console name="CONSOLE">\n      <PatternLayout pattern="%d [%t] %p %c - %m%n"/>\n    </Console>\n  </Appenders>\n  <Loggers>\n    <Logger name="com.example.payments" level="DEBUG"/>\n    <Root level="INFO">\n      <AppenderRef ref="CONSOLE"/>\n    </Root>\n  </Loggers>\n</Configuration>`,
        [
          "The console appender uses a pattern layout.",
          "A named logger sets DEBUG for one package.",
          "Root logs INFO to the console.",
        ],
      ],
    ],
    mistakes: [
      "No appender reference on the root logger, so nothing is output.",
      "Duplicate configuration files in different formats.",
    ],
    follow: ["What does monitorInterval do?"],
    points: [
      "log4j2.xml on the classpath",
      "Appenders, loggers and root",
      "Named loggers override levels",
      "monitorInterval enables hot reload",
    ],
    notes: ["Appenders defined, loggers wired."],
    src: [["Apache Log4j: Configuration file", `${L4}/configuration.html`]],
  }),
  q({
    slug: "log4j-logger-hierarchy-levels",
    topic: "Log4j",
    d: "medium",
    title: "How do logger names, the hierarchy and additivity work in Log4j?",
    kw: [
      "logger hierarchy",
      "logger name",
      "additivity",
      "inheritance",
      "package level",
    ],
    intent: "Checks you understand how a level set on a package applies.",
    short:
      "Loggers are named, normally by the fully qualified class name, and names form a hierarchy by dots, so `com.example.shop.OrderService` is a child of `com.example.shop`, `com.example` and the root logger. A logger inherits the level from its closest configured ancestor, so setting `com.example.shop` to DEBUG affects every class below it. Events also pass up to the parent loggers' appenders unless `additivity=\"false\"` is set on the logger. This lets you tune verbosity per package and route a package's logs to its own file.",
    detail: [
      "Using the class name as the logger name gives you per-class control for free.",
      "Additivity can cause duplicate lines if a logger and its parent use the same appender.",
      "Levels are compared by their priority values.",
    ],
    ex: "Raising `org.hibernate.SQL` to DEBUG shows SQL statements without making the rest of the app verbose.",
    mistakes: [
      "Duplicate log lines from additivity.",
      "Setting root to DEBUG and drowning in library output.",
    ],
    follow: ["What does additivity=false do?"],
    points: [
      "Dot-separated names form a hierarchy",
      "Children inherit levels",
      "Events propagate to parent appenders",
      "additivity=false stops propagation",
    ],
    notes: ["Package-level control by name."],
    src: [
      ["Apache Log4j: Configuration file", `${L4}/configuration.html`],
      ["Apache Log4j: Levels", `${L4}/customloglevels.html`],
    ],
  }),
  q({
    slug: "log4j-parameterized-messages-and-exceptions",
    topic: "Log4j",
    d: "medium",
    title:
      "How should you write log statements with parameters and exceptions in Log4j?",
    kw: [
      "parameterized logging",
      "placeholders",
      "exception logging",
      "supplier",
      "string concatenation",
    ],
    intent:
      "Checks you know the efficient and correct way to log values and errors.",
    short:
      'Use parameterized messages with `{}` placeholders, as in `LOGGER.info("user {} logged in", userId)`, instead of string concatenation. The message is only formatted if that level is enabled, so disabled debug statements cost almost nothing. When an argument is expensive to compute, pass a `Supplier` so it is evaluated only if the statement will be logged. To log an exception with its stack trace, pass the Throwable as the last argument, for example `LOGGER.error("payment failed for order {}", orderId, ex)`, instead of logging only `ex.getMessage()`.',
    detail: [
      "Never concatenate untrusted data into the format string itself.",
      "Log an exception once, at the place where it is handled, to avoid duplicates.",
      "Do not swallow exceptions after logging if callers need to know.",
    ],
    ex: "A payment failure logs the order id and the full exception so the stack trace appears in the log.",
    code: [
      [
        "Parameters and exceptions",
        "java",
        `LOGGER.debug("loaded {} items", items.size());\nLOGGER.error("payment failed for order {}", orderId, ex);\nLOGGER.debug("details: {}", () -> expensiveDump());`,
        [
          "Placeholders avoid string building when disabled.",
          "The exception is the last argument.",
          "The supplier delays expensive work.",
        ],
      ],
    ],
    mistakes: [
      "String concatenation in log calls.",
      "Logging only the exception message and losing the stack trace.",
    ],
    follow: ["Why use a Supplier?"],
    points: [
      "{} placeholders",
      "Throwable as the last argument",
      "Suppliers for costly arguments",
      "Log an exception once",
    ],
    notes: ["Placeholders, not concatenation."],
    src: [["Apache Log4j: Log4j API", `${L4}/api.html`]],
  }),
  q({
    slug: "log4j-rolling-file-appender",
    topic: "Log4j",
    d: "medium",
    title: "How do you stop log files growing forever in Log4j?",
    kw: [
      "rolling file appender",
      "time based triggering",
      "size based triggering",
      "filePattern",
      "retention",
    ],
    intent: "Checks you can configure rotation inside the logging framework.",
    short:
      "Use a RollingFile appender, which writes to a current file and rolls it over into archived files according to triggering policies. A `TimeBasedTriggeringPolicy` rolls over when the smallest time unit in the `filePattern` changes, for example daily when the pattern contains a date, and a `SizeBasedTriggeringPolicy` rolls over once the file reaches a size like 20MB. A rollover strategy limits how many archives are kept, and compression can be enabled by ending the file pattern with `.gz`. This bounds disk use and keeps old logs for a defined time.",
    detail: [
      "The `filePattern` defines the archive names and the time unit.",
      "In containers, logging to the console and letting the platform collect it is often preferred.",
      "Sensible retention depends on legal and operational needs.",
    ],
    ex: "The service rolls its log daily or at 100 MB, keeping seven compressed archives.",
    code: [
      [
        "RollingFile appender",
        "xml",
        `<RollingFile name="FILE" fileName="logs/app.log"\n             filePattern="logs/app-%d{yyyy-MM-dd}-%i.log.gz">\n  <PatternLayout pattern="%d %p %c - %m%n"/>\n  <Policies>\n    <TimeBasedTriggeringPolicy/>\n    <SizeBasedTriggeringPolicy size="100MB"/>\n  </Policies>\n  <DefaultRolloverStrategy max="7"/>\n</RollingFile>`,
        [
          "Policies decide when to roll over.",
          "`.gz` compresses archives.",
          '`max="7"` limits the number of archives.',
        ],
      ],
    ],
    mistakes: [
      "A plain file appender that grows without limit.",
      "Rotation settings but no retention limit.",
    ],
    follow: ["What triggers a rollover?"],
    points: [
      "RollingFile appender",
      "Time-based and size-based policies",
      "filePattern names archives",
      "Limit and compress archives",
    ],
    notes: ["Roll over and limit."],
    src: [
      [
        "Apache Log4j: Rolling file appenders",
        `${L4}/appenders/rolling-file.html`,
      ],
    ],
  }),
  q({
    slug: "log4j-async-logging-and-security",
    topic: "Log4j",
    d: "hard",
    title:
      "What are asynchronous loggers in Log4j, and why must Log4j be kept up to date?",
    kw: [
      "async logger",
      "lmax disruptor",
      "log4shell",
      "cve-2021-44228",
      "security updates",
    ],
    intent:
      "Checks you know a performance option and the security history of the library.",
    short:
      "Asynchronous logging moves the work of formatting and writing events to a separate thread so application threads do not wait for I/O. Log4j offers asynchronous appenders, queue-based, and asynchronous loggers, which are based on the LMAX Disruptor, a lock-free inter-thread library, giving higher throughput and lower latency. The trade-off is that events can be lost or delayed if the process dies abruptly. Separately, Log4j has had serious vulnerabilities, including CVE-2021-44228, the critical remote code execution flaw involving JNDI lookups (Log4Shell), so always run a supported, patched version and follow the project's security page.",
    detail: [
      "Upgrade rather than relying on only mitigations such as disabling lookups.",
      "Scan dependencies to find transitive uses of Log4j.",
      "Asynchronous logging adds complexity in error handling and ordering.",
    ],
    ex: "A high-throughput service switches to asynchronous loggers, and the team subscribes to Log4j security announcements.",
    mistakes: [
      "Running an old, vulnerable Log4j version.",
      "Using async logging without understanding possible loss on a crash.",
    ],
    follow: ["What was Log4Shell?"],
    points: [
      "Async logging reduces I/O waits",
      "Based on LMAX Disruptor",
      "Possible loss on abrupt exit",
      "Keep Log4j patched",
    ],
    notes: ["Async for speed, patching for safety."],
    src: [
      ["Apache Log4j: Asynchronous loggers", `${L4}/async.html`],
      [
        "Apache Logging Services: Security",
        "https://logging.apache.org/log4j/2.x/security.html",
      ],
    ],
  }),
  q({
    slug: "node-console-stdout-stderr",
    topic: "Node.js logging",
    d: "easy",
    title:
      "What is the difference between console.log and console.error, and where do they go?",
    kw: ["console.log", "console.error", "stdout", "stderr", "redirect"],
    intent: "Checks you know the two output streams.",
    short:
      "`console.log` and `console.info` write to standard output (stdout), while `console.error` and `console.warn` write to standard error (stderr). They are separate streams, so you can redirect them independently, for example `node app.js > out.log 2> err.log`, and platforms like Docker and systemd capture both. Use stdout for normal application output and stderr for errors and diagnostics. In production, applications are usually expected to write logs to these streams and let the environment collect, store and rotate them.",
    detail: [
      "`console.table` and `console.dir` help inspect data during development.",
      "A logging library lets you add levels, timestamps and structure on top.",
      "The console methods are fine for scripts and development.",
    ],
    ex: "A container's `docker logs` shows both stdout and stderr of the Node process.",
    mistakes: [
      "Writing all output to stdout so errors are not distinguishable.",
      "Expecting console.log to write to a file by itself.",
    ],
    follow: ["How do you redirect stderr to a file?"],
    points: [
      "log/info to stdout",
      "error/warn to stderr",
      "Streams are redirected separately",
      "Platforms collect them",
    ],
    notes: ["Two streams, two destinations."],
    src: [
      ["Node.js: Console", "https://nodejs.org/api/console.html"],
      [
        "Node.js: process.stdout",
        "https://nodejs.org/api/process.html#processstdout",
      ],
    ],
  }),
  q({
    slug: "node-logging-library-vs-console",
    topic: "Node.js logging",
    d: "medium",
    title:
      "Why use a logging library such as Pino instead of console.log in production?",
    kw: ["pino", "winston", "synchronous console", "json logger", "log levels"],
    intent: "Checks you know the limits of console.log in a server.",
    short:
      "The Express production guidance notes that `console.log` and `console.error` are synchronous when the destination is a terminal or a file, so they are not suitable for production unless you pipe the output to another program. For application activity it recommends a logging library such as Pino. A logging library adds severity levels, structured JSON output, timestamps, child loggers with bound context, redaction of sensitive fields and efficient output, and lets you change the level through configuration. For debugging, a module like `debug` that is controlled by the `DEBUG` environment variable avoids noise.",
    detail: [
      "Pino and Winston are commonly used Node.js logging libraries.",
      "Write to stdout and let the platform ship the logs.",
      "Avoid logging inside hot paths in a way that blocks the event loop.",
    ],
    ex: "An Express API logs each request as one JSON line with method, path, status and duration.",
    code: [
      [
        "Pino basics",
        "js",
        `import pino from "pino"\n\nconst logger = pino({ level: process.env.LOG_LEVEL ?? "info" })\nconst reqLogger = logger.child({ requestId: "a1b2c3" })\n\nreqLogger.info({ orderId: 42 }, "order placed")\nreqLogger.error({ err }, "payment failed")`,
        [
          "The level comes from configuration.",
          "A child logger binds a request id.",
          "Objects add structured fields.",
        ],
      ],
    ],
    mistakes: [
      "console.log everywhere in a high-traffic server.",
      "No level control in production.",
    ],
    follow: ["What does a child logger give you?"],
    points: [
      "console methods can be synchronous",
      "Libraries add levels and structure",
      "Child loggers carry context",
      "Configure level by environment",
    ],
    notes: ["Library for activity, debug module for debugging."],
    src: [
      ["Express: Production best practices: performance (logging)", EXP],
      ["Node.js: Console", "https://nodejs.org/api/console.html"],
    ],
  }),
  q({
    slug: "node-express-request-logging",
    topic: "Node.js logging",
    d: "medium",
    title: "How do you log HTTP requests in an Express app?",
    kw: [
      "request logging",
      "express middleware",
      "access log",
      "response time",
      "status code",
    ],
    intent: "Checks you can add an access log with the useful fields.",
    short:
      "Add a middleware near the top of the stack that records each request when its response finishes: method, URL path, status code, response time, and a request id, and usually the client IP (correct only when `trust proxy` is set behind a proxy). Listen for the response's `finish` event to read the final status and measure duration. Libraries exist for this, but the idea is simple. Avoid logging request bodies and sensitive headers, and keep logs structured so they can be searched by status or duration.",
    detail: [
      "Log 5xx responses at ERROR or WARN level and normal ones at INFO.",
      "Skip noisy endpoints such as health checks, or log them at a lower level.",
      "The reverse proxy also writes its own access log.",
    ],
    ex: "Each request produces a JSON line with status and duration, making slow endpoints easy to find.",
    code: [
      [
        "A request logger",
        "js",
        `import { randomUUID } from "node:crypto"\n\napp.use((req, res, next) => {\n  const start = process.hrtime.bigint()\n  const requestId = req.get("x-request-id") ?? randomUUID()\n  res.set("x-request-id", requestId)\n  res.on("finish", () => {\n    const ms = Number(process.hrtime.bigint() - start) / 1e6\n    logger.info({ requestId, method: req.method, path: req.path, status: res.statusCode, ms })\n  })\n  next()\n})`,
        [
          "A request id is created or reused.",
          "`finish` fires when the response is sent.",
          "Duration and status are logged.",
        ],
      ],
    ],
    mistakes: [
      "Logging before the response so the status is unknown.",
      "Logging full bodies that contain passwords.",
    ],
    follow: ["Why log on the finish event?"],
    points: [
      "Middleware early in the chain",
      "Method, path, status, duration, id",
      "Log on response finish",
      "No bodies or secrets",
    ],
    notes: ["Log the outcome, not the secrets."],
    src: [
      [
        "Express: Using middleware",
        "https://expressjs.com/en/guide/using-middleware.html",
      ],
      [
        "Node.js: http (response finish event)",
        "https://nodejs.org/api/http.html",
      ],
    ],
  }),
  q({
    slug: "node-error-logging-and-uncaught",
    topic: "Node.js logging",
    d: "medium",
    title: "How do you log errors and uncaught exceptions in Node.js?",
    kw: [
      "uncaughtException",
      "unhandledRejection",
      "error middleware",
      "stack trace",
      "exit process",
    ],
    intent: "Checks you capture crashes with their cause.",
    short:
      'Log errors with their stack trace and context at the place you handle them, for example in an Express error-handling middleware that logs the error and returns a generic response. For failures that escape everything, listen to `process.on("uncaughtException")` and `unhandledRejection`, log the full error synchronously, and then exit, because the process may be in an unreliable state; the process manager restarts it. The Express guidance warns that apps crash on uncaught exceptions, so handle errors properly with try/catch and promises, and ensure the app restarts automatically.',
    detail: [
      "Send a generic message to clients and keep details in the logs.",
      "Include a request id so the log entry can be matched to the user's report.",
      "Alert on error rates, not only individual entries.",
    ],
    ex: "The error middleware logs `err.stack` with the request id and responds `500 Internal error` with that id.",
    code: [
      [
        "Last-resort handlers",
        "js",
        `process.on("uncaughtException", (err) => {\n  logger.fatal({ err }, "uncaught exception")\n  process.exit(1)\n})\nprocess.on("unhandledRejection", (reason) => {\n  logger.error({ reason }, "unhandled rejection")\n})`,
        [
          "Fatal errors are logged before exit.",
          "The process manager restarts the app.",
        ],
      ],
    ],
    mistakes: [
      "Swallowing errors without logging.",
      "Continuing to run after an uncaught exception as if nothing happened.",
    ],
    follow: ["Why exit after an uncaught exception?"],
    points: [
      "Log stack trace and context",
      "Error middleware for request errors",
      "Handlers for uncaught exceptions and rejections",
      "Exit and let the manager restart",
    ],
    notes: ["Log it, then restart cleanly."],
    src: [
      [
        "Express: Production best practices: performance (handle exceptions)",
        EXP,
      ],
      [
        "Express: Error handling",
        "https://expressjs.com/en/guide/error-handling.html",
      ],
    ],
  }),
  q({
    slug: "node-debug-module-and-env-control",
    topic: "Node.js logging",
    d: "easy",
    title:
      "How do you control log verbosity in a Node.js app without changing code?",
    kw: [
      "LOG_LEVEL",
      "DEBUG environment variable",
      "runtime configuration",
      "NODE_DEBUG",
      "verbosity",
    ],
    intent: "Checks you configure logging through the environment.",
    short:
      "Read the log level from an environment variable such as `LOG_LEVEL` when creating the logger, defaulting to `info` in production and `debug` in development, so you can raise verbosity for troubleshooting by restarting with a different value rather than editing code. For debugging output, the `debug` module prints only the namespaces listed in the `DEBUG` environment variable, so noisy diagnostics stay silent by default. Node.js core also has its own `NODE_DEBUG` variable for internal modules. Changing environment variables requires restarting the process.",
    detail: [
      "Do not leave verbose levels on permanently in production.",
      "Namespaces let you enable debug output for one library only.",
      "Document the variables so operators know how to use them.",
    ],
    ex: "Running with `LOG_LEVEL=debug` for ten minutes helps diagnose a problem, then it is set back to info.",
    mistakes: ["Hard-coding the level.", "Leaving debug on permanently."],
    follow: ["Why does changing it need a restart?"],
    points: [
      "Level from an environment variable",
      "Safer defaults in production",
      "DEBUG namespaces for diagnostics",
      "Restart to apply",
    ],
    notes: ["Level in the environment."],
    src: [
      ["Express: Production best practices: performance (logging)", EXP],
      ["Node.js: process.env", "https://nodejs.org/api/process.html"],
    ],
  }),
  q({
    slug: "centralised-logging-why-and-how",
    topic: "Centralised logs & rotation",
    d: "medium",
    title: "What is centralised logging and why is it needed?",
    kw: [
      "centralised logging",
      "log aggregation",
      "log shipping",
      "search",
      "multiple servers",
    ],
    intent:
      "Checks you understand why logs should not live only on each server.",
    short:
      "Centralised logging collects logs from all servers and services into one searchable system. Instead of connecting to each machine to read files, you query one place across all instances, correlate events by request id, set alerts, and keep logs after a server is replaced or a container disappears. Applications write to stdout or files, and an agent or the platform ships the entries to a service such as Amazon CloudWatch Logs or another log platform. It also makes retention, access control and auditing manageable.",
    detail: [
      "Containers and autoscaled instances are short-lived, so local logs would be lost.",
      "Structured JSON logs make central search far more useful.",
      "Control who can read the logs, since they may contain sensitive data.",
    ],
    ex: "Logs from three API instances and nginx appear in one place, filterable by request id.",
    mistakes: [
      "Logs only on the server's disk, lost when it is replaced.",
      "No retention policy, so logs grow without limit.",
    ],
    follow: ["Why is local-only logging a problem for containers?"],
    points: [
      "One searchable place for all logs",
      "Survives instance replacement",
      "Correlate across services",
      "Alerts and retention",
    ],
    notes: ["Ship logs off the box."],
    src: [
      [
        "AWS: What is Amazon CloudWatch Logs?",
        `${CW}/WhatIsCloudWatchLogs.html`,
      ],
      ["Docker: Logging overview", "https://docs.docker.com/engine/logging/"],
    ],
  }),
  q({
    slug: "cloudwatch-logs-groups-streams-retention",
    topic: "Centralised logs & rotation",
    d: "medium",
    title: "What are log groups, log streams and retention in CloudWatch Logs?",
    kw: [
      "cloudwatch logs",
      "log group",
      "log stream",
      "retention policy",
      "logs insights",
    ],
    intent: "Checks you know how AWS organises logs.",
    short:
      "In Amazon CloudWatch Logs, a log stream is a sequence of log events from the same source, such as one server or container, and a log group is a group of log streams that share the same retention, monitoring and access control settings, typically one group per application or service. You choose a retention period for each group so old logs are deleted automatically instead of accumulating cost. CloudWatch Logs Insights lets you search and analyse log data with a query language, and subscriptions can stream events to other services in near real time.",
    detail: [
      "Name log groups consistently, for example by application and environment.",
      "Set retention explicitly, since the default is to keep logs indefinitely.",
      "Metric filters can turn log patterns into metrics and alarms.",
    ],
    ex: "A `/prod/api` log group has one stream per instance and a 30-day retention setting.",
    mistakes: [
      "Never setting retention.",
      "Putting unrelated apps in one group.",
    ],
    follow: ["What is the difference between a log group and a log stream?"],
    points: [
      "Stream = one source",
      "Group = streams sharing settings",
      "Set retention per group",
      "Insights queries and subscriptions",
    ],
    notes: ["Group the streams, set retention."],
    src: [
      [
        "AWS: Working with log groups and log streams",
        `${CW}/Working-with-log-groups-and-streams.html`,
      ],
      [
        "AWS: Analyzing log data with CloudWatch Logs Insights",
        `${CW}/AnalyzingLogData.html`,
      ],
    ],
  }),
  q({
    slug: "linux-logrotate",
    topic: "Centralised logs & rotation",
    d: "medium",
    title: "What does logrotate do and how do you configure it?",
    kw: ["logrotate", "rotate", "compress", "copytruncate", "retention"],
    intent: "Checks you can keep log files from filling the disk.",
    short:
      "logrotate is the Linux utility that rotates, compresses, removes and mails log files, so they do not grow without bound. It is normally run daily by cron or a systemd timer and each log can be handled daily, weekly, monthly or when it grows too large. A configuration block names the files and directives such as `daily`, `rotate 14` (keep 14 old files), `compress`, `missingok`, `notifempty` and a `postrotate` script that tells the application to reopen its log. `copytruncate` copies and truncates the file for programs that cannot reopen their log.",
    detail: [
      "Configuration lives in `/etc/logrotate.conf` and `/etc/logrotate.d/`.",
      "Test a config with `logrotate --debug`.",
      "Applications that write to stdout under systemd or Docker do not need logrotate for those streams.",
    ],
    ex: "Nginx logs are rotated daily, kept for 14 days and compressed.",
    code: [
      [
        "A logrotate block",
        "text",
        `/var/log/myapp/*.log {\n    daily\n    rotate 14\n    compress\n    missingok\n    notifempty\n    copytruncate\n}`,
        [
          "Rotate daily and keep 14 files.",
          "Compress old logs.",
          "`copytruncate` suits apps that keep the file open.",
        ],
      ],
    ],
    mistakes: [
      "No rotation, so logs fill the disk.",
      "Rotating files that an app keeps open without telling it to reopen them.",
    ],
    follow: ["What does copytruncate do?"],
    points: [
      "Rotates, compresses, removes logs",
      "Run daily by cron or timer",
      "daily, rotate N, compress",
      "Test with --debug",
    ],
    notes: ["Rotate, compress, limit."],
    src: [
      [
        "logrotate(8)",
        "https://man7.org/linux/man-pages/man8/logrotate.8.html",
      ],
    ],
  }),
  q({
    slug: "journald-and-systemd-logs",
    topic: "Centralised logs & rotation",
    d: "easy",
    title: "How do you read logs of a systemd service with journalctl?",
    kw: ["journalctl", "journald", "systemd unit logs", "follow logs", "since"],
    intent: "Checks you can find service logs on a modern Linux server.",
    short:
      "systemd's journal collects the standard output and error of services it runs, along with system messages. Read them with `journalctl`: `journalctl -u myapp` shows a unit's logs, `-f` follows new entries, `--since \"1 hour ago\"` limits the time range, `-p err` filters by priority and `-n 100` shows the last lines. This means an app running as a systemd service can simply write to stdout and rely on the journal, with the journal's size and retention configured centrally.",
    detail: [
      "Use `-b` to see logs from the current boot.",
      "The journal can be configured to persist across reboots.",
      "Logs can be forwarded to a central system.",
    ],
    ex: "`journalctl -u myapp -f` follows a Node service's output after a deploy.",
    code: [
      [
        "Useful journalctl options",
        "bash",
        `journalctl -u myapp -n 100\njournalctl -u myapp -f\njournalctl -u myapp --since "1 hour ago" -p err`,
        [
          "Last 100 lines of the unit.",
          "Follow new lines.",
          "Errors from the last hour.",
        ],
      ],
    ],
    mistakes: [
      "Looking for log files that the service never writes.",
      "Not knowing the journal size is limited.",
    ],
    follow: ["How do you follow logs live?"],
    points: [
      "journalctl -u unit",
      "-f to follow, --since to filter",
      "-p filters by priority",
      "Services can log to stdout",
    ],
    notes: ["journalctl -u name -f."],
    src: [
      [
        "journalctl(1)",
        "https://man7.org/linux/man-pages/man1/journalctl.1.html",
      ],
      [
        "systemd-journald.service(8)",
        "https://man7.org/linux/man-pages/man8/systemd-journald.service.8.html",
      ],
    ],
  }),
  q({
    slug: "log-retention-and-compliance",
    topic: "Centralised logs & rotation",
    d: "medium",
    title: "How long should you keep logs, and how do you control access?",
    kw: ["log retention", "access control", "compliance", "cost", "privacy"],
    intent: "Checks you treat logs as managed data.",
    short:
      "Keep logs long enough to troubleshoot and to meet audit or legal requirements, and no longer, because storage costs money and logs can hold personal data. Retention differs by type: debug output is short-lived (days), application logs commonly weeks to months, and security and audit logs may need to be kept longer according to your organisation's rules. Set retention explicitly in the logging system, restrict who can read and delete logs, protect their integrity, and make sure personal data in logs is minimised or masked. Archive old logs to cheaper storage if they must be kept.",
    detail: [
      "OWASP's logging guidance emphasises protecting logs and not logging data you are not permitted to collect.",
      "Time synchronisation (NTP) keeps timestamps reliable across servers.",
      "Back up or replicate security-relevant logs so an attacker cannot easily erase them.",
    ],
    ex: "Application logs keep 30 days in the search tool and a year in cold storage, while debug logs are deleted after a week.",
    mistakes: [
      "Keeping everything forever.",
      "Giving every developer write access to audit logs.",
    ],
    follow: ["Why mask personal data in logs?"],
    points: [
      "Retention by log type",
      "Set it explicitly",
      "Restrict access and protect integrity",
      "Minimise personal data",
    ],
    notes: ["Keep what you need, protect what you keep."],
    src: [
      ["OWASP: Logging Cheat Sheet", OW],
      [
        "AWS: Working with log groups and log streams",
        `${CW}/Working-with-log-groups-and-streams.html`,
      ],
    ],
  }),
  q({
    slug: "monitoring-alerts-from-logs",
    topic: "Centralised logs & rotation",
    d: "hard",
    title: "How can logs drive alerts without causing alert fatigue?",
    kw: [
      "log-based alerts",
      "metric filters",
      "alert fatigue",
      "error rate",
      "thresholds",
    ],
    intent: "Checks you turn logs into actionable signals.",
    short:
      "Logs can be turned into metrics and alerts: count ERROR-level entries or specific messages over time and alert when the rate crosses a threshold, for example with CloudWatch metric filters and alarms. Alert on conditions that need human action, such as a sustained rise in 5xx responses or repeated login failures, rather than on every single error. Include context in the alert (service, environment, a link to the query), tune thresholds to avoid constant noise, and review alerts regularly so the team trusts them. Constant false alarms lead people to ignore real ones.",
    detail: [
      "Rates and trends are more useful than single events.",
      "Separate urgent paging alerts from lower-priority notifications.",
      "Write a short runbook for each alert.",
    ],
    ex: "An alarm triggers when more than 5 percent of requests return 5xx for five minutes.",
    mistakes: ["Alerting on every WARN.", "Alerts with no owner or runbook."],
    follow: ["Why alert on rates rather than single errors?"],
    points: [
      "Turn logs into metrics",
      "Alert on actionable conditions",
      "Add context and runbooks",
      "Tune to avoid fatigue",
    ],
    notes: ["Alert on what needs action."],
    src: [
      [
        "AWS: Analyzing log data with CloudWatch Logs Insights",
        `${CW}/AnalyzingLogData.html`,
      ],
      [
        "AWS: Real-time processing of log data with subscriptions",
        `${CW}/Subscriptions.html`,
      ],
    ],
  }),
  q({
    slug: "docker-and-kubernetes-container-logging",
    topic: "Centralised logs & rotation",
    d: "medium",
    title: "How should applications in containers handle logging?",
    kw: [
      "container logging",
      "stdout",
      "docker logs",
      "kubectl logs",
      "twelve-factor",
    ],
    intent: "Checks you follow the container logging convention.",
    short:
      "In containers, applications should write logs to standard output and standard error, not to files inside the container, because the container's filesystem is temporary and the runtime captures these streams. Docker stores them through a logging driver, readable with `docker logs`, and Kubernetes exposes them with `kubectl logs`, with a cluster-level agent usually shipping them to a central system. Configure rotation or size limits for the driver so the host disk does not fill, and use structured JSON to make central search effective.",
    detail: [
      "Docker's default json-file driver does not rotate unless configured with options like max-size.",
      "Kubernetes keeps logs of a pod only while it exists unless they are collected centrally.",
      "Do not run a log rotation daemon inside the container.",
    ],
    ex: "A Node API logs JSON to stdout; an agent on each node forwards the entries to CloudWatch Logs.",
    mistakes: [
      "Writing to a log file in the container filesystem.",
      "No size limits on the logging driver.",
    ],
    follow: ["Why stdout instead of a file in the container?"],
    points: [
      "Log to stdout and stderr",
      "Runtime captures the streams",
      "docker logs and kubectl logs",
      "Limit driver size and ship centrally",
    ],
    notes: ["Containers log to stdout."],
    src: [
      [
        "Docker: Configure logging drivers",
        "https://docs.docker.com/engine/logging/configure/",
      ],
      [
        "Kubernetes: Logging architecture",
        "https://kubernetes.io/docs/concepts/cluster-administration/logging/",
      ],
    ],
  }),
  q({
    slug: "audit-logging-vs-application-logging",
    topic: "Log levels & structure",
    d: "medium",
    title:
      "How is audit (security) logging different from ordinary application logging?",
    kw: [
      "audit log",
      "security events",
      "tamper resistance",
      "accountability",
      "who did what",
    ],
    intent: "Checks you know audit logs have stricter requirements.",
    short:
      "Application logs help developers diagnose behaviour, while audit logs record who did what and when for accountability and security investigations: logins, permission changes, access to sensitive records, data exports and administrative actions. Each audit entry should include the actor, the action, the target, the time, the outcome and the source address. Audit logs must be protected against tampering and deletion, stored separately with stricter access, retained according to policy, and written reliably rather than best-effort. They should not contain secrets or more personal data than needed.",
    detail: [
      "Record failures as well as successes, since failed access attempts are signals.",
      "Keep audit records immutable or write-once where possible.",
      "Time should be synchronised and in UTC.",
    ],
    ex: "Whenever an admin changes a user's role, an audit entry records the admin, the user, the old and new role and the time.",
    mistakes: [
      "Mixing audit events into debug logs that are rotated away quickly.",
      "Letting administrators edit their own audit trail.",
    ],
    follow: ["What fields does an audit entry need?"],
    points: [
      "Who, what, when, outcome",
      "Protected from tampering",
      "Separate, retained per policy",
      "Include failures",
    ],
    notes: ["Audit logs answer 'who did this?'."],
    src: [["OWASP: Logging Cheat Sheet", OW]],
  }),
])
