import { defineQuestions } from "../author"
import { q } from "../compact"

const AN = "https://docs.anthropic.com/en"
const OAI = "https://platform.openai.com/docs/guides"
const EV = `${AN}/docs/test-and-evaluate/develop-tests`
const HAL = `${AN}/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations`
const JB = `${AN}/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks`

export default defineQuestions("ai-production", "fresher", [
  q({
    slug: "evaluation-pipeline-for-ai-features",
    topic: "AI application evaluation",
    d: "medium",
    title: "What does an evaluation pipeline for an AI feature look like?",
    kw: [
      "evaluation pipeline",
      "test dataset",
      "automated grading",
      "ci evaluation",
      "quality metrics",
    ],
    intent: "Checks the shape of a practical eval setup.",
    short:
      "Define measurable success criteria first, as Anthropic's guidance advises: accuracy, format validity, tone, safety, latency. Build a dataset of representative inputs with expected properties or reference answers, including edge cases and past failures. Add graders: code checks for format and exact facts, model-based grading with a rubric for quality, and human review of a sample. Run the set automatically on every change to prompts, models or retrieval, store results with the commit, compare against a baseline and fail the build on regressions. Review individual failures, not only averages, and feed new production failures back into the dataset.",
    detail: [
      "Keep a frozen test set so version comparisons are fair.",
      "Track cost and latency alongside quality.",
      "Small, well-chosen sets beat none.",
    ],
    ex: "A CI job running 200 cases and posting pass rate, latency and token usage on each pull request.",
    mistakes: [
      "Evaluating only on a few demo prompts.",
      "Reporting averages without reading failures.",
    ],
    follow: ["What belongs in the dataset?"],
    points: [
      "Criteria first",
      "Representative dataset with edge cases",
      "Layered graders",
      "Automate and compare to a baseline",
    ],
    notes: ["Evals are the tests of AI features."],
    src: [
      ["Anthropic docs: Define success criteria and build evaluations", EV],
      ["OpenAI docs: Working with evals", `${OAI}/evals`],
    ],
  }),
  q({
    slug: "offline-versus-online-evaluation",
    topic: "AI application evaluation",
    d: "medium",
    title: "What is the difference between offline and online evaluation?",
    kw: [
      "offline evaluation",
      "online evaluation",
      "production monitoring",
      "user feedback",
      "shadow testing",
    ],
    intent: "Checks understanding of when and how quality is measured.",
    short:
      "Offline evaluation runs your system on a fixed dataset before release, giving repeatable comparisons between prompts, models and settings without affecting users. Online evaluation measures behaviour on real traffic: user feedback, task success, escalation or retry rates, spot-check grading of sampled outputs and monitoring of errors, latency and cost. Offline tests catch regressions early but cannot cover every real input; online signals reveal what users actually do but are noisier and affect real people. Use both: gate releases on offline results, roll out gradually with monitoring, and add the failures seen online to the offline set.",
    detail: [
      "Shadow mode runs a new version on live inputs without showing its output.",
      "Sample production outputs for periodic human review.",
      "Alert on drops in key metrics.",
    ],
    ex: "A new prompt passes the offline suite, goes to 5% of users, and is monitored before full rollout.",
    mistakes: [
      "Relying only on offline scores.",
      "No monitoring after release.",
    ],
    follow: ["How do online failures improve offline tests?"],
    points: [
      "Offline: fixed dataset, repeatable",
      "Online: real traffic, real behaviour",
      "Use both",
      "Feed failures back",
    ],
    notes: ["Test before, watch after."],
    src: [
      ["Anthropic docs: Define success criteria and build evaluations", EV],
      [
        "OpenAI docs: Production best practices",
        `${OAI}/production-best-practices`,
      ],
    ],
  }),
  q({
    slug: "building-a-golden-dataset",
    topic: "AI application evaluation",
    d: "medium",
    title: "How do you build a good evaluation dataset?",
    kw: [
      "golden dataset",
      "test cases",
      "edge cases",
      "labelling",
      "data leakage",
    ],
    intent: "Checks practical dataset design.",
    short:
      "Start from real or realistic inputs for your use case, covering the common path and the hard cases: ambiguous questions, missing information, long inputs, different languages, adversarial or off-topic requests. For each, record the expected outcome as a reference answer, a label or a list of properties the output must satisfy. Have domain experts review labels, since mistakes in the dataset mislead every later decision. Keep it separate from examples used in prompts to avoid testing on what the model was shown, version it, and grow it with production failures. A few dozen carefully chosen cases are a good start; add more as needs appear.",
    detail: [
      "Synthetic cases can help, but check them against real data.",
      "Balance categories so the average is not dominated by easy cases.",
      "Record why each hard case is in the set.",
    ],
    ex: "Sixty support questions: 40 typical, 10 ambiguous, 10 that must be refused.",
    mistakes: ["Unreviewed labels.", "Using prompt examples as test cases."],
    follow: ["Why keep prompt examples out of the test set?"],
    points: [
      "Representative plus hard cases",
      "Expert-reviewed labels",
      "Separate from prompt examples",
      "Version and grow it",
    ],
    notes: ["Garbage dataset, garbage decisions."],
    src: [
      ["Anthropic docs: Define success criteria and build evaluations", EV],
      ["OpenAI docs: Working with evals", `${OAI}/evals`],
    ],
  }),
  q({
    slug: "llm-as-judge-pitfalls",
    topic: "AI application evaluation",
    d: "hard",
    title: "What are the pitfalls of using an LLM to grade outputs?",
    kw: [
      "llm judge",
      "grader bias",
      "rubric",
      "calibration",
      "judge agreement",
    ],
    intent: "Checks critical use of model-based grading.",
    short:
      "Model graders are scalable and can handle nuance, which is why Anthropic's guidance lists LLM-based grading beside code-based and human grading. But they can be inconsistent, biased towards longer or more confident answers, miss factual errors and give different scores on reruns. Reduce the risks: write a specific rubric with clear scale definitions, ask for reasoning before the final score or a categorical verdict, grade one criterion at a time, and compare the judge with human labels on a sample, tracking agreement. Prefer code checks where possible, and keep a human spot-check going, because the judge itself needs evaluation.",
    detail: [
      "Avoid grading with the same model on its own output when independence matters.",
      "Randomise answer order in pairwise comparisons to reduce position bias.",
      "Re-calibrate when you change the judge or the rubric.",
    ],
    ex: "Comparing the judge's verdicts with 50 human-labelled answers before trusting it.",
    mistakes: [
      "Trusting judge scores without calibration.",
      "Vague rubrics like 'rate quality 1-10'.",
    ],
    follow: ["How do you check the judge is reliable?"],
    points: [
      "Scalable but imperfect",
      "Specific rubric, reasoning first",
      "Calibrate against humans",
      "Prefer code checks when possible",
    ],
    notes: ["Grade the grader."],
    src: [
      [
        "Anthropic docs: Define success criteria and build evaluations (grading)",
        EV,
      ],
      ["OpenAI docs: Working with evals", `${OAI}/evals`],
    ],
  }),
  q({
    slug: "ab-testing-prompts-and-models",
    topic: "AI application evaluation",
    d: "medium",
    title: "How do you A/B test a prompt or model change?",
    kw: [
      "a/b testing",
      "experiment",
      "canary rollout",
      "success metric",
      "feature flag",
    ],
    intent: "Checks safe, measured rollout.",
    short:
      "After a change passes offline evaluation, expose it to a fraction of real traffic and compare with the current version on pre-agreed metrics: task success, user ratings, escalation rate, latency and cost. Assign users, not requests, to a variant so each person has a consistent experience, use feature flags so you can roll back instantly, and run long enough to see differences beyond random noise, since LLM outputs vary. Start small (a canary), watch guardrail metrics such as errors and safety flags, and look at example outputs, not only numbers. OpenAI recommends pinning model snapshots and monitoring behaviour when you change prompts or upgrade models.",
    detail: [
      "Decide the success metric before the test starts.",
      "Segment results, since changes may help some inputs and hurt others.",
      "Keep both variants' prompts and parameters recorded.",
    ],
    ex: "5% of users get the new prompt; the team compares resolution rate and cost after two weeks.",
    mistakes: ["Switching everyone at once.", "Judging by a few anecdotes."],
    follow: ["Why assign variants per user?"],
    points: [
      "Small share of real traffic",
      "Pre-agreed metrics",
      "Feature-flag rollback",
      "Enough data to see past noise",
    ],
    notes: ["Measure the change on real users."],
    src: [
      [
        "OpenAI docs: Prompt engineering (pinning snapshots, evals)",
        `${OAI}/prompt-engineering`,
      ],
      [
        "OpenAI docs: Production best practices",
        `${OAI}/production-best-practices`,
      ],
    ],
  }),
  q({
    slug: "user-feedback-loops-for-ai",
    topic: "AI application evaluation",
    d: "medium",
    title: "How do you use user feedback to improve an AI feature?",
    kw: [
      "user feedback",
      "thumbs up down",
      "report issue",
      "feedback loop",
      "failure triage",
    ],
    intent: "Checks closing the loop from production to evaluation.",
    short:
      "Give users an easy way to rate answers and report problems, as OpenAI's safety guidance recommends, and monitor those reports with a human. Store feedback with the trace (input, retrieved context, output, prompt and model version) so you can reproduce the problem. Triage regularly: categorise failures (wrong retrieval, hallucination, formatting, policy), fix the underlying cause, and add each failure to the evaluation set so it cannot regress silently. Implicit signals such as rephrased questions, copy actions or abandoned sessions also help, with care for privacy. Explicit ratings are biased towards extremes, so combine them with sampled review.",
    detail: [
      "Acknowledge reports for safety issues quickly.",
      "Avoid training or evaluating on private user data without consent and a legal basis.",
      "Track the share of answers rated unhelpful over time.",
    ],
    ex: "A thumbs-down opens a review item linked to the full trace.",
    mistakes: [
      "Collecting feedback with no link to the trace.",
      "Never turning failures into test cases.",
    ],
    follow: ["What should be stored with a piece of feedback?"],
    points: [
      "Easy reporting",
      "Link to the full trace",
      "Triage by cause",
      "Add failures to the eval set",
    ],
    notes: ["Production teaches the test set."],
    src: [
      [
        "OpenAI docs: Safety best practices (allow users to report issues)",
        `${OAI}/safety-best-practices`,
      ],
      ["Anthropic docs: Define success criteria and build evaluations", EV],
    ],
  }),
  q({
    slug: "measuring-hallucination-rate",
    topic: "Hallucination & accuracy testing",
    d: "hard",
    title: "How do you measure and track hallucinations?",
    kw: [
      "hallucination rate",
      "faithfulness",
      "fact checking",
      "unsupported claims",
      "labelled review",
    ],
    intent: "Checks quantitative treatment of a fuzzy problem.",
    short:
      "Define what counts: a claim that contradicts the source, or one not supported by the provided context, or a fact that is false in the world. Build a test set of questions with known answers or with source documents, run the system, and have claims checked: automatically where possible (quotes must appear in the retrieved text, cited ids must exist, extracted values must match reference data), by a model-based grader with a rubric, and by humans on a sample. Report the share of answers with at least one unsupported claim, with confidence in the sample size, and break it down by question type.",
    detail: [
      "Include unanswerable questions to test whether the system admits it does not know.",
      "Compare versions on the same set.",
      "Rates differ widely by domain, so measure your own.",
    ],
    ex: "Counting answers where a required quote is missing from the retrieved context.",
    mistakes: [
      "Using one global number as the guarantee.",
      "No unanswerable questions in the test.",
    ],
    follow: ["Which checks can be automated?"],
    points: [
      "Define 'unsupported' precisely",
      "Automated plus model plus human checks",
      "Report rates by question type",
      "Include unanswerable cases",
    ],
    notes: ["Make hallucination a metric."],
    src: [
      ["Anthropic docs: Reduce hallucinations", HAL],
      ["OpenAI docs: Safety best practices", `${OAI}/safety-best-practices`],
    ],
  }),
  q({
    slug: "verifying-claims-with-quotes",
    topic: "Hallucination & accuracy testing",
    d: "hard",
    title: "How can you verify an answer's claims against its sources in code?",
    kw: [
      "quote verification",
      "citation check",
      "claim verification",
      "substring match",
      "fact-checking pipeline",
    ],
    intent: "Checks building practical verification steps.",
    short:
      "Ask the model to return structured output: each claim with the id of the source passage and a word-for-word supporting quote, following the pattern in Anthropic's hallucination guidance (extract quotes, ground claims on them, retract unsupported ones). Then verify in code: the source id must exist in the retrieved set, and the quote must appear in that passage after normalising whitespace. Reject or remove claims that fail, optionally ask the model to repair them, and show the verified citations to the user. For numeric or entity facts, compare against structured data.",
    detail: [
      "Fuzzy matching handles minor formatting differences.",
      "Log verification failures as a quality metric.",
      "Short quotes are easier to check than long paraphrases.",
    ],
    ex: "A claims list where any item whose quote is not found in its cited passage is dropped.",
    code: [
      [
        "Quote check",
        "python",
        `def verified(claim, passages):\n    text = passages.get(claim["source_id"])\n    return text is not None and claim["quote"] in text\n\nclaims = [c for c in claims if verified(c, passages)]`,
        ["The id must exist and the quote must appear in that passage."],
      ],
    ],
    mistakes: [
      "Trusting model-written citations.",
      "Accepting a quote without checking its source.",
    ],
    follow: ["What can this check not catch?"],
    points: [
      "Claims with source ids and quotes",
      "Check ids and substrings in code",
      "Drop or repair failures",
      "A real quote can still mislead",
    ],
    notes: ["Trust, then verify mechanically."],
    src: [
      ["Anthropic docs: Reduce hallucinations", HAL],
      ["OpenAI docs: Structured Outputs", `${OAI}/structured-outputs`],
    ],
  }),
  q({
    slug: "consistency-and-best-of-n",
    topic: "Hallucination & accuracy testing",
    d: "medium",
    title: "How can you detect unreliable answers by sampling several times?",
    kw: [
      "best-of-n",
      "self-consistency",
      "output variation",
      "majority vote",
      "uncertainty",
    ],
    intent: "Checks use of repeated sampling as a signal.",
    short:
      "Because generation is probabilistic, running the same prompt several times and comparing answers gives a signal. Anthropic's guidance describes best-of-N verification: if the outputs disagree on a fact, that inconsistency can indicate hallucination. For classification or extraction you can take a majority vote or flag low-agreement items for human review. The cost is several times the tokens and latency, so apply it selectively, for high-stakes or low-confidence cases, and run requests in parallel to limit delay. Agreement does not prove correctness, since a model can be consistently wrong, so pair it with grounding and validation.",
    detail: [
      "Use some randomness (non-zero temperature) so samples can differ.",
      "Compare normalised answers, not raw text.",
      "Route disagreements to a human or a stronger check.",
    ],
    ex: "Asking three times for an invoice total and flagging the document when the answers differ.",
    mistakes: [
      "Treating agreement as proof.",
      "Applying it to every request regardless of cost.",
    ],
    follow: ["What does disagreement tell you?"],
    points: [
      "Repeat the same prompt",
      "Disagreement signals risk",
      "Costs more tokens and time",
      "Agreement is not proof",
    ],
    notes: ["Ask more than once."],
    src: [
      ["Anthropic docs: Reduce hallucinations (best-of-N verification)", HAL],
      [
        "Anthropic docs: Increase output consistency",
        `${AN}/docs/test-and-evaluate/strengthen-guardrails/increase-consistency`,
      ],
    ],
  }),
  q({
    slug: "improving-output-consistency",
    topic: "Hallucination & accuracy testing",
    d: "medium",
    title: "How do you make LLM output more consistent?",
    kw: [
      "output consistency",
      "structured output",
      "examples",
      "constrained format",
      "low temperature",
    ],
    intent: "Checks techniques to reduce variation.",
    short:
      "Specify the format precisely and use schema-constrained structured output where the provider supports it, so fields and types do not vary. Give examples of the exact desired output, keep the instructions unambiguous, break complex tasks into smaller steps with a focused prompt each, and constrain free-text with enumerations. Lower temperature reduces randomness, but it does not make results fully deterministic. Validate every response in code and retry with the error on failure. Pin the model version, since upgrades change behaviour, and measure consistency by running the evaluation set repeatedly and checking the spread, not by looking at one run.",
    detail: [
      "A post-processing step can normalise formats such as dates.",
      "Fewer degrees of freedom in the prompt mean less variation.",
      "Anthropic documents a dedicated guide for increasing output consistency.",
    ],
    ex: "An extraction prompt returning a fixed JSON schema with enumerated categories.",
    mistakes: ["Relying on temperature 0 alone.", "Not validating outputs."],
    follow: ["How do you measure consistency?"],
    points: [
      "Precise format and schema",
      "Examples and enumerations",
      "Smaller focused steps",
      "Validate, pin versions, measure spread",
    ],
    notes: ["Constrain the output space."],
    src: [
      [
        "Anthropic docs: Increase output consistency",
        `${AN}/docs/test-and-evaluate/strengthen-guardrails/increase-consistency`,
      ],
      ["OpenAI docs: Structured Outputs", `${OAI}/structured-outputs`],
    ],
  }),
  q({
    slug: "testing-edge-cases-and-refusals",
    topic: "Hallucination & accuracy testing",
    d: "medium",
    title: "What edge cases should you test in an LLM feature?",
    kw: [
      "edge cases",
      "adversarial inputs",
      "empty input",
      "long input",
      "out of scope",
    ],
    intent: "Checks systematic test design.",
    short:
      "Beyond typical inputs, test: empty or very short input; very long input near the limits; typos, slang and other languages; ambiguous questions that need clarification; questions the sources cannot answer (the system should say so); contradictory documents; requests outside the feature's scope; sensitive or harmful requests that should be refused; attempts at prompt injection or leaking the system prompt; special characters and formatting that might break parsing; and tool failures or timeouts. For each, define the expected behaviour (answer, ask, refuse, escalate) and add it to the evaluation set. OpenAI recommends adversarial testing, trying to break your application with unusual and hostile inputs.",
    detail: [
      "Test both over-refusal and under-refusal.",
      "Repeat the tests after any prompt or model change.",
      "Review failures by category to find systematic weaknesses.",
    ],
    ex: "A question about a product the knowledge base does not cover, where the expected behaviour is 'not found'.",
    mistakes: [
      "Testing only happy paths.",
      "Checking refusals but not unnecessary refusals.",
    ],
    follow: ["What is the expected behaviour for an unanswerable question?"],
    points: [
      "Empty, long, noisy and multilingual input",
      "Unanswerable and out-of-scope",
      "Harmful and adversarial requests",
      "Define expected behaviour for each",
    ],
    notes: ["Break it before users do."],
    src: [
      [
        "OpenAI docs: Safety best practices (adversarial testing)",
        `${OAI}/safety-best-practices`,
      ],
      ["Anthropic docs: Mitigate jailbreaks and prompt injections", JB],
    ],
  }),
  q({
    slug: "architecture-of-an-llm-backed-service",
    topic: "Production AI integration",
    d: "medium",
    title: "How do you structure the backend of a production LLM feature?",
    kw: [
      "llm service architecture",
      "gateway",
      "abstraction layer",
      "orchestration",
      "separation of concerns",
    ],
    intent: "Checks sensible system design.",
    short:
      "Keep model access on the server behind your own service layer, so clients never see API keys and you can add authentication, per-user limits, validation and logging in one place. Wrap the provider SDK in a small internal interface (generate, embed, count tokens) so you can change models, add fallbacks and mock it in tests. Separate concerns: prompt construction, retrieval, the model call, output validation, and business actions are different modules, each tested on its own. Set timeouts, retries with backoff and budgets, handle errors with graceful fallbacks, and record traces. Run slow jobs asynchronously through a queue rather than inside web requests.",
    detail: [
      "Configuration (model name, parameters, prompts) should be changeable without redeploying code where appropriate.",
      "Apply the same observability as other services: logs, metrics, alerts.",
      "Use a staging environment with separate keys.",
    ],
    ex: "A `/ask` endpoint calling an internal `LLMClient` that adds retries, logging and usage metrics.",
    mistakes: [
      "Calling the provider from the browser.",
      "Scattering prompts and SDK calls through the codebase.",
    ],
    follow: ["Why wrap the provider SDK?"],
    points: [
      "Server-side access",
      "Internal interface over the SDK",
      "Separate prompt, retrieval, call, validation",
      "Timeouts, retries, tracing",
    ],
    notes: ["Treat the model as an unreliable dependency."],
    src: [
      [
        "OpenAI docs: Production best practices",
        `${OAI}/production-best-practices`,
      ],
      ["OpenAI docs: Error codes", `${OAI}/error-codes`],
    ],
  }),
  q({
    slug: "timeouts-fallbacks-circuit-breakers",
    topic: "Production AI integration",
    d: "medium",
    title:
      "How do timeouts, fallbacks and circuit breakers protect an AI feature?",
    kw: [
      "timeouts",
      "fallback response",
      "circuit breaker",
      "graceful degradation",
      "provider outage",
    ],
    intent: "Checks resilience patterns for a flaky dependency.",
    short:
      "Model calls can be slow or fail, so set explicit timeouts on every request, shorter than your own request deadline, and return something useful when they are exceeded. Fallbacks include a cached answer, a simpler or faster model, a rule-based response, a static message or a handoff to a human. A circuit breaker counts failures and, after a threshold, stops calling the failing service for a short period so you do not pile up slow requests, then tests recovery.",
    detail: [
      "Decide in advance what the user sees when the AI part is unavailable.",
      "Keep fallbacks tested, because they run rarely.",
      "Avoid retry storms by limiting total attempts.",
    ],
    ex: "On timeout, a search page shows classic keyword results instead of the AI-generated summary.",
    mistakes: ["No timeout, so requests hang.", "Retrying without limits."],
    follow: ["What does a circuit breaker do?"],
    points: [
      "Explicit timeouts",
      "Fallback to cache, rules or human",
      "Circuit breaker stops repeated failures",
      "Retry only retryable errors",
    ],
    notes: ["Fail gracefully."],
    src: [
      ["OpenAI docs: Rate limits (error mitigation)", `${OAI}/rate-limits`],
      ["Anthropic docs: Errors", `${AN}/api/errors`],
    ],
  }),
  q({
    slug: "multi-provider-fallback-and-portability",
    topic: "Production AI integration",
    d: "hard",
    title: "Should you design for multiple model providers or fallback models?",
    kw: [
      "provider fallback",
      "portability",
      "vendor lock-in",
      "model abstraction",
      "failover",
    ],
    intent: "Checks pragmatic multi-provider thinking.",
    short:
      "Relying on a single provider ties your availability to theirs, and a second model can serve as failover or for cost and capability reasons. But prompts, tool schemas, structured-output features, token limits and behaviour differ between providers, so a fallback is not a drop-in replacement: it needs its own prompt tuning and evaluation. A sensible approach: hide the provider behind an internal interface, keep prompts and schemas in versioned configuration, run your evaluation set against each candidate, and decide which features can safely fail over.",
    detail: [
      "Frameworks help with a common interface but do not remove behavioural differences.",
      "Data handling and compliance terms differ per provider.",
      "Test failover regularly, not only during incidents.",
    ],
    ex: "Failing over from the primary model to a secondary one for a classification task that was evaluated on both.",
    mistakes: [
      "Assuming prompts transfer unchanged.",
      "Never testing the failover path.",
    ],
    follow: ["What makes a fallback model not a drop-in replacement?"],
    points: [
      "Abstraction over the provider",
      "Evaluate each candidate",
      "Behaviour differs between models",
      "Add only where justified",
    ],
    notes: ["Portable interface, tested fallbacks."],
    src: [
      [
        "OpenAI docs: Prompt engineering (snapshots differ, build evals)",
        `${OAI}/prompt-engineering`,
      ],
      [
        "LangChain docs: Models",
        "https://docs.langchain.com/oss/python/langchain/models",
      ],
    ],
  }),
  q({
    slug: "async-jobs-and-queues-for-llm-work",
    topic: "Production AI integration",
    d: "medium",
    title: "When should LLM work run asynchronously through a queue?",
    kw: [
      "job queue",
      "background jobs",
      "asynchronous processing",
      "long running tasks",
      "webhooks",
    ],
    intent: "Checks matching processing mode to the task.",
    short:
      "Keep interactive requests (chat, autocomplete) synchronous or streamed, but move slow or bulk work to background jobs: summarising large documents, bulk classification, report generation, re-indexing, evaluation runs. The web request enqueues a job and returns an id; workers process jobs with rate limiting and retries; the client polls, uses a webhook or receives a notification when done. This avoids request timeouts, smooths traffic to respect rate limits, allows retries without user waiting, and lets you scale workers separately. For very large offline workloads, provider batch APIs process requests asynchronously. Make jobs idempotent and store status and results so reruns and failures are manageable.",
    detail: [
      "Show progress or status to the user.",
      "Use dead-letter queues for jobs that repeatedly fail.",
      "Track per-job cost and duration.",
    ],
    ex: "Uploading a 200-page PDF returns a job id; a worker summarises it and notifies the user.",
    mistakes: [
      "Holding an HTTP request open for minutes.",
      "Non-idempotent jobs that duplicate output on retry.",
    ],
    follow: ["How does the client learn the result?"],
    points: [
      "Interactive stays synchronous or streamed",
      "Slow or bulk work to workers",
      "Idempotent jobs with status",
      "Batch APIs for huge workloads",
    ],
    notes: ["Don't make users wait on long jobs."],
    src: [
      ["OpenAI docs: Batch API", `${OAI}/batch`],
      [
        "Anthropic docs: Batch processing",
        `${AN}/docs/build-with-claude/batch-processing`,
      ],
    ],
  }),
  q({
    slug: "logging-and-privacy-in-llm-apps",
    topic: "Production AI integration",
    d: "medium",
    title:
      "What should you log in an LLM application, and what must you protect?",
    kw: [
      "llm logging",
      "pii redaction",
      "data retention",
      "trace storage",
      "privacy",
    ],
    intent: "Checks the balance between observability and privacy.",
    short:
      "Log enough to debug and evaluate: request id, user or session id (pseudonymous), prompt template and version, model and parameters, retrieved document ids, token usage, latency, tool calls, stop reason, errors and validation results. Prompts and outputs often contain personal or confidential data, so decide deliberately whether to store full text: redact identifiers and secrets before logging, restrict access, encrypt, set retention limits and honour deletion requests. Do not log API keys. Sample full traces rather than keeping everything where volume or sensitivity is high. Know what the provider retains and how, and read their data-handling documentation when you choose an offering.",
    detail: [
      "Hashing user ids helps correlate without exposing identities.",
      "Provider safety identifiers should be hashed, not raw emails.",
      "Test redaction on realistic data.",
    ],
    ex: "Storing prompt template id and retrieved document ids but masking email addresses in the text.",
    mistakes: [
      "Logging full prompts with personal data forever.",
      "Logging secrets from request headers.",
    ],
    follow: ["How can you debug without storing sensitive text?"],
    points: [
      "Log ids, versions, usage, latency, errors",
      "Redact personal data and secrets",
      "Access control and retention",
      "Know provider data handling",
    ],
    notes: ["Observe, but minimise."],
    src: [
      [
        "OpenAI docs: Safety best practices (safety identifiers)",
        `${OAI}/safety-best-practices`,
      ],
      [
        "OpenAI docs: Production best practices (security and compliance)",
        `${OAI}/production-best-practices`,
      ],
    ],
  }),
  q({
    slug: "spend-limits-and-key-governance",
    topic: "Production AI integration",
    d: "easy",
    title:
      "How do you control spend and access for a production AI integration?",
    kw: [
      "spend limits",
      "usage alerts",
      "project keys",
      "staging projects",
      "budget governance",
    ],
    intent: "Checks operational governance.",
    short:
      "Use separate projects or keys for development, staging and production so a test cannot burn the production budget and a leaked key can be revoked on its own. Prefer service-account style keys owned by the application rather than a developer's personal key. Set spend alerts to be notified when usage grows and a hard limit as a monthly cap, remembering from OpenAI's guide that hard limits stop affected traffic when reached, so review them before enabling in production. Add per-user and per-feature limits in your own backend, monitor usage dashboards, and review who has access. Plan for what the product does when a limit is reached.",
    detail: [
      "Usage limits can rise as an account moves between tiers.",
      "Cap output length and input size per request.",
      "Alert on sudden spikes, which can mean abuse or a bug.",
    ],
    ex: "A staging project with a low spend limit and its own key.",
    mistakes: [
      "One shared key everywhere.",
      "Enabling a hard cap without planning the failure mode.",
    ],
    follow: ["What happens when a hard limit is reached?"],
    points: [
      "Separate projects and keys",
      "Alerts and caps",
      "App-level per-user limits",
      "Plan for limit exhaustion",
    ],
    notes: ["Budget like any cloud resource."],
    src: [
      [
        "OpenAI docs: Production best practices (billing limits, API keys, staging)",
        `${OAI}/production-best-practices`,
      ],
      ["Anthropic docs: Errors", `${AN}/api/errors`],
    ],
  }),
  q({
    slug: "latency-principles-for-llm-apps",
    topic: "Cost, latency & caching",
    d: "medium",
    title: "What are the main ways to reduce latency in an LLM application?",
    kw: [
      "latency optimization",
      "fewer output tokens",
      "parallelize",
      "streaming",
      "smaller model",
    ],
    intent: "Checks structured thinking about latency.",
    short:
      "OpenAI's latency guide groups techniques into seven principles: process tokens faster (smaller models are usually faster), generate fewer tokens, use fewer input tokens, make fewer requests, parallelise, make users wait less, and do not default to an LLM. The guide notes that generating output tokens is almost always the highest-latency step, so cutting output length (asking for concise answers, compact structured formats, max token limits) helps the most, while trimming input usually helps much less unless the context is huge. Run independent calls in parallel, stream output so users see progress, and replace model calls with code, caching or lookups where a model is not needed.",
    detail: [
      "Measure time to first token and total time separately.",
      "Merge sequential calls into one when you can.",
      "Test whether a smaller model meets your quality bar.",
    ],
    ex: "Replacing a verbose JSON format with short keys and a tighter output limit.",
    mistakes: [
      "Optimising input tokens first.",
      "Using an LLM for logic code can do.",
    ],
    follow: ["Which step usually dominates latency?"],
    points: [
      "Seven principles",
      "Output tokens dominate",
      "Parallelise and stream",
      "Don't use an LLM where code works",
    ],
    notes: ["Fewer tokens out, fewer calls."],
    src: [
      ["OpenAI docs: Latency optimization", `${OAI}/latency-optimization`],
      [
        "Anthropic docs: Reduce latency",
        `${AN}/docs/test-and-evaluate/reduce-latency`,
      ],
    ],
  }),
  q({
    slug: "prompt-caching-explained",
    topic: "Cost, latency & caching",
    d: "medium",
    title:
      "What is prompt caching, and how do you structure prompts to benefit from it?",
    kw: [
      "prompt caching",
      "shared prefix",
      "static content first",
      "cache hit",
      "cached input",
    ],
    intent: "Checks a key cost and latency feature.",
    short:
      "Prompt caching lets the provider reuse the work of processing a prompt prefix that repeated requests share, which can reduce both latency and the cost of input tokens. The cache matches on an identical prefix, so put the stable parts first (instructions, tool definitions, examples, large reference documents) and the changing parts last (the user's question, retrieved snippets). Any change early in the prompt invalidates the cached prefix after that point. Details differ by provider: OpenAI describes caching that is on by default for supported models, while Anthropic's caching is controlled with cache markers, and cache entries have limited lifetimes.",
    detail: [
      "Prefixes usually must exceed a minimum length to be cached.",
      "Keep tool lists and system prompts stable between calls.",
      "Caching does not change the model's output.",
    ],
    ex: "A support bot with a long, fixed policy prompt followed by the customer's question.",
    mistakes: [
      "Putting timestamps or user data at the start of the prompt.",
      "Not checking whether cache hits actually occur.",
    ],
    follow: ["Where should the dynamic content go?"],
    points: [
      "Reuses a shared prefix",
      "Static first, dynamic last",
      "Early changes break the cache",
      "Provider rules differ; check usage",
    ],
    notes: ["Stable prefix, variable tail."],
    src: [
      ["OpenAI docs: Prompt caching", `${OAI}/prompt-caching`],
      [
        "Anthropic docs: Prompt caching",
        `${AN}/docs/build-with-claude/prompt-caching`,
      ],
    ],
  }),
  q({
    slug: "response-caching-and-semantic-caching",
    topic: "Cost, latency & caching",
    d: "hard",
    title:
      "When does caching whole responses make sense, and what is a semantic cache?",
    kw: [
      "response cache",
      "semantic cache",
      "cache invalidation",
      "exact match cache",
      "privacy",
    ],
    intent: "Checks caching beyond provider features.",
    short:
      "If many users ask identical questions, store the final answer keyed by a normalised version of the request plus the prompt and model version, and return it without calling the model: zero model latency and cost. A semantic cache goes further, embedding the question and reusing the answer of a sufficiently similar earlier question, which raises hit rates but risks returning an answer to a subtly different question, so use a conservative similarity threshold and evaluate it. Cache only answers that are not user-specific or time-sensitive, include the user's permissions in the key where relevant, set expiry, invalidate on content changes, and avoid caching sensitive data.",
    detail: [
      "Do not cache personalised or private responses across users.",
      "Include the prompt and model version in the cache key.",
      "Provide a way to purge entries.",
    ],
    ex: "Caching answers to frequently repeated FAQ questions for an hour.",
    mistakes: [
      "Caching personalised answers in a shared cache.",
      "A loose similarity threshold returning wrong answers.",
    ],
    follow: ["What belongs in the cache key?"],
    points: [
      "Cache identical requests",
      "Semantic cache uses embedding similarity",
      "Conservative thresholds",
      "Expiry, invalidation and privacy",
    ],
    notes: ["Fast and free, if the answer is the same."],
    src: [
      ["OpenAI docs: Latency optimization", `${OAI}/latency-optimization`],
      ["OpenAI docs: Vector embeddings", `${OAI}/embeddings`],
    ],
  }),
  q({
    slug: "model-routing-and-right-sizing",
    topic: "Cost, latency & caching",
    d: "medium",
    title: "How do you choose the right model size for each task?",
    kw: [
      "model routing",
      "right sizing",
      "smaller models",
      "cascade",
      "cost latency quality",
    ],
    intent: "Checks cost-quality reasoning.",
    short:
      "Larger models are generally more capable across tasks but slower and more expensive; smaller ones are faster and cheaper and can be enough for well-defined tasks such as classification, extraction or routing, especially with good prompts, examples or fine-tuning, as OpenAI's latency guide notes. Anthropic's prompt engineering overview likewise points out that latency and cost can sometimes be improved more easily by choosing a different model than by editing prompts. Evaluate several models on your own test set and pick the smallest that meets your quality bar.",
    detail: [
      "Measure cost and latency per feature, not just quality.",
      "Routing adds complexity, so justify it with numbers.",
      "Keep model names in configuration.",
    ],
    ex: "A cheap model categorises tickets; only complex ones go to a larger model.",
    mistakes: [
      "Using the largest model everywhere.",
      "Choosing a model without testing.",
    ],
    follow: ["What signal can trigger escalation?"],
    points: [
      "Bigger = more capable but costlier",
      "Smallest model that passes evals",
      "Route or cascade by difficulty",
      "Re-evaluate periodically",
    ],
    notes: ["Right-size by evidence."],
    src: [
      [
        "OpenAI docs: Latency optimization (process tokens faster)",
        `${OAI}/latency-optimization`,
      ],
      [
        "Anthropic docs: Prompt engineering overview",
        `${AN}/docs/build-with-claude/prompt-engineering/overview`,
      ],
    ],
  }),
  q({
    slug: "reducing-calls-and-parallelism",
    topic: "Cost, latency & caching",
    d: "medium",
    title: "How do fewer calls and parallelism reduce latency and cost?",
    kw: [
      "fewer requests",
      "parallel calls",
      "merge steps",
      "batching",
      "speculative execution",
    ],
    intent: "Checks structural optimisations.",
    short:
      "Every model call has overhead and waiting time, so structure workflows to need fewer. Merge sequential steps into one prompt when they do not need intermediate checks, ask for several outputs in one structured response, and use plain code for steps that do not need a model. Where steps are independent, such as classifying ten documents or fetching several tool results, run them in parallel (within rate limits), as OpenAI's latency guidance recommends. For work that is not urgent, use batch APIs. Balance this against quality: a single overloaded prompt can be less reliable than a chain of focused ones, so compare variants on your evaluation set.",
    detail: [
      "Concurrency limits and rate limits cap how much parallelism helps.",
      "Speculative execution can start likely next steps early.",
      "Track the number of model calls per user request.",
    ],
    ex: "Extracting title, date and total from a document in one structured call instead of three.",
    mistakes: [
      "Making sequential calls that could run concurrently.",
      "Cramming everything in one prompt without testing quality.",
    ],
    follow: ["When is chaining still better?"],
    points: [
      "Merge steps where safe",
      "Parallelise independent calls",
      "Use code instead of calls",
      "Check quality after merging",
    ],
    notes: ["Do less, together."],
    src: [
      [
        "OpenAI docs: Latency optimization (make fewer requests, parallelize)",
        `${OAI}/latency-optimization`,
      ],
      ["OpenAI docs: Batch API", `${OAI}/batch`],
    ],
  }),
  q({
    slug: "cost-monitoring-and-budgets",
    topic: "Cost, latency & caching",
    d: "medium",
    title: "How do you monitor and control the cost of an AI feature?",
    kw: [
      "cost monitoring",
      "token budget",
      "usage dashboard",
      "per-user limits",
      "cost per request",
    ],
    intent: "Checks cost awareness without quoting prices.",
    short:
      "Cost follows tokens, so measure tokens per request and per feature from the usage fields in every response, and multiply by the current rates from the provider's pricing page (do not hard-code prices). Break it down by feature, customer and model, and chart cost per successful task, not only total spend. Levers: shorter prompts and outputs, caching, smaller models where quality allows, retrieval of only needed context, batch processing for non-urgent work, and limits per user. Add budgets and alerts, rate limits in your backend and caps on input and output size. Review the biggest cost drivers regularly, since prompt or traffic changes can multiply spend quickly.",
    detail: [
      "Long conversations resend the history each turn, so their cost grows.",
      "Retries and failed requests also consume tokens.",
      "Include evaluation and development usage in budgets.",
    ],
    ex: "A weekly report listing the five prompts with the highest total tokens.",
    mistakes: [
      "Tracking only the monthly invoice.",
      "Hard-coding prices in code.",
    ],
    follow: ["Why does a long conversation cost more per turn?"],
    points: [
      "Cost follows tokens",
      "Log usage per feature and user",
      "Levers: shorter, cached, smaller, batched",
      "Budgets and alerts",
    ],
    notes: ["What you can't measure, you can't cut."],
    src: [
      [
        "OpenAI docs: Production best practices (managing costs)",
        `${OAI}/production-best-practices`,
      ],
      [
        "Anthropic docs: Token counting",
        `${AN}/docs/build-with-claude/token-counting`,
      ],
    ],
  }),
  q({
    slug: "layered-guardrails-for-ai-apps",
    topic: "Safety & guardrails",
    d: "medium",
    title: "What does a layered guardrail design look like?",
    kw: [
      "guardrails",
      "input screening",
      "output filtering",
      "defense in depth",
      "policy enforcement",
    ],
    intent: "Checks defence in depth for AI safety.",
    short:
      "No single control is enough, so layer them. Input layer: authenticate users, limit input size, screen for abuse and injection attempts, and use validated fields instead of free text when possible. Prompt layer: clear system instructions that define scope and refusal behaviour. Model layer: use the provider's safety features and moderation. Output layer: validate format and content, filter personal data, secrets and harmful text, and check citations. Action layer: least-privilege tools, approval for risky actions, rate limits. Monitoring layer: logs, alerts, abuse detection and user reporting. Anthropic's guidance on jailbreaks and OpenAI's safety best practices describe such layered measures and recommend testing them adversarially.",
    detail: [
      "Fail closed for high-risk actions.",
      "Measure false positives, since over-blocking hurts usability.",
      "Re-test after prompt or model changes.",
    ],
    ex: "A bank assistant with input filters, scoped tools, output redaction and human approval for transfers.",
    mistakes: [
      "Relying only on the system prompt.",
      "Never measuring false positives.",
    ],
    follow: ["Why layers instead of one strong check?"],
    points: [
      "Input, prompt, model, output, action, monitoring",
      "Least privilege and approvals",
      "Test adversarially",
      "Measure over-blocking",
    ],
    notes: ["Defence in depth."],
    src: [
      ["Anthropic docs: Mitigate jailbreaks and prompt injections", JB],
      ["OpenAI docs: Safety best practices", `${OAI}/safety-best-practices`],
    ],
  }),
  q({
    slug: "using-a-moderation-api",
    topic: "Safety & guardrails",
    d: "medium",
    title: "How do you use a moderation API in an AI application?",
    kw: [
      "moderation api",
      "content moderation",
      "categories scores",
      "input and output moderation",
      "thresholds",
    ],
    intent: "Checks use of provider moderation tools.",
    short:
      "A moderation API classifies text (and in some cases images) against harm categories and returns flags and scores. OpenAI's moderation guide describes classifying standalone inputs and moderating generated content, and its safety guidance calls its Moderation API free to use. Apply it to user input before sending it to the model, and to model output before showing it, with your own thresholds per category and an action per result: block, warn, replace with a safe message or send to human review. Handle streaming carefully, since partial output may be shown before it is checked.",
    detail: [
      "Log moderation decisions for audit and tuning.",
      "Provide an appeal or report path for users.",
      "Categories and policies vary, so read the current documentation.",
    ],
    ex: "Screening a user's comment and the generated reply before posting both.",
    mistakes: [
      "Moderating only input or only output.",
      "Showing streamed text before checking it.",
    ],
    follow: ["Why is streaming a moderation risk?"],
    points: [
      "Classifies content by category",
      "Check input and output",
      "Own thresholds and actions",
      "Test error rates",
    ],
    notes: ["Check what goes in and what comes out."],
    src: [
      ["OpenAI docs: Moderation", `${OAI}/moderation`],
      [
        "OpenAI docs: Streaming API responses (moderation risk)",
        `${OAI}/streaming-responses`,
      ],
    ],
  }),
  q({
    slug: "jailbreaks-and-prompt-leaks",
    topic: "Safety & guardrails",
    d: "hard",
    title: "What are jailbreaks and prompt leaks, and how do you reduce them?",
    kw: [
      "jailbreak",
      "prompt leak",
      "system prompt extraction",
      "harmlessness screen",
      "input validation",
    ],
    intent: "Checks defensive practice against adversarial users.",
    short:
      "A jailbreak is an attempt to make the model ignore its rules and produce content it should refuse; a prompt leak is an attempt to make it reveal its hidden instructions. Anthropic's guidance suggests screening inputs with a lightweight check before the main call, hardening the system prompt, validating and filtering outputs, and handling untrusted tool content as data. Assume your system prompt can leak: never put secrets, credentials or sensitive business logic in it, and enforce permissions in code instead. Keep prompts free of anything that would be harmful if exposed, and monitor for suspicious patterns. Red-team regularly, since new attack styles keep appearing.",
    detail: [
      "Short, specific refusals are better than long explanations that help attackers.",
      "Rate-limit and block repeated abusers.",
      "Treat all of this as risk reduction, not elimination.",
    ],
    ex: "A pre-check classifies a request as an attempt to extract the system prompt and returns a standard refusal.",
    mistakes: [
      "Storing API keys or confidential rules in the system prompt.",
      "Believing 'do not reveal' makes secrets safe.",
    ],
    follow: ["What should never be placed in a system prompt?"],
    points: [
      "Jailbreak bypasses rules",
      "Leak exposes instructions",
      "Screen, harden, filter",
      "Assume the prompt is public",
    ],
    notes: ["No secrets in prompts."],
    src: [
      ["Anthropic docs: Mitigate jailbreaks and prompt injections", JB],
      [
        "Anthropic docs: Reduce prompt leak",
        `${AN}/docs/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak`,
      ],
    ],
  }),
  q({
    slug: "red-teaming-ai-applications",
    topic: "Safety & guardrails",
    d: "medium",
    title: "What is red-teaming for an AI application, and how do you run it?",
    kw: [
      "red teaming",
      "adversarial testing",
      "attack scenarios",
      "abuse cases",
      "security review",
    ],
    intent: "Checks proactive safety testing.",
    short:
      "Red-teaming means deliberately trying to break your application the way a hostile or careless user would. OpenAI recommends testing across a wide range of inputs and behaviours, including prompt injections such as 'ignore the previous instructions', to see whether the feature wanders off topic or can be redirected. Plan scenarios from your threat model: extracting hidden prompts, getting harmful or off-brand output, accessing other users' data, tricking tools into unauthorised actions, abusing costs, and hiding instructions in documents. Record each attempt and result, fix weaknesses, and convert successful attacks into regression tests. Involve people beyond the builders, and repeat after significant changes.",
    detail: [
      "Automated attack generation can supplement manual testing.",
      "Track the severity of findings and time to fix.",
      "Include tool and data-access paths, not just text responses.",
    ],
    ex: "A hidden instruction in an uploaded document that tells the assistant to email the user's data elsewhere.",
    mistakes: [
      "Testing only polite inputs.",
      "Not adding found attacks to the test suite.",
    ],
    follow: ["What do you do with successful attacks?"],
    points: [
      "Try to break your own app",
      "Scenarios from the threat model",
      "Cover tools and data access",
      "Turn findings into regression tests",
    ],
    notes: ["Attack it before someone else does."],
    src: [
      [
        "OpenAI docs: Safety best practices (adversarial testing)",
        `${OAI}/safety-best-practices`,
      ],
      ["Anthropic docs: Mitigate jailbreaks and prompt injections", JB],
    ],
  }),
  q({
    slug: "human-escalation-and-oversight-design",
    topic: "Safety & guardrails",
    d: "medium",
    title: "How do you design human oversight and escalation for an AI system?",
    kw: [
      "human oversight",
      "escalation",
      "review queue",
      "confidence threshold",
      "high-stakes decisions",
    ],
    intent: "Checks designing for human involvement.",
    short:
      "Decide where a person must be involved, by risk: reviewing outputs before use in high-stakes domains and for code (OpenAI's recommendation), approving irreversible or costly actions, and handling cases the system flags as uncertain, sensitive or out of scope. Triggers for escalation include low retrieval relevance, failed validation, disagreement across samples, safety flags, repeated user dissatisfaction and explicit requests for a human. Give reviewers the context they need, such as the source documents and the model's reasoning inputs, so they can verify quickly. Make handoff smooth, measure queue size and response times, and learn from reviewer corrections by adding them to the evaluation set.",
    detail: [
      "Do not let human review become a rubber stamp; sample and audit it.",
      "Tell users when they are talking to an AI and how to reach a person.",
      "Log decisions for accountability.",
    ],
    ex: "A claims assistant drafts decisions, but any denial is reviewed by an employee.",
    mistakes: [
      "Escalating everything, or nothing.",
      "Reviewers without the source context.",
    ],
    follow: ["Which signals should trigger escalation?"],
    points: [
      "Human involvement by risk",
      "Clear escalation triggers",
      "Context for reviewers",
      "Learn from corrections",
    ],
    notes: ["Know when a person decides."],
    src: [
      [
        "OpenAI docs: Safety best practices (human in the loop)",
        `${OAI}/safety-best-practices`,
      ],
      [
        "LangChain docs: Human-in-the-loop",
        "https://docs.langchain.com/oss/python/langchain/human-in-the-loop",
      ],
    ],
  }),
  q({
    slug: "personal-data-handling-in-ai-features",
    topic: "Safety & guardrails",
    d: "medium",
    title: "How do you handle personal and confidential data in AI features?",
    kw: [
      "pii",
      "data minimization",
      "redaction",
      "retention",
      "data protection",
    ],
    intent: "Checks privacy-aware design.",
    short:
      "Send the model only the data it needs: minimise fields, redact or pseudonymise identifiers such as names, emails and account numbers when the task does not require them, and never include secrets. Understand what your provider stores, for how long and whether data is used for training, and choose offerings and settings that match your obligations; the provider's data-handling documentation is the source of truth. Apply access control so a user's data is retrieved only for that user, filter personal data from outputs and logs, set retention and deletion processes, and follow the laws and policies that apply to your domain.",
    detail: [
      "Hash identifiers before sending them as safety identifiers.",
      "Embeddings of personal data are still personal data in many contexts.",
      "Include deletion in your vector index and caches.",
    ],
    ex: "Replacing customer names with placeholders before sending a ticket to the model, then restoring them in the reply.",
    mistakes: [
      "Sending full records when a few fields suffice.",
      "Forgetting caches and indexes during deletion.",
    ],
    follow: ["What should you check about the provider?"],
    points: [
      "Minimise and redact",
      "Know provider storage and use",
      "Access control per user",
      "Retention and deletion everywhere",
    ],
    notes: ["Send less, store less."],
    src: [
      [
        "OpenAI docs: Safety best practices (safety identifiers)",
        `${OAI}/safety-best-practices`,
      ],
      [
        "OpenAI docs: Production best practices (security and compliance)",
        `${OAI}/production-best-practices`,
      ],
    ],
  }),
])
