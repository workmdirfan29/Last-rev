/**
 * A tiny, safe stand-in for `bc` (default scale 0): + - * / % ^ and
 * parentheses over integers and decimals. It never uses eval.
 */

export class BcError extends Error {}

export function evaluateBc(source: string): string {
  const text = source.trim()
  if (text === "") return ""
  if (!/^[0-9+\-*/%^().\s]+$/.test(text)) {
    throw new BcError(
      "only simple arithmetic is simulated (digits, + - * / % ^ and parentheses)"
    )
  }
  let pos = 0
  const peek = () => {
    while (text[pos] === " " || text[pos] === "\t") pos++
    return text[pos]
  }

  function primary(): number {
    const ch = peek()
    if (ch === "(") {
      pos++
      const v = additive()
      if (peek() !== ")") throw new BcError("syntax error: missing )")
      pos++
      return v
    }
    if (ch === "-") {
      pos++
      return -power()
    }
    if (ch === "+") {
      pos++
      return power()
    }
    const m = /^\d*\.?\d+|^\d+\.?/.exec(text.slice(pos))
    if (!m) throw new BcError("syntax error")
    pos += m[0].length
    return Number(m[0])
  }
  function power(): number {
    const base = primary()
    if (peek() === "^") {
      pos++
      const exp = power()
      return base ** Math.trunc(exp)
    }
    return base
  }
  function multiplicative(): number {
    let v = power()
    for (;;) {
      const op = peek()
      if (op !== "*" && op !== "/" && op !== "%") return v
      pos++
      const rhs = power()
      if (op === "*") v *= rhs
      else {
        if (rhs === 0)
          throw new BcError(
            "Runtime error (func=(main), adr=0): Divide by zero"
          )
        v = op === "/" ? Math.trunc(v / rhs) : v % rhs
      }
    }
  }
  function additive(): number {
    let v = multiplicative()
    for (;;) {
      const op = peek()
      if (op !== "+" && op !== "-") return v
      pos++
      const rhs = multiplicative()
      v = op === "+" ? v + rhs : v - rhs
    }
  }

  const result = additive()
  if (peek() !== undefined) throw new BcError("syntax error")
  return String(Number.isInteger(result) ? result : Number(result.toFixed(10)))
}
