import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "asking-for-help",
    title: "Asking for help",
    titleHi: "मदद माँगना",
    goal: "Ask for help clearly and politely.",
    items: [
      sent(
        "could-you-help-me-please",
        "Could you help me, please?",
        "क्या आप कृपया मेरी मदद कर सकते हैं?",
        "Use it to start asking for help.",
        [
          [
            "Ravi",
            "Could you help me, please?",
            "क्या आप कृपया मेरी मदद कर सकते हैं?",
          ],
          ["Meera", "Yes, what do you need?", "हाँ, आपको क्या चाहिए?"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-need-some-help-with-this-form",
        "I need some help with this form.",
        "मुझे इस फ़ॉर्म में कुछ मदद चाहिए।",
        "Use it at an office or a bank when a form is hard.",
        [
          [
            "Ravi",
            "I need some help with this form.",
            "मुझे इस फ़ॉर्म में कुछ मदद चाहिए।",
          ],
          ["Meera", "Let me look at it.", "मुझे देखने दीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-you-show-me-how-to-do",
        "Can you show me how to do it?",
        "क्या आप मुझे दिखा सकते हैं कि इसे कैसे करते हैं?",
        "Use it to ask for a demonstration.",
        [
          [
            "Ravi",
            "Can you show me how to do it?",
            "क्या आप मुझे दिखा सकते हैं कि इसे कैसे करते हैं?",
          ],
          ["Meera", "Yes, watch this step.", "हाँ, यह चरण देखिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-lost-can-you-help-me",
        "I am lost. Can you help me?",
        "मैं रास्ता भूल गया हूँ। क्या आप मेरी मदद कर सकते हैं?",
        "Use it when you cannot find your way.",
        [
          [
            "Ravi",
            "I am lost. Can you help me?",
            "मैं रास्ता भूल गया हूँ। क्या आप मेरी मदद कर सकते हैं?",
          ],
          ["Meera", "Where do you want to go?", "आप कहाँ जाना चाहते हैं?"],
        ],
        { type: "arrange" }
      ),
      sent(
        "do-you-have-a-minute",
        "Do you have a minute?",
        "क्या आपके पास एक मिनट है?",
        "Use it to ask if someone is free to talk.",
        [
          ["Ravi", "Do you have a minute?", "क्या आपके पास एक मिनट है?"],
          ["Meera", "Yes, tell me.", "हाँ, बताइए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-do-not-understand-this-word",
        "I do not understand this word.",
        "मुझे यह शब्द समझ नहीं आ रहा।",
        "Use it to ask about a new English word.",
        [
          [
            "Ravi",
            "I do not understand this word.",
            "मुझे यह शब्द समझ नहीं आ रहा।",
          ],
          ["Meera", "It means very big.", "इसका मतलब बहुत बड़ा है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-explain-it-again",
        "Could you explain it again?",
        "क्या आप इसे फिर से समझा सकते हैं?",
        "Use it when the first explanation was not clear.",
        [
          [
            "Ravi",
            "Could you explain it again?",
            "क्या आप इसे फिर से समझा सकते हैं?",
          ],
          [
            "Meera",
            "Of course, I will go slowly.",
            "ज़रूर, मैं धीरे समझाता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-call-a-doctor-it-is-urgent",
        "Please call a doctor, it is urgent.",
        "कृपया डॉक्टर को बुलाइए, यह ज़रूरी है।",
        "Use it in a real emergency to get urgent help.",
        [
          [
            "Ravi",
            "Please call a doctor, it is urgent.",
            "कृपया डॉक्टर को बुलाइए, यह ज़रूरी है।",
          ],
          ["Meera", "I am calling now.", "मैं अभी फ़ोन कर रहा हूँ।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "asking-for-help-at-the-bank",
        "Asking for help at the bank",
        {
          en: "A customer asks a clerk for help.",
          hi: "एक ग्राहक क्लर्क से मदद माँगता है।",
        },
        [
          [
            "Kiran",
            "Excuse me. I need some help with this form.",
            "सुनिए। मुझे इस फ़ॉर्म में कुछ मदद चाहिए।",
          ],
          [
            "Clerk",
            "Of course. What do you not understand?",
            "ज़रूर। आपको क्या समझ नहीं आ रहा?",
          ],
          [
            "Kiran",
            "I do not understand this word.",
            "मुझे यह शब्द समझ नहीं आ रहा।",
          ],
          [
            "Clerk",
            "It means your home address.",
            "इसका मतलब आपके घर का पता है।",
          ],
          [
            "Kiran",
            "Thank you. That is very kind of you.",
            "धन्यवाद। यह आपकी बड़ी कृपा है।",
          ],
        ]
      ),
    ],
  },
])
