import React, { useState, useEffect } from 'react';
import {
  FileText,
  Bot,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  RefreshCw,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Shield,
} from 'lucide-react';
import { SupportTicket } from '../../types/support';
import {
  fetchSupportTickets,
  submitTicketFeedback,
  fetchSupportConfig,
  SupportConfig,
  OFFICIAL_KISANSETU_HELPLINE_DISPLAY,
} from '../../services/supportApiService';
import { LanguageCode } from '../../types';

interface UserSupportHistoryViewProps {
  userId: string;
  userName: string;
  userRole: 'farmer' | 'buyer';
  currentLanguage: LanguageCode;
  onOpenAiAssistant: (initialPrompt?: string) => void;
}

export const UserSupportHistoryView: React.FC<UserSupportHistoryViewProps> = ({
  userId,
  userName,
  userRole,
  currentLanguage,
  onOpenAiAssistant,
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<SupportConfig>({
    phoneNumber: OFFICIAL_KISANSETU_HELPLINE_DISPLAY,
    email: 'support@kisansetu.in',
    isAiEnabled: true,
    channels: ['WEB_CHAT', 'PHONE', 'EMAIL', 'VOICE'],
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ratingInput, setRatingInput] = useState<{ [ticketId: string]: number }>({});
  const [feedbackText, setFeedbackText] = useState<{ [ticketId: string]: string }>({});

  const isHi = currentLanguage === 'hi';

  const loadData = async () => {
    setLoading(true);
    try {
      const [ticketData, configData] = await Promise.all([
        fetchSupportTickets({ userId }),
        fetchSupportConfig(),
      ]);
      setTickets(ticketData);
      setConfig(configData);
      if (ticketData.length > 0) {
        setSelectedTicket(ticketData[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleRatingSubmit = async (ticketId: string, rating: number) => {
    try {
      await submitTicketFeedback(ticketId, {
        rating,
        resolved: 'yes',
        feedback: feedbackText[ticketId],
      });
      setRatingInput({ ...ratingInput, [ticketId]: rating });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Banner / Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#245C3A] to-[#1C4B2E] text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs">
            <Bot className="w-4 h-4 text-[#D6A63A]" />
            <span>{isHi ? 'किसानसेतु ग्राहक सहायता केंद्र' : 'KisanSetu Customer Support Hub'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isHi ? 'नमस्ते, आपकी क्या सहायता करें?' : 'Support & Resolution Center'}
          </h2>
          <p className="text-sm text-[#D5E3CE]">
            {isHi
              ? 'फसल लिस्टिंग, मंडी भाव, पेमेंट स्थिति या किसी भी सहायता के लिए रियल AI सहायक व विशेषज्ञ टीम २४/७ उपलब्ध है।'
              : 'Real-time AI diagnosis and senior agricultural specialist support for crop listings, mandi rates, payments, and orders.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiAssistant()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#245C3A] hover:bg-[#EEF3E8] font-extrabold text-sm shadow-md transition-all cursor-pointer"
          >
            <Bot className="w-5 h-5 text-[#D6A63A]" />
            <span>{isHi ? 'AI सहायक से बात करें' : 'Open AI Support'}</span>
          </button>
          <button
            onClick={loadData}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Support Contacts Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#DFD7C4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#68736B] uppercase">Toll-Free Helpline</span>
            <div className="text-base font-extrabold text-[#26332B] mt-0.5">{config.phoneNumber}</div>
            <span className="text-[10px] text-[#5F8F45]">Mon-Sat 8:00 AM – 8:00 PM</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DFD7C4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#68736B] uppercase">Email Support Desk</span>
            <div className="text-sm font-extrabold text-[#26332B] mt-0.5">{config.email}</div>
            <span className="text-[10px] text-[#5F8F45]">Auto-classified by AI Engine</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DFD7C4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] shrink-0">
            <Shield className="w-6 h-6 text-[#5F8F45]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#68736B] uppercase">Security Shield</span>
            <div className="text-xs font-bold text-[#26332B] mt-0.5">Escrow Guaranteed</div>
            <span className="text-[10px] text-[#68736B]">Zero sensitive data sharing</span>
          </div>
        </div>
      </div>

      {/* Tickets Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of user tickets */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="font-extrabold text-base text-[#26332B] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#245C3A]" />
            <span>{isHi ? 'आपके सहायता अनुरोध व टिकट' : 'Your Support Inquiries & Tickets'}</span>
          </h4>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#68736B]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#245C3A] mb-2" />
              <span>Loading tickets...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#DFD7C4] text-xs text-[#68736B] space-y-3">
              <Bot className="w-10 h-10 text-[#A0ABA3] mx-auto" />
              <p className="font-bold text-sm text-[#26332B]">No support tickets logged yet.</p>
              <p>Whenever you ask the AI assistant or helpline for assistance, it appears here.</p>
              <button
                onClick={() => onOpenAiAssistant()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#245C3A] text-white font-bold text-xs"
              >
                <span>Ask AI Assistant</span>
              </button>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.ticketId}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTicket?.ticketId === t.ticketId
                    ? 'bg-[#EEF3E8] border-[#245C3A] shadow-xs'
                    : 'bg-white border-[#DFD7C4] hover:border-[#245C3A]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#245C3A]">{t.ticketId}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        t.status === 'RESOLVED'
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : t.status === 'ESCALATED'
                          ? 'bg-[#FFF3E0] text-[#E65100]'
                          : t.status === 'IN_REVIEW'
                          ? 'bg-[#E1F5FE] text-[#0277BD]'
                          : 'bg-[#F5F5F5] text-[#616161]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C968F] uppercase">{t.channel}</span>
                </div>
                <h5 className="font-bold text-xs text-[#26332B] line-clamp-1">{t.subject}</h5>
                <p className="text-[11px] text-[#68736B] line-clamp-2 mt-1">
                  {t.description || t.conversationSummary}
                </p>
                <div className="mt-2 pt-2 border-t border-[#ECE6D8] flex items-center justify-between text-[10px] text-[#8C968F]">
                  <span>Category: <strong>{t.category}</strong></span>
                  <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Ticket Detail */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="p-6 rounded-3xl bg-white border border-[#DFD7C4] shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#ECE6D8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#245C3A] bg-[#EEF3E8] px-3 py-1 rounded-xl border border-[#D5E3CE]">
                      {selectedTicket.ticketId}
                    </span>
                    <span className="text-xs font-bold text-[#68736B]">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#26332B] mt-2">{selectedTicket.subject}</h3>
                </div>

                <div className="text-xs text-[#68736B] text-right">
                  <div>Status: <strong className="text-[#245C3A]">{selectedTicket.status}</strong></div>
                  <div>Assigned: <strong>{selectedTicket.assignedTo}</strong></div>
                </div>
              </div>

              {/* Diagnostic Breakdown */}
              <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#DFD7C4] space-y-2">
                <span className="text-xs font-bold text-[#245C3A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6A63A]" />
                  Diagnostic Snapshot
                </span>
                <p className="text-xs text-[#26332B] leading-relaxed">
                  {selectedTicket.conversationSummary || selectedTicket.description}
                </p>
              </div>

              {/* Messages Thread */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#68736B] uppercase">Conversation Timeline</span>
                <div className="max-h-64 overflow-y-auto space-y-2 p-3 bg-[#FAF7F0] rounded-2xl border border-[#ECE6D8]">
                  {selectedTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        m.sender === 'user'
                          ? 'bg-[#245C3A] text-white ml-auto max-w-[85%]'
                          : m.sender === 'agent'
                          ? 'bg-[#EEF3E8] border border-[#D5E3CE] text-[#245C3A] max-w-[85%]'
                          : 'bg-white border border-[#DFD7C4] text-[#26332B] max-w-[85%]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{m.sender === 'user' ? 'You' : m.sender === 'agent' ? 'Senior Support Desk' : 'KisanSetu AI'}</span>
                        <span className="text-[10px] opacity-75 font-normal">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Note if resolved */}
              {selectedTicket.resolution && (
                <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#D5E3CE] space-y-1">
                  <span className="text-xs font-bold text-[#245C3A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5F8F45]" />
                    Resolution Summary:
                  </span>
                  <p className="text-xs text-[#26332B]">{selectedTicket.resolution.text}</p>
                </div>
              )}

              {/* Satisfaction rating submission */}
              {selectedTicket.status === 'RESOLVED' && !selectedTicket.satisfaction && (
                <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#F0E6C8] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8A6D1C]">
                      {isHi ? 'कृपया सहायता अनुभव को रेट करें:' : 'Please rate this support resolution:'}
                    </span>
                    <div className="flex items-center gap-1 text-[#D6A63A]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingSubmit(selectedTicket.ticketId, star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#DFD7C4] text-xs text-[#68736B]">
              Select a ticket to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
