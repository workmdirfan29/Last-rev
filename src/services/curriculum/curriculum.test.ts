import { computeCategoryReadiness } from "@/services/readiness/categories"
import { learnerModuleIds } from "@/services/readiness/learner-modules"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { describe, expect, it } from "vitest"
import { DOMAIN_IDS } from "@/data/catalog/module-types"
import { HR_MODULE_IDS } from "@/data/catalog/modules/hr"
import { MODULES, MODULE_BY_ID } from "@/data/catalog/modules"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import { ROLES } from "@/data/catalog/roles"
import { RELEVANCE_ROWS, ROLE_ORDER } from "@/data/curriculum/role-relevance"
import { RESUME_SKILL_IDS } from "@/data/curriculum/resume-skills"
import {
  SKILLS,
  SKILL_BY_ID,
  SKILL_GROUPS,
  skillResolves,
  skillsForModule,
} from "@/data/curriculum/skills"
import {
  EXPERIENCE_MULTIPLIER,
  PRACTICE_REVISION_ALLOWANCE,
} from "@/data/curriculum/time-model"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { buildSummary } from "@/services/analytics/summary"
import { learnerProfileSchema, type QuestionProgress } from "@/types/learner"
import { questionsIn } from "@/test/content-counts"
import { skillCoverage } from "./coverage"
import { AMBITIOUS_MESSAGE, assessFeasibility } from "./feasibility"
import {
  moduleQuestionStats,
  QUESTION_TARGETS,
  questionStatsLookup,
} from "./progress"
import {
  defaultsForRoadmap,
  defaultsForRoles,
  moduleIdsForRoles,
  orderedModuleIds,
  tierForExperience,
} from "./relevance"
import { legacySkills, migrateKnownSkills } from "./skills-migration"
import {
  prepareCoreFirst,
  resolveSyllabus,
  restorePriorities,
  selectedModuleIds,
  setCustomMinutes,
  setSelected,
} from "./syllabus"
import { summarize } from "./summary"
import { moduleMinutes, topicMinutes } from "./time"

/** The module lists the roles had before relevance tiers existed, kept to prove nothing disappears. */
const LEGACY_ROLE_MODULES: Record<string, string[]> = {
  "java-full-stack": [
    "java-core",
    "java-oop",
    "java-collections",
    "java-exceptions",
    "java-multithreading",
    "java-8-plus",
    "jvm-memory",
    "sql",
    "postgresql",
    "jdbc",
    "hibernate-jpa",
    "spring-framework",
    "spring-boot",
    "spring-mvc",
    "authentication",
    "rest-apis",
    "microservices",
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "react-hooks",
    "git",
    "docker",
    "linux",
    "testing",
    "system-design",
    "project-questions",
  ],
  "java-mern-full-stack": [
    "java-core",
    "java-oop",
    "java-collections",
    "spring-boot",
    "hibernate-jpa",
    "sql",
    "javascript",
    "typescript",
    "react",
    "react-hooks",
    "state-management",
    "nodejs",
    "express",
    "mongodb",
    "rest-apis",
    "authentication",
    "docker",
    "git",
    "linux",
    "system-design",
    "project-questions",
  ],
  "java-developer": [
    "java-core",
    "java-oop",
    "java-collections",
    "java-exceptions",
    "java-multithreading",
    "java-8-plus",
    "jvm-memory",
    "sql",
    "jdbc",
    "hibernate-jpa",
    "spring-framework",
    "spring-boot",
    "spring-mvc",
    "rest-apis",
    "microservices",
    "dsa",
    "git",
    "linux",
    "testing",
    "system-design",
    "project-questions",
  ],
  "python-developer": [
    "python-fundamentals",
    "python-data-structures",
    "python-oop",
    "python-advanced",
    "python-exceptions-files",
    "python-concurrency",
    "python-async",
    "python-internals",
    "django",
    "fastapi",
    "rest-apis",
    "sql",
    "postgresql",
    "mongodb",
    "testing",
    "docker",
    "linux",
    "dsa",
    "system-design",
    "project-questions",
  ],
  "data-science": [
    "python-fundamentals",
    "python-data-science",
    "data-visualization",
    "statistics",
    "machine-learning",
    "deep-learning-nlp",
    "sql",
    "project-questions",
  ],
  "mern-stack": [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "react-hooks",
    "react-router",
    "state-management",
    "nodejs",
    "express",
    "mongodb",
    "rest-apis",
    "authentication",
    "web-security",
    "frontend-performance",
    "testing",
    "docker",
    "nginx",
    "linux",
    "git",
    "system-design",
    "project-questions",
  ],
  "frontend-developer": [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "react-hooks",
    "react-router",
    "state-management",
    "frontend-performance",
    "web-security",
    "testing",
    "git",
    "dsa",
    "system-design",
    "project-questions",
  ],
  "full-stack": [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "react-hooks",
    "nodejs",
    "express",
    "sql",
    "postgresql",
    "rest-apis",
    "authentication",
    "web-security",
    "git",
    "docker",
    "linux",
    "testing",
    "dsa",
    "system-design",
    "project-questions",
  ],
  "ai-engineer": [
    "python-fundamentals",
    "python-async",
    "fastapi",
    "rest-apis",
    "sql",
    "llm-apis",
    "rag-agents",
    "machine-learning",
    "docker",
    "linux",
    "system-design",
    "project-questions",
  ],
}

