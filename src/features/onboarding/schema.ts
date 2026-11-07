import { z } from "zod"
import {
  ALL_WEEKDAYS,
  profileExperienceSchema,
  syllabusOverrideSchema,
  targetPresetSchema,
  type LearnerProfile,
} from "@/types/learner"
import { resolveTargetDate } from "@/services/planner/estimate"
import { toDateKey } from "@/utils/dates"

/**
 * One form shape serves both journeys so the experience and pace steps can be
 * shared. Interview Prep requires `selectedRoles`; Study Path requires
 * `studyRoadmap`. The two schemas below differ only in that rule.
 */
const syllabusOverridesSchema = z.record(z.string(), syllabusOverrideSchema)

const baseShape = {
  displayName: z
    .string()
    .trim()
    .min(1, "Enter your name")
    .max(60, "Keep it under 60 characters"),
  selectedRoles: z.array(z.string()),
  primaryRole: z.string().nullable(),
  studyRoadmap: z.string().nullable(),
  /** Weekdays the learner studies (0 = Sunday). */
  studyDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Choose at least one study day"),
  experience: profileExperienceSchema,
  knownSkills: z.array(z.string()),
  syllabusOverrides: syllabusOverridesSchema,
  studySyllabusOverrides: syllabusOverridesSchema,
  targetRole: z.string().trim().max(80, "Keep it under 80 characters"),
  dailyStudyHours: z.number().min(0.5).max(12),
  targetPreset: targetPresetSchema,
  targetDate: z.string().nullable(),
  interviewDate: z.string().nullable(),
}

type DateFields = Pick<
  z.infer<z.ZodObject<typeof baseShape>>,
  "targetPreset" | "targetDate" | "interviewDate"
>

function checkDates(v: DateFields, ctx: z.RefinementCtx) {
  const today = toDateKey()
  if (v.targetPreset === "custom") {
    if (!v.targetDate) {
      ctx.addIssue({
        code: "custom",
        path: ["targetDate"],
        message: "Choose a target date",
      })
    } else if (v.targetDate <= today) {
      ctx.addIssue({
        code: "custom",
        path: ["targetDate"],
        message: "Target date must be in the future",
      })
    }
  }
  if (v.interviewDate && v.interviewDate < today) {
    ctx.addIssue({
      code: "custom",
      path: ["interviewDate"],
      message: "Interview date can't be in the past",
    })
  }
}

export const onboardingSchema = z
  .object({
    ...baseShape,
    selectedRoles: z.array(z.string()).min(1, "Pick at least one career path"),
  })
  .superRefine(checkDates)

export type OnboardingValues = z.infer<typeof onboardingSchema>

export const studyOnboardingSchema = z
  .object({
    ...baseShape,
    studyRoadmap: z
      .string()
      .nullable()
      .refine((v) => v !== null, "Pick a roadmap"),
  })
  .superRefine(checkDates)

export const ONBOARDING_DEFAULTS: OnboardingValues = {
  displayName: "",
  selectedRoles: [],
  primaryRole: null,
  studyRoadmap: null,
  experience: "beginner",
  studyDays: [...ALL_WEEKDAYS],
  knownSkills: [],
  syllabusOverrides: {},
  studySyllabusOverrides: {},
  targetRole: "",
  dailyStudyHours: 2,
  targetPreset: "30d",
  targetDate: null,
  interviewDate: null,
}

export function valuesFromProfile(
  profile: LearnerProfile | null,
  kind: "interview" | "study" = "interview"
): OnboardingValues {
  if (!profile) return ONBOARDING_DEFAULTS
  return {
    studyDays: profile.plans[kind].studyDays,
    displayName: profile.displayName,
    selectedRoles: profile.selectedRoles,
    primaryRole: profile.primaryRole,
    studyRoadmap: profile.studyRoadmap,
    experience: profile.experience,
    knownSkills: profile.knownSkills,
    syllabusOverrides: profile.syllabusOverrides,
    studySyllabusOverrides: profile.studySyllabusOverrides,
    targetRole: profile.targetRole,
    dailyStudyHours: profile.dailyStudyHours,
    targetPreset: profile.targetPreset,
    targetDate: profile.targetPreset === "custom" ? profile.targetDate : null,
    interviewDate: profile.interviewDate,
  }
}

/** Interview Prep fields. Never touches the Study Path roadmap. */
export function profilePatchFromValues(
  v: OnboardingValues,
  now: Date = new Date()
) {
  return {
    displayName: v.displayName,
    selectedRoles: v.selectedRoles,
    primaryRole:
      v.primaryRole && v.selectedRoles.includes(v.primaryRole)
        ? v.primaryRole
        : v.selectedRoles[0],
    experience: v.experience,
    knownSkills: v.knownSkills,
    syllabusOverrides: v.syllabusOverrides,
    targetRole: v.targetRole,
    dailyStudyHours: v.dailyStudyHours,
    targetPreset: v.targetPreset,
    targetDate: resolveTargetDate(v.targetPreset, v.targetDate, now),
    interviewDate: v.interviewDate || null,
  }
}

/**
 * Study Path fields. Roles, skills and the interview date belong to Interview
 * Prep and are left exactly as they are. Name, experience and pace are shared.
 */
export function studyPatchFromValues(
  v: OnboardingValues,
  now: Date = new Date()
) {
  return {
    displayName: v.displayName,
    studyRoadmap: v.studyRoadmap,
    studySyllabusOverrides: v.studySyllabusOverrides,
    experience: v.experience,
    targetRole: v.targetRole,
    dailyStudyHours: v.dailyStudyHours,
    targetPreset: v.targetPreset,
    targetDate: resolveTargetDate(v.targetPreset, v.targetDate, now),
  }
}
