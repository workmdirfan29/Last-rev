import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "backend-java-17-baseline-2027",
    topic: "A Java baseline for Spring Boot roles",
    area: "backend",
    level: "fresher",
    claim:
      "Being comfortable with Java 17 or newer language features is a sensible baseline for Spring Boot roles in 2027.",
    evidence: {
      type: "preparation-recommendation",
      sources: [],
      basis:
        "Spring Boot's current system requirements ask for at least Java 17, so new projects built on it use that version or later. This is reasoning from that requirement, not a finding about hiring.",
    },
    researchedOn: "2026-11-03",
    confidence: "medium",
    horizon: 2027,
    predicted: true,
  },
])
