/**
 * Line-oriented filters (grep, sort, uniq, nl, sed, cut, paste, wc, head, tail,
 * tac). They never touch the filesystem themselves: the sandbox hands them a
 * `read` callback, which keeps them pure and easy to test.
 */

export interface CmdResult {
  out: string[]
  err: string[]
  /** Informational notes shown after the output (e.g. "sample output"). */
  info?: string[]
  status: number
}

export type ReadResult = { lines: string[] } | { error: string }
export type Reader = (name: string) => ReadResult

export const ok = (out: string[] = [], info?: string[]): CmdResult => ({
  out,
  err: [],
  info,
  status: 0,
})
export const fail = (
  err: string | string[],
  out: string[] = [],
  status = 1
): CmdResult => ({
  out,
  err: Array.isArray(err) ? err : [err],
  status,
})

/** File content to lines. A trailing newline does not make an extra empty line. */
export function toLines(content: string): string[] {
  if (content === "") return []
  const body = content.endsWith("\n") ? content.slice(0, -1) : content
  return body.split("\n")
}

export interface ParsedArgv {
  flags: Set<string>
  values: Record<string, string>
  /** Value of a `-N` style option such as `head -10`. */
  num: number | null
  args: string[]
  /** First unknown short flag, if the caller gave a whitelist. */
  unknown: string | null
}

/**
 * Split argv into flags, valued options and operands. `valued` lists short
 * options that take a value (`-d ","` or `-d,`); `valuedLong` lists long ones
 * (`--date x` or `--date=x`). `allowed`, when given, flags anything else.
 */
export function parseArgv(
  argv: string[],
  opts: { valued?: string[]; valuedLong?: string[]; allowed?: string } = {}
): ParsedArgv {
  const { valued = [], valuedLong = [], allowed } = opts
  const out: ParsedArgv = {
    flags: new Set(),
    values: {},
    num: null,
    args: [],
    unknown: null,
  }
  let operandsOnly = false
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (operandsOnly || a === "-" || !a.startsWith("-")) {
      out.args.push(a)
    } else if (a === "--") {
      operandsOnly = true
    } else if (a.startsWith("--")) {
      const [name, inline] = a.slice(2).split(/=(.*)/s)
      if (valuedLong.includes(name))
        out.values[name] = inline ?? argv[++i] ?? ""
      else out.flags.add(name)
    } else if (/^-\d+$/.test(a)) {
      out.num = Number(a.slice(1))
    } else {
      const cluster = a.slice(1)
      for (let j = 0; j < cluster.length; j++) {
        const ch = cluster[j]
        if (valued.includes(ch)) {
          const rest = cluster.slice(j + 1)
          out.values[ch] = rest !== "" ? rest : (argv[++i] ?? "")
          break
        }
        if (allowed !== undefined && !allowed.includes(ch)) out.unknown ??= ch
        out.flags.add(ch)
      }
    }
  }
  return out
}

/** Convert a POSIX basic regular expression (as used by grep and sed) to a JS RegExp source. */
export function breToRegExpSource(bre: string): string {
  let out = ""
  for (let i = 0; i < bre.length; i++) {
    const ch = bre[i]
    if (ch === "\\" && i + 1 < bre.length) {
      const next = bre[++i]
      if ("|()+?".includes(next)) out += next
      else if (next === "{" || next === "}") out += next
      else out += "\\" + next
    } else if ("()+?|{}".includes(ch)) {
      out += "\\" + ch
    } else {
      out += ch
    }
  }
  return out
}

function compileBre(pattern: string, flags: string): RegExp | null {
  try {
    return new RegExp(breToRegExpSource(pattern), flags)
  } catch {
    return null
  }
}

function readAll(
  cmd: string,
  names: string[],
  read: Reader,
  stdin: string[] | null
): { inputs: { name: string | null; lines: string[] }[]; errors: string[] } {
  if (names.length === 0)
    return { inputs: [{ name: null, lines: stdin ?? [] }], errors: [] }
  const inputs: { name: string | null; lines: string[] }[] = []
  const errors: string[] = []
  for (const name of names) {
    const r = read(name)
    if ("error" in r) errors.push(`${cmd}: ${name}: ${r.error}`)
    else inputs.push({ name, lines: r.lines })
  }
  return { inputs, errors }
}

