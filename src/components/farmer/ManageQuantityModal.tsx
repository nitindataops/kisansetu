import React, { useState, useEffect } from 'react';
import { X, Scale, CheckCircle2 } from 'lucide-react';
import { CropListing } from '../../types/farmer';
import { LanguageCode } from '../../types';

interface ManageQuantityModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (cropId: string, newQuantityKg: number) => void;
  currentLanguage: LanguageCode;
}

export const ManageQuantityModal: React.FC<ManageQuantityModalProps> = ({
  crop,
  isOpen,
  onClose,
  onUpdateQuantity,
  currentLanguage,
}) => {
  const isHi = currentLanguage === 'hi';
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (crop) {
      setQuantity(crop.quantityKg.toString());
    }
  }, [crop, isOpen]);

  if (!isOpen || !crop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(quantity);
    if (parsed && parsed > 0) {
      onUpdateQuantity(crop.id, parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#EEF3E8] animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8] mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#245C3A]" />
            <h3 className="font-bold text-base font-serif text-[#26332B]">
              {isHi ? 'उपलब्ध फसल मात्रा बदलें' : 'Manage Available Lot Quantity'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-xs text-[#68736B] block mb-1">
              {isHi ? 'फसल:' : 'Crop:'} <b>{crop.name}</b> ({crop.variety})
            </span>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              {isHi ? 'नई उपलब्ध मात्रा (किलोग्राम)' : 'New Available Quantity (kg)'} *
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FBFAF4] text-sm font-bold text-[#26332B] focus:border-[#245C3A] focus:outline-hidden"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#68736B] font-bold">
                kg ({(parseFloat(quantity) / 100 || 0).toFixed(1)} {isHi ? 'क्विंटल' : 'Qtl'})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEF3E8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-[#68736B]"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#245C3A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D6A63A]" />
              <span>{isHi ? 'मात्रा अपडेट करें' : 'Update Quantity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
