import { defineLessons } from "@/data/english/author"

/**
 * A tiny valid lesson showing every item kind. It is NOT part of the course: the loader and the index only read
 * `<module>.ts` and `daily/<category>.ts`. Copy the shape into a real file. Notes for authors:
 *  - every English field is plain English; Hindi is Devanagari. In Hindi text put English words in quotes ('am').
 *  - ids are made for you: en.<module>.<lesson>.<item slug>.
 *  - a typed answer matches `en` and `accepted`; contractions are matched both ways automatically (I'm = I am).
 *  - the `answer` kind (Interview English) uses [placeholders]: never write facts for the learner.
 */
export default defineLessons("fundamentals", [
  {
    slug: "greetings",
    title: "Greetings",
    titleHi: "नमस्कार और अभिवादन",
    goal: "Greet someone and say how you are.",
    items: [
      {
        kind: "sentence",
        slug: "good-morning-how-are-you",
        en: "Good morning. How are you today?",
        hi: "सुप्रभात। आज आप कैसे हैं?",
        hiRoman: "Suprabhaat. Aaj aap kaise hain?",
        whenToUse:
          "Use it to greet someone in the morning, at home or at work.",
        example: [
          {
            speaker: "Ravi",
            en: "Good morning, Meera. How are you today?",
            hi: "सुप्रभात, मीरा। आज आप कैसी हैं?",
          },
          {
            speaker: "Meera",
            en: "I'm fine, thank you. And you?",
            hi: "मैं ठीक हूँ, धन्यवाद। और आप?",
          },
        ],
        activity: { type: "arrange" },
        note: {
          en: "Say 'Good morning' only before noon. After noon, say 'Good afternoon'.",
          hi: "'Good morning' दोपहर से पहले ही कहें। दोपहर के बाद 'Good afternoon' कहें।",
        },
      },
      {
        kind: "sentence",
        slug: "i-am-fine-thank-you",
        en: "I'm fine, thank you.",
        hi: "मैं ठीक हूँ, धन्यवाद।",
        whenToUse: "Use it to answer when someone asks how you are.",
        example: [
          { speaker: "Ravi", en: "How are you?", hi: "आप कैसे हैं?" },
          {
            speaker: "Meera",
            en: "I'm fine, thank you.",
            hi: "मैं ठीक हूँ, धन्यवाद।",
          },
        ],
        activity: { type: "type" },
        accepted: ["I am fine, thanks."],
      },
      {
        kind: "vocab",
        slug: "morning",
        word: "morning",
        partOfSpeech: "noun",
        hi: "सुबह",
        exampleEn: "I wake up early in the morning.",
        exampleHi: "मैं सुबह जल्दी उठता हूँ।",
        activity: {
          type: "choose",
          prompt: "At eight o'clock we say good ___.",
          options: ["morning", "night", "evening"],
          answer: "morning",
        },
      },
      {
        kind: "grammar",
        slug: "am-is-are",
        title: "Using 'am', 'is' and 'are'",
        rule: {
          en: "Use 'am' with I, 'is' with he, she and it, and 'are' with you, we and they.",
          hi: "'I' के साथ 'am', 'he', 'she' और 'it' के साथ 'is', और 'you', 'we' और 'they' के साथ 'are' लगाएँ।",
        },
        examples: [
          { en: "I am a student.", hi: "मैं एक विद्यार्थी हूँ।" },
          { en: "She is at home.", hi: "वह घर पर है।" },
          { en: "They are my friends.", hi: "वे मेरे दोस्त हैं।" },
        ],
        commonMistake: {
          wrong: "I is happy.",
          right: "I am happy.",
          why: {
            en: "'I' always goes with 'am'.",
            hi: "'I' के साथ हमेशा 'am' आता है।",
          },
        },
        activity: { type: "blank", text: "She ___ my sister.", answer: "is" },
        note: {
          en: "Do not say 'I am agree'. Say 'I agree'.",
          hi: "'I am agree' नहीं कहते। 'I agree' कहें।",
        },
      },
      {
        kind: "dialogue",
        slug: "meeting-a-colleague",
        title: "Meeting a colleague",
        situation: {
          en: "Two colleagues meet in the morning.",
          hi: "दो सहकर्मी सुबह मिलते हैं।",
        },
        lines: [
          {
            speaker: "Ravi",
            en: "Good morning, Meera.",
            hi: "सुप्रभात, मीरा।",
          },
          {
            speaker: "Meera",
            en: "Good morning, Ravi. How are you?",
            hi: "सुप्रभात, रवि। आप कैसे हैं?",
          },
          {
            speaker: "Ravi",
            en: "I'm well, thanks. And you?",
            hi: "मैं ठीक हूँ, धन्यवाद। और आप?",
          },
          {
            speaker: "Meera",
            en: "I'm fine, thank you.",
            hi: "मैं ठीक हूँ, धन्यवाद।",
          },
        ],
      },
      {
        kind: "answer",
        slug: "tell-me-about-yourself",
        question: "Tell me about yourself.",
        variants: [
          {
            level: "easy",
            en: "My name is [your name]. I live in [your city]. I am a [your job or course]. I like [something you enjoy].",
            hi: "मेरा नाम [आपका नाम] है। मैं [आपका शहर] में रहता हूँ। मैं [आपकी नौकरी या पढ़ाई] हूँ। मुझे [आपकी पसंद] पसंद है।",
          },
          {
            level: "intermediate",
            en: "My name is [your name], and I am a [your job or course] from [your city]. I have worked on [your main project or skill], and I enjoy [what you like about the work]. I am looking for a role where I can [what you want to learn or do].",
            hi: "मेरा नाम [आपका नाम] है, और मैं [आपका शहर] से [आपकी नौकरी या पढ़ाई] हूँ। मैंने [आपका मुख्य प्रोजेक्ट या कौशल] पर काम किया है, और मुझे [काम की पसंदीदा बात] अच्छा लगता है। मैं ऐसी भूमिका खोज रहा हूँ जिसमें मैं [आप क्या सीखना या करना चाहते हैं]।",
          },
          {
            level: "professional",
            en: "Thank you for the opportunity. I am [your name], a [your role] with [your years of experience] in [your main skill]. Most recently I worked on [your recent project], where I was responsible for [your part]. I am now looking for a role where I can contribute [your strength] and keep growing in [your area].",
            hi: "इस अवसर के लिए धन्यवाद। मैं [आपका नाम] हूँ, [आपकी भूमिका], और [आपका मुख्य कौशल] में मेरा [आपके अनुभव के वर्ष] का अनुभव है। हाल ही में मैंने [आपका हालिया प्रोजेक्ट] पर काम किया, जहाँ मेरी ज़िम्मेदारी [आपका हिस्सा] थी। अब मैं ऐसी भूमिका चाहता हूँ जिसमें मैं [आपकी ताक़त] दे सकूँ और [आपका क्षेत्र] में आगे बढ़ता रहूँ।",
          },
        ],
        tips: [
          "Say your name slowly and clearly.",
          "Use only facts that are true for you.",
        ],
      },
    ],
  },
])