const tierOf = (roleId: string, moduleId: string) =>
  defaultsForRoles([roleId]).get(moduleId)
const has = (roleId: string, ids: string[], ...tiers: string[]) =>
  ids.every((id) => tiers.includes(tierOf(roleId, id) ?? "none"))
const none = (roleId: string, ids: string[]) =>
  ids.every((id) => tierOf(roleId, id) === undefined)

describe("catalogue", () => {
  it("has one module per technology with unique ids, and every domain is used", () => {
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length)
    expect(MODULES.filter((m) => !m.id.startsWith("resume-"))).toHaveLength(103) // 83 technical modules + the 20 HR interview categories
    for (const d of DOMAIN_IDS)
      expect(
        MODULES.some((m) => m.domainId === d),
        d
      ).toBe(true)
  })

  it("derives topics, hours and totals from per-topic minutes, with no hand-typed totals", () => {
    for (const m of MODULES) {
      // resume modules are generated question sets with one practice topic
      if (!m.id.startsWith("resume-"))
        expect(m.topicList.length, m.id).toBeGreaterThanOrEqual(3)
      expect(
        new Set(m.topicList.map((t) => t.title)).size,
        `${m.id} topic titles`
      ).toBe(m.topicList.length)
      for (const t of m.topicList)
        expect(t.minutes, `${m.id}/${t.title}`).toBeGreaterThan(0)
      expect(m.topics).toEqual(m.topicList.map((t) => t.title))
      expect(m.estimatedStudyHours).toBe(
        Math.round((topicMinutes(m) * (1 + PRACTICE_REVISION_ALLOWANCE)) / 60)
      )
    }
  })

  it("does not give every module the same hours or the same topic minutes", () => {
    expect(
      new Set(MODULES.map((m) => m.estimatedStudyHours)).size
    ).toBeGreaterThan(10)
    expect(
      new Set(MODULES.flatMap((m) => m.topicList.map((t) => t.minutes))).size
    ).toBeGreaterThan(8)
  })

  it("keeps every existing module id and every existing question id valid", () => {
    for (const q of QUESTION_INDEX) {
      const m = MODULE_BY_ID.get(q.moduleId)
      expect(m, q.id).toBeDefined()
      // HR questions are filed by theme, not by the three study steps of their category.
      if (!q.moduleId.startsWith("hr-"))
        expect(
          m!.topics,
          `${q.id}: topic "${q.topic}" is in module ${q.moduleId}`
        ).toContain(q.topic)
    }
    for (const id of Object.values(LEGACY_ROLE_MODULES).flat())
      expect(MODULE_BY_ID.has(id), id).toBe(true)
  })

  it("lists exactly the lessons that exist, and no assignments or projects until they exist", () => {
    for (const m of MODULES) {
      expect(m.lessons.map((l) => l.id)).toEqual(
        LESSON_INDEX.filter((l) => l.moduleId === m.id)
          .sort((a, b) => a.order - b.order)
          .map((l) => l.id)
      )
      expect(m.assignmentIds).toEqual([])
      expect(m.projectIds).toEqual([])
    }
  })

  it("only references existing prerequisites and domains", () => {
    for (const m of MODULES) {
      for (const p of m.prerequisites)
        expect(MODULE_BY_ID.has(p), `${m.id} -> ${p}`).toBe(true)
      for (const d of [m.domainId, ...m.alsoIn]) expect(DOMAIN_IDS).toContain(d)
    }
  })

  it("derives the Linux Command Mastery topics from the Linux library categories", () => {
    const m = MODULE_BY_ID.get("linux-commands")!
    expect(m.topicList.length).toBeGreaterThanOrEqual(15)
    expect(m.topics).toContain("Text processing")
  })
})

