import React from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Star,
  Building,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { BuyerMatch } from '../../types/farmer';

interface BuyerDetailsModalProps {
  buyer: BuyerMatch | null;
  onClose: () => void;
  onMakeOffer: (buyer: BuyerMatch) => void;
  onContactBuyer: (buyer: BuyerMatch) => void;
}

export const BuyerDetailsModal: React.FC<BuyerDetailsModalProps> = ({
  buyer,
  onClose,
  onMakeOffer,
  onContactBuyer,
}) => {
  if (!buyer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#EEF3E8] overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#245C3A] to-[#1A3D27] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-base text-[#D6A63A] border border-white/20">
              {buyer.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif">{buyer.name}</h3>
                {buyer.verified && <ShieldCheck className="w-4 h-4 text-[#5F8F45]" />}
              </div>
              <p className="text-xs text-white/80">
                Institutional Buyer Profile • Mandi Code #UP-AG-7712
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Rating & Trust Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-center text-xs">
            <div>
              <span className="text-[#68736B] block">Trust Rating</span>
              <div className="text-base font-bold text-[#D6A63A] flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-[#D6A63A]" />
                <span>{buyer.rating} / 5.0</span>
              </div>
            </div>

            <div>
              <span className="text-[#68736B] block">Completed Trades</span>
              <strong className="text-base font-bold text-[#245C3A] block mt-0.5">
                {buyer.completedDeals} Deals
              </strong>
            </div>

            <div>
              <span className="text-[#68736B] block">Distance</span>
              <strong className="text-base font-bold text-[#26332B] block mt-0.5">
                {buyer.distanceKm} km
              </strong>
            </div>
          </div>

          {/* Sourcing Specifications */}
          <div className="p-4 rounded-2xl bg-[#EEF3E8]/50 border border-[#5F8F45]/20 space-y-2 text-xs">
            <h4 className="font-bold text-[#245C3A] uppercase tracking-wider text-[11px]">
              Current Procurement Mandate
            </h4>

            <div className="flex justify-between py-1 border-b border-gray-200/60">
              <span className="text-[#68736B]">Commodity:</span>
              <strong className="text-[#26332B]">
                {buyer.requiredCrop} {buyer.requiredVariety ? `(${buyer.requiredVariety})` : ''}
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-200/60">
              <span className="text-[#68736B]">Volume Required:</span>
              <strong className="text-[#245C3A]">
                {buyer.requiredQuantityKg.toLocaleString('en-IN')} kg
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-200/60">
              <span className="text-[#68736B]">Indicative Spot Rate:</span>
              <strong className="text-base font-black text-[#245C3A]">
                ₹{buyer.offeredPrice}/kg
              </strong>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#68736B]">Payment Terms:</span>
              <span className="font-semibold text-[#26332B]">{buyer.paymentTerms}</span>
            </div>
          </div>

          {/* Transparent Match Factors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#245C3A] mb-2">
              Why this Buyer Matches Your Farm ({buyer.matchScore}% Score)
            </h4>
            <div className="space-y-1.5">
              {buyer.matchFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#26332B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5F8F45] shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-[#EEF3E8] bg-white flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              onContactBuyer(buyer);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] text-[#245C3A] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#5F8F45]" />
            <span>Contact Desk</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onMakeOffer(buyer);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
          >
            <span>Make Offer (₹{buyer.offeredPrice}/kg)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
