# LastRev — Architecture

Local-first, frontend-only career-preparation platform. React 19 · Vite · TypeScript ·
Tailwind v4 · shadcn/ui (Radix, preset `blADw6h04` → `radix-mira`, RTL-aware) · React Router ·
Zustand · TanStack Query · React Hook Form + Zod · Dexie (IndexedDB) · Recharts.

## Principles

1. **One content pool, many views.** Questions belong to a *module* (`react`, `sql` …). Roles
   (`src/data/catalog/roles.ts`) are ordered lists of module ids. Nothing is duplicated per role, and a
   learner has exactly one progress record per question — so Interview, Study, Dashboard and
   Bookmarks always agree.
2. **Content scales by code-splitting.** `src/data/questions/<module>/<level>.ts` files are discovered
   with `import.meta.glob` and each becomes a lazy chunk. A generated index
   (`index.generated.ts`, via `pnpm content:index`) carries only id/title/topic/difficulty/keywords for
   counts, lists and global search. A test fails if the index is stale.
3. **Schemas are the source of truth.** Zod schemas in `src/types` define content and learner data;
   TypeScript types are inferred. The same schemas validate seed content (at load and in tests) and
   imported backups (at runtime).
4. **Repository boundary.** UI → Zustand store → `LearnerRepository` interface → Dexie implementation.
   Swapping IndexedDB for a server means one new repository; no UI changes. Every record carries
   `updatedAt` for future last-write-wins sync.
5. **Pure, tested logic.** Streaks, spaced repetition, readiness, plan estimates, search/filter and the
   dashboard summary are pure functions with unit tests. No hidden numbers.
6. **No dead navigation.** `src/app/nav.ts` is the registry; a feature appears in the sidebar only when
   its route exists and works. Modules with no questions are shown as "In preparation" and are not linked.
7. **Honesty over polish.** Readiness is documented as coverage + self-rated confidence, not a hiring
   probability. Local data is clearly stated as per-browser. Content counts are never padded.

## Layout

```
src/
  app/            router, providers, bootstrap/guards, layouts, nav registry
  components/
    ui/           shadcn components (generated; edit only with a technical reason)
    shared/       RichText, CodeBlock, badges, empty/error/not-found, stat tiles
    navigation/   sidebar, header, mobile tab bar, ⌘K palette, theme toggle
  features/       onboarding · dashboard · interview · library · settings · progress
  data/
    catalog/      modules.ts, roles.ts
    questions/    <module>/<level>.ts, author.ts, loaders.ts, index.generated.ts
  services/
    analytics/    streak, readiness, summary
    revision/     spaced repetition
    planner/      plan estimate, target dates
    content/      search/filter/sort, content service
    storage/      repository, dexie-repository, import-export
  stores/         learner-store (write-through to repository)
  types/          content.ts, learner.ts (Zod schemas)
scripts/          generate-content-index.ts
```

## Journeys and routes

The app has two journeys that share one profile, one progress store and one IndexedDB. A learner can use either
or both; nothing is duplicated and nothing is lost when switching.

| Route | What it is |
|---|---|
| `/` | Landing. New learners see the two choices. On the first entry after a page load, a returning learner is redirected (`replace`) to their journey: `preferences.lastMode` if that journey is set up, otherwise the only one that is. Later visits show the choices, so browser Back never bounces forward (`features/landing/resume.ts`, a non-persisted flag). |
| `/choose` | The same landing, never redirects. "Switch mode" in the sidebar and mobile bar leads here. |
| `/start/interview` | Interview Prep set-up (roles → experience → skills → pace → review), then `/dashboard`. Set-up learners are redirected to `/dashboard`. |
| `/start/study` | Study Path set-up (roadmap → experience → pace), then `/study`. Set-up learners are redirected to `/study`. |
| `/dashboard`, `/interview/*`, `/library/*` | Interview Prep, behind `RequireMode mode="interview"` (needs `profile.onboardedAt`). |
| `/library`, `/library/saved`, `/library/difficult`, `/library/revision`, `/library/notes` | The sidebar's Library group, one reusable list page (`features/library`: search, module filter, inline un-save/un-flag). Counts come from the same selectors as the lists (`selectLibrary`) and exclude `removed` questions. Below `md` the page shows a "Show" select instead of the hidden sidebar. `/bookmarks` redirects (replace) to `/library/saved`. |
| `/study`, `/linux/*` | Study Path, behind `RequireMode mode="study"` (needs `profile.studyOnboardedAt`). |
| `/onboarding`, `/study/plan` | Edit the interview plan / the study plan. Progress is never touched. |
| `/interview/manage` | Manage my prep: remove and restore modules and questions, write your own questions. |
| `/settings` | Shared; available once either journey is set up. Shows the plan of the active journey. |
| `/settings/syllabus` | Edit the syllabus, known skills and skill coverage of the active journey (same builder as the review steps). |

State added for this: `preferences.lastMode` (nullable), `profile.studyRoadmap`, `profile.studyOnboardedAt`. All have
Zod defaults, and `hydrate` re-parses the stored profile, so data and exports from before modes existed still load.
`profile.onboardedAt` keeps its old meaning: Interview Prep set-up is done. Display name, experience and daily hours are shared by both journeys, so changing them in one changes them in the other; roles, skills and interview date belong to Interview Prep only.

