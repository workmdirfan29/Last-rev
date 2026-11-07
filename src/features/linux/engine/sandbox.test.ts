import { describe, expect, it } from "vitest"
import { LINUX_CHALLENGES } from "@/data/linux/challenges"
import { allChecksHold } from "./checks"
import { Sandbox } from "./sandbox"

const NOW = new Date(2026, 10, 2, 21, 4, 12)
const make = () => new Sandbox(() => NOW)

/** Run a line and return its printed text (stdout, stderr and notes). */
function sh(sb: Sandbox, line: string): string[] {
  return sb.run(line).lines.map((l) => l.text)
}

describe("navigation and listing", () => {
  it("starts in the home directory and shows a ~ prompt", () => {
    const sb = make()
    expect(sh(sb, "pwd")).toEqual(["/home/student"])
    expect(sb.prompt).toBe("student@linuxbox:~$")
  })

  it("supports cd, cd .., cd - and cd with no argument", () => {
    const sb = make()
    sh(sb, "cd logs")
    expect(sb.cwdPath).toBe("/home/student/logs")
    sh(sb, "cd ..")
    expect(sb.cwdPath).toBe("/home/student")
    expect(sh(sb, "cd -")).toEqual(["/home/student/logs"])
    sh(sb, "cd")
    expect(sb.cwdPath).toBe("/home/student")
    expect(sh(sb, "cd nope")).toEqual([
      "bash: cd: nope: No such file or directory",
    ])
  })

  it("hides dot-files unless -a is given", () => {
    const sb = make()
    expect(sh(sb, "ls")[0]).not.toContain(".hidden_secret")
    expect(sh(sb, "ls -a")[0]).toContain(".hidden_secret")
  })

  it("lists permissions with ls -l and orders by time with -lrt", () => {
    const sb = make()
    const long = sh(sb, "ls -l")
    expect(long[0]).toMatch(/^total \d+$/)
    expect(
      long.some((l) => l.startsWith("-rw-r--r--") && l.endsWith(" file.txt"))
    ).toBe(true)
    const rows = sh(sb, "ls -lrt").slice(1)
    expect(rows[rows.length - 1]).toMatch(/ logs$/)
  })
})

describe("files and directories", () => {
  it("creates nested directories with brace expansion", () => {
    const sb = make()
    sh(sb, "mkdir -p India/{bihar/patna/subzibagh,delhi/jama_masjid/red-Fort}")
    expect(sb.inspect("India/bihar/patna/subzibagh")).toEqual({ type: "dir" })
    expect(sb.inspect("India/delhi/jama_masjid/red-Fort")).toEqual({
      type: "dir",
    })
  })

  it("refuses mkdir without -p when the parent is missing, and rmdir on a non-empty directory", () => {
    const sb = make()
    expect(sh(sb, "mkdir a/b")[0]).toContain("No such file or directory")
    expect(sh(sb, "rmdir logs")[0]).toContain("Directory not empty")
  })

  it("expands *.ext for rm and leaves a non-matching glob alone", () => {
    const sb = make()
    sh(sb, "cd logs")
    sh(sb, "rm *.log")
    expect(sb.inspect("app.log")).toBeNull()
    expect(sh(sb, "rm *.zip")[0]).toBe(
      "rm: cannot remove '*.zip': No such file or directory"
    )
  })

  it("rm needs -r for directories and asks before deleting with -i", () => {
    const sb = make()
    expect(sh(sb, "rm logs")[0]).toBe(
      "rm: cannot remove 'logs': Is a directory"
    )
    expect(sh(sb, "rm -i file1.txt")).toEqual([
      "rm: remove regular file 'file1.txt'? ",
    ])
    expect(sb.awaitingInput).toBe("confirm")
    sh(sb, "n")
    expect(sb.inspect("file1.txt")?.type).toBe("file")
    sh(sb, "rm -i file1.txt")
    sh(sb, "y")
    expect(sb.inspect("file1.txt")).toBeNull()
    sh(sb, "rm -rf logs")
    expect(sb.inspect("logs")).toBeNull()
  })

  it("refuses to remove the root", () => {
    const sb = make()
    expect(sh(sb, "rm -rf /")[0]).toContain("dangerous")
    expect(sb.inspect("/home")).toEqual({ type: "dir" })
  })

  it("writes a file with cat > until EOF, and appends with cat >>", () => {
    const sb = make()
    sh(sb, "cat > new.txt")
    expect(sb.awaitingInput).toBe("write")
    expect(sb.prompt).toBe(">")
    sh(sb, "one")
    sh(sb, "two")
    sh(sb, "EOF")
    expect(sb.inspect("new.txt")).toMatchObject({ content: "one\ntwo\n" })
    sh(sb, "cat >> new.txt")
    sh(sb, "three")
    sb.endInput()
    expect(sb.inspect("new.txt")).toMatchObject({
      content: "one\ntwo\nthree\n",
    })
  })

  it("moves, renames and copies", () => {
    const sb = make()
    sh(sb, "mv file1.txt first.txt")
    expect(sb.inspect("file1.txt")).toBeNull()
    sh(sb, "cp file.txt /tmp/")
    expect(sb.inspect("/tmp/file.txt")).toMatchObject({
      content: expect.stringContaining("hello world"),
    })
    expect(sh(sb, "cp logs /tmp/")[0]).toContain("-r not specified")
    sh(sb, "mv /tmp/file.txt .")
    expect(sb.inspect("/tmp/file.txt")).toBeNull()
  })

  it("chmod sets numeric modes and says honestly that symbolic modes are not simulated", () => {
    const sb = make()
    sh(sb, "chmod 742 file.txt")
    expect(sb.inspect("file.txt")).toMatchObject({ symbolic: "rwxr---w-" })
    expect(sh(sb, "chmod u+x file.txt")[0]).toContain("not simulated")
  })

  it("finds files by name", () => {
    const sb = make()
    expect(sh(sb, 'find . -name "*.log"')).toEqual([
      "./logs/app.log",
      "./logs/err.log",
      "./logs/sys.log",
    ])
  })
})