const unsupportedOption = (cmd: string, flag: string, supported: string) =>
  fail(
    `${cmd}: option -${flag} is not simulated here (supported: ${supported})`,
    [],
    2
  )

/* --------------------------------- grep --------------------------------- */

export function grep(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { allowed: "ivo" })
  if (p.unknown) return unsupportedOption("grep", p.unknown, "-i -v -o")
  if (p.args.length === 0)
    return fail("Usage: grep [OPTION]... PATTERN [FILE]...", [], 2)
  const [pattern, ...files] = p.args
  const re = compileBre(pattern, p.flags.has("i") ? "gi" : "g")
  if (!re) return fail(`grep: Invalid regular expression: ${pattern}`, [], 2)
  const { inputs, errors } = readAll("grep", files, read, stdin)
  const out: string[] = []
  const prefixed = files.length > 1
  for (const input of inputs) {
    const prefix = prefixed ? `${input.name}:` : ""
    for (const line of input.lines) {
      re.lastIndex = 0
      const hit = re.test(line)
      re.lastIndex = 0
      if (hit === p.flags.has("v")) continue
      if (p.flags.has("o")) {
        if (p.flags.has("v")) continue
        for (const m of line.matchAll(re))
          if (m[0] !== "") out.push(prefix + m[0])
      } else out.push(prefix + line)
    }
  }
  return { out, err: errors, status: errors.length ? 2 : out.length ? 0 : 1 }
}

/* --------------------------------- sort --------------------------------- */

const leadingNumber = (s: string): number => {
  const m = /^\s*([+-]?\d+(?:\.\d+)?)/.exec(s)
  return m ? Number(m[1]) : 0
}
const compareText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

export function sort(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { allowed: "rn" })
  if (p.unknown) return unsupportedOption("sort", p.unknown, "-r -n -nr")
  const { inputs, errors } = readAll("sort", p.args, read, stdin)
  const lines = inputs.flatMap((i) => i.lines)
  const numeric = p.flags.has("n")
  lines.sort((a, b) => {
    const c = numeric
      ? leadingNumber(a) - leadingNumber(b) || compareText(a, b)
      : compareText(a, b)
    return p.flags.has("r") ? -c : c
  })
  return { out: lines, err: errors, status: errors.length ? 2 : 0 }
}

/* --------------------------------- uniq --------------------------------- */

export function uniq(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { allowed: "d" })
  if (p.unknown) return unsupportedOption("uniq", p.unknown, "-d")
  const { inputs, errors } = readAll("uniq", p.args.slice(0, 1), read, stdin)
  const out: string[] = []
  const lines = inputs[0]?.lines ?? []
  let i = 0
  while (i < lines.length) {
    let j = i + 1
    while (j < lines.length && lines[j] === lines[i]) j++
    if (!p.flags.has("d") || j - i > 1) out.push(lines[i])
    i = j
  }
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

/* ---------------------------------- nl ---------------------------------- */

export function nl(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { valued: ["b"], allowed: "b" })
  if (p.unknown) return unsupportedOption("nl", p.unknown, "-b a|t|n")
  const style = p.values.b ?? "t"
  if (!["a", "t", "n"].includes(style)) {
    return fail([
      `nl: invalid body numbering style: '${style}'`,
      "Try 'nl --help' for more information.",
    ])
  }
  const { inputs, errors } = readAll("nl", p.args.slice(0, 1), read, stdin)
  let n = 0
  const out = (inputs[0]?.lines ?? []).map((line) => {
    const numbered = style === "a" || (style === "t" && line !== "")
    if (!numbered)
      return style === "n"
        ? `       ${line}`
        : line === ""
          ? ""
          : `       ${line}`
    n++
    return `${String(n).padStart(6)}\t${line}`
  })
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

/* ---------------------------------- sed --------------------------------- */

type SedAddress = number | "$"
interface SedCommand {
  from?: SedAddress
  to?: SedAddress
  op: "p" | "d" | "s"
  re?: RegExp
  replacement?: string
}

function splitUnescaped(text: string, delim: string): string[] {
  const parts: string[] = []
  let cur = ""
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\\" && text[i + 1] === delim) {
      cur += delim
      i++
    } else if (text[i] === "\\" && i + 1 < text.length) {
      cur += text[i] + text[++i]
    } else if (text[i] === delim) {
      parts.push(cur)
      cur = ""
    } else cur += text[i]
  }
  parts.push(cur)
  return parts
}

