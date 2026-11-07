/**
 * The practice shell. It interprets a small, documented subset of bash against
 * an in-memory filesystem. It never spawns processes, reads real files or opens
 * network connections; commands it cannot simulate say so instead of guessing.
 */

import { evaluateBc, BcError } from "./bc"
import { DEFAULT_DATE_FORMAT, formatDate, parseRelativeDate } from "./date"
import { parseLine, ParseError, type Pipeline, type Word } from "./parse"
import {
  fail,
  ok,
  parseArgv,
  TEXT_COMMANDS,
  toLines,
  type CmdResult,
  type Reader,
} from "./text-commands"
import {
  HOME,
  byteLength,
  cloneNode,
  createSeedFilesystem,
  displayPath,
  getNode,
  globToRegExp,
  humanSize,
  matchesGlob,
  modeToSymbolic,
  newDir,
  newFile,
  removeNode,
  resolveSegments,
  toPath,
  type DirNode,
  type VNode,
} from "./vfs"

export interface OutLine {
  kind: "out" | "err" | "info"
  text: string
}

export interface RunResult {
  lines: OutLine[]
  /** The `clear` command ran; the UI should empty the screen. */
  clear?: boolean
}

type Pending =
  | { kind: "write"; segments: string[]; append: boolean; lines: string[] }
  | {
      kind: "confirm"
      queue: { segments: string[]; question: string }[]
      recursive: boolean
    }

interface Process {
  pid: number
  user: string
  command: string
}

const USER = "student"
const HOST = "linuxbox"
const SAMPLE_NOTE =
  "Sample output for practice. It is not read from your computer."

/** Commands the sandbox recognises but will not run, with the honest reason. */
export const NOT_SIMULATED: Record<string, string> = {
  reboot: "it would restart a machine",
  init: "it would shut down or restart a machine",
  sudo: "the sandbox never has administrator rights",
  service: "it controls system services",
  apt: "it installs and removes software",
  "apt-get": "it installs and removes software",
  adduser: "it changes user accounts",
  deluser: "it changes user accounts",
  passwd: "it changes passwords",
  ssh: "it opens a network connection",
  sftp: "it opens a network connection",
  scp: "it opens a network connection",
  xcalc: "it opens a desktop window",
  "gnome-open": "it opens a desktop window",
  eog: "it opens a desktop window",
  "xdg-open": "it opens a desktop window",
}

const HELP: [string, string][] = [
  ["pwd, cd, ls", "move around and list (ls -a -l -r -t -h)"],
  [
    "mkdir, rmdir, touch, rm",
    "create and remove (mkdir -p, rm -r -f -i, *.txt globs)",
  ],
  [
    "cat, tac, more, head, tail, nl",
    "view files (cat > file ends with EOF or Ctrl+D)",
  ],
  ["grep, find", "search (grep -i -v -o, ^ and $ anchors; find . -name)"],
  ["wc, sort, uniq, sed, cut, paste", "text processing"],
  ["mv, cp", "rename, move, copy"],
  ["echo, bc, tee, > and >>, |", "pipes and redirects"],
  ["chmod NNN file", "numeric permissions; ls -l shows them"],
  ["date, whoami, hostname, history, clear", "utilities"],
  [
    "ps -eaf, top, kill -9 PID, df, du -sh, free -h, lscpu, uname -a, ifconfig",
    "system views (sample data)",
  ],
]

const dirOf = (path: string) =>
  path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : ""

export class Sandbox {
  private root: DirNode
  private cwd: string[] = [...HOME]
  private prevCwd: string[] | null = null
  private pending: Pending | null = null
  private processes: Process[]
  readonly history: string[] = []

  private readonly now: () => Date

  constructor(now: () => Date = () => new Date()) {
    this.now = now
    this.root = createSeedFilesystem(this.now().getTime())
    this.processes = [
      { pid: 1, user: "root", command: "/sbin/init" },
      { pid: 412, user: "root", command: "/usr/sbin/sshd -D" },
      { pid: 977, user: USER, command: "-bash" },
      { pid: 1234, user: USER, command: "python3 app.py" },
      { pid: 1302, user: USER, command: "sleep 600" },
    ]
  }

  /* ------------------------------ public API ----------------------------- */

  get prompt(): string {
    if (this.pending?.kind === "write") return ">"
    if (this.pending?.kind === "confirm") return ""
    return `${USER}@${HOST}:${displayPath(this.cwd)}$`
  }

