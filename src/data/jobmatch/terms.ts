/**
 * Extra names for skills (beyond the skills table's own titles and aliases), and the explicit rules for names that
 * are ordinary words or very short. ONE data file. A term with no safe rule is never matched.
 */
export const EXTRA_ALIASES: readonly { term: string; skillId: string }[] = [
  { term: "Postgres", skillId: "postgresql" },
  { term: "NodeJS", skillId: "nodejs" },
  { term: "ReactJS", skillId: "react" },
  { term: "Reactjs", skillId: "react" },
  { term: "k8s", skillId: "kubernetes" },
  { term: "Mongo", skillId: "mongodb" },
  { term: "CI/CD", skillId: "ci-cd" },
]

/**
 * Rules for ambiguous or very short names, keyed by the lower-case name. Each is a case-sensitive pattern (JavaScript
 * regular expression source) that must match inside a sentence for the name to count. Example: "Go" is a skill only as
 * `Golang`, or when written exactly `Go` next to a programming word; "Spring" only as Spring Boot, Framework, MVC,
 * Security, Data, Cloud or Batch; "Express" only as Express.js or ExpressJS (or Express framework). "Go-getter" and
 * "Express delivery" are not skills.
 */
export const AMBIGUOUS_RULES: Readonly<
  Record<string, { label: string; pattern: string }>
> = {
  go: {
    label: "Go",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])Golang(?![A-Za-z0-9+#-])|(?:\b(?:use|using|with|in|and|or|plus|including|like|of)|,|/|\(|:)\s*(?<![A-Za-z0-9+#.-])Go(?![A-Za-z0-9+#-])(?!\s+(?:ahead|to|for\s+it|getter))|(?<![A-Za-z0-9+#.-])Go(?=\s+(?:developer|programmer|engineer|language|services?|microservices?|backend|code|programming)\b)`,
  },
  r: {
    label: "R",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])R(?=\s+(?:language|programming|packages?|studio)\b)|RStudio|(?:Python|SQL)\s*(?:,|/|and)\s*R(?![A-Za-z0-9+#.-])|(?<![A-Za-z0-9+#.-])R\s*(?:,|/|and)\s*(?:Python|SQL)\b`,
  },
  spring: {
    label: "Spring",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])Spring(?=\s+(?:Boot|Framework|MVC|Security|Data|Cloud|Batch)\b)`,
  },
  express: {
    label: "Express",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])Express(?:\.js|JS)(?![A-Za-z0-9+#])|(?<![A-Za-z0-9+#.-])Express\s+framework\b|(?:Node(?:\.js|JS)?|MongoDB|React)\s*(?:,|/|and)\s*Express(?![A-Za-z0-9+#.-])`,
  },
  js: {
    label: "JS",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])JS(?![A-Za-z0-9+#.-])`,
  },
  ts: {
    label: "TS",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])TS(?![A-Za-z0-9+#.-])`,
  },
  jpa: {
    label: "JPA",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])JPA(?![A-Za-z0-9+#.-])`,
  },
  s3: {
    label: "S3",
    pattern: String.raw`(?<![A-Za-z0-9+#.-])S3(?![A-Za-z0-9+#.-])`,
  },
}

/** Ordinary capitalised words that look like names in a job description; never reported as unrecognised. */
export const STOP_WORDS: ReadonlySet<string> = new Set(
  `a about ability able across all also and any are as at be been being both build building by can candidate candidates communication company
  could day days degree demonstrated design desired develop developer developers development do does each engineer engineering ensure
  environment excellent experience familiarity familiar for from good great have has hands help high highly if in including is it job join knowledge
  looking manage may must need new not of on one or other our ownership participate plus position preferred proven qualifications
  required requirements responsibilities responsible role skills solid strong support team teams that the their them they this to
  understanding use using we will with work working years you your monday tuesday wednesday thursday friday saturday sunday january february march
  april june july august september october november december about us benefits location remote hybrid full time part salary apply`.split(
    /\s+/
  )
)
