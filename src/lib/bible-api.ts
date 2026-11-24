/**
 * Bible API Service
 * Supports multiple Bible API providers with fallback
 */

import type { BibleVerse, BibleTranslation, LanguageCode, ApiResponse, DailyVerseData } from '@/types';

// API Configuration
const API_CONFIG = {
  ESV: {
    baseUrl: 'https://api.esv.org/v3',
    key: import.meta.env.ESV_API_KEY || '',
    rateLimit: 500, // per day
  },
  BIBLE_GET: {
    baseUrl: 'https://bible-api.com',
    key: '',
    rateLimit: 10000, // generous
  },
  API_BIBLE: {
    baseUrl: 'https://api.scripture.api.bible/v1',
    key: import.meta.env.API_BIBLE_KEY || '',
    rateLimit: 5000, // per month
  },
};

// Default translations per language
export const DEFAULT_TRANSLATIONS: Record<LanguageCode, BibleTranslation[]> = {
  en: [
    { code: 'ESV', name: 'ESV', fullName: 'English Standard Version', copyright: 'Crossway', apiIdentifier: 'ESV', hasAudio: true, isDefault: true },
    { code: 'NIV', name: 'NIV', fullName: 'New International Version', copyright: 'Biblica', apiIdentifier: 'NIV', hasAudio: true, isDefault: false },
    { code: 'KJV', name: 'KJV', fullName: 'King James Version', copyright: 'Public Domain', apiIdentifier: 'KJV', hasAudio: true, isDefault: false },
    { code: 'NLT', name: 'NLT', fullName: 'New Living Translation', copyright: 'Tyndale', apiIdentifier: 'NLT', hasAudio: true, isDefault: false },
  ],
  hi: [
    { code: 'OV', name: 'OV', fullName: 'OV Hindi Bible', copyright: 'Bible Society of India', apiIdentifier: 'HI-OV', hasAudio: true, isDefault: true },
    { code: 'NCV', name: 'NCV', fullName: 'New Century Version Hindi', copyright: 'Thomas Nelson', apiIdentifier: 'HI-NCV', hasAudio: false, isDefault: false },
    { code: 'ERV', name: 'ERV', fullName: 'Easy-to-Read Version Hindi', copyright: 'World Bible Translation Center', apiIdentifier: 'HI-ERV', hasAudio: false, isDefault: false },
  ],
  ta: [
    { code: 'TCV', name: 'TCV', fullName: 'Tamil Contemporary Version', copyright: 'Bible Society of India', apiIdentifier: 'TA-TCV', hasAudio: false, isDefault: true },
  ],
  te: [
    { code: 'OTV', name: 'OTV', fullName: 'Old Telugu Version', copyright: 'Bible Society of India', apiIdentifier: 'TE-OTV', hasAudio: false, isDefault: true },
  ],
  bn: [
    { code: 'BBB', name: 'BBB', fullName: 'Bengali Bible', copyright: 'Bible Society of India', apiIdentifier: 'BN-BBB', hasAudio: false, isDefault: true },
  ],
  mr: [
    { code: 'MAR', name: 'MAR', fullName: 'Marathi Bible', copyright: 'Bible Society of India', apiIdentifier: 'MR-MAR', hasAudio: false, isDefault: true },
  ],
  gu: [
    { code: 'GUJ', name: 'GUJ', fullName: 'Gujarati Bible', copyright: 'Bible Society of India', apiIdentifier: 'GU-GUJ', hasAudio: false, isDefault: true },
  ],
  kn: [
    { code: 'KAN', name: 'KAN', fullName: 'Kannada Bible', copyright: 'Bible Society of India', apiIdentifier: 'KN-KAN', hasAudio: false, isDefault: true },
  ],
  ml: [
    { code: 'ML', name: 'ML', fullName: 'Malayalam Bible', copyright: 'Bible Society of India', apiIdentifier: 'ML-ML', hasAudio: false, isDefault: true },
  ],
  or: [
    { code: 'ORI', name: 'ORI', fullName: 'Odia Bible', copyright: 'Bible Society of India', apiIdentifier: 'OR-ORI', hasAudio: false, isDefault: true },
  ],
  pa: [
    { code: 'PUN', name: 'PUN', fullName: 'Punjabi Bible', copyright: 'Bible Society of India', apiIdentifier: 'PA-PUN', hasAudio: false, isDefault: true },
  ],
  ur: [
    { code: 'URD', name: 'URD', fullName: 'Urdu Bible', copyright: 'Bible Society of India', apiIdentifier: 'UR-URD', hasAudio: false, isDefault: true, direction: 'rtl' },
  ],
};

