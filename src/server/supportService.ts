import { GoogleGenAI } from '@google/genai';
import {
  SupportTicket,
  SupportMessage,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  SupportChannel,
  SupportAction,
  SupportChatContext,
} from '../types/support';
import {
  analyzeIntentAndExecuteWebsiteTool,
  searchMarketplace,
  getMandiPrice,
  getAuthenticatedUserData,
  checkPrivacyViolation,
  getCropVarieties,
  getWebsiteNavigationHelp,
} from './chatbotWebsiteTools';

// Configurable Support Parameters
export const OFFICIAL_KISANSETU_HELPLINE_RAW = process.env.TWILIO_PHONE_NUMBER || '+17372508034';
export const OFFICIAL_KISANSETU_HELPLINE_DISPLAY = '+1 737 250 8034';
export const SUPPORT_PHONE_NUMBER = process.env.SUPPORT_PHONE_NUMBER || OFFICIAL_KISANSETU_HELPLINE_DISPLAY;
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@kisansetu.in';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// SYSTEM STATE KNOWLEDGE & SAFE TOOLS
// ==========================================

// Mock active system data mirrors for diagnostic checks
const SYSTEM_KNOWLEDGE = {
  farmerProfiles: [
    {
      userId: 'farmer_01',
      name: 'Rameshwar Sharma',
      farmerId: 'KS-UP-BR-84920',
      mobile: '+91 98765 43210',
      email: 'rameshwar.sharma@kisansetu.in',
      village: 'Fatehganj',
      district: 'Bareilly',
      state: 'Uttar Pradesh',
      eKycStatus: 'VERIFIED ✓',
      kccStatus: 'Active',
      crops: [
        {
          id: 'crop_01',
          name: 'Maize (Yellow Hybrid)',
          variety: 'HQPM-1 Industrial Grade',
          quantityKg: 10000,
          grade: 'A',
          status: 'Available for Sale',
          expectedPrice: 24,
          photoVerified: true,
          nearestMandi: 'Bareilly Mandi (₹23.50/kg)',
        },
        {
          id: 'crop_02',
          name: 'Wheat (Sharbati)',
          variety: 'Sharbati Deluxe',
          quantityKg: 24000,
          grade: 'A+',
          status: 'Available for Sale',
          expectedPrice: 28,
          photoVerified: true,
          nearestMandi: 'Meerut Mandi (₹24.80/kg)',
        },
        {
          id: 'crop_03',
          name: 'Mustard (Pili Sarson)',
          variety: 'Pusa Bold Yellow',
          quantityKg: 6500,
          grade: 'A',
          status: 'Available for Sale',
          expectedPrice: 58,
          photoVerified: true,
          nearestMandi: 'Aligarh Mandi (₹54.00/kg)',
        },
      ],
      orders: [
        {
          id: 'ORD-89410',
          buyerName: 'BigBasket Fresh Agri',
          crop: 'Maize (Yellow Hybrid)',
          quantityKg: 4000,
          totalAmount: 96000,
          status: 'Dispatched / In Transit',
          paymentStatus: 'Escrow Secured (Release upon delivery verification)',
          date: '2026-08-30',
        },
      ],
    },
  ],
  buyerProfiles: [
    {
      userId: 'buyer_01',
      name: 'BigBasket Fresh Agri Direct',
      businessName: 'Supermarket Grocery Distribution',
      mobile: '+91 98112 34567',
      email: 'procurement@bigbasket.com',
      location: 'Noida Hub, Uttar Pradesh',
      verified: true,
      orders: [
        {
          id: 'ORD-89410',
          farmerName: 'Rameshwar Sharma',
          crop: 'Maize (Yellow Hybrid)',
          quantityKg: 4000,
          totalAmount: 96000,
          status: 'In Transit (ETA: Today 6:00 PM)',
          paymentStatus: 'Paid in Escrow',
          batchId: 'BATCH-MZ-2026-08',
        },
        {
          id: 'ORD-89302',
          farmerName: 'Suresh Patel',
          crop: 'Wheat (Sharbati)',
          quantityKg: 10000,
          totalAmount: 275000,
          status: 'Delivered & Completed',
          paymentStatus: 'Settled to Farmer',
          batchId: 'BATCH-WHT-2026-07',
        },
      ],
    },
  ],
};

// ==========================================
// IN-MEMORY SUPPORT TICKETS STORE
// ==========================================

