import { mod } from "./factory"

export const DEVOPS_MODULES = [
  mod(
    "docker",
    "Docker",
    "devops",
    "devops",
    "intermediate",
    "Images, containers, networking, volumes, Compose and image optimization.",
    [
      ["Images", 60],
      ["Containers", 60],
      ["Volumes", 45],
      ["Networking", 60],
      ["Compose", 70],
      ["Multi-stage builds", 45],
    ],
    { prerequisites: ["linux"], alsoIn: ["foundation"] }
  ),
  mod(
    "nginx",
    "Nginx",
    "devops",
    "devops",
    "intermediate",
    "Reverse proxying, load balancing, TLS, caching and free HTTPS with Let's Encrypt.",
    [
      ["Reverse proxy", 50],
      ["Load balancing", 40],
      ["TLS", 45],
      ["Caching", 30],
      ["HTTPS & Let's Encrypt", 60],
    ],
    { prerequisites: ["linux"] }
  ),
  mod(
    "ci-cd",
    "CI/CD",
    "devops",
    "devops",
    "intermediate",
    "Pipelines and deployment strategies, with Jenkins, GitHub Actions and Bitbucket Pipelines.",
    [
      ["Pipelines", 60],
      ["Deployment strategies", 50],
      ["Jenkins", 90],
      ["GitHub Actions", 70],
      ["Bitbucket Pipelines", 60],
    ],
    { prerequisites: ["docker"], alsoIn: ["foundation"] }
  ),
  mod(
    "aws",
    "AWS",
    "devops",
    "devops",
    "intermediate",
    "Cloud basics and the core services most apps use: IAM, S3, EC2 and RDS.",
    [
      ["Cloud concepts & regions", 45, "AWS Fundamentals"],
      ["IAM", 60, "AWS Fundamentals"],
      ["S3 buckets & storage classes", 45, "S3"],
      ["S3 permissions & policies", 45, "S3"],
      ["EC2 instances", 50, "EC2"],
      ["SSH access", 30, "EC2"],
      ["Security groups", 45, "EC2"],
      ["RDS basics", 40, "AWS Fundamentals"],
    ],
    { alsoIn: ["foundation"] }
  ),
  mod(
    "deployment",
    "Production Deployment",
    "devops",
    "devops",
    "intermediate",
    "Putting an app on a server: VPS setup, process management, configuration and release basics.",
    [
      ["Production deployment checklist", 60],
      ["VPS deployment", 90],
      ["PM2 process management", 50],
      ["Environment variables & config", 40],
      ["Zero-downtime basics", 45],
    ],
    { prerequisites: ["linux"], alsoIn: ["foundation"] }
  ),
  mod(
    "logging",
    "Logging",
    "devops",
    "devops",
    "intermediate",
    "Log levels, structured logs, Log4j, Node.js logging and keeping logs usable in production.",
    [
      ["Log levels & structure", 45],
      ["Log4j", 60],
      ["Node.js logging", 45],
      ["Centralised logs & rotation", 45],
    ],
    { alsoIn: ["java-backend", "mern-backend"] }
  ),
]
