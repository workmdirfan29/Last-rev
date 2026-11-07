/** Pure helpers for the chmod calculator. Each digit is r=4 + w=2 + x=1. */

export type PermissionClass = "user" | "group" | "other"
export type PermissionBit = "read" | "write" | "execute"

export const PERMISSION_CLASSES: PermissionClass[] = ["user", "group", "other"]
export const PERMISSION_BITS: {
  id: PermissionBit
  value: number
  letter: string
}[] = [
  { id: "read", value: 4, letter: "r" },
  { id: "write", value: 2, letter: "w" },
  { id: "execute", value: 1, letter: "x" },
]

/** `[user, group, other]` digits, each 0–7. */
export type PermissionDigits = [number, number, number]

export function digitToSymbol(digit: number): string {
  return PERMISSION_BITS.map((b) => (digit & b.value ? b.letter : "-")).join("")
}

export const digitsToSymbolic = (digits: PermissionDigits) =>
  digits.map(digitToSymbol).join("")

export const digitsToOctal = (digits: PermissionDigits) => digits.join("")

export function toggleBit(
  digits: PermissionDigits,
  cls: PermissionClass,
  bit: PermissionBit
): PermissionDigits {
  const next: PermissionDigits = [...digits]
  const index = PERMISSION_CLASSES.indexOf(cls)
  const value = PERMISSION_BITS.find((b) => b.id === bit)!.value
  next[index] ^= value
  return next
}

/** Parse `742` (also `0742`) into digits; `null` if it is not a valid octal mode. */
export function parseOctal(text: string): PermissionDigits | null {
  const match = /^0?([0-7])([0-7])([0-7])$/.exec(text.trim())
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}

/** Parse `rwxr--r--` (nine characters) into digits; `null` if malformed. */
export function parseSymbolic(text: string): PermissionDigits | null {
  const t = text.trim()
  if (!/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(t)) return null
  const digit = (tri: string) =>
    (tri[0] === "r" ? 4 : 0) +
    (tri[1] === "w" ? 2 : 0) +
    (tri[2] === "x" ? 1 : 0)
  return [digit(t.slice(0, 3)), digit(t.slice(3, 6)), digit(t.slice(6, 9))]
}

export const digitsToMode = (digits: PermissionDigits) =>
  (digits[0] << 6) | (digits[1] << 3) | digits[2]