Navigation is per journey (`src/app/nav.ts`: `NAV_BY_MODE`) and derived from the URL (`modeOfPath`); shared pages use
`lastMode`. The sidebar, mobile bar and ⌘K palette read the same source, and the palette searches interview questions
only in Interview Prep. Entering a journey's pages writes `lastMode` (`AppLayout`). A nav item can carry a `count` source (rendered as a live badge by the sidebar) and a `mobileTitle`/`mobileMatch` so one compact tab can stand for a section (Library). Study Path roadmaps
(`src/data/catalog/roadmaps.ts`) are ordered views over the shared module pool, like roles. Their lessons are not
written, so Study home shows only the roadmap, its module order with the catalogue's hour estimates, and the learner's
pace; every module is marked "In preparation" and none is linked.

## Curriculum (modules, roles, syllabus)

One module pool (`src/data/catalog/modules/<domain>.ts`, 83 modules), one module per technology. Domains (`foundation`,
`frontend`, `java-backend`, `mern-backend`, `python`, `database`, `mobile`, `devops`, `ai`, `data-science`, `career`) are views:
a module has one `domainId` and may appear under others via `alsoIn`. Existing module ids and question ids are unchanged.

- **Topics own the time.** Each module's `topicList` is `{title, minutes, group?}`; `topics` and `estimatedStudyHours` are derived.
  Module minutes = sum(topic minutes) x (1 + 0.25 practice/revision) x an experience multiplier. Every number lives in
  `src/data/curriculum/time-model.ts` and the UI calls them planning estimates. A learner can replace a module's minutes.
- **Roles and roadmaps carry no module lists.** `src/data/curriculum/role-relevance.ts` holds one row per module and one letter per
  role (C core, R recommended, O optional). Several roles: the strongest tier wins and core for any role means mandatory.
  Roadmaps are a base role's column plus overrides (`data/catalog/roadmaps.ts`) and never include interview-only modules.
- **The syllabus is defaults plus deviations.** `profile.syllabusOverrides` (Interview Prep) and `profile.studySyllabusOverrides` (Study Path)
  store only what the learner changed: `{selected?, priority?, customizedMinutes?}`. Core modules cannot be deselected. "Prepare core first"
  sets `priority: "low"` ("Later") on selected non-core modules; nothing is removed, and Restore clears the priorities.
  `services/curriculum/` holds the pure, tested logic (relevance, syllabus, time, summary, feasibility, progress, coverage, filters, skill migration).
- **Nothing is invented.** Lessons, assignments and projects are optional arrays on a module and are empty today, so the UI says
  "in preparation". Interview questions shown are the real counts from the generated index, next to the 25/50/75 targets.
- **Shared progress.** Progress is per question; a module's completion is derived from it, so a module shared by several roles has one record.
- **Readiness behaviour change.** Readiness, "continue learning" and weak topics are scoped to the learner's effective selected syllabus
  (core + recommended + their choices), not to every module a role could browse, so optional modules they did not choose no longer dilute it.
  The Interview Zone still lists every relevant module (core, recommended, optional), tier-ordered with a badge.
- **Skills.** `src/data/curriculum/skills.ts` is the one table of technologies (id, title, group, module, topic). The step 3 picker, the
  "You know this" badges and the Skill coverage audit (`resume-skills.ts`) all read it. `profile.knownSkills` holds skill ids; older saved
  display names are migrated on load and import, unrecognised text is kept. Known skills only mark and hint; they never change hours.
  Backlog idea: a per-module "revision only" toggle with its own documented multiplier (not built).
- **Builder.** `src/features/curriculum/` (`CurriculumBuilder`, `CategoryAccordion`, `ModuleRow`, `ModuleDetail`, `SummaryBar`, `FeasibilityPanel`,
  `ModuleFilters`, `SkillPicker`, `SkillCoveragePanel`) is used by the Interview and Study review steps and by Settings
  (`/settings/syllabus`). Display name, experience and daily hours are shared by both journeys, as before.

### Hours: old estimate versus derived (fresher baseline)

The old hand-typed figure and the figure now derived from per-topic minutes. Topic minutes were written for honest effort per topic,
and these totals were only used afterwards as a sanity check. Large changes are explained by added topics (for example Git gained
GitHub and Bitbucket submodules) or by a more careful outline.

| module | old h | new h | change |
|---|---|---|---|
| linux | 10 | 10 | 0% |
| git | 4 | 10 | 150% |
| testing | 6 | 9 | 50% |
| rest-apis | 6 | 8 | 33% |
| dsa | 40 | 48 | 20% |
| system-design | 20 | 17 | -15% |
| html | 5 | 5 | 0% |
| css | 8 | 7 | -12% |
| javascript | 18 | 20 | 11% |
| typescript | 8 | 7 | -12% |
| react | 14 | 15 | 7% |
| react-hooks | 8 | 8 | 0% |
| react-router | 3 | 4 | 33% |
| state-management | 8 | 6 | -25% |
| frontend-performance | 6 | 8 | 33% |
| java-core | 14 | 14 | 0% |
| java-oop | 10 | 10 | 0% |
| java-collections | 10 | 10 | 0% |
| java-exceptions | 4 | 3 | -25% |
| java-multithreading | 14 | 11 | -21% |
| java-8-plus | 8 | 7 | -12% |
| jvm-memory | 8 | 8 | 0% |
| spring-framework | 10 | 7 | -30% |
| spring-boot | 10 | 8 | -20% |
| spring-mvc | 6 | 6 | 0% |
| jdbc | 4 | 4 | 0% |
| hibernate-jpa | 12 | 11 | -8% |
| microservices | 10 | 13 | 30% |
| nodejs | 12 | 9 | -25% |
| express | 6 | 6 | 0% |
| authentication | 8 | 8 | 0% |
| web-security | 6 | 6 | 0% |
| sql | 14 | 15 | 7% |
| postgresql | 8 | 7 | -12% |
| mongodb | 8 | 8 | 0% |
| docker | 6 | 7 | 17% |
| nginx | 3 | 5 | 67% |
| ci-cd | 8 | 7 | -12% |
| python-fundamentals | 10 | 9 | -10% |
| python-data-structures | 6 | 5 | -17% |
| python-oop | 8 | 6 | -25% |
| python-advanced | 8 | 6 | -25% |
| python-exceptions-files | 4 | 4 | 0% |
| python-concurrency | 8 | 6 | -25% |
| python-async | 6 | 5 | -17% |
| python-internals | 6 | 5 | -17% |
| django | 10 | 9 | -10% |
| fastapi | 6 | 6 | 0% |
| llm-apis | 10 | 8 | -20% |
| rag-agents | 14 | 11 | -21% |
| python-data-science | 12 | 9 | -25% |
| data-visualization | 4 | 4 | 0% |
| statistics | 14 | 11 | -21% |
| machine-learning | 24 | 19 | -21% |
| deep-learning-nlp | 20 | 19 | -5% |
| project-questions | 6 | 3 | -50% |