  get awaitingInput(): "write" | "confirm" | null {
    return this.pending?.kind ?? null
  }

  get cwdPath(): string {
    return toPath(this.cwd)
  }

  /** Read-only view used by challenge checks and tests. */
  inspect(
    path: string
  ):
    | { type: "dir" }
    | { type: "file"; content: string; symbolic: string }
    | null {
    const node = getNode(this.root, resolveSegments(path, this.cwd))
    if (!node) return null
    return node.type === "dir"
      ? { type: "dir" }
      : {
          type: "file",
          content: node.content,
          symbolic: modeToSymbolic(node.mode),
        }
  }

  /** Run one line typed at the prompt. */
  run(line: string): RunResult {
    if (this.pending) return this.answerPending(line)
    const text = line.trim()
    if (!text) return { lines: [] }
    this.history.push(text)
    const lines: OutLine[] = []
    // Reference rows such as `sftp> get file.txt` are typed inside an sftp session, which needs a network connection.
    if (/^sftp>/.test(text)) {
      lines.push({
        kind: "info",
        text: "sftp> lines are typed inside an sftp session. That needs a network connection, so it is not simulated here.",
      })
      return { lines }
    }
    let clear = false
    try {
      const statements = parseLine(text)
      let status = 0
      for (const st of statements) {
        if (st.join === "&&" && status !== 0) continue
        const outcome = this.runPipeline(st.pipeline, lines)
        status = outcome.status
        clear ||= outcome.clear
      }
    } catch (e) {
      if (e instanceof ParseError)
        lines.push({ kind: "err", text: `bash: ${e.message}` })
      else throw e
    }
    return { lines, clear }
  }

  /** Ctrl+D: finish a `cat > file` session. */
  endInput(): RunResult {
    if (this.pending?.kind !== "write") return { lines: [] }
    return this.finishWrite()
  }

  /* ----------------------------- pending input --------------------------- */

  private answerPending(line: string): RunResult {
    const pending = this.pending!
    if (pending.kind === "write") {
      if (line === "EOF") return this.finishWrite()
      pending.lines.push(line)
      return { lines: [] }
    }
    const lines: OutLine[] = []
    const current = pending.queue.shift()!
    if (/^y(es)?$/i.test(line.trim())) this.removeTree(current.segments)
    this.pending = null
    this.askNext(pending.queue, pending.recursive, lines)
    return { lines }
  }

  private finishWrite(): RunResult {
    const pending = this.pending as Extract<Pending, { kind: "write" }>
    this.pending = null
    const lines: OutLine[] = []
    const body = pending.lines.length ? pending.lines.join("\n") + "\n" : ""
    this.writeFile(pending.segments, body, pending.append, "cat", lines)
    return { lines }
  }

  private askNext(
    queue: { segments: string[]; question: string }[],
    recursive: boolean,
    lines: OutLine[]
  ) {
    if (queue.length === 0) return
    this.pending = { kind: "confirm", queue, recursive }
    lines.push({ kind: "out", text: queue[0].question })
  }

  /* ------------------------------- executor ------------------------------ */

  private runPipeline(
    pipeline: Pipeline,
    lines: OutLine[]
  ): { status: number; clear: boolean } {
    let stdin: string[] | null = null
    let result: CmdResult = ok()
    let clear = false

    const only = pipeline.commands.length === 1 ? pipeline.commands[0] : null
    if (
      only &&
      only.words.length === 1 &&
      only.words[0].text === "cat" &&
      pipeline.redirect
    ) {
      const target = this.expandWord(pipeline.redirect.target)
      this.pending = {
        kind: "write",
        segments: resolveSegments(target, this.cwd),
        append: pipeline.redirect.op === ">>",
        lines: [],
      }
      lines.push({
        kind: "info",
        text: "Type your text; finish with a line that says EOF, or press Ctrl+D.",
      })
      return { status: 0, clear }
    }

    for (const command of pipeline.commands) {
      const argv = command.words.flatMap((w) => this.expandGlob(w))
      if (argv[0] === "clear") clear = true
      result = this.execute(argv, stdin)
      for (const text of result.err) lines.push({ kind: "err", text })
      stdin = result.out
    }

    const redirect = pipeline.redirect
    if (redirect) {
      const target = this.expandWord(redirect.target)
      const body = result.out.length ? result.out.join("\n") + "\n" : ""
      const wrote = this.writeFile(
        resolveSegments(target, this.cwd),
        body,
        redirect.op === ">>",
        "bash",
        lines,
        target
      )
      if (!wrote) return { status: 1, clear }
    } else {
      for (const text of result.out) lines.push({ kind: "out", text })
    }
    for (const text of result.info ?? []) lines.push({ kind: "info", text })
    return { status: result.status, clear }
  }

