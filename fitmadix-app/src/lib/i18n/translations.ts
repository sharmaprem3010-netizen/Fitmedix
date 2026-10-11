import { SupportedLanguage } from '../../types/index.ts';

export interface TranslationDictionary {
  // Brand & Slogan
  appName: string;
  tagline: string;
  subTagline: string;
  
  // Language screen
  chooseLanguage: string;
  selectToContinue: string;
  cantReadPrompt: string;
  useVoiceMode: string;
  voiceModeDesc: string;
  continueBtn: string;
  
  // Voice screen
  voiceModeTitle: string;
  voiceModeSubtitle: string;
  voiceModeOn: string;
  voiceModeOff: string;
  enableVoiceMode: string;
  skipVoiceMode: string;
  voiceEnabledNotice: string;
  
  // Intro screen
  introHeadline: string;
  introSubheadline: string;
  exploreFitmadix: string;
  signUp: string;
  logIn: string;
  medicalDisclaimerNotice: string;
  
  // Feature pillars on intro
  pillarMedicalInfo: string;
  pillarExercise: string;
  pillarMedicines: string;
  pillarMedicalReports: string;
  pillarHumanBody: string;
  pillarResources: string;
  pillarAiAssistant: string;

  // Nav
  navHome: string;
  navExplore: string;
  navAiAssistant: string;
  navMedicalRecords: string;
  navProfile: string;

  // Home
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  todaysOverview: string;
  quickActions: string;
  noHealthDataYet: string;
  completeProfilePrompt: string;
  completeProfileBtn: string;
  noRecordsYet: string;
  uploadFirstReport: string;
  askAssistantAction: string;

