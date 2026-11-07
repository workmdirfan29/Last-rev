import type { ContentStatus } from "./module-types"

/**
 * Which modules may call their lessons "released". Only the content gate can move a module here: a module
 * must have a lesson for every topic with minutes, lesson minutes within the tolerance of the topic's minutes,
 * and at least `RELEASE_MIN_LESSONS` lessons (`data/lessons/content-gate.test.ts` fails otherwise).
 * A module with some lessons but not listed here is "in progress"; one without any is "planned" (derived).
 */
export const LESSON_STATUS: Readonly<Record<string, ContentStatus>> = {
  "java-core": "released",
  javascript: "released",
  react: "released",
  "react-hooks": "released",
  html: "released",
  css: "released",
  typescript: "released",
  nodejs: "released",
  express: "released",
  sql: "released",
  git: "released",
  "python-fundamentals": "released",
  "python-data-structures": "released",
  "python-oop": "released",
  "python-exceptions-files": "released",
  docker: "released",
  "linux-commands": "released",
  http: "released",
  "rest-apis": "released",
  testing: "released",
  networking: "released",
  "java-exceptions": "released",
  "java-8-plus": "released",
  "java-oop": "released",
  "java-collections": "released",
  "java-multithreading": "released",
  "jvm-memory": "released",
  "spring-boot": "released",
  "spring-framework": "released",
  "spring-mvc": "released",
  "spring-security": "released",
  jdbc: "released",
  "hibernate-jpa": "released",
}
