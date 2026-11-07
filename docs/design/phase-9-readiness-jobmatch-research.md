# Phase 9 — Readiness and analytics, job-description skill gap, research dataset, accessibility: design note

Status: **proposal, no Phase 9 code written.** (The two small adds that came first are done: `/study/revise` with a due badge, and Study header
search for projects and quizzes.) The research schema was validated with Zod in a scratch run (it parses the two examples and rejects nine bad
cases). Files: [research-schema.ts.txt](phase-9/research-schema.ts.txt), [research-example.ts.txt](phase-9/research-example.ts.txt).

## 0. Read this first

**What the code says that changes the brief**

1. A readiness model already exists (`services/analytics/readiness.ts`): 15 skill areas (`SkillArea`), one area per module (`module.skillArea`),
   score = 60% completion + 40% confidence, overall = plain mean of areas that have questions. It is questions only, and it does not know
   lessons, quizzes, assignments, mock results or Spoken English. The new categories are a many-to-many view, so they need their own mapping file;
   I recommend the existing dashboard card switches to the same service so the app never shows two different "overall" numbers (§A.3).
2. The 16 categories you listed do not match the 15 `SkillArea`s: there is no Authentication area (it is "Authentication & security"), no
   Technical interview preparation, no Spoken English; `data-science` (6 modules) and mobile modules (3) are in none of your 16.
3. **Confidence history does not exist.** A progress record keeps only the latest confidence. A "weak topics trend" cannot be drawn from what is
   stored without inventing data, so it needs weekly snapshots from now on (§A.5, question 3).
4. The skills table is real and sized as you said: 165 skills, 52 with aliases (64 aliases), each pointing at one module and one topic. Some names
   are ambiguous English words or very short (`Go`, `R`, `Spring`, `Express`, `JS`, `TS`, `JPA`, `S3`), so the matcher needs explicit rules for them (§B).
5. The lesson/question/project gates already ban frequency and statistic claims with regexes (`findFrequencyClaim`, `findStatisticClaim`); the
   research gate reuses them and adds the one you specified (numbers only where the evidence type and a URL allow them).

**What I recommend**

- **Add two categories:** *Data science* (6 modules) and *Mobile* (3), because otherwise their content is invisible to readiness. That makes 18.
  The ones you listed stay exactly as named. I do not see a reason for more.
- **One accessibility package: `axe-core`** (MPL-2.0, 4.14.0 is on the registry), not `vitest-axe`/`jest-axe`. It is the engine under all of
  them, and a bare `axe.run` is enough in jsdom. Its real value is that I can also inject `axe.min.js` into the **real Chrome** pass I already run,
  where colour contrast, layout and target checks work (jsdom cannot do them).
- **Export v8** carries target roles and the readiness snapshots; preferences gain a small `readinessExcluded` list.

**What I need from you** (defaults apply if you do not answer)

| # | Question | Default |
|---|---|---|
| 1 | Categories: your 16 plus *Data science* and *Mobile*? | Yes, 18 |
| 2 | "Technical interview preparation" and "HR preparation" definitions (§A.2): technical = project-questions + resume modules + mock-interview results; HR = the `hr-*` modules | As stated |
| 3 | Weekly snapshots of readiness, weak-topic count and average confidence (new `readinessSnapshots` table, export v8). The weak-topics trend shows nothing until three weeks of snapshots exist | Yes |
| 4 | The dashboard readiness card uses the same service as `/readiness` (one overall number) | Yes |
| 5 | The analytics window: the last 12 weeks | 12 weeks |
| 6 | Target roles keep the pasted text (so it can be re-run later) unless the learner unticks it; at most 20, 20 000 characters each | As stated |
| 7 | `/readiness`, `/job-match` in Interview Prep and Study Path; `/research` and "How we decide what to study" reachable from both journeys and from the landing footer | As in §E |
| 8 | Research file layout `src/data/research/<area>.ts`, a research host allowlist you extend (`data/research/hosts.ts`) for job-market sources | As stated |

---

## A. Job readiness and analytics

### A.1 The categories and the mapping (one data file)

`src/data/readiness/categories.ts`: `{ id, label, description, modules: string[], sources?: ... }`. Many-to-many: a module may be in several categories.
The UI reads only this file and the records; there are no numbers in the UI code. A test requires every catalogue module to be in at least one
category (or in an explicit `unmapped` list with a reason) and every id to exist.

