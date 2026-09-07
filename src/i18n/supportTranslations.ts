// Centralized translation dictionary for KisanSetu AI Support Assistant and Help Center
import { LanguageCode } from '../types';

export type SupportLanguage = LanguageCode;

export interface SupportTranslations {
  // Header
  headerTitle: string;
  headerBadge: string;
  headerSubtitle: string;
  voiceReplyEnabled: string;
  voiceReplyDisabled: string;
  closeAssistant: string;

  // Tabs
  tabAiChat: string;
  tabPhone: string;
  tabEmail: string;
  tabTickets: string;

  // Language selector
  languageLabel: string;
  langHindi: string;
  langEnglish: string;

  // Welcome & Initial
  welcomeMessage: string;
  quickActionCropListing: string;
  quickActionMandiRates: string;
  quickActionOrderTracking: string;
  quickActionPaymentEscrow: string;
  quickActionPhotoGrading: string;

  // Input & Controls
  inputPlaceholder: string;
  listeningActive: string;
  clickToSpeak: string;
  sendMessage: string;
  speechNotSupported: string;
  securityNotice: string;
  tollFreeHelpline: string;

  // AI State & Status
  aiAnalyzing: string;
  activeTicketBanner: string;
  escalatedToSeniorDesk: string;
  viewTicketDetails: string;
  readOutAudio: string;

  // Resolution & Feedback
  wasProblemSolved: string;
  yesProblemSolved: string;
  noProblemStillHaving: string;
  resolutionThankYou: string;
  escalationNotice: (ticketId: string) => string;
  ratingQuestion: string;
  ratingSubmitted: string;
  callHelplineAction: string;

  // Fallback & Errors
  serverErrorFallback: string;
  createTicketAction: string;
  ticketCreatedSystemMsg: (ticketId: string) => string;

  // Phone Helpline tab
  helplineTitle: string;
  helplineBadge: string;
  tollFreeDirectDial: string;
  helplineHours: string;
  simulatorTitle: string;
  simulatorBadge: string;
  simulatorDesc: string;
  callerQueryLabel: string;
  callerQueryPlaceholder: string;
  runVoiceEngine: string;
  samplePaymentQuery: string;
  sampleMandiQuery: string;
  helplineSpokenResponse: string;
  playAudio: string;
  ticketGenerated: string;

  // Email tab
  emailTitle: string;
  emailBadge: string;
  yourEmailLabel: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageBodyLabel: string;
  messageBodyPlaceholder: string;
  sendEmailBtn: string;
  sendingEmailBtn: string;
  emailTicketLogged: string;
  autoProcessedBadge: string;

  // Tickets tab
  myTicketsTitle: string;
  myTicketsSubtitle: string;
  refreshTickets: string;
  loadingTickets: string;
  noTicketsFound: string;
  noTicketsDesc: string;
  resolutionNote: string;
  assignedTo: string;
  category: string;
  language: string;
}

