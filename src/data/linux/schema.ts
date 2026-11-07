import { z } from "zod"

/* -------------------------------------------------------------------------
 * Linux practice content. Every command entry comes from the learner's own
 * reference file (~/Documents/LinuxCommandVisual.html). Nothing is invented:
 * where the reference is wrong or duplicated, `erratum` says so.
 * ---------------------------------------------------------------------- */

export const LINUX_CATEGORIES = [
  "dir",
  "file",
  "nav",
  "list",
  "view",
  "search",
  "io",
  "text",
  "move",
  "disk",
  "proc",
  "net",
  "pkg",
  "user",
  "perm",
  "date",
  "sys",
  "misc",
] as const
export const linuxCategorySchema = z.enum(LINUX_CATEGORIES)
export type LinuxCategory = z.infer<typeof linuxCategorySchema>

export const LINUX_CATEGORY_LABEL: Record<LinuxCategory, string> = {
  dir: "Directories",
  file: "Files",
  nav: "Navigation",
  list: "Listing (ls)",
  view: "View files",
  search: "Grep & find",
  io: "Pipes & redirect",
  text: "Text processing",
  move: "mv / cp",
  disk: "Disk & storage",
  proc: "Processes",
  net: "Network & transfer",
  pkg: "Packages",
  user: "Users",
  perm: "Permissions",
  date: "Date & time",
  sys: "System",
  misc: "Utilities",
}

/** `linux.command.<slug>` — the id used for the learner's progress record. */
export const LINUX_COMMAND_ID = /^linux\.command\.[a-z0-9]+(?:-[a-z0-9]+)*$/
export const LINUX_CHALLENGE_ID = /^linux\.challenge\.[a-z0-9]+(?:-[a-z0-9]+)*$/

export const linuxCommandSchema = z.object({
  id: z.string().regex(LINUX_COMMAND_ID),
  /** URL slug, equal to the part of `id` after `linux.command.`. */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Position in the reference file (1-based). */
  number: z.number().int().positive(),
  category: linuxCategorySchema,
  syntax: z.string().min(1),
  description: z.string().min(1),
  example: z.string().min(1),
  note: z.string().optional(),
  /** Direction label the reference puts on remote-transfer rows. */
  direction: z.enum(["pull", "push"]).optional(),
  /** The reference marks this entry as dangerous. */
  caution: z.boolean().default(false),
  /** Set when the reference entry was wrong, imprecise or duplicated. */
  erratum: z
    .object({
      /** The reference file's own wording, kept so the correction is visible. */
      original: z.string().min(1),
      note: z.string().min(1),
      /** Reference numbers merged into this single entry. */
      mergedFrom: z.array(z.number().int().positive()).optional(),
    })
    .optional(),
})
export type LinuxCommand = z.infer<typeof linuxCommandSchema>

export const dateSpecifierSchema = z.object({
  token: z.string().regex(/^%[A-Za-z]$/),
  description: z.string().min(1),
})
export type DateSpecifier = z.infer<typeof dateSpecifierSchema>

export const permissionLevelSchema = z.object({
  digit: z.number().int().min(0).max(7),
  meaning: z.string().min(1),
  symbol: z.string().regex(/^[r-][w-][x-]$/),
})
export type PermissionLevel = z.infer<typeof permissionLevelSchema>

/* ------------------------------ challenges ------------------------------ */

/** A condition on the virtual filesystem. All paths are absolute. */
export const challengeCheckSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("dir-exists"), path: z.string().startsWith("/") }),
  z.object({
    kind: z.literal("file-exists"),
    path: z.string().startsWith("/"),
  }),
  z.object({ kind: z.literal("missing"), path: z.string().startsWith("/") }),
  z.object({
    kind: z.literal("file-content"),
    path: z.string().startsWith("/"),
    content: z.string(),
  }),
  z.object({
    kind: z.literal("file-contains"),
    path: z.string().startsWith("/"),
    text: z.string().min(1),
  }),
  /** Permission string without the type character, e.g. `rwxr---w-`. */
  z.object({
    kind: z.literal("mode"),
    path: z.string().startsWith("/"),
    symbolic: z.string().regex(/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/),
  }),
])
export type ChallengeCheck = z.infer<typeof challengeCheckSchema>

export const linuxChallengeSchema = z.object({
  id: z.string().regex(LINUX_CHALLENGE_ID),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(4),
  difficulty: z.enum(["easy", "medium"]),
  /** What to do, in the learner's words. */
  brief: z.string().min(1),
  /** Reference-file numbers of the commands this exercise practises. */
  commandNumbers: z.array(z.number().int().positive()).min(1),
  hints: z.array(z.string().min(1)).min(1),
  /** One working command line; revealed on request and used by tests. */
  solution: z.string().min(1),
  /** Every check must hold for the challenge to pass. */
  checks: z.array(challengeCheckSchema).min(1),
  estimatedMinutes: z.number().int().positive(),
})
export type LinuxChallenge = z.infer<typeof linuxChallengeSchema>
