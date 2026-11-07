import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "thanking",
    title: "Thanking someone",
    titleHi: "धन्यवाद कहना",
    goal: "Thank people warmly and reply to thanks.",
    items: [
      sent(
        "thank-you-very-much",
        "Thank you very much.",
        "आपका बहुत-बहुत धन्यवाद।",
        "Use it to show strong thanks.",
        [
          ["Meera", "Here is your parcel.", "यह लीजिए आपका पार्सल।"],
          ["Ravi", "Thank you very much.", "आपका बहुत-बहुत धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "thanks-a-lot-for-your-help",
        "Thanks a lot for your help.",
        "आपकी मदद के लिए बहुत धन्यवाद।",
        "Use it after someone has helped you.",
        [
          [
            "Ravi",
            "Thanks a lot for your help.",
            "आपकी मदद के लिए बहुत धन्यवाद।",
          ],
          ["Meera", "You are welcome.", "आपका स्वागत है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-really-appreciate-it",
        "I really appreciate it.",
        "मैं इसकी सचमुच कद्र करता हूँ।",
        "Use it to show that you value what someone did.",
        [
          [
            "Meera",
            "I stayed to finish your work.",
            "मैं आपका काम पूरा करने के लिए रुका।",
          ],
          ["Ravi", "I really appreciate it.", "मैं इसकी सचमुच कद्र करता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "that-is-very-kind-of-you",
        "That is very kind of you.",
        "यह आपकी बड़ी कृपा है।",
        "Use it to thank someone for a kind act.",
        [
          ["Meera", "Please take my seat.", "कृपया मेरी सीट ले लीजिए।"],
          ["Ravi", "That is very kind of you.", "यह आपकी बड़ी कृपा है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "thank-you-for-coming",
        "Thank you for coming.",
        "आने के लिए धन्यवाद।",
        "Use it to thank a guest or a visitor.",
        [
          ["Ravi", "Thank you for coming.", "आने के लिए धन्यवाद।"],
          ["Meera", "Thank you for inviting me.", "बुलाने के लिए धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "you-are-welcome",
        "You are welcome.",
        "आपका स्वागत है।",
        "Use it to reply when someone thanks you.",
        [
          ["Meera", "Thank you for the tea.", "चाय के लिए धन्यवाद।"],
          ["Ravi", "You are welcome.", "आपका स्वागत है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-was-my-pleasure",
        "It was my pleasure.",
        "यह मेरे लिए खुशी की बात थी।",
        "Use it as a warm reply to thanks.",
        [
          [
            "Meera",
            "Thank you for your help today.",
            "आज की मदद के लिए धन्यवाद।",
          ],
          ["Ravi", "It was my pleasure.", "यह मेरे लिए खुशी की बात थी।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "thank-you-for-your-time",
        "Thank you for your time.",
        "अपना समय देने के लिए धन्यवाद।",
        "Use it at the end of a meeting or an interview.",
        [
          ["Ravi", "Thank you for your time.", "अपना समय देने के लिए धन्यवाद।"],
          ["Meera", "You are welcome. Goodbye.", "आपका स्वागत है। अलविदा।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "thanking-a-colleague",
        "Thanking a colleague",
        {
          en: "A colleague thanks another for help.",
          hi: "एक सहकर्मी मदद के लिए दूसरे को धन्यवाद देता है।",
        },
        [
          [
            "Meera",
            "Thanks a lot for your help, Ravi.",
            "आपकी मदद के लिए बहुत धन्यवाद, रवि।",
          ],
          [
            "Ravi",
            "You are welcome. It was my pleasure.",
            "आपका स्वागत है। यह मेरे लिए खुशी की बात थी।",
          ],
          ["Meera", "I really appreciate it.", "मैं इसकी सचमुच कद्र करती हूँ।"],
          [
            "Ravi",
            "Please ask me again if you need anything.",
            "अगर कुछ चाहिए तो कृपया फिर पूछिएगा।",
          ],
          ["Meera", "That is very kind of you.", "यह आपकी बड़ी कृपा है।"],
        ]
      ),
    ],
  },
])