  /** Apply `~` to one word. */
  private expandWord(word: Word): string {
    if (word.tilde && (word.text === "~" || word.text.startsWith("~/")))
      return toPath(HOME) + word.text.slice(1)
    return word.text
  }

  /** Expand an unquoted wildcard against the filesystem; no match leaves the word unchanged. */
  private expandGlob(word: Word): string[] {
    const text = this.expandWord(word)
    if (!word.glob) return [text]
    const prefix = dirOf(text)
    const pattern = text.slice(prefix.length)
    if (/[*?]/.test(prefix)) return [text]
    const dir = getNode(this.root, resolveSegments(prefix || ".", this.cwd))
    if (!dir || dir.type !== "dir") return [text]
    const matches = Object.keys(dir.children)
      .filter((name) => matchesGlob(name, pattern))
      .sort()
      .map((name) => prefix + name)
    return matches.length ? matches : [text]
  }

  private readonly reader = (): Reader => (name) => {
    const node = getNode(this.root, resolveSegments(name, this.cwd))
    if (!node) return { error: "No such file or directory" }
    if (node.type === "dir") return { error: "Is a directory" }
    return { lines: toLines(node.content) }
  }

  private execute(argv: string[], stdin: string[] | null): CmdResult {
    const [name, ...args] = argv
    if (!name) return ok()
    const textCommand = TEXT_COMMANDS[name]
    if (textCommand) return textCommand(args, this.reader(), stdin)
    switch (name) {
      case "help":
        return ok([
          "Commands this sandbox can run:",
          ...HELP.map(([cmds, what]) => `  ${cmds.padEnd(34)} ${what}`),
          "",
          "Up/Down: history. Ctrl+L: clear. Everything here is virtual: nothing touches your real files.",
        ])
      case "clear":
        return ok()
      case "pwd":
        return ok([toPath(this.cwd)])
      case "whoami":
        return ok([USER])
      case "hostname":
        return args.includes("-I")
          ? ok(["192.168.1.10"], [SAMPLE_NOTE])
          : ok([HOST])
      case "history":
        return ok(
          this.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`)
        )
      case "echo":
        return ok([args.join(" ")])
      case "cd":
        return this.cd(args)
      case "ls":
        return this.ls(args)
      case "mkdir":
        return this.mkdir(args)
      case "rmdir":
        return this.rmdir(args)
      case "touch":
        return this.touch(args)
      case "rm":
        return this.rm(args)
      case "cat":
      case "more":
        return this.cat(name, args, stdin)
      case "mv":
        return this.mvOrCp("mv", args)
      case "cp":
        return this.mvOrCp("cp", args)
      case "find":
        return this.find(args)
      case "chmod":
        return this.chmod(args)
      case "date":
        return this.date(args)
      case "bc":
        return this.bc(stdin)
      case "tee":
        return this.tee(args, stdin)
      case "du":
        return this.du(args)
      case "ps":
        return this.ps()
      case "top":
        return this.top()
      case "kill":
        return this.kill(args)
      case "df":
        return ok(
          [
            "Filesystem     Type   Size  Used Avail Use% Mounted on",
            "/dev/sda1      ext4    50G   18G   30G  38% /",
            "tmpfs          tmpfs  2.0G     0  2.0G   0% /dev/shm",
          ],
          [SAMPLE_NOTE]
        )
      case "free":
        return ok(
          [
            "               total        used        free      shared  buff/cache   available",
            "Mem:           7.7Gi       2.1Gi       3.9Gi       112Mi       1.7Gi       5.3Gi",
            "Swap:          2.0Gi          0B       2.0Gi",
          ],
          [SAMPLE_NOTE]
        )
      case "lscpu":
        return ok(
          [
            "Architecture:             x86_64",
            "CPU(s):                   4",
            "Model name:               Sample CPU @ 2.40GHz",
            "Thread(s) per core:       2",
            "Core(s) per socket:       2",
          ],
          [SAMPLE_NOTE]
        )
      case "uname":
        return ok(
          [
            args.includes("-a")
              ? `Linux ${HOST} 6.8.0-sample #1 SMP x86_64 GNU/Linux`
              : "Linux",
          ],
          [SAMPLE_NOTE]
        )
      case "ifconfig":
        return ok(
          [
            "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
            "        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255",
            "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
            "        inet 127.0.0.1  netmask 255.0.0.0",
          ],
          [SAMPLE_NOTE]
        )
      default: {
        const reason = NOT_SIMULATED[name]
        if (reason) {
          return {
            out: [],
            err: [],
            info: [
              `${name}: not simulated here, because ${reason}. The Commands tab explains what it does.`,
            ],
            status: 1,
          }
        }
        return fail(`bash: ${name}: command not found`, [], 127)
      }
    }
  }

  /* ------------------------------ filesystem ----------------------------- */

  private node(path: string): VNode | null {
    return getNode(this.root, resolveSegments(path, this.cwd))
  }

  private parent(segments: string[]): DirNode | null {
    const p = getNode(this.root, segments.slice(0, -1))
    return p && p.type === "dir" ? p : null
  }

  private touchTime(): number {
    return this.now().getTime()
  }

  private writeFile(
    segments: string[],
    body: string,
    append: boolean,
    cmd: string,
    lines: OutLine[],
    shown?: string
  ): boolean {
    const name = segments[segments.length - 1]
    const parent = this.parent(segments)
    const label = shown ?? toPath(segments)
    if (!name || !parent) {
      lines.push({
        kind: "err",
        text: `${cmd}: ${label}: No such file or directory`,
      })
      return false
    }
    const existing = parent.children[name]
    if (existing?.type === "dir") {
      lines.push({ kind: "err", text: `${cmd}: ${label}: Is a directory` })
      return false
    }
    const now = this.touchTime()
    if (existing) {
      existing.content = append ? existing.content + body : body
      existing.mtime = now
    } else {
      parent.children[name] = newFile(body, now)
    }
    parent.mtime = now
    return true
  }

  private cd(args: string[]): CmdResult {
    if (args.length > 1) return fail("bash: cd: too many arguments")
    let target: string[]
    let echoPath = false
    if (args.length === 0 || args[0] === "~") target = [...HOME]
    else if (args[0] === "-") {
      if (!this.prevCwd) return fail("bash: cd: OLDPWD not set")
      target = [...this.prevCwd]
      echoPath = true
    } else target = resolveSegments(args[0], this.cwd)
    const node = getNode(this.root, target)
    if (!node) return fail(`bash: cd: ${args[0]}: No such file or directory`)
    if (node.type !== "dir")
      return fail(`bash: cd: ${args[0]}: Not a directory`)
    this.prevCwd = this.cwd
    this.cwd = target
    return ok(echoPath ? [toPath(target)] : [])
  }

  private ls(argv: string[]): CmdResult {
    const p = parseArgv(argv, { allowed: "alrth" })
    if (p.unknown)
      return fail(
        `ls: option -${p.unknown} is not simulated here (supported: -a -l -r -t -h)`,
        [],
        2
      )
    const targets = p.args.length ? p.args : ["."]
    const out: string[] = []
    const err: string[] = []
    const files: string[] = []
    const dirs: { label: string; node: DirNode }[] = []
    for (const t of targets) {
      const node = this.node(t)
      if (!node) err.push(`ls: cannot access '${t}': No such file or directory`)
      else if (node.type === "file") files.push(t)
      else dirs.push({ label: t, node })
    }
    if (files.length) {
      const entries = files.map((f) => ({ name: f, node: this.node(f)! }))
      out.push(...this.formatEntries(entries, p.flags))
    }
    dirs.forEach(({ label, node }, idx) => {
      if (targets.length > 1)
        out.push(`${out.length || idx ? "\n" : ""}${label}:`)
      let entries = Object.entries(node.children).map(([name, child]) => ({
        name,
        node: child as VNode,
      }))
      if (p.flags.has("a")) {
        const parentSeg = resolveSegments(label, this.cwd).slice(0, -1)
        entries.push(
          { name: ".", node },
          { name: "..", node: getNode(this.root, parentSeg) ?? node }
        )
      } else entries = entries.filter((e) => !e.name.startsWith("."))
      out.push(...this.formatEntries(entries, p.flags))
    })
    return { out, err, status: err.length ? 2 : 0 }
  }

  private formatEntries(
    entries: { name: string; node: VNode }[],
    flags: Set<string>
  ): string[] {
    const sorted = [...entries].sort((a, b) =>
      flags.has("t")
        ? b.node.mtime - a.node.mtime || a.name.localeCompare(b.name)
        : a.name
            .replace(/^\./, "")
            .localeCompare(b.name.replace(/^\./, ""), "en")
    )
    if (flags.has("r")) sorted.reverse()
    if (!flags.has("l"))
      return [sorted.map((e) => e.name).join("  ")].filter(Boolean)
    const rows = sorted.map((e) =>
      this.longColumns(e.name, e.node, flags.has("h"))
    )
    const widths = [1, 3].map((col) =>
      Math.max(...rows.map((r) => r[col].length))
    )
    const lines = rows.map((r) =>
      [
        r[0],
        r[1].padStart(widths[0]),
        r[2],
        r[2],
        r[3].padStart(widths[1]),
        r[4],
        r[5],
      ].join(" ")
    )
    return [`total ${rows.length * 4}`, ...lines]
  }

  /** `[perms, links, owner, size, date, name]` for one `ls -l` row. */
  private longColumns(
    name: string,
    node: VNode,
    human: boolean
  ): [string, string, string, string, string, string] {
    const type = node.type === "dir" ? "d" : "-"
    const links =
      node.type === "dir"
        ? 2 +
          Object.values(node.children).filter((c) => c.type === "dir").length
        : 1
    const bytes = node.type === "dir" ? 4096 : byteLength(node.content)
    const d = new Date(node.mtime)
    const recent = this.now().getTime() - node.mtime < 182 * 86_400_000
    return [
      type + modeToSymbolic(node.mode),
      String(links),
      USER,
      human ? humanSize(bytes) : String(bytes),
      formatDate(d, recent ? "%b %e %H:%M" : "%b %e  %Y"),
      name,
    ]
  }

  private mkdir(argv: string[]): CmdResult {
    const p = parseArgv(argv, { allowed: "p" })
    if (p.unknown)
      return fail(
        `mkdir: option -${p.unknown} is not simulated here (supported: -p)`,
        [],
        1
      )
    if (p.args.length === 0) return fail("mkdir: missing operand")
    const err: string[] = []
    const now = this.touchTime()
    for (const arg of p.args) {
      const segs = resolveSegments(arg, this.cwd)
      if (p.flags.has("p")) {
        let node: DirNode = this.root
        for (const seg of segs) {
          const next: VNode | undefined = Object.hasOwn(node.children, seg)
            ? node.children[seg]
            : undefined
          if (!next) {
            const d = newDir(now)
            node.children[seg] = d
            node.mtime = now
            node = d
          } else if (next.type === "dir") node = next
          else {
            err.push(`mkdir: cannot create directory '${arg}': Not a directory`)
            break
          }
        }
      } else {
        const parent = this.parent(segs)
        const name = segs[segs.length - 1]
        if (!parent || !name)
          err.push(
            `mkdir: cannot create directory '${arg}': No such file or directory`
          )
        else if (Object.hasOwn(parent.children, name))
          err.push(`mkdir: cannot create directory '${arg}': File exists`)
        else {
          parent.children[name] = newDir(now)
          parent.mtime = now
        }
      }
    }
    return { out: [], err, status: err.length ? 1 : 0 }
  }

  private rmdir(args: string[]): CmdResult {
    if (args.length === 0) return fail("rmdir: missing operand")
    const err: string[] = []
    for (const arg of args) {
      const segs = resolveSegments(arg, this.cwd)
      const node = getNode(this.root, segs)
      if (!node)
        err.push(`rmdir: failed to remove '${arg}': No such file or directory`)
      else if (node.type !== "dir")
        err.push(`rmdir: failed to remove '${arg}': Not a directory`)
      else if (Object.keys(node.children).length)
        err.push(`rmdir: failed to remove '${arg}': Directory not empty`)
      else removeNode(this.root, segs)
    }
    this.repairCwd()
    return { out: [], err, status: err.length ? 1 : 0 }
  }

  private touch(args: string[]): CmdResult {
    if (args.length === 0) return fail("touch: missing file operand")
    const err: string[] = []
    const now = this.touchTime()
    for (const arg of args) {
      const segs = resolveSegments(arg, this.cwd)
      const node = getNode(this.root, segs)
      const parent = this.parent(segs)
      if (node) node.mtime = now
      else if (parent) {
        parent.children[segs[segs.length - 1]] = newFile("", now)
        parent.mtime = now
      } else err.push(`touch: cannot touch '${arg}': No such file or directory`)
    }
    return { out: [], err, status: err.length ? 1 : 0 }
  }

  private rm(argv: string[]): CmdResult {
    const p = parseArgv(argv, { allowed: "rRfi" })
    if (p.unknown)
      return fail(
        `rm: option -${p.unknown} is not simulated here (supported: -r -f -i)`,
        [],
        1
      )
    if (p.args.length === 0)
      return p.flags.has("f") ? ok() : fail("rm: missing operand")
    const recursive = p.flags.has("r") || p.flags.has("R")
    const err: string[] = []
    const queue: { segments: string[]; question: string }[] = []
    const lines: OutLine[] = []
    for (const arg of p.args) {
      const segs = resolveSegments(arg, this.cwd)
      const node = getNode(this.root, segs)
      if (segs.length === 0) {
        err.push(`rm: it is dangerous to operate recursively on '/'`)
        continue
      }
      if (!node) {
        if (!p.flags.has("f"))
          err.push(`rm: cannot remove '${arg}': No such file or directory`)
        continue
      }
      if (node.type === "dir" && !recursive) {
        err.push(`rm: cannot remove '${arg}': Is a directory`)
        continue
      }
      if (p.flags.has("i")) {
        const kind =
          node.type === "dir"
            ? "directory"
            : node.content === ""
              ? "regular empty file"
              : "regular file"
        queue.push({
          segments: segs,
          question: `rm: remove ${kind} '${arg}'? `,
        })
      } else this.removeTree(segs)
    }
    this.askNext(queue, recursive, lines)
    this.repairCwd()
    return {
      out: lines.filter((l) => l.kind === "out").map((l) => l.text),
      err,
      status: err.length ? 1 : 0,
    }
  }

  private removeTree(segments: string[]) {
    removeNode(this.root, segments)
    this.repairCwd()
  }

  /** If the working directory was deleted, fall back to its nearest existing parent. */
  private repairCwd() {
    while (this.cwd.length && getNode(this.root, this.cwd)?.type !== "dir")
      this.cwd = this.cwd.slice(0, -1)
  }

  private cat(name: string, args: string[], stdin: string[] | null): CmdResult {
    if (args.length === 0) {
      if (stdin) return ok(stdin)
      return fail(`${name}: no input. To write a file, use: cat > file.txt`)
    }
    const read = this.reader()
    const out: string[] = []
    const err: string[] = []
    for (const arg of args) {
      const r = read(arg)
      if ("error" in r) err.push(`${name}: ${arg}: ${r.error}`)
      else out.push(...r.lines)
    }
    return { out, err, status: err.length ? 1 : 0 }
  }

  private mvOrCp(cmd: "mv" | "cp", argv: string[]): CmdResult {
    const p = parseArgv(argv, { allowed: cmd === "cp" ? "rR" : "" })
    if (p.unknown)
      return fail(`${cmd}: option -${p.unknown} is not simulated here`, [], 1)
    if (p.args.length < 2) {
      return fail(
        p.args.length === 0
          ? `${cmd}: missing file operand`
          : `${cmd}: missing destination file operand after '${p.args[0]}'`
      )
    }
    const recursive = p.flags.has("r") || p.flags.has("R")
    const destArg = p.args[p.args.length - 1]
    const sources = p.args.slice(0, -1)
    const destSegs = resolveSegments(destArg, this.cwd)
    const destNode = getNode(this.root, destSegs)
    const destIsDir = destNode?.type === "dir"
    if (sources.length > 1 && !destIsDir)
      return fail(`${cmd}: target '${destArg}' is not a directory`)
    const err: string[] = []
    const now = this.touchTime()
    for (const src of sources) {
      const srcSegs = resolveSegments(src, this.cwd)
      const node = getNode(this.root, srcSegs)
      if (!node) {
        err.push(`${cmd}: cannot stat '${src}': No such file or directory`)
        continue
      }
      if (cmd === "cp" && node.type === "dir" && !recursive) {
        err.push(`cp: -r not specified; omitting directory '${src}'`)
        continue
      }
      const finalSegs = destIsDir
        ? [...destSegs, srcSegs[srcSegs.length - 1]]
        : destSegs
      const finalParent = this.parent(finalSegs)
      if (!finalParent || finalSegs.length === 0) {
        err.push(
          `${cmd}: cannot create regular file '${destArg}': No such file or directory`
        )
        continue
      }
      if (finalSegs.join("/") === srcSegs.join("/")) {
        err.push(`${cmd}: '${src}' and '${destArg}' are the same file`)
        continue
      }
      if (
        node.type === "dir" &&
        finalSegs.join("/").startsWith(srcSegs.join("/") + "/")
      ) {
        err.push(
          `${cmd}: cannot ${cmd === "mv" ? "move" : "copy"} '${src}' to a subdirectory of itself, '${destArg}'`
        )
        continue
      }
      const existing = finalParent.children[finalSegs[finalSegs.length - 1]]
      if (existing?.type === "dir" && node.type !== "dir") {
        err.push(
          `${cmd}: cannot overwrite directory '${destArg}' with non-directory`
        )
        continue
      }
      finalParent.children[finalSegs[finalSegs.length - 1]] = cloneNode(
        node,
        cmd === "mv" ? node.mtime : now
      )
      finalParent.mtime = now
      if (cmd === "mv") removeNode(this.root, srcSegs)
    }
    this.repairCwd()
    return { out: [], err, status: err.length ? 1 : 0 }
  }

  private find(argv: string[]): CmdResult {
    const starts: string[] = []
    let i = 0
    while (i < argv.length && !argv[i].startsWith("-")) starts.push(argv[i++])
    let name: string | null = null
    let type: string | null = null
    for (; i < argv.length; i += 2) {
      if (argv[i] === "-name" && argv[i + 1] !== undefined) name = argv[i + 1]
      else if (argv[i] === "-type" && argv[i + 1] !== undefined)
        type = argv[i + 1]
      else
        return fail(
          `find: ${argv[i]}: this expression is not simulated here (supported: -name PATTERN, -type f|d)`
        )
    }
    const out: string[] = []
    const err: string[] = []
    const re = name ? globToRegExp(name) : null
    const visit = (shown: string, node: VNode, base: string) => {
      const typeOk =
        type === null ||
        (type === "f" && node.type === "file") ||
        (type === "d" && node.type === "dir")
      if (typeOk && (!re || re.test(base))) out.push(shown)
      if (node.type === "dir") {
        for (const child of Object.keys(node.children).sort()) {
          visit(
            `${shown.replace(/\/$/, "")}/${child}`,
            node.children[child],
            child
          )
        }
      }
    }
    for (const start of starts.length ? starts : ["."]) {
      const segs = resolveSegments(start, this.cwd)
      const node = getNode(this.root, segs)
      if (!node) err.push(`find: '${start}': No such file or directory`)
      else
        visit(
          start,
          node,
          start === "." || start === ".."
            ? start
            : (segs[segs.length - 1] ?? "/")
        )
    }
    return { out, err, status: err.length ? 1 : 0 }
  }

  private chmod(args: string[]): CmdResult {
    if (args.length === 0) return fail("chmod: missing operand")
    const [mode, ...files] = args
    if (files.length === 0)
      return fail(`chmod: missing operand after '${mode}'`)
    if (!/^[0-7]{3}$/.test(mode)) {
      if (/^[ugoa]*[-+=][rwxX]+$/.test(mode)) {
        return fail(
          `chmod: symbolic modes like '${mode}' are not simulated here. Use a 3-digit number such as 742.`
        )
      }
      return fail(`chmod: invalid mode: '${mode}'`)
    }
    const err: string[] = []
    for (const f of files) {
      const node = this.node(f)
      if (!node)
        err.push(`chmod: cannot access '${f}': No such file or directory`)
      else node.mode = parseInt(mode, 8)
    }
    return { out: [], err, status: err.length ? 1 : 0 }
  }

  private date(argv: string[]): CmdResult {
    const p = parseArgv(argv, { valued: ["d"], valuedLong: ["date"] })
    const format = p.args.find((a) => a.startsWith("+"))
    const stray = p.args.filter((a) => !a.startsWith("+"))
    if (stray.length) return fail(`date: invalid date '${stray[0]}'`)
    const expression = p.values.date ?? p.values.d
    const base = this.now()
    const when =
      expression === undefined ? base : parseRelativeDate(expression, base)
    if (!when) {
      return fail(
        `date: invalid date '${expression}' (the sandbox understands: tomorrow, yesterday, "2 year ago", "5 sec ago", "next tue")`
      )
    }
    return ok([
      formatDate(when, format ? format.slice(1) : DEFAULT_DATE_FORMAT),
    ])
  }

  private bc(stdin: string[] | null): CmdResult {
    if (!stdin)
      return fail(
        'bc: interactive mode is not simulated. Pipe an expression in: echo "10+20" | bc'
      )
    try {
      return ok(stdin.map(evaluateBc).filter((l) => l !== ""))
    } catch (e) {
      if (e instanceof BcError) return fail(`bc: ${e.message}`)
      throw e
    }
  }

  private tee(argv: string[], stdin: string[] | null): CmdResult {
    const p = parseArgv(argv, { allowed: "a" })
    if (p.unknown)
      return fail(
        `tee: option -${p.unknown} is not simulated here (supported: -a)`,
        [],
        1
      )
    const input = stdin ?? []
    const body = input.length ? input.join("\n") + "\n" : ""
    const lines: OutLine[] = []
    for (const f of p.args)
      this.writeFile(
        resolveSegments(f, this.cwd),
        body,
        p.flags.has("a"),
        "tee",
        lines,
        f
      )
    return {
      out: input,
      err: lines.map((l) => l.text),
      status: lines.length ? 1 : 0,
    }
  }

  private du(argv: string[]): CmdResult {
    const p = parseArgv(argv, { allowed: "sh" })
    if (p.unknown)
      return fail(
        `du: option -${p.unknown} is not simulated here (supported: -s -h)`,
        [],
        1
      )
    const usage = (node: VNode): number =>
      node.type === "file"
        ? Math.ceil(byteLength(node.content) / 4096) * 4096
        : 4096 + Object.values(node.children).reduce((s, c) => s + usage(c), 0)
    const err: string[] = []
    const out = (p.args.length ? p.args : ["."]).flatMap((arg) => {
      const node = this.node(arg)
      if (!node) {
        err.push(`du: cannot access '${arg}': No such file or directory`)
        return []
      }
      const bytes = usage(node)
      return [
        `${p.flags.has("h") ? (bytes === 0 ? "0" : humanSize(bytes).replace(/^(\d+)([KMG])$/, "$1.0$2")) : Math.ceil(bytes / 1024)}\t${arg}`,
      ]
    })
    return { out, err, status: err.length ? 1 : 0 }
  }

  private ps(): CmdResult {
    const rows = this.processes.map(
      (pr) =>
        `${pr.user.padEnd(8)} ${String(pr.pid).padStart(5)} ${pr.pid === 1 ? "    0" : "    1"}  0 09:00 ?        00:00:0${pr.pid % 7} ${pr.command}`
    )
    return ok(
      ["UID        PID  PPID  C STIME TTY          TIME CMD", ...rows],
      [
        "Processes in the sandbox are simulated. kill -9 PID removes one from this list.",
      ]
    )
  }

  private top(): CmdResult {
    const rows = this.processes.map(
      (pr) =>
        `${String(pr.pid).padStart(6)} ${pr.user.padEnd(8)}  20   0   12345   4321   3210 S   0.${pr.pid % 10}   0.${pr.pid % 5} 0:00.0${pr.pid % 9} ${pr.command}`
    )
    return ok(
      [
        "top - 09:00:00 up 1 day,  2 users,  load average: 0.10, 0.08, 0.05",
        `Tasks: ${this.processes.length} total,   1 running,  ${this.processes.length - 1} sleeping`,
        "    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
        ...rows,
      ],
      [
        SAMPLE_NOTE,
        "A real top keeps updating until you press q; here you get one snapshot.",
      ]
    )
  }

  private kill(argv: string[]): CmdResult {
    const p = parseArgv(argv.map((a) => (a === "-9" ? "--signal-9" : a)))
    const pids = p.args
    if (pids.length === 0) return fail("kill: usage: kill [-9] PID")
    const err: string[] = []
    for (const arg of pids) {
      const pid = Number(arg)
      if (!Number.isInteger(pid)) {
        err.push(`bash: kill: ${arg}: arguments must be process or job IDs`)
        continue
      }
      const target = this.processes.find((pr) => pr.pid === pid)
      if (!target) err.push(`bash: kill: (${pid}) - No such process`)
      else if (target.user !== USER)
        err.push(`bash: kill: (${pid}) - Operation not permitted`)
      else this.processes = this.processes.filter((pr) => pr.pid !== pid)
    }
    return { out: [], err, status: err.length ? 1 : 0 }
  }
}
