import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Save,
  Tag,
  Calendar,
  Layers
} from 'lucide-react';
import { BuyerProfile } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerProfileViewProps {
  profile: BuyerProfile;
  onUpdateProfile: (updated: Partial<BuyerProfile>) => void;
  currentLanguage: LanguageCode;
}

export const BuyerProfileView: React.FC<BuyerProfileViewProps> = ({
  profile,
  onUpdateProfile,
  currentLanguage,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [businessName, setBusinessName] = useState(profile?.businessName || '');
  const [businessType, setBusinessType] = useState(profile?.businessType || 'Wholesaler / Trader');
  const [phone, setPhone] = useState(profile?.mobile || (profile as any)?.phone || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.deliveryAddress || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [state, setState] = useState(profile?.state || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [saveAlert, setSaveAlert] = useState(false);

  // Sync state if profile prop changes
  React.useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBusinessName(profile.businessName || '');
      setBusinessType(profile.businessType || 'Wholesaler / Trader');
      setPhone(profile.mobile || (profile as any)?.phone || '');
      setEmail(profile.email || '');
      setDeliveryAddress(profile.deliveryAddress || '');
      setDistrict(profile.district || '');
      setState(profile.state || '');
      setPincode(profile.pincode || '');
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      businessName,
      businessType: businessType as any,
      mobile: phone,
      email,
      deliveryAddress,
      district,
      state,
      pincode,
      location: `${district || profile?.district || ''}, ${state || profile?.state || ''}`.replace(/^,\s*|,\s*$/g, ''),
    });
    setIsEditing(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  const initialLetter = profile?.name?.trim() ? profile.name.trim().charAt(0).toUpperCase() : 'B';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-[#E3DCB] p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#245C3A] text-white flex items-center justify-center text-2xl font-black shadow-md">
              {initialLetter}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#26332B]">{profile?.name || ''}</h2>
                {profile?.id && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#D5DDD2] text-[#48534C]">
                    ID: {profile.id}
                  </span>
                )}
                {profile?.verified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3E8] text-[#245C3A] text-xs font-bold flex items-center gap-1 border border-[#5F8F45]/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                    <span>{t.profile.verifiedBadge}</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#5F8F45] mt-0.5">
                {profile?.businessName || ''}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#68736B] flex-wrap mt-1">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#245C3A]" />
                    <span>{profile.location}</span>
                  </span>
                )}
                {profile?.memberSince && (
                  <span className="flex items-center gap-1 text-[#8D9B91]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isHi ? `सदस्य: ${profile.memberSince}` : `Member since: ${profile.memberSince}`}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] hover:bg-[#EEF3E8] text-xs font-bold text-[#245C3A] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? (isHi ? 'संपादन रद्द करें' : 'Cancel Editing') : t.profile.editBtn}</span>
          </button>
        </div>

        {saveAlert && (
          <div className="mt-4 p-3 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/30 text-[#245C3A] text-xs font-bold text-center animate-in fade-in duration-200">
            ✓ {isHi ? 'व्यापार प्रोफ़ाइल विवरण सफलतापूर्वक सहेजा गया।' : 'Business profile details updated successfully.'}
          </div>
        )}

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#48534C] block mb-1">{t.profile.contactPerson}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{t.profile.businessName}</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{t.profile.businessType}</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{t.profile.mobile}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{t.profile.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{t.profile.deliveryHub}</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{isHi ? 'ज़िला (District)' : 'District'}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#48534C] block mb-1">{isHi ? 'राज्य एवं पिनकोड (State & Pincode)' : 'State & Pincode'}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!isEditing}
                  placeholder="State"
                  className="flex-1 p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium"
                />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Pincode"
                  className="w-28 p-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl disabled:bg-gray-50 text-xs font-medium font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preferred Procurement Crops */}
          {profile?.preferredCrops && profile.preferredCrops.length > 0 && (
            <div className="pt-3 border-t border-[#F0EBE1]">
              <label className="font-bold text-[#48534C] block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#245C3A]" />
                <span>{isHi ? 'पसंदीदा फसलें (Preferred Crops for Procurement)' : 'Preferred Procurement Crops'}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {profile.preferredCrops.map((crop) => (
                  <span
                    key={crop}
                    className="px-2.5 py-1 rounded-lg bg-[#EEF3E8] border border-[#5F8F45]/30 text-[#245C3A] font-bold text-[11px]"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Masked Compliance Badges */}
          <div className="pt-4 border-t border-[#F0EBE1] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] flex items-center justify-between">
              <span className="text-[#68736B]">{t.profile.gstin}:</span>
              <strong className="font-mono text-[#26332B]">{profile?.gstinMasked || (isHi ? 'उपलब्ध नहीं' : 'Not Provided')}</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] flex items-center justify-between">
              <span className="text-[#68736B]">{t.profile.pan}:</span>
              <strong className="font-mono text-[#26332B]">{profile?.panMasked || (isHi ? 'उपलब्ध नहीं' : 'Not Provided')}</strong>
            </div>
          </div>

          {isEditing && (
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.profile.saveBtn}</span>
              </button>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};
