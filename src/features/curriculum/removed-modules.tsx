import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TIER_LABEL } from "@/services/curriculum/relevance"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"

/** Modules the learner took out of their syllabus. Removal is always reversible from here. */
export function RemovedModules({
  entries,
  onRestore,
}: {
  entries: readonly SyllabusEntry[]
  onRestore: (entry: SyllabusEntry) => void
}) {
  if (entries.length === 0) return null
  return (
    <section
      aria-labelledby="removed-modules-heading"
      className="space-y-2 rounded-xl border border-dashed border-border p-4"
    >
      <h3 id="removed-modules-heading" className="text-sm font-medium">
        Removed from your syllabus ({entries.length})
      </h3>
      <p className="text-xs text-muted-foreground">
        These are not counted in your hours or readiness. Restore any of them at
        any time.
      </p>
      <ul className="divide-y divide-border">
        {entries.map((e) => (
          <li
            key={e.module.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm"
          >
            <span className="min-w-0 flex-1">{e.module.title}</span>
            {e.tier && <Badge variant="secondary">{TIER_LABEL[e.tier]}</Badge>}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onRestore(e)}
              aria-label={`Restore ${e.module.title}`}
            >
              Restore
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
