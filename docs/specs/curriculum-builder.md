# Curriculum Engine and Preparation Review Redesign (user spec)

Source: pasted by the user. Condensed by ARC-01 with every requirement, list and rule kept.
Numbers in the user's mock-ups (29 modules, 212h, 34 modules, 280h, 140 days, 18 modules, 14 topics, 24 lessons, 65 topics) are ILLUSTRATIVE LAYOUT VALUES. Real totals must be derived from curriculum data.

## 1. Problem
The review step (currently `/start/interview`, step 5) shows only role, experience, daily hours, deadline, total hours and a feasibility warning. The learner must see the complete syllabus before starting. The screen must answer:
1. What technologies will I study? 2. Which topics are included? 3. How many lessons? 4. How many interview questions? 5. How much time per module? 6. Which are compulsory? 7. Which are optional? 8. What is shared across career paths? 9. What is specific to my career? 10. Is my deadline realistic?

## 2. New review page ("Curriculum Builder")
Heading: "Review your preparation syllabus". Subtitle: "Your personalized learning and interview preparation plan. Review modules, customize your syllabus and choose what to prioritize."
Top summary: selected career path, experience, daily hours, deadline, total selected modules, total estimated hours, total lessons, total interview questions.
Three clear groups: A. Shared Engineering Foundation, B. Role-Specific Technical Modules, C. Optional Specialization Modules.
Accordion UI. Each category shows: title, selected module count, total estimated hours, completion status, expand/collapse.
Each module row shows: name, short description, estimated hours, lessons, topics, interview questions, practical assignments, difficulty, mandatory/recommended/optional label, selected state, prerequisites, expandable subtopics, checkbox.
Learners can select/deselect optional modules. Mandatory modules are visibly identified. Every change updates all summary numbers immediately.
Expanded module detail: module, estimated duration, lessons, topics, Fresher/Intermediate/Advanced question counts, practical assignments, projects, revision checkpoints, difficulty.
The learner can customise the syllabus WITHOUT losing the recommended curriculum.
Layout: top = brand, step progress, change mode, heading. Summary. Module categories: Shared Engineering Foundation, Frontend, Java Backend, MERN Backend, Database, Mobile, DevOps, AI Engineering, Data Science. Show only relevant selected modules by default, with an option to reveal the full catalogue. Search and filters: selected, core, recommended, optional, by technology, by difficulty. Sticky preparation summary at the bottom on desktop; compact collapsible summary on mobile. Syllabus occupies the main content area (no wasted space).

## 3. Master module inventory (domains)
Rule: ONE module per technology. Domains are views/tags; a technology listed in several domains is ONE module. Group fine-grained items as topics/submodules where sensible (e.g. Git/GitHub/Bitbucket = one module with three submodules).

