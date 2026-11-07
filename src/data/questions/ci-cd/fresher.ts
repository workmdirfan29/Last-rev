import { defineQuestions } from "../author"
import { q } from "../compact"

const GH = "https://docs.github.com/en/actions"
const JK = "https://www.jenkins.io/doc/book/pipeline"
const BB = "https://support.atlassian.com/bitbucket-cloud/docs"
const AWSW = "https://docs.aws.amazon.com/whitepapers/latest"

export default defineQuestions("ci-cd", "fresher", [
  q({
    slug: "what-is-ci-cd",
    topic: "Pipelines",
    d: "easy",
    title: "What are continuous integration and continuous delivery?",
    kw: [
      "ci/cd",
      "continuous integration",
      "continuous delivery",
      "continuous deployment",
      "automation",
    ],
    intent:
      "A foundation question: checks you can explain the practice, not just the tools.",
    short:
      "Continuous integration (CI) means developers merge their changes into a shared branch frequently, and every change is automatically built and tested, so integration problems are found within minutes. Continuous delivery (CD) extends this so that every change that passes the pipeline is packaged and ready to be released to production at any time, usually with a manual approval step. Continuous deployment goes one step further and releases every passing change automatically. Together they make releases small, frequent and low risk.",
    detail: [
      "Automation replaces manual build, test and deploy steps that are slow and error-prone.",
      "Fast feedback matters: a pipeline that takes hours is rarely used well.",
      "A pipeline is defined as code, so it is versioned and reviewed like the application.",
    ],
    ex: "When a developer opens a pull request, the pipeline installs dependencies, runs lint and tests, and reports the result before anyone reviews the code.",
    mistakes: [
      "Merging with a red pipeline.",
      "Treating delivery and deployment as the same thing.",
    ],
    follow: [
      "What is the difference between continuous delivery and continuous deployment?",
    ],
    points: [
      "CI: build and test every change",
      "Delivery: always releasable, manual release",
      "Deployment: automatic release",
      "Small, frequent, low-risk releases",
    ],
    notes: ["Integrate often, release safely."],
    src: [
      [
        "AWS: Practicing CI/CD",
        `${AWSW}/practicing-continuous-integration-continuous-delivery/welcome.html`,
      ],
      [
        "GitHub: Understanding GitHub Actions",
        `${GH}/get-started/understand-github-actions`,
      ],
    ],
  }),
  q({
    slug: "pipeline-stages-typical",
    topic: "Pipelines",
    d: "easy",
    title: "What are the typical stages of a CI/CD pipeline?",
    kw: ["pipeline stages", "build", "test", "lint", "deploy"],
    intent: "Checks you can lay out a sensible pipeline order.",
    short:
      "A typical pipeline runs these stages in order: check out the code, install dependencies, run static checks such as lint and type checks, run unit tests, build the application (or a container image), run further tests such as integration tests, scan for vulnerabilities, publish the artifact or image, and deploy to an environment such as staging and then production. Cheap, fast checks run first so failures are reported early, and any failing stage stops the pipeline.",
    detail: [
      "Jobs that do not depend on each other can run in parallel.",
      "The build output is stored as an artifact so later stages use exactly what was tested.",
      "Production deployment often needs an approval or a successful staging run.",
    ],
    ex: "A Node project runs `npm ci`, lint, tests and `npm run build`, builds a Docker image, pushes it, and deploys it to staging.",
    mistakes: [
      "Rebuilding the artifact separately for each environment.",
      "Putting slow tests before fast ones.",
    ],
    follow: ["Why run cheap checks first?"],
    points: [
      "Install, lint, test, build, scan, publish, deploy",
      "Fail fast",
      "Build once, promote the artifact",
      "Parallelise independent jobs",
    ],
    notes: ["Fast checks first, build once."],
    src: [
      [
        "AWS: Practicing CI/CD",
        `${AWSW}/practicing-continuous-integration-continuous-delivery/welcome.html`,
      ],
      ["GitHub: Workflows", `${GH}/concepts/workflows-and-actions/workflows`],
    ],
  }),
  q({
    slug: "build-once-promote-artifact",
    topic: "Pipelines",
    d: "medium",
    title:
      "Why should you build an artifact once and promote it through environments?",
    kw: [
      "artifact",
      "promotion",
      "immutable build",
      "environments",
      "reproducibility",
    ],
    intent: "Checks you understand why testing the same binary matters.",
    short:
      "If each environment rebuilds the code, the thing you tested in staging is not guaranteed to be what runs in production, because dependencies, base images or build tools may have changed in between. Build one immutable artifact, such as a versioned container image or a JAR, tag it with the commit or version, and promote that same artifact through test, staging and production. Differences between environments are supplied by configuration and secrets at deploy time, not baked into the build.",
    detail: [
      "A registry or artifact store holds versioned artifacts.",
      "Rollback becomes deploying a previous artifact version.",
      "Tag with the commit SHA so every deployment traces to the exact source.",
    ],
    ex: "Image `shop-api:3f9c2ab` passes staging and is deployed unchanged to production with production environment variables.",
    mistakes: [
      "Building a separate image per environment.",
      "Baking environment-specific secrets into the artifact.",
    ],
    follow: ["How does this make rollback easier?"],
    points: [
      "Build once",
      "Immutable, versioned artifact",
      "Config injected per environment",
      "Traceable to a commit",
    ],
    notes: ["Promote the artifact, not the code."],
    src: [
      [
        "AWS: Practicing CI/CD",
        `${AWSW}/practicing-continuous-integration-continuous-delivery/welcome.html`,
      ],
      ["GitHub: Workflows", `${GH}/concepts/workflows-and-actions/workflows`],
    ],
  }),
  q({
    slug: "pipeline-secrets-and-config",
    topic: "Pipelines",
    d: "medium",
    title: "How do you handle secrets in a CI/CD pipeline?",
    kw: [
      "secrets",
      "credentials",
      "least privilege",
      "masking",
      "environment variables",
    ],
    intent: "Checks you keep credentials out of the repository and logs.",
    short:
      "Never commit passwords, tokens or keys to the repository. Store them in the CI system's secret store (GitHub Actions secrets, Jenkins credentials, Bitbucket secured variables) and expose them to jobs only when needed, so they are masked in logs. Give each secret the minimum permissions and scope it per environment, rotate it when it leaks or staff change, and prefer short-lived credentials such as OpenID Connect-based cloud access over long-lived keys. Untrusted code, such as pull requests from forks, should not receive secrets.",
    detail: [
      "Do not echo secrets or pass them on command lines that appear in logs.",
      "Use separate credentials for staging and production.",
      "Review who can edit pipeline files, since they can reach the secrets.",
    ],
    ex: "The deploy job reads a production token from the environment's secrets, available only after a reviewer approves the deployment.",
    mistakes: [
      "Hard-coding keys in the pipeline file.",
      "Sharing one all-powerful key across environments.",
    ],
    follow: ["Why not give secrets to builds from forks?"],
    points: [
      "Use the secret store",
      "Least privilege and per environment",
      "Masked in logs",
      "Rotate and prefer short-lived credentials",
    ],
    notes: ["Secrets in the store, never in git."],
    src: [
      ["GitHub: Secrets", `${GH}/concepts/security/secrets`],
      ["GitHub: Secure use reference", `${GH}/reference/security/secure-use`],
    ],
  }),
  q({
    slug: "pipeline-caching-and-speed",
    topic: "Pipelines",
    d: "medium",
    title: "How do you make a pipeline faster?",
    kw: [
      "dependency caching",
      "parallel jobs",
      "pipeline speed",
      "fail fast",
      "incremental builds",
    ],
    intent: "Checks you know the main levers for fast feedback.",
    short:
      "Cache dependencies between runs, keyed on the lockfile, so installs take seconds; run independent jobs such as lint, unit tests and type checks in parallel; fail fast by putting quick checks first; split long test suites across parallel runners; reuse Docker layers; and only run what changed where the tooling allows. Keep the pipeline's total time short, because slow feedback makes people batch changes and skip waiting. Caches must be keyed so a changed lockfile creates a fresh cache.",
    detail: [
      "In GitHub Actions, caches not accessed for 7 days are removed and a repository has a default size limit of 10 GB.",
      "A stale or poisoned cache can cause confusing builds, so know how to clear it.",
      "Measure stage durations to find the slowest step.",
    ],
    ex: "Caching `node_modules` by the hash of `package-lock.json` cut install time from two minutes to ten seconds.",
    mistakes: [
      "Caching with a fixed key so dependency changes are ignored.",
      "Running everything sequentially.",
    ],
    follow: ["What should a cache key include?"],
    points: [
      "Cache by lockfile hash",
      "Parallel jobs",
      "Fail fast",
      "Measure the slowest stage",
    ],
    notes: ["Cache, parallelise, fail fast."],
    src: [
      [
        "GitHub: Dependency caching reference",
        `${GH}/reference/workflows-and-actions/dependency-caching`,
      ],
      ["Bitbucket: Caches", `${BB}/cache-dependencies/`],
    ],
  }),
  q({
    slug: "environments-and-approvals",
    topic: "Pipelines",
    d: "medium",
    title: "How do environments and manual approvals work in a pipeline?",
    kw: [
      "environments",
      "manual approval",
      "staging",
      "production",
      "deployment protection",
    ],
    intent: "Checks you can gate production deployments.",
    short:
      "A pipeline normally deploys to several environments, for example test, staging and production, each with its own configuration and secrets. CI/CD tools let you attach protection rules to an environment: required reviewers who must approve before a job can deploy, restricted branches, and wait timers. The pipeline deploys automatically to lower environments and pauses for approval before production. Deployments are tracked per environment, so you can see what version is where.",
    detail: [
      "GitHub Actions has environments with required reviewers and environment secrets.",
      "Bitbucket Pipelines has deployment environments, and a step can be set to `trigger: manual`.",
      "Jenkins can use an `input` step to wait for approval.",
    ],
    ex: "Merges to `main` deploy to staging automatically; production waits until a lead approves in the pipeline.",
    mistakes: [
      "Deploying to production from any branch.",
      "Sharing secrets across all environments.",
    ],
    follow: ["How do you pause a Jenkins pipeline for approval?"],
    points: [
      "Separate configs and secrets per environment",
      "Required reviewers for production",
      "Auto to lower environments",
      "Track deployments",
    ],
    notes: ["Automatic to staging, approved to production."],
    src: [
      [
        "GitHub: Controlling deployments",
        `${GH}/how-tos/deploy/configure-and-manage-deployments/control-deployments`,
      ],
      [
        "Bitbucket: Set up and monitor deployments",
        `${BB}/set-up-and-monitor-deployments/`,
      ],
    ],
  }),
  q({
    slug: "deployment-strategies-overview",
    topic: "Deployment strategies",
    d: "medium",
    title: "What are the main deployment strategies?",
    kw: [
      "rolling deployment",
      "blue green",
      "canary",
      "recreate",
      "deployment strategy",
    ],
    intent: "Checks you can compare release strategies and their risk.",
    short:
      "In an all-at-once or recreate deployment the old version is stopped and the new one started, which is simple but causes downtime. A rolling deployment replaces instances gradually, so capacity stays available. Blue/green runs the new version beside the old in a separate identical environment and switches traffic over at once, with instant rollback by switching back. A canary release sends a small share of traffic to the new version first and increases it if metrics stay healthy. The choice balances cost, speed, risk and the ability to roll back.",
    detail: [
      "Blue/green needs double capacity during the switch.",
      "Canary needs good monitoring to detect problems early.",
      "Database changes must be backward compatible for rolling and canary releases.",
    ],
    ex: "A shop uses a canary to send 5 percent of traffic to a new checkout and watches errors before going to 100 percent.",
    mistakes: [
      "Releasing with no rollback plan.",
      "Schema changes that break the old version while it is still running.",
    ],
    follow: ["Which strategy allows instant rollback?"],
    points: [
      "Recreate: simple, downtime",
      "Rolling: gradual replacement",
      "Blue/green: switch environments",
      "Canary: small share first",
    ],
    notes: ["Trade cost against risk."],
    src: [
      [
        "AWS: Deployment strategies",
        `${AWSW}/introduction-devops-aws/deployment-strategies.html`,
      ],
      [
        "AWS: Overview of deployment options",
        `${AWSW}/overview-deployment-options/deployment-strategies.html`,
      ],
    ],
  }),
  q({
    slug: "blue-green-deployment",
    topic: "Deployment strategies",
    d: "medium",
    title: "How does a blue/green deployment work and what are its trade-offs?",
    kw: [
      "blue/green",
      "traffic switch",
      "rollback",
      "load balancer",
      "idle environment",
    ],
    intent: "Checks you understand the mechanism and the cost.",
    short:
      "Two identical production environments exist: blue serves live traffic and green is idle. You deploy the new version to green, test it there, and then switch the router or load balancer to send traffic to green, making it live. If something goes wrong, switch back to blue immediately. The benefits are near-zero downtime and fast rollback; the costs are running two environments, which doubles infrastructure for a time, and the need to handle shared data such as the database carefully, since both versions use it.",
    detail: [
      "The switch can be a DNS change, a load balancer target change or a service selector.",
      "Keep the old environment for a while after the switch before removing it.",
      "Schema changes must work with both versions.",
    ],
    ex: "A new release is validated on green with smoke tests, then the load balancer points to green in one step.",
    mistakes: [
      "Forgetting that database changes are shared.",
      "Tearing down blue too early.",
    ],
    follow: ["How do you roll back a blue/green release?"],
    points: [
      "Idle identical environment",
      "Switch traffic at once",
      "Instant rollback",
      "Costs extra capacity",
    ],
    notes: ["Deploy to idle, switch, keep the old for rollback."],
    src: [
      [
        "AWS: Deployment strategies",
        `${AWSW}/introduction-devops-aws/deployment-strategies.html`,
      ],
    ],
  }),
  q({
    slug: "canary-and-rolling-kubernetes",
    topic: "Deployment strategies",
    d: "hard",
    title: "How do rolling updates and canary releases reduce risk?",
    kw: [
      "rolling update",
      "canary release",
      "maxUnavailable",
      "maxSurge",
      "kubernetes deployment",
    ],
    intent:
      "Checks you know a rolling update keeps capacity and a canary limits blast radius.",
    short:
      "A rolling update replaces instances a few at a time, keeping most of the old version serving until new ones are healthy, so users see no downtime. In Kubernetes, a Deployment uses the RollingUpdate strategy by default and `maxUnavailable` and `maxSurge` control how many pods may be down or extra during the rollout. A canary release goes further by exposing the new version to a small slice of users first. If error rates or latency worsen, you stop and roll back, so only a few users were affected.",
    detail: [
      "Readiness probes tell the platform when a new instance can receive traffic.",
      "`kubectl rollout undo` returns a Deployment to its previous revision.",
      "Metrics and alerts decide whether a canary is promoted.",
    ],
    ex: "A rollout replaces one pod at a time; a failing readiness probe halts it before most users are affected.",
    mistakes: [
      "No readiness probe, so traffic reaches pods that are not ready.",
      "No monitoring to judge the canary.",
    ],
    follow: ["What does a readiness probe do?"],
    points: [
      "Rolling replaces gradually",
      "Kubernetes default strategy is RollingUpdate",
      "Canary limits blast radius",
      "Probes and metrics guard rollout",
    ],
    notes: ["Little by little, with checks."],
    src: [
      [
        "Kubernetes: Deployments",
        "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
      ],
      [
        "AWS: Deployment strategies",
        `${AWSW}/introduction-devops-aws/deployment-strategies.html`,
      ],
    ],
  }),
  q({
    slug: "rollback-and-feature-flags",
    topic: "Deployment strategies",
    d: "medium",
    title: "How do you roll back a bad release, and what do feature flags add?",
    kw: [
      "rollback",
      "feature flags",
      "roll forward",
      "backward compatible",
      "hotfix",
    ],
    intent: "Checks you plan for failure and decouple deploy from release.",
    short:
      "A rollback redeploys the previous known-good artifact, which is quick if artifacts are versioned and the database change is backward compatible; sometimes rolling forward with a quick fix is safer when data has already changed. Feature flags separate deploying code from releasing a feature: the code ships turned off and is enabled gradually or for some users, and turned off again instantly without a deployment if it misbehaves. Both need monitoring that tells you quickly that something is wrong.",
    detail: [
      "Database migrations should be written to work with the old and new code.",
      "Remove old flags after launch so the code does not fill with dead branches.",
      "Practise rollbacks, so they are routine and not an emergency improvisation.",
    ],
    ex: "A new search is released behind a flag for 10 percent of users; after errors spike it is switched off in seconds.",
    mistakes: [
      "Irreversible migrations released with the code.",
      "Flags that live forever.",
    ],
    follow: ["When would you roll forward instead?"],
    points: [
      "Redeploy the previous artifact",
      "Backward-compatible migrations",
      "Flags decouple deploy from release",
      "Monitor to detect problems",
    ],
    notes: ["Make every release reversible."],
    src: [
      [
        "AWS: Deployment strategies",
        `${AWSW}/introduction-devops-aws/deployment-strategies.html`,
      ],
      [
        "Kubernetes: Rolling back a Deployment",
        "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
      ],
    ],
  }),
  q({
    slug: "jenkins-what-and-architecture",
    topic: "Jenkins",
    d: "easy",
    title: "What is Jenkins and how is it structured?",
    kw: ["jenkins", "controller", "agents", "plugins", "automation server"],
    intent: "Checks you know the basic architecture of the classic CI server.",
    short:
      "Jenkins is an open-source automation server used to build, test and deploy software. A Jenkins controller schedules jobs and manages configuration, while agents (nodes) execute the work, so builds run on separate machines or containers rather than on the controller. Its functionality is extended with plugins, and pipelines are defined as code in a `Jenkinsfile`. Because Jenkins is self-hosted, you maintain its updates, plugins, security and backups.",
    detail: [
      "Running builds on the controller is discouraged, for security and stability.",
      "Credentials are kept in Jenkins' credential store.",
      "Multibranch pipelines create a job for each branch that has a Jenkinsfile.",
    ],
    ex: "A Jenkins controller dispatches each build to a Docker-based agent that has Node and Maven installed.",
    mistakes: [
      "Building on the controller.",
      "Installing many unmaintained plugins.",
    ],
    follow: ["What is the role of an agent?"],
    points: [
      "Open-source automation server",
      "Controller plus agents",
      "Plugins extend it",
      "Self-hosted maintenance",
    ],
    notes: ["Controller schedules, agents build."],
    src: [
      ["Jenkins: Pipeline", `${JK}/`],
      [
        "Jenkins: Managing nodes",
        "https://www.jenkins.io/doc/book/managing/nodes/",
      ],
    ],
  }),
  q({
    slug: "jenkinsfile-declarative-pipeline",
    topic: "Jenkins",
    d: "medium",
    title:
      "What is a Jenkinsfile and what does a declarative pipeline look like?",
    kw: ["jenkinsfile", "declarative pipeline", "stages", "steps", "agent"],
    intent: "Checks you can read and write a simple Jenkinsfile.",
    short:
      "A Jenkinsfile is a text file, checked into the repository, that defines a Pipeline as code. Pipeline supports two syntaxes, Declarative and Scripted; Declarative has a structured format with a `pipeline` block containing an `agent` (where to run), optional `environment`, `stages` made of `stage` blocks with `steps`, and a `post` section for actions after the run. Keeping the Jenkinsfile in source control lets the pipeline be reviewed, versioned and audited like the code.",
    detail: [
      "`post` can run actions `always`, on `success` or on `failure`.",
      "Stages appear as a visual progression in the Jenkins UI.",
      "Complex logic can be moved into shared libraries.",
    ],
    ex: "The repository's Jenkinsfile builds with npm, runs tests and archives the build output.",
    code: [
      [
        "Declarative Jenkinsfile",
        "groovy",
        `pipeline {\n  agent any\n  stages {\n    stage('Install') { steps { sh 'npm ci' } }\n    stage('Test')    { steps { sh 'npm test' } }\n    stage('Build')   { steps { sh 'npm run build' } }\n  }\n  post {\n    failure { echo 'Build failed' }\n  }\n}`,
        [
          "`agent any` runs on any available agent.",
          "Each `stage` has its own steps.",
          "`post` reacts to the result.",
        ],
      ],
    ],
    mistakes: [
      "Configuring jobs only in the web UI.",
      "Putting all logic in one huge stage.",
    ],
    follow: ["What is the difference between declarative and scripted syntax?"],
    points: [
      "Pipeline as code in a Jenkinsfile",
      "Declarative: pipeline, agent, stages, steps, post",
      "Stored in source control",
      "Shared libraries for reuse",
    ],
    notes: ["Jenkinsfile lives with the code."],
    src: [
      ["Jenkins: Using a Jenkinsfile", `${JK}/jenkinsfile/`],
      ["Jenkins: Pipeline syntax", `${JK}/syntax/`],
    ],
  }),
  q({
    slug: "jenkins-credentials-and-environment",
    topic: "Jenkins",
    d: "medium",
    title:
      "How do you use credentials and environment variables safely in Jenkins?",
    kw: [
      "jenkins credentials",
      "credentials()",
      "withCredentials",
      "environment block",
      "secret masking",
    ],
    intent: "Checks you keep secrets out of the Jenkinsfile and logs.",
    short:
      "Store secrets in Jenkins' credential store and reference them by ID, never writing them into the Jenkinsfile. In a declarative pipeline the `environment` block can bind a credential with `credentials('my-id')`, and the `withCredentials` step exposes it only within a block. Jenkins masks secret values in the console output. Be careful with Groovy string interpolation of secrets, which can leak them; the Jenkins documentation advises using single-quoted shell strings so the shell, not Groovy, expands the variable.",
    detail: [
      "Credential types include secret text, username and password, secret files and SSH keys.",
      "Restrict who may use or view credentials.",
      "Use separate credentials per environment.",
    ],
    ex: "A deploy stage binds an API token credential and passes it to the deploy script through an environment variable.",
    code: [
      [
        "Bind a credential",
        "groovy",
        `environment {\n  API_TOKEN = credentials('deploy-token')\n}\nsteps {\n  sh 'deploy.sh --token "$API_TOKEN"'\n}`,
        [
          "The credential is referenced by its ID.",
          "Single quotes let the shell expand the variable, not Groovy.",
        ],
      ],
    ],
    mistakes: [
      "Hard-coding tokens in the Jenkinsfile.",
      "Interpolating secrets in double-quoted Groovy strings.",
    ],
    follow: ["Why use single quotes with secrets?"],
    points: [
      "Credential store with IDs",
      "credentials() and withCredentials",
      "Masked in logs",
      "Avoid Groovy interpolation of secrets",
    ],
    notes: ["Reference secrets by ID."],
    src: [
      ["Jenkins: Using a Jenkinsfile (credentials)", `${JK}/jenkinsfile/`],
      [
        "Jenkins: Using credentials",
        "https://www.jenkins.io/doc/book/using/using-credentials/",
      ],
    ],
  }),
  q({
    slug: "jenkins-multibranch-parallel-post",
    topic: "Jenkins",
    d: "hard",
    title:
      "What are multibranch pipelines, parallel stages and the post section in Jenkins?",
    kw: [
      "multibranch pipeline",
      "parallel",
      "post always",
      "input step",
      "branch builds",
    ],
    intent: "Checks you know the features used in real pipelines.",
    short:
      "A multibranch pipeline scans a repository and automatically creates a pipeline for each branch (and pull request) that contains a Jenkinsfile, so feature branches get their own builds. A `parallel` block runs stages at the same time on available agents, shortening total time, for example running unit and integration tests together. The `post` section runs after stages, with conditions such as `always` for cleanup, `success` and `failure` for notifications. An `input` step pauses the pipeline for human approval before a risky stage.",
    detail: [
      "Use `when` conditions to run deploy stages only on certain branches.",
      "Archive test reports and build artifacts in `post`.",
      "Parallel stages need enough agents to benefit.",
    ],
    ex: "Pull requests run tests only, while the main branch also deploys to staging.",
    mistakes: [
      "Deploying from every branch.",
      "Parallel stages that share state and conflict.",
    ],
    follow: ["How do you restrict a stage to main?"],
    points: [
      "Multibranch: pipeline per branch",
      "parallel shortens runs",
      "post for cleanup and notifications",
      "input for approvals",
    ],
    notes: ["Branch builds, parallel tests, gated deploys."],
    src: [
      ["Jenkins: Branches and pull requests", `${JK}/multibranch/`],
      ["Jenkins: Pipeline syntax", `${JK}/syntax/`],
    ],
  }),
  q({
    slug: "github-actions-workflow-anatomy",
    topic: "GitHub Actions",
    d: "easy",
    title: "What are the parts of a GitHub Actions workflow?",
    kw: ["github actions", "workflow", "jobs", "steps", "runs-on"],
    intent: "Checks you can read a workflow file.",
    short:
      "A workflow is a YAML file in `.github/workflows` that runs when an event occurs. It contains one or more jobs; each job runs on a runner chosen by `runs-on`, and consists of steps. A step either runs a shell command with `run` or uses a reusable action with `uses`. Jobs run in parallel by default, and `needs` makes one wait for another. Events such as `push`, `pull_request`, `schedule` and `workflow_dispatch` trigger workflows.",
    detail: [
      "Each job gets a fresh runner environment, so files are not shared between jobs unless uploaded as artifacts or cached.",
      "`actions/checkout` fetches the repository code onto the runner.",
      "Use `if` conditions to run steps or jobs conditionally.",
    ],
    ex: "A workflow runs lint and tests on every pull request and on pushes to `main`.",
    code: [
      [
        "A CI workflow",
        "yaml",
        `name: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm test`,
        [
          "`on` lists the triggering events.",
          "The job runs on an Ubuntu runner.",
          "Steps check out, set up Node, install and test.",
        ],
      ],
    ],
    mistakes: [
      "Expecting files to persist between jobs.",
      "Forgetting the checkout step.",
    ],
    follow: ["How do you make one job wait for another?"],
    points: [
      "Workflow file in .github/workflows",
      "Events trigger jobs",
      "Jobs run on runners, in parallel by default",
      "Steps use run or uses",
    ],
    notes: ["Event, job, runner, steps."],
    src: [
      ["GitHub: Workflows", `${GH}/concepts/workflows-and-actions/workflows`],
      [
        "GitHub: Workflow syntax",
        `${GH}/reference/workflows-and-actions/workflow-syntax`,
      ],
    ],
  }),
  q({
    slug: "github-actions-triggers",
    topic: "GitHub Actions",
    d: "medium",
    title: "Which events can trigger a GitHub Actions workflow?",
    kw: [
      "push",
      "pull_request",
      "workflow_dispatch",
      "schedule",
      "path filters",
    ],
    intent: "Checks you can choose triggers carefully.",
    short:
      "Workflows run in response to events. `push` and `pull_request` are the most common for CI, and can be filtered by branches, tags or file paths. `workflow_dispatch` adds a manual Run button with optional inputs, `schedule` runs on a cron schedule, `release` and `workflow_call` (for reusable workflows) cover other cases. Choose triggers so pipelines run when needed without wasting runner minutes or running trusted deployment steps for untrusted code.",
    detail: [
      "Run tests on `pull_request`, and deploy only from `push` to protected branches.",
      "Path filters can skip workflows when only documentation changes.",
      "Pull requests from forks run with limited permissions and no secrets.",
    ],
    ex: "Tests run on every pull request; the deploy workflow runs only on pushes to `main`.",
    mistakes: [
      "Running deploys on every branch.",
      "Running full pipelines for README-only changes.",
    ],
    follow: ["What is workflow_dispatch for?"],
    points: [
      "push, pull_request, schedule, workflow_dispatch",
      "Filter by branch and paths",
      "Deploy only from protected branches",
      "Forks get limited permissions",
    ],
    notes: ["Choose the narrowest trigger."],
    src: [
      [
        "GitHub: Events that trigger workflows",
        `${GH}/reference/workflows-and-actions/events-that-trigger-workflows`,
      ],
      [
        "GitHub: Manually running a workflow",
        `${GH}/how-tos/manage-workflow-runs/manually-run-a-workflow`,
      ],
    ],
  }),
  q({
    slug: "github-actions-secrets-and-token",
    topic: "GitHub Actions",
    d: "medium",
    title: "How do secrets and GITHUB_TOKEN work in GitHub Actions?",
    kw: [
      "secrets context",
      "GITHUB_TOKEN",
      "permissions",
      "least privilege",
      "environment secrets",
    ],
    intent: "Checks you configure access with least privilege.",
    short:
      "Secrets are encrypted values stored at repository, environment or organisation level and read in a workflow with `${{ secrets.NAME }}`; GitHub masks them in logs. In addition, GitHub creates a temporary `GITHUB_TOKEN` for each job, valid only while the job runs and limited to the repository containing the workflow. Use the `permissions` key to give it the least access needed, for example `contents: read`. Secrets are not passed to workflows triggered by pull requests from forks.",
    detail: [
      "Environment secrets are available only to jobs that target that environment and pass its protection rules.",
      "Avoid printing secrets or writing them to files that are uploaded as artifacts.",
      "Third-party actions run with access to what the job has, so review them.",
    ],
    ex: "A deploy job reads `secrets.PROD_API_TOKEN` from the production environment, which requires a reviewer's approval.",
    code: [
      [
        "Least-privilege permissions",
        "yaml",
        `permissions:\n  contents: read\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - run: ./deploy.sh\n        env:\n          API_TOKEN: \${{ secrets.PROD_API_TOKEN }}`,
        [
          "`permissions` limits the automatic token.",
          "The secret is passed as an environment variable to one step.",
        ],
      ],
    ],
    mistakes: [
      "Leaving the default broad token permissions.",
      "Echoing secret values in logs.",
    ],
    follow: ["Why do forked pull requests not get secrets?"],
    points: [
      "secrets context",
      "GITHUB_TOKEN is per job and temporary",
      "permissions for least privilege",
      "Environment secrets need approval",
    ],
    notes: ["Limit the token, protect the secrets."],
    src: [
      ["GitHub: GITHUB_TOKEN", `${GH}/concepts/security/github_token`],
      ["GitHub: Secrets", `${GH}/concepts/security/secrets`],
    ],
  }),
  q({
    slug: "github-actions-matrix-and-caching",
    topic: "GitHub Actions",
    d: "medium",
    title: "How do matrix builds and caching work in GitHub Actions?",
    kw: [
      "matrix strategy",
      "actions/cache",
      "setup-node cache",
      "restore-keys",
      "parallel variations",
    ],
    intent: "Checks you can test several versions and speed up installs.",
    short:
      "A matrix strategy runs the same job with different variable combinations, such as several Node versions or operating systems, creating a job for each combination in parallel. Caching saves dependency downloads between runs: the `actions/cache` action (or the cache option of `setup-node`) stores files under a key, usually including the lockfile hash, and restores them on later runs; `restore-keys` allow a partial match as fallback. Unaccessed caches are evicted after 7 days and a repository has a default 10 GB total.",
    detail: [
      "`fail-fast` stops the other matrix jobs when one fails; you can turn it off.",
      "A cache is a performance aid only; the build must work without it.",
      "Do not cache secrets.",
    ],
    ex: "The library is tested on Node 20 and 22 across Linux and Windows, with npm dependencies cached.",
    code: [
      [
        "Matrix",
        "yaml",
        `strategy:\n  matrix:\n    node: [20, 22]\n    os: [ubuntu-latest, windows-latest]\nruns-on: \${{ matrix.os }}\nsteps:\n  - uses: actions/setup-node@v4\n    with:\n      node-version: \${{ matrix.node }}\n      cache: npm`,
        [
          "Four combinations run in parallel.",
          "`setup-node` caches npm downloads.",
        ],
      ],
    ],
    mistakes: [
      "Caches that never change because the key is fixed.",
      "Depending on the cache for correctness.",
    ],
    follow: ["What does restore-keys do?"],
    points: [
      "Matrix runs combinations in parallel",
      "Cache key from the lockfile hash",
      "restore-keys for partial matches",
      "Caches expire and have size limits",
    ],
    notes: ["Matrix for variety, cache for speed."],
    src: [
      [
        "GitHub: Running variations of jobs",
        `${GH}/how-tos/write-workflows/choose-what-workflows-do/run-job-variations`,
      ],
      [
        "GitHub: Dependency caching reference",
        `${GH}/reference/workflows-and-actions/dependency-caching`,
      ],
    ],
  }),
  q({
    slug: "github-actions-artifacts-and-deploy",
    topic: "GitHub Actions",
    d: "medium",
    title:
      "How do you pass build output between jobs and deploy with GitHub Actions?",
    kw: [
      "upload-artifact",
      "download-artifact",
      "needs",
      "environment",
      "deploy job",
    ],
    intent: "Checks you can structure build and deploy jobs.",
    short:
      "Each job runs on a fresh runner, so a build job uploads its output with `actions/upload-artifact`, and a later deploy job, declared with `needs: build`, downloads it with `actions/download-artifact`. The deploy job targets an `environment`, so protection rules such as required reviewers and environment secrets apply, and it is limited to the main branch with an `if` condition or a branch rule. This ensures the artifact that was built and tested is the one that gets deployed.",
    detail: [
      "A `concurrency` group prevents two deployments to the same environment running at once.",
      "Deploy jobs often use OpenID Connect to obtain short-lived cloud credentials instead of stored keys.",
      "Keep deployment steps idempotent so re-runs are safe.",
    ],
    ex: "Pushes to `main` build a Docker image, push it to a registry, then deploy it to staging.",
    code: [
      [
        "Build then deploy",
        "yaml",
        `jobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n      - uses: actions/upload-artifact@v4\n        with: { name: dist, path: dist }\n  deploy:\n    needs: build\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/download-artifact@v4\n        with: { name: dist }\n      - run: ./deploy.sh`,
        [
          "`needs` orders the jobs.",
          "The artifact carries the build output across runners.",
          "The environment applies approvals.",
        ],
      ],
    ],
    mistakes: [
      "Rebuilding in the deploy job.",
      "Concurrent deployments to the same environment.",
    ],
    follow: ["How do you stop two deploys running together?"],
    points: [
      "Artifacts carry files between jobs",
      "needs orders jobs",
      "environment applies protection rules",
      "Concurrency groups serialise deploys",
    ],
    notes: ["Upload, needs, download, deploy."],
    src: [
      [
        "GitHub: Workflow syntax",
        `${GH}/reference/workflows-and-actions/workflow-syntax`,
      ],
      [
        "GitHub: Controlling deployments",
        `${GH}/how-tos/deploy/configure-and-manage-deployments/control-deployments`,
      ],
    ],
  }),
  q({
    slug: "github-actions-security-pinning",
    topic: "GitHub Actions",
    d: "hard",
    title: "How do you use third-party actions securely?",
    kw: [
      "action pinning",
      "commit sha",
      "supply chain",
      "pull_request_target",
      "script injection",
    ],
    intent: "Checks you know workflows are a supply-chain risk.",
    short:
      "Third-party actions are code that runs with your job's access, so treat them as dependencies. Pin actions to a full commit SHA rather than a moving tag, which can be changed to point at different code, review what they do, and prefer actions from trusted publishers. Give workflows minimal `permissions`, avoid exposing secrets to untrusted code, and take care with untrusted input such as pull request titles or branch names placed directly into shell commands with `${{ }}`, which can allow script injection; pass them through environment variables instead.",
    detail: [
      "Dependabot can update pinned action versions.",
      "`pull_request_target` runs with secrets in the context of the base repository, so never check out and run untrusted pull request code there.",
      "Restrict which actions the organisation allows.",
    ],
    ex: "The workflow pins `actions/checkout` to a commit SHA and uses read-only token permissions.",
    mistakes: [
      "Referencing a mutable tag such as @main.",
      "Interpolating issue titles into a shell script.",
    ],
    follow: ["Why is a moving tag risky?"],
    points: [
      "Actions are dependencies",
      "Pin to a full commit SHA",
      "Minimal permissions",
      "Avoid injection from untrusted input",
    ],
    notes: ["Pin it, limit it, do not trust input."],
    src: [
      ["GitHub: Secure use reference", `${GH}/reference/security/secure-use`],
    ],
  }),
  q({
    slug: "github-actions-reusable-workflows",
    topic: "GitHub Actions",
    d: "hard",
    title: "How do you avoid duplicating workflow code across repositories?",
    kw: [
      "reusable workflows",
      "workflow_call",
      "composite action",
      "inputs",
      "templates",
    ],
    intent: "Checks you can share pipeline logic.",
    short:
      "Reusable workflows are workflow files with the `workflow_call` trigger, which other workflows call as a job using `uses: org/repo/.github/workflows/file.yml@ref`, passing `inputs` and `secrets`. Composite actions bundle several steps into one action for use inside a job. Both avoid copy-pasting pipelines across repositories, so a change in one place applies everywhere, and they let a platform team maintain a standard build and deploy process. Pin the version you call, so updates are deliberate.",
    detail: [
      "Reusable workflows are job-level; composite actions are step-level.",
      "Secrets can be passed explicitly or inherited.",
      "Keep interfaces small and document the inputs.",
    ],
    ex: "Every service calls the organisation's `build-and-push` workflow and passes only the image name.",
    mistakes: [
      "Copy-pasting workflows into every repo.",
      "Calling a reusable workflow from a moving branch in production.",
    ],
    follow: [
      "What is the difference between a reusable workflow and a composite action?",
    ],
    points: [
      "workflow_call defines a reusable workflow",
      "Called with uses at job level",
      "Composite actions bundle steps",
      "Pin the version",
    ],
    notes: ["Write once, call everywhere."],
    src: [
      [
        "GitHub: Reusing workflow configurations",
        `${GH}/concepts/workflows-and-actions/reusing-workflow-configurations`,
      ],
    ],
  }),
  q({
    slug: "bitbucket-pipelines-basics",
    topic: "Bitbucket Pipelines",
    d: "easy",
    title: "How does Bitbucket Pipelines work?",
    kw: [
      "bitbucket pipelines",
      "bitbucket-pipelines.yml",
      "steps",
      "image",
      "pipelines default",
    ],
    intent: "Checks you can read a basic Bitbucket pipeline.",
    short:
      "Bitbucket Pipelines is the built-in CI/CD service of Bitbucket Cloud. You define the pipeline in a `bitbucket-pipelines.yml` file at the root of the repository. It names a Docker `image` to run in, and a `pipelines` section with sequences such as `default` (every push), `branches`, `pull-requests`, `tags` or `custom` (manual or scheduled), each made of `step`s with `script` commands. Each step runs in a fresh container, so files are shared between steps through artifacts.",
    detail: [
      "A step can set its own image, caches, artifacts and `deployment` environment.",
      "Steps run in order unless placed in a `parallel` block.",
      "Pipes are ready-made integrations for common tasks.",
    ],
    ex: "The default pipeline installs dependencies and runs tests on every push; a branch pipeline for `main` also deploys.",
    code: [
      [
        "bitbucket-pipelines.yml",
        "yaml",
        `image: node:22\n\npipelines:\n  default:\n    - step:\n        name: Test\n        caches:\n          - node\n        script:\n          - npm ci\n          - npm test\n  branches:\n    main:\n      - step:\n          name: Build\n          script:\n            - npm ci\n            - npm run build\n          artifacts:\n            - dist/**`,
        [
          "`image` sets the container for steps.",
          "`default` runs for every push.",
          "`artifacts` carry files to later steps.",
        ],
      ],
    ],
    mistakes: [
      "Expecting files to persist across steps without artifacts.",
      "A wrong indentation in the YAML.",
    ],
    follow: ["What does the default pipeline run on?"],
    points: [
      "bitbucket-pipelines.yml in the repo root",
      "Docker image per pipeline or step",
      "default, branches, pull-requests, custom",
      "Artifacts between steps",
    ],
    notes: ["YAML in the repo, steps in containers."],
    src: [
      [
        "Bitbucket: Get started with Pipelines",
        `${BB}/get-started-with-bitbucket-pipelines/`,
      ],
      [
        "Bitbucket: Configure bitbucket-pipelines.yml",
        `${BB}/configure-bitbucket-pipelinesyml/`,
      ],
    ],
  }),
  q({
    slug: "bitbucket-variables-and-deployments",
    topic: "Bitbucket Pipelines",
    d: "medium",
    title:
      "How do variables, secured values and deployment environments work in Bitbucket Pipelines?",
    kw: [
      "repository variables",
      "secured variables",
      "deployment environments",
      "trigger manual",
      "deployment variables",
    ],
    intent: "Checks you can configure secrets and gated deployments.",
    short:
      "Variables are defined in the repository, workspace or deployment settings and are available to scripts as environment variables. Mark sensitive ones as secured so their values are masked in logs and cannot be read back. Deployment variables apply only to a named environment, for example test, staging or production, which a step selects with the `deployment:` key, so each environment has its own values and Bitbucket tracks what was deployed. Adding `trigger: manual` to a step makes it wait for someone to start it, which gates production.",
    detail: [
      "Do not print secured variables in scripts.",
      "Deployment environments show history of releases per environment.",
      "Branch restrictions can control who deploys to production.",
    ],
    ex: "The staging step deploys automatically; the production step has `deployment: production` and `trigger: manual`.",
    code: [
      [
        "Gated production step",
        "yaml",
        `- step:\n    name: Deploy to production\n    deployment: production\n    trigger: manual\n    script:\n      - ./deploy.sh "$PROD_API_TOKEN"`,
        [
          "`deployment` selects the environment and its variables.",
          "`trigger: manual` waits for a person to run it.",
        ],
      ],
    ],
    mistakes: [
      "Storing secrets as plain, unsecured variables.",
      "Production deploys without a manual gate.",
    ],
    follow: ["What does secured mean for a variable?"],
    points: [
      "Variables as environment variables",
      "Secured values are masked",
      "deployment: selects an environment",
      "trigger: manual gates a step",
    ],
    notes: ["Secure it, scope it, gate it."],
    src: [
      ["Bitbucket: Variables and secrets", `${BB}/variables-and-secrets/`],
      [
        "Bitbucket: Set up and monitor deployments",
        `${BB}/set-up-and-monitor-deployments/`,
      ],
    ],
  }),
  q({
    slug: "bitbucket-pipes-caches-services",
    topic: "Bitbucket Pipelines",
    d: "medium",
    title:
      "What are pipes, caches and service containers in Bitbucket Pipelines?",
    kw: [
      "pipes",
      "caches",
      "service containers",
      "docker service",
      "artifacts",
    ],
    intent: "Checks you know how to reuse integrations and speed up steps.",
    short:
      "A pipe is a packaged, reusable integration, such as deploying to a cloud provider or sending a notification, that you call in a script with `pipe:` and variables, so you do not write the commands yourself. Caches store dependency directories, such as `node`, between runs to speed up builds. Service containers like Postgres or Redis run next to the build container under `definitions: services`, and a step lists them in `services`, so tests can use a real database. Artifacts pass files between steps.",
    detail: [
      "Pin pipe versions for repeatable builds.",
      "A step can also use the Docker service to build images.",
      "Cache and artifact behaviour differs: caches speed builds; artifacts transfer outputs.",
    ],
    ex: "Integration tests run with a Postgres service container, and a pipe deploys the result.",
    mistakes: [
      "Unpinned pipe versions.",
      "Using caches to transfer build output.",
    ],
    follow: ["How do cache and artifact differ?"],
    points: [
      "Pipes are reusable integrations",
      "Caches speed up dependencies",
      "Service containers provide databases for tests",
      "Artifacts move outputs",
    ],
    notes: ["Pipe it, cache it, service it."],
    src: [
      [
        "Bitbucket: Use pipes in Bitbucket Pipelines",
        `${BB}/use-pipes-in-bitbucket-pipelines/`,
      ],
      [
        "Bitbucket: Databases and service containers",
        `${BB}/databases-and-service-containers/`,
      ],
      ["Bitbucket: Caches", `${BB}/cache-dependencies/`],
    ],
  }),
  q({
    slug: "pipeline-quality-gates",
    topic: "Pipelines",
    d: "medium",
    title: "What quality gates should a pipeline enforce?",
    kw: [
      "quality gates",
      "branch protection",
      "required checks",
      "code review",
      "test coverage",
    ],
    intent: "Checks you can make the pipeline protect the main branch.",
    short:
      "Quality gates are automated conditions a change must satisfy before it can merge or deploy. Typical gates are a successful build, lint and type checks, passing unit and integration tests, an agreed coverage threshold, dependency and secret scanning, and a required code review. Protect the main branch so the pipeline must pass and at least one person must approve before merging, and nobody can push straight to it. Gates should be reliable; flaky tests that are routinely ignored undermine them.",
    detail: [
      "Required status checks are configured in the repository's branch protection or branch restrictions.",
      "Keep tests deterministic and fix or quarantine flaky ones.",
      "Make failures easy to read, so developers can fix them quickly.",
    ],
    ex: "A pull request cannot be merged until the `test` check passes and one reviewer approves.",
    mistakes: [
      "Flaky tests that people rerun until green.",
      "Allowing direct pushes to main.",
    ],
    follow: ["Why is a flaky test harmful?"],
    points: [
      "Build, lint, tests, scans, review",
      "Branch protection with required checks",
      "Reliable, deterministic gates",
      "No direct pushes to main",
    ],
    notes: ["Green pipeline plus review to merge."],
    src: [
      ["GitHub: Workflows", `${GH}/concepts/workflows-and-actions/workflows`],
      [
        "Bitbucket: Pipelines overview",
        `${BB}/get-started-with-bitbucket-pipelines/`,
      ],
    ],
  }),
])
