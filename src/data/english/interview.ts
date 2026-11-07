import { defineLessons } from "@/data/english/author"
import { sent } from "@/data/english/kit"

// Module 5: Interview English. Draft content: not yet reviewed by an English teacher.
// Model answers use [placeholders]: the learner writes their own facts, never anyone else's.
export default defineLessons("interview", [
  {
    slug: "about-you",
    title: "Talking about yourself",
    titleHi: "अपने बारे में बताना",
    goal: "Introduce yourself and your strengths with easy, middle and professional English.",
    items: [
      sent(
        "thank-you-for-having-me-today",
        "Thank you for having me today.",
        "आज मुझे बुलाने के लिए धन्यवाद।",
        "Use it at the start of an interview.",
        [
          [
            "Interviewer",
            "Welcome. Please sit down.",
            "स्वागत है। कृपया बैठिए।",
          ],
          [
            "Candidate",
            "Thank you for having me today.",
            "आज मुझे बुलाने के लिए धन्यवाद।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-is-a-pleasure-to-meet-you",
        "It is a pleasure to meet you.",
        "आपसे मिलकर मुझे खुशी हुई।",
        "Use it to greet the interviewer politely.",
        [
          [
            "Interviewer",
            "Hello, I am the hiring manager.",
            "नमस्कार, मैं नियुक्ति प्रबंधक हूँ।",
          ],
          [
            "Candidate",
            "It is a pleasure to meet you.",
            "आपसे मिलकर मुझे खुशी हुई।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-me-tell-you-a-little-about",
        "Let me tell you a little about myself.",
        "मुझे अपने बारे में थोड़ा बताने दीजिए।",
        "Use it to begin your introduction.",
        [
          [
            "Interviewer",
            "Please tell us about yourself.",
            "कृपया अपने बारे में बताइए।",
          ],
          [
            "Candidate",
            "Let me tell you a little about myself.",
            "मुझे अपने बारे में थोड़ा बताने दीजिए।",
          ],
        ],
        { type: "arrange" }
      ),
      {
        kind: "answer",
        slug: "tell-me-about-yourself",
        question: "Tell me about yourself.",
        variants: [
          {
            level: "easy",
            en: "My name is [your name]. I am a [your job or course]. I live in [your city]. I like [something you enjoy].",
            hi: "मेरा नाम [आपका नाम] है। मैं [आपकी नौकरी या पढ़ाई] हूँ। मैं [आपका शहर] में रहता हूँ। मुझे [आपकी पसंद] पसंद है।",
          },
          {
            level: "intermediate",
            en: "My name is [your name], and I am a [your job or course] from [your city]. I have worked on [your main project or skill], and I enjoy [what you like about the work]. I am looking for a role where I can [what you want to learn or do].",
            hi: "मेरा नाम [आपका नाम] है, और मैं [आपका शहर] से [आपकी नौकरी या पढ़ाई] हूँ। मैंने [आपका मुख्य प्रोजेक्ट या कौशल] पर काम किया है, और मुझे [काम की पसंदीदा बात] अच्छा लगता है। मैं ऐसी भूमिका खोज रहा हूँ जिसमें मैं [आप क्या सीखना या करना चाहते हैं]।",
          },
          {
            level: "professional",
            en: "Thank you for the opportunity. I am [your name], a [your role] with experience in [your main skill]. Recently, I worked on [your recent project], where I was responsible for [your part]. I am now looking for a role where I can contribute [your strength] and keep growing in [your area].",
            hi: "इस अवसर के लिए धन्यवाद। मैं [आपका नाम] हूँ, [आपकी भूमिका], और [आपका मुख्य कौशल] में मेरा अनुभव है। हाल ही में मैंने [आपका हालिया प्रोजेक्ट] पर काम किया, जहाँ मेरी ज़िम्मेदारी [आपका हिस्सा] थी। अब मैं ऐसी भूमिका चाहता हूँ जिसमें मैं [आपकी ताक़त] दे सकूँ और [आपका क्षेत्र] में आगे बढ़ता रहूँ।",
          },
        ],
        tips: [
          "Say your name slowly and clearly.",
          "Use only facts that are true for you.",
          "Keep your answer to about one minute.",
        ],
      },
      {
        kind: "answer",
        slug: "what-are-your-strengths",
        question: "What are your strengths?",
        variants: [
          {
            level: "easy",
            en: "My strength is [your strength]. For example, I [a short real example].",
            hi: "मेरी ताक़त [आपकी ताक़त] है। उदाहरण के लिए, मैंने [एक छोटा सच्चा उदाहरण]।",
          },
          {
            level: "intermediate",
            en: "One of my strengths is [your strength]. For example, when [a real situation], I [what you did], and [the result]. I also [a second strength].",
            hi: "मेरी एक ताक़त [आपकी ताक़त] है। उदाहरण के लिए, जब [एक सच्ची स्थिति] थी, तब मैंने [आपने क्या किया], और [नतीजा]। मैं [दूसरी ताक़त] भी रखता हूँ।",
          },
          {
            level: "professional",
            en: "My main strength is [your strength]. For example, when [a real situation], I [what you did], and the result was [the real result]. I also have [a second strength], which helps me [how it helps your work]. I believe both are useful for this role.",
            hi: "मेरी मुख्य ताक़त [आपकी ताक़त] है। उदाहरण के लिए, जब [एक सच्ची स्थिति] थी, तब मैंने [आपने क्या किया], और नतीजा [सच्चा नतीजा] रहा। मेरे पास [दूसरी ताक़त] भी है, जो [यह आपके काम में कैसे मदद करती है]। मुझे लगता है कि दोनों इस भूमिका के लिए उपयोगी हैं।",
          },
        ],
        tips: [
          "Choose a strength that matches the job.",
          "Always give one real example.",
          "Do not claim a strength you cannot explain.",
        ],
      },
      {
        kind: "answer",
        slug: "why-should-we-hire-you",
        question: "Why should we hire you?",
        variants: [
          {
            level: "easy",
            en: "I have [your main skill]. I [your habit or strength]. I want to help your team with [the work].",
            hi: "मेरे पास [आपका मुख्य कौशल] है। मैं [आपकी आदत या ताक़त] रखता हूँ। मैं आपकी टीम की [काम] में मदद करना चाहता हूँ।",
          },
          {
            level: "intermediate",
            en: "I have [your main skill], and I have used it in [your project or work]. I also [your habit or strength]. I would like to help your team with [the work] and keep learning.",
            hi: "मेरे पास [आपका मुख्य कौशल] है, और मैंने उसे [आपका प्रोजेक्ट या काम] में इस्तेमाल किया है। मैं [आपकी आदत या ताक़त] भी रखता हूँ। मैं आपकी टीम की [काम] में मदद करना और सीखते रहना चाहता हूँ।",
          },
          {
            level: "professional",
            en: "I bring [your main skill], which I have used in [your project or work] to [your real result]. I also [your habit or strength], and I work well with [your team type]. I would be glad to help your team with [the work] and grow with the company.",
            hi: "मेरे पास [आपका मुख्य कौशल] है, जिसे मैंने [आपका प्रोजेक्ट या काम] में [आपका सच्चा नतीजा] के लिए इस्तेमाल किया है। मैं [आपकी आदत या ताक़त] भी रखता हूँ, और [आपकी टीम का प्रकार] के साथ अच्छी तरह काम करता हूँ। मैं आपकी टीम की [काम] में मदद करना और कंपनी के साथ आगे बढ़ना चाहूँगा।",
          },
        ],
        tips: [
          "Read the job description before the interview.",
          "Match two of your real skills to what the job needs.",
        ],
      },
    ],
  },
  {
    slug: "your-work",
    title: "Talking about your work",
    titleHi: "अपने काम के बारे में बताना",
    goal: "Explain your current project and your responsibilities at three levels of English.",
    items: [
      sent(
        "i-will-explain-it-step-by-step",
        "I will explain it step by step.",
        "मैं इसे चरण-दर-चरण समझाऊँगा।",
        "Use it before you explain a project or a process.",
        [
          [
            "Interviewer",
            "Can you explain your project?",
            "क्या आप अपना प्रोजेक्ट समझा सकते हैं?",
          ],
          [
            "Candidate",
            "I will explain it step by step.",
            "मैं इसे चरण-दर-चरण समझाऊँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "my-main-role-was-to-build-and",
        "My main role was to build and test features.",
        "मेरी मुख्य भूमिका सुविधाएँ बनाना और जाँचना थी।",
        "Use it to describe your role in a project.",
        [
          ["Interviewer", "What was your role?", "आपकी भूमिका क्या थी?"],
          [
            "Candidate",
            "My main role was to build and test features.",
            "मेरी मुख्य भूमिका सुविधाएँ बनाना और जाँचना थी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-worked-closely-with-my-team",
        "I worked closely with my team.",
        "मैंने अपनी टीम के साथ मिलकर काम किया।",
        "Use it to show that you cooperate with others.",
        [
          ["Interviewer", "Did you work alone?", "क्या आपने अकेले काम किया?"],
          [
            "Candidate",
            "I worked closely with my team.",
            "मैंने अपनी टीम के साथ मिलकर काम किया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-i-give-you-an-example",
        "Could I give you an example?",
        "क्या मैं आपको एक उदाहरण दे सकता हूँ?",
        "Use it to offer an example in your answer.",
        [
          ["Interviewer", "That sounds interesting.", "यह दिलचस्प लग रहा है।"],
          [
            "Candidate",
            "Could I give you an example?",
            "क्या मैं आपको एक उदाहरण दे सकता हूँ?",
          ],
        ],
        { type: "arrange" }
      ),
      {
        kind: "answer",
        slug: "explain-your-current-project",
        question: "Explain your current project.",
        variants: [
          {
            level: "easy",
            en: "I am working on [project name]. It helps [users] to [what it does]. I use [your tools]. My work is [your part].",
            hi: "मैं [प्रोजेक्ट का नाम] पर काम कर रहा हूँ। यह [उपयोगकर्ता] को [यह क्या करता है] में मदद करता है। मैं [आपके टूल] इस्तेमाल करता हूँ। मेरा काम [आपका हिस्सा] है।",
          },
          {
            level: "intermediate",
            en: "I am currently working on [project name], which helps [users] to [what it does]. We use [your tools], and our team has [number of people] people. My part is [your part], and I also [another task]. The project is at the [stage] stage.",
            hi: "मैं अभी [प्रोजेक्ट का नाम] पर काम कर रहा हूँ, जो [उपयोगकर्ता] को [यह क्या करता है] में मदद करता है। हम [आपके टूल] इस्तेमाल करते हैं, और हमारी टीम में [लोगों की संख्या] लोग हैं। मेरा हिस्सा [आपका हिस्सा] है, और मैं [दूसरा काम] भी करता हूँ। प्रोजेक्ट [चरण] चरण में है।",
          },
          {
            level: "professional",
            en: "At the moment I am working on [project name], a [type of application] that helps [users] to [what it does]. The team uses [your tools], and I am responsible for [your part]. One challenge we faced was [your real challenge], and we solved it by [your real solution]. The project is now at the [stage] stage, and I expect to [your next step].",
            hi: "इस समय मैं [प्रोजेक्ट का नाम] पर काम कर रहा हूँ, जो [एप्लिकेशन का प्रकार] है और [उपयोगकर्ता] को [यह क्या करता है] में मदद करता है। टीम [आपके टूल] इस्तेमाल करती है, और मेरी ज़िम्मेदारी [आपका हिस्सा] है। हमारे सामने एक चुनौती [आपकी सच्ची चुनौती] थी, जिसे हमने [आपका सच्चा समाधान] से सुलझाया। प्रोजेक्ट अब [चरण] चरण में है, और मुझे [आपका अगला कदम] की उम्मीद है।",
          },
        ],
        tips: [
          "Use the names of your real tools.",
          "Say what YOU did, not only what the team did.",
          "Do not invent numbers.",
        ],
      },
      {
        kind: "answer",
        slug: "what-are-your-responsibilities",
        question: "What are your responsibilities?",
        variants: [
          {
            level: "easy",
            en: "My main job is to [your main task]. I also [another task]. I work with [your team].",
            hi: "मेरा मुख्य काम [आपका मुख्य काम] है। मैं [दूसरा काम] भी करता हूँ। मैं [आपकी टीम] के साथ काम करता हूँ।",
          },
          {
            level: "intermediate",
            en: "My main responsibility is to [your main task]. I also [another task], and I work closely with [your team]. I report to [your manager or lead] and share updates [how often].",
            hi: "मेरी मुख्य ज़िम्मेदारी [आपका मुख्य काम] है। मैं [दूसरा काम] भी करता हूँ, और [आपकी टीम] के साथ मिलकर काम करता हूँ। मैं [आपके मैनेजर या लीड] को रिपोर्ट करता हूँ और [कितनी बार] जानकारी देता हूँ।",
          },
          {
            level: "professional",
            en: "In my current role, my main responsibility is to [your main task]. I also [another task], and I work closely with [your team] to deliver [your outcome]. I report to [your manager or lead], share progress [how often], and take ownership of [your area].",
            hi: "अपनी वर्तमान भूमिका में मेरी मुख्य ज़िम्मेदारी [आपका मुख्य काम] है। मैं [दूसरा काम] भी करता हूँ, और [आपकी टीम] के साथ मिलकर [आपका नतीजा] देता हूँ। मैं [आपके मैनेजर या लीड] को रिपोर्ट करता हूँ, [कितनी बार] प्रगति बताता हूँ, और [आपका क्षेत्र] की ज़िम्मेदारी लेता हूँ।",
          },
        ],
        tips: [
          "List only the tasks that are really yours.",
          "Use simple verbs such as build, test, fix and support.",
        ],
      },
    ],
  },
  {
    slug: "challenges-and-closing",
    title: "Challenges and closing the interview",
    titleHi: "चुनौतियाँ और इंटरव्यू का अंत",
    goal: "Talk about a real challenge and close the interview politely.",
    items: [
      sent(
        "that-was-a-difficult-situation",
        "That was a difficult situation.",
        "वह एक कठिन स्थिति थी।",
        "Use it to begin the story of a challenge.",
        [
          [
            "Interviewer",
            "Tell me about a challenge.",
            "किसी चुनौती के बारे में बताइए।",
          ],
          [
            "Candidate",
            "That was a difficult situation.",
            "वह एक कठिन स्थिति थी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-stayed-calm-and-looked-for-a",
        "I stayed calm and looked for a solution.",
        "मैं शांत रहा और समाधान खोजा।",
        "Use it to show how you react to problems.",
        [
          ["Interviewer", "What did you do?", "आपने क्या किया?"],
          [
            "Candidate",
            "I stayed calm and looked for a solution.",
            "मैं शांत रहा और समाधान खोजा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-asked-my-team-for-help",
        "I asked my team for help.",
        "मैंने अपनी टीम से मदद माँगी।",
        "Use it to show that you ask for help when needed.",
        [
          ["Interviewer", "Did you ask anyone?", "क्या आपने किसी से पूछा?"],
          [
            "Candidate",
            "I asked my team for help.",
            "मैंने अपनी टीम से मदद माँगी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-learned-something-important-from-it",
        "I learned something important from it.",
        "मैंने उससे एक ज़रूरी बात सीखी।",
        "Use it to end the story of a challenge.",
        [
          ["Interviewer", "What did you learn?", "आपने क्या सीखा?"],
          [
            "Candidate",
            "I learned something important from it.",
            "मैंने उससे एक ज़रूरी बात सीखी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-grateful-for-this-opportunity",
        "I am grateful for this opportunity.",
        "मैं इस अवसर के लिए आभारी हूँ।",
        "Use it to close the interview politely.",
        [
          ["Interviewer", "That is all from us.", "हमारी तरफ़ से बस इतना ही।"],
          [
            "Candidate",
            "I am grateful for this opportunity.",
            "मैं इस अवसर के लिए आभारी हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      {
        kind: "answer",
        slug: "what-challenges-have-you-faced",
        question: "What challenges have you faced?",
        variants: [
          {
            level: "easy",
            en: "One challenge was [a real challenge]. I [what you did]. In the end, [the result].",
            hi: "एक चुनौती [एक सच्ची चुनौती] थी। मैंने [आपने क्या किया]। अंत में, [नतीजा]।",
          },
          {
            level: "intermediate",
            en: "One challenge I faced was [a real challenge]. I first [your first step], and then I [your next step]. In the end, [the result], and I learned [what you learned].",
            hi: "मेरे सामने एक चुनौती [एक सच्ची चुनौती] थी। मैंने पहले [आपका पहला कदम] किया, और फिर [आपका अगला कदम]। अंत में [नतीजा] रहा, और मैंने [आपने क्या सीखा] सीखा।",
          },
          {
            level: "professional",
            en: "One significant challenge I faced was [a real challenge] in [project or situation]. I began by [your first step], then [your next step], and I asked [a person or team] for help when needed. In the end, [the real result]. The experience taught me [what you learned], which I now use in [your later work].",
            hi: "मेरे सामने एक बड़ी चुनौती [एक सच्ची चुनौती] थी, [प्रोजेक्ट या स्थिति] में। मैंने [आपका पहला कदम] से शुरुआत की, फिर [आपका अगला कदम] किया, और ज़रूरत पड़ने पर [व्यक्ति या टीम] से मदद माँगी। अंत में [सच्चा नतीजा] रहा। इस अनुभव ने मुझे [आपने क्या सीखा] सिखाया, जिसे मैं अब [आपके बाद के काम] में इस्तेमाल करता हूँ।",
          },
        ],
        tips: [
          "Choose a real challenge, not a perfect story.",
          "Say what you learned, it matters as much as the result.",
        ],
      },
    ],
  },
  {
    slug: "interview-phrases",
    title: "Useful interview phrases",
    titleHi: "इंटरव्यू के काम के वाक्य",
    goal: "Use calm phrases to keep control during the interview.",
    items: [
      sent(
        "could-you-please-repeat-the-question",
        "Could you please repeat the question?",
        "क्या आप कृपया सवाल दोहरा सकते हैं?",
        "Use it when you did not hear or understand the question.",
        [
          [
            "Interviewer",
            "What is your biggest strength?",
            "आपकी सबसे बड़ी ताक़त क्या है?",
          ],
          [
            "Candidate",
            "Could you please repeat the question?",
            "क्या आप कृपया सवाल दोहरा सकते हैं?",
          ],
          [
            "Interviewer",
            "Of course. What is your biggest strength?",
            "ज़रूर। आपकी सबसे बड़ी ताक़त क्या है?",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "may-i-take-a-moment-to-think",
        "May I take a moment to think?",
        "क्या मैं सोचने के लिए एक क्षण ले सकता हूँ?",
        "Use it when you need time before you answer.",
        [
          [
            "Interviewer",
            "Why did you leave your last job?",
            "आपने अपनी पिछली नौकरी क्यों छोड़ी?",
          ],
          [
            "Candidate",
            "May I take a moment to think?",
            "क्या मैं सोचने के लिए एक क्षण ले सकता हूँ?",
          ],
          [
            "Interviewer",
            "Yes, please take your time.",
            "हाँ, कृपया आराम से सोचिए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "that-is-a-good-question",
        "That is a good question.",
        "यह एक अच्छा सवाल है।",
        "Use it to give yourself a second before you answer.",
        [
          [
            "Interviewer",
            "How would you handle a deadline?",
            "आप किसी अंतिम तारीख़ को कैसे सँभालेंगे?",
          ],
          ["Candidate", "That is a good question.", "यह एक अच्छा सवाल है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-do-not-have-direct-experience-but",
        "I do not have direct experience, but I am willing to learn.",
        "मुझे सीधा अनुभव नहीं है, पर मैं सीखने के लिए तैयार हूँ।",
        "Use it honestly when you have not done something before.",
        [
          [
            "Interviewer",
            "Have you used this tool?",
            "क्या आपने यह टूल इस्तेमाल किया है?",
          ],
          [
            "Candidate",
            "I do not have direct experience, but I am willing to learn.",
            "मुझे सीधा अनुभव नहीं है, पर मैं सीखने के लिए तैयार हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-would-be-happy-to-give-an",
        "I would be happy to give an example.",
        "मुझे उदाहरण देने में खुशी होगी।",
        "Use it to offer proof for your answer.",
        [
          [
            "Interviewer",
            "Can you support that?",
            "क्या आप इसे समझा सकते हैं?",
          ],
          [
            "Candidate",
            "I would be happy to give an example.",
            "मुझे उदाहरण देने में खुशी होगी।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "do-you-have-any-questions-for-me",
        "Do you have any questions for me?",
        "क्या आपके पास मेरे लिए कोई सवाल है?",
        "Use it in a practice interview to turn the question around.",
        [
          ["Interviewer", "Let us finish here.", "चलिए यहीं समाप्त करते हैं।"],
          [
            "Candidate",
            "Do you have any questions for me?",
            "क्या आपके पास मेरे लिए कोई सवाल है?",
          ],
          [
            "Interviewer",
            "Yes, I do. What does a typical week look like?",
            "हाँ। एक सामान्य हफ़्ता कैसा होता है?",
          ],
        ],
        { type: "arrange" }
      ),
    ],
  },
])
