import { Link } from "react-router"
import { lessonsOfModule } from "@/services/english/catalogue"

/** True once the Interview English module has lessons: the links below never point at an empty page. */
export const hasInterviewEnglish = () => lessonsOfModule("interview").length > 0

/** A card on the HR page and the Interview Zone that leads to Interview English in the Spoken English course. */
export function InterviewEnglishLink() {
  if (!hasInterviewEnglish()) return null
  return (
    <Link
      to="/english/course/interview"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span>
        <span className="block text-sm font-medium">Interview English</span>
        <span className="block text-xs text-muted-foreground">
          Say your interview answers in easy, intermediate or professional
          English. Part of the Spoken English course.
        </span>
      </span>
      <span className="text-xs font-medium">Open Interview English</span>
    </Link>
  )
}
