export type SupportLanguage = 'hi' | 'en';

export interface SupportTranslations {
  appTitle: string;
  appSubtitle: string;
  activeStatus: string;
  languageLabel: string;
  langHindi: string;
  langEnglish: string;
  tabChat: string;
  tabVoice: string;
  tabEmail: string;
  tabTickets: string;
  tabDiagnostic: string;
  inputPlaceholder: string;
  sendBtn: string;
  listening: string;
  speakPrompt: string;
  stopListening: string;
  startNewChat: string;
  contactSupport: string;
  createTicket: string;
  ticketCreatedTitle: string;
  ticketCreatedMsg: string;
  ticketIdLabel: string;
  resolutionPrompt: string;
  yesResolved: string;
  notResolved: string;
  rateExperience: string;
  submitFeedback: string;
  feedbackThanks: string;
  feedbackPlaceholder: string;
  quickPromptsTitle: string;
  quickCropListings: string;
  quickMandiRates: string;
  quickTrackOrders: string;
  quickPaymentStatus: string;
  quickHumanAgent: string;
  helplineBannerTitle: string;
  helplineCallBtn: string;
  helplineSimulateBtn: string;
  securityNotice: string;
  aiDiagnosticTitle: string;
  aiDiagnosticDesc: string;
  verifiedDataBadge: string;
  escalatedToAgent: string;
  humanSupportAssigned: string;
  offlineNotice: string;
  systemErrorFallback: string;
  ticketCategoryLabel: string;
  ticketSubjectLabel: string;
  ticketDescLabel: string;
  ticketPriorityLabel: string;
  cancelBtn: string;
  submitTicketBtn: string;
  categoryGeneral: string;
  categoryCrop: string;
  categoryOrder: string;
  categoryPayment: string;
  categoryMandi: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  priorityUrgent: string;
  statusOpen: string;
  statusInReview: string;
  statusEscalated: string;
  statusResolved: string;
  statusClosed: string;
  noTicketsYet: string;
  viewDetails: string;
  backToChat: string;
  voiceCalling: string;
  voiceConnected: string;
  voiceHangup: string;
  voiceMute: string;
  voiceUnmute: string;
  voiceTranscript: string;
  voiceListeningNow: string;
  emailSubject: string;
  emailBodyPlaceholder: string;
  sendEmailBtn: string;
  emailSentSuccess: string;
  howCanIHelp: string;
}

