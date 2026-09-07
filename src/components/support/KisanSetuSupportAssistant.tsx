import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Star,
  Shield,
  HelpCircle,
  Globe,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import {
  SupportTicket,
  SupportMessage,
  SupportAction,
  SupportChatContext,
} from '../../types/support';
import {
  sendSupportChatMessage,
  fetchSupportConfig,
  fetchSupportTickets,
  createSupportTicket,
  submitTicketFeedback,
  processHelplineVoiceCall,
  processEmailSupport,
  SupportConfig,
  OFFICIAL_KISANSETU_HELPLINE_DISPLAY,
} from '../../services/supportApiService';
import {
  SupportLanguage,
  SUPPORT_I18N,
  getSupportText,
  detectInitialSupportLanguage,
} from '../../i18n/supportTranslations';

interface KisanSetuSupportAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  userContext?: {
    userId?: string;
    userName?: string;
    userRole?: 'farmer' | 'buyer' | 'guest';
    userPhone?: string;
    userEmail?: string;
  };
  initialPrompt?: string;
  onNavigateAction?: (actionType: string, payload?: Record<string, unknown>) => void;
}

export const KisanSetuSupportAssistant: React.FC<KisanSetuSupportAssistantProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  userContext,
  initialPrompt,
  onNavigateAction,
}) => {
  // Support Language Selector state (defaults to app language or browser detection)
  const [supportLanguage, setSupportLanguage] = useState<SupportLanguage>(() => {
    const saved = localStorage.getItem('kisansetu_support_lang') as SupportLanguage;
    if (saved && ['hi', 'en', 'pa', 'hr', 'te', 'ta'].includes(saved)) {
      return saved;
    }
    return currentLanguage || detectInitialSupportLanguage();
  });

  const [activeTab, setActiveTab] = useState<'chat' | 'phone' | 'email' | 'tickets'>('chat');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState(false);
  const [config, setConfig] = useState<SupportConfig>({
    phoneNumber: OFFICIAL_KISANSETU_HELPLINE_DISPLAY,
    email: 'support@kisansetu.in',
    isAiEnabled: true,
    channels: ['WEB_CHAT', 'PHONE', 'EMAIL', 'VOICE'],
  });

  // Satisfaction feedback state for current interaction
  const [resolvedPromptState, setResolvedPromptState] = useState<{
    show: boolean;
    ticketId?: string;
    rating?: number;
    submitted: boolean;
  }>({ show: false, submitted: false });

  // Escalated Ticket Banner State
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  // Tickets list for "My Tickets" tab
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Phone Helpline Simulator State
  const [phoneCallState, setPhoneCallState] = useState<{
    inCall: boolean;
    callerName: string;
    callerPhone: string;
    transcript: string;
    reply: string;
    isListening: boolean;
    ticketCreated?: string;
  }>({
    inCall: false,
    callerName: userContext?.userName || 'Rameshwar Sharma',
    callerPhone: userContext?.userPhone || '+91 98765 43210',
    transcript: '',
    reply: '',
    isListening: false,
  });

  // Email Support Form State
  const [emailFormState, setEmailFormState] = useState<{
    subject: string;
    body: string;
    fromEmail: string;
    fromName: string;
    isSending: boolean;
    result?: { ticketId: string; replySubject: string; replyBody: string };
  }>({
    subject: '',
    body: '',
    fromEmail: userContext?.userEmail || 'rameshwar.sharma@kisansetu.in',
    fromName: userContext?.userName || 'Rameshwar Sharma',
    isSending: false,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isHi = supportLanguage === 'hi';

  // Load config on mount
  useEffect(() => {
    fetchSupportConfig().then(setConfig);
  }, []);

  // Sync with prop change if not manually overridden in local storage
  useEffect(() => {
    if (currentLanguage) {
      const saved = localStorage.getItem('kisansetu_support_lang');
      if (!saved) {
        setSupportLanguage(currentLanguage);
      }
    }
  }, [currentLanguage]);

  // Build welcome message helper
  const getWelcomeMessageObject = (lang: SupportLanguage): SupportMessage => ({
    id: `welcome_${Date.now()}`,
    sender: 'ai',
    text: getSupportText('welcomeMessage', lang),
    timestamp: new Date().toISOString(),
    suggestedActions: [
      {
        id: 'q_crop',
        label: getSupportText('quickActionCropListing', 'en'),
        labelHi: getSupportText('quickActionCropListing', 'hi'),
        actionType: 'NAVIGATE_ADD_CROP',
      },
      {
        id: 'q_mandi',
        label: getSupportText('quickActionMandiRates', 'en'),
        labelHi: getSupportText('quickActionMandiRates', 'hi'),
        actionType: 'NAVIGATE_MANDI',
      },
      {
        id: 'q_order',
        label: getSupportText('quickActionOrderTracking', 'en'),
        labelHi: getSupportText('quickActionOrderTracking', 'hi'),
        actionType: 'NAVIGATE_ORDERS',
      },
    ],
  });

  // Initialize welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([getWelcomeMessageObject(supportLanguage)]);

      if (initialPrompt) {
        handleSendMessage(initialPrompt);
      }
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load user tickets when tab switches to tickets
  useEffect(() => {
    if (activeTab === 'tickets') {
      setLoadingTickets(true);
      fetchSupportTickets({ userId: userContext?.userId || 'farmer_01' })
        .then(setUserTickets)
        .finally(() => setLoadingTickets(false));
    }
  }, [activeTab]);

  // Language switch handler
  const handleLanguageChange = (newLang: SupportLanguage) => {
    if (newLang === supportLanguage) return;

    setSupportLanguage(newLang);
    try {
      localStorage.setItem('kisansetu_support_lang', newLang);
    } catch {
      // ignore
    }

    // If conversation only contains welcome message, replace it seamlessly
    if (messages.length <= 1 && (!messages[0] || messages[0].sender === 'ai')) {
      setMessages([getWelcomeMessageObject(newLang)]);
    } else {
      // Append a subtle language switched note
      const langNames: Record<SupportLanguage, string> = {
        hi: 'हिंदी',
        en: 'English',
        pa: 'ਪੰਜਾਬੀ',
        hr: 'हरियाणवी',
        te: 'తెలుగు',
        ta: 'தமிழ்',
      };
      const switchNotice: SupportMessage = {
        id: `sys_lang_${Date.now()}`,
        sender: 'system',
        text: `🌐 सहायता भाषा बदलकर "${langNames[newLang]}" कर दी गई है। AI will now respond in ${langNames[newLang]}.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, switchNotice]);
    }
  };

  const getSpeechLangCode = (lang: SupportLanguage) => {
    switch (lang) {
      case 'hi':
      case 'hr':
        return 'hi-IN';
      case 'pa':
        return 'pa-IN';
      case 'te':
        return 'te-IN';
      case 'ta':
        return 'ta-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`•]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = getSpeechLangCode(supportLanguage);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Speech recognition helper
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(getSupportText('speechNotSupported', supportLanguage));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLangCode(supportLanguage);
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Send message to AI Support
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: SupportMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      senderName: userContext?.userName || (isHi ? 'आप' : 'You'),
      text: query,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      let token = userContext?.token;
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('kisansetu_auth_token') || localStorage.getItem('token') || undefined;
      }

      const chatContext: SupportChatContext = {
        userId: userContext?.userId,
        userName: userContext?.userName,
        userRole: userContext?.userRole,
        userPhone: userContext?.userPhone,
        userEmail: userContext?.userEmail,
        activeLanguage: supportLanguage,
        selectedLanguage: supportLanguage,
        isManualSelection: true,
        token,
      };

      const res = await sendSupportChatMessage(query, newHistory, chatContext);

      const aiMsg: SupportMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        senderName: 'KisanSetu AI',
        text: res.replyText,
        timestamp: new Date().toISOString(),
        suggestedActions: res.suggestedActions,
        needsResolutionConfirmation: res.needsResolutionConfirmation,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (res.createdTicketId) {
        setActiveTicketId(res.createdTicketId);
      }

      if (res.needsResolutionConfirmation) {
        setResolvedPromptState({ show: true, ticketId: res.createdTicketId, submitted: false });
      }

      if (autoVoiceReply || isListening) {
        speakText(res.replyText);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: getSupportText('serverErrorFallback', supportLanguage),
          timestamp: new Date().toISOString(),
          suggestedActions: [
            {
              id: 'err_act',
              label: getSupportText('createTicketAction', 'en'),
              labelHi: getSupportText('createTicketAction', 'hi'),
              actionType: 'CREATE_TICKET',
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resolution Feedback (Yes / No)
  const handleResolutionConfirmation = async (resolved: 'yes' | 'no') => {
    if (resolved === 'yes') {
      const confirmMsg: SupportMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: isHi ? 'हाँ, समस्या हल हो गई।' : 'Yes, my problem is solved.',
        timestamp: new Date().toISOString(),
      };

      const thanksMsg: SupportMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: getSupportText('resolutionThankYou', supportLanguage),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, confirmMsg, thanksMsg]);
      setResolvedPromptState((prev) => ({ ...prev, show: false, submitted: true }));

      if (resolvedPromptState.ticketId) {
        await submitTicketFeedback(resolvedPromptState.ticketId, {
          resolved: 'yes',
          rating: 5,
        });
      }
    } else {
      const notSolvedMsg: SupportMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: isHi ? 'नहीं, अभी भी समस्या आ रही है।' : 'No, still having problem.',
        timestamp: new Date().toISOString(),
      };

      // Escalate to human support ticket
      const ticketRes = await createSupportTicket({
        userId: userContext?.userId || 'guest_user',
        userName: userContext?.userName || (isHi ? 'किसानसेतु उपयोगकर्ता' : 'KisanSetu User'),
        userRole: userContext?.userRole || 'farmer',
        channel: 'WEB_CHAT',
        category: 'GENERAL',
        language: isHi ? 'hi-IN' : 'en-IN',
        subject: isHi
          ? 'वरिष्ठ सहायता: समस्या का समाधान नहीं हुआ'
          : 'Escalation: Issue not resolved by automated troubleshooting',
        description: messages.map((m) => `${m.sender}: ${m.text}`).join('\n'),
        priority: 'HIGH',
        status: 'ESCALATED',
        initialMessage: messages[messages.length - 1]?.text || 'Troubleshooting incomplete',
      });

      const ticketId = ticketRes.ticket?.ticketId || 'KIS-SUP-8921';
      setActiveTicketId(ticketId);

      const escalateNoticeFn = SUPPORT_I18N[supportLanguage].escalationNotice;
      const escalateMsg: SupportMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: escalateNoticeFn(ticketId),
        timestamp: new Date().toISOString(),
        suggestedActions: [
          {
            id: 'act_call_help',
            label: `Call Helpline: ${config.phoneNumber}`,
            labelHi: `हेल्पलाइन पर बात करें: ${config.phoneNumber}`,
            actionType: 'CALL_HELPLINE',
          },
        ],
      };

      setMessages((prev) => [...prev, notSolvedMsg, escalateMsg]);
      setResolvedPromptState((prev) => ({ ...prev, show: false }));
    }
  };

  // Handle Quick Action Trigger
  const handleTriggerAction = (action: SupportAction) => {
    if (action.actionType === 'CALL_HELPLINE') {
      setActiveTab('phone');
      return;
    }
    if (action.actionType === 'SEND_EMAIL') {
      setActiveTab('email');
      return;
    }
    if (action.actionType === 'CREATE_TICKET') {
      createSupportTicket({
        userId: userContext?.userId || 'guest_user',
        userName: userContext?.userName || (isHi ? 'किसानसेतु उपयोगकर्ता' : 'KisanSetu User'),
        userRole: userContext?.userRole || 'farmer',
        channel: 'WEB_CHAT',
        category: (action.payload?.category as any) || 'GENERAL',
        language: isHi ? 'hi-IN' : 'en-IN',
        subject: `Support Request: ${(action.payload?.subject as string) || (isHi ? 'उपयोगकर्ता द्वारा अनुरोधित टिकट' : 'User requested ticket creation')}`,
        description: messages.map((m) => `${m.sender}: ${m.text}`).join('\n'),
        priority: (action.payload?.priority as any) || 'MEDIUM',
        status: 'OPEN',
      }).then((res) => {
        if (res.ticket) {
          setActiveTicketId(res.ticket.ticketId);
          const sysMsgFn = SUPPORT_I18N[supportLanguage].ticketCreatedSystemMsg;
          setMessages((prev) => [
            ...prev,
            {
              id: `sys_${Date.now()}`,
              sender: 'system',
              text: sysMsgFn(res.ticket!.ticketId),
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      });
      return;
    }

    if (onNavigateAction) {
      onNavigateAction(action.actionType, action.payload);
      onClose();
    }
  };

  // Submit Satisfaction Stars
  const handleRatingSubmit = async (rating: number) => {
    if (resolvedPromptState.ticketId) {
      await submitTicketFeedback(resolvedPromptState.ticketId, {
        rating,
        resolved: 'yes',
      });
    }
    setResolvedPromptState((prev) => ({ ...prev, rating }));
  };

  const handleExecuteVoiceCall = async () => {
    if (!phoneCallState.transcript) return;
    try {
      const res = await processHelplineVoiceCall({
        callerName: phoneCallState.callerName,
        callerPhone: phoneCallState.callerPhone,
        speechTranscript: phoneCallState.transcript,
        language: isHi ? 'hi' : 'en',
      });

      setPhoneCallState((prev) => ({
        ...prev,
        reply: res.spokenReply || '',
        ticketCreated: res.ticketId,
      }));

      if (res.spokenReply) {
        speakText(res.spokenReply);
      }
    } catch {
      setPhoneCallState((prev) => ({
        ...prev,
        reply: isHi
          ? 'नमस्ते, आपकी कॉल सहायता टीम को ट्रांसफर कर दी गई है।'
          : 'Hello, your call has been routed to our senior advisory team.',
      }));
    }
  };

  // Handle Email Submission
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailFormState.body || !emailFormState.fromEmail) return;

    setEmailFormState((prev) => ({ ...prev, isSending: true }));
    try {
      const res = await processEmailSupport({
        fromEmail: emailFormState.fromEmail,
        fromName: emailFormState.fromName,
        subject: emailFormState.subject || 'Support Request',
        body: emailFormState.body,
      });

      if (res.success && res.ticketId) {
        setEmailFormState((prev) => ({
          ...prev,
          isSending: false,
          result: {
            ticketId: res.ticketId!,
            replySubject: res.replySubject || '',
            replyBody: res.replyBody || '',
          },
        }));
      }
    } catch {
      setEmailFormState((prev) => ({ ...prev, isSending: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FBFAF4] rounded-3xl border border-[#DFD7C4] shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[820px] text-left">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-5 py-3.5 bg-[#245C3A] text-white flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-xl shadow-xs shrink-0">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {getSupportText('headerTitle', supportLanguage)}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#5F8F45] text-white text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                  {getSupportText('headerBadge', supportLanguage)}
                </span>
              </div>
              <p className="text-xs text-[#D5E3CE] line-clamp-1">
                {getSupportText('headerSubtitle', supportLanguage)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector in Header */}
            <div className="flex items-center gap-1 bg-[#174427] p-1 rounded-xl border border-white/20">
              <select
                id="support-language-select"
                value={supportLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as SupportLanguage)}
                className="bg-transparent text-white font-bold text-xs py-1 px-1.5 rounded-lg cursor-pointer focus:outline-hidden focus:bg-[#245C3A]"
                aria-label="Select Support Language"
              >
                <option value="hi" className="text-[#26332B] bg-white">🇮🇳 हिंदी</option>
                <option value="en" className="text-[#26332B] bg-white">🇬🇧 English</option>
                <option value="pa" className="text-[#26332B] bg-white">🇮🇳 ਪੰਜਾਬੀ</option>
                <option value="hr" className="text-[#26332B] bg-white">🇮🇳 हरियाणवी</option>
                <option value="te" className="text-[#26332B] bg-white">🇮🇳 తెలుగు</option>
                <option value="ta" className="text-[#26332B] bg-white">🇮🇳 தமிழ்</option>
              </select>
            </div>

            {/* Audio speaker toggle */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                  setAutoVoiceReply(false);
                } else {
                  setAutoVoiceReply(!autoVoiceReply);
                }
              }}
              title={
                autoVoiceReply
                  ? getSupportText('voiceReplyEnabled', supportLanguage)
                  : getSupportText('voiceReplyDisabled', supportLanguage)
              }
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                autoVoiceReply ? 'bg-[#D6A63A] text-[#26332B]' : 'bg-[#1C4B2E] text-white/80 hover:bg-[#153B23]'
              }`}
            >
              {autoVoiceReply ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              title={getSupportText('closeAssistant', supportLanguage)}
              className="p-2 rounded-xl bg-[#1C4B2E] hover:bg-[#153B23] text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center border-b border-[#ECE6D8] bg-[#F7F5EC] px-4 py-2 gap-1 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#245C3A] text-white shadow-xs'
                : 'text-[#68736B] hover:text-[#26332B] hover:bg-[#EBE7DC]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{getSupportText('tabAiChat', supportLanguage)}</span>
          </button>

          <button
            onClick={() => setActiveTab('phone')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'phone'
                ? 'bg-[#245C3A] text-white shadow-xs'
                : 'text-[#68736B] hover:text-[#26332B] hover:bg-[#EBE7DC]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>{getSupportText('tabPhone', supportLanguage)}</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'email'
                ? 'bg-[#245C3A] text-white shadow-xs'
                : 'text-[#68736B] hover:text-[#26332B] hover:bg-[#EBE7DC]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{getSupportText('tabEmail', supportLanguage)}</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'bg-[#245C3A] text-white shadow-xs'
                : 'text-[#68736B] hover:text-[#26332B] hover:bg-[#EBE7DC]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{getSupportText('tabTickets', supportLanguage)}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: AI CHAT ASSISTANT */}
        {/* ========================================================= */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Active Escalated Ticket Banner if exists */}
            {activeTicketId && (
              <div className="px-4 py-2 bg-[#FFF8F3] border-b border-[#F0D5C3] flex items-center justify-between text-xs text-[#B86F4B]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#B86F4B] shrink-0" />
                  <span>
                    <strong>{getSupportText('activeTicketBanner', supportLanguage)}</strong> {activeTicketId} (
                    {getSupportText('escalatedToSeniorDesk', supportLanguage)})
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="font-bold underline text-[#245C3A] hover:text-[#1A472C] cursor-pointer"
                >
                  {getSupportText('viewTicketDetails', supportLanguage)}
                </button>
              </div>
            )}

            {/* Conversation Messages Container */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-[#FBFAF4] via-[#FAF7F0] to-[#F5F2E8]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#245C3A] text-white rounded-tr-xs'
                        : msg.sender === 'system'
                        ? 'bg-[#EEF3E8] border border-[#D5E3CE] text-[#245C3A] rounded-2xl w-full text-center font-medium'
                        : 'bg-white text-[#26332B] border border-[#E7E0D0] rounded-tl-xs'
                    }`}
                  >
                    {/* Sender Identity Tag */}
                    {msg.sender === 'ai' && (
                      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#ECE6D8]">
                        <span className="text-xs font-bold text-[#245C3A] flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-[#D6A63A]" />
                          KisanSetu AI
                        </span>
                        <button
                          onClick={() => speakText(msg.text)}
                          title={getSupportText('readOutAudio', supportLanguage)}
                          className="text-[#68736B] hover:text-[#245C3A] p-0.5 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <p className="whitespace-pre-line font-medium">{msg.text}</p>

                    {/* Action Buttons suggested by AI */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#ECE6D8] flex flex-wrap gap-2">
                        {msg.suggestedActions.map((act) => (
                          <button
                            key={act.id}
                            onClick={() => handleTriggerAction(act)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF3E8] hover:bg-[#DCEAD5] text-[#245C3A] font-bold text-xs border border-[#D5E3CE] transition-all cursor-pointer hover:shadow-xs"
                          >
                            <span>{isHi ? act.labelHi || act.label : act.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#D6A63A]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#8C968F] mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#68736B] bg-white px-4 py-2.5 rounded-2xl border border-[#E7E0D0] w-max animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#D6A63A] animate-spin" />
                  <span>{getSupportText('aiAnalyzing', supportLanguage)}</span>
                </div>
              )}

              {/* Resolution Confirmation Prompt Box */}
              {resolvedPromptState.show && !resolvedPromptState.submitted && (
                <div className="p-4 rounded-2xl bg-white border-2 border-[#245C3A]/30 shadow-md space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#26332B]">
                    <CheckCircle2 className="w-5 h-5 text-[#5F8F45]" />
                    <span>{getSupportText('wasProblemSolved', supportLanguage)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleResolutionConfirmation('yes')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#245C3A] text-white font-bold text-xs hover:bg-[#1A472C] transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-4 h-4 text-[#D6A63A]" />
                      <span>{getSupportText('yesProblemSolved', supportLanguage)}</span>
                    </button>
                    <button
                      onClick={() => handleResolutionConfirmation('no')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF8F3] text-[#B86F4B] border border-[#F0D5C3] font-bold text-xs hover:bg-[#FFEEDF] transition-colors cursor-pointer"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{getSupportText('noProblemStillHaving', supportLanguage)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* User Satisfaction Rating Module */}
              {resolvedPromptState.submitted && (
                <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#D5E3CE] text-center space-y-2 animate-in fade-in">
                  <p className="text-xs font-bold text-[#245C3A]">
                    {getSupportText('ratingQuestion', supportLanguage)}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingSubmit(star)}
                        className={`p-1.5 rounded-lg transition-transform hover:scale-125 cursor-pointer ${
                          (resolvedPromptState.rating || 0) >= star ? 'text-[#D6A63A]' : 'text-[#A0ABA3]'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  {resolvedPromptState.rating && (
                    <span className="text-[11px] font-semibold text-[#5F8F45]">
                      {getSupportText('ratingSubmitted', supportLanguage)}
                    </span>
                  )}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Confidential Security Reminder */}
            <div className="px-4 py-1.5 bg-[#FAF7F0] border-t border-[#ECE6D8] flex items-center justify-between text-[11px] text-[#68736B]">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#5F8F45]" />
                {getSupportText('securityNotice', supportLanguage)}
              </span>
              <span className="font-semibold text-[#245C3A]">
                {getSupportText('tollFreeHelpline', supportLanguage)}: {config.phoneNumber}
              </span>
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#ECE6D8] flex items-center gap-2">
              <button
                onClick={toggleSpeechRecognition}
                title={
                  isListening
                    ? getSupportText('listeningActive', supportLanguage)
                    : getSupportText('clickToSpeak', supportLanguage)
                }
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#EEF3E8] text-[#245C3A] hover:bg-[#DCEAD5]'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={getSupportText('inputPlaceholder', supportLanguage)}
                className="flex-1 px-4 py-3 bg-[#FBFAF4] rounded-2xl border border-[#DFD7C4] text-sm text-[#26332B] placeholder-[#8C968F] focus:outline-hidden focus:ring-2 focus:ring-[#245C3A]"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                title={getSupportText('sendMessage', supportLanguage)}
                className="p-3 rounded-2xl bg-[#245C3A] hover:bg-[#1A472C] disabled:bg-[#A0ABA3] text-white shadow-md transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: HELPLINE & TELEPHONE SUPPORT */}
        {/* ========================================================= */}
        {activeTab === 'phone' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-[#FBFAF4] to-[#FAF7F0] text-left">
            <div className="p-5 rounded-3xl bg-white border border-[#DFD7C4] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] border border-[#D5E3CE]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#26332B]">{getSupportText('helplineTitle', supportLanguage)}</h4>
                  <p className="text-xs text-[#5F8F45] font-semibold">{getSupportText('helplineBadge', supportLanguage)}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#D5E3CE] text-center space-y-2">
                <span className="text-xs text-[#68736B] uppercase font-bold tracking-wider">
                  {getSupportText('tollFreeDirectDial', supportLanguage)}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#245C3A] tracking-tight">{config.phoneNumber}</div>
                <p className="text-xs text-[#56655A]">{getSupportText('helplineHours', supportLanguage)}</p>
                <div className="pt-1">
                  <a
                    href={`tel:${config.rawPhoneNumber || config.phoneNumber.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1A472C] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{supportLanguage === 'hi' ? 'अभी कॉल करें' : 'Call Helpline'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Telephony & Voice Call Simulator */}
            <div className="p-5 rounded-3xl bg-white border border-[#DFD7C4] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-[#26332B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D6A63A]" />
                  <span>{getSupportText('simulatorTitle', supportLanguage)}</span>
                </h5>
                <span className="px-2 py-0.5 rounded-full bg-[#EEF3E8] text-[#245C3A] text-[10px] font-bold">
                  {getSupportText('simulatorBadge', supportLanguage)}
                </span>
              </div>

              <p className="text-xs text-[#68736B]">{getSupportText('simulatorDesc', supportLanguage)}</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#26332B] mb-1">
                    {getSupportText('callerQueryLabel', supportLanguage)}
                  </label>
                  <textarea
                    rows={2}
                    value={phoneCallState.transcript}
                    onChange={(e) => setPhoneCallState({ ...phoneCallState, transcript: e.target.value })}
                    placeholder={getSupportText('callerQueryPlaceholder', supportLanguage)}
                    className="w-full p-3 rounded-xl bg-[#FBFAF4] border border-[#DFD7C4] text-xs text-[#26332B] focus:outline-hidden focus:ring-2 focus:ring-[#245C3A]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExecuteVoiceCall}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1A472C] text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{getSupportText('runVoiceEngine', supportLanguage)}</span>
                  </button>

                  <button
                    onClick={() => {
                      setPhoneCallState({
                        ...phoneCallState,
                        transcript: isHi
                          ? 'मेरी पेमेंट अभी तक बैंक खाते में नहीं आई।'
                          : 'My payment for wheat order has not updated in my bank.',
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#DFD7C4] text-[#26332B] text-xs font-semibold hover:bg-[#EEF3E8] cursor-pointer"
                  >
                    {getSupportText('samplePaymentQuery', supportLanguage)}
                  </button>

                  <button
                    onClick={() => {
                      setPhoneCallState({
                        ...phoneCallState,
                        transcript: isHi
                          ? 'गेहूं का आज का मंडी भाव क्या है?'
                          : 'What is today official mandi rate for Wheat?',
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#DFD7C4] text-[#26332B] text-xs font-semibold hover:bg-[#EEF3E8] cursor-pointer"
                  >
                    {getSupportText('sampleMandiQuery', supportLanguage)}
                  </button>
                </div>

                {phoneCallState.reply && (
                  <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#D5E3CE] space-y-2 mt-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-[#245C3A]">
                      <span>{getSupportText('helplineSpokenResponse', supportLanguage)}</span>
                      <button
                        onClick={() => speakText(phoneCallState.reply)}
                        className="flex items-center gap-1 text-[#245C3A] hover:underline cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{getSupportText('playAudio', supportLanguage)}</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#26332B] font-medium leading-relaxed">
                      "{phoneCallState.reply}"
                    </p>
                    {phoneCallState.ticketCreated && (
                      <div className="pt-2 border-t border-[#D5E3CE] flex items-center justify-between text-[11px] text-[#5F8F45] font-bold">
                        <span>{getSupportText('ticketGenerated', supportLanguage)} {phoneCallState.ticketCreated}</span>
                        <span className="text-[#68736B]">Channel: PHONE</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: EMAIL SUPPORT */}
        {/* ========================================================= */}
        {activeTab === 'email' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-[#FBFAF4] to-[#FAF7F0] text-left">
            <div className="p-5 rounded-3xl bg-white border border-[#DFD7C4] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] border border-[#D5E3CE]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#26332B]">{getSupportText('emailTitle', supportLanguage)}</h4>
                  <p className="text-xs text-[#5F8F45] font-semibold">{config.email}</p>
                </div>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#26332B] mb-1">
                      {getSupportText('yourEmailLabel', supportLanguage)}
                    </label>
                    <input
                      type="email"
                      required
                      value={emailFormState.fromEmail}
                      onChange={(e) => setEmailFormState({ ...emailFormState, fromEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#FBFAF4] border border-[#DFD7C4] text-[#26332B] focus:outline-hidden focus:ring-2 focus:ring-[#245C3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#26332B] mb-1">
                      {getSupportText('subjectLabel', supportLanguage)}
                    </label>
                    <input
                      type="text"
                      placeholder={getSupportText('subjectPlaceholder', supportLanguage)}
                      value={emailFormState.subject}
                      onChange={(e) => setEmailFormState({ ...emailFormState, subject: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#FBFAF4] border border-[#DFD7C4] text-[#26332B] focus:outline-hidden focus:ring-2 focus:ring-[#245C3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#26332B] mb-1">
                    {getSupportText('messageBodyLabel', supportLanguage)}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={emailFormState.body}
                    onChange={(e) => setEmailFormState({ ...emailFormState, body: e.target.value })}
                    placeholder={getSupportText('messageBodyPlaceholder', supportLanguage)}
                    className="w-full p-3 rounded-xl bg-[#FBFAF4] border border-[#DFD7C4] text-[#26332B] focus:outline-hidden focus:ring-2 focus:ring-[#245C3A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={emailFormState.isSending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1A472C] text-white font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {emailFormState.isSending
                      ? getSupportText('sendingEmailBtn', supportLanguage)
                      : getSupportText('sendEmailBtn', supportLanguage)}
                  </span>
                </button>
              </form>

              {emailFormState.result && (
                <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#D5E3CE] space-y-2 mt-4 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-[#245C3A] text-xs">
                    <span>{getSupportText('emailTicketLogged', supportLanguage)} [{emailFormState.result.ticketId}]</span>
                    <span>{getSupportText('autoProcessedBadge', supportLanguage)}</span>
                  </div>
                  <div className="text-xs text-[#26332B] font-medium bg-white p-3 rounded-xl border border-[#DFD7C4] whitespace-pre-line">
                    {emailFormState.result.replyBody}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MY TICKETS */}
        {/* ========================================================= */}
        {activeTab === 'tickets' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-[#FBFAF4] to-[#FAF7F0] text-left">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-extrabold text-base text-[#26332B]">
                  {getSupportText('myTicketsTitle', supportLanguage)}
                </h4>
                <p className="text-xs text-[#68736B]">
                  {getSupportText('myTicketsSubtitle', supportLanguage)}
                </p>
              </div>
              <button
                onClick={() => {
                  setLoadingTickets(true);
                  fetchSupportTickets({ userId: userContext?.userId || 'farmer_01' })
                    .then(setUserTickets)
                    .finally(() => setLoadingTickets(false));
                }}
                title={getSupportText('refreshTickets', supportLanguage)}
                className="p-2 rounded-xl bg-white border border-[#DFD7C4] text-[#245C3A] hover:bg-[#EEF3E8] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingTickets ? (
              <div className="py-12 text-center text-xs text-[#68736B] space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#245C3A]" />
                <span>{getSupportText('loadingTickets', supportLanguage)}</span>
              </div>
            ) : userTickets.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#68736B] bg-white rounded-3xl border border-[#DFD7C4] p-6 space-y-2">
                <HelpCircle className="w-8 h-8 text-[#A0ABA3] mx-auto" />
                <p className="font-semibold text-sm text-[#26332B]">{getSupportText('noTicketsFound', supportLanguage)}</p>
                <p>{getSupportText('noTicketsDesc', supportLanguage)}</p>
              </div>
            ) : (
              userTickets.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFD7C4] shadow-xs space-y-3 hover:border-[#245C3A]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-[#245C3A] bg-[#EEF3E8] px-2.5 py-0.5 rounded-lg border border-[#D5E3CE]">
                          {ticket.ticketId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'RESOLVED'
                              ? 'bg-[#E8F5E9] text-[#2E7D32]'
                              : ticket.status === 'ESCALATED'
                              ? 'bg-[#FFF3E0] text-[#E65100]'
                              : ticket.status === 'IN_REVIEW'
                              ? 'bg-[#E1F5FE] text-[#0277BD]'
                              : 'bg-[#F5F5F5] text-[#616161]'
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8C968F] uppercase">
                          {ticket.channel}
                        </span>
                        {ticket.language && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#DFD7C4] text-[#245C3A]">
                            {ticket.language.startsWith('hi') ? '🇮🇳 हिंदी' : ticket.language === 'hinglish' ? 'Hinglish' : '🇬🇧 English'}
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-sm text-[#26332B] mt-1.5">{ticket.subject}</h5>
                    </div>

                    <span className="text-[10px] text-[#8C968F] shrink-0">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#68736B] line-clamp-2 leading-relaxed">
                    {ticket.description || ticket.conversationSummary}
                  </p>

                  {ticket.resolution && (
                    <div className="p-3 rounded-xl bg-[#EEF3E8] border border-[#D5E3CE] text-xs text-[#245C3A] space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5F8F45]" />
                        {getSupportText('resolutionNote', supportLanguage)}
                      </span>
                      <p className="text-[#26332B]">{ticket.resolution.text}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#ECE6D8] text-[#8C968F]">
                    <span>{getSupportText('assignedTo', supportLanguage)} <strong className="text-[#26332B]">{ticket.assignedTo}</strong></span>
                    <span>{getSupportText('category', supportLanguage)} <strong>{ticket.category}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
