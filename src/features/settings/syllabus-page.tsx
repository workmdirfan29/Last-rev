import { useMemo } from "react"
import { Link } from "react-router"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SKILLS } from "@/data/curriculum/skills"
import { useActiveMode } from "@/app/use-active-mode"
import { CurriculumBuilder } from "@/features/curriculum/curriculum-builder"
import { RemovedPlanBlocks } from "@/features/planner/removed-blocks"
import { SkillCoveragePanel } from "@/features/curriculum/skill-coverage-panel"
import { SkillPicker } from "@/features/curriculum/skill-picker"
import type { CurriculumSource } from "@/features/curriculum/curriculum-source"
import {
  defaultsForRoadmap,
  defaultsForRoles,
} from "@/services/curriculum/relevance"
import {
  selectedEntries,
  resolveSyllabus,
  type SyllabusOverrides,
} from "@/services/curriculum/syllabus"
import { countStudyDays, dateOfStudyDay } from "@/services/planner/schedule"
import { useLearnerStore } from "@/stores/learner-store"
import { toDateKey } from "@/utils/dates"

/**
 * Edit the syllabus after onboarding. It is the same builder the review steps
 * use; every change is saved as it is made, so it survives a refresh.
 */
export function SyllabusPage() {
  const profile = useLearnerStore((s) => s.profile)
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  // Linux Practice has no syllabus of its own: its settings page shows the Interview Prep one.
  const mode = useActiveMode() === "study" ? "study" : "interview"
  const study = mode === "study"

  const source: CurriculumSource = useMemo(
    () =>
      study
        ? { kind: "roadmap", roadmapId: profile?.studyRoadmap ?? null }
        : { kind: "roles", roleIds: profile?.selectedRoles ?? [] },
    [study, profile?.studyRoadmap, profile?.selectedRoles]
  )
  const stored = study
    ? profile?.studySyllabusOverrides
    : profile?.syllabusOverrides
  const overrides: SyllabusOverrides = useMemo(() => stored ?? {}, [stored])

  const selectedIds = useMemo(() => {
    if (!profile) return new Set<string>()
    const defaults =
      source.kind === "roadmap"
        ? defaultsForRoadmap(source.roadmapId)
        : defaultsForRoles(source.roleIds)
    const entries = resolveSyllabus({
      defaults,
      overrides,
      experience: profile.experience,
      scope: study ? "study" : "interview",
    })
    return new Set(selectedEntries(entries).map((e) => e.module.id))
  }, [profile, source, overrides, study])

  // What is core or recommended for the learner's path leads in the skill picker; the rest is optional.
  const pathRelevance = useMemo(
    () =>
      source.kind === "roadmap"
        ? defaultsForRoadmap(source.roadmapId)
        : defaultsForRoles(source.roleIds, { includeCareer: false }),
    [source]
  )

  if (
    !profile ||
    (source.kind === "roadmap"
      ? !source.roadmapId
      : source.roleIds.length === 0)
  ) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Settings" title="Syllabus" />
        <EmptyState
          title={study ? "No roadmap chosen yet" : "No career path chosen yet"}
          description="Choose one first, then you can edit its syllabus here."
          action={
            <Button asChild>
              <Link to={study ? "/study/plan" : "/onboarding"}>
                {study ? "Choose a roadmap" : "Choose a career path"}
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  const studyDays = profile.plans[mode].studyDays
  const targetDays = profile.targetDate
    ? Math.max(
        1,
        countStudyDays(toDateKey(new Date()), profile.targetDate, studyDays)
      )
    : null
  const save = (patch: Parameters<typeof saveProfile>[0]) =>
    void saveProfile(patch)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ms-2">
        <Link to="/settings">
          <ArrowLeftIcon /> Settings
        </Link>
      </Button>
      <PageHeader
        eyebrow="Settings"
        title={study ? "Study syllabus" : "Preparation syllabus"}
        description="Customize your syllabus, mark what you already know and check your skill coverage. Changes are saved as you make them."
      />

      <Tabs defaultValue="syllabus" className="gap-5">
        <TabsList>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="known">Known skills</TabsTrigger>
          <TabsTrigger value="coverage">Skill coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="syllabus">
          <CurriculumBuilder
            source={source}
            experience={profile.experience}
            dailyMinutes={Math.round(profile.dailyStudyHours * 60)}
            targetDays={targetDays}
            deadlineLabel={profile.targetDate}
            value={overrides}
            onChange={(next) =>
              save(
                study
                  ? { studySyllabusOverrides: next }
                  : { syllabusOverrides: next }
              )
            }
            knownSkillIds={profile.knownSkills}
            onExtendDeadline={(days) =>
              save({
                targetPreset: "custom",
                targetDate: dateOfStudyDay(
                  toDateKey(new Date()),
                  Math.max(2, days),
                  studyDays
                ),
              })
            }
            onIncreaseDaily={(minutes) =>
              save({
                dailyStudyHours: Math.min(
                  12,
                  Math.max(0.5, Math.ceil(minutes / 30) / 2)
                ),
              })
            }
            barClassName="bottom-16 md:bottom-3"
          />
          <div className="mt-8">
            <RemovedPlanBlocks mode={mode} />
          </div>
        </TabsContent>

        <TabsContent value="known" className="space-y-4">
          <p className="max-w-2xl text-sm text-muted-foreground">
            Technologies you already know are marked in your syllabus. Nothing
            is removed or shortened because of them.
          </p>
          <SkillPicker
            skills={SKILLS}
            value={profile.knownSkills}
            relevance={pathRelevance}
            onChange={(next) => save({ knownSkills: next })}
          />
        </TabsContent>

        <TabsContent value="coverage">
          <SkillCoveragePanel
            selectedModuleIds={selectedIds}
            knownSkillIds={new Set(profile.knownSkills)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
