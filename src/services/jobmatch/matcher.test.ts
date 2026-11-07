import { describe, expect, it } from "vitest"
import { AMBIGUOUS_RULES } from "@/data/jobmatch/terms"
import { SKILL_BY_ID } from "@/data/curriculum/skills"
import { DROPPED, MAX_CHARS, TERMS, analyse, splitSentences } from "./matcher"

const ids = (text: string) => analyse(text).matches.map((m) => m.skillId)
const rule = (name: string) => new RegExp(AMBIGUOUS_RULES[name].pattern)

describe("matching whole names only", () => {
  it("finds exact names and listed aliases, in any case", () => {
    expect(ids("We use SPRING BOOT and postgresql.")).toEqual(
      expect.arrayContaining(["spring-boot", "postgresql"])
    )
    expect(ids("Strong NodeJS skills")).toContain("nodejs")
  })
  it("never matches inside another word", () => {
    expect(ids("GitHub is used for hosting")).not.toContain("git")
    expect(ids("We love Javascripting")).not.toContain("javascript")
    expect(ids("Javascript is required")).toContain("javascript")
    expect(ids("Experience with Java and JavaScript")).toEqual(
      expect.arrayContaining(["javascript"])
    )
  })
  it("every skill title in the table is found when written alone", () => {
    for (const s of SKILL_BY_ID.values()) {
      const m = analyse(`We need ${s.title} experience.`)
      expect(
        m.matches.some((x) => x.skillId === s.id),
        s.title
      ).toBe(true)
    }
  })
  it("drops very short names that have no explicit rule, so they are never matched", () => {
    for (const t of TERMS)
      expect(
        t.text.length > 2 || t.text.toLowerCase() in AMBIGUOUS_RULES,
        t.text
      ).toBe(true)
    expect(Array.isArray(DROPPED)).toBe(true)
  })
})

describe("ambiguous and short names have explicit rules", () => {
  it("Go: Golang, or exactly 'Go' next to a programming word; never 'Go-getter' or 'Go ahead'", () => {
    const go = rule("go")
    for (const yes of [
      "We use Golang for services",
      "Experience with Go and Rust",
      "Go developer wanted",
      "Python, Go, Java",
    ])
      expect(go.test(yes), yes).toBe(true)
    for (const no of [
      "Go-getter attitude",
      "Go ahead and apply",
      "a go-to person",
      "Let us go to market",
      "GO",
      "Mongo",
    ])
      expect(go.test(no), no).toBe(false)
  })
  it("R: only as the R language, and case-aware", () => {
    const r = rule("r")
    for (const yes of [
      "Knowledge of R language",
      "R programming and SQL",
      "Python/R",
      "R and Python",
      "RStudio",
    ])
      expect(r.test(yes), yes).toBe(true)
    for (const no of [
      "R&D team",
      "Part R of the form",
      "Our r esults",
      "Java and Rust",
      "Grade R",
    ])
      expect(r.test(no), no).toBe(false)
  })
  it("Spring: only with Boot, Framework, MVC, Security, Data, Cloud or Batch; case-aware", () => {
    const sp = rule("spring")
    for (const yes of [
      "Spring Boot",
      "Spring Framework experience",
      "Spring Security",
    ])
      expect(sp.test(yes), yes).toBe(true)
    for (const no of [
      "Spring 2026 internship",
      "spring boot",
      "A spring in the step",
      "Springfield",
    ])
      expect(sp.test(no), no).toBe(false)
  })
  it("Express: only Express.js, ExpressJS, Express framework or beside Node, MongoDB or React", () => {
    const ex = rule("express")
    for (const yes of [
      "Express.js APIs",
      "ExpressJS",
      "Express framework",
      "Node.js, Express",
      "React/Express",
    ])
      expect(ex.test(yes), yes).toBe(true)
    for (const no of [
      "Express delivery",
      "express your ideas",
      "Expressive code",
      "Express Scripts",
    ])
      expect(ex.test(no), no).toBe(false)
  })
  it("JS, TS, JPA, S3: upper case, standing alone", () => {
    for (const [name, yes, no] of [
      ["js", "JS and CSS", "JSON and jsx"],
      ["ts", "TS skills", "cats and TSA"],
      ["jpa", "JPA mappings", "JPAs and Jpa"],
      ["s3", "AWS S3 buckets", "S30 and s3"],
    ] as const) {
      expect(rule(name).test(yes), yes).toBe(true)
      expect(rule(name).test(no), no).toBe(false)
    }
  })
})

describe("evidence and honesty", () => {
  it("every match shows the sentence it was found in, and where", () => {
    const a = analyse("We build services.\nYou know PostgreSQL well.")
    const m = a.matches.find((x) => x.skillId === "postgresql")!
    expect(m.evidence[0].sentence).toBe("You know PostgreSQL well.")
    expect(
      m.evidence[0].sentence
        .slice(m.evidence[0].start, m.evidence[0].end)
        .toLowerCase()
    ).toBe("postgresql")
  })
  it("counts mentions and keeps at most two sentences of evidence", () => {
    const a = analyse(
      "Docker is used.\nDocker again.\nDocker once more.\nMore Docker."
    )
    const d = a.matches.find((x) => x.skillId === "docker")!
    expect(d.mentions).toBe(4)
    expect(d.evidence).toHaveLength(2)
  })
  it("lists technology-looking words that are not in the table as unrecognised, and never as matches", () => {
    const a = analyse(
      "Experience with Kafka and Terraform, GraphQL and Grafana. We value teamwork."
    )
    for (const w of ["Kafka", "Terraform", "Grafana"])
      expect(a.unrecognised).toContain(w)
    expect(
      a.matches.some((m) => /kafka|terraform|grafana/.test(m.skillId))
    ).toBe(false)
    expect(a.unrecognised).not.toContain("Experience")
    expect(a.unrecognised).not.toContain("teamwork")
  })
  it("splits sentences on lines, bullets and sentence ends, and bounds the input", () => {
    expect(
      splitSentences("• First point\n- Second point. Third one! Fourth?")
    ).toEqual(["First point", "Second point.", "Third one!", "Fourth?"])
    expect(analyse("x".repeat(MAX_CHARS + 10)).truncated).toBe(true)
    expect(analyse("").matches).toEqual([])
  })
})