function parseSed(script: string): SedCommand | string {
  const m = /^\s*(?:(\d+|\$)(?:,(\d+|\$))?)?\s*([pds])(.*)$/s.exec(script)
  if (!m)
    return `unknown command: '${script}' (supported: Np, N,Mp, Nd, N,Md, s/old/new/ and s/old/new/g)`
  const toAddr = (s?: string): SedAddress | undefined =>
    s === undefined ? undefined : s === "$" ? "$" : Number(s)
  const cmd: SedCommand = {
    from: toAddr(m[1]),
    to: toAddr(m[2]),
    op: m[3] as SedCommand["op"],
  }
  if (cmd.op !== "s") {
    return m[4].trim() === ""
      ? cmd
      : `extra characters after command: '${m[4]}'`
  }
  const body = m[4]
  const delim = body[0]
  if (!delim) return "unterminated 's' command"
  const parts = splitUnescaped(body.slice(1), delim)
  if (parts.length !== 3) return "unterminated 's' command"
  const [pattern, replacement, flags] = parts
  if (flags.replace(/g/g, "") !== "")
    return `unknown option to 's': '${flags}' (supported: g)`
  try {
    cmd.re = new RegExp(
      breToRegExpSource(pattern),
      flags.includes("g") ? "g" : ""
    )
  } catch {
    return `invalid regular expression: ${pattern}`
  }
  cmd.replacement = replacement
  return cmd
}

export function sed(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { allowed: "n" })
  if (p.unknown) return unsupportedOption("sed", p.unknown, "-n")
  if (p.args.length === 0) return fail("Usage: sed [-n] SCRIPT [FILE]", [], 1)
  const parsed = parseSed(p.args[0])
  if (typeof parsed === "string")
    return fail(`sed: -e expression #1, char 0: ${parsed}`)
  const cmd = parsed
  const { inputs, errors } = readAll("sed", p.args.slice(1, 2), read, stdin)
  const lines = inputs[0]?.lines ?? []
  const total = lines.length
  const resolve = (a: SedAddress | undefined) => (a === "$" ? total : a)
  const quiet = p.flags.has("n")
  const out: string[] = []
  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const from = resolve(cmd.from)
    const to = resolve(cmd.to)
    const selected =
      from === undefined ||
      (to === undefined ? lineNo === from : lineNo >= from && lineNo <= to)
    let text = line
    let deleted = false
    let printed = false
    if (selected) {
      if (cmd.op === "d") deleted = true
      else if (cmd.op === "p") printed = true
      else
        text = line.replace(cmd.re!, (match) =>
          cmd.replacement!.replace(/(?<!\\)&/g, match).replace(/\\&/g, "&")
        )
    }
    if (deleted) return
    if (printed) out.push(text)
    if (!quiet) out.push(text)
  })
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

/* ---------------------------------- cut --------------------------------- */

function parseRanges(spec: string): { from: number; to: number }[] | null {
  const ranges: { from: number; to: number }[] = []
  for (const part of spec.split(",")) {
    const m = /^(\d*)(-?)(\d*)$/.exec(part)
    if (!m || (m[1] === "" && m[3] === "")) return null
    const from = m[1] === "" ? 1 : Number(m[1])
    const to = m[2] === "" ? from : m[3] === "" ? Infinity : Number(m[3])
    if (from < 1 || to < from) return null
    ranges.push({ from, to })
  }
  return ranges
}

export function cut(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { valued: ["d", "f", "c"] })
  const fieldSpec = p.values.f
  const charSpec = p.values.c
  if ((fieldSpec === undefined) === (charSpec === undefined)) {
    return fail(
      "cut: you must specify a list of bytes, characters, or fields (use -f or -c)",
      [],
      1
    )
  }
  const delim = p.values.d ?? "\t"
  if (delim.length !== 1)
    return fail("cut: the delimiter must be a single character", [], 1)
  const ranges = parseRanges(fieldSpec ?? charSpec!)
  if (!ranges) return fail("cut: invalid list of positions", [], 1)
  const inRange = (n: number) => ranges.some((r) => n >= r.from && n <= r.to)
  const { inputs, errors } = readAll("cut", p.args.slice(0, 1), read, stdin)
  const out = (inputs[0]?.lines ?? []).map((line) => {
    if (charSpec !== undefined)
      return [...line].filter((_, i) => inRange(i + 1)).join("")
    if (!line.includes(delim)) return line
    return line
      .split(delim)
      .filter((_, i) => inRange(i + 1))
      .join(delim)
  })
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