| Category | Modules (proposed) | Other real data |
|---|---|---|
| Programming fundamentals | computer-fundamentals, operating-systems, debugging, dev-tools, agile, java-core, java-oop, java-collections, java-exceptions, java-multithreading, java-8-plus, jvm-memory, python-fundamentals, python-data-structures, python-oop, python-advanced, python-exceptions-files, python-concurrency, python-async, python-internals | |
| DSA | dsa | |
| Frontend | html, css, javascript, typescript, react, react-hooks, react-router, state-management, tanstack-query, forms-validation, ui-libraries, frontend-performance | |
| Backend | spring-framework, spring-boot, spring-mvc, microservices, backend-architecture, nodejs, express, caching, payments, django, fastapi | |
| Database | jdbc, hibernate-jpa, sql, postgresql, mongodb, database-design | |
| APIs | http, rest-apis | |
| Authentication | authentication, spring-security, web-security | |
| System design | system-design, backend-architecture, microservices | |
| Testing | testing, frontend-testing | |
| Deployment | docker, nginx, ci-cd, aws, deployment, logging, networking, android-release | |
| Linux | linux, linux-commands, ubuntu-admin | |
| Git | git | |
| AI integration | ai-fundamentals, llm-apis, rag-agents, ai-production | |
| Technical interview preparation | project-questions, resume-intro, resume-skills, resume-company, resume-project, resume-responsibility, resume-followup, resume-achievement, resume-difficult, resume-architecture, resume-scenario | **mock interviews** across every technical module (finished sessions only) |
| HR preparation | the 20 `hr-*` modules | HR answers saved (`hrAnswers`) |
| Spoken English | none (not a question module) | English lessons finished of ready, words learned, sentences practised, speaking ratings, challenge days done |
| *Data science* (added) | python-data-science, data-visualization, statistics, machine-learning, deep-learning-nlp, etl | |
| *Mobile* (added) | react-native, expo | |

### A.2 What each category shows (real data only)

Per category, with its raw counts always beside any percentage:

| Row | Source | Shown as |
|---|---|---|
| Questions | question index and progress (removed ones left out) | "12 of 40 questions done · average confidence 3.2" |
| Lessons | lesson index and `lesson.*` records | "5 of 9 lessons finished" |
| Quizzes | module quizzes and lesson checks passed | "2 of 5 checks passed · module quiz passed" |
| Assignments | `task.*` ticks of the mapped modules' lessons | "7 of 20 ticked" |
| Mock interviews | finished mock sessions, `scoreSession` module table (self-rated against the rubric) | "3 answered, average 62% of rubric points (your own ratings)" |
| Spoken English | `englishMetrics` | "46 lessons ready · 12 finished" |
| HR | `hrAnswers` | "9 answers saved" |

A row appears only when it has content to count. A category with none shows **"No content for this category yet"** in plain words, and is left out
of the overall mean. Nothing is estimated.

### A.3 Formula (extends the documented one; shown on the page)

- **Category score** = the plain average of the parts that exist: *Questions* (the existing 60% completion + 40% confidence score, unchanged),
  *Lessons* (finished / ready), *Quizzes* (checks passed + module quiz, as in module progress), *Assignments* (ticked / all), *Mock* (average rubric points).
  With only questions it equals today's score exactly (a test pins this).
- **Overall** = the plain mean over categories that (1) have content and (2) the learner selected. A category is **selected** when any module mapped to it is
  in the learner's syllabus (their roles or roadmap), or, for Spoken English, when they have started it; the learner can switch a category off or on
  (`preferences.readinessExcluded`).
- The wording on screen: "This measures coverage and your own confidence over the content that exists today. It is not a prediction of interview
  results or of being hired." (the existing sentence).
- The dashboard card and `/readiness` use one service, so there is one overall number. Existing tests that pin today's overall keep passing for a
  questions-only learner.

### A.4 Page layout

```
READINESS (desktop)                                               READINESS (390 px)
┌ Readiness ───────────────────────────────────────────┐          ┌─────────────────────────┐
│ Overall 41%  over 9 of 18 categories (those with     │          │ Overall 41%             │
│ content you selected)    [How this is made ▾]        │          │ 9 of 18 categories      │
│ ┌ Frontend ───────────────────── 58% ┐ ┌ Backend ─ 22% ┐        │ ┌ Frontend ───── 58% ─┐ │
│ │ Questions 12/40 · confidence 3.2    │ │ Questions ... │        │ │ Questions 12/40     │ │
│ │ Lessons 5/9 · Checks 2/5 · Tasks 7/20│ │              │        │ │ Lessons 5/9 ...     │ │
│ │ [Library] [Lessons]   include ☑     │ │               │        │ │ [Library] [Lessons] │ │
│ └─────────────────────────────────────┘ └──────────────┘        │ └─────────────────────┘ │
│ Not included: DSA, Linux … (no content / switched off)│          │ ▸ Not included (5)      │
│ ── Analytics ── weeks · activity · confidence · streaks│          └─────────────────────────┘
└──────────────────────────────────────────────────────┘
```

