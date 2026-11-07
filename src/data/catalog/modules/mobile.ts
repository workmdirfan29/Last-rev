import { mod } from "./factory"

export const MOBILE_MODULES = [
  mod(
    "react-native",
    "React Native",
    "frontend",
    "mobile",
    "intermediate",
    "Building mobile screens with React Native: components, navigation, native APIs, authentication and API calls.",
    [
      ["Components & styling", 90],
      ["Native APIs", 75],
      ["React Navigation", 80],
      ["Mobile API integration", 60],
      ["Mobile authentication", 60],
      ["Lists & performance", 50],
    ],
    { prerequisites: ["react-hooks"] }
  ),
  mod(
    "expo",
    "Expo & EAS Build",
    "frontend",
    "mobile",
    "intermediate",
    "Expo tooling, app configuration and building Android releases with EAS.",
    [
      ["Expo SDK & workflow", 70],
      ["App configuration", 40],
      ["EAS Build", 80],
    ],
    { prerequisites: ["react-native"] }
  ),
  mod(
    "android-release",
    "Android & Google Play",
    "devops",
    "mobile",
    "intermediate",
    "Android fundamentals and publishing an app on Google Play.",
    [
      ["Android fundamentals", 90],
      ["App signing & builds", 60],
      ["Google Play Console", 75],
      ["Store listing & release tracks", 45],
    ],
    { prerequisites: ["expo"] }
  ),
]