const hi: SupportTranslations = {
  headerTitle: 'किसानसेतु AI सहायता',
  headerBadge: 'रियल AI + कृषि विशेषज्ञ',
  headerSubtitle: 'कृषक एवं व्यापारी 24/7 रीयल-टाइम समाधान केंद्र',
  voiceReplyEnabled: 'वॉइस उत्तर सक्रिय है',
  voiceReplyDisabled: 'वॉइस उत्तर निष्क्रिय है',
  closeAssistant: 'बंद करें',

  tabAiChat: 'AI चैट सहायक',
  tabPhone: 'हेल्पलाइन / फोन',
  tabEmail: 'ईमेल सपोर्ट',
  tabTickets: 'मेरे टिकट',

  languageLabel: 'भाषा / Language:',
  langHindi: '🇮🇳 हिंदी',
  langEnglish: '🇬🇧 English',

  welcomeMessage:
    'नमस्ते! मैं किसानसेतु AI सहायता सहायक हूँ। आपकी फसल लिस्टिंग, सरकारी मंडी भाव, फोटो AI ग्रेडिंग, पेमेंट या डिलीवरी में मैं आपकी क्या मदद कर सकता हूँ?',
  quickActionCropListing: 'मेरी फसल लिस्टिंग जांचें',
  quickActionMandiRates: 'नवीनतम मंडी भाव देखें',
  quickActionOrderTracking: 'ऑर्डर व डिलीवरी स्थिति',
  quickActionPaymentEscrow: 'पेमेंट व एस्क्रो सुरक्षा',
  quickActionPhotoGrading: 'फसल फोटो ग्रेडिंग सहायता',

  inputPlaceholder: 'अपनी समस्या बताएं (उदा. मेरी टमाटर की फसल, मंडी भाव, पेमेंट नहीं आई)...',
  listeningActive: 'सुन रहे हैं... रोकने के लिए क्लिक करें',
  clickToSpeak: 'बोलकर पूछें (वॉइस इनपुट)',
  sendMessage: 'संदेश भेजें',
  speechNotSupported: 'आपके ब्राउज़र में वॉइस स्पीच सपोर्ट उपलब्ध नहीं है। कृपया टेक्स्ट टाइप करें।',
  securityNotice: 'पासवर्ड, OTP या UPI पिन किसी से साझा न करें।',
  tollFreeHelpline: 'टोल-फ्री',

  aiAnalyzing: 'KisanSetu का डेटा चेक किया जा रहा है...',
  activeTicketBanner: 'सक्रिय सपोर्ट टिकट:',
  escalatedToSeniorDesk: 'वरिष्ठ कृषि सहायता डेस्क को भेजा गया',
  viewTicketDetails: 'विवरण देखें',
  readOutAudio: 'आवाज़ में सुनें',

  wasProblemSolved: 'क्या आपकी समस्या का समाधान हो गया?',
  yesProblemSolved: 'हाँ, समस्या हल हो गई',
  noProblemStillHaving: 'नहीं, अभी भी समस्या है',
  resolutionThankYou: 'बहुत बढ़िया! आपकी समस्या हल हो गई। 🙏 किसानसेतु का उपयोग करने के लिए धन्यवाद।',
  escalationNotice: (ticketId: string) =>
    `कोई बात नहीं। मैंने आपकी समस्या KisanSetu विशेषज्ञ सहायता टीम तक भेज दी है। आपका टिकट नंबर है: ${ticketId}। हमारे वरिष्ठ कृषि अधिकारी जल्द ही आपसे संपर्क करेंगे।`,
  ratingQuestion: 'किसानसेतु सहायता का आपका अनुभव कैसा रहा?',
  ratingSubmitted: 'प्रतिक्रिया दर्ज कर ली गई है। धन्यवाद!',
  callHelplineAction: 'हेल्पलाइन पर बात करें',

  serverErrorFallback:
    'माफ़ कीजिए, अभी AI सहायता सर्वर से कनेक्ट करने में कठिनाई आ रही है। आप टोल-फ्री हेल्पलाइन पर कॉल कर सकते हैं या सपोर्ट टिकट दर्ज कर सकते हैं।',
  createTicketAction: 'सपोर्ट टिकट बनाएं',
  ticketCreatedSystemMsg: (ticketId: string) =>
    `सपोर्ट टिकट दर्ज हो गया है: ${ticketId}। आप 'मेरे टिकट' टैब में इसकी लाइव स्थिति देख सकते हैं।`,

  helplineTitle: 'किसानसेतु आधिकारिक हेल्पलाइन',
  helplineBadge: 'टोल-फ्री कृषक एवं व्यापार सहायता डेस्क',
  tollFreeDirectDial: 'सीधा हेल्पलाइन नंबर',
  helplineHours: 'सप्ताह के 6 दिन (सुबह 8:00 से रात 8:00 बजे) हिंदी, अंग्रेज़ी व स्थानीय भाषाओं में उपलब्ध',
  simulatorTitle: 'इंटरैक्टिव हेल्पलाइन व वॉइस सिम्युलेटर',
  simulatorBadge: 'वॉइस इंजन',
  simulatorDesc:
    'देखें कि कैसे फ़ोन कॉलर की बोली को AI पहचानता है, रीयल-टाइम डेटाबेस की जांच करता है और आवश्यकता पड़ने पर सपोर्ट टिकट बनाता है।',
  callerQueryLabel: 'कॉलर का प्रश्न / बोली (Hindi / English)',
  callerQueryPlaceholder: 'यहाँ लिखें जो कॉलर बोल रहा है...',
  runVoiceEngine: 'वॉइस कॉल प्रोसेसर चलाएं',
  samplePaymentQuery: 'पेमेंट स्थिति प्रश्न',
  sampleMandiQuery: 'मंडी भाव प्रश्न',
  helplineSpokenResponse: 'हेल्पलाइन द्वारा बोला गया उत्तर:',
  playAudio: 'आवाज़ सुनें',
  ticketGenerated: 'टिकट दर्ज हुआ:',

  emailTitle: 'किसानसेतु ईमेल सपोर्ट डेस्क',
  emailBadge: 'त्वरित समाधान ईमेल टीम',
  yourEmailLabel: 'आपका ईमेल पता',
  subjectLabel: 'विषय',
  subjectPlaceholder: 'उदा. मेरी गेहूं फसल फोटो या टिकट KIS-SUP-1002',
  messageBodyLabel: 'समस्या का विस्तृत विवरण',
  messageBodyPlaceholder: 'अपनी समस्या हिंदी या अंग्रेज़ी में विस्तार से लिखें...',
  sendEmailBtn: 'सपोर्ट ईमेल भेजें',
  sendingEmailBtn: 'AI डेस्क द्वारा प्रोसेस हो रहा है...',
  emailTicketLogged: 'सपोर्ट टिकट दर्ज:',
  autoProcessedBadge: 'स्थिति: ऑटो-प्रोसेस्ड',

  myTicketsTitle: 'मेरे सपोर्ट टिकट्स',
  myTicketsSubtitle: 'आपकी सभी पूछताछों, रिपोर्टों और समाधानों की लाइव स्थिति',
  refreshTickets: 'ताज़ा करें',
  loadingTickets: 'सपोर्ट टिकट लोड हो रहे हैं...',
  noTicketsFound: 'कोई सपोर्ट टिकट नहीं मिला',
  noTicketsDesc: 'किसी भी प्रश्न या समस्या के लिए AI चैट सहायक टैब से मदद लें।',
  resolutionNote: 'समाधान विवरण:',
  assignedTo: 'असाइन किया गया:',
  category: 'श्रेणी:',
  language: 'भाषा:',
};