describe("role relevance table", () => {
  it("has one letter per role for known modules only, and no duplicate rows", () => {
    for (const [id, row] of Object.entries(RELEVANCE_ROWS)) {
      expect(MODULE_BY_ID.has(id), id).toBe(true)
      expect(row, id).toMatch(new RegExp(`^[CRO-]{${ROLE_ORDER.length}}$`))
    }
    expect(Object.keys(RELEVANCE_ROWS).length).toBe(
      new Set(Object.keys(RELEVANCE_ROWS)).size
    )
  })

  it("gives every role the shared foundation as core", () => {
    for (const role of ROLES)
      expect(
        has(
          role.id,
          ["linux", "networking", "http", "git", "testing", "debugging"],
          "core"
        ),
        role.id
      ).toBe(true)
  })

  it("never lists a module twice for a role", () => {
    for (const role of ROLES) {
      const ids = moduleIdsForRoles([role.id])
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it("keeps every module an existing role could browse (nothing disappears)", () => {
    for (const role of ROLES) {
      const now = new Set(moduleIdsForRoles([role.id]))
      for (const id of LEGACY_ROLE_MODULES[role.id])
        expect(now.has(id), `${role.id} lost ${id}`).toBe(true)
    }
  })

  it("rule 3: Java + MERN has both stacks", () => {
    expect(
      has(
        "java-mern-full-stack",
        [
          "java-core",
          "spring-boot",
          "hibernate-jpa",
          "nodejs",
          "express",
          "mongodb",
        ],
        "core"
      )
    ).toBe(true)
  })

  it("rule 5: Frontend has no Spring or Java and is not forced into a backend", () => {
    expect(
      none("frontend-developer", [
        "spring-boot",
        "spring-framework",
        "hibernate-jpa",
        "java-core",
        "mongodb",
        "express",
        "nodejs",
      ])
    ).toBe(true)
  })

  it("rule 6: Java Developer has no Mongo, Express or Node", () => {
    expect(none("java-developer", ["mongodb", "express", "nodejs"])).toBe(true)
  })

  it("rule 7: React Native is optional unless a role needs mobile, and never core", () => {
    for (const role of ROLES)
      expect(tierOf(role.id, "react-native")).not.toBe("core")
    expect(tierOf("frontend-developer", "react-native")).toBe("optional")
  })

  it("rule 8: AI Engineer has the AI modules as core", () => {
    expect(
      has(
        "ai-engineer",
        ["ai-fundamentals", "llm-apis", "rag-agents", "ai-production"],
        "core"
      )
    ).toBe(true)
  })

  it("rule 4: Data Science has Python, statistics, ETL and the data subjects as core", () => {
    expect(
      has(
        "data-science",
        [
          "python-fundamentals",
          "python-data-science",
          "statistics",
          "machine-learning",
          "etl",
          "sql",
          "postgresql",
        ],
        "core"
      )
    ).toBe(true)
  })

  it("Python Developer has no core frontend module (the matrix's Python FS column is the roadmap and Full Stack)", () => {
    for (const m of MODULES.filter((x) => x.domainId === "frontend"))
      expect(tierOf("python-developer", m.id), m.id).not.toBe("core")
    expect(tierOf("python-developer", "javascript")).toBe("recommended")
    for (const id of ["html", "css", "typescript", "react", "react-hooks"])
      expect(tierOf("python-developer", id)).toBe("optional")
  })

  it("matches the learner's matrix for Java FS, Java+MERN, MERN and Data Science", () => {
    const fe = ["html", "css", "javascript", "typescript", "react"]
    for (const r of ["java-full-stack", "java-mern-full-stack", "mern-stack"])
      expect(has(r, fe, "core"), r).toBe(true)
    expect(has("data-science", fe, "optional")).toBe(true)
    expect(
      has(
        "java-full-stack",
        ["java-core", "spring-boot", "hibernate-jpa"],
        "core"
      )
    ).toBe(true)
    expect(has("mern-stack", ["java-core"], "optional")).toBe(true)
    expect(
      none("data-science", [
        "java-core",
        "spring-boot",
        "hibernate-jpa",
        "nodejs",
        "express",
      ])
    ).toBe(true)
    expect(
      has("java-full-stack", ["postgresql"], "core") &&
        has("java-mern-full-stack", ["postgresql"], "core") &&
        has("data-science", ["postgresql"], "core")
    ).toBe(true)
    expect(tierOf("mern-stack", "postgresql")).toBe("optional")
    expect(
      has("java-mern-full-stack", ["nodejs", "express", "mongodb"], "core") &&
        has("mern-stack", ["nodejs", "express", "mongodb"], "core")
    ).toBe(true)
    expect(none("java-full-stack", ["nodejs", "express"])).toBe(true)
    expect(tierOf("java-full-stack", "mongodb")).toBe("optional")
    expect(has("data-science", ["python-fundamentals"], "core")).toBe(true)
    for (const r of ["java-full-stack", "java-mern-full-stack", "mern-stack"])
      expect(tierOf(r, "python-fundamentals")).toBe("optional")
    for (const r of ["java-full-stack", "java-mern-full-stack", "mern-stack"])
      expect(has(r, ["docker", "ci-cd", "aws"], "core")).toBe(true)
    expect(has("data-science", ["docker", "ci-cd", "aws"], "optional")).toBe(
      true
    )
    expect(tierOf("data-science", "etl")).toBe("core")
    expect(tierOf("java-full-stack", "etl")).toBe("optional")
  })

  it("for several roles, relevance is the strongest and a module is core if core for any", () => {
    const both = defaultsForRoles(["frontend-developer", "java-developer"])
    expect(both.get("react")).toBe("core") // core for Frontend, optional for Java Developer
    expect(both.get("spring-boot")).toBe("core")
    expect(both.get("html")).toBe("core")
    expect(both.get("react-native")).toBe("optional")
    const ids = orderedModuleIds(both)
    expect(new Set(ids).size).toBe(ids.length)
    // tier order: all core before any recommended before any optional
    const ranks = ids.map(
      (id) => ({ core: 0, recommended: 1, optional: 2 })[both.get(id)!]
    )
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
  })
})

describe("roadmaps follow the same rules as roles", () => {
  const has2 = (r: string, ids: string[], ...t: string[]) =>
    ids.every((id) => t.includes(defaultsForRoadmap(r).get(id) ?? "none"))
  const none2 = (r: string, ids: string[]) =>
    ids.every((id) => !defaultsForRoadmap(r).has(id))

  it("never include interview-only modules", () => {
    for (const r of ROADMAPS)
      expect(defaultsForRoadmap(r.id).has("project-questions"), r.id).toBe(
        false
      )
  })

  it("every roadmap has the foundation and the AI modules", () => {
    for (const r of ROADMAPS) {
      expect(
        has2(r.id, ["linux", "networking", "http", "git", "testing"], "core"),
        r.id
      ).toBe(true)
      expect(has2(r.id, ["llm-apis", "rag-agents"], "core"), r.id).toBe(true)
    }
  })

  it("Java roadmap has the Java stack and no Node core; MERN has Node and no Spring; Python has Python and neither", () => {
    expect(
      has2(
        "java-full-stack-ai",
        ["java-core", "spring-boot", "hibernate-jpa"],
        "core"
      )
    ).toBe(true)
    expect(none2("java-full-stack-ai", ["nodejs", "express"])).toBe(true)
    expect(
      has2(
        "mern-full-stack-ai",
        ["nodejs", "express", "mongodb", "react"],
        "core"
      )
    ).toBe(true)
    expect(none2("mern-full-stack-ai", ["spring-boot", "hibernate-jpa"])).toBe(
      true
    )
    expect(
      has2(
        "python-full-stack-ai",
        ["python-fundamentals", "fastapi", "postgresql", "react", "typescript"],
        "core"
      )
    ).toBe(true)
    expect(
      none2("python-full-stack-ai", ["nodejs", "express", "spring-boot"])
    ).toBe(true)
    expect(has2("python-full-stack-ai", ["java-core"], "optional")).toBe(true)
    expect(has2("python-full-stack-ai", ["mongodb"], "optional")).toBe(true)
  })
})

describe("syllabus resolution", () => {
  const defaults = defaultsForRoles(["frontend-developer"])
  const resolve = (
    overrides = {},
    experience: "fresher" | "advanced" = "fresher"
  ) => resolveSyllabus({ defaults, overrides, experience })
  const entry = (list: ReturnType<typeof resolve>, id: string) =>
    list.find((e) => e.module.id === id)!

  it("selects core and recommended by default; optional and outside modules are off", () => {
    const list = resolve()
    expect(entry(list, "react")).toMatchObject({
      tier: "core",
      core: true,
      selected: true,
    })
    expect(entry(list, "tanstack-query")).toMatchObject({
      tier: "recommended",
      core: false,
      selected: true,
    })
    expect(entry(list, "react-native")).toMatchObject({
      tier: "optional",
      selected: false,
    })
    expect(entry(list, "spring-boot")).toMatchObject({
      tier: null,
      selected: false,
    })
  })

  it("lets a learner select an optional module and deselect a recommended one, storing only deviations", () => {
    let o = setSelected({}, entry(resolve(), "react-native"), true)
    expect(o).toEqual({ "react-native": { selected: true } })
    o = setSelected(o, entry(resolve(o), "tanstack-query"), false)
    expect(entry(resolve(o), "react-native").selected).toBe(true)
    expect(entry(resolve(o), "tanstack-query").selected).toBe(false)
    // choosing the default again removes the override
    expect(setSelected(o, entry(resolve(o), "tanstack-query"), true)).toEqual({
      "react-native": { selected: true },
    })
  })

  it("lets a learner remove a core module, restores it exactly, and counts it out while removed", () => {
    const before = selectedMinutes(resolve())
    const o = setSelected({}, entry(resolve(), "react"), false)
    expect(o).toEqual({ react: { selected: false } })
    const removed = entry(resolve(o), "react")
    expect(removed).toMatchObject({
      core: true,
      selected: false,
      removed: true,
    })
    expect(selectedMinutes(resolve(o))).toBeLessThan(before)
    expect(selectedModuleIds(["frontend-developer"], o)).not.toContain("react")
    // Restore: the override disappears, so the default comes back untouched.
    expect(setSelected(o, removed, true)).toEqual({})
    expect(
      entry(resolve(setSelected(o, removed, true)), "react").selected
    ).toBe(true)
  })

  it("an optional module that was never selected is not 'removed'", () => {
    expect(entry(resolve(), "react-native")).toMatchObject({
      selected: false,
      removed: false,
    })
  })

  it("recomputes hours when the selection, experience or a custom figure changes", () => {
    const base = selectedMinutes(resolve())
    const withMobile = selectedMinutes(
      resolve({ "react-native": { selected: true } })
    )
    expect(withMobile).toBeGreaterThan(base)
    expect(selectedMinutes(resolve({}, "advanced"))).toBeLessThan(base)
    const m = MODULE_BY_ID.get("react")!
    expect(entry(resolve(), "react").minutes).toBe(moduleMinutes(m, "fresher"))
    expect(
      entry(resolve(setCustomMinutes({}, "react", 600)), "react")
    ).toMatchObject({ minutes: 600, customized: true })
    expect(
      setCustomMinutes(
        { react: { customizedMinutes: 600 } },
        "react",
        undefined
      )
    ).toEqual({})
    expect(EXPERIENCE_MULTIPLIER.advanced).toBeLessThan(
      EXPERIENCE_MULTIPLIER.beginner
    )
  })

  it("Prepare core first defers non-core modules without removing any, and Restore undoes it", () => {
    const all = resolve({ "react-native": { selected: true } })
    const before = all.filter((e) => e.selected).length
    const deferredOverrides = prepareCoreFirst(
      { "react-native": { selected: true } },
      all
    )
    const after = resolve(deferredOverrides)
    expect(after.filter((e) => e.selected).length).toBe(before) // still all selected
    expect(after.filter((e) => e.deferred).length).toBeGreaterThan(0)
    expect(after.filter((e) => e.core).every((e) => !e.deferred)).toBe(true)
    const restored = restorePriorities(deferredOverrides)
    expect(restored).toEqual({ "react-native": { selected: true } })
    expect(resolve(restored).some((e) => e.deferred)).toBe(false)
  })

  it("excludes interview-only modules from a study scope and includes them for interview prep", () => {
    const study = resolveSyllabus({
      defaults: defaultsForRoles(["java-full-stack"]),
      overrides: {},
      experience: "fresher",
      scope: "study",
    })
    expect(study.some((e) => e.module.id === "project-questions")).toBe(false)
    const interview = resolveSyllabus({
      defaults: defaultsForRoles(["java-full-stack"]),
      overrides: {},
      experience: "fresher",
    })
    expect(entry(interview, "project-questions")).toMatchObject({
      core: true,
      selected: true,
    })
  })

  it("a learner with no overrides studies exactly core and recommended", () => {
    const ids = selectedModuleIds(["frontend-developer"], {})
    expect(new Set(ids)).toEqual(
      new Set(
        [...defaults]
          .filter(
            ([id, t]) => tierForExperience(id, t, "fresher") !== "optional"
          )
          .map(([id]) => id)
      )
    )
  })
})

const selectedMinutes = (list: ReturnType<typeof resolveSyllabus>) =>
  list.filter((e) => e.selected).reduce((n, e) => n + e.minutes, 0)

describe("summary totals are derived", () => {
  const entries = resolveSyllabus({
    defaults: defaultsForRoles(["frontend-developer"]),
    overrides: {},
    experience: "fresher",
  })
  const lookup = questionStatsLookup(QUESTION_INDEX, {})

  it("counts modules, topics, hours and real questions from data", () => {
    const s = summarize(entries, lookup)
    const selected = entries.filter((e) => e.selected)
    expect(s.modules).toBe(selected.length)
    expect(s.minutes).toBe(selected.reduce((n, e) => n + e.minutes, 0))
    expect(s.topics).toBe(
      selected.reduce((n, e) => n + e.module.topicList.length, 0)
    )
    // lessons are counted from the modules, never invented: zero shows as "in preparation"
    expect(s.lessons).toBe(
      selected.reduce((n, e) => n + e.module.lessons.length, 0)
    )
    expect(s.assignments).toBe(0)
    const real = QUESTION_INDEX.filter((q) =>
      selected.some((e) => e.module.id === q.moduleId)
    ).length
    expect(s.questions.total).toBe(real)
    expect(s.questionTargets.fresher).toBe(
      selected.length * QUESTION_TARGETS.fresher
    )
    expect(s.questions.total).toBeLessThan(s.questionTargets.fresher) // a target is never presented as available
  })

  it("splits the selection into foundation, role-specific and optional groups that add up", () => {
    const withOptional = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: { "react-native": { selected: true } },
      experience: "fresher",
    })
    const s = summarize(withOptional, lookup)
    expect(
      s.groups.foundation.modules +
        s.groups.roleSpecific.modules +
        s.groups.optional.modules
    ).toBe(s.modules)
    expect(s.groups.optional.modules).toBeGreaterThan(0)
  })

  it("keeps deferred modules out of the minutes but still reports them", () => {
    const deferred = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: prepareCoreFirst({}, entries),
      experience: "fresher",
    })
    const s = summarize(deferred, lookup)
    expect(s.deferredModules).toBeGreaterThan(0)
    expect(s.minutes + s.deferredMinutes).toBe(
      summarize(entries, lookup).minutes
    )
    expect(s.modules).toBe(summarize(entries, lookup).modules)
  })
})

