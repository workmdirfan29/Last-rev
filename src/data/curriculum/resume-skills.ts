/**
 * The resume skill inventory, as the learner wrote it, grouped as they grouped
 * it. Each entry is a skill id in `skills.ts`, so every resume skill traces to a
 * module and a topic. A test keeps this list complete.
 */
export const RESUME_SKILL_GROUPS: { label: string; skillIds: string[] }[] = [
  {
    label: "Languages",
    skillIds: ["javascript", "typescript", "java", "sql", "html5", "css3"],
  },
  {
    label: "Frontend",
    skillIds: [
      "react",
      "react-hooks",
      "react-router",
      "tailwind-css",
      "shadcn-ui",
      "responsive-design",
      "recharts",
      "spa",
      "component-architecture",
    ],
  },
  {
    label: "State management",
    skillIds: ["redux-toolkit", "zustand", "tanstack-query"],
  },
  {
    label: "Mobile",
    skillIds: [
      "react-native",
      "expo",
      "eas-build",
      "react-navigation",
      "android",
      "google-play-console",
    ],
  },
  {
    label: "Backend",
    skillIds: [
      "nodejs",
      "express",
      "java",
      "spring-boot",
      "hibernate",
      "jpa",
      "rest-apis",
      "controller-service-repository",
    ],
  },
  { label: "Database", skillIds: ["postgresql", "mongodb", "sql"] },
  {
    label: "Documentation and logging",
    skillIds: ["swagger-openapi", "log4j"],
  },
  {
    label: "Authentication and payments",
    skillIds: ["jwt", "otp-authentication", "rbac", "razorpay"],
  },
  { label: "Forms", skillIds: ["react-hook-form", "zod"] },
  {
    label: "Testing",
    skillIds: [
      "jest",
      "react-testing-library",
      "vitest",
      "msw",
      "postman",
      "chrome-devtools",
      "react-profiler",
      "lighthouse",
    ],
  },
  {
    label: "DevOps",
    skillIds: [
      "git",
      "github",
      "bitbucket",
      "docker",
      "nginx",
      "pm2",
      "lets-encrypt",
      "vps-deployment",
      "linux-ubuntu",
    ],
  },
  {
    label: "Tools and practices",
    skillIds: [
      "jira",
      "figma",
      "vscode",
      "agile",
      "requirement-gathering",
      "ui-prototyping",
      "api-integration",
      "debugging",
    ],
  },
]

export const RESUME_SKILL_IDS: string[] = [
  ...new Set(RESUME_SKILL_GROUPS.flatMap((g) => g.skillIds)),
]
