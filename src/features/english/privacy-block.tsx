import { ShieldCheckIcon } from "lucide-react"
import { PRIVACY_POINTS, SPEAKING_HONESTY } from "./copy"

/** What Spoken English does with the learner's data, shown on the home page and in Settings. */
export function SpokenEnglishPrivacy() {
  return (
    <section
      aria-labelledby="english-privacy"
      className="space-y-2 rounded-xl border border-border bg-card p-4"
      data-testid="english-privacy"
    >
      <h2
        id="english-privacy"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <ShieldCheckIcon className="size-4 text-brand-ink" aria-hidden />
        Spoken English and your privacy
      </h2>
      <ul className="list-disc space-y-1 ps-5 text-xs/relaxed text-muted-foreground">
        {PRIVACY_POINTS.map((p) => (
          <li key={p}>{p}</li>
        ))}
        <li>{SPEAKING_HONESTY}</li>
      </ul>
    </section>
  )
}