A. Shared engineering foundation (all roles): Computer Fundamentals; Operating Systems; Linux Fundamentals; Linux Command Mastery (50+ practical commands); Ubuntu 24.04 Administration; Computer Networking; Internet Fundamentals; HTTP and HTTPS; DNS and Ports; Git Fundamentals; GitHub; Bitbucket; Software Testing Fundamentals; API Fundamentals; REST API Concepts; Debugging and Troubleshooting; CI/CD Fundamentals; Jenkins; Docker; AWS Fundamentals; AWS S3; AWS EC2; Agile and Jira; Production Deployment Fundamentals.
B. Frontend: HTML5; CSS3; Responsive Web Design; JavaScript ES6+; Advanced JavaScript; TypeScript; React.js; React Hooks; React Router; Component Architecture; Redux Toolkit; Zustand; TanStack Query; Tailwind CSS; shadcn/ui; React Hook Form; Zod; Jest; Vitest; React Testing Library; MSW; Chrome DevTools; React Profiler; Lighthouse; Recharts; Frontend Performance Optimization; Accessibility; Single Page Applications.
C. Java backend: Core Java; Advanced Java; OOP; Collections Framework; Exception Handling; Generics; Java 8+; Streams and Lambdas; Multithreading; Concurrency; JVM and Memory Management; JDBC; Spring Framework; Spring Boot; Spring MVC; Spring Security; Hibernate; JPA; REST APIs; Layered Architecture; Microservices; PostgreSQL; SQL; Log4j; Swagger / OpenAPI.
D. MERN backend: Node.js; Node.js Internals; Event Loop; Express.js; Middleware; MongoDB; Mongoose; Aggregation Pipeline; REST API Development; Authentication; JWT; OTP Authentication; RBAC; API Security; Rate Limiting; Caching; Error Handling; Backend Architecture; Logging; Payment Gateway Integration (Razorpay).
E. Database: SQL Fundamentals; PostgreSQL; Joins; Indexes; Transactions; Database Normalization; Query Optimization; MongoDB; Document Modelling; Aggregation; Database Indexing; SQL vs NoSQL.
F. Mobile: React Native; Expo; React Navigation; EAS Build; Android Fundamentals; Google Play Console; Mobile Authentication; Mobile API Integration.
G. Deployment and DevOps: Linux Administration; Ubuntu Administration; Docker; Docker Compose; Nginx; PM2; HTTPS and Let's Encrypt; VPS Deployment; Jenkins; Bitbucket Pipelines; GitHub Actions; AWS EC2; AWS S3; Environment Variables; Application Logging; Production Troubleshooting.
H. AI engineering: Python Fundamentals; AI Fundamentals; Machine Learning Basics; OpenAI API; Prompt Engineering; Structured Outputs; Embeddings; Vector Databases; Retrieval-Augmented Generation; LangChain; AI Agents; Tool Calling; AI Application Evaluation; Production AI Integration.
I. Data science: Python for Data Science; NumPy; Pandas; Statistics; Probability; SQL; Data Cleaning; Data Visualization; ETL Fundamentals; Machine Learning; Supervised Learning; Unsupervised Learning; Feature Engineering; Model Evaluation; Deep Learning; NLP.

Module topic hints from the user (use as the starting syllabus topics): Computer Fundamentals = CPU, memory, storage, processes. OS = processes, threads, memory, scheduling. Linux = file system, shell, permissions. Ubuntu 24.04 = installation, package manager, services, logs. Networking = TCP/IP, DNS, ports, routing. HTTP/HTTPS = methods, headers, status codes, TLS. Git = branches, commits, merge, rebase. GitHub/Bitbucket = PRs, reviews, repositories, workflows. Testing = unit, integration, regression. CI/CD = pipelines, automation, deployment. Docker = images, containers, volumes, networking. AWS = cloud concepts, IAM, regions; S3 = storage, buckets, permissions; EC2 = instances, SSH, security groups. Debugging = logs, stack traces, root-cause analysis. Agile = sprints, tasks, estimation, collaboration. HTML5 = semantic HTML, forms, accessibility. CSS3 = flexbox, grid, responsive. JS ES6+ = scope, closures, promises, modules. Advanced JS = event loop, prototypes, async, memory. TypeScript = types, generics, utility types. React = components, props, state, rendering. Hooks = useState, useEffect, useMemo, custom hooks. Router = routing, nested, protected routes. State = Redux Toolkit, Zustand. Data fetching = TanStack Query, caching, invalidation. Forms = React Hook Form, Zod. Testing Library = Jest, Vitest, RTL, MSW. Performance = React Profiler, Lighthouse. Java = syntax/types/control flow; OOP; collections; exceptions; generics/streams/lambdas; concurrency; JVM heap/stack/GC; JDBC; Spring IoC/DI; Boot auto-config/starters; MVC; Hibernate ORM/entity lifecycle; JPA mapping/relationships/queries; Security authn/authz; PostgreSQL SQL/joins/indexes/transactions; Logging Log4j/structured; Swagger/OpenAPI; Microservices boundaries/communication. Node = event loop, modules, streams. Express = middleware, routing, error handling. MongoDB = documents, indexes, aggregation. Mongoose = schemas, models, validation. REST = CRUD, pagination, filtering. Auth = JWT, OTP, sessions; RBAC; Security = validation, CORS, rate limiting; Payments = Razorpay; Deployment = PM2, Nginx, HTTPS; Architecture = layered, service separation. Mobile = React Native components/native APIs; Expo tooling; React Navigation stack/tab; EAS Build Android build/release; Android lifecycle/permissions; Google Play listing/publishing. AI = AI/ML/DL; Python data handling; OpenAI models/structured outputs; prompt design/evaluation; embeddings; vector DB similarity search; RAG; LangChain chains; agents tools/workflows; evaluation accuracy/hallucination/testing. Data science = Python, NumPy, Pandas, SQL, ETL, statistics/probability/inference, visualization, ML supervised/unsupervised, model evaluation, deep learning, NLP. ETL belongs primarily to data science/engineering/analytics; HTTP, networking, Git and Linux have broad relevance.

