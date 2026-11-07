import { describe, expect, it } from "vitest"
import { Sandbox } from "@/features/linux/engine/sandbox"
import {
  SIMULATED_COMMANDS,
  exampleSupport,
} from "@/features/linux/engine/support"
import { REFERENCE_ROWS } from "@/features/linux/library"
import { LINUX_CHALLENGES } from "./challenges"
import { LINUX_COMMANDS } from "./commands"
import { DATE_SPECIFIERS, PERMISSION_LEVELS } from "./reference"
import { LINUX_CATEGORIES } from "./schema"

describe("linux command library", () => {
  it("has unique commands, derived from a 108-row reference with one merged duplicate", () => {
    expect(REFERENCE_ROWS).toBe(108)
    expect(LINUX_COMMANDS).toHaveLength(107)
    expect(LINUX_COMMANDS.filter((c) => c.erratum?.mergedFrom)).toHaveLength(1)
  })

  it("has no duplicate syntax strings, ids, slugs or reference numbers", () => {
    const unique = (values: (string | number)[]) =>
      new Set(values).size === values.length
    expect(unique(LINUX_COMMANDS.map((c) => c.syntax))).toBe(true)
    expect(unique(LINUX_COMMANDS.map((c) => c.id))).toBe(true)
    expect(unique(LINUX_COMMANDS.map((c) => c.slug))).toBe(true)
    expect(unique(LINUX_COMMANDS.map((c) => c.number))).toBe(true)
  })

  it("gives every erratum a note and the reference's original wording", () => {
    const withErrata = LINUX_COMMANDS.filter((c) => c.erratum)
    expect(withErrata.map((c) => c.number).sort((a, b) => a - b)).toEqual([
      16, 59, 66, 84,
    ])
    for (const c of withErrata) {
      expect(c.erratum!.note.length).toBeGreaterThan(20)
      expect(c.erratum!.original.length).toBeGreaterThan(5)
    }
  })

  it("uses only known categories and keeps ids in step with slugs", () => {
    for (const c of LINUX_COMMANDS) {
      expect(LINUX_CATEGORIES).toContain(c.category)
      expect(c.id).toBe(`linux.command.${c.slug}`)
    }
  })

  it("carries the reference's date specifiers and permission table", () => {
    expect(DATE_SPECIFIERS).toHaveLength(14)
    expect(PERMISSION_LEVELS.map((p) => p.digit)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ])
  })
})

describe("linux challenges", () => {
  const numbers = new Set(LINUX_COMMANDS.map((c) => c.number))

  it("have unique ids and only point at commands in the library", () => {
    expect(new Set(LINUX_CHALLENGES.map((c) => c.id)).size).toBe(
      LINUX_CHALLENGES.length
    )
    for (const c of LINUX_CHALLENGES) {
      expect(c.id).toBe(`linux.challenge.${c.slug}`)
      for (const n of c.commandNumbers)
        expect(numbers.has(n), `${c.slug}: #${n}`).toBe(true)
    }
  })
})

describe("honest labelling of what the terminal can run", () => {
  it("every command it claims to simulate exists in the sandbox", () => {
    const sb = new Sandbox()
    for (const name of SIMULATED_COMMANDS) {
      const out = sb
        .run(name)
        .lines.map((l) => l.text)
        .join("\n")
      expect(out, name).not.toContain("command not found")
    }
  })

  it("examples labelled simulated run, and those labelled not-simulated are refused with a reason", () => {
    for (const c of LINUX_COMMANDS) {
      const support = exampleSupport(c.example)
      const sb = new Sandbox()
      const out = sb
        .run(c.example)
        .lines.map((l) => l.text)
        .join("\n")
      expect(out, c.example).not.toContain("command not found")
      if (support === "not-simulated")
        expect(out, c.example).toContain("not simulated")
      if (support === "simulated")
        expect(out, c.example).not.toContain("not simulated here")
    }
  })
})