### A.5 Analytics views (drawn only when there is data; no sample data)

| View | Data | Notes |
|---|---|---|
| Study minutes by week (last 12) | `activity` minutes grouped by Monday week | Recharts bar chart plus an `sr-only` table (as the dashboard chart already does); empty weeks are zero bars only once there is any activity at all |
| Activity by type | `activity` grouped by `ActivityType`: items and minutes | horizontal bars plus table |
| Streak history | runs of consecutive activity days: current, longest, and the last 5 runs with their dates | list, not a chart |
| Confidence distribution | question progress, ratings 1–5 (and "not rated") | histogram plus table |
| Weak topics | now: topics with a flagged-difficult or confidence ≤ 2 question; **trend** from weekly snapshots, drawn from 3 snapshots on | a line needs history, so a snapshot (week, overall, weak-topic count, average confidence) is saved at most once a week on app open; no back-filling |

Each view has a heading, a one-line "how this is made", and an empty state that names what is missing ("No study time recorded yet").

## B. Job-description skill-gap tool (`/job-match`)

Local and transparent: **exact names and listed aliases only.** Nothing is sent anywhere (the source-scan test used for the resume feature covers it).

**Algorithm**

1. Input: pasted text or a `.txt` file read in the browser (`File.text()`), at most 50 000 characters.
2. Normalise: Unicode NFKC, collapse whitespace; keep the original for display.
3. Split into sentences (line breaks and `. ! ?` followed by a space and a capital; bullets count as sentences).
4. Terms: every skill title and alias from the skills table plus `data/jobmatch/aliases.ts` (extra names such as *Postgres*, *k8s*, *NodeJS*, *ReactJS*,
   *CI/CD*, written by hand, one place). A term matches only as a **whole name**: the character before and after must not be a letter or digit, and
   names with punctuation (`C++`, `Node.js`, `.NET`, `CI/CD`) are escaped literally.
5. **Ambiguous terms** are listed in the same data file with an explicit rule instead of a guess: *Go* only as `Golang` or when written exactly `Go` right
   next to a programming word (`Go developer`, `Go and Rust`); *R* only as `R language`/`R programming`; *Spring* only as `Spring Boot|Framework|MVC|Security|Data`;
   *Express* only as `Express.js|ExpressJS|Express framework`; *JS/TS* only upper-case. A term with no safe rule is not matched at all.
6. For each matched skill: the **sentence(s) it was found in** (up to two, with the matched words marked) and the number of mentions, so every match is
   checkable by eye.
7. Context per skill from real data: its module and topic; tier in the learner's roadmap or roles (core, recommended, optional, or "not in your path");
   whether it is in their syllabus; the "I know this" tick (`knownSkills`); lessons finished of ready; questions done of ready; quizzes passed; resume
   column if a resume profile exists (the same term table run over the resume skills).
8. **Gap list** = matched skills the learner has not ticked as known and whose module is not covered (no lesson finished and no question done), ordered by
   mentions then tier (core first). Each row links to the module's question library, its lessons, and **"Add to my syllabus"** (the same syllabus action
   the builder uses, with an Undo).
9. Soft-skill sentences (communication, stakeholders, teamwork, presentations, English) are matched against a short phrase list and point to the HR
   and Spoken English categories, with their own real coverage.
10. **Unrecognised terms**: words that look like technology names but are not in the table (capitalised mid-sentence words, CamelCase, words with digits
    or `.`/`+`/`#`, short capital runs), minus a stoplist of ordinary capitalised words. Shown as "We did not recognise these words: …" with the note that
    it may include ordinary words. They are never guessed at and never counted as a match.

**Worked examples** (all checkable in the page)

- "Build REST APIs in **Spring Boot** with **PostgreSQL** and **JPA**; CI/CD with **GitHub Actions**" → matches Spring Boot, PostgreSQL, JPA (skills with modules),
  CI/CD (module `ci-cd`); "GitHub Actions" matches only if it is in the table or the alias file, otherwise it appears under "not recognised".
