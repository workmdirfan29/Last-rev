import { Link } from "react-router"
import {
  BriefcaseBusinessIcon,
  GraduationCapIcon,
  LanguagesIcon,
  TerminalIcon,
} from "lucide-react"
import { Brand } from "@/components/shared/brand"
import { ThemeToggle } from "@/components/navigation/theme-toggle"
import { LANDING_FEATURES } from "@/app/features"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { cn } from "@/lib/utils"
import { useLearnerStore } from "@/stores/learner-store"
import type { AppMode } from "@/types/learner"
import { ModeCard, type ModeFeature } from "./mode-card"

const toFeatures = (mode: AppMode): ModeFeature[] =>
  LANDING_FEATURES[mode].map((f) => ({ label: f.label, soon: !f.route }))

/** The first screen: three journeys, nothing else competing for attention. */
export function LandingPage() {
  const lastMode = useLearnerStore((s) => s.preferences.lastMode)
  const updatePreferences = useLearnerStore((s) => s.updatePreferences)
  // The English card appears only once the course has a lesson: a mode with nothing in it is a dead end.
  const hasEnglish = ENGLISH_INDEX.length > 0

  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Brand />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="lr-eyebrow">Learn. Practise. Prepare. Get Job-Ready.</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            What would you like to do today?
          </h1>
          <p className="text-base/relaxed text-balance text-muted-foreground">
            Choose your learning path. Prepare for interviews, build technical
            skills, and become job-ready at your own pace.
          </p>
        </div>

        <div
          className={cn(
            "mt-10 grid gap-5 sm:mt-14",
            // three cards in a row; with the English card, a 2 x 2 grid from tablet width
            hasEnglish ? "md:grid-cols-2" : "lg:grid-cols-3"
          )}
        >
          <ModeCard
            icon={BriefcaseBusinessIcon}
            title="Interview Prep"
            description="Prepare for technical and HR interviews with structured questions, detailed explanations, practical examples and realistic mock interviews."
            features={toFeatures("interview")}
            cta="Explore Interview Prep"
            to="/start/interview"
            current={lastMode === "interview"}
          />
          <ModeCard
            icon={GraduationCapIcon}
            title="Study Path"
            description="Follow structured career roadmaps, learn programming from fundamentals to advanced concepts, build real-world projects and track your progress."
            features={toFeatures("study")}
            cta="Explore Study Path"
            to="/start/study"
            current={lastMode === "study"}
          />
          <ModeCard
            icon={TerminalIcon}
            title="Linux Practice"
            description="Practise Linux commands in a safe simulated terminal, with a searchable command library, a permissions calculator, date formats and challenges."
            features={toFeatures("linux")}
            cta="Explore Linux Practice"
            to="/linux"
            current={lastMode === "linux"}
            onChoose={() => void updatePreferences({ lastMode: "linux" })}
          />
          {hasEnglish && (
            <ModeCard
              icon={LanguagesIcon}
              title="Spoken English"
              description="Learn everyday and interview English step by step, with Hindi meanings, listening, speaking practice and a 30-day challenge. No sign-up, no set-up."
              features={toFeatures("english")}
              cta="Explore Spoken English"
              to="/english"
              current={lastMode === "english"}
              onChoose={() => void updatePreferences({ lastMode: "english" })}
            />
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link className="underline underline-offset-4" to="/research">
            Research
          </Link>{" "}
          ·{" "}
          <Link className="underline underline-offset-4" to="/how-we-decide">
            How we decide what to study
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Everything stays in this browser: no account, no upload. You can
          switch between them at any time. Speech features can use your
          browser's own online services.
        </p>
      </main>
    </div>
  )
}
