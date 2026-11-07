/** One piece of text with its position on a page (the shape pdf.js gives, reduced to what the reader needs). */
export interface TextItem {
  str: string
  x: number
  y: number
  w: number
  h: number
}
export interface PageText {
  width: number
  items: TextItem[]
}
export interface ReadResult {
  lines: string[]
  pages: number
  /** Most columns found on any page; 2 means the page was read column by column. */
  columns: number
  characters: number
}

/** Group items of one page into lines (same baseline), read left to right. */
export function toLines(items: readonly TextItem[]): string[] {
  const sorted = items
    .filter((i) => i.str.trim() !== "")
    .sort((a, b) => b.y - a.y || a.x - b.x)
  const rows: { y: number; parts: TextItem[] }[] = []
  for (const it of sorted) {
    const row = rows.find((r) => Math.abs(r.y - it.y) < Math.max(2, it.h * 0.4))
    if (row) row.parts.push(it)
    else rows.push({ y: it.y, parts: [it] })
  }
  return rows.map((r) => {
    const parts = r.parts.sort((a, b) => a.x - b.x)
    let text = ""
    let end = -1
    for (const p of parts) {
      if (end >= 0 && p.x - end > p.h * 0.15) text += " "
      text += p.str
      end = p.x + p.w
    }
    return text.replace(/\s+/g, " ").trim()
  })
}

/** A vertical gutter that few items cross (a full-width header may), with real text on both sides. */
export function findGutter(
  items: readonly TextItem[],
  pageWidth: number
): number | null {
  const real = items.filter((i) => i.str.trim() !== "")
  if (real.length < 12) return null
  let best: { g: number; crossing: number } | null = null
  for (let g = pageWidth * 0.25; g <= pageWidth * 0.75; g += 2) {
    const crossing = real.filter((i) => i.x < g && i.x + i.w > g).length
    if (crossing > real.length * 0.08) continue
    const left = real.filter((i) => i.x + i.w <= g).length
    const right = real.filter((i) => i.x >= g).length
    if (left < real.length * 0.2 || right < real.length * 0.2) continue
    if (!best || crossing < best.crossing) best = { g, crossing }
  }
  return best ? best.g : null
}

/** Lines of one page. With `columnAware`, a two-column page is read header, then left column, then right column. */
export function pageLines(
  page: PageText,
  columnAware: boolean
): { lines: string[]; columns: number } {
  const g = columnAware ? findGutter(page.items, page.width) : null
  if (g === null) return { lines: toLines(page.items), columns: 1 }
  const across = page.items.filter((i) => i.x < g && i.x + i.w > g)
  return {
    lines: [
      ...toLines(across),
      ...toLines(page.items.filter((i) => i.x + i.w <= g)),
      ...toLines(page.items.filter((i) => i.x >= g)),
    ],
    columns: 2,
  }
}

export function buildLines(
  pages: readonly PageText[],
  columnAware = true
): ReadResult {
  const lines: string[] = []
  let columns = 1
  let characters = 0
  for (const page of pages) {
    characters += page.items.reduce((n, i) => n + i.str.length, 0)
    const r = pageLines(page, columnAware)
    columns = Math.max(columns, r.columns)
    lines.push(...r.lines)
  }
  return { lines, pages: pages.length, columns, characters }
}

/** Share of letters that are not Latin (Devanagari, Arabic, CJK ...): the reader does not support those. */
export function nonLatinShare(lines: readonly string[]): number {
  const text = lines.join("")
  const letters = text.match(/\p{L}/gu) ?? []
  if (letters.length === 0) return 0
  const latin = letters.filter((c) => /\p{Script=Latin}/u.test(c)).length
  return 1 - latin / letters.length
}
