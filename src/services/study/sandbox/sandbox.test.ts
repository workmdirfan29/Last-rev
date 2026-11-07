import { describe, expect, it } from "vitest"
import { SANDBOX } from "@/config/study"
import { frameHtml, HARNESS_JS, PROBE_JS, workerSource } from "./harness"
import { runCasesInProcess } from "./in-process"
import { allPassed, assembleReport, passedCount } from "./report"
import {
  probeSandbox,
  resetProbeForTests,
  runInSandbox,
  sandboxSupported,
} from "./sandbox"

const cases = (rows: [string, unknown[], unknown][]) =>
  rows.map(([name, args, expected]) => ({ name, args, expected }))

describe("the case runner (one source, run here in-process)", () => {
  const add = cases([
    ["1+2", [1, 2], 3],
    ["negatives", [-1, 1], 0],
    ["zero", [0, 0], 0],
  ])

  it("passes a correct solution and reports each case", async () => {
    const r = await runCasesInProcess(
      "function add(a, b) { return a + b }",
      "add",
      add
    )
    expect(r.status).toBe("ok")
    expect(allPassed(r)).toBe(true)
    expect(r.cases.map((c) => c.name)).toEqual(["1+2", "negatives", "zero"])
    expect(r.cases[0]).toMatchObject({
      passed: true,
      actual: "3",
      expected: "3",
    })
  })

  it("fails a wrong solution with the value it returned, and counts passes", async () => {
    const r = await runCasesInProcess(
      "function add(a, b) { return a - b }",
      "add",
      add
    )
    expect(allPassed(r)).toBe(false)
    expect(passedCount(r)).toBe(1) // 0 - 0 === 0
    expect(r.cases[0]).toMatchObject({ passed: false, actual: "-1" })
  })

  it("compares objects and arrays deeply and strictly", async () => {
    const c = cases([
      ["arrays", [[1, 2, 3]], [3, 2, 1]],
      ["object", [{ a: 1 }], { a: 1, b: 2 }],
      ["nested", [], { x: [1, { y: null }] }],
    ])
    const code = `function f(x) { if (Array.isArray(x)) return [...x].reverse(); if (x && x.a) return { a: x.a, b: x.a + 1 }; return { x: [1, { y: null }] } }`
    expect(allPassed(await runCasesInProcess(code, "f", c))).toBe(true)
    const strict = cases([["not equal", [1], "1"]])
    expect(
      allPassed(
        await runCasesInProcess("function f(x) { return x }", "f", strict)
      )
    ).toBe(false)
  })

  it("does not let one case change the arguments of another", async () => {
    const c = cases([
      ["a", [[1]], 2],
      ["b", [[1]], 2],
    ])
    expect(
      allPassed(
        await runCasesInProcess(
          "function f(x) { x.push(2); return x.length }",
          "f",
          c
        )
      )
    ).toBe(true)
  })

  it("supports async functions", async () => {
    expect(
      allPassed(
        await runCasesInProcess(
          "async function f(x) { return x * 2 }",
          "f",
          cases([
            ["a", [2], 4],
            ["b", [3], 6],
            ["c", [0], 0],
          ])
        )
      )
    ).toBe(true)
  })

  it("reports a thrown error for that case and goes on", async () => {
    const r = await runCasesInProcess(
      "function f(x) { if (x === 1) throw new Error('boom'); return x }",
      "f",
      cases([
        ["bad", [1], 1],
        ["good", [2], 2],
        ["ok", [3], 3],
      ])
    )
    expect(r.status).toBe("ok")
    expect(r.cases[0]).toMatchObject({ passed: false, error: "boom" })
    expect(r.cases[1].passed).toBe(true)
  })

  it("explains nothing returned, NaN and a missing function", async () => {
    const r = await runCasesInProcess(
      "function f() {}",
      "f",
      cases([
        ["a", [], 1],
        ["b", [], 1],
        ["c", [], 1],
      ])
    )
    expect(r.cases[0].actual).toMatch(/nothing was returned/)
    const nan = await runCasesInProcess(
      "function f() { return NaN }",
      "f",
      cases([
        ["a", [], null],
        ["b", [], null],
        ["c", [], null],
      ])
    )
    expect(nan.cases[0].passed).toBe(false)
    const missing = await runCasesInProcess(
      "function other() {}",
      "f",
      cases([
        ["a", [], 1],
        ["b", [], 1],
        ["c", [], 1],
      ])
    )
    expect(missing.status).toBe("error")
    expect(missing.message).toMatch(/function to test was not found/)
  })

  it("captures console output, capped in lines and characters, and restores the console", async () => {
    const before = console.log
    const r = await runCasesInProcess(
      `function f() { for (let i = 0; i < 500; i++) console.log("line " + i); return 1 }`,
      "f",
      cases([
        ["a", [], 1],
        ["b", [], 1],
        ["c", [], 1],
      ])
    )
    expect(r.logs.length).toBeLessThanOrEqual(SANDBOX.maxConsoleLines)
    expect(r.truncated).toBe(true)
    expect(console.log).toBe(before)
    const big = await runCasesInProcess(
      `function f() { console.log("x".repeat(100000)); return 1 }`,
      "f",
      cases([
        ["a", [], 1],
        ["b", [], 1],
        ["c", [], 1],
      ])
    )
    expect(big.logs.join("").length).toBeLessThanOrEqual(SANDBOX.maxOutputChars)
  })
})

