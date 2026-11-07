# Phase 8 — Study Zone lessons engine: design note

Status: **proposal, no code written.** The lesson schema and example were validated with Zod in a scratch run (they
parse; five negative cases are rejected). Files: [lesson-schema.ts.txt](phase-8/lesson-schema.ts.txt),
[example-lesson.ts.txt](phase-8/example-lesson.ts.txt).

## 0. Read this first

**Things in the brief that the code contradicts** (evidence in §1)

1. `roadmaps.ts` has **no phases**. A roadmap is a base role + relevance overrides + `domainOrder`. The 12/14/14 phase
   lists in the spec do not exist in code; they are new data (§2.4).
2. The catalogue already has `lessons: Lesson[]`, `assignmentIds`, `projectIds` on every module, all empty. I will fill
   `lessons` from the generated lesson index, so the three "Lessons: in preparation" views update with no UI change.
3. A topic's id is the slug of its **title** (`topic.<module>.<slug>`) and its minutes are the plan's unit of work. Lessons
   must attach to topics; that is the only way a plan block can open lessons.

**What I recommend that you may not expect**

- **Release rule by coverage, not a flat 6 lessons.** A module is releasable when every topic with minutes has at least one
  lesson, lesson minutes add up to about the topic's minutes (±25%), and there are at least 3 lessons. Reason: the
  smallest modules are `dev-tools` (3 topics, 165 min), `ui-libraries` (3, 225 min), `java-exceptions` (4, 165 min), so a flat 6
  forces padding; `javascript` (18 topics, 1135 min) needs about 18 to 25.
- **JavaScript runs in the browser; nothing else does** (§5). The sandbox was tested for real; the result is below.
- **SQL: no new dependency now.** Self-check only until you decide (question 3).
- **Topic completion by lessons writes the ordinary topic record** (with Undo), instead of a second "derived done" that the
  plan engine would not understand (§8).

**What I need from you**

| # | Question | My default if you do not answer |
|---|---|---|
| 1 | Approve the phase → module mapping (§2.4). I give Java in full, Python and MERN as lists. | Build exactly as written. |
| 2 | Catalogue gaps (§2.5): Python phase 11 "ML and AI fundamentals" has one thin module (`ai-fundamentals`, 4 topics, 255 min); phases 8 and 12/14 of each roadmap have no modules. Add modules/topics, or keep those phases project-led? | Project-led (phases may have no modules). |
| 3 | SQL exercises: add `sql.js` (SQLite compiled to WebAssembly, lazy-loaded; a dialect difference from PostgreSQL)? I have not measured its size here. | No. Self-check only. |
| 4 | Must passing a lesson's knowledge check be required to finish the lesson? | No. Finishing is the learner's choice; the check result is shown next to it. |
| 5 | Pass mark 70%, phase quiz 20 items, module quiz 10 items. | As stated, in one config file. |
| 6 | Tolerance between lesson minutes and topic minutes: ±25%. | As stated, in one config file. |
| 7 | "True/false with reasoning": I read it as the explanation is the reasoning, shown after answering. If you meant the learner must also pick the reason, say so. | Explanation shown after answering. |
| 8 | Lesson file naming `NN-<slug>.ts` (NN = order in the module). | As stated. |
| 9 | Export v7 with two new tables (§11). | As stated. |

---

## 1. Evidence from the code (what exists today)

| Fact | Where |
|---|---|
| Roadmaps: 3, each `{id, title, baseRole, overrides, domainOrder}`. No phase concept. | `src/data/catalog/roadmaps.ts` |
| Roadmap pools (default tiers): Java 63 modules / 398 topics / 428 h (core 35 modules, 250 h); Python 60 / 370 / 394 h (core 29, 197 h); MERN 56 / 351 / 379 h (core 26, 179 h). Union: 75 modules, 487 h. | computed from `defaultsForRoadmap` + `learningOrder` |
| Authoring size at about 45 min per lesson: Java 571 lessons (core 334), Python 525 (263), MERN 505 (238), union about 649. This is the workload, so the design must let the app ship usefully with partial content. | same |
| Module: `topicList` (title, minutes), `prerequisites`, `contentStatus`, and empty `lessons`, `assignmentIds`, `projectIds`. | `module-types.ts`, `modules/factory.ts` |
| Topic id = `topic.<module>.<slug(title)>`; a plan block is a topic, split into parts `-p<N>`; a block is done when its progress record is complete (`doneOn` from `completedAt`). | `services/planner/schedule.ts`, `features/planner/use-plan.ts` |
| Module completion today = 50% topics + 50% questions (all topics when the module has no questions); raw counts always shown. | `moduleCompletion` |
| Question schema parts reusable for lessons: `codeExampleSchema` (title, language, code, walkthrough), `diagramSchema` (flow, table), `sourceRefSchema`. Source allowlist: `data/questions/source-allowlist.ts`. Link check: `scripts/verify-links.ts`. | `types/content.ts` |
| Non-question progress ids are already safe: dashboards and the library only keep records whose id is in the question index. English (`en.*`) proves it. | `analytics/summary.ts`, `library/lists.ts` |
| Study nav today: Study home only (+ Linux, Settings), set-up routes `/start/study`, `/study/plan`. | `app/nav.ts`, `app/router.tsx` |

