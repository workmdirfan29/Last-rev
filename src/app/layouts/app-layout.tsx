import { Suspense, useEffect } from "react"
import { Outlet, useLocation } from "react-router"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { AppHeader } from "@/components/navigation/app-header"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { RouteError } from "@/components/shared/route-error"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { useLearnerStore } from "@/stores/learner-store"
import { isEnglishPath, isLinuxPath, modeOfPath } from "@/app/nav"
import { markResumeHandled } from "@/features/landing/resume"

export function AppLayout() {
  const { pathname } = useLocation()
  const collapsed = useLearnerStore((s) => s.preferences.sidebarCollapsed)
  const updatePreferences = useLearnerStore((s) => s.updatePreferences)
  const lastMode = useLearnerStore((s) => s.preferences.lastMode)

  // Entering a journey's pages remembers it, so the landing page can resume it next time.
  // The Linux pages belong to Linux Practice, or to Study Path when reached from it.
  const pageMode =
    modeOfPath(pathname) ??
    (isLinuxPath(pathname)
      ? lastMode === "study"
        ? "study"
        : "linux"
      : isEnglishPath(pathname)
        ? "english"
        : null)
  // Reaching any journey page counts as the resume: Back to `/` then shows the choices.
  useEffect(() => markResumeHandled(), [])
  useEffect(() => {
    if (pageMode && pageMode !== lastMode)
      void updatePreferences({ lastMode: pageMode })
  }, [pageMode, lastMode, updatePreferences])

  return (
    // Controlled by the saved preference: shadcn's provider only calls `onOpenChange`
    // (and skips its own state) when a callback is given, so `defaultOpen` alone never toggles.
    <SidebarProvider
      open={!collapsed}
      onOpenChange={(open) =>
        void updatePreferences({ sidebarCollapsed: !open })
      }
    >
      <AppSidebar />
      <SidebarInset>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <AppHeader />
        <div
          id="main"
          tabIndex={-1}
          className="flex-1 px-4 py-6 pb-24 outline-none sm:px-6 md:pb-8 lg:px-8"
        >
          <div className="mx-auto w-full max-w-6xl">
            <ErrorBoundary fallback={<RouteError />} resetKey={pathname}>
              <Suspense fallback={<ScreenLoader />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </SidebarInset>
      <MobileNav />
    </SidebarProvider>
  )
}
