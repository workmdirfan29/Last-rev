import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Draft content: not yet reviewed by an English teacher.
export default defineLessons("professional", [
  {
    slug: "introducing-yourself",
    title: "Introducing yourself",
    titleHi: "अपना परिचय देना",
    goal: "Introduce yourself at work in a clear, friendly way.",
    items: [
      sent(
        "let-me-introduce-myself",
        "Let me introduce myself.",
        "मुझे अपना परिचय देने दीजिए।",
        "Use it to begin a short introduction.",
        [
          ["Ravi", "Let me introduce myself.", "मुझे अपना परिचय देने दीजिए।"],
          ["Meera", "Please go ahead.", "कृपया बताइए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-a-software-developer",
        "I am a software developer.",
        "मैं एक सॉफ़्टवेयर डेवलपर हूँ।",
        "Use it to say what your job is.",
        [
          ["Meera", "What do you do?", "आप क्या करते हैं?"],
          [
            "Ravi",
            "I am a software developer.",
            "मैं एक सॉफ़्टवेयर डेवलपर हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-work-on-web-applications",
        "I work on web applications.",
        "मैं वेब एप्लिकेशन पर काम करता हूँ।",
        "Use it to describe the kind of work you do.",
        [
          ["Meera", "What kind of work is it?", "यह किस तरह का काम है?"],
          [
            "Ravi",
            "I work on web applications.",
            "मैं वेब एप्लिकेशन पर काम करता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-have-been-in-this-field-for",
        "I have been in this field for a few years.",
        "मैं कुछ वर्षों से इस क्षेत्र में हूँ।",
        "Use it to talk about your time in the field.",
        [
          [
            "Meera",
            "How long have you worked?",
            "आप कितने समय से काम कर रहे हैं?",
          ],
          [
            "Ravi",
            "I have been in this field for a few years.",
            "मैं कुछ वर्षों से इस क्षेत्र में हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-enjoy-solving-problems-with-code",
        "I enjoy solving problems with code.",
        "मुझे कोड से समस्याएँ सुलझाना पसंद है।",
        "Use it to say what you like about your work.",
        [
          ["Meera", "What do you like about it?", "आपको इसमें क्या पसंद है?"],
          [
            "Ravi",
            "I enjoy solving problems with code.",
            "मुझे कोड से समस्याएँ सुलझाना पसंद है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-is-nice-to-meet-you",
        "It is nice to meet you.",
        "आपसे मिलकर अच्छा लगा।",
        "Use it as a polite greeting at a first meeting.",
        [
          ["Ravi", "It is nice to meet you.", "आपसे मिलकर अच्छा लगा।"],
          ["Meera", "Nice to meet you too.", "आपसे मिलकर मुझे भी अच्छा लगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-look-forward-to-working-with-you",
        "I look forward to working with you.",
        "मैं आपके साथ काम करने की प्रतीक्षा में हूँ।",
        "Use it to end an introduction warmly.",
        [
          [
            "Ravi",
            "I look forward to working with you.",
            "मैं आपके साथ काम करने की प्रतीक्षा में हूँ।",
          ],
          ["Meera", "We are glad to have you.", "आपके आने से हमें खुशी है।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "meeting-the-new-team",
        "Meeting the new team",
        {
          en: "A new developer meets the team.",
          hi: "एक नया डेवलपर टीम से मिलता है।",
        },
        [
          [
            "Meera",
            "Welcome to the team. Please introduce yourself.",
            "टीम में स्वागत है। कृपया अपना परिचय दीजिए।",
          ],
          [
            "Ravi",
            "Thank you. I am a software developer.",
            "धन्यवाद। मैं एक सॉफ़्टवेयर डेवलपर हूँ।",
          ],
          [
            "Ravi",
            "I enjoy solving problems with code.",
            "मुझे कोड से समस्याएँ सुलझाना पसंद है।",
          ],
          [
            "Meera",
            "That is great. We have many interesting tasks.",
            "बहुत बढ़िया। हमारे पास कई दिलचस्प काम हैं।",
          ],
          [
            "Ravi",
            "I look forward to working with you.",
            "मैं आपके साथ काम करने की प्रतीक्षा में हूँ।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "talking-about-experience",
    title: "Talking about your experience",
    titleHi: "अपने अनुभव के बारे में बताना",
    goal: "Describe your work experience honestly and simply.",
    items: [
      sent(
        "i-have-experience-in-web-development",
        "I have experience in web development.",
        "मुझे वेब डेवलपमेंट का अनुभव है।",
        "Use it to state the area you have worked in.",
        [
          ["Meera", "What is your background?", "आपकी पृष्ठभूमि क्या है?"],
          [
            "Ravi",
            "I have experience in web development.",
            "मुझे वेब डेवलपमेंट का अनुभव है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-worked-in-a-small-team",
        "I worked in a small team.",
        "मैंने एक छोटी टीम में काम किया।",
        "Use it to describe the size of your team.",
        [
          ["Meera", "Did you work alone?", "क्या आपने अकेले काम किया?"],
          [
            "Ravi",
            "I worked in a small team.",
            "मैंने एक छोटी टीम में काम किया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "my-main-responsibility-was-building-features",
        "My main responsibility was building features.",
        "मेरी मुख्य ज़िम्मेदारी नई सुविधाएँ बनाना थी।",
        "Use it to say what your main task was.",
        [
          ["Meera", "What was your role?", "आपकी भूमिका क्या थी?"],
          [
            "Ravi",
            "My main responsibility was building features.",
            "मेरी मुख्य ज़िम्मेदारी नई सुविधाएँ बनाना थी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-learned-a-lot-from-that-project",
        "I learned a lot from that project.",
        "मैंने उस प्रोजेक्ट से बहुत कुछ सीखा।",
        "Use it to talk about what you gained.",
        [
          ["Meera", "How was the project?", "प्रोजेक्ट कैसा रहा?"],
          [
            "Ravi",
            "I learned a lot from that project.",
            "मैंने उस प्रोजेक्ट से बहुत कुछ सीखा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-also-helped-new-team-members",
        "I also helped new team members.",
        "मैंने नए टीम सदस्यों की भी मदद की।",
        "Use it to show that you supported others.",
        [
          ["Meera", "Did you do anything else?", "क्या आपने कुछ और भी किया?"],
          [
            "Ravi",
            "I also helped new team members.",
            "मैंने नए टीम सदस्यों की भी मदद की।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "in-my-last-role-i-worked-on",
        "In my last role, I worked on customer applications.",
        "अपनी पिछली भूमिका में मैंने ग्राहकों के एप्लिकेशन पर काम किया।",
        "Use it to describe your most recent job.",
        [
          [
            "Meera",
            "Where did you work last?",
            "आपने पिछली बार कहाँ काम किया?",
          ],
          [
            "Ravi",
            "In my last role, I worked on customer applications.",
            "अपनी पिछली भूमिका में मैंने ग्राहकों के एप्लिकेशन पर काम किया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-comfortable-learning-new-tools",
        "I am comfortable learning new tools.",
        "मुझे नए टूल सीखने में कोई दिक्कत नहीं होती।",
        "Use it to show that you can adapt.",
        [
          ["Meera", "Can you learn new tools?", "क्या आप नए टूल सीख सकते हैं?"],
          [
            "Ravi",
            "I am comfortable learning new tools.",
            "मुझे नए टूल सीखने में कोई दिक्कत नहीं होती।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "describing-your-last-job",
        "Describing your last job",
        {
          en: "An interviewer asks about past work.",
          hi: "एक इंटरव्यूअर पिछले काम के बारे में पूछता है।",
        },
        [
          [
            "Interviewer",
            "Can you tell me about your experience?",
            "क्या आप अपने अनुभव के बारे में बता सकते हैं?",
          ],
          [
            "Ravi",
            "I have experience in web development.",
            "मुझे वेब डेवलपमेंट का अनुभव है।",
          ],
          [
            "Interviewer",
            "What was your main responsibility?",
            "आपकी मुख्य ज़िम्मेदारी क्या थी?",
          ],
          [
            "Ravi",
            "My main responsibility was building features.",
            "मेरी मुख्य ज़िम्मेदारी नई सुविधाएँ बनाना थी।",
          ],
          [
            "Interviewer",
            "Thank you. That is clear.",
            "धन्यवाद। यह स्पष्ट है।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "explaining-projects",
    title: "Explaining a project",
    titleHi: "प्रोजेक्ट समझाना",
    goal: "Explain what a project does and what you did in it.",
    items: [
      sent(
        "this-project-helps-people-manage-their-tasks",
        "This project helps people manage their tasks.",
        "यह प्रोजेक्ट लोगों को अपने काम सँभालने में मदद करता है।",
        "Use it to say what a project is for.",
        [
          [
            "Meera",
            "What is this project about?",
            "यह प्रोजेक्ट किस बारे में है?",
          ],
          [
            "Ravi",
            "This project helps people manage their tasks.",
            "यह प्रोजेक्ट लोगों को अपने काम सँभालने में मदद करता है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-built-the-login-page-and-the",
        "I built the login page and the dashboard.",
        "मैंने लॉगिन पेज और डैशबोर्ड बनाया।",
        "Use it to say which parts you made.",
        [
          ["Meera", "What did you build?", "आपने क्या बनाया?"],
          [
            "Ravi",
            "I built the login page and the dashboard.",
            "मैंने लॉगिन पेज और डैशबोर्ड बनाया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "we-used-a-database-to-store-the",
        "We used a database to store the data.",
        "हमने डेटा रखने के लिए एक डेटाबेस इस्तेमाल किया।",
        "Use it to describe how data was stored.",
        [
          ["Meera", "Where is the data kept?", "डेटा कहाँ रखा जाता है?"],
          [
            "Ravi",
            "We used a database to store the data.",
            "हमने डेटा रखने के लिए एक डेटाबेस इस्तेमाल किया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "the-main-challenge-was-slow-loading",
        "The main challenge was slow loading.",
        "मुख्य चुनौती धीमा लोड होना थी।",
        "Use it to describe a problem you faced.",
        [
          ["Meera", "Was there any difficulty?", "क्या कोई कठिनाई थी?"],
          [
            "Ravi",
            "The main challenge was slow loading.",
            "मुख्य चुनौती धीमा लोड होना थी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "we-fixed-it-by-reducing-the-data",
        "We fixed it by reducing the data size.",
        "हमने डेटा का आकार घटाकर इसे ठीक किया।",
        "Use it to explain how a problem was solved.",
        [
          ["Meera", "How did you solve it?", "आपने इसे कैसे सुलझाया?"],
          [
            "Ravi",
            "We fixed it by reducing the data size.",
            "हमने डेटा का आकार घटाकर इसे ठीक किया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "the-project-was-delivered-on-time",
        "The project was delivered on time.",
        "प्रोजेक्ट समय पर पूरा हुआ।",
        "Use it to report a successful delivery.",
        [
          ["Meera", "Did you finish on time?", "क्या आपने समय पर पूरा किया?"],
          [
            "Ravi",
            "The project was delivered on time.",
            "प्रोजेक्ट समय पर पूरा हुआ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-would-like-to-show-you-how",
        "I would like to show you how it works.",
        "मैं आपको दिखाना चाहूँगा कि यह कैसे काम करता है।",
        "Use it to offer a short demonstration.",
        [
          [
            "Ravi",
            "I would like to show you how it works.",
            "मैं आपको दिखाना चाहूँगा कि यह कैसे काम करता है।",
          ],
          ["Meera", "Yes, please show me.", "हाँ, कृपया दिखाइए।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-project-walkthrough",
        "A project walkthrough",
        {
          en: "A developer explains a project.",
          hi: "एक डेवलपर एक प्रोजेक्ट समझाता है।",
        },
        [
          [
            "Manager",
            "Please tell me about this project.",
            "कृपया मुझे इस प्रोजेक्ट के बारे में बताइए।",
          ],
          [
            "Ravi",
            "This project helps people manage their tasks.",
            "यह प्रोजेक्ट लोगों को अपने काम सँभालने में मदद करता है।",
          ],
          ["Manager", "What did you build?", "आपने क्या बनाया?"],
          [
            "Ravi",
            "I built the login page and the dashboard.",
            "मैंने लॉगिन पेज और डैशबोर्ड बनाया।",
          ],
          [
            "Manager",
            "Thank you. I would like to see it.",
            "धन्यवाद। मैं उसे देखना चाहूँगा।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "explaining-technical-concepts",
    title: "Explaining technical ideas simply",
    titleHi: "तकनीकी बातें आसान भाषा में समझाना",
    goal: "Explain a technical idea to someone who is not an expert.",
    items: [
      sent(
        "an-api-lets-two-programs-talk-to",
        "An API lets two programs talk to each other.",
        "एक एपीआई दो प्रोग्रामों को आपस में बात करने देता है।",
        "Use it to explain what an API is.",
        [
          ["Meera", "What is an API?", "एपीआई क्या होता है?"],
          [
            "Ravi",
            "An API lets two programs talk to each other.",
            "एक एपीआई दो प्रोग्रामों को आपस में बात करने देता है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "a-database-stores-information-in-an-organised",
        "A database stores information in an organised way.",
        "डेटाबेस जानकारी को व्यवस्थित ढंग से रखता है।",
        "Use it to explain what a database is.",
        [
          ["Meera", "What is a database?", "डेटाबेस क्या होता है?"],
          [
            "Ravi",
            "A database stores information in an organised way.",
            "डेटाबेस जानकारी को व्यवस्थित ढंग से रखता है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "a-function-is-a-block-of-code",
        "A function is a block of code that does one job.",
        "फ़ंक्शन कोड का एक हिस्सा होता है जो एक काम करता है।",
        "Use it to explain what a function is.",
        [
          ["Meera", "What is a function?", "फ़ंक्शन क्या होता है?"],
          [
            "Ravi",
            "A function is a block of code that does one job.",
            "फ़ंक्शन कोड का एक हिस्सा होता है जो एक काम करता है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-me-explain-it-with-a-simple",
        "Let me explain it with a simple example.",
        "मैं इसे एक आसान उदाहरण से समझाता हूँ।",
        "Use it before you give an example.",
        [
          [
            "Ravi",
            "Let me explain it with a simple example.",
            "मैं इसे एक आसान उदाहरण से समझाता हूँ।",
          ],
          ["Meera", "Yes, that will help.", "हाँ, इससे मदद मिलेगी।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "think-of-it-like-a-menu-in",
        "Think of it like a menu in a restaurant.",
        "इसे रेस्तराँ के मेन्यू की तरह समझिए।",
        "Use it to begin an everyday comparison.",
        [
          [
            "Ravi",
            "Think of it like a menu in a restaurant.",
            "इसे रेस्तराँ के मेन्यू की तरह समझिए।",
          ],
          ["Meera", "Oh, I see.", "अच्छा, मैं समझ गया।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "does-that-make-sense-so-far",
        "Does that make sense so far?",
        "क्या अब तक यह समझ में आ रहा है?",
        "Use it to check that the listener follows you.",
        [
          [
            "Ravi",
            "Does that make sense so far?",
            "क्या अब तक यह समझ में आ रहा है?",
          ],
          ["Meera", "Yes, please continue.", "हाँ, कृपया जारी रखिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-can-draw-a-small-diagram-if",
        "I can draw a small diagram if that helps.",
        "अगर इससे मदद मिले तो मैं एक छोटा चित्र बना सकता हूँ।",
        "Use it to offer a visual explanation.",
        [
          [
            "Ravi",
            "I can draw a small diagram if that helps.",
            "अगर इससे मदद मिले तो मैं एक छोटा चित्र बना सकता हूँ।",
          ],
          ["Meera", "Yes, please draw it.", "हाँ, कृपया बनाइए।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "explaining-an-api",
        "Explaining an API",
        {
          en: "A developer explains an API to a manager.",
          hi: "एक डेवलपर एक मैनेजर को एपीआई समझाता है।",
        },
        [
          [
            "Manager",
            "What is an API? I am not technical.",
            "एपीआई क्या है? मैं तकनीकी व्यक्ति नहीं हूँ।",
          ],
          [
            "Ravi",
            "An API lets two programs talk to each other.",
            "एक एपीआई दो प्रोग्रामों को आपस में बात करने देता है।",
          ],
          [
            "Ravi",
            "Think of it like a menu in a restaurant.",
            "इसे रेस्तराँ के मेन्यू की तरह समझिए।",
          ],
          [
            "Manager",
            "That helps. So the menu shows what I can ask for?",
            "इससे मदद मिली। तो मेन्यू दिखाता है कि मैं क्या माँग सकता हूँ?",
          ],
          [
            "Ravi",
            "Exactly. Does that make sense so far?",
            "बिल्कुल। क्या अब तक यह समझ में आ रहा है?",
          ],
        ]
      ),
    ],
  },
  {
    slug: "meetings",
    title: "Taking part in meetings",
    titleHi: "बैठकों में भाग लेना",
    goal: "Speak clearly and politely during a meeting.",
    items: [
      sent(
        "shall-we-start-the-meeting",
        "Shall we start the meeting?",
        "क्या हम बैठक शुरू करें?",
        "Use it to begin a meeting.",
        [
          ["Ravi", "Shall we start the meeting?", "क्या हम बैठक शुरू करें?"],
          ["Meera", "Yes, everyone is here.", "हाँ, सब आ गए हैं।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-me-share-my-screen",
        "Let me share my screen.",
        "मुझे अपनी स्क्रीन साझा करने दीजिए।",
        "Use it in an online meeting before you show something.",
        [
          [
            "Ravi",
            "Let me share my screen.",
            "मुझे अपनी स्क्रीन साझा करने दीजिए।",
          ],
          ["Meera", "Sure, we can see it.", "ज़रूर, हमें दिख रही है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-everyone-hear-me-clearly",
        "Can everyone hear me clearly?",
        "क्या सबको मेरी आवाज़ साफ़ सुनाई दे रही है?",
        "Use it at the start of an online call.",
        [
          [
            "Ravi",
            "Can everyone hear me clearly?",
            "क्या सबको मेरी आवाज़ साफ़ सुनाई दे रही है?",
          ],
          [
            "Meera",
            "Yes, we can hear you.",
            "हाँ, हमें आपकी आवाज़ सुनाई दे रही है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-would-like-to-add-one-point",
        "I would like to add one point.",
        "मैं एक बात जोड़ना चाहूँगा।",
        "Use it to speak politely in a meeting.",
        [
          [
            "Ravi",
            "I would like to add one point.",
            "मैं एक बात जोड़ना चाहूँगा।",
          ],
          ["Meera", "Please go ahead.", "कृपया कहिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-please-repeat-the-last-part",
        "Could you please repeat the last part?",
        "क्या आप कृपया आखिरी हिस्सा दोहरा सकते हैं?",
        "Use it when you missed something in a meeting.",
        [
          [
            "Ravi",
            "Could you please repeat the last part?",
            "क्या आप कृपया आखिरी हिस्सा दोहरा सकते हैं?",
          ],
          ["Meera", "Of course, I will repeat it.", "ज़रूर, मैं दोहराता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-us-move-to-the-next-topic",
        "Let us move to the next topic.",
        "चलिए अगले विषय पर चलते हैं।",
        "Use it to guide a meeting forward.",
        [
          [
            "Ravi",
            "Let us move to the next topic.",
            "चलिए अगले विषय पर चलते हैं।",
          ],
          ["Meera", "Yes, that is fine.", "हाँ, ठीक है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "we-will-meet-again-on-thursday",
        "We will meet again on Thursday.",
        "हम गुरुवार को फिर मिलेंगे।",
        "Use it to close a meeting with the next date.",
        [
          [
            "Ravi",
            "We will meet again on Thursday.",
            "हम गुरुवार को फिर मिलेंगे।",
          ],
          ["Meera", "Thursday works for me.", "गुरुवार मेरे लिए ठीक है।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-team-meeting",
        "A team meeting",
        {
          en: "A team starts a weekly meeting.",
          hi: "एक टीम साप्ताहिक बैठक शुरू करती है।",
        },
        [
          ["Meera", "Shall we start the meeting?", "क्या हम बैठक शुरू करें?"],
          [
            "Ravi",
            "Yes. I would like to add one point.",
            "हाँ। मैं एक बात जोड़ना चाहूँगा।",
          ],
          ["Meera", "Please go ahead.", "कृपया कहिए।"],
          [
            "Ravi",
            "The report needs one more review.",
            "रिपोर्ट की एक और समीक्षा ज़रूरी है।",
          ],
          [
            "Meera",
            "Good point. Let us move to the next topic.",
            "अच्छी बात है। चलिए अगले विषय पर चलते हैं।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "asking-questions-at-work",
    title: "Asking questions at work",
    titleHi: "काम पर सवाल पूछना",
    goal: "Ask for information and clarity without hesitation.",
    items: [
      sent(
        "could-you-clarify-the-requirement",
        "Could you clarify the requirement?",
        "क्या आप आवश्यकता स्पष्ट कर सकते हैं?",
        "Use it when a task is not clear.",
        [
          [
            "Ravi",
            "Could you clarify the requirement?",
            "क्या आप आवश्यकता स्पष्ट कर सकते हैं?",
          ],
          ["Meera", "Yes, let me explain.", "हाँ, मैं समझाता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-is-the-deadline-for-this-task",
        "What is the deadline for this task?",
        "इस काम की अंतिम तारीख़ क्या है?",
        "Use it to ask when something is due.",
        [
          [
            "Ravi",
            "What is the deadline for this task?",
            "इस काम की अंतिम तारीख़ क्या है?",
          ],
          ["Meera", "It is due on Friday.", "यह शुक्रवार तक है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "who-will-review-my-code",
        "Who will review my code?",
        "मेरे कोड की समीक्षा कौन करेगा?",
        "Use it to ask who checks your work.",
        [
          [
            "Ravi",
            "Who will review my code?",
            "मेरे कोड की समीक्षा कौन करेगा?",
          ],
          ["Meera", "Meera will review it.", "मीरा इसकी समीक्षा करेगी।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "is-there-any-document-i-can-read",
        "Is there any document I can read?",
        "क्या कोई दस्तावेज़ है जो मैं पढ़ सकूँ?",
        "Use it to ask for written information.",
        [
          [
            "Ravi",
            "Is there any document I can read?",
            "क्या कोई दस्तावेज़ है जो मैं पढ़ सकूँ?",
          ],
          ["Meera", "Yes, I will send the link.", "हाँ, मैं लिंक भेज दूँगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-i-ask-a-quick-question",
        "Can I ask a quick question?",
        "क्या मैं एक छोटा सवाल पूछ सकता हूँ?",
        "Use it politely before you ask a colleague.",
        [
          [
            "Ravi",
            "Can I ask a quick question?",
            "क्या मैं एक छोटा सवाल पूछ सकता हूँ?",
          ],
          ["Meera", "Of course, go ahead.", "ज़रूर, पूछिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-would-you-suggest-here",
        "What would you suggest here?",
        "यहाँ आप क्या सुझाव देंगे?",
        "Use it to ask for advice.",
        [
          ["Ravi", "What would you suggest here?", "यहाँ आप क्या सुझाव देंगे?"],
          [
            "Meera",
            "I would try the simple option.",
            "मैं सरल विकल्प आज़माऊँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "is-this-the-right-way-to-do",
        "Is this the right way to do it?",
        "क्या इसे करने का यही सही तरीका है?",
        "Use it to check that your approach is correct.",
        [
          [
            "Ravi",
            "Is this the right way to do it?",
            "क्या इसे करने का यही सही तरीका है?",
          ],
          ["Meera", "Yes, that looks right.", "हाँ, यह सही लग रहा है।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "asking-a-senior-for-help",
        "Asking a senior for help",
        {
          en: "A junior asks a senior a question.",
          hi: "एक जूनियर एक सीनियर से सवाल पूछता है।",
        },
        [
          [
            "Ravi",
            "Can I ask a quick question?",
            "क्या मैं एक छोटा सवाल पूछ सकता हूँ?",
          ],
          ["Senior", "Of course. What is it?", "ज़रूर। क्या सवाल है?"],
          [
            "Ravi",
            "Could you clarify the requirement for this task?",
            "क्या आप इस काम की आवश्यकता स्पष्ट कर सकते हैं?",
          ],
          [
            "Senior",
            "Yes. We need a simple search page.",
            "हाँ। हमें एक साधारण खोज पेज चाहिए।",
          ],
          [
            "Ravi",
            "Thank you. That is clear now.",
            "धन्यवाद। अब यह स्पष्ट है।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "giving-updates",
    title: "Giving a work update",
    titleHi: "काम की जानकारी देना",
    goal: "Tell your team how your work is going.",
    items: [
      sent(
        "here-is-a-quick-update-on-my",
        "Here is a quick update on my work.",
        "यह मेरे काम की एक छोटी जानकारी है।",
        "Use it to begin a short progress report.",
        [
          [
            "Ravi",
            "Here is a quick update on my work.",
            "यह मेरे काम की एक छोटी जानकारी है।",
          ],
          ["Meera", "Please go ahead.", "कृपया बताइए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-have-finished-the-first-part",
        "I have finished the first part.",
        "मैंने पहला हिस्सा पूरा कर लिया है।",
        "Use it to report finished work.",
        [
          ["Meera", "How is the task going?", "काम कैसा चल रहा है?"],
          [
            "Ravi",
            "I have finished the first part.",
            "मैंने पहला हिस्सा पूरा कर लिया है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-halfway-through-the-second-task",
        "I am halfway through the second task.",
        "मैं दूसरे काम के बीच में हूँ।",
        "Use it to say that work is half done.",
        [
          ["Meera", "And the second task?", "और दूसरा काम?"],
          [
            "Ravi",
            "I am halfway through the second task.",
            "मैं दूसरे काम के बीच में हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-expect-to-complete-it-by-tomorrow",
        "I expect to complete it by tomorrow.",
        "मुझे उम्मीद है कि मैं इसे कल तक पूरा कर लूँगा।",
        "Use it to give a realistic finish time.",
        [
          ["Meera", "When will it be ready?", "यह कब तक तैयार होगा?"],
          [
            "Ravi",
            "I expect to complete it by tomorrow.",
            "मुझे उम्मीद है कि मैं इसे कल तक पूरा कर लूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "everything-is-going-as-planned",
        "Everything is going as planned.",
        "सब कुछ योजना के अनुसार चल रहा है।",
        "Use it to say there are no problems.",
        [
          ["Meera", "Is everything fine?", "क्या सब ठीक है?"],
          [
            "Ravi",
            "Everything is going as planned.",
            "सब कुछ योजना के अनुसार चल रहा है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-share-the-details-by-email",
        "I will share the details by email.",
        "मैं ब्यौरा ईमेल से साझा कर दूँगा।",
        "Use it to promise written details.",
        [
          [
            "Meera",
            "Can you send the details?",
            "क्या आप ब्यौरा भेज सकते हैं?",
          ],
          [
            "Ravi",
            "I will share the details by email.",
            "मैं ब्यौरा ईमेल से साझा कर दूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "there-is-nothing-blocking-me-right-now",
        "There is nothing blocking me right now.",
        "अभी मुझे कोई रुकावट नहीं है।",
        "Use it to say that you do not need help.",
        [
          ["Meera", "Do you need anything?", "क्या आपको कुछ चाहिए?"],
          [
            "Ravi",
            "There is nothing blocking me right now.",
            "अभी मुझे कोई रुकावट नहीं है।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-daily-update",
        "A daily update",
        {
          en: "A developer gives a daily update.",
          hi: "एक डेवलपर रोज़ की जानकारी देता है।",
        },
        [
          [
            "Lead",
            "Ravi, can you give us an update?",
            "रवि, क्या आप हमें जानकारी दे सकते हैं?",
          ],
          [
            "Ravi",
            "I have finished the first part.",
            "मैंने पहला हिस्सा पूरा कर लिया है।",
          ],
          [
            "Ravi",
            "I am halfway through the second task.",
            "मैं दूसरे काम के बीच में हूँ।",
          ],
          ["Lead", "When will it be ready?", "यह कब तक तैयार होगा?"],
          [
            "Ravi",
            "I expect to complete it by tomorrow.",
            "मुझे उम्मीद है कि मैं इसे कल तक पूरा कर लूँगा।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "communicating-blockers",
    title: "Telling people about a blocker",
    titleHi: "रुकावट के बारे में बताना",
    goal: "Say clearly when something stops your work.",
    items: [
      sent(
        "i-am-stuck-on-one-problem",
        "I am stuck on one problem.",
        "मैं एक समस्या में अटका हुआ हूँ।",
        "Use it to tell the team that you are blocked.",
        [
          [
            "Ravi",
            "I am stuck on one problem.",
            "मैं एक समस्या में अटका हुआ हूँ।",
          ],
          ["Meera", "What is the problem?", "समस्या क्या है?"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-need-access-to-the-test-server",
        "I need access to the test server.",
        "मुझे टेस्ट सर्वर तक पहुँच चाहिए।",
        "Use it to ask for access that you need.",
        [
          [
            "Ravi",
            "I need access to the test server.",
            "मुझे टेस्ट सर्वर तक पहुँच चाहिए।",
          ],
          ["Meera", "I will arrange it today.", "मैं आज ही इंतज़ाम करता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-waiting-for-a-reply-from",
        "I am waiting for a reply from the other team.",
        "मैं दूसरी टीम के जवाब का इंतज़ार कर रहा हूँ।",
        "Use it to explain a delay caused by another team.",
        [
          ["Meera", "Why is the task late?", "काम में देरी क्यों है?"],
          [
            "Ravi",
            "I am waiting for a reply from the other team.",
            "मैं दूसरी टीम के जवाब का इंतज़ार कर रहा हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "this-task-may-take-longer-than-planned",
        "This task may take longer than planned.",
        "इस काम में योजना से ज़्यादा समय लग सकता है।",
        "Use it to warn the team early.",
        [
          [
            "Ravi",
            "This task may take longer than planned.",
            "इस काम में योजना से ज़्यादा समय लग सकता है।",
          ],
          [
            "Meera",
            "Thank you for telling us early.",
            "जल्दी बताने के लिए धन्यवाद।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-help-me-unblock-this",
        "Could you help me unblock this?",
        "क्या आप इसमें मेरी रुकावट दूर करने में मदद कर सकते हैं?",
        "Use it to ask for direct help.",
        [
          [
            "Ravi",
            "Could you help me unblock this?",
            "क्या आप इसमें मेरी रुकावट दूर करने में मदद कर सकते हैं?",
          ],
          [
            "Meera",
            "Yes, let us look at it together.",
            "हाँ, साथ मिलकर देखते हैं।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-have-tried-two-solutions-but-neither",
        "I have tried two solutions, but neither worked.",
        "मैंने दो समाधान आज़माए, पर कोई काम नहीं आया।",
        "Use it to show the effort you already made.",
        [
          ["Meera", "Did you try anything?", "क्या आपने कुछ आज़माया?"],
          [
            "Ravi",
            "I have tried two solutions, but neither worked.",
            "मैंने दो समाधान आज़माए, पर कोई काम नहीं आया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-update-you-as-soon-as",
        "I will update you as soon as it is fixed.",
        "जैसे ही यह ठीक होगा, मैं आपको बता दूँगा।",
        "Use it to promise a follow-up.",
        [
          ["Meera", "Please keep us informed.", "कृपया हमें सूचित रखिए।"],
          [
            "Ravi",
            "I will update you as soon as it is fixed.",
            "जैसे ही यह ठीक होगा, मैं आपको बता दूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "raising-a-blocker",
        "Raising a blocker",
        {
          en: "A developer raises a problem with the lead.",
          hi: "एक डेवलपर लीड को समस्या बताता है।",
        },
        [
          [
            "Ravi",
            "I am stuck on one problem.",
            "मैं एक समस्या में अटका हुआ हूँ।",
          ],
          [
            "Lead",
            "What have you tried so far?",
            "आपने अब तक क्या आज़माया है?",
          ],
          [
            "Ravi",
            "I have tried two solutions, but neither worked.",
            "मैंने दो समाधान आज़माए, पर कोई काम नहीं आया।",
          ],
          [
            "Lead",
            "Let us look at it together after lunch.",
            "चलिए दोपहर के खाने के बाद साथ मिलकर देखते हैं।",
          ],
          [
            "Ravi",
            "Thank you. I will update you as soon as it is fixed.",
            "धन्यवाद। जैसे ही यह ठीक होगा, मैं आपको बता दूँगा।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "email-communication",
    title: "Writing professional emails",
    titleHi: "पेशेवर ईमेल लिखना",
    goal: "Write short, polite and clear emails.",
    items: [
      sent(
        "i-hope-you-are-doing-well",
        "I hope you are doing well.",
        "मुझे आशा है कि आप कुशल होंगे।",
        "Use it as a polite opening line in an email.",
        [
          [
            "Ravi",
            "I hope you are doing well.",
            "मुझे आशा है कि आप कुशल होंगे।",
          ],
          ["Meera", "Thank you, I am well.", "धन्यवाद, मैं ठीक हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-writing-to-ask-about-the",
        "I am writing to ask about the project.",
        "मैं प्रोजेक्ट के बारे में पूछने के लिए लिख रहा हूँ।",
        "Use it to state why you are writing.",
        [
          [
            "Ravi",
            "I am writing to ask about the project.",
            "मैं प्रोजेक्ट के बारे में पूछने के लिए लिख रहा हूँ।",
          ],
          ["Meera", "Please ask your question.", "कृपया अपना सवाल पूछिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-find-the-report-attached",
        "Please find the report attached.",
        "कृपया रिपोर्ट संलग्न देखिए।",
        "Use it when you attach a file.",
        [
          [
            "Ravi",
            "Please find the report attached.",
            "कृपया रिपोर्ट संलग्न देखिए।",
          ],
          ["Meera", "Received, thank you.", "मिल गई, धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-please-confirm-the-date",
        "Could you please confirm the date?",
        "क्या आप कृपया तारीख़ की पुष्टि कर सकते हैं?",
        "Use it to ask for a clear answer in an email.",
        [
          [
            "Ravi",
            "Could you please confirm the date?",
            "क्या आप कृपया तारीख़ की पुष्टि कर सकते हैं?",
          ],
          ["Meera", "The date is the twentieth.", "तारीख़ बीस है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "thank-you-for-your-quick-reply",
        "Thank you for your quick reply.",
        "जल्दी जवाब देने के लिए धन्यवाद।",
        "Use it to thank someone who answered fast.",
        [
          [
            "Ravi",
            "Thank you for your quick reply.",
            "जल्दी जवाब देने के लिए धन्यवाद।",
          ],
          ["Meera", "You are welcome.", "आपका स्वागत है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-look-forward-to-your-response",
        "I look forward to your response.",
        "मैं आपके जवाब की प्रतीक्षा करूँगा।",
        "Use it to end an email that needs a reply.",
        [
          [
            "Ravi",
            "I look forward to your response.",
            "मैं आपके जवाब की प्रतीक्षा करूँगा।",
          ],
          ["Meera", "I will reply today.", "मैं आज जवाब दूँगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "best-regards",
        "Best regards.",
        "सादर।",
        "Use it as a polite closing line before your name.",
        [
          ["Meera", "How should I end the email?", "ईमेल कैसे समाप्त करूँ?"],
          ["Ravi", "Best regards.", "सादर।"],
        ],
        { type: "type" }
      ),
      dialogue(
        "an-email-exchange",
        "An email exchange",
        {
          en: "Two colleagues exchange short emails.",
          hi: "दो सहकर्मी छोटे ईमेल भेजते हैं।",
        },
        [
          [
            "Ravi",
            "I hope you are doing well. I am writing to ask about the project.",
            "मुझे आशा है कि आप कुशल होंगे। मैं प्रोजेक्ट के बारे में पूछने के लिए लिख रहा हूँ।",
          ],
          [
            "Ravi",
            "Could you please confirm the date? Best regards.",
            "क्या आप कृपया तारीख़ की पुष्टि कर सकते हैं? सादर।",
          ],
          [
            "Meera",
            "Thank you for your message. The date is the twentieth.",
            "आपके संदेश के लिए धन्यवाद। तारीख़ बीस है।",
          ],
          [
            "Meera",
            "Please find the plan attached. Best regards.",
            "कृपया योजना संलग्न देखिए। सादर।",
          ],
        ]
      ),
    ],
  },
  {
    slug: "professional-etiquette",
    title: "Professional etiquette",
    titleHi: "कार्यस्थल का शिष्टाचार",
    goal: "Show respect and good manners at work.",
    items: [
      sent(
        "please-be-on-time-for-meetings",
        "Please be on time for meetings.",
        "कृपया बैठकों में समय पर पहुँचिए।",
        "Use it to remind people about punctuality.",
        [
          [
            "Ravi",
            "Please be on time for meetings.",
            "कृपया बैठकों में समय पर पहुँचिए।",
          ],
          ["Meera", "I will be there.", "मैं पहुँच जाऊँगा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-keep-this-information-private",
        "I will keep this information private.",
        "मैं इस जानकारी को निजी रखूँगा।",
        "Use it to promise to protect sensitive information.",
        [
          ["Meera", "This is confidential.", "यह गोपनीय है।"],
          [
            "Ravi",
            "I will keep this information private.",
            "मैं इस जानकारी को निजी रखूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "thank-you-for-your-feedback",
        "Thank you for your feedback.",
        "आपके सुझाव के लिए धन्यवाद।",
        "Use it to receive feedback politely.",
        [
          [
            "Meera",
            "Your report needs a few changes.",
            "आपकी रिपोर्ट में कुछ बदलाव ज़रूरी हैं।",
          ],
          [
            "Ravi",
            "Thank you for your feedback.",
            "आपके सुझाव के लिए धन्यवाद।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-respect-your-point-of-view",
        "I respect your point of view.",
        "मैं आपके नज़रिए का सम्मान करता हूँ।",
        "Use it to stay polite when you disagree.",
        [
          ["Meera", "I think differently.", "मैं अलग सोचता हूँ।"],
          [
            "Ravi",
            "I respect your point of view.",
            "मैं आपके नज़रिए का सम्मान करता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-us-keep-the-discussion-polite",
        "Let us keep the discussion polite.",
        "चलिए चर्चा को विनम्र बनाए रखें।",
        "Use it to calm a strong discussion.",
        [
          [
            "Ravi",
            "Let us keep the discussion polite.",
            "चलिए चर्चा को विनम्र बनाए रखें।",
          ],
          ["Meera", "You are right. Sorry.", "आप सही हैं। क्षमा कीजिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-reply-to-your-message-today",
        "I will reply to your message today.",
        "मैं आज आपके संदेश का जवाब दे दूँगा।",
        "Use it to promise a quick reply.",
        [
          ["Meera", "Did you see my message?", "क्या आपने मेरा संदेश देखा?"],
          [
            "Ravi",
            "I will reply to your message today.",
            "मैं आज आपके संदेश का जवाब दे दूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-excuse-me-i-have-another-call",
        "Please excuse me, I have another call.",
        "कृपया मुझे क्षमा कीजिए, मेरी एक और कॉल है।",
        "Use it to leave a meeting or a talk politely.",
        [
          [
            "Ravi",
            "Please excuse me, I have another call.",
            "कृपया मुझे क्षमा कीजिए, मेरी एक और कॉल है।",
          ],
          ["Meera", "Of course, thank you.", "ज़रूर, धन्यवाद।"],
        ],
        { type: "arrange" }
      ),
      dialogue(
        "a-polite-disagreement",
        "A polite disagreement",
        {
          en: "Two colleagues disagree politely.",
          hi: "दो सहकर्मी विनम्रता से असहमत होते हैं।",
        },
        [
          [
            "Meera",
            "I think we should wait one more week.",
            "मुझे लगता है कि हमें एक हफ़्ता और रुकना चाहिए।",
          ],
          [
            "Ravi",
            "I respect your point of view, but I see it differently.",
            "मैं आपके नज़रिए का सम्मान करता हूँ, पर मैं इसे अलग तरह से देखता हूँ।",
          ],
          ["Meera", "Please tell me your reason.", "कृपया अपना कारण बताइए।"],
          [
            "Ravi",
            "The customer is waiting for the feature.",
            "ग्राहक इस सुविधा का इंतज़ार कर रहा है।",
          ],
          [
            "Meera",
            "That is a fair point. Let us decide together.",
            "यह एक उचित बात है। चलिए मिलकर तय करते हैं।",
          ],
        ]
      ),
    ],
  },
])
