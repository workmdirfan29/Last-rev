import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "so-2026-most-used-languages",
    topic: "Languages developers say they use most",
    area: "jobs",
    level: "all",
    claim:
      "In the Stack Overflow Developer Survey 2026, JavaScript (62.0%), SQL (58.4%), HTML/CSS (58.2%) and Python (58.0%) were the four most-used languages among respondents. This reports what the survey's respondents use, not how many jobs ask for each.",
    evidence: {
      type: "job-market-trend",
      sources: [
        {
          title: "Stack Overflow Developer Survey 2026: Technology",
          publisher: "Stack Overflow",
          url: "https://survey.stackoverflow.co/2026/technology",
          publishedOn: "2026",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "medium",
    horizon: 2026,
    predicted: false,
  },
  {
    id: "so-2026-typescript-and-java-use",
    topic: "TypeScript and Java among survey respondents",
    area: "jobs",
    level: "all",
    claim:
      "In the same survey, TypeScript was used by 43.8% of respondents and Java by 27.6%. It is self-reported usage, so it does not measure hiring demand.",
    evidence: {
      type: "job-market-trend",
      sources: [
        {
          title: "Stack Overflow Developer Survey 2026: Technology",
          publisher: "Stack Overflow",
          url: "https://survey.stackoverflow.co/2026/technology",
          publishedOn: "2026",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "medium",
    horizon: 2026,
    predicted: false,
  },
])