- "We use Go for services" → matches only if `Go` sits next to a programming word by rule 5; "Go-getter attitude" is not a match.
- "Experience with Kafka and Terraform" → both unrecognised (not in the table): listed, not guessed.

**Limits (stated on the page):** it finds names, not meaning ("no experience with Kafka needed" still lists Kafka); it does not read PDFs or Word files;
it cannot know what a role really needs, only what the text mentions; the tier comes from the learner's own path.

**Target roles (export v8):** "Save as a target role" stores `{ id, name, savedAt, matched: [{skillId, mentions}], text? }` in a small local list
(`targetRoles`, at most 20), shown on `/job-match` with the gap recomputed against today's progress ("2 of 7 gaps closed since 3 Nov"). Deleting removes it.
No AI wording anywhere; a forbidden-wording scan covers the page.

```
JOB MATCH (desktop)
┌ Job match ───────────────────────────────────────────────────────────┐
│ Paste a job description or [Choose a .txt file]      [Find the skills]│
│ ┌ textarea ───────────────────────────────────────────────────────┐ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ Found 7 technologies in 12 sentences. Gaps: 3 · Covered: 4           │
│ Skill        Mentions  In your path  Lessons  Questions  Known  Resume│
│ Spring Boot  3 "…"     core          2/9      12/20      ✓      ✓     │
│ PostgreSQL   2 "…"     core          0/0      0/0               ✓     │
│ ...                                                                    │
│ Gaps (3):  PostgreSQL  [Library] [Lessons] [Add to my syllabus]       │
│ We did not recognise these words: Kafka, Terraform (may include       │
│ ordinary words)                                  [Save as target role] │
└──────────────────────────────────────────────────────────────────────┘
```

## C. Research dataset (`/research`)

**Schema** is in [research-schema.ts.txt](phase-9/research-schema.ts.txt) (validated). Summary:

`{ id, topic, area (readiness category id), level (fresher|intermediate|advanced|all), claim (plain words), evidence: { type, sources[{title, publisher, url, publishedOn?}], basis? },
researchedOn, confidence (high|medium|low), horizon (2026|2027), predicted }`.

The four evidence types are exactly yours: `official-documentation`, `reported-experiences`, `job-market-trend`, `preparation-recommendation`
(labelled "Informed preparation recommendation (a prediction)").

**Zod rules (cannot be authored around):**

- `predicted` ⇔ type is `preparation-recommendation`. A prediction typed as anything else is rejected, and an observation flagged as a prediction is rejected.
- `horizon: 2027` ⇒ `predicted: true` (a 2027 entry can never be typed as observed).
- A prediction cannot have `confidence: "high"`.
- Official documentation and job-market trend need at least 1 source with an https URL; reported experiences need at least 2; a recommendation needs a plain-words `basis` and must not pretend to have sources.
- A source cannot be published after the research date.

**Gate (`services/research/gate.ts`, run by `data/research/content-gate.test.ts`):**

- every `area` is a real category; ids unique; `defineResearch` entries live in the file named after their area;
- sources: https, host on `data/research/hosts.ts` (official-documentation hosts reuse the questions allowlist; job-market and experience hosts are listed by you, one line each);
- **statistics**: a number that reads as a statistic (a percentage, "N out of M", "N%", "most/majority of …", a counted population) may appear only in an entry typed
  `job-market-trend` or `official-documentation` that carries at least one source with a URL; otherwise the entry is rejected;
- **no company-specific interview questions**: the claim and topic are checked against the brand list and against the pattern "asked at/by <Name>";
- no frequency claims (`findFrequencyClaim`), dates plausible (2024-01-01 to 2027-12-31, no test depends on the day it runs);
- the link check script covers every research URL (`pnpm content:verify-links`).

**Page:** filters (area, level, evidence type, horizon), cards with the claim, evidence type, sources, dates and confidence; a **"Prediction, not verified"** label on every predicted
entry wherever it appears (cards, bibliography, search results, the readiness page if it ever cites one); a bibliography view (unique sources by URL, with how many entries cite each,
publisher and publication date); and a plain "How this was made, and its limits" panel: editorial, sources read by the author on the date shown, no frequency or hiring data, predictions are forecasts.
The page shows "No research entries yet" until the file exists.

**"How we decide what to study"** is a static explanation reachable from the Interview Zone (and Study): questions and lessons are written by hand from official documentation,
the gate rejects frequency claims, there is no data on what interviewers ask most, and what that means for how to use the app. It cites the actual gate rules.