## 2. Data model

### 2.1 Ownership: lessons belong to modules

One pool, as you decided. `lesson.<module>.<slug>` is the id; a module shared by two roadmaps has one lesson set and one
progress. Roadmap **phases reference modules** (or a subset of a module's topics, §2.4); lessons never mention roadmaps.

### 2.2 Folders, loaders, index

```
src/data/lessons/<module>/<NN>-<slug>.ts     one lesson per file, `export default` a single AuthoredLesson via `defineLesson(moduleId, lesson)`
src/data/lessons/index.generated.ts          written by `pnpm lessons:index` (also run by dev and build), like questions/English
src/data/lessons/loaders.ts                  import.meta.glob("./*/*.ts") → lazy chunk per lesson; loadLesson(id), loadModuleLessons(moduleId)
src/data/lessons/author.ts                   defineLesson: Zod parse, fills id = lesson.<module>.<slug>, moduleId, order (from NN), item ids
src/data/catalog/lesson-status.ts            module → released | in-progress | planned (moved to "released" only if the gate passes, like content-status.ts)
src/config/study.ts                          PASS_MARK, quiz sizes, minutes tolerance, MIN_LESSONS, sandbox limits (one file)
```

The **index** (light, read by roadmap, library, plan, builder, landing counts without loading bodies):
`{ id, moduleId, slug, order, title, topic, topicId, minutes, overview, objectives (count), check: [{id, type}], assignment:
{checklistCount, minutes}, exercises: [{slug, language, runnable}], prerequisites, resourceCount }`. A freshness test fails when
the index is stale (as for English).

File name must be `NN-<slug>.ts` with the same slug as inside (gate). `NN` is the lesson order within the module.

### 2.3 Ids (all ordinary progress records unless noted)

| Thing | Id | Notes |
|---|---|---|
| lesson | `lesson.<module>.<slug>` | completed = finished; scheduled for spaced revision (1/3/7/14/30) like questions |
| assignment tick | `task.<module>.<slug>.<n>` | one record per checklist item, n from 1; assignment done = all ticked (derived) |
| exercise | `ex.<module>.<slug>.<exercise-slug>` | completion record only; checklist ticks and case results are per visit (§5.4) |
| project tick | `proj.<project>.<n>` | one per acceptance item, n across the whole project |
| knowledge-check item | `check.<module>.<slug>.<item-id>` | identity only (used in attempts); not a progress record |
| topic | `topic.<module>.<slug>` | unchanged |

Revision checkpoints reuse the existing revision data: completed lessons carry `nextReviewAt` and appear in the due list.
Required change (small): the revision count the plan shows (`revisionBlock`) and the Revise view must include due lessons;
today both look questions up in the question index.

### 2.4 Roadmap phases (new data, `src/data/catalog/phases.ts`)

```ts
type ModuleRef = string | { module: string; topics: readonly string[] }   // a module, or a subset of its topics
interface PhaseDef {
  roadmapId: string; number: number; title: string
  outcome: string              // "You can build and test a small Spring Boot service"
  modules: ModuleRef[]         // may be empty: a project-led phase
  projects: string[]           // project ids (mini, major) attached to the phase
}
```

Phase titles are exactly your lists (Java 12, Python 14, MERN 14). **Partition rule, enforced by a test:** every topic of every
core or recommended module of a roadmap's default pool belongs to exactly one phase; optional modules may be placed or left out
("Later"). Two phases may split one module by topic (MERN `javascript`: basics in phase 1, advanced in phase 2).

**Java (full proposal).**

| Phase | Title | Modules |
|---|---|---|
| 1 | Java fundamentals and advanced Java | computer-fundamentals, operating-systems, git, dev-tools, java-core, java-exceptions, java-multithreading, java-8-plus, jvm-memory |
| 2 | OOP, Collections, DSA and problem solving | java-oop, java-collections, dsa, debugging |
| 3 | SQL and PostgreSQL | sql, postgresql, database-design, mongodb (optional) |
| 4 | JDBC, Hibernate and JPA | jdbc, hibernate-jpa |
| 5 | Spring and Spring Boot | spring-framework, spring-boot, spring-mvc |
| 6 | REST, authentication and security | http, rest-apis, authentication, spring-security, web-security |
| 7 | React and TypeScript | html, css, javascript, typescript, react, react-hooks, react-router, state-management, tanstack-query, forms-validation, ui-libraries, frontend-performance |
| 8 | Full stack application development | backend-architecture, caching, payments (optional) — project-led |
| 9 | Testing and software architecture | testing, frontend-testing, agile, system-design, microservices |
| 10 | Docker, Linux, AWS and CI/CD | linux, linux-commands, ubuntu-admin, networking, docker, nginx, ci-cd, aws, deployment, logging |
| 11 | AI integration, LLM APIs, RAG and AI apps | ai-fundamentals, llm-apis, rag-agents, ai-production, python-fundamentals (optional), etl (optional) |
| 12 | Capstone and interview prep | none — major project; links into Interview Prep (HR, mock, resume) |

**Python.** 1 Python fundamentals: computer-fundamentals, operating-systems, git, dev-tools, python-fundamentals · 2 Advanced Python and
OOP: python-data-structures, python-oop, python-advanced, python-exceptions-files, python-async, debugging · 3 DSA: dsa · 4 SQL and
PostgreSQL: sql, postgresql, database-design · 5 Django and FastAPI: django, fastapi, backend-architecture · 6 REST and auth: http,
rest-apis, authentication, web-security, caching · 7 React and TypeScript: html, css, javascript, typescript, react, react-hooks,
react-router, state-management, tanstack-query, forms-validation, ui-libraries, frontend-performance · 8 Full stack apps: project-led ·
9 Testing and architecture: testing, frontend-testing, system-design, agile · 10 Docker, Linux, AWS, CI/CD: linux, linux-commands,
ubuntu-admin, networking, docker, nginx, ci-cd, aws, deployment, logging · 11 ML and AI fundamentals: ai-fundamentals, etl (optional) ·
12 LLMs, RAG, vector DBs, agents: llm-apis, rag-agents · 13 Production AI apps: ai-production · 14 Capstone and interview prep: none.

**MERN.** 1 HTML, CSS, JS: computer-fundamentals, operating-systems, git, dev-tools, html, css, javascript (topics: Data types, Functions,
Arrays, Data structures, ES6 syntax, DOM & events, Browser APIs, Type coercion, Error handling) · 2 Advanced JS and TypeScript:
javascript (Scope & hoisting, Closures, this, Objects & prototypes, Asynchronous JavaScript, Event loop, Modules, Memory & garbage
collection, Iterators & generators), typescript, debugging · 3 React ecosystem: react, react-hooks, react-router, state-management,
tanstack-query, forms-validation, ui-libraries, frontend-performance · 4 Node and Express: nodejs, express, http, rest-apis, networking ·
5 MongoDB and database architecture: mongodb, database-design, sql/postgresql (optional) · 6 Auth and security: authentication,
web-security, caching, payments (optional) · 7 Full stack architecture: backend-architecture, system-design · 8 DSA: dsa · 9 Testing and QA:
testing, frontend-testing, agile · 10 Docker, Linux, Nginx, deployment: linux, linux-commands, ubuntu-admin, docker, nginx, ci-cd, aws,
deployment, logging · 11 AI APIs and LLM integration: ai-fundamentals, llm-apis · 12 RAG, vector search, agents: rag-agents · 13 Production
AI apps: ai-production · 14 Capstone and interview prep: none.

Editing: phases are data. A learner who changes their syllabus (remove or defer modules) keeps the same phases; a phase shows
only the modules still selected, and its progress is derived from those.

### 2.5 Catalogue gaps this exposes (question 2)

- Python phase 11 "ML and AI fundamentals" maps to one module of 4 topics (255 min). The spec's phase is larger than that.
- Phases with no catalogue module: Java 8 and 12, Python 8 and 14, MERN 14 (the last also being "interview prep"). I treat them as
  project-led phases with a major project and cross-links to Interview Prep.
- `data-science` modules (statistics, deep-learning-nlp …) are not in any roadmap's default pool.

## 3. Lesson schema

The exact Zod schema is in [lesson-schema.ts.txt](phase-8/lesson-schema.ts.txt); the example is in
[example-lesson.ts.txt](phase-8/example-lesson.ts.txt). Summary:

```
lesson = { slug, title, topic (a Topic title of the module), minutes 10–90, overview, objectives 2–6,
           prerequisites[] (lesson ids or module ids),
           sections 3–14: explain | code (codeExample + walkthrough) | diagram (flow/table) | mistakes | practical,
           check 3–6 items: single | multi | truefalse | blank | output  (each with an explanation),
           assignment { title, task[], checklist 3–8, hints[], minutes },
           exercises 0–3 { slug, title, task[], language, starter, solution, hints[], checklist 2–6, run? (JavaScript only) },
           revisionNotes 2–8, resources 1–5 (official docs) }
refine: at least one explain, one mistakes and one practical section; unique check item ids
```

Design choices worth challenging:

- `answer`/`answers` are **indexes** into `options`; the app shuffles the display order. Duplicate options are rejected.
- Multi-select needs at least 2 correct and at least 1 wrong; scoring is all-or-nothing (no partial credit).
- `run` takes **JSON cases** (`entry`, `args`, `expected`), never authored code strings. Nothing the author writes is evaluated.
- `topic` is a title, not an id: the gate resolves it to `topic.<module>.<slug>`.
- Prerequisites may be a module id (the learner is told, never blocked): nothing in the Study Zone is locked.

## 4. Quizzes (honest and objective)

**Grading** is a pure function per type: single/output = selected index equals `answer`; multi = the selected set equals `answers`;
true/false = boolean equals `answer`; blank = trimmed, space-collapsed, case-folded (unless `caseSensitive`) equals `answer` or one of
`accepted`. Each result shows the correct answer and the item's `explanation`, whether right or wrong.

**Quizzes** (all assembled, never authored separately):

| Kind | Items from | Size |
|---|---|---|
| Lesson check | that lesson's `check` | all (3–6) |
| Module quiz | all lessons of the module | `MODULE_QUIZ_ITEMS` = 10 (fewer if the pool is smaller; says so) |
| Phase quiz | lessons of the phase's modules | `PHASE_QUIZ_ITEMS` = 20, drawn round-robin across lessons so no lesson dominates |

Seeded by attempt number, no repeats inside one quiz, options shuffled with the seed. A phase quiz opens when at least 60% of the
phase's released lessons are finished (a recommendation shown as text, not a lock) and needs a pool of at least 12 items.

**Attempts** are stored: `{ id, quizId, kind, scopeId, takenAt, seed, total, correct, passMark, passed, items: [{ itemId, correct }] }`.
History shows real attempts per quiz. Learner answers are not stored, only correctness. "Quizzes passed" = quizzes with at least one
passing attempt; the best attempt is shown. Retakes are unlimited.

**Wording.** Score: "percentage of items answered correctly." Pass: "at least 70% of items correct on this set." Nothing else is
claimed, and the forbidden-wording scan covers every quiz screen (no AI wording).

**Accessibility.** Each item is a `fieldset` with a legend, radio or checkbox groups, blank is a labelled input, results are announced
in an `aria-live="polite"` region and always carry text plus an icon.

## 5. Coding exercises: decision and sandbox analysis

### 5.1 Decision

- **JavaScript: runs in the browser** in an isolated sandbox, against the authored JSON cases, with a time limit and output cap.
- **TypeScript, Java, Python, SQL, shell: not executed.** Task, starter code, hints, a solution revealed on request, and a self-check
  checklist, labelled **"Not run by LastRev"**. (TypeScript would need the `typescript` package, roughly megabytes, for transpiling; I
  recommend not adding it.)
- The app never executes OS commands and never sends code anywhere.

### 5.2 Mechanism (tested, not assumed)

A **sandboxed iframe** (`sandbox="allow-scripts"` only, so an opaque origin) built from `srcdoc` whose first element is a CSP meta
`default-src 'none'; script-src 'unsafe-inline'; worker-src blob:; child-src blob:`, and inside it a **Worker created from a Blob**
that holds the learner's code and a tiny runner. The parent talks to the iframe with `postMessage`, accepts only messages whose
`event.source` is that iframe, and validates their shape.

I ran this in headless Chrome against a canary HTTP server, probing from inside the Worker:

| Probe | With sandbox + CSP | Same sandbox, CSP removed (control) |
|---|---|---|
| `fetch` to the canary | blocked | **reached the canary** |
| `XMLHttpRequest` | blocked | **reached the canary** |
| `WebSocket` | blocked | **reached the canary** |
| `importScripts` / dynamic `import()` of a URL | blocked | **reached the canary** |
| `sendBeacon` | not defined in workers | same |
| `localStorage`, `document`, `parent`, `top` | not defined | same |
| IndexedDB | access denied (opaque origin) | same |
| `while(true){}` | killed by `terminate()` after the limit; the page stayed responsive (3 ms) | same |
| Canary server total requests | **0** | 5 |

Conclusions. (1) The **CSP is the network boundary**; the opaque origin gives no storage and no parent access; the Worker gives a
hard kill. The three together hold in Chrome. (2) A nested `Worker` can still be created, but it inherits the CSP and dies with its
parent; I will delete `Worker` in the runner anyway. (3) **No memory cap** exists: a learner pasting `new Array(1e9)` can slow or
crash their own tab. Nothing is lost (progress is saved on every action); the limits are time, output size and run count. This is
stated in the UI help text.

**Not proven:** Firefox and Safari. CSP inheritance for Blob workers differs between engines. So the runner performs a **run-time self-test
before every session**, with no network traffic: inside the Worker it checks `typeof document === "undefined"`, that `location.origin`
is `"null"`, and that `fetch("data:text/plain,x")` is **rejected** (a `data:` URL is blocked by `connect-src 'none'`, so success
means the CSP is not enforced). If any check fails, the exercise falls back to self-check only with the message "This browser could
not isolate the runner, so code is not run here." Same behaviour if the iframe or Worker cannot be created.

**Recommendation: ship it** (JavaScript only) with the self-test, the limits in `config/study.ts` (2 s per case, 10 000 characters of
captured output, 50 console lines, 12 cases) and the stated limits. I would not ship it if the self-test could not be done offline,
and it can. If you prefer zero risk, the feature flag `RUN_JS=false` gives self-check everywhere.

### 5.3 What running does

For each case the Worker calls `entry(...args)` (sync or promise, awaited with the per-case limit), compares the JSON-serialised
result with `expected` (deep equality), and reports pass/fail per named case, the actual value on failure, and any captured
`console.log`. A runtime error shows its message and line. "N of M cases passed" is the only score.

### 5.4 Completion and honesty

An exercise is **done** when the learner marks it done: for runnable ones the button is enabled only after all cases pass in this
visit; for self-check ones after ticking every checklist item. The tick state is in memory for the visit; only the completion record
(`ex.…`) is stored. Reference solutions are revealed on request, and revealing is recorded in the note of the exercise record so a
learner can see "viewed solution" on the progress page (honest, not punitive).

### 5.5 SQL (question 3)

An in-browser engine needs a WebAssembly build of SQLite (sql.js is the usual one) or Postgres (PGlite), both new dependencies; sql.js
would also run **SQLite**, not PostgreSQL, so some syntax differs from the module being taught. Recommendation: do not add one now;
SQL exercises are self-check with a reference solution and a stated expected result set. Revisit after the first phases ship.

## 6. Projects, assignments, weekly milestones

**Assignments** are per lesson (task + checklist). **Exercises** are per lesson (§5). **Projects** are data in
`src/data/projects/<id>.ts`:

```ts
{ id, kind: "mini" | "major", title, summary, hours,
  roadmaps: [{ roadmapId, phase }],            // where it is offered
  buildsOn: string[],                           // lesson ids (gate: they exist)
  userStories: string[] (3–10), requirements: string[],
  structure: string[],                          // suggested folders/files, one per line
  steps: [{ title, summary, acceptance: string[] (2–6), afterLessons: string[] }]  (3–8),
  stretch: string[] (0–5), resources: sourceRef[] }
```

**Tracking** is checklist-based and self-marked: each acceptance item is a progress record `proj.<id>.<n>`; the project's percent is
ticked items over all items. A `projectStates` row per project holds the learner's notes, **a repository URL they paste** (https only,
shown as a plain link with `rel="noopener noreferrer"`, never fetched or validated over the network), the start date and
`updatedAt`. Projects with unwritten content are listed as "In preparation", never with placeholder text.