const en: SupportTranslations = {
  headerTitle: 'KisanSetu AI Support',
  headerBadge: 'Real AI + Human Desk',
  headerSubtitle: 'Farmer & Buyer 24/7 Real-Time Resolution Hub',
  voiceReplyEnabled: 'Voice reply enabled',
  voiceReplyDisabled: 'Voice reply disabled',
  closeAssistant: 'Close',

  tabAiChat: 'AI Assistant',
  tabPhone: 'Helpline / Phone',
  tabEmail: 'Email Support',
  tabTickets: 'My Tickets',

  languageLabel: 'Language / भाषा:',
  langHindi: '🇮🇳 हिंदी',
  langEnglish: '🇬🇧 English',

  welcomeMessage:
    'Namaste! I am the KisanSetu AI Support Assistant. How can I help you with crop listings, official AGMARKNET mandi rates, AI photo grading, escrow payment, or order delivery today?',
  quickActionCropListing: 'Check My Crop Listing',
  quickActionMandiRates: 'Live Mandi Price Rates',
  quickActionOrderTracking: 'Track Order & Delivery',
  quickActionPaymentEscrow: 'Payment & Escrow Protection',
  quickActionPhotoGrading: 'AI Photo Grading Guide',

  inputPlaceholder: 'Describe your issue (e.g. crop visibility, mandi rate, payment status)...',
  listeningActive: 'Listening... Click to stop',
  clickToSpeak: 'Click to speak (Voice input)',
  sendMessage: 'Send message',
  speechNotSupported: 'Live speech recognition is not supported in this browser. Please type your message.',
  securityNotice: 'Never share passwords, OTPs, or UPI PINs with anyone.',
  tollFreeHelpline: 'Toll-Free',

  aiAnalyzing: 'Checking KisanSetu data...',
  activeTicketBanner: 'Active Support Ticket:',
  escalatedToSeniorDesk: 'Escalated to Senior Agricultural Desk',
  viewTicketDetails: 'View Details',
  readOutAudio: 'Listen to response',

  wasProblemSolved: 'Was your problem solved?',
  yesProblemSolved: 'Yes, Solved',
  noProblemStillHaving: 'No, Still Having Problem',
  resolutionThankYou: 'Wonderful! Your issue has been resolved. 🙏 Thank you for choosing KisanSetu.',
  escalationNotice: (ticketId: string) =>
    `Understood. I have escalated this issue to our Senior KisanSetu Support Team. Your Ticket ID is: ${ticketId}. Our specialist will review it promptly.`,
  ratingQuestion: 'How was your KisanSetu support experience?',
  ratingSubmitted: 'Rating recorded. Thank you!',
  callHelplineAction: 'Call Helpline',

  serverErrorFallback:
    'Unable to connect to the AI Support engine. You can call our toll-free helpline or create a support ticket.',
  createTicketAction: 'Create Support Ticket',
  ticketCreatedSystemMsg: (ticketId: string) =>
    `Support ticket created: ${ticketId}. You can track its live progress in the 'My Tickets' tab.`,

  helplineTitle: 'KisanSetu Official Helpline',
  helplineBadge: 'Toll-Free Agricultural Support Desk',
  tollFreeDirectDial: 'Direct Dial Hotline',
  helplineHours: 'Available 6 Days a Week (8:00 AM – 8:00 PM) in Hindi, English & Regional Languages',
  simulatorTitle: 'Interactive Helpline Simulator',
  simulatorBadge: 'Voice Engine',
  simulatorDesc:
    'Experience how incoming caller queries are transcribed, diagnosed by the KisanSetu engine, and escalated into tickets.',
  callerQueryLabel: 'Simulated Caller Query / Speech (Hindi or English)',
  callerQueryPlaceholder: 'Enter what the caller speaks...',
  runVoiceEngine: 'Run Voice Call Processor',
  samplePaymentQuery: 'Sample Payment Query',
  sampleMandiQuery: 'Sample Mandi Query',
  helplineSpokenResponse: 'Helpline Spoken Response:',
  playAudio: 'Play Audio',
  ticketGenerated: 'Ticket Generated:',

  emailTitle: 'KisanSetu Email Support Desk',
  emailBadge: 'Automated Diagnostic Desk',
  yourEmailLabel: 'Your Email',
  subjectLabel: 'Subject',
  subjectPlaceholder: 'e.g. Issue with Wheat listing or KIS-SUP-1002',
  messageBodyLabel: 'Message Body',
  messageBodyPlaceholder: 'Describe your inquiry in detail...',
  sendEmailBtn: 'Send Support Email',
  sendingEmailBtn: 'Processing via AI Desk...',
  emailTicketLogged: 'Ticket Logged:',
  autoProcessedBadge: 'Status: Auto-Processed',

  myTicketsTitle: 'My Support Tickets',
  myTicketsSubtitle: 'Live status of your inquiries and escalations',
  refreshTickets: 'Refresh',
  loadingTickets: 'Loading support tickets...',
  noTicketsFound: 'No support tickets found',
  noTicketsDesc: 'Use the AI Assistant tab to ask any question or report an issue.',
  resolutionNote: 'Resolution Note:',
  assignedTo: 'Assigned To:',
  category: 'Category:',
  language: 'Language:',
};