New modules have no old figure.

## Daily plan and dashboard

- **The plan is derived.** `services/planner/schedule.ts` turns the effective syllabus into blocks (one per topic), orders modules (core, then recommended, then the rest; foundation first; prerequisites always before their dependents; "Later" modules last)
  and packs them onto the learner's study days from today at their daily minutes. Block minutes add up exactly to the hours on the review step. Minutes are never compressed to fit a deadline.
- **Full days.** The plan is one stream of minutes cut into days of exactly the daily minutes; a topic that straddles a cut is split there ("Part 1 of N", "Part 2 of N"), so with no pins and no missed days the study days needed are exactly
  `ceil(total minutes / daily minutes)` (the review step, dashboard status, Study home and Settings syllabus all say the same number; a test checks it for several roles and paces). The cuts depend only on the syllabus order and the daily minutes,
  never on progress, so a finished part keeps its size and id. A part can be shorter than 15 minutes where a cut falls just after a topic starts: merging it would break the exact day count, so the exact count wins. Removed blocks keep the cuts where they were.
  An open block is never scheduled before the day it was planned for, so finishing early leaves free time instead of pulling tomorrow's work forward (the learner can choose to do extra). "Later" blocks (core first) come after everything else and are outside the deadline check.
- **Infeasible deadline, in place.** The status uses the same `assessFeasibility` arithmetic and the same option cards as the review step (`FeasibilityOptions`): "Move target to <date>", "Prepare core first" (a reversible override, with Undo) and "Study more each day" (only when the hours needed are 12 or fewer).
- **Only deviations are stored**, in `profile.plans[journey]`: start date, study days (`isStudyDay`), blocks moved to a date, blocks removed, and the day the catch-up notice was dismissed. A finished block is a normal progress record with id
  `topic.<module>.<topic-slug>[-pN]` plus a `lesson` activity entry; undoing a block clears `completed` but keeps the activity (history is not rewritten). A topic counts as done only when its own record is complete (all parts done).
- **Missed days** are redistributed over the days ahead and a Catch-up notice says how many blocks moved and from which days; nothing is dropped. A deadline that is too short is reported in study days (what the work really needs, what lands after the deadline).
  Existing learners' plans start the first day they open the new dashboard.
- **Revision** is additive, never scheduled ahead: when reviews are due, Today shows a labelled block of 2 minutes per due item, capped at 20 percent of the daily minutes; it counts in the ring but never pushes topic blocks.
- **Module completion** is 50 percent topics and 50 percent questions when the module has questions, and 100 percent topics when it has none; the UI always shows both raw numbers ("14 of 20 topics", "3 of 8 questions" or "no questions yet").
- **Removed blocks** are listed (with Restore and Restore all) in Manage my prep > Removed and under Settings > Syllabus; the status line's "N blocks removed" links there.
- The minutes chart's y axis uses ticks generated from the data maximum (`services/analytics/chart-ticks.ts`): distinct whole values in 5/10/15/30-minute or whole-hour steps.
- The dashboard (`/dashboard`) shows Today, the week strip, plan status, the syllabus by area, streak, minutes chart, readiness and weak topics. Study home shows the study plan's Today block with the same component.

## HR interview preparation

- **20 modules, not one.** The HR categories are catalogue modules `hr-<slug>` (`data/catalog/modules/hr.ts`; domain `career`, skill area `hr`, interview-only), so each can be released, dropped from a syllabus and tracked on its own, and they flow into the review step, the daily plan, the syllabus-by-area and readiness like any module. Each studies three 15-minute steps
  ("Understand what is asked", "Draft your STAR answer", "Practise aloud"). Their questions are ordinary curated questions, level-neutral and all filed in `<module>/fresher.ts` so ids stay valid (`hr-teamwork.fresher.<slug>`); the UI shows no level for them.
- **Relevance** is the same for every role (`role-relevance.ts`): six core (tell me about yourself, why hire you, strengths and weaknesses, why this company, teamwork, communication), nine recommended, three optional (changing jobs, employment gaps, joining availability). `hr-fresher-specific` and `hr-experienced-candidate` are
  recommended in the table and `tierForExperience` (resolved in `resolveSyllabus`) moves each to optional for the levels it does not suit (fresher category for beginner/fresher, experienced category for intermediate/advanced). Cost: about 15 hours are added to every interview plan; a learner can drop any HR module.