describe("question availability and shared progress", () => {
  it("reports real availability per level next to the targets, separate from completion", () => {
    const stats = moduleQuestionStats("react", QUESTION_INDEX, {})
    expect(stats.available).toBe(questionsIn("react").length)
    expect(stats.byLevel.fresher).toMatchObject({
      available: questionsIn("react", "fresher").length,
      completed: 0,
      target: 25,
    })
    expect(stats.byLevel.intermediate).toMatchObject({
      available: questionsIn("react", "intermediate").length,
      target: 50,
    })
    expect(stats.byLevel.advanced).toMatchObject({
      available: questionsIn("react", "advanced").length,
      target: 75,
    })
  })

  it("a shared module has one progress record, shown the same under every role", () => {
    const id = "react.fresher.keys-in-lists"
    const progress = {
      [id]: { questionId: id, completed: true } as QuestionProgress,
    }
    const forFrontend = moduleQuestionStats("react", QUESTION_INDEX, progress)
    const forFullStack = moduleQuestionStats("react", QUESTION_INDEX, progress)
    expect(forFrontend).toEqual(forFullStack)
    expect(forFrontend.completed).toBe(1)
    expect(
      defaultsForRoles(["frontend-developer"]).has("react") &&
        defaultsForRoles(["full-stack"]).has("react")
    ).toBe(true)
    // git is shared by every role: the same single record counts for all of them
    expect(
      ROLES.every((r) => defaultsForRoles([r.id]).get("git") === "core")
    ).toBe(true)
  })
})

