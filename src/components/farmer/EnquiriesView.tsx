import React, { useState } from 'react';
import {
  MessageSquareText,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Clock,
  MapPin,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { BuyerEnquiry } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';

interface EnquiriesViewProps {
  enquiries: BuyerEnquiry[];
  onAcceptEnquiry: (id: string) => void;
  onDeclineEnquiry: (id: string) => void;
  onCounterOffer: (id: string, counterPrice: number) => void;
  currentLanguage: LanguageCode;
}

export const EnquiriesView: React.FC<EnquiriesViewProps> = ({
  enquiries,
  onAcceptEnquiry,
  onDeclineEnquiry,
  onCounterOffer,
  currentLanguage,
}) => {
  const [selectedEnquiryForCounter, setSelectedEnquiryForCounter] = useState<BuyerEnquiry | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');

  const t = getFarmerTranslations(currentLanguage);
  const eT = t.enquiriesView;

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEnquiryForCounter) {
      const price = parseFloat(counterPriceInput);
      if (price > 0) {
        onCounterOffer(selectedEnquiryForCounter.id, price);
        setSelectedEnquiryForCounter(null);
        setCounterPriceInput('');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B]">
              {eT.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
            {eT.subtitle}
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-bold self-start sm:self-auto">
          {enquiries.length} {t.nav.enquiries}
        </span>
      </div>

      {/* Enquiries Grid */}
      {enquiries.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-[#EEF3E8] text-center">
          <MessageSquareText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#26332B]">{eT.noEnquiriesFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#26332B]">{enq.buyerName}</h3>
                    <p className="text-xs text-[#68736B]">
                      {t.home.cropCard.verifiedLot}: <b>{enq.crop}</b>
                    </p>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      enq.status === 'New'
                        ? 'bg-blue-100 text-blue-800'
                        : enq.status === 'Accepted'
                        ? 'bg-green-100 text-green-800'
                        : enq.status === 'Countered'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] mb-3 text-xs text-[#26332B]">
                  <p className="italic font-medium">"{enq.message}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#68736B] mb-4">
                  <div>
                    <span>{eT.offeredRate}: </span>
                    <b className="text-base text-[#245C3A] font-bold">₹{enq.offeredPricePerKg}/kg</b>
                  </div>
                  <div className="text-right">
                    <span>{eT.quantity}: </span>
                    <b className="text-[#26332B]">{enq.requestedQuantityKg.toLocaleString('en-IN')} kg</b>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#EEF3E8]">
                <button
                  onClick={() => onAcceptEnquiry(enq.id)}
                  disabled={enq.status === 'Accepted'}
                  className="flex-1 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {eT.acceptBidBtn}
                </button>

                <button
                  onClick={() => setSelectedEnquiryForCounter(enq)}
                  className="px-3 py-2 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#26332B] text-xs font-bold transition-colors cursor-pointer"
                >
                  {eT.counterRateBtn}
                </button>

                <button
                  onClick={() => onDeclineEnquiry(enq.id)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter Offer Modal */}
      {selectedEnquiryForCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EEF3E8]">
            <h3 className="font-bold text-base text-[#26332B] mb-2">{eT.counterRateBtn}</h3>
            <p className="text-xs text-[#68736B] mb-4">
              Buyer proposed ₹{selectedEnquiryForCounter.offeredPrice}/kg. What is your counter rate?
            </p>

            <form onSubmit={handleCounterSubmit} className="space-y-3">
              <input
                type="number"
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(e.target.value)}
                placeholder="e.g. 30"
                required
                className="w-full p-2.5 bg-[#FBFAF4] text-sm text-[#26332B] rounded-xl border border-[#EEF3E8] font-bold"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold cursor-pointer"
                >
                  {eT.submitCounterBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiryForCounter(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#FBFAF4] text-[#26332B] text-xs font-bold cursor-pointer"
                >
                  {t.common.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
