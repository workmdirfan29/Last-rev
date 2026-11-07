# LastRev 🚀
> **Local-First, Privacy-Centric Career Preparation & Interview Readiness Platform**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Storage](https://img.shields.io/badge/Storage-IndexedDB%20(Dexie)-success.svg)](https://dexie.org/)
[![Tests](https://img.shields.io/badge/Tests-Vitest-yellow.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

**LastRev** is a production-grade, local-first web application designed for comprehensive technical interview preparation and career readiness. Running entirely in the browser with **zero backend servers**, it ensures 100% user data privacy, sub-10ms offline query latencies, and zero infrastructure costs.

---

## 🗺️ 1. High-Level System Architecture

The application decouples the presentation layer from the persistence layer through a clean Repository Pattern and a write-through reactive state store.

```mermaid
flowchart TD
    subgraph UI_Layer["🖥️ Presentation Layer (React 19 + Tailwind v4)"]
        UI_Components["shadcn/ui + Radix Primitives + Lucide Icons"]
        Views["Dashboard | Interview Zone | Study Path | Linux Sandbox | Mock Simulator"]
    end

    subgraph State_Layer["⚡ State & Orchestration Layer"]
        ZustandStore["Zustand Store (Reactive Client State)"]
        ReactQuery["TanStack Query (Async Task Management)"]
        ZodValidator["Zod Schemas (Runtime Schema Validation)"]
    end

    subgraph Engine_Layer["⚙️ Core Algorithmic Engines"]
        VFSEngine["Linux Virtual File System & Bash Sandbox"]
        ReadinessEngine["Readiness Model (60% Comp + 40% Conf)"]
        RevisionEngine["Spaced Repetition Scheduler (SM-2)"]
        PDFParser["pdfjs-dist (Client-Side PDF Text Extractor)"]
        JDMapper["Deterministic Skill Gap Matcher"]
    end

    subgraph Storage_Layer["💾 Local-First Persistence Layer"]
        RepoInterface["LearnerRepository Interface"]
        DexieDB["Dexie.js (IndexedDB Local Database)"]
        Backup["Single-Click JSON Backup & Restore"]
    end

    UI_Components --> Views
    Views --> ZustandStore
    Views --> Engine_Layer
    ZustandStore --> RepoInterface
    RepoInterface --> DexieDB
    DexieDB <--> Backup
    ZodValidator -.->|Validates| DexieDB
    ZodValidator -.->|Validates| ZustandStore
```

---

## 🔄 2. Dual Learner Journeys & Route State

Learners can switch between structured roadmap learning and intensive interview preparation without duplicate progress records.

```mermaid
flowchart TD
    Start(["Landing Route (/)"]) --> CheckSetup{"Profile Initialized?"}
    
    CheckSetup -->|No| Choice["Choose Journey (/choose)"]
    CheckSetup -->|Yes| ResumeRoute["Auto-Redirect to Last Mode"]
    
    Choice --> SetupInterview["Interview Prep Wizard (/start/interview)"]
    Choice --> SetupStudy["Study Path Wizard (/start/study)"]
    
    SetupInterview --> InterviewHome["Interview Dashboard (/dashboard)"]
    SetupStudy --> StudyHome["Roadmap Study Hub (/study)"]
    
    ResumeRoute --> InterviewHome
    ResumeRoute --> StudyHome
    
    subgraph InterviewJourney["🎯 Interview Prep Track"]
        InterviewHome --> QuestionBank["Question Bank (80+ Modules)"]
        InterviewHome --> MockSim["Timed Mock Interview (/mock)"]
        InterviewHome --> ResumeAudit["PDF Resume & JD Audit (/resume)"]
    end

    subgraph SharedFeatures["🛠️ Shared Tools & Workspaces"]
        LinuxSim["In-Browser Linux Terminal (/linux)"]
        Library["Saved & Revision Library (/library)"]
        Settings["Syllabus & Target Customizer (/settings)"]
    end

    InterviewJourney <--> SharedFeatures
    StudyHome <--> SharedFeatures
```

---

## 💾 3. Local-First Write-Through Storage Flow

All user interactions render at 60 FPS immediately while persistence operations commit asynchronously in the background.

```mermaid
sequenceDiagram
    autonumber
    actor Learner as User / UI View
    participant Store as Zustand Store
    participant Repo as LearnerRepository
    participant DB as Dexie.js (IndexedDB)
    participant Disk as JSON Backup

    Learner->>Store: Submit Answer / Bookmark / Rate Confidence
    Store-->>Learner: Instant Synchronous UI Update (60 FPS)
    
    Store->>Repo: Asynchronous Write-Through Command
    Repo->>DB: Open Transaction & Commit State
    DB-->>Repo: IndexedDB Acknowledgment (Updated Timestamp)
    
    opt Backup Export
        Learner->>Repo: Export Learner Data
        Repo->>DB: Query Complete Profile & History
        DB-->>Repo: Raw Records
        Repo-->>Learner: Download Signed JSON Backup
    end

    opt Backup Restore
        Learner->>Repo: Upload JSON Backup
        Repo->>DB: Validate Zod Schemas & Bulk Overwrite
        DB-->>Store: Hydrate State
        Store-->>Learner: Re-render UI with Restored Progress
    end
```

---

## 🖥️ 4. In-Browser Linux Terminal Engine (`src/features/linux/engine`)

Executes shell commands entirely within browser memory using an abstract Virtual File System.

```mermaid
flowchart LR
    UserInput["User Bash Command (e.g., cat data.txt | grep 'error')"] --> Lexer["Tokenizer & Lexer (parse.ts)"]
    
    Lexer --> Pipeline["Pipeline Splitter (| pipes & redirects)"]
    
    subgraph ExecutionSandbox["In-Memory Execution Engine (sandbox.ts)"]
        Pipeline --> CmdDispatcher{"Command Dispatcher"}
        
        CmdDispatcher --> FileCmds["VFS Commands (ls, cd, mkdir, rm, chmod)"]
        CmdDispatcher --> TextCmds["Text Tools (grep, cat, head, tail, sort, uniq, wc)"]
        CmdDispatcher --> MathCmds["Calculators (bc, date)"]
        
        FileCmds <--> InMemVFS[("In-Memory VFS (vfs.ts)<br/>Hierarchical Tree & Inodes")]
        TextCmds <--> InMemVFS
    end

    ExecutionSandbox --> OutputFormatter["Stdout / Stderr Stream Formatter"]
    OutputFormatter --> TerminalUI["Virtual Terminal Component"]
```

---

## 📄 5. Client-Side Resume Parsing & Skill Gap Engine (`src/features/resume`)

Extracts resume text and compares candidate competencies against target job descriptions with zero server uploads.

```mermaid
flowchart TD
    UserResume["Candidate PDF Resume"] --> WebWorker["pdfjs-dist Web Worker (In-Browser)"]
    
    WebWorker --> RawTextStream["Extracted Text Stream"]
    
    RawTextStream --> Tokenizer["Tokenization & Heuristic Extractor"]
    
    subgraph MatchingEngine["Local Skill Matching Engine"]
        Tokenizer --> RegexMatcher["Regex Pattern Matching"]
        Taxonomy[("80+ Domain Skill Ontology<br/>React, Java, Docker, K8s, Python...")] --> RegexMatcher
        RegexMatcher --> CandidateSkills["Detected Candidate Skills"]
        
        JobDescription["Target Job Description Text"] --> JDExtractor["JD Keyword Analyzer"]
        JDExtractor --> JDSkills["Required Role Skills"]
        
        CandidateSkills --> DiffEngine{"Skill Gap Comparator"}
        JDSkills --> DiffEngine
    end

    DiffEngine --> CoverageReport["Coverage Audit: Matched vs Missing Skills"]
    CoverageReport --> CustomPlan["Generate Targeted Question Prep List"]
```

---

## 🧠 6. Deterministic Readiness & Spaced Repetition Formula

Readiness balances factual curriculum coverage with candid self-assessed confidence.

```mermaid
flowchart TD
    subgraph DataInputs["Learner Performance Metrics"]
        TotalQ["Available Module Questions (T)"]
        DoneQ["Completed Questions (C)"]
        Ratings["Sum of Confidence Ratings 1 to 5 (R)"]
    end

    subgraph FormulaEngine["Readiness Model Engine"]
        DoneQ & TotalQ --> CompRatio["Completion Ratio = C / T"]
        Ratings & TotalQ --> ConfRatio["Confidence Ratio = R / (5 × T)"]
        
        CompRatio --> WeightComp["60% Weightage"]
        ConfRatio --> WeightConf["40% Weightage"]
        
        WeightComp & WeightConf --> AreaScore["Area Score = (0.6 × Completion) + (0.4 × Confidence)"]
    end

    AreaScore --> OverallMetric["Overall Readiness Score (0 - 100%)"]
    
    OverallMetric --> Scheduler{"Spaced Repetition Scheduler"}
    Scheduler -->|Confidence = 1-2| Interval1["Review in 1 Day"]
    Scheduler -->|Confidence = 3| Interval2["Review in 3 Days"]
    Scheduler -->|Confidence = 4-5| Interval3["Review in 7 Days"]
```

---

## 📦 7. Content Scalability & Code-Splitting

80+ modules are dynamically partitioned into lightweight chunks to guarantee instant initial page loads.

```mermaid
flowchart TD
    RepoCatalog["src/data/questions/ (80+ Modules)"] --> BuildScript["Build Script (generate-content-index.ts)"]
    
    BuildScript --> LightIndex["index.generated.ts<br/>(Lightweight IDs, Titles, Topics, Tags)"]
    BuildScript --> ModuleChunks["import.meta.glob Lazy Chunks<br/>(react.js, java.js, docker.js...)"]
    
    LightIndex --> AppBoot["App Bootstrap (<200 KB Initial Bundle)"]
    AppBoot --> QuickSearch["⌘K Command Palette (Instant Global Search)"]
    
    QuickSearch --> UserSelect["User Selects Module"]
    UserSelect --> LazyLoad["On-Demand Chunk Fetch (0 latency overhead)"]
    ModuleChunks -.->|Loaded on Demand| LazyLoad
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Tools & Libraries | Architectural Purpose |
|---|---|---|
| **Core Framework** | React 19, TypeScript, Vite 8 | Strict typing, sub-second HMR, and modern concurrent features |
| **Design System** | Tailwind CSS v4, shadcn/ui (Radix UI), Lucide Icons | Accessible (WCAG 2.1 AA), responsive, themeable UI |
| **Data Visuals** | Recharts | Dynamic readiness and syllabus completion charts |
| **State Management** | Zustand, TanStack Query, React Router v8 | Single source of truth with write-through cache abstraction |
| **Local Storage** | Dexie.js (IndexedDB wrapper) | Client-side transactions, zero-cost data persistence |
| **Parsing & Rules** | Zod, `pdfjs-dist`, React Hook Form | Runtime data contracts and in-browser PDF stream extraction |
| **Quality & Tests** | Vitest, React Testing Library, Axe-Core | Automated unit tests and accessibility verification |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 20.x
- **pnpm** >= 9.x

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/last-rev.git
cd last-rev

# 2. Install dependencies
pnpm install

# 3. Start local development server (indexes content automatically)
pnpm dev
```

### Verification & Testing

```bash
# Run typechecks, linters, and unit tests
pnpm check

# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

---

## 📁 Repository Structure

```
src/
├── app/            # Application router, layouts, navigation registry
├── components/     # UI primitives (shadcn), shared widgets, navigation bars
├── data/           # 80+ engineering modules, roadmaps, and question banks
├── features/       # Modular business domains:
│   ├── dashboard/   # Daily targets, streak tracking, readiness summaries
│   ├── interview/   # Question bank, module browser, bookmarking
│   ├── linux/       # In-browser virtual bash shell, VFS, and exercises
│   ├── mock/        # Timed mock interview simulator and rating panels
│   ├── resume/      # Client-side PDF parser and skill coverage auditor
│   ├── job-match/   # Job description keyword and skill gap analysis
│   └── study/       # Structured syllabus roadmaps and time-planning models
├── services/       # Core business logic (analytics, revision, storage, curriculum)
├── stores/         # Zustand store with write-through persistence
└── types/          # Zod schemas and inferred TypeScript types
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).