- **Question fields** (all optional in the schema, required by the gate for `hr-*`): `weakAnswer`, `weakAnswerWhy`, `recruiterExpects`, `answerFramework` (with [bracketed placeholders]), `starPrompts`, optional per-question `selfCheck`. `interviewerIntent` is why HR asks it, `shortAnswer` the sample strong answer, `detailedAnswer` the annotated breakdown, `commonMistakes` the mistakes to avoid.
- **Gate** (`services/content/hr-rules.ts`, run by `content-gate.test.ts`): a released HR module needs `HR_RELEASE_MIN_QUESTIONS` (5) questions in total, not 25 fresher; HR questions need no web source; every HR question must have the HR fields, make no statistic or frequency claim ("studies show", "80% of recruiters", "most recruiters"), name no company
  (`data/questions/hr-denylist.ts`, an editable list that cannot catch every employer) and state no metric as fact in a sample answer ("increased sales by 40%"); a metric is allowed only as a [placeholder] such as "[your number]".

- **Where it lives.** Sidebar: Interview Prep > "HR Interview" (`/hr`, not in the mobile tab bar, which is full; mobile reaches it from the Interview Zone and the dashboard card). `/hr` lists the 20 categories (cards say "N of 5 ready" below the release minimum, "N questions ready" above, never the technical "fresher" wording, and
  carry a plain "For freshers" / "For experienced candidates" note on the two audience categories); `/hr/answers` lists every saved answer, grouped by category and searchable. A category opens the normal library route and a question opens the normal question route, which renders the HR layout for `hr-*` questions: no level badge, crumb or filter.
- **HR question layout** (`features/hr`): why HR asks it and what the recruiter expects; the answer framework; the STAR builder (four fields with guidance, a word count per part against a suggested range, a total with a speaking-time hint, an optional self-check the learner ticks, a draft kept in localStorage until saved); the learner's saved answers; the sample, hidden until "Show sample answer" and labelled
  "Sample, written to show the structure. Replace the details with your own facts."; mistakes, tips, follow-ups; and a practice panel (Mark practised = the ordinary completion, so revision scheduling, readiness and activity work as for any question; confidence 1 to 5). Word targets and the 130 words-a-minute pace live in `data/hr/guidance.ts` and are labelled a guideline. The self-check is a self-assessment: nothing in the app reads, scores or judges an answer, and a test scans the feature's text for such claims.
- **Saved answers** are rows in the `hrAnswers` table (Dexie version 3; the upgrade leaves every existing table untouched): several per question, four STAR fields of at most 1,500 characters, an optional title, the ticked self-check ids. Export version 3 carries them (v1 and v2 files import with none). Removing a question keeps its answers; "Delete my notes and progress" deletes them too, and its confirmation says so.

## Mock interviews

- **Honest scoring.** `data/mock/rubric.ts` is the one place for dimensions, weights and thresholds. Every number in a score is a 1 to 5 rating the learner gave themselves, entered after revealing the model answer (1 = 0 points, 3 = 50, 5 = 100). Technical weights 30/20/15/15/10/10 (accuracy, completeness, practical, communication, structure, confidence); HR weights 25/25/20/20/10 (STAR structure, completeness, communication, specific example, confidence).
  A question's points are the weighted mean of the dimensions rated; the score is the mean over answered and rated questions, shown beside "if unanswered or unrated counted as zero". Nothing reads or judges typed text. The result page has a "How this score is calculated" panel that prints the formula, the session's own weights and every rating (a test checks the panel equals the stored inputs).
- **Text match.** Optional and off by default: plain whole-term, case-insensitive match of the question's `keywords` (not `keyPoints`: measured on the real bank, keyPoints verbatim hit 8 percent against 68 percent for keywords, even given the model answer itself). It is labelled "text match only, it cannot judge correctness" and enters the score only as one named, renormalised line when the learner switches it on. keyPoints are a tick list in the review.
- **Two phases.** A timed interview (typed answers, optional hint, skip, jump; the countdown is only interview time) then an untimed review. "Rate after each answer" is an option and pauses the timer while rating. Pause hides the question and is not counted; a reopened session starts paused; a hidden tab pauses. Time up ends phase one only: typed text is kept, unanswered stay unanswered and unscored.
- **Pools** (`services/mock/pool.ts`, `data/mock/types.ts`): strict, derived from the catalogue, role relevance and the bank. A path type uses modules in its domains that are core or recommended for its role AND have questions, so Python and Data Science are empty (and disabled with "No questions yet for this type") instead of borrowing SQL. Levels default from the learner's experience, HR and Project are level-neutral, removed questions are excluded, the learner's own questions join Project (no difficulty or keywords). The draw is seeded, never repeats and never pads (the setup says "Only N questions are available"); Mixed draws in proportion with at least one HR question from four questions up.
- **Storage.** `mockSessions` Dexie table (database version 4), export version 4 (v1 to v3 import with none). A session stores its config, seed, questions, a snapshot of the rubric (so an old score recomputes exactly), phase, position, elapsed seconds and answers; it autosaves, resumes after reload and can be abandoned. `setFlag` (never a toggle) backs "Add to my revision queue", which the learner confirms. Finishing logs a `mock` activity with the real answering minutes.
- **Routes**: `/mock`, `/mock/new`, `/mock/:id`, `/mock/:id/result`, `/mock/history` (a score-over-time chart only from two or more real finished sessions). Sidebar item (not in the mobile tab bar) plus cards on the Interview Zone and the dashboard. No mock blocks in the plan.
- **Keyboard**: Ctrl+Enter and Esc work while typing; N/Right, P/Left, H, S, R only outside inputs. A test scans the feature's source and rendered pages for machine-grading wording.

## Resume interview studio

