import { NavLink, Outlet } from "react-router"
import { PageHeader } from "@/components/shared/page-header"
import { LINUX_COMMANDS } from "@/data/linux/commands"
import { cn } from "@/lib/utils"
import { useActiveMode } from "@/app/use-active-mode"
import { LinuxProvider } from "./linux-context"
import { REFERENCE_ROWS } from "./library"

const TABS = [
  { to: "/linux", label: "Commands", end: true },
  { to: "/linux/terminal", label: "Terminal" },
  { to: "/linux/chmod", label: "Permissions" },
  { to: "/linux/dates", label: "Date formats" },
  { to: "/linux/challenges", label: "Challenges" },
]

export function LinuxLayout() {
  const mode = useActiveMode()
  return (
    <LinuxProvider>
      <div className="space-y-6">
        <PageHeader
          eyebrow={mode === "study" ? "Study Path" : "Linux Practice"}
          title="Linux practice"
          description={`${LINUX_COMMANDS.length} unique commands from a ${REFERENCE_ROWS}-row reference, a safe practice terminal, a permissions calculator, date formats and challenges.`}
        />
        <nav
          aria-label="Linux practice sections"
          className="lr-scroll -mx-1 overflow-x-auto px-1"
        >
          <ul className="flex w-max gap-1 border-b border-border">
            {TABS.map((tab) => (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    cn(
                      "-mb-px block border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Outlet />
      </div>
    </LinuxProvider>
  )
}
