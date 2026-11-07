import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "react-hooks-state-in-function-components",
    topic: "State in React function components",
    area: "frontend",
    level: "fresher",
    claim:
      "React's own documentation teaches state in function components with the useState Hook, so a fresher should be able to explain it.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "useState",
          publisher: "React",
          url: "https://react.dev/reference/react/useState",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
  {
    id: "frontend-typescript-2027",
    topic: "TypeScript for front-end roles",
    area: "frontend",
    level: "fresher",
    claim:
      "Reading and writing basic TypeScript is likely to stay a useful skill for front-end roles in 2027.",
    evidence: {
      type: "preparation-recommendation",
      sources: [],
      basis:
        "TypeScript was the sixth most-used language among Stack Overflow 2026 survey respondents, and the React documentation includes a TypeScript guide. This is reasoning from those two facts, not a finding about job postings.",
    },
    researchedOn: "2026-11-03",
    confidence: "low",
    horizon: 2027,
    predicted: true,
  },
])
