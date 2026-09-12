export type AppIntent = 
  | "GO_HOME"
  | "OPEN_SYMPTOMS"
  | "OPEN_REPORTS"
  | "OPEN_MEDICINES"
  | "OPEN_TIMELINE"
  | "OPEN_NUTRITION"
  | "OPEN_WORKOUTS"
  | "OPEN_SETTINGS"
  | "OPEN_AI"
  | "GO_BACK"
  | "STOP_SPEAKING"
  | "READ_PAGE"
  | "UNKNOWN";

export function parseIntent(text: string): AppIntent {
  const lower = text.toLowerCase().trim();

  // Navigation: Home
  if (/home|dashboard|back to start|main page|घर|হোম|শুরু|మొదటికి|முகப்பு|ಮನೆ|വീട്|ਘਰ|ମୂଳପୃଷ୍ଠା|ਮੁੱਖ/.test(lower)) {
    return "GO_HOME";
  }

  // Navigation: Symptoms
  if (/symptom|doctor|sick|fever|headache|pain|लक्षण|डॉक्टर|बीमार|উপসর্গ|ডাক্তার|অসুস্থ|లక్షణాలు|அறிகுறிகள்|ലക്ഷണങ്ങൾ|ਰੋਗ|ବିମାରୀ|درد|طبیب/.test(lower)) {
    return "OPEN_SYMPTOMS";
  }

  // Navigation: Reports
  if (/report|lab|test|result|pdf|upload|रिपोर्ट|ল্যাব|রিপোর্ট|টেস্ট|రిపోర్ట్|அறிக்கை|റിപ്പോർട്ട്|ਰਿਪੋਰਟ|ରିପୋର୍ଟ|رپورٹ/.test(lower)) {
    return "OPEN_REPORTS";
  }

  // Navigation: Medicines
  if (/medicine|pill|drug|prescription|add medicine|दवा|दवाई|औषध|ওষুধ|ট্যাবলেট|మందులు|மருந்து|മരുന്ന്|ਦਵਾਈ|ଔଷଧ|دوا/.test(lower)) {
    return "OPEN_MEDICINES";
  }

  // Navigation: Timeline
  if (/timeline|history|progress|read my timeline|इतिहास|টাইমলাইন|ইতিহাস|చరిత్ర|வரலாறு|ചരിത്രം|ਇਤਿਹਾਸ|ଇତିହାସ|تاریخ/.test(lower)) {
    return "OPEN_TIMELINE";
  }

  // Navigation: Nutrition
  if (/nutrition|food|eat|meal|diet|roti|dal|खाना|भोजन|আহার|খাবার|ఆహారం|உணவு|ഭക്ഷണം|ਖਾਣਾ|ଖାଦ୍ୟ|خوراک/.test(lower)) {
    return "OPEN_NUTRITION";
  }

  // Navigation: Workouts
  if (/workout|exercise|training|start workout|व्यायाम|कसरत|ব্যায়াম|অনুশীলন|వ్యాయామం|உடற்பயிற்சி|വ്യായാമം|ਕਸਰਤ|ବ୍ୟାୟାମ|ورزش/.test(lower)) {
    return "OPEN_WORKOUTS";
  }

  // Navigation: Settings / Accessibility
  if (/setting|accessibility|language|mode|सेटिंग|সেটিংস|సెట్టింగులు|அமைப்புகள்|സെറ്റിംഗ്സ്|ਸੈਟਿੰਗਾਂ|ସେଟିଙ୍ଗସ୍|سیٹنگز/.test(lower)) {
    return "OPEN_SETTINGS";
  }

  // Navigation: AI
  if (/ai|ask|chat|question|सवाल|প্রশ্ন|ప్రశ్న|கேள்வி|ചോദ്യം|ਸਵਾਲ|ପ୍ରଶ୍ନ|سوال/.test(lower)) {
    return "OPEN_AI";
  }

  // Action: Go Back
  if (/back|return|पीछे|वापस|ফিরে|వెనుకకు|பின்னால்|പിറകോട്ട്|ਪਿੱਛੇ|ପଛକୁ|واپس/.test(lower) && !/home|మొదటికి|முகப்பு/.test(lower)) {
    return "GO_BACK";
  }

  // Action: Stop Speaking
  if (/stop|quiet|shut|silence|pause|रुक|चुप|थांब|থামুন|চুপ|ఆపు|நிறுத்து|നിർത്തുക|ਰੁਕੋ|ବନ୍ଦ|رکیں/.test(lower)) {
    return "STOP_SPEAKING";
  }

  // Action: Read Page
  if (/read|speak page|summary|tell me|पढ़ो|পড়ুন|বলুন|చదువు|படி|വായിക്കുക|ਪੜ੍ਹੋ|ପଢନ୍ତୁ|پڑھیں/.test(lower)) {
    return "READ_PAGE";
  }

  return "UNKNOWN";
}
