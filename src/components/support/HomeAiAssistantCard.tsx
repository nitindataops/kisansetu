import React from 'react';
import { Sparkles, MessageSquare, AlertCircle, Phone, Bot, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../../types';

interface HomeAiAssistantCardProps {
  currentLanguage: LanguageCode;
  onOpenAiAssistant: (initialPrompt?: string) => void;
  onReportProblem: () => void;
  onContactSupport: () => void;
}

export const HomeAiAssistantCard: React.FC<HomeAiAssistantCardProps> = ({
  currentLanguage,
  onOpenAiAssistant,
  onReportProblem,
  onContactSupport,
}) => {
  const isHi = currentLanguage === 'hi';

  const quickPrompts = isHi
    ? [
        { label: 'मेरी फसल लिस्टिंग जांचें', prompt: 'मेरी फसल मार्केटप्लेस में दिख रही है या नहीं जांचें।' },
        { label: 'मंडी भाव व तेजी-मंदी', prompt: 'धान और गेहूं के नवीनतम आधिकारिक मंडी भाव क्या हैं?' },
        { label: 'पेमेंट व एस्क्रो सुरक्षा', prompt: 'किसानसेतु पर फसल पेमेंट कब और कैसे मिलती है?' },
        { label: 'फसल फोटो ग्रेडिंग सहायता', prompt: 'मेरी फसल फोटो ग्रेडिंग कैसे होती है?' },
      ]
    : [
        { label: 'Check My Crop Listing', prompt: 'Check if my crop listing is active and visible in the marketplace.' },
        { label: 'Live Mandi Rates', prompt: 'What are the latest official AGMARKNET mandi rates for Rice and Wheat?' },
        { label: 'Payment & Escrow Safety', prompt: 'How does KisanSetu escrow payment protection work?' },
        { label: 'AI Crop Grading Help', prompt: 'How can I get Grade A verified for my harvest?' },
      ];

  return (
    <section 
      id="home-ai-support-banner"
      aria-label="KisanSetu AI Assistant Banner"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-12 relative z-30"
    >
      <div 
        tabIndex={0}
        aria-label="KisanSetu AI Assistant Section"
        className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-[#245C3A]/20 shadow-xl p-6 sm:p-8 relative overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-[#245C3A]"
      >
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#EEF3E8]/60 to-transparent pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: AI Branding & Greeting */}
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3E8] text-[#245C3A] text-xs font-bold border border-[#D5E3CE]">
              <Bot className="w-4 h-4 text-[#245C3A]" />
              <span>🤖 KisanSetu AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-[#5F8F45] animate-ping" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26332B] tracking-tight">
              {isHi ? 'नमस्ते! आज हम आपकी कैसे सहायता कर सकते हैं?' : 'Namaste! How can we help you today?'}
            </h2>

            <p className="text-sm sm:text-base text-[#68736B]">
              {isHi
                ? 'फसल लिस्टिंग, आधिकारिक मंडी भाव, पेमेंट स्थिति, फोटो ग्रेडिंग या किसी भी समस्या के त्वरित समाधान हेतु रियल AI सहायता उपलब्ध है।'
                : 'Instant real-time support for crop listings, official mandi rates, payment status, photo grading, or direct helpline escalation.'}
            </p>
          </div>

          {/* Right: Primary Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              id="home-ask-ai-btn"
              onClick={() => onOpenAiAssistant()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-[#245C3A] hover:bg-[#1A472C] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Bot className="w-5 h-5 text-[#D6A63A]" />
              <span>{isHi ? 'AI सहायक से पूछें' : 'Ask AI Assistant'}</span>
            </button>

            <button
              id="home-report-problem-btn"
              onClick={onReportProblem}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-[#B86F4B] bg-[#FFF8F3] hover:bg-[#FFEEDF] border border-[#F0D5C3] transition-colors cursor-pointer"
            >
              <AlertCircle className="w-4.5 h-4.5" />
              <span>{isHi ? 'समस्या रिपोर्ट करें' : 'Report a Problem'}</span>
            </button>

            <button
              id="home-contact-support-btn"
              onClick={onContactSupport}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-[#245C3A] bg-[#EEF3E8] hover:bg-[#DFECD7] border border-[#D5E3CE] transition-colors cursor-pointer"
            >
              <Phone className="w-4.5 h-4.5" />
              <span>{isHi ? 'हेल्पलाइन संपर्क' : 'Contact Support'}</span>
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Prompts */}
        <div className="mt-6 pt-4 border-t border-[#ECE6D8] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#68736B] font-semibold mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A63A]" />
            {isHi ? 'त्वरित प्रश्न:' : 'Quick Questions:'}
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onOpenAiAssistant(p.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBFAF4] hover:bg-[#EEF3E8] text-[#26332B] hover:text-[#245C3A] border border-[#DFD7C4] transition-colors cursor-pointer"
            >
              <span>{p.label}</span>
              <ArrowRight className="w-3 h-3 text-[#68736B]" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
