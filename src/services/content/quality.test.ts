import { describe, expect, it } from "vitest"
import { ALLOWED_SOURCES } from "@/data/questions/source-allowlist"
import {
  findFrequencyClaim,
  findNearDuplicates,
  isAllowedSource,
  normaliseTitle,
} from "./quality"

describe("isAllowedSource", () => {
  it("accepts official documentation, including subdomains and path-limited hosts", () => {
    for (const url of [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
      "https://react.dev/reference/react/useState",
      "https://www.postgresql.org/docs/current/sql-select.html",
      "https://docs.oracle.com/en/java/javase/21/docs/api/",
      "https://www.mongodb.com/docs/manual/aggregation/",
      "https://git-scm.com/docs/git-rebase",
    ])
      expect(isAllowedSource(url), url).toBe(true)
  })

  it("rejects blogs, look-alike hosts, other paths on a limited host, http and junk", () => {
    for (const url of [
      "https://medium.com/@someone/react-hooks",
      "https://react.dev.evil.com/x",
      "https://evilreact.dev/x",
      "https://www.mongodb.com/blog/post/x",
      "http://react.dev/reference",
      "not a url",
      "https://www.geeksforgeeks.org/closures-in-javascript/",
    ])
      expect(isAllowedSource(url), url).toBe(false)
  })

  it("is data driven: a custom allowlist changes the answer", () => {
    expect(
      isAllowedSource("https://example.org/a", [
        { host: "example.org", note: "test" },
      ])
    ).toBe(true)
    expect(isAllowedSource("https://example.org/a", [])).toBe(false)
  })

  it("lists each host once, with a reason", () => {
    const keys = ALLOWED_SOURCES.map((a) => `${a.host}${a.pathPrefix ?? ""}`)
    expect(new Set(keys).size).toBe(keys.length)
    for (const a of ALLOWED_SOURCES) expect(a.note.length).toBeGreaterThan(3)
  })
})

describe("findNearDuplicates", () => {
  const q = (id: string, title: string, keywords: string[]) => ({
    id,
    title,
    keywords,
  })

  it("flags the same question phrased two ways", () => {
    const pairs = findNearDuplicates([
      q("a", "What is a closure in JavaScript?", ["closure", "scope"]),
      q("b", "Explain closure in JavaScript", ["closure", "lexical scope"]),
    ])
    expect(pairs).toHaveLength(1)
  })

  it("flags high title overlap with high keyword overlap", () => {
    expect(
      findNearDuplicates([
        q("a", "How does useEffect cleanup work in React", [
          "useEffect",
          "cleanup",
          "react",
        ]),
        q("b", "How does useEffect cleanup work in React apps", [
          "useEffect",
          "cleanup",
          "react",
        ]),
      ]).length
    ).toBe(1)
  })

  it("does not flag genuinely different but related questions", () => {
    expect(
      findNearDuplicates([
        q("a", "What is the difference between var and let?", [
          "var",
          "let",
          "scope",
        ]),
        q("b", "What is the difference between let and const?", [
          "let",
          "const",
          "reassignment",
        ]),
        q("c", "What is hoisting?", ["hoisting", "var"]),
      ])
    ).toEqual([])
  })

  it("normalises filler words so only the subject is compared", () => {
    expect(
      normaliseTitle("What is the difference between == and ===?")
    ).toEqual(["==", "and", "==="].filter((w) => w !== "and"))
  })
})

describe("findFrequencyClaim", () => {
  it("catches claims of how often a question is asked", () => {
    for (const text of [
      "This is the most asked use of Set.",
      "A most commonly asked question",
      "Top 10 JavaScript questions",
      "Appears in 80% of interviews",
      "asked in 70% of interviews",
      "Always asked in interviews",
      "frequently asked at product companies",
      "Guaranteed to come up",
    ])
      expect(findFrequencyClaim(text), text).not.toBeNull()
  })

  it("lets ordinary wording through", () => {
    for (const text of [
      "A common use of Set is removing duplicates.",
      "Interviewers often check whether you know why keys must be stable.",
      "Use 10 items per page in this example.",
      "The top of the stack holds the latest frame.",
      "Hooks were added in React 16.8.",
    ])
      expect(findFrequencyClaim(text), text).toBeNull()
  })
})
