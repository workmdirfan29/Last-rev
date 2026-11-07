import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "giving-answers",
    title: "Giving answers",
    titleHi: "जवाब देना",
    goal: "Answer questions clearly and honestly.",
    items: [
      sent(
        "yes-of-course",
        "Yes, of course.",
        "हाँ, बिल्कुल।",
        "Use it to agree to a request.",
        [
          ["Meera", "Can you help me?", "क्या आप मेरी मदद कर सकते हैं?"],
          ["Ravi", "Yes, of course.", "हाँ, बिल्कुल।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "no-i-do-not-think-so",
        "No, I do not think so.",
        "नहीं, मुझे ऐसा नहीं लगता।",
        "Use it to disagree politely.",
        [
          ["Meera", "Is the shop open today?", "क्या दुकान आज खुली है?"],
          ["Ravi", "No, I do not think so.", "नहीं, मुझे ऐसा नहीं लगता।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-not-sure-but-i-will",
        "I am not sure, but I will find out.",
        "मुझे पक्का नहीं पता, पर मैं पता कर लूँगा।",
        "Use it when you do not know and promise to check.",
        [
          ["Meera", "When does the class start?", "कक्षा कब शुरू होती है?"],
          [
            "Ravi",
            "I am not sure, but I will find out.",
            "मुझे पक्का नहीं पता, पर मैं पता कर लूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "that-is-correct",
        "That is correct.",
        "यह सही है।",
        "Use it to confirm that someone is right.",
        [
          ["Meera", "The meeting is at ten, right?", "बैठक दस बजे है, है ना?"],
          ["Ravi", "That is correct.", "यह सही है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-do-not-know-the-answer",
        "I do not know the answer.",
        "मुझे जवाब नहीं पता।",
        "Use it honestly when you cannot answer.",
        [
          [
            "Meera",
            "What is the capital of Kenya?",
            "केन्या की राजधानी क्या है?",
          ],
          ["Ravi", "I do not know the answer.", "मुझे जवाब नहीं पता।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "maybe-we-can-try-again-tomorrow",
        "Maybe we can try again tomorrow.",
        "शायद हम कल फिर कोशिश कर सकते हैं।",
        "Use it to suggest another attempt.",
        [
          ["Meera", "It is too late today.", "आज बहुत देर हो गई है।"],
          [
            "Ravi",
            "Maybe we can try again tomorrow.",
            "शायद हम कल फिर कोशिश कर सकते हैं।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-depends-on-the-time",
        "It depends on the time.",
        "यह समय पर निर्भर करता है।",
        "Use it when the answer changes with the situation.",
        [
          [
            "Meera",
            "Can you come on Friday?",
            "क्या आप शुक्रवार को आ सकते हैं?",
          ],
          ["Ravi", "It depends on the time.", "यह समय पर निर्भर करता है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-let-you-know-by-evening",
        "I will let you know by evening.",
        "मैं आपको शाम तक बता दूँगा।",
        "Use it to promise an answer later.",
        [
          [
            "Meera",
            "Can you confirm the plan?",
            "क्या आप योजना पक्की कर सकते हैं?",
          ],
          [
            "Ravi",
            "I will let you know by evening.",
            "मैं आपको शाम तक बता दूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "answering-a-friend",
        "Answering a friend",
        {
          en: "A friend asks about a plan.",
          hi: "एक दोस्त एक योजना के बारे में पूछता है।",
        },
        [
          [
            "Asha",
            "Can you come to the market tomorrow?",
            "क्या आप कल बाज़ार आ सकते हैं?",
          ],
          ["Ravi", "It depends on the time.", "यह समय पर निर्भर करता है।"],
          ["Asha", "We will go in the evening.", "हम शाम को जाएँगे।"],
          [
            "Ravi",
            "I am not sure, but I will find out.",
            "मुझे पक्का नहीं पता, पर मैं पता कर लूँगा।",
          ],
          [
            "Asha",
            "Please let me know by evening.",
            "कृपया मुझे शाम तक बता दीजिए।",
          ],
        ]
      ),
    ],
  },
])
