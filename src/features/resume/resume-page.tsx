import { useState } from "react"
import { useSearchParams } from "react-router"
import { LockIcon } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportPanel } from "./import-panel"
import { ProfileEditor } from "./profile-editor"
import { QuestionBank } from "./question-bank"
import { SetsPanel } from "./sets-panel"
import { useResume, useResumeActions } from "./use-resume"

const TABS = ["profile", "questions", "sets"] as const
type Tab = (typeof TABS)[number]

/** The always-visible privacy line. */
export const PRIVACY_LINE =
  "Your resume stays in this browser. Nothing is uploaded."

/** `/resume`: import or paste, review the profile, practise the questions made from it, share question sets. */
export function ResumePage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get("tab")
  const tab: Tab = (TABS as readonly string[]).includes(requested ?? "")
    ? (requested as Tab)
    : "profile"
  const { resume, questions, pending } = useResume()
  const { build } = useResumeActions()
  const [busy, setBusy] = useState(false)
  const [replacing, setReplacing] = useState<{
    lines: string[]
    name: string
  } | null>(null)
  const [showImport, setShowImport] = useState(false)

  async function run(lines: string[], name: string) {
    setBusy(true)
    try {
      const c = await build(lines, name)
      setShowImport(false)
      setReplacing(null)
      setParams(new URLSearchParams({ tab: "profile" }), { replace: true })
      toast(
        `Built your profile: found ${c.jobs} ${c.jobs === 1 ? "job" : "jobs"}, ${c.projects} ${c.projects === 1 ? "project" : "projects"}, ${c.skills} skills. Please check each section.`
      )
    } finally {
      setBusy(false)
    }
  }
  function onBuild(lines: string[], name: string) {
    if (resume) setReplacing({ lines, name })
    else void run(lines, name)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Interview Prep"
        title="Resume interview"
        description="Practise the questions an interviewer could ask about your own resume. Questions are made from your reviewed resume with templates; no AI is involved."
      />
      <p
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
        data-testid="privacy-line"
      >
        <LockIcon className="size-4 shrink-0" aria-hidden />
        {PRIVACY_LINE}
      </p>

      {!resume ? (
        <section aria-label="Import your resume" className="space-y-3">
          <h2 className="text-sm font-medium">Start with your resume</h2>
          <ImportPanel onBuild={onBuild} busy={busy} />
        </section>
      ) : (
        <Tabs
          value={tab}
          onValueChange={(v) =>
            setParams(new URLSearchParams({ tab: v }), { replace: true })
          }
          className="gap-5"
        >
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="questions">
              Questions ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="sets">Question sets</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <ProfileEditor />
            <details
              className="rounded-xl border border-border bg-card p-4"
              open={showImport}
              onToggle={(e) =>
                setShowImport((e.target as HTMLDetailsElement).open)
              }
            >
              <summary className="cursor-pointer text-sm font-medium">
                Import a different resume
              </summary>
              <div className="mt-4">
                <ImportPanel onBuild={onBuild} busy={busy} />
              </div>
            </details>
          </TabsContent>
          <TabsContent value="questions">
            <QuestionBank pending={pending} />
          </TabsContent>
          <TabsContent value="sets">
            <SetsPanel />
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog
        open={replacing !== null}
        onOpenChange={(o) => !o && setReplacing(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace your resume?</AlertDialogTitle>
            <AlertDialogDescription>
              The questions made from your current resume will be marked "Source
              removed", because the new resume has new items. Your answers,
              notes and progress are kept. Editing your current resume instead
              keeps every question as it is.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setReplacing(null)}>
              Edit my current resume instead
            </AlertDialogAction>
            <AlertDialogCancel
              onClick={() => {
                if (replacing) void run(replacing.lines, replacing.name)
              }}
            >
              Replace my resume
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
