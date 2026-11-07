import { defineLessons } from "@/data/english/author"
import { dialogue, sent } from "@/data/english/kit"

// Draft content: not yet reviewed by an English teacher.
export default defineLessons("speaking", [
  {
    slug: "daily-speaking-exercises",
    title: "Daily speaking exercises",
    titleHi: "रोज़ का बोलने का अभ्यास",
    goal: "Build a small speaking routine you can keep every day.",
    items: [
      sent(
        "today-i-will-speak-english-for-ten",
        "Today I will speak English for ten minutes.",
        "आज मैं दस मिनट अंग्रेज़ी बोलूँगा।",
        "Use it to set a small speaking goal for the day.",
        [
          ["Meera", "What is your plan for today?", "आज आपकी क्या योजना है?"],
          [
            "Ravi",
            "Today I will speak English for ten minutes.",
            "आज मैं दस मिनट अंग्रेज़ी बोलूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-learning-english-step-by-step",
        "I am learning English step by step.",
        "मैं अंग्रेज़ी धीरे-धीरे सीख रहा हूँ।",
        "Use it to explain that you are still learning.",
        [
          [
            "Meera",
            "Do you speak English well?",
            "क्या आप अच्छी अंग्रेज़ी बोलते हैं?",
          ],
          [
            "Ravi",
            "I am learning English step by step.",
            "मैं अंग्रेज़ी धीरे-धीरे सीख रहा हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "every-day-i-learn-five-new-words",
        "Every day I learn five new words.",
        "हर दिन मैं पाँच नए शब्द सीखता हूँ।",
        "Use it to describe a regular study habit.",
        [
          ["Meera", "How do you study?", "आप कैसे पढ़ते हैं?"],
          [
            "Ravi",
            "Every day I learn five new words.",
            "हर दिन मैं पाँच नए शब्द सीखता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-read-one-short-paragraph-aloud",
        "I read one short paragraph aloud.",
        "मैं एक छोटा अनुच्छेद ज़ोर से पढ़ता हूँ।",
        "Use it to describe reading aloud as practice.",
        [
          [
            "Meera",
            "What do you do to improve?",
            "आप सुधार के लिए क्या करते हैं?",
          ],
          [
            "Ravi",
            "I read one short paragraph aloud.",
            "मैं एक छोटा अनुच्छेद ज़ोर से पढ़ता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-describe-my-day-in-simple-sentences",
        "I describe my day in simple sentences.",
        "मैं अपना दिन आसान वाक्यों में बताता हूँ।",
        "Use it to talk about a speaking exercise.",
        [
          [
            "Meera",
            "What exercise do you like?",
            "आपको कौन सा अभ्यास पसंद है?",
          ],
          [
            "Ravi",
            "I describe my day in simple sentences.",
            "मैं अपना दिन आसान वाक्यों में बताता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-listen-to-english-for-a-few",
        "I listen to English for a few minutes.",
        "मैं कुछ मिनट अंग्रेज़ी सुनता हूँ।",
        "Use it to describe your listening practice.",
        [
          [
            "Meera",
            "How do you practise listening?",
            "आप सुनने का अभ्यास कैसे करते हैं?",
          ],
          [
            "Ravi",
            "I listen to English for a few minutes.",
            "मैं कुछ मिनट अंग्रेज़ी सुनता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-not-afraid-of-making-mistakes",
        "I am not afraid of making mistakes.",
        "मुझे गलतियाँ करने से डर नहीं लगता।",
        "Use it to show a healthy attitude to learning.",
        [
          ["Meera", "Are you shy to speak?", "क्या आप बोलने में झिझकते हैं?"],
          [
            "Ravi",
            "I am not afraid of making mistakes.",
            "मुझे गलतियाँ करने से डर नहीं लगता।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-practise-before-i-go-to-sleep",
        "I practise before I go to sleep.",
        "मैं सोने से पहले अभ्यास करता हूँ।",
        "Use it to say when you practise.",
        [
          ["Meera", "When do you practise?", "आप कब अभ्यास करते हैं?"],
          [
            "Ravi",
            "I practise before I go to sleep.",
            "मैं सोने से पहले अभ्यास करता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
    ],
  },
  {
    slug: "joining-ideas",
    title: "Joining ideas in a sentence",
    titleHi: "वाक्यों को जोड़ना",
    goal: "Use and, but, because, if and although to make longer sentences.",
    items: [
      sent(
        "i-wake-up-early-because-i-like",
        "I wake up early because I like the morning.",
        "मैं जल्दी उठता हूँ क्योंकि मुझे सुबह पसंद है।",
        "Use it to give a reason with 'because'.",
        [
          ["Meera", "Why do you wake up early?", "आप जल्दी क्यों उठते हैं?"],
          [
            "Ravi",
            "I wake up early because I like the morning.",
            "मैं जल्दी उठता हूँ क्योंकि मुझे सुबह पसंद है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "she-is-tired-but-she-is-still",
        "She is tired, but she is still working.",
        "वह थकी हुई है, फिर भी काम कर रही है।",
        "Use it to show two ideas that seem opposite.",
        [
          ["Meera", "How is she today?", "वह आज कैसी है?"],
          [
            "Ravi",
            "She is tired, but she is still working.",
            "वह थकी हुई है, फिर भी काम कर रही है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "if-it-rains-we-will-stay-at",
        "If it rains, we will stay at home.",
        "अगर बारिश हुई, तो हम घर पर रहेंगे।",
        "Use it to talk about a plan that depends on something.",
        [
          ["Meera", "What if the weather is bad?", "अगर मौसम खराब हुआ तो?"],
          [
            "Ravi",
            "If it rains, we will stay at home.",
            "अगर बारिश हुई, तो हम घर पर रहेंगे।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-call-you-when-i-reach",
        "I will call you when I reach the station.",
        "जब मैं स्टेशन पहुँचूँगा, तब आपको फ़ोन करूँगा।",
        "Use it to promise a call at a certain time.",
        [
          ["Meera", "Will you call me?", "क्या आप मुझे फ़ोन करेंगे?"],
          [
            "Ravi",
            "I will call you when I reach the station.",
            "जब मैं स्टेशन पहुँचूँगा, तब आपको फ़ोन करूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "he-speaks-slowly-so-that-everyone-can",
        "He speaks slowly so that everyone can understand.",
        "वह धीरे बोलता है ताकि सब समझ सकें।",
        "Use it to say why someone does something.",
        [
          ["Meera", "Why does he speak slowly?", "वह धीरे क्यों बोलता है?"],
          [
            "Ravi",
            "He speaks slowly so that everyone can understand.",
            "वह धीरे बोलता है ताकि सब समझ सकें।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "although-the-road-was-long-we-arrived",
        "Although the road was long, we arrived on time.",
        "सड़क लंबी थी, फिर भी हम समय पर पहुँच गए।",
        "Use it to show a surprising result.",
        [
          ["Meera", "Did you reach on time?", "क्या आप समय पर पहुँचे?"],
          [
            "Ravi",
            "Although the road was long, we arrived on time.",
            "सड़क लंबी थी, फिर भी हम समय पर पहुँच गए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-want-to-buy-a-phone-but",
        "I want to buy a phone, but it is too expensive.",
        "मैं फ़ोन खरीदना चाहता हूँ, पर वह बहुत महँगा है।",
        "Use it to explain a problem with a wish.",
        [
          [
            "Meera",
            "Why have you not bought it?",
            "आपने उसे क्यों नहीं खरीदा?",
          ],
          [
            "Ravi",
            "I want to buy a phone, but it is too expensive.",
            "मैं फ़ोन खरीदना चाहता हूँ, पर वह बहुत महँगा है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "we-can-walk-or-we-can-take",
        "We can walk, or we can take a taxi.",
        "हम पैदल चल सकते हैं, या टैक्सी ले सकते हैं।",
        "Use it to offer two choices.",
        [
          ["Meera", "How shall we go?", "हम कैसे चलें?"],
          [
            "Ravi",
            "We can walk, or we can take a taxi.",
            "हम पैदल चल सकते हैं, या टैक्सी ले सकते हैं।",
          ],
        ],
        { type: "arrange" }
      ),
    ],
  },
  {
    slug: "conversation-practice",
    title: "Conversation practice",
    titleHi: "बातचीत का अभ्यास",
    goal: "Take part in short, common conversations.",
    items: [
      dialogue(
        "in-a-shop",
        "In a shop",
        { en: "A customer buys fruit.", hi: "एक ग्राहक फल खरीदता है।" },
        [
          [
            "Shopkeeper",
            "Good morning. What would you like?",
            "सुप्रभात। आपको क्या चाहिए?",
          ],
          [
            "Customer",
            "I would like one kilo of apples.",
            "मुझे एक किलो सेब चाहिए।",
          ],
          ["Shopkeeper", "Here you are. Anything else?", "यह लीजिए। और कुछ?"],
          [
            "Customer",
            "No, thank you. How much is it?",
            "नहीं, धन्यवाद। कितने हुए?",
          ],
          [
            "Shopkeeper",
            "It is one hundred and twenty rupees.",
            "एक सौ बीस रुपये।",
          ],
        ]
      ),
      dialogue(
        "at-the-railway-station",
        "At the railway station",
        {
          en: "A traveller asks about a train.",
          hi: "एक यात्री ट्रेन के बारे में पूछता है।",
        },
        [
          [
            "Traveller",
            "Excuse me, which platform is the Pune train?",
            "सुनिए, पुणे की ट्रेन किस प्लेटफ़ॉर्म पर है?",
          ],
          [
            "Clerk",
            "It is on platform number three.",
            "वह प्लेटफ़ॉर्म नंबर तीन पर है।",
          ],
          ["Traveller", "When does it leave?", "वह कब जाती है?"],
          [
            "Clerk",
            "It leaves in fifteen minutes.",
            "वह पंद्रह मिनट में जाती है।",
          ],
          ["Traveller", "Thank you for your help.", "आपकी मदद के लिए धन्यवाद।"],
        ]
      ),
      dialogue(
        "meeting-a-neighbour",
        "Meeting a neighbour",
        {
          en: "Two neighbours talk on the road.",
          hi: "दो पड़ोसी सड़क पर बात करते हैं।",
        },
        [
          ["Asha", "Hello. Are you new here?", "नमस्ते। क्या आप यहाँ नए हैं?"],
          ["Kiran", "Yes, we moved in last week.", "हाँ, हम पिछले हफ़्ते आए।"],
          [
            "Asha",
            "Welcome to the street. I live next door.",
            "इस गली में आपका स्वागत है। मैं बगल में रहती हूँ।",
          ],
          [
            "Kiran",
            "Thank you. It is nice to meet you.",
            "धन्यवाद। आपसे मिलकर अच्छा लगा।",
          ],
          [
            "Asha",
            "Please ask me if you need anything.",
            "अगर कुछ चाहिए तो मुझसे पूछिएगा।",
          ],
        ]
      ),
      dialogue(
        "at-the-doctors-clinic",
        "At the doctor's clinic",
        {
          en: "A patient talks to a doctor.",
          hi: "एक मरीज़ डॉक्टर से बात करता है।",
        },
        [
          [
            "Doctor",
            "Please come in. What is the problem?",
            "कृपया अंदर आइए। क्या परेशानी है?",
          ],
          [
            "Patient",
            "I have a headache and a fever.",
            "मुझे सिरदर्द और बुखार है।",
          ],
          ["Doctor", "Since when do you have it?", "यह कब से है?"],
          ["Patient", "Since yesterday evening.", "कल शाम से।"],
          [
            "Doctor",
            "Please take this medicine and rest.",
            "कृपया यह दवा लीजिए और आराम कीजिए।",
          ],
        ]
      ),
      sent(
        "nice-to-meet-you-i-am-happy",
        "Nice to meet you. I am happy to be here.",
        "आपसे मिलकर अच्छा लगा। मुझे यहाँ आकर खुशी है।",
        "Use it when you meet someone at an event.",
        [
          [
            "Meera",
            "Welcome to our party.",
            "हमारी पार्टी में आपका स्वागत है।",
          ],
          [
            "Ravi",
            "Nice to meet you. I am happy to be here.",
            "आपसे मिलकर अच्छा लगा। मुझे यहाँ आकर खुशी है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-tell-me-a-little-about",
        "Could you tell me a little about yourself?",
        "क्या आप अपने बारे में थोड़ा बता सकते हैं?",
        "Use it to start a friendly talk with a new person.",
        [
          [
            "Ravi",
            "Could you tell me a little about yourself?",
            "क्या आप अपने बारे में थोड़ा बता सकते हैं?",
          ],
          ["Meera", "Of course. I am a teacher.", "ज़रूर। मैं एक शिक्षक हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "that-is-interesting-please-tell-me-more",
        "That is interesting. Please tell me more.",
        "यह दिलचस्प है। कृपया और बताइए।",
        "Use it to keep the other person talking.",
        [
          [
            "Meera",
            "I travel to many cities for work.",
            "मैं काम के लिए कई शहरों में जाता हूँ।",
          ],
          [
            "Ravi",
            "That is interesting. Please tell me more.",
            "यह दिलचस्प है। कृपया और बताइए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-was-nice-talking-to-you",
        "It was nice talking to you.",
        "आपसे बात करके अच्छा लगा।",
        "Use it to end a pleasant talk.",
        [
          ["Ravi", "It was nice talking to you.", "आपसे बात करके अच्छा लगा।"],
          ["Meera", "Same here. See you soon.", "मुझे भी। जल्दी मिलते हैं।"],
        ],
        { type: "arrange" }
      ),
    ],
  },
  {
    slug: "question-and-answer-practice",
    title: "Question and answer practice",
    titleHi: "सवाल-जवाब का अभ्यास",
    goal: "Ask and answer everyday personal questions.",
    items: [
      sent(
        "what-do-you-do-in-your-free",
        "What do you do in your free time?",
        "आप खाली समय में क्या करते हैं?",
        "Use it to ask about someone's hobbies.",
        [
          [
            "Ravi",
            "What do you do in your free time?",
            "आप खाली समय में क्या करते हैं?",
          ],
          ["Meera", "I like to read and walk.", "मुझे पढ़ना और टहलना पसंद है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "where-are-you-from",
        "Where are you from?",
        "आप कहाँ के रहने वाले हैं?",
        "Use it to ask about someone's home town.",
        [
          ["Ravi", "Where are you from?", "आप कहाँ के रहने वाले हैं?"],
          ["Meera", "I am from Jaipur.", "मैं जयपुर का रहने वाला हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-is-your-favourite-food",
        "What is your favourite food?",
        "आपका पसंदीदा खाना क्या है?",
        "Use it to start a talk about food.",
        [
          [
            "Ravi",
            "What is your favourite food?",
            "आपका पसंदीदा खाना क्या है?",
          ],
          ["Meera", "I love rice and dal.", "मुझे चावल और दाल बहुत पसंद हैं।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "how-was-your-day",
        "How was your day?",
        "आपका दिन कैसा रहा?",
        "Use it to ask someone about their day in the evening.",
        [
          ["Ravi", "How was your day?", "आपका दिन कैसा रहा?"],
          ["Meera", "It was busy but good.", "व्यस्त रहा, पर अच्छा रहा।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "do-you-have-any-brothers-or-sisters",
        "Do you have any brothers or sisters?",
        "क्या आपके कोई भाई या बहन हैं?",
        "Use it to ask about someone's family.",
        [
          [
            "Ravi",
            "Do you have any brothers or sisters?",
            "क्या आपके कोई भाई या बहन हैं?",
          ],
          ["Meera", "I have one younger sister.", "मेरी एक छोटी बहन है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-time-do-you-go-to-bed",
        "What time do you go to bed?",
        "आप कितने बजे सोते हैं?",
        "Use it to ask about a daily habit.",
        [
          ["Ravi", "What time do you go to bed?", "आप कितने बजे सोते हैं?"],
          ["Meera", "I go to bed at ten.", "मैं दस बजे सोता हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "which-language-do-you-speak-at-home",
        "Which language do you speak at home?",
        "आप घर पर कौन सी भाषा बोलते हैं?",
        "Use it to ask about someone's home language.",
        [
          [
            "Ravi",
            "Which language do you speak at home?",
            "आप घर पर कौन सी भाषा बोलते हैं?",
          ],
          ["Meera", "We speak Hindi at home.", "हम घर पर हिंदी बोलते हैं।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "what-are-you-doing-this-evening",
        "What are you doing this evening?",
        "आप आज शाम क्या कर रहे हैं?",
        "Use it to ask about someone's plan for the evening.",
        [
          [
            "Ravi",
            "What are you doing this evening?",
            "आप आज शाम क्या कर रहे हैं?",
          ],
          ["Meera", "I am meeting a friend.", "मैं एक दोस्त से मिल रहा हूँ।"],
        ],
        { type: "arrange" }
      ),
    ],
  },
  {
    slug: "pronunciation-practice",
    title: "Pronunciation practice",
    titleHi: "उच्चारण का अभ्यास",
    goal: "Practise clear sounds by saying short sentences slowly.",
    items: [
      sent(
        "she-sells-sea-shells-by-the-sea",
        "She sells sea shells by the sea shore.",
        "वह समुद्र के किनारे सीपियाँ बेचती है।",
        "Say it slowly to practise the 'sh' and 's' sounds.",
        [
          ["Meera", "Try this one slowly.", "इसे धीरे-धीरे बोलकर देखिए।"],
          [
            "Ravi",
            "She sells sea shells by the sea shore.",
            "वह समुद्र के किनारे सीपियाँ बेचती है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "the-thin-thief-thinks-about-three-things",
        "The thin thief thinks about three things.",
        "दुबला चोर तीन बातों के बारे में सोचता है।",
        "Say it slowly to practise the 'th' sound.",
        [
          ["Meera", "Now try the 'th' sound.", "अब 'th' की ध्वनि आज़माइए।"],
          [
            "Ravi",
            "The thin thief thinks about three things.",
            "दुबला चोर तीन बातों के बारे में सोचता है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "very-few-vegetables-are-in-the-van",
        "Very few vegetables are in the van.",
        "वैन में बहुत कम सब्ज़ियाँ हैं।",
        "Say it slowly to practise the 'v' sound.",
        [
          ["Meera", "Now try the 'v' sound.", "अब 'v' की ध्वनि आज़माइए।"],
          [
            "Ravi",
            "Very few vegetables are in the van.",
            "वैन में बहुत कम सब्ज़ियाँ हैं।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-put-the-pen-in-the-pocket",
        "Please put the pen in the pocket.",
        "कृपया पेन जेब में रखिए।",
        "Say it slowly to practise the 'p' sound.",
        [
          ["Meera", "Now try the 'p' sound.", "अब 'p' की ध्वनि आज़माइए।"],
          [
            "Ravi",
            "Please put the pen in the pocket.",
            "कृपया पेन जेब में रखिए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "ship-the-sheep-to-the-shore",
        "Ship the sheep to the shore.",
        "भेड़ों को जहाज़ से किनारे ले जाइए।",
        "Say it slowly to tell 'ship' and 'sheep' apart.",
        [
          [
            "Meera",
            "Say these two words clearly.",
            "इन दो शब्दों को साफ़ बोलिए।",
          ],
          [
            "Ravi",
            "Ship the sheep to the shore.",
            "भेड़ों को जहाज़ से किनारे ले जाइए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "we-went-west-on-a-wet-wednesday",
        "We went west on a wet Wednesday.",
        "हम गीले बुधवार को पश्चिम की ओर गए।",
        "Say it slowly to practise the 'w' sound.",
        [
          ["Meera", "Now try the 'w' sound.", "अब 'w' की ध्वनि आज़माइए।"],
          [
            "Ravi",
            "We went west on a wet Wednesday.",
            "हम गीले बुधवार को पश्चिम की ओर गए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "red-lorries-roll-along-the-road",
        "Red lorries roll along the road.",
        "लाल लॉरियाँ सड़क पर चलती हैं।",
        "Say it slowly to practise the 'r' and 'l' sounds.",
        [
          [
            "Meera",
            "Now try the 'r' and 'l' sounds.",
            "अब 'r' और 'l' की ध्वनियाँ आज़माइए।",
          ],
          [
            "Ravi",
            "Red lorries roll along the road.",
            "लाल लॉरियाँ सड़क पर चलती हैं।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "say-it-slowly-and-clearly",
        "Say it slowly and clearly.",
        "इसे धीरे और साफ़ बोलिए।",
        "Use it as a reminder every time you practise.",
        [
          ["Meera", "How should I practise?", "मैं अभ्यास कैसे करूँ?"],
          ["Ravi", "Say it slowly and clearly.", "इसे धीरे और साफ़ बोलिए।"],
        ],
        { type: "arrange" }
      ),
    ],
  },
  {
    slug: "listening-exercises",
    title: "Listening exercises",
    titleHi: "सुनने के अभ्यास",
    goal: "Listen carefully, then say the sentence back.",
    items: [
      sent(
        "please-listen-carefully",
        "Please listen carefully.",
        "कृपया ध्यान से सुनिए।",
        "Use it before you play or say something that must be heard clearly.",
        [
          ["Ravi", "Please listen carefully.", "कृपया ध्यान से सुनिए।"],
          ["Meera", "I am ready.", "मैं तैयार हूँ।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "now-say-it-back-to-me",
        "Now say it back to me.",
        "अब इसे मुझे दोहराइए।",
        "Use it in a listening and speaking exercise.",
        [
          ["Meera", "I heard the sentence.", "मैंने वाक्य सुन लिया।"],
          ["Ravi", "Now say it back to me.", "अब इसे मुझे दोहराइए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-did-not-catch-the-last-word",
        "I did not catch the last word.",
        "मैं आखिरी शब्द नहीं सुन पाया।",
        "Use it when you missed part of a sentence.",
        [
          [
            "Ravi",
            "I did not catch the last word.",
            "मैं आखिरी शब्द नहीं सुन पाया।",
          ],
          ["Meera", "It was the word 'station'.", "वह शब्द 'station' था।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "could-you-play-it-once-more",
        "Could you play it once more?",
        "क्या आप इसे एक बार और बजा सकते हैं?",
        "Use it to ask for an audio to be repeated.",
        [
          [
            "Ravi",
            "Could you play it once more?",
            "क्या आप इसे एक बार और बजा सकते हैं?",
          ],
          ["Meera", "Yes, listen again.", "हाँ, फिर से सुनिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "can-you-hear-the-difference",
        "Can you hear the difference?",
        "क्या आप अंतर सुन पा रहे हैं?",
        "Use it to compare two similar sounds.",
        [
          [
            "Ravi",
            "Can you hear the difference?",
            "क्या आप अंतर सुन पा रहे हैं?",
          ],
          ["Meera", "Yes, the second one is longer.", "हाँ, दूसरा लंबा है।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-understood-most-of-it",
        "I understood most of it.",
        "मैं उसका ज़्यादातर हिस्सा समझ गया।",
        "Use it to say that you followed the main idea.",
        [
          ["Meera", "Did you follow the talk?", "क्या आप बात समझ गए?"],
          [
            "Ravi",
            "I understood most of it.",
            "मैं उसका ज़्यादातर हिस्सा समझ गया।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-speak-a-bit-louder",
        "Please speak a bit louder.",
        "कृपया थोड़ा और ज़ोर से बोलिए।",
        "Use it when you cannot hear someone well.",
        [
          [
            "Ravi",
            "Please speak a bit louder.",
            "कृपया थोड़ा और ज़ोर से बोलिए।",
          ],
          ["Meera", "Is this better?", "क्या यह ठीक है?"],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-us-listen-to-the-next-one",
        "Let us listen to the next one.",
        "चलिए अगला सुनते हैं।",
        "Use it to move on to the next listening exercise.",
        [
          ["Ravi", "Let us listen to the next one.", "चलिए अगला सुनते हैं।"],
          ["Meera", "Yes, play the next one.", "हाँ, अगला बजाइए।"],
        ],
        { type: "arrange" }
      ),
    ],
  },
  {
    slug: "confidence-building",
    title: "Building confidence",
    titleHi: "आत्मविश्वास बढ़ाना",
    goal: "Use calm phrases that help you keep speaking.",
    items: [
      sent(
        "i-can-speak-english-a-little-more",
        "I can speak English a little more every day.",
        "मैं हर दिन थोड़ी और अंग्रेज़ी बोल सकता हूँ।",
        "Use it to remind yourself that you are improving.",
        [
          ["Meera", "Do you feel nervous?", "क्या आप घबराए हुए हैं?"],
          [
            "Ravi",
            "I can speak English a little more every day.",
            "मैं हर दिन थोड़ी और अंग्रेज़ी बोल सकता हूँ।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "it-is-fine-to-make-mistakes-while",
        "It is fine to make mistakes while learning.",
        "सीखते समय गलतियाँ होना ठीक है।",
        "Use it to stay calm after a mistake.",
        [
          ["Meera", "I made a mistake.", "मुझसे गलती हो गई।"],
          [
            "Ravi",
            "It is fine to make mistakes while learning.",
            "सीखते समय गलतियाँ होना ठीक है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-speak-slowly-and-clearly",
        "I will speak slowly and clearly.",
        "मैं धीरे और साफ़ बोलूँगा।",
        "Use it to promise yourself a calm speaking style.",
        [
          ["Meera", "Please do not rush.", "कृपया जल्दबाज़ी मत कीजिए।"],
          [
            "Ravi",
            "I will speak slowly and clearly.",
            "मैं धीरे और साफ़ बोलूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "please-give-me-a-moment-to-think",
        "Please give me a moment to think.",
        "कृपया मुझे सोचने के लिए एक क्षण दीजिए।",
        "Use it when you need time before you answer.",
        [
          [
            "Meera",
            "What do you think about it?",
            "आप इसके बारे में क्या सोचते हैं?",
          ],
          [
            "Ravi",
            "Please give me a moment to think.",
            "कृपया मुझे सोचने के लिए एक क्षण दीजिए।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "let-me-say-that-in-a-different",
        "Let me say that in a different way.",
        "मुझे इसे दूसरे तरीके से कहने दीजिए।",
        "Use it when your first sentence was not clear.",
        [
          [
            "Ravi",
            "Let me say that in a different way.",
            "मुझे इसे दूसरे तरीके से कहने दीजिए।",
          ],
          ["Meera", "Yes, please go ahead.", "हाँ, कृपया कहिए।"],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-am-proud-of-my-progress",
        "I am proud of my progress.",
        "मुझे अपनी प्रगति पर गर्व है।",
        "Use it to celebrate how far you have come.",
        [
          ["Meera", "How is your English now?", "आपकी अंग्रेज़ी अब कैसी है?"],
          [
            "Ravi",
            "I am proud of my progress.",
            "मुझे अपनी प्रगति पर गर्व है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-do-not-need-perfect-english-to",
        "I do not need perfect English to be understood.",
        "समझे जाने के लिए मुझे पूरी तरह सही अंग्रेज़ी की ज़रूरत नहीं है।",
        "Use it to remember that clear speaking matters most.",
        [
          [
            "Meera",
            "I am afraid I will say it wrong.",
            "मुझे डर है कि मैं गलत बोल दूँगा।",
          ],
          [
            "Ravi",
            "I do not need perfect English to be understood.",
            "समझे जाने के लिए मुझे पूरी तरह सही अंग्रेज़ी की ज़रूरत नहीं है।",
          ],
        ],
        { type: "arrange" }
      ),
      sent(
        "i-will-keep-practising-every-day",
        "I will keep practising every day.",
        "मैं हर दिन अभ्यास करता रहूँगा।",
        "Use it to end a study session with a promise.",
        [
          ["Meera", "What is your plan now?", "अब आपकी क्या योजना है?"],
          [
            "Ravi",
            "I will keep practising every day.",
            "मैं हर दिन अभ्यास करता रहूँगा।",
          ],
        ],
        { type: "arrange" }
      ),
    ],
  },
])