describe("readiness is scoped to the effective syllabus", () => {
  // Data-driven: which modules have questions grows as content is released, so the modules in and out of scope
  // are derived from the catalogue at run time. The learner has fully done every module of the Data Science
  // syllabus that has questions; one optional module that has questions is the one they did not choose.
  const hasQuestions = (id: string) =>
    QUESTION_INDEX.some((q) => q.moduleId === id)
  const tiers = [...defaultsForRoles(["data-science"]).entries()]
  const inScopeIds = tiers
    .filter(
      ([id, t]) =>
        t !== "optional" && !HR_MODULE_IDS.includes(id) && hasQuestions(id)
    )
    .map(([id]) => id)
  const optionalId = tiers.find(
    ([id, t]) => t === "optional" && hasQuestions(id)
  )?.[0]
  const doneIds = QUESTION_INDEX.filter((q) =>
    inScopeIds.includes(q.moduleId)
  ).map((q) => q.id)
  const progress = Object.fromEntries(
    doneIds.map((id) => [
      id,
      {
        questionId: id,
        completed: true,
        confidence: 5,
        bookmarked: false,
        difficult: false,
        revision: false,
        note: "",
        attempts: 1,
        revisionStage: 0,
        nextReviewAt: null,
        completedAt: null,
        removed: false,
        lastStudiedAt: null,
        updatedAt: "2026-11-02T00:00:00.000Z",
      } satisfies QuestionProgress,
    ])
  )
  // HR categories are core/recommended for every role, so they count in readiness like any module; this
  // scenario is about technical modules, so it takes them out of the syllabus.
  const noHr = Object.fromEntries(
    HR_MODULE_IDS.map((id) => [id, { selected: false }])
  )
  const profile = (overrides = {}) =>
    learnerProfileSchema.parse({
      updatedAt: "2026-11-02T00:00:00.000Z",
      selectedRoles: ["data-science"],
      primaryRole: "data-science",
      syllabusOverrides: { ...noHr, ...overrides },
    })

  it("an optional module the learner did not choose does not dilute readiness", () => {
    expect(optionalId).toBeDefined() // some optional module has questions
    expect(tierOf("data-science", optionalId!)).toBe("optional")
    const scoped = buildSummary({
      profile: profile(),
      progress,
      activity: [],
      index: QUESTION_INDEX,
    })
    expect(scoped.modules.map((m) => m.moduleId).sort()).toEqual(
      [...inScopeIds].sort()
    )
    expect(scoped.modules.map((m) => m.moduleId)).not.toContain(optionalId)
    const readiness = (p: ReturnType<typeof profile>) =>
      computeCategoryReadiness({
        selectedModules: learnerModuleIds(p),
        index: QUESTION_INDEX,
        progress,
        lessons: [],
        attempts: [],
        mockSessions: [],
        english: null,
        hrAnswers: [],
        excluded: [],
      })
    expect(readiness(profile()).overall).toBe(100)

    // choosing it deliberately does count it
    const chosen = buildSummary({
      profile: profile({ [optionalId!]: { selected: true } }),
      progress,
      activity: [],
      index: QUESTION_INDEX,
    })
    expect(chosen.modules.map((m) => m.moduleId)).toContain(optionalId)
    expect(
      readiness(profile({ [optionalId!]: { selected: true } })).overall!
    ).toBeLessThan(100)
  })
})