- **Local only.** A PDF is read in the browser (pdf.js and its worker are loaded only when a file is chosen: `import()` in `services/resume/pdf-reader.ts`, about 434 kB plus a separate 1.26 MB worker asset, so the main bundle is unchanged) with auto-fetch, streaming and range requests off. 10 MB and 10 pages at most; password-protected, empty, non-Latin and unreadable files get a plain message that never contains file text.
  Pasted text and `.txt` are equal alternatives. The extracted text lives in component memory until "Build my profile"; only the reviewed profile is stored (`resume` table, Dexie v5): no PDF, no raw text. Source-scan tests forbid fetch/XHR/WebSocket/sendBeacon and `console.*` in the feature, its services and data; error pages and the error boundary print no message on resume routes.
- **Reading is a first draft.** `extract.ts` rebuilds lines from positioned text and detects two columns (a gutter at most 8 percent of items cross); `parse.ts` splits by a heading dictionary, date ranges, bullets (including symbol-font glyphs and bullets whose marker was lost) and a role word that decides which part of a header is the role. Lines it cannot place stay in `unplaced` for the learner to assign or delete. Sections that are not used for questions (languages, interests, hobbies, declaration, references, personal details, strengths, publications, volunteering, a heading the dictionary does not know) are kept in an editable `other` list and never reach questions or a question set; internships, training and awards headings map to experience, certifications and achievements. The editor shows per-section hints ("Found 2 jobs: please check"), "This job has no bullets" (with "Not a job: move to Other"), "Short entry" for a training or internship under 3 months, and flags skill rows that read as sentences (questions are made only for skill rows of up to 3 words and 30 characters).
  Tests use generated PDFs of a fictitious persona (`src/test/make-pdf.ts`): single column x3 variants, two interleaved columns, stacked company/dates/role with wrapped bullets, unknown headings, no text.
- **Questions are template-based and deterministic** (`data/resume/templates.ts`, 33 templates in 10 sections; `services/resume/generate.ts`). Slots hold only the learner's own words (cut at 140 characters), a template is skipped when a slot is empty, and per-source caps (4 responsibility/follow-up/achievement questions, 6 scenario technologies, 5 unused-skill questions) keep the bank readable; one setting lifts the caps and one switches off the date questions (tenure, gaps).
  Ids are `resume-<section>.fresher.<cyrb53(template|source uid|slot key)>`: every resume item has a stable uid, so correcting a word keeps the id and the learner's notes, answers and progress. A deleted source marks its questions "Source removed" (never silently dropped); wording the learner edited is kept ("Reset to generated" restores it); imported questions are untouched.
- **They are ordinary questions.** Ten generated modules `resume-<section>` (career domain) give them titles and library routes but are excluded from every syllabus, plan and "questions ready" goal. `services/content/own-questions.ts` and `useOwnQuestionEntries`/`useFullIndex` are the ONE merge point of the learner's own questions (written, from the resume, imported), used by the library lists, the palette, counts, summary, syllabus progress, Manage my prep and the mock pools (a test fails if another file reads `customQuestions` directly).
  They stay out of readiness but their reviews fall due like any. The practise page reuses the HR STAR builder, saved answers, confidence, notes, bookmark and revision, with a fill-in outline (never a sample answer). The Project mock draws the resume project and architecture questions plus the learner's own.
- **Question sets** (`lastrev-question-set` v1): questions and outlines only (the wording does quote resume text, and the dialog says so); the profile only when ticked. Import validates with Zod, previews counts and skipped duplicates, then adds a set labelled with its file name that can be removed as a set. The main backup (v5) carries the profile and questions and says so in Settings.

## Linux Practice (third journey)

`AppMode` = `interview | study | linux`; `LearningMode` (the two journeys with a profile and a daily plan) is unchanged. Linux Practice needs no onboarding and no profile: the landing card goes straight to `/linux` and remembers `lastMode: "linux"`, so `/` resumes there on the first entry and `/choose` never redirects. The `/linux` routes have no guard; reached from Study Path they keep the Study navigation (`activeMode`), otherwise they are the Linux journey with the sections (Commands, Terminal, Permissions, Date formats, Challenges), Switch mode and Settings in the sidebar.
Settings, export, import and reset work with no profile (`RequireAnyMode` accepts a Linux-only learner); Linux progress is ordinary progress records, so it is in the backup. The landing card lists come from ONE list, `app/features.ts`: a feature is "Soon" exactly when it has no `route`, and a test checks every route matches a real page.

## Spoken English (fourth journey)

`AppMode` = `interview | study | linux | english`. Spoken English is a standalone course for people with little or no English: no onboarding, no profile, no guard. The landing card goes straight to `/english` and remembers `lastMode: "english"`; the card appears only once the course has a lesson, and its lines come from the generated index (`app/features.ts`), so it never lists what does not exist. The sidebar has Home, Course, Today's challenge, Practice, Revise and My progress; the mobile bar has Home, Course, Challenge, Practice and Switch (Settings stays in the sidebar so the bar is no fuller than the other journeys').

| Route | What it is |
|---|---|
| `/english` | Home: today's challenge ("Day N is next"), continue, items to revise, progress summary, privacy block |
| `/english/course`, `/english/course/:module` | Modules with per-module progress; a module lists its lessons (Daily English grouped by its 13 categories) |
| `/english/lesson/:module/:lesson` | One lesson, item by item: sentence, word, grammar, dialogue, interview answer (easy, intermediate, professional) |
| `/english/practice` | Writing (type, order, fill the blank, choose, match), speaking (self-rated), listening (type what you hear) |
| `/english/challenge` | The 30-day challenge |
| `/english/revise`, `/english/progress` | Revision of items marked known; real numbers, confidence trend, saved items |

