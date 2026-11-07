import { useQuery } from "@tanstack/react-query"
import {
  loadAllStudyLessons,
  loadModuleStudyLessons,
  loadStudyLesson,
} from "@/data/lessons/loaders"

/** Lesson bodies are immutable at runtime: cached for the session, like questions. */
const STATIC = { staleTime: Infinity, gcTime: Infinity } as const

export const useStudyLesson = (id: string) =>
  useQuery({
    queryKey: ["study-lesson", id],
    queryFn: () => loadStudyLesson(id),
    ...STATIC,
  })

export const useModuleStudyLessons = (moduleId: string, enabled = true) =>
  useQuery({
    queryKey: ["study-module-lessons", moduleId],
    queryFn: () => loadModuleStudyLessons(moduleId),
    enabled,
    ...STATIC,
  })

export const useAllStudyLessons = () =>
  useQuery({
    queryKey: ["study-all-lessons"],
    queryFn: loadAllStudyLessons,
    ...STATIC,
  })

/** Several lesson bodies at once (a phase quiz draws from every lesson of its phase). */
export const useStudyLessons = (ids: readonly string[]) =>
  useQuery({
    queryKey: ["study-lessons", [...ids].sort().join(",")],
    queryFn: async () =>
      (await Promise.all(ids.map((id) => loadStudyLesson(id)))).filter(
        (l): l is NonNullable<typeof l> => l !== null
      ),
    enabled: ids.length > 0,
    ...STATIC,
  })