describe("feasibility engine", () => {
  it("computes the minimum days and the three options from real numbers", () => {
    const r = assessFeasibility({
      totalMinutes: 12_000,
      coreMinutes: 7_000,
      dailyMinutes: 120,
      targetDays: 60,
    })
    expect(r.minimumDays).toBe(100)
    expect(r.fits).toBe(false)
    expect(r.shortfallDays).toBe(40)
    expect(r.options.extendDays).toBe(100)
    expect(r.options.coreFirst).toEqual({
      minutes: 7_000,
      minimumDays: 59,
      fits: true,
    })
    expect(r.options.dailyMinutesNeeded).toBe(200)
    expect(r.options.extraMinutesPerDay).toBe(80)
    expect(AMBITIOUS_MESSAGE).toBe(
      "Your target is ambitious for the selected syllabus."
    )
  })

  it("fits when the days needed do not exceed the deadline, and handles no deadline or no daily time", () => {
    expect(
      assessFeasibility({
        totalMinutes: 6_000,
        coreMinutes: 3_000,
        dailyMinutes: 120,
        targetDays: 50,
      }).fits
    ).toBe(true)
    expect(
      assessFeasibility({
        totalMinutes: 6_000,
        coreMinutes: 3_000,
        dailyMinutes: 120,
        targetDays: null,
      }).fits
    ).toBe(true)
    expect(
      assessFeasibility({
        totalMinutes: 6_000,
        coreMinutes: 3_000,
        dailyMinutes: 0,
        targetDays: 30,
      }).minimumDays
    ).toBeNull()
  })
})

