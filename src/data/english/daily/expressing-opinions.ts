import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "expressing-opinions",
    title: "Expressing opinions",
    titleHi: "अपनी राय रखना",
    goal: "Share what you think in a polite way.",
    items: [
      sent(
        "i-think-this-is-a-good-plan",
        "I think this is a good plan.",
        "मुझे लगता है कि यह एक अच्छी योजना है।",
        "Use it to give a simple opinion.",
        [
          [
            "Ravi",
            "I think this is a good plan.",
            "मुझे लगता है कि यह एक अच्छी योजना है।",
          ],
          ["Meera", "I think so too.", "मुझे भी ऐसा लगता है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "in-my-opinion-we-should-start-early",
        "In my opinion, we should start early.",
        "मेरी राय में, हमें जल्दी शुरू करना चाहिए।",
        "Use it to give a reasoned suggestion.",
        [
          [
            "Ravi",
            "In my opinion, we should start early.",
            "मेरी राय में, हमें जल्दी शुरू करना चाहिए।",
          ],
          ["Meera", "That makes sense.", "यह ठीक लगता है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-agree-with-you",
        "I agree with you.",
        "मैं आपसे सहमत हूँ।",
        "Use it to show that you share someone's view.",
        [
          ["Meera", "We need more time.", "हमें और समय चाहिए।"],
          ["Ravi", "I agree with you.", "मैं आपसे सहमत हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-see-it-differently",
        "I see it differently.",
        "मैं इसे अलग तरह से देखता हूँ।",
        "Use it to disagree without being rude.",
        [
          ["Meera", "This is the best option.", "यह सबसे अच्छा विकल्प है।"],
          ["Ravi", "I see it differently.", "मैं इसे अलग तरह से देखता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-not-sure-that-is-right",
        "I am not sure that is right.",
        "मुझे पक्का नहीं है कि यह सही है।",
        "Use it to doubt something politely.",
        [
          ["Meera", "The shop closes at five.", "दुकान पाँच बजे बंद होती है।"],
          [
            "Ravi",
            "I am not sure that is right.",
            "मुझे पक्का नहीं है कि यह सही है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "that-is-a-fair-point",
        "That is a fair point.",
        "यह एक उचित बात है।",
        "Use it to accept a good argument.",
        [
          [
            "Meera",
            "It will cost less if we wait.",
            "अगर हम रुकें तो खर्च कम होगा।",
          ],
          ["Ravi", "That is a fair point.", "यह एक उचित बात है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-would-prefer-the-second-option",
        "I would prefer the second option.",
        "मैं दूसरा विकल्प पसंद करूँगा।",
        "Use it to choose between two things.",
        [
          ["Meera", "Which option do you like?", "आपको कौन सा विकल्प पसंद है?"],
          [
            "Ravi",
            "I would prefer the second option.",
            "मैं दूसरा विकल्प पसंद करूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-do-you-think",
        "What do you think?",
        "आप क्या सोचते हैं?",
        "Use it to ask for someone else's opinion.",
        [
          ["Ravi", "What do you think?", "आप क्या सोचते हैं?"],
          [
            "Meera",
            "I think it is a good idea.",
            "मुझे यह अच्छा विचार लगता है।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "choosing-a-plan",
        "Choosing a plan",
        {
          en: "Two colleagues discuss a plan.",
          hi: "दो सहकर्मी एक योजना पर चर्चा करते हैं।",
        },
        [
          [
            "Ravi",
            "I think we should start early. What do you think?",
            "मुझे लगता है कि हमें जल्दी शुरू करना चाहिए। आप क्या सोचते हैं?",
          ],
          [
            "Meera",
            "I see it differently. We need more time to plan.",
            "मैं इसे अलग तरह से देखती हूँ। हमें योजना बनाने के लिए और समय चाहिए।",
          ],
          ["Ravi", "That is a fair point.", "यह एक उचित बात है।"],
          [
            "Meera",
            "I would prefer to begin next week.",
            "मैं अगले हफ़्ते शुरू करना पसंद करूँगी।",
          ],
          [
            "Ravi",
            "I agree with you. Let us do that.",
            "मैं आपसे सहमत हूँ। चलिए ऐसा ही करते हैं।",
          ],
        ]
      ),
    ],
  },
])