**Content.** Authored in `src/data/english/` (one file per module; Daily English is a folder of 13 category files), parsed by Zod (`types/english.ts`) through `defineLessons`, and indexed by `pnpm english:index` into `index.generated.ts` (the course page, landing card and challenge read the index; lesson bodies are lazy chunks). Ids are `en.<module>.<lesson>[.<item>]` and are stored as ordinary progress records, so the backup, revision scheduling (1/3/7/14/30 days via `reviewQuestion`), notes and bookmarks need no new machinery. The gate (`services/english/gate.ts`, run by `data/english/content-gate.test.ts`) checks every machine-checkable rule, and the challenge must be either empty or exactly 30 valid days built from real ids. It cannot judge whether the English or the Hindi is correct, so every module has a `review` flag (`draft` until a teacher is recorded) and draft modules say so on screen.

**Learning model.** An item is *learned* when marked "I know this" or when two text exercises on it were passed; one pass is *practised*; a wrong answer changes nothing. Text exercises are objective: the typed or arranged answer is matched against the stored sentence and its accepted variants after normalising case, punctuation and contractions. There is no fuzzy matching and no scoring. Speaking is a 1 to 5 self-rating stored as the rating only.

**The 30-day challenge** is 30 independent day-cards. The start date only gives each day a date; "Day N is next" is the first day not done, missed days are listed and can be done any time, nothing resets and nothing is locked. A day is done when its lesson, words, sentences, spoken sentence, writing exercise (two thirds correct) and confidence check-in are all done. State lives in the `english` row (Dexie v6, export v6; older files import with none).

**Speech, honestly.** Listen uses `speechSynthesis` when the browser has an English voice (a local en-IN/en-GB/en-US voice is preferred; an online voice is flagged and the page says the sentence text is sent to it), otherwise the page says listening is unavailable. Recording needs a secure context and `MediaRecorder`, is kept in memory only and is discarded on leaving the page. Speech recognition is opt-in per visit, behind a privacy notice, and its result is labelled "word match from your browser's speech-to-text, not a pronunciation score". Nothing is uploaded by the app; a source scan in the tests fails if the feature calls `fetch`, XHR, beacons or sockets. No text anywhere claims an assessment or uses AI wording (a test scans every page).

**Other touch points.** Time on task is logged as English activity after real active seconds (`use-time-on-task.ts`). The dashboard's readiness card shows "Spoken English: N of M lessons finished" on its own line, outside the overall mean. "Interview English" links appear on the HR page and the Interview Zone only when the interview module has lessons. Hindi is marked `lang="hi"`, uses the bundled Noto Sans Devanagari (no network) with extra line height, and wraps rather than truncates; English is `lang="en-IN"`.

## Study Zone: lessons, roadmap and progress

