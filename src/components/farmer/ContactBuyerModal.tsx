import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Mail,
  ShieldCheck,
  Building,
  MapPin,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { BuyerMatch } from '../../types/farmer';

interface ContactBuyerModalProps {
  buyer: BuyerMatch | null;
  onClose: () => void;
}

export const ContactBuyerModal: React.FC<ContactBuyerModalProps> = ({ buyer, onClose }) => {
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!buyer) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EEF3E8] overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#245C3A] to-[#1A3D27] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm">
              {buyer.logoText}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">{buyer.name}</h3>
              <p className="text-xs text-white/80">Direct Mandi Sourcing Desk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Official contact box */}
          <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#68736B]">Procurement Officer:</span>
              <strong className="text-[#26332B]">{buyer.contactPerson}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#68736B]">Verified Direct Phone:</span>
              <strong className="text-[#245C3A] font-mono">{buyer.contactPhone}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#68736B]">Hub Location:</span>
              <span className="text-[#26332B]">{buyer.location} ({buyer.distanceKm} km)</span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-[#EEF3E8]">
              <span className="text-[#68736B]">Settlement Mode:</span>
              <span className="font-bold text-[#5F8F45]">✓ {buyer.paymentTerms}</span>
            </div>
          </div>

          {/* Direct Call Button */}
          <a
            href={`tel:${buyer.contactPhone}`}
            className="w-full py-3 rounded-2xl bg-[#5F8F45] hover:bg-[#4E7638] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Procurement Lead ({buyer.contactPhone})</span>
          </a>

          {/* Quick Message Form */}
          {sentSuccess ? (
            <div className="p-4 rounded-2xl bg-[#EEF3E8] text-center space-y-1 animate-in fade-in-50">
              <CheckCircle2 className="w-6 h-6 text-[#5F8F45] mx-auto" />
              <h4 className="font-bold text-xs text-[#245C3A]">Message Sent to Desk!</h4>
              <p className="text-[11px] text-[#68736B]">
                The procurement manager will reply to your registered mobile number shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-[#26332B]">
                Send Quick Inquiry or Pickup Request
              </label>
              <textarea
                rows={2}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. We have 2,000 kg Grade A wheat ready for farm gate pickup tomorrow..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FBFAF4] text-xs text-[#26332B] focus:border-[#5F8F45] focus:outline-hidden"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Marketplace Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
