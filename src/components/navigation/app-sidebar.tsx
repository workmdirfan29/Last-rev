import { useState } from "react"
import { NavLink, useLocation } from "react-router"
import { dueLessons } from "@/services/study/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  isNavActive,
  MODE_HOME,
  NAV_BY_MODE,
  SWITCH_MODE_ITEM,
  type NavItem,
} from "@/app/nav"
import { useActiveMode } from "@/app/use-active-mode"
import { Brand, BrandMark } from "@/components/shared/brand"
import { useLibrary } from "@/features/library/use-library"
import { useLearnerStore } from "@/stores/learner-store"
import { getRole } from "@/data/catalog/roles"
import { getRoadmap } from "@/data/catalog/roadmaps"

/** Live count for an item that carries a count source; hidden until the data is ready. */
function NavCount({ source }: { source: NonNullable<NavItem["count"]> }) {
  const library = useLibrary()
  if (!library) return null
  const n = library.lists[source].length
  return (
    <SidebarMenuBadge>
      {n}
      <span className="sr-only"> {n === 1 ? "question" : "questions"}</span>
    </SidebarMenuBadge>
  )
}

/** Lessons due for revision today, as a badge on the Study "Revise" item (hidden at zero). */
function DueLessonsBadge() {
  const progress = useLearnerStore((s) => s.progress)
  const [now] = useState(() => new Date())
  const n = dueLessons(progress, now).length
  if (n === 0) return null
  return (
    <SidebarMenuBadge>
      {n}
      <span className="sr-only"> {n === 1 ? "lesson due" : "lessons due"}</span>
    </SidebarMenuBadge>
  )
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const profile = useLearnerStore((s) => s.profile)
  const mode = useActiveMode()
  const primary = profile?.primaryRole
    ? getRole(profile.primaryRole)
    : undefined
  const roadmap = getRoadmap(profile?.studyRoadmap)
  const footer =
    mode === "linux"
      ? undefined
      : mode === "study"
        ? roadmap && { label: "Studying", title: roadmap.title }
        : primary && { label: "Preparing for", title: primary.title }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavLink
          to={MODE_HOME[mode]}
          className="flex h-9 items-center gap-2 px-1.5 group-data-[collapsible=icon]:px-0"
        >
          <span className="group-data-[collapsible=icon]:hidden">
            <Brand />
          </span>
          <span className="hidden group-data-[collapsible=icon]:block">
            <BrandMark />
          </span>
          <span className="sr-only">LastRev home</span>
        </NavLink>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={SWITCH_MODE_ITEM.title}>
              <NavLink to={SWITCH_MODE_ITEM.to}>
                <SWITCH_MODE_ITEM.icon />
                <span>{SWITCH_MODE_ITEM.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_BY_MODE[mode].map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavActive(item, pathname)
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                      >
                        <NavLink to={item.to} end={item.end}>
                          <item.icon />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                      {item.count && <NavCount source={item.count} />}
                      {item.badge === "study-due" && <DueLessonsBadge />}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {footer && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg border border-sidebar-border p-2.5">
            <p className="lr-eyebrow">{footer.label}</p>
            <p className="mt-0.5 truncate text-xs font-medium">
              {footer.title}
            </p>
          </div>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
