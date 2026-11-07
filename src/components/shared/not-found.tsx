import { Link } from "react-router"
import { CompassIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg p-6">
      <EmptyState
        icon={CompassIcon}
        title="Page not found"
        description="That address doesn't match anything in LastRev."
        action={
          <Button asChild>
            <Link to="/dashboard">Go to overview</Link>
          </Button>
        }
      />
    </div>
  )
}