// Punjabi Support Dict
const pa: SupportTranslations = {
  ...hi,
  headerTitle: 'ਕਿਸਾਨਸੇਤੂ AI ਸਹਾਇਤਾ',
  headerBadge: 'ਅਸਲ AI + ਖੇਤੀਬਾੜੀ ਮਾਹਿਰ',
  welcomeMessage:
    'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕਿਸਾਨਸੇਤੂ AI ਸਹਾਇਕ ਹਾਂ। ਫਸਲ ਲਿਸਟਿੰਗ, ਮੰਡੀ ਭਾਅ, AI ਫੋਟੋ ਗ੍ਰੇਡਿੰਗ, ਪੇਮੈਂਟ ਜਾਂ ਡਿਲਿਵਰੀ ਸੰਬੰਧੀ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
  inputPlaceholder: 'ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ (ਜਿਵੇਂ ਟਮਾਟਰ ਦਾ ਭਾਅ, ਪੇਮੈਂਟ ਨਹੀਂ ਆਈ)...',
  sendMessage: 'ਸੁਨੇਹਾ ਭੇਜੋ',
  clickToSpeak: 'ਬੋਲ ਕੇ ਪੁੱਛੋ (ਵੌਇਸ)',
};

// Haryanvi Support Dict
const hr: SupportTranslations = {
  ...hi,
  headerTitle: 'किसानसेतु AI सहायता',
  welcomeMessage:
    'राम-राम! मैं किसानसेतु AI सहायक सूँ। फसल लिस्टिंग, सरकारी मंडी भाव, फोटो AI ग्रेडिंग, पेमेंट या डिलीवरी में थारी के मदद करूँ?',
  inputPlaceholder: 'अपणी समस्या बताओ (उदा. टमाटर का भाव, पेमेंट नहीं आई)...',
};

