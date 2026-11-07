import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "asking-questions",
    title: "Asking questions",
    titleHi: "सवाल पूछना",
    goal: "Ask for information politely in public places.",
    items: [
      sent(
        "excuse-me-where-is-the-bus-stop",
        "Excuse me, where is the bus stop?",
        "सुनिए, बस स्टॉप कहाँ है?",
        "Use it to ask a stranger for directions.",
        [
          [
            "Ravi",
            "Excuse me, where is the bus stop?",
            "सुनिए, बस स्टॉप कहाँ है?",
          ],
          ["Meera", "It is across the road.", "वह सड़क के उस पार है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "how-much-does-this-cost",
        "How much does this cost?",
        "इसकी कीमत कितनी है?",
        "Use it in a shop to ask the price.",
        [
          ["Ravi", "How much does this cost?", "इसकी कीमत कितनी है?"],
          [
            "Meera",
            "It costs two hundred rupees.",
            "इसकी कीमत दो सौ रुपये है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-time-does-the-train-leave",
        "What time does the train leave?",
        "ट्रेन कितने बजे जाती है?",
        "Use it at a station to ask the departure time.",
        [
          [
            "Ravi",
            "What time does the train leave?",
            "ट्रेन कितने बजे जाती है?",
          ],
          ["Meera", "It leaves at six.", "वह छह बजे जाती है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-you-tell-me-the-way-to",
        "Can you tell me the way to the station?",
        "क्या आप मुझे स्टेशन का रास्ता बता सकते हैं?",
        "Use it politely to ask for directions.",
        [
          [
            "Ravi",
            "Can you tell me the way to the station?",
            "क्या आप मुझे स्टेशन का रास्ता बता सकते हैं?",
          ],
          [
            "Meera",
            "Go straight and turn left.",
            "सीधे जाइए और बाएँ मुड़ जाइए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "which-road-goes-to-the-market",
        "Which road goes to the market?",
        "बाज़ार के लिए कौन सी सड़क जाती है?",
        "Use it when there is more than one road.",
        [
          [
            "Ravi",
            "Which road goes to the market?",
            "बाज़ार के लिए कौन सी सड़क जाती है?",
          ],
          ["Meera", "Take the second road.", "दूसरी सड़क लीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "why-is-the-shop-closed",
        "Why is the shop closed?",
        "दुकान बंद क्यों है?",
        "Use it when a place is shut at an unusual time.",
        [
          ["Ravi", "Why is the shop closed?", "दुकान बंद क्यों है?"],
          ["Meera", "It is a holiday today.", "आज छुट्टी है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "how-long-will-it-take",
        "How long will it take?",
        "इसमें कितना समय लगेगा?",
        "Use it to ask how long a job or trip will be.",
        [
          ["Ravi", "How long will it take?", "इसमें कितना समय लगेगा?"],
          ["Meera", "About twenty minutes.", "लगभग बीस मिनट।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "is-this-seat-free",
        "Is this seat free?",
        "क्या यह सीट खाली है?",
        "Use it before you sit next to someone.",
        [
          ["Ravi", "Is this seat free?", "क्या यह सीट खाली है?"],
          ["Meera", "Yes, please sit.", "हाँ, कृपया बैठिए।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "asking-the-way",
        "Asking the way",
        {
          en: "A visitor asks for directions.",
          hi: "एक आगंतुक रास्ता पूछता है।",
        },
        [
          [
            "Kiran",
            "Excuse me, can you tell me the way to the station?",
            "सुनिए, क्या आप मुझे स्टेशन का रास्ता बता सकते हैं?",
          ],
          [
            "Ravi",
            "Go straight and turn left at the bank.",
            "सीधे जाइए और बैंक के पास बाएँ मुड़ जाइए।",
          ],
          ["Kiran", "How long will it take?", "इसमें कितना समय लगेगा?"],
          ["Ravi", "About ten minutes on foot.", "पैदल लगभग दस मिनट।"],
          ["Kiran", "Thank you very much.", "आपका बहुत धन्यवाद।"],
        ]
      ),
    ],
  },
])
