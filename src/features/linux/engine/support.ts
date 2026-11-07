import { ParseError, parseLine } from "./parse"
import { NOT_SIMULATED } from "./sandbox"
import { TEXT_COMMANDS } from "./text-commands"

/**
 * How honestly the practice terminal can run a command:
 * - simulated: runs against the virtual filesystem and behaves like the real one for the supported options
 * - sample: prints fixed sample output (system information), clearly labelled as such
 * - not-simulated: recognised but refused, with the reason
 */
export type Support = "simulated" | "sample" | "not-simulated"

export const SIMULATED_COMMANDS: ReadonlySet<string> = new Set([
  ...Object.keys(TEXT_COMMANDS),
  ...[
    "help",
    "clear",
    "pwd",
    "whoami",
    "hostname",
    "history",
    "echo",
    "cd",
    "ls",
    "mkdir",
    "rmdir",
    "touch",
  ],
  ...[
    "rm",
    "cat",
    "more",
    "mv",
    "cp",
    "find",
    "chmod",
    "date",
    "bc",
    "tee",
    "du",
    "ps",
    "kill",
  ],
])

const SAMPLE_COMMANDS: ReadonlySet<string> = new Set([
  "df",
  "free",
  "lscpu",
  "uname",
  "ifconfig",
  "top",
])

const RANK: Record<Support, number> = {
  simulated: 0,
  sample: 1,
  "not-simulated": 2,
}

function supportOf(words: string[]): Support {
  const [name, ...args] = words
  if (SIMULATED_COMMANDS.has(name))
    return name === "hostname" && args.includes("-I") ? "sample" : "simulated"
  if (SAMPLE_COMMANDS.has(name)) return "sample"
  return "not-simulated"
}

/** Support level of a reference example such as `ls | tee output.txt` (the weakest stage wins). */
export function exampleSupport(example: string): Support {
  if (/^sftp>/.test(example)) return "not-simulated"
  try {
    const stages = parseLine(example).flatMap((st) => st.pipeline.commands)
    if (stages.length === 0) return "not-simulated"
    return stages
      .map((c) => supportOf(c.words.map((w) => w.text)))
      .reduce((a, b) => (RANK[b] > RANK[a] ? b : a))
  } catch (e) {
    if (e instanceof ParseError) return "not-simulated"
    throw e
  }
}

/** Is this a name the sandbox refuses on purpose (as opposed to one it simply does not know)? */
export const isRefusedOnPurpose = (name: string) =>
  Object.hasOwn(NOT_SIMULATED, name)

export const SUPPORT_LABEL: Record<Support, string> = {
  simulated: "Runs in the practice terminal",
  sample: "Sample output in the terminal",
  "not-simulated": "Not simulated",
}