// Lectionary-based daily verses (Revised Common Lectionary - simplified)
// In production, this would come from a proper lectionary API or database
const DAILY_VERSES: Record<string, Omit<BibleVerse, 'translation' | 'translationCode' | 'language'>> = {
  '2026-01-01': { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.', date: '2026-01-01' },
  '2026-01-02': { reference: 'Philippians 4:13', text: 'I can do all things through him who strengthens me.', date: '2026-01-02' },
  '2026-01-03': { reference: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', date: '2026-01-03' },
  '2026-01-04': { reference: 'Romans 8:28', text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.', date: '2026-01-04' },
  '2026-01-05': { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.', date: '2026-01-05' },
  '2026-01-06': { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.', date: '2026-01-06' },
  '2026-01-07': { reference: 'Matthew 6:33', text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.', date: '2026-01-07' },
  '2026-01-08': { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.', date: '2026-01-08' },
  '2026-01-09': { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.', date: '2026-01-09' },
  '2026-01-10': { reference: 'Romans 12:2', text: 'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.', date: '2026-01-10' },
  '2026-01-11': { reference: '1 Peter 5:7', text: 'Casting all your anxieties on him, because he cares for you.', date: '2026-01-11' },
  '2026-01-12': { reference: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.', date: '2026-01-12' },
  '2026-01-13': { reference: '2 Corinthians 12:9', text: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness."', date: '2026-01-13' },
  '2026-01-14': { reference: 'Galatians 5:22-23', text: 'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law.', date: '2026-01-14' },
  '2026-01-15': { reference: 'John 3:16', text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', date: '2026-01-15' },
  '2026-01-16': { reference: 'Ephesians 2:8-9', text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.', date: '2026-01-16' },
  '2026-01-17': { reference: 'Psalm 139:14', text: 'I praise you, for I am fearfully and wonderfully made. Wonderful are your works; my soul knows it very well.', date: '2026-01-17' },
  '2026-01-18': { reference: 'Isaiah 40:31', text: 'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.', date: '2026-01-18' },
  '2026-01-19': { reference: 'Hebrews 11:1', text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.', date: '2026-01-19' },
  '2026-01-20': { reference: '1 John 1:9', text: 'If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.', date: '2026-01-20' },
  '2026-01-21': { reference: 'Colossians 3:23', text: 'Whatever you do, work heartily, as for the Lord and not for men.', date: '2026-01-21' },
  '2026-01-22': { reference: 'Psalm 37:4', text: 'Delight yourself in the Lord, and he will give you the desires of your heart.', date: '2026-01-22' },
  '2026-01-23': { reference: 'James 1:5', text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.', date: '2026-01-23' },
  '2026-01-24': { reference: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.', date: '2026-01-24' },
  '2026-01-25': { reference: 'Matthew 11:28', text: 'Come to me, all who labor and are heavy laden, and I will give you rest.', date: '2026-01-25' },
  '2026-01-26': { reference: 'Psalm 51:10', text: 'Create in me a clean heart, O God, and renew a right spirit within me.', date: '2026-01-26' },
  '2026-01-27': { reference: '2 Timothy 1:7', text: 'For God gave us a spirit not of fear but of power and love and self-control.', date: '2026-01-27' },
  '2026-01-28': { reference: '1 Corinthians 13:4-7', text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice at wrongdoing, but rejoices with the truth. Love bears all things, believes all things, hopes all things, endures all things.', date: '2026-01-28' },
  '2026-01-29': { reference: 'Psalm 91:1-2', text: 'He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. I will say to the Lord, "My refuge and my fortress, my God, in whom I trust."', date: '2026-01-29' },
  '2026-01-30': { reference: 'John 14:27', text: 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.', date: '2026-01-30' },
  '2026-01-31': { reference: 'Revelation 3:20', text: 'Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in to him and eat with him, and he with me.', date: '2026-01-31' },
};

// Hindi verses (same references, Hindi text)
const DAILY_VERSES_HI: Record<string, Omit<BibleVerse, 'translation' | 'translationCode' | 'language'>> = {
  '2026-01-01': { reference: 'यिर्मयाह 29:11', text: 'क्योंकि मैं उन योजनाओं को जानता हूं जो मैंने तुम्हारे लिये बनाई हैं, यहोवा की यह वाणी है, कल्याण की योजनाएं हैं, विपत्ति की नहीं, ताकि तुम्हें भविष्य और आशा दी जाए।', date: '2026-01-01' },
  '2026-01-02': { reference: 'फिलिप्पियों 4:13', text: 'मैं उसमें जो मुझे सामर्थ देता है, सब कुछ कर सकता हूँ।', date: '2026-01-02' },
  '2026-01-03': { reference: 'भजन संहिता 23:1', text: 'यहोवा मेरा चरवाहा है, मुझे कुछ घटी न होगी।', date: '2026-01-03' },
  '2026-01-04': { reference: 'रोमियों 8:28', text: 'और हम जानते हैं कि जो लोग परमेश्वर से प्रेम रखते हैं, उनके लिये सब बातें मिलकर भलाई ही को उत्पन्न करती हैं; अर्थात् उन्हीं के लिये जो उसकी इच्छा के अनुसार बुलाए गए हैं।', date: '2026-01-04' },
  '2026-01-05': { reference: 'नीतिवचन 3:5-6', text: 'अपने पूरे मन से यहोवा पर भरोसा रख, और अपनी समझ का सहारा न ले। उसी को स्मरण करके सब काम कर, तब वह तेरे लिये सीधा मार्ग निकालेगा।', date: '2026-01-05' },
  '2026-01-06': { reference: 'यशायाह 41:10', text: 'मत डर, क्योंकि मैं तेरे संग हूँ, इधर-उधर मत ताक, क्योंकि मैं तेरा परमेश्वर हूँ; मैं तुझे दृढ़ करूँगा और तेरी सहायता करूँगा, अपने धर्ममय दाहिने हाथ से तुझे सम्भाले रहूँगा।', date: '2026-01-06' },
  '2026-01-07': { reference: 'मत्ती 6:33', text: 'इसलिए पहले तुम परमेश्वर के राज्य और उसकी धार्मिकता की खोज करो, तो ये सब वस्तुएँ भी तुम्हें मिल जाएँगी।', date: '2026-01-07' },
  '2026-01-08': { reference: 'भजन संहिता 46:1', text: 'परमेश्वर हमारा शरणस्थान और बल है, संकट में अति सहज से मिलने वाला सहायक।', date: '2026-01-08' },
  '2026-01-09': { reference: 'यहोशू 1:9', text: 'क्या मैं ने तुझे आज्ञा नहीं दी? हियाव बाँधकर दृढ़ हो जा; भय न खा, और तेरा मन कच्चा न हो; क्योंकि तेरा परमेश्वर यहोवा जहाँ कहीं तू जाए वहाँ तेरे संग है।', date: '2026-01-09' },
  '2026-01-10': { reference: 'रोमियों 12:2', text: 'इस संसार के सदृश न बनो; बल्कि अपनी बुद्धि के नये हो जाने से तुम्हारा चाल-चलन भी बदलता जाए, जिससे तुम परमेश्वर की भली, और भावती, और सिद्ध इच्छा अनुभव से मालूम करते रहो।', date: '2026-01-10' },
  '2026-01-11': { reference: '1 पतरस 5:7', text: 'अपनी सारी चिन्ता उसी पर डाल दो, क्योंकि उसको तुम्हारा ध्यान है।', date: '2026-01-11' },
  '2026-01-12': { reference: 'भजन संहिता 119:105', text: 'तेरा वचन मेरे पाँव के लिये दीपक, और मेरे मार्ग के लिये उजियाला है।', date: '2026-01-12' },
  '2026-01-13': { reference: '2 कुरिन्थियों 12:9', text: 'उसने मुझ से कहा, "मेरा अनुग्रह तेरे लिये बहुत है; क्योंकि मेरी सामर्थ निर्बलता में सिद्ध होती है।"', date: '2026-01-13' },
  '2026-01-14': { reference: 'गलातियों 5:22-23', text: 'पर आत्मा का फल प्रेम, आनन्द, मेल, धीरज, कृपा, भलाई, विश्वास, नम्रता, संयम है; ऐसे ऐसे के विरोध में कोई व्यवस्था नहीं।', date: '2026-01-14' },
  '2026-01-15': { reference: 'यूहन्ना 3:16', text: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उसने अपना एकलौता पुत्र दे दिया, ताकि जो कोई उस पर विश्वास करे, वह नाश न हो, परन्तु अनन्त जीवन पाए।', date: '2026-01-15' },
  '2026-01-16': { reference: 'इफिसियों 2:8-9', text: 'क्योंकि विश्वास के द्वारा अनुग्रह ही से तुम्हारा उद्धार हुआ है, और यह तुम्हारी ओर से नहीं, वरन् परमेश्वर का दान है; और न कर्मों के कारण, ऐसा न हो कि कोई घमण्ड करे।', date: '2026-01-16' },
  '2026-01-17': { reference: 'भजन संहिता 139:14', text: 'मैं तेरा धन्यवाद करूँगा, क्योंकि मैं भयानक और अद्भुत रीति से रचा गया हूँ। तेरे काम आश्चर्यकर्म हैं, और मेरा प्राण इसे भली भाँति जानता है।', date: '2026-01-17' },
  '2026-01-18': { reference: 'यशायाह 40:31', text: 'परन्तु जो यहोवा की बाट जोहते हैं, वे नया बल प्राप्त करते जाएँगे, वे उकाबों के समान पंख लगाकर उड़ेंगे, वे दौड़ेंगे और श्रमित न होंगे, चलेंगे और थकित न होंगे।', date: '2026-01-18' },
  '2026-01-19': { reference: 'इब्रानियों 11:1', text: 'विश्वास आशा की हुई वस्तुओं का निश्चय, और अनदेखी वस्तुओं का प्रमाण है।', date: '2026-01-19' },
  '2026-01-20': { reference: '1 यूहन्ना 1:9', text: 'यदि हम अपने पापों को मान लें, तो वह हमारे पापों को क्षमा करने, और हमें सब अधर्म से शुद्ध करने में विश्वासयोग्य और धर्मी है।', date: '2026-01-20' },
  '2026-01-21': { reference: 'कुलुस्सियों 3:23', text: 'जो कुछ तुम करो, तन मन से करो, यह समझकर कि मनुष्यों के लिये नहीं, परन्तु प्रभु के लिये करते हो।', date: '2026-01-21' },
  '2026-01-22': { reference: 'भजन संहिता 37:4', text: 'यहोवा को अपने सुख का मूल जान, और वह तेरे मनोरथों को पूरा करेगा।', date: '2026-01-22' },
  '2026-01-23': { reference: 'याकूब 1:5', text: 'यदि तुम में से किसी को बुद्धि की घटी हो, तो परमेश्वर से माँगे, जो बिना उलाहना दिए सब को उदारता से देता है, और उसको दी जाएगी।', date: '2026-01-23' },
  '2026-01-24': { reference: 'रोमियों 15:13', text: 'आशा का परमेश्वर तुम्हें विश्वास करने में सब प्रकार के आनन्द और शान्ति से परिपूर्ण करे, कि तुम पवित्र आत्मा की सामर्थ से आशा में बढ़ते जाओ।', date: '2026-01-24' },
  '2026-01-25': { reference: 'मत्ती 11:28', text: 'हे सब परिश्रम करने वालो और बोझ से दबे हुए लोगो, मेरे पास आओ; मैं तुम्हें विश्राम दूँगा।', date: '2026-01-25' },
  '2026-01-26': { reference: 'भजन संहिता 51:10', text: 'हे परमेश्वर, मेरे अन्दर शुद्ध मन उत्पन्न कर, और मेरे भीतर स्थिर आत्मा नये सिरे से उत्पन्न कर।', date: '2026-01-26' },
  '2026-01-27': { reference: '2 तीमुथियुस 1:7', text: 'क्योंकि परमेश्वर ने हमें भय की नहीं, पर सामर्थ, और प्रेम, और संयम की आत्मा दी है।', date: '2026-01-27' },
  '2026-01-28': { reference: '1 कुरिन्थियों 13:4-7', text: 'प्रेम धीरजवन्त है, और कृपालु है; प्रेम डाह नहीं करता; प्रेम अपनी बड़ाई नहीं करता, और फूलता नहीं। वह अनुचित व्यवहार नहीं करता, अपनी भलाई नहीं चाहता, झुँझलाता नहीं, बुरा नहीं मानता। कुकर्म से आनन्दित नहीं होता, परन्तु सत्य से आनन्दित होता है। वह सब कुछ सह लेता है, सब बातों पर विश्वास करता है, सब बातों की आशा रखता है, सब कुछ में धीरज धरता है।', date: '2026-01-28' },
  '2026-01-29': { reference: 'भजन संहिता 91:1-2', text: 'जो परमप्रधान के छाए हुए स्थान में बैठा रहे, वह सर्वशक्तिमान की छाया में ठिकाना पाएगा। मैं यहोवा के विषय में कहूँगा, वह मेरा शरणस्थान और मेरा गढ़ है; वह मेरा परमेश्वर है, जिस पर मैं भरोसा रखूँगा।', date: '2026-01-29' },
  '2026-01-30': { reference: 'यूहन्ना 14:27', text: 'मैं तुम्हें शान्ति दिए जाता हूँ, अपनी शान्ति तुम्हें देता हूँ; जैसे संसार देता है, मैं तुम्हें नहीं देता: तुम्हारा मन व्याकुल न हो, और न डरे।', date: '2026-01-30' },
  '2026-01-31': { reference: 'प्रकाशितवाक्य 3:20', text: 'देख, मैं द्वार पर खड़ा हुआ खटखटाता हूँ; यदि कोई मेरा शब्द सुनकर द्वार खोलेगा, तो मैं उसके पास भीतर आकर उसके साथ भोजन करूँगा, और वह मेरे साथ।', date: '2026-01-31' },
};

// Cache for API responses
const verseCache = new Map<string, BibleVerse>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(reference: string, translation: string, language: LanguageCode): string {
  return `${language}:${translation}:${reference}`;
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

export async function fetchVerseFromESV(reference: string, translation: string = 'ESV'): Promise<BibleVerse | null> {
  if (!API_CONFIG.ESV.key) return null;

  try {
    const response = await fetch(
      `${API_CONFIG.ESV.baseUrl}/passage/text/?q=${encodeURIComponent(reference)}&include-passage-references=false&include-footnotes=false&include-subheadings=false`,
      {
        headers: {
          'Authorization': `Token ${API_CONFIG.ESV.key}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      reference,
      text: data.passages?.[0]?.trim() || '',
      translation: 'English Standard Version',
      translationCode: 'ESV',
      language: 'en',
      date: new Date().toISOString().split('T')[0],
      copyright: 'Crossway',
    };
  } catch {
    return null;
  }
}

export async function fetchVerseFromBibleGet(reference: string, translation: string = 'KJV'): Promise<BibleVerse | null> {
  try {
    const response = await fetch(`${API_CONFIG.BIBLE_GET.baseUrl}/${encodeURIComponent(reference)}?translation=${translation}`);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      reference: data.reference,
      text: data.text,
      translation: data.translation_name || translation,
      translationCode: translation,
      language: 'en',
      date: new Date().toISOString().split('T')[0],
      copyright: data.copyright || 'Public Domain',
    };
  } catch {
    return null;
  }
}

export async function fetchVerseFromAPIBible(reference: string, translationId: string): Promise<BibleVerse | null> {
  if (!API_CONFIG.API_BIBLE.key) return null;

  try {
    // First get the passage ID
    const searchResponse = await fetch(
      `${API_CONFIG.API_BIBLE.baseUrl}/bibles/${translationId}/search?query=${encodeURIComponent(reference)}&limit=1`,
      {
        headers: { 'api-key': API_CONFIG.API_BIBLE.key },
      }
    );

    if (!searchResponse.ok) return null;

    const searchData = await searchResponse.json();
    const passageId = searchData.data?.verses?.[0]?.id;

    if (!passageId) return null;

    // Get the passage content
    const passageResponse = await fetch(
      `${API_CONFIG.API_BIBLE.baseUrl}/bibles/${translationId}/passages/${passageId}`,
      {
        headers: { 'api-key': API_CONFIG.API_BIBLE.key },
      }
    );

    if (!passageResponse.ok) return null;

    const passageData = await passageResponse.json();
    return {
      reference,
      text: passageData.data?.content?.replace(/<[^>]*>/g, '') || '',
      translation: passageData.data?.bible?.name || translationId,
      translationCode: translationId,
      language: 'en', // Would need to map from translation
      date: new Date().toISOString().split('T')[0],
      copyright: passageData.data?.copyright || '',
    };
  } catch {
    return null;
  }
}

export async function getDailyVerse(date: Date = new Date(), language: LanguageCode = 'en', translationCode?: string): Promise<ApiResponse<DailyVerseData>> {
  const dateStr = date.toISOString().split('T')[0];
  const cacheKey = `daily:${language}:${translationCode || 'default'}:${dateStr}`;

  // Check cache first
  const cached = verseCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp || 0)) {
    return {
      data: {
        verse: cached,
        previousDate: getPreviousDate(dateStr),
        nextDate: getNextDate(dateStr),
      },
      error: null,
      success: true,
      cached: true,
      timestamp: new Date().toISOString(),
    };
  }

  // Get verse from local data (primary) or API (fallback)
  let verseData: BibleVerse | null = null;

  if (language === 'hi') {
    const localVerse = DAILY_VERSES_HI[dateStr];
    if (localVerse) {
      const translations = DEFAULT_TRANSLATIONS.hi;
      const translation = translations.find(t => t.code === translationCode) || translations.find(t => t.isDefault) || translations[0];
      verseData = {
        ...localVerse,
        translation: translation.fullName,
        translationCode: translation.code,
        language: 'hi',
        date: dateStr,
      };
    }
  } else {
    const localVerse = DAILY_VERSES[dateStr];
    if (localVerse) {
      const translations = DEFAULT_TRANSLATIONS.en;
      const translation = translations.find(t => t.code === translationCode) || translations.find(t => t.isDefault) || translations[0];
      verseData = {
        ...localVerse,
        translation: translation.fullName,
        translationCode: translation.code,
        language: 'en',
        date: dateStr,
      };
    }
  }

  // Fallback to API if no local verse
  if (!verseData) {
    const reference = Object.values(DAILY_VERSES).find(v => v.date === dateStr)?.reference;
    if (reference) {
      if (language === 'hi') {
        // Try API Bible for Hindi
        const hiTranslation = DEFAULT_TRANSLATIONS.hi.find(t => t.isDefault);
        if (hiTranslation) {
          verseData = await fetchVerseFromAPIBible(reference, hiTranslation.apiIdentifier);
        }
      } else {
        // Try ESV first, then BibleGet
        verseData = await fetchVerseFromESV(reference) || await fetchVerseFromBibleGet(reference);
      }
    }
  }

  if (!verseData) {
    return {
      data: null,
      error: 'Verse not found for this date',
      success: false,
      timestamp: new Date().toISOString(),
    };
  }

  // Cache the result
  verseCache.set(cacheKey, { ...verseData, timestamp: Date.now() });

  return {
    data: {
      verse: verseData,
      previousDate: getPreviousDate(dateStr),
      nextDate: getNextDate(dateStr),
    },
    error: null,
    success: true,
    cached: false,
    timestamp: new Date().toISOString(),
  };
}

export async function getVerseByReference(reference: string, language: LanguageCode = 'en', translationCode?: string): Promise<ApiResponse<BibleVerse>> {
  const cacheKey = getCacheKey(reference, translationCode || 'default', language);

  // Check cache
  const cached = verseCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp || 0)) {
    return { data: cached, error: null, success: true, cached: true, timestamp: new Date().toISOString() };
  }

  let verse: BibleVerse | null = null;

  if (language === 'hi') {
    const translation = DEFAULT_TRANSLATIONS.hi.find(t => t.code === translationCode) || DEFAULT_TRANSLATIONS.hi[0];
    verse = await fetchVerseFromAPIBible(reference, translation.apiIdentifier);
  } else {
    verse = await fetchVerseFromESV(reference) || await fetchVerseFromBibleGet(reference, translationCode || 'KJV');
  }

  if (!verse) {
    return { data: null, error: 'Verse not found', success: false, timestamp: new Date().toISOString() };
  }

  verseCache.set(cacheKey, { ...verse, timestamp: Date.now() });
  return { data: verse, error: null, success: true, cached: false, timestamp: new Date().toISOString() };
}

export function getAvailableTranslations(language: LanguageCode): BibleTranslation[] {
  return DEFAULT_TRANSLATIONS[language] || DEFAULT_TRANSLATIONS.en;
}

export function getDefaultTranslation(language: LanguageCode): BibleTranslation {
  const translations = getAvailableTranslations(language);
  return translations.find(t => t.isDefault) || translations[0];
}

function getPreviousDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

function getNextDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

export function formatReference(reference: string, language: LanguageCode): string {
  // In a full implementation, this would translate book names
  return reference;
}

export function getAudioUrl(reference: string, translationCode: string, language: LanguageCode): string | undefined {
  // FCBH audio URLs pattern
  // This is a simplified version - real implementation would map to actual FCBH IDs
  if (language === 'en' && translationCode === 'ESV') {
    return `https://audio.esv.org/${reference.replace(/ /g, '').replace(':', '')}.mp3`;
  }
  return undefined;
}