**Weekly milestones are derived** from the study plan, never stored. Weeks are calendar weeks (Monday to Sunday, the same as the
week strip). For a week, the plan's scheduled topic blocks give: the lessons of those topics; their assignments; the module quiz for
any module whose last block lands that week; the phase quiz when a phase's last module ends that week; and project steps whose
`afterLessons` are all scheduled by the end of the previous week. "Done" for each item comes from progress. A week where the plan
has no lessons (content not written) says "No lessons written for this week's topics yet" and lists the topics.

## 7. Progress: derivation and formula

Stored: lesson, task, exercise and project-tick records; topic records; quiz attempts; project states. **Derived, never stored:**
phase, roadmap, week and module progress, "next lesson", "quiz passed".

**Module completion.** Today it is 50% topics + 50% questions. The extension keeps that exactly when a module has no lessons, and uses
**equal weights across the components that exist** for the module, always shown with raw counts:

| Component | Counts | Exists when |
|---|---|---|
| Learning | topics done of total (topic done = ticked or all its lessons finished) | always |
| Practice | assignment ticks + exercises done, over total | the module has lessons with assignments |
| Quizzes | module quiz passed (1 or 0) plus lesson checks passed, over total | the module has check items |
| Questions | completed of available | the module has questions |

Examples: no lessons, no questions → learning. No lessons, questions → 50/50 (unchanged). Lessons and questions → four equal
quarters. The UI shows "Topics 3/7 · Lessons 5/12 · Assignments 4/12 · Exercises 2/6 · Checks passed 4/12 · Questions 10/25" first and
the blended percentage second, with the formula in the existing "How this is calculated" popover.