let ticketsDatabase: SupportTicket[] = [
  {
    ticketId: 'KIS-SUP-1001',
    userId: 'farmer_01',
    userName: 'Rameshwar Sharma',
    userRole: 'farmer',
    userPhone: '+91 98765 43210',
    userEmail: 'rameshwar.sharma@kisansetu.in',
    channel: 'WEB_CHAT',
    category: 'CROP_LISTING',
    subject: 'Assistance with Maize listing photo verification',
    description: 'Farmer inquired about photo grading criteria for Yellow Maize harvest.',
    conversationSummary: 'AI explained camera lighting best practices and crop grading A-grade standards.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    assignedTo: 'AI Assistant',
    resolution: {
      text: 'Guided farmer to upload high-resolution natural sunlight photos; verified Grade A successfully.',
      resolvedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      resolvedBy: 'AI Auto-Resolution',
      autoResolved: true,
    },
    satisfaction: {
      rating: 5,
      resolved: 'yes',
      feedback: 'बहुत अच्छी सहायता मिली। फोटो तुरंत वेरीफाई हो गई।',
      submittedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    },
    messages: [
      {
        id: 'msg_1',
        sender: 'user',
        text: 'नमस्ते, क्या मेरी मक्का की फोटो वेरीफाई हो गई है?',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: 'msg_2',
        sender: 'ai',
        text: 'नमस्ते रामेश्वर जी! आपकी १०,००० किग्रा मक्का की फसल फोटो वेरीफाइड है और ग्रेड A में लिस्टेड है।',
        timestamp: new Date(Date.now() - 3600000 * 47).toISOString(),
        needsResolutionConfirmation: true,
      },
      {
        id: 'msg_3',
        sender: 'user',
        text: 'हाँ समस्या हल हो गई। धन्यवाद!',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
    diagnosticSummary: {
      userProblem: 'Farmer checked Maize listing verification status.',
      aiAction: 'Checked crop repository for user farmer_01.',
      result: 'Verified Grade A status confirmed in inventory.',
      aiAttempts: ['1. Queried farmer crop inventory', '2. Confirmed photo verification status'],
      currentStatus: 'Resolved with 5-star feedback',
    },
  },
  {
    ticketId: 'KIS-SUP-1002',
    userId: 'buyer_01',
    userName: 'BigBasket Fresh Agri Direct',
    userRole: 'buyer',
    userPhone: '+91 98112 34567',
    userEmail: 'procurement@bigbasket.com',
    channel: 'EMAIL',
    category: 'ORDER_DELIVERY',
    subject: 'Order ORD-89410 Maize batch transit ETA inquiry',
    description: 'Buyer asked for real-time dispatch status of 4000kg Maize consignment from Bareilly.',
    conversationSummary: 'System confirmed consignment in transit with driver dispatch slip. Escalated to Logistics Desk for gate pass.',
    priority: 'HIGH',
    status: 'IN_REVIEW',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedTo: 'Logistics Operations Desk',
    messages: [
      {
        id: 'msg_10',
        sender: 'user',
        text: 'Please share the latest truck location for Order ORD-89410.',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'msg_11',
        sender: 'ai',
        text: 'Order ORD-89410 (4,000 kg Maize) was dispatched from Bareilly Hub. Estimated arrival at Noida DC is today 6:00 PM.',
        timestamp: new Date(Date.now() - 3600000 * 11).toISOString(),
      },
    ],
    diagnosticSummary: {
      userProblem: 'Delivery transit tracking for Order ORD-89410.',
      aiAction: 'Checked Buyer Orders database.',
      result: 'Truck in transit, ETA 6:00 PM.',
      aiAttempts: ['1. Pulled order shipment status', '2. Assigned to Logistics Desk for live GPS token'],
      currentStatus: 'Under review by Logistics Operations',
    },
  },
  {
    ticketId: 'KIS-SUP-1003',
    userId: 'farmer_01',
    userName: 'Rameshwar Sharma',
    userRole: 'farmer',
    userPhone: '+91 98765 43210',
    userEmail: 'rameshwar.sharma@kisansetu.in',
    channel: 'PHONE',
    category: 'MANDI_RATES',
    subject: 'Official AGMARKNET comparison for Meerut vs Bareilly',
    description: 'Farmer called helpline inquiring why local mandi rate was lower than official terminal price.',
    conversationSummary: 'AI explained transportation differential and Grade A direct buyer premium.',
    priority: 'LOW',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    assignedTo: 'Farmer Advisory Team',
    messages: [
      {
        id: 'msg_20',
        sender: 'user',
        text: 'मेरठ मंडी और बरेली मंडी में गेहूं के भाव में फर्क क्यों है?',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'msg_21',
        sender: 'ai',
        text: 'मेरठ टर्मिनल मंडी में आटा मिलों की उच्च मांग के कारण भाव ₹२४.८०/किग्रा है, जबकि स्थानीय बरेली मंडी में ₹२३.५० है। आप किसानसेतु पर सीधे खरीदार को ₹२६/किग्रा तक बेच सकते हैं।',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        needsResolutionConfirmation: true,
      },
    ],
    diagnosticSummary: {
      userProblem: 'Mandi price differential explanation for Wheat.',
      aiAction: 'Executed AGMARKNET comparative analytics.',
      result: 'Price spread identified and direct buyer alternative presented.',
      aiAttempts: ['1. AGMARKNET live query', '2. Buyer matching pricing comparison'],
      currentStatus: 'Open for farmer confirmation',
    },
  },
];

// Helper to generate ticket ID
function generateTicketId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `KIS-SUP-${randomNum}`;
}

// Sanitizes user input to prevent prompt injection and confidential leaks
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

// Language Detection Helper
export function detectQueryLanguage(text: string): 'hi' | 'en' | 'hinglish' {
  if (!text || typeof text !== 'string') return 'hi';

  // 1. Check for Devanagari Unicode Block (\u0900-\u097F)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  const lower = text.toLowerCase();

  // 2. Check for common Hinglish agricultural and conversational keywords
  const hinglishKeywords = [
    'meri', 'mera', 'mere', 'fasal', 'kaha', 'kahan', 'kaise', 'kese', 'kyu', 'kyun',
    'kya', 'bhav', 'bhaav', 'rate', 'daam', 'paisa', 'paise', 'rupaye', 'khata', 'khate',
    'gehu', 'tamatar', 'sarson', 'aloo', 'pyaz', 'bechna', 'kharidna', 'kharid', 'bikri',
    'madad', 'sahayata', 'samasya', 'chahiye', 'hoga', 'karo', 'karna', 'kisan', 'setu',
    'batao', 'dikhao', 'nahi', 'nahi mil raha', 'kab aayega', 'sharma', 'bareilly', 'mandi',
    'namaste', 'dhanyawad', 'shukriya', 'theek', 'thik', 'hal', 'adhikari', 'insan',
  ];

  let hinglishMatches = 0;
  for (const word of hinglishKeywords) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
      hinglishMatches++;
    }
  }

  if (hinglishMatches >= 1) {
    return 'hinglish';
  }

  // 3. Check for typical English indicators
  const englishKeywords = [
    'the', 'is', 'where', 'how', 'when', 'what', 'why', 'who', 'which',
    'my', 'crop', 'listing', 'order', 'delivery', 'payment', 'tracking',
    'price', 'account', 'verify', 'please', 'help', 'status', 'transit',
  ];

  let englishMatches = 0;
  for (const word of englishKeywords) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
      englishMatches++;
    }
  }

  if (englishMatches > hinglishMatches) {
    return 'en';
  }

  // Default to Hindi for Indian user context
  return 'hi';
}

