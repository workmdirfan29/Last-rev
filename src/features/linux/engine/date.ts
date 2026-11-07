/**
 * `date` support: format specifiers (the ones in the reference's Date Formats
 * tab plus a few more from the date(1) man page) and a small relative-date
 * parser for `date --date "tomorrow"`, `"2 year ago"`, `"next tue"`.
 */

const pad = (n: number, width = 2) => String(n).padStart(width, "0")

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function timeZoneName(d: Date): string {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")
    return part?.value ?? "UTC"
  } catch {
    return "UTC"
  }
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000)
}

/** Value of one `%x` specifier for `d`, or `null` if it is not supported. */
export function formatSpecifier(d: Date, spec: string): string | null {
  switch (spec) {
    case "D":
      return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${pad(d.getFullYear() % 100)}`
    case "d":
      return pad(d.getDate())
    case "e":
      return String(d.getDate()).padStart(2, " ")
    case "a":
      return WEEKDAYS[d.getDay()].slice(0, 3)
    case "A":
      return WEEKDAYS[d.getDay()]
    case "h":
    case "b":
      return MONTHS[d.getMonth()].slice(0, 3)
    case "B":
      return MONTHS[d.getMonth()]
    case "m":
      return pad(d.getMonth() + 1)
    case "y":
      return pad(d.getFullYear() % 100)
    case "Y":
      return String(d.getFullYear())
    case "T":
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    case "H":
      return pad(d.getHours())
    case "M":
      return pad(d.getMinutes())
    case "S":
      return pad(d.getSeconds())
    case "F":
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    case "I":
      return pad(d.getHours() % 12 || 12)
    case "p":
      return d.getHours() < 12 ? "AM" : "PM"
    case "j":
      return pad(dayOfYear(d), 3)
    case "u":
      return String(d.getDay() === 0 ? 7 : d.getDay())
    case "w":
      return String(d.getDay())
    case "Z":
      return timeZoneName(d)
    case "s":
      return String(Math.floor(d.getTime() / 1000))
    case "n":
      return "\n"
    case "%":
      return "%"
    default:
      return null
  }
}

/** Expand every `%x` in `format`; unknown specifiers are left as written, like GNU date. */
export function formatDate(d: Date, format: string): string {
  return format.replace(
    /%(.)/gs,
    (whole, spec: string) => formatSpecifier(d, spec) ?? whole
  )
}

/** Default output of plain `date`: `Sun Nov  2 21:04:12 IST 2026`. */
export const DEFAULT_DATE_FORMAT = "%a %b %e %H:%M:%S %Z %Y"

const UNITS: Record<
  string,
  "second" | "minute" | "hour" | "day" | "week" | "month" | "year"
> = {
  sec: "second",
  secs: "second",
  second: "second",
  seconds: "second",
  min: "minute",
  mins: "minute",
  minute: "minute",
  minutes: "minute",
  hour: "hour",
  hours: "hour",
  day: "day",
  days: "day",
  week: "week",
  weeks: "week",
  month: "month",
  months: "month",
  year: "year",
  years: "year",
}

function addUnit(d: Date, unit: (typeof UNITS)[string], amount: number): Date {
  const out = new Date(d)
  switch (unit) {
    case "second":
      out.setSeconds(out.getSeconds() + amount)
      break
    case "minute":
      out.setMinutes(out.getMinutes() + amount)
      break
    case "hour":
      out.setHours(out.getHours() + amount)
      break
    case "day":
      out.setDate(out.getDate() + amount)
      break
    case "week":
      out.setDate(out.getDate() + 7 * amount)
      break
    case "month":
      out.setMonth(out.getMonth() + amount)
      break
    case "year":
      out.setFullYear(out.getFullYear() + amount)
      break
  }
  return out
}

function weekdayIndex(word: string): number {
  const w = word.toLowerCase()
  if (w.length < 3) return -1
  return WEEKDAYS.findIndex((name) => name.toLowerCase().startsWith(w))
}

/**
 * Parse a relative expression such as `tomorrow`, `2 year ago`, `5 sec ago`,
 * `next tue`, `last friday`, `3 days`. Returns `null` when it is not understood.
 */
export function parseRelativeDate(expression: string, now: Date): Date | null {
  const text = expression.trim().toLowerCase().replace(/\s+/g, " ")
  if (text === "" || text === "now" || text === "today") return new Date(now)
  if (text === "tomorrow") return addUnit(now, "day", 1)
  if (text === "yesterday") return addUnit(now, "day", -1)

  const amount = /^([+-]?\d+) ([a-z]+?)( ago)?$/.exec(text)
  if (amount) {
    const unit = UNITS[amount[2]]
    if (!unit) return null
    const n = Number(amount[1]) * (amount[3] ? -1 : 1)
    return addUnit(now, unit, n)
  }

  const ordinal = /^(next|last|this) ([a-z]+)$/.exec(text)
  if (ordinal) {
    const [, which, what] = ordinal
    const unit = UNITS[what]
    if (unit)
      return addUnit(
        now,
        unit,
        which === "next" ? 1 : which === "last" ? -1 : 0
      )
    const target = weekdayIndex(what)
    if (target < 0) return null
    const out = new Date(now)
    out.setHours(0, 0, 0, 0)
    const diff = (target - out.getDay() + 7) % 7
    if (which === "next") out.setDate(out.getDate() + (diff === 0 ? 7 : diff))
    else if (which === "last")
      out.setDate(out.getDate() - (diff === 0 ? 7 : 7 - diff))
    else out.setDate(out.getDate() + diff)
    return out
  }

  const bare = weekdayIndex(text)
  if (bare >= 0 && !text.includes(" ")) {
    const out = new Date(now)
    out.setHours(0, 0, 0, 0)
    out.setDate(out.getDate() + ((bare - out.getDay() + 7) % 7))
    return out
  }
  return null
}