  // Common UI
  back: string;
  next: string;
  save: string;
  cancel: string;
  logout: string;
  settings: string;
  accessibility: string;
  textSize: string;
  highContrast: string;
  reducedMotion: string;
  comingSoon: string;
  verifiedSourceOnly: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'FitMadix',
    tagline: 'Your health, simplified.',
    subTagline: 'Understand your health. Make better-informed decisions.',
    chooseLanguage: 'Choose your language',
    selectToContinue: 'Select a language to get started with FitMadix.',
    cantReadPrompt: "Can't read comfortably?",
    useVoiceMode: 'Use Voice Mode',
    voiceModeDesc: 'Voice Mode reads information aloud and accepts spoken voice input for blind or low-vision users.',
    continueBtn: 'Continue',
    voiceModeTitle: 'Voice Assistance & Accessibility',
    voiceModeSubtitle: 'FitMadix provides built-in voice assistance for users with visual impairments or reading difficulties.',
    voiceModeOn: 'Voice Mode is ON',
    voiceModeOff: 'Voice Mode is OFF',
    enableVoiceMode: 'Enable Voice Mode',
    skipVoiceMode: 'Continue Without Voice',
    voiceEnabledNotice: 'Voice assistance is active. Interface elements can be read aloud.',
    introHeadline: 'Understand your health. Make better-informed decisions.',
    introSubheadline: 'An accessible, privacy-first health platform built on verified medical knowledge, personalized records, and supportive wellness guidance.',
    exploreFitmadix: 'Explore FitMadix',
    signUp: 'Create Free Account',
    logIn: 'Log In',
    medicalDisclaimerNotice: 'FitMadix provides health and wellness information for educational purposes only. Always consult a qualified physician or healthcare provider for medical diagnosis and treatment.',
    pillarMedicalInfo: 'Medical Information',
    pillarExercise: 'Exercise & Movement',
    pillarMedicines: 'Medicine Information',
    pillarMedicalReports: 'Medical Reports & Storage',
    pillarHumanBody: 'Human Body & Anatomy',
    pillarResources: 'Healthcare Resources',
    pillarAiAssistant: 'AI Health Assistant',
    navHome: 'Home',
    navExplore: 'Explore',
    navAiAssistant: 'AI Assistant',
    navMedicalRecords: 'Medical Records',
    navProfile: 'Profile',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    todaysOverview: "Today's Health Overview",
    quickActions: 'Quick Actions',
    noHealthDataYet: 'No health data yet',
    completeProfilePrompt: 'Complete your health profile to personalize FitMadix guidance and track your wellness safely.',
    completeProfileBtn: 'Complete Health Profile',
    noRecordsYet: 'No medical documents stored yet',
    uploadFirstReport: 'Upload Medical Report',
    askAssistantAction: 'Consult AI Health Assistant',
    back: 'Back',
    next: 'Next',
    save: 'Save Changes',
    cancel: 'Cancel',
    logout: 'Log Out',
    settings: 'Settings',
    accessibility: 'Accessibility Preferences',
    textSize: 'Text Size',
    highContrast: 'High Contrast Mode',
    reducedMotion: 'Reduced Motion',
    comingSoon: 'Under Verified Development',
    verifiedSourceOnly: 'Strict empirical standard: Verified sources only, zero simulated medical claims.',
  },
  bn: {
    appName: 'FitMadix',
    tagline: 'আপনার স্বাস্থ্য, সহজ ও সুনির্দিষ্ট।',
    subTagline: 'আপনার স্বাস্থ্যকে বুঝুন। আরও সচেতন সিদ্ধান্ত নিন।',
    chooseLanguage: 'আপনার ভাষা বেছে নিন',
    selectToContinue: 'FitMadix শুরু করতে একটি ভাষা নির্বাচন করুন।',
    cantReadPrompt: 'পড়তে সমস্যা হচ্ছে?',
    useVoiceMode: 'ভয়েস মোড ব্যবহার করুন',
    voiceModeDesc: 'দৃষ্টি প্রতিবন্ধী বা পড়তে অসুবিধাযুক্ত ব্যবহারকারীদের জন্য ভয়েস মোড সবকিছু মুখে পড়ে শোনায়।',
    continueBtn: 'এগিয়ে যান',
    voiceModeTitle: 'ভয়েস সহায়তা ও অ্যাক্সেসিবিলিটি',
    voiceModeSubtitle: 'FitMadix বিশেষভাবে দৃষ্টিহীন ও স্বল্পদৃষ্টি ব্যবহারকারীদের জন্য ভয়েস সহায়তা সমর্থন করে।',
    voiceModeOn: 'ভয়েস মোড চালু আছে',
    voiceModeOff: 'ভয়েস মোড বন্ধ আছে',
    enableVoiceMode: 'ভয়েস মোড চালু করুন',
    skipVoiceMode: 'ভয়েস ছাড়া এগিয়ে যান',
    voiceEnabledNotice: 'ভয়েস সহায়তা সক্রিয় হয়েছে। পর্দার বিষয়বস্তু পড়ে শোনানো হবে।',
    introHeadline: 'আপনার স্বাস্থ্যকে বুঝুন। আরও সচেতন সিদ্ধান্ত নিন।',
    introSubheadline: 'যাচাইকৃত চিকিৎসা তথ্য, ব্যক্তিগত স্বাস্থ্য রেকর্ড এবং নির্ভরযোগ্য সুস্থতার নির্দেশিকা।',
    exploreFitmadix: 'FitMadix দেখুন',
    signUp: 'অ্যাকাউন্ট তৈরি করুন',
    logIn: 'লগ ইন করুন',
    medicalDisclaimerNotice: 'FitMadix শিক্ষামূলক ও সচেতনতামূলক উদ্দেশ্যে স্বাস্থ্য তথ্য প্রদান করে। চিকিৎসার জন্য সর্বদা বিশেষজ্ঞ চিকিৎসকের পরামর্শ নিন।',
    pillarMedicalInfo: 'চিকিৎসা তথ্য',
    pillarExercise: 'ব্যায়াম ও শরীরচর্চা',
    pillarMedicines: 'ওষুধের তথ্য',
    pillarMedicalReports: 'মেডিকেল রিপোর্ট ও সংরক্ষণ',
    pillarHumanBody: 'মানব শরীর ও শারীরস্থান',
    pillarResources: 'স্বাস্থ্যসেবা কেন্দ্র',
    pillarAiAssistant: 'এআই স্বাস্থ্য সহকারী',
    navHome: 'হোম',
    navExplore: 'অন্বেষণ',
    navAiAssistant: 'এআই সহকারী',
    navMedicalRecords: 'মেডিকেল রেকর্ড',
    navProfile: 'প্রোফাইল',
    greetingMorning: 'শুভ সকাল',
    greetingAfternoon: 'শুভ দুপুর',
    greetingEvening: 'শুভ সন্ধ্যা',
    todaysOverview: 'আজকের স্বাস্থ্য সারসংক্ষেপ',
    quickActions: 'দ্রুত পদক্ষেপ',
    noHealthDataYet: 'এখনও কোনো স্বাস্থ্য তথ্য নেই',
    completeProfilePrompt: 'FitMadix ব্যক্তিগতকৃত করতে আপনার স্বাস্থ্য প্রোফাইল সম্পন্ন করুন।',
    completeProfileBtn: 'স্বাস্থ্য প্রোফাইল পূরণ করুন',
    noRecordsYet: 'এখনও কোনো মেডিকেল নথি সংরক্ষিত হয়নি',
    uploadFirstReport: 'রিপোর্ট আপলোড করুন',
    askAssistantAction: 'এআই সহকারীকে জিজ্ঞাসা করুন',
    back: 'পেছনে',
    next: 'পরবর্তী',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    logout: 'লগ আউট',
    settings: 'সেটিংস',
    accessibility: 'অ্যাক্সেসিবিলিটি পছন্দ',
    textSize: 'লেখার আকার',
    highContrast: 'উচ্চ বৈসাদৃশ্য মোড',
    reducedMotion: 'গতি হ্রাস মোড',
    comingSoon: 'যাচাইকৃত উন্নয়ন প্রক্রিয়ায় রয়েছে',
    verifiedSourceOnly: 'কঠোর নীতি: শুধুমাত্র যাচাইকৃত তথ্য, কোনো কৃত্রিম চিকিৎসা দাবি নেই।',
  },
  hi: {
    appName: 'FitMadix',
    tagline: 'आपका स्वास्थ्य, सरल और स्पष्ट।',
    subTagline: 'अपने स्वास्थ्य को समझें। बेहतर और सही निर्णय लें।',
    chooseLanguage: 'अपनी भाषा चुनें',
    selectToContinue: 'FitMadix शुरू करने के लिए भाषा चुनें।',
    cantReadPrompt: 'पढ़ने में कठिनाई हो रही है?',
    useVoiceMode: 'वॉयस मोड का उपयोग करें',
    voiceModeDesc: 'वॉयस मोड दृष्टिबाधित या पढ़ने में असमर्थ उपयोगकर्ताओं के लिए सामग्री को बोलकर सुनाता है।',
    continueBtn: 'आगे बढ़ें',
    voiceModeTitle: 'वॉयस सहायता और सुगमता',
    voiceModeSubtitle: 'FitMadix दृष्टि संबंधी आवश्यकता वाले उपयोगकर्ताओं के लिए अंतर्निहित वॉयस सहायता प्रदान करता है।',
    voiceModeOn: 'वॉयस मोड चालू है',
    voiceModeOff: 'वॉयस मोड बंद है',
    enableVoiceMode: 'वॉयस मोड चालू करें',
    skipVoiceMode: 'वॉयस के बिना आगे बढ़ें',
    voiceEnabledNotice: 'वॉयस सहायता सक्रिय है। इंटरफ़ेस आपको बोलकर मार्गदर्शन करेगा।',
    introHeadline: 'अपने स्वास्थ्य को समझें। बेहतर और सही निर्णय लें।',
    introSubheadline: 'सत्यापित चिकित्सा ज्ञान, सुरक्षित रिकॉर्ड और कल्याणकारी मार्गदर्शन पर आधारित स्वास्थ्य मंच।',
    exploreFitmadix: 'FitMadix एक्सप्लोर करें',
    signUp: 'खाता बनाएं',
    logIn: 'लॉग इन करें',
    medicalDisclaimerNotice: 'FitMadix केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए स्वास्थ्य जानकारी प्रदान करता है। चिकित्सा निदान और उपचार के लिए हमेशा योग्य डॉक्टर से परामर्श लें।',
    pillarMedicalInfo: 'चिकित्सा जानकारी',
    pillarExercise: 'व्यायाम और फिटनेस',
    pillarMedicines: 'दवाइयों की जानकारी',
    pillarMedicalReports: 'मेडिकल रिपोर्ट व सुरक्षित स्टोरेज',
    pillarHumanBody: 'मानव शरीर रचना',
    pillarResources: 'स्वास्थ्य संसाधन',
    pillarAiAssistant: 'एआई स्वास्थ्य सहायक',
    navHome: 'होम',
    navExplore: 'एक्सप्लोर',
    navAiAssistant: 'एआई सहायक',
    navMedicalRecords: 'मेडिकल रिकॉर्ड',
    navProfile: 'प्रोफ़ाइल',
    greetingMorning: 'सुप्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    todaysOverview: 'आज का स्वास्थ्य अवलोकन',
    quickActions: 'त्वरित क्रियाएं',
    noHealthDataYet: 'अभी तक कोई स्वास्थ्य डेटा नहीं है',
    completeProfilePrompt: 'FitMadix को वैयक्तिकृत करने के लिए अपनी स्वास्थ्य प्रोफ़ाइल पूरी करें।',
    completeProfileBtn: 'स्वास्थ्य प्रोफ़ाइल पूरी करें',
    noRecordsYet: 'अभी तक कोई मेडिकल दस्तावेज संग्रहीत नहीं है',
    uploadFirstReport: 'मेडिकल रिपोर्ट अपलोड करें',
    askAssistantAction: 'एआई सहायक से पूछें',
    back: 'पीछे',
    next: 'आगे',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    logout: 'लॉग आउट',
    settings: 'सेटिंग्स',
    accessibility: 'सुगमता प्राथमिकताएं',
    textSize: 'टेक्स्ट का आकार',
    highContrast: 'हाई कंट्रास्ट मोड',
    reducedMotion: 'धीमी गति मोड',
    comingSoon: 'सत्यापित विकास के अधीन',
    verifiedSourceOnly: 'सख्त मानक: केवल सत्यापित स्रोत, कोई काल्पनिक चिकित्सा दावा नहीं।',
  },
  es: {
    appName: 'FitMadix',
    tagline: 'Tu salud, simplificada.',
    subTagline: 'Comprende tu salud. Toma mejores decisiones informadas.',
    chooseLanguage: 'Elige tu idioma',
    selectToContinue: 'Selecciona un idioma para comenzar con FitMadix.',
    cantReadPrompt: '¿Dificultad para leer?',
    useVoiceMode: 'Usar Modo de Voz',
    voiceModeDesc: 'El Modo de Voz lee la información en voz alta y acepta comandos de voz para usuarios con discapacidad visual.',
    continueBtn: 'Continuar',
    voiceModeTitle: 'Asistencia de Voz y Accesibilidad',
    voiceModeSubtitle: 'FitMadix incluye asistencia por voz para personas con baja visión o dificultades de lectura.',
    voiceModeOn: 'Modo de Voz ACTIVO',
    voiceModeOff: 'Modo de Voz INACTIVO',
    enableVoiceMode: 'Activar Modo de Voz',
    skipVoiceMode: 'Continuar sin voz',
    voiceEnabledNotice: 'Asistencia de voz activa. Los elementos pueden ser leídos en voz alta.',
    introHeadline: 'Comprende tu salud. Toma mejores decisiones informadas.',
    introSubheadline: 'Una plataforma de salud accesible y privada construida sobre conocimiento médico verificado y registros seguros.',
    exploreFitmadix: 'Explorar FitMadix',
    signUp: 'Crear Cuenta',
    logIn: 'Iniciar Sesión',
    medicalDisclaimerNotice: 'FitMadix proporciona información de salud con fines educativos. Consulta siempre a un médico colegiado para diagnósticos y tratamientos.',
    pillarMedicalInfo: 'Información Médica',
    pillarExercise: 'Ejercicio y Movimiento',
    pillarMedicines: 'Información de Medicamentos',
    pillarMedicalReports: 'Informes Médicos y Almacenamiento',
    pillarHumanBody: 'Cuerpo Humano y Anatomía',
    pillarResources: 'Recursos de Salud',
    pillarAiAssistant: 'Asistente de Salud IA',
    navHome: 'Inicio',
    navExplore: 'Explorar',
    navAiAssistant: 'Asistente IA',
    navMedicalRecords: 'Historial Médico',
    navProfile: 'Perfil',
    greetingMorning: 'Buenos días',
    greetingAfternoon: 'Buenas tardes',
    greetingEvening: 'Buenas noches',
    todaysOverview: 'Resumen de Salud de Hoy',
    quickActions: 'Acciones Rápidas',
    noHealthDataYet: 'Aún no hay datos de salud',
    completeProfilePrompt: 'Completa tu perfil de salud para personalizar FitMadix de forma segura.',
    completeProfileBtn: 'Completar Perfil',
    noRecordsYet: 'No hay documentos médicos guardados',
    uploadFirstReport: 'Subir Informe Médico',
    askAssistantAction: 'Consultar Asistente de Salud IA',
    back: 'Atrás',
    next: 'Siguiente',
    save: 'Guardar',
    cancel: 'Cancelar',
    logout: 'Cerrar Sesión',
    settings: 'Ajustes',
    accessibility: 'Preferencias de Accesibilidad',
    textSize: 'Tamaño del Texto',
    highContrast: 'Modo Alto Contraste',
    reducedMotion: 'Movimiento Reducido',
    comingSoon: 'En Desarrollo Verificado',
    verifiedSourceOnly: 'Estándar estricto: Solo fuentes verificadas, sin datos médicos inventados.',
  },
};
