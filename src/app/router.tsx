import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  type RouteObject,
} from "react-router"
import { AppBootstrap, RequireAnyMode, RequireMode } from "./bootstrap"
import { AppLayout } from "./layouts/app-layout"
import { RouteError } from "@/components/shared/route-error"
import { Brand } from "@/components/shared/brand"
import { NotFoundPage } from "@/components/shared/not-found"

function BootFallback() {
  return (
    <div
      className="flex min-h-svh items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <Brand className="animate-pulse" />
    </div>
  )
}

/**
 * Route table. Every page is a lazily-loaded chunk; `handle.title` feeds the
 * header. Deep links work after refresh because state is hydrated from
 * IndexedDB before any route renders.
 */
export const routes: RouteObject[] = [
  {
    element: <AppBootstrap />,
    errorElement: <RouteError />,
    HydrateFallback: BootFallback,
    children: [
      // Landing: `/` resumes a returning learner's journey, `/choose` never redirects (switch mode).
      { path: "/", lazy: () => import("@/features/landing/routes") },
      {
        path: "/choose",
        lazy: async () => ({
          Component: (await import("@/features/landing/routes"))
            .ChooseComponent,
        }),
      },
      // Journey set-up screens.
      {
        path: "/start/interview",
        lazy: () => import("@/features/onboarding/routes"),
      },
      {
        path: "/start/study",
        lazy: () => import("@/features/study/start-route"),
      },
      {
        path: "/onboarding",
        lazy: async () => ({
          Component: (await import("@/features/onboarding/routes"))
            .EditComponent,
        }),
      },
      {
        // Interview Prep: interview content only.
        element: <RequireMode mode="interview" />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "dashboard",
                handle: { title: "Overview" },
                lazy: () => import("@/features/dashboard/routes"),
              },
              {
                path: "interview",
                handle: { title: "Interview Zone" },
                lazy: () => import("@/features/interview/home-route"),
              },
              {
                // Mock interviews own their sub-routes (home, setup, session, result, history).
                path: "mock/*",
                handle: { title: "Mock interview" },
                lazy: () => import("@/features/mock/routes"),
              },
              {
                // The Resume interview studio: import, review, practise, share question sets.
                path: "resume/*",
                handle: { title: "Resume interview" },
                lazy: () => import("@/features/resume/routes"),
              },
              {
                // The HR interview feature owns its sub-routes (home, my answers).
                path: "hr/*",
                handle: { title: "HR interview" },
                lazy: () => import("@/features/hr/routes"),
              },
              {
                path: "interview/manage",
                handle: { title: "Manage my prep" },
                lazy: () => import("@/features/interview/manage/manage-route"),
              },
              {
                path: "interview/question/:id",
                handle: { title: "Question" },
                lazy: () => import("@/features/interview/question-route"),
              },
              {
                path: "interview/:roleId/:moduleId",
                handle: { title: "Question library" },
                lazy: () => import("@/features/interview/library-route"),
              },
              {
                path: "library/:list?",
                handle: { title: "Library" },
                lazy: () => import("@/features/library/routes"),
              },
              // Old bookmarks/links keep working.
              {
                path: "bookmarks",
                element: <Navigate to="/library/saved" replace />,
              },
            ],
          },
        ],
      },
      {
        // Study Path: roadmaps and practice.
        element: <RequireMode mode="study" />,
        children: [
          // Edit screen: full page like /onboarding, outside the app shell.
          {
            path: "study/plan",
            lazy: () => import("@/features/study/plan-route"),
          },
          {
            element: <AppLayout />,
            children: [
              {
                // The Study Path owns its sub-routes (home, lessons, roadmap, ...).
                path: "study/*",
                handle: { title: "Study Path" },
                lazy: () => import("@/features/study/routes"),
              },
            ],
          },
        ],
      },
      {
        // Linux Practice: a standalone journey. No set-up and no profile; also reachable from Study Path.
        element: <AppLayout />,
        children: [
          {
            // The Linux feature owns its sub-routes (library, terminal, tools).
            path: "linux/*",
            handle: { title: "Linux practice" },
            lazy: () => import("@/features/linux/routes"),
          },
        ],
      },
      {
        // Research and the method page: static, open to every journey (no profile needed).
        element: <AppLayout />,
        children: [
          {
            path: "research",
            handle: { title: "Research" },
            lazy: () => import("@/features/research/routes"),
          },
          {
            path: "how-we-decide",
            handle: { title: "How we decide what to study" },
            lazy: async () => ({
              Component: (await import("@/features/research/routes"))
                .HowWeDecideComponent,
            }),
          },
        ],
      },
      {
        // Spoken English: a standalone journey. No set-up and no profile.
        element: <AppLayout />,
        children: [
          {
            path: "english/*",
            handle: { title: "Spoken English" },
            lazy: () => import("@/features/english/routes"),
          },
        ],
      },
      {
        // Shared pages: available once either journey is set up.
        element: <RequireAnyMode />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "job-match",
                handle: { title: "Job match" },
                lazy: async () => ({
                  Component: (await import("@/features/job-match/routes"))
                    .JobMatchComponent,
                }),
              },
              {
                path: "readiness",
                handle: { title: "Readiness" },
                lazy: async () => ({
                  Component: (await import("@/features/readiness/routes"))
                    .ReadinessComponent,
                }),
              },
              {
                path: "settings",
                handle: { title: "Settings" },
                lazy: () => import("@/features/settings/routes"),
              },
              {
                path: "settings/syllabus",
                handle: { title: "Syllabus" },
                lazy: () => import("@/features/settings/syllabus-route"),
              },
            ],
          },
        ],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
]

export const createAppRouter = () => createBrowserRouter(routes)
export const createTestRouter = (initialEntries: string[]) =>
  createMemoryRouter(routes, { initialEntries })
