import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CodeXmlIcon,
  CalendarClockIcon,
  FlagIcon,
  FlaskConicalIcon,
  GaugeIcon,
  HammerIcon,
  FlameIcon,
  LanguagesIcon,
  ListChecksIcon,
  LibraryBigIcon,
  MicIcon,
  RotateCcwIcon,
  ScanSearchIcon,
  RouteIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MessagesSquareIcon,
  SettingsIcon,
  TerminalSquareIcon,
  UserCheckIcon,
  UserSearchIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import { LIBRARY_LISTS, type LibraryListId } from "@/features/library/lists"
import type { AppMode } from "@/types/learner"

export interface NavItem {
  id: string
  title: string
  to: string
  icon: LucideIcon
  /** Highlight only on an exact path match (e.g. the overview). */
  end?: boolean
  /** Show in the compact mobile tab bar. */
  mobile?: boolean
  /** Mobile tab label, when the compact bar names the item differently. */
  mobileTitle?: string
  /** The mobile tab stands for a whole section: highlight it anywhere under this prefix. */
  mobileMatch?: string
  /** Live count badge: which derived library list this item counts. */
  count?: LibraryListId
  /** Live count badge for something that is not a library list: lessons due for revision. */
  badge?: "study-due"
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Where each journey starts, and the landing page that switches between them. */
export const MODE_HOME: Record<AppMode, string> = {
  interview: "/dashboard",
  study: "/study",
  linux: "/linux",
  english: "/english",
}
export const MODE_LABEL: Record<AppMode, string> = {
  interview: "Interview Prep",
  study: "Study Path",
  linux: "Linux Practice",
  english: "Spoken English",
}
export const CHOOSE_MODE_PATH = "/choose"

export const SWITCH_MODE_ITEM: NavItem = {
  id: "switch-mode",
  title: "Switch mode",
  to: CHOOSE_MODE_PATH,
  icon: ArrowLeftRightIcon,
  mobile: true,
}

const SETTINGS: NavItem = {
  id: "settings",
  title: "Settings",
  to: "/settings",
  icon: SettingsIcon,
  mobile: true,
}

/**
 * Navigation registry, one list per journey. A feature is added here only when
 * its route exists and works: the sidebar never shows dead or placeholder links.
 */
export const NAV_BY_MODE: Record<AppMode, NavGroup[]> = {
  interview: [
    {
      label: "Learn",
      items: [
        {
          id: "overview",
          title: "Overview",
          to: "/dashboard",
          icon: LayoutDashboardIcon,
          end: true,
          mobile: true,
        },
        {
          id: "readiness",
          title: "Readiness",
          to: "/readiness",
          icon: GaugeIcon,
        },
        {
          id: "job-match",
          title: "Job match",
          to: "/job-match",
          icon: ScanSearchIcon,
        },
        {
          id: "interview",
          title: "Interview Zone",
          to: "/interview",
          icon: MessagesSquareIcon,
          mobile: true,
        },
        {
          // Not in the mobile tab bar (it is full); reached from the Interview Zone and the dashboard there.
          id: "hr",
          title: "HR Interview",
          to: "/hr",
          icon: UsersRoundIcon,
        },
        {
          // Not in the mobile tab bar either; reached from cards on the Interview Zone and the dashboard.
          id: "mock",
          title: "Mock interview",
          to: "/mock",
          icon: UserCheckIcon,
        },
        {
          // Not in the mobile tab bar; reached from cards on the Interview Zone and the dashboard.
          id: "resume",
          title: "Resume interview",
          to: "/resume",
          icon: UserSearchIcon,
        },
      ],
    },
    {
      label: "Library",
      items: LIBRARY_LISTS.map((list) => ({
        id: `library-${list.id}`,
        title: list.title,
        to: list.path,
        icon: list.icon,
        // `/library` is the parent path of the other lists, so it only matches exactly.
        end: list.id === "all",
        count: list.id,
        // One compact tab opens the Saved list and stays highlighted on any list.
        ...(list.id === "saved" && {
          mobile: true,
          mobileTitle: "Library",
          mobileMatch: "/library",
        }),
      })),
    },
    {
      label: "Account",
      items: [
        {
          id: "research",
          title: "Research",
          to: "/research",
          icon: FlaskConicalIcon,
        },
        SETTINGS,
      ],
    },
  ],
  study: [
    {
      label: "Learn",
      items: [
        {
          id: "study-home",
          title: "Study home",
          to: "/study",
          icon: GraduationCapIcon,
          end: true,
          mobile: true,
        },
        {
          id: "study-roadmap",
          title: "Roadmap",
          to: "/study/roadmap",
          icon: RouteIcon,
          mobile: true,
        },
        {
          id: "study-lessons",
          title: "Lessons",
          to: "/study/lessons",
          icon: BookOpenIcon,
          mobile: true,
        },
        {
          id: "study-practice",
          title: "Practice",
          to: "/study/practice",
          icon: CodeXmlIcon,
          mobile: true,
        },
        {
          id: "study-revise",
          title: "Revise",
          to: "/study/revise",
          icon: RotateCcwIcon,
          badge: "study-due",
        },
        {
          id: "study-quizzes",
          title: "Quizzes",
          to: "/study/quizzes",
          icon: ListChecksIcon,
        },
        {
          id: "study-projects",
          title: "Projects",
          to: "/study/projects",
          icon: HammerIcon,
        },
        {
          id: "linux",
          title: "Linux practice",
          to: "/linux",
          icon: TerminalSquareIcon,
        },
      ],
    },
    {
      label: "Track",
      items: [
        {
          id: "study-job-match",
          title: "Job match",
          to: "/job-match",
          icon: ScanSearchIcon,
        },
        {
          id: "study-readiness",
          title: "Readiness",
          to: "/readiness",
          icon: GaugeIcon,
        },
        {
          id: "study-research",
          title: "Research",
          to: "/research",
          icon: FlaskConicalIcon,
        },
        {
          id: "study-progress",
          title: "Progress",
          to: "/study/progress",
          icon: TrendingUpIcon,
        },
      ],
    },
    // Settings is in the sidebar here so the mobile bar keeps room for Roadmap and Practice.
    { label: "Account", items: [{ ...SETTINGS, mobile: false }] },
  ],
  // Spoken English: a standalone course, no profile. Mobile: Home, Course, Challenge, Practice (+ Switch); Settings is in the sidebar.
  english: [
    {
      label: "Spoken English",
      items: [
        {
          id: "english-home",
          title: "Home",
          to: "/english",
          icon: LanguagesIcon,
          end: true,
          mobile: true,
        },
        {
          id: "english-course",
          title: "Course",
          to: "/english/course",
          icon: LibraryBigIcon,
          mobile: true,
        },
        {
          id: "english-challenge",
          title: "Today's challenge",
          to: "/english/challenge",
          icon: FlameIcon,
          mobile: true,
          mobileTitle: "Challenge",
        },
        {
          id: "english-practice",
          title: "Practice",
          to: "/english/practice",
          icon: MicIcon,
          mobile: true,
        },
        {
          id: "english-revise",
          title: "Revise",
          to: "/english/revise",
          icon: RotateCcwIcon,
        },
        {
          id: "english-progress",
          title: "My progress",
          to: "/english/progress",
          icon: TrendingUpIcon,
        },
      ],
    },
    { label: "Account", items: [{ ...SETTINGS, mobile: false }] },
  ],
  // Linux Practice is its own journey: the same pages as the Study entry, with every section in the sidebar.
  linux: [
    {
      label: "Practise",
      items: [
        {
          id: "linux-commands",
          title: "Commands",
          to: "/linux",
          icon: BookOpenIcon,
          end: true,
          mobile: true,
        },
        {
          id: "linux-terminal",
          title: "Terminal",
          to: "/linux/terminal",
          icon: TerminalSquareIcon,
          mobile: true,
        },
        {
          id: "linux-chmod",
          title: "Permissions",
          to: "/linux/chmod",
          icon: ShieldCheckIcon,
        },
        {
          id: "linux-dates",
          title: "Date formats",
          to: "/linux/dates",
          icon: CalendarClockIcon,
        },
        {
          id: "linux-challenges",
          title: "Challenges",
          to: "/linux/challenges",
          icon: FlagIcon,
          mobile: true,
        },
      ],
    },
    { label: "Account", items: [SETTINGS] },
  ],
}

const under = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

/** Whether the current path is this item's page; `compact` is the mobile tab bar, where a tab can cover a section. */
export function isNavActive(
  item: NavItem,
  pathname: string,
  compact = false
): boolean {
  if (compact && item.mobileMatch) return under(pathname, item.mobileMatch)
  return item.end ? pathname === item.to : under(pathname, item.to)
}

export const navItemsFor = (mode: AppMode): NavItem[] =>
  NAV_BY_MODE[mode].flatMap((g) => g.items)

const STUDY_PREFIXES = ["/study"]
const LINUX_PREFIX = "/linux"
const INTERVIEW_PREFIXES = [
  "/dashboard",
  "/interview",
  "/library",
  "/bookmarks", // legacy URL, redirects to /library/saved
  "/onboarding",
]

/** The journey a path belongs to, or null for shared pages such as /settings. */
export function modeOfPath(pathname: string): "interview" | "study" | null {
  if (STUDY_PREFIXES.some((p) => under(pathname, p))) return "study"
  if (INTERVIEW_PREFIXES.some((p) => under(pathname, p))) return "interview"
  return null
}

/** Navigation is derived from the URL; shared pages fall back to the last-used journey. */
export function activeMode(
  pathname: string,
  lastMode: AppMode | null
): AppMode {
  const own = modeOfPath(pathname)
  if (own) return own
  // The Linux pages belong to both entry points: reached from Study Path they keep the Study navigation,
  // otherwise they are the Linux Practice journey.
  if (isLinuxPath(pathname)) return lastMode === "study" ? "study" : "linux"
  if (isEnglishPath(pathname)) return "english"
  return lastMode ?? "interview"
}

export const isLinuxPath = (pathname: string) => under(pathname, LINUX_PREFIX)
export const isEnglishPath = (pathname: string) => under(pathname, "/english")