describe("skills", () => {
  it("every skill maps to an existing module and topic, and no skill is orphaned", () => {
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length)
    expect(new Set(SKILLS.map((s) => s.title.toLowerCase())).size).toBe(
      SKILLS.length
    )
    for (const s of SKILLS)
      expect(skillResolves(s), `${s.id} -> ${s.moduleId}/${s.topic}`).toBe(true)
    const derived = MODULES.flatMap((m) => skillsForModule(m.id))
    expect(derived.length).toBe(SKILLS.length) // module.skillIds derivation covers every skill exactly once
  })

  it("covers every resume skill in the spec (section 5)", () => {
    const resume = [
      "JavaScript ES6+",
      "TypeScript",
      "Java",
      "SQL",
      "HTML5",
      "CSS3",
      "React.js",
      "React Hooks",
      "React Router",
      "Tailwind CSS",
      "shadcn/ui",
      "Responsive Design",
      "Recharts",
      "SPA",
      "Component Architecture",
      "Redux Toolkit",
      "Zustand",
      "TanStack Query",
      "React Native",
      "Expo",
      "EAS Build",
      "React Navigation",
      "Android",
      "Google Play Console",
      "Node.js",
      "Express.js",
      "Spring Boot",
      "Hibernate",
      "JPA",
      "REST APIs",
      "Controller-Service-Repository",
      "PostgreSQL",
      "MongoDB",
      "Swagger UI",
      "OpenAPI",
      "Log4j",
      "JWT",
      "OTP Authentication",
      "RBAC",
      "Razorpay",
      "React Hook Form",
      "Zod",
      "Jest",
      "React Testing Library",
      "Vitest",
      "MSW",
      "Postman",
      "Chrome DevTools",
      "React Profiler",
      "Lighthouse",
      "Git",
      "GitHub",
      "Bitbucket",
      "Docker",
      "Nginx",
      "PM2",
      "Let's Encrypt",
      "VPS Deployment",
      "Linux Ubuntu",
      "Jira",
      "Figma",
      "VS Code",
      "Agile",
      "Requirement Gathering",
      "UI Prototyping",
      "API Integration",
      "Debugging and Bug Fixing",
    ]
    const byName = new Map(
      SKILLS.flatMap((s) =>
        [s.title, ...s.aliases].map((n) => [n.toLowerCase(), s.id] as const)
      )
    )
    for (const name of resume)
      expect(byName.has(name.toLowerCase()), name).toBe(true)
    for (const id of RESUME_SKILL_IDS)
      expect(SKILL_BY_ID.has(id), id).toBe(true)
  })

  it("every picker row has 3 to 8 featured technologies, and Backend merges Java, Node.js and Python", () => {
    for (const group of SKILL_GROUPS) {
      const featured = SKILLS.filter((s) => s.group === group && s.featured)
      expect(featured.length, group).toBeGreaterThanOrEqual(3)
      expect(featured.length, group).toBeLessThanOrEqual(8)
    }
    const backend = SKILLS.filter((s) => s.group === "backend")
    expect(new Set(backend.map((s) => s.subgroup))).toEqual(
      new Set(["Java", "Node.js", "Python"])
    )
    for (const s of SKILLS)
      expect(Boolean(s.subgroup), s.id).toBe(s.group === "backend")
    expect(backend.filter((s) => s.featured).map((s) => s.title)).toEqual(
      expect.arrayContaining([
        "Java",
        "Spring Boot",
        "Node.js",
        "Express.js",
        "Python",
        "Django",
        "FastAPI",
      ])
    )
  })

  it("coverage marks skills in or out of the selected syllabus", () => {
    const selected = new Set(selectedModuleIds(["frontend-developer"], {}))
    const cov = skillCoverage(selected)
    expect(cov.find((c) => c.skill.id === "react")!.status).toBe("in-syllabus")
    expect(cov.find((c) => c.skill.id === "spring-boot")!.status).toBe(
      "covered"
    )
    expect(cov.every((c) => c.covered)).toBe(true)
  })

  it("migrates saved display names to ids and keeps anything unrecognised", () => {
    expect(
      migrateKnownSkills(["Java", "Spring Boot", "React", "Node.js", "MongoDB"])
    ).toEqual(["java", "spring-boot", "react", "nodejs", "mongodb"])
    expect(
      migrateKnownSkills(["node.js", "NODE.JS", "Django / FastAPI", "HTML/CSS"])
    ).toEqual(["nodejs", "django", "fastapi", "html5", "css3"])
    expect(migrateKnownSkills(["react", "Underwater Basket Weaving"])).toEqual([
      "react",
      "Underwater Basket Weaving",
    ])
    expect(legacySkills(["react", "Underwater Basket Weaving"])).toEqual([
      "Underwater Basket Weaving",
    ])
    expect(migrateKnownSkills([])).toEqual([])
  })
})

