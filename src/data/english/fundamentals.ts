import { defineLessons } from "@/data/english/author"
import { grammar, sent, vocab, type Line } from "@/data/english/kit"

// Module 1: English Fundamentals. Draft content: not yet reviewed by an English teacher.
const letterLine = (en: string, hi: string): Line[] => [
  ["Teacher", "Say the letters aloud.", "अक्षर ज़ोर से बोलिए।"],
  ["Student", en, hi],
]

export default defineLessons("fundamentals", [
  {
    slug: "alphabet",
    title: "The English alphabet",
    titleHi: "अंग्रेज़ी वर्णमाला",
    goal: "Say the 26 letters, each with a word, and spell your name.",
    items: [
      sent(
        "letters-a-c",
        "A is for apple, B is for ball, and C is for cat.",
        "'A' से 'apple', 'B' से 'ball', और 'C' से 'cat'।",
        "Use it to practise the first three letters with a word for each.",
        letterLine(
          "A is for apple, B is for ball, and C is for cat.",
          "'A' से 'apple', 'B' से 'ball', और 'C' से 'cat'।"
        )
      ),
      sent(
        "letters-d-f",
        "D is for dog, E is for egg, and F is for fish.",
        "'D' से 'dog', 'E' से 'egg', और 'F' से 'fish'।",
        "Use it to practise the letters D, E and F with a word for each.",
        letterLine(
          "D is for dog, E is for egg, and F is for fish.",
          "'D' से 'dog', 'E' से 'egg', और 'F' से 'fish'।"
        )
      ),
      sent(
        "letters-g-i",
        "G is for goat, H is for hat, and I is for ink.",
        "'G' से 'goat', 'H' से 'hat', और 'I' से 'ink'।",
        "Use it to practise the letters G, H and I with a word for each.",
        letterLine(
          "G is for goat, H is for hat, and I is for ink.",
          "'G' से 'goat', 'H' से 'hat', और 'I' से 'ink'।"
        )
      ),
      sent(
        "letters-j-l",
        "J is for jug, K is for kite, and L is for lamp.",
        "'J' से 'jug', 'K' से 'kite', और 'L' से 'lamp'।",
        "Use it to practise the letters J, K and L with a word for each.",
        letterLine(
          "J is for jug, K is for kite, and L is for lamp.",
          "'J' से 'jug', 'K' से 'kite', और 'L' से 'lamp'।"
        )
      ),
      sent(
        "letters-m-o",
        "M is for mango, N is for nest, and O is for orange.",
        "'M' से 'mango', 'N' से 'nest', और 'O' से 'orange'।",
        "Use it to practise the letters M, N and O with a word for each.",
        letterLine(
          "M is for mango, N is for nest, and O is for orange.",
          "'M' से 'mango', 'N' से 'nest', और 'O' से 'orange'।"
        )
      ),
      sent(
        "letters-p-r",
        "P is for pen, Q is for queen, and R is for rat.",
        "'P' से 'pen', 'Q' से 'queen', और 'R' से 'rat'।",
        "Use it to practise the letters P, Q and R with a word for each.",
        letterLine(
          "P is for pen, Q is for queen, and R is for rat.",
          "'P' से 'pen', 'Q' से 'queen', और 'R' से 'rat'।"
        )
      ),
      sent(
        "letters-s-u",
        "S is for sun, T is for tree, and U is for umbrella.",
        "'S' से 'sun', 'T' से 'tree', और 'U' से 'umbrella'।",
        "Use it to practise the letters S, T and U with a word for each.",
        letterLine(
          "S is for sun, T is for tree, and U is for umbrella.",
          "'S' से 'sun', 'T' से 'tree', और 'U' से 'umbrella'।"
        )
      ),
      sent(
        "letters-v-x",
        "V is for van, W is for water, and X is for X-ray.",
        "'V' से 'van', 'W' से 'water', और 'X' से 'X-ray'।",
        "Use it to practise the letters V, W and X with a word for each.",
        letterLine(
          "V is for van, W is for water, and X is for X-ray.",
          "'V' से 'van', 'W' से 'water', और 'X' से 'X-ray'।"
        )
      ),
      sent(
        "letters-y-z",
        "Y is for yellow and Z is for zebra.",
        "'Y' से 'yellow' और 'Z' से 'zebra'।",
        "Use it to practise the last two letters with a word for each.",
        letterLine(
          "Y is for yellow and Z is for zebra.",
          "'Y' से 'yellow' और 'Z' से 'zebra'।"
        )
      ),
      sent(
        "the-vowels",
        "The vowels are A, E, I, O and U.",
        "स्वर 'A', 'E', 'I', 'O' और 'U' हैं।",
        "Use it to name the five vowel letters.",
        [
          ["Teacher", "Which letters are vowels?", "कौन से अक्षर स्वर हैं?"],
          [
            "Student",
            "The vowels are A, E, I, O and U.",
            "स्वर 'A', 'E', 'I', 'O' और 'U' हैं।",
          ],
        ]
      ),
      sent(
        "how-do-you-spell-your-name",
        "How do you spell your name?",
        "आप अपना नाम कैसे लिखते हैं?",
        "Use it to ask someone to say their name letter by letter.",
        [
          [
            "Asha",
            "How do you spell your name?",
            "आप अपना नाम कैसे लिखते हैं?",
          ],
          ["Ravi", "R, A, V, I.", "आर, ए, वी, आई।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-spell-it-slowly",
        "Please spell it slowly.",
        "कृपया इसे धीरे-धीरे बोलकर लिखवाइए।",
        "Use it when you need someone to say the letters of a word more slowly.",
        [
          [
            "Kiran",
            "My email name is long. Let me spell it.",
            "मेरा ईमेल नाम लंबा है। मैं इसे बोलकर बताता हूँ।",
          ],
          [
            "Asha",
            "Please spell it slowly.",
            "कृपया इसे धीरे-धीरे बोलकर लिखवाइए।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "common-words",
    title: "Common words",
    titleHi: "आम शब्द",
    goal: "Know twenty everyday words and use each in a short sentence.",
    items: [
      vocab(
        "yes",
        "yes",
        "interjection",
        "हाँ",
        "Yes, I understand.",
        "हाँ, मैं समझता हूँ।"
      ),
      vocab(
        "no",
        "no",
        "interjection",
        "नहीं",
        "No, thank you.",
        "नहीं, धन्यवाद।"
      ),
      vocab(
        "please",
        "please",
        "interjection",
        "कृपया",
        "Please sit here.",
        "कृपया यहाँ बैठिए।"
      ),
      vocab(
        "thank-you",
        "thank you",
        "phrase",
        "धन्यवाद",
        "Thank you for your help.",
        "आपकी मदद के लिए धन्यवाद।"
      ),
      vocab(
        "sorry",
        "sorry",
        "adjective",
        "क्षमा कीजिए, माफ़ कीजिए",
        "I am sorry for the delay.",
        "देरी के लिए मैं क्षमा चाहता हूँ।"
      ),
      vocab(
        "hello",
        "hello",
        "interjection",
        "नमस्ते, हैलो",
        "Hello, how are you?",
        "नमस्ते, आप कैसे हैं?"
      ),
      vocab(
        "goodbye",
        "goodbye",
        "interjection",
        "अलविदा",
        "Goodbye, see you tomorrow.",
        "अलविदा, कल मिलते हैं।"
      ),
      vocab(
        "water",
        "water",
        "noun",
        "पानी",
        "I drink water every day.",
        "मैं रोज़ पानी पीता हूँ।"
      ),
      vocab("food", "food", "noun", "खाना", "The food is hot.", "खाना गरम है।"),
      vocab("home", "home", "noun", "घर", "I am at home.", "मैं घर पर हूँ।"),
      vocab(
        "work",
        "work",
        "noun",
        "काम",
        "I go to work by bus.",
        "मैं बस से काम पर जाता हूँ।"
      ),
      vocab(
        "friend",
        "friend",
        "noun",
        "दोस्त, मित्र",
        "He is my friend.",
        "वह मेरा दोस्त है।"
      ),
      vocab(
        "family",
        "family",
        "noun",
        "परिवार",
        "My family is small.",
        "मेरा परिवार छोटा है।"
      ),
      vocab(
        "book",
        "book",
        "noun",
        "किताब",
        "This book is new.",
        "यह किताब नई है।"
      ),
      vocab(
        "phone",
        "phone",
        "noun",
        "फ़ोन",
        "My phone is on the table.",
        "मेरा फ़ोन मेज़ पर है।"
      ),
      vocab(
        "time",
        "time",
        "noun",
        "समय",
        "I have no time today.",
        "आज मेरे पास समय नहीं है।"
      ),
      vocab(
        "day",
        "day",
        "noun",
        "दिन",
        "Today is a good day.",
        "आज का दिन अच्छा है।"
      ),
      vocab(
        "night",
        "night",
        "noun",
        "रात",
        "It is cold at night.",
        "रात को ठंड होती है।"
      ),
      vocab(
        "name",
        "name",
        "noun",
        "नाम",
        "My name is Ravi.",
        "मेरा नाम रवि है।"
      ),
      vocab(
        "help",
        "help",
        "verb",
        "मदद करना",
        "Can you help me?",
        "क्या आप मेरी मदद कर सकते हैं?"
      ),
    ],
  },
  {
    slug: "daily-vocabulary",
    title: "Daily vocabulary",
    titleHi: "रोज़ के शब्द",
    goal: "Talk about your day with twenty useful words.",
    items: [
      vocab(
        "wake-up",
        "wake up",
        "phrase",
        "जागना, उठना",
        "I wake up at six.",
        "मैं छह बजे उठता हूँ।"
      ),
      vocab(
        "brush",
        "brush",
        "verb",
        "ब्रश करना",
        "I brush my teeth every morning.",
        "मैं रोज़ सुबह ब्रश करता हूँ।"
      ),
      vocab(
        "bath",
        "bath",
        "noun",
        "नहाना, स्नान",
        "I take a bath before breakfast.",
        "मैं नाश्ते से पहले नहाता हूँ।"
      ),
      vocab(
        "breakfast",
        "breakfast",
        "noun",
        "सुबह का नाश्ता",
        "We have breakfast at eight.",
        "हम आठ बजे नाश्ता करते हैं।"
      ),
      vocab(
        "lunch",
        "lunch",
        "noun",
        "दोपहर का खाना",
        "I eat lunch at the office.",
        "मैं दफ़्तर में दोपहर का खाना खाता हूँ।"
      ),
      vocab(
        "dinner",
        "dinner",
        "noun",
        "रात का खाना",
        "Dinner is ready.",
        "रात का खाना तैयार है।"
      ),
      vocab(
        "tea",
        "tea",
        "noun",
        "चाय",
        "I drink tea in the morning.",
        "मैं सुबह चाय पीता हूँ।"
      ),
      vocab("milk", "milk", "noun", "दूध", "The milk is cold.", "दूध ठंडा है।"),
      vocab(
        "bread",
        "bread",
        "noun",
        "ब्रेड, डबलरोटी",
        "She buys bread from the shop.",
        "वह दुकान से ब्रेड खरीदती है।"
      ),
      vocab(
        "rice",
        "rice",
        "noun",
        "चावल",
        "We eat rice for lunch.",
        "हम दोपहर के खाने में चावल खाते हैं।"
      ),
      vocab(
        "market",
        "market",
        "noun",
        "बाज़ार",
        "The market is near my house.",
        "बाज़ार मेरे घर के पास है।"
      ),
      vocab(
        "bus",
        "bus",
        "noun",
        "बस",
        "The bus comes at nine.",
        "बस नौ बजे आती है।"
      ),
      vocab(
        "office",
        "office",
        "noun",
        "दफ़्तर",
        "My office is in the city.",
        "मेरा दफ़्तर शहर में है।"
      ),
      vocab(
        "school",
        "school",
        "noun",
        "स्कूल, विद्यालय",
        "The children go to school.",
        "बच्चे स्कूल जाते हैं।"
      ),
      vocab(
        "hospital",
        "hospital",
        "noun",
        "अस्पताल",
        "The hospital is on this road.",
        "अस्पताल इसी सड़क पर है।"
      ),
      vocab(
        "street",
        "street",
        "noun",
        "सड़क, गली",
        "Our street is quiet.",
        "हमारी गली शांत है।"
      ),
      vocab(
        "today",
        "today",
        "adverb",
        "आज",
        "I am free today.",
        "मैं आज खाली हूँ।"
      ),
      vocab(
        "tomorrow",
        "tomorrow",
        "adverb",
        "आने वाला कल",
        "We will meet tomorrow.",
        "हम कल मिलेंगे।"
      ),
      vocab(
        "yesterday",
        "yesterday",
        "adverb",
        "बीता हुआ कल",
        "I called you yesterday.",
        "मैंने आपको कल फ़ोन किया था।"
      ),
      vocab(
        "week",
        "week",
        "noun",
        "सप्ताह, हफ़्ता",
        "I work five days a week.",
        "मैं हफ़्ते में पाँच दिन काम करता हूँ।"
      ),
    ],
  },
  {
    slug: "pronouns",
    title: "Pronouns",
    titleHi: "सर्वनाम",
    goal: "Use I, you, he, she, it, we and they correctly, with me, him, her and my, his, her.",
    items: [
      grammar(
        "subject-pronouns",
        "Subject pronouns",
        {
          en: "A pronoun takes the place of a noun. The subject pronouns are I, you, he, she, it, we and they.",
          hi: "सर्वनाम संज्ञा की जगह आता है। कर्ता सर्वनाम 'I', 'you', 'he', 'she', 'it', 'we' और 'they' हैं।",
        },
        [
          ["She is my teacher.", "वह मेरी शिक्षिका है।"],
          ["They live in Delhi.", "वे दिल्ली में रहते हैं।"],
          ["We study English.", "हम अंग्रेज़ी पढ़ते हैं।"],
        ],
        {
          wrong: "Me am a student.",
          right: "I am a student.",
          why: {
            en: "Use 'I' as the subject of a sentence, not 'me'.",
            hi: "वाक्य के कर्ता के रूप में 'I' लगाइए, 'me' नहीं।",
          },
        },
        {
          type: "choose",
          prompt: "___ is my brother. (a boy)",
          options: ["He", "She", "They"],
          answer: "He",
        }
      ),
      grammar(
        "object-pronouns",
        "Object pronouns",
        {
          en: "Use me, you, him, her, it, us and them after a verb or a word like 'to' and 'for'.",
          hi: "क्रिया के बाद या 'to' और 'for' जैसे शब्दों के बाद 'me', 'you', 'him', 'her', 'it', 'us' और 'them' लगाइए।",
        },
        [
          ["Please call me.", "कृपया मुझे फ़ोन कीजिए।"],
          ["I know him.", "मैं उसे जानता हूँ।"],
          ["She helps us.", "वह हमारी मदद करती है।"],
        ],
        {
          wrong: "Give the book to I.",
          right: "Give the book to me.",
          why: {
            en: "After 'to', use 'me', not 'I'.",
            hi: "'to' के बाद 'me' लगाइए, 'I' नहीं।",
          },
        },
        { type: "blank", text: "Please help ___ with this work.", answer: "me" }
      ),
      grammar(
        "possessive-words",
        "My, your, his, her, our, their",
        {
          en: "Use my, your, his, her, its, our and their before a noun to show who it belongs to.",
          hi: "संज्ञा से पहले 'my', 'your', 'his', 'her', 'its', 'our' और 'their' लगाकर बताइए कि वह किसकी है।",
        },
        [
          ["This is my bag.", "यह मेरा बैग है।"],
          ["Her name is Asha.", "उसका नाम आशा है।"],
          ["Our office is near.", "हमारा दफ़्तर पास में है।"],
        ],
        {
          wrong: "This is I bag.",
          right: "This is my bag.",
          why: {
            en: "Use 'my' before a noun, not 'I'.",
            hi: "संज्ञा से पहले 'my' लगाइए, 'I' नहीं।",
          },
        },
        {
          type: "choose",
          prompt: "Ravi has a car. ___ car is red.",
          options: ["His", "He", "Him"],
          answer: "His",
        }
      ),
      sent(
        "i-am-a-student",
        "I am a student.",
        "मैं एक विद्यार्थी हूँ।",
        "Use it to say what you do when you meet someone.",
        [
          ["Meera", "What do you do?", "आप क्या करते हैं?"],
          ["Ravi", "I am a student.", "मैं एक विद्यार्थी हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "she-is-my-sister",
        "She is my sister.",
        "वह मेरी बहन है।",
        "Use it to introduce a girl or woman in your family.",
        [
          ["Kiran", "Who is she?", "वह कौन है?"],
          ["Asha", "She is my sister.", "वह मेरी बहन है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "they-are-in-the-office",
        "They are in the office.",
        "वे दफ़्तर में हैं।",
        "Use it to say where other people are.",
        [
          ["Ravi", "Where are Asha and Kiran?", "आशा और किरण कहाँ हैं?"],
          ["Meera", "They are in the office.", "वे दफ़्तर में हैं।"],
        ]
      ),
      sent(
        "please-give-it-to-him",
        "Please give it to him.",
        "कृपया यह उन्हें दे दीजिए।",
        "Use it to ask someone to hand something to a man or a boy.",
        [
          ["Meera", "Where do I put this file?", "मैं यह फ़ाइल कहाँ रखूँ?"],
          ["Ravi", "Please give it to him.", "कृपया यह उन्हें दे दीजिए।"],
        ]
      ),
      sent(
        "this-is-our-house",
        "This is our house.",
        "यह हमारा घर है।",
        "Use it to show your home to a guest.",
        [
          [
            "Kiran",
            "Welcome. This is our house.",
            "स्वागत है। यह हमारा घर है।",
          ],
          ["Asha", "It is lovely.", "यह बहुत सुंदर है।"],
        ]
      ),
    ],
  },
  {
    slug: "nouns",
    title: "Nouns",
    titleHi: "संज्ञा",
    goal: "Name people, places and things, and know when to use 'much' and 'many'.",
    items: [
      grammar(
        "common-and-proper-nouns",
        "Common and proper nouns",
        {
          en: "A noun is the name of a person, place, thing or idea. A proper noun is a special name and begins with a capital letter.",
          hi: "संज्ञा किसी व्यक्ति, स्थान, वस्तु या विचार का नाम है। व्यक्तिवाचक संज्ञा विशेष नाम होती है और बड़े अक्षर से शुरू होती है।",
        },
        [
          ["Ravi lives in Pune.", "रवि पुणे में रहता है।"],
          ["The city is big.", "शहर बड़ा है।"],
        ],
        {
          wrong: "A Ravi lives in Pune.",
          right: "Ravi lives in Pune.",
          why: {
            en: "Do not put 'a' before a proper noun such as a person's name.",
            hi: "किसी व्यक्ति के नाम जैसी विशेष संज्ञा से पहले 'a' मत लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "Choose the proper noun.",
          options: ["city", "Mumbai", "river"],
          answer: "Mumbai",
        }
      ),
      grammar(
        "countable-and-uncountable",
        "Countable and uncountable nouns",
        {
          en: "You can count some nouns: one pen, two pens. You cannot count others: water, rice, advice. Use 'many' with countable nouns and 'much' with uncountable nouns.",
          hi: "कुछ संज्ञाओं को गिना जा सकता है: 'one pen', 'two pens'। कुछ को नहीं: 'water', 'rice', 'advice'। गिनी जाने वाली संज्ञाओं के साथ 'many' और न गिनी जाने वालों के साथ 'much' लगाइए।",
        },
        [
          ["I have many books.", "मेरे पास बहुत सारी किताबें हैं।"],
          ["We do not have much time.", "हमारे पास ज़्यादा समय नहीं है।"],
        ],
        {
          wrong: "I need an advice.",
          right: "I need some advice.",
          why: {
            en: "'Advice' is uncountable, so it does not take 'a' or 'an'.",
            hi: "'Advice' गिनी नहीं जाती, इसलिए इसके साथ 'a' या 'an' नहीं आता।",
          },
        },
        {
          type: "choose",
          prompt: "We do not have ___ water.",
          options: ["many", "much", "a"],
          answer: "much",
        }
      ),
      sent(
        "my-friend-lives-in-delhi",
        "My friend lives in Delhi.",
        "मेरा दोस्त दिल्ली में रहता है।",
        "Use it to say where a friend lives.",
        [
          ["Meera", "Where does your friend live?", "आपका दोस्त कहाँ रहता है?"],
          [
            "Ravi",
            "My friend lives in Delhi.",
            "मेरा दोस्त दिल्ली में रहता है।",
          ],
        ]
      ),
      sent(
        "the-market-is-near-my-house",
        "The market is near my house.",
        "बाज़ार मेरे घर के पास है।",
        "Use it to tell someone where a place is.",
        [
          ["Kiran", "Is there a shop here?", "क्या यहाँ कोई दुकान है?"],
          ["Asha", "The market is near my house.", "बाज़ार मेरे घर के पास है।"],
        ]
      ),
      sent(
        "we-have-a-small-family",
        "We have a small family.",
        "हमारा परिवार छोटा है।",
        "Use it to talk about your family.",
        [
          [
            "Meera",
            "Tell me about your family.",
            "अपने परिवार के बारे में बताइए।",
          ],
          ["Ravi", "We have a small family.", "हमारा परिवार छोटा है।"],
        ]
      ),
      sent(
        "she-buys-vegetables",
        "She buys vegetables from the market.",
        "वह बाज़ार से सब्ज़ियाँ खरीदती है।",
        "Use it to say where someone buys food.",
        [
          [
            "Kiran",
            "Where does your mother buy vegetables?",
            "आपकी माँ सब्ज़ियाँ कहाँ से खरीदती हैं?",
          ],
          [
            "Asha",
            "She buys vegetables from the market.",
            "वह बाज़ार से सब्ज़ियाँ खरीदती है।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "verbs",
    title: "Verbs",
    titleHi: "क्रिया",
    goal: "Use common verbs in the present and the past, with the right ending.",
    items: [
      vocab(
        "eat",
        "eat",
        "verb",
        "खाना",
        "I eat rice at lunch.",
        "मैं दोपहर में चावल खाता हूँ।"
      ),
      vocab(
        "drink",
        "drink",
        "verb",
        "पीना",
        "She drinks tea in the morning.",
        "वह सुबह चाय पीती है।"
      ),
      vocab(
        "go",
        "go",
        "verb",
        "जाना",
        "We go to school by bus.",
        "हम बस से स्कूल जाते हैं।"
      ),
      vocab(
        "come",
        "come",
        "verb",
        "आना",
        "Please come here.",
        "कृपया यहाँ आइए।"
      ),
      vocab(
        "read",
        "read",
        "verb",
        "पढ़ना",
        "I read a book every night.",
        "मैं हर रात एक किताब पढ़ता हूँ।"
      ),
      vocab(
        "write",
        "write",
        "verb",
        "लिखना",
        "Please write your name.",
        "कृपया अपना नाम लिखिए।"
      ),
      vocab(
        "speak",
        "speak",
        "verb",
        "बोलना",
        "He can speak English.",
        "वह अंग्रेज़ी बोल सकता है।"
      ),
      vocab(
        "listen",
        "listen",
        "verb",
        "सुनना",
        "Listen to the teacher.",
        "शिक्षक की बात सुनिए।"
      ),
      grammar(
        "verb-after-i",
        "The verb after I, you, we and they",
        {
          en: "A verb tells what someone does. With I, you, we and they, use the simple form: I go, you eat, they play.",
          hi: "क्रिया बताती है कि कोई क्या करता है। 'I', 'you', 'we' और 'they' के साथ क्रिया का साधारण रूप लगाइए: 'I go', 'you eat', 'they play'।",
        },
        [
          ["They play cricket.", "वे क्रिकेट खेलते हैं।"],
          ["I read a book.", "मैं एक किताब पढ़ता हूँ।"],
        ],
        {
          wrong: "I am go to school.",
          right: "I go to school.",
          why: {
            en: "Do not put 'am' before the main verb in the simple present.",
            hi: "साधारण वर्तमान में मुख्य क्रिया से पहले 'am' मत लगाइए।",
          },
        },
        { type: "blank", text: "We ___ English every day.", answer: "study" },
        {
          en: "Many Hindi speakers say 'I am go'. Say 'I go' or 'I am going'.",
          hi: "कई लोग 'I am go' बोल देते हैं। 'I go' या 'I am going' कहिए।",
        }
      ),
      grammar(
        "present-simple-s",
        "He, she and it take -s",
        {
          en: "In the simple present, add -s or -es to the verb after he, she and it: he works, she watches, it rains.",
          hi: "साधारण वर्तमान में 'he', 'she' और 'it' के बाद क्रिया में '-s' या '-es' जोड़िए: 'he works', 'she watches', 'it rains'।",
        },
        [
          ["He works in a bank.", "वह बैंक में काम करता है।"],
          ["She watches TV.", "वह टीवी देखती है।"],
          ["It rains in July.", "जुलाई में बारिश होती है।"],
        ],
        {
          wrong: "She like tea.",
          right: "She likes tea.",
          why: {
            en: "After 'she', the verb needs -s.",
            hi: "'she' के बाद क्रिया में '-s' लगता है।",
          },
        },
        {
          type: "choose",
          prompt: "My brother ___ cricket.",
          options: ["play", "plays", "playing"],
          answer: "plays",
        }
      ),
      grammar(
        "past-simple",
        "Talking about the past",
        {
          en: "Use the past form for something that is finished. Many verbs add -ed: walk, walked. Some change: go, went; eat, ate.",
          hi: "बीती हुई बात के लिए क्रिया का भूतकाल रूप लगाइए। कई क्रियाओं में '-ed' जुड़ता है: 'walk', 'walked'। कुछ बदल जाती हैं: 'go', 'went'; 'eat', 'ate'।",
        },
        [
          ["I walked to the office.", "मैं पैदल दफ़्तर गया।"],
          ["We went to the market.", "हम बाज़ार गए।"],
        ],
        {
          wrong: "Yesterday I go to school.",
          right: "Yesterday I went to school.",
          why: {
            en: "'Yesterday' shows the past, so use the past form 'went'.",
            hi: "'Yesterday' बीते समय को बताता है, इसलिए भूतकाल रूप 'went' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "I ___ my friend yesterday.",
          options: ["meet", "met", "meeting"],
          answer: "met",
        }
      ),
      sent(
        "i-go-to-the-office-by-bus",
        "I go to the office by bus.",
        "मैं बस से दफ़्तर जाता हूँ।",
        "Use it to say how you travel to work.",
        [
          ["Meera", "How do you go to work?", "आप काम पर कैसे जाते हैं?"],
          ["Ravi", "I go to the office by bus.", "मैं बस से दफ़्तर जाता हूँ।"],
        ]
      ),
      sent(
        "she-cooks-food-in-the-evening",
        "She cooks food in the evening.",
        "वह शाम को खाना बनाती है।",
        "Use it to describe what someone does every day.",
        [
          [
            "Kiran",
            "What does your mother do in the evening?",
            "आपकी माँ शाम को क्या करती हैं?",
          ],
          [
            "Asha",
            "She cooks food in the evening.",
            "वह शाम को खाना बनाती है।",
          ],
        ]
      ),
      sent(
        "we-watched-a-film-yesterday",
        "We watched a film yesterday.",
        "हमने कल एक फ़िल्म देखी।",
        "Use it to say what you did on the day before today.",
        [
          ["Meera", "What did you do yesterday?", "आपने कल क्या किया?"],
          ["Ravi", "We watched a film yesterday.", "हमने कल एक फ़िल्म देखी।"],
        ]
      ),
      sent(
        "he-is-reading-a-book",
        "He is reading a book.",
        "वह एक किताब पढ़ रहा है।",
        "Use it to say what someone is doing right now.",
        [
          ["Asha", "Where is Kiran?", "किरण कहाँ है?"],
          ["Ravi", "He is reading a book.", "वह एक किताब पढ़ रहा है।"],
        ]
      ),
    ],
  },
  {
    slug: "adjectives",
    title: "Adjectives",
    titleHi: "विशेषण",
    goal: "Describe people and things, and compare two of them.",
    items: [
      vocab(
        "big",
        "big",
        "adjective",
        "बड़ा",
        "We live in a big house.",
        "हम एक बड़े घर में रहते हैं।"
      ),
      vocab(
        "small",
        "small",
        "adjective",
        "छोटा",
        "My room is small.",
        "मेरा कमरा छोटा है।"
      ),
      vocab(
        "good",
        "good",
        "adjective",
        "अच्छा",
        "This is a good book.",
        "यह एक अच्छी किताब है।"
      ),
      vocab(
        "bad",
        "bad",
        "adjective",
        "बुरा, खराब",
        "The weather is bad today.",
        "आज मौसम खराब है।"
      ),
      vocab(
        "new",
        "new",
        "adjective",
        "नया",
        "I have a new phone.",
        "मेरे पास एक नया फ़ोन है।"
      ),
      vocab(
        "old",
        "old",
        "adjective",
        "पुराना, बूढ़ा",
        "This building is old.",
        "यह इमारत पुरानी है।"
      ),
      vocab("hot", "hot", "adjective", "गरम", "The tea is hot.", "चाय गरम है।"),
      vocab(
        "cold",
        "cold",
        "adjective",
        "ठंडा",
        "The water is cold.",
        "पानी ठंडा है।"
      ),
      vocab(
        "happy",
        "happy",
        "adjective",
        "खुश",
        "She is happy today.",
        "वह आज खुश है।"
      ),
      vocab(
        "tired",
        "tired",
        "adjective",
        "थका हुआ",
        "I am tired after work.",
        "मैं काम के बाद थका हुआ हूँ।"
      ),
      grammar(
        "adjective-position",
        "Where the adjective goes",
        {
          en: "An adjective describes a noun. Put it before the noun, or after 'is', 'am' or 'are'.",
          hi: "विशेषण संज्ञा का वर्णन करता है। उसे संज्ञा से पहले या 'is', 'am' और 'are' के बाद लगाइए।",
        },
        [
          ["She has a new phone.", "उसके पास एक नया फ़ोन है।"],
          ["The tea is hot.", "चाय गरम है।"],
        ],
        {
          wrong: "She is a girl beautiful.",
          right: "She is a beautiful girl.",
          why: {
            en: "In English the adjective comes before the noun.",
            hi: "अंग्रेज़ी में विशेषण संज्ञा से पहले आता है।",
          },
        },
        {
          type: "choose",
          prompt: "Choose the correct order.",
          options: ["a red car", "a car red", "red a car"],
          answer: "a red car",
        }
      ),
      grammar(
        "comparing-two-things",
        "Comparing two things",
        {
          en: "Add -er to a short adjective to compare two things: tall, taller. Use 'more' with a long adjective: more useful. Use 'than' after it.",
          hi: "दो चीज़ों की तुलना के लिए छोटे विशेषण में '-er' जोड़िए: 'tall', 'taller'। लंबे विशेषण के साथ 'more' लगाइए: 'more useful'। उसके बाद 'than' आता है।",
        },
        [
          ["Delhi is bigger than Pune.", "दिल्ली पुणे से बड़ी है।"],
          [
            "This book is more useful than that one.",
            "यह किताब उस किताब से ज़्यादा काम की है।",
          ],
        ],
        {
          wrong: "He is more taller than me.",
          right: "He is taller than me.",
          why: {
            en: "Do not use 'more' together with '-er'.",
            hi: "'more' और '-er' को साथ मत लगाइए।",
          },
        },
        {
          type: "blank",
          text: "My bag is ___ than your bag.",
          answer: "heavier",
        }
      ),
      sent(
        "the-weather-is-nice-today",
        "The weather is nice today.",
        "आज मौसम अच्छा है।",
        "Use it to start a friendly talk about the weather.",
        [
          ["Asha", "The weather is nice today.", "आज मौसम अच्छा है।"],
          ["Ravi", "Yes, it is cool and sunny.", "हाँ, ठंडा और धूप वाला है।"],
        ]
      ),
      sent(
        "i-am-very-tired",
        "I am very tired.",
        "मैं बहुत थका हुआ हूँ।",
        "Use it to say that you need rest.",
        [
          ["Meera", "You look tired.", "आप थके हुए लग रहे हैं।"],
          ["Ravi", "I am very tired.", "मैं बहुत थका हुआ हूँ।"],
        ]
      ),
      sent(
        "this-is-a-new-phone",
        "This is a new phone.",
        "यह एक नया फ़ोन है।",
        "Use it to talk about something you have just bought.",
        [
          ["Kiran", "Is this your phone?", "क्या यह आपका फ़ोन है?"],
          ["Asha", "Yes, this is a new phone.", "हाँ, यह एक नया फ़ोन है।"],
        ]
      ),
    ],
  },
  {
    slug: "basic-grammar",
    title: "Basic grammar",
    titleHi: "बुनियादी व्याकरण",
    goal: "Build correct statements, questions and negatives in the present.",
    items: [
      grammar(
        "sentence-order",
        "Subject, verb, object",
        {
          en: "An English sentence usually follows this order: subject, verb, object.",
          hi: "अंग्रेज़ी वाक्य आमतौर पर इस क्रम में होता है: कर्ता, क्रिया, कर्म।",
        },
        [
          ["Ravi eats rice.", "रवि चावल खाता है।"],
          ["I read a book.", "मैं एक किताब पढ़ता हूँ।"],
        ],
        {
          wrong: "I rice eat.",
          right: "I eat rice.",
          why: {
            en: "English puts the verb before the object. Hindi puts it after.",
            hi: "अंग्रेज़ी में क्रिया कर्म से पहले आती है। हिंदी में वह बाद में आती है।",
          },
        },
        {
          type: "choose",
          prompt: "Choose the correct sentence.",
          options: ["She drinks tea.", "She tea drinks.", "Drinks she tea."],
          answer: "She drinks tea.",
        }
      ),
      grammar(
        "questions-with-do",
        "Questions with do and does",
        {
          en: "Use 'do' or 'does' to ask a question in the simple present. Use 'does' with he, she and it. The main verb stays in the simple form.",
          hi: "साधारण वर्तमान में प्रश्न पूछने के लिए 'do' या 'does' लगाइए। 'he', 'she' और 'it' के साथ 'does' आता है। मुख्य क्रिया साधारण रूप में रहती है।",
        },
        [
          ["Do you live here?", "क्या आप यहाँ रहते हैं?"],
          ["Does she work here?", "क्या वह यहाँ काम करती है?"],
        ],
        {
          wrong: "Does she works here?",
          right: "Does she work here?",
          why: {
            en: "After 'does', the verb has no -s.",
            hi: "'does' के बाद क्रिया में '-s' नहीं लगता।",
          },
        },
        {
          type: "choose",
          prompt: "___ he speak English?",
          options: ["Do", "Does", "Is"],
          answer: "Does",
        }
      ),
      grammar(
        "negatives-with-do-not",
        "Saying no with do not",
        {
          en: "Use 'do not' or 'does not' to make a negative sentence. The main verb stays in the simple form.",
          hi: "नकारात्मक वाक्य के लिए 'do not' या 'does not' लगाइए। मुख्य क्रिया साधारण रूप में रहती है।",
        },
        [
          ["I do not drink coffee.", "मैं कॉफ़ी नहीं पीता।"],
          ["He does not live here.", "वह यहाँ नहीं रहता।"],
        ],
        {
          wrong: "He does not likes tea.",
          right: "He does not like tea.",
          why: {
            en: "After 'does not', the verb has no -s.",
            hi: "'does not' के बाद क्रिया में '-s' नहीं लगता।",
          },
        },
        { type: "blank", text: "She does not ___ tea.", answer: "drink" }
      ),
      grammar(
        "this-that-these-those",
        "This, that, these and those",
        {
          en: "Use 'this' and 'these' for things near you. Use 'that' and 'those' for things far from you.",
          hi: "पास की चीज़ों के लिए 'this' और 'these' लगाइए। दूर की चीज़ों के लिए 'that' और 'those' लगाइए।",
        },
        [
          ["This is my pen.", "यह मेरा पेन है।"],
          ["Those are his books.", "वे उसकी किताबें हैं।"],
        ],
        {
          wrong: "This are my books.",
          right: "These are my books.",
          why: {
            en: "Use 'these' for more than one thing near you.",
            hi: "पास की एक से ज़्यादा चीज़ों के लिए 'these' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "___ is my house over there.",
          options: ["This", "That", "These"],
          answer: "That",
        }
      ),
      grammar(
        "present-continuous",
        "Actions happening now",
        {
          en: "Use 'am', 'is' or 'are' with a verb ending in -ing for an action that is happening now.",
          hi: "इस समय हो रही क्रिया के लिए 'am', 'is' या 'are' के साथ '-ing' वाली क्रिया लगाइए।",
        },
        [
          ["I am reading a book.", "मैं एक किताब पढ़ रहा हूँ।"],
          ["They are playing outside.", "वे बाहर खेल रहे हैं।"],
        ],
        {
          wrong: "I reading a book now.",
          right: "I am reading a book now.",
          why: {
            en: "A verb with -ing needs 'am', 'is' or 'are' before it.",
            hi: "'-ing' वाली क्रिया से पहले 'am', 'is' या 'are' चाहिए।",
          },
        },
        { type: "blank", text: "She ___ cooking now.", answer: "is" }
      ),
      grammar(
        "there-is-there-are",
        "There is and there are",
        {
          en: "Use 'there is' with one thing and 'there are' with more than one thing.",
          hi: "एक चीज़ के लिए 'there is' और एक से ज़्यादा चीज़ों के लिए 'there are' लगाइए।",
        },
        [
          ["There is a bank near my house.", "मेरे घर के पास एक बैंक है।"],
          [
            "There are three chairs in the room.",
            "कमरे में तीन कुर्सियाँ हैं।",
          ],
        ],
        {
          wrong: "There is two books on the table.",
          right: "There are two books on the table.",
          why: {
            en: "Two books are more than one, so use 'there are'.",
            hi: "दो किताबें एक से ज़्यादा हैं, इसलिए 'there are' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "There ___ a market near here.",
          options: ["is", "are", "am"],
          answer: "is",
        }
      ),
      sent(
        "do-you-speak-english",
        "Do you speak English?",
        "क्या आप अंग्रेज़ी बोलते हैं?",
        "Use it to ask someone if they speak English.",
        [
          ["Asha", "Do you speak English?", "क्या आप अंग्रेज़ी बोलते हैं?"],
          ["Ravi", "Yes, a little.", "हाँ, थोड़ी-सी।"],
        ]
      ),
      sent(
        "i-do-not-understand",
        "I do not understand.",
        "मैं समझ नहीं पा रहा।",
        "Use it politely when you cannot follow what someone said.",
        [
          ["Kiran", "The meeting is at ten.", "बैठक दस बजे है।"],
          [
            "Meera",
            "I do not understand. Please say it again.",
            "मैं समझ नहीं पा रही। कृपया फिर से कहिए।",
          ],
        ]
      ),
      sent(
        "what-is-your-name",
        "What is your name?",
        "आपका नाम क्या है?",
        "Use it to ask a person for their name.",
        [
          ["Meera", "Hello. What is your name?", "नमस्ते। आपका नाम क्या है?"],
          ["Ravi", "My name is Ravi.", "मेरा नाम रवि है।"],
        ]
      ),
      sent(
        "where-do-you-live",
        "Where do you live?",
        "आप कहाँ रहते हैं?",
        "Use it to ask where someone's home is.",
        [
          ["Asha", "Where do you live?", "आप कहाँ रहते हैं?"],
          ["Kiran", "I live in Pune.", "मैं पुणे में रहता हूँ।"],
        ]
      ),
      sent(
        "this-is-my-friend",
        "This is my friend.",
        "यह मेरा दोस्त है।",
        "Use it to introduce a friend to someone.",
        [
          ["Ravi", "Meera, this is my friend.", "मीरा, यह मेरा दोस्त है।"],
          ["Meera", "Nice to meet you.", "आपसे मिलकर अच्छा लगा।"],
        ]
      ),
    ],
  },
  {
    slug: "sentence-formation",
    title: "Making sentences",
    titleHi: "वाक्य बनाना",
    goal: "Put words in the right order to make everyday sentences.",
    items: [
      grammar(
        "can-and-will",
        "Can and will",
        {
          en: "Use 'can' for ability or permission and 'will' for the future. The verb after them stays in the simple form.",
          hi: "क्षमता या अनुमति के लिए 'can' और भविष्य के लिए 'will' लगाइए। उनके बाद क्रिया साधारण रूप में रहती है।",
        },
        [
          ["I can swim.", "मैं तैर सकता हूँ।"],
          ["She will call you.", "वह आपको फ़ोन करेगी।"],
        ],
        {
          wrong: "She can speaks English.",
          right: "She can speak English.",
          why: {
            en: "After 'can', the verb has no -s.",
            hi: "'can' के बाद क्रिया में '-s' नहीं लगता।",
          },
        },
        {
          type: "choose",
          prompt: "He will ___ tomorrow.",
          options: ["come", "comes", "coming"],
          answer: "come",
        }
      ),
      sent(
        "i-want-a-cup-of-tea",
        "I want a cup of tea.",
        "मुझे एक कप चाय चाहिए।",
        "Use it to ask for a drink in a polite, simple way.",
        [
          ["Meera", "What would you like?", "आप क्या लेंगे?"],
          ["Ravi", "I want a cup of tea.", "मुझे एक कप चाय चाहिए।"],
        ]
      ),
      sent(
        "she-is-going-to-the-market",
        "She is going to the market.",
        "वह बाज़ार जा रही है।",
        "Use it to say where someone is going now.",
        [
          ["Kiran", "Where is your mother?", "आपकी माँ कहाँ हैं?"],
          ["Asha", "She is going to the market.", "वह बाज़ार जा रही है।"],
        ]
      ),
      sent(
        "we-are-learning-english",
        "We are learning English.",
        "हम अंग्रेज़ी सीख रहे हैं।",
        "Use it to tell people what you are studying.",
        [
          ["Meera", "What are you studying?", "आप क्या पढ़ रहे हैं?"],
          ["Ravi", "We are learning English.", "हम अंग्रेज़ी सीख रहे हैं।"],
        ]
      ),
      sent(
        "he-can-speak-three-languages",
        "He can speak three languages.",
        "वह तीन भाषाएँ बोल सकता है।",
        "Use it to talk about what someone is able to do.",
        [
          [
            "Asha",
            "Can your brother speak Hindi?",
            "क्या आपका भाई हिंदी बोल सकता है?",
          ],
          [
            "Kiran",
            "He can speak three languages.",
            "वह तीन भाषाएँ बोल सकता है।",
          ],
        ]
      ),
      sent(
        "can-i-ask-a-question",
        "Can I ask a question?",
        "क्या मैं एक सवाल पूछ सकता हूँ?",
        "Use it politely before you ask something in class or in a meeting.",
        [
          ["Ravi", "Can I ask a question?", "क्या मैं एक सवाल पूछ सकता हूँ?"],
          ["Teacher", "Yes, please go ahead.", "हाँ, कृपया पूछिए।"],
        ]
      ),
      sent(
        "i-have-finished-my-work",
        "I have finished my work.",
        "मैंने अपना काम पूरा कर लिया है।",
        "Use it to say that your task is complete.",
        [
          ["Meera", "Is the report ready?", "क्या रिपोर्ट तैयार है?"],
          [
            "Ravi",
            "I have finished my work.",
            "मैंने अपना काम पूरा कर लिया है।",
          ],
        ]
      ),
      sent(
        "they-will-come-tomorrow",
        "They will come tomorrow.",
        "वे कल आएँगे।",
        "Use it to talk about a plan for the next day.",
        [
          ["Asha", "When will the guests come?", "मेहमान कब आएँगे?"],
          ["Kiran", "They will come tomorrow.", "वे कल आएँगे।"],
        ]
      ),
      sent(
        "please-open-the-door",
        "Please open the door.",
        "कृपया दरवाज़ा खोलिए।",
        "Use it to ask someone politely to open a door.",
        [
          ["Meera", "Please open the door.", "कृपया दरवाज़ा खोलिए।"],
          ["Ravi", "Sure, one moment.", "ज़रूर, एक क्षण।"],
        ]
      ),
      sent(
        "i-like-to-read-books",
        "I like to read books.",
        "मुझे किताबें पढ़ना पसंद है।",
        "Use it to talk about something you enjoy.",
        [
          ["Kiran", "What do you like to do?", "आपको क्या करना पसंद है?"],
          ["Asha", "I like to read books.", "मुझे किताबें पढ़ना पसंद है।"],
        ]
      ),
      sent(
        "my-brother-works-in-a-bank",
        "My brother works in a bank.",
        "मेरा भाई बैंक में काम करता है।",
        "Use it to say what someone in your family does.",
        [
          ["Ravi", "What does your brother do?", "आपका भाई क्या करता है?"],
          [
            "Meera",
            "My brother works in a bank.",
            "मेरा भाई बैंक में काम करता है।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "singular-and-plural",
    title: "Singular and plural",
    titleHi: "एकवचन और बहुवचन",
    goal: "Make plurals correctly, including the ones that change completely.",
    items: [
      grammar(
        "regular-plurals",
        "Adding -s and -es",
        {
          en: "Add -s to most nouns to make the plural. Add -es after s, x, ch and sh.",
          hi: "ज़्यादातर संज्ञाओं में बहुवचन के लिए '-s' जोड़िए। 's', 'x', 'ch' और 'sh' के बाद '-es' जोड़िए।",
        },
        [
          ["One book, two books.", "एक किताब, दो किताबें।"],
          ["One box, two boxes.", "एक डिब्बा, दो डिब्बे।"],
        ],
        {
          wrong: "Two boxs are on the table.",
          right: "Two boxes are on the table.",
          why: {
            en: "After 'x', add -es, not -s.",
            hi: "'x' के बाद '-s' नहीं, '-es' जोड़िए।",
          },
        },
        {
          type: "choose",
          prompt: "One church, two ___.",
          options: ["churchs", "churches", "churchies"],
          answer: "churches",
        }
      ),
      grammar(
        "irregular-plurals",
        "Plurals that change",
        {
          en: "Some plurals change completely: man, men; woman, women; child, children; foot, feet; tooth, teeth.",
          hi: "कुछ बहुवचन पूरी तरह बदल जाते हैं: 'man', 'men'; 'woman', 'women'; 'child', 'children'; 'foot', 'feet'; 'tooth', 'teeth'।",
        },
        [
          ["One child, two children.", "एक बच्चा, दो बच्चे।"],
          ["One man, three men.", "एक आदमी, तीन आदमी।"],
        ],
        {
          wrong: "Two childs are in the room.",
          right: "Two children are in the room.",
          why: {
            en: "The plural of 'child' is 'children', not 'childs'.",
            hi: "'child' का बहुवचन 'children' है, 'childs' नहीं।",
          },
        },
        {
          type: "choose",
          prompt: "Two ___ are playing outside.",
          options: ["child", "childs", "children"],
          answer: "children",
        }
      ),
      grammar(
        "plurals-ending-in-y",
        "Words ending in y",
        {
          en: "If a noun ends in a consonant and y, change y to -ies: baby, babies. If a vowel comes before y, just add -s: boy, boys.",
          hi: "यदि संज्ञा व्यंजन और 'y' पर खत्म हो, तो 'y' को '-ies' में बदलिए: 'baby', 'babies'। यदि 'y' से पहले स्वर हो, तो बस '-s' जोड़िए: 'boy', 'boys'।",
        },
        [
          ["One city, two cities.", "एक शहर, दो शहर।"],
          ["One day, two days.", "एक दिन, दो दिन।"],
        ],
        {
          wrong: "There are many citys in India.",
          right: "There are many cities in India.",
          why: {
            en: "'City' ends in a consonant and y, so use -ies.",
            hi: "'City' व्यंजन और 'y' पर खत्म होता है, इसलिए '-ies' लगाइए।",
          },
        },
        {
          type: "blank",
          text: "There are many ___ in India.",
          answer: "cities",
        }
      ),
      sent(
        "i-have-two-brothers",
        "I have two brothers.",
        "मेरे दो भाई हैं।",
        "Use it to say how many brothers you have.",
        [
          ["Meera", "Do you have brothers?", "क्या आपके भाई हैं?"],
          ["Ravi", "I have two brothers.", "मेरे दो भाई हैं।"],
        ]
      ),
      sent(
        "there-are-many-books-on-the-shelf",
        "There are many books on the shelf.",
        "अलमारी पर बहुत सारी किताबें हैं।",
        "Use it to describe what you see in a room.",
        [
          ["Asha", "What is in this room?", "इस कमरे में क्या है?"],
          [
            "Kiran",
            "There are many books on the shelf.",
            "अलमारी पर बहुत सारी किताबें हैं।",
          ],
        ]
      ),
      sent(
        "the-children-are-in-the-garden",
        "The children are in the garden.",
        "बच्चे बगीचे में हैं।",
        "Use it to say where the children are.",
        [
          ["Meera", "Where are the children?", "बच्चे कहाँ हैं?"],
          ["Ravi", "The children are in the garden.", "बच्चे बगीचे में हैं।"],
        ]
      ),
      sent(
        "she-has-three-bags",
        "She has three bags.",
        "उसके पास तीन बैग हैं।",
        "Use it to say how many things a person has.",
        [
          ["Kiran", "Does she need help?", "क्या उसे मदद चाहिए?"],
          ["Asha", "Yes, she has three bags.", "हाँ, उसके पास तीन बैग हैं।"],
        ]
      ),
    ],
  },
  {
    slug: "articles",
    title: "Articles: a, an and the",
    titleHi: "आर्टिकल: a, an और the",
    goal: "Choose between a, an, the and no article.",
    items: [
      grammar(
        "a-and-an",
        "A and an",
        {
          en: "Use 'a' before a consonant sound and 'an' before a vowel sound: a book, an apple.",
          hi: "व्यंजन की ध्वनि से पहले 'a' और स्वर की ध्वनि से पहले 'an' लगाइए: 'a book', 'an apple'।",
        },
        [
          ["I have a pen.", "मेरे पास एक पेन है।"],
          ["She eats an egg.", "वह एक अंडा खाती है।"],
        ],
        {
          wrong: "He studies at an university.",
          right: "He studies at a university.",
          why: {
            en: "'University' starts with a 'yoo' sound, so use 'a'.",
            hi: "'University' की शुरुआत 'यू' की ध्वनि से होती है, इसलिए 'a' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "She is ___ engineer.",
          options: ["a", "an", "the"],
          answer: "an",
        }
      ),
      grammar(
        "the-for-something-specific",
        "The",
        {
          en: "Use 'the' for something specific that both people know about: the sun, the book on the table.",
          hi: "किसी खास चीज़ के लिए, जिसके बारे में दोनों जानते हैं, 'the' लगाइए: 'the sun', 'the book on the table'।",
        },
        [
          ["The sun is hot.", "सूरज गरम है।"],
          ["Please close the door.", "कृपया दरवाज़ा बंद कीजिए।"],
        ],
        {
          wrong: "Sun rises in the east.",
          right: "The sun rises in the east.",
          why: {
            en: "There is only one sun, so we say 'the sun'.",
            hi: "सूरज एक ही है, इसलिए हम 'the sun' कहते हैं।",
          },
        },
        { type: "blank", text: "Please open ___ window.", answer: "the" }
      ),
      grammar(
        "no-article",
        "When to use no article",
        {
          en: "Do not use 'a', 'an' or 'the' with general plural nouns, general uncountable nouns, or the names of most cities and countries.",
          hi: "सामान्य बहुवचन संज्ञाओं, सामान्य न गिनी जाने वाली संज्ञाओं और ज़्यादातर शहरों और देशों के नामों के साथ 'a', 'an' या 'the' मत लगाइए।",
        },
        [
          ["I drink water every day.", "मैं रोज़ पानी पीता हूँ।"],
          ["India is a big country.", "भारत एक बड़ा देश है।"],
        ],
        {
          wrong: "The India is a big country.",
          right: "India is a big country.",
          why: {
            en: "Do not put 'the' before the name of this country.",
            hi: "इस देश के नाम से पहले 'the' मत लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "Choose the correct sentence.",
          options: [
            "I drink water every day.",
            "I drink a water every day.",
            "I drink an water every day.",
          ],
          answer: "I drink water every day.",
        }
      ),
      sent(
        "i-have-a-question",
        "I have a question.",
        "मेरा एक सवाल है।",
        "Use it to tell someone that you want to ask something.",
        [
          ["Ravi", "I have a question.", "मेरा एक सवाल है।"],
          ["Teacher", "Yes, please ask.", "हाँ, कृपया पूछिए।"],
        ]
      ),
      sent(
        "she-is-an-honest-person",
        "She is an honest person.",
        "वह एक ईमानदार इंसान है।",
        "Use it to speak well of someone.",
        [
          ["Kiran", "Can we trust her?", "क्या हम उस पर भरोसा कर सकते हैं?"],
          [
            "Asha",
            "Yes, she is an honest person.",
            "हाँ, वह एक ईमानदार इंसान है।",
          ],
        ],
        { type: "arrange" },
        {
          note: {
            en: "'Honest' starts with a silent 'h', so we say 'an honest'.",
            hi: "'Honest' में 'h' नहीं बोला जाता, इसलिए 'an honest' कहते हैं।",
          },
        }
      ),
      sent(
        "the-teacher-is-in-the-class",
        "The teacher is in the class.",
        "शिक्षक कक्षा में हैं।",
        "Use it to say where the teacher is.",
        [
          ["Meera", "Where is the teacher?", "शिक्षक कहाँ हैं?"],
          ["Ravi", "The teacher is in the class.", "शिक्षक कक्षा में हैं।"],
        ]
      ),
      sent(
        "he-plays-the-guitar",
        "He plays the guitar.",
        "वह गिटार बजाता है।",
        "Use it to say which musical instrument someone plays.",
        [
          [
            "Asha",
            "What does your brother do for fun?",
            "आपका भाई मनोरंजन के लिए क्या करता है?",
          ],
          ["Kiran", "He plays the guitar.", "वह गिटार बजाता है।"],
        ]
      ),
    ],
  },
  {
    slug: "prepositions",
    title: "Prepositions",
    titleHi: "संबंधबोधक शब्द",
    goal: "Use in, on, at, to, from, with, for and since in common situations.",
    items: [
      grammar(
        "in-on-at-for-time",
        "In, on and at for time",
        {
          en: "Use 'at' for clock times, 'on' for days and dates, and 'in' for months, years and parts of the day.",
          hi: "घड़ी के समय के लिए 'at', दिन और तारीख़ के लिए 'on', और महीने, साल और दिन के हिस्सों के लिए 'in' लगाइए।",
        },
        [
          ["The meeting is at ten o'clock.", "बैठक दस बजे है।"],
          ["I will see you on Monday.", "मैं आपसे सोमवार को मिलूँगा।"],
          ["She was born in March.", "उसका जन्म मार्च में हुआ।"],
        ],
        {
          wrong: "I will meet you in Monday.",
          right: "I will meet you on Monday.",
          why: {
            en: "Use 'on' with the name of a day.",
            hi: "दिन के नाम के साथ 'on' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "The class starts ___ nine o'clock.",
          options: ["in", "on", "at"],
          answer: "at",
        }
      ),
      grammar(
        "in-on-at-for-place",
        "In, on and at for place",
        {
          en: "Use 'in' for inside a place, 'on' for a surface, and 'at' for a point or an address.",
          hi: "किसी जगह के अंदर के लिए 'in', सतह के लिए 'on', और किसी बिंदु या पते के लिए 'at' लगाइए।",
        },
        [
          ["The keys are in the bag.", "चाबियाँ बैग में हैं।"],
          ["The book is on the table.", "किताब मेज़ पर है।"],
          ["I am at the bus stop.", "मैं बस स्टॉप पर हूँ।"],
        ],
        {
          wrong: "I am in the bus stop.",
          right: "I am at the bus stop.",
          why: {
            en: "A bus stop is a point, so use 'at'.",
            hi: "बस स्टॉप एक बिंदु है, इसलिए 'at' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "The phone is ___ the table.",
          options: ["in", "on", "at"],
          answer: "on",
        }
      ),
      grammar(
        "to-from-with",
        "To, from and with",
        {
          en: "Use 'to' for the place you go towards, 'from' for the place you start, and 'with' for company.",
          hi: "जिस जगह की ओर जाते हैं उसके लिए 'to', जहाँ से शुरू करते हैं उसके लिए 'from', और साथ के लिए 'with' लगाइए।",
        },
        [
          ["I go to the office.", "मैं दफ़्तर जाता हूँ।"],
          ["She comes from Pune.", "वह पुणे से आती है।"],
          ["I live with my parents.", "मैं अपने माता-पिता के साथ रहता हूँ।"],
        ],
        {
          wrong: "I go at the market.",
          right: "I go to the market.",
          why: {
            en: "Use 'to' after 'go' when you name the place.",
            hi: "जगह का नाम बताते समय 'go' के बाद 'to' लगाइए।",
          },
        },
        { type: "blank", text: "He is going ___ the market.", answer: "to" }
      ),
      grammar(
        "for-and-since",
        "For and since",
        {
          en: "Use 'for' with a length of time and 'since' with the starting point. Use 'have lived' or 'have worked' with them.",
          hi: "समय की अवधि के साथ 'for' और शुरुआत के बिंदु के साथ 'since' लगाइए। इनके साथ 'have lived' या 'have worked' आता है।",
        },
        [
          [
            "I have lived here for five years.",
            "मैं यहाँ पाँच साल से रह रहा हूँ।",
          ],
          ["She has worked here since 2022.", "वह 2022 से यहाँ काम कर रही है।"],
        ],
        {
          wrong: "I live here since two years.",
          right: "I have lived here for two years.",
          why: {
            en: "Use 'have lived' and 'for' with a length of time.",
            hi: "समय की अवधि के साथ 'have lived' और 'for' लगाइए।",
          },
        },
        {
          type: "choose",
          prompt: "She has studied English ___ 2020.",
          options: ["for", "since", "from"],
          answer: "since",
        }
      ),
      sent(
        "the-bank-is-next-to-the-school",
        "The bank is next to the school.",
        "बैंक स्कूल के बगल में है।",
        "Use it to tell someone where a place is.",
        [
          ["Meera", "Where is the bank?", "बैंक कहाँ है?"],
          [
            "Ravi",
            "The bank is next to the school.",
            "बैंक स्कूल के बगल में है।",
          ],
        ]
      ),
      sent(
        "i-am-waiting-for-the-bus",
        "I am waiting for the bus.",
        "मैं बस का इंतज़ार कर रहा हूँ।",
        "Use it to say what you are waiting for.",
        [
          ["Kiran", "Why are you standing here?", "आप यहाँ क्यों खड़े हैं?"],
          [
            "Asha",
            "I am waiting for the bus.",
            "मैं बस का इंतज़ार कर रही हूँ।",
          ],
        ]
      ),
      sent(
        "please-sit-between-ravi-and-meera",
        "Please sit between Ravi and Meera.",
        "कृपया रवि और मीरा के बीच में बैठिए।",
        "Use it to show someone where to sit.",
        [
          ["Asha", "Where should I sit?", "मैं कहाँ बैठूँ?"],
          [
            "Kiran",
            "Please sit between Ravi and Meera.",
            "कृपया रवि और मीरा के बीच में बैठिए।",
          ],
        ]
      ),
      sent(
        "she-is-good-at-maths",
        "She is good at maths.",
        "वह गणित में अच्छी है।",
        "Use it to say what someone is skilled at.",
        [
          [
            "Ravi",
            "Who can help with this sum?",
            "इस सवाल में कौन मदद कर सकता है?",
          ],
          ["Meera", "She is good at maths.", "वह गणित में अच्छी है।"],
        ]
      ),
    ],
  },
])
