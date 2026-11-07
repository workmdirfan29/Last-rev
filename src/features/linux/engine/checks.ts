import type { ChallengeCheck } from "@/data/linux/schema"
import type { Sandbox } from "./sandbox"

/** Whether one challenge condition holds in the sandbox right now. */
export function checkHolds(sandbox: Sandbox, check: ChallengeCheck): boolean {
  const node = sandbox.inspect(check.path)
  switch (check.kind) {
    case "dir-exists":
      return node?.type === "dir"
    case "file-exists":
      return node?.type === "file"
    case "missing":
      return node === null
    case "file-content":
      return node?.type === "file" && node.content === check.content
    case "file-contains":
      return node?.type === "file" && node.content.includes(check.text)
    case "mode":
      return node?.type === "file" && node.symbolic === check.symbolic
  }
}

export const allChecksHold = (
  sandbox: Sandbox,
  checks: readonly ChallengeCheck[]
) => checks.every((c) => checkHolds(sandbox, c))

/** What a check asks for, in plain words, with `~` for the home directory. */
export function describeCheck(check: ChallengeCheck): string {
  const path = check.path.replace(/^\/home\/student/, "~")
  switch (check.kind) {
    case "dir-exists":
      return `${path} is a directory`
    case "file-exists":
      return `${path} exists`
    case "missing":
      return `${path} no longer exists`
    case "file-content":
      return check.content === ""
        ? `${path} exists and is empty`
        : `${path} has exactly the expected lines`
    case "file-contains":
      return `${path} contains "${check.text}"`
    case "mode":
      return `${path} has permissions ${check.symbolic}`
  }
}