describe("text tools and pipes", () => {
  it("greps with -i, -v, -o, anchors and alternation", () => {
    const sb = make()
    expect(sh(sb, "grep mango fruits.txt")).toEqual(["mango", "mango", "mango"])
    expect(sh(sb, "grep -i HELLO file.txt")).toEqual(["hello world"])
    expect(sh(sb, "grep -v a fruits.txt")).toEqual(["kiwi"])
    expect(sh(sb, "grep -o an fruits.txt")).toHaveLength(7)
    expect(sh(sb, "grep ^the file.txt")).toEqual(["the END"])
    expect(sh(sb, "grep ^END file.txt")).toEqual([])
    expect(sh(sb, "grep END$ file.txt")).toEqual(["the END"])
    expect(sh(sb, "grep 'apple\\|kiwi' fruits.txt")).toEqual(["apple", "kiwi"])
  })

  it("sorts text and numbers, removes adjacent duplicates, and shows duplicates only", () => {
    const sb = make()
    expect(sh(sb, "sort -n numbers.txt").slice(0, 3)).toEqual(["2", "2", "7"])
    expect(sh(sb, "sort -nr numbers.txt")[0]).toBe("100")
    expect(sh(sb, "sort -r fruits.txt")[0]).toBe("mango")
    expect(sh(sb, "sort fruits.txt | uniq")).toEqual([
      "apple",
      "banana",
      "grape",
      "kiwi",
      "mango",
    ])
    expect(sh(sb, "sort fruits.txt | uniq -d")).toEqual(["banana", "mango"])
  })

  it("plain sort -r compares as text, so 9 comes before 10 and 2", () => {
    const sb = make()
    expect(sh(sb, "sort -r numbers.txt").slice(0, 3)).toEqual(["9", "7", "40"])
  })

  it("counts lines, words and bytes", () => {
    const sb = make()
    expect(sh(sb, "wc -l file.txt")).toEqual(["4 file.txt"])
    expect(sh(sb, "wc -w file1.txt")).toEqual(["2 file1.txt"])
    expect(sh(sb, "wc -c file2.txt")).toEqual(["8 file2.txt"])
  })

  it("head, tail, tac and nl", () => {
    const sb = make()
    expect(sh(sb, "head -2 fruits.txt")).toEqual(["apple", "banana"])
    expect(sh(sb, "tail -1 fruits.txt")).toEqual(["grape"])
    expect(sh(sb, "tac file1.txt")).toEqual(["bravo", "alpha"])
    expect(sh(sb, "nl file1.txt")).toEqual(["     1\talpha", "     2\tbravo"])
  })

  it("nl -b needs a style: the reference's example fails like GNU nl, the corrected one works", () => {
    const sb = make()
    expect(sh(sb, "nl -b file1.txt")[0]).toBe(
      "nl: invalid body numbering style: 'file1.txt'"
    )
    expect(sh(sb, "nl -b a file1.txt")).toEqual([
      "     1\talpha",
      "     2\tbravo",
    ])
  })

  it("sed prints, deletes and substitutes", () => {
    const sb = make()
    expect(sh(sb, "sed -n '2p' fruits.txt")).toEqual(["banana"])
    expect(sh(sb, "sed -n '2,3p' fruits.txt")).toEqual(["banana", "mango"])
    expect(sh(sb, "sed '1d' file1.txt")).toEqual(["bravo"])
    expect(sh(sb, "sed '1,2d' fruits.txt")).toHaveLength(6)
    expect(sh(sb, "sed 's/an/AN/' fruits.txt")[1]).toBe("bANana")
    expect(sh(sb, "sed 's/an/AN/g' fruits.txt")[1]).toBe("bANANa")
  })

  it("cut by delimiter and by character, and paste", () => {
    const sb = make()
    expect(sh(sb, 'cut -d "," -f2 data.csv')).toEqual([
      "city",
      "patna",
      "delhi",
      "gurgaon",
    ])
    expect(sh(sb, "cut -c '1-3' fruits.txt")[0]).toBe("app")
    expect(sh(sb, "paste file1.txt file2.txt")).toEqual([
      "alpha\tcharlie",
      "bravo\t",
    ])
  })

  it("redirects overwrite with > and append with >>, and tee writes while printing", () => {
    const sb = make()
    sh(sb, "ls > output.txt")
    expect(sb.inspect("output.txt")).toMatchObject({
      content: expect.stringContaining("fruits.txt"),
    })
    sh(sb, "echo hi > a.txt")
    sh(sb, "echo again >> a.txt")
    expect(sb.inspect("a.txt")).toMatchObject({ content: "hi\nagain\n" })
    expect(sh(sb, "echo shown | tee t.txt")).toEqual(["shown"])
    expect(sb.inspect("t.txt")).toMatchObject({ content: "shown\n" })
  })

  it("bc calculates, with integer division, and refuses anything but arithmetic", () => {
    const sb = make()
    expect(sh(sb, 'echo "10+20" | bc')).toEqual(["30"])
    expect(sh(sb, 'echo "10/3" | bc')).toEqual(["3"])
    expect(sh(sb, 'echo "2^10" | bc')).toEqual(["1024"])
    expect(sh(sb, 'echo "system(1)" | bc')[0]).toContain(
      "only simple arithmetic"
    )
  })

  it("chains with ; and &&", () => {
    const sb = make()
    expect(sh(sb, "echo a; echo b")).toEqual(["a", "b"])
    expect(sh(sb, "cd nope && echo hidden")).toHaveLength(1)
  })
})