## 4. Role relevance
Every role receives the shared foundation; depth and compulsory status depend on role. Classifications: CORE (essential for the role), RECOMMENDED, OPTIONAL. All modules stay discoverable in the full catalogue.
Roles: Java Full Stack; Java + MERN Full Stack; Java Developer; Python Developer; Data Science; MERN Stack; Frontend; Full Stack; AI Engineer.
Rules: (1) all roles get the foundation; (2) each role gets relevant technical modules; (3) Java + MERN includes BOTH Java/Spring Boot AND Node/Express/MongoDB; (4) Data Science gets Python, statistics, ETL, ML, data subjects; (5) Frontend not forced into Java/Spring Boot; (6) Java Developer not forced into MongoDB/Express; (7) React Native optional unless the role needs mobile; (8) AI modules included for AI Engineer; (9) advanced infrastructure topics have configurable relevance; (10) no duplicate progress when two roles share a module.
User's guidance matrix (core = tick, optional, none) for 5 of the roles:
- HTML/CSS, JavaScript, React, TypeScript: core for Java FS, Java+MERN, Python FS, MERN; optional for Data Science.
- Java: core Java FS, Java+MERN; optional Python FS, MERN; none Data Science.
- Spring Boot, Hibernate/JPA: core Java FS, Java+MERN; none elsewhere.
- PostgreSQL: core Java FS, Java+MERN, Python FS, Data Science; optional MERN.
- Node.js, Express.js: core Java+MERN, MERN; none elsewhere.
- MongoDB: core Java+MERN, MERN; optional Java FS, Python FS, Data Science.
- Python: core Python FS, Data Science; optional Java FS, Java+MERN, MERN.
- Linux, Git, Networking, HTTP/HTTPS, Testing: core for all five.
- Docker, CI/CD, AWS: core for the four dev roles; optional Data Science.
- ETL: core Data Science; optional elsewhere.
Roles not in the matrix (Java Developer, Frontend, Full Stack, AI Engineer) must be mapped by the same rules.

## 5. Resume skill coverage (authoritative skill inventory)
Languages: JavaScript ES6+, TypeScript, Java, SQL, HTML5, CSS3. Frontend: React.js, React Hooks, React Router, Tailwind CSS, shadcn/ui, Responsive Design, Recharts, SPA, Component Architecture. State: Redux Toolkit, Zustand, TanStack Query. Mobile: React Native, Expo, EAS Build, React Navigation, Android, Google Play Console. Backend: Node.js, Express.js, Java, Spring Boot, Hibernate/JPA, REST APIs, Controller-Service-Repository architecture. Database: PostgreSQL, MongoDB, SQL. Docs/logging: Swagger UI / OpenAPI, Log4j. Auth/payments: JWT, OTP Authentication, RBAC, Razorpay. Forms: React Hook Form, Zod. Testing: Jest, React Testing Library, Vitest, MSW, Postman, Chrome DevTools, React Profiler, Lighthouse. DevOps: Git, GitHub, Bitbucket, Docker, Nginx, PM2, Let's Encrypt, VPS Deployment, Linux Ubuntu. Tools/practices: Jira, Figma, VS Code, Agile, Requirement Gathering, UI Prototyping, API Integration, Debugging and Bug Fixing.
No duplicate modules per technology. Every resume skill maps to a module and subtopic. Keep a coverage audit so no skill is silently omitted. Add a Skill Coverage Audit in Settings: for the selected role show each resume skill as Covered (and whether it is in the current syllabus).