/* --------------------------------- paste -------------------------------- */

export function paste(argv: string[], read: Reader): CmdResult {
  const p = parseArgv(argv, { allowed: "" })
  if (p.unknown) return unsupportedOption("paste", p.unknown, "no options")
  if (p.args.length === 0)
    return fail(
      "paste: give two or more files (reading the keyboard is not simulated)",
      [],
      1
    )
  const { inputs, errors } = readAll("paste", p.args, read, null)
  const rows = Math.max(0, ...inputs.map((i) => i.lines.length))
  const out = Array.from({ length: rows }, (_, r) =>
    inputs.map((i) => i.lines[r] ?? "").join("\t")
  )
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

/* ----------------------------------- wc --------------------------------- */

export function wc(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { allowed: "lwc" })
  if (p.unknown) return unsupportedOption("wc", p.unknown, "-l -w -c")
  const picks = ["l", "w", "c"].filter((f) => p.flags.has(f))
  const show = picks.length ? picks : ["l", "w", "c"]
  const { inputs, errors } = readAll("wc", p.args, read, stdin)
  const rows = inputs.map((i) => {
    const text = i.lines.length ? i.lines.join("\n") + "\n" : ""
    const counts = {
      l: i.lines.length,
      w: text.split(/\s+/).filter(Boolean).length,
      c: new TextEncoder().encode(text).length,
    }
    return {
      name: i.name,
      values: show.map((f) => counts[f as "l" | "w" | "c"]),
    }
  })
  if (rows.length > 1) {
    rows.push({
      name: "total",
      values: show.map((_, k) => rows.reduce((sum, r) => sum + r.values[k], 0)),
    })
  }
  const width =
    show.length > 1 || rows.length > 1
      ? String(Math.max(0, ...rows.flatMap((r) => r.values))).length
      : 0
  const out = rows.map((r) =>
    [
      ...r.values.map((v) => String(v).padStart(width)),
      ...(r.name ? [r.name] : []),
    ].join(" ")
  )
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

/* ------------------------------ head / tail ----------------------------- */

function headTail(
  cmd: "head" | "tail",
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { valued: ["n"], allowed: "n" })
  if (p.unknown) return unsupportedOption(cmd, p.unknown, "-N or -n N")
  const raw = p.values.n
  const count = raw !== undefined ? Number(raw) : (p.num ?? 10)
  if (!Number.isInteger(count) || count < 0)
    return fail(`${cmd}: invalid number of lines: '${raw}'`)
  const { inputs, errors } = readAll(cmd, p.args, read, stdin)
  const out: string[] = []
  inputs.forEach((input, i) => {
    if (inputs.length > 1) out.push(`${i ? "\n" : ""}==> ${input.name} <==`)
    out.push(
      ...(cmd === "head"
        ? input.lines.slice(0, count)
        : count === 0
          ? []
          : input.lines.slice(-count))
    )
  })
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

export const head = (argv: string[], read: Reader, stdin: string[] | null) =>
  headTail("head", argv, read, stdin)
export const tail = (argv: string[], read: Reader, stdin: string[] | null) =>
  headTail("tail", argv, read, stdin)

/* ----------------------------------- tac -------------------------------- */

export function tac(
  argv: string[],
  read: Reader,
  stdin: string[] | null
): CmdResult {
  const p = parseArgv(argv, { allowed: "" })
  if (p.unknown) return unsupportedOption("tac", p.unknown, "no options")
  const { inputs, errors } = readAll("tac", p.args, read, stdin)
  const out = inputs.flatMap((i) => [...i.lines].reverse())
  return { out, err: errors, status: errors.length ? 1 : 0 }
}

export const TEXT_COMMANDS: Record<
  string,
  (argv: string[], read: Reader, stdin: string[] | null) => CmdResult
> = { grep, sort, uniq, nl, sed, cut, paste, wc, head, tail, tac }