**Roadmap/phase progress** = the same formula over the phase's modules, weighted by module minutes, plus raw counts (lessons, quizzes
passed, projects ticked). A roadmap never shows a percentage without its counts.

## 8. Plan integration

- A plan block for a topic that has lessons shows "Open lessons (2 of 3 finished)" and opens the first unfinished lesson; the Today card
  links the same way. A block for a topic without lessons is unchanged.
- **Finishing the last lesson of a topic completes the topic's plan blocks** (the same action as ticking them, so streaks, `doneOn`
  and activity minutes behave as today) and shows a toast with **Undo**. Un-finishing a lesson never silently un-completes a topic.
  Reason: the plan engine reads topic records, and a second derived "done" would diverge from it. I will confirm how split topic
  parts (`-p1`, `-p2`) are recorded before wiring this.
- Time: finishing a lesson logs `lesson.minutes` as study activity once per lesson per day (the existing one-entry-per-item-per-day rule).
- Plan minutes remain the topic minutes. The gate keeps lesson minutes within ±25% of them so the two cannot drift apart.

## 9. Study navigation and screens

Sidebar (Study Path): **Study home · Roadmap · Lessons · Practice · Projects · Quizzes · Progress · Linux practice · Settings.** Mobile
tab bar: Home, Roadmap, Lessons, Practice, Switch (Projects, Quizzes, Progress and Settings are in the sidebar and linked from Home).

