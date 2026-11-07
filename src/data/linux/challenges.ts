import { linuxChallengeSchema, type LinuxChallenge } from "./schema"

const H = "/home/student"

/**
 * Practice exercises. Each one uses only commands from the reference file
 * (`commandNumbers` points at their rows), starts from a fresh sandbox, and is
 * verified against the virtual filesystem, so any correct command line passes.
 */
const raw = [
  {
    slug: "make-a-directory",
    title: "Make a directory",
    difficulty: "easy",
    brief: "Create a directory named mydir in your home directory.",
    commandNumbers: [1],
    hints: ["mkdir creates directories.", "mkdir <dirname>"],
    solution: "mkdir mydir",
    checks: [{ kind: "dir-exists", path: `${H}/mydir` }],
    estimatedMinutes: 2,
  },
  {
    slug: "nested-tree",
    title: "Build a nested tree",
    difficulty: "easy",
    brief:
      "In one command, create India/bihar/patna and India/delhi/red-Fort inside your home directory.",
    commandNumbers: [3],
    hints: [
      "-p creates parent directories as needed.",
      "Braces expand into branches: India/{bihar/patna,delhi/red-Fort}",
    ],
    solution: "mkdir -p India/{bihar/patna,delhi/red-Fort}",
    checks: [
      { kind: "dir-exists", path: `${H}/India/bihar/patna` },
      { kind: "dir-exists", path: `${H}/India/delhi/red-Fort` },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "blank-file",
    title: "Create a blank file",
    difficulty: "easy",
    brief: "Create an empty file named report.txt in your home directory.",
    commandNumbers: [6],
    hints: ["touch creates a blank file if it does not exist."],
    solution: "touch report.txt",
    checks: [{ kind: "file-content", path: `${H}/report.txt`, content: "" }],
    estimatedMinutes: 1,
  },
  {
    slug: "clear-the-logs",
    title: "Clear out the logs",
    difficulty: "easy",
    brief:
      "Delete every .log file inside the logs directory. Keep the directory itself.",
    commandNumbers: [10],
    hints: [
      "* means all, so *.log matches every file ending in .log.",
      "You can give rm a path: logs/*.log",
    ],
    solution: "rm logs/*.log",
    checks: [
      { kind: "dir-exists", path: `${H}/logs` },
      { kind: "missing", path: `${H}/logs/app.log` },
      { kind: "missing", path: `${H}/logs/err.log` },
      { kind: "missing", path: `${H}/logs/sys.log` },
    ],
    estimatedMinutes: 2,
  },
  {
    slug: "rename-a-file",
    title: "Rename a file",
    difficulty: "easy",
    brief: "Rename file1.txt to first.txt. The contents must stay the same.",
    commandNumbers: [49],
    hints: ["mv with two names renames.", "mv <old> <new>"],
    solution: "mv file1.txt first.txt",
    checks: [
      { kind: "missing", path: `${H}/file1.txt` },
      {
        kind: "file-content",
        path: `${H}/first.txt`,
        content: "alpha\nbravo\n",
      },
    ],
    estimatedMinutes: 1,
  },
  {
    slug: "copy-to-tmp",
    title: "Copy to /tmp",
    difficulty: "easy",
    brief:
      "Copy file.txt into the /tmp directory. The original must stay where it is.",
    commandNumbers: [53],
    hints: [
      "cp <file> <dest>",
      "A destination ending in a directory keeps the file name.",
    ],
    solution: "cp file.txt /tmp/",
    checks: [
      {
        kind: "file-contains",
        path: "/tmp/file.txt",
        text: "learning linux is fun",
      },
      { kind: "file-exists", path: `${H}/file.txt` },
    ],
    estimatedMinutes: 2,
  },
  {
    slug: "save-a-listing",
    title: "Save a listing",
    difficulty: "easy",
    brief:
      "Write the list of files in your home directory into a file named listing.txt.",
    commandNumbers: [14, 39],
    hints: [
      "> sends a command's output into a file, replacing what was there.",
      "ls > listing.txt",
    ],
    solution: "ls > listing.txt",
    checks: [
      { kind: "file-contains", path: `${H}/listing.txt`, text: "fruits.txt" },
    ],
    estimatedMinutes: 2,
  },
  {
    slug: "find-the-mangoes",
    title: "Find the mangoes",
    difficulty: "easy",
    brief:
      "Save only the lines of fruits.txt that contain mango into mango.txt.",
    commandNumbers: [31, 39],
    hints: [
      "grep <word> <file> prints matching lines.",
      "Redirect the result with >",
    ],
    solution: "grep mango fruits.txt > mango.txt",
    checks: [
      {
        kind: "file-content",
        path: `${H}/mango.txt`,
        content: "mango\nmango\nmango\n",
      },
    ],
    estimatedMinutes: 2,
  },
  {
    slug: "unique-fruits",
    title: "List each fruit once",
    difficulty: "medium",
    brief:
      "Write the fruits of fruits.txt into unique.txt, sorted, with each fruit appearing once.",
    commandNumbers: [58, 63, 39],
    hints: [
      "uniq only removes duplicates that sit next to each other.",
      "Sort first, then pipe into uniq: sort fruits.txt | uniq",
    ],
    solution: "sort fruits.txt | uniq > unique.txt",
    checks: [
      {
        kind: "file-content",
        path: `${H}/unique.txt`,
        content: "apple\nbanana\ngrape\nkiwi\nmango\n",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "fix-the-name",
    title: "Fix a name everywhere",
    difficulty: "medium",
    brief:
      "data.csv spells a name mohan. Save a copy named fixed.csv where every mohan is sohan. Leave data.csv as it is.",
    commandNumbers: [81, 39],
    hints: [
      "sed 's/old/new/g' replaces every occurrence on every line.",
      "Redirect to fixed.csv; do not edit the original.",
    ],
    solution: "sed 's/mohan/sohan/g' data.csv > fixed.csv",
    checks: [
      {
        kind: "file-content",
        path: `${H}/fixed.csv`,
        content: "name,city\nsohan,patna\nsohan,delhi\nrita,gurgaon\n",
      },
      { kind: "file-contains", path: `${H}/data.csv`, text: "mohan" },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "pick-a-column",
    title: "Pick a column",
    difficulty: "medium",
    brief:
      "Save just the city column of data.csv (the header included) into cities.txt.",
    commandNumbers: [82, 39],
    hints: ["cut splits each line at a delimiter.", 'cut -d "," -f2 data.csv'],
    solution: 'cut -d "," -f2 data.csv > cities.txt',
    checks: [
      {
        kind: "file-content",
        path: `${H}/cities.txt`,
        content: "city\npatna\ndelhi\ngurgaon\n",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "count-the-lines",
    title: "Count the lines",
    difficulty: "easy",
    brief:
      "Count the lines in file.txt and save the result, file name included, into count.txt.",
    commandNumbers: [46, 39],
    hints: [
      "wc -l counts lines.",
      "With a file name, wc prints the count followed by the name.",
    ],
    solution: "wc -l file.txt > count.txt",
    checks: [
      { kind: "file-content", path: `${H}/count.txt`, content: "4 file.txt\n" },
    ],
    estimatedMinutes: 2,
  },
  {
    slug: "top-three-numbers",
    title: "Top three numbers",
    difficulty: "medium",
    brief:
      "Save the three largest numbers of numbers.txt into top3.txt, largest first.",
    commandNumbers: [61, 74, 39],
    hints: [
      "sort -nr sorts numbers from largest to smallest.",
      "head -3 keeps the first three lines; connect them with a pipe.",
    ],
    solution: "sort -nr numbers.txt | head -3 > top3.txt",
    checks: [
      { kind: "file-content", path: `${H}/top3.txt`, content: "100\n40\n40\n" },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "set-permissions",
    title: "Set permissions to 742",
    difficulty: "easy",
    brief:
      "Change file.txt so the owner can read, write and execute, the group can only read, and others can only write.",
    commandNumbers: [101],
    hints: ["r=4, w=2, x=1. Add them per class.", "owner 7, group 4, other 2"],
    solution: "chmod 742 file.txt",
    checks: [{ kind: "mode", path: `${H}/file.txt`, symbolic: "rwxr---w-" }],
    estimatedMinutes: 2,
  },
] as const

export const LINUX_CHALLENGES: LinuxChallenge[] = raw.map((c) =>
  linuxChallengeSchema.parse({ ...c, id: `linux.challenge.${c.slug}` })
)
