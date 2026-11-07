import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "talking-to-friends",
    title: "Talking to friends",
    titleHi: "दोस्तों से बातचीत",
    goal: "Chat in a warm, relaxed way with friends.",
    items: [
      sent(
        "long-time-no-see-how-have-you",
        "Long time no see. How have you been?",
        "बहुत दिनों बाद मिले। आप कैसे रहे?",
        "Use it when you meet a friend after a long time.",
        [
          [
            "Ravi",
            "Long time no see. How have you been?",
            "बहुत दिनों बाद मिले। आप कैसे रहे?",
          ],
          ["Meera", "I have been well, thanks.", "मैं ठीक रहा, धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-are-you-doing-this-weekend",
        "What are you doing this weekend?",
        "इस सप्ताहांत आप क्या कर रहे हैं?",
        "Use it to ask a friend about their plans.",
        [
          [
            "Ravi",
            "What are you doing this weekend?",
            "इस सप्ताहांत आप क्या कर रहे हैं?",
          ],
          ["Meera", "Nothing special.", "कुछ खास नहीं।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-us-meet-on-saturday",
        "Let us meet on Saturday.",
        "चलिए शनिवार को मिलते हैं।",
        "Use it to suggest a day to meet.",
        [
          ["Ravi", "Let us meet on Saturday.", "चलिए शनिवार को मिलते हैं।"],
          ["Meera", "Saturday is fine for me.", "शनिवार मेरे लिए ठीक है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-really-happy-to-see-you",
        "I am really happy to see you.",
        "आपको देखकर मुझे सचमुच खुशी हो रही है।",
        "Use it to show warmth when you meet a friend.",
        [
          [
            "Ravi",
            "I am really happy to see you.",
            "आपको देखकर मुझे सचमुच खुशी हो रही है।",
          ],
          [
            "Meera",
            "I am happy to see you too.",
            "मुझे भी आपको देखकर खुशी हुई।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "shall-we-go-for-a-walk",
        "Shall we go for a walk?",
        "क्या हम टहलने चलें?",
        "Use it to suggest a walk together.",
        [
          ["Ravi", "Shall we go for a walk?", "क्या हम टहलने चलें?"],
          ["Meera", "Yes, let us go.", "हाँ, चलिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "that-sounds-like-a-good-idea",
        "That sounds like a good idea.",
        "यह अच्छा विचार लगता है।",
        "Use it to agree with a friend's suggestion.",
        [
          ["Meera", "Let us have tea together.", "चलिए साथ में चाय पीते हैं।"],
          ["Ravi", "That sounds like a good idea.", "यह अच्छा विचार लगता है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-call-you-later",
        "I will call you later.",
        "मैं आपको बाद में फ़ोन करूँगा।",
        "Use it to end a talk when you are busy.",
        [
          ["Meera", "Can we talk now?", "क्या हम अभी बात कर सकते हैं?"],
          ["Ravi", "I will call you later.", "मैं आपको बाद में फ़ोन करूँगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "take-care-of-yourself",
        "Take care of yourself.",
        "अपना ध्यान रखिएगा।",
        "Use it to say goodbye in a caring way.",
        [
          ["Ravi", "Take care of yourself.", "अपना ध्यान रखिएगा।"],
          ["Meera", "You too. Goodbye.", "आप भी। अलविदा।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "meeting-a-friend",
        "Meeting a friend",
        {
          en: "Two friends meet in the market.",
          hi: "दो दोस्त बाज़ार में मिलते हैं।",
        },
        [
          [
            "Asha",
            "Long time no see. How have you been?",
            "बहुत दिनों बाद मिले। आप कैसे रहे?",
          ],
          [
            "Kiran",
            "I have been well. What are you doing this weekend?",
            "मैं ठीक रहा। इस सप्ताहांत आप क्या कर रही हैं?",
          ],
          [
            "Asha",
            "Nothing special. Let us meet on Saturday.",
            "कुछ खास नहीं। चलिए शनिवार को मिलते हैं।",
          ],
          ["Kiran", "That sounds like a good idea.", "यह अच्छा विचार लगता है।"],
          [
            "Asha",
            "Great. Take care of yourself.",
            "बढ़िया। अपना ध्यान रखिएगा।",
          ],
        ]
      ),
    ],
  },
])
