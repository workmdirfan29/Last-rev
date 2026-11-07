import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "at-home",
    title: "At home",
    titleHi: "घर पर",
    goal: "Talk about everyday things at home.",
    items: [
      sent(
        "please-switch-off-the-fan",
        "Please switch off the fan.",
        "कृपया पंखा बंद कर दीजिए।",
        "Use it to ask someone to turn off a fan or light.",
        [
          ["Ravi", "Please switch off the fan.", "कृपया पंखा बंद कर दीजिए।"],
          ["Meera", "Sure, I will do it.", "ज़रूर, मैं कर देता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "dinner-will-be-ready-in-ten-minutes",
        "Dinner will be ready in ten minutes.",
        "रात का खाना दस मिनट में तैयार हो जाएगा।",
        "Use it to tell the family when to come to eat.",
        [
          ["Meera", "I am hungry.", "मुझे भूख लगी है।"],
          [
            "Ravi",
            "Dinner will be ready in ten minutes.",
            "रात का खाना दस मिनट में तैयार हो जाएगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-you-help-me-in-the-kitchen",
        "Can you help me in the kitchen?",
        "क्या आप रसोई में मेरी मदद कर सकते हैं?",
        "Use it to ask a family member for help with cooking.",
        [
          [
            "Ravi",
            "Can you help me in the kitchen?",
            "क्या आप रसोई में मेरी मदद कर सकते हैं?",
          ],
          [
            "Meera",
            "Of course, what should I do?",
            "ज़रूर, मुझे क्या करना है?",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-close-the-window",
        "Please close the window.",
        "कृपया खिड़की बंद कर दीजिए।",
        "Use it when it is cold, dusty or raining.",
        [
          ["Meera", "It is getting cold.", "ठंड हो रही है।"],
          ["Ravi", "Please close the window.", "कृपया खिड़की बंद कर दीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "who-is-at-the-door",
        "Who is at the door?",
        "दरवाज़े पर कौन है?",
        "Use it when you hear the bell or a knock.",
        [
          ["Ravi", "Who is at the door?", "दरवाज़े पर कौन है?"],
          ["Meera", "It is the postman.", "डाकिया है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-going-to-wash-the-clothes",
        "I am going to wash the clothes.",
        "मैं कपड़े धोने जा रही हूँ।",
        "Use it to say what chore you will do next.",
        [
          ["Meera", "What are you doing today?", "आज आप क्या कर रही हैं?"],
          [
            "Ravi",
            "I am going to wash the clothes.",
            "मैं कपड़े धोने जा रही हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "the-children-are-doing-their-homework",
        "The children are doing their homework.",
        "बच्चे अपना गृहकार्य कर रहे हैं।",
        "Use it to say what the children are busy with.",
        [
          ["Meera", "Where are the children?", "बच्चे कहाँ हैं?"],
          [
            "Ravi",
            "The children are doing their homework.",
            "बच्चे अपना गृहकार्य कर रहे हैं।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-us-watch-a-film-tonight",
        "Let us watch a film tonight.",
        "चलिए आज रात एक फ़िल्म देखें।",
        "Use it to suggest a family plan for the evening.",
        [
          [
            "Ravi",
            "Let us watch a film tonight.",
            "चलिए आज रात एक फ़िल्म देखें।",
          ],
          ["Meera", "That sounds like a good idea.", "यह अच्छा विचार लगता है।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "dinner-at-home",
        "Dinner at home",
        {
          en: "A family gets ready for dinner.",
          hi: "एक परिवार रात के खाने की तैयारी करता है।",
        },
        [
          [
            "Asha",
            "Can you help me in the kitchen?",
            "क्या आप रसोई में मेरी मदद कर सकते हैं?",
          ],
          [
            "Kiran",
            "Of course. What should I do?",
            "ज़रूर। मुझे क्या करना है?",
          ],
          [
            "Asha",
            "Please close the window. It is cold.",
            "कृपया खिड़की बंद कर दीजिए। ठंड है।",
          ],
          [
            "Kiran",
            "Done. Dinner will be ready soon.",
            "हो गया। खाना जल्दी तैयार हो जाएगा।",
          ],
          [
            "Asha",
            "Yes, call the children to the table.",
            "हाँ, बच्चों को मेज़ पर बुला लीजिए।",
          ],
        ]
      ),
    ],
  },
])
