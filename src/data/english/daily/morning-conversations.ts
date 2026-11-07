import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "morning-conversations",
    title: "Morning conversations",
    titleHi: "सुबह की बातचीत",
    goal: "Greet people and talk about the start of the day.",
    items: [
      sent(
        "good-morning-did-you-sleep-well",
        "Good morning. Did you sleep well?",
        "सुप्रभात। क्या आप अच्छी तरह सोए?",
        "Use it to greet someone at home in the morning.",
        [
          [
            "Ravi",
            "Good morning. Did you sleep well?",
            "सुप्रभात। क्या आप अच्छी तरह सोए?",
          ],
          [
            "Meera",
            "Yes, I slept well, thank you.",
            "हाँ, मैं अच्छी तरह सोया, धन्यवाद।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-woke-up-late-today",
        "I woke up late today.",
        "आज मैं देर से उठा।",
        "Use it to explain why you are not ready yet.",
        [
          ["Meera", "You look sleepy.", "आप नींद में लग रहे हैं।"],
          ["Ravi", "I woke up late today.", "आज मैं देर से उठा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "would-you-like-some-tea",
        "Would you like some tea?",
        "क्या आप थोड़ी चाय लेंगे?",
        "Use it to offer a hot drink politely.",
        [
          ["Ravi", "Would you like some tea?", "क्या आप थोड़ी चाय लेंगे?"],
          ["Meera", "Yes, please.", "हाँ, कृपया।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "breakfast-is-ready",
        "Breakfast is ready.",
        "नाश्ता तैयार है।",
        "Use it to call someone to the table.",
        [
          ["Ravi", "Breakfast is ready.", "नाश्ता तैयार है।"],
          ["Meera", "I am coming.", "मैं आ रहा हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-time-do-you-leave-for-work",
        "What time do you leave for work?",
        "आप काम के लिए कितने बजे निकलते हैं?",
        "Use it to ask about someone's morning routine.",
        [
          [
            "Ravi",
            "What time do you leave for work?",
            "आप काम के लिए कितने बजे निकलते हैं?",
          ],
          ["Meera", "I leave at eight thirty.", "मैं साढ़े आठ बजे निकलता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-leave-home-at-eight-thirty",
        "I leave home at eight thirty.",
        "मैं साढ़े आठ बजे घर से निकलता हूँ।",
        "Use it to tell someone when you leave in the morning.",
        [
          ["Meera", "When do you leave home?", "आप घर से कब निकलते हैं?"],
          [
            "Ravi",
            "I leave home at eight thirty.",
            "मैं साढ़े आठ बजे घर से निकलता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "have-a-nice-day",
        "Have a nice day.",
        "आपका दिन शुभ हो।",
        "Use it to wish someone well when you part in the morning.",
        [
          ["Meera", "I am going to work now.", "मैं अब काम पर जा रहा हूँ।"],
          ["Ravi", "Have a nice day.", "आपका दिन शुभ हो।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-is-a-lovely-morning",
        "It is a lovely morning.",
        "आज की सुबह बहुत सुंदर है।",
        "Use it to start a pleasant talk.",
        [
          ["Ravi", "It is a lovely morning.", "आज की सुबह बहुत सुंदर है।"],
          ["Meera", "Yes, the air feels fresh.", "हाँ, हवा ताज़ी लग रही है।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-morning-at-home",
        "A morning at home",
        {
          en: "Two family members talk before leaving.",
          hi: "दो परिवार वाले निकलने से पहले बात करते हैं।",
        },
        [
          [
            "Meera",
            "Good morning, Ravi. Breakfast is ready.",
            "सुप्रभात, रवि। नाश्ता तैयार है।",
          ],
          [
            "Ravi",
            "Thank you. I woke up late today.",
            "धन्यवाद। आज मैं देर से उठा।",
          ],
          ["Meera", "Would you like some tea?", "क्या आप थोड़ी चाय लेंगे?"],
          [
            "Ravi",
            "Yes, please. I leave at eight thirty.",
            "हाँ, कृपया। मैं साढ़े आठ बजे निकलता हूँ।",
          ],
          ["Meera", "Have a nice day.", "आपका दिन शुभ हो।"],
        ]
      ),
    ],
  },
])
