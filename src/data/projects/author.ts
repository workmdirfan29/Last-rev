import {
  projectSchema,
  type AuthoredProject,
  type Project,
} from "../../types/project"

/**
 * Authoring helper: parses a project with the schema (so a malformed project fails loudly).
 *
 *   // src/data/projects/hello-cli.ts   (the file name is the project id)
 *   export default defineProject({ id: "hello-cli", kind: "mini", ... })
 */
export function defineProject(project: AuthoredProject): Project {
  return projectSchema.parse(project)
}