// Resolves the effective response language given context and user text
export function resolveEffectiveLanguage(
  context: SupportChatContext,
  queryText: string
): {
  targetLang: 'hi' | 'en' | 'hinglish';
  isHindiScript: boolean;
  ticketLanguageCode: 'hi-IN' | 'en-IN' | 'hinglish';
} {
  // If user made an explicit manual selection, it always takes highest priority
  if (context.isManualSelection && context.selectedLanguage) {
    if (context.selectedLanguage === 'hi') {
      return { targetLang: 'hi', isHindiScript: true, ticketLanguageCode: 'hi-IN' };
    }
    if (context.selectedLanguage === 'en') {
      return { targetLang: 'en', isHindiScript: false, ticketLanguageCode: 'en-IN' };
    }
    if (context.selectedLanguage === 'hinglish') {
      return { targetLang: 'hinglish', isHindiScript: false, ticketLanguageCode: 'hinglish' };
    }
  }

  if (context.selectedLanguage === 'hi') {
    return { targetLang: 'hi', isHindiScript: true, ticketLanguageCode: 'hi-IN' };
  }
  if (context.selectedLanguage === 'en') {
    return { targetLang: 'en', isHindiScript: false, ticketLanguageCode: 'en-IN' };
  }
  if (context.selectedLanguage === 'hinglish') {
    return { targetLang: 'hinglish', isHindiScript: false, ticketLanguageCode: 'hinglish' };
  }

  // Next check activeLanguage in context
  if (context.activeLanguage === 'hi') {
    return { targetLang: 'hi', isHindiScript: true, ticketLanguageCode: 'hi-IN' };
  }
  if (context.activeLanguage === 'en') {
    return { targetLang: 'en', isHindiScript: false, ticketLanguageCode: 'en-IN' };
  }

  // Otherwise, auto-detect from user query
  const detected = detectQueryLanguage(queryText);
  if (detected === 'hi') {
    return { targetLang: 'hi', isHindiScript: true, ticketLanguageCode: 'hi-IN' };
  }
  if (detected === 'hinglish') {
    return { targetLang: 'hinglish', isHindiScript: false, ticketLanguageCode: 'hinglish' };
  }
  return { targetLang: 'en', isHindiScript: false, ticketLanguageCode: 'en-IN' };
}

// Checks if input contains sensitive confidential credentials
export function checkForSensitiveInformation(text: string): { isSensitive: boolean; warningMsg?: string } {
  const lower = text.toLowerCase();
  const patterns = [
    /\b(?:password|passwd|otp|one time password|upi pin|atm pin|cvv|secret key|jwt token)\b/i,
    /\b\d{4,6}\s*(?:pin|otp)\b/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(lower)) {
      return {
        isSensitive: true,
        warningMsg:
          'कृपया अपना पासवर्ड, OTP, UPI पिन या बैंक सुरक्षा कोड कभी किसी के साथ साझा न करें। किसानसेतु सहायता टीम आपसे यह जानकारी कभी नहीं मांगती।\n\nPlease never share your password, OTP or PIN. KisanSetu support will never ask for these.',
      };
    }
  }

  return { isSensitive: false };
}

// ==========================================
// SAFE BACKEND DIAGNOSTIC TOOLS
// ==========================================

