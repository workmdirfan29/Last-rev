import { addDays, differenceInCalendarDays, format, parse } from "date-fns"

const KEY_FORMAT = "yyyy-MM-dd"

/** Local calendar day key — streaks must follow the learner's timezone, not UTC. */
export function toDateKey(date: Date = new Date()): string {
  return format(date, KEY_FORMAT)
}

export function fromDateKey(key: string): Date {
  return parse(key, KEY_FORMAT, new Date())
}

export function shiftDateKey(key: string, days: number): string {
  return toDateKey(addDays(fromDateKey(key), days))
}

export function daysBetweenKeys(from: string, to: string): number {
  return differenceInCalendarDays(fromDateKey(to), fromDateKey(from))
}
