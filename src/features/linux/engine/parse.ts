/**
 * Parser for the practice shell: quotes, backslashes, brace expansion, pipes,
 * `>` / `>>`, `;` and `&&`. Variables, subshells and globs outside the current
 * directory are deliberately not supported.
 */

export interface Word {
  text: string
  /** Unquoted `*` or `?` present, so the word is expanded against the filesystem. */
  glob: boolean
  /** Starts with an unquoted `~`, which stands for the home directory. */
  tilde: boolean
}

export interface Redirect {
  op: ">" | ">>"
  target: Word
}

export interface Command {
  words: Word[]
}

export interface Pipeline {
  commands: Command[]
  redirect: Redirect | null
}

export interface Statement {
  pipeline: Pipeline
  /** How this statement is chained to the previous one. */
  join: ";" | "&&"
}

type RawToken =
  | { kind: "word"; raw: string }
  | { kind: "op"; op: "|" | ">" | ">>" | ";" | "&&" }

export class ParseError extends Error {}

function scan(line: string): RawToken[] {
  const tokens: RawToken[] = []
  let raw = ""
  let quote: "'" | '"' | null = null
  const flush = () => {
    if (raw !== "") tokens.push({ kind: "word", raw })
    raw = ""
  }
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote) {
      raw += ch
      if (ch === quote) quote = null
      else if (ch === "\\" && quote === '"' && i + 1 < line.length)
        raw += line[++i]
      continue
    }
    if (ch === "'" || ch === '"') {
      quote = ch
      raw += ch
    } else if (ch === "\\" && i + 1 < line.length) {
      raw += ch + line[++i]
    } else if (/\s/.test(ch)) {
      flush()
    } else if (ch === "|") {
      flush()
      tokens.push({ kind: "op", op: "|" })
    } else if (ch === ">") {
      flush()
      if (line[i + 1] === ">") {
        tokens.push({ kind: "op", op: ">>" })
        i++
      } else tokens.push({ kind: "op", op: ">" })
    } else if (ch === ";") {
      flush()
      tokens.push({ kind: "op", op: ";" })
    } else if (ch === "&" && line[i + 1] === "&") {
      flush()
      tokens.push({ kind: "op", op: "&&" })
      i++
    } else {
      raw += ch
    }
  }
  if (quote)
    throw new ParseError("unexpected EOF while looking for matching quote")
  flush()
  return tokens
}

/** `a/{x,y}/z` and `{1..3}` expansion. Only applied to words without quotes. */
export function expandBraces(word: string, depth = 0): string[] {
  if (depth > 20) return [word]
  let open = -1
  let level = 0
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]
    if (ch === "{") {
      if (level === 0) open = i
      level++
    } else if (ch === "}" && level > 0) {
      level--
      if (level === 0) {
        const inner = word.slice(open + 1, i)
        const parts = splitTopLevel(inner)
        const range = /^(-?\d+)\.\.(-?\d+)$/.exec(inner)
        let options: string[] | null = null
        if (parts.length > 1) options = parts
        else if (range) {
          const [from, to] = [Number(range[1]), Number(range[2])]
          options = []
          const step = from <= to ? 1 : -1
          for (
            let n = from;
            n !== to + step && options.length < 1000;
            n += step
          )
            options.push(String(n))
        }
        if (options) {
          const pre = word.slice(0, open)
          const post = word.slice(i + 1)
          return options.flatMap((o) => expandBraces(pre + o + post, depth + 1))
        }
      }
    }
  }
  return [word]
}

function splitTopLevel(text: string): string[] {
  const parts: string[] = []
  let level = 0
  let cur = ""
  for (const ch of text) {
    if (ch === "{") level++
    if (ch === "}") level--
    if (ch === "," && level === 0) {
      parts.push(cur)
      cur = ""
    } else cur += ch
  }
  parts.push(cur)
  return parts
}

/** Remove quotes/escapes from one raw word, noting whether it has live wildcards. */
function unquote(raw: string): Word {
  let text = ""
  let glob = false
  let quote: "'" | '"' | null = null
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (quote === "'") {
      if (ch === "'") quote = null
      else text += ch
    } else if (quote === '"') {
      if (ch === '"') quote = null
      else if (ch === "\\" && /["\\$`]/.test(raw[i + 1] ?? "")) text += raw[++i]
      else text += ch
    } else if (ch === "'" || ch === '"') {
      quote = ch
    } else if (ch === "\\" && i + 1 < raw.length) {
      text += raw[++i]
    } else {
      if (ch === "*" || ch === "?") glob = true
      text += ch
    }
  }
  return { text, glob, tilde: raw.startsWith("~") }
}

function toWords(raw: string): Word[] {
  const hasQuote = /['"\\]/.test(raw)
  const variants = hasQuote ? [raw] : expandBraces(raw)
  return variants.map(unquote)
}

export function parseLine(line: string): Statement[] {
  const tokens = scan(line)
  const statements: Statement[] = []
  let join: ";" | "&&" = ";"
  let commands: Command[] = []
  let words: Word[] = []
  let redirect: Redirect | null = null

  const endCommand = () => {
    if (words.length === 0) {
      if (commands.length > 0 || redirect)
        throw new ParseError("syntax error near unexpected token `|'")
      return
    }
    commands.push({ words })
    words = []
  }
  const endStatement = (nextJoin: ";" | "&&") => {
    endCommand()
    if (commands.length > 0)
      statements.push({ pipeline: { commands, redirect }, join })
    else if (nextJoin === "&&")
      throw new ParseError("syntax error near unexpected token `&&'")
    commands = []
    redirect = null
    join = nextJoin
  }

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]
    if (tok.kind === "word") {
      words.push(...toWords(tok.raw))
    } else if (tok.op === "|") {
      if (words.length === 0)
        throw new ParseError("syntax error near unexpected token `|'")
      endCommand()
    } else if (tok.op === ">" || tok.op === ">>") {
      const next = tokens[i + 1]
      if (!next || next.kind !== "word")
        throw new ParseError("syntax error near unexpected token `newline'")
      const targets = toWords(next.raw)
      if (targets.length !== 1)
        throw new ParseError(`${next.raw}: ambiguous redirect`)
      redirect = { op: tok.op, target: targets[0] }
      i++
    } else {
      endStatement(tok.op)
    }
  }
  endStatement(";")
  return statements
}
