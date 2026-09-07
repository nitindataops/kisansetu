import React from 'react';
import { X, Mail, Phone, MapPin, Shield, FileText } from 'lucide-react';
import { OFFICIAL_KISANSETU_HELPLINE_DISPLAY } from '../services/supportApiService';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact' | 'privacy' | 'terms';
  onOpenAiSupport?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  type,
  onOpenAiSupport,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-[#FBFAF4] rounded-3xl border border-[#DFD7C4] shadow-2xl p-6 sm:p-8 space-y-5 text-left max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#68736B] hover:text-[#26332B] hover:bg-[#EEF3E8] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#245C3A]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] border border-[#D5E3CE]">
                <Phone className="w-5 h-5 text-[#245C3A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#26332B]">KisanSetu Kisan Support</h3>
                <span className="text-xs text-[#5F8F45] font-semibold">Toll-Free Direct Agriculture Helpline</span>
              </div>
            </div>
            <p className="text-sm text-[#68736B]">
              Our dedicated agriculture helpline and farmer advisory support is available 6 days a week in regional languages.
            </p>
            <div className="bg-[#EEF3E8] p-4 rounded-2xl space-y-3 text-sm text-[#26332B] border border-[#D5E3CE]">
              <div className="flex items-center gap-3">
                <Phone className="w-4.5 h-4.5 text-[#245C3A] shrink-0" />
                <span className="font-semibold">AI Support Helpline: {OFFICIAL_KISANSETU_HELPLINE_DISPLAY}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-[#D6A63A] shrink-0" />
                <span>support@kisansetu.in / help@kisansetu.in</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5 text-[#B86F4B] shrink-0" />
                <span>KisanSetu Agritech Center, New Delhi / Regional Hubs across 20+ States</span>
              </div>
            </div>

            {onOpenAiSupport && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAiSupport();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#245C3A] hover:bg-[#1A472C] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>🤖</span>
                  <span>Ask KisanSetu AI Support Assistant</span>
                </button>
              </div>
            )}
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#245C3A]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] border border-[#D5E3CE]">
                <Shield className="w-5 h-5 text-[#5F8F45]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#26332B]">Privacy & Farmer Data Policy</h3>
                <span className="text-xs text-[#5F8F45] font-semibold">Zero-Leakage Trust Standard</span>
              </div>
            </div>
            <p className="text-sm text-[#68736B] leading-relaxed">
              At KisanSetu, your farm data, crop listing prices, and transaction records are encrypted and protected. We do not sell farmer personal details to third-party ad networks.
            </p>
            <ul className="text-xs text-[#56655A] space-y-2 list-disc pl-4">
              <li>Direct verification between registered farmers and buyers only.</li>
              <li>Encrypted phone communication and settlement verification.</li>
              <li>Full control to update or delete your crop listings anytime.</li>
            </ul>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#245C3A]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3E8] flex items-center justify-center text-[#245C3A] border border-[#D5E3CE]">
                <FileText className="w-5 h-5 text-[#D6A63A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#26332B]">Terms of Service</h3>
                <span className="text-xs text-[#5F8F45] font-semibold">Fair Agricultural Trade Agreement</span>
              </div>
            </div>
            <p className="text-sm text-[#68736B] leading-relaxed">
              KisanSetu serves as a direct agricultural marketplace facilitator. All crop listings must accurately reflect quality grades, moisture parameters, and quantities.
            </p>
            <ul className="text-xs text-[#56655A] space-y-2 list-disc pl-4">
              <li>Commitment to fair direct pricing and transparent negotiation.</li>
              <li>Verification requirements for bulk buyers and mill processors.</li>
              <li>Adherence to state agricultural trade guidelines and standards.</li>
            </ul>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#245C3A] hover:bg-[#1A472C] transition-colors shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
