import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "telephone",
    title: "Telephone conversations",
    titleHi: "फ़ोन पर बातचीत",
    goal: "Make and take phone calls politely.",
    items: [
      sent(
        "hello-this-is-ravi-speaking",
        "Hello, this is Ravi speaking.",
        "नमस्ते, मैं रवि बोल रहा हूँ।",
        "Use it to introduce yourself when you call or answer.",
        [
          [
            "Ravi",
            "Hello, this is Ravi speaking.",
            "नमस्ते, मैं रवि बोल रहा हूँ।",
          ],
          [
            "Meera",
            "Hello, Ravi. This is Meera.",
            "नमस्ते, रवि। मैं मीरा बोल रही हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "may-i-speak-to-mr-sharma-please",
        "May I speak to Mr Sharma, please?",
        "क्या मैं श्री शर्मा से बात कर सकता हूँ?",
        "Use it to ask for a person when you call an office.",
        [
          [
            "Ravi",
            "May I speak to Mr Sharma, please?",
            "क्या मैं श्री शर्मा से बात कर सकता हूँ?",
          ],
          ["Meera", "Please hold the line.", "कृपया लाइन पर बने रहिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "who-is-calling-please",
        "Who is calling, please?",
        "कृपया बताइए, कौन बोल रहा है?",
        "Use it to ask the name of a caller.",
        [
          ["Ravi", "Who is calling, please?", "कृपया बताइए, कौन बोल रहा है?"],
          [
            "Meera",
            "This is Kiran from the bank.",
            "मैं बैंक से किरण बोल रहा हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-hold-the-line",
        "Please hold the line.",
        "कृपया लाइन पर बने रहिए।",
        "Use it to ask a caller to wait while you connect them.",
        [
          [
            "Meera",
            "May I speak to Mr Sharma?",
            "क्या मैं श्री शर्मा से बात कर सकता हूँ?",
          ],
          ["Ravi", "Please hold the line.", "कृपया लाइन पर बने रहिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-call-you-back",
        "I will call you back.",
        "मैं आपको वापस फ़ोन करूँगा।",
        "Use it when you cannot talk right now.",
        [
          [
            "Meera",
            "Are you free to talk?",
            "क्या आप बात करने के लिए खाली हैं?",
          ],
          ["Ravi", "I will call you back.", "मैं आपको वापस फ़ोन करूँगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "sorry-i-cannot-hear-you-clearly",
        "Sorry, I cannot hear you clearly.",
        "क्षमा कीजिए, मुझे आपकी आवाज़ साफ़ नहीं आ रही।",
        "Use it when the line is poor.",
        [
          [
            "Ravi",
            "Sorry, I cannot hear you clearly.",
            "क्षमा कीजिए, मुझे आपकी आवाज़ साफ़ नहीं आ रही।",
          ],
          ["Meera", "I will speak louder.", "मैं ज़ोर से बोलता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-i-leave-a-message",
        "Can I leave a message?",
        "क्या मैं संदेश छोड़ सकता हूँ?",
        "Use it when the person you want is not available.",
        [
          ["Ravi", "Can I leave a message?", "क्या मैं संदेश छोड़ सकता हूँ?"],
          ["Meera", "Yes, please tell me.", "हाँ, कृपया बताइए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "thank-you-for-calling",
        "Thank you for calling.",
        "फ़ोन करने के लिए धन्यवाद।",
        "Use it to end a call politely.",
        [
          ["Ravi", "Thank you for calling.", "फ़ोन करने के लिए धन्यवाद।"],
          ["Meera", "Goodbye.", "अलविदा।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-phone-call-to-an-office",
        "A phone call to an office",
        {
          en: "A caller phones an office.",
          hi: "एक व्यक्ति दफ़्तर में फ़ोन करता है।",
        },
        [
          [
            "Receptionist",
            "Good morning. How may I help you?",
            "सुप्रभात। मैं आपकी क्या मदद कर सकता हूँ?",
          ],
          [
            "Ravi",
            "Hello, this is Ravi speaking. May I speak to Mr Sharma?",
            "नमस्ते, मैं रवि बोल रहा हूँ। क्या मैं श्री शर्मा से बात कर सकता हूँ?",
          ],
          ["Receptionist", "Please hold the line.", "कृपया लाइन पर बने रहिए।"],
          [
            "Receptionist",
            "Sorry, he is in a meeting. Can I take a message?",
            "क्षमा कीजिए, वे बैठक में हैं। क्या मैं संदेश ले लूँ?",
          ],
          [
            "Ravi",
            "Yes, please. Thank you for your help.",
            "हाँ, कृपया। आपकी मदद के लिए धन्यवाद।",
          ],
        ]
      ),
    ],
  },
])
