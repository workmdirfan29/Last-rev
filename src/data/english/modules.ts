import type { EnglishModuleId, ReviewState } from "../../types/english.ts"

/**
 * The course modules. A module is one file (`<id>.ts`, `layout: "file"`) or, for Daily English, one file per
 * category inside a folder (`daily/<category>.ts`, `layout: "folder"`, each category declared below).
 * Every module starts as a draft: only a teacher's review changes that, and the gate then requires who and when.
 */
export interface EnglishModuleMeta {
  id: EnglishModuleId
  title: string
  titleHi: string
  description: string
  layout: "file" | "folder"
  review: ReviewState
  /** Required when `review` is "teacher-reviewed". */
  reviewer?: string
  reviewedOn?: string
}

export interface EnglishCategory {
  /** The file name: `daily/<slug>.ts`. */
  slug: string
  title: string
  titleHi: string
}

export const ENGLISH_MODULES: readonly EnglishModuleMeta[] = [
  {
    id: "fundamentals",
    title: "English Fundamentals",
    titleHi: "अंग्रेज़ी की बुनियाद",
    description:
      "The alphabet, common words, daily vocabulary and basic grammar.",
    layout: "file",
    review: "draft",
  },
  {
    id: "daily",
    title: "Daily Use English",
    titleHi: "रोज़ की अंग्रेज़ी",
    description:
      "Sentences for everyday situations, with Hindi meanings and example conversations.",
    layout: "folder",
    review: "draft",
  },
  {
    id: "speaking",
    title: "Speaking Practice",
    titleHi: "बोलने का अभ्यास",
    description:
      "Daily speaking exercises, question and answer practice and confidence building.",
    layout: "file",
    review: "draft",
  },
  {
    id: "professional",
    title: "Professional Communication",
    titleHi: "पेशेवर बातचीत",
    description:
      "Introductions, meetings, updates, blockers, email and etiquette.",
    layout: "file",
    review: "draft",
  },
  {
    id: "interview",
    title: "Interview English",
    titleHi: "इंटरव्यू की अंग्रेज़ी",
    description:
      "Interview answers in easy, intermediate and professional English.",
    layout: "file",
    review: "draft",
  },
]

/** The 13 Daily English categories, in course order. A file in `daily/` must be one of these. */
export const DAILY_CATEGORIES: readonly EnglishCategory[] = [
  {
    slug: "morning-conversations",
    title: "Morning conversations",
    titleHi: "सुबह की बातचीत",
  },
  { slug: "at-home", title: "At home", titleHi: "घर पर" },
  { slug: "at-the-office", title: "At the office", titleHi: "ऑफ़िस में" },
  {
    slug: "talking-to-friends",
    title: "Talking to friends",
    titleHi: "दोस्तों से बातचीत",
  },
  {
    slug: "asking-questions",
    title: "Asking questions",
    titleHi: "सवाल पूछना",
  },
  { slug: "making-requests", title: "Making requests", titleHi: "अनुरोध करना" },
  { slug: "giving-answers", title: "Giving answers", titleHi: "जवाब देना" },
  {
    slug: "expressing-opinions",
    title: "Expressing opinions",
    titleHi: "राय रखना",
  },
  { slug: "apologizing", title: "Apologizing", titleHi: "माफ़ी माँगना" },
  { slug: "thanking", title: "Thanking", titleHi: "धन्यवाद कहना" },
  { slug: "asking-for-help", title: "Asking for help", titleHi: "मदद माँगना" },
  { slug: "telephone", title: "On the telephone", titleHi: "फ़ोन पर" },
  {
    slug: "professional",
    title: "Professional situations",
    titleHi: "पेशेवर स्थितियाँ",
  },
]

export const getEnglishModule = (id: string): EnglishModuleMeta | undefined =>
  ENGLISH_MODULES.find((m) => m.id === id)
