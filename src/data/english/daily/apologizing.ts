import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "apologizing",
    title: "Apologizing",
    titleHi: "माफ़ी माँगना",
    goal: "Say sorry in a sincere and polite way.",
    items: [
      sent(
        "i-am-sorry-for-being-late",
        "I am sorry for being late.",
        "देर से आने के लिए मैं क्षमा चाहता हूँ।",
        "Use it when you arrive after the agreed time.",
        [
          [
            "Ravi",
            "I am sorry for being late.",
            "देर से आने के लिए मैं क्षमा चाहता हूँ।",
          ],
          [
            "Meera",
            "That is all right. Please sit.",
            "कोई बात नहीं। कृपया बैठिए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "sorry-i-made-a-mistake",
        "Sorry, I made a mistake.",
        "क्षमा कीजिए, मुझसे गलती हो गई।",
        "Use it to admit an error at once.",
        [
          [
            "Ravi",
            "Sorry, I made a mistake.",
            "क्षमा कीजिए, मुझसे गलती हो गई।",
          ],
          ["Meera", "Please correct it.", "कृपया इसे सुधार दीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-forgive-me",
        "Please forgive me.",
        "कृपया मुझे माफ़ कर दीजिए।",
        "Use it for a more serious apology.",
        [
          ["Ravi", "Please forgive me.", "कृपया मुझे माफ़ कर दीजिए।"],
          ["Meera", "It is fine. Do not worry.", "ठीक है। चिंता मत कीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-did-not-mean-to-hurt-you",
        "I did not mean to hurt you.",
        "मेरा आपको दुख पहुँचाने का इरादा नहीं था।",
        "Use it when your words or actions upset someone.",
        [
          ["Meera", "That comment hurt me.", "उस बात से मुझे दुख हुआ।"],
          [
            "Ravi",
            "I did not mean to hurt you.",
            "मेरा आपको दुख पहुँचाने का इरादा नहीं था।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "excuse-me-for-a-moment",
        "Excuse me for a moment.",
        "मुझे एक क्षण के लिए क्षमा कीजिए।",
        "Use it when you must leave a talk briefly.",
        [
          [
            "Ravi",
            "Excuse me for a moment.",
            "मुझे एक क्षण के लिए क्षमा कीजिए।",
          ],
          ["Meera", "Sure, take your time.", "ज़रूर, आराम से जाइए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-apologise-for-the-trouble",
        "I apologise for the trouble.",
        "असुविधा के लिए मैं क्षमा चाहता हूँ।",
        "Use it in a formal situation after causing a problem.",
        [
          [
            "Ravi",
            "I apologise for the trouble.",
            "असुविधा के लिए मैं क्षमा चाहता हूँ।",
          ],
          ["Meera", "Thank you for telling me.", "बताने के लिए धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-was-my-fault",
        "It was my fault.",
        "यह मेरी गलती थी।",
        "Use it to take responsibility.",
        [
          ["Meera", "Why did the file get deleted?", "फ़ाइल क्यों मिट गई?"],
          ["Ravi", "It was my fault.", "यह मेरी गलती थी।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-be-more-careful-next-time",
        "I will be more careful next time.",
        "मैं अगली बार और ध्यान रखूँगा।",
        "Use it to promise to do better.",
        [
          [
            "Meera",
            "Please check your work first.",
            "कृपया पहले अपना काम जाँच लीजिए।",
          ],
          [
            "Ravi",
            "I will be more careful next time.",
            "मैं अगली बार और ध्यान रखूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "saying-sorry-for-a-delay",
        "Saying sorry for a delay",
        {
          en: "A colleague arrives late.",
          hi: "एक सहकर्मी देर से पहुँचता है।",
        },
        [
          [
            "Ravi",
            "I am sorry for being late.",
            "देर से आने के लिए मैं क्षमा चाहता हूँ।",
          ],
          [
            "Meera",
            "That is all right. What happened?",
            "कोई बात नहीं। क्या हुआ?",
          ],
          [
            "Ravi",
            "The bus was late. I apologise for the trouble.",
            "बस देर से आई। असुविधा के लिए मैं क्षमा चाहता हूँ।",
          ],
          [
            "Meera",
            "Please sit. We have just started.",
            "कृपया बैठिए। हमने अभी शुरू किया है।",
          ],
          [
            "Ravi",
            "Thank you. I will be on time next time.",
            "धन्यवाद। मैं अगली बार समय पर आऊँगा।",
          ],
        ]
      ),
    ],
  },
])