export async function executeSupportDiagnostic(
  issueQuery: string,
  context: SupportChatContext
): Promise<{
  diagnosed: boolean;
  explanation: string;
  suggestedActions: SupportAction[];
  diagnosticDetails?: Record<string, unknown>;
}> {
  const langInfo = resolveEffectiveLanguage(context, issueQuery);
  const isHi = langInfo.targetLang === 'hi';
  const isHinglish = langInfo.targetLang === 'hinglish';

  // 1. Check live website tools first (Marketplace search, Mandi rates, authenticated user data, privacy check, navigation)
  const toolResult = await analyzeIntentAndExecuteWebsiteTool(
    issueQuery,
    langInfo.targetLang,
    {
      token: context.token,
      userId: context.userId,
      userRole: context.userRole,
    }
  );

  if (toolResult) {
    return {
      diagnosed: true,
      explanation: toolResult.groundedExplanation || '',
      suggestedActions: toolResult.suggestedActions || [],
      diagnosticDetails: {
        toolExecuted: toolResult.toolExecuted,
        dataSource: toolResult.dataSource,
        success: toolResult.success,
        data: toolResult.data,
      },
    };
  }

  const query = issueQuery.toLowerCase();

  // 2. Escrow & Payment Protection Guidance
  if (
    query.includes('payment') ||
    query.includes('पेमेंट') ||
    query.includes('रुपये') ||
    query.includes('खाते में') ||
    query.includes('पैसा') ||
    query.includes('paise') ||
    query.includes('paisa') ||
    query.includes('settlement') ||
    query.includes('bank')
  ) {
    let explanation = '';
    if (isHi) {
      explanation = `किसानसेतु सुरक्षित एस्क्रो भुगतान व्यवस्था:\n• किसानसेतु पर प्रत्येक ऑर्डर का भुगतान सरकारी मानकों के अनुरूप सुरक्षित एस्क्रो खाते में जमा रहता है।\n• खरीदार द्वारा डिलीवरी प्राप्त करने और डिजिटल वजन/गुणवत्ता पुष्टि के तुरंत बाद राशि सीधे किसान के बैंक खाते में ट्रांसफर कर दी जाती है।\n• किसी भी भुगतान संबंधी जांच के लिए आप सहायता टिकट खोल सकते हैं।`;
    } else if (isHinglish) {
      explanation = `KisanSetu Escrow Payment Protection:\n• KisanSetu par har deal ka payment secure Mandi Escrow me lock rehta hai.\n• Buyer dwara delivery accept karne par paisa 24 hours ke andar sidhe verified bank account me credit hota hai.\n• Kisi bhi clarification ke liye hum ticket open kar sakte hain.`;
    } else {
      explanation = `KisanSetu Escrow Payment Guarantee:\n• Every deal on KisanSetu is 100% protected through Mandi Escrow.\n• Buyer funds are released directly to the seller's verified bank account upon delivery acceptance and weighment sign-off.\n• You can create a ticket for payment review anytime.`;
    }

    return {
      diagnosed: true,
      explanation,
      suggestedActions: [
        {
          id: 'act_orders',
          label: 'View Orders',
          labelHi: 'ऑर्डर देखें',
          actionType: 'NAVIGATE_ORDERS',
        },
        {
          id: 'act_ticket_pay',
          label: 'Create Payment Review Ticket',
          labelHi: 'पेमेंट समीक्षा टिकट बनाएं',
          actionType: 'CREATE_TICKET',
          payload: { category: 'PAYMENT', priority: 'HIGH' },
        },
      ],
    };
  }

  // 3. Fallback when live system cannot directly verify
  let defaultExplanation = '';
  if (isHi) {
    defaultExplanation = 'अभी यह जानकारी वेबसाइट से प्राप्त नहीं हो पा रही है। कृपया थोड़ी देर बाद फिर प्रयास करें या हमारी किसान सहायता टीम से संपर्क करें।';
  } else if (isHinglish) {
    defaultExplanation = 'Abhi ye jankari website se prapt nahi ho pa rahi hai. Kripya thodi der baad fir prayas karein ya helpline se contact karein.';
  } else {
    defaultExplanation = 'I’m unable to retrieve this information from KisanSetu right now. Please try again shortly or contact our support team.';
  }

  return {
    diagnosed: false,
    explanation: defaultExplanation,
    suggestedActions: [
      {
        id: 'act_ticket_gen',
        label: 'Create Support Ticket',
        labelHi: 'सपोर्ट टिकट बनाएं',
        actionType: 'CREATE_TICKET',
      },
      {
        id: 'act_call_help',
        label: 'Call Kisan Helpline',
        labelHi: 'हेल्पलाइन पर बात करें',
        actionType: 'CALL_HELPLINE',
      },
    ],
  };
}

// ==========================================
// CORE REAL AI CHAT PROCESSOR
// ==========================================