Routes (all under the existing `RequireMode mode="study"`):
`/study` · `/study/roadmap` · `/study/roadmap/:phase` · `/study/lessons` · `/study/lessons/:module` · `/study/lesson/:module/:lesson` ·
`/study/practice` · `/study/practice/:module/:lesson/:exercise` · `/study/projects` · `/study/projects/:id` · `/study/quizzes` ·
`/study/quiz/:kind/:id` · `/study/progress`. Existing `/study/plan` stays.

```
STUDY HOME (desktop)                                                 STUDY HOME (390 px)
┌ Study home ───────────────────────────────────────────┐            ┌─────────────────────────┐
│ Java Full Stack AI Engineer · Phase 1 of 12            │            │ Study home              │
│ ┌ Next lesson ───────────┐ ┌ Today ─────────────────┐ │            │ ┌ Next lesson ────────┐ │
│ │ Your first Java program│ │ ○ Basics        90 min │ │            │ │ Your first Java ... │ │
│ │ Core Java · 40 min     │ │   Open lessons (0 of 3)│ │            │ │ [Open lesson]       │ │
│ │ [Open lesson]          │ │ ○ Revision  4 due      │ │            │ └─────────────────────┘ │
│ └────────────────────────┘ └────────────────────────┘ │            │ ┌ Today ──────────────┐ │
│ ┌ This week ──────────────────────────────────────┐   │            │ │ ○ Basics 90 min     │ │
│ │ Lessons 0/3 · Assignments 0/3 · Quiz: Core Java │   │            │ │   Open lessons      │ │
│ │ Project step: Hello CLI                          │   │            │ └─────────────────────┘ │
│ └──────────────────────────────────────────────────┘   │            │ ┌ This week ──────────┐ │
│ Phase quiz: opens at 60% of phase lessons (2 of 9 now) │            │ │ ...                 │ │
└────────────────────────────────────────────────────────┘            │ ┌Home Road Less Prac Sw┐ │

ROADMAP (desktop)                                                    ROADMAP PHASE (390 px)
┌ Roadmap ───────────────────────────────────────────────┐            ┌─────────────────────────┐
│ ▸ 1 Java fundamentals and advanced Java    3/9 lessons  │            │ ▾ 1 Java fundamentals…  │
│   ▾ Core Java                    Topics 2/7 Lessons 3/9 │            │   Core Java  Lessons 3/9│
│        Basics ✓  Data types ○  Strings ○ …              │            │     Basics ✓ Strings ○  │
│   Prerequisites: none · Resources: 6 · Project: Hello   │            │   Quiz: not taken       │
│ ▸ 2 OOP, Collections, DSA …   In preparation (0 lessons)│            │ ▸ 2 OOP, Collections…   │
└────────────────────────────────────────────────────────┘            └─────────────────────────┘

LESSON (desktop)                                                     LESSON (390 px)
┌ Core Java › Basics · 40 min ──────────────── [Mark finished] ┐     ┌─────────────────────────┐
│ Overview · Objectives · Prerequisites (links)                 │     │ Your first Java program │
│ ┌ section nav ┐ Explanation · Code (steps) · Diagram ·       │     │ Overview, Objectives    │
│ │ 1 Source…   │ Mistakes · Practical                         │     │ [Sections ▾]            │
│ │ 2 Hello     │                                              │     │ section text            │
│ └─────────────┘ Knowledge check · Assignment · Exercises ·   │     │ code + step list        │
│                 Revision notes · Resources (official docs)   │     │ Check · Assignment …    │
│ Notes (autosaved) · Bookmark · Time on task                   │     │ [Mark finished]         │
└───────────────────────────────────────────────────────────────┘     └─────────────────────────┘

QUIZ                                       EXERCISE (JavaScript, runnable)           PROJECT
┌ Core Java quiz · 10 items ─┐             ┌ Print three lines ──────────────┐        ┌ Hello CLI · mini · ~4 h ┐
│ 3 of 10     ◯◯◉◯ options   │             │ Task │ Starter (editor)          │        │ 37% · 3 of 8 ticks      │
│ [Check]  ✓ Correct / ✗ …   │             │ [Run] Cases: 4 of 5 passed       │        │ Step 1 ☑ ☑ ☐            │
│ Result: 7 of 10 (70%) pass │             │ ✓ sum of two  ✗ empty (got 0)    │        │ Repo URL [__________]  │
│ History: 60% → 70%         │             │ Isolated sandbox: no network     │        │ Notes [_______]         │
└────────────────────────────┘             └──────────────────────────────────┘        └─────────────────────────┘
(Non-runnable exercise: task, starter, [Show solution], checklist, label "Not run by LastRev".)
```

