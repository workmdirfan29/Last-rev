import {
  isRouteErrorResponse,
  Link,
  useLocation,
  useRouteError,
} from "react-router"
import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isPrivatePath } from "@/utils/private-routes"
import { EmptyState } from "@/components/shared/empty-state"

export function RouteError() {
  const error = useRouteError()
  const { pathname } = useLocation()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  const message = notFound
    ? "That page doesn't exist."
    : error instanceof Error && !isPrivatePath(pathname)
      ? error.message
      : "Something unexpected happened."

  return (
    <div className="mx-auto max-w-lg p-6">
      <EmptyState
        icon={AlertTriangleIcon}
        title={notFound ? "Page not found" : "This page hit a problem"}
        description={message}
        action={
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/dashboard">Go to overview</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        }
      />
    </div>
  )
}
