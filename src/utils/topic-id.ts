/** A topic's id comes from its title, so the plan, progress records and lessons all name a topic the same way. */
export const topicSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const topicIdOf = (moduleId: string, topic: string): string =>
  `topic.${moduleId}.${topicSlug(topic)}`