// Telugu Support Dict
const te: SupportTranslations = {
  ...hi,
  headerTitle: 'కిసాన్‌సేతు AI సహాయం',
  welcomeMessage:
    'నమస్తే! నేను కిసాన్‌సేతు AI సహాయకుడిని. పంటల జాబితా, మార్కెట్ ధరలు, AI ఫోటో గ్రేడింగ్, చెల్లింపులు లేదా డెలివరీలో నేను మీకు ఎలా సహాయపడగలను?',
  inputPlaceholder: 'మీ సమస్యను వివరించండి (ఉదా. టమోటా పంట, మార్కెట్ ధర, చెల్లింపు రాలేదు)...',
};

// Tamil Support Dict
const ta: SupportTranslations = {
  ...hi,
  headerTitle: 'கிசான்சேது AI உதவி',
  welcomeMessage:
    'வணக்கம்! நான் கிசான்சேது AI உதவி உதவியாளர். பயிர் பட்டியல், மண்டி விலை, புகைப்பட கிரேடிங், பணம் செலுத்துதல் அல்லது டெலிவரியில் நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
  inputPlaceholder: 'உங்கள் சிக்கலை விவரிக்கவும் (எ.கா. தக்காளி விலை, பணம் வரவில்லை)...',
};

export const SUPPORT_I18N: Record<LanguageCode, SupportTranslations> = {
  hi,
  en,
  pa,
  hr,
  te,
  ta,
};

/**
 * Gets a localized support string from the centralized dictionary.
 */
export function getSupportText<K extends keyof SupportTranslations>(
  key: K,
  lang: LanguageCode = 'hi'
): SupportTranslations[K] {
  const selectedDict = SUPPORT_I18N[lang] || SUPPORT_I18N.hi;
  return selectedDict[key] ?? SUPPORT_I18N.hi[key];
}

/**
 * Detects default user language preference based on browser settings or stored value
 */
export function detectInitialSupportLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem('kisansetu_support_lang') || localStorage.getItem('kisansetu_language');
    if (saved && (saved === 'hi' || saved === 'en' || saved === 'pa' || saved === 'hr' || saved === 'te' || saved === 'ta')) {
      return saved as LanguageCode;
    }

    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
      if (browserLang.startsWith('pa')) return 'pa';
      if (browserLang.startsWith('te')) return 'te';
      if (browserLang.startsWith('ta')) return 'ta';
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('hi') || browserLang.includes('in')) {
        return 'hi';
      }
    }
  } catch {
    // ignore
  }

  return 'hi'; // Default to Hindi as the primary language
}