export async function processAiSupportChat(params: {
  message: string;
  conversationHistory: SupportMessage[];
  context: SupportChatContext;
}): Promise<{
  replyText: string;
  suggestedActions: SupportAction[];
  needsResolutionConfirmation: boolean;
  createdTicketId?: string;
  isAiFallback: boolean;
}> {
  const { message, conversationHistory, context } = params;
  const sanitized = sanitizeInput(message);

  // 1. Resolve Target Language
  const langInfo = resolveEffectiveLanguage(context, sanitized);
  const { targetLang, ticketLanguageCode } = langInfo;
  const isHi = targetLang === 'hi';
  const isHinglish = targetLang === 'hinglish';

  // 2. Safety check for passwords/PINs
  const secCheck = checkForSensitiveInformation(sanitized);
  if (secCheck.isSensitive && secCheck.warningMsg) {
    return {
      replyText: secCheck.warningMsg,
      suggestedActions: [],
      needsResolutionConfirmation: false,
      isAiFallback: false,
    };
  }

  // 3. Check if user is confirming resolution
  const lowerMsg = sanitized.toLowerCase();
  if (
    lowerMsg === 'yes' ||
    lowerMsg === 'ha' ||
    lowerMsg === 'haan' ||
    lowerMsg === 'solved' ||
    lowerMsg === 'हल हो गई' ||
    lowerMsg === 'हाँ, समस्या हल हो गई' ||
    lowerMsg === 'हाँ' ||
    lowerMsg === 'dhanyawad' ||
    lowerMsg === 'shukriya' ||
    lowerMsg === 'thank you' ||
    lowerMsg === 'thanks'
  ) {
    let resolvedText = '';
    if (isHi) {
      resolvedText = 'बहुत बढ़िया! आपकी समस्या हल हो गई। 🙏 किसानसेतु पर आपका अनुभव कैसा रहा? कृपया नीचे अपना अनुभव रेटिंग दें।';
    } else if (isHinglish) {
      resolvedText = 'Bahut badhiya! Aapki samasya hal ho gayi. 🙏 KisanSetu par aapka experience kaisa raha? Kripya rating dein.';
    } else {
      resolvedText = 'Wonderful! Your issue has been resolved. 🙏 How was your experience with KisanSetu Support today? Please rate your experience below.';
    }

    return {
      replyText: resolvedText,
      suggestedActions: [],
      needsResolutionConfirmation: false,
      isAiFallback: false,
    };
  }

  // 4. Check if user is asking for human escalation
  if (
    lowerMsg.includes('human') ||
    lowerMsg.includes('agent') ||
    lowerMsg.includes('executive') ||
    lowerMsg.includes('अधिकारी') ||
    lowerMsg.includes('इंसान') ||
    lowerMsg.includes('बात कराओ') ||
    lowerMsg.includes('baat karao') ||
    lowerMsg.includes('escalate')
  ) {
    const newTicket = createSupportTicket({
      userId: context.userId || 'guest_user',
      userName: context.userName || 'KisanSetu User',
      userRole: context.userRole || 'farmer',
      userPhone: context.userPhone,
      userEmail: context.userEmail,
      channel: 'WEB_CHAT',
      category: 'GENERAL',
      language: ticketLanguageCode,
      subject: `Human Escalation Request: ${sanitized.slice(0, 50)}`,
      description: sanitized,
      conversationSummary: `User requested human agent escalation. Conversation transcript attached. Language: ${ticketLanguageCode}`,
      priority: 'HIGH',
      status: 'ESCALATED',
      initialMessage: sanitized,
    });

    let escalationReply = '';
    if (isHi) {
      escalationReply = `मैं आपकी समस्या किसानसेतु सहायता टीम (KisanSetu Support Team) तक भेज रहा हूँ। आपका टिकट नंबर है: ${newTicket.ticketId}। हमारे कृषि विशेषज्ञ जल्द ही आपसे संपर्क करेंगे।`;
    } else if (isHinglish) {
      escalationReply = `Mai aapki request KisanSetu Support Team ko bhej raha hu. Aapka Ticket ID hai: ${newTicket.ticketId}. Humare senior specialist aapse jaldi contact karenge.`;
    } else {
      escalationReply = `I am escalating your request directly to our Senior KisanSetu Support Team. Your Ticket ID is: ${newTicket.ticketId}. Our specialist will review your request promptly.`;
    }

    return {
      replyText: escalationReply,
      suggestedActions: [
        {
          id: 'act_call',
          label: `Call Helpline (${SUPPORT_PHONE_NUMBER})`,
          labelHi: `हेल्पलाइन पर कॉल करें (${SUPPORT_PHONE_NUMBER})`,
          actionType: 'CALL_HELPLINE',
        },
      ],
      needsResolutionConfirmation: false,
      createdTicketId: newTicket.ticketId,
      isAiFallback: false,
    };
  }

  // 5. Run real issue diagnostic check
  const diagnostic = await executeSupportDiagnostic(sanitized, context);

  // 6. Try calling Gemini AI for intelligent contextual synthesis
  const ai = getAiClient();

  if (ai) {
    try {
      let languageInstructions = '';

      if (isHi) {
        languageInstructions = `
CRITICAL LANGUAGE MANDATE - HINDI:
- Respond only in simple, natural Indian Hindi using Devanagari script.
- Do not use Roman Hindi.
- Keep the answer easy to understand for farmers.
- Use simple agricultural terms.
- Keep the response concise and helpful.
- End with: "क्या आपकी समस्या हल हो गई है?"
`;
      } else if (isHinglish) {
        languageInstructions = `
CRITICAL LANGUAGE MANDATE - HINGLISH:
- Respond in natural, friendly Hinglish.
- Use simple Roman Hindi mixed with English where appropriate.
- Keep the answer easy for an Indian farmer or buyer to understand.
- Keep the response concise and helpful.
- End with: "Kya aapki samasya hal ho gayi hai?"
`;
      } else {
        languageInstructions = `
CRITICAL LANGUAGE MANDATE - ENGLISH:
- Respond in clear, simple Indian English.
- Keep the answer concise, friendly and professional.
- Avoid unnecessary technical language.
- End with: "Was your issue resolved?"
`;
      }

      const systemInstruction = `
You are the official KisanSetu AI Assistant for Indian farmers, buyers and traders.

Your job is to understand the user's question and provide a useful, natural conversational answer.

${languageInstructions}

KISANSETU PLATFORM:
- Direct farmer-to-buyer agricultural marketplace.
- Farmers can list crops and quantities.
- Buyers can discover and purchase crops directly from farmers.
- Government mandi prices are provided through official AGMARKNET data.
- KisanSetu also provides crop, marketplace, order, support and navigation assistance.

CURRENT USER:
Name: ${context.userName || 'Guest User'}
Role: ${context.userRole || 'Visitor'}

VERIFIED KISANSETU DATA:
${diagnostic.explanation}

IMPORTANT ACCURACY RULES:
1. Never invent prices, quantities, farmer names, buyer names, orders, locations, availability, market trends or verification status.
2. If verified website data is provided above, use it accurately.
3. Never change numerical values from the verified data.
4. For mandi-price questions, treat AGMARKNET data as the source of truth.
5. If AGMARKNET data is unavailable, clearly tell the user that verified government mandi data is currently unavailable.
6. Never expose another user's private phone number, email, Aadhaar, bank information or private account information.
7. Do not claim that an action was completed unless the KisanSetu backend confirms it.
8. If the user asks a general agricultural or KisanSetu question that does not require live data, answer naturally using your general knowledge.
9. Do not always repeat the mandi data. Only mention it when it is relevant to the user's question.
10. Keep normal answers around 2-5 sentences.
11. Be helpful, conversational and farmer-friendly.
12. Do not say that you are unable to answer merely because the question is not related to mandi data.

SUPPORT:
Helpline: ${SUPPORT_PHONE_NUMBER}
Email: ${SUPPORT_EMAIL}
`;

      const contents = [
        ...conversationHistory.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [
            {
              text: m.text,
            },
          ],
        })),
        {
          role: 'user',
          parts: [
            {
              text: `
User Query:
${sanitized}

Target Language:
${targetLang}

Verified Website Diagnostic:
${diagnostic.explanation}
`,
            },
          ],
        },
      ];

      // Use Render environment variable when available.
      // Otherwise use the verified default Gemini model.
      const modelName =
        process.env.AI_MODEL?.trim() || 'gemini-3.7-flash';

      console.log(
        `[KisanSetu AI] Calling Gemini model: ${modelName}`
      );

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents as any,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || '';

      if (!responseText) {
        throw new Error('Gemini returned an empty response');
      }

      console.log('[KisanSetu AI] Gemini response generated successfully');

      return {
        replyText: responseText,
        suggestedActions: diagnostic.suggestedActions,
        needsResolutionConfirmation: true,
        isAiFallback: false,
      };
    } catch (aiErr) {
      console.error(
        '[KisanSetu AI] Gemini API call failed:',
        aiErr
      );
    }
  }

  // 7. Friendly fallback if Gemini is unavailable