describe("HR interview categories", () => {
  const CORE = [
    "hr-tell-me-about-yourself",
    "hr-why-hire-you",
    "hr-strengths-weaknesses",
    "hr-why-this-company",
    "hr-teamwork",
    "hr-communication",
  ]
  const RECOMMENDED = [
    "hr-career-goals",
    "hr-handling-pressure",
    "hr-conflict-resolution",
    "hr-failure-challenges",
    "hr-behavioural",
    "hr-work-ethics",
    "hr-tricky-questions",
    "hr-salary-expectations",
    "hr-leadership",
  ]
  const OPTIONAL = [
    "hr-changing-jobs",
    "hr-employment-gaps",
    "hr-joining-availability",
  ]
  const resolve = (
    experience: "beginner" | "fresher" | "intermediate" | "advanced",
    roles = ["frontend-developer"]
  ) =>
    new Map(
      resolveSyllabus({
        defaults: defaultsForRoles(roles),
        overrides: {},
        experience,
      }).map((e) => [e.module.id, e])
    )

  it("are 20 interview-only modules in the career domain, each with three 15-minute steps and an hr- id", () => {
    expect(HR_MODULE_IDS).toHaveLength(20)
    for (const id of HR_MODULE_IDS) {
      const m = MODULES.find((x) => x.id === id)!
      expect(m, id).toBeDefined()
      expect(m.domainId).toBe("career")
      expect(m.skillArea).toBe("hr")
      expect(m.topicList.map((t) => t.minutes)).toEqual([15, 15, 15])
      expect(["planned", "in-progress", "released"]).toContain(m.contentStatus)
    }
  })

  it("have the same default tiers for every role: core, recommended, optional", () => {
    for (const roles of [
      ["frontend-developer"],
      ["java-full-stack"],
      ["data-science"],
      ["ai-engineer"],
    ]) {
      const d = defaultsForRoles(roles)
      for (const id of CORE) expect(d.get(id), `${roles} ${id}`).toBe("core")
      for (const id of RECOMMENDED)
        expect(d.get(id), `${roles} ${id}`).toBe("recommended")
      for (const id of OPTIONAL)
        expect(d.get(id), `${roles} ${id}`).toBe("optional")
    }
  })

  it("are never part of a Study syllabus", () => {
    const study = resolveSyllabus({
      defaults: defaultsForRoadmap("java-full-stack-ai"),
      overrides: {},
      experience: "fresher",
      scope: "study",
    })
    expect(study.some((e) => e.module.id.startsWith("hr-"))).toBe(false)
  })

  it("make the fresher and experienced categories experience-aware: recommended for their level, optional otherwise", () => {
    for (const [experience, fresherOn, experiencedOn] of [
      ["beginner", true, false],
      ["fresher", true, false],
      ["intermediate", false, true],
      ["advanced", false, true],
    ] as const) {
      const r = resolve(experience)
      const f = r.get("hr-fresher-specific")!
      const e = r.get("hr-experienced-candidate")!
      expect(f.tier, experience).toBe(fresherOn ? "recommended" : "optional")
      expect(f.selected, experience).toBe(fresherOn)
      expect(e.tier, experience).toBe(
        experiencedOn ? "recommended" : "optional"
      )
      expect(e.selected, experience).toBe(experiencedOn)
    }
    // the override only moves recommended modules, and leaves every other module alone
    expect(tierForExperience("hr-teamwork", "core", "advanced")).toBe("core")
    expect(tierForExperience("react", "core", "advanced")).toBe("core")
    expect(
      tierForExperience("hr-fresher-specific", null, "advanced")
    ).toBeNull()
  })

  it("add the 20 categories to every interview plan at the agreed size, and the learner can still drop one", () => {
    const base = resolve("fresher")
    const selected = [...base.values()].filter(
      (e) => e.module.id.startsWith("hr-") && e.selected
    )
    // 6 core + 9 recommended + the one experience-matched category
    expect(selected).toHaveLength(16)
    const dropped = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: { "hr-leadership": { selected: false } },
      experience: "fresher",
    }).find((e) => e.module.id === "hr-leadership")!
    expect(dropped.selected).toBe(false)
    expect(dropped.removed).toBe(true) // restorable from Removed
  })
})
