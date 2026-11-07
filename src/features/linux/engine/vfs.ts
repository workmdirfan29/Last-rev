/**
 * In-memory virtual filesystem for the practice terminal. Nothing here touches
 * the real OS: every node lives in a plain object that is thrown away with the
 * session.
 */

export interface FileNode {
  type: "file"
  content: string
  /** Permission bits, e.g. 0o644. */
  mode: number
  mtime: number
}

export interface DirNode {
  type: "dir"
  children: Record<string, VNode>
  mode: number
  mtime: number
}

export type VNode = FileNode | DirNode

export const HOME = ["home", "student"] as const

export const newFile = (
  content: string,
  mtime: number,
  mode = 0o644
): FileNode => ({
  type: "file",
  content,
  mode,
  mtime,
})

export const newDir = (mtime: number, mode = 0o755): DirNode => ({
  type: "dir",
  children: {},
  mode,
  mtime,
})

/** Resolve `path` against `cwd` into absolute segments. `..` at the root stays at the root. */
export function resolveSegments(
  path: string,
  cwd: readonly string[]
): string[] {
  let base: string[]
  let rest = path
  if (rest === "~" || rest.startsWith("~/")) {
    base = [...HOME]
    rest = rest.slice(1)
  } else if (rest.startsWith("/")) {
    base = []
  } else {
    base = [...cwd]
  }
  for (const part of rest.split("/")) {
    if (part === "" || part === ".") continue
    if (part === "..") base.pop()
    else base.push(part)
  }
  return base
}

export function getNode(
  root: DirNode,
  segments: readonly string[]
): VNode | null {
  let node: VNode = root
  for (const seg of segments) {
    if (node.type !== "dir") return null
    const next: VNode | undefined = Object.hasOwn(node.children, seg)
      ? node.children[seg]
      : undefined
    if (!next) return null
    node = next
  }
  return node
}

export const toPath = (segments: readonly string[]) => "/" + segments.join("/")

/** `~`-abbreviated path for the prompt. */
export function displayPath(segments: readonly string[]): string {
  const full = toPath(segments)
  const home = toPath(HOME)
  if (full === home) return "~"
  if (full.startsWith(home + "/")) return "~" + full.slice(home.length)
  return full
}

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

export function sizeOf(node: VNode): number {
  if (node.type === "file") return byteLength(node.content)
  return Object.values(node.children).reduce(
    (sum, child) => sum + sizeOf(child),
    4096
  )
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}`
  const units = ["K", "M", "G"]
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value < 10 ? value.toFixed(1) : Math.ceil(value)}${units[i]}`
}

/** `rwxr-xr--` for the nine permission bits. */
export function modeToSymbolic(mode: number): string {
  const tri = (d: number) =>
    (d & 4 ? "r" : "-") + (d & 2 ? "w" : "-") + (d & 1 ? "x" : "-")
  return tri((mode >> 6) & 7) + tri((mode >> 3) & 7) + tri(mode & 7)
}

/** Shell-style wildcard (`*`, `?`) to a RegExp. `dotfiles` controls whether a leading dot matches. */
export function globToRegExp(pattern: string): RegExp {
  const body = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")
  return new RegExp(`^${body}$`, "s")
}

export function matchesGlob(
  name: string,
  pattern: string,
  dotfiles = false
): boolean {
  if (!dotfiles && name.startsWith(".") && !pattern.startsWith("."))
    return false
  return globToRegExp(pattern).test(name)
}

/** Remove a node; returns false if it does not exist. */
export function removeNode(
  root: DirNode,
  segments: readonly string[]
): boolean {
  if (segments.length === 0) return false
  const parent = getNode(root, segments.slice(0, -1))
  const name = segments[segments.length - 1]
  if (!parent || parent.type !== "dir" || !Object.hasOwn(parent.children, name))
    return false
  delete parent.children[name]
  return true
}

export function cloneNode(node: VNode, mtime: number): VNode {
  if (node.type === "file") return { ...node, mtime }
  const copy = newDir(mtime, node.mode)
  for (const [name, child] of Object.entries(node.children))
    copy.children[name] = cloneNode(child, mtime)
  return copy
}

/** Starting filesystem, built from the reference file's practice sandbox. */
export function createSeedFilesystem(now: number): DirNode {
  const hour = 3_600_000
  const at = (hoursAgo: number) => now - hoursAgo * hour
  const root = newDir(at(500))
  const dir = (
    parent: DirNode,
    name: string,
    hoursAgo: number,
    mode = 0o755
  ) => {
    const d = newDir(at(hoursAgo), mode)
    parent.children[name] = d
    return d
  }
  const file = (
    parent: DirNode,
    name: string,
    content: string,
    hoursAgo: number,
    mode = 0o644
  ) => {
    parent.children[name] = newFile(content, at(hoursAgo), mode)
  }

  const home = dir(root, "home", 400)
  const student = dir(home, "student", 1, 0o755)
  dir(root, "tmp", 2, 0o777)
  const varDir = dir(root, "var", 300)
  dir(varDir, "log", 200)

  file(
    student,
    "file.txt",
    "hello world\nthis is file.txt\nlearning linux is fun\nthe END\n",
    90
  )
  file(student, "file1.txt", "alpha\nbravo\n", 80)
  file(student, "file2.txt", "charlie\n", 70)
  file(student, "file3.txt", "delta\n", 60)
  file(
    student,
    "fruits.txt",
    "apple\nbanana\nmango\nbanana\nkiwi\nmango\nmango\ngrape\n",
    50
  )
  file(student, "numbers.txt", "40\n2\n10\n2\n9\n40\n40\n100\n7\n", 45)
  file(
    student,
    "data.csv",
    "name,city\nmohan,patna\nsohan,delhi\nrita,gurgaon\n",
    40
  )
  file(
    student,
    "notes.md",
    "# TODO\npractice grep\npractice sed\nparty on friday\nEND\n",
    30
  )
  file(student, "output.txt", "", 20)
  file(student, "picture.jpg", "(fake jpeg bytes)", 15)
  file(student, ".hidden_secret", "shhh... you found me\n", 10, 0o600)
  dir(student, ".config", 12)
  const projects = dir(student, "projects", 8)
  const src = dir(projects, "src", 8)
  file(src, "app.py", "print('hi')\n", 8)
  const logs = dir(student, "logs", 5)
  for (const name of ["app.log", "err.log", "sys.log"])
    file(logs, name, "2024-01-01 INFO x\n", 5)
  return root
}