describe("date", () => {
  it("formats with the reference specifiers", () => {
    const sb = make()
    expect(sh(sb, "date +'%d-%m-%Y'")).toEqual(["02-11-2026"])
    expect(sh(sb, "date +%T")).toEqual(["21:04:12"])
    expect(sh(sb, "date +'%D %a %A %b %B %y'")).toEqual([
      "11/02/26 Mon Monday Nov November 26",
    ])
  })

  it("understands relative dates", () => {
    const sb = make()
    expect(sh(sb, 'date --date "tomorrow" +%F')).toEqual(["2026-11-03"])
    expect(sh(sb, 'date --date "yesterday" +%F')).toEqual(["2026-11-01"])
    expect(sh(sb, 'date --date "2 year ago" +%Y')).toEqual(["2024"])
    expect(sh(sb, 'date --date "5 sec ago" +%S')).toEqual(["07"])
    expect(sh(sb, 'date --date "next tue" +%A')).toEqual(["Tuesday"])
    expect(sh(sb, 'date --date "gibberish"')[0]).toContain("invalid date")
  })
})

describe("honesty about what is simulated", () => {
  it("labels commands it will not run instead of pretending", () => {
    const sb = make()
    for (const cmd of [
      "sudo apt-get install nginx",
      "ssh user@host",
      "reboot",
      "scp a b",
      "passwd",
    ]) {
      const out = sh(sb, cmd)
      expect(out.join(" ")).toContain("not simulated here")
    }
  })

  it("reports unknown commands like bash and flags sample output", () => {
    const sb = make()
    expect(sh(sb, "frobnicate")).toEqual([
      "bash: frobnicate: command not found",
    ])
    expect(sh(sb, "df -Th").at(-1)).toContain("Sample output")
    expect(sh(sb, "uname -a").at(-1)).toContain("Sample output")
  })

  it("kill -9 removes a simulated process", () => {
    const sb = make()
    expect(sh(sb, "ps -eaf").join("\n")).toContain("python3 app.py")
    sh(sb, "kill -9 1234")
    expect(sh(sb, "ps -eaf").join("\n")).not.toContain("python3 app.py")
    expect(sh(sb, "kill -9 99999")[0]).toContain("No such process")
  })

  it("rejects unclosed quotes and dangling pipes", () => {
    const sb = make()
    expect(sh(sb, "echo 'oops")[0]).toContain("unexpected EOF")
    expect(sh(sb, "ls |")[0]).toContain("syntax error")
  })
})

describe("challenges", () => {
  it.each(LINUX_CHALLENGES.map((c) => [c.slug, c] as const))(
    "%s: not solved at the start, solved by its solution",
    (_slug, c) => {
      const sb = make()
      expect(allChecksHold(sb, c.checks)).toBe(false)
      sb.run(c.solution)
      expect(allChecksHold(sb, c.checks)).toBe(true)
    }
  )
})
