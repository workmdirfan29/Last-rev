import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "professional",
    title: "Professional conversations",
    titleHi: "पेशेवर बातचीत",
    goal: "Speak in a polite, professional way at work.",
    items: [
      sent(
        "good-afternoon-how-may-i-help-you",
        "Good afternoon. How may I help you?",
        "नमस्कार। मैं आपकी क्या मदद कर सकता हूँ?",
        "Use it to greet a visitor or a customer.",
        [
          [
            "Ravi",
            "Good afternoon. How may I help you?",
            "नमस्कार। मैं आपकी क्या मदद कर सकता हूँ?",
          ],
          [
            "Meera",
            "I have a meeting with Mr Rao.",
            "मेरी श्री राव के साथ बैठक है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-have-a-seat",
        "Please have a seat.",
        "कृपया बैठिए।",
        "Use it to welcome a visitor in the office.",
        [
          ["Ravi", "Please have a seat.", "कृपया बैठिए।"],
          ["Meera", "Thank you.", "धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-check-and-get-back-to",
        "I will check and get back to you.",
        "मैं देखकर आपको बताता हूँ।",
        "Use it when you need to find out before you reply.",
        [
          [
            "Meera",
            "Can you confirm the date?",
            "क्या आप तारीख़ पक्की कर सकते हैं?",
          ],
          [
            "Ravi",
            "I will check and get back to you.",
            "मैं देखकर आपको बताता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-we-schedule-a-meeting-for-tomorrow",
        "Could we schedule a meeting for tomorrow?",
        "क्या हम कल के लिए एक बैठक तय कर सकते हैं?",
        "Use it to ask for a meeting time.",
        [
          [
            "Ravi",
            "Could we schedule a meeting for tomorrow?",
            "क्या हम कल के लिए एक बैठक तय कर सकते हैं?",
          ],
          ["Meera", "Yes, at ten would be good.", "हाँ, दस बजे ठीक रहेगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-find-the-details-attached",
        "Please find the details attached.",
        "कृपया ब्यौरा संलग्न देखिए।",
        "Use it in an email when you attach a file.",
        [
          [
            "Ravi",
            "Please find the details attached.",
            "कृपया ब्यौरा संलग्न देखिए।",
          ],
          [
            "Meera",
            "Thank you. I will read it.",
            "धन्यवाद। मैं इसे पढ़ लूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-share-the-update-by-evening",
        "I will share the update by evening.",
        "मैं शाम तक अपडेट साझा कर दूँगा।",
        "Use it to promise a progress report.",
        [
          [
            "Meera",
            "When can we get the status?",
            "हमें स्थिति कब मिल सकती है?",
          ],
          [
            "Ravi",
            "I will share the update by evening.",
            "मैं शाम तक अपडेट साझा कर दूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "thank-you-for-your-patience",
        "Thank you for your patience.",
        "आपके धैर्य के लिए धन्यवाद।",
        "Use it when someone has waited for you.",
        [
          [
            "Ravi",
            "Thank you for your patience.",
            "आपके धैर्य के लिए धन्यवाद।",
          ],
          ["Meera", "No problem at all.", "कोई बात नहीं।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-me-know-if-you-have-any",
        "Let me know if you have any questions.",
        "अगर आपके कोई सवाल हों तो मुझे बताइए।",
        "Use it to close a message or a talk politely.",
        [
          [
            "Ravi",
            "Let me know if you have any questions.",
            "अगर आपके कोई सवाल हों तो मुझे बताइए।",
          ],
          ["Meera", "I will. Thank you.", "ज़रूर। धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "welcoming-a-visitor",
        "Welcoming a visitor",
        {
          en: "A receptionist welcomes a visitor.",
          hi: "एक रिसेप्शनिस्ट एक आगंतुक का स्वागत करता है।",
        },
        [
          [
            "Receptionist",
            "Good afternoon. How may I help you?",
            "नमस्कार। मैं आपकी क्या मदद कर सकता हूँ?",
          ],
          [
            "Visitor",
            "I have a meeting with Mr Rao at three.",
            "मेरी तीन बजे श्री राव के साथ बैठक है।",
          ],
          [
            "Receptionist",
            "Please have a seat. I will check and get back to you.",
            "कृपया बैठिए। मैं देखकर आपको बताता हूँ।",
          ],
          ["Visitor", "Thank you.", "धन्यवाद।"],
          [
            "Receptionist",
            "Thank you for your patience. Mr Rao is ready.",
            "आपके धैर्य के लिए धन्यवाद। श्री राव तैयार हैं।",
          ],
        ]
      ),
    ],
  },
])
