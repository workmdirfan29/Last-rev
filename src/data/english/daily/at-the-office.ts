import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Module 2: Daily Use English. Draft content: not yet reviewed by an English teacher.
export default defineLessons("daily", [
  {
    slug: "at-the-office",
    title: "At the office",
    titleHi: "दफ़्तर में",
    goal: "Handle common talk with colleagues at work.",
    items: [
      sent(
        "good-morning-everyone",
        "Good morning, everyone.",
        "सभी को सुप्रभात।",
        "Use it to greet a group when you enter the room.",
        [
          ["Ravi", "Good morning, everyone.", "सभी को सुप्रभात।"],
          ["Meera", "Good morning.", "सुप्रभात।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "is-the-meeting-at-eleven",
        "Is the meeting at eleven?",
        "क्या बैठक ग्यारह बजे है?",
        "Use it to check the time of a meeting.",
        [
          ["Ravi", "Is the meeting at eleven?", "क्या बैठक ग्यारह बजे है?"],
          ["Meera", "Yes, in the main room.", "हाँ, मुख्य कमरे में।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-send-you-the-file-by",
        "I will send you the file by email.",
        "मैं आपको फ़ाइल ईमेल से भेज दूँगा।",
        "Use it to promise that you will share a document.",
        [
          [
            "Meera",
            "Can you share the report?",
            "क्या आप रिपोर्ट भेज सकते हैं?",
          ],
          [
            "Ravi",
            "I will send you the file by email.",
            "मैं आपको फ़ाइल ईमेल से भेज दूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-please-check-this-report",
        "Could you please check this report?",
        "क्या आप कृपया यह रिपोर्ट देख लेंगे?",
        "Use it to ask a colleague to review your work.",
        [
          [
            "Ravi",
            "Could you please check this report?",
            "क्या आप कृपया यह रिपोर्ट देख लेंगे?",
          ],
          ["Meera", "Yes, I will check it today.", "हाँ, मैं आज देख लूँगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-working-on-it-now",
        "I am working on it now.",
        "मैं अभी उस पर काम कर रहा हूँ।",
        "Use it to tell someone that your task is in progress.",
        [
          ["Meera", "How is the task going?", "काम कैसा चल रहा है?"],
          ["Ravi", "I am working on it now.", "मैं अभी उस पर काम कर रहा हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-need-a-little-more-time",
        "I need a little more time.",
        "मुझे थोड़ा और समय चाहिए।",
        "Use it politely when you cannot finish on time.",
        [
          ["Meera", "Is the work ready?", "क्या काम तैयार है?"],
          ["Ravi", "I need a little more time.", "मुझे थोड़ा और समय चाहिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "the-printer-is-not-working",
        "The printer is not working.",
        "प्रिंटर काम नहीं कर रहा है।",
        "Use it to report a problem with office equipment.",
        [
          [
            "Ravi",
            "The printer is not working.",
            "प्रिंटर काम नहीं कर रहा है।",
          ],
          [
            "Meera",
            "I will call the technician.",
            "मैं तकनीशियन को बुला लेता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-us-talk-after-lunch",
        "Let us talk after lunch.",
        "चलिए दोपहर के खाने के बाद बात करते हैं।",
        "Use it to move a talk to a later time.",
        [
          ["Meera", "Do you have a minute?", "क्या आपके पास एक मिनट है?"],
          [
            "Ravi",
            "Let us talk after lunch.",
            "चलिए दोपहर के खाने के बाद बात करते हैं।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-short-office-talk",
        "A short office talk",
        {
          en: "Two colleagues talk about a report.",
          hi: "दो सहकर्मी एक रिपोर्ट के बारे में बात करते हैं।",
        },
        [
          [
            "Ravi",
            "Good morning, Meera. Is the report ready?",
            "सुप्रभात, मीरा। क्या रिपोर्ट तैयार है?",
          ],
          ["Meera", "I am working on it now.", "मैं अभी उस पर काम कर रही हूँ।"],
          [
            "Ravi",
            "Could you please check it again?",
            "क्या आप कृपया इसे फिर से देख लेंगी?",
          ],
          [
            "Meera",
            "Yes. I will send it by email.",
            "हाँ। मैं इसे ईमेल से भेज दूँगी।",
          ],
          [
            "Ravi",
            "Thank you. Let us meet at eleven.",
            "धन्यवाद। चलिए ग्यारह बजे मिलते हैं।",
          ],
        ]
      ),
    ],
  },
])
