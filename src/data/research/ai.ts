import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "so-2026-llm-use",
    topic: "How common large-language-model use is among developers",
    area: "ai",
    level: "all",
    claim:
      "In the Stack Overflow Developer Survey 2026, 71.8% of respondents (11,655 of 16,241) said they had used a large language model. The survey describes its respondents, who are not a random sample of all developers.",
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
