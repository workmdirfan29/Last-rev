import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "ai-integration-retrieval-basics-2027",
    topic: "Retrieval-augmented generation basics",
    area: "ai-integration",
    level: "intermediate",
    claim:
      "Being able to explain how retrieval-augmented generation fits around a language-model API is likely to be useful preparation for AI-integration roles in 2027.",
    evidence: {
      type: "preparation-recommendation",
      sources: [],
      basis:
        "Language-model APIs are now widely used by developers (see the Stack Overflow 2026 entry), and retrieval is the usual way to give a model access to a team's own data. This is reasoning, not a finding.",
    },
    researchedOn: "2026-11-03",
    confidence: "low",
    horizon: 2027,
    predicted: true,
  },
  {
    id: "ai-integration-testing-model-output-2027",
    topic: "Checking the output of a language-model call",
    area: "ai-integration",
    level: "intermediate",
    claim:
      "Knowing how to test and validate what a language-model call returns, for example by checking its shape and handling failures, is likely to remain a useful skill in 2027.",
    evidence: {
      type: "preparation-recommendation",
      sources: [],
      basis:
        "Any application that calls a model API has to handle unexpected or malformed answers, so the testing habits from ordinary backend work apply. This is reasoning, not a finding.",
    },
    researchedOn: "2026-11-03",
    confidence: "low",
    horizon: 2027,
    predicted: true,
  },
])