## 6. Question bank counts
Per module (not per career path): Fresher 0-6 months = 25 questions, Intermediate 1-3 years = 50, Advanced 3+ years = 75-100. Review page shows available count per module and total across the selected syllabus. Never inflate with duplicates or superficial questions. Availability and completion are separate metrics.

## 7. Lesson and content structure
Every module has: overview, prerequisites, learning objectives, lessons, subtopics, practical examples, code examples, diagrams where useful, assignments, exercises, knowledge checks, interview questions, revision checkpoints, learning resources.
Per module derive: totalLessons, totalTopics, estimatedHours, availableQuestions, availableAssignments, completedLessons, completedQuestions. Never hardcode these in the UI; derive from the content catalogue.

## 8. Estimated study time
Realistic per-module estimates from lesson complexity, topic count, practical exercises, coding assignments and revision time. No identical hours for every module. Support different estimates for beginner, fresher, intermediate, advanced. Learner may customise a module's duration.

## 9. Feasibility engine
totalEstimatedMinutes = sum(selected module minutes); dailyAvailableMinutes = learner daily minutes; minimumPreparationDays = ceil(total / daily). Compare with the deadline. If too short show "Your target is ambitious for the selected syllabus." with three options: A extend the deadline, B prioritise core modules, C increase daily study time. NEVER silently remove modules. A priority mode lets the learner prepare essentials first while keeping the full syllabus for later.

## 10. Data architecture (user's suggested types)
```
type ModuleRelevance = "core" | "recommended" | "optional"
type CurriculumModule = { id; domainId; title; description; skillIds: string[]; roleIds: string[]; relevance; prerequisites: string[]; estimatedMinutes: Record<string, number>; lessons: Lesson[]; questionBankIds: string[]; assignmentIds: string[]; topics: Topic[]; version: number }
type RoleCurriculum = { roleId; coreModuleIds; recommendedModuleIds; optionalModuleIds }
type SelectedCurriculumModule = { moduleId; selected: boolean; priority: "high" | "medium" | "low"; customizedMinutes?: number }
```
Stable module ids. Learner selections and progress stored in IndexedDB through repository abstractions. Seed data in separate files, not inside React components.

## 11. Shared module progress
A shared module has ONE canonical progress record. Example: Git shared by Java FS, MERN, Python, Frontend: completing it under one role shows completed under all. No duplicated role-specific vs shared progress.

## 12. Visual design
Keep the dark-first design. Background #18181B, card #232326, accent #EAFE7C, text #FAFAFA, secondary #A1A1AA, border #3F3F46, technical accent #22D3EE. React, TS, Vite, Tailwind, shadcn/ui, Radix, Lucide. Restrained colour, compact density, professional technical planner look, not a generic AI dashboard.

## 13. Tests required
Every role's module mapping; shared module detection; duplicate module prevention; select; deselect; dynamic hours; dynamic lesson counts; question counts; target feasibility; priority mode; persistence after refresh; multiple selected roles; migration of existing learner progress; no fabricated totals or hardcoded module counts on the review screen.

## 14. Rules
Inspect first; reuse current onboarding and review components; preserve learner data; do not rebuild unrelated pages; keep the shadcn preset; no backend; no dead controls; no hardcoded totals; no duplicated shared modules; validate all estimates; complete functionality not just UI; run tests and typecheck.

## 15. Definition of done
Review page shows the complete relevant syllabus; shared foundation present; role modules correctly mapped; resume skills fully covered; each module inspectable; optional modules customisable; lesson and question counts displayed; time calculated dynamically; feasibility accurate; shared progress maintained; the final "Start Preparing" button launches the selected curriculum; everything survives a browser refresh. Begin with a concise impact analysis before implementing.
