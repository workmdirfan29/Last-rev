import { CheckIcon, ClockIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RoleIcon } from "@/components/shared/role-icon"
import { ROLES } from "@/data/catalog/roles"
import { roleHighlights } from "@/services/curriculum/highlights"
import { cn } from "@/lib/utils"
import type { OnboardingValues } from "../schema"

export function RoleStep({ form }: { form: UseFormReturn<OnboardingValues> }) {
  const selected = form.watch("selectedRoles")
  const error = form.formState.errors.selectedRoles?.message

  function toggle(id: string) {
    const next = selected.includes(id)
      ? selected.filter((r) => r !== id)
      : [...selected, id]
    form.setValue("selectedRoles", next, {
      shouldValidate: true,
      shouldDirty: true,
    })
    const primary = form.getValues("primaryRole")
    if (!primary || !next.includes(primary)) {
      form.setValue("primaryRole", next[0] ?? null)
    }
  }

  return (
    <section aria-labelledby="role-heading" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          id="role-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What would you like to prepare for?
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose one or more paths. Questions and modules are shared between
          paths, so progress in one counts everywhere it appears.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ROLES.map((role) => {
          const isSelected = selected.includes(role.id)
          return (
            <li key={role.id}>
              <article
                className={cn(
                  "flex h-full flex-col gap-3 rounded-xl border bg-card p-4 transition-colors",
                  isSelected
                    ? "border-primary ring-1 ring-primary/60"
                    : "border-border hover:border-muted-foreground/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <RoleIcon name={role.icon} className="size-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm leading-snug font-medium">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-xs/relaxed text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>

                <ul
                  className="flex flex-wrap gap-1"
                  aria-label="Required skills"
                >
                  {roleHighlights(role.id).map((s) => (
                    <li key={s}>
                      <Badge variant="secondary">{s}</Badge>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="size-3" aria-hidden /> ~
                      {role.estimatedWeeks} wks
                    </span>
                    <span aria-hidden>·</span>
                    <span>{role.level}</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    aria-pressed={isSelected}
                    onClick={() => toggle(role.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckIcon /> Selected
                      </>
                    ) : (
                      "Start preparation"
                    )}
                  </Button>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}
