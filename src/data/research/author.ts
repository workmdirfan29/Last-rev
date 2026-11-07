import {
  researchEntrySchema,
  type AuthoredResearchEntry,
  type ResearchEntry,
} from "../../types/research"

/**
 * Authoring helper: parses each entry with the schema (so a prediction typed as observed, a missing source or a
 * high-confidence forecast fails loudly).
 *
 *   // src/data/research/frontend.ts   (the file name is the area id)
 *   export default defineResearch([{ id: "...", area: "frontend", ... }])
 */
export function defineResearch(
  entries: AuthoredResearchEntry[]
): ResearchEntry[] {
  return entries.map((e) => researchEntrySchema.parse(e))
}
