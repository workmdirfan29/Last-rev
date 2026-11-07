import { defineResearch } from "@/data/research/author"

export default defineResearch([
  {
    id: "node-lts-lines-for-production",
    topic: "Which Node.js version to learn on",
    area: "languages-and-frameworks",
    level: "all",
    claim:
      "Node.js's own release page lists versions 22, 24 and 26 as LTS lines and version 27 as an alpha, and advises that production applications use only an Active LTS or Maintenance LTS release.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "Node.js Releases",
          publisher: "Node.js",
          url: "https://nodejs.org/en/about/previous-releases",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
  {
    id: "python-five-year-support",
    topic: "How long a Python version is supported",
    area: "languages-and-frameworks",
    level: "all",
    claim:
      "Python's developer guide says each release is supported for five years. When it was read it listed versions 3.11 to 3.15 as supported, with 3.10 reaching end of life on 2026-10-01.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "Status of Python versions",
          publisher: "Python Developer's Guide",
          url: "https://devguide.python.org/versions/",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
  {
    id: "jdk-six-month-releases",
    topic: "Java release cadence",
    area: "languages-and-frameworks",
    level: "all",
    claim:
      "The OpenJDK project ships a feature release every six months on a strict, time-based model, and its page lists JDK 27 as generally available since September 2026.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "JDK Project",
          publisher: "OpenJDK",
          url: "https://openjdk.org/projects/jdk/",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
  {
    id: "spring-boot-java-17-minimum",
    topic: "Java version needed for Spring Boot",
    area: "languages-and-frameworks",
    level: "fresher",
    claim:
      "Spring Boot's system requirements page says version 4.1.2 requires at least Java 17 and works with versions up to Java 27, and needs Maven 3.6.3 or later or Gradle 8.14 or later.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "System Requirements",
          publisher: "Spring Boot reference documentation",
          url: "https://docs.spring.io/spring-boot/system-requirements.html",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
  {
    id: "react-docs-cover-react-19",
    topic: "Which React version the official docs teach",
    area: "languages-and-frameworks",
    level: "fresher",
    claim:
      "React's versions page shows React 19 as the latest major line, and says older majors are archived on separate sites such as 18.react.dev.",
    evidence: {
      type: "official-documentation",
      sources: [
        {
          title: "React Versions",
          publisher: "React",
          url: "https://react.dev/versions",
        },
      ],
    },
    researchedOn: "2026-11-03",
    confidence: "high",
    horizon: 2026,
    predicted: false,
  },
])