describe("reports from untrusted messages", () => {
  const cs = cases([
    ["a", [], 1],
    ["b", [], 2],
    ["c", [], 3],
  ])
  it("ignores unknown shapes, out-of-range cases and cuts long strings", () => {
    const r = assembleReport(
      [
        null,
        7,
        "x",
        { type: "case", i: 99, passed: true },
        { type: "case", i: 0, passed: true, actual: "x".repeat(5000) },
        { type: "log", line: "y".repeat(9000) },
        { type: "done" },
      ],
      cs
    )
    expect(r.cases[0].actual!.length).toBe(300)
    expect(r.logs[0].length).toBe(2000)
    expect(r.cases.filter((c) => c.skipped)).toHaveLength(2)
    expect(r.status).toBe("ok")
  })
  it("marks the case that was running when time ran out, and the rest as not run", () => {
    const r = assembleReport(
      [
        { type: "start", i: 0 },
        { type: "case", i: 0, passed: true },
        { type: "start", i: 1 },
      ],
      cs,
      { timedOut: true }
    )
    expect(r.status).toBe("timeout")
    expect(r.cases[1]).toMatchObject({ timedOut: true })
    expect(r.cases[2]).toMatchObject({ skipped: true })
    expect(allPassed(r)).toBe(false)
  })
  it("a run that ends without 'done' is an error, never a pass", () => {
    const r = assembleReport([{ type: "case", i: 0, passed: true }], cs)
    expect(r.status).toBe("error")
    expect(allPassed(r)).toBe(false)
  })
  it("only looks at a bounded number of messages", () => {
    const many = Array.from({ length: 5000 }, () => ({
      type: "log",
      line: "x",
    }))
    expect(assembleReport(many, cs, {}, 100).logs).toHaveLength(100)
  })
})

describe("what the sandbox is built from", () => {
  it("the frame's policy refuses every network, import and form, and allows only a Blob worker", () => {
    const html = frameHtml(SANDBOX)
    expect(html).toContain("default-src 'none'")
    expect(html).toContain("worker-src blob:")
    expect(html).not.toMatch(/connect-src [^;'n]/)
    expect(html).not.toContain("allow-same-origin")
    expect(html).toContain("e.source !== parent")
  })
  it("the worker script puts the harness first, the learner's code after it, then the call", () => {
    const src = workerSource(
      "function add(a,b){return a+b}",
      "add",
      cases([["a", [1, 2], 3]]),
      SANDBOX
    )
    expect(src.startsWith(HARNESS_JS)).toBe(true)
    expect(src.indexOf("function add")).toBeGreaterThan(
      src.indexOf("__lrRunCases")
    )
    expect(src).toContain('typeof add === "function"')
  })
  it("rejects an entry name that is not a plain identifier", () => {
    expect(() => workerSource("", "a;b", [], SANDBOX)).toThrow()
    expect(() => workerSource("", "x()", [], SANDBOX)).toThrow()
  })
  it("the probe checks document, storage, origin and that a data: fetch is refused", () => {
    for (const needle of [
      "typeof document",
      "typeof localStorage",
      'origin === "null"',
      "data:text/plain",
    ])
      expect(PROBE_JS).toContain(needle)
  })
})

describe("without a browser the sandbox says so and runs nothing", () => {
  it("is unavailable under jsdom (no Worker), and the report is a normal one", async () => {
    resetProbeForTests()
    expect(sandboxSupported()).toBe(false)
    expect((await probeSandbox()).ok).toBe(false)
    const r = await runInSandbox({
      code: "function f(){return 1}",
      entry: "f",
      cases: cases([
        ["a", [], 1],
        ["b", [], 1],
        ["c", [], 1],
      ]),
    })
    expect(r.status).toBe("unavailable")
    expect(r.cases).toEqual([])
    expect(allPassed(r)).toBe(false)
  })
})