Design note: `docs/design/phase-8-study-zone.md`. Lessons belong to catalogue **modules** (and to one of the module's topics), never to
roadmaps, so a module shared by two roadmaps has one lesson set and one progress. Roadmap **phases** (`data/catalog/phases.ts`) point at
modules, or at a subset of one module's topics; the partition test requires every topic of every core or recommended module of a roadmap
to sit in exactly one phase. The Study plan is ordered by the phases (`services/study/phase-order.ts`; a module's selected prerequisites
are pulled in front of it, "Later" modules stay last, a split module becomes one entry per phase sharing its minutes); Interview Prep keeps
the domain order. Existing Study plans moved when this began (`STUDY_ORDER_VERSION` in `config/study.ts`): a learner with history is offered "Restart plan from today" once, on Study home, so no pile of missed blocks appears.

| Piece | Where |
|---|---|
| Lesson schema, ids, index entry | `types/lesson.ts` (ids: `lesson.<module>.<slug>`, `task.<module>.<slug>.<n>`, `ex.<module>.<slug>.<exercise>`, `check.<module>.<slug>.<item>`) |
| Authoring | `src/data/lessons/<module>/NN-<slug>.ts` with `defineLesson(moduleId, {...})`; `pnpm lessons:index` writes `index.generated.ts` (also on dev and build); loaders lazy-load one chunk per lesson |
| Numbers | `config/study.ts`: pass mark 70%, module quiz 10, phase quiz 20, minutes tolerance 25%, release minimum 3 lessons, sandbox limits, `RUN_JS` |
| Gate | `services/lessons/gate.ts` run by `data/lessons/content-gate.test.ts` (official-docs sources, valid quiz items, balanced code, prerequisites, no frequency or statistic claims, no brands via `data/lessons/denylist.ts`, minutes within 25% of the topic) |
| Release | a module is "released" for lessons only through `data/catalog/lesson-status.ts`, and only when every topic with minutes has lessons within 25%, with at least 3 lessons; otherwise it is "in progress" (some lessons) or "planned" (none) |
| Quizzes | `services/study/quiz.ts`: five item types graded by exact comparison (no partial credit), seeded assembly with no repeats, attempts kept as item ids and correctness only; score means "percentage of items answered correctly" |
| Progress | lesson, task, exercise and project ticks are ordinary progress records; phase, roadmap and module progress are **derived** (`services/study/roadmap.ts`, `module-progress.ts`): equal-weight average of the parts a module has (learning, practice, quizzes, questions), always printed with raw counts |
| Topic completion | finishing the last lesson of a topic whose lessons cover its minutes completes the topic's plan blocks (no second activity log) with an Undo toast; a partly-written topic is never completed by its lessons |
| Practice and the JavaScript sandbox | `services/study/sandbox/`: a hidden iframe with `sandbox="allow-scripts"` only (opaque origin), a CSP of `default-src 'none'` inside it (the network boundary), and the learner's code in a Worker inside that iframe (killed on a 2 s per-case timeout). Cases are JSON (`entry`, `args`, `expected`); nothing authored is ever evaluated. A probe Worker first proves, in the running browser, that there is no `document` or `localStorage`, that the origin is opaque and that a `data:` fetch is refused; if not, nothing runs and the exercise stays self-check. Memory is not limited (stated on screen). `RUN_JS` turns it off. Every other language is "Not run by LastRev": task, starter, reference solution on request, self-check list. The gate's one rule that runs code evaluates the same harness text in-process: every reference solution passes its cases and no starter does |
| Projects | `src/data/projects/<id>.ts` with `defineProject` (file name = id; gate in `services/projects/gate.ts`). Progress is the learner's ticks of the acceptance items (`proj.<id>.<n>`), plus notes and a repository link they paste (https only, stored, never fetched) in `projectStates` |
| Quizzes | module quiz (10 items, needs 6 in the pool) and phase quiz (20 items, needs 12), assembled from lesson checks round-robin with a seed; the Quizzes page lists only quizzes whose lessons exist |
| Weekly milestones | derived from the plan's schedule (`services/study/milestones.ts`): per Monday-to-Sunday week, the topics planned, their lessons and assignments, the module and phase quizzes that fall due when a module's or phase's last block lands, and project steps due the week after the lessons they follow end; "done" comes from the records |
| Storage | Dexie and export v7: `quizAttempts` (capped per quiz) and `projectStates`; v1 to v6 files import with none |

Every screen works with any amount of content: counts are the real ones ("N ready · covers X of Y topics"), a module or phase without lessons says
"in preparation", and nothing is padded. The gate passes with no lessons at all.

## Research and method

`src/data/research/<area>.ts` holds research entries (the file name is the area id; areas are the 18 readiness categories plus `jobs`, `interview-process`,
`languages-and-frameworks` and `ai`). Each entry has a claim, an evidence type (official documentation, repeatedly reported experiences, job-market trend, or an informed
preparation recommendation, which is a prediction), sources, a research date, a confidence and a horizon (2026 or 2027). Zod rules make it impossible to type a prediction as
observed: `predicted` holds exactly when the type is the recommendation, every 2027 entry is a prediction, and a prediction never has high confidence. The gate
(`services/research/gate.ts`, run by `data/research/content-gate.test.ts`) checks sources against `data/research/hosts.ts` (official documentation reuses the questions
allowlist; job-market and experience hosts are listed there by whoever verified the publisher), allows statistic-like numbers only in a job-market-trend or
official-documentation entry that carries a source URL, and rejects brands, frequency claims and implausible dates. `/research` shows entries with filters and a bibliography of unique
sources, labels every prediction "Prediction, not verified", and states how it was made and its limits; `/how-we-decide` explains that content is chosen by editors and that there is
no data on how often a question is asked. `pnpm content:verify-links` also checks lesson, project and research URLs.

## Readiness, analytics, job match and accessibility

**Readiness** (`services/readiness/categories.ts`, one service for `/readiness` and the dashboard card): 18 categories mapped to catalogue modules in
`data/readiness/categories.ts` (many-to-many; every module must be mapped). A category's score is the plain average of the parts it has: questions (the
long-standing 60% completion + 40% confidence score), lessons finished, quizzes passed, assignment and exercise ticks, and the average of the learner's own
ratings in finished mock interviews; Spoken English counts its lessons. A category with no content says so and is left out; the overall is the plain mean of
categories that have content, are in the learner's syllabus (either journey) and are not switched off (`preferences.readinessExcluded`). A test pins that a
questions-only learner gets exactly today's numbers. **Analytics** (`services/readiness/analytics.ts`): study minutes by Monday week over 12 weeks (Recharts
plus an `sr-only` table), activity by type, streak runs, confidence distribution, and weak questions; each view is drawn only when it has data. A weekly
snapshot (overall, weak questions, average confidence) is kept from the week the feature began (never back-filled); the trend line needs 3 snapshots.

**Job match** (`/job-match`, `services/jobmatch/`): local matching of a pasted job description against the 165-skill table by exact name and listed aliases,
as whole names, with explicit case-aware rules for ambiguous short names (`data/jobmatch/terms.ts`: Go, R, Spring, Express, JS, TS, JPA, S3). Every match
shows its sentence; unrecognised technology-looking words are listed, never guessed. Coverage per skill (path tier, syllabus, known tick, lessons, questions,
checks) comes from real records; gaps link to the library, lessons and "Add to my syllabus" (with Undo). Target roles (at most 20; the text is kept unless the
learner unticks it) are the only thing stored. Nothing is sent anywhere (a source-scan test).

**Storage**: Dexie and export v8 add `readinessSnapshots` and `targetRoles`; v1 to v7 files import with none.

**Accessibility**: `axe-core` is the one dev dependency. `src/a11y.test.tsx` runs it in jsdom over the main screens (contrast and layout rules off there); the
real-Chrome pass runs it on every page, dark and light, at 1280 and 390 px, with contrast on, alongside a scripted keyboard walk (focus order and a visible
focus indicator on every stop), landmark and heading checks, reduced motion, 320 px and 200% zoom reflow, control names and `lang` checks.

## Managing your prep

- **Remove, never delete.** A learner can remove any module (core ones after a confirmation) and any question. A removed module is an override
  `selected: false`; a removed question is `removed: true` on its progress record. Removing keeps notes, confidence and completion, and every removal can be
  restored from `/interview/manage` (tabs: Modules, Questions, My questions, Removed). Readiness, revision queues, counts and the library leave removed items out.
  The only action that forgets data is the separate, confirmed "Delete my notes and progress for this question".
