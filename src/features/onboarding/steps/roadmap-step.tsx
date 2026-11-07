import { ClockIcon, LayersIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RoleIcon } from "@/components/shared/role-icon"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import {
  roadmapDefaultSummary,
  roadmapHighlights,
} from "@/services/curriculum/highlights"
import { cn } from "@/lib/utils"
import type { OnboardingValues } from "../schema"

/** Study Path step 1: pick one of the real roadmaps. */
export function RoadmapStep({
  form,
}: {
  form: UseFormReturn<OnboardingValues>
}) {
  const value = form.watch("studyRoadmap")
  const error = form.formState.errors.studyRoadmap?.message

  return (
    <section aria-labelledby="roadmap-heading" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          id="roadmap-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Which roadmap do you want to follow?
        </h2>
        <p className="text-sm text-muted-foreground">
          Each roadmap is an ordered list of modules, from fundamentals to a
          deployed, AI-enabled application. You can change it later without
          losing progress.
        </p>
      </div>

      <RadioGroup
        value={value ?? ""}
        onValueChange={(id) =>
          form.setValue("studyRoadmap", id, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        className="grid gap-3 lg:grid-cols-3"
        aria-label="Roadmap"
      >
        {ROADMAPS.map((roadmap) => {
          const id = `roadmap-${roadmap.id}`
          const selected = value === roadmap.id
          const summary = roadmapDefaultSummary(
            roadmap.id,
            form.watch("experience")
          )
          return (
            <Label
              key={roadmap.id}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer flex-col items-stretch gap-3 rounded-xl border bg-card p-4 font-normal transition-colors",
                selected
                  ? "border-primary ring-1 ring-primary/60"
                  : "border-border hover:border-muted-foreground/40"
              )}
            >
              <span className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <RoleIcon name={roadmap.icon} className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block text-sm leading-snug font-medium">
                    {roadmap.title}
                  </span>
                  <span className="block text-xs/relaxed text-muted-foreground">
                    {roadmap.description}
                  </span>
                </span>
                <RadioGroupItem id={id} value={roadmap.id} className="mt-0.5" />
              </span>
              <span className="flex flex-wrap gap-1">
                {roadmapHighlights(roadmap.id).map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </span>
              <span className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <LayersIcon className="size-3" aria-hidden />{" "}
                  {summary.modules} modules
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="size-3" aria-hidden /> about{" "}
                  {Math.round(summary.minutes / 60)} study hours
                </span>
              </span>
            </Label>
          )
        })}
      </RadioGroup>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}