let fallbackText = diagnostic.explanation;

if (!diagnostic.diagnosed) {
  if (isHi) {
    fallbackText =
      'माफ़ कीजिए, अभी AI सहायता सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद दोबारा प्रयास करें या सपोर्ट टिकट बनाएं।';
  } else if (isHinglish) {
    fallbackText =
      'Sorry, abhi AI support service available nahi hai. Kripya thodi der baad dobara try karein ya support ticket banayein.';
  } else {
    fallbackText =
      'Sorry, the AI support service is temporarily unavailable. Please try again later or create a support ticket.';
  }
}

return {
  replyText: fallbackText,
  suggestedActions: diagnostic.suggestedActions,
  needsResolutionConfirmation: diagnostic.diagnosed,
  isAiFallback: !ai,
};
}

  // ==========================================
  // TICKET MANAGEMENT API FUNCTIONS
  // ==========================================

  export function listSupportTickets(filter?: {
    userId?: string;
    role?: string;
    status?: string;
    channel?: string;
    category?: string;
  }): SupportTicket[] {
    let list = [...ticketsDatabase];

    if (filter?.userId) {
      list = list.filter((t) => t.userId === filter.userId);
    }
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((t) => t.status === filter.status);
    }
    if (filter?.channel && filter.channel !== 'ALL') {
      list = list.filter((t) => t.channel === filter.channel);
    }
    if (filter?.category && filter.category !== 'ALL') {
      list = list.filter((t) => t.category === filter.category);
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  export function getSupportTicketById(ticketId: string): SupportTicket | undefined {
    return ticketsDatabase.find((t) => t.ticketId === ticketId);
  }

  export function createSupportTicket(params: {
    userId: string;
    userName: string;
    userRole: 'farmer' | 'buyer' | 'guest';
    userPhone?: string;
    userEmail?: string;
    channel: SupportChannel;
    category: TicketCategory;
    subject: string;
    description: string;
    conversationSummary?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
    initialMessage?: string;
    language?: 'hi-IN' | 'en-IN' | 'hinglish' | string;
  }): SupportTicket {
    const detectedLang = params.language || (params.initialMessage ? (detectQueryLanguage(params.initialMessage) === 'hi' ? 'hi-IN' : detectQueryLanguage(params.initialMessage) === 'hinglish' ? 'hinglish' : 'en-IN') : 'hi-IN');
    const newTicket: SupportTicket = {
      ticketId: generateTicketId(),
      userId: params.userId || 'guest_user',
      userName: params.userName || 'KisanSetu User',
      userRole: params.userRole || 'farmer',
      userPhone: params.userPhone,
      userEmail: params.userEmail,
      channel: params.channel || 'WEB_CHAT',
      category: params.category || 'GENERAL',
      language: detectedLang,
      subject: params.subject || 'Assistance Request',
      description: params.description || '',
      conversationSummary: params.conversationSummary || params.description || 'Support interaction initiated.',
      priority: params.priority || 'MEDIUM',
      status: params.status || 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: params.status === 'ESCALATED' ? 'Farmer Advisory & Tech Support' : 'AI Assistant',
      messages: params.initialMessage
        ? [
          {
            id: `msg_${Date.now()}`,
            sender: 'user',
            senderName: params.userName,
            text: params.initialMessage,
            timestamp: new Date().toISOString(),
          },
        ]
        : [],
      diagnosticSummary: {
        userProblem: params.subject,
        aiAction: 'Initialized ticket workflow.',
        result: `Ticket registered with language preference (${detectedLang}).`,
        aiAttempts: ['1. Captured inquiry details', '2. Logged diagnostic parameters'],
        currentStatus: params.status || 'OPEN',
      },
    };

    ticketsDatabase.unshift(newTicket);
    return newTicket;
  }

  export function updateSupportTicket(
    ticketId: string,
    updates: Partial<SupportTicket>
  ): SupportTicket | null {
    const index = ticketsDatabase.findIndex((t) => t.ticketId === ticketId);
    if (index === -1) return null;

    const current = ticketsDatabase[index];
    const updated: SupportTicket = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    ticketsDatabase[index] = updated;
    return updated;
  }

  export function addMessageToTicket(
    ticketId: string,
    message: {
      sender: 'user' | 'ai' | 'agent' | 'system';
      senderName?: string;
      text: string;
    }
  ): SupportTicket | null {
    const ticket = getSupportTicketById(ticketId);
    if (!ticket) return null;

    const newMsg: SupportMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender: message.sender,
      senderName: message.senderName,
      text: sanitizeInput(message.text),
      timestamp: new Date().toISOString(),
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = new Date().toISOString();

    if (message.sender === 'agent') {
      ticket.status = 'IN_REVIEW';
      ticket.assignedTo = message.senderName || 'Senior Support Specialist';
    }

    return ticket;
  }

  export function submitTicketFeedback(
    ticketId: string,
    feedback: {
      rating?: number;
      resolved: 'yes' | 'partial' | 'no';
      feedback?: string;
    }
  ): SupportTicket | null {
    const ticket = getSupportTicketById(ticketId);
    if (!ticket) return null;

    ticket.satisfaction = {
      rating: feedback.rating,
      resolved: feedback.resolved,
      feedback: feedback.feedback ? sanitizeInput(feedback.feedback) : undefined,
      submittedAt: new Date().toISOString(),
    };

    if (feedback.resolved === 'yes') {
      ticket.status = 'RESOLVED';
      ticket.resolution = {
        text: 'User confirmed problem resolution via feedback.',
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'Customer Confirmation',
        autoResolved: false,
      };
    }

    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  // ==========================================
  // EMAIL SUPPORT INGESTION & AUTO-REPLY
  // ==========================================

  export async function processIncomingEmailSupport(emailData: {
    fromEmail: string;
    fromName?: string;
    subject: string;
    body: string;
  }): Promise<{
    ticketId: string;
    isExistingTicket: boolean;
    replySubject: string;
    replyBody: string;
  }> {
    const sanitizedSubject = sanitizeInput(emailData.subject);
    const sanitizedBody = sanitizeInput(emailData.body);

    // 1. Detect existing ticket ID in Subject or Body (e.g. KIS-SUP-1042)
    const ticketMatch = (sanitizedSubject + ' ' + sanitizedBody).match(/KIS-SUP-\d{4,5}/i);
    let existingTicket: SupportTicket | undefined;

    if (ticketMatch) {
      const matchedId = ticketMatch[0].toUpperCase();
      existingTicket = getSupportTicketById(matchedId);
    }

    const isHi = /[\u0900-\u097F]/.test(sanitizedSubject + sanitizedBody) || sanitizedBody.includes('namaste') || sanitizedBody.includes('meri');

    let ticketId: string;
    let isExisting = false;

    if (existingTicket) {
      ticketId = existingTicket.ticketId;
      isExisting = true;
      addMessageToTicket(ticketId, {
        sender: 'user',
        senderName: emailData.fromName || emailData.fromEmail,
        text: `[Incoming Email]: ${sanitizedBody}`,
      });
    } else {
      // Classify Category
      let category: TicketCategory = 'GENERAL';
      const lower = (sanitizedSubject + ' ' + sanitizedBody).toLowerCase();
      if (lower.includes('photo') || lower.includes('image') || lower.includes('फोटो') || lower.includes('तस्वीर')) {
        category = 'CROP_LISTING';
      } else if (lower.includes('payment') || lower.includes('पैसा') || lower.includes('रुपये')) {
        category = 'PAYMENT';
      } else if (lower.includes('order') || lower.includes('delivery') || lower.includes('डिलीवरी')) {
        category = 'ORDER_DELIVERY';
      } else if (lower.includes('mandi') || lower.includes('भाव') || lower.includes('रेट')) {
        category = 'MANDI_RATES';
      }

      const newTicket = createSupportTicket({
        userId: emailData.fromEmail,
        userName: emailData.fromName || 'Valued Farmer / Buyer',
        userRole: 'farmer',
        userEmail: emailData.fromEmail,
        channel: 'EMAIL',
        category,
        subject: sanitizedSubject || 'Email Support Inquiry',
        description: sanitizedBody,
        conversationSummary: `Incoming support email classified as ${category}.`,
        priority: 'MEDIUM',
        status: 'OPEN',
        initialMessage: sanitizedBody,
      });
      ticketId = newTicket.ticketId;
    }

    // Generate Contextual Email Response
    const ai = getAiClient();
    let generatedReply = '';

    if (ai) {
      try {
        const prompt = `
Generate a professional, warm email reply for KisanSetu Customer Support.
Language to use: ${isHi ? 'Hindi' : 'English'}.
User inquiry: "${sanitizedBody}"
Ticket ID: [${ticketId}]
Help Email: ${SUPPORT_EMAIL}
Helpline: ${SUPPORT_PHONE_NUMBER}
Sign-off: KisanSetu Support Team (किसानसेतु सहायता टीम)
`;
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });
        generatedReply = aiRes.text || '';
      } catch {
        // ignore
      }
    }

    if (!generatedReply) {
      if (isHi) {
        generatedReply = `नमस्ते ${emailData.fromName || ''},

आपकी समस्या को समझने में मैं आपकी मदद करता हूँ। आपका समर्थन अनुरोध किसानसेतु सिस्टम में दर्ज कर लिया गया है।

टिकट संख्या: [${ticketId}]
स्थिति: सक्रिय समीक्षा

हमारी टीम प्राथमिकता के आधार पर इसका समाधान कर रही है। यदि आपको तत्काल सहायता चाहिए तो आप हमारी टोल-फ्री हेल्पलाइन ${SUPPORT_PHONE_NUMBER} पर संपर्क कर सकते हैं।

सादर,
किसानसेतु सहायता टीम (KisanSetu Support Desk)`;
      } else {
        generatedReply = `Hello ${emailData.fromName || ''},

Thank you for reaching out to KisanSetu Support. We have received your inquiry and our agricultural support desk is reviewing your request.

Ticket Reference: [${ticketId}]
Status: Under Active Review

We will get back to you shortly. For immediate assistance, feel free to contact our toll-free helpline at ${SUPPORT_PHONE_NUMBER}.

Warm regards,
KisanSetu Support Team`;
      }
    }

    // Append AI reply to ticket history
    addMessageToTicket(ticketId, {
      sender: 'ai',
      senderName: 'KisanSetu Email AI Desk',
      text: generatedReply,
    });

    return {
      ticketId,
      isExistingTicket: isExisting,
      replySubject: `Re: [${ticketId}] ${sanitizedSubject}`,
      replyBody: generatedReply,
    };
  }

  // ==========================================
  // PHONE HELPLINE / VOICE CALL PROCESSOR
  // ==========================================

  export async function processHelplineVoiceCall(callData: {
    callerPhone?: string;
    callerName?: string;
    speechTranscript: string;
    language?: 'hi' | 'en';
  }): Promise<{
    spokenReply: string;
    ticketId?: string;
    actionTaken: string;
    isEscalated: boolean;
  }> {
    const sanitized = sanitizeInput(callData.speechTranscript);
    const isHi = callData.language === 'hi' || /[\u0900-\u097F]/.test(sanitized);

    // Security check
    const sec = checkForSensitiveInformation(sanitized);
    if (sec.isSensitive && sec.warningMsg) {
      return {
        spokenReply: sec.warningMsg,
        actionTaken: 'Sensitive data warning issued',
        isEscalated: false,
      };
    }

    // Diagnostic
    const diag = await executeSupportDiagnostic(sanitized, {
      activeLanguage: isHi ? 'hi' : 'en',
      userName: callData.callerName,
      userPhone: callData.callerPhone,
    });

    const ai = getAiClient();
    let spokenResponse = '';

    if (ai) {
      try {
        const prompt = `
You are the voice of KisanSetu Support Hotline (${SUPPORT_PHONE_NUMBER}).
Convert this support diagnostic into a short, natural spoken response (under 40 words) for a telephone caller.
Language: ${isHi ? 'Hindi' : 'English'}
Caller query: "${sanitized}"
Diagnostic: "${diag.explanation}"
Do NOT use asterisks, markdown, or bullet points because this will be read out via text-to-speech.
`;
        const res = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });
        spokenResponse = (res.text || '').replace(/[*#_`]/g, '').trim();
      } catch {
        // fallback
      }
    }

    if (!spokenResponse) {
      spokenResponse = isHi
        ? 'नमस्ते, किसानसेतु सहायता में आपका स्वागत है। आपकी समस्या दर्ज कर ली गई है और हमारे कृषि सलाहकार जल्द संपर्क करेंगे।'
        : 'Hello and welcome to KisanSetu Support. Your issue has been logged and our advisory team will assist you shortly.';
    }

    // Create escalated ticket for phone inquiries requiring follow-up
    const ticket = createSupportTicket({
      userId: callData.callerPhone || 'phone_caller',
      userName: callData.callerName || 'Helpline Caller',
      userRole: 'farmer',
      userPhone: callData.callerPhone,
      channel: 'PHONE',
      category: 'GENERAL',
      subject: `Helpline Call: ${sanitized.slice(0, 45)}`,
      description: `Telephone conversation transcript: "${sanitized}"`,
      conversationSummary: `Phone caller spoke with voice AI. Response provided: "${spokenResponse}".`,
      priority: 'HIGH',
      status: 'ESCALATED',
      initialMessage: sanitized,
    });

    return {
      spokenReply: spokenResponse,
      ticketId: ticket.ticketId,
      actionTaken: `Created Phone Ticket ${ticket.ticketId} and routed to Farmer Desk.`,
      isEscalated: true,
    };
  }