- **Your own questions.** `customQuestions` (a Dexie table added in database version 2; the upgrade leaves every existing table and row untouched) holds
  questions the learner wrote, with ids `<module>.<level>.my-<slug>-<suffix>`. They work on the same question route and progress records as curated ones, are labelled
  "Yours", and are counted separately ("10 curated + 1 yours"). Export format version 2 carries `customQuestions`; version 1 files still import.
- **Onboarding.** New learners default to Complete beginner (it still starts on the Fresher questions and plans 1.25x time). The name is required (trimmed, 1 to 60);
  learners saved with no name are only asked when they open edit mode. The skills step is a category table with featured technologies first. **It follows the learner's path:** a category is on the path when one of its technologies belongs to a module that is core or
  recommended for any chosen role (the same relevance data the curriculum uses); those rows lead, core before recommended, and show only on-path technologies in the normal grid (the rest sit behind "Show more" labelled Optional). Every other category waits in one collapsed
  "Other technologies (optional)" section; selected technologies there still count, and a search always looks through everything and opens the section when it matches. The Interview Zone home works the same way: the path's core and recommended modules lead, everything else is under a collapsed "Explore other topics (optional)". The builder's switch reads "Also show topics outside my path". The review step's summary
  lives in the same bottom bar as Back and Start preparing.

## Deviations from generated shadcn code (with reasons)

- `ui/sonner.tsx` reads the theme from the app's `ThemeProvider` instead of `next-themes` (no provider exists in this Vite template).
- `hooks/use-mobile.ts` uses `useSyncExternalStore` (generated version set state inside an effect; fails the React lint rule).
- Colour tokens in `index.css` are overridden with the LastRev palette; radius, fonts and component styles are untouched.

## Scoring model (transparent)

`area = 60% completion + 40% confidence/5`; overall = plain mean of areas that have questions. Defined in
`services/analytics/readiness.ts` and shown to the learner in the dashboard popover.

## Quality gates

`pnpm check` = typecheck + ESLint + Vitest. Tests cover content integrity (schema, unique ids,
resolvable `relatedIds`, speakable short answers, fresh index), services, store persistence, import/export,
and integration flows through the real router. Test timing is global, not per file: `testTimeout`/`hookTimeout` 30 s in `vite.config.ts` and Testing Library's `asyncUtilTimeout` 10 s in `src/test/setup.ts` (route tests load lazily split chunks, which is slow on a busy machine). `hydrate()` loads once per data set
(a second call is a no-op, and a load that started before `resetAll` never applies). Vitest's on-disk transform cache is switched off (`fsModuleCache: false`): it is keyed on a file's own content, but `import.meta.glob` (the question loaders) depends on which files exist, so adding a question folder left a stale loader and the content gate passed or failed depending on the cache, so mounting the app after seeding cannot overwrite newer in-memory changes with an older database read.

## Feature status

| Area | Status |
|---|---|
| Design system, shell, mobile nav, ⌘K search, themes | Done |
| Landing page: Interview Prep / Study Path choice, remembered mode, switch mode | Done |
| Interview Prep onboarding (multi-select paths, validation, plan feasibility, edit mode) | Done |
| Curriculum Builder (review step for both journeys, `/settings/syllabus`), 83-module catalogue with topic-level minutes, role relevance tiers, skill picker and skill coverage | Done |
| Study Path set-up (3 roadmaps, experience, pace, review, edit) and Study home (roadmap, module order, hour estimate, pace) | Done. Lessons, projects, assignments and a daily tracker are not started; the landing card marks them "Soon" |
| Dashboard (real data only, empty state, weekly chart, due reviews, weak topics, readiness) | Done |
| Interview Zone: library, filters (URL-persisted), question detail, Quick/Deep modes, notes, confidence, bookmarks, difficult, revision, spaced repetition, self-test reveal, ← → keys | Done |
| Library (sidebar lists: all saved, saved, difficult, revision queue, notes; live counts) | Done |
| Settings: plan, revision intervals, JSON export/import (validated, deduped), reset with confirmation | Done |
| Content: React, React Hooks, JavaScript, Core Java, SQL (fresher) + React (intermediate) — **32 questions** | Seed batch — far below the 25/50/75-per-module targets |
| HR preparation (20 categories, STAR builder) | Done |
| Resume Studio (PDF.js parsing, template-based prompts) | Done |
| Mock interview simulator (self-rated rubric) | Done |
| Study Zone (3 roadmaps, lessons, assessments) | Not started |
| Communication & Spoken English (course, practice, 30-day challenge, revision) | Done. Modules are drafts until a teacher reviews them; the challenge page says so until its 30 days exist |
| Linux practice (library, safe virtual shell, chmod, date formats, challenges) | Done |
| Daily planner (7/15/30/custom, missed-day redistribution) | Estimation only; planner not started |
| Research dataset & bibliography | Not started |
| Job-description skill-gap tool | Not started |

## Adding content

1. Create `src/data/questions/<moduleId>/<level>.ts` using `defineQuestions(moduleId, level, [...])`.
2. `pnpm content:index` (also runs on `dev` and `build`).
3. `pnpm test` — the content tests reject malformed questions, duplicate ids, dangling `relatedIds`, and over-long short answers.

### Adding English lessons

1. Write lessons with `defineLessons(moduleId, [...])` in `src/data/english/<module>.ts` (or `daily/<category>.ts`).
2. `pnpm english:index`.
3. `pnpm test` — the gate rejects incomplete items, Latin text in Hindi fields, unknown ids and impractical activities.
