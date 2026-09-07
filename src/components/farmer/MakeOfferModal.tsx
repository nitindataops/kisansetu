import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Scale,
  DollarSign,
  CheckCircle2,
  Truck,
  Sparkles,
} from 'lucide-react';
import { BuyerMatch, CropListing } from '../../types/farmer';

interface MakeOfferModalProps {
  buyer: BuyerMatch | null;
  crops: CropListing[];
  onClose: () => void;
  onSubmitOffer: (data: {
    buyerId: string;
    cropName: string;
    quantityKg: number;
    offeredRate: number;
    deliveryType: string;
  }) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  buyer,
  crops,
  onClose,
  onSubmitOffer,
}) => {
  if (!buyer) return null;

  const initialCrop =
    crops.find((c) => c.name.toLowerCase().includes(buyer.requiredCrop.toLowerCase())) ||
    crops[0];

  const [selectedCropName, setSelectedCropName] = useState(initialCrop?.name || 'Wheat');
  const [quantityKg, setQuantityKg] = useState(
    Math.min(buyer.requiredQuantityKg, initialCrop?.quantityKg || 1500).toString()
  );
  const [offeredRate, setOfferedRate] = useState(buyer.offeredPrice.toString());
  const [deliveryType, setDeliveryType] = useState('Farm Gate Pickup (Buyer Vehicle)');
  const [isSuccess, setIsSuccess] = useState(false);

  const totalCalculated = (parseFloat(quantityKg) || 0) * (parseFloat(offeredRate) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOffer({
      buyerId: buyer.id,
      cropName: selectedCropName,
      quantityKg: parseFloat(quantityKg) || 1000,
      offeredRate: parseFloat(offeredRate) || 25,
      deliveryType,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EEF3E8] overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#245C3A] to-[#1A3D27] text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-[#D6A63A] tracking-wider block">
              Direct Trade Proposal
            </span>
            <h3 className="text-lg font-bold font-serif">Submit Offer to {buyer.name}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {isSuccess ? (
            <div className="p-8 rounded-2xl bg-[#EEF3E8] text-center space-y-3 animate-in fade-in-50">
              <CheckCircle2 className="w-12 h-12 text-[#5F8F45] mx-auto" />
              <h4 className="text-base font-bold text-[#245C3A]">Offer Submitted Successfully!</h4>
              <p className="text-xs text-[#68736B]">
                Your offer of ₹{offeredRate}/kg for {quantityKg} kg has been routed to {buyer.name}'s
                procurement desk. You will receive an SMS confirmation once accepted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#26332B] mb-1">
                  Select Crop from Your Listed Harvest
                </label>
                <select
                  value={selectedCropName}
                  onChange={(e) => setSelectedCropName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FBFAF4] text-xs font-bold text-[#26332B] focus:border-[#5F8F45] focus:outline-hidden"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.variety}) — {c.quantityKg.toLocaleString('en-IN')} kg available
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#26332B] mb-1">
                    Lot Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FBFAF4] text-sm text-[#26332B] font-bold focus:border-[#5F8F45] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8C6212] mb-1">
                    Your Offered Rate (₹/kg) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={offeredRate}
                    onChange={(e) => setOfferedRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6A63A] bg-[#FBFAF4] text-sm text-[#26332B] font-black focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332B] mb-1">
                  Fulfillment & Logistics Method
                </label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FBFAF4] text-xs font-medium text-[#26332B] focus:border-[#5F8F45] focus:outline-hidden"
                >
                  <option value="Farm Gate Pickup (Buyer Vehicle)">
                    Farm Gate Pickup (Buyer arranges transport from your village)
                  </option>
                  <option value="Farmer Self-Delivery to Buyer Mandi Hub">
                    Farmer Self-Delivery to Buyer Mandi Hub ({buyer.location})
                  </option>
                </select>
              </div>

              {/* Total Calculation Callout */}
              <div className="p-4 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/30 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#68736B] block">Total Deal Escrow Value:</span>
                  <span className="text-xs text-[#5F8F45] font-bold">✓ 100% Payout Guaranteed</span>
                </div>
                <div className="text-2xl font-black font-serif text-[#245C3A]">
                  ₹{totalCalculated.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEF3E8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#68736B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors shadow-md"
                >
                  Send Official Proposal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