export const SUPPORT_TRANSLATIONS: Record<SupportLanguage, SupportTranslations> = {
  hi: {
    appTitle: 'किसानसेतु सहायता सहायक',
    appSubtitle: 'एआई संचालित २४/७ कृषक व खरीदार हेल्पलाइन',
    activeStatus: 'सक्रिय • तुरंत सहायता',
    languageLabel: 'भाषा:',
    langHindi: '🇮🇳 हिंदी',
    langEnglish: '🇬🇧 English',
    tabChat: 'एआई चैट',
    tabVoice: 'हेल्पलाइन कॉल',
    tabEmail: 'ईमेल सपोर्ट',
    tabTickets: 'मेरे टिकट',
    tabDiagnostic: 'सिस्टम जांच',
    inputPlaceholder: 'अपनी समस्या या सवाल लिखें (हिंदी, English, या हिंग्लिश)...',
    sendBtn: 'भेजें',
    listening: 'सुन रहे हैं...',
    speakPrompt: 'बोलकर पूछें',
    stopListening: 'माइक बंद करें',
    startNewChat: 'नई बातचीत शुरू करें',
    contactSupport: 'सपोर्ट से संपर्क करें',
    createTicket: 'सपोर्ट टिकट बनाएं',
    ticketCreatedTitle: 'सपोर्ट टिकट सफलतापूर्वक बनाया गया',
    ticketCreatedMsg: 'आपका सपोर्ट टिकट बना दिया गया है। हमारे कृषि विशेषज्ञ जल्द ही आपसे संपर्क करेंगे।',
    ticketIdLabel: 'टिकट संख्या',
    resolutionPrompt: 'क्या आपकी समस्या हल हो गई है?',
    yesResolved: 'हाँ, समस्या हल हो गई',
    notResolved: 'नहीं, अतिरिक्त मदद चाहिए',
    rateExperience: 'किसानसेतु सहायता का अपना अनुभव रेट करें:',
    submitFeedback: 'फीडबैक भेजें',
    feedbackThanks: 'आपकी प्रतिक्रिया के लिए धन्यवाद! 🙏',
    feedbackPlaceholder: 'अपना अनुभव या कोई सुझाव साझा करें...',
    quickPromptsTitle: 'अक्सर पूछे जाने वाले विषय:',
    quickCropListings: 'मेरी फसलें मार्केटप्लेस में दिख रही हैं या नहीं?',
    quickMandiRates: 'आज के लाइव मंडी भाव और ट्रेंड्स दिखाएं',
    quickTrackOrders: 'मेरे सक्रिय ऑर्डर और डिलीवरी की स्थिति क्या है?',
    quickPaymentStatus: 'बिक्री का पैसा बैंक खाते में कब आएगा?',
    quickHumanAgent: 'कृषि विशेषज्ञ अधिकारी से बात कराएं',
    helplineBannerTitle: 'टोल-फ्री कृषक हेल्पलाइन (२४/७ उपलब्ध)',
    helplineCallBtn: 'कॉल करें',
    helplineSimulateBtn: 'लाइव वॉयस कॉल टेस्ट करें',
    securityNotice: 'सुरक्षा सूचना: किसानसेतु टीम कभी भी आपसे OTP, बैंक पिन या पासवर्ड नहीं मांगती।',
    aiDiagnosticTitle: 'रियल-टाइम सिस्टम डायग्नोस्टिक',
    aiDiagnosticDesc: 'सत्यापित किसानसेतु डेटाबेस और एगमार्कनेट मंडी दरों से प्रमाणित जानकारी।',
    verifiedDataBadge: 'सत्यापित डेटा',
    escalatedToAgent: 'अधिकारी को अग्रेषित',
    humanSupportAssigned: 'वरिष्ठ कृषि सलाहकार नियुक्त',
    offlineNotice: 'ऑफ़लाइन मोड • पुनः प्रयास करें',
    systemErrorFallback: 'माफ़ कीजिए, अभी AI सहायता सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद दोबारा प्रयास करें या सपोर्ट टिकट बनाएं।',
    ticketCategoryLabel: 'श्रेणी चुनें',
    ticketSubjectLabel: 'समस्या का विषय',
    ticketDescLabel: 'समस्या का पूरा विवरण',
    ticketPriorityLabel: 'प्राथमिकता',
    cancelBtn: 'रद्द करें',
    submitTicketBtn: 'टिकट दर्ज करें',
    categoryGeneral: 'सामान्य सहायता',
    categoryCrop: 'फसल लिस्टिंग व ग्रेडिंग',
    categoryOrder: 'ऑर्डर व डिलीवरी',
    categoryPayment: 'भुगतान व एस्क्रो खाता',
    categoryMandi: 'मंडी भाव व विश्लेषण',
    priorityLow: 'सामान्य (कम)',
    priorityMedium: 'मध्यम',
    priorityHigh: 'उच्च (जरूरी)',
    priorityUrgent: 'अति आवश्यक',
    statusOpen: 'खुला है',
    statusInReview: 'समीक्षा में',
    statusEscalated: 'अधिकारी को सौंपा गया',
    statusResolved: 'हल हो गया',
    statusClosed: 'बंद',
    noTicketsYet: 'अभी कोई सहायता टिकट दर्ज नहीं है।',
    viewDetails: 'विवरण देखें',
    backToChat: 'चैट पर वापस जाएं',
    voiceCalling: 'किसानसेतु हेल्पलाइन से कॉल जुड़ रही है...',
    voiceConnected: 'कॉल जुड़ी हुई है • अपनी समस्या बोलें',
    voiceHangup: 'कॉल समाप्त करें',
    voiceMute: 'म्यूट करें',
    voiceUnmute: 'अनम्यूट करें',
    voiceTranscript: 'कॉल ट्रांसक्रिप्ट:',
    voiceListeningNow: 'कृपया बोलें, हम सुन रहे हैं...',
    emailSubject: 'विषय',
    emailBodyPlaceholder: 'अपनी समस्या का विस्तृत विवरण लिखें...',
    sendEmailBtn: 'सपोर्ट ईमेल भेजें',
    emailSentSuccess: 'ईमेल सपोर्ट डेस्क को भेज दिया गया है।',
    howCanIHelp: 'नमस्ते! मैं किसानसेतु एआई सहायता सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?',
  },
  en: {
    appTitle: 'KisanSetu Support Assistant',
    appSubtitle: 'AI-Powered 24/7 Farmer & Buyer Helpline',
    activeStatus: 'Active • Instant Help',
    languageLabel: 'Language:',
    langHindi: '🇮🇳 हिंदी',
    langEnglish: '🇬🇧 English',
    tabChat: 'AI Chat',
    tabVoice: 'Helpline Call',
    tabEmail: 'Email Support',
    tabTickets: 'My Tickets',
    tabDiagnostic: 'System Diagnostics',
    inputPlaceholder: 'Type your question or issue (Hindi, English, or Hinglish)...',
    sendBtn: 'Send',
    listening: 'Listening...',
    speakPrompt: 'Speak issue',
    stopListening: 'Stop microphone',
    startNewChat: 'Start New Conversation',
    contactSupport: 'Contact Support',
    createTicket: 'Create Support Ticket',
    ticketCreatedTitle: 'Support Ticket Created Successfully',
    ticketCreatedMsg: 'Your support ticket has been created. Our agricultural specialist will contact you promptly.',
    ticketIdLabel: 'Ticket ID',
    resolutionPrompt: 'Was your issue resolved?',
    yesResolved: 'Yes, issue resolved',
    notResolved: 'No, need more help',
    rateExperience: 'Rate your KisanSetu Support experience:',
    submitFeedback: 'Submit Feedback',
    feedbackThanks: 'Thank you for your feedback! 🙏',
    feedbackPlaceholder: 'Share any details or suggestions...',
    quickPromptsTitle: 'Frequent Topics & Diagnostics:',
    quickCropListings: 'Are my crop listings visible in marketplace?',
    quickMandiRates: 'Show today\'s live mandi prices & trends',
    quickTrackOrders: 'Track my active order & delivery status',
    quickPaymentStatus: 'When will sales settlement reach my bank?',
    quickHumanAgent: 'Connect me with a Human Agricultural Officer',
    helplineBannerTitle: 'Toll-Free Agricultural Helpline (24/7 Available)',
    helplineCallBtn: 'Call Now',
    helplineSimulateBtn: 'Test Live Voice Call',
    securityNotice: 'Security Notice: KisanSetu never asks for OTP, Bank PIN, or Passwords.',
    aiDiagnosticTitle: 'Real-Time System Diagnostics',
    aiDiagnosticDesc: 'Grounded in live KisanSetu database and verified AGMARKNET mandi feeds.',
    verifiedDataBadge: 'Verified Data',
    escalatedToAgent: 'Escalated to Desk',
    humanSupportAssigned: 'Senior Agri Specialist Assigned',
    offlineNotice: 'Offline Mode • Retry Connection',
    systemErrorFallback: 'Sorry, the AI support service is temporarily unavailable. Please try again later or create a support ticket.',
    ticketCategoryLabel: 'Category',
    ticketSubjectLabel: 'Subject',
    ticketDescLabel: 'Detailed Description',
    ticketPriorityLabel: 'Priority',
    cancelBtn: 'Cancel',
    submitTicketBtn: 'Submit Ticket',
    categoryGeneral: 'General Support',
    categoryCrop: 'Crop Listing & Grading',
    categoryOrder: 'Orders & Delivery',
    categoryPayment: 'Payments & Escrow',
    categoryMandi: 'Mandi Rates & Trends',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High (Urgent)',
    priorityUrgent: 'Critical',
    statusOpen: 'Open',
    statusInReview: 'In Review',
    statusEscalated: 'Escalated',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    noTicketsYet: 'No support tickets found.',
    viewDetails: 'View Details',
    backToChat: 'Back to Chat',
    voiceCalling: 'Connecting to KisanSetu Helpline...',
    voiceConnected: 'Call Connected • Please speak your issue',
    voiceHangup: 'End Call',
    voiceMute: 'Mute',
    voiceUnmute: 'Unmute',
    voiceTranscript: 'Call Transcript:',
    voiceListeningNow: 'Listening to your voice...',
    emailSubject: 'Subject',
    emailBodyPlaceholder: 'Describe your inquiry in detail...',
    sendEmailBtn: 'Send Support Email',
    emailSentSuccess: 'Email dispatched to KisanSetu Support Desk.',
    howCanIHelp: 'Hello! I am your KisanSetu AI Support Assistant. How can I help you today?',
  },
};

export function getSupportTranslations(lang: SupportLanguage = 'hi'): SupportTranslations {
  return SUPPORT_TRANSLATIONS[lang] || SUPPORT_TRANSLATIONS.hi;
}
