import { dateSpecifierSchema, permissionLevelSchema } from "./schema"

/** Specifiers listed in the reference file's "Date Formats" tab. */
export const DATE_SPECIFIERS = [
  { token: "%D", description: "date as mm/dd/yy" },
  { token: "%d", description: "day of month (01-31)" },
  { token: "%a", description: "abbreviated weekday (Sun-Sat)" },
  { token: "%A", description: "full weekday (Sunday-Saturday)" },
  { token: "%h", description: "abbreviated month (Jan-Dec)" },
  { token: "%b", description: "abbreviated month (same as %h)" },
  { token: "%B", description: "full month name (January-December)" },
  { token: "%m", description: "month of year (01-12)" },
  { token: "%y", description: "last two digits of year" },
  { token: "%Y", description: "four-digit year" },
  { token: "%T", description: "time 24-hour HH:MM:SS" },
  { token: "%H", description: "hour (00-23)" },
  { token: "%M", description: "minute (00-59)" },
  { token: "%S", description: "second (00-59)" },
].map((d) => dateSpecifierSchema.parse(d))

/** The reference file's "Number ⇆ Symbol" table. */
export const PERMISSION_LEVELS = [
  { digit: 0, meaning: "No permission", symbol: "---" },
  { digit: 1, meaning: "Execute", symbol: "--x" },
  { digit: 2, meaning: "Write", symbol: "-w-" },
  { digit: 3, meaning: "Execute + Write", symbol: "-wx" },
  { digit: 4, meaning: "Read", symbol: "r--" },
  { digit: 5, meaning: "Read + Execute", symbol: "r-x" },
  { digit: 6, meaning: "Read + Write", symbol: "rw-" },
  { digit: 7, meaning: "Read + Write + Execute", symbol: "rwx" },
].map((p) => permissionLevelSchema.parse(p))
