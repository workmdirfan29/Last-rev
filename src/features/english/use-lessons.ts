import { useQuery } from "@tanstack/react-query"
import { loadLesson, loadModuleLessons } from "@/data/english/loaders"

const STATIC = { staleTime: Infinity, gcTime: Infinity } as const

export const useLesson = (id: string) =>
  useQuery({
    queryKey: ["english-lesson", id],
    queryFn: () => loadLesson(id),
    ...STATIC,
  })

export const useModuleLessons = (moduleId: string) =>
  useQuery({
    queryKey: ["english-module", moduleId],
    queryFn: () => loadModuleLessons(moduleId),
    ...STATIC,
  })
