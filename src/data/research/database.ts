import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "postgresql-five-year-support",
    topic: "How long a PostgreSQL major version is supported",
    area: "database",
    level: "all",
    claim:
      "The PostgreSQL project supports each major version for five years after its first release. When it was read, versions 14 to 18 were listed as supported, and version 14's final release was scheduled for November 2026.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "Versioning Policy",
          publisher: "PostgreSQL Global Development Group",
          url: "https://www.postgresql.org/support/versioning/",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
])
