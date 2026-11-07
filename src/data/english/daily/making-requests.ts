import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "making-requests",
    title: "Making requests",
    titleHi: "अनुरोध करना",
    goal: "Ask for things politely.",
    items: [
      sent(
        "could-you-please-open-the-window",
        "Could you please open the window?",
        "क्या आप कृपया खिड़की खोल देंगे?",
        "Use it to ask politely for a small favour.",
        [
          [
            "Ravi",
            "Could you please open the window?",
            "क्या आप कृपया खिड़की खोल देंगे?",
          ],
          ["Meera", "Sure, I will open it.", "ज़रूर, मैं खोल देता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-you-pass-me-the-salt",
        "Can you pass me the salt?",
        "क्या आप मुझे नमक दे सकते हैं?",
        "Use it at the table to ask for something.",
        [
          [
            "Ravi",
            "Can you pass me the salt?",
            "क्या आप मुझे नमक दे सकते हैं?",
          ],
          ["Meera", "Here you are.", "यह लीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "may-i-use-your-phone",
        "May I use your phone?",
        "क्या मैं आपका फ़ोन इस्तेमाल कर सकता हूँ?",
        "Use it to ask permission before you borrow something.",
        [
          [
            "Ravi",
            "May I use your phone?",
            "क्या मैं आपका फ़ोन इस्तेमाल कर सकता हूँ?",
          ],
          ["Meera", "Yes, go ahead.", "हाँ, कर लीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "would-you-mind-waiting-a-minute",
        "Would you mind waiting a minute?",
        "क्या आप एक मिनट रुक सकेंगे?",
        "Use it to ask someone politely to wait.",
        [
          [
            "Ravi",
            "Would you mind waiting a minute?",
            "क्या आप एक मिनट रुक सकेंगे?",
          ],
          ["Meera", "No problem.", "कोई बात नहीं।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-speak-a-little-slower",
        "Please speak a little slower.",
        "कृपया थोड़ा धीरे बोलिए।",
        "Use it when someone speaks too fast for you.",
        [
          ["Meera", "The meeting starts at ten.", "बैठक दस बजे शुरू होगी।"],
          ["Ravi", "Please speak a little slower.", "कृपया थोड़ा धीरे बोलिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-repeat-that-please",
        "Could you repeat that, please?",
        "क्या आप कृपया उसे दोहरा सकते हैं?",
        "Use it when you did not hear or understand.",
        [
          [
            "Ravi",
            "Could you repeat that, please?",
            "क्या आप कृपया उसे दोहरा सकते हैं?",
          ],
          [
            "Meera",
            "Of course. The meeting is at ten.",
            "ज़रूर। बैठक दस बजे है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-give-me-a-glass-of-water",
        "Please give me a glass of water.",
        "कृपया मुझे एक गिलास पानी दीजिए।",
        "Use it to ask for water at home or in a restaurant.",
        [
          [
            "Ravi",
            "Please give me a glass of water.",
            "कृपया मुझे एक गिलास पानी दीजिए।",
          ],
          ["Meera", "Here is your water.", "यह लीजिए आपका पानी।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-i-have-the-bill-please",
        "Can I have the bill, please?",
        "क्या मुझे बिल मिल सकता है?",
        "Use it in a restaurant when you finish eating.",
        [
          [
            "Ravi",
            "Can I have the bill, please?",
            "क्या मुझे बिल मिल सकता है?",
          ],
          ["Meera", "Yes, I will bring it now.", "जी, मैं अभी लाता हूँ।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "at-a-restaurant",
        "At a restaurant",
        {
          en: "A customer makes polite requests.",
          hi: "एक ग्राहक विनम्रता से अनुरोध करता है।",
        },
        [
          [
            "Meera",
            "Excuse me. Could you please bring a glass of water?",
            "सुनिए। क्या आप कृपया एक गिलास पानी ला सकते हैं?",
          ],
          ["Waiter", "Certainly. Here you are.", "ज़रूर। यह लीजिए।"],
          [
            "Meera",
            "Could you repeat the name of this dish?",
            "क्या आप इस व्यंजन का नाम दोहरा सकते हैं?",
          ],
          ["Waiter", "It is vegetable rice.", "यह सब्ज़ी वाले चावल हैं।"],
          [
            "Meera",
            "Thank you. Can I have the bill, please?",
            "धन्यवाद। क्या मुझे बिल मिल सकता है?",
          ],
        ]
      ),
    ],
  },
])
