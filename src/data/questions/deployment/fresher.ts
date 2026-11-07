import { defineQuestions } from "../author"
import { q } from "../compact"

const PM = "https://pm2.keymetrics.io/docs/usage"
const EX = "https://expressjs.com/en/advanced"
const ND = "https://nodejs.org"
const UB = "https://ubuntu.com/server/docs"

export default defineQuestions("deployment", "fresher", [
  q({
    slug: "production-vs-development",
    topic: "Production deployment checklist",
    d: "easy",
    title: "What changes between development and production for a Node.js app?",
    kw: [
      "NODE_ENV",
      "production mode",
      "environment",
      "debug logging",
      "error messages",
    ],
    intent:
      "A basic readiness check: checks you know the app must behave differently in production.",
    short:
      "Node.js itself has no special production mode, but libraries such as Express check the `NODE_ENV` environment variable, and setting it to `production` makes Express cache view templates and CSS files and generate less verbose error messages, which the Express documentation says can improve performance. In production you also use real configuration and secrets from the environment, a process manager, HTTPS behind a reverse proxy, proper logging, no debug tooling or stack traces in responses, and only production dependencies installed.",
    detail: [
      "The Node.js documentation notes that there are no development-versus-production settings in Node.js itself.",
      "Development tools such as nodemon and dev servers are not used in production.",
      "Never run production with the development database or keys.",
    ],
    ex: "The server starts with `NODE_ENV=production`, uses `npm ci --omit=dev`, and reads its secrets from the environment.",
    mistakes: [
      "Forgetting NODE_ENV=production.",
      "Returning stack traces to clients.",
    ],
    follow: ["What does NODE_ENV change in Express?"],
    points: [
      "NODE_ENV=production",
      "Production-only dependencies",
      "Real config and secrets from the environment",
      "Process manager and reverse proxy",
    ],
    notes: ["Set NODE_ENV and harden the setup."],
    src: [
      [
        "Express: Production best practices: performance",
        `${EX}/best-practice-performance.html`,
      ],
      [
        "Node.js: Development and production",
        `${ND}/en/learn/getting-started/nodejs-the-difference-between-development-and-production`,
      ],
    ],
  }),
  q({
    slug: "production-deployment-checklist",
    topic: "Production deployment checklist",
    d: "easy",
    title: "What is on a checklist before deploying an app to production?",
    kw: [
      "deployment checklist",
      "pre-deploy",
      "rollback plan",
      "monitoring",
      "backups",
    ],
    intent: "Checks you think beyond the code when releasing.",
    short:
      "Before deploying, confirm that tests pass in CI and that the build is reproducible, configuration and secrets are set for production, database migrations are ready and backward compatible, and a backup exists. Check that HTTPS and the reverse proxy are configured, the app runs under a process manager that restarts it, logs go somewhere searchable, and monitoring and alerts are in place. Have a rollback plan, deploy at a low-risk time, and run smoke tests afterwards, such as hitting a health endpoint.",
    detail: [
      "Security basics: dependencies audited, security headers, firewall, no debug endpoints.",
      "Know who is on call and how to roll back before you start.",
      "Document the steps, or better, automate them so they are repeatable.",
    ],
    ex: "A release runs the checklist: backup, migrate, deploy, smoke test, and watch the error rate for 15 minutes.",
    mistakes: [
      "Deploying without a rollback plan.",
      "No smoke test after the release.",
    ],
    follow: ["What is a smoke test?"],
    points: [
      "Tests, config, secrets",
      "Migrations and backups",
      "HTTPS, process manager, logs, monitoring",
      "Rollback plan and smoke tests",
    ],
    notes: ["Prepare, deploy, verify, be able to undo."],
    src: [
      [
        "Express: Production best practices: security",
        `${EX}/best-practice-security.html`,
      ],
      [
        "Express: Production best practices: performance",
        `${EX}/best-practice-performance.html`,
      ],
    ],
  }),
  q({
    slug: "health-checks-and-smoke-tests",
    topic: "Production deployment checklist",
    d: "medium",
    title: "What are health checks and why do deployments need them?",
    kw: [
      "health check",
      "liveness",
      "readiness",
      "smoke test",
      "load balancer",
    ],
    intent: "Checks you can tell the platform whether an instance is OK.",
    short:
      "A health check is an endpoint, such as `GET /health`, that returns success when the application can serve traffic. Load balancers use health checks to decide whether an instance should receive requests, and Kubernetes distinguishes liveness checks, which decide when to restart a container, from readiness checks, which decide when it is ready to accept traffic. A good readiness check verifies essentials such as the database connection. After a deployment, a smoke test hits the health endpoint and a few key routes to confirm the release works before declaring success.",
    detail: [
      "Keep health checks fast and cheap, and do not require authentication for them.",
      "A shallow check says the process is up; a deep check verifies dependencies.",
      "Failing readiness takes an instance out of rotation without restarting it.",
    ],
    ex: "The load balancer stops sending traffic to an instance whose `/health` returns 503 because it lost its database connection.",
    mistakes: [
      "Health checks that are slow or call expensive queries.",
      "No readiness distinction, so traffic arrives before the app is ready.",
    ],
    follow: ["How do liveness and readiness differ?"],
    points: [
      "Endpoint that reports health",
      "Load balancers use it for routing",
      "Liveness restarts, readiness gates traffic",
      "Smoke test after deploy",
    ],
    notes: ["Alive vs ready."],
    src: [
      [
        "Express: Health checks and graceful shutdown",
        `${EX}/healthcheck-graceful-shutdown.html`,
      ],
    ],
  }),
  q({
    slug: "vps-deployment-steps",
    topic: "VPS deployment",
    d: "easy",
    title: "What are the steps to deploy a Node.js app on a Linux VPS?",
    kw: ["vps", "ubuntu server", "ssh", "node install", "reverse proxy"],
    intent: "Checks you can describe an end-to-end manual deployment.",
    short:
      "Create a server (for example Ubuntu), secure it by using SSH keys, a non-root user and a firewall that opens only SSH, HTTP and HTTPS, then install Node.js and any services you need. Copy or clone the code (or pull a built artifact or container image), install production dependencies, and set environment variables. Run the app under a process manager such as PM2 or systemd so it restarts on crashes and reboots. Put nginx in front as a reverse proxy to the app's port, add HTTPS with a certificate, and point the domain's DNS at the server.",
    detail: [
      "Keep the app on a localhost port and expose only nginx publicly.",
      "Automate repeat deployments with a script or CI/CD pipeline.",
      "Take backups, apply security updates and monitor the server.",
    ],
    ex: "A small business app runs on one Ubuntu VPS with nginx, PM2 and a managed or local database.",
    mistakes: [
      "Running the app as root.",
      "Exposing the app port to the internet instead of using the proxy.",
    ],
    follow: ["Why put nginx in front of Node?"],
    points: [
      "Secure the server first",
      "Install runtime, code and dependencies",
      "Process manager for restarts",
      "nginx, HTTPS and DNS",
    ],
    notes: ["Secure, install, supervise, proxy, encrypt."],
    src: [
      ["Ubuntu Server documentation", `${UB}`],
      [
        "Express: Production best practices: performance",
        `${EX}/best-practice-performance.html`,
      ],
    ],
  }),
  q({
    slug: "vps-server-hardening-basics",
    topic: "VPS deployment",
    d: "medium",
    title: "How do you harden a new Linux server?",
    kw: [
      "server hardening",
      "ssh keys",
      "firewall ufw",
      "non-root user",
      "automatic updates",
    ],
    intent: "Checks you can protect a freshly provisioned VPS.",
    short:
      "Create a non-root user with sudo rights and log in with SSH keys, then disable password logins and root login over SSH. Enable a firewall that denies incoming traffic by default and allows only the ports you need, usually 22, 80 and 443. Keep the system updated, ideally with automatic security updates, install only the packages you need, and run the application as an unprivileged user. Consider limiting SSH access by IP or using a VPN, and monitor logs for repeated failed logins.",
    detail: [
      "Ubuntu ships the `ufw` front end for managing firewall rules.",
      "SSH settings live in `/etc/ssh/sshd_config`; reload the SSH service after changing them.",
      "Keep a second session open when changing SSH settings, so you do not lock yourself out.",
    ],
    ex: "After setup, password SSH login is off, only ports 22, 80 and 443 are open, and unattended security updates are enabled.",
    code: [
      [
        "Basic firewall",
        "bash",
        `sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow OpenSSH\nsudo ufw allow 80,443/tcp\nsudo ufw enable`,
        [
          "Default deny for incoming traffic.",
          "Only SSH, HTTP and HTTPS are allowed.",
          "`enable` turns the firewall on.",
        ],
      ],
    ],
    mistakes: [
      "Enabling the firewall without allowing SSH first.",
      "Leaving password authentication for SSH on.",
    ],
    follow: ["Why disable root login over SSH?"],
    points: [
      "Non-root user and SSH keys",
      "Firewall with default deny",
      "Updates and minimal packages",
      "Unprivileged app user",
    ],
    notes: ["Keys, firewall, updates."],
    src: [
      [
        "Ubuntu Server: OpenSSH server",
        `${UB}/how-to/security/openssh-server/`,
      ],
      ["Ubuntu Server: Firewalls", `${UB}/how-to/security/firewalls/`],
    ],
  }),
  q({
    slug: "systemd-service-for-node",
    topic: "VPS deployment",
    d: "medium",
    title: "How do you run a Node.js app as a systemd service?",
    kw: [
      "systemd",
      "unit file",
      "restart on failure",
      "systemctl",
      "journalctl",
    ],
    intent: "Checks you can supervise a process with the init system.",
    short:
      "systemd is the init system on most Linux distributions. You create a unit file such as `/etc/systemd/system/myapp.service` with a `[Service]` section that sets `ExecStart` to the node command, `WorkingDirectory`, `User`, `Environment` or `EnvironmentFile`, and `Restart=on-failure`, and an `[Install]` section with `WantedBy=multi-user.target`. Then `systemctl daemon-reload`, `systemctl enable --now myapp` start it and make it launch at boot. View its output with `journalctl -u myapp -f`.",
    detail: [
      "systemd restarts a crashed service and starts it after reboots.",
      "Use `systemctl status myapp` to see whether it is running.",
      "Run the service as an unprivileged user.",
    ],
    ex: "The API starts at boot as the `deploy` user and restarts if it exits unexpectedly.",
    code: [
      [
        "A unit file",
        "ini",
        `[Unit]\nDescription=My API\nAfter=network.target\n\n[Service]\nUser=deploy\nWorkingDirectory=/srv/myapp\nEnvironmentFile=/etc/myapp.env\nExecStart=/usr/bin/node server.js\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target`,
        [
          "`ExecStart` defines the command.",
          "`Restart=on-failure` recovers from crashes.",
          "`WantedBy` hooks it into boot.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting daemon-reload after editing the unit.",
      "Running the service as root.",
    ],
    follow: ["How do you read its logs?"],
    points: [
      "Unit file with [Service] and [Install]",
      "Restart=on-failure",
      "systemctl enable --now",
      "journalctl -u for logs",
    ],
    notes: ["Unit, enable, journalctl."],
    src: [
      [
        "systemd.service(5)",
        "https://man7.org/linux/man-pages/man5/systemd.service.5.html",
      ],
      [
        "journalctl(1)",
        "https://man7.org/linux/man-pages/man1/journalctl.1.html",
      ],
    ],
  }),
  q({
    slug: "dns-domain-and-ssl-pointing",
    topic: "VPS deployment",
    d: "easy",
    title: "How do you point a domain name to your server?",
    kw: ["dns a record", "domain", "propagation", "cname", "ttl"],
    intent: "Checks you can connect a domain to the deployed app.",
    short:
      "Create DNS records at your domain registrar or DNS provider. An A record maps a name such as `example.com` to the server's IPv4 address (and AAAA for IPv6), and a CNAME maps one name, like `www`, to another name. After you save the records, it takes time for resolvers to see the change, depending on the TTL, which is the caching time of the record. Then configure nginx with the matching `server_name` and obtain an HTTPS certificate, which needs the domain to resolve to the server first.",
    detail: [
      "Use `dig example.com` or `nslookup` to check what a name resolves to.",
      "Lower the TTL before a planned move so the change spreads faster.",
      "Use a stable IP, such as an Elastic IP on AWS, so the record stays valid.",
    ],
    ex: "An A record points `example.com` to `203.0.113.10`, and a CNAME makes `www` follow it.",
    mistakes: [
      "Requesting a certificate before DNS points to the server.",
      "Using a changing IP address.",
    ],
    follow: ["What is TTL?"],
    points: [
      "A record: name to IPv4",
      "CNAME: name to name",
      "TTL controls caching",
      "DNS must resolve before certificates",
    ],
    notes: ["A for the apex, CNAME for aliases."],
    src: [
      [
        "Let's Encrypt: Getting started",
        "https://letsencrypt.org/getting-started/",
      ],
      [
        "nginx: Server names",
        "https://nginx.org/en/docs/http/server_names.html",
      ],
    ],
  }),
  q({
    slug: "pm2-what-and-basic-commands",
    topic: "PM2 process management",
    d: "easy",
    title: "What is PM2 and which commands do you use most?",
    kw: ["pm2", "process manager", "pm2 start", "pm2 logs", "pm2 list"],
    intent: "Checks you can run and inspect a Node app with PM2.",
    short:
      "PM2 is a production process manager for Node.js. It keeps your application running, restarts it if it crashes, can restart it on file changes, collects its logs, and offers monitoring and a built-in load balancer. Start an app with `pm2 start app.js --name api`, list processes with `pm2 list`, view logs with `pm2 logs`, restart or reload with `pm2 restart` or `pm2 reload`, stop or remove with `pm2 stop` and `pm2 delete`, and see a live dashboard with `pm2 monit`.",
    detail: [
      "`pm2 describe` shows details of one process.",
      "PM2 can run non-Node scripts and binaries too.",
      "Processes are not automatically restored after a reboot until you set up startup and save.",
    ],
    ex: "`pm2 start server.js --name api` runs the API in the background and `pm2 logs api` follows its output.",
    code: [
      [
        "Everyday PM2 commands",
        "bash",
        `pm2 start server.js --name api\npm2 list\npm2 logs api\npm2 reload api\npm2 monit`,
        [
          "Start and name the process.",
          "List and follow logs.",
          "Reload and monitor.",
        ],
      ],
    ],
    mistakes: [
      "Running `node server.js` in a terminal and expecting it to survive logout.",
      "Forgetting pm2 save and startup, so processes are gone after reboot.",
    ],
    follow: ["What is the difference between restart and reload?"],
    points: [
      "Keeps Node apps running",
      "start, list, logs, reload, monit",
      "Collects logs",
      "Needs startup and save for reboots",
    ],
    notes: ["PM2 supervises your Node processes."],
    src: [["PM2: Quick start", `${PM}/quick-start/`]],
  }),
  q({
    slug: "pm2-ecosystem-file-and-env",
    topic: "PM2 process management",
    d: "medium",
    title:
      "How do you configure PM2 with an ecosystem file and different environments?",
    kw: [
      "ecosystem.config.js",
      "env_production",
      "pm2 start --env",
      "max_memory_restart",
      "app declaration",
    ],
    intent: "Checks you can declare apps and environments in a file.",
    short:
      "An ecosystem file, named something like `ecosystem.config.js`, declares your applications in one place: name, script, arguments, instances, `exec_mode`, `max_memory_restart` and environment variables. The `env` block holds defaults and blocks like `env_production` hold overrides that you select with `--env production`, for example `pm2 start ecosystem.config.js --env production`. Keeping it in version control makes deployments repeatable, and you can start, restart or reload everything it declares with one command.",
    detail: [
      "`pm2 init simple` generates a sample file.",
      "Do not put real secrets in a committed ecosystem file; load them from the environment or a protected file.",
      "`max_memory_restart` restarts a process that exceeds a memory limit.",
    ],
    ex: "The ecosystem file starts the API in cluster mode and a separate worker process, both with `NODE_ENV=production`.",
    code: [
      [
        "ecosystem.config.js",
        "js",
        `module.exports = {\n  apps: [{\n    name: "api",\n    script: "./server.js",\n    instances: "max",\n    exec_mode: "cluster",\n    max_memory_restart: "300M",\n    env: { NODE_ENV: "development" },\n    env_production: { NODE_ENV: "production" },\n  }],\n}`,
        [
          "One declaration describes the app.",
          "`env_production` is chosen with `--env production`.",
          "Memory limit restarts a leaking process.",
        ],
      ],
    ],
    mistakes: [
      "Committing secrets in the file.",
      "Forgetting --env production and running development settings.",
    ],
    follow: ["How do you select the production block?"],
    points: [
      "Declarative app config",
      "env and env_production blocks",
      "Start with --env",
      "No secrets in the file",
    ],
    notes: ["Declare once, start with --env."],
    src: [
      [
        "PM2: Ecosystem file (application declaration)",
        `${PM}/application-declaration/`,
      ],
      ["PM2: Quick start", `${PM}/quick-start/`],
    ],
  }),
  q({
    slug: "pm2-cluster-mode",
    topic: "PM2 process management",
    d: "medium",
    title: "What is PM2 cluster mode and why use it?",
    kw: [
      "cluster mode",
      "instances max",
      "load balancer",
      "multi-core",
      "pm2 reload",
    ],
    intent: "Checks you know how to use all CPU cores with Node.",
    short:
      "A Node.js process runs JavaScript on a single thread, so one process uses only one CPU core. PM2's cluster mode starts several instances of the app, built on Node's cluster module, and shares incoming connections between them, scaling the application across all available CPUs without code changes. Start it with `pm2 start app.js -i max`, where `max` means one process per CPU, or set `instances` and `exec_mode: \"cluster\"` in the ecosystem file. It increases throughput and reliability, but the instances must not rely on in-process shared state.",
    detail: [
      "Sessions and caches kept in memory differ between instances, so use a shared store.",
      "`pm2 scale app 4` changes the number of workers.",
      "Cluster mode also makes zero-downtime reloads possible.",
    ],
    ex: "On a four-core server the API runs four instances, so it can serve requests on all cores.",
    mistakes: [
      "In-memory sessions with multiple instances.",
      "Assuming one process uses all cores.",
    ],
    follow: ["What does -i max do?"],
    points: [
      "Multiple instances share connections",
      "-i max = one per CPU",
      "No code changes needed",
      "State must be shared",
    ],
    notes: ["One process per core."],
    src: [
      ["PM2: Cluster mode", `${PM}/cluster-mode/`],
      ["Node.js: cluster", `${ND}/api/cluster.html`],
    ],
  }),
  q({
    slug: "pm2-startup-and-save",
    topic: "PM2 process management",
    d: "easy",
    title: "How do you make PM2 processes survive a server reboot?",
    kw: ["pm2 startup", "pm2 save", "resurrect", "systemd", "boot"],
    intent: "Checks you know the two-step reboot setup.",
    short:
      "First run `pm2 startup`, which detects the init system, such as systemd, and prints a command to run with sudo that installs a startup script launching PM2 at boot. Then start your apps and run `pm2 save`, which freezes the current process list so PM2 respawns it after a reboot. `pm2 resurrect` brings back the saved list manually, and `pm2 unstartup` removes the startup configuration. Remember to run `pm2 save` again whenever you add or remove apps.",
    detail: [
      "Run `pm2 startup` as the user that owns the processes, not with sudo itself.",
      "Test by rebooting once in a safe window.",
      "Alternatively, run the app directly as a systemd service.",
    ],
    ex: "After a kernel update and reboot, the API comes back by itself because startup and save were done.",
    mistakes: ["Skipping pm2 save.", "Not testing a reboot."],
    follow: ["What does pm2 resurrect do?"],
    points: [
      "pm2 startup installs the boot script",
      "pm2 save stores the list",
      "resurrect restores it",
      "Save again after changes",
    ],
    notes: ["startup, then save."],
    src: [["PM2: Startup script", `${PM}/startup/`]],
  }),
  q({
    slug: "pm2-graceful-shutdown-and-reload",
    topic: "PM2 process management",
    d: "hard",
    title:
      "How do you achieve graceful shutdown and zero-downtime reloads with PM2?",
    kw: [
      "graceful shutdown",
      "SIGINT",
      "kill_timeout",
      "pm2 reload",
      "close connections",
    ],
    intent: "Checks you can restart without dropping requests.",
    short:
      "`pm2 reload` in cluster mode restarts instances one by one with a zero-downtime strategy, while `pm2 restart` kills and restarts the process. To avoid cutting off in-flight requests, the app must handle the stop signal: PM2 sends SIGINT by default (configurable, for example to SIGTERM), and the handler should stop accepting new connections, finish current requests, close database connections and then exit. If the process does not exit within `kill_timeout`, PM2 force-kills it, so set a suitable timeout.",
    detail: [
      "The Express documentation recommends closing the server on SIGTERM and finishing ongoing requests.",
      "If the reload cannot complete, PM2 falls back to a classic restart after a timeout.",
      "Readiness checks and a load balancer complete the picture for multi-server setups.",
    ],
    ex: "On SIGINT the API calls `server.close()`, waits for pending requests and closes the DB pool, then exits cleanly.",
    code: [
      [
        "Graceful shutdown handler",
        "js",
        `process.on("SIGINT", () => {\n  server.close(async () => {\n    await db.end()\n    process.exit(0)\n  })\n})`,
        [
          "Stop accepting connections.",
          "Clean up resources.",
          "Exit with success.",
        ],
      ],
    ],
    mistakes: [
      "No signal handler, so requests are cut off.",
      "A kill timeout shorter than the longest request.",
    ],
    follow: ["What does pm2 reload do differently from restart?"],
    points: [
      "reload restarts instances gradually",
      "Handle SIGINT or SIGTERM",
      "Finish requests, close resources",
      "kill_timeout forces exit",
    ],
    notes: ["Stop accepting, finish, clean up, exit."],
    src: [
      ["PM2: Graceful start and shutdown", `${PM}/signals-clean-restart/`],
      [
        "Express: Health checks and graceful shutdown",
        `${EX}/healthcheck-graceful-shutdown.html`,
      ],
    ],
  }),
  q({
    slug: "env-vars-and-config-management",
    topic: "Environment variables & config",
    d: "easy",
    title:
      "How should configuration and secrets be managed across environments?",
    kw: [
      "environment variables",
      "process.env",
      ".env file",
      "twelve-factor config",
      "secrets",
    ],
    intent: "Checks you keep config out of code.",
    short:
      "Configuration that differs between environments, such as database URLs, API keys and feature settings, should come from the environment, not from values hard-coded in the source. In Node.js read them from `process.env`, load a local `.env` file in development with Node's `--env-file` option or a library, and set real values on the server through the process manager, systemd or the platform. Keep secrets out of git, use different values for each environment, validate required variables at startup so the app fails fast, and restrict who can read them.",
    detail: [
      "Environment variables are strings, so convert numbers and booleans yourself.",
      "Do not log secrets or return them in API responses.",
      "Rotate secrets that leak and review who has access.",
    ],
    ex: "On startup the app checks that `DATABASE_URL` and `JWT_SECRET` are present and exits with a clear message if not.",
    code: [
      [
        "Read and validate config",
        "js",
        `const required = ["DATABASE_URL", "JWT_SECRET"]\nfor (const key of required) {\n  if (!process.env[key]) throw new Error(\`Missing env var \${key}\`)\n}\nconst port = Number(process.env.PORT ?? 3000)`,
        [
          "Required variables are checked at startup.",
          "Numbers are converted from strings.",
        ],
      ],
    ],
    mistakes: ["Committing .env files.", "Assuming PORT is a number."],
    follow: ["Why fail fast on missing config?"],
    points: [
      "Config from the environment",
      "process.env values are strings",
      "No secrets in git",
      "Validate at startup",
    ],
    notes: ["Config in env, not in code."],
    src: [
      ["Node.js: process.env", `${ND}/api/process.html`],
      [
        "Node.js: How to read environment variables",
        `${ND}/en/learn/command-line/how-to-read-environment-variables-from-nodejs`,
      ],
    ],
  }),
  q({
    slug: "env-files-and-process-manager-secrets",
    topic: "Environment variables & config",
    d: "medium",
    title:
      "How do you provide environment variables on a server with systemd or PM2?",
    kw: [
      "EnvironmentFile",
      "env_production",
      "file permissions",
      "server config",
      "restart to apply",
    ],
    intent: "Checks you can supply production config safely.",
    short:
      "With systemd, put variables in a root-owned file such as `/etc/myapp.env` with restrictive permissions (for example mode 600) and reference it with `EnvironmentFile=` in the unit, then restart the service to apply changes. With PM2, use the `env` and `env_production` blocks in the ecosystem file, selected with `--env production`, and avoid committing secrets there by loading them from the server environment. In both cases, changing a variable requires restarting the process, because environment variables are read when the process starts.",
    detail: [
      "Containers use `-e`, `--env-file` or orchestrator secrets.",
      "Platforms like AWS provide secret stores that the app reads at startup.",
      "Check effective values with `systemctl show` or `pm2 env`.",
    ],
    ex: "`/etc/myapp.env` is readable only by root and the service user, and holds the database URL.",
    mistakes: [
      "World-readable env files.",
      "Changing variables without restarting.",
    ],
    follow: ["Why must the process be restarted after changing variables?"],
    points: [
      "EnvironmentFile in systemd",
      "env blocks in PM2",
      "Restrict file permissions",
      "Restart to apply",
    ],
    notes: ["Protect the file, restart the process."],
    src: [
      [
        "systemd.exec(5) / systemd.service(5)",
        "https://man7.org/linux/man-pages/man5/systemd.service.5.html",
      ],
      ["PM2: Ecosystem file", `${PM}/application-declaration/`],
    ],
  }),
  q({
    slug: "build-and-release-process-for-frontend",
    topic: "Environment variables & config",
    d: "medium",
    title:
      "How are environment variables handled in a React (Vite) front end, and why are they not secret?",
    kw: [
      "vite env",
      "VITE_ prefix",
      "build-time variables",
      "public config",
      "front-end secrets",
    ],
    intent: "Checks you know front-end variables are baked into public code.",
    short:
      "A front-end build such as Vite replaces environment values at build time, and only variables with the `VITE_` prefix are exposed to client code through `import.meta.env`. Whatever is exposed ends up inside the JavaScript bundle that every visitor downloads, so it is public: never put secrets such as API secrets or database credentials in front-end variables. Use them for public settings like the API base URL, and keep secrets on the server behind your API. Because values are baked in at build time, changing them requires a rebuild.",
    detail: [
      "Different environments need separate builds or runtime config loaded from a file.",
      "Public keys, such as a payment gateway's key ID, are fine to expose.",
      "Anyone can read the bundle in the browser's developer tools.",
    ],
    ex: "`VITE_API_URL` points the app at staging in one build and production in another.",
    mistakes: [
      "Putting a secret in a VITE_ variable.",
      "Expecting a changed variable to take effect without rebuilding.",
    ],
    follow: ["What belongs in front-end variables?"],
    points: [
      "VITE_ prefix exposes values",
      "Baked in at build time",
      "Bundle is public",
      "Secrets stay on the server",
    ],
    notes: ["Front-end config is public."],
    src: [
      [
        "MDN: JavaScript modules (import.meta)",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta",
      ],
      [
        "Express: Production best practices: security",
        `${EX}/best-practice-security.html`,
      ],
    ],
  }),
  q({
    slug: "zero-downtime-deployment-basics",
    topic: "Zero-downtime basics",
    d: "medium",
    title:
      "What does zero-downtime deployment mean and how can you achieve it?",
    kw: [
      "zero downtime",
      "rolling restart",
      "load balancer",
      "graceful shutdown",
      "backward compatible",
    ],
    intent: "Checks you know the ingredients of seamless releases.",
    short:
      "Zero-downtime deployment means users do not see errors or an outage while a new version is released. The essentials are running more than one instance behind a load balancer or process manager, replacing instances one at a time so others keep serving, starting new instances and waiting until their health check passes before sending traffic, and shutting old ones down gracefully so in-flight requests finish. Database changes must be backward compatible with the old and new code during the overlap.",
    detail: [
      "On one server, PM2 cluster mode with `pm2 reload` gives rolling restarts.",
      "On several servers, take instances out of the load balancer, update, and add them back.",
      "Blue/green and canary releases are more advanced forms.",
    ],
    ex: "The API runs two instances; each is updated in turn while the other serves requests.",
    mistakes: [
      "A single instance, so any restart causes downtime.",
      "A migration that removes a column the old version still uses.",
    ],
    follow: ["Why must migrations be backward compatible?"],
    points: [
      "Multiple instances",
      "Replace one at a time",
      "Health checks before traffic",
      "Graceful shutdown and compatible schema",
    ],
    notes: ["Overlap old and new safely."],
    src: [
      ["PM2: Cluster mode (reload)", `${PM}/cluster-mode/`],
      [
        "Express: Health checks and graceful shutdown",
        `${EX}/healthcheck-graceful-shutdown.html`,
      ],
    ],
  }),
  q({
    slug: "database-migrations-in-deployments",
    topic: "Zero-downtime basics",
    d: "hard",
    title: "How do you run database migrations safely during a deployment?",
    kw: [
      "database migration",
      "expand and contract",
      "backward compatible schema",
      "rollback",
      "migration tool",
    ],
    intent: "Checks you can change schemas without breaking running code.",
    short:
      "Use a migration tool so schema changes are versioned scripts run in order and tracked. For zero-downtime releases, make changes in compatible steps, often called expand and contract: first add the new column or table (which old code ignores), deploy code that writes to both or reads the new one, backfill data, and only in a later release remove the old column. Back up before risky changes, test migrations on a copy of production data, avoid long locks on big tables, and keep each migration small and reversible where possible.",
    detail: [
      "Running migrations as a separate pipeline step makes failures visible before the code switches.",
      "Renaming a column in one step breaks the old version that is still running.",
      "Data backfills on large tables should run in batches.",
    ],
    ex: "To rename `fullname` to `name`, the team adds `name`, copies the data, switches the code, and drops `fullname` a release later.",
    mistakes: [
      "Dropping or renaming columns in the same release as the code change.",
      "Running a huge locking migration at peak time.",
    ],
    follow: ["What is expand and contract?"],
    points: [
      "Versioned migration scripts",
      "Expand then contract",
      "Backward compatible during overlap",
      "Back up and test first",
    ],
    notes: ["Add, migrate, switch, remove."],
    src: [
      [
        "PostgreSQL: ALTER TABLE",
        "https://www.postgresql.org/docs/current/sql-altertable.html",
      ],
      [
        "Express: Production best practices: performance",
        `${EX}/best-practice-performance.html`,
      ],
    ],
  }),
  q({
    slug: "process-managers-and-init-systems",
    topic: "Zero-downtime basics",
    d: "medium",
    title:
      "Why does a Node.js app need a process manager or init system in production?",
    kw: [
      "process manager",
      "restart on crash",
      "uncaught exception",
      "init system",
      "supervision",
    ],
    intent:
      "Checks you understand that Node processes can crash and must be restarted.",
    short:
      "A Node.js process exits when it hits an uncaught exception, and a server can also crash for reasons such as running out of memory. Without a supervisor the site stays down until someone notices. The Express documentation advises using a process manager to restart the app when it crashes, and the operating system's init system to restart the process manager when the machine reboots; the init system alone (such as systemd) can do both jobs. Restarting is a safety net, and the underlying errors should still be fixed.",
    detail: [
      "Log the error before exiting so the cause is not lost.",
      "Avoid restart loops by fixing crashes quickly and alerting on repeated restarts.",
      "Process managers can also give logs, monitoring and clustering.",
    ],
    ex: "An uncaught error crashes the API at 3 a.m.; PM2 restarts it within a second and an alert notes the restart.",
    mistakes: [
      "Running node directly in a terminal session.",
      "Relying on restarts to hide a crash loop.",
    ],
    follow: ["What restarts the process manager after a reboot?"],
    points: [
      "Uncaught exceptions end the process",
      "Process manager restarts the app",
      "Init system restarts the manager",
      "Still fix the underlying bug",
    ],
    notes: ["Supervise, but also fix."],
    src: [
      [
        "Express: Production best practices: performance (ensure your app automatically restarts)",
        `${EX}/best-practice-performance.html`,
      ],
      ["PM2: Quick start", `${PM}/quick-start/`],
    ],
  }),
  q({
    slug: "reverse-proxy-and-security-in-production",
    topic: "Production deployment checklist",
    d: "medium",
    title: "Why run Node.js behind a reverse proxy in production?",
    kw: [
      "reverse proxy",
      "tls termination",
      "static files",
      "compression",
      "security",
    ],
    intent: "Checks you know what a proxy handles so the app does not have to.",
    short:
      "A reverse proxy such as nginx sits in front of the Node.js app and takes on work that is better done outside it: terminating TLS, serving static files and caching, compressing responses, load balancing across instances, buffering slow clients, limiting request sizes and rates, and hiding the app server from the internet. The Express documentation recommends a reverse proxy, as it relieves the application of tasks like compression and serving static assets. The app should then trust the proxy for client IP and protocol.",
    detail: [
      "Only the proxy listens on public ports 80 and 443; the app listens on localhost.",
      "Set `trust proxy` in Express so `req.ip` and `req.protocol` are correct.",
      "Security headers can be added at the proxy too.",
    ],
    ex: "nginx serves the front-end build, compresses responses and forwards `/api` to Node.",
    mistakes: [
      "Exposing the Node port directly.",
      "Not configuring trust proxy.",
    ],
    follow: ["What does the app need to know about the proxy?"],
    points: [
      "Terminates TLS",
      "Serves static files, compresses, caches",
      "Hides the app",
      "App trusts the proxy",
    ],
    notes: ["Proxy handles the edge, Node handles the logic."],
    src: [
      [
        "Express: Production best practices: performance (use a reverse proxy)",
        `${EX}/best-practice-performance.html`,
      ],
      [
        "Express: Behind proxies",
        "https://expressjs.com/en/guide/behind-proxies.html",
      ],
    ],
  }),
  q({
    slug: "ci-cd-deploy-script-vps",
    topic: "VPS deployment",
    d: "medium",
    title: "How can a CI/CD pipeline deploy to a VPS over SSH?",
    kw: [
      "deploy over ssh",
      "rsync",
      "ssh key in ci",
      "deploy script",
      "pm2 reload",
    ],
    intent: "Checks you can automate a simple deployment safely.",
    short:
      "After tests pass, the pipeline connects to the server with SSH using a dedicated deploy key stored as a CI secret, uploads the build (for example with rsync or by pulling a versioned artifact), installs production dependencies, runs migrations, and reloads the app with `pm2 reload` or `systemctl restart`. Use a restricted deploy user with only the permissions it needs, pin the server's host key to avoid man-in-the-middle attacks, deploy to a new directory and switch a symlink so rollback is easy, and finish with a health check.",
    detail: [
      "Never reuse a personal SSH key for CI.",
      "Keep the last few releases on the server so you can roll back quickly.",
      "Make the deploy script idempotent so a rerun is safe.",
    ],
    ex: "The pipeline rsyncs `dist` into `/srv/app/releases/<sha>`, updates the `current` symlink and reloads PM2.",
    code: [
      [
        "Symlink release deploy",
        "bash",
        `ssh deploy@server "\\n  cd /srv/app/releases/$SHA && npm ci --omit=dev &&\\n  ln -sfn /srv/app/releases/$SHA /srv/app/current &&\\n  pm2 reload api\\n"`,
        [
          "Dependencies are installed in the new release folder.",
          "The `current` symlink switches versions.",
          "PM2 reloads the app.",
        ],
      ],
    ],
    mistakes: [
      "Using a personal key or root in CI.",
      "Overwriting files in place with no way back.",
    ],
    follow: ["Why use a symlink for releases?"],
    points: [
      "Dedicated deploy key as CI secret",
      "Upload, install, migrate, reload",
      "Symlink releases for rollback",
      "Health check at the end",
    ],
    notes: ["Automate with a restricted key."],
    src: [
      ["PM2: Process management (reload)", `${PM}/cluster-mode/`],
      [
        "GitHub: Secrets",
        "https://docs.github.com/en/actions/concepts/security/secrets",
      ],
    ],
  }),
  q({
    slug: "monitoring-after-deploy",
    topic: "Production deployment checklist",
    d: "medium",
    title: "What should you monitor after a deployment?",
    kw: ["monitoring", "error rate", "latency", "resource usage", "alerts"],
    intent: "Checks you verify releases with data.",
    short:
      "Watch the signals that show whether the release is healthy: error rates and HTTP status codes, response times, throughput, resource use such as CPU, memory and disk, restarts of the process, and business metrics like successful logins or payments. Compare them with the values before the release, and keep alerts for thresholds that need action. Logs help find the cause. Decide beforehand which numbers trigger a rollback, and watch closely for the first minutes after the release.",
    detail: [
      "PM2 offers `pm2 monit` for a local view of CPU and memory.",
      "Uptime checks from outside confirm the site is reachable.",
      "Alert on symptoms users feel, not only on server internals.",
    ],
    ex: "After a release the 5xx rate rises from 0.1 percent to 4 percent, so the team rolls back.",
    mistakes: [
      "Deploying and walking away.",
      "Alerts that fire constantly and get ignored.",
    ],
    follow: ["What would make you roll back?"],
    points: [
      "Errors and latency",
      "CPU, memory, disk, restarts",
      "Compare with the baseline",
      "Predefined rollback triggers",
    ],
    notes: ["Watch the numbers after you ship."],
    src: [
      ["PM2: Quick start (monitoring)", `${PM}/quick-start/`],
      [
        "Express: Production best practices: performance",
        `${EX}/best-practice-performance.html`,
      ],
    ],
  }),
  q({
    slug: "static-front-end-deployment-options",
    topic: "VPS deployment",
    d: "easy",
    title: "What are the options for deploying a React front end?",
    kw: [
      "static hosting",
      "nginx",
      "s3 cloudfront",
      "build output",
      "spa routing",
    ],
    intent: "Checks you know a build is just static files.",
    short:
      "`npm run build` produces static files (HTML, JavaScript, CSS and assets) that any static host can serve. Options include nginx on your own server serving the build folder, with a `try_files` fallback to `index.html` for client-side routes; cloud object storage such as Amazon S3 with a CDN like CloudFront; or hosting platforms built for static sites. Whichever you choose, serve over HTTPS, give hashed asset files long cache lifetimes and `index.html` a short one, and point the API base URL at the backend.",
    detail: [
      "The front end can be on a different domain than the API if CORS is configured.",
      "Deploying means replacing the files and, if needed, invalidating the CDN cache.",
      "Keep the previous build around for a quick rollback.",
    ],
    ex: "The build output is copied to `/var/www/app`, and nginx serves it with an SPA fallback.",
    mistakes: ["No SPA fallback.", "Caching index.html for a long time."],
    follow: ["Why does an SPA need a fallback route?"],
    points: [
      "Build gives static files",
      "nginx, S3 with CDN, or static hosts",
      "SPA fallback to index.html",
      "Cache assets long, HTML short",
    ],
    notes: ["A build is static files."],
    src: [
      [
        "nginx: try_files",
        "https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files",
      ],
      [
        "AWS S3: Hosting a static website",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html",
      ],
    ],
  }),
  q({
    slug: "firewall-ports-for-deployment",
    topic: "VPS deployment",
    d: "easy",
    title:
      "Which ports should be open on a production web server, and which should not?",
    kw: ["open ports", "ufw firewall", "port 22", "port 443", "database port"],
    intent: "Checks you expose only what is necessary.",
    short:
      "A typical web server needs inbound TCP 80 and 443 open to the public for HTTP and HTTPS, and SSH on 22 restricted to trusted addresses where possible. The application's own port, such as 3000, and databases such as 5432, 3306, 27017 and 6379 should listen on localhost or a private network and not be reachable from the internet, because the reverse proxy talks to the app locally. Use a host firewall like `ufw` plus any cloud security groups, deny incoming traffic by default, and check what is actually listening with a tool such as `ss -tulpn`.",
    detail: [
      "Port 80 stays open to redirect to HTTPS and for certificate validation.",
      "Databases exposed to the internet are a leading cause of breaches.",
      "Review the open ports after each change.",
    ],
    ex: "`ss -tulpn` shows Node listening on 127.0.0.1:3000 and nginx on 0.0.0.0:80 and 443.",
    mistakes: [
      "Binding the app or database to 0.0.0.0 and leaving the port open.",
      "Forgetting that cloud security groups and the host firewall both apply.",
    ],
    follow: ["How do you see what is listening on a server?"],
    points: [
      "Open 80 and 443, limit 22",
      "App and database ports stay private",
      "Default deny incoming",
      "Check with ss -tulpn",
    ],
    notes: ["Expose the proxy, hide everything else."],
    src: [
      ["Ubuntu Server: Firewalls", `${UB}/how-to/security/firewalls/`],
      ["ss(8)", "https://man7.org/linux/man-pages/man8/ss.8.html"],
    ],
  }),
  q({
    slug: "site-not-reachable-troubleshooting",
    topic: "VPS deployment",
    d: "medium",
    title:
      "After a deployment the site is down: how do you troubleshoot it step by step?",
    kw: ["troubleshooting", "502 bad gateway", "pm2 list", "nginx -t", "logs"],
    intent: "Checks you have a systematic path from symptom to cause.",
    short:
      "Work from the outside in. Does the domain resolve to the right IP (DNS)? Can you reach the server and the ports (firewall or security group)? Is nginx running and its config valid (`nginx -t`, `systemctl status nginx`)? Is the app process running (`pm2 list` or `systemctl status`) and listening on the expected port (`ss -tulpn`), and does `curl localhost:3000/health` answer on the server itself? Then read the logs: the nginx error log shows 502 or 504 causes, and the application logs show startup errors such as missing environment variables or database failures.",
    detail: [
      "A 502 usually means nginx cannot reach the app; a 504 means the app is too slow.",
      "Compare with what changed in the release, such as a new environment variable or migration.",
      "If the cause is not found quickly, roll back first, then investigate.",
    ],
    ex: "The app crashed at startup because `DATABASE_URL` was missing; PM2 showed it errored and nginx returned 502.",
    mistakes: [
      "Restarting everything randomly.",
      "Investigating for long while the site is down instead of rolling back.",
    ],
    follow: ["What does a 502 from nginx tell you?"],
    points: [
      "DNS, network, proxy, app, logs",
      "curl the app locally",
      "nginx -t and the error log",
      "Roll back first if needed",
    ],
    notes: ["Outside in, then logs."],
    src: [
      ["nginx: Controlling nginx", "https://nginx.org/en/docs/control.html"],
      ["PM2: Quick start", `${PM}/quick-start/`],
    ],
  }),
  q({
    slug: "versioned-releases-and-tags",
    topic: "Zero-downtime basics",
    d: "easy",
    title: "How do version tags help with deployments and rollbacks?",
    kw: [
      "git tag",
      "release version",
      "semantic versioning",
      "traceability",
      "rollback",
    ],
    intent: "Checks you can identify exactly what is deployed.",
    short:
      "A Git tag marks a specific commit as a release, such as `v1.4.2`, so you can always say exactly which code is deployed and rebuild or redeploy it. Deploying from tags or immutable build numbers, instead of whatever is at the tip of a branch, makes releases reproducible and makes rollback simple: redeploy the previous tag. Semantic versioning (major.minor.patch) communicates the size of a change, and the same version is applied to the build artifact or container image for traceability.",
    detail: [
      "Annotated tags (`git tag -a`) store a message and author.",
      "Push tags explicitly with `git push origin v1.4.2`.",
      "A changelog records what changed in each release.",
    ],
    ex: "Production runs `v1.4.2`; when it misbehaves, redeploying `v1.4.1` restores the previous behaviour.",
    mistakes: [
      "Deploying whatever is on main.",
      "Overwriting an existing tag with new code.",
    ],
    follow: ["What does semantic versioning communicate?"],
    points: [
      "Tag marks a release commit",
      "Deploy from tags, not branch tips",
      "Rollback = previous tag",
      "Version the artifact too",
    ],
    notes: ["Know exactly what is live."],
    src: [
      ["Git: Tagging", "https://git-scm.com/book/en/v2/Git-Basics-Tagging"],
    ],
  }),
  q({
    slug: "backups-and-disaster-recovery-basics",
    topic: "Production deployment checklist",
    d: "medium",
    title:
      "What backup and recovery basics should a production deployment have?",
    kw: ["backups", "restore test", "recovery", "off-site backup", "rpo rto"],
    intent: "Checks you plan for data loss, not only for deployments.",
    short:
      "Back up the data that cannot be recreated, mainly the database and uploaded files, automatically and on a schedule, and store copies off the server, ideally in another location or account. Define how much data loss you can accept (recovery point objective) and how long recovery may take (recovery time objective), and set the backup frequency and process to match. Test restores regularly, protect the backups with access controls and encryption, and document the recovery steps. Code and configuration should be in version control so servers can be rebuilt.",
    detail: [
      "A backup that has never been restored is unproven.",
      "Managed databases provide automated backups and point-in-time recovery.",
      "Keep several generations, since a problem may go unnoticed for days.",
    ],
    ex: "A nightly database dump is copied to object storage, and a restore drill is run every quarter.",
    mistakes: [
      "Backups stored only on the same server.",
      "Never testing a restore.",
    ],
    follow: ["What do RPO and RTO mean?"],
    points: [
      "Back up data automatically",
      "Store copies off-server",
      "Define acceptable loss and recovery time",
      "Test restores",
    ],
    notes: ["Untested backups are not backups."],
    src: [
      [
        "AWS RDS: Introduction to backups",
        "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html",
      ],
      [
        "PostgreSQL: Backup and restore",
        "https://www.postgresql.org/docs/current/backup.html",
      ],
    ],
  }),
])