Light mode and 390 px are checked for every screen. Hindi is not involved here. Code blocks wrap or scroll inside their own box
(never the page).

## 10. Content gate (what I build; you author)

Per lesson (run over all lesson files by `data/lessons/content-gate.test.ts`):

1. File name `NN-<slug>.ts`, slug matches, id unique, module exists in the catalogue, `topic` equals a topic title of that module.
2. Zod schema passes; `check` ids unique; single/output have exactly one correct answer; multi has at least 2 correct and 1 wrong; no duplicate options.
3. Every lesson has objectives, a knowledge check (3–6), an assignment (3–8 checklist items), revision notes, 1–5 resources.
4. Resources are on the source allowlist (official docs only, same list as questions); `pnpm lessons:verify-links` (the question link script extended) checks HTTP 200 by hand, never in unit tests.
5. Code examples are valid: non-empty, language present, walkthrough steps ≥1; Java/JS/TS/Python snippets must have balanced brackets and quotes (a cheap structural check; it does not compile them).
6. Runnable exercises: language is `javascript`; `entry` is declared in `starter` and in `solution`; the reference solution **passes every case in the sandbox in a test** (the one place the gate runs code, in a Worker under the test runner); at least 3 cases, deterministic JSON values.
7. Prerequisite ids resolve to real lessons or modules; no prerequisite cycles.
8. No frequency or statistic claims and no company or product-owner names (reuses `findFrequencyClaim`, `findStatisticClaim`, `findDeniedName`).
9. Lesson minutes: for each topic with lessons, sum within ±25% of the topic minutes; a topic with minutes but no lesson only blocks "released".
10. **Release:** a module may be `released` in `lesson-status.ts` only when every topic with minutes has at least one lesson, the minutes rule holds, and it has at least 3 lessons. `in-progress` is any module with at least one lesson.
11. No duplicate titles or duplicate check prompts across the pool.