```
RESEARCH (desktop)
┌ Research ────────────────────────────────────────────────────┐
│ Area [All ▾] Level [All ▾] Evidence [All ▾] Horizon [All ▾]  │
│  [Entries] [Bibliography]                                    │
│ ┌ State in React function components ─ Official documentation ┐│
│ │ claim… · Frontend · Fresher · confidence: high · 2026       ││
│ │ Source: useState, React (react.dev) · researched 5 Nov 2026 ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌ ⚠ Prediction, not verified ─ 2027 ─────────────────────────┐│
│ │ claim… · basis: … · confidence: low                         ││
│ └─────────────────────────────────────────────────────────────┘│
│ How this was made, and its limits ▾                           │
└──────────────────────────────────────────────────────────────┘
```

## D. Storage, nav and routes

- **Export v8** adds `targetRoles` and `readinessSnapshots` (two small tables); preferences gain `readinessExcluded`. v1 to v7 files import with none (tested, as for v7).
- Routes: `/readiness` and `/job-match` need a learner with a profile (Interview Prep or Study); `/research` and `/study-method` are static and open to all journeys.
- Nav: Interview Prep: *Readiness*, *Job match* in the Dashboard group, *Research* under Library; Study Path: *Readiness*, *Job match* under Track, *Research*. Mobile bars are unchanged (these are sidebar items).
  The landing footer links to Research and "How we decide what to study".

## E. Accessibility audit (plan)

**Package: `axe-core` only** (dev dependency).

1. **jsdom tests** (`src/test/a11y.ts`): `expectNoViolations(container)` runs axe with contrast and layout rules off (jsdom cannot compute them) on every page's rendered state:
   landing, dashboards, library, question, HR, mock, resume, linux, English, every Study page, readiness, job match, research, settings, dialogs open.
2. **Real Chrome** (the CDP harness I already use): inject `node_modules/axe-core/axe.min.js` and run on every page, dark and light, at 1280 and 390, with contrast on.
3. **Manual checklist, scripted where it can be:**
   - keyboard-only walk of the main journeys (landing → set-up → dashboard → a question → a quiz → a mock session → Study lesson → English lesson), recording the focus order and checking a visible focus indicator on each stop;
   - landmarks and headings: one `h1` per page, no skipped levels, `main`/`nav`/`header` present once;
   - form labels and errors: every control labelled, errors announced (`role=alert`/`aria-describedby`);
   - reduced motion: emulate `prefers-reduced-motion: reduce`, assert no running animations or autoplay;
   - 200% zoom and 320 px reflow: no horizontal scroll, no clipped content;
   - colour not alone: each status has text or an icon with a name (checked per feature);
   - icon-button names (axe `button-name` plus a scan of `button` with no text);
   - `lang` attributes: `html lang`, Hindi `lang="hi"`, English in Hindi pages `lang="en-IN"`.
4. Fix what is found; report as a list with before and after counts per rule and per page, and keep the axe tests as a regression gate.

## F. Tests

Mapping (every module mapped, ids exist, questions-only equals today's score), formula and "no content" states, selection and exclusion, snapshots (once a week, no back-fill),
analytics selectors, the matcher (every rule, ambiguous terms, sentences, unrecognised words, limits, `.txt` import, size cap), gap list and "Add to my syllabus" with Undo, target roles
(save, recompute, delete, v8 round trip, v1 to v7 import), source scan (no network in the new features), research schema (all nine cases), gate (statistics, brands, hosts, files, dates), page
filters and the prediction label everywhere, forbidden-wording scans, axe in jsdom and in Chrome, light mode and 390 px for every new page.

## G. Build order

1. **Research schema, `defineResearch`, hosts file, gate, loader** (you can author from here), then the `/research` page, bibliography and "How we decide what to study".
2. Category mapping, readiness service, `/readiness` page, dashboard card on the same service.
3. Analytics views and weekly snapshots.
4. Job-match matcher, page, target roles (export v8).
5. Accessibility: add `axe-core`, jsdom helper, Chrome passes, fixes, report.
6. Final browser passes, docs, report.

## H. Risks

- **Matcher false positives and misses** (ambiguous names, unknown tools): mitigated by whole-name rules, per-term ambiguity rules, always showing the sentence, and listing unrecognised words instead of guessing.
- **Two overall numbers**: avoided by using one service for the dashboard and `/readiness`.
- **A11y fixes touching many files**: each fix gets a regression test; the report lists them.
- **Research content is yours to verify**: the gate checks form, hosts and number rules, not truth; every entry shows its sources and dates so a reader can check.
