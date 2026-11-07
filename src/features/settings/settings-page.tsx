import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { useActiveMode } from "@/app/use-active-mode"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { getRole } from "@/data/catalog/roles"
import { useLearnerStore } from "@/stores/learner-store"
import { PROFILE_EXPERIENCE_META } from "@/types/learner"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { SpokenEnglishPrivacy } from "@/features/english/privacy-block"
import { DataManagement } from "./data-management"
import { RevisionSettings } from "./revision-settings"

export function SettingsPage() {
  const profile = useLearnerStore((s) => s.profile)
  const study = useActiveMode() === "study"
  const roadmap = getRoadmap(profile?.studyRoadmap)
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your plan, your schedule and your data."
      />

      {profile && (
        <section
          className="space-y-3 rounded-xl border border-border bg-card p-5"
          aria-labelledby="plan-heading"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="plan-heading" className="text-sm font-medium">
                {study ? "Study plan" : "Preparation plan"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Changing your plan never deletes progress, notes or bookmarks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="lg">
                <Link to="/settings/syllabus">Edit syllabus</Link>
              </Button>
              {!study && (
                <Button asChild variant="outline" size="lg">
                  <Link to="/interview/manage">Manage my prep</Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <Link to={study ? "/study/plan" : "/onboarding"}>
                  Edit plan
                </Link>
              </Button>
            </div>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="lr-eyebrow">{study ? "Roadmap" : "Paths"}</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {study ? (
                  <Badge variant="default">
                    {roadmap?.title ?? "Not chosen"}
                  </Badge>
                ) : (
                  profile.selectedRoles.map((id) => (
                    <Badge
                      key={id}
                      variant={
                        id === profile.primaryRole ? "default" : "secondary"
                      }
                    >
                      {getRole(id)?.title}
                    </Badge>
                  ))
                )}
              </dd>
            </div>
            <div>
              <dt className="lr-eyebrow">Experience</dt>
              <dd className="mt-1">
                {PROFILE_EXPERIENCE_META[profile.experience].label}
              </dd>
            </div>
            <div>
              <dt className="lr-eyebrow">Daily time</dt>
              <dd className="mt-1">{profile.dailyStudyHours} h / day</dd>
            </div>
            <div>
              <dt className="lr-eyebrow">Target date</dt>
              <dd className="mt-1">{profile.targetDate ?? "Not set"}</dd>
            </div>
          </dl>
        </section>
      )}

      <RevisionSettings />
      {ENGLISH_INDEX.length > 0 && <SpokenEnglishPrivacy />}
      <DataManagement />
    </div>
  )
}