Per project: ids, `buildsOn` resolve, 3–8 steps, 2–6 acceptance items each, hours positive, sources allowlisted, no forbidden wording.
Per phase data: the partition rule (§2.4); every module id and topic title exists; titles equal the specification (a test holds the spec titles).

## 11. Storage and export

- Dexie **v7** adds two tables: `quizAttempts` (`id, quizId, takenAt`) and `projectStates` (`id`). Everything else is ordinary progress
  records, already exported. Export **v7**; v1–v6 files import with none of the new data (tested, like v6). Reset clears both tables.
  Attempts are capped at 500 per quiz, oldest dropped.
- `config/study.ts` also carries the sandbox limits and the `RUN_JS` flag.

## 12. Tests and verification

Unit: schema (accepts the example, rejects each negative case), `defineLesson`, grading for all five types (including blank variants and
multi all-or-nothing), seeded quiz assembly (no repeats, round-robin, pool limits), attempts and "passed", phase partition rule,
module-completion formula (the three examples), weekly milestone derivation, topic completion by lessons (with Undo), progress ids,
export v7 round trip and v1–v6 imports, Dexie v6→v7 upgrade, the sandbox runner (isolation self-test, kill on `while(true){}`, output
cap, case results) in a Worker under the test runner, the gate itself (positive and negative fixtures), stale-index test.
UI: library, lesson, knowledge check (keyboard, aria-live), quiz flow and history, exercise page (runnable and self-check), projects
(ticks, percent, repository URL stays unfetched), roadmap view, study home, readiness/builder/module views showing real counts,
forbidden-wording scan on all new pages, source scan (the feature contains no `fetch`, XHR, beacon or socket call; the sandbox iframe is the only place code runs).
Browser (CDP): every screen at 1280 and 390, dark and light, light-mode contrast scan, sandbox isolation proved in the real app with
a canary request log, and a real lesson from your first batch rendered end to end.

## 13. Build order (slices; authoring can start after slice 1)

1. **Foundation**: types, `defineLesson`, loaders, index script, gate (+ fixtures), `config/study.ts`, phases data + partition test,
   catalogue overlay so "Lessons: N" is real everywhere. *You can author from here.*
2. Lessons library, lesson page, progress ids, knowledge check, quiz engine, attempts store (v7), revision of lessons.
3. Roadmap view, Study home, plan integration (open lessons, topic completion + Undo), module completion formula, Progress page, builder/module counts.
4. Assignments and exercises: self-check practice page, then the JavaScript sandbox runner.
5. Projects and weekly milestones.
6. Module and phase quizzes, Quizzes page.
7. Browser passes, docs, final report.

## 14. Risks

- **Authoring volume** (about 250–570 lessons per roadmap) is the real constraint. The design lets every screen work with any amount of content
  and says so honestly (counts, "In preparation").
- **Cross-browser sandbox behaviour**: mitigated by the run-time self-test and the `RUN_JS` flag; proven here in Chrome only.
- **Topic/lesson minute drift**: mitigated by the ±25% gate.
- **Plan engine coupling** (split topic parts): I will read the part-completion code before slice 3 and report if the Undo design does
  not fit.
