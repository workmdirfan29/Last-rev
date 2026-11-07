import { useRef, useState } from "react"
import { DownloadIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  parseImport,
  type ImportResult,
} from "@/services/storage/import-export"
import { useLearnerStore } from "@/stores/learner-store"
import { useNavigate } from "react-router"
import { MODE_HOME } from "@/app/nav"
import { resumeMode } from "@/app/bootstrap"

export function DataManagement() {
  const navigate = useNavigate()
  const exportData = useLearnerStore((s) => s.exportData)
  const resume = useLearnerStore((s) => s.resume)
  const importData = useLearnerStore((s) => s.importData)
  const resetAll = useLearnerStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Extract<
    ImportResult,
    { ok: true }
  > | null>(null)

  function download() {
    const bundle = exportData()
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lastrev-backup-${bundle.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Backup downloaded")
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    const result = parseImport(await file.text())
    if (fileRef.current) fileRef.current.value = ""
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setPending(result)
  }

  async function confirmImport() {
    if (!pending) return
    await importData(pending.bundle)
    toast.success("Backup restored")
    setPending(null)
    const { profile, preferences } = pending.bundle
    const resume = resumeMode(profile, preferences.lastMode)
    navigate(resume ? MODE_HOME[resume] : "/", { replace: true })
  }

  async function reset() {
    await resetAll()
    toast.success("All local data deleted")
    navigate("/", { replace: true })
  }

  return (
    <section
      className="space-y-4 rounded-xl border border-border bg-card p-5"
      aria-labelledby="data-heading"
    >
      <div>
        <h2 id="data-heading" className="text-sm font-medium">
          Your data
        </h2>
        <p className="mt-1 text-xs/relaxed text-muted-foreground">
          Everything is stored only in this browser (IndexedDB). It does not
          sync between devices, and your browser or you can clear it — download
          a backup regularly if your progress matters to you.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="lg" onClick={download}>
          <DownloadIcon /> Export backup (JSON)
        </Button>
        {resume && (
          <p className="basis-full text-xs text-muted-foreground">
            This backup includes your resume details.
          </p>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={() => fileRef.current?.click()}
        >
          <UploadIcon /> Import backup
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose a LastRev backup file"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg">
              <Trash2Icon /> Reset everything
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all local data?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes your profile, progress, notes,
                bookmarks and activity history from this browser. Export a
                backup first if you might want it back.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => void reset()}
              >
                Delete everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <AlertDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Replace your data with this backup?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending && (
                <>
                  The backup contains {pending.summary.questions} question
                  records and {pending.summary.activity} activity entries
                  {pending.summary.hasProfile ? " and a profile" : ""}.
                  {pending.summary.duplicatesMerged > 0 &&
                    ` ${pending.summary.duplicatesMerged} duplicate entries were merged (newest kept).`}{" "}
                  This replaces everything currently stored in this browser.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmImport()}>
              Replace my data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
