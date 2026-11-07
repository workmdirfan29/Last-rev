/**
 * How typed English is compared with the stored sentence. Deterministic and objective: lower case, straight
 * quotes, punctuation removed, spaces collapsed, and the common contractions expanded on BOTH sides, so
 * "I'm fine" and "I am fine" are the same answer. Nothing fuzzy: a misspelt word is a different word.
 * Ambiguous forms such as "he's" ("he is" or "he has") are left as written.
 */
const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am",
  "you're": "you are",
  "we're": "we are",
  "they're": "they are",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "can't": "cannot",
  "won't": "will not",
  "i'll": "i will",
  "you'll": "you will",
  "we'll": "we will",
  "they'll": "they will",
  "he'll": "he will",
  "she'll": "she will",
  "i've": "i have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "let's": "let us",
  "couldn't": "could not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "mustn't": "must not",
}
const CONTRACTION_RE = new RegExp(
  `(?<![a-z'])(${Object.keys(CONTRACTIONS)
    .map((k) => k.replace(/'/g, "'"))
    .join("|")})(?![a-z'])`,
  "g"
)

export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(CONTRACTION_RE, (m) => CONTRACTIONS[m])
    .replace(/\bcan not\b/g, "cannot")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Words of the normalised text. */
export const words = (text: string): string[] => {
  const n = normalise(text)
  return n === "" ? [] : n.split(" ")
}

/** Words as the learner would count them: contractions stay one word. */
export const countWords = (text: string): number =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length

/** Does the answer match the target or one of the accepted variants? */
export function isCorrect(
  answer: string,
  target: string,
  accepted: readonly string[] = []
): boolean {
  const a = normalise(answer)
  if (a === "") return false
  return [target, ...accepted].some((t) => normalise(t) === a)
}
