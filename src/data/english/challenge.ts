import type { ChallengeDay } from "../../types/english.ts"

/**
 * The 30-day speaking challenge: exactly 30 independent day-cards, each a lesson, 3 vocabulary items,
 * 3-6 sentences, one sentence to say aloud and a text exercise. Days 1-12 follow English Fundamentals,
 * days 13-25 follow the 13 Daily English categories, and days 26-30 bring in speaking, professional and
 * interview English. Vocabulary is new until day 19, then a three-word review of earlier words.
 * The gate (content-gate.test.ts) checks that every id exists. Written by hand-planned rules, not generated at runtime.
 */
export const ENGLISH_CHALLENGE: ChallengeDay[] = [
  {
    day: 1,
    theme: "The English alphabet",
    lesson: "en.fundamentals.alphabet",
    vocab: [
      "en.fundamentals.common-words.yes",
      "en.fundamentals.common-words.no",
      "en.fundamentals.common-words.please",
    ],
    sentences: [
      "en.fundamentals.alphabet.letters-a-c",
      "en.fundamentals.alphabet.letters-d-f",
      "en.fundamentals.alphabet.letters-g-i",
      "en.fundamentals.alphabet.letters-j-l",
    ],
    speaking: "en.fundamentals.alphabet.letters-a-c",
    exercise: {
      lesson: "en.fundamentals.alphabet",
      count: 4,
    },
  },
  {
    day: 2,
    theme: "Common words",
    lesson: "en.fundamentals.common-words",
    vocab: [
      "en.fundamentals.common-words.thank-you",
      "en.fundamentals.common-words.sorry",
      "en.fundamentals.common-words.hello",
    ],
    sentences: [
      "en.fundamentals.alphabet.letters-m-o",
      "en.fundamentals.alphabet.letters-p-r",
      "en.fundamentals.alphabet.letters-s-u",
      "en.fundamentals.alphabet.letters-v-x",
    ],
    speaking: "en.fundamentals.alphabet.letters-m-o",
    exercise: {
      lesson: "en.fundamentals.common-words",
      count: 4,
    },
  },
  {
    day: 3,
    theme: "Daily vocabulary",
    lesson: "en.fundamentals.daily-vocabulary",
    vocab: [
      "en.fundamentals.common-words.goodbye",
      "en.fundamentals.common-words.water",
      "en.fundamentals.common-words.food",
    ],
    sentences: [
      "en.fundamentals.alphabet.letters-y-z",
      "en.fundamentals.alphabet.the-vowels",
      "en.fundamentals.alphabet.how-do-you-spell-your-name",
      "en.fundamentals.alphabet.please-spell-it-slowly",
    ],
    speaking: "en.fundamentals.alphabet.letters-y-z",
    exercise: {
      lesson: "en.fundamentals.daily-vocabulary",
      count: 4,
    },
  },
  {
    day: 4,
    theme: "Pronouns",
    lesson: "en.fundamentals.pronouns",
    vocab: [
      "en.fundamentals.common-words.home",
      "en.fundamentals.common-words.work",
      "en.fundamentals.common-words.friend",
    ],
    sentences: [
      "en.fundamentals.pronouns.i-am-a-student",
      "en.fundamentals.pronouns.she-is-my-sister",
      "en.fundamentals.pronouns.they-are-in-the-office",
      "en.fundamentals.pronouns.please-give-it-to-him",
    ],
    speaking: "en.fundamentals.pronouns.i-am-a-student",
    exercise: {
      lesson: "en.fundamentals.pronouns",
      count: 4,
    },
  },
  {
    day: 5,
    theme: "Nouns",
    lesson: "en.fundamentals.nouns",
    vocab: [
      "en.fundamentals.common-words.family",
      "en.fundamentals.common-words.book",
      "en.fundamentals.common-words.phone",
    ],
    sentences: [
      "en.fundamentals.nouns.my-friend-lives-in-delhi",
      "en.fundamentals.nouns.the-market-is-near-my-house",
      "en.fundamentals.nouns.we-have-a-small-family",
      "en.fundamentals.nouns.she-buys-vegetables",
    ],
    speaking: "en.fundamentals.nouns.my-friend-lives-in-delhi",
    exercise: {
      lesson: "en.fundamentals.nouns",
      count: 4,
    },
  },
  {
    day: 6,
    theme: "Verbs",
    lesson: "en.fundamentals.verbs",
    vocab: [
      "en.fundamentals.common-words.time",
      "en.fundamentals.common-words.day",
      "en.fundamentals.common-words.night",
    ],
    sentences: [
      "en.fundamentals.verbs.i-go-to-the-office-by-bus",
      "en.fundamentals.verbs.she-cooks-food-in-the-evening",
      "en.fundamentals.verbs.we-watched-a-film-yesterday",
      "en.fundamentals.verbs.he-is-reading-a-book",
    ],
    speaking: "en.fundamentals.verbs.i-go-to-the-office-by-bus",
    exercise: {
      lesson: "en.fundamentals.verbs",
      count: 4,
    },
  },
  {
    day: 7,
    theme: "Adjectives",
    lesson: "en.fundamentals.adjectives",
    vocab: [
      "en.fundamentals.common-words.name",
      "en.fundamentals.common-words.help",
      "en.fundamentals.daily-vocabulary.wake-up",
    ],
    sentences: [
      "en.fundamentals.adjectives.the-weather-is-nice-today",
      "en.fundamentals.adjectives.i-am-very-tired",
      "en.fundamentals.adjectives.this-is-a-new-phone",
      "en.fundamentals.pronouns.this-is-our-house",
    ],
    speaking: "en.fundamentals.adjectives.the-weather-is-nice-today",
    exercise: {
      lesson: "en.fundamentals.adjectives",
      count: 4,
    },
  },
  {
    day: 8,
    theme: "Basic grammar",
    lesson: "en.fundamentals.basic-grammar",
    vocab: [
      "en.fundamentals.daily-vocabulary.brush",
      "en.fundamentals.daily-vocabulary.bath",
      "en.fundamentals.daily-vocabulary.breakfast",
    ],
    sentences: [
      "en.fundamentals.basic-grammar.do-you-speak-english",
      "en.fundamentals.basic-grammar.i-do-not-understand",
      "en.fundamentals.basic-grammar.what-is-your-name",
      "en.fundamentals.basic-grammar.where-do-you-live",
    ],
    speaking: "en.fundamentals.basic-grammar.do-you-speak-english",
    exercise: {
      lesson: "en.fundamentals.basic-grammar",
      count: 4,
    },
  },
  {
    day: 9,
    theme: "Making sentences",
    lesson: "en.fundamentals.sentence-formation",
    vocab: [
      "en.fundamentals.daily-vocabulary.lunch",
      "en.fundamentals.daily-vocabulary.dinner",
      "en.fundamentals.daily-vocabulary.tea",
    ],
    sentences: [
      "en.fundamentals.sentence-formation.i-want-a-cup-of-tea",
      "en.fundamentals.sentence-formation.she-is-going-to-the-market",
      "en.fundamentals.sentence-formation.we-are-learning-english",
      "en.fundamentals.sentence-formation.he-can-speak-three-languages",
    ],
    speaking: "en.fundamentals.sentence-formation.i-want-a-cup-of-tea",
    exercise: {
      lesson: "en.fundamentals.sentence-formation",
      count: 4,
    },
  },
  {
    day: 10,
    theme: "Singular and plural",
    lesson: "en.fundamentals.singular-and-plural",
    vocab: [
      "en.fundamentals.daily-vocabulary.milk",
      "en.fundamentals.daily-vocabulary.bread",
      "en.fundamentals.daily-vocabulary.rice",
    ],
    sentences: [
      "en.fundamentals.singular-and-plural.i-have-two-brothers",
      "en.fundamentals.singular-and-plural.there-are-many-books-on-the-shelf",
      "en.fundamentals.singular-and-plural.the-children-are-in-the-garden",
      "en.fundamentals.singular-and-plural.she-has-three-bags",
    ],
    speaking: "en.fundamentals.singular-and-plural.i-have-two-brothers",
    exercise: {
      lesson: "en.fundamentals.singular-and-plural",
      count: 4,
    },
  },
  {
    day: 11,
    theme: "Articles: a, an and the",
    lesson: "en.fundamentals.articles",
    vocab: [
      "en.fundamentals.daily-vocabulary.market",
      "en.fundamentals.daily-vocabulary.bus",
      "en.fundamentals.daily-vocabulary.office",
    ],
    sentences: [
      "en.fundamentals.articles.i-have-a-question",
      "en.fundamentals.articles.she-is-an-honest-person",
      "en.fundamentals.articles.the-teacher-is-in-the-class",
      "en.fundamentals.articles.he-plays-the-guitar",
    ],
    speaking: "en.fundamentals.articles.i-have-a-question",
    exercise: {
      lesson: "en.fundamentals.articles",
      count: 4,
    },
  },
  {
    day: 12,
    theme: "Prepositions",
    lesson: "en.fundamentals.prepositions",
    vocab: [
      "en.fundamentals.daily-vocabulary.school",
      "en.fundamentals.daily-vocabulary.hospital",
      "en.fundamentals.daily-vocabulary.street",
    ],
    sentences: [
      "en.fundamentals.prepositions.the-bank-is-next-to-the-school",
      "en.fundamentals.prepositions.i-am-waiting-for-the-bus",
      "en.fundamentals.prepositions.please-sit-between-ravi-and-meera",
      "en.fundamentals.prepositions.she-is-good-at-maths",
    ],
    speaking: "en.fundamentals.prepositions.the-bank-is-next-to-the-school",
    exercise: {
      lesson: "en.fundamentals.prepositions",
      count: 4,
    },
  },
  {
    day: 13,
    theme: "Morning conversations",
    lesson: "en.daily.morning-conversations",
    vocab: [
      "en.fundamentals.daily-vocabulary.today",
      "en.fundamentals.daily-vocabulary.tomorrow",
      "en.fundamentals.daily-vocabulary.yesterday",
    ],
    sentences: [
      "en.daily.morning-conversations.good-morning-did-you-sleep-well",
      "en.daily.morning-conversations.i-woke-up-late-today",
      "en.daily.morning-conversations.would-you-like-some-tea",
      "en.daily.morning-conversations.breakfast-is-ready",
    ],
    speaking: "en.daily.morning-conversations.good-morning-did-you-sleep-well",
    exercise: {
      lesson: "en.daily.morning-conversations",
      count: 4,
    },
  },
  {
    day: 14,
    theme: "At home",
    lesson: "en.daily.at-home",
    vocab: [
      "en.fundamentals.daily-vocabulary.week",
      "en.fundamentals.verbs.eat",
      "en.fundamentals.verbs.drink",
    ],
    sentences: [
      "en.daily.at-home.please-switch-off-the-fan",
      "en.daily.at-home.dinner-will-be-ready-in-ten-minutes",
      "en.daily.at-home.can-you-help-me-in-the-kitchen",
      "en.daily.at-home.please-close-the-window",
    ],
    speaking: "en.daily.at-home.please-switch-off-the-fan",
    exercise: {
      lesson: "en.daily.at-home",
      count: 4,
    },
  },
  {
    day: 15,
    theme: "At the office",
    lesson: "en.daily.at-the-office",
    vocab: [
      "en.fundamentals.verbs.go",
      "en.fundamentals.verbs.come",
      "en.fundamentals.verbs.read",
    ],
    sentences: [
      "en.daily.at-the-office.good-morning-everyone",
      "en.daily.at-the-office.is-the-meeting-at-eleven",
      "en.daily.at-the-office.i-will-send-you-the-file-by",
      "en.daily.at-the-office.could-you-please-check-this-report",
    ],
    speaking: "en.daily.at-the-office.good-morning-everyone",
    exercise: {
      lesson: "en.daily.at-the-office",
      count: 4,
    },
  },
  {
    day: 16,
    theme: "Talking to friends",
    lesson: "en.daily.talking-to-friends",
    vocab: [
      "en.fundamentals.verbs.write",
      "en.fundamentals.verbs.speak",
      "en.fundamentals.verbs.listen",
    ],
    sentences: [
      "en.daily.talking-to-friends.long-time-no-see-how-have-you",
      "en.daily.talking-to-friends.what-are-you-doing-this-weekend",
      "en.daily.talking-to-friends.let-us-meet-on-saturday",
      "en.daily.talking-to-friends.i-am-really-happy-to-see-you",
    ],
    speaking: "en.daily.talking-to-friends.long-time-no-see-how-have-you",
    exercise: {
      lesson: "en.daily.talking-to-friends",
      count: 4,
    },
  },
  {
    day: 17,
    theme: "Asking questions",
    lesson: "en.daily.asking-questions",
    vocab: [
      "en.fundamentals.adjectives.big",
      "en.fundamentals.adjectives.small",
      "en.fundamentals.adjectives.good",
    ],
    sentences: [
      "en.daily.asking-questions.excuse-me-where-is-the-bus-stop",
      "en.daily.asking-questions.how-much-does-this-cost",
      "en.daily.asking-questions.what-time-does-the-train-leave",
      "en.daily.asking-questions.can-you-tell-me-the-way-to",
    ],
    speaking: "en.daily.asking-questions.excuse-me-where-is-the-bus-stop",
    exercise: {
      lesson: "en.daily.asking-questions",
      count: 4,
    },
  },
  {
    day: 18,
    theme: "Making requests",
    lesson: "en.daily.making-requests",
    vocab: [
      "en.fundamentals.adjectives.bad",
      "en.fundamentals.adjectives.new",
      "en.fundamentals.adjectives.old",
    ],
    sentences: [
      "en.daily.making-requests.could-you-please-open-the-window",
      "en.daily.making-requests.can-you-pass-me-the-salt",
      "en.daily.making-requests.may-i-use-your-phone",
      "en.daily.making-requests.would-you-mind-waiting-a-minute",
    ],
    speaking: "en.daily.making-requests.could-you-please-open-the-window",
    exercise: {
      lesson: "en.daily.making-requests",
      count: 4,
    },
  },
  {
    day: 19,
    theme: "Giving answers",
    lesson: "en.daily.giving-answers",
    vocab: [
      "en.fundamentals.adjectives.hot",
      "en.fundamentals.adjectives.cold",
      "en.fundamentals.adjectives.happy",
    ],
    sentences: [
      "en.daily.giving-answers.yes-of-course",
      "en.daily.giving-answers.no-i-do-not-think-so",
      "en.daily.giving-answers.i-am-not-sure-but-i-will",
      "en.daily.giving-answers.that-is-correct",
    ],
    speaking: "en.daily.giving-answers.yes-of-course",
    exercise: {
      lesson: "en.daily.giving-answers",
      count: 4,
    },
  },
  {
    day: 20,
    theme: "Expressing opinions",
    lesson: "en.daily.expressing-opinions",
    vocab: [
      "en.fundamentals.common-words.yes",
      "en.fundamentals.common-words.no",
      "en.fundamentals.common-words.please",
    ],
    sentences: [
      "en.daily.expressing-opinions.i-think-this-is-a-good-plan",
      "en.daily.expressing-opinions.in-my-opinion-we-should-start-early",
      "en.daily.expressing-opinions.i-agree-with-you",
      "en.daily.expressing-opinions.i-see-it-differently",
    ],
    speaking: "en.daily.expressing-opinions.i-think-this-is-a-good-plan",
    exercise: {
      lesson: "en.daily.expressing-opinions",
      count: 4,
    },
  },
  {
    day: 21,
    theme: "Apologizing",
    lesson: "en.daily.apologizing",
    vocab: [
      "en.fundamentals.common-words.thank-you",
      "en.fundamentals.common-words.sorry",
      "en.fundamentals.common-words.hello",
    ],
    sentences: [
      "en.daily.apologizing.i-am-sorry-for-being-late",
      "en.daily.apologizing.sorry-i-made-a-mistake",
      "en.daily.apologizing.please-forgive-me",
      "en.daily.apologizing.i-did-not-mean-to-hurt-you",
    ],
    speaking: "en.daily.apologizing.i-am-sorry-for-being-late",
    exercise: {
      lesson: "en.daily.apologizing",
      count: 4,
    },
  },
  {
    day: 22,
    theme: "Thanking someone",
    lesson: "en.daily.thanking",
    vocab: [
      "en.fundamentals.common-words.goodbye",
      "en.fundamentals.common-words.water",
      "en.fundamentals.common-words.food",
    ],
    sentences: [
      "en.daily.thanking.thank-you-very-much",
      "en.daily.thanking.thanks-a-lot-for-your-help",
      "en.daily.thanking.i-really-appreciate-it",
      "en.daily.thanking.that-is-very-kind-of-you",
    ],
    speaking: "en.daily.thanking.thank-you-very-much",
    exercise: {
      lesson: "en.daily.thanking",
      count: 4,
    },
  },
  {
    day: 23,
    theme: "Asking for help",
    lesson: "en.daily.asking-for-help",
    vocab: [
      "en.fundamentals.common-words.home",
      "en.fundamentals.common-words.work",
      "en.fundamentals.common-words.friend",
    ],
    sentences: [
      "en.daily.asking-for-help.could-you-help-me-please",
      "en.daily.asking-for-help.i-need-some-help-with-this-form",
      "en.daily.asking-for-help.can-you-show-me-how-to-do",
      "en.daily.asking-for-help.i-am-lost-can-you-help-me",
    ],
    speaking: "en.daily.asking-for-help.could-you-help-me-please",
    exercise: {
      lesson: "en.daily.asking-for-help",
      count: 4,
    },
  },
  {
    day: 24,
    theme: "Telephone conversations",
    lesson: "en.daily.telephone",
    vocab: [
      "en.fundamentals.common-words.family",
      "en.fundamentals.common-words.book",
      "en.fundamentals.common-words.phone",
    ],
    sentences: [
      "en.daily.telephone.hello-this-is-ravi-speaking",
      "en.daily.telephone.may-i-speak-to-mr-sharma-please",
      "en.daily.telephone.who-is-calling-please",
      "en.daily.telephone.please-hold-the-line",
    ],
    speaking: "en.daily.telephone.hello-this-is-ravi-speaking",
    exercise: {
      lesson: "en.daily.telephone",
      count: 4,
    },
  },
  {
    day: 25,
    theme: "Professional conversations",
    lesson: "en.daily.professional",
    vocab: [
      "en.fundamentals.common-words.time",
      "en.fundamentals.common-words.day",
      "en.fundamentals.common-words.night",
    ],
    sentences: [
      "en.daily.professional.good-afternoon-how-may-i-help-you",
      "en.daily.professional.please-have-a-seat",
      "en.daily.professional.i-will-check-and-get-back-to",
      "en.daily.professional.could-we-schedule-a-meeting-for-tomorrow",
    ],
    speaking: "en.daily.professional.good-afternoon-how-may-i-help-you",
    exercise: {
      lesson: "en.daily.professional",
      count: 4,
    },
  },
  {
    day: 26,
    theme: "Daily speaking exercises",
    lesson: "en.speaking.daily-speaking-exercises",
    vocab: [
      "en.fundamentals.common-words.name",
      "en.fundamentals.common-words.help",
      "en.fundamentals.daily-vocabulary.wake-up",
    ],
    sentences: [
      "en.speaking.daily-speaking-exercises.today-i-will-speak-english-for-ten",
      "en.speaking.daily-speaking-exercises.i-am-learning-english-step-by-step",
      "en.speaking.daily-speaking-exercises.every-day-i-learn-five-new-words",
      "en.speaking.daily-speaking-exercises.i-read-one-short-paragraph-aloud",
    ],
    speaking:
      "en.speaking.daily-speaking-exercises.today-i-will-speak-english-for-ten",
    exercise: {
      lesson: "en.speaking.daily-speaking-exercises",
      count: 4,
    },
  },
  {
    day: 27,
    theme: "Conversation practice",
    lesson: "en.speaking.conversation-practice",
    vocab: [
      "en.fundamentals.daily-vocabulary.brush",
      "en.fundamentals.daily-vocabulary.bath",
      "en.fundamentals.daily-vocabulary.breakfast",
    ],
    sentences: [
      "en.speaking.conversation-practice.nice-to-meet-you-i-am-happy",
      "en.speaking.conversation-practice.could-you-tell-me-a-little-about",
      "en.speaking.conversation-practice.that-is-interesting-please-tell-me-more",
      "en.speaking.conversation-practice.it-was-nice-talking-to-you",
    ],
    speaking: "en.speaking.conversation-practice.nice-to-meet-you-i-am-happy",
    exercise: {
      lesson: "en.speaking.conversation-practice",
      count: 4,
    },
  },
  {
    day: 28,
    theme: "Introducing yourself",
    lesson: "en.professional.introducing-yourself",
    vocab: [
      "en.fundamentals.daily-vocabulary.lunch",
      "en.fundamentals.daily-vocabulary.dinner",
      "en.fundamentals.daily-vocabulary.tea",
    ],
    sentences: [
      "en.professional.introducing-yourself.let-me-introduce-myself",
      "en.professional.introducing-yourself.i-am-a-software-developer",
      "en.professional.introducing-yourself.i-work-on-web-applications",
      "en.professional.introducing-yourself.i-have-been-in-this-field-for",
    ],
    speaking: "en.professional.introducing-yourself.let-me-introduce-myself",
    exercise: {
      lesson: "en.professional.introducing-yourself",
      count: 4,
    },
  },
  {
    day: 29,
    theme: "Talking about yourself",
    lesson: "en.interview.about-you",
    vocab: [
      "en.fundamentals.daily-vocabulary.milk",
      "en.fundamentals.daily-vocabulary.bread",
      "en.fundamentals.daily-vocabulary.rice",
    ],
    sentences: [
      "en.interview.about-you.thank-you-for-having-me-today",
      "en.interview.about-you.it-is-a-pleasure-to-meet-you",
      "en.interview.about-you.let-me-tell-you-a-little-about",
      "en.fundamentals.basic-grammar.this-is-my-friend",
    ],
    speaking: "en.interview.about-you.thank-you-for-having-me-today",
    exercise: {
      lesson: "en.interview.about-you",
      count: 3,
    },
  },
  {
    day: 30,
    theme: "Building confidence",
    lesson: "en.speaking.confidence-building",
    vocab: [
      "en.fundamentals.daily-vocabulary.market",
      "en.fundamentals.daily-vocabulary.bus",
      "en.fundamentals.daily-vocabulary.office",
    ],
    sentences: [
      "en.speaking.confidence-building.i-can-speak-english-a-little-more",
      "en.speaking.confidence-building.it-is-fine-to-make-mistakes-while",
      "en.speaking.confidence-building.i-will-speak-slowly-and-clearly",
      "en.speaking.confidence-building.please-give-me-a-moment-to-think",
    ],
    speaking:
      "en.speaking.confidence-building.i-can-speak-english-a-little-more",
    exercise: {
      lesson: "en.speaking.confidence-building",
      count: 4,
    },
  },
]
