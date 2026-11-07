import { useParams } from "react-router"
import { NotFoundPage } from "@/components/shared/not-found"
import { LibraryPage } from "./library-page"
import { getLibraryList } from "./lists"

/** `/library` and `/library/:list` (saved, difficult, revision, notes). */
export function Component() {
  const { list } = useParams()
  const meta = getLibraryList(list)
  return meta ? <LibraryPage list={meta} /> : <NotFoundPage />
}